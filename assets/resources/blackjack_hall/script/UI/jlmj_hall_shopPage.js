
//const EnumbuyType = require('HallShopCfg').Enum_buyType;
const HallSendMsgCenter = require('HallSendMsgCenter');
var AppCfg = require('AppConfig');
var Platform = require('Platform');
var PayDef = require("PayDef");

const nodeName = {
    money: 'money',
    name: 'name',
    icon: 'icon',
    btnStr: 'str',
    buyType: 'type'
};

const DEAL_TYPE = {
    // 没有
    NONE: 0,
    // 兑换
    CONVERT: 1,
    // 购买
    BUY: 2,
};

cc.Class({
    extends: cc.Component,

    properties: {
        allItem: [cc.Node],//所有商品
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 构造
     */
    ctor: function () {
        this.m_currDealType = DEAL_TYPE.NONE;
        this.currItemInfo = null;
    },

    /**
     * 设置商品
     */
    setData: function (data, type) {
        for (var i = 0; i < 6 && data && i < data.length; ++i) {
            if (data[i]) {
                this.initItem(data[i], this.allItem[i]);
                this.allItem[i].active = true;
            }
        }
        this._data = data;
        this.m_currDealType = type;
    },
    /**
     * 设置单个商品信息
     */
    initItem: function (info, node) {
        var money = node.getChildByName(nodeName.money);
        money.getComponent(cc.Label).string = info.cost || '0';
        var name = node.getChildByName(nodeName.name);
        name.getComponent(cc.Label).string = info.name || '0';
        var btnStr = node.getChildByName(nodeName.btnStr);
        btnStr.getComponent(cc.Label).string = info.btnLbl || '0';
        if (info.icon) {
            // 使用图集后 不能这样用了
            var path = 'gameyj_hall/textures/shangcheng/';
            path += info.icon + '.png';
            var sp = new cc.SpriteFrame(path);
            if (sp) {
                var icon = node.getChildByName(nodeName.icon);
                icon.getComponent(cc.Sprite).spriteFrame = sp;
            }
        }
        if (info.buyType) {
            if (info.buyType == EnumbuyType.Convert) {
                var path = 'gameyj_hall/textures/shangcheng/sc_zuanshi_09.png';
            } else {
                var path = 'gameyj_hall/textures/shangcheng/sc_renminbi.png';
            }
            var sp = new cc.SpriteFrame(path);
            if (sp) {
                var icon = node.getChildByName(nodeName.buyType);
                icon.getComponent(cc.Sprite).spriteFrame = sp;
            }
        }

    },

    /**
     * 微信购买回调 类型APP
     */
    onPayWeChatApp: function (jsonData) {
        if (jsonData.return_code == "SUCCESS") {
            if (cc.sys.isNative) {
                cc.dd.PayWeChatApp.jumpToPay(jsonData.partnerid, jsonData.prepay_id, jsonData.package, jsonData.noncestr, jsonData.timestamp.toString(), jsonData.sign);
            } else {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_10);
            }
        } else {
            cc.dd.PromptBoxUtil.show(jsonData.return_msg);
        }
    },

    /**
     * 微信购买回调 类型H5
     */
    onPayWeChatH5: function (jsonData) {
        if (jsonData.code == 1) {
            if (cc.sys.isNative) {

                var is_phone = 1;
                var is_frame = 0;
                var pay_type = "30";
                var agent_id = "1234567"; // todo 需要申请下来后再填写使用
                var pay_amt = this.currItemInfo.cost.toFixed(2).toString();
                var return_url = "http://www.baidu.com/"; // todo url后续需要更新
                var user_ip = "192.168.2.144"; // todo 获取ip地址
                var goods_name = this.currItemInfo.name;
                var goods_num = this.currItemInfo.count;
                var remark = cc.dd.user.id;
                var goods_note = "";
                var meta_option = { "s": "WAP", "n": "悦界互娱官网", "id": "http://www.yuejiehuyu.com/" };

                cc.dd.PayWeChatH5.jumpToPay(jsonData.version, is_phone, is_frame, pay_type, agent_id, jsonData.cporder_id,
                    pay_amt, jsonData.notify_url, return_url, user_ip.replace(/\./g, "_"), jsonData.agent_bill_time, goods_name, goods_num, remark,
                    goods_note, meta_option, jsonData.time_stamp, jsonData.sign);
            } else {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_10);
            }
        } else {
            cc.dd.PromptBoxUtil.show(jsonData.msg);
        }
    },

    /**
     * 微信购买 类型APP
     */
    payWeChatApp: function () {
        var url = Platform.PayUrl[AppCfg.PID];

        var body = this.currItemInfo.name;
        // var detail = this.currItemInfo.detail;
        var detail = "123";
        var attach = cc.dd.user.id;
        var total_fee = this.currItemInfo.cost * 100;
        var spbill_create_ip = "192.168.2.144";
        var trade_type = "APP";

        url = url + "?body=" + body + "&detail=" + detail + "&attach=" + attach + "&total_fee=" + total_fee +
            "&spbill_create_ip=" + spbill_create_ip + "&trade_type=" + trade_type;

        cc.dd.PayWeChatApp.http(url, "", this.onPayWeChatApp.bind(this));
    },

    /**
     * 微信购买
     */
    payWeChatH5: function () {
        var url = PayDef.URL.PAY_WX_H5_WEB;

        var pay_type = "30";
        var pay_amt = this.currItemInfo.cost.toFixed(2).toString();
        var return_url = "http://www.baidu.com/";
        var user_ip = "192.168.2.144";

        url = url + "?&pay_type=" + pay_type + "&pay_amt=" + pay_amt + "&return_url=" +
            return_url + "&user_ip=" + user_ip.replace(/\./g, "_");

        cc.dd.PayWeChatH5.http(url, "", this.onPayWeChatH5.bind(this));
    },

    /**
     * 和兑换购买回调
     */
    btnCallBack: function (event, data) {
        var idx = Number(data);
        var goodInfo = this._data[idx - 1];

        this.currItemInfo = goodInfo;

        if (this.m_currDealType == DEAL_TYPE.CONVERT) {
            HallSendMsgCenter.getInstance().sendBuyShop(goodInfo.id, 1);
        } else if (this.m_currDealType == DEAL_TYPE.BUY) {
            this.payWeChatApp();
        }
    },

});
