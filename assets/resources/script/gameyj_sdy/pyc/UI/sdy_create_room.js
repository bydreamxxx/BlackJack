var audio = require('hall_audio_mgr');

cc.Class({
    extends: cc.Component,

    properties: {
        toggle_zhu2: cc.Toggle,
        toggle_lkdp: cc.Toggle,
        toggle_bi_diao: cc.Toggle,
        toggle_wang_kou: cc.Toggle,
    },

    onLoad: function () {
        this.jushu = 8;
        this.zhu_2=false;
        this.lian_kou_dai_po=false;
        this.bi_diao=false;
        this.wang_kou=false;

        this.toggle_zhu2.isChecked = false;
        this.toggle_lkdp.isChecked = false;
        this.toggle_bi_diao.isChecked = false;
        this.toggle_wang_kou.isChecked = false;
    },

    onClickJuShu: function (event,data) {
        audio.Instance().com_btn_click();
        this.jushu = data;
    },

    onClickZhu2: function () {
        audio.Instance().com_btn_click();
        this.zhu_2 = this.toggle_zhu2.isChecked;
    },

    /**
     * 连扣带破
     */
    onClickLKDP: function () {
        audio.Instance().com_btn_click();
        this.lian_kou_dai_po = this.toggle_lkdp.isChecked;
    },

    onClickBiDiao: function () {
        audio.Instance().com_btn_click();
        this.bi_diao = this.toggle_bi_diao.isChecked;
    },

    onClickWangKou: function () {
        audio.Instance().com_btn_click();
        this.wang_kou = this.toggle_wang_kou.isChecked;
    },

    onClickCreateRoom: function () {
        audio.Instance().com_btn_click();
        var msg = new cc.pb.room_mgr.sdy_friend_create();
        var rule = new cc.pb.room_mgr.sdy_rule_info();
        rule.setCircleNum(this.jushu);
        rule.setZhu2(this.zhu_2);
        rule.setLianKouDaiPo(this.lian_kou_dai_po);
        rule.setBiDiao(this.bi_diao);
        rule.setWangKou(this.wang_kou);
        msg.setRule(rule);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_sdy_friend_create, msg, 'sdy_friend_create', true);
    },
});
