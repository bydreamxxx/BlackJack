//created by luke on 10/16/2020

cc.Class({
    extends: cc.Component,

    properties: {
        uptime: 0.5,
    },

    show: function (name, emojiId, tarY, sh_chat) {
        this.totalTime = 3;
        this.node.active = true;

        var nameNode = cc.find('name', this.node);
        var lblCpt = nameNode.getComponent(cc.Label);
        lblCpt.string = cc.dd.Utils.subChineseStr(name, 0, 10) + ':';

        var emojiNode = cc.find('emoji', this.node);
        var aniEmoji = emojiNode.getComponent(cc.Animation);
        aniEmoji.play("em" + (emojiId - 1));

        this.sh_chat = sh_chat;

        if (tarY != null) {
            this.targetY = tarY;
            this.curTime = 0;
            this.isMove = true;
        }
    },

    changeMove: function (pos) {
        var quickTime = 0.1;
        if (!this.isMove) {
            this.node.runAction(cc.moveTo(quickTime, cc.v2(this.node.x, pos)));
        }
        else {
            this.targetY = pos;
        }
    },

    //有新消息，缩减总时长
    reduceTotalTime() {
        const reduceTime = 0.3;
        this.totalTime -= reduceTime;
    },

    close: function () {
        this.curTime = null;
        this.sh_chat.removeItem(this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.curTime != null) {
            if (this.curTime >= this.uptime) {
                this.isMove = false;
            }
            else {
                this.node.y += (this.targetY - this.node.y) * (dt / (this.uptime - this.curTime));
            }
            this.curTime += dt;
            if (this.curTime >= this.totalTime) {
                this.close();
            }
        }
    },
});
