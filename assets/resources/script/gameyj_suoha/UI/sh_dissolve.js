const colors = {
    agree: cc.color(0, 192, 0),
    refuse: cc.color(192, 0, 0),
}
cc.Class({
    extends: cc.Component,

    properties: {
        player_node_list: { type: cc.Node, default: [] },
        time_label: { type: cc.Label, default: null },
    },

    start() {

    },

    setData(msg) {
        var userId = msg.userId;
        var isAgree = msg.isAgree;
        if (userId == cc.dd.user.id) {
            cc.find('image_base/button_refuse', this.node).active = false;
            cc.find('image_base/button_agree', this.node).active = false;
        }
        for (var i = 0; i < this.player_node_list.length; i++) {
            if (this.player_node_list[i].tagname == userId) {
                if (isAgree) {
                    cc.find('label_chooseing', this.player_node_list[i]).color = colors.agree;
                    cc.find('label_chooseing', this.player_node_list[i]).getComponent(cc.Label).string = '同意';
                }
                else {
                    cc.find('label_chooseing', this.player_node_list[i]).color = colors.refuse;
                    cc.find('label_chooseing', this.player_node_list[i]).getComponent(cc.Label).string = '拒绝';
                }
                break;
            }
        }
    },

    setStartData(timeout, playerList, msg) {
        var userId = msg.userId;
        if (userId == cc.dd.user.id) {
            cc.find('image_base/button_refuse', this.node).active = false;
            cc.find('image_base/button_agree', this.node).active = false;
        }
        var index = 0;
        var player = playerList.find(function (p) { return p.userId == userId; });
        var nick = cc.dd.Utils.substr(player.name, 0, 6);
        this.player_node_list[index].tagname = userId;
        cc.find('name', this.player_node_list[index]).getComponent(cc.Label).string = nick;
        cc.find('id', this.player_node_list[index]).getComponent(cc.Label).string = 'ID:' + player.userId.toString();
        this.initHead(cc.find('head/face', this.player_node_list[index]).getComponent(cc.Sprite), player.headUrl);
        this.player_node_list[index++].active = true;
        for (var i = 0; i < playerList.length; i++) {
            if (!playerList[i] || playerList[i].userId == userId) {
                continue;
            }
            this.player_node_list[index].tagname = playerList[i].userId;
            var nick = cc.dd.Utils.substr(playerList[i].name, 0, 6);
            cc.find('name', this.player_node_list[index]).getComponent(cc.Label).string = nick;
            this.initHead(cc.find('head/face', this.player_node_list[index]).getComponent(cc.Sprite), playerList[i].headUrl);
            this.player_node_list[index++].active = true;
        }
        this.time = timeout;
        this.time_label.string = this.parseTimeStr(timeout);
        var showTimer = function () {
            this.time--;
            var time = this.time > 0 ? this.time : 0;
            this.time_label.string = this.parseTimeStr(time);
            if (time == 0) {
                this.unschedule(showTimer);
            }
        }.bind(this);
        this.unschedule(showTimer);
        this.schedule(showTimer, 1);
    },

    parseTimeStr(secTime) {
        var mins = Math.floor(secTime / 60);
        var sec = secTime % 60;
        var str = (mins > 9 ? mins.toString() : '0' + mins.toString()) + ':' + (sec > 9 ? sec.toString() : '0' + sec.toString())
        return str;
    },

    initHead(headsp, headUrl) {
        // if (headUrl.indexOf('.jpg') != -1) {
        //     FortuneHallManager.getRobotIcon(headUrl, function (sprite) {
        //         headsp.spriteFrame = sprite;
        //     }.bind(this));
        // }
        // else {
            if (headUrl && headUrl != '') {
                cc.dd.SysTools.loadWxheadH5(headsp, headUrl);
            }
        //}
    },

    onAgree(event, data) {
        const req = new cc.pb.room_mgr.room_dissolve_agree_req();
        req.setIsAgree(true);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_dissolve_agree_req, req,
            'room_dissolve_agree_req', 'no');
    },

    onRefuse(event, data) {
        const req = new cc.pb.room_mgr.room_dissolve_agree_req();
        req.setIsAgree(false);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_dissolve_agree_req, req,
            'room_dissolve_agree_req', 'no');
    },
});
