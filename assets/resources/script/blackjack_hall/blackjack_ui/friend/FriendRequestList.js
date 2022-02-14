var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var FriendData = require('hall_friend').FriendData.Instance();
var FriendED = require('hall_friend').FriendED;
var FriendEvent = require('hall_friend').FriendEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        friendItemPrefab: cc.Prefab,
        // friendListNode: cc.Node,
        friendListContent: cc.Node,

        friendInfoPanel: cc.Node,
        friendInfoPrefab: cc.Prefab,
    },

    // 关闭
    onClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    // 加载请求列表
    loadRequestList() {
        for(let i=0; i<10; i++) {
            let node = cc.instantiate(this.friendItemPrefab);
            let friendItem = node.getComponent("FriendItem");
            friendItem.setData(null, 2);
            node.parent = this.friendListContent
        }
    },
    // 加载朋友信息
    loadFriendInfo() {
        let node = cc.instantiate(this.friendInfoPrefab);
        this.friendInfo = node.getComponent("FriendInfo");
        node.parent = this.friendInfoPanel
    },
    setFriendInfo(data){
        if(data.uid !== this.selectedUid) {
            return
        }
        this.friendInfo.setData(data,2);
    },
    // 打开信息界面
    openInfo(id) {
        this.selectedUid  = id
    },
    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        cc.dd.NetWaitUtil.close();
        switch (event) {
            case FriendEvent.OPEN_LOOKUP_REQUESTER: // 查看请求玩家详情
                this.openInfo(data);
                break;
            case FriendEvent.FRIEND_DETAIL: //更新朋友详细信息
                this.setFriendInfo(data)
                break;
            default:
                break;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        FriendED.addObserver(this);
        this.loadRequestList()
        this.loadFriendInfo()
    },

    start () {

    },

    onDestroy: function () {
        FriendED.removeObserver(this);
    },

    // update (dt) {},
});
