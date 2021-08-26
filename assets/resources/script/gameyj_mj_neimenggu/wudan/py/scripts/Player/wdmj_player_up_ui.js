cc.Class({
    extends: require('base_mj_player_up_ui'),

    properties:{
        isNeimeng: {default: true, override: true}
    },

    initHuPai: function(){
        this.chi_ani = cc.find("Canvas/desk_node/play_anis/up/chi").getComponent(sp.Skeleton);
        this.gang_ani = cc.find("Canvas/desk_node/play_anis/up/gang").getComponent(sp.Skeleton);
        this.gangshanghua_ani = cc.find("Canvas/huEffect/gangshanghua").getComponent(sp.Skeleton);
        this.gangshangpao_ani = cc.find("Canvas/huEffect/gangshangpao").getComponent(sp.Skeleton);
        this.haoqidui_ani = cc.find("Canvas/huEffect/haoqidui").getComponent(sp.Skeleton);
        this.hu_ani = cc.find("Canvas/desk_node/play_anis/up/hu").getComponent(sp.Skeleton);
        this.peng_ani = cc.find("Canvas/desk_node/play_anis/up/peng").getComponent(sp.Skeleton);
        this.piaohu_ani = cc.find("Canvas/huEffect/piaohu").getComponent(sp.Skeleton);
        this.qidui_ani = cc.find("Canvas/huEffect/qidui").getComponent(sp.Skeleton);
        this.shisanyao_ani = cc.find("Canvas/huEffect/shisanyao").getComponent(sp.Skeleton);
        this.guo_ani = cc.find("Canvas/desk_node/play_anis/up/guo").getComponent(sp.Skeleton);
        this.buhua_ani = cc.find("Canvas/desk_node/play_anis/up/buhua").getComponent(sp.Skeleton);

        this.huEffect = cc.find("Canvas/huEffect/up");
        this.playerLocation = cc.find("Canvas/desk_node/beforeGame/up");

        this.clearHuPai();
    },

    clearHuPai: function(){
        this.chi_ani.node.active = false;
        this.gang_ani.node.active = false;
        this.gangshanghua_ani.node.active = false;
        this.gangshangpao_ani.node.active = false;
        this.haoqidui_ani.node.active = false;
        this.hu_ani.node.active = false;
        this.peng_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qidui_ani.node.active = false;
        this.shisanyao_ani.node.active = false;
        this.guo_ani.node.active = false;
        this.buhua_ani.node.active = false;

        this.huEffect.active = false;
        this.playerLocation.active = false;
    },

    initMJConfig(){
        return require('mjConfigValue').nmmj;
    },

    initMJComponet(){
        return require("mjComponentValue").wdmj;
    }
});
