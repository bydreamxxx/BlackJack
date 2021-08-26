var BaipaiType = require("jlmj_baipai_data").BaipaiType;

var jlmj_game_menu_list = require('base_mj_game_menu_list');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

let mjComponentValue = null;

let menuList = cc.Class({
    extends: jlmj_game_menu_list,

    ctor(){
        mjComponentValue = this.initMJComponet();
    },

    /**
     * 设置菜单
     * @param player
     */
    setMenus: function(player){
        if(this.require_playerMgr.Instance().playing_fapai_ani){ //发牌动画,不显示操作菜单
            return;
        }
        if(!player.hasCaozuo()){
            this.closeMenuAndOptions();
            return;
        }
        this.onShow_list = [];
        var player_list = this.require_playerMgr.Instance().playerList;

        if(player.canhu == this.require_hupai_type.CAN_HU_TRUE_DUIBAO || player.canhu == this.require_hupai_type.CAN_HU_TRUE_MOBAO){
            if (player.canhu == this.require_hupai_type.CAN_HU_TRUE_DUIBAO) {
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.DUIBAO));
            }
            if (player.canhu == this.require_hupai_type.CAN_HU_TRUE_MOBAO) {
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.MOBAO));
            }
        }else {
            if(player.canhu){
                if (player.canhu == this.require_hupai_type.CAN_HU_TRUE_NORMAL) {
                    this.onShow_list.push(this.getMenu(this.menu_list, this.require_UserPlayer.modepai != null ? this.require_menu_type.ZIMO : this.require_menu_type.HU));
                } else {
                    this.onShow_list.push(this.getMenu(this.menu_list, player.modepai != null ? this.require_menu_type.ZIMO : this.require_menu_type.HU));
                }
            }else{
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.GUO));
            }

            if (player.canting) {
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.TING));
            }

            if (player.canchiting) {
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.CHITING));
            }

            if (player.canpengting) {
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.PENGTING));
            }

            if (player.cangangting) {
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.GANGTING));
            }

            if (player.cangang) {
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.GANG));
            }

            if (player.canpeng) {
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.PENG));
            }

            if (player.canchi) {
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.CHI));
            }
        }
        if(this.onShow_list.length > 0){
            this.openMenu(this.onShow_list);
        }else{
            this.closeMenuAndOptions();
        }
    },

    initMJComponet() {
        return require("mjComponentValue").acmj;
    }
});

module.exports = menuList;