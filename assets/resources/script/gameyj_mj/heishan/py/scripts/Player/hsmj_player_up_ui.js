var playerED = require("hsmj_player_data").PlayerED;
var PlayerState = require("hsmj_player_data").PlayerState;
var playerMgr = require('hsmj_player_mgr');
var pai3d_value = require('jlmj_pai3d_value');
var DeskData = require("hsmj_desk_data").DeskData;

var UIZorder = require("mj_ui_zorder");
cc.Class({
    extends: require('hsmj_player_base_ui'),

    properties: {

    },

    resetConfig(){
        let use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
        this.pai3dCfg = use2D ? require("jlmj_pai3d_up_2d").Instance() : require("jlmj_pai3d_up").Instance();
        let path = use2D ? '_2d' : '';
        this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai'+path+'/up/jlmj_shou2mid_up_';
    },

    initPai: function () {
        this.resetConfig();
        this.viewIdx = 2;
        var res_pai = cc.find('Canvas/mj_res_pai');
        if(!res_pai){
            return null;
        }
        this.ccgpai_prefab = res_pai.getComponent('mj_res_pai').jlmj_ccgpai_up;
    },

    // use this for initialization
    onLoad: function () {
        cc.log('hsmj_player_up_ui onLoad');
        this.zhanshi_pai = cc.find("Canvas/desk_node/zhanshi_pais/jlmj_zhanshi_pai_up").getComponent('jlmj_pai');     //展示牌
        // cc.find("Canvas/desk_node/jlmj_player_up_ui/mj_playerHead").zIndex = UIZorder.MJ_LAYER_TOP;
        this.chupai_node = cc.find("Canvas/desk_node/chupai_up_node");

        this.initPai();
        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_u").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_u").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_u").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_u").getComponent(sp.Skeleton);
        // this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_u").getComponent(sp.Skeleton);
        this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_u").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_u").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_u").getComponent(sp.Skeleton);

        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;

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

        switch (playerMgr.Instance().playerList.length){
            case 3:
                return 'gameyj_mj/common/animations/pai3'+path+'/up/jlmj_mid2dapai_up_';
            case 2:
                return 'gameyj_mj/common/animations/pai2'+path+'/up/jlmj_mid2dapai_up_';
            default:
                return 'gameyj_mj/common/animations/pai'+path+'/up/jlmj_mid2dapai_up_';
        }
    },

    getBaipaiShouPaiDis: function (state) {
        if(state == PlayerState.DAPAI){
            return -58;
        }else if(state == PlayerState.TINGPAI){
            return -58;
        }else{
            return -58;
        }
    },

    getMoPaiShouPaiDis: function (state) {
        if(state == PlayerState.DAPAI){
            return -50;
        }else if(state == PlayerState.TINGPAI){
            return -50;
        }else{
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
        if(this.baipai_ui_list.length>0){
            var first_baipai_ui = this.baipai_ui_list[0];
            first_pai = first_baipai_ui.pais[0].node;
        }
        for(var i=0; i<this.shouPai.length; ++i){
            if(this.shouPai[i].node.active){
                if(!first_pai){
                    first_pai = this.shouPai[i].node;
                }
                last_pai = this.shouPai[i].node;
            }
        }
        if(this.modepai.node.active){
            last_pai = this.modepai.node;
        }
        offset_x = (Math.abs(first_pai.x) - Math.abs(last_pai.x))/2;
        if(Math.abs(first_pai.x) > Math.abs(last_pai.x)){
            offset_x = -Math.abs(offset_x);
        }else{
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
        if(this.isResetBaiPai){
            this.needUpdateShouPai = true;
            return;
        }
        var player = playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if(!player){
            return;
        }
        //测试结算开牌
        // player.state = PlayerState.HUPAI;

        //胡牌时,摆牌先重置,再排版
        if(player.state == PlayerState.HUPAI){
            this.resetBaiPai(player);
        }

        if(player.shoupai.length == 0){
            return;
        }
        var shouPaiLen = player.shoupai.length;
        if(player.hasMoPai()){
            shouPaiLen = player.shoupai.length - 1;
        }

        var shoupai_visible_cfg = {
            1:  [12],
            4:  [9,10,11,12],
            7:  [6,7,8,9,10,11,12],
            10: [3,4,5,6,7,8,9,10,11,12],
            13: [0,1,2,3,4,5,6,7,8,9,10,11,12],
        };

        if(!shoupai_visible_cfg[shouPaiLen]){
            cc.error("对家手牌数量错误  =", shouPaiLen);

            if(!cc.dd._mj_shoupai_reconnectd){
                cc.dd._mj_shoupai_reconnectd = true;

                cc.log("开始重连麻将"+cc.dd.AppCfg.GAME_ID+"玩家ID"+player.userId);
                var login_module = require('LoginModule');
                login_module.Instance().reconnectWG();
                return;
            }
        }

        var count = 0;
        for(var i=0; i<this.shouPai.length; ++i){
            if(shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1){
                this.shouPai[i].node.active = true;
                if(player.state == PlayerState.HUPAI){  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i,player.state, player.getBaiPaiNum()+count);
                }else{
                    this.setShouPaiAppearance(i,player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);
                if(player.state == PlayerState.HUPAI){
                    this.biaojiBaoPaiInShouPai(this.shouPai[i]);
                }
                count++;
            }else{
                this.shouPai[i].node.active = false;
            }
        }

        var offset_x = 0;
        if(this.baipai_ui_list.length>0){
            var last_baipai_ui = this.baipai_ui_list[this.baipai_ui_list.length-1];
            var last_pai = last_baipai_ui.pais[last_baipai_ui.pais.length-1];
            var first_idx = shoupai_visible_cfg[shouPaiLen][0];
            var start_x = this.shouPai[first_idx].frameCfg.x;
            var target_x = last_pai.node.x + this.getBaipaiShouPaiDis(player.state);
            offset_x = target_x - start_x;
        }
        cc.log('手牌偏移位置 = '+ offset_x);
        for(var i=0; i<this.shouPai.length; ++i){
            if(this.shouPai[i].node.active){
                this.shouPai[i].node.x = this.shouPai[i].frameCfg.x + offset_x;
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
            if(player.state == PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(13,player.state,player.getBaiPaiNum()+count);
            }else{
                this.setMoPaiAppearance(13,player.state);
            }
            var last_shou_pai = this.getLastShouPai();
            this.modepai.node.setPosition(last_shou_pai.node.x+this.getMoPaiShouPaiDis(player.state),last_shou_pai.node.y);
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if(player.state == PlayerState.HUPAI){
                this.biaojiBaoPaiInShouPai(this.modepai);
            }
        }else{
            this.modepai.node.active = false;
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if(player.state == PlayerState.HUPAI){
            this.shouPaiAlignCenterH();
        }
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
            if(pai.node.active){
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
        if(player_list.length == 2){
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
        if(player_list.length == 2 && !DeskData.Instance().getIs2D()){
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
            if(is_reverse){
                // let count = DeskData.Instance().getIs2D() ? 19 : 18;
                // let total = 2;
                // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
                // cur_id = pos_id * count + (this.chuPai.length - 1) % count;
            }
            var value = player.chupai[idx];
            jlmj_pai.kaipai(this.getDaPaiCfg()['frame_' + cur_id], this.getDaPaiCfg()['value_' + cur_id], this.pai3dCfg.dapai_cfg);
            jlmj_pai.setValue(value);
            if(is_reverse && !DeskData.Instance().getIs2D()){
                jlmj_pai.node.y -= jlmj_pai.node.width * 0.4;
            }
        }
    },
});
