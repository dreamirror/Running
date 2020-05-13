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
    InitWeaponData : function ( InWeaponData){
        this._super(InWeaponData);
        this.MoveDirection = InWeaponData.MoveType;
        this.MoveSpeed = InWeaponData.Speed;
    },

    update (dt) {
        //根据飞行方向与速度等进行飞行  
        var Pos = this.node.getPosition();
        var MoveToX = Pos.x + this.MoveSpeed * this.MoveDirection;

        this.node.setPosition( MoveToX, Pos.y );

        //如果超出屏幕，清除
        var windowSize=cc.view.getVisibleSize();
        if( this.MoveDirection == CommonUtils.MoveDirection.MoveRight){
            if (  windowSize.width < MoveToX - this.node.getContentSize().width ){
                this.node.destroy();
            }
        }
        else{
            if ( MoveToX - this.node.getContentSize().width < 0 ){
                this.node.destroy();
            }
        }
    },
});

module.exports = FlyWeaponBase;