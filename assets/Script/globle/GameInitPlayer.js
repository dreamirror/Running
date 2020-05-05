
//Include下状态
var PlayerRunState = require("PlayerRunState");
var PlayerJumpState = require("PlayerJumpState");
var FSMUtil = require("FSMUtil");
var FSMMgr = require("FSMMgr");
var Player = require("Player");
var TestWeaponState = require("TestWeaponState");
var TestWeaponAttack = require("TestWeaponAttack");


cc.Class({
    extends: cc.Component,

    properties: {
        Player : {
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
        },

        /* 玩家跳跃的初始加速度 */
        InitialSpeed : 10,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        //开启碰撞检测
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;

        //开启点击
        this.node.on( cc.Node.EventType.TOUCH_START , this.OnTouchStart , this,true);
        this.node.on( cc.Node.EventType.TOUCH_MOVE , this.OnTouchMove , this,true);
        this.node.on( cc.Node.EventType.TOUCH_END , this.OnTouchEnd , this,true);
        this.node.on( cc.Node.EventType.TOUCH_CANCEL , this.OnTouchCancel , this,true);

    },

    start () {
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
        //4.23 初始化状态机
        //this.InitFSM();
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
            playerRunState.InitVariable(this.FSMMgr , this.Player);
            playerRunState.AddCondition(FSMUtil.TransConditionID.RunToJump , FSMUtil.FSMStateID.JUMP);         
        
            //创建一个跳跃状态
            var playerJumpState = new PlayerJumpState();
            playerJumpState.InitVariable(this.FSMMgr , this.Player);
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

});
