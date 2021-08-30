var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;

var login_module = require('LoginModule');
var AppCfg = require('AppConfig');

var Native = cc.Class({

    statics: {
        s_native: null,

        Instance: function () {
            if (!this.s_native) {
                this.s_native = new Native();
            }
            return this.s_native;
        },

        Destroy: function () {
            if (this.s_native) {
                this.s_native = null;
            }
        },
    },

    ctor: function () {
        this.regNativeCallFunc();
    },

    regNativeCallFunc: function () {

        cc.GPSLocationCallback = function (result) {

        };

        if (cc.sys.platform == cc.sys.MOBILE_BROWSER || cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
            cc.game.on(cc.game.EVENT_HIDE, function () {
                if (!cc.isWebBackGround) {
                    cc.isWebBackGround = true;
                    cc.log("切换后台");
                    cc.gateNet.Instance().close();
                }
            });

            cc.game.on(cc.game.EVENT_SHOW, function () {
                if (cc.isWebBackGround) {
                    cc.log("切换前台", event);
                    cc.isWebBackGround = false;
                    login_module.Instance().reconnectWG();
                    cc.director.setDisplayStats(false);
                }
            });
        }

        //系统暂停
        cc.SystemOnPause = function () {
            if (cc.game_restarting) {   //游戏重启时,不执行暂停
                cc.log('游戏重启,不执行 SystemOnPause');
                return;
            }
            cc.log("Native ", "系统暂停");
            //游戏里面监听 SysEvent.PAUSE
            AudioManager.stopMusic();
            AudioManager.onGamePause();
            cc.onPauseTime = new Date().getTime();
            cc.isPaused = true;
            // if (!cc.wx_authing) {
            //     // cc.gateNet.Instance().close();
            //     cc.log('无 微信授权,切后台,关网络');
            // } else {
            //     cc.log('微信授权,切后台,不关网络');
            // }
            SysED.notifyEvent(SysEvent.PAUSE, null);
            // if(!cc.director.isPaused()){
            //     cc.director.pause();
            // }
            if (cc.gateNet.Instance().isConnected()) {
                var req = new cc.pb.common.msg_switch_client();
                cc.gateNet.Instance().sendMsg(cc.netCmd.common.cmd_msg_switch_client, req,
                    'msg_switch_client', 'no');
            }
        };

        //系统恢复
        cc.SystemOnResume = function () {
            if (cc.sys.platform === cc.sys.ANDROID) { //android need resume control, ios doesn't need
                if (cc.dd.resumeing == true) {
                    if(cc.dd._.isNumber(cc.dd.resumeTime) && new Date().getTime() - cc.dd.resumeTime < 1000){
                        cc.log("Native ", "系统恢复中");
                        return;
                    }else{
                        cc.log("Native ", "系统恢复超时");
                    }
                }
                cc.dd.resumeing = true;
                cc.dd.resumeTime = new Date().getTime();
            }

            setTimeout(function(){
                cc.log("Native ", "系统恢复");
                cc.isPaused = false;
                //游戏里面监听 SysEvent.RESUME
                //AudioManager.rePlayMusic();
                AudioManager.resumeBackGroundMusic();
                cc.dd.resumeing = false;
                cc.dd.resumeTime = 0;
                // if (cc.wx_authing) {
                //     cc.log('微信授权,切前台,授权回调进行网络恢复');
                //     return;
                // }

                SysED.notifyEvent(SysEvent.RESUME, null);
                if (!cc.dd.native_systool.isNetAvailable()) {
                    return;
                }
                var resumeTime = new Date().getTime();
                var reconnectTime = 10 * 1000;
                if (cc.sys.OS_IOS == cc.sys.os)
                    reconnectTime = 10 * 1000;
                if (cc.gateNet.Instance().isConnected() == false ||
                    (cc.onPauseTime == undefined || resumeTime - cc.onPauseTime > reconnectTime)) {
                    login_module.Instance().reconnectWG();
                }else{
                    cc.dd.native_systool.getNativeScheme();
                }

                // if(cc.director.isPaused()){
                //     cc.director.resume();
                // }
            }, 1000);
        };

        //系统返回键
        cc.SystemOnKeyBack = function (code) {
            cc.log("Native ", "系统返回键");
            SysED.notifyEvent(SysEvent.KEYBACK, null);
        };

        //苹果内购后通知后台
        cc.AppleInAppPay = function (receipt, product_id, transaction_id) {
            // cc.log("苹果内购凭证", receipt);
            // cc.log("苹果内购商品", product_id);
            var platform = require('Platform');
            var appCfg = require('AppConfig');
            var url = platform.appleInAppPayUrl[appCfg.PID];
            var shop_data = require('hall_shop').shopData;
            var coin_item = shop_data.Instance().getCoinItem(product_id);
            var price = coin_item.costDiscount > 0 ? coin_item.costDiscount : coin_item.costItemCount;
            var jsonObj = {};
            jsonObj.apple_receipt = receipt;
            jsonObj.product_id = product_id;
            jsonObj.appuserid = cc.dd.user.id;
            jsonObj.transaction_id = transaction_id;
            jsonObj.price = price;
            var msg = JSON.stringify(jsonObj);
            cc.log(url + '   ' + msg);
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(msg);

            xhr.onreadystatechange = function () {
                if (!cc.sys.isNative) {
                    if (xhr.readyState != XMLHttpRequest.DONE) {
                        return;
                    }
                }

                if (xhr.status >= 200 && xhr.status < 300) {
                    // var jsonData = JSON.parse( xhr.responseText );
                    cc.log('支付结果' + xhr.responseText);
                    if (parseInt(xhr.responseText) == 0) {
                        cc.dd.PromptBoxUtil.show('充值成功');
                    } else {
                        cc.dd.PromptBoxUtil.show('充值失败');
                    }
                }

            };
        };

        /**
         * 网络改变
         * @param connect_type 未连接=0,已连接=1
         */
        cc.networkChanged = function (connect_type) {
            cc.log("网络连接:", connect_type == 1 ? "已连接" : "未连接");
            if (!cc.director.getScene() || !cc.director.getScene().name) {
                return;
            }
            if (cc.director.getScene().name == "jlmj_loginLoad") {
                return;
            }
            if (connect_type == 1) {
                if (cc.gateNet.Instance().isConnected() == false) {
                    cc.dd.DialogBoxUtil.hide();
                    login_module.Instance().reconnectWG();
                }
            }
            else if (connect_type == 0) {
                cc.dd.SysTools.keepNetOk(function () {
                    if (cc.gateNet.Instance().isConnected() == false) {
                        login_module.Instance().reconnectWG();
                    }
                }.bind(this));
            }
        };

        //点击分享链接跳转回来进游戏房间
        cc.loginWithWX = function () {
            var AppCfg = require('AppConfig');
            if (cc.dd._.isString(cc.wx_enter_room_id) && cc.wx_enter_room_id != "") {
                setTimeout(() => {
                    if (cc.director.getScene().name == AppCfg.HALL_NAME) {
                        if (!cc.dd.native_systool.isNetAvailable()) {
                            return;
                        }
                        if (cc.isPaused) {
                            return;
                        }
                        if (cc.gateNet.Instance().isConnected() == false) {
                            return;
                        }
                        let _wx_enter_room_id = parseInt(cc.wx_enter_room_id);
                        cc.wx_enter_room_id = null;
                        let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
                        msg.setRoomId(_wx_enter_room_id);
                        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req', true);
                        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onStop');
                    }
                }, 1500)
            } else if (cc.dd._.isString(cc.wx_enter_club_id) && cc.wx_enter_club_id != "") {
                setTimeout(() => {
                    if (cc.director.getScene().name == AppCfg.HALL_NAME) {
                        cc.dd.SceneManager.replaceScene('klb_friend_group_scene');
                    }
                }, 1500)
            }
        };

        cc.dealWithWXInviteInfo = function (info) {
            if (cc.dd._.isString(info) && info != '') {
                if (info.indexOf('&') != -1) {
                    let inviteList = info.split('&');
                    if (cc.dd._.isArray(inviteList)) {
                        if(inviteList.length == 3){
                            cc.wx_enter_club_baoxiang = {
                                roomId:0,
                                clubId:0,
                                delayTime:0
                            }
                            for (let i = 0; i < inviteList.length; i++) {
                                if (cc.dd._.isString(inviteList[i]) && inviteList[i].indexOf('=') != -1) {
                                    let items = inviteList[i].split('=');
                                    if (cc.dd._.isArray(items) && items.length == 2) {
                                        if (items[0] == 'room_code') {
                                            cc.wx_enter_club_baoxiang.roomId = items[1];
                                        } else if (items[0] == 'relativesid') {
                                            cc.wx_enter_club_baoxiang.clubId = items[1];
                                        } else if (items[0] == 'delay_time') {
                                            cc.wx_enter_club_baoxiang.delayTime = items[1];
                                        }
                                    }
                                }
                            }
                        }else{
                            for (let i = 0; i < inviteList.length; i++) {
                                if (cc.dd._.isString(inviteList[i]) && inviteList[i].indexOf('=') != -1) {
                                    let items = inviteList[i].split('=');
                                    if (cc.dd._.isArray(items) && items.length == 2) {
                                        if (items[0] == 'room_id') {
                                            cc.wx_enter_room_id = items[1];
                                        } else if (items[0] == 'relativesid') {
                                            cc.wx_enter_club_id = items[1];
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (info.indexOf('=') != -1) {
                    let items = info.split('=');
                    if (cc.dd._.isArray(items) && items.length == 2) {
                        if (items[0] == 'room_id') {
                            cc.wx_enter_room_id = items[1];
                        } else if (items[0] == 'relativesid') {
                            cc.wx_enter_club_id = items[1];
                        }
                    }
                }
            }
        };
    },

    setLandscape: function () {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('game/SystemTool', 'SetLandscape', '()Z');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('SystemTool', 'setLandscape');
        }
    },

    setPortrait: function () {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('game/SystemTool', 'SetPortrait', '()Z');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('SystemTool', 'setPortrait');
        }
    },

    getScreenRatio: function () {
        var string_ratio = "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            string_ratio = jsb.reflection.callStaticMethod("game/SystemTool", "getScreenRatio", "()Ljava/lang/String;");
            //  string_ratio = jsb.reflection.callStaticMethod("com/yjhy/jlmj/AppActivity", "getScreenSize", "()Ljava/lang/String;");
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            string_ratio = jsb.reflection.callStaticMethod('SystemTool', 'getScreenRatio');
        } else {
            string_ratio = require('AppConfig').SIMULATOR_RATIO;
        }
        return string_ratio;
    },

    OpenUrl: function (url) {
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER)
        {
            window.open(url);
        }else if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
        {
            window.location.href = url;
        }else if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("game/SystemTool", "OpenUrl", "(Ljava/lang/String;)V", url);
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('SystemTool', 'OpenUrl:', url);
        }
    },

    isNetAvailable: function () {
        if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod("game/SystemTool", "isNetAvailable", "()Z");
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('SystemTool', 'isNetAvailable');
        }
        else if (!cc.sys.isNative) {
            return true;
        }
    },

    isWifiAvailable: function () {
        if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod("game/SystemTool", "isWifiAvailable", "()Z");
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('SystemTool', 'isWifiAvailable');
        }
    },

    SetClipBoardContent: function (content) {
        if(cc.sys.isBrowser)
        {
            var input = content + '';
            const el = document.createElement('textarea');
            el.value = input;
            el.setAttribute('readonly', '');
            el.style.contain = 'strict';
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            el.style.fontSize = '12pt'; // Prevent zooming on iOS

            const selection = getSelection();
            var originalRange = false;
            if (selection.rangeCount > 0) {
                originalRange = selection.getRangeAt(0);
            }
            document.body.appendChild(el);
            el.select();
            el.selectionStart = 0;
            el.selectionEnd = input.length;

            var success = false;
            try {
                success = document.execCommand('copy');
            } catch (err) {}

            document.body.removeChild(el);

            if (originalRange) {
                selection.removeAllRanges();
                selection.addRange(originalRange);
            }
            cc.log("h5 clipboard:",success);
            if(success)
            {
                cc.dd.PromptBoxUtil.show('已复制到剪贴板');
            }

        }else if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("game/SystemTool", "SetClipBoardContent", "(Ljava/lang/String;)V", content);
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('SystemTool', 'SetClipBoardContent:', content);
        }
    },

    StartLoadingAni: function (content) {
        if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("game/SystemTool", "StartLoadingAni", "(Ljava/lang/String;)V", content);
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('SystemTool', 'StartLoadingAni:', content);
        }
    },

    StopLoadingAni: function () {
        if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("game/SystemTool", "StopLoadingAni", "()V");
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('SystemTool', 'StopLoadingAni');
        }
    },

    SetLoadingAniTips: function (content) {
        if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("game/SystemTool", "SetLoadingAniTips", "(Ljava/lang/String;)V", content);
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('SystemTool', 'SetLoadingAniTips:', content);
        }
    },

    getBatteryLevel: function () {
        if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod("game/SystemTool", "getBatteryLevel", "()F");
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('SystemTool', 'getBatteryLevel');
        }
    },

    getMD5ByFile: function (path) {
        if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod("game/SystemTool", "getMD5ByFile", "(Ljava/lang/String;)Ljava/lang/String;", path);
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('SystemTool', 'getMD5ByFile:', path);
        }
    },

    captureScreenToPhotoAlbum: function (path) {
        if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/WxTool', 'SaveFileToPhoto', '(Ljava/lang/String;)V', path);
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('SystemTool', 'captureScreenToPhotoAlbum:', path);
        }
    },

    /**
     * 屏蔽安卓启动的resume调用js引起的bug
     * @returns {*}
     */
    gameStart: function () {
        if (cc.sys.OS_ANDROID == cc.sys.os && cc.sys.isNative) {
            return jsb.reflection.callStaticMethod("game/SystemTool", "gameStart", "()V");
        }
    },

    /**
     * 内购
     * @param product_id
     */
    inAppPay: function (product_id) {
        if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('SystemTool', 'inAppPay:', product_id);
        }
    },

    /**
     * 获取设备信息
     */
    getDeviceInfo: function () {
        if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod("game/SystemTool", "getDeviceInfo", "()Ljava/lang/String;");
        } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('SystemTool', 'getDeviceInfo');
        }
    },
    getHWUrl(group, port, originIP) {
        return originIP + ':' + port;
        // if (cc.sys.isNative && cc.sys.OS_ANDROID == cc.sys.os) {
        //     return jsb.reflection.callStaticMethod("game/SystemTool", "getHWUrl", "(Ljava/lang/String;ILjava/lang/String;)Ljava/lang/String;", group, port, originIP);
        // } else if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
        //     return jsb.reflection.callStaticMethod('SystemTool', 'getUrl:setGroupName:setoriginPort:', originIP, group, port);
        // }
    },


    joinFriendAndPlay(){
        let wx_enter_room_id = parseInt(cc.wx_enter_club_baoxiang.roomId);
        let wx_enter_club_id = parseInt(cc.wx_enter_club_baoxiang.clubId);
        let delayTime = parseInt(cc.wx_enter_club_baoxiang.delayTime);

        cc.wx_enter_club_baoxiang = null;

        if(cc.dd._.isNumber(delayTime) && new Date().getTime() > delayTime){
            cc.dd.DialogBoxUtil.show(0, '该链接已过期，请联系亲友圈管理员重新获取', '确定', null, ()=>{
                cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
            });
            return;
        }

        if(!cc.dd._.isNumber(wx_enter_room_id) && !cc.dd._.isNumber(wx_enter_club_id)){
            cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
            return;
        }

        if(wx_enter_club_id == 0){
            cc.dd.DialogBoxUtil.show(0, '亲友圈不存在', '确定', null, ()=>{
                cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
            });
            return;
        }

        cc.JOIN_FRIEND_AND_PLAY = {
            state:1,
            clubID: wx_enter_club_id,
            wanfaNum: wx_enter_room_id,
            rule: null,
            failedCall: ()=>{
                if(cc.director.getScene().name == 'jlmj_login' || cc.director.getScene().name == 'jlmj_loginLoad'){
                    var AppCfg = require('AppConfig');
                    cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
                }
                cc.JOIN_FRIEND_AND_PLAY = null;
            },
            createFunc:(deskNum)=>{
                cc.sys.localStorage.setItem('club_game_wafanum', cc.JOIN_FRIEND_AND_PLAY.wanfaNum);

                let info = cc.JOIN_FRIEND_AND_PLAY.rule;
                let rule = info.gameInfo;
                rule.clubWanfa = cc.JOIN_FRIEND_AND_PLAY.wanfaNum;
                rule.clubWanfaDesk = deskNum;
                rule.clubCreateType = 2;

                info.getContent = function(){
                    let content = {};
                    content.gameInfo = this.gameInfo;
                    content.rule = this.rule;
                    content.latlngInfo = this.latlngInfo;
                    content.rulePublic = this.rulePublic;

                    return content;
                }

                if (cc.sys.isNative) {
                    if (cc.sys.OS_ANDROID == cc.sys.os) {
                        var loc = new cc.pb.room_mgr.latlng();
                        var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                        var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                        loc.setLatitude(latitude);
                        loc.setLongitude(longitude);
                        cc.log("详细地址：经度 " + longitude);
                        cc.log("详细地址：纬度 " + latitude);
                        if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                            info.latlngInfo = loc;
                        }
                    } else if (cc.sys.OS_IOS == cc.sys.os) {
                        var loc = new cc.pb.room_mgr.latlng();
                        var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                        var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                        loc.setLatitude(Latitude);
                        loc.setLongitude(Longitude);
                        cc.log("详细地址：经度 " + Longitude);
                        cc.log("详细地址：纬度 " + Latitude);
                        if (parseInt(Latitude) != 0 || parseInt(Longitude) != 0) {
                            info.latlngInfo = loc;
                        }
                    }
                }
                if(!cc.dd.Utils.checkGPS(info)){
                    cc.dd.DialogBoxUtil.show(0, "创建房间失败，无法获取定位信息", '确定', null, function () {
                        cc.JOIN_FRIEND_AND_PLAY.failedCall();
                    }, null);
                    return;
                }
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_create_game_req, info, 'msg_create_game_req', true);
            },
            sitFunc:(roomID)=>{
                cc.sys.localStorage.setItem('club_game_wafanum', cc.JOIN_FRIEND_AND_PLAY.wanfaNum);

                let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
                msg.setRoomId(roomID);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req',true);
            },
            reEnter:()=>{
                var obj = new cc.pb.club.msg_club_baofang_detail_req();
                obj.setClubId(cc.JOIN_FRIEND_AND_PLAY.clubID);
                obj.setWanfanum(cc.JOIN_FRIEND_AND_PLAY.wanfaNum);
                cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_baofang_detail_req, obj, 'msg_club_baofang_detail_req', true);
                cc.dd.NetWaitUtil.net_wait_start('网络不太好 .....', 'msg_club_baofang_detail_req');
            },
            joinFunc:(roomID)=>{
                cc.sys.localStorage.setItem('club_game_wafanum', cc.JOIN_FRIEND_AND_PLAY.wanfaNum);

                var enter_game_req = new cc.pb.room_mgr.msg_enter_game_req();
                var game_info = new cc.pb.room_mgr.common_game_header();
                game_info.setRoomId(roomID);
                enter_game_req.setGameInfo(game_info);
                enter_game_req.setSeat(0);
                if (cc.sys.isNative) {
                    if (cc.sys.OS_ANDROID == cc.sys.os) {
                        var loc = new cc.pb.room_mgr.latlng();
                        var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                        var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                        loc.setLatitude(latitude);
                        loc.setLongitude(longitude);
                        cc.log("详细地址：经度 " + longitude);
                        cc.log("详细地址：纬度 " + latitude);
                        if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                            enter_game_req.setLatlngInfo(loc);
                        }
                    } else if (cc.sys.OS_IOS == cc.sys.os) {
                        var loc = new cc.pb.room_mgr.latlng();
                        var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                        var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                        loc.setLatitude(Latitude);
                        loc.setLongitude(Longitude);
                        cc.log("详细地址：经度 " + Longitude);
                        cc.log("详细地址：纬度 " + Latitude);
                        if (parseInt(Latitude) != 0 || parseInt(Longitude) != 0) {
                            enter_game_req.setLatlngInfo(loc);
                        }
                    }
                }
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_game_req, enter_game_req, 'cmd_msg_enter_game_req', true);
            },
            getBaoFang:()=>{
                var obj = new cc.pb.club.msg_club_baofang_list_req();
                obj.setClubId(cc.JOIN_FRIEND_AND_PLAY.clubID);
                cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_baofang_list_req, obj, 'msg_club_baofang_list_req', true);
                cc.dd.NetWaitUtil.net_wait_start('网络不太好 ......', 'msg_club_baofang_list_req');
            }
        };

        var obj = new cc.pb.club.msg_join_club_req();
        obj.setClubid(wx_enter_club_id + 10000000);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_join_club_req, obj, 'msg_join_club_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳....', 'msg_join_club_req');
    },

    getNativeScheme(){
        if (cc.sys.isNative) {
            //获取微信好友房连接拉起
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                //TODO:  整包更新时用  game/SystemTool   暂时处理
                if (cc.game_pid == 10008 || cc.game_pid == 10009 || cc.game_pid == 10003 || cc._isKuaiLeBaTianDaKeng  || cc._isHuaweiGame)
                    jsb.reflection.callStaticMethod('game/SystemTool', 'getWXRoomID', '()V');
                else
                    jsb.reflection.callStaticMethod('com/yjhy/jlmj/AppActivity', 'getWXRoomID', '()V');
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('AppController', 'getWXRoomID');
            }

            setTimeout(()=>{
                if(cc.director.getScene().name == AppCfg.HALL_NAME || cc.director.getScene().name == 'klb_friend_group_scene'){
                    if(cc.wx_enter_club_baoxiang){
                        cc.dd.native_systool.joinFriendAndPlay();
                    }else if (cc.dd._.isString(cc.wx_enter_room_id) && cc.wx_enter_room_id != "") {
                        let wx_enter_room_id = parseInt(cc.wx_enter_room_id);
                        cc.wx_enter_room_id = null;
                        let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
                        msg.setRoomId(wx_enter_room_id);
                        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req', true);
                        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onStop');
                    } else if (cc.dd._.isString(cc.wx_enter_club_id) && cc.wx_enter_club_id != "") {
                        cc.dd.SceneManager.replaceScene('klb_friend_group_scene');
                    }
                }
            }, 500);
        }
    }
});

module.exports = Native;
