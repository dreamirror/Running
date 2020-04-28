/*
    通用函数库
*/
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
    var NodePosition = InBoxCollision.node.getPosition();
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










module.exports = FunctionLibrary;


