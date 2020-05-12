/*
* 用来进行Actor的创建等的管理类
*/
var ActorManager = cc.Class({
    extends: cc.Component,

    properties: {
        
        EnemyLowBee : {
            default : null,
            type : cc.Prefab
        },

        Player : {
            default : null, 
            type : cc.Prefab,
        },
        
        Dart : {
            default : null,
            type : cc.Prefab,
        },
    },

    statics: {
        _instance: null,
    },

    onLoad () {  
        ActorManager._instance = this;
        this.EnemyList = new Map();
        this.EnemyList.set("EnemyLowBee" , this.EnemyLowBee);
        
        this.FlyWeaponList = new Map();
        this.FlyWeaponList.set("weaponDart" , this.Dart);
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
                    return EnemyInstance;
                }
            };
        }

        return null;
    },

    /* 根据类型创建一个飞行道具 */
    CreateFlyWeapon : function ( InType) {
        var GameManager = cc.find("GameContainer").getComponent("GameManager");
        if( GameManager.PlayerWeaponConfig ){
            var WeaponID = null;
            if (GameManager.PlayerWeaponConfig.weapons[InType]){
                WeaponID = GameManager.PlayerWeaponConfig.weapons[InType].id;
            }

            if (WeaponID != null && this.FlyWeaponList.has(WeaponID)){
                var WeaponInstance = cc.instantiate(this.FlyWeaponList.get(WeaponID));
                if (WeaponInstance != null && WeaponInstance != undefined){
                    WeaponInstance.name = GameManager.PlayerWeaponConfig.weapons[InType].name;
                    return WeaponInstance;
                }
            };
        }
    },

});

module.exports = ActorManager;