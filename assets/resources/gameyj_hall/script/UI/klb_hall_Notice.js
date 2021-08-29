/**
 * 游戏公告
 */

var hall_prefab = require('hall_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

const Hall = require('jlmj_halldata');
var dd = cc.dd;

cc.Class({
    extends: cc.Component,

    properties: {
        no_notice: { type: cc.Node, default: null, tooltip: '暂无信息提示' },
        content_node: { type: cc.Node, default: null, tooltip: 'content节点' },
        noticeitem_prefab: { type: cc.Prefab, default: null, tooltip: 'item预制' },
        _noticeList: [],
        _activeList: [],
        _readList: [],
        title: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.type = 0;
        var list = cc.sys.localStorage.getItem('readNoticeList');
        if (!list) {
            list = [];
        } else {
            list = JSON.parse(list);
        }
        this._readList = list;

        Hall.HallED.addObserver(this);
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    start: function () {
    },

    _InitListData: function (list) {
        list.forEach(function (info) {
            switch (info.type) {
                case 0:
                    if(this.filterNoticeList(info))
                        this._noticeList.push(info);
                    break;
                case 1:
                    if(this.filterNoticeList(info))
                        this._activeList.push(info);
                    break;
            }
        }.bind(this));
        this.sortNoticeList(this._noticeList);
        this.sortNoticeList(this._activeList);
        if(this.type == 0){
            this.title.string = "公 告";
            this.setNoticeList(this._noticeList);
        }else{
            this.title.string = "活 动";
            this.setNoticeList(this._activeList);
        }
    },
    //时间筛选
    filterNoticeList: function(info){
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        var unix_timstamp = Math.floor(date.getTime() / 1000);
        if(info.timestamp <= unix_timstamp)
            return true;
        return false;
    },

    //排序
    sortNoticeList: function(list){
        var i = list.length;
        while(i > 0){
            for(var j = 0; j < i -1; j++){
                if(list[j].timestamp < list[j+1].timestamp)
                {
                    var temp = list[j+1];
                    list[j+1] = list[j];
                    list[j] = temp;
                }
            }
            i--;
        }
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     *获取公告信息
     */

    getNoticeInfo: function (data, type) {
        this.type = type;
        if(data){
            this._InitListData(data);
        }else{
            dd.NetWaitUtil.show('正在请求数据');
            const req = new cc.pb.hall.hall_req_config_notice;
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_config_notice, req,
                '发送协议[id: ${cc.netCmd.hall.cmd_hall_req_config_notice}],hall_req_config_notice[获取公告信息]', true);
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        dd.NetWaitUtil.close();
        switch (event) {
            case Hall.HallEvent.Get_Notice_Config_LIST: //获取战绩信息
                this._InitListData(data);
                break;
            default:
                break;
        }
    },

    /**
     * ietm触摸回调
     * @param obj
     * @private
     */
    _itemClick: function (obj) {
        var isRead = this._isRead(obj.title);
        if (!isRead) {
            // obj.flagSp.spriteFrame = obj.readSpf;
            this._readList.push(obj.title);
            cc.sys.localStorage.setItem('readNoticeList', JSON.stringify(this._readList));
            Hall.HallED.notifyEvent(Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM_AND_NOTICE);
        }
        this.createInfo(obj);

    },

    /**
     * 初始化详细信息
     */
    createInfo: function (data) {
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_NOTICEDETAIL, function (prefab) {
            var comp = prefab.getComponent('klb_hall_NoticeDetail');
            comp.createInfo(data);
        }.bind(this));
    },

    /**
     * 是否是已读邮件
     * @param title
     * @return {boolean}
     */
    _isRead: function (title) {
        if (this._readList.length == 0) {
            return false;
        }
        var isRead = false;
        this._readList.forEach(function (item) {
            if (item == title) {
                isRead = true;
            }
        });
        return isRead;
    },

    setNoticeList(list) {
        this.content_node.removeAllChildren();

        if (!list || !list.length) {
            return;
        }

        for (var i in list) {
            var item = list[i];
            var node = cc.instantiate(this.noticeitem_prefab);
            node.parent = this.content_node;
            item.read = this._isRead(item.title);
            var cpt = node.getComponent('klb_hall_NoticeItem');
            cpt.init(item, this._itemClick.bind(this));
        }

        var childrenCount = this.content_node.childrenCount;
        this.no_notice.active = childrenCount <= 0;
    }
});
