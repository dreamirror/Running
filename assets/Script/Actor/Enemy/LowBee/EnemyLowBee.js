/**
 * 最低等的杂兵一号
 */

 var EnemyBase = require("EnemyBase");
 var CommonUtil = require("CommonUtil");

var EnemyLowBee = cc.Class({
    extends: EnemyBase,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._super();
    },

    // update (dt) {},

    InitEnemyType : function (){
        this.EnemyType = CommonUtil.EnemyType.LowBee;

        this.EnemyAttackType = CommonUtil.EnemyAttackType.CloseAttack;
    },

    /********************** 状态相关 ***********************/
    OnAttacked : function(AttackerJS ,Target){
        Target.OnDead();
    },

    /* 死亡动画 */
    OnDead : function(){
        this.DeadAnima();
        var ArmAnimation = this.GetAnimation();
        if (ArmAnimation != null)
        {
            ArmAnimation.on('OnDeadFinished',  this.OnDeadPlayOver,  this);
        }
    },

    OnDeadPlayOver : function() {
        var ArmAnimation = this.GetAnimation();
        if (ArmAnimation != null){
            ArmAnimation.off('OnDeadFinished',  this.OnDeadPlayOver,  this);
        }
        this.node.destroy();
    },
    
    /********************** 敌人动画相关 , 具体由各个敌人自己去实现，由此达到播放不同动画的效果 ***********************/
    Idle : function () {
        this.PlayAnimation("LowBeeIdle");
    },

    AttackAnima : function( InCallBack ){
        this.PlayAnimation("LowBeeAtt");
    },

    DeadAnima : function ( InCallBack ){
        this.PlayAnimation("LowBeeDead");
    },

    /*************************     状态机相关     ************************/
    InitFSM : function(  ){
        this._super("EnemyLowBee");
    },
});
