var PayBase = require( "PayBase" );

// 实例化对象
var s_instance = null;

var PayWeChatApp = cc.Class( {
    extends: PayBase,

    statics: {
        /**
         * !#zh 获取单例 实例化对象
         * @method getInstance
         */
        getInstance: function () {
            if( !s_instance ){
                s_instance = new PayWeChatApp();
            }
            return s_instance;
        },

    },

    /**
     * !#zh 构造
     * @method ctor
     */
    ctor: function() {

    },

    /**
     * !#zh 跳到微信支付
     * @method jumpToPay
     * @param {String} partnerid 商户号
     * @param {String} prepayid 预支付交易会话ID
     * @param {String} package_ 扩展字段 [无法使用package，是js系统保留字段]
     * @param {String} noncestr 随机字符串
     * @param {String} timestamp 时间戳
     * @param {String} sign 签名
     */
    jumpToPay: function( partnerid, prepayid, package_, noncestr, timestamp, sign ) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('com/yjhy/jlmj/AppActivity', 'JumpToWeixinPay', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', partnerid, prepayid, noncestr, timestamp, package_, sign );
        }else if(cc.sys.OS_IOS == cc.sys.os){
            var para = partnerid + "," + prepayid + "," + noncestr + "," + timestamp + "," + package_ + "," + sign;
            jsb.reflection.callStaticMethod( 'RootViewController', 'WeixinPay:', para);
        }

    },

} );

module.exports = PayWeChatApp;
