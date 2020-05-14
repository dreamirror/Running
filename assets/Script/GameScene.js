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
cc.Class({
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

        barriers :[],
        roads : [],
        golds:[],
        SpecialPosRanges:[],
        createed:true,
        SpwanBarrierCD : 5,
        CDTime : 0,
        intervalCD: 0,
        
       

    },
    
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
    cc.PhysicsManager.DrawBits.e_pairBit |
    cc.PhysicsManager.DrawBits.e_centerOfMassBit |
    cc.PhysicsManager.DrawBits.e_jointBit |
    cc.PhysicsManager.DrawBits.e_shapeBit
    ;

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
            var lastRoad = this.roads[this.roads.length - 1];
            lastRoad.addChild(barrier);
            var x = (lastRoad.width - barrier.width) / 2
            barrier.setPosition(cc.v2(x , lastRoad.height))
            this.barriers.push(barrier);


            return barrier;

        }



    },
    spawnRoad : function(x,interval){
        var road =null;
        if(interval > 0 )
        {
            road = cc.instantiate(this.rightRoad);
        }
        else{
            road = cc.instantiate(this.roadPrefab);
        }

        var lastRoad =  this.roads[this.roads.length- 1]
        
        var self = this;
        if (lastRoad && interval >0)
        {
            var newRoad = cc.instantiate(this.leftRoad);
            newRoad.setPosition(cc.v2(lastRoad.getPosition().x,lastRoad.getPosition().y));
            this.node.removeChild(lastRoad);
            this.node.addChild(newRoad);
            self.roads[self.roads.length- 1] = newRoad;
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
            road.setPosition(inx,0);
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
        var road = cc.instantiate(this.roadPrefab);
        var width = DesignSize;
        var num = (width / road.width) + 1;
        for(var i = 0;i < num;i++)
        {   
            var road = this.spawnRoad(0);

            //zh 5.6
            var RoadY = 0;
            RoadY = window.SceneData.RoadStartPos[1];

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
                item.setPosition(item.getPosition().x - dis,0);
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
        var offsety = 0
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

                if (gold)   
                {
                    if(goldX>0)
                    {
                       gold.setPosition(cc.v2(goldX - inx,goldY));
                       if(this.SpecialPosRanges.length >0)
                       {
                            for(var i in this.SpecialPosRanges)
                            {
                                var range = this.SpecialPosRanges[i]
                                if(range)
                                {
                                    if(goldX>range.start && goldX<range.end)
                                    {
                                        //cc.log("@@@@@@@@@@@@@@@")
                                        gold.setPosition(cc.v2(goldX - inx,originY + 20))
                                    }
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


     update (dt) {
        this.back_1.setPosition(this.back_1.getPosition().x - window.SceneData.Speed *dt,0)
        this.back_2.setPosition(this.back_2.getPosition().x -  window.SceneData.Speed * dt,0)
        window.SceneData.TaltleDistance += (window.SceneData.Speed / 100) * dt ;
        window.SceneData.barrierPath
        this.BarriersCache
        window.SceneData.SpeedReCordDis =  window.SceneData.TaltleDistance;
        //生成BarrierCD 
        this.CDTime -=dt;

        //更新金币位置
        this.updateGlod(window.SceneData.Speed *dt);

        //更新间隔的数据
        this.updateRanges(window.SceneData.Speed *dt)
        if(this.CDTime <=0 )
        {
            //this.SpawnBarrier(); //先屏蔽生成障碍物方便调试
            this.spawnGold(6);

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
            var width = DesignSize;

                //this.CDTime = this.SpwanBarrierCD +Math.random(dt);
                this.intervalCD -= dt;
                if((lastRoad.x + lastRoad.width)<( width + 100))
                {   
                    if(this.intervalCD <=0 )
                    {
                        var intervalData = window.SceneData.getIntervalData()
                        this.spawnRoad(lastRoad.x + lastRoad.width - 2,100);
                        this.intervalCD = intervalData.cd

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
            //暂时在这儿去加一个生成道具的。 
            cc.find("Canvas/GameScene").getComponent("SceneManager").SpawnItem( this.back_1 );
        }

        if(this.back_2.getPosition().x <= -this.back_2.width){
            this.back_2.setPosition(this.back_1.getPosition().x +this.back_2.width,0);
            //临时清除屏幕外的道具
            this.back_2.removeAllChildren();
            //暂时在这儿去加一个生成道具的。 
            cc.find("Canvas/GameScene").getComponent("SceneManager").SpawnItem( this.back_2 );
        }

        this.DisTanceDisplay.string = '距离: ' +  Math.floor(window.SceneData.TaltleDistance);
        this.SpeedLabel.string = '速度: ' +  Math.floor(window.SceneData.Speed);
        //更新速度
        if(window.SceneData.Speed < window.SceneData.MaxSpeed)
        {
            window.SceneData.Speed =window.SceneData.OriginSpeed + window.SceneData.SpeedReCordDis * window.SceneData.DisToSpeed;
        }
         var self = this;
         self.obj = null;
      //  cc.loader.loadRes("preferbs/barrier_sword",function(err,object){
           // if(err){
              //  cc.log(err); 
               // return;
           // } 
               // cc.log(object)
               // self.obj = cc.instantiate( object);
               // self.obj.setPosition(cc.v2(0,0))

          //  });

           // var barrier2 = 
           // barrier2.setPosition(cc.v2(0,0));

     },
});
