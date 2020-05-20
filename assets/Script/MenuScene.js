
const FunctionLibrary = require("FunctionLibrary");
const EventName = require("GlobalEventName");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        this._gameData = cc.find("GameContainer").getComponent("GameData");

        this.refreshActivePoint();
        this.refreshGold();

        EventCenter.on(EventName.ActivePointChange,this.refreshActivePoint,this);
        EventCenter.on(EventName.GoldChange,this.refreshGold,this);
    },


    update(){
        this.tickRecoverTime();
    },

    onDestroy(){
        EventCenter.off(EventName.ActivePointChange,this.refreshActivePoint,this);
        EventCenter.off(EventName.GoldChange,this.refreshGold,this);
    },

    //////////////////////////////////
    tickRecoverTime(){
        if (this._gameData.getPlayerInfo().activePoint < this._gameData.MaxActivePoint) {
            const timenode = cc.find("Canvas/TitleContainer/titlepower/recover_time");
            let timenum = timenode.getComponent(cc.Label);
            if (this._gameData.nextRecoverTime) {
                timenum.string = FunctionLibrary.get_time_hour_min_sec(this._gameData.nextRecoverTime);
            }
        }
    },

    refreshActivePoint(){
        let now_point = this._gameData.getPlayerInfo().activePoint;
        for (let index = 1; index <= this._gameData.MaxActivePoint; index++) {
            const element = cc.find("Canvas/TitleContainer/titlepower/icon_tili" + index);
            if (now_point >= index) {
                element.active = true;
            }
            else
            {
                element.active = false;
            }
        }
        //回复时间
        if (now_point >= this._gameData.MaxActivePoint) {
            const timenode = cc.find("Canvas/TitleContainer/titlepower/recover_time");
            let timenum = timenode.getComponent(cc.Label);
            timenum.string = "";
        }
    },

    refreshGold(){
        let goldnum = cc.find("Canvas/TitleContainer/titlegold/goldnum");
        if (goldnum) {
            goldnum.getComponent(cc.Label).string = this._gameData.getPlayerGold();
        }
    },


    touchStartBtn(){
        this._gameData.costActivePoint()
        return
        var AudioManager = cc.find("GameContainer").getComponent("AudioManager");
        if (AudioManager) {
            AudioManager.playEffect("Sound/sfx_score");
        }
        
        cc.director.loadScene("GameScene",function(){
            cc.log("GameScene launched!");
        });
    },


    //点击体力加
    touchAddActivePoint(){
        cc.log("### touch active potin ###")
        //体力没满就看广告。
        var GameData = this._gameData;
        if (GameData.getPlayerInfo().activePoint < GameData.MaxActivePoint ) {
            //看广告。

            //GameData.doRecoverPoint();
        }
    },
});
