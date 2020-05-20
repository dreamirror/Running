/*
* 用来进行Actor的创建等的管理类
*/
var ActorItem = cc.Class({
    properties: {
        prefab: cc.Prefab,
        id : "NULL",
    },

    ctor () {
    },

});

var ActorManager = cc.Class({
    extends: cc.Component,

    properties: {
        Player : {
            default : null, 
            type : cc.Prefab,
        },
        
        Dart : {
            default : null,
            type : cc.Prefab,
        },
        
        EnemyPrefabList : {
            default: [],
            type : ActorItem
        },
        WeaponPrefabList : {
            default: [],
            type : ActorItem
        },

        //创建出来的敌人列表
        EnemyInstanceList : null,
    },

    statics: {
        _instance: null,
    },

    onLoad () {  
        ActorManager._instance = this;

        this.InitInstanceList();

        this.DealPrefabList();

        //this.FlyWeaponList = new Map();
        //this.FlyWeaponList.set("weaponDart" , this.Dart);
    },

    /** 创建一些用来存储实例的Array*/
    InitInstanceList : function(){
        this.EnemyInstanceList = new Array();
        
    },

    /*
    遍历一下，将Prefab的List对应转化成Map方便查询
    */
    DealPrefabList : function() {

        //处理敌人Prefab
        this.EnemyList = new Map();
        for (let index = 0; index < this.EnemyPrefabList.length; index++) {
            const element = this.EnemyPrefabList[index];
            this.EnemyList.set(element.id,element.prefab);
        }

        //处理下武器的PrefabList
        this.FlyWeaponList = new Map();
        for (let index = 0; index < this.WeaponPrefabList.length; index++) {
            const element = this.WeaponPrefabList[index];
            this.FlyWeaponList.set(element.id,element.prefab);
        }
        
    },


    /**
     * 创建一个玩家Player 并直接把玩家加入到当前页面中
     */
    CreatePlayer : function( ) {
        
        var Player = cc.instantiate(this.Player);
        if (Player != null && Player != undefined){
            return Player;
        }

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

                    //5.13 尝试能否通过基类获取对应的Component
                    var EnemyJS = EnemyInstance.getComponent("EnemyBase");
                    if(EnemyJS != null){
                        EnemyJS.InitEnemyType(GameManager.EnemyConfigData.EnemyType[InType]); //EmenyData = GameManager.EnemyConfigData.EnemyType[InType];
                    }

                    this.EnemyInstanceList.push(EnemyInstance);
                    return EnemyInstance;
                }
            };
        }

        return null;
    },
    /* 传入一个敌人并且删除 */
    DeleteEnemy : function( InEnemyInstance ){
        var pos = this.EnemyInstanceList.indexOf(InEnemyInstance);
        if (pos != undefined && pos != -1){
            this.EnemyInstanceList.splice(pos, 1);
            InEnemyInstance.destroy();
        }
    },
    /* 获取当前场景中的敌人 */
    GetEnemy : function ( Index ){
        if( Index != null && Index != undefined && Index > -1 && this.EnemyInstanceList.length > Index){
            return this.EnemyInstanceList[Index];
        }
        
        return this.EnemyInstanceList;
    },


    /**
     * 根据传入的Type创建一个Boss
     * */
    CreateBoss : function( InType) {
        var GameManager = cc.find("GameContainer").getComponent("GameManager");
        if( GameManager.EnemyConfigData ){
            var EnemyID = null;
            if (GameManager.EnemyConfigData.BossConfig[InType]){
                EnemyID = GameManager.EnemyConfigData.BossConfig[InType].id;
            }
            
            if (EnemyID != null && this.EnemyList.has(EnemyID)){
                var EnemyInstance = cc.instantiate(this.EnemyList.get(EnemyID));
                if (EnemyInstance != null && EnemyInstance != undefined){
                    EnemyInstance.name = GameManager.EnemyConfigData.BossConfig[InType].Name;

                    //5.13 尝试能否通过基类获取对应的Component
                    var EnemyJS = EnemyInstance.getComponent("EnemyBase");
                    if(EnemyJS != null){
                        EnemyJS.InitEnemyType(GameManager.EnemyConfigData.BossConfig[InType]); //EmenyData = GameManager.EnemyConfigData.EnemyType[InType];
                    }

                    return EnemyInstance;
                }
            };
        }

        return null;
    },

    /* 根据类型创建一个飞行道具 */
    CreateFlyWeapon : function ( InType) {
        var GameManager = cc.find("GameContainer").getComponent("GameManager");
        if( GameManager.WeaponConfig ){
            var WeaponID = null;
            if (GameManager.WeaponConfig.weapons[InType]){
                WeaponID = GameManager.WeaponConfig.weapons[InType].id;
            }

            if (WeaponID != null && this.FlyWeaponList.has(WeaponID)){
                var WeaponInstance = cc.instantiate(this.FlyWeaponList.get(WeaponID));
                if (WeaponInstance != null && WeaponInstance != undefined){
                    WeaponInstance.name = GameManager.WeaponConfig.weapons[InType].name;
                    return WeaponInstance;
                }
            };
        }
    },

});

module.exports = ActorManager;