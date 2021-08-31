// 支付定义

var PayDef = {

	URL: {
		// 购买 微信 类型APP
		PAY_WX_APP : "http://47.92.129.247:3808/wxpay/order",

		// 购买 微信 类型H5 Web服务器,已经移到platform.js
		// PAY_WX_H5_WEB : "http://192.168.2.89:9999/heepay/h5param", // 内网
		//PAY_WX_H5_WEB : "http://47.92.129.247:3808/heepay/h5param", // 外网
		//PAY_WX_H5_WEB : "http://gameweb.yuejiegame.com:4027/heepay/h5param", // 外网

		// 购买 微信 类型H5 第三方支付服务器
		PAY_WX_H5_ESCROW : "https://pay.heepay.com/Payment/Index.aspx",

		PAY_WX_H5_RETURN_URL:"http://gameweb.yuejiegame.com:4027/heepay/return",

		PAY_WX_H5_MIDDLE_URL:"http://www.yuejiehuyu.com/jlmj/h5pay/test.php",
	},


}

module.exports = PayDef;
