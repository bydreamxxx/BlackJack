const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;

var sender = {
    /****************************************新的俱乐部协议请求begin*************************************************/
    /**
     * 请求所有的俱乐部列表
     */
    requireALlClubList: function () {
        cc._wait_all_club_list = true;

        var obj = new cc.pb.club.msg_get_all_club_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_get_all_club_req, obj, 'msg_get_all_club_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳......', 'msg_get_all_club_req');
    },

    /**
     * 打开指定俱乐部
     */
    openClub: function (clubId) {
        var obj = new cc.pb.club.msg_open_club_req();
        obj.setClubid(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_open_club_req, obj, 'msg_open_club_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳.....', 'msg_open_club_req');
    },

    /**
     * 加入俱乐部请求
     */
    joinClubReq: function (clubId) {
        var obj = new cc.pb.club.msg_join_club_req();
        obj.setClubid(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_join_club_req, obj, 'msg_join_club_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳....', 'msg_join_club_req');
    },

    /**
     * 创建俱乐部请求
     */
    createClubReq: function (clubName, type) {
        var obj = new cc.pb.club.msg_create_club_req();
        obj.setClubName(clubName);
        obj.setType(type);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_create_club_req, obj, 'msg_create_club_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_create_club_req');
    },

    /**
     * 存房卡
     */
    saveCardToClub: function (cards, club) {
        var obj = new cc.pb.club.msg_club_store_cards_req();
        obj.setCards(cards);
        obj.setClubId(club);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_store_cards_req, obj, 'msg_club_store_cards_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳..', 'msg_club_store_cards_req');
    },

    /**
     * 请求俱乐部管理消息
     */
    managerClubReq: function (clubId) {
        if(this.managerClubReq_time){
            club_Ed.notifyEvent(club_Event.CLUB_MANAGER_OP);
            return;
        }

        this.managerClubReq_time = setTimeout(()=>{
            this.managerClubReq_time = null;
        }, 5000)

        var obj = new cc.pb.club.msg_open_club_manage_req();
        obj.setClubId(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_open_club_manage_req, obj, 'msg_open_club_manage_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳.', 'msg_open_club_manage_req');
    },

    getManagerReq(clubId){
        var obj = new cc.pb.club.msg_club_manger_req();
        obj.setClubId(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_manger_req, obj, 'msg_club_manger_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳 .', 'msg_club_manger_req');
    },

    /**
     * 修改俱乐部名字
     */
    changeClubName: function (name, clubId) {
        var obj = new cc.pb.club.msg_club_change_name_req();
        obj.setClubId(clubId);
        obj.setName(name);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_change_name_req, obj, 'msg_club_change_name_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳 ..', 'msg_club_change_name_req');
    },

    /**
     * 解散桌子
     */
    dissolveDesk: function (deskId) {
        var obj = new cc.pb.club.msg_dissolve_club_req();
        obj.setClubId(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_dissolve_club_req, obj, 'msg_dissolve_club_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳 ...', 'msg_dissolve_club_req');
    },

    /**
     * 给予/取消玩家权限
     */
    rightsReq: function (clubId, rights, userId) {
        var obj = new cc.pb.club.msg_club_manage_req();
        obj.setClubId(clubId);
        obj.setGameRightsList(rights);
        obj.setSetUserId(userId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_manage_req, obj, 'msg_club_manage_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳 ....', 'msg_club_manage_req');

    },

    /**
     * 请出俱乐部
     */
    kickOutClub: function (clubId, userId) {
        var obj = new cc.pb.club.msg_kick_club_role_req();
        obj.setClubId(clubId);
        obj.setKickUserId(userId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_kick_club_role_req, obj, 'msg_kick_club_role_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳 .....', 'msg_kick_club_role_req');
    },

    /**
     * 申请列表
     */
    applyClubListReq: function (type, clubId, userId) {
        var obj = new cc.pb.club.msg_apply_club_op_req();
        obj.setClubId(clubId);
        obj.setOpType(type);
        obj.setOpUserid(userId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_apply_club_op_req, obj, 'msg_apply_club_op_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳 ......', 'msg_apply_club_op_req');

    },


    /**
     * 解散俱乐部
     */
    dissolveClub: function (clubId) {
        var obj = new cc.pb.club.msg_dissolve_club_req();
        obj.setClubId(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_dissolve_club_req, obj, 'msg_dissolve_club_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_dissolve_club_req');
    },

    /**
     * 退出俱乐部
     */
    quitClub: function (clubId) {
        var obj = new cc.pb.club.msg_leave_club_req();
        obj.setClubid(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_leave_club_req, obj, 'msg_leave_club_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好...', 'msg_leave_club_req');
    },

    /**
     * 刷新俱乐部桌子
     */
    refreshClub: function (clubId, wanfa) {
        var obj = new cc.pb.club.msg_club_refresh_req();
        obj.setClubId(clubId);
        obj.setBaofang(wanfa);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_refresh_req, obj, 'msg_club_refresh_req', true);
        // cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_club_refresh_req');
    },

    /**
     * 解散桌子
     */
    dissolveDesk: function (clubId, deskId, gameType, wanfa, desknum) {
        var obj = new cc.pb.club.msg_club_dissolve_room_req();
        obj.setClubId(clubId);
        obj.setRoomId(deskId);
        obj.setGameType(gameType);
        obj.setWanfanum(wanfa);
        obj.setDesknum(desknum);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_dissolve_room_req, obj, 'msg_club_dissolve_room_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好......', 'msg_club_dissolve_room_req');
    },


    /**
     * 加入桌子
     */
    joinDesk: function (deskId) {
        var msg = new cc.pb.room_mgr.msg_enter_game_req();
        var game_info = new cc.pb.room_mgr.common_game_header();
        game_info.setRoomId(deskId);
        msg.setGameInfo(game_info);

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
                    msg.setLatlngInfo(loc);
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
                    msg.setLatlngInfo(loc);
                }
            }
        }

        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_game_req, msg, 'cmd_msg_enter_game_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好.....', 'msg_enter_game_req');

    },
    /**
     * 请出桌子
     */
    kickOutDesk: function (clubId, wanfa, deskId, roomId, playerId, gameType) {
        var obj = new cc.pb.club.msg_club_room_kickout_req();
        obj.setClubId(clubId);
        obj.setRoomId(roomId);
        obj.setDeskId(deskId);
        obj.setWanfanum(wanfa);
        obj.setGameType(gameType);
        obj.setKickUserId(playerId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_room_kickout_req, obj, 'msg_club_room_kickout_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好....', 'msg_club_room_kickout_req');
    },

    /**
     * 打开玩家游戏记录
     */
    getClubBattleList: function (clubId) {
        cc._clubBattleList = null;
        var obj = new cc.pb.club.msg_club_battle_history_req();
        obj.setClubid(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_battle_history_req, obj, 'msg_club_battle_history_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好..', 'msg_club_battle_history_req');
    },

    /**
     * 公告
     */
    getAnnouncement(clubId){
        var obj = new cc.pb.club.msg_club_notice_req();
        obj.setClubId(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_notice_req, obj, 'msg_club_notice_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好.', 'msg_club_notice_req');
    },

    /**
     * 修改公告
     */
    editAnnounceMent(clubId, notice){
        var obj = new cc.pb.club.msg_club_change_notice_req();
        obj.setClubId(clubId);
        obj.setNotice(notice);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_change_notice_req, obj, 'msg_club_change_notice_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好', 'msg_club_change_notice_req');
    },
    /****************************************新的俱乐部协议请求end*************************************************/

    //请求包房
    getClubBaoFangList(clubId){
        // if(this.getClubBaoFangList_time){
        //     club_Ed.notifyEvent(club_Event.FRIEND_UPDATE_ROOM);
        //     return;
        // }
        //
        // this.getClubBaoFangList_time = setTimeout(()=>{
        //     this.getClubBaoFangList_time = null;
        // }, 5000)

        cc._wait_club_baofang_list = clubId;

        var obj = new cc.pb.club.msg_club_baofang_list_req();
        obj.setClubId(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_baofang_list_req, obj, 'msg_club_baofang_list_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好 ......', 'msg_club_baofang_list_req');
    },

    //进入包房
    enterClubBaoFang(clubId, roomId){
        cc._wait_club_baofang_enter = [clubId, roomId];

        var obj = new cc.pb.club.msg_club_baofang_detail_req();
        obj.setClubId(clubId);
        obj.setWanfanum(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_baofang_detail_req, obj, 'msg_club_baofang_detail_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好 .....', 'msg_club_baofang_detail_req');
    },

    deleteBaoFang(clubId, roomId){
        var obj = new cc.pb.club.msg_club_del_baofang_req();
        obj.setClubId(clubId);
        obj.setWanfanum(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_del_baofang_req, obj, 'msg_club_del_baofang_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好 ....', 'msg_club_del_baofang_req');
    },

    //坐下
    sitDown(clubId, wanfa, deskNum, rule){
        cc.sys.localStorage.setItem('club_game_wafanum', wanfa);

        if(cc.dd._.isUndefined(rule) || cc.dd._.isNull(rule)){
            var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
            let info = club_Mgr.getRoomInfo(clubId, wanfa);
            if(info){
                let rule = info.rule.gameInfo;
                rule.clubWanfa = wanfa;
                rule.clubWanfaDesk = deskNum;
                rule.clubCreateType = 2;

                info.rule.getContent = function(){
                    let content = {};
                    content.gameInfo = this.gameInfo;
                    content.rule = this.rule;
                    content.latlngInfo = this.latlngInfo;
                    content.rulePublic = this.rulePublic;

                    return content;
                }

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
                            info.rule.latlngInfo = loc;
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
                            info.rule.latlngInfo = loc;
                        }
                    }
                }
                if(!cc.dd.Utils.checkGPS(info.rule)){
                    cc.dd.DialogBoxUtil.show(0, "创建房间失败，无法获取定位信息", '确定', null, function () {
                    }, null);
                    return;
                }
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_create_game_req, info.rule, 'msg_create_game_req', true);
            }
        }else{

            //klb_hall_CreateRoom
            let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
            msg.setRoomId(rule.roomId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req',true);
        }
    },

    sendSit(clubId, roomId){
        var obj = new cc.pb.club.msg_club_baofang_site();
        obj.setClubId(clubId);
        obj.setRoomId(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_baofang_site, obj, 'msg_club_baofang_site', true);
    },
    /////////////////聊天相关/////////////////////
    //进入聊天室
    enterChatClub(clubId, state){
        if(cc.dd._.isNumber(clubId) && clubId != 0){
            let msg = new cc.pb.club.msg_cur_club();
            msg.setClubId(clubId);
            msg.setState(state)
            cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_cur_club, msg, 'msg_cur_club',true);
        }
    },

    //发送消息
    sendChat(clubId, chat, talkId){
        if(cc.dd._.isNull(talkId) || cc.dd._.isUndefined(talkId)){
            talkId = 0;
        }

        let msg = new cc.pb.club.msg_club_chatReq();
        msg.setClubId(clubId);
        msg.setTalkId(talkId);
        msg.setChat(chat);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_chatReq, msg, 'msg_club_chatReq',true);
    },

    //游戏房间邀请消息
    sendDeskInviteChat(roomId, chat){
        let msg = new cc.pb.club.msg_club_chat_desk_req();
        msg.setRoomId(roomId);
        msg.setChat(chat);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_chat_desk_req, msg, 'msg_club_chat_desk_req',true);
    },

    //聊天成员
    getChatPlayer(clubId){
        let msg = new cc.pb.club.msg_club_chat_all_player_req();
        msg.setClubId(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_chat_all_player_req, msg, 'msg_club_chat_all_player_req',true);
    },

    //禁言
    banPlayer(clubId, playerId, isBan, isAll){
        let msg = new cc.pb.club.msg_club_chat_stop_talk_req();
        msg.setClubId(clubId);
        msg.setType(isAll ? 1 : 0);
        msg.setPlayerId(playerId);
        msg.setState(isBan? 1 : 0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_chat_stop_talk_req, msg, 'msg_club_chat_stop_talk_req',true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好 ...', 'msg_club_chat_stop_talk_req');
    },

    /////////////////红包相关/////////////////////
    //获取红包列表
    getAllRedBagList(clubId, page){
        let msg = new cc.pb.club.msg_club_red_bag_list_req();
        msg.setClubId(clubId);
        msg.setPage(page);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_red_bag_list_req, msg, 'msg_club_red_bag_list_req',true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好 ..', 'msg_club_red_bag_list_req');
    },
    //抢红包
    robRedBag(clubId, id){
        let msg = new cc.pb.club.msg_rob_bag_req();
        msg.setClubId(clubId);
        msg.setId(id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_rob_bag_req, msg, 'msg_rob_bag_req',true);
        cc.dd.NetWaitUtil.net_wait_start('网络不太好 .', 'msg_rob_bag_req');
    },

    //红包详情
    checkRedBag(clubId, id){
        let msg = new cc.pb.club.msg_red_bag_detail_req();
        msg.setClubId(clubId);
        msg.setId(id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_red_bag_detail_req, msg, 'msg_red_bag_detail_req',true);
        cc.dd.NetWaitUtil.net_wait_start('网络有点小状况...', 'msg_red_bag_detail_req');
    },

    //发红包
    sendRedBag(clubId, type, coins, sum, chat){
        chat = encodeURIComponent(cc.dd.SysTools.encode64('恭喜发财，大吉大利！'))
        let msg = new cc.pb.club.msg_club_share_red_bag_req();
        msg.setClubId(clubId);
        msg.setType(type);
        msg.setCoins(coins);
        msg.setSum(sum);
        msg.setMsg(chat);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_share_red_bag_req, msg, 'msg_club_share_red_bag_req',true);
        // cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_club_share_red_bag_req');
    },

    /////////////////排行榜/////////////////////
    getRank(clubId, type, gameType){
        let msg = new cc.pb.club.msg_club_rank_req();
        msg.setClubId(clubId);
        msg.setType(type);
        msg.setGameType(gameType);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_rank_req, msg, 'msg_club_rank_req',true);
    },

    /////////////////邀请/////////////////////
    invite(clubId, userId){
        let msg = new cc.pb.club.msg_club_invite_req();
        msg.setClubId(clubId);
        msg.setUserId(parseInt(userId));
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_invite_req, msg, 'msg_club_invite_req',true);
    },

    /////////////////开张/////////////////////
    openTable(clubId){
        let msg = new cc.pb.club.msg_club_open_req();
        msg.setClubId(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_open_req, msg, 'msg_club_open_req',true);
    },

    /////////////////打烊/////////////////////
    closeTable(clubId){
        let msg = new cc.pb.club.msg_club_close_req();
        msg.setClubId(clubId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_close_req, msg, 'msg_club_close_req',true);
    },

    /////////////////个人战绩/////////////////////
    sendPersonRank(clubId, date){
        let msg = new cc.pb.club.msg_club_personal_battle_record_req();
        msg.setClubid(clubId);
        msg.setDate(date);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_personal_battle_record_req, msg, 'msg_club_personal_battle_record_req',true);
    },

    /////////////////包厢备注/////////////////////
    changeBackName: function (name, clubId, wanfa) {
        var obj = new cc.pb.club.msg_club_change_baofang_name_req();
        obj.setClubId(clubId);
        obj.setName(name);
        obj.setWanfanum(wanfa);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_change_baofang_name_req, obj, 'msg_club_change_baofang_name_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳 ..', 'msg_club_change_baofang_name_req');
    },

    /////////////////开放个人统计/////////////////////
    openPersonalBattle: function (clubId, type) {
        var obj = new cc.pb.club.msg_club_change_battle_history_type_req();
        obj.setClubId(clubId);
        obj.setType(type);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_change_battle_history_type_req, obj, 'msg_club_change_battle_history_type_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳 ..', 'msg_club_change_battle_history_type_req');
    },
};

module.exports = sender;
