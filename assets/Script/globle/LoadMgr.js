// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

module.exports = {
    bLoading : false,

    
    beginLoad(resList,proCallBack,finishCallBack){

        if(this.bLoading)
        {
            cc.log("正在加载其他资源");
            return;
        }
        var self = this;
        var listNum = resList.length;
        var currentIndex = 0;
        //tt["11"] = 11;
        var loadCall = function(){
            currentIndex++;
            this.bLoading = true;
            if(currentIndex>listNum)
            {   finishCallBack();
                cc.log("Load mgr load finish")
                this.bLoading = false;
                return;
            }
            cc.loader.loadRes(resList[currentIndex - 1],function(err,object){
                if(err){
                    cc.log(err); 
                    return;
                } 
                
                proCallBack(object,currentIndex / listNum)
                cc.log("load Mgr Loading percent:"+(object,currentIndex / listNum));
                loadCall();
            });
        }
        loadCall();
    },
}
/*
var LoadMgr = cc.Class({
    extends: cc.Component,

    properties: {
        bLoading : false,
    },
    statics: {
        _instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {

        LoadMgr._instance = this;
     },

     //resList 要加载的资源列表
     //proCallBack 加载进度回调
     //finishiCallBack 加载完成回调

    beginLoad(resList,proCallBack,finishCallBack){

        if(this.bLoading)
        {
            cc.log("正在加载其他资源");
            return;
        }
        var self = this;
        var listNum = resList.length;
        var currentIndex = 0;
        //tt["11"] = 11;
        var loadCall = function(){
            currentIndex++;
            this.bLoading = true;
            if(currentIndex>listNum)
            {   finishCallBack();
                cc.log("Load mgr load finish")
                this.bLoading = false;
                return;
            }
            cc.loader.loadRes(resList[currentIndex - 1],function(err,object){
                if(err){
                    cc.log(err); 
                    return;
                } 
                
                proCallBack(object,currentIndex / listNum)
                cc.log("load Mgr Loading percent:"+(object,currentIndex / listNum));
                loadCall();
            });
        }
        loadCall();
    },

    start () {

    },

    // update (dt) {},
});
*/