var mj_audio = require('mj_audio');

cc.Class({
    extends: require('base_mj_player_up_ui'),

    initHuPai: function () {
        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_u").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_u").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_u").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_u").getComponent(sp.Skeleton);
        this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_u").getComponent(sp.Skeleton);
        // this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_u").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_u").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_u").getComponent(sp.Skeleton);

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
        let _shoupai_length = player.zhangBaoList.length > 0 ? 11 : 13;
        var shoupai_visible_cfg = {
            1: [12],
            4: [9, 10, 11, 12],
            7: [6, 7, 8, 9, 10, 11, 12],
            10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };

        if (!shoupai_visible_cfg[shouPaiLen]) {
            cc.error("对家手牌数量错误  =", shouPaiLen);

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

        var offset_x = 0;
        if (this.baipai_ui_list.length > 0) {
            var last_baipai_ui = this.baipai_ui_list[this.baipai_ui_list.length - 1];
            var last_pai = last_baipai_ui.pais[last_baipai_ui.pais.length - 1];
            var first_idx = shoupai_visible_cfg[shouPaiLen][0];
            var start_x = this.shouPai[first_idx].frameCfg.x;
            var target_x = last_pai.node.x + this.getBaipaiShouPaiDis(player.state);
            offset_x = target_x - start_x;
        }
        cc.log('手牌偏移位置 = ' + offset_x);
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (this.shouPai[i].node.active) {
                this.shouPai[i].node.x = this.shouPai[i].frameCfg.x + offset_x;
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
            if (player.state == this.require_PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(13, player.state, player.getBaiPaiNum() + count);
            } else {
                this.setMoPaiAppearance(13, player.state);
            }
            var last_shou_pai = this.getLastShouPai();
            this.modepai.node.setPosition(last_shou_pai.node.x + this.getMoPaiShouPaiDis(player.state), last_shou_pai.node.y);
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if (player.state == this.require_PlayerState.HUPAI) {
                this.biaojiBaoPaiInShouPai(this.modepai);
            }
        } else {
            this.modepai.node.active = false;
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if (player.state == this.require_PlayerState.HUPAI) {
            this.shouPaiAlignCenterH();
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
