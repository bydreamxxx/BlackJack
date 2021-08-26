var pai3d_value = require("jlmj_pai3d_value");
var UIZorder = require("mj_ui_zorder");

let base_mj_player_down_ui = require('base_mj_player_down_ui');
let TouchCardMode = require('base_mj_player_data').TouchCardMode;

cc.Class({
    extends: base_mj_player_down_ui,

    properties: {
        chupai_offset: {default:25, override:true},
        pai_move_offset: {default:-267, override:true},
        isNeimeng: {default: true, override: true}
    },

    initHuPai(){
        this.chi_ani = cc.find("Canvas/desk_node/play_anis/down/chi").getComponent(sp.Skeleton);
        this.gang_ani = cc.find("Canvas/desk_node/play_anis/down/gang").getComponent(sp.Skeleton);
        this.gangshanghua_ani = cc.find("Canvas/huEffect/gangshanghua").getComponent(sp.Skeleton);
        this.gangshangpao_ani = cc.find("Canvas/huEffect/gangshangpao").getComponent(sp.Skeleton);
        this.haoqidui_ani = cc.find("Canvas/huEffect/haoqidui").getComponent(sp.Skeleton);
        this.hu_ani = cc.find("Canvas/desk_node/play_anis/down/hu").getComponent(sp.Skeleton);
        this.peng_ani = cc.find("Canvas/desk_node/play_anis/down/peng").getComponent(sp.Skeleton);
        this.piaohu_ani = cc.find("Canvas/huEffect/piaohu").getComponent(sp.Skeleton);
        this.qidui_ani = cc.find("Canvas/huEffect/qidui").getComponent(sp.Skeleton);
        this.shisanyao_ani = cc.find("Canvas/huEffect/shisanyao").getComponent(sp.Skeleton);
        this.guo_ani = cc.find("Canvas/desk_node/play_anis/down/guo").getComponent(sp.Skeleton);

        this.huEffect = cc.find("Canvas/huEffect/down");

        this.clearHuPai();
    },

    clearHuPai(){
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

        this.huEffect.active = false;
    },

    onLoad: function () {
        this._super();
        this.head.node.zIndex = UIZorder.MJ_LAYER_TOP;
        this.TingPaiTouchMode = TouchCardMode.DA_TING_PAI;
    },

    touchStart: function (event) {
        if(!this.require_UserPlayer.hasMoPai() || this.menuList.isOpen){
            return;
        }

        this._super(event);
    },

    touchMove: function (event) {
        if(!this.require_UserPlayer.hasMoPai() || this.menuList.isOpen){
            return;
        }
        this._super(event);
    },

    touchEnd: function (event) {
        if(!this.require_UserPlayer.hasMoPai() || this.menuList.isOpen){
            return;
        }

        this._super(event);
    },

    changePaiMove(event){

    },
    
    cloneYiDongPai(){

    },

    touchDapai(){
        if(this.canTouchPaiAni){
            this.canTouchPaiAni = false;

            if(cc.dd._.isUndefined(pai3d_value.desc[this.require_DeskData.Instance().sendCard])){
                return;
            }

            this.require_DeskData.Instance().last_chupai_id = this.require_DeskData.Instance().sendCard
            this.require_playerMgr.Instance().shou2mid_id_list.push(this.require_DeskData.Instance().sendCard);
            this.require_UserPlayer.dapai(this.require_DeskData.Instance().sendCard, false);
        }
    },

    customTouchEndSendOutCard(){
        if(this.touchCardMode == TouchCardMode.DA_TING_PAI){
            cc.log("ccmj touchEnd sendOutCard");
            this.require_UserPlayer.setJiaoInfo(this.yidong_pai.cardId);
        }
    },

    getTingType(){
        if (this.require_UserPlayer.isTempGang) {
            return 2;
        }else{
            return 1;
        }
    },

    initMJConfig(){
        return require('mjConfigValue').nmmj;
    },

    initMJComponet(){
        return require("mjComponentValue").pzmj;
    }
});
