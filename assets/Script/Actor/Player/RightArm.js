/*
    玩家手臂类（武器类），拥有一个自己的碰撞体，可以检测攻击等，可以单独设置动画等
*/

var ActorBase = require("ActorBase");

var RightArm = cc.Class({
    extends: ActorBase,

    properties: {

        RightArmFSMMgr : {
            default : null,
        },

    },

    onLoad () {  
        
        this.LoadWeaponPrefab();
   
    },

    update(dt){
        this._super();
        //this.LoadWeaponPrefab();
    },

    //加载所有武器
    LoadWeaponPrefab : function( ) {
        //创建一个结构用来存储所有生成的武器
        this.PlayerPrefabWeapons = new Map();

        var self = this;
        /* 先根据配置把预制武器全部都加载出来吧 */
        cc.loader.loadRes('Config/PlayerConfig',function (err, asset) {
            if(err){
                cc.log("加载玩家武器报错！：" + err); 
                return;
            };

            if( asset && asset.json && asset.json.weapons )
            {
                for(var key in asset.json.weapons){
                    //根据对应的Prefab创建武器，并且加入到手部的武器列表中
                    var WeaponConfig = asset.json.weapons[key];
                    if (WeaponConfig && WeaponConfig.prefab) {
                        //var CurWeapon = cc.instantiate(WeaponConfig.prefab);
                        cc.loader.loadRes(WeaponConfig.prefab ,function (errLoadWeapon, assetWeapon) {
                            if(assetWeapon){
                                var CurWeapon = cc.instantiate(assetWeapon);
                                if (CurWeapon){
                                    self.node.addChild(CurWeapon);

                                    if(WeaponConfig.Pos){
                                        var PosArr = WeaponConfig.Pos.split(",");
                                        if(PosArr){
                                            CurWeapon.setPosition(cc.v2(PosArr[0], PosArr[1]));
                                        }
                                    };
                                    if(WeaponConfig.Rotaion){
                                        CurWeapon.angle = WeaponConfig.Rotaion;
                                    }
                                    if( WeaponConfig.Anchor )
                                    {
                                        var AnchorArr = WeaponConfig.Anchor.split(",");
                                        if(AnchorArr){
                                            CurWeapon.setAnchorPoint(AnchorArr[0], AnchorArr[1]);
                                        }
                                    }

                                    //将该武器存储
                                    var WeaponData = {
                                        WeaponCtl   :   CurWeapon,
                                        WeaponConfig  :   WeaponConfig,
                                    };
                                    self.PlayerPrefabWeapons.set(WeaponConfig.id , WeaponData );
                                    CurWeapon.active = false;
                                }
                                
                            }
                        });
                    }
                }
            }
        });
    },

    //setArmFSm
    SetFSM : function( InFSM ){
        this.RightArmFSMMgr = InFSM;
    },
    GetFSM : function(){
        return this.RightArmFSMMgr;
    },

    //切换武器
    ChangeWeapon : function( InWeaponID ) {
        if(this.PlayerPrefabWeapons.has(InWeaponID))
        {
            var WeaponData = this.PlayerPrefabWeapons.get(InWeaponID);
            var WeaponCtl = WeaponData.WeaponCtl;
            WeaponCtl.active = true;

            //再根据配置切换状态机
            if(this.RightArmFSMMgr){
                this.RightArmFSMMgr.ForceSetFSMState(WeaponData.WeaponConfig.NormalStateID , null, null );
            }
        }
    },

});

module.exports = RightArm;
