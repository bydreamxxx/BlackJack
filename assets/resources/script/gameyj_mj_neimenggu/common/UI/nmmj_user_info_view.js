var hall_audio_mgr = require('hall_audio_mgr').Instance();
var RoomMgr = require("jlmj_room_mgr").RoomMgr;

cc.Class({
    extends: require('user_info_view'),

    setGpsData: function (playerList) {
        cc.find('bg/battle', this.node).active = false;
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i] && this.userId == playerList[i].userId) {
                this.location = playerList[i].location;
                break;
            }
        }
        if(!cc.dd._.isUndefined(this.location) && !cc.dd._.isNull(this.location)){
            if(!this.location.hasOwnProperty('latitude') || !this.location.hasOwnProperty('longitude')){
                this.location = null;
            }
        }
        if (!this.location || !RoomMgr.Instance()._Rule || !RoomMgr.Instance()._Rule.gps || !RoomMgr.Instance().player_mgr.getPlayerList()) {
            cc.find('bg/gps/mask/content', this.node).active = false;
            cc.find('bg/gps/no_gps', this.node).active = true;
        }
        else {
            cc.find('bg/gps/mask/content', this.node).removeAllChildren(true);
            var item = cc.find('bg/gps/item', this.node);
            for (var i = 0; i < playerList.length; i++) {
                if (playerList[i] && playerList[i].userId != this.userId) {
                    var node = cc.instantiate(item);
                    var spr_head = node.getChildByName('head').getComponent(cc.Sprite);
                    var lbl = node.getChildByName('lbl').getComponent(cc.Label);
                    var headUrl = playerList[i].headUrl;
                    var name = playerList[i].name;
                    var location = playerList[i].location;
                    cc.dd.SysTools.loadWxheadH5(spr_head, headUrl);//朋友场没有机器人  不用处理机器人头像
                    var str = '';
                    var color = cc.color(0, 0, 0);
                    if (this.checkLocation(location) && this.checkLocation(this.location)) {
                        var distance = parseInt(this.getDistance(this.location, location));
                        if (distance < 100) {
                            color = cc.color(192, 0, 0);
                        }
                        else {
                            color = cc.color(237, 93, 27);
                        }
                        str = '距[{0}]\n{1}米'.format(cc.dd.Utils.substr(name, 0, 4), distance);
                    }
                    else {
                        str = '[{0}]\n无GPS信号'.format(cc.dd.Utils.substr(name, 0, 4));
                        color = cc.color(192, 0, 0);
                    }
                    lbl.string = str;
                    lbl.node.color = color;
                    node.active = true;
                    cc.find('bg/gps/mask/content', this.node).addChild(node);
                    node.x = 0;
                }
            }
            cc.find('bg/gps/no_gps', this.node).active = false;
            cc.find('bg/gps/mask/content', this.node).active = true;
        }
        cc.find('bg/gps', this.node).active = true;
    },

    updateUI: function (player) {
        this._super(player);
        this.lab_name.string = player.name;

        this.lab_coin.node.active = false;
        this.lab_level.node.active = false;
        this.lab_exp.node.active = false;
        this.lab_vip.node.active = false;
        this.btn_vip.node.active = false;
        this.gold_node.active = false;
        this.silver_node.active = false;
        this.lab_adress.active = false;
    },

    setData: function (gameId, roomId, roomLv, isFriend, data) {
        this._super(gameId, roomId, roomLv, isFriend, data);
        this.lab_name.string = data.name;

        this.lab_coin.node.active = false;
        this.lab_level.node.active = false;
        this.lab_exp.node.active = false;
        this.lab_vip.node.active = false;
        this.btn_vip.node.active = false;
        this.gold_node.active = false;
        this.silver_node.active = false;
        this.lab_adress.active = false;
    },

    onClickCopy(){
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.userId);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },
});
