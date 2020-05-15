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
        this.EnemyJS = this.TargetObj.getComponent(this.NodeJSComponentName);
        this.bAttackOver = false;

        this.PoisedData = InParamObj;

        //进入时设置Node对象播放远程攻击动作
        if(this.EnemyJS && (this.EnemyJS instanceof EnemyBase)){
            this.EnemyJS.DisAttAnima(this , this.OnAttackAnimaOver , null);
        }   
    },

    Update :function( dt ) {
        //在此更新蓄力时间，时间到了之后，结束蓄力状态
        if (this.PoisedData.PoisedTime > 0){
            this.PoisedData.PoisedTime -= dt;
        }
    },

    /************************   动画相关 */
    /* 攻击动画播放完毕 */
    OnAttackAnimaOver : function ( ){
        
    },

});

module.exports = EnemyPoisedState;