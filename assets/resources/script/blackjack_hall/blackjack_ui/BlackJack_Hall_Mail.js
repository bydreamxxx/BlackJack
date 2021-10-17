// create by wj
var hall_prefab = require('hall_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hallData = require('hall_common_data').HallCommonData;
var AppCfg = require('AppConfig');

const Hall = require('jlmj_halldata');
var dd = cc.dd;

const MIN_SECS = 60;
const HOUR_SECS = MIN_SECS * MIN_SECS;
const DAY_SECS = HOUR_SECS * 24;

cc.Class({
    extends: cc.Component,

    properties: {
        no_mail: { type: cc.Node, default: null, tooltip: '暂无信息提示' },
        mail: { type: cc.Node, default: null, tooltip: '有信息提示' },

        content_node: { type: cc.Node, default: null, tooltip: 'content节点' },
        mailitem_prefab: { type: cc.Node, default: null, tooltip: 'item预制' },
        _messageList: [],
        _rewardList: [],
        spaceY: 0,
        itemHeight: 84,

        subject_lbl: { type: cc.Label, default: null, tooltip: '主题' },
        text_lbl: { type: cc.Label, default: null, tooltip: '内容' },
        remain_lbl: { type: cc.Label, default: null, tooltip: '剩余时间' },
        reward_node: { type: cc.Node, default: null, tooltip: '附件隐藏节点' },
        reward_parent: { type: cc.Node, default: null, tooltip: '奖励父节点' },
        item_node: { type: cc.Node, default: null, tooltip: '道具' },
        items_atlas: { type: cc.SpriteAtlas, default: null, tooltip: '道具图集' },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        Hall.HallED.addObserver(this);
        this.remainColor = cc.color(255, 255, 255);
        this.remainColor2 = cc.color(192, 0, 0);
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
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
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        dd.NetWaitUtil.close();
        switch (event) {
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
                        this.setMailInfo(pdata)
  
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

    setMailList(data) {
        this.content_node.removeAllChildren();

        if (!data || !data.length) {
            this.no_mail.active = true
            return;
        }
        this.no_mail.active = false
        var cnt = data.length;
        this.content_node.height = cnt * this.itemHeight + (cnt + 1) * this.spaceY;

        for (var i = 0; i < data.length; i++) {
            var item = cc.instantiate(this.mailitem_prefab);
            item.active = true
            this.content_node.addChild(item);
            var scp = item.getComponent('BlakJack_Hall_Mail_Item');
            scp.setData(data[i]);

            var y = (i + 0.5) * this.itemHeight - i * this.spaceY;
            item.y = -y;
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

    setRead(mailId) {
        for (var i = 0; i < this.content_node.childrenCount; i++) {
            if (this.content_node.children[i].tagname == mailId) {
                var scp = this.content_node.children[i].getComponent('BlakJack_Hall_Mail_Item');
                if (scp) {
                    scp.setRead();
                }
            }
        }
    },

    setMailInfo(data){
        this.mail.active = true
        this.mailId = data.mailId;
        this.expireTime = data.expireTime;
        this.genRemainTime()
        this.schedule(this.genRemainTime, 1);

        this.subject_lbl.string = data.title;
        this.text_lbl.string = data.content;

        var rewardList = data.rewardList;
        if (!rewardList || !rewardList.length) {
            this.reward_node.active = false;
        }
        else {
            for (var i = 1; i < this.reward_parent.childrenCount; i++) {
                this.reward_parent.children[i].destroy();
            }
            for (var i = 0; i < rewardList.length; i++) {
                var item = cc.instantiate(this.item_node);
                item.parent = this.reward_parent;
                cc.find('icon', item).getComponent(cc.Sprite).spriteFrame = this.items_atlas.getSpriteFrame(rewardList[i].itemDataId);
                if (rewardList[i].itemDataId == 1004 || rewardList[i].itemDataId == 1006 || rewardList[i].itemDataId == 1099) {
                    rewardList[i].cnt = parseInt(rewardList[i].cnt / 100);
                }
                if (rewardList[i].cnt >= 10000) {
                    var wan = Math.floor(rewardList[i].cnt / 100) / 100;
                    cc.find('num_lbl', item).getComponent(cc.Label).string = wan + '万';
                }
                else {
                    cc.find('num_lbl', item).getComponent(cc.Label).string = rewardList[i].cnt;
                }
                let desc = ''
                let config = item_cfg.getItem((x) => { return x.key == rewardList[i].itemDataId });
                if(config){
                    desc = config.memo;
                }
                cc.find('dec', item).getComponent(cc.Label).string = desc;
                item.active = true;
            }
        }
    },

    
    genRemainTime() {
        var now = Math.floor(new Date().getTime() / 1000);
        var remainSeconds = this.expireTime - now;
        if (remainSeconds < 0) {
            this.unschedule(this.genRemainTime);
            return;
        }
        if (remainSeconds >= DAY_SECS) {
            this.remain_lbl.node.color = this.remainColor;
            this.remain_lbl.string = "Left:" + Math.floor(remainSeconds / DAY_SECS) + 'Days';
        }
        else if (remainSeconds >= HOUR_SECS) {
            this.remain_lbl.node.color = this.remainColor;
            this.remain_lbl.string = "Left:" +Math.floor(remainSeconds / HOUR_SECS) + 'Hours';
        }
        else if (remainSeconds >= MIN_SECS) {
            this.remain_lbl.node.color = this.remainColor;
            this.remain_lbl.string = "Left:" +Math.floor(remainSeconds / MIN_SECS) + 'Minutes';
        }
        else {
            this.remain_lbl.node.color = this.remainColor2;
            this.remain_lbl.string = "Left:" +remainSeconds + 'Second';
        }
    },

    getMailDataById(mailId) {
        for (var i = 0; i < this._messageList.length; i++) {
            if (this._messageList[i].mailId == mailId) {
                return this._messageList[i];
            }
        }
        return null;
    },

    //删除已查看的文本邮件
    deleteMail(event, data) {
        const req = new cc.pb.hall.hall_draw_mail_req;
        req.setMailId(this.mailId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_draw_mail_req, req,
            '发送协议 hall_draw_mail_req [删除邮件]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onReward');
    },
});
