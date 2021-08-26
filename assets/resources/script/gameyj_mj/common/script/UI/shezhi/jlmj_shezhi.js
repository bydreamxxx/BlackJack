var DeskED = require('jlmj_desk_data').DeskED;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var AudioPath = require("jlmj_audio_path");
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        musicBtn: cc.Node,
        soundBtn: cc.Node,
        fangyanBtn: cc.Node,

        // zhuobu:[cc.SpriteFrame],//桌布
        setting_atals: cc.SpriteAtlas,
        // togNode:cc.Node,
        // togViewNode:cc.Node,
        // bjzmNode:cc.Node,
        // zmViewNode:cc.Node,
        // leftBtn:cc.Button,
        // rightBtn:cc.Button,

        c_zhuomian: cc.Toggle,
        c_zhuomian2: cc.Toggle,

        view2d: cc.Toggle,
        view25d: cc.Toggle,

        paiGreen: cc.Toggle,
        paiBlue: cc.Toggle,
        paiYellow: cc.Toggle,
    },

    // use this for initialization
    onLoad: function () {
        if (RoomMgr.Instance().isNewMJ()) {
            DeskED = require('base_mj_desk_data').DeskED;
            DeskEvent = require('base_mj_desk_data').DeskEvent;
        } else {
            DeskED = require('jlmj_desk_data').DeskED;
            DeskEvent = require('jlmj_desk_data').DeskEvent;
        }


        this.duration = 0.1;
        this.step = 0.05;
        this.uiAtals = this.setting_atals;//cc.loader.getRes("gameyj_hall/atals/setting", cc.SpriteAtlas);

        //初始值
        this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch();
        //音乐
        this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();

        var s_volume = AudioManager._getLocalSoundVolume();
        var m_volume = AudioManager._getLocalMusicVolume();
        //音效
        if (!this.m_bMusicSwitch) {
            cc.find('bg/content/music/mask', this.node).width = 0;
            cc.find('bg/content/music/tao', this.node).x = -42.8;
            cc.find('bg/content/music/tao/b', this.node).active = true;
            cc.find('bg/content/music/tao/y', this.node).active = false;
            // cc.find('bg/content/music/label_kai', this.node).active = false;
            // cc.find('bg/content/music/label_guan', this.node).active = true;
        }
        if (!this.m_bSoundSwitch) {
            cc.find('bg/content/sound/mask', this.node).width = 0;
            cc.find('bg/content/sound/tao', this.node).x = -42.8;
            cc.find('bg/content/sound/tao/b', this.node).active = true;
            cc.find('bg/content/sound/tao/y', this.node).active = false;
            // cc.find('bg/content/sound/label_kai', this.node).active = false;
            // cc.find('bg/content/sound/label_guan', this.node).active = true;
        }
        if (s_volume == 0 || m_volume == 0) {//静音
            cc.find('bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = true;
            this.mute = true;
        }
        else {
            cc.find('bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = false;
            this.mute = false;
        }

        if (cc._isHuaweiGame) {
            this.fangyanBtn && (this.fangyanBtn.active = false);
        }
        cc.find('bg/content/fangyan/mask', this.node).width = 0;
        cc.find('bg/content/fangyan/tao', this.node).x = -42.8;
        cc.find('bg/content/fangyan/tao/b', this.node).active = true;
        cc.find('bg/content/fangyan/tao/y', this.node).active = false;
        // cc.find('bg/content/fangyan/label_kai', this.node).active = false;
        // cc.find('bg/content/fangyan/label_guan', this.node).active = true;
        let use2D = null;
        let pai2D = null;
        if (RoomMgr.Instance().isUseNeiMengMJConfig()) {
            use2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D');
            pai2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_pai2D');

            if (!cc.dd._.isString(use2D) || use2D == '') {
                use2D = 'true';
                cc.sys.localStorage.setItem(cc.dd.user.id + '_chifeng_use2D', use2D);
                DeskED.notifyEvent(DeskEvent.CHANGE_2D, use2D);
            }
            if (!cc.dd._.isString(pai2D) || pai2D == '') {
                pai2D = 'blue';
                cc.sys.localStorage.setItem(cc.dd.user.id + '_chifeng_pai2D', pai2D);
            }
        } else {
            use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D');
            pai2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_pai2D');
        }

        if (use2D === 'true') {
            this.view2d.isChecked = true;
            this.view25d.isChecked = false;
            this.c_zhuomian.interactable = false;
            this.c_zhuomian2.interactable = false;
            if (this.paiGreen) {
                this.paiGreen.interactable = RoomMgr.Instance().isUseNeiMengMJConfig();
                this.paiGreen.isChecked = pai2D == 'green';
            }
            if (this.paiBlue) {
                this.paiBlue.interactable = RoomMgr.Instance().isUseNeiMengMJConfig();
                this.paiBlue.isChecked = pai2D == 'blue';
            }
            if (this.paiYellow) {
                this.paiYellow.interactable = RoomMgr.Instance().isUseNeiMengMJConfig();
                this.paiYellow.isChecked = pai2D == 'yellow';
            }
        } else {
            this.view2d.isChecked = false;
            this.view25d.isChecked = true;
            this.c_zhuomian.interactable = true;
            this.c_zhuomian2.interactable = true;
            if (this.paiGreen) {
                this.paiGreen.interactable = false;
            }
            if (this.paiBlue) {
                this.paiBlue.interactable = false;
            }
            if (this.paiYellow) {
                this.paiYellow.interactable = false;
            }
        }
    },

    offBtn: function (btn_target) {
        // cc.find('label_kai', btn_target).active = false;
        var move = cc.moveTo(this.duration, cc.v2(-42.8, 0));
        var spFunc = cc.callFunc(function () {
            cc.find('tao/y', btn_target).active = false;
            cc.find('tao/b', btn_target).active = true;
            // cc.find('label_guan', btn_target).active = true;
        }.bind(this));
        var action = cc.sequence(move, spFunc);
        var width = cc.find('mask', btn_target).width;
        var time = this.duration;
        this.switch_sound = true;
        btn_target.getComponent(cc.Button).schedule(function () {
            time -= this.step;
            if (time < 0)
                time = 0;
            cc.find('mask', btn_target).width = width * time / this.duration;
            if (time == 0) {
                btn_target.getComponent(cc.Button).unscheduleAllCallbacks();
                this.switch_sound = false;
            }
        }.bind(this), this.step);
        cc.find('tao', btn_target).runAction(action);
    },
    onBtn: function (btn_target) {
        // cc.find('label_guan', btn_target).active = false;
        var move = cc.moveTo(this.duration, cc.v2(42.8, 0));
        var spFunc = cc.callFunc(function () {
            cc.find('tao/y', btn_target).active = true;
            cc.find('tao/b', btn_target).active = false;
            // cc.find('label_kai', btn_target).active = true;
        }.bind(this));
        var action = cc.sequence(move, spFunc);
        var width = 132;
        var time = this.duration;
        this.switch_sound = true;
        btn_target.getComponent(cc.Button).schedule(function () {
            time -= this.step;
            if (time < 0)
                time = 0;
            cc.find('mask', btn_target).width = width * (1 - time / this.duration);
            if (time == 0) {
                btn_target.getComponent(cc.Button).unscheduleAllCallbacks();
                this.switch_sound = false;
            }
        }.bind(this), this.step);
        cc.find('tao', btn_target).runAction(action);
    },
    /**
 * 音乐开关设置
 */
    switchMusic: function (event, data) {
        if (this.mute) {
            return;
        }
        if (AudioManager._getLocalMusicSwitch()) {//on  需要关闭
            if (!this.switch_sound) {
                this.offBtn(event.target);
                AudioManager.offMusic();
            }
        }
        else {
            if (!this.switch_sound) {
                this.onBtn(event.target);
                AudioManager._setLocalMusicSwitch(true);
                AudioManager.rePlayMusic();
            }
        }
    },

    /**
     * 音效开关设置
     */
    switchEffect: function (event, data) {
        if (this.mute) {
            return;
        }
        if (AudioManager._getLocalSoundSwitch()) {//on  需要关闭
            if (!this.switch_sound) {
                this.offBtn(event.target);
                AudioManager.offSound();
            }
        }
        else {
            if (!this.switch_sound) {
                this.onBtn(event.target);
                AudioManager.onSound();
            }
        }
    },
    muteBtn: function () {
        if (this.mute) {//静音开启  需关闭
            AudioManager.setSoundVolume(1);
            AudioManager.setMusicVolume(1);
            this.mute = false;
        }
        else {
            AudioManager.setSoundVolume(0);
            AudioManager.setMusicVolume(0);
            this.mute = true;
        }
    },

    /**
     *获取桌布对设置
     */
    initZhuobuMenu: function (zb_name) {
        this.zb_name = zb_name;
        var json = cc.sys.localStorage.getItem(this.zb_name + cc.dd.user.id);
        if (json === "c_zhuomian") {
            this.c_zhuomian.isChecked = true;
            this.c_zhuomian2.isChecked = false;
        } else if (json === "c-zhuomian2") {
            this.c_zhuomian.isChecked = false;
            this.c_zhuomian2.isChecked = true;
        }

        // this.idxZm = 0;
        // if (json) {
        //     this.zhuobu.forEach(function (element, index) {
        //         var bg = cc.instantiate(this.bjzmNode);
        //         bg.getComponent(cc.Sprite).spriteFrame = element;
        //         bg.active = true;
        //         this.zmViewNode.addChild(bg);
        //         var tog = cc.instantiate(this.togNode);
        //         tog.active = true;
        //         this.togViewNode.addChild(tog);
        //         if (element._name == json) {
        //             this.idxZm = index;
        //             tog.getChildByName('lv').active = true;
        //         }
        //     }.bind(this));
        //
        //     this.contentZm = this.zmViewNode;
        //     this.zmW = this.bjzmNode.width;
        //     this.zmSpacingX = this.zmViewNode.getComponent(cc.Layout).spacingX;
        //     this.contentZm.x = -this.idxZm * (this.zmSpacingX + this.zmW);
        //     this.freshNextPreBtn();
        // }
    },
    // setZhuobu:function(value){
    //     cc.sys.localStorage.setItem(this.zb_name + cc.dd.user.id, value);
    //     DeskED.notifyEvent(DeskEvent.CHANGE_DESK_IMAGE, value);
    //     jlmj_audio_mgr.com_btn_click();
    // },
    //
    // freshNextPreBtn:function() {
    //     this.rightBtn.interactable = this.idxZm < (this.zhuobu.length - 1);
    //     this.leftBtn.interactable = this.idxZm > 0;
    // },
    //
    // nextZhuobu:function() {
    //     if (!this.changingZhuobu) {
    //         if (this.zhuobu[this.idxZm + 1]) {
    //             this.leftBtn.interactable = false;
    //             this.rightBtn.interactable = false;
    //             this.changingZhuobu = true;
    //             var move = cc.moveTo(1, cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmW), 0));
    //             this.setZhuobu(this.zhuobu[this.idxZm]._name);
    //             //cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
    //             var func = function () {
    //                 this.togViewNode.children[this.idxZm].getChildByName('lv').active = false;
    //                 this.togViewNode.children[this.idxZm + 1].getChildByName('lv').active = true;
    //                 this.changingZhuobu = false;
    //                 this.freshNextPreBtn();
    //             }.bind(this);
    //             this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
    //         }
    //     }
    // },
    // preZhuobu:function() {
    //     if (!this.changingZhuobu) {
    //         if (this.zhuobu[this.idxZm - 1]) {
    //             this.leftBtn.interactable = false;
    //             this.rightBtn.interactable = false;
    //             this.changingZhuobu = true;
    //             var move = cc.moveTo(1, cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth), 0));
    //             this.setZhuobu(this.zhuobu[this.idxZm]._name);
    //             //cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
    //             var func = function () {
    //                 this.togViewNode.children[this.idxZm + 2].getChildByName('lv').active = false;
    //                 this.togViewNode.children[this.idxZm + 1].getChildByName('lv').active = true;
    //                 this.changingZhuobu = false;
    //                 this.freshNextPreBtn();
    //             }.bind(this);
    //             this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
    //         }
    //     }
    // },

    /**
     * 关闭设置界面
     */
    closeBtnCallBack: function (event, data) {
        this.node.removeFromParent();
        this.node.destroy();
        jlmj_audio_mgr.com_btn_click();
    },

    setZhuobu: function (event, value) {
        cc.sys.localStorage.setItem(this.zb_name + cc.dd.user.id, value);
        DeskED.notifyEvent(DeskEvent.CHANGE_DESK_IMAGE, value);
        jlmj_audio_mgr.com_btn_click();
    },

    setMJ2D(event, value) {
        value = value.toString();

        if (!cc.dd.mj_change_2d_next_time) {
            let local_result = null;
            if (RoomMgr.Instance().isUseNeiMengMJConfig()) {
                local_result = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D');
            } else {
                local_result = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D');
            }
            cc.dd.mj_current_2d = cc.dd._.isNull(local_result) ? 'false' : local_result;
        }

        if (RoomMgr.Instance().isUseNeiMengMJConfig()) {
            cc.sys.localStorage.setItem(cc.dd.user.id + '_chifeng_use2D', value);
        } else {
            cc.sys.localStorage.setItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D', value);
        }

        if (value === 'true') {
            this.c_zhuomian.interactable = false;
            this.c_zhuomian2.interactable = false;
            if (this.paiGreen) {
                this.paiGreen.interactable = RoomMgr.Instance().isUseNeiMengMJConfig();
            }
            if (this.paiBlue) {
                this.paiBlue.interactable = RoomMgr.Instance().isUseNeiMengMJConfig();
            }
            if (this.paiYellow) {
                this.paiYellow.interactable = RoomMgr.Instance().isUseNeiMengMJConfig();
            }
        } else {
            this.c_zhuomian.interactable = true;
            this.c_zhuomian2.interactable = true;
            if (this.paiGreen) {
                this.paiGreen.interactable = false;
            }
            if (this.paiBlue) {
                this.paiBlue.interactable = false;
            }
            if (this.paiYellow) {
                this.paiYellow.interactable = false;
            }
        }

        DeskED.notifyEvent(DeskEvent.CHANGE_2D, value);
        jlmj_audio_mgr.com_btn_click();
    },

    setPai(event, value) {
        value = value.toString();
        if (RoomMgr.Instance().isUseNeiMengMJConfig()) {
            cc.sys.localStorage.setItem(cc.dd.user.id + '_chifeng_pai2D', value);
        } else {
            cc.sys.localStorage.setItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_pai2D', value);
        }

        DeskED.notifyEvent(DeskEvent.CHANGE_2D, value);
        jlmj_audio_mgr.com_btn_click();
    }
});
