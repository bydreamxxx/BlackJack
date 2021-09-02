var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
const HallCommonData = require('hall_common_data').HallCommonData;

cc.Class({
    extends: cc.Component,

    properties: {
        wrontTip: cc.Node,
        inputID: cc.EditBox,

        bindedNode: cc.Node,
        notBindedNode: cc.Node,

        bindedName: cc.Label,
        bindedId: cc.Label,
        bindedSp: cc.Sprite,

        myCode: cc.Label,
    },

    onLoad() {
        Hall.HallED.addObserver(this);
        this.bindedNode.active = HallCommonData.getInstance().inviterId;
        this.notBindedNode.active = (HallCommonData.getInstance().inviterId == null || HallCommonData.getInstance().inviterId == 0);
        cc.log("HallCommonData.getInstance().inviterId:", HallCommonData.getInstance().inviterId)
        this.myCode.string = HallCommonData.getInstance().code;
        if (HallCommonData.getInstance().inviterId) {
            this.bindedId.string = "ID:" + HallCommonData.getInstance().inviterId;
            this.bindedName.string = HallCommonData.getInstance().inviterName;
            cc.dd.SysTools.loadWxheadH5(this.bindedSp, cc.dd.Utils.getWX64Url(HallCommonData.getInstance().inviterHeadurl));
        } else {
            this.wrontTip.active = false;
        }

    },

    onClickQuery() {
        var id = this.inputID.string;
        if (isNaN(id)) {
            this.wrontTip.active = true;
            return;
        }
        this.wrontTip.active = false;
        this.code = parseInt(id);
        const req = new cc.pb.hall.hall_query_bind_req;
        req.setCode(id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_query_bind_req, req,
            '发送协议 hall_query_bind_req', true);
    },

    onClickClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    copyMyCode: function () {
        cc.dd.native_systool.SetClipBoardContent(this.myCode.string);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.BIND_AGGENT_QUERY_DATA:
                if (data.retCode != 0) {
                    cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_32);
                    return;
                }
                this.aggentData = data;
                cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_bind_aggent_confirm", function (ui) {
                    var scp = ui.getComponent('klb_hall_bind_aggent_confirm')
                    scp.setCode(this.code);
                    scp.showAggent(data);
                }.bind(this));
                break;
            default:
                break;
        }
    },

});
