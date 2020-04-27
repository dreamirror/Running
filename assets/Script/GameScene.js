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

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {


     },

    



    start () {
        this.initRoad();
    },

    SpawnBarrier : function(){
        var width = DesignSize;
        var barrier = cc.instantiate(this.swordPrefab);
        this.node.addChild(barrier);
        var lastRoad = this.roads[this.roads.length - 1];
        var x = lastRoad.getPosition().x + lastRoad.width / 2
        barrier.setPosition(cc.v2(x , 50))
        this.barriers.push(barrier);
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
        cc.log("updateRoads dis =="+dis);
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
        cc.log("updateBarriers dis =="+dis);
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
        window.SceneData.TaltleDistance += window.SceneData.Speed * dt;


        //生成BarrierCD 
        this.CDTime -=dt;

        if(this.CDTime <=0 )
        {
            this.SpawnBarrier();
            this.CDTime = this.SpwanBarrierCD +Math.random(dt);

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
            if((lastRoad.x + lastRoad.width)<( width + 100))
            {   
                var bInterval = this.resultBYPercent(20);
                var interval = 0;
                if(bInterval)
                {
                    interval = 50;
                }
                this.spawnRoad(lastRoad.x + lastRoad.width,interval);
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
     },
});
