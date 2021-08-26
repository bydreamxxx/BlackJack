/**
 * Created by wang on 2017/6/19.
 */

var AudioManager = require('AudioManager');

var TDKAudioManager = cc.Class({
    s_manager: null,
    statics: {
        Instance: function () {
            if (!this.s_manager) {
                this.s_manager = new TDKAudioManager();
            }
            return this.s_manager;
        },

        Destory: function () {
            if (this.s_manager) {
                this.s_manager = null;
            }
        },
    },

    ctor: function () {
        this.musicId = -1;

        this.totalCnt = 0;
        this.loadCnt = 0;
    },

    playEffect: function (filePath) {
        cc.log('tdk_audio_manager::playEffect:filePath=', filePath);
        if (filePath)
            AudioManager.getInstance().playSound(filePath, false);
            //cc.audioEngine.play(cc.url.raw(filePath), false, 1);
    },

    playMusic: function (filePath) {
        if (this.musicId >= 0) {
            cc.audioEngine.stop(this.musicId);
        }
        cc.dd.ResLoader.loadAudio(filePath, (clip) => {
            this.musicId = cc.audioEngine.play(clip, true, 1);
        });
        cc.log('tdk_audio_manager::playMusic:musicId=', this.musicId);
    },

    stopMusic: function () {
        cc.audioEngine.stop(this.musicId);
    },

    preload: function (resArr, onProgressFunc, successFunc) {
        this.totalCnt = resArr.length;
        this.loadCnt = 0;
        var self = this;
        for (var i = 0; i < resArr.length; i++) {
            var path = resArr[i];
            cc.audioEngine.preload(path, function () {
                self.loadCnt++;
                var progress = Math.floor(1 / self.totalCnt * self.loadCnt * 100);
                onProgressFunc(progress);
                if (self.loadCnt == self.totalCnt) {
                    successFunc();
                }
            });
        }
    },

    uncache: function (resArr) {
        resArr.forEach(function (path) {
            cc.audioEngine.uncache(path);
        });
    },
});

module.exports = TDKAudioManager;

