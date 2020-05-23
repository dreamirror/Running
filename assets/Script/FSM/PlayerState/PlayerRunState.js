/** 
 * 玩家奔跑状态
*/
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var Player = require("Player");

var PlayerRunState = cc.Class({
    extends : FSMStateBase,

    ctor: function ( ) {

        //上一次TouchMove的坐标
        this.LastMoveLocation = new cc.Vec2( 0 ,0 );
        this.CurMoveLocation = new cc.Vec2( 0 ,0 );

        this.BeInThreshold = false;
        //多少距离开始计算上下翻动
        this.TouchMoveDistance = 6;

        //一旦超过临界值开始翻滚，则在多少秒内达到移动距离算翻滚
        this.CriticalValTime = 0.1;

        //临界值后需要达到的移动距离
        this.CriticalValDistance = 3;//2;

        //是否切换到跳跃状态
        this.bTransToJump = false;
    },

    properties: {
    },


    /*******************  响应点击   ******************* */
    OnTouchStart : function(event){
        this.LastMoveLocation = event.getLocation();
        this.CurMoveLocation = event.getLocation();
        
        this.BeInThreshold = false;

        //将点击传递给手臂
        if(this.playerJS != null && this.playerJS.RightArmFSMMgr != null)
        {
            this.playerJS.RightArmFSMMgr.OnTouchStart(event);
        }
    },

	OnTouchMove : function(event){
        this.CurMoveLocation = event.getLocation();
        
        //如果在短时间内，上下移动了一大段距离，则翻滚玩家
        //先判断 是否达到了翻滚临界值
        if( this.BeInThreshold == false && this.CurMoveLocation.y - this.LastMoveLocation.y > 0 &&
             Math.abs( this.CurMoveLocation.y - this.LastMoveLocation.y ) > this.TouchMoveDistance )
        {
            this.BeInThreshold = true;
            if(this.FSMMgr)
            {
                //this.playerJS.scheduleOnce( this.OnScheduleCall,this.CriticalValTime);
                //this.FSMMgr.CreateTimerOnce(this.OnScheduleCall,this.CriticalValTime , this);
                if(this.playerJS != null)
                {
                    this.playerJS.CreateTimerOnce(this.OnScheduleCall,this.CriticalValTime , this);
                    //4.27 如果处于已经在计算起跳动作的阶段，则不会进行攻击的返回
                    if(this.playerJS != null && this.playerJS.RightArmFSMMgr != null)
                    {
                        this.playerJS.RightArmFSMMgr.OnTouchCancel(event);
                    }
                }
            }
            
        }

        //将点击传递给手臂
        if(this.playerJS != null && this.playerJS.RightArmFSMMgr != null)
        {
            this.playerJS.RightArmFSMMgr.OnTouchMove(event);
        }
    },

	OnTouchEnd : function(event){
        this.BeInThreshold = false;  

        //将点击传递给手臂
        if(this.playerJS != null && this.playerJS.RightArmFSMMgr != null)
        {
            this.playerJS.RightArmFSMMgr.OnTouchEnd(event);
        }
    },

	//触摸移开屏幕
    OnTouchCancel : function(event){
        this.BeInThreshold = false;

        //将点击传递给手臂
        if(this.playerJS != null && this.playerJS.RightArmFSMMgr != null)
        {
            this.playerJS.RightArmFSMMgr.OnTouchCancel(event);
        }
    },

    /********************** 运行逻辑 ************************/
    OnScheduleCall : function(InParam){
        if(Math.abs(InParam.CurMoveLocation.y - InParam.LastMoveLocation.y) > InParam.CriticalValDistance){
            InParam.bTransToJump = true;
        }
        //应该是在碰到地面的时候，去设置一次InParam.CurMoveLocation
        //InParam.LastMoveLocation = InParam.CurMoveLocation;
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.playerJS = this.TargetObj.getComponent("Player");

        //进入时设置Node对象播放跑步动画
        if(this.playerJS ){//&& (this.playerJS instanceof Player)){
            //this.playerJS.PlayAnimation("LiuRun");
            this.playerJS.PlayerRunAnima();
        }   
    },

    Update : function(){
    },

    //暂时只有跳起时的状态切换
    BreakCondition :function( ) {
        if (this.bTransToJump){
            this.FSMMgr.TransState(FSMUtil.TransConditionID.RunToJump, null, this);
            //this.playerJS.PlayerSetRush();
            return;
        }
    },

    BeforeExit :function( InParamObj ) {
        this.bTransToJump = false;
        //if (this.playerJS){
        //    this.playerJS.unschedule( this.OnScheduleCall,this);
        //} 
        if(this.playerJS)
        {
            this.playerJS.ClearTimer(this.OnScheduleCall, this)
        }

        this.BeInThreshold = false;
    },
});

module.exports = PlayerRunState;