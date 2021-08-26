var pai3d_value = require("jlmj_pai3d_value");

var RoomMgr = require("jlmj_room_mgr").RoomMgr;

var SysEvent = require("com_sys_data").SysEvent;

var UIZorder = require("mj_ui_zorder");
var mj_audio = require('mj_audio');

let base_mj_player_down_ui = require('base_mj_player_down_ui');
let TouchCardMode = require('base_mj_player_data').TouchCardMode;

//每个麻将都要改写这个
let mjComponentValue = null;

cc.Class({
    extends: base_mj_player_down_ui,

    ctor: function () {
        mjComponentValue = this.initMJComponet();
    },

    initHuPai() {
        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_d").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_d").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_d").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_d").getComponent(sp.Skeleton);
        this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_d").getComponent(sp.Skeleton);
        // this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_d").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_d").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_d").getComponent(sp.Skeleton);

        this.liangxi_State = cc.find("Canvas/desk_node/fz-zi-ddwjlx");
        this.chupai_prompt = cc.find("Canvas/desk_node/chupai_prompt");

        this.clearHuPai();
    },

    clearHuPai() {
        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        this.liangzhang_ani.node.active = false;
        // this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;

        this.liangxi_State.active = false;
        if (this.chupai_prompt) {
            this.chupai_prompt.active = false;
        }
        this._inLiangxi = false;
        this._liangxi_pai = [];
    },

    onLoad: function () {
        this.isliangzhang = false;
        this._super();
        this.head.node.zIndex = UIZorder.MJ_LAYER_TOP;
        // this.TingPaiTouchMode = TouchCardMode.DA_TING_PAI;
    },

    updateShouPai: function (player) {
        if (this.isResetBaiPai) {
            this.needUpdateShouPai = true;
            return;
        }

        if (this.require_DeskData.Instance().isFenZhang) {
            cc.log('【分张摸牌】 开始');
        }
        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if (!player) {
            return;
        }
        //测试结算开牌
        // player.state = this.require_PlayerState.HUPAI;


        if (this.yidong_pai && this.yidong_pai.node && this.yidong_pai.node.active) {
            this.yidong_pai.node.active = false;
            this.pai_touched = null;
        }

        this.chupai_act = false;
        this.isliangzhang = false;
        //胡牌时,摆牌使用开牌配置
        if (player.state == this.require_PlayerState.HUPAI) {
            this.resetBaiPai(player);
        }

        if (player.shoupai.length == 0) {
            return;
        }
        var ss = RoomMgr.Instance()._Rule;
        if (!this.require_DeskData.Instance().isHu && !this.require_DeskData.isFenZhang &&
            (player.shoupai.length == 4 || player.shoupai.length == 5) &&
            player.state != this.require_PlayerState.TINGPAI) {
            // this.require_DeskED.notifyEvent(this.require_DeskEvent.SHOW_DA_PAI_PROMPT, [0,true]);
        } else {
            this.require_DeskED.notifyEvent(this.require_DeskEvent.SHOW_DA_PAI_PROMPT, [-2, false]);
        }

        var shouPaiLen = player.shoupai.length;
        if (player.hasMoPai()) {
            shouPaiLen = player.shoupai.length - 1;
        }

        let _shoupai = player.shoupai.slice();
        for (let i = 0; i < player.zhangBaoList.length; i++) {
            let idx = _shoupai.indexOf(player.zhangBaoList[i]);
            if (idx != -1) {
                _shoupai.splice(idx, 1);
            }
        }
        let _shoupai_length = player.zhangBaoList.length > 0 ? 11 : 13;
        var shoupai_visible_cfg = {
            1: [12],
            4: [9, 10, 11, 12],
            7: [6, 7, 8, 9, 10, 11, 12],
            10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };

        if (!shoupai_visible_cfg[shouPaiLen]) {
            cc.error("手牌数量错误  =", shouPaiLen);
            cc.log("手牌" + pai3d_value.descs(player.shoupai));

            if (!cc.dd._mj_shoupai_reconnectd) {
                cc.dd._mj_shoupai_reconnectd = true;

                cc.log("开始重连麻将" + cc.dd.AppCfg.GAME_ID + "玩家ID" + player.userId);
                var login_module = require('LoginModule');
                login_module.Instance().reconnectWG();
                return;
            }
        }

        var count = 0;
        for (var i = 0; i < this.shouPai.length; ++i) {
            this.shouPai[i].node.stopAllActions();
            if (shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1 && i < _shoupai_length) {
                this.shouPai[i].node.active = true;
                this.shouPai[i].selected = false;
                if (player.state == this.require_PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i, player.state, player.getBaiPaiNum() + count);
                } else {
                    this.setShouPaiAppearance(i, player.state);
                }
                this.shouPai[i].setValue(_shoupai[count]);
                if (player.state == this.require_PlayerState.HUPAI) {
                    this.biaojiBaoPaiInShouPai(this.shouPai[i]);
                }
                if (this.touchCardMode != TouchCardMode.DA_TING_PAI) {
                    this.shouPai[i].setTingPai(false);
                }
                count++;
            } else {
                this.shouPai[i].node.active = false;
            }
        }

        var offset_x = 0;
        if (this.baipai_ui_list.length > 0 && shoupai_visible_cfg[shouPaiLen]) {
            var last_baipai_ui = this.baipai_ui_list[this.baipai_ui_list.length - 1];
            var last_pai = last_baipai_ui.pais[last_baipai_ui.pais.length - 1];
            var first_idx = shoupai_visible_cfg[shouPaiLen][0];
            var start_x = this.shouPai[first_idx].frameCfg.x;
            var target_x = last_pai.node.x + this.getBaipaiShouPaiDis(player.state);
            offset_x = target_x - start_x;
        }
        cc.log(this.viewIdx, '手牌偏移位置 = ' + offset_x);
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (this.shouPai[i].node.active) {
                this.shouPai[i].node.x = this.shouPai[i].frameCfg.x + offset_x;
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
            this.modepai.node.stopAllActions();
            if (player.state == this.require_PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(13, player.state, player.getBaiPaiNum() + count);
            } else {
                this.setMoPaiAppearance(13, player.state);
            }
            var last_shou_pai = this.getLastShouPai();
            this.modepai.node.setPosition(last_shou_pai.node.x + this.getMoPaiShouPaiDis(player.state), last_shou_pai.node.y);
            // cc.log('手牌的最后X位置', last_shou_pai.node.x);
            // cc.log('摸牌X位置', this.modepai.node.x);
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if (player.state == this.require_PlayerState.HUPAI) {
                this.biaojiBaoPaiInShouPai(this.modepai);
            }
            if (player.state != this.require_PlayerState.HUPAI && player.state != this.require_PlayerState.TINGPAI) {
                cc.find("Canvas/game_menu_list").getComponent(mjComponentValue.gameMenuList).setMenus(player);
            }
        } else {
            this.modepai.node.active = false;
        }

        if (this.chupai_prompt) {
            this.chupai_prompt.active = player.hasMoPai() && !this._inLiangxi && this.require_DeskData.Instance().isGameStart && !this.require_playerMgr.Instance().playing_fapai_ani && !player.isBaoTing && player.state != this.require_PlayerState.HUPAI && !this.require_DeskData.Instance().isFenZhang;
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if (player.state == this.require_PlayerState.HUPAI) {
            this.shouPaiAlignCenterH();
        }

        if (this.require_DeskData.isFenZhang) {
            cc.log('【分张摸牌】 结束');
        }

        cc.log("【UI】" + "自己手牌:" + pai3d_value.descs(player.shoupai));

        if (this._inLiangxi) {
            this.shouPai.forEach(function (jlmj_pai, idx) {
                if (jlmj_pai) {
                    jlmj_pai.setTouchAble(false);
                }
            }, this);
            if (this.modepai) {
                this.modepai.setTouchAble(false);
            }

            if (player.canliangxi) {
                cc.find("Canvas/game_menu_list").getComponent(mjComponentValue.gameMenuList).setMenus(player);

                this.setLiangXiPai()
            }
        }
    },


    touchStart: function (event) {
        if (this.isliangzhang) {
            return;
        }

        if (this._inLiangxi) {
            var pai_touched = this.getTouchPai(event);
            if (pai_touched) {
                let isnormalxi = RoomMgr.Instance()._Rule.isnormalxi;

                let pai_touch_id = Math.floor(pai_touched.cardId / 4);

                let _idx = this._liangxi_pai.indexOf(pai_touched.cardId);
                if (_idx != -1) {
                    pai_touched.selected = false;
                    pai_touched.node.y = this.restPt_y();
                    this._liangxi_pai.splice(_idx, 1);
                    if (isnormalxi) {
                        for (let i = 0; i < this.shouPai.length; i++) {
                            if (Math.floor(this.shouPai[i].cardId / 4) == pai_touch_id && this.shouPai[i].cardId != pai_touched.cardId) {
                                this.shouPai[i].setTouchAble(true);
                            }
                        }
                        if (this.modepai && Math.floor(this.modepai.cardId / 4) == pai_touch_id && this.modepai.cardId != pai_touched.cardId) {
                            this.modepai.setTouchAble(true);
                        }
                    }
                } else {
                    pai_touched.selected = true;
                    pai_touched.node.y = this.restPt_y() + this.chupai_offset;
                    this._liangxi_pai.push(pai_touched.cardId);
                    if (isnormalxi) {
                        for (let i = 0; i < this.shouPai.length; i++) {
                            if (Math.floor(this.shouPai[i].cardId / 4) == pai_touch_id && this.shouPai[i].cardId != pai_touched.cardId) {
                                this.shouPai[i].setTouchAble(false);
                            }
                        }
                        if (this.modepai && Math.floor(this.modepai.cardId / 4) == pai_touch_id && this.modepai.cardId != pai_touched.cardId) {
                            this.modepai.setTouchAble(false);
                        }
                    }
                }
                mj_audio.playAduio("select");
                this.pai_touched = pai_touched;
                return;
            }
        }

        this._super(event);
    },

    touchMove: function (event) {
        if (this._inLiangxi) {
            return;
        }
        this._super(event);
    },

    touchEnd: function (event) {
        if (this._inLiangxi && this.pai_touched) {
            this.require_UserPlayer.setLiangxi(this._liangxi_pai);
            this.pai_touched = null;
            return;
        }

        this._super(event);
    },

    /**
     * 恢复所有牌的初始化位置
     */
    resetSelected: function (cardID) {
        this.chupai_act = false;
        this.isliangzhang = false;
        this._liangxi_pai = [];
        if (this._inLiangxi) {
            this.require_UserPlayer.setLiangxi(this._liangxi_pai);
            if (this.require_UserPlayer.canliangxi) {
                this.setLiangXiPai();
            }
        }
        this._super(cardID);

    },

    /**
     * 听牌发送
     * @param playCardId 出牌
     */
    _sendTingPai: function (playCardId, tingType) {
        let _liangzhangbaoID = this.require_UserPlayer.liangzhangID

        let hasLiangZhangBao = cc.dd._.isNumber(_liangzhangbaoID);

        let _tp = 1;
        if (hasLiangZhangBao) {
            _tp = 5;
        }

        var out_card = new cc.pb.jilinmajiang.CardInfo();
        out_card.setId(playCardId);
        this.require_UserPlayer.waitTing = true;
        if (tingType == 2) {
            var chi_card = new cc.pb.jilinmajiang.CardInfo();
            chi_card.setId(this.require_UserPlayer.chi_pai);

            var chi_option = this.require_UserPlayer.chitingPaiId;
            var card_option = [];
            chi_option.forEach(function (id) {
                var card = new cc.pb.jilinmajiang.CardInfo();
                card.setId(id);
                card_option.push(card);
            });
            this.require_UserPlayer.chitingPaiId = null;
            var msg = new cc.pb.fangzhengmj.fangzheng_req_chiting();
            msg.setChicard(chi_card);
            msg.setChoosecardsList(card_option);
            msg.setOutcard(out_card);
            msg.setTingtype(_tp);
            msg.setDdsjcardid(-1);
            msg.setLzbcardid(hasLiangZhangBao ? _liangzhangbaoID : -1);
            cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_chiting, msg, "cmd_fangzheng_req_chiting");
        } else if (tingType == 3) {
            var msg = new cc.pb.fangzhengmj.fangzheng_req_pengting();

            msg.setOutcard(out_card);
            msg.setTingtype(_tp);
            msg.setDdsjcardid(-1);
            msg.setLzbcardid(hasLiangZhangBao ? _liangzhangbaoID : -1);

            cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_pengting, msg, "cmd_fangzheng_req_pengting");
        } else {
            var msg = new cc.pb.fangzhengmj.fangzheng_req_tingpai_out_card();
            msg.setCardid(playCardId);
            msg.setTingtype(_tp);
            msg.setDdsjcardid(-1);
            msg.setLzbcardid(hasLiangZhangBao ? _liangzhangbaoID : -1);
            cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_tingpai_out_card, msg, "cmd_fangzheng_req_tingpai_out_card");
        }

        cc.dd.NetWaitUtil.net_wait_start();
    },


    /**
     * 发送出牌
     */
    _sendOutCard: function (cardID) {
        var msg = new cc.pb.fangzhengmj.fangzheng_req_game_send_out_card();
        msg.setCardid(cardID);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_game_send_out_card, msg, "fangzheng_req_game_send_out_card");
        cc.dd.NetWaitUtil.net_wait_start();
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
            case this.require_PlayerEvent.SHOW_LIANG_ZHANG_BAO:
                this.shouPai.forEach(function (jlmj_pai, idx) {
                    if (jlmj_pai) {
                        jlmj_pai.setTouch(false);
                    }
                }, this);

                if (this.modepai.node.active) {
                    this.modepai.setTouch(false);
                }
                this.isliangzhang = true;
                break;
            case this.require_PlayerEvent.LIANGXISTATE:
                this._inLiangxi = data[1] == 0;
                this.liangxi_State.active = data[1] == 0;
                this._liangxi_pai = [];
                this.shouPai.forEach(function (jlmj_pai, idx) {
                    if (jlmj_pai) {
                        jlmj_pai.setTouchAble(data[1] != 0);
                    }
                }, this);
                if (this.modepai) {
                    this.modepai.setTouchAble(data[1] != 0);
                }
                this.updateShouPai();
                break;
            case this.require_PlayerEvent.GUO:
                if (this._inLiangxi) {
                    this.liangxi_State.active = true;
                    this.updateShouPai();
                }
                return;
            default:
                break;
        }

        this._super(event, data);
    },

    customTouchEndSendOutCard() {

    },

    getTingType() {
        let tingType = 1;
        // if (require_UserPlayer.isTempGang) {
        //     tingType = 2;
        // }
        if (this.require_UserPlayer.isTempChiTing) {
            tingType = 2;
        }
        if (this.require_UserPlayer.isTempPengTing) {
            tingType = 3;
        }
        // if(require_UserPlayer.isTempGangTing){
        //     tingType = 5;
        // }

        return tingType;
    },

    /**
     * 中发白杠
     */
    zfbgang: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        // this.addZFBGPai(baipai_data);
        this.resetBaiPai(data[0]);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }
        mj_audio.playAudioBySex("liangxi", player.sex);
        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.dgpt_ani, ['liangxi', 'liangxiXS']);

        if (this._inLiangxi) {
            this.liangxi_State.active = true;
        }
    },

    setLiangXiPai() {
        this.liangxi_State.active = false;
        this._liangxi_pai = [];

        let gang_options = this.require_UserPlayer.xiList;
        if (gang_options && cc.dd._.isArray(gang_options.cardList)) {
            this.shouPai.forEach(function (jlmj_pai, idx) {
                if (jlmj_pai) {
                    jlmj_pai.setTouchAble(gang_options.cardList.indexOf(jlmj_pai.cardId) != -1);
                }
            }, this);
            if (this.modepai) {
                this.modepai.setTouchAble(gang_options.cardList.indexOf(this.modepai.cardId) != -1);
            }
        }
    },

    /**
     * 开启部分牌的触摸
     * @param cardList
     */
    openPaitouch: function (canCradList) {
        if (this.touchCardMode == 3 && this.require_UserPlayer.isTempBaoTing && canCradList.length == 1) {
            var tingType = this.getTingType();
            this.require_UserPlayer.setJiaoInfo(canCradList[0]);
            this.sendTingPai(canCradList[0], tingType);
            return;
        }
        this._super(canCradList)
    },

    initMJComponet() {
        return require("mjComponentValue").fzmj;
    }
});
