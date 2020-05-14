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
        Trees : [cc.Prefab],
        TreeCache :[],
        cd : 3,
    },

    random4 : function (n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    //切换关卡的时候生成一大遮挡的背景
    changeLevel(){

        
    },

    updateTree(inx)
    {
        if(this.TreeCache.length > 0)
        {
            for(var index in this.TreeCache)
            {
                var tree = this.TreeCache[index];
                
                var x = tree.getPosition().x
                var y = tree.getPosition().y;
                if(x > - tree.width)
                {
                    tree.setPosition(cc.v2(x - inx,y));
                
                }

                else
                {
                    //超过屏幕位置之后就移除
                    tree.removeFromParent();
                    this.TreeCache.splice(index,1);
                }
                

            }
        }
    },

     update (dt) {

        this.cd -=dt;
        this.updateTree(window.SceneData.Speed *dt)
        if(this.cd <0)
        {   
            var index = this.random4(0,2);
            var tree = cc.instantiate(this.Trees[index]);
            this.node.addChild(tree);
            tree.setPosition(cc.v2(900,0));
            this.TreeCache.push(tree)
            this.cd = 5;
        }
     },
});
