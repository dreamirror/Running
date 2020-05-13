//@补给窗
//@用法: 
/*
    //引入LevelSupply   
    let LevelSupply = require('LevelSupply');
    
    //弹窗调用
    LevelSupply.show.call(this);
 */
var FunctionLibrary = require("FunctionLibrary");
const ItemBase = require('ItemBase').ItemBase;

let LevelSupply = {
    _alert: null,           // prefab
    _itemList : [],         // 道具数组
    _animSpeed: 0.3,        // 弹窗动画速度

    _callback : undefined,
};

//随机道具
let rondomItem = function() {
    let SupplyItemConfig = cc.find("GameContainer").getComponent("GameManager").SupplyItemConfig;
    let ItemConfig = cc.find("GameContainer").getComponent("GameManager").ItemConfig;
    let itemlist = [];
    let weightlist = [];
    
    for(var p in SupplyItemConfig){
        itemlist.push(SupplyItemConfig[p].id);
        weightlist.push(SupplyItemConfig[p].weight);
    }
    let index1 = FunctionLibrary.RandomByWeight(weightlist);
    let index2 = FunctionLibrary.RandomByWeight(weightlist);
    let index3 = FunctionLibrary.RandomByWeight(weightlist);
    
    return [ItemConfig[itemlist[index1]],ItemConfig[itemlist[index2]],ItemConfig[itemlist[index3]]];
};

let show = function (callback) {
    cc.loader.loadRes("prefabs/LevelSupplyWin",cc.Prefab, function (error, prefab){
        if (error){
            cc.error(error);
            return;
        }
        LevelSupply._alert = cc.instantiate(prefab);
        LevelSupply._callback = callback;
        cc.director.getScene().addChild(LevelSupply._alert,3);

        let arrayItem = rondomItem();
        LevelSupply._itemList = arrayItem;

        for (let index = 0; index < 3; index++) {
            const element = arrayItem[index];
            let item = cc.find("LevelSupplyWin/ItemContent/item"+index);
            if (item && element) {
                cc.loader.loadRes(element.icon, function(err,img){
                    var mylogo  = new cc.SpriteFrame(img); 
                    item.getComponent(cc.Sprite).spriteFrame = mylogo;
                });

                item.on('click', function (event) {
                    selectItem(element);
                }, this);
            }
        }


        
        cc.find("LevelSupplyWin/close").on('click', function (event) {
            close();
        }, this);
        
        //设置parent 为当前场景的Canvas ，position跟随父节点
        LevelSupply._alert.parent = cc.find("Canvas");
        startFadeIn();
    });
};

//选择物品
let selectItem = function(parm) {
    //todo
    let item = new ItemBase();
    item.init(parm.id,parm.name,parm.icon,parm.itemType);
    let GameData = cc.find("GameContainer").getComponent("GameData");
    GameData.useItem(item);
    
    close();
};
 
// 执行弹进动画
let startFadeIn = function () {
    //动画
    LevelSupply._alert.setScale(2);
    LevelSupply._alert.opacity = 0;
    let cbFadeIn = cc.callFunc(onFadeInFinish, this);
    let actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(LevelSupply._animSpeed, 255), cc.scaleTo(LevelSupply._animSpeed, 1.0)), cbFadeIn);
    LevelSupply._alert.runAction(actionFadeIn);
};
 
 
// 弹进动画完成回调
let onFadeInFinish = function () {
};
 
// 执行弹出动画
let close = function () {
    if (!LevelSupply._alert) {
        return;
    }
    let cbFadeOut = cc.callFunc(onFadeOutFinish, this);
    let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(LevelSupply._animSpeed, 0), cc.scaleTo(LevelSupply._animSpeed, 2.0)), cbFadeOut);
    LevelSupply._alert.runAction(actionFadeOut);
};
 
// 弹出动画完成回调
let onFadeOutFinish = function () {
    onDestroy();

    if (LevelSupply._callback != undefined) {
        LevelSupply._callback.call(this);
    }
};
 
let onDestroy = function () {
    if (LevelSupply._alert != null) {
        LevelSupply._alert.removeFromParent();
        LevelSupply._alert = null;
    }
};
 
module.exports = {
  show
}