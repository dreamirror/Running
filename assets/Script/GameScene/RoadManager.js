// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
DesignSize = 960;
var RoadManager = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        roadPerfab_1: {

            default : null,
            type : cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    initRoad : function(){
        var road = cc.instantiate(this.roadPrefab);
        var width = DesignSize;
        cc.log("width=="+road.width);
        var num = (width / road.width) + 1;
        for(var i = 0;i < num;i++)
        {   
            cc.log("i=="+i);
            var road = this.spawnRoad(0);
            road.setPosition(road.width * i,0);
        }
    },

    // update (dt) {},
});


module.exports = RoadManager;