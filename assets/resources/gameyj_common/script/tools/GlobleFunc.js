/**
 * Created by shen on 2017/9/14.
 */

const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;

/**
 * [from native begin]
 */

/**
 * 播放录音
 * @param account 云账号
 * @param duration 录音时长d
 */

window.playRecord = function(account, duration){
    cc.log('AudioChat::语音时长:', duration,', account:', account);
    RecordEd.notifyEvent(RecordEvent.PLAY_RECORD, {accid:account, duration:duration});
}

/**
 * [from native end]
 */
