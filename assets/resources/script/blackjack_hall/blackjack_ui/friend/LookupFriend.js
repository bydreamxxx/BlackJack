var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var FriendData = require('hall_friend').FriendData.Instance();
var FriendED = require('hall_friend').FriendED;
var FriendEvent = require('hall_friend').FriendEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        friendInfoPanel: cc.Node,
        friendInfoPrefab: cc.Prefab,
    },

    showUI(uid) {
        this.selectedUid = uid
    },
    
    // 加载朋友信息
    loadFriendInfo() {
        let node = cc.instantiate(this.friendInfoPrefab);
        this.friendInfo = node.getComponent("FriendInfo");
        node.parent = this.friendInfoPanel
    },
    // 设置信息
    setFriendInfo(data){
        if(data.uid !== this.selectedUid) {
            return
        }
        this.friendInfo.setData(data,3);
    },

    // 关闭
    onClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        cc.dd.NetWaitUtil.close();
        switch (event) {
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
        this.loadFriendInfo()
    },

    start () {

    },

    onDestroy: function () {
        FriendED.removeObserver(this);
    },

    // update (dt) {},
});
