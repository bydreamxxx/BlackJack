var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        progressNode: { default: null, type: cc.ProgressBar, tooltiP: '进度条' },
        pretxt: cc.Label,
        txt: cc.Label,
        hb: { default: null, type: sp.Skeleton, tooltip: '红包' },
        hbNode: cc.Node,
        openNode: cc.Node,
    },

    onLoad: function () {
        this.hide = !cc._inviteTaskFinish && cc._inviteTaskRole && cc._inviteTaskOpen;
    },

    //关闭
    close: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var task = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_TASK);
        if (task) {
            var taskui = task.getComponent('klb_hall_task');
            if (taskui)
                taskui.hideFuliBtn(this.hide);
        }
        if (this.Callfun)
            this.Callfun();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     * 前往解锁
     */
    onjiesuo: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_TASK);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     * 跳转分享有礼
     */
    onClickShare: function () {
        hall_audio_mgr.com_btn_click();
        if (cc._inviteTaskOpen)
            cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_fxyl");
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     * 设置回调
     */
    setCall: function (fun) {
        this.Callfun = fun;
    },

    setData: function (num) {
        if (num == null)
            num = 0;
        this.counActive = cc._inviteTaskActiveNum;
        this.showText();
        this.setActive(num);
    },

    /**
     * 显示描述
     */
    showText: function () {
        if (this.txt)
            this.txt.string = '活跃值需要达到' + this.counActive + '才可以解锁礼包';
    },

    /**
     * 红包开奖
     */
    showHB: function () {
        if (this.hb) {
            this.hb.setEndListener(function () {
                if (this.hbNode)
                    this.hbNode.active = false;
                if (this.openNode)
                    this.openNode.active = true;
            }.bind(this));
            this.hb.setAnimation(0, 'kai', false);
        }
    },

    /**
     * 设置活跃度
     */
    setActive: function (num) {
        if (num > this.counActive)
            num = this.counActive;
        var pre = parseInt(num / this.counActive);
        cc.log('pre:', pre);
        if (this.progressNode) {
            this.progressNode.progress = pre;
        }
        if (pre == 1 && !cc._inviteTaskFinish) {
            cc._inviteTaskFinish = true;
            this.hide = false;
            this.showHB();
            cc.find('btn', this.node).active = false;
        }

        if (this.pretxt)
            this.pretxt.string = num;
    },


});