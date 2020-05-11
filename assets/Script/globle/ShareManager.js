/*
微信小游戏的分享系统
*/

var ShareManager = cc.Class({
    extends: cc.Component,

    properties: {
        //存放一个当前用来存储分享数据分享Target的Data
        CurShareData : null,
    },

    onLoad () {
        this.InitShare();
    },

    start () {
        
    },

    onDestroy(){
        //取消监听
        if (wx != undefined){
            wx.offShow(this.OnShow);
        }
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

        // 当其他玩家从分享卡片上点击进入时，获取query参数,相当于是在游戏开始的时候检查一遍，是否从别的分享进来的
        this.GetWXQuery();
    },

    /************** 游戏内相关流程 ****************/
    //点击按钮时响应分享
    OnStartShare : function(event, InTarget){
        if (typeof wx == 'undefined'){
            return ;
        }

        this.CurShareData = {
            event : event,
            Target : InTarget,
        }

        /*  query是分享卡片上附带的参数，需要用键值对的方式发送。
            当其他玩家从你分享的卡片上点击进入游戏后，程序就可以从query参数中读取相应信息。注意该参数有限定长度，最大为2048。
        */
        wx.shareAppMessage({
            title: "分享目前游戏进度哦",
            imageUrl : cc.url.raw('shareimg.png'),    // 分享图片要放在 wechatgame/res/raw-assers 路径下
            query : 'ShareMsg=' + '11111',
        });
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

    //onShow的回调，转到前台的回调,可以用来处理，分享完以后回到游戏
    OnShow : function( res ){//scene , query , shareTicket , referrerInfo){
        console.log(' wx . onShow ~ ');
        if (res != undefined)
        {
            console.log(' query is :: ' + res.query['ShareMsg']);
            //如果是回调成功了
            if(this.CurShareData != null){
                var GameManager = cc.find("GameContainer").getComponent("GameManager");
                if(GameManager){
                    GameManager.ShareSuccessCallBack(this.CurShareData.event , this.CurShareData.Target);
                }
            }
        }
        else{
            console.log('res is null!!!');
        }
    },

    //获取是否有从别人的分享中点进来的回调
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

    //清除本次分享的数据
    ClearCurShareData : function() {
        this.CurShareData = null;
    },
});

module.exports = ShareManager;