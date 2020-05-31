/*
    通用敌人远距离攻击状态,会有一个攻击完毕后的冷却时间
*/
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var EnemyBase = require("EnemyBase");
var CommonUtil = require("CommonUtil");

var EnemyDisAttState = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
    },

    properties: {
        //设置不响应点击
        BResponseTouch : {
            default : false,
            override: true
        },

        bAttackOver : false,

    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.EnemyJS = this.TargetObj.getComponent("EnemyBase");
        this.bAttackOver = false;

        //根据传入的飞行道具参数，初始化攻击状态
        if (InParamObj && InParamObj.DisAttackParam != null && InParamObj.DisAttackParam != undefined){
            this.DisAttackParam = InParamObj.DisAttackParam;
        }

        //进入时设置Node对象播放远程攻击动作
        if(this.EnemyJS ){//&& (this.EnemyJS instanceof EnemyBase)){

            this.EnemyJS.DisAttAnima(this, this.OnAttackPlayOver , this);

            //向预定义的动画回调一中注册事件，扔出飞镖
            this.EnemyJS.SetAnimationCustomEventOneCallBack( this,  this.OnAttAnimationThrow);
        }   
    },

    /* 对简单的敌人，可以切换为攻击状态或是死亡状态 */
    BreakCondition :function( ) {
        if(this.bAttackOver == true){
            this.EnemyJS.SetBossActionOver();
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.EnemyIdle, null, this);
            return;
        }
    },

    BeforeExit :function( InParamObj ) {
        this.bTransIdle = false;
    },

    /************************    攻击动画播放完毕 **************************/
    OnAttackPlayOver : function ( data ){
        this.bAttackOver = true;
        var ArmAnimation = this.EnemyJS.GetAnimation();
        if (ArmAnimation != null)
        {
            ArmAnimation.off('finished',  this.OnAttackPlayOver,  this);
        }
    },

    //动画播放到这个位置，开始 扔出攻击武器
    OnAttAnimationThrow : function( InString ,InNumber , InBoolean ){
        this.EnemyJS.RemoveAnimationCustomEventOneCallBack(this , this.OnAttAnimationThrow);

        //与Player的不同，调用EnemyBase中的创建远程攻击事件
        this.EnemyJS.CreateDisAtt();
    },

});

module.exports = EnemyDisAttState;