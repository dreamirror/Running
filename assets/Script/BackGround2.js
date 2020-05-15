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


        back_1 : {
            default: null,
            type: cc.Node
        },
        back_2 :{
            default: null,
            type: cc.Node
        },

        bg_house_1 :{
            default :null,
            type :cc.Prefab
        },

        houseCache :[],
        createCD : 5,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    random4 : function (n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    },

    
    createHouse(parentNode){

        var houseNum = this.random4(1,3);
        var blockWidth = this.back_1.width / houseNum;
        for(var i = 0;i<houseNum;i++)
        {
            var scale = this.random4(5,10);

            var house = cc.instantiate(this.bg_house_1);
            house.setScale(scale / 10);
            var x1 = this.random4(blockWidth * i,blockWidth * (i + 1) - house.width - 10);
            var y1 = this.random4(20,100) - house.height / 2;
            house.setPosition(cc.v2(x1,y1))
            parentNode.addChild(house)
        }


        

    },


    start () {

    },

     update (dt) {
        
        this.back_1.setPosition(this.back_1.getPosition().x -  window.SceneData.Speed * window.SceneData.BgSpeed *dt,0)
        this.back_2.setPosition(this.back_2.getPosition().x -  window.SceneData.Speed * window.SceneData.BgSpeed *dt,0)
        if(this.back_1.getPosition().x <= -this.back_1.width)
        {   
            this.back_1.removeAllChildren();
            this.back_1.setPosition(this.back_2.getPosition().x + this.back_1.width,0);
            this.createHouse(this.back_1);
             
        }

        if(this.back_2.getPosition().x <= -this.back_2.width){
            this.back_2.removeAllChildren();
            this.back_2.setPosition(this.back_1.getPosition().x +this.back_2.width,0);
            this.createHouse(this.back_2);
        }
     },
});
