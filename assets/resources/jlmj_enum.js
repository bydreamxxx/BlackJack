/**
 * Created by Mac_Li on 2017/9/20.
 */
/**
 * 吉林麻将 中枚举定义
 * @type {{}}
 */

var AppCfg = require('AppConfig');

cc.dd.jlmj_enum = {
    PID: {
        JLMJ: 0,
        XLQP: 1,
    },

    Login_Type: {
        NONE: 0,
        GUEST: 1,
        WX: 2,
        WXH5: 3,
        ACCOUNT: 4,
        HUAWEI: 6,
        VIVO: 7,
        OPPO: 8,
        XIAOMI: 9,
    },

    GameType: { PYZ: 0, BSC: 1, JBC: 2 },
};
var pid = (cc._isAppstore || cc.game_pid == 20000) ? cc.game_pid : AppCfg.GAME_PID;
cc.dd.jlmj_enum.Login_Type.GUEST = pid * 100 + 1;
cc.dd.jlmj_enum.Login_Type.WX = pid * 100 + 2;
cc.dd.jlmj_enum.Login_Type.WXH5 = pid * 100 + 3;
cc.dd.jlmj_enum.Login_Type.ACCOUNT = pid * 100 + 4;
cc.dd.jlmj_enum.Login_Type.HUAWEI = pid * 100 + 6;
cc.dd.jlmj_enum.Login_Type.VIVO = pid * 100 + 7;
cc.dd.jlmj_enum.Login_Type.OPPO = pid * 100 + 8;
cc.dd.jlmj_enum.Login_Type.XIAOMI = pid * 100 + 9;
