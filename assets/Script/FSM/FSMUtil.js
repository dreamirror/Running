
//玩家状态枚举
var FSMStateID = {
    NONE    : 0,
    RUN     : 1,
    JUMP    : 2,

    /********* 以下为手臂武器状态相关 **********/
    ArmNormal       : 100,      //没有武器的普通手
    ArmDefaultWeapon   : 101,      //测试武器
    ArmDefaultWeaponAtt: 102,      //测试武器攻击状态
    ArmSwordNoraml  :   103,        //剑普通状态
    ArmSwordAttack  :   104,        //剑攻击状态
};

//玩家转换条件枚举
var TransConditionID = {
    NONE    :   0,
    RunToJump   :   1,
    JumpToRun   :   2,

    /********* 以下为手臂武器状态相关 **********/
    ArmNormalToDefaultWeapon    :   100,
    DefaultWeaponToAtt          :   101,
    DefaultWeaponAttToNormal    :   102,

    SwordNormalToAtt            :   103,
    SwordAttToNormal            :   104,

};


module.exports = {
    FSMStateID  :   FSMStateID,
    TransConditionID    : TransConditionID,
};