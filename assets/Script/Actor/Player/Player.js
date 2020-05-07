
var ActorBase = require("ActorBase");
var FSMUtil = require("FSMUtil");
var FSMMgr = require("FSMMgr");
/* 状态机相关 */
var SwordNormalState = require("SwordNormalState");
var SwordAttackState = require("SwordAttackState");
var TestWeaponState = require("TestWeaponState");
var TestWeaponAttack = require("TestWeaponAttack");
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
    },

    onDestroy(){
        EventCenter.off(EventName.TouchItem,this.OnTouchItemBtn , this);
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
    },

    update (dt) {
        //this.InitFSM();
        
        if(this.RightArmFSMMgr)
        {
            this.RightArmFSMMgr.Update(dt);
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
            DefaultWeaponState.InitVariable(this.RightArmFSMMgr , this.RightArm);
            DefaultWeaponState.AddCondition(FSMUtil.TransConditionID.DefaultWeaponToAtt , FSMUtil.FSMStateID.ArmDefaultWeaponAtt);         
            
            var DefaultWeaponAttack = new TestWeaponAttack();
            DefaultWeaponAttack.InitVariable(this.RightArmFSMMgr , this.RightArm);
            DefaultWeaponAttack.AddCondition(FSMUtil.TransConditionID.DefaultWeaponAttToNormal , FSMUtil.FSMStateID.ArmDefaultWeapon);         

            /* 剑的状态机，可以在获取道具之后再注册，不过还是这里注册方便点，不需要一直加减删除 */ 
            var WeaponSwordNormalState = new SwordNormalState();
            WeaponSwordNormalState.InitVariable(this.RightArmFSMMgr , this.RightArm);
            WeaponSwordNormalState.AddCondition(FSMUtil.TransConditionID.SwordNormalToAtt , FSMUtil.FSMStateID.ArmSwordAttack);         
            
            var WeaponSwordAttackState = new SwordAttackState();
            WeaponSwordAttackState.InitVariable(this.RightArmFSMMgr , this.RightArm);
            WeaponSwordAttackState.AddCondition(FSMUtil.TransConditionID.SwordAttToNormal , FSMUtil.FSMStateID.ArmSwordNoraml);         

            this.RightArmFSMMgr.Init( FSMUtil.FSMStateID.ArmDefaultWeapon , DefaultWeaponState);
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmDefaultWeaponAtt, DefaultWeaponAttack );
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmSwordNoraml, WeaponSwordNormalState );    //注册剑的普通状态
            this.RightArmFSMMgr.AddState( FSMUtil.FSMStateID.ArmSwordAttack, WeaponSwordAttackState );    //注册剑的攻击状态

            DefaultWeaponState.BeforeEnter();

            cc.log( "RightArmFSMMgr Init!" );

            this.RightArm.getComponent("RightArm").SetFSM(this.RightArmFSMMgr);

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
        
        //如果撞到障碍物，直接死了
        if(CollisionType == CommonUtil.EObjType.TYPE_BARRIER)
        {
            /*var GameManager = cc.find("GameContainer").getComponent("GameManager");
            if(GameManager){
                GameManager.GameOver();
            }   */
            Target.ActorDead();
        }
    },

    /**
     * 点击武器按钮的回调
     */
    OnTouchItemBtn: function (InData)
    {
        if(this.RightArm && this.RightArm.getComponent("RightArm")){
            this.RightArm.getComponent("RightArm").ChangeWeapon(InData.ID);
        };
    },
    
    ActorDead : function (){
        var GameManager = cc.find("GameContainer").getComponent("GameManager");
        if(GameManager){
            GameManager.GameOver();
        }  
    }

});

module.exports = Player;