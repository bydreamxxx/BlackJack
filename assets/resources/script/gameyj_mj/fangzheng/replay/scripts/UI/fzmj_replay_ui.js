var com_replay_data = require('com_replay_data').REPLAY_DATA;
var fzmj_cmd = require('c_msg_fangzhengmj_cmd');
var replay_ui = require('base_mj_replay_ui');
//每个麻将都要改写这个
let mjComponentValue = null;

cc.Class({
    extends: replay_ui,

    ctor() {
        mjComponentValue = this.initMJComponet();
    },

    /**
     * 获得自己的消息列表 (排除只属于其他玩家的消息)
     */
    getSelfMsgList: function () {
        var msg_list = com_replay_data.Instance().msg_list;

        var self_msg_list = [];
        for(var i=0; i<msg_list.length; ++i){
            //过滤解散消息
            if(msg_list[i].id == fzmj_cmd.cmd_fangzheng_ack_sponsor_dissolve_room){
                continue;
            }
            if(msg_list[i].id == fzmj_cmd.cmd_fangzheng_ack_response_dissolve_room){
                continue;
            }
            if(msg_list[i].id == fzmj_cmd.cmd_fangzheng_ack_dissolve_room){
                continue;
            }
            self_msg_list.push(msg_list[i]);
            //this.slider_progress.node.on('slide', this.touchSlide.bind(this));
        }

        return self_msg_list;
    },

    updateGameUIBeforeMsg: function (id, msg) {
        //非菜单消息,关闭菜单UI
        if(id != fzmj_cmd.cmd_fangzheng_ack_game_overturn){
            var menu_list = cc.find("Canvas/game_menu_list").getComponent(mjComponentValue.gameMenuList);
            menu_list.closeMenuAndOptions();
            for(var i=1; i<4; ++i){
                var menu_list = cc.find("Canvas/game_menu_list_"+i).getComponent(mjComponentValue.gameMenuList);
                menu_list.closeMenuAndOptions();
            }
        }
        //玩家摸牌消息时,关闭菜单UI
        if(id == fzmj_cmd.cmd_fangzheng_ack_game_overturn && msg.acttype == 1){
            var menu_list = cc.find("Canvas/game_menu_list").getComponent(mjComponentValue.gameMenuList);
            menu_list.closeMenuAndOptions();
            for(var i=1; i<4; ++i){
                var menu_list = cc.find("Canvas/game_menu_list_"+i).getComponent(mjComponentValue.gameMenuList);
                menu_list.closeMenuAndOptions();
            }
        }
        //非打牌消息,停止打牌动画
        if(id != fzmj_cmd.cmd_fangzheng_ack_game_send_out_card){
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent(mjComponentValue.playerList).playerStopChuPaiAni();
                play_list.getComponent(mjComponentValue.playerList).playerUpdateZsq();
            }
        }
    },

    initMJComponet(){
        return require('mjComponentValue').fzmj;
    }
});