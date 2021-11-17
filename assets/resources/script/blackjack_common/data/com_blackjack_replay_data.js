var AppCfg = require('AppConfig');
var Platform = require('Platform');
var Define = require('Define');

var REPLAY_ED = new cc.dd.EventDispatcher();
var REPLAY_EVENT = cc.Enum({
    ON_GET_DATA: 'ON_GET_DATA',     //获取数据成功
});

const com_blackjack_replay = cc.Class({

    statics: {
        Instance() {
            if (!this._ist) {
                this._ist = new com_blackjack_replay();
            }
            return this._ist;
        },
        Destroy() {
            if (this._ist) {
                this.clear();
                this._ist = null;
            }
        },
    },
    ctor() {
        this.msg_list = [];
        this.gameType = -1;
        this.recordId = '';
    },
    clear() {
        this.msg_list = [];
    },

    /**
     * 请求http回放服务器
     * @param {Number} gameType 游戏id
     * @param {String} recordId 回放id
     * @param {Number} roundId  第几局
     */
    getRecordHttpReq(gameType, recordId, roundId) {
        cc.dd.NetWaitUtil.show('请求数据中...');
        var callback = this.onGetDataSuccess.bind(this);
        var host = Platform.RecordUrl[AppCfg.PID];
        gameType = parseInt((recordId + '').substring(9, 11));
        roundId = roundId || 1;
        this.curRound = roundId;
        var round = roundId > 99 ? roundId.toString() : (roundId > 9 ? '0' + roundId.toString() : '00' + roundId.toString());
        var url = host + '?game_type=' + gameType + '&record_id=' + recordId + round;
        cc.log('获取回放数据  ' + url);
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.timeout = 10000; //ms
        xhr.ontimeout = function () {
            cc.log('http timeout:getRecordHttpReq');
            cc.dd.NetWaitUtil.close();
            callback(null);
        }.bind(this);
        xhr.onerror = function () {
            cc.log('http error:getRecordHttpReq');
            cc.dd.NetWaitUtil.close();
            callback(null);
        }.bind(this);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                cc.dd.NetWaitUtil.close();
                if (xhr.status === 200 || xhr.status === 304) {
                    callback(xhr.response, gameType, recordId);
                }
                else if (xhr.status == 204) {
                    cc.dd.DialogBoxUtil.show(0, '回放数据已过期。');
                }
                else {
                    cc.error('获取回放game:' + gameType + ',record:' + recordId + '  数据失败.');
                    cc.error('err status:' + xhr.status);
                    callback(null);
                }
            }
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.send();
    },

    /**
     * http获取数据回调
     * @param {ArrayBuffer} data
     * @param {Number} gameType
     * @param {Number} recordId
     */
    onGetDataSuccess: function (data, gameType, recordId) {
        var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
        if (!UpdateMgr.isGameInstalled(gameType)) {
            if (cc.dd.Utils.checkIsUpdateOrWrongRoom(gameType)) {
                let game_list = require("klb_gameList");
                let game_cfg = game_list.getItem(function (cfg) {
                    return cfg.gameid == gameType;
                });
                cc.dd.DialogBoxUtil.show(0, "请先在大厅安装游戏:" + game_cfg.name, '确定', null, function () {
                    cc.dd.SceneManager.replaceScene("kuaileba_hall");
                });
            } else {
                cc.dd.DialogBoxUtil.show(0, "房间号错误", '确定', null, function () {
                    cc.dd.SceneManager.replaceScene("kuaileba_hall");
                });
            }

        } else {
            if (this.decodeRecordData(data)) {
                this.gameType = gameType;
                this.recordId = recordId;

                REPLAY_ED.notifyEvent(REPLAY_EVENT.ON_GET_DATA, null);
            }
        }
    },

    /**
     * 解码 保存到msg_list
     * @param {ArrayBuffer} arrayBuffer
     * @returns {Boolean}
     */
    decodeRecordData(arrayBuffer) {
        if (!arrayBuffer || !arrayBuffer.byteLength) {
            cc.dd.PromptBoxUtil.show('获取回放数据失败');
            this.clear();
            return false;
        }

        var bytes = new Uint8Array(arrayBuffer);
        var msgList = [];
        var index = 0;
        while (index < bytes.length) {
            var length = (bytes[index++] << 8) + bytes[index++];
            var msgId = (bytes[index++] << 8) + bytes[index++];
            var body = new Uint8Array(arrayBuffer, index, length - 2);
            var obj = cc.gateNet.Instance().convertDataToObj(msgId, body);
            var msg = {
                id: msgId,
                content: obj,
            }
            msgList.push(msg);
            index += length - 2;
        }
        this.msg_list = msgList;
        if (msgList.length) {
            // cc.log('回放数据');
            // cc.log(msgList);
            return true;
        }
        return false;
    },

    /**
     * 换局
     * @param {Number} roundId
     */
    changeRound(roundId) {
        if (this.gameType != -1 && this.recordId != '') {
            this.getRecordHttpReq(this.gameType, this.recordId, roundId);
        }
    },

    getMsgList() {
        return this.msg_list;
    },
});
module.exports = {
    REPLAY_DATA: com_blackjack_replay,
    REPLAY_ED: REPLAY_ED,
    REPLAY_EVENT: REPLAY_EVENT,
};