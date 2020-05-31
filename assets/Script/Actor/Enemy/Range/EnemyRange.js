/**
 * 远程杂兵
 */

var EnemyBase = require("EnemyBase");
var CommonUtil = require("CommonUtil");
var GravityManager = require("GravityManager");

var EnemyRange = cc.Class({
   extends: EnemyBase,

   properties: {
   },

   // LIFE-CYCLE CALLBACKS:

   // onLoad () {},

   start () {
       this._super();
   },

   /********************** 状态相关 ***********************/
   OnAttacked : function(AttackerJS ,TargetCollision){
       this._super(AttackerJS ,TargetCollision);
   },

   /* 死亡动画 */
   ActorDead : function(){
       this._super();
   },
   
   /********************** 敌人动画相关 , 具体由各个敌人自己去实现，由此达到播放不同动画的效果 ***********************/
   Idle : function () {
       this.PlayAnimation("RangeIdle");
   },

   AttackAnima : function(  InTarget , InCallBack , InParam ){
       this.PlayAnimation("RangeAtt");
       this._super(InTarget , InCallBack , InParam);
   },

   DisAttAnima : function(  InTarget , InCallBack , InParam ){
       this.PlayAnimation("RangeAtt");
       this._super(InTarget , InCallBack , InParam);
   },

   DeadAnima : function ( InCallBack ){
       this.PlayAnimation("RangeDead");
   },

   /*************************     状态机相关     ************************/
   InitFSM : function(  ){
       this._super("EnemyLowBee");
   },


   //创建远程攻击
   CreateDisAtt : function( ){
    var PoolManager = cc.find("GameContainer").getComponent("PoolManager");  

    //创建远距离攻击武器
    //根据武器ID找到对应的武器配置
    if (this.EmenyData.DisWeaponData == null ||this.EmenyData.DisWeaponData == undefined ){
        var GameManager = cc.find("GameContainer").getComponent("GameManager");
        if( GameManager.WeaponConfig ){
            this.EmenyData.DisWeaponData = GameManager.WeaponConfig.weapons[this.EmenyData.DisAttackParam.id];
        }
    }
    
    if ( this.EmenyData.DisWeaponData && this.EmenyData.DisWeaponData.id){//this.EmenyData.DisAttackParam.ID ){
        var CurWeapon = PoolManager.request(this.EmenyData.DisWeaponData.id);//ActorManager._instance.CreateFlyWeapon(this.WeaponParam.id);
        if (CurWeapon){
            CurWeapon.parent = cc.find("Canvas/GameScene/EnemyScene")//cc.director.getScene();
            CurWeapon.name = this.EmenyData.DisWeaponData.name;
            //获取当杂兵的位置
            var ArmPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
            var ArmSize = this.node.getContentSize();

            //计算下位置再转回来
            var WeaponPos = cc.v2(ArmPos.x - ArmSize.width/2 , ArmPos.y + ArmSize.height / 3);
            var EnemyScene = cc.find("Canvas/GameScene/EnemyScene");
            WeaponPos = EnemyScene.convertToNodeSpaceAR(WeaponPos);

            CurWeapon.setPosition(WeaponPos);//(ArmPos.x + ArmSize.width , ArmPos.y + ArmSize.height / 1.3);
            var FlyWeaponJS = CurWeapon.getComponent("FlyWeaponBase");
            FlyWeaponJS.InitWeaponData(this.EmenyData.DisWeaponData);

            FlyWeaponJS.SetAttackType();
            //FlyWeaponJS.ReduceWeaponCount();
        }
        //PoolManager.
    }
},
});

module.exports = EnemyRange;