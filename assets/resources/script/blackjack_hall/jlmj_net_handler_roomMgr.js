var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var PlayerBaseInfoMgr = require('hall_common_data').PlayerBaseInfoMgr.getInstance();
const Hall = require('jlmj_halldata');
var define = require('Define');
var AppConfig = require('AppConfig');
let club_sender = require('jlmj_net_msg_sender_club');
let clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var hall_prefab = require('hall_prefab_cfg');
var hallData = require('hall_common_data').HallCommonData;

var handler = {
    /**
     * 创建房间通用消息返回
     */
    on_msg_create_game_ret: function (msg) {
        if (msg.retCode == 0) {
            //聊天大厅
            let clubID = clubMgr.getSelectClubId()
            if (cc.dd._.isNumber(clubID) && clubID != 0) {
                club_sender.enterChatClub(clubID, 2);
                club_sender.enterChatClub(clubID, 3);
            }

            if (msg.gameInfo.clubCreateType == 2) {//代开房间
                var scp = cc.find('Canvas').getComponentInChildren('klb_hall_CreateRoom');
                if (scp) {
                    scp.onCloseCreateRoomUI();
                }
                cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_proxy_room', function (node) {
                    node.getComponent('hall_proxy_room').setData(msg);
                });
            }
            else {
                cc.JOIN_FRIEND_AND_PLAY = null;

                PlayerBaseInfoMgr.addPlayerInfo(msg.roleInfo);
                RoomMgr.Instance().clearClubId();
                RoomMgr.Instance().setGameCommonInfo(msg.gameInfo.gameType, msg.gameInfo.roomId, msg.gameInfo.userId, msg.gameInfo.clubId, 1, msg.gameInfo.multiple);
                RoomMgr.Instance().setPYGameNetHandler(msg.gameInfo.gameType);

                //if (!RoomMgr.Instance().isClubRoom()) {
                RoomMgr.Instance().setGameRuleByType(msg);
                RoomMgr.Instance().setPlayerMgr(msg);
                RoomMgr.Instance().setDaiKai(msg.gameInfo.clubCreateType);

                if (RoomMgr.Instance().player_mgr) {
                    RoomMgr.Instance().player_mgr.updatePlayerNum();
                    RoomMgr.Instance().player_mgr.playerEnter(msg.roleInfo);
                    RoomMgr.Instance().player_mgr.requesYuYinUserData();
                }
                cc.dd.SceneManager.enterGame(msg.gameInfo.gameType);
                // } else {
                //     //todo 俱乐部创建房间
                // }
                RoomED.notifyEvent(RoomEvent.on_room_create, [msg]);
            }
        } else {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_1;
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_2;
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_3;
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_4;
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_5;
                    break;
                case 6:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_12;
                    break;
                case 7:
                    if (cc._chifengGame) {
                        str = '权限不足，不能创建房间';
                    } else {
                        str = '金币不足，不能创建房间';
                    }
                    break;
                case 8:
                    str = '包厢不存在，请重新进入亲友圈刷新';
                    break;
                case 10:
                    str = '已报名活动赛，退赛可参加其他游戏';
                    break;
                case 11:
                    str = '当前桌子已经创建了游戏，请刷新桌子';
                    break;
                case 12:
                    str = '当前亲友圈已打烊，不能创建游戏';
                    break;
                case 13:
                    str = '非群主不能创建代开房间';
                    break;
                default:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_10;
                    break;
            }
            cc.dd.DialogBoxUtil.show(0, str, 'text33', null, () => {
                if (cc.JOIN_FRIEND_AND_PLAY) {
                    switch (msg.retCode) {
                        case 6:
                            cc.JOIN_FRIEND_AND_PLAY = null;
                            break;
                        case 11:
                            cc.JOIN_FRIEND_AND_PLAY.reEnter();
                            break;
                        default:
                            cc.JOIN_FRIEND_AND_PLAY.failedCall();
                            break;
                    }
                }
            });
        }
    },

    /**
     * 加入房间通用协议返回
     */
    on_msg_enter_game_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_enter_game_req');

        if (cc.find('Marquee') == null) {
            var pref = cc.resources.get('blackjack_common/prefab/Marquee', cc.Prefab);
            var Marquee = cc.instantiate(pref);
            cc.director.getScene().addChild(Marquee);
            cc.game.addPersistRootNode(Marquee);
        }
        // if (cc.find('klb_friend_group_redbag') == null) {
        //     var pref = cc.resources.get('blackjack_common/prefab/klb_friend_group_redbag', cc.Prefab);
        //     var fg_redBag = cc.instantiate(pref);
        //     cc.director.getScene().addChild(fg_redBag);
        //     cc.game.addPersistRootNode(fg_redBag);
        // }
        // if (cc.find('klb_friend_group_invite_answer') == null) {
        //     var pref = cc.resources.get('blackjack_common/prefab/klb_friend_group_invite_answer', cc.Prefab);
        //     var fg_redBag = cc.instantiate(pref);
        //     cc.director.getScene().addChild(fg_redBag);
        //     cc.game.addPersistRootNode(fg_redBag);
        // }

        if (msg.retCode == 0) {
            if (!this.checkDLGame(msg))
                return;
            //设置房间管理器数据(原先逻辑在这个函数里在这里在这里)
            this.setRoomMgrData(msg);
        } else if (msg.retCode == 7) { //加入旁观者游戏
            RoomMgr.Instance().setOnlookersGame(msg.gameInfo.gameType, msg.gameInfo.roomId);
        } else {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_6;
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_7;
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_12;
                    break;
                case 5:
                    str = '积分不足';
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_14;
                    break;
                case 6:
                    str = '您当前不是亲友圈成员，不能直接进入房间\n是否加入' + msg.gameInfo.clubId + '亲友圈？';
                    cc.dd.DialogBoxUtil.show(0, str, '申请加入', 'Cancel', () => {
                        club_sender.joinClubReq(msg.gameInfo.clubId);
                        if (cc.JOIN_FRIEND_AND_PLAY) {
                            cc.JOIN_FRIEND_AND_PLAY.failedCall();
                        }
                    }, () => {
                        if (cc.JOIN_FRIEND_AND_PLAY) {
                            cc.JOIN_FRIEND_AND_PLAY.failedCall();
                        }
                    });
                    return;
                case 8:
                    str = '金币不足不能加入房间';
                    break;
                case 10:
                    str = '已报名活动赛，退赛可参加其他游戏';
                    break;
                case 11:
                    str = '不能加入不同渠道的房间';
                    break;
                default:
                    break;
            }
            cc.dd.DialogBoxUtil.show(0, str, 'text33', null, () => {
                if (cc.JOIN_FRIEND_AND_PLAY) {
                    switch (msg.retCode) {
                        case 1:
                        case 2:
                        case 4:
                            cc.JOIN_FRIEND_AND_PLAY.reEnter();
                            break;
                        case 3:
                            cc.JOIN_FRIEND_AND_PLAY = null;
                            break;
                        default:
                            cc.JOIN_FRIEND_AND_PLAY.failedCall();
                            break;
                    }
                }
            });
        }
    },

    //获取其他玩家数据
    on_msg_get_room_user_info_ret(msg) {
        if (msg.gameType == RoomMgr.Instance().gameId && msg.roomId == RoomMgr.Instance().roomId) {
            msg.userInfosList.forEach(function (roleInfo) {
                if (roleInfo.userId != cc.dd.user.id) {
                    if (RoomMgr.Instance().player_mgr) {
                        RoomMgr.Instance().player_mgr.playerEnter(roleInfo);
                    }
                }
            });
        }
    },

    /**
     * 加入房间其他成员信息
     */
    on_msg_enter_game_other: function (msg) {
        PlayerBaseInfoMgr.addPlayerInfo(msg.roleInfo);
        if (RoomMgr.Instance().player_mgr) {
            if (RoomMgr.Instance().player_mgr.othersNum != null)
                RoomMgr.Instance().player_mgr.othersNum += 1;
            RoomMgr.Instance().player_mgr.playerEnter(msg.roleInfo);
            RoomMgr.Instance().player_mgr.requesYuYinUserData();
        }
        RoomED.notifyEvent(RoomEvent.on_room_join, [msg]);
    },

    /**
     * 离开房间通用消息返回
     */
    on_msg_leave_game_ret: function (msg) {
        switch (msg.retCode) {
            case 0: {
                if (cc.dd.user.id == msg.userId && msg.gameInfo.gameType != hallData.getInstance().gameId && cc._wait_end_quickenter)
                    return;
                if (cc.dd.user.id == msg.userId && msg.coinRetCode == 6) {
                    cc.dd.DialogBoxUtil.show(0, '由于您长时间未操作游戏，已将您切换至大厅', "text33", null, null);
                }
                if (RoomMgr.Instance().player_mgr) {
                    if (RoomMgr.Instance().player_mgr.othersNum != null)
                        RoomMgr.Instance().player_mgr.othersNum -= 1;
                    RoomMgr.Instance().player_mgr.playerExit(msg.userId);
                }
                RoomED.notifyEvent(RoomEvent.on_room_leave, [msg]);
                break;
            }
            case 1: {
                //退出房间,出错不提示
                // cc.dd.DialogBoxUtil.show(0, cc.dd.Text.TEXT_KLB_HALL_COMMON_8, "text33", null, function () {
                cc.dd.SceneManager.enterHall();
                // });
                break;
            }
            case 2: {
                //退出房间,出错不提示
                // cc.dd.DialogBoxUtil.show(0, cc.dd.Text.TEXT_KLB_HALL_COMMON_9, "text33", null, function () {
                cc.dd.SceneManager.enterHall();
                // });
                break;
            }
            case 3: {
                cc.dd.DialogBoxUtil.show(0, cc.dd.Text.TEXT_KLB_HALL_COMMON_13, "text33", null, function () {
                    //cc.dd.SceneManager.enterHall();
                });
                break;
            }
            default: {
                break;
            }
        }
        if (RoomMgr.Instance().player_mgr) {
            RoomMgr.Instance().player_mgr.requesYuYinUserData();
        }
        /*if (msg.retCode == 0) {

        } else {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_13;
                    break;
                default:
                    break;
            }

        }*/
    },

    on_msg_stand_game_ret(msg){
        switch (msg.retCode) {
            case 0: {
                if (RoomMgr.Instance().player_mgr) {
                    if (RoomMgr.Instance().player_mgr.othersNum != null)
                        RoomMgr.Instance().player_mgr.othersNum -= 1;
                    RoomMgr.Instance().player_mgr.playerExit(msg.userId);
                }
                RoomED.notifyEvent(RoomEvent.on_player_stand, [msg]);
                break;
            }
            case 1: {
                break;
            }
            case 2: {
                break;
            }
            case 3: {
                break;
            }
            default: {
                break;
            }
        }
    },

    on_msg_plan_leave_game_ret(msg) {
        RoomED.notifyEvent(RoomEvent.on_room_leave_plan, [msg]);
    },

    /**
     * 点击准备按钮通用消息返回
     */
    on_msg_prepare_game_ret: function (msg) {
        if (msg.retCode == 0) {
            if (player) {
                player.setReady(1);
            }
            if (RoomMgr.Instance().player_mgr) {
                var player = RoomMgr.Instance().player_mgr.getPlayer(msg.userId);
                if (player) {
                    player.setReady(true);
                }
            }
        }
        RoomED.notifyEvent(RoomEvent.on_room_ready, [msg]);
        // var tipsText = "";
        // switch (msg.retCode) {
        //     case 1:
        //         tipsText = '房间不存在';
        //         break;
        //     case 2:
        //         tipsText = '不在此房间';
        //         break;
        //     case 3:
        //         tipsText = '没有游戏服';
        //         break;
        //     case 4:
        //         tipsText = '金币不足';
        //         break;
        //     case 5:
        //         tipsText = '金币高于上限';
        //         break;
        // }
        // if (msg.retCode != 0) {
        //     cc.dd.DialogBoxUtil.show(0, tipsText, "text33");
        // }
    },

    /**
     * 更新玩家在线状态
     * @param msg
     */
    on_msg_update_room_role_state: function (msg) {
        if (RoomMgr.Instance().player_mgr) {
            var player = RoomMgr.Instance().player_mgr.getPlayer(msg.userId);
            if (player) {
                if (!RoomMgr.Instance().isMJ()) {
                    player.state = msg.state;
                }
                player.setOnLine(msg.state == 1);
                RoomMgr.Instance().player_mgr.requesYuYinUserData();
            }
        }
        RoomED.notifyEvent(RoomEvent.on_room_player_online, [msg]);
    },

    /**
     * 聊天消息
     * @param msg
     */
    on_msg_chat_message_ret: function (msg) {
        //用户玩家的短语表情 已单机处理
        if (msg.sendUserId == cc.dd.user.id) {
            return;
        }
        var chat_msg = {};
        chat_msg.msgtype = msg.chatInfo.msgType;
        chat_msg.id = msg.chatInfo.id;
        chat_msg.toUserId = msg.chatInfo.toUserId;
        chat_msg.sendUserId = msg.sendUserId;
        ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        //GVoice 语音
        if (msg.chatInfo.msgType == 4) {
            cc.dd.native_gvoice.pushDownloadQueue(msg.chatInfo.msg, msg.sendUserId);
        }
    },

    /**
     * 进入游戏
     */
    on_msg_enter_coin_game_ret: function (msg) {
        //cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickRoom');
        cc.dd.NetWaitUtil.net_wait_end('onClickRoom');
        var tipsText = "";

        if (msg.retCode === 0) {
            RoomED.notifyEvent(RoomEvent.on_coin_room_enter, [msg]);
            return;
        }

        switch (msg.retCode) {
            case 1:
                tipsText = cc.dd.Text.TEXT_POPUP_18;
                break;
            case 2:
                tipsText = cc.dd.Text.TEXT_POPUP_19;
                break;
            case 3:
                tipsText = cc.dd.Text.TEXT_POPUP_17;
                break;
            case 4:
                tipsText = '房间人数已满';
                break;
            case 5:
                tipsText = '其他游戏中，不能加入游戏';
                break;
            case 10:
                tipsText = '已报名活动赛，退赛可参加其他游戏';
                break;
            case 11:
                tipsText = '加入游戏过于频繁，请等15秒钟后再尝试加入';
                break;
            case 14:
                tipsText = '游戏房间不存在';
                break;
            case 12:
                tipsText = '游戏座位已有玩家，不能加入游戏';
                break;
            case 13:
                tipsText = '该房间鱼潮进行中，请等待' + msg.arg + '秒后再尝试加入';
                break;
        }
        cc.dd.DialogBoxUtil.show(0, tipsText, "OK", null, ()=>{
            if(cc.director.getScene().name !== AppConfig.HALL_NAME){
                cc.dd.SceneManager.enterHall();
            }
        });
        RoomED.notifyEvent(RoomEvent.check_is_in_game, [msg]);
    },


    /**
     * 换桌
     * @param msg
     */
    on_msg_change_room_ret: function (msg) {
        RoomED.notifyEvent(RoomEvent.on_room_replace, [msg]);
    },

    /**
     * 游戏内用户面板信息
     */
    on_msg_room_user_info: function (msg) {
        RoomMgr.Instance().gameId = msg.gameInfo.gameType;
        RoomMgr.Instance().roomId = msg.gameInfo.roomId;
        RoomMgr.Instance().player_mgr = null;
        PlayerBaseInfoMgr.clearData();
        for (var i = 0; i < msg.roleInfosList.length; i++) {
            PlayerBaseInfoMgr.addPlayerInfo(msg.roleInfosList[i]);
        }
        switch (msg.gameInfo.gameType) {
            case 32://斗地主金币场
                var mgr = require('ddz_data').DDZ_Data.Instance();
                mgr.updatePlayerNum();
                msg.roleInfosList.forEach(element => {
                    mgr.playerEnter(element);
                });
                break;
            case 41: //填大坑金币场
                break;
            case 51://牛牛金币场
                var mgr = require('nn_data').Instance();
                mgr.updatePlayerNum();
                msg.roleInfosList.forEach(element => {
                    mgr.playerEnter(element);
                });
                RoomMgr.Instance().setPlayerMgr();
                RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
                break;
            case 109://疯狂牛牛
                var mgr = require('brnn_data').brnn_Data.Instance();
                msg.roleInfosList.forEach(element => {
                    mgr.playerEnter(element);
                });
                cc.dd.SceneManager.enterGame(msg.gameInfo.gameType);
                break;
            case 61: // 刨幺金币场
                break;
            case 135: //斗三张
                var mgr = require('dsz_player_mgr').DSZ_PlayerMgr.Instance();
                RoomMgr.Instance().setPlayerMgr();
                mgr.updatePlayerNum();
                msg.roleInfosList.forEach(element => {
                    mgr.playerEnter(element);
                });
                break;
            case 202: //德州
            case define.GameType.TEXAS_WHEEL:
                var mgr = require('texas_data').texas_Data.Instance();
                RoomMgr.Instance().setPlayerMgr();
                mgr.updatePlayerNum();
                msg.roleInfosList.forEach(element => {
                    mgr.playerEnter(element);
                });
                break;
            case 108://俱乐部百牛
                var mgr = require('brnn_data').brnn_Data.Instance();
                msg.roleInfosList.forEach(element => {
                    mgr.playerEnter(element);
                });
                cc.dd.SceneManager.enterGame(msg.gameInfo.gameType);
                break;
            case 150://俱乐部牛牛
                var mgr = require('nn_data').Instance();
                mgr.updatePlayerNum();
                msg.roleInfosList.forEach(element => {
                    mgr.playerEnter(element);
                });
                RoomMgr.Instance().setPlayerMgr();
                RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
                break;
            case 163://梭哈
                break;
            case define.GameType.GDY_GOLD: // 干瞪眼金币场
                break;
            case define.GameType.HBSL_GOLD:
            case define.GameType.HBSL_JBL: //红包埋雷

                break;
            case 136://新斗三张
                RoomMgr.Instance().setPlayerMgr();
                RoomMgr.Instance().player_mgr.updatePlayerNum();
                msg.roleInfosList.forEach(element => {
                    RoomMgr.Instance().player_mgr.playerEnter(element);
                });
                cc.dd.SceneManager.enterGame(msg.gameInfo.gameType);//斗三张特殊处理
                break;
            case 138://捕鱼
                RoomMgr.Instance().setPlayerMgr();
                RoomMgr.Instance().player_mgr.updatePlayerNum();
                msg.roleInfosList.forEach(element => {
                    RoomMgr.Instance().player_mgr.playerEnter(element);
                });
                break;
            case 139://捕鱼
                RoomMgr.Instance().setPlayerMgr();
                RoomMgr.Instance().player_mgr.updatePlayerNum();
                msg.roleInfosList.forEach(element => {
                    RoomMgr.Instance().player_mgr.playerEnter(element);
                });
                break;
            case 107://黄金赛马
                RoomMgr.Instance().setPlayerMgr();
                RoomMgr.Instance().player_mgr.updatePlayerNum();
                msg.roleInfosList.forEach(element => {
                    RoomMgr.Instance().player_mgr.playerEnter(element);
                });
                break;
            case cc.dd.Define.GameType.BLACKJACK_GOLD:
                RoomMgr.Instance().setPlayerMgr();
                if(RoomMgr.Instance().state >= 1 && RoomMgr.Instance().state <= 7){
                }else{
                    RoomMgr.Instance().player_mgr.updatePlayerNum();
                    msg.roleInfosList.forEach(player=>{
                        RoomMgr.Instance().player_mgr.playerEnter(player);
                    });
                }
                break;
            case cc.dd.Define.GameType.RUMMY:
                RoomMgr.Instance().setPlayerMgr();
                RoomMgr.Instance().player_mgr.updatePlayerNum();
                msg.roleInfosList.forEach(player=>{
                    RoomMgr.Instance().player_mgr.playerEnter(player);
                });
                break;
        }
    },

    /**
     * 玩家位置更新
     */
    on_msg_player_location_ack: function (msg) {
        RoomED.notifyEvent(RoomEvent.update_player_location, [msg]);
    },

    //房间金币更新
    on_msg_room_coin_update: function (msg) {
        cc.log("msg_room_coin_update:", msg);
        /*optional int32  game_type      = 1;
        optional int32  room_id        = 2;
        optional int32  user_id        = 3;
        optional int32  coin           = 4;*/
    },

    /**
     * 解散
     * @param {*} msg 
     */
    on_room_dissolve_agree_ack(msg) {
        var handler = null;
        switch (msg.gameType) {
            case 33://斗地主
            case 34:
                handler = require('jlmj_net_handler_ddz');
                break;
            case 29://跑得快
                handler = require('net_handler_pdk');
                break;
            case define.GameType.TDK_FRIEND: //填大坑
            case define.GameType.TDK_FRIEND_LIU: //方正填大坑
                break;
            case 50://牛牛
                handler = require('net_handler_douniu');
                break;
            case define.GameType.PAOYAO_FRIEND: //刨幺
                break;
            case 35: //斗三张
                handler = require('net_handler_dsz');
                break;
            case 63:
                break;
            case define.GameType.GDY_FRIEND: //干瞪眼
                break;
            case define.GameType.HBSL_JBL: //红包埋雷
                break;
            case define.GameType.NEW_DSZ_FRIEND://新斗三张
                handler = require('net_handler_new_dsz');
                break;
        }
        if (handler) {
            handler.on_room_dissolve_agree_ack(msg);
        }
    },

    /**
     * 解散结果
     * @param {*} msg 
     */
    on_room_dissolve_agree_result(msg) {
        var handler = null;
        switch (msg.gameType) {
            case 33://斗地主
            case 34:
                handler = require('jlmj_net_handler_ddz');
                break;
            case 29://跑得快
                handler = require('net_handler_pdk');
                break;
            case define.GameType.TDK_FRIEND: //填大坑
            case define.GameType.TDK_FRIEND_LIU: //方正填大坑
                break;
            case 50://牛牛
                handler = require('net_handler_douniu');
                break;
            case define.GameType.PAOYAO_FRIEND: //刨幺
                break;
            case 35: //斗三张
                handler = require('net_handler_dsz');
                break;
            case 63:
                break;
            case define.GameType.GDY_FRIEND: //干瞪眼
                break;
            case define.GameType.HBSL_JBL: //红包埋雷
                break;
            case define.GameType.NEW_DSZ_FRIEND://新斗三张
                handler = require('net_handler_new_dsz');
                break;
        }
        if (handler) {
            handler.on_room_dissolve_agree_result(msg);
        }
    },

    /**
     * 游戏内准备
     * @param {*} msg 
     */
    on_room_prepare_ack(msg) {
        var handler = null;
        switch (msg.gameType) {
            case 31:
            case 32:
            case 33://斗地主
            case 34:
                handler = require('jlmj_net_handler_ddz');
                break;
            case 29://跑得快
                handler = require('net_handler_pdk');
                break;
            case define.GameType.TDK_FRIEND: //填大坑
            case define.GameType.TDK_FRIEND_LIU: //方正填大坑
            case define.GameType.TDK_COIN: //填大坑
                break;
            case 50://牛牛
            case 51:
                handler = require('net_handler_douniu');
                break;
            case 60: //刨幺
            case 61:
                break;
            case 35://斗三张
            case 135:
                handler = require('net_handler_dsz');
                break;
            case 63:
            case 163://港式五张
                break;
            case 36://新斗三张
                handler = require('net_handler_new_dsz');
                break;
            case define.GameType.GDY_GOLD: //干瞪眼
            case define.GameType.GDY_FRIEND:
                break;
        }
        if (handler) {
            handler.on_room_prepare_ack(msg);
        }
    },

    //游戏排行
    on_msg_rank_ret(msg) {
        cc.dd.NetWaitUtil.net_wait_end('sendRank2S');
        var rankId = msg.rankId;
        if (rankId == 16) {
            Hall.HallED.notifyEvent(Hall.HallEvent.Rank_Info, msg);
        } else if (rankId == 19) {
            Hall.HallED.notifyEvent(Hall.HallEvent.Rank_Info_Game, msg);
        } else if (rankId < 1000) {
            if (!cc.dd.rankData)
                cc.dd.rankData = [];
            cc.dd.rankData[rankId] = msg;
            var prefabPath = ''
            if (rankId == 17 || rankId == 18) {
                prefabPath = 'gameyj_ebg/prefab/com_game_rank'
            } else {
                prefabPath = 'blackjack_common/prefab/com_game_rank';
            }

            var UI = cc.dd.UIMgr.getUI(prefabPath);
            if (UI) {
                UI.getComponent('com_game_rank').setData(msg);
            }
            else {
                cc.dd.UIMgr.openUI(prefabPath, function (ui) {
                    ui.getComponent('com_game_rank').setData(msg);
                })
            }
        }
    },

    on_msg_room_pre_enter_ret(msg) {
        cc.dd.NetWaitUtil.net_wait_end('onStop');

        var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
        if (!UpdateMgr.isGameInstalled(msg.gameType)) {
            if (cc.dd.Utils.checkIsUpdateOrWrongRoom(msg.gameType)) {
                let game_list = require("klb_gameList");
                let game_cfg = game_list.getItem(function (cfg) {
                    return cfg.gameid == msg.gameType;
                });
                if (!cc.dd.UIMgr.getUI(hall_prefab.HALL_GAME_UPDATE)) {
                    cc.dd.UIMgr.openUI(hall_prefab.HALL_GAME_UPDATE, function (prefab) {
                        var update = prefab.getComponent('hall_game_update_of_dialog');
                        update.setGameID(msg.gameType, game_cfg.name, msg.roomId);
                    })
                }
            } else {
                cc.dd.DialogBoxUtil.show(0, "text37", 'text33', null, function () {
                    cc.dd.SceneManager.enterHall();
                });
                // cc.dd.DialogBoxUtil.show(0, "请先在大厅安装游戏:" + game_cfg.name, 'text33', null, function () {
                //     cc.dd.SceneManager.enterHall();
                // });
            }
        } else {
            cc._join_room_updated = function () {
                if (msg.isCanSelectSeat) {
                    RoomED.notifyEvent(RoomEvent.on_choose_seat, [msg]);
                } else {
                    var check_room_req = new cc.pb.room_mgr.msg_check_room_info_req();
                    var game_info = new cc.pb.room_mgr.common_game_header();
                    game_info.setRoomId(msg.roomId);
                    game_info.setGameType(msg.gameType);
                    check_room_req.setGameInfo(game_info);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_check_room_info_req, check_room_req, 'cmd_msg_check_room_info_req', true);
                }
            }

            var updater = UpdateMgr.getUpdater(msg.gameType);
            if (cc.sys.isNative && updater) {
                cc._joinUpdater = updater;
                cc._joinUpdater.roomId = msg.roomId;
                if (updater.updateing) {
                    cc.dd.PromptBoxUtil.show('游戏正在下载中,请稍等!');
                    return;
                }
                if (updater.checking) {
                    cc.log("正在检测更新中");
                    return;
                }
                //设置游戏更新完成回调,游戏更新id
                updater.cfg.game_id = msg.gameType;
                updater.checkUpdate("entrance_join");
            } else {
                cc._join_room_updated();
                cc._join_room_updated = null;
            }
        }
    },

    //检查是否可加入
    on_msg_check_room_info_ret(msg) {
        if (!msg.isShowPanel || !msg.isRoomStarted) {//直接走加入流程
            var enter_game_req = new cc.pb.room_mgr.msg_enter_game_req();
            var game_info = new cc.pb.room_mgr.common_game_header();
            game_info.setRoomId(msg.gameInfo.roomId);
            enter_game_req.setGameInfo(game_info);
            enter_game_req.setSeat(0);
            if (cc.sys.isNative) {
                if (cc.sys.OS_ANDROID == cc.sys.os) {
                    var loc = new cc.pb.room_mgr.latlng();
                    var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                    var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                    loc.setLatitude(latitude);
                    loc.setLongitude(longitude);
                    cc.log("详细地址：经度 " + longitude);
                    cc.log("详细地址：纬度 " + latitude);
                    if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                        enter_game_req.setLatlngInfo(loc);
                    }
                } else if (cc.sys.OS_IOS == cc.sys.os) {
                    var loc = new cc.pb.room_mgr.latlng();
                    var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                    var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                    loc.setLatitude(Latitude);
                    loc.setLongitude(Longitude);
                    cc.log("详细地址：经度 " + Longitude);
                    cc.log("详细地址：纬度 " + Latitude);
                    if (parseInt(Latitude) != 0 || parseInt(Longitude) != 0) {
                        enter_game_req.setLatlngInfo(loc);
                    }
                }
            }
            if (cc.dd.Utils.getGpsFromMsg(msg) && cc.sys.isNative && !enter_game_req.latlngInfo && !cc._chifengGame) {
                cc.dd.DialogBoxUtil.show(0, "加入房间失败，无法获取定位信息", 'text33', null, function () {
                }, null);
                return;
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_game_req, enter_game_req, 'cmd_msg_enter_game_req', true);
        }
        else {//游戏已开始
            cc.dd.DialogBoxUtil.showJoinDialog(0, '游戏已开始,是否进入', '加入', '观战',
                function () {//加入
                    var enter_game_req = new cc.pb.room_mgr.msg_enter_game_req();
                    var game_info = new cc.pb.room_mgr.common_game_header();
                    game_info.setRoomId(msg.gameInfo.roomId);
                    enter_game_req.setGameInfo(game_info);
                    enter_game_req.setSeat(0);
                    if (cc.sys.isNative) {
                        if (cc.sys.OS_ANDROID == cc.sys.os) {
                            var loc = new cc.pb.room_mgr.latlng();
                            var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                            var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                            loc.setLatitude(latitude);
                            loc.setLongitude(longitude);
                            cc.log("详细地址：经度 " + longitude);
                            cc.log("详细地址：纬度 " + latitude);
                            if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                                enter_game_req.setLatlngInfo(loc);
                            }
                        } else if (cc.sys.OS_IOS == cc.sys.os) {
                            var loc = new cc.pb.room_mgr.latlng();
                            var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                            var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                            loc.setLatitude(Latitude);
                            loc.setLongitude(Longitude);
                            cc.log("详细地址：经度 " + Longitude);
                            cc.log("详细地址：纬度 " + Latitude);
                            if (parseInt(Latitude) != 0 || parseInt(Longitude) != 0) {
                                enter_game_req.setLatlngInfo(loc);
                            }
                        }
                    }
                    if (cc.dd.Utils.getGpsFromMsg(msg) && cc.sys.isNative && !enter_game_req.latlngInfo && !cc._chifengGame) {
                        cc.dd.DialogBoxUtil.show(0, "加入房间失败，无法获取定位信息", 'text33', null, function () {
                        }, null);
                        return;
                    }
                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_game_req, enter_game_req, 'cmd_msg_enter_game_req', true);
                },
                function () {//旁观
                    var smsg = new cc.pb.room_mgr.msg_view_friend_game_req();
                    smsg.setGameType(msg.gameInfo.gameType);
                    smsg.setRoomId(msg.gameInfo.roomId);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_view_friend_game_req, smsg, "msg_view_friend_game_req", true);
                },
            );
            cc.dd.DialogBoxUtil.setBgCancel();
            if (!msg.isCanView)
                cc.dd.DialogBoxUtil.disableButton(0);
            if (!msg.isCanEnter)
                cc.dd.DialogBoxUtil.disableButton(1);
        }
    },

    /**
     * 金币更新 
     * @param {*} msg 
     */
    on_msg_room_user_coin_info(msg) {
        if (RoomMgr.Instance().player_mgr && msg.roleCoinsList) {
            for (var i = 0; i < msg.roleCoinsList.length; i++) {
                var player = RoomMgr.Instance().player_mgr.getPlayer(msg.roleCoinsList[i].userId);
                if (!player) {
                    cc.error('同步金币 玩家 ' + msg.roleCoinsList[i].userId + ' 找不到');
                } else {
                    var coin = msg.roleCoinsList[i].coin;
                    switch (RoomMgr.Instance().gameId) {
                        case 108: //(疯狂拼十)
                            player.score = coin;
                            break;
                        case 143: //红包扫雷
                            player.setMoney(coin);
                            break;
                        default:
                            player.coin = coin;
                            break;
                    }
                }
            }
        }
    },

    /**
     * 旁观者加入房间返回
     */
    on_msg_view_friend_game_ret: function (msg) {
        if (msg.retCode == 0) {
            //设置房间管理器数据
            this.setRoomMgrData(msg);
        } else {
            var str = '';
            switch (msg.retCode) {
                case 1:
                    str = 'text37';
                    break;
                case 2:
                    str = '旁观者人数已满';
                    break;
                case 3:
                    str = '房间不能旁观';
                    break;
                case 4:
                    str = '俱乐部分数不足';
                    break;
                case 5:
                    str = '需要加入俱乐部';
                    break;
                case 10:
                    str = '已报名比赛场'
                    break;
                default:
                    break;
            }

            cc.dd.DialogBoxUtil.show(0, str, 'text33');
        }
    },

    /**
     * 旁观者进入游戏
     */
    on_msg_view_friend_game_other: function (msg) {
        PlayerBaseInfoMgr.addPlayerInfo(msg.roleInfo);
        if (RoomMgr.Instance().player_mgr) {
            switch (msg.gameInfo.gameType) {
                case define.GameType.HBSL_JBL:
                default: {
                    RoomMgr.Instance().player_mgr.playerEnter(msg.roleInfo);
                    RoomMgr.Instance().player_mgr.requesYuYinUserData();
                    break;
                }
            }
        }
        RoomED.notifyEvent(RoomEvent.on_room_join, [msg]);
    },

    /**
     * 设置房间管理器数据
     */
    setRoomMgrData: function (msg) {
        cc.JOIN_FRIEND_AND_PLAY = null;

        var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
        if (!UpdateMgr.isGameInstalled(msg.gameInfo.gameType)) {
            if ((cc._appstore_check || cc._androidstore_check || cc._isHuaweiGame) && AppConfig.GAME_PID == 3) {

            }
            else if (cc._chifengGame) {
                if (msg.gameInfo.gameType == cc.dd.Define.GameType.CFMJ_FRIEND || msg.gameInfo.gameType == cc.dd.Define.GameType.AHMJ_FRIEND || msg.gameInfo.gameType == cc.dd.Define.GameType.WDMJ_FRIEND || msg.gameInfo.gameType == cc.dd.Define.GameType.PZMJ_FRIEND) {
                    let game_list = require("klb_gameList");
                    let game_cfg = game_list.getItem(function (cfg) {
                        return cfg.gameid == msg.gameInfo.gameType;
                    });
                    if (game_cfg) {
                        cc.dd.DialogBoxUtil.show(0, "请先在大厅安装游戏:" + game_cfg.name, 'text33', null, function () {
                            cc.dd.SceneManager.enterHall();
                        }, null);
                        return;
                    }
                } else {
                    cc.dd.DialogBoxUtil.show(0, "text37", 'text33', null, function () {
                        cc.dd.SceneManager.enterHall();
                    }, null);
                    return;
                }
            } else {
                let game_list = require("klb_gameList");
                let game_cfg = game_list.getItem(function (cfg) {
                    return cfg.gameid == msg.gameInfo.gameType;
                });
                if (game_cfg) {
                    cc.dd.DialogBoxUtil.show(0, "请先在大厅安装游戏:" + game_cfg.name, 'text33', null, function () {
                        cc.dd.SceneManager.enterHall();
                    }, null);
                    return;
                }
            }

        }

        //聊天大厅
        let clubID = clubMgr.getSelectClubId()
        if (cc.dd._.isNumber(clubID) && clubID != 0) {
            club_sender.enterChatClub(clubMgr.getSelectClubId(), 2);
        }
        if (cc.dd._.isNumber(msg.gameInfo.clubId) && msg.gameInfo.clubId != 0) {
            clubMgr.setSelectClubId(msg.gameInfo.clubId);
            club_sender.enterChatClub(msg.gameInfo.clubId, 3);
        }

        for (var i = 0; i < msg.otherInfosList.length; i++) {
            PlayerBaseInfoMgr.addPlayerInfo(msg.otherInfosList[i]);
        }
        PlayerBaseInfoMgr.addPlayerInfo(msg.selfInfo);
        if (cc.dd.SceneManager.isGameSceneExit(msg.gameInfo.gameType)) {
            cc.log('房间管理器-前后台切换');
            RoomMgr.Instance().clear();
            RoomMgr.Instance().clearClubId();
            RoomMgr.Instance().setGameCommonInfo(msg.gameInfo.gameType, msg.gameInfo.roomId, msg.gameInfo.userId, msg.gameInfo.clubId, 1, msg.gameInfo.multiple, msg.deskId);
            RoomMgr.Instance().setPYGameNetHandler(msg.gameInfo.gameType);
            RoomMgr.Instance().setGameRuleByType(msg);
            RoomMgr.Instance().setPlayerMgr(msg);
            RoomMgr.Instance().setDaiKai(msg.gameInfo.clubCreateType);

            if (RoomMgr.Instance().player_mgr) {
                RoomMgr.Instance().player_mgr.updatePlayerNum();
                RoomMgr.Instance().player_mgr.playerEnter(msg.selfInfo);
                RoomMgr.Instance().player_mgr.othersNum = msg.othersNum;
            }
            msg.otherInfosList.forEach(function (roleInfo) {
                if (roleInfo.userId != cc.dd.user.id) {
                    if (RoomMgr.Instance().player_mgr) {
                        RoomMgr.Instance().player_mgr.playerEnter(roleInfo);
                    }
                }

            });

            if (msg.isGetOthers) {
                var get_users_msg = new cc.pb.room_mgr.msg_get_room_user_info_req();
                get_users_msg.setGameType(msg.gameInfo.gameType);
                get_users_msg.setRoomId(msg.gameInfo.roomId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_get_room_user_info_req, get_users_msg, "msg_get_room_user_info_req", true);
            }
            if (RoomMgr.Instance().player_mgr) {
                RoomMgr.Instance().player_mgr.requesYuYinUserData();
            }

        } else {
            cc.log('房间管理器-断线重连');
            RoomMgr.Instance().clearClubId();
            RoomMgr.Instance().setGameCommonInfo(msg.gameInfo.gameType, msg.gameInfo.roomId, msg.gameInfo.userId, msg.gameInfo.clubId, 1, msg.gameInfo.multiple, msg.deskId);
            RoomMgr.Instance().setPYGameNetHandler(msg.gameInfo.gameType);
            RoomMgr.Instance().setGameRuleByType(msg);
            RoomMgr.Instance().setPlayerMgr(msg);
            RoomMgr.Instance().setDaiKai(msg.gameInfo.clubCreateType);

            if (RoomMgr.Instance().player_mgr) {
                RoomMgr.Instance().player_mgr.updatePlayerNum();
                RoomMgr.Instance().player_mgr.playerEnter(msg.selfInfo);
            }
            msg.otherInfosList.forEach(function (roleInfo) {
                if (roleInfo.userId != cc.dd.user.id) {
                    if (RoomMgr.Instance().player_mgr) {
                        RoomMgr.Instance().player_mgr.playerEnter(roleInfo);
                        RoomMgr.Instance().player_mgr.othersNum = msg.othersNum;
                    }
                }
            });
            if (msg.isGetOthers) {
                var get_users_msg = new cc.pb.room_mgr.msg_get_room_user_info_req();
                get_users_msg.setGameType(msg.gameInfo.gameType);
                get_users_msg.setRoomId(msg.gameInfo.roomId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_get_room_user_info_req, get_users_msg, "msg_get_room_user_info_req", true);
            }
            if (RoomMgr.Instance().player_mgr) {
                RoomMgr.Instance().player_mgr.requesYuYinUserData();
            }
            if (msg.gameInfo.gameType == define.GameType.DOYENFISH_GOLD) {
                RoomMgr.Instance().gameId = msg.gameInfo.gameType;
                RoomMgr.Instance().roomType = msg.gameInfo.roomId;
                cc.dd.SceneManager.enterGameWithLoading(msg.gameInfo.gameType);
            } else if(msg.gameInfo.gameType == define.GameType.BLACKJACK_GOLD || msg.gameInfo.gameType == define.GameType.RUMMY){
                cc.dd.SceneManager.enterGame(msg.gameInfo.gameType, null, [new cc.dd.ResLoadCell("blackjack_common/atlas/cards", cc.SpriteAtlas)]);
            }else
                if (msg.gameInfo.gameType != define.LKFISH_GOLD)//捕鱼需要特殊加载处理
                    cc.dd.SceneManager.enterGame(msg.gameInfo.gameType);
        }

        if (RoomMgr.Instance().isClubRoom()) {
            club_sender.sendSit(msg.gameInfo.clubId, msg.gameInfo.roomId);
        }

        RoomED.notifyEvent(RoomEvent.on_room_enter, [msg]);
        var smsg = new cc.pb.room_mgr.msg_room_reconnect_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_reconnect_req, smsg, "msg_room_reconnect_req", true);
    },

    /**
     * 检查独立游戏是否加入对应房间 
     */
    checkDLGame: function (data) {
        if (!data) return false;
        var gametype = data.gameInfo.gameType;
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
                if (gametype == define.GameType.CCMJ_FRIEND ||
                    gametype == define.GameType.CCMJ_GOLD)
                    return true;
            case 3: //快乐吧农安麻将
                if (gametype == define.GameType.NAMJ_FRIEND ||
                    gametype == define.GameType.NAMJ_GOLD)
                    return true;
            case 4:  //快乐吧填大坑
                if (gametype == define.GameType.TDK_FRIEND ||
                    gametype == define.GameType.TDK_COIN)
                    return true;
            case 5:  //快乐吧牛牛
                if (gametype == define.GameType.NN_FRIEND ||
                    gametype == define.GameType.NN_GOLD)
                    return true;
            default:
                return true;
        }
    },

    /**
     * 自建房消息
     */
    on_msg_get_room_self_build_ret: function (data) {
        RoomED.notifyEvent(RoomEvent.room_create_by_self, data);
    },

    on_msg_friend_create_room_ret(msg) {
        RoomED.notifyEvent(RoomEvent.daikai_list_ret, msg);
    },


    /********************************************通用游戏大厅选座消息begin*******************************************/
    on_msg_get_room_desks_ret: function (msg) {//请求桌子列表消息返回
        if (msg.retCode != 0)
            return;
        RoomMgr.Instance().setGameCommonInfo(msg.gameInfo.gameType, msg.gameInfo.roomId); //设置基本的管理器数据
        RoomMgr.Instance().setPlayerMgr(); //设置自己的管理器
        RoomMgr.Instance().player_mgr.updateDeskList(msg.index, msg.desksList);//设置桌子列表
    },

    on_msg_room_desk_info: function (msg) {//桌子加入/退出消息广播
        if (RoomMgr.Instance().gameId != msg.gameInfo.gameType || RoomMgr.Instance().roomId != msg.gameInfo.roomId)
            return;
        RoomMgr.Instance().player_mgr.updateDeskInfo(msg.opType, msg.desk); //更新某个桌子的数据
    },
    /********************************************通用游戏大厅选座消息end*******************************************/


    /********************************************卡密充值begin*******************************************/
    on_msg_card_charge_ret: function (msg) {
        if (msg.retCode == 0) {
            let reward = [];
            msg.rewardList.forEach((item) => {
                if (item) {
                    reward.push({ id: item.itemId, num: item.itemNum });
                }
            })
            if (reward.length > 0) {
                cc.dd.RewardWndUtil.show(reward, false);
            }
        } else {
            let str = '兑换失败';
            switch (msg.retCode) {
                case 1:
                    str = '请求错误';
                    break;
                case 2:
                    str = '卡密错误';
                    break;
                case 3:
                    str = '仅限一次赠卡充值，无法继续兑换！';
                    break;
                case 4:
                    str = '系统错误';
                    break;
                case 5:
                    str = '参数错误';
                    break;
                case 6:
                    str = '卡密已经使用过';
                    break;
                case 7:
                    str = '卡密已经作废';
                    break;
                case 8:
                    str = '卡密状态未知';
                    break;
            }
            cc.dd.DialogBoxUtil.show(0, str, 'text33');
        }
    },
    /********************************************卡密充值end*********************************************/


};

module.exports = handler;