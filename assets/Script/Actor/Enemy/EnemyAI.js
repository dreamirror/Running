/**
 * zh 5.7 敌人AI,创建一个敌人时会自动在其身上绑定一份
 */
var CommonUtil = require("CommonUtil");

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

    /**
     * 基本AI相关，根据自身的攻击类型以及玩家位置玩家操作等，为当前行为作出一个运算。
     */
    RunBaseAI : function() {
        //获取一下Player
        if(this.TargetPlayer == null || this.TargetPlayer == undefined){
            var player = cc.find("Player");
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

        //var PlayerPos = this.TargetPlayer.node.getPosition();
        var PlayerPos = this.TargetPlayer.node.convertToWorldSpaceAR(cc.v2(0, 0));
        //var EnemyPos = this.EnemyNode.getPosition();
        var EnemyPos = this.TargetPlayer.node.convertToWorldSpaceAR(cc.v2(0, 0));
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
});
