const NodePool = require('NodePool');

cc.Class({
    extends: cc.Component,

    properties: {
        //道具池，有几种道具就有几个池，每个池定义该类敌人的最大数
        PBPools: {
            default: [],
            type: NodePool
        },
    },

    onLoad(){
        this.poolCache = {};
        this.init();
    },

    // use this for initialization
    init () {
        for (let i = 0; i < this.PBPools.length; ++i) {
            this.PBPools[i].init();
            this.poolCache[this.PBPools[i].poolName] = this.PBPools[i];
        }
        this.PBPools = [];
    },

    request (poolName) {
        let thePool = this.poolCache[poolName];
        if (thePool.idx >= 0) {
            return thePool.request();
        } else {
            return null;
        }
    },

    return (poolName, obj) {
        let thePool = this.poolCache[poolName];
        if (thePool.idx < thePool.size) {
            thePool.return(obj);
        } else {
            cc.log('Return obj to a full pool, something has gone wrong');
            return;
        }
    },
});
