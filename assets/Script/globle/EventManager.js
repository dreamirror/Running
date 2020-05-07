//自定义的全局事件广播
/*

//注册事件
EventCenter.on(EventName,this.TestCallBack,this);
TestCallBack: function(data){
        cc.log("data : "data.data);
    },

//一定要记得移除事件
EventCenter.off(EventName,this.TestCallBack,this);

//派发事件,第二个参数可以是需要传递的数据
EventCenter.emit(EventName);
EventCenter.emit(EventName，{“data”:"data"});

*/

const EventName = require("GlobalEventName");

window.EventCenter = {

    _events: {},

    //监听
    //@parm : 事件名，回调函数，函数调用者， 事件执行顺序（同一个事件名中的函数之间的先后关系）
    on : function(eventname,callback,target,order){
        if(this._events[eventname] == undefined)
        {
            this._events[eventname] = new Array(5); //预设5个占位
        }
        if (order) {
            this._events[eventname].splice(order,0,{
                callback: callback,
                target: target,
            });
        } else {
            this._events[eventname].push({
                callback: callback,
                target: target,
            });
        }
    },

    //移除监听
    off : function(eventname,callback,target){
        var handlers = this._events[eventname];
        for (var index = handlers.length - 1; index >= 0; index--) {
            var handler = handlers[index];
            if(target == handler.target && callback.toString() == handler.callback.toString())
            {
                this._events[eventname].splice(index, 1);
            };
        }
    },

    //清空所以监听和事件
    clear : function(eventname) {
        if(this._events[eventname] != undefined)
        {
            var handlers = this._events[eventname];
            for (var index = 0; index < handlers.length; index++) {
                handlers[index] = null;
            }
        }
    },

    //重置所有event的监听，事件保留
    reset : function() {
        for (const key in this._events) {
            if (this._events.hasOwnProperty(key)) {
                delete this._events[key]; 
            }
        }
    },
    
    //广播
    emit : function(eventname,data){
        if(this._events[eventname] != undefined)
        {
            var handlers = this._events[eventname];
            for (var index = 0; index < handlers.length; index++) {
                var handler = handlers[index];
                if (handler != undefined) {
                    handler.callback.call(handler.target,data);
                }
            }
        }
    },
}