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
            // if (player.canhu == this.require_hupai_type.CAN_HU_TRUE_DUIBAO) {
            //     this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.DUIBAO));
            // }
            // if (player.canhu == this.require_hupai_type.CAN_HU_TRUE_MOBAO) {
            //     this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.MOBAO));
            // }
        }else {

            // if (player.canhu && !this.require_UserPlayer.canting && !player.isBaoTing) {
            //     this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.GUO));
            // } else if (!player.isBaoTing && player.canhu) {
            //     this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.GUO));
            // } else if (!player.canhu) {
            //     this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.GUO));
            // }

            if(player.canhu){
                // if (player.canhu == this.require_hupai_type.CAN_HU_TRUE_NORMAL) {
                //     this.onShow_list.push(this.getMenu(this.menu_list, this.require_UserPlayer.modepai != null ? this.require_menu_type.ZIMO : this.require_menu_type.HU));
                // } else {
                //     this.onShow_list.push(this.getMenu(this.menu_list, player.modepai != null ? this.require_menu_type.ZIMO : this.require_menu_type.HU));
                // }
            }else{
                this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.GUO));

                if (player.canhu) {//有胡牌时不能过牌
                    if (player.canhu == this.require_hupai_type.CAN_HU_TRUE_NORMAL) {
                        this.onShow_list.push(this.getMenu(this.menu_list, this.require_UserPlayer.modepai != null ? this.require_menu_type.ZIMO : this.require_menu_type.HU));
                    } else {
                        this.onShow_list.push(this.getMenu(this.menu_list, player.modepai != null ? this.require_menu_type.ZIMO : this.require_menu_type.HU));
                    }
                }
                if (player.canting) {
                    let arrBaiPaiData = player.baipai_data_list;
                    if((arrBaiPaiData.length == 0 || (arrBaiPaiData.length == 1 && arrBaiPaiData[0].type == BaipaiType.LZB)) && RoomMgr.Instance()._Rule.ismoyu) {
                        this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.MEN_TING));
                    }else{
                        this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.TING));
                    }
                }

                // if(player.canduidaosuanjia){
                //     this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.DUI_DAO_SUAN_JIA));
                // }

                if (player.cangang) {
                    this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.GANG));
                }

                if (player.canpeng) {
                    this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.PENG));
                }

                if (player.canchi) {
                    this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.CHI));
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

                if (player.canliangzhang) {
                    this.onShow_list.push(this.getMenu(this.menu_list, this.require_menu_type.LIANG_ZHANG_BAO));
                    this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_LIANG_ZHANG_BAO,[this.require_UserPlayer]);
                }

                if(player.canliangxi){
                    this.onShow_list.push(this.getMenu(this.menu_list,this.require_menu_type.LIANG_XI));
                }
            }


        }
        if(this.onShow_list.length > 0){
            this.openMenu(this.onShow_list);
        }else{
            this.closeMenuAndOptions();
        }
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
            case this.require_DeskEvent.OPEN_BAO_OPTION:
                this.openBaoOptions(data[0], data[1]);
                break;
            default:
                break;
        }
        this._super(event,data);
    },

    /**
     * 关闭菜单和选项
     */
    closeMenuAndOptions: function () {
        cc.log('---关闭吃碰杠菜单---');
        this.closeMenu();
        this.closeChiOptions();
        this.closeGangOptions();
        this.closeBaoOptions();
    },

    /**
     * 打开宝选项
     */
    openBaoOptions(list, clickCallBack){
        this.closeBaoOptions();
        cc.dd.UIMgr.openUI('gameyj_mj/fangzheng/py/prefabs/fzmj_bao_pai_option', function(prefab){
            this.bao_ui = prefab;
            prefab.getComponent('fzmj_bao_pai_option')._openCombinationUi(list, clickCallBack)
        }.bind(this));
    },
    /**
     * 关闭杠选项
     */
    closeBaoOptions: function () {
        if(this.bao_ui)
        {
            this.bao_ui.getComponent('fzmj_bao_pai_option').onCancelGang();
            this.bao_ui = null;
        }
    },

    initMJComponet() {
        return require("mjComponentValue").fzmj;
    }
});

module.exports = menuList;