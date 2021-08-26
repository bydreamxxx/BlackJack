var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AudioManager = require('AudioManager');
var AudioPath = require("jlmj_audio_path");
var Define = require('Define');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var TdkDeskData = require('tdk_coin_desk_data');
var DeskData = TdkDeskData.TdkCDeskData.Instance();
var dd = cc.dd;

cc.Class({
    extends: cc.Component,

    properties: {
        zhuobu: { default: [], type: cc.SpriteFrame, tooltip: '桌布列表' },
        music_Node: { default: null, type: cc.Node, tooltip: '音乐' },
        sound_Node: { default: null, type: cc.Node, tooltip: '音效' },
    },

    onLoad: function () {
        this.initZhuoBu();
        this.initMusicAndSound();
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.TDK_FRIEND ||
            roomtype == Define.GameType.TDK_FRIEND_LIU)
            this.initRoomInfo();

    },
    /**
     * 朋友局详细信息
     */
    initRoomInfo: function () {
        var Rule = RoomMgr.Instance()._Rule;
        if (!Rule) return;

        cc.find('room_info/round/room_num', this.node).getComponent(cc.Label).string = '/' + Rule.roundCount + '局'
        cc.find('room_info/room/room_num', this.node).getComponent(cc.Label).string = RoomMgr.Instance().roomId.toString();
        var detialNode = cc.find('room_info/detail', this.node);
        cc.find('room_num/lbl', detialNode).getComponent(cc.Label).string = RoomMgr.Instance().roomId.toString();
        cc.find('round_num/lbl', detialNode).getComponent(cc.Label).string = Rule.roundCount;
        var wafa = cc.find('layout/wafa', detialNode);
        cc.find('layout/wafa', detialNode).getComponent(cc.Label).string = DeskData.getPlayTypeStr(Rule.playType);
        cc.find('layout/daiwang', detialNode).active = Rule.hasJoker;
        cc.find('layout/wangzhongpao', detialNode).active = Rule.jokerPao;
        cc.find('layout/apao', detialNode).active = Rule.aPao;
        cc.find('layout/gong', detialNode).getComponent(cc.Label).string = Rule.shareType ? '公张随豹' : '公张随点';
        cc.find('layout/languofanbei', detialNode).active = Rule.lanDouble;
        cc.find('layout/genfu', detialNode).active = Rule.genfu;
        cc.find('layout/liangdi', detialNode).active = Rule.isOpen;
        cc.find('layout/bati', detialNode).getComponent(cc.Label).string = !Rule.huixuanti ? (Rule.bati ? ',把踢' : ',末踢') : '';
        cc.find('layout/chat', detialNode).active = Rule.limitWords;
        cc.find('layout/voice', detialNode).active = Rule.limitTalk;
        cc.find('layout/gps', detialNode).active = Rule.gps;

        this.schedule(this.switchTimeRound, 10);
    },

    //切换局数和时间显示
    switchTimeRound: function () {
        var timeNode = cc.find('room_info/time', this.node);
        var roundNode = cc.find('room_info/round', this.node);
        if (timeNode.active) {
            timeNode.active = false;
            roundNode.active = true;
        }
        else {
            timeNode.active = true;
            roundNode.active = false;
        }
    },

    onRoomInfoClick: function () {
        if (cc.find('room_info/detail', this.node).active == true) {
            cc.find('room_info/detail', this.node).active = false;
        }
        else {
            cc.find('room_info/detail', this.node).active = true;
        }
    },

    onDestroy: function () {

    },

    onClickClose: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },


    //关闭按钮
    onCloseClick: function (event, data) {
        hall_audio_mgr.com_btn_click();
        switch (data) {
            case 'setting':
                cc.find('setting', this.node).active = false;
                break;
        }
    },

    //==================设置界面
    initZhuoBu() {
        var idx = 0;
        var json = cc.sys.localStorage.getItem('tdk_zhuobu_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuobu.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                    idx = index;
                }
            });
            if (sprite) {
                cc.find('bg/deck', this.node).getComponent(cc.Sprite).spriteFrame = sprite;
            }
            else {
                cc.find('bg/deck', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
                cc.sys.localStorage.setItem('tdk_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
            }
        }
        else {
            cc.find('bg/deck', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
            cc.sys.localStorage.setItem('tdk_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
        }
        var bg_item = cc.find('setting/bg/content/zhuomian/view/content/bg', this.node);
        var tog_item = cc.find('setting/bg/content/zhuomian/toggles/tog', this.node);
        this.zhuobu.forEach(element => {
            var bg = cc.instantiate(bg_item);
            bg.getComponent(cc.Sprite).spriteFrame = element;
            bg.active = true;
            bg_item.parent.addChild(bg);
            var tog = cc.instantiate(tog_item);
            tog.active = true;
            tog_item.parent.addChild(tog);
        });
        this.nextBgBtn = cc.find('setting/bg/content/next_BG', this.node).getComponent(cc.Button);
        this.preBgBtn = cc.find('setting/bg/content/pre_BG', this.node).getComponent(cc.Button);
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
        this.nextBgBtn.interactable = this.idxZm < (this.zhuobu.length - 1);
        this.preBgBtn.interactable = this.idxZm > 0;
    },

    nextZhuobu() {
        if (!this.changingZhuobu) {
            if (this.zhuobu[this.idxZm + 1]) {
                this.nextBgBtn.interactable = false;
                this.preBgBtn.interactable = false;
                this.changingZhuobu = true;
                var move = cc.moveTo(1, cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('tdk_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('bg/deck', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
            }
        }
    },

    preZhuobu() {
        if (!this.changingZhuobu) {
            if (this.zhuobu[this.idxZm - 1]) {
                this.nextBgBtn.interactable = false;
                this.preBgBtn.interactable = false;
                this.changingZhuobu = true;
                var move = cc.moveTo(1, cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('tdk_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('bg/deck', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm + 2].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
            }
        }
    },

    //初始化音乐音效设置
    initMusicAndSound: function () {
        var music = AudioManager.getInstance()._getLocalMusicSwitch();
        var sound = AudioManager.getInstance()._getLocalSoundSwitch();
        var s_volume = AudioManager.getInstance()._getLocalSoundVolume();
        var m_volume = AudioManager.getInstance()._getLocalMusicVolume();
        if (!music) {
            cc.find('setting/bg/content/music/mask', this.node).width = 0;
            cc.find('setting/bg/content/music/tao', this.node).x = -50;
            cc.find('setting/bg/content/music/tao/b', this.node).active = true;
            cc.find('setting/bg/content/music/tao/y', this.node).active = false;
            cc.find('setting/bg/content/music/label_kai', this.node).active = false;
            cc.find('setting/bg/content/music/label_guan', this.node).active = true;
        }
        else {
            AudioManager.getInstance().onMusic(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_BEIJIGN);
        }
        if (!sound) {
            cc.find('setting/bg/content/sound/mask', this.node).width = 0;
            cc.find('setting/bg/content/sound/tao', this.node).x = -50;
            cc.find('setting/bg/content/sound/tao/b', this.node).active = true;
            cc.find('setting/bg/content/sound/tao/y', this.node).active = false;
            cc.find('setting/bg/content/sound/label_kai', this.node).active = false;
            cc.find('setting/bg/content/sound/label_guan', this.node).active = true;
        }
        if (s_volume == 0 && m_volume == 0) {//静音
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = true;
            this.mute = true;
        }
        else {
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = false;
            this.mute = false;
        }
        var fangyan_node = cc.find('setting/bg/content/fangyan', this.node);
        //cc.dd.ShaderUtil.setGrayShader(fangyan_node);
    },

    //设置音乐音效
    onSetMusic: function (event, data) {
        var duration = 0.3;
        var step = 0.05;
        switch (data) {
            case 'music':
                {
                    var music_Node = this.music_Node;
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
                                AudioManager.getInstance().onMusic(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_BEIJIGN);
                            }.bind(this));
                            var action = cc.sequence(move, spFunc);
                            var width = 138;
                            var time = duration;
                            this.switch_music = true;
                            music_Node.getComponent(cc.Button).schedule(function () {
                                time -= step;
                                if (time < 0)
                                    time = 0;
                                cc.find('mask', music_Node).width = width * (1 - time / duration);
                                if (time == 0) {
                                    music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                    this.switch_music = false;
                                }
                            }.bind(this), step);
                            cc.find('tao', music_Node).runAction(action);
                        }
                    }
                    break;
                }
            case 'sound':
                var sound_Node = this.sound_Node;
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
                        var time = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            var mask = cc.find('mask', sound_Node);
                            if(mask)
                                mask.width = width * time / duration;
                            if (time == 0) {
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
                        var time = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            var mask = cc.find('mask', sound_Node);
                            if (mask)
                                mask.width = width * (1 - time / duration);
                            if (time == 0) {
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
});
