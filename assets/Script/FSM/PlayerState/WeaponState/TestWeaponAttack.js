/**
 * 测试武器的攻击状态
 */
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var RightArm = require("RightArm");

var TestWeaponAttack = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
        this.bAttackOver = false;
    },

    properties: {
        
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.ArmJS = this.TargetObj.getComponent("RightArm");

        //进入时设置Node对象播放跑步动画
        if(this.ArmJS && (this.ArmJS instanceof RightArm)){
            this.ArmJS.PlayAnimation("TestWeaponAttack");

            var ArmAnimation = this.ArmJS.GetAnimation();
            if (ArmAnimation != null)
            {
                ArmAnimation.on('finished',  this.OnAttackPlayOver,  this);
            }
        }   
    },

    BreakCondition :function( ) {
        if (this.bAttackOver){
            this.FSMMgr.TransState(FSMUtil.TransConditionID.DefaultWeaponAttToNormal, null, this);
            this.bAttackOver = false
            return;
        }
    },
    
    /*******************  响应点击   ******************* */
    OnTouchStart : function(event){
    },

	OnTouchEnd : function(event){
    },

    //触摸移开屏幕
    OnTouchCancel : function(event){
    },

    Update : function(dt){
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


module.exports = TestWeaponAttack;