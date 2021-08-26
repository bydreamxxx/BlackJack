var RoomMgr = require('jlmj_room_mgr').RoomMgr;

let base_mj_net_handler_base_mj = require("base_mj_net_handler_base_mj");
let HANDLER_TYPE = base_mj_net_handler_base_mj.handlerType;

var wd_handler = cc.Class({
    extends: base_mj_net_handler_base_mj.handler,

    ctor: function () {
        cc.log("wdmj_net_handler_wdmj 父类");
    },

    fapaiAction(showFapai){
        if(RoomMgr.Instance()._Rule.paofen == -2){
            this.require_DeskED.notifyEvent(this.require_DeskEvent.SHOW_PAO_FEN, RoomMgr.Instance()._Rule.paofen);
            // var player = this.require_playerMgr.Instance().getPlayer(UserPlayer.userId);
            // if (player) {
            var userlist = this.require_playerMgr.Instance().playerList;
            for (var i = 0; userlist && i < userlist.length; ++i) {
                if(userlist[i]){
                    userlist[i].cleardapaiCding();
                }
            }
            // player.dapaiCding({time:8});
            // }
        }else{
            this.require_DeskED.notifyEvent(this.require_DeskEvent.FAPAI);

            var userlist = this.require_playerMgr.Instance().playerList;
            for (var i = 0; userlist && i < userlist.length; ++i) {
                if(userlist[i]){
                    userlist[i].showPaoFen(RoomMgr.Instance()._Rule.paofen);
                }
            }
        }
    },

    overturnAct1(msg, player){
        if (player) {
            player.mopai(msg);
            var isNomalMo = msg.acttype == 1; //1是正常摸牌
            this.require_DeskED.notifyEvent(this.require_DeskEvent.MO_PAI_ACT, [1, msg.paicount, isNomalMo, 0, 0]);

            if(this.handlerType != HANDLER_TYPE.REPLAY){
                if (this.require_playerMgr.Instance().playing_shou2mid_ani) { //上家正在打牌动画,
                    cc.log('上家打牌动画中,记录下家已摸牌');
                    // playerMgr.Instance().normal_mopaiing = true;
                    var id = this.require_playerMgr.Instance().shou2mid_id_list.pop();
                    if(cc.dd._.isNumber(id)){
                        this.require_playerMgr.Instance().mid2dapai_id_list.push(id);
                    }
                } else {  //上家出牌动画结束,则播放入牌海动画
                    cc.log('上家打牌动画结束,播放入牌海动画');
                    var id = this.require_playerMgr.Instance().shou2mid_id_list.pop();
                    if(cc.dd._.isNumber(id)){
                        this.require_playerMgr.Instance().playerMid2DapaiAction(id);
                    }
                }
            }

            this.require_playerMgr.Instance().playerMoPaiAction();
        }
        this.require_DeskData.Instance().setisFenzhangMopai();
        this.require_DeskData.Instance().setRemainCard(msg.paicount);
    },

    stopHuPaiAni(isZiMo){
        if(isZiMo) {
            this.require_playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if (play_list) {
                play_list.getComponent(this.mjComponentValue.playerList).playerStopChuPaiAni();
            }
        }
        cc.log('停止出牌动画-胡牌');
    },

    getJBC(){
        return cc.dd.Define.GameType.WDMJ_GOLD;
    },

    getFriend(){
        return cc.dd.Define.GameType.WDMJ_FRIEND;
    },

    checkSpecialHu(hutype){
        return false;
    },

    initMJConfig(){
        return require('mjConfigValue').nmmj;
    },

    initMJComponet(){
        return require("mjComponentValue").wdmj;
    },

    /**
     * 开始游戏 消息
     */
    on_wudan_ack_game_opening: function( msg ) {
        this.on_mj_ack_game_opening(msg);
    },

    on_wudan_ack_game_deal_cards: function( msg ) {
        this.on_mj_ack_game_deal_cards(msg);
    },

    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_wudan_ack_roomInit: function( msg ) {
        this.on_mj_ack_roomInit(msg);
        this.pause = false;
    },

    on_wudan_ack_game_overturn: function( msg ) {
        this.on_mj_ack_game_overturn(msg);
    },

    on_wudan_ack_game_send_out_card: function( msg ) {
        this.on_mj_ack_game_send_out_card(msg);
    },

    on_wudan_ack_update_deposit: function( msg ) {
        this.on_mj_ack_update_deposit(msg);
    },

    on_wudan_ack_chi: function( msg ) {
        this.on_mj_ack_chi(msg);
    },

    on_wudan_ack_game_act_peng: function( msg ) {
        this.on_mj_ack_game_act_peng(msg);
    },

    on_wudan_ack_game_act_gang: function( msg ) {
        this.on_mj_ack_game_act_gang(msg);
    },

    on_wudan_ack_game_act_bugang: function( msg ) {
        this.on_mj_ack_game_act_bugang(msg);
    },

    on_wudan_ack_game_act_guo: function( msg ) {
        this.on_mj_ack_game_act_guo(msg);
    },

    on_wudan_ack_game_ting: function( msg ) {
        this.on_mj_ack_game_ting(msg);
    },

    on_wudan_ack_game_dabao: function( msg ) {
        this.on_mj_ack_game_dabao(msg);
    },

    on_wudan_ack_game_changbao: function( msg ) {
        this.on_mj_ack_game_changbao(msg);
    },

    on_wudan_ack_reconnect: function( msg ) {
        this.on_mj_ack_reconnect(msg);
    },

    on_wudan_ack_remain_majiang: function( msg ) {
        this.on_mj_ack_remain_majiang(msg);
    },

    on_wudan_ack_change_majiang: function( msg ) {
        this.on_mj_ack_change_majiang(msg);
    },

    /**
     * 胡牌 消息
     * @param msg
     */
    on_wudan_game_ack_act_hu: function( msg ) {
        if(this.handlerType == HANDLER_TYPE.FRIEND){
            cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).gameready.active = false;
        }
        this.on_mj_game_ack_act_hu(msg);
        this.require_playerMgr.Instance().playing_special_hu = 2000;
    },

    /**
     * 小结算 消息
     * @param msg
     */
    on_wudan_ack_send_current_result: function( msg ) {
        if(this.handlerType == HANDLER_TYPE.FRIEND){
            cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).gameready.active = false;
        }
        this.on_mj_ack_send_current_result(msg);
    },

    on_wudan_ack_operator: function( msg ) {
        this.on_mj_ack_operator(msg);
    },

    on_wudan_ack_reloading_ok: function( msg ) {
        this.on_mj_ack_reloading_ok(msg);
    },

    on_wudan_ack_ready: function( msg ) {
        this.on_mj_ack_ready(msg);
    },

    on_wudan_ack_sponsor_dissolve_room: function( msg ) {
        this.on_mj_ack_sponsor_dissolve_room(msg);
    },

    on_wudan_ack_response_dissolve_room: function( msg ) {
        this.on_mj_ack_response_dissolve_room(msg);
    },

    on_wudan_ack_dissolve_room: function( msg ) {
        this.on_mj_ack_dissolve_room(msg);
    },

    on_wudan_ack_exit_room: function( msg ) {
        this.on_mj_ack_exit_room(msg);
    },

    on_wudan_ack_finally_result: function( msg ) {
        this.on_mj_ack_finally_result(msg);
    },

    on_wudan_ack_fen_zhang: function( msg ) {
        this.on_mj_ack_fen_zhang(msg);
    },

    on_wudan_ack_rob_remove_card: function( msg ) {
        this.on_mj_ack_rob_remove_card(msg);
    },

    on_wudan_game_ack_act_huangzhuangpais: function( msg ) {
        if(this.handlerType == HANDLER_TYPE.FRIEND){
            cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).gameready.active = false;
        }
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
    on_wudan_ack_bao: function (msg) {
        this.on_mj_ack_bao(msg);
        this.require_UserPlayer.paixu();
        if(!cc.replay_gamedata_scrolling){
            cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI).updateShouPai();
        }
    },

    /**
     * 金币更新
     * @param msg
     */
    on_wudan_ack_update_coin: function( msg ) {
        this.on_mj_ack_update_coin(msg);
    },

    on_wudan_ack_paofen: function(msg){
        this.on_mj_ack_paofen(msg);
    },

    on_wudan_ack_buhua(msg){
        this.on_mj_ack_buhua(msg);
    }
});

module.exports = new wd_handler();