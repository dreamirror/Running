//@通用弹窗，配合预定的预制资源
//@用法: 
/*
    //引入PopupWin   
    let PopupWin = require('PopupWin');
    
    //弹窗调用
    PopupWin.show.call(this,{data});
 */

let PopupWin = {
    _alert: null,           //prefab
    _animSpeed: 0.3,        //弹窗动画速度
};
 
/**
 * 传入一个对象参数
 * data = {
 *  titleStr
 *  tipStr
 *  leftStr
 *  rightStr
 *  leftCallback
 *  rightCallback
 * }
 */

let show = function (data) {
    if (!data) {
        return;
    }
    cc.loader.loadRes("prefabs/PopWin",cc.Prefab, function (error, prefab){
        if (error){
            cc.error(error);
            return;
        }
        PopupWin._alert = cc.instantiate(prefab);
        cc.find(cc.Canvas).addChild(PopupWin._alert,3);
        cc.find("PopWin/title").getComponent(cc.Label).string = data.titleStr ? data.titleStr : "标题为空";
        cc.find("PopWin/tips").getComponent(cc.Label).string = data.tipStr ? data.tipStr : "提示内容为空";
        cc.find("PopWin/leftbtn/btnstr").getComponent(cc.Label).string = data.leftStr ? data.leftStr : "OK";
        cc.find("PopWin/rightbtn/btnstr").getComponent(cc.Label).string = data.rightStr ? data.rightStr : "NO";
        
        cc.find("PopWin/leftbtn").on('click', function (event) {
            dismiss();
            if(data.leftCallback){
                data.leftCallback();
            }
        }, this);
        

    
        cc.find("PopWin/rightbtn").on('click', function (event) {
            dismiss();
            if(data.rightCallback){
                data.rightCallback();
            }
        }, this);
    
        //设置parent 为当前场景的Canvas ，position跟随父节点
        PopupWin._alert.parent = cc.find("Canvas");
        startFadeIn();
    });
};
 
// 执行弹进动画
let startFadeIn = function () {
    //动画
    PopupWin._alert.setScale(2);
    PopupWin._alert.opacity = 0;
    let cbFadeIn = cc.callFunc(onFadeInFinish, this);
    let actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(PopupWin._animSpeed, 255), cc.scaleTo(PopupWin._animSpeed, 1.0)), cbFadeIn);
    PopupWin._alert.runAction(actionFadeIn);
};
 
 
// 弹进动画完成回调
let onFadeInFinish = function () {
};
 
// 执行弹出动画
let dismiss = function () {
    if (!PopupWin._alert) {
        return;
    }
    let cbFadeOut = cc.callFunc(onFadeOutFinish, this);
    let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(PopupWin._animSpeed, 0), cc.scaleTo(PopupWin._animSpeed, 2.0)), cbFadeOut);
    PopupWin._alert.runAction(actionFadeOut);
};
 
// 弹出动画完成回调
let onFadeOutFinish = function () {
    onDestroy();
};
 
let onDestroy = function () {
    if (PopupWin._alert != null) {
        PopupWin._alert.removeFromParent();
        PopupWin._alert = null;
    }
};
 
module.exports = {
  show
}