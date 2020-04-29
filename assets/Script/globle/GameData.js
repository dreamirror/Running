// 游戏数据类
// 其他组件获取此组件的方法：
// var GameData = cc.find("GameContainer").getComponent("GameData");


const ItemBase = require('ItemBase').ItemBase;
const Weapon = require('ItemBase').weapon;
const GoldItem = require('ItemBase').GoldItem;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;



cc.Class({
    extends: cc.Component,

    properties: {
        //玩家基本信息(#注意。对象成员，至少要定义一个default 属性 或者，set/get方法，不然编译报错)
        playerInfo: {
            default: null,

            name: '哟哟',
            gold: 9000,
            weapon: 111,
            itemArray : {
                default : [],
                type : SaveItem,
            },
        },

        //其他信息
        otherInfo : {
            default: null,
            abc : 10,
        },
    },

    //重本地读取记录
    onLoad () {
        this.getInfoFromLocal();
    },

    onDestroy(){
        this.setInfoToLocal();
    },
    ///////////////////////////////////////////////////////
    //获取基本信息
    getPlayerInfo : function (){
        this.playerInfo;
    },

    addPlayerGold : function (num) {
        this.playerInfo.gold = this.playerInfo.gold + num;
    },

    //物品
    addItem : function(_ItemBase , _num) {
        let bAlreadyHave = false;
        for (let index = 0; index < itemArray.length; index++) {
            const element = itemArray[index];
            if (element && element._Item == _ItemBase) {
                bAlreadyHave == true;
                element._Num = element._Num + _num;
            }
        }
        if (bAlreadyHave == false) {
            let NewItems = new SaveItem();
            NewItems._Item = _ItemBase;
            NewItems._Num = _num; 
            this.items.push(Item);
        }
    },

    //增加
    subItem : function(_ItemBase , _num){
        for (let index = 0; index < itemArray.length; index++) {
            const element = itemArray[index];
            if (element && element._Item == _ItemBase) {
                element._Num = element._Num - _num;
            }
        }
    },







    //////////////////////////////////////////////////////////
    
    //写数据到本地
    setInfoToLocal : function(){
        cc.sys.localStorage.setItem("playerinfo",JSON.stringify(this.playerInfo));
        cc.sys.localStorage.setItem("otherinfo",JSON.stringify(this.otherInfo));
    },

    //读取数据并初始化userdata
    getInfoFromLocal : function (){
        cc.sys.localStorage
        let playerinfo = cc.sys.localStorage.getItem("playerinfo");
        let otherinfo = cc.sys.localStorage.getItem("otherinfo");
        if (playerinfo != null) {
            this.playerInfo =  JSON.parse(playerinfo);
        }
        if (otherinfo != null) {
            this.otherinfo =  JSON.parse(playerinfo);
        }
        
    },
});
