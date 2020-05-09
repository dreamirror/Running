/**
 * 右手上的武器的基类，拥有响应点击屏幕在一定时间内进行攻击的基本方法
 */
var FSMUtil = require("FSMUtil");
var FSMStateBase = require("FSMStateBase");
var RightArm = require("RightArm");

var WeaponBaseState = cc.Class({
    extends: FSMStateBase,

    ctor: function ( ) {
        this.bAttack = false;
        this.CriticalValTime = 0.2;

        this.StartTouch = false;
        this.TouchTime = 0;
    },

    properties: {
        
    },

    /*******************  状态运行相关  ******************* */
    BeforeExit :function( InParamObj ) {
        this.bAttack = false;
        this.StartTouch = false;
        this.TouchTime = 0;
    },

    /*******************  响应点击   ******************* */
    OnTouchStart : function(event){
        //点击时开启一个计时器，一旦点击，就开始计时,必须在限定时间内抬起
        this.StartTouch = true;
        this.TouchTime = 0;
    },

	OnTouchEnd : function(event){
        if(this.StartTouch == true)
        {
            if( this.TouchTime <= this.CriticalValTime )
            {
                this.bAttack = true;
            }
        }
        this.StartTouch = false;
    },

    //触摸移开屏幕
    OnTouchCancel : function(event){
        this.StartTouch = false;
        this.TouchTime = 0;
        this.bAttack = false;
    },

    Update : function(dt){
        if(this.StartTouch == true)
        {
            this.TouchTime += dt;
        }
    },

});


module.exports = WeaponBaseState;