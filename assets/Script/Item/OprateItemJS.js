
const ItemBase = require('ItemBase').ItemBase;
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
    },

    
    init(_ItemBase){
        this.OwnedItem = _ItemBase;
        let self = this;
        if (self.OwnedItem) {
            cc.loader.loadRes(this.OwnedItem.icon, function(err,img){
                if (err) {
                    cc.log(err);
                    return;
                }
                let mylogo  = new cc.SpriteFrame(img); 
                self.BgNode.getComponent(cc.Sprite).spriteFrame = mylogo;
            });

            this.NumLabe.string = 1;
        }
    },


    ButtonTouch(){
        cc.log("####  item clicked  ##########")
        if (this.OwnedItem) {
            //广播把
            let testEvent = new cc.Event.EventCustom("TouchItem", true);//创建自定义事件
            testEvent.setUserData(this.OwnedItem);    //设置自定义事件中包含的数据
            this.node.dispatchEvent(testEvent);    //用节点分发事件
        }
    }
});
