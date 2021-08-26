//create by wj 2019/09/26
var game_room_list = require('game_room');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var klb_game_list_config = require('klb_gameList');
var HallCommonData = require("hall_common_data").HallCommonData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var gFishMgr = require('FishManager').FishManager.Instance();
var hall_prefab = require('hall_prefab_cfg');
var Define = require("Define");
let scene_dir_cfg = require('scene_dir_cfg');
var loading_cfg = require('loading_cfg');

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
            cc.dd.PromptBoxUtil.show('专家场暂未开放，敬请期待');
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
            var str = '您正在[' + gameItem.name + ']房间中游戏，大约30秒后自动进入新游戏。。。'
            cc.dd.DialogBoxUtil.show(0, str, '回到房间', '取消', function () {
                var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                msg.setGameType(HallCommonData.getInstance().gameId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickRoom');
            }, null);
            var enterfunc=function(){
                this.checkIsEnterCommon(this.gameid, this.sendMsgToEnterFish.bind(this));
            }.bind(this);
            cc.dd.DialogBoxUtil.setWaitGameEnd(enterfunc);
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

        cc.dd.UIMgr.openUI("gameyj_fish/prefabs/gameyj_fish_desk_select",function (node) {
            let ui = node.getComponent("gameyj_Fish_Select_Desk");
            if(ui){
                ui.initDeskNodeList(data.roomid, 1);

                var msg = new cc.pb.game_rule.msg_get_room_desks_req();
                var gameInfo = new cc.pb.room_mgr.common_game_header();
                gameInfo.setGameType(138);
                gameInfo.setRoomId(data.roomid);
                msg.setGameInfo(gameInfo);
                msg.setIndex(1);
                cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_get_room_desks_req,msg,
                    '发送协议[cmd_msg_get_room_desks_req][拉取数据信息]', true);
                cc.sys.localStorage.setItem('fishGameId', '138');
                cc.sys.localStorage.setItem('fishRoomId', data.roomid);
            }
        });

        //this.enterGame(138);
    },

    //日志打印 比赛场莫名拉回大厅bug
    stack(sceneName) {
        var e = new Error();
        var lines = e.stack.split("\n");
        lines.shift();
        var str = '加载场景:' + sceneName + ' \n';
        lines.forEach(item => {
            str += item;
            str += '\n';
        });
        cc.log(str);
    },

    enterGame: function(gameId){
        var sceneName = Define.GameId[gameId];
        if (cc.director.getScene().name == sceneName) {
            cc.log('当前正在场景 ' + sceneName + ' 无需切换场景');
            return false;
        }

        this.stack(sceneName);
        if (!cc.director.getScene() || !cc.director.getScene().name) {
            return;
        }

        let scene = cc.director.getScene();
        scene.autoReleaseAssets = true;

        var pre_scene_dir = scene_dir_cfg[cc.director.getScene().name];
        var load_scene_dir = scene_dir_cfg[sceneName];

        cc.gateNet.Instance().pauseDispatch();
        AudioManager.clearBackGroundMusicKey();

        var data = loading_cfg.getItem(function (item) {
            var list = item.key.split(';');
            for (var i = 0; i < list.length; i++) {
                if (list[i] == sceneName)
                    return item;
            }
        });

        var loading_scene = 'loading';
        if (data != null)
            loading_scene = data.scenename;
        cc.director.loadScene(loading_scene, function () {
            if (cc.sys.isMobile) {
                if (pre_scene_dir != load_scene_dir) {
                    cc.loader.releaseResDir(pre_scene_dir);
                    cc.log("释放资源:" + pre_scene_dir);
                }
                cc.log("执行GC");
                cc.sys.garbageCollect();
            }
        });

    },
});
