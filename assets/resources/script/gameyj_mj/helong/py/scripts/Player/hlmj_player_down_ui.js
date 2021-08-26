var UIZorder = require("mj_ui_zorder");

let base_mj_player_down_ui = require('base_mj_player_down_ui');
let TouchCardMode = require('base_mj_player_data').TouchCardMode;
var BaipaiType = require("jlmj_baipai_data").BaipaiType;
const paiType = require('jlmj_gang_pai_type').CardType;
var pai3d_value = require('jlmj_pai3d_value');
var RoomMgr = require("jlmj_room_mgr").RoomMgr;

//每个麻将都要改写这个
let mjComponentValue = null;

cc.Class({
    extends: base_mj_player_down_ui,

    properties: {
        jiantouPrefab: cc.Prefab,
        gangtipPrefab: cc.Prefab,
    },

    ctor: function () {
        mjComponentValue = this.initMJComponet();
    },

    initHuPai() {
        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_d").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_d").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_d").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_d").getComponent(sp.Skeleton);
        // this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_d").getComponent(sp.Skeleton);
        this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_d").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_d").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_d").getComponent(sp.Skeleton);

        this.clearHuPai();
    },

    clearHuPai() {
        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;

        cc.dd.UIMgr.closeUI(this.require_jlmj_prefab.MJ_TINGPAI_INFO);
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
        if (this.require_UserPlayer.isTempGangTing) {
            tingType = 5;
        }

        return tingType;
    },

    touchStart: function (event) {
        if (this.require_DeskData.Instance().isHu) {
            this.closeJiaoInfo();
            return;
        }

        if (this.fenpai_touched && !this.require_UserPlayer.canting) {
            return;
        }

        if (this.chupai_act) {
            return;
        }

        // if(!cc.dd._.isNull(cc.dd.NetWaitUtil.net_wait_id)){
        //     return;
        // }

        this.isCanMove = new Date().getTime();
        var pai_touched = this.getTouchPai(event);
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
        if (this.require_DeskData.Instance().isHu) {
            return;
        }

        if (this.fenpai_touched && !this.require_UserPlayer.canting) {
            return;
        }

        this.changePaiMove(event);

        if (this.pai_touched &&                          //没有选择牌
            // this.touchCardMode == TouchCardMode.CHU_PAI && //非出牌模式的时候不能滑动
            !this.require_UserPlayer.canhu) {                          //胡牌的时候不能滑动

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
        if (this.require_DeskData.Instance().isHu) {
            this.yidong_pai.node.active = false;
            return;
        }

        if (this.require_DeskData.Instance().waitForSendOutCard) {
            this.resetSelected();
            return;
        }

        if (this.fenpai_touched && !this.require_UserPlayer.canting) {
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

        cc.log("touchend " + this.pai_touched.cardId);

        this.pai_touched = null;
        this.isCanMove = null;

        if (this.yidong_pai.node.active) {
            cc.log("touchend yidong_pai " + this.yidong_pai.node.y + " " + this.pai_move_offset + " " + this._node_scale_y);

            if (this.yidong_pai.node.y > this.pai_move_offset * this._node_scale_y) {
                //出牌
                // this.resetSelected();

                this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, false, null, 1]);

                var jlmj_pai = this.getShouPai(this.yidong_pai.cardId);
                if (this.require_UserPlayer.isTempBaoTing) {
                    var tingType = this.getTingType();
                    this.require_UserPlayer.setJiaoInfo(this.yidong_pai.cardId);
                    this.sendTingPai(this.yidong_pai.cardId, tingType);
                } else if (this.require_UserPlayer.isBaoTing && this.require_UserPlayer.canting) {
                    if (this.yidong_pai.cardId == this.modepai.cardId) {
                        this.customTouchEndSendOutCard();
                        this.sendOutCard(this.yidong_pai.cardId);
                        this.setShoupaiTingbiaoji(false);
                        this.yidong_pai_show = true;
                    } else {
                        var tingType = 4;
                        this.require_UserPlayer.setJiaoInfo(this.yidong_pai.cardId);
                        this.sendTingPai(this.yidong_pai.cardId, tingType);
                    }
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

                if (this.touchCardMode == 3) {
                    var arr = [];
                    var list = this.require_UserPlayer.jiaoInfo_list;
                    for (var i = 0; i < list.length; ++i) {

                        let canpush = false;
                        if (RoomMgr.Instance()._Rule.usercountlimit == 4) {
                            for (let j = 0; j < list[i].jiao_pai_list.length; j++) {
                                if (list[i].jiao_pai_list[j].hutypesList.length > 0) {
                                    canpush = true;
                                    break;
                                }
                            }
                        } else {
                            canpush = true;
                        }
                        if (canpush) {
                            arr.push(list[i].out_id);
                        }
                    }

                    this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, true, arr, 3]);
                }
            }
        } else {
            cc.log("touchend pai_touched ");

            var pai_touched = this.getTouchPai(event);

            if (!pai_touched) {
                this.resetSelected();
                if (this.touchCardMode == 3) {
                    var arr = [];
                    var list = this.require_UserPlayer.jiaoInfo_list;
                    for (var i = 0; i < list.length; ++i) {

                        let canpush = false;
                        if (RoomMgr.Instance()._Rule.usercountlimit == 4) {
                            for (let j = 0; j < list[i].jiao_pai_list.length; j++) {
                                if (list[i].jiao_pai_list[j].hutypesList.length > 0) {
                                    canpush = true;
                                    break;
                                }
                            }
                        } else {
                            canpush = true;
                        }
                        if (canpush) {
                            arr.push(list[i].out_id);
                        }
                    }

                    this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, true, arr, 3]);
                }
                return;
            }
            if (this.require_DeskData.Instance().sendCard && this.require_DeskData.Instance().sendCard == pai_touched.cardId) {
                cc.log("touchend pai_touched waitsend");

                this.resetSelected();
                if (this.touchCardMode == 3) {
                    var arr = [];
                    var list = this.require_UserPlayer.jiaoInfo_list;
                    for (var i = 0; i < list.length; ++i) {

                        let canpush = false;
                        if (RoomMgr.Instance()._Rule.usercountlimit == 4) {
                            for (let j = 0; j < list[i].jiao_pai_list.length; j++) {
                                if (list[i].jiao_pai_list[j].hutypesList.length > 0) {
                                    canpush = true;
                                    break;
                                }
                            }
                        } else {
                            canpush = true;
                        }
                        if (canpush) {
                            arr.push(list[i].out_id);
                        }
                    }

                    this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, true, arr, 3]);
                }
                return;
            }

            if (!pai_touched.doubleSelected) {
                cc.log("touchend pai_touched singletouch");

                if (event.touch.getLocationY() - this.yd_y > this.chupai_offset) {
                    cc.log("touchend pai_touched singletouch " + event.touch.getLocationY() + " " + this.yd_y + " " + this.chupai_offset);

                } else {
                    if (this.touchCardMode == 3) {
                        var arr = [];
                        var list = this.require_UserPlayer.jiaoInfo_list;
                        for (var i = 0; i < list.length; ++i) {

                            let canpush = false;
                            if (RoomMgr.Instance()._Rule.usercountlimit == 4) {
                                for (let j = 0; j < list[i].jiao_pai_list.length; j++) {
                                    if (list[i].jiao_pai_list[j].hutypesList.length > 0) {
                                        canpush = true;
                                        break;
                                    }
                                }
                            } else {
                                canpush = true;
                            }
                            if (canpush) {
                                arr.push(list[i].out_id);
                            }
                        }

                        this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, true, arr, 3]);
                    }
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
            } else if (this.require_UserPlayer.isBaoTing && this.require_UserPlayer.canting) {
                if (this.yidong_pai.cardId == this.modepai.cardId) {
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
                } else {
                    var tingType = 4;
                    this.require_UserPlayer.setJiaoInfo(pai_touched.cardId);
                    this.sendTingPai(pai_touched.cardId, tingType);
                    this.da_pai = true;
                }
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

        var desk_info = cc.find('Canvas/desk_info').getComponent(mjComponentValue.deskInfo);
        desk_info.setTingPaiUIActive(this.require_UserPlayer.isBaoTing);
    },

    touchDapai() {
        if (this.canTouchPaiAni && !this.fenpai_touched) {
            this.canTouchPaiAni = false;

            if (cc.dd._.isUndefined(pai3d_value.desc[this.require_DeskData.Instance().sendCard])) {
                return;
            }

            this.require_DeskData.Instance().last_chupai_id = this.require_DeskData.Instance().sendCard
            this.require_playerMgr.Instance().shou2mid_id_list.push(this.require_DeskData.Instance().sendCard);
            this.require_UserPlayer.dapai(this.require_DeskData.Instance().sendCard);
        }
    },

    /**
     * 重置摆牌
     */
    resetBaiPai: function (playerData) {
        cc.log("重置摆牌");
        this.isResetBaiPai = true;
        var arrBaiPaiData = playerData.baipai_data_list;

        this.need_offsetX = false;
        this.need_offsetX_4 = false;

        let getSamePaiType = (list, idAndCnts) => {
            for (let i = 0; i < list.length; i++) {
                for (let j = i + 1; j < list.length; j++) {
                    if (idAndCnts) {
                        if (Math.floor(list[i].id / 4) == Math.floor(list[j].id / 4)) {
                            return [list[i], list[j]];
                        }
                    } else {
                        if (Math.floor(list[i] / 4) == Math.floor(list[j] / 4)) {
                            return [list[i], list[j]];
                        }
                    }
                }
            }
            return null;
        }

        let func = (list, idAndCnts) => {
            let idList = getSamePaiType(list, idAndCnts);
            if (idList) {
                let topIDIndex = list.indexOf(idList[0]);
                list.splice(topIDIndex, 1);
                let bottomIDIndex = list.indexOf(idList[1]);
                list.splice(bottomIDIndex, 1);
                list.splice(0, 0, idList[0]);
                list.splice(2, 0, idList[1]);
            }
        }

        arrBaiPaiData.forEach(function (baipai) {
            if (baipai.type == BaipaiType._19G1 || baipai.type == BaipaiType.ZFBG) {
                this.sortBaiPai(baipai);
                if (baipai.cardIds) {
                    func(baipai.cardIds);
                }
                if (baipai.idAndCnts) {
                    func(baipai.idAndCnts, true);
                }
            } else if (baipai.type == BaipaiType._FG) {
                this.sortBaiPai(baipai);
            } else if (baipai.type != BaipaiType.CHI && baipai.cardIds.length > 3) {
                var tmp_cardIds = [];
                var tmp_idAndCnts = [];
                if (baipai.cardIds) {
                    for (var id = 0; id < baipai.cardIds.length; ++id) {
                        if (Math.floor(baipai.cardIds[id] / 4) == paiType.S1) {
                            tmp_cardIds.push(baipai.cardIds[id]);
                            baipai.cardIds.splice(id, 1);
                            id--;
                        }
                    }
                }
                if (baipai.idAndCnts) {
                    for (var id = 0; id < baipai.idAndCnts.length; ++id) {
                        if (Math.floor(baipai.idAndCnts[id].id / 4) == paiType.S1) {
                            tmp_idAndCnts.push(baipai.idAndCnts[id]);
                            baipai.idAndCnts.splice(id, 1);
                            id--;
                        }
                    }
                }

                this.sortBaiPai(baipai);

                if (baipai.cardIds) {
                    baipai.cardIds = tmp_cardIds.concat(baipai.cardIds);
                }
                if (baipai.idAndCnts) {
                    baipai.idAndCnts = tmp_idAndCnts.concat(baipai.idAndCnts);
                }
            }
            var baipai_ui = this.getBaiPaiUI(baipai);//获取已有的摆牌UI没有则创建
            if (baipai.type == BaipaiType.BAGANG || baipai.type == BaipaiType.DIANGANG || baipai.type == BaipaiType._FG) {
                if (baipai_ui.pais.length == 3) {
                    this._setbaipaiValue(baipai_ui.pais, baipai, playerData);
                } else {
                    this._setMingGang(baipai_ui.pais, baipai, playerData);
                }
            } else if (baipai.type == BaipaiType.ANGANG || baipai.type == BaipaiType.ZFBG || baipai.type == BaipaiType._19G1) {
                this._setMingGang(baipai_ui.pais, baipai, playerData);
            } else {
                this._setbaipaiValue(baipai_ui.pais, baipai, playerData);
            }

            if (baipai.type == BaipaiType.CHI) {//如果是吃牌就要判断 中发白
                this.setZFB_chi(baipai, baipai_ui.pais, baipai.mj_index, playerData);
            }
        }.bind(this));
        this.updateXiaoJiCnt(playerData);//小鸡飞蛋

        if (playerData.viewIdx == 1 || playerData.viewIdx == 3) {
            if (playerData.state != this.require_PlayerState.HUPAI && playerData.getBaiPaiNum() >= 16) {
                //第16,17张牌,摆牌居中
                this.baiPaiAlignCenterV();
            }
        }

        let buhua_data = playerData.buhua_data;
        if (buhua_data) {
            let baipai_ui = this.getBuHuaUI(buhua_data);//获取已有的摆牌UI没有则创建
            this._setBuHua(baipai_ui.pais, buhua_data, playerData);
        }

        this.isResetBaiPai = false;
        if (this.needUpdateShouPai) {
            this.needUpdateShouPai = false;
            this.updateShouPai();
        }
    },

    /**
     * 普通摆牌
     */
    _setbaipaiValue: function (pais, baipai, player) {
        var use_kaipai_cfg = false;
        if (player.isUserPlayer() && player.state == this.require_PlayerState.HUPAI) {
            //自家摆牌结算时使用开牌配置
            use_kaipai_cfg = true;
        }
        var mj_index = baipai.mj_index;
        if (player.viewIdx == 1 || player.viewIdx == 3) {
            if (player.state != this.require_PlayerState.HUPAI && player.getBaiPaiNum() <= 13) {
                //左右玩家,摆牌数小于13时,从第3张牌起布局
                mj_index += 2;
            }
        }
        let showIndex = Math.floor(pais.length / 2);

        let use2D = this.require_DeskData.Instance().getIs2D()

        //循环遍历摆牌ui并且设置摆牌ui的数据
        pais.forEach(function (jlmj_pai, idx) {
            if (!jlmj_pai.node.parent) {
                this.node.addChild(jlmj_pai.node);
            }

            let jiantou = jlmj_pai.node.getChildByName('jiantou');
            if (jiantou) {
                jiantou.active = false;
            }

            var idAndCnts = baipai.getShowPaiList();
            jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_cfg : this.pai3dCfg.baipai_open_down_cfg;
            jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + idx)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + idx)]);
            jlmj_pai.setValue(idAndCnts[idx].id);
            jlmj_pai.setCnt(idAndCnts[idx].cnt);
            this.updateBaiPaiSpace(jlmj_pai, baipai, player);

            if (baipai.type == BaipaiType.PENG) {
                if (showIndex == idx) {
                    if (jiantou) {
                        jiantou.active = true;
                    } else {
                        let node = cc.instantiate(this.jiantouPrefab);
                        node.name = 'jiantou';
                        jlmj_pai.node.addChild(node);
                        jiantou = node;
                    }

                    jiantou.x = jlmj_pai.value.node.x;
                    jiantou.y = jlmj_pai.value.node.y;
                    jiantou.height = 25;
                    jiantou.active = true;
                    if (baipai.viewIdx == 0) {
                        jiantou.rotation = 0;
                        jiantou.scaleX = jlmj_pai.node.scaleX > 0 ? 0.9 : -0.9;
                        jiantou.scaleY = 0.9;
                    } else if (baipai.viewIdx == 1) {
                        jiantou.rotation = -90;
                        jiantou.scaleX = 0.9;
                        jiantou.scaleY = jlmj_pai.node.scaleX > 0 ? 0.9 : -0.9;
                    } else if (baipai.viewIdx == 2) {
                        jiantou.rotation = 180;
                        jiantou.scaleX = jlmj_pai.node.scaleX > 0 ? 0.9 : -0.9;
                        jiantou.scaleY = 0.9;
                    } else if (baipai.viewIdx == 3) {
                        jiantou.rotation = 90;
                        jiantou.scaleX = 0.9;
                        jiantou.scaleY = jlmj_pai.node.scaleX > 0 ? 0.9 : -0.9;
                    } else {
                        jiantou.active = false;
                    }
                }
            }

            if (this.need_offsetX === true) {
                jlmj_pai.node.x -= 76;
            }
            if (this.need_offsetX_4 === true) {
                jlmj_pai.node.x -= 57;
            }
            if (player.viewIdx == 0 && use2D && player.state != this.require_PlayerState.HUPAI) {
                if (pais.length == 5) {
                    jlmj_pai.node.x -= 19 * idx;
                    if (idx == 4) {
                        this.need_offsetX = true;
                    }
                }
                if (pais.length == 4) {
                    jlmj_pai.node.x -= 19 * idx;
                    if (idx == 3) {
                        this.need_offsetX_4 = true;
                    }
                }
            }

            if (baipai.type == BaipaiType.LZB) {
                jlmj_pai.showLZB();
            }
        }.bind(this));
    },

    /**
     * 明杠展示
     * @param pais
     */
    _setMingGang: function (pais, baipai, player) {
        var use_kaipai_cfg = false;
        if (player.isUserPlayer() && player.state == this.require_PlayerState.HUPAI) {
            //自家摆牌结算时使用开牌配置
            use_kaipai_cfg = true;
        }
        var idAndCnts = baipai.getShowPaiList();
        var mj_index = baipai.mj_index;
        if (player.viewIdx == 1 || player.viewIdx == 3) {
            if (player.state != this.require_PlayerState.HUPAI && player.getBaiPaiNum() <= 13) {
                //左右玩家,摆牌数小于13时,从第3张牌起布局
                mj_index += 2;
            }
        }
        //循环遍历摆牌ui并且设置摆牌ui的数据
        for (var idx = 0; idx < pais.length; ++idx) {
            var jlmj_pai = pais[idx];
            if (!jlmj_pai.node.parent) {
                this.node.addChild(jlmj_pai.node);
            }

            let jiantou = jlmj_pai.node.getChildByName('jiantou');
            if (jiantou) {
                jiantou.active = false;
            }

            // let tips = jlmj_pai.node.getChildByName('hlmj_gang_tips');
            // if(tips){
            //     tips.active = false;
            // }

            if (baipai.type == BaipaiType._FG) {
                jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_cfg : this.pai3dCfg.baipai_open_down_cfg;
                jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + idx)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + idx)]);
            } else {
                //3+1
                if (idx == 0) {
                    jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_up_cfg : this.pai3dCfg.baipai_open_up_cfg;
                    jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + 1)], jlmj_pai.cfgArrObj['value_' + (mj_index + 1)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + 1)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + 1)]);
                } else {
                    jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_cfg : this.pai3dCfg.baipai_open_down_cfg;
                    jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx - 1)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx - 1)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + idx - 1)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + idx - 1)]);
                }
            }


            jlmj_pai.setValue(idAndCnts[idx].id);
            jlmj_pai.setCnt(idAndCnts[idx].cnt);

            if (baipai.type == BaipaiType.DIANGANG || (baipai.type == BaipaiType.BAGANG && cc.dd._.isNumber(baipai.viewIdx))) {
                if (idx == 0) {
                    if (jiantou) {
                        jiantou.active = true;
                    } else {
                        let node = cc.instantiate(this.jiantouPrefab);
                        node.name = 'jiantou';
                        jlmj_pai.node.addChild(node);
                        jiantou = node;
                    }

                    jiantou.x = jlmj_pai.value.node.x;
                    jiantou.y = jlmj_pai.value.node.y;
                    jiantou.height = 25;
                    jiantou.active = true;
                    if (baipai.viewIdx == 0) {
                        jiantou.rotation = 0;
                        jiantou.scaleX = jlmj_pai.node.scaleX > 0 ? 0.9 : -0.9;
                        jiantou.scaleY = 0.9;
                    } else if (baipai.viewIdx == 1) {
                        jiantou.rotation = -90;
                        jiantou.scaleX = 0.9;
                        jiantou.scaleY = jlmj_pai.node.scaleX > 0 ? 0.9 : -0.9;
                    } else if (baipai.viewIdx == 2) {
                        jiantou.rotation = 180;
                        jiantou.scaleX = jlmj_pai.node.scaleX > 0 ? 0.9 : -0.9;
                        jiantou.scaleY = 0.9;
                    } else if (baipai.viewIdx == 3) {
                        jiantou.rotation = 90;
                        jiantou.scaleX = 0.9;
                        jiantou.scaleY = jlmj_pai.node.scaleX > 0 ? 0.9 : -0.9;
                    } else {
                        jiantou.active = false;
                    }
                }
            }

            // if(baipai.type == BaipaiType.ANGANG || baipai.type == BaipaiType.ZFBG || baipai.type == BaipaiType._19G1 || baipai.type == BaipaiType._FG){
            //     if(cc.dd._.isString(this.gangtips) && idx == 0){
            //         if(tips){
            //             tips.active = true;
            //         }else{
            //             let node = cc.instantiate(this.gangtipPrefab);
            //             node.name = 'hlmj_gang_tips';
            //             jlmj_pai.node.addChild(node);
            //             tips = node;
            //         }
            //         if(baipai.type == BaipaiType._FG){
            //             tips.x = 76;
            //             tips.y = 68;
            //         }else{
            //             tips.x = 0;
            //             tips.y = 50;
            //         }
            //         tips.active = true;
            //
            //         tips.getComponent(cc.Label).string = this.gangtips;
            //     }
            // }

            this.updateBaiPaiSpace(jlmj_pai, baipai, player);
            if (this.need_offsetX === true) {
                jlmj_pai.node.x -= 76;
            }
            if (this.need_offsetX_4 === true) {
                jlmj_pai.node.x -= 57;
            }
        }
    },

    /**
     * 生成牌
     */
    createCCGPai: function () {
        var pai_node = cc.instantiate(this.prefab_pai);
        var jlmj_pai = pai_node.getComponent('jlmj_pai');
        if (!jlmj_pai) {
            cc.error("麻将牌没有jlmj_pai组件");
        }
        return jlmj_pai;
    },

    /**
     * 巴杠
     */
    bagang: function (data) {
        cc.log("吧杠开始");
        var player = data[0];
        var baipai_data = data[1];
        // this.addBaGangPai(baipai_data);
        this.resetBaiPai(player);
        this.updateShouPai(player);

        this.require_mj_audio.playAudioBySex("gang", player.sex);

        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);
        this.playSpine(this.cpgtgh_ani, ['gang', 'gangXS']);

        cc.log("吧杠结束");
    },

    /**
     * 暗杠
     */
    angang: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        // this.addAnGangPai(baipai_data);
        this.resetBaiPai(player);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }

        this.require_mj_audio.playAudioBySex("gang", player.sex);

        //this.play_ani.play("jlmj_andan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('andan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);
        this.playSpine(this.cpgtgh_ani, ['gang', 'gangXS']);

    },

    /**
     * 点杠
     */
    diangang: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        // this.addDianGangPai(baipai_data);
        this.resetBaiPai(player);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }

        this.require_mj_audio.playAudioBySex("gang", player.sex);

        //this.play_ani.play("jlmj_mingdan_texiao");

        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);
        this.playSpine(this.cpgtgh_ani, ['gang', 'gangXS']);
    },

    /**
     * 1杠
     */
    _19gang1: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        this.resetBaiPai(player);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }
        this.require_mj_audio.playAudioBySex("gang", player.sex);
        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.cpgtgh_ani, ['gang', 'gangXS']);
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
        this.require_mj_audio.playAudioBySex("gang", player.sex);
        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.cpgtgh_ani, ['gang', 'gangXS']);
    },

    /**
     * 风杠
     */
    fgang: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        // this.addSFGPai(baipai_data);
        this.resetBaiPai(player);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }
        this.require_mj_audio.playAudioBySex("gang", player.sex);
        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.cpgtgh_ani, ['gang', 'gangXS']);
    },

    checkChuPaiPromot(player) {
        let result = player.hasMoPai() && this.require_DeskData.Instance().isGameStart && !this.require_playerMgr.Instance().playing_fapai_ani && !player.isBaoTing && player.state != this.require_PlayerState.HUPAI && !this.require_DeskData.Instance().isFenZhang;
        if (this.chupai_prompt) {
            if (player.isBaoTing && player.canting) {
                result = player.hasMoPai() && this.require_DeskData.Instance().isGameStart && !this.require_playerMgr.Instance().playing_fapai_ani && player.state != this.require_PlayerState.HUPAI && !this.require_DeskData.Instance().isFenZhang;
                if (result) {
                    cc.find('prompt_label', this.chupai_prompt).getComponent(cc.Label).string = '可换听';//有s显示才改
                }
            } else {
                cc.find('prompt_label', this.chupai_prompt).getComponent(cc.Label).string = '请出牌';
            }
        }

        var desk_info = cc.find('Canvas/desk_info').getComponent(mjComponentValue.deskInfo);
        desk_info.setTingPaiUIActive(player.isBaoTing && !player.canting);

        return result
    },

    /**
     * 开启部分牌的触摸
     * @param cardList
     */
    openPaitouch: function (canCradList) {
        if (this.chupai_prompt) {
            this.chupai_prompt.active = this.checkChuPaiPromot(this.require_UserPlayer);
        }

        if (this.modepai) {
            this.modepai.setTouchAble(false);
        }
        this.setShoupaiTingbiaoji(false);
        this.setShoupaiTouch(false);//关闭手牌的触摸
        for (var i = 0; i < canCradList.length; ++i) {
            var shoupai = this.getShouPai(canCradList[i]);
            if (shoupai) {
                shoupai.setTouchAble(true);

                if (this.fenpai_touched) {
                    if (this.require_UserPlayer.canting) {

                    } else {
                        shoupai.setTouchAble(false);
                    }
                }

                if (this.touchCardMode == 3 && !shoupai.isHunPai) {
                    shoupai.setTingPai(true);
                }
            } else {
                if (canCradList[i] == -1) {
                    cc.log("【UI】" + "用户玩家杠听特殊牌");
                } else {
                    cc.error("【UI】" + "用户玩家中不存在牌:" + pai3d_value.desc[canCradList[i]]);
                }
            }
        }
    },

    /**
     * 听牌发送
     * @param playCardId 出牌
     */
    _sendTingPai: function (playCardId, tingType) {
        let func = (ting) => {
            this.require_UserPlayer.setJiaoInfo(playCardId, ting);

            var out_card = new cc.pb.jilinmajiang.CardInfo();
            out_card.setId(playCardId);
            this.require_UserPlayer.waitTing = true;

            var msg = new cc.pb.mjcommon.mj_req_tingpai_out_card();
            msg.setCardid(playCardId);
            msg.setTingtype(tingType);
            msg.setDdsjcardid(cc.dd._.isNumber(ting) ? ting : -1);
            msg.setLzbcardid(-1);
            cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_tingpai_out_card, msg, "cmd_mj_req_tingpai_out_card");
            this.require_UserPlayer.canting = false;

            cc.dd.NetWaitUtil.net_wait_start();
        }

        var jiaoInfo = this.require_UserPlayer.getJiaoInfo(playCardId);
        if (jiaoInfo && jiaoInfo.jiao_pai_list && jiaoInfo.jiao_pai_list.length > 0) {
            let templist = {};
            let fancount = 0;
            let default_fan = -1;
            for (let i = 0; i < jiaoInfo.jiao_pai_list.length; i++) {
                let jiaopaiinfo = jiaoInfo.jiao_pai_list[i];

                let cnt = jiaopaiinfo.cnt >> 16;

                if (!templist.hasOwnProperty(cnt)) {
                    templist[cnt] = {
                        hutype: jiaopaiinfo.hutypesList,
                        idList: []
                    };
                    fancount++;
                    default_fan = cnt;
                }

                templist[cnt].idList.push(jiaopaiinfo.id);
            }

            if (fancount > 1) {
                cc.dd.UIMgr.openUI(this.require_jlmj_prefab.MJ_TINGPAI_INFO, function (ui) {
                    var mj_jiao_info = ui.getComponent('mj_tingInfo_ui');
                    mj_jiao_info.initUI(templist, func);
                }.bind(this));
            } else {
                func(default_fan);
            }
        } else {
            func();
        }
    },

    // /**
    //  * 恢复所有牌的初始化位置
    //  */
    // resetSelected: function (cardID) {
    //     this._super(cardID);
    //     cc.dd.UIMgr.closeUI(this.require_jlmj_prefab.MJ_TINGPAI_INFO);
    // },

    initMJComponet() {
        return require("mjComponentValue").hlmj;
    }
});
