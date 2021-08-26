var PayBase = require( "PayBase" );
var PayDef = require( "PayDef" );

// 实例化对象
var s_instance = null;

var PayWeChatH5 = cc.Class( {
    extends: PayBase,

    statics: {
        /**
         * !#zh 获取单例 实例化对象
         * @method getInstance
         */
        getInstance: function () {
            if( !s_instance ){
                s_instance = new PayWeChatH5();
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
     * @param {String} version 当前接口版本号
     * @param {String} is_phone 是否使用手机触屏版，1=是（不参加签名）
     * @param {String} is_frame =0代表在除了微信浏览器之外的浏览器支付（不参加签名）
     * @param {String} pay_type 支付类型
     * @param {String} agent_id 商户编号 如1234567（汇付宝商户编号：七位整数数字）
     * @param {String} agent_bill_id 商户系统内部的订单号（要保证唯一）。长度最长50字符
     * @param {String} pay_amt 订单总金额 不可为空，取值范围（0.01到10000000.00），单位：元，小数点后保留两位。
     * @param {String} notify_url 支付后返回的商户处理页面，URL参数是以http://或https://开头的完整URL地址(后台处理) 提交的url地址必须外网能访问到，否则无法通知商户。值可以为空，但不可以为null。
     * @param {String} return_url 支付后返回的商户显示页面，URL参数是以http://或https://开头的完整URL地址(前台显示)，原则上该参数与notify_url提交的参数不一致。值可以为空，但不可以为null。
     * @param {String} user_ip 用户所在客户端的真实ip其中的“.”替换为“_” 。如 127_127_12_12。因为近期我司发现用户在提交数据时，user_ip在网络层被篡改，导致签名错误，所以我们规定使用这种格式。
     * @param {String} agent_bill_time 商品名称，长度最长50字符，不能为空（不参加签名）
     * @param {String} goods_name 产品数量，长度最长20字符（不参加签名）
     * @param {String} goods_num 订单总金额 不可为空，取值范围（0.01到10000000.00），单位：元，小数点后保留两位。
     * @param {String} remark 商户自定义 原样返回，长度最长50字符，可以为空。（不参加签名）
     * @param {String} goods_note 支付说明，长度50字符（不参加签名）
     * @param {String} meta_option {“s”:”WAP”,”n”:”WAP网站名”,”id”:”WAP网站的首页URL”}（不参加签名）
     * @param {String} timestamp 时间戳，订单在+-1min内有效，超过时间订单不能提交。如果传此参数，此参数也需要参与签名，参数加在key后面
     * @param {String} sign MD5签名结果
     */
    jumpToPay: function( version, is_phone, is_frame, pay_type, agent_id, agent_bill_id, pay_amt, notify_url, return_url,
                         user_ip, agent_bill_time, goods_name, goods_num, remark, goods_note, meta_option, timestamp, sign ) {

        var callback = function( jsonData ) {
            //cc.log(" call back jsonData:"+jsonData);
            if( jsonData.result == 1 ) {
                cc.dd.PromptBoxUtil.show( cc.dd.Text.TEXT_PAY_1 );
            } else {
                cc.dd.PromptBoxUtil.show( jsonData.pay_message );
            }
        };

        var url = PayDef.URL.PAY_WX_H5_ESCROW;
        url = url + "?version=" + version + "&is_phone=" + is_phone + "&is_frame=" + is_frame + "&pay_type=" + pay_type +
                "&agent_id=" + agent_id + "&agent_bill_id=" + agent_bill_id + "&pay_amt=" + pay_amt + "&notify_url=" + notify_url + "&return_url=" + return_url +
                "&user_ip=" + user_ip + "&agent_bill_time=" + agent_bill_time + "&goods_name=" + goods_name +
                "&goods_num=" + goods_num + "&remark=" + remark + "&goods_note=" + goods_note + "&meta_option=" + meta_option +
                "&timestamp=" + timestamp + "&sign=" + sign;

        var str = "";
        //cc.log("url:"+url);
        this.http( url, str, callback );

    },

} );

module.exports = PayWeChatH5;
