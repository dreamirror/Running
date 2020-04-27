// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on( cc.Node.EventType.TOUCH_START , this.OnStartShare , this );

    },

    start () {

    },

    // update (dt) {},

    onDestroy(){
        //取消监听
        if (wx != undefined){
            wx.offShow(this.OnShow);
        }
    },


    //点击按钮时响应分享
    OnStartShare : function(){
        if (typeof wx == 'undefined')
        {
            cc.log("wx is undefined!!!");
            return ;
        }

        /*
        query是分享卡片上附带的参数，需要用键值对的方式发送。
        当其他玩家从你分享的卡片上点击进入游戏后，程序就可以从query参数中读取相应信息。注意该参数有限定长度，最大为2048。
        */
        wx.shareAppMessage(
            {
                title: "分享目前游戏进度哦",
                imageUrl : cc.url.raw('shareimg.png'),    // 分享图片要放在 wechatgame/res/raw-assers 路径下
                query : 'ShareMsg=' + '11111',
            }

        );

    },

    //初始化分享相关
    InitShare : function()
    {
        
        if (typeof wx === 'undefined'){
            console.log('wx undefined');
        }
        else{
            //开启右上角的分享功能
            wx.showShareMenu({
                success: (res) => {
                    console.log('开启被动转发成功！');
                },
                fail: (res) => {
                    console.log(res);
                    console.log('开启被动转发失败！');
                }
            });

            //开启点击转发按钮的监听
            wx.onShareAppMessage( this.OnShare );

            //监听一个Onshow的回调,小游戏回到前台的事件
            wx.onShow( this.OnShow );
        }

        // 当其他玩家从分享卡片上点击进入时，获取query参数
        this.GetWXQuery();
   
    },

    //onShow的回调，转到前台的回调
    OnShow : function( res ){//scene , query , shareTicket , referrerInfo){
        console.log(' wx . onShow ~ ');
        if (res != undefined)
        {
            console.log(' query is :: ' + res.query['ShareMsg']);
        }
        else{
            console.log('res is null!!!');
        }
    },

    //点右上角分享的回调
    OnShare : function(){
        cc.log(' wx . onShareAppMessage ~ ');

        return {
            title: "右上角按钮的转发监听",
            imageUrl : cc.url.raw('shareimg2.png'),
            query : 'ShareMsg=' + 'right listener',
        }
    },

    GetWXQuery() {
        // 当其他玩家从分享卡片上点击进入时，获取query参数
        if (typeof wx === 'undefined') {
            return;
        }
    
        let object = wx.getLaunchOptionsSync();
        let shareMsg = object.query['ShareMsg'];
        console.log( 'im other player~~~ get the Param : ' + shareMsg);
        return shareMsg;
    },
    

});
