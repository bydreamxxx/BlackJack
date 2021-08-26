var hall_audio_mgr = require('hall_audio_mgr');
var hallData = require('hall_common_data').HallCommonData;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    onClickInvite(){
        hall_audio_mgr.Instance().com_btn_click();
        if (cc.sys.isNative) {
            let title = "您有一个红包未领取";
            let content = "您的朋友送您一个红包,请尽快打开";
            let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0f18441523270cf4&redirect_uri=http://zhifu.yuejiegame.net/index.php/WxShare/bouns?";
            url += "accountId=";
            url += hallData.getInstance().unionId;
            url += "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
            cc.dd.native_wx.SendAppContent("", title, content,  url);
        }
    },

    onClickClose(){
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
