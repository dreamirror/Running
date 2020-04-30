const ItemBase = require('ItemBase').ItemBase;
const EItemType = require('ItemBase').EItemType;
const SaveItem = require('ItemBase').SaveItem;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        //this.testSpawnItem();
    },

    //////////////////////////////////

    testSpawnItem() {
        let self = this;
        cc.loader.loadRes('ItemConfig', function (err, asset) {
            if(err){
                cc.log(err); 
                return;
            } 
            let index = 0;
            for(var p in asset.json){//遍历json对象的每个key/value对,p为key
                var iteminfo = asset.json[p];
                var item = new ItemBase();

                item.init(iteminfo.id,iteminfo.name,iteminfo.icon);
                var GameData = cc.find("GameContainer").getComponent("GameData");
                GameData.addItem( iteminfo,1);

                if (self.EntityPrefab) {
                    let pb = cc.instantiate(self.EntityPrefab);
                    pb.getComponent("ItemInGame").init(item);
                    //pb.parent = cc.director.getScene();  //加到当前场景
                    self.node.addChild(pb);                 //加到父节点（这里是canvas）
                    let x = index * 150 - 50;
                    pb.setPosition(cc.v2(x,0));
                }
                
                index = index + 1;
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
