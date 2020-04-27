// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html




var SceneManager = cc.Class({
    extends: cc.Component,


    ctor: function () {
        cc.loader.loadRes("SceneConfig",function(err,object){
            if(err){
                cc.log(err); 
                return;
            } 
            this.Speed = object.json.Speed;
            });
    },
    
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
        Speed : 0,


    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {



     },

    start () {

    },

    // update (dt) {},
});
window.Global = {};

window.Global.SceneMnagerIns = new SceneManager();
cc.log("@@@@@@@@@@@@");
cc.log(window.Global.SceneMnagerIns.Speed)


window.SceneData = {
    Speed: 0,
    BgSpeed : 0,
    TaltleDistance :0,
};


cc.loader.loadRes("SceneConfig",function(err,object){
    if(err){
        cc.log(err); 
        return;
    } 
    window.SceneData.Speed = object.json.Speed;
    window.SceneData.BgSpeed = object.json.BgSpeed;
    });


