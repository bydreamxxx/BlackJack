let RummyPlayerEvent = cc.Enum({
    PLAYER_ENTER: "PLAYER_ENTER",
    PLAYER_EXIT: "PLAYER_EXIT",
    PLAYER_RESET_CD: "PLAYER_RESET_CD",
    GIVE_UP_POKER: "GIVE_UP_POKER",
    DEAL_POKER: "DEAL_POKER",
    FA_PAI: "FA_PAI",
    MO_PAI: "MO_PAI",
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
        this.userState = 0;
        this.dropCoin = 0;

        this.isBanker = false;
    },

    dealPoker(type, cardList){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.DEAL_POKER, [this, type, cardList]);
    },

    faPai(data){
        this.pokersList = data.cardsList.concat();

        RummyPlayerED.notifyEvent(RummyPlayerEvent.FA_PAI, [this]);
    },

    giveUpPoker(card){
        for(let i = 0; i < this.pokersList.length; i++){
            let group = this.pokersList[i];
            let index = group.indexOf(card);
            if(index != -1){
                group.splice(index, 1);
                break;
            }
        }
        RummyPlayerED.notifyEvent(RummyPlayerEvent.GIVE_UP_POKER, [this, card]);
    },

    init(data){
        this.userId = data.userId;
        this.playerName = data.name;
        this.sex = data.sex;
        this.headUrl = data.headUrl;
        this.openId = data.openId;

        this.seat = data.seat;
        this.state = data.state;
        this.coin = data.coin;

        this.netState = data.netState;
        this.score = data.score;

        this.level = data.level;
        this.exp = data.exp;
        this.vipLevel = data.vipLevel;

        this.viewIdx = data.seat;

        this.playerData = data;
    },

    moPai(type, data){
        this.pokersList.push([data.card]);

        //降维打击
        let myList = [].concat(...this.pokersList);
        // let newList = [].concat(...cardList);
        //
        // //找不同
        // let paiList = myList.concat(data.handCardsList).filter(function(v, i, arr) {
        //     return arr.indexOf(v) === arr.lastIndexOf(v);
        // });

        myList.sort(function (x, y) {
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

        if(myList.toString() !== data.handCardsList.toString()){
            cc.error('手牌不正确，重置手牌');
            this.pokersList = data.cardsList.concat();
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

    resetCD(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.PLAYER_RESET_CD, [this]);
    },

    setReady(ready){

    },

    updatePoker(pokersList){
        this.pokersList = pokersList.concat();
        RummyPlayerED.notifyEvent(RummyPlayerEvent.UPDATE_POKER, [this]);
    },

});

module.exports = {
    RummyPlayerEvent: RummyPlayerEvent,
    RummyPlayerED: RummyPlayerED,
    RummyPlayerData: RummyPlayerData,
};