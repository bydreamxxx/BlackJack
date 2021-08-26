// create by wj 2018/04/25
const club_sender = require('jlmj_net_msg_sender_club');
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var com_replay_data = require('com_replay_data').REPLAY_DATA;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');
let MEMBER = require('klb_friend_group_enum').MEMBER;
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        battle_ContentNode: cc.Node, //消息列表
        scrollView: cc.ScrollView,
        prefabItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "成员组件"
        },
        _itemList: [],

        editHistoryBox: cc.EditBox,
        controlToggle: cc.Node,
        personRankButton: cc.Node,

        openToggle: cc.Toggle,
        closeToggle: cc.Toggle,
    },


    onLoad: function () {
        cc._chifengHistoryType = 1;
        this.startX = 0;
        this.startY = 0;
        this.spaceX = 0;
        this.spaceY = 6;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.spawnCount = 5;//显示几个
        this.row = 1;//每行几个
        this.item_height = this.prefabItem.data.height;
        this.bufferZone = this.scrollView.node.height / 2 + this.item_height / 2 * 3;//边界线
        this.battleList = [];
        this.realBattleList = null;

        this.info = clubMgr.getClubInfoByClubId(clubMgr.getSelectClubId());

        this.controlToggle.active = false;//cc.dd.user.clubJob != MEMBER.NORMAL;
        this.personRankButton.active = cc.dd.user.clubJob != MEMBER.NORMAL;//this.info.battleType === 2 ? true : cc.dd.user.clubJob != MEMBER.NORMAL;

        this.openToggle.node.on('click', this.onClickToggle.bind(this), this);
        this.closeToggle.node.on('click', this.onClickToggle.bind(this), this);

        if(this.info.battleType === 2){
            this.openToggle.check();
        }else{
            this.initToggle = true;
            this.closeToggle.check();
        }

        club_Ed.addObserver(this);
    },

    onDestroy: function () {
        cc._chifengHistoryType = null;
        club_Ed.removeObserver(this);
    },

    /**
     * 初始化 列表
     * @param node
     */
    initItem: function (data, itemList, parent) {
        // this.battle_ContentNode.parent.parent.getComponent('com_glistView').setDataProvider(data, 0, function (itemNode, index) {
        //     if (index < 0 || index >= data.length)
        //         return;
        //     var itemData = data[index];
        //     itemNode.getComponent('klb_friend_group_clubBattleRecord').setData(itemData);
        // }.bind(this));

        this.realBattleList = data;

        if(cc.dd._.isNumber(this.searchID) && this.searchID != 0){
            this.battleList = this.realBattleList.filter((item)=>{
                for(let i = 0; i < item.resultList.length; i++){
                    if(item.resultList[i].userId == this.searchID){
                        return true;
                    }
                }
                return false;
            })

            if(this.battleList.length == 0){
                cc.dd.PromptBoxUtil.show("没有找到该玩家战绩");
                return;
            }
        }else{
            this.battleList = this.realBattleList.concat();
        }

        this.battle_ContentNode.removeAllChildren();
        this.battle_ContentNode.y = 0;
        let j = 0;
        let k = 0;

        let playerNum = this.battleList.length
        if (playerNum > this.spawnCount) {
            playerNum = this.spawnCount;
        }
        for (let i = 0; i < playerNum; i++) {
            j = Math.floor(i / this.row);
            k = i % this.row;
            var item = cc.instantiate(this.prefabItem);
            item.getComponent('klb_friend_group_clubBattleRecord').setData(this.battleList[i]);
            item.index = i;
            this.battle_ContentNode.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k) - this.startX;
            item.y = -this.startY - this.item_height / 2 - (this.item_height + this.spaceY) * j;
        }

        let count = Math.ceil(this.battleList.length / this.row)
        this.battle_ContentNode.height = this.startY + this.item_height * count + this.spaceY * count;
    },

    // // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    // // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update: function (dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.battle_ContentNode.children;
        // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
        let isDown = this.scrollView.content.y < this.lastContentPosY;
        // 实际创建项占了多高（即它们的高度累加）
        let count = Math.ceil(items.length / this.row);
        let offset = this.item_height * count + this.spaceY * count;
        let newY = 0;

        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // 提前计算出该item的新的y坐标
                newY = items[i].y + offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y < -this.bufferZone && newY < 0) {
                    items[i].y = newY;
                    let itemId = items[i].index - items.length; // update item id
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('klb_friend_group_clubBattleRecord').setData(this.battleList[itemId]);
                    items[i].index = itemId;
                }
            } else {
                // 提前计算出该item的新的y坐标
                newY = items[i].y - offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y > this.bufferZone && newY > -this.battle_ContentNode.height) {
                    items[i].y = newY;
                    // let item = items[i].getComponent('Item');
                    let itemId = items[i].index + items.length;
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('klb_friend_group_clubBattleRecord').setData(this.battleList[itemId]);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },

    /**
     * 查看按钮
     */
    onClickCheckRecord: function (event, data) {
        hall_audio_mgr.com_btn_click();
        if (this.editHistoryBox.string == '') {
            cc.dd.PromptBoxUtil.show('请输入回放码');
            return;
        }

        if(isNaN(this.editHistoryBox.string)){
            cc.dd.PromptBoxUtil.show('请输入正确的回放码');
            return;
        }
        var historyId = this.editHistoryBox.string;
        // for (var idx = 0; idx < this._itemList.length; idx++) {
        //     var item = this._itemList[idx];
        //     var isSelect = item.getComponent('klb_friend_group_clubBattleRecord').ckeckDataById(historyId);
        //     if (isSelect) {
        //         var gameData = item.getComponent('klb_friend_group_clubBattleRecord').getGameData();
        //
        //         com_replay_data.Instance().totalRound = gameData.boardscount;
        //         com_replay_data.Instance().getRecordHttpReq(gameData.gameType, historyId);
        //         return;
        //     }
        // }
        if (cc._useChifengUI) {
            var length = (historyId + '').length;
            if (length == 19) {
                cc._check_curRound = parseInt((historyId + '').substring(length - 3));
                var recordId = parseInt((historyId + '').substring(0, length - 3));
                var req = new cc.pb.hall.get_battle_record_req();
                req.setHistoryId(recordId + '');
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_get_battle_record_req, req,
                    '发送协议[cmd_get_battle_record_req]', true);
            }
            else if (length == 16) {
                cc._check_curRound = 1;
                var req = new cc.pb.hall.get_battle_record_req();
                req.setHistoryId(historyId + '');
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_get_battle_record_req, req,
                    '发送协议[cmd_get_battle_record_req]', true);
            }
            else {
                cc.dd.PromptBoxUtil.show('请输入正确的回放码');
            }
        }
        else{
            for (let i = 0; i < this.battleList.length; i++) {
                if (this.battleList[i].historyId == historyId) {
                    com_replay_data.Instance().totalRound = this.battleList[i].boardscount;
                    com_replay_data.Instance().getRecordHttpReq(this.battleList[i].gameType, historyId);
                    return;
                }
            }
            cc.dd.PromptBoxUtil.show('请输入正确的回放码');
        }
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    showBattleList() {
        var data = cc._clubBattleList;
        // for (var i in this._itemList) {
        //     this._itemList[i].removeFromParent();
        //     this._itemList[i].destroy();
        // }
        // this._itemList.splice(0);
        if (data.detailList.length > 0) {
            this.initItem(data.detailList, this._itemList, this.battle_ContentNode);
        } else {
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_4);
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case club_Event.CLUB_DESK_BATTLE_LIST: //获取战绩信息
                this.unschedule(this.showBattleList);
                this.scheduleOnce(this.showBattleList, 0.5);
                break;
            case club_Event.FRIEND_GROUP_UPDATE_PERSON_BATTLE:
                if(this.info.battleType != data.type){
                    this.initToggle = true;
                }
                this.info.battleType = data.type;
                if(this.info.battleType === 2){
                    this.openToggle.check();
                }else{
                    this.closeToggle.check();
                }
                this.personRankButton.active = cc.dd.user.clubJob != MEMBER.NORMAL;//this.info.battleType === 2 ? true : cc.dd.user.clubJob != MEMBER.NORMAL;
                break;
            default:
                break;
        }
    },

    onClickPersonRank(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_PERSON_RANK)) {
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_PERSON_RANK);
        }
    },

    setSearch(id){
        this.searchID = id;
        if(cc.dd._.isArray(this.realBattleList) && this.realBattleList.length > 0){
            this.initItem(this.realBattleList, this._itemList, this.battle_ContentNode);
        }
    },

    onClickChangeControl(event, data){
        if(this.initToggle){
            this.initToggle = false;
            return;
        }
        this.info.battleType = data == "OPEN" ? 2 : 1;
        club_sender.openPersonalBattle(this.info.clubid, this.info.battleType);
    },

    onClickToggle(){
        hall_audio_mgr.com_btn_click();
    },
});
