
// 支付基类
var PayBase = cc.Class({

    /**
     * !#zh 构造
     * @method ctor
     */
    ctor: function () {

    },

    /**
     * !#zh http请求
     * @method http
     * @param {String} url 链接
     * @param {String} str 后缀参数 [optional]
     * @param {Function} cb 回调函数
     */
    http: function (url, str, cb) {
        cc.log("访问链接地址：", url);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (!cc.sys.isNative) {
                if (xhr.readyState != XMLHttpRequest.DONE) {
                    return;
                }
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                var jsonData = JSON.parse(xhr.responseText);
                cb(jsonData);
            }

        };
        xhr.open("GET", url, true);
        xhr.send(str);
    },

    /**
     * !#zh http请求
     * @method http
     * @param {String} url 链接
     * @param {String} str 后缀参数 [optional]
     * @param {Function} cb 回调函数
     */
    httpPost: function (url, str, cb) {
        cc.log("访问链接地址：", url);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (!cc.sys.isNative) {
                if (xhr.readyState != XMLHttpRequest.DONE) {
                    return;
                }
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                // var jsonData = JSON.parse( xhr.responseText );
                cc.log("支付地址:");
                cc.log(xhr.responseText);
                cb(xhr.responseText);
            }

        };
        xhr.open("POST", url, true);
        xhr.send(str);
    },

    /**
     * 爱贝支付
     * wares_id 商品id
     * price 价格(单位=元)
     */
    iPay: function (wares_id, price_1, price_2) {
        if (!cc.sys.isNative) {
            cc.dd.PromptBoxUtil.show('网页不支持支付');
            return;
        }
        // if (cc.sys.OS_IOS == cc.sys.os) {
        //     cc.dd.native_systool.inAppPay(wares_id);
        //     return;
        // }
        if (cc._isHuaweiGame) {
            switch (cc._lianyunID) {
                case 'vivo':
                    cc.dd.native_wx.vivoIAP(wares_id + "");
                    return;
                case 'oppo':
                    cc.dd.native_wx.oppoIAP(wares_id + "");
                    return;
                case 'xiaomi':
                    cc.dd.native_wx.xiaomiIAP(wares_id + "");
                    return;
                default:
                    cc.dd.native_wx.hwIAP(wares_id + "");
                    return;
            }
        }
        var price = price_1 > 0 ? price_1 : price_2;
        if (price <= 0) {
            cc.dd.PromptBoxUtil.show('价格不能为0');
            return;
        }
        var platform = require('Platform');
        var appCfg = require('AppConfig');
        var metaInfo = '[{"s":"Android","n":"巷乐游戏","id":"com.yjhy.jlmj","sc":"wzsc://"},{"s":"IOS","n":"","id":"","sc":""}]';
        var url = platform.IpayUrl[appCfg.PID];
        url += ('?cpprivateinfo=' + wares_id);    //商品id使用商户私有信息字段
        url += ('&price=' + price);
        url += ('&appuserid=' + cc.dd.user.id);
        url += ('&meta_option='+encodeURI(metaInfo));
        // this.httpPost(url, "", function (pay_url) {
        //     cc.dd.native_systool.OpenUrl(pay_url);
        // });
        cc.dd.native_systool.OpenUrl(url);//ping++支付
    },

    /**
     * !#zh 跳到App支付
     * @method jumpToPay
     */
    jumpToPay: function () {

    },
});

module.exports = PayBase;