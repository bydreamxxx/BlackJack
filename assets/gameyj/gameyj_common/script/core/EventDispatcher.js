var EventDispatcher = cc.Class({

    observer_list:null,

    ctor:function(){
        this.observer_list = [];
    },

    //添加观察者
    addObserver:function(target){
        this.observer_list.forEach(function(item,index){
            if(item === target){
                return true;
            }
        });

        if( target ) {
            this.observer_list.push(target);
        } else {
            cc.error("ERR: invalid addObserver target:%s", target);
        }
    },

    //移除观察者
    removeObserver:function(target){
        var self = this;
        this.observer_list.forEach(function(item,index){
            if(item === target){
                self.observer_list.splice(index,1);
            }
        })
    },

    //移除所有观察者
    removeAllObserver:function(){
       this.observer_list = [];
    },

    //发送事件
    notifyEvent:function(event,data){
        this.observer_list.forEach(function(item){
            item.onEventMessage(event,data);
        });
    }
});

module.exports = EventDispatcher;
