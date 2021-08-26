cc.Class({
    extends: cc.Component,

    properties: {
        time: cc.Label,
        score: cc.Label,
    },

    initPlayerInfo(info) {
        this.time.string = new Date(info.drawTime*1000).format("yyyy/MM/dd hh:mm");
        this.score.string = info.drawScore;
    },
});
