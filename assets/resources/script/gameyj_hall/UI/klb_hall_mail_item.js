// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const MIN_SECS = 60;
const HOUR_SECS = MIN_SECS * MIN_SECS;
const DAY_SECS = HOUR_SECS * 24;

cc.Class({
    extends: cc.Component,

    properties: {
        icon_sp: { type: cc.Sprite, default: null, tooltip: '头像sprite' },
        gift_node: { type: cc.Node, default: null, tooltip: '礼物icon节点' },
        time_lbl: { type: cc.Label, default: null, tooltip: '发送时间' },
        sender_lbl: { type: cc.Label, default: null, tooltip: '发送人' },
        subject_lbl: { type: cc.Label, default: null, tooltip: '主题' },
        remain_lbl: { type: cc.Label, default: null, tooltip: '剩余时间' },
        delete_node: { type: cc.Node, default: null, tooltip: '删除按钮' },
        reward_node: { type: cc.Node, default: null, tooltip: '领取按钮' },
        view_node: { type: cc.Node, default: null, tooltip: '查看按钮' },
        unread_tex: { type: cc.SpriteFrame, default: null, tooltip: '未读图片' },
        read_tex: { type: cc.SpriteFrame, default: null, tooltip: '已读图片' },
        qlcy_tex: { type: cc.SpriteFrame, default: null, tooltip: '千里传音' },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.remainColor = cc.color(143, 79, 19);
        this.remainColor2 = cc.color(192, 0, 0);
    },

    start() {

    },

    setData(data) {
        var mailType = data.mailType;
        var hasReward = data.hasReward;
        var senderName = data.senderName;
        var title = data.title;
        var isRead = data.isRead;
        var expireTime = data.expireTime;
        var sendTime = data.sendTime;
        //============================
        this.mailId = data.mailId;
        this.mailType = data.mailType;
        this.hasReward = hasReward;
        this.isRead = isRead;
        this.expireTime = expireTime;
        this.node.tagname = this.mailId;

        this.icon_sp.spriteFrame = mailType == 1 ? (isRead ? this.read_tex : this.unread_tex) : this.qlcy_tex;
        this.gift_node.active = hasReward || false;
        this.time_lbl.string = this.genSendTime(sendTime);
        this.sender_lbl.string = senderName;
        this.sender_lbl.node.color = mailType == 1 ? cc.color(192, 0, 0) : cc.color(143, 79, 19);
        this.subject_lbl.string = title;
        this.schedule(this.genRemainTime, 1);
        this.genRemainTime();
        if (hasReward) {//有附件
            // this.reward_node.active = true;
        }
        else {
            if (isRead) {//已读
                this.delete_node.active = true;
            }
            else {
                // this.view_node.active = true;
            }
        }
    },

    update(dt) {

    },

    setRead() {
        this.isRead = true;
        if (this.mailType == 1)
            this.icon_sp.spriteFrame = this.read_tex;
        if (!this.hasReward) {
            this.delete_node.active = true;
            this.view_node.active = false;
        }
    },

    genSendTime(stamp) {
        var date = new Date(stamp * 1000);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var M = date.getMinutes();
        var s = date.getSeconds();
        var str = '';
        str += y + '-';
        str += (m > 9 ? m : ('0' + m)) + '-';
        str += (d > 9 ? d : ('0' + d)) + '\n';
        str += (h > 9 ? h : ('0' + h)) + ':';
        str += (M > 9 ? M : ('0' + M)) + ':';
        str += (s > 9 ? s : ('0' + s));
        return str;
    },

    genRemainTime() {
        var now = Math.floor(new Date().getTime() / 1000);
        var remainSeconds = this.expireTime - now;
        if (remainSeconds < 0) {
            this.unschedule(this.genRemainTime);
            this.node.parent.parent.parent.getComponent('klb_hall_mail').removeItemById(this.mailId);
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

    //查看
    onView(event, data) {
        if (!this.viewCD) {
            this.viewCD = true;
            this.scheduleOnce(function () {
                this.viewCD = false;
            }.bind(this), 1);
            const req = new cc.pb.hall.hall_read_mail_req;
            req.setMailId(this.mailId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_read_mail_req, req,
                '发送协议 hall_read_mail_req [查看邮件]', true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onView');
        }
    },

    //领取或删除
    onDelete(event, data) {
        const req = new cc.pb.hall.hall_draw_mail_req;
        req.setMailId(this.mailId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_draw_mail_req, req,
            '发送协议 hall_draw_mail_req [删除邮件]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onReward');
    },
});
