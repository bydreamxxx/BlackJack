
var dd = cc.dd;
var user = require("com_user_data");
var hallData = require('hall_common_data').HallCommonData.getInstance();

/**
 * 财富大厅管理类
 * 
 */

var FortuneHallManager = cc.Class({

    _instance: null,

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new FortuneHallManager();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {

                this._instance = null;
            }
        },

    },
    properties: {
        m_bankState: 0,
        userBankGold: 0,
        m_wxOpenId: 0,
        m_chargeFlag: 0,
        m_tHistoryRoomList: [],
        m_currentGame: 0,
        m_tUserLogData: [],
        m_tHistoryData: [],
        needShow: true,
    },
    ctor: function () {


        this.FORTUNEHALLED = new dd.EventDispatcher();
        this.FORTUNEHALLEvent = cc.Enum({
            INIT_PASSWORD_OK: "INIT_PASSWORD_OK",           // 初始密码设置成功
            BANK_MAIN_UPDATE: "BANK_MAIN_UPDATE",           // 更新银行主窗口金币
            //BANK_SEND_WINDOW:         "BANK_SEND_WINDOW",           // 打开赠送界面
            //CHANGE_PASS_WINDOW:       "CHANGE_PASS_WINDOW",        // 修改密码
            //OPERATE_RECORD_WINDOW:    "OPERATE_RECORD_WINDOW",     // 操作记录
            GET_USER_LOG_DATA: "GET_USER_LOG_DATA",          // 获得玩家投注日志
            GET_HISTORY_DATA: "GET_HISTORY_DATA",                 // 获得历史数据
            RESET_BANK_UI: "RESET_BANK_UI",              // 重置ui
            ASK_TO_PAY: "ASK_TO_PAY",               // 是否充值
            CHARGE_FLAG_CHANGE: "CHARGE_FLAG_CHANGE",        // 充值通知


            INIT_PASSWORD_OK_COIN: "INIT_PASSWORD_OK_COIN",           // 初始密码设置成功
            BANK_MAIN_UPDATE_COIN: "BANK_MAIN_UPDATE_COIN",           // 更新银行主窗口金币
        });


    },

    initData: function () {
        this.userID = user.Instance().id
        this.userName = hallData.nick;
    },

    setUserBank: function (gold, bankGold) {
        if (gold != null)
            this.userGold = gold
        if (bankGold != null)
            this.userBankGold = bankGold;
        this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.BANK_MAIN_UPDATE, null);
        //暂时写在此处
        // this.initData();
    },

    setUserBankCoin: function (gold, bankGold) {
        if (gold != null)
            this.userGold_coin = gold
        if (bankGold != null)
            this.userBankGold_coin = bankGold;
        this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.BANK_MAIN_UPDATE_COIN, null);
    },

    setHistoryRoom: function (msg) {
        this.m_tHistoryRoomList = msg;
    },

    setLastGameRoom: function (msg) {
        this.m_oLastGameInfo = msg;
    },

    updateHistoryRoom: function (msg) {
        var isFind = false;
        this.m_tHistoryRoomList.forEach(function (room, index) {
            if (room.roomId == msg.roomId) {
                isFind = true;
                this.m_tHistoryRoomList[index].roomName = msg.roomName
            }
        }.bind(this));

        if (!isFind) {
            this.m_tHistoryRoomList.push(msg)
        }
    },

    setBillList: function (msg) {
        this.m_tBillList = msg.billListList;
        var compare = function (x, y) {//比较函数
            if (x.sendTime > y.sendTime) {
                return -1;
            } else if (x.sendTime < y.sendTime) {
                return 1;
            } else {
                return 0;
            }
        }
        this.m_tBillList.sort(compare);
    },

    setBillListCoin: function (msg) {
        this.m_tBillList_coin = msg.billListList;
        var compare = function (x, y) {//比较函数
            if (x.sendTime > y.sendTime) {
                return -1;
            } else if (x.sendTime < y.sendTime) {
                return 1;
            } else {
                return 0;
            }
        }
        this.m_tBillList_coin.sort(compare);
    },

    updateBillList: function (msg) {
        this.m_tBillList[this.m_tBillList.length] = msg.bill;
        var compare = function (x, y) {//比较函数
            if (x.sendTime > y.sendTime) {
                return -1;
            } else if (x.sendTime < y.sendTime) {
                return 1;
            } else {
                return 0;
            }
        }
        this.m_tBillList.sort(compare);
    },

    updateBillListCoin: function (msg) {
        this.m_tBillList_coin[this.m_tBillList_coin.length] = msg.bill;
        var compare = function (x, y) {//比较函数
            if (x.sendTime > y.sendTime) {
                return -1;
            } else if (x.sendTime < y.sendTime) {
                return 1;
            } else {
                return 0;
            }
        }
        this.m_tBillList_coin.sort(compare);
    },

    updateBankData: function () {
        this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.BANK_MAIN_UPDATE, null);
    },

    onInitPassOk: function () {
        this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.INIT_PASSWORD_OK, null);
    },

    onInitPassOkCoin: function () {
        if(this.needShow){
            this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.INIT_PASSWORD_OK_COIN, null);
        }else{
            this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.INIT_PASSWORD_OK_COIN_BAG, null);
            this.needShow = true;
        }
    },

    resetBankUI: function () {
        this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.RESET_BANK_UI, null);
    },

    updateChargeFlag: function (flag) {
        this.m_chargeFlag = flag;
        this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.CHARGE_FLAG_CHANGE, null);
    },

    updateChargeFlagCoin: function (flag) {
        this.m_chargeFlag_coin = flag;
        this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.CHARGE_FLAG_CHANGE_COIN, null);
    },

    /**
     * 个人投注日志
     * 
     */
    setUserLogInfo: function (msg) {
        this.m_tUserLogData = [];
        for (var i = 0; i < msg.length; i++) {
            if (this.m_tUserLogData[msg[i].gameType] == null) {
                this.m_tUserLogData[msg[i].gameType] = [];
            }
            var len = this.m_tUserLogData[msg[i].gameType].length;
            this.m_tUserLogData[msg[i].gameType][len] = msg[i];
        }

        this.sortLogs();

        this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.GET_USER_LOG_DATA, null);
    },

    /**
     * 更新个人投注日志
     * 
     */
    updateUserLogInfo: function (msg) {
        if (this.m_tUserLogData[msg.gameType] == null)
            return;

        var isFind = false;
        for (var i = 0; i < this.m_tUserLogData[msg.gameType].length; i++) {
            if (this.m_tUserLogData[msg.gameType][i].expect == msg.expect) {
                this.m_tUserLogData[msg.gameType][i] = msg
                isFind = true;
                break;
            }
        }
        if (!isFind) {
            this.m_tUserLogData[msg.gameType].push(msg);
        }

    },

    sortLogs: function () {

        var compare = function (x, y) {//比较函数
            var noX = parseInt(x.lastGold);
            var noY = parseInt(y.lastGold);
            if (noX == -1) {
                return -1;
            } else if (noY == -1) {
                return 1;
            } else {
                if (x.time > y.time) {
                    return -1;
                } else if (x.time < y.time) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
        this.m_tUserLogData.forEach(function (typeLog, index) {
            typeLog.sort(compare);
        }.bind(this));
    },

    formatXianHong: function (number) {
        var str = '';
        if (number >= 10000000) {
            var yi = number / 100000000;
            var yi_2 = Math.floor(yi * 100) / 100;//保留两位小数
            return yi_2.toString() + '亿';
        }
        else {
            var wan = number / 10000;
            return wan.toString() + '万';
        }
    },

    /**
     * 历史开奖
     * 
     */
    // 若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
    // 若 a 等于 b，则返回 0。
    // 若 a 大于 b，则返回一个大于 0 的值。
    setHistoryData: function (msg) {
        this.m_tHistoryData = [];
        for (var i = 0; i < msg.length; i++) {
            if (this.m_tHistoryData[msg[i].type] == null) {
                this.m_tHistoryData[msg[i].type] = [];
            }
            var len = this.m_tHistoryData[msg[i].type].length;
            this.m_tHistoryData[msg[i].type][len] = msg[i];
        }

        var compare = function (x, y) {//比较函数
            if (x.time < y.time) {
                return -1;
            } else if (x.time > y.time) {
                return 1;
            } else {
                return 0;
            }
        }
        this.m_tHistoryData.forEach(function (typeLog, index) {
            typeLog.sort(compare);
        }.bind(this));

        this.FORTUNEHALLED.notifyEvent(this.FORTUNEHALLEvent.GET_HISTORY_DATA, null);
    },
    isVipRoom: function () {
        return this.m_nPlayType >= 100;
    },
    /**
     * 更新历史开奖
     * 
     */
    updateHistoryData: function (msg) {
        if (this.m_tHistoryData[msg.type] == null)
            return;

        var isFind = false
        for (var i = 0; i < this.m_tHistoryData[msg.type].length; i++) {
            if (this.m_tHistoryData[msg.type][i].expect == msg.expect) {
                this.m_tHistoryData[msg.type][i] = msg
                isFind = true;
                break;
            }
        }
        if (!isFind) {
            this.m_tHistoryData[msg.type].push(msg);
            var compare = function (x, y) {//比较函数
                if (x.time < y.time) {
                    return -1;
                } else if (x.time > y.time) {
                    return 1;
                } else {
                    return 0;
                }
            }
            this.m_tHistoryData[msg.type].sort(compare);
        }

    },

    /**
    * 获取机器人头像  url格式 ’xx.jpg‘
    */
    getRobotIcon: function (url, callback) {
        const REMOTE_PATH = 'http://42.193.2.94:3806/';
        if (url == null || typeof (url) == 'undefined') {
            cc.error('url is null');
            return;
        }
        if (cc.sys.isNative) {
            var dirpath = jsb.fileUtils.getWritablePath() + 'robot_head_img/';
            var filepath = dirpath + url;
            function loadEnd() {
                cc.assetManager.loadRemote(filepath, function (err, tex) {
                    if (err) {
                        cc.error(err);
                        callback(null);
                    }
                    else {
                        var spriteFrame = new cc.SpriteFrame(tex);
                        callback(spriteFrame);
                    }
                });
            }
            if (jsb.fileUtils.isFileExist(filepath)) {
                cc.log('local is find' + filepath);
                loadEnd();
                return;
            }
            var saveFile = function (data) {
                if (typeof data !== 'undefined') {
                    if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
                        jsb.fileUtils.createDirectory(dirpath);
                    }
                    if (jsb.fileUtils.writeDataToFile(new Uint8Array(data), filepath)) {
                        cc.log('Remote write file succeed.');
                        loadEnd();
                    }
                    else {
                        cc.log('Remote write file failed.');
                    }
                }
                else {
                    cc.log('Remote download file failed. data is undefined');
                }
            };

            var loadpath = REMOTE_PATH + url;
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.timeout = 10000; //毫秒单位
            xhr.ontimeout = function () {
                xhr.abort(); //重置 
                //重新请求
                xhr.open("GET", loadpath, true);
                xhr.send();
            }.bind(this);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 304) {
                        saveFile(xhr.response);
                    } else {
                        saveFile(null);
                    }
                }
            }.bind(this);
            xhr.open("GET", loadpath, true);
            xhr.send();
        }
        else {
            cc.assetManager.loadRemote(REMOTE_PATH + url, function (err, clip) {
                if (err) {
                    cc.error(err);
                    callback(null);
                }
                else {
                    var spriteFrame = new cc.SpriteFrame(clip);
                    callback(spriteFrame);
                }
            });
        }
    },

});


module.exports = FortuneHallManager;
