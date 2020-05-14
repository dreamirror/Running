// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var LoadMgr = require("LoadMgr")
var LevelMgr = cc.Class({


    properties : {
        bLevelDataLoaded : false,
        bLevelResLoaded : false,
        bReadyPlay : false,
        currentLevel : 1,

        barrierPrefabsCatch:null,
    },
    

    faceBg_1 :null,
    faceBg_2 :null,
    backBg_1 :null,
    backBg_2 :null,

    testSPRITE: null,

    //加载关卡数据
    initLevelData()
    {
        var self = this;
        cc.loader.loadRes("Config/LevelConfig",function(err,object){
            if(err){
                cc.log(err); 
                return;
            } 
            self.bLevelDataLoaded = true;
            self.levelData = object.json;
            cc.log("initLevelData =="+JSON.stringify(self.levelData))
            self.initBarrierPrefabs();
        })
    },


    //加载障碍物的Prefabs
    initBarrierPrefabs()
    {
        var temp = {};
        
        var self = this;
        var index = 0;
        this.tt = new Map();
        this.tt.set("tt","11")
        var proCall = function(obj,pro)
        {   index++;
            
            window.SceneData.barrierPrefabCatch["ba_"+index] = obj;
        };

        var finishCall = function()
        {
            self.bReadyPlay = true;
            ///self.tt.set("tt","11")
            cc.log("level prefabs load finish!!!!!!!!!!!!!!");
        };


        if(this.levelData)
        {
            LoadMgr.beginLoad( self.levelData.barrierPrafabs,proCall,finishCall);

        }

        var self = this
 
        cc.loader.loadRes("BackGround/bg_1_lv_2", function(err,img){
            if (err) {
                cc.log(err);
                return;
            }
            var mylogo  = new cc.SpriteFrame(img);
            self.testSPRITE = mylogo;
            //window.SceneData.faceBg_2.getComponent(cc.Sprite).SpriteFrame = mylogo  
        });
    },

    //过关
    changeLevel(faceBg_1,faceBg_2){

        
        this.currentLevel++;
        //this.curretLevelData = this.levelData[this.currentLevel.toString()]
        //cc.log("change level curretnLevelData ="+JSON.stringify(this.curretLevelData));





    },
    
});

LevelMgr._intstance = null;
LevelMgr.getInstance = function()
{
    if(LevelMgr._intstance)
    {
        return LevelMgr._intstance;
    }else{
        return LevelMgr._intstance = new LevelMgr();
        }
}



module.exports  = LevelMgr;
