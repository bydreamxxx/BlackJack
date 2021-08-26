var DeskEvent = require("tdhmj_desk_data").DeskEvent;
var DeskED = require("tdhmj_desk_data").DeskED;
var DeskData = require("tdhmj_desk_data").DeskData;

var GmPaiKuED = require("jlmj_gm_paiku").GmPaiKuED;

var jlmj_audio_path = require("jlmj_audio_path");
var jlmj_prefab = require("jlmj_prefab_cfg");

var mj_audio = require('mj_audio');

var playerED = require("tdhmj_player_data").PlayerED;
var PlayerEvent = require("tdhmj_player_data").PlayerEvent;
var PlayerState = require("tdhmj_player_data").PlayerState;
var playerMgr = require("tdhmj_player_mgr");
var pai3d_value = require("jlmj_pai3d_value");

var SysED = require("com_sys_data").SysED;

var UIZorder = require("mj_ui_zorder");
var UserPlayer = require("tdhmj_userPlayer_data").Instance();

const chupai_offset = 40;
const restPt_y = () => { return DeskData.Instance().getIs2D() ? -292 : -286.2 };

const TouchCardMode = cc.Enum({
    CHU_PAI: 1,
    GANG_PAI: 2,
    TING_PAI: 3,
    DA_TING_PAI: 4,
});

cc.Class({
    extends: require('tdhmj_player_base_ui'),

    properties: {

        prefab_user_pai: cc.Prefab,
    },

    resetConfig() {
        let use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
        this.pai3dCfg = use2D ? require("jlmj_pai3d_down_2d").Instance() : require("jlmj_pai3d_down").Instance();
        let path = use2D ? '_2d' : '';
        this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai' + path + '/down/jlmj_shou2mid_down_';
    },

    initPai: function () {
        this.resetConfig();
        this.viewIdx = 0;
        var res_pai = cc.find('Canvas/mj_res_pai');
        if (!res_pai) {
            return null;
        }

        this.ccgpai_prefab = res_pai.getComponent('mj_res_pai').jlmj_ccgpai_down;
        this.yidong_pai = null;
        this.pai_touched = null;
        this.touchCardMode = TouchCardMode.CHU_PAI;//牌的选择还是出牌
        this.fenpai_touched = false;
    },

    onLoad: function () {
        cc.log('tdhmj_player_down_ui onLoad');

        let desk_node = cc.find("Canvas/desk_node");
        this._node_scale_x = desk_node.scaleX;
        this._node_scale_y = desk_node.scaleY;

        let canvas = cc.find("Canvas");
        this._offsetX = canvas.width / 2;
        this._offsetY = canvas.height / 2;

        this.zhanshi_pai = cc.find("Canvas/desk_node/zhanshi_pais/jlmj_zhanshi_pai_down").getComponent('jlmj_pai');     //展示牌
        this.touch_node = cc.find("Canvas/desk_node/jlmj_player_down_ui/user_touch_node");
        //cc.find("Canvas/jlmj_player_down_ui/mj_playerHead").zIndex = UIZorder.MJ_LAYER_TOP;
        this.chupai_node = cc.find("Canvas/desk_node/chupai_down_node");

        this.initPai();

        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_d").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_d").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_d").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_d").getComponent(sp.Skeleton);
        // this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_d").getComponent(sp.Skeleton);
        this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_d").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_d").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_d").getComponent(sp.Skeleton);

        this.chupai_prompt = cc.find("Canvas/desk_node/chupai_prompt");

        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;
        if (this.chupai_prompt) {
            this.chupai_prompt.active = false;
        }

        this.chupai_act = false;
        this.initShouPai();
        this.initModepai();
        this.initYiDongPai();
        this.regTouchEvent();
        playerED.addObserver(this);
        GmPaiKuED.addObserver(this);
        SysED.addObserver(this);

        this.head.node.zIndex = UIZorder.MJ_LAYER_TOP;


    },

    onDestroy: function () {
        playerED.removeObserver(this);
        GmPaiKuED.removeObserver(this);
        SysED.removeObserver(this);
    },

    /**
     * 获取打牌动画路径
     * @returns {*}
     */
    getMid2DaPaiAniPath: function () {
        let path = DeskData.Instance().getIs2D() ? '_2d' : '';

        switch (playerMgr.Instance().playerList.length) {
            case 3:
                return 'gameyj_mj/common/animations/pai3' + path + '/down/jlmj_mid2dapai_down_';
            case 2:
                return 'gameyj_mj/common/animations/pai2' + path + '/down/jlmj_mid2dapai_down_';
            default:
                return 'gameyj_mj/common/animations/pai' + path + '/down/jlmj_mid2dapai_down_';
        }
    },

    initShouPai: function () {
        for (var i = 0; i < 13; ++i) {
            var pai_node = cc.instantiate(this.prefab_user_pai);
            pai_node.active = false;
            pai_node.name = 'jlmj_pai_' + i;
            this.node.addChild(pai_node);
            var jlmj_user_shoupai = pai_node.getComponent("jlmj_user_shoupai");
            jlmj_user_shoupai.setTouchAble(true);
            jlmj_user_shoupai.setTingPai(false);
            this.shouPai[i] = jlmj_user_shoupai;
        }
    },

    /**
     * 初始化摸得牌
     */
    initModepai: function () {
        var pai_node = cc.instantiate(this.prefab_user_pai);
        this.node.addChild(pai_node);
        var jlmj_user_shoupai = pai_node.getComponent("jlmj_user_shoupai");
        if (!jlmj_user_shoupai) {
            cc.error("摸牌未挂jlmj_user_shoupai组件");
        }
        jlmj_user_shoupai.setTouchAble(true);
        jlmj_user_shoupai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + 12], this.pai3dCfg.shoupai_zhanli_cfg['value_' + 12]);
        this.modepai = jlmj_user_shoupai;
        this.modepai.node.active = false;
    },

    /**
     * 初始化移动牌
     */
    initYiDongPai: function () {
        var pai_node = cc.instantiate(this.prefab_pai);
        pai_node.zIndex = UIZorder.MJ_YIDONG_PAI;
        this.node.addChild(pai_node);
        var jlmj_pai = pai_node.getComponent("jlmj_pai");
        if (!jlmj_pai) {
            cc.error("摸牌未挂jlmj_pai组件");
        }
        this.yidong_pai = jlmj_pai;
        this.yidong_pai.node.active = false;
        this.yidong_pai.cloned = false;
    },

    getBaipaiShouPaiDis: function (state) {
        if (state == PlayerState.DAPAI) {
            //5张风杠,向左缩进。
            if (this.baipai_ui_list.length == 1) {
                var last_baipai_ui = this.baipai_ui_list[0];
                if (last_baipai_ui.pais.length == 5) {
                    return DeskData.Instance().getIs2D() ? 82 : 72;
                }
            }
            return 100;
        } else if (state == PlayerState.TINGPAI) {
            return 100;
        } else {
            return 100;
        }
    },

    getMoPaiShouPaiDis: function (state) {
        if (state == PlayerState.DAPAI) {
            return 100;
        } else if (state == PlayerState.TINGPAI) {
            return 100;
        } else {
            return 100;
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
            offset_x = Math.abs(offset_x);
        } else {
            offset_x = -Math.abs(offset_x);
        }
        offset_x = parseFloat(offset_x.toFixed(1));
        return offset_x;
    },



    updateShouPai: function (player) {
        if (this.isResetBaiPai) {
            this.needUpdateShouPai = true;
            return;
        }
        if (DeskData.Instance().isFenZhang) {
            cc.log('【分张摸牌】 开始');
        }
        var player = playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if (!player) {
            return;
        }
        //测试结算开牌
        // player.state = PlayerState.HUPAI;

        if (this.yidong_pai && this.yidong_pai.node && this.yidong_pai.node.active) {
            this.yidong_pai.node.active = false;
            this.pai_touched = null;
        }

        this.chupai_act = false;
        //胡牌时,摆牌使用开牌配置
        if (player.state == PlayerState.HUPAI) {
            this.resetBaiPai(player);
        }

        if (player.shoupai.length == 0) {
            return;
        }
        // if(!DeskData.isFenZhang && (player.shoupai.length == 4 || player.shoupai.length == 5) &&
        //     player.state != PlayerState.TINGPAI && player.state != PlayerState.HUPAI){
        //     DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [0,true]);
        // }else{
        //     DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [-2,false]);
        // }

        var shouPaiLen = player.shoupai.length;
        if (player.hasMoPai()) {
            shouPaiLen = player.shoupai.length - 1;
        }
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
            if (shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1) {
                this.shouPai[i].node.active = true;
                this.shouPai[i].selected = false;
                if (player.state == PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i, player.state, player.getBaiPaiNum() + count);
                } else {
                    this.setShouPaiAppearance(i, player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);
                if (player.state == PlayerState.HUPAI) {
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
            if (player.state == PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(13, player.state, player.getBaiPaiNum() + count);
            } else {
                this.setMoPaiAppearance(13, player.state);
            }
            var last_shou_pai = this.getLastShouPai();
            this.modepai.node.setPosition(last_shou_pai.node.x + this.getMoPaiShouPaiDis(player.state), last_shou_pai.node.y);
            // cc.log('手牌的最后X位置', last_shou_pai.node.x);
            // cc.log('摸牌X位置', this.modepai.node.x);
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if (player.state == PlayerState.HUPAI) {
                this.biaojiBaoPaiInShouPai(this.modepai);
            }
            if (player.state != PlayerState.HUPAI && player.state != PlayerState.TINGPAI) {
                cc.find("Canvas/game_menu_list").getComponent("tdhmj_game_menu_list").setMenus(player);
            }
        } else {
            this.modepai.node.active = false;
        }

        if (this.chupai_prompt) {
            this.chupai_prompt.active = player.hasMoPai() && DeskData.Instance().isGameStart && !playerMgr.Instance().playing_fapai_ani && !player.isBaoTing && player.state != PlayerState.HUPAI && !DeskData.Instance().isFenZhang;
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if (player.state == PlayerState.HUPAI) {
            this.shouPaiAlignCenterH();
        }

        if (DeskData.isFenZhang) {
            cc.log('【分张摸牌】 结束');
        }
        cc.log("【UI】" + "自己手牌:" + pai3d_value.descs(player.shoupai));
    },

    updateSelectedPai: function (player) {
        var player = playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if (!player) {
            return;
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
            10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };

        if (!shoupai_visible_cfg[shouPaiLen]) {
            cc.error("手牌数量错误  =", shouPaiLen);
        }

        var count = 0;
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1) {
                this.shouPai[i].node.active = true;
                if (!this.shouPai[i].selected) {

                    this.setShouPaiAppearance(i, player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);
                if (this.touchCardMode != TouchCardMode.DA_TING_PAI) {
                    this.shouPai[i].setTingPai(false);
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
        cc.log(this.viewIdx, '手牌偏移位置 = ' + offset_x);
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (this.shouPai[i].node.active) {
                this.shouPai[i].node.x = this.shouPai[i].frameCfg.x + offset_x;
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
        } else {
            this.modepai.node.active = false;
        }

        if (this.yidong_pai && this.yidong_pai.node && this.yidong_pai.node.active) {
            this.yidong_pai.node.active = false;
        }
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

    /**
     * 设置手牌的外观
     * @param idx
     * @param state
     */
    setShouPaiAppearance: function (idx, state, cfg_view_idx) {
        if (!cfg_view_idx) {
            cfg_view_idx = idx;
        }
        switch (state) {
            case PlayerState.TINGPAI:
                this.shouPai[idx].zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['value_' + cfg_view_idx]);
                this.shouPai[idx].setTouchAble(false);
                break;
            case PlayerState.HUPAI:
                this.shouPai[idx].kaipai(this.pai3dCfg.shoupai_kaipai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg);
                this.shouPai[idx].setTouchAble(false);
                this.shouPai[idx].mask.active = false;
                break;
            default:
                this.shouPai[idx].zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['value_' + cfg_view_idx]);
                this.shouPai[idx].setTouchAble(true);
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
            case PlayerState.HUPAI:
                this.modepai.kaipai(this.pai3dCfg.shoupai_kaipai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg);
                this.modepai.setTouchAble(false);
                this.modepai.mask.active = false;
                break;
            default:
                this.modepai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['value_' + cfg_view_idx]);
                this.modepai.setTouchAble(true);
                break;
        }
    },

    regTouchEvent: function () {
        this.touch_node.zIndex = UIZorder.MJ_TOUCH_NODE;
        this.touch_node.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        this.touch_node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.touch_node.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.touch_node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this));
    },

    touchStart: function (event) {
        if (DeskData.Instance().isHu) {
            return;
        }

        if (this.fenpai_touched) {
            return;
        }

        if (this.chupai_act) {
            return;
        }

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
                this.pai_touched.node.y = restPt_y() + chupai_offset;
                mj_audio.playAduio("select");
                this.biaojiPai(this.pai_touched.cardId);
            }

            if (this.touchCardMode == TouchCardMode.DA_TING_PAI) {
                this.closeJiaoInfo();
                cc.log("tdhmj touchStart openJiaoInfo");
                this.openJiaoInfo(this.pai_touched.cardId);
            }
        } else {
            this.resetSelected();
        }
    },

    touchMove: function (event) {
        if (DeskData.Instance().isHu) {
            return;
        }

        if (this.fenpai_touched) {
            return;
        }

        var pai_touched = this.getTouchPai(event);
        if (pai_touched) {//找到选择的牌
            //this.updateSelectedPai(UserPlayer);
            if (this.pai_touched) {
                this.pai_touched.node.active = true;
                this.yidong_pai.node.active = false
            }
            this.pai_touched = pai_touched;

            if (!this.pai_touched.selected) {
                this.resetSelected();
                this.pai_touched.selected = true;
                this.pai_touched.node.y = restPt_y() + chupai_offset;
                mj_audio.playAduio("select");
                this.biaojiPai(this.pai_touched.cardId);
                // if(this.yidong_pai.node.active == true)
                //     this.isCanMove = false;
            }
            if (pai_touched && this.touchCardMode == TouchCardMode.DA_TING_PAI) {
                this.closeJiaoInfo();
                this.openJiaoInfo(this.pai_touched.cardId);
            }
        }

        if (this.pai_touched &&                          //没有选择牌
            // this.touchCardMode == TouchCardMode.CHU_PAI && //非出牌模式的时候不能滑动
            !UserPlayer.canhu) {                          //胡牌的时候不能滑动

            if (new Date().getTime() - this.isCanMove > 50 || this.isCanMove == null) {
                this.isCanMove = null;

                this.yidong_pai.node.x = event.touch.getLocationX() - this._offsetX;
                this.yidong_pai.node.y = event.touch.getLocationY() - this._offsetY;
                if (this.yidong_pai.node.y > -260 * this._node_scale_y) {
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
                    this.yidong_pai.node.active = true;
                    this.pai_touched.node.active = false;
                    //滑动显示标记牌
                    this.biaojiPai(this.pai_touched.cardId);
                }
            }
        }
    },

    touchEnd: function (event) {
        if (DeskData.Instance().isHu) {
            this.yidong_pai.node.active = false;
            return;
        }

        if (DeskData.Instance().waitForSendOutCard) {
            this.resetSelected();
            return;
        }

        if (this.fenpai_touched) {
            return;
        }

        if (UserPlayer.canhu) {
            return;
        }

        if (!this.pai_touched) {
            return;
        } else {
            if (this.touchCardMode == TouchCardMode.DA_TING_PAI) {
                this.closeJiaoInfo();
                cc.log("tdhmj touchEnd openJiaoInfo");
                this.openJiaoInfo(this.pai_touched.cardId);
            }
        }

        this.pai_touched = null;
        this.isCanMove = null;

        if (this.yidong_pai.node.active) {
            if (this.yidong_pai.node.y > -200 * this._node_scale_y) {
                //出牌
                // this.resetSelected();

                playerED.notifyEvent(PlayerEvent.SHOW_CLICK, [UserPlayer, false, null, 1]);

                var jlmj_pai = this.getShouPai(this.yidong_pai.cardId);
                if (UserPlayer.isTempBaoTing) {
                    var tingType = 1;
                    if (UserPlayer.isTempGang) {
                        tingType = 2;
                    }
                    UserPlayer.setJiaoInfo(this.yidong_pai.cardId);
                    this.sendTingPai(this.yidong_pai.cardId, tingType);
                    if (jlmj_pai) {
                        //jlmj_pai.node.active = false;
                    }
                } else {
                    if (UserPlayer.hasMoPai()) {
                        // if(this.touchCardMode == TouchCardMode.DA_TING_PAI){
                        //     cc.log("tdhmj touchEnd sendOutCard");
                        //     UserPlayer.setJiaoInfo(this.yidong_pai.cardId);
                        // }
                        this.sendOutCard(this.yidong_pai.cardId);
                        this.setShoupaiTingbiaoji(false);
                        this.yidong_pai_show = true;
                        // this.yidong_pai.node.runAction(cc.moveTo(0.05,cc.v2(0,-142)));
                    } else {
                        this.yidong_pai.node.active = false;
                        this.updateSelectedPai(UserPlayer);
                    }
                }
            }
            else {
                this.quxiaoBiaoji();
                this.yidong_pai.node.active = false;
                this.updateSelectedPai(UserPlayer);
            }
        } else {
            var pai_touched = this.getTouchPai(event);

            if (!pai_touched) {
                this.resetSelected();
                return;
            }
            if (DeskData.Instance().sendCard && DeskData.Instance().sendCard == pai_touched.cardId) {
                this.resetSelected();
                return;
            }

            if (!pai_touched.doubleSelected) {
                if (event.touch.getLocationY() - this.yd_y > 40) {

                } else {
                    return;
                }
            }

            //出牌
            playerED.notifyEvent(PlayerEvent.SHOW_CLICK, [UserPlayer, false, null, 1]);
            if (UserPlayer.isTempBaoTing) {
                var tingType = 1;
                if (UserPlayer.isTempGang) {
                    tingType = 2;
                }
                UserPlayer.setJiaoInfo(pai_touched.cardId);
                this.sendTingPai(pai_touched.cardId, tingType);
                this.da_pai = true;
                /*if(!this.yidong_pai.cloned || this.yidong_pai.cardId != pai_touched.cardId){
                    this.yidong_pai.clone(pai_touched);
                    this.yidong_pai.node.parent = cc.find('Canvas');
                    this.yidong_pai.node.active = true;
                    pai_touched.node.active = false;
                    this.yidong_pai.node.x = pai_touched.node.x;
                    this.yidong_pai.node.y = pai_touched.node.y;
                    this.yidong_pai_show = true;
                    this.yidong_pai.node.runAction(cc.moveTo(0.05,cc.v2(0,-142)));
                }*/
            } else {
                if (UserPlayer.hasMoPai()) {
                    if (this.touchCardMode == TouchCardMode.DA_TING_PAI) {
                        cc.log("tdhmj touchEnd sendOutCard");
                        UserPlayer.setJiaoInfo(this.yidong_pai.cardId);
                    }
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
            pai_touched.node.y += chupai_offset;
            this.da_pai = false;
        }

        if (this.canTouchPaiAni) {
            this.canTouchPaiAni = false;

            if (cc.dd._.isUndefined(pai3d_value.desc[DeskData.Instance().sendCard])) {
                return;
            }

            DeskData.Instance().last_chupai_id = DeskData.Instance().sendCard
            playerMgr.Instance().shou2mid_id_list.push(DeskData.Instance().sendCard);
            UserPlayer.dapai(DeskData.Instance().sendCard);
        }
    },

    touchCancel: function (event) {
        if (this.pai_touched) {
            this.pai_touched.node.active = true;
        }
        this.pai_touched = null;
        this.isCanMove = null;
        this.yidong_pai.node.active = false;
        this.resetSelected();
    },

    getTouchPai: function (event) {
        for (var i in this.shouPai) {
            if (this.shouPai[i] && this.shouPai[i].isTouchDown(event)) {
                return this.shouPai[i];
            }
        }
        if (this.modepai.isTouchDown(event)) {
            return this.modepai;
        }
        return null;
    },

    /**
     * 恢复所有牌的初始化位置
     */
    resetSelected: function (cardID) {
        this.shouPai.forEach(function (pai) {
            pai.selected = false;
            pai.doubleSelected = false;
            pai.node.y = restPt_y();
        });

        this.modepai.selected = false;
        this.modepai.doubleSelected = false;
        this.modepai.node.y = restPt_y();

        this.quxiaoBiaoji();
        this.closeJiaoInfo();
    },

    /**
     * 清除选择牌的数据 以及还原牌的选择
     */
    crearSelectCard: function () {
        this.resetSelected();
    },

    /**
     * 根据自己手上选择的牌 标记桌面上相同的牌
     * @param  cardID //自己选择的牌
     */
    biaojiPai: function (selectId) {
        this.quxiaoBiaoji();
        this.biaoji = [];
        var play_list = cc.find('Canvas/player_list').getComponent('tdhmj_player_list');
        var userList = play_list.getUserList();
        for (var i in userList) {
            var com = userList[i].getComponent('tdhmj_player_down_ui');
            if (!com) {//因为自己方为jlmj_player_base_ui子类  直接用则出牌列表为空
                com = userList[i];
            }
            var tem = com.getPaiToID(selectId);
            this.biaoji = this.biaoji.concat(tem);
        }
        for (var i = 0; this.biaoji && i < this.biaoji.length; ++i) {
            this.biaoji[i].setSelectedBiaoji(true);
        }
    },

    quxiaoBiaoji: function () {
        if (this.biaoji) {
            for (var i = 0; i < this.biaoji.length; ++i) {
                if (this.biaoji[i] && this.biaoji[i].node && this.biaoji[i].node.isValid) {
                    this.biaoji[i].setSelectedBiaoji(false);
                }
            }
        }
        this.biaoji = null;
    },

    /**
     * 听牌发送
     * @param playCardId 出牌
     */
    sendTingPai: function (playCardId, tingType) {
        if (playCardId < 0) {
            cc.error("听后出的牌为空")
            return;
        }

        if (UserPlayer.shoupai.indexOf(playCardId) == -1) {
            cc.error('不存在要听的手牌' + playCardId);
            return;
        }

        UserPlayer.waitTing = true;
        var msg = new cc.pb.neimenggumj.neimenggu_req_tingpai_out_card();
        msg.setCardid(playCardId);
        msg.setTingtype(tingType);

        cc.gateNet.Instance().sendMsg(cc.netCmd.neimenggumj.cmd_neimenggu_req_tingpai_out_card, msg, "cmd_neimenggu_req_tingpai_out_card");
        cc.dd.NetWaitUtil.net_wait_start();
    },


    /**
     * 发送出牌
     */
    sendOutCard: function (cardID) {
        if (DeskData.Instance().waitForSendOutCard) {
            return
        }

        if (UserPlayer.shoupai.indexOf(cardID) == -1) {
            cc.error('不存在要出的手牌' + cardID);
            return;
        }

        DeskData.Instance().waitForSendOutCard = true;

        DeskData.Instance().sendCard = cardID;
        this.canTouchPaiAni = true;
        this.quxiaoBiaoji();
        var msg = new cc.pb.neimenggumj.neimenggu_req_game_send_out_card();
        msg.setCardid(cardID);
        cc.gateNet.Instance().sendMsg(cc.netCmd.neimenggumj.cmd_neimenggu_req_game_send_out_card, msg, "neimenggu_req_game_send_out_card");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    zhanli: function () {
        this.shouPai.forEach(function (jlmj_pai, idx) {
            if (jlmj_pai) {
                jlmj_pai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + idx], this.pai3dCfg.shoupai_zhanli_cfg['value_' + idx]);
                jlmj_pai.setTouchAble(true);
            }
        }, this);
        var _idx = 13;
        this.modepai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + _idx], this.pai3dCfg.shoupai_zhanli_cfg['value_' + _idx]);
        var lastPos = this.modepai.node.getPosition();
        this.modepai.node.setPosition(lastPos.x + this.pai3dCfg.mopai.offsetX, lastPos.y + this.pai3dCfg.mopai.offsetY);
        this.modepai.setTouchAble(true);
    },

    mopai: function (userplayer) {
        this.updateShouPai(userplayer);
        this.quxiaoBiaoji();
    },
    /**
     * 自动打牌
     * @param userplayer
     */
    autoChupai: function (palyData, cardId) {
        setTimeout(function () {
            if (palyData.ishavePai(cardId)) {
                this.sendOutCard(cardId);
                this.setShoupaiTingbiaoji(false);
            }
        }.bind(this), 500);
    },


    dapai: function (userplayer, chupai_idx_in_shoupai) {
        // if(UserPlayer.mid2dapai_playing){
        //     cc.error('玩家正在出牌')
        //     return;
        // }
        // UserPlayer.mid2dapai_playing = true;

        this.modepai.node.active = false;
        //this.chupai_act = true;
        var pai_node = cc.instantiate(this.prefab_pai);
        //this.node.addChild(pai_node);
        this.chupai_node.addChild(pai_node);
        this.chuPai.push(pai_node);
        var jlmj_pai = pai_node.getComponent("jlmj_pai");
        if (!jlmj_pai) {
            cc.error("麻将牌没有jlmj_pai组件")
        }
        var idx = userplayer.chupai.length - 1;
        var cur_idx = userplayer.chupai.length - 1;
        var last_chupai_idx = this.chuPai.length - 1;
        if (playerMgr.Instance().playerList.length == 2) {
            // let count = DeskData.Instance().getIs2D() ? 19 : 18;
            // let total = 2;
            // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
            // var cur_pai = (this.chuPai.length - 1) % count;
            // var cur_id = pos_id * count + cur_pai;
            // cur_idx = cur_id;
            // last_chupai_idx = cur_id;
        }

        var value = userplayer.chupai[idx];
        jlmj_pai.kaipai(this.getDaPaiCfg()['frame_' + cur_idx], this.getDaPaiCfg()['value_' + cur_idx], this.pai3dCfg.dapai_cfg);
        jlmj_pai.setValue(value);
        cc.log("【UI】" + "玩家:" + userplayer.userId + " 座位号:" + userplayer.idx + " 打牌:" + pai3d_value.desc[value]);

        //出牌动画
        this.stop_chupai_ani();
        this.play_chupai_ani(userplayer, chupai_idx_in_shoupai, last_chupai_idx, value);
    },

    stop_chupai_ani: function () {
        this.zhanshi_pai.node.stopAllActions();
        this.mid2dapai_playing = false;
        this.zhanshi_pai.node.active = false;
        // this.zhanshi_pai.ani.stop();
        this.chuPai.forEach(function (pai) {
            pai.active = true;
        });
    },


    play_chupai_ani: function (userplayer, chupai_idx_in_shoupai, last_chupai_idx, cardID) {
        //中间牌转变打牌end
        var mid2dapaiEnd = function () {
            // UserPlayer.mid2dapai_playing = false;
            // if(cc.dd._.isArray(UserPlayer.waitDapai) && UserPlayer.waitDapai.length > 0){
            //     let pai = UserPlayer.waitDapai.shift();
            //     playerMgr.Instance().shou2mid_id_list.push(pai);
            //     UserPlayer.dapai(pai);
            // }

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
            playerMgr.Instance().playerMoPaiAction();
        }.bind(this);

        // playerMgr.Instance().playing_shou2mid_ani = true;
        this.chuPai[this.chuPai.length - 1].active = false;
        this.zhanshi_pai.setValue(cardID);

        //this.updateShouPai(UserPlayer);
        DeskData.Instance().sendCard = null;
        // this.zhanshi_pai.ani.on('finished', shou2midEnd);

        cc.log('手牌-中间牌-start');
        this.zhanshi_pai.node.active = true;
        if (this.yidong_pai && this.yidong_pai.node) {
            this.yidong_pai.node.active = false;
            if (!this.yidong_pai_show && this.pai_touched) {
                this.pai_touched.node.active = true;
                this.resetSelected();
            }
        }

        //新
        this.zhanshi_pai.node.active = true;

        var id = playerMgr.Instance().shou2mid_id_list.pop();
        playerMgr.Instance().mid2dapai_id_list.push(id);

        if (playerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
            cc.log('下家正常摸牌了,播放入牌海动画');
            cc.dd._.pull(playerMgr.Instance().mid2dapai_id_list, cardID);
        }
        let config = this.getDaPaiCfg();
        let targetPos = cc.v2(config['frame_' + last_chupai_idx].x, config['frame_' + last_chupai_idx].y);
        this.zhanshi_pai.kaipai(config['frame_' + last_chupai_idx], config['value_' + last_chupai_idx], this.pai3dCfg.dapai_cfg, null, config['hunpai_' + last_chupai_idx]);
        //新

        // this.reset_zhanshi_pai();
        this.zhanshi_pai.node.stopAllActions();

        var idx = chupai_idx_in_shoupai;
        if (chupai_idx_in_shoupai == UserPlayer.shoupai.length) { //打牌后,此时牌数据已经少了一张
            this.modepai.node.active = false;
            this.modepai.node.y = restPt_y();
            if (this.yidong_pai_show) {
                this.zhanshi_pai.node.x = this.yidong_pai.node.x;
                this.zhanshi_pai.node.y = this.yidong_pai.node.y;
                this.yidong_pai_show = null;
            } else {
                this.zhanshi_pai.node.x = this.modepai.node.x;
                this.zhanshi_pai.node.y = this.modepai.node.y + chupai_offset;
            }
        } else {
            var shoupai_visible_cfg = {
                1: [12],
                4: [9, 10, 11, 12],
                7: [6, 7, 8, 9, 10, 11, 12],
                10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            };
            if (!shoupai_visible_cfg[UserPlayer.shoupai.length]) {
                cc.error('手牌数量不正确' + UserPlayer.shoupai.length, ' ' + pai3d_value.descs(UserPlayer.shoupai));
                mid2dapaiEnd();
                return;
            }
            idx = shoupai_visible_cfg[UserPlayer.shoupai.length][chupai_idx_in_shoupai];
            this.shouPai[idx].node.active = false;
            this.shouPai[idx].node.y = restPt_y();
            if (this.yidong_pai_show) {
                this.zhanshi_pai.node.x = this.yidong_pai.node.x;
                this.zhanshi_pai.node.y = this.yidong_pai.node.y;
                this.yidong_pai_show = null;
            } else {
                this.zhanshi_pai.node.x = this.shouPai[idx].node.x;
                this.zhanshi_pai.node.y = this.shouPai[idx].node.y + chupai_offset;
            }
        }

        var seq = cc.sequence(
            cc.callFunc(() => {
                mj_audio.playAduio('dapai');
            }),
            cc.moveTo(0.2, targetPos).easing(cc.easeQuarticActionOut(3.0)),
            cc.callFunc(mid2dapaiEnd.bind(this))
        );
        this.zhanshi_pai.node.runAction(seq);
        mj_audio.playAduio('effect_sendcard');
        //插牌动画
        this.pluggedPai(userplayer, chupai_idx_in_shoupai);
    },

    // play_chupai_ani: function (userplayer, chupai_idx_in_shoupai, last_chupai_idx, cardID) {
    //     //中间牌转变打牌end
    //     var mid2dapaiEnd = function () {
    //         this.mid2dapai_playing = false;
    //         this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
    //         if (this.zhanshi_pai.cardId != cardID) {
    //             cc.log("出牌动画-提前结束");
    //             return;
    //         }
    //         cc.log('中间牌-打牌-end');
    //         this.zhanshi_pai.node.active = false;
    //         if (this.chuPai.length <= 0) {
    //             return;
    //         }
    //         //var last_chupai_idx = this.chuPai.length - 1;
    //         this.chuPai[this.chuPai.length - 1].active = true;
    //         this.setZsq(this.chuPai[this.chuPai.length - 1], this.viewIdx);
    //         playerMgr.Instance().playerMoPaiAction();
    //     }.bind(this);
    //     //中间牌转变打牌
    //     var mid2dapai = function () {
    //         if (this.zhanshi_pai.cardId != cardID) {
    //             cc.log("出牌动画-提前结束");
    //             return;
    //         }
    //         cc.log('中间牌-打牌-start');
    //         if (this.chuPai.length <= 0) {
    //             return;
    //         }
    //         //var last_chupai_idx = this.chuPai.length - 1;
    //         cc.loader.loadRes(this.getMid2DaPaiAniPath() + last_chupai_idx, function (err, clip) {
    //             if (err != null) {
    //                 cc.error(err.message);
    //             }
    //             if (this.zhanshi_pai.cardId != cardID) {
    //                 cc.log("出牌动画-提前结束");
    //                 return;
    //             }
    //             setTimeout(function () {
    //                 this.mid2dapai_playing = true;
    //             }.bind(this),200);
    //             this.zhanshi_pai.ani.removeClip('mid2dapai');
    //             this.zhanshi_pai.ani.addClip(clip, 'mid2dapai');
    //             this.zhanshi_pai.ani.play('mid2dapai');
    //             this.zhanshi_pai.ani.on('finished', mid2dapaiEnd);
    //             mj_audio.playAduio('dapai');
    //         }.bind(this));
    //     }.bind(this);
    //     //手牌转变中间牌end
    //     var shou2midEnd = function () {
    //         this.zhanshi_pai.ani.off('finished', shou2midEnd);
    //         if (this.zhanshi_pai.cardId != cardID) {
    //             cc.log("出牌动画-提前结束");
    //             playerMgr.Instance().playing_shou2mid_ani = false;
    //             return;
    //         }
    //         cc.log('手牌-中间牌-end');
    //
    //         var id = playerMgr.Instance().shou2mid_id_list.pop();
    //         playerMgr.Instance().mid2dapai_id_list.push(id);
    //
    //         if(DeskData.Instance().dabaoing){   //打宝中,暂停播放打牌动画
    //             // this.dapai_ani_paused = true;
    //             playerMgr.Instance().dabaoing_chupai_id = cardID;
    //             return;
    //         }else{
    //             setTimeout(function () {
    //                 playerMgr.Instance().playing_shou2mid_ani = false;
    //                 playerMgr.Instance().playerMoPaiAction();
    //                 if(playerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1){   //下家正常摸牌了,播放入牌海动画
    //                     cc.log('下家正常摸牌了,播放入牌海动画');
    //                     cc.dd._.pull(playerMgr.Instance().mid2dapai_id_list, cardID);
    //                     mid2dapai();
    //                 }
    //             }.bind(this), 300);
    //         }
    //     }.bind(this);
    //
    //     playerMgr.Instance().playing_shou2mid_ani = true;
    //     this.chuPai[this.chuPai.length - 1].active = false;
    //     this.zhanshi_pai.setValue(cardID);
    //
    //     //this.updateShouPai(UserPlayer);
    //     DeskData.Instance().sendCard = null;
    //     // this.zhanshi_pai.ani.on('finished', shou2midEnd);
    //
    //     cc.log('手牌-中间牌-start');
    //     this.zhanshi_pai.node.active = true;
    //     if(this.yidong_pai && this.yidong_pai.node){
    //         this.yidong_pai.node.active = false;
    //     }
    //
    //     this.reset_zhanshi_pai();
    //     var idx = chupai_idx_in_shoupai;
    //     if(chupai_idx_in_shoupai == UserPlayer.shoupai.length){ //打牌后,此时牌数据已经少了一张
    //         this.modepai.node.active = false;
    //         this.modepai.node.y = restPt_y();
    //         if(this.yidong_pai_show){
    //             this.zhanshi_pai.node.x = this.yidong_pai.node.x;
    //             this.zhanshi_pai.node.y = this.yidong_pai.node.y;
    //             this.yidong_pai_show = null;
    //         }else{
    //             this.zhanshi_pai.node.x = this.modepai.node.x;
    //             this.zhanshi_pai.node.y = this.modepai.node.y + chupai_offset;
    //         }
    //     }else{
    //         var shoupai_visible_cfg = {
    //             1:  [12],
    //             4:  [9,10,11,12],
    //             7:  [6,7,8,9,10,11,12],
    //             10: [3,4,5,6,7,8,9,10,11,12],
    //             13: [0,1,2,3,4,5,6,7,8,9,10,11,12],
    //         };
    //         idx = shoupai_visible_cfg[UserPlayer.shoupai.length][chupai_idx_in_shoupai];
    //         this.shouPai[idx].node.active = false;
    //         this.shouPai[idx].node.y = restPt_y();
    //         if(this.yidong_pai_show){
    //             this.zhanshi_pai.node.x = this.yidong_pai.node.x;
    //             this.zhanshi_pai.node.y = this.yidong_pai.node.y;
    //             this.yidong_pai_show = null;
    //         }else {
    //             this.zhanshi_pai.node.x = this.shouPai[idx].node.x;
    //             this.zhanshi_pai.node.y = this.shouPai[idx].node.y + chupai_offset;
    //         }
    //     }
    //     this.zhanshi_pai.node.stopAllActions();
    //     var seq = cc.sequence(
    //         cc.moveTo(0.05,cc.v2(0,-142)),
    //         cc.delayTime(0.03),
    //         cc.callFunc(shou2midEnd.bind(this))
    //     );
    //     this.zhanshi_pai.node.runAction(seq);
    //     mj_audio.playAduio('effect_sendcard');
    //     //插牌动画
    //     this.pluggedPai(userplayer, chupai_idx_in_shoupai);
    // },

    pluggedPai: function (player, kongpai_idx) {
        if (!player.replaying && kongpai_idx != UserPlayer.shoupai.length) {
            //插牌动画
            if (this.chupai_act) {
                cc.log('【插入手牌动画中】退出');
                return;
            } else {
                this.chupai_act = true;
                cc.log('【插入手牌动画】 开始');
            }
            var paiShow = function () {
                if (!player.replaying) {
                    this.modepai.node.active = false;
                    cc.log('【更新手牌】 开始');
                    cc.log('【插入手牌动画】 结束');
                    this.updateShouPai(UserPlayer);
                    this.modepai.node.x = this.modepai.original_x;
                    this.modepai.node.y = this.modepai.original_y;
                    this.chupai_act = false;
                }
            }.bind(this);

            this.modepai.original_x = this.modepai.node.x;
            this.modepai.original_y = this.modepai.node.y;
            var px_id = 0;
            var shoupai_visible_cfg = {
                1: [12],
                4: [9, 10, 11, 12],
                7: [6, 7, 8, 9, 10, 11, 12],
                10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            };

            var kp_idx = shoupai_visible_cfg[UserPlayer.shoupai.length][kongpai_idx];

            for (var i = 0, len = player.shoupai.length; i < len; ++i) {
                if (this.modepai.cardId == player.shoupai[i]) {
                    px_id = shoupai_visible_cfg[player.shoupai.length][i];
                    break;
                }
            }
            this.chapai_x = this.shouPai[px_id].node.x;
            this.chapai_y = this.shouPai[px_id].node.y;

            this.modepai.node.active = true;
            this.shouPai[kp_idx].node.active = false;

            //插牌动画
            if (px_id == this.shouPai.length - 1) {
                this.modepai.node.runAction(cc.sequence(
                    cc.delayTime(0.4),
                    cc.moveTo(0.2, this.chapai_x, this.chapai_y).easing(cc.easeSineInOut()),
                    cc.callFunc(paiShow.bind(this))
                ));
            } else {
                var start_pos = cc.v2(this.modepai.node.x, this.modepai.node.y + this.modepai.node.height);
                var end_pos = cc.v2(this.chapai_x, this.chapai_y + this.modepai.node.height);
                var q2x = start_pos.x + (end_pos.x - end_pos.x) / 2.0;
                var q2 = cc.v2(q2x, start_pos.y);

                var bezier = [start_pos, q2, end_pos];
                this.modepai.node.runAction(cc.sequence(
                    cc.rotateBy(0.1, 30),
                    cc.bezierTo(0.3, bezier).easing(cc.easeSineOut()),
                    cc.spawn(
                        cc.rotateBy(0.1, -30),
                        cc.moveTo(0.1, this.chapai_x, this.chapai_y).easing(cc.easeSineInOut())
                    ),
                    cc.delayTime(0.2),
                    cc.callFunc(paiShow.bind(this))
                ));
            }

            //合牌动画
            if (px_id > kp_idx) {
                for (var i = px_id; i > kp_idx; --i) {
                    var pai = this.shouPai[i];
                    pai.original_x = pai.node.x;
                    pai.original_y = pai.node.y;
                    pai.node.runAction(
                        cc.sequence(
                            cc.delayTime(0.4),
                            cc.moveTo(0.1, this.shouPai[i - 1].node.x, this.shouPai[i - 1].node.y).easing(cc.easeSineInOut())
                        )
                    );
                }
            } else if (px_id < kp_idx) {
                for (var i = px_id; i < kp_idx; ++i) {
                    var pai = this.shouPai[i];
                    pai.original_x = pai.node.x;
                    pai.original_y = pai.node.y;
                    pai.node.runAction(
                        cc.sequence(
                            cc.delayTime(0.4),
                            cc.moveTo(0.1, this.shouPai[i + 1].node.x, this.shouPai[i + 1].node.y).easing(cc.easeSineInOut())
                        )
                    );
                }
            }
        } else {
            // UserPlayer.mid2dapai_playing = false;
            this.updateShouPai(UserPlayer);
        }
    },

    update: function () {
        if (this.mid2dapai_playing && this.zhanshi_pai.node.active) {
            var length = this.chuPai.length;
            if (length >= 12) {
                var x = this.getDaPaiCfg()['frame_' + (length - 1)].x;
                var y = this.getDaPaiCfg()['frame_' + (length - 1)].y;
                var width = this.getDaPaiCfg()['frame_' + (length - 1)].sizeW;
                var height = this.getDaPaiCfg()['frame_' + (length - 1)].sizeH;
                var order_rect = cc.rect(x - width / 2, y - height / 2, width, height);
                if (order_rect.contains(this.zhanshi_pai.node.getPosition())) {
                    this.zhanshi_pai.node.active = false;
                    this.chuPai.forEach(function (pai) {
                        pai.active = true;
                    });
                    var last_chupai_idx = this.chuPai.length - 1;
                    this.setZsq(this.chuPai[last_chupai_idx], this.viewIdx);
                }
            }
        }
    },

    /**
     * 播放中间牌->打牌动作
     */
    play_mid2dapai_ani: function (id) {
        // if(!this.dapai_ani_paused){
        //     return;
        // }
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
            // if (this.zhanshi_pai.cardId != cardID) {
            //     cc.log("出牌动画-提前结束");
            //     return;
            // }
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                return;
            }
            var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[last_chupai_idx].active = true;
            this.setZsq(this.chuPai[last_chupai_idx], this.viewIdx);
            playerMgr.Instance().playerMoPaiAction();
        }.bind(this);
        //中间牌转变打牌
        var mid2dapai = function () {
            // if (this.zhanshi_pai.cardId != cardID) {
            //     cc.log("出牌动画-提前结束");
            //     return;
            // }
            cc.log('中间牌-打牌-start');
            if (this.chuPai.length <= 0) {
                return;
            }
            var player_list = playerMgr.Instance().playerList;
            var last_chupai_idx = this.chuPai.length - 1;
            if (player_list.length == 2) {
                // let count = DeskData.Instance().getIs2D() ? 19 : 18;
                // let total = 2;
                // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
                // var cur_pai = (this.chuPai.length - 1) % count;
                // last_chupai_idx = pos_id * count + cur_pai;
            }
            cc.resources.load(this.getMid2DaPaiAniPath() + last_chupai_idx, function (err, clip) {
                if (err != null) {
                    cc.error(err.message);
                }
                // if (this.zhanshi_pai.cardId != cardID) {
                //     cc.log("出牌动画-提前结束");
                //     return;
                // }
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

        mid2dapai();
    },

    /**
     * 打开叫牌信息
     * @param out_id
     */
    openJiaoInfo: function (out_id) {
        /*if (!UserPlayer.isTempBaoTing) {
            return;
        }*/

        var jiaoInfo = UserPlayer.getJiaoInfo(out_id);
        if (!jiaoInfo) {
            return;
        }
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_JIAOPAI_INFO, function (ui) {
            var play_list = cc.find('Canvas/player_list').getComponent('tdhmj_player_list');
            var mj_jiao_info = ui.getComponent('mj_jiao_info');
            play_list.node.zIndex = UIZorder.MJ_JIAOINFO_UI;
            mj_jiao_info.init(play_list);
            mj_jiao_info.setJiaoPaiList(jiaoInfo.jiao_pai_list);
        }.bind(this));
    },

    /**
     * 关闭叫牌信息
     */
    closeJiaoInfo: function () {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_JIAOPAI_INFO);
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
    /**
     * 显示或者隐藏牌的可操作
     * @param isShow
     * @param canCradList
     */
    showHideClickCard: function (isShow, canCradList, type) {
        this.touchCardMode = type || 1;
        isShow = isShow || false;
        if (isShow && canCradList) {//可以操作canCardList中牌
            this.openPaitouch(canCradList);
        } else {//全部牌可以操作
            //可以听牌时要把牌处理成不能选状态
            this.setShoupaiTouch(!UserPlayer.isBaoTing);
            if (this.modepai) {
                this.modepai.setTouchAble(true);
            }
        }
    },

    showDaPaiTing: function (isShow, canCradList, type) {
        this.setShoupaiTingbiaoji(false);
        this.touchCardMode = type || 4;
        isShow = isShow || false;
        if (isShow && canCradList) {//可以操作canCardList中牌
            for (var i = 0; i < canCradList.length; ++i) {
                var shoupai = this.getShouPai(canCradList[i]);
                if (shoupai) {
                    shoupai.setTouchAble(true);
                    shoupai.setTingPai(true);
                } else {
                    cc.error("【UI】" + "用户玩家中不存在牌:" + pai3d_value.desc[canCradList[i]]);
                }
            }
        }
    },

    /**
     * 开启部分牌的触摸
     * @param cardList
     */
    openPaitouch: function (canCradList) {

        if (this.modepai) {
            this.modepai.setTouchAble(false);
        }
        this.setShoupaiTouch(false);//关闭手牌的触摸
        for (var i = 0; i < canCradList.length; ++i) {
            var shoupai = this.getShouPai(canCradList[i]);
            if (shoupai) {
                shoupai.setTouchAble(true);
                if (this.touchCardMode == 3) {
                    shoupai.setTingPai(true);
                }
            } else {
                cc.error("【UI】" + "用户玩家中不存在牌:" + pai3d_value.desc[canCradList[i]]);
            }
        }
    },


    /**
     * gm更新手牌
     */
    gmUpdateShouPai: function (data) {
        var userplayer = data[0];
        this.updateShouPai(userplayer);

    },

    /**
     * 听
     * @param data
     */
    ting: function (player) {
        this.updateShouPai(player);
        this.setShoupaiTouch(false);
        this.closeJiaoInfo();
        var desk_info = cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info');
        desk_info.setTingPaiUIActive(true);

        mj_audio.playAudioBySex("ting", player.sex);
        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('ting',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);
        this.playSpine(this.cpgtgh_ani, ['ting', 'tingXS']);
        DeskED.notifyEvent(DeskEvent.UPDATE_BAO_PAI, []);
    },

    /**
     * 清理
     * @param data
     */
    clear: function (data) {
        cc.log("player_down_ui 清理桌子");
        this.shouPai.forEach(function (pai) {
            pai.setTouchAble(true);
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
        this.head.setZJ(false);
        this.head.setTing(false);

        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;
        if (this.chupai_prompt) {
            this.chupai_prompt.active = false;
        }
        this.jbdga_ani_state(false);
        this.setFenPaiTouched(false);
        this.setShoupaiTingbiaoji(false);
    },
    /**
     * 打开 或者关闭手牌mask
     */
    setShoupaiTouch: function (isShow) {
        this.shouPai.forEach(function (pai) {
            pai.setTouchAble(isShow);
        });
    },

    setShoupaiTingbiaoji: function (isShow) {
        this.modepai.setTingPai(isShow);
        this.shouPai.forEach(function (pai) {
            pai.setTingPai(isShow);
        });
    },

    setFenPaiTouched: function (isShow) {
        this.fenpai_touched = isShow;
    },

    //切后台
    sysPause: function () {
        if (this.yidong_pai && this.yidong_pai.node) {
            this.yidong_pai.node.active = false;
        }
    },
});
