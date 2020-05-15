
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
                pb.parent = cc.find(cc.Canvas);  //加到当前场景
                pb.setPosition( 50 + (index * 80) - 20, 80 );
                this.weaponBlock.push(pb);
            }
        }

        //监听道具获得
        EventCenter.on(EventName.GetItem,this.refreshOperateItem,this);
        EventCenter.on(EventName.TouchItem,this.refreshOperateItem,this);
        EventCenter.on(EventName.OnWeaponCount,this.refreshOperateItem,this);
    },

    refreshOperateItem(){
        //更新背包里的道具来更新道具栏
        var GameData = cc.find("GameContainer").getComponent("GameData");
        let info = GameData.getTempInfo();
        if (info && info.weapons) {
            for (let index = 0; index < this.OperateNum; index++) {
                const element = info.weapons[index];
                if (element) {
                    this.weaponBlock[index].getComponent("OprateItemJS").init(element);
                } else {
                    this.weaponBlock[index].getComponent("OprateItemJS").reset();
                }
            }
        }
    },

    // update (dt) {},

    onDestroy(){
        EventCenter.off(EventName.GetItem,this.refreshOperateItem,this);
        EventCenter.off(EventName.TouchItem,this.refreshOperateItem,this);
        EventCenter.off(EventName.OnWeaponCount,this.refreshOperateItem,this);
    },
});
