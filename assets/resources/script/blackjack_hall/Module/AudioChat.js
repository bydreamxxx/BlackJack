/**
 * Created by shen on 2017/9/5.
 */
const CheckSumBuilder = require('CheckSumBuilder');
const RecordEvent = cc.Enum({
    PLAY_RECORD:'play_record',
    PLAY_GVOICE:'play_gvoice',
    STOP_GVOICE:'stop_gvoice',
});
const RecordEd = new cc.dd.EventDispatcher();
const AudioChat = {
    /**
     * 创建网易云id
     * @param userid
     * @param cb
     */
    createAccid:function (userid, cb) {
        return;

        var url = 'https://api.netease.im/nimserver/user/create.action';
        this._sendPost(userid, cb, url);
    },

    /**
     * 更新网易云id
     * @param userid
     * @param cb
     */
    updateAccid:function (userid, cb) {
        return;

        var url = 'https://api.netease.im/nimserver/user/update.action';
        this._sendPost(userid, cb, url);
    },

    /**
     * 刷新token
     * @param userid
     * @param cb
     */
    updateToken:function (userid, cb) {
        return;

        var url = 'https://api.netease.im/nimserver/user/refreshToken.action';
        this._sendPost(userid, cb, url);
    },

    _sendPost:function (userid, cb, url) {
        return;

        var self = this;
        var xhr = XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                var respone = xhr.responseText;
                respone = JSON.parse(respone);
                if(respone.code == 414){
                    self.updateToken(userid, cb);
                }else{
                    var msg = respone.info;
                    cb(msg);
                }
            }else{
                cb(-1);
            }
        };
        xhr.open('POST', url, true);

        var appKey = 'd9ed676fd7ddd98444f45eb8b3504dfd';
        var appSecret = '52207dfe830f';
        // var appKey = 'dfa7001d309450b6e9e15f9649c27012';
        // var appSecret = 'b25689db3ad5';
        var nonce = '123456';
        var curTime = (Math.floor((new Date().getTime()) / 1000)).toString();
        var checkSum = CheckSumBuilder.getCheckSum(appSecret, nonce ,curTime);

        // 设置请求的header
        xhr.setRequestHeader('AppKey', appKey);
        xhr.setRequestHeader('Nonce', nonce);
        xhr.setRequestHeader('CurTime', curTime);
        xhr.setRequestHeader('CheckSum', checkSum);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

        xhr.timeout = 5000;
        xhr.ontimeout = function (e) {
            cc.log('语音登录:注册云账号超时!:', e);
            self.createAccid(userid, cb);
        };
        xhr.onerror = function (e) {
            cc.log('语音登录:注册云账号网络错误!:', e);
            self.createAccid(userid, cb);
        };
        var params = 'accid='+(cc.dd.prefix+userid);
        xhr.send(params);
    },

    ///////////////////////////////////////////////////////////////////////////////
    /**
     * [to native begin]
     */

    /**
     * 录音开始
     */
    startRecord:function () {
        return;

        if(!cc.sys.isNative){
            return;
        }
        AudioManager.startRecord();
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('com/anglegame/blackjack/record/GameChat', 'startRecord', '()V');
        }else if(cc.sys.OS_IOS == cc.sys.os){
            jsb.reflection.callStaticMethod('GameChat', 'startRecord');
        }
    },

    /**
     * 录音取消
     */
    cancelRecord:function () {
        return;

        if(!cc.sys.isNative){
            return;
        }
        AudioManager.cancelRecord();
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('com/anglegame/blackjack/record/GameChat', 'cancelRecord', '()V');
        }else if(cc.sys.OS_IOS == cc.sys.os){
            jsb.reflection.callStaticMethod('GameChat', 'cancelRecord');
        }
    },

    /**
     * 录音结束
     */
    completeRecord:function () {
        return;

        if(!cc.sys.isNative){
            return;
        }
        AudioManager.completeRecord();
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('com/anglegame/blackjack/record/GameChat', 'completeRecord', '()V');
        }else if(cc.sys.OS_IOS == cc.sys.os){
            jsb.reflection.callStaticMethod('GameChat', 'completeRecord');
        }
    },

    /**
     * 登录im服务器
     */
    loginIm:function (account, token) {
        return;

        if(!cc.sys.isNative){
            return;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod(
                'com/anglegame/blackjack/record/GameChat',
                'loginIm',
                '(Ljava/lang/String;Ljava/lang/String;)V',
                account, token
            );
        }else if(cc.sys.OS_IOS == cc.sys.os){
            jsb.reflection.callStaticMethod('GameChat', 'loginIm:withToken:', account, token);
        }
    },

    /**
     * 增加聊天对象
     * @param account
     */
    addUser:function (account) {
        return;

        account = cc.dd.prefix+account;
        if(!cc.sys.isNative){
            return;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('com/anglegame/blackjack/record/GameChat', 'addUser', '(Ljava/lang/String;)V', account);
        }else if(cc.sys.OS_IOS == cc.sys.os){
            jsb.reflection.callStaticMethod('GameChat', 'addUser:', account);
        }
    },

    /**
     * 移除聊天对象
     * @param account
     */
    removeUser:function (account) {
        return;

        account = cc.dd.prefix+account;
        if(!cc.sys.isNative){
            return;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('com/anglegame/blackjack/record/GameChat', 'removeUser', '(Ljava/lang/String;)V', account);
        }else if(cc.sys.OS_IOS == cc.sys.os){
            jsb.reflection.callStaticMethod('GameChat', 'removeUser:', account);
        }
    },

    /**
     * 清空聊天对象
     * @param account
     */
    clearUsers:function () {
        return;

        if(!cc.sys.isNative){
            return;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('com/anglegame/blackjack/record/GameChat', 'clearUsers', '()V');
        }else if(cc.sys.OS_IOS == cc.sys.os){
            jsb.reflection.callStaticMethod('GameChat', 'clearUsers');
        }
    },

    /**
     * [to native end]
     */
    ////////////////////////////////////////////////////////////////////////////////////////
};

module.exports = {
    RecordEvent:RecordEvent,
    RecordEd:RecordEd,
    AudioChat:AudioChat,
};