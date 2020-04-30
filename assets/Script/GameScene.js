// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

DesignSize = 960;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

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


        barriers :[],
        roads : [],
        createed:true,
        SpwanBarrierCD : 5,
        CDTime : 0,
        intervalCD: 0,

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {


     },

    



    start () {
        this.initRoad();
    },

    SpawnBarrier : function(){

        var id = window.SceneData.spawnBarrierData();
        var config = {"ba_1":this.swordPrefab,"ba_2":this.firePrefab,"ba_3":this.boxPrefab};
        var width = DesignSize;
        var barrier = cc.instantiate(config[id]);
        this.node.addChild(barrier);
        var lastRoad = this.roads[this.roads.length - 1];
        var x = lastRoad.getPosition().x + lastRoad.width / 2
        barrier.setPosition(cc.v2(x , 50))
        this.barriers.push(barrier);

        var obj;

        //cc.loader.loadRes("preferbs/barrier_box",function(err,object){
           // if(err){
               // cc.log(err); 
               // return;
           // } 
            //obj = object;

           // });
        //var barrier2 = cc.instantiate(this.obj);
        //barrier2.setPosition(cc.v2(0,0));
        return barrier;


    },
    spawnRoad : function(x,interval){
        var road = cc.instantiate(this.roadPrefab);
        this.node.addChild(road);
        if (this.roads.length == 0 )
        {
            road.setPosition(0,0);
        }
        else
        {
            var inx = x + interval;
            road.setPosition(inx,0);
        }
        this.roads.push(road);

        return road;
    },

    initRoad : function(){
        var road = cc.instantiate(this.roadPrefab);
        var width = DesignSize;
        cc.log("width=="+road.width);
        var num = (width / road.width) + 1;
        for(var i = 0;i < num;i++)
        {   
            cc.log("i=="+i);
            var road = this.spawnRoad(0);
            road.setPosition(road.width * i,0);
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


     update (dt) {
        this.back_1.setPosition(this.back_1.getPosition().x - window.SceneData.Speed *dt,0)
        this.back_2.setPosition(this.back_2.getPosition().x -  window.SceneData.Speed * dt,0)
        window.SceneData.TaltleDistance += (window.SceneData.Speed / 100) * dt ;

        window.SceneData.SpeedReCordDis =  window.SceneData.TaltleDistance;
        //生成BarrierCD 
        this.CDTime -=dt;

        if(this.CDTime <=0 )
        {
            this.SpawnBarrier();
            //this.CDTime = this.SpwanBarrierCD +Math.random(dt);
            this.CDTime = window.SceneData.getSpawnBarrierCD()

        }
        this.updateBarriers(window.SceneData.Speed *dt);
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
                        cc.log("intervalData.interval=="+intervalData.interval)
                        this.spawnRoad(lastRoad.x + lastRoad.width,intervalData.interval);
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
        }

        if(this.back_2.getPosition().x <= -this.back_2.width){
            this.back_2.setPosition(this.back_1.getPosition().x +this.back_2.width,0);
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
