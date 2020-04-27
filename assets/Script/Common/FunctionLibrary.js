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
 * 判断两个碰撞物体是
 */










module.exports = FunctionLibrary;


