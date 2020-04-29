// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        var self = this;
    },

    start () {
        var GameData = cc.find("GameContainer").getComponent("GameData");
        let info = GameData.getPlayerInfo();
        if (info) {
            for (let index = 0; index < info.itemArray.length; index++) {
                if (index > self.OperateNum) {
                    break;
                }

                const element = info.itemArray[index];
                if (element) {
                    let pb = cc.instantiate(self.OperatePrefab);
                    pb.parent = self.node;
                    pb.setPosition( 150 + (index * 80), 20 );
                    pb.getComponent("OprateItemJS").init(element);
                }
            }
        }
    },

    // update (dt) {},
});
