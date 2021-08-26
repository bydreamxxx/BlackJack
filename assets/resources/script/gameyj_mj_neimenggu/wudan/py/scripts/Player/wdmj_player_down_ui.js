var pai3d_value = require("jlmj_pai3d_value");
var UIZorder = require("mj_ui_zorder");

let base_mj_player_down_ui = require('base_mj_player_down_ui');
let TouchCardMode = require('base_mj_player_data').TouchCardMode;
var SysEvent = require("com_sys_data").SysEvent;

cc.Class({
    extends: base_mj_player_down_ui,

    properties: {
        chupai_offset: { default: 25, override: true },
        pai_move_offset: { default: -267, override: true },
        isNeimeng: { default: true, override: true }
    },

    initHuPai() {
        this.chi_ani = cc.find("Canvas/desk_node/play_anis/down/chi").getComponent(sp.Skeleton);
        this.gang_ani = cc.find("Canvas/desk_node/play_anis/down/gang").getComponent(sp.Skeleton);
        this.gangshanghua_ani = cc.find("Canvas/huEffect/gangshanghua").getComponent(sp.Skeleton);
        this.gangshangpao_ani = cc.find("Canvas/huEffect/gangshangpao").getComponent(sp.Skeleton);
        this.haoqidui_ani = cc.find("Canvas/huEffect/haoqidui").getComponent(sp.Skeleton);
        this.hu_ani = cc.find("Canvas/desk_node/play_anis/down/hu").getComponent(sp.Skeleton);
        this.peng_ani = cc.find("Canvas/desk_node/play_anis/down/peng").getComponent(sp.Skeleton);
        this.piaohu_ani = cc.find("Canvas/huEffect/piaohu").getComponent(sp.Skeleton);
        this.qidui_ani = cc.find("Canvas/huEffect/qidui").getComponent(sp.Skeleton);
        this.shisanyao_ani = cc.find("Canvas/huEffect/shisanyao").getComponent(sp.Skeleton);
        this.guo_ani = cc.find("Canvas/desk_node/play_anis/down/guo").getComponent(sp.Skeleton);
        this.buhua_ani = cc.find("Canvas/desk_node/play_anis/down/buhua").getComponent(sp.Skeleton);

        this.huEffect = cc.find("Canvas/huEffect/down");

        this.clearHuPai();
    },

    clearHuPai() {
        this.chi_ani.node.active = false;
        this.gang_ani.node.active = false;
        this.gangshanghua_ani.node.active = false;
        this.gangshangpao_ani.node.active = false;
        this.haoqidui_ani.node.active = false;
        this.hu_ani.node.active = false;
        this.peng_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qidui_ani.node.active = false;
        this.shisanyao_ani.node.active = false;
        this.guo_ani.node.active = false;
        this.buhua_ani.node.active = false;

        this.huEffect.active = false;
    },

    onLoad: function () {
        this._super();
        this.head.node.zIndex = UIZorder.MJ_LAYER_TOP;
        this.TingPaiTouchMode = TouchCardMode.DA_TING_PAI;
    },

    touchStart: function (event) {
        if (!this.require_UserPlayer.hasMoPai() || this.menuList.isOpen) {
            return;
        }

        if (this.require_DeskData.Instance().isHu) {
            return;
        }

        if (this.fenpai_touched) {
            return;
        }

        if (this.chupai_act) {
            return;
        }

        // if(!cc.dd._.isNull(cc.dd.NetWaitUtil.net_wait_id)){
        //     return;
        // }

        var pai_touched = this.getTouchPai(event);

        if (pai_touched && pai_touched.cardId >= 136) {
            return;
        }
        this.isCanMove = new Date().getTime();

        if (pai_touched) {
            this.yd_y = event.touch.getLocationY();

            this.pai_touched = pai_touched;
            if (this.pai_touched.selected) {
                this.pai_touched.doubleSelected = true;
            } else {
                this.resetSelected();
                this.pai_touched.selected = true;
                this.pai_touched.node.y = this.restPt_y() + this.chupai_offset;
                this.require_mj_audio.playAduio("select");
                this.biaojiPai(this.pai_touched.cardId);

                if (this.yidong_pai.node.active == false) {
                    if (!this.yidong_pai.cloned || this.yidong_pai.cardId != this.pai_touched.cardId) {
                        this.yidong_pai.clone(this.pai_touched);
                        this.yidong_pai.node.parent = cc.find('Canvas');
                        this.yidong_pai.node.active = false;
                        this.yidong_pai.cloned = true;
                        this.yidong_pai.node.scaleX = this.yidong_pai.node.scaleX * this._node_scale_x;
                        this.yidong_pai.node.scaleY = this.yidong_pai.node.scaleY * this._node_scale_y;
                        this.yidong_pai.node.x = event.touch.getLocationX() - this._offsetX;
                        this.yidong_pai.node.y = event.touch.getLocationY() - this._offsetY;
                    }
                }
            }

            if (this.touchCardMode == this.TingPaiTouchMode) {
                this.closeJiaoInfo();
                cc.log("mj touchStart openJiaoInfo");
                this.openJiaoInfo(this.pai_touched.cardId);
            }
        } else {
            this.resetSelected();
        }
    },

    touchMove: function (event) {
        if (!this.require_UserPlayer.hasMoPai() || this.menuList.isOpen) {
            return;
        }

        if (this.require_DeskData.Instance().isHu) {
            return;
        }

        if (this.fenpai_touched) {
            return;
        }

        this.changePaiMove(event);

        if (this.pai_touched &&                          //没有选择牌
            // this.touchCardMode == TouchCardMode.CHU_PAI && //非出牌模式的时候不能滑动
            !this.require_UserPlayer.canhu && this.pai_touched.cardId < 136) {                          //胡牌的时候不能滑动

            if (new Date().getTime() - this.isCanMove > 50 || this.isCanMove == null) {
                this.isCanMove = null;

                this.yidong_pai.node.x = event.touch.getLocationX() - this._offsetX;
                this.yidong_pai.node.y = event.touch.getLocationY() - this._offsetY;
                if (this.yidong_pai.node.y > this.pai_move_offset * this._node_scale_y) {
                    this.cloneYiDongPai();
                    this.yidong_pai.node.active = true;
                    this.pai_touched.node.active = false;
                    //滑动显示标记牌
                    this.biaojiPai(this.pai_touched.cardId);
                }
            }
        }
    },

    touchEnd: function (event) {
        if (!this.require_UserPlayer.hasMoPai() || this.menuList.isOpen) {
            return;
        }
        if (this.require_DeskData.Instance().isHu) {
            this.yidong_pai.node.active = false;
            return;
        }

        if (this.require_DeskData.Instance().waitForSendOutCard) {
            this.resetSelected();
            return;
        }

        if (this.fenpai_touched) {
            return;
        }

        if (this.require_UserPlayer.canhu) {
            return;
        }

        if (!this.pai_touched) {
            return;
        } else {
            if (this.touchCardMode == this.TingPaiTouchMode) {
                this.closeJiaoInfo();
                this.openJiaoInfo(this.pai_touched.cardId);
            }
        }

        this.pai_touched = null;
        this.isCanMove = null;

        if (this.yidong_pai.node.active) {
            if (this.yidong_pai.node.y > this.pai_move_offset * this._node_scale_y) {
                //出牌
                // this.resetSelected();

                this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, false, null, 1]);

                var jlmj_pai = this.getShouPai(this.yidong_pai.cardId);
                if (this.require_UserPlayer.isTempBaoTing) {
                    var tingType = this.getTingType();
                    this.require_UserPlayer.setJiaoInfo(this.yidong_pai.cardId);
                    this.sendTingPai(this.yidong_pai.cardId, tingType);
                } else {
                    if (this.require_UserPlayer.hasMoPai()) {
                        this.sendOutCard(this.yidong_pai.cardId);
                        this.setShoupaiTingbiaoji(false);
                        this.yidong_pai_show = true;
                        // this.yidong_pai.node.runAction(cc.moveTo(0.05,cc.v2(0,-142)));
                    } else {
                        this.yidong_pai.node.active = false;
                        this.updateSelectedPai(this.require_UserPlayer);
                    }
                }
            }
            else {
                this.quxiaoBiaoji();
                this.yidong_pai.node.active = false;
                this.updateSelectedPai(this.require_UserPlayer);
            }
        } else {
            var pai_touched = this.getTouchPai(event);

            if (!pai_touched) {
                this.resetSelected();
                return;
            }
            if (this.require_DeskData.Instance().sendCard && this.require_DeskData.Instance().sendCard == pai_touched.cardId) {
                this.resetSelected();
                return;
            }

            if (!pai_touched.doubleSelected) {
                if (event.touch.getLocationY() - this.yd_y > this.chupai_offset) {

                } else {
                    return;
                }
            }

            //出牌
            this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, false, null, 1]);
            if (this.require_UserPlayer.isTempBaoTing) {
                var tingType = this.getTingType();
                this.require_UserPlayer.setJiaoInfo(pai_touched.cardId);
                this.sendTingPai(pai_touched.cardId, tingType);
                this.da_pai = true;
                /*if(!this.yidong_pai.cloned || this.yidong_pai.cardId != pai_touched.cardId){
                    this.yidong_pai.clone(pai_touched);
                    this.yidong_pai.node.parent = cc.find('Canvas');
                    this.yidong_pai.node.active = true;
                    this.pai_touched.node.active = false;
                    this.yidong_pai.node.x = pai_touched.node.x;
                    this.yidong_pai.node.y = pai_touched.node.y;
                    this.yidong_pai_show = true;
                    this.yidong_pai.node.runAction(cc.moveTo(0.05,cc.v2(0,-142)));
                }*/
            } else {
                if (this.require_UserPlayer.hasMoPai()) {
                    this.customTouchEndSendOutCard();
                    this.sendOutCard(pai_touched.cardId);
                    this.setShoupaiTingbiaoji(false);
                    this.da_pai = true;
                    if (!this.yidong_pai.cloned || this.yidong_pai.cardId != pai_touched.cardId) {
                        this.yidong_pai.clone(pai_touched);
                        this.yidong_pai.node.parent = cc.find('Canvas');
                        this.yidong_pai.node.active = true;
                        pai_touched.node.active = false;
                        this.yidong_pai.node.x = pai_touched.node.x;
                        this.yidong_pai.node.y = pai_touched.node.y;
                        this.yidong_pai_show = true;
                        // this.yidong_pai.node.runAction(cc.moveTo(0.05,cc.v2(0,-142)));
                    }
                }
            }

        }

        this.resetSelected();
        if (this.da_pai) {
            pai_touched.node.y += this.chupai_offset;
            this.da_pai = false;
        }

        this.touchDapai();
    },

    changePaiMove(event) {

    },

    cloneYiDongPai() {

    },

    touchDapai() {
        if (this.canTouchPaiAni) {
            this.canTouchPaiAni = false;

            if (cc.dd._.isUndefined(pai3d_value.desc[this.require_DeskData.Instance().sendCard])) {
                return;
            }

            this.require_DeskData.Instance().last_chupai_id = this.require_DeskData.Instance().sendCard
            this.require_playerMgr.Instance().shou2mid_id_list.push(this.require_DeskData.Instance().sendCard);
            this.require_UserPlayer.dapai(this.require_DeskData.Instance().sendCard, false);
        }
    },

    /**
     * 听牌发送
     * @param playCardId 出牌
     */
    _sendTingPai: function (playCardId, tingType) {
        this.require_UserPlayer.waitTing = true;
        var msg = new cc.pb.wudanmj.wudan_req_tingpai_out_card();
        msg.setCardid(playCardId);
        msg.setTingtype(tingType);

        cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_tingpai_out_card, msg, "cmd_wudan_req_tingpai_out_card");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    sendOutCard(cardID) {
        if (cardID >= 136) {
            return;
        }
        this._super(cardID);
    },

    /**
     * 发送出牌
     */
    _sendOutCard: function (cardID) {
        var msg = new cc.pb.wudanmj.wudan_req_game_send_out_card();
        msg.setCardid(cardID);
        cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_game_send_out_card, msg, "wudan_req_game_send_out_card");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    customTouchEndSendOutCard() {
        if (this.touchCardMode == TouchCardMode.DA_TING_PAI) {
            cc.log("ccmj touchEnd sendOutCard");
            this.require_UserPlayer.setJiaoInfo(this.yidong_pai.cardId);
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        if (cc.replay_gamedata_scrolling) {
            return;
        }
        if (event == SysEvent.PAUSE) {
            if (this.sysPause) {
                this.sysPause();
            }
            return;
        }

        if (!data || !data instanceof Array) {
            return;
        }
        var player = data[0];
        this.sex = player.sex;
        if (this.viewIdx != player.viewIdx) {
            return;
        }

        switch (event) {
            case this.require_PlayerEvent.SHOW_BU_HUA:
                this.resetSelected();
                for (let i = 0; i < this.shouPai.length; i++) {
                    if (this.shouPai[i].cardId == data[1]) {
                        this.shouPai[i].node.y = this.restPt_y() + this.chupai_offset;
                        break;
                    }
                }
                if (this.modepai && this.modepai.cardId == data[1]) {
                    this.modepai.node.y = this.restPt_y() + this.chupai_offset;
                }
                this.menuList.setMenus(player);
                break;
            default:
                break;
        }

        this._super(event, data);
    },

    getTingType() {
        if (this.require_UserPlayer.isTempGang) {
            return 2;
        } else {
            return 1;
        }
    },

    initMJConfig() {
        return require('mjConfigValue').nmmj;
    },

    initMJComponet() {
        return require("mjComponentValue").wdmj;
    }
});
