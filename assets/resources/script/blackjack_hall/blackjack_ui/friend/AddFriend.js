var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var FriendData = require('hall_friend').FriendData.Instance();
var FriendED = require('hall_friend').FriendED;
var FriendEvent = require('hall_friend').FriendEvent;
let hall_common_data = require('hall_common_data').HallCommonData.getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        searchInputText: cc.EditBox,

        friendItemPrefab: cc.Prefab,
        // friendListNode: cc.Node,
        friendListContent: cc.Node,

        addFriendBtns: cc.Node,

        addFriendLabel: require('LanguageLabel'),
        localLabel: require('LanguageLabel'),
        myIdLabel: require('LanguageLabel'),
    },

    // 加载搜索结果列表, type:0搜索好友，1推荐好友
    loadSearchedList(type) {
        let friendList = FriendData.getSearchList()
        this.friendListContent.removeAllChildren()
        for(let i=0; i<friendList.length; i++) {
            let node = cc.instantiate(this.friendItemPrefab);
            let friendItem = node.getComponent("FriendItem");
            friendItem.setData(friendList[i], 3);
            node.parent = this.friendListContent
        }
        this.addFriendLabel.setText( type===0?'searchresult':'recommendedplayer')
        this.addFriendBtns.active = type===1
    },
    // 关闭
    onClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // 请求查找好友
    requestSearch(searchText) {
        var msg = new cc.pb.friend.msg_lookup_friend_req();
        msg.idOrName = searchText
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_lookup_friend_req, msg, "msg_lookup_friend_req", true);
    },
    // 请求推荐好友
    requestSimilarFriend() {
        var msg = new cc.pb.friend.msg_similar_friend_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_similar_friend_req, msg, "msg_similar_friend_req", true);
    },

    onSearchPlayer() {
        let searchText = this.searchInputText.string
        if(!searchText) {
            this.requestSimilarFriend()
            return
        }
        this.requestSearch(searchText)
    },
    // 地理位置搜索
    onLocalSearch() {

    },
    // 换一批
    onChangeRecommend() {
        this.requestSimilarFriend()
    },

    // facebook 邀请
    onFacebookInvite() {

    },
    //  普通邀请
    onInvite() {
        hall_audio_mgr.com_btn_click();

        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            let str = LanguageMgr.getText('invitefrinedtext')
                .replace('{0}', 'blackjack')
                .replace('{1}', cc.dd.user.id)
            cc.dd.native_systool.SetClipBoardContent(str);
            cc.dd.PromptBoxUtil.show('copysucceed');
        }
    },
    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        cc.dd.NetWaitUtil.close();
        switch (event) {
            case FriendEvent.FRIEND_SEARCH_RESULT: // 朋友搜索结果
                this.loadSearchedList(data);
                break;
            default:
                break;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        FriendED.addObserver(this);
        this.myIdLabel.setText('myid', '', '', cc.dd.user.id)
        this.localLabel.setText(hall_common_data.city)
    },

    start () {

    },

    onDestroy: function () {
        FriendED.removeObserver(this);
    },

    // update (dt) {},
});
