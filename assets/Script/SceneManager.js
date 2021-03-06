// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const ItemBase = require('ItemBase').ItemBase;

var SceneManager = cc.Class({
    extends: cc.Component,

    ctor: function () {
        /*cc.loader.loadRes("Config/SceneConfig",function(err,object){
            if(err){
                cc.log(err); 
                return;
            } 
            this.Speed = object.json.Speed;
            this.SceneConfigData = object.json;
            });*/
    },
    
    properties: { 
        Speed : 0,
        ItemConfig : {
            default : null,
            visible() {return false},
        },

        EntityPrefab : {
            default : null,
            type : cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

     start () {
        let self = this;
        //random postion
        self.pos_list = [cc.v2(50,200), cc.v2(100,200), cc.v2(50,250), cc.v2(150,150), cc.v2(150,200)];

        self.ItemConfig = cc.find("GameContainer").getComponent("GameManager").ItemConfig;
        
        //引用下玩家
        self.player = cc.find("Canvas/GameScene/PlayerScene/Player");
     },

    /**
     * 根据固定的几个坐标点随机生成道具
     * 传入挂载点 可指定道具名，不指定就随机（随机有个权重）
     */
    SpawnItem(ParentNode,ItemID) {
        let self = this;
        if (ParentNode && self.ItemConfig) {
            if (ItemID) {
                //todo

            } else {
                let itemlist = [];
                let weightlist = [];
                for(var p in self.ItemConfig){//遍历json对象的每个key/value对,p为key
                    itemlist.push(self.ItemConfig[p]);
                    weightlist.push(self.ItemConfig[p].weight);
                }
                let randindex = self.RandomByWeight(weightlist);
                if (randindex == -1) {
                    cc.log("随机出错了")
                    return
                } else {
                    let randItem = itemlist[randindex];
                    if (randItem) {
                        var item = new ItemBase();
                        item.init(randItem.id);
                        
                        if (self.EntityPrefab) {
                            let pb = cc.instantiate(self.EntityPrefab);
                            pb.getComponent("ItemInGame").init(item);
                            //pb.parent = cc.director.getScene();  //加到当前场景
                            ParentNode.addChild(pb);                 //加到父节点（这里是canvas）
                            let pos = Math.floor(self.pos_list.length * Math.random());

                            var random4  = function (n, m){
                                var random = Math.floor(Math.random()*(m-n+1)+n);
                                return random;
                            }

                            var x = random4(window.SceneData.itemPosition[0],window.SceneData.itemPosition[1])
                            var y = random4(window.SceneData.itemPosition[2],window.SceneData.itemPosition[3])
                            pb.setPosition(cc.v2(x,y));
                        }
                    }
                }   
            }
        }
    },
    //生成N个金币
    SpawnGold(ParentNode) {
        let self = this;
        var item = new ItemBase();
        item.init("item01");
                        
        if (self.EntityPrefab) {
            let pb = cc.instantiate(self.EntityPrefab);
            pb.getComponent("ItemInGame").init(item);
            ParentNode.addChild(pb);                 
            return pb
        }
    },
    
    /**
    * 权重随机
    * 传入的是权重数组
    */
    RandomByWeight(weights){
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
            sum = sum + weights[i];
        }

        let number_rand = Math.random()*sum;
        
        let sum_temp = 0;
        for (let index = 0; index < weights.length; index++)
        {
            sum_temp = sum_temp + weights[index];
            if (number_rand <= sum_temp)
            {
                return index;
            }
        }
        return -1;
    }

    

    // update (dt) {},
});
window.Global = {};

window.Global.SceneMnagerIns = new SceneManager();
//cc.log("@@@@@@@@@@@@");
//cc.log(window.Global.SceneMnagerIns.Speed)


window.SceneData = {
    Speed: 0,
    BgSpeed : 0,
    TaltleDistance :0,
    DisToSpeed :0,
    MaxSpeed :0,
    SpeedReCordDis :0,  //用来算速度的距离 放置在打Boss的时候距离增加太多
    OriginSpeed : 0, //出事速度
    barrierData : {},
    intervalData: {},
    barrierPath :{},
    goldOffset : 0,
    itemOffset : 0,
    itemPosition :null,

    random4 : function (n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    },


    //根据距离获取生成的障碍物


    spawnBarrierData : function(){
        var barrierData;
        
        for(var index in window.SceneData.barrierData)
        {
            
            var speedIndes = parseInt(index); 
            if(window.SceneData.SpeedReCordDis < speedIndes)
            {   
                barrierData =  window.SceneData.barrierData[index];
                break;
            }

        }

        var record = 0;
        var id
        var random = Math.floor(Math.random()*(100-1+1)+1);
        for(var index in barrierData.probability)
        {   
            record += parseInt(barrierData.probability[index]); 
            if (random < record)
            {   
                id = index;
                break;
            }
        }
        return id;
    },

    getConfigData : function(){
        var speedIndex = (Math.floor(window.SceneData.SpeedReCordDis / 100) +1) * 100;
        return window.SceneData.barrierData[speedIndex.toString()];

    },
    getSpawnBarrierCD : function()
    {

        var barrierData = this.getConfigData();
        
        return this.random4(barrierData.cd[0],barrierData.cd[1]);
    },

    getSpawnItemCD:function(){
        var barrierData = this.getConfigData();
        return this.random4(barrierData.itemCD[0],barrierData.itemCD[1]);
    },

    getSpawnGoldCD : function()
    {

        var barrierData = this.getConfigData();
        var cd = this.random4(barrierData.goldCD[0],barrierData.goldCD[1]);
        var num = this.random4(barrierData.goldNum[0],barrierData.goldNum[1]);
        return {"cd":cd,"num":num}
    },

    getSpawnEnemyCD : function()
    {
        var barrierData = this.getConfigData();
        var cd = this.random4(barrierData.enemyCD[0],barrierData.enemyCD[1]);
        return cd
    },

    getIntervalData : function()
    {
        var intervalData;
        
        for(var index in window.SceneData.intervalData)
        {
            
            var speedIndes = parseInt(index); 
            if(window.SceneData.SpeedReCordDis < speedIndes)
            {   
                intervalData =  window.SceneData.intervalData[index];
                break;
            }

        }

        var cd = this.random4(intervalData.cd[0],intervalData.cd[1])
        var interval = this.random4(intervalData.interval[0],intervalData.interval[1])
        var hightCD = this.random4(intervalData.hightChangeCD[0],intervalData.hightChangeCD[1])
        var hight = intervalData.height[this.random4(0,intervalData.height.length - 1)]

        return {"cd":cd,"interval":interval,"hightCD":hightCD,"hight":hight};

    }

    
};


cc.loader.loadRes("Config/LevelConfig",function(err,object){
    if(err){
        cc.log(err); 
        return;
    } 

    var currentLevelData = object.json['1']
    window.SceneData.OriginSpeed = currentLevelData.Speed;
    window.SceneData.BgSpeed = currentLevelData.BgSpeed;
    window.SceneData.DisToSpeed = currentLevelData.DisToSpeed;
    window.SceneData.MaxSpeed = currentLevelData.MaxSpeed;

    window.SceneData.barrierData = currentLevelData.SpawnBarrierData;
    window.SceneData.intervalData = currentLevelData.intervalData;
    window.SceneData.barrierPath = currentLevelData.BarriersPrefabs;
    
    window.SceneData.RoadStartPos = currentLevelData.RoadStartPos;
    window.SceneData.goldOffset =  object.json.goldOffset
    window.SceneData.itemOffset = object.json.itemOffset;
    window.SceneData.itemPosition = object.json.itemPosition;
    });





