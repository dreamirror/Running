/** 
 * 玩家跳跃状态
*/
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var Player = require("Player");
var FunctionLibrary = require("FunctionLibrary");
var GravityManager = require("GravityManager");
var CommonUtil = require("CommonUtil");

cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
    },

    properties: {
        
    },
    
    InitJumpData : function(InitialSpeed){
        this.InitialSpeed = InitialSpeed;
        this.JumpInitialSpeed = InitialSpeed;
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
        if(this.playerJS && (this.playerJS instanceof Player)){
            this.playerJS.PlayAnimation("PlayerJump");
        }

        //该状态通过向Player中注册一个碰撞的回调，来处理接触地面等的事件
        this.playerJS.AddCollisionStartCall( this.CollisionStartCallBack , this );

        //设置一个跳跃
        GravityManager._instance.SetJump(this.playerJS , this.JumpInitialSpeed);

    },

    /** 当落到地面时，结束跳跃状态切换为行走状态
     *  通过给地面添加Tag标签来进行判断，一旦与地面标签进行触碰，则到达了地面，当前状态结束
    */
    BreakCondition :function( ) {

        if (this.bFallOnGround){
            this.FSMMgr.TransState(FSMUtil.TransConditionID.JumpToRun, null, null);
            this.playerJS.RemoveCollisionStartCall( this.CollisionStartCallBack );
            this.bFallOnGround = false;
            this.JumpInitialSpeed = this.InitialSpeed;
            return;
        };

    },

    //在此模拟一个跳跃的位移
    Update : function(){
        /*if ( this.bFallOnGround == false ){
            this.JumpInitialSpeed = FunctionLibrary.CalculateJumpASpeed(this.JumpInitialSpeed);
            var TempPos = this.TargetObj.getPosition();
    
            this.TargetObj.setPosition(cc.v2(TempPos.x , TempPos.y + this.JumpInitialSpeed));
        };*/
        //4.27 修改为使用重力系统的跳跃
    },

    /**
     * 跳跃中发生碰撞的CallBack , 此时从外部调用的该函数所以this并不是JumpState！！
     */
    CollisionStartCallBack : function(other, self , InTarget){
        //if (other.node.name == "Background_road")
        if(FunctionLibrary.GetCollisionType(other) == CommonUtil.EObjType.TYPE_ROAD)
        {
            InTarget.bFallOnGround = true;

            //再重新设置一下Player的位置
            //var Bounds = FunctionLibrary.GetCollisionBoundsByBoxCollision(other);
            
            //var TempPos = InTarget.TargetObj.getPosition();
            //InTarget.TargetObj.setPosition(cc.v2(TempPos.x , Bounds.top));
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
