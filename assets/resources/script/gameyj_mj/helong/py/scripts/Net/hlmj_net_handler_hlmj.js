var HuType = require('jlmj_define').HuType;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

let base_mj_net_handler_base_mj = require("base_mj_net_handler_base_mj");
const HANDLER_TYPE = {
    JBC: 0,
    FRIEND: 1,
    REPLAY: 2
}
var fz_handler = cc.Class({

    extends: base_mj_net_handler_base_mj.handler,

    ctor: function () {
        cc.log("hlmj_net_handler_hlmj 父类");
    },

    setReconnectRule(rule){
        RoomMgr.Instance()._Rule = rule;
    },

    getJBC(){
        return cc.dd.Define.GameType.HLMJ_GOLD;
    },

    getFriend(){
        return cc.dd.Define.GameType.HLMJ_FRIEND;
    },

    checkSpecialHu(hutype){
        return hutype == HuType.GANG_HUA_HU || hutype == HuType.GANG_PAO_HU || hutype == HuType.HAIDI_LAO || hutype == HuType.HAO_QI || hutype == HuType.QI_DUI;
    },

    reconnectCheckHuCardList(msg){
        this.huCardIdList = this.huCardIdList || {
            id: -1,
            count: 0,
            huPlayer:[],
            huType:[]
        };

        // let reconnect_hu = {};
        for(let i = 0; i < msg.playerinfoList.length; i++){
            let playerMsg = msg.playerinfoList[i];

            for(let k = 0; k < playerMsg.playercard.hucardList.length; k++){
                let huCard = playerMsg.playercard.hucardList[k];
                // if(reconnect_hu.hasOwnProperty(huCard.id)){
                //     reconnect_hu[huCard.id]++;
                // }else {
                //     reconnect_hu[huCard.id] = 1;
                // }
                this.huCardIdList.id = huCard.id;
                this.huCardIdList.count++;
                this.huCardIdList.huPlayer.push(msg.playerinfoList[i].userid);
                this.huCardIdList.huType.push(msg.playerinfoList[i].hutypeList);
            }
        }

        if(msg.lastoutnum > 0){
            cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).reconnectFenZhang(msg.lastoutnum);
        }
    },

    checkIsHuangZhuang(huuserid){

    },

    on_mj_ack_roomInit: function( msg ) {
        this.huCardIdList = null;
        if (!this.headerHandle(msg)) return;
        this._super(msg);
    },

    on_mj_ack_game_act_peng: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //被碰的牌，移除
        var playerOut = this.require_playerMgr.Instance().getPlayer(msg.useridout);
        let viewIdx = 0;
        if (playerOut) {
            viewIdx = playerOut.viewIdx;
            if (msg.isrob) {
                playerOut.beiQiangPeng();
            } else {
                playerOut.beipeng();
            }
        }

        //碰的牌，移除
        var playerIn = this.require_playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.peng(msg.pengcardList, viewIdx);
        }

        if(!cc.replay_gamedata_scrolling){
            this.require_playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent(this.mjComponentValue.playerList).playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-碰牌');
        }

        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);
        if(!this.require_DeskData.Instance().dabaoing){
            this.require_DeskED.notifyEvent(this.require_DeskEvent.BIAOJI_BAOPAI,[]);
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
        player_down_ui.setShoupaiTingbiaoji(false);
        this.require_UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_mj_ack_game_act_gang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        var playerOut = this.require_playerMgr.Instance().getPlayer(msg.useridout);
        let viewIdx = playerOut.viewIdx;
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
            playerIn.gang(msg, viewIdx);
        }
        if(msg.useridin == cc.dd.user.id){
            this.require_UserPlayer.modepai = null;
        }
        if(!cc.replay_gamedata_scrolling){
            this.require_playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent(this.mjComponentValue.playerList).playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-杠牌');
        }

        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);
        if(!this.require_DeskData.Instance().dabaoing){
            this.require_DeskED.notifyEvent(this.require_DeskEvent.BIAOJI_BAOPAI,[]);
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
        player_down_ui.setShoupaiTingbiaoji(false);
        this.require_UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },


    /**
     * 胡牌 消息
     * @param msg
     */
    on_mj_game_ack_act_hu: function( msg ) {
        if ( !this.headerHandle( msg ) ) {
            cc.log('胡牌点击未完成--0 headerHandle == fasle');
            return;
        };
        cc.dd.NetWaitUtil.net_wait_end();

        if(!cc.replay_gamedata_scrolling){
            if(this.require_DeskData.Instance().isInMaJiang()){
                cc.gateNet.Instance().dispatchTimeOut(4);
            }
        }

        if(this.require_playerMgr.Instance().playing_fapai_ani){
            this.stopFaPaiAni();
        }
        let func = ()=> {
            this.require_DeskData.Instance().isHu = true;
            this.require_DeskData.Instance().isPlayHuAni = true;

            // 删除点炮玩家最后打出那张牌
            var beihuPlayerObject = this.require_playerMgr.Instance().getPlayer(msg.dianpaoplayerid);
            var huPlayerObject = this.require_playerMgr.Instance().getPlayer(msg.huplayerid);
            var isZiMo = false;
            if (!msg.isrob) {
                isZiMo = msg.huplayerid === msg.dianpaoplayerid;
                huPlayerObject.setIsZiMo(isZiMo);
            }
            if (!isZiMo) {
                beihuPlayerObject.beihu(msg.hucardid);
            }

            let huType = [];

            this.huCardIdList = this.huCardIdList || {
                id: -1,
                count: 0,
                huPlayer:[],
                huType:[]
            };

            this.require_playerMgr.Instance().playing_special_hu = 0;

            if(this.huCardIdList.huPlayer.indexOf(huPlayerObject.userId) != -1){
                this.huCardIdList.count--;
                let idx = this.huCardIdList.huPlayer.indexOf(huPlayerObject.userId)
                this.huCardIdList.huPlayer.splice(idx, 1);
                this.huCardIdList.huType.splice(idx, 1);

                for(let i = 0; i < this.huCardIdList.huPlayer.length; i++){
                    let _huPlayerObject = this.require_playerMgr.Instance().getPlayer(this.huCardIdList.huPlayer[i]);
                    if(_huPlayerObject){
                        _huPlayerObject.hu(msg.hucardid, this.huCardIdList.huType[i], false);
                    }
                }
            }

            if(this.huCardIdList.id == msg.hucardid){
                this.huCardIdList.count++;
                this.huCardIdList.huPlayer.push(huPlayerObject.userId);
                this.huCardIdList.huType.push(msg.hutypeList);

                if(this.huCardIdList.count == 2){
                    huType.push(-1);
                    // playerMgr.Instance().playing_special_hu += 2000;
                }else if(this.huCardIdList.count == 3){
                    huType.push(-2);
                    // playerMgr.Instance().playing_special_hu += 2000;
                }
                // DeskED.notifyEvent(DeskEvent.YI_PAO_DUO_XIANG, [this.huCardIdList.count]);
            }else{
                this.huCardIdList.id = msg.hucardid;
                this.huCardIdList.count = 1;
                this.huCardIdList.huPlayer = [];
                this.huCardIdList.huPlayer.push(huPlayerObject.userId);
                this.huCardIdList.huType.push(msg.hutypeList);
            }

            let qingyise = msg.hutypeList.indexOf(HuType.QING_YI_SE);

            for (let i = 0; i < msg.hutypeList.length; i++) {
                if (this.checkSpecialHu(msg.hutypeList[i])) {
                    if(msg.hutypeList[i] == HuType.QI_DUI && qingyise != -1){
                        msg.hutypeList[i] = HuType.PING_HU;
                        huType.push(-4);
                    }else if(msg.hutypeList[i] == HuType.HAO_QI && qingyise != -1){
                        msg.hutypeList[i] = HuType.PING_HU;
                        huType.push(-3);
                    }else{
                        huType.push(msg.hutypeList[i]);
                    }
                    this.require_playerMgr.Instance().playing_special_hu += 2000;
                }
            }

            if(huType.indexOf(-3) != -1 || huType.indexOf(-4) != -1){
                msg.hutypeList.splice(qingyise, 1);
            }

            if (huType.length > 0) {
                this.require_DeskED.notifyEvent(this.require_DeskEvent.HU, [huType]);
            }

            // 摊开其他玩家手牌
            msg.holdcardinfoList.forEach((value, key) => {
                var player = this.require_playerMgr.Instance().getPlayer(value.userid);
                if (this.huCardIdList.huPlayer.indexOf(player.userId) != -1) {
                    var duibao = false;
                    msg.hutypeList.forEach(function (type) {
                        if (type == HuType.DUI_BAO) {
                            duibao = true;
                        }
                    });
                    player.kaipai(value.holdcardList, value.mopai, msg.hucardid, duibao);   //胡家 开牌的数据完整
                } else {
                    player.kaipai(value.holdcardList, value.mopai);
                }
            });

            huPlayerObject.hu(msg.hucardid, msg.hutypeList, isZiMo);    //播放胡家的胡特效

            cc.log('【按键】胡牌点击完成 发送关闭按键消息');
            this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

            if (!cc.replay_gamedata_scrolling) {
                this.stopHuPaiAni(isZiMo);
            }

            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
            player_down_ui.setShoupaiTingbiaoji(false);

            cc.gateNet.Instance().clearDispatchTimeout();
        }

        if(this.require_playerMgr.Instance().chupai_timeout_on_ting){
            setTimeout(function () {
                func();
            }.bind(this),600);
        }else{
            func();
        }
    },

    on_mj_ack_send_current_result: function( msg ) {
        this.huCardIdList = null;
        msg.isshangjuhuangzhuang = this.lastHuangzhuang;
        if ( !this.headerHandle( msg ) ) return;
        this._super(msg);
    },

    on_mj_game_ack_act_huangzhuangpais: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.lastHuangzhuang = msg.isshangjuhuangzhuang;

        var userlist = this.require_playerMgr.Instance().playerList;
        for (var i = 0; userlist && i < userlist.length; ++i) {
            userlist[i].setHuangZhuangTips(this.lastHuangzhuang);
        }

        var playerHoldList = msg.holdcardinfoList;
        if(!cc.dd._.isArray(playerHoldList) || playerHoldList.length == 0){
            return;
        }
        for (var i = 0; i < playerHoldList.length; ++i) {
            var playerObject = this.require_playerMgr.Instance().getPlayer(playerHoldList[i].userid);
            playerObject.kaipai(playerHoldList[i].holdcardList, playerHoldList[i].mopai);
        }
    },

    on_mj_ack_game_send_out_card: function( msg ) {
        this.require_DeskData.Instance().waitForSendOutCard = false;

        if (!this.headerHandle(msg)) {
            this.require_DeskData.Instance().sendCard = null;

            if(msg.userid == cc.dd.user.id && this.require_DeskData.Instance().isFenZhang){
                var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
                player_down_ui.openPaitouch([]);
            }
            cc.dd.NetWaitUtil.net_wait_end();
            return;
        }

        this._super(msg);
    },

    on_mj_ack_game_ting: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //听牌
        if(this.handlerType != HANDLER_TYPE.REPLAY){
            if(msg.userid == cc.dd.user.id && this.require_DeskData.Instance().isFenZhang){
                var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
                player_down_ui.openPaitouch([]);
            }
        }
        this._super(msg);
    },

    on_mj_ack_game_act_guo: function( msg ) {
        if (!this.headerHandle(msg)) return;
        var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
        if(player){
            player.guo();
            if(this.require_DeskData.Instance().isFenZhang){
                player.clearCtrlStatus();
            }
        }
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

        if(msg.userid == cc.dd.user.id){
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
            player_down_ui.setShoupaiTingbiaoji(false);
        }
    },

    on_JiaoPaiInfo: function( msg ) {
        // cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).updateHeadTing(msg.fan, msg.hutypesList);
        let player = this.require_playerMgr.Instance().getPlayer(msg.fan);
        if(player) {
            player.setTingTips(msg.hutypesList);
        }
    },

    initMJComponet(){
        return require("mjComponentValue").hlmj;
    },
});

module.exports = new fz_handler();