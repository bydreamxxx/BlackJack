const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;

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

        richText:{
            default: null,
            type: cc.Node,
            tooltip: '富文本',
        },

        emojiNode:{
            default: null,
            type: cc.Node,
            tooltip: '表情'
        },

        messageList:{
            default:[]
        },

        canPopMessage:true,
    },
    onLoad(){
        this.startX = 0;
        this.startY = 5;
        this.spaceX = 0;
        this.spaceY = 0;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.spawnCount = 17;//显示几个
        this.row = 1;//每行几个
        this.item_height = 0;
        this.real_height = 0;
        this.bufferZone = this.scrollView.node.height / 2 + this.item_height / 2 * 3;//边界线
        this.chatList = [];
        club_Ed.addObserver(this);
        HallCommonEd.addObserver(this);

        this.labelPool = new cc.NodePool();
        this.emojiPool = new cc.NodePool();

        for (let i = 0; i < 10; ++i) {
            let label = cc.instantiate(this.richText); // 创建节点
            this.labelPool.put(label); // 通过 put 接口放入对象池
        }

        this._richText = this.richText.getComponent('klb_friend_group_chatRichText');
        //todo 以后有空在实现动画表情
        // for (let i = 0; i < 10; ++i) {
        //     let emoji = cc.instantiate(this.emojiNode); // 创建节点
        //     this.emojiPool.put(emoji); // 通过 put 接口放入对象池
        // }
    },

    clean(){
        this.chatList = [];
        this.item_height = 0;
        this.real_height = 0;
        this.content_node.height = 0;
        this.content_node.removeAllChildren(true);
        this.content_node.y = 0;
        this.messageList = [];
        this.canPopMessage = true;
    },

    onDestroy(){
        if(this.tmeOut){
            clearTimeout(this.tmeOut);
            this.tmeOut = null;
        }
        club_Ed.removeObserver(this);
        HallCommonEd.removeObserver(this);
        this.labelPool.clear();
        this.emojiPool.clear();
    },

    createLabel(){
        let label = null;
        if (this.labelPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            label = this.labelPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            label = cc.instantiate(this.richText);
        }
        label.active = true;
        return label;
    },

    createEmoji(){
        let emoji = null;
        if (this.emojiPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            emoji = this.emojiPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            emoji = cc.instantiate(this.emojiNode);
        }
        emoji.active = true;
        return emoji;
    },

    removLabel(label){
        label.getComponent(cc.RichText).string = '';
        label.active = false;
        this.labelPool.put(label);
    },

    removeEmoji(emoji){
        emoji.getComponent(cc.Animation).stop();
        emoji.active = false;
        this.emojiPool.put(emoji);
    },

    updateChatList(message){
        if(this.chatList.length > 100){
            let info = this.chatList.shift();
            this.item_height -= info.height;
        }

        let _height = this._richText.initChatInfo({data: message[0], isFromDesk: message[1]});

        this.chatList.push({data: message[0], isFromDesk: message[1], height: _height});

        let j = 0;
        let k = 0;

        if(this.content_node.height < this.scrollView.node.height + _height) {
            let i = this.content_node.children.length
            j = Math.floor(i / this.row);
            k = i % this.row;
            var item = cc.instantiate(this.prefabItem);
            // item.getComponent('klb_friend_group_chatItem').bindFunc(this.createLabel.bind(this), this.createEmoji.bind(this), this.removLabel.bind(this), this.removeEmoji.bind(this))
            item.getComponent('klb_friend_group_chatRichText').initChatInfo(this.chatList[i]);

            this.real_height+=_height;

            item.index = i;
            this.content_node.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k)-this.startX;
            item.y = -this.startY + _height / 2 - this.real_height;
        }
        this.item_height += _height;
        this.content_node.height = this.startY * 2 + this.item_height;

        if(this.content_node.height > this.scrollView.node.height){
            this.scrollView.scrollToBottom(0.5);
        }

        if(this.tmeOut){
            clearTimeout(this.tmeOut);
            this.tmeOut = null;
        }
        this.tmeOut = setTimeout(()=>{
            this.canPopMessage = true;
            this.tmeOut = null;
        }, 500);
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
        let offset = this.real_height;
        let newY = 0;

        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);

            this.bufferZone = this.scrollView.node.height / 2 + this.chatList[i].height / 2

            if (isDown) {
                // 提前计算出该item的新的y坐标
                newY = items[i].y + offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y < -this.bufferZone && newY < 0) {
                    items[i].y = newY;
                    let itemId = items[i].index - items.length; // update item id
                    // items[i].getComponent('klb_friend_group_chatItem').initChatInfo(this.chatList[itemId]);
                    items[i].getComponent('klb_friend_group_chatRichText').initChatInfo(this.chatList[itemId]);
                    items[i].index = itemId;
                }
            } else {
                // 提前计算出该item的新的y坐标
                newY = items[i].y - offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y > this.bufferZone && newY > -this.content_node.height) {
                    items[i].y = newY;
                    let itemId = items[i].index + items.length;
                    // items[i].getComponent('klb_friend_group_chatItem').initChatInfo(this.chatList[itemId]);
                    items[i].getComponent('klb_friend_group_chatRichText').initChatInfo(this.chatList[itemId]);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;

        if(this.messageList.length > 0 && this.canPopMessage){
            this.canPopMessage = false;
            let message = this.messageList.shift();
            this.updateChatList(message);
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case club_Event.FRIEND_GROUP_CHAT_DESK_BROADCAST:
                if(data.clubId == clubMgr.getSelectClubId()){
                    // this.updateChatList(data, true)
                    this.messageList.push([data, true]);
                }
                break;
            case club_Event.FRIEND_GROUP_CHAT_BROADCAST:
                if(data.clubid == clubMgr.getSelectClubId()){
                    // this.updateChatList(data, false)
                    this.messageList.push([data, false]);
                }
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
            case club_Event.FRIEND_GROUP_CLEAN_CHAT:
                this.clean();
                break;
            default:
                break;
        }
    },
});
