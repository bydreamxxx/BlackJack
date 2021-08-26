var HuType = require('jlmj_define').HuType;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

let base_mj_net_handler_base_mj = require("base_mj_net_handler_base_mj");

var fz_handler = cc.Class({

    extends: base_mj_net_handler_base_mj.handler,

    ctor: function () {
        cc.log("fzmj_net_handler_fzmj 父类");
    },

    setReconnectRule(rule){
        RoomMgr.Instance()._Rule = rule;
        RoomMgr.Instance()._Rule.isnormalxi = rule.reservedList[0] === 'true';
        RoomMgr.Instance()._Rule.notong = rule.reservedList[1] === 'true';
        RoomMgr.Instance()._Rule.isliangxikaimen = rule.reservedList[2] === 'true';
    },

    overturnAct2(msg){
        if(this.handlerType == 2){
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('fzmj_player_down_ui');
            player_down_ui.setShoupaiTingbiaoji(false);
            player_down_ui.updateShouPai();
            this.require_UserPlayer.isTempBaoTing = false;
        }else{
            setTimeout(()=>{
                var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('fzmj_player_down_ui');
                player_down_ui.setShoupaiTingbiaoji(false);
                player_down_ui.updateShouPai();
                this.require_UserPlayer.isTempBaoTing = false;
            }, 500)
        }
    },

    getJBC(){
        return cc.dd.Define.GameType.FZMJ_GOLD;
    },

    getFriend(){
        return cc.dd.Define.GameType.FZMJ_FRIEND;
    },

    checkSpecialHu(hutype){
        return hutype == HuType.QI_DUI || hutype == HuType.JIA5_HU;
    },

    initMJComponet(){
        return require("mjComponentValue").fzmj;
    },

    /**
     * 开始游戏 消息
     */
    on_fangzheng_ack_game_opening: function( msg ) {
        this.on_mj_ack_game_opening(msg);
    },

    on_fangzheng_ack_game_deal_cards: function( msg ) {
        this.on_mj_ack_game_deal_cards(msg);
    },

    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_fangzheng_ack_roomInit: function( msg ) {
        this.on_mj_ack_roomInit(msg);
    },

    on_fangzheng_ack_game_overturn: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.on_mj_ack_game_overturn(msg);
    },

    on_fangzheng_ack_game_send_out_card: function( msg ) {
        this.on_mj_ack_game_send_out_card(msg);

        if (!this.headerHandle(msg)) {
            return;
        }
        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('fzmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
    },

    on_fangzheng_ack_update_deposit: function( msg ) {
        this.on_mj_ack_update_deposit(msg);
    },



    on_fangzheng_ack_chi: function( msg ) {
        this.on_mj_ack_chi(msg);
    },

    on_fangzheng_ack_game_act_peng: function( msg ) {
        this.on_mj_ack_game_act_peng(msg);
    },

    on_fangzheng_ack_game_act_gang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        var playerOut = this.require_playerMgr.Instance().getPlayer(msg.useridout);
        if (msg.isrob) {
            playerOut.beiQiangGang();
        } else {
            if (msg.gangtype == 1 || msg.gangtype == 8 || msg.gangtype == 10 ||
                msg.gangtype == 12 || msg.gangtype == 14 || msg.gangtype == 16) {
                //点杠 被杠的牌，移除
                playerOut.beigang();
            }
        }

        //玩家杠
        var playerIn = this.require_playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            if(msg.gangcardList.length == 3){
                playerIn.zfbgang(msg.gangcardList, true);
            }else{
                playerIn.gang(msg, true);
            }
        }

        if(!cc.replay_gamedata_scrolling){
            this.require_playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('fzmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-杠牌');
        }

        if(msg.gangtype != 4 || msg.useridin == cc.dd.user.id){
            this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);
        }
        if(!this.require_DeskData.Instance().dabaoing){
            this.require_DeskED.notifyEvent(this.require_DeskEvent.BIAOJI_BAOPAI,[]);
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('fzmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
        this.require_UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_fangzheng_ack_game_act_bugang: function( msg ) {
        this.on_mj_ack_game_act_bugang(msg);
    },

    on_fangzheng_ack_game_act_guo: function( msg ) {
        this.on_mj_ack_game_act_guo(msg);
    },

    on_fangzheng_ack_game_ting: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.on_mj_ack_game_ting(msg);
        var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
        if (player) {
            this.require_playerMgr.Instance().chupai_timeout_on_ting = true;
        }

        if(!cc.replay_gamedata_scrolling){
            this.require_playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('fzmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-吃牌');
        }
    },

    on_fangzheng_ack_chiting: function( msg ) {
        this.on_mj_ack_chiting(msg);
    },

    on_fangzheng_ack_pengting: function( msg ) {
        this.on_mj_ack_pengting(msg);
    },

    on_fangzheng_ack_gangting: function( msg ) {
        this.on_mj_ack_gangting(msg);
    },

    on_fangzheng_ack_game_dabao: function( msg ) {
        this.on_mj_ack_game_dabao(msg);
    },

    on_fangzheng_ack_game_changbao: function( msg ) {
        this.on_mj_ack_game_changbao(msg);
    },

    on_fangzheng_ack_reconnect: function( msg ) {
        this.on_mj_ack_reconnect(msg);
    },

    on_fangzheng_ack_remain_majiang: function( msg ) {
        this.on_mj_ack_remain_majiang(msg);
    },

    on_fangzheng_ack_change_majiang: function( msg ) {
        this.on_mj_ack_change_majiang(msg);
    },

    /**
     * 胡牌 消息
     * @param msg
     */
    on_fangzheng_game_ack_act_hu: function( msg ) {
        this.on_mj_game_ack_act_hu(msg);
    },

    /**
     * 小结算 消息
     * @param msg
     */
    on_fangzheng_ack_send_current_result: function( msg ) {
        this.on_mj_ack_send_current_result(msg);
    },

    on_fangzheng_ack_operator: function( msg ) {
        this.on_mj_ack_operator(msg);
    },

    on_fangzheng_ack_reloading_ok: function( msg ) {
        this.on_mj_ack_reloading_ok(msg);
    },

    on_fangzheng_ack_ready: function( msg ) {
        this.on_mj_ack_ready(msg);
    },

    on_fangzheng_ack_sponsor_dissolve_room: function( msg ) {
        this.on_mj_ack_sponsor_dissolve_room(msg);
    },

    on_fangzheng_ack_response_dissolve_room: function( msg ) {
        this.on_mj_ack_response_dissolve_room(msg);
    },

    on_fangzheng_ack_dissolve_room: function( msg ) {
        this.on_mj_ack_dissolve_room(msg);
    },

    on_fangzheng_ack_exit_room: function( msg ) {
        this.on_mj_ack_exit_room(msg);
    },

    on_fangzheng_ack_finally_result: function( msg ) {
        this.on_mj_ack_finally_result(msg);
    },

    on_fangzheng_ack_fen_zhang: function( msg ) {
        this.on_mj_ack_fen_zhang(msg);
    },

    on_fangzheng_ack_rob_remove_card: function( msg ) {
        this.on_mj_ack_rob_remove_card(msg);
    },

    on_fangzheng_game_ack_act_huangzhuangpais: function( msg ) {
        this.on_mj_game_ack_act_huangzhuangpais(msg);
    },

    /**
     * 网络状况  4个心跳包收到个数
     */
    on_msg_hearbeat_num: function (msg) {
        this.msg_hearbeat_num(msg);
    },

    /**
     * 金币场 听牌后更新宝牌
     * @param msg
     */
    on_fangzheng_ack_bao: function (msg) {
        this.on_mj_ack_bao(msg);
    },

    on_fangzheng_ack_update_coin: function(msg) {
        this.on_mj_ack_update_coin(msg);
    },

    on_fangzheng_ack_liangzhang: function(msg){
        var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
        if(player){
            player.liangzhangbao(msg.cardsList);
        }
        cc.gateNet.Instance().dispatchTimeOut(1);
    },

    on_fangzheng_liangxi_state: function(msg){
        this.require_UserPlayer.setLiangXiState(msg.state);
    }
});

module.exports = new fz_handler();