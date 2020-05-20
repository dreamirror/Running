//此文件专用于定义各种全局事件名

var EventName = {

    TestEvent : "TestEvent",

    GetItem : "GetItem",
    TouchItem : "TouchItem",

    PlayerAttack : "OnPlayerAttacked",      //玩家武器攻击到物体

    PlayerDead : "OnPlayerDead",            //玩家死亡

    OnWeaponCount : "OnWeaponCount",      // 武器数量变化
    OnWeaponClear : "OnWeaponClear",     // 武器用完
    GetBuff : "GetBuff",                //获得buff

    ActivePointChange : "_ActivePointChange", //体力变化
    GoldChange : "_GoldChange", //金币变化
    
};



module.exports = EventName;