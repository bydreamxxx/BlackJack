

let tw_audio_cfg = require('tw_audio_cfg');
let AudioManager = require('AudioManager');
cc.Class({
    extends: cc.Component,

    properties: {

    },
    playCardSound() {
        AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.OpenCard, false);
    },
});
