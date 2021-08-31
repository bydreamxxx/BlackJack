const MIN_SECS = 60;
const HOUR_SECS = MIN_SECS * MIN_SECS;
const DAY_SECS = HOUR_SECS * 24;
const Hall = require('jlmj_halldata');
var hall_prefab = require('hall_prefab_cfg');
const item_cfg = require('item');

cc.Class({
    extends: cc.Component,

    properties: {
        sender_lbl: { type: cc.Label, default: null, tooltip: '发送人' },
        subject_lbl: { type: cc.Label, default: null, tooltip: '主题' },
        text_lbl: { type: cc.Label, default: null, tooltip: '内容' },
        remain_lbl: { type: cc.Label, default: null, tooltip: '剩余时间' },
        reward_node: { type: cc.Node, default: null, tooltip: '附件隐藏节点' },
        reward_parent: { type: cc.Node, default: null, tooltip: '奖励父节点' },
        item_node: { type: cc.Node, default: null, tooltip: '道具' },
        system_flag: { type: cc.Node, default: null, tooltip: '系统邮件' },
        items_atlas: { type: cc.SpriteAtlas, default: null, tooltip: '道具图集' },
        copyNode: cc.Node,//复制兑换码
        titleSprite: cc.Sprite,
        titleSpriteFrame: [cc.SpriteFrame],
        reward_button: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        Hall.HallED.addObserver(this);
        this.remainColor = cc.color(99, 65, 31);
        this.remainColor2 = cc.color(192, 0, 0);
    },

    onDestroy() {
        Hall.HallED.removeObserver(this);
    },

    onClose() {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    setData(data) {
        this.mailId = data.mailId;
        this.expireTime = data.expireTime;
        this.genRemainTime();
        this.schedule(this.genRemainTime, 1);

        if (data.mailType == 1) {
            this.sender_lbl.string = data.sender;
            this.sender_lbl.node.color = data.mailType == 1 ? cc.color(192, 0, 0) : cc.color(0, 192, 0);
            cc.find('actNode/sender_lbl', this.node).getComponent(cc.Label).string = '系统';
        }
        else {
            this.sender_lbl.node.parent.active = false;
            cc.find('actNode/sender_lbl', this.node).getComponent(cc.Label).string = data.sender;
            cc.find('qlcy', this.sender_lbl.node.parent.parent).active = true;
        }

        this.system_flag.active = data.mailType != 1;
        this.subject_lbl.string = data.title;
        this.text_lbl.string = data.content;
        if (data.content.indexOf('兑换码') != -1) {
            this.copyNode.active = true;
            if (data.content.indexOf('红包兑换码') != -1) {
                this._cashType = 3;
            }
            else {
                this._cashType = 1;
            }
        }
        else {
            this.copyNode.active = false;
        }
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
            this.remain_lbl.string = Math.floor(remainSeconds / DAY_SECS) + '天';
        }
        else if (remainSeconds >= HOUR_SECS) {
            this.remain_lbl.node.color = this.remainColor;
            this.remain_lbl.string = Math.floor(remainSeconds / HOUR_SECS) + '小时';
        }
        else if (remainSeconds >= MIN_SECS) {
            this.remain_lbl.node.color = this.remainColor;
            this.remain_lbl.string = Math.floor(remainSeconds / MIN_SECS) + '分钟';
        }
        else {
            this.remain_lbl.node.color = this.remainColor2;
            this.remain_lbl.string = remainSeconds + '秒';
        }
    },
    // update (dt) {},

    onReward() {
        const req = new cc.pb.hall.hall_draw_mail_req;
        req.setMailId(this.mailId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_draw_mail_req, req,
            '发送协议 hall_draw_mail_req [删除邮件]', true);
        this.onClose();
    },

    onClickCopy() {
        var msg = new cc.pb.hall.msg_open_code_req();
        msg.setType(1);
        msg.setOpType(this._cashType);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_open_code_req, msg, "msg_open_code_req", true);
    },

    openCodeListUI: function (msg) {
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_CODELIST, function (prefab) {
            var component = prefab.getComponent('klb_hall_ExchangeCodeList');
            component.setData(msg);
        }.bind(this));
    },

    onEventMessage(event, data) {
        switch (event) {
            case Hall.HallEvent.Exchange_Code_List:
                this.openCodeListUI(data);
                break;
        }
    },
});
