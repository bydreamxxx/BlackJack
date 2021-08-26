var hall_audio_mgr = require('hall_audio_mgr').Instance();
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
cc.Class({
    extends: cc.Component,

    properties: {
        daikai_ContentNode: cc.Node,
        scrollView: cc.ScrollView,
        prefabItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "成员组件"
        },
        _itemList: [],
    },


    onLoad: function () {
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
        this.daikaiList = [];

        this.schedule(this.autoFresh, 15);

        RoomED.addObserver(this);
    },

    onDestroy: function () {
        RoomED.removeObserver(this);
    },

    /**
     * 初始化 列表
     * @param node
     */
    initItem: function (data) {

        this.daikaiList = data;

        this.daikai_ContentNode.removeAllChildren();
        this.daikai_ContentNode.y = 0;
        let j = 0;
        let k = 0;

        let playerNum = this.daikaiList.length
        if (playerNum > this.spawnCount) {
            playerNum = this.spawnCount;
        }
        for (let i = 0; i < playerNum; i++) {
            j = Math.floor(i / this.row);
            k = i % this.row;
            var item = cc.instantiate(this.prefabItem);
            item.getComponent('chifeng_hall_daikai_item').setData(this.daikaiList[i]);
            item.index = i;
            this.daikai_ContentNode.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k) - this.startX;
            item.y = -this.startY - this.item_height / 2 - (this.item_height + this.spaceY) * j;
        }

        let count = Math.ceil(this.daikaiList.length / this.row)
        this.daikai_ContentNode.height = this.startY + this.item_height * count + this.spaceY * count;
    },

    // // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    updateItems() {
        let items = this.daikai_ContentNode.children;
        for (let i = 0; i < items.length; ++i) {
            var roomId = items[i].tagname;
            var roomData = this.daikaiList.find(data => { return data.roomId == roomId; });
            if (roomData) {
                items[i].getComponent('chifeng_hall_daikai_item').setData(roomData);
            }
            else{
                this.initItem(this.daikaiList);
                break;
            }
        }
    },

    // // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update: function (dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.daikai_ContentNode.children;
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
                    items[i].getComponent('chifeng_hall_daikai_item').setData(this.daikaiList[itemId]);
                    items[i].index = itemId;
                }
            } else {
                // 提前计算出该item的新的y坐标
                newY = items[i].y - offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y > this.bufferZone && newY > -this.daikai_ContentNode.height) {
                    items[i].y = newY;
                    // let item = items[i].getComponent('Item');
                    let itemId = items[i].index + items.length;
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('chifeng_hall_daikai_item').setData(this.daikaiList[itemId]);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },


    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    clickRefresh() {
        if (!this.freshCD) {
            this.freshCD = true;
            hall_audio_mgr.com_btn_click();
            var pbObj = new cc.pb.room_mgr.msg_friend_create_room_req();
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_friend_create_room_req, pbObj, 'msg_friend_create_room_req', true);
            this.scheduleOnce(function () {
                this.freshCD = false;
            }.bind(this), 5);
        }
        else {
            cc.dd.PromptBoxUtil.show('刷新过于频繁，请稍后再试');
        }
    },

    autoFresh() {
        var pbObj = new cc.pb.room_mgr.msg_friend_create_room_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_friend_create_room_req, pbObj, 'msg_friend_create_room_req', true);
    },

    clickAllHistory() {
        hall_audio_mgr.com_btn_click();
        var pbObj = new cc.pb.club.msg_friend_create_battle_history_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_friend_create_battle_history_req, pbObj, 'msg_friend_create_battle_history_req', true);
    },

    showdaikaiList() {
        var data = this._daikaiMSG;
        if (data.roomListList.length > 0) {
            this.initItem(data.roomListList);
        } else {
            //cc.dd.PromptBoxUtil.show('');
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case RoomEvent.daikai_list_ret:
                this.daikaiList = data.roomListList;
                this.updateItems();
                break;
            default:
                break;
        }
    },
});
