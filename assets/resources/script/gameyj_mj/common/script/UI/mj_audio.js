/**
 * Created by yons on 2018/3/29.
 */

var path_effect = "gameyj_mj/common/audio/mj_effect/";
var dbmj_path_boy = "gameyj_mj/common/audio/mj_dongBeiHua/boy/";
var dbmj_path_girl = "gameyj_mj/common/audio/mj_dongBeiHua/girl/";

var nmmj_path_boy = "gameyj_mj/common/audio/mj_neiMengHua/boy/";
var nmmj_path_girl = "gameyj_mj/common/audio/mj_neiMengHua/girl/";
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var mj_audio = {

    playAduio: function (name) {
        AudioManager.playSound(path_effect + name);
    },

    playAudioBySex: function (name, sex) {
        let path_boy = dbmj_path_boy;
        let path_girl = dbmj_path_girl;

        if (RoomMgr.Instance().isTuiDaoHuMJ()) {
            path_boy = nmmj_path_boy;
            path_girl = nmmj_path_girl;
        }

        if (sex == 1) {
            AudioManager.playSound(path_boy + name);
        } else {
            AudioManager.playSound(path_girl + name);
        }
    },
};

module.exports = mj_audio;
