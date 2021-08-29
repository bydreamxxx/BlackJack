var com_replay_data = require('com_replay_data').REPLAY_DATA;
cc.Class({
    extends: cc.Component,

    properties: {
        bgSpriteFrame: cc.SpriteFrame,
        numLbl: cc.Label,
        timeLbl: cc.Label,
        scoreList: [cc.Label],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    setData(itemData, historyId, gameType, userList) {
        this.historyId = historyId;
        this.gameType = gameType;
        this.round = itemData.round;
        this._itemData = itemData;
        this.numLbl.string = itemData.round + '';
        this.timeLbl.string = this.timestampToTime(itemData.timestamp);
        if (this.round % 2 == 0) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.bgSpriteFrame;
        }
        for (var i = 0; i < userList.length; i++) {
            var data = itemData.scoresList.find((e) => { return e.userId == userList[i].userId });
            if (data && data.score != null) {
                this.scoreList[i].string = data.score > 0 ? ('+' + data.score) : data.score.toString();
                this.scoreList[i].node.active = true;
            }
        }
    },

    shareBtn() {
        var round = this.round > 99 ? this.round.toString() : (this.round > 9 ? '0' + this.round.toString() : '00' + this.round.toString());
        var record = this.historyId + round;
        // if (cc.sys.OS_ANDROID == cc.sys.os) {
        //     jsb.reflection.callStaticMethod('game/XLTool', 'shareText', '(Ljava/lang/String;)V', record);
        // } else if (cc.sys.OS_IOS == cc.sys.os) {
        //     jsb.reflection.callStaticMethod('XLTool', 'shareText', record);
        // }
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(record);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    watchBtn() {
        com_replay_data.Instance().getRecordHttpReq(this.gameType, parseInt(this.historyId), this.round);
    },

    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);
        var hour = date.getHours();
        var min = date.getMinutes();
        return (hour > 9 ? hour : ('0' + hour)) + ':' + (min > 9 ? min : ('0' + min));
    },
    // update (dt) {},
});
