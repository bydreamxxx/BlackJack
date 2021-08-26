var dd = cc.dd;
var DeskData = require('scmj_desk_data').DeskData;
var DeskED = require('scmj_desk_data').DeskED;
var DeskEvent = require('scmj_desk_data').DeskEvent;

var game_room_cfg = require('game_room');
var GmPaiKu = require('jlmj_gm_paiku').GmPaiKu.Instance();

const hall_common_data = require('hall_common_data').HallCommonData;
const Hall = require('jlmj_halldata');
var HuType = require('jlmj_define').HuType;
const hall_rooms_data = require('klb_hall_RoomData').HallRoomsData.instance();

var jlmj_prefab = require('jlmj_prefab_cfg');

var playerMgr = require('scmj_player_mgr');
var PlayerED = require('jlmj_player_data').PlayerED;
var PlayerEvent = require('jlmj_player_data').PlayerEvent;

var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var UserPlayer = require("scmj_userPlayer_data").Instance();

var xzmj_handler = cc.Class({

    ctor: function () {
        cc.log("scmj_net_handler_scmj 父类");
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

        if(DeskData.Instance().pauseGameOut === true){
            return false;
        }
        return true;
    },

    /**
     * 开始游戏 消息
     */
    on_xzmj_ack_game_opening: function( msg ) {
        DeskData.Instance().waitForSendOutCard = true;
        DeskData.Instance().setIsStart( true );
        DeskData.Instance().isGameStart = true;
        DeskData.Instance().setFirstMoPai( true );
        DeskData.Instance().isHu = false;
        DeskData.Instance().jiesuanData = null;
        this.realCardID = {};
        this.waitTime = 0;

        if (!this.headerHandle(msg)) return;
        cc.dd.mj_game_start = true;

        DeskData.Instance().banker = msg.bankerid;
        playerMgr.Instance().setBanker(msg.bankerid);
        playerMgr.Instance().hidePlayerReady();
        if(RoomMgr.Instance()._Rule){
            if(RoomMgr.Instance()._Rule.usercountlimit == 4){
                DeskData.Instance().remainCards = 108;
            }else{
                DeskData.Instance().remainCards = RoomMgr.Instance()._Rule.issanfang ? 108 : 71;
            }
        }else{
            DeskData.Instance().remainCards = 108;
        }
        DeskData.Instance().setLianzhuang(msg.oldbankerid == msg.bankerid ? msg.bankerid : 0);//设置连庄
        DeskData.Instance().startGame();
        if (msg.currplaycount > DeskData.Instance().currPlayCount) {//正常玩时每圈显示一次， 断线重连每次显示
            DeskData.Instance().setCurrRound(msg.currplaycount);
        }

        if(DeskData.Instance().isFriend()){
            cc.find('Canvas/desk_info').getComponent('scmj_desk_info').cleanJieSuan()
        }else if(DeskData.Instance().isJBC() || DeskData.Instance().isMatch()){
            cc.find('Canvas/desk_info').getComponent('scmj_desk_info_jbc').cleanJieSuan()
        }

        //防止重连之后开局定缺状态被更新
        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
        player_down_ui.clearDingque();
    },

    on_xzmj_ack_game_deal_cards: function( msg ) {
        UserPlayer.waitTing = false;
        DeskData.Instance().waitForSendOutCard = true;

        if (!this.headerHandle(msg)) return;

        if(DeskData.Instance().isInMaJiang()){
            cc.gateNet.Instance().dispatchTimeOut(4);
        }

        playerMgr.Instance().playing_fapai_ani = true;
        playerMgr.Instance().setPlayerCardList(msg.playercardList);

        let showFapai = true;
        //如果已经有玩家有摆牌了，就不播动画
        for(let i = 0; i < msg.playercardList.length; i++){
            if(msg.playercardList[i].composecardList.length > 0){
                showFapai = false;
                cc.gateNet.Instance().clearDispatchTimeout();

                if(playerMgr.Instance().playing_fapai_ani){
                    this.stopFaPaiAni();
                }

                break
            }
        }

        if(!cc.replay_gamedata_scrolling){
            var play_list = cc.find('Canvas/player_list').getComponent('scmj_player_list');
            play_list.playerUpdateShouPaiUI();
        }

        if(showFapai){
            DeskED.notifyEvent(DeskEvent.FAPAI);
            let wan = 0;
            if(RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.usercountlimit != 4 && !RoomMgr.Instance()._Rule.issanfang){
                wan = 36;
            }
            let card = 108 - wan - RoomMgr.Instance()._Rule.usercountlimit * 13 - 1;
            DeskData.Instance().setRemainCard(card);
        }

        // DeskED.notifyEvent(DeskEvent.DUIJU_START);
    },

    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_xzmj_ack_roomInit: function( msg ) {
        DeskData.Instance().pauseGameOut = false;
        DeskData.Instance().waitForSendOutCard = true;
        this.huCardIdList = null;
        this.reconnect_hu = null;
        DeskData.Instance().isHu = false;
        DeskData.Instance().jiesuanData = null;
        this.waitTime = 0;

        if (!this.headerHandle(msg)) return;
        this.waitForShaizi = true;

        RoomMgr.Instance().setGameCommonInfo(msg.deskinfo.desktype,msg.deskinfo.passwrod,msg.deskinfo.owner);
        DeskData.Instance().setDeskRule(msg.deskinfo);
        playerMgr.Instance().playing_fapai_ani = true;
        playerMgr.Instance().setPlayerList(msg.playersList);
        // if(!playerMgr.Instance().playing_shaizi){
        //     DeskED.notifyEvent(DeskEvent.FAPAI);
        // }
        DeskED.notifyEvent(DeskEvent.DUIJU_START);

        //游戏开始后关闭GPS
        var play_list = cc.find('Canvas/player_list');
        if(play_list){
            var pl = play_list.getComponent('scmj_player_list');
            pl.closeGPSWarn();
        }

    },

    on_xzmj_ack_game_overturn: function( msg ) {
        if (!this.headerHandle(msg)) return;

        DeskData.Instance().noCDAudio = false;

        if(msg.cannothutipsList && msg.cannothutipsList.length && msg.userid == cc.dd.user.id){
            DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [1,true]);
        }else if(msg.userid == cc.dd.user.id){
            DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [-1,false]);
        }

        cc.dd.NetWaitUtil.net_wait_end();
        playerMgr.Instance().hidePlayerReady();
        DeskData.Instance().isHu = false;
        var clearHeadTexiao = function () {
            var userlist = playerMgr.Instance().playerList;
            for (var i = 0; userlist && i < userlist.length; ++i) {
                if(userlist[i]){
                    userlist[i].cleardapaiCding();
                }
            }
        };

        // cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui').setPaiTouch(msg.userid == cc.dd.user.id);

        var player = playerMgr.Instance().getPlayer(msg.userid);
        if(player){
            clearHeadTexiao();
            player.dapaiCding(msg);
        }
        if (msg.acttype == 1) { //正常摸牌
            //不是自己的回合不能点手牌
            if (player) {
                player.mopai(msg);
                var isNomalMo = msg.acttype == 1; //1是正常摸牌
                DeskED.notifyEvent(DeskEvent.MO_PAI_ACT, [1, msg.paicount, isNomalMo, 0, 0]);
                PlayerED.notifyEvent(PlayerEvent.GENZHUANG,[player]);

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

        //用户玩家可操作选项
        UserPlayer.setCpgth(msg);
        if (msg.jiaoinfosList.length) {
            UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
        }

        if (player && player.isUserPlayer()) {
            if (!cc.dd.AppCfg.IS_DEBUG) {
                //设置是否自动出牌
                // player.setAutoChuPai(msg);
            }
        }


        //玩家没有摸牌,直接提示操作菜单
        var menu_list = cc.find("Canvas/game_menu_list");
        if (!UserPlayer.hasMoPai()) {
            //吃,碰,点杠
            if (menu_list) {
                menu_list.getComponent("scmj_game_menu_list").setMenus(UserPlayer);
            }
        }else if(msg.acttype == 1 && (msg.cangang || msg.canbugang || msg.canhu)){
            if (menu_list && player && player.userId == cc.dd.user.id) {
                menu_list.getComponent("scmj_game_menu_list").setMenus(UserPlayer);
            }
        }else{
            if(msg.acttype != 1){
                if(player&&player.userId == cc.dd.user.id){
                    if(menu_list){
                        menu_list.getComponent("scmj_game_menu_list").setMenus(UserPlayer);
                    }
                }
            }
            if( msg.acttype == 1 && msg.actcard && cc.dd._.isUndefined(msg.actcard.id) ){  //修复,补杠断线重连不显示杠
                if(player&&player.userId == cc.dd.user.id){
                    if(menu_list){
                        menu_list.getComponent("scmj_game_menu_list").setMenus(UserPlayer);
                    }
                }
            }
        }

    },

    on_xzmj_ack_game_send_out_card: function( msg ) {
        DeskData.Instance().waitForSendOutCard = false;

        if (!this.headerHandle(msg)) {
            DeskData.Instance().sendCard = null;

            if(msg.userid == cc.dd.user.id && msg.card && this.realCardID && msg.card.id != this.realCardID[msg.userid]){
                let player = playerMgr.Instance().getPlayer(msg.userid);
                if(player.shoupai.indexOf(msg.card.id) == -1) {
                    var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
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
                    //     if(pai != msg.card.id){
                    //         playerMgr.Instance().shou2mid_id_list.push(pai);
                    //         UserPlayer.dapai(pai);
                    //     }
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

        // if(DeskData.Instance().isInMaJiang()){
        //     cc.gateNet.Instance().dispatchTimeOut(2);
        // }

        if(UserPlayer.canting && !UserPlayer.curjiaoPaiInfo_list && cc.dd.user.id == msg.userid){
            UserPlayer.setJiaoInfo(msg.card.id);
        }
        if(cc.dd.user.id == msg.userid){
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
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
                }else{
                    cc.gateNet.Instance().clearDispatchTimeout();
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

    on_xzmj_ack_update_deposit: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var isoffline = msg.isdeposit;
        DeskData.Instance().isoffline = isoffline;
        //发出事件
        DeskED.notifyEvent(DeskEvent.TUO_GUAN, isoffline);
    },

    on_xzmj_ack_game_act_peng: function( msg ) {
        if (!this.headerHandle(msg)) return;

        // if(DeskData.Instance().isInMaJiang()){
        //     cc.gateNet.Instance().dispatchTimeOut(2);
        // }

        //被碰的牌，移除
        var playerOut = playerMgr.Instance().getPlayer(msg.useridout);
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
        var playerIn = playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.peng(msg.pengcardList, viewIdx);
        }

        if(!cc.replay_gamedata_scrolling){
            playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('scmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-碰牌');
        }

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_xzmj_ack_game_act_gang: function( msg ) {
        if (!this.headerHandle(msg)) return;

        // if(DeskData.Instance().isInMaJiang()){
        //     cc.gateNet.Instance().dispatchTimeOut(2);
        // }

        var playerOut = playerMgr.Instance().getPlayer(msg.useridout);
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
        var playerIn = playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.gang(msg, true, viewIdx);
        }

        if(!cc.replay_gamedata_scrolling){
            playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('scmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-杠牌');
        }

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_xzmj_ack_game_act_bugang: function( msg ) {
        if (!this.headerHandle(msg)) return;

        // if(DeskData.Instance().isInMaJiang()){
        //     cc.gateNet.Instance().dispatchTimeOut(2);
        // }

        //玩家补杠
        var playerIn = playerMgr.Instance().getPlayer(msg.userid);
        if (playerIn) {
            playerIn.bugang(msg);
        }
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_xzmj_ack_game_act_guo: function( msg ) {
        if (!this.headerHandle(msg)) return;
        UserPlayer.guo();
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);

        // var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
        // player_down_ui.setShoupaiTingbiaoji(false);
    },

    on_xzmj_ack_reconnect: function( msg ) {
        DeskData.Instance().pauseGameOut = false;
        DeskData.Instance().waitDingQue = false;
        DeskData.Instance().waitForSendOutCard = false;

        if (!this.headerHandle(msg)) return;
        this.waitForShaizi = false;

        if(this.huan3zhangTips){
            clearTimeout(this.huan3zhangTips);
            this.huan3zhangTips = null;
        }

        if(playerMgr.Instance().playing_shaizi){
            playerMgr.Instance().playing_shaizi = false;
            DeskED.notifyEvent(DeskEvent.STOP_SCJ_SHAIZI);
        }

        if(playerMgr.Instance().playing_fapai_ani){
            this.stopFaPaiAni();
        }

        var huan_menu_list = cc.find("Canvas/scmj_huan3zhang");
        if (huan_menu_list) {
            huan_menu_list.getComponent("scmj_huan3zhang").huan3ZhangHide();
        }
        var menu_list = cc.find("Canvas/scmj_dingqueBtn");
        if (menu_list) {
            menu_list.getComponent("scmj_dingqueBtn").setActive(false);
        }
        DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [-1, false]);

        cc.dd.mj_game_start = true;
        this.realCardID = {};
        for( var i = 0; i < msg.playerinfoList.length; ++i ) {
            var id = msg.playerinfoList[i].userid;
            if(msg.playerinfoList[i].playercard.outcardList.length > 0){
                this.realCardID[id] = msg.playerinfoList[i].playercard.outcardList[msg.playerinfoList[i].playercard.outcardList.length - 1];
            }
        }
        this.waitTime = 0;
        DeskData.Instance().jiesuanData = null;
        DeskData.Instance().isGameStart = true;
        DeskData.Instance().clear();
        playerMgr.Instance().clear();

        //关闭一次解散房间界面
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIESAN);
        //处理一局完成后 如果玩家已经准备

        //设置恢复数据
        RoomMgr.Instance()._Rule = msg.deskrules.createcfg;
        RoomMgr.Instance()._Rule.issanfang = RoomMgr.Instance()._Rule.reservedList[0] === 'true';
        RoomMgr.Instance()._Rule.isdiangangzimo = RoomMgr.Instance()._Rule.reservedList[1] === 'true';
        RoomMgr.Instance()._Rule.hujiaozhuanyizhuangen = RoomMgr.Instance()._Rule.reservedList[2] === 'true';
        RoomMgr.Instance()._Rule.duiduihu3fan = RoomMgr.Instance()._Rule.reservedList[3] === 'true';
        RoomMgr.Instance()._Rule.huan4zhang = RoomMgr.Instance()._Rule.reservedList[4] === 'true';
        RoomMgr.Instance()._Rule.jiaxinwu = RoomMgr.Instance()._Rule.reservedList[5] === 'true';
        RoomMgr.Instance()._Rule.yitiaolong = RoomMgr.Instance()._Rule.reservedList[6] === 'true';
        RoomMgr.Instance().setGameCommonInfo(msg.deskrules.desktype,msg.deskrules.passwrod,msg.deskrules.owner);

        this.comData(msg);

        if(msg.deskrules.desktype != cc.dd.Define.GameType.XZMJ_FRIEND && msg.deskrules.desktype != cc.dd.Define.GameType.XLMJ_FRIEND){   //金币场
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
        cc.log("-------ccpyc 断线重连------");

        let func = ()=>{
            playerMgr.Instance().setPlayerList(msg.playerinfoList);
            UserPlayer.paixu();
            UserPlayer.isTempBaoTing = false;
            UserPlayer.isTempBaoGu = false; //清除临时报听状态
            if(msg.jiaoinfosList.length){
                UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
            }

            if(DeskData.Instance().isFriend()){
                cc.find('Canvas/desk_info').getComponent('scmj_desk_info').cleanJieSuan()
            }else if(DeskData.Instance().isJBC() || DeskData.Instance().isMatch()){
                cc.find('Canvas/desk_info').getComponent('scmj_desk_info_jbc').cleanJieSuan()
            }

            //发出事件 如果在房间内则直接刷新  如果在大厅 则先进入房间内在刷新
            DeskED.notifyEvent(DeskEvent.RECOVER_DESK, msg.deskrules.desktype);

            //关闭一次gps
            //var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
            //play_list.closeGPSWarn();

            let reconnect_hu = {};
            for(let i = 0; i < msg.playerinfoList.length; i++){
                let playerMsg = msg.playerinfoList[i];

                for(let k = 0; k < playerMsg.playercard.hucardList.length; k++){
                    let huCard = playerMsg.playercard.hucardList[k];
                    if(reconnect_hu.hasOwnProperty(huCard.id)){
                        reconnect_hu[huCard.id]++;
                    }else {
                        reconnect_hu[huCard.id] = 1;
                    }
                }
            }

            for(let k in reconnect_hu){
                if(reconnect_hu.hasOwnProperty(k)){
                    if(reconnect_hu[k] == 2){
                        DeskED.notifyEvent(DeskEvent.HU, [[-1]]);
                    }else if(reconnect_hu[k] == 3){
                        DeskED.notifyEvent(DeskEvent.HU, [[-2]]);
                    }
                }
            }

            //排序手牌
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
            player_down_ui.updateShouPai(UserPlayer);

            //游戏开始后关闭GPS
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                var pl = play_list.getComponent('scmj_player_list');
                pl.refreshGPSWarn();
            }
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
            msg.deskgameinfo.banker = 0;

            if(RoomMgr.Instance()._Rule){
                if(RoomMgr.Instance()._Rule.usercountlimit == 4){
                    msg.deskgameinfo.remaincards = 108;
                }else{
                    msg.deskgameinfo.remaincards = RoomMgr.Instance()._Rule.issanfang ? 108 : 71;
                }
            }else{
                msg.deskgameinfo.remaincards = 108;
            }
        }
    },

    on_xzmj_ack_remain_majiang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        GmPaiKu.setPaiKu(msg.cardsList);
        cc.resources.load('gameyj_mj_tools/jlmj_gm_huanpai', cc.Prefab, function (err, prefab) {
            var huanpai = cc.instantiate(prefab);
            huanpai.parent = cc.find('Canvas');
        }.bind(this));
    },

    on_xzmj_ack_change_majiang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        GmPaiKu.changePai(msg);
    },

    /**
     * 胡牌 消息
     * @param msg
     */
    on_xzmj_game_ack_act_hu: function( msg ) {
        if ( !this.headerHandle( msg ) ) {
            cc.log('胡牌点击未完成--0 headerHandle == fasle');
            return;
        };
        cc.dd.NetWaitUtil.net_wait_end();

        // if(DeskData.Instance().isInMaJiang()){
        //     cc.gateNet.Instance().dispatchTimeOut(2);
        // }

        DeskData.Instance().isHu = true;
        // if(cc.dd._.isNull(DeskData.Instance().isPlayHuAni) || cc.dd._.isUndefined(DeskData.Instance().isPlayHuAni)){
        //     DeskData.Instance().isPlayHuAni = 0;
        // }
        // DeskData.Instance().isPlayHuAni++;
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
            count: 0
        };

        playerMgr.Instance().playing_special_hu = 0;


        if(this.huCardIdList.id == msg.hucardid){
            this.huCardIdList.count++;
            if(this.huCardIdList.count == 2){
                huType.push(-1);
                playerMgr.Instance().playing_special_hu += 2000;
            }else if(this.huCardIdList.count == 3){
                huType.push(-2);
                playerMgr.Instance().playing_special_hu += 2000;
            }
            // DeskED.notifyEvent(DeskEvent.YI_PAO_DUO_XIANG, [this.huCardIdList.count]);
        }else{
            this.huCardIdList.id = msg.hucardid;
            this.huCardIdList.count = 1;
        }

        // 摊开其他玩家手牌
        msg.holdcardinfoList.forEach(function (value, key) {
            if(value.userid == msg.huplayerid){
                var player = playerMgr.Instance().getPlayer(value.userid);
                if(player.shoupai.length > value.holdcardList.length){
                    player.delShouPai([msg.hucardid],1);
                }else if(player.shoupai.length < value.holdcardList.length){

                }
            }
            // if(player.userId == huPlayerObject.userId){
            //     // player.kaipai(value.holdcardList, value.mopai, msg.hucardid, duibao);   //胡家 开牌的数据完整
            //     player.setHuInfo(value.holdcardList, value.mopai, msg.hucardid);
            // }else{
            //     // player.kaipai(value.holdcardList, value.mopai);
            //     player.setHuInfo(value.holdcardList, value.mopai);
            // }
        });

        setTimeout(()=>{
            let jiesuan_ui = cc.dd.UIMgr.getUI(jlmj_prefab.SCMJ_JIESUAN);
            if(msg.huplayerid == cc.dd.user.id && (!jiesuan_ui || !jiesuan_ui.active) && !RoomMgr.Instance()._Rule.isxueliu && !DeskData.Instance().isFriend()){

                DeskData.Instance().canLeave = true;
                let btn = cc.find('Canvas/desk_node/jixuBtn');
                if(btn){
                    btn.active = true;
                }
            }
        }, 3000)


        huPlayerObject.hu(msg.hucardid, msg.hutypeList, isZiMo, msg.huorder);    //播放胡家的胡特效


        for(let i = 0; i < msg.hutypeList.length; i++){
            // if(msg.hutypeList[i] == HuType.QI_DUI || msg.hutypeList[i] == HuType.HAO_QI || msg.hutypeList[i] == HuType.DANDIAO_PIAOHU || msg.hutypeList[i] == HuType.HAIDI_PAO || msg.hutypeList[i] == HuType.GANG_PAO_HU || msg.hutypeList[i] == HuType.GANG_HUA_HU || msg.hutypeList[i] == HuType.HAIDI_LAO){
            //     if(msg.hutypeList[i] == HuType.QI_DUI && msg.hutypeList.indexOf(HuType.QING_YI_SE) != -1){
            //         huType.push(-4);
            //     }else if(msg.hutypeList[i] == HuType.HAO_QI && msg.hutypeList.indexOf(HuType.QING_YI_SE) != -1){
            //         huType.push(-3);
            //     }else{
            //         huType.push(msg.hutypeList[i]);
            //     }
            //     playerMgr.Instance().playing_special_hu += 2000;
            // }
            if(msg.hutypeList[i] == HuType.HAIDI_PAO || msg.hutypeList[i] == HuType.GANG_PAO_HU || msg.hutypeList[i] == HuType.GANG_HUA_HU || msg.hutypeList[i] == HuType.HAIDI_LAO){
                huType.push(msg.hutypeList[i]);
                playerMgr.Instance().playing_special_hu += 2000;
            }
        }

        DeskED.notifyEvent(DeskEvent.HU, [huType]);

        cc.log('【按键】胡牌点击完成 发送关闭按键消息');
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, [msg.huplayerid]);

        if(!cc.replay_gamedata_scrolling){
            playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('scmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-胡牌');
        }

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
    },

    /**
     * 小结算 消息
     * @param msg
     */
    on_xzmj_ack_send_current_result: function( msg ) {
        cc.log('【数据】普通结算消息接收 开始');
        if ( !this.headerHandle( msg ) ) return;
        let laseJiesuan = cc.find("Canvas/toppanel/last_jie_suan");
        if(laseJiesuan){
            laseJiesuan.active = false;
        }

        DeskData.Instance().setIsStart( false );
        DeskData.Instance().unlockScene();

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);

        this.huCardIdList = null;

        DeskData.Instance().canLeave = false;

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);//关闭menu

        msg.jiesuanBanker = DeskData.Instance().banker;

        let isLiuju = 0;

        let checkJiaoList = [];
        let huazhuWin = 0;

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

        // var play_list = cc.find('Canvas/player_list');
        // if(play_list){
        //     play_list.getComponent('scmj_player_list').playerStopChuPaiAni();
        // }
        // cc.log('停止出牌动画-胡牌');


        var play_list = cc.find('Canvas/player_list').getComponent('scmj_player_list');
        //显示其他玩家的暗杠
        for(let i = 0; i < msg.playercoininfoList.length; i++){
            let item = msg.playercoininfoList[i];
            if(item && item.userid){

                if(msg.playercoininfoList[i].huinfoList.length > 0){
                    isLiuju++;
                }

                if(item.chajiaoinfoList.length > 0 || item.hasOwnProperty("huazhuinfo")){
                    checkJiaoList.push({
                        userId: item.userid,
                        chajiaoinfoList: item.chajiaoinfoList,
                        huazhuinfo: item.hasOwnProperty("huazhuinfo") ? item.huazhuinfo : null,
                    });
                }

                if(item.hasOwnProperty("huazhuinfo")){
                    huazhuWin++;
                }

                var other_player = playerMgr.Instance().getPlayer(item.userid);
                if(other_player){
                    let paiList = [];
                    let mopaiList = null;
                    let huid = null;
                    for(let j = 0; j < item.pailistList.length; j++){
                        if(item.pailistList[j].cardtype == 4){
                            mopaiList = {id: item.pailistList[j].cardinfo.cardindexList[0]}
                        }else if(item.pailistList[j].cardtype == 5){
                            huid = item.pailistList[j].cardinfo.cardindexList[0]
                        }else if(item.pailistList[j].cardtype == 3){
                            for(let k = 0; k < item.pailistList[j].cardinfo.cardindexList.length; k++){
                                paiList.push({id: item.pailistList[j].cardinfo.cardindexList[k]})
                            }
                        }
                    }

                    if(cc.dd._.isNull(huid) || RoomMgr.Instance()._Rule.isxueliu){
                        other_player.kaipai(paiList, mopaiList);
                    }else{
                        other_player.kaipai(paiList, mopaiList, huid);
                    }

                    if(item.userid != cc.dd.user.id){
                        other_player.openAnGang(item.pailistList);
                    }
                    // other_player.isBaoting = item.isting;
                    // play_list.player_ui_arr[other_player.viewIdx].head.setTing(item.isting);
                }
            }
        }

        this.waitTime = 500 + playerMgr.Instance().playing_special_hu;

        if(DeskData.Instance().remainCards == 0 && isLiuju < 3 && !RoomMgr.Instance()._Rule.isxueliu){
            setTimeout(()=>{
                DeskED.notifyEvent(DeskEvent.HUANG_ZHUANG_ANI,[]);
            }, this.waitTime);
            this.waitTime += 1000;
        }
        if(checkJiaoList.length > 0){
            setTimeout(()=>{
                playerMgr.Instance().checkHuaZhuAndWuJiao(checkJiaoList, huazhuWin);
            }, this.waitTime);
            this.waitTime += 2000;
        }

        DeskData.Instance().notBackToLobby = msg.isend;

        setTimeout(()=>{
            let btn = cc.find('Canvas/desk_node/jixuBtn');
            if(btn){
                btn.active = false;
            }
            DeskData.Instance().canLeave = false;
            play_list.playerUpdateShouPaiUI();

            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
            player_down_ui.setShoupaiTingbiaoji(false);

            DeskData.Instance().jiesuan( msg );
        }, this.waitTime);

        DeskED.notifyEvent(DeskEvent.OPEN_BAO_PAI,[]);
        DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        cc.log('【数据】普通结算消息接收 完成 ');
    },

    on_xzmj_ack_operator: function( msg ) {
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

    on_xzmj_ack_reloading_ok: function( msg ) {
        if (!this.headerHandle(msg)) return;

        DeskData.Instance().unlockScene();
    },

    on_xzmj_ack_ready: function( msg ) {
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
                    cc.find('Canvas/desk_info').getComponent('scmj_desk_info').cleanJieSuan();
                    cc.find('Canvas/desk_info').getComponent('scmj_desk_info').setLastJieSuanActive();
                }else if(DeskData.Instance().isJBC() || DeskData.Instance().isMatch()){
                    cc.find('Canvas/desk_info').getComponent('scmj_desk_info_jbc').cleanJieSuan()
                }
            }
        }
    },

    on_xzmj_ack_sponsor_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().sponsorDissolveRoom(msg);
    },

    on_xzmj_ack_response_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().responseDissolveRoom(msg);
    },

    on_xzmj_ack_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        if (cc.director.getScene().name != 'scmj_py_game') {
            return;
        }
        DeskData.Instance().dissolveRoom(msg);
    },

    on_xzmj_ack_exit_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().exitRoom(msg);
    },

    on_xzmj_ack_finally_result: function( msg ) {
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

    on_xzmj_ack_fen_zhang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        cc.log('【数据】分张消息接收');
        DeskData.Instance().fenzhang();
    },

    on_xzmj_ack_rob_remove_card: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var player = playerMgr.Instance().getPlayer(msg.userid);
        player.removeRobCard_new(msg.cardid, msg.robtype);
    },

    on_xzmj_game_ack_act_huangzhuangpais: function( msg ) {
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

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////新的或者没用的接口/////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    on_xzmj_ack_enterDesk:function(msg){
        if (!this.headerHandle(msg)) return;
        //TODO
    },

    on_xzmj_ack_leave_status:function(msg){
        if (!this.headerHandle(msg)) return;
        //TODO
    },
//玩家进入
    on_xzmj_ack_playerEnter:function(msg){
        if (!this.headerHandle(msg)) return;
        //TODO
    },
//开始
    on_xzmj_ack_opening:function(msg){
        if (!this.headerHandle(msg)) return;
        //TODO
    },
//更新玩家状态
    on_xzmj_ack_update_user_status:function(msg){
        if (!this.headerHandle(msg)) return;
        //TODO
    },

    on_xzmj_ack_send_player_handinfo:function(msg){
        if (!this.headerHandle(msg)) return;
        //TODO
    },
//临时添加,方便吉林麻将开发
    on_xzmj_ack_user_info:function(msg){
        if (!this.headerHandle(msg)) return;
        //TODO
    },
//慌庄摊牌,玩家的牌列表
    on_xzmj_game_ack_act_huangzhuangpais:function(msg){
        if (!this.headerHandle(msg)) return;
        //TODO
    },
//逛锅模式未听牌玩家总分为0时不能点炮
    on_xzmj_ack_dont_win_zero:function(msg){
        if (!this.headerHandle(msg)) return;
        //TODO
    },
//请求进入比赛服桌子回执
    on_xzmj_ack_enter_match:function(msg){
        if (!this.headerHandle(msg)) return;
        //TODO
    },
//扔骰子
    on_xzmj_ack_shaizi:function(msg){
        if (!this.headerHandle(msg)) return;
        this.waitForShaizi = false;

        if(DeskData.Instance().isInMaJiang()){
            cc.gateNet.Instance().dispatchTimeOut(4);
        }


        DeskED.notifyEvent(DeskEvent.SCJ_SHAIZI, msg.pointList);
        playerMgr.Instance().playing_shaizi = true;

        var menu_list = cc.find("Canvas/scmj_huan3zhang");
        if (menu_list) {
            menu_list.getComponent("scmj_huan3zhang").setOrder(msg.pointList);
        }
    },
//换三张
    on_xzmj_ack_huan3zhang:function(msg){
        if (!this.headerHandle(msg)) return;
        if(this.waitForShaizi){
            this.waitForShaizi = false;
            this.stopFaPaiAni();
        }

        if(this.huan3zhangTips){
            clearTimeout(this.huan3zhangTips);
            this.huan3zhangTips = null;
        }

        DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [-1, false]);

        var menu_list = cc.find("Canvas/scmj_huan3zhang");
        if (menu_list) {
            menu_list.getComponent("scmj_huan3zhang").huan3ZhangOpenOrder();
            menu_list.getComponent("scmj_huan3zhang").huan3zhangAni();
        }

        for(let i = 0; i < msg.playerinfoList.length; i++){
            let info = msg.playerinfoList[i];
            let player = playerMgr.Instance().getPlayer(info.userid);
            if(player){
                player.cleardapaiCding();
                // player.setDefaultHuan3Zhang(info.choosepaisList);
                // player.setHuan3Zhang(info.choosepaisList);
                player.moveHuanPai(info.choosepaisList);
                setTimeout(()=>{
                    player.huanPai(info.choosepaisList, info.huanpaisList);
                }, 500)
            }
        }
    },
//定缺
    on_xzmj_ack_dingque:function(msg){
        if (!this.headerHandle(msg)) return;

        if(this.waitForShaizi){
            this.waitForShaizi = false;
            this.stopFaPaiAni();
        }
        DeskData.Instance().waitDingQue = false;

        for(let i = 0; i < msg.useridList.length; i++){
            if(UserPlayer.userId == msg.useridList[i]){
                var menu_list = cc.find("Canvas/scmj_dingqueBtn");
                if (menu_list) {
                    menu_list.getComponent("scmj_dingqueBtn").setActive(false);
                }
                DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [-1, false]);
            }

            var player = playerMgr.Instance().getPlayer(msg.useridList[i]);
            if(player){
                player.setDingQue(msg.typeList[i]);
                if(msg.useridList[i] == cc.dd.user.id) {
                    player.paixu();
                }
            }
        }
        DeskData.Instance().waitForSendOutCard = false;

        let play_list = cc.find('Canvas/player_list').getComponent('scmj_player_list');
        play_list.playerUpdateShouPaiUI();

        playerMgr.Instance().playerMoPaiAction();
    },
//换三张提示
    on_xzmj_ack_huan3zhang_tips:function(msg){
        if (!this.headerHandle(msg)) return;

        DeskData.Instance().noCDAudio = true;
        cc.log("on_xzmj_ack_huan3zhang_tips ");
        let func = ()=>{
            this.huan3zhangTips = null;

            if(playerMgr.Instance().playing_fapai_ani){
                this.waitForShaizi = false;
                this.stopFaPaiAni()
            }


            if(this.waitForShaizi){
                this.waitForShaizi = false;
                this.stopFaPaiAni();
            }

            cc.log("huan3zhang_tips");

            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui");
            if(player_down_ui){
                player_down_ui.getComponent('scmj_player_down_ui').huan3Zhang(msg.paitipsList);
            }

            UserPlayer.setDefaultHuan3Zhang(msg.paitipsList);
            UserPlayer.setHuan3Zhang(msg.paitipsList);

            var menu_list = cc.find("Canvas/scmj_huan3zhang");
            if (menu_list) {
                menu_list.getComponent("scmj_huan3zhang").huan3ZhangShow();
            }

            var player = playerMgr.Instance().getPlayer(UserPlayer.userId);
            if (player) {
                var userlist = playerMgr.Instance().playerList;
                for (var i = 0; userlist && i < userlist.length; ++i) {
                    if(userlist[i]){
                        userlist[i].cleardapaiCding();
                        userlist[i].setTips('huan3zhang');
                    }
                }
                player.dapaiCding({time:8});
            }
        };

        if(playerMgr.Instance().playing_fapai_ani){
            //等待发牌动画
            this.huan3zhangTips = setTimeout(func, 1800);
        }else{
            func();
        }
        cc.log("huan3zhangTips ", this.huan3zhangTips);

        cc.dd.NetWaitUtil.net_wait_end();
    },
//定缺提示
    on_xzmj_ack_dingque_tips:function(msg){
        if (!this.headerHandle(msg)) return;

        DeskData.Instance().noCDAudio = true;
        DeskData.Instance().waitDingQue = true;

        let func = ()=>{

            if(this.waitForShaizi){
                this.waitForShaizi = false;
                this.stopFaPaiAni();
            }

            var menu_list = cc.find("Canvas/scmj_dingqueBtn");
            if (menu_list) {
                menu_list.getComponent("scmj_dingqueBtn").setActive(true, msg);
            }

            var huan_menu_list = cc.find("Canvas/scmj_huan3zhang");
            if (huan_menu_list) {
                huan_menu_list.getComponent("scmj_huan3zhang").huan3ZhangHide();
            }

            var player = playerMgr.Instance().getPlayer(UserPlayer.userId);
            if (player) {
                var userlist = playerMgr.Instance().playerList;
                for (var i = 0; userlist && i < userlist.length; ++i) {
                    if(userlist[i]){
                        userlist[i].cleardapaiCding();
                        userlist[i].setTips('dingque');
                    }
                }
                player.dapaiCding({time: 5});

            }
        }

        // if(RoomMgr.Instance()._Rule.ishuan3zhang) {
        //     //等待换三张动画
        //     setTimeout(func, 5500);
        // }else if(playerMgr.Instance().playing_fapai_ani){
        //     //等待发牌动画
        //     setTimeout(func, 1700);
        // }else{
            func();
        // }

        cc.dd.NetWaitUtil.net_wait_end();
    },

//获得金币
    on_xzmj_update_palyer_coin:function(msg){
        if (!this.headerHandle(msg)) return;

        // if(DeskData.Instance().isInMaJiang()){
        //     cc.gateNet.Instance().dispatchTimeOut(2);
        // }

        for(let i = 0; i < msg.useridList.length; i++){
            let player = playerMgr.Instance().getPlayer(msg.useridList[i]);
            if(player){
                player.changeCoin(msg.coinList[i]);
            }
        }
    },

//换三张状态更新
    on_xzmj_ack_player_huan3zhang:function(msg){
        if (!this.headerHandle(msg)) return;

        if(playerMgr.Instance().playing_fapai_ani){
            this.waitForShaizi = false;
            this.stopFaPaiAni()
        }


        if(this.waitForShaizi){
            this.waitForShaizi = false;
            this.stopFaPaiAni();
        }

        for(let i = 0; i < msg.useridList.length; i++){
            var player = playerMgr.Instance().getPlayer(msg.useridList[i]);
            if(player){
                player.setTips('waiting');
                // if(msg.useridList[i] != cc.dd.user.id){
                    player.moveHuanPai();
                var huan_menu_list = cc.find("Canvas/scmj_huan3zhang");
                if (huan_menu_list) {
                    huan_menu_list.getComponent("scmj_huan3zhang").moveHuanPai(player.viewIdx);
                }
                // }
            }
        }
    },

//定缺状态更新
    on_xzmj_ack_player_dingque:function(msg){
        if (!this.headerHandle(msg)) return;
        if(this.waitForShaizi){
            this.waitForShaizi = false;
            this.stopFaPaiAni();
        }

        for(let i = 0; i < msg.useridList.length; i++){
            var player = playerMgr.Instance().getPlayer(msg.useridList[i]);
            if(player){

                if(msg.useridList[i] == cc.dd.user.id){
                    var menu_list = cc.find("Canvas/scmj_dingqueBtn");
                    if (menu_list) {
                        menu_list.getComponent("scmj_dingqueBtn").setActive(false);
                    }
                }

                // if(RoomMgr.Instance()._Rule.ishuan3zhang) {
                //     setTimeout(()=>{
                //         player.setTips('waiting');
                //     }, 5500);
                // }else{
                    player.setTips('waiting');
                // }
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
            desk_node.getComponent('scmj_scene').jlmjPlayerDownSortShouPai();
        }
    }
});

module.exports = new xzmj_handler();