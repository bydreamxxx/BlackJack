/**
 * 监听前后台切换,网络中断事件,修复加载远程图片黑块的bug
 */

var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        // 取消监听
        // SysED.addObserver(this);
    },

    onDestroy: function () {
        // SysED.removeObserver(this);
    },

    fix_load_remote_img: function () {
        var sprite = this.node.getComponent(cc.Sprite);
        if(!sprite){
            return;
        }
        if(!sprite.spriteFrame || !sprite.spriteFrame._texture){
            return;
        }
        if(!sprite.spriteFrame._texture.url || sprite.spriteFrame._texture.url == ""){
            return;
        }
        cc.dd.SysTools.loadWxheadH5(sprite,sprite.spriteFrame._texture.url);
    },

    onEventMessage: function (event,data) {
        switch (event){
            case SysEvent.RESUME:
                this.fix_load_remote_img();
                break;
            default:
                break;
        }
    },

});
