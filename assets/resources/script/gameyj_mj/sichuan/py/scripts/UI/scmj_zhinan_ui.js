var DeskED = require('scmj_desk_data').DeskED;
var DeskEvent = require('scmj_desk_data').DeskEvent;
var DeskData = require('scmj_desk_data').DeskData;

var mj_zhinan_ui = require('mj_zhinan_ui');
var mj_audio = require('mj_audio');

var playerMgr = require('scmj_player_mgr');
var PlayerED = require("scmj_player_data").PlayerED;
var PlayerEvent = require("scmj_player_data").PlayerEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: mj_zhinan_ui,

    properties: {
    },

    ctor: function () {
        this.prevZhiNan = null;
        this.currZhiNan = null;
    },

    // use this for initialization
    onLoad: function () {
        this.cd = cc.find("cd", this.node).getComponent(cc.Label);
        var zhinanSprite_0 = cc.find("dong1", this.node).getComponent(cc.Sprite);
        var zhinanSprite_1 = cc.find("nan1", this.node).getComponent(cc.Sprite);
        var zhinanSprite_2 = cc.find("xi1", this.node).getComponent(cc.Sprite);
        var zhinanSprite_3 = cc.find("bei1", this.node).getComponent(cc.Sprite);
        this.zhinanSprite = [zhinanSprite_0, zhinanSprite_1, zhinanSprite_2, zhinanSprite_3];

        var dnxbHigh_0 = cc.find("dong1/zhinan_text", this.node).getComponent(cc.Sprite);
        var dnxbHigh_1 = cc.find("nan1/zhinan_text", this.node).getComponent(cc.Sprite);
        var dnxbHigh_2 = cc.find("xi1/zhinan_text", this.node).getComponent(cc.Sprite);
        var dnxbHigh_3 = cc.find("bei1/zhinan_text", this.node).getComponent(cc.Sprite);
        this.dnxbHigh = [dnxbHigh_0, dnxbHigh_1, dnxbHigh_2, dnxbHigh_3];

        var dnxb_0 = cc.find("sprite_text_down", this.node).getComponent(cc.Sprite);
        var dnxb_1 = cc.find("sprite_text_right", this.node).getComponent(cc.Sprite);
        var dnxb_2 = cc.find("sprite_text_up", this.node).getComponent(cc.Sprite);
        var dnxb_3 = cc.find("sprite_text_left", this.node).getComponent(cc.Sprite);
        this.dnxb = [dnxb_0, dnxb_1, dnxb_2, dnxb_3];

        var frame = this.node.getComponent('mj_zhinan_frame');
        this.zhinan_atlas = frame.getFrame();

        this.node_shaizi = cc.find("shaizi", this.node);
        this.node_shaizi_2 = cc.find("shaizi2", this.node);

        this.db_shaizi = this.node_shaizi.getComponent(sp.Skeleton);
        this.db_shaizi.node.active = false;
        this.db_shaizi_2 = this.node_shaizi_2.getComponent(sp.Skeleton);
        this.db_shaizi_2.node.active = false;

        this.init();
        this.ani = this.node.getComponent(cc.Animation);
    },


    start: function () {
        PlayerED.addObserver(this);
        DeskED.addObserver(this);
    },

    initDirection: function () {
        var selfPos = 0;
        var self_data = playerMgr.Instance().getPlayer(cc.dd.user.id);
        if (DeskData.Instance().isGameStart && self_data) {
            selfPos = self_data.idx;
        } else if (self_data) {
            selfPos = self_data.idx;
        }
        if (playerMgr.Instance().playerList.length == 2) {
            selfPos = selfPos > 0 ? selfPos + 1 : selfPos;
        }
        var spriteNames = this.getArraySpriteNameByPos(selfPos);
        for (var i = 0; i < spriteNames.length; ++i) {
            this.dnxb[i].spriteFrame = this.zhinan_atlas[spriteNames[i].ordinary];
            this.dnxbHigh[i].spriteFrame = this.zhinan_atlas[spriteNames[i].high];
        }

    },


    onDestroy: function () {
        this._super();
        this.stopCd();
        PlayerED.removeObserver(this);
        DeskED.removeObserver(this);
    },

    dabao: function () { },
    huanbao: function (num) { },
    /**
     * 打骰子结束
     */
    onDaShaZiEnd: function () { },

    shaizi: function (dianshu1, dianshu2) {
        this.db_shaizi.node.active = true;
        this.db_shaizi_2.node.active = true;
        mj_audio.playAduio("shaizi");
        this.db_shaizi.setAnimation(0, dianshu1, false);
        this.db_shaizi_2.setAnimation(0, dianshu2, false);
        this.db_shaizi.scheduleOnce(function () {
            this.db_shaizi.clearTracks();
            this.db_shaizi.node.active = false;
            cc.log("saizi call back ---------");

            playerMgr.Instance().playing_shaizi = false;
            cc.gateNet.Instance().clearDispatchTimeout();
        }.bind(this), 2);
        this.db_shaizi_2.scheduleOnce(function () {
            this.db_shaizi_2.clearTracks();
            this.db_shaizi_2.node.active = false;
            cc.log("saizi call back ---------");
        }.bind(this), 2);
    },

    stopshaizi: function () {
        this.db_shaizi.clearTracks();
        this.db_shaizi.node.active = false;
        this.db_shaizi.unscheduleAllCallbacks();

        this.db_shaizi_2.clearTracks();
        this.db_shaizi_2.node.active = false;
        this.db_shaizi_2.unscheduleAllCallbacks();
    },

    onEventMessage: function (event, data) {
        if (cc.replay_gamedata_scrolling) {
            return;
        }
        if (!data || !data instanceof Array) {
            return;
        }
        this._super(event, data);
        switch (event) {
            case DeskEvent.DA_BAO:
                setTimeout(function () {
                    this.dabao();
                }.bind(this), 200);
                break;
            case DeskEvent.CHANGE_BAO:
                setTimeout(function () {
                    this.huanbao(data[1]);
                }.bind(this), 200);
                break;
            case DeskEvent.SCJ_SHAIZI:
                setTimeout(function () {
                    this.shaizi(data[0], data[1]);
                }.bind(this), 200);
                break;
            case DeskEvent.STOP_SCJ_SHAIZI:
                this.stopshaizi();
            default:
                break;
        }
    },
});
