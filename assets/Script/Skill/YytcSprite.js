// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
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

        Speed : 10000,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

     update (dt) {
        let windowSize=cc.view.getVisibleSize();
        var pos = this.node.getPosition();
        if(pos.x > windowSize.width + 10)
        {
            this.node.removeFromParent();
            return;
        }
        var x = pos.x + dt * 500;
        this.node.setPosition(cc.v2(x,pos.y))


     },

     ReduceWeaponCount : function(id) {
        var GameData = cc.find("GameContainer").getComponent("GameData");
        if( GameData != null && GameData != undefined){
            GameData.useWeapon(id);
        }
    },
});
