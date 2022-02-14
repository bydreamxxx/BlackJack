var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var FriendData = require('hall_friend').FriendData.Instance();
var FriendED = require('hall_friend').FriendED;
var FriendEvent = require('hall_friend').FriendEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        searchInputText: cc.EditBox,

        friendItemPrefab: cc.Prefab,
        // friendListNode: cc.Node,
        friendListContent: cc.Node,

        localLabel: require('LanguageLabel'),
    },

    // 加载搜索结果列表
    loadSearchedList(friendList) {
        this.friendListContent.removeAllChildren()

        for(let i=0; i<friendList.length; i++) {
            let node = cc.instantiate(this.friendItemPrefab);
            let friendItem = node.getComponent("FriendItem");
            friendItem.setData(friendList[i], 3);
            node.parent = this.friendListContent
        }
    },
    // 关闭
    onClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    requestSearch(searchText) {
        var msg = new cc.pb.friend.msg_lookup_friend_req();
        msg.idOrName = searchText
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_lookup_friend_req, msg, "msg_lookup_friend_req", true);
    },

    showUI(searchText) {
        this.requestSearch(searchText)
    },
    // 地理位置搜索
    onLocalSearch() {

    },
    // 换一批
    onChangeRecommend() {

    },

    // facebook 邀请
    onFacebookInvite() {

    },
    //  普通邀请
    onInvite() {

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
    },

    start () {

    },

    onDestroy: function () {
        FriendED.removeObserver(this);
    },

    // update (dt) {},
});
