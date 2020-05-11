// 游戏管理器~ 啥作用呢~ 没想好。
// 其他组件获取此组件的方法： 
// var GameManager = cc.find("GameContainer").getComponent("GameManager");  //4.29 zh 取不到~~~

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
        this.LoadGameConfig();
        
        GameManager._instance = this;
        //让此Node不被destory
        cc.game.addPersistRootNode(this.node);
    },

    start () {
        //this.LoadGameConfig();
    },
    
    //update (dt) {},

    /**
     * 加载一些配置数据供后续使用
     */
    LoadGameConfig : function(){
        var self = this;
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

    /**
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
                        GameOverPlJS.SetOkBtnCall(self , "GameManager" , "ShareCall" , self);
                        GameOverPlJS.SetCancelBtnCall(self , "GameManager" , "ReLoadScene" , 111);
                    }
                }
            };
        });

    },

    /**
     * 游戏结束时的分享按钮点击回调
     */
    ShareCall : function(event, InTarget ) {
        cc.director.resume();
        InTarget.GameOverUI.destroy();

        if( GameInitPlayer._instance != null && GameInitPlayer._instance != undefined)
        {
            GameInitPlayer._instance.OnReCreatePlayer();
        }
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
