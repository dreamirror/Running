/*
    5.5 zh 武器的基类
    当激活攻击状态时，会向被攻击（碰撞）到的碰撞体发送攻击函数

*/
var ActorBase = require("ActorBase");
var FunctionLibrary = require("FunctionLibrary");
var CommonUtil = require("CommonUtil");
var GlobalEventName = require("GlobalEventName");

var WeaponBase = cc.Class({
    extends: ActorBase,

    properties: {

        BInAttack : false,

    },

    onLoad () {
        this.BUseGravity = false;
        this._super();

        //添加一个设置攻击状态激活的事件和一个设置攻击状态结束的事件
        this.node.on('SetAttackType', this.SetAttackType , this );
        this.node.on('SetAttackOver', this.SetAttackOver , this );
        
        
    },

    start () {
        this._super();
        //添加一个碰撞后的反馈函数，用来判断是否死亡之类的
        this.AddCollisionStartCall( this.CollisionCallBack , this , null);
    },

    onDestroy (){
        this._super();

        this.node.off('SetAttackType', this.SetAttackType , this );
        this.node.off('SetAttackOver', this.SetAttackOver , this );
    },

    // update (dt) {},

    /* 激活攻击状态 */
    SetAttackType : function(){
        this.BInAttack = true;
    },

    /* 攻击状态结束 */
    SetAttackOver : function (){
        this.BInAttack = false;
    },

    CollisionCallBack : function(other, self , Target , Param){
        if(Target.BInAttack == true){
            if(FunctionLibrary.GetCollisionType(other) == CommonUtil.EObjType.TYPE_BARRIER)
            {   
                other.node.emit( GlobalEventName.PlayerAttack , Target , other.node);
            }
        }
    },

});
