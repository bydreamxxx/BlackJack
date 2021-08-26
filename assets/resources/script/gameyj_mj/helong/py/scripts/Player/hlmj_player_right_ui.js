var BaipaiType = require("jlmj_baipai_data").BaipaiType;
const paiType = require('jlmj_gang_pai_type').CardType;

cc.Class({
    extends: require('base_mj_player_right_ui'),

    properties: {
        jiantouPrefab: cc.Prefab,
        gangtipPrefab: cc.Prefab,
    },

    initHuPai: function () {
        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_r").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_r").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_r").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_r").getComponent(sp.Skeleton);
        // this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_r").getComponent(sp.Skeleton);
        this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_r").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_r").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_r").getComponent(sp.Skeleton);

        this.clearHuPai();
    },

    clearHuPai: function () {
        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;
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
            //             tips.x = 57;
            //             tips.y = 52;
            //         }else{
            //             tips.x = 50;
            //             tips.y = -15;
            //         }
            //         tips.rotation = 10;
            //         tips.scaleX = -1;
            //         tips.skewY = -9;
            //         tips.getComponent(cc.Label).overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            //         tips.width = tips.getComponent(cc.Label).fontSize;
            //         tips.active = true;
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

    initMJComponet() {
        return require("mjComponentValue").hlmj;
    }
});
