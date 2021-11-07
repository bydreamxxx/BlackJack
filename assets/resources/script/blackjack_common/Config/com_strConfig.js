/**
 * Created by Mac_Li on 2017/7/25.
 */

var com_strConfig = {
    popBoxstr:['networkinstable','exit','Reconnection'],
    reConnetstr: 'reconnect',
    noLink:'connect',
    linkTimeOut:'Networkerror',
    networkError:'Networkerror',
    //todo:后期移到excel表
    net_retry: 'Reconnection',
    net_open_time_out: 'Connectiontimedout',
    net_heart_time_out: 'Networkinstability',
    net_error: 'Networkerror1',
    net_no_internet: 'duanwangtishi',
    net_return_enter: 'returntologin',
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