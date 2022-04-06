var AppCfg = require('AppConfig');
var Platform = require('Platform');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var Define = require('Define');
var hall_prefab = require('hall_prefab_cfg');
let prefab_config = require('klb_friend_group_prefab_cfg');


const mapGameReplayScene = {
    // [33]: 'ddz_replay',
    // [34]: 'xyddz_replay',
    // [Define.GameType.JLMJ_FRIEND]: 'jlmj_replay_game',
    // [Define.GameType.CCMJ_FRIEND]: 'ccmj_replay_game',
    // [Define.GameType.NAMJ_FRIEND]: 'namj_replay_game',
    // [35]: 'dsz_game_replay',
    // [Define.GameType.FXMJ_FRIEND]: 'fxmj_replay_game',
    // [50]: 'nn_replay',
    // [40]: 'tdk_replay',
    // [44]: 'tdk_replay',
    // [60]: 'py_game_replay',
    // [Define.GameType.SYMJ_FRIEND]: 'symj_replay_game',
    // [Define.GameType.SYMJ_FRIEND_2]: 'symj_replay_game',
    // [Define.GameType.XZMJ_FRIEND]: 'scmj_replay_game',
    // [Define.GameType.XLMJ_FRIEND]: 'scmj_replay_game',
    // [63]: 'suoha_replay',
    // [43]: 'hbsl_replay',
    // [Define.GameType.SHMJ_FRIEND]: 'shmj_replay_game',
    // [Define.GameType.JZMJ_FRIEND]: 'jzmj_replay_game',
    // [Define.GameType.HSMJ_FRIEND]: 'hsmj_replay_game',
    // [36]: 'new_dsz_replay_scene',
    // [Define.GameType.TDHMJ_FRIEND]: 'tdhmj_replay_game',
    // [Define.GameType.CFMJ_FRIEND]: 'cfmj_replay_game',
    // [Define.GameType.AHMJ_FRIEND]: 'ahmj_replay_game',
    // [Define.GameType.FZMJ_FRIEND]: 'fzmj_replay_game',
    // [Define.GameType.WDMJ_FRIEND]: 'wdmj_replay_game',
    // [Define.GameType.PZMJ_FRIEND]: 'pzmj_replay_game',
    // [Define.GameType.BCMJ_FRIEND]: 'bcmj_replay_game',
    // [Define.GameType.ACMJ_FRIEND]: 'acmj_replay_game',
    // [Define.GameType.HLMJ_FRIEND]: 'hlmj_replay_game',
    // [29]: 'pdk_replay',
    [Define.GameType.RUMMY]: 'rummy',
    [Define.GameType.BLACKJACK_GOLD]: 'blackjack',
    [Define.GameType.BLACKJACK_FRIEND]: 'blackjack',
}

var REPLAY_ED = new cc.dd.EventDispatcher();
var REPLAY_EVENT = cc.Enum({
    ON_GET_DATA: 'ON_GET_DATA',     //获取数据成功
});

const com_replay = cc.Class({

    statics: {
        Instance() {
            if (!this._ist) {
                this._ist = new com_replay();
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
                cc.dd.DialogBoxUtil.show(0, "请先在大厅安装游戏:" + game_cfg.name, 'text33', null, function () {
                    cc.dd.SceneManager.replaceScene("kuaileba_hall");
                });
            } else {
                cc.dd.DialogBoxUtil.show(0, "text37", 'text33', null, function () {
                    cc.dd.SceneManager.replaceScene("kuaileba_hall");
                });
            }

        } else {
            if (this.decodeRecordData(data)) {
                this.gameType = gameType;
                this.recordId = recordId;
                if (cc.director.getScene().name != mapGameReplayScene[gameType]) {
                    // if (gameType == cc.dd.Define.GameType.JLMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjJilinRule: msg.deskinfo.createcfg });
                    // }
                    // if (gameType == cc.dd.Define.GameType.CCMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjChangchunRule: msg.deskinfo.createcfg });
                    // }
                    // if (gameType == cc.dd.Define.GameType.NAMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjNonganRule: msg.deskinfo.createcfg });
                    // }
                    //
                    // if (gameType == 35) {
                    //     var id = this.msg_list[0].id;
                    //     var msg = this.msg_list[0].content;
                    //     RoomMgr.Instance().setGameCommonInfo(msg.deskInfo.gameType, msg.deskInfo.password, msg.deskInfo.ownerId, null, null);
                    //     RoomMgr.Instance().setGameRuleByType({ rule: msg.deskInfo.deskRule });
                    //     RoomMgr.Instance().setPlayerMgr();
                    // }
                    //
                    // if (gameType == cc.dd.Define.GameType.FXMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjFuxinRule: msg.deskinfo.createcfg });
                    // }
                    //
                    // if (gameType == Define.GameType.TDK_FRIEND ||
                    //     gameType == Define.GameType.TDK_FRIEND_LIU) {
                    //     var id = this.msg_list[0].id;
                    //     var msg = this.msg_list[0].content;
                    //     RoomMgr.Instance().setGameCommonInfo(msg.deskInfo.gameType, msg.deskInfo.password, msg.deskInfo.ownerId);
                    //     RoomMgr.Instance().setReplayGameNetHandler(msg.deskInfo.gameType);
                    //     RoomMgr.Instance().setGameRuleByType({ rule: msg.deskInfo.deskRule });
                    //     RoomMgr.Instance().setPlayerMgr();
                    //     cc.gateNet.Instance().excuteReplayMsg(id, msg);
                    // }
                    //
                    // if (gameType == Define.GameType.PAOYAO_FRIEND) {
                    //     var id = this.msg_list[0].id;
                    //     var msg = this.msg_list[0].content;
                    //     RoomMgr.Instance().setGameCommonInfo(msg.deskInfo.gameType, msg.deskInfo.password, msg.deskInfo.ownerId);
                    //     RoomMgr.Instance().setReplayGameNetHandler(msg.deskInfo.gameType);
                    //     RoomMgr.Instance().setGameRuleByType({ rule: msg.deskInfo.deskRule });
                    //     RoomMgr.Instance().setPlayerMgr();
                    //     cc.gateNet.Instance().excuteReplayMsg(id, msg);
                    // }
                    //
                    // if (gameType == cc.dd.Define.GameType.SYMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjSongyuanRule: msg.deskinfo.createcfg });
                    // }
                    //
                    // if (gameType == cc.dd.Define.GameType.XZMJ_FRIEND || gameType == cc.dd.Define.GameType.XLMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjXuezhanRule: msg.deskinfo.createcfg });
                    // }
                    //
                    // if (gameType == cc.dd.Define.GameType.SHMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjSuihuaRule: msg.deskinfo.createcfg });
                    // }
                    //
                    // if (gameType == cc.dd.Define.GameType.JZMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjJinzhouRuleNew: msg.deskinfo.createcfg });
                    // }
                    //
                    // if (gameType == cc.dd.Define.GameType.HSMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjHeishanRule: msg.deskinfo.createcfg });
                    // }
                    //
                    // if (gameType == Define.GameType.HBSL_JBL) {
                    //     var id = this.msg_list[0].id;
                    //     var msg = this.msg_list[0].content;
                    //     RoomMgr.Instance().setGameCommonInfo(msg.deskInfo.gameType, msg.deskInfo.password, msg.deskInfo.ownerId);
                    //     RoomMgr.Instance().setReplayGameNetHandler(msg.deskInfo.gameType);
                    //     RoomMgr.Instance().setGameRuleByType({ rule: msg.deskInfo.deskRule });
                    //     RoomMgr.Instance().setPlayerMgr();
                    //     cc.gateNet.Instance().excuteReplayMsg(id, msg);
                    // }
                    //
                    // if (gameType == Define.GameType.NEW_DSZ_FRIEND) {
                    //     var id = this.msg_list[0].id;
                    //     var msg = this.msg_list[0].content;
                    //     RoomMgr.Instance().setGameCommonInfo(msg.deskInfo.gameType, msg.deskInfo.password, msg.deskInfo.ownerId, null, null);
                    //     RoomMgr.Instance().setGameRuleByType({ rule: msg.deskInfo.deskRule });
                    //     RoomMgr.Instance().setPlayerMgr();
                    // }
                    //
                    // if (gameType == cc.dd.Define.GameType.TDHMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjNeimengguRule: msg.deskinfo.createcfg });
                    // }
                    //
                    // if (gameType == cc.dd.Define.GameType.CFMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjChifengRule: msg.deskinfo.createcfg });
                    // }
                    //
                    // if (gameType == cc.dd.Define.GameType.AHMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjAohanRule: msg.deskinfo.createcfg });
                    // }
                    //
                    // if (gameType == cc.dd.Define.GameType.FZMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjFangzhengRule: msg.deskinfo.createcfg });
                    // }
                    // if (gameType == cc.dd.Define.GameType.WDMJ_FRIEND) {
                    //     var msg = this.msg_list[0].content;
                    //     this.setMJRoomMgr({ mjWudanRule: msg.deskinfo.createcfg });
                    // }
                    // switch (gameType) {
                    //     case cc.dd.Define.GameType.PZMJ_FRIEND:
                    //     case cc.dd.Define.GameType.BCMJ_FRIEND:
                    //     case cc.dd.Define.GameType.ACMJ_FRIEND:
                    //     case cc.dd.Define.GameType.HLMJ_FRIEND:
                    //         var msg = this.msg_list[0].content;
                    //         this.setCommonMJRoomMgr(msg);
                    //         break;
                    // }

                    if(gameType === Define.GameType.RUMMY){
                        var id = this.msg_list[0].id;
                        var msg = this.msg_list[0].content;
                        RoomMgr.Instance().setGameCommonInfo(msg.deskinfo.desktype, msg.deskinfo.passwrod, msg.deskinfo.owner);
                        RoomMgr.Instance().setPlayerMgr();
                        let RummyData = require("RummyData").RummyData.Instance();
                        RummyData.isReplay = true;
                        if(RummyData.state === -1){
                            RoomMgr.Instance().player_mgr.updatePlayerNum();
                            msg.roleInfosList.forEach(player=>{
                                RoomMgr.Instance().player_mgr.playerEnter(player);
                            });
                        }
                        cc.gateNet.Instance().excuteReplayMsg(id, msg);
                    }

                    this.saveHistoryCache();
                    cc.dd.SceneManager.replaceScene(mapGameReplayScene[gameType], [new cc.dd.ResLoadCell("blackjack_common/atlas/cards", cc.SpriteAtlas)], null, ()=>{
                        if(gameType === Define.GameType.RUMMY){
                            cc.dd.UIMgr.openUI("blackjack_common/replay/noSlider/replay_ui");
                        }
                    });
                }
                REPLAY_ED.notifyEvent(REPLAY_EVENT.ON_GET_DATA, null);
            }
        }
    },

    setMJRoomMgr(_rule) {
        var id = this.msg_list[0].id;
        var msg = this.msg_list[0].content;
        RoomMgr.Instance().setGameCommonInfo(msg.deskinfo.desktype, msg.deskinfo.passwrod, msg.deskinfo.owner);
        RoomMgr.Instance().setReplayGameNetHandler(msg.deskinfo.desktype);
        RoomMgr.Instance().setGameRuleByType({ rule: _rule });
        RoomMgr.Instance().setPlayerMgr();
        cc.gateNet.Instance().excuteReplayMsg(id, msg);
    },

    setCommonMJRoomMgr(_msg) {
        var id = this.msg_list[0].id;
        var msg = this.msg_list[0].content;
        RoomMgr.Instance().setGameCommonInfo(msg.deskinfo.desktype, msg.deskinfo.passwrod, msg.deskinfo.owner);
        RoomMgr.Instance().setReplayGameNetHandler(msg.deskinfo.desktype);
        RoomMgr.Instance().setGameRuleByType(_msg.deskinfo);
        RoomMgr.Instance().setPlayerMgr();
        cc.gateNet.Instance().excuteReplayMsg(id, msg);
    },

    //保存当前打开的界面信息
    saveHistoryCache() {
        if (!cc._chifengGame)
            return;
        cc._history_cache = {};
        //代开战绩
        var chifeng_hall_daikai_history = cc.dd.UIMgr.getUI('chifeng_hall_daikai_history');
        if (chifeng_hall_daikai_history) {
            var battleList = chifeng_hall_daikai_history.getComponent('chifeng_hall_daikai_history').battleList;
            cc.chifeng_hall_daikai_history = JSON.stringify(battleList);
        }
        //战绩
        var chifeng_hall_history = cc.dd.UIMgr.getUI('chifeng_hall_history');
        if (chifeng_hall_history) {
            var battleList = chifeng_hall_history.getComponent('chifeng_hall_history').battleList;
            cc.chifeng_hall_history = JSON.stringify(battleList);
        }
        //亲友圈战绩
        var chifeng_friend_group_history = cc.dd.UIMgr.getUI('klb_friend_group_clubBattleHistory');
        if (chifeng_friend_group_history) {
            var battleList = chifeng_friend_group_history.getComponent('klb_friend_group_clubBattleHistory').battleList;
            cc.chifeng_friend_group_history = JSON.stringify(battleList);
        }
        //战绩详细
        var chifeng_hall_history_detail = cc.dd.UIMgr.getUI('chifeng_hall_history_detail');
        if (chifeng_hall_history_detail) {
            var msgData = chifeng_hall_history_detail.getComponent('chifeng_hall_history_detail').msgData;
            cc.chifeng_hall_history_detail = JSON.stringify(msgData);
        }
    },
    //恢复战绩信息 回放切大厅
    loadHistoryCache() {
        if (!cc._chifengGame)
            return;
        if (cc._history_cache) {
            if (!cc.director.getScene() || !cc.director.getScene().name) {
                return;
            }
            switch (cc.director.getScene().name) {
                case "chifeng_hall"://大厅
                    cc.resources.load(hall_prefab.CHIFENG_DAIKAI_HISTORY, cc.Prefab, function (err, prefab) {
                        cc.resources.load(hall_prefab.CHIFENG_HISTORY, cc.Prefab, function (err, prefab) {
                            cc.resources.load(hall_prefab.CHIFENG_HISTORY_DETAIL, cc.Prefab, function (err, prefab) {
                                if (cc.chifeng_hall_daikai_history) {
                                    cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_DAIKAI_HISTORY, function (ui) {
                                        var data = JSON.parse(cc.chifeng_hall_daikai_history);
                                        ui.getComponent('chifeng_hall_daikai_history').initItem(data);
                                        cc.chifeng_hall_daikai_history = null;
                                    })
                                }
                                if (cc.chifeng_hall_history) {
                                    cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_HISTORY, function (ui) {
                                        var data = JSON.parse(cc.chifeng_hall_history);
                                        ui.getComponent('chifeng_hall_history').initItem(data);
                                        cc.chifeng_hall_history = null;
                                    })
                                }
                                if (cc.chifeng_hall_history_detail) {
                                    cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_HISTORY_DETAIL, function (ui) {
                                        var data = JSON.parse(cc.chifeng_hall_history_detail);
                                        ui.getComponent('chifeng_hall_history_detail').initItem(data);
                                        cc.chifeng_hall_history_detail = null;
                                    })
                                }
                            });
                        });
                    });
                    cc._history_cache = null;
                    break;
                case "klb_friend_group_scene"://亲友圈
                    cc.resources.load(prefab_config.KLB_FG_BATTLE_HISTORY, cc.Prefab, function (err, prefab) {
                        cc.resources.load(hall_prefab.CHIFENG_HISTORY_DETAIL, cc.Prefab, function (err, prefab) {
                            if (cc.chifeng_friend_group_history) {
                                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_BATTLE_HISTORY, function (ui) {
                                    var data = JSON.parse(cc.chifeng_friend_group_history);
                                    ui.getComponent('klb_friend_group_clubBattleHistory').initItem(data);
                                    cc.chifeng_friend_group_history = null;
                                })
                            }
                            if (cc.chifeng_hall_history_detail) {
                                cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_HISTORY_DETAIL, function (ui) {
                                    var data = JSON.parse(cc.chifeng_hall_history_detail);
                                    ui.getComponent('chifeng_hall_history_detail').initItem(data);
                                    cc.chifeng_hall_history_detail = null;
                                })
                            }
                        });
                    });
                    cc._history_cache = null;
                    break;
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
            cc.dd.PromptBoxUtil.show('Failed to get playback data');
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
    REPLAY_DATA: com_replay,
    REPLAY_ED: REPLAY_ED,
    REPLAY_EVENT: REPLAY_EVENT,
};