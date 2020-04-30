/**
 * 剑的普通状态
 */
/**
 * 测试武器的初始状态
 */
var FSMUtil = require("FSMUtil");
var WeaponBaseState = require("WeaponBaseState");
var RightArm = require("RightArm");

var SwordNormalState = cc.Class({
    extends: WeaponBaseState,

    ctor: function ( ) {
    },

    properties: {
        
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.ArmJS = this.TargetObj.getComponent("RightArm");

        //进入时设置Node对象播放跑步动画
        if(this.ArmJS && (this.ArmJS instanceof RightArm)){

            this.ArmJS.PlayAnimation("SwordNormal");
        }   
    },

    BreakCondition :function( ) {
        if (this.bAttack){
            this.FSMMgr.TransState(FSMUtil.TransConditionID.SwordNormalToAtt, null, this);

            return;
        }
    },

    BeforeExit :function( InParamObj ) {
        this._super();
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

});


module.exports = SwordNormalState;