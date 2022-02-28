var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var FriendData = require('hall_friend').FriendData.Instance();
var FriendED = require('hall_friend').FriendED;
var FriendEvent = require('hall_friend').FriendEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        searchInputText: cc.EditBox,
        searchNode: cc.Node,

        friendItemPrefab: cc.Prefab,
        // friendListNode: cc.Node,
        friendListContent: cc.Node,

        chatPanel: cc.Node,
        chatListContent: cc.Node,
        chatItemPrefab: cc.Prefab,
        chatScrollview: cc.ScrollView,
        emojiPanel: cc.Node,

        friendInfoPanel: cc.Node,
        friendInfoPrefab: cc.Prefab,

        redPointNode: cc.Node,
        redPointLabel: cc.Label,
        
        // newFriendListNode: cc.Node,
        // newFriendListContent: cc.Node
        chatMsgEdit: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initData()
    },

    start () {

    },
    onDestroy: function () {
        FriendED.removeObserver(this);
    },
    // 好友列表
    requestFriendList() {
        var msg = new cc.pb.friend.msg_friend_list_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_friend_list_req, msg, "msg_friend_list_req", true);
    },
    // 请求列表 
    requestApplyList () {
        var msg = new cc.pb.friend.msg_friend_apply_list_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_friend_apply_list_req, msg, "msg_friend_apply_list_req", true);
    },
    // 离线消息
    requestMessage() {
        var msg = new cc.pb.friend.msg_friend_messages_list_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_friend_messages_list_req, msg, "msg_friend_messages_list_req", true);
    },
    initData() {
        FriendED.addObserver(this);
        // this.loadFriendInfo()
        this.requestFriendList()
        this.requestApplyList()
        this.requestMessage()
    },
    // 加载朋友列表
    loadFriendList(searchText) {
        let friends = []
        if(searchText) {
            friends = FriendData.getFriendList().filter((item=>{
                return (item.name.indexOf(searchText)>=0 || item.uid===searchText)
            }))
        } else {
            friends = JSON.parse(JSON.stringify(FriendData.getFriendList()))
        }
        
        let startIndex = 0
        if(this.friendItemList && this.friendItemList.length>0) {
            for(let i=0; i<this.friendItemList.length; i++) {
                if( i < friends.length) {
                    this.friendItemList[i].setData(friends[i], 1)
                    this.friendItemList[i].node.active = true
                } else  {
                    this.friendItemList[i].node.active = false
                }
            }
            startIndex = this.friendItemList.length
        }
        
        for(let i=startIndex; i<friends.length; i++) {
            let node = cc.instantiate(this.friendItemPrefab);
            let friendItem = node.getComponent("FriendItem");
            friendItem.setData(friends[i], 1);
            node.parent = this.friendListContent
            if(!this.friendItemList) {
                this.friendItemList = []
            }
            this.friendItemList.push(friendItem)
        }
    },
    // 加载朋友信息
    loadFriendInfo() {
        let node = cc.instantiate(this.friendInfoPrefab);
        this.friendInfo = node.getComponent("FriendInfo");
        node.parent = this.friendInfoPanel
    },
    //   设置朋友信息
    setFriendInfo(data){
        if(data.uid !== this.selectedUid) {
            return
        }
        if(!this.friendInfo) {
            this.loadFriendInfo()
        }
        this.friendInfo.setData(data,1);
    },
    // 加载聊天信息
    loadChatInfo() {
        this.chatListContent.removeAllChildren()
        this.chatItemList=[]
        this.updateChatMsg()
    },

    refreshUI() {
        this.loadFriendList()
    },
    // 打开聊天界面
    openChat(uid) {
        this.chatPanel.active = true
        this.friendInfoPanel.active = false

        this.selectedUid = uid
        for(let i=0; i<this.friendItemList.length; i++) {
            this.friendItemList[i].setSelected(this.friendItemList[i].uid===this.selectedUid)
        }
        this.loadChatInfo()
    },
    // 打开信息界面
    openInfo(uid) {
        this.chatPanel.active = false
        this.friendInfoPanel.active = true

        this.selectedUid = uid
        for(let i=0; i<this.friendItemList.length; i++) {
            this.friendItemList[i].setSelected(this.friendItemList[i].uid===this.selectedUid)
        }
    },
    // 设置红点
    setRedCound(count) {
        this.redPointLabel.string = '+'+count
        this.redPointNode.active = count > 0
    },
    // 更新申请列表
    updateApplyList() {
        let list = FriendData.getApplyList()
        let count = list&&list.length >= 0 ? list.length: 0
        this.setRedCound(count)
    },
    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        cc.dd.NetWaitUtil.close();
        switch (event) {
            case FriendEvent.FRIEND_REFRESH: // 朋友数据更新
                this.refreshUI();
                break;
            case FriendEvent.OPEN_FRIEND_CHAT: // 打开聊天
                this.openChat(data);
                break;
            case FriendEvent.OPEN_LOOKUP_FRIEND: // 打开好友信息
                this.openInfo(data);
                break;
            case FriendEvent.FRIEND_DETAIL: //更新朋友详细信息
                this.setFriendInfo(data)
                break;
            case FriendEvent.REQUEST_FRIEND_REFRESH: //请求刷新朋友列表
                this.requestFriendList()
                break;
            case FriendEvent.FRIEND_CHAT_UPDATE:    // 聊天更新
                this.updateChat(data)
                break;
            case FriendEvent.FRIEND_SEND_EMOJI:     //发送表情
                this.sendEmoji(data)
                break;
            case FriendEvent.FRIEND_APPLY_LIST:
                this.updateApplyList(data)
                break
            default:
                break;
        }
    },
    // 聊天消息
    updateChat(uid) {
        if(this.selectedUid === uid && this.chatPanel.active === true) {    // 更新聊天记录
            this.updateChatMsg()
        } else {
            for(let i=0; i<this.friendItemList.length; i++) { // 非聊天界面更新红点
                // this.friendItemList[i].setSelected(this.friendItemList[i].uid===this.selectedUid)
                if(this.friendItemList[i].uid === uid)  {
                    this.friendItemList[i].addRedPoint()
                }
            }
        }
    },
    // 更新聊天记录
    updateChatMsg() {
        let chatMsg = FriendData.getChatMsgByUid(this.selectedUid)
        let chatItemLen = 0
        if(!this.chatItemList) {
            this.chatItemList=[]
        }
        chatItemLen = this.chatItemList.length
        for(let i=chatItemLen; i<chatMsg.length; i++) {
            let node = cc.instantiate(this.chatItemPrefab);
            let uid = chatMsg[i].fromUserId ? chatMsg[i].fromUserId : chatMsg[i].toUserId
            let userData = null
            if(uid!==cc.dd.user.id) {
                userData = FriendData.getFriendBriefInfo(uid)
            }
            let chatItem = node.getComponent("ChatItem");
            chatItem.setData(chatMsg[i], userData);
            node.parent = this.chatListContent

            this.chatItemList.push(chatItem)
        }
        this.chatScrollview.scrollToBottom(0.5)
    },
    onSearchMyFriends() {
        let searchText = this.searchInputText.string
        this.loadFriendList(searchText)
    },
    // 打开搜索
    onOpenSearch() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_ADD_FRIEND);
    },
    // 打开请求列表
    onOpenReqestList() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_FRIEND_REQUEST, (prefab)=>{
            prefab.getComponent('FriendRequestList').showUI();
        });
    },
    // 关闭
    onClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // 发生聊天信息
    onSendChat() {
        var msg = new cc.pb.friend.msg_chat_friend_req();
        msg.msgType = 3;
        // msg.id = this.id;
        msg.msg = this.chatMsgEdit.string;
        msg.time = Date.now();
        msg.toUserId = this.selectedUid;
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_chat_friend_req, msg, "msg_chat_friend_req", true);

        FriendData.addChatMsg(this.selectedUid, msg)
    },
    // 表情
    onOpenEmoji() {
        hall_audio_mgr.com_btn_click();
        // this.emojiPanel.active = true
        cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_CHAT_EMOJI);
    },
    // 发生表情
    sendEmoji(data) {
        var msg = new cc.pb.friend.msg_chat_friend_req();
        msg.msgType = 2;
        msg.id = parseInt(data);
        // msg.msg = data.toString();
        msg.time = Date.now();
        msg.toUserId = this.selectedUid;
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_chat_friend_req, msg, "msg_chat_friend_req", true);

        FriendData.addChatMsg(this.selectedUid, msg)
    },
    onEnable() {
        FriendED.notifyEvent(FriendEvent.FRIEND_HALL_RED_POINT, 0);
    }

    // update (dt) {},
});
