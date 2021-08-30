/**
 * Created by yons on 2017/11/2.
 */

var AppCfg = require('AppConfig');
var AES = require('aes');
var ding_log = [];
var max_length = 50;

var ding_url = [
    "https://oapi.dingtalk.com/robot/send?access_token=eb1143cbd7ddc0b0759ce2e3f12369d5f1e1012b2848be7d5b7e17e799dbc91d",   //大厅
    "https://oapi.dingtalk.com/robot/send?access_token=fc68eb61563950e4efdf25512b3afa8df67dce482f52521474ab268ceaeddb55",   //吉林麻将
    "https://oapi.dingtalk.com/robot/send?access_token=299585aad2e61710debdd2e6739ff3c23cf05428c010bd8e21aa1373b9aea64d",   //长春麻将
    "https://oapi.dingtalk.com/robot/send?access_token=f484e82c1fc4ed504c0087a34b4326fb993ad815247853765f3ccb18b41a5b11",   //斗地主
    "https://oapi.dingtalk.com/robot/send?access_token=8e0a1e3115d79e8ad215dcb1475e6c9a361615f0a40f4caced6b018cff291dd5",   //逗三张
    "https://oapi.dingtalk.com/robot/send?access_token=62fe83a906328829475bf8ec7e08d8c55acaeafe43fea28685993f5f7c055d94",   //刨幺
    "https://oapi.dingtalk.com/robot/send?access_token=f4341aa492fe14f46dc7b8d064e1ebdf99785af4c2628f3b015707c6520b8892",   //填大坑
    "https://oapi.dingtalk.com/robot/send?access_token=18b4b4e96b9c3ed783254e67366f98c9caa5b50338f1e1b9b6e2320ab04bb951",   //亲友圈
    "https://oapi.dingtalk.com/robot/send?access_token=810909c0b53067776c9568aedee3ddccffca66ba2351b106fbb19863983973c4", //飞禽走兽
];

/**
 * 非bug的报错信息列表
 * @type {string[]}
 */
var exclude_errors = [
    'null is not a function',
    'mutating the [[Prototype]] of an object will cause your code to run very slowly; instead create the object with the correct initial [[Prototype]] value using Object.create',
];

var DingRobot = {

    ding_url: ding_url[0],

    set_ding_type: function (type) {
        this.ding_url = ding_url[type];
    },

    /**
     * 增加钉钉日志
     * @param content
     */
    push_log: function (content) {
        if (!cc.sys.isNative) {
            return;
        }
        if (ding_log.length >= max_length) {
            ding_log.shift();
        }
        ding_log.push(content);
        //if(cc.pid == 3)
            content = this.aesEncrypt(content);
        cc.dd.writelog(content);
        //cc.dd.writelog(content);
    },

    //日志加密
    aesEncrypt(str) {
        var lines = str.split('\n');
        var encode = '';
        for (var i = 0; i < lines.length; i++) {
            if (i == lines.length - 1)
                encode += AES.Encrypt(lines[i]);
            else
                encode += AES.Encrypt(lines[i]) + '\n';
        }
        return encode;
    },

    aesDecrypt(code) {
        var lines = code.split('\n');
        var decode = '';
        for (var i = 0; i < lines.length; i++) {
            if (i == lines.length - 1)
                decode += AES.Decrypt(lines[i]);
            else
                decode += AES.Decrypt(lines[i]) + '\n';
        }
        return decode;
    },

    /**
     * 获取钉钉日志
     * @returns {string}
     */
    get_log: function () {
        var log = '钉钉日志:\n';
        ding_log.forEach(function (content) {
            log += content;
            log += '\n';
        });
        return log;
    },

    /**
     * 上报
     */
    report: function (content) {
        if (!cc.sys.isNative) {
            return;
        }
        var xhr = XMLHttpRequest();
        xhr.open("POST", this.ding_url);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        var platform_str = ["", "内网测试服", "外网测试服", "正式服", "正式服"];
        var os_str = '';
        if (cc.sys.os == cc.sys.OS_IOS) {
            os_str = 'ios';
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            os_str = 'android';
        }
        var header = platform_str[AppCfg.PID] + ' 版本:' + AppCfg.VERSION + ' 用户id:' + cc.dd.user.id + ' 系统平台:' + os_str + '\n';
        header += cc.dd.native_systool.getDeviceInfo() + '\n';
        content = header + content + '\n' + this.get_log();
        var msg = {};
        msg.msgtype = "text";
        msg.text = {};
        msg.text.content = content;
        // var msg = "{ \"msgtype\": \"text\", \"text\": {\"content\": \"" + content + "\"}}";
        xhr.send(JSON.stringify(msg));
    },

    /**
     * 上报日志
     */
    reportDebugInfo: function () {
        var log = '【玩家反馈】';
        this.report(log);
    },
};

window.__errorHandler = function (filename, lineno, message) {
    var isExclude = false;
    exclude_errors.forEach(function (item) {
        if (message == item) {
            isExclude = true;
        }
    });
    if (isExclude) {
        return;
    }
    if (lineno == 0) {
        return;
    }
    var str = 'line:' + lineno + '  msg' + message;
    cc.error('错误', str);
    DingRobot.report(str);
};

cc.log = function () {
    var len = arguments.length;
    var str = '';
    for (var i = 0; i < len; i++) {
        var tmp = arguments[i];
        if (typeof tmp == 'object') {
            tmp = cc.dd.obj2string(tmp);
        }
        str += tmp;
    }
    var time = '[' + new Date().toLocaleString() + ']';
    str = '【LOG】' + time + ' ' + str;
    console.log(str);
    DingRobot.push_log(str);
};

cc.warn = function () {
    var len = arguments.length;
    var str = '';
    for (var i = 0; i < len; i++) {
        var tmp = arguments[i];
        if (typeof tmp == 'object') {
            tmp = cc.dd.obj2string(tmp);
        }
        str += tmp;
    }
    var time = '[' + new Date().toLocaleString() + ']';
    str = '【WARN】' + time + ' ' + str;
    console.warn(str);
    DingRobot.push_log(str);
};

cc.error = function () {
    var len = arguments.length;
    var str = '';
    for (var i = 0; i < len; i++) {
        var tmp = arguments[i];
        if (typeof tmp == 'object') {
            tmp = cc.dd.obj2string(tmp);
        }
        str += tmp;
    }
    var time = '[' + new Date().toLocaleString() + ']';
    str = '【ERROR】:' + time + ' ' + str;
    console.error(str);
    DingRobot.push_log(str);
};

cc.info = function () {
    var len = arguments.length;
    var str = '';
    for (var i = 0; i < len; i++) {
        var tmp = arguments[i];
        if (typeof tmp == 'object') {
            tmp = cc.dd.obj2string(tmp);
        }
        str += tmp;
    }
    var time = '[' + new Date().toLocaleString() + ']';
    str = '【INFO】:' + time + ' ' + str;
    console.info(str);
    DingRobot.push_log(str);
};

module.exports = DingRobot;
