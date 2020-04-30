const ItemBase = require('ItemBase').ItemBase;
const Weapon = require('ItemBase').Weapon;
const GoldItem = require('ItemBase').GoldItem;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;

const Sprite1 = require('ItemBase').Sprite1;

cc.Class({
    extends: cc.Component,

    properties: {
        EntityPrefab : {
            default : null,
            type : cc.Prefab,
        }
    },

    start () {
        this.testSpawnItem();
    },

    //////////////////////////////////

    testSpawnItem() {
        
        cc.loader.loadRes('Config/ItemConfig', function (err, asset) {
            if(err){
                cc.log(err); 
                return;
            } 
            console.log(asset.json);
            for(var p in asset.json){//遍历json对象的每个key/value对,p为key
                var iteminfo = asset.json[p];
                var item;

                if (iteminfo.type == 0 ) {
                    item = new Weapon();
                } else {
                    item = new GoldItem();
                }
                item.init(iteminfo.id,iteminfo.name,iteminfo.icon);

                cc.log(this.EntityPrefab); 
                
                if (this.EntityPrefab) {
                    var pb = cc.instantiate(this.EntityPrefab);
                    pb.getComponent("ItemInGame").init(item);
                    this.node.addChild(pb);
                    pb.setPosition(Math.random()*500,500)
                }
            }
        });
    },


    touchStartBtn(){
        var AudioManager = cc.find("GameContainer").getComponent("AudioManager");
        if (AudioManager) {
            AudioManager.playEffect("Sound/sfx_score");
        }
        
        cc.director.loadScene("GameScene",function(){
            cc.log("GameScene launched!");
        });
    },
});
