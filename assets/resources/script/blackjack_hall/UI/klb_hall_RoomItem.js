var game_room_list = require('game_room');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var HallCommonData = require("hall_common_data").HallCommonData;
var Define = require("Define");
var hall_prefab = require('hall_prefab_cfg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var klb_game_list_config = require('klb_gameList');
var AppConfig = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        titleTxt: cc.Label,
        baseScoreTxt: cc.Label,
        playerNumTxt: cc.Label,
        descTxt: cc.Label,
        backSp: cc.Sprite,
        hongBaoTxt: cc.Label,
        bg: cc.Sprite,
        bgSprites: { default: [], type: cc.SpriteFrame, tooltip: '背景图片' },
        baseScoreColor: { default: [], type: cc.Color, tooltip: '门槛颜色' },
        baseScoreFont: { default: [], type: cc.Font, tooltip: '门槛字体' },
        baseScoreTitleOutLine: cc.LabelOutline,
        baseScoreOutLine: cc.LabelOutline,
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function (data, gameId) {
        game_room_list.items.forEach(function (roomItem) {
            if (gameId == roomItem.gameid && roomItem.roomid == data.fangjianid) {
                this.roomItem = roomItem;
                this.titleTxt.string = roomItem.titel + (roomItem.changci === "" ? "" : "(" + roomItem.changci + ")");
                this.baseScoreTxt.string = roomItem.basescore;
                this.playerNumTxt.string = data.fangjianrenshu;
                this.descTxt.string = roomItem.desc;
                var index = roomItem.roomid;
                // this.cxtip[index - 1].active = true;
                if (index > 4) {
                    index = 4;
                }
                // this.backSp.spriteFrame = this.spriteArr[index - 1];
                this.bg.spriteFrame = this.bgSprites[index - 1];
                switch (AppConfig.GAME_PID) {
                    case 2:
                        let label = cc.find('roomBtn/difenLabel', this.node)
                        label.color = this.baseScoreColor[index - 1];
                        this.baseScoreTxt.font = this.baseScoreFont[index - 1];
                        break;
                    case 3:
                    case 4:
                    case 5:
                        break;
                    default:
                        this.descTxt.node.color = this.baseScoreColor[index - 1];
                        this.baseScoreTitleOutLine.color = this.baseScoreColor[index - 1];
                        this.baseScoreOutLine.color = this.baseScoreColor[index - 1];
                        break;
                }
                this.roomid = roomItem.roomid;
                this.gameid = roomItem.gameid;
                // if (roomItem.moneymin > 0) {
                //     this.checkMoney(roomItem);
                //     this.hongBaoTxt.string = '最高' + roomItem.moneymin + '元';
                //     this.hongBaoTxt.node.parent.active = true;
                // }
                // else {
                this.hongBaoTxt.node.parent.active = false;
                //}
            }
        }.bind(this));
    },

    checkMoney: function (roomItem) {
        switch (roomItem.roomid) {
            case 1:
                roomItem.moneymin = 0.5;
                break;
            case 2:
                roomItem.moneymin = 1;
                break;
            case 3:
                roomItem.moneymin = 3;
                break;
            case 4:
                roomItem.moneymin = 5;
                break;
        }
    },

    /**
     * 点击房间发送消息
     */
    onClickRoom: function (isQuick) {
        if (this.gameid == 51 || this.gameid == 135 || this.gameid == 41) {
            if (this.roomid == 4) {
                cc.dd.PromptBoxUtil.show('暂未开放');
                return;
            }
        }

        /************************游戏统计 start************************/
        let translateGameID = require("clientAction").translateGameID;
        let actionID = translateGameID(this.game_id);

        let _roomID = 0;
        switch (this.roomid) {
            case 1:
                _roomID = cc.dd.clientAction.T_NORMAL.NORMAL_GAME;
                break;
            case 2:
                _roomID = cc.dd.clientAction.T_NORMAL.ELITE_GAME;
                break;
            case 3:
                _roomID = cc.dd.clientAction.T_NORMAL.LOCAL_TYRANTS_GAME;
                break;
            case 4:
                _roomID = cc.dd.clientAction.T_NORMAL.SUPREME_GAME;
                break;
            default:
                _roomID = cc.dd.clientAction.T_NORMAL.QUICK_GAME;
                break;
        }
        if (isQuick) {
            _roomID = cc.dd.clientAction.T_NORMAL.QUICK_GAME;
        }

        cc.dd.Utils.sendClientAction(actionID, _roomID);
        /************************游戏统计   end************************/

        var enterfunc = function () {
            switch (this.gameid) {
                case 1:
                case 2:
                    this.onSendEnterMsgFortune();
                    break;
                // 长春麻将 金币场
                case Define.GameType.CCMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_changchunmajiang_func", require('ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                //刨幺
                case 61:
                    this.checkIsEnterCommon(this.gameid, this.sendPYEnterMsg.bind(this));
                    break;
                // 吉林麻将 金币场
                case Define.GameType.JLMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_jilinmajiang_func", require('jlmj_net_handler_jlmj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case 5:
                    this.checkZJHCanEnter();
                    break;
                // 三打一 金币场
                case 25:
                    this.sendSdyJbcEnterMsg();
                    break;
                case 41:
                    this.checkIsEnterCommon(41, this.sendTDKEnterMsg.bind(this));
                    break;
                case 32:
                    this.checkIsEnterCommon(this.gameid, this.sendDDZEnterMsg.bind(this));
                    break;
                case 51:
                    this.checkIsEnterCommon(this.gameid, this.sendNNEnterMsg.bind(this));
                    break;
                // 农安麻将 金币场
                case Define.GameType.NAMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_nonganmajiang_func", require('namj_net_handler_namj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case 109://疯狂拼十
                    this.checkIsEnterCommon(this.gameid, this.sendBRNNEnterMsg.bind(this));
                    break;
                case 135: //斗三张
                    this.checkIsEnterCommon(this.gameid, this.sendDSZEnterMsg.bind(this));
                    break;
                case Define.GameType.FXMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_fuxinmajiang_func", require('fxmj_net_handler_fxmj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.SYMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_songyuanmajiang_func", require('symj_net_handler_symj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case 163:
                    this.checkIsEnterCommon(this.gameid, this.sendSuohaEnterMsg.bind(this));
                    break;
                case 202:
                    this.checkIsEnterCommon(this.gameid, this.sendTexasEnter.bind(this))
                    break;
                case Define.GameType.XZMJ_GOLD:
                case Define.GameType.XLMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_xuezhanmj_func", require('scmj_net_handler_scmj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.SHMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_suihuamj_func", require('shmj_net_handler_shmj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.JZMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_jinzhoumj_func", require('jzmj_net_handler_jzmj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.HSMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_heishanmj_func", require('hsmj_net_handler_hsmj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.TDHMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_neimenggumj_func", require('tdhmj_net_handler_tdhmj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.CFMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_chifengmj_func", require('cfmj_net_handler_cfmj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.AHMJ_GOLD:
                    cc.gateNet.Instance().setHandler("c_msg_aohanmj_func", require('ahmj_net_handler_ahmj_jbc'));//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.FZMJ_GOLD:
                    let fzmj_handler = require('fzmj_net_handler_fzmj');
                    fzmj_handler.setHandlerTypeJBC();
                    cc.gateNet.Instance().setHandler("c_msg_fangzhengmj_func", fzmj_handler);//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.WDMJ_GOLD:
                    let wdmj_handler = require('wdmj_net_handler_wdmj');
                    wdmj_handler.setHandlerTypeJBC();
                    cc.gateNet.Instance().setHandler("c_msg_wudanmj_func", wdmj_handler);//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.PZMJ_GOLD:
                    let pzmj_handler = require('pzmj_net_handler_pzmj');
                    pzmj_handler.setHandlerTypeJBC();
                    cc.gateNet.Instance().setHandler("c_msg_mjcommon_func", pzmj_handler);//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.BCMJ_GOLD:
                    let bcmj_handler = require('bcmj_net_handler_bcmj');
                    bcmj_handler.setHandlerTypeJBC();
                    cc.gateNet.Instance().setHandler("c_msg_mjcommon_func", bcmj_handler);//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.ACMJ_GOLD:
                    let acmj_handler = require('acmj_net_handler_acmj');
                    acmj_handler.setHandlerTypeJBC();
                    cc.gateNet.Instance().setHandler("c_msg_mjcommon_func", acmj_handler);//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.HLMJ_GOLD:
                    let hlmj_handler = require('hlmj_net_handler_hlmj');
                    hlmj_handler.setHandlerTypeJBC();
                    cc.gateNet.Instance().setHandler("c_msg_mjcommon_func", hlmj_handler);//'ccmj_net_handler_ccmj_jbc'));
                    cc.gateNet.Instance().addRecvfunc("c_msg_mjcommon_func", 3330, { package_name: 'msg', msg_name: 'JiaoPaiInfo', name: 'JiaoPaiInfo', func: hlmj_handler.on_JiaoPaiInfo, func_name: 'on_JiaoPaiInfo', logtag: '[3330:JiaoPaiInfo ]' });
                    this.checkIsEnter(this.gameid);
                    break;
                case Define.GameType.JSMJ_GOLD:
                    let jsmj_handler = require('jsmj_net_handler_jsmj');
                    jsmj_handler.setHandlerTypeJBC();
                    cc.gateNet.Instance().setHandler("c_msg_mjcommon_func", jsmj_handler);//'ccmj_net_handler_ccmj_jbc'));
                    this.checkIsEnter(this.gameid);
                    break;
                default:
                    break;
            }
        }.bind(this);

        if (HallCommonData.getInstance().gameId > 0) {    //游戏恢复
            var gameItem = klb_game_list_config.getItem(function (item) {
                if (item.gameid == HallCommonData.getInstance().gameId)
                    return item
            })
            var str = '您正在[' + gameItem.name + ']房间中游戏，大约30秒后自动进入新游戏。。。'
            cc.dd.DialogBoxUtil.show(0, str, '回到房间', '取消', function () {
                var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                msg.setGameType(HallCommonData.getInstance().gameId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickRoom');
            }, null);
            cc.dd.DialogBoxUtil.setWaitGameEnd(enterfunc);
            return;
        }
        enterfunc();
    },

    /**
     * 发送三打一金币场进入请求
     */
    sendSdyJbcEnterMsg: function () {
        const loadCellList = [];
        loadCellList.push(new cc.dd.ResLoadCell("gameyj_ddz/bsc/atlas/ddz_poker", cc.SpriteAtlas));
        cc.dd.SceneManager.replaceScene("sdy_jbc", loadCellList);

        var RoomData = require('sdy_room_data').RoomData;
        RoomData.Instance().game_type = this.gameid;
        RoomData.Instance().room_lv = this.roomid;
    },

    /**
     * 发送吉林麻将金币场重连
     */
    sendRecover: function (gameId) {
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();

        msg.setGameType(gameId);
        msg.setRoomId(0);

        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickRoom');

    },
    /**
     * 检查金币是否可以进入房间，通用
     */
    checkIsEnterCommon: function (gameId, callFunc) {
        RoomMgr.Instance().gameId = this.gameid;
        RoomMgr.Instance().roomLv = this.roomid;

        var coin = HallPropData.getCoin();
        if ((coin >= this.roomItem.entermin && coin <= this.roomItem.entermax)) {
            callFunc(gameId);
        } else {
            if (coin < this.roomItem.entermin) {
                if (this.roomItem.entermin === 0) {
                    callFunc(gameId);
                } else {
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
                        var jiuji = ui.getComponent('klb_hall_jiuji');
                        if (jiuji != null) {
                            jiuji.update_buy_list(this.roomItem.entermin);
                        }
                    }.bind(this));
                }
            } else if (coin > this.roomItem.entermax) {
                if (this.roomItem.entermax === 0) {
                    callFunc(gameId);
                } else {
                    cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_16);
                }
            }
        }
    },

    /**
     * 检测金币场是否能进入
     * @param gameId
     */
    checkIsEnter: function (gameId) {
        var commonId = HallCommonData.getInstance().gameId;
        switch (commonId) {
            case Define.GameType.JLMJ_GOLD:
            case Define.GameType.CCMJ_GOLD:
            case Define.GameType.NAMJ_GOLD:
            case Define.GameType.FXMJ_GOLD:
            case Define.GameType.SYMJ_GOLD:
            case Define.GameType.XZMJ_GOLD:
            case Define.GameType.XLMJ_GOLD:
            case Define.GameType.SHMJ_GOLD:
            case Define.GameType.JZMJ_GOLD:
            case Define.GameType.HSMJ_GOLD:
            case Define.GameType.TDHMJ_GOLD:
            case Define.GameType.CFMJ_GOLD:
            case Define.GameType.AHMJ_GOLD:
            case Define.GameType.FZMJ_GOLD:
            case Define.GameType.WDMJ_GOLD:
            case Define.GameType.PZMJ_GOLD:
            case Define.GameType.BCMJ_GOLD:
            case Define.GameType.ACMJ_GOLD:
            case Define.GameType.HLMJ_GOLD:
            case Define.GameType.JSMJ_GOLD:
                this.sendRecover(commonId);
                return;
        }

        RoomMgr.Instance().gameId = this.gameid;
        RoomMgr.Instance().roomLv = this.roomid;

        var coin = HallPropData.getCoin();
        if ((coin >= this.roomItem.entermin && coin <= this.roomItem.entermax)) {
            this.replaceRoomMgr(gameId);
        } else {
            if (coin < this.roomItem.entermin) {
                if (this.roomItem.entermin === 0) {
                    this.replaceRoomMgr(gameId);
                } else {
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
                        var jiuji = ui.getComponent('klb_hall_jiuji');
                        if (jiuji != null) {
                            jiuji.update_buy_list(this.roomItem.entermin);
                        }
                    }.bind(this));
                }
            } else if (coin > this.roomItem.entermax) {
                if (this.roomItem.entermax === 0) {
                    this.replaceRoomMgr(gameId);
                } else {
                    cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_16);
                }
            }
        }
    },

    /**
     * 切换吉林麻将 金币场
     */
    replaceRoomMgr: function (gameId) {

    },


    /**
     * 发送填大坑协议
     */
    sendTDKEnterMsg: function (gameid) {
        var scriptData = require('tdk_coin_player_data').TdkCPlayerMgrData.Instance();
        scriptData.setData(this.roomItem);
        cc.dd.AppCfg.GAME_ID = gameid;
        cc.dd.SceneManager.enterGame(this.gameid);
    },

    /**
     * 刨幺
     */
    sendPYEnterMsg: function (gameid) {
        var scriptData = require('paoyao_data').PaoYao_Data.getInstance();
        scriptData.setData(this.roomItem);
        cc.dd.AppCfg.GAME_ID = gameid;
        cc.dd.SceneManager.enterGame(this.gameid);
    },

    /**
     * 斗地主
     */
    sendDDZEnterMsg: function (gameid) {
        var scriptData = require('ddz_data').DDZ_Data.Instance();
        scriptData.setData(this.roomItem);
        cc.dd.AppCfg.GAME_ID = gameid;
        cc.dd.SceneManager.enterGame(this.gameid);
    },

    /**
     * 牛牛
     */
    sendNNEnterMsg: function (gameid) {
        var scriptData = require('nn_data').Instance();
        scriptData.setData(this.roomItem);
        cc.dd.AppCfg.GAME_ID = gameid;
        var func = function () {
            var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
            var gameType = scriptData.getGameId();
            var roomId = scriptData.getRoomId();
            msg.setGameType(gameType);
            msg.setRoomId(roomId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        }
        cc.dd.SceneManager.enterGame(this.gameid, func);
    },

    sendSuohaEnterMsg: function (gameid) {
        var roominfo = this.roomItem;
        var scriptData = require('sh_data').sh_Data.Instance();
        scriptData.setData(this.roomItem);
        cc.dd.AppCfg.GAME_ID = gameid;


        // var func = function () {
        //     var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        //     var gameType = scriptData.getGameId();
        //     var roomId = scriptData.getRoomId();
        //     msg.setGameType(gameType);
        //     msg.setRoomId(roomId);
        //     cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        // }
        // cc.dd.SceneManager.enterGame(this.gameid, func);

        cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_Seat", function (node) {
            let ui = node.getComponent("klb_hall_Seat");
            if (ui) {
                ui.initBaseInfo(roominfo);

                var msg = new cc.pb.game_rule.msg_get_room_desks_req();
                var gameInfo = new cc.pb.room_mgr.common_game_header();
                gameInfo.setGameType(163);
                gameInfo.setRoomId(roominfo.roomid);
                msg.setGameInfo(gameInfo);
                msg.setIndex(1);
                cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_get_room_desks_req, msg,
                    '发送协议[cmd_msg_get_room_desks_req][拉取数据信息]', true);
            }
        });
    },

    sendBRNNEnterMsg: function (gameid) {
        var scriptData = require('brnn_data').brnn_Data.Instance();
        scriptData.setData(this.roomItem);
        let data = this.roomItem;
        cc.dd.AppCfg.GAME_ID = gameid;
        var func = function () {
            var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
            msg.setGameType(data.gameid);
            msg.setRoomId(data.roomid);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        }
        cc.dd.SceneManager.enterGame(gameid, func);
    },

    sendTexasEnter:function(gameid){
        var scriptData = require('texas_data').texas_Data.Instance();
        scriptData.setData(this.roomItem);
        let data = this.roomItem;
        cc.dd.AppCfg.GAME_ID = gameid;
        var func = function () {
            var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
            msg.setGameType(data.gameid);
            msg.setRoomId(data.roomid);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        }
        cc.dd.SceneManager.enterGame(gameid, func, null);
    },

    checkZJHCanEnter: function () {
    },

    sendDSZEnterMsg: function (gameid) {
        var scriptData = require('dsz_desk_data').DSZ_Desk_Data.Instance();
        scriptData.initCoin(this.roomItem.roomid);

        cc.dd.AppCfg.GAME_ID = gameid;
        let data = this.roomItem;
        var func = function () {
            var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
            msg.setGameType(data.gameid);
            msg.setRoomId(data.roomid);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        }
        cc.dd.SceneManager.enterGame(gameid, func);
    },
});
