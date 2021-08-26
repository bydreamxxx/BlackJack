var dd = cc.dd;
var tdk = dd.tdk;

var WxED = require("com_wx_data").WxED;
var WxEvent = require("com_wx_data").WxEvent;
var WxData = require("com_wx_data").WxData.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        openId:0,
        head_url : null,
        nick : cc.Label,
        id : cc.Label,
        hs_value:cc.Label,
        bz_value:cc.Label,
        lg_value:cc.Label,
        result:cc.Label,
        http_url_img:cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {
        WxED.addObserver(this);
    },

    init : function (data, isRoomOwner, highScore, showFailedFlagFunc) {
        if(isRoomOwner){
            var node = cc.find('fangzhu', this.node);
            node.active = true;
        }

        var wxInfo = tdk.GameData.getWxInfoById(data.userid);
        this.openId = wxInfo.openid;
        this.head_url = wxInfo.headurl;

        this.nick.string = cc.dd.Utils.substr(wxInfo.nickname, 0, 6);
        this.id.string = 'ID:'+data.userid;
        this.hs_value.string = data.winnum+'次';
        this.bz_value.string = data.baozinum+'次';
        this.lg_value.string = data.languonum+'次';
        var score = data.score;
        if(score < 0){
            var font = cc.resources.get(dd.tdk_resCfg.FONT.FONT_ROUND_FAILED, cc.Font);
            this.result.font = font;
            if(data.userid == tdk.GameData._selfId)
                showFailedFlagFunc();
        }else{
            var font = cc.resources.get(dd.tdk_resCfg.FONT.FONT_ROUND_WIN, cc.Font);
            this.result.font = font;
            score = '+'+score;
        }
        this.result.string = score;

        // if(highScore == score){
        //     var winner = cc.find('win', this.node);
        //     winner.active = false;
        // }
        cc.dd.SysTools.loadWxheadH5(this.http_url_img, this.head_url);


        cc.log('[ui]战绩显示:【玩家：', data.userid,
                ', openId:', wxInfo.openid,
                ', 昵称:', wxInfo.nickname,
                ', 头像地址:', wxInfo.headurl,'】');
    },


    onDestroy: function () {
        WxED.removeObserver(this);
    },

    /**
     * 获取微信头像精灵帧
     */
    getWxHeadFrame: function(){
        var headFilePath = jsb.fileUtils.getWritablePath() + "head_" + this.openId;
        var texture = cc.textureCache.addImage( headFilePath );
        if ( texture ) {
            return new cc.SpriteFrame(texture);
        }else{
            cc.error("无微信头像文件,openid:"+this.openId);
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        switch (event){
            case WxEvent.DOWNLOAD_HEAD:
                if(this.openId == data[0]){
                    this.http_url_img.spriteFrame = this.getWxHeadFrame();
                    this.http_url_img.node.width = 71;
                    this.http_url_img.node.height = 71;
                }
                break;
            default:
                break;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
