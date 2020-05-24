/*
所有的飞行道具都可以通用这一个状态机
*/
var FSMUtil = require("FSMUtil");
var WeaponBaseState = require("WeaponBaseState");
var RightArm = require("RightArm");
var ActorManager = require("ActorManager");

var YytcNormalSate = cc.Class({
    extends: WeaponBaseState,

    properties: {
        CD  :   0,
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        this.ArmJS = this.TargetObj.getComponent("RightArm");
        
        //如果是从攻击状态回来进行CD设置的，则设置CD
        if (InParamObj.BAttSendCD == true ){
            this.CD = InParamObj.CD;
        }
        else{
            this.WeaponParam = InParamObj;
        }
        
        //播放普通手臂晃动动画即可
        if(this.ArmJS && (this.ArmJS instanceof RightArm)){
            this.ArmJS.PlayAnimation("SwordNormal");
        }   
    },

    BreakCondition :function( ) {
        if (this.bAttack){
            this.FSMMgr.TransState(FSMUtil.TransConditionID.YytcNormalToAtt, null, this);

            return;
        }
    },

    BeforeExit :function( InParamObj ) {
        this._super();
    },

    /*******************  响应点击   ******************* */
    OnTouchStart : function(event){
        if (this.CD > 0){
            cc.log("武器还在冷却中！");
            return;
        }
        this._super(event);
    },

	OnTouchEnd : function(event){
        if (this.CD > 0){
            return;
        }
        this._super(event);
    },

    //触摸移开屏幕
    OnTouchCancel : function(event){
        if (this.CD > 0){
            return;
        }
        this._super(event);
    },

    Update : function(dt){
        this._super(dt);

        if (this.CD > 0){
            this.CD -= dt;
        }
    },

});

module.exports = YytcNormalSate;