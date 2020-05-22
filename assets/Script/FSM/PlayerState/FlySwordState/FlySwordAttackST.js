/*
飞剑状态机：飞行
*/

var FSMUtil = require("FSMUtil");
var WeaponBaseState = require("WeaponBaseState");
var RightArm = require("RightArm");

var FlySwordAttackST = cc.Class({
    extends: WeaponBaseState,

    ctor: function ( ) {
    },

    properties: {
        BResponseTouch : {
            default : false,
            override : true,
        },
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        //从TargetOBJ上获取对应的PlayerJS
        this.ArmJS = this.TargetObj.getComponent("RightArm");
        this.bAttackOver = false;
    },

    Update : function(dt){
        //这应该是飞剑飞出来攻击再飞回来的过程，但是我在FlySwordJS中已经写了。先不移过来了
    },

    BreakCondition :function( ) {
       
    },
});

module.exports = FlySwordAttackST;