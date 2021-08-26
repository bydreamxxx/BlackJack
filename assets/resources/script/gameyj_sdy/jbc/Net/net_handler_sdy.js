var RoomData = require('sdy_room_data').RoomData;
var PlayerMgr = require('sdy_player_mgr').PlayerMgr;
var UserPlayer = require('sdy_userPlayer_data');
var RoomED = require('sdy_room_data').RoomED;
var RoomEvent = require('sdy_room_data').RoomEvent;
var SdyTextCfg = require('sdy_text_cfg');
var SdyAudioCfg = require('sdy_audio_cfg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var handler = {

    /**
     * 初始化
     * @param msg
     */
    on_msg_sdy_room_init: function (msg) {
        RoomMgr.Instance().player_mgr = PlayerMgr.Instance();
        RoomMgr.Instance().game_info = {};
        RoomMgr.Instance().game_info.gameType = msg.gameType;
        RoomMgr.Instance().game_info.roomId = msg.roomId;
        RoomData.Instance().setData(msg);
        PlayerMgr.Instance().setData(msg);

        var player_cur_op = PlayerMgr.Instance().getPlayer(msg.roomInfo.curOp.userId);
        if( player_cur_op == null ){
            cc.error('服务器 当前操作玩家id=',msg.roomInfo.curOp.userId,'错误!');
            return;
        }

        var call_timeout = msg.roomInfo.curOp.timeout;
        var select_timeout = msg.roomInfo.curOp.timeout;
        var base_timeout = msg.roomInfo.curOp.timeout;
        var chupai_timeout = msg.roomInfo.curOp.timeout;
        // if(msg.type == 2){
        //     var offset = parseInt(new Date().getTime()/1000) - msg.roomInfo.curOp.timeout;
        //     call_timeout = msg.roomInfo.callScoreTimeout - offset;
        //     select_timeout = msg.roomInfo.colorTimeout - offset;
        //     base_timeout = msg.roomInfo.baseTimeout - offset;
        //     chupai_timeout = msg.roomInfo.timeout - offset;
        // }
        switch ( msg.roomInfo.curOp.opType ){
            case 1: //叫分
                player_cur_op.calling(msg.roomInfo.curOp.scoreListList, call_timeout);
                break;
            case 2: //选主牌
                player_cur_op.colorSelecting(select_timeout);
                break;
            case 3: //扣底牌
                player_cur_op.kouing(base_timeout);
                break;
            case 4: //出牌
                player_cur_op.pokerSending(chupai_timeout);
                break;
        }

        if (cc.director.getScene().name != "sdy_jbc") {
            // const loadCellList = [];
            // loadCellList.push(new cc.dd.ResLoadCell("gameyj_ddz/bsc/atlas/ddz_poker", cc.SpriteAtlas));
            cc.dd.SceneManager.replaceScene("sdy_jbc");
        }
        else {
            //断线重连,或匹配成功
            RoomED.notifyEvent(RoomEvent.SDY_ROOM_EVENT_RECONNECT);
        }
    },

    /**
     * 叫分
     * @param msg
     */
    on_msg_sdy_call_score_ret: function (msg) {
        if(msg.retCode == 0){
            var player_called = PlayerMgr.Instance().getPlayer(msg.userId);
            if( player_called == null ){
                cc.error('服务器 叫分玩家id=',msg.userId,'错误!');
                return;
            }
            player_called.called(msg.score);
            if(player_called.call_score == 0){
                AudioManager.playSound( SdyAudioCfg[player_called.sex].SCORE_0 );
            }else if(player_called.call_score == 60){
                AudioManager.playSound( SdyAudioCfg[player_called.sex].SCORE_60 );
            }else if(player_called.call_score == 65){
                AudioManager.playSound( SdyAudioCfg[player_called.sex].SCORE_65 );
            }else if(player_called.call_score == 70){
                AudioManager.playSound( SdyAudioCfg[player_called.sex].SCORE_70 );
            }
            if( msg.state == 1){    //叫分阶段
                var player_calling = PlayerMgr.Instance().getPlayer(msg.nextUserId);
                if( player_calling == null ){
                    cc.error('服务器 下次叫分玩家id=',msg.nextUserId,'错误!');
                    return;
                }
                player_calling.calling(msg.scoreListList, msg.callScoreTimeout);
            }else if ( msg.state == 2 ){    //叫分结束,出现庄家
                var player_banker = PlayerMgr.Instance().getPlayer(msg.bankerId);
                if( player_banker == null ){
                    cc.error('服务器 庄家玩家id=',msg.bankerId,'错误!');
                    return;
                }
                player_banker.becomeBanker();
                player_banker.colorSelecting(RoomData.Instance().color_timeout);
                RoomData.Instance().callScoreEnd(player_banker.call_score);
            }else if( msg.state == 3 ){     //叫分结束,无庄家
                //无需处理,等待重新发牌
            }
        }else{
            switch (msg.retCode){
                case 1:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.JIAOFEN_ERR_1 );
                    break;
                case 2:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.JIAOFEN_ERR_2 );
                    break;
                default:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.UNKNOW_ERR );
                    break;
            }
        }
    },

    /**
     * 发底牌
     * @param msg
     */
    on_msg_sdy_deal_bottom: function (msg) {
        RoomData.Instance().dealBottomPokers(msg.pokersList);
        var player_recv_bottom_pokers = PlayerMgr.Instance().getPlayer(msg.userId);
        if( player_recv_bottom_pokers == null ){
            cc.error('服务器 收底牌的玩家id=',msg.userId,'错误!');
            return;
        }
        player_recv_bottom_pokers.dealBottomPokers(msg.pokersList);
    },

    /**
     * 重新发牌
     * @param msg
     */
    on_msg_sdy_deal: function (msg) {
        RoomED.notifyEvent(RoomEvent.SDY_ROOM_EVENT_CHONGXINFAPAI, null);
        PlayerMgr.Instance().playerList.forEach(function (player) {
            player.dealHandPokers(msg.pokersList);
        });
        var player_calling = PlayerMgr.Instance().getPlayer(msg.callScoreUserId);
        if( player_calling == null ){
            cc.error('服务器 重新发牌的叫分玩家id=',msg.callScoreUserId,'错误!');
            return;
        }
        player_calling.calling(msg.scoreListList, RoomData.Instance().call_score_timeout);
    },

    /**
     * 选主牌
     * @param msg
     */
    on_msg_sdy_choice_color_ret: function (msg) {
        if( msg.retCode == 0 ){
            RoomData.Instance().keyColorSelected(msg.color);
            UserPlayer.Instance().colorSelected(msg.color);

            var player_banker = PlayerMgr.Instance().getBanker();
            if( player_banker == null ){
                cc.error('找不到庄家扣底牌');
                return;
            }
            player_banker.kouing(RoomData.Instance().base_timeout);

            if(msg.color == 1){
                AudioManager.playSound( SdyAudioCfg[player_banker.sex].ZHU_FANGPIAN );
            }else if(msg.color == 2){
                AudioManager.playSound( SdyAudioCfg[player_banker.sex].ZHU_MEIHUA );
            }else if(msg.color == 3){
                AudioManager.playSound( SdyAudioCfg[player_banker.sex].ZHU_HEITAO );
            }else if(msg.color == 4){
                AudioManager.playSound( SdyAudioCfg[player_banker.sex].ZHU_HONGTAO );
            }
        }else{
            switch (msg.retCode){
                case 1:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.SELECT_COLOR_ERR_1 );
                    break;
                case 2:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.SELECT_COLOR_ERR_2 );
                    break;
                default:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.UNKNOW_ERR );
                    break;
            }
        }
    },

    /**
     * 扣底牌
     * @param msg
     */
    on_msg_sdy_kou_pokers_ret: function (msg) {
        if( msg.retCode == 0 ){
            var player_kou_bottom_pokers = PlayerMgr.Instance().getPlayer(msg.userId);
            if( player_kou_bottom_pokers == null ){
                cc.error('服务器 扣底牌的玩家id=',msg.callScoreUserId,'错误!');
                return;
            }
            player_kou_bottom_pokers.kouedBottomPokers(msg.pokersList);
            player_kou_bottom_pokers.pokerSending(RoomData.Instance().timeout);
        }else{
            switch (msg.retCode){
                case 1:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.KOU_ERR_1 );
                    break;
                case 2:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.KOU_ERR_2 );
                    break;
                case 3:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.KOU_ERR_3 );
                    break;
                default:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.UNKNOW_ERR );
                    break;
            }
        }
    },

    /**
     * 出牌
     * @param msg
     */
    on_msg_sdy_user_poker_ret: function (msg) {
        if( msg.retCode == 0 ){
            var player_poker_sended = PlayerMgr.Instance().getPlayer(msg.userId);
            if( player_poker_sended == null ){
                cc.error('服务器 出牌的玩家id=',msg.userId,'错误!');
                return;
            }
            player_poker_sended.pokerSended(msg.poker);
            RoomData.Instance().circle_color = msg.color;

            var value = parseInt(msg.poker%100);
            var color = parseInt(msg.poker/100);

            var wave_pokers = [];
            wave_pokers.push(msg.poker);
            var lastPlayer = PlayerMgr.Instance().getLastPlayer(player_poker_sended.view_idx);
            while(true){
                if( cc.dd._.isUndefined(lastPlayer.cur_send_poker) || cc.dd._.isNull(lastPlayer.cur_send_poker) || lastPlayer.cur_send_poker==0 ){
                    break;
                }
                if(wave_pokers.length == 4){
                    break;
                }
                wave_pokers.push(lastPlayer.cur_send_poker);
                lastPlayer = PlayerMgr.Instance().getLastPlayer(lastPlayer.view_idx);
            }
            cc.log('本轮出牌:')
            cc.log(wave_pokers);

            if(msg.poker == 601){
                AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].XIAOWANG );
            }else if(msg.poker == 602){
                AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].DAWANG );
            }else if(wave_pokers.length == 1){
                //每轮,首家出牌
                if(value==15){
                    if(color == RoomData.Instance().key_poker){
                        AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].ZHU_2 );
                    }else{
                        AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].CARD_2 );
                    }
                }else if(RoomData.Instance().isKeyPoker(msg.poker)){
                    AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].DIAOZHU );
                }else if(value == 5){
                    AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].CARD_SCORE_5 );
                }else if(value == 10 || value == 13){
                    AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].CARD_SCORE_10 );
                }else{
                    if(color == 1){
                        AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].FANGPIAN );
                    }else if(color == 2){
                        AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].MEIHUA );
                    }else if(color == 3){
                        AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].HEITAO );
                    }else if(color == 4){
                        AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].HONGTAO );
                    }
                }
            }else{
                //每轮,非首家出牌
                var isMax = true;
                var wave_exist_key = false;
                for(var i=1; i<wave_pokers.length; ++i){
                    if(RoomData.Instance().isKeyPoker(wave_pokers[i])){
                        wave_exist_key = true;
                    }
                    if(RoomData.Instance().sendPokerCompare(msg.poker, wave_pokers[i])>0){
                        isMax = false;
                    }
                }
                if(!wave_exist_key && RoomData.Instance().isKeyPoker(msg.poker)){
                    AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].ZHU_SHA );
                }else if(isMax){
                    AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].GUANSHANG );
                }else if(value == 5){
                    AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].CARD_SCORE_5 );
                }else if(value == 10 || value == 13){
                    AudioManager.playSound( SdyAudioCfg[player_poker_sended.sex].CARD_SCORE_10 );
                }else{
                    AudioManager.playSound( SdyAudioCfg[2].GENPAI );
                }
            }

            RoomData.Instance().checkWaveEnd();

            if(msg.nextUserId == 0){
                cc.log('打牌结束')
                return;
            }
            var player_poker_sending = PlayerMgr.Instance().getPlayer(msg.nextUserId);
            if( player_poker_sending == null ){
                cc.error('服务器 下一个出牌的玩家id=',msg.nextUserId,'错误!');
                return;
            }
            player_poker_sending.pokerSending(RoomData.Instance().timeout);
        }else{
            switch (msg.retCode){
                case 1:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.CHUPAI_ERR_1 );
                    break;
                case 2:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.CHUPAI_ERR_2 );
                    break;
                case 3:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.CHUPAI_ERR_3 );
                    break;
                default:
                    cc.dd.PromptBoxUtil.show( SdyTextCfg.UNKNOW_ERR );
                    break;
            }
        }
    },

    /**
     * 闲家得分
     * @param msg
     */
    on_msg_sdy_score_pokers: function (msg) {
        RoomData.Instance().getScore(msg);
    },

    /**
     * 托管
     * @param msg
     */
    on_msg_sdy_auto_ret: function (msg) {
        var player_auto = PlayerMgr.Instance().getPlayer(msg.userId);
        if( player_auto == null ){
            cc.error('服务器 托管的玩家id=',msg.userId,'错误!');
            return;
        }
        player_auto.setAuto(msg.type == 1); //1:托管 2:取消托管
    },

    /**
     * 结算
     * @param msg
     */
    on_msg_sdy_result: function (msg) {
        msg.resultInfoList.forEach(function (info) {
            var player = PlayerMgr.Instance().getPlayer(info.userId);
            if(player){
                player.coin += info.score; //计算玩家结算后的金币 todo ui显示
            }else{
                cc.error('结算找不到玩家数据 id=',info.userId);
            }
        }.bind(this));

        cc.dd.UIMgr.openUI('gameyj_sdy/jbc/prefab/sdy_jiesuan', function (ui) {
            var sdy_jiesuan = ui.getComponent('sdy_jiesuan');
            if(sdy_jiesuan){
                sdy_jiesuan.setInfo(msg);
            }
            // var jiesuan_mask = cc.find('Canvas/jiesuan_mask');
            // if(jiesuan_mask){
            //     jiesuan_mask.active = true;
            // }
        });
    },

    on_msg_sdy_dissolve_ret: function (msg) {
        var player = PlayerMgr.Instance().getPlayer(msg.userId);
        if( player == null ){
            cc.error('服务器 申请解散的玩家id=',msg.userId,'错误!');
            return;
        }
        player.setAgree(3);

        RoomData.Instance().setJieSanTime(60);

        cc.dd.UIMgr.openUI('gameyj_sdy/pyc/prefab/sdy_jiesan');
    },

    on_msg_sdy_vote_dissolve_ret: function (msg) {
        var player = PlayerMgr.Instance().getPlayer(msg.userId);
        if( player == null ){
            cc.error('服务器 解散的玩家id=',msg.userId,'错误!');
            return;
        }
        player.setAgree(msg.agree?1:2);

        cc.dd.UIMgr.openUI('gameyj_sdy/pyc/prefab/sdy_jiesan');
    },

};

module.exports = handler;