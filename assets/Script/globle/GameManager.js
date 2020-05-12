// 游戏管理器~ 啥作用呢~ 没想好。
// 其他组件获取此组件的方法： 
// var GameManager = cc.find("GameContainer").getComponent("GameManager");  

var GameInitPlayer = require("GameInitPlayer");

var GameManager = cc.Class({
    extends: cc.Component,

    properties: {
        GameConfigData : null,
        EnemyConfigData : null,
    },

    statics: {
        _instance: null,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GameManager._instance = this;

        this.LoadGameConfig();
        //让此Node不被destory
        cc.game.addPersistRootNode(this.node);

        //注册一下一些微信使用的接口
        this.InitWX();
    },

    start () {
        this.GameData = cc.find("GameContainer").getComponent("GameData");
        this.ShareManager = cc.find("GameContainer").getComponent("ShareManager");
        //this.LoadGameConfig();
    },
    
    //update (dt) {},

    onDestroy() {
        this.ClearWX();
    },

    /**
     * 加载一些配置数据供后续使用
     */
    LoadGameConfig : function(){
        var self = this;
        //加载整个config
        cc.loader.loadResDir("Config", function (err, assets) { 
            if(err){
                cc.log(err); 
                return;
            } 
            for (const key in assets) {
                if (assets.hasOwnProperty(key)) {
                    const element = assets[key];
                    self[element.name] = element.json;
                }
            }
        });  

        cc.loader.loadRes("Config/GameConfig",function(err,object){
            if(err){
                cc.log(err); 
                return;
            } 
            self.GameConfigData = object.json;
        });
        cc.loader.loadRes("Config/EnemyConfig",function(err,object){
            if(err){
                cc.log(err); 
                return;
            } 
            self.EnemyConfigData = object.json;
        });
    },

    /************************* 初始化微信接口等 ******************************/
    InitWX : function(){
        if (typeof wx == 'undefined'){
            return ;
        }

        //添加一个小程序切前台事件的回调函数
        wx.onAppShow(this.OnAppShowFront);
        //添加一个切换到后台的回调
        wx.onAppHide(this.OnAppShowBack);
    
    },

    ClearWX : function(){
        if (typeof wx == 'undefined'){
            return ;
        }

        wx.offAppShow(this.OnAppShowFront);
        wx.offAppHide(this.OnAppShowBack);
    },

    OnAppShowFront : function(){
        cc.log( "AppShowFront" );
    },

    OnAppShowBack : function (){
        cc.log( "OnAppShowBack" );
    },

    /*************************        玩家死亡和重开相关        **********************************'/
     * 玩家死亡调用函数，开启广告复活按钮，开启分享按钮，显示重新开始界面等
     */
    GameOver : function(){
        /*cc.director.loadScene("GameScene",function(){
            cc.log("GameScene launched!");
        });*/
        if (this.GameConfigData == null){
            cc.log("GameConfigData没有加载进去！！！！");
            return;
        }

        cc.director.pause();

        //加载一个GameOver的UI
        var self = this;
        cc.loader.loadRes(this.GameConfigData.GameOverUIPre.Prefab ,function (errLoadWeapon, assetUI) {
            if(assetUI){
                self.GameOverUI = cc.instantiate(assetUI);
                if(self.GameOverUI)
                {
                    self.GameOverUI.parent = cc.director.getScene();
                    self.GameOverUI.setPosition(self.GameConfigData.GameOverUIPre.Pos[0],self.GameConfigData.GameOverUIPre.Pos[1]);
                    
                    //再为UI的两个按钮绑定两个回调
                    var GameOverPlJS = self.GameOverUI.getComponent("CommonTipsPl");
                    if(GameOverPlJS){
                        GameOverPlJS.SetOkBtnCall(self , "GameManager" , "ShareSuccessCallBack" , self);
                        GameOverPlJS.SetCancelBtnCall(self , "GameManager" , "ShareCancel" , self);
                    }
                }
            };
        });

        //清空数据等
        if (this.GameData == null || this.GameData == undefined){
            this.GameData = cc.find("GameContainer").getComponent("GameData");
        }
        this.GameData.clearTemp();

    },
    
    /**
     * 游戏结束时的分享按钮点击回调
     */
    ShareCall : function(event, InTarget ) {
        if (this.ShareManager == null || this.ShareManager == undefined){
            this.ShareManager = cc.find("GameContainer").getComponent("ShareManager");
        }
        
        this.ShareManager.OnStartShare(event, this);
    },
    
    /* 分享成功的回调 */
    ShareSuccessCallBack : function(event, InTarget ){
        console.log(" Share Succeed!!!!!!!");
        cc.director.resume();
        InTarget.GameOverUI.destroy();

        if( GameInitPlayer._instance != null && GameInitPlayer._instance != undefined)
        {
            GameInitPlayer._instance.OnReCreatePlayer();
        }
    },
    
    /** 
     * 取消分享
    */
    ShareCancel : function (event, InParam ){
        if (InTarget.ShareManager == null || InTarget.ShareManager == undefined){
            InTarget.ShareManager = cc.find("GameContainer").getComponent("ShareManager");
        }
        InTarget.ShareManager.ClearCurShareData();
        
        InParam.ReLoadScene();
    },

    /**
     * 重新加载场景
    */ 
    ReLoadScene : function(event, InParam ){
        cc.director.resume();
        cc.director.loadScene("GameScene",function(){
            cc.log("GameScene launched!");
        });
    },



});
