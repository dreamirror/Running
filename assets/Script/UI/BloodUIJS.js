const EventName = require("GlobalEventName");

cc.Class({
    extends: cc.Component,

    start () {
        this._gameData = cc.find("GameContainer").getComponent("GameData");

        this.refreshBlood();

        EventCenter.on(EventName.BloodChange,this.refreshBlood,this);
    },

    refreshBlood(blood){
        let now_point = blood; //玩家血量
        if (blood == null || blood == undefined) {
            now_point = 2; //默认两滴血
        }
        
        for (let index = 1; index <= 2; index++) {
            const element = cc.find("Canvas/UIScene/bloodcom/bloodfull" + index);
            if (now_point >= index) {
                element.active = true;
            }
            else
            {
                element.active = false;
            }
        }
    },

    onDestroy(){
        EventCenter.off(EventName.BloodChange,this.refreshBlood,this);
    }
});
