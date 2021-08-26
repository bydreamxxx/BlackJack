/**
 * Created by Mac_Li on 2017/7/25.
 */

var com_strConfig = {
    popBoxstr:['您的网络不稳定！','退出','重试'],
    reConnetstr: '正在尝试重新连接...',
    noLink:'请连接网络后重试!',
    linkTimeOut:'连接超时, 是否重连?',
    networkError:'网络出错, 是否重连?',
    //todo:后期移到excel表
    net_retry: '重连',
    net_open_time_out: '连接超时',
    net_heart_time_out: '网络不稳定',
    net_error: '网络出错',
    net_no_internet: '连接超时，或本机已与网络断开!',
    net_return_enter: '返回登录',
};

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length < 1) {
        return result;
    }

    var data = arguments;        //如果模板参数是数组
    if (arguments.length == 1 && typeof (args) == "object") {
        //如果模板参数是对象
        data = args;
    }
    for (var key in data) {
        var value = data[key];
        if (undefined != value) {
            result = result.replace("{" + key + "}", value);
        }
    }
    return result;
};

module.exports=com_strConfig;