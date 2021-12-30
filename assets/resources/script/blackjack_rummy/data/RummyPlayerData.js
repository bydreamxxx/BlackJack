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
    SET_ON_LINE: "SET_ON_LINE",
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
        this.setCards(data.handCardsList)
        RummyPlayerED.notifyEvent(RummyPlayerEvent.FA_PAI, [this, data.handCardsList]);
    },

    giveTips(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.GIVE_TIPS, [this]);
    },

    giveUpPoker(card, idx){
        let playerHasCard = false;
        if(cc.dd._.isNumber(idx) && idx !== -1){
            let group = this.pokersList[idx];
            if(group){
                let index = group.indexOf(card);
                if(index != -1){
                    group.splice(index, 1);
                    playerHasCard = true;

                    if(group.length === 0){
                        this.pokersList.splice(idx, 1);
                    }
                }
            }
        }else{
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
        }

        let index = this.handsList.indexOf(card);
        if(index != -1){
            this.handsList.splice(index, 1);
        }
        RummyPlayerED.notifyEvent(RummyPlayerEvent.GIVE_UP_POKER, [this, card, playerHasCard]);

        this.saveGroups();
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

    moPai(data){
        //降维打击
        // let myList = [].concat(...this.pokersList);
        // let newList = [].concat(...cardList);
        //
        // //找不同
        // let paiList = myList.concat(data.handCardsList).filter(function(v, i, arr) {
        //     return arr.indexOf(v) === arr.lastIndexOf(v);
        // });
        this.handsList.push(data.card);
        this.handsList.sort(this.sortFunc.bind(this));

        data.handCardsList.sort(this.sortFunc.bind(this));

        if(this.handsList.toString() !== data.handCardsList.toString()){
            cc.error('手牌不正确，重置手牌');
            this.setCards(data.handCardsList)
            RummyPlayerED.notifyEvent(RummyPlayerEvent.UPDATE_POKER, [this]);
            return;
        }
        this.checkCanMoPai();
        RummyPlayerED.notifyEvent(RummyPlayerEvent.MO_PAI, [this, data.type, data.card]);
    },

    playerEnter(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.PLAYER_ENTER, [this]);
    },

    playerExit(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.PLAYER_EXIT, [this]);

    },

    // playerGiveUpPoker(groupIdx, cardId){
    //     this.pokersList_bak = this.pokersList.concat();
    //     this.handsList_bak = this.handsList.concat();
    //
    //     let group = this.pokersList[groupIdx];
    //     if(group){
    //         let index = group.indexOf(cardId);
    //         if(index != -1){
    //             group.splice(index, 1);
    //
    //             if(group.length === 0){
    //                 this.pokersList.splice(groupIdx, 1);
    //             }
    //         }
    //     }
    //
    //     let index = this.handsList.indexOf(cardId);
    //     if(index != -1){
    //         this.handsList.splice(index, 1);
    //     }
    //
    //     this.saveGroups();
    // },

    resetCD(cd){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.PLAYER_RESET_CD, [this, cd]);
    },

    // resetGroup(){
    //     if(this.pokersList_bak){
    //         this.pokersList = this.pokersList_bak.concat();
    //     }
    //     if(this.handsList_bak){
    //         this.handsList = this.handsList_bak.concat();
    //     }
    //     this.pokersList_bak = null;
    //     this.handsList_bak = null;
    //
    //     this.updatePoker();
    // },

    saveGroups(){
        if(this.handsList && this.handsList.length === 13 && this.userId === cc.dd.user.id){
            cc.sys.localStorage.setItem(`RUMMY_GROUP${cc.dd.user.id}`, JSON.stringify(this.pokersList));
        }
    },

    setCards(handList){
        this.handsList = handList.concat();

        this.pokersList = [];

        let noNeedInit = false;
        if(this.userId === cc.dd.user.id){
            let pokersList = JSON.parse(cc.sys.localStorage.getItem(`RUMMY_GROUP${cc.dd.user.id}`));
            if(pokersList){
                let tempList = [].concat(...pokersList).sort(this.sortFunc.bind(this)).toString();
                let handsList = handList.sort(this.sortFunc.bind(this)).toString();
                if(tempList === handsList){
                    this.pokersList = pokersList;
                    noNeedInit = true;
                }
            }
        }

        if(!noNeedInit){
            let templist = handList;
            let cardlist = [];
            for(let i = 0; i < 4; i++){
                cardlist.push([]);
            }

            templist.forEach(card=>{
                if(card === 172){
                    cardlist[3].push(card);
                }else{
                    let color = card % 10;
                    cardlist[color - 1].push(card);
                }
            });

            for(let i = 3; i >= 0; i--){
                if(cardlist[i].length === 0){
                    cardlist.splice(i, 1);
                }
            }

            this.pokersList = cardlist.concat();
        }

        // this.pokersList_bak = null;
        // this.handsList_bak = null;

        this.saveGroups();
    },

    setReady(ready){

    },

    setPaiTouch(enable){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.SET_PAI_TOUCH, [this, enable]);
    },


    setOnLine(online){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.SET_ON_LINE, [this, online]);
    },

    showCard(cardID, idx){
        let playerHasCard = false;
        if(cc.dd._.isNumber(idx) && idx !== -1){
            let group = this.pokersList[idx];
            if(group){
                let index = group.indexOf(cardID);
                if(index != -1){
                    group.splice(index, 1);
                    playerHasCard = true;

                    if(group.length === 0){
                        this.pokersList.splice(idx, 1);
                    }
                }
            }
        }else{
            for(let i = this.pokersList.length - 1; i >= 0; i--){
                let group = this.pokersList[i];
                let index = group.indexOf(cardID);
                if(index != -1){
                    group.splice(index, 1);
                    playerHasCard = true;

                    if(group.length === 0){
                        this.pokersList.splice(i, 1);
                    }
                    break;
                }
            }
        }

        let index = this.handsList.indexOf(cardID);
        if(index != -1){
            this.handsList.splice(index, 1);
        }
        RummyPlayerED.notifyEvent(RummyPlayerEvent.SHOW_CARD, [this, cardID, playerHasCard]);

        this.saveGroups();
    },

    sortFunc(x, y) {
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    },

    stopCD(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.PLAYER_STOP_CD, [this]);
    },

    showInvalidShow(){
        RummyPlayerED.notifyEvent(RummyPlayerEvent.SHOW_INVALIDSHOW, [this]);
    },

    updatePoker(pokersList){
        // if(pokersList){
        //     this.pokersList = [];
        //     pokersList.forEach(list=>{
        //         this.pokersList.push(list.cardsList);
        //     });
        //     this.handsList = [].concat(...this.pokersList);
        // }
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