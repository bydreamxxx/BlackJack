/**
 *耗时检测工具
 *@class TimeTake
 */
var TimeTakeItem = cc.Class({
    ctor: function (...params) {
        this.tagname = params[0];
    },

    setStartTime: function (time) {
        this.startTime = time;
    },

    setEndTime: function (time) {
        this.endTime = time;
    },

    getTimeTake: function () {
        return this.endTime - this.startTime;
    }
});

var TimeTake = {

    items: [],   //耗时集

    /**
     * 耗时检测开始
     * @method start
     * @param {String} tag
     */
    start: function(tag){
        var item = this.getItem(tag);
        item.setStartTime(new Date().getTime());
    },

    /**
     * 耗时检测结束
     * @method end
     * @param {String} tag
     */
    end: function(tag){
        var item = this.getItem(tag);
        item.setEndTime(new Date().getTime());
        cc.log(tag+" 耗时"+item.getTimeTake()/1000.0+"秒");
    },

    getItem: function (tag) {
        var result = null;
        this.items.forEach(function (item) {
            if (item.tagname == tag) {
                result = item;
            }
        });
        if(result == null){
            result = this.addItem(tag);
        }
        return result;
    },

    addItem: function (tag) {
        var lenth = this.items.push(new TimeTakeItem(tag));
        return this.items[lenth-1];
    },
};

module.exports = TimeTake;