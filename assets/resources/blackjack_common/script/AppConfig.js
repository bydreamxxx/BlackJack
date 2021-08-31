/**
 * Created by yons on 2017/5/10.
 */

module.exports = {
    // 是否上传Log至服务器(native)
    IS_UPLOAD_LOG: false,
    // 默认的日志上传服务器
    UPLOAD_LOG_HOST: "",
    //录音开关
    OPEN_RECORD: true,
    // 是否调试模式(会上传LOG至服务器)
    IS_DEBUG: cc.dd._.isUndefined(cc.open_debug) ? true : cc.open_debug,
    // 平台id [0,1,247测试服,3,正式服]
    PID: cc.dd._.isUndefined(cc.pid) ? 1 : cc.pid,
    // 游戏平台id [吉林麻将,巷乐棋牌,快乐吧长春麻将,快乐吧农安麻将,快乐吧填大坑，快乐吧牛牛]
    GAME_PID: cc.game_pid,
    //h5
    H5PID: 1,
    //版本 该字段值会根据更新文件自动更新
    VERSION: "",

    //当前大厅名字
    HALL_NAME: "blackjack_hall",
    LOGIN_SCENE_NAME: "blackjack_login",
    //模拟器分辨率
    SIMULATOR_RATIO: '1920,1080',

    //GVoice账号
    GVOICE_ACC: { game_id: "", key: "", server_info: "" },
};

