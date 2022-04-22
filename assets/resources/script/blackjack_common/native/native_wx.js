var WxData = require("com_wx_data").WxData.Instance();
var WxED = require("com_wx_data").WxED;
var WxEvent = require("com_wx_data").WxEvent;
var login_module = require('LoginModule');

cc.WxShareType = 0;
cc.OnWxShareFunc = null;
cc.WxShareing = false;
cc.ShareType = -1;

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

        //闲聊进入app
        cc.XLCallback = function (roomToken, roomid) {
            cc.log('XLCallback:', roomToken, roomid);
        };

        /**
         * 微信授权回调
         * @param err_code 授权成功=0,授权失败=其他
         * @param token
         */
        cc.onResponseWxCode = function (err_code, token) {
            if (err_code == 0) {
                cc.log('微信授权 code=' + token);
                WxData.response_code = token;
                WxED.notifyEvent(WxEvent.RESPONSE_CODE, null);
            } else {
                cc.dd.DialogBoxUtil.show(1, "微信授权失败,请重试");
            }
        };

        // 微信登录完成
        cc.WeixinSaveUserInfo = function (openId, unionId, nick, sex, city, headUrl) {
            WxData.setWxData(openId, unionId, nick, sex, city, headUrl);
            WxED.notifyEvent(WxEvent.LOGIN, null);
        };

        // 微信头像下载完成
        cc.WeixinLoginCallback = function (openId, headFilePath) {
            WxED.notifyEvent(WxEvent.DOWNLOAD_HEAD, [openId, headFilePath]);
        };

        // 微信分享完成
        cc.WeixinShareCallback = function (sCode) {
            cc.WxShareing = false;
            if (!this.getShareSuccess())
                sCode = -1;
            WxED.notifyEvent(WxEvent.SHARE, sCode);
            if (parseInt(sCode) == 0) {
                // cc.dd.PromptBoxUtil.show('分享成功');
                cc.OnWxShareFunc = function () {
                    if (cc.ShareType == 0xFFFF || cc.ShareType == 5)
                        return;
                    var msg = new cc.pb.rank.msg_share_friend_2s();
                    let type = cc.WxShareType || 2;
                    msg.setType(type);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_share_friend_2s, msg, 'msg_share_friend_2s', true);
                    //cc.OnWxShareFunc = null;
                };
                setTimeout(function () {
                    cc.dd.PromptBoxUtil.show('分享成功');
                    //cc.log('**************************   分享类型:'+cc.ShareType);
                    switch (cc.ShareType) {
                        case 1://比赛场分享加积分
                            var msg = new cc.pb.match.match_wx_share_req();
                            cc.gateNet.Instance().sendMsg(cc.netCmd.match.cmd_match_wx_share_req, msg, 'match_wx_share_req', true);
                            var msg2 = new cc.pb.rank.msg_share_friend_2s();
                            msg2.setType(2);
                            cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_share_friend_2s, msg2, 'msg_share_friend_2s', true);
                            break;
                        // case 2://无奖励
                        //     break;
                        //国庆活动分享
                        case 3:
                        case 4:
                            var msg = new cc.pb.rank.msg_share_friend_2s();
                            msg.setType(cc.ShareType);
                            cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_share_friend_2s, msg, 'msg_share_friend_2s', true);
                            break;
                        case 5:
                            let index = cc.dd.shareAgainIndex;
                            var msg = new cc.pb.hall.draw_share_seven_day_reward_req();
                            msg.setIndex(index);
                            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_draw_share_seven_day_reward_req, msg, "再次领取签到 index=" + index, true);
                            break;
                        case 6://救济金再领取
                            var msg = new cc.pb.rank.msg_share_relief_gift_2s();
                            cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_share_relief_gift_2s, msg, "msg_share_relief_gift_2s", true);
                            break;
                        case 7://每日分享:
                            var msg = new cc.pb.rank.msg_day_share_reward_2s();
                            msg.setClientChannel(cc.dd.jlmj_enum.Login_Type.WX);
                            cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_day_share_reward_2s, msg, "msg_day_share_reward_2s", true);
                            break;
                        case 0xFFFF:
                            break;
                        default:
                            if (cc.OnWxShareFunc) {
                                cc.OnWxShareFunc();
                            }
                            break;
                    }
                }, 500);
            }
            else {
                setTimeout(function () {
                    cc.dd.PromptBoxUtil.show('分享失败');
                }, 500);
            }
        }.bind(this);

        cc.WeixinPayCallback = function (result) {

        };

        cc.AppstorePayCallback = function (result, productId, errorDesc) {

        };

        cc.WeixinLaunchApp = function (url) {

        };

        //华为授权回调
        cc.hwLoginCallBack = function (err_code, ts, playerId, playerLevel, playerSSign, nickname, headurl) {
            if (err_code == 0) {
                var obj = {
                    ts: ts,
                    playerId: playerId,
                    playerLevel: playerLevel,
                    playerSSign: playerSSign,
                    nickname: nickname,
                    headurl: headurl
                };
                var json = JSON.stringify(obj);
                cc.log('华为授权 json=' + json);
                WxData.hw_code = obj;
                WxED.notifyEvent(WxEvent.HUAWEI_CODE, null);
            } else {
                cc.dd.DialogBoxUtil.show(1, "华为登陆授权失败,请重试");
            }
        };

        cc.vivoLoginCallBack = function (err_code, username, openid, token) {
            if (err_code == 0) {
                var obj = {
                    un: username,
                    id: openid,
                    tk: token,
                };
                var json = JSON.stringify(obj);
                cc.log('vivo授权 json=' + json);
                WxData.vivo_code = obj;
                WxED.notifyEvent(WxEvent.VIVO_CODE, null);
            } else {
                cc.dd.DialogBoxUtil.show(1, "VIVO登陆授权失败,请重试");
            }
        };

        cc.oppoLoginCallBack = function (err_code, ssoid, token) {
            if (err_code == 0) {
                var obj = {
                    id: ssoid,
                    tk: token,
                };
                var json = JSON.stringify(obj);
                cc.log('oppo授权 json=' + json);
                WxData.oppo_code = obj;
                WxED.notifyEvent(WxEvent.OPPO_CODE, null);
            } else {
                cc.dd.DialogBoxUtil.show(1, "OPPO登陆授权失败,请重试");
            }
        };

        cc.miLoginCallBack = function (err_code, uid, session, nickname) {
            if (err_code == 0) {
                var obj = {
                    id: uid,
                    tk: session,
                    nick: nickname,
                };
                var json = JSON.stringify(obj);
                cc.log('xiaomi授权 json=' + json);
                WxData.xiaomi_code = obj;
                WxED.notifyEvent(WxEvent.XIAOMI_CODE, null);
            } else {
                cc.log('miLogin error. code ' + err_code);
                cc.dd.DialogBoxUtil.show(1, "XIAOMI登陆授权失败,请重试");
            }
        };

        //华为内购后通知后台
        cc.hwIAPCallBack = function (data, sign) {
            cc.log('data:' + data + ' | sign:' + sign);
            var dataObj = JSON.parse(data);
            var platform = require('Platform');
            var appCfg = require('AppConfig');
            var url = platform.hwIAPUrl[appCfg.PID];
            var shop_data = require('hall_shop').shopData;
            var product_id = dataObj.productId;
            var coin_item = shop_data.Instance().getCoinItem(product_id);
            var price = coin_item.costDiscount > 0 ? coin_item.costDiscount : coin_item.costItemCount;
            var jsonObj = {};
            jsonObj.itemid = product_id;
            jsonObj.money = price;
            jsonObj.userid = cc.dd.user.id;
            jsonObj.purchaseToken = dataObj.purchaseToken;
            jsonObj.productId = product_id;
            jsonObj.applicationId = dataObj.applicationId;
            jsonObj.orderId = dataObj.orderId;
            var msg = JSON.stringify(jsonObj);
            cc.log(url + '   ' + msg);
            var en0 = cc.dd.SysTools.encode64(msg);
            var en1 = cc.dd.SysTools.encode64(cc.dd.Utils.getRandomStr(2) + en0);
            var en2 = cc.dd.SysTools.encode64(en1 + cc.dd.Utils.getRandomStr(3));
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(en2);
            xhr.onreadystatechange = function () {
                if (!cc.sys.isNative) {
                    if (xhr.readyState != XMLHttpRequest.DONE) {
                        return;
                    }
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    // var jsonData = JSON.parse( xhr.responseText );
                    var responseObj = JSON.parse(xhr.responseText);
                    cc.log('支付结果' + responseObj);
                    if (responseObj.code == 0) {
                        cc.dd.PromptBoxUtil.show('购买成功');
                    } else {
                        cc.dd.PromptBoxUtil.show(responseObj.msg);
                    }
                }

            };
        };
    },

    IsWXAppInstalled: function () {
        if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            return true
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('game/WxTool', 'IsWXAppInstalled', '()Z');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('WxTool', 'IsWXAppInstalled');
        }
    },

    /**
     * 微信登录调用如下接口
     */
    //cc.dd.native_wx.SendWechatAuth();
    SendWechatAuth: function () {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/WxTool', 'SendWXAuthReq', '()V');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('WxTool', 'SendWXAuthReq');
        }
    },

    /**
     * 分享到会话调用如下接口
     */
    //cc.dd.native_wx.SendAppContent(room_num, title, content, url);
    SendAppContent: function (room_num, title, content, url, type) {
        if (!this.getCanShare())
            return;
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var cmdUrl = url;
        if (room_num != "" && (cc.dd._.isNumber(room_num) || cc.dd._.isString(room_num))) {
            cmdUrl += ('?no=' + room_num);
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/WxTool', 'SendLinkUrl', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', cmdUrl, title, content);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('WxTool', 'SendLinkURL:title:content:', cmdUrl, title, content);
        }
    },

    /**
     * 分享到朋友圈调用如下接口
     */
    //cc.dd.native_wx.ShareLinkTimeline(url,title,content);
    ShareLinkTimeline: function (url, title, content, type) {
        if (!this.getCanShare())
            return;
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/WxTool', 'ShareLinkTimeline', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', url, title, content);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('WxTool', 'ShareLinkTimeline:title:content:', url, title, content);
        }
    },

    /**
     * 截图分享给好友
     */
    //cc.dd.native_wx.SendScreenShot();
    SendScreenShot: function (node, type) {
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var fileName = "screen_capture.png";
        cc.dd.SysTools.captureScreen(fileName, node, function () {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', jsb.fileUtils.getWritablePath() + fileName, 0);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('WxTool', 'SendScreenShot');
            }
        });
    },

    /**
     * 左下节点截图到微信好友
     */
    SendNodeShotToWechat: function (node, type, func) {
        if (!this.getCanShare()) {
            if (func) {
                func();
            }
            return;
        }
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var fileName = "screen_capture.png";
        cc.dd.SysTools.captureNode(fileName, node, function () {
            if (func) {
                func();
            }
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', jsb.fileUtils.getWritablePath() + fileName, 0);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('WxTool', 'SendScreenShot');
            }
        });
    },

    /**
     * 左下节点截图到朋友圈
     */
    SendNodeShotToMoment: function (node, type) {
        if (!this.getCanShare())
            return;
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var fileName = "screen_capture.png";
        cc.dd.SysTools.captureNode(fileName, node, function () {
            setTimeout(function () {
                if (cc.sys.OS_ANDROID == cc.sys.os) {
                    jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', jsb.fileUtils.getWritablePath() + fileName, 1);
                } else if (cc.sys.OS_IOS == cc.sys.os) {
                    jsb.reflection.callStaticMethod('WxTool', 'SendScreenShotTimeline');
                }
            }, 500);
        });
    },

    /**
     * 截图分享到朋友圈
     */
    //cc.dd.native_wx.SendScreenShotTimeline();
    SendScreenShotTimeline: function (node, type) {
        if (!this.getCanShare())
            return;
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var fileName = "screen_capture.png";
        cc.dd.SysTools.captureScreen(fileName, node, function () {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', jsb.fileUtils.getWritablePath() + fileName, 1);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('WxTool', 'SendScreenShotTimeline');
            }
        });

    },

    /**
     * 局部截图分享给好友(竖版)
     */
    //cc.dd.native_wx.SendScreenShot();
    SendScreenShotVertical: function (node, type) {
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var fileName = "screen_capture.png";
        cc.dd.SysTools.captureScreenVertical(fileName, node, function () {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', jsb.fileUtils.getWritablePath() + fileName, 0);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('WxTool', 'SendScreenShot');
            }
        });
    },

    /**
     * 局部截图分享到朋友圈(竖版)
     */
    //cc.dd.native_wx.SendScreenShotTimeline();
    SendScreenShotTimelineVertical: function (node, type) {
        if (!this.getCanShare())
            return;
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var fileName = "screen_capture.png";
        cc.dd.SysTools.captureScreenVertical(fileName, node, function () {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', jsb.fileUtils.getWritablePath() + fileName, 1);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('WxTool', 'SendScreenShotTimeline');
            }
        });
    },

    /**
     * 分享图片给好友
     */
    //cc.dd.native_wx.ShareImageToFriend(path);
    ShareImageToFriend: function (path, type) {
        if (!cc.sys.isNative) {
            cc.dd.PromptBoxUtil.show('网页不分享图片!');
            return;
        }
        if (!this.getCanShare())
            return;
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var share_img_path = jsb.fileUtils.getWritablePath() + path;
        var share_img_dir = share_img_path.substring(0, share_img_path.lastIndexOf('/'));
        jsb.fileUtils.createDirectory(share_img_dir);
        // cc.log('分享图片地址:'+share_img_path);
        // cc.log('分享图片目录:'+share_img_dir);
        if (!jsb.fileUtils.isFileExist(share_img_path)) {
            cc.log('分享图片 不存在, 从包内复制');
            var pkg_url = cc.url.raw(path);
            // cc.log('图片包内地址:'+pkg_url);
            var data = jsb.fileUtils.getDataFromFile(pkg_url);
            jsb.fileUtils.writeDataToFile(data, share_img_path);
        }

        // if(jsb.fileUtils.isFileExist(share_img_path)){
        //     cc.log('分享图片存在');
        // }

        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', share_img_path, 0);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            // todo 自定义缩略图大小
            // var width = '350.0';
            // var height = '200.0';
            // jsb.reflection.callStaticMethod('WxTool', 'SendImageToFriend:Width:Height:', share_img_path,width, height);
            jsb.reflection.callStaticMethod('WxTool', 'SendImageToFriend:', share_img_path);
        }
    },

    /**
     * 分享图片到朋友圈
     */
    //cc.dd.native_wx.ShareImageToFriend(path);
    ShareImageToTimeline: function (path, type) {
        if (!cc.sys.isNative) {
            cc.dd.PromptBoxUtil.show('网页不分享图片!');
            return;
        }
        if (!this.getCanShare())
            return;
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var share_img_path = jsb.fileUtils.getWritablePath() + path;
        var share_img_dir = share_img_path.substring(0, share_img_path.lastIndexOf('/'));
        jsb.fileUtils.createDirectory(share_img_dir);
        // cc.log('分享图片地址:'+share_img_path);
        // cc.log('分享图片目录:'+share_img_dir);
        if (!jsb.fileUtils.isFileExist(share_img_path)) {
            cc.log('分享图片 不存在, 从包内复制');
            var pkg_url = cc.url.raw(path);
            // cc.log('图片包内地址:'+pkg_url);
            var data = jsb.fileUtils.getDataFromFile(pkg_url);
            jsb.fileUtils.writeDataToFile(data, share_img_path);
        }

        // if(jsb.fileUtils.isFileExist(share_img_path)){
        //     cc.log('分享图片存在');
        // }

        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', share_img_path, 1);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            // var width = '750.0';
            // var height = '1334.0';
            // jsb.reflection.callStaticMethod('WxTool', 'SendImageToTimeline:Width:Height:', share_img_path, width, height);
            jsb.reflection.callStaticMethod('WxTool', 'SendImageToTimeline:', share_img_path);
        }
    },

    /**
     * 分享某个节点到微信
     */
    SendCustomNodeShotToWechat: function (node, type, func) {
        // if (!this.getCanShare()){
        //     if(func){
        //         func();
        //     }
        //     return;
        // }
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var fileName = "screen_capture.png";
        cc.dd.SysTools.captureCustomNode(fileName, node, function () {
            if (func) {
                func();
            }
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', jsb.fileUtils.getWritablePath() + fileName, 0);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('WxTool', 'SendScreenShot');
            }
        });
    },

    SetShareThumbImage: function (path) {
        if (!cc.sys.isNative) {
            return;
        }
        var share_img_path = jsb.fileUtils.getWritablePath() + path;
        var share_img_dir = share_img_path.substring(0, share_img_path.lastIndexOf('/'));
        jsb.fileUtils.createDirectory(share_img_dir);
        // cc.log('分享图片地址:'+share_img_path);
        // cc.log('分享图片目录:'+share_img_dir);
        if (!jsb.fileUtils.isFileExist(share_img_path)) {
            cc.log('分享图片 不存在, 从包内复制');
            var pkg_url = cc.url.raw(path);
            // cc.log('图片包内地址:'+pkg_url);
            var data = jsb.fileUtils.getDataFromFile(pkg_url);
            jsb.fileUtils.writeDataToFile(data, share_img_path);
        }
    },

    /**
     * 分享到会话调用如下接口
     */
    SendAppInvite: function (info, title, content, url, type) {
        if (!this.getCanShare())
            return;
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        // var cmdUrl = url + '?roomid='+info.roomId+'&gametype='+info.gameId+'&title='+info.title+'&content='+info.content+'&usercount'+info.userCount+'&jushu='+info.jushu+'&jushutitle='+info.jushuTitle;
        // for(let i = 0; i < info.playerName.length; i++){
        //     cmdUrl += ('&playername[]='+info.playerName[i]);
        // }
        // cmdUrl += '&gamestate='+info.state;
        // cc.error(JSON.stringify(info));
        content = cc.dd.Utils.subChineseStr(content, 0, 90);
        var cmdUrl = url + '?data=' + encodeURIComponent(JSON.stringify(info)) + '&channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
        // cc.error(cmdUrl);
        if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_wx_share_tip_h5', function (prefab) {
                var Component = prefab.getComponent('klb_wx_share_h5');
                Component.onInvite(info.roomid);
            });
            return;
        }


        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/WxTool', 'SendLinkUrl', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', cmdUrl, title, content);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('WxTool', 'SendLinkURL:title:content:', cmdUrl, title, content);
        }
    },

    /**
     * 亲友圈分享
     */
    SendFriendGroupInvite: function (info, title, content, url, type) {
        if (!this.getCanShare())
            return;
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        var cmdUrl = url + '?isrelatives=1&channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100) + '&data=' + encodeURIComponent(JSON.stringify(info));
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/WxTool', 'SendLinkUrl', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', cmdUrl, title, content);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('WxTool', 'SendLinkURL:title:content:', cmdUrl, title, content);
        }
    },

    SendWXInvite: function (title, content, url, type) {
        if (!this.getCanShare())
            return;
        cc.WxShareing = true;
        cc.ShareType = type == null ? -1 : type;
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/WxTool', 'SendLinkUrl', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', url, title, content);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('WxTool', 'SendLinkURL:title:content:', url, title, content);
        }
    },


    //获取是否能分享
    getCanShare() {
        var time = new Date().getTime();
        if (cc._lastShareTime) {//上次连续分享开始时间  10分钟刷新
            if (time - cc._lastShareTime > 10 * 60 * 1000) {//刷新
                cc._shareCount = 0;//重置计数
                cc._shareStartTime = time;
                cc._lastShareTime = time;
            }
            else {
                cc._shareCount += 1;//计数
                cc._shareStartTime = time;
            }
        }
        else {
            cc._lastShareTime = time;
            cc._shareCount = 0;//重置计数
            cc._shareStartTime = time;
        }
        var conf = this.getShareRuleCfg(cc._shareCount, 0);
        var ret = conf ? conf.switch != 1 : false;
        if (!ret) {
            cc.dd.PromptBoxUtil.show('分享失败请重试');
        }
        return ret;
    },

    //获取分享成功率配置 次数 间隔时间
    getShareRuleCfg(count, time) {
        var cfg = require('klb_share_rule');

        if (cc.sys.isBrowser) //cc.sys.platform == cc.sys.MOBILE_BROWSER)
        {
            var item = cfg.getItem((it) => {
                if (it.equipment == 'Android' && parseInt(it.share_frequency.split(',')[0]) <= count && (parseInt(it.share_frequency.split(',')[1]) == -1 || count < parseInt(it.share_frequency.split(',')[1])) && time >= parseInt(it.share_time.split(',')[0]) && (parseInt(it.share_time.split(',')[1]) == -1 || time < parseInt(it.share_time.split(',')[1]))) {
                    return true;
                }
            })
            return item;
        }




        if (cc.sys.os == cc.sys.OS_ANDROID) {//安卓
            var item = cfg.getItem((it) => {
                if (it.equipment == 'Android' && parseInt(it.share_frequency.split(',')[0]) <= count && (parseInt(it.share_frequency.split(',')[1]) == -1 || count < parseInt(it.share_frequency.split(',')[1])) && time >= parseInt(it.share_time.split(',')[0]) && (parseInt(it.share_time.split(',')[1]) == -1 || time < parseInt(it.share_time.split(',')[1]))) {
                    return true;
                }
            })
            return item;
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {//IOS
            var item = cfg.getItem((it) => {
                if (it.equipment == 'ios' && parseInt(it.share_frequency.split(',')[0]) <= count && (parseInt(it.share_frequency.split(',')[1]) == -1 || count < parseInt(it.share_frequency.split(',')[1])) && time >= parseInt(it.share_time.split(',')[0]) && (parseInt(it.share_time.split(',')[1]) == -1 || time < parseInt(it.share_time.split(',')[1]))) {
                    return true;
                }
            })
            return item;
        }
    },

    //分享结果
    getShareSuccess() {
        var time = Math.floor((new Date().getTime() - cc._shareStartTime) / 1000);
        var conf = this.getShareRuleCfg(cc._shareCount, time);
        if (!conf) {
            cc.log('获取分享成功配置失败 count:' + cc._shareCount + ' time:' + time);
            return false;
        }
        var random = Math.floor(Math.random() * 10000);
        cc.log('分享次数:' + cc._shareCount + '  间隔时间:' + time + '  ' + (random < conf.probability));
        return random < conf.probability;
    },

    //闲聊分享链接
    sendXlLink(title, content, url) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/XLTool', 'shareLink', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', title, content, url);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('XLTool', 'shareLink:title:content:', url, title, content);
        }
    },

    //闲聊应用跳转
    sendXlApp(roomToken, roomId, title, content) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/XLTool', 'sendApp', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', roomToken, roomId, title, content);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('XLTool', 'sendApp:roomId:title:text:', roomToken, roomId, title, content);
        }
    },

    //闲聊分享截图
    sendXlScreenShot(node) {
        var fileName = "screen_capture.png";
        cc.dd.SysTools.captureScreen(fileName, node, function () {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/XLTool', 'shareScreenshot', '(Ljava/lang/String;)V', jsb.fileUtils.getWritablePath() + fileName);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('XLTool', 'shareScreenshot');
            }
        });
    },

    //华为账号登陆
    hwLogin() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/SystemTool', 'hwLogin', '()V');
        }
    },

    vivoLogin() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/SystemTool', 'vivoLogin', '()V');
        }
    },

    oppoLogin() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/SystemTool', 'oppoLogin', '()V');
        }
    },

    xiaomiLogin() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/SystemTool', 'miLogin', '()V');
        }
    },

    //华为内购
    hwIAP(productId) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/SystemTool', 'hwIAP', '(Ljava/lang/String;)V', productId);
        }
    },

    //华为内购
    checkHwIapOrder(productId) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/SystemTool', 'checkHwIapOrder', '()V');
        }
    },

    //vivo支付
    vivoIAP(product_id) {
        var platform = require('Platform');
        var appCfg = require('AppConfig');
        var url = platform.vivoIAPUrl[appCfg.PID];
        var shop_data = require('hall_shop').shopData;
        var coin_item = shop_data.Instance().getCoinItem(product_id);
        var price = coin_item.costDiscount > 0 ? coin_item.costDiscount : coin_item.costItemCount;
        var jsonObj = {};
        jsonObj.cpprivateinfo = product_id;
        jsonObj.amount = price / 100;
        jsonObj.appuserid = cc.dd.user.id;
        var msg = JSON.stringify(jsonObj);
        cc.log(url + '   ' + msg);
        var en0 = cc.dd.SysTools.encode64(msg);
        var en1 = cc.dd.SysTools.encode64(cc.dd.Utils.getRandomStr(2) + en0);
        var en2 = cc.dd.SysTools.encode64(en1 + cc.dd.Utils.getRandomStr(3));
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(en2);
        xhr.onreadystatechange = function () {
            if (!cc.sys.isNative) {
                if (xhr.readyState != XMLHttpRequest.DONE) {
                    return;
                }
            }
            if (xhr.status >= 200 && xhr.status < 300) {
                // var jsonData = JSON.parse( xhr.responseText );
                var responseObj = JSON.parse(xhr.responseText);
                cc.log('支付结果' + responseObj);
                if (responseObj.code == 1) {
                    var de1 = cc.dd.SysTools.decode64(responseObj.data);
                    de1 = de1.substring(0, de1.length - 3);
                    var de0 = cc.dd.SysTools.decode64(de1);
                    de0 = de0.substring(2, de0.length);
                    var paydata = cc.dd.SysTools.decode64(de0);
                    if (cc.sys.OS_ANDROID == cc.sys.os) {
                        jsb.reflection.callStaticMethod('game/SystemTool', 'vivoIAP', '(Ljava/lang/String;)V', paydata);
                    }
                } else {
                    cc.dd.PromptBoxUtil.show(responseObj.msg);
                }
            }
        };
    },

    //oppo支付
    oppoIAP(product_id) {
        var platform = require('Platform');
        var appCfg = require('AppConfig');
        var url = platform.oppoIAPUrl[appCfg.PID];
        var shop_data = require('hall_shop').shopData;
        var coin_item = shop_data.Instance().getCoinItem(product_id);
        var price = coin_item.costDiscount > 0 ? coin_item.costDiscount : coin_item.costItemCount;
        var shop_cfg = require('shop');
        var shop_item = shop_cfg.getItem(e => { return e.key == parseInt(product_id) });
        var attach = {};
        attach.productId = parseInt(product_id);
        attach.userId = cc.dd.user.id;
        var jsonObj = {};
        jsonObj.amount = price;
        jsonObj.desc = shop_item ? shop_item.dec : '';
        jsonObj.cburl = url;
        jsonObj.attach = JSON.stringify(attach);
        var msg = JSON.stringify(jsonObj);
        cc.log('oppoPay json:  ' + msg);
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/SystemTool', 'oppoIAP', '(Ljava/lang/String;)V', msg);
        }
    },

    //xiaomi支付
    xiaomiIAP(product_id) {
        var attach = {};
        attach.productId = parseInt(product_id);
        attach.userId = cc.dd.user.id;
        var jsonObj = {};
        jsonObj.pid = product_id;
        jsonObj.attach = JSON.stringify(attach);
        var msg = JSON.stringify(jsonObj);
        cc.log('xiaomiPay json:  ' + msg);
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('game/SystemTool', 'miIAP', '(Ljava/lang/String;)V', msg);
        }
    },

    googleLogin(){
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('sdk/GoogleSDK', 'googleLogin', '()V');
        }
    },

    facebookLogin(){
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('sdk/FacebookSDK', 'facebookLogin', '()V');
        }
    }
});

module.exports = Native;
