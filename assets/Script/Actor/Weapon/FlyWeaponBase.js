/*
    飞行道具的基类
*/

var WeaponBase = require("WeaponBase");
var CommonUtils = require("CommonUtil");

var FlyWeaponBase = cc.Class({
    extends: WeaponBase,

    properties: {
        //飞行方向
        MoveDirection : CommonUtils.MoveDirection.MoveRight,
        
        //飞行速度
        MoveSpeed : 0,
    },

    // onLoad () {},

    start () {
        this._super();
    },

    //设置武器的参数
    SetWeaponData : function( InWeaponParam ){
        this.MoveDirection = InWeaponParam.MoveType;
        this.MoveSpeed = InWeaponParam.Speed;
    },

    update (dt) {
        //根据飞行方向与速度等进行飞行  
        var Pos = this.node.getPosition();
        this.node.setPosition( Pos.x + this.MoveSpeed * this.MoveDirection, Pos.y );
    },
});

module.exports = FlyWeaponBase;