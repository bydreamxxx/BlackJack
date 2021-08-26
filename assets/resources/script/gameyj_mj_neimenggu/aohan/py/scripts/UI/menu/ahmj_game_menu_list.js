var DeskData = require('ahmj_desk_data').DeskData;

var hupai_type = require("ahmj_game_menu").hupai_type;

var menu_type = require("ahmj_game_menu").menu_type;

var jlmj_game_menu_list = require('jlmj_game_menu_list');

var playerMgr = require('ahmj_player_mgr');

var UserPlayer = require("ahmj_userPlayer_data").Instance();

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
     * 增加指定类型菜单
     * @param type
     * @returns {*|Component|cc.Component}
     */
    onLoad: function () {
        this._super();
    },

    addMenu: function (type) {
        var menu_node = cc.instantiate(this.menu_prefab);
        var menu = menu_node.getComponent("ahmj_game_menu");
        if(!menu){
            cc.error("ahmj_game_menu预制没有挂在ahmj_game_menu组件");
            return;
        }
        menu.type = type;
        this.node.addChild(menu_node);
        return menu;
    },

    /**
     * 设置菜单
     * @param player
     */
    setMenus: function(player){
        if(playerMgr.Instance().playing_fapai_ani){ //发牌动画,不显示操作菜单
            return;
        }
        if(!player.hasCaozuo()){
            this.closeMenuAndOptions();
            return;
        }
        this.onShow_list = [];
        var player_list = playerMgr.Instance().playerList;

        if(player.canhu == hupai_type.CAN_HU_TRUE_DUIBAO || player.canhu == hupai_type.CAN_HU_TRUE_MOBAO){
            if(player.canhu == hupai_type.CAN_HU_TRUE_DUIBAO){
                this.onShow_list.push(this.getMenu(this.menu_list,menu_type.DUIBAO));
            }
            if(player.canhu == hupai_type.CAN_HU_TRUE_MOBAO){
                this.onShow_list.push(this.getMenu(this.menu_list, menu_type.MOBAO));
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
                this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
            // }

            if(player.canting){
                this.onShow_list.push(this.getMenu(this.menu_list, menu_type.TING));
            }

            if(player.canchi){
                this.onShow_list.push(this.getMenu(this.menu_list,menu_type.CHI));
            }

            if(player.canpeng){
                this.onShow_list.push(this.getMenu(this.menu_list, menu_type.PENG));
            }

            if(player.cangang ){
                this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GANG));
            }

            if(player.canhu){//有胡牌时不能过牌
                if(player.canhu == hupai_type.CAN_HU_TRUE_NORMAL){
                    this.onShow_list.push(this.getMenu(this.menu_list,UserPlayer.modepai != null?menu_type.ZIMO:menu_type.HU));
                }else{
                    this.onShow_list.push(this.getMenu(this.menu_list,player.modepai != null?menu_type.ZIMO:menu_type.HU));
                }
            }
        }
        this.openMenu(this.onShow_list);
    },

    // update (dt) {},

    // update (dt) {},
    /**
     * 打开吃选项
     */
    openChiOptions : function (userPlayer,clickCallBack) {
        this.closeChiOptions();
        cc.dd.UIMgr.openUI('gameyj_mj_neimenggu/common/prefabs/nmmj_chi', function(prefab){
            this.chi_ui = prefab;
            prefab.getComponent('mj_chi').setChiNode(userPlayer.chi_options, clickCallBack)
        }.bind(this));
    },

    /**
     * 打开杠选项
     */
    openGangOptions: function (groupList,clickCallBack) {
        this.closeGangOptions();
        cc.dd.UIMgr.openUI('gameyj_mj_neimenggu/common/prefabs/nmmj_gang_pai_option', function(prefab){
            this.gangpai_ui = prefab;
            prefab.getComponent('jlmj_gang_pai_option')._openCombinationUi(groupList, clickCallBack)
        }.bind(this));
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
});
