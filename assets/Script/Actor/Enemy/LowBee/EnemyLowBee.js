/**
 * 最低等的杂兵一号
 */

 var EnemyBase = require("EnemyBase");
 var CommonUtil = require("CommonUtil");
 var GravityManager = require("GravityManager");

var EnemyLowBee = cc.Class({
    extends: EnemyBase,

    properties: {

        //BStartAI : false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._super();
    },

    // update (dt) {},

    /*InitEnemyType : function (){
        this.EnemyType = CommonUtil.EnemyType.LowBee;

        this.EnemyAttackType = CommonUtil.EnemyAttackType.CloseAttack;
    },*/

    /* 修改一下重力系统，当落到地面时才开始计算AI */
    /*UpdateGravity : function( InActor , AYSpeed, bOnGround , GroundObj ){
        this._super(InActor , AYSpeed, bOnGround , GroundObj);

        if (bOnGround == true){
            InActor.BStartAI = true;
        }
    },*/

    /********************** 状态相关 ***********************/
    OnAttacked : function(AttackerJS ,TargetCollision){
        this._super(AttackerJS ,TargetCollision);
        //var EnemyLowBee = TargetCollision.node.getComponent( "EnemyLowBee" );
        //EnemyLowBee.ActorDead();
    },

    /* 死亡动画 */
    ActorDead : function(){
        this._super();
    },
    
    /********************** 敌人动画相关 , 具体由各个敌人自己去实现，由此达到播放不同动画的效果 ***********************/
    Idle : function () {
        this.PlayAnimation("LowBeeIdle");
    },

    AttackAnima : function(  InTarget , InCallBack , InParam ){
        this.PlayAnimation("LowBeeAtt");
        this._super(InTarget , InCallBack , InParam);
    },

    DeadAnima : function ( InCallBack ){
        this.PlayAnimation("LowBeeDead");
    },

    /*************************     状态机相关     ************************/
    InitFSM : function(  ){
        this._super("EnemyLowBee");
    },
});
