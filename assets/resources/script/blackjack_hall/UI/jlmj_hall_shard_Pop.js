var hall_audio_mgr = require('hall_audio_mgr').Instance();
var Platform = require( "Platform" );
const AppCfg = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        renwuTTF:cc.Label,//分享送钻石
    },

    // use this for initialization
    onLoad: function () {
        if(0){
            this.renwuTTF.active = false;
        }else {

        }
    },

    /**
     * 分享到好友  群
     */
    shardFriendCallBack:function () {

        if( cc.sys.isNative ) {
            cc.dd.native_wx.SendAppContent('', "【巷乐棋牌】", "无巷乐，不东北，好友约局，刺激赛场，这里有你想不到的乐趣，随心畅玩！", Platform.GetAppUrl(AppCfg.GAME_PID,AppCfg.PID));
        }
    },
    /**
     * 分享到朋友圈
     */
    shardQuanCallBack:function () {
        if( cc.sys.isNative ) {
            cc.dd.native_wx.ShareLinkTimeline(Platform.GetAppUrl(AppCfg.GAME_PID,AppCfg.PID), "【巷乐棋牌】",  "无巷乐，不东北，好友约局，刺激赛场，这里有你想不到的乐趣，随心畅玩！");
        }else{
            wx.onMenuShareTimeline({
                
                    title: '【吉林麻将】', // 分享标题
                
                    link: 'yuejiehuyu.com', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                
                    imgUrl: '', // 分享图标
                
                    success: function () { 
                
                        // 用户确认分享后执行的回调函数
                
                    },
                
                    cancel: function () { 
                
                        // 用户取消分享后执行的回调函数
                
                    }
                
                });
        }
    },
    /**
     * 关闭回调
     */
    closeCallBack:function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.closeUI(this.node);
    },
});
