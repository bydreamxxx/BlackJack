const hall_common_data = require('hall_common_data').HallCommonData;
const hall_prop_data = require('hall_prop_data').HallPropData;
const Hall = require('jlmj_halldata');
var FortuneHallManager = require('FortuneHallManager').Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');
var hall_prefab = require('hall_prefab_cfg');
var AppCfg = require('AppConfig');
// const ClubUserEd = require('club_user_data').ClubUserEd;
// const ClubUserEvent = require('club_user_data').ClubUserEvent;
const Bsc = require('bsc_data');
const YYL_GAMEID = 100000;
const LONGHU_GAMEID = 100001;
/******************************************快乐吧独有的协议**********************************************/
const hall_rooms_data = require('klb_hall_RoomData').HallRoomsData.instance();
/******************************************快乐吧独有的协议end**********************************************/
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var com_replay_data = require('com_replay_data').REPLAY_DATA;
var Platform = require('Platform');
var _storagePath = null;

var hanlder = {
    /**
     * 获取hall_common_data数据实例
     * @private
     */
    _getHallCommonData: function () {
        return hall_common_data.getInstance();
    },
    /**
     * 获取hall_prop_data数据实例
     * @private
     */
    _getHallPropData: function () {
        return hall_prop_data.getInstance();
    },

    headerHandle: function (msg) {
        //无header,直接返回
        if (cc.dd._.isUndefined(msg.header)) {
            return true;
        }
        if (msg.header.code != 0) {
            dd.NetWaitUtil.close();
            dd.DialogBoxUtil.show(0, msg.header.error, '确定');
            return false;
        }
        return true;
    },

    on_cm_hearbeat: function (msg) {

    },

    /**
     * 打印服务器返回数据
     * @param key
     * @param data
     * @private
     */
    _debugInfo: function (key, data) {
        cc.log('gate_net::', key, ':【', JSON.stringify(data), '】');
    },


    /**
     * 登陆返回
     * @param data
     */
    on_hall_userData: function (msg) {
        if (msg.headUrl && msg.headUrl.lastIndexOf('/') != -1) {
            msg.headUrl = msg.headUrl.substring(0, msg.headUrl.lastIndexOf('/') + 1) + "64";
        }
        hall_common_data.getInstance().setMsgData(msg);
        Hall.HallED.notifyEvent(Hall.HallEvent.GET_USERINFO);

        let GVoice_acc = require("AppConfig").GVOICE_ACC;
        cc.dd.native_gvoice.login(GVoice_acc.game_id, GVoice_acc.KEY, GVoice_acc.server_info, cc.dd.user.id);
        if (cc._isHuaweiGame)
            cc.dd.native_wx.checkHwIapOrder();
    },

    /**
     * 服务器关闭
     * @param msg
     */
    on_net_down_reason: function (msg) {
        cc.gateNet.Instance().onKick(msg.code);
    },

    /**
     * 网络状况  4个心跳包收到个数
     */
    on_msg_hearbeat_num: function (msg) {
        var data = { userId: msg.userId, isWeak: msg.num < 3, cnt: msg.num };
        RoomED.notifyEvent(RoomEvent.player_signal_state, [data]);
        // if (msg.num >= 3) {
        //     if (!require('jlmj_room_mgr').RoomMgr.Instance().isMJ())
        //         require('jlmj_net_handler_roomMgr').on_msg_update_room_role_state({ userId: msg.userId, state: 1 });
        // }
    },

    /**
     * 获取游戏服务器信息
     * @param data
     */
    onGetGameInfo: function (msg) {
        // if (msg.code != 0) {
        //     ClubUserEd.notifyEvent(ClubUserEvent.ENTER_GAME_FAILED);
        // }
        if (this.headerHandle(msg)) {
            Hall.HallED.notifyEvent(Hall.HallEvent.CREATE_ROOM_URL, { ip: msg.ip, port: msg.port, token: msg.token, gameId: msg.gameType });
        }
    },

    /**ø
     * 获取加入房间游戏服务器信息
     * @param data
     */
    onGetJionGameinfo: function (msg) {
        if (this.headerHandle(msg)) {
            Hall.HallED.notifyEvent(Hall.HallEvent.JOIN_ROOM_URL, { ip: msg.ip, port: msg.port, token: msg.token, gameId: msg.gameType })
        }
    },

    /**
     *  是否需要断线重联进入游戏
     * @param data
     */
    onReconnectGame: function (msg) {
        if (this.headerHandle(msg)) {
            if (cc.dd._.isUndefined(msg.gameId)) {
                if (cc.director.getScene().name != AppCfg.HALL_NAME && cc.director.getScene().name != 'club') {
                    dd.DialogBoxUtil.show(1, "当前房间不存在,请返回大厅", "确定", null,
                        function () {
                            cc.dd.SceneManager.replaceScene("jlmj_hall");
                        }.bind(this), null);
                    return;
                }
            }
            if (msg.gameId) {
                //清除比赛场数据
                Bsc.BSC_Data.Instance().clearData();
                Hall.HallED.notifyEvent(Hall.HallEvent.RECNNECT_GAME, { ip: msg.ip, port: msg.port, token: msg.token, gameId: msg.gameId, roomType: msg.roomType });
            } else {
                cc.dd.NetWaitUtil.close();
                if (cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_JIESAN)) {
                    cc.dd.SceneManager.replaceScene("jlmj_hall");
                }
            }
        }
    },
    /**
     * 大厅房间数据拉取
     */
    on_hall_ack_new_room_list: function (msg) {
        if (cc._appstore_check && cc.game_pid == 3) {
            msg.roomlistList.splice(1, msg.roomlistList.length - 1);
        }
        else if (cc._androidstore_check) {
            msg.roomlistList.splice(1, msg.roomlistList.length - 1);
        }
        hall_rooms_data.initRoomList(msg);
    },

    /**
     * 规则消息通用返回
     */
    on_p17_ack_desk_rule: function (msg) {

    },

    /**
     * 默认滚动消息
     */
    on_hall_ack_config_broadcast: function (msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.Get_PaoMaDeng_Default_Marquee, msg);
        cc.dd.NetWaitUtil.net_wait_end('sendDefaultBroadcastInfo');
    },

    /**
     * 滚动消息
     */
    on_broadcast: function (msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.Get_PaoMaDeng_Marquee, msg);
        if (msg.type == 1)
            Hall.HallED.notifyEvent(Hall.HallEvent.Get_ShuiHu_Marquee, msg);
    },

    /**
     * 公告消息返回
     */
    on_hall_ack_config_notice: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('hall_req_config_notice');

        this._getHallCommonData().setNotice(msg.noticeListList);
        Hall.HallED.notifyEvent(Hall.HallEvent.Get_Notice_Config_LIST, msg.noticeListList);
        Hall.HallED.notifyEvent(Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM_AND_NOTICE);
    },

    /**
     * 实名认证消息返回
     */
    on_bind_idcard_ack: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('shimingBtnCallBack');
        if (msg.header.code == 0) {
            this._getHallCommonData().realNameAuthen();
        } else {
            cc.dd.PromptBoxUtil.show(msg.header.error);
        }

        cc.dd.NetWaitUtil.close();
    },

    /**
     * 绑定手机消息返回
     */
    on_bind_mobilephone_ack: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('bindBtnCallBack');

        cc.dd.NetWaitUtil.close();
        var str = ''
        if (msg.header.code == 0) {
            str = '手机绑定成功';
            this._getHallCommonData().bindTelNum();
        } else {
            if (msg.header.code == 8)
                this._getHallCommonData().unbindTel();
            str = msg.header.error;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    /**
     * 获取严重码消息返回
     */
    on_get_mobile_code_bind_ack: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('getPhoneCode');

        if (msg.header.code != 0) {
            cc.dd.PromptBoxUtil.show(msg.header.error);
            this._getHallCommonData().getCodeFailed();
        }
        else {
            cc.dd.PromptBoxUtil.show('验证码发送成功');
            this._getHallCommonData().getCodeSuccess();
        }

    },
    /**
     * 跑马灯 喇叭消息
     */
    onMarquee: function (msg) {
        if (this.headerHandle(msg)) {
            this._debugInfo('onMarquee::跑马灯', msg);
            //this._getHallCommonData().onMarquee(msg);
            Hall.HallED.notifyEvent(Hall.HallEvent.Get_PaoMaDeng_Marquee, msg);
        }

    },

    /**
     * 更新道具
     * @param data
     */
    onUpdataProp: function (msg) {
        if (!this.headerHandle(msg)) return;
        this._getHallPropData().updateProp(msg.item, true);
    },

    /**
     * 实名认证
     * @param msg
     */
    onBindIDCard: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }

        this._getHallCommonData().realNameAuthen();
        dd.NetWaitUtil.close();
    },

    onCloseByServer: function (msg) {
        this.onKick(msg.code);
    },

    /**
     * 背包物品列表返回
     * @param msg
     */
    onBagItems: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        this._debugInfo('onUserData::收到个人道具信息', msg);
        this._getHallPropData().initData(msg.itemsList);
    },

    /**
     * 房间列表返回
     * @param data
     */
    onNewRoomList: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        hall_rooms_data.initRoomList(msg);
    },

    /**
     * 游戏公告返回
     * @param msg
     */
    onNoticeConfig: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        Hall.HallED.notifyEvent(Hall.HallEvent.Get_Notice_Config_LIST, msg.noticeListList);
    },

    /**
     * 购买商品返回
     * @param msg
     */
    onGoodsBuy: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }

        this._debugInfo('onGoodsBuy::收到购买商品消息', msg);
        this._getHallCommonData().onShopSuccess();
    },

    /**
     * 游戏战绩返回
     * @param msg
     */
    onGameBattleHistory: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        Hall.HallED.notifyEvent(Hall.HallEvent.GET_Battle_History_LIST, msg.detailList);
    },
    /**
     * 每场的中每局的详细信息
     */
    onGameBattleRecord: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        Hall.HallED.notifyEvent(Hall.HallEvent.GET_Battle_Record, msg.detailList);
    },

    /**
     * @param msg
     */
    on_hall_ack_config_gm: function (msg) {
        if (cc._isKuaiLeBaTianDaKeng) {
            msg = { gmListList: [{ title: '游戏客服微信1', content: 'yanshuxi1991' }, { title: '游戏客服微信2', content: 'klbyx001' }] };
        }
        Hall.HallED.notifyEvent(Hall.HallEvent.Get_GM_Config_Info, msg);
        cc.dd.NetWaitUtil.net_wait_end('getKefuDetailInfo');
    },

    /**
     * @param msg
     */
    onBroadcastConfig: function (msg) {
        if (this.headerHandle(msg)) {
            this._debugInfo('onDefaultMarquee::跑马灯默认消息', msg);
            //this._getHallCommonData().onDefaultMarquee(msg);
            Hall.HallED.notifyEvent(Hall.HallEvent.Get_PaoMaDeng_Default_Marquee, msg);

        }
    },

    /**
     * 七天签到
     */
    on_get_msg_seven_day_reward_ret: function (msg) {
        Hall.HallData.Instance().sign_data = msg;
        Hall.HallData.Instance().isSigned = true;
        var sign_data = Hall.HallData.Instance().sign_data.rewardListList;
        let signedDays = 0;
        sign_data.forEach(item => {
            if (item.state == 0) {
                Hall.HallData.Instance().isSigned = false;
            } else {
                signedDays++;
            }
        });

        if (signedDays >= 7) {
            Hall.HallData.Instance().sign_data = null;
        }

        Hall.HallED.notifyEvent(Hall.HallEvent.SHOW_DAILY_SIGN);

        // if (cc.director.getScene().name == "kuaileba_hall") {
        //     var sign_data = msg.rewardListList;
        //     sign_data.forEach(item => {
        //         if (item.state == 0) {
        //             cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SIGN, function (node) {
        //                 node.getComponent('klb_hall_weekSign').init(msg);
        //             });
        //         }
        //     });
        // }
    },

    /**
     * 签到成功
     */
    on_draw_seven_day_reward_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('draw_seven_day_reward_req');

        if (msg.retCode == 0) {
            for (var i = 0; i < Hall.HallData.Instance().sign_data.rewardListList.length; i++) {
                if (Hall.HallData.Instance().sign_data.rewardListList[i].index == msg.index) {
                    Hall.HallData.Instance().sign_data.rewardListList[i].state = 2;
                    cc.dd.shareAgainIndex = msg.index;
                    cc.dd.RewardWndUtil.show([{ id: Hall.HallData.Instance().sign_data.rewardListList[i].itemId, num: Hall.HallData.Instance().sign_data.rewardListList[i].num }], !cc._isHuaweiGame);

                    Hall.HallData.Instance().sign_data = null;
                    break;
                }
            }
            var sign = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY);
            if (sign) {
                var node = cc.dd.Utils.seekNodeByName(sign, "klb_hall_daily_active_QD");
                node.getComponent('klb_hall_daily_sign').done(msg.index);
                cc.dd.PromptBoxUtil.show('领取成功!');
                Hall.HallED.notifyEvent(Hall.HallEvent.DAILYSIGN_END);
            } else {
                var node = cc.dd.UIMgr.getUI('blackjack_hall/prefabs/blackjack/hall/BlackJack_Hall_DailySign');
                node.getComponent('BlackJack_Hall_Daily_Sign').done(msg.index);
                cc.dd.PromptBoxUtil.show('领取成功!');
                Hall.HallED.notifyEvent(Hall.HallEvent.DAILYSIGN_END);
            }
        }
        else if (msg.retCode == 3) {
            cc.dd.PromptBoxUtil.show('房间中有操作不可领取!');
        }
    },

    on_draw_share_seven_day_reward_ret(msg) {
        if (msg.retCode == 0) {// 0.分享领取成功 1.分享天数对不上 2.已领取过分享奖励 3.还没领取过就分享领奖
            for (var i = 0; i < Hall.HallData.Instance().sign_data.rewardListList.length; i++) {
                if (Hall.HallData.Instance().sign_data.rewardListList[i].index == msg.index) {
                    Hall.HallData.Instance().sign_data.rewardListList[i].state = 2;
                    cc.dd.shareAgainIndex = msg.index;
                    cc.dd.RewardWndUtil.show([{ id: Hall.HallData.Instance().sign_data.rewardListList[i].itemId, num: Hall.HallData.Instance().sign_data.rewardListList[i].num }]);
                    break;
                }
            }
        }
    },

    /**
     * 更新游戏id
     */
    on_msg_player_property_update: function (msg) {
        switch (msg.type) {
            case 1:
                hall_common_data.getInstance().gameId = msg.value;
                if (msg.value == 0) {
                    cc.dd.DialogBoxUtil.waitGameEndFinished();
                }
                else {
                    cc._wait_end_quickenter = false;
                }
                break;
            case 1015:
                Hall.HallED.notifyEvent(Hall.HallEvent.ACTIVE_PROPITEM_GET, msg);
                break;
            case 10:
                if (cc.game_pid == 10008) {
                    cc._chifengLucky = msg.value == 1;
                    Hall.HallED.notifyEvent(Hall.HallEvent.CHIFENG_LUCKY);
                }
                break;
            default:

                break;
        }
    },

    /**
     * 使用道具消息返回
     */
    on_msg_use_bag_item_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_use_bag_item_req');

        if (msg.retCode == 0) {
            Hall.HallED.notifyEvent(Hall.HallEvent.Use_Item_Ret, msg);
        } else {
            switch (msg.retCode) {
                case 1:
                    cc.dd.PromptBoxUtil.show('类型错误');
                    break;
                case 2:
                    cc.dd.PromptBoxUtil.show('物品数量不足');
                    break;
                default:
                    break;
            }
        }

    },

    /**
     * 历史兑换码消息
     */
    on_msg_open_code_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('onOpenHistoryUI');

        if (msg.type == 2)
            Hall.HallED.notifyEvent(Hall.HallEvent.Exchange_Code_History, msg);
        else
            Hall.HallED.notifyEvent(Hall.HallEvent.Exchange_Code_List, msg);
    },

    /**
     * 获取已领取红包人数
     */
    on_msg_get_bouns_num_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('onExchangeCash');
        Hall.HallED.notifyEvent(Hall.HallEvent.Get_Bouns_Num, msg);
    },

    //玩家/世界变量
    //变量类型，  0:未初始化;    1:玩家变量； 2：世界变量
    on_msg_variant_data_set_2c: function (msg) {
        if (1 == msg.variantType) {
            for (var i = 0; i < msg.infoListList.length; i++) {
                var info = msg.infoListList[i];
                hall_common_data.getInstance().playerVariant[info.index] = info.value
            }
        }
    },

    /**
     * 战绩返回
     */
    on_get_battle_history_ack: function (msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.GET_Battle_History_LIST, msg.detailList);
        cc.dd.NetWaitUtil.net_wait_end('sendBattleHistory');
    },

    /**
     * 战绩每场具体消息返回
     */
    on_get_battle_record_ack: function (msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.GET_Battle_Record, msg.detail);
        cc.dd.NetWaitUtil.net_wait_end('sendBattleRecordDetail');

        var historyId = msg.detail.historyId;
        com_replay_data.Instance().totalRound = msg.detail.round;
        var round = cc._check_curRound || 1;
        com_replay_data.Instance().getRecordHttpReq(null, historyId, round);
    },

    /**
     * 隐藏网关
     */
    on_hall_change_gateout: function (msg) {
        var level = msg.level;
        var ip = msg.ip;
        var port = msg.port;
        var url = 'ws://' + ip + ':' + port;
        if (level > 0) {
            cc.gateNet.Instance().connectVip(url, true);
        }
        else {
            cc.gateNet.Instance().connectVip(url, false);
        }
    },

    //更新未读邮件数量
    on_hall_mail_unread_num: function (msg) {
        this._getHallCommonData().unread_mail_num = msg.num;
        Hall.HallED.notifyEvent(Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM, msg.num);
    },

    on_hall_mail_list_ack: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('getNoticeInfo');
        Hall.HallED.notifyEvent(Hall.HallEvent.MAIL_LIST_ACK, msg);
    },

    on_hall_read_mail_ack: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('onView');
        Hall.HallED.notifyEvent(Hall.HallEvent.READ_MAIL_ACK, msg);
    },

    on_hall_draw_mail_ack: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('onReward');
        Hall.HallED.notifyEvent(Hall.HallEvent.DRAW_MAIL_ACK, msg);
    },

    on_msg_match_tips_ack: function (msg) {
        var text = '您报名的 ' + msg.matchName + ' 还有5分钟开赛!'
        cc.dd.DialogBoxUtil.show(0, text, '我知道了', null, function () { }, function () { });
    },

    on_hall_ack_task(msg) {
        cc.dd.NetWaitUtil.net_wait_end('hall_task');
        cc._taskDataList = msg.tasklistList;
        Hall.HallED.notifyEvent(Hall.HallEvent.TASK_INFO, msg);
    },

    on_hall_update_task(msg) {
        if (msg.task.status == 2 && !cc.dd.UIMgr.getUI('BlackJack_Hall_Task') && !cc._chifengGame && !cc._isHuaweiGame && !cc._isBaiDuPingTaiGame)
            cc.dd.PromptBoxUtil.show('有任务已完成，请前往领取奖励哦~');
        if (cc._taskDataList) {
            for (var i = 0; i < cc._taskDataList.length; i++) {
                if (cc._taskDataList[i].taskId == msg.task.taskId) {
                    cc._taskDataList[i] = msg.task;
                    break;
                }
            }
        }
        Hall.HallED.notifyEvent(Hall.HallEvent.TASK_UPDATE, msg);
    },

    on_hall_ack_draw_task(msg) {
        switch (msg.retCode) {
            case 0:
                for (var i = 0; i < msg.itemListList.length; i++) {
                    msg.itemListList[i].id = msg.itemListList[i].itemDataId;
                }
                cc.dd.RewardWndUtil.show(msg.itemListList);
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('您已经领取过这个奖励了！');
                break;
            case 2:
                cc.dd.PromptBoxUtil.show('任务未完成！');
                break;
            case 3:
                cc.dd.PromptBoxUtil.show('任务不存在！');
                break;
        }
    },

    on_msg_user_invite_info_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('hall_invite');
        Hall.HallED.notifyEvent(Hall.HallEvent.INVITE_INFO, msg);
    },

    on_msg_get_user_invite_page_ret(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_get_user_invite_page_req');
        Hall.HallED.notifyEvent(Hall.HallEvent.UPDATE_INVITE_INFO, msg);
    },

    /////////////////////////////////////////国庆活动消息处理begin//////////////////////////////////////////////////////////
    // //服务器主动推送活动是否开启
    // on_is_open_activity_collect: function(msg){
    //     Hall.HallED.notifyEvent(Hall.HallEvent.NATIONAL_ACTIVE_IS_OPEN, msg);
    // },

    //活动数据服务器主动推送返回
    on_get_activity_collect_list_ack: function (msg) {
        Hall.HallData.Instance().setNationalDayActivityData(msg.listList[0]);
        Hall.HallED.notifyEvent(Hall.HallEvent.NATIONAL_ACTIVE_IS_OPEN);
    },

    //活动获得新的翻牌次数
    on_activity_collect_add_draw_times: function (msg) {
        Hall.HallData.Instance().addNationalDayActivityTimes(msg.times);
        Hall.HallED.notifyEvent(Hall.HallEvent.NATION_ACTIVE_LEFTTIME);
        if (Hall.HallData.Instance().BAA_Game) {
            Hall.HallData.Instance().TIMES = msg.times;
        } else
            cc.dd.PromptBoxUtil.show('恭喜您获得翻翻乐翻牌次数+' + msg.times);
    },


    //翻牌子消息返回
    on_activity_collect_draw_ack: function (msg) {
        if (msg.retCode == 1) {
            cc.dd.PromptBoxUtil.show('翻牌条件不足');
            return;
        } else if (msg.retCode == 2) {
            cc.dd.PromptBoxUtil.show('活动已经结束，谢谢您的参与');
            return;
        }
        Hall.HallData.Instance().updateNationalDayActivityWordData(msg.word);
        Hall.HallData.Instance().updateNationalDayActivityTimes(msg.leftCollectTimes);
        Hall.HallData.Instance().updateNationalDayActivityBoxList(msg.canOpenBoxPosListList);
        Hall.HallED.notifyEvent(Hall.HallEvent.NATIONAL_ACTIVE_DRAW, msg.word.wordIndex);
    },

    //开箱子消息返回
    on_activity_collect_open_box_ack: function (msg) {
        if (msg.retCode == 1) {
            cc.dd.PromptBoxUtil.show('开宝箱条件不足');
            return;
        } else if (msg.retCode == 2) {
            cc.dd.PromptBoxUtil.show('活动已经结束，谢谢您的参与');
            return;
        }
        Hall.HallData.Instance().deleteNationalDayActivityOpenedBox(msg.pos);
        Hall.HallData.Instance().updateNationalDayActiveOpendBoxList(msg.pos);
        Hall.HallED.notifyEvent(Hall.HallEvent.NATIONAL_AVTIVE_OPEN_BOX, msg.rewardList);
    },

    on_msg_invite_task_info(msg) {
        cc._inviteTaskOpen = msg.isOpen;
        cc._inviteTaskRole = msg.isInvitee;
        cc._inviteTaskFinish = msg.isFinishInviteTask;
        cc._inviteTaskActiveNum = msg.inviteActiveNum;
        Hall.HallED.notifyEvent(Hall.HallEvent.UIDATE_FXYL_UI);
        Hall.HallED.notifyEvent(Hall.HallEvent.UPDATE_FXYL, null);
    },

    on_msg_item_use_broadcast_ret(msg) {
        switch (msg.retCode) {
            case 0:
                cc.dd.PromptBoxUtil.show('发送成功');
                cc._sendmail_cache = null;
                cc.dd.UIMgr.destroyUI('blackjack_hall/prefabs/klb_hall_mail_send');
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('道具数量不足，请前往商城购买');
                break;
            case 2:
                cc.dd.PromptBoxUtil.show('单日使用已达上限，请明日再试');
                break;
        }
    },

    on_hall_query_bind_ret(msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.BIND_AGGENT_QUERY_DATA, msg);
    },
    on_hall_bind_agent_ret(msg) {
        switch (msg.retCode) {
            case 0:
                cc.dd.PromptBoxUtil.show('绑定成功');
                cc.dd.UIMgr.destroyUI('blackjack_hall/prefabs/klb_hall_bind_aggent');
                break;
            case 1:
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_33);
                break;
            case 2:
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_34);
                break;
        }
    },
    /////////////////////////////////////////国庆活动消息处理end///////////////////////////////////////////////////////////

    /**
     * 绑定手机消息返回
     */
    on_msg_bind_account_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('bindBtnCallBack');

        cc.dd.NetWaitUtil.close();
        var str = ''

        switch (msg.retCode) {
            case 0:
                str = '绑定成功';
                this._getHallCommonData().bindTelNum();
                break;
            case 1:
                str = '验证码错误';
                break;
            case 2:
                str = '暂无响应';
                break;
            case 3:
                str = '手机号已被绑定';
                break;
            case 4:
                str = '重复绑定账号';
                break;
            case 5:
                str = '账号密码不匹配';
                break;
            case -1:
                str = '解绑成功';
                this._getHallCommonData().unbindTel();
                break;
            case -2:
                str = '未绑定账号';
                break;
            case -3:
                str = '验证码错误';
                break;
            case -4:
                str = '输入手机号与绑定手机号不匹配';
                break;
            case -5:
                str = '账号注册的玩家不可解绑';
                break;
            case -6:
                str = '解绑验证码错误';
                break;
        }

        cc.dd.PromptBoxUtil.show(str);
    },

    /**
     * 改名
     * @param msg
     */
    on_msg_modify_name_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('changeName');

        var str = ''

        switch (msg.retCode) {
            case 0:
                str = '修改成功';
                this._getHallCommonData().nick = msg.newName;
                this._getHallCommonData().changeNameCount++;
                this._getHallCommonData().updateNick();
                break;
            case 1:
                str = '微信注册账号不可修改昵称';
                break;
            case 2:
                str = '名字重复';
                break;
            case 3:
                str = '名字不规范';
                break;
            case 4:
                str = '改名卡不足';
                break;
        }

        cc.dd.PromptBoxUtil.show(str);
    },

    on_modify_user_base_info_ack: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('changeSex');
        if (msg.header.code == 0) {
            this._getHallCommonData().updateSex(true);
        } else {
            cc.dd.PromptBoxUtil.show(msg.header.error);
            this._getHallCommonData().updateSex(false);
        }

        cc.dd.NetWaitUtil.close();
    },

    on_msg_modify_head_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('changeHead');

        switch (msg.retCode) {
            case 0:
                cc.dd.PromptBoxUtil.show('更换头像成功');
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('获取头像地址失败');
                break;
        }
        cc.dd.NetWaitUtil.close();
    },

    ///////////////////////////////////////////////飞禽，PK，西游游戏记录消息返回点Begin////////////////////////////////////////////
    on_msg_get_excite_game_record_ret: function (msg) {
        if (msg.retCode == 0) {//有数据
            Hall.HallED.notifyEvent(Hall.HallEvent.PLAYER_OP_RECORD, msg);
        } else if (msg.retCode == 1) {//没有数据
            Hall.HallED.notifyEvent(Hall.HallEvent.PLAYER_OP_RECORD_NULL);
        } else if (msg.retCode == 2) {//数据到底
        }
    },
    ///////////////////////////////////////////////飞禽，PK，西游游戏记录消息返回点End////////////////////////////////////////////




    on_msg_notify_client_log: function (msg) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            cc.log(cc.dd.user.id + "自动拉取日志");

            if (!_storagePath)
                _storagePath = jsb.reflection.callStaticMethod("game/SystemTool", "getInnerSDCardPath", "()Ljava/lang/String;");
            var filePath = _storagePath + "/xlqp_log.txt";
            if (jsb.fileUtils.isFileExist(filePath)) {
                cc.dd.SysTools.uploadLog(jsb.fileUtils.getDataFromFile(filePath), Platform.uploadLogUrl[AppCfg.PID]);
            }
        }
    },

    //摇钱树
    on_client_tree_info_ack: function (msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.MONEY_TREE, msg);
    },

    on_client_tree_ack: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('get_money_tree');
        Hall.HallED.notifyEvent(Hall.HallEvent.GET_MONEY_TREE, msg);
    },

    //抽礼券活动 开启关闭
    on_get_activity_fish_gift_notify(msg) {
        // { listList: [{ id: 1, beginTime: 1628611200, endTime: 1645113600, state: 1 }] }
        if (msg.listList) {
            this._getHallCommonData().fishActivityState = msg.listList[0].state
            Hall.HallED.notifyEvent(Hall.HallEvent.FISH_ACTIVITY, msg);
        }
    },
    // 微信客服
    on_msg_fish_wx(msg) {
        this._getHallCommonData().wx = msg.wx
    },

    //抽礼券活动 变更
    on_msg_activity_fish_gift_notify(msg) {
        this._getHallCommonData().fishActivityState = msg.state
        // { activityId: 1, state: 2 }
        Hall.HallED.notifyEvent(Hall.HallEvent.FISH_ACTIVITY, msg);
    },

    on_hall_fish_gift_notice: function (msg) {//捕鱼达人得到新的礼包
        this._getHallCommonData().fishGiftLevel = msg.id;
        this._getHallCommonData().fishGiftBetNum = msg.num;
        Hall.HallED.notifyEvent(Hall.HallEvent.FISH_GIFT, msg);
        // if (msg.id > 1) {
        Hall.HallED.notifyEvent(Hall.HallEvent.AUTO_GIFT, msg);
        // }
    },

    on_hall_ack_fish_gift: function (msg) {//领取礼券返回
        switch (msg.retCode) {
            case 0:
                // cc.dd.PromptBoxUtil.show('领取成功');
                this._getHallCommonData().fishGiftNum = msg.giftNum;
                this._getHallCommonData().fishGiftBetNum = msg.num;
                this._getHallCommonData().fishGiftLevel = msg.id;
                Hall.HallED.notifyEvent(Hall.HallEvent.AUTO_GIFT, msg);
                Hall.HallED.notifyEvent(Hall.HallEvent.FISH_GIFT, msg);
                Hall.HallED.notifyEvent(Hall.HallEvent.SHOW_GIFT_ANIM, { type: 6, count: msg.count });
                break;
            case 1:
                // cc.dd.PromptBoxUtil.show('所需炮弹数不够');
                break;
            case 2:
                cc.dd.PromptBoxUtil.show('已经领取过');
                break;
            case 3:
                cc.dd.PromptBoxUtil.show('活动已关闭');
                break;
        }
    },
    on_hall_ack_fish_gift_exchange: function (msg) {//优惠券兑换物品
        switch (msg.retCode) {
            case 0:
                // if (msg.type != 1) {
                //     cc.dd.PromptBoxUtil.show('兑换成功');
                // }
                this._getHallCommonData().fishGiftNum = msg.num;
                this._getHallCommonData().curUseFishGiftCnt = msg.curUseCnt;
                Hall.HallED.notifyEvent(Hall.HallEvent.UPDATE_GIFT, { type: msg.type });
                Hall.HallED.notifyEvent(Hall.HallEvent.FISH_GIFT, msg);
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('礼券数量不足');
                break;
            case 2:
                cc.dd.PromptBoxUtil.show('未绑定手机或者实名');
                break;
            case 3:
                cc.dd.PromptBoxUtil.show('活动已关闭');
                break;
            case 4:
                cc.dd.PromptBoxUtil.show('今日兑换次数不足');
                break;
        }
    },
    on_hall_ack_log_gift_exchange: function (msg) {//兑换记录
        Hall.HallED.notifyEvent(Hall.HallEvent.LOG_GIFT, msg);
    },



};

module.exports = hanlder;