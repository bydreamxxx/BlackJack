var dd = cc.dd

//程序配置
dd.AppCfg = require("AppConfig");

// var IS_OPEN_SHOP = false;//是否开启商城  针对平台包
// cc._is_shop = cc.dd._.isUndefined(cc.game_pid) ? true : ((cc.game_pid > 1 && cc.game_pid < 10000) ? IS_OPEN_SHOP : true);
// if (cc._isAppstore) cc._is_shop = true;

cc.dd.log_size = null;
cc.dd.log_max_size = 20 * 1024 * 1024;

var _storagePath = null;

//写日志文件
cc.dd.getLogSize = function (info) {
    if (cc.sys.OS_ANDROID == cc.sys.os) {
        if (!_storagePath)
            _storagePath = jsb.reflection.callStaticMethod("game/SystemTool", "getInnerSDCardPath", "()Ljava/lang/String;");
        let size = jsb.fileUtils.getFileSize(_storagePath + "/xlqp_log_1.txt");
        cc.log("缓存文件大小:" + size);
    }
};

//写日志文件
cc.dd.writelog = function (info) {
    if (cc.sys.OS_ANDROID == cc.sys.os) {
        if (!_storagePath)
            _storagePath = jsb.reflection.callStaticMethod("game/SystemTool", "getInnerSDCardPath", "()Ljava/lang/String;");
        jsb.fileUtils.writeDataToFile(info, _storagePath + "/anglegame_log.txt");

        if (cc.dd.log_size == null) {
            cc.dd.log_size = jsb.fileUtils.getFileSize(_storagePath + "/anglegame_log.txt");
        }
        cc.dd.log_size += info.length;
        if (cc.dd.log_size >= cc.dd.log_max_size) {
            jsb.fileUtils.removeFile(_storagePath + "/anglegame_log.txt");
            cc.dd.log_size = 0;
            cc.log("日志文件超过上限,清空");
        }
    }
};
cc.dd.deletelog = function () {
    if (cc.sys.OS_ANDROID == cc.sys.os) {
        if (!_storagePath)
            _storagePath = jsb.reflection.callStaticMethod("game/SystemTool", "getInnerSDCardPath", "()Ljava/lang/String;");
        var filePath = _storagePath + "/anglegame_log.txt";
        if (jsb.fileUtils.isFileExist(filePath)) {
            jsb.fileUtils.removeFile(filePath);
        }
    }
};

require('jlmj_enum');
//游戏通用功能
require("com_predefine");

//大厅
//require("klb_hall_PreDefine");

//网络消息
require('net_msg_predefine')

// cc.debug.setDisplayStats(false);

// /**
//  * 微信授权中
//  * @type {boolean}
//  */
// cc.wx_authing = false;

// cc.need_login_guest = false;//游客登录
// cc.need_login_accout = true;//cc.game_pid == 10014;//cc.game_pid == 10004;//账号登录