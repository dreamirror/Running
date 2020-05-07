/**
 * 敌人的基类
 */

var ActorBase = require("ActorBase");
var GlobalEventName = require("GlobalEventName");
var CommonUtil = require("CommonUtil");
var EnemyAI = require("EnemyAI");
var FSMUtil = require("FSMUtil");
var FSMMgr = require("FSMMgr");
var EnemyIdleState = require("EnemyIdleState");

cc.Class({
    extends: ActorBase,

    properties: {

        EnemyType : CommonUtil.EnemyType.Default,

        EnemyAttackType : CommonUtil.EnemyAttackType.None,

        //状态机
        FSMMgr : null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //this.BUseGravity = false;
        this._super();
        this.node.on(GlobalEventName.PlayerAttack, this.OnAttacked ,this );
    },

    start () {
        this._super();
        this.InitEnemyType();
        this.InitFSM();

        //获取一份GameContainer
        var GameContainer = cc.find("GameContainer");
        if(GameContainer){
            this.GameManager = GameContainer.getComponent("GameManager");
        }

        //创建一个EnemyAI
        this.AI = new EnemyAI();
        this.AI.Init( this.node, this);
    },

    // update (dt) {},

    /**
     * 请在每一个敌人中重载，设置自身类型以及攻击类型
    */
    InitEnemyType : function(){

    },

    /*************************     状态机相关     ************************/
    /**
     * 初始化几个默认的状态机，如果需要扩展，则在继承类中自己扩展
     */
    InitFSM : function( InNodeJSComponentName ){
        //都强转把，懒得注册这么多状态了
        this.FSMMgr = new FSMMgr();
        this.FSMMgr.InitVariable();

        var IdleState = new EnemyIdleState();
        IdleState.InitVariable(this.FSMMgr , this.node);
        IdleState.AddCondition(FSMUtil.TransConditionID.EnemyIdelToCloseAttack , FSMUtil.FSMStateID.EnemyCloseAttack); 
        IdleState.AddCondition(FSMUtil.TransConditionID.EnemyIdelToDistanceAttack , FSMUtil.FSMStateID.EnemyDistanceAttack);            
        IdleState.SetJSComponentName(InNodeJSComponentName);

        this.FSMMgr.Init( FSMUtil.FSMStateID.EnemyIdle , IdleState);
        //this.FSMMgr.AddState( FSMUtil.FSMStateID.ArmDefaultWeaponAtt, DefaultWeaponAttack );

        IdleState.BeforeEnter();    
    },

    /********************** 状态相关 ***********************/
    OnAttacked : function(){

    },

    /* 死亡动画 */
    OnDead : function(){

    },

    /********************** 敌人动画相关 , 具体由各个敌人自己去实现，由此达到播放不同动画的效果 ***********************/
    Idle : function () {

    },

    AttackAnima : function( InCallBack ){

    },

    DeadAnima : function ( InCallBack ){

    },

    /******************  敌人AI相关 *******************/
    RunBaseAI : function(){
        this.AI.RunBaseAI();
    },

});
