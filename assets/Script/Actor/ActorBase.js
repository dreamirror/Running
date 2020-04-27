/** 
 * 所有角色的一个基类，拥有碰撞体，以及拥有可以注册的碰撞回调方法
 * 拥有可以操控动画的方法等
 * 如果重载Start方法，记得一定要把注册重力系统加上
*/

var GravityManager = require("GravityManager");

cc.Class({
    extends: cc.Component,

    properties: {
        //每个Actor都有的一个垂直方向加速度，用来计算重力，跳跃等
        AYSpeed : 0,

        //是否注册重力
        BUseGravity : false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {  
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

    /**
     * 重力系统的Update回调
     */
    UpdateGravity : function( InActor , AYSpeed, bOnGround , GroundObj){
        //cc.log("重力系统回调！");
        var TempPos = InActor.node.getPosition();
        InActor.node.setPosition(cc.v2(TempPos.x , TempPos.y + AYSpeed));
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

    /*****************  碰撞相关  *******************/
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        //console.log('on collision enter');

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
        //console.log('on collision stay');
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
        //console.log('on collision exit');

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


});