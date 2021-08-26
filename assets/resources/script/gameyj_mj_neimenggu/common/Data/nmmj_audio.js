/**
 * Created by yons on 2018/3/29.
 */

var path_effect = "gameyj_mj_neimenggu/common/audio/mj_effect/";
var path_boy = "gameyj_mj_neimenggu/common/audio/mj_neiMengHua/boy/";
var path_girl = "gameyj_mj_neimenggu/common/audio/mj_neiMengHua/girl/";

var nmmj_audio = {

    playAduio: function (name) {
        AudioManager.playSound(path_effect + name);
    },

    playAudioBySex: function (name, sex) {
        if (sex == 1) {
            AudioManager.playSound(path_boy + name);
        } else {
            AudioManager.playSound(path_girl + name);
        }
    },
};

module.exports = nmmj_audio;
