
/*
zh 预期是，做成一个通用的所有敌人都可以使用的状态机，敌人Idle状态
提出接口，设置对应的EnemyJS的名字
*/

var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var EnemyBase = require("EnemyBase");
var CommonUtil = require("CommonUtil");

var EnemyIdleState = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
    },

    properties: {
        //设置不响应点击
        BResponseTouch : {
            default : false,
            override: true
        },

        bTransCloseAttack : false,
        bTransDistanceAttack : false,
    },

    // update (dt) {},

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.EnemyJS = this.TargetObj.getComponent(this.NodeJSComponentName);

        //进入时设置Node对象播放跑步动画
        if(this.EnemyJS ){//&& (this.EnemyJS instanceof EnemyBase)){
            this.EnemyJS.Idle();
        }   
    },

    Update :function( ) {
        //根据当前敌人的类型进行判断，判断何时进攻等
        if (this.EnemyJS == null || this.EnemyJS == undefined){
            this.EnemyJS = this.TargetObj.getComponent(this.NodeJSComponentName);
        }

        var CurResult = this.EnemyJS.RunBaseAI();
        switch(CurResult){
            case CommonUtil.EnemyRunAIResult.Idle: 
                break;

            case CommonUtil.EnemyRunAIResult.CloseAttack: 
                this.bTransCloseAttack = true;
                break;

            case CommonUtil.EnemyRunAIResult.DistanceAttack: 
                this.bTransDistanceAttack = true;
                break;
        };

    },

    /* 对简单的敌人，可以切换为攻击状态或是死亡状态 */
    BreakCondition :function( ) {
        if(this.bTransCloseAttack == true){
            this.FSMMgr.TransState(FSMUtil.TransConditionID.RunToJump, null, this);
            return;
        }

        if (this.bTransDistanceAttack == true){
            this.FSMMgr.TransState(FSMUtil.TransConditionID.RunToJump, null, this);
            return;
        }
    },

    BeforeExit :function( InParamObj ) {
        this.bTransCloseAttack = false;
        this.bTransDistanceAttack = false;
    },


});

module.exports = EnemyIdleState;