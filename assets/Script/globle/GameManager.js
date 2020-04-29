// 游戏管理器~ 啥作用呢~ 没想好。
// 其他组件获取此组件的方法：
// var GameManager = cc.find("GameContainer").getComponent("GameManager");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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
        
    },




});
