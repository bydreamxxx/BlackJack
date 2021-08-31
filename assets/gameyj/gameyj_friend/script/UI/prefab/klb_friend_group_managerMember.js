var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_Ed =  require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

let MEMBER_STATUS = require('klb_friend_group_enum').MEMBER_STATUS;
let MEMBER = require('klb_friend_group_enum').MEMBER;

cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Label,
        prefabItem:{
            default: null,
            type: cc.Prefab,
            tooltip: "成员组件"
        },
        content_node: cc.Node,
        scrollView: cc.ScrollView,
        score: cc.Label,
    },

    onLoad: function () {
        this.startX = 7.95;
        this.startY = 5;
        this.spaceX = 12;
        this.spaceY = 12;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.spawnCount = 18;//显示几个
        this.row = 3;//每行几个
        this.item_height = this.prefabItem.data.height;
        this.bufferZone = this.scrollView.node.height / 2 + this.item_height / 2 * 3;//边界线
        this.playerList = [];

        club_Ed.addObserver(this);
    },

    onDestroy:function () {
        club_Ed.removeObserver(this);
    },

    setApply(){

    },

    setMemberStatus(status){
        this.status = status;

        switch(this.status){
            case MEMBER_STATUS.APPLY:
                this.title.string = "审批";
                break;
            case MEMBER_STATUS.MANAGER:
                this.title.string = "成员管理";
                break;
            case MEMBER_STATUS.SCORE:
                this.title.string = "积分管理";
                break;
            case MEMBER_STATUS.CHECK:
                this.title.string = "成员列表";
                break;
        }
    },

    close: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event,data) {
        switch (event){
            case club_Event.CLUB_REQ_APPLY_LIST: //请求申请列表返回
                if(this.status == MEMBER_STATUS.APPLY){
                    this.initPlayerList(data.clubId, club_Mgr.getClubApplyList());
                }else{
                    this.initPlayerList(club_Mgr.getSelectClubId(), club_Mgr.getClubMembersList());
                }
                break;
            case club_Event.CLUB_OP_APPLY_PLAYER: //操作玩家成功
                if(this.status == MEMBER_STATUS.APPLY) {
                    this.initPlayerList(data.clubId, club_Mgr.getClubApplyList());
                }else{
                    this.initPlayerList(club_Mgr.getSelectClubId(), club_Mgr.getClubMembersList());
                }
                break;
            case club_Event.CLUB_MANAGER_OP:
            case club_Event.CLUB_kICK_PLAYER_OUT:
                this.initPlayerList(club_Mgr.getSelectClubId(), club_Mgr.getClubMembersList());
                break;
            case club_Event.CLUB_CHANGE_SCORE:
                this.updatePlayerList(club_Mgr.getClubMembersList());
                break;
            case club_Event.CLUB_CHANGE_RIGHTS:
                if(data[2] == club_Mgr.getSelectClubId()){
                    if(!this._waitAdminAnima){
                        this.initPlayerList(club_Mgr.getSelectClubId(), club_Mgr.getClubMembersList());
                    }
                }
                break;
            default:
                break;
        }
    },

    updatePlayerList(data){
        let clbInfo = club_Mgr.getClubInfoByClubId(this.clubId);
        if(clbInfo && this.status == MEMBER_STATUS.SCORE){
            this.score.string = '亲友圈积分:'+clbInfo.clubScore;
            this.scrollView.node.height = 491;
            this.scrollView.node.y = -38.9;
            this.scrollView.node.getComponentInChildren(cc.Widget).updateAlignment();
        }else{
            this.score.string = ''
            this.scrollView.node.height = 531;
            this.scrollView.node.y = -18.9;
            this.scrollView.node.getComponentInChildren(cc.Widget).updateAlignment();
        }

        data.sort((a, b)=>{
            if(a.job == MEMBER.OWNER){
                return -1;
            }else{
                if(a.job == MEMBER.NORMAL){
                    if(b.job == MEMBER.NORMAL){
                        if(this.status == MEMBER_STATUS.APPLY){
                            return b.applyTime - a.applyTime;
                        }else{
                            return a.joinTime - b.joinTime;
                        }
                    }else{
                        return 1;
                    }
                }else{
                    if(b.job == MEMBER.OWNER){
                        return 1;
                    }else if(b.job == MEMBER.NORMAL){
                        return -1;
                    }else{
                        if(this.status == MEMBER_STATUS.APPLY){
                            return b.applyTime - a.applyTime;
                        }else{
                            return a.joinTime - b.joinTime;
                        }
                    }
                }
            }
        })

        this.playerList = data;

        let items = this.content_node.children;
        for (let i = 0; i < items.length; ++i) {
            items[i].getComponent('klb_friend_group_memberItem').initPlayerInfo(this.clubId, this.playerList[items[i].index], this.status);
        }
    },

    /**
     * 初始化申请列表
     */
    initPlayerList: function(clubId, data){
        this.clubId = clubId;

        let clbInfo = club_Mgr.getClubInfoByClubId(this.clubId);
        if(clbInfo && this.status == MEMBER_STATUS.SCORE){
            this.score.string = '亲友圈积分:'+clbInfo.clubScore;
            this.scrollView.node.height = 491;
            this.scrollView.node.y = -38.9;
            this.scrollView.node.getComponentInChildren(cc.Widget).updateAlignment();
        }else{
            this.score.string = ''
            this.scrollView.node.height = 531;
            this.scrollView.node.y = -18.9;
            this.scrollView.node.getComponentInChildren(cc.Widget).updateAlignment();
        }

        data.sort((a, b)=>{
            if(a.job == MEMBER.OWNER){
                return -1;
            }else{
                if(a.job == MEMBER.NORMAL){
                    if(b.job == MEMBER.NORMAL){
                        if(this.status == MEMBER_STATUS.APPLY){
                            return b.applyTime - a.applyTime;
                        }else{
                            return a.joinTime - b.joinTime;
                        }
                    }else{
                        return 1;
                    }
                }else{
                    if(b.job == MEMBER.OWNER){
                        return 1;
                    }else if(b.job == MEMBER.NORMAL){
                        return -1;
                    }else{
                        if(this.status == MEMBER_STATUS.APPLY){
                            return b.applyTime - a.applyTime;
                        }else{
                            return a.joinTime - b.joinTime;
                        }
                    }
                }
            }
        })

        this.playerList = data;
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
            item.getComponent('klb_friend_group_memberItem').initPlayerInfo(this.clubId, this.playerList[i], this.status);
            item.index = i;
            this.content_node.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k)-this.startX;
            item.y = -this.startY - this.item_height / 2 - (this.item_height + this.spaceY) * j;
        }

        let count = Math.ceil(this.playerList.length / this.row)
        this.content_node.height = this.startY + this.item_height * count + this.spaceY * count;
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
                    items[i].getComponent('klb_friend_group_memberItem').initPlayerInfo(this.clubId, this.playerList[itemId], this.status);
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
                    items[i].getComponent('klb_friend_group_memberItem').initPlayerInfo(this.clubId, this.playerList[itemId], this.status);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },
});
