/*
    有限状态机，作为组件直接添加到场景的Canvas中用来响应点击事件,并且会将点击事件分发到对应的状态中以及
*/

var FSMUtil = require("FSMUtil");

cc.Class({
    //extends: cc.Component,
    ctor: function (){

    },

    properties: {
        //玩家
        Player : {
            default : null,
            type : cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:
    /**初始化参数*/
    InitVariable : function() {
        //当前FSM 状态
        this.CurFSMState = null;
        //当前FSM ID
        this.CurFSMID = FSMUtil.FSMStateID.RUN;
        /* 当前在状态机内注册的，每个状态ID对应的状态类 */
        this.StateMap = new Map();
    },

    /*onLoad () {
        
        this.InitVariable();

        // 注册点击事件
        this.node.on( cc.Node.EventType.TOUCH_START , this.OnTouchStart , this,true);
        this.node.on( cc.Node.EventType.TOUCH_MOVE , this.OnTouchMove , this,true);
        this.node.on( cc.Node.EventType.TOUCH_END , this.OnTouchEnd , this,true);
        this.node.on( cc.Node.EventType.TOUCH_CANCEL , this.OnTouchCancel , this,true);

    },*/

    Update (dt) {
        //在此更新State的状态
        if (this.CurFSMState != null)
        {
            this.CurFSMState.Update(dt);
            this.CurFSMState.BreakCondition();
        }
    },

    /*******************   自定义函数  *******************/

    /******************   设置状态机相关   *************** */
    /** 初始化 */
    Init : function( InStateID , InState ){
        this.StateMap.clear();
        this.AddState(InStateID, InState);
	    this.SetCurFSMState(InStateID);
    },

    /**添加一个状态 */
    AddState :function( InStateID, InState ){

        if (InStateID == FSMUtil.FSMStateID.NONE){
            return;
        }

        if(this.StateMap.has( InStateID )){
            cc.log( "this StateID Aleady exist" );
            return;
        }

        this.StateMap.set( InStateID , InState );
    },

    /** 删除一个状态*/
    RemoveState : function( InStateID ){
        if( this.StateMap.has(InStateID)){
            this.StateMap.delete(InStateID);
        }
    }, 

    /** 切换状态 
     *  param : InParamObj 是一个切换时传递给下一个状态BeforeEnter使用的参数，内容自行定义
     *          InExitParam 是一个切换时传递给前一个状态的BeforeExit使用的参数，内容自行定义,
    */
    TransState : function(InTransConditionID , InExitParam, InParamObj){
        if (this.CurFSMState == null)
        {   
            cc.log("当前状态机没有任何状态！");
            return FSMUtil.FSMStateID.NONE;
        }

        var tempStateID = this.CurFSMState.GetTransState(InTransConditionID);
        if (tempStateID == FSMUtil.FSMStateID.NONE)  //该条件并不能使该状态转换，返回无状态
            return FSMUtil.FSMStateID.NONE;

        if (!this.StateMap.has(tempStateID))
            return FSMUtil.FSMStateID.NONE;

        var NextFSMState = this.StateMap.get(tempStateID);
        if (NextFSMState == null)
            return FSMUtil.FSMStateID.NONE;

        //当前状态执行退出回调
        this.CurFSMState.BeforeExit(InExitParam);
        //下一个状态执行进入回调
        NextFSMState.BeforeEnter(InParamObj);

        //然后清除数据
        this.CurFSMState.AfterExit();

        this.CurFSMState = NextFSMState;

        return tempStateID;
    },

    /** 设置当前状态，只在初始化使用 */
    SetCurFSMState : function(InStateID){
        if ( this.StateMap.has(InStateID) ){
            this.CurFSMState = this.StateMap.get(InStateID);
        }
        else
        {
            cc.log( '设置当前状态对应的stateID是空的！！' );
        }
    },

    /** 强行设置状态机状态为指定ID并且结束当前状态机 
     *  param : InParamObj 是一个切换时传递给下一个状态BeforeEnter使用的参数，内容自行定义
     *          InExitParam 是一个切换时传递给前一个状态的BeforeExit使用的参数，内容自行定义,
    */
    ForceSetFSMState : function (InStateID, InExitParam, InParamObj){
        if (InStateID == FSMUtil.FSMStateID.NONE){  //该条件并不能转换状态
            return cc.log( '不能转换为空状态！' );
        };

        if (!this.StateMap.has(InStateID))
            return cc.log( '当前状态机中没有要切换的状态ID！' );

        var NextFSMState = this.StateMap.get(InStateID);

        //当前状态执行退出回调
        this.CurFSMState.BeforeExit(InExitParam);
        //下一个状态执行进入回调
        NextFSMState.BeforeEnter(InParamObj);

        //然后清除数据
        this.CurFSMState.AfterExit();

        this.CurFSMState = NextFSMState;

        return InStateID;
    },

    GetCurFSMState : function(){
        return this.CurFSMState;
    },

    GetCurFSMID : function(){
        return this.CurFSMID;
    },

    /*******************  响应点击  ******************* */
    OnTouchStart : function(event){
        if (this.CurFSMState != null){
            this.CurFSMState.OnTouchStart(event);
        }   
    },

	OnTouchMove : function(event){
        if (this.CurFSMState != null){
            this.CurFSMState.OnTouchMove(event);
        }   
    },

	OnTouchEnd : function(event){
        if (this.CurFSMState != null){
            this.CurFSMState.OnTouchEnd(event);
        }   
    },

	OnTouchCancel : function(event){
        if (this.CurFSMState != null){
            this.CurFSMState.OnTouchCancel(event);
        }   
    },

});
