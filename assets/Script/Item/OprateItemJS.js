
const ItemBase = require('ItemBase').ItemBase;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;

const EventName = require("GlobalEventName");

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

        defaultSpriteFrame : {
            default : null,
            type : cc.SpriteFrame,
        }
    },

    
    init(_ItemBase){
        this.OwnedItem = _ItemBase;
        let self = this;
        if (self.OwnedItem) {
            cc.loader.loadRes(this.OwnedItem.Icon, function(err,img){
                if (err) {
                    cc.log(err);
                    return;
                }
                let mylogo  = new cc.SpriteFrame(img); 
                if (self.BgNode) {
                    self.BgNode.getComponent(cc.Sprite).spriteFrame = mylogo;
                }
            });

            this.NumLabe.string = this.OwnedItem.count;
        }
    },

    reset(){
        this.OwnedItem = undefined;
        this.NumLabe.string = "";
        this.BgNode.getComponent(cc.Sprite).spriteFrame = this.defaultSpriteFrame;
    },


    ButtonTouch(){
        if (this.OwnedItem) {
            //广播把
            //let testEvent = new cc.Event.EventCustom("TouchItem", true);//创建自定义事件
            //testEvent.setUserData(this.OwnedItem);    //设置自定义事件中包含的数据
            //this.node.dispatchEvent(testEvent);    //用节点分发事件
            var GameData = cc.find("GameContainer").getComponent("GameData");
            GameData.resortWeapon(this.OwnedItem);

            EventCenter.emit(EventName.TouchItem,this.OwnedItem);
        }
    }
});
