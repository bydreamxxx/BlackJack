cc.Class({
    extends: require('base_mj_player_up_ui'),

    initHuPai: function (){
        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_u").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_u").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_u").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_u").getComponent(sp.Skeleton);
        // this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_u").getComponent(sp.Skeleton);
        // this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_u").getComponent(sp.Skeleton);
        // this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_u").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_u").getComponent(sp.Skeleton);

        this.clearHuPai();
    },

    clearHuPai: function (){
        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        // this.piaohu_ani.node.active = false;
        // this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;
    },

    updateShouPai: function (player) {
        if(this.isResetBaiPai){
            this.needUpdateShouPai = true;
            return;
        }

        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if(!player){
            return;
        }
        //测试结算开牌
        // player.state = this.require_PlayerState.HUPAI;

        //胡牌时,摆牌先重置,再排版
        if(player.state == this.require_PlayerState.HUPAI){
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
                if(player.state == this.require_PlayerState.HUPAI){  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i,player.state, 5+count);
                }else{
                    this.setShouPaiAppearance(i,player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);
                if(player.state == this.require_PlayerState.HUPAI){
                    this.biaojiBaoPaiInShouPai(this.shouPai[i]);
                }
                if(player.state == this.require_PlayerState.HUPAI || player.replaying){
                    this.shouPai[i].setHunPai(this.require_DeskData.Instance().isHunPai(player.shoupai[count]) && !this.require_playerMgr.Instance().playing_fapai_ani);
                }
                count++;
            }else{
                this.shouPai[i].node.active = false;
            }
        }
        if(player.state != this.require_PlayerState.HUPAI) {
            let use2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D') === 'true';
            var offset_x = use2D ? 152 : 150.9;
            cc.log('手牌偏移位置 = ' + offset_x);
            for (var i = 0; i < this.shouPai.length; ++i) {
                if (this.shouPai[i].node.active) {
                    this.shouPai[i].node.x = this.shouPai[i].frameCfg.x + offset_x;
                }
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
            if(player.state == this.require_PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(13,player.state,player.getBaiPaiNum()+count);
            }else{
                this.setMoPaiAppearance(13,player.state);
            }
            var last_shou_pai = this.getLastShouPai();
            this.modepai.node.setPosition(last_shou_pai.node.x+this.getMoPaiShouPaiDis(player.state),last_shou_pai.node.y);
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if(player.state == this.require_PlayerState.HUPAI){
                this.biaojiBaoPaiInShouPai(this.modepai);
            }
            if(player.state == this.require_PlayerState.HUPAI || player.replaying){
                this.modepai.setHunPai(this.require_DeskData.Instance().isHunPai(player.shoupai[shouPaiLen]) && !this.require_playerMgr.Instance().playing_fapai_ani);
            }
        }else{
            this.modepai.node.active = false;
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if(player.state == this.require_PlayerState.HUPAI){
            this.shouPaiAlignCenterH();
        }
    },

    initMJComponet(){
        return require("mjComponentValue").jsmj;
    }
});
