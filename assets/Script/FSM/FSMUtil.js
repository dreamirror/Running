
//玩家状态枚举
var FSMStateID = {
    NONE    : 0,
    RUN     : 1,
    JUMP    : 2,

    /********* 以下为手臂武器状态相关 **********/
    ArmNormal       : 100,      //没有武器的普通手
    ArmDefaultWeapon   : 101,      //初始武器
    ArmDefaultWeaponAtt: 102,      //初始武器攻击状态
    ArmSwordNoraml  :   103,        //剑普通状态
    ArmSwordAttack  :   104,        //剑攻击状态

    ArmDartNormal   :   105,        //飞镖普通状态
    ArmDartAttack   :   106,        //飞镖攻击状态

    /***************   敌人状态枚举 **************/
    EnemyIdle       :   500,    //敌人Idle状态
    EnemyCloseAttack    :   501,    //敌人近程攻击状态
    EnemyDistanceAttack :   502,    //敌人远程攻击状态
    EnemyDead       :   503,        //敌人死亡状态
    EnemyMoveToDistance :   504,    //敌人移动到远处
    EnemyMoveToClose    :   505,    //敌人移动到近处
    EnemyPoised         :   506,    //敌人攻击前的蓄力
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

    DartNormalToAtt            :   105,
    DartAttToNormal            :   106,

    /***************   敌人状态转换条件 **************/
    EnemyIdelToCloseAttack      :   501,    //敌人Idle状态到近程攻击状态
    EnemyIdelToDistanceAttack   :   502,    //敌人Idle状态到远程攻击状态
    EnemyCloseAttackToIdle      :   503,    //近距离攻击转站立
    EnemyDisAttToIdle           :   504,    //远距离攻击转站立
    EnemyDisAttToCloseAtt       :   505,    //远距离攻击转近距离攻击
    //其余转换条件不写了，都可以强制转换

};


module.exports = {
    FSMStateID  :   FSMStateID,
    TransConditionID    : TransConditionID,
};