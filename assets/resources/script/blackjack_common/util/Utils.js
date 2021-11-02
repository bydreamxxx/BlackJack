/* 工具类

Author: oucheng(ougato@gmail.com)

Copyright (c) 2017-2021

--------------------------------
-- @module Utils

*/

var Utils = {

    /* 克隆
    --------------------------------
    @function clone
    @param object [ number | object | array | string ] 所有类型
    @return 克隆后对象
    --------------------------------
    */
    clone: function (object) {
        var newObject = object;
        if (typeof (object) == "object") {
            if (object instanceof Array) {
                newObject = [];
                for (var i = 0; i < object.length; ++i) {
                    newObject.push(this.clone(object[i]));
                }
            } else {
                newObject = {};
                for (var key in object) {
                    newObject[key] = this.clone(object[key]);
                }
            }
        }
        return newObject;
    },

    /* 截断字符串
    --------------------------------
    @function splitStr
    @param str string 字符串
    @param start number 开始下标
    @param len number 长度 （中文和英文单位每个都是1）
    @return 截断字符串的数据
    --------------------------------
    */
    substr: function (str, start, len) {
        if (str == null || typeof (str) === "undefined") {
            return "";
        }
        if (!start || start < 0) {
            start = 0;
        }
        var newstr = str.substr(start, len);
        if (str.length > len) {
            newstr = newstr + "...";
        }
        return newstr;
    },

    /* 随机数
    --------------------------------
    @function random
    @param min number 最小值（必填）
    @param max number 最大值（选填 如果不填 则从0开始到min随机）
    @return number 随机数
    --------------------------------
    */
    random: function (min, max) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * (min + 1));
                break;
            case 2:
                return parseInt(Math.random() * (max - min + 1) + min);
                break;
            default:
                return 0;
                break;
        }
    },

    /* 设置string 通过node找到label组件设置字符串内容
    --------------------------------
    @function setString
    @param str string 字符串
    @param node object 带有label的节点
    @return bool 是否设置成功
    --------------------------------
    */
    setString: function (str, node) {
        if (!node) {
            return false;
        }
        var label = node.getComponent(cc.Label);
        if (!label) {
            return false;
        }

        label.string = str.toString();
        return true;
    },

    /* 获取不连续数组的长度
     --------------------------------
     @function getArrLength
     @param arr array 数组
     @return number 数组长度
     --------------------------------
     */
    getArrLength: function (arr) {
        var length = 0;
        for (var i in arr) {
            ++length;
        }
        return length;
    },

    /**
     * 判断是否为空
     * @param value
     * @returns {boolean}
     */
    isNull(value) {
        let flag = false;
        if (value === null || value === undefined) {
            flag = true
        }
        return flag;
    },

    /**
     * 判断是否类型为对象
     * @param value
     * @returns {boolean}
     */
    isObject(value) {
        let flag = false;
        if (typeof (value) === "object") {
            if (!(value instanceof Array)) {
                flag = true;
            }
        }
        return flag;
    },

    /**
     * 判断是否类型为数组
     * @param value
     * @returns {boolean}
     */
    isArray(value) {
        let flag = false;
        if (typeof (value) === "object") {
            if (value instanceof Array) {
                flag = true;
            }
        }
        return flag;
    },

    /**
     * 判断是否类型为数字
     * @param value
     * @returns {boolean}
     */
    isNumber(value) {
        let flag = false;
        if (typeof (value) === "number") {
            flag = true;
        }
        return flag;
    },

    /**
     * 判断是否类型为字符串
     * @param value
     * @returns {boolean}
     */
    isString(value) {
        let flag = false;
        if (typeof (value) === "string") {
            flag = true;
        }
        return flag;
    },

    /**
     * 判断是否类型为布尔
     * @param value
     * @returns {boolean}
     */
    isBoolean(value) {
        let flag = false;
        if (typeof (value) === "boolean") {
            flag = true;
        }
        return flag;
    },


    /**
     * 是否手机设备
     * @returns {*}
     */
    isNative() {
        return cc.sys.isNative;
    },

    /**
     * 错误提示
     * @param text
     * @param ... {string} 任意多的字符串占位符
     */
    error(text) {
        let result = Utils.isNull(text) ? "" : text;
        let argLen = arguments.length;
        if (argLen > 1) {
            for (let i = 1; i < argLen; ++i) {
                let argText = arguments[i];
                result = result.replace(new RegExp("\\{" + (i - 1) + "\\}", "g"), argText);
            }
        }
        cc.error(result);
    },

    /**
     * 获取当前游戏ID
     * @returns {number}
     */
    getCurrGameId: function () {
        var hallData = require("hall_common_data").HallCommonData;
        return hallData.getInstance().gameId;
    },

    /**
     * 获取当前游戏房间ID
     * @returns {number}
     */
    getCurrRoomId: function () {
        var Define = require("Define");
        var gameId = this.getCurrGameId();
        var jlmj_room_mgr = require("jlmj_room_mgr").RoomMgr.Instance();
        if (gameId === Define.GameType.CCMJ_GOLD) {
            var ccmj_desk_data = require('ccmj_desk_data').DeskData.Instance();
            if (!this.isNull(jlmj_room_mgr.game_info)) {
                if (!this.isNull(jlmj_room_mgr.game_info.roomId)) {
                    return jlmj_room_mgr.game_info.roomId;
                }
            }
            if (!this.isNull(ccmj_desk_data.roomNumber)) {
                return ccmj_desk_data.roomNumber;
            }
        } else if (gameId === Define.GameType.JLMJ_GOLD) {
            var jlmj_desk_data = require('jlmj_desk_data').DeskData.Instance();
            if (!this.isNull(jlmj_room_mgr.game_info)) {
                if (!this.isNull(jlmj_room_mgr.game_info.roomId)) {
                    return jlmj_room_mgr.game_info.roomId;
                }
            }
            if (!this.isNull(jlmj_desk_data.roomNumber)) {
                return jlmj_desk_data.roomNumber;
            }
        } else if (gameId === Define.GameType.NAMJ_GOLD) {
            var namj_desk_data = require('namj_desk_data').DeskData.Instance();
            if (!this.isNull(jlmj_room_mgr.game_info)) {
                if (!this.isNull(jlmj_room_mgr.game_info.roomId)) {
                    return jlmj_room_mgr.game_info.roomId;
                }
            }
            if (!this.isNull(namj_desk_data.roomNumber)) {
                return namj_desk_data.roomNumber;
            }
        }


    },

    /**
     * 获取 将数字 转换成 文字
     * @param num
     * @returns {string}
     */
    getNumToWordTransform: function (num) {
        var symbol = "";
        var word = "";
        if (!this.isNull(num)) {
            symbol = num < 0 ? "-" : "";
            num = Math.abs(Number(num));
            if (num < 10000) {
                word = num.toString();
            } else if (num >= 10000 && num < 1000000) {
                word = (Math.floor(num * 100 / 10000) / 100).toString() + "w";
            } else if (num >= 1000000 && num < 100000000) {
                word = Math.floor(num / 10000).toString() + "w";
            } else {
                word = (Math.floor(num / 1000000) / 100).toString() + "亿";
            }
        }
        return symbol + word;
    },


    /**
     * 获取微信 大小64的头像地址
     * @param url
     */
    getWX64Url: function (url) {
        var url64 = url;
        if (typeof (url) === String) {
            if (url.lastIndexOf("/") !== -1) {
                url64 = url.substring(0, url.lastIndexOf("/") + 1) + "64";
            }
        }
        return url64;
    },

    //获取当前日期 yyyymmdd
    getCurDate() {
        var str = '';
        var date = new Date();
        str += date.getFullYear();
        var month = date.getMonth() + 1;
        str += month > 9 ? month : ('0' + month);
        var day = date.getDate();
        str += day > 9 ? day : ('0' + day);
        return str;
    },

    /**
     * 保留前缀数字
     * @param value
     * @param strlen
     * @param chat
     * @returns {string}
     */
    retainPrefix(value, strlen, chat) {
        var str = value.toString();
        if (str.length < strlen) {
            let arr = new Array(strlen).join(chat) + value;
            str = arr.slice(-strlen);
        }
        return str;
    },


    /**
     * -- 按name查找布局中的结点
     * @function [parent=#uiloader] seekNodeByName
     * @param node parent 要查找布局的结点
     * @param string name 要查找的name
     * @return node#node 
     */

    seekNodeByName: function (parent, name) {
        if (this.isNull(parent))
            return;
        if (name == parent.name)
            return parent;
        var findNode;
        var children = parent.children;
        var childCount = parent.childrenCount;
        if (childCount == 0)
            return;
        for (var i = 0; i < childCount; i++) {
            if (this.isObject(children[i]))
                parent = children[i];
            if (parent && parent.name == name)
                return parent;
        }

        for (var i = 0; i < childCount; i++) {
            if (this.isObject(children[i]))
                parent = children[i];
            if (parent) {
                findNode = this.seekNodeByName(parent, name);
                if (findNode)
                    return findNode;
            }
        }
    },

    //保留x位小数，不足x位去掉末位0
    //vpos: 保留几位，如0.98  传2 ，默认2位
    getFormatNumber: function (number, vPos) {
        var str = ""
        if (vPos == 3)
            str = str + (Math.round(number * 1000) / 1000);
        else
            str = str + (Math.round(number * 100) / 100);

        //cc.log("str:",str);
        return str
    },

    /**
     * 统计客户端操作
     * @param {Number} gameType 游戏id
     * @param {Number} actionId 行为id
     */
    sendClientAction(gameType, actionId) {
        // if (!cc.dd.user.id)
        //     return;
        // var platform = require('Platform');
        // var appCfg = require('AppConfig');
        // var str = platform.clientActionUrl[appCfg.PID];
        // var url = str.format([cc.dd.user.id, gameType * 1000 + actionId]);
        // cc.log('发送客户端行为:   ' + url);
        // var xhr = new XMLHttpRequest();
        // xhr.responseType = 'arraybuffer';
        // xhr.timeout = 10000; //ms
        // xhr.ontimeout = function () {
        //     cc.log('http timeout:sendClientAction');
        // };
        // xhr.onerror = function () {
        //     cc.log('http error:sendClientAction');
        // };
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState === 4) {
        //         if (xhr.status === 200 || xhr.status === 304) {
        //             cc.log('http suc. :sendClientAction');
        //         } else {
        //             cc.log('http failed. :sendClientAction' + '  err status:' + xhr.status);
        //         }
        //     }
        // };
        // xhr.open("GET", url, true);
        // xhr.send();
    },

    /**
     * 敏感词过滤
     * @param input
     */
    filter(input) {
        // 正则表达式
        // \d 匹配数字

        let item = require('sensitive').items;

        for (var i = 0; i < item.length; i++) {

            // 创建一个正则表达式
            var r = new RegExp(item[i].words, "ig");

            input = input.replace(r, "*");
        }

        return input;
    },

    /**
     * 中文字符串长度
     * @param str
     * @returns {number}
     */
    getRealLen(str) {
        return str.replace(/[^\x00-\xff]/g, '__').length; //这个把所有双字节的都给匹配进去了
    },

    /**
     * 随机分享话语
     */
    getRandomShare() {
        let config = require('klb_share');
        let idx = this.random(1, 4);
        let item = config.getItem((_item) => {
            return _item.key == idx;
        })

        if (cc._isKuaiLeBaTianDaKeng) {
            item.title = item.title.replace(/巷乐游戏/g, "快乐吧填大坑").replace(/巷乐棋牌/g, "快乐吧填大坑");
            item.content = item.content.replace(/巷乐游戏/g, "快乐吧填大坑").replace(/巷乐棋牌/g, "快乐吧填大坑");
        }

        return item;
    },

    /**
     * 中文字符分割
     * @param str
     * @param start
     * @param len
     * @returns {*}
     */
    subChineseStr(str, start, len) {
        if (str == null || typeof (str) === "undefined") {
            return "";
        }

        if (cc.dd.Utils.getRealLen(str) <= len) {
            return str;
        }

        if (!start || start < 0) {
            start = 0;
        }
        var str_length = start;
        // var str_len = str.length;
        var str_cut = new String();

        let astralRange = /\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
        let _str = str.match(astralRange) || [];
        let str_len = _str.length;

        for (var i = start; i < str_len; i++) {
            // let a = str.charAt(i);
            let a = _str[i];
            str_length++;
            if (a.match(/[^\x00-\xff]/g)) {
                //中文字符的长度经编码之后大于4
                str_length++;
            } else {
                str_length += (a.length - 1) >= 0 ? (a.length - 1) : 0;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str_length < len) {
            return str;
        }
    },

    //检查gps是否通过
    checkGPS(msg) {
        if (cc.sys.isNative) {//网页默认可以进入
            if (!msg || !msg.rule) {
                cc.error("msg:" + msg)
                return false;
            }
            let rule = {};
            var keys = Object.keys(msg.rule);
            for (var i = 0; i < keys.length; i++) {
                if (msg.rule[keys[i]] && !cc.dd._.isUndefined(msg.rule[keys[i]].gps)) {
                    rule = msg.rule[keys[i]];
                    break;
                }
            }
            if (rule.gps == true) {
                if (!msg.latlngInfo)
                    return false;
                else if (msg.latlngInfo.latitude || msg.latlngInfo.longitude)
                    return true;
                else
                    return false;
            }
        }
        return true;
    },

    //获取gps
    getGpsFromMsg(msg) {
        if (!msg || !msg.rule) {
            cc.error("msg:" + msg)
            return false;
        }
        let rule = {};
        var keys = Object.keys(msg.rule);
        for (var i = 0; i < keys.length; i++) {
            if (msg.rule[keys[i]] && !cc.dd._.isUndefined(msg.rule[keys[i]].gps)) {
                rule = msg.rule[keys[i]];
                break;
            }
        }
        return rule.gps;
    },

    checkIsUpdateOrWrongRoom(gameid) {
        if (cc.game_pid == 10006) {
            if (gameid == cc.dd.Define.GameType.CFMJ_FRIEND || gameid == cc.dd.Define.GameType.AHMJ_FRIEND || gameid == cc.dd.Define.GameType.DDZ_XYPYC) {
                return true;
            } else {
                return false;
            }
        } else if (cc.game_pid == 10008) {
            if (gameid == cc.dd.Define.GameType.CFMJ_FRIEND || gameid == cc.dd.Define.GameType.WDMJ_FRIEND || gameid == cc.dd.Define.GameType.DDZ_XYPYC) {
                return true;
            } else {
                return false;
            }
        } else if (cc.game_pid == 10010) {
            if (gameid == cc.dd.Define.GameType.CFMJ_FRIEND || gameid == cc.dd.Define.GameType.PZMJ_FRIEND || gameid == cc.dd.Define.GameType.DDZ_XYPYC) {
                return true;
            } else {
                return false;
            }
        } else {
            return true
        }
    },

    //检查游戏规则存在
    checkRuleExist(gameid) {
        if (cc._isKuaiLeBaTianDaKeng && (gameid == 40 || gameid == 41 || gameid == 44)) {
            return true;
        }
        const games = [
            32, 33,//斗地主
            60, 61,//刨幺
            10, 13,//长春麻将
            20, 23,//吉林麻将
            59, 159,//阜新麻将
            54, 56,//农安麻将
            62, 162, 262,//松原麻将
            64, 164,//血战
            66, 166,//血流
            69, 169,//绥化
            71, 171,//锦州
            72, 172,//黑山
            73, 173,//推倒胡
            75, 175,//赤峰
            78, 178,//方正麻将
            81, 181,//白城麻将
            82, 182,//阿城麻将
            83, 183,//和龙麻将
        ];
        if (games.indexOf(gameid) == -1)
            return false;
        return true;
    },

    //获取len长度的随机字符串
    getRandomStr(len) {
        const rSTR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var ret = "";
        for (var i = 0; i < len; i++) {
            var chr = rSTR[Math.floor(Math.random() * rSTR.length)];
            ret += chr;
        }
        return ret;
    },

    translate21(card){
        if(card === 171 || card === 172){
            cc.error('21点不包含大小王');
            return null;
        }

        if(card === 0){
            return 0;
        }

        let str = card.toString();
        str = str.slice(0,str.length-1);
        let num = parseInt(str);
        if(num >= 10){
            num = 10;
        }
        if(num === 1){
            num = 11;
        }
        return num;
    }
};

Date.prototype.format = function (fmt) {
    const o = {
        "M+": this.getMonth() + 1,
        //月份
        "d+": this.getDate(),
        //日
        "h+": this.getHours() % 24 === 0 ? 24 : this.getHours() % 24,
        //小时
        "H+": this.getHours(),
        //小时
        "m+": this.getMinutes(),
        //分
        "s+": this.getSeconds(),
        //秒
        "q+": Math.floor((this.getMonth() + 3) / 3),
        //季度
        "S": this.getMilliseconds() //毫秒
    };
    const week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};



module.exports = Utils;