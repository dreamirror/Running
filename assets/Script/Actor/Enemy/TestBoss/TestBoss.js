/*
    测试的boss一号
*/

var EnemyBase = require("EnemyBase");
var CommonUtil = require("CommonUtil");
var GravityManager = require("GravityManager");

var TestBoss = cc.Class({
    extends: EnemyBase,

    properties: {
        
    },

    // onLoad () {},

    start () {
        this._super();
    },

    // update (dt) {},

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

    PoisedAnima : function( InTarget , InCallBack , InParam ){
        this.PlayAnimation("LowBeeAtt");
        this._super(InTarget , InCallBack , InParam);
    },

    /*************************     状态机相关     ************************/
    InitFSM : function(  ){
        this._super("EnemyLowBee");

        //添加远距离攻击状态机
        
        //添加近战蓄力攻击状态机


    },
});
