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
        BRushOver : false,
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
            this.playerJS.PlayerRush();
        }

        //test
        //this.CD = 5
    },

    /** 当落到地面时，结束跳跃状态切换为行走状态
     *  通过给地面添加Tag标签来进行判断，一旦与地面标签进行触碰，则到达了地面，当前状态结束
    */
    BreakCondition :function( ) {

        if (this.BRushOver == true){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.RUN, null, null);
            this.BRushOver = false;
            return;
        };

    },

    /*Update(dt) {
        if(this.CD > 0)
        {
            this.CD -= dt;
        }
        else{
            this.BRushOver = true;
        }
    },*/
    
    //设置冲刺结束
    SetRushOver : function(){
        this.BRushOver = true;
    },

});
