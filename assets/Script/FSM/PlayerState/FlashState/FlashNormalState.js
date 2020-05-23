// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var FSMUtil = require("FSMUtil");
var WeaponBaseState = require("WeaponBaseState");
var RightArm = require("RightArm");

var FlashNormalState = cc.Class({
    extends: WeaponBaseState,

    ctor: function ( ) {
    },

    properties: {
        CD:0,
        deltaCD :0
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.ArmJS = this.TargetObj.getComponent("RightArm");
        this.CD = InParamObj.CD;
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
        if(this.ArmJS.PlayerJS)
        {
            cc.log("点击冲刺")
            this.ArmJS.PlayerJS.playerFlash();
        }
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

        if (this.CD > 0){
            this.CD -= dt;
        }
    },

});


module.exports = FlashNormalState;