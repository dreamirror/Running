/*
敌人走向就远处状态
*/
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var EnemyBase = require("EnemyBase");

var EnMoveDisState = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
    },

    properties: {
        //设置不响应点击
        BResponseTouch : {
            default : false,
            override: true
        },

        bMoveOver : false,
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        

        //从TargetOBJ上获取对应的PlayerJS
        this.EnemyJS = this.TargetObj.getComponent(EnemyBase);
        this.MoveNode = this.TargetObj;
        this.EnemyData = this.EnemyJS.EmenyData;
        if (this.MoveNode == null ||this.MoveNode == undefined){
            this.bMoveOver = true;
            return;
        }

        //将最终要走到的位置，先计算出来
        this.DestPos = cc.v2(this.EnemyData.MoveDistanceX , 0);
        this.DestPos = this.MoveNode.parent.convertToNodeSpaceAR(this.DestPos);
        this.DestPos.y = this.MoveNode.getPosition().y;

        //进入时设置Node对象播放行走动作
        if(this.EnemyJS && (this.EnemyJS instanceof EnemyBase)){
            this.EnemyJS.MoveAnima();
        }
    },

    /* 行动完后切换到等待状态 */
    BreakCondition :function( ) {
        if(this.bMoveOver == true){
            this.EnemyJS.SetBossActionOver();
            this.EnemyJS.SetBossAttPosType(1);
            this.FSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.EnemyIdle, null, this);
            return;
        }
    },
    
    BeforeExit :function( InParamObj ) {
        this.bMoveOver = false;
    },
    Update : function(dt) {
        if(this.bMoveOver == false ){
            //在此根据位置移动Enemy
            var CurPos = this.MoveNode.getPosition();
            if(CurPos.x < this.DestPos.x ){
                this.MoveNode.x = CurPos.x + this.EnemyData.MoveSpeed;//(  CurPos.x - this.EnemyData.MoveSpeed , CurPos.y );
            }
            else{
                this.MoveNode.x = this.DestPos.x;
                this.bMoveOver = true;
            }
        }
    },

});

module.exports = EnMoveDisState;