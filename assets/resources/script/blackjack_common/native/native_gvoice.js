
let GVoiceState = cc.Enum({
    None: 1,
    Idle: 2,
    Downloading: 3,
    Playing: 4,
});

const userIDSign = "userid=";

const Event = cc.Enum({
    PLAY_GVOICE: 'gvoice_play_gvoice',
    STOP_GVOICE: 'gvoice_stop_gvoice',
});
const Ed = new cc.dd.EventDispatcher();

var Native = cc.Class({

    statics: {
        s_native: null,

        Instance: function () {
            if (!this.s_native) {
                this.s_native = new Native();
            }
            return this.s_native;
        },

        Destroy: function () {
            if (this.s_native) {
                this.s_native = null;
            }
        },
    },

    ctor: function () {
        this.GVoiceLoginTimes = 0;
        this.regNativeCallFunc();
        this.state = GVoiceState.None;
        this.record_files = new Array();
        this.speaking_user_id = null;
        this.speaking_file_path = null;
    },

    regNativeCallFunc: function () {

        /**
         * 登录回调
         * @type {()}
         */
        cc.onGVoiceLogin = function (code) {
            if (code == 0) {
                cc.log("腾讯GVoice 登录成功");
                this.GVoiceLoginTimes = 0;
                this.state = GVoiceState.Idle;
            } else {
                this.GVoiceLoginTimes++;
                if (this.GVoiceLoginTimes >= 5) {
                    return;
                }
                cc.log("腾讯GVoice 登录失败 code=", code, " 尝试登录次数=", this.GVoiceLoginTimes);
                cc.dd.SysTools.keepNetOk(function () {
                    let GVoice_acc = require("AppConfig").GVOICE_ACC;
                    cc.dd.native_gvoice.login(GVoice_acc.game_id, GVoice_acc.macro.KEY, GVoice_acc.server_info, cc.dd.user.id);
                });
            }
        }.bind(this);

        /**
         * 上传回调
         * @type {()}
         */
        cc.onGVoiceUploadFile = function (code, file_id) {
            if (code != 0) {
                cc.log("腾讯GVoice 上传失败 code=", code);
                return;
            }
            cc.log("腾讯GVoice 上传完成");

            var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
            var chatInfo = new cc.pb.room_mgr.chat_info();
            var gameInfo = new cc.pb.room_mgr.common_game_header();
            var RoomMgr = require('jlmj_room_mgr').RoomMgr;
            gameInfo.setGameType(RoomMgr.Instance().gameId);
            gameInfo.setRoomId(RoomMgr.Instance().roomLv);
            chatInfo.setGameInfo(gameInfo);
            chatInfo.setMsgType(4);
            chatInfo.setMsg(file_id);
            pbObj.setChatInfo(chatInfo);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

            //用户玩家单机处理
            this.pushDownloadQueue(file_id, cc.dd.user.id);
        }.bind(this);


        /**
         * 下载回调
         * @type {()}
         */
        cc.onGVoiceDownloadFile = function (code, file_path, file_name) {
            if (code != 0) {
                cc.log("腾讯GVoice 下载失败 code=", code);
                this.state = GVoiceState.Idle;
                this.download();
                return;
            }
            cc.log("腾讯GVoice 下载完成");
            let file_names = file_name.split(userIDSign);
            let user_id_len = parseInt(file_names[0]);
            let user_id = file_names[1].substr(0, user_id_len);
            this.playMessage(file_path, user_id);
        }.bind(this);

        /**
         * 播放完成回调
         * @param file_path
         */
        cc.onGVoicePlayEnd = function (code, file_path, file_name) {
            if (code != 0) {
                cc.log("腾讯GVoice 播放失败 code=", code);
                this.state = GVoiceState.Idle;
                this.download();
                return;
            }
            let file_names = file_name.split(userIDSign);
            let user_id_len = parseInt(file_names[0]);
            let user_id = file_names[1].substr(0, user_id_len);
            cc.log("腾讯GVoice 结束播放 ", user_id);
            AudioManager.finishPlayRecord();
            Ed.notifyEvent(Event.STOP_GVOICE, [user_id]);
            this.state = GVoiceState.Idle;
            this.download();
        }.bind(this);
    },

    /**
     * 登录
     * @param game_id
     * @param key
     * @param user_id
     */
    login(game_id, key, server_info, user_id) {
        // if (!cc.sys.isNative)
            return;

        if (cc.sys.OS_ANDROID == cc.sys.os) {
            // jsb.reflection.callStaticMethod('game/GVoiceMessage', 'init', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', game_id, key, server_info, user_id.toString());
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            // jsb.reflection.callStaticMethod('GVoiceMessage', 'init:withKey:serverInfo:andUserId:', game_id, key, server_info, user_id.toString());
        }
    },

    /**
     * 开始录音
     */
    startRecord() {
        if (this.state == GVoiceState.None) {
            cc.error("腾讯GVoice 未登陆成功,不能使用语音");
            return;
        }
        if (this.state == GVoiceState.Idle) {
            cc.log("腾讯GVoice 开始录音 ");
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                // jsb.reflection.callStaticMethod('game/GVoiceMessage', 'startRecord', '()V');
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                // jsb.reflection.callStaticMethod('GVoiceMessage', 'startRecord');
            }
            return true;
        } else if (this.state == GVoiceState.Playing) {
            this.stopMessage();
            //cc.dd.PromptBoxUtil.show("语音播放中，请稍后");
            return false;
        } else if (this.state == GVoiceState.Downloading) {
            cc.dd.PromptBoxUtil.show("喝杯茶休息会再发");
            return false;
        }
    },

    /**
     * 结束录音
     */
    stopRecord() {
        if (this.state == GVoiceState.None) {
            cc.error("腾讯GVoice 未登陆成功,不能使用语音");
            return;
        }
        cc.log("腾讯GVoice 结束录音 ");
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            // jsb.reflection.callStaticMethod('game/GVoiceMessage', 'stopRecord', '()V');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            // jsb.reflection.callStaticMethod('GVoiceMessage', 'stopRecord');
        }
    },

    /**
     * 上传录音
     */
    upload() {
        if (this.state == GVoiceState.None) {
            cc.error("腾讯GVoice 未登陆成功,不能使用语音");
            return;
        }
        cc.log("腾讯GVoice 开始上传");
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            // jsb.reflection.callStaticMethod('game/GVoiceMessage', 'upload', '()V');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            // jsb.reflection.callStaticMethod('GVoiceMessage', 'upload');
        }
    },

    /**
     * 加入下载队列
     */
    pushDownloadQueue(file_id, speak_user_id) {
        if (this.state == GVoiceState.None) {
            cc.error("腾讯GVoice 未登陆成功,不能使用语音");
            return;
        }
        let file_path = speak_user_id.toString().length + userIDSign + speak_user_id + file_id;
        this.record_files.push(file_path);
        this.download();
    },

    /**
     * 开始播放
     */
    download() {
        if (this.state == GVoiceState.None) {
            cc.error("腾讯GVoice 未登陆成功,不能使用语音");
            return;
        }
        if (this.state == GVoiceState.Idle && this.record_files.length > 0) {
            this.state = GVoiceState.Downloading;
            let file_path = this.record_files.pop();
            let file_names = file_path.split(userIDSign);
            let user_id_len = parseInt(file_names[0]);
            let user_id = file_names[1].substr(0, user_id_len);
            let file_id = file_names[1].substr(user_id_len);
            cc.log("腾讯GVoice 开始下载 ", user_id);
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                // jsb.reflection.callStaticMethod('game/GVoiceMessage', 'download', '(Ljava/lang/String;Ljava/lang/String;)V', file_id, file_path);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                // jsb.reflection.callStaticMethod('GVoiceMessage', 'download:withPath:', file_id, file_path);
            }
        }
    },

    /**
     * 开始播放
     */
    playMessage(file_path, speak_user_id) {
        if (this.state == GVoiceState.None) {
            cc.error("腾讯GVoice 未登陆成功,不能使用语音");
            return;
        }
        if (this.state == GVoiceState.Playing) {
            cc.error("腾讯GVoice 正在播放中")
            this.record_files.push(file_path);
            return;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            // jsb.reflection.callStaticMethod('game/GVoiceMessage', 'playMessage', '(Ljava/lang/String;)V', file_path);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            // jsb.reflection.callStaticMethod('GVoiceMessage', 'playMessage:', file_path);
        }

        cc.log("腾讯GVoice 开始播放 ", speak_user_id);
        AudioManager.playingRecord();
        this.state = GVoiceState.Playing;
        this.speaking_user_id = speak_user_id;
        this.speaking_file_path = file_path;
        Ed.notifyEvent(Event.PLAY_GVOICE, [speak_user_id]);
    },

    /**
     * 结束播放
     */
    stopMessage() {
        if (this.state == GVoiceState.None) {
            cc.error("腾讯GVoice 未登陆成功,不能使用语音");
            return;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            // jsb.reflection.callStaticMethod('game/GVoiceMessage', 'stopMessage', '(Ljava/lang/String;)V', this.speaking_file_path);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            // jsb.reflection.callStaticMethod('GVoiceMessage', 'stopMessage:', this.speaking_file_path);
        }

        cc.log("腾讯GVoice 停止播放 ", this.speaking_user_id);
        AudioManager.finishPlayRecord();
        Ed.notifyEvent(Event.STOP_GVOICE, [this.speaking_user_id]);
        this.state = GVoiceState.Idle;
        this.download();
    }
});

module.exports = {
    Native: Native,
    GVoiceState: GVoiceState,
    Event: Event,
    Ed: Ed,
};
