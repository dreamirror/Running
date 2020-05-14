/*
飞行道具扔出
*/

var FSMUtil = require("FSMUtil");
var WeaponBaseState = require("WeaponBaseState");
var RightArm = require("RightArm");
var ActorManager = require("ActorManager");

var FlyWeaAttState = cc.Class({
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

        //根据传入的飞行道具参数，初始化攻击状态
        if (InParamObj && InParamObj.WeaponParam != null && InParamObj.WeaponParam != undefined){
            this.WeaponParam = InParamObj.WeaponParam;
            this.CD = this.WeaponParam.CD;
            this.BeThrowDart = false;
        }

        //进入时设置Node对象播放扔飞镖动画
        if(this.ArmJS && (this.ArmJS instanceof RightArm)){
            this.ArmJS.PlayAnimation("DartAtt");
            var ArmAnimation = this.ArmJS.GetAnimation();
            if (ArmAnimation != null)
            {
                ArmAnimation.on('finished',  this.OnAttackPlayOver,  this);
            }

            //向预定义的动画回调一中注册事件，扔出飞镖
            this.ArmJS.SetAnimationCustomEventOneCallBack( this,  this.OnAttAnimationThrow);
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
        //一旦扔出飞镖，开始计时，当手臂动画播放完毕之后，回到Idle状态，并且将CD剩余时间传回给手臂
        if (this.BeThrowDart == true){
            this.CD -= dt;
        }
    },

    BreakCondition :function( ) {
        if (this.bAttackOver){
            this.BAttSendCD = true;
            this.FSMMgr.TransState(FSMUtil.TransConditionID.DartAttToNormal, null, this);
            this.bAttackOver = false;
            this.BeThrowDart = false;
            return;
        }
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

    //动画播放到这个位置，开始 扔出飞镖
    OnAttAnimationThrow : function( InString ,InNumber , InBoolean ){
        this.ArmJS.RemoveAnimationCustomEventOneCallBack(this , this.OnAttAnimationThrow);

        this.BeThrowDart = true;

        var PoolManager = cc.find("GameContainer").getComponent("PoolManager");  

        //创建飞镖
        if ( this.WeaponParam.id ){
            var CurWeapon = ActorManager._instance.CreateFlyWeapon(this.WeaponParam.id);
            if (CurWeapon){
                CurWeapon.parent = cc.find("Canvas/GameScene/PlayerScene")//cc.director.getScene();
                //获取当前手的位置
                var ArmPos = this.TargetObj.parent.convertToWorldSpaceAR(cc.v2(0, 0));
                var ArmSize = this.TargetObj.getContentSize();

                //计算下位置再转回来
                var WeaponPos = cc.v2(ArmPos.x + ArmSize.width , ArmPos.y + ArmSize.height / 1.3);
                var PlayerScene = cc.find("Canvas/GameScene/PlayerScene");
                WeaponPos = PlayerScene.convertToNodeSpace(WeaponPos);

                CurWeapon.setPosition(WeaponPos);//(ArmPos.x + ArmSize.width , ArmPos.y + ArmSize.height / 1.3);
                var FlyWeaponJS = CurWeapon.getComponent("FlyWeaponBase");
                FlyWeaponJS.InitWeaponData(this.WeaponParam);

                FlyWeaponJS.SetAttackType();
                FlyWeaponJS.ReduceWeaponCount();
            }
            //PoolManager.
        }
    },

    //var WeaponJS = CurWeapon.getComponent("WeaponBase");
    //                                if (WeaponJS != null && WeaponJS != undefined){
    //                                    WeaponJS.InitWeaponData(CurWeaponData);
    //                               }

});
