/**
 * Created by yons on 2017/5/10.
 */
// cc._appstore_check = false && (cc.game_pid > 0 && cc.game_pid < 10000) && (cc.sys.os == cc.sys.OS_IOS);
// cc._isAppstore = true && (cc.game_pid > 0 && cc.game_pid < 10000); //&& (cc.sys.os == cc.sys.OS_IOS);
// cc._chifengGame = cc.game_pid == 10006 || cc.game_pid == 10008 || cc.game_pid == 10010;//cc.game_pid == 0;//赤峰游戏
// cc._useChifengUI = cc._chifengGame || cc.game_pid == 10003 || cc.game_pid == 10004 || cc.game_pid == 10013;;//使用赤峰的亲友圈界面
// cc._androidstore_check = false && (cc.sys.os == cc.sys.OS_ANDROID) && (cc.game_pid == 10012 || cc.game_pid == 10017 || cc.game_pid == 2);
// cc._themeStyle = cc.game_pid != 10003 ? 0 : 1;//0为绿色夏天主题，1为蓝色冬天主题

// cc._useCardUI = cc.game_pid == 10000 || cc.game_pid == 10001 || cc.game_pid == 10002 || cc.game_pid == 10005 || cc.game_pid == 10007 || cc.game_pid == 10009 || cc.game_pid == 10011 || cc.game_pid == 10014;//屏蔽金币场
// cc._isKuaiLeBaTianDaKeng = cc.game_pid == 10012 || cc.game_pid == 10015 || cc.game_pid == 10017 || cc.game_pid == 10018;//快乐吧填大坑
// cc._isXiangYueYuLe = cc.game_pid == 10016;//享悦娱乐

// cc._applyForPayment = false;

//游戏大厅选择类型
var HALL_TYPE = [
    "blackjack_hall_texas",
    "blackjack_hall",
];
// var LOGIN_SCENE = [
//     "jlmj_login",
//     "jlmj_login",
//     "gamedl_login", //快乐吧麻将
//     "xyyl_login",
// ];
module.exports = {
    // 是否上传Log至服务器(native)
    IS_UPLOAD_LOG: false,
    // 默认的日志上传服务器
    // UPLOAD_LOG_HOST: "http://123.56.104.237:9090/log",
    UPLOAD_LOG_HOST: "",
    //录音开关
    OPEN_RECORD: true,
    // 是否调试模式(会上传LOG至服务器)
    IS_DEBUG: cc.dd._.isUndefined(cc.open_debug) ? true : cc.open_debug,
    // 平台id [0,1,247测试服,3,正式服]
    PID: cc.dd._.isUndefined(cc.pid) ? 1 : cc.pid,
    // 游戏平台id [吉林麻将,巷乐棋牌,快乐吧长春麻将,快乐吧农安麻将,快乐吧填大坑，快乐吧牛牛]
    // GAME_PID: (cc._isAppstore && !cc._isHuaweiGame || cc.dd._.isUndefined(cc.game_pid) || cc.game_pid == 20000) ? 0 :
    //     ((cc._androidstore_check && cc.game_pid == 10012) ? 3 :
    //         ((cc._androidstore_check && cc.game_pid == 10017) ? 2
    //             : cc.game_pid)),
    GAME_PID: (function () {
        if (cc._isAppstore && !cc._isHuaweiGame && !cc._isBaiDuPingTaiGame || cc.dd._.isUndefined(cc.game_pid) || cc.game_pid == 20000) {
            return 0;
        } else if (cc._androidstore_check && cc.game_pid == 10012) {
            return 3;
        } else if (cc._androidstore_check && cc.game_pid == 10017) {
            return 2;
        } else {
            return cc.game_pid;
        }
    })(),
    //h5
    H5PID: 1,
    // 语言 [1:中文 2:繁体 3:英文]
    LANGUAGE: 3,
    //版本 该字段值会根据更新文件自动更新
    VERSION: "",

    //当前大厅名字
    // HALL_NAME: HALL_TYPE[(cc._isAppstore && !cc._isHuaweiGame|| cc.dd._.isUndefined(cc.game_pid)) ? 0 : (cc._androidstore_check ? 2 : ((cc._useChifengUI ? 1 : ((cc.game_pid > 1 && cc.game_pid < 10000) ? 2 : (cc._isXiangYueYuLe ? 3 : 0)))))],
    // HALL_NAME: HALL_TYPE[(function () {
    //     if (cc._isAppstore && !cc._isHuaweiGame && !cc._isBaiDuPingTaiGame || cc.dd._.isUndefined(cc.game_pid)) {
    //         return 0;
    //     } else if (cc._androidstore_check) {
    //         return 2;
    //     } else if (cc._useChifengUI) {
    //         return 1;
    //     } else if (cc.game_pid > 2 && cc.game_pid < 10000) {
    //         return 2;
    //     } else if (cc._isXiangYueYuLe) {
    //         return 3;
    //     } else if (cc.game_pid == 2) {
    //         return 4;
    //     } else {
    //         return 0;
    //     }
    // })()],
    HALL_NAME: HALL_TYPE[(function(){
       if(cc.pid == 2){
           return 0;
       }else{
           return 1;
       }
    })()],
    // LOGIN_SCENE_NAME: LOGIN_SCENE[(cc._isAppstore && !cc._isHuaweiGame || cc.dd._.isUndefined(cc.game_pid)) ? 0 : (cc._androidstore_check ? 2 : (((cc.game_pid > 1 && cc.game_pid < 10000) ? 2 : (cc._isXiangYueYuLe ? 3 : 0))))],
    // LOGIN_SCENE_NAME: LOGIN_SCENE[(function () {
    //     if (cc._isAppstore && !cc._isHuaweiGame && !cc._isBaiDuPingTaiGame || cc.dd._.isUndefined(cc.game_pid)) {
    //         return 0;
    //     } else if (cc._androidstore_check) {
    //         return 2;
    //     } else if (cc.game_pid > 1 && cc.game_pid < 10000) {
    //         return 2;
    //     } else if (cc._isXiangYueYuLe) {
    //         return 3;
    //     } else {
    //         return 0;
    //     }
    // })()],
    LOGIN_SCENE_NAME:"blackjack_login",
    //模拟器分辨率
    // SIMULATOR_RATIO: '2688,1242',
    SIMULATOR_RATIO: '1280,720',

    //GVoice账号
    // GVOICE_ACC: { game_id: "1141580017", key: "d51548d7934c42b94b2c774ab1de31d6", server_info: "udp://cn.voice.gcloudcs.com:10001" },
    GVOICE_ACC: { game_id: "", key: "", server_info: "" },
};

