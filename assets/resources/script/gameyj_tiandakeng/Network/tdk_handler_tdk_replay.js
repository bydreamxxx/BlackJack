var TdkOperationData = require('tdk_operation_data').TdkOperationData;
var cDeskData = require('tdk_coin_desk_data').TdkCDeskData;
var CPlayerData = require('tdk_coin_player_data').TdkCPlayerMgrData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var operationData = TdkOperationData;

var handler = {
    /**
     * 加入桌子消息返回
     */
    on_TdkJoinPlayingDeskRsp: function (msg) {
        cc.log('回放接收协议');
        cDeskData.Instance().Huifang = true;
        cDeskData.Instance().setRoomData(msg.roomtype, msg.configRoomId);
    cDeskData.Instance().setCurrentJuShu(msg.roomnum);
        for (var i = 0; i < msg.userdataList.length; ++i) {
            var player = msg.userdataList[i];
            if (player) {
                for (var j = player.hidelistList.length -1 ; j >= 0 ; --j) {
                    var hide = player.hidelistList[j];
                    if (hide)
                        player.pokerlistList.unshift(hide);
                }
                player.hidelistList = [];
            }
        }
        cDeskData.Instance().setMsgData(msg);
        if (msg.actuserid != 0) {
            var data = {
                userid: msg.actuserid,
                deskstatus: msg.deskstatus,
                type: 0,
            }
            operationData.Instance().setCoinMsgData(data);
        }
        CPlayerData.Instance().setMsgData(msg,true);
    },


    /**
     * 下注消息返回
     */
    on_TdkCBetRsp: function (msg) {
        operationData.Instance().setCoinMsgData(msg);
    },
    /**
     * 发牌消息
     */
    on_TdkCSendPoker: function (msg) {
        if (!RoomMgr.Instance()._Rule) return;
        cDeskData.Instance().setDeskState(2);
        cDeskData.Instance().setCurrentJuShu(msg.roomnum);
        CPlayerData.Instance().sendPoker(msg);
        if (msg.selflistList.length == 0) {
            var data = {
                userid: msg.nextuserid,
                deskstatus: msg.deskstatus,
                type: 0,
            }
            operationData.Instance().setCoinMsgData(data);

        }
    },

    /**
     * 游戏内准备
     */
    on_room_prepare_ack: function (msg) {
        CPlayerData.Instance().playerReady(msg.userId);
    },

    /**
     * 总结算
     */
    on_TdkFinalResult: function (msg) {
        CPlayerData.Instance().FinalResult(msg);
    },

    /**
     * 解散申请返回
     */
    on_room_dissolve_agree_ack: function (msg) {
        CPlayerData.Instance().DissLove(msg);
    },

    /**
     * 解散结果
     */
    on_room_dissolve_agree_result: function (msg) {
        CPlayerData.Instance().DissoLveResult(msg);
    },

    /**
     * 是否出现倒计时ture： show / false: hide
     */
    on_TdkCDeskState: function (msg) {
        if (msg.ready) {
            operationData.Instance().showCutDown();
        } else {
            operationData.Instance().StopCutDown();
        }
    },

    /**
     * 金币场开牌消息返回
     */
    on_TdkCOpenPoker: function (msg) {
        CPlayerData.Instance().setHidePoker(msg);
    },

    /**
     * 金币场单轮游戏结束
     */
    on_TdkCRoundEnd: function (msg) {
        operationData.Instance().setCRoundEndMsgData(msg);
    },

    /**
     * 托管协议返回
     */
    on_TdkTuoGuanRsp: function (msg) {
        CPlayerData.Instance().setTuoGuanData(msg);
    }

};
module.exports = handler;