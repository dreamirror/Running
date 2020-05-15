/*
    测试的boss一号
*/

var EnemyBase = require("EnemyBase");
var CommonUtil = require("CommonUtil");
var GravityManager = require("GravityManager");

var TestBoss = cc.Class({
    extends: EnemyBase,

    properties: {
    
        HandNode : {
            default : null,
            type : cc.Node,
        }

    },

    // onLoad () {},

    start () {
        this._super();
    },

    // update (dt) {},

    /********************** 敌人动画相关 , 具体由各个敌人自己去实现，由此达到播放不同动画的效果 ***********************/
    Idle : function () {
        this.PlayAnimation("LowBeeIdle");
    },

    AttackAnima : function(  InTarget , InCallBack , InParam ){
        this.PlayAnimation("LowBeeAtt");
        this._super(InTarget , InCallBack , InParam);
    },

    DeadAnima : function ( InCallBack ){
        this.PlayAnimation("LowBeeDead");
    },

    PoisedAnima : function( InTarget , InCallBack , InParam ){
        this.PlayAnimation("LowBeeAtt");
        this._super(InTarget , InCallBack , InParam);
    },

    /*************************     状态机相关     ************************/
    InitFSM : function(  ){
        this._super("EnemyLowBee");

        //添加远距离攻击状态机
        
        //添加近战蓄力攻击状态机


    },

    /************************  具体攻击逻辑与显示相关 ***********************/
    //创建远程攻击
    CreateDisAtt : function( ){
        var PoolManager = cc.find("GameContainer").getComponent("PoolManager");  

        //创建远距离攻击武器
        //根据武器ID找到对应的武器配置
        if (this.DisWeaponData == null ||this.DisWeaponData == undefined ){
            var GameManager = cc.find("GameContainer").getComponent("GameManager");
            if( GameManager.WeaponConfig ){
                this.DisWeaponData = GameManager.WeaponConfig.weapons[this.EmenyData.DisAttackParam.id];
            }
        }
        
        if ( this.DisWeaponData && this.DisWeaponData.id){//this.EmenyData.DisAttackParam.ID ){
            var CurWeapon = PoolManager.request(this.DisWeaponData.id);//ActorManager._instance.CreateFlyWeapon(this.WeaponParam.id);
            if (CurWeapon){
                CurWeapon.parent = cc.find("Canvas/GameScene/EnemySceneScene")//cc.director.getScene();
                //获取当前手的位置
                var ArmPos = this.HandNode.convertToWorldSpaceAR(cc.v2(0, 0));
                var ArmSize = this.HandNode.getContentSize();

                //计算下位置再转回来
                var WeaponPos = cc.v2(ArmPos.x + ArmSize.width , ArmPos.y + ArmSize.height / 1.3);
                var EnemySceneScene = cc.find("Canvas/GameScene/EnemySceneScene");
                WeaponPos = EnemySceneScene.convertToNodeSpace(WeaponPos);

                CurWeapon.setPosition(WeaponPos);//(ArmPos.x + ArmSize.width , ArmPos.y + ArmSize.height / 1.3);
                var FlyWeaponJS = CurWeapon.getComponent("FlyWeaponBase");
                FlyWeaponJS.InitWeaponData(this.DisWeaponData);

                FlyWeaponJS.SetAttackType();
                FlyWeaponJS.ReduceWeaponCount();
            }
            //PoolManager.
        }
    },

});
