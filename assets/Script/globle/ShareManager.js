
cc.Class({
    extends: cc.Component,

    properties: {
        //分享按钮的btn
        ShareBtn : {
            default : null,
            type : cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    // update (dt) {},

    //加载分享按钮
    AddShareBtn : function(){
        //加载一个分享按钮
        var BtnShare = cc.instantiate(this.ShareBtn);
        if (BtnShare)
        {
            this.node.addChild(BtnShare);
            BtnShare.setPosition(12,150);
            var ShareScript = BtnShare.getComponent('ShareScript');
            if(ShareScript)
            {
                cc.log(' ShareScript . InitShare ~ ');
                ShareScript.InitShare();
            }
        } 
    },

});
