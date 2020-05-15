/*
    场景中的物体的类型
*/
var EObjType = {
    TYPE_ROAD   :   0,
    TYPE_BARRIER:   1,
    TYPE_ENEMY  :   2,
    TYPE_ITEM   :   3,
    TYPE_WEAPON :   4,
    TYPE_PLAYER :   5,
};

/*
武器类型
*/
var WeaponType = {
    Default     :   0,
    Sword       :   1,
    Dart        :   2,  //飞镖
};

/*
* 敌人种类
*/
var EnemyType = {
    Default     :   0,
    LowBee      :   1,      //杂兵一号

};

/**
 * 敌人攻击类型 , 应该是可以自由组合到某个敌人身上
 */
var EnemyAttackType = {
    None            :   0,
    CloseAttack     :   1,  //近战
    DartAttack      :   2,  //扔飞镖

};

/**
 * 敌人AI运算结果类型,AI运算后返回一个当前敌人的状态，供后续的状态机使用。
 */
var EnemyRunAIResult = {
    Idle            :   0,  //原地不动
    CloseAttack     :   1,  //近距离攻击
    DistanceAttack  :   2,  //远距离攻击
    MoveToDistance  :   3,  //走向远处
    MoveToClose     :   4,  //走向近处

};

/**
 * 行走的方向，是向左，还是向右
 */
var MoveDirection = {
    MoveLeft    :   -1,
    MoveRight   :   1, 
};

module.exports = {
    EObjType    :   EObjType,
    WeaponType  :   WeaponType,
    EnemyType   :   EnemyType,
    EnemyAttackType :   EnemyAttackType,
    EnemyRunAIResult:   EnemyRunAIResult,
    MoveDirection : MoveDirection,
};