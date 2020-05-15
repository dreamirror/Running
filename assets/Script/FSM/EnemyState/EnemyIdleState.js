
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
        bTransToDisatnce : false,   //是否移动到远处
        bTranToClose    : false,    //是否移动到近处
    },

    // update (dt) {},

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.EnemyJS = this.TargetObj.getComponent("EnemyBase");

        //进入时设置Node对象播放跑步动画
        if(this.EnemyJS ){//&& (this.EnemyJS instanceof EnemyBase)){
            this.EnemyJS.Idle();
        }   
    },

    Update :function( dt ) {
        //根据当前敌人的类型进行判断，判断何时进攻等
        if (this.EnemyJS == null || this.EnemyJS == undefined){
            this.EnemyJS = this.TargetObj.getComponent("EnemyBase");
        }

        if (this.EnemyJS.BStartAI == false){
            return;
        }

        var CurResult = null;// = this.EnemyJS.RunBaseAI();
        if (this.EnemyJS.EmenyData.BBoss != true){
            CurResult = this.EnemyJS.RunBaseAI(dt);
        }
        else{
            CurResult = this.EnemyJS.RunBossAI(dt);
        }
        //var CurResult = this.EnemyJS.RunBaseAI();
        switch(CurResult){
            case CommonUtil.EnemyRunAIResult.Idle: 
                break;
            //如果是近距离攻击，切换到近距离攻击状态
            case CommonUtil.EnemyRunAIResult.CloseAttack: 
                this.bTransCloseAttack = true;
                break;
            //切换到远距离攻击状态
            case CommonUtil.EnemyRunAIResult.DistanceAttack: 
                this.bTransDistanceAttack = true;
                break;
            //从近处走向远处
            case CommonUtil.EnemyRunAIResult.MoveToDistance: 
                this.bTransToDisatnce = true;
                break;
            //从远处走向近处
            case CommonUtil.EnemyRunAIResult.MoveToClose: 
                this.bTranToClose = true;
                break;
        };

    },

    /* 对简单的敌人，可以切换为攻击状态或是死亡状态 */
    BreakCondition :function( ) {
        if(this.bTransCloseAttack == true){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.EnemyCloseAttack, null, this);
            return;
        }

        if (this.bTransDistanceAttack == true){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.EnemyDistanceAttack, null, this);
            return;
        }
        if (this.bTransToDisatnce == true){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.EnemyMoveToDistance, null, this);
            return;
        }
        if (this.bTranToClose == true){
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.EnemyMoveToClose, null, this);
            return;
        }
    },

    BeforeExit :function( InParamObj ) {
        this.bTransCloseAttack = false;
        this.bTransDistanceAttack = false;
    },


});

module.exports = EnemyIdleState;