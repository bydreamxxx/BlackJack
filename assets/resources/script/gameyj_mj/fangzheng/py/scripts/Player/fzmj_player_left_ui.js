var mj_audio = require('mj_audio');

cc.Class({
    extends: require('base_mj_player_left_ui'),

    initHuPai: function () {
        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_l").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_l").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_l").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_l").getComponent(sp.Skeleton);
        this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_l").getComponent(sp.Skeleton);
        // this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_l").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_l").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_l").getComponent(sp.Skeleton);

        this.clearHuPai();
    },

    clearHuPai: function () {
        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        this.liangzhang_ani.node.active = false;
        // this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;
    },

    getMoPaiShouPaiDis: function (state) {
        //摸牌
        var zhanli = {
            offsetX: 0,
            offsetY: -10,
        };
        //摆牌间隔
        var daopai = null;
        if (!this.require_DeskData.Instance().getIs2D()) {
            daopai = {
                13: { x: -522.8, y: -100.6 },
                11: { x: -518.4, y: -70.6 },
                10: { x: -518.4, y: -70.6 },
                8: { x: -512.6, y: -43.6 },
                7: { x: -506, y: -15.8 },
                5: { x: -497.3, y: 37.5 },
                4: { x: -500.9, y: 11.2 },
                2: { x: -497.3, y: 37.5 },
                1: { x: -490.7, y: 63.8 },
            };
        } else {
            daopai = {
                13: { x: -515, y: -114.2 },
                11: { x: -515, y: -85.2 },
                10: { x: -515, y: -85.2 },
                8: { x: -515, y: -34.2 },
                7: { x: -515, y: -34.2 },
                5: { x: -515, y: -8 },
                4: { x: -515, y: -8 },
                2: { x: -515, y: 45.1 },
                1: { x: -515, y: 45.1 },
            };
        }
        //开牌
        var kaipai = {
            offsetX: 0,
            offsetY: -10,
        };

        if (state == this.require_PlayerState.DAPAI) {
            return zhanli;
        } else if (state == this.require_PlayerState.TINGPAI) {
            return daopai;
        } else {
            return kaipai;
        }
    },

    updateShouPai: function (player) {
        if (this.isResetBaiPai) {
            this.needUpdateShouPai = true;
            return;
        }

        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if (!player) {
            return;
        }
        //测试结算开牌
        // player.state = this.require_PlayerState.HUPAI;

        //胡牌时,摆牌先重置,再排版
        if (player.state == this.require_PlayerState.HUPAI) {
            this.resetBaiPai(player);
        }

        if (player.shoupai.length == 0) {
            return;
        }
        var shouPaiLen = player.shoupai.length;
        if (player.hasMoPai()) {
            shouPaiLen = player.shoupai.length - 1;
        }
        let _shoupai = player.shoupai.slice();
        for (let i = 0; i < player.zhangBaoList.length; i++) {
            if (player.replaying || player.state == this.require_PlayerState.HUPAI) {
                let idx = _shoupai.indexOf(player.zhangBaoList[i]);
                if (idx != -1) {
                    _shoupai.splice(idx, 1);
                }
            } else {
                _shoupai.pop();
            }
        }
        let _shoupai_length = 13;

        if (player.zhangBaoList.length > 0) {
            switch (shouPaiLen) {
                case 1:
                    _shoupai_length = 5;
                    break;
                case 4:
                    _shoupai_length = 7;
                    break;
                case 7:
                    _shoupai_length = 8;
                    break;
                case 10:
                    _shoupai_length = 10;
                    break;
                case 13:
                    _shoupai_length = 11;
                    break;
            }
        }

        var shoupai_visible_cfg = {
            1: [6],
            4: [5, 6, 7, 8],
            7: [3, 4, 5, 6, 7, 8, 9],
            10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };

        if (!shoupai_visible_cfg[shouPaiLen]) {
            cc.error("上家手牌数量错误  =", shouPaiLen);

            if (!cc.dd._mj_shoupai_reconnectd) {
                cc.dd._mj_shoupai_reconnectd = true;

                cc.log("开始重连麻将" + cc.dd.AppCfg.GAME_ID + "玩家ID" + player.userId);
                var login_module = require('LoginModule');
                login_module.Instance().reconnectWG();
                return;
            }
        }
        //手牌
        var count = 0;
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1 && i < _shoupai_length) {
                this.shouPai[i].node.active = true;
                if (player.state == this.require_PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i, player.state, player.getBaiPaiNum() + count);
                } else {
                    this.setShouPaiAppearance(i, player.state);
                }
                this.shouPai[i].setValue(_shoupai[count]);
                if (player.state == this.require_PlayerState.HUPAI) {
                    this.biaojiBaoPaiInShouPai(this.shouPai[i]);
                }
                count++;
            } else {
                this.shouPai[i].node.active = false;
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
            var shoupai_count = shoupai_visible_cfg[shouPaiLen].length;
            var mopaiIdx = shoupai_visible_cfg[shouPaiLen][shoupai_count - 1] + 1;
            if (player.state == this.require_PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(mopaiIdx, player.state, player.getBaiPaiNum() + count);
            } else {
                this.setMoPaiAppearance(mopaiIdx, player.state);
            }
            if (player.state == this.require_PlayerState.TINGPAI) {
                var pos = this.getMoPaiShouPaiDis(player.state)[_shoupai.length - 1];
                this.modepai.node.setPosition(pos.x, pos.y);
            } else {
                var lastPos = this.modepai.node.getPosition();
                this.modepai.node.setPosition(lastPos.x + this.getMoPaiShouPaiDis(player.state).offsetX, lastPos.y + this.getMoPaiShouPaiDis(player.state).offsetY);
            }
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if (player.state == this.require_PlayerState.HUPAI) {
                this.biaojiBaoPaiInShouPai(this.modepai);
            }
        } else {
            this.modepai.node.active = false;
        }

        //胡牌时有摆牌,位置偏移
        if (player.state == this.require_PlayerState.HUPAI && this.baipai_ui_list.length > 0) {
            // var mj_index = this.baipai_ui_list.length;
            var mj_index = player.getBaiPaiNum();
            for (var i = 0; i < this.shouPai.length; ++i) {
                if (this.shouPai[i].node.active) {
                    var pos_cfg = this.shouPai[i].node.getPosition();
                    var pos_space = cc.v2(this.pai3dCfg.baipai_space.x * mj_index, this.pai3dCfg.baipai_space.y * mj_index);
                    this.shouPai[i].node.setPosition(pos_cfg.add(pos_space));
                    //加上摆牌和开牌偏移
                    this.shouPai[i].node.x += -3;
                    this.shouPai[i].node.y += -6;
                }
            }
            mj_index += 1;
            var pos_cfg = this.modepai.node.getPosition();
            var pos_space = cc.v2(this.pai3dCfg.baipai_space.x * mj_index, this.pai3dCfg.baipai_space.y * mj_index);
            this.modepai.node.setPosition(pos_cfg.add(pos_space));
            //加上摆牌和开牌偏移
            this.modepai.node.x += -3;
            this.modepai.node.y += -6;
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if (player.state == this.require_PlayerState.HUPAI) {
            this.shouPaiAlignCenterV();
        }
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
    },

    initMJComponet() {
        return require("mjComponentValue").fzmj;
    }
});
