/*
    场景中的物体的类型
*/
var EObjType = {
    TYPE_ROAD   :   0,
    TYPE_BARRIER:   1,
    TYPE_ENEMY  :   2,
    TYPE_ITEM   :   3,
    TYPE_WEAPON :   4,
};

/*
武器类型
*/
var WeaponType = {
    Default     :   0,
    Sword       :   1,
    Dart        :   2,  //飞镖
};





module.exports = {
    EObjType    : EObjType,
    WeaponType  : WeaponType,
};