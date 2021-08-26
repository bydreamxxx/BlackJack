var DeskData = require('ahmj_desk_data').DeskData;
var DeskEvent = require('ahmj_desk_data').DeskEvent;
var DeskED = require('ahmj_desk_data').DeskED;
var SysEvent = require("com_sys_data").SysEvent;

var HuType = require('jlmj_define').HuType;
var HuTypeDesc = require('jlmj_define').JZHuTypeDesc;

var mj_audio = require('nmmj_audio');

var jlmj_player_base_ui = require('jlmj_player_base_ui');
var jlmj_prefab = require('nmmj_prefab_cfg');

var PlayerState = require("ahmj_player_data").PlayerState;
var PlayerMgr = require('ahmj_player_mgr');
var PlayerBaseInfoMgr = require('hall_common_data').PlayerBaseInfoMgr.getInstance();
var pai3d_value = require('jlmj_pai3d_value');
var PlayerEvent = require("ahmj_player_data").PlayerEvent;

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var UserPlayer = require('ahmj_userPlayer_data').Instance();
cc.Class({
    extends: jlmj_player_base_ui,

    properties: {
        head: { default: null, type: require("ahmj_playerHead"), tooltip: '头像', override: true },              //头像
    },
    initUI: function (_player) {
        this.clear();
        if (this.playerLocation) {
            this.playerLocation.active = false;
        }
        var player = cc.dd._.isNull(_player) || cc.dd._.isUndefined(_player) ? PlayerMgr.Instance().getPlayerByViewIdx(this.viewIdx) : _player;
        if (player) {
            cc.log('玩家UI 初始化 视觉座位号:' + this.viewIdx);
            this.node.active = true;
            this.head.node.active = true;
            this.head.initUI(player);
            if (this.playerLocation) {
                this.playerLocation.active = true;
            }
            if (this.viewIdx == 0 && DeskData.Instance().isFriend()) {
                cc.find("Canvas/toppanel/btn_ready").active = !player.bready;
            }
            this.updateChuPaiUI(player, PlayerMgr.Instance().playerList.length == 2);
            this.resetBaiPai(player);
            this.quxiaoBiaoJIBaoPaiInShouPai();
            this.updateShouPai(player);
            this.updateZsq();
            this.updateZhanshiPai();
        }
    },

    /**
     * 清理
     * @param data
     */
    clear: function (data) {
        cc.log("player_ui 清理桌子");
        this.huEffect.active = false;
        this.zhanshi_pai.node.active = false;

        this.shouPai.forEach(function (pai) {
            pai.node.active = false;

            //todo 朋友场 临时处理
            pai.value.node.active = false;
            pai.mask.active = false;
        });

        this.chuPai.forEach(function (pai) {
            pai.destroy();
        });
        this.chuPai = [];

        this.baipai_ui_list.forEach(function (baipai_ui) {
            baipai_ui.clear();
        });
        this.baipai_ui_list = [];

        if (this.modepai) {
            this.modepai.node.active = false;

            //todo 朋友场 临时处理
            this.modepai.value.node.active = false;
            this.modepai.mask.active = false;
        }

        this.head.clear();
        if (!DeskData.Instance().isFriend()) {
            if (DeskData.Instance().isMatch() && DeskData.Instance().inJueSai) {
            } else {
                this.head.node.active = false;
                if (this.playerLocation) {
                    this.playerLocation.active = false;
                }
            }
        }

        // this.dgpt_ani.active = false;
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
        this.jbdga_ani_state(false);

        //关闭玩家详细界面
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_USERINFO);
    },

    /**
     * 更新指示器
     * @param last_id
     */
    updateZsq: function () {
        this.chuPai.forEach(function (jlmj_pai_node) {
            var jlmj_pai = jlmj_pai_node.getComponent('nmmj_pai');
            if (DeskData.Instance().last_chupai_id == jlmj_pai.cardId) {
                this.setZsq(jlmj_pai.node, this.viewIdx);
            }
        }.bind(this));
    },

    /**
     * 移除最后一张手牌
     */
    removeLastChupai: function () {
        var pai_node = this.chuPai.pop();
        if (pai_node) {
            pai_node.destroy();
        }

        DeskED.notifyEvent(DeskEvent.CLOSE_ZSQ, [this]);

        this.zhanshi_pai.node.active = false;
    },

    getDaPaiCfg: function () {
        switch (PlayerMgr.Instance().playerList.length) {
            case 3:
                return this.pai3dCfg.dapai_cfg_3;
            case 2:
                return this.pai3dCfg.dapai_cfg_2;
            default:
                return this.pai3dCfg.dapai_cfg;
        }
    },

    updateHeadUI: function () {
        var player = PlayerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if (player) {
            this.head.initUI(player);
        }
    },

    /**
     * 发牌动画时,隐藏手牌
     */
    hideShouPaiInFaPaiAction: function () {
        if (PlayerMgr.Instance().playing_fapai_ani) {
            for (var i = 0; i < this.shouPai.length; ++i) {
                this.shouPai[i].node.active = false;
            }
            this.modepai.node.active = false;
        }
    },

    onHeadCallfunc: function (event) {
        if (!this.head.node.active) {
            return;
        }
        var player = PlayerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        var playerInfo = PlayerBaseInfoMgr.findPlayerInfoById(player.userId);
        if (!DeskData.Instance().isMatch()) {
            playerInfo.info.coin = player.coin;
        }
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
            var user_info = ui.getComponent('nmmj_user_info_view');
            user_info.setData(RoomMgr.Instance().gameId,
                RoomMgr.Instance().roomId,
                RoomMgr.Instance().roomLv,
                DeskData.Instance().isFriend(),
                playerInfo.info);
            if (DeskData.Instance().isFriend()) {
                user_info.setGpsData(PlayerMgr.Instance().playerList);
            }
            user_info.show();
        }.bind(this));
    },

    dapai: function (player, chupai_idx_in_shoupai) {
        this.modepai.node.active = false;
        var jlmj_pai = this.createPai();
        if (!jlmj_pai) {
            return;
        }
        //this.node.addChild(jlmj_pai.node);
        this.chupai_node.addChild(jlmj_pai.node);
        this.chuPai.push(jlmj_pai.node);

        var player_list = PlayerMgr.Instance().playerList;
        var idx = player.chupai.length - 1;
        var cur_idx = this.chuPai.length - 1;
        var last_chupai_idx = this.chuPai.length - 1;
        if (player_list.length == 2) {
            // let count = DeskData.Instance().getIs2D() ? 19 : 18;
            // let total = 2;
            // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
            // var cur_pai = (this.chuPai.length - 1) % count;
            // var cur_id = pos_id * count + cur_pai;
            // cur_idx = cur_id;
            // last_chupai_idx = cur_id;
        }

        var value = player.chupai[idx];
        jlmj_pai.kaipai(this.getDaPaiCfg()['frame_' + cur_idx], this.getDaPaiCfg()['value_' + cur_idx], this.pai3dCfg.dapai_cfg, this.getDaPaiCfg()['liangzhang_' + cur_idx], this.getDaPaiCfg()['hunpai_' + cur_idx]);
        jlmj_pai.setValue(value);
        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 打牌:" + pai3d_value.desc[value] + " 快出牌:" + player.isQuick);
        //出牌动画
        this.stop_chupai_ani();
        if (player.isQuick) {
            this.play_chupai_ani(player, chupai_idx_in_shoupai, last_chupai_idx, value);
        } else {
            this.play_chupai_ani_old(player, chupai_idx_in_shoupai, last_chupai_idx, value);
        }
    },

    play_chupai_ani: function (player, chupai_idx_in_shoupai, last_chupai_idx, cardID) {
        //中间牌转变打牌end
        var mid2dapaiEnd = function () {
            this.mid2dapai_playing = false;
            this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[this.chuPai.length - 1].active = true;
            this.setZsq(this.chuPai[this.chuPai.length - 1], this.viewIdx);
            PlayerMgr.Instance().playerMoPaiAction();
        }.bind(this);

        //不同手牌数,不同可视配置
        var visible_cfgs = [];
        var shoupai_visible_cfg_right = {
            1: [6],
            4: [5, 6, 7, 8],
            7: [3, 4, 5, 6, 7, 8, 9],
            10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        var shoupai_visible_cfg_left = {
            1: [6],
            4: [5, 6, 7, 8],
            7: [3, 4, 5, 6, 7, 8, 9],
            10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        var shoupai_visible_cfg_up = {
            1: [12],
            4: [9, 10, 11, 12],
            7: [6, 7, 8, 9, 10, 11, 12],
            10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        visible_cfgs.push(shoupai_visible_cfg_right);
        visible_cfgs.push(shoupai_visible_cfg_up);
        visible_cfgs.push(shoupai_visible_cfg_left);
        var visible_cfg = visible_cfgs[player.viewIdx - 1];   //当前手牌可视配置
        var v_cfg = visible_cfg[player.shoupai.length];
        if (!v_cfg) {
            cc.error('手牌数量不正确' + player.shoupai.length, ' 座位号' + player.viewIdx);
            var id = PlayerMgr.Instance().shou2mid_id_list.pop();
            PlayerMgr.Instance().mid2dapai_id_list.push(id);

            if (PlayerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
                cc.dd._.pull(PlayerMgr.Instance().mid2dapai_id_list, cardID);
            }
            mid2dapaiEnd();
            return;
        }
        var lost_id = v_cfg[v_cfg.length - 1];
        if (player.state != PlayerState.TINGPAI && !player.replaying) { //非回放打牌时,随机出牌位置
            chupai_idx_in_shoupai = parseInt(cc.random0To1() * player.shoupai.length); //打牌后,此时牌数据已经少了一张
            cc.log('座位号=', player.viewIdx, '随机出牌位置=', chupai_idx_in_shoupai);
        } else {
            //回放,或听牌时的出牌位置
            cc.log('出牌索引', chupai_idx_in_shoupai);
        }

        var shoupai_idx = visible_cfg[player.shoupai.length][chupai_idx_in_shoupai];
        this.chuPai[this.chuPai.length - 1].active = false;
        this.zhanshi_pai.setValue(cardID);
        this.updateShouPai();

        cc.log('手牌-中间牌-start');
        this.zhanshi_pai.node.active = true;

        var id = PlayerMgr.Instance().shou2mid_id_list.pop();
        PlayerMgr.Instance().mid2dapai_id_list.push(id);

        if (PlayerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
            cc.log('下家正常摸牌了,播放入牌海动画');
            cc.dd._.pull(PlayerMgr.Instance().mid2dapai_id_list, cardID);
        }
        let config = this.getDaPaiCfg();

        this.zhanshi_pai.node.parent = this.chuPai[this.chuPai.length - 1].parent;

        let targetPos = cc.v2(config['frame_' + last_chupai_idx].x, config['frame_' + last_chupai_idx].y);
        this.zhanshi_pai.kaipai(config['frame_' + last_chupai_idx], config['value_' + last_chupai_idx], this.pai3dCfg.dapai_cfg);

        if (chupai_idx_in_shoupai == player.shoupai.length) { //打牌后,此时牌数据已经少了一张
            this.zhanshi_pai.node.x = this.modepai.node.x;
            this.zhanshi_pai.node.y = this.modepai.node.y;
        } else if (visible_cfg[player.shoupai.length]) {
            var idx = visible_cfg[player.shoupai.length][chupai_idx_in_shoupai];
            this.zhanshi_pai.node.x = this.shouPai[idx].node.x;
            this.zhanshi_pai.node.y = this.shouPai[idx].node.y;
        }
        this.zhanshi_pai.node.stopAllActions();

        var seq = cc.sequence(
            cc.callFunc(() => {
                // mj_audio.playAduio('effect_sendcard');
                mj_audio.playAduio('dapai');
            }),
            cc.moveTo(0.05, targetPos).easing(cc.easeQuarticActionOut(3.0)),
            cc.callFunc(mid2dapaiEnd.bind(this))
            // cc.callFunc(()=>{
            //     mj_audio.playAduio('dapai');
            // })
        );
        this.zhanshi_pai.node.runAction(seq);

        //插牌动画
        this.pluggedPai(player, shoupai_idx, lost_id);
    },

    play_chupai_ani_old: function (player, chupai_idx_in_shoupai, last_chupai_idx, cardID) {
        //中间牌转变打牌end
        var mid2dapaiEnd = function () {
            this.mid2dapai_playing = false;
            this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[this.chuPai.length - 1].active = true;
            this.setZsq(this.chuPai[this.chuPai.length - 1], this.viewIdx);
            PlayerMgr.Instance().playerMoPaiAction();
        }.bind(this);
        //中间牌转变打牌
        var mid2dapai = function () {
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('中间牌-打牌-start');
            if (this.chuPai.length <= 0) {
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            cc.resources.load(this.getMid2DaPaiAniPath() + last_chupai_idx, function (err, clip) {
                if (this.zhanshi_pai.cardId != cardID) {
                    cc.log("出牌动画-提前结束");
                    return;
                }
                setTimeout(function () {
                    this.mid2dapai_playing = true;
                }.bind(this), 10);
                this.zhanshi_pai.ani.removeClip('mid2dapai');
                this.zhanshi_pai.ani.addClip(clip, 'mid2dapai');
                this.zhanshi_pai.ani.play('mid2dapai');
                this.zhanshi_pai.ani.on('finished', mid2dapaiEnd);
                mj_audio.playAduio('dapai');
            }.bind(this));
        }.bind(this);
        //手牌转变中间牌end
        var shou2midEnd = function () {
            this.zhanshi_pai.ani.off('finished', shou2midEnd);
            if (this.zhanshi_pai.cardId != cardID) {
                PlayerMgr.Instance().playing_shou2mid_ani = false;
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('手牌-中间牌-end');
            if (DeskData.Instance().dabaoing) {   //打包中,暂停播放打牌动画
                // this.dapai_ani_paused = true;
                PlayerMgr.Instance().dabaoing_chupai_id = cardID;
                return;
            } else {
                setTimeout(function () {
                    PlayerMgr.Instance().playing_shou2mid_ani = false;
                    PlayerMgr.Instance().playerMoPaiAction();
                    if (PlayerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
                        cc.log('下家正常摸牌了,播放入牌海动画');
                        cc.dd._.pull(PlayerMgr.Instance().mid2dapai_id_list, cardID);
                        mid2dapai();
                    }
                }.bind(this), 300);
            }
        }.bind(this);

        //不同手牌数,不同可视配置
        var visible_cfgs = [];
        var shoupai_visible_cfg_right = {
            1: [6],
            4: [5, 6, 7, 8],
            7: [3, 4, 5, 6, 7, 8, 9],
            10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        var shoupai_visible_cfg_left = {
            1: [6],
            4: [5, 6, 7, 8],
            7: [3, 4, 5, 6, 7, 8, 9],
            10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        var shoupai_visible_cfg_up = {
            1: [12],
            4: [9, 10, 11, 12],
            7: [6, 7, 8, 9, 10, 11, 12],
            10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        visible_cfgs.push(shoupai_visible_cfg_right);
        visible_cfgs.push(shoupai_visible_cfg_up);
        visible_cfgs.push(shoupai_visible_cfg_left);
        var visible_cfg = visible_cfgs[player.viewIdx - 1];   //当前手牌可视配置
        var v_cfg = visible_cfg[player.shoupai.length];
        var lost_id = v_cfg[v_cfg.length - 1];
        if (player.state != PlayerState.TINGPAI && !player.replaying) { //非回放打牌时,随机出牌位置
            chupai_idx_in_shoupai = parseInt(cc.random0To1() * player.shoupai.length); //打牌后,此时牌数据已经少了一张
            cc.log('座位号=', player.viewIdx, '随机出牌位置=', chupai_idx_in_shoupai);
        } else {
            //回放,或听牌时的出牌位置
            cc.log('出牌索引', chupai_idx_in_shoupai);
        }

        var shoupai_idx = visible_cfg[player.shoupai.length][chupai_idx_in_shoupai];
        PlayerMgr.Instance().playing_shou2mid_ani = true;
        this.chuPai[this.chuPai.length - 1].active = false;
        this.zhanshi_pai.setValue(cardID);
        this.updateShouPai();
        this.zhanshi_pai.node.scalex = 0.3;
        this.zhanshi_pai.node.scaley = 0.3;

        this.zhanshi_pai.ani.on('finished', shou2midEnd);

        cc.log('手牌-中间牌-start');
        this.zhanshi_pai.node.active = true;
        this.zhanshi_pai.node.parent = this.zhanshi_pai_node;

        this.reset_zhanshi_pai();
        if (chupai_idx_in_shoupai == player.shoupai.length) { //打牌后,此时牌数据已经少了一张
            this.zhanshi_pai.node.x = this.modepai.node.x;
            this.zhanshi_pai.node.y = this.modepai.node.y;
        } else if (visible_cfg[player.shoupai.length]) {
            var idx = visible_cfg[player.shoupai.length][chupai_idx_in_shoupai];
            this.zhanshi_pai.node.x = this.shouPai[idx].node.x;
            this.zhanshi_pai.node.y = this.shouPai[idx].node.y;
        }
        this.zhanshi_pai.node.stopAllActions();
        var target_pos = [cc.v2(347, 93), cc.v2(0, 251), cc.v2(-338, 67)];
        var zsp_spa = cc.spawn(cc.scaleTo(0.03, 1, 1), cc.moveTo(0.03, target_pos[player.viewIdx - 1]));
        var seq = cc.sequence(zsp_spa, cc.delayTime(0.01), cc.callFunc(shou2midEnd.bind(this)), cc.delayTime(0.2));
        this.zhanshi_pai.node.runAction(seq);
        mj_audio.playAduio('effect_sendcard');

        //插牌动画
        this.pluggedPai(player, shoupai_idx, lost_id);
    },

    pluggedPai: function (player, kongpai_idx, lost_id) {
        //插牌动画
        if (player.state != PlayerState.TINGPAI && !player.replaying) {
            var paiShow = function () {
                if (player.state != PlayerState.TINGPAI && !player.replaying) {
                    this.modepai.node.active = false;
                    this.shouPai[kongpai_idx].node.active = true;
                    this.modepai.node.x = this.modepai.original_x;
                    this.modepai.node.y = this.modepai.original_y;
                }
            }.bind(this);
            this.modepai.original_x = this.modepai.node.x;
            this.modepai.original_y = this.modepai.node.y;

            this.chapai_x = this.shouPai[kongpai_idx].node.x;
            this.chapai_y = this.shouPai[kongpai_idx].node.y;

            this.modepai.node.active = true;
            this.shouPai[kongpai_idx].node.active = false;

            var len = lost_id;
            var sp_x = this.shouPai[len].node.x;
            var sp_y = this.shouPai[len].node.y;

            this.modepai.node.runAction(
                cc.sequence(
                    cc.delayTime(0.05),
                    cc.moveTo(0, sp_x, sp_y).easing(cc.easeSineInOut()),
                    // cc.delayTime(0.1),
                    cc.callFunc(paiShow.bind(this))
                ));

            for (var i = len; i > kongpai_idx; --i) {
                var pai = this.shouPai[i];
                var paiend = function () {
                    this.node.x = this.original_x;
                    this.node.y = this.original_y;
                    this.node.scaleX = this.original_sx;
                    this.node.scaleY = this.original_sy;
                }.bind(pai);
                pai.original_x = pai.node.x;
                pai.original_y = pai.node.y;

                pai.original_sx = pai.node.scaleX;
                pai.original_sy = pai.node.scaleY;
                pai.node.runAction(
                    cc.sequence(
                        cc.delayTime(0.05),
                        cc.spawn(
                            cc.moveTo(0, this.shouPai[i - 1].node.x, this.shouPai[i - 1].node.y).easing(cc.easeSineInOut()),
                            cc.scaleTo(0, this.shouPai[i - 1].node.scaleX, this.shouPai[i - 1].node.scaleY).easing(cc.easeSineInOut())
                        ),
                        // cc.delayTime(0.1),
                        cc.callFunc(paiend.bind(pai))
                    ));
            }
        }
    },

    /**
     * 播放中间牌->打牌动作
     */
    play_mid2dapai_ani: function (id) {
        if (!this.zhanshi_pai.node.active) {
            return;
        }

        if (this.zhanshi_pai.cardId != id) {
            return;
        }
        // this.dapai_ani_paused = false;
        //中间牌转变打牌end
        var mid2dapaiEnd = function () {
            this.mid2dapai_playing = false;
            this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                return;
            }
            var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[last_chupai_idx].active = true;
            this.setZsq(this.chuPai[last_chupai_idx], this.viewIdx);
            PlayerMgr.Instance().playerMoPaiAction();
        }.bind(this);
        //中间牌转变打牌
        var mid2dapai = function () {
            cc.log('中间牌-打牌-start');
            if (this.chuPai.length <= 0) {
                return;
            }
            setTimeout(function () {
                this.mid2dapai_playing = true;
            }.bind(this), 10);
            var player_list = PlayerMgr.Instance().playerList;
            var last_chupai_idx = this.chuPai.length - 1;
            if (player_list.length == 2) {
                // let count = DeskData.Instance().getIs2D() ? 19 : 18;
                // let total = 2;
                // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
                // var cur_pai = (this.chuPai.length - 1) % count;
                // last_chupai_idx = pos_id * count + cur_pai;
            }
            cc.resources.load(this.getMid2DaPaiAniPath() + last_chupai_idx, function (err, clip) {
                this.mid2dapai_playing = true;
                this.zhanshi_pai.ani.removeClip('mid2dapai');
                this.zhanshi_pai.ani.addClip(clip, 'mid2dapai');
                this.zhanshi_pai.ani.play('mid2dapai');
                this.zhanshi_pai.ani.on('finished', mid2dapaiEnd);
                mj_audio.playAduio('dapai');
            }.bind(this));
        }.bind(this);

        mid2dapai();
    },

    /**
     * 通知出牌指示器的变化
     */
    setZsq: function (paiNode, viewidx) {
        if (paiNode) {
            var zsq_pos = paiNode.getPosition();
            var offsetY = [40, 35, 40, 35];
            zsq_pos.y += offsetY[viewidx];
            DeskED.notifyEvent(DeskEvent.OPEN_ZSQ, [zsq_pos]);
        }
    },

    /**
     * 胡牌动画播放完成后的回调
     */
    onHuAniFinished: function () {
        this.huEffect.active = false;

        cc.log("胡牌动画完成");
        cc._pauseLMAni = false;
        DeskData.Instance().isPlayHuAni = false;
        if (DeskData.Instance().jiesuanData) {
            DeskData.Instance().jiesuan();
            DeskData.Instance().jiesuanData = null;
        }
        cc.gateNet.Instance().clearDispatchTimeout();
    },

    /**
     * 标记宝牌
     */
    biaojiBaoPai: function () {
        this.quXiaoBiaojiBaoPai();
        this.baobai_biaoji = [];
        if (DeskData.Instance().unBaopai >= 0) {
            if (UserPlayer.isBaoTing || UserPlayer.state == PlayerState.HUPAI) {
                this.baobai_biaoji = this.getPaiToID(DeskData.Instance().unBaopai);
                this.baobai_biaoji.forEach(function (pai) {
                    pai.setBaoPaiBiaoji(true);
                });
            }
        }
    },

    /**
     * 胡牌是 手牌也要标记
     * @param pai
     */
    biaojiBaoPaiInShouPai: function (pai) {
        if (DeskData.Instance().unBaopai >= 0) {
            if (Math.floor(pai.cardId / 4) == Math.floor(DeskData.Instance().unBaopai / 4)) {
                pai.setBaoPaiBiaoji(true);
            }
        }
    },

    setHeadCoin: function (coin) {
        this.head.setCoin(coin);
        if (DeskData.Instance().isJBC()) {
            this.head.showPochan();
        }
    },

    hu: function (player, isZiMo) {
        this.setShoupaiTouch(true);

        var huInfoList = [];    //索引越大,优先级越大
        huInfoList.push({ type: HuType.PING_HU, audio: ['dianpao1', 'hu1', 'hu2', 'hu3'] });           //平胡
        huInfoList.push({ type: HuType.JIA_HU, audio: ['jiahu1', 'jiahu2'] });         //夹胡
        huInfoList.push({ type: HuType.BIAN_HU, audio: ['hu1', 'hu2', 'hu3'] });        //边胡
        huInfoList.push({ type: HuType.QING_YI_SE, audio: ['qingyise1', 'qingyise2'] });     //清一色
        huInfoList.push({ type: HuType.PIAO_HU, audio: 'piaohu' });        //飘胡
        huInfoList.push({ type: HuType.QI_DUI, audio: '7dui' });         //七对
        huInfoList.push({ type: HuType.HAO_QI, audio: 'hh7dui' });         //豪七
        huInfoList.push({ type: HuType.ZHIZUN_HAO_QI, audio: 'hh7dui' });         //至尊豪七
        huInfoList.push({ type: HuType.GANG_HUA_HU, audio: 'gangkai' });          //杠上花
        huInfoList.push({ type: HuType.GANG_PAO_HU, audio: ['hu1', 'hu2', 'hu3'] });          //杠上炮
        huInfoList.push({ type: HuType.ZI_MO, audio: ['zimo1', 'zimo2'] });          //自摸
        huInfoList.push({ type: HuType.HAIDI_LAO, audio: ['hu1', 'hu2', 'hu3'] });          //一条龙
        huInfoList.push({ type: HuType.HAIDI_PAO, audio: '13yao' });          //十三幺




        var zimoHuList = [];
        zimoHuList.push({ type: HuType.ZI_MO, audio: ['zimo1', 'zimo2'] });          //自摸
        zimoHuList.push({ type: HuType.JIA_HU, audio: ['zimojia1', 'zimojia2', 'zimojia3', 'zimojia4'] });         //夹胡
        zimoHuList.push({ type: HuType.QING_YI_SE, audio: ['qingyise1', 'qingyise2'] });     //清一色
        zimoHuList.push({ type: HuType.PIAO_HU, audio: 'piaohu' });        //飘胡
        zimoHuList.push({ type: HuType.QI_DUI, audio: '7dui' });
        zimoHuList.push({ type: HuType.HAO_QI, audio: 'hh7dui' });         //豪七
        zimoHuList.push({ type: HuType.ZHIZUN_HAO_QI, audio: 'hh7dui' });         //至尊豪七
        zimoHuList.push({ type: HuType.HAIDI_LAO, audio: ['zimo1', 'zimo2'] });          //一条龙
        zimoHuList.push({ type: HuType.GANG_HUA_HU, audio: 'gangkai' });          //杠上花
        zimoHuList.push({ type: HuType.GANG_PAO_HU, audio: ['zimo1', 'zimo2'] });          //杠上炮
        zimoHuList.push({ type: HuType.HAIDI_PAO, audio: '13yao' });          //十三幺


        var zmHu = zimoHuList[0];
        zimoHuList.forEach(function (zmhu) {
            if (player.huTypeList.indexOf(zmhu.type) != -1) {
                zmHu = zmhu;
            }
        });

        var maxHu = huInfoList[0];
        huInfoList.forEach(function (hu) {
            if (player.huTypeList.indexOf(hu.type) != -1) {
                maxHu = hu;
            }
        });
        var huDes = [];
        player.huTypeList.forEach(function (type) {
            huDes.push(HuTypeDesc[type]);
        });

        // this.play_ani.play(maxHu.ani);
        // this.play_ani.on("finished", this.onHuAniFinished.bind(this));

        cc.log("所有胡牌类型:", player.huTypeList, huDes);
        cc.log('播放胡牌特效: ', HuTypeDesc[maxHu.type], maxHu.ani);
        if (maxHu.type == HuType.ZI_MO) {
            this.hupaiAni(zmHu, true);
            if (cc.dd._.isArray(zmHu.audio)) {
                let index = cc.dd.Utils.random(0, zmHu.audio.length - 1);
                zmHu.audio = zmHu.audio[index];
            }
            mj_audio.playAudioBySex(zmHu.audio, player.sex);
        } else {
            this.hupaiAni(maxHu);
            if (cc.dd._.isArray(maxHu.audio)) {
                let index = cc.dd.Utils.random(0, maxHu.audio.length - 1);
                maxHu.audio = maxHu.audio[index];
            }
            mj_audio.playAudioBySex(maxHu.audio, player.sex);
        }

        mj_audio.playAduio("hu");

        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 胡牌");
        cc.log("胡结束");
    },

    hupaiAni: function (maxHu, isZimo) {
        switch (maxHu.type) {
            case HuType.PING_HU:
            case HuType.JIA_HU:
            case HuType.BIAN_HU:
            case HuType.HAIDI_LAO:
            case HuType.ZI_MO:
            case HuType.QING_YI_SE:
                this.huEffect.active = true;
                this.playHusSpine(this.hu_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case HuType.GANG_PAO_HU:
                this.playSpine(this.gangshangpao_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case HuType.GANG_HUA_HU:
                this.playSpine(this.gangshanghua_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case HuType.QI_DUI:
                this.playSpine(this.qidui_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case HuType.HAO_QI:
            case HuType.ZHIZUN_HAO_QI:
                this.playSpine(this.haoqidui_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case HuType.PIAO_HU:
                this.playSpine(this.piaohu_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case HuType.HAIDI_PAO:
                this.playSpine(this.shisanyao_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            default:
                this.onHuAniFinished();
                break;
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        this._super(event, data);

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
            case PlayerEvent.PAOFEN:
                this.head.showPaoFen(data[1]);
                this.paofen(data[1]);
                break;
            case PlayerEvent.GUO:
                mj_audio.playAudioBySex('guo', player.sex);
                this.playSpine(this.guo_ani, ['play']);
                break;
        }
    },

    paofen(score) {
        // score = Number(score);
        // if(score <= 0){
        //     return;
        // }
        // let anim = [];
        // switch(score){
        //     case 2:
        //         anim.push('2fen');
        //         anim.push('2fenXS');
        //         break;
        //     case 3:
        //         anim.push('3fen');
        //         anim.push('3fenXS');
        //         break;
        //     case 4:
        //         anim.push('4fen');
        //         anim.push('4fenXS');
        //         break;
        //     case 5:
        //         anim.push('5fen');
        //         anim.push('5fenXS');
        //         break;
        // }
        //
        // this.playSpine(this.dgpt_ani, anim);
    },

    reset_zhanshi_pai: function () {
        let use2D = DeskData.Instance().getIs2D();
        if (use2D) {
            let pai2d = DeskData.Instance().get2DPai();
            if (pai2d == 'blue') {
                this.zhanshi_pai.getComponent(cc.Sprite).spriteFrame = this.zhanshi_pai.atlas_2d_blue.getSpriteFrame("ed_shoupai_ziji_li");
                this.zhanshi_pai.node.width = 97;
                this.zhanshi_pai.node.height = 138;
                this.zhanshi_pai.value.node.width = 72;
                this.zhanshi_pai.value.node.height = 97.36;
                this.zhanshi_pai.value.node.y = -9.68;
            } else if (pai2d == 'yellow') {
                this.zhanshi_pai.getComponent(cc.Sprite).spriteFrame = this.zhanshi_pai.atlas_2d_yellow.getSpriteFrame("ed_shoupai_ziji_li_y");
                this.zhanshi_pai.node.width = 97;
                this.zhanshi_pai.node.height = 138;
                this.zhanshi_pai.value.node.width = 72;
                this.zhanshi_pai.value.node.height = 97.36;
                this.zhanshi_pai.value.node.y = -9.68;
            } else {
                this.zhanshi_pai.getComponent(cc.Sprite).spriteFrame = this.zhanshi_pai.atlas_2d_green.getSpriteFrame("ed_shoupai_ziji_li");
                this.zhanshi_pai.node.width = 97;
                this.zhanshi_pai.node.height = 138;
                this.zhanshi_pai.value.node.width = 74;
                this.zhanshi_pai.value.node.height = 110;
                this.zhanshi_pai.value.node.y = -6;
            }
        } else {
            this.zhanshi_pai.getComponent(cc.Sprite).spriteFrame = this.zhanshi_pai.atlas.getSpriteFrame("d_shoupai_xia_dao_zhengmian");
            this.zhanshi_pai.node.width = 90;
            this.zhanshi_pai.node.height = 131;
            this.zhanshi_pai.value.node.width = 74;
            this.zhanshi_pai.value.node.height = 110;
            this.zhanshi_pai.value.node.y = -5.5;
        }

        this.zhanshi_pai.node.scaleX = 1;
        this.zhanshi_pai.node.scaleY = 1;
        this.zhanshi_pai.node.skewX = 0;
        this.zhanshi_pai.node.skewY = 0;
        this.zhanshi_pai.node.rotation = 0;

        this.zhanshi_pai.value.node.x = 0;
        this.zhanshi_pai.value.node.scaleX = 1;
        this.zhanshi_pai.value.node.scaleY = 1;
        this.zhanshi_pai.value.node.skewX = 0;
        this.zhanshi_pai.value.node.skewY = 0;
        this.zhanshi_pai.value.node.rotation = 0;
    },

    /**
     * @method 获取完整声音路径
     * @param {String} cfgName 配置文件名
     * @param {Number} fileCount 音效文件个数 用作1-n个范围随机某一个播放
     * @return {String} 完整声音路径
     */
    getFullSoundPath: function (cfgName, fileCount) {
        var sex = this.sex;

        // 做了一个特殊处理， 0和2都有可能是女的，男的确定是1
        if (sex != 1) {
            sex = 2;
        }
        var soundPath = "gameyj_mj_neimenggu/common/audio/audio/"
        var randomIdx = null;
        if (fileCount > 1) {
            randomIdx = cc.dd.Utils.random(1, fileCount);
        }
        var soundFile = cfgName + (randomIdx ? "_" + randomIdx : "") + "_s" + sex;
        var soundFormat = "";

        return soundPath + soundFile + soundFormat;
    },

    /**
     * 吃
     * @param data
     */
    chi: function (data) {

        var player = data[0];
        var baipai_data = data[1];

        this.resetBaiPai(player);
        this.updateShouPai(player);

        let _audio = ['chi1', 'chi2', 'chi3'];
        let index = cc.dd.Utils.random(0, _audio.length - 1);
        mj_audio.playAudioBySex(_audio[index], player.sex);
        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('chi',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);

        this.playSpine(this.chi_ani, ['play']);
    },

    /**
     * 碰
     */
    peng: function (data) {
        var player = data[0];
        var baipai_data = data[1];

        this.resetBaiPai(player);
        this.updateShouPai(player);
        let _audio = ['peng1', 'peng1', 'peng3', 'peng4'];
        let index = cc.dd.Utils.random(0, _audio.length - 1);
        mj_audio.playAudioBySex(_audio[index], player.sex);
        //this.play_ani.play("jlmj_peng_texiao");

        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('cha',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);

        this.playSpine(this.peng_ani, ['play']);
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
        let _audio = ['gang1', 'gang2', 'gang3', 'gang4'];
        let index = cc.dd.Utils.random(0, _audio.length - 1);
        mj_audio.playAudioBySex(_audio[index], player.sex);

        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.gang_ani, ['play']);
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
        let _audio = ['gang1', 'gang2', 'gang3', 'gang4'];
        let index = cc.dd.Utils.random(0, _audio.length - 1);
        mj_audio.playAudioBySex(_audio[index], player.sex);
        //this.play_ani.play("jlmj_andan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('andan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.gang_ani, ['play']);
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
        let _audio = ['gang1', 'gang2', 'gang3', 'gang4'];
        let index = cc.dd.Utils.random(0, _audio.length - 1);
        mj_audio.playAudioBySex(_audio[index], player.sex);
        //this.play_ani.play("jlmj_mingdan_texiao");

        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);
        this.playSpine(this.gang_ani, ['play']);
    },

    /**
     * 被胡
     */
    beihu: function (player) {
        var isChuPai = player[1];
        if (isChuPai) {
            var pai_node = this.chuPai.pop();
            if (pai_node) {
                pai_node.destroy();
            }

            DeskED.notifyEvent(DeskEvent.CLOSE_ZSQ, [this]);
        } {
            this.initBaiPai();
            this.resetBaiPai(player[0]);
        }
        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + "点炮");
    },

    /**
     * 被吃
     */
    beichi: function (player) {
        // this.removeLastChupai();
        this.updateChuPaiUI(player, false);
        DeskED.notifyEvent(DeskEvent.CLOSE_ZSQ, [this]);
        this.zhanshi_pai.node.active = false;


        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 被吃");
    },

    /**
     * 被碰
     */
    beipeng: function (data) {
        let player = data[0];
        // this.removeLastChupai();
        this.updateChuPaiUI(player, false);
        DeskED.notifyEvent(DeskEvent.CLOSE_ZSQ, [this]);
        this.zhanshi_pai.node.active = false;


        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 被碰");
    },

    /**
     * 被杠
     */
    beigang: function (data) {
        var player = data[0];
        // this.removeLastChupai();
        this.updateChuPaiUI(player, false);
        DeskED.notifyEvent(DeskEvent.CLOSE_ZSQ, [this]);
        this.zhanshi_pai.node.active = false;


        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 被杠");
    },

    hidewShouPai() {
        this.shouPai.forEach(function (pai) {
            pai.node.active = false;
            pai.value.node.active = false;
            pai.mask.active = false;
        });

        if (this.modepai) {
            this.modepai.node.active = false;
            this.modepai.value.node.active = false;
            this.modepai.mask.active = false;
        }
    },

    playHusSpine(spine, animList, func) {
        if (spine) {
            spine.node.active = true;
            for (let i = 0; i < animList.length - 1; i++) {
                spine.setMix(animList[i], animList[i + 1]);
            }
            let anim = animList.shift();
            spine.setAnimation(0, anim, false);
            spine.setCompleteListener(() => {
                if (animList.length > 0) {
                    anim = animList.shift();
                    spine.setAnimation(0, anim, false);
                } else {
                    // spine.node.active = false;
                    if (func) {
                        func();
                    }
                }
            });
        } else if (func) {
            func();
        }

    },

    /**
     * 垂直居中对齐
     */
    shouPaiAlignCenterV: function () {
        var offset_y = this.getAlignCenterOffsetY();
        let _offset_y = DeskData.Instance().getIs2D() ? 0 : 0.18;
        //左右玩家 计算x轴偏移
        if (this.viewIdx == 1) {
            var offset_x = -offset_y * _offset_y;
        } else {
            var offset_x = offset_y * _offset_y;
        }
        this.baipai_ui_list.forEach(function (baipai_ui) {
            baipai_ui.pais.forEach(function (pai) {
                pai.node.y += offset_y;
                pai.node.x += offset_x;
            });
        });
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (this.shouPai[i].node.active) {
                this.shouPai[i].node.y += offset_y;
                this.shouPai[i].node.x += offset_x;
            }
        }
        if (this.modepai.node.active) {
            this.modepai.node.y += offset_y;
            this.modepai.node.x += offset_x;
        }
    },
});
