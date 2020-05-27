/* 
    CopyRight 2019
    zh
    玩家风筝状态机，该状态机下不会吧操作发送给手臂状态机
    切到此状态时，会一起将手臂状态设置为 不攻击，或是直接隐藏。
    每次点击会让自身上升，如果不点击，下降,但是因为有重力，而且这个又是飞的，应该这样：
    点击一次，大幅增加上升的速度，如果不点击，小幅增加一个，少于重力每帧增加量的一个量，做到缓慢下降
*/
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var GravityManager = require("GravityManager");

var PlayerFlypyBirdState = cc.Class({
    extends : FSMStateBase,

    ctor: function ( ) {
    },

    properties: {
        
        Flotage : 8,

        CurFlotage : 0, //不按按键的浮力，不需要自定义，直接是Update的dt的一半就好了 

        bFlyOver : false,

        //简单点，这个状态下，直接一来一回的点击就好了
        bStartClick : false,

    },
/*******************  响应点击   ******************* */
    OnTouchStart : function(event){
        this.bStartClick = true;
        this.CurFlotage = 0;//this.Flotage;
    },

	OnTouchMove : function(event){
    },

	OnTouchEnd : function(event){
        if(this.bStartClick == true){
            this.CurFlotage = this.Flotage;
            this.bStartClick = false;
        }
    },
    //触摸移开屏幕
    OnTouchCancel : function(event){
        if(this.bStartClick == true){
            this.CurFlotage = this.Flotage;
        }
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.playerJS = this.TargetObj.getComponent("Player");

        //进入时设置Node对象播放飞起动画
        if(this.playerJS ){
            this.playerJS.PlayerRunAnima();
        }   

        //将手臂状态机设置为起飞状态或是直接隐藏掉


        //进来的时候直接先给一个上升的力
        //设置一个跳跃
        //GravityManager._instance.AddJump(this.playerJS , this.Flotage);
    },

    Update : function(dt){
        var AYSpeed = dt/2 + this.CurFlotage;
        GravityManager._instance.AddJump(this.playerJS , AYSpeed);
        this.CurFlotage = 0;
    },

    //暂时只有跳起时的状态切换
    BreakCondition :function( ) {
        if (this.bFlyOver){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.FALL, null, this);
            return;
        }
    },

});

module.exports = PlayerFlypyBirdState;