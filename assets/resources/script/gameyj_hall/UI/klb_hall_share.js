var WxED = require("com_wx_data").WxED;
var WxEvent = require("com_wx_data").WxEvent;
var hall_audio_mgr = require('hall_audio_mgr');
var Platform = require("Platform");
const AppCfg = require('AppConfig');
var login_module = require('LoginModule');

let share = cc.Class({
    extends: cc.Component,

    properties: {
        share_type: 0,
        share_title: '',
        share_content: '',
        share_img: false,
        share_img_name: '',
        title: cc.Label,
        limitNode: cc.Node,
        otherNode: cc.Node,
        wechat_node: cc.Node,
        moment_node: cc.Node,
        xianliao_node: cc.Node,
    },

    onLoad: function () {
        WxED.addObserver(this);
    },

    onDestroy: function () {
        // this.share_type = 0;
        WxED.removeObserver(this);
    },

    onClickClose: function () {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    setShareData: function (title, content) {
        this.share_img = false;
        this.share_title = title;
        this.share_content = content;
    },

    setShareImg: function (img_name) {
        this.share_img = true;
        this.share_img_name = img_name;
    },

    setFirstShare: function () {
        this.title.string = "每日首次分享可获得188~1888金币奖励";
        this.limitNode.active = false;
        this.otherNode.active = false;
        this.firstShare = true;
    },

    //设置微信闲聊分享参数
    setWechatAndXianliaoShare(object) {
        // if (this.moment_node)
        //     this.moment_node.active = false;
        this.title.string = "";
        this.limitNode.active = false;
        this.otherNode.active = false;

        this.share_title = object.title;
        this.share_content = object.content;
        this.share_img = object.share_img;
    },

    setCapture(fileName) {
        this.onShareToFriend = function () {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', jsb.fileUtils.getWritablePath() + fileName, 0);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('WxTool', 'SendScreenShot');
            }
        }
        this.onShareToXianliao = function () {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/XLTool', 'shareScreenshot', '(Ljava/lang/String;)V', jsb.fileUtils.getWritablePath() + fileName);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('XLTool', 'shareScreenshot');
            }
        }
        this.onShareToCircle = function () {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/WxTool', 'SendWXScreenshot', '(Ljava/lang/String;I)V', jsb.fileUtils.getWritablePath() + fileName, 1);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('WxTool', 'SendScreenShotTimeline');
            }
        }
    },

    onShareToFriend: function () {
        hall_audio_mgr.Instance().com_btn_click();
        // this.share_type = 1;
        cc.WxShareType = 1;
        if (this.share_img) {
            cc.dd.native_wx.ShareImageToFriend('gameyj_hall/textures/shareImages/' + this.share_img_name);
        } else {
            cc.dd.native_wx.SendAppContent('', this.share_title, this.share_content, Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100), this.firstShare ? 7 : null);
        }

        // 分享好友,不加金币
        // var msg = new cc.pb.rank.msg_share_friend_2s();
        // msg.setType(cc.WxShareType);
        // cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_share_friend_2s, msg, 'msg_share_friend_2s', true);
    },


    onShareToXianliao: function () {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.native_wx.sendXlLink(this.share_title, this.share_content, Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100));
    },

    onShareToCircle: function () {
        hall_audio_mgr.Instance().com_btn_click();
        // this.share_type = 2;
        cc.WxShareType = 2;
        if (this.share_img) {
            cc.dd.native_wx.ShareImageToTimeline('gameyj_hall/textures/shareImages/' + this.share_img_name);
        } else {
            cc.dd.native_wx.ShareLinkTimeline(Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100), this.share_title, this.share_content, this.firstShare ? 7 : null);
        }

        // var msg = new cc.pb.rank.msg_share_friend_2s();
        // msg.setType(cc.WxShareType);
        // cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_share_friend_2s, msg, 'msg_share_friend_2s', true);
    },

    //针对活动分享获取次数
    onShareActivityToFriend: function () {
        hall_audio_mgr.Instance().com_btn_click();
        // this.share_type = 1;
        cc.WxShareType = 3;
        if (this.share_img) {
            cc.dd.native_wx.ShareImageToFriend('gameyj_hall/textures/shareImages/' + this.share_img_name);
        } else {
            cc.dd.native_wx.SendAppContent('', this.share_title, this.share_content, Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100), this.firstShare ? 7 : null);
        }

        // 分享好友,不加金币
        var msg = new cc.pb.rank.msg_share_friend_2s();
        msg.setType(cc.WxShareType);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_share_friend_2s, msg, 'msg_share_friend_2s', true);
    },

    //针对活动分享获取次数
    onShareActivityToCircle: function () {
        hall_audio_mgr.Instance().com_btn_click();
        // this.share_type = 2;
        cc.WxShareType = 4;
        if (this.share_img) {
            cc.dd.native_wx.ShareImageToTimeline('gameyj_hall/textures/shareImages/' + this.share_img_name);
        } else {
            cc.dd.native_wx.ShareLinkTimeline(Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100), this.share_title, this.share_content, this.firstShare ? 7 : null);
        }

        switch (AppCfg.GAME_PID) {
            case 2: //快乐吧长春麻将
            case 3: //快乐吧农安麻将
            case 4: //快乐吧填大坑
            case 5: //快乐吧牛牛
                var pObj = new cc.pb.hall.hall_req_draw_task();
                pObj.setTaskId(1);
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_draw_task, pObj,
                    '发送协议[id: ${hall_req_draw_task}],hall_req_draw_task', true);
                break;
        }






        var msg = new cc.pb.rank.msg_share_friend_2s();
        msg.setType(cc.WxShareType);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_share_friend_2s, msg, 'msg_share_friend_2s', true);
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            // case WxEvent.SHARE:
            //     if(this.share_type != 0){
            //         var msg = new cc.pb.rank.msg_share_friend_2s();
            //         msg.setType(this.share_type);
            //         cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_share_friend_2s, msg, 'msg_share_friend_2s', true);
            //     }
            //     break;
            default:
                break;
        }
    }
});
module.exports = share;
