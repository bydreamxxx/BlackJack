//create by wj 2018/10/29
var dsz_send_msg = require('dsz_send_msg');
const colors = {
    agree: cc.color(0, 192, 0),
    refuse: cc.color(192, 0, 0),
}

cc.Class({
    extends: cc.Component,

    properties: {
        time_label: { type: cc.Label, default: null },
        _itemList: [],
        contentNode: cc.Node,
    },

    start () {

    },

    setData(msg) {
        var userId = msg.userId;
        var isAgree = msg.isAgree;
        if (userId == cc.dd.user.id) {
            cc.find('image_base/button_refuse', this.node).active = false;
            cc.find('image_base/button_agree', this.node).active = false;
        }
        for (var i = 0; i < this._itemList.length; i++) {
            if (this._itemList[i].tagname == userId) {
                if (isAgree) {
                    cc.find('label_chooseing', this._itemList[i]).color = colors.agree;
                    cc.find('label_chooseing', this._itemList[i]).getComponent(cc.Label).string = '同意';
                }
                else {
                    cc.find('label_chooseing', this._itemList[i]).color = colors.refuse;
                    cc.find('label_chooseing', this._itemList[i]).getComponent(cc.Label).string = '拒绝';
                }
                break;
            }
        }
    },

    setStartData(timeout, playerList, msg) {
        if(this.showTimer)
            this.unschedule(this.showTimer);
        var userId = msg.userId;
        if (userId == cc.dd.user.id) {
            cc.find('image_base/button_refuse', this.node).active = false;
            cc.find('image_base/button_agree', this.node).active = false;
        }

        var playerNode = cc.dd.Utils.seekNodeByName(this.node, "node_face_1");
        var playerOp = playerList.find(function (p) { return p.userId == userId; });
        var nick = cc.dd.Utils.substr(playerOp.name, 0, 6);
       // this.playerNode.tag = userId;
        cc.find('name', playerNode).getComponent(cc.Label).string = nick;
        cc.find('id', playerNode).getComponent(cc.Label).string = 'ID:' + playerOp.userId.toString();
        this.initHead(cc.find('head/face', playerNode).getComponent(cc.Sprite), playerOp.headUrl);
       playerNode.active = true;


        this._itemList.splice(0, this._itemList.length);
        this.contentNode.removeAllChildren(true);
        var node = cc.dd.Utils.seekNodeByName(this.node, "node_face_0");

        playerList.forEach(function(player) {
            if (player && player.userId != userId) {
                var itemNode = cc.instantiate(node);
                this._itemList.push(itemNode);
                itemNode.parent = this.contentNode;
                itemNode.active = true;
                itemNode.tagname = player.userId;

                var cnt = this._itemList.length;
                var y = (cnt - 0.5) * this.itemHeight + (cnt - 1) * this.spaceY;
                itemNode.y = -y;
                this.contentNode.height = cnt * this.itemHeight + (cnt + 1) * this.spaceY;

                var playerCommonData = player.getPlayerCommonInfo();
                var nick = cc.dd.Utils.substr(playerCommonData.name, 0, 6);
                cc.find('name', itemNode).getComponent(cc.Label).string = nick;
                this.initHead(cc.find('head/face', itemNode).getComponent(cc.Sprite), playerCommonData.headUrl);
            }
        }.bind(this));

        this.time = timeout;
        this.time_label.string = this.parseTimeStr(timeout);
        this.showTimer = function () {
            this.time--;
            var time = this.time > 0 ? this.time : 0;
            this.time_label.string = this.parseTimeStr(time);
            if (time == 0) {
                this.unschedule(this.showTimer);
            }
        }.bind(this);
        this.unschedule(this.showTimer);
        this.schedule(this.showTimer, 1);
    },

    parseTimeStr(secTime) {
        var mins = Math.floor(secTime / 60);
        var sec = secTime % 60;
        var str = (mins > 9 ? mins.toString() : '0' + mins.toString()) + ':' + (sec > 9 ? sec.toString() : '0' + sec.toString())
        return str;
    },

    initHead(headsp, headUrl) {
            if (headUrl && headUrl != '') {
                cc.dd.SysTools.loadWxheadH5(headsp, headUrl);
            }
    },

    onAgree(event, data) {
        dsz_send_msg.dissolve(true);
    },

    onRefuse(event, data) {
        dsz_send_msg.dissolve(false);
    },

});
