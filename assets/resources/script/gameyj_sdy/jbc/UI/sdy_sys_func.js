var audio = require('sdy_audio');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
    },

    onDestroy: function () {
    },

    onSetting: function(event,custom) {
        audio.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_sdy/jbc/prefab/sdy_right_pop_menu');
    },

    onSettingFriend: function(event,custom) {
        audio.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_sdy/pyc/prefab/sdy_right_pop_menu_friend');
    },

    onClickChat: function () {
        audio.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_sdy/jbc/prefab/sdy_chat');
    },
});

