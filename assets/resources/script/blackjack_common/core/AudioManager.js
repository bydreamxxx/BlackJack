var AudioDefine = require("AudioDefine");

const MAX_MUSIC_VOLUME = 1;
const MAX_SOUND_VOLUME = 1;

var AudioManager = cc.Class({

    statics: {
        s_instance: null,
        // 获取单例对象
        getInstance: function () {
            if (!this.s_instance) {
                this.s_instance = new AudioManager();
            }
            return this.s_instance;
        },
    },

    properties: {
        m_musicId: {
            get: function () {
                return this.getAudioID(this.m_music_path);
            }
        }
    },

    // 构造函数
    // --------------------------------
    ctor: function () {
        //最大同时播放音效的个数
        // cc.audioEngine.setMaxAudioInstance(24);
        this.audioIDs = {};

        // 音乐大小
        this.m_nMusicVolume = MAX_MUSIC_VOLUME;
        // 音效大小
        this.m_nSoundVolume = MAX_SOUND_VOLUME;

        // 音乐开关
        this.m_bMusicSwitch = true;
        // 音效开关
        this.m_bSoundSwitch = true;

        // 背景音乐
        // this.m_musicId = -1;

        //录音
        this.recording = false;

        //背景音乐路径
        this.m_music_path = null;

        this.init();
    },

    // 初始化
    // --------------------------------
    init: function () {
        this.m_nMusicVolume = this._getLocalMusicVolume();
        this.m_nSoundVolume = this._getLocalSoundVolume();

        this.m_bMusicSwitch = this._getLocalMusicSwitch();
        this.m_bSoundSwitch = this._getLocalSoundSwitch();
    },

    stopAllLoopSound() {
        let musicid = this.m_music_path;

        for (id in this.audioIDs) {
            if (this.audioIDs.hasOwnProperty(id)) {
                if (id != musicid) {
                    if (cc.audioEngine.isLoop(this.audioIDs[id])) {
                        cc.audioEngine.stop(this.audioIDs[id]);
                    }
                }
            }
        }
    },


    playMusic: function (path) {
        if (!this.m_bMusicSwitch) {
            return -1;
        }
        return this.playRawMusic(path);
    },

    playRawMusic(path, callback) {
        this.stopMusic();

        this.playAudio(path, true, this.m_nMusicVolume, callback);
        this.m_music_path = path;
        cc.sys.localStorage.setItem("MUSIC_BACKGROUND", path);
    },

    resumeBackGroundMusic: function () {
        let path = cc.sys.localStorage.getItem("MUSIC_BACKGROUND");
        if (path != undefined && path != "" && this.m_bMusicSwitch == true)
            this.playRawMusic(path);

        var self = this;
        setTimeout(function () {
            self.canPlaySound = true;
        }, 1000);
    },

    clearBackGroundMusicKey: function () {
        cc.sys.localStorage.setItem("MUSIC_BACKGROUND", "");
    },

    onGamePause: function () {
        this.canPlaySound = false;
    },

    rePlayMusic: function (callbcak) {
        this.stopMusic();
        if (!this.m_bMusicSwitch) {
            return;
        }
        if (this.m_music_path != null) {
            this.playAudio(this.m_music_path, true, this.m_nMusicVolume, callback);
        }
    },

    pauseMusic: function () {
        if (this.m_musicId == -1) {
            return;
        }
        cc.audioEngine.pause(this.m_musicId);
    },

    resumeMusic: function () {
        if (!this.m_bMusicSwitch) {
            return;
        }
        if (this.m_musicId == -1) {
            return;
        }
        cc.audioEngine.resume(this.m_musicId);
    },

    stopMusic: function () {
        if (this.m_musicId == -1) {
            return;
        }
        cc.audioEngine.stop(this.m_musicId);
        // this.m_musicId = -1;
        this.m_music_path = null;
    },

    setMusicVolume: function (musicVolume) {
        // if (this.m_musicId == -1) {
        //     return;
        // }
        if (musicVolume >= 0 && musicVolume <= 1) {
            this.m_nMusicVolume = musicVolume * MAX_MUSIC_VOLUME;
        }
        cc.audioEngine.setVolume(this.m_musicId, this.m_nMusicVolume);
        this._setLocalMusicVolume();
    },

    playSound: function (path, isLoop, callback) {
        if (!this.m_bSoundSwitch) {
            return;
        }
        if (this.recording) {
            return;
        }
        if (this.canPlaySound != undefined) {
            if (this.canPlaySound) {
                var lp = isLoop ? true : false;
                this.playAudio(path, lp, this.m_nSoundVolume, callback);
            } else {
                return;
            }
        }
        var lp = isLoop ? true : false;
        this.playAudio(path, lp, this.m_nSoundVolume, callback);
    },

    stopSound: function (id) {
        cc.audioEngine.stop(id);
    },

    stopAllSound: function () {
        for (id in this.audioIDs) {
            if (this.audioIDs.hasOwnProperty(id)) {
                if (id != this.m_music_path) {
                    this.stopSound(this.audioIDs[id]);
                }
            }
        }
    },

    setSoundVolume: function (soundVolume) {
        if (soundVolume >= 0 && soundVolume <= 1) {
            this.m_nSoundVolume = soundVolume * MAX_SOUND_VOLUME;
        }

        for (id in this.audioIDs) {
            if (this.audioIDs.hasOwnProperty(id)) {
                if (id != this.m_music_path) {
                    cc.audioEngine.setVolume(this.audioIDs[id], this.m_nSoundVolume);
                }
            }
        }

        this._setLocalSoundVolume();
    },

    startRecord: function () {
        this.recording = true;
        this.stopAllSound();
        this.pauseMusic();
    },

    cancelRecord: function () {
        this.recording = false;
        this.resumeMusic();
    },

    completeRecord: function () {
        this.recording = false;
        this.resumeMusic();
    },

    playingRecord() {
        if (!this.playing_record)
            this.playing_record = true;
        else
            return;
        var scale = 0.2;
        if (this.m_nSoundVolume > scale) {
            this.setSoundVolume(this.m_nSoundVolume * scale);
        }
        if (this.m_nMusicVolume > scale) {
            this.setMusicVolume(this.m_nMusicVolume * scale);
        }
    },

    finishPlayRecord() {
        if (this.playing_record) {
            var scale = 0.2;
            var sound = this.m_nSoundVolume / scale;
            this.setSoundVolume(sound > 1 ? 1 : sound);
            var music = this.m_nMusicVolume / scale;
            this.setMusicVolume(music > 1 ? 1 : music);
            this.playing_record = false;
        }
    },

    // 开启音乐
    // --------------------------------
    onMusic: function (audioPath) {
        this._setLocalMusicSwitch(true);
        this.playMusic(audioPath);
    },
    onRawMusic(rawurl) {
        this._setLocalMusicSwitch(true);
        this.playRawMusic(rawurl);
    },

    onMusicSwitch: function () {
        this._setLocalMusicSwitch(true);
    },

    // 关闭音乐
    // --------------------------------
    offMusic: function () {
        this.stopMusic();
        this._setLocalMusicSwitch(false);
    },

    // 开启音效
    // --------------------------------
    onSound: function () {
        this._setLocalSoundSwitch(true);
    },

    // 关闭音效
    // --------------------------------
    offSound: function () {
        this.stopAllSound();
        this._setLocalSoundSwitch(false);
    },

    // 获取硬盘存储的音效音量
    // --------------------------------
    // @return [number] 音效音量
    // --------------------------------
    _getLocalSoundVolume: function () {
        var json = cc.sys.localStorage.getItem(AudioDefine.AudioLocalVolume.LOCAL_SOUND_VOLUME);
        if (json) {
            var soundVolume = JSON.parse(json);
            if (soundVolume >= 0 && soundVolume <= 1)
                return soundVolume;
        }
        return this.m_nSoundVolume;
    },

    // 设置硬盘存储的音效大小
    // --------------------------------
    // @param soundVolume [number] 音效音量
    // --------------------------------
    _setLocalSoundVolume: function () {
        cc.sys.localStorage.setItem(AudioDefine.AudioLocalVolume.LOCAL_SOUND_VOLUME, JSON.stringify(this.m_nSoundVolume));
    },

    // 获取硬盘存储的音乐音量
    // --------------------------------
    // @return [number] 音乐音量
    // --------------------------------
    _getLocalMusicVolume: function () {
        var json = cc.sys.localStorage.getItem(AudioDefine.AudioLocalVolume.LOCAL_MUSIC_VOLUME);
        if (json) {
            var musicVolume = JSON.parse(json);
            if (musicVolume >= 0 && musicVolume <= 1)
                return musicVolume;
        }
        return this.m_nMusicVolume;
    },

    // 设置硬盘存储的音乐大小
    // --------------------------------
    // @param soundVolume [number] 音效音量
    // --------------------------------
    _setLocalMusicVolume: function () {
        cc.sys.localStorage.setItem(AudioDefine.AudioLocalVolume.LOCAL_MUSIC_VOLUME, JSON.stringify(this.m_nMusicVolume));
    },


    // 获取硬盘存储的音乐开关
    // --------------------------------
    // @return [bool] 音乐开关
    // --------------------------------
    _getLocalMusicSwitch: function () {
        var json = cc.sys.localStorage.getItem(AudioDefine.AudioLocalSwitch.LOCAL_MUSIC_SWITCH);
        if (json)
            return JSON.parse(json);
        return this.m_bMusicSwitch;
    },

    // 设置硬盘存储的音乐开关
    // --------------------------------
    // @param onOff [bool] 开关
    // --------------------------------
    _setLocalMusicSwitch: function (onOff) {
        this.m_bMusicSwitch = !!onOff;
        cc.sys.localStorage.setItem(AudioDefine.AudioLocalSwitch.LOCAL_MUSIC_SWITCH, JSON.stringify(this.m_bMusicSwitch));
    },

    // 获取硬盘存储的音效开关
    // --------------------------------
    // @return [bool] 音乐开关
    // --------------------------------
    _getLocalSoundSwitch: function () {
        var json = cc.sys.localStorage.getItem(AudioDefine.AudioLocalSwitch.LOCAL_SOUND_SWITCH);
        if (json)
            return JSON.parse(json);
        return this.m_bSoundSwitch;
    },

    // 设置硬盘存储的音效开关
    // --------------------------------
    // @param onOff [bool] 开关
    // --------------------------------
    _setLocalSoundSwitch: function (onOff) {
        this.m_bSoundSwitch = !!onOff;
        cc.sys.localStorage.setItem(AudioDefine.AudioLocalSwitch.LOCAL_SOUND_SWITCH, JSON.stringify(this.m_bSoundSwitch));
    },


    playMusicNotControlledBySwitch: function (path, loop, callback) {

        this.stopMusic();

        this.playAudio(path, loop, !this.m_bMusicSwitch ? 0 : this.m_nMusicVolume, callback);
        this.m_music_path = path;
        cc.sys.localStorage.setItem("MUSIC_BACKGROUND", path);
    },

    setMusicVolumeNotControlledBySwitch: function (on) {
        if (on) {
            cc.audioEngine.setVolume(this.m_musicId, this.m_nMusicVolume);
        } else {
            cc.audioEngine.setVolume(this.m_musicId, 0);
        }
    },

    playAudio(path, loop, volume, callback) {
        cc.dd.ResLoader.loadAudio(path, (clip) => {
            let m_musicId = cc.audioEngine.play(clip, loop, volume);
            this.audioIDs[path] = m_musicId;
            cc.audioEngine.setFinishCallback(m_musicId, () => {
                if (callback) {
                    callback();
                }

                if (this.audioIDs.hasOwnProperty(path)) {
                    delete this.audioIDs[path];
                }
            })
        });
    },

    getAudioID(path) {
        if (this.audioIDs.hasOwnProperty(path))
            return this.audioIDs[path];
        else
            return -1;
    }
});

module.exports = AudioManager;
