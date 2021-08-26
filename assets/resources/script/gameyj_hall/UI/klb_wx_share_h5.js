
var hall_audio_mgr = require('hall_audio_mgr');

cc.Class({
    extends: cc.Component,

    properties: {

    },


    start() {

    },


    // update (dt) {},

    onClickClose() {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onInvite(roomID) {
        var share = window.localStorage.getItem("SHARE_URL");
        // window.localStorage.setItem("SHARE_URL",share+ "?roomid=" + roomID);
         wx.updateTimelineShareData({
                title: '【巷乐游戏】', // 分享标题
                link: share+ "?roomid=" + roomID, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'http://xlqp.yuejiegame.cn/icon.png', // 分享图标
                success: function () { 
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () { 
                    // 用户取消分享后执行的回调函数
                }
            
            });

        wx.updateAppMessageShareData({
            title: '【巷乐游戏】', // 分享标题
            desc: '超好玩的棋牌游戏', // 分享描述
            link: share+ "?roomid=" + roomID, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://xlqp.yuejiegame.cn/icon.png', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
            // 用户确认分享后执行的回调函数
            },
            cancel: function () {
            // 用户取消分享后执行的回调函数
            }
        });
    },

});
