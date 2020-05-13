
var NodePool = cc.Class({
    name: 'NodePool',
    properties: {
        prefab: cc.Prefab,
        size: 0,
        poolName : "default"
    },

    ctor () {
        this.idx = 0;
        this.initList = [];
        this.list = [];
    },

    init () {
        for ( let i = 0; i < this.size; ++i ) {
            let obj = cc.instantiate(this.prefab);
            this.initList[i] = obj;
            this.list[i] = obj;
        }
        this.idx = this.size;
    },

    reset () {
        for ( let i = 0; i < this.size; ++i ) {
            let obj = this.initList[i];
            this.list[i] = obj;
            if (obj.active) {
                obj.active = false;
            }
            if (obj.parent) {
                obj.removeFromParent();
            }
        }
        this.idx = this.size;
    },

    request ()  {
        --this.idx;
        if ( this.idx < 0 ) {
            cc.log ("Error: the pool do not have enough free item.");
            return null;
        }
        let obj = this.list[this.idx];
        if ( obj ) {
            obj.active = true;
        }

        return obj;
    },
    
    return ( obj ) {
        ++this.idx;
        obj.active = false;
        if (obj.parent) {
            obj.removeFromParent();
        }
        this.list[this.idx] = obj;
    }
});

module.exports = NodePool;