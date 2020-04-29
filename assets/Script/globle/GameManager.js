// 游戏管理器~ 啥作用呢~ 没想好。
// 其他组件获取此组件的方法： 
// var GameManager = cc.find("GameContainer").getComponent("GameManager");  //4.29 zh 取不到~~~

cc.Class({
    extends: cc.Component,

    properties: {

    },

    statics : {
        _instance : null,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GameManager._instance = this;
        //让此Node不被destory
        cc.game.addPersistRootNode(this.node);
    },

    start () {

    },
    
    // update (dt) {},

    /**
     * 玩家死亡调用函数，开启广告复活按钮，开启分享按钮，显示重新开始界面等
     */
    GameOver : function(){
        cc.director.loadScene("GameScene",function(){
            cc.log("GameScene launched!");
        });
    },




});
