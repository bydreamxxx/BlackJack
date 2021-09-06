var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
let prefab_config = require('klb_friend_group_prefab_cfg');
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var AppCfg = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        openNode: {
            default: null,
            type: cc.Node,
            tooltip: '开红包',
        },
        thankNode: {
            default: null,
            type: cc.Node,
            tooltip: '答谢',
        },
        noNoticeButton: {
            default: null,
            type: cc.Node,
            tooltip: '不再提示',
        },

        headNode: {
            default: null,
            type: cc.Node,
            tooltip: '玩家头像',
        },
        playername: {
            default: null,
            type: cc.Label,
            tooltip: '玩家昵称',
        },
        desc: {
            default: null,
            type: cc.Label,
            tooltip: '描述',
        },

        count: {
            default: null,
            type: cc.Label,
            tooltip: '红包额',
        },

        animation: {
            default: null,
            type: sp.Skeleton,
            tooltip: '动画',
        },

        mask: {
            default: null,
            type: cc.Node,
            tooltip: '遮罩',
        },

        showNode: {
            default: null,
            type: cc.Node,
            tooltip: '展示node',
        },

        canPopMessage: true,
        messageList: {
            default: []
        },

        m_oCoinAnim: cc.Node,
        m_nIndex: 0,
    },

    onLoad() {
        club_Ed.addObserver(this);

        this.showNode.active = false;
    },

    onDestroy() {
        club_Ed.removeObserver(this);

        if (this.closeTime) {
            clearTimeout(this.closeTime);
            this.closeTime = null;
        }

        if (this.touchOpen) {
            clearTimeout(this.touchOpen);
            this.touchOpen = null;
        }
        if (this.touchThank) {
            clearTimeout(this.touchThank);
            this.touchThank = null;
        }
        if (this.touchCheck) {
            clearTimeout(this.touchCheck);
            this.touchCheck = null;
        }
        if (this.touchNoMore) {
            clearTimeout(this.touchNoMore);
            this.touchNoMore = null;
        }
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

    show(data, isOpen) {
        if (data.hasOwnProperty('result') && data.result == -1) {
            this.close();
            return;
        }

        this.info = data;

        if (this.closeTime) {
            clearTimeout(this.closeTime);
            this.closeTime = null;
        }

        let showFunc = () => {
            if (isOpen) {
                this._waitAdminAnima = true;

                this.mask.active = true;
                this.openNode.active = false;
                this.thankNode.active = false;
                this.noNoticeButton.active = false;

                this.count.string = data.type == 1 ? data.sum : String(parseFloat(data.sum / 100).toFixed(2)).replace('.', ':');

                this.animation.setAnimation(0, "hongbao", false);
                this.animation.setCompleteListener(() => {
                    this._waitAdminAnima = false;

                    this.closeTime = setTimeout(() => {
                        this.close();
                        this.closeTime = null;
                    }, 3000);
                });

                this.showNode.runAction(cc.sequence(
                    cc.delayTime(0.4),
                    cc.callFunc(() => {
                        this.openNode.active = false;
                        this.thankNode.active = true;
                        this.noNoticeButton.active = this.checkIsInGame();
                        this.m_nIndex = 0;
                        this.playCoinAnim(40, 0.02);
                        AudioManager.playSound("gameyj_friend/audio/Gold_Spray");
                    })
                ))
            } else {
                this.openNode.active = true;

                this.headNode.getComponent('klb_hall_Player_Head').initHead(data.openId, data.headUrl);
                this.playername.string = (data.ownerName.length > 9 ? cc.dd.Utils.substr(data.ownerName, 0, 9) : data.ownerName);

                let base64 = decodeURIComponent(data.msg);
                let msg = cc.dd.SysTools.decode64(base64);

                this.desc.string = msg;

                this.thankNode.active = false;
                this.noNoticeButton.active = this.checkIsInGame();

                this.animation.setAnimation(0, "xunhuan", true);
                this.animation.setCompleteListener(() => { });
                this.closeTime = setTimeout(() => {
                    this.close()
                    this.closeTime = null;
                }, 5000);
            }
        }

        if (!this.showNode.active) {
            if (this._waitAdminAnima) {
                return;
            }
            this._waitAdminAnima = true;
            this.showNode.stopAllActions();

            this.updatePosition();

            this.mask.active = false;
            this.showNode.scaleX = 0;
            this.showNode.scaleY = 0;
            this.showNode.active = true;

            this.openNode.active = false;
            this.thankNode.active = false;
            this.noNoticeButton.active = false;

            this.animation.setAnimation(0, "xunhuan", true);
            this.animation.setCompleteListener(() => { });

            this.showNode.runAction(cc.sequence(
                cc.scaleTo(0.2, 1),
                cc.callFunc(() => {
                    this.mask.active = true;
                    this._waitAdminAnima = false;
                    showFunc();
                })
            ));
        } else {
            showFunc();
        }
    },

    close() {
        if (this.closeTime) {
            clearTimeout(this.closeTime);
            this.closeTime = null;
        }

        if (this._waitAdminAnima) {
            return;
        }
        this.animation.setAnimation(0, "xunhuan", true);
        this.animation.setCompleteListener(() => { });

        this.m_nIndex = 0;
        this.openNode.active = false;
        this.thankNode.active = false;
        this.noNoticeButton.active = false;

        this.mask.active = false;
        this._waitAdminAnima = true;
        this.showNode.stopAllActions();
        this.node.stopAllActions();

        this.showNode.scaleX = 1;
        this.showNode.scaleY = 1;
        this.showNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(() => {
                this.animation.clearTracks();

                this._waitAdminAnima = false;
                this.showNode.active = false;
                this.canPopMessage = true;
            })
        ))
    },

    onClickOpen() {
        hall_audio_mgr.com_btn_click();
        if (this._waitAdminAnima) {
            return;
        }

        if (this.touchOpen) {
            return;
        }

        this.touchOpen = setTimeout(() => {
            this.touchOpen = null;
        }, 1000);

        this.waitOpen = true;
        this.canPopMessage = true;
        club_sender.robRedBag(club_Mgr.getSelectClubId(), this.info.id);
    },

    onClickThank() {
        hall_audio_mgr.com_btn_click();
        if (this._waitAdminAnima) {
            return;
        }

        if (this.touchThank) {
            return;
        }

        this.touchThank = setTimeout(() => {
            this.touchThank = null;
        }, 1000);

        this.close();

        let info = club_Mgr.getRedBag(this.info.id);
        if (info) {
            var base64dstr = cc.dd.SysTools.encode64('感谢 ' + info.ownerName + ' 的红包~');
            var encodeuri = encodeURIComponent(base64dstr);
            club_sender.sendChat(club_Mgr.getSelectClubId(), encodeuri);
        }
    },

    onClickCheck() {
        hall_audio_mgr.com_btn_click();
        if (this._waitAdminAnima) {
            return;
        }

        if (this.touchCheck) {
            return;
        }

        this.touchCheck = setTimeout(() => {
            this.touchCheck = null;
        }, 1000);

        this.close();

        club_sender.checkRedBag(club_Mgr.getSelectClubId(), this.info.id);
    },

    onClickNoMore() {
        hall_audio_mgr.com_btn_click();
        if (this._waitAdminAnima) {
            return;
        }

        if (this.touchNoMore) {
            return;
        }

        this.touchNoMore = setTimeout(() => {
            this.touchNoMore = null;
        }, 1000);

        this.notShow = true;
        this.close();
    },

    onClickClose() {
        hall_audio_mgr.com_btn_click();
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
            case club_Event.FRIEND_GROUP_OPEN_RED_BAG:
                if (data.result == -1) {
                    this.waitOpen = false;
                } else {
                    if (this.waitOpen && data.id == this.info.id) {
                        this.messageList.unshift([data, true]);
                        this.waitOpen = false;
                    } else {
                        this.messageList.push([data, true]);
                    }
                }
                break;
            case club_Event.FRIEND_GROUP_GET_RED_BAG:
                this.messageList.push([data, false]);
                break;
            case club_Event.FRIEND_GROUP_SHOW_RED_BAG:
                if (!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_RED_BAG_DETAIL)) {
                    cc.dd.UIMgr.openUI(prefab_config.KLB_FG_RED_BAG_DETAIL, function (ui) {
                        ui.getComponent('klb_friend_group_redbagDetail').show(data);
                    }.bind(this));
                }
                break;
            default:
                break;
        }
    },

    update(dt) {
        if (this.messageList.length > 0 && this.canPopMessage) {
            if (this.waitOpen) {
                return
            }
            this.canPopMessage = false;
            let message = this.messageList.shift();
            if (this.checkCanShow() && !this.notShow) {
                this.show(message[0], message[1]);
            } else {
                this.canPopMessage = true;
            }
        }
    },

    checkCanShow() {
        let sceneName = cc.dd.SceneManager.getCurrScene().name;
        if (sceneName == 'klb_friend_group_scene') {
            this.notShow = false;
            return club_Mgr.getSelectClubId() != 0;
        } else if (sceneName != AppCfg.HALL_NAME && sceneName != AppCfg.LOGIN_SCENE_NAME) {
            if (RoomMgr.Instance().isClubRoom()) {
                return true;
            }
        } else {
            this.notShow = false;
        }
        return false;
    },

    checkIsInGame() {
        let sceneName = cc.dd.SceneManager.getCurrScene().name;
        if (sceneName != 'klb_friend_group_scene' && !this.notShow) {
            return true
        } else {
            return false;
        }
    },

    playCoinAnim: function (totalCount, delayTimer) {
        if (this.m_nIndex == totalCount)
            return;
        var self = this;
        var node = cc.instantiate(this.m_oCoinAnim);
        node.active = true;
        node.getComponent(cc.Animation).play('coinRotateAnim');
        var x = Math.floor(Math.random() * (640 - 0 + 1) + 0);
        var tag = Math.round(Math.random());
        if (tag == 0)
            x = -x;
        parseInt(Math.random() * (720 - 360 + 1) + 360, 10);
        var q1_y = Math.floor(Math.random() * (720 - 360 + 1) + 360);
        parseInt(Math.random() * (360 - 290 + 1) + 290, 10);
        var q2_y = Math.floor(Math.random() * (360 - 290 + 1) + 290);
        var q1 = cc.v2(x, q1_y);
        var q2 = cc.v2(x, q2_y);
        var coin_endPos = cc.v2(x, - 360);
        var bezier = [q1, q2, coin_endPos];
        var time = 1;
        var bezierAct = cc.bezierTo(time, bezier);
        node.scaleX = 0.6;
        node.scaleY = 0.6;
        var scale = parseInt(Math.random() * (14 - 11) + 11, 10) / 10;
        var scaleAct = cc.scaleTo(0.5, scale);
        node.runAction(cc.sequence(cc.spawn(bezierAct, scaleAct, cc.sequence(cc.delayTime(delayTimer), cc.callFunc(function () {
            self.playCoinAnim(totalCount, delayTimer);
            self.m_nIndex += 1;
        }))), cc.callFunc(function () {
            node.active = false;
            node.removeFromParent();
            if (self.m_nIndex >= totalCount) {
                var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                    //self.quitWindow();
                    node.stopAllActions();
                }));
                self.node.runAction(seq);
            }
        })));
        node.parent = this.m_oCoinAnim.parent;
    },
});
