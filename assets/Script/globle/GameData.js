// 游戏数据类
// 其他组件获取此组件的方法：
// var GameData = cc.find("GameContainer").getComponent("GameData");


const ItemBase = require('ItemBase').ItemBase;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;
const EventName = require("GlobalEventName");

const MaxActivePoint = 5;   //体力上限
const ActivePointRecoverTime = 3600000; //体力回复间隔1小时，毫秒

cc.Class({
    extends: cc.Component,

    properties: {
        //玩家基本信息(#注意。对象成员，至少要定义一个default 属性 或者，set/get方法，不然编译报错) 需要持久化的。
        playerInfo: {
            default : {},
            name: 'Player',
            gold: 0,
            activePoint: 5, //行动点（体力）
            activePointTimeStamp : 0, //体力开始回复的时间戳，每次开始回复一点体力的时候更新一次。
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
            name: 'Player',
            gold: 0,
            activePoint: 5, 
            activePointTimeStamp : 0, 
            itemArray : [],
        };
        this.tempInfo = {
            buffs : [], //临时属性
            weapons : [], //捡到的武器
        };
        this.updateTime = 0;

        this.recoverActivePointTag = false;  //是否在回复体力
        this.nextRecoverTime = 0; //毫秒

        this.setInfoToLocal();
    },

    //重本地读取记录
    onLoad () {
        this.getInfoFromLocal();
        let self = this;

        cc.game.on(cc.game.EVENT_HIDE, function(){
    　　　　 cc.log("游戏进入后台");
            self.setInfoToLocal();
    　　},this);
        this.MaxActivePoint = MaxActivePoint;
        this.checkOfflineActivePoint();
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
    
    //获得金币(传负数就是扣除金币)
    //返回操作成功或失败
    addPlayerGold : function (num) {
        if (num < 0 && this.playerInfo.gold < Math.abs(num)) {
            cc.log("## 金币不足 ##")
            return false;
        }
        this.playerInfo.gold = this.playerInfo.gold + num;
        EventCenter.emit(EventName.GoldChange,this);
        return true;
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
            if (element && element.ID == weapon_id) {

                this.tempInfo.weapons[index].count--;

                if (this.tempInfo.weapons[index].count <= 0 ) {
                    this.tempInfo.weapons.splice(index,1);
                    
                    //广播下武器清0
                    EventCenter.emit(EventName.OnWeaponClear,this);
                }
                
                //广播下武器数量变化
                EventCenter.emit(EventName.OnWeaponCount,this);
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
            
            //广播下BUFF
            EventCenter.emit(EventName.GetBuff,this);
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

    //更新BUFF和体力回复(TODO：先在这儿更新吧。正常来说最好自定义个定时器，不用了就干掉，性能会好点)
    update(dt){
        //体力回复的逻辑
        if (this.recoverActivePointTag == true) {
            this.nextRecoverTime -= (dt*1000);
            if (this.nextRecoverTime <= 0) {
                this.doRecoverPoint();
            }
        }


        //下面是BUFF的逻辑
        if (this.tempInfo.buffs.length == 0) {
            return;
        }
        this.updateTime = this.updateTime + dt;

        //累计满一秒才执行一次逻辑
        if (this.updateTime >= 1) {
            this.updateTime = 0;

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



    //检查离线回复的体力
    checkOfflineActivePoint() {
        if (this.playerInfo.activePoint < MaxActivePoint) {
            let recoverP = Math.floor((this.getNowTimestamp() - this.playerInfo.activePointTimeStamp) / ActivePointRecoverTime); //离线已回复点数
            let recoverTime = (this.getNowTimestamp() - this.playerInfo.activePointTimeStamp) % ActivePointRecoverTime;     //离线已回复整点数之外的 已回复时间

            this.playerInfo.activePoint += recoverP;
            if (this.playerInfo.activePoint >= MaxActivePoint) {
                this.playerInfo.activePoint = MaxActivePoint;
                return;
            }

            this.recoverActivePointTag = true; //需要回复。
            this.nextRecoverTime = ActivePointRecoverTime - recoverTime; //下一点还要回复的时间。
        }
    },

    //恢复一点并检查还要回复不
    doRecoverPoint: function() {
        if (this.playerInfo.activePoint < MaxActivePoint) {
            this.playerInfo.activePoint += 1;
            if (this.playerInfo.activePoint >= MaxActivePoint) {
                this.recoverActivePointTag = false;
                this.nextRecoverTime = 0;
            } else {
                this.recoverActivePointTag = true;
                this.nextRecoverTime = ActivePointRecoverTime;
                //重置时间戳
                this.playerInfo.activePointTimeStamp = this.getNowTimestamp(); 
            }
            
            EventCenter.emit(EventName.ActivePointChange,this);

            return;
        }
        this.recoverActivePointTag = false;
        this.nextRecoverTime = 0;
    },

    //消耗一点体力并检查回复
    //消耗的时候设置下时间戳。防止下线后不知道什么时候开始回复的
    costActivePoint : function() {
        if (this.playerInfo.activePoint > 0) {
            this.playerInfo.activePoint -= 1;

            EventCenter.emit(EventName.ActivePointChange,this);

            //正处于回复状态就不管
            if (this.recoverActivePointTag == true) {
                return;
            }

            //不在正回复，则开始回复倒计时
            this.recoverActivePointTag = true;
            this.nextRecoverTime = ActivePointRecoverTime;
            this.playerInfo.activePointTimeStamp = this.getNowTimestamp();
        }
    },

    //获取当前时间戳
    getNowTimestamp : function()
    {
        return (new Date).getTime();
    },








    //////////////////////////////////////////////////////////
    
    //写数据到本地
    setInfoToLocal : function(){
        cc.sys.localStorage.setItem("playerinfo",JSON.stringify(this.playerInfo));
       // cc.sys.localStorage.setItem("tempInfo",JSON.stringify(this.tempInfo));
    },

    //读取数据并初始化userdata
    getInfoFromLocal : function (){
        let playerinfo = cc.sys.localStorage.getItem("playerinfo");
        if (playerinfo != null && playerinfo != undefined) {
            var ParseData = JSON.parse(playerinfo);
            if(ParseData != null && ParseData != undefined){
                //this.playerInfo = ParseData;  //直接整个覆盖的话 新增属性就不好加。
                for (const key in ParseData) { 
                    const element = ParseData[key];
                    this.playerInfo[key] = element;    
                }
            }
        }

        // let tempInfo = cc.sys.localStorage.getItem("tempInfo");
        // if (tempInfo != null) {
        //     this.tempInfo =  JSON.parse(tempInfo);
        // }
        
    },
});
