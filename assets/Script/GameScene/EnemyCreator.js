// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

        enemyCache : [],
        createCD :5,

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        var self = this;
        cc.loader.loadRes("Config/EnemyShowUpConfig",function(err,obj){
            if(err)
            {
                cc.log(err)
                return;

            }
            self.Config = obj.json;
        })
     },

    start () {

    },
    random4 (n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    },

    createEnemy()
    {
        if(this.createCD<=0)
        {
            this.createCD = window.SceneData.getSpawnEnemyCD();
            
            if(this.Config)
            {
                var data = this.Config["1"];
                var totalWeight = 0;
                for(var i in data)
                {
                    totalWeight += data[i].weight;
    
                }
                var finalWeight = this.random4(0,totalWeight)
                var finalData;
                for(var i in data)
                {
                    if(finalWeight < data[i].weight)
                    {
                        finalData = data[i]
                    }
    
    
    
                }
            }
        }

    },

     update (dt) {

        this.createCD -=dt;
     },
});



