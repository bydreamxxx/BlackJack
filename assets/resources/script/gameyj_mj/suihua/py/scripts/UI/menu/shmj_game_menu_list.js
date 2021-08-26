var DeskData = require('shmj_desk_data').DeskData;
var BaipaiType = require("jlmj_baipai_data").BaipaiType;

var hupai_type = require("shmj_game_menu").hupai_type;

var menu_type = require("shmj_game_menu").menu_type;

var jlmj_game_menu_list = require('jlmj_game_menu_list');

var playerMgr = require('shmj_player_mgr');

var UserPlayer = require("shmj_userPlayer_data").Instance();
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var PlayerED = require("shmj_player_data").PlayerED;
var PlayerEvent = require("shmj_player_data").PlayerEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

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

    /**
     * 获取指定类型菜单
     * @param type
     * @returns {*}
     */
    getMenu: function(menuList, type){
        var menu = null;
        menuList.forEach(function (game_menu) {
            if(game_menu.type == type){
                menu = game_menu;
            }
        });
        if(!menu){
            menu = this.addMenu(type);
            menuList.push(menu);
        }
        this.menu =  menu;
        return menu;
    },

    addMenu: function (type) {
        var menu_node = cc.instantiate(this.menu_prefab);
        var menu = menu_node.getComponent("shmj_game_menu");
        this.menu =  menu;
        if(!menu){
            cc.error("shmj_game_menu预制没有挂在shmj_game_menu组件");
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
            // if(player.canhu == hupai_type.CAN_HU_TRUE_DUIBAO){
            //     this.onShow_list.push(this.getMenu(this.menu_list,menu_type.DUIBAO));
            // }
            // if(player.canhu == hupai_type.CAN_HU_TRUE_MOBAO){
            //     this.onShow_list.push(this.getMenu(this.menu_list, menu_type.MOBAO));
            // }
        }else {

            // if (player.canhu && !UserPlayer.canting && !player.isBaoTing) {
            //     this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GUO));
            // } else if (!player.isBaoTing && player.canhu) {
            //     this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GUO));
            // } else if (!player.canhu) {
            //     this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GUO));
            // }

            if(player.canhu){
                // if (player.canhu == hupai_type.CAN_HU_TRUE_NORMAL) {
                //     this.onShow_list.push(this.getMenu(this.menu_list, UserPlayer.modepai != null ? menu_type.ZIMO : menu_type.HU));
                // } else {
                //     this.onShow_list.push(this.getMenu(this.menu_list, player.modepai != null ? menu_type.ZIMO : menu_type.HU));
                // }
            }else{
                this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GUO));

                if (player.canhu) {//有胡牌时不能过牌
                    if (player.canhu == hupai_type.CAN_HU_TRUE_NORMAL) {
                        this.onShow_list.push(this.getMenu(this.menu_list, UserPlayer.modepai != null ? menu_type.ZIMO : menu_type.HU));
                    } else {
                        this.onShow_list.push(this.getMenu(this.menu_list, player.modepai != null ? menu_type.ZIMO : menu_type.HU));
                    }
                }
                if (player.canting) {
                    let arrBaiPaiData = player.baipai_data_list;
                    if((arrBaiPaiData.length == 0 || (arrBaiPaiData.length == 1 && arrBaiPaiData[0].type == BaipaiType.LZB)) && RoomMgr.Instance()._Rule.ismoyu) {
                        this.onShow_list.push(this.getMenu(this.menu_list, menu_type.MEN_TING));
                    }else{
                        this.onShow_list.push(this.getMenu(this.menu_list, menu_type.TING));
                    }
                }

                // if(player.canduidaosuanjia){
                //     this.onShow_list.push(this.getMenu(this.menu_list, menu_type.DUI_DAO_SUAN_JIA));
                // }

                if (player.cangang) {
                    this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GANG));
                }

                if (player.canpeng) {
                    this.onShow_list.push(this.getMenu(this.menu_list, menu_type.PENG));
                }

                if (player.canchi) {
                    this.onShow_list.push(this.getMenu(this.menu_list, menu_type.CHI));
                }

                if (player.canchiting) {
                    this.onShow_list.push(this.getMenu(this.menu_list, menu_type.CHITING));
                }

                if (player.canpengting) {
                    this.onShow_list.push(this.getMenu(this.menu_list, menu_type.PENGTING));
                }

                if (player.cangangting) {
                    this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GANGTING));
                }

                if (player.canliangzhang) {
                    this.onShow_list.push(this.getMenu(this.menu_list, menu_type.LIANG_ZHANG_BAO));
                    PlayerED.notifyEvent(PlayerEvent.SHOW_LIANG_ZHANG_BAO,[UserPlayer]);
                }
            }


        }
        if(this.onShow_list.length > 0){
            this.openMenu(this.onShow_list);
        }else{
            this.closeMenuAndOptions();
        }
    },

    setPlayerMenus: function(player){
        if(playerMgr.Instance().playing_fapai_ani){ //发牌动画,不显示操作菜单
            return;
        }
        this.onShow_list = [];

        if(player.canxiaosa){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO_2));
            this.menu.setclickCallback(player.fun);
        }else{
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
        }


        if(player.canting){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.TING));
        }

        if(player.cangang ){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GANG));
        }

        if(player.canpeng){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.PENG));
        }

        if(player.canchi){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.CHI));
        }

        if(player.canchiting){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.CHITING));
        }

        if(player.canxiaosa){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.XIAOSA));
            this.menu.setclickCallback(player.fun);
        }
        this.openMenu(this.onShow_list);
    },
    // update (dt) {},

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
            // 菜单显示 延迟到摸牌后
            case DeskEvent.OPEN_BAO_OPTION:
                this.openBaoOptions(data[0], data[1]);
                break;
            default:
                break;
        }
        this._super(event,data);
    },

    /**
     * 打开宝选项
     */
    openBaoOptions(list, clickCallBack){
        this.closeBaoOptions();
        cc.dd.UIMgr.openUI('gameyj_mj/suihua/py/prefabs/shmj_bao_pai_option', function(prefab){
            this.bao_ui = prefab;
            prefab.getComponent('shmj_bao_pai_option')._openCombinationUi(list, clickCallBack)
        }.bind(this));
    },
    /**
     * 关闭杠选项
     */
    closeBaoOptions: function () {
        if(this.bao_ui)
        {
            this.bao_ui.getComponent('shmj_bao_pai_option').onCancelGang();
            this.bao_ui = null;
        }
    },

    showTuidao(canGuo, func){
        this.onShow_list = [];
        if(canGuo){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GUO_2));
            this.menu.setclickCallback(func);
        }
        this.onShow_list.push(this.getMenu(this.menu_list, menu_type.DUI_DAO_SUAN_JIA));
        this.openMenu(this.onShow_list);
    },
});
