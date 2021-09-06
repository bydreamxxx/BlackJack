/**
 * 游戏公告
 */

var hall_prefab = require('hall_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hallData = require('hall_common_data').HallCommonData;
var AppCfg = require('AppConfig');

const Hall = require('jlmj_halldata');
var dd = cc.dd;

let mail = cc.Class({
    extends: cc.Component,

    properties: {
        no_mail: { type: cc.Node, default: null, tooltip: '暂无信息提示' },
        content_node: { type: cc.Node, default: null, tooltip: 'content节点' },
        mail_num_lbl: { type: cc.Label, default: null, tooltip: '邮件数量' },
        mailitem_prefab: { type: cc.Prefab, default: null, tooltip: 'item预制' },
        _messageList: [],
        _rewardList: [],
        noticeTip: cc.Node,
        noticeTipNum: cc.Label,
        activeTip: cc.Node,
        activeTipNum: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        Hall.HallED.addObserver(this);
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    start: function () {
        this.setNoticeTip();
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     *获取公告信息
     */

    getMailInfo: function () {
        dd.NetWaitUtil.show('正在请求数据');

        const req2 = new cc.pb.hall.hall_mail_list_req;
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_mail_list_req, req2,
            '发送协议[id: ${cc.netCmd.hall.cmd_hall_mail_list_req}],hall_mail_list_req[获取邮件信息]', true);

        const req = new cc.pb.hall.hall_req_config_notice;
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_config_notice, req,
            '发送协议[id: ${cc.netCmd.hall.cmd_hall_req_config_notice}],hall_req_config_notice[获取公告信息]', true);
    },

    getMailDataById(mailId) {
        for (var i = 0; i < this._messageList.length; i++) {
            if (this._messageList[i].mailId == mailId) {
                return this._messageList[i];
            }
        }
        return null;
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
                this.noticeData = data;
                break;
            case Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM_AND_NOTICE:
                this.setNoticeTip();
                break;
            case Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM:
                const req2 = new cc.pb.hall.hall_mail_list_req;
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_mail_list_req, req2,
                    '发送协议[id: ${cc.netCmd.hall.cmd_hall_mail_list_req}],hall_mail_list_req[获取邮件信息]', true);
                break;
            case Hall.HallEvent.MAIL_LIST_ACK:
                this._messageList = [];
                data.mailListList.forEach(function (item) {
                    this._messageList.push(item);
                }.bind(this));
                this.setMailList(data.mailListList);
                break;
            case Hall.HallEvent.READ_MAIL_ACK:
                if (data.code == 0) {
                    var mail = this.getMailDataById(data.mailId);
                    if (mail) {
                        var pdata = {
                            mailId: mail.mailId,
                            expireTime: mail.expireTime,
                            mailType: mail.mailType,
                            sender: mail.senderName,
                            title: data.title,
                            content: data.content,
                            rewardList: data.rewardList,
                        };
                        this.setRead(data.mailId);
                        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_MAILDETAIL, function (UI) {
                            var scp = UI.getComponent('klb_hall_mail_detail');
                            scp.setData(pdata);
                        }.bind(this));
                        if (!mail.isRead) {
                            hallData.getInstance().unread_mail_num--;
                            var canv = cc.find('Canvas');
                            if (canv) {
                                var scp = canv.getComponent('klb_hallScene');
                                if (scp) {
                                    scp.updateUnreadMail();
                                }
                            }
                            mail.isRead = true;
                        }
                    }
                    else {
                        cc.dd.PromptBoxUtil.show('邮件不存在');
                    }
                }
                else {
                    cc.dd.PromptBoxUtil.show('邮件不存在');
                }
                break;
            case Hall.HallEvent.DRAW_MAIL_ACK:
                if (data.code == 0) {
                    var mail = this.getMailDataById(data.mailId);
                    if (mail) {
                        var cpt = this.removeItemById(data.mailId);
                        var rewardList = data.rewardList;
                        if (rewardList && rewardList.length) {
                            for (var i = 0; i < rewardList.length; i++) {
                                this._rewardList.push(rewardList[i]);
                            }
                        }
                        if (!mail.isRead) {
                            hallData.getInstance().unread_mail_num--;
                            var canv = cc.find('Canvas');
                            if (canv) {
                                var scp = canv.getComponent(AppCfg.HALL_NAME);
                                if (scp) {
                                    scp.updateUnreadMail();
                                }
                            }
                            mail.isRead = true;
                        }
                    }
                    else {
                        cc.dd.PromptBoxUtil.show('邮件不存在');
                    }
                }
                else {
                    cc.dd.PromptBoxUtil.show('邮件不存在');
                }
                break;
            default:
                break;
        }
    },

    showReward(data) {
        this.rewardShowing = true;
        this.scheduleOnce(function () {
            cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_daily_lottery_get_award", function (prefab) {
                var cp = prefab.getComponent('klb_hall_daily_lottery_get_award');
                cp.setData(data.itemDataId, data.cnt);
                this.rewardShowing = false;
            }.bind(this));
        }.bind(this), 0.5);
    },

    update(dt) {
        if (this._rewardList.length && !this.rewardShowing && !cc.dd.UIMgr.getUI('blackjack_hall/prefabs/klb_hall_daily_lottery_get_award')) {
            this.showReward(this._rewardList.shift());
        }
    },

    setMailList(data) {
        this.content_node.removeAllChildren();

        if (!data || !data.length) {
            this.refreshBtns();
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var item = cc.instantiate(this.mailitem_prefab);
            this.content_node.addChild(item);
            var scp = item.getComponent('klb_hall_mail_item');
            scp.setData(data[i]);
        }
        this.refreshBtns();
    },

    removeItemById(mailId) {
        for (var i = 0; i < this.content_node.childrenCount; i++) {
            if (this.content_node.children[i].tagname == mailId) {
                this.content_node.children[i].removeFromParent();
                break;
            }
        }
        this.refreshBtns();
    },

    //更新一键删除和一键领取的状态
    refreshBtns() {
        var childrenCount = this.content_node.childrenCount;

        this.no_mail.active = childrenCount <= 0;
        cc.find('mail/delete_all', this.node).getComponent(cc.Button).interactable = childrenCount > 0;
        var reward = false;
        for (var i = 0; i < this.content_node.childrenCount; i++) {
            var scp = this.content_node.children[i].getComponent('klb_hall_mail_item');
            if (scp && scp.hasReward) {
                reward = true;
                break;
            }
        }
        cc.find('mail/reward_all', this.node).getComponent(cc.Button).interactable = reward;
        this.mail_num_lbl.string = childrenCount + '/60';
    },

    //删除所有已查看的文本邮件
    deleteAll(event, data) {
        var list = [];
        for (var i = 0; i < this.content_node.childrenCount; i++) {
            var scp = this.content_node.children[i].getComponent('klb_hall_mail_item');
            if (scp && !scp.hasReward && scp.isRead) {
                list.push(scp.mailId);
            }
        }
        for (var i = 0; i < list.length; i++) {
            const req = new cc.pb.hall.hall_draw_mail_req;
            req.setMailId(list[i]);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_draw_mail_req, req,
                '发送协议 hall_draw_mail_req [删除邮件]', true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onReward');
        }
    },

    setRead(mailId) {
        for (var i = 0; i < this.content_node.childrenCount; i++) {
            if (this.content_node.children[i].tagname == mailId) {
                var scp = this.content_node.children[i].getComponent('klb_hall_mail_item');
                if (scp) {
                    scp.setRead();
                }
            }
        }
    },
    //领取所有奖励邮件
    rewardAll(event, data) {
        var list = [];
        for (var i = 0; i < this.content_node.childrenCount; i++) {
            var scp = this.content_node.children[i].getComponent('klb_hall_mail_item');
            if (scp && scp.hasReward) {
                list.push(scp.mailId);
            }
        }
        for (var i = 0; i < list.length; i++) {
            const req = new cc.pb.hall.hall_draw_mail_req;
            req.setMailId(list[i]);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_draw_mail_req, req,
                '发送协议 hall_draw_mail_req [删除邮件]', true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onReward');
        }
    },

    //发送邮件
    sendMail(event, custom) {
        if (this.haveLaba()) {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_MAILSEND, function (UI) {

            }.bind(this));
        } else {
            cc.dd.PromptBoxUtil.show('道具不足，请前往商城购买');
        }
    },

    haveLaba() {
        //TODO: 获取是否有喇叭
        return true;
    },

    onClickNotice: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_NOTICE, function (prefab) {
            var comp = prefab.getComponent('klb_hall_Notice');
            comp.getNoticeInfo(this.noticeData, 0);
        }.bind(this));
    },

    onClickActive: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_NOTICE, function (prefab) {
            var comp = prefab.getComponent('klb_hall_Notice');
            comp.getNoticeInfo(this.noticeData, 1);
        }.bind(this));
    },

    setNoticeTip() {
        let notice_length = hallData.getInstance().getNoticeLength();
        this.noticeTipNum.string = notice_length[1].toString();
        if (notice_length[1] > 0) {
            this.noticeTip.active = true;
        } else {
            this.noticeTip.active = false;
        }

        this.activeTipNum.string = notice_length[2].toString();
        if (notice_length[2] > 0) {
            this.activeTip.active = true;
        } else {
            this.activeTip.active = false;
        }
    }
});
module.exports = mail;
