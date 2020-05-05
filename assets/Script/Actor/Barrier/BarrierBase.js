/*
    5.5 zh 障碍物的基类
    可设置参数：_Destructible 攻击后是否被移除

*/
var ActorBase = require("ActorBase");

var BarrierBase = cc.Class({
    extends: ActorBase,

    properties: {
        Destructible : {
            default : true,
        },
    },

    onLoad () {
        this.BUseGravity = false;
        this._super();
        this.node.on('OnAttacked', this.OnAttacked ,this );
    },

    start () {
        //this._super();
    },

    // update (dt) {},

    /* 被攻击到时，攻击者(武器)会调用被攻击物体的这个函数 */
    OnAttacked : function( AttackerJS ,Target){
        //cc.log("1111111111");
        Target.color = cc.Color.RED;
    },

});
