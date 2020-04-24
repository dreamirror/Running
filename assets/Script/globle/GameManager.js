// 游戏管理器~ 啥作用呢~ 没想好。
// 其他组件获取此组件的方法：
// var GameManager = cc.find("GameContainer").getComponent("GameManager");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //让此Node不被destory
        cc.game.addPersistRootNode(this.node);
    },

    start () {

    },
    
    // update (dt) {},
});
