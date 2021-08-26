var dd=cc.dd;

let game_menu = require('base_mj_game_menu');
let menu_type = game_menu.menu_type;
let hupai_type = game_menu.hupai_type;

var sh_GameMenu = cc.Class({
    extends: game_menu.GameMenu,

    /**
     * 过牌
     */
    guo: function () {
        if(this.require_UserPlayer.canhu){
            cc.dd.DialogBoxUtil.show(0, '确定要放弃胡牌吗', '确定', '取消', ()=>{
                this.guoCall();
            }, function() { });
        }else{
            this.guoCall();
        }
    },

    peng: function () {
        this.require_UserPlayer.isLiangPaiPeng = false;
        this._super();
    },

    gang: function () {
        if (this.require_UserPlayer.isLiangPaiPeng) {
            this.peng();
            return;
        }
        this._super();
    },

    initMJComponet(){
        return require("mjComponentValue").bcmj;
    }
});

module.exports = {
    GameMenu:sh_GameMenu,
    menu_type:menu_type,
    hupai_type:hupai_type,
};
