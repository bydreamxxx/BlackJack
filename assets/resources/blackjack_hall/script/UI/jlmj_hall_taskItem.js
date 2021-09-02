var item_cfg = require('item');

cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        count: cc.Label,
        iconAtlas: cc.SpriteAtlas,
    },

    // use this for initialization
    onLoad: function () {

    },

    setData: function (item_id, item_count) {
         var item = item_cfg.getItem(function (item) {
             return item_id == item.key;
         });
        if(item == null){
            cc.error(cc.js.formatStr('道具未配置,道具id=%d',item_id));
            return;
        }
        var spriteFrame = this.iconAtlas.getSpriteFrame(item.key);
        this.icon.spriteFrame = spriteFrame;
        this.icon.node.width = spriteFrame.getRect().width;
        this.icon.node.height = spriteFrame.getRect().height;
        if(item.key == 1004 || item.key == 1006)
            this.count.string = (item_count / 100) + '元' + item.memo;
        else
            this.count.string = item_count + item.memo;
    },
    
    setIcon: function (icon) {
        this.icon.spriteFrame = icon;
        this.icon.node.width = icon.getRect().width;
        this.icon.node.height = icon.getRect().height;
    },

    setCount: function (count) {
        this.count.string = count;
    },
});
