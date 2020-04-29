//挂载在UI上的执行逻辑

const ItemBase = require('ItemBase').ItemBase;
const Weapon = require('ItemBase').weapon;
const GoldItem = require('ItemBase').GoldItem;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;

cc.Class({
    extends: cc.Component,

    init(itemBase){
        this.ItemBase = itemBase;
    },

    onLoad () {
        var self = this;

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;     //开启碰撞检测

        if (this.ItemInfo) {
            var realUrl = cc.url.raw(self.ItemInfo.Icon);
            var texture = cc.textureCache.addImage(realUrl);
            this.node.getComponent(cc.Sprite).spriteFrame.setTexture(texture);
        }
    },

    //正常来说 只有主角会碰上道具
    onCollisionEnter:function(other,self){
        //得分 或者 替换武器
        var GameData = cc.find("GameContainer").getComponent("GameData");
         GameData.addItem( this.ItemBase,1);
    }
});
