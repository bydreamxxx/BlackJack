var UIZorder = require("mj_ui_zorder");

let base_mj_player_down_ui = require('base_mj_player_down_ui');
let TouchCardMode = require('base_mj_player_data').TouchCardMode;
var pai3d_value = require('jlmj_pai3d_value');

//每个麻将都要改写这个
let mjComponentValue = null;

cc.Class({
    extends: base_mj_player_down_ui,

    ctor: function () {
        mjComponentValue = this.initMJComponet();
    },

    initHuPai(){
        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_d").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_d").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_d").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_d").getComponent(sp.Skeleton);
        // this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_d").getComponent(sp.Skeleton);
        // this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_d").getComponent(sp.Skeleton);
        // this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_d").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_d").getComponent(sp.Skeleton);

        this.clearHuPai();
    },

    clearHuPai(){
        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        // this.piaohu_ani.node.active = false;
        // this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;
    },

    customTouchEndSendOutCard(){

    },

    getTingType(){
        let tingType = 1;
        // if (require_UserPlayer.isTempGang) {
        //     tingType = 2;
        // }
        if(this.require_UserPlayer.isTempChiTing){
            tingType = 2;
        }
        if(this.require_UserPlayer.isTempPengTing){
            tingType = 3;
        }
        if(this.require_UserPlayer.isTempGangTing){
            tingType = 5;
        }

        return tingType;
    },

    updateShouPai: function (player) {
        if(this.isResetBaiPai){
            this.needUpdateShouPai = true;
            return;
        }

        if(this.require_DeskData.Instance().isFenZhang){
            cc.log('【分张摸牌】 开始');
        }
        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if(!player){
            return;
        }
        //测试结算开牌
        // player.state = this.require_PlayerState.HUPAI;

        if(this.yidong_pai && this.yidong_pai.node && this.yidong_pai.node.active){
            this.yidong_pai.node.active = false;
            this.pai_touched = null;
        }

        this.chupai_act = false;
        //胡牌时,摆牌使用开牌配置
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
            cc.error("手牌数量错误  =", shouPaiLen);
            cc.log("手牌"+pai3d_value.descs(player.shoupai));

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
            this.shouPai[i].node.stopAllActions();
            if(shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1){
                this.shouPai[i].node.active = true;
                this.shouPai[i].selected = false;
                if(player.state == this.require_PlayerState.HUPAI){  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i,player.state, 5+count);
                }else{
                    this.setShouPaiAppearance(i,player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);
                if(player.state == this.require_PlayerState.HUPAI){
                    this.biaojiBaoPaiInShouPai(this.shouPai[i]);
                }
                if(this.touchCardMode != TouchCardMode.DA_TING_PAI){
                    this.shouPai[i].setTingPai(false);
                }

                this.shouPai[i].setHunPai(this.require_DeskData.Instance().isHunPai(player.shoupai[count]), player.state != this.require_PlayerState.TINGPAI && player.state != this.require_PlayerState.HUPAI);

                count++;
            }else{
                this.shouPai[i].node.active = false;
            }
        }

        if(player.state != this.require_PlayerState.HUPAI){
            let use2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D') === 'true';
            var offset_x = use2D ? -359 : -360.4;
            cc.log(this.viewIdx,'手牌偏移位置 = '+ offset_x);
            for(var i=0; i<this.shouPai.length; ++i){
                if(this.shouPai[i].node.active){
                    this.shouPai[i].node.x = this.shouPai[i].frameCfg.x + offset_x;
                }
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
            this.modepai.node.stopAllActions();
            if(player.state == this.require_PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(13,player.state,player.getBaiPaiNum()+count);
            }else{
                this.setMoPaiAppearance(13,player.state);
            }
            var last_shou_pai = this.getLastShouPai();
            this.modepai.node.setPosition(last_shou_pai.node.x+this.getMoPaiShouPaiDis(player.state),last_shou_pai.node.y);
            // cc.log('手牌的最后X位置', last_shou_pai.node.x);
            // cc.log('摸牌X位置', this.modepai.node.x);
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if(player.state == this.require_PlayerState.HUPAI){
                this.biaojiBaoPaiInShouPai(this.modepai);
            }
            if(player.state != this.require_PlayerState.HUPAI){
                this.menuList.setMenus(player);
            }
            this.modepai.setHunPai(this.require_DeskData.Instance().isHunPai(player.shoupai[shouPaiLen]), player.state != this.require_PlayerState.TINGPAI && player.state != this.require_PlayerState.HUPAI);

            if(player.canbuhua && player.buhuaId >= 0){
                for(let i = 0; i < this.shouPai.length; i++){
                    if(this.shouPai[i].cardId == player.buhuaId){
                        this.shouPai[i].node.y = this.restPt_y() + this.chupai_offset;
                        break;
                    }
                }
                if(this.modepai.cardId == player.buhuaId){
                    this.modepai.node.y = this.restPt_y() + this.chupai_offset;
                }
                this.menuList.setMenus(player);
            }
        }else{
            this.modepai.node.active = false;
        }

        if(this.chupai_prompt){
            this.chupai_prompt.active = this.checkChuPaiPromot(player);
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if(player.state == this.require_PlayerState.HUPAI){
            this.shouPaiAlignCenterH();
        }

        if(this.require_DeskData.isFenZhang){
            cc.log('【分张摸牌】 结束');
        }
        cc.log("【UI】" + "自己手牌:" + pai3d_value.descs(player.shoupai));
    },

    updateSelectedPai: function (player) {
        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if(!player){
            return;
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
            cc.error("手牌数量错误  =", shouPaiLen);
        }

        var count = 0;
        for(var i=0; i<this.shouPai.length; ++i){
            if(shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1){
                this.shouPai[i].node.active = true;
                if(!this.shouPai[i].selected){

                    this.setShouPaiAppearance(i,player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);
                if(this.touchCardMode != TouchCardMode.DA_TING_PAI){
                    this.shouPai[i].setTingPai(false);
                }
                count++;
            }else{
                this.shouPai[i].node.active = false;
            }
        }
        let use2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D') === 'true';
        var offset_x = use2D ? -359 : -360.4;
        cc.log(this.viewIdx,'手牌偏移位置 = '+ offset_x);
        for(var i=0; i<this.shouPai.length; ++i){
            if(this.shouPai[i].node.active){
                this.shouPai[i].node.x = this.shouPai[i].frameCfg.x + offset_x;
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
        }else{
            this.modepai.node.active = false;
        }

        if(this.yidong_pai && this.yidong_pai.node && this.yidong_pai.node.active){
            this.yidong_pai.node.active = false;
        }
    },


    initMJComponet(){
        return require("mjComponentValue").jsmj;
    }
});
