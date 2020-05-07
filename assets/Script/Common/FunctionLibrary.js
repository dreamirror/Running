/*
    通用函数库
*/

var CommonUtil = require("CommonUtil");
var FunctionLibrary = {};

/**
 * 传入一个加速度，会根据模拟的重力对加速度进行递减
 */
FunctionLibrary.CalculateJumpASpeed = function( InASpeed ){

    InASpeed -= 0.6;

    return InASpeed;
};

/**
 * 传入一个BoxCollision返回其在世界坐标中的碰撞体4边坐标
 * Cocos默认左下角为00  ,自动适应锚点
 * return : { left , top ,right ,bottom }
*/
FunctionLibrary.GetCollisionBoundsByBoxCollision = function( InBoxCollision ){
    if(InBoxCollision == null){
        return;
    }

    //先获取Node的坐标和锚点
    var NodePosition = InBoxCollision.node.parent.convertToWorldSpaceAR(InBoxCollision.node.position);
    //var NodePosition = InBoxCollision.node.getPosition();
    var NodeAnchor = InBoxCollision.node.getAnchorPoint();

    NodePosition.x = NodePosition.x - InBoxCollision.node.width * NodeAnchor.x;
    NodePosition.y = NodePosition.y - InBoxCollision.node.height * NodeAnchor.y;

    var CollisionSize = InBoxCollision.size;

    //边界
    var Bounds = {
    };

    Bounds.left = NodePosition.x;
    Bounds.right = NodePosition.x + CollisionSize.width;
    Bounds.bottom = NodePosition.y;
    Bounds.top = NodePosition.y + CollisionSize.height;

    return Bounds;
};

/**
 * 判断两个碰撞物体碰撞后，CollisionA是在BoxCollision的哪一边发生了碰撞
 * 一定是已经发生了碰撞之后才会进行判断
 * Param : CollisionA 碰撞体A ， CollisionB 碰撞体B
 */
FunctionLibrary.CheckCollisionEdge = function( CollisionA , CollisionB ){
    var BoundsA = this.GetCollisionBoundsByBoxCollision(CollisionA);
    var BoundsB = this.GetCollisionBoundsByBoxCollision(CollisionB);

    var ReturnVal = {
        left : false,
        right : false,
        top : false,
        bottom : false,
        
    };

    //设置B的四个点做成Vec2[]
    //var BPolygon = [ cc.Vec2(BoundsB.left , BoundsB.top) , cc.Vec2(BoundsB.right , BoundsB.top) , cc.Vec2(BoundsB.left , BoundsB.bottom) , cc.Vec2(BoundsB.right , BoundsB.bottom) ];
    //判断左上点
    //if( cc.Intersection.pointInPolygon( cc.Vec2(BoundsA.left , BoundsA.top),BPolygon ) ){
    if( BoundsA.left <= BoundsB.right && BoundsA.left >= BoundsB.left){
        ReturnVal.left = true ;
    }
    if( BoundsA.top >= BoundsB.bottom && BoundsA.top <= BoundsB.top){
        ReturnVal.top = true;
    }
    if(BoundsA.right >= BoundsB.left && BoundsA.right <= BoundsB.right){
        ReturnVal.right = true;
    }
    if(BoundsA.bottom <= BoundsB.top && BoundsA.bottom >= BoundsB.bottom){
        ReturnVal.bottom = true;
    } 

    return ReturnVal;
};

/**
 * 根据碰撞体的名字，获取对应的碰撞物类型 , Param 传入碰撞的Collision
 * road_    :   陆地
 * ba_      :   障碍物
 * en_      :   敌人
 * item_    :   道具
 * weapon_  :   武器

 */
FunctionLibrary.GetCollisionType = function( InCollision ){
    if( InCollision && InCollision.node)
    {
        if( InCollision.node.name.search("road_") !=-1 )
        {
            return CommonUtil.EObjType.TYPE_ROAD;
        }
        else if( InCollision.node.name.search("ba_") !=-1 )
        {
            return CommonUtil.EObjType.TYPE_BARRIER;
        }
        else if( InCollision.node.name.search("en_") !=-1 )
        {
            return CommonUtil.EObjType.TYPE_ENEMY;
        }
        else if( InCollision.node.name.search("item_") !=-1 )
        {
            return CommonUtil.EObjType.TYPE_ITEM;
        }
        else if( InCollision.node.name.search("weapon_") !=-1 )
        {
            return CommonUtil.EObjType.TYPE_WEAPON;
        }
        else if( InCollision.node.name.search("Player") != -1 )
        {
            return CommonUtil.EObjType.TYPE_PLAYER;
        }
    }
};








module.exports = FunctionLibrary;


