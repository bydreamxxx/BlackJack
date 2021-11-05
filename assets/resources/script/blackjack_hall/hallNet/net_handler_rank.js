const Hall = require('jlmj_halldata');
const hall_common_data = require('hall_common_data').HallCommonData;
const hall_prop_data = require('hall_prop_data').HallPropData;
var HallTask = require('hall_task').Task;
var HallVip = require('hall_vip').VipData;
var shop_data = require('hall_shop').shopData;
var shopEd = require('hall_shop').shopED;
var shopEvent = require('hall_shop').shopEvent;
var data_vip = require('vip');

var hanlder = {
    on_msg_rank_get_rank_list_2c: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        for (var i = 0; i < msg.ranksList.length; i++) {
            if (msg.ranksList[i].headurl.lastIndexOf('/') != -1) {
                msg.ranksList[i].headurl = msg.ranksList[i].headurl.substring(0, msg.ranksList[i].headurl.lastIndexOf('/') + 1) + "64";
            }
        }
        Hall.HallED.notifyEvent(Hall.HallEvent.Rank_Info, msg);
        cc.dd.NetWaitUtil.net_wait_end('onClickOpenActiveRank');
    },

    headerHandle: function (msg) {
        //无header,直接返回
        if (cc.dd._.isUndefined(msg.header)) {
            return true;
        }
        if (msg.header.code != 0) {
            cc.error(msg.header.error + " code = " + msg.header.code);
            return false;
        }
        return true;
    },

    /**
     * 获取hall_prop_data数据实例
     * @private
     */
    _getHallPropData: function () {
        return hall_prop_data.getInstance();
    },

    /**
     * 玩家vip级别变化
     * @param msg
     */
    on_msg_update_vip_level_2s: function (msg) {
        hall_common_data.getInstance().update_vip(msg);
    },

    /**
     * 玩家级别变化
     * @param msg
     */
    on_msg_update_player_level_2s: function (msg) {
        hall_common_data.getInstance().update_player(msg);
    },

    /**
     * 领取救济金
     * @param msg
     */
    on_msg_relief_gift_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('onLingQu');

        if (msg.retcode == 1) {
            //领取成功
            // cc.dd.PromptBoxUtil.show('领取成功!');

            var viplevel = hall_common_data.getInstance().vipLevel;
            var jiuji_item = data_vip.getItem(function (item) {
                return item.key == viplevel;
            });
            var data = jiuji_item.relief_coe.split(",");
            var jiuji_num = data[0];
            //cc.shareFromJiuji = true;
            cc.dd.RewardWndUtil.show([{ id: 1001, num: jiuji_num }]);
            hall_common_data.getInstance().des_jiuji_cnt();
        } else if (msg.retcode == 0) {
            //领取次数不够
            cc.dd.PromptBoxUtil.show('今天的领取次数用完了!');
        } else if (msg.retcode == -1) {
            //领取失败
            cc.dd.PromptBoxUtil.show('您身上的金币大于2000,不能领取!');
        }
    },

    /**
     * 领取救济金剩余次数
     * @param msg
     */
    on_msg_remain_relief_gift_cnt_2c: function (msg) {
        hall_common_data.getInstance().update_jiuji_cnt(msg);
    },

    /**
     * 当前任务列表
     * @param msg
     */
    on_msg_accept_task_2c: function (msg) {
        HallTask.Instance().task_list = msg.taskList;
        HallTask.Instance().task_level = msg.taskLevel;
    },


    /**
     * 提交任务
     * @param msg
     */
    on_msg_submit_task_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_submit_task_2s');
        if (msg.retCode == 1) {
            cc.dd.PromptBoxUtil.show('任务提交完成，奖励已发放!');
            HallTask.Instance().taskFinish(msg.taskId);
        }
    },

    /**
     * 任务进度变化
     * @param msg
     */
    on_msg_task_progress_change_2c: function (msg) {
        HallTask.Instance().taskChange(msg.taskId, msg.progressList);
    },

    /**
     * 触发任务
     */
    on_msg_trigger_level_task_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_trigger_level_task_2s');
        if (msg.retCode != 0) {
            cc.dd.PromptBoxUtil.show('荣誉等级不足，请努力升级!');
        } else {
            HallTask.Instance().setTaskLevel(msg.level);
            HallTask.Instance().task_list = msg.taskList;
        }
    },

    //轮盘
    on_msg_luck_draw_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('onClickStart');
        HallTask.Instance().getLotteryReward(msg);
    },

    on_msg_online_luck_draw_2c: function (msg) {
        HallTask.Instance().setLotteryHistory(msg);
    },

    on_msg_online_luck_draw_cnt_2c: function (msg) {
        HallTask.Instance().setLotteryTimes(msg);
    },

    on_msg_add_new_luck_draw_2c: function (msg) {
        HallTask.Instance().updateLotteryHistory(msg);
    },

    //vip

    on_msg_vip_open_2c: function (msg) {
        HallVip.Instance().onGetVipGiftInfo(msg);
    },

    // on_msg_update_vip_level_2s:function(msg){
    //     HallVip.Instance().updateUserVipData(msg);
    // },

    on_msg_vip_buy_2c: function (msg) {
        HallVip.Instance().updateVipGiftInfo(msg);
    },

    on_msg_vip_draw_2c: function (msg) {
        switch (msg.retCode) {
            case 0:
                cc.dd.PromptBoxUtil.show('lingquchenggong');
                HallVip.Instance().updateVipGiftInfo(msg);
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('领取失败，VIP等级不够');
                break;
            case 2:
                cc.dd.PromptBoxUtil.show('领取失败，奖励已经领取过');
                break;
        }
    },

    on_msg_vip_draw_onekey_2c: function (msg) {
        switch (msg.retCode) {
            case 0:
                cc.dd.PromptBoxUtil.show('lingquchenggong');

                let list = {}
                for(let i = 0; i < msg.rewardListList.length; i++){
                    let item = msg.rewardListList[i];
                    if(!list.hasOwnProperty(item.itemId)){
                        list[item.itemId] = item.itemNum;
                    }else{
                        list[item.itemId] += item.itemNum;
                    }
                }
                let showList = [];
                for(let k in list){
                    if(list.hasOwnProperty(k)){
                        showList.push({id: parseInt(k), num: list[k]});
                    }
                }
                cc.dd.RewardWndUtil.show(showList);

                HallVip.Instance().updateVipGiftAll();
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('领取失败，奖励已经领取过');
                break;
        }
    },

    on_msg_vip_ext_open_2c: function (msg) {
        HallVip.Instance().updateMaxVipGiftInfo(msg);
    },
    /**
     * 接收背包数据
     */
    on_msg_online_item_list_2c: function (msg) {
        this._getHallPropData().initData(msg.listList);
    },


    /**
     * 新增物品
     */
    on_msg_add_new_item_2c: function (msg) {
        this._getHallPropData().updateProp(msg.item, true);
    },

    /**
     * 更新背包
     */
    on_msg_update_item_2c: function (msg) {
        this._getHallPropData().updateProp(msg, true);
    },

    /**
     * 玩家资产变化
     */
    on_msg_update_money_2c: function (msg) {
        this._getHallPropData().updateAssets(msg);
    },

    /**
     * 接收服务器器商场数据消息
     */
    on_config_shop_login_notify: function (msg) {
        shop_data.Instance().initData(msg.shoplistList);
        Hall.HallData.Instance().setActiveTag(msg.activityShop);
        shopEd.notifyEvent(shopEvent.REFRESH_DATA);
        if (msg.activityShop == 1)
            Hall.HallED.notifyEvent(Hall.HallEvent.ACTIVE_BEGIN);
    },

    /**
     * 购买商品价格验证请求
     */
    on_msg_shop_goods_amount_ask: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('onExchangeGiftBg');
        if (msg.code != 1) {
            var str = '';
            switch (msg.code) {
                case 2:
                    str = '商品找不到';
                    break;
                case 3:
                    str = '请使用人民币购买';
                    break;
                case 4:
                    str = '消耗道具不足';
                    break;
                case 5:
                    str = '系统错误';
                    break;
                case 6:
                    str = '消耗物品使用失败';
                    break;
                case 7:
                    str = '系统错误';
                    break;
                case 8:
                    str = '物品发放失败';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);
            return;
        }
        shop_data.Instance().openShopBuy();
    },

    on_msg_shop_buy_ask: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('changeProp');

        if (msg.code != 1) {
            var str = '';
            switch (msg.code) {
                case 2:
                    str = '商品找不到';
                    break;
                case 3:
                    str = '请使用人民币购买';
                    break;
                case 4:
                    str = '兑换失败，金币不足';
                    break;
                case 5:
                    str = '系统错误';
                    break;
                case 6:
                    str = '消耗物品使用失败';
                    break;
                case 7:
                    str = '系统错误';
                    break;
                case 8:
                    str = '物品发放失败';
                    break;
                case 9:
                    str = '游戏房间内禁止此操作';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);
        } else {
            cc.dd.PromptBoxUtil.show('兑换成功');
        }
    },

    //更新vip经验，笔误，s->c
    on_config_giftsbag_login_notify: function () {

    },

    //兑换消息返回
    on_msg_trade_shop_exchange_ask: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_trade_shop_exchange_req');

        var str = '';
        switch (msg.code) {
            case 1:
                str = '兑换请求提交成功，请耐心等待回复';
                break;
            case 2:
                str = '商品已下架，请更新商城后再尝试';
                break;
            case 3:
                str = '道具不足，兑换物品失败';
                break;
            case 4:
                str = '服务器数值错误，请耐心等待修复';
                break;
            case 5:
                str = '元宝扣除失败，不能兑换物品';
                break;
            case 6:
                str = '配置错误';
                break;
            case 7:
                str = '兑换记录错误';
                break;
            case 8:
                str = '库存不足，请等待管理员添加';
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    //商品 兑换记录
    on_msg_trade_shop_exchange_record_ask: function (msg) {
        shopEd.notifyEvent(shopEvent.SHOP_EXCHANGE_RECORD, msg);
        cc.dd.NetWaitUtil.net_wait_end('onClickExchangeRecord');
    },

    //游戏活动开始/结束标记
    on_msg_activity_state: function (msg) {
        Hall.HallData.Instance().setActiveTag(msg.state);
        if (msg.state == 2)
            Hall.HallED.notifyEvent(Hall.HallEvent.ACTIVE_END, msg.activityId);
    },

    //活动列表
    on_msg_activity_info: function (msg) {
        Hall.HallData.Instance().setActivetyList(msg.activityList);
        Hall.HallED.notifyEvent(Hall.HallEvent.ACTIVE_LIST_UPDATE, msg);
    },

    //七天乐活动消息
    on_msg_seven_happy: function (msg) {
        Hall.HallData.Instance().setSevenDayActivityData(msg);
    },

    //七天乐领取消息
    on_msg_get_seven_happy_ret: function (msg) {
        if (msg.retCode == 0) {
            Hall.HallData.Instance().updateSevenDayDataByDay(msg.index);
            Hall.HallED.notifyEvent(Hall.HallEvent.ACTIVE_SEVEN_DAY_AWARD, msg);
            cc.dd.NetWaitUtil.net_wait_end('onClickGetAward');
        } else {
            var str = '';
            switch (msg.retCode) {
                case 1:
                    str = '活动不存在';
                    break;
                case 2:
                    str = '领取不成功';
                    break;
                case 3:
                    str = '活动未开启';
                    break;
                case 4:
                    str = '手机未绑定';
                    break;
                default:
                    break;
                    cc.dd.PromptBoxUtil.show(str);

            }
        }

    },
    //刷新某个功能
    on_msg_refresh_function: function (msg) {
        switch (msg.functionId) {
            case 1://比赛有更新
                var Bsc = require('bsc_data');
                Bsc.BSC_Data.Instance().clearData();
                Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.BSC_MATCH_UPDATA, null);
                break;
            case 2://跑马灯更新
                var bagItem = new cc.pb.hall.hall_req_config_broadcast();
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_config_broadcast, bagItem,
                    '发送协议[cmd_hall_req_config_broadcast][默认跑马灯信息]', true);
                break;
        }
    },

    //分享奖励
    on_msg_share_friend_2c: function (msg) {
        cc.OnWxShareFunc = null;
        if (msg.retCode == 0) {
            cc.dd.PromptBoxUtil.show('lingquchenggong');
        }
    },

    on_msg_update_memory_card_info: function (msg) {
        hall_common_data.getInstance().updateMemoryCard(msg);
    },

    //分享再领救济金
    on_msg_share_relief_gift_2c:function(msg){
        if (msg.retcode == 1) {
            //领取成功
            // cc.dd.PromptBoxUtil.show('领取成功!');

            var viplevel = hall_common_data.getInstance().vipLevel;
            var jiuji_item = data_vip.getItem(function (item) {
                return item.key == viplevel;
            });
            var data = jiuji_item.relief_coe.split(",");
            var jiuji_num = data[0];
            cc.shareFromJiuji = false;
            cc.dd.RewardWndUtil.show([{ id: 1001, num: jiuji_num }]);
        }
    },

    //每日分享
    on_msg_day_share_reward_2c:function(msg){
        if(msg.retcode == 1){
            let list = [];
            msg.rewardList.forEach((item)=>{
                list.push({id: item.itemDataId, num:item.cnt});
            })
            cc.dd.RewardWndUtil.show(list);
        }else{
            if(cc._isHuaweiGame){
                cc.dd.PromptBoxUtil.show('今天已经领过啦，请明天再来吧');
            }
        }
    },

    //排行榜活动
    on_get_rank_activity_ret: function (msg) {
        Hall.HallData.Instance().setRankActivityInfoList(msg.listList);
        Hall.HallED.notifyEvent(Hall.HallEvent.RANK_ACTIVITY_INFO);
        cc.dd.NetWaitUtil.net_wait_end('onClickChongBang');
    },
    //排行榜活动状态
    on_msg_rank_activity_state: function (msg) {
        Hall.HallData.Instance().setRankActivityState(msg.activityId, msg.state);
        Hall.HallED.notifyEvent(Hall.HallEvent.RANK_ACTIVITY_STATE);
    },
    //获取排行榜活动收货地址
    on_get_receiving_address_ret: function (msg) {
        Hall.HallData.Instance().setRankAddress(msg);
        Hall.HallED.notifyEvent(Hall.HallEvent.RANK_ACTIVITY_ADDRESS);
        cc.dd.NetWaitUtil.net_wait_end('get_receiving_address_req');
    },
    //提交排行榜活动收货地址
    on_modify_receiving_address_ret: function (msg) {
        if(msg.retCode == 0){
            cc.dd.PromptBoxUtil.show('信息提交成功');
        }else{
            cc.dd.PromptBoxUtil.show('信息提交失败');
        }
        cc.dd.NetWaitUtil.net_wait_end('modify_receiving_address_req');
    },
    /*****************************************************财神到活动begin********************************************/
    on_get_lucky_activity_ret: function (msg) {
        Hall.HallData.Instance().setDrawLotterykActivityInfoList(msg.listList);
        Hall.HallED.notifyEvent(Hall.HallEvent.DRAWLOTTERY_ACTIVITY_INFO);
        cc.dd.NetWaitUtil.net_wait_end('onClickDrawLottery');
    },
    on_msg_lucky_activity_state: function (msg) {
        Hall.HallData.Instance().setDrawLotterykActivityState(msg.activityId, msg.state);
        Hall.HallED.notifyEvent(Hall.HallEvent.DRAWLOTTERY_ACTIVITY_STATE);
    },
    on_msg_lucky_activity_draw_ret: function (msg) {
        switch(msg.retCode){
            case 0:
                Hall.HallED.notifyEvent(Hall.HallEvent.DRAWLOTTERY_ACTIVITY_SUBMIT, msg);
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('积分不足');
                break;
            case 2:
                cc.dd.PromptBoxUtil.show('活动不存在或未开启');
                break;
        }

        cc.dd.NetWaitUtil.net_wait_end('onClickSubmit');
    },
    on_msg_lucky_activity_draw_history_ret: function (msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.DRAWLOTTERY_ACTIVITY_RECORD, msg);
        cc.dd.NetWaitUtil.net_wait_end('onClickRecord');
    },
    /*****************************************************财神到活动end**********************************************/
};

module.exports = hanlder;
