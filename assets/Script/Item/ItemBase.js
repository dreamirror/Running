// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const EItemType = cc.Enum({
    Weapon : 0,  //武器道具
    Gold : 1,  //金币道具
    BUFF : 2,  //buff类道具
});


//物品基类
var ItemBase = cc.Class({
    properties : {
        ID : 0,
        ItemName : "物品",
        Icon: "",
        count : 0,

        itemType : {
            default : EItemType.Weapon,
            type : cc.Enum(EItemType),
        },
    },

    //new之后要初始化 
    init( id ) {
        this.ID = id;
        
        let cfg = cc.find("GameContainer").getComponent("GameManager").ItemConfig;
        if (cfg != undefined && cfg[id] != undefined) {
            this.ItemName = cfg[id].name;
            this.Icon = cfg[id].icon;
            this.itemType = cfg[id].type;
            this.count = cfg[id].count ? cfg[id].count : 0;

            this.buff = cfg[id].buff;
            this.buffTime = cfg[id].buffTime;
        }
    }
});


//某类道具的存储结构
var SaveItem = cc.Class({
    name : "savedata",

    properties : {
        _Item : {
            default : {},
        },
        _Num : 0,
    },

});


module.exports = {
    EItemType : EItemType,
    ItemBase : ItemBase,
    SaveItem : SaveItem,
};