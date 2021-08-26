var ED = require("EventDispatcher");

/**
 * 事件管理
 */
var SysED = new ED;

/**
 * 事件类型
 */
var SysEvent = cc.Enum({
    PAUSE:                               'com_sys_pause',                              //系统暂停
    RESUME:                              'com_sys_resume',                             //系统恢复
    KEYBACK:                             'com_sys_keyback',                            //系统物理返回键
});

var SysData = cc.Class({

    s_sys_data: null,

    statics: {

        Instance: function () {
            if(!this.s_sys_data){
                this.s_sys_data = new SysData();
            }
            return this.s_sys_data;
        },

        Destroy: function () {
            if(this.s_sys_data){
                this.s_sys_data = null;
            }
        },

    },

});

module.exports = {
    SysED:SysED,
    SysEvent:SysEvent,
    SysData:SysData,
};