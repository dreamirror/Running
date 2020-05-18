/**
 * 敌人蓄力状态,持续一段时间后结束
 */
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var EnemyBase = require("EnemyBase");

var EnemyPoisedState = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
    },

    properties: {
        //设置不响应点击
        BResponseTouch : {
            default : false,
            override: true
        },

        bPoisedOver : false,

    },

    /*******************  状态运行相关  ******************* */
    //这里的BeforeEnter应该传入蓄力完后需要调用的StateID，是近战还是远程,还需要传入蓄力时间
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.EnemyJS = this.TargetObj.getComponent(EnemyBase);
        this.bAttackOver = false;

        this.PoisedData = InParamObj;

        this.PoisedTime = this.EnemyJS.EmenyData.PoisedTime;

        //进入时设置Node对象播放远程攻击动作
        if(this.EnemyJS && (this.EnemyJS instanceof EnemyBase)){
            this.EnemyJS.PoisedAnima();
        }   
    },

    Update :function( dt ) {
        //在此更新蓄力时间，时间到了之后，结束蓄力状态
        if (this.PoisedTime > 0){
            this.PoisedTime -= dt;
        }
        else{
            this.bAttackOver = true;
        }
    },

    /* 行动完后切换到等待状态 */
    BreakCondition :function( ) {
        if(this.bAttackOver == true){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.EnemyCloseAttack, null, this.PoisedData);
            return;
        }
    },
    /************************   动画相关 */
    

});

module.exports = EnemyPoisedState;