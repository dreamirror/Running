// 游戏数据类
// 其他组件获取此组件的方法：
// var GameData = cc.find("GameContainer").getComponent("GameData");

cc.Class({
    extends: cc.Component,

    properties: {
        //玩家基本信息(#注意。对象成员，至少要定义一个default 属性 或者，set/get方法，不然编译报错)
        playerInfo: {
            default: null,

            name: '哟哟',
            gold: 9000,
            weapon: 111,
        },

        //其他信息

    },

    //load 时候去找服务器拿消息吧，也可以单独搞个NetManager
    onLoad () {

    },

    //获取基本信息
    getPlayerInfo : function (){
        this.playerInfo;
    },

    addPlayerGold : function (num) {
        this.playerInfo.gold = this.playerInfo.gold + num;
    }



});
