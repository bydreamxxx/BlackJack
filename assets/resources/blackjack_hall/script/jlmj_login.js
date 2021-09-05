var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AppCfg = require('AppConfig');
var login_module = require('LoginModule');
const Hall = require('jlmj_halldata');
const HallCommonData = require('hall_common_data').HallCommonData;
var hall_prefab = require('hall_prefab_cfg');
//const HallSendMsgCenter = require('HallSendMsgCenter');
var AppConfig = require('AppConfig');
var game_duli = require('game_duli');
var Platform = require('Platform');
var LoginData = require('jlmj_login_data');

var loginModle = cc.Class({
    extends: cc.Component,

    properties: {
        agreeBox: cc.Toggle,
        version: { default: null, type: cc.Label, tooltip: "版本" },
        xieyiNode: cc.Node,//用户协议

        account: cc.EditBox,
        password: cc.EditBox,
        accountNode: cc.Node,
        lastLogin: [cc.Node],

        r_account: cc.EditBox,
        r_password: cc.EditBox,
        r_authcode: cc.EditBox,
        registNode: cc.Node,
        //倒计时lable
        bindTimeTxt: cc.Label,
        //获取验证码按钮
        opBtn: cc.Node,

        listButton: cc.Node,
        listItem: cc.Node,
        listContent: cc.Node,
        scrollView: cc.Node,

        banhao: cc.Label,

        qrNode: cc.Node,
        webview: cc.WebView,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER)
            cc.need_login_accout = true
        let guest = cc.find('Canvas/align_down/Layout/YKBtn');
        let wxBtn = cc.find('Canvas/align_down/Layout/WXBtn');
        if (guest) {
            guest.active = cc.need_login_guest
        }
        if (wxBtn) {
            wxBtn.active = cc.sys.platform != cc.sys.DESKTOP_BROWSER
        }
        let account = cc.find('Canvas/align_down/Layout/ZHBtn');
        if (account) {
            if (cc._appstore_check)
                account.active = true;
            // else if(AppConfig.GAME_PID == 10004 || AppConfig.GAME_PID == 10003)
            //     account.active = true;
            else if (cc.sys.platform == cc.sys.MOBILE_BROWSER)
                account.active = true;
            else
                account.active = cc.need_login_accout;
        }

        let wechat = cc.find('Canvas/align_down/Layout/WXBtn');
        if (wechat) {
            if (cc._appstore_check)
                wechat.active = false;
            // else if (cc.sys.platform == cc.sys.DESKTOP_BROWSER)//扫码登陆
            //     wechat.active = true;
            else if (!cc.dd.native_wx.IsWXAppInstalled())
                wechat.active = false;
            else
                wechat.active = true;
        }

        if (cc._isKuaiLeBaTianDaKeng) {
            this.banhao.string = '2018 快乐吧填大坑    klbgame.com    新广出审[2018]1281号    浙新广[2018]199号'
        } else {
            this.banhao.string = '2019 巷乐游戏    yuejiegame.com    吉ICP备17005462号    吉网文[2017]5612-037号';
        }

        this.timer = 0;
        this.totalTime = 0;
        this.updateTag = false;

        Hall.HallED.addObserver(this);
        // if( cc.sys.isNative  ) {
        cc.dd.SysTools.setLandscape();
        // }
        cc.find('Marquee') && cc.find('Marquee').destroy();
        cc.find('klb_friend_group_redbag') && cc.find('klb_friend_group_redbag').destroy();
        cc.find('klb_friend_group_invite_answer') && cc.find('klb_friend_group_invite_answer').destroy();

        this.initAccountList();
        this.accountNode.active = false;
        this.registNode.active = false;

        if (cc.sys.isNative) {
            var platform_str = ["", "内网测试版本", "外网测试版本", "版本", "版本"];
            this.version.string = platform_str[AppCfg.PID] + ":" + AppCfg.VERSION;
        }

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.initDLUI();

        this.lastLogin.forEach((node) => {
            node.active = false;
        })

        switch (LoginData.Instance().loadLoginType()) {
            case cc.dd.jlmj_enum.Login_Type.GUEST:
                this.lastLogin[0].active = true;
                break;
            case cc.dd.jlmj_enum.Login_Type.WX:
                this.lastLogin[1].active = true;
                break;
            case cc.dd.jlmj_enum.Login_Type.ACCOUNT:
                this.lastLogin[2].active = true;
                break;
        }
        this.resetRegist();
        this.resetAccountLogin();

        if (cc.game_pid == 10006 && !cc._newChifengApp && cc.sys.isNative) {
            if (guest) {
                guest.active = false;
            }
            if (wxBtn) {
                wxBtn.active = false;
            }
            if (account) {
                account.active = false;
            }

            cc.dd.DialogBoxUtil.show(1, `<color=#8F4F13><size=35>游戏已升级，请前往下载最新版本</size></color><br/><br/><size=20><color=red>温馨提示：安装新版本游戏之前，请卸载掉旧版本的游戏</color></size>`, '前往下载', null,
                function () {
                    cc.dd.native_systool.OpenUrl(Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
                    cc.game.end();
                }.bind(this));
            return;
        }
    },

    /**
     * 独立游戏初始化
     */
    initDLUI: function () {
        var bgNode = null;
        var bg = cc.find('bg', this.node);
        if (bg)
            bgNode = bg.getComponent(cc.Sprite);
        var logNode = null;
        var logo = cc.find('LOGO', this.node);
        if (logo) {
            logNode = logo.getComponent(cc.Sprite);
            if (AppConfig.GAME_PID > 2) {
                cc.find('kuailebameinvdenglu', this.node).active = false;
                cc.find('meinv', this.node).active = false;
            }
        }

        var cofnig = game_duli.getItem(function (cfg) {
            if (cfg.pID == AppConfig.GAME_PID && AppConfig.GAME_PID != 2)
                return cfg;
        }.bind(this));
        if (!cofnig) return;
        if (bgNode)
            bgNode.spriteFrame = new cc.SpriteFrame('' + cofnig.gamedl_login_BG);
        if (logNode)
            logNode.spriteFrame = new cc.SpriteFrame('' + cofnig.gamedl_login_log);
    },

    //初始化账号历史
    initAccountList() {
        let local_result = LoginData.Instance().getAccountLogin();
        this.firstAccount = LoginData.Instance().getLastAccountLoginInfo(false);
        this.createAcountItem(this.firstAccount.account, this.firstAccount.password);

        for (let k in local_result) {
            if (local_result.hasOwnProperty(k) && this.firstAccount.account != k) {
                this.createAcountItem(k, local_result[k]);
            }
        }

        this.scrollView.active = false;
        this.listButton.scaleY = 1;
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    /**
     * 微信登录回调
     */
    loginCallBack_WX: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.SysTools.keepNetOk(function () {
            if (!this.agreeBox.isChecked) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_1);
            }
            // else if (!cc.sys.isNative) {
            //     // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_2);
            //     this.qrNode.active = true;
            //     function jsCallBack(url){
            //         cc.log("url:",url)
            //     }
            //     this.webview.url = "https://open.weixin.qq.com/connect/qrconnect?appid=wxbdc5610cc59c1631&redirect_uri=https%3A%2F%2Fpassport.yhd.com%2Fwechat%2Fcallback.do&response_type=code&scope=snsapi_login&state=3d6be0a4035d839573b04816624a415e#wechat_redirect"
            //     this.webview.setJavascriptInterfaceScheme("https")
            //     this.webview.setOnJSCallback(jsCallBack)

            // } 
            else if (!cc.dd.native_wx.IsWXAppInstalled()) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_6);
            } else {
                // login_module.Instance().WXLogin();
                login_module.Instance().loginType = cc.dd.jlmj_enum.Login_Type.NONE;
                cc.log('[游戏登录] ', '微信授权请求');
                cc.dd.native_wx.SendWechatAuth();
            }
        }.bind(this));
        //login_module.Instance().guestLogin('192.168.2.30', '3801');
    },

    webviewCallBack: function (event, data) {
        // if(data == 1)
        // {
        // cc.log("webviewCallBack url:",this.webview.url)
        // }

    },


    /**
     * 游客登录
     */
    loginCallBack_guest: function () {
        login_module.Instance().guestLogin();
    },

    /**
     * 返回按键
     * @param event
     */
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.back: {
                if (!this.__showbox) {
                    this.__showbox = true;
                    cc.dd.DialogBoxUtil.clear();
                    cc.dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_2, '确定', '取消',
                        function () {
                            cc.director.end();
                            cc.dd.NetWaitUtil.close();
                            this.__showbox = false;
                        }.bind(this),
                        function () {
                            cc.dd.NetWaitUtil.close();
                            this.__showbox = false;
                        }.bind(this)
                    );
                }
            }
                break;
            default:
                break;
        }
    },

    /**
     * 跳转场景
     */
    _changeScen: function () {
        // var act = cc.find('Canvas').getComponent(cc.Animation);
        // if (act) {
        //     var clips = act.getClips();
        //     if (clips && clips.length > 0) {
        //         act.on('finished', function () {
        //             if (!HallCommonData.getInstance().isReconectGameExit()) {
        //                 cc.log('开始切换场景2', cc.wx_enter_room_id)
        //                 //存在wx_enter_room_id则直接进房间,通过getWXRoomID拿
        //                 if (cc.dd._.isString(cc.wx_enter_room_id) && cc.wx_enter_room_id != "") {
        //                     let wx_enter_room_id = parseInt(cc.wx_enter_room_id);
        //                     cc.wx_enter_room_id = null;
        //                     let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
        //                     msg.setRoomId(wx_enter_room_id);
        //                     cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req', true);
        //                     cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onStop');
        //                 } else if (cc.dd._.isString(cc.wx_enter_club_id) && cc.wx_enter_club_id != "") {
        //                     cc.dd.SceneManager.replaceScene('klb_friend_group_scene');
        //                 } else {
        //                     cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
        //                 }
        //             } else {
        //                 cc.wx_enter_room_id = null;
        //                 cc.wx_enter_club_id = null;
        //             }
        //         }, this);
        //         act.play(clips[0].name);
        //     }
        // } else {
        //     if (!HallCommonData.getInstance().isReconectGameExit()) {
        //         cc.log('开始切换场景1', cc.wx_enter_room_id)
        //         if (cc.dd._.isString(cc.wx_enter_room_id) && cc.wx_enter_room_id != "") {
        //             let wx_enter_room_id = parseInt(cc.wx_enter_room_id);
        //             cc.wx_enter_room_id = null;
        //             let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
        //             msg.setRoomId(wx_enter_room_id);
        //             cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req', true);
        //             cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onStop');
        //         } else if (cc.dd._.isString(cc.wx_enter_club_id) && cc.wx_enter_club_id != "") {
        //             cc.dd.SceneManager.replaceScene('klb_friend_group_scene');
        //         } else {
        //             cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
        //         }
        //     } else {
        //         cc.wx_enter_room_id = null;
        //         cc.wx_enter_club_id = null;
        //     }
        // }
        if (!HallCommonData.getInstance().isReconectGameExit()) {
            cc.log('开始切换场景', cc.wx_enter_room_id)
            //加入亲友圈并游戏

            if (cc.wx_enter_club_baoxiang) {
                cc.dd.native_systool.joinFriendAndPlay();
            } else if (cc.dd._.isString(cc.wx_enter_room_id) && cc.wx_enter_room_id != "") {//存在wx_enter_room_id则直接进房间,通过getWXRoomID拿
                let wx_enter_room_id = parseInt(cc.wx_enter_room_id);
                cc.wx_enter_room_id = null;
                let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
                msg.setRoomId(wx_enter_room_id);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req', true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onStop');
            } else if (cc.dd._.isString(cc.wx_enter_club_id) && cc.wx_enter_club_id != "") {
                cc.dd.SceneManager.replaceScene('klb_friend_group_scene');
            } else {
                cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
            }
        } else {
            cc.wx_enter_room_id = null;
            cc.wx_enter_club_id = null;
        }
        //HallSendMsgCenter.getInstance().sendBagItemList();
    },
    /**
     * 用户协议
     */
    xieyiBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        this.xieyiNode.active = true;
    },
    /**
     * 协议关闭
     */
    xieyiCloseBtnCall: function () {
        hall_audio_mgr.com_btn_click();
        this.xieyiNode.active = false;
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.GET_USERINFO:
                if (cc._isBaiDuPingTaiGame) {
                    if (HallCommonData.getInstance().idNum != '') {
                        this._changeScen();
                    } else {
                        cc.dd.UIMgr.openUI(hall_prefab.CERTIFICATION, (ui) => {
                            ui.getComponent('klb_hall_Certification').setBindFunc(this._changeScen.bind(this), () => {
                                cc.game.end();
                            });
                        });
                    }
                } else {
                    this._changeScen();
                }
                break;
            default:
                break;
        }
    },

    //修复游戏
    onClickFixGame() {
        hall_audio_mgr.com_btn_click();
        cc.dd.native_systool.OpenUrl(Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
    },

    //打开账号列表
    onClickShowAccountList() {
        hall_audio_mgr.com_btn_click();
        if (this.scrollView.active) {
            this.listButton.scaleY = 1;
            this.scrollView.active = false;
        } else {
            this.listButton.scaleY = -1;
            this.scrollView.active = true;
        }
    },

    //打开账号面板
    onClickShowAccount() {
        hall_audio_mgr.com_btn_click();
        this.accountNode.active = true;
    },

    //关闭账号面板
    onClickCloseAccount() {
        hall_audio_mgr.com_btn_click();
        this.accountNode.active = false;
        this.resetAccountLogin();
    },

    //打开注册面板
    onClickShowRegist() {
        hall_audio_mgr.com_btn_click();
        this.registNode.active = true;
    },

    //关闭注册面板
    onClickCloseRegist() {
        hall_audio_mgr.com_btn_click();
        this.registNode.active = false;
        this.resetRegist();
    },

    //游客登录，暂不实现
    onClickGuestLogin() {
        hall_audio_mgr.com_btn_click();
        cc.dd.SysTools.keepNetOk(function () {
            if (!this.agreeBox.isChecked) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_1);
            } else {
                // login_module.Instance().WXLogin();
                cc.log('[游戏登录] ', '游客');
                login_module.Instance().NewGuestLogin();
            }
        }.bind(this));
    },

    //账号登录
    onClickAccountLogin() {
        hall_audio_mgr.com_btn_click();
        cc.dd.SysTools.keepNetOk(function () {
            if (!this.agreeBox.isChecked) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_1);
            } else if (this.account.string == "") {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_21);
            } else if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.account.string)) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_25);
            } else if (this.password.string == "") {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_22);
            } else if (this.password.string.length < 6) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_28);
            } else if (!/(^[A-Za-z0-9]+$)/.test(this.password.string)) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_29);
            } else {
                cc.log('[游戏登录] ', '账号登录');
                login_module.Instance().loginAccount(this.account.string, this.password.string);
            }
        }.bind(this));
    },

    //找回密码
    onClickForgetPassword() {
        hall_audio_mgr.com_btn_click();
        // if(this.account.string == "") {
        //     cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_21);
        // }else if(!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.account.string)) {
        //     cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_25);
        // }else{
        login_module.Instance().forgetPassword(0);
        // }
    },

    //注册
    onClickRegist() {
        hall_audio_mgr.com_btn_click();
        cc.dd.SysTools.keepNetOk(function () {
            if (!this.agreeBox.isChecked) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_1);
            } else if (this.r_account.string == "") {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_24);
            } else if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.r_account.string)) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_25);
            } else if (this.r_password.string == "") {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_22);
            } else if (this.r_password.string.length < 6) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_28);
            } else if (!/(^[A-Za-z0-9]+$)/.test(this.r_password.string)) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_29);
            } else if (this.r_authcode.string == "") {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_23);
            } else if (!/(^\d{4}$)|/.test(this.r_authcode.string) || this.r_authcode.string.length != 4) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_26);
            } else if (!this.codeRight) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_26);
            } else {
                login_module.Instance().loginType = cc.dd.jlmj_enum.Login_Type.ACCOUNT;
                login_module.Instance().registAccount(this.r_account.string, this.r_password.string);
                cc.log('[游戏登录] ', '账号注册');
            }
        }.bind(this));
    },

    //获取验证码
    onClickAuthCode() {
        // if (!cc.sys.isNative) {
        //     return;
        // }
        hall_audio_mgr.com_btn_click();
        cc.dd.SysTools.keepNetOk(function () {
            cc.log('[游戏登录] ', '获取验证码');
            if (this.r_account.string == "") {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_24);
            } else if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.r_account.string)) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_25);
            } else {
                let url = Platform.accountUrl + 'sdk/utils/getcode?';
                let username = this.r_account.string;

                this.totalTime = 60;
                this.opBtn.getComponent(cc.Button).enabled = false;

                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            var jsonData = JSON.parse(xhr.responseText);
                            if (jsonData.code == 0) {
                                this.updateTag = true;
                            } else {
                                cc.dd.PromptBoxUtil.show(jsonData.msg);
                                this.opBtn.getComponent(cc.Button).enabled = true;
                            }
                            cc.log(jsonData.msg);
                        }
                        return;
                    }
                }.bind(this);
                xhr.ontimeout = function () {
                    cc.log('http timeout:get authcode');
                    this.opBtn.getComponent(cc.Button).enabled = true;
                }.bind(this);
                xhr.onerror = function () {
                    cc.log('http error:get authcode');
                    this.opBtn.getComponent(cc.Button).enabled = true;
                }.bind(this);
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
                xhr.send("username=" + username);
            }
        }.bind(this));
    },

    //验证验证码
    editEnd() {
        // if (!cc.sys.isNative) {
        //     return;
        // }

        cc.dd.SysTools.keepNetOk(function () {
            if (this.r_authcode.string == "") {
                // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_23);
            } else if (this.r_account.string == "") {
                // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_24);
            } else if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.r_account.string)) {
                // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_25);
            } else if (!/(^\d{4}$)|/.test(this.r_authcode.string) || this.r_authcode.string.length != 4) {
                // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_26);
            } else if (this.codeRight == true) {
            } else {
                let url = Platform.accountUrl + 'sdk/utils/verify?';
                let username = this.r_account.string;
                let code = this.r_authcode.string;

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            var jsonData = JSON.parse(xhr.responseText);
                            if (jsonData.code == 0) {
                                this.codeRight = true;
                            } else {
                                cc.dd.PromptBoxUtil.show(jsonData.msg);
                                this.codeRight = false;
                            }
                            cc.log(jsonData.msg)
                        }
                        return;
                    }
                }.bind(this);
                xhr.ontimeout = function () {
                    cc.log('http timeout:verify authcode');
                    this.codeRight = false;
                }.bind(this);
                xhr.onerror = function () {
                    cc.log('http error:verify authcode');
                    this.codeRight = false;
                }.bind(this);
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
                xhr.send("username=" + username + "&code=" + code);
            }
        }.bind(this));
    },
    update: function (dt) {

        // cc.log("webview url:",this.webview.url)

        //获取绑定手机验证码倒计时
        if (this.updateTag) {
            if (this.totalTime >= 0) {
                this.timer += dt;
                if (this.timer >= 1) {
                    this.totalTime -= 1;
                    this.bindTimeTxt.string = this.totalTime + 's';
                    this.timer = 0;
                }
            } else {
                this.bindTimeTxt.string = '获取验证码';
                this.opBtn.getComponent(cc.Button).enabled = true;
                this.totalTime = 0;
                this.updateTag = false;
                this.timer = 0;
            }
        }
    },

    resetRegist() {
        this.r_account.string = "";
        this.r_password.string = "";
        this.r_authcode.string = "";
        this.codeRight = false;
    },

    resetAccountLogin() {
        this.account.string = cc.dd.SysTools.decode64(this.firstAccount.account);
        this.password.string = cc.dd.SysTools.decode64(this.firstAccount.password);
    },

    createAcountItem(account, password) {
        let _account = cc.dd.SysTools.decode64(account);
        let _password = cc.dd.SysTools.decode64(password);
        let item = cc.instantiate(this.listItem);
        item.active = true;
        cc.find("number", item).getComponent(cc.Label).string = _account;
        let deleteButton = cc.find("closeButton", item).getComponent(cc.Button);
        deleteButton.node.on('click', () => {
            hall_audio_mgr.com_btn_click();
            this.listContent.removeChild(item, true);

            LoginData.Instance().deleteAccountLogin(account, false);
        }, this);

        let button = item.getComponent(cc.Button);
        button.node.on('click', () => {
            this.account.string = _account;
            this.password.string = _password;
            this.onClickShowAccountList();
        }, this);

        this.listContent.addChild(item);
    },

    //TODO------------------------------------------------------------test-----------------
    /**
     * 联系客服
     */
    onClickKeFu: function (event, data) {
        hall_audio_mgr.com_btn_click();
        // var kefuData = require('kefu_data');
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
        //     prefab.getComponent('klbj_hall_KeFu')._setKefuDetailInfo(kefuData.items);
        // });
        let Platform = require('Platform');
        let AppCfg = require('AppConfig');
        cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
    },
});

module.exports = loginModle;
