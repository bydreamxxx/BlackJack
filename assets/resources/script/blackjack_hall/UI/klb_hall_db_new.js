let klb_hall_db = require("klb_hall_db");
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var daili_phone = require('daili_phone');

cc.Class({
    extends: klb_hall_db,

    properties: {
        // returnNode: { default: null, type: cc.Node, visible: false, override: true },
        // jinbiBtn: { default: null, type: cc.Node, visible: false, override: true },
        // hiddenList: { default: [], type: cc.Node, visible: false, override: true },

        // changeToFangKaNode: { default: null, type: cc.Node, tooltip: '切换房卡' },
        // changeToJinBiNode: { default: null, type: cc.Node, tooltip: '切换金币' },
        clickMask: { default: null, type: cc.Node, tooltip: '按钮屏蔽' },
        // goldNode: { default: null, type: cc.Node, tooltip: '金币按钮' },
        // cardNode: { default: null, type: cc.Node, tooltip: '房卡按钮' },

        m_phoneLabel: { default: null, type: cc.Label, tooltip: '电话' },
    },

    onLoad: function () {
        cc.dd.ButtonUtil.setButtonEvent(this.bisaiBtn, this.onClickBiSai.bind(this));
        // cc.dd.ButtonUtil.setButtonEvent(this.jinbiBtn, this.onClickJibi.bind(this));
        cc.dd.ButtonUtil.setButtonEvent(this.jiaruBtn, this.onClickJiaru.bind(this));
        cc.dd.ButtonUtil.setButtonEvent(this.chuangjianBtn, this.onCallCreate.bind(this));
        cc.dd.ButtonUtil.setButtonEvent(this.qinyouBtn, this.onClickQinyou.bind(this));

        if (this.m_phoneLabel) {
            var phone = daili_phone.getItem((item) => {
                return item.key == cc.game_pid;
            });
            if (phone) {
                this.m_phoneLabel.string = phone.phone + '';
            }
        }
    },

    // close() {
    //     this.clickMask.active = false;
    //     this.changeToFangKaNode.active = false;
    //     this.changeToJinBiNode.active = false;
    //     this.node.active = false;
    // },
    //
    // showNode() {
    //     this.clickMask.active = false;
    //     this.node.active = true;
    //
    //     this.hallNode.getComponent(cc.Widget).updateAlignment();
    //     this.hallNode.getComponent(cc.Widget).enabled = false;
    //     this.node.getComponent(cc.Widget).updateAlignment();
    //     this.node.getComponent(cc.Widget).enabled = false;
    //
    //     if (cc._isNewHall != "PageJinBi") {
    //         this.hallNode.x = -this.hallNode.width;
    //         this.node.x = 0;
    //
    //         this.xinxiNode.x = -325.2 - this.hallNode.width;
    //         this.goldNode.active = false;
    //         this.cardNode.active = true;
    //         this.changeToFangKaNode.active = false;
    //         this.changeToJinBiNode.active = true;
    //         cc._isNewHall = "PageFangKa";
    //     } else {
    //         this.hallNode.x = 0;
    //         this.node.x = this.node.width;
    //
    //         this.xinxiNode.x = -325.2;
    //         this.goldNode.active = true;
    //         this.cardNode.active = false;
    //         this.changeToFangKaNode.active = true;
    //         this.changeToJinBiNode.active = false;
    //         cc._isNewHall = "PageJinBi";
    //     }
    //
    //     //巷乐棋牌 锦州麻将不能切换金币场
    //     if (cc.game_pid == 10009 || cc.game_pid == 10004) {
    //         this.changeToFangKaNode.active = false;
    //         this.changeToJinBiNode.active = false;
    //     }
    // },
    //
    // changeToFangKa() {
    //     if (cc.game_pid == 10009)
    //         return;
    //     if (this._waitAdminAnima) {
    //         return;
    //     }
    //     this._waitAdminAnima = true;
    //     this.clickMask.active = true;
    //
    //     this.hallNode.runAction(cc.sequence(
    //         cc.moveTo(0.5, -this.hallNode.width, this.hallNode.y).easing(cc.easeSineInOut()),
    //         cc.callFunc(() => {
    //             this._waitAdminAnima = false;
    //             this.clickMask.active = false;
    //             this.changeToFangKaNode.active = false;
    //             this.changeToJinBiNode.active = true;
    //             this.goldNode.active = false;
    //             this.cardNode.active = true;
    //             cc._isNewHall = "PageFangKa";
    //         })
    //     ))
    //     this.xinxiNode.runAction(cc.moveTo(0.5, this.xinxiNode.x - this.hallNode.width, this.xinxiNode.y).easing(cc.easeSineInOut()));
    //     this.node.runAction(cc.moveTo(0.5, 0, 0).easing(cc.easeSineInOut()));
    // },
    //
    // changeToJinBi() {
    //     if (cc.game_pid == 10009 || cc.game_pid == 10004)
    //         return;
    //     if (this._waitAdminAnima) {
    //         return;
    //     }
    //     this._waitAdminAnima = true;
    //     this.clickMask.active = true;
    //     this.hallNode.runAction(cc.sequence(
    //         cc.moveTo(0.5, 0, this.hallNode.y).easing(cc.easeSineInOut()),
    //         cc.callFunc(() => {
    //             this._waitAdminAnima = false;
    //             this.clickMask.active = false;
    //             this.changeToFangKaNode.active = true;
    //             this.changeToJinBiNode.active = false;
    //             this.goldNode.active = true;
    //             this.cardNode.active = false;
    //             cc._isNewHall = "PageJinBi";
    //         })
    //     ))
    //     this.xinxiNode.runAction(cc.moveTo(0.5, this.xinxiNode.x + this.hallNode.width, this.xinxiNode.y).easing(cc.easeSineInOut()));
    //     this.node.runAction(cc.moveTo(0.5, this.node.width, 0).easing(cc.easeSineInOut()));
    // },

    copyBtn: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var string = '';
        switch (parseInt(data)) {
            case 1:
                string = '000';
                break;
            case 2:
                if (this.m_phoneLabel)
                    string = this.m_phoneLabel.string;
                else
                    string = '000';
                break;
            case 3:
                string = '000';
                break;
        }

        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(string);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },
});
