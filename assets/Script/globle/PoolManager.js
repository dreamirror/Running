const NodePool = require('NodePool');

cc.Class({
    extends: cc.Component,

    properties: {
        //道具池，有几种道具就有几个池，每个池定义该类敌人的最大数
        ItemPools: {
            default: [],
            type: NodePool
        },
        //敌人池，有几种敌人就几个池，每个池定义该类敌人的最大数
        EnemyPools: {
            default: [],
            type: NodePool
        }
    },

    // use this for initialization
    init () {
        for (let i = 0; i < this.ItemPools.length; ++i) {
            this.ItemPools[i].init();
        }

        for (let i = 0; i < this.EnemyPools.length; ++i) {
            this.EnemyPools[i].init();
        }
    },

    requestItem (poolType) {
        let thePool = this.ItemPools[poolType];
        if (thePool.idx >= 0) {
            return thePool.request();
        } else {
            return null;
        }
    },

    returnItem (poolType, obj) {
        let thePool = this.foePools[poolType];
        if (thePool.idx < thePool.size) {
            thePool.return(obj);
        } else {
            cc.log('Return obj to a full pool, something has gone wrong');
            return;
        }
    },

    requestEnemy (type) {
        let thePool = this.projectilePools[type];
        if (thePool.idx >= 0) {
            return thePool.request();
        } else {
            return null;
        }
    },

    returnEnemy (type, obj) {
        let thePool = this.projectilePools[type];
        if (thePool.idx < thePool.size) {
            thePool.return(obj);
        } else {
            cc.log('Return obj to a full pool, something has gone wrong');
            return;
        }
    }
});
