var playerED = require("scmj_player_data").PlayerED;
var PlayerState = require("scmj_player_data").PlayerState;
var playerMgr = require('scmj_player_mgr');
var pai3d_value = require('jlmj_pai3d_value');
var DeskData = require("scmj_desk_data").DeskData;

var mj_audio = require('mj_audio');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var UIZorder = require("mj_ui_zorder");
cc.Class({
    extends: require('scmj_player_base_ui'),

    properties: {

    },

    resetConfig() {
        let use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
        this.pai3dCfg = use2D ? require("jlmj_pai3d_up_2d").Instance() : require("jlmj_pai3d_up").Instance();
        let path = use2D ? '_2d' : '';
        this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai' + path + '/up/jlmj_shou2mid_up_';
    },

    initPai: function () {
        this.resetConfig();
        this.viewIdx = 2;
        var res_pai = cc.find('Canvas/mj_res_pai');
        if (!res_pai) {
            return null;
        }
        this.ccgpai_prefab = res_pai.getComponent('mj_res_pai').jlmj_ccgpai_up;
    },

    // use this for initialization
    onLoad: function () {
        cc.log('scmj_player_up_ui onLoad');
        this.zhanshi_pai = cc.find("Canvas/desk_node/zhanshi_pais/jlmj_zhanshi_pai_up").getComponent('jlmj_pai');     //展示牌

        this.node_hu_5 = cc.find("Canvas/desk_node/play_anis/jlmj_xiayu_ani_u");
        this.node_hu_6 = cc.find("Canvas/desk_node/play_anis/jlmj_guafeng_ani_u");
        // cc.find("Canvas/desk_node/jlmj_player_up_ui/mj_playerHead").zIndex = UIZorder.MJ_LAYER_TOP;
        // cc.find("Canvas/desk_node/jlmj_player_up_ui/chat_node").setLocalZOrder(UIZorder.MJ_LAYER_TOP);
        // cc.find("Canvas/desk_node/jlmj_player_up_ui/biaoqing_node").setLocalZOrder(UIZorder.MJ_LAYER_TOP);
        this.chupai_node = cc.find("Canvas/desk_node/chupai_up_node");

        this.score = cc.find("Canvas/desk_node/score_u").getComponent(cc.Label);
        this.score.node.zIndex = UIZorder.MJ_LAYER_TOP;

        this.huNode = cc.find("Canvas/desk_node/hu_u");
        this.huNode.getComponent(cc.Layout).cellSize = cc.size(33.3, 47.47);
        this.huNode.getComponent(cc.Layout).updateLayout();
        this.huNode.active = false;

        this.initPai();
        this.db_hu_5 = this.node_hu_5.getComponent(sp.Skeleton);
        this.db_hu_5.node.active = false;

        this.db_hu_6 = this.node_hu_6.getComponent(sp.Skeleton);
        this.db_hu_6.node.active = false;

        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_u").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_u").getComponent(sp.Skeleton);
        this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_u").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_u").getComponent(sp.Skeleton);
        // this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_u").getComponent(sp.Skeleton);
        // this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_u").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_u").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_u").getComponent(sp.Skeleton);
        this.hutype_ani = cc.find("Canvas/desk_node/play_anis/hutype_u").getComponent(cc.Sprite);

        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        // this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;
        this.hutype_ani.node.active = false;

        this.initShouPai();
        this.initModepai();
        this.zhanli();
        playerED.addObserver(this);

        // this.head.node.setLocalZOrder(UIZorder.MJ_LAYER_TOP);
    },

    onDestroy: function () {
        playerED.removeObserver(this);
    },

    /**
     * 获取打牌动画路径
     * @returns {*}
     */
    getMid2DaPaiAniPath: function () {
        let path = DeskData.Instance().getIs2D() ? '_2d' : '';
        let length = 0;
        if (RoomMgr.Instance()._Rule) {
            length = RoomMgr.Instance()._Rule.usercountlimit;
        } else {
            length = playerMgr.Instance().playerList.length;
        }
        switch (length) {
            case 3:
                return 'gameyj_mj/common/animations/pai3' + path + '/up/jlmj_mid2dapai_up_';
            case 2:
                return 'gameyj_mj/common/animations/pai2' + path + '/up/jlmj_mid2dapai_up_';
            default:
                return 'gameyj_mj/common/animations/pai' + path + '/up/jlmj_mid2dapai_up_';
        }
    },

    getBaipaiShouPaiDis: function (state) {
        if (state == PlayerState.DAPAI) {
            return -58;
        } else if (state == PlayerState.TINGPAI) {
            return -58;
        } else {
            return -58;
        }
    },

    getMoPaiShouPaiDis: function (state) {
        if (state == PlayerState.DAPAI) {
            return -50;
        } else if (state == PlayerState.TINGPAI) {
            return -50;
        } else {
            return -50;
        }
    },

    /**
     * 获取居中对齐的偏移X
     */
    getAlignCenterOffsetX: function () {
        var offset_x = 0;
        var first_pai = null;
        var last_pai = null;
        if (this.baipai_ui_list.length > 0) {
            var first_baipai_ui = this.baipai_ui_list[0];
            first_pai = first_baipai_ui.pais[0].node;
        }
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (this.shouPai[i].node.active) {
                if (!first_pai) {
                    first_pai = this.shouPai[i].node;
                }
                last_pai = this.shouPai[i].node;
            }
        }
        if (this.modepai.node.active) {
            last_pai = this.modepai.node;
        }
        offset_x = (Math.abs(first_pai.x) - Math.abs(last_pai.x)) / 2;
        if (Math.abs(first_pai.x) > Math.abs(last_pai.x)) {
            offset_x = -Math.abs(offset_x);
        } else {
            offset_x = Math.abs(offset_x);
        }
        offset_x = parseFloat(offset_x.toFixed(1));
        // cc.log('座号=',this.viewIdx);
        // cc.log('第一张牌位置X=',first_pai.x);
        // cc.log('最后一张牌位置X=',last_pai.x);
        // cc.log('居中偏移X=',offset_x);
        return offset_x;
    },



    updateShouPai: function (player) {
        if (this.isResetBaiPai) {
            this.needUpdateShouPai = true;
            return;
        }

        var player = playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if (!player) {
            return;
        }
        //测试结算开牌
        // player.state = PlayerState.HUPAI;

        //胡牌时,摆牌先重置,再排版
        if (player.state == PlayerState.HUPAI) {
            this.resetBaiPai(player);
        }

        if (player.shoupai.length == 0) {
            return;
        }
        var shouPaiLen = player.shoupai.length;
        if (player.hasMoPai()) {
            shouPaiLen = player.shoupai.length - 1;
        }

        var shoupai_visible_cfg = {
            1: [12],
            4: [9, 10, 11, 12],
            7: [6, 7, 8, 9, 10, 11, 12],
            9: [4, 5, 6, 7, 8, 9, 10, 11, 12],
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
            if (shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1) {
                this.shouPai[i].node.active = true;
                if (player.state == PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i, player.state, player.getBaiPaiNum() + count);
                } else {
                    this.setShouPaiAppearance(i, player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);

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
            if (player.state == PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(13, player.state, player.getBaiPaiNum() + count);
            } else {
                this.setMoPaiAppearance(13, player.state);
            }
            var last_shou_pai = this.getLastShouPai();
            this.modepai.node.setPosition(last_shou_pai.node.x + this.getMoPaiShouPaiDis(player.state), last_shou_pai.node.y);
            this.modepai.setValue(player.shoupai[shouPaiLen]);
        } else {
            this.modepai.node.active = false;
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if (player.state == PlayerState.HUPAI) {
            this.shouPaiAlignCenterH();
        }

        // if(player.state == PlayerState.SC_HUPAI){
        //     if(player.hasMoPai()){
        //         var shoupai_count = shoupai_visible_cfg[shouPaiLen].length;
        //         var mopaiIdx = shoupai_visible_cfg[shouPaiLen][shoupai_count-1]+1;
        //         this.setMoPaiAppearance(mopaiIdx,PlayerState.SC_KAIPAI);
        //     }else{
        //         this.setShouPaiAppearance(shouPaiLen,PlayerState.SC_KAIPAI,player.getBaiPaiNum()+count);
        //     }
        // }
    },

    mopai: function (player) {
        this.updateShouPai(player);
    },

    /**
     * 获取最后一张手牌
     */
    getLastShouPai: function () {
        var last_shou_pai = null;
        this.shouPai.forEach(function (pai) {
            if (pai.node.active) {
                last_shou_pai = pai;
            }
        });
        return last_shou_pai;
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

        var player_list = playerMgr.Instance().playerList;
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
        jlmj_pai.kaipai(this.getDaPaiCfg()['frame_' + cur_idx], this.getDaPaiCfg()['value_' + cur_idx], this.pai3dCfg.dapai_cfg);
        jlmj_pai.setValue(value);
        if (player_list.length == 2 && !DeskData.Instance().getIs2D()) {
            jlmj_pai.node.y -= jlmj_pai.node.width * 0.4;
        }
        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 打牌:" + pai3d_value.desc[value]);
        //出牌动画
        this.stop_chupai_ani();
        this.play_chupai_ani(player, chupai_idx_in_shoupai, last_chupai_idx, value);
    },
    /**
     * 更新出牌
     */
    updateChuPaiUI: function (player, is_reverse) {
        this.chuPai.forEach(function (pai) {
            pai.destroy();
        });
        this.chuPai = [];
        for (var i = 0; i < player.chupai.length; ++i) {
            var jlmj_pai = this.createPai();
            if (!jlmj_pai) {
                return;
            }
            //this.node.addChild(jlmj_pai.node);
            this.chupai_node.addChild(jlmj_pai.node);
            this.chuPai.push(jlmj_pai.node);
            var idx = i;
            var cur_id = i;
            if (is_reverse) {
                // let count = DeskData.Instance().getIs2D() ? 19 : 18;
                // let total = 2;
                // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
                // cur_id = pos_id * count + (this.chuPai.length - 1) % count;
            }
            var value = player.chupai[idx];
            jlmj_pai.kaipai(this.getDaPaiCfg()['frame_' + cur_id], this.getDaPaiCfg()['value_' + cur_id], this.pai3dCfg.dapai_cfg);
            jlmj_pai.setValue(value);
            if (is_reverse && !DeskData.Instance().getIs2D()) {
                jlmj_pai.node.y -= jlmj_pai.node.width * 0.4;
            }
        }
    },

    ///////////////////////////////////////////////////////////////////////
    /////////////////////////////////新功能/////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    /**
     * 换三张动作
     * @param data
     */
    change3Zhang(data) {
        cc.log("【UI】玩家换三张:" + data[0].userId + " 座位号:" + data[0].idx);

        // for(let key in this._changePos){
        //     if(this._changePos.hasOwnProperty(key)){
        //         let shoupai = this.shouPai[key];
        //         let idx = key;
        //         if (shoupai) {
        //             let pos = shoupai.node.position;
        //             let originPos = this._changePos[key];
        //             shoupai.node.runAction(cc.sequence(
        //                 cc.hide(),
        //                 cc.delayTime(3),
        //                 cc.show(),
        //                 cc.callFunc(()=>{
        //                     this.updateShouPai();
        //                     if(this.node && this.node.isValid && shoupai && shoupai.node.isValid){
        //                         shoupai.node.active = true;
        //                         shoupai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + idx])
        //                         shoupai.node.position = cc.v2(originPos.x, originPos.y + 25);
        //                     }
        //                 }),
        //                 // cc.delayTime(1),
        //                 // cc.moveTo(0.1, originPos.x, originPos.y + 25),
        //             ))
        //         }
        //     }
        // }
        let ishuan4zhang = RoomMgr.Instance()._Rule.huan4zhang;

        this.node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                this.updateShouPai();

                let randomIndex = cc.dd.Utils.random(12);
                let _tempIndex = [];

                cc.log("随机数:" + randomIndex);
                if (randomIndex == 0) {
                    _tempIndex.push(0);
                    _tempIndex.push(1);
                    _tempIndex.push(2);
                    if (ishuan4zhang) {
                        _tempIndex.push(3);
                    }
                } else if (randomIndex == 11 || randomIndex == 12) {
                    if (ishuan4zhang) {
                        _tempIndex.push(9);
                    }
                    _tempIndex.push(10);
                    _tempIndex.push(11);
                    _tempIndex.push(12);
                } else {
                    _tempIndex.push(randomIndex - 1);
                    _tempIndex.push(randomIndex);
                    _tempIndex.push(randomIndex + 1);
                    if (ishuan4zhang) {
                        _tempIndex.push(randomIndex + 2);
                    }
                }

                for (let i = 0; i < _tempIndex.length; i++) {
                    let idx = _tempIndex[i];

                    let shoupai = this.shouPai[idx];
                    if (shoupai) {
                        shoupai.node.y += 25;
                    }
                }
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                if (this.node && this.node.isValid) {
                    this._changePos = null;

                    this.updateShouPai();
                }
            })
        ))
    },

    /**
     * 换三张出牌
     */
    move3Zhang(data) {
        cc.log("【UI】玩家换三张出牌:" + data[0].userId + " 座位号:" + data[0].idx);
        // let randomIndex = cc.dd.Utils.random(12);
        // let _tempIndex = [];
        //
        // cc.log("随机数:"+randomIndex);
        // if(randomIndex == 0){
        //     _tempIndex.push(0);
        //     _tempIndex.push(1);
        //     _tempIndex.push(2);
        // }else if(randomIndex == 12){
        //     _tempIndex.push(10);
        //     _tempIndex.push(11);
        //     _tempIndex.push(12);
        // }else{
        //     _tempIndex.push(randomIndex-1);
        //     _tempIndex.push(randomIndex);
        //     _tempIndex.push(randomIndex+1);
        // }
        // this._changePos = {};
        //
        // let use2D = DeskData.Instance().getIs2D();
        //
        // for(let i = 0; i < _tempIndex.length; i++){
        //     let idx = _tempIndex[i];
        //
        //     let shoupai = this.shouPai[idx];
        //     if (shoupai) {
        //         let pos = shoupai.node.position;
        //         let j = i;
        //         this._changePos[idx] = pos;
        //         let mosPos = use2D ? cc.v2((j-1) * 35, 200) : cc.v2((j-1) * 35, 266);
        //
        //         shoupai.daopai(this.pai3dCfg.shoupai_daopai_cfg['frame_' + idx], this.pai3dCfg.shoupai_daopai_cfg);
        //         shoupai.node.position = pos;
        //         shoupai.node.runAction(cc.sequence(
        //             cc.moveTo(0.1, mosPos),
        //             cc.callFunc(()=>{
        //                 if(this.node && this.node.isValid && shoupai && shoupai.node.isValid) {
        //                     let conf = this.pai3dCfg.shoupai_daopai_cfg['frame_' + (6 + j)];
        //                     shoupai.daopai(conf, this.pai3dCfg.shoupai_daopai_cfg);
        //                     shoupai.node.position = cc.v2(mosPos);
        //                 }
        //             })
        //         ));
        //     }
        // }
        this.updateShouPai();
        this.shouPaiAlignCenterH();
    },

    /**
     * 回放的时候快速换三张
     * @param choosepaisList
     * @param huanpaisList
     */
    quickHuan3Zhang(choosepaisList, huanpaisList) {
        let choosePais = choosepaisList;

        var getType = function (id) {
            if (id >= 72 && id <= 107) {
                return 5;   //万
            } else if (id >= 36 && id <= 71) {
                return 4;   //条
            } else if (id >= 0 && id <= 35) {
                return 3;   //饼
            } else if (id >= 120 && id <= 135) {
                return 2;   //东南西北
            } else if (id >= 108 && id <= 119) {
                return 1;   //中发白
            }
        };

        choosePais.sort(function (a, b) {
            var type_a = getType(a.id);
            var type_b = getType(b.id);
            if (type_a == type_b) {
                return a.id - b.id;
            } else {
                return type_b - type_a;
            }
        });
        let use2D = DeskData.Instance().getIs2D();
        for (let i = 0; i < choosePais.length; i++) {
            let shoupai = this.getShouPai(choosePais[i].id);
            if (shoupai) {
                let pos = shoupai.node.position;
                shoupai.setTouch(false);
                let mosPos = use2D ? cc.v2((i - 1) * 35, 200) : cc.v2((i - 1) * 35, 266);
                shoupai.node.runAction(cc.sequence(
                    cc.moveTo(0.1, mosPos),
                    cc.delayTime(0.3),
                    cc.callFunc(() => {
                        if (shoupai && shoupai.node.isValid) {
                            shoupai.setValue(huanpaisList[i].id);
                        }
                    }),
                    cc.delayTime(0.3),
                    cc.moveTo(0.1, pos)
                ));
            }
        }
    },

    /**
     * 设置手牌的外观
     * @param idx
     * @param state
     */
    setShouPaiAppearance: function (idx, state, cfg_view_idx) {
        if (!cfg_view_idx) {
            cfg_view_idx = idx;
        }
        if (state == PlayerState.TINGPAI) {
            if (!RoomMgr.Instance()._Rule.isxueliu) {
                this.shouPai[idx].daopai(this.pai3dCfg.shoupai_daopai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_daopai_cfg);
            } else {
                this.shouPai[idx].zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx]);
            }
            return;
        }
        switch (state) {
            case PlayerState.PO_CHAN:
            case PlayerState.SC_HUPAI:
                this.shouPai[idx].daopai(this.pai3dCfg.shoupai_daopai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_daopai_cfg);
                break;
            case PlayerState.HUPAI:
            case PlayerState.SC_KAIPAI:
                this.shouPai[idx].kaipai(this.pai3dCfg.shoupai_kaipai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg);
                break;
            default:
                this.shouPai[idx].zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx]);
                break;
        }
    },
    /**
     * 设置摸牌的外观
     * @param idx
     * @param state
     */
    setMoPaiAppearance: function (idx, state, cfg_view_idx) {
        if (!cfg_view_idx) {
            cfg_view_idx = idx;
        }
        switch (state) {
            case PlayerState.PO_CHAN:
                this.modepai.daopai(this.pai3dCfg.shoupai_daopai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_daopai_cfg);
                break;
            case PlayerState.SC_KAIPAI:
            case PlayerState.HUPAI:
                this.modepai.kaipai(this.pai3dCfg.shoupai_kaipai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg);
                break;
            default:
                this.modepai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx]);
                break;
        }
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

        setTimeout(() => {
            mj_audio.playAduio("xiayu");
        }, 200);
        mj_audio.playAudioBySex("gang", player.sex);
        // this.db_hu_5.node.active = true;
        // this.db_hu_5.setAnimation(0,"shangxia",false);
        // this.db_hu_5.scheduleOnce(function () {
        //     this.db_hu_5.clearTracks();
        //     this.db_hu_5.node.active = false;
        //     cc.log("angang call back ---------");
        //     cc.gateNet.Instance().clearDispatchTimeout();
        // }.bind(this), 1);
        this.playSpine(this.db_hu_5, ['shangxia'], () => {
            cc.gateNet.Instance().clearDispatchTimeout()
        });
    },
});
