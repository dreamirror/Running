
const EItemType = require('ItemBase').EItemType;

const EventName = require("GlobalEventName");



cc.Class({
    extends: cc.Component,

    properties: {
        //可现实的物品
        OperateNum : 3,

        OperatePrefab : {
            default : null,
            type : cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //初始化底部的道具栏
        this.weaponBlock = [];
        for (let index = 0; index < this.OperateNum; index++) {
            let pb = cc.instantiate(this.OperatePrefab);
            if (pb) {
                
                pb.parent = cc.director.getScene();  //加到当前场景
                pb.setPosition( 100 + (index * 80), 420 );
                this.weaponBlock.push(pb);
            }
        }

        //监听道具获得
        //this.node.on('GetItem', this.updateOperateItem, this);
        EventCenter.on(EventName.GetItem,this.updateOperateItem,this);
    },

    start () {

    },

    updateOperateItem(ItemInfo){
        if (!ItemInfo) {
            return
        }

        if (ItemInfo.itemType == EItemType.GoldItem) {
            //直接被使用掉

        } else {
            //替换掉当前武器
            var GameData = cc.find("GameContainer").getComponent("GameData");
            GameData.addOrReplaceWeapon(ItemInfo);

            //更新背包里的道具来更新道具栏
            let info = GameData.getTempInfo();
            if (info && info.weapons) {
                for (let index = 0; index < info.weapons.length; index++) {
                    if (index > this.OperateNum) {
                        break;
                    }
                    const element = info.weapons[index];
                    if (element) {
                        this.weaponBlock[index].getComponent("OprateItemJS").init(element);
                    }
                }
            }
        }
    },

    // update (dt) {},

    onDestroy(){
        EventCenter.off(EventName.GetItem,this.updateOperateItem,this);
    },
});
