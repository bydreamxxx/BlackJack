//create by wj 2018/06/12
var gslotManger = require('SlotManger').SlotManger.Instance();
const Hall = require('jlmj_halldata');
var handler = {
    //进入老虎机消息返回
    on_msg_slot_enter_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_slot_enter_2s');

        if (msg.retCode != 0) {
            var str = '';
            if (msg.retCode == 1)
                str = '金币不足，不能进入游戏';
            else if (msg.retCode == 2)
                str = '其他游戏中，不能进入游戏';
            else if (msg.retCode == 3)
                str = cc.dd.Text.TEXT_POPUP_17;
            else if (msg.retCode == 10)
                str = '已报名活动赛，退赛可参加其他游戏';
            cc.dd.PromptBoxUtil.show(str);
            return;
        }
        gslotManger.on_msg_slot_room_info_2c(msg, false);
    },

    //老虎机下注返回
    on_msg_slot_bet_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_slot_bet_2s');

        if (msg.retCode != 0) {
            var str = '';
            if (msg.retCode == 1)
                str = '配置错误';
            else if (msg.retCode == 2)
                str = '参数错误';
            else if (msg.retCode == 3)
                str = '金币不足';
            else if (msg.retCode == 4)
                str = cc.dd.Text.TEXT_POPUP_17;
            cc.dd.PromptBoxUtil.show(str);
            return;
        }
        gslotManger.on_msg_slot_bet_2c(msg);
    },

    //老虎机断线重连
    on_msg_slot_reconnect: function (msg) {
        gslotManger.on_msg_slot_room_info_2c(msg, true);
        gslotManger.setReconnect(true);
    },

    //断线重连小游戏请求返回
    on_msg_slot_reconnect_2c: function (msg) {
        gslotManger.on_msg_slot_reconnect_2c(msg);
    },

    //退出老虎机
    on_msg_slot_quit_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_slot_quit_2s');

        if (msg.retCode == 0)
            gslotManger.on_msg_slot_quit_2c();
    },

    //老虎机收分返回
    on_msg_slot_get_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_slot_get_2s');

        gslotManger.on_msg_slot_get_2c(msg);
    },

    //水浒老虎小游戏数据返回
    on_msg_slot_mini_game_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_slot_mini_game_2s');

        gslotManger.getTinyGameData().on_msg_slot_mini_game_2c(msg);
    },

    //比倍小游戏类型返回
    on_msg_slot_choice_comapre_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_slot_choice_comapre_2s');
        if (msg.retCode != 0) {
            var str = '';
            if (msg.retCode == 1)
                str = '不能进行比倍';
            else if (msg.retCode == 2)
                str = '未达到比倍条件';
            else if (msg.retCode == 3)
                str = '金币不足';
            cc.dd.PromptBoxUtil.show(str);
            return;
        }
        gslotManger.getTinyGameData().on_msg_slot_choice_comapre_2c(msg);
    },

    //比倍小游戏返回
    on_msg_slot_compare_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_slot_compare_2s');
        if (msg.retCode != 0) {
            var str = '';
            if (msg.retCode == 1)
                str = '不能进行比倍';
            else if (msg.retCode == 2)
                str = '未达到比倍条件';
            else if (msg.retCode == 3)
                str = '金币不足';
            cc.dd.PromptBoxUtil.show(str);
            return;
        }
        gslotManger.getTinyGameData().on_msg_slot_compare_2c(msg);
    },

    //列表返回
    on_msg_slot_op_2c: function (msg) {
        gslotManger.on_msg_slot_op_2c(msg);
        cc.dd.NetWaitUtil.net_wait_end('msg_slot_op_2s');
    },

    //在线人数更新
    on_msg_slot_update: function (msg) {
        gslotManger.on_msg_slot_update(msg);
    },

    /**
     * 推广领豪礼 start
     */
    on_get_activity_spread_notify: function (msg) {
        if (!msg.listList.length)
            return
        let params = msg.listList[0]
        let count = params.userInfoList.reduce((cur, item) => {
            cur += item.count
            return cur
        }, 0);
        Hall.HallData.Instance().activitySpread = params;
        Hall.HallData.Instance().activitySpread.count = count;

        Hall.HallED.notifyEvent(Hall.HallEvent.SPREAD_ACTIVITY_OPEN);
    },


    on_msg_activity_spread_swap_ret: function (msg) {
        if (msg.state != 0) {
            var str = '';
            if (msg.state == 1)
                str = '没有达到领取条件';
            else if (msg.state == 2)
                str = '活动关闭';
            else if (msg.state == 3)
                str = '奖励不存在';
            cc.dd.PromptBoxUtil.show(str);
            return;
        }
        let userInfoList = Hall.HallData.Instance().activitySpread.userInfoList
        for (let i = 0; i < userInfoList.length; i++) {
            if (msg.type == userInfoList[i].type) {
                userInfoList[i].count -= 1
                if (Hall.HallData.Instance().activitySpread.count > 0) {
                    Hall.HallData.Instance().activitySpread.count -= 1;
                }
                break
            }
        }
        cc.dd.RewardWndUtil.show([{ id: 1001, num: msg.gold }], false);
        Hall.HallED.notifyEvent(Hall.HallEvent.SHOW_ACTIVE_SPREAD);
    },

    on_msg_activity_spread_award_notify: function (msg) {
        let userInfoList = Hall.HallData.Instance().activitySpread.userInfoList
        let obj = userInfoList.find(item => item.type == msg.type)
        if (obj) {
            obj.count = msg.count
        } else {
            userInfoList.push(msg)
        }
        let count = userInfoList.reduce((cur, item) => {
            cur += item.count
            return cur
        }, 0);
        Hall.HallData.Instance().activitySpread.count = count;

        Hall.HallED.notifyEvent(Hall.HallEvent.SHOW_ACTIVE_SPREAD);
    },


    /**
     * 推广领豪礼 end
     */





    ///////////////////////////////////////////////////////财神老虎机begin//////////////////////////////////////////
    on_msg_slot_mammon_open_box_2c: function (msg) {//点击开箱子返回
        if (msg.retCode != 0)
            return;
        gslotManger.getTinyGameData().on_msg_slot_mammon_open_box_2c(msg);
    },

    on_msg_slot_mammon_reconnet_2c: function (msg) {//小游戏断线重连
        gslotManger.getTinyGameData().on_msg_slot_mammon_reconnet_2c(msg);
    },

    ///////////////////////////////////////////////////////财神老虎机end//////////////////////////////////////////

    /*****************************************************兑奖活动start**********************************************/
    on_get_cash_activity_ret(msg) {
        Hall.HallData.Instance().duijiangActiveIsOpen = (msg.listList && msg.listList.length > 0);
        Hall.HallED.notifyEvent(Hall.HallEvent.DUIJIANG_ACTIVITY_INFO, msg);
    },

    on_msg_day_cash_activity_reward_history_ret(msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.DUIJIANG_REWARD_HISTORY, msg);
    },

    on_msg_cash_activity_reward_history_ret(msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.DUIJIANG_MY_HISTORY, msg);
    },

    on_msg_cash_activity_state(msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.DUIJIANG_STATE, msg);
    },

    on_msg_get_user_activity_cash_code_ret(msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.DUIJIANG_GET_CODE, msg);
    },

    on_msg_cash_activity_open_tips(msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.DUIJIANG_OPEN_TIPS, msg);
    },

    on_msg_cash_activity_open_result_ret(msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.DUIJIANG_OPEN_RESULT, msg);
    },
    /*****************************************************兑奖活动end**********************************************/

};
module.exports = handler;

