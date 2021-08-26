cc.Class({
    extends: cc.Component,

    properties: {
        headNode: cc.Node,
        playername: cc.Label,
        id: cc.Label,
        score: cc.Label,
        room: cc.Label,
        bigwin: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    initPlayerInfo: function(player){
        this.playername.string = cc.dd.Utils.subChineseStr(player.userName, 0 , 14);
        this.headNode.getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl);
        this.id.string = player.userId;
        this.score.string = player.dayScore;
        this.room.string = player.dayRoomNum;
        this.bigwin.string = player.dayBigWinnerNum;
        this.userID = player.userId;
    },

    setBtnCallBack(callBack){
        this.callBack = callBack;
    },

    onClickButton(){
        if(this.callBack){
            this.callBack(this.userID);
        }
    }
});
