const Hall = require('jlmj_halldata');
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;

var hanlder = {
    /******************************俱乐部回复begin***********************************/
    /**
     * 获取俱乐部列表数据
     */
    on_msg_get_all_club_ret: function (msg) {
        cc._wait_all_club_list = false;

        cc.dd.NetWaitUtil.net_wait_end('msg_get_all_club_req');
        //初始化俱乐部列表数据
        club_Mgr.initClubList(msg.clubsList);
        //设置默认选中的俱乐部id
        // club_Mgr.setSelectClubId(msg.clubId);
        //设置默认俱乐部房间列表
        club_Mgr.setClubDeskList(msg.roomsList);
        //设置申请的俱乐部列表
        club_Mgr.setApplyClubList(msg.applyListList);
        club_Ed.notifyEvent(club_Event.CLUB_INIT_CLUB_LIST);
    },

    /**
     * 打开指定俱乐部返回
     */
    on_msg_open_club_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_open_club_req');
        if (msg.retCode != 0)
            return;
        //设置默认选中的俱乐部id
        // club_Mgr.setSelectClubId(msg.clubInfo.clubid);
        //设置新的俱乐部数据
        // club_Mgr.resetSelctClubInfo(msg.clubInfo.clubid, msg.clubInfo);
        //设置默认俱乐部房间列表
        // club_Mgr.setClubDeskList(msg.roomsList);
        if (msg.rebBagSum > 0) {
            club_Ed.notifyEvent(club_Event.FRIEND_GROUP_SHOW_RED_BAG_ANIM);
        } else {
            club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CLOSE_RED_BAG_ANIM);
        }
        // club_Ed.notifyEvent(club_Event.CLUB_OPEN_SUCCESS);
    },

    /**
     * 加入俱乐部消息返回
     */
    on_msg_join_club_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_join_club_req');

        if (msg.type == 1) {
            club_Mgr.setClubApplyNum(msg.clubid);
            club_Ed.notifyEvent(club_Event.CLUB_APPLY_NUM_CHANGE, 1);
            return;
        }
        var str = '';
        switch (msg.retCode) {
            case 0:
                str = '加入亲友圈请求已经发送，等待群主验证';
                club_Ed.notifyEvent(club_Event.FRIEND_APPLY_SUCCESS);
                break;
            case 1:
                str = '亲友圈人数已满';
                break;
            case 2:
                if(cc.JOIN_FRIEND_AND_PLAY){
                    cc.JOIN_FRIEND_AND_PLAY.getBaoFang();
                    return;
                }
                str = '已经加入亲友圈，请勿重复加入';
                break;
            case 3:
                str = '亲友圈不存在,请确认亲友圈ID是否正确';
                break;
            case 4:
                str = '已经向亲友圈发送申请，请勿重复申请';
                break;
            case 5:
                str = '您加入的亲友圈个数已达上线，不能加入其他亲友圈';
                break;
            case 6:
                str = '群主不能加入其他亲友圈';
                break;
            case 100:
                if(cc.JOIN_FRIEND_AND_PLAY){
                    cc.JOIN_FRIEND_AND_PLAY.getBaoFang();
                    return;
                }
                str = '亲友圈加入成功';
                break;
        }
        if(cc.JOIN_FRIEND_AND_PLAY){
            cc.dd.DialogBoxUtil.show(0, str, 'text33', null, ()=> {
                cc.JOIN_FRIEND_AND_PLAY.failedCall();
            });
        }else{
            cc.dd.PromptBoxUtil.show(str);
        }
    },

    /**
     * 创建俱乐部返回
     */
    on_msg_create_club_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_create_club_req');

        var str = '';
        switch (msg.retCode) {
            case 0:
                str = '创建亲友圈[' + msg.club.clubname + ']成功';
                club_Mgr.createClub(msg.club);
                club_Mgr.setSelectClubId(msg.club.clubid);
                club_Mgr.clearDeskList();
                club_Ed.notifyEvent(club_Event.CLUB_CREATE_SUCCESS, msg);
                break;
            case 1:
                str = '亲友圈名字长度不符合规则，请更换亲友圈名字重试';
                break;
            case 2:
                str = '每个玩家限定只能创建3个亲友圈';
                break;
            case 4:
                str = '亲友圈名字已存在，请更换亲友圈名字重试';
                break;
            case 5:
                str = '亲友圈名字中包含敏感字符，请更换亲友圈名字重试';
                break;
            case 6:
                str = '亲友圈名字不符合规则，请更换亲友圈名字重试';
                break;
            case 7:
                str = '房卡不足，请您购买房卡后重试';
                break;
            case 8:
                str = '您已加入其他亲友圈，请退出后重新创建';
                break;
            case 9:
                str = '体验亲友圈已达上限';
                break;
            case 10:
                str = '只允许创建一种亲友圈';
                break;
            case 11:
                str = '只能创建一个体验亲友圈';
                break;
            case 12:
                str = '非群主不能创建亲友圈';
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    /**
     * 存入房卡消息返回
     */
    on_msg_club_store_cards_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_store_cards_req');

        if (msg.retCode == 0 || msg.retCode == -1) {
            if (msg.retCode == -1)
                cc.dd.PromptBoxUtil.show('存入房卡成功');
            //修改俱乐部数据中的房卡数据
            club_Mgr.resetClubCard(msg.clubId, msg.cards);
            club_Ed.notifyEvent(club_Event.CLUB_CARDS_UPDATE, msg);
        } else {
            var str = '';
            if (msg.retCode == 1)
                str = '不是亲友圈群主，无权限存入房卡';
            else if (msg.retCode == 2)
                str = '房卡不足，请购买房卡';
            cc.dd.PromptBoxUtil.show(str);
        }
    },

    /**
     * 俱乐部管理消息返回
     */
    on_msg_open_club_manage_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_open_club_manage_req');

        if (msg.retCode != 0) {
            cc.dd.PromptBoxUtil.show('亲友圈管理只有群主有权限');
            return;
        }
        // club_Mgr.setClubMembersList(msg.membersList);

        if (this.memberNeedClean) {
            club_Mgr.cleanClubMember();
        }
        club_Mgr.addClubMembersList(msg.membersList);

        if (msg.page != msg.allPage) {
            this.memberNeedClean = false;
        } else {
            this.memberNeedClean = true;

            let clubInfo = club_Mgr.getClubInfoByClubId(club_Mgr.getSelectClubId());
            if (clubInfo) {
                clubInfo.memberLength = club_Mgr.getClubMembersList().length;
            }

            let me = club_Mgr.getClubMember(cc.dd.user.id);
            cc.dd.user.clubJob = me.job;

            club_Ed.notifyEvent(club_Event.CLUB_MANAGER_OP);
        }


    },

    //获取俱乐部权限
    on_msg_club_manger_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_manger_req');

        if (msg.clubId == club_Mgr.getSelectClubId()) {
            let MEMBER = require('klb_friend_group_enum').MEMBER;

            if (msg.managersList.indexOf(cc.dd.user.id) != -1) {
                cc.dd.user.clubJob = MEMBER.ADMIN;
            } else if (msg.ownerId == cc.dd.user.id) {
                cc.dd.user.clubJob = MEMBER.OWNER;
            } else {
                cc.dd.user.clubJob = MEMBER.NORMAL;
            }
            club_Mgr.setManager(msg.managersList);
            let clubInfo = club_Mgr.getClubInfoByClubId(msg.clubId);
            if (clubInfo) {
                clubInfo.memberLength = msg.allSum;
            }
        }
    },

    /**
     * 修改俱乐部名字
     */
    on_msg_club_change_name_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_change_name_req');

        var str = '';
        switch (msg.retCode) {
            case 0:
                let clubinfo = club_Mgr.getClubInfoByClubId(msg.clubId);
                if (clubinfo.owneruserid == cc.dd.user.id) {
                    str = '修改亲友圈名字成功';
                } else {
                    str = '群主已修改亲友圈名字';
                }
                club_Mgr.updateClubNameById(msg.clubId, msg.name);
                club_Ed.notifyEvent(club_Event.CLUB_CHANGE_NAME);
                break;
            case 1:
                str = '亲友圈名字长度不符合规则，请更换亲友圈名字重试';
                break;
            case 2:
                str = '不是亲友圈群主，无权限修改亲友圈名字';
                break;
            case 4:
                str = '亲友圈名字已存在，请更换亲友圈名字重试';
                break;
            case 5:
                str = '亲友圈名字中包含敏感字符，请更换亲友圈名字重试';
                break;
            case 6:
                str = '亲友圈名字不符合规则，请更换亲友圈名字重试';
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    /**
     * 俱乐部申请列表返回/针对玩家请求操作
     */
    on_msg_apply_club_op_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_apply_club_op_req');

        var str = '';
        switch (msg.opType) {
            case 1://请求列表返回
                if (msg.retCode != 0) {
                    cc.dd.PromptBoxUtil.show('亲友圈不存在');
                    return
                }
                club_Mgr.setClubApplyList(msg.applyListList, msg.clubId);
                club_Ed.notifyEvent(club_Event.CLUB_REQ_APPLY_LIST, msg);
                break;
            case 3://同意玩家加入
            case 2://拒绝玩家加入
                if (msg.retCode == 2)
                    str = '只有亲友圈管理员才能拒绝/同意玩家加入';
                else if (msg.retCode == 3)
                    str = '玩家不在申请列表中，操作失败';
                else if (msg.retCode == 4)
                    str = '玩家已经加入，不能重复操作';
                else if (msg.retCode == 0) {
                    club_Mgr.deleteClubApplyPlayerById(msg.opUserid, msg.clubId);
                    club_Ed.notifyEvent(club_Event.CLUB_OP_APPLY_PLAYER, msg);
                    if (msg.opUserid == 0)
                        if (msg.opType == 3)
                            str = '加入亲友圈成功';
                        else
                            str = '亲友圈管理员拒绝你加入亲友圈';
                    else {
                        club_Mgr.addPlayeCount(msg.clubId);
                        str = '操作成功';
                    }
                }
                else if (msg.retCode == 5) {
                    club_Mgr.deleteClubApplyPlayerById(msg.opUserid, msg.clubId);
                    club_Ed.notifyEvent(club_Event.CLUB_OP_APPLY_PLAYER, msg);
                    str = '玩家已经自建了亲友圈，不能加入您的亲友圈';
                }

                else if (msg.retCode == 6) {
                    club_Mgr.deleteClubApplyPlayerById(msg.opUserid, msg.clubId);
                    club_Ed.notifyEvent(club_Event.CLUB_OP_APPLY_PLAYER, msg);
                    str = '玩家亲友圈个数已经达到最大值';
                }
                cc.dd.PromptBoxUtil.show(str);
                break;
        }
    },

    /**
     * 解散俱乐部消息返回
     */
    on_msg_dissolve_club_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_dissolve_club_req');

        var str = '解散亲友圈成功'
        switch (msg.retCode) {
            case 0:
                let info = club_Mgr.getClubInfoByClubId(msg.clubId)
                if (info) {
                    if (cc.dd.user.id != info.owneruserid) {
                        str = '亲友圈已被解散';
                    }
                }
                club_Mgr.quitClub(msg.clubId);
                club_Ed.notifyEvent(club_Event.CLUB_QUIT_OR_DISSOLVE);
                break;
            case 1:
                str = '亲友圈不存在';
                break;
            case 2:
                str = '权限不足，只有亲友圈创建人才能解散亲友圈';
                break;
            case 3:
                str = '还有成员正在进行游戏，不能解散房间';
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },
    /**
     * 赋予玩家权限
     */
    on_msg_club_manage_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_manage_req');

        var str = '权限修改成功'
        switch (msg.retCode) {
            case 0:
                club_Mgr.updateClubMemberRights(msg.userId, msg.gameRightsList, msg.clubId);

                club_Ed.notifyEvent(club_Event.CLUB_CHANGE_RIGHTS, [msg.userId, msg.gameRightsList, msg.clubId]);

                if(msg.clubId != club_Mgr.getSelectClubId()){
                    return;
                }
                break;
            case 2:
                str = '玩家不存在';
                break;
            case 3:
                str = '权限不足，只有亲友圈创建人才能赋予玩家权限';
                break;
            case 4:
                str = '设置错误';
                break;
            case 5:
                str = '体验亲友圈不能设置管理员';
            case 6:
                str = '不能设置为群主'
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    /**
     * 踢人
     */
    on_msg_kick_club_role_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_kick_club_role_req');

        var str = '已经将玩家请出亲友圈';
        switch (msg.retCode) {
            case 0:
                club_Mgr.deleteClubMemberById(msg.kickUserId);
                club_Mgr.updateClubMemberCount(msg.clubId);
                club_Ed.notifyEvent(club_Event.CLUB_kICK_PLAYER_OUT, msg.kickUserId);
                if (msg.kickUserId == cc.dd.user.id)
                    str = '您已经被亲友圈管理员请出亲友圈!';
                break;
            case 1:
                str = '亲友圈不存在，操作失败';
                break;
            case 2:
                str = '不能请出自己';
                break;
            case 3:
                str = '玩家没有在亲友圈中';
                break;
            case 4:
                str = '没有请出权限';
                break;
            case 5:
                str = '玩家正在游戏中，不能请出玩家';
                break;
            case 6:
                str = '玩家积分不为0,不能请出玩家';
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    /**
     * 离开俱乐部消息
     */
    on_msg_leave_club_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_leave_club_req');

        var str = '退出亲友圈成功'
        switch (msg.retCode) {
            case 0:
                if (msg.leaveUserId == cc.dd.user.id) {
                    club_Mgr.quitClub(msg.clubId);
                    club_Ed.notifyEvent(club_Event.CLUB_QUIT_OR_DISSOLVE);
                    cc.dd.PromptBoxUtil.show(str);
                } else {
                    club_Mgr.deleteClubMemberById(msg.leaveUserId);
                    club_Mgr.updateClubMemberCount(msg.clubId);
                    club_Ed.notifyEvent(club_Event.CLUB_kICK_PLAYER_OUT, msg.leaveUserId);
                }
                break;
            case 1:
                str = '群主不能退出亲友圈';
                cc.dd.PromptBoxUtil.show(str);
                break;
            case 2:
                str = '您的积分不为0,不能退出';
                cc.dd.PromptBoxUtil.show(str);
                break;
        }
    },

    /**
     * 代开房间成功
     */
    on_msg_club_room_update: function (msg) {
        // club_Ed.notifyEvent(club_Event.CLUB_CREATE_MATCH_SUCCESS);
        if (msg.roomId) {
            let _msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
            _msg.setRoomId(msg.roomId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, _msg, 'cmd_msg_room_pre_enter_req', true);
        }
    },

    /**
     * 刷新俱乐部桌子数据返回
     */
    on_msg_club_refresh_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_refresh_req');

        if (msg.retCode != 0) {
            switch (msg.retCode) {
                case 1:
                    cc.dd.PromptBoxUtil.show('请求操作频繁,请5秒后重新尝试');
                    break;
            }

            return;
        }

        let info = club_Mgr.getRoomInfo(msg.clubId, msg.baofang);
        if (info) {
            info.clubRoom = msg.roomsList;
            info.deskWaitSum = msg.deskWaitSum;
            info.deskWorkSum = msg.deskWorkSum;
        }

        club_Mgr.setSelectClubId(msg.clubId);
        club_Ed.notifyEvent(club_Event.CLUB_REFRESH_DESK, info);
    },

    /**
     * 解散桌子消息返回
     */
    on_msg_club_dissolve_room_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_dissolve_room_req');

        if (msg.retCode != 0) {
            var str = '';
            switch (msg.retCode) {
                case 1:
                    str = '房间不存在';
                    break;
                case 2:
                    str = '游戏已经开始，不能解散房间';
                    break;
                case 3:
                    str = '权限不足，不能解散房间';
                    break;
                case 4:
                    str = '解散失败';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);
            return;
        }
        cc.dd.PromptBoxUtil.show('房间已被解散');
        club_Mgr.deleteClubDesk(msg.clubId, msg.roomId);
        club_Ed.notifyEvent(club_Event.CLUB_DISSOLVE_GAME_DESK);
    },

    /**
     * 踢出玩家
     */
    on_msg_club_room_kickout_ret: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_room_kickout_req');

        if (msg.retCode != 0)
            return;
        // club_Mgr.deleteDeskPlayer(msg.roomId, msg.kickUserId);
        club_Ed.notifyEvent(club_Event.CLUB_DESK_DELETE_PLAYER, msg);
    },

    /**
     * 俱乐部游戏记录
     */
    on_msg_club_battle_history_ack: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_battle_history_req');
        if (cc._useChifengUI) {
            let MEMBER = require('klb_friend_group_enum').MEMBER;
            if (cc.dd.user.clubJob == MEMBER.NORMAL) {
                for (var i = msg.detailList.length - 1; i > -1; i--) {
                    var containSelf = false;
                    for (var j = 0; j < msg.detailList[i].resultList.length; j++) {
                        if (msg.detailList[i].resultList[j].userId == cc.dd.user.id) {
                            containSelf = true;
                            break;
                        }
                    }
                    if (!containSelf)
                        msg.detailList.splice(i, 1);
                }
            }
        }
        if (cc._clubBattleList == null) {
            cc._clubBattleList = msg;
        }
        else {
            if (msg.clubid == cc._clubBattleList.clubid) {
                for (var i = 0; i < msg.detailList.length; i++) {
                    cc._clubBattleList.detailList.push(msg.detailList[i]);
                }
                cc._clubBattleList.selfRoom += msg.selfRoom;
                cc._clubBattleList.selfRoomCards += msg.selfRoomCards;
                cc._clubBattleList.matchRoom += msg.matchRoom;
                cc._clubBattleList.matchRoomCards += msg.matchRoomCards;
            }
        }
        club_Ed.notifyEvent(club_Event.CLUB_DESK_BATTLE_LIST, msg);
    },

    /**
     * 俱乐部游戏记录
     */


    /**
     * 被邀请人登录任务
     * @param msg
     */
    on_msg_invited_task_reward: function (msg) {

        // cc.dd.UIMgr.openUI("gameyj_hall/prefabs/hall_invited_task_reward",function (node) {
        //     let ui = node.getComponent("hall_invited_task_reward");
        //     if(ui){
        //         ui.updateUI(msg.itemNum);
        //     }
        // });
    },

    on_msg_club_change_score_ret(msg) {
        if (msg.retCode == 0) {
            club_Mgr.getClubInfoByClubId(msg.clubId).clubScore = msg.clubScore;

            if (msg.userId == cc.dd.user.id) {
                club_Mgr.getClubInfoByClubId(msg.clubId).userScore = msg.userScore;
            }

            var playerlist = club_Mgr.getClubMembersList();
            if (playerlist) {
                for (var i = 0; i < playerlist.length; i++) {
                    if (playerlist[i].userid == msg.userId) {
                        playerlist[i].score = msg.userScore;
                    }
                }
            }
            club_Ed.notifyEvent(club_Event.CLUB_CHANGE_SCORE, msg);
        }
        else if (msg.retCode == 6) {
            cc.dd.PromptBoxUtil.show('玩家游戏中,不能修改积分');
        }

    },

    on_msg_clue_update_score(msg) {
        if (msg.userId == 0) {
            club_Mgr.getClubInfoByClubId(msg.clubId).clubScore = msg.userScore;
        }
        else {
            if (club_Mgr.getClubMember(msg.userId)) {
                club_Mgr.getClubMember(msg.userId).score = msg.userScore;
            }
            if (msg.userId == cc.dd.user.id) {
                club_Mgr.getClubInfoByClubId(msg.clubId).userScore = msg.userScore;
            }
        }
        club_Ed.notifyEvent(club_Event.CLUB_UPDATE_SCORE, msg);
    },

    /******************************俱乐部回复end***********************************/
    //请求包房
    on_msg_club_baofang_list_ack(msg) {
        cc._wait_club_baofang_list = 0;

        cc.dd.NetWaitUtil.net_wait_end('msg_club_baofang_list_req');

        let str = "";
        switch (msg.result) {
            case 0:
                club_Mgr.setClubRoomInfo(msg);
                club_Ed.notifyEvent(club_Event.FRIEND_UPDATE_ROOM);

                //从分享加入亲友圈并游戏，先获取包厢信息
                if(cc.JOIN_FRIEND_AND_PLAY && cc.JOIN_FRIEND_AND_PLAY.state == 1){
                    if(msg.wanfanumList.indexOf(cc.JOIN_FRIEND_AND_PLAY.wanfaNum) == -1){
                        cc.dd.DialogBoxUtil.show(0, '包厢不存在', 'text33', null, ()=> {
                            cc.JOIN_FRIEND_AND_PLAY.failedCall();
                        });
                    }else{
                        cc.JOIN_FRIEND_AND_PLAY.state = 2;
                        cc.JOIN_FRIEND_AND_PLAY.rule = msg.ruleList[cc.JOIN_FRIEND_AND_PLAY.wanfaNum - 1];
                        cc.JOIN_FRIEND_AND_PLAY.reEnter();
                    }
                }

                return;
            case -10:
                str = "亲友圈已解散";
                club_Ed.notifyEvent(club_Event.CLUB_QUIT_OR_DISSOLVE);
                break;
        }
        if(cc.JOIN_FRIEND_AND_PLAY && cc.JOIN_FRIEND_AND_PLAY.state == 1){
            cc.dd.DialogBoxUtil.show(0, str, 'text33', null, ()=> {
                cc.JOIN_FRIEND_AND_PLAY.failedCall();
            });
        }else{
            cc.dd.PromptBoxUtil.show(str);
        }
    },

    //创建包房
    on_msg_club_create_baofang_ack(msg) {
        let str = "未知失败";
        switch (msg.result) {
            case 0:
                str = "创建包厢成功";
                club_Mgr.setLastRoomID(msg.wanfanum);
                club_Ed.notifyEvent(club_Event.FRIEND_CREATE_ROOM);
                break;
            case -1:
                str = "只能创建10个包厢";
                break;
            case -2:
                str = "权限不足，只有群主才能创建包厢";
                break;
            case -3:
                str = "包厢已存在，不能重复创建";
                break;
            case -10:
                str = "未知失败";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);

    },

    //包房详细信息
    on_msg_club_baofang_detail_ack(msg) {
        cc._wait_club_baofang_enter = null;

        cc.dd.NetWaitUtil.net_wait_end('msg_club_baofang_detail_req');
        let str = "";
        switch (msg.result) {
            case 0:
                let info = club_Mgr.getRoomInfo(club_Mgr.getSelectClubId(), msg.wanfanum);
                if (info) {
                    info.clubRoom = msg.roomsList;
                    info.deskWaitSum = msg.deskWaitSum;
                    info.deskWorkSum = msg.deskWorkSum;
                }
                club_Mgr.setLastRoomID(msg.wanfanum);
                club_Ed.notifyEvent(club_Event.FRIEND_BAOFANG_DETAIL, info);

                //从分享加入亲友圈并游戏
                if(cc.JOIN_FRIEND_AND_PLAY && cc.JOIN_FRIEND_AND_PLAY.state == 2){
                    let enter = false;
                    for(let i = 0; i < 20; i++){
                        if(i < msg.roomsList.length){
                            let room = msg.roomsList[i];
                            if(room){
                                if(room.curUserNum != room.maxUserNum){
                                    enter = true;
                                    if(room.state == 0){
                                        cc.JOIN_FRIEND_AND_PLAY.sitFunc(room.roomId);
                                    }else{
                                        if(cc.JOIN_FRIEND_AND_PLAY.rule.rulePublic && cc.JOIN_FRIEND_AND_PLAY.rule.rulePublic.isCanEnter){
                                            cc.JOIN_FRIEND_AND_PLAY.joinFunc(room.roomId);
                                        }else{
                                            continue;
                                        }
                                    }
                                    break;
                                }else{
                                    continue;
                                }
                            }else{
                                enter = true;
                                cc.JOIN_FRIEND_AND_PLAY.createFunc(i);
                                break;
                            }
                        }else{
                            enter = true;
                            cc.JOIN_FRIEND_AND_PLAY.createFunc(i);
                            break;
                        }
                    }

                    if(!enter){
                        cc.dd.DialogBoxUtil.show(0, '包厢桌子已满', 'text33', ()=> {
                            cc.JOIN_FRIEND_AND_PLAY.failedCall();
                        });
                    }
                }
                return;
            case -1:
                str = "包厢不存在，请重新进入亲友圈刷新";
                break;
            case -10:
                str = "未知失败";
                break;
        }

        if(cc.JOIN_FRIEND_AND_PLAY && cc.JOIN_FRIEND_AND_PLAY.state == 2){
            cc.dd.DialogBoxUtil.show(0, str, 'text33', null, ()=> {
                cc.JOIN_FRIEND_AND_PLAY.failedCall();
            });
        }else{
            cc.dd.PromptBoxUtil.show(str);
        }

    },

    //删除包房
    on_msg_club_del_baofang_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_del_baofang_req');
        let str = "";
        switch (msg.result) {
            case 0:
                str = "删除包厢成功";
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_DELETE_ROOM, msg);
                break;
            case -1:
                str = "没有权限，不能删除包厢";
                break;
            case -2:
                str = "还有玩家正在进行游戏，不能删除包厢";
                break;
            case -3:
                str = "包厢不存在，请重新进入亲友圈刷新";
                break;
            case -10:
                str = "未知失败";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    // //坐下
    // on_msg_club_room_site_ack(msg){
    //     cc.dd.NetWaitUtil.net_wait_end('msg_club_room_site_req');
    //     let str = "";
    //     switch(msg.result){
    //         case 0:
    //             return;
    //         case -1:
    //             str = "该桌子不属于该俱乐部";
    //             break;
    //         case -2:
    //             str = "包厢不存在";
    //             break;
    //         case -3:
    //             str = "桌子不存在，或已被其他人创建";
    //             break;
    //         case -10:
    //             str = "未知失败";
    //             break;
    //     }
    //     cc.dd.PromptBoxUtil.show(str);
    // },

    //修改公告
    on_msg_club_change_notice_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_change_notice_req');
        let str = "";
        switch (msg.result) {
            case 0:
                str = "修改成功";
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_ANNOUNCEMENT, msg);
                break;
            case -1:
                str = "没有权限，不能修改公告";
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_ANNOUNCEMENT, msg);
                break;
            case -10:
                str = "未知失败";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    //公告
    on_msg_club_notice_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_notice_req');
        let str = "";
        switch (msg.result) {
            case 0:
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_ANNOUNCEMENT, msg);
                return;
            case -1:
                str = "没有权限，不能修改公告";
                break;
            case -10:
                str = "未知失败";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    /////////////////聊天相关/////////////////////
    //接收消息
    on_msg_club_chatRet(msg) {
        let str = "";
        switch (msg.retCode) {
            case 0:
                let base64 = decodeURIComponent(msg.chat);
                msg.chat = cc.dd.SysTools.decode64(base64);
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CHAT_BROADCAST, msg);
                return;
            case -1:
                str = "消息发送失败";
                break;
            case -2:
                str = "您已被禁言";
                break;
            case -10:
                str = "未知失败";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },
    //游戏房间邀请消息
    on_msg_club_chat_desk_ack(msg) {
        let base64 = decodeURIComponent(msg.chat);
        msg.chat = cc.dd.SysTools.decode64(base64);
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CHAT_DESK_BROADCAST, msg);
        // let str = "";
        // switch(msg.result){
        //     case 0:
        //         return;
        //     case -1:
        //         str = "消息发送失败";
        //         break;
        //     case -10:
        //         str = "未知失败";
        //         break;
        // }
        // cc.dd.PromptBoxUtil.show(str);
    },
    //人数更新
    on_msg_club_chat_player_sum_change_cast(msg) {
        let clubInfo = club_Mgr.getClubInfoByClubId(msg.clubId);
        if (clubInfo) {
            clubInfo.memberLength = msg.allSum;
        }
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CHAT_UPDATE, msg);
    },
    //聊天成员
    on_msg_club_chat_all_player_ack(msg) {
        let str = "";
        switch (msg.result) {
            case 0:
                if (this.chatNeedClean) {
                    club_Mgr.cleanChatMember(msg.clubId);
                }
                club_Mgr.addChatMembersList(msg.clubId, msg.playersList);

                if (msg.page != msg.allPage) {
                    this.chatNeedClean = false;
                } else {
                    this.chatNeedClean = true;
                    club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CHAT_MEMBER);
                }

                return;
            case -1:
                str = "没有找到该亲友圈，亲友圈ID" + club_Mgr.getSelectClubId();
                break;
            case -2:
                str = "你不是该亲友圈成员，亲友圈ID" + club_Mgr.getSelectClubId();
                break;
            case -3://操作频繁
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CHAT_MEMBER);
                return;
            case -10:
                str = "未知失败";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },
    //禁言
    on_msg_club_chat_stop_talk_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_chat_stop_talk_req');
        let str = "";
        switch (msg.result) {
            case 0:
                if (msg.state == 1) {
                    if (msg.playerId == cc.dd.user.id) {
                        str = "您已被禁言";
                    } else {
                        str = "禁言成功";
                    }
                } else {
                    if (msg.playerId == cc.dd.user.id) {
                        str = "您已被解除禁言";
                    } else {
                        str = "解禁成功";
                    }
                }

                if (msg.playerId == 0) {
                    let info = club_Mgr.getClubInfoByClubId(club_Mgr.getSelectClubId());
                    let memberLiet = club_Mgr.getChatMembersList(club_Mgr.getSelectClubId());
                    let managerList = club_Mgr.getManager();
                    for (let i = 0; i < memberLiet.length; i++) {
                        if (managerList.indexOf(memberLiet[i].id) == -1 && memberLiet[i].id != cc.dd.user.id && memberLiet[i].id != info.owneruserid) {
                            memberLiet[i].state = msg.state;
                        }
                    }
                } else {
                    let member = club_Mgr.getChatMember(msg.playerId);
                    member.state = msg.state;
                }

                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CHAT_MEMBER);
                break;
            case -1:
                str = "不能给群主和管理员禁言";
                break;
            case -2:
                str = "该玩家不存在";
                break;
            case -3:
                str = "请求操作频繁,请5秒后重新尝试";
                break;
            case -4:
                str = "不能给自己禁言";
                break;
            case -10:
                str = "未知失败";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    /////////////////红包相关/////////////////////
    //获取红包list
    on_msg_club_red_bag_list_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_club_red_bag_list_req');
        club_Mgr.setRedBagPage(msg.page, msg.allPage);
        club_Mgr.setRedBagList(msg.bagsList);
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_RED_BAG);
    },

    //抢红包
    on_msg_rob_bag_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_rob_bag_req');
        let str = "";
        switch (msg.result) {
            case 0:
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_OPEN_RED_BAG, msg);
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CLOSE_RED_BAG_ANIM);
            case -1:
                if (msg.result == -1) {
                    str = "红包已经被抢完";
                    cc.dd.PromptBoxUtil.show(str);
                    club_Ed.notifyEvent(club_Event.FRIEND_GROUP_OPEN_RED_BAG, msg);
                }
                let redBag = club_Mgr.getRedBag(msg.id);
                if (redBag) {
                    redBag.leftSum = msg.result == -1 ? 0 : msg.leftSum;
                }
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_RED_BAG);
                return;
            case -2:
                str = "红包不存在";
                break;
            case -3:
                str = "不属于该亲友圈";
                break;
            case -4:
                str = "已经抢过了";
                break;
            case -10:
                str = "其他错误";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    //红包广播
    on_red_bag_cast(msg) {
        let redBag = club_Mgr.getRedBag(msg.info.id);
        if (redBag) {
            return;
        }

        club_Mgr.addRedBagList(msg.info);
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_GET_RED_BAG, msg.info);
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_RED_BAG);
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_SHOW_RED_BAG_ANIM);
    },

    //红包详情
    on_msg_red_bag_detail_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_red_bag_detail_req');
        let str = "";
        switch (msg.result) {
            case 0:
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_SHOW_RED_BAG, msg);
                return;
            case -10:
                str = "其他错误";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    //发红包
    on_msg_club_share_red_bag_ack(msg) {
        // cc.dd.NetWaitUtil.net_wait_end('msg_club_share_red_bag_req');
        let str = "";
        switch (msg.result) {
            case 0:
                str = "红包发送成功";
                break;
            case -1:
                str = "金额不足";
                break;
            case -2:
                str = "每个人不够最小值分";
                break;
            case -3:
                str = "没有权限";
                break;
            case -4:
                str = "不是该亲友圈成员";
                break;
            case -5:
                str = "余额不足";
                break;
            case -6:
                str = "操作过于频繁";
                break;
            case -7:
                str = "超过最大值";
                break;
            case -10:
                str = "其他错误";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    //玩家坐下
    on_msg_club_baofang_site_cast(msg) {
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_BAOFANG_INFO, msg);
    },

    //代开战绩
    on_msg_friend_create_battle_history_ret(msg) {
        Hall.HallED.notifyEvent(Hall.HallEvent.CHIFENG_DAIKAI_HISTORY, msg);
    },

    //解散房间
    on_msg_friend_create_dissolve_room_ret(msg) {
        club_Ed.notifyEvent(club_Event.FRIEND_DISSOLVE_ROOM_RET, msg);
    },

    //排行榜
    on_msg_club_rank_ack(msg) {
        switch (msg.result) {
            case 0:
                club_Mgr.setRankList(msg);
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_RANK, msg);
                break;
            default:
                break;
        }
    },

    //邀请
    on_msg_club_invite_ack(msg) {
        let str = "";
        switch (msg.result) {
            case 0:
                str = "邀请信息已发送";
                break;
            case -1:
                str = "该玩家已经是亲友圈成员";
                break;
            case -2:
                str = "没有权限";
                break;
            case -3:
                str = "邀请玩家不在线";
                break;
            default:
                str = "其他错误";
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    //邀请广播
    on_msg_club_invite(msg) {
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_INVITE, msg);
    },

    //开张
    on_msg_club_open_ack(msg) {
        let str = "";
        switch (msg.result) {
            case 0:
                break;
            case -1:
                str = "没有权限";
                cc.dd.PromptBoxUtil.show(str);
                break;
            case -10:
                str = "其他错误";
                cc.dd.PromptBoxUtil.show(str);
                break;
            default:
                break;
        }
    },

    //打烊
    on_msg_club_close_ack(msg) {
        let str = "";
        switch (msg.result) {
            case 0:
                break;
            case -1:
                str = "没有权限";
                cc.dd.PromptBoxUtil.show(str);
                break;
            case -10:
                str = "其他错误";
                cc.dd.PromptBoxUtil.show(str);
                break;
            default:
                break;
        }
    },

    //状态广播
    on_msg_club_state_cast(msg) {
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_STATE, msg);
    },

    //单局战绩
    on_msg_get_battle_history_detail_ret(msg) {
        cc.dd.UIMgr.openUI('gameyj_hall/prefabs/chifeng/chifeng_hall_history_detail', function (ui) {
            ui.getComponent('chifeng_hall_history_detail').initItem(msg);
        })
    },

    on_msg_club_personal_battle_record_ret(msg){
        switch (msg.retCode) {
            case 0:
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_PERSON_RANK, msg);
                break;
            case 1:
                cc.dd.PromptBoxUtil.show("不在亲友圈内");
                break;
            case 2:
                cc.dd.PromptBoxUtil.show("当前日期不可查");
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_PERSON_RANK, msg);
                break;
            default:
                break;
        }
    },

    on_msg_club_change_baofang_name_ack(msg){
        let str = ''
        cc.dd.NetWaitUtil.net_wait_end('msg_club_change_baofang_name_req');

        switch(msg.result){
            case 0:
                str = '已修改包厢备注名';
                cc.dd.PromptBoxUtil.show(str);
                let info = club_Mgr.getRoomInfo(msg.clubId, msg.wanfanum);
                info.backName = msg.name;
                club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CHANGE_BACK_NAME, msg);
                return;
            case -1:
                str = '没有权限';
                break;
            case -2:
                str = '包厢不存在';
                break;
            case -3:
                str = '名字不符合规定';
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    on_msg_club_change_battle_history_type_ret(msg){
        let str = ''
        cc.dd.NetWaitUtil.net_wait_end('msg_club_change_battle_history_type_req');

        switch(msg.retCode){
            case 0:
                if(msg.type == 2){
                    str = '个人统计已开启';
                }else{
                    str = '个人统计已关闭';
                }
                break;
            case -1:
                str = '没有权限';
                break;
        }
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_UPDATE_PERSON_BATTLE, msg);

        let info = club_Mgr.getClubInfoByClubId(club_Mgr.getSelectClubId());
        info.battleType = msg.type;

        cc.dd.PromptBoxUtil.show(str);
    }
};

module.exports = hanlder;

