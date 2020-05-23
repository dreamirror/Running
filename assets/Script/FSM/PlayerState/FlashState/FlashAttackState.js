//闪烁的attack状态

var FSMUtil = require("FSMUtil");
var WeaponBaseState = require("WeaponBaseState");
var RightArm = require("RightArm");

var FlashAttackState = cc.Class({
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
            //cc.log("00000");
            this.ArmJS.PlayAnimation("SwordAtt");
            var ArmAnimation = this.ArmJS.GetAnimation();
            if (ArmAnimation != null)
            {
                ArmAnimation.on('finished',  this.OnAttackPlayOver,  this);
            }

            //将剑的攻击状态激活
            this.ArmJS.SetAttackType();
        }   
        
    },

    BreakCondition :function( ) {
      //  if (this.bAttackOver){
           // this.FSMMgr.TransState(FSMUtil.TransConditionID.SwordAttToNormal, null, this);
           // this.bAttackOver = false;
           // return;
       // }
    },

    BeforeExit :function( InParamObj ) {
        this._super();

        //将剑的攻击状态解除激活
        if(this.ArmJS){
            this.ArmJS.SetAttackOver();
        }
        
        this.bAttackOver = false;
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

        //cc.log("3333");

        this.bAttackOver = true;
        var ArmAnimation = this.ArmJS.GetAnimation();
        if (ArmAnimation != null)
        {
            ArmAnimation.off('finished',  this.OnAttackPlayOver,  this);
        }
    },

});


module.exports = FlashAttackState;
