// create by wj 2018/04/23

const klbClubEvent = cc.Enum({
    CLUB_INIT_CLUB_LIST: 'club_init_club_list',//初始化俱乐部列表
    CLUB_OPEN_SUCCESS: 'club_open_success', //打开俱乐部成功
    CLUB_CREATE_SUCCESS: 'club_create_success', //创建俱乐部成功
    CLUB_APPLY_NUM_CHANGE: 'club_apply_num_change', //申请加入俱乐部的个数改变
    CLUB_SAVE_CARD_SUCCESS: 'club_save_card_success',//存入房卡成功
    CLUB_MANAGER_OP: 'club_manager_op',// 进入俱乐部管理界面
    CLUB_CHANGE_RIGHTS: 'club_change_rights', //更新俱乐部权限
    CLUB_CHANGE_NAME: 'club_change_name', //俱乐部修改名字
    CLUB_REQ_APPLY_LIST: 'club_apply_List',//俱乐部申请列表返回
    CLUB_OP_APPLY_PLAYER: 'club_op_apply_player',//俱乐部操作申请玩家
    CLUB_QUIT_OR_DISSOLVE: 'club_ quit_or_dissolve', //俱乐部退出或者解散
    CLUB_kICK_PLAYER_OUT: 'club_kick_player_out', //俱乐部踢出玩家
    CLUB_REFRESH_DESK: 'club_refresh_desk', //俱乐部更新桌子列表
    CLUB_CREATE_MATCH_SUCCESS: 'club_create_match_success', //俱乐部代开房间成功
    CLUB_DISSOLVE_GAME_DESK: 'club_dissolve_game_desk', //俱乐部解散桌子
    CLUB_DESK_DELETE_PLAYER: 'club_desk_delete_player', //俱乐部请出玩家
    CLUB_DESK_BATTLE_LIST: 'club_battle_history', //俱乐部战绩
    CLUB_CARDS_UPDATE: 'club_cards_update', //俱乐部房卡更新
    CLUB_CLOSE_MAINUI: 'club_close_mainui', //俱乐部关掉主界面
    CLUB_CLOSE_JOIN_UI: 'club_cloe_join_ui', //俱乐部关掉加入界面
    CLUB_CLOSE_CREATE_UI: 'club_close_create_ui', //俱乐部关掉创建界面
    CLUB_CHANGE_SCORE: 'CLUB_CHANGE_SCORE',//修改分数
    CLUB_UPDATE_SCORE: 'CLUB_UPDATE_SCORE',//更新分数
    // CLUB_PLAYER_JOIN:'club_player_join',
    // CLUB_PLAYER_EXIT:'club_player_exit',
    // CLUB_ROOM_RULE_ADD:'club_room_rule_add',
    // CLUB_ROOM_RULE_DEL:'club_room_rule_del',
    // CLUB_COST_CARDS:'club_cost_cards',
    // CLUB_OPEN_ROOM:'club_open_room',
    // CLUB_ALL_APPLY_MEMBER:'club_all_apply_member',
    // CLUB_DEL_APPLY_MEMBER:'club_del_apply_member',
    // CLUB_UPDATE_ROOM_ROLE_NUM:'club_update_room_role_num',
    // CLUB_UPDATE_SET_DATA:'club_update_set_data',
    // CLUB_CLEAR_CHAT_LOG:'club_clear_chat_log',
    // CLUB_UPDATE_CLUB_SET: 'club_update_club_set',
    FRIEND_CHANGE_LOBBY: 'FRIEND_CHANGE_LOBBY',//进入亲友圈大厅
    FRIEND_APPLY_SUCCESS: 'FRIEND_APPLY_SUCCESS',//申请加入亲友圈成功
    FRIEND_CREATE_ROOM: 'FRIEND_CREATE_ROOM',//创建包房
    FRIEND_UPDATE_ROOM: 'FRIEND_UPDATE_ROOM',//更新包房
    FRIEND_BAOFANG_DETAIL: 'FRIEND_BAOFANG_DETAIL',//包房详细信息
    FRIEND_GROUP_DELETE_ROOM: 'FRIEND_GROUP_DELETE_ROOM',//删除包房
    FRIEND_GROUP_CHAT_BROADCAST: 'FRIEND_GROUP_CHAT_BROADCAST',//聊天广播
    FRIEND_GROUP_CHAT_DESK_BROADCAST: 'FRIEND_GROUP_CHAT_DESK_BROADCAST',//开房广播
    FRIEND_GROUP_CHAT_UPDATE: 'FRIEND_GROUP_CHAT_UPDATE',//聊天人数更新
    FRIEND_GROUP_CHAT_MEMBER: 'FRIEND_GROUP_CHAT_MEMBER',//聊天成员
    FRIEND_GROUP_CLEAN_CHAT: 'FRIEND_GROUP_CLEAN_CHAT',//清空聊天记录
    FRIEND_GROUP_UPDATE_RED_BAG: 'FRIEND_GROUP_UPDATE_RED_BAG',//红包数更新
    FRIEND_GROUP_GET_RED_BAG: 'FRIEND_GROUP_GET_RED_BAG',//获得红包
    FRIEND_GROUP_OPEN_RED_BAG: 'FRIEND_GROUP_OPEN_RED_BAG',//打开红包
    FRIEND_GROUP_SHOW_RED_BAG_ANIM: 'FRIEND_GROUP_SHOW_RED_BAG_ANIM',//显示红包icon动画
    FRIEND_GROUP_CLOSE_RED_BAG_ANIM: 'FRIEND_GROUP_CLOSE_RED_BAG_ANIM',//显示红包icon动画
    FRIEND_GROUP_SHOW_RED_BAG: 'FRIEND_GROUP_SHOW_RED_BAG',//显示红包详情
    FRIEND_GROUP_UPDATE_BAOFANG_INFO: 'FRIEND_GROUP_UPDATE_BAOFANG_INFO',//更新包房
    FRIEND_GROUP_UPDATE_ANNOUNCEMENT: 'FRIEND_GROUP_UPDATE_ANNOUNCEMENT',//更新公告
    FRIEND_DISSOLVE_ROOM_RET: 'FRIEND_DISSOLVE_ROOM_RET',//代开房间解散
    FRIEND_GROUP_UPDATE_RANK: 'FRIEND_GROUP_UPDATE_RANK',//更新排行
    FRIEND_GROUP_INVITE: 'FRIEND_GROUP_INVITE',//邀请
    FRIEND_GROUP_STATE: 'FRIEND_GROUP_STATE',//亲友圈状态
    FRIEND_GROUP_UPDATE_PERSON_RANK: 'FRIEND_GROUP_UPDATE_PERSON_RANK',//更新个人战绩
    FRIEND_GROUP_CHANGE_BACK_NAME: 'FRIEND_GROUP_CHANGE_BACK_NAME', //包厢修改备注名
    FRIEND_GROUP_UPDATE_PERSON_BATTLE: 'FRIEND_GROUP_UPDATE_PERSON_BATTLE', //更新个人统计开关

});

const klbClubEd = new cc.dd.EventDispatcher();

var klbClubMgr = cc.Class({
    properties: {
        club_List: [],  //俱乐部列表
        club_apply_List: [], //申请俱乐部列表
        club_Desk_List: [],  //俱乐部桌子列表
        selectClubId: 0, //选中的俱乐部id
        club_Apply_List: [],//俱乐部申请列表
        club_Members: [], //俱乐部的所有成员数据
        isOpen: false,
        roomType: 0, //默认1 自建， 2是代开
    },

    _instance: null,

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new klbClubMgr();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                this._instance = null;
            }
        },
    },


    //初始设置俱乐部列表
    initClubList: function (list) {
        this.club_List = list;
        for (var idx = 0; idx < this.club_List.length; idx++){
            this.club_List[idx].idx = idx;
            this.club_List[idx].roomInfo = [];
            this.club_List[idx].applyNum = 0;
            this.club_List[idx].chatMemberList = [];
            this.club_List[idx].memberLength = 0;
        }
    },

    setApplyClubList(list){
        this.club_apply_List = list;
        for (var idx = 0; idx < this.club_apply_List.length; idx++){
            this.club_apply_List[idx].roomInfo = [];
            this.club_apply_List[idx].applyNum = 0;
        }
    },
    /**
     * 创建俱乐部
     */
    createClub: function (club) {
        club.applyNum = 0;
        this.club_List.splice(0, 0, club)
    },
    /**
     * 退出/解散俱乐部
     */
    quitClub: function (clubId) {
        for (var idx = 0; idx < this.club_List.length; idx++) {
            if (this.club_List[idx].clubid == clubId) {
                this.club_List.splice(idx, 1);
                return;
            }
        }
    },
    /**
     * 获取俱乐部列表
     */
    getClubList: function () {
        return this.club_List;
    },

    /**
     * 根据俱乐部id获取俱乐部数据
     */
    getClubInfoByClubId: function (clubId) {
        for (var idx = 0; idx < this.club_List.length; idx++) {
            if (this.club_List[idx].clubid == clubId)
                return this.club_List[idx];
        }
    },

    /**
     * 判定是否加入了俱乐部
     */
    checkIsJoinClub: function () {
        if (this.club_List.length != 0)
            return true;
        return false;
    },

    /**
     * 检索俱乐部是否为自己创建
     */
    checkIsClubOwner: function () {
        for (var idx = 0; idx < this.club_List.length; idx++) {
            if (this.club_List[idx].owneruserid == cc.dd.user.id)
                return true;
        }
        return false;
    },

    /**
     * 设置选中的俱乐部id
     */
    setSelectClubId: function (clubId) {
        this.selectClubId = clubId;
    },

    /**
     * 获取选中的俱乐部id
     */
    getSelectClubId: function () {
        return this.selectClubId;
    },

    /**
     * 更新俱乐部数据
     */
    resetSelctClubInfo: function (clubId, clubInfo) {
        var info = this.getClubInfoByClubId(clubId);
        if (info) {
            info.clubScore = clubInfo.clubScore;
            info.userScore = clubInfo.userScore;
            if (info.applyNum)
                clubInfo.applyNum = info.applyNum;
            if(info.chatMemberList)
                clubInfo.chatMemberList = info.chatMemberList;
            if(info.hasOwnProperty('idx'))
                clubInfo.idx = info.idx;
            info = clubInfo;
            if(clubInfo.hasOwnProperty('membersList')){
                this.setClubMembersList(clubInfo.membersList);
                info.memberLength = clubInfo.membersList.length;
            }
        }
    },

    /**
     * 设置俱乐部的申请人数
     */
    setClubApplyNum: function (clubId) {
        var clubInfo = this.getClubInfoByClubId(clubId);
        if (clubInfo) {
            if (cc.dd._.isUndefined(clubInfo.applyNum))
                clubInfo.applyNum = 0;
            clubInfo.applyNum += 1;
        }
    },

    deleteApplyNum: function (clubId) {
        var clubInfo = this.getClubInfoByClubId(clubId);
        if (clubInfo) {
            if (cc.dd._.isUndefined(clubInfo.applyNum))
                clubInfo.applyNum = 0;
            clubInfo.applyNum -= 1;
            if(clubInfo.applyNum < 0){
                clubInfo.applyNum = 0;
            }
        }
    },

    /**
     * 获取设置俱乐部的申请人数
     */
    getClubApplyNum: function (clubId) {
        var clubInfo = this.getClubInfoByClubId(clubId);
        if (clubInfo && !cc.dd._.isUndefined(clubInfo.applyNum))
            return clubInfo.applyNum;
        return 0;
    },

    /**
     * 重置俱乐部申请人数
     */
    reseatApplyNum: function (clubId) {
        var clubInfo = this.getClubInfoByClubId(clubId);
        if (clubInfo)
            clubInfo.applyNum = 0;
    },
    /**
     * 修改俱乐部房卡数量
     */
    resetClubCard: function (clubId, cards) {
        var clubInfo = this.getClubInfoByClubId(clubId);
        if (clubInfo)
            clubInfo.cards = cards;
    },
    /**
     * 修改俱乐部名字
     */
    updateClubNameById: function (clubId, name) {
        var clubInfo = this.getClubInfoByClubId(clubId);
        if (clubInfo)
            clubInfo.clubname = name;
    },

    /**
     * 更新俱乐部人数
     */
    updateClubMemberCount: function (clubId) {
        var clubInfo = this.getClubInfoByClubId(clubId);
        if (clubInfo)
            clubInfo.curnum -= 1;
    },

    /**
     * 俱乐部增加 人数
     */
    addPlayeCount: function (clubId) {
        var clubInfo = this.getClubInfoByClubId(clubId);
        if (clubInfo)
            clubInfo.curnum += 1;
    },


    /**
     * 设置俱乐部玩家请求列表
     */
    setClubApplyList: function (applyList, clubId) {
        this.club_Apply_List = applyList;
        var clubInfo = this.getClubInfoByClubId(clubId);
        if (clubInfo) {
            clubInfo.applyNum = applyList.length;
        }
    },

    /**
     * 返回俱乐部玩家列表
     */
    getClubApplyList: function () {
        return this.club_Apply_List;
    },
    /**
     * 删除已经操作了等玩家
     */
    deleteClubApplyPlayerById: function (userId, clubId) {
        for (var idx = 0; idx < this.club_Apply_List.length; idx++) {
            if (this.club_Apply_List[idx].userId == userId) {
                this.club_Apply_List.splice(idx, 1);
                this.deleteApplyNum(clubId);
                return;
            }
        }
    },
    /**
     * 设置俱乐部所有玩家数据
     */
    setClubMembersList: function (memberList) {
        this.club_Members = memberList;
        let me = this.getClubMember(cc.dd.user.id);
        cc.dd.user.clubJob = me.job;
    },

    cleanClubMember(){
        this.club_Members = [];
    },

    addClubMembersList(memberList){
        this.club_Members = this.club_Members.concat(memberList);
    },

    /**
     * 获取俱乐部所有玩家数据
     */
    getClubMembersList: function () {
        return this.club_Members;
    },

    getClubMember(userId) {
        for (var idx = 0; idx < this.club_Members.length; idx++) {
            if (this.club_Members[idx].userid == userId) {
                return this.club_Members[idx];
            }
        }
        return null;
    },

    /**
     * 删除某个俱乐部成员
     */
    deleteClubMemberById: function (userId) {
        for (var idx = 0; idx < this.club_Members.length; idx++) {
            if (this.club_Members[idx].userid == userId) {
                this.club_Members.splice(idx, 1);
                return;
            }
        }
    },

    setManager: function(memberList){
        this.managersList = memberList;
    },

    getManager: function(){
        if(!cc.dd._.isArray(this.managersList)){
            this.managersList = [];
        }
        return this.managersList;
    },

    /**
     * 更新玩家的权限
     */
    updateClubMemberRights: function (userId, gameRights, clubID) {
        let MEMBER = require('klb_friend_group_enum').MEMBER;

        if(cc.dd.user.id == userId){
            let club = this.getClubInfoByClubId(clubID);
            if(club){
                club.gameRightsList = gameRights;
            }
            if(cc.dd.user.clubJob != MEMBER.OWNER && clubID == this.selectClubId){
                cc.dd.user.clubJob = gameRights.length > 2 ? MEMBER.ADMIN : MEMBER.NORMAL
            }
        }

        for (var idx = 0; idx < this.club_Members.length; idx++) {
            if (this.club_Members[idx].userid == userId) {
                this.club_Members[idx].gameRightsList = gameRights;
                if(this.club_Members[idx].job != MEMBER.OWNER){
                    this.club_Members[idx].job = this.club_Members[idx].gameRightsList.length > 2 ? MEMBER.ADMIN : MEMBER.NORMAL
                }
                return;
            }
        }
    },

    /**
     * 设置俱乐部游戏桌列表
     */
    setClubDeskList: function (deskList) {
        this.club_Desk_List = deskList;
    },

    /**
     * 获取俱乐部中的游戏桌列表
     */
    getClubDeskList: function () {
        return this.club_Desk_List;
    },

    /**
     * 清除桌子列表
     */
    clearDeskList: function () {
        this.club_Desk_List.splice(0, this.club_Desk_List.length);
    },
    /**
     * 根据桌子id获取俱乐部中某桌的具体信息
     */
    getClubDeskInfo: function (deskId) {
        for (var idx = 0; idx < this.club_Desk_List.length; idx++) {
            if (this.club_Desk_List[idx].roomId == deskId)
                return this.club_Desk_List[idx];
        }
    },

    /**
     * 计算俱乐部中不同状态的桌子有多少桌
     */
    getDeskCountByState: function (nState) {
        var count = 0;
        for (var idx = 0; idx < this.club_Desk_List.length; idx++) {
            if (this.club_Desk_List[idx].state == nState)
                count += 1;
        }
        return count;
    },

    /**
     * 增加游戏桌子
     */
    addClubDesk: function (clubId, deskInfo) {
        var clubDeskList = this.getClubDeskList(clubId);
        clubDeskList.push(deskInfo);
    },

    /**
     * 解散游戏桌子
     */
    deleteClubDesk: function (clubId, deskId) {
        if (clubId == this.selectClubId) {
            for (var idx = 0; idx < this.club_Desk_List.length; idx++) {
                if (this.club_Desk_List[idx].roomId == deskId) {
                    this.club_Desk_List.splice(idx, 1);
                }
            }
        }
    },

    /**
     * 踢出玩家
     */
    deleteDeskPlayer: function (roomId, userId) {
        var deskInfo = this.getClubDeskInfo(roomId);
        for (var idx = 0; idx < deskInfo.membersList.length; idx++) {
            if (deskInfo.membersList[idx].userid == userId)
                deskInfo.membersList.splice(idx, 1);
        }
    },

    /**
     * 设置玩家是否从俱乐部打开创建界面的标记
     */
    setClubOpenCreateUITag: function (isOpen) {
        this.isOpen = isOpen;
    },

    /**
     * 获取玩家是否从俱乐部打开创建界面的标记
     */
    getClubOpenCreateUITag: function () {
        return this.isOpen;
    },

    /**
     * 设置玩家创建房间类型
     */
    setClubCreateRoomType: function (type) {
        this.roomType = type;
    },

    /**
     * 获取玩家创建房间类型
     */
    getClubCreateRoomType: function () {
        return this.roomType;
    },

    /**
     * 设置包房信息
     * @param roomInfo
     */
    setClubRoomInfo(roomInfo){
        let list = this.getClubInfoByClubId(this.selectClubId);
        if(list){
            list.roomInfo = [];
            for(let i = 0; i < roomInfo.wanfanumList.length; i++){
                list.roomInfo.push({
                    id: roomInfo.wanfanumList[i],
                    rule: roomInfo.ruleList[i],
                    backName: cc.dd._.isString(roomInfo.baofangNameList[i]) && roomInfo.baofangNameList[i] != '' ? roomInfo.baofangNameList[i] : (roomInfo.wanfanumList[i] > 999 ? '包厢号:***' : '包厢号:'+roomInfo.wanfanumList[i])
                })
            }
        }
    },

    /**
     * 获取包房信息
     * @param clubid
     * @param roomid
     * @returns {*}
     */
    getRoomInfo(clubid, roomid){
        let list = this.getClubInfoByClubId(clubid);
        if(list){
            let roomInfo = list.roomInfo;
            if(roomInfo){
                for(let i = 0; i < roomInfo.length; i++){
                    if(roomInfo[i].id == roomid){
                        return roomInfo[i];
                    }
                }
            }
        }

        return null;
    },

    /**
     * 读取上次进入的俱乐部信息
     * @returns {*}
     */
    getLastClubInfo(){
        let local_result = cc.sys.localStorage.getItem('lastClubID');

        if(cc.dd._.isString(local_result) && local_result != "") {
            return JSON.parse(local_result);
        }

        return null
    },

    /**
     * 获取上次包房ID
     */
    getLastRoomID(){
        let result = this.getLastClubInfo();

        if(result && result.hasOwnProperty(cc.dd.user.id)){
            let info = result[cc.dd.user.id];
            if(info.hasOwnProperty(this.selectClubId)){
                return info[this.selectClubId];
            }
        }
        return null;
    },

    /**
     * 设置上次包房ID
     * @param roomID
     */
    setLastRoomID(roomID){
        let result = this.getLastClubInfo();
        if(cc.dd._.isNull(result)){
            result = {};
        }
        if(!result[cc.dd.user.id]){
            result[cc.dd.user.id] = {};
        }
        let info = result[cc.dd.user.id];
        info[this.selectClubId] = roomID;
        cc.sys.localStorage.setItem('lastClubID', JSON.stringify(result));
    },

    /**
     * 清空聊天成员
     * @param clubId
     */
    cleanChatMember(clubId){
        let info = this.getClubInfoByClubId(clubId);
        if(info){
            info.chatMemberList = [];
        }
    },

    /**
     * 添加聊天成员
     * @param clubId
     * @param playerList
     */
    addChatMembersList(clubId, playerList){
        let info = this.getClubInfoByClubId(clubId);
        if(info){
            if(!cc.dd._.isArray(info.chatMemberList)){
                info.chatMemberList = [];
            }

            info.chatMemberList = info.chatMemberList.concat(playerList);
        }
    },

    /**
     * 获得聊天成员list
     * @param clubId
     * @returns {Array}
     */
    getChatMembersList(clubId){
        let info = this.getClubInfoByClubId(clubId);
        if(info){
            if(!cc.dd._.isArray(info.chatMemberList)){
                info.chatMemberList = [];
            }
            return info.chatMemberList;
        }
        return [];
    },

    /**
     * 获得聊天成员
     * @param playerID
     * @returns {*}
     */
    getChatMember(playerID){
        let info = this.getClubInfoByClubId(this.selectClubId);
        if(info){
            for(let i = 0; i < info.chatMemberList.length; i++){
                if(info.chatMemberList[i].id == playerID){
                    return info.chatMemberList[i];
                }
            }
        }
        return null;
    },

    /**
     * 设置红包list
     * @param list
     */
    setRedBagList(list){
        if(this.getRedBagPage() == 1){
            this.club_red_bagList = [];
        }
        this.club_red_bagList = this.club_red_bagList.concat(list);
        this.club_red_bagList.sort((a, b)=>{
            return a.type - b.type;
        })
    },

    /**
     * 获得红包list
     * @returns {*|Array}
     */
    getRedBagList(){
      if(!cc.dd._.isArray(this.club_red_bagList)){
          this.club_red_bagList = [];
      }
      return this.club_red_bagList;
    },

    /**
     * 获取红包
     * @param id
     * @returns {*}
     */
    getRedBag(id){
        let list = this.getRedBagList();
        for(let i = 0; i < list.length; i++){
            if(list[i].id == id){
                return list[i];
            }
        }

        return null;
    },

    /**
     * 添加红包
     * @param info
     */
    addRedBagList(info){
        let list = this.getRedBagList();
        list.push(info);
        list.sort((a, b)=>{
            return a.type - b.type;
        })
    },

    /**
     * 设置红包分页
     * @param page
     * @param allPage
     */
    setRedBagPage(page, allPage){
      this.page = page;
      this.allPage = allPage;
    },

    /**
     * 获取红包分页
     * @returns {*}
     */
    getRedBagPage(){
        if(!cc.dd._.isNumber(this.page)){
            return 1;
        }
        return this.page
    },

    /**
     * 获取红包总分页
     * @returns {*}
     */
    getRedBagPageAll(){
        if(!cc.dd._.isNumber(this.allPage)){
            return 1;
        }
        return this.allPage
    },

    /**
     * 排行榜列表
     * @param clubId
     * @param gameType
     * @param rankType
     * @returns {*}
     */
    getRankList(clubId, gameType, rankType){
        // this.ranks = {
        //     clubid: 0,
        //     75: {
        //         1: {
        //             refreshTime: 0,
        //             rankRound: [],
        //             rankLucky: [],
        //             rankLoss: []
        //         },
        //         2: {
        //             refreshTime: 0,
        //             rankRound: [],
        //             rankLucky: [],
        //             rankLoss: []
        //         },
        //         3: {
        //             refreshTime: 0,
        //             rankRound: [],
        //             rankLucky: [],
        //             rankLoss: []
        //         },
        //         4: {
        //             refreshTime: 0,
        //             rankRound: [],
        //             rankLucky: [],
        //             rankLoss: []
        //         },
        //         5: {
        //             refreshTime: 0,
        //             rankRound: [],
        //             rankLucky: [],
        //             rankLoss: []
        //         }
        //     }
        // }
        if(!this.ranks || this.ranks.clubid != clubId || !this.ranks[gameType] || !this.ranks[gameType][rankType]){
            return null;
        }

        var curTime = new Date().getTime();
        var leftSeconds = parseInt((curTime - this.ranks[gameType][rankType].refreshTime) / 1000);
        if(leftSeconds > 10){
            cc.log("大于10秒，刷新",curTime,"  ", this.ranks[gameType][rankType].refreshTime)
            return null;
        }else{
            return this.ranks[gameType][rankType];
        }
    },

    setRankList(msg){
        if(!this.ranks || this.ranks.clubid != this.selectClubId){
            this.ranks = {};
        }

        this.ranks.clubid = this.selectClubId;
        var curTime = new Date().getTime();
        if(!this.ranks[msg.gameType]){
            this.ranks[msg.gameType] = {};
        }

        if(!this.ranks[msg.gameType][msg.type]){
            this.ranks[msg.gameType][msg.type] = {};
        }
        this.ranks[msg.gameType][msg.type].refreshTime = curTime;
        if(msg.rankType == 1){
            this.ranks[msg.gameType][msg.type].rankRound = msg.rankList;
        }else if(msg.rankType == 2){
            this.ranks[msg.gameType][msg.type].rankLucky = msg.rankList;
        }else{
            this.ranks[msg.gameType][msg.type].rankLoss = msg.rankList;
        }
    },
});

module.exports = {
    klbClubEvent: klbClubEvent,
    klbClubEd: klbClubEd,
    klbClubMgr: klbClubMgr,
};
