/**
 * Created by yons on 2017/5/10.
 */

var dd = cc.dd;

/** 文字配置 **/
dd.strConfig = require('com_strConfig');
dd.Text = require("Text");
/** core */
dd.ResLoader = require("ResLoader").ResLoader;
dd.ResLoadCell = require("ResLoader").ResLoadCell;
dd.MemoryDetector = require("MemoryDetector");
dd.TimeTake = require("TimeTake");
dd.EventDispatcher = require("EventDispatcher");
dd.UIMgr = require("UIMgr").Instance();

/** net */
dd.Net = require("Net").Net;
dd.NetED = require("Net").NetED;
dd.NetEvent = require("Net").NetEvent;

/** data */
dd.user = require("com_user_data").Instance();

/** 微信 */
dd.wx = require("com_wx_data").WxData.Instance();
dd.WxED = require("com_wx_data").WxED;
dd.WxEvent = require("com_wx_data").WxEvent;
dd.WxData = require("com_wx_data").WxData.Instance();

/** 支付 */
dd.PayWeChatApp = require("PayWeChatApp").getInstance();
dd.PayWeChatH5 = require("PayWeChatH5").getInstance();

/** 原生 */
dd.native_wx = require("native_wx").Instance();
dd.native_systool = require("native_systool").Instance();
dd.native_gvoice = require("native_gvoice").Native.Instance();
dd.native_gvoice_ed = require("native_gvoice").Ed;
dd.native_gvoice_event = require("native_gvoice").Event;

/** 系统 */
dd.SysED = require("com_sys_data").SysED;
dd.SysEvent = require("com_sys_data").SysEvent;
dd.SysData = require("com_sys_data").SysData.Instance();
dd.SysTools = require("com_sys_tools").SysTools;

/** 日志 **/
dd.YjLog = require('Gameyj_log');


/** util */
dd.DialogBoxUtil = require('DialogBoxUtil').Instance();
dd.NetWaitUtil = require('NetWaitUtil').Instance();
dd.PromptBoxUtil = require('PromptBoxUtil').Instance();
dd.SceneManager = require('SceneManagerUtil').Instance();
dd.UserInfoUtil = require('UserInfoUtil').UserInfoUtil.Instance();
dd.UserInfoData = require('UserInfoUtil').UserInfoData;
dd.Utils = require('Utils');
dd.AudioChat = require('AudioChat').AudioChat;
dd.Define = require("Define");
dd.ShaderUtil = require('ShaderUtil');
dd.CommonNodeUtil = require('CommonNodeUtil').Instance();
dd.RewardWndUtil = require('RewardWndUtil').Instance();
dd.clientAction = require('clientAction').clientAction;
dd.ButtonUtil = require("ButtonUtil").Instance();
dd.CheckGames = require("CheckGames");

/** 更新器 */
dd.UpdaterED = require('Updater').UpdaterEd;
dd.UpdaterEvent = require('Updater').UpdaterEvent;

//音效管理器
window.AudioManager = require("AudioManager").getInstance();

//钉钉机器人
dd.DingRobot = require('DingRobot');

cc.dd.prefix = 'jl' + require('AppConfig').PID;

cc.dd.isFirstRun = true;

// 通用工具
window.Utils = require("Utils");