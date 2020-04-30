// 游戏数据类
// 其他组件获取此组件的方法：
// var GameData = cc.find("GameContainer").getComponent("GameData");


const ItemBase = require('ItemBase').ItemBase;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;


cc.Class({
    extends: cc.Component,

    properties: {
        //玩家基本信息(#注意。对象成员，至少要定义一个default 属性 或者，set/get方法，不然编译报错) 需要持久化的。
        playerInfo: {
            default : {},
            name: '哟哟',
            gold: 9000,
            itemArray : [],
        },

        //其他信息（本局游戏的临时信息）
        tempInfo : {
            default: {},

            buffs : [], //临时属性
            weapons : [], //捡到的武器
        },
    },

    ctor(){
        this.playerInfo = {
            name: '哟哟',
            gold: 9000,
            itemArray : [],
        };
        this.tempInfo = {
            buffs : [], //临时属性
            weapons : [], //捡到的武器
        };
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
        return this.playerInfo;
    },

    //获取临时信息
    getTempInfo : function (){
        return this.tempInfo;
    },
    

    //添加或替换武器
    addOrReplaceWeapon(_weapon){
        //已经有了就捡不起来
        for (let index = 0; index < this.tempInfo.weapons.length; index++) {
            const element = self.tempInfo.weapons[index];
            if (element && element.id == _weapon.id) {
                return;
            }
        }

        if (this.tempInfo.weapons.length < 3) {  //小于3 直接加进去
            this.tempInfo.weapons.push(_weapon);
        }
        else
        {
            this.tempInfo.weapons.shift(); //删除第一个
            this.tempInfo.weapons.push(_weapon);
        }
    },


    addPlayerGold : function (num) {
        self.playerInfo.gold = self.playerInfo.gold + num;
    },

    //物品
    addItem : function(_ItemBase , _num) {
        let bAlreadyHave = false;
        for (let index = 0; index < self.playerInfo.itemArray.length; index++) {
            const element = self.playerInfo.itemArray[index];
            if (element && element._Item == _ItemBase) {
                bAlreadyHave == true;
                element._Num = element._Num + _num;
            }
        }
        if (bAlreadyHave == false) {
            let NewItems = new SaveItem();
            NewItems._Item = _ItemBase;
            NewItems._Num = _num; 
            self.playerInfo.itemArray.push(NewItems);
        }
    },

    //增加
    subItem : function(_ItemBase , _num){
        for (let index = 0; index < self.playerInfo.itemArray.length; index++) {
            const element = self.playerInfo.itemArray[index];
            if (element && element._Item == _ItemBase) {
                element._Num = element._Num - _num;
            }
        }
    },







    //////////////////////////////////////////////////////////
    
    //写数据到本地
    setInfoToLocal : function(){
        cc.sys.localStorage.setItem("playerinfo",JSON.stringify(this.playerInfo));
        cc.sys.localStorage.setItem("tempInfo",JSON.stringify(this.tempInfo));
    },

    //读取数据并初始化userdata
    getInfoFromLocal : function (){
        cc.sys.localStorage
        let playerinfo = cc.sys.localStorage.getItem("playerinfo");
        let tempInfo = cc.sys.localStorage.getItem("tempInfo");
        if (playerinfo != null) {
            this.playerInfo =  JSON.parse(playerinfo);
        }
        if (tempInfo != null) {
            this.tempInfo =  JSON.parse(tempInfo);
        }
        
    },
});
