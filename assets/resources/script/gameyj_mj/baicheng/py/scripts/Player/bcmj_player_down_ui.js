var UIZorder = require("mj_ui_zorder");

let base_mj_player_down_ui = require('base_mj_player_down_ui');
let TouchCardMode = require('base_mj_player_data').TouchCardMode;

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
        this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_d").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_d").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_d").getComponent(sp.Skeleton);

        this.clearHuPai();
    },

    clearHuPai(){
        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;
    },

    onLoad: function () {
        this._super();
        this.head.node.zIndex = UIZorder.MJ_LAYER_TOP;
        this.TingPaiTouchMode = TouchCardMode.DA_TING_PAI;
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
        // if(require_UserPlayer.isTempGangTing){
        //     tingType = 5;
        // }

        return tingType;
    },

    initMJComponet(){
        return require("mjComponentValue").bcmj;
    }
});
