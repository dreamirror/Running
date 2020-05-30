/* 
    玩家御剑状态机，该状态机下不会吧操作发送给手臂状态机
    切到此状态时，会一起将手臂状态设置为 不攻击
    剑体的碰撞体搞大点，可以将垂直方向的敌人都攻击到
*/
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var GravityManager = require("GravityManager");
var FunctionLibrary = require("FunctionLibrary");
var CommonUtil = require("CommonUtil");

var PlayerSwordRushState = cc.Class({
    extends : FSMStateBase,

    ctor: function () {
        this.GravitySpeed = 0;
    },


    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.playerJS = this.TargetObj.getComponent("Player");

        //进入时设置Node对象播放飞起动画
        if(this.playerJS ){
            this.playerJS.PlaySwordRushAnima();//播放御剑
        }   

        //将手臂状态机设置为起飞状态或是直接隐藏掉
        this.playerJS.RightArm.opacity = 0;
        this.playerJS.UperActor.opacity = 0;

        //暂停重力
        GravityManager._instance.ConstantGravity(this.playerJS ,this.GravitySpeed);

        //将角色放到空中
        var pos = this.playerJS.node.getPosition();
        this.playerJS.node.setPosition(cc.v2(pos.x , pos.y + 50));

        //该状态通过向Player中注册一个碰撞的回调，来处理碰到敌人
        this.playerJS.AddCollisionStartCall( this.CollisionStartCallBack , this );
    },

    //在这儿做个动效还是可以的
    // Update : function(dt){
    // },

    //状态切换
    BreakCondition :function( ) {
        var GameData = cc.find("GameContainer").getComponent("GameData");
        if (GameData.checkSwordRush() == false){
            this.FSMMgr.TransState(FSMUtil.TransConditionID.FlyToFall, null, this);
            return;
        }
    },

    BeforeExit : function() {
        this._super();

        //将手臂状态机设置为起飞状态或是直接隐藏掉
        this.playerJS.RightArm.opacity = 255;
        this.playerJS.UperActor.opacity = 255;

        //回复重力
        GravityManager._instance.CancleConstantGravity(this.playerJS);

        //取消BUFF
        this.playerJS.needCheckSwordRush = false;
    },


    /**
     * 御剑中发生碰撞的CallBack , 此时从外部调用的该函数所以this并不是JumpState！！
     */
    CollisionStartCallBack : function(other, self , InTarget){
        if(FunctionLibrary.GetCollisionType(other) == CommonUtil.EObjType.TYPE_ENEMY)
        {
            //调用武器攻击敌人的接口

        }
    },

});

module.exports = PlayerSwordRushState;