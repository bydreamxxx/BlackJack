var hall_audio_mgr = require('hall_audio_mgr').Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_sender = require('jlmj_net_msg_sender_club');

cc.Class({
    extends: cc.Component,

    properties: {
        item:{
            default: null,
            type: cc.Prefab,
            tooltip: '红包组件',
        },
        content:{
            default: null,
            type: cc.Node,
            tooltip: '容器',
        },
        noticeNode:{
            default: null,
            type: cc.Node,
            tooltip: '提示',
        },

        moreButton:{
          default: null,
          type: cc.Node,
          tooltip: '更多按钮'
        },
        scrollView: cc.ScrollView,
        askMore: false,
    },

    onLoad(){
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosX = 0;

        this.startX = 0;
        this.startY = 0;
        this.spaceX = 8;
        this.spaceY = 0;
        this.spawnCount = 6;//显示几个
        this.col = 1;//每列几个
        this.item_width = this.item.data.width;
        this.bufferZone = this.scrollView.node.width / 2 + this.item_width / 2 * 3

        this.redBagList = [];
        this.moreButton.active = false;

        this.askMore = false;

        club_Ed.addObserver(this);
    },

    onDestroy(){
        club_Ed.removeObserver(this);

        if(this.touchMore){
            clearTimeout(this.touchMore);
            this.touchMore = null;
        }
    },

    updateUI(){
        this.redBagList = clubMgr.getRedBagList().slice();
        this.moreButton.active = false;

        this.redBagList.sort((a,b)=>{
            if(a.leftSum > 0 && b.leftSum > 0){
                return b.id - a.id;
            }else if(a.leftSum > 0 && b.leftSum <= 0){
                return -1;
            }else{
                return 1;
            }
        })

        if(!this.askMore){
            if(this.redBagList.length > 10){
                let deletenum = this.redBagList.length - 10;
                this.redBagList.splice(10, deletenum);
            }

            this.content.removeAllChildren();
            let j = 0;
            let k = 0;

            let tableNum = this.redBagList.length;
            if(tableNum > this.spawnCount){
                tableNum = this.spawnCount;
            }
            for (let i = 0; i < tableNum; i++) {
                j = Math.floor(i / this.col);
                k = i % this.col;
                var item = cc.instantiate(this.item);
                item.getComponent('klb_friend_group_redbagContentItem').setInfo(this.redBagList[i]);
                item.index = i;
                this.content.addChild(item);

                item.y = 0;
                item.x = this.startX + this.item_width / 2 + (this.item_width + this.spaceX) * j;
            }
        }

        let count = Math.ceil(this.redBagList.length / this.col)
        this.content.width = this.startX + this.item_width * count + this.spaceX * count;

        this.noticeNode.active = this.redBagList.length == 0;
    },

    onClickMore(){
        hall_audio_mgr.com_btn_click();
        if(this.touchMore){
            return;
        }

        this.touchMore = setTimeout(()=>{
            this.touchMore = null;
        }, 1000);

        if(!this.askMore){
            this.askMore = true;
            this.updateUI();
            // return;
        }

        if(clubMgr.getRedBagPage() < clubMgr.getRedBagPageAll()){
            club_sender.getAllRedBagList(clubMgr.getSelectClubId(), clubMgr.getRedBagPage()+1);
        }
    },

    /**
     * 关闭界面
     */
    onclose: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickRule(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_RED_BAG_RULE)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_RED_BAG_RULE);
        }
    },

    onClickSend(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_RED_BAG_SEND)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_RED_BAG_SEND, function(ui){
                ui.getComponent('klb_friend_group_redbagSend').show();
            }.bind(this));
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case club_Event.FRIEND_GROUP_UPDATE_RED_BAG:
                this.updateUI();
                break;
            default:
                break;
        }
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
        let items = this.content.children;
        // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
        let isRight = this.scrollView.content.x > this.lastContentPosX;
        // 实际创建项占了多高（即它们的高度累加）
        let count = Math.ceil(items.length / this.col);
        let offset = this.item_width * count + this.spaceX * count;
        let newX = 0;

        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isRight) {
                // 提前计算出该item的新的y坐标
                newX = items[i].x - offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.x > this.bufferZone && newX > 0) {
                    items[i].x = newX;
                    let itemId = items[i].index - items.length; // update item id
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('klb_friend_group_redbagContentItem').setInfo(this.redBagList[itemId]);
                    items[i].index = itemId;
                }
            } else {
                // 提前计算出该item的新的y坐标
                newX = items[i].x + offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.x < -this.bufferZone && newX < this.content.width) {
                    items[i].x = newX;
                    // let item = items[i].getComponent('Item');
                    let itemId = items[i].index + items.length;
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('klb_friend_group_redbagContentItem').setInfo(this.redBagList[itemId]);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosX和总项数显示
        this.lastContentPosX = this.scrollView.content.x;
    },

    scrollEvent: function(sender, event) {
        switch(event) {
            case 0:
                // cc.error("Scroll to Top");
                break;
            case 1:
                // cc.error("Scroll to Bottom");
                break;
            case 2:
                // cc.error("Scroll to Left");
                break;
            case 3:
                // cc.error("Scroll to Right");
                this.rightEnd = true;
                break;
            case 4:
                // cc.error("Scrolling");
                this.moreButton.active = false;
                break;
            case 5:
                // cc.error("Bounce Top");
                break;
            case 6:
                // cc.error("Bounce bottom");
                break;
            case 7:
                // cc.error("Bounce left");
                break;
            case 8:
                // cc.error("Bounce right");
                this.rightEnd = true;
                break;
            case 9:
                // cc.error("Auto scroll ended");
                if(this.rightEnd){
                    this.moreButton.active = this.checkHasMore();
                }
                this.rightEnd = false;
                break;
        }
    },

    checkHasMore(){
        if(this.redBagList.length < clubMgr.getRedBagList().length){
            return true;
        }
        if(clubMgr.getRedBagPage() < clubMgr.getRedBagPageAll()){
            return true;
        }

        return false;
    }
});
