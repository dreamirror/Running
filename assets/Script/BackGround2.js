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
        back_1 : {
            default: null,
            type: cc.Node
        },
        back_2 :{
            default: null,
            type: cc.Node
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

     update (dt) {

        this.back_1.setPosition(this.back_1.getPosition().x - window.SceneData.BgSpeed *dt,0)
        this.back_2.setPosition(this.back_2.getPosition().x -  window.SceneData.BgSpeed *dt,0)
        if(this.back_1.getPosition().x <= -this.back_1.width)
        {
            this.back_1.setPosition(this.back_2.getPosition().x + this.back_1.width,0);
        }

        if(this.back_2.getPosition().x <= -this.back_2.width){
            this.back_2.setPosition(this.back_1.getPosition().x +this.back_2.width,0);
        }
     },
});
