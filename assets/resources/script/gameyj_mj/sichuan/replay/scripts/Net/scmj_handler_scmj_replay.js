var scmj_net_handler_scmj = require( "scmj_net_handler_scmj" );

var DeskED = require('scmj_desk_data').DeskED;
var DeskEvent = require('scmj_desk_data').DeskEvent;
var DeskData = require('scmj_desk_data').DeskData;
var Define = require( "Define" );

var jlmj_prefab = require('jlmj_prefab_cfg');

var playerMgr = require('scmj_player_mgr');
var PlayerState = require("scmj_player_data").PlayerState;
var playerED = require("scmj_player_data").PlayerED;
var PlayerEvent = require("scmj_player_data").PlayerEvent;

var RoomMgr = require('jlmj_room_mgr').RoomMgr;




var handler = cc.Class({
    extends: scmj_net_handler_scmj.constructor,

    ctor: function() {
        cc.log( "scmj_net_handler_scmj 子类 回放" );
    },

    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_xzmj_ack_roomInit: function( msg ) {
        if (!this.headerHandle(msg)) return;
        RoomMgr.Instance().setGameCommonInfo(msg.deskinfo.desktype,msg.deskinfo.passwrod,msg.deskinfo.owner);
        DeskData.Instance().setDeskRule(msg.deskinfo);
        DeskData.Instance().isGameStart = true;

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
            DeskData.Instance().banker = isbanker;
            playerMgr.Instance().setBanker(isbanker);
        }

        if(isLooker){
            cc.dd.user.real_id = cc.dd.user.id;
            cc.replay_looker_id = first_player_id;
            cc.dd.user.id = cc.replay_looker_id;    //旁观者使用第一位玩家作为第一视角
        }

        playerMgr.Instance().setPlayerList(msg.playersList);

        //打开其他玩家的手牌
        playerMgr.Instance().playerList.forEach(function (player) {
            if(player){
                player.paixu();
                player.replaying = true;
            }
            if(player.userId != cc.dd.user.id){
                player.state = PlayerState.HUPAI;
            }
        });
        if(!cc.replay_gamedata_scrolling){
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('scmj_player_list').playerUpdateShouPaiUI();
            }
        }
    },

    on_xzmj_ack_game_overturn: function( msg ) {
        if (!this.headerHandle(msg)) return;
        DeskData.Instance().isHu = false;
        var clearHeadTexiao = function () {
            var userlist = playerMgr.Instance().playerList;
            for (var i = 0; userlist && i < userlist.length; ++i) {
                if(userlist[i]){
                    userlist[i].cleardapaiCding();
                }
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
        } else if (msg.acttype == 2) { // 换牌

        } else if (msg.acttype == 3) {
            //轮到谁打牌
        }else if(msg.acttype == 4){

        }
        else if (msg.acttype == 5) { //点杠摸牌
            if (player) {
                player.mopai(msg);
                var isNomalMo = msg.acttype == 1; //1是正常摸牌 5是杠牌摸牌
                DeskED.notifyEvent(DeskEvent.MO_PAI_ACT, [1, msg.paicount, isNomalMo, 0, 0]);
            }
            DeskData.Instance().setisFenzhangMopai();
            DeskData.Instance().setRemainCard(msg.paicount);
        }else if (msg.acttype == 6) {
            if (player) {
                DeskData.Instance().setRemainCard(msg.paicount);//安全起见 没有放到外面处理
                DeskED.notifyEvent(DeskEvent.MO_PAI_ACT, [1, msg.paicount, true, 0, 0]);
            }
        }

        player.setCpgth(msg);
        if(!cc.replay_gamedata_scrolling){
            //用户玩家可操作选项
            if(player.isUserPlayer()){
                var menu_list = cc.find("Canvas/game_menu_list").getComponent("scmj_game_menu_list");
            }else{
                var menu_list = cc.find("Canvas/game_menu_list_"+player.viewIdx).getComponent("scmj_game_menu_list");
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
    },


    /**
     * 听牌
     * @param msg
     */
    on_xzmj_ack_game_ting: function( msg ) {
        if (!this.headerHandle(msg)) return;
        //听牌
        var player = playerMgr.Instance().getPlayer(msg.userid);
        player.isBaoTing = true;
        player.isTempBaoTing = false;
        player.isTempBaoGu = false;
        player.isTempGang = false;
        // player.state = PlayerState.TINGPAI;
        playerED.notifyEvent(PlayerEvent.TING,[player]);
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        cc.dd.NetWaitUtil.net_wait_end();
    },

    /**
     * 小结算 消息
     * @param msg
     */
    on_xzmj_ack_send_current_result: function( msg ) {
        cc.log('【数据】普通结算消息接收 开始');
        if ( !this.headerHandle( msg ) ) return;
        DeskData.Instance().setIsStart( false );

        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);//关闭menu

        msg.jiesuanBanker = DeskData.Instance().banker;

        let isLiuju = 0;

        let checkJiaoList = [];
        let huazhuWin = 0;

        if (playerMgr.Instance().playing_shou2mid_ani) { //上家正在打牌动画,
            cc.log('上家打牌动画中,记录下家已摸牌');
            // playerMgr.Instance().normal_mopaiing = true;
            var id = playerMgr.Instance().shou2mid_id_list.pop();
            playerMgr.Instance().mid2dapai_id_list.push(id);
        } else {  //上家出牌动画结束,则播放入牌海动画
            cc.log('上家打牌动画结束,播放入牌海动画');
            var id = playerMgr.Instance().shou2mid_id_list.pop();
            playerMgr.Instance().playerMid2DapaiAction(id);
        }

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

        let waitTime = 500 + playerMgr.Instance().playing_special_hu;

        if(DeskData.Instance().remainCards == 0 && isLiuju < 3 && !RoomMgr.Instance()._Rule.isxueliu){
            setTimeout(()=>{
                DeskED.notifyEvent(DeskEvent.HUANG_ZHUANG_ANI,[]);
            }, waitTime);
            waitTime += 1000;
        }
        if(checkJiaoList.length > 0){
            setTimeout(()=>{
                playerMgr.Instance().checkHuaZhuAndWuJiao(checkJiaoList, huazhuWin);
            }, waitTime);
            waitTime += 2000;
        }

        setTimeout(()=>{
            play_list.playerUpdateShouPaiUI();

            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
            player_down_ui.setShoupaiTingbiaoji(false);

            cc.dd.UIMgr.destroyUI(jlmj_prefab.SCMJ_JIAOPAI_INFO);
            if (DeskData.Instance().isInMaJiang()) {
                cc.dd.UIMgr.openUI(jlmj_prefab.SCMJ_JIESUAN, function (ui) {
                    var jlmj_jiesuan = ui.getComponent("jlmj_jiesuan_ui");
                    jlmj_jiesuan.showJianYiLayer(msg, 20, function () {
                    });
                    jlmj_jiesuan.jiesuanBtnCallBack();
                    jlmj_jiesuan.HideBtn();
                }.bind(this));
            }
        }, waitTime);


        DeskED.notifyEvent(DeskEvent.OPEN_BAO_PAI,[]);
        DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI,[]);
    },
//换三张
    on_xzmj_ack_huan3zhang:function(msg){
        if (!this.headerHandle(msg)) return;

        DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [-1, false]);

        var huan_menu_list = cc.find("Canvas/scmj_huan3zhang");
        if (huan_menu_list) {
            huan_menu_list.getComponent("scmj_huan3zhang").huan3ZhangHide();
        }

        for(let i = 0; i < msg.playerinfoList.length; i++){
            let info = msg.playerinfoList[i];
            let player = playerMgr.Instance().getPlayer(info.userid);
            if(player){
                player.quickHuan3Zhang(info.choosepaisList, info.huanpaisList);
            }
        }
    },
});

module.exports = new handler();