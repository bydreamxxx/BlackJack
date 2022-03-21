let com_dialog_box = require('com_dialog_box');
let Platform = require('Platform');
var AppCfg = require('AppConfig');

cc.Class({
    extends: com_dialog_box,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onClickFix(){
        cc.dd.native_systool.OpenUrl(Platform.GetAppUrl(AppCfg.GAME_PID,AppCfg.PID));
    },

    close(){
        // cc.dd.DialogBoxUtil.setDialogType(0);
        this._super();
    }
});
