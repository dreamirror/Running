
//Include下状态
var PlayerRunState = require("PlayerRunState");
var PlayerJumpState = require("PlayerJumpState");
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

            //创建一个普通的跑路状态
            var playerRunState = new PlayerRunState();
            playerRunState.InitVariable(this.FSMMgr , this.Player , FSMUtil.FSMStateID.RUN);
            playerRunState.AddCondition(FSMUtil.TransConditionID.RunToJump , FSMUtil.FSMStateID.JUMP);         
        
            //创建一个跳跃状态
            var playerJumpState = new PlayerJumpState();
            playerJumpState.InitVariable(this.FSMMgr , this.Player , FSMUtil.FSMStateID.JUMP);
            playerJumpState.AddCondition(FSMUtil.TransConditionID.JumpToRun , FSMUtil.FSMStateID.RUN);      
            playerJumpState.InitJumpData(PlayerConfig.InitialSpeed);//this.InitialSpeed);

            //设置状态机的初始状态
            this.FSMMgr.Init( FSMUtil.FSMStateID.RUN , playerRunState);
            //将状态添加进状态机
            this.FSMMgr.AddState( FSMUtil.FSMStateID.JUMP, playerJumpState );
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
            this.Player.parent = cc.director.getScene();
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

    OnReCreatePlayer : function () {
        if (this.Player != null && this.Player != undefined ) {
            //if(GravityManager._instance){
            //    var PlayerJS = this.Player.getComponent("Player");
            //    GravityManager._instance.UnRigisterToGravity(this.Player);
            //}  
            //this.Player.name = "Destroy_Player";
            //this.Player.destroy();
            //5.14 不然重新修改一下位置就好
            this.Player.setPosition(76, 460);
        }

        //this.CreatePlayer();

        //为其添加一个护盾
        var GameData = cc.find("GameContainer").getComponent("GameData");
        GameData.applyShield();
    },

});

module.exports = GameInitPlayer;