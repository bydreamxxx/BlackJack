var hall_net = cc.gateNet;//require("hall_net");
const msg_pb = require("c_msg_baoxianxiang_pb");
const msg_coin_pb = require('c_msg_baoxianxiang_coin_pb');
var yyl_protoId = require("c_msg_baoxianxiang_cmd");
var coin_protoId = require('c_msg_baoxianxiang_coin_cmd');
var FortuneHallManager = require('FortuneHallManager').Instance();
var user = require("com_user_data");
//
var fortune_hall_msg_send = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
        Instance: function () {
            if (this.instance == null) {
                this.instance = new fortune_hall_msg_send();
            }
            return this.instance;
        },
    },

    properties: {

    },
    /////////////////////////////////////////发送/////////////////////////////////////////////////
    /**
     * 请求修改银行密码
     */
    requestChangePass: function (oldPass, newPass) {
        var req = new msg_pb.msg_bank_password_recovery_2s();
        req.setNewPassword(newPass);
        req.setOldPassword(oldPass);
        hall_net.Instance().sendMsg(yyl_protoId.cmd_msg_bank_password_recovery_2s, req,
            '设置密码', true);
    },

    // requestEnterBank:function (pass) {
    //     var req = new msg_pb.msg_bank_verify_password_2s();
    //     req.setPassword(pass);
    //     hall_net.Instance().sendMsg(yyl_protoId.cmd_msg_bank_verify_password_2s, req,
    //         '验证密码',true);
    // },

    // requestCloseBank:function () {
    //     var req = new msg_pb.msg_bank_close_2s();
    //     hall_net.Instance().sendMsg(yyl_protoId.cmd_msg_bank_close_2s, req,
    //         '关闭保险箱',true);
    // },

    requestBankSaveGold: function (gold) {
        var req = new msg_pb.msg_bank_store_2s();
        req.setGold(gold);
        hall_net.Instance().sendMsg(yyl_protoId.cmd_msg_bank_store_2s, req,
            '存款', true);
    },

    requestBankPickOutGold: function (gold, pass) {
        var req = new msg_pb.msg_bank_take_2s();
        req.setGold(gold);
        req.setPassword(pass);
        hall_net.Instance().sendMsg(yyl_protoId.cmd_msg_bank_take_2s, req,
            '取钱', true);
    },

    requestBankTransfer: function (id, gold, pass) {
        var req = new msg_pb.msg_bank_trans_2s();
        req.setPlayerId(parseInt(id));
        req.setGold(parseInt(gold));
        req.setPassword(pass);
        hall_net.Instance().sendMsg(yyl_protoId.cmd_msg_bank_trans_2s, req,
            '转账', true);
    },

    // requestBankBill:function (id) {
    //     var req = new msg_pb.msg_bank_get_bill_2s();
    //     req.setId(id);
    //     hall_net.Instance().sendMsg(yyl_protoId.cmd_msg_bank_get_bill_2s, req,
    //         '领取账单',true);
    // },
    requestChangePassCoin: function (oldPass, newPass) {
        var req = new msg_coin_pb.msg_coin_bank_password_recovery_2s();
        req.setNewPassword(newPass);
        req.setOldPassword(oldPass);
        hall_net.Instance().sendMsg(coin_protoId.cmd_msg_coin_bank_password_recovery_2s, req,
            '设置密码', true);
    },

    requestBankSaveCoin: function (gold) {
        var req = new msg_coin_pb.msg_coin_bank_store_2s();
        req.setCoin(gold);
        hall_net.Instance().sendMsg(coin_protoId.cmd_msg_coin_bank_store_2s, req,
            '存款', true);
    },

    requestBankPickOutCoin: function (gold, pass) {
        var req = new msg_coin_pb.msg_coin_bank_take_2s();
        req.setCoin(gold);
        req.setPassword(pass);
        hall_net.Instance().sendMsg(coin_protoId.cmd_msg_coin_bank_take_2s, req,
            '取钱', true);
    },

    requestBankTransferCoin: function (id, gold, pass) {
        var req = new msg_coin_pb.msg_coin_bank_trans_2s();
        req.setPlayerId(parseInt(id));
        req.setCoin(parseInt(gold));
        req.setPassword(pass);
        hall_net.Instance().sendMsg(coin_protoId.cmd_msg_coin_bank_trans_2s, req,
            '转账', true);
    },

    requestChargeFlag: function () {
        var req = new msg_coin_pb.msg_set_coin_recharge_flag_2s();
        req.setFlag(0);
        hall_net.Instance().sendMsg(coin_protoId.cmd_msg_set_coin_recharge_flag_2s, req,
            '请求改变充值状态', true);
    }
});

module.exports = fortune_hall_msg_send;
