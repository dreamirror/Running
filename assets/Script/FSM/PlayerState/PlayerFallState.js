/** 
 * 玩家跳跃状态
*/
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var Player = require("Player");
var FunctionLibrary = require("FunctionLibrary");
var GravityManager = require("GravityManager");
var CommonUtil = require("CommonUtil");

var PlayerFallState = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
    },

    properties: {
        
    },
    
    InitJumpData : function(InitialSpeed){
        //是否碰撞到了地面
        this.bFallOnGround = false;
    },

    /*******************  状态运行相关  ******************* */
    /** 4.25 before Enter 
     * InParamObj,用来设置前一个状态的MovePosition位置
     * 当碰到地面时，重新设置MovePosition
    */ 
    BeforeEnter :function( InParamObj ) {

        this.RunStateObj = InParamObj;

        //从TargetOBJ上获取对应的PlayerJS
        this.playerJS = this.TargetObj.getComponent("Player");

        //进入时设置Node对象播放跳跃动画
        if(this.playerJS ){
            this.playerJS.PlayFallAnima();
        }

        //该状态通过向Player中注册一个碰撞的回调，来处理接触地面等的事件
        this.playerJS.AddCollisionStartCall( this.CollisionStartCallBack , this );
    },

    /** 当落到地面时，结束跳跃状态切换为行走状态
     *  通过给地面添加Tag标签来进行判断，一旦与地面标签进行触碰，则到达了地面，当前状态结束
    */
    BreakCondition :function( ) {

        if (this.bFallOnGround){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.RUN, null, null);
            this.playerJS.RemoveCollisionStartCall( this.CollisionStartCallBack );
            this.bFallOnGround = false;
            this.JumpInitialSpeed = this.InitialSpeed;
            return;
        };

    },

    Update : function(){
    },

    /**
     * 跳跃中发生碰撞的CallBack , 此时从外部调用的该函数所以this并不是JumpState！！
     */
    CollisionStartCallBack : function(other, self , InTarget){
        if(FunctionLibrary.GetCollisionType(other) == CommonUtil.EObjType.TYPE_ROAD)
        {
            InTarget.bFallOnGround = true;
        }
    },

    /*******************  响应点击   ******************* */
    OnTouchStart : function(event){
        //将点击传递给手臂
        if(this.playerJS != null && this.playerJS.RightArmFSMMgr != null)
        {
            this.playerJS.RightArmFSMMgr.OnTouchStart(event);
        }
    },

    OnTouchMove(event){
        //碰到地面时，会去设置RunState的鼠标位置，用来处理如果一直按住屏幕的问题
        if(this.RunStateObj != undefined && this.RunStateObj!= null)
        {
            //console.log(" Jump state Set Location!!!! ");
            this.RunStateObj.LastMoveLocation = event.getLocation();
            this.RunStateObj.CurMoveLocation = event.getLocation();
        }
    },

    OnTouchEnd : function(event){
        //将点击传递给手臂
        if(this.playerJS != null && this.playerJS.RightArmFSMMgr != null)
        {
            this.playerJS.RightArmFSMMgr.OnTouchEnd(event);
        }
    },

});

module.exports = PlayerFallState;