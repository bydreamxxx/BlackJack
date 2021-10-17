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
        subject_lbl: { type: cc.Label, default: null, tooltip: '主题' },
        subject_lbl1: { type: cc.Label, default: null, tooltip: '主题' },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.remainColor = cc.color(143, 79, 19);
        this.remainColor2 = cc.color(192, 0, 0);
    },

    start() {

    },

    setData(data) {
        var hasReward = data.hasReward;
        var title = data.title;
        var isRead = data.isRead;
        var expireTime = data.expireTime;
        //============================
        this.mailId = data.mailId;
        this.mailType = data.mailType;
        this.hasReward = hasReward;
        this.isRead = isRead;
        this.expireTime = expireTime;
        this.node.tagname = this.mailId;

        this.subject_lbl.string = title;
        this.subject_lbl1.string = title;
    },

    setRead() {
        this.isRead = true;
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
});
