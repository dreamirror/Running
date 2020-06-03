
//Include下状态
var PlayerRunState = require("PlayerRunState");
var PlayerJumpState = require("PlayerJumpState");
var PlayerRushState = require("PlayerRushState");
var PlayerFlypyBirdState = require("PlayerFlypyBirdState");
var PlayerFallState = require("PlayerFallState");
var PlayerSwordRushState = require("PlayerSwordRushState");


var FSMUtil = require("FSMUtil");
var FSMMgr = require("FSMMgr");
var Player = require("Player");
var TestWeaponState = require("TestWeaponState");
var TestWeaponAttack = require("TestWeaponAttack");
var ActorManager = require("ActorManager");
var GravityManager = require("GravityManager");

var GameInitPlayer = cc.Class({
    extends: cc.Component,

    properties: {
        /*Player : {
            default : null,
            type : cc.Node,
            displayName : "玩家",
            tooltip : "选择玩家控制类",
        },

        //4.26 新添加 手臂武器组件
        RightArm : {
            default : null,
            type : cc.Node,
            displayName : "玩家武器手臂",
        },*/

        /* 玩家跳跃的初始加速度 */
        InitialSpeed : 10,
    },

    statics: {
        _instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GameInitPlayer._instance = this;

        //开启碰撞检测
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = false;

        //开启点击
        this.node.on( cc.Node.EventType.TOUCH_START , this.OnTouchStart , this,true);
        this.node.on( cc.Node.EventType.TOUCH_MOVE , this.OnTouchMove , this,true);
        this.node.on( cc.Node.EventType.TOUCH_END , this.OnTouchEnd , this,true);
        this.node.on( cc.Node.EventType.TOUCH_CANCEL , this.OnTouchCancel , this,true);
    },

    onDestroy () {
        this.node.off( cc.Node.EventType.TOUCH_START , this.OnTouchStart , this,true);
        this.node.off( cc.Node.EventType.TOUCH_MOVE , this.OnTouchMove , this,true);
        this.node.off( cc.Node.EventType.TOUCH_END , this.OnTouchEnd , this,true);
        this.node.off( cc.Node.EventType.TOUCH_CANCEL , this.OnTouchCancel , this,true);
    },

    start () {
        /*if (ActorManager._instance != null && ActorManager._instance != undefined)
        {
            this.Player = ActorManager._instance.CreatePlayer();
        }

        //加载玩家的config数据之后再初始化状态机
        var self = this;
        cc.loader.loadRes('Config/PlayerConfig',function (err, asset) {
            if(err){
                cc.log("加载玩家数据报错！：" + err); 
                return;
            };
            if( asset && asset.json ){
                // 初始化状态机
                self.PlayerJS = self.Player.getComponent("Player");
                self.PlayerJS.PlayerConfig = asset.json;
                self.InitFSM();
            }
        });*/
        //4.23 初始化状态机
        //this.InitFSM();
        this.CreatePlayer();

        //5.15 测试添加一个BOSS
        /*if (ActorManager._instance != null && ActorManager._instance != undefined)
        {
            this.TestBoss = ActorManager._instance.CreateBoss("TestBoss");
            this.TestBoss.parent = cc.find("Canvas/GameScene/EnemyScene")
            this.GameManager = cc.find("GameContainer").getComponent("GameManager");
            
            this.TestBoss.setPosition(100, 10);
   
        }*/
    },

    //将人物FSMupdate
    update (dt) {
        //this.InitFSM();
        if(this.FSMMgr)
        {
            this.FSMMgr.Update(dt);
        }
    },

    /***************** 设置状态机 ********************/
    InitFSM : function(){

        this.PlayerJS = this.Player.getComponent("Player");
        var PlayerConfig = this.PlayerJS.PlayerConfig;
        this.FSMMgr = new FSMMgr();
        if(this.FSMMgr)
        {
            this.FSMMgr.InitVariable();

            this.PlayerJS.FSMMgr = this.FSMMgr;

            //创建一个普通的跑路状态
            var playerRunState = new PlayerRunState();
            playerRunState.InitVariable(this.FSMMgr , this.Player , FSMUtil.FSMStateID.RUN);
            playerRunState.AddCondition(FSMUtil.TransConditionID.RunToJump , FSMUtil.FSMStateID.JUMP);         
        
            //创建一个跳跃状态
            var playerJumpState = new PlayerJumpState();
            playerJumpState.InitVariable(this.FSMMgr , this.Player , FSMUtil.FSMStateID.JUMP);
            playerJumpState.AddCondition(FSMUtil.TransConditionID.JumpToRun , FSMUtil.FSMStateID.RUN);      
            playerJumpState.InitJumpData(PlayerConfig.InitialSpeed);//this.InitialSpeed);

            //添加一个rush
            var playerRush = new PlayerRushState();
            playerRush.InitVariable(this.FSMMgr , this.Player , FSMUtil.FSMStateID.RUSH); 

            //添加一个风筝的Flypybird状态
            var FlypyBirdState = new PlayerFlypyBirdState();
            FlypyBirdState.InitVariable(this.FSMMgr , this.Player , FSMUtil.FSMStateID.FlypyBird); 
            FlypyBirdState.AddCondition(FSMUtil.TransConditionID.FlyToFall , FSMUtil.FSMStateID.FALL);   

            //御剑状态
            var SwordRushState = new PlayerSwordRushState();
            SwordRushState.InitVariable(this.FSMMgr , this.Player , FSMUtil.FSMStateID.SwordRush); 
            SwordRushState.AddCondition(FSMUtil.TransConditionID.FlyToFall , FSMUtil.FSMStateID.FALL);   
            

            //添加一个下落状态
            var FallState = new PlayerFallState();
            FallState.InitVariable(this.FSMMgr , this.Player , FSMUtil.FSMStateID.FALL);

            //设置状态机的初始状态
            this.FSMMgr.Init( FSMUtil.FSMStateID.RUN , playerRunState);
            //将状态添加进状态机
            this.FSMMgr.AddState( FSMUtil.FSMStateID.JUMP, playerJumpState );
            this.FSMMgr.AddState( FSMUtil.FSMStateID.RUSH, playerRush );
            this.FSMMgr.AddState( FSMUtil.FSMStateID.FlypyBird, FlypyBirdState );
            this.FSMMgr.AddState( FSMUtil.FSMStateID.FALL, FallState );
            this.FSMMgr.AddState( FSMUtil.FSMStateID.SwordRush, SwordRushState );

            playerRunState.BeforeEnter();

            cc.log( "FSMMgr Init!" );
        }
        else{
            cc.log( "FSMMgr is null!!!!" );
        }
    },

    /***************** 触碰相关，主要用来将触摸传递给FSMMgr ********************/
    OnTouchStart : function(event){
        if (this.FSMMgr != null){
            this.FSMMgr.OnTouchStart(event);
        }   
    },

	OnTouchMove : function(event){
        if (this.FSMMgr != null){
            this.FSMMgr.OnTouchMove(event);
        }   
    },

	OnTouchEnd : function(event){
        if (this.FSMMgr != null){
            this.FSMMgr.OnTouchEnd(event);
        }   
    },

	OnTouchCancel : function(event){
        if (this.FSMMgr != null){
            this.FSMMgr.OnTouchCancel(event);
        }   
    },

    ///////////////重新生成玩家相关/////////////////
    CreatePlayer : function( InStartPos ){
        if (ActorManager._instance != null && ActorManager._instance != undefined)
        {
            this.Player = ActorManager._instance.CreatePlayer();
            this.Player.parent = cc.find("Canvas/GameScene/PlayerScene")
            this.GameManager = cc.find("GameContainer").getComponent("GameManager");
            if (InStartPos != null && InStartPos != undefined){
                this.Player.setPosition(InStartPos);
            }
            else{
                if (this.GameManager ){
                    this.Player.setPosition(this.GameManager.GameConfigData.PlayerStartPos[0], this.GameManager.GameConfigData.PlayerStartPos[1]);
                }
                else{
                    this.Player.setPosition(76, 460);
                }
            }     
        }

        //加载玩家的config数据之后再初始化状态机
        var self = this;
        cc.loader.loadRes('Config/PlayerConfig',function (err, asset) {
            if(err){
                cc.log("加载玩家数据报错！：" + err); 
                return;
            };
            if( asset && asset.json ){
                // 初始化状态机
                self.PlayerJS = self.Player.getComponent("Player");
                self.PlayerJS.PlayerConfig = asset.json;
                self.InitFSM();
            }
        });
    },

    OnReCreatePlayer : function ( BAddShield) {
        if (this.Player != null && this.Player != undefined ) {
            //if(GravityManager._instance){
            //    var PlayerJS = this.Player.getComponent("Player");
            //    GravityManager._instance.UnRigisterToGravity(this.Player);
            //}  
            //this.Player.name = "Destroy_Player";
            //this.Player.destroy();
            //5.14 不然重新修改一下位置就好
            this.Player.setPosition(this.GameManager.GameConfigData.PlayerStartPos[0],this.GameManager.GameConfigData.PlayerStartPos[1]);

        }

        //this.CreatePlayer();
        //重新设置一下武器状态
        this.PlayerJS.ChangeWeapon(this.PlayerJS.PlayerConfig.DefaultWeaponID);

        this.PlayerJS.ReBorn();

        //为其添加一个护盾
        if (BAddShield == true){
            var GameData = cc.find("GameContainer").getComponent("GameData");
            
            GameData.applyShield();
        }
        
    },

});

module.exports = GameInitPlayer;