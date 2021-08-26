var DeskED = require('hsmj_desk_data').DeskED;
var DeskEvent = require('hsmj_desk_data').DeskEvent;
var DeskData = require('hsmj_desk_data').DeskData;

var mj_zhinan_ui = require('mj_zhinan_ui');
var mj_audio = require('mj_audio');

var playerMgr = require('hsmj_player_mgr');
var PlayerED = require("hsmj_player_data").PlayerED;
var PlayerEvent = require("hsmj_player_data").PlayerEvent;


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
        this._super();
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

        this.init();
        this.ani = this.node.getComponent(cc.Animation);
        this.db_shaizi = this.node_shaizi.getComponent(dragonBones.ArmatureDisplay);
        this.db_shaizi.node.active = false;
        this.db_dahuanbao = this.ani_dahuanbao.getComponent(dragonBones.ArmatureDisplay);
        this.db_dahuanbao.node.active = false;

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

    dabao: function () {
        if (DeskData.Instance().isFriend()) {
            var dianshu = 6;
        } else {
            var dianshu = parseInt(1 + cc.random0To1() * 5);
            cc.log("打宝随机数:", dianshu);
        }
        this.cd.node.active = false;
        this.db_shaizi.node.active = true;
        this.db_dahuanbao.node.active = true;

        this.db_shaizi.playAnimation(dianshu, 1);
        this.db_dahuanbao.playAnimation("DB", 1);
        mj_audio.playAduio("shaizi");

        this.db_shaizi.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onDaShaZiEnd, this);
        this.db_shaizi.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onDaShaZiEnd, this);
    },

    huanbao: function (num) {
        if (DeskData.Instance().isFriend()) {
            var dianshu_list = [1, 6, 5, 4, 3, 2];
            var idx = num % 6;
            var dianshu = dianshu_list[idx];
        } else {
            var dianshu = parseInt(1 + cc.random0To1() * 5);
            cc.log("打宝随机数:", dianshu);
        }
        this.cd.node.active = false;
        this.db_shaizi.node.active = true;
        this.db_dahuanbao.node.active = true;
        this.db_shaizi.playAnimation(dianshu, 1);
        this.db_dahuanbao.playAnimation("HB", 1);
        mj_audio.playAduio("shaizi");

        this.db_shaizi.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onDaShaZiEnd, this);
        this.db_shaizi.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onDaShaZiEnd, this);
    },

    /**
     * 打骰子结束
     */
    onDaShaZiEnd: function () {
        cc.log("打骰子结束");
        this.db_shaizi.node.active = false;
        this.db_dahuanbao.node.active = false;
        this.cd.node.active = true;

        cc.find("Canvas/desk_info").getComponent('hsmj_desk_info').update_bao_pai();
        DeskData.Instance().dabaoing = false;

        playerMgr.Instance().playing_shou2mid_ani = false;
        playerMgr.Instance().playerMoPaiAction();
        var dabaoing_chupai_id = playerMgr.Instance().dabaoing_chupai_id;
        if (playerMgr.Instance().mid2dapai_id_list.indexOf(dabaoing_chupai_id) != -1) {   //下家正常摸牌了,播放入牌海动画
            cc.log('下家正常摸牌了,播放入牌海动画');
            cc.dd._.pull(playerMgr.Instance().mid2dapai_id_list, dabaoing_chupai_id);
            playerMgr.Instance().playerMid2DapaiAction(dabaoing_chupai_id);
        }

        DeskED.notifyEvent(DeskEvent.BIAOJI_BAOPAI, []);
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
            default:
                break;
        }
    },
});
