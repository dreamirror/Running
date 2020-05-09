/*
* 用来进行Actor的创建等的管理类
*/
var GameManager = require("GameManager");

var ActorManager = cc.Class({
    extends: cc.Component,

    properties: {
        
        EnemyLowBee : {
            default : null,
            type : cc.Prefab
        },
        
    },

    statics: {
        _instance: null,
    },

    onLoad () {  
        ActorManager._instance = this;
        this.EnemyList = new Map();
        this.EnemyList.set("EnemyLowBee" , this.EnemyLowBee);
        
    },

    /**
     * 创建一个玩家Player
     */
    CreatePlayer : function( ) {
        
        return null;
    },

    /**
    * 根据传入的type返回一个敌人
    */
    CreateEnemy : function( InType) {
        var GameManager = cc.find("GameContainer").getComponent("GameManager");
        if( GameManager.EnemyConfigData ){
            var EnemyID = null;
            if (GameManager.EnemyConfigData.EnemyType[InType]){
                EnemyID = GameManager.EnemyConfigData.EnemyType[InType].ID;
            }
            
            if (EnemyID != null && this.EnemyList.has(EnemyID)){
                var EnemyInstance = cc.instantiate(this.EnemyList.get(EnemyID));
                if (EnemyInstance != null && EnemyInstance != undefined){
                    EnemyInstance.name = GameManager.EnemyConfigData.EnemyType[InType].Name;
                    return EnemyInstance;
                }
            };
        }

        return null;
    },



});


