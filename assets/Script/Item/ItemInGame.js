//挂载在UI上的执行逻辑

const ItemBase = require('ItemBase').ItemBase;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;



cc.Class({
    extends: cc.Component,

    init(itemBase){
        this.ItemInfo = itemBase;
        let self = this;  

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;     //开启碰撞检测
        cc.director.getCollisionManager().enabledDebugDraw = true;

        if (self.ItemInfo) {
            cc.loader.loadRes(self.ItemInfo.Icon, function(err,img){
                var mylogo  = new cc.SpriteFrame(img); 
                self.node.getComponent(cc.Sprite).spriteFrame = mylogo;
            });
        }
    },

    onLoad () {
  
    },

    //正常来说 只有主角会碰上道具
    onCollisionEnter:function(_other,_self){
        //得分 或者 替换武器
        // var GameData = cc.find("GameContainer").getComponent("GameData");
        // GameData.addItem( self.ItemInfo,1);
    }
});
