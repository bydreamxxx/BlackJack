// create by wj 2018/08/24
var hall_prefab = require('hall_prefab_cfg');
var hallData = require('hall_common_data').HallCommonData;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var daili_phone = require('daili_phone');
cc.Class({
    extends: cc.Component,

    properties: {
        m_oCloseBtn: cc.Node,
        m_phoneLabel: cc.Label,
    },

    onLoad() {
        if (this.m_phoneLabel) {
            var phone = daili_phone.getItem((item) => {
                return item.key == cc.game_pid;
            });
            if (phone) {
                this.m_phoneLabel.string = phone.phone + '';
            }
        }
    },

    showClsoeBtn: function (isShow) {
        this.m_oCloseBtn.active = isShow;
    },

    copyBtn: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var string = '';
        switch (parseInt(data)) {
            case 1:
                string = 'XLdl001';
                break;
            case 2:
                if (this.m_phoneLabel)
                    string = this.m_phoneLabel.string;
                else
                    string = '17052495555';
                break;
            case 3:
                string = 'XLcs003';
                break;
        }

        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(string);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    gotoUserInfo: function (event, data) {
        hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_USERINFO, function (ui) {
        //     ui.getComponent('klb_hall_UserInfo').setData(hallData.getInstance());
        //     // cc.find('topBtn/toggle1', ui).getComponent(cc.Toggle).isChecked = true;
        //     // cc.find('topBtn/toggle2', ui).getComponent(cc.Toggle).isChecked = false;
        //     // cc.find('topBtn/toggle3', ui).getComponent(cc.Toggle).isChecked = false;
        //     // ui.getComponent('klb_hall_UserInfo').switchPage(null, 0);
        // });
        cc.dd.UIMgr.openUI(hall_prefab.CERTIFICATION);
        cc.dd.UIMgr.destroyUI(cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY));
    },

    gotoNationalDayActivity: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_National_Day_Active/klb_National_Day_Active_MainUI');
        cc.dd.UIMgr.destroyUI(cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY));
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickClose: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     * 分享赚金
     */
    onClickZhuangjin: function () {
        if (cc._inviteTaskOpen) {
            hall_audio_mgr.com_btn_click();
            cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_fxyl");
            cc.dd.UIMgr.destroyUI(cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY));
            cc.dd.UIMgr.destroyUI(this.node);
        }
    },

    onClickKefu() {
        hall_audio_mgr.com_btn_click();
        if (cc._chifengGame) {
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_KEFU);
        } else {
            // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
            //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
            // });
            let Platform = require('Platform');
            let AppCfg = require('AppConfig');
            cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
        }
    },
    onClickBYDR: function () {
        var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
        protoNewRoomList.setHallGameid(139);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
            '发送协议[id: cmd_hall_req_new_room_list,[房间列表]', true);
    },
});