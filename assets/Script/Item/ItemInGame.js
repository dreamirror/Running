//挂载在UI上的执行逻辑

const EventName = require("GlobalEventName");


cc.Class({
    extends: cc.Component,

    init(itemBase,player){
        this.ItemInfo = itemBase;
        this.GamePlayer = player;
        let self = this;  

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;     //开启碰撞检测
        cc.director.getCollisionManager().enabledDebugDraw = true;

        if (self.ItemInfo) {
            cc.loader.loadRes(self.ItemInfo.Icon, function(err,img){
                var mylogo  = new cc.SpriteFrame(img); 
                self.node.getComponent(cc.Sprite).spriteFrame = mylogo;
            });
        }
    },

    onLoad () {
        this.pickRadius = 300; //磁铁吸引的距离
        this.NeedFly = false;
    },

    //正常来说 只有主角会碰上道具
    onCollisionEnter:function(_other,_self){
        if( _other.node.name.search("Player") != -1 ){
             //广播获得了道具
            //  let itemEvent = new cc.Event.EventCustom("GetItem", true);//创建自定义事件
            //  itemEvent.setUserData(this.OwnedItem);    //设置自定义事件中包含的数据
            //  this.node.dispatchEvent(itemEvent);  
            EventCenter.emit(EventName.GetItem,this.ItemInfo);

            //清除自身
            this.node.removeFromParent();
        }   
    },

    //当玩家有磁铁buff的时候，通过更新相距的距离来检测是否会吃掉
    update(dt){
        if ( this.NeedFly ) {
            this.onFly(dt);
            return;
        }

         // 每帧判断和主角之间的距离是否小于收集距离
        if (cc.find("GameContainer").getComponent("GameData").checkPlayerMagnet() == true && this.getPlayerDistance() < this.pickRadius) {
            this.NeedFly = true;
            //将原来的节点移至和player同一层，再执行飞向player的过程
            var pos = this.node.convertToWorldSpaceAR(cc.v2(0,0));
            this.node.parent = cc.director.getScene()
            this.node.setPosition(pos)
            return;
        }

    },

    //检查距离玩家的距离
    getPlayerDistance: function () {
        var playerPos = this.GamePlayer.convertToWorldSpaceAR(this.GamePlayer.position);
        // 根据两点位置计算两点之间距离
        let nodeWorldPos = this.node.convertToWorldSpaceAR(this.node.position);
        var dist = nodeWorldPos.sub(playerPos).mag();
        return dist;
    },

    //做一个飞向玩家的效果，直到撞上并消失
    //在父节点上，朝着玩家移动。
    onFly : function (dt) {
        //////// 每帧更新方向向量
        var dir = cc.v2(this.GamePlayer.x, (this.GamePlayer.y + 60)).sub(cc.v2( this.node.x, this.node.y));
        //单位化向量
        dir.normalizeSelf();
    
        //根据方向向量移动位置
        var moveSpeed = 850;
        this.node.x += dt * dir.x * moveSpeed;
        this.node.y += dt * dir.y * moveSpeed;

    }
});
