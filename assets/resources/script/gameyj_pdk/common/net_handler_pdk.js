const PDK_ED = require('pdk_data').PDK_ED;
const PDK_Event = require('pdk_data').PDK_Event;
const PDK_Data = require('pdk_data').PDK_Data;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

module.exports = {


    //房间信息
    on_pdk_room_info: function (msg) {
        PDK_Data.Instance().deskInfo = msg.deskInfo;
        // if (msg.deskInfo.gameType != 33) {//朋友场玩家数据已存在
        //     PDK_Data.Instance().playerInfo = msg.playerInfoList.sort(function (a, b) { return a.site - b.site });
        // }
        PDK_Data.Instance().initGamePlayerData(msg.playerInfoList);
        PDK_Data.Instance().curRound = msg.curRound;
        PDK_ED.notifyEvent(PDK_Event.INIT_ROOM, null);
    },

    //更新状态
    on_pdk_update_desk_status: function (msg) {
        PDK_Data.Instance().deskStatus = msg.deskStatus;
        PDK_Data.Instance().curPlayer = msg.curPlayer;
        PDK_ED.notifyEvent(PDK_Event.UPDATE_STATUS, msg);
    },

    //发牌
    on_pdk_hand_poker_list: function (msg) {
        
        PDK_ED.notifyEvent(PDK_Event.HAND_POKER, msg);
    },


    //出牌返回
    on_pdk_play_poker_ack: function (msg) {
       
        cc.dd.NetWaitUtil.net_wait_end('pdk_sendcard');
        PDK_ED.notifyEvent(PDK_Event.PLAY_POKER, msg);
    },

    //托管返回
    on_pdk_player_auto_ack: function (msg) {
       
        PDK_ED.notifyEvent(PDK_Event.AUTO_RET, msg);
    },

    //单局结算
    on_pdk_play_result: function (msg) {
       
        PDK_ED.notifyEvent(PDK_Event.RESULT_RET, msg);
        if (PDK_Data.Instance().isSceneChangeing) {
            PDK_Data.Instance().reconnectResult = msg;
        }
    },

    //重连
    on_pdk_reconnect_room_info: function (msg) {
        PDK_Data.Instance().deskInfo = msg.deskInfo;
        PDK_Data.Instance().initGamePlayerData(msg.playerInfoList);
        var game_type = msg.deskInfo.gameType;
        var sceneName = '';
        if (game_type == 29) {//朋友场
            sceneName = 'pdk_pyc';
        }
        //数据同步
        if (game_type == 29) {
            RoomMgr.Instance().setGameCommonInfo(msg.deskInfo.gameType, msg.deskInfo.password, msg.deskInfo.ownerId, msg.deskInfo.clubId);
            RoomMgr.Instance()._Rule = msg.deskInfo.deskRule;
            PDK_Data.Instance().requesYuYinUserData();
        }
        if (cc.director.getScene().name != sceneName) {
            PDK_Data.Instance().isSceneChangeing = true;
            if (sceneName == cc.dd.SceneManager.replaceName) {
                cc.dd.SceneManager.endcallEx = function () {
                    PDK_Data.Instance().isSceneChangeing = false;
                    PDK_ED.notifyEvent(PDK_Event.RECONNECT, msg);
                }
            }
            else {
                cc.dd.SceneManager.replaceScene(sceneName, null, null, function () {
                    PDK_Data.Instance().isSceneChangeing = false;
                    PDK_ED.notifyEvent(PDK_Event.RECONNECT, msg);
                });
            }
        }
        else {
            PDK_ED.notifyEvent(PDK_Event.RECONNECT, msg);
        }
    },



    //离线
    on_pdk_player_offline_ack: function (msg) {
        //TODO:pdkdata 
        PDK_ED.notifyEvent(PDK_Event.PLAYER_OFFLINE, msg);
    },


    //战绩统计
    on_pdk_last_info: function (msg) {
      
        PDK_ED.notifyEvent(PDK_Event.ZHANJI, msg);
        if (PDK_Data.Instance().isSceneChangeing) {
            PDK_Data.Instance().reconnectZhanji = msg;
        }
    },

    //解散返回
    on_room_dissolve_agree_ack: function (msg) {
        
        PDK_ED.notifyEvent(PDK_Event.DISSOLVE, msg);
    },

    //解散结果
    on_room_dissolve_agree_result: function (msg) {
       
        PDK_ED.notifyEvent(PDK_Event.DISSOLVE_RESULT, msg);
    },


    //朋友场继续
    on_room_prepare_ack: function (msg) {
       
        PDK_ED.notifyEvent(PDK_Event.PYC_NEXT, msg);
    },


    on_msg_room_update_score(msg) {
        var userId = msg.userId;
        var curScore = msg.curScore;
        var player = PDK_Data.Instance().getPlayer(userId);
        if (player) {
            var changeScore = curScore - player.score;
            player.score = curScore;
        }
    },
}