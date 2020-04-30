// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html




var SceneManager = cc.Class({
    extends: cc.Component,


    ctor: function () {
        cc.loader.loadRes("Config/SceneConfig",function(err,object){
            if(err){
                cc.log(err); 
                return;
            } 
            this.Speed = object.json.Speed;
            });
    },
    
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
        Speed : 0,


    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {



     },

    start () {

    },

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
    });





