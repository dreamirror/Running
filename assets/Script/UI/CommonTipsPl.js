/** 
 * 
*/
cc.Class({
    extends: cc.Component,

    properties: {
        Title : {
            default : null,
            type : cc.Label,
        },
        OKBtn : {
            default : null,
            type : cc.Button,
        },
        CancelBtn : {
            default : null,
            type : cc.Button,
        }
    },

    onLoad () {
    },

    start () {

    },

    // update (dt) {},

    /**
     * 设置分享按钮的点击函数
     */
    SetOkBtnCall : function( InTarget , InComponentName , InFunciton , Param ){
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = InTarget; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = InComponentName;// 这个是代码文件名
        clickEventHandler.handler = InFunciton;
        clickEventHandler.customEventData = Param;

        this.OKBtn.clickEvents.push(clickEventHandler);
    },

    /**
     * 设置取消按钮的点击函数
     */
    SetCancelBtnCall : function( InTarget , InComponentName , InFunciton , Param ){
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = InTarget; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = InComponentName;// 这个是代码文件名
        clickEventHandler.handler = InFunciton;
        clickEventHandler.customEventData = Param;

        this.CancelBtn.clickEvents.push(clickEventHandler);
    },

    /**
     *
    */ 
});
