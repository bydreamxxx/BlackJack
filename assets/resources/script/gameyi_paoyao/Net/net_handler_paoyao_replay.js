
var py_data = require("paoyao_data").PaoYao_Data;
const PY_ED = require('paoyao_data').PY_ED;
const PY_Event = require('paoyao_data').PY_Event;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

module.exports = {
    /**
     * 刨幺桌子结构
     */
    on_py_desk: function (msg) {
        if (msg == null)
            return;
        py_data.getInstance().SetDeskData(msg);
        PY_ED.notifyEvent(PY_Event.RECONNECT, msg);
        // if (msg.isReconnect) {
        //     var sceneName = '';
        //     if (msg.gameType == 60) //朋友
        //     {
        //         sceneName = 'py_game_pyc';
        //     } else if (msg.gameType == 61) //金币
        //     {
        //         sceneName = 'py_game_jbc';
        //     }

        //     if (msg.gameType == 60) {
        //         py_data.getInstance().requesYuYinUserData();
        //     }
        //     if (cc.director.getScene().name != sceneName) {
        //         if (sceneName == cc.dd.SceneManager.replaceName) {
        //             cc.dd.SceneManager.endcallEx = function () {
        //                 PY_ED.notifyEvent(PY_Event.RECONNECT, msg);
        //             }
        //         }
        //         else {
        //             cc.dd.SceneManager.replaceScene(sceneName, null, null, function () {
        //                 PY_ED.notifyEvent(PY_Event.RECONNECT, msg);
        //             });
        //         }
        //     } else
        //         PY_ED.notifyEvent(PY_Event.RECONNECT, msg);
        // } else if (msg.gameType == 60)
        //     PY_ED.notifyEvent(PY_Event.INIT_ROOM);
    },

    /**
     * 发牌
     */
    on_msg_paoyao_send_poker: function (msg) {
        if (msg == null)
            return;
        py_data.getInstance().SetsendPoker(msg);
        PY_ED.notifyEvent(PY_Event.HAND_POKER, msg.listList);
    },

    /**
     * 选幺返回
     */
    on_msg_paoyao_yao_ack: function (msg) {
        PY_ED.notifyEvent(PY_Event.CHOOSE_YAO, msg);
    },

    /**
     * 选幺结束
     */
    on_msg_paoyao_yao_notify: function (msg) {
        PY_ED.notifyEvent(PY_Event.CHOOSE_YAOEND, msg);
    },
    /**
     * 操作返回
     */
    on_msg_paoyao_act_ack: function (msg) {
        //cc.dd.NetWaitUtil.net_wait_end('网络状况不佳...', 'msg_paoyao_act_req');
        PY_ED.notifyEvent(PY_Event.PLAY_POKER, msg);
    },

    /**
     * 队伍积分改变
     */
    on_msg_paoyao_score_change: function (msg) {
        if (msg)
            py_data.getInstance().updeleTeamInfo(msg.teamId, msg.score);
    },

    /**˝
     * 桌面积分改变
     */
    on_msg_paoyao_dscore_change: function (msg) {
        PY_ED.notifyEvent(PY_Event.UPDELE_SCORE, msg);
    },

    /**
     * 请求雪返回
     */
    on_msg_paoyao_xue_ack: function (msg) {
        PY_ED.notifyEvent(PY_Event.XUE_CALLBACK, msg);
    },

    /**
     * 通知雪
     */
    on_msg_paoyao_xue_notify: function (msg) {
        PY_ED.notifyEvent(PY_Event.PLAY_XUE, msg);
    },

    /**
     * 桌子状态发生改变
     */
    on_msg_state_change: function (msg) {
        PY_ED.notifyEvent(PY_Event.CHANGE_DESK, msg);
    },

    /**
     * 通知其他人的牌
     */
    on_msg_paoyao_other_poker: function (msg) {
        PY_ED.notifyEvent(PY_Event.OTHER_POKER, msg);
    },

    /**
     * 托管
     */
    on_msg_paoyao_tuoguan_change: function (msg) {
        PY_ED.notifyEvent(PY_Event.COLLOCATION, msg);
    },

    /**
     * 准备返回
     */
    on_msg_paoyao_ready_ack: function (msg) {
        PY_ED.notifyEvent(PY_Event.READY_REQ, msg);
    },

    /**
     * 玩家幺改变
     */
    on_msg_paoyao_yao_change: function (msg) {
        PY_ED.notifyEvent(PY_Event.CHANGE_YAO, msg);
    },

    /**
     * 小结算
     */
    on_msg_paoyao_result: function (msg) {
        if (!msg) return;
        py_data.getInstance().setPlayerScore(msg.resultList);
        PY_ED.notifyEvent(PY_Event.RESULT_RET, msg);
    },

    /**
     * 总结算
     */
    on_msg_paoyao_final_result: function (msg) {
        PY_ED.notifyEvent(PY_Event.TOTAL_RESULT, msg);
    },

    /**
     * 喊话
     */
    on_msg_paoyao_chat_ack: function (msg) {
        PY_ED.notifyEvent(PY_Event.CHAR_REQ, msg);
    },

    //解散返回
    on_room_dissolve_agree_ack: function (msg) {
        PY_ED.notifyEvent(PY_Event.DISSOLVE, msg);
    },

    //解散结果
    on_room_dissolve_agree_result: function (msg) {
        PY_ED.notifyEvent(PY_Event.DISSOLVE_RESULT, msg);
    },
}