// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var ActorManager = require( "ActorManager" );
const ItemBase = require('ItemBase').ItemBase;
const EItemType = require('ItemBase').EItemType;

var SpecialPosRange = {

    start:0,
    end:0

}

var DesignSize = 960;
var GameScene = cc.Class({
    extends: cc.Component,

    properties: {

        back_1 : {
            default: null,
            type: cc.Node
        },
        back_2 :{
            default: null,
            type: cc.Node
        },
        //距离
        DisTanceDisplay: {
            default: null,
            type: cc.Label
        },

        //速度
        SpeedLabel: {
            default: null,
            type: cc.Label
        },

        firePrefab: {
            default: null,
            type: cc.Prefab
        },
        swordPrefab: {
            default: null,
            type: cc.Prefab
        },
        boxPrefab: {
            default: null,
            type: cc.Prefab
        }, 
         roadPrefab: {
            default: null,
            type: cc.Prefab
        },

        //zh 5.6 把sceneManager存一下
        SceneManager : {
            default : null,
            type : cc.Node
        },

        //精灵
        leftRoad :{
            default:null,
            type:cc.Prefab
        },

        rightRoad :{
            default:null,
            type:cc.Prefab
        },
        rightRoads:[cc.Prefab],
        leftRoads:[cc.Prefab],
        midleRoads:[cc.Prefab],

        barriers :[],
        roads : [],
        golds:[],
        SpecialPosRanges:[],
        createed:true,
        SpwanBarrierCD : 5,
        CDTime : 4,
        goldCD :7,
        intervalCD: 0,
        itemCD: 9,
        hightChangeCD : 2,
       CurrentLevel : 1,
       hightOffset : 0,

    },

    statics : {
        _instance : null,
    },
    
    // LIFE-CYCLE CALLBACKS:

     onLoad () {

        GameScene._instance = this;
        this.updateSpeed = window.SceneData.OriginSpeed
        //加载预制体
        var self = this;
        var prefabNum = window.SceneData.barrierPath.length;
        var currentIndex = 0;
        var tt = "ba_1";
        //tt["11"] = 11;
        this.BarriersCache ={};
        var loadCall = function(){
            currentIndex++;
            if(currentIndex>prefabNum)
            {
                return;
            }
            cc.loader.loadRes(window.SceneData.barrierPath[currentIndex - 1],function(err,object){
                if(err){
                    cc.log(err); 
                    return;
                } 
                self.BarriersCache["ba_"+currentIndex] = object
                loadCall();
            });
        }
        loadCall();
        
 
    },

    start () {
        this.initRoad();
    },

    updateCurrentLevel(){

    },

    SpawnBarrier : function(){

        var id = window.SceneData.spawnBarrierData();
        var config = {"ba_1":this.swordPrefab,"ba_2":this.firePrefab,"ba_3":this.boxPrefab};
        var baPrefab = this.BarriersCache[id]

        if(this.BarriersCache && baPrefab)
        {   
                    
            var width = DesignSize;
            //var barrier = cc.instantiate(baPrefab);
            //test
            var barrier = ActorManager._instance.CreateEnemy("EnemyLowBee");
            //var barrier = ActorManager._instance.CreateEnemy("EnemyRange");

            var lastRoad = this.roads[this.roads.length - 1];
            var backIndex = 0;
            //如果当前的路是有间隔的就往左边再选一个路知道没有间隔或者选得次数超过最大次数
            if(lastRoad.bInterval)
            {
                while(backIndex < 4 && lastRoad.interval)
                {
                    lastRoad = this.roads[this.roads.length - backIndex - 1];
                    backIndex++
                }
            }
            
            lastRoad.addChild(barrier);
            var x = (lastRoad.width - barrier.width) 
            barrier.setPosition(cc.v2(x , lastRoad.height / 2))
            this.barriers.push(barrier);


            var Range = {};
            Range.start = x;
            Range.end =  x + barrier.width;
            this.SpecialPosRanges.push(Range)

            return barrier;

        }



    },
    spawnRoad : function(x,interval,hightOffset){
        var road =null;
        if(interval > 0 )
        {
            road = cc.instantiate(this.rightRoads[this.CurrentLevel - 1]);
        }
        else{
            road = cc.instantiate(this.midleRoads[this.CurrentLevel - 1]);
        }

        var lastRoad =  this.roads[this.roads.length- 1]
        
        var self = this;
        if (lastRoad && interval >0)
        {
            
            var newRoad = cc.instantiate(this.leftRoads[this.CurrentLevel - 1]);
            newRoad.setPosition(cc.v2(lastRoad.getPosition().x,this.hightOffset));
            this.hightOffset = hightOffset || this.hightOffset;
            this.node.removeChild(lastRoad);
            this.node.addChild(newRoad);
            self.roads[self.roads.length- 1] = newRoad;
            road.bInterval = true;
        }


        this.node.addChild(road);

        var RoadPos = [ 0,0 ];
        RoadPos = window.SceneData.RoadStartPos;

        if (this.roads.length == 0 )
        {
            road.setPosition(0,0);
        }
        else
        {
            var inx = x + interval;
            if(interval>0)//間隔大於0的時候存起來用作金幣的弧線
            {
                var Range = {};
                Range.start = x;
                Range.end =  x + interval;
                this.SpecialPosRanges.push(Range);

            }
            road.setPosition(inx,this.hightOffset || 0);
        }
        this.roads.push(road);

        

        return road;
    },

    updateRanges(inx){
        if(this.SpecialPosRanges.length > 0 )
        {
            for(var index in this.SpecialPosRanges)
            {
                var range = this.SpecialPosRanges[index]
                if(range)
                {
                    range.start -=inx;
                    range.end -=inx;
                }
            }
        }

    },

    initRoad : function(){
        var road = cc.instantiate(this.midleRoads[this.CurrentLevel - 1]);
        var width = DesignSize;
        var num = (width / road.width) + 1;
        for(var i = 0;i < num;i++)
        {   
            var road = this.spawnRoad(0);

            //zh 5.6
            var RoadY = 0;

            road.setPosition(road.width * i,RoadY);
        }
    },



    //跟新roads位置
    updateRoads : function(dis){
        if(this.roads.length > 0)
        {
            for(var index in this.roads)
            {
                var item = this.roads[index];
                var y = item.getPosition().y
                item.setPosition(item.getPosition().x - dis,y);
                if(item.getPosition().x < -item.width)
                {
                    item.removeFromParent();
                    this.roads.splice(index,1);
                }
            }
        }
    },

    //更新障碍的位置
    updateBarriers : function(dis) {
        if (this.barriers.length > 0 )
        {
            for(var index in this.barriers)
            {   
                var item = this.barriers[index];
                item.setPosition(item.getPosition().x - dis,0);
                if(item.getPosition().x < -item.width)
                {
                    item.removeFromParent();
                    this.barriers.splice(index,1);
                }
            }
        }

    },
    random4 : function (n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    },

    clearGameData:function()
    {
        window.SceneData.TaltleDistance = 0;
        window.SceneData.Speed =window.SceneData.OriginSpeed;
        this.updateSpeed = window.SceneData.OriginSpeed
        if(this.barriers.length > 0)
        {
            for(var index in this.barriers)
            {
                var ba = this.barriers[index]
                ba.removeFromParent();
            }
        }

        if(this.golds.length > 0)
        {
            for(var index in this.golds)
            {
                var gold = this.golds[index]
                gold.removeFromParent();
            }
        }
        this.initRoad();
    },

    //根据概率来判断发生还是不发生
    resultBYPercent:function(percent)
    {
        
        var seed = this.random4(0,99);
        if(percent>= seed){
            return true;
        }
        return false;

    },

    //生成金币
    spawnGold(num,width){

        var lastRoad = this.roads[this.roads.length - 1];
        var offsety = window.SceneData.goldOffset
        var interval = 50
        
        if(lastRoad)
        {
            for(var i =0;i<num;i++)
            {
                var gold = cc.find("Canvas/GameScene").getComponent("SceneManager").SpawnGold(this.node,i,"金币","Texture/Item/gold",EItemType.Gold );
                var x = i*interval +lastRoad.getPosition().x;
                var y = lastRoad.width + offsety +lastRoad.getPosition().y +lastRoad.height;
                gold.setPosition(cc.v2(x,y ));
                this.golds.push(gold);
            }
        }


    },

    //更新金币
    updateGlod(inx){
        var rayLength = -100;
        var upInterval = 20

        if(this.golds.length > 0)
        {   
            var originY ;
            for(var index in this.golds)
            {   

                var gold = this.golds[index];
                var goldX = gold.getPosition().x
                var goldY = gold.getPosition().y;
                if(index == 0)
                {
                    originY = goldY;
                }
                var tt = gold.getComponent("ItemInGame");
                if (gold && gold.getComponent("ItemInGame").NeedFly == false)   
                {

                    if(goldX>0)
                    {
                       gold.setPosition(cc.v2(goldX - inx,goldY));
                       if(this.SpecialPosRanges.length >0)
                       {
                           //需要调整位置的的金币
                           var adjust = [];

                            for(var i in this.SpecialPosRanges)
                            {
                                var range = this.SpecialPosRanges[i]
                                if(range)
                                {
                                    if(goldX>range.start && goldX<range.end)
                                    {

                                        //gold.setPosition(cc.v2(goldX - inx,originY + 20))
                                        adjust.push(gold);
                                    }
                                }
                            }
                            var half= adjust.length / 2;

                            for(var i in adjust)
                            {
                                var gold = adjust[i]
                                if(gold)
                                {
                                    //gold.setPosition(cc.v2(goldX - inx,originY + upInterval * (i +1)))
                                    var intervalNum = 0
                                    if(i<half)
                                    {
                                        intervalNum = 0;
                                    }else{
                                        intervalNum = adjust.length - i;
                                    }
                                  gold.setPosition(cc.v2(goldX - inx,originY + upInterval * (intervalNum +1)))
                                }
                            }
                       }
                    }
                    else{
                        gold.removeFromParent();
                        this.golds.splice(index,1);
                    }
                   
                }
            }
        }
    },

    //
    changeSpeed(param){
        this.updateSpeed = this.updateSpeed * param;

    },

    resetSpeed(){
        this.updateSpeed = window.SceneData.OriginSpeed

    },

    changeLevel(){
        this.CurrentLevel = 2
    },


     update (dt) {
        this.back_1.setPosition(this.back_1.getPosition().x - window.SceneData.Speed *dt,0)
        this.back_2.setPosition(this.back_2.getPosition().x -  window.SceneData.Speed * dt,0)
        window.SceneData.TaltleDistance += (window.SceneData.Speed / 100) * dt ;
        window.SceneData.SpeedReCordDis =  window.SceneData.TaltleDistance;
        //各种CD 的跟新 
        this.CDTime -=dt;
        this.goldCD -=dt;
        this.itemCD -=dt;
        this.hightChangeCD -=dt;

        //切换

        //更新金币位置
        this.updateGlod(window.SceneData.Speed *dt);

        //生成金币
        if(this.goldCD <=0)
        {
            var goldData = window.SceneData.getSpawnGoldCD()
            this.goldCD = goldData.cd

            this.spawnGold(goldData.num);
        }

        //更新间隔的数据
        this.updateRanges(window.SceneData.Speed *dt)
        if(this.CDTime <=0 )
        {
            this.SpawnBarrier(); //先屏蔽生成障碍物方便调试
            //this.spawnGold(16);

            //this.CDTime = this.SpwanBarrierCD +Math.random(dt);
            this.CDTime = window.SceneData.getSpawnBarrierCD()

        }
        this.updateRoads(window.SceneData.Speed *dt);
        //生成路

        if(this.roads.length == 0)
        {
            this.spawnRoad(0);
        }
        else{
            var lastRoad = this.roads[this.roads.length - 1]

            //生成道具
            if(this.itemCD <=0)
            {   
                this.itemCD = window.SceneData.getSpawnItemCD();
                cc.find("Canvas/GameScene").getComponent("SceneManager").SpawnItem( lastRoad );
            }

            var width = DesignSize;

                //this.CDTime = this.SpwanBarrierCD +Math.random(dt);
                this.intervalCD -= dt;
                if((lastRoad.x + lastRoad.width)<( width + 100))
                {   
                    if(this.intervalCD <=0 )
                    {
                        var intervalData = window.SceneData.getIntervalData()
                        this.intervalCD = intervalData.cd
                        var offset;
                        if(this.hightChangeCD <= 0)
                        {
                            this.hightChangeCD = intervalData.hightCD;
                            offset = intervalData.hight;
                            cc.log("--------------")
                        }
                        
                        this.spawnRoad(lastRoad.x + lastRoad.width - 2,intervalData.interval,offset);


                    }
                    else{
                        this.spawnRoad(lastRoad.x + lastRoad.width,0);
                    }
    
                }

            

        }
        
        if(this.back_1.getPosition().x <= -this.back_1.width)
        {
            this.back_1.setPosition(this.back_2.getPosition().x + this.back_1.width,0);

            //临时清除屏幕外的道具
            this.back_1.removeAllChildren();
           
        }

        //cc.find("Canvas/GameScene/BackGround").getComponent("EnemyCreator").createEnemy();
        
        if(this.back_2.getPosition().x <= -this.back_2.width){
            this.back_2.setPosition(this.back_1.getPosition().x +this.back_2.width,0);
            //临时清除屏幕外的道具
            this.back_2.removeAllChildren();
        }

        this.DisTanceDisplay.string = '距离: ' +  Math.floor(window.SceneData.TaltleDistance);
        this.SpeedLabel.string = '速度: ' +  Math.floor(window.SceneData.Speed);
        //更新速度
        if(window.SceneData.Speed < window.SceneData.MaxSpeed)
        {
            window.SceneData.Speed = this.updateSpeed + window.SceneData.SpeedReCordDis * window.SceneData.DisToSpeed;
        }
         var self = this;
         self.obj = null;


         //切换关卡的测试
         if(this.changeLevelTag == null && window.SceneData.TaltleDistance > 10)
         {
            this.changeLevelTag = true;
            //cc.find("Canvas/GameScene/FrontBg").getComponent("FrontBg").changeLevel();
         }


     },
});

module.exports = GameScene;