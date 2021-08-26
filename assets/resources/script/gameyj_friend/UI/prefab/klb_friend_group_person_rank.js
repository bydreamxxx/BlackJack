var hall_audio_mgr = require('hall_audio_mgr').Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_Ed =  require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
const club_sender = require('jlmj_net_msg_sender_club');
let MEMBER = require('klb_friend_group_enum').MEMBER;

const SORT_STATUS = {
    ASC: 'ASC',
    DESC: 'DESC',
}

cc.Class({
    extends: cc.Component,

    properties: {
        prefabItem:{
            default: null,
            type: cc.Prefab,
            tooltip: "成员组件"
        },
        content_node: cc.Node,
        scrollView: cc.ScrollView,

        idEditBox: cc.EditBox,
        calendar: cc.Label,

        scoreSprite: cc.Sprite,
        roomSprite: cc.Sprite,
        bigwinSprite: cc.Sprite,

        ascSpriteFrame: cc.SpriteFrame,
        descSpriteFrame: cc.SpriteFrame,

        peopleNum: cc.Label,
        cardNum: cc.Label,
        battleNum: cc.Label,
        bigWinNum: cc.Label,

        cardNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.startX = 0;
        this.startY = 7;
        this.spaceX = 0;
        this.spaceY = 6;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.spawnCount = 9;//显示几个
        this.row = 1;//每行几个
        this.item_height = this.prefabItem.data.height;
        this.bufferZone = this.scrollView.node.height / 2 + this.item_height / 2 * 3;//边界线
        this.playerList = [];

        this.showDate = new Date();
        this.calendar.string = this.showDate.format("yyyy/MM/dd");
        this.peopleNum.string = '0';
        this.cardNum.string = '0';
        this.battleNum.string = '0';
        this.bigWinNum.string = '0';

        club_Ed.addObserver(this);

        this.sendPersonRank();
        this.cardNode.active = cc.dd.user.clubJob == MEMBER.ADMIN || cc.dd.user.clubJob == MEMBER.OWNER;
    },

    onDestroy:function () {
        club_Ed.removeObserver(this);
    },

    //只更新列表不清空
    updatePlayerList(data){
        if(data){
            this.playerList = data;
        }

        let items = this.content_node.children;
        for (let i = 0; i < items.length; ++i) {
            items[i].getComponent('klb_friend_group_person_rankitem').initPlayerInfo(this.playerList[items[i].index]);
        }
    },

    //清空后更新列表
    updatePlayerListUI(){
        this.scrollView.scrollToTop(0);

        this.content_node.removeAllChildren();
        let j = 0;
        let k = 0;

        let playerNum = this.playerList.length
        if(playerNum > this.spawnCount){
            playerNum = this.spawnCount;
        }
        for (let i = 0; i < playerNum; i++) {
            j = Math.floor(i / this.row);
            k = i % this.row;
            var item = cc.instantiate(this.prefabItem);
            item.getComponent('klb_friend_group_person_rankitem').initPlayerInfo(this.playerList[i]);
            item.getComponent('klb_friend_group_person_rankitem').setBtnCallBack((id)=>{
                if(cc.dd.user.clubJob == MEMBER.ADMIN || cc.dd.user.clubJob == MEMBER.OWNER){
                    let node = cc.dd.UIMgr.getUI(prefab_config.KLB_FG_BATTLE_HISTORY)
                    if(!node){
                        cc.dd.UIMgr.openUI(prefab_config.KLB_FG_BATTLE_HISTORY, function(ui){
                            ui.getComponent("klb_friend_group_clubBattleHistory").setSearch(id);
                            let clubid = club_Mgr.getSelectClubId();
                            if(cc.dd.user.clubJob == MEMBER.ADMIN){//给服务器判断是不是管理员
                                clubid += 1000000;
                            }
                            club_sender.getClubBattleList(clubid);
                        }.bind(this));
                    }else{
                        node.getComponent("klb_friend_group_clubBattleHistory").setSearch(id);
                    }

                    cc.dd.UIMgr.destroyUI(this.node);
                }
            })
            item.index = i;
            this.content_node.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k)-this.startX;
            item.y = -this.startY - this.item_height / 2 - (this.item_height + this.spaceY) * j;
        }

        let count = Math.ceil(this.playerList.length / this.row)
        this.content_node.height = this.startY + this.item_height * count + this.spaceY * count;
    },

    /**
     * 初始化申请列表
     */
    initPlayerList: function(data){
        //由大到小
        this._scoreSort = SORT_STATUS.DESC;
        this._roomSort = SORT_STATUS.DESC;
        this._bigwinSort = SORT_STATUS.DESC;

        this.scoreSprite.spriteFrame = this.descSpriteFrame;
        this.roomSprite.spriteFrame = this.descSpriteFrame;
        this.bigwinSprite.spriteFrame = this.descSpriteFrame;

        this.playerList = data;
        this._allPlayerList = this.playerList.concat();

        if(this.idEditBox.string != ''){
            let id = parseInt(this.idEditBox.string);

            this.playerList = this._allPlayerList.filter((player)=>{
                return player.userId == id;
            })

            if(this.playerList.length == 0){
                cc.dd.PromptBoxUtil.show('未找到该玩家');
            }
        }

        this.updatePlayerListUI();
    },

    // // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    // // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update: function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.content_node.children;
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
                    items[i].getComponent('klb_friend_group_person_rankitem').initPlayerInfo(this.playerList[itemId]);
                    items[i].index = itemId;
                }
            } else {
                // 提前计算出该item的新的y坐标
                newY = items[i].y - offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y > this.bufferZone && newY > -this.content_node.height) {
                    items[i].y = newY;
                    // let item = items[i].getComponent('Item');
                    let itemId = items[i].index + items.length;
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('klb_friend_group_person_rankitem').initPlayerInfo(this.playerList[itemId]);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },

    onClickSort(target, data){
        switch(data){
            case 'score':
                if(this._scoreSort == SORT_STATUS.DESC){
                    this._scoreSort = SORT_STATUS.ASC
                    this.scoreSprite.spriteFrame = this.ascSpriteFrame;

                    this.playerList.sort((a, b)=>{
                        if(a.dayScore < b.dayScore){
                            return 1
                        }else{
                            return -1;
                        }
                    });

                }else{
                    this._scoreSort = SORT_STATUS.DESC
                    this.scoreSprite.spriteFrame = this.descSpriteFrame;

                    this.playerList.sort((a, b)=>{
                        if(a.dayScore > b.dayScore){
                            return 1
                        }else{
                            return -1;
                        }
                    });
                }
                break;
            case 'room':
                if(this._roomSort == SORT_STATUS.DESC){
                    this._roomSort = SORT_STATUS.ASC
                    this.roomSprite.spriteFrame = this.ascSpriteFrame;

                    this.playerList.sort((a, b)=>{
                        if(a.dayRoomNum < b.dayRoomNum){
                            return 1
                        }else{
                            return -1;
                        }
                    });

                }else{
                    this._roomSort = SORT_STATUS.DESC
                    this.roomSprite.spriteFrame = this.descSpriteFrame;

                    this.playerList.sort((a, b)=>{
                        if(a.dayRoomNum > b.dayRoomNum){
                            return 1
                        }else{
                            return -1;
                        }
                    });
                }
                break;
            case 'bigwin':
                if(this._bigwinSort == SORT_STATUS.DESC){
                    this._bigwinSort = SORT_STATUS.ASC
                    this.bigwinSprite.spriteFrame = this.ascSpriteFrame;

                    this.playerList.sort((a, b)=>{
                        if(a.dayBigWinnerNum < b.dayBigWinnerNum){
                            return 1
                        }else{
                            return -1;
                        }
                    });
                }else{
                    this._bigwinSort = SORT_STATUS.DESC
                    this.bigwinSprite.spriteFrame = this.descSpriteFrame;

                    this.playerList.sort((a, b)=>{
                        if(a.dayBigWinnerNum > b.dayBigWinnerNum){
                            return 1
                        }else{
                            return -1;
                        }
                    });
                }
                break;
        }

        this.updatePlayerList()
    },

    close: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickReset(){
        hall_audio_mgr.com_btn_click();

        this.idEditBox.string = '';

        if(this.playerList.length != this._allPlayerList.length){
            this.playerList = this._allPlayerList.concat();
            this.updatePlayerListUI();
        }

    },

    onClckSearch(){
        hall_audio_mgr.com_btn_click();

        if (this.idEditBox.string == '') {
            if(this.playerList.length != this._allPlayerList.length){
                this.playerList = this._allPlayerList.concat();
                this.updatePlayerListUI();
            }
            return;
        }

        let id = parseInt(this.idEditBox.string);

        this.playerList = this._allPlayerList.filter((player)=>{
            return player.userId == id;
        })

        if(this.playerList.length == 0){
            cc.dd.PromptBoxUtil.show('未找到该玩家');
        }

        this.updatePlayerListUI();
    },

    onClickCalendar(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_CANLENDAR)) {
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_CANLENDAR, function (ui) {
                ui.getComponent('klb_friend_group_calendar').show(this.showDate, (date)=>{
                    if(date){
                        this.calendar.string = date.format("yyyy/MM/dd");
                        this.showDate = date;

                        this.peopleNum.string = '0';
                        this.cardNum.string = '0';
                        this.battleNum.string = '0';
                        this.bigWinNum.string = '0';

                        this.sendPersonRank();
                    }
                });
            }.bind(this));
        }
    },

    updateUI(data){
        if(data.retCode != 0){
            this.scrollView.scrollToTop(0);

            this.content_node.removeAllChildren();

            this.peopleNum.string = '0';
            this.cardNum.string = '0';
            this.battleNum.string = '0';
            this.bigWinNum.string = '0';


            this._scoreSort = SORT_STATUS.DESC;
            this._roomSort = SORT_STATUS.DESC;
            this._bigwinSort = SORT_STATUS.DESC;

            this.scoreSprite.spriteFrame = this.descSpriteFrame;
            this.roomSprite.spriteFrame = this.descSpriteFrame;
            this.bigwinSprite.spriteFrame = this.descSpriteFrame;

            this.playerList = [];
            this._allPlayerList = this.playerList.concat();

            if(this.idEditBox.string != ''){
                let id = parseInt(this.idEditBox.string);

                this.playerList = this._allPlayerList.filter((player)=>{
                    return player.userId == id;
                })

                if(this.playerList.length == 0){
                    cc.dd.PromptBoxUtil.show('未找到该玩家');
                }
            }
            return;
        }

        this.peopleNum.string = data.joinNum;
        this.cardNum.string = data.costCardNum;
        this.battleNum.string = data.roundNum;
        this.bigWinNum.string = data.bigWinnerNum;
        this.initPlayerList(data.detailList);
    },

    onEventMessage: function (event,data) {
        switch (event){
            case club_Event.FRIEND_GROUP_UPDATE_PERSON_RANK:
                this.updateUI(data);
                break;
            default:
                break;
        }
    },

    sendPersonRank(){
        club_sender.sendPersonRank(club_Mgr.getSelectClubId(), Math.floor(this.showDate.getTime() / 1000));
    }
});
