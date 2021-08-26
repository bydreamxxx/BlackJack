var PlayerED = require("jlmj_player_data").PlayerED;
var UserPlayer = require("jlmj_userPlayer_data").Instance();
var menu_type = require("jlmj_game_menu").menu_type;
var hupai_type = require("jlmj_game_menu").hupai_type;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var playerMgr = require('jlmj_player_mgr');

var menu_pos = [
    cc.v2(472, -134),
    cc.v2(349, -134),
    cc.v2(226, -134),
    cc.v2(102, -134),
    cc.v2(-21, -134),
    cc.v2(-144, -134),
];


cc.Class({
    extends: cc.Component,

    properties: {
        zsq: { default: null, type: cc.Node, tooltip: '麻将指示器'},
        jlmj_game_menu:cc.Prefab,
        jlmj_3pai_option:cc.Prefab,
    },

    ctor: function(){
        this.menu_list = [];
        this.chi_option_list = [];
        this.gang_option_list = [];
        //当前显示按钮
        this.onShow_list = [];
        //确认 取消按钮
        //this.ok_clean_list=[];
        this.menu_pos = [
            cc.v2(472, -134),
            cc.v2(322, -134),
            cc.v2(172, -134),
            cc.v2(22, -134),
            cc.v2(-128, -134),
            cc.v2(-278, -134),
        ];
    },
    
    setMenuPosList: function (menu_pos_list) {
        this.menu_pos = menu_pos_list;
    },

    // use this for initialization
    onLoad: function () {
        this.menu_prefab = this.jlmj_game_menu;
        this._3pai_option_prefab = this.jlmj_3pai_option;
        // this._4pai_option_prefab = cc.loader.getRes("gameyj_mj/jilin/py/prefabs/jlmj_4pai_option",cc.Prefab);
        this.closeZSQ();
        PlayerED.addObserver(this);
        DeskED.addObserver(this);

        var canvas_node = cc.find("Canvas");
        var c_scale = canvas_node.height/this.node.height;
        if(canvas_node.width / canvas_node.height >= this.node.width / this.node.height) {
            this.node.scaleX = c_scale;
            this.node.scaleY = c_scale;
        }
    },

    onDestroy: function () {
      PlayerED.removeObserver(this);
      DeskED.removeObserver(this);
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
            if(!player.canhu && player_list.length > 2) {
                this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
            }

            if(player_list.length == 2) {
                this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
            }
            if(player.canhu){//有胡牌时不能过牌
                if(player.canhu == hupai_type.CAN_HU_TRUE_NORMAL){
                    this.onShow_list.push(this.getMenu(this.menu_list,UserPlayer.modepai != null?menu_type.ZIMO:menu_type.HU));
                }else{
                    this.onShow_list.push(this.getMenu(this.menu_list,player.modepai != null?menu_type.ZIMO:menu_type.HU));
                }
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
        }
        this.openMenu(this.onShow_list);
    },

    /**
     * 打开菜单
     * @param show_menu_list
     */
    openMenu: function(show_menu_list){
        this.closeMenuAndOptions();
        show_menu_list.forEach(function (menu,idx) {
            menu.node.active = true;
            menu.interactable = true;
            menu.isEnable = true;
            menu.node.setPosition(this.menu_pos[idx]);
        }.bind(this));
    },

    /**
     * 关闭菜单
     */
    closeMenu: function () {
        this.menu_list.forEach(function (menu) {
            menu.node.active = false;
        });
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
        return menu;
    },

    /**
     * 增加指定类型菜单
     * @param type
     * @returns {*|Component|cc.Component}
     */
    addMenu: function (type) {
        var menu_node = cc.instantiate(this.menu_prefab);
        var menu = menu_node.getComponent("jlmj_game_menu");
        if(!menu){
            cc.error("jlmj_game_menu预制没有挂在jlmj_game_menu组件");
            return;
        }
        menu.type = type;
        this.node.addChild(menu_node);
        return menu;
    },

    /**
     * 打开吃选项
     */
    openChiOptions : function (userPlayer,clickCallBack) {
        this.closeChiOptions();
        cc.dd.UIMgr.openUI('gameyj_mj/common/prefabs/mj_chi', function(prefab){
            this.chi_ui = prefab;
            prefab.getComponent('mj_chi').setChiNode(userPlayer.chi_options, clickCallBack)
        }.bind(this));
    },


    /**
     * 关闭吃选项
     */
    closeChiOptions: function () {
        if(this.chi_ui){
            this.chi_ui.getComponent('mj_chi').close();
        }
    },


    /**
     * 打开杠选项
     */
    openGangOptions: function (groupList,clickCallBack) {
        this.closeGangOptions();
        cc.dd.UIMgr.openUI('gameyj_mj/common/prefabs/jlmj_gang_pai_option', function(prefab){
            this.gangpai_ui = prefab;
            prefab.getComponent('jlmj_gang_pai_option')._openCombinationUi(groupList, clickCallBack)
        }.bind(this));
    },

    /**
     * 关闭杠选项
     */
    closeGangOptions: function () {
        if(this.gangpai_ui)
        {
            this.gangpai_ui.getComponent('jlmj_gang_pai_option').onCancelGang();
            this.gangpai_ui = null;
        }
    },

    /**
     * 打开麻将指示器
     * @param data
     */
    openZSQ: function (data) {
        var pos = data[0];
        this.zsq.active = true;
        this.zsq.setPosition(pos);
        cc.log("【UI】"+"显示麻将指示器 pos="+pos);
    },

    /**
     * 关闭麻将指示器
     */
    closeZSQ: function () {
        this.zsq.active = false;
    },

    /**
     * 关闭菜单和选项
     */
    closeMenuAndOptions: function () {
        cc.log('---关闭吃碰杠菜单---');
        this.closeMenu();
        this.closeChiOptions();
        this.closeGangOptions();
    },
    /**
     * 显示上一次显示的按钮列表
     */
    showUpListBtn:function () {
        this.openMenu(this.onShow_list);
    },

    emitCancel:function(){
        /*if(this.ok_clean_list[0].node.active){
            var event={};
            event.type="touchend";
            this.ok_clean_list[0].onClickMenu(event);
        }*/
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
            // 菜单显示 延迟到摸牌后
            case DeskEvent.OPEN_CHI:
                this.openChiOptions(data[0], data[1]);
                break;
            case DeskEvent.OPEN_GANG:
                this.openGangOptions(data[0], data[1]);
                break;
            case DeskEvent.OPEN_ZSQ:
                this.openZSQ(data);
                break;
            case DeskEvent.CLOSE_ZSQ:
                this.closeZSQ();
                break;
            case DeskEvent.CLOSE_MENU:
                this.closeMenuAndOptions();
                break;
            case DeskEvent.SHOW_UP_LISTBTN://显示上一层按钮
                this.showUpListBtn();
                break;
            case DeskEvent.CANCEL_EMIT:
                this.emitCancel();
            /*case DeskEvent.TUO_GUAN://托管
                //取消用户正在操作的一些界面
                this.emitCancel();*/
                break;
            case DeskEvent.OPEN_CHITING:
                this.openChiOptions(data[0], data[1]);
                break;
            default:
                break;
        }
    },

});
