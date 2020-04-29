/**
 * 测试武器的初始状态
 */
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var RightArm = require("RightArm");

var TestWeaponState = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
        this.bAttack = false;
        this.CriticalValTime = 0.1;

        this.StartTouch = false;
        this.TouchTime = 0;
    },

    properties: {
        
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.ArmJS = this.TargetObj.getComponent("RightArm");

        //进入时设置Node对象播放跑步动画
        if(this.ArmJS && (this.ArmJS instanceof RightArm)){

            this.ArmJS.PlayAnimation("TestWeaponIdle");
        }   
    },

    BreakCondition :function( ) {
        if (this.bAttack){
            this.FSMMgr.TransState(FSMUtil.TransConditionID.DefaultWeaponToAtt, null, this);

            return;
        }
    },

    BeforeExit :function( InParamObj ) {
        this.bAttack = false;
        this.StartTouch = false;
        this.TouchTime = 0;
    },

    /*******************  响应点击   ******************* */
    OnTouchStart : function(event){
        //this.bAttack = true;

        //点击时开启一个计时器，一旦点击，就开始计时,必须在限定时间内抬起
        this.StartTouch = true;
        this.TouchTime = 0;
    },

	OnTouchEnd : function(event){
        if(this.StartTouch)
        {
            if( this.TouchTime <= this.CriticalValTime )
            {
                this.bAttack = true;
            }
        }
        this.StartTouch = false;
    },

    //触摸移开屏幕
    OnTouchCancel : function(event){
        this.StartTouch = false;
        this.TouchTime = 0;
        this.bAttack = false;
    },

    Update : function(dt){
        if(this.StartTouch == true)
        {
            this.TouchTime += dt;
        }
    },

});


module.exports = TestWeaponState;