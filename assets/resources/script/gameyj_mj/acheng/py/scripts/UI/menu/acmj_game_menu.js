var dd=cc.dd;

let game_menu = require('base_mj_game_menu');
let menu_type = game_menu.menu_type;
let hupai_type = game_menu.hupai_type;

var sh_GameMenu = cc.Class({
    extends: game_menu.GameMenu,

    initMJComponet(){
        return require("mjComponentValue").acmj;
    }
});

module.exports = {
    GameMenu:sh_GameMenu,
    menu_type:menu_type,
    hupai_type:hupai_type,
};
