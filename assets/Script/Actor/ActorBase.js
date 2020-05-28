/** 
 * 所有角色的一个基类，拥有碰撞体，以及拥有可以注册的碰撞回调方法
 * 拥有可以操控动画的方法等
 * 如果重载Start方法，记得一定要把注册重力系统加上,或者直接调用this._super();
*/

var GravityManager = require("GravityManager");
var FunctionLibrary = require("FunctionLibrary");

cc.Class({
    extends: cc.Component,

    properties: {
        //每个Actor都有的一个垂直方向加速度，用来计算重力，跳跃等
        AYSpeed : 0,

        //是否注册重力
        BUseGravity : false,

        //血量
        HP : 1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {  
        //this.InitVariable();
    },

    start () {
        this.InitVariable();
        
        if(this.BUseGravity && GravityManager._instance){
            GravityManager._instance.RigisterToGravity(this , this.UpdateGravity);
        }    
    },

    onDestroy (){
        //if( GravityManager._instance){
        //    GravityManager._instance.UnRigisterToGravity(this);
        //} 
    },

    update (dt) {
        
    },

    /**初始化数据 */
    InitVariable : function( ) {
        this.anim = this.node.getComponent(cc.Animation);

        /* 用来碰撞的委托相关 */
        //开始碰撞的回调
        this.CollisionStartCallList = new Map();
        //碰撞中的回调
        this.CollisionStayCallList = new Map();
        //碰撞结束的回调
        this.CollisionEndCallList = new Map();
        //保存一份GameManager
        var GameContainer = cc.find("GameContainer");
        if (GameContainer)
            this.GameManager = cc.find("GameContainer").getComponent("GameManager");

        
    },

    /*****************  Player 的方法  *******************/
    //添加开始碰撞回调 , Target 是函数拥有者
    AddCollisionStartCall : function( InFunction , Target , Param){
        if(this.CollisionStartCallList.has(InFunction)){
            cc.log("AddCollisionStartCall this Function is Already has!!!");
        }
        else{
            var ValTarget = {};
            ValTarget.Target = Target;
            ValTarget.Param = Param;
            this.CollisionStartCallList.set(InFunction , ValTarget);//Target);
        }
        
    },
    //删除某一个开始碰撞回调
    RemoveCollisionStartCall : function( InFunction ){
        if(this.CollisionStartCallList.has(InFunction)){
            this.CollisionStartCallList.delete(InFunction);
        }
    },
    //添加碰撞结束回调
    AddCollisionEndCall : function( InFunction , Target , Param){
        if(this.CollisionEndCallList.has(InFunction)){
            cc.log("AddCollisionEndCall this Function is Already has!!!");
        }
        else{
            var ValTarget = {};
            ValTarget.Target = Target;
            ValTarget.Param = Param;
            this.CollisionEndCallList.set(InFunction , ValTarget);//Target);
        }
        
    },
    //删除某一个开始碰撞回调
    RemoveCollisionEndCall : function( InFunction ){
        if(this.CollisionEndCallList.has(InFunction)){
            this.CollisionEndCallList.delete(InFunction);
        }
    },
    //添加碰撞中的回调
    AddCollisionStayCall : function( InFunction , Target , Param){
        if(this.CollisionStayCallList.has(InFunction)){
            cc.log("AddCollisionEndCall this Function is Already has!!!");
        }
        else{
            var ValTarget = {};
            ValTarget.Target = Target;
            ValTarget.Param = Param;
            this.CollisionStayCallList.set(InFunction , ValTarget);//Target);
        }
        
    },
    //删除某一个碰撞中的回调
    RemoveCollisionStayCall : function( InFunction ){
        if(this.CollisionStayCallList.has(InFunction)){
            this.CollisionStayCallList.delete(InFunction);
        }
    },

    /**
     * 重力系统的Update回调
     */
    UpdateGravity : function( InActor , AYSpeed, bOnGround , GroundObj){
        if (InActor.GameManager == null || InActor.GameManager == undefined){
            var GameContainer = cc.find("GameContainer");
            if (GameContainer){
                InActor.GameManager = cc.find("GameContainer").getComponent("GameManager");
            }
        }

        //cc.log("重力系统回调！");
        var TempPos = InActor.node.getPosition();
        InActor.node.setPosition(cc.v2(TempPos.x , TempPos.y + AYSpeed));

        if(bOnGround == true )
        {
            var Bounds = FunctionLibrary.GetCollisionBoundsByBoxCollision(GroundObj);
            
            var TempPos = InActor.node.getPosition();
            var NodePos = InActor.node.parent.convertToNodeSpaceAR(cc.v2(TempPos.x , Bounds.top));

            InActor.node.setPosition(TempPos.x , NodePos.y);
            //InActor.node.setPosition(cc.v2(TempPos.x , Bounds.top));
        }

        //设置一个屏幕的最高高度 5.27
        var windowSize = cc.winSize; 
        var ActorPos = InActor.node.getPosition();
        var ScenePos = InActor.node.parent.convertToNodeSpaceAR(cc.v2(0 , windowSize.height));
        if(ActorPos.y >= ScenePos.y - InActor.node.width)
        {
            ActorPos.y = ScenePos.y - InActor.node.width;
        }
        InActor.node.setPosition(TempPos.x , ActorPos.y);

        //5.7 判断下 当前的Node如果低于死亡高度，则设置角色死亡
        if (InActor.GameManager != null && InActor.GameManager != undefined){
            var TempPos = InActor.node.convertToWorldSpaceAR(cc.v2(0,0)); // 5.15 修改为世界坐标 InActor.node.getPosition();
            if (TempPos.y <= InActor.GameManager.GameConfigData.DeadHeight ){
                InActor.ActorDead();
            }
        }
        
    },



    /********************  动画相关  *********************/
    /**
     * 获取当前的Animation组件
     */
    GetAnimation : function(){
        if ( !this.anim || !cc.isValid(this.anim)) {
            this.anim = this.node.getComponent(cc.Animation);
            if ( !this.anim || !cc.isValid(this.anim)) {
                cc.log( "当前Player上没有Animation组件！" );
                return null;
            }
        };
        
        return this.anim;
    },

    /**
     * 如果当前Animation组件包含传入动画，则播放该动画并且返回该动画的AnimationState ,此为播放主身体的动画
     * @param {需要播放的动画名} InAnimName 
     */
    PlayAnimation :function( InAnimName ){
        if ( !this.anim || !cc.isValid(this.anim)) {
            this.anim = this.node.getComponent(cc.Animation);
            if ( !this.anim || !cc.isValid(this.anim)) {
                cc.log( "当前Player上没有Animation组件！" );
                return;
            }
        };

        var animclips = this.anim.getClips();
        for (var i=0; i< animclips.length; i++) {
            if( animclips[i].name == InAnimName){
                //先直接播放
                var animationState = this.anim.play(InAnimName);
                return animationState;
            }
        };
    },

    /**
     * 在当前的动画上添加AnimationClip
     * @param {需要添加的动画帧集合} InFrames 
     * @param {一共多少帧} InSample 
     * @param {动画名字} InAnimName 
     * @param {播放类型，循环还是  cc.WrapMode} InWrapMode 
     */
    AddAnimationClip :function( InFrames, InSample, InAnimName , InWrapMode ){
        if ( !this.anim || cc.isValid(this.anim)) {
            cc.log( "当前Player上没有Animation组件！" );
            return;
        };

        var clip = cc.AnimationClip.createWithSpriteFrames(InFrames, InSample);
        clip.name = InAnimName;
        clip.wrapMode = InWrapMode;

        this.anim.addClip(clip);

        return clip;
    },

    /**
     * 向在预先预留好的函数中，设置回调事件
     */ 
    SetAnimationCustomEventOneCallBack : function( InTarget , InFunction ){
        this.CustomEventOneCallBack = {
            Target : InTarget,
            Function : InFunction
        }
    },
    RemoveAnimationCustomEventOneCallBack : function( InTarget , InFunction ){
        this.CustomEventOneCallBack = null;
    },
    SetAnimationCustomEventTwoCallBack : function( InTarget , InFunction ){
        this.CustomEventTwoCallBack = {
            Target : InTarget,
            Function : InFunction
        }
    },
    RemoveAnimationCustomEventTwoCallBack : function( InTarget , InFunction ){
        this.CustomEventTwoCallBack = null;
    },

    /**
     * 预先预留好的回调函数1 ， 在动画中插入事件时可以回调到
     */
    AnimationCustomEventOne : function( InString ,InNumber , InBoolean){
        if (this.CustomEventOneCallBack != null){
            this.CustomEventOneCallBack.Function.call(this.CustomEventOneCallBack.Target, InString ,InNumber , InBoolean)
        }
    },
    /**
     * 预先预留好的回调函数2 ， 在动画中插入事件时可以回调到
     */
    AnimationCustomEventTwo : function( InString ,InNumber , InBoolean){
        if (this.CustomEventTwoCallBack != null){
            this.CustomEventTwoCallBack.Function.call(this.CustomEventOneCallBack.Target, InString ,InNumber , InBoolean)
        }
    },

    /*****************  碰撞相关  *******************/
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        if(this.CollisionStartCallList == null || this.CollisionStartCallList == undefined){
            return;
        }
            
        //分发碰撞事件
        this.CollisionStartCallList.forEach(function(value,key){
            key(other,self ,value.Target , value.Param);
        });
    },

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        if(this.CollisionStayCallList == null || this.CollisionStayCallList == undefined){
            return;
        }
        //分发碰撞事件
        this.CollisionStayCallList.forEach(function(value,key){
            key(other,self ,value.Target , value.Param);
        });
    },
    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        if(this.CollisionEndCallList == null || this.CollisionEndCallList == undefined){
            return;
        }

        //分发碰撞事件
        this.CollisionEndCallList.forEach(function(value,key){
            key(other,self ,value.Target , value.Param);
        });
    },

    /****************** 在此进行一个timer的管理器 *********************/
    CreateTimerOnce : function(InCallback, Indelay , InParam){
        if (this.TimerOnceCall != null || this.TimerOnceParam != null )
        {
            cc.log("FSMMgr CreateTimerOnce has aleady run!!");
            return;
        }
        this.TimerOnceParam = InParam;
        this.TimerOnceCall = InCallback;
        this.scheduleOnce( this.TimerOnceCallBack ,Indelay);
    },

    TimerOnceCallBack : function(){
        this.TimerOnceCall(this.TimerOnceParam);
        this.TimerOnceCall = null;
        this.TimerOnceParam = null;
    },

    ClearTimer : function( InCallback, InTarget ){
        this.unschedule(InCallback , InTarget);
    },

    /****************** 角色状态等相关 *********************/
    ActorDead : function ( ) {

    },

});