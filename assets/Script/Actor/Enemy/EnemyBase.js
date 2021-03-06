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
var EnemyCloseAttState = require("EnemyCloseAttState");
var EnemyDisAttState = require("EnemyDisAttState");
var GravityManager = require("GravityManager");

cc.Class({
    extends: ActorBase,

    properties: {

        EnemyType : CommonUtil.EnemyType.Default,

        EnemyAttackType : null,//CommonUtil.EnemyAttackType.None,

        //状态机
        FSMMgr : null,

        //HP 
        //HP      :   2,

        //敌人的配置
        EmenyData : null,
        
        //是否开始计算AI
        BStartAI : false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //this.BUseGravity = false;
        this._super();
        this.node.on(GlobalEventName.PlayerAttack, this.OnAttacked ,this );
    },

    onDestroy(){
        this.node.off(GlobalEventName.PlayerAttack, this.OnAttacked ,this );
    },

    start () {
        this._super();
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

    update (dt) {
        if(this.FSMMgr)
        {
            this.FSMMgr.Update(dt);
        }
    },

    /* 修改一下重力系统，当落到地面时才开始计算AI */
    UpdateGravity : function( InActor , AYSpeed, bOnGround , GroundObj ){
        this._super(InActor , AYSpeed, bOnGround , GroundObj);

        if (bOnGround == true){
            InActor.BStartAI = true;
        }
    },

    /**
     * 5.13 修改为统一通过配置进行获取
    */
    InitEnemyType : function( InEnemyData ){
        this.EmenyData = InEnemyData;
        this.HP = InEnemyData.HP;
        this.EnemyType = InEnemyData.EnemyType;
        this.ActionCD = InEnemyData.ActionCD;

        this.EnemyAttackType = new Map();
        for( var AttackTypeCount = 0 ; AttackTypeCount < InEnemyData.EnemyAttackType.length ; AttackTypeCount++){
            this.EnemyAttackType.set(InEnemyData.EnemyAttackType[AttackTypeCount] , InEnemyData.EnemyAttackType[AttackTypeCount]);
        }

        //this.EnemyAttackType = InEnemyData.EnemyType.EnemyAttackType;
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
        IdleState.InitVariable(this.FSMMgr , this.node , FSMUtil.FSMStateID.EnemyIdle);
        IdleState.AddCondition(FSMUtil.TransConditionID.EnemyIdelToCloseAttack , FSMUtil.FSMStateID.EnemyCloseAttack); 
        IdleState.AddCondition(FSMUtil.TransConditionID.EnemyIdelToDistanceAttack , FSMUtil.FSMStateID.EnemyDistanceAttack);            
        IdleState.SetJSComponentName(InNodeJSComponentName);

        /* jin近距离攻击状态 */
        var CloseAttState = new EnemyCloseAttState();
        CloseAttState.InitVariable(this.FSMMgr , this.node ,FSMUtil.FSMStateID.EnemyCloseAttack);        
        CloseAttState.SetJSComponentName(InNodeJSComponentName);

        /* 远距离攻击状态 */
        var RangeAttState = new EnemyDisAttState();
        RangeAttState.InitVariable(this.FSMMgr , this.node ,FSMUtil.FSMStateID.EnemyDistanceAttack);       

        this.FSMMgr.Init( FSMUtil.FSMStateID.EnemyIdle , IdleState);
        this.FSMMgr.AddState( FSMUtil.FSMStateID.EnemyCloseAttack, CloseAttState );
        this.FSMMgr.AddState( FSMUtil.FSMStateID.EnemyDistanceAttack, RangeAttState );

        IdleState.BeforeEnter();    
    },

    /********************** 状态相关 ***********************/
    /* 被武器攻击的回调，应该在此扣除血量 */
    OnAttacked : function(AttackerJS ,TargetCollision){
        this.HP -= AttackerJS.ATK;
        if (this.HP <= 0){
            this.ActorDead();
        }   
    },

    /* 死亡状态 */
    ActorDead : function(){
        this.DeadAnima();
        var ArmAnimation = this.GetAnimation();
        if (ArmAnimation != null)
        {
            ArmAnimation.on('finished',  this.OnDeadPlayOver,  this);
        }

        //关闭自身的Collision组件
        var BoxCollider = this.node.getComponent(cc.BoxCollider);
        if (BoxCollider){
            BoxCollider.active = false;
            BoxCollider.destroy();
        }

        //取消重力注册
        if(GravityManager._instance){
            GravityManager._instance.UnRigisterToGravity(this);
        }  
    },
    
    /********************** 敌人动画相关 , 具体由各个敌人自己去实现，由此达到播放不同动画的效果 ***********************/
    Idle : function () {

    },

    AttackAnima : function( InTarget , InCallBack , InParam){
        var ArmAnimation = this.GetAnimation();
        if (ArmAnimation != null)
        {
            ArmAnimation.on('finished',  this.OnAttackAnimaOver,  this);
        }

        this.AttackAnimaCallData = {
            Target : InTarget,
            CallBack : InCallBack,
            Param : InParam,
        };
    },

    DisAttAnima : function(InTarget , InCallBack , InParam) {
        var ArmAnimation = this.GetAnimation();
        if (ArmAnimation != null)
        {
            ArmAnimation.on('finished',  this.OnAttackAnimaOver,  this);
        }

        this.AttackAnimaCallData = {
            Target : InTarget,
            CallBack : InCallBack,
            Param : InParam,
        };
    },

    DeadAnima : function ( ){
        var ArmAnimation = this.GetAnimation();
        if (ArmAnimation != null)
        {
            ArmAnimation.on('finished',  this.OnDeadPlayOver,  this);
        }
    },

    PoisedAnima : function( InTarget , InCallBack , InParam ){
        var ArmAnimation = this.GetAnimation();
        if (ArmAnimation != null)
        {
            ArmAnimation.on('finished',  this.OnPoisedOver,  this);
        }

        this.PoisedAnimaCallData = {
            Target : InTarget,
            CallBack : InCallBack,
            Param : InParam,
        };
    },

    //行走循环动画
    MoveAnima : function (  ){

    },

    /*****************************  动画播放完毕回调  ******************************/
    /* 攻击动画播放完毕 */
    OnAttackAnimaOver : function ( ){

        if (this.AttackAnimaCallData != null && this.AttackAnimaCallData != undefined && this.AttackAnimaCallData.Target != null && this.AttackAnimaCallData.Target != undefined ){
            this.AttackAnimaCallData.CallBack.call( this.AttackAnimaCallData.Target ,  this.AttackAnimaCallData.Param);
            this.AttackAnimaCallData = null;
        }

        var ArmAnimation = this.GetAnimation();
        if (ArmAnimation != null){
            ArmAnimation.off('finished',  this.OnAttackAnimaOver,  this);
        }

    },

    /* 死亡动画播放完毕 */
    OnDeadPlayOver : function() {
        var ArmAnimation = this.GetAnimation();
        if (ArmAnimation != null){
            ArmAnimation.off('finished',  this.OnDeadPlayOver,  this);
        }
        this.node.destroy();
    },

    /** 蓄力播放完毕 */
    OnPoisedOver : function(){

        if (this.PoisedAnimaCallData != null && this.PoisedAnimaCallData != undefined && this.PoisedAnimaCallData.Target != null && this.PoisedAnimaCallData.Target != undefined ){
            this.PoisedAnimaCallData.CallBack.call( this.PoisedAnimaCallData.Target ,  this.PoisedAnimaCallData.Param);
            this.PoisedAnimaCallData = null;
        }

        var ArmAnimation = this.GetAnimation();
        if (ArmAnimation != null){
            ArmAnimation.off('finished',  this.OnPoisedOver,  this);
        }
    },

    /******************  敌人AI相关 *******************/
    RunBaseAI : function(dt){
        var result = this.AI.RunBaseAI(dt);

        return result;
    },

    RunBossAI : function(dt) {
        var result =  this.AI.RunBossAI(dt);

        return result;
    },

    SetBossAttPosType : function( InType) {
        this.AI.SetBossAttPosType(InType);
    },

    //设置一个行为结束
    SetBossActionOver :function() {
        this.AI.BossAIRunOver();
    },

    /******************  创建攻击相关 *******************/
    //创建远程攻击
    CreateDisAtt : function( ){
    },

});
