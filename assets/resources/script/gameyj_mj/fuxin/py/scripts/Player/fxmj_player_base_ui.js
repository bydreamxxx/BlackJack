var DeskData = require('fxmj_desk_data').DeskData;
var DeskEvent = require('fxmj_desk_data').DeskEvent;
var DeskED = require('fxmj_desk_data').DeskED;

var HuType = require('jlmj_define').HuType;
var HuTypeDesc = require('jlmj_define').HuTypeDesc;

var mj_audio = require('mj_audio');

var jlmj_player_base_ui = require('jlmj_player_base_ui');
var jlmj_prefab = require('jlmj_prefab_cfg');

var PlayerState = require("fxmj_player_data").PlayerState;
var PlayerEvent = require("fxmj_player_data").PlayerEvent;
var PlayerMgr = require('fxmj_player_mgr');
var PlayerBaseInfoMgr = require('hall_common_data').PlayerBaseInfoMgr.getInstance();
var pai3d_value = require('jlmj_pai3d_value');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var SysEvent = require("com_sys_data").SysEvent;

var UserPlayer = require('fxmj_userPlayer_data').Instance();
cc.Class({
    extends: jlmj_player_base_ui,

    properties: {
        head: { default: null, type: require("fxmj_playerHead"), tooltip: '头像', override: true },              //头像
    },
    initUI: function (_player) {
        this.clear();
        var player = cc.dd._.isNull(_player) || cc.dd._.isUndefined(_player) ? PlayerMgr.Instance().getPlayerByViewIdx(this.viewIdx) : _player;
        if (player) {
            cc.log('玩家UI 初始化 视觉座位号:' + this.viewIdx);
            this.node.active = true;
            this.head.node.active = true;
            this.head.initUI(player);
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
        if (DeskData.Instance().isJBC()) {
            this.head.node.active = false;
        }

        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        this.xiaosa_ani.node.active = false;
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
            var jlmj_pai = jlmj_pai_node.getComponent('jlmj_pai');
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
        playerInfo.info.coin = player.coin;
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
            var user_info = ui.getComponent('user_info_view');
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
                }.bind(this), 200);
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
        // PlayerMgr.Instance().playing_shou2mid_ani = true;
        this.chuPai[this.chuPai.length - 1].active = false;
        this.zhanshi_pai.setValue(cardID);
        this.updateShouPai();
        // this.zhanshi_pai.node.scalex = 0.3;
        // this.zhanshi_pai.node.scaley = 0.3;

        // this.zhanshi_pai.ani.on('finished', shou2midEnd);

        cc.log('手牌-中间牌-start');
        this.zhanshi_pai.node.active = true;
        // this.reset_zhanshi_pai();
        // if (chupai_idx_in_shoupai == player.shoupai.length) { //打牌后,此时牌数据已经少了一张
        //     this.zhanshi_pai.node.x = this.modepai.node.x;
        //     this.zhanshi_pai.node.y = this.modepai.node.y;
        // } else if (visible_cfg[player.shoupai.length]) {
        //     var idx = visible_cfg[player.shoupai.length][chupai_idx_in_shoupai];
        //     this.zhanshi_pai.node.x = this.shouPai[idx].node.x;
        //     this.zhanshi_pai.node.y = this.shouPai[idx].node.y;
        // }
        // this.zhanshi_pai.node.stopAllActions();
        // var target_pos = [cc.v2(347, 93), cc.v2(0, 251), cc.v2(-338, 67)];
        // var zsp_spa = cc.spawn(cc.scaleTo(0.03, 1, 1), cc.moveTo(0.03, target_pos[player.viewIdx - 1]));
        // var seq = cc.sequence(zsp_spa, cc.delayTime(0.03), cc.callFunc(shou2midEnd.bind(this)), cc.delayTime(0.2));
        // this.zhanshi_pai.node.runAction(seq);
        // mj_audio.playAduio('effect_sendcard');

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
            cc.moveTo(0.2, targetPos).easing(cc.easeQuarticActionOut(3.0)),
            cc.callFunc(mid2dapaiEnd.bind(this))
            // cc.callFunc(()=>{
            //     mj_audio.playAduio('dapai');
            // })
        );
        this.zhanshi_pai.node.runAction(seq);

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
                cc.sequence(cc.delayTime(0.3),
                    cc.moveTo(0.1, sp_x, sp_y).easing(cc.easeSineInOut()),
                    cc.delayTime(0.1),
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
                    cc.sequence(cc.delayTime(0.3),
                        cc.spawn(
                            cc.moveTo(0.1, this.shouPai[i - 1].node.x, this.shouPai[i - 1].node.y).easing(cc.easeSineInOut()),
                            cc.scaleTo(0.1, this.shouPai[i - 1].node.scaleX, this.shouPai[i - 1].node.scaleY).easing(cc.easeSineInOut())
                        ),
                        cc.delayTime(0.1),
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
            }.bind(this), 200);
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
        cc.log("胡牌动画完成");
        cc._pauseLMAni = false;
        DeskData.Instance().isPlayHuAni = false;
        DeskData.Instance().jiesuan();
        DeskData.Instance().jiesuanData = null;
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
        huInfoList.push({ type: HuType.PING_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });           //平胡
        huInfoList.push({ type: HuType.JIA_HU, ani: ['jiahu', 'jiahuXS'], audio: 'jiahu' });         //夹胡
        huInfoList.push({ type: HuType.BIAN_HU, ani: ['bianhu', 'bianhuXS'], audio: 'dianpao_hu' });        //边胡
        huInfoList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'dianpao_hu' });     //清一色
        huInfoList.push({ type: HuType.PIAO_HU, ani: ['animation'], audio: 'dianpao_hu' });        //飘胡
        huInfoList.push({ type: HuType.QI_DUI, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });         //七对
        huInfoList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        huInfoList.push({ type: HuType.MO_BAO, ani: ['loubao'], audio: 'mobao' });         //摸宝
        huInfoList.push({ type: HuType.DUI_BAO, ani: ['duibao'], audio: 'duibao' });        //对宝
        huInfoList.push({ type: HuType.TIAN_HU, ani: ['tianhu'], audio: 'dianpao_hu' });        //天胡
        huInfoList.push({ type: HuType.DANDIAO_PIAOHU, ani: ['animation'], audio: 'dianpao_hu' });        //单吊飘胡

        var zimoHuList = [];
        zimoHuList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        zimoHuList.push({ type: HuType.JIA_HU, ani: ['zimo', 'zimoXS'], audio: 'zimojia' });         //夹胡
        zimoHuList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'zimo' });     //清一色
        zimoHuList.push({ type: HuType.PIAO_HU, ani: ['animation'], audio: 'zimo' });        //飘胡
        zimoHuList.push({ type: HuType.QI_DUI, ani: ['zimo', 'zimoXS'], audio: 'zimo' });

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
            mj_audio.playAudioBySex(zmHu.audio, player.sex);
        } else {
            this.hupaiAni(maxHu);
            mj_audio.playAudioBySex(maxHu.audio, player.sex);
        }


        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 胡牌");
        cc.log("胡结束");
    },


    /**
     * 潇洒
     * @param data
     */
    xiaosa: function (player) {
        this.updateShouPai(player);
        mj_audio.playAudioBySex("xiaosa", player.sex);
        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('ting',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);

        this.playSpine(this.xiaosa_ani, ['xiaosa', 'xiaosaXS']);
    },

    chiTing: function (player, isxiaosa) {
        this.resetBaiPai(player);
        this.updateShouPai(player);
        mj_audio.playAudioBySex("ting", player.sex);
        // this.db_hu_4.node.active = true;
        // this.db_hu_4.setAnimation(0,"chitingCX",false);
        // this.db_hu_4.scheduleOnce(function () {
        //     this.db_hu_4.clearTracks();
        //     this.db_hu_4.node.active = false;
        //     cc.log("tcp call back ---------");
        // }.bind(this), 2);

        this.playSpine(this.dgpt_ani, ['chiting', 'chitingXS']);

        if (isxiaosa) {
            setTimeout(function () {
                mj_audio.playAudioBySex("xiaosa", player.sex);
            }, 1700);
        }
    },

    pengTing: function (player, isxiaosa) {
        this.resetBaiPai(player);
        this.updateShouPai(player);
        mj_audio.playAudioBySex("ting", player.sex);
        // this.db_hu_4.node.active = true;
        // this.db_hu_4.setAnimation(0,"bengtingCX",false);
        // this.db_hu_4.scheduleOnce(function () {
        //     this.db_hu_4.clearTracks();
        //     this.db_hu_4.node.active = false;
        //     cc.log("tcp call back ---------");
        // }.bind(this), 2);
        this.playSpine(this.dgpt_ani, ['pengting', 'pengtingXS']);
        if (isxiaosa) {
            setTimeout(function () {
                mj_audio.playAudioBySex("xiaosa", player.sex);
            }, 1700);
        }
    },

    gangTing: function (player, isxiaosa) {
        this.resetBaiPai(player);
        this.updateShouPai(player);
        mj_audio.playAudioBySex("ting", player.sex);
        // this.db_hu_4.node.active = true;
        // this.db_hu_4.setAnimation(0,"gangtingCX",false);
        // this.db_hu_4.scheduleOnce(function () {
        //     this.db_hu_4.clearTracks();
        //     this.db_hu_4.node.active = false;
        //     cc.log("tcp call back ---------");
        // }.bind(this), 2);
        this.playSpine(this.dgpt_ani, ['gangting', 'gangtingXS']);
        if (isxiaosa) {
            setTimeout(function () {
                mj_audio.playAudioBySex("xiaosa", player.sex);
            }, 1700);
        }
    },
    /**
     * 被胡
     */
    beihu: function (player) {
        var isChuPai = player[1];
        if (isChuPai) {
            this.removeLastChupai();
        } {
            this.initBaiPai();
            this.resetBaiPai(player[0]);
        }
        //this.play_ani.play("jlmj_dianpao_texiao");
        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + "点炮");
        if (player[0].isBaoTing || player[0].isXiaosa) {
            return;
        }
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('dianpao',1);
        this.playSpine(this.dgpt_ani, ['dianpao', 'dianpaoXS']);
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

        mj_audio.playAudioBySex("gang", player.sex);
        // this.db_hu_5.node.active = true;
        // this.db_hu_5.setAnimation(0,"angangCX",false);
        // this.db_hu_5.scheduleOnce(function () {
        //     this.db_hu_5.clearTracks();
        //     this.db_hu_5.node.active = false;
        //     cc.log("angang call back ---------");
        // }.bind(this), 2);
        this.playSpine(this.dgpt_ani, ['angang', 'angangXS']);
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
        mj_audio.playAudioBySex("gang", player.sex);
        // this.db_hu_5.node.active = true;
        // this.db_hu_5.setAnimation(0,"gangCX",false);
        // this.db_hu_5.scheduleOnce(function () {
        //     this.db_hu_5.clearTracks();
        //     this.db_hu_5.node.active = false;
        //     cc.log("gang call back ---------");
        // }.bind(this), 2);
        this.playSpine(this.cpgtgh_ani, ['gang', 'gangXS']);
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
        if (!data[2]) {
            return;
        }
        mj_audio.playAudioBySex("gang", player.sex);
        // this.db_hu_5.node.active = true;
        // this.db_hu_5.setAnimation(0,"gangCX",false);
        // this.db_hu_5.scheduleOnce(function () {
        //     this.db_hu_5.clearTracks();
        //     this.db_hu_5.node.active = false;
        //     cc.log("gang call back ---------");
        // }.bind(this), 2);
        this.playSpine(this.cpgtgh_ani, ['gang', 'gangXS']);
        cc.log("吧杠结束");
    },

    genzhuang: function () {
        if (!RoomMgr.Instance()._Rule.genzysindex || DeskData.Instance().is_genzhuang) {
            return;
        }
        var player_list = PlayerMgr.Instance().playerList;
        var z_pai = player_list[0].chupai[0];
        for (let i = 0, len = player_list.length; i < len; ++i) {
            var player_info = player_list[i];
            if (player_info.baipai_data_list.length != 0 || player_info.chupai.length > 1 ||
                !z_pai || Math.floor(z_pai / 4) != Math.floor(player_info.chupai[0] / 4)) {
                return;
            }
        }
        var player = PlayerMgr.Instance().getPlayer(cc.dd.user.id);
        mj_audio.playAudioBySex("genzhuangyoushang", player.sex);
        DeskData.Instance().is_genzhuang = true;
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
            case PlayerEvent.SHOW_GU_PAI:
                this.showDaPaiGu(data[1], data[2], data[3]);
                break;
            case PlayerEvent.CHITING:
                this.chiTing(data[0], data[1]);
                this.head.setTing(data[1] == false);
                this.head.setXiaoSa(data[1]);
                break;
            case PlayerEvent.PENGTING:
                this.pengTing(data[0], data[1]);
                this.head.setTing(data[1] == false);
                this.head.setXiaoSa(data[1]);
                break;
            case PlayerEvent.GANGTING:
                this.gangTing(data[0], data[1]);
                this.head.setTing(data[1] == false);
                this.head.setXiaoSa(data[1]);
                break;
            case PlayerEvent.XIAOSA:
                this.xiaosa(player);
                this.head.setXiaoSa(true);
                break;
            case PlayerEvent.GENZHUANG:
                this.genzhuang();
                break;
            case PlayerEvent.CHGANG:
                this.caiHonggang(data);
                break;
            default:
                break;
        }
    },
});
