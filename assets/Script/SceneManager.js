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

     onLoad () {
         let self = this;
        //random postion
        self.pos_list = [cc.v2(50,200), cc.v2(100,200), cc.v2(50,250), cc.v2(150,150), cc.v2(150,200)];
        
        cc.loader.loadRes("Config/ItemConfig",function(error,asset){
            if (error) {
                cc.log(error)
                return
            }
            self.ItemConfig = asset.json;
        });
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
                        item.init(randItem.id,randItem.name,randItem.icon,randItem.type);
                        
                        if (self.EntityPrefab) {
                            let pb = cc.instantiate(self.EntityPrefab);
                            pb.getComponent("ItemInGame").init(item);
                            //pb.parent = cc.director.getScene();  //加到当前场景
                            ParentNode.addChild(pb);                 //加到父节点（这里是canvas）
                            let pos = Math.floor(self.pos_list.length * Math.random());
                            pb.setPosition(self.pos_list[pos]);
                        }
                    }
                }   
            }
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
        cc.log(" spawnBarrierData random=="+random);
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

    getSpawnBarrierCD : function()
    {

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
        
        return this.random4(barrierData.cd[0],barrierData.cd[1]);
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
        return {"cd":cd,"interval":interval};

    }

    
};


cc.loader.loadRes("Config/SceneConfig",function(err,object){
    if(err){
        cc.log(err); 
        return;
    } 
    window.SceneData.OriginSpeed = object.json.Speed;
    window.SceneData.BgSpeed = object.json.BgSpeed;
    window.SceneData.DisToSpeed = object.json.DisToSpeed;
    window.SceneData.MaxSpeed = object.json.MaxSpeed;

    window.SceneData.barrierData = object.json.SpawnBarrierData;
    window.SceneData.intervalData = object.json.intervalData;
    window.SceneData.barrierPath = object.json.BarriersPrefabs;
    
    window.SceneData.RoadStartPos = object.json.RoadStartPos;
    });





