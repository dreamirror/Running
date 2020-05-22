var WeaponBase = require("WeaponBase");
var ActorManager = require( "ActorManager" );
var FSMUtil = require("FSMUtil");

cc.Class({
    extends: WeaponBase,


    onLoad(){
        this.waitToAttck = []; //等待攻击的列表
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;     //开启碰撞检测

        this.FlyingOut = false;//飞出去
        this.FlyingBack = false;//飞回来

        this.OriginPos = this.node.position;//保存原始点
        this.OriginRotation = this.node.rotation;
    },

    //飞剑装备上之后 自动搜索屏幕内的敌人，自动攻击
    //每次攻击完飞回来，飞回来的途中发现敌人就转弯 去攻击
    update (dt) {
        //每帧检查场景中是否有敌人（可适当增加检查的间隔来减少开销）
        this.searchEnemy();

        if ( this.FlyingOut == false && this.FlyingBack == false && this.waitToAttck.length > 0) {
            this.targetEnemy = this.waitToAttck[0];
            this.FlyingOut = true;
            this.SetAttackType();
            this.node.getParent().getParent().getComponent("Player").RightArmFSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.FlySwordAttackTag);
        }
        if (this.FlyingOut == true) {
            this.flyToEnemy(dt);
            return;
        }

        if (this.FlyingBack == true) {
            this.flyBack(dt);
            return;
        }
    },


    searchEnemy(){
        let EnemyLayer = cc.find("Canvas/GameScene/EnemyScene");
        if (EnemyLayer) {
            let enemys =  ActorManager._instance.GetEnemy()//EnemyLayer.children;
            for (const key in enemys) {
                let tar = enemys[key];
                if (tar) {
                    let tar_x = tar.convertToWorldSpaceAR(cc.v2(0,0)).x;
                    if (this.waitToAttck.indexOf(tar)== -1 && tar_x > 0 && tar_x < cc.view.getVisibleSize().width) { //敌人在屏幕内
                        this.waitToAttck.push(tar);
                    }
                }
            }
        }
    },

    flyToEnemy(dt){
        let targetposInWorld = this.targetEnemy.convertToWorldSpaceAR(cc.v2(0,0)); //敌人的世界坐标
        let targetposInLocal = this.node.convertToNodeSpaceAR(targetposInWorld); //敌人在本武器layer的坐标

        /**
         * 1.朝向目标
         */
        //计算出朝向
        var dir = cc.v2(targetposInLocal.x, targetposInLocal.y ).sub(cc.v2( this.node.x, this.node.y));
    
        //根据朝向计算出夹角弧度
        let angle = dir.signAngle(cc.v2(0,1));
        //将弧度转换为欧拉角
        let degree = angle / Math.PI * 180;
        //赋值给节点
        this.node.angle = -degree;

        /**
         * 2.往目标移动
         */
         //单位化向量
         dir.normalizeSelf();
         //根据方向向量移动位置
         var moveSpeed = 950;
         this.node.x += dt * dir.x * moveSpeed;
         this.node.y += dt * dir.y * moveSpeed;
    },

    flyBack(dt){
        if (this.node.x == this.OriginPos.x && this.node.y == this.OriginPos.y) {
            this.node.angle = -this.OriginRotation;
            this.FlyingBack = false;

            this.node.getParent().getParent().getComponent("Player").RightArmFSMMgr.ForceSetFSMState(FSMUtil.FSMStateID.FlySwordNormalTag);
            this.SetAttackOver();
            return
        }

        var dir = cc.v2(this.OriginPos.x, this.OriginPos.y ).sub(cc.v2( this.node.x, this.node.y));
        dir.normalizeSelf();
        var moveSpeed = 1050;
        this.node.x += dt * dir.x * moveSpeed;
        this.node.y += dt * dir.y * moveSpeed;
    },

    //当飞剑碰到目标物
    onCollisionEnter: function (other, self) {
        if (this.waitToAttck.indexOf(other) != -1) {
            this.waitToAttck.splice(this.waitToAttck.indexOf(other),1);
        }
        if (this.targetEnemy  == other ){ //命中目标，则返回，如果是路上命中其他目标了，则继续飞向原来的目标
            this.targetEnemy = null;
            this.flyBack();
        }
    },
});
