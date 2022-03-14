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
        this.friendListContent.removeAllChildren()
        let datas = FriendData.getApplyList()
        this.friendItemList = []
        for(let i=0; i<datas.length; i++) {
            let node = cc.instantiate(this.friendItemPrefab);
            let friendItem = node.getComponent("FriendItem");
            friendItem.setData(datas[i].info, 2);
            node.parent = this.friendListContent

            this.friendItemList.push(friendItem)
        }
    },
    // 加载朋友信息
    loadFriendInfo() {
        let node = cc.instantiate(this.friendInfoPrefab);
        this.friendInfo = node.getComponent("FriendInfo");
        node.parent = this.friendInfoPanel
        this.friendInfoPanel.active = false
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
        let datas = FriendData.getApplyList()
        for(let i=0; i<datas.length; i++) {
            this.friendItemList[i].setSelected(datas[i].info.uid===this.selectedUid)
            if(datas[i].info.uid===this.selectedUid) {
                this.friendInfo.setCaptcha(datas[i].captcha)
            }
        }
        this.friendInfoPanel.active = !!this.selectedUid
    },
    showUI() {
        this.loadRequestList()
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
            case FriendEvent.FRIEND_APPLY_LIST:
                this.loadRequestList()
                break
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
