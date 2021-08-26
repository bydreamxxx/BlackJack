var replay_ui = require('base_mj_replay_ui');
//每个麻将都要改写这个
let mjComponentValue = null;

cc.Class({
    extends: replay_ui,

    ctor() {
        mjComponentValue = this.initMJComponet();
    },

    updateGameUIAfterMsg: function () {
        //分张时,关闭菜单选项
        // var menu_list = cc.find("Canvas/game_menu_list").getComponent(mjComponentValue.gameMenuList);
        // menu_list.closeMenuAndOptions();
        // for(var i=1; i<4; ++i){
        //     var menu_list = cc.find("Canvas/game_menu_list_"+i).getComponent(mjComponentValue.gameMenuList);
        //     menu_list.closeMenuAndOptions();
        // }
    },

    initMJComponet(){
        return require('mjComponentValue').hlmj;
    }
});