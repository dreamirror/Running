const ItemBase = require('ItemBase').ItemBase;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;

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
        this.itemBlock = [];
        this.weaponBlock;
        for (let index = 0; index < this.OperateNum; index++) {
            let pb = cc.instantiate(this.OperatePrefab);
            if (pb) {
                
                pb.parent = cc.director.getScene();  //加到当前场景
                pb.setPosition( 100 + (index * 120), 20 );
                if (index == 0) {
                    this.weaponBlock = pb;
                } else {
                    this.itemBlock.push(pb);
                }
            }
        }
    },

    start () {
        if (true) {
            return;
        }
        //更新背包里的道具来更新道具栏
       // var GameData = cc.find("GameContainer").getComponent("GameData");
        let info = GameData.getPlayerInfo();
        if (info && info.itemArray) {
            for (let index = 0; index < info.itemArray.length; index++) {
                if (index > self.OperateNum) {
                    break;
                }

                const element = info.itemArray[index];
                if (element) {
                    if (element._Item.type == EItemType.Weapon ) {
                        let pb1 = this.weaponBlock;
                        pb1.getComponent("OprateItemJS").init(element);
                    } else {
                        let pb2 = this.itemBlock.pop();
                        pb2.getComponent("OprateItemJS").init(element);
                    }
                }
            }
        }
    },

    updateOperateItem(){
        //更新背包里的道具来更新道具栏
        var GameData = cc.find("GameContainer").getComponent("GameData");
        let info = GameData.getPlayerInfo();
        let _index = 0;
        if (info && info.itemArray) {
            for (let index = 0; index < info.itemArray.length; index++) {
                if (index > self.OperateNum) {
                    break;
                }

                const element = info.itemArray[index];
                if (element) {
                    if (element._Item.type == EItemType.Weapon) {
                        this.weaponBlock.getComponent("OprateItemJS").init(element);
                    } else {
                        this.itemBlock[_index].getComponent("OprateItemJS").init(element);
                        _index = _index + 1;
                    }
                }
            }
        }
    },

    // update (dt) {},
});
