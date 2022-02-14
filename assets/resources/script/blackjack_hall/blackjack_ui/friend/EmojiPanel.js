var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var FriendData = require('hall_friend').FriendData.Instance();
var FriendED = require('hall_friend').FriendED;
var FriendEvent = require('hall_friend').FriendEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        emojiContent: cc.Node
    },

    // 关闭
    onClose() {
        hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.destroyUI(this.node);
        this.node.active = false
    },

    onClickEmoji(event, data) {
        FriendED.notifyEvent(FriendEvent.FRIEND_SEND_EMOJI, parseInt(data));
        this.onClose()
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
