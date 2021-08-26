//create by wj 2018/ 03/ 27
const WxED = require("com_wx_data").WxED;
const WxEvent = require("com_wx_data").WxEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        headSp: cc.Sprite,
        openId: 0,
    },
    onLoad: function () {
        WxED.addObserver(this);
    },

    onDestroy:function () {
        WxED.removeObserver(this);
    },
    onDownloadHead:function (data) {
        if(this.openId == data[0]){
            var spf = this.getWxHeadFrame(this.openId);
            this.headSp.spriteFrame = spf;
        }
    },

    initHead:function (openId, headUrl, fromFileName) {
        this.openId = openId;
        cc.dd.SysTools.loadWxheadH5(this.headSp, cc.dd.Utils.getWX64Url(headUrl));
    },


    /**
     * 获取微信头像精灵帧
     */
    getWxHeadFrame: function(openId){
        var headFilePath = jsb.fileUtils.getWritablePath() + "head_" + openId;
        var texture = cc.textureCache.addImage( headFilePath );
        if ( texture ) {
            return new cc.SpriteFrame(texture);
        }else{
            cc.error("无微信头像文件,openid:"+openId);
        }
    },

    onEventMessage: function (event,data) {
        switch (event){
            case WxEvent.DOWNLOAD_HEAD:
                this.onDownloadHead(data);
                break;
            default:
                break;
         }
    },

});
