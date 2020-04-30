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
        cc.log(" ######  collision with item  ##########");
        var GameContainer = cc.find("GameContainer");
        if (!GameContainer) {
            return
        }
        if( _other.node.name.search("Player") != -1 ){
             //广播获得了道具
             let itemEvent = new cc.Event.EventCustom("GetItem", true);//创建自定义事件
             itemEvent.setUserData(this.OwnedItem);    //设置自定义事件中包含的数据
             this.node.dispatchEvent(itemEvent);    //用节点分发事件
        }   
    }
});
