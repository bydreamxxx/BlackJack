var ED = require("EventDispatcher");

/**
 * 事件管理
 */
var ChatEd = new ED;

/**
 * 事件类型
 */
var ChatEvent = cc.Enum({
    CHAT:                                       'jlmj_chat',                                    //聊天
    MAGIC_PROP:                                 'jlmj_magic_prop',                              //魔法道具
});

var ChatData = cc.Class({

    statics: {

        s_chat_data: null,

        Instance: function () {
            if(!this.s_chat_data){
                this.s_chat_data = new ChatData();
            }
            return this.s_chat_data;
        },

        Destroy: function () {
            if(this.s_chat_data){
                this.s_chat_data = null;
            }
        },

    },

});

module.exports = {
    ChatEd:ChatEd,
    ChatEvent:ChatEvent,
    ChatData:ChatData,
};