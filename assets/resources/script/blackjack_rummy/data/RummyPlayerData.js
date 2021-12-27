let RummyPlayerEvent = cc.Enum({
    PLAYER_ENTER: "PLAYER_ENTER",
    PLAYER_EXIT: "PLAYER_EXIT",
    PLAYER_RESET_CD: "PLAYER_RESET_CD",
    PLAYER_STOP_CD: "PLAYER_STOP_CD",
    GIVE_UP_POKER: "GIVE_UP_POKER",
    DEAL_POKER: "DEAL_POKER",
    FA_PAI: "FA_PAI",
    MO_PAI: "MO_PAI",
    UPDATE_POKER: "UPDATE_POKER",
    UPDATE_BAIDA: "UPDATE_BAIDA",
    SET_PAI_TOUCH: "SET_PAI_TOUCH",
    CHECK_CAN_MOPAI: "CHECK_CAN_MOPAI",
    SHOW_CARD: "SHOW_CARD",
    SHOW_INVALIDSHOW: "SHOW_INVALIDSHOW",
    LOSE_GAME: "LOSE_GAME",
    LOST_COIN: "LOST_COIN",
    WIN_COIN: "WIN_COIN",
    GIVE_TIPS: "GIVE_TIPS",
});

let RummyPlayerED = new cc.dd.EventDispatcher();

let RummyPlayerData = cc.Class({
    ctor(){
        this.userId =0;
        this.playerName ='';
        this.sex =0;
        this.headUrl ='';
        this.openId =0;

        this.seat =0;
        this.state ='';
        this.coin =0;

        this.netState =0;
        this.score =0;

        this.level =0;
        this.exp =0;
        this.vipLevel =0;

        this.viewIdx =0;

        this.playerData = null;

        this.pokersList = [];
        this.handsList = [];
        this.userState = 0;
        this.dropCoin = 0;

        this.isBanker = false;

        this.hasLostCoin = false;
    },

    checkCanMoPai(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.CHECK_CAN_MOPAI, [this]);
    },

    dealPoker(type, cardList){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.DEAL_POKER, [this, type, cardList]);
    },

    faPai(data){
        this.pokersList = [];
        data.cardsList.forEach(list=>{
            this.pokersList.push(list.cardsList);
        });
        this.handsList = [].concat(...this.pokersList);
        RummyPlayerED.notifyEvent(RummyPlayerEvent.FA_PAI, [this, data.handCardsList]);
    },

    giveTips(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.GIVE_TIPS, [this]);
    },

    giveUpPoker(card){
        let playerHasCard = false;
        for(let i = this.pokersList.length - 1; i >= 0; i--){
            let group = this.pokersList[i];
            let index = group.indexOf(card);
            if(index != -1){
                group.splice(index, 1);
                playerHasCard = true;

                if(group.length === 0){
                    this.pokersList.splice(i, 1);
                }
                break;
            }
        }

        let index = this.handsList.indexOf(card);
        if(index != -1){
            this.handsList.splice(index, 1);
        }
        RummyPlayerED.notifyEvent(RummyPlayerEvent.GIVE_UP_POKER, [this, card, playerHasCard]);

        if(!playerHasCard && this.pokersList.length > 0 && this.userId === cc.dd.user.id){
            var msg = new cc.pb.rummy.msg_rm_group_req();
            msg.setGroupsList(this.pokersList);
            cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_group_req, msg, "msg_rm_group_req", true);
        }
    },

    init(data){
        this.userId = data.userId;
        this.playerName = data.name;
        this.sex = data.sex;
        this.headUrl = data.headUrl;
        this.openId = data.openId;

        this.seat = data.seat;
        this.state = data.state;

        this.netState = data.netState;
        this.score = data.score;

        this.level = data.level;
        this.exp = data.exp;
        this.vipLevel = data.vipLevel;

        this.viewIdx = data.seat;

        this.playerData = data;

        this.hasLostCoin = false;
    },

    lostCoin(coin){
        if(!this.hasLostCoin){
            this.hasLostCoin = true;
            RummyPlayerED.notifyEvent(RummyPlayerEvent.LOST_COIN, [this, coin]);
        }
    },

    loseGame(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.LOSE_GAME, [this]);
    },

    moPai(type, data){
        //降维打击
        // let myList = [].concat(...this.pokersList);
        // let newList = [].concat(...cardList);
        //
        // //找不同
        // let paiList = myList.concat(data.handCardsList).filter(function(v, i, arr) {
        //     return arr.indexOf(v) === arr.lastIndexOf(v);
        // });
        this.handsList.push(data.card);
        this.handsList.sort(function (x, y) {
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });

        data.handCardsList.sort(function (x, y) {
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });

        if(this.handsList.toString() !== data.handCardsList.toString()){
            cc.error('手牌不正确，重置手牌');
            this.pokersList = [];
            data.cardsList.forEach(list=>{
                this.pokersList.push(list.cardsList);
            });
            this.handsList = data.handCardsList;
            RummyPlayerED.notifyEvent(RummyPlayerEvent.UPDATE_POKER, [this]);
            return;
        }

        RummyPlayerED.notifyEvent(RummyPlayerEvent.MO_PAI, [this, type, data.card]);
    },

    playerEnter(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.PLAYER_ENTER, [this]);
    },

    playerExit(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.PLAYER_EXIT, [this]);

    },

    resetCD(cd){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.PLAYER_RESET_CD, [this, cd]);
    },

    setReady(ready){

    },

    setPaiTouch(enable){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.SET_PAI_TOUCH, [this, enable]);
    },

    showCard(cardID){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.SHOW_CARD, [this, cardID]);
    },

    stopCD(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.PLAYER_STOP_CD, [this]);
    },

    showInvalidShow(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.SHOW_INVALIDSHOW, [this]);
    },

    updatePoker(pokersList){
        if(pokersList){
            this.pokersList = [];
            pokersList.forEach(list=>{
                this.pokersList.push(list.cardsList);
            });
            this.handsList = [].concat(...this.pokersList);
        }
        RummyPlayerED.notifyEvent(RummyPlayerEvent.UPDATE_POKER, [this]);
    },

    updateBaida(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.UPDATE_BAIDA, [this]);
    },

    updateCoin(allCoin){
        this.score = allCoin;
    },

    winCoin(coin){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.WIN_COIN, [this, coin]);
    }
});

module.exports = {
    RummyPlayerEvent: RummyPlayerEvent,
    RummyPlayerED: RummyPlayerED,
    RummyPlayerData: RummyPlayerData,
};