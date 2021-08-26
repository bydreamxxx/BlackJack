var jlmj_game_menu_list = require('base_mj_game_menu_list');

cc.Class({
    extends: jlmj_game_menu_list,

    ctor: function(){
        this.menu_pos = [
            cc.v2(472, -90),
            cc.v2(292, -90),
            cc.v2(112, -90),
            cc.v2(-68, -90),
            cc.v2(-248, -90),
            cc.v2(-428, -90),
        ];
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
            if(player.canhu == this.require_hupai_type.CAN_HU_TRUE_DUIBAO){
                this.onShow_list.push(this.getMenu(this.menu_list,this.require_menu_type.DUIBAO));
            }
            if(player.canhu == this.require_hupai_type.CAN_HU_TRUE_MOBAO){
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.MOBAO));
            }
        }else{
            // if(player.canhu && !UserPlayer.canting && !player.isBaoTing && player_list.length > 2) {
            //     this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
            // }else if(player_list.length > 2 && !player.isBaoTing && player.canhu) {
            //     this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
            // }else if(player_list.length > 2 && !player.canhu){
            //     this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
            // }

            // if(player_list.length == 2) {
                this.onShow_list.push(this.getMenu(this.menu_list,this.require_menu_type.GUO));
            // }

            if(player.canting){
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.TING));
            }

            if(player.canchi){
                this.onShow_list.push(this.getMenu(this.menu_list,this.require_menu_type.CHI));
            }

            if(player.canpeng){
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.PENG));
            }

            if(player.cangang ){
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.GANG));
            }

            if(player.canhu){//有胡牌时不能过牌
                if(player.canhu == this.require_hupai_type.CAN_HU_TRUE_NORMAL){
                    this.onShow_list.push(this.getMenu(this.menu_list,this.require_UserPlayer.modepai != null?this.require_menu_type.ZIMO:this.require_menu_type.HU));
                }else{
                    this.onShow_list.push(this.getMenu(this.menu_list,player.modepai != null?this.require_menu_type.ZIMO:this.require_menu_type.HU));
                }
            }
        }
        this.openMenu(this.onShow_list);
    },

    /**
     * 关闭菜单和选项
     */
    closeMenuAndOptions: function () {
        this._super();
        this.isOpen = false;
    },

    /**
     * 打开菜单
     * @param show_menu_list
     */
    openMenu: function(show_menu_list){
        this._super(show_menu_list);
        this.isOpen = true;
    },

    initMJConfig(){
        return require('mjConfigValue').nmmj;
    },

    initMJComponet() {
        return require("mjComponentValue").pzmj;
    }
});
