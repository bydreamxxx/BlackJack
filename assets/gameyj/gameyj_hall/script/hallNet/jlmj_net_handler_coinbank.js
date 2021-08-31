var dd = cc.dd;
var FortuneHallManager = require('FortuneHallManager').Instance();
const Hall = require('jlmj_halldata');
const hall_common_data = require('hall_common_data').HallCommonData;
var ChangePassRet = cc.Enum({
    [0]: "设置密码成功",
    [-1]: "旧密码不正确",
    [-2]: "系统错误",
});

var PickOutMoneyError = cc.Enum({
    [0]: "取款成功",
    [-1]: "您输入的密码不正确",
    [-2]: "银行余额不足",
    [-3]: "网络错误，请重新操作",
    [-4]: "游戏房间内禁止此操作，请您一分钟后再试",
});

var SaveMoneyRet = cc.Enum({
    [0]: "存款成功",
    [-1]: "您输入的密码不正确，请重新输入",
    [-2]: "存款失败，存款金额超过携带最大金额",
    [-3]: "网络错误，请重新操作",
    [-4]: "游戏房间内禁止此操作，请您一分钟后再试",
});

module.exports = {
    on_msg_coin_bank_is_have_password_2c: function (msg) {
        if (msg && FortuneHallManager) {
            FortuneHallManager.m_bIsHavePass_coin = msg.isHavePassword;
        }
    },

    on_msg_coin_bank_store_2c: function (msg) {
        if (msg && FortuneHallManager) {
            cc.dd.PromptBoxUtil.show(SaveMoneyRet[msg.retCode]);
            if (msg.retCode == 0) {
                hall_common_data.getInstance().setUserBankCoin(msg.coin, msg.newBankCoin);
            }
            FortuneHallManager.resetBankUI();
        }
    },

    on_msg_coin_bank_take_2c: function (msg) {
        cc.dd.NetWaitUtil.net_wait_end('onClickBagPickOutBtn');
        if (msg && FortuneHallManager) {
            cc.dd.PromptBoxUtil.show(PickOutMoneyError[msg.retCode]);
            if (msg.retCode == 0) {
                hall_common_data.getInstance().setUserBankCoin(msg.coin, msg.newBankCoin);
                FortuneHallManager.resetBankUI();
            }
        }
    },

    on_msg_coin_bank_trans_2c: function (msg) {

    },

    on_msg_coin_bank_bill_list_2c: function (msg) {
        
    },

    on_msg_coin_bank_update_bill_2c: function (msg) {
        
    },

    on_msg_coin_bank_password_recovery_2c: function (msg) {
        if (msg && FortuneHallManager) {
            cc.dd.PromptBoxUtil.show(ChangePassRet[msg.retCode]);
            if (msg.retCode == 0) {
                FortuneHallManager.m_bIsHavePass_coin = 1;
                FortuneHallManager.onInitPassOkCoin();
            }
            FortuneHallManager.resetBankUI();
        }
    },

    on_msg_player_coin_and_bankcoin_2c: function (msg) {
        if (msg && FortuneHallManager) {
            hall_common_data.getInstance().setUserBankCoin(msg.coin, msg.bankCoin);
        }
    },

    on_msg_update_coin_recharge_flag_2c: function (msg) {
        if (msg && FortuneHallManager) {
            FortuneHallManager.updateChargeFlagCoin(msg.flag);
        }
    },
}
