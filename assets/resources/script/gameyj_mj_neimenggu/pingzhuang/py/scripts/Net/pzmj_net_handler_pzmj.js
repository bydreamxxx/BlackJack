var RoomMgr = require('jlmj_room_mgr').RoomMgr;

let base_mj_net_handler_base_mj = require("base_mj_net_handler_base_mj");
let HANDLER_TYPE = base_mj_net_handler_base_mj.handlerType;

var pz_handler = cc.Class({
    extends: base_mj_net_handler_base_mj.handler,

    ctor: function () {
        cc.log("pzmj_net_handler_pzmj 父类");
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
        return cc.dd.Define.GameType.PZMJ_GOLD;
    },

    getFriend(){
        return cc.dd.Define.GameType.PZMJ_FRIEND;
    },

    checkSpecialHu(hutype){
        return false;
    },

    initMJConfig(){
        return require('mjConfigValue').nmmj;
    },

    initMJComponet(){
        return require("mjComponentValue").pzmj;
    },

    /**
     * 胡牌 消息
     * @param msg
     */
    on_mj_game_ack_act_hu: function( msg ) {
        if(this.handlerType == HANDLER_TYPE.FRIEND){
            cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).gameready.active = false;
        }
        this._super(msg);
        this.require_playerMgr.Instance().playing_special_hu = 2000;
    },

    on_mj_game_ack_act_huangzhuangpais: function( msg ) {
        if(this.handlerType == HANDLER_TYPE.FRIEND){
            cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).gameready.active = false;
        }
        this._super(msg);
    },

    on_mj_ack_send_current_result: function( msg ) {
        if(this.handlerType == HANDLER_TYPE.FRIEND){
            cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).gameready.active = false;
        }
        this._super(msg);
    },

    /**
     * 金币场 听牌后更新宝牌
     * @param msg
     */
    on_mj_ack_bao: function (msg) {
        this._super(msg);
        this.require_UserPlayer.paixu();
        if(!cc.replay_gamedata_scrolling){
            cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI).updateShouPai();
        }
    },
});

module.exports = new pz_handler();