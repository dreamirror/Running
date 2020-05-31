
var ActorBase = require("ActorBase");
var FSMUtil = require("FSMUtil");
var FSMMgr = require("FSMMgr");
/* 状态机相关 */
var SwordNormalState = require("SwordNormalState");
var SwordAttackState = require("SwordAttackState");
var TestWeaponState = require("TestWeaponState");
var TestWeaponAttack = require("TestWeaponAttack");
var FlyWeaNormalState = require("FlyWeaNormalState");
var FlyWeaAttState = require("FlyWeaAttState");
var ThunderNormalState = require("ThunderNormalState");
var ThunderAttackState = require("ThunderAttackState");


var FlashNormalState = require("FlashNormalState");
var FlashAttackState = require("FlashAttackState");

var FlySwordNormalST = require("FlySwordNormalST");
var FlySwordAttackST = require("FlySwordAttackST");

//月牙
var YytcNormalST = require("YytcNormalSate");
var YytcAttackST = require("YytcAttackState");

/* */
var GravityManager = require("GravityManager");
var FunctionLibrary = require("FunctionLibrary");
var CommonUtil = require("CommonUtil");
var GameManager = require("GameManager");

const EventName = require("GlobalEventName");

/* 道具 */
var ItemBase = require("ItemBase"); 

/* 玩家数据类 */
var PlayerInfo = cc.Class({
    ctor : function(){

    },
    properties: {
        /* 当前装备的武器ID */ 
        CurEquipWeaponID : null,
    },

    /* 初始化玩家类并且定义 */
    InitPlayerInfo : function (){
        //玩家身上所有道具的List ， Key为道具ID，
        this.ItemList = new Map();
    },
});

/*
    玩家类，可以响应触摸向上跳，拥有一个方块的碰撞体等
    4.27 将手部状态机放于Player上控制，手部状态机能否响应触摸等，依赖于对应的State是否向其传递
*/
var Player = cc.Class({
    extends :ActorBase,

    properties: {

        /* 右手武器组件 */ 
        RightArm : {
            default : null,
            type : cc.Node,
        },

        /* RightArm 的FSM */
        RightArmFSMMgr : {
            default : null,
            type : cc.Component,
        },
        BodyActor : {
            default : null,
            type : cc.Node,
        },
        UperActor : {
            default : null,
            type : cc.Node,
        },
        HP : {
            default : 2,
            override: true
        },

        /* 自身配置数据 */
        PlayerConfig : null,

        //自身状态机
        FSMMgr : null,
    },

    onLoad () {  
        this.node.name = "Player";
    },

    onDestroy(){
        EventCenter.off(EventName.TouchItem,this.OnTouchItemBtn , this);
        EventCenter.off(EventName.GetItem , this.OnGetWeapon , this);
        EventCenter.off(EventName.OnWeaponClear, this.OnWeaponClear , this);
        EventCenter.off(EventName.GetBuff , this.OnGetBuffs , this);
    },

    start () {
        this._super();
        //this.InitVariable();
        this.InitFSM();

        //初始化玩家数据
        this.PlayerInfo = new PlayerInfo();
        this.PlayerInfo.InitPlayerInfo();

        //添加一个碰撞后的反馈函数，用来判断是否死亡之类的
        this.AddCollisionStartCall( this.PlayerCollisionCall , this , null);

        //添加一个点击武器的回调
        EventCenter.on(EventName.TouchItem,this.OnTouchItemBtn , this);
        //添加一个捡起武器的回调，如果当前装备了武器，则永远只会使武器是第一个武器
        EventCenter.on(EventName.GetItem , this.OnGetWeapon , this);
        //添加一个武器用完的回调，切换回第一个武器
        EventCenter.on(EventName.OnWeaponClear, this.OnWeaponClear , this);

        EventCenter.on(EventName.GetBuff , this.OnGetBuffs , this);
        this.randomItemConfig = {};

        var self = this;
        //初始化随机道具表
        cc.loader.loadRes("Config/RandomItemConfig",function(err,obj){
            if(err)
            {
                cc.log(err)
                return;
            }

            self.randomItemConfig = obj.json;

        })
    },

    update (dt) {
        //this.InitFSM();
        
        if(this.RightArmFSMMgr)
        {
            this.RightArmFSMMgr.Update(dt);
        }

        var GameData = cc.find("GameContainer").getComponent("GameData");
        //更新检测护盾的效果
        if (this.needCheckShield) {
            if (GameData && GameData.checkPlayerShield() == false) {
                this.removeShieldEffect();
            }
        }

         //更新检测磁铁的效果
        if (this.needCheckMagnet) {
            if (GameData && GameData.checkPlayerMagnet() == false) {
                this.removeMegnetEffect();
            }
        }

        //更新
        if (this.needCheckShadow) {
            if (GameData && GameData.checkPlayerShadow() == false) {
                this.removeShadowDebuff();
            }
        }

        //检测风筝的效果
        if (this.needCheckKite) {
            if (GameData && GameData.checkPlayerKite() == false) {
                this.removeKiteEffect();
            }
        }
        //检测御剑
        if (this.needCheckSwordRush) {
            if (GameData && GameData.checkSwordRush() == false) {
                this.removeSwordRushEffect();
            }
        }
    },

    /****************** 需要对行走动画做处理  */
    PlayerRunAnima : function (){
        if( this.BodyActor ){
            var BodyJS = this.BodyActor.getComponent("ActorBase");
            if(BodyJS != null && BodyJS != undefined){
                BodyJS.PlayAnimation("LiuRun");
            }
        }
        if( this.UperActor ){
            var UperJS = this.UperActor.getComponent("ActorBase");
            if(UperJS != null && UperJS != undefined){
                UperJS.PlayAnimation("LiuRunUper");
            }
        }
    },

    PlayerJumpAnima : function() {
        if( this.BodyActor ){
            var BodyJS = this.BodyActor.getComponent("ActorBase");
            if(BodyJS != null && BodyJS != undefined){
                BodyJS.PlayAnimation("LiJump");
            }
        }
        if( this.UperActor ){
            var UperJS = this.UperActor.getComponent("ActorBase");
            if(UperJS != null && UperJS != undefined){
                UperJS.PlayAnimation("LiJumpUper");
            }
        }
        /*if(this.RightArm){
            var RightArmJS = this.RightArm.getComponent("RightArm");
            if(RightArmJS != null && RightArmJS != undefined){
                RightArmJS.PlayAnimation("LiJumpHand");
            }
        }*/
    },

    PlayFlyAnima : function() {
        if( this.BodyActor ){
            var BodyJS = this.BodyActor.getComponent("ActorBase");
            if(BodyJS != null && BodyJS != undefined){
                BodyJS.PlayAnimation("LiFly");
            }
        }
        if( this.UperActor ){
            var UperJS = this.UperActor.getComponent("ActorBase");
            if(UperJS != null && UperJS != undefined){
                UperJS.PlayAnimation("LiEmpty");
            }
        }
    },

    PlayFallAnima : function( InAnimName ) {
        if( this.BodyActor ){
            var BodyJS = this.BodyActor.getComponent("ActorBase");
            if(BodyJS != null && BodyJS != undefined){
                BodyJS.PlayAnimation("LiuFall");
            }
        }
        if( this.UperActor ){
            var UperJS = this.UperActor.getComponent("ActorBase");
            if(UperJS != null && UperJS != undefined){
                UperJS.PlayAnimation("LiFallUper");
            }
        }
    },
    //御剑
    PlaySwordRushAnima : function() {
        if( this.BodyActor ){
            var BodyJS = this.BodyActor.getComponent("ActorBase");
            if(BodyJS != null && BodyJS != undefined){
                BodyJS.PlayAnimation("LiYujian");
            }
        }
        if( this.UperActor ){
            var UperJS = this.UperActor.getComponent("ActorBase");
            if(UperJS != null && UperJS != undefined){
                UperJS.PlayAnimation("LiEmpty");
            }
        }
    },

    //切换到冲刺状态
    PlayerSetRush : function(){
        if(this.FSMMgr != null){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.RUSH, null, null);
        }
    },

    //结束冲刺状态 
    PlayerFinishRush : function(){
        if(this.FSMMgr != null){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.RUN, null, null);
        }
    },

    //播放冲刺动画
    PlayerRush : function() {
        this.BodyActor.getComponent("ActorBase").PlayAnimation("LiRush");
    },


    InitFSM : function(){
        //4.26 再创建一个用来管理手部的状态机
        this.RightArmFSMMgr = new FSMMgr();
        
        if ( this.RightArmFSMMgr && this.RightArm )
        {
            this.RightArmFSMMgr.InitVariable();

            //初始化的时候，都是默认的武器和一个默认的手，具体攻击时对应哪个，让RightArmRunState去根据配置调用对应的状态了
            var DefaultWeaponState = new TestWeaponState();
            DefaultWeaponState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmDefaultWeapon);
            DefaultWeaponState.AddCondition(FSMUtil.TransConditionID.DefaultWeaponToAtt , FSMUtil.FSMStateID.ArmDefaultWeaponAtt);         
            
            var DefaultWeaponAttack = new TestWeaponAttack();
            DefaultWeaponAttack.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmDefaultWeaponAtt);
            DefaultWeaponAttack.AddCondition(FSMUtil.TransConditionID.DefaultWeaponAttToNormal , FSMUtil.FSMStateID.ArmDefaultWeapon);         

            /* 剑的状态机，可以在获取道具之后再注册，不过还是这里注册方便点，不需要一直加减删除 */ 
            var WeaponSwordNormalState = new SwordNormalState();
            WeaponSwordNormalState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmSwordNoraml);
            WeaponSwordNormalState.AddCondition(FSMUtil.TransConditionID.SwordNormalToAtt , FSMUtil.FSMStateID.ArmSwordAttack);         
            
            var WeaponSwordAttackState = new SwordAttackState();
            WeaponSwordAttackState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmSwordAttack);
            WeaponSwordAttackState.AddCondition(FSMUtil.TransConditionID.SwordAttToNormal , FSMUtil.FSMStateID.ArmSwordNoraml);         

            /** 添加 飞镖的状态机 */
            var WeaponFlyWeaponState = new FlyWeaNormalState();
            WeaponFlyWeaponState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmDartNormal);
            WeaponFlyWeaponState.AddCondition(FSMUtil.TransConditionID.DartNormalToAtt , FSMUtil.FSMStateID.ArmDartAttack);     

            var WeaponFlyWeaAttState = new FlyWeaAttState();
            WeaponFlyWeaAttState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmDartAttack);
            WeaponFlyWeaAttState.AddCondition(FSMUtil.TransConditionID.DartAttToNormal , FSMUtil.FSMStateID.ArmDartNormal);     

            /*添加 雷电的状态机 */
            var ThunderWeNormalState = new ThunderNormalState();
            ThunderWeNormalState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmDartNormal);
            
            var ThunderWeAttackState = new ThunderAttackState();
            ThunderWeAttackState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmDartNormal);

              /*添加 衝刺的状态机 */
              var FlashWeNormalState = new FlashNormalState();
              FlashWeNormalState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmDartNormal);
              
              var FlashWeAttackState = new FlashAttackState();
              FlashWeAttackState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmDartNormal);

              

            //月牙的状态机
            var YytcWeAttackState = new YytcAttackST();
            YytcWeAttackState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmYytcAttack);
            YytcWeAttackState.AddCondition(FSMUtil.TransConditionID.YytcAttToNor , FSMUtil.FSMStateID.ArmYytcNormal);     

            var YytcWeNormalState = new YytcNormalST();
            YytcWeNormalState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.ArmYytcNormal);
            YytcWeNormalState.AddCondition(FSMUtil.TransConditionID.YytcNormalToAtt , FSMUtil.FSMStateID.ArmYytcAttack);     

            
            /*添加 飞剑的状态机 */
            var FlySwordNormalState = new FlySwordNormalST();
            FlySwordNormalState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.FlySwordNormalTag);
            var FlySwordAttState = new FlySwordAttackST();
            FlySwordAttState.InitVariable(this.RightArmFSMMgr , this.RightArm , FSMUtil.FSMStateID.FlySwordAttackTag);
            
            this.RightArmFSMMgr.Init( FSMUtil.FSMStateID.ArmDefaultWeapon , DefaultWeaponState);
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmDefaultWeaponAtt, DefaultWeaponAttack );
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmSwordNoraml, WeaponSwordNormalState );    //注册剑的普通状态
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmSwordAttack, WeaponSwordAttackState );    //注册剑的攻击状态
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmDartNormal, WeaponFlyWeaponState );    //注册dart的普通状态
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmDartAttack, WeaponFlyWeaAttState );  

            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmThunderNormal, ThunderWeNormalState );    
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmThunderAttack, ThunderWeAttackState );
            
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmFlashNormal, FlashWeNormalState );    
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmFlashAttack, FlashWeAttackState ); 
            
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.FlySwordNormalTag, FlySwordNormalState );    
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.FlySwordAttackTag, FlySwordAttState )

            this.RightArmFSMMgr.AddState(FSMUtil.FSMStateID.ArmYytcNormal, YytcWeNormalState);
            this.RightArmFSMMgr.AddState(FSMUtil.FSMStateID.ArmYytcAttack, YytcWeAttackState);

            cc.log( "RightArmFSMMgr Init!" );

            this.RightArmJS = this.RightArm.getComponent("RightArm");
            this.RightArmJS.PlayerJS = this;
            this.RightArmJS.SetFSM(this.RightArmFSMMgr);
        }
        else
        {
            cc.log( "RightArmFSMMgr is null!!!!" );
        }
    },

    ReBorn : function (){
        this.HP = 2;
    },

    /**
     * 碰撞回调
     */
    PlayerCollisionCall : function(other, self , Target , Param){
        var CollisionType = FunctionLibrary.GetCollisionType(other);
        
        //如果有护盾。碰啥都死不了
        var GameData = cc.find("GameContainer").getComponent("GameData");
        if (GameData && (GameData.checkPlayerShield() || GameData.checkSwordRush())) {
            return;
        }

        //如果撞到障碍物
        if(CollisionType == CommonUtil.EObjType.TYPE_BARRIER)
        {
            //if(Target.OnAttackHP() == false)
                //Target.ActorDead();
        }

        //如果被敌人攻击
        if (CollisionType == CommonUtil.EObjType.TYPE_ENEMY){
            if(Target.OnAttackHP() == false)
                Target.ActorDead();
            
        }
    },

    //判断自身血量 5.28 
    OnAttackHP : function(){
        //再播放个出血粒子

        this.HP --;
        return this.HP >= 1;
    },

    /* 切换武器 */
    ChangeWeapon : function ( InID){
        this.RightArm.getComponent("RightArm").ChangeWeapon( InID);

        //this.playerFlash();
    },

    /**
     * 点击武器按钮的回调 5.11 修改为一旦点击某一个武器，就去取玩家身上的武器数据的第一个武器
     */
    OnTouchItemBtn: function (InData)
    {
        if(this.RightArm && this.RightArm.getComponent("RightArm")){

            var GameData = cc.find("GameContainer").getComponent("GameData");
            var Weapons = GameData.getTempInfo().weapons;

            this.RightArm.getComponent("RightArm").ChangeWeapon( Weapons[0].ID);// InData.ID);
            /* 切换完毕后重新设置手臂位置 */
            this.RightArm.setPosition(this.PlayerConfig.RightArmPos[0],this.PlayerConfig.RightArmPos[1]);
            this.CurEquipWeaponID = Weapons[0].ID;
        };
    },
    /**
     * 捡到场景中的武器
     */
    OnGetWeapon : function ( InData){
        //如果当前是初始武器，不更改
        if( this.CurEquipWeaponID == this.PlayerConfig.DefaultWeaponID ){
            return;
        }      

        if ( this.CurEquipWeaponID == null || this.CurEquipWeaponID == undefined){
            return;
        }

        var GameData = cc.find("GameContainer").getComponent("GameData");
        var Weapons = GameData.getTempInfo().weapons;
        if ( this.CurEquipWeaponID != Weapons[0].ID){
            if(this.RightArm && this.RightArm.getComponent("RightArm")){
                this.RightArm.getComponent("RightArm").ChangeWeapon( Weapons[0].ID);// InData.ID);
                /* 切换完毕后重新设置手臂位置 */
                this.RightArm.setPosition(this.PlayerConfig.RightArmPos[0],this.PlayerConfig.RightArmPos[1]);
                this.CurEquipWeaponID = Weapons[0].ID;
            };
        }
    },

    /**
     * 获得buFF 
     */
    OnGetBuffs: function(){
        var GameData = cc.find("GameContainer").getComponent("GameData");
        if (GameData && GameData.checkPlayerShield() == true) {
            this.addShieldEffect();
        }
        if (GameData && GameData.checkPlayerMagnet() == true) {
            this.addMagnetEffect();
        }
        if(GameData && GameData.checkPlayerShadow() == true)
        {
            this.addShadowDebuff();
        }
        if(GameData && GameData.checkPlayerKite() == true)
        {
            this.addKiteEffect();
        }
        if (GameData && GameData.checkSwordRush() == true) {
            this.addSwordRushEffect();
        }

        if(GameData && GameData.checkBuff("randomItem") == true)
        {
            this.addRandomBuff();
        }
        
    },
    /**
     * 武器次数用完了回调
     */
    OnWeaponClear : function( ){
        if ( this.CurEquipWeaponID == null || this.CurEquipWeaponID == undefined){
            return;
        }
        var GameData = cc.find("GameContainer").getComponent("GameData");
        var Weapons = GameData.getTempInfo().weapons;
        if (Weapons.length > 0){
            if(this.CurEquipWeaponID != Weapons[0].ID){
                if(this.RightArm && this.RightArm.getComponent("RightArm")){
                    this.RightArm.getComponent("RightArm").ChangeWeapon( Weapons[0].ID);// InData.ID);
                    /* 切换完毕后重新设置手臂位置 */
                    this.RightArm.setPosition(this.PlayerConfig.RightArmPos[0],this.PlayerConfig.RightArmPos[1]);
                    this.CurEquipWeaponID = Weapons[0].ID;
                };
            }
        }
        else{
            this.RightArm.getComponent("RightArm").ChangeWeapon(this.PlayerConfig.DefaultWeaponID);
            this.CurEquipWeaponID = this.PlayerConfig.DefaultWeaponID;
        }
    },
    
    ActorDead : function (){
        //取消重力注册   5.14 修改为重新设置位置
        //if(GravityManager._instance){
        //    GravityManager._instance.UnRigisterToGravity(this);
        //}  
        this.AYSpeed = 0;

        EventCenter.emit(EventName.PlayerDead,this);

        var GameManager = cc.find("GameContainer").getComponent("GameManager");
        if(GameManager){
            GameManager.GameOver();
        } 
    },

    //护盾的效果
    addShieldEffect : function () {
        this.needCheckShield = true;
        let self = this;
        cc.loader.loadRes('Texture/shield', cc.SpriteFrame,function(err,spriteFrame){
            if (err) {
                cc.log(err)
                return
            }
            
            //创建一个新的节点，因为cc.Sprite是组件不能直接挂载到节点上，只能添加到为节点的一个组件
            var node = new cc.Node('EffectNodeShield');
            node.setAnchorPoint(0.5,0);
            const sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            self.node.addChild(node);
            node.setPosition(0,-20);
        });
    },

    //获得遮罩Debuff
    addShadowDebuff: function(){
        let self = this;
        this.needCheckShadow = true;
        cc.loader.loadRes('Texture/Effect/shadow', cc.SpriteFrame,function(err,spriteFrame){
            if (err) {
                cc.log(err)
                return
            }
            
            //创建一个新的节点，因为cc.Sprite是组件不能直接挂载到节点上，只能添加到为节点的一个组件
            var node = new cc.Node('EffectNodeShield');
            node.setAnchorPoint(0.5,0);
            const sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            cc.find("Canvas/GameScene").addChild(node)
            self.shadow = node;
            node.setPosition(0,-20);
        });
    },

    //移除遮罩的效果
    removeShadowDebuff(){
        this.needCheckShadow = false;
        if(this.shadow)
        {
            this.shadow.removeFromParent();
        }

    },

    removeShieldEffect : function () {
        this.needCheckShield = false;
        let effnode = this.node.getChildByName("EffectNodeShield");
        if(effnode) {
            effnode.removeFromParent();
            effnode.destroy();
        }
    },

    //磁铁的效果
    addMagnetEffect : function () {
        this.needCheckMagnet = true;
        let self = this;
        cc.loader.loadRes('Texture/magnet', cc.SpriteFrame,function(err,spriteFrame){
            if (err) {
                cc.log(err)
                return
            }
            
            //创建一个新的节点，因为cc.Sprite是组件不能直接挂载到节点上，只能添加到为节点的一个组件
            var node = new cc.Node('EffectNodeMagnet');
            node.setAnchorPoint(0.5,0);
            const sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            self.node.addChild(node);
            node.setPosition((node.x + 10),(node.y + 70));
        });
    },

    removeMegnetEffect : function () {
        this.needCheckMagnet = false;
        let effnode = this.node.getChildByName("EffectNodeMagnet");
        if(effnode) {
            effnode.removeFromParent();
            effnode.destroy();
        }
    },

    //风筝效果
    addKiteEffect : function() {
        
        this.needCheckKite = true;
        this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.FlypyBird, null, this);
    },
    //在此切换玩家状态为下落
    removeKiteEffect : function (){
        this.needCheckKite = false;
        //this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.FALL, null, this);
        //GravityManager._instance.CancleConstantGravity(this);
        this.FSMMgr.TransState(FSMUtil.TransConditionID.FlyToFall, null, this);
    },

    //御剑
    addSwordRushEffect(){
        this.needCheckSwordRush = true;
        this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.SwordRush, null, this);

    },
    removeSwordRushEffect(){
        this.needCheckSwordRush = false;
        this.FSMMgr.TransState(FSMUtil.TransConditionID.FlyToFall, null, this);
    },

    random4 : function (n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    },
    //获得随机Buff
    addRandomBuff(){
        if(this.randomItemConfig)
        {
            var resultData;
            var totalWight = 0
            for(var index in this.randomItemConfig)
            {
                var data = this.randomItemConfig[index]
                if(data)
                {
                    totalWight += data.weight;
                }
            }

            var resultWeight = this.random4(0,totalWight)
            for(var index in this.randomItemConfig)
            {
                var data = this.randomItemConfig[index]
                if(data)
                {
                    if(resultWeight <data.weight)
                    {
                        resultData = data;
                    }

                }
            }

            var GameData = cc.find("GameContainer").getComponent("GameData");
            //判断随机buff的种类
            cc.log("随机道具 id =="+data.id)
            data.id = "shadow"
            if(data.id == "clearWeapon")
            {
                GameData.clearAllWeapon();
            }else if(data.id == "shadow")
            {
                let item = new ItemBase();
                item.init("shadow","shadow",null,EItemType.BUFF);
                GameData.useItem(item);
            }else if(data.id == "yytc")
            {  
                 let item = new ItemBase();
                item.init("yytc","yytc",null,EItemType.Weapon);
                GameData.addOrReplaceWeapon(item);

            }
        }

    },

    //冲刺的效果
    //dis冲刺长度
    //冲刺时间
    playerFlash:function(dis,time){
        cc.log("冲刺")
        if(this.originPos == null)
        {
            this.originPos = this.node.getPosition();
        }
        var GameSpeed = cc.find("Canvas/GameScene/BackGround").getComponent("GameScene").updateSpeed;
        var originPos = this.originPos;
        let action = cc.moveTo(time, this.node.getPosition().x + dis, this.node.getPosition().y)
        this.node.runAction(action);
        var originSpeed = GameSpeed
        var self = this;
        let callBack = function(){
            cc.log("冲刺结束")
            cc.find("Canvas/GameScene/BackGround").getComponent("GameScene").changeSpeed(0.8);
            var call2 = function(){ cc.find("Canvas/GameScene/BackGround").getComponent("GameScene").resetSpeed()};
            let action = cc.moveTo(0.5,originPos.x, originPos.y)
            self.node.runAction(cc.sequence(action,cc.callFunc(call2)));
            
            //结束冲刺状态
            self.PlayerFinishRush();
        }

        this.node.runAction(cc.sequence(action,cc.callFunc(callBack)))
    },
});

module.exports = Player;