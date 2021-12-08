//create by wj 2019/09/26
var game_room_list = require('game_room');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var klb_game_list_config = require('klb_gameList');
var HallCommonData = require("hall_common_data").HallCommonData;

var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var gFishMgr = require('FishDoyenManager').FishManager.Instance();
var hall_prefab = require('hall_prefab_cfg');


cc.Class({
    extends: cc.Component,

    properties: {
        baseScoreTxt: cc.Label,
        descTxt: cc.Label,
    },
     onLoad:function () {
        
     },

     init: function (data, gameId) {
        game_room_list.items.forEach(function (roomItem) {
            if (gameId == roomItem.gameid && roomItem.roomid == data.fangjianid) {
                this.roomItem = roomItem;
                this.baseScoreTxt.string = roomItem.basescore;
                this.descTxt.string = roomItem.desc;
                this.roomid = roomItem.roomid;
                this.gameid = roomItem.gameid;

                var coin = HallPropData.getCoin();
                var sp = cc.find('roomBtn/dd_changci_bt',this.node)
                var name = cc.find('roomBtn/dd_changci_bt/name',this.node);
                var limit = cc.find('roomBtn/dd_changci_bt/limt',this.node);
                var enterlimit = cc.find('roomBtn/dd_changci_bt/enterlimt',this.node);

                if(coin < this.roomItem.entermin)
                {
                    sp.color = new cc.Color(136, 136, 136);
                    name.color = new cc.Color(136, 136, 136);
                    limit.color = new cc.Color(136, 136, 136);
                    enterlimit.color = new cc.Color(136, 136, 136);
                    
                }else
                {
                    sp.color = new cc.Color(255, 255, 255);
                    name.color = new cc.Color(255, 255, 255);
                    limit.color = new cc.Color(255, 255, 255);
                    enterlimit.color = new cc.Color(255, 255, 255);
                }
            }
        }.bind(this));
    },


    /**
     * 点击房间发送消息
     */
    onClickRoom: function (isQuick) {
        /************************游戏统计 start************************/
        let translateGameID = require("clientAction").translateGameID;
        let actionID = translateGameID(this.gameid);
        if(this.roomid == 5){
            cc.dd.PromptBoxUtil.show('专家场NOT YET OPEN，敬请期待');
            return;
        }
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

        if (HallCommonData.getInstance().gameId > 0) {    //游戏恢复
            var gameItem = klb_game_list_config.getItem(function (item) {
                if (item.gameid == HallCommonData.getInstance().gameId)
                    return item
            })
            var str = '您正在[' + gameItem.name + ']房间中游戏，暂时无法进入其他房间!'
            cc.dd.DialogBoxUtil.show(0, str, '回到房间', 'Cancel', function () {
                var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                msg.setGameType(HallCommonData.getInstance().gameId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickRoom');
            }, null);
            return;
        }

        this.checkIsEnterCommon(this.gameid, this.sendMsgToEnterFish.bind(this));
    },

    checkIsEnterCommon: function (gameId, callFunc) {
        RoomMgr.Instance().gameId = this.gameid;
        RoomMgr.Instance().roomType = this.roomItem.roomid;
        gFishMgr.setRoomType(this.roomItem.roomid);

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

    sendMsgToEnterFish: function(gameid){

        cc.dd.AppCfg.GAME_ID = gameid;
        let data = this.roomItem;
        gFishMgr.setRoomItem(data);

        //zzy 捕鱼匹配

            var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
            msg.setGameType(gameid);
            msg.setRoomId(data.roomid);
            // msg.setSeat(seat);
            // msg.setDeskId(deskId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
            // cc.dd.NetWaitUtil.show('正在请求数据');
            cc.sys.localStorage.setItem('fishGameId', gameid);
    },



   

    
});
