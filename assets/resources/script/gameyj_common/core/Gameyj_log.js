/**
 * Created by Mac_Li on 2017/8/5.
 */
var _endcall=null;
cc.uploadLogEndCall = function (code) {
    if(_endcall){
        _endcall(Number(code));
        _endcall= null;
    }
};
var Gameyj_log= {
    /**
     * 打印日志到文件中
     * @param type     打印类型1 - 3  info  wran  error
     * @param modeName 模块名
     * @param msg      信息
     */
    logToFile:function (type, modeName, msg) {
        if(cc.sys.isNative){
            logJsFun.writeLog(type, modeName, msg);
        }
    },
    /**
     * 配置日志文件到个数 以及路径
     * @param filePath   日志文件的保存路径
     * @param maxfile    单个日志文件的大小
     * @param maxConut   最多保存多少个文件  指单个模块的文件个数
     */
    logConfig:function (filePath, maxfile, maxConut) {
        if(cc.sys.isNative){
            logJsFun.start(filePath, maxfile,maxConut);
        }
    },
    /**
     *  刷新日志文件
     * @param modeName  不传则全部模块都刷新
     */
    flushLog:function (modeName) {
        if(cc.sys.isNative){
            if(!modeName){
                logJsFun.flushFile('ALL_MODE');
            }else {
                logJsFun.flushFile(modeName);
            }
        }
    },
    /**
     * 上传日志文件到服务器
     * @param filepath
     * @param userID
     * @param IP
     * @param endCall
     */
    uploadlog:function (filepath, userID, IP, endCall) {
        if(cc.sys.isNative) {
            if(filepath && userID && IP){
                _endcall = endCall;
                if(typeof(userID)!='string')
                {
                    userID = userID+'';
                }
                logJsFun.uploadLog(filepath, userID, IP, 'uploadLogEndCall');

            }
        }
    },
    /**
     * 打印日志到控制台
     */
    logToConsle:function () {

    },

};

module.exports = Gameyj_log;