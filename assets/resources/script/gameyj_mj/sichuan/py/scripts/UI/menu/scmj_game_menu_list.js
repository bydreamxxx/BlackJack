var DeskData = require('scmj_desk_data').DeskData;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var hupai_type = require("scmj_game_menu").hupai_type;

var menu_type = require("scmj_game_menu").menu_type;

var jlmj_game_menu_list = require('jlmj_game_menu_list');

var playerMgr = require('scmj_player_mgr');

var UserPlayer = require("scmj_userPlayer_data").Instance();

cc.Class({
    extends: jlmj_game_menu_list,

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
        var menu = menu_node.getComponent("scmj_game_menu");
        this.menu =  menu;
        if(!menu){
            cc.error("scmj_game_menu预制没有挂在scmj_game_menu组件");
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


        if(player.canhu || player.cangang || player.canpeng) {
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
        }
        if(player.canhu){//有胡牌时不能过牌
            if(player.canhu == hupai_type.CAN_HU_TRUE_NORMAL){
                this.onShow_list.push(this.getMenu(this.menu_list,UserPlayer.modepai != null?menu_type.ZIMO:menu_type.HU));
            }else{
                this.onShow_list.push(this.getMenu(this.menu_list,player.modepai != null?menu_type.ZIMO:menu_type.HU));
            }
        }

        if(player.cangang){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GANG));
        }

        if(player.canpeng){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.PENG));
        }

        this.openMenu(this.onShow_list);
        if(player.canhu){
            this.playerCanHu = true;
        }
    },

    setPlayerMenus: function(player){
        if(playerMgr.Instance().playing_fapai_ani){ //发牌动画,不显示操作菜单
            return;
        }
        this.onShow_list = [];

        if(player.cangang ){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GANG));
        }

        if(player.canpeng){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.PENG));
        }

        this.openMenu(this.onShow_list);
    },

    /**
     * 消息处理
     * @param event
     * @param data
     */
    onEventMessage: function (event,data) {
        if(cc.replay_gamedata_scrolling){
            return;
        }
        if(! data || !data instanceof Array){
            return;
        }
        var player = data[0];
        switch(event){
            case DeskEvent.CLOSE_MENU:
                this.closeMenuAndOptions(player);
                return;
            default:
                break;
        }
        this._super(event,data)
    },

    /**
     * 关闭菜单和选项
     */
    closeMenuAndOptions: function (player) {
        cc.log('---关闭吃碰杠菜单---');
        this.closeMenu(player);
        this.closeChiOptions();
        this.closeGangOptions();
    },

    /**
     * 关闭菜单
     */
    closeMenu: function (player) {
        if(player && player != cc.dd.user.id && this.playerCanHu === true){
            let peng = this.getMenu(this.menu_list, menu_type.PENG);
            peng.node.active = false;
            let gang = this.getMenu(this.menu_list, menu_type.GANG);
            gang.node.active = false;
            return;
        }
        this.menu_list.forEach(function (menu) {
            menu.node.active = false;
        });
        this.playerCanHu = false;
    },
});
