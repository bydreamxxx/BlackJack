// create by wj

const RecordEd = require('AudioChat').RecordEd;
var replay_data = require('com_blackjack_replay_data').REPLAY_DATA;
var REPLAY_ED = require('com_blackjack_replay_data').REPLAY_ED;
var REPLAY_EVENT = require('com_blackjack_replay_data').REPLAY_EVENT;
const seatCfg = require("texas_seat_cfg");
const ddz_proto_id = require('c_msg_doudizhu_cmd');
const proto_id = require('c_msg_texas_cmd');
const replayProto = {
    initPlayer: 'cmd_record_room_info',             //初始化玩家
    banker: 'cmd_msg_texas_banker_notify',            //庄家，大/小盲确定
    poker: 'cmd_msg_texas_player_poker_notify',         //玩家手牌
    commonPoker: 'cmd_msg_texas_common_poker_notify',    //公牌数据
    opbet: 'cmd_msg_texas_bet_notify',                     //玩家下注
    nextPlayer: 'cmd_msg_texas_operate_player_notify',         //下一个操作玩家
    result: 'cmd_msg_texas_results_notify',                   //结算
    otherPoker:'cmd_msg_texas_other_player_poker_notify',    //其余玩家牌型
    playerList:'cmd_texas_player_list',                     //玩家列表
};

cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerHeadVec:[],
        m_nStageIndex: 0,
        m_nplayerIndex: 0,
        m_nTotalPlayerCount: 0,
        m_oOpInfoNode: cc.Node,
        m_oResultInfoNode: cc.Node,
        m_oPlayerInfoNode: cc.Node,
        m_oOpInfoScorllView:{default:[], type:cc.Node},
        m_oPlayerInfoScorllView:cc.Node,
        m_oWinnerInfoScorllView:cc.Node,
        m_oCommonPokerVec:{default:[], type:cc.Sprite},
        pokerAtlas: cc.SpriteAtlas,         //牌图集
        m_nCardIndex: 0,
        m_otimeLabel: cc.Label,
        m_oTotalBetVec:{default:[], type:cc.Label},
        m_nTotalBet : 0,
    },

    onLoad () {
        var data = replay_data.Instance().getMsgList();
        this._replayData = this.filterMsgList(data);
        this.initPlayerData(data)
        this.decodeMsgInfo()
    },

    //初始化玩家信息
    initPlayerData: function (data) {
        var initMsg = this.getMsgByProto(replayProto.initPlayer);
        for (var i = 0; i < initMsg.playerInfoList.length; i++) {
            var player = initMsg.playerInfoList[i];
            if (player ) {
                player.type = 0;
                this.m_tPlayerHeadVec.push(player)
            }
        }
        this.m_otimeLabel.string = this.timestampToTime(initMsg.deskInfo.startTimestamp)
    },

    ////获取玩家的信息
    getPlayerInfoByUserId(userId){
        for (var i = 0; i < this.m_tPlayerHeadVec.length; i++) {
            var player = this.m_tPlayerHeadVec[i];
            if (player && player.userId == userId) {
                return player
            }
        }
        return null
    },

    ///设置庄家/大/小盲类型
    setPlayerBanker_Small_Big_Bind_Type(msg){
        //庄家
        if(msg.content.bankerId){
            var banker = this.getPlayerInfoByUserId(msg.content.bankerId)
            if(banker){
                banker.type = 1
                this.m_nplayerIndex +=1 
            }
        }

        //小盲
        if(msg.content.smallBlindId){
            var small = this.getPlayerInfoByUserId(msg.content.smallBlindId)
            if(small && small.type == 0){
                small.type = 3
                this.m_nplayerIndex +=1 
            }
        }

        //大盲
        if(msg.content.bigBlindId){
            var big = this.getPlayerInfoByUserId(msg.content.bigBlindId)
            if(big && big.type == 0){
                big.type = 2
                this.m_nplayerIndex +=1 
            }
        }
    },

    //设置玩家座位类型
    updatePlayerSeatType(playerId){
        var player = this.getPlayerInfoByUserId(playerId)
        if(player.type == 0){
            player.type = seatCfg.texas_seat[this.m_nTotalPlayerCount][this.m_nplayerIndex];
            this.m_nplayerIndex += 1;
        }
    },
    //设置玩家操作信息
    showOpInfo(msg){
        var infoNode = cc.instantiate(this.m_oOpInfoNode)
        infoNode.active = true
        var playerInfo = this.getPlayerInfoByUserId(msg.content.playerId);
        var headNode = cc.find("playerHead", infoNode);
        if(headNode)
            headNode.getComponent("klb_hall_Player_Head").initHead(playerInfo.openId, playerInfo.headUrl);
        var poDescNode = cc.dd.Utils.seekNodeByName(infoNode, "poDesc")
        if(poDescNode)
            poDescNode.getComponent("LanguageLabel").setText(seatCfg.texas_seat_desc[playerInfo.type - 1])
        var opdescLabel = cc.dd.Utils.seekNodeByName(infoNode, "opdesc").getComponent("LanguageLabel");
        var betLabel = cc.dd.Utils.seekNodeByName(infoNode, "gold").getComponent(cc.Label);
        var foldLabel = cc.dd.Utils.seekNodeByName(infoNode, "flod").getComponent("LanguageLabel");
        this.m_oOpInfoScorllView[this.m_nStageIndex].addChild(infoNode)
        switch(msg.content.type){
            case 0: //大/小盲
                    if(playerInfo.type == 2 || playerInfo.type == 1) //大盲
                        opdescLabel.setText("BB");
                    else
                        opdescLabel.setText("SB");
                break;
            case 1://下注
                    opdescLabel.setText("call");
                break;
            case 2: //过
                    opdescLabel.setText("pass");
                break;
            case 3: //弃牌
                    opdescLabel.node.active = false;
                    betLabel.node.active = false;
                    foldLabel.node.active = true;
                break;
            case 4: //加注
                    opdescLabel.setText("jiazhu");
                break;
            case 5: //allin
                    opdescLabel.setText("allin");
                break;
        }
        betLabel.string = cc.dd.Utils.getNumToWordTransform(msg.content.bet)
        this.m_nTotalBet += msg.content.bet;
        if(this.m_nStageIndex != 0)
            this.m_oTotalBetVec[this.m_nStageIndex - 1].string = cc.dd.Utils.getNumToWordTransform(this.m_nTotalBet);
    },

    /**
     * 显示公牌数据
     */
    showCommonPoker(msg){
        for(var i =0; i < msg.content.pokerList.length; i++){
            var cardValue = msg.content.pokerList[i];
            this.setPoker(this.m_oCommonPokerVec[this.m_nCardIndex], cardValue);
            this.m_nCardIndex += 1;
        }
    },

    /**
     * 显示结果
     */
    showResultInfo(msg){
        for(var index = 0; index < msg.content.resultList.length; index++){
            var result = msg.content.resultList[index];
            var infoNode = cc.instantiate(this.m_oPlayerInfoNode)
            infoNode.active = true
            var playerInfo = this.getPlayerInfoByUserId(result.playerId);
            var headNode = cc.find("playerHead", infoNode);
            if(headNode)
                headNode.getComponent("klb_hall_Player_Head").initHead(playerInfo.openId, playerInfo.headUrl);
            var playername = cc.dd.Utils.seekNodeByName(infoNode, "playername")
            if(playername)
                playername.getComponent(cc.Label).string = playerInfo.nickName;
            for(var i = 0; i < result.pokerList.length; i++){
                var cardSprite = cc.dd.Utils.seekNodeByName(infoNode, "card_" + (i + 1)).getComponent(cc.Sprite);
                this.setPoker(cardSprite, result.pokerList[i])
            }
            this.m_oPlayerInfoScorllView.addChild(infoNode)

            if(result.win > 0){
                this.showWinner(playerInfo, result)
            }
        }
    },

    /**
     * 显示胜利者信息
     * @param {*} playerInfo 
     * @param {*} result 
     */
    showWinner(playerInfo, result){
        var infoNode = cc.instantiate(this.m_oResultInfoNode)
        infoNode.active = true
        var headNode = cc.find("playerHead", infoNode);
        if(headNode)
            headNode.getComponent("klb_hall_Player_Head").initHead(playerInfo.openId, playerInfo.headUrl);
        var poDescNode = cc.dd.Utils.seekNodeByName(infoNode, "poDesc")
        if(poDescNode)
            poDescNode.getComponent("LanguageLabel").setText(seatCfg.texas_seat_desc[playerInfo.type - 1])
        var betLabel = cc.dd.Utils.seekNodeByName(infoNode, "gold").getComponent(cc.Label);
        betLabel.string = cc.dd.Utils.getNumToWordTransform(result.win)
        for(var i = 0; i < result.realPokerList.length; i++){
            var cardSprite = cc.dd.Utils.seekNodeByName(infoNode, "card" + (i + 1)).getComponent(cc.Sprite);
            this.setPoker(cardSprite, result.realPokerList[i])
        }
        this.m_oWinnerInfoScorllView.addChild(infoNode)
    },

    /**
     * 设置poker显示
     * @param {*} sprite 
     * @param {*} cardValue 
     */

    setPoker(sprite, cardValue){
        switch(cardValue){
            case 141:
                cardValue = 11;
                break;
            case 142:
                cardValue = 12;
                break;
            case 143:
                cardValue = 13;
                break;            
            case 144:
                cardValue = 14;
                break;
        }    
        sprite.spriteFrame = this.pokerAtlas.getSpriteFrame(cardValue);
    },

    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDay()
        var hour = date.getHours();
        var min = date.getMinutes();
        return year+":" + month+":" + (day > 9 ? day : ("0" + day)) + ":" +(hour > 9 ? hour : ('0' + hour)) + ':' + (min > 9 ? min : ('0' + min));
    },

    onClose(){
        cc.dd.UIMgr.destroyUI(this.node);
    },
    //////////////////////////////////////////消息解析begin/////////////////////////////////
        /**
     * 消息过滤 保留需要用的消息
     * 保留replayProto中的消息
     * @param {*} msglist 
     */
    filterMsgList: function (msglist) {
        var list = [];
        var filterIds = [];
        for (var i in replayProto) {
            if (replayProto[i] == replayProto.initPlayer)
                filterIds.push(ddz_proto_id[replayProto[i]]);
            else
                filterIds.push(proto_id[replayProto[i]]);
        }
        for (var i = 0; i < msglist.length; i++) {
            if (filterIds.indexOf(msglist[i].id) != -1) {
                list.push(msglist[i]);
                if (msglist[i].id == proto_id[replayProto.result])
                    break;
            }
        }
        return list;
    },

    ///解析播放信息列表
    decodeMsgInfo(){
        for(var i = 0; i < this._replayData.length; i++){
            var msg = this._replayData[i];
            this.handlerMsg(msg);   //播放消息
        }
    },

    /**
     * 获取指定消息
     * @param {String} str 
     */
    getMsgByProto(str) {
        for (var i = 0; i < this._replayData.length; i++) {
            if (this._replayData[i].id == ddz_proto_id[str]) {
                return this._replayData[i].content;
            } else if (this._replayData[i].id == proto_id[str]) {
                return this._replayData[i].content;
            }
        }
        return null;
    },

    //播单步操作
    handlerMsg(msg) {
        var id = msg.id;
        switch (id) {
            case proto_id[replayProto.banker]://庄家/大/小盲
                this.setPlayerBanker_Small_Big_Bind_Type(msg);
                break;
            case proto_id[replayProto.playerList]://玩家列表
                this.m_nStageIndex = 1 //进入下注阶段
                this.m_nTotalPlayerCount = msg.content.playeridList.length;
                break;
            case proto_id[replayProto.commonPoker]://打开公牌
                this.m_nStageIndex += 1 //公牌展示位阶段间隔
                this.showCommonPoker(msg)
                break;
            case proto_id[replayProto.opbet]://下注消息
                if(this.m_nStageIndex == 1){
                    this.updatePlayerSeatType(msg.content.playerId)
                }
                this.showOpInfo(msg) //显示玩家操作数据
                break;
            case proto_id[replayProto.result]://结果
                this.showResultInfo(msg)
                break;
            case proto_id[replayProto.otherPoker]://其他玩家手牌
                break;
        }
    },
    //////////////////////////////////////////消息解析end/////////////////////////////////

});
