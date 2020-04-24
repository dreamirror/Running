// 音效管理器
// 其他组件获取此组件的方法：
// var AudioManager = cc.find("GameContainer").getComponent("AudioManager");

cc.Class({
    extends: cc.Component,

    properties: {
        //音量
        volume:0.5,

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        cc.audioEngine.setVolume(this.volume);
    },

    
    //设置音量
    setGameVolume : function( va ){
        cc.audioEngine.setVolume(this.volume);
    },

    // url = clip path 或者 audioClip对象都可以
    playBgMusic : function(url) {
        if (cc.audioEngine.isMusicPlaying) {
            stopBgMusic();
        };

        if (url instanceof cc.AudioClip) {
            cc.audioEngine.playEffect(url,bLoop);
        } else {
            cc.loader.loadRes(
                url,
                cc.AudioClip,
                function(error,res){
                    this.bgMusicChannel = cc.audioEngine.play(res,true,0.5);
                });
        }
    },

    stopBgMusic : function () {
        if (this.bgMusicChannel !== undefined) {
            cc.audioEngine.stop(this.bgMusicChannel);            
            this.bgMusicChannel = undefined;
        }
    },

    pauseMusic: function() {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function() {
        cc.audioEngine.resumeMusic();
    },

    // url = clip path
    playEffect : function(url,bLoop) {
        if (bLoop == null) {
            bLoop = false;
        }
        if (url instanceof cc.AudioClip) {
            cc.audioEngine.playEffect(url,bLoop);
        } else {
            cc.loader.loadRes(
                url,
                cc.AudioClip,
                function(error,res){
                    cc.audioEngine.playEffect(res,bLoop);
                });
        }
    },

    clearAllEffect : function ()
    {
        cc.audioEngine.clearAllEffect();
    },
    
});
