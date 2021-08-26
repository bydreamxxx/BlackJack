var dd = cc.dd;

var game_room_cfg = require('game_room');
var GmPaiKu = require('jlmj_gm_paiku').GmPaiKu.Instance();

var HuType = require('jlmj_define').HuType;

var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

const BSC_Event = require('bsc_data').BSC_Event;
const BSC_ED = require('bsc_data').BSC_ED;

// let mjComponentValue = null;
// let mjConfigValue = null;

const HANDLER_TYPE = {
    JBC: 0,
    FRIEND: 1,
    REPLAY: 2
}

let handler = cc.Class({

    properties:{
        handlerType: HANDLER_TYPE.FRIEND,
        mjComponentValue :null,
        mjConfigValue: null,
    },

    ctor: function () {
        this.mjComponentValue = this.initMJComponet();
        this.mjConfigValue = this.initMJConfig();

        let _deskData = require(this.mjComponentValue.deskData);

        this.require_DeskData = _deskData.DeskData;
        this.require_DeskED = _deskData.DeskED;
        this.require_DeskEvent = _deskData.DeskEvent;
        this.require_playerMgr = require(this.mjComponentValue.playerMgr);
        this.require_UserPlayer = require(this.mjComponentValue.userData).Instance();
        this.require_deskJBCData = require(this.mjComponentValue.deskJBCData);

        let _playerData = require(this.mjComponentValue.playerData);
        this.require_PlayerState = _playerData.PlayerState;
        this.require_playerED = _playerData.PlayerED;
        this.require_PlayerEvent = _playerData.PlayerEvent;

        this.require_jlmj_prefab = require(this.mjConfigValue.prefabCfg);
    },

    setHandlerTypeJBC(){
        this.handlerType = HANDLER_TYPE.JBC;
    },
    setHandlerTypeFriend(){
        this.handlerType = HANDLER_TYPE.FRIEND;
    },
    setHandlerTypeReplay(){
        this.handlerType = HANDLER_TYPE.REPLAY;
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
            msg.deskgameinfo.remaincards = this.require_DeskData.Instance().getMJRemainCard();
            msg.deskgameinfo.banker = 0;
        }
    },

    /**
     * 设置重连规则
     * @param rule
     */
    setReconnectRule(rule){
        RoomMgr.Instance()._Rule = rule;
    },

    setReconnectRuleCheck(data){
        if(data.createcfg){
            this.setReconnectRule(data.createcfg);
        }else{
            for(let k in data.rule){
                if(data.rule[k]){
                    this.setReconnectRule(data.rule[k]);
                    break;
                }
            }
        }
    },

    overturnAct1(msg, player){
        if (player) {
            player.mopai(msg);
            //是正常摸牌
            this.require_DeskED.notifyEvent(this.require_DeskEvent.MO_PAI_ACT, [1, msg.paicount, true, 0, 0]);

            // if (this.require_playerMgr.Instance().playing_shou2mid_ani) { //上家正在打牌动画,
            //     cc.log('上家打牌动画中,记录下家已摸牌');
            //     // this.require_playerMgr.Instance().normal_mopaiing = true;
            //     var id = this.require_playerMgr.Instance().shou2mid_id_list.pop();
            //     this.require_playerMgr.Instance().mid2dapai_id_list.push(id);
            // } else {  //上家出牌动画结束,则播放入牌海动画
            //     cc.log('上家打牌动画结束,播放入牌海动画');
            //     var id = this.require_playerMgr.Instance().shou2mid_id_list.pop();
            //     this.require_playerMgr.Instance().playerMid2DapaiAction(id);
            // }
            this.require_playerMgr.Instance().playerMoPaiAction();
        }
        this.require_DeskData.Instance().setisFenzhangMopai();
        this.require_DeskData.Instance().setRemainCard(msg.paicount);
    },

    overturnAct2(msg, player){

    },

    overturnAct3(msg, player){

    },

    overturnAct4(msg, player){

    },

    overturnAct5(msg, player){
        if (player) {
            player.mopai(msg);
            this.require_DeskED.notifyEvent(this.require_DeskEvent.MO_PAI_ACT, [1, msg.paicount, false, 0, 0]);
        }
        this.require_DeskData.Instance().setisFenzhangMopai();
        this.require_DeskData.Instance().setRemainCard(msg.paicount);
    },

    overturnAct6(msg, player){
        if (player) {
            this.require_DeskData.Instance().setRemainCard(msg.paicount);//安全起见 没有放到外面处理
            this.require_DeskED.notifyEvent(this.require_DeskEvent.MO_PAI_ACT, [1, msg.paicount, true, 0, 0]);
        }
    },

    fapaiAction(showFapai){
        if(showFapai){
            this.require_DeskED.notifyEvent(this.require_DeskEvent.FAPAI);
        }
    },

    stopHuPaiAni(isZiMo){
        this.require_playerMgr.Instance().shou2mid_id_list.pop();
        //吃 碰 杠 胡 出牌,停止出牌动画
        var play_list = cc.find('Canvas/player_list');
        if (play_list) {
            play_list.getComponent(this.mjComponentValue.playerList).playerStopChuPaiAni();
        }
        cc.log('停止出牌动画-胡牌');
    },

    reconnectCheckHuCardList(){

    },

    checkIsHuangZhuang(huuserid){
        if(!huuserid){
            this.require_DeskED.notifyEvent(this.require_DeskEvent.HUANG_ZHUANG_ANI,[]);
        }
    },

    initMJConfig(){
        return require('mjConfigValue').jlmj;
    },

    getJBC(){
        cc.log("-----------------------no implements base_mj_net_handler_base_mj getJBC-----------------------")
        return cc.dd.Define.GameType.CCMJ_GOLD;
    },

    getFriend(){
        cc.log("-----------------------no implements base_mj_net_handler_base_mj getFriend-----------------------")
        return cc.dd.Define.GameType.CCMJ_FRIEND;
    },

    checkSpecialHu(hutype){
        cc.log("-----------------------no implements base_mj_net_handler_base_mj checkSpecialHu-----------------------")
        return false;
    },

    initMJComponet(){
        cc.log("-----------------------no implements base_mj_net_handler_base_mj initMJComponet-----------------------")
        return require("mjComponentValue").base_mj;
    },
    ///////////////////////////下面的方法直接继承后调用//////////////////////////////////
    /**
     * 开始游戏 消息
     */
    on_mj_ack_game_opening: function( msg ) {

        this.require_DeskData.Instance().waitJiesuan = false;

        this.require_DeskData.Instance().setIsStart( true );
        this.require_DeskData.Instance().isGameStart = true;
        this.require_DeskData.Instance().setFirstMoPai( true );
        this.realCardID = {};

        if(this.handlerType == HANDLER_TYPE.JBC){
            this.needClean = true;

            this.require_deskJBCData.getInstance().setIsStart( true );
            this.require_deskJBCData.getInstance().setIsMatching( false );
        }

        if (!this.headerHandle(msg)) return;
        cc.dd.mj_game_start = true;
        this.waitTime = 0;

        this.require_DeskData.Instance().banker = msg.bankerid;
        this.require_DeskData.Instance().remainCards = this.require_DeskData.Instance().getMJRemainCard();

        this.require_playerMgr.Instance().hidePlayerReady();

        if(this.handlerType == HANDLER_TYPE.JBC){
            this.require_DeskED.notifyEvent(this.require_DeskEvent.GAME_OPENING, []);

            if(this.require_DeskData.Instance().inJueSai && this.require_DeskData.Instance().isMatch()){
                cc.gateNet.Instance().dispatchTimeOut(4);
                this.require_playerMgr.Instance().setBanker(msg.bankerid);
                this.require_DeskData.Instance().setLianzhuang(msg.oldbankerid == msg.bankerid ? msg.bankerid : 0);//设置连庄
                this.require_DeskData.Instance().startGame();
                if (msg.currplaycount > this.require_DeskData.Instance().currPlayCount) {//正常玩时每圈显示一次， 断线重连每次显示
                    this.require_DeskData.Instance().setCurrRound(msg.currplaycount);
                }
            }
        }else{
            this.require_playerMgr.Instance().setBanker(msg.bankerid);
            this.require_DeskData.Instance().setLianzhuang(msg.oldbankerid == msg.bankerid ? msg.bankerid : 0);//设置连庄
            this.require_DeskData.Instance().startGame();
            if (msg.currplaycount > this.require_DeskData.Instance().currPlayCount) {//正常玩时每圈显示一次， 断线重连每次显示
                this.require_DeskData.Instance().setCurrRound(msg.currplaycount);
            }
        }

        cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).cleanJieSuan();
    },

    on_mj_ack_game_deal_cards: function( msg ) {
        this.require_UserPlayer.waitTing = false;

        if (!this.headerHandle(msg)) return;
        if(this.require_DeskData.Instance().isInMaJiang()){
            cc.gateNet.Instance().dispatchTimeOut(4);
        }

        this.require_playerMgr.Instance().playing_fapai_ani = true;
        this.require_playerMgr.Instance().setPlayerCardList(msg.playercardList);

        let showFapai = true;
        //如果已经有玩家有摆牌了，就不播动画
        for(let i = 0; i < msg.playercardList.length; i++){
            if(msg.playercardList[i].composecardList.length > 0){
                showFapai = false;
                cc.gateNet.Instance().clearDispatchTimeout();

                if(this.require_playerMgr.Instance().playing_fapai_ani){
                    this.stopFaPaiAni();
                }

                break
            }
        }

        if(!cc.replay_gamedata_scrolling){
            var play_list = cc.find('Canvas/player_list').getComponent(this.mjComponentValue.playerList);
            play_list.playerUpdateShouPaiUI();
        }
        this.fapaiAction(showFapai);
    },

    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_mj_ack_roomInit: function( msg ) {
        if (!this.headerHandle(msg)) return;
        if(this.handlerType == HANDLER_TYPE.REPLAY){
            RoomMgr.Instance().setGameCommonInfo(msg.deskinfo.desktype,msg.deskinfo.passwrod,msg.deskinfo.owner);
            this.require_DeskData.Instance().setDeskRule(msg.deskinfo);

            var isLooker = true;   //旁观者
            var first_player_id = null;
            cc.replay_looker_id = null;
            let isbanker = 0;
            msg.playersList.forEach(function (playerMsg,idx) {
                if(playerMsg&&playerMsg.userid){
                    if(playerMsg.isbanker){
                        isbanker = playerMsg.userid;
                    }
                    if(!first_player_id){
                        first_player_id = playerMsg.userid;
                    }
                    if(playerMsg.userid == cc.dd.user.id){
                        isLooker = false;
                    }
                }
            },this);

            if(isbanker != 0){
                this.require_DeskData.Instance().banker = isbanker;
                this.require_playerMgr.Instance().setBanker(isbanker);
            }

            if(isLooker){
                cc.dd.user.real_id = cc.dd.user.id;
                cc.replay_looker_id = first_player_id;
                cc.dd.user.id = cc.replay_looker_id;    //旁观者使用第一位玩家作为第一视角
            }

            this.require_playerMgr.Instance().setPlayerList(msg.playersList);

            //打开其他玩家的手牌
            this.require_playerMgr.Instance().playerList.forEach((player) => {
                if(player){
                    player.paixu();
                    player.replaying = true;
                }
                if(player.userId != cc.dd.user.id){
                    player.state = this.require_PlayerState.HUPAI;
                }
            });
            if(!cc.replay_gamedata_scrolling){
                var play_list = cc.find('Canvas/player_list');
                if(play_list){
                    play_list.getComponent(this.mjComponentValue.playerList).playerUpdateShouPaiUI();
                }
            }
            return;
        }else if(this.handlerType == HANDLER_TYPE.JBC){//金币场
            RoomMgr.Instance().gameId = msg.deskinfo.desktype;
            RoomMgr.Instance().roomId = msg.deskinfo.passwrod;
            this.setReconnectRuleCheck(msg.deskinfo);

            for( var i = 0; i < msg.playersList.length; ++ i ) {
                var id = msg.playersList[i].userid;
                if( cc.dd.user.id === id ) {
                    var selfIndex = msg.playersList[i].site;
                    this.require_DeskED.notifyEvent(this.require_DeskEvent.INIT_ZHINAN, [selfIndex]);
                    break;
                }
            }


            for( var i = 0; i < msg.playersList.length; ++ i ) {
                var id = msg.playersList[i].userid;
                if( msg.playersList[i].isbanker ) {
                    this.require_DeskData.Instance().banker = id;
                    break;
                }
            }
        }

        this.waitTime = 0;
        RoomMgr.Instance().setGameCommonInfo(msg.deskinfo.desktype,msg.deskinfo.passwrod,msg.deskinfo.owner);
        this.require_DeskData.Instance().setDeskRule(msg.deskinfo);
        this.require_playerMgr.Instance().playing_fapai_ani = true;
        this.require_playerMgr.Instance().setPlayerList(msg.playersList);

        //游戏开始后关闭GPS
        var play_list = cc.find('Canvas/player_list').getComponent(this.mjComponentValue.playerList);
        play_list.closeGPSWarn();

    },

    on_mj_ack_game_overturn: function( msg ) {
        if (!this.headerHandle(msg)) return;
        cc.dd.NetWaitUtil.net_wait_end();
        this.require_DeskData.Instance().isHu = false;
        this.require_UserPlayer.waitTing = false;
        var clearHeadTexiao = () => {
            var userlist = this.require_playerMgr.Instance().playerList;
            for (var i = 0; userlist && i < userlist.length; ++i) {
                userlist[i].cleardapaiCding();
            }
        };
        var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
        if(player){
            clearHeadTexiao();
            player.dapaiCding(msg);
        }
        if (msg.acttype == 1) { //正常摸牌
            this.overturnAct1(msg, player);
        } else if (msg.acttype == 2) { // 碰OTHER
            this.overturnAct2(msg, player);
        } else if (msg.acttype == 3) {  //打牌
            //轮到谁打牌
            this.overturnAct3(msg, player);
        } else if (msg.acttype == 4) { //看宝操作
            this.overturnAct4(msg, player);
        } else if (msg.acttype == 5) { //杠牌或者补杠引起的摸牌
            this.overturnAct5(msg, player);
        } else if (msg.acttype == 6) {  //每局第一手打牌
            this.overturnAct6(msg, player);
        }

        if(this.handlerType == HANDLER_TYPE.REPLAY){
            player.setCpgth(msg);
            if(!cc.replay_gamedata_scrolling){
                //用户玩家可操作选项
                if(player.isUserPlayer()){
                    var menu_list = cc.find("Canvas/game_menu_list").getComponent(this.mjComponentValue.gameMenuList);
                }else{
                    var menu_list = cc.find("Canvas/game_menu_list_"+player.viewIdx).getComponent(this.mjComponentValue.gameMenuList);
                }
                var menu_pos = [
                    [
                        cc.v2(472, -134),
                        cc.v2(349, -134),
                        cc.v2(226, -134),
                        cc.v2(102, -134),
                        cc.v2(-21, -134),
                        cc.v2(-144, -134),
                    ],
                    [
                        cc.v2(472, 56),
                        cc.v2(349, 56),
                        cc.v2(226, 56),
                        cc.v2(102, 56),
                        cc.v2(-21, 56),
                        cc.v2(-144, 56),
                    ],
                    [
                        cc.v2(472 - 200, 244),
                        cc.v2(349 - 200, 244),
                        cc.v2(226 - 200, 244),
                        cc.v2(102 - 200, 244),
                        cc.v2(-21 - 200, 244),
                        cc.v2(-144 - 200, 244),
                    ],
                    [
                        cc.v2(-472, 56),
                        cc.v2(-349, 56),
                        cc.v2(-226, 56),
                        cc.v2(-102, 56),
                        cc.v2(21, 56),
                        cc.v2(144, 56),
                    ]
                ];
                menu_list.setMenuPosList(menu_pos[player.viewIdx]);
                menu_list.setMenus(player);
            }
        }else{
            if(msg.cannothutipsList && msg.cannothutipsList.length && msg.userid == cc.dd.user.id){
                this.require_DeskED.notifyEvent(this.require_DeskEvent.SHOW_DA_PAI_PROMPT, [1,true]);
            }else if(msg.userid == cc.dd.user.id){
                this.require_DeskED.notifyEvent(this.require_DeskEvent.SHOW_DA_PAI_PROMPT, [-1,false]);
            }
            //用户玩家可操作选项
            this.require_UserPlayer.setCpgth(msg);
            if (msg.jiaoinfosList.length) {
                this.require_UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
            }

            if (player && player.isUserPlayer()) {
                if (!cc.dd.AppCfg.IS_DEBUG) {
                    //设置是否自动出牌
                    player.setAutoChuPai(msg);
                }
            }


            //玩家没有摸牌,直接提示操作菜单
            var menu_list = cc.find("Canvas/game_menu_list");
            if (!this.require_UserPlayer.hasMoPai()) {
                //吃,碰,点杠
                if (menu_list) {
                    menu_list.getComponent(this.mjComponentValue.gameMenuList).setMenus(this.require_UserPlayer);
                }
            }else if(msg.acttype == 1 && (msg.cangang || msg.canbugang || msg.canhu || msg.canting)){
                if (menu_list && player && player.userId == cc.dd.user.id) {
                    menu_list.getComponent(this.mjComponentValue.gameMenuList).setMenus(this.require_UserPlayer);
                }
            }else{
                if(msg.acttype != 1){
                    if(player&&player.userId == cc.dd.user.id){
                        if(menu_list){
                            menu_list.getComponent(this.mjComponentValue.gameMenuList).setMenus(this.require_UserPlayer);
                        }
                    }
                }
                if( msg.acttype == 1 && msg.actcard && cc.dd._.isUndefined(msg.actcard.id) ){  //修复,补杠断线重连不显示杠
                    if(player&&player.userId == cc.dd.user.id){
                        if(menu_list){
                            menu_list.getComponent(this.mjComponentValue.gameMenuList).setMenus(this.require_UserPlayer);
                        }
                    }
                }
            }
        }
    },

    on_mj_ack_game_send_out_card: function( msg ) {
        this.require_DeskData.Instance().waitForSendOutCard = false;

        if (!this.headerHandle(msg)) {
            this.require_DeskData.Instance().sendCard = null;

            if(msg.userid == cc.dd.user.id && msg.card && this.realCardID && msg.card.id != this.realCardID[msg.userid]){
                let player = this.require_playerMgr.Instance().getPlayer(msg.userid);
                if(player.shoupai.indexOf(msg.card.id) == -1) {
                    var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
                    player_down_ui.stopChuPai();

                    player.addShouPai([msg.card.id]);
                    player.paixu();
                    let idx = player.chupai.indexOf(msg.card.id);
                    if(idx != -1){
                        player.chupai.splice(idx, 1);
                    }

                    player_down_ui.removeChupai(player);
                    player_down_ui.updateShouPai();

                    // if(cc.dd._.isArray(this.require_UserPlayer.waitDapai) && this.require_UserPlayer.waitDapai.length > 0){
                    //     let pai = this.require_UserPlayer.waitDapai.shift();
                    //     this.require_playerMgr.Instance().shou2mid_id_list.push(pai);
                    //     this.require_UserPlayer.dapai(pai);
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

        if(this.require_UserPlayer.canting && !this.require_UserPlayer.curjiaoPaiInfo_list && cc.dd.user.id == msg.userid){
            this.require_UserPlayer.setJiaoInfo(msg.card.id);
        }
        if(cc.dd.user.id == msg.userid){
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
            player_down_ui.setShoupaiTingbiaoji(false);
        }
        var func = () => {
            var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
            if (player) {
                if(msg.hasOwnProperty('othertipsList')){
                    let isQuick = true;

                    for(let i = 0; i < msg.othertipsList.length; i++){
                        let item = msg.othertipsList[i];
                        if(item.canchi || item.canpeng || item.cangang || item.canhu){
                            isQuick = false;
                            break;
                        }
                    }

                    this.require_playerMgr.Instance().shou2mid_id_list.push(msg.card.id);
                    if(msg.userid != cc.dd.user.id || ((player.isBaoTing || this.require_UserPlayer.waitTing || this.require_DeskData.Instance().isoffline) && player.chupai.indexOf(msg.card.id) == -1) || player.replaying || player.shoupai.indexOf(msg.card.id) != -1){
                        // if(msg.userid == cc.dd.user.id && UserPlayer.mid2dapai_playing){
                        //     if(!cc.dd._.isArray(UserPlayer.waitDapai)){
                        //         UserPlayer.waitDapai = [];
                        //     }
                        //     UserPlayer.waitDapai.push(msg.card.id);
                        // }else{
                        player.dapai(msg.card.id, isQuick);
                        // }
                    }

                }else{
                    if(msg.userid != cc.dd.user.id || ((player.isBaoTing || this.require_UserPlayer.waitTing || this.require_DeskData.Instance().isoffline) && player.chupai.indexOf(msg.card.id) == -1) || player.replaying || player.shoupai.indexOf(msg.card.id) != -1){
                        // if(msg.userid == cc.dd.user.id && this.require_UserPlayer.mid2dapai_playing){
                        //     if(!cc.dd._.isArray(this.require_UserPlayer.waitDapai)){
                        //         this.require_UserPlayer.waitDapai = [];
                        //     }
                        //     this.require_UserPlayer.waitDapai.push(msg.card.id);
                        // }else{
                        this.require_playerMgr.Instance().shou2mid_id_list.push(msg.card.id);
                        player.dapai(msg.card.id);
                        // }
                    }
                }


            }
            if(msg.userid == cc.dd.user.id){
                this.require_UserPlayer.waitTing = false;
            }

            this.require_DeskData.Instance().last_chupai_id = msg.card.id;
            if(!this.require_DeskData.Instance().dabaoing){
                this.require_DeskED.notifyEvent(this.require_DeskEvent.BIAOJI_BAOPAI,[]);
            }
            this.require_playerMgr.Instance().chupai_timeout_on_ting = false;
        };

        //听牌后的出牌延时
        if(this.require_playerMgr.Instance().chupai_timeout_on_ting){
            setTimeout(function () {
                func();
            }.bind(this),300);
        }else{
            func();
        }
        this.require_DeskED.notifyEvent(this.require_DeskEvent.STOP_TIMEUP,[]);
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_mj_ack_update_deposit: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var isoffline = msg.isdeposit;
        this.require_DeskData.Instance().isoffline = isoffline;
        //发出事件
        this.require_DeskED.notifyEvent(this.require_DeskEvent.TUO_GUAN, isoffline);
    },



    on_mj_ack_chi: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //被吃的牌，移除
        var playerOut = this.require_playerMgr.Instance().getPlayer(msg.useridout);
        if (playerOut) {
            playerOut.beichi();
        }

        //吃的牌，移除
        var playerIn = this.require_playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.chi(msg.chicardList);
        }

        if(!cc.replay_gamedata_scrolling){
            this.require_playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent(this.mjComponentValue.playerList).playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-吃牌');
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

    on_mj_ack_game_act_peng: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //被碰的牌，移除
        var playerOut = this.require_playerMgr.Instance().getPlayer(msg.useridout);
        if (playerOut) {
            if (msg.isrob) {
                playerOut.beiQiangPeng();
            } else {
                playerOut.beipeng();
            }
        }

        //碰的牌，移除
        var playerIn = this.require_playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.peng(msg.pengcardList);
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
            playerIn.gang(msg);
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

    on_mj_ack_game_act_bugang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //玩家补杠
        var playerIn = this.require_playerMgr.Instance().getPlayer(msg.userid);
        if (playerIn) {
            playerIn.bugang(msg);
        }
        if(msg.userid == cc.dd.user.id){
            this.require_UserPlayer.modepai = null;
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

    on_mj_ack_game_act_guo: function( msg ) {
        if (!this.headerHandle(msg)) return;
        var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
        if(player){
            player.guo();
        }
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

        if(msg.userid == cc.dd.user.id){
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
            player_down_ui.setShoupaiTingbiaoji(false);
        }
    },

    on_mj_ack_game_ting: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //听牌
        var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
        if(this.handlerType == HANDLER_TYPE.REPLAY){
            player.isBaoTing = true;
            player.isTempBaoTing = false;
            player.isTempGang = false;
            player.isTempBaoGu = false;
            this.require_playerED.notifyEvent(this.require_PlayerEvent.TING,[player]);
        }else{
            player.ting();
            cc.gateNet.Instance().dispatchTimeOut(0.3);
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
            player_down_ui.setShoupaiTingbiaoji(false);
        }
        // this.require_playerMgr.Instance().chupai_timeout_on_ting = true;
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_mj_ack_chiting: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //被吃的牌，移除
        var playerOut = this.require_playerMgr.Instance().getPlayer(msg.useridout);
        if (playerOut) {
            playerOut.beichi();
        }

        //吃的牌，移除
        var playerIn = this.require_playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.chiTingPai(msg.chicardList);
        }

        if(!cc.replay_gamedata_scrolling){
            this.require_playerMgr.Instance().shou2mid_id_list.pop();
            //吃 碰 杠 胡 出牌,停止出牌动画
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent(this.mjComponentValue.playerList).playerStopChuPaiAni();
            }
            cc.log('停止出牌动画-吃牌');
        }

        //听牌
        var player = this.require_playerMgr.Instance().getPlayer(msg.useridin);
        player.chiting();
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

        cc.gateNet.Instance().dispatchTimeOut(0.3);

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
        player_down_ui.setShoupaiTingbiaoji(false);
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_mj_ack_pengting: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //被碰的牌，移除
        var playerOut = this.require_playerMgr.Instance().getPlayer(msg.useridout);
        if (playerOut) {
            if (msg.isrob) {
                playerOut.beiQiangPeng();
            } else {
                playerOut.beipeng();
            }
        }

        //碰的牌，移除
        var playerIn = this.require_playerMgr.Instance().getPlayer(msg.useridin);
        if (playerIn) {
            playerIn.pengTingPai(msg.pengcardList);
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

        //听牌
        var player = this.require_playerMgr.Instance().getPlayer(msg.useridin);
        player.pengting();
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

        cc.gateNet.Instance().dispatchTimeOut(0.3);

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
        player_down_ui.setShoupaiTingbiaoji(false);
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_mj_ack_gangting: function( msg ) {
        if (!this.headerHandle(msg)) return;
        msg.gangtype = 16;
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
            playerIn.gang(msg, false);
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

        //听牌
        var player = this.require_playerMgr.Instance().getPlayer(msg.useridin);
        player.gangting(msg.isxiaosa);
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
        player_down_ui.setShoupaiTingbiaoji(false);
        cc.dd.NetWaitUtil.net_wait_end();
    },

    on_mj_ack_game_dabao: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.require_DeskData.Instance().dabao(msg);
        this.require_DeskED.notifyEvent(this.require_DeskEvent.MO_HUAN_BAO_PAI, [msg.baopaiindex, null]);
        cc.gateNet.Instance().dispatchTimeOut(2);
    },

    on_mj_ack_game_changbao: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.require_DeskData.Instance().changebao(msg);
        this.require_DeskED.notifyEvent(this.require_DeskEvent.MO_HUAN_BAO_PAI, [msg.newbaopaiindex, true]);
    },

    on_mj_ack_reconnect: function( msg ) {
        this.require_DeskData.Instance().waitForSendOutCard = false;
        this.require_DeskData.Instance().waitJiesuan = false;

        if (!this.headerHandle(msg)) return;

        let noUpdateShouPai = false;
        let playerHasPaoFen = -2;
        for(let i = 0; i < msg.playerinfoList.length; i++){
            let player = msg.playerinfoList[i];
            if(player.paofen == -2){
                noUpdateShouPai = true
            }

            if(player.userid == cc.dd.user.id){
                playerHasPaoFen = player.paofen;
            }
        }
        if(noUpdateShouPai){
            msg.deskgameinfo.unbaopai = -2;
        }

        if(this.handlerType == HANDLER_TYPE.JBC && !this.require_DeskData.Instance().isMatch()){
            RoomMgr.Instance().gameId = msg.deskrules.desktype;

            this.require_deskJBCData.getInstance().setIsReconnect( true );
            this.require_deskJBCData.getInstance().setIsStart( true );
            this.require_DeskData.Instance().setIsStart( true );

            if(msg.jiaoinfosList.length){
                this.require_UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
            }
        }

        cc.dd.mj_game_start = true;
        this.realCardID = {};
        for( var i = 0; i < msg.playerinfoList.length; ++i ) {
            var id = msg.playerinfoList[i].userid;
            if(msg.playerinfoList[i].playercard.outcardList.length > 0){
                this.realCardID[id] = msg.playerinfoList[i].playercard.outcardList[msg.playerinfoList[i].playercard.outcardList.length - 1];
            }
        }
        this.waitTime = 0;
        this.setReconnectRuleCheck(msg.deskrules);

        this.require_DeskData.Instance().isGameStart = true;
        this.require_DeskData.Instance().clear();
        this.require_playerMgr.Instance().clear();

        //关闭一次解散房间界面
        cc.dd.UIMgr.destroyUI(this.require_jlmj_prefab.JLMJ_JIESAN);
        //处理一局完成后 如果玩家已经准备
        this.comData(msg);
        //设置恢复数据
        RoomMgr.Instance().setGameCommonInfo(msg.deskrules.desktype,msg.deskrules.passwrod,msg.deskrules.owner);
        if(msg.deskrules.desktype == this.getJBC() && !this.require_DeskData.Instance().isMatch()){   //金币场
            var room_cfg = game_room_cfg.getItem(function (item) {
                return item.key == msg.deskrules.configid;
            });
            RoomMgr.Instance().roomLv = room_cfg.roomid;
        }

        for( var i = 0; i < msg.playerinfoList.length; ++i ) {
            var id = msg.playerinfoList[i].userid;
            if( cc.dd.user.id === id ) {
                this.require_DeskData.Instance().zhiNan_site = msg.playerinfoList[i].site;
                break;
            }
        }

        this.require_DeskData.Instance().setDeskRule(msg.deskrules, msg.deskgameinfo.gamestatus);

        // 重连游戏
        var gameType = msg.deskrules.desktype;
        cc.log("-------ccpyc 断线重连------0");

        let func = ()=>{
            cc.log("-------ccpyc 设置玩家数据------1");
            this.require_playerMgr.Instance().setPlayerList(msg.playerinfoList);
            cc.log("-------ccpyc 设置玩家数据------2");
            this.require_UserPlayer.paixu();
            this.require_UserPlayer.isTempBaoTing = false;   //清除临时报听状态
            if(msg.jiaoinfosList.length){
                this.require_UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
            }

            this.require_DeskData.Instance().setRecoverData(msg.deskgameinfo);

            if(this.handlerType == HANDLER_TYPE.JBC && !this.require_DeskData.Instance().isMatch()){
                for( var i = 0; i < msg.playerinfoList.length; ++ i ) {
                    var id = msg.playerinfoList[i].userid;
                    if( cc.dd.user.id === id ) {
                        var selfIndex = msg.playerinfoList[i].site;
                        this.require_DeskED.notifyEvent(this.require_DeskEvent.INIT_ZHINAN, [selfIndex]);
                        break;
                    }
                }

                this.configId = msg.deskrules.configid;

                var game_room = require( "game_room" );
                var jlmjJbcCfgItem = game_room.getItem( function(item) {
                    return item.key === this.configId;
                }.bind( this ) );
                this.require_deskJBCData.getInstance().setData( jlmjJbcCfgItem );
            }

            cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).cleanJieSuan();
            //发出事件 如果在房间内则直接刷新  如果在大厅 则先进入房间内在刷新
            cc.log("-------ccpyc 断线重连------1");
            this.require_DeskED.notifyEvent(this.require_DeskEvent.RECOVER_DESK, msg.deskrules.desktype);

            //检查一炮多响
            this.reconnectCheckHuCardList(msg);

            //关闭一次gps
            //var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
            //play_list.closeGPSWarn();

            if(this.require_playerMgr.Instance().playing_fapai_ani){
                this.stopFaPaiAni();
            }

            if(!noUpdateShouPai) {
                //排序手牌
                var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(this.mjComponentValue.playerDownUI);
                player_down_ui.updateShouPai(this.require_UserPlayer);
            }else{
                this.require_DeskED.notifyEvent(this.require_DeskEvent.SHOW_PAO_FEN, playerHasPaoFen);
            }

            //游戏开始后关闭GPS
            var play_list = cc.find('Canvas/player_list').getComponent(this.mjComponentValue.playerList);
            play_list.refreshGPSWarn();
        }



        // 没有在场景里面 需要进入场景
        if(!cc.dd.SceneManager.isGameSceneExit( gameType )){
            cc.dd.SceneManager.enterGame(gameType, func);
        }else{
            func();
        }

    },

    on_mj_ack_remain_majiang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        GmPaiKu.setPaiKu(msg.cardsList);
        cc.resources.load('gameyj_mj_tools/jlmj_gm_huanpai', cc.Prefab, function (err, prefab) {
            var huanpai = cc.instantiate(prefab);
            huanpai.parent = cc.find('Canvas');
        }.bind(this));
    },

    on_mj_ack_change_majiang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        GmPaiKu.changePai(msg);
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

            // 摊开其他玩家手牌
            msg.holdcardinfoList.forEach((value, key) => {
                var player = this.require_playerMgr.Instance().getPlayer(value.userid);
                if (player.userId == huPlayerObject.userId) {
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

            let huType = [];
            this.require_playerMgr.Instance().playing_special_hu = 0;
            for (let i = 0; i < msg.hutypeList.length; i++) {
                if (this.checkSpecialHu(msg.hutypeList[i])) {
                    huType.push(msg.hutypeList[i]);
                    this.require_playerMgr.Instance().playing_special_hu += 2000;
                }
            }

            if (huType.length > 0) {
                this.require_DeskED.notifyEvent(this.require_DeskEvent.HU, [huType]);
            }

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

    /**
     * 小结算 消息
     * @param msg
     */
    on_mj_ack_send_current_result: function( msg ) {
        cc.log('【数据】普通结算消息接收 开始');
        if ( !this.headerHandle( msg ) ) return;
        let laseJiesuan = cc.find("Canvas/toppanel/last_jie_suan");
        if(laseJiesuan){
            laseJiesuan.active = false;
        }

        this.require_DeskData.Instance().waitJiesuan = true;
        this.require_DeskData.Instance().setIsStart( false );
        this.require_DeskData.Instance().unlockScene();

        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);//关闭menu

        msg.jiesuanBanker = this.require_DeskData.Instance().banker;

        var play_list = cc.find('Canvas/player_list').getComponent(this.mjComponentValue.playerList);
        //显示其他玩家的暗杠
        msg.playercoininfoList.forEach((item) => {
            if(item && item.userid){
                if(item.userid != cc.dd.user.id){
                    var other_player = this.require_playerMgr.Instance().getPlayer(item.userid);
                    if(other_player){
                        other_player.openAnGang(item.pailistList);
                    }
                    // other_player.isBaoting = item.isting;
                    // play_list.player_ui_arr[other_player.viewIdx].head.setTing(item.isting);
                }
            }
        });

        //显示宝牌
        if(msg.baopaiList && msg.baopaiList.length>0){
            this.require_DeskData.Instance().setBaoPai( msg.baopaiList[msg.baopaiList.length-1].id );
        }

        play_list.playerUpdateShouPaiUI();

        if(this.handlerType == HANDLER_TYPE.REPLAY){
            cc.dd.UIMgr.destroyUI(this.require_jlmj_prefab.JLMJ_JIAOPAI_INFO);
            if (this.require_DeskData.Instance().isInMaJiang()) {
                cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_JIESUAN, function (ui) {
                    var jlmj_jiesuan = ui.getComponent("jlmj_jiesuan_ui");
                    jlmj_jiesuan.showJianYiLayer(msg, 20, function () {
                    });
                    jlmj_jiesuan.jiesuanBtnCallBack();
                    jlmj_jiesuan.HideBtn();
                }.bind(this));
            }
        }else{

            this.checkIsHuangZhuang(msg.huuserid);

            this.waitTime = 500 + this.require_playerMgr.Instance().playing_special_hu;

            setTimeout(()=>{
                this.require_DeskData.Instance().jiesuan( msg );
                this.waitTime = 0;
            }, this.waitTime);


            if(this.handlerType == HANDLER_TYPE.JBC){
                this.require_deskJBCData.getInstance().setIsStart(this.require_DeskData.Instance().isFriend()==false);
                this.require_DeskData.Instance().setIsStart( false );
            }
        }

        this.require_DeskED.notifyEvent(this.require_DeskEvent.OPEN_BAO_PAI,[]);
        this.require_DeskED.notifyEvent(this.require_DeskEvent.BIAOJI_BAOPAI,[]);
        cc.log('【数据】普通结算消息接收 完成 ');
    },

    on_mj_ack_operator: function( msg ) {
        if (!this.headerHandle(msg)) return;

        // 出牌剩余时间
        var remainingTime = msg.remainingtime;
        // 闪动光标玩家
        var actCursorId = msg.actcursorid;
        if (actCursorId && actCursorId != 0) {
            var playerObject = this.require_playerMgr.Instance().getPlayer(actCursorId);
            var arg = { time: (remainingTime ? (remainingTime < 100 ? remainingTime : 100) : 0) };
            playerObject.dapaiCding(arg);
        }
        // 上下浮动箭头玩家
        var lastActOutId = msg.lastactoutid;
        if (lastActOutId && lastActOutId != 0) {
            var playerObject = this.require_playerMgr.Instance().getPlayer(lastActOutId);
            playerObject.takeOverZsq();
        }
    },

    on_mj_ack_reloading_ok: function( msg ) {
        if (!this.headerHandle(msg)) return;

        this.require_DeskData.Instance().unlockScene();
    },

    on_mj_ack_ready: function( msg ) {
        if (!this.headerHandle(msg)) return;
        if(this.handlerType == HANDLER_TYPE.JBC){
            if(this.require_DeskData.Instance().inJueSai && this.require_DeskData.Instance().isMatch() && this.needClean == true){
                this.needClean = false;
                this.require_DeskData.Instance().clear();
                this.require_playerMgr.Instance().clear();
            }
        }

        // this.require_playerMgr.Instance().clearPai();

        this.require_playerMgr.Instance().playerList.forEach(function (item, idx) {
            if (item) {
                item.cleardapaiCding();
            }
        })
        var player = this.require_playerMgr.Instance().getPlayer(msg.header.userid);
        if (player) {
            player.clearHeadNearby();
            player.setReady(1);

            if(msg.header.userid == cc.dd.user.id){
                this.require_DeskData.Instance().clear();
                this.require_playerMgr.Instance().clear();
                cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).cleanJieSuan();
                cc.find('Canvas/desk_info').getComponent(this.mjComponentValue.deskInfo).setLastJieSuanActive();
            }
        }
    },

    on_mj_ack_sponsor_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.require_DeskData.Instance().sponsorDissolveRoom(msg);
    },

    on_mj_ack_response_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.require_DeskData.Instance().responseDissolveRoom(msg);
    },

    on_mj_ack_dissolve_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        if (cc.director.getScene().name != cc.dd.Define.GameId[this.getFriend()]) {
            return;
        }
        this.require_DeskData.Instance().dissolveRoom(msg);
    },

    on_mj_ack_exit_room: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.require_DeskData.Instance().exitRoom(msg);
    },

    on_mj_ack_finally_result: function( msg ) {
        cc.log('【数据】战绩消息接收 开始');
        if (!this.headerHandle(msg)) return;
        cc.dd.UIMgr.destroyUI(this.require_jlmj_prefab.JLMJ_JIESAN);
        this.require_DeskData.Instance().isGameEnd = true;
        if(cc.dd._.isNull(this.waitTime) || cc.dd._.isUndefined(this.waitTime)){
            this.waitTime = 0;
        }
        // if(this.waitTime!=0){
        //     this.waitTime += 2000;
        // }
        setTimeout(()=>{
            this.require_DeskData.Instance().showResultView(msg);
        },this.waitTime);
        cc.log('【数据】战绩消息接收 结束');
    },

    on_mj_ack_fen_zhang: function( msg ) {
        if (!this.headerHandle(msg)) return;
        cc.log('【数据】分张消息接收');
        this.require_DeskData.Instance().fenzhang();
    },

    on_mj_ack_rob_remove_card: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
        player.removeRobCard_new(msg.cardid, msg.robtype);
    },

    on_mj_game_ack_act_huangzhuangpais: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var playerHoldList = msg.holdcardinfoList;
        for (var i = 0; i < playerHoldList.length; ++i) {
            var playerObject = this.require_playerMgr.Instance().getPlayer(playerHoldList[i].userid);
            playerObject.kaipai(playerHoldList[i].holdcardList, playerHoldList[i].mopai);
        }
    },

    /**
     * 网络状况  4个心跳包收到个数
     */
    msg_hearbeat_num: function (msg) {
        var data = { userId: msg.userId, isWeak: msg.num < 3 };
        RoomED.notifyEvent(RoomEvent.player_signal_state, [data]);
    },

    /**
     * 金币场 听牌后更新宝牌
     * @param msg
     */
    on_mj_ack_bao: function (msg) {
        this.require_DeskData.Instance().setBaoPai( msg.card );
        if(!cc.replay_gamedata_scrolling){
            cc.find("Canvas/desk_info").getComponent(this.mjComponentValue.deskInfo).updateBaoPai();
        }
    },

    /**
     * 金币更新
     * @param msg
     */
    on_mj_ack_update_coin: function( msg ) {
        if(this.handlerType == HANDLER_TYPE.JBC){
            cc.log( msg.userid + "更新金币 JBC" );
            var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
            if(player){
                if(this.require_DeskData.Instance().isMatch()){
                    var changeScore = msg.coin - player.coin;
                    player.setCoin( msg.coin );
                    BSC_ED.notifyEvent(BSC_Event.UPDATE_SCORE, [msg.userid, changeScore, msg.coin]);
                }else{
                    player.setCoin( msg.coin );
                }
            }
        }
    },

    on_mj_ack_paofen: function(msg){
        var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
        if(player){
            player.showPaoFen(msg.score);
        }else{
            if(!cc.replay_gamedata_scrolling && !this.require_DeskData.Instance().isReplay()) {
                this.require_DeskED.notifyEvent(this.require_DeskEvent.FAPAI);
            }
        }
    },

    on_mj_ack_buhua: function( msg ) {
        var player = this.require_playerMgr.Instance().getPlayer(msg.userid);
        if (player) {
            player.buhua(msg.card.id);
        }
        cc.dd.NetWaitUtil.net_wait_end();
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
            desk_node.getComponent(this.mjComponentValue.scene).jlmjPlayerDownSortShouPai();
        }
    }
});

module.exports = {
    handler:handler,
    handlerType:HANDLER_TYPE
};