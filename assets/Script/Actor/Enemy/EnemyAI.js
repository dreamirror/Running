/**
 * zh 5.7 敌人AI,创建一个敌人时会自动在其身上绑定一份
 */
var CommonUtil = require("CommonUtil");

var BossAttPos = {
    ClossAtt : 0,
    DisAtt   : 1,
};

var EnemyAI = cc.Class({

    ctor: function ( ) {
    },

    properties: {
        EnemyNode   : null,
        EnemyJS     : null,
    },

    Init(InEnemyNode , InEnemyJS){
        this.EnemyNode = InEnemyNode;
        this.EnemyJS = InEnemyJS;
    },

    InitBossAI : function( InBossConfig , InEnemyNode , InEnemyJS) {
        this.BossConfig = InBossConfig;
        this.EnemyNode = InEnemyNode;
        this.EnemyJS = InEnemyJS;

        //近距离攻击了的次数
        this.ClossAttCount = 0;
        //远距离攻击了的次数
        this.DisAttCount = 0;
        //初始近距离攻击占比
        this.ClossAttWeight = 40;
        this.ClossAttWeightAdd = 10;
        this.DisAttCount = 30;
        this.DisAttWeightAdd = 10;
        
        //当前BOSS是在近距离还是在远距离,一开始是在远距离
        this.BossAttType = BossAttPos.ClossAtt;
        
        //每一个行动的CD时长,单位是秒
        this.ActionInterval   =   5;
        //当前的行动CD时间
        this.CurCDTime        =   0;
    },

    /**
     * 基本AI相关，根据自身的攻击类型以及玩家位置玩家操作等，为当前行为作出一个运算。
     */
    RunBaseAI : function() {
        //获取一下Player
        if(this.TargetPlayer == null || this.TargetPlayer == undefined){
            var player = cc.find("Canvas/GameScene/PlayerScene/Player");
            if (player != null && player != undefined){
                this.TargetPlayer = player.getComponent("Player");
            }

            if(this.TargetPlayer == null || this.TargetPlayer == undefined){
                cc.log("Player is null!!");
                return;
            }
        }
        if(this.GameManager == null || this.GameManager == undefined ){
            var GameContainer = cc.find("GameContainer");
            if(GameContainer){
                this.GameManager = GameContainer.getComponent("GameManager");
            }
            if(this.GameManager == null || this.GameManager == undefined){
                cc.log("GameManager is null!!");
                return;
            }
        }

        var PlayerPos = this.TargetPlayer.node.convertToWorldSpaceAR(cc.v2(0, 0));
        var EnemyPos = this.EnemyNode.convertToWorldSpaceAR(cc.v2(-30, 0));
        var distance = EnemyPos.sub(PlayerPos).mag();

        //判断自身类型，如果是近战，则判断玩家是否在攻击距离内
        if (this.EnemyJS.EnemyAttackType == CommonUtil.EnemyAttackType.CloseAttack)
        {
            if (this.GameManager.EnemyConfigData.AttackDistance.CloseAttack >= distance )
            {
                return CommonUtil.EnemyRunAIResult.CloseAttack;
            }

        }
        //如果是扔飞镖
        else if(this.EnemyJS.EnemyAttackType == CommonUtil.EnemyAttackType.DartAttack)
        {
            if (this.GameManager.EnemyConfigData.AttackDistance.DartAttack >= distance )
            {
                return CommonUtil.EnemyRunAIResult.DistanceAttack;
            }
        }

        return CommonUtil.EnemyRunAIResult.Idle;
    },

    //Boss相关的AI
    /** 
     * Boss的每一个行动后，都会有一段CD时间，时间过了之后，才会进行下一次行动
     * 如果BOSS在玩家面前，则Random ： 是进行攻击行动，还是退后行动，比重由配置来把握，一般来说，退后的比重比较小，但会随着近距离攻击次数增加而大幅增加
     * 如果BOSS在远距离攻击，则与近距离相反
    */
    RunBossAI : function (dt){
        //如果距离上一个动作完成的CD时间还没有到，继续倒计时
        if(this.CurCDTime > 0){
            this.CurCDTime -= dt;
            return;
        }

        //先计算随机数
        var RandomMin = Math.random()*100;
        var RandomMax = Math.random()*(100 + 0);
        var RandomResult = Math.round(Math.random()*100);

        this.CurCDTime = 1000000;

        //如果当前是在远程攻击
        if( this.BossAttType == BossAttPos.ClossAtt ){
            //当前进行攻击的区间值
            var AttValAround = this.DisAttCount + (this.DisAttCount * this.DisAttWeightAdd);
            //如果随机值落在这个区间，则进行远距离攻击
            if (RandomResult <= AttValAround){
                return CommonUtil.DistanceAttack;
            }
            else{   //否则BOSS进行向近距离的移动
                return CommonUtil.MoveToClose;
            }
        }
        //如果当前是在近程攻击
        else{
            //当前进行攻击的区间值
            var AttValAround = this.ClossAttWeight + (this.ClossAttCount * this.ClossAttWeightAdd);
            //如果随机值落在这个区间，则进行近距离攻击
            if (RandomResult <= AttValAround){
                return CommonUtil.CloseAttack;
            }
            else{   //否则BOSS进行向远距离的移动
                return CommonUtil.MoveToDistance;
            }   
        }

    },
    /**
     * 当一个BossAI返回结果执行完之后，再调用该函数,重置CD时间
     */
    BossAIRunOver : function() {
        this.CurCDTime = this.ActionInterval;
    },

});
