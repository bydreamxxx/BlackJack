//每个麻将都要改写这个
let mjComponentValue = null;

var mj_audio = require('mj_audio');
let mjzhinan = cc.Class({
    extends: cc.Component,

    properties: {
        ani_dahuanbao: cc.Node,
        is2d: false,
    },

    ctor: function () {
        mjComponentValue = this.initMJComponet();
        let _deskData = require(mjComponentValue.deskData);
        this.require_DeskEvent = _deskData.DeskEvent;
        this.require_DeskED = _deskData.DeskED;
        this.require_DeskData = _deskData.DeskData;

        let _playerData = require(mjComponentValue.playerData);
        this.require_PlayerED = _playerData.PlayerED;
        this.require_PlayerEvent = _playerData.PlayerEvent;

        this.require_playerMgr = require(mjComponentValue.playerMgr);

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
        this.init();
        this.ani = this.node.getComponent(cc.Animation);
        this.db_shaizi = this.node_shaizi.getComponent(dragonBones.ArmatureDisplay);
        this.db_shaizi.node.active = false;
        this.db_dahuanbao = this.ani_dahuanbao.getComponent(dragonBones.ArmatureDisplay);
        this.db_dahuanbao.node.active = false;
    },

    start: function () {
        this.require_PlayerED.addObserver(this);
        this.require_DeskED.addObserver(this);
    },

    init: function () {

        // 初始化东南西北方向
        this.initDirection();

        // this.cd.node.active = false;
        this.zhinanSprite.forEach(function (v, i) {
            v.node.active = false;
        }.bind(this));
        this.stopCd();
    },

    initDirection: function () {
        var selfPos = 0;
        var self_data = this.require_playerMgr.Instance().getPlayer(cc.dd.user.id);
        if (this.require_DeskData.Instance().isGameStart && self_data) {
            selfPos = self_data.idx;
        } else if (self_data) {
            selfPos = self_data.idx;
        }
        if (this.require_playerMgr.Instance().playerList.length == 2) {
            selfPos = selfPos > 0 ? selfPos + 1 : selfPos;
        }
        var spriteNames = this.getArraySpriteNameByPos(selfPos);
        for (var i = 0; i < spriteNames.length; ++i) {
            this.dnxb[i].spriteFrame = this.zhinan_atlas[spriteNames[i].ordinary];
            this.dnxbHigh[i].spriteFrame = this.zhinan_atlas[spriteNames[i].high];
        }
    },

    getArraySpriteNameByPos: function (selfPos) {
        var spriteNames = [];
        var fangxiangIdx = ['x', 'y', 's', 'z'];
        var wenziIdx = ['dong', 'nan', 'xi', 'bei'];
        for (var i = 0; i < 4; ++i) {
            //普通指示图片
            var spriteOrdinary = "";
            var spriteHighlight = "";

            if (this.is2d) {
                spriteOrdinary += "mj-a" + (wenziIdx[(selfPos + i) % 4] + '_2d');
                spriteHighlight += "mj-l" + (wenziIdx[(selfPos + i) % 4] + '_2d');
            } else {
                spriteOrdinary += "mj-" + fangxiangIdx[i] + "-a" + (wenziIdx[(selfPos + i) % 4]);
                spriteHighlight += "mj-" + fangxiangIdx[i] + "-l" + (wenziIdx[(selfPos + i) % 4]);
            }

            cc.log('方位---' + spriteOrdinary);

            spriteNames[i] = { ordinary: spriteOrdinary, high: spriteHighlight };
        }
        return spriteNames;
    },

    onDestroy: function () {
        this.stopCd();
        this.require_PlayerED.removeObserver(this);
        this.require_DeskED.removeObserver(this);
    },

    playDirAni: function (player) {
        if (this.currZhiNan) {
            this.prevZhiNan = this.currZhiNan;
            this.prevZhiNan.node.active = false;
        }
        this.currZhiNan = this.zhinanSprite[player.viewIdx];
        this.currZhiNan.node.active = true;

        cc.log("【UI】" + "播放指南方向 cd =", player.dapaiCD);
        player.dapaiCD = player.dapaiCD < 0 ? 0 : player.dapaiCD > 99 ? 99 : player.dapaiCD;

        this.time_up_audio = player.userId == cc.dd.user.id;
        this.startCd(player.dapaiCD);
    },

    startCd: function (cdTime) {
        this.stopCd();
        this.cd.node.active = true;
        this.cdTime = cdTime;
        this.cd.string = cdTime || '00';
        this.cdFunc = setInterval(function () {
            --this.cdTime;
            if (this.cdTime < 0) {
                this.stopCd();
            } else {

                if (this.cdTime == 3 && this.time_up_audio) {
                    this.cd.string = '0' + this.cdTime;
                    this.require_DeskED.notifyEvent(this.require_DeskEvent.TIMEUP, []);
                } else if (this.cdTime < 10) {
                    this.cd.string = '0' + this.cdTime;
                } else {
                    this.cd.string = this.cdTime;
                }
            }
        }.bind(this), 1000);
    },

    stopCd: function () {
        if (this.cdFunc) {
            clearInterval(this.cdFunc);
            this.cdFunc = null;
        }
        this.cd.string = "00";
    },

    initsetZhiNan: function (selfIndex) {
        var spriteNames = this.getArraySpriteNameByPos(selfIndex);
        for (var i = 0; i < spriteNames.length; ++i) {
            this.dnxb[i].spriteFrame = this.zhinan_atlas[spriteNames[i].ordinary];
            this.dnxbHigh[i].spriteFrame = this.zhinan_atlas[spriteNames[i].high];
        }
    },

    dabao: function () {
        if (this.require_DeskData.Instance().isFriend()) {
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
        if (this.require_DeskData.Instance().isFriend()) {
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

        cc.find("Canvas/desk_info").getComponent(mjComponentValue.deskInfo).updateBaoPai();
        this.require_DeskData.Instance().dabaoing = false;

        this.require_playerMgr.Instance().playing_shou2mid_ani = false;
        this.require_playerMgr.Instance().playerMoPaiAction();
        var dabaoing_chupai_id = this.require_playerMgr.Instance().dabaoing_chupai_id;
        if (this.require_playerMgr.Instance().mid2dapai_id_list.indexOf(dabaoing_chupai_id) != -1) {   //下家正常摸牌了,播放入牌海动画
            cc.log('下家正常摸牌了,播放入牌海动画');
            cc.dd._.pull(this.require_playerMgr.Instance().mid2dapai_id_list, dabaoing_chupai_id);
            this.require_playerMgr.Instance().playerMid2DapaiAction(dabaoing_chupai_id);
        }

        this.require_DeskED.notifyEvent(this.require_DeskEvent.BIAOJI_BAOPAI, []);
    },


    onEventMessage: function (event, data) {
        if (cc.replay_gamedata_scrolling) {
            return;
        }
        if (!data || !data instanceof Array) {
            return;
        }
        var player = data[0];
        switch (event) {
            case this.require_PlayerEvent.DAPAI_CDING:
                this.playDirAni(player);
                break;
            case this.require_DeskEvent.CLEAR:
                this.init();
                break;
            case this.require_DeskEvent.INIT_ZHINAN:
                this.initsetZhiNan(data[0]);
                break;
            case this.require_DeskEvent.DA_BAO:
                setTimeout(function () {
                    this.dabao();
                }.bind(this), 200);
                break;
            case this.require_DeskEvent.CHANGE_BAO:
                setTimeout(function () {
                    this.huanbao(data[1]);
                }.bind(this), 200);
                break;
            default:
                break;
        }
    },

    initMJComponet() {
        cc.log("-----------------------no implements base_mj_zhinan_ui initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});

module.exports = mjzhinan;