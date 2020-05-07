
/**
 * 简易重力系统,该系统挂载在Canvas上，需要进行重力的Actor通过注册加入进重力系统中
 * Actor都继承自ActorBase ，有一个加速度且能响应碰撞。
 */

var ActorBase = require("ActorBase");
var FunctionLibrary = require("FunctionLibrary");
var CommonUtil = require("CommonUtil");

/*
    如果离开了之前的地面之后，又一次触发了离开地面而并没有踏上新地面，则开启重力下降
*/
var EStandNewState = {
    INITSTATE   :   0,  //该状态为起始状态
    STANDINGNEW :   1,  //该状态表明，踏上了新的地面
    LEAVEOLD    :   2,  //该状态表明，离开了之前踩着的地面
};

var GravityManager = cc.Class({
    extends: cc.Component,

    properties: {
        //一个向下的重力
        GravityVal : 0.6,

    },

    statics: {
        _instance: null,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        GravityManager._instance = this;

        //加入到该系统中的需要处理重力的Actor列表,Key 为Actor, Val为对应:
        //<Actor , Obj = { CallFunction , bOnGround } >
        this.GravityActorList = new Map();

        
    },

    onDestroy (){
        this.GravityActorList.clear();
    },

    start () {

    },

    update (dt) {
        //遍历所有需要进行重力处理的Actor
        for (var [key, value] of this.GravityActorList) {
            //在空中的才需要更新
            if(value.bOnGround == false){
                //获取加速度
                key.AYSpeed = key.AYSpeed - this.GravityVal;
                //还在空中更新重力位置，此时传回Y加速度更新位置
                var CurGravityActorData = this.GravityActorList.get(key);
                CurGravityActorData.CallFunction( key , key.AYSpeed , false , null );
            }
            
        }
    },

    /**
     * 添加Actor到该重力系统中  InCallFunction( InActor , AYSpeed ： 当前Y方向的加速度， bOnGround ： 如果该值为0，则使用第三个参数更新Actor的位置 GroundObj ： 用来更新该Actor的位置)
    */
    RigisterToGravity : function( InActor , InCallFunction ){
        //if( InActor instanceof Player){
            if(this.GravityActorList.has(InActor)){
                cc.log("该注册的Actor已经在重力系统中");
                return ;
            }
            else{
                var TempObj = {};
                //Update的时候，会不断的去回调这个CallFunction来修改其加速度
                TempObj.CallFunction = InCallFunction;
                TempObj.bOnGround = false;
                //4.27 新添加，再加一个字段判明，是否已经踩上了新的地面而老地面才离开
                TempObj.bStandInNewGround = EStandNewState.INITSTATE;
                this.GravityActorList.set(InActor , TempObj);

                //向该Actor中注册一个碰撞回调，用来判断该Actor是否站到了地面
                //一旦该Actor站到了地面上，则取消此回调
                //InActor.AddCollisionStartCall( this.OnActorCollisionCall , this, InActor );
                //再添加一个碰撞结束的回调，如果离开了地面就会触发（掉下悬崖） ,该状态是不删的！只有在清除的时候才删除
                InActor.AddCollisionEndCall(this.OnActorCollisionEndCall , this ,InActor );
                InActor.AddCollisionStayCall(this.OnActorCollisionStayCall , this ,InActor );

                cc.log("该Actor已经注册");
            }
        //}
        //else{
        //    cc.log("该注册的Actor不是一个ActorBase的继承类！");
        //}
    },

    /*清除一个Actor*/
    UnRigisterToGravity : function(InActor ){
        //if( InActor instanceof ActorBase ){
            if(this.GravityActorList.has(InActor)){

                InActor.RemoveCollisionEndCall(this.OnActorCollisionEndCall);
                InActor.RemoveCollisionStayCall(this.OnActorCollisionStayCall);

                this.GravityActorList.delete(InActor);
            }
        //}
    },

    /**
     * 让一个Actor跳起来,该动作为Actor设置一个向上的加速度，并且设置bOnGround为false,开启重力计算
     */
    SetJump : function( InActor , InASpeed){
        if(!this.GravityActorList.has(InActor)){
            cc.log("error!!!!!! 返回的Actor不在重力系统中");
        }

        var CurGravityActorData = this.GravityActorList.get(InActor);
        //CurGravityActorData.bOnGround = false;      //设置为在天空中  4.27晚上 不设置，由离开Collision来处理
        //4.30 如果在空中不可以跳跃
        if ( CurGravityActorData.bOnGround == false){
            return;
        }
             
        InActor.AYSpeed = InASpeed;
        CurGravityActorData.CallFunction( InActor , InActor.AYSpeed , false , null );
    },


    /**
     * 一个Actor碰撞到物体的回调，会在此判断是否碰撞到了地面,先暂时，在这里设置位置？
     */
    OnActorCollisionCall : function( other, self , InTarget , InActor){

        cc.log("Collision Start!!!!!!!");

        if(!InTarget.GravityActorList.has(InActor)){
            cc.log("error!!!!!! 返回的Actor不在重力系统中");
        }

        //4.27暂时直接写全名
        //if (other.node.name == "Background_road")
        if(FunctionLibrary.GetCollisionType(other) == CommonUtil.EObjType.TYPE_ROAD)
        {
            var CurGravityActorData = InTarget.GravityActorList.get(InActor);
            CurGravityActorData.bOnGround = true;
            CurGravityActorData.bStandInNewGround = EStandNewState.STANDINGNEW;

            //再重新设置一下Player的位置
            //var Bounds = FunctionLibrary.GetCollisionBoundsByBoxCollision(other);
            //var TempPos = InActor.node.getPosition();
            //InActor.node.setPosition(cc.v2(TempPos.x , Bounds.top));
            CurGravityActorData.CallFunction( InActor ,0 , true , other );

            //重新设置下List的值
            InTarget.GravityActorList.set(InActor , CurGravityActorData);

            //将该Actor的碰撞事件中清除监控
            //InActor.RemoveCollisionStartCall( InTarget.OnActorCollisionCall );
        }
    },

    /**
     * 当一个Actor离开地面碰撞的回调，在此会重新启动
     */
    OnActorCollisionEndCall : function(other, self , InTarget , InActor ){

        if(!InTarget.GravityActorList.has(InActor)){
            cc.log("error!!!!!! 返回的Actor不在重力系统中");
        }
        
        //4.27暂时直接写全名
        //if (other.node.name == "Background_road"){
        if(FunctionLibrary.GetCollisionType(other) == CommonUtil.EObjType.TYPE_ROAD){
            var CurGravityActorData = InTarget.GravityActorList.get(InActor);
            CurGravityActorData.bOnGround = false;      //设置为在地面上
            
            //重新设置下List的值
            InTarget.GravityActorList.set(InActor , CurGravityActorData);

            /*var CurGravityActorData = InTarget.GravityActorList.get(InActor);
            //如果没有踏上新的地面，则开启重力
            if (CurGravityActorData.bStandInNewGround == EStandNewState.LEAVEOLD){
                CurGravityActorData.bOnGround = false;      //设置为在天空中
                //重新设置下List的值
                InTarget.GravityActorList.set(InActor , CurGravityActorData);
            }
            else if (CurGravityActorData.bStandInNewGround == EStandNewState.STANDINGNEW)
            {
                CurGravityActorData.bStandInNewGround = EStandNewState.LEAVEOLD;
            }*/
            //向该Actor中注册一个碰撞回调，用来判断该Actor是否站到了地面
            //InActor.AddCollisionStartCall( InTarget.OnActorCollisionCall , InTarget, InActor );
        }
    },

    /**
     * 4.28 修改为，只有当不断的在地面上的时候，才会不更新重力
     */
    OnActorCollisionStayCall : function(other, self , InTarget , InActor ){
        if(!InTarget.GravityActorList.has(InActor)){
            cc.log("error!!!!!! 返回的Actor不在重力系统中");
        }
        
        //4.27暂时直接写全名
        //if (other.node.name == "Background_road"){
        if(FunctionLibrary.GetCollisionType(other) == CommonUtil.EObjType.TYPE_ROAD){
            var CollisionData = FunctionLibrary.CheckCollisionEdge(self , other);
            //如果不是下边碰到了地面
            if(CollisionData.bottom != true){
                return;
            }

            var CurGravityActorData = InTarget.GravityActorList.get(InActor);
            CurGravityActorData.bOnGround = true;      //设置为在地面上
            
            //重新设置下List的值
            InTarget.GravityActorList.set(InActor , CurGravityActorData);

            CurGravityActorData.CallFunction( InActor , 0 , true , other );

        }
    },


});
