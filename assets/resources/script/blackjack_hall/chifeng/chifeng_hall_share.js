var hall_audio_mgr = require('hall_audio_mgr').Instance();
var Platform = require("Platform");
var login_module = require('LoginModule');
cc.Class({
    extends: cc.Component,

    properties: {
        share_type: 0,
        share_title: '',
        share_content: '',
        share_img: false,
        share_img_name: '',
        desc: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.title = '祥云赤峰麻将';
        this.desc.string = '首次分享至朋友圈可获得房卡奖励';
        if(cc.game_pid == 10008){
            this.title = '赤峰乌丹麻将';
        }else if(cc.game_pid == 10010){
            this.title = '赤峰平庄麻将';
        }else if(cc.game_pid == 10003){
            this.title = '本地游戏'
            this.desc.string = '首次分享至朋友圈可获得随机表情';
        }else if(cc.game_pid == 10004){
            this.title = '享乐游戏'
            this.desc.string = '';
        }else if(cc.game_pid == 10013) {
            this.title = '巷乐阿城麻将';
        }else if(cc.game_pid == 10014) {
            this.title = '和龙麻将';
        }

        let game_channel_cfg = require('game_channel');
        let channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == cc.game_pid)
                return true;
        })

        this.content = channel_games.content;
    },

    start() {

    },

    //微信分享
    wechatShare() {
        hall_audio_mgr.com_btn_click();
        cc.WxShareType = 1;
        cc.dd.native_wx.SendAppContent('', this.title, this.content, Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100), 7);
    },

    //闲聊分享
    xianliaoShare() {
        hall_audio_mgr.com_btn_click();
        cc.dd.native_wx.sendXlLink(this.title, this.content, Platform.shareGameUrl);
    },

    //朋友圈分享
    wechatMomentShare() {
        hall_audio_mgr.com_btn_click();
        cc.WxShareType = 2;
        cc.dd.native_wx.ShareLinkTimeline(Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100), this.title, this.content, 7);
        // hall_audio_mgr.com_btn_click();
        // cc.dd.native_wx.sendXlApp('room', '123456', '祥云赤峰麻将', '快来加入我们  缺1人  xxxx');
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // update (dt) {},
});
