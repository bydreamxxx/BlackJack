var playerED = require("fxmj_player_data").PlayerED;
var PlayerState = require("fxmj_player_data").PlayerState;
var playerMgr = require('fxmj_player_mgr');
var DeskData = require('fxmj_desk_data').DeskData;

var UIZorder = require("mj_ui_zorder");
cc.Class({
    extends: require('fxmj_xd_player_base_ui'),

    properties: {

    },

    resetConfig(){
        let use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
        this.pai3dCfg = use2D ? require("jlmj_pai3d_right_2d").Instance() : require("jlmj_pai3d_right").Instance();
        let path = use2D ? '_2d' : '';
        this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai'+path+'/right/jlmj_shou2mid_right_';
    },

    initPai: function () {
        this.resetConfig();
        this.viewIdx = 1;
        var res_pai = cc.find('Canvas/mj_res_pai');
        if(!res_pai){
            return null;
        }
        this.ccgpai_prefab = res_pai.getComponent('mj_res_pai').jlmj_ccgpai_right;
    },

    // use this for initialization
    onLoad: function () {
        cc.log('fxmj_player_right_ui onLoad');
        this._super();
        this.zhanshi_pai = cc.find("Canvas/zhanshi_pais/jlmj_zhanshi_pai_right").getComponent('jlmj_pai');     //展示牌
        this.node_hu_1 = cc.find("Canvas/play_anis/jlmj_hu_ani_1_r");
        this.node_hu_2 = cc.find("Canvas/play_anis/jlmj_hu_ani_2_r");
        this.node_hu_3 = cc.find("Canvas/play_anis/jlmj_hu_ani_3_r");
        this.tcp_ani = cc.find("Canvas/play_anis/jlmj_tcp_ani_r");
        this.jbdga_ani = cc.find("Canvas/play_anis/jlmj_jbdga_ani_r");
        cc.find("Canvas/player_right_ui/com_game_head").zIndex = UIZorder.MJ_LAYER_TOP;
        this.chupai_node = cc.find("Canvas/chupai_right_node");

        this.initPai();
        this.db_hu_1 = this.node_hu_1.getComponent(dragonBones.ArmatureDisplay);
        this.db_hu_1.node.active = false;
        this.db_hu_2 = this.node_hu_2.getComponent(dragonBones.ArmatureDisplay);
        this.db_hu_2.node.active = false;
        this.db_hu_3 = this.node_hu_3.getComponent(dragonBones.ArmatureDisplay);
        this.db_hu_3.node.active = false;

        this.tcp_ani = this.tcp_ani.getComponent(dragonBones.ArmatureDisplay);
        this.tcp_ani.node.active = false;
        this.jbdga_ani = this.jbdga_ani.getComponent(dragonBones.ArmatureDisplay);
        this.jbdga_ani.node.active = false;

        this.initShouPai();
        this.initModepai();
        this.zhanli();
        // this.initUI();
        playerED.addObserver(this);

        this.head.node.zIndex = UIZorder.MJ_LAYER_TOP;

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
                return 'gameyj_mj/common/animations/pai3'+path+'/right/jlmj_mid2dapai_right_';
            case 2:
                return 'gameyj_mj/common/animations/pai2'+path+'/right/jlmj_mid2dapai_right_';
            default:
                return 'gameyj_mj/common/animations/pai'+path+'/right/jlmj_mid2dapai_right_';
        }
    },

    mopai: function (player) {
        this.updateShouPai(player);
        // if (DeskData.Instance().isFenZhang) {
        //     DeskED.notifyEvent(DeskData.Instance().MO_PAI_FEN_ZHANG, ++DeskData.Instance().fenzhangCount);
        // }
    },

    getMoPaiShouPaiDis: function (state) {
        //摸牌
        var zhanli = {
            offsetX:0,
            offsetY:10,
        };
        //摆牌间隔
        var daopai = null;
        if(!DeskData.Instance().getIs2D()) {
            daopai = {
                13: {x: 473, y: 252},
                12: {x: 474, y: 225},
                11: {x: 475, y: 227},
                10: {x: 477, y: 229},
                7: {x: 488, y: 182},
                4: {x: 493, y: 159},
                1: {x: 502, y: 110},
            };
        }else{
            daopai = {
                13: {x: 515, y: 250},
                12: {x: 474, y: 240},
                11: {x: 475, y: 230},
                10: {x: 515, y: 223},
                7: {x: 515, y: 172},
                4: {x: 515, y: 144},
                1: {x: 515, y: 92},
            };
        }
        //开牌
        var kaipai = {
            offsetX:0,
            offsetY:10,
        };

        if(state == PlayerState.DAPAI){
            return zhanli;
        }else if(state == PlayerState.TINGPAI){
            return daopai;
        }else{
            return kaipai;
        }
    },

    /**
     * 获取居中对齐的偏移
     */
    getAlignCenterOffset: function () {
        var offset_pos = cc.v2(0,0);
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
        var offset_y = (Math.abs(first_pai.y) - Math.abs(last_pai.y))/2;
        if(Math.abs(first_pai.y) > Math.abs(last_pai.y)){
            offset_pos.y = -Math.abs(offset_y);
        }else{
            offset_pos.y = Math.abs(offset_y);
        }
        return offset_pos;
    },

    /**
     * 获取居中对齐的偏移Y
     */
    getBaiPaiAlignCenterOffsetY: function () {
        var offset_y = 0;
        var first_pai = null;
        var last_pai = null;
        if(this.baipai_ui_list.length>0){
            var first_baipai_ui = this.baipai_ui_list[0];
            var last_baipai_ui = this.baipai_ui_list[this.baipai_ui_list.length-1];
            first_pai = first_baipai_ui.pais[0].node;
            last_pai = last_baipai_ui.pais[last_baipai_ui.pais.length-1].node;
        }
        var offset_y = (Math.abs(first_pai.y) - Math.abs(last_pai.y))/2;
        if(Math.abs(first_pai.y) > Math.abs(last_pai.y)){
            offset_y = Math.abs(offset_y);
        }else{
            offset_y = -Math.abs(offset_y);
        }
        offset_y = parseFloat(offset_y.toFixed(1));
        return offset_y;
    },

    /**
     * 获取居中对齐的偏移Y
     */
    getAlignCenterOffsetY: function () {
        var offset_y = 0;
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
        var offset_y = (Math.abs(first_pai.y) - Math.abs(last_pai.y))/2;
        if(Math.abs(first_pai.y) > Math.abs(last_pai.y)){
            offset_y = Math.abs(offset_y);
        }else{
            offset_y = -Math.abs(offset_y);
        }
        offset_y = parseFloat(offset_y.toFixed(1));
        // cc.log('座号=',this.viewIdx);
        // cc.log('第一张牌位置Y=',first_pai.y);
        // cc.log('最后一张牌位置Y=',last_pai.y);
        // cc.log('居中偏移Y=',offset_y);
        return offset_y;
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
            1:  [6],
            4:  [5,6,7,8],
            7:  [3,4,5,6,7,8,9],
            10: [2,3,4,5,6,7,8,9,10,11],
            11: [1,2,3,4,5,6,7,8,9,10,11],
            12: [1,2,3,4,5,6,7,8,9,10,11,12],
            13: [0,1,2,3,4,5,6,7,8,9,10,11,12],
        };

        if(!shoupai_visible_cfg[shouPaiLen]){
            cc.error("手牌数量错误  =", shouPaiLen);
        }

        //手牌
        var count = 0;
        for(var i=0; i<this.shouPai.length; ++i){
            if(shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1){
                this.shouPai[i].node.active = true;
                if(player.state == PlayerState.HUPAI){  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i,player.state,player.getBaiPaiNum()+count);
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

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
            var shoupai_count = shoupai_visible_cfg[shouPaiLen].length;
            var mopaiIdx = shoupai_visible_cfg[shouPaiLen][shoupai_count-1]+1;
            if(player.state == PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(mopaiIdx,player.state,player.getBaiPaiNum()+count);
            }else{
                this.setMoPaiAppearance(mopaiIdx,player.state);
            }
            if(player.state == PlayerState.TINGPAI){
                var pos = this.getMoPaiShouPaiDis(player.state)[shouPaiLen];
                this.modepai.node.setPosition(pos.x, pos.y);
            }else{
                var lastPos = this.modepai.node.getPosition();
                this.modepai.node.setPosition(lastPos.x + this.getMoPaiShouPaiDis(player.state).offsetX, lastPos.y + this.getMoPaiShouPaiDis(player.state).offsetY);
            }
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if(player.state == PlayerState.HUPAI){
                this.biaojiBaoPaiInShouPai(this.modepai);
            }
        }else{
            this.modepai.node.active = false;
        }

        //胡牌时有摆牌,位置偏移
        if(player.state == PlayerState.HUPAI && this.baipai_ui_list.length>0){
            // var mj_index = this.baipai_ui_list.length;
            var mj_index = player.getBaiPaiNum();
            for(var i=0; i<this.shouPai.length; ++i){
                if(this.shouPai[i].node.active){
                    var pos_cfg = this.shouPai[i].node.getPosition();
                    var pos_space = cc.v2(this.pai3dCfg.baipai_space.x * mj_index, this.pai3dCfg.baipai_space.y * mj_index);
                    this.shouPai[i].node.setPosition(pos_cfg.add(pos_space));
                    //加上摆牌和开牌偏移
                    // this.shouPai[i].node.x += -9;
                    // this.shouPai[i].node.y += 31;
                }
            }
            mj_index += 1;
            var pos_cfg = this.modepai.node.getPosition();
            var pos_space = cc.v2(this.pai3dCfg.baipai_space.x * mj_index, this.pai3dCfg.baipai_space.y * mj_index);
            this.modepai.node.setPosition(pos_cfg.add(pos_space));
            //加上摆牌和开牌偏移
            // this.modepai.node.x += -9;
            // this.modepai.node.y += 31;
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if(player.state == PlayerState.HUPAI){
            this.shouPaiAlignCenterV();
        }
    },

    update: function () {
        if(this.mid2dapai_playing&&this.zhanshi_pai.node.active){
            var length = this.chuPai.length;
            if(length>=2){
                var x = this.getDaPaiCfg()['frame_'+(length-1)].x;
                var y = this.getDaPaiCfg()['frame_'+(length-1)].y;
                var width = this.getDaPaiCfg()['frame_'+(length-1)].sizeW;
                var height = this.getDaPaiCfg()['frame_'+(length-1)].sizeH;
                var order_rect = cc.rect(x-width/2,y-height/2,width,height-15);
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

});
