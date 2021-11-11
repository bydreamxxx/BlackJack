/**
 * 平台id
 * @type {any}
 */
var PID = cc.Enum({
    TEST_INSIDE: 1,  //内网测试服
    TEST_OUTSIDE: 2, //外网测试服
    PUBLISH: 3,      //正式服
});

/**
 * 服务器列表
 * @type {Array}
 */
var Servers = new Array(4);
// Servers[1] = { ip: "123.56.150.124", port: "3801" };
// Servers[2] = { ip: "123.56.150.124", port: "3801" };
// Servers[3] = { ip: "123.56.150.124", port: "3801" };
Servers[1] = { ip: "42.193.2.94", port: "3801" };
Servers[2] = { ip: "42.193.2.94", port: "3801" };
Servers[3] = { ip: "42.193.2.94", port: "3801" };
/**klb_dl_hall_spring_festival_activity
 * 巷乐棋牌 App下载地址
 * @type {Array}
 */
var AppUrl = new Array(4);
// AppUrl[1] = "https://d.alphaqr.com/jlmjInsideAndroid";
// AppUrl[2] = "https://d.alphaqr.com/247testAndroid";
// AppUrl[3] = "https://www.yuejiegame.com/download.html";
AppUrl[1] = "";
AppUrl[2] = "";
AppUrl[3] = "";
/**
 * 吉林麻将 App下载地址
 * @type {Array}
 */
var jlmjUrl = new Array(4);
// jlmjUrl[1] = "https://d.alphaqr.com/jlmjInsideAndroid";
// jlmjUrl[2] = "https://d.alphaqr.com/247testAndroid";
// jlmjUrl[3] = "https://www.yuejiegame.com/download.html";
jlmjUrl[1] = "";
jlmjUrl[2] = "";
jlmjUrl[3] = "";
/**
 * 获取游戏下载地址
 * @param PID   游戏平台id [巷乐棋牌,吉林麻将]
 * @param pid   分发平台id [正式服,测试服]
 */
var get_app_url = function (GAME_PID, pid) {
    var ulr = [jlmjUrl, AppUrl];
    if (cc._chifengGame)
        // return "http://d.firim.pro/b4t2x";
        return "";
    if (GAME_PID > 9999)
        // return 'http://tg.yuejiegame.net/index.html?channel=' + GAME_PID + '02'
        return ''
    else
        return ulr[GAME_PID][pid];
};


/**
 * 购买地址
 */
var PayUrl = new Array(4);
// PayUrl[1] = "http://114.215.42.41:3802/wxpay/order";
// PayUrl[2] = "http://123.56.150.124:3808/wxpay/order";
// PayUrl[3] = "http://114.215.42.41:3802/wxpay/order";
PayUrl[1] = "";
PayUrl[2] = "";
PayUrl[3] = "";


/**
 * 订单请求地址,汇付宝
 */
var PaySDKOrder = new Array(4);
PaySDKOrder[1] = "";
PaySDKOrder[2] = "";
PaySDKOrder[3] = "";
// PaySDKOrder[1] = "http://123.56.150.124:3808/heepay/h5param";
// PaySDKOrder[2] = "http://123.56.150.124:3808/heepay/h5param";
// PaySDKOrder[3] = "http://gameweb.yuejiegame.com:4027/heepay/h5param";
/**
 * 爱贝支付地址
 * @type {Array}
 */
var IpayUrl = new Array(4);
// IpayUrl[1] = "http://192.168.2.175:9898/trade/index.php/Home/Index/moneyOrder";
// IpayUrl[2] = "http://share.yuejiegame.com/payshunt";
// IpayUrl[3] = "http://tg.yuejiegame.net/payshunt";
IpayUrl[1] = "";
IpayUrl[2] = "";
IpayUrl[3] = "";

var QRCode = new Array(4);
QRCode[1] = 'gameyj_ddz/common/texture/247QRCode';
QRCode[2] = 'gameyj_ddz/common/texture/247QRCode';
QRCode[3] = 'gameyj_ddz/common/texture/releaseQRcode';

var RecordUrl = new Array(4);
// RecordUrl[1] = 'http://47.94.10.64:3806/';
// // RecordUrl[1] = 'http://123.56.150.124:3806/';
// RecordUrl[2] = 'http://47.94.10.64:3806/';
// RecordUrl[3] = 'http://39.107.247.165:8881/';
RecordUrl[1] = 'http://42.193.2.94:3806/';
RecordUrl[2] = 'http://42.193.2.94:3806/';
RecordUrl[3] = 'http://42.193.2.94:3806/';

var serFileUrl = new Array(4);
// serFileUrl[1] = 'http://47.92.48.105:8888/servlist.json';
// serFileUrl[2] = 'http://game.yuejiegame.net/servlist.json';
// serFileUrl[3] = 'http://game.yuejiegame.net/servlist.json';
serFileUrl[1] = '';
serFileUrl[2] = '';
serFileUrl[3] = '';

//机器人头像地址
var robotUrl = new Array(4);
robotUrl[1] = 'http://139.155.70.226/head/';
robotUrl[2] = 'http://139.155.70.226/head/';
robotUrl[3] = 'http://139.155.70.226/head/';
// robotUrl[1] = '';
// robotUrl[2] = '';
// robotUrl[3] = '';

var getRobotUrl = function () {
    var AppCfg = require('AppConfig');
    return robotUrl[AppCfg.PID];
};

var is_version_num_url = new Array(4);
is_version_num_url[1] = true;
is_version_num_url[2] = true;
is_version_num_url[3] = true;

var down_url_origin = new Array(4);
down_url_origin[1] = "trunk_247";
down_url_origin[2] = "trunk_247";
down_url_origin[3] = "trunk_247";

var down_url_version = new Array(4);
down_url_version[1] = "trunk_247_version";
down_url_version[2] = "trunk_247_version";
down_url_version[3] = "trunk_247_version";

var down_url_version_rgba8888 = new Array(4);
down_url_version_rgba8888[1] = "trunk_247_version_rgba8888";
down_url_version_rgba8888[2] = "trunk_247_version_rgba8888";
down_url_version_rgba8888[3] = "trunk_247_version_rgba8888";

//苹果内购后台地址
var appleInAppPayUrl = new Array(4);
// appleInAppPayUrl[1] = "http://192.168.2.175:9898/trade/index.php/Home/AppStore/result";
// appleInAppPayUrl[2] = "http://192.168.2.175:9898/trade/index.php/Home/AppStore/result";
// appleInAppPayUrl[3] = "http://39.107.247.165:8088/index.php/Home/AppStore/result";
appleInAppPayUrl[1] = "";
appleInAppPayUrl[2] = "";
appleInAppPayUrl[3] = "";

var hwIAPUrl = new Array(4);
hwIAPUrl[1] = "";
hwIAPUrl[2] = "";
hwIAPUrl[3] = "";
// hwIAPUrl[1] = "http://192.168.2.66/index.php/Home/HwTrade/order";
// hwIAPUrl[2] = "http://test.yuejiegame.net/index.php/Home/HwTrade/order";
// hwIAPUrl[3] = "http://zf.yuejiegame.net/index.php/Home/HwTrade/order";

var vivoIAPUrl = new Array(4);
vivoIAPUrl[1] = "";
vivoIAPUrl[2] = "";
vivoIAPUrl[3] = "";
// vivoIAPUrl[1] = "http://192.168.2.66/index.php/Home/VivoTrade/getVivoPayInfor";
// vivoIAPUrl[2] = "http://test.yuejiegame.net/index.php/Home/VivoTrade/getVivoPayInfor";
// vivoIAPUrl[3] = "http://zf.yuejiegame.net/index.php/Home/VivoTrade/getVivoPayInfor";

var oppoIAPUrl = new Array(4);
oppoIAPUrl[1] = "";
oppoIAPUrl[2] = "";
oppoIAPUrl[3] = "";
// oppoIAPUrl[1] = "http://trade64.yuejiegame.net//index.php/Home/OppoTrade/orderCallback";
// oppoIAPUrl[2] = "http://test.yuejiegame.net/index.php/Home/OppoTrade/orderCallback";
// oppoIAPUrl[3] = "http://zf.yuejiegame.net/index.php/Home/OppoTrade/orderCallback";

var xiaomiIAPUrl = new Array(4);
xiaomiIAPUrl[1] = "";
xiaomiIAPUrl[2] = "";
xiaomiIAPUrl[3] = "";
// xiaomiIAPUrl[1] = "http://trade64.yuejiegame.net/index.php/Home/MiTrade/orderCallback";
// xiaomiIAPUrl[2] = "http://test.yuejiegame.net/index.php/Home/MiTrade/orderCallback";
// xiaomiIAPUrl[3] = "http://zf.yuejiegame.net/index.php/Home/MiTrade/orderCallback";

var clientActionUrl = new Array(4);
clientActionUrl[1] = "";
clientActionUrl[2] = "";
clientActionUrl[3] = "";
// clientActionUrl[1] = "http://192.168.2.66/api/action?user_id={0}&action_id={1}";
// clientActionUrl[2] = "http://123.56.150.124:8001/api/action?user_id={0}&action_id={1}";
// clientActionUrl[3] = "http://192.168.2.66/api/action?user_id={0}&action_id={1}";

var wxShareGameUrl = new Array(4);
wxShareGameUrl[1] = "";
wxShareGameUrl[2] = "";
wxShareGameUrl[3] = "";
// wxShareGameUrl[1] = cc._chifengGame ? "http://d.firim.pro/b4t2x" : "http://tg.yuejiegame.net/roomshare";
// wxShareGameUrl[2] = cc._chifengGame ? "http://d.firim.pro/b4t2x" : "http://tg.yuejiegame.net/roomshare";
// wxShareGameUrl[3] = cc._chifengGame ? "http://d.firim.pro/b4t2x" : "http://tg.yuejiegame.net/roomshare";

var fixGameUrl = "";
// var fixGameUrl = "https://www.yuejiegame.com/download.html";
var shareGameUrl = "";
// var shareGameUrl = "http://tg.yuejiegame.net/index";
if (cc.game_pid == 10006)
    // shareGameUrl = "http://d.firim.pro/b4t2x";
    shareGameUrl = "";
// if (cc.game_pid == 10008)
//     shareGameUrl = "http://d.alphaqr.com/cfwdmj";
// if (cc.game_pid == 10010)
//     shareGameUrl = "http://d.alphaqr.com/cfpzm";
var accountUrl = "http://42.193.2.94:8081/";//47.92.129.247:8100
// var accountUrl = "http://39.106.30.21:8081/";//47.92.129.247:8100
var newHeadUrl = new Array(4);
newHeadUrl[1] = "http://42.193.2.94:60602/";
newHeadUrl[2] = "http://42.193.2.94:60602/";
newHeadUrl[3] = "http://42.193.2.94:60602/";
// newHeadUrl[1] = "http://123.56.150.124:60602/";
// newHeadUrl[2] = "http://123.56.150.124:60602/";
// newHeadUrl[3] = "http://39.107.247.165:9999/";

var fxylUrl = new Array(4);
fxylUrl[1] = "";
fxylUrl[2] = "";
fxylUrl[3] = "";
// fxylUrl[1] = "http://tg.yuejiegame.net/wechat/auth/share?";
// fxylUrl[2] = "http://tg.yuejiegame.net/wechat/auth/share?";
// fxylUrl[3] = "http://tg.yuejiegame.net/wechat/auth/login.html?";

var wxShareFriendGroupUrl = new Array(4);
wxShareFriendGroupUrl[1] = "";
wxShareFriendGroupUrl[2] = "";
wxShareFriendGroupUrl[3] = "";
// wxShareFriendGroupUrl[1] = cc._chifengGame ? "http://d.firim.pro/b4t2x" : "http://tg.yuejiegame.net/roomshare";
// wxShareFriendGroupUrl[2] = cc._chifengGame ? "http://d.firim.pro/b4t2x" : "http://tg.yuejiegame.net/roomshare";
// wxShareFriendGroupUrl[3] = cc._chifengGame ? "http://d.firim.pro/b4t2x" : "http://tg.yuejiegame.net/roomshare";

var uploadLogUrl = new Array(4);
uploadLogUrl[1] = "";
uploadLogUrl[2] = "";
uploadLogUrl[3] = "";
// uploadLogUrl[1] = "http://123.56.150.124:1583/interface/uploadlogfile";
// uploadLogUrl[2] = "http://47.94.10.64:1583/interface/uploadlogfile";
// uploadLogUrl[3] = "http://39.106.54.55:22936/interface/uploadlogfile";

var kefuUrl = new Array(4);
kefuUrl[1] = "";
kefuUrl[2] = "";
kefuUrl[3] = "";
// kefuUrl[1] = "http://kf.yuejiegame.net";
// kefuUrl[2] = "http://47.94.10.64:9099";
// kefuUrl[3] = "http://kf.yuejiegame.net";

var activeSpread = new Array(4);
activeSpread[1] = "";
activeSpread[2] = "";
activeSpread[3] = "";
// activeSpread[1] = "http://gather.yuejiegame.com/index.php/otheragent/";
// activeSpread[2] = "http://gather.yuejiegame.com/index.php/otheragent/";
// activeSpread[3] = "http://agent1.yuejiegame.cn/index.php/otheragent/";

module.exports = {
    PID: PID,
    Servers: Servers,
    AppUrl: AppUrl,
    PayUrl: PayUrl,
    PaySDKOrder: PaySDKOrder,
    jlmjUrl: jlmjUrl,
    GetAppUrl: get_app_url,
    QRCode: QRCode,
    RecordUrl: RecordUrl,
    serFileUrl: serFileUrl,
    IpayUrl: IpayUrl,
    is_version_num_url: is_version_num_url,
    down_url_origin: down_url_origin,
    down_url_version: down_url_version,
    down_url_version_rgba8888: down_url_version_rgba8888,
    GetRobotUrl: getRobotUrl,
    appleInAppPayUrl: appleInAppPayUrl,
    clientActionUrl: clientActionUrl,
    wxShareGameUrl: wxShareGameUrl,
    fixGameUrl: fixGameUrl,
    shareGameUrl: shareGameUrl,
    accountUrl: accountUrl,
    activeSpread: activeSpread,
    fxylUrl: fxylUrl,
    wxShareFriendGroupUrl: wxShareFriendGroupUrl,
    uploadLogUrl: uploadLogUrl,
    kefuUrl: kefuUrl,
    newHeadUrl: newHeadUrl,
    hwIAPUrl: hwIAPUrl,
    vivoIAPUrl: vivoIAPUrl,
    oppoIAPUrl: oppoIAPUrl,
    xiaomiIAPUrl: xiaomiIAPUrl,
};
