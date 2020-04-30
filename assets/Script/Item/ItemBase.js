// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const EItemType = cc.Enum({
    Weapon : 0,
    Gold : 1,
});


//物品基类
var ItemBase = cc.Class({
    properties : {
        ID : 0,
        ItemName : "物品",
        Icon: "",

        itemType : {
            default : EItemType.Weapon,
            type : cc.Enum(EItemType),
        },
    },

    //new之后要初始化
    init( id,name,icon,inType) {
        this.ID = id;
        this.ItemName = name;
        this.Icon = icon;
        this.itemType = inType;
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