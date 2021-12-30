// create by wj
var game_room_list = require('game_room');
var Define = require("Define");
var hall_prefab = require('hall_prefab_cfg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var klb_game_list_config = require('klb_gameList');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var HallCommonData = require("hall_common_data").HallCommonData;


cc.Class({
    extends: cc.Component,

    properties: {
        titleTxt: require("LanguageLabel"),
        baseScoreTxt: cc.Label,
        playerNumTxt: cc.Label,
        descTxt: require("LanguageLabel"),
        bg: cc.Sprite,
        tubiaoBg: cc.Sprite,
        roleBg: cc.Sprite,
        selectTag: cc.Sprite,

        bgSprites: { default: [], type: cc.SpriteFrame, tooltip: '背景图片' },
        tubiaoSprites: { default: [], type: cc.SpriteFrame, tooltip: '图标图片' },
        roleBgSprites: { default: [], type: cc.SpriteFrame, tooltip: '人数背景图片' },
    },


    onLoad () {},

    init: function (data, gameId, clickCallBack) {
        game_room_list.items.forEach(function (roomItem) {
            if (gameId == roomItem.gameid && roomItem.roomid == data.fangjianid) {
                this.roomItem = roomItem;
                this.titleTxt.setText(roomItem.titel);
                this.baseScoreTxt.string = roomItem.basescore;
                this.playerNumTxt.string = data.fangjianrenshu;
                this.descTxt.setText(roomItem.desc);
                var index = roomItem.roomid;

                if (index > 4) {
                    index = 4;
                }
                this.bg.spriteFrame = this.bgSprites[index - 1];
                this.tubiaoBg.spriteFrame = this.tubiaoSprites[index - 1];
                this.roleBg.spriteFrame = this.roleBgSprites[index - 1];

                this.roomid = roomItem.roomid;
                this.gameid = roomItem.gameid;
            }
        }.bind(this));

        this.onClickRoomCallBack = clickCallBack;
    },

    /**
     * 点击房间发送消息
     */
    onClickRoom: function (event, data) {
        if(this.onClickRoomCallBack){
            this.onClickRoomCallBack(event.target.tagname);
        }
    },

    /**
     * 设置被选中
     */
    setSelect: function(isSelect){
        this.selectTag.node.active = isSelect;
    },

    onClickEnterGame: function(){
        var enterfunc = function () {
            switch (this.gameid) {
                case Define.GameType.TEXAS:
                    this.checkIsEnterCommon(this.gameid, this.sendTexasEnter.bind(this))
                    break;
                case Define.GameType.BLACKJACK_GOLD:
                    this.checkIsEnterCommon(this.gameid, this.sendBlackJack.bind(this));
                    break;
                case Define.GameType.RUMMY:
                    this.checkIsEnterCommon(this.gameid, this.sendRummy.bind(this));
                    break;
                default:
                    break;
            }
        }.bind(this)
        if (HallCommonData.getInstance().gameId > 0) {    //游戏恢复
            var gameItem = klb_game_list_config.getItem(function (item) {
                if (item.gameid == HallCommonData.getInstance().gameId)
                    return item
            })
            var str = 'Intheroom'
            cc.dd.DialogBoxUtil.show(0, str, 'backroom', 'Cancel', function () {　      
                var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                msg.setGameType(HallCommonData.getInstance().gameId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickRoom');
            }, null, null, gameItem.name );
            cc.dd.DialogBoxUtil.setWaitGameEnd(enterfunc);
            return;
        }
        enterfunc();

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
                } else if(coin + HallPropData.getBankCoin() < 2000 && HallCommonData.getInstance().jiuji_cnt > 0){
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
                        var jiuji = ui.getComponent('klb_hall_jiuji');
                        if (jiuji != null) {
                            jiuji.update_buy_list(this.roomItem.entermin);
                        }
                    }.bind(this));
                }else{
                    cc.dd.PromptBoxUtil.show("coinNotEnough");
                }
            } else if (coin > this.roomItem.entermax) {
                if (this.roomItem.entermax === 0) {
                    callFunc(gameId);
                } else {
                    cc.dd.PromptBoxUtil.show("coinTooMuch");
                }
            }
        }
    },

    /**
     * 检测金币场是否能进入
     * @param gameId
     */
    checkIsEnter: function (gameId) {   
        RoomMgr.Instance().gameId = this.gameid;
        RoomMgr.Instance().roomLv = this.roomid;

        var coin = HallPropData.getCoin();
        if ((coin >= this.roomItem.entermin && coin <= this.roomItem.entermax)) {
            this.replaceRoomMgr(gameId);
        } else {
            if (coin < this.roomItem.entermin) {
                if (this.roomItem.entermin === 0) {
                    this.replaceRoomMgr(gameId);
                } else if(coin + HallPropData.getBankCoin() < 2000 && HallCommonData.getInstance().jiuji_cnt > 0) {
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
                        var jiuji = ui.getComponent('klb_hall_jiuji');
                        if (jiuji != null) {
                            jiuji.update_buy_list(this.roomItem.entermin);
                        }
                    }.bind(this));
                }else{
                    cc.dd.PromptBoxUtil.show("coinNotEnough");
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

    sendBlackJack(gameid){
        cc.dd.AppCfg.GAME_ID = gameid;
        let data = this.roomItem;

        let BlackJackData = require('BlackJackData').BlackJackData.Instance();
        BlackJackData.setRoomInfo(data);

        var func = function () {
            var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
            msg.setGameType(data.gameid);
            msg.setRoomId(data.roomid);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        }
        cc.dd.SceneManager.enterGame(gameid, func, [new cc.dd.ResLoadCell("blackjack_common/atlas/cards", cc.SpriteAtlas)]);
    },

    sendRummy(gameid){
        cc.dd.AppCfg.GAME_ID = gameid;
        let data = this.roomItem;

        let RummyData = require('RummyData').RummyData.Instance();
        RummyData.setRoomInfo(data);

        var func = function () {
            var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
            msg.setGameType(data.gameid);
            msg.setRoomId(data.roomid);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        }
        cc.dd.SceneManager.enterGame(gameid, func, [new cc.dd.ResLoadCell("blackjack_common/atlas/cards", cc.SpriteAtlas)]);
    }
});
