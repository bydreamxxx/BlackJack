// create by wj 2019/04/18
var game_room_list = require('game_room');
var HallCommonData = require("hall_common_data").HallCommonData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var klb_game_list_config = require('klb_gameList');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        m_nRoomId: 0,
        gameId: 0,
        m_oRuleText: cc.Label,
        m_oBaseText: cc.Label,
        m_oEnterText: cc.Label,
        m_oLeaveText: cc.Label,
        m_nEnterLimit: 0,
        m_tPlayerNode: { default: [], type: cc.Node, },
        m_tRoomType: { default: [], type: cc.SpriteFrame, },
        m_oRoomTypeSp: cc.Sprite,
        m_nRoleNum: 0,
        m_nTotalNum: 0,
    },

    onLoad() { },

    //设置自建房数据
    setData: function (data) {
        this.gameId = data.gameType; //游戏id
        this.m_nRoomId = data.roomId; //房间号
        this.m_oBaseText.string = this.convertChipNum(data.rule.yqPin3Rule.baseScore); //底分
        this.m_oEnterText.string = this.convertChipNum(data.rule.yqPin3Rule.limitEnter); //入场限制
        this.m_nEnterLimit = data.rule.yqPin3Rule.limitEnter; //入场限制
        this.m_oLeaveText.string = this.convertChipNum(data.rule.yqPin3Rule.limitLeave); //离场限制
        this.m_oRuleText.string = this.analysisRule(data.rule.yqPin3Rule.playMod, data.rule.yqPin3Rule.playRuleList); //规则
        this.m_nRoleNum = data.roleNum;
        this.m_nTotalNum = data.rule.yqPin3Rule.roleNum;
        if (data.rule.yqPin3Rule.roleNum == 6) {
            this.m_tPlayerNode[0].active = true;
            for (var i = 0; i < data.roleNum; i++)
                this.m_tPlayerNode[0].getChildByName('player' + i).getChildByName('seat').active = true;
        } else {
            this.m_tPlayerNode[1].active = true;
            for (var i = 0; i < data.roleNum; i++)
                this.m_tPlayerNode[1].getChildByName('player' + i).getChildByName('seat').active = true;
        }
        this.analysisRoomType(data.rule.yqPin3Rule.playMod, data.rule.yqPin3Rule.playRuleList);
    },

    //设置金币场数据
    setCoinData: function (data, gameId) {
        game_room_list.items.forEach(function (roomItem) {
            if (gameId == roomItem.gameid && roomItem.roomid == data.fangjianid) {
                this.m_nRoomId = roomItem.roomid;
                this.gameId = roomItem.gameid;
                this.m_nEnterLimit = roomItem.entermin;
            }
        }.bind(this));
    },

    //检查是否可加入
    checkCanQuickEnter: function () {
        return this.m_nRoleNum < this.m_nTotalNum;
    },

    /**
     * 解析游戏规则
     */
    analysisRule: function (playModel, playRuleList) {
        var ruleStr = playModel == 1 ? '标准模式' : '大牌模式(无2-8)';
        if (playRuleList) {
            playRuleList.forEach(function (rule) {
                switch (parseInt(rule)) {
                    case 1:
                        ruleStr += '/必闷三轮'
                        break;
                    case 2:
                        ruleStr += '/癞子玩法'
                        break;
                    case 3:
                        ruleStr += '/双倍比牌'
                        break;
                    case 4:
                        ruleStr += '/亮底牌'
                        break;
                }
            });
        }
        return ruleStr;
    },

    /**
     * 解析房间类型
     */
    analysisRoomType: function (playModel, playRuleList) {
        var Index = (playModel == 1 ? 0 : 1) * 10000;
        if (playRuleList.length > 0) {
            for (var i = 0; i < playRuleList.length; i++) {
                if (parseInt(playRuleList[i]) == 2)
                    Index += 1000;
                else if (parseInt(playRuleList[i]) == 3)
                    Index += 10;
                else if (parseInt(playRuleList[i]) == 1)
                    Index += 100;
            }
        }
        this.m_oRoomTypeSp.node.active = true;
        if (Index > 11010) //狂赖
            this.m_oRoomTypeSp.spriteFrame = this.m_tRoomType[0];
        else if (Index < 11010 && Index >= 11000)//大赖
            this.m_oRoomTypeSp.spriteFrame = this.m_tRoomType[1];
        else if (Index >= 10000)//大牌
            this.m_oRoomTypeSp.spriteFrame = this.m_tRoomType[2];
        else if (Index >= 1000)//癞子
            this.m_oRoomTypeSp.spriteFrame = this.m_tRoomType[3];
        else if (Index >= 100)//闷三
            this.m_oRoomTypeSp.spriteFrame = this.m_tRoomType[4];
        else
            this.m_oRoomTypeSp.node.active = false;

    },

    /**
     * 点击房间发送消息
     */
    onClickRoom: function (isQuick) {

        if(this.gameId == 136){
            if(this.m_nRoomId == 3){
                cc.dd.PromptBoxUtil.show('NOT YET OPEN');
                return;
            }
        }

        /************************游戏统计 start************************/
        let translateGameID = require("clientAction").translateGameID;
        let actionID = translateGameID(this.gameId);

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
            switch (this.gameId) {
                case 37: //新斗三张金币自建房
                    this.sendDSZSelfEnterMsg();
                    break;
                case 136: //新斗三张金币场
                    this.checkIsEnterCommon(this.gameId, this.sendDSZEnterMsg.bind(this));
                    break;
            }
        }.bind(this);

        if (HallCommonData.getInstance().gameId > 0) {    //游戏恢复
            var gameItem = klb_game_list_config.getItem(function (item) {
                if (item.gameid == HallCommonData.getInstance().gameId)
                    return item
            })
            var str = '您正在[' + gameItem.name + ']房间中游戏，大约30秒后自动进入新游戏。。。'

            cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                var cpt = prefab.getComponent('new_dsz_dialog_box');
                if (cpt)
                    cpt.show(0, str, '回到房间', 'Cancel', function () {
                        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                        msg.setGameType(HallCommonData.getInstance().gameId);
                        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickRoom');
                    }, null);
            });
            cc.dd.DialogBoxUtil.setWaitGameEnd(enterfunc);
            return;
        }

        enterfunc();
    },

    /**
 * 检查金币是否可以进入房间，通用
 */
    checkIsEnterCommon: function (gameId, callFunc) {
        RoomMgr.Instance().gameId = this.gameId;
        RoomMgr.Instance().roomLv = this.m_nRoomId;

        var coin = HallPropData.getCoin();
        if (coin >= this.m_nEnterLimit) {
            callFunc(gameId);
        } else {
            if (coin < this.m_nEnterLimit) {
                if (this.m_nEnterLimit === 0) {
                    callFunc(gameId);
                } else {
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
                        var jiuji = ui.getComponent('klb_hall_jiuji');
                        if (jiuji != null) {
                            jiuji.update_buy_list(this.m_nEnterLimit);
                        }
                    }.bind(this));
                }
            }
        }
    },
    sendDSZSelfEnterMsg: function () {
        var msg = new cc.pb.room_mgr.msg_enter_game_req();
        var game_info = new cc.pb.room_mgr.common_game_header();
        game_info.setRoomId(this.m_nRoomId);
        msg.setGameInfo(game_info);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_game_req, msg, 'cmd_msg_enter_game_req', true);
    },

    //加入金币场房间
    sendDSZEnterMsg: function (gameid) {
        cc.dd.AppCfg.GAME_ID = gameid;
        var scriptData = require('teenpatti_desk').Teenpatti_Desk_Data.Instance();
        scriptData.initCoin(this.m_nRoomId);
        this.gameId = gameid;
        var self = this;
        //var func = function () {
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(self.gameId);
        msg.setRoomId(self.m_nRoomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        //}
        //cc.dd.SceneManager.enterGame(gameid, func);
    },

    //转换筹码字
    convertChipNum: function (num) {
        var str = num;
        if (num >= 10000 && num < 100000000) {
            str = (num / 10000).toFixed(0) + '万';
        } else if (num >= 100000000)
            str = Math.ceil(num / 100000000).toFixed(1) + '亿';
        return str
    },
});
