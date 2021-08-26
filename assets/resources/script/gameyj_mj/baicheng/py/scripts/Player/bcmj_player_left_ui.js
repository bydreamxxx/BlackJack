cc.Class({
    extends: require('base_mj_player_left_ui'),

    initHuPai: function (){
        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_l").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_l").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_l").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_l").getComponent(sp.Skeleton);
        // this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_l").getComponent(sp.Skeleton);
        this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_l").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_l").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_l").getComponent(sp.Skeleton);

        this.clearHuPai();
    },

    clearHuPai: function (){
        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;
    },

    initMJComponet(){
        return require("mjComponentValue").bcmj;
    }
});
