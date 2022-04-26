/**
 * Created by Mac_Li on 2017/10/16.
 */
var Hall = require('jlmj_halldata');
var LoginData = require('jlmj_login_data');
var WxData = require("com_wx_data").WxData.Instance();
const emun = cc.dd.jlmj_enum;
const AppCfg = cc.dd.AppCfg;
var WxEvent = require("com_wx_data").WxEvent;
var WxED = require("com_wx_data").WxED;
var dd = cc.dd;
var Platform = require('Platform');
const HallSendMsgCenter = require('HallSendMsgCenter');
let md5 = require('md5').MD5;

var CONNECT_TYPE = cc.Enum({
    NORMAL: 'connect_normal',   //正常连接
    RECONN: 'connect_reconn',   //断线重连
});

var jlmj_login_module = cc.Class({

    statics: {
        s_login_module: null,

        Instance: function () {
            if (this.s_login_module == null) {
                this.s_login_module = new jlmj_login_module();
                this.s_login_module.init();
            }
            return this.s_login_module;
        },

        Destroy: function () {
            if (this.s_login_module != null) {
                this.s_login_module.destroy();
                this.s_login_module = null;
            }
        },
    },

    /**
     * 初始化
     * @param endCall 登录完成的后回调
     */
    init: function () {
        this.loginType = emun.Login_Type.NONE;
        Hall.HallED.addObserver(this);
        WxED.addObserver(this);
        cc.dd.NetED.addObserver(this);
        this.wx_code = null;
    },

    destroy: function () {
        WxED.removeObserver(this);
        Hall.HallED.removeObserver(this);
        cc.dd.NetED.removeObserver(this);

    },

    /**
     * 微信登录回调
     */
    WXLogin: function () {
        if (!cc.sys.isNative) {
            return;
        }
        if (cc.dd.native_wx.IsWXAppInstalled()) {
            cc.log('[游戏登录] ', '微信登录连接网关');
            this.loginType = emun.Login_Type.WX;
            var ip = Platform.Servers[AppCfg.PID].ip;
            var port = Platform.Servers[AppCfg.PID].port;
            this.connectWG(ip, port);
        } else {
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_6);
        }
    },

    /**
     * h5版本微信登录
     */
    WXLogiH5: function (code) {
        if (cc.sys.isNative) {
            cc.log('[游戏登录] ', "app 不支持h5登录");
            return;
        }
        cc.log('[游戏登录] ', '微信h5登录连接网关');
        this.codeH5 = code;
        this.loginType = emun.Login_Type.WXH5;
        var ip = Platform.Servers[AppCfg.PID].ip;
        var port = Platform.Servers[AppCfg.PID].port;
        this.connectWG(ip, port);
    },

    //游客登录网关
    NewGuestLogin: function () {
        this.loginType = emun.Login_Type.GUEST;
        var ip = Platform.Servers[AppCfg.PID].ip;
        var port = Platform.Servers[AppCfg.PID].port;
        cc.log('[游戏登录] ', '游客登录网关');
        this.connectWG(ip, port);
    },


    //账号登录网关
    AccountLogin: function (noNetWaitUtil) {
        this.noNetWaitUtil = noNetWaitUtil;
        this.loginType = emun.Login_Type.ACCOUNT;
        var ip = Platform.Servers[AppCfg.PID].ip;
        var port = Platform.Servers[AppCfg.PID].port;
        cc.log('[游戏登录] ', '账号登录网关');
        this.connectWG(ip, port);
    },

    loginAccount(userName, password) {
        // if (!cc.sys.isNative) {
        //     return;
        // }
        cc.dd.NetWaitUtil.show('LOADING...');

        let encodePass = cc.dd.SysTools.encode64(password);
        let gameid = 10361;
        let url = Platform.accountUrl + "v1/user/login";
        let data = {
            gameid: gameid,
            promoterid: '',
            version: AppCfg.VERSION,
            encrypt: 'md5',
            source: 'client',
            sign: md5('encrypt=md5&gameid=' + gameid + '&password=' + encodePass + '&promoterid=&source=client&username=' + userName + '&version=' + AppCfg.VERSION + '#233e3d39a1b3de599b1ef45730bbf93e'),
            username: userName,
            password: encodePass,
        }

        data = cc.dd.SysTools.encode64(JSON.stringify(data));

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var jsonData = JSON.parse(xhr.responseText);
                    if (jsonData.code == 0) {
                        let uid = jsonData.data.uid;
                        this.account_token = jsonData.data.token;
                        this.account_name = cc.dd.SysTools.encode64(userName);
                        this.account_password = encodePass;
                        LoginData.Instance().accountToken = this.account_token;
                        this.AccountLogin();
                    } else {
                        cc.dd.PromptBoxUtil.show(jsonData.msg);
                    }
                    cc.log(jsonData.msg);
                }
                cc.dd.NetWaitUtil.close();
                return;
            }

        }.bind(this);
        xhr.ontimeout = function () {
            cc.log('http timeout:loginaccount');
            cc.dd.NetWaitUtil.close();
        }.bind(this);
        xhr.onerror = function () {
            cc.log('http error:loginaccount');
            cc.dd.NetWaitUtil.close();
        }.bind(this);
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        xhr.send("data=" + data);
    },

    getAcctounToken(callback) {
        // if (!cc.sys.isNative) {
        //     return;
        // }

        let lastLoginInfo = LoginData.Instance().getLastAccountLoginInfo(false);
        let userName = cc.dd.SysTools.decode64(lastLoginInfo.account);
        let password = cc.dd.SysTools.decode64(lastLoginInfo.password);

        if (!cc.dd._.isString(userName) || userName == '' || !cc.dd._.isString(password) || password == '') {
            return;
        }

        let encodePass = cc.dd.SysTools.encode64(password);
        let gameid = 10361;
        let url = Platform.accountUrl + "v1/user/login";
        let data = {
            gameid: gameid,
            promoterid: '',
            version: AppCfg.VERSION,
            encrypt: 'md5',
            source: 'client',
            sign: md5('encrypt=md5&gameid=' + gameid + '&password=' + encodePass + '&promoterid=&source=client&username=' + userName + '&version=' + AppCfg.VERSION + '#233e3d39a1b3de599b1ef45730bbf93e'),
            username: userName,
            password: encodePass,
        }

        data = cc.dd.SysTools.encode64(JSON.stringify(data));

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var jsonData = JSON.parse(xhr.responseText);
                    if (jsonData.code == 0) {
                        let uid = jsonData.data.uid;
                        this.account_token = jsonData.data.token;
                        this.account_name = cc.dd.SysTools.encode64(userName);
                        this.account_password = encodePass;
                        LoginData.Instance().accountToken = this.account_token;
                        if (callback) {
                            callback();
                        }
                    } else {
                        cc.dd.PromptBoxUtil.show(jsonData.msg);
                    }
                    cc.log(jsonData.msg);
                }
                return;
            }

        }.bind(this);
        xhr.ontimeout = function () {
            cc.log('http timeout:loginaccount');
        }.bind(this);
        xhr.onerror = function () {
            cc.log('http error:loginaccount');
        }.bind(this);
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        xhr.send("data=" + data);
    },

    //注册账号到后台
    registAccount(userName, password) {
        // if (!cc.sys.isNative) {
        //     return;
        // }

        cc.dd.NetWaitUtil.show('注册中...');

        let encodePass = cc.dd.SysTools.encode64(password);
        let gameid = 10361
        let url = Platform.accountUrl + "v1/user/register";
        let data = {
            gameid: gameid,
            promoterid: '',
            version: AppCfg.VERSION,
            encrypt: 'md5',
            source: 'client',
            sign: md5('encrypt=md5&gameid=' + gameid + '&password=' + encodePass + '&promoterid=&source=client&username=' + userName + '&version=' + AppCfg.VERSION + '#233e3d39a1b3de599b1ef45730bbf93e'),
            username: userName,
            password: encodePass,
        }

        data = cc.dd.SysTools.encode64(JSON.stringify(data));

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var jsonData = JSON.parse(xhr.responseText);
                    if (jsonData.code == 0) {
                        let uid = jsonData.data.uid;
                        this.account_token = jsonData.data.token;
                        this.account_name = cc.dd.SysTools.encode64(userName);
                        this.account_password = encodePass;
                        cc.log("token = ", this.account_token);
                        LoginData.Instance().accountToken = this.account_token;
                        this.AccountLogin();
                    } else {
                        cc.dd.PromptBoxUtil.show(jsonData.msg);
                    }
                    cc.log(jsonData.msg);
                }
                cc.dd.NetWaitUtil.close();
                return;
            }

        }.bind(this);
        xhr.ontimeout = function () {
            cc.log('http timeout:registaccount');
            cc.dd.NetWaitUtil.close();
        }.bind(this);
        xhr.onerror = function () {
            cc.log('http error:registaccount');
            cc.dd.NetWaitUtil.close();
        }.bind(this);
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        xhr.send("data=" + data);
    },

    //忘记密码
    forgetPassword(userName) {
        let url = Platform.accountUrl + "sdk/home/forgetpass?data=";//"sdk/register/index";

        let gameid = 10361
        let data = {
            gameid: gameid,
            promoterid: '',
            version: AppCfg.VERSION,
            encrypt: 'md5',
            source: 'client',
            sign: md5('encrypt=md5&gameid=' + gameid + '&promoterid=&source=client&uid=' + userName + '&version=' + AppCfg.VERSION + '#233e3d39a1b3de599b1ef45730bbf93e'),
            uid: userName,
        }

        data = cc.dd.SysTools.encode64(JSON.stringify(data));
        url += data;

        cc.dd.native_systool.OpenUrl(url);
    },

    /**
     * 抓取链接参数
     */
    GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },

    /**
     * 游客登录
     */
    guestLogin: function (ip, port) {
        cc.log('[游戏登录] ', '游客登录连接网关');
        this.loginType = emun.Login_Type.GUEST;
        this.connectWG(ip, port);
    },

    /**
     * 连接网关
     */
    connectWG: function (ip, port) {
        cc.log('[游戏登录] ', '开始连接网关');
        if (!this.noNetWaitUtil) {
            cc.dd.NetWaitUtil.show('正在连接....');
        }
        if (cc.dd.AppCfg.PID != 3) {
            cc.gateNet.Instance().connect('ws://' + ip + ':' + port);
        }
        else {
            cc.gateNet.Instance().connectVip();
        }
    },

    /**
     * 重连网关
     */
    reconnectWG: function () {
        if (this.loginType == emun.Login_Type.NONE) {
            cc.log('[游戏登录] ', '未登陆过, 无需重连');
            return;
        };
        cc.log('[游戏登录] ', '重连网关');
        cc.dd.NetWaitUtil.show('Reconnecting');
        // if(!_switch_gateway){
        //     cc.gateNet.Instance().reconnect();
        // }
        // else{
        cc.gateNet.Instance().reconnect();
        //}
    },

    /**
     * 连接成功
     */
    onConnectWGSuc: function () {
        cc.log('[游戏登录] ', '连接网关成功');
        this.connect_type = CONNECT_TYPE.NORMAL;
        this.login();
    },

    /**
     * 重连成功
     */
    onReConnectWGSuc: function () {
        cc.log('[游戏登录] ', '重连网关成功');
        this.connect_type = CONNECT_TYPE.RECONN;
        this.login();
    },

    /**
     * 登录
     */
    login: function () {
        if (!this.noNetWaitUtil) {
            cc.dd.NetWaitUtil.show('正在登录....');
        }
        if (this.loginType === emun.Login_Type.GUEST) {
            if (cc.dd._.isNumber(this.bindID) && this.bindID != 0) {
                cc.log('[游戏登录] ', '绑定ID登录' + this.bindID);

                const req = new cc.pb.login.login_by_user_id_req();
                req.setUserId(this.bindID)
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_user_id_req, req, 'cmd_login_by_user_id_req', true);
            } else {
                cc.log('[游戏登录] ', '游客登录请求');
                const req = new cc.pb.login.login_by_refresh_token_req();
                req.setChannel(this.loginType);
                if (LoginData.Instance().isRefreshTokenExist()) {
                    req.setRefreshToken(LoginData.Instance().refreshToken);
                } else {
                    req.setRefreshToken(null);
                }
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_refresh_token_req, req, 'cmd_login_by_refresh_token_req', true);
            }
            this.bindID = null;
            cc.dd.NetWaitUtil.show('LOADING...');

        } else if (this.loginType === emun.Login_Type.ACCOUNT) {
            cc.log('[游戏登录] ', '账号登录请求');
            if (this.account_name) {
                LoginData.Instance().setAccountLogin(this.account_name, this.account_password, false);
            }

            if (LoginData.Instance().isRefreshTokenExist()) {
                if (!this.account_token) {
                    this.getAcctounToken();
                }

                cc.log("refreshToken存在,自动登录");
                const req = new cc.pb.login.login_by_refresh_token_req();
                req.setRefreshToken(LoginData.Instance().refreshToken);
                req.setChannel(this.loginType);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_refresh_token_req, req, 'cmd_login_by_refresh_token_req', true);
                cc.dd.NetWaitUtil.show('LOADING...');
            } else if (this.account_token) {
                let req = new cc.pb.login.yj_login_by_token_req();
                req.setChannel(this.loginType);
                req.setToken(this.account_token);
                req.setVersion(AppCfg.VERSION);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_yj_login_by_token_req, req, 'cmd_yj_login_by_token_req', true);
            }
        } else if (this.loginType === emun.Login_Type.WXH5) {
            if (this.connect_type == CONNECT_TYPE.NORMAL) {
                cc.dd.NetWaitUtil.smooth_close();
                const req = new cc.pb.login.wx_login_by_code_req();
                req.setCode(this.codeH5);
                req.setChannel(this.loginType);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_wx_login_by_code_req, req,
                    'cmd_wx_login_by_code_req[H5微信code登录]', true);
            } else {
                cc.log("refreshToken存在,自动登录");
                const req = new cc.pb.login.login_by_refresh_token_req();
                req.setRefreshToken(LoginData.Instance().refreshToken);
                req.setChannel(this.loginType);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_refresh_token_req, req, 'cmd_login_by_refresh_token_req', true);
                cc.dd.NetWaitUtil.show('LOADING...');
            }
        }
        else if (this.loginType === emun.Login_Type.HUAWEI) {
            cc.log('[游戏登录] ', '华为登录请求');
            cc.dd.NetWaitUtil.smooth_close();
            if (!LoginData.Instance().isRefreshTokenExist()) {
                if (this.hw_code != null) {
                    const req = new cc.pb.login.hw_login_req();
                    req.setChan(this.loginType);
                    req.setPlayerid(this.hw_code.playerId);
                    req.setPlayerlevel(this.hw_code.playerLevel);
                    req.setPlayerssign(this.hw_code.playerSSign);
                    req.setPlayername(this.hw_code.nickname);
                    req.setPlayerhead(this.hw_code.headurl);
                    req.setTimestamp(this.hw_code.ts);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_hw_login_req, req,
                        'cmd_hw_login_req[华为登录]', true);
                    this.hw_code = null;
                } else {
                    cc.log('[游戏登录] ', '授权码为空,华为授权请求');
                    this.loginType = emun.Login_Type.NONE;
                    cc.dd.native_wx.hwLogin();
                }
            } else {
                cc.log('[游戏登录] ', "Token存在,登录请求");
                const req = new cc.pb.login.login_by_refresh_token_req();
                req.setRefreshToken(LoginData.Instance().refreshToken);
                req.setChannel(this.loginType);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_refresh_token_req, req, 'cmd_login_by_refresh_token_req', true);
                cc.dd.NetWaitUtil.show('LOADING...');
            }
        }
        else if (this.loginType === emun.Login_Type.VIVO) {
            cc.log('[游戏登录] ', 'vivo登录请求');
            cc.dd.NetWaitUtil.smooth_close();
            if (!LoginData.Instance().isRefreshTokenExist()) {
                if (this.vivo_code != null) {
                    const req = new cc.pb.login.vivo_login_req();
                    req.setChan(this.loginType);
                    req.setAuthtoken(this.vivo_code.tk);
                    req.setPlayername(this.vivo_code.un);
                    req.setPlayerhead("");
                    req.setTimestamp("");
                    cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_vivo_login_req, req,
                        'vivo_login_req[vivo登录]', true);
                    this.vivo_code = null;
                } else {
                    cc.log('[游戏登录] ', '授权码为空,vivo授权请求');
                    this.loginType = emun.Login_Type.NONE;
                    cc.dd.native_wx.vivoLogin();
                }
            } else {
                cc.log('[游戏登录] ', "Token存在,登录请求");
                const req = new cc.pb.login.login_by_refresh_token_req();
                req.setRefreshToken(LoginData.Instance().refreshToken);
                req.setChannel(this.loginType);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_refresh_token_req, req, 'cmd_login_by_refresh_token_req', true);
                cc.dd.NetWaitUtil.show('LOADING...');
            }
        }
        else if (this.loginType === emun.Login_Type.OPPO) {
            cc.log('[游戏登录] ', 'oppo登录请求');
            cc.dd.NetWaitUtil.smooth_close();
            if (!LoginData.Instance().isRefreshTokenExist()) {
                if (this.oppo_code != null) {
                    const req = new cc.pb.login.oppo_login_req();
                    req.setChan(this.loginType);
                    req.setToken(this.oppo_code.tk);
                    req.setSsoid(this.oppo_code.id);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_oppo_login_req, req,
                        'oppo_login_req[oppo登录]', true);
                    this.oppo_code = null;
                } else {
                    cc.log('[游戏登录] ', '授权码为空,oppo授权请求');
                    this.loginType = emun.Login_Type.NONE;
                    cc.dd.native_wx.oppoLogin();
                }
            } else {
                cc.log('[游戏登录] ', "Token存在,登录请求");
                const req = new cc.pb.login.login_by_refresh_token_req();
                req.setRefreshToken(LoginData.Instance().refreshToken);
                req.setChannel(this.loginType);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_refresh_token_req, req, 'cmd_login_by_refresh_token_req', true);
                cc.dd.NetWaitUtil.show('LOADING...');
            }
        }
        else if (this.loginType === emun.Login_Type.XIAOMI) {
            cc.log('[游戏登录] ', 'xiaomi登录请求');
            cc.dd.NetWaitUtil.smooth_close();
            if (!LoginData.Instance().isRefreshTokenExist()) {
                if (this.xiaomi_code != null) {
                    const req = new cc.pb.login.mi_login_req();
                    req.setChan(this.loginType);
                    req.setUid(this.xiaomi_code.id);
                    req.setSessionId(this.xiaomi_code.tk);
                    req.setPlayername(this.xiaomi_code.nick)
                    cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_mi_login_req, req,
                        'mi_login_req[xiaomi登录]', true);
                    this.xiaomi_code = null;
                } else {
                    cc.log('[游戏登录] ', '授权码为空,xiaomi授权请求');
                    this.loginType = emun.Login_Type.NONE;
                    cc.dd.native_wx.xiaomiLogin();
                }
            } else {
                cc.log('[游戏登录] ', "Token存在,登录请求");
                const req = new cc.pb.login.login_by_refresh_token_req();
                req.setRefreshToken(LoginData.Instance().refreshToken);
                req.setChannel(this.loginType);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_refresh_token_req, req, 'cmd_login_by_refresh_token_req', true);
                cc.dd.NetWaitUtil.show('LOADING...');
            }
        }
        else if (this.loginType === emun.Login_Type.GOOGLE) {
            cc.log('[游戏登录] ', 'google登录请求');
            cc.dd.NetWaitUtil.smooth_close();
            if (!LoginData.Instance().isRefreshTokenExist()) {
                if (this.google_code != null) {
                    const req = new cc.pb.login.googlePlay_login_by_code_req();
                    req.setCode(this.google_code.idToken)
                    req.setChannel(this.loginType);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_googlePlay_login_by_code_req, req,
                        'googlePlay_login_by_code_req[google登录]', true);
                    this.google_code = null;
                } else {
                    cc.log('[游戏登录] ', '授权码为空,xiaomi授权请求');
                    this.loginType = emun.Login_Type.NONE;
                    cc.dd.native_wx.xiaomiLogin();
                }
            } else {
                cc.log('[游戏登录] ', "Token存在,登录请求");
                const req = new cc.pb.login.login_by_refresh_token_req();
                req.setRefreshToken(LoginData.Instance().refreshToken);
                req.setChannel(this.loginType);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_refresh_token_req, req, 'cmd_login_by_refresh_token_req', true);
                cc.dd.NetWaitUtil.show('LOADING...');
            }
        }
        else if (this.loginType === emun.Login_Type.FACEBOOK) {
            cc.log('[游戏登录] ', 'facebook登录请求');
            cc.dd.NetWaitUtil.smooth_close();
            if (!LoginData.Instance().isRefreshTokenExist()) {
                // if (this.xiaomi_code != null) {
                //     const req = new cc.pb.login.mi_login_req();
                //     req.setChan(this.loginType);
                //     req.setUid(this.xiaomi_code.id);
                //     req.setSessionId(this.xiaomi_code.tk);
                //     req.setPlayername(this.xiaomi_code.nick)
                //     cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_mi_login_req, req,
                //         'mi_login_req[xiaomi登录]', true);
                //     this.xiaomi_code = null;
                // } else {
                //     cc.log('[游戏登录] ', '授权码为空,xiaomi授权请求');
                //     this.loginType = emun.Login_Type.NONE;
                //     cc.dd.native_wx.xiaomiLogin();
                // }
            } else {
                cc.log('[游戏登录] ', "Token存在,登录请求");
                const req = new cc.pb.login.login_by_refresh_token_req();
                req.setRefreshToken(LoginData.Instance().refreshToken);
                req.setChannel(this.loginType);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_refresh_token_req, req, 'cmd_login_by_refresh_token_req', true);
                cc.dd.NetWaitUtil.show('LOADING...');
            }
        }
        else {
            cc.log('[游戏登录] ', '微信登录请求');
            cc.dd.NetWaitUtil.smooth_close();
            if (!LoginData.Instance().isRefreshTokenExist()) {
                // if (this.wx_code != null) {
                //     const req = new cc.pb.login.wx_login_by_code_req();
                //     req.setCode(this.wx_code);
                //     req.setChannel(this.loginType);
                //     cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_wx_login_by_code_req, req,
                //         'cmd_wx_login_by_code_req[微信code登录]', true);
                //     this.wx_code = null;
                // } else {
                //     cc.wx_authing = true;
                //     cc.log('[游戏登录] ', '授权码为空,微信授权请求');
                //     this.loginType = emun.Login_Type.NONE;
                //     cc.dd.native_wx.SendWechatAuth();
                // }
            } else {
                cc.log('[游戏登录] ', "Token存在,登录请求");
                const req = new cc.pb.login.login_by_refresh_token_req();
                req.setRefreshToken(LoginData.Instance().refreshToken);
                req.setChannel(this.loginType);
                cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_login_by_refresh_token_req, req, 'cmd_login_by_refresh_token_req', true);
                cc.dd.NetWaitUtil.show('LOADING...');
            }
        }
        this.noNetWaitUtil = false;
    },

    /**
     * 登录成功
     */
    onLoginSuc: function (data) {
        LoginData.Instance().saveLoginType(this.loginType);
        cc.log('[游戏登录] ', '用户登录成功');
        HallSendMsgCenter.getInstance().sendBagItemList();
    },

    /**
     * 微信授权回调
     */
    onWXAuth: function (token) {
        cc.log('[游戏登录] ', '微信授权结束');
        if (token) {
            if (Number(token) < 0) {
                cc.log('[游戏登录] ', '获取授权码失败！', token);
                cc.dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_SYSTEM_7, 'text30', null, function () {
                    cc.wx_authing = true;
                    cc.log('[游戏登录] ', '微信授权请求');
                    this.loginType = emun.Login_Type.NONE;
                    cc.dd.native_wx.SendWechatAuth();
                });
                cc.dd.NetWaitUtil.close();
            } else {
                this.wx_code = token;
                cc.log('[游戏登录] ', '成功获取微信授权', this.wx_code);
                this.WXLogin();
                // if (cc.gateNet.Instance().isConnected()) {
                //     cc.log('微信授权', '网络存在');
                //     const req = new cc.pb.login.wx_login_by_code_req();
                //     req.setCode(this.wx_code);
                //     req.setChannel(this.loginType);
                //     cc.gateNet.Instance().sendMsg(cc.netCmd.login.cmd_wx_login_by_code_req, req,
                //         'cmd_wx_login_by_code_req[微信code登录]', true);
                //     this.wx_code = null;
                // } else {
                //     cc.log('微信授权', '网络不存在', '开始重连');
                //     this.reconnectWG();
                // }
            }
        }
    },

    onHuaweiAuth(json) {
        cc.log('[游戏登录] ', '华为授权结束');
        this.hw_code = json;
        this.HWLogin();
    },

    onVivoAuth(json) {
        cc.log('[游戏登录] ', 'vivo授权结束');
        this.vivo_code = json;
        this.vivoLogin();
    },

    onOppoAuth(json) {
        cc.log('[游戏登录] ', 'oppo授权结束');
        this.oppo_code = json;
        this.oppoLogin();
    },

    onXiaomiAuth(json) {
        cc.log('[游戏登录] ', 'xiaomi授权结束');
        this.xiaomi_code = json;
        this.xiaomiLogin();
    },

    onGoogleAuth(json) {
        cc.log('[游戏登录] ', 'google授权结束');
        this.google_code = json;
        this.googleLogin();
    },

    onFacebookAuth(json) {
        cc.log('[游戏登录] ', 'facebook授权结束');
        this.facebook_code = json;
        this.facebookLogin();
    },

    HWLogin() {
        cc.log('[游戏登录] ', '华为登录连接网关');
        this.loginType = emun.Login_Type.HUAWEI;
        var ip = Platform.Servers[AppCfg.PID].ip;
        var port = Platform.Servers[AppCfg.PID].port;
        this.connectWG(ip, port);
    },

    vivoLogin() {
        cc.log('[游戏登录] ', 'vivo登录连接网关');
        this.loginType = emun.Login_Type.VIVO;
        var ip = Platform.Servers[AppCfg.PID].ip;
        var port = Platform.Servers[AppCfg.PID].port;
        this.connectWG(ip, port);
    },

    oppoLogin() {
        cc.log('[游戏登录] ', 'oppo登录连接网关');
        this.loginType = emun.Login_Type.OPPO;
        var ip = Platform.Servers[AppCfg.PID].ip;
        var port = Platform.Servers[AppCfg.PID].port;
        this.connectWG(ip, port);
    },

    xiaomiLogin() {
        cc.log('[游戏登录] ', 'xiaomi登录连接网关');
        this.loginType = emun.Login_Type.XIAOMI;
        var ip = Platform.Servers[AppCfg.PID].ip;
        var port = Platform.Servers[AppCfg.PID].port;
        this.connectWG(ip, port);
    },

    googleLogin() {
        cc.log('[游戏登录] ', 'google登录连接网关');
        this.loginType = emun.Login_Type.GOOGLE;
        var ip = Platform.Servers[AppCfg.PID].ip;
        var port = Platform.Servers[AppCfg.PID].port;
        this.connectWG(ip, port);
    },

    facebookLogin() {
        cc.log('[游戏登录] ', 'facebook登录连接网关');
        this.loginType = emun.Login_Type.FACEBOOK;
        var ip = Platform.Servers[AppCfg.PID].ip;
        var port = Platform.Servers[AppCfg.PID].port;
        this.connectWG(ip, port);
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.LOGING_USER:
                this.onLoginSuc(data);
                break;
            case WxEvent.RESPONSE_CODE://得到微信授权
                this.onWXAuth(WxData.response_code);
                break;
            case WxEvent.HUAWEI_CODE://华为授权
                this.onHuaweiAuth(WxData.hw_code);
                break;
            case WxEvent.VIVO_CODE://VIVO授权
                this.onVivoAuth(WxData.vivo_code);
                break;
            case WxEvent.OPPO_CODE://OPPO授权
                this.onOppoAuth(WxData.oppo_code);
                break;
            case WxEvent.XIAOMI_CODE:
                this.onXiaomiAuth(WxData.xiaomi_code);
                break;
            case WxEvent.GOOGLE_CODE:
                this.onGoogleAuth(WxData.google_code);
                break;
            case WxEvent.FACEBOOK_CODE:
                this.onFacebookAuth(WxData.facebook_code);
                break;
            default:
                if (data && typeof (data) == 'object' && data.length >= 1) {
                    if (cc.gateNet.Instance().name == data[0]) {
                        this.onGateNetEventMessage(event, data);
                    }
                }
                break;
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onGateNetEventMessage: function (event, data) {
        switch (event) {
            case cc.dd.NetEvent.OPEN:
                this.onConnectWGSuc();
                break;
            case cc.dd.NetEvent.REOPEN:
                this.onReConnectWGSuc();
                break;
            case cc.dd.NetEvent.OPEN_TIMEOUT:
                dd.DialogBoxUtil.clear();
                dd.DialogBoxUtil.showFixDialog(1, dd.strConfig.net_open_time_out, dd.strConfig.net_retry, null,
                    function () {
                        this.reconnectWG();
                    }.bind(this), null);
                break;
            case cc.dd.NetEvent.HEART_TIMEOUT:
                // dd.DialogBoxUtil.clear();
                // dd.DialogBoxUtil.show(1, dd.strConfig.net_heart_time_out, dd.strConfig.net_retry, null,
                //     function () {
                //         this.reconnectWG();
                //     }.bind(this), null);
                this.reconnectWG();
                break;
            case cc.dd.NetEvent.KICK_BY_SERVER:
                dd.DialogBoxUtil.clear();
                const LogoutCodeStr = [cc.dd.Text.TEXT_NET_1, cc.dd.Text.TEXT_NET_1, cc.dd.Text.TEXT_NET_2, cc.dd.Text.TEXT_NET_3,
                    cc.dd.Text.TEXT_NET_4, cc.dd.Text.TEXT_NET_5, cc.dd.Text.TEXT_NET_6, cc.dd.Text.TEXT_NET_7,
                    cc.dd.Text.TEXT_NET_8, cc.dd.Text.TEXT_NET_9, cc.dd.Text.TEXT_NET_10, cc.dd.Text.TEXT_NET_11
                ];
                if (data[1] != 5) {
                    dd.DialogBoxUtil.show(1, LogoutCodeStr[data[1]], 'OK', null, function () {
                        cc.dd.SceneManager.enterLoginScene();
                    });
                    if (data[1] == 8) {
                        LoginData.Instance().saveRefreshToken('');
                    }
                } else {
                    dd.DialogBoxUtil.show(1, LogoutCodeStr[data[1]], 'text31', null, function () {
                        cc.director.end();
                    });
                }
                break;
            case cc.dd.NetEvent.CLOSE:
                if (cc._hwRetryCnt == null) {
                    cc._hwRetryCnt = 0;
                }
                if (cc._hwRetryCnt < 3) {//开启游戏盾情况下直接重连
                    cc._hwRetryCnt++;
                    this.reconnectWG();
                }
                else {
                    dd.DialogBoxUtil.clear();
                    dd.DialogBoxUtil.showFixDialog(1, "duanwangtishi", "retry", "back",
                        function () {
                            this.reconnectWG();
                        }.bind(this),
                        function () {
                            var LoginData = require('jlmj_login_data');
                            LoginData.Instance().saveRefreshToken('');
                            cc.dd.SceneManager.enterLoginScene();
                        }.bind(this));
                }
                break;
            case cc.dd.NetEvent.ERROR:
                if (cc._hwRetryCnt == null) {
                    cc._hwRetryCnt = 0;
                }
                if (cc._hwRetryCnt < 3) {//开启游戏盾情况下直接重连
                    cc._hwRetryCnt++;
                    this.reconnectWG();
                }
                else {
                    dd.DialogBoxUtil.clear();
                    dd.DialogBoxUtil.show(1, "networkinstable", "retry", "returntologin",
                        function () {
                            this.reconnectWG();
                        }.bind(this),
                        function () {
                            var LoginData = require('jlmj_login_data');
                            LoginData.Instance().saveRefreshToken('');
                            cc.dd.SceneManager.enterLoginScene();
                        }.bind(this));
                }
                break;
            case cc.dd.NetEvent.INTERNET_DISCONNECT:
                dd.DialogBoxUtil.clear();
                dd.DialogBoxUtil.showFixDialog(1, dd.strConfig.net_no_internet, dd.strConfig.net_retry, dd.strConfig.net_return_enter,
                    function () {
                        this.reconnectWG();
                    }.bind(this),
                    function () {
                        if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
                            wx.closeWindow();
                            return;
                        }
                        LoginData.Instance().saveRefreshToken('');
                        cc.dd.SceneManager.enterLoginScene();
                    });
                break;
            default:
                break;
        }
    },

});

module.exports = jlmj_login_module;
