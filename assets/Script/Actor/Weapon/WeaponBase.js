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

        //攻击力
        ATK      : 0,

        //武器data
        WeaponData : null,
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

    /* 初始化参数Data */
    InitWeaponData : function ( InWeaponData){
        this.WeaponData = InWeaponData;
        if (InWeaponData.ATK == null || InWeaponData.ATK == undefined){
            this.ATK = InWeaponData.FSMParam.ATK;
        }
        else{
            this.ATK = InWeaponData.ATK;
        }
        
    },

    // update (dt) {},

    /* 激活攻击状态 */
    SetAttackType : function(){
        this.BInAttack = true;

        //减少武器的使用次数
        var GameData = cc.find("GameContainer").getComponent("GameData");
        if( GameData != null && GameData != undefined){
            GameData.useWeapon(this.WeaponData.id);
        }
    },

    /* 攻击状态结束 */
    SetAttackOver : function (){
        this.BInAttack = false;
    },

    CollisionCallBack : function(other, self , Target , Param){
        var BoxCollider = other.node.getComponent(cc.BoxCollider);
        if (BoxCollider )
        {
            if( BoxCollider.avtive == false ){
                cc.log("Other 的BoxCollider的激活状态是false！");
                return;
            }
        }
        if(Target.BInAttack == true){
            if(FunctionLibrary.GetCollisionType(other) == CommonUtil.EObjType.TYPE_BARRIER)
            {   
                other.node.emit( GlobalEventName.PlayerAttack , Target , other.node);
            }
            else if( FunctionLibrary.GetCollisionType(other) == CommonUtil.EObjType.TYPE_ENEMY ){
                other.node.emit( GlobalEventName.PlayerAttack , Target , other);
            }
            
        }
    },

});
