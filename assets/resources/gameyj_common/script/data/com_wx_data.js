var ED = require("EventDispatcher");

/**
 * 事件类型
 */
var WxEvent = cc.Enum({
    REAUTH:                             'com_wx_reauth',
    RESPONSE_CODE:                      'com_wx_code',
    LOGIN:                              'com_wx_login',                             //微信登录
    DOWNLOAD_HEAD:                      'com_wx_downloadHead',                      //微信登录
    SHARE:                              'com_wx_share',                             //分享
    HUAWEI_CODE:                        'com_huawei_logincode',                     //华为登陆
    VIVO_CODE:                          'com_vivo_logincode',                       //vivo
    OPPO_CODE:                          'com_oppo_logincode',                       //oppo登录
    XIAOMI_CODE:                        'com_xiaomi_logincode',                     //xiaomi
    // SHARE_TO_SESSION:                   'com_wx_share2session',                     //分享到会话
    // SHARE_TO_TIMELINE:                  'com_wx_share2timeline',                    //分享到朋友圈
});

/**
 * 事件管理
 */
var WxED = new ED;

var WxData = cc.Class({

    s_wx_data: null,

    statics: {

        Instance: function () {
            if(!this.s_wx_data){
                this.s_wx_data = new WxData();
            }
            return this.s_wx_data;
        },

        Destroy: function () {
            if(this.s_wx_data){
                this.s_wx_data = null;
            }
        },

    },

    properties:{

        /**
         * openId
         */
        _open_id: "onARixCvZTFumEu-awq2w3m2NpUA",
        open_id: {
            get: function () {return this._open_id;},
            set: function (value) {this._open_id = value;},
        },

        /**
         * unionId
         */
        _union_id: "o9ZJ4wRg-CX2Ko25yX1YHee6ZbpY",
        union_id: {
            get: function () {return this._union_id;},
            set: function (value) {this._union_id = value;},
        },

        /**
         * 昵称
         */
        _nick: "Bill",
        nick: {
            get: function () {return this._nick;},
            set: function (value) {this._nick = value;},
        },

        /**
         * 头像地址
         */
        _head_url: "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7bnxyAS82wHXrzCPicxMUHR4Ls0fnXDVolW05UvDRfVGibLPanv6Ihq1YZH6bUFuo6xyPbBMv9ZzKbwvVu7xribUQu60YSe0lmia0/0",
        head_url: {
            get: function () {return this._head_url;},
            set: function (value) {this._head_url = value;},
        },

        /**
         * 性别
         */
        _sex: 1,
        sex: {
            get: function () {return this._sex;},
            set: function (value) {this._sex = value;},
        },

        /**
         * 城市
         */
        _city: "chengdu",
        city: {
            get: function () {return this._city;},
            set: function (value) {this._city = value;},
        },

        /**
         * code
         */
        _response_code: "",
        response_code: {
            get: function () {return this._response_code;},
            set: function (value) {this._response_code = value;},
        },
    },

    setWxData: function (openId, unionId, nick, sex, city, headUrl) {
        this.open_id = openId;
        this.union_id = unionId;
        this.nick = nick;
        this.sex = sex;
        this.city = city;
        this.head_url = headUrl;

        cc.log(this.toString());
    },

    /**
     * 获取微信头像精灵帧
     */
    getWxHeadFrame: function(){
        var headFilePath = jsb.fileUtils.getWritablePath() + "head_" + this.open_id;
        var texture = cc.textureCache.addImage( headFilePath );
        if ( texture ) {
            return new cc.SpriteFrame(texture);
        }else{
            cc.error("无微信头像文件,openid:"+this.open_id);
        }
    },

    toString: function () {
      return "微信数据:\n"+"openId:"+this.open_id+"\n"+"union_id:"+this.union_id+"\n"+"nick:"+this.nick+"\n"+"sex:"+this.sex+"\n"+"city:"+this.city+"\n"+"head_url:"+this.head_url;
    },

});

module.exports = {
    WxData:WxData,
    WxEvent:WxEvent,
    WxED:WxED,
};