/**
 * 剑的普通状态
 */
/**
 * 测试武器的初始状态
 */
var FSMUtil = require("FSMUtil");
var WeaponBaseState = require("WeaponBaseState");
var RightArm = require("RightArm");

var SwordAttackState = cc.Class({
    extends: WeaponBaseState,

    ctor: function ( ) {
    },

    properties: {
        
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.ArmJS = this.TargetObj.getComponent("RightArm");
        this.bAttackOver = false;

        //进入时设置Node对象播放跑步动画
        if(this.ArmJS && (this.ArmJS instanceof RightArm)){

            this.ArmJS.PlayAnimation("SwordAtt");
            var ArmAnimation = this.ArmJS.GetAnimation();
            if (ArmAnimation != null)
            {
                ArmAnimation.on('finished',  this.OnAttackPlayOver,  this);
            }
        }   
    },

    BreakCondition :function( ) {
        if (this.bAttackOver){
            this.FSMMgr.TransState(FSMUtil.TransConditionID.SwordAttToNormal, null, this);
            this.bAttackOver = false;
            return;
        }
    },

    BeforeExit :function( InParamObj ) {
        this._super();

        this.bAttackOver = false;
    },

    /*******************  响应点击   ******************* */
    OnTouchStart : function(event){
        
        this._super(event);
    },

	OnTouchEnd : function(event){
        this._super(event);
    },

    //触摸移开屏幕
    OnTouchCancel : function(event){
        this._super(event);
    },

    Update : function(dt){
        this._super(dt);
    },

    /*******************  动画回调   ******************* */
    OnAttackPlayOver : function( data ){
        this.bAttackOver = true;
        var ArmAnimation = this.ArmJS.GetAnimation();
        if (ArmAnimation != null)
        {
            ArmAnimation.off('finished',  this.OnAttackPlayOver,  this);
        }
    },

});


module.exports = SwordAttackState;
