var dd = cc.dd;
var DeskED = require('jlmj_desk_data').DeskED;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskData = require('jlmj_desk_data').DeskData;
var UserPlayer = require("jlmj_userPlayer_data").Instance();
var GmPaiKu = require('jlmj_gm_paiku').GmPaiKu.Instance();
var playerMgr = require('jlmj_player_mgr');
var Hall = require('jlmj_halldata');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;

// const ClubUser = require('club_user_data');
// const ClubUserEd = ClubUser.ClubUserEd;
// const ClubUserEvent = ClubUser.ClubUserEvent;

const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_data = require('bsc_data').BSC_Data;
var Define = require( "Define" );

var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var game_room_cfg = require('game_room');
var HuType = require('jlmj_define').HuType;
var jlmj_prefab = require('jlmj_prefab_cfg');
var PlayerState = require("jlmj_player_data").PlayerState;
var s_net = null;

var handler = cc.Class({

    ctor: function() {
        cc.log( "jlmj_net_handler_jlmj 父类" );
    },

    /**
     * 判断header是否有效
     * @param msg
     */
    headerHandle: function( msg ) {
        if( cc.dd.Utils.isNull( msg ) ) {
            return false;
        }

        if ( cc.dd.Utils.isNull( msg.header ) ) {
            return true;
        }

        if (msg.header.code !== 0) {
            cc.error(msg.header.error + " code = " + msg.header.code);
            return false;
        }
        return true;
    },

    /**
     * 胡牌 消息
     * @param msg
     */
    on_p17_game_ack_act_hu: function( msg ) {
        if ( !this.headerHandle( msg ) ) {
            cc.log('胡牌点击未完成--0 headerHandle == fasle');
            return;
        };
        cc.dd.NetWaitUtil.net_wait_end();

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

        // 摊开其他玩家手牌
        msg.holdcardinfoList.forEach(function (value, key) {
            var player = playerMgr.Instance().getPlayer(value.userid);
            if(player.userId == huPlayerObject.userId){
                var duibao = false;
                msg.hutypeList.forEach(function (type) {
                    if(type == HuType.DUI_BAO){
                        duibao = true;
                    }
                });
                player.kaipai(value.holdcardList, value.mopai, msg.hucardid, duibao);   //胡家 开牌的数据完整
            }else{
                player.kaipai(value.holdcardList, value.mopai);
            }
        });

        huPlayerObject.hu(msg.hucardid, msg.hutypeList, isZiMo);    //播放胡家的胡特效

        let huType = [];
        playerMgr.Instance().playing_special_hu = 0;
        for(let i = 0; i < msg.hutypeList.length; i++){
            if(msg.hutypeList[i] == HuType.QI_DUI || msg.hutypeList[i] == HuType.GANG_HUA_HU){
                huType.push(msg.hutypeList[i]);
                playerMgr.Instance().playing_special_hu += 2000;
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
                play_list.getComponent('jlmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-胡牌');
        }
    },

    /**
     * 小结算 消息
     * @param msg
     */
    on_p17_ack_send_current_result: function( msg ) {
        cc.log('【数据】普通结算消息接收 开始');
        if ( !this.headerHandle( msg ) ) return;
        let laseJiesuan = cc.find("Canvas/toppanel/last_jie_suan");
        if(laseJiesuan){
            laseJiesuan.active = false;
        }

        DeskData.Instance().setIsStart( false );
        DeskData.Instance().unlockScene();

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
        var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
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

    /**
     * 开始游戏 消息
     */
    on_p17_ack_game_opening: function( msg ) {
        DeskData.Instance().setIsStart( true );
        DeskData.Instance().isGameStart = true;
        DeskData.Instance().setFirstMoPai( true );
        this.realCardID = {};

        if (!this.headerHandle(msg)) return;
        this.waitTime = 0;
        cc.dd.mj_game_start = true;

        DeskData.Instance().banker = msg.bankerid;
        playerMgr.Instance().setBanker(msg.bankerid);
        playerMgr.Instance().hidePlayerReady();
        DeskData.Instance().remainCards = 136;
        DeskData.Instance().setLianzhuang(msg.oldbankerid == msg.bankerid ? msg.bankerid : 0);//设置连庄
        DeskData.Instance().startGame();
        if (msg.currplaycount > DeskData.Instance().currPlayCount) {//正常玩时每圈显示一次， 断线重连每次显示
            DeskData.Instance().setCurrRound(msg.currplaycount);
        }

        if(DeskData.Instance().isFriend()){
            cc.find('Canvas/desk_info').getComponent('jlmj_desk_info').cleanJieSuan();
            cc.find('Canvas/desk_info').getComponent('jlmj_desk_info').setLastJieSuanActive();
        }else if(DeskData.Instance().isJBC() || DeskData.Instance().isMatch()){
            cc.find('Canvas/desk_info').getComponent('jlmj_jbc_desk_info').cleanJieSuan()
        }
    },

    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_p17_ack_roomInit: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.waitTime = 0;
        RoomMgr.Instance().setGameCommonInfo(msg.deskinfo.desktype,msg.deskinfo.passwrod,msg.deskinfo.owner);
        DeskData.Instance().setDeskRule(msg.deskinfo);
        playerMgr.Instance().playing_fapai_ani = true;
        playerMgr.Instance().setPlayerList(msg.playersList);

        //游戏开始后关闭GPS
        var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        play_list.closeGPSWarn();

        //暂时屏蔽发牌动画
        // playerMgr.Instance().playerList.forEach(function (player) {
        //     if(player){
        //         player.paixu();
        //     }
        // });
        // var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        // play_list.playerUpdateUI();
    },

    on_p17_ack_reconnect: function( msg ) {
        DeskData.Instance().waitForSendOutCard = false;

        if (!this.headerHandle(msg)) return;
        this.waitTime = 0;
        cc.dd.mj_game_start = true;

        this.realCardID = {};
        for( var i = 0; i < msg.playerinfoList.length; ++i ) {
            var id = msg.playerinfoList[i].userid;
            if(msg.playerinfoList[i].playercard.outcardList.length > 0){
                this.realCardID[id] = msg.playerinfoList[i].playercard.outcardList[msg.playerinfoList[i].playercard.outcardList.length - 1];
            }
        }
        DeskData.Instance().isGameStart = true;
        DeskData.Instance().clear();
        playerMgr.Instance().clear();

        //关闭一次解散房间界面
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_JIESAN);
        //处理一局完成后 如果玩家已经准备
        this.comData(msg);
        //设置恢复数据
        RoomMgr.Instance()._Rule = msg.deskrules.createcfg;
        if(!RoomMgr.Instance()._Rule.reservedList || RoomMgr.Instance()._Rule.reservedList.length == 0){
            switch(RoomMgr.Instance()._Rule.guangguotype){
                case 0:
                    RoomMgr.Instance()._Rule.fengding = 16;
                    break;
                case 1:
                case 3:
                    RoomMgr.Instance()._Rule.fengding = 32;
                    break;
                case 2:
                case 4:
                    RoomMgr.Instance()._Rule.fengding = 64;
                    break;
            }
        }else{
            RoomMgr.Instance()._Rule.fengding = parseInt(RoomMgr.Instance()._Rule.reservedList[0]);
        }

        RoomMgr.Instance().setGameCommonInfo(msg.deskrules.desktype,msg.deskrules.passwrod,msg.deskrules.owner);
        if(msg.deskrules.desktype != 20){   //金币场
            var room_cfg = game_room_cfg.getItem(function (item) {
                return item.key == msg.deskrules.configid;
            });
            RoomMgr.Instance().roomLv = room_cfg.roomid;
        }

        for( var i = 0; i < msg.playerinfoList.length; ++ i ) {
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
        cc.log("-------pyc 断线重连------");

        let func = ()=>{
            playerMgr.Instance().setPlayerList(msg.playerinfoList);
            UserPlayer.paixu();
            UserPlayer.isTempBaoTing = false;   //清除临时报听状态
            if(msg.jiaoinfosList.length){
                UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
            }

            if(DeskData.Instance().isFriend()){
                cc.find('Canvas/desk_info').getComponent('jlmj_desk_info').cleanJieSuan()
            }else if(DeskData.Instance().isJBC() || DeskData.Instance().isMatch()){
                cc.find('Canvas/desk_info').getComponent('jlmj_jbc_desk_info').cleanJieSuan()
            }

            //发出事件 如果在房间内则直接刷新  如果在大厅 则先进入房间内在刷新
            DeskED.notifyEvent(DeskEvent.RECOVER_DESK, msg.deskrules.desktype);

            //关闭一次gps
            //var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
            //play_list.closeGPSWarn();

            if(playerMgr.Instance().playing_fapai_ani){
                this.stopFaPaiAni();
            }

            //排序手牌
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('jlmj_player_down_ui');
            player_down_ui.updateShouPai(UserPlayer);

            //游戏开始后关闭GPS
            var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
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
     * 创建桌子 消息
     * @param msg
     */
    on_p17_ack_createDesk: function( msg ) {
        if (!this.headerHandle(msg)) {
            cc.dd.NetWaitUtil.smooth_close();
            cc.log("p17_ack_createDesk ", "手动断开socket连接");
            s_net.close();
            dd.DialogBoxUtil.show(1, msg.header.error || "", "确定");
        }
    },

    /**
     * 进入桌子 消息
     * @param msg
     */
    on_p17_ack_enterDesk: function( msg ) {
        cc.dd.NetWaitUtil.close();
        var errContent = "";
        switch (msg.header.code) {
            case -1:
                errContent = cc.dd.Text.TEXT_JOIN_13;
                break;
            case -2:
                errContent = cc.dd.Text.TEXT_JOIN_14;
                break;
            case -3:
                errContent = cc.dd.Text.TEXT_JOIN_15;
                break;
            case -4:
                errContent = cc.dd.Text.TEXT_JOIN_16;
                break;
            case -5:
                errContent = cc.dd.Text.TEXT_JOIN_18;
                break;
            default:
                errContent = cc.dd.Text.TEXT_JOIN_17;
                break;
        }
        cc.log("p16_ack_enterDesk ", "手动断开socket连接");
        s_net.close();

        //ClubUserEd.notifyEvent(ClubUserEvent.ENTER_GAME_FAILED);

        dd.DialogBoxUtil.show(1, errContent, "确定");
    },

    on_p17_ack_leave_status: function( msg ) {
        if (!this.headerHandle(msg)) return;
    },

    on_p17_ack_sponsor_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().sponsorDissolveRoom(msg);
    },

    on_p17_ack_response_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().responseDissolveRoom(msg);
    },

    on_p17_ack_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        if (cc.director.getScene().name != 'jlmj_game') {
            return;
        }
        DeskData.Instance().dissolveRoom(msg);
    },

    on_p17_ack_exit_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().exitRoom(msg);
    },

    on_p17_ack_playerEnter: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.playerEnter( msg );
    },

    playerEnter: function( msg ) {
        playerMgr.Instance().playerEnter(msg.player);
        playerMgr.Instance().requesYuYinUserData();
    },

    on_p17_ack_ready: function( msg ) {
        if (!this.headerHandle(msg)) return;
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
                    cc.find('Canvas/desk_info').getComponent('jlmj_desk_info').cleanJieSuan()
                }else if(DeskData.Instance().isJBC() || DeskData.Instance().isMatch()){
                    cc.find('Canvas/desk_info').getComponent('jlmj_jbc_desk_info').cleanJieSuan()
                }
            }
        }
    },

    on_p17_ack_opening: function( msg ) {

    },

    on_p17_ack_game_overturn: function( msg ) {
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

                // if(playerMgr.Instance().playing_shou2mid_ani){ //上家正在打牌动画,
                //     cc.log('上家打牌动画中,记录下家已摸牌');
                //     // playerMgr.Instance().normal_mopaiing = true;
                //     var id = playerMgr.Instance().shou2mid_id_list.pop();
                //     playerMgr.Instance().mid2dapai_id_list.push(id);
                // }else{  //上家出牌动画结束,则播放入牌海动画
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

        }else if(msg.acttype == 4){ //看宝操作

        }
        else if (msg.acttype == 5) { //杠牌或者补杠引起的摸牌
            if (player) {
                player.mopai(msg);
                var isNomalMo = msg.acttype == 1; //1是正常摸牌 5是杠牌摸牌
                DeskED.notifyEvent(DeskEvent.MO_PAI_ACT, [1, msg.paicount, isNomalMo, 0, 0]);
            }
            DeskData.Instance().setisFenzhangMopai();
            DeskData.Instance().setRemainCard(msg.paicount);
        }else if (msg.acttype == 6) {  //每局第一手打牌
            if (player) {
                DeskData.Instance().setRemainCard(msg.paicount);//安全起见 没有放到外面处理
                DeskED.notifyEvent(DeskEvent.MO_PAI_ACT, [1, msg.paicount, true, 0, 0]);
            }
        }
        if(msg.cannottingtipsList && msg.cannottingtipsList.length && msg.userid == cc.dd.user.id){
            DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [1,true]);
        }else if(msg.userid == cc.dd.user.id){
            DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [-1,false]);
        }
        //用户玩家可操作选项
        UserPlayer.setCpgth(msg);

        if (player && player.isUserPlayer()) {
            if (!cc.dd.AppCfg.IS_DEBUG) {
                //设置是否自动出牌
                player.setAutoChuPai(msg);
            }
        }


        //玩家没有摸牌,直接提示操作菜单
        var menu_list = cc.find("Canvas/game_menu_list");
        if(!UserPlayer.hasMoPai()){
            //吃,碰,点杠
            if(menu_list){
                menu_list.getComponent("jlmj_game_menu_list").setMenus(UserPlayer);
            }
        }else if(msg.acttype == 1 && (msg.cangang || msg.canbugang || msg.canhu || msg.canting)){
            if (menu_list && player && player.userId == cc.dd.user.id) {
                menu_list.getComponent("jlmj_game_menu_list").setMenus(UserPlayer);
            }
        }else{
            if(msg.acttype != 1){
                if(player&&player.userId == cc.dd.user.id){
                    if(menu_list){
                        menu_list.getComponent("jlmj_game_menu_list").setMenus(UserPlayer);
                    }
                }
            }

            if( msg.acttype == 1 && msg.actcard && cc.dd._.isUndefined(msg.actcard.id) ){  //修复,补杠断线重连不显示杠
                if(player&&player.userId == cc.dd.user.id){
                    if(menu_list){
                        menu_list.getComponent("jlmj_game_menu_list").setMenus(UserPlayer);
                    }
                }
            }
        }

    },

    on_p17_ack_game_deal_cards: function( msg ) {
        UserPlayer.waitTing = false;

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
            var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
            play_list.playerUpdateShouPaiUI();
        }
        if(showFapai){
            DeskED.notifyEvent(DeskEvent.FAPAI);
        }

        //暂时屏蔽发牌动画
        // playerMgr.Instance().playerList.forEach(function (player) {
        //     if(player){
        //         player.paixu();
        //     }
        // });
        // var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        // play_list.playerUpdateUI();

    },

    on_p17_ack_game_send_out_card: function( msg ) {
        DeskData.Instance().waitForSendOutCard = false;

        if (!this.headerHandle(msg)) {
            DeskData.Instance().sendCard = null;

            if(msg.userid == cc.dd.user.id && msg.card && this.realCardID && msg.card.id != this.realCardID[msg.userid]){
                let player = playerMgr.Instance().getPlayer(msg.userid);
                if(player.shoupai.indexOf(msg.card.id) == -1) {
                    var pai3d_value = require('jlmj_pai3d_value');
                    cc.log("手牌检查"+pai3d_value.descs(player.shoupai));

                    var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('jlmj_player_down_ui');
                    player_down_ui.stopChuPai();

                    player.addShouPai([msg.card.id]);
                    player.paixu();
                    let idx = player.chupai.indexOf(msg.card.id);
                    if(idx != -1){
                        player.chupai.splice(idx, 1);
                    }

                    player_down_ui.removeChupai(player);
                    player_down_ui.updateShouPai();

                    cc.log("手牌检查后"+pai3d_value.descs(player.shoupai));

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
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('jlmj_player_down_ui');
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
        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('jlmj_player_down_ui');
        player_down_ui.setShoupaiTingbiaoji(false);
        DeskED.notifyEvent(DeskEvent.STOP_TIMEUP,[]);
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_p17_ack_chi: function( msg ) {
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
                play_list.getComponent('jlmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-吃牌');
        }

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_p17_ack_game_act_peng: function( msg ) {
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
                play_list.getComponent('jlmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-碰牌');
        }

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_p17_ack_game_act_gang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        var playerOut = playerMgr.Instance().getPlayer(msg.useridout);
        if (msg.isrob) {
            playerOut.beiQiangGang();
        } else {
            if (msg.gangtype == 1 || msg.gangtype == 8 || msg.gangtype == 10 || msg.gangtype == 12 || msg.gangtype == 14) {
                //点杠 被杠的牌，移除
                playerOut.beigang();
            }
        }

        //玩家杠
        var playerIn = playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.gang(msg);
        }
        if(msg.useridin == cc.dd.user.id){
            UserPlayer.modepai = null;
        }
        if(!cc.replay_gamedata_scrolling){
            playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('jlmj_player_list').playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-杠牌');
        }

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_p17_ack_game_act_bugang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //玩家补杠
        var playerIn = playerMgr.Instance().getPlayer(msg.userid);
        if (playerIn) {
            playerIn.bugang(msg);
        }
        if(msg.userid == cc.dd.user.id){
            UserPlayer.modepai = null;
        }
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        if(!DeskData.Instance().dabaoing){
            DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
        }
        UserPlayer.clearJiaoPaiMsg();
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_p17_ack_game_act_guo: function( msg ) {
        if (!this.headerHandle(msg)) return;
        UserPlayer.guo();
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
    },

    on_p17_ack_game_ting: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //听牌
        var player = playerMgr.Instance().getPlayer(msg.userid);
        player.ting();
        // playerMgr.Instance().chupai_timeout_on_ting = true;
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);

        cc.gateNet.Instance().dispatchTimeOut(0.3);
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_p17_ack_game_dabao: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().dabao(msg);
        DeskED.notifyEvent(DeskEvent.MO_HUAN_BAO_PAI, [msg.baopaiindex, null]);
        //cc.gateNet.Instance().dispatchTimeOut(2);
    },

    on_p17_ack_game_changbao: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().changebao(msg);
        DeskED.notifyEvent(DeskEvent.MO_HUAN_BAO_PAI, [msg.newbaopaiindex, true]);
    },

    on_p17_ack_remain_majiang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        GmPaiKu.setPaiKu(msg.cardsList);
        cc.resources.load('gameyj_mj_tools/jlmj_gm_huanpai', cc.Prefab, function (err, prefab) {
            var huanpai = cc.instantiate(prefab);
            huanpai.parent = cc.find('Canvas');
        }.bind(this));
    },

    on_p17_ack_change_majiang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        GmPaiKu.changePai(msg);
    },

    on_p17_ask_show_tingpai_tips: function( msg ) {
        // if(!this.headerHandle(msg)) return;
        // UserPlayer.setCanTing(msg);
    },

    on_p17_ack_rob_remove_card: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var player = playerMgr.Instance().getPlayer(msg.userid);
        player.removeRobCard_new(msg.cardid, msg.robtype);
    },

    on_p17_ack_update_user_status: function( msg ) {
        if (!this.headerHandle(msg)) return;
        var player = playerMgr.Instance().getPlayer(msg.userid);
        var isoffline = msg.status == Define.UserStatus.USER_OFF_LINE;
        player.setOnLine(!isoffline);
        playerMgr.Instance().requesYuYinUserData();
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
            msg.deskgameinfo.remaincards = 136;
            msg.deskgameinfo.banker = 0;
        }
    },

    on_p17_ack_send_player_handinfo: function( msg ) {
        if (!this.headerHandle(msg)) return;

        // var userplayer = playerMgr.Instance().getPlayer( dd.user.id );
        // userplayer.diffHoldCard( msg );
    },

    on_p17_ack_reloading_ok: function( msg ) {
        if (!this.headerHandle(msg)) return;

        DeskData.Instance().unlockScene();
    },

    on_p17_ack_finally_result: function( msg ) {
        cc.log('【数据】战绩消息接收 开始');
        if (!this.headerHandle(msg)) return;
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_JIESAN);
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

    on_p17_ack_fen_zhang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        cc.log('【数据】分张消息接收');
        DeskData.Instance().fenzhang();
    },

    on_p17_ack_user_info: function( msg ) {
        if (this.headerHandle(msg)) {
            Hall.HallED.notifyEvent(Hall.HallEvent.LOGING_USER, msg);
        }
    },

    on_p17_game_ack_act_huangzhuangpais: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var playerHoldList = msg.holdcardinfoList;
        for (var i = 0; i < playerHoldList.length; ++i) {
            var playerObject = playerMgr.Instance().getPlayer(playerHoldList[i].userid);
            playerObject.kaipai(playerHoldList[i].holdcardList, playerHoldList[i].mopai);
        }
    },

    on_p17_ack_operator: function( msg ) {
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

    on_p17_ack_dont_win_zero: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskED.notifyEvent(DeskEvent.NO_MARK_TIPS, []);
    },

    on_p17_ack_enter_match: function( msg ) {
        if (!this.headerHandle(msg)) return;
        Bsc_ED.notifyEvent(Bsc_Event.BSC_ENTER_SCENE, msg);
    },

    on_p17_ack_update_deposit: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var isoffline = msg.isdeposit;
        // var player = playerMgr.Instance().getPlayer( cc.dd.user.id );
        // player.setTG(!isoffline);
        DeskData.Instance().isoffline = isoffline;
        //发出事件
        DeskED.notifyEvent(DeskEvent.TUO_GUAN, isoffline);
    },

    on_p17_ack_update_coin: function( msg ) {

    },

    /**
     * 金币场 听牌后更新宝牌
     * @param msg
     */
    on_p17_ack_bao: function (msg) {
        DeskData.Instance().setBaoPai( msg.card );
        if(!cc.replay_gamedata_scrolling){
            cc.find("Canvas/desk_info").getComponent('jlmj_desk_info').updateBaoPai();
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
            desk_node.getComponent('jlmj_scene').jlmjPlayerDownSortShouPai();
        }
    }
});

module.exports = new handler();
