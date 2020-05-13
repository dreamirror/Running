/**
 * 状态的基类 , 构造函数需要传入两个参数，一个是FSMMgr 一个是当前状态所控制的TargetObj
 * 会先调用父类的构造函数再调用子类的构造函数
 * 所有成员方法都是虚方法，子类方法可以直接重写父类方法
*/
var FSMUtil = require("FSMUtil");

var FSMStateBase = cc.Class({
    /**
     * 因为这俩变量，都不需要被序列化和反序列化，所以可直接在此设置默认值，因为反序列化时，会将其重新赋值
     * 就会将默认值修改。
     * @param {*} InFSMMgr 状态机
     * @param {*} InTargetObj  状态机控制的对象
     */
    ctor: function (){
    },

    properties: {
        FSMMgr : {
            default : null,
        }, 
        TargetObj : {
            default : null,
            type : cc.Node,
        },
        //是否响应点击，默认为true
        BResponseTouch : true,

        //对应的Node的JS Name，有需要的状态可以使用这个去获取对应的JS
        NodeJSComponentName : null,
    },

    /**初始化参数 */
    InitVariable : function(InFSMMgr , InTargetObj , FSMStateID ) {
        //当前FSM 状态机
        this.FSMMgr = InFSMMgr;
        //当前可变换条件Map
        this.TransTOStateMap = new Map();
        /* 当前StateID */
        this.CurStateID = FSMStateID;
        /* 当前状态机操控的Component */
        this.TargetObj = InTargetObj;
    },

    //5.7 设置JSComponent的名字，则子类可以通用调用设置，并且可在需要Get的地方获取
    SetJSComponentName : function (InNodeJSComponentName){
        this.NodeJSComponentName = InNodeJSComponentName;
    },

    /*******************  设置条件等相关  ******************* */
    /** 添加一个对应的跳转关系，什么条件能够跳转到什么状态 */
	AddCondition :function( InTransCondition , InState){
        if ( InTransCondition == FSMUtil.FSMStateID.NONE){
            return;
        };

        if ( this.TransTOStateMap.has(InTransCondition)){
            cc.log("这个状态已经有啦！");
            return;
        };

        this.TransTOStateMap.set(InTransCondition , InState);

    },

    /** 移除一个条件 */
    RemoveCondition : function(InTransCondition){
        if ( this.TransTOStateMap.has(InTransCondition)){
            this.TransTOStateMap.delete(InTransCondition);
        };
    }, 

    /** 根据传入的条件ID，获取跳转后的状态ID */
    GetTransState :function( InTransCondition){
        if ( this.TransTOStateMap.has(InTransCondition)){
            return this.TransTOStateMap.get(InTransCondition);
        };

        return FSMUtil.TransConditionID.NONE;
    },

    SetFSMMgr :function(InFSMMgr){
		this.FSMMgr = InFSMMgr;
	},

    /*******************  状态运行相关  ******************* */
    /** 运行状态 */
    Update :function( ) {

    },
    /**运行退出状态  */
    BreakCondition :function( ) {
        
    },
    BeforeEnter :function( InParamObj ) {

    },
	BeforeExit :function( InParamObj ) {

    },
	AfterExit :function( ) {

    },

    /*******************  响应点击  ******************* */
    OnTouchStart : function(){
    },

	OnTouchMove : function(){
    },

	OnTouchEnd : function(){
    },

	OnTouchCancel : function(){
    },

});

module.exports = FSMStateBase;