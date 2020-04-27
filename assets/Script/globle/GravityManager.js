
/**
 * 简易重力系统,该系统挂载在Canvas上，需要进行重力的Actor通过注册加入进重力系统中
 * Actor都继承自ActorBase ，有一个加速度且能响应碰撞。
 */

var ActorBase = require("ActorBase");

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
                CurGravityActorData.CallFunction( key.AYSpeed , false , null );
            }
            
        }
    },

    /**
     * 添加Actor到该重力系统中  InCallFunction( AYSpeed ： 当前Y方向的加速度， bOnGround ： 如果该值为0，则使用第三个参数更新Actor的位置 GroundObj ： 用来更新该Actor的位置)
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
                this.GravityActorList.set(InActor , TempObj);

                //向该Actor中注册一个碰撞回调，用来判断该Actor是否站到了地面
                //一旦该Actor站到了地面上，则取消此回调
                InActor.AddCollisionStartCall( this.OnActorCollisionCall , this, InActor );

                cc.log("该Actor已经注册");
            }
        //}
        //else{
        //    cc.log("该注册的Actor不是一个ActorBase的继承类！");
        //}
    },

    /*清除一个Actor*/
    UnRigisterToGravity : function(InActor ){
        if( InActor instanceof ActorBase ){
            if(this.GravityActorList.has(InActor)){
                this.GravityActorList.delete(InActor);
            }
        }
    },

    /**
     * 让一个Actor跳起来,该动作为Actor设置一个向上的加速度，并且设置bOnGround为false,开启重力计算
     */
    SetJump : function( InActor , InASpeed){
        if(!this.GravityActorList.has(InActor)){
            cc.log("error!!!!!! 返回的Actor不在重力系统中");
        }

        var CurGravityActorData = this.GravityActorList.get(InActor);
        CurGravityActorData.bOnGround = false;      //设置为在天空中
        InActor.AYSpeed = InASpeed;

        //重新设置下List的值
        this.GravityActorList.set(CurGravityActorData);

        //向该Actor中注册一个碰撞回调，用来判断该Actor是否站到了地面
        InActor.AddCollisionStartCall( this.OnActorCollisionCall , this, InActor );
    },


    /**
     * 一个Actor碰撞到物体的回调，会在此判断是否碰撞到了地面,先暂时，在这里设置位置？
     */
    OnActorCollisionCall : function( other, self , InTarget , InActor){
        if(!this.GravityActorList.has(InActor)){
            cc.log("error!!!!!! 返回的Actor不在重力系统中");
        }

        if (other.node.name == "Background_road")
        {
            var CurGravityActorData = this.GravityActorList.get(InActor);
            CurGravityActorData.bOnGround = true;

            //再重新设置一下Player的位置
            //var Bounds = FunctionLibrary.GetCollisionBoundsByBoxCollision(other);
            //var TempPos = InActor.node.getPosition();
            //InActor.node.setPosition(cc.v2(TempPos.x , Bounds.top));
            CurGravityActorData.CallFunction( 0 , true , other );

            //重新设置下List的值
            this.GravityActorList.set(CurGravityActorData);

            //将该Actor的碰撞事件中清除监控
            InActor.RemoveCollisionStartCall( this.OnActorCollisionCall );
        }

    }

});
