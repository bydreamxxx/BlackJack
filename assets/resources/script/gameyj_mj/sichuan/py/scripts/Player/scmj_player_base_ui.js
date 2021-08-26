var DeskData = require('scmj_desk_data').DeskData;
var DeskEvent = require('scmj_desk_data').DeskEvent;
var DeskED = require('scmj_desk_data').DeskED;

var HuType = require('jlmj_define').HuType;
var HuTypeDesc = require('jlmj_define').SCHuTypeDesc;

var mj_audio = require('mj_audio');

var jlmj_player_base_ui = require('jlmj_player_base_ui');
var jlmj_prefab = require('jlmj_prefab_cfg');

var PlayerState = require("scmj_player_data").PlayerState;
var PlayerEvent = require("scmj_player_data").PlayerEvent;
var PlayerMgr = require('scmj_player_mgr');
var PlayerBaseInfoMgr = require('hall_common_data').PlayerBaseInfoMgr.getInstance();
var pai3d_value = require('jlmj_pai3d_value');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var SysEvent = require("com_sys_data").SysEvent;

var UserPlayer = require('scmj_userPlayer_data').Instance();

var BaipaiType = require("jlmj_baipai_data").BaipaiType;

cc.Class({
    extends: jlmj_player_base_ui,

    properties: {
        head: { default: null, type: require("scmj_playerHead"), tooltip: '头像', override: true },              //头像
        winFont: cc.Font,
        lostFont: cc.Font,
        huLabel: cc.Prefab,
        jiantouPrefab: cc.Prefab,
        huSpriteFrame: [cc.SpriteFrame],
        huTypeSpriteFrame: [cc.SpriteFrame],
    },
    initUI: function (_player) {
        this.clear();
        var player = cc.dd._.isNull(_player) || cc.dd._.isUndefined(_player) ? PlayerMgr.Instance().getPlayerByViewIdx(this.viewIdx) : _player;
        if (player) {
            cc.log('玩家UI 初始化 视觉座位号:' + this.viewIdx + " id = " + player.userId);
            this.node.active = true;
            this.head.node.active = true;
            this.head.initUI(player);
            this.updateChuPaiUI(player, PlayerMgr.Instance().playerList.length == 2);
            this.resetBaiPai(player);
            this.quxiaoBiaoJIBaoPaiInShouPai();
            this.updateShouPai(player);
            this.updateZsq();
            this.updateZhanshiPai();

            this.setTips(false);

            let userPlayer = PlayerMgr.Instance().getUserPlayer();
            if (!userPlayer.bready) {
                this.setDingQue(player.dingQue);

                for (let i = 0; i < player.huList.length; i++) {
                    this.addHuPai(player.huList[i].id);
                }
            }

            if (player.huTypeList && player.huTypeList.length > 0 && !userPlayer.bready) {
                this.hu(player, this.isZiMo(player.huTypeList), true);

                let jiesuan_ui = cc.dd.UIMgr.getUI(jlmj_prefab.SCMJ_JIESUAN);
                if (player.userId == cc.dd.user.id && (!jiesuan_ui || !jiesuan_ui.active) && !RoomMgr.Instance()._Rule.isxueliu && !DeskData.Instance().isFriend()) {
                    DeskData.Instance().canLeave = true;
                    let btn = cc.find('Canvas/desk_node/jixuBtn');
                    if (btn) {
                        btn.active = true;
                    }
                }
            }

            if (this.score) {
                this.score.node.stopAllActions();
                this.score.node.active = false;
            }
        }
    },

    /**
     * 清理
     * @param data
     */
    clear: function (data) {
        cc.log("player_ui 清理桌子");

        this.scoreList = [];

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

        if (this.hu_timeout) {
            clearTimeout(this.hu_timeout);
            this.hu_timeout = null;
        }

        this.db_hu_5.node.active = false;
        this.db_hu_6.node.active = false;
        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        // this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;
        this.hutype_ani.node.active = false;

        this.jbdga_ani_state(false);

        this.huNode.removeAllChildren(true);
        this.huNode.width = 37.3;
        this.huNode.getComponent(cc.Layout).cellSize = cc.size(33.3, 47.47);
        this.huNode.getComponent(cc.Layout).updateLayout();
        this.huNode.active = false;

        this.huList = {};

        this.zhanshi_pai.node.active = false;

        if (this.score) {
            this.score.node.stopAllActions();
            this.score.node.active = false;
        }

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
        let length = 0;
        if (RoomMgr.Instance()._Rule) {
            length = RoomMgr.Instance()._Rule.usercountlimit;
        } else {
            length = PlayerMgr.Instance().playerList.length;
        }
        switch (length) {
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
                cc.gateNet.Instance().clearDispatchTimeout();
                return;
            }
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                cc.gateNet.Instance().clearDispatchTimeout();
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[this.chuPai.length - 1].active = true;
            this.setZsq(this.chuPai[this.chuPai.length - 1], this.viewIdx);
            PlayerMgr.Instance().playerMoPaiAction();
            cc.gateNet.Instance().clearDispatchTimeout();
        }.bind(this);
        //中间牌转变打牌
        var mid2dapai = function () {
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                cc.gateNet.Instance().clearDispatchTimeout();
                return;
            }
            cc.log('中间牌-打牌-start');
            if (this.chuPai.length <= 0) {
                cc.gateNet.Instance().clearDispatchTimeout();
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            cc.resources.load(this.getMid2DaPaiAniPath() + last_chupai_idx, function (err, clip) {
                if (this.zhanshi_pai.cardId != cardID) {
                    cc.log("出牌动画-提前结束");
                    cc.gateNet.Instance().clearDispatchTimeout();
                    return;
                }
                setTimeout(function () {
                    this.mid2dapai_playing = true;
                    cc.gateNet.Instance().clearDispatchTimeout();
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
                cc.gateNet.Instance().clearDispatchTimeout();
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
            cc.gateNet.Instance().clearDispatchTimeout();
            return;
        }

        if (this.zhanshi_pai.cardId != id) {
            cc.gateNet.Instance().clearDispatchTimeout();
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
                cc.gateNet.Instance().clearDispatchTimeout();
                return;
            }
            var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[last_chupai_idx].active = true;
            this.setZsq(this.chuPai[last_chupai_idx], this.viewIdx);
            PlayerMgr.Instance().playerMoPaiAction();
            cc.gateNet.Instance().clearDispatchTimeout();
        }.bind(this);
        //中间牌转变打牌
        var mid2dapai = function () {
            cc.log('中间牌-打牌-start');
            if (this.chuPai.length <= 0) {
                cc.gateNet.Instance().clearDispatchTimeout();
                return;
            }
            setTimeout(function () {
                this.mid2dapai_playing = true;
                cc.gateNet.Instance().clearDispatchTimeout();
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
        cc._pauseLMAni = false;
        // if(cc.dd._.isNull(DeskData.Instance().isPlayHuAni) || cc.dd._.isUndefined(DeskData.Instance().isPlayHuAni)){
        //     DeskData.Instance().isPlayHuAni = 0;
        // }
        // DeskData.Instance().isPlayHuAni--;
        cc.log("胡牌动画完成", DeskData.Instance().isPlayHuAni);
        // if(DeskData.Instance().jiesuanData && DeskData.Instance().isPlayHuAni <= 0) {
        //     DeskData.Instance().jiesuan();
        //     DeskData.Instance().jiesuanData = null;
        // }
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
        // if(DeskData.Instance().unBaopai >= 0){
        //     if(UserPlayer.isBaoTing || UserPlayer.state == PlayerState.HUPAI){
        //         this.baobai_biaoji = this.getPaiToID(DeskData.Instance().unBaopai);
        //         this.baobai_biaoji.forEach(function (pai) {
        //             pai.setBaoPaiBiaoji(true);
        //         });
        //     }
        // }
    },

    /**
     * 胡牌是 手牌也要标记
     * @param pai
     */
    biaojiBaoPaiInShouPai: function (pai) {
        // if(DeskData.Instance().unBaopai >= 0){
        //     if (Math.floor(pai.cardId / 4) == Math.floor(DeskData.Instance().unBaopai / 4)) {
        //         pai.setBaoPaiBiaoji(true);
        //     }
        // }
    },

    changeHeadCoin: function (coin) {
        this.head.setCoin(coin);
        if (DeskData.Instance().isJBC()) {
            this.head.showPochan();

            if (this.head.curr_coin == 0) {
                this.updateShouPai();
                if (this.head.player.userId == cc.dd.user.id) {
                    DeskED.notifyEvent(DeskEvent.PO_CHAN, []);
                }
            }
        }
    },

    hu: function (player, isZiMo, quick) {
        this.setShoupaiTouch(true);

        var huInfoList = [];    //索引越大,优先级越大
        huInfoList.push({ type: HuType.PING_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });           //平胡
        huInfoList.push({ type: HuType.QING_MO, ani: ['yitiaolong'], audio: 'zimo' });                 //一条龙
        huInfoList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'dianpao_hu' });     //清一色
        huInfoList.push({ type: HuType.QI_DUI, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });         //七对
        huInfoList.push({ type: HuType.ZHONG_ZHANG, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });        //
        huInfoList.push({ type: HuType.HUN_YI_SE, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });               //夹心五
        huInfoList.push({ type: HuType.DI_HU, ani: ['ditu'], audio: 'dianpao_hu' });        //
        huInfoList.push({ type: HuType.HAIDI_LAO, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });        //
        huInfoList.push({ type: HuType.HAIDI_PAO, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });        //
        huInfoList.push({ type: HuType.QIANG_HU, ani: ['qiangganghu', 'qiangganghuXS'], audio: 'dianpao_hu' });        //
        huInfoList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        huInfoList.push({ type: HuType.TIAN_HU, ani: ['tianhu'], audio: 'zimo' });


        var zimoHuList = [];
        zimoHuList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        zimoHuList.push({ type: HuType.QING_MO, ani: ['yitiaolong'], audio: 'zimo' });                 //一条龙
        zimoHuList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'zimo' });     //清一色
        zimoHuList.push({ type: HuType.QI_DUI, ani: ['zimo', 'zimoXS'], audio: 'zimo' });
        zimoHuList.push({ type: HuType.ZHONG_ZHANG, ani: ['zimo', 'zimoXS'], audio: 'zimo' });        //
        zimoHuList.push({ type: HuType.HUN_YI_SE, ani: ['zimo', 'zimoXS'], audio: 'zimo' });               //夹心五
        zimoHuList.push({ type: HuType.DI_HU, ani: ['ditu'], audio: 'zimo' });        //
        zimoHuList.push({ type: HuType.HAIDI_LAO, ani: ['zimo'], audio: 'zimo' });        //
        zimoHuList.push({ type: HuType.HAIDI_PAO, ani: ['zimo'], audio: 'zimo' });        //
        zimoHuList.push({ type: HuType.TIAN_HU, ani: ['tianhu'], audio: 'zimo' });          //自摸


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
            this.hupaiAni(zmHu, true, quick, player.huorder);
            mj_audio.playAudioBySex(zmHu.audio, player.sex);
        } else {
            this.hupaiAni(maxHu, false, quick, player.huorder);
            mj_audio.playAudioBySex(maxHu.audio, player.sex);
        }

        this.updateShouPai();

        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 胡牌");
        cc.log("胡结束");
    },

    hupaiAni: function (maxHu, isZimo, quick, huorder) {
        let func = () => {
            if (!quick) {
                if (this.hu_timeout) {
                    clearTimeout(this.hu_timeout);
                    this.hu_timeout = null;
                }

                this.hu_timeout = setTimeout(() => {
                    if (!RoomMgr.Instance()._Rule.isxueliu && huorder != 0) {
                        this.hutype_ani.node.active = true;
                    } else {
                        this.hutype_ani.node.active = false;
                    }
                }, 1000)
            } else {
                if (!RoomMgr.Instance()._Rule.isxueliu && huorder != 0) {
                    this.hutype_ani.node.active = true;
                } else {
                    this.hutype_ani.node.active = false;
                }
            }
            this.onHuAniFinished();
        }

        if (huorder == 1) {
            this.hutype_ani.node.getChildByName('frame').getComponent(cc.Sprite).spriteFrame = this.huSpriteFrame[0];
        } else if (huorder == 2) {
            this.hutype_ani.node.getChildByName('frame').getComponent(cc.Sprite).spriteFrame = this.huSpriteFrame[1];
        } else if (huorder == 3) {
            this.hutype_ani.node.getChildByName('frame').getComponent(cc.Sprite).spriteFrame = this.huSpriteFrame[2];
        }
        this.hutype_ani.node.active = false;

        if (isZimo) {
            this.hutype_ani.spriteFrame = this.huTypeSpriteFrame[0];
        } else {
            this.hutype_ani.spriteFrame = this.huTypeSpriteFrame[1];
        }

        switch (maxHu.type) {
            case HuType.PING_HU:
            case HuType.QI_DUI:
            case HuType.ZHONG_ZHANG:
            case HuType.HAIDI_LAO:
            case HuType.HAIDI_PAO:
            case HuType.QIANG_HU:
            case HuType.HUN_YI_SE:
                if (isZimo) {
                    this.playSpine(this.dgpt_ani, maxHu.ani, func);
                } else {
                    this.playSpine(this.cpgtgh_ani, maxHu.ani, func);
                }
                break;
            case HuType.ZI_MO:
                this.playSpine(this.dgpt_ani, maxHu.ani, func);
                break;
            case HuType.QING_YI_SE:
            case HuType.TIAN_HU:
            case HuType.DI_HU:
            case HuType.QING_MO:
                if (DeskData.Instance().isFriend()) {
                    if (isZimo) {
                        this.playSpine(this.dgpt_ani, ['zimo', 'zimoXS'], func);
                    } else {
                        this.playSpine(this.cpgtgh_ani, ['hu', 'huXS'], func);
                    }
                } else {
                    this.playSpine(this.qys_ani, maxHu.ani, func);
                }
                break;
            default:
                this.onHuAniFinished();
                break;
        }

        cc._pauseLMAni = true;
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
        cc.log("【UI】" + "玩家:" + player[0].userId + " 座位号:" + player[0].idx + "点炮");
        if (player[0].isBaoTing || player[0].isXiaosa) {
            return;
        }
        // this.jbdga_ani.node.active = true;
        // this.dgpt_ani.node.getChildByName('frame').active = false;
        // this.jbdga_ani.playAnimation('dianpao',1);
        this.playSpine(this.dgpt_ani, ['dianpao', 'dianpaoXS']);
        // setTimeout(function () {
        //     this.jbdga_ani.node.active = false;
        // }.bind(this),1000);
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
        mj_audio.playAduio("guafeng");
        mj_audio.playAudioBySex("gang", player.sex);
        // this.db_hu_6.node.active = true;
        // this.db_hu_6.setAnimation(0,"guafeng",false);
        // this.db_hu_6.scheduleOnce(function () {
        //     this.db_hu_6.clearTracks();
        //     this.db_hu_6.node.active = false;
        //     cc.gateNet.Instance().clearDispatchTimeout();
        //     cc.log("gang call back ---------");
        // }.bind(this), 1);
        this.playSpine(this.db_hu_6, ['guafeng'], () => {
            cc.gateNet.Instance().clearDispatchTimeout()
        });
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
        mj_audio.playAduio("guafeng");
        mj_audio.playAudioBySex("gang", player.sex);
        // this.db_hu_6.node.active = true;
        // this.db_hu_6.setAnimation(0,"guafeng",false);
        // this.db_hu_6.scheduleOnce(function () {
        //     this.db_hu_6.clearTracks();
        //     this.db_hu_6.node.active = false;
        //     cc.gateNet.Instance().clearDispatchTimeout();
        //     cc.log("gang call back ---------");
        // }.bind(this), 1);
        this.playSpine(this.db_hu_6, ['guafeng'], () => {
            cc.gateNet.Instance().clearDispatchTimeout()
        });
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
            case PlayerEvent.HUAN3ZHANG:
                this.change3Zhang(data);
                break;
            case PlayerEvent.MOVE3ZHANG:
                this.move3Zhang(data);
                break;
            case PlayerEvent.PLAYER_TIPS:
                this.setTips(data[1]);
                break;
            case PlayerEvent.DING_QUE:
                this.setDingQue(data[1]);
                break;
            case PlayerEvent.CHANGE_COIN:
                this.showScore(data[1]);
                this.changeHeadCoin(player.coin);
                break;
            case PlayerEvent.HU:
                let cardId = data[0].huCardId;
                this.addHuPai(cardId);
                break;
            case PlayerEvent.HUAZHU:
                if (data[1]) {
                    this.playSpine(this.chajiaohuazhu_ani, ['chahuazhu', 'chahuazhuXS']);
                }
                break;
            case PlayerEvent.WUJIAO:
                if (data[1]) {
                    this.playSpine(this.chajiaohuazhu_ani, ['chadajiao', 'chadajiaoXS']);
                }
                break;
            case PlayerEvent.QUICKHUAN3ZHANG:
                this.quickHuan3Zhang(data[1], data[2]);
                break;
            default:
                break;
        }
    },
    ///////////////////////////////////////////////////////////////////////
    /////////////////////////////////新功能/////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    setTips(value) {
        this.head.setTips(value);
    },
    setDingQue(value) {
        this.head.setDingQue(value);
    },
    /**
     * 碰
     */
    peng: function (data) {
        var player = data[0];

        this.resetBaiPai(player);
        this.updateShouPai(player);
        mj_audio.playAudioBySex("peng", player.sex);

        // this.peng_ani.node.active = true;
        // // this.peng_ani.clearTracks();
        // this.peng_ani.setAnimation(0, "peng", false);
        // // this.peng_ani.addAnimation(1, "pengXS", false);
        // // this.peng_ani.setCompleteListener(()=>{
        // //     this.peng_ani.clearTracks();
        // //     this.peng_ani.node.active = false;
        // // });
        //
        // this.peng_ani.scheduleOnce(function () {
        //     this.peng_ani.clearTracks();
        //
        //     // this.peng_ani.setAnimation(0, "pengXS",false);
        //     // this.peng_ani.scheduleOnce(function () {
        //     //     this.peng_ani.clearTracks();
        //         this.peng_ani.node.active = false;
        //     // }.bind(this), 0.333);
        //     cc.gateNet.Instance().clearDispatchTimeout();
        // }.bind(this), 1.333);
        this.playSpine(this.cpgtgh_ani, ['peng', 'pengXS'], () => {
            cc.gateNet.Instance().clearDispatchTimeout()
        });
    },
    /**
     * 显示得分
     * @param coin
     */
    showScore(coin) {
        if (this.score && coin != 0) {
            if (!cc.dd._.isArray(this.scoreList)) {
                this.scoreList = [];
            }
            let action = this.score.node.getActionByTag(10086);
            if (action && !action.isDone()) {
                this.scoreList.push(coin);
            } else {
                this._showScore(coin, 1.2);
            }
        }
    },

    _showScore(coin, time) {
        if (this.score) {
            this.score.font = coin < 0 ? this.lostFont : this.winFont;
            this.score.string = '/' + Math.abs(coin);

            this.score.node.active = true;
            this.score.node.stopAllActions();
            this.score.node.opacity = 0;
            let action = cc.sequence(
                // cc.delayTime(time),
                cc.fadeIn(0.1),
                cc.delayTime(1),
                cc.fadeOut(0.1),
                cc.callFunc(() => {
                    if (cc.dd._.isArray(this.scoreList) && this.scoreList.length > 0) {
                        let _coin = this.scoreList.shift();
                        this._showScore(_coin, 0.1);
                    } else {
                        cc.gateNet.Instance().clearDispatchTimeout();
                    }
                })
            );
            action.setTag(10086);
            this.score.node.runAction(action)
        }
    },

    addHuPai(cardId) {

        let desc = pai3d_value.desc[cardId].split('[')[0];
        if (this.huList.hasOwnProperty(desc)) {
            if (this.huList[desc].defaultId[cardId] != -1) {
                return;
            }
            this.huList[desc].defaultId.push(cardId);
            this.huList[desc].count++;
            this.huList[desc].label.active = true;
            this.huList[desc].label.getComponentInChildren(cc.Label).string = this.huList[desc].count;
            return;
        } else {
            this.huList[desc] = {
                defaultId: [cardId],
                count: 1,
                label: null,
            };
        }

        this.huNode.active = true;

        let jlmj_pai = this.createPai();
        if (!jlmj_pai) {
            this.huNode.active = false;
            return;
        }

        if (this.huNode.childrenCount == 0) {
            this.huNode.width = 38
        } else if (this.huNode.childrenCount < 3) {
            this.huNode.width += 37;
        }

        jlmj_pai.setValue(cardId);

        let _use2D = DeskData.Instance().getIs2D();

        if (_use2D) {
            jlmj_pai.frame.spriteFrame = jlmj_pai.atlas_2d.getSpriteFrame("ed_hupai_01");
        } else {
            jlmj_pai.frame.spriteFrame = jlmj_pai.atlas.getSpriteFrame("d_shoupai_xia_dao_zhengmian");
        }
        jlmj_pai.node.parent = this.huNode;

        jlmj_pai.node.width = 34;
        jlmj_pai.node.height = 49;

        jlmj_pai.value.node.y = -3.7;
        jlmj_pai.value.node.width = 33.3;
        jlmj_pai.value.node.height = 35.15;

        jlmj_pai.node.anchorX = 0;
        jlmj_pai.value.node.anchorX = 0;
        jlmj_pai.setTouch(false);

        let label = cc.instantiate(this.huLabel);
        jlmj_pai.node.addChild(label);
        label.x = 25.8;
        label.y = 20.1;
        label.active = false;
        this.huList[desc].label = label;

        this.huNode.getComponent(cc.Layout).updateLayout();
    },

    /**
     * 普通摆牌
     */
    _setbaipaiValue: function (pais, baipai, player) {
        var use_kaipai_cfg = false;
        if (player.isUserPlayer() && player.state == PlayerState.HUPAI) {
            //自家摆牌结算时使用开牌配置
            use_kaipai_cfg = true;
        }
        var mj_index = baipai.mj_index;
        if (player.viewIdx == 1 || player.viewIdx == 3) {
            if (player.state != PlayerState.HUPAI && player.getBaiPaiNum() <= 13) {
                //左右玩家,摆牌数小于13时,从第3张牌起布局
                mj_index += 2;
            }
        }

        let showIndex = Math.floor(pais.length / 2);

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
            jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx)], jlmj_pai.cfgArrObj);
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
        }.bind(this));
    },

    /**
     * 明杠展示
     * @param pais
     */
    _setMingGang: function (pais, baipai, player) {
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

            let jiantou = jlmj_pai.node.getChildByName('jiantou');
            if (jiantou) {
                jiantou.active = false;
            }

            //3+1
            if (idx == 0) {
                jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_up_cfg : this.pai3dCfg.baipai_open_up_cfg;
                jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + 1)], jlmj_pai.cfgArrObj['value_' + (mj_index + 1)], jlmj_pai.cfgArrObj);
            } else {
                jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_cfg : this.pai3dCfg.baipai_open_down_cfg;
                jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx - 1)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx - 1)], jlmj_pai.cfgArrObj);
            }
            jlmj_pai.setValue(idAndCnts[idx].id);
            jlmj_pai.setCnt(idAndCnts[idx].cnt);

            if (baipai.type == BaipaiType.DIANGANG) {
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

            this.updateBaiPaiSpace(jlmj_pai, baipai, player);
        }
    },

    /**
     * 获取手牌
     * @param id
     */
    getShouPai: function (id) {
        if (this.modepai.node.active && this.modepai.cardId == id) {
            return this.modepai;
        }
        for (var i = 0; i < this.shouPai.length; ++i) {
            var jlmj_pai = this.shouPai[i];
            if (jlmj_pai && jlmj_pai.cardId == id && jlmj_pai.node.active) {
                return jlmj_pai;
            }
        }
        return null;
    },
});
