var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        prefabItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "成员组件"
        },
        content_node: cc.Node,
        scrollView: cc.ScrollView,

        selfRank: require('klb_hall_chongbang_item'),

        time: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Hall.HallED.addObserver(this);

        this.startX = 0;
        this.startY = 3;
        this.spaceX = 0;
        this.spaceY = 10;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.spawnCount = 7; //显示几个
        this.row = 1; //每行几个
        this.item_height = this.prefabItem.data.height;
        this.bufferZone = this.scrollView.node.height / 2 + this.item_height / 2 * 3; //边界线
        this.playerList = [];

        this.time.string = '';
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    show(msg) {
        let startTime = new Date(msg.beginTime * 1000);
        let endTime = new Date(msg.endTime * 1000);
        this.time.string = '活动时间\n' + startTime.format("yyyy-MM-dd") + '·' + endTime.format("yyyy-MM-dd");
        this.initPlayerList(msg.rankDetail.rankListList);
        this.selfRank.initSelfInfo(msg.rankDetail.historyInfo.curScore, msg.rankDetail.historyInfo.curRank);
    },

    onClickClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickInfo() {
        hall_audio_mgr.com_btn_click();
        var pbObj = new cc.pb.rank.get_receiving_address_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_get_receiving_address_req, pbObj, 'get_receiving_address_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'get_receiving_address_req');
    },

    initPlayerList(data) {
        data.sort((a, b) => {
            if(a.rank < b.rank){
                return -1;
            }else{
                return 1;
            }
        });

        this.playerList = data;
        this.content_node.removeAllChildren();
        this.content_node.y = 0;
        let j = 0;
        let k = 0;

        let playerNum = this.playerList.length
        if (playerNum > this.spawnCount) {
            playerNum = this.spawnCount;
        }
        for (let i = 0; i < playerNum; i++) {
            j = Math.floor(i / this.row);
            k = i % this.row;
            var item = cc.instantiate(this.prefabItem);
            cc.error(i)
            item.getComponent('klb_hall_chongbang_item').initPlayerInfo(this.playerList[i]);
            item.index = i;
            this.content_node.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k) - this.startX;
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
    update: function (dt) {
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
                    items[i].getComponent('klb_hall_chongbang_item').initPlayerInfo(this.playerList[itemId]);
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
                    items[i].getComponent('klb_hall_chongbang_item').initPlayerInfo(this.playerList[itemId]);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },

    onEventMessage(event, data) {
        switch (event) {
            case Hall.HallEvent.RANK_ACTIVITY_ADDRESS:
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_CHONG_BANG_USERINFO, (ui) => {
                    ui.getComponent('klb_hall_chongbang_userInfo').show(Hall.HallData.Instance().getRankAddress());
                });
                break;
        }
    },
});