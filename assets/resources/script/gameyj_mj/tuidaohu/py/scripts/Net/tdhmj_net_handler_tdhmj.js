var dd = cc.dd;
var DeskData = require('tdhmj_desk_data').DeskData;
var DeskED = require('tdhmj_desk_data').DeskED;
var DeskEvent = require('tdhmj_desk_data').DeskEvent;

var game_room_cfg = require('game_room');
var GmPaiKu = require('jlmj_gm_paiku').GmPaiKu.Instance();

const hall_common_data = require('hall_common_data').HallCommonData;
const Hall = require('jlmj_halldata');
var HuType = require('jlmj_define').HuType;
const hall_rooms_data = require('klb_hall_RoomData').HallRoomsData.instance();

var jlmj_prefab = require('jlmj_prefab_cfg');

var playerMgr = require('tdhmj_player_mgr');

var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var UserPlayer = require("tdhmj_userPlayer_data").Instance();

var cc_handler = cc.Class({

    ctor: function () {
        cc.log("tdhmj_net_handler_tdhmj 父类");
    },

    /**
     * 判断header是否有效
     * @param msg
     */
    headerHandle: function (msg) {
        if (cc.dd.Utils.isNull(msg)) {
            return false;
        }

        if (cc.dd.Utils.isNull(msg.header)) {
            return true;
        }

        if (msg.header.code !== 0) {
            cc.error(msg.header.error + " code = " + msg.header.code);
            return false;
        }
        return true;
    },

    /**
     * 开始游戏 消息
     */
    on_neimenggu_ack_game_opening: function( msg ) {
        DeskData.Instance().setIsStart( true );
        DeskData.Instance().isGameStart = true;
        DeskData.Instance().setFirstMoPai( true );
        this.realCardID = {};

        if (!this.headerHandle(msg)) return;
        cc.dd.mj_game_start = true;
        this.waitTime = 0;

        DeskData.Instance().banker = msg.bankerid;
        playerMgr.Instance().setBanker(msg.bankerid);
        playerMgr.Instance().hidePlayerReady();
        DeskData.Instance().remainCards = 120;
        DeskData.Instance().setLianzhuang(msg.oldbankerid == msg.bankerid ? msg.bankerid : 0);//设置连庄
        DeskData.Instance().startGame();
        if (msg.currplaycount > DeskData.Instance().currPlayCount) {//正常玩时每圈显示一次， 断线重连每次显示
            DeskData.Instance().setCurrRound(msg.currplaycount);
        }

        if(DeskData.Instance().isFriend()){
            cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info').cleanJieSuan()
        }else if(DeskData.Instance().isJBC() || DeskData.Instance().isMatch()){
            cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info_jbc').cleanJieSuan()
        }
    },

    on_neimenggu_ack_game_deal_cards: function( msg ) {
        UserPlayer.waitTing = false;

        if (!this.headerHandle(msg)) return;
        if(DeskData.Instance().isInMaJiang()){
            cc.gateNet.Instance().dispatchTimeOut(4);
        }

        playerMgr.Instance().playing_fapai_ani = true;
        playerMgr.Instance().setPlayerCardList(msg.playercardList);

        if(!cc.replay_gamedata_scrolling){
            var play_list = cc.find('Canvas/player_list').getComponent('tdhmj_player_list');
            play_list.playerUpdateShouPaiUI();
        }
        if(RoomMgr.Instance()._Rule.ispaofen){
            DeskED.notifyEvent(DeskEvent.SHOW_PAO_FEN);
            var player = playerMgr.Instance().getPlayer(UserPlayer.userId);
            if (player) {
                var userlist = playerMgr.Instance().playerList;
                for (var i = 0; userlist && i < userlist.length; ++i) {
                    if(userlist[i]){
                        userlist[i].cleardapaiCding();
                    }
                }
                player.dapaiCding({time:8});
            }
        }else{
            DeskED.notifyEvent(DeskEvent.FAPAI);
        }
    },

    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_neimenggu_ack_roomInit: function( msg ) {
        this.huCardIdList = null;
        if (!this.headerHandle(msg)) return;
        this.waitTime = 0;
        RoomMgr.Instance().setGameCommonInfo(msg.deskinfo.desktype,msg.deskinfo.passwrod,msg.deskinfo.owner);
        DeskData.Instance().setDeskRule(msg.deskinfo);
        playerMgr.Instance().playing_fapai_ani = true;
        playerMgr.Instance().setPlayerList(msg.playersList);

        //游戏开始后关闭GPS
        var play_list = cc.find('Canvas/player_list').getComponent('tdhmj_player_list');
        play_list.closeGPSWarn();

    },

    on_neimenggu_ack_game_overturn: function( msg ) {
        if (!this.headerHandle(msg)) return;
        cc.dd.NetWaitUtil.net_wait_end();
        DeskData.Instance().isHu = false;
        var clearHeadTexiao = function () {
            var userlist = playerMgr.Instance().playerList;
            for (var i = 0; userlist && i < userlist.length; ++i) {
                userlist[i].cleardapaiCding();
            }
        };
        var player = playerMgr.Instance().getPlayer(msg.userid);
        if(player){
            clearHeadTexiao();
            player.dapaiCding(msg);
        }
        if (msg.acttype == 1) { //正常摸牌
            if (player) {
                player.mopai(msg);
                var isNomalMo = msg.acttype == 1; //1是正常摸牌
                DeskED.notifyEvent(DeskEvent.MO_PAI_ACT, [1, msg.paicount, isNomalMo, 0, 0]);

                // if (playerMgr.Instance().playing_shou2mid_ani) { //上家正在打牌动画,
                //     cc.log('上家打牌动画中,记录下家已摸牌');
                //     // playerMgr.Instance().normal_mopaiing = true;
                //     var id = playerMgr.Instance().shou2mid_id_list.pop();
                //     playerMgr.Instance().mid2dapai_id_list.push(id);
                // } else {  //上家出牌动画结束,则播放入牌海动画
                //     cc.log('上家打牌动画结束,播放入牌海动画');
                //     var id = playerMgr.Instance().shou2mid_id_list.pop();
                //     playerMgr.Instance().playerMid2DapaiAction(id);
                // }
                playerMgr.Instance().playerMoPaiAction();
            }
            DeskData.Instance().setisFenzhangMopai();
            DeskData.Instance().setRemainCard(msg.paicount);
        } else if (msg.acttype == 2) { // 碰OTHER

        } else if (msg.acttype == 3) {  //打牌
            //轮到谁打牌

        } else if (msg.acttype == 4) { //看宝操作

        }
        else if (msg.acttype == 5) { //杠牌或者补杠引起的摸牌
            if (player) {
                player.mopai(msg);
                var isNomalMo = msg.acttype == 1; //1是正常摸牌 5是杠牌摸牌
                DeskED.notifyEvent(DeskEvent.MO_PAI_ACT, [1, msg.paicount, isNomalMo, 0, 0]);
            }
            DeskData.Instance().setisFenzhangMopai();
            DeskData.Instance().setRemainCard(msg.paicount);
        } else if (msg.acttype == 6) {  //每局第一手打牌
            if (player) {
                DeskData.Instance().setRemainCard(msg.paicount);//安全起见 没有放到外面处理
                DeskED.notifyEvent(DeskEvent.MO_PAI_ACT, [1, msg.paicount, true, 0, 0]);
            }
        }
        if(msg.cannothutipsList && msg.cannothutipsList.length && msg.userid == cc.dd.user.id){
            DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [1,true]);
        }else if(msg.userid == cc.dd.user.id){
            DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [-1,false]);
        }
        //用户玩家可操作选项
        UserPlayer.setCpgth(msg);
        if (msg.jiaoinfosList.length) {
            UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
        }

        if (player && player.isUserPlayer()) {
            if (!cc.dd.AppCfg.IS_DEBUG) {
                //设置是否自动出牌
                player.setAutoChuPai(msg);
            }
        }


        //玩家没有摸牌,直接提示操作菜单
        var menu_list = cc.find("Canvas/game_menu_list");
        if (!UserPlayer.hasMoPai()) {
            //吃,碰,点杠
            if (menu_list) {
                menu_list.getComponent("tdhmj_game_menu_list").setMenus(UserPlayer);
            }
        }else if(msg.acttype == 1 && (msg.cangang || msg.canbugang || msg.canhu || msg.canting)){
            if (menu_list && player && player.userId == cc.dd.user.id) {
                menu_list.getComponent("tdhmj_game_menu_list").setMenus(UserPlayer);
            }
        }else{
            if(msg.acttype != 1){
                if(player&&player.userId == cc.dd.user.id){
                    if(menu_list){
                        menu_list.getComponent("tdhmj_game_menu_list").setMenus(UserPlayer);
                    }
                }
            }
            if( msg.acttype == 1 && msg.actcard && cc.dd._.isUndefined(msg.actcard.id) ){  //修复,补杠断线重连不显示杠
                if(player&&player.userId == cc.dd.user.id){
                    if(menu_list){
                        menu_list.getComponent("tdhmj_game_menu_list").setMenus(UserPlayer);
                    }
                }
            }
        }

    },

    on_neimenggu_ack_game_send_out_card: function( msg ) {
        DeskData.Instance().waitForSendOutCard = false;

        if (!this.headerHandle(msg)) {
            DeskData.Instance().sendCard = null;

            if(msg.userid == cc.dd.user.id && msg.card && this.realCardID && msg.card.id != this.realCardID[msg.userid]){
                let player = playerMgr.Instance().getPlayer(msg.userid);
                if(player.shoupai.indexOf(msg.card.id) == -1) {
                    var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('tdhmj_player_down_ui');
                    player_down_ui.stopChuPai();

                    player.addShouPai([msg.card.id]);
                    player.paixu();
                    let idx = player.chupai.indexOf(msg.card.id);
                    if(idx != -1){
                        player.chupai.splice(idx, 1);
                    }

                    player_down_ui.removeChupai(player);
                    player_down_ui.updateShouPai();

                    // if(cc.dd._.isArray(UserPlayer.waitDapai) && UserPlayer.waitDapai.length > 0){
                    //     let pai = UserPlayer.waitDapai.shift();
                    //     playerMgr.Instance().shou2mid_id_list.push(pai);
                    //     UserPlayer.dapai(pai);
                    // }
                }
            }
            cc.dd.NetWaitUtil.net_wait_end();
            return;
        }

        if(!this.realCardID){
            this.realCardID = {};
        }
        this.realCardID[msg.userid] = msg.card.id;

        if(UserPlayer.canting && !UserPlayer.curjiaoPaiInfo_list && cc.dd.user.id == msg.userid){
            UserPlayer.setJiaoInfo(msg.card.id);
        }
        if(cc.dd.user.id == msg.userid){
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('tdhmj_player_down_ui');
            player_down_ui.setShoupaiTingbiaoji(false);
        }
        var func = function () {
            var player = playerMgr.Instance().getPlayer(msg.userid);
            if (player) {
                if(msg.userid != cc.dd.user.id || ((player.isBaoTing || UserPlayer.waitTing || DeskData.Instance().isoffline) && player.chupai.indexOf(msg.card.id) == -1) || player.replaying || player.shoupai.indexOf(msg.card.id) != -1){
                    // if(msg.userid == cc.dd.user.id && UserPlayer.mid2dapai_playing){
                    //     if(!cc.dd._.isArray(UserPlayer.waitDapai)){
                    //         UserPlayer.waitDapai = [];
                    //     }
                    //     UserPlayer.waitDapai.push(msg.card.id);
                    // }else{
                        playerMgr.Instance().shou2mid_id_list.push(msg.card.id);
                        player.dapai(msg.card.id);
                    // }
                }
            }
            if(msg.userid == cc.dd.user.id){
                UserPlayer.waitTing = false;
            }

            DeskData.Instance().last_chupai_id = msg.card.id;
            if(!DeskData.Instance().dabaoing){
                DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
            }
            playerMgr.Instance().chupai_timeout_on_ting = false;
        };

        //听牌后的出牌延时
        if(playerMgr.Instance().chupai_timeout_on_ting){
            setTimeout(function () {
                func();
            }.bind(this),300);
        }else{
            func();
        }
        DeskED.notifyEvent(DeskEvent.STOP_TIMEUP,[]);
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_neimenggu_ack_update_deposit: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var isoffline = msg.isdeposit;
        DeskData.Instance().isoffline = isoffline;
        //发出事件
        DeskED.notifyEvent(DeskEvent.TUO_GUAN, isoffline);
    },



    on_neimenggu_ack_chi: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //被吃的牌，移除
        var playerOut = playerMgr.Instance().getPlayer(msg.useridout);
        if (playerOut) {
            playerOut.beichi();
        }

        //吃的牌，移除
        var playerIn = playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.chi(msg.chicardList);
        }

        if(!cc.replay_gamedata_scrolling){
            playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('tdhmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-吃牌');
        }

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('tdhmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_neimenggu_ack_game_act_peng: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //被碰的牌，移除
        var playerOut = playerMgr.Instance().getPlayer(msg.useridout);
        if (playerOut) {
            if (msg.isrob) {
                playerOut.beiQiangPeng();
            } else {
                playerOut.beipeng();
            }
        }

        //碰的牌，移除
        var playerIn = playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.peng(msg.pengcardList);
        }

        if(!cc.replay_gamedata_scrolling){
            playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('tdhmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-碰牌');
        }

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('tdhmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_neimenggu_ack_game_act_gang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        var playerOut = playerMgr.Instance().getPlayer(msg.useridout);
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
        var playerIn = playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.gang(msg);
        }

        if(!cc.replay_gamedata_scrolling){
            playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('tdhmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-杠牌');
        }

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('tdhmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_neimenggu_ack_game_act_bugang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //玩家补杠
        var playerIn = playerMgr.Instance().getPlayer(msg.userid);
        if (playerIn) {
            playerIn.bugang(msg);
        }
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('tdhmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_neimenggu_ack_game_act_guo: function( msg ) {
        if (!this.headerHandle(msg)) return;
        UserPlayer.guo();
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('tdhmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
    },

    on_neimenggu_ack_game_ting: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //听牌
        var player = playerMgr.Instance().getPlayer(msg.userid);
        player.ting();
        // playerMgr.Instance().chupai_timeout_on_ting = true;
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);

        cc.gateNet.Instance().dispatchTimeOut(0.3);

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('tdhmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_neimenggu_ack_game_dabao: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().dabao(msg);
        DeskED.notifyEvent(DeskEvent.MO_HUAN_BAO_PAI, [msg.baopaiindex, null]);
        cc.gateNet.Instance().dispatchTimeOut(2);
    },

    on_neimenggu_ack_game_changbao: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().changebao(msg);
        DeskED.notifyEvent(DeskEvent.MO_HUAN_BAO_PAI, [msg.newbaopaiindex, true]);
    },

    on_neimenggu_ack_reconnect: function( msg ) {
        DeskData.Instance().waitForSendOutCard = false;

        if (!this.headerHandle(msg)) return;
        cc.dd.mj_game_start = true;
        this.realCardID = {};
        for( var i = 0; i < msg.playerinfoList.length; ++i ) {
            var id = msg.playerinfoList[i].userid;
            if(msg.playerinfoList[i].playercard.outcardList.length > 0){
                this.realCardID[id] = msg.playerinfoList[i].playercard.outcardList[msg.playerinfoList[i].playercard.outcardList.length - 1];
            }
        }
        this.waitTime = 0;

        DeskData.Instance().isGameStart = true;
        DeskData.Instance().clear();
        playerMgr.Instance().clear();

        //关闭一次解散房间界面
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIESAN);
        //处理一局完成后 如果玩家已经准备
        this.comData(msg);
        //设置恢复数据
        RoomMgr.Instance()._Rule = msg.deskrules.createcfg;
        RoomMgr.Instance().setGameCommonInfo(msg.deskrules.desktype,msg.deskrules.passwrod,msg.deskrules.owner);
        if(msg.deskrules.desktype == cc.dd.Define.GameType.TDHMJ_GOLD){   //金币场
            var room_cfg = game_room_cfg.getItem(function (item) {
                return item.key == msg.deskrules.configid;
            });
            RoomMgr.Instance().roomLv = room_cfg.roomid;
        }

        for( var i = 0; i < msg.playerinfoList.length; ++i ) {
            var id = msg.playerinfoList[i].userid;
            if( cc.dd.user.id === id ) {
                DeskData.Instance().zhiNan_site = msg.playerinfoList[i].site;
                break;
            }
        }

        DeskData.Instance().setDeskRule(msg.deskrules, msg.deskgameinfo.gamestatus);
        DeskData.Instance().setRecoverData(msg.deskgameinfo);

        // 重连游戏
        var gameType = msg.deskrules.desktype;
        cc.log("-------ccpyc 断线重连------0");

        let func = ()=>{
            cc.log("-------ccpyc 设置玩家数据------1");
            playerMgr.Instance().setPlayerList(msg.playerinfoList);
            cc.log("-------ccpyc 设置玩家数据------2");
            UserPlayer.paixu();
            UserPlayer.isTempBaoTing = false;   //清除临时报听状态
            if(msg.jiaoinfosList.length){
                UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
            }

            if(DeskData.Instance().isFriend()){
                cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info').cleanJieSuan()
            }else if(DeskData.Instance().isJBC() || DeskData.Instance().isMatch()){
                cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info_jbc').cleanJieSuan()
            }

            //发出事件 如果在房间内则直接刷新  如果在大厅 则先进入房间内在刷新
            cc.log("-------ccpyc 断线重连------1");
            DeskED.notifyEvent(DeskEvent.RECOVER_DESK, msg.deskrules.desktype);


            //关闭一次gps
            //var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
            //play_list.closeGPSWarn();

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

            // for(let k in reconnect_hu){
            //     if(reconnect_hu.hasOwnProperty(k)){
            //         if(reconnect_hu[k] == 2){
            //             DeskED.notifyEvent(DeskEvent.HU, [[-1]]);
            //         }else if(reconnect_hu[k] == 3){
            //             DeskED.notifyEvent(DeskEvent.HU, [[-2]]);
            //         }
            //     }
            // }
            if(playerMgr.Instance().playing_fapai_ani){
                this.stopFaPaiAni();
            }

            //排序手牌
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('tdhmj_player_down_ui');
            player_down_ui.updateShouPai(UserPlayer);

            //游戏开始后关闭GPS
            var play_list = cc.find('Canvas/player_list').getComponent('tdhmj_player_list');
            play_list.refreshGPSWarn();
        }


        // 没有在场景里面 需要进入场景
        if(!cc.dd.SceneManager.isGameSceneExit( gameType )){
            cc.dd.SceneManager.enterGame( gameType, func );
        }else{
            func();
        }

    },

    /**
     * 处理一局完成后 如果玩家已经准备
     * @param data
     */
    comData: function (msg) {
        var isClear = false;
        var playerList = msg.playerinfoList;
        for (var i = 0; i < playerList.length; ++i) {
            if (playerList[i].userid == dd.user.id) {
                isClear = playerList[i].bready == 1;
                break;
            }
        }
        if (isClear) {
            var playerList = msg.playerinfoList;
            for (var i = 0; i < playerList.length; ++i) {
                if (playerList[i].userid) {
                    playerList[i].playercard.handcardList = [];// 玩家的手牌、摆牌（碰杠）、已打出的牌、胡牌信息。客户端需根据服务端的返回进行排序动画。
                    playerList[i].playercard.outcardList = [];
                    playerList[i].playercard.composecardList = [];
                    playerList[i].playercard.handcardcount = 0;
                    playerList[i].isbaoting = false; //是否已报听
                }
            }
            msg.deskgameinfo.unbaopai = -1;
            msg.deskgameinfo.remaincards = 120;
            msg.deskgameinfo.banker = 0;
        }
    },

    on_neimenggu_ack_remain_majiang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        GmPaiKu.setPaiKu(msg.cardsList);
        cc.resources.load('gameyj_mj_tools/jlmj_gm_huanpai', cc.Prefab, function (err, prefab) {
            var huanpai = cc.instantiate(prefab);
            huanpai.parent = cc.find('Canvas');
        }.bind(this));
    },

    on_neimenggu_ack_change_majiang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        GmPaiKu.changePai(msg);
    },

    /**
     * 胡牌 消息
     * @param msg
     */
    on_neimenggu_game_ack_act_hu: function( msg ) {
        if ( !this.headerHandle( msg ) ) {
            cc.log('胡牌点击未完成--0 headerHandle == fasle');
            return;
        };
        cc.dd.NetWaitUtil.net_wait_end();

        if(DeskData.Instance().isInMaJiang()){
            cc.gateNet.Instance().dispatchTimeOut(2);
        }

        DeskData.Instance().isHu = true;
        DeskData.Instance().isPlayHuAni = true;

        // 删除点炮玩家最后打出那张牌
        var beihuPlayerObject = playerMgr.Instance().getPlayer(msg.dianpaoplayerid);
        var huPlayerObject = playerMgr.Instance().getPlayer(msg.huplayerid);
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

        playerMgr.Instance().playing_special_hu = 0;

        if(this.huCardIdList.huPlayer.indexOf(huPlayerObject.userId) != -1){
            this.huCardIdList.count--;
            let idx = this.huCardIdList.huPlayer.indexOf(huPlayerObject.userId)
            this.huCardIdList.huPlayer.splice(idx, 1);
            this.huCardIdList.huType.splice(idx, 1);

            for(let i = 0; i < this.huCardIdList.huPlayer.length; i++){
                let _huPlayerObject = playerMgr.Instance().getPlayer(this.huCardIdList.huPlayer[i]);
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

        // 摊开其他玩家手牌
        msg.holdcardinfoList.forEach((value, key)=> {
            var player = playerMgr.Instance().getPlayer(value.userid);
            if(this.huCardIdList.huPlayer.indexOf(player.userId) != -1){
                player.kaipai(value.holdcardList, value.mopai, msg.hucardid);   //胡家 开牌的数据完整
            }else{
                player.kaipai(value.holdcardList, value.mopai);
            }
        });

        huPlayerObject.hu(msg.hucardid, msg.hutypeList, isZiMo);    //播放胡家的胡特效


        for(let i = 0; i < msg.hutypeList.length; i++){
            if(msg.hutypeList[i] == HuType.QI_DUI || msg.hutypeList[i] == HuType.HAO_QI || msg.hutypeList[i] == HuType.SHUANG_HAO_QI || msg.hutypeList[i] == HuType.ZHIZUN_HAO_QI || msg.hutypeList[i] == HuType.GANG_PAO_HU || msg.hutypeList[i] == HuType.GANG_HUA_HU){
                huType.push(msg.hutypeList[i]);
                // playerMgr.Instance().playing_special_hu += 2000;
            }
        }

        DeskED.notifyEvent(DeskEvent.HU, [huType]);

        cc.log('【按键】胡牌点击完成 发送关闭按键消息');
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);

        if(!cc.replay_gamedata_scrolling){
            playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('tdhmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-胡牌');
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('tdhmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
    },

    /**
     * 小结算 消息
     * @param msg
     */
    on_neimenggu_ack_send_current_result: function( msg ) {
        cc.log('【数据】普通结算消息接收 开始');
        if ( !this.headerHandle( msg ) ) return;
        let laseJiesuan = cc.find("Canvas/toppanel/last_jie_suan");
        if(laseJiesuan){
            laseJiesuan.active = false;
        }

        DeskData.Instance().waitJiesuan = true;
        DeskData.Instance().unlockScene();

        DeskData.Instance().setIsStart( false );

        this.huCardIdList = null;

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);//关闭menu

        msg.jiesuanBanker = DeskData.Instance().banker;

        //显示其他玩家的暗杠
        msg.playercoininfoList.forEach(function (item) {
            if(item && item.userid){
                if(item.userid != cc.dd.user.id){
                    var other_player = playerMgr.Instance().getPlayer(item.userid);
                    if(other_player){
                        other_player.openAnGang(item.pailistList);
                    }
                }
            }
        });

        //显示宝牌
        if(msg.baopaiList && msg.baopaiList.length>0){
            DeskData.Instance().setBaoPai( msg.baopaiList[msg.baopaiList.length-1].id );
        }
        var play_list = cc.find('Canvas/player_list').getComponent('tdhmj_player_list');
        play_list.playerUpdateShouPaiUI();

        if(!msg.huuserid){
            DeskED.notifyEvent(DeskEvent.HUANG_ZHUANG_ANI,[]);
        }

        this.waitTime = 500 + playerMgr.Instance().playing_special_hu;

        setTimeout(()=>{
            DeskData.Instance().jiesuan( msg );
            this.waitTime = 0;
        }, this.waitTime);

        DeskED.notifyEvent(DeskEvent.OPEN_BAO_PAI,[]);
        DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        cc.log('【数据】普通结算消息接收 完成 ');
    },

    on_neimenggu_ack_operator: function( msg ) {
        if (!this.headerHandle(msg)) return;

        // 出牌剩余时间
        var remainingTime = msg.remainingtime;
        // 闪动光标玩家
        var actCursorId = msg.actcursorid;
        if (actCursorId && actCursorId != 0) {
            var playerObject = playerMgr.Instance().getPlayer(actCursorId);
            var arg = { time: (remainingTime ? (remainingTime < 100 ? remainingTime : 100) : 0) };
            playerObject.dapaiCding(arg);
        }
        // 上下浮动箭头玩家
        var lastActOutId = msg.lastactoutid;
        if (lastActOutId && lastActOutId != 0) {
            var playerObject = playerMgr.Instance().getPlayer(lastActOutId);
            playerObject.takeOverZsq();
        }
    },

    on_neimenggu_ack_reloading_ok: function( msg ) {
        if (!this.headerHandle(msg)) return;

        DeskData.Instance().unlockScene();
    },

    on_neimenggu_ack_ready: function( msg ) {
        if (!this.headerHandle(msg)) return;
        playerMgr.Instance().clearPai();

        playerMgr.Instance().playerList.forEach(function (item, idx) {
            if (item) {
                item.cleardapaiCding();
            }
        })
        var player = playerMgr.Instance().getPlayer(msg.header.userid);
        if (player) {
            player.clearHeadNearby();
            player.setReady(1);

            if(msg.header.userid == cc.dd.user.id){
                DeskData.Instance().clear();
                playerMgr.Instance().clear();
                if(DeskData.Instance().isFriend()){
                    cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info').cleanJieSuan();
                    cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info').setLastJieSuanActive();
                }else if(DeskData.Instance().isJBC() || DeskData.Instance().isMatch()){
                    cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info_jbc').cleanJieSuan()
                }
            }
        }
    },

    on_neimenggu_ack_sponsor_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().sponsorDissolveRoom(msg);
    },

    on_neimenggu_ack_response_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().responseDissolveRoom(msg);
    },

    on_neimenggu_ack_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        if (cc.director.getScene().name != 'tdhmj_py_game') {
            return;
        }
        DeskData.Instance().dissolveRoom(msg);
    },

    on_neimenggu_ack_exit_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().exitRoom(msg);
    },

    on_neimenggu_ack_finally_result: function( msg ) {
        cc.log('【数据】战绩消息接收 开始');
        if (!this.headerHandle(msg)) return;
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIESAN);
        DeskData.Instance().isGameEnd = true;
        if(cc.dd._.isNull(this.waitTime) || cc.dd._.isUndefined(this.waitTime)){
            this.waitTime = 0;
        }
        // if(this.waitTime!=0){
        //     this.waitTime += 2000;
        // }
        setTimeout(()=>{
            DeskData.Instance().showResultView(msg);
        },this.waitTime);
        cc.log('【数据】战绩消息接收 结束');
    },

    on_neimenggu_ack_fen_zhang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        cc.log('【数据】分张消息接收');
        DeskData.Instance().fenzhang();
    },

    on_neimenggu_ack_rob_remove_card: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var player = playerMgr.Instance().getPlayer(msg.userid);
        player.removeRobCard_new(msg.cardid, msg.robtype);
    },

    on_neimenggu_game_ack_act_huangzhuangpais: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var playerHoldList = msg.holdcardinfoList;
        for (var i = 0; i < playerHoldList.length; ++i) {
            var playerObject = playerMgr.Instance().getPlayer(playerHoldList[i].userid);
            playerObject.kaipai(playerHoldList[i].holdcardList, playerHoldList[i].mopai);
        }
    },

    /**
     * 网络状况  4个心跳包收到个数
     */
    on_msg_hearbeat_num: function (msg) {
        var data = { userId: msg.userId, isWeak: msg.num < 3 };
        RoomED.notifyEvent(RoomEvent.player_signal_state, [data]);
    },

    /**
     * 金币场 听牌后更新宝牌
     * @param msg
     */
    on_neimenggu_ack_bao: function (msg) {
        DeskData.Instance().setBaoPai( msg.card );
        if(!cc.replay_gamedata_scrolling){
            cc.find("Canvas/desk_info").getComponent('tdhmj_desk_info').update_bao_pai();
        }
    },

    /**
     * 金币更新
     * @param msg
     */
    on_neimenggu_ack_update_coin: function( msg ) {
        cc.log( msg.userid + "更新金币" );
    },

    on_neimenggu_ack_paofen: function(msg){
        var player = playerMgr.Instance().getPlayer(msg.userid);
        if(player){
            player.showPaoFen(msg.score);
        }else{
            if(!cc.replay_gamedata_scrolling && !DeskData.Instance().isReplay()) {
                DeskED.notifyEvent(DeskEvent.FAPAI);
            }
        }
    },

    stopFaPaiAni(){
        let desk_node = cc.find("Canvas/desk_node")
        if(!cc.dd._.isNull(desk_node)){
            let animation = desk_node.getComponent(cc.Animation);
            if(!cc.dd._.isNull(animation)){
                if(animation.currentClip){
                    let _as = animation.getAnimationState(animation.currentClip._name);
                    if(!cc.dd._.isNull(_as)){
                        animation.setCurrentTime(_as.duration);
                        animation.stop();
                    }
                }
            }
            desk_node.getComponent('tdhmj_scene').jlmjPlayerDownSortShouPai();
        }
    }
});

module.exports = new cc_handler();