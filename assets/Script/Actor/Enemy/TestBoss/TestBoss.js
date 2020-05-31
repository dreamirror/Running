/*
    测试的boss一号
*/

var EnemyBase = require("EnemyBase");
var CommonUtil = require("CommonUtil");
var EnemyPoisedState = require("EnemyPoisedState");
var EnemyDisAttState = require("EnemyDisAttState");
var EnMoveCloseState = require("EnMoveCloseState");
var EnMoveDisState = require("EnMoveDisState");
var FSMUtil = require("FSMUtil");

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

        this.AI.InitBossAI(this.EmenyData);
    },

    // update (dt) {},

    /********************** 敌人动画相关 , 具体由各个敌人自己去实现，由此达到播放不同动画的效果 ***********************/
    Idle : function () {
        this.PlayAnimation("TestBossIdle");
    },

    AttackAnima : function(  InTarget , InCallBack , InParam ){
        this.PlayAnimation("TestBossCloseAtt");
        this._super(InTarget , InCallBack , InParam);
    },

    DisAttAnima : function (  InTarget , InCallBack , InParam ){
        this.PlayAnimation("TestBossDisAtt");
        this._super(InTarget , InCallBack , InParam);
    },

    DeadAnima : function ( InCallBack ){
        this.PlayAnimation("LowBeeDead");
    },

    PoisedAnima : function(  ){
        this.PlayAnimation("TestBossPoised");
        //this._super(InTarget , InCallBack , InParam);
    },

    MoveAnima : function( ){
        this.PlayAnimation("TestBossMove");
    },

    /*************************     状态机相关     ************************/
    InitFSM : function(  ){
        this._super("EnemyLowBee");

        //远距离攻击状态机
        var DisAttState = new EnemyDisAttState();
        DisAttState.InitVariable(this.FSMMgr , this.node ,FSMUtil.FSMStateID.EnemyDistanceAttack);        

        //蓄力状态机
        var PoisedState = new EnemyPoisedState();
        PoisedState.InitVariable(this.FSMMgr , this.node ,FSMUtil.FSMStateID.EnemyPoised);      

        //走向近处状态
        var CloseState = new EnMoveCloseState();
        CloseState.InitVariable(this.FSMMgr , this.node ,FSMUtil.FSMStateID.EnemyMoveToClose); 

        //走向远处状态
        var DistanceState = new EnMoveDisState();
        DistanceState.InitVariable(this.FSMMgr , this.node ,FSMUtil.FSMStateID.EnemyMoveToDistance);

        //添加远距离攻击状态机
        this.FSMMgr.AddState( FSMUtil.FSMStateID.EnemyDistanceAttack, DisAttState );
        //添加近战蓄力攻击状态机
        this.FSMMgr.AddState( FSMUtil.FSMStateID.EnemyPoised, PoisedState );

        this.FSMMgr.AddState( FSMUtil.FSMStateID.EnemyMoveToClose, CloseState );
        this.FSMMgr.AddState( FSMUtil.FSMStateID.EnemyMoveToDistance, DistanceState );

    },

    /************************  具体攻击逻辑与显示相关 ***********************/
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
                //获取当前手的位置
                var ArmPos = this.HandNode.convertToWorldSpaceAR(cc.v2(0, 0));
                var ArmSize = this.HandNode.getContentSize();

                //计算下位置再转回来
                var WeaponPos = cc.v2(ArmPos.x + ArmSize.width , ArmPos.y + ArmSize.height / 1.3);
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
