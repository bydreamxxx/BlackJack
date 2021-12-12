const GROUP_STATE = require("RummyData").GROUP_STATE;

let RumyGroup = cc.Class({
    ctor(){
        this.cardList = [];
        this.state = GROUP_STATE.NO_GROUP;
    },

    add(card){
        this.cardsList.add(card);
        this.checkState();
    },

    checkState(){

    },

    init(cardList){
        this.cardsList = cardList.sort().concat();
        this.checkState();
    },
});

module.exports = RumyGroup;