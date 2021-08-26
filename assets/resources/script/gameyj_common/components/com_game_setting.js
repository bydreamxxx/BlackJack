/**
 * Created by luke on 2018/12/5
 */

let AudioManager = require('AudioManager');
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
let hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        game_id: 0,                         //游戏ID
        bg_node: cc.Node,                   //替换背景节点
        zhuobu_splist: [cc.SpriteFrame],    //背景sp列表
        paibei_splist: [cc.SpriteFrame],    //牌背sp列表
        music_clip: cc.AudioClip,           //背景音乐
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
    },

    start() {

    },

    initData() {
        this.initMusicAndSound();
        this.initZhuoBu();
        this.initPaibei();
    },

    //初始化音乐音效设置
    initMusicAndSound() {
        var music = AudioManager.getInstance()._getLocalMusicSwitch();
        var sound = AudioManager.getInstance()._getLocalSoundSwitch();
        var s_volume = AudioManager.getInstance()._getLocalSoundVolume();
        var m_volume = AudioManager.getInstance()._getLocalMusicVolume();
        if (!music) {
            cc.find('bg/content/music/mask', this.node).width = 0;
            cc.find('bg/content/music/tao', this.node).x = -50;
            cc.find('bg/content/music/tao/b', this.node).active = true;
            cc.find('bg/content/music/tao/y', this.node).active = false;
            cc.find('bg/content/music/label_kai', this.node).active = false;
            cc.find('bg/content/music/label_guan', this.node).active = true;
        }
        else {
            AudioManager.getInstance().onRawMusic(this.music_clip);
        }
        if (!sound) {
            cc.find('bg/content/sound/mask', this.node).width = 0;
            cc.find('bg/content/sound/tao', this.node).x = -50;
            cc.find('bg/content/sound/tao/b', this.node).active = true;
            cc.find('bg/content/sound/tao/y', this.node).active = false;
            cc.find('bg/content/sound/label_kai', this.node).active = false;
            cc.find('bg/content/sound/label_guan', this.node).active = true;
        }
        if (s_volume == 0 && m_volume == 0) {//静音
            cc.find('bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = true;
            this.mute = true;
        }
        else {
            cc.find('bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = false;
            this.mute = false;
        }
        var fangyan_node = cc.find('bg/content/fangyan', this.node);
        cc.dd.ShaderUtil.setGrayShader(fangyan_node);
    },

    /**
     * 设置音乐音效
     */
    onSetMusic: function (event, custom) {
        var duration = 0.3;
        var step = 0.05;
        switch (custom) {
            case 'music':
                hall_audio_mgr.com_btn_click();
                var music_Node = cc.find('bg/content/music', this.node);
                if (AudioManager.getInstance()._getLocalMusicSwitch()) {//on  需要关闭
                    if (!this.switch_music) {
                        cc.find('label_kai', music_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', music_Node).active = false;
                            cc.find('tao/b', music_Node).active = true;
                            cc.find('label_guan', music_Node).active = true;
                            AudioManager.getInstance().offMusic();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', music_Node).width;
                        var time = duration;
                        this.switch_music = true;
                        music_Node.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', music_Node).width = width * time / duration;
                            if (time == 0) {
                                music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', music_Node).runAction(action);
                    }
                }
                else {
                    if (!this.switch_music) {
                        cc.find('label_guan', music_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(46.6, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', music_Node).active = true;
                            cc.find('tao/b', music_Node).active = false;
                            cc.find('label_kai', music_Node).active = true;
                            AudioManager.getInstance().onRawMusic(this.music_clip);
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time1 = duration;
                        this.switch_music = true;
                        music_Node.getComponent(cc.Button).schedule(function () {
                            time1 -= step;
                            if (time1 < 0)
                                time1 = 0;
                            cc.find('mask', music_Node).width = width * (1 - time1 / duration);
                            if (time1 == 0) {
                                music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', music_Node).runAction(action);
                    }
                }
                break;
            case 'sound':
                hall_audio_mgr.com_btn_click();
                var sound_Node = cc.find('bg/content/sound', this.node);
                if (AudioManager.getInstance()._getLocalSoundSwitch()) {//on  需要关闭
                    if (!this.switch_sound) {
                        cc.find('label_kai', sound_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', sound_Node).active = false;
                            cc.find('tao/b', sound_Node).active = true;
                            cc.find('label_guan', sound_Node).active = true;
                            AudioManager.getInstance().offSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', sound_Node).width;
                        var time2 = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time2 -= step;
                            if (time2 < 0)
                                time2 = 0;
                            cc.find('mask', sound_Node).width = width * time2 / duration;
                            if (time2 == 0) {
                                sound_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', sound_Node).runAction(action);
                    }
                }
                else {
                    if (!this.switch_sound) {
                        cc.find('label_guan', sound_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(43, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', sound_Node).active = true;
                            cc.find('tao/b', sound_Node).active = false;
                            cc.find('label_kai', sound_Node).active = true;
                            AudioManager.getInstance().onSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time3 = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time3 -= step;
                            if (time3 < 0)
                                time3 = 0;
                            cc.find('mask', sound_Node).width = width * (1 - time3 / duration);
                            if (time3 == 0) {
                                sound_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', sound_Node).runAction(action);
                    }
                }
                break;
            case 'mute':
                if (this.mute) {//静音开启  需关闭
                    AudioManager.getInstance().setSoundVolume(1);
                    AudioManager.getInstance().setMusicVolume(1);
                    this.mute = false;
                }
                else {
                    AudioManager.getInstance().setSoundVolume(0);
                    AudioManager.getInstance().setMusicVolume(0);
                    this.mute = true;
                }
                break;
            case 'fangyan':
                break;
            default:
                cc.error('setMusic failed. arg error');
                break;
        }
    },

    /**
     * 初始化桌布
     */
    initZhuoBu() {
        var idx = 0;
        var json = cc.sys.localStorage.getItem(this.game_id + '_zhuobu_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuobu_splist.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                    idx = index;
                }
            });
            if (sprite) {
                this.bg_node.getComponent(cc.Sprite).spriteFrame = sprite;
            }
            else {
                this.bg_node.getComponent(cc.Sprite).spriteFrame = this.zhuobu_splist[0];
                cc.sys.localStorage.setItem(this.game_id + '_zhuobu_' + cc.dd.user.id, this.zhuobu_splist[0]._name);
            }
        }
        else {
            this.bg_node.getComponent(cc.Sprite).spriteFrame = this.zhuobu_splist[0];
            cc.sys.localStorage.setItem(this.game_id + '_zhuobu_' + cc.dd.user.id, this.zhuobu_splist[0]._name);
        }
        var bg_item = cc.find('bg/content/zhuomian/view/content/bg', this.node);
        var tog_item = cc.find('bg/content/zhuomian/toggles/tog', this.node);
        this.zhuobu_splist.forEach(element => {
            var bg = cc.instantiate(bg_item);
            bg.getComponent(cc.Sprite).spriteFrame = element;
            bg.active = true;
            bg_item.parent.addChild(bg);
            var tog = cc.instantiate(tog_item);
            tog.active = true;
            tog_item.parent.addChild(tog);
        });
        this.nextBgBtn = cc.find('bg/content/next_BG', this.node).getComponent(cc.Button);
        this.preBgBtn = cc.find('bg/content/pre_BG', this.node).getComponent(cc.Button);
        this.idxZm = idx;
        this.contentZm = bg_item.parent;
        this.toggleZm = tog_item.parent;
        this.toggleZm.children[idx + 1].getChildByName('lv').active = true;
        this.zmWidth = bg_item.width;
        this.zmSpacingX = this.contentZm.getComponent(cc.Layout).spacingX;
        this.contentZm.x = - idx * (this.zmSpacingX + this.zmWidth);
        this.freshNextPreBtn();
    },
    freshNextPreBtn() {
        this.nextBgBtn.interactable = this.idxZm < (this.zhuobu_splist.length - 1);
        this.preBgBtn.interactable = this.idxZm > 0;
    },
    onZhuobuSwitch(event, custom) {
        hall_audio_mgr.com_btn_click();
        switch (custom) {
            case 'next':
                if (!this.changingZhuobu) {
                    if (this.zhuobu_splist[this.idxZm + 1]) {
                        this.nextBgBtn.interactable = false;
                        this.preBgBtn.interactable = false;
                        this.changingZhuobu = true;
                        var move = cc.moveTo(1, cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                        cc.sys.localStorage.setItem(this.game_id + '_zhuobu_' + cc.dd.user.id, this.zhuobu_splist[this.idxZm]._name);
                        this.bg_node.getComponent(cc.Sprite).spriteFrame = this.zhuobu_splist[this.idxZm];
                        var func = function () {
                            this.toggleZm.children[this.idxZm].getChildByName('lv').active = false;
                            this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                            this.changingZhuobu = false;
                            this.freshNextPreBtn();
                        }.bind(this);
                        this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
                    }
                }
                break;
            case 'pre':
                if (!this.changingZhuobu) {
                    if (this.zhuobu_splist[this.idxZm - 1]) {
                        this.nextBgBtn.interactable = false;
                        this.preBgBtn.interactable = false;
                        this.changingZhuobu = true;
                        var move = cc.moveTo(1, cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                        cc.sys.localStorage.setItem(this.game_id + '_zhuobu_' + cc.dd.user.id, this.zhuobu_splist[this.idxZm]._name);
                        this.bg_node.getComponent(cc.Sprite).spriteFrame = this.zhuobu_splist[this.idxZm];
                        var func = function () {
                            this.toggleZm.children[this.idxZm + 2].getChildByName('lv').active = false;
                            this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                            this.changingZhuobu = false;
                            this.freshNextPreBtn();
                        }.bind(this);
                        this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
                    }
                }
                break;
        }
    },

    /**
     * 初始化牌背
     */
    initPaibei() {
        var idx = 0;
        var sprite = null;
        var json = cc.sys.localStorage.getItem(this.game_id + '_paibei_' + cc.dd.user.id);
        if (json) {
            this.paibei_splist.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                    idx = index;
                }
            });
            if (!sprite) {
                sprite = this.paibei_splist[0];
                cc.sys.localStorage.setItem(this.game_id + '_paibei_' + cc.dd.user.id, this.paibei_splist[0]._name);
            }
        }
        else {
            sprite = this.paibei_splist[0];
            cc.sys.localStorage.setItem(this.game_id + '_paibei_' + cc.dd.user.id, this.paibei_splist[0]._name);
        }
        RoomED.notifyEvent(RoomEvent.update_poker_back, sprite);
        var poker_item = cc.find('bg/content/cards/poker', this.node);
        this.paibei_splist.forEach(element => {
            var poker = cc.instantiate(poker_item);
            poker.getComponent(cc.Sprite).spriteFrame = element;
            if (sprite == element) {
                poker.getComponent(cc.Toggle).isChecked = true;
            }
            else {
                poker.getComponent(cc.Toggle).isChecked = false;
            }
            poker.active = true;
            poker.tagname = element._name;
            poker_item.parent.addChild(poker);
        });
    },

    clickPaibei(event) {
        if (event.node.tagname) {
            hall_audio_mgr.com_btn_click();
            cc.sys.localStorage.setItem(this.game_id + '_paibei_' + cc.dd.user.id, event.node.tagname);
            RoomED.notifyEvent(RoomEvent.update_poker_back, event.node.getComponent(cc.Sprite).spriteFrame);
        }
    },

    closeBtn(evnet, custom) {
        hall_audio_mgr.com_btn_click();
        this.node.active = false;
    },
});
