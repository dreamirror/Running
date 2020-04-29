
const ItemBase = require('ItemBase').ItemBase;
const Weapon = require('ItemBase').weapon;
const GoldItem = require('ItemBase').GoldItem;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;


cc.Class({
    extends: cc.Component,

    properties: {
        ButtonArea: {
            default: null,        // The default value will be used only when the component attaching
            type: cc.Button, // optional, default is typeof default
        },
        BgNode : {
            default : null,
            type : cc.Node,
        },

        NumLabe : {
            default : null,
            type : cc.Label,
        },

        OwnedItem : {   
            default : null,
            type : SaveItem,
        },
    },

    
    init(SaveItem){
        this.OwnedItem = SaveItem;
    },

    onLoad () {
        if (this.OwnedItem) {
            var realUrl = cc.url.raw(self.OwnedItem._Item.Icon);
            var texture = cc.textureCache.addImage(realUrl);
            this.BgNode.getComponent(cc.Sprite).spriteFrame.setTexture(texture);

            this.NumLabe.string = self.OwnedItem._Num;
        }
    },


    // update (dt) {},

    ButtonTouch(){
        var GameData = cc.find("GameContainer").getComponent("GameData");
        if (this.OwnedItem && this.OwnedItem._Num > 0) {
            GameData.subItem(this.OwnedItem._Item,1);
        }
        //广播把
        let testEvent = new cc.Event.EventCustom("TouchItem", true);//创建自定义事件
        testEvent.setUserData(this.OwnedItem._Item);    //设置自定义事件中包含的数据
        this.node.dispatchEvent(testEvent);    //用节点分发事件
    }
});
