/*
飞剑状态机：正常状态
*/
var FSMUtil = require("FSMUtil");
var WeaponBaseState = require("WeaponBaseState");
var RightArm = require("RightArm");

var FlySwordNormalST = cc.Class({
    extends: WeaponBaseState,

    properties: {
        CD  :   0,

        BResponseTouch : {
            default : false,
            override : true,
        },
    },

    /*******************  状态运行相关  ******************* */
    BeforeEnter :function( InParamObj ) {
        this.ArmJS = this.TargetObj.getComponent("RightArm");
        
        //播放普通手臂晃动动画即可
        if(this.ArmJS && (this.ArmJS instanceof RightArm)){
            this.ArmJS.PlayAnimation("SwordNormal");
        }
        this.update_time = 0;
        let BackNode = this.TargetObj.getParent().getChildByName("Back");
        this.originx = BackNode.x;
        this.originy = BackNode.y;
    },

    BreakCondition :function( ) {

    },

    BeforeExit :function( InParamObj ) {
        this._super();
    },

    Update : function(dt){
        this._super(dt);

        if (this.CD > 0){
            this.CD -= dt;
        }

        this.update_time += 1;

        //在这个状态机里面作上下浮动的动画.
        let BackNode = this.TargetObj.getParent().getChildByName("Back");
        if (BackNode != undefined) {
            let offset = 0.5;
            
            if (this.update_time > 59 ) {
                this.update_time = 0;
                BackNode.x = this.originx;
                BackNode.y = this.originy;
            } else if (this.update_time >= 30) {
                BackNode.y -= offset;
            } else {
                BackNode.y += offset;
            }
        }
    },

});

module.exports = FlySwordNormalST;