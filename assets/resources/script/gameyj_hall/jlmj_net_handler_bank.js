var dd = cc.dd;
var FortuneHallManager = require('FortuneHallManager').Instance();

var PickOutMoneyError = cc.Enum({
    [0]: "取款成功",
    [-1]: "您输入的密码不正确",
    [-2]: "银行余额不足",
    [-3]: "网络错误，请重新操作",
});

var SaveMoneyRet = cc.Enum({
    [0]: "存款成功",
    [-1]: "您输入的密码不正确，请重新输入",
    [-2]: "存款失败，存款金额超过携带最大金额",
    [-3]: "网络错误，请重新操作",
    [-4]: "已下注或上庄，无法存入，请稍后再试",
});

var hanlder = {//cc.Class({
    
    on_msg_bank_is_have_password_2c: function (msg) {
        
    },


    on_msg_bank_password_recovery_2c: function (msg) {
        
    },

    on_msg_bank_store_2c: function (msg) {
        if (msg) {
            cc.dd.PromptBoxUtil.show(SaveMoneyRet[msg.retCode]);
            if (msg.retCode == 0) {
                FortuneHallManager.setUserBank(msg.gold, msg.newBankGold);
                FortuneHallManager.updateBankData()
            }
            FortuneHallManager.resetBankUI();
        }
    },

    on_msg_bank_take_2c: function (msg) {
        if (msg && FortuneHallManager) {
            cc.dd.PromptBoxUtil.show(PickOutMoneyError[msg.retCode]);
            if (msg.retCode == 0) {
                FortuneHallManager.setUserBank(msg.gold, msg.newBankGold);
                FortuneHallManager.updateBankData();
            }
            FortuneHallManager.resetBankUI();
        }
    },


    on_msg_player_gold_change_2c: function (msg) {
        if (msg && FortuneHallManager) {
            FortuneHallManager.setUserBank(msg.gold);
        }
    },


    on_msg_player_gold_and_bankgold_2c: function (msg) {
        if (msg && FortuneHallManager) {
            FortuneHallManager.setUserBank(msg.gold, msg.bankGold);
        }
    },

    on_msg_sync_room_gold_2c: function (msg) {
        
    },

    
    
};
module.exports = hanlder;