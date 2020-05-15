
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

        /* 自身配置数据 */
        PlayerConfig : null,
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
             
        //this.TestScriptAddWeapon();

        //模拟重力的系统需要添加一个
        //if(this.BUseGravity && GravityManager._instance){
        //    GravityManager._instance.RigisterToGravity(this , this.UpdateGravity);
        //}  

        //添加一个碰撞后的反馈函数，用来判断是否死亡之类的
        this.AddCollisionStartCall( this.PlayerCollisionCall , this , null);

        //添加一个点击武器的回调
        EventCenter.on(EventName.TouchItem,this.OnTouchItemBtn , this);
        //添加一个捡起武器的回调，如果当前装备了武器，则永远只会使武器是第一个武器
        EventCenter.on(EventName.GetItem , this.OnGetWeapon , this);
        //添加一个武器用完的回调，切换回第一个武器
        EventCenter.on(EventName.OnWeaponClear, this.OnWeaponClear , this);

        EventCenter.on(EventName.GetBuff , this.OnGetBuffs , this);
    },

    update (dt) {
        //this.InitFSM();
        
        if(this.RightArmFSMMgr)
        {
            this.RightArmFSMMgr.Update(dt);
        }

        //更新检测护盾的效果
        if (this.needCheckShield) {
            var GameData = cc.find("GameContainer").getComponent("GameData");
            if (GameData && GameData.checkPlayerShield() == false) {
                this.removeShieldEffect();
            }
        }

         //更新检测磁铁的效果
        if (this.needCheckMagnet) {
            var GameData = cc.find("GameContainer").getComponent("GameData");
            if (GameData && GameData.checkPlayerMagnet() == false) {
                this.removeMegnetEffect();
            }
        }
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


            this.RightArmFSMMgr.Init( FSMUtil.FSMStateID.ArmDefaultWeapon , DefaultWeaponState);
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmDefaultWeaponAtt, DefaultWeaponAttack );
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmSwordNoraml, WeaponSwordNormalState );    //注册剑的普通状态
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmSwordAttack, WeaponSwordAttackState );    //注册剑的攻击状态
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmDartNormal, WeaponFlyWeaponState );    //注册剑的普通状态
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmDartAttack, WeaponFlyWeaAttState );    //注册剑的攻击状态          

            DefaultWeaponState.BeforeEnter();

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

    /**
     * 碰撞回调
     */
    PlayerCollisionCall : function(other, self , Target , Param){
        var CollisionType = FunctionLibrary.GetCollisionType(other);
        
        //如果有护盾。碰啥都死不了
        var GameData = cc.find("GameContainer").getComponent("GameData");
        if (GameData && GameData.checkPlayerShield()) {
            return;
        }

        //如果撞到障碍物，直接死了
        if(CollisionType == CommonUtil.EObjType.TYPE_BARRIER)
        {
            //Target.ActorDead();
        }

        //如果被敌人攻击，直接死
        if (CollisionType == CommonUtil.EObjType.TYPE_ENEMY){
            //Target.ActorDead();
            
        }
    },

    /* 切换武器 */
    ChangeWeapon : function ( InID){
        this.RightArm.getComponent("RightArm").ChangeWeapon( InID);
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

        });
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
            node.setPosition((node.x + 10),(node.y + 95));

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
});

module.exports = Player;