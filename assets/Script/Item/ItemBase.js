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
    init( id,name,icon) {
        this.ID = id;
        this.ItemName = name;
        this.Icon = icon;
    }
});

//加技能/动画
var Weapon  = cc.Class({
    extends : ItemBase,

    properties : {
        itemType : {
            default : EItemType.Weapon,
            type : cc.Enum(EItemType),
            override: true,
        },

        grantedAinm : "",
        grantedAbility : "",
    },
});

//加钱
var GoldItem  = cc.Class({
    extends : ItemBase,

    properties : {
        itemType : {
            default : EItemType.Gold,
            type : cc.Enum(EItemType),
            override: true,
        },

        grantedGold : 10,
    },
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
    Weapon : Weapon,
    GoldItem : GoldItem,
    SaveItem : SaveItem,
};