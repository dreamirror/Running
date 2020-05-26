/*
    飞行道具的基类
*/

var WeaponBase = require("WeaponBase");

var Thunder = cc.Class({
    extends: WeaponBase,

    properties: {
        //暂时在5秒后消失，之后改成播完完整动画消失
        DispareCD : 2,

    },

    // onLoad () {},

    start () {
        this._super();
    },

    //设置武器的参数
    InitWeaponData : function ( InWeaponData){
        this._super(InWeaponData);
    },

    update (dt) {
        if(this.DispareCD > 0){
            this.DispareCD -=dt;
        }
        else{
            this.node.destroy();
        }

    },
});

module.exports = Thunder;