/**
 * 手臂的普通状态，考虑是否用作基类，并不会实际使用
*/
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var Player = require("Player");

var RightArmRunState = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
    },

    properties: {    
    },

   

    /*******************  响应点击   ******************* */
    OnTouchStart : function(event){
        
    },

    Update : function(){
        
    },
});


module.exports = RightArmRunState;