/*
    通用敌人远距离攻击状态
*/
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var EnemyBase = require("EnemyBase");
var CommonUtil = require("CommonUtil");

var EnemyDisAttState = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
    },

    properties: {
        //设置不响应点击
        BResponseTouch : {
            default : false,
            override: true
        },

        bTransDistanceAttack : false,
        bTransIdle : false,
    },

});
