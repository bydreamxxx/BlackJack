const RummyED = require("RummyData").RummyED;
const RummyEvent = require("RummyData").RummyEvent;
const RoomMgr = require('jlmj_room_mgr').RoomMgr;
const RummyData = require("RummyData").RummyData.Instance();

let RummyGameMgr = cc.Class({
    s_data: null,
    statics: {
        Instance() {
            if (!this.s_data) {
                this.s_data = new RummyGameMgr();
            }
            return this.s_data;
        },

        Destroy() {
            if (this.s_data) {
                this.s_data = null;
            }
        }
    },

    actionChange(msg){
        RoomMgr.Instance().player_mgr.playerList.forEach(player=>{
            if(player){
                player.stopCD();
            }
        })
        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.userId);
        if(player){
            player.resetCD();
            player.checkCanMoPai();
        }
        RummyED.notifyEvent(RummyEvent.PLAYER_TURN);
        RummyED.notifyEvent(RummyEvent.CHECK_BUTTON);
    },

    changeState(){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(player){
            player.setPaiTouch(RummyData.state === 2 || RummyData.state === 3)
        }

        RummyED.notifyEvent(RummyEvent.UPDATE_STATE);
    },

    commit(msg){
        if(msg.uid === cc.dd.user.id){
            RummyED.notifyEvent(RummyEvent.PLAYER_COMMIT);
        }

        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.uid);
        if(player) {
            player.lostCoin(msg.coin);
            RummyData.dropScores += Math.abs(msg.coin);

            RummyED.notifyEvent(RummyEvent.PLAYER_LOST, [player.playerName, msg.coin]);
        }
    },

    dealPoker(msg){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.userId);
        if(player){
            player.stopCD();
            player.resetCD();
            player.dealPoker(msg.type, msg.cardList);
        }
    },

    faPai(msg){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.userId);
        if(player){
            if(RummyData.state === 1){
                player.faPai(msg);
            }else{
                player.stopCD();
                player.resetCD();
                player.moPai(msg);
            }
        }

        RummyED.notifyEvent(RummyEvent.CHECK_BUTTON);
    },

    gameResult(msg){
        // RummyData.clearGameInfo();
        msg.resultsList.forEach(result=>{
            if(result.isdrop === 1){
                let player = RoomMgr.Instance().player_mgr.getPlayerById(result.userId);
                if(player){
                    player.updateCoin(result.allCoin);
                    if(result.coin > 0){
                        player.winCoin(result.coin);
                    }else{
                        player.lostCoin(result.coin);
                        if(!player.hasLostCoin){
                            RummyData.dropScores += Math.abs(result.coin);
                        }
                    }
                }
            }
        })
        RummyED.notifyEvent(RummyEvent.SHOW_RESULT, msg);
    },

    giveTips(msg){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.userId);
        if(player){
            player.giveTips();
        }
        RummyED.notifyEvent(RummyEvent.GIVE_TIPS, msg);
    },

    giveUpPoker(msg){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.userId);
        if(player){
            player.giveUpPoker(msg.card, msg.groupId);
        }
    },

    loseGame(userId){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(userId);
        if(player){
            player.loseGame();
            RummyData.dropScores += Math.abs(player.dropCoin);
        }
        if(userId === cc.dd.user.id){
            RummyED.notifyEvent(RummyEvent.LOSE_GAME);
        }
    },

    resetGroup(){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(player){
            player.resetGroup();
        }
    },

    showCard(msg){
        RummyData.selfWin = msg.uid === cc.dd.user.id;

        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.uid);
        if(player){
            player.showCard(msg.showCard, msg.groupId);
            RummyED.notifyEvent(RummyEvent.PLAYER_WIN, player.playerName);
        }
    },

    showInvalidShow(){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(player){
            player.showInvalidShow();
        }
    },

    synGiveupPoker(msg){
        RummyData.xcard = msg.xcard;
        RummyData.giveUp = msg.giveupCard;
        // RummyED.notifyEvent(RummyEvent.SYN_DESK);
    },

    updateUI(){
        if(cc.dd.SceneManager.isGameSceneExit(cc.dd.Define.GameType.RUMMY)){
            let player = RoomMgr.Instance().player_mgr.getPlayerById(RummyData.turn);
            if(player){
                player.resetCD(RummyData.turnLeftTime);
            }
            RummyED.notifyEvent(RummyEvent.UPDATE_UI);
        }else{
            this.needUpdateUI = true;
        }
    },

    updatePoker(groupList){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(player){
            player.updatePoker(groupList);
        }
        RummyED.notifyEvent(RummyEvent.SYN_DESK);
    },

    updateBaida(){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(player){
            player.updateBaida();
        }
    },

    updateDropCoin(score){
        RoomMgr.Instance().player_mgr.playerList.forEach(player=>{
            if(player){
                player.dropCoin = score;
            }
        });
        RummyED.notifyEvent(RummyEvent.UPDATE_DROP_COIN);
    }
});

module.exports = RummyGameMgr.Instance();