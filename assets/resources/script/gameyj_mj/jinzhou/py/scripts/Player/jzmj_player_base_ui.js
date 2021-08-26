var DeskData = require('jzmj_desk_data').DeskData;
var DeskEvent = require('jzmj_desk_data').DeskEvent;
var DeskED = require('jzmj_desk_data').DeskED;

var HuType = require('jlmj_define').HuType;
var HuTypeDesc = require('jlmj_define').JZHuTypeDesc;

var mj_audio = require('mj_audio');

var jlmj_player_base_ui = require('jlmj_player_base_ui');
var jlmj_prefab = require('jlmj_prefab_cfg');

var PlayerState = require("jzmj_player_data").PlayerState;
var PlayerMgr = require('jzmj_player_mgr');
var PlayerBaseInfoMgr = require('hall_common_data').PlayerBaseInfoMgr.getInstance();
var pai3d_value = require('jlmj_pai3d_value');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var UserPlayer = require('jzmj_userPlayer_data').Instance();

var SysEvent = require("com_sys_data").SysEvent;
var PlayerEvent = require("jlmj_player_data").PlayerEvent;
var BaipaiType = require("jlmj_baipai_data").BaipaiType;
const paiType = require('jlmj_gang_pai_type').CardType;

cc.Class({
    extends: jlmj_player_base_ui,

    properties: {
        head: { default: null, type: require("jzmj_playerHead"), tooltip: '头像', override: true },              //头像
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
            pai.setHunPai(false);
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
            this.modepai.setHunPai(false);

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
        // this.xiaosa_ani.node.active = false;
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
        this.zhanshi_pai.kaipai(config['frame_' + last_chupai_idx], config['value_' + last_chupai_idx], this.pai3dCfg.dapai_cfg, null, config['hunpai_' + last_chupai_idx]);

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
        huInfoList.push({ type: HuType.JIANG_DUI, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });//穷胡
        huInfoList.push({ type: HuType.JIA_HU, ani: ['jiahu', 'jiahuXS'], audio: 'dianpao_hu' });         //夹胡
        huInfoList.push({ type: HuType.BIAN_HU, ani: ['bianhu', 'bianhuXS'], audio: 'dianpao_hu' });        //边胡
        huInfoList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'dianpao_hu' });     //清一色
        huInfoList.push({ type: HuType.PIAO_HU, ani: ['animation'], audio: 'dianpao_hu' });        //飘胡
        huInfoList.push({ type: HuType.JIA5_HU, ani: ['animation'], audio: 'dianpao_hu' });//单飘
        huInfoList.push({ type: HuType.KANDUI_BAO, ani: ['animation'], audio: 'dianpao_hu' });//双飘
        huInfoList.push({ type: HuType.QI_DUI, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });         //七对
        huInfoList.push({ type: HuType.QIANG_HU, ani: ['qiangganghu', 'qiangganghuXS'], audio: 'dianpao_hu' });//抢杠胡
        huInfoList.push({ type: HuType.GANG_PAO_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });//杠上炮
        huInfoList.push({ type: HuType.DANDIAO_PIAOHU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });//海底捞月
        huInfoList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        huInfoList.push({ type: HuType.MO_BAO, ani: ['loubao'], audio: 'mobao' });         //摸宝
        huInfoList.push({ type: HuType.DUI_BAO, ani: ['duibao'], audio: 'duibao' });        //对宝
        huInfoList.push({ type: HuType.TIAN_HU, ani: ['tianhu'], audio: 'zimo' });        //天胡
        huInfoList.push({ type: HuType.XIAO_SA, ani: ['ditu'], audio: 'dianpao_hu' });        //地胡



        var zimoHuList = [];
        zimoHuList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        zimoHuList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'zimo' });     //清一色
        zimoHuList.push({ type: HuType.PIAO_HU, ani: ['animation'], audio: 'zimo' });        //飘胡
        zimoHuList.push({ type: HuType.JIA5_HU, ani: ['animation'], audio: 'zimo' });//单飘
        zimoHuList.push({ type: HuType.KANDUI_BAO, ani: ['animation'], audio: 'zimo' });//双飘
        zimoHuList.push({ type: HuType.QI_DUI, ani: ['zimo', 'zimoXS'], audio: 'zimo' });
        zimoHuList.push({ type: HuType.TIAN_HU, ani: ['tianhu'], audio: 'zimo' });        //天胡

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

    hupaiAni: function (maxHu, isZimo) {
        switch (maxHu.type) {
            case HuType.PING_HU:
            case HuType.JIANG_DUI:
            case HuType.JIA_HU:
            case HuType.BIAN_HU:
            case HuType.GANG_PAO_HU:
            case HuType.DANDIAO_PIAOHU:
            case HuType.QIANG_HU:
            case HuType.QI_DUI:
            case HuType.QUAN_19:
                if (isZimo) {
                    this.playSpine(this.dgpt_ani, maxHu.ani, this.onHuAniFinished.bind(this));
                } else {
                    this.playSpine(this.cpgtgh_ani, maxHu.ani, this.onHuAniFinished.bind(this));
                }
                break;
            case HuType.PIAO_HU:
            case HuType.JIA5_HU:
            case HuType.KANDUI_BAO:
                this.playSpine(this.piaohu_ani, maxHu.ani, this.onHuAniFinished.bind(this));
                break;
            case HuType.ZI_MO:
                this.playSpine(this.dgpt_ani, maxHu.ani, this.onHuAniFinished.bind(this));
                break;
            case HuType.QING_YI_SE:
            case HuType.MO_BAO:
            case HuType.DUI_BAO:
            case HuType.TIAN_HU:
            case HuType.XIAO_SA:
                this.playSpine(this.qys_ani, maxHu.ani, this.onHuAniFinished.bind(this));
                break;
            default:
                this.onHuAniFinished();
                break;
        }
    },

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
            case PlayerEvent.LIANGPAI:
                this.langpai(data);
                break;
        }

        this._super(event, data);
    },

    /**
     * 亮牌杠
     */
    langpai: function (data) {
        var player = data[0];
        var baipai_data = data[1];

        this.resetBaiPai(player);
        this.updateShouPai(player);
        mj_audio.playAudioBySex("mingDan", player.sex);
        //this.play_ani.play("jlmj_peng_texiao");

        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);
        this.playSpine(this.dgpt_ani, ['mingdan', 'mingdanXS']);
    },

    /**
     * 重置摆牌
     */
    resetBaiPai: function (playerData) {
        cc.log("重置摆牌");
        this.isResetBaiPai = true;
        var arrBaiPaiData = playerData.baipai_data_list;

        this.need_offsetX = false;

        arrBaiPaiData.forEach(function (baipai) {
            if (baipai.type != BaipaiType.CHI && baipai.cardIds.length > 3) {
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
            if (baipai.type == BaipaiType.BAGANG || baipai.type == BaipaiType.DIANGANG) {
                if (baipai_ui.pais.length == 3) {
                    this._setbaipaiValue(baipai_ui.pais, baipai, playerData);
                } else {
                    this._setMingGang(baipai_ui.pais, baipai, playerData);
                }
            } else if (baipai.type == BaipaiType.ANGANG) {
                this._setAngGang(baipai_ui.pais, baipai, playerData);
            } else {
                this._setbaipaiValue(baipai_ui.pais, baipai, playerData);
            }

            if (baipai.type == BaipaiType.CHI) {//如果是吃牌就要判断 中发白
                this.setZFB_chi(baipai, baipai_ui.pais, baipai.mj_index, playerData);
            }
        }.bind(this));
        this.updateXiaoJiCnt(playerData);//小鸡飞蛋

        if (playerData.viewIdx == 1 || playerData.viewIdx == 3) {
            if (playerData.state != PlayerState.HUPAI && playerData.getBaiPaiNum() >= 16) {
                //第16,17张牌,摆牌居中
                this.baiPaiAlignCenterV();
            }
        }

        this.isResetBaiPai = false;
        if (this.needUpdateShouPai) {
            this.needUpdateShouPai = false;
            this.updateShouPai();
        }
    },

    /**
     * 暗杠展示
     */
    _setAngGang: function (pais, baipai, player) {
        // if(!player.isUserPlayer() && player.state == PlayerState.HUPAI){
        //     //结算时,其他玩家暗杠布局,使用openAnGang
        //     return;
        // }
        var use_kaipai_cfg = false;
        if (player.isUserPlayer() && player.state == PlayerState.HUPAI) {
            //自家摆牌结算时使用开牌配置
            use_kaipai_cfg = true;
        }

        var idAndCnts = baipai.getShowPaiList();
        var mj_index = baipai.mj_index;
        if (player.viewIdx == 1 || player.viewIdx == 3) {
            if (player.state != PlayerState.HUPAI && player.getBaiPaiNum() <= 13) {
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
            let cankaipai = false;
            let kaipaidata = null;

            if (pais.length == 3) {
                if (idx == 1) {
                    if (player.kaipai_an_gang_list.length > 0) {
                        for (var id in player.kaipai_an_gang_list) {
                            let gang_data = player.kaipai_an_gang_list[id];
                            if (gang_data.show) {
                                cankaipai = gang_data.isBaoPai;
                                kaipaidata = gang_data;
                                break;
                            }
                        }
                    }
                    if (idAndCnts[idx].id != -1) {  //有值就显示, 幺鸡,二筒,八万的暗杠需要显示出来
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_cfg : this.pai3dCfg.baipai_open_down_cfg;
                        jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + idx)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + idx)]);
                        jlmj_pai.setValue(idAndCnts[idx].id);
                        jlmj_pai.setCnt(idAndCnts[idx].cnt);
                    } else if (cankaipai && kaipaidata) { //结算时打开其他玩家暗杠
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_cfg : this.pai3dCfg.baipai_open_down_cfg;
                        jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + idx)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + idx)]);

                        jlmj_pai.setValue(kaipaidata.value);
                        kaipaidata.show = false;
                        //jlmj_pai.setValue(player.kaipai_an_gang_list[player.kaipai_an_gang_show_idx]);
                        //player.kaipai_an_gang_show_idx++;
                        jlmj_pai.setCnt(1);
                    } else {
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_close_cfg : this.pai3dCfg.baipai_close_down_cfg;
                        jlmj_pai.daopai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj);
                    }
                } else {
                    jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_close_cfg : this.pai3dCfg.baipai_close_down_cfg;
                    jlmj_pai.daopai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj);
                }
            } else {
                //3+1
                if (idx == 0) {
                    if (player.kaipai_an_gang_list.length > 0) {
                        for (var id in player.kaipai_an_gang_list) {
                            let gang_data = player.kaipai_an_gang_list[id];
                            if (gang_data.show) {
                                cankaipai = !gang_data.isBaoPai;
                                kaipaidata = gang_data;
                                break;
                            }
                        }
                    }
                    // if (player.isUserPlayer()) {
                    if (idAndCnts[idx].id != -1) {  //有值就显示, 幺鸡,二筒,八万的暗杠需要显示出来
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_up_cfg : this.pai3dCfg.baipai_open_up_cfg;
                        jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + 1)], jlmj_pai.cfgArrObj['value_' + (mj_index + 1)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + 1)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + 1)]);
                        jlmj_pai.setValue(idAndCnts[idx].id);
                        jlmj_pai.setCnt(idAndCnts[idx].cnt);
                    }
                    else if (cankaipai && kaipaidata) { //结算时打开其他玩家暗杠
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_up_cfg : this.pai3dCfg.baipai_open_up_cfg;
                        jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + 1)], jlmj_pai.cfgArrObj['value_' + (mj_index + 1)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + 1)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + 1)]);

                        jlmj_pai.setValue(kaipaidata.value);
                        kaipaidata.show = false;
                        //jlmj_pai.setValue(player.kaipai_an_gang_list[player.kaipai_an_gang_show_idx]);
                        //player.kaipai_an_gang_show_idx++;
                        jlmj_pai.setCnt(1);
                    }
                    else {
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_close_up_cfg : this.pai3dCfg.baipai_close_up_cfg;
                        jlmj_pai.daopai(jlmj_pai.cfgArrObj['frame_' + (mj_index + 1)], jlmj_pai.cfgArrObj);
                    }
                } else {
                    jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_close_cfg : this.pai3dCfg.baipai_close_down_cfg;
                    jlmj_pai.daopai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx - 1)], jlmj_pai.cfgArrObj);
                }
            }


            this.updateBaiPaiSpace(jlmj_pai, baipai, player);
            if (this.need_offsetX === true) {
                jlmj_pai.node.x -= 76;
            }
        }
    },
});
