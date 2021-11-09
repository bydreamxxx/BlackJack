var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
var UpdaterGameId = require("updaterMgr").UpdaterGameId;
var dd = cc.dd;
//const reslist = require('klb_hall_loadResConfig');
var LoginData = require('jlmj_login_data');
var StringFilter = require('StringFilter').Instance();
var AppCfg = require('AppConfig');
var login_module = require('LoginModule');
const Hall = require('jlmj_halldata');
var Platform = require('Platform');
const emun = cc.dd.jlmj_enum;
const HallCommonData = require('hall_common_data').HallCommonData;
var game_duli = require('game_duli');
const LOGIN_KEY = "kuaileba";
var hall_prefab = require('hall_prefab_cfg');

var LoginState = cc.Enum({
    LOAD_PROTO: "load_proto",            //加载proto
    TEST_AUTH: "test_auth",              //测试授权
    LOGIN_RES_LOAD: "login_res_load",    //加载登录资源
    CHECK_INTERNET: "check_internet",    //检查互联网
    UPDATE_PKG: "update_pkg",            //更新安装包
    UPDATE_HALL: "update_hall",          //更新大厅资源
    LOGIN_START: "login_start",          //登录开始
});

let resLoad = cc.Class({
    extends: cc.Component,

    properties: {
        progress: { default: null, type: cc.ProgressBar, tooltip: "进度条" },
        progress_value: cc.Label,
        update_node: { default: null, type: cc.Node, tooltip: "更新节点" },
        tips: { default: null, type: cc.Label, tooltip: "提示" },
        test_auth_node: { default: null, type: cc.Node, tooltip: "测试授权节点" },
        auth_code: cc.EditBox,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.sys.isNative) {
            var update_path = jsb.fileUtils.getWritablePath() + "blackjack";
            cc.log('热更新目录:' + update_path);
        }

        cc.log = function () {
            var len = arguments.length;
            var str = '';
            for (var i = 0; i < len; i++) {
                var tmp = arguments[i];
                if (typeof tmp == 'object') {
                    tmp = cc.dd.obj2string(tmp);
                }
                str += tmp;
            }
            var time = '[' + new Date().toLocaleString() + ']';
            str = '【LOG】' + time + ' ' + str;
            console.log(str);
            cc.dd.DingRobot.push_log(str);
        };

        cc.warn = function () {
            var len = arguments.length;
            var str = '';
            for (var i = 0; i < len; i++) {
                var tmp = arguments[i];
                if (typeof tmp == 'object') {
                    tmp = cc.dd.obj2string(tmp);
                }
                str += tmp;
            }
            var time = '[' + new Date().toLocaleString() + ']';
            str = '【WARN】' + time + ' ' + str;
            console.warn(str);
            cc.dd.DingRobot.push_log(str);
        };

        cc.error = function () {
            var len = arguments.length;
            var str = '';
            for (var i = 0; i < len; i++) {
                var tmp = arguments[i];
                if (typeof tmp == 'object') {
                    tmp = cc.dd.obj2string(tmp);
                }
                str += tmp;
            }
            var time = '[' + new Date().toLocaleString() + ']';
            str = '【ERROR】:' + time + ' ' + str;
            console.error(str);
            cc.dd.DingRobot.push_log(str);
        };

        this.closeSplash();
        cc.dd.native_wx.SetShareThumbImage("shareImages/WxShare.png");
        // cc.dd.SysTools.disableLog();
        AudioManager.stopMusic();
        cc.dd.native_systool.gameStart();
        this.test_auth_node.active = false;
        cc.dd.SysTools.setLandscape();
        dd.UpdaterED.addObserver(this);
        Hall.HallED.addObserver(this);
        this.changeState(LoginState.LOAD_PROTO);
        StringFilter.loadKey();     //加载敏感词过滤文件
        if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            AppCfg.PID = AppCfg.H5PID;
            this.AutoLoginH5();
        }

        cc.game.setFrameRate(40);
        if (cc.sys.isNative) {
            cc.log("设备信息:");
            cc.log(cc.dd.native_systool.getDeviceInfo());
            //获取微信好友房连接拉起
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                //TODO:  整包更新时用  game/SystemTool   暂时处理
                if (cc.game_pid == 10008 || cc.game_pid == 10009 || cc.game_pid == 10003 || cc._isKuaiLeBaTianDaKeng || cc._isHuaweiGame)
                    jsb.reflection.callStaticMethod('game/SystemTool', 'getWXRoomID', '()V');
                else
                    jsb.reflection.callStaticMethod('com/anglegame/blackjack/AppActivity', 'getWXRoomID', '()V');
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('AppController', 'getWXRoomID');
            }
        }
        this.initDlUI();


        //打开ios的定位设置
        if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os && !cc._appstore_check) {
            if (!cc.open_ios_gps) {
                jsb.reflection.callStaticMethod('SystemTool', 'startGpsLocation');
                cc.open_ios_gps = true;
            }
        }
        if (!cc._appstore_check) {
            this.tips.node.opacity = 255;
            this.progress.node.opacity = 255;
            this.progress_value.node.opacity = 255;
        }
    },

    /**
     * 独立游戏初始化
     */
    initDlUI: function () {
        var bgNode = cc.find('bg', this.node).getComponent(cc.Sprite);
        //var logNode = cc.find('bg/dl_logo', this.node).getComponent(cc.Sprite);
        var gamepid = cc._isAppstore ? cc.game_pid : AppCfg.GAME_PID;
        var cofnig = game_duli.getItem(function (cfg) {
            if (cfg.pID == gamepid && gamepid != 2 && gamepid != 5)
                return cfg;
        }.bind(this));
        if (!cofnig) return;
        // if (bgNode)
        //     bgNode.spriteFrame = new cc.SpriteFrame('' + cofnig.loadScene_Bg);
        // if (logNode)
        //     logNode.spriteFrame = new cc.SpriteFrame('' + cofnig.loadScene_Log);
    },

    closeSplash: function () {
        if (cc.sys.isNative) {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/SystemTool', 'closeSplash', '()V');
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                // var para = partnerid + "," + prepayid + "," + noncestr + "," + timestamp + "," + package_ + "," + sign;
                // jsb.reflection.callStaticMethod( 'RootViewController', 'WeixinPay:', para);
            }
        }
    },

    onDestroy: function () {
        dd.UpdaterED.removeObserver(this);
        Hall.HallED.removeObserver(this);
    },

    AutoLoginH5: function (name) {
        this.codeH5 = login_module.Instance().GetQueryString("code")
        if (this.codeH5 && this.codeH5 != "") {
            login_module.Instance().login_type = emun.Login_Type.WXH5;//WXLogiH5(code);
        }
    },


    /**
     * 更改游戏状态
     * @param state
     */
    changeState: function (state) {
        this.state = state;
        switch (this.state) {
            case LoginState.LOAD_PROTO:
                this.loadProto();
                break;
            case LoginState.TEST_AUTH:
                this.openTestAuth();
                break;
            case LoginState.LOGIN_RES_LOAD:
                this.startUpdateRes();
                break;
            case LoginState.CHECK_INTERNET:
                this.checkInternet();
                break;
            case LoginState.UPDATE_PKG:
                this.updatePKG();
                break;
            case LoginState.UPDATE_HALL:
                this.updateHall();
                break;
            case LoginState.LOGIN_START:
                this.loadRes();
                break;
            default:
                cc.error("【hall-login】" + " 登录状态错误 state=" + this.state);
                break;
        }
    },

    loadProto: function () {
        cc.dd.TimeTake.start("加载proto");
        var protobuf = cc.dd.protobufjs;
        let count = 0;
        let self = this;
        cc.proto_file.forEach(function (item) {
            cc.resources.load("script/blackjack_common/net_msg/proto/" + item, function (err, file_buffer) {
                if (err) {
                    cc.error("加载proto失败 ", item, err);
                    return;
                }
                var proto_msg = protobuf.parse(file_buffer.text);
                cc.proto[item.split('.')[0]] = proto_msg.root;
                cc.log("加载proto成功 " + item);
                count++;
                if (count == cc.proto_file.length) {
                    cc.dd.TimeTake.end("加载proto");
                    // cc.log(cc.proto);
                    self.changeState(LoginState.LOGIN_RES_LOAD);
                }
            });
        });
    },

    /**
     * 测试授权
     */
    openTestAuth: function () {
        cc.log("【hall-login】" + "验证授权码 开始");
        var passwd = cc.sys.localStorage.getItem("PASS_WORD");
        if (passwd != LOGIN_KEY) {
            this.test_auth_node.active = true;
        } else {
            this.changeState(LoginState.CHECK_INTERNET);
        }
    },

    confirmTestAuth: function () {
        if (this.auth_code.string == LOGIN_KEY) {
            this.test_auth_node.active = false;
            this.changeState(LoginState.CHECK_INTERNET);
            cc.sys.localStorage.setItem("PASS_WORD", LOGIN_KEY);
        }
    },

    cancelTestAuth: function () {
        cc.game.end();
    },

    /**
     * 加载登录资源
     */
    startUpdateRes: function () {
        cc.log("【hall-login】" + " 加载游戏必备资源 开始");
        this.update_node.active = true;
        if (cc._appstore_check)
            this.tips.string = "加载资源中...";
        else
            this.tips.string = "检测更新中...";
        this.resetProgress();
        var loadResEnd = function () {
            if (AppCfg.PID == 2) {
                this.changeState(LoginState.TEST_AUTH);  //授权验证
            } else {
                this.changeState(LoginState.CHECK_INTERNET);
            }
        }.bind(this);

        const loadCellList = [];
        loadCellList.push(new dd.ResLoadCell("blackjack_common/prefab/com_net_wait", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("blackjack_common/prefab/Marquee", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("blackjack_common/prefab/DialogBox", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("blackjack_common/prefab/DialogBox_withFix", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("blackjack_common/prefab/chifeng_dialog", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("blackjack_common/prefab/chifeng_join_dialog", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("blackjack_common/prefab/com_prompt_box", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("blackjack_common/prefab/com_mask", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("blackjack_common/prefab/com_smooth_mask", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("blackjack_common/prefab/commonNode", cc.Prefab));
        cc.dd.ResLoader.loadGameStaticResList(loadCellList, this.onProgress.bind(this), loadResEnd);
    },

    /**
     * 检查互联网连接
     */
    checkInternet: function () {
        cc.log("【hall-login】" + "检查互联网连接 开始");
        if (cc.sys.isNative && cc.sys.isMobile) {   //真机
            if (cc.dd.native_systool.isNetAvailable()) {
                this.changeState(LoginState.UPDATE_PKG);
            } else {
                dd.DialogBoxUtil.show(1, "网络连接不可用,请检查网状态", "重试", "退出",
                    function () {
                        this.checkInternet();
                    }.bind(this),
                    function () {
                        if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
                            wx.closeWindow();
                            return;
                        }
                        cc.game.end();
                    }.bind(this));
            }
        } else {    //模拟器,浏览器
            this.changeState(LoginState.UPDATE_PKG);
        }
    },

    /**
     * 重置进度
     */
    resetProgress: function () {
        this.progress.progress = 0.001;
        this.progress_value.string = '0%';
    },

    /**
     * 进度更新
     * @param value
     */
    onProgress: function (value) {
        var pre = parseInt(value * 100);
        this.progress.progress = value > 0.001 ? value : 0.001;
        if (isNaN(pre)) {
            pre = 100;
        }
        this.progress_value.string = pre + '%';
    },

    /**
     * 更新APK
     */
    updatePKG: function () {
        // this.changeState(LoginState.LOGIN_START);
        // return;

        if (cc._appstore_check)
            this.tips.string = "加载资源中...";
        else
            this.tips.string = "正在检测更新";
        if (cc.dd._.isUndefined(cc.open_update) || !cc.open_update) {
            cc.log("【hall-login】" + " 更新未开启 ");
            this.changeState(LoginState.LOGIN_START);
            return;
        }
        if (!cc.sys.isNative) {
            cc.log("【hall-login】" + " web不支持更新 ");
            this.changeState(LoginState.LOGIN_START);
            return;
        }
        var updater_game_id = UpdaterGameId.IOS;
        if (cc.sys.platform === cc.sys.ANDROID) {
            updater_game_id = UpdaterGameId.ANDROID;
        }

        if (1 != UpdateMgr.isUpdateVersionExist(updater_game_id)) {
            this.goToAppURL();
            return;
        }
        cc.log("【hall-login】" + " 更新pkg 开始");
        this.pkgUpdater = UpdateMgr.getUpdater(updater_game_id);
        cc.log('pkg version=', this.pkgUpdater.getVersion());

        var pkgVersion = cc.sys.localStorage.getItem("pkgVersion");
        if (cc.dd._.isUndefined(pkgVersion) || cc.dd._.isNull(pkgVersion)) {
            cc.sys.localStorage.setItem('pkgVersion', this.pkgUpdater.getVersion());
        } else if (pkgVersion != this.pkgUpdater.getVersion()) {
            cc.assetManager.releaseAll();
            cc.log('整包更新后,删除包内更新缓存');
            var update_path = jsb.fileUtils.getWritablePath() + "blackjack" + "/hall";
            jsb.fileUtils.removeDirectory(update_path);
            cc.sys.localStorage.removeItem('pkgVersion');
            this.reStartGame();
            return;
        }
        this.pkgUpdater.checkUpdate();

        //更新服务器连接超时,直接登录
        this.updateServerConnTimeoutCheck = setTimeout(function () {
            cc.log("连接更新服务器超时,跳过更新检测,直接登录");
            dd.UpdaterED.removeObserver(this);
            this.updateFailed();
        }.bind(this), 10000);
    },

    /**
     * 更新大厅
     */
    updateHall: function () {
        if (cc._appstore_check)
            this.tips.string = "加载资源中...";
        else
            this.tips.string = "正在检测资源更新";
        if (cc.dd._.isUndefined(cc.open_update) || !cc.open_update) {
            cc.log("【hall-login】" + " 更新未开启 ");
            this.changeState(LoginState.LOGIN_START);
            return;
        }
        if (!cc.sys.isNative) {
            cc.log("【hall-login】" + " web不支持更新 ");
            this.changeState(LoginState.LOGIN_START);
            return;
        }
        if (1 != UpdateMgr.isUpdateVersionExist(UpdaterGameId.HALL)) {
            this.goToAppURL();
            return;
        }
        cc.log("【hall-login】" + " 更新大厅 开始");
        this.hallUpdater = UpdateMgr.getUpdater(UpdaterGameId.HALL);
        this.hallUpdater.checkUpdate();
    },

    /**
     * 检测更新完成后开始加载资源
     */
    loadRes: function () {
        if (cc.sys.isNative && !cc.dd._.isUndefined(cc.open_update) && cc.open_update) {
            // this.hallUpdater = UpdateMgr.getUpdater(UpdaterGameId.HALL);
            // AppCfg.VERSION = this.hallUpdater.getVersion();
            // cc.log("当前版本:" + AppCfg.VERSION);
        }

        var self = this;
        this.tips.string = "加载资源中...";
        var loadCellList = [];
        // //大厅预加载资源
        // reslist.LoadCellList.forEach(function (cell) {
        //     loadCellList.push(cell);
        // });
        if (cc.sys.platform != cc.sys.MOBILE_BROWSER) {
            //吉林麻将预加载资源
            /*var jlmj_loadCellList = require('jlmj_loadResInfo').LoadCellList;
            jlmj_loadCellList.forEach(function (cell) {
                loadCellList.push(cell);
            });

            //长春麻将预加载资源
            var ccmj_loadCellList = require('ccmj_loadResInfo').LoadCellList;
            ccmj_loadCellList.forEach(function (cell) {
                loadCellList.push(cell);
            });*/
        }
        cc.dd.ResLoader.loadSceneStaticResList(loadCellList, function (progress) {
            this.onProgress(progress);
        }.bind(this), function () {
            this.loadResComplet();
        }.bind(this));
    },

    /**
     * 资源加载完成
     */
    loadResComplet: function () {
        // cc.dd.DialogBoxUtil.show(1, '1.0.1.0', '确定', '取消',null,null);
        if (cc.game_pid == 10006 && !cc._newChifengApp && cc.sys.isNative) {
            cc.dd.DialogBoxUtil.show(1, `<color=#8F4F13><size=35>游戏已升级，请前往下载最新版本</size></color><br/><br/><size=20><color=red>温馨提示：安装新版本游戏之前，请卸载掉旧版本的游戏</color></size>`, '前往下载', null,
                function () {
                    cc.dd.native_systool.OpenUrl(Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
                    cc.game.end();
                }.bind(this));
            return;
        }

        cc.log("【hall-login】" + "登录 开始");
        if (cc.sys.isMobile && (cc.pixel_format == 2) && !cc.configuration.supportsETC2()) {
            // dd.DialogBoxUtil.show(1, "不支持该机型,请联系客服或用其他手机尝试登录", "确定", '',
            //     function () {
            //         cc.game.end();
            //     }.bind(this));
            dd.DialogBoxUtil.show(1, "请前往下载新包", "确定", '',
                function () {
                    var update_path = jsb.fileUtils.getWritablePath() + "blackjack";
                    jsb.fileUtils.removeDirectory(update_path);
                    cc.dd.native_systool.OpenUrl("https://d.alphaqr.com/xlqpcommonandroid");
                    cc.game.end();
                }.bind(this));
            return;
        }
        if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            login_module.Instance().WXLogiH5(this.codeH5);
        } else {
            if (LoginData.Instance().isRefreshTokenExist() && cc.sys.isNative && cc.sys.isMobile) { //真机
                cc.log("[游戏登录] ", "token存在,开始登录");
                switch (LoginData.Instance().loadLoginType()) {
                    case cc.dd.jlmj_enum.Login_Type.GUEST:
                        var ip = cc.sys.localStorage.getItem("SAVE_IP");
                        var port = cc.sys.localStorage.getItem("SAVE_PORT");
                        login_module.Instance().guestLogin(ip, port);
                        break;
                    case cc.dd.jlmj_enum.Login_Type.WX:
                        login_module.Instance().WXLogin();
                        break;
                    // case cc.dd.jlmj_enum.Login_Type.WXH5:
                    //     login_module.Instance().WXLogiH5();
                    //     break;
                    case cc.dd.jlmj_enum.Login_Type.ACCOUNT:
                        login_module.Instance().AccountLogin();
                        break;
                    default:
                        cc.dd.SceneManager.enterLoginScene();
                        cc.dd.NetWaitUtil.smooth_close();
                        break;
                }
            } else { //模拟器,浏览器
                cc.dd.SceneManager.enterLoginScene();
                cc.dd.NetWaitUtil.smooth_close();
            }
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        this.onUpdateEventMessage(event, data);
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onUpdateEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.GET_USERINFO:
                //if(login_module.Instance().login_type == emun.Login_Type.WXH5)
                if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
                    cc.log('检测是否扫描房间二维码');
                    this.h5Parma = (login_module.Instance().GetQueryString("state"));
                    if (this.h5Parma != null) {
                        cc.log('检测到二维码含有房间信息,id:' + this.h5Parma);
                        var para = this.h5Parma.split('_');

                        if (null == para[1] && para[0] != "" && para[0] != "0") {
                            let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
                            msg.setRoomId(para[0]);
                            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req', true);
                            cc.dd.NetWaitUtil.net_wait_start('正在进入房间...', 'onStop');
                        } else if (para[0] != "" && para[0] != "0") {

                            if (cc.wx_enter_club_baoxiang == null)
                                cc.wx_enter_club_baoxiang = [];
                            cc.wx_enter_club_baoxiang.roomId = para[0];
                            cc.wx_enter_club_baoxiang.clubId = para[1];
                            cc.wx_enter_club_baoxiang.delayTime = para[2];
                            cc.dd.native_systool.joinFriendAndPlay();
                        } else if (!HallCommonData.getInstance().isReconectGameExit()) {
                            cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
                        }

                    } else {
                        cc.log('未检测到二维码含有房间信息');
                        if (!HallCommonData.getInstance().isReconectGameExit()) {
                            cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
                        }
                    }

                } else {
                    let func = () => {
                        if (!HallCommonData.getInstance().isReconectGameExit()) {
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
                        }
                    }

                    //百度平台要先实名认证再进大厅
                    if (cc._isBaiDuPingTaiGame) {
                        if (HallCommonData.getInstance().idNum != '') {
                            func();
                        } else {
                            cc.dd.UIMgr.openUI(hall_prefab.CERTIFICATION, (ui) => {
                                ui.getComponent('klb_hall_Certification').setBindFunc(func, () => {
                                    cc.game.end();
                                });
                            });
                        }
                    } else {
                        func();
                    }
                }
                cc.dd.NetWaitUtil.smooth_close();
                return;
            case Hall.HallEvent.ENTER_CLUB_FAILED:
                var scName = cc.director.getScene().name;
                cc.log("scName:", scName);
                //if( login_module.Instance().login_type == emun.Login_Type.WXH5 && scName == "jlmj_loginLoad")
                if (cc.sys.platform == cc.sys.MOBILE_BROWSER && scName == "blackjack_preLogin") {
                    cc.log("扫码进入房间失败，进入大厅中。。");
                    if (!HallCommonData.getInstance().isReconectGameExit()) {
                        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
                    }
                }
                break;
            default:
                break;
        }

        if (!data || !data[0]) {
            return;
        }
        if (data[0].game_id == UpdaterGameId.HALL) {
            this.onHallUpdateEventMessage(event, data);
        } else if (data[0].game_id == UpdaterGameId.ANDROID) {
            this.onAPKUpdateEventMessage(event, data);
        } else if (data[0].game_id == UpdaterGameId.IOS) {
            this.onIPAUpdateEventMessage(event, data);
        } else if (cc.dd._.isNumber(data[0].game_id) && cc.JOIN_FRIEND_AND_PLAY) {
            this.onGameUpdateEventMessage(event, data)
        }
    },

    /**
     * 进入下载
     */
    downloadAPK: function (data) {
        if (cc.dd.native_systool.isNetAvailable()) {
            cc.log("进入自动下载apk");
            if (cc.dd.native_systool.isWifiAvailable() || data[1] <= 0) {
                this.pkgUpdater.startUpdate();
            } else {
                var size = parseFloat(data[1]) / 1024;
                var unit_des = 'KB';
                if (size >= 100) {
                    size = parseFloat(size) / 1024;
                    unit_des = 'M';
                }
                size = size.toFixed(2);
                dd.DialogBoxUtil.show(1, '您当前处于数据流量状态,程序更新大小:' + size + unit_des + ",是否确定下载?", '确定', '取消',
                    function () {
                        this.pkgUpdater.startUpdate();
                    }.bind(this),
                    function () {
                        this.reStartGame();
                    }.bind(this));
            }
        }
    },

    /**
     * 提示下载
     */
    promptedDownload: function (data) {
        var textTips = "";
        var callfunc = null;
        this._downloadingPkg = true;
        var platform = cc.sys.platform;
        if (platform === cc.sys.ANDROID) {
            textTips = cc.dd.Text.TEXT_POPUP_13;
        } else if (platform === cc.sys.IPHONE || platform === cc.sys.IPAD) {
            textTips = cc.dd.Text.TEXT_POPUP_13 + '\n(请先卸载老包，再安装新包)';
        }
        //安卓和苹果整包更新统一网站下载
        //textTips = cc.dd.Text.TEXT_POPUP_13;
        callfunc = function () {
            this.goToAppURL();
        }.bind(this);

        dd.DialogBoxUtil.show(1, textTips, '确定', '取消',
            function () {
                callfunc();
            }.bind(this),
            function () {
                cc.game.end();
            }.bind(this));
    },

    /**
     * 安装包更新处理
     * @param event
     * @param data
     */
    onAPKUpdateEventMessage: function (event, data) {
        clearTimeout(this.updateServerConnTimeoutCheck);
        switch (event) {
            case dd.UpdaterEvent.ALREADY_UP_TO_DATE:
                this.changeState(LoginState.UPDATE_HALL);
                break;
            case dd.UpdaterEvent.NEW_VERSION_FOUND:
                this.promptedDownload(data);
                break;
            case dd.UpdaterEvent.UPDATE_PROGRESSION:
                if (cc._appstore_check)
                    this.tips.string = "加载资源中...";
                else
                    this.tips.string = "正在更新";
                this.onProgress(data[1]);
                break;
            case dd.UpdaterEvent.UPDATE_FINISHED:
                cc.log("APK下载更新完成");
                var sdCardPath = "/mnt/sdcard/";
                var filePath = "blackjack/res/blackjack-release.apk";
                jsb.reflection.callStaticMethod("com/anglegame/blackjack/AppActivity", "installApp", "(Ljava/lang/String;)V", sdCardPath + filePath);
                break;
            case dd.UpdaterEvent.ERROR_NO_LOCAL_MANIFEST:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_4, "确定", "取消",
                    function () {
                        this.goToAppURL();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            case dd.UpdaterEvent.ERROR_DOWNLOAD_MANIFEST:
                this.updateFailed();
                break;
            case dd.UpdaterEvent.ERROR_PARSE_MANIFEST:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_4, "确定", "取消",
                    function () {
                        this.goToAppURL();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            case dd.UpdaterEvent.UPDATE_FAILED:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_5, "重试", "取消",
                    function () {
                        this.pkgUpdater.retry();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            default:
                break;
        }
    },

    /**
     * 安装包更新处理
     * @param event
     * @param data
     */
    onIPAUpdateEventMessage: function (event, data) {
        clearTimeout(this.updateServerConnTimeoutCheck);
        switch (event) {
            case dd.UpdaterEvent.ALREADY_UP_TO_DATE:
                this.changeState(LoginState.UPDATE_HALL);
                break;
            case dd.UpdaterEvent.NEW_VERSION_FOUND:
                this.promptedDownload(data);
                break;
            case dd.UpdaterEvent.UPDATE_PROGRESSION:
                if (cc._appstore_check)
                    this.tips.string = "加载资源中...";
                else
                    this.tips.string = "正在更新";
                this.onProgress(data[1]);
                break;
            case dd.UpdaterEvent.UPDATE_FINISHED:
                break;
            case dd.UpdaterEvent.ERROR_NO_LOCAL_MANIFEST:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_4, "确定", "取消",
                    function () {
                        this.goToAppURL();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            case dd.UpdaterEvent.ERROR_DOWNLOAD_MANIFEST:
                this.updateFailed();
                break;
            case dd.UpdaterEvent.ERROR_PARSE_MANIFEST:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_4, "确定", "取消",
                    function () {
                        this.goToAppURL();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            case dd.UpdaterEvent.UPDATE_FAILED:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_5, "重试", "取消",
                    function () {
                        this.pkgUpdater.retry();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            default:
                break;
        }
    },

    /**
     * 大厅资源更新处理
     * @param event
     * @param data
     */
    onHallUpdateEventMessage: function (event, data) {
        switch (event) {
            case dd.UpdaterEvent.ALREADY_UP_TO_DATE:
                this.changeState(LoginState.LOGIN_START);
                break;
            case dd.UpdaterEvent.NEW_VERSION_FOUND:
                if (cc.dd.native_systool.isNetAvailable()) {
                    if (cc.dd.native_systool.isWifiAvailable() || data[1] <= 0) {
                        this.hallUpdater.startUpdate();
                    } else {
                        var size = parseFloat(data[1]) / 1024;
                        var unit_des = 'KB';
                        if (size >= 100) {
                            size = parseFloat(size) / 1024;
                            unit_des = 'M';
                        }
                        size = size.toFixed(2);
                        dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_6 + size + unit_des + ",是否确定下载?", '确定', '取消',
                            function () {
                                this.hallUpdater.startUpdate();
                            }.bind(this),
                            function () {
                                this.reStartGame();
                            }.bind(this));
                    }
                }
                break;
            case dd.UpdaterEvent.UPDATE_PROGRESSION:
                if (cc._appstore_check)
                    this.tips.string = "加载资源中...";
                else
                    this.tips.string = "正在更新";
                this.onProgress(data[1]);
                break;
            case dd.UpdaterEvent.UPDATE_FINISHED:
                this.reStartGame();
                // dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_7, "确定", null,
                //     function () {
                //         this.reStartGame();
                //     }.bind(this),
                //     null);
                break;
            case dd.UpdaterEvent.ERROR_NO_LOCAL_MANIFEST:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_4, "确定", "取消",
                    function () {
                        this.goToAppURL();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            case dd.UpdaterEvent.ERROR_DOWNLOAD_MANIFEST:
                this.updateFailed();
                break;
            case dd.UpdaterEvent.ERROR_PARSE_MANIFEST:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_4, "确定", "取消",
                    function () {
                        this.goToAppURL();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            case dd.UpdaterEvent.UPDATE_FAILED:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_5, "重试", "取消",
                    function () {
                        this.hallUpdater.retry();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            default:
                break;
        }
    },

    /**
     * 游戏资源更新处理
     * @param event
     * @param data
     */
    onGameUpdateEventMessage: function (event, data) {
        switch (event) {
            case dd.UpdaterEvent.ALREADY_UP_TO_DATE:
                if (!cc._joinUpdater || !data || !data[0] || data[0].type != cc._joinUpdater.cfg.type) {
                    cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
                    return;
                }
                if (cc._joinUpdater.entrance != 'entrance_join') {
                    cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
                    return;
                }
                if (cc._join_room_updated) {
                    cc._join_room_updated();
                    cc._join_room_updated = null;
                }
                break;
            case dd.UpdaterEvent.NEW_VERSION_FOUND:
                if (cc.dd.Utils.checkIsUpdateOrWrongRoom(data[0].game_id)) {
                    let name = '';
                    var klb_game_list_config = require('klb_gameList');
                    let config = klb_game_list_config.getItem(function (item) {
                        return item.gameid == data[0].game_id;
                    }.bind(this));
                    if (config) {
                        name = config.name
                    }
                    cc.dd.DialogBoxUtil.show(0, "请先在大厅更新游戏:" + name, '确定', null, function () {
                        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
                    }.bind(this), null);
                } else {
                    cc.dd.DialogBoxUtil.show(0, "房间号错误", '确定', null, function () {
                        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
                    }.bind(this), null);
                }
                break;
            case dd.UpdaterEvent.UPDATE_PROGRESSION:
                if (cc._appstore_check)
                    this.tips.string = "加载资源中...";
                else
                    this.tips.string = "正在更新";
                this.onProgress(data[1]);
                break;
            case dd.UpdaterEvent.UPDATE_FINISHED:
                this.reStartGame();
                // dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_7, "确定", null,
                //     function () {
                //         this.reStartGame();
                //     }.bind(this),
                //     null);
                break;
            case dd.UpdaterEvent.ERROR_NO_LOCAL_MANIFEST:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_4, "确定", "取消",
                    function () {
                        this.goToAppURL();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            case dd.UpdaterEvent.ERROR_DOWNLOAD_MANIFEST:
                this.updateFailed();
                break;
            case dd.UpdaterEvent.ERROR_PARSE_MANIFEST:
                dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_4, "确定", "取消",
                    function () {
                        this.goToAppURL();
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            case dd.UpdaterEvent.UPDATE_FAILED:
                dd.DialogBoxUtil.show(1, "下载失败，请前往大厅更新", "确定", "取消",
                    function () {
                        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
                    }.bind(this),
                    function () {
                        cc.game.end();
                    }.bind(this));
                break;
            default:
                break;
        }
    },

    /**
     * 重启游戏
     */
    reStartGame: function () {
        cc.log('重启游戏!');
        cc.game_restarting = true;
        cc.audioEngine.stopAll();
        cc.game.restart();
    },

    /**
     * 前往app下载
     */
    goToAppURL: function () {
        var url = Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID);
        cc.dd.native_systool.OpenUrl(url);
        cc.game.end();
    },

    /**
     * 更新失败
     */
    updateFailed: function () {
        if (this._downloadingPkg) {
            return;
        }
        dd.DialogBoxUtil.showFixDialog(1, "无法连接更新服务器", '确定', '',
            function () {
                //cc.game.end();
                this.changeState(LoginState.LOGIN_START);
            }.bind(this),
            function () {

            }.bind(this));
    },

});

module.exports = resLoad;