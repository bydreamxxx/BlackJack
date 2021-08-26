var AudioError = {
    MUSIC_PARAM: "音乐参数错误",
    SOUND_PARAM: "音效参数错误",
    VOICE_PARAM: "语音参数错误",
};

var AudioWarning = {
    MUSIC_PLAY_NOT_FOUND: "音乐播放失败，没有找到mp3文件",
    SOUND_PLAY_NOT_FOUND: "音效播放失败，没有找到mp3文件",
    VOICE_PLAY_NOT_FOUND: "语音播放失败，没有找到mp3文件",
    MUSIC_STOP_NOT_FOUND: "音乐停止失败，没有找到相关ID",
    SOUND_STOP_NOT_FOUND: "音效停止失败，没有找到相关ID",
    VOICE_STOP_NOT_FOUND: "语音停止失败，没有找到相关ID",
    MUSIC_PAUSE_NOT_FOUND: "音乐暂停失败，没有找到相关ID",
    SOUND_PAUSE_NOT_FOUND: "音效暂停失败，没有找到相关ID",
    VOICE_PAUSE_NOT_FOUND: "语音暂停失败，没有找到相关ID",
    MUSIC_RESUME_NOT_FOUND: "音乐恢复失败，没有找到相关ID",
    SOUND_RESUME_NOT_FOUND: "音效恢复失败，没有找到相关ID",
    VOICE_RESUME_NOT_FOUND: "语音恢复失败，没有找到相关ID",
};

// 声音状态
var AudioState = {
    ERROR: -1,
    INITIALZING: 0,
    PLAYING: 1,
    PAUSED: 2,
};

// 声音类型
var AudioType = {
    MUSIC: 0,
    SOUND: 1,
    VOICE: 2,
};

// 声音音量存储本地标识
var AudioLocalVolume = {
    LOCAL_MUSIC_VOLUME: "LOCAL_MUSIC_VOLUME",
    LOCAL_SOUND_VOLUME: "LOCAL_SOUND_VOLUME",
    LOCAL_VOICE_VOLUME: "LOCAL_VOICE_VOLUME",
};

// 声音开关存储本地标识
var AudioLocalSwitch = {
    LOCAL_MUSIC_SWITCH: "LOCAL_MUSIC_SWITCH",
    LOCAL_SOUND_SWITCH: "LOCAL_SOUND_SWITCH",
    LOCAL_VOICE_SWITCH: "LOCAL_VOICE_SWITCH",
};

module.exports = {
    AudioError: AudioError,
    AudioWarning: AudioWarning,
    AudioState: AudioState,
    AudioType: AudioType,
    AudioLocalVolume: AudioLocalVolume,
    AudioLocalSwitch: AudioLocalSwitch,
};