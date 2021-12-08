//create by wj 2018/08/24
const activityCfg = require('activity');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
var hallData = require('hall_common_data').HallCommonData;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var AppConfig = require('AppConfig');
var hall_prefab = require('hall_prefab_cfg');
var dd = cc.dd;

let activity = cc.Class({
    extends: cc.Component,

    properties: {
        scrollNode: cc.Node,
        contentNode: cc.Node,
        spaceY: 0,
        itemHeight: 84,
        _itemList: [],
        uiParentNode: cc.Node,
        m_oActiveNode: cc.Node,
        m_oNoticeNode: cc.Node,
        m_bClick: false,

        _noticeItemList: [],
        noticeContentNode: cc.Node,
        m_tNoticeList: [],
        descTxt: cc.Node,
        m_oNoticeTip: cc.Node,
    },

    onLoad: function () {
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        this.initScrollView();
        this.showImportTip();
        this.m_oNoticeNode.active = false;
        Hall.HallED.notifyEvent(Hall.HallEvent.CLOSE_ACTIVE_TIP);

        var list = cc.sys.localStorage.getItem('readActiveNoticeList');
        if (!list) {
            list = [];
        } else {
            list = JSON.parse(list);
        }
        this._readList = list;


        const req = new cc.pb.hall.hall_req_config_notice;
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_config_notice, req,
            '发送协议[id: ${cc.netCmd.hall.cmd_hall_req_config_notice}],hall_req_config_notice[获取公告信息]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'hall_req_config_notice');

    },

    onDestroy: function () {
        cc.sys.localStorage.setItem('readActiveNoticeList', JSON.stringify(this._readList));
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    initScrollView: function () {
        this._itemList.splice(0, this._itemList.length);
        this.contentNode.removeAllChildren(true);
        var node = cc.dd.Utils.seekNodeByName(this.node, "select");
        var isfirst = true;
        activityCfg.items.sort((a, b) => {
            return a.sort - b.sort
        });
        for (var i = 0; i < activityCfg.items.length; i++) {
            var data = activityCfg.items[i];
            if (data.isopen == 1) {
                if ((data.key == 6 || data.key == 7) && !Hall.HallData.Instance().checkActivityIsOpen())
                    continue;
                if (data.key == 4 && cc.game_pid == 10004)
                    continue;
                if (data.key == 3) {
                    continue;
                }
                if (data.content == '分享有礼') {
                    if (cc.dd.user.regChannel >= 10000) {
                        if (cc.dd.user.regChannel != cc.game_pid)
                            continue;
                    } else {
                        if (!cc._inviteTaskOpen)
                            continue;
                    }
                }
                var itemNode = cc.instantiate(node);
                this._itemList.push(itemNode);
                itemNode.parent = this.contentNode;
                itemNode.active = true;
                var cpt = itemNode.getComponent(cc.Toggle);
                cpt.toggleGroup = this.contentNode;
                itemNode.tagname = data.key;

                var cnt = this._itemList.length;
                var y = (cnt - 0.5) * this.itemHeight + (cnt - 1) * this.spaceY;
                itemNode.y = -y;
                this.contentNode.height = cnt * this.itemHeight + (cnt + 1) * this.spaceY;

                var text = cc.dd.Utils.seekNodeByName(itemNode, "text");
                var text1 = cc.dd.Utils.seekNodeByName(itemNode, "text1");
                text.getComponent("LanguageLabel").setText(data.content);
                text1.getComponent("LanguageLabel").setText( data.content);
            }
        }
    },

    /**
     * 红点提示
     */
    showImportTip: function () {
        this._itemList.forEach(function (prefab) {
            var flag = cc.dd.Utils.seekNodeByName(prefab, "flag");
            if (prefab.tagname == 2) {
                if (Hall.HallData.Instance().sign_data && !Hall.HallData.Instance().isSigned) {
                    flag.active = true;
                } else
                    flag.active = false;
            } else if (prefab.tagname == 3) {
                if (hallData.getInstance().idNum == '') {
                    flag.active = true;
                } else
                    flag.active = false;

            } else if (prefab.tagname == 6 || prefab.tagname == 7) {
                if (Hall.HallData.Instance().checkActivityIsOpen() && this.m_bClick == false)
                    flag.active = true;
                else
                    flag.active = false;
            }
        }.bind(this));

    },


    /**
     * 更改选中的按钮游戏标签状态
     */
    changeBtnState: function (tag) {
        this._itemList.forEach(function (prefab) {
            if (prefab.tagname == tag) {
                prefab.getComponent(cc.Toggle).isChecked = true;
                prefab.getChildByName('Background').active = false;
                if (tag == 6 || tag == 7) {
                    this.m_bClick = true;
                    this.showImportTip();
                }

                var flag = cc.dd.Utils.seekNodeByName(prefab, 'tipflag');
                if (flag) {
                    flag.active = false;
                }
            }
            else {
                prefab.getComponent(cc.Toggle).isChecked = false;
                prefab.getChildByName('Background').active = true;
            }
        }.bind(this));
    },

    //选中标签
    onSelectTag: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var key = event.node.tagname;
        event.node.getChildByName('Background').active = !event.isChecked;
        this.showUI(key);
    },

    showDefaultSelect: function () {
        activityCfg.items.sort((a, b) => { return a.sort - b.sort });

        for (var i = 0; i < activityCfg.items.length; i++) {
            var data = activityCfg.items[i];
            if (data.isopen == 1) {
                if ((data.key == 6 || data.key == 7) && !Hall.HallData.Instance().checkActivityIsOpen())
                    continue;
                this.showUI(data.key);
                return;
            }
        }
    },

    //显示界面
    showUI: function (key) {
        var data = activityCfg.getItem(function (item) {
            if (key == item.key)
                return item;
        });
        this.m_oNoticeNode.active = false;
        this.m_oActiveNode.active = true;
        if (data) {
            switch (AppConfig.GAME_PID) {
                case 2: //快乐吧长春麻将
                case 3: //快乐吧农安麻将
                case 4:  //快乐吧填大坑
                case 5:  //快乐吧牛牛
                    if (key == 4)
                        data.ui = 'klb_hall_daily_active_DL';
                    break;
            }
            this.changeBtnState(key);
            this.uiParentNode.removeAllChildren(true);
            var path = 'blackjack_hall/prefabs/daily_active/' + data.ui;
            cc.dd.UIMgr.openUI(path, function (prefab) {
                prefab.parent = this.uiParentNode;

                // let scaleX = this.uiParentNode.width / prefab.width;
                // let scaleY = this.uiParentNode.height / prefab.height;
                // prefab.scaleX = scaleX;
                // prefab.scaleY = scaleY;

                prefab.setPosition(cc.v2(0, 0));
            }.bind(this));
        }
    },
    //////////////////////////////////////////////////////////公告信息/////////////////////////////////////////////////
    //红点提示处理
    showNoticeTip: function () {
        if (this.m_tNoticeList.length != 0) {
            var date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            var unix_timstamp = Math.floor(date.getTime() / 1000);

            var timestamp = cc.sys.localStorage.getItem('timestamp');
            if (timestamp) {
                if (timestamp != unix_timstamp) {
                    cc.sys.localStorage.setItem('timestamp', unix_timstamp);
                    this.m_oNoticeTip.active = true;
                } else {
                    this.m_tNoticeList.forEach(function (notice) {
                        if (!notice.read)
                            this.m_oNoticeTip.active = true;
                    });
                }
            } else {//从未有记录
                cc.sys.localStorage.setItem('timestamp', unix_timstamp);
                this.m_oNoticeTip.active = true;
                // var noticeList = [];
                // this.m_tNoticeList.forEach(function (item) {
                //     noticeList.push(item.title);
                // });

                // cc.sys.localStorage.setItem('newNoticeList', JSON.stringify(noticeList));
                // cc.sys.localStorage.setItem('NoticeList', JSON.stringify(noticeList));
            }
        }

    },

    filterNoticeList: function (noticeList) {
        this.m_tNoticeList.splice(0, this.m_tNoticeList.length);
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        var unix_timstamp = Math.floor(date.getTime() / 1000);
        for (var i = 0; i < noticeList.length; i++) {
            var data = noticeList[i];
            if (data.timestamp <= unix_timstamp) {
                this.m_tNoticeList.push(data);
            }
        }
        this.sortNoticeList();

    },

    //排序
    sortNoticeList: function () {
        var i = this.m_tNoticeList.length;
        while (i > 0) {
            for (var j = 0; j < i - 1; j++) {
                if (this.m_tNoticeList[j].level < this.m_tNoticeList[j + 1].level) {
                    var temp = this.m_tNoticeList[j + 1];
                    this.m_tNoticeList[j + 1] = this.m_tNoticeList[j];
                    this.m_tNoticeList[j] = temp;
                }
            }
            i--;
        }
    },

    initNoticeScorllView: function () {
        if (this.m_tNoticeList.length == 0) {
            // this.m_oNoticeNode.active = false;
            return;
        }
        // this._noticeItemList.splice(0, this._noticeItemList.length);
        for (let i = this.contentNode.children.length - 1; i >= 0; i--) {
            if (this.contentNode.children[i].tagname >= 1000) {
                this.contentNode.children[i].removeFromParent(true);
            }
        }

        var node = cc.dd.Utils.seekNodeByName(this.node, "selectNotice");
        for (var i = 0; i < this.m_tNoticeList.length; i++) {
            var data = this.m_tNoticeList[i];
            var itemNode = cc.instantiate(node);
            this._itemList.push(itemNode);
            itemNode.parent = this.contentNode;
            itemNode.active = true;
            var cpt = itemNode.getComponent(cc.Toggle);
            cpt.toggleGroup = this.contentNode;
            // if (isfirst) {
            //     isfirst = false;
            //     cpt.isChecked = true;
            //     this.showNoticeDetail(i);
            // }
            itemNode.tagname = 1000 + i;

            var cnt = this._itemList.length;
            var y = (cnt - 0.5) * this.itemHeight + (cnt - 1) * this.spaceY;
            itemNode.y = -y;
            this.contentNode.height = cnt * this.itemHeight + (cnt + 1) * this.spaceY;

            var text = cc.dd.Utils.seekNodeByName(itemNode, "text");
            var text1 = cc.dd.Utils.seekNodeByName(itemNode, "text1");
            var flag = cc.dd.Utils.seekNodeByName(itemNode, 'tipflag');
            text.getComponent(cc.Label).string = data.title;
            text1.getComponent(cc.Label).string = data.title;
            data.read = this._isRead(data.title + data.timestamp);
            flag.active = !data.read;
        }
    },


    /**
     * 更改选中的按钮游戏标签状态
     */
    changeNoticeBtnState: function (tag) {
        this._noticeItemList.forEach(function (prefab) {
            if (prefab.tagname == tag) {
                prefab.getComponent(cc.Toggle).isChecked = true;
                var flag = cc.dd.Utils.seekNodeByName(prefab, 'tipflag');
                flag.active = false;
            }
            else
                prefab.getComponent(cc.Toggle).isChecked = false;
        });
    },

    //选中标签
    onSelectNoticeTag: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var key = event.node.tagname;
        this.m_oNoticeTip.active = false;
        event.node.getChildByName('Background').active = !event.isChecked;
        this.showNoticeDetail(key);
    },

    /**
     * 是否是已读邮件
     * @param title
     * @return {boolean}
     */
    _isRead: function (info) {
        if (this._readList.length == 0) {
            return false;
        }
        var isRead = false;
        this._readList.forEach(function (item) {
            if (item == info) {
                isRead = true;
            }
        });
        return isRead;
    },

    //显示界面
    showNoticeDetail: function (key) {
        this.changeBtnState(key);

        var data = this.m_tNoticeList[key - 1000];
        var isRead = this._isRead(data.title + data.timestamp);
        if (!isRead) {
            this._readList.push(data.title + data.timestamp);
            data.read = true;
            cc.sys.localStorage.setItem('readActiveNoticeList', JSON.stringify(this._readList));
            Hall.HallED.notifyEvent(Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM_AND_NOTICE);
        }
        this.m_oNoticeNode.active = true;
        this.m_oActiveNode.active = false;
        this.m_oNoticeNode.getComponent('klb_hall_NoticeDetail').createInfo(data);
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    clickTag: function (event, data) {
        // hall_audio_mgr.com_btn_click();
        // this.descTxt.active = false;
        // this.type = parseInt(data);
        // cc.sys.localStorage.setItem('readActiveNoticeList', JSON.stringify(this._readList));
        // switch (this.type) {
        //     case 0:
        //         this.m_oActiveNode.active = true;
        //         this.m_oNoticeNode.active = false;
        //         break;
        //     case 1:
        //         this.m_oActiveNode.active = false;
        //         this.m_oNoticeNode.active = true;
        //         if (this.m_tNoticeList.length == 0) {
        //             this.descTxt.active = true;
        //             this.m_oNoticeNode.active = false;
        //             return;
        //         }
        //         this.initNoticeScorllView();
        //         break;
        // }
    },


    closeUI: function () {
        hall_audio_mgr.com_btn_click();
        cc.sys.localStorage.setItem('readActiveNoticeList', JSON.stringify(this._readList));
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
        if (cc.dd._firstShowSign) {
            cc.dd._firstShowSign = false;
            if (hallData.getInstance().idNum == '' && !cc.dd.isCertified) {
                cc.dd.isCertified = true;
                // cc.dd.DialogBoxUtil.show(0, '实名认证可以领取丰厚奖励，前往领取', 'text33', 'Cancel', function () {
                //     // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_USERINFO, function (ui) {
                //     //     ui.getComponent('klb_hall_UserInfo').setData(hallData.getInstance());
                //     //     cc.find('topBtn/toggle1', ui).getComponent(cc.Toggle).isChecked = true;
                //     //     cc.find('topBtn/toggle2', ui).getComponent(cc.Toggle).isChecked = false;
                //     //     cc.find('topBtn/toggle3', ui).getComponent(cc.Toggle).isChecked = false;
                //     //     ui.getComponent('klb_hall_UserInfo').switchPage(null, 0);
                //     // });
                //     cc.dd.UIMgr.openUI(hall_prefab.CERTIFICATION);
                // }, null, '实名认证');
            }
        }
    },

    onEventMessage: function (event, data) {
        dd.NetWaitUtil.close();
        switch (event) {
            case Hall.HallEvent.Get_Notice_Config_LIST: //获取战绩信息
                if (data.length == 0) {
                    this.descTxt.active = true;
                    // this.m_oActiveNode.active = false;
                    this.m_oNoticeNode.active = false;
                }
                else {
                    // this.m_oActiveNode.active = false;
                    // this.m_oNoticeNode.active = true;
                    this.showNoticeTip();
                    this.filterNoticeList(data);
                    // this.initNoticeScorllView();
                }
                break;
            case Hall.HallEvent.DAILYSIGN_END:
            case HallCommonEvent.REAL_NAME_AUTHEN:
                this.showImportTip();
                break;
        }
    },
});
module.exports = activity;
