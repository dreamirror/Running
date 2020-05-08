/*
zh 预期是，做成一个通用的所有敌人都可以使用的状态机，通用敌人近距离攻击状态
*/

var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var EnemyBase = require("EnemyBase");
var CommonUtil = require("CommonUtil");

var EnemyCloseAttState = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
    },

    properties: {
        //设置不响应点击
        BResponseTouch : {
            default : false,
            override: true
        },

        bTransDistanceAttack : false,
        bTransIdle : false,

    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.EnemyJS = this.TargetObj.getComponent(this.NodeJSComponentName);

        //进入时设置Node对象播放跑步动画
        if(this.EnemyJS ){//&& (this.EnemyJS instanceof EnemyBase)){
            this.EnemyJS.AttackAnima(this, this.OnAttackAnimaOver , null);
        }   
    },

    /* 对简单的敌人，可以切换为攻击状态或是死亡状态 */
    BreakCondition :function( ) {
        if(this.bTransIdle == true){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.EnemyIdle, null, this);
            return;
        }

        if (this.bTransDistanceAttack == true){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.EnemyDistanceAttack, null, this);
            return;
        }
    },

    BeforeExit :function( InParamObj ) {
        this.bTransDistanceAttack = false;
        this.bTransIdle = false;
    },

    /************************   动画相关 */
    /* 攻击动画播放完毕 */
    OnAttackAnimaOver : function ( ){
        this.bTransIdle = true;
    },

});

module.exports = EnemyCloseAttState;