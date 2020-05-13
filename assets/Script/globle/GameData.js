// 游戏数据类
// 其他组件获取此组件的方法：
// var GameData = cc.find("GameContainer").getComponent("GameData");


const ItemBase = require('ItemBase').ItemBase;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;
const EventName = require("GlobalEventName");


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
        this.updateTime = 0;
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

    getPlayerGold : function() {
        return this.playerInfo.gold;
    },
    
    //获得金币
    addPlayerGold : function (num) {
        this.playerInfo.gold = this.playerInfo.gold + num;
    },

    //是否有磁铁BUFF
    checkPlayerMagnet : function () {
        for (let index = 0; index < this.tempInfo.buffs.length; index++) {
            let element = this.tempInfo.buffs[index];
            if (element && element.buff == "magnet") {
                return true;
            }
        }
        return false;
    },

    //是否有护盾BUFF
    checkPlayerShield : function () {
        for (let index = 0; index < this.tempInfo.buffs.length; index++) {
            let element = this.tempInfo.buffs[index];
            if (element && element.buff == "shield") {
                return true;
            }
        }
        return false;
    },

    //添加或替换武器
    addOrReplaceWeapon(_weapon){
        //已经有了就捡不起来
        for (let index = 0; index < this.tempInfo.weapons.length; index++) {
            const element = this.tempInfo.weapons[index];
            if (element && element.ID == _weapon.ID) {
                this.tempInfo.weapons[index].count += _weapon.count;

                //广播下武器数量变化
                EventCenter.emit(EventName.OnWeaponCount,this);
                return;
            }
        }

        if (this.tempInfo.weapons.length < 3) {  //小于3 直接加进去
            this.tempInfo.weapons.push(_weapon);
        }
        else
        {
            this.tempInfo.weapons.shift(); //删除第一个
            this.tempInfo.weapons.unshift(_weapon); //并插入到第一个
        }
    },

    //点击后重新排序
    resortWeapon : function (_weapon) {
        for (let index = 0; index < this.tempInfo.weapons.length; index++) {
            const element = this.tempInfo.weapons[index];
            if (element && element.ID == _weapon.ID) {
                this.tempInfo.weapons.splice(index,1); //先删
                break;
            }
        }
        //再插入到第一个位置
        this.tempInfo.weapons.unshift(_weapon);
    },

    //使用武器。次数减1.武器都带次数限制。
    useWeapon : function (weapon_id) {
        for (let index = 0; index < this.tempInfo.weapons.length; index++) {
            const element = this.tempInfo.weapons[index];
            if (element && element.ID == _weapon.ID) {

                this.tempInfo.weapons[index].count--;

                //广播下武器数量变化
                EventCenter.emit(EventName.OnWeaponCount,this);

                if (this.tempInfo.weapons[index].count <= 0 ) {
                    this.tempInfo.weapons.splice(index,1);
                    
                    //广播下武器清0
                    EventCenter.emit(EventName.OnWeaponClear,this);
                }
                return;
            }
        }
    },

    //这里使用道具暂时只做BUFF类道具的。（在playerinfo上加一个buff的标记）
    useItem : function (_ItemBase) {
        if (_ItemBase && _ItemBase.itemType == EItemType.BUFF ) {

            for (let index = 0; index < this.tempInfo.buffs.length; index++) {
                let element = this.tempInfo.buffs[index];
                if (element && element.buff == _ItemBase.buff) {
                    this.tempInfo.buffs[index].buffTime = _ItemBase.buffTime;
                    return;
                }
            }

            this.tempInfo.buffs.push({ buff : _ItemBase.buff, buffTime : _ItemBase.buffTime});
        }
    },

    //增加物品
    addItem : function(_ItemBase , _num) {
        let bAlreadyHave = false;
        for (let index = 0; index < this.playerInfo.itemArray.length; index++) {
            let element = this.playerInfo.itemArray[index];
            if (element && element._Item == _ItemBase) {
                bAlreadyHave == true;
                element._Num = element._Num + _num;
            }
        }
        if (bAlreadyHave == false) {
            let NewItems = new SaveItem();
            NewItems._Item = _ItemBase;
            NewItems._Num = _num; 
            this.playerInfo.itemArray.push(NewItems);
        }
    },

    //减少物品
    subItem : function(_ItemBase , _num){
        for (let index = 0; index < this.playerInfo.itemArray.length; index++) {
            let element = this.playerInfo.itemArray[index];
            if (element && element._Item == _ItemBase) {
                element._Num = element._Num - _num;
            }
        }
    },

    //添加护盾（重生时加个盾）
    applyShield : function (){
        let item = new ItemBase();
        item.init("shield","shield",null,EItemType.BUFF);
        this.useItem(item);
    },


    //清空身上的临时数据(BUFF和武器)
    clearTemp : function (params) {
        this.tempInfo.buffs.splice(0);
        this.tempInfo.weapons.splice(0);
    },

    //更新BUFF(TODO：先在这儿更新吧。正常来说最好自定义个定时器，不用了就干掉，性能会好点)
    update(dt){
        if (this.tempInfo.buffs.length == 0) {
            return;
        }

        this.updateTime = this.updateTime + dt;

        if (this.updateTime >= 1) {
            this.updateTime = 0;
            //累计满一秒才执行一次逻辑

            for (let index = this.tempInfo.buffs.length - 1; index >= 0 ; index--) {
                let element = this.tempInfo.buffs[index];
                if (element) {
                    this.tempInfo.buffs[index].buffTime = element.buffTime - 1;

                    if ( this.tempInfo.buffs[index].buffTime <= 0 ) {
                        this.tempInfo.buffs.splice(index,1);
                    }
                }
            }
        }


    },




    

    //////////////////////////////////////////////////////////
    
    //写数据到本地
    setInfoToLocal : function(){
        cc.sys.localStorage.setItem("playerinfo",JSON.stringify(this.playerInfo));
       // cc.sys.localStorage.setItem("tempInfo",JSON.stringify(this.tempInfo));
    },

    //读取数据并初始化userdata
    getInfoFromLocal : function (){
        cc.sys.localStorage
        let playerinfo = cc.sys.localStorage.getItem("playerinfo");
        if (playerinfo != null) {
            this.playerInfo =  JSON.parse(playerinfo);
        }
        // let tempInfo = cc.sys.localStorage.getItem("tempInfo");
        // if (tempInfo != null) {
        //     this.tempInfo =  JSON.parse(tempInfo);
        // }
        
    },
});
