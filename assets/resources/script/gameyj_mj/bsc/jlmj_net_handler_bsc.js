/**
 * Created by Mac_Li on 2017/10/27.
 */
/**
 * 处理比赛场中 新增网络问题
 */
const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_data = require('bsc_data').BSC_Data;
// var DeskData = require('jlmj_desk_data').DeskData;


module.exports = {

    headerHandle: function (msg) {
        //无header,直接返回
        if (cc.dd._.isUndefined(msg.header)) {
            return true;
        }
        if (msg.header.code != 0) {
            //todo:增加通用错误处理回调
            //cc.error(msg.header.error + " code = " + msg.header.code);
            cc.dd.PromptBoxUtil.show(msg.header.error);
            return false;
        }
        return true;
    },

    // /**
    //  * 游戏开局
    //  */
    // onGameOpen:function (data) {
    //     jlmj_net.Instance().onGameOpen(data);//网络处理
    //     Bsc_ED.notifyEvent(Bsc_Event.UPDATE_CURR_ROUND);
    // },
    // /**
    //  * 更新玩家状态
    //  */
    // onUpdatePlayerStatus:function (data) {
    //     cc.log('玩家状态发送改变...');
    // },

    on_msg_match_list_ack: function (msg) {
        if (this.headerHandle(msg)) {
            Bsc_data.Instance().setActivList(msg);
        }
    },

    on_msg_match_sign_ack: function (msg) {
        if (this.headerHandle(msg)) {
            Bsc_data.Instance().baomingSucess(msg.matchId);
        }
    },

    on_msg_match_unsign_ack: function (msg) {
        cc.dd.PromptBoxUtil.show(msg.header.error);
        if (msg.header.code == 0) {
            Bsc_data.Instance().tuisaiSucess(msg.matchId);
        }
    },

    on_msg_get_match_signed_num_ack: function (msg) {
        if (this.headerHandle(msg)) {
            Bsc_data.Instance().changNum(msg.num);
        }
    },

    on_msg_update_match_num: function (msg) {
        if (this.headerHandle(msg)) {
            Bsc_data.Instance().updateNum(msg);
        }
    },
    /**
     * 每轮开始广播
     */
    on_msg_challenge_round: function (msg) {
        if (this.headerHandle(msg)) {
            Bsc_data.Instance().setBscStart(msg);
        }
    },

    /**
     * 等待晋级
      */
    on_msg_challenge_wait: function (msg) {
        if (this.headerHandle(msg)) {
            Bsc_ED.notifyEvent(Bsc_Event.BSC_WAITE, msg);
        }
    },

    /**
     * 比赛结果
     */
    on_msg_challenge_result: function (msg) {
        if (this.headerHandle(msg)) {
            // DeskData.Instance().isGameEnd = true;//游戏结束
            Bsc_ED.notifyEvent(Bsc_Event.BSC_END, msg);
        }
    },

    /**
     * 更新免费次数
     */
    on_msg_update_match_free_times: function (msg) {
        Bsc_data.Instance().updateMatchFreeNum(msg.matchId, msg.usedFreeSignTimes);
    },

    // /**
    //  * 是否能进入比赛场景
    //  */
    // onEnterBsScene:function (msg) {
    //     if(this.headerHandle(msg)){
    //         DeskData.Instance().isGameEnd = true;//游戏结束
    //         Bsc_ED.notifyEvent(Bsc_Event.BSC_END, msg);
    //     }
    // },

    on_msg_update_match_state: function (msg) {
        Bsc_data.Instance().updateMatchState(msg.matchId, msg.matchState);
    },

    on_msg_coin_room_drop_reward(msg){
        Bsc_ED.notifyEvent(Bsc_Event.Drop_Reward, msg);
    },

    on_msg_match_info_ret(msg){
        Bsc_ED.notifyEvent(Bsc_Event.BSC_UPDATE_DETAIL, msg);
    },
};
