var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        showNode: cc.Node,
        actionNode: cc.Node,
        playerName: cc.Label,
        clubName: cc.Label,

        buttons: [cc.Button],
    },

    onLoad() {
        club_Ed.addObserver(this);
        this._tempInfo = [];
        this.showNode.active = false;
    },

    onDestroy() {
        club_Ed.removeObserver(this);
    },

    updatePosition() {
        var size = cc.winSize;
        this.node.x = size.width / 2;
        this.node.y = size.height / 2;

        let widgets = this.node.getComponentsInChildren(cc.Widget);
        for (let i = 0; i < widgets.length; i++) {
            widgets[i].updateAlignment();
        }
    },


    show(data) {
        if (this.waitShow) {
            let hasInvite = this._tempInfo.find((s) => {
                return s.clubId === data.clubId;
            })
            if (cc.dd._.isUndefined(hasInvite) && this.info.clubId !== data.clubId) {
                this._tempInfo.push(data);
            }
            return;
        }

        this.waitShow = true;

        if (this._waitAdminAnima) {
            return;
        }

        this.info = data;
        this.playerName.string = cc.dd.Utils.subChineseStr(data.userName, 0, 8);
        this.clubName.string = data.clubName;

        this.buttons.forEach((button) => {
            button.interactable = false;
        })

        this._waitAdminAnima = true;
        this.showNode.active = true;

        this.actionNode.stopAllActions();

        this.actionNode.scaleX = 0;
        this.actionNode.scaleY = 0;
        this.actionNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.callFunc(() => {
                this._waitAdminAnima = false;
                this.buttons.forEach((button) => {
                    button.interactable = true;
                })
            })
        ))
    },

    close() {
        if (this._waitAdminAnima) {
            return;
        }
        this.buttons.forEach((button) => {
            button.interactable = false;
        })
        this._waitAdminAnima = true;
        this.actionNode.stopAllActions();

        this.actionNode.scaleX = 1;
        this.actionNode.scaleY = 1;
        this.actionNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(() => {
                this._waitAdminAnima = false;
                this.showNode.active = false;

                this.waitShow = false;
                if (this._tempInfo.length > 0) {
                    let info = this._tempInfo.shift();
                    this.show(info);
                }
            })
        ))
    },

    onClickClose() {
        hall_audio_mgr.com_btn_click();
        this.close();
    },

    onClickConfirm() {
        hall_audio_mgr.com_btn_click();
        club_sender.joinClubReq(this.info.clubId);
        this.close();
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        //dd.NetWaitUtil.close();
        switch (event) {
            case club_Event.FRIEND_GROUP_INVITE:
                this.show(data);
                break;
            default:
                break;
        }
    },
});
