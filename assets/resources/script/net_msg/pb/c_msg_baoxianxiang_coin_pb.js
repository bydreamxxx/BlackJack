let msg_coin_bank_is_have_password_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isHavePassword = this.isHavePassword;

        return content;
    },
    setIsHavePassword(isHavePassword){
        this.isHavePassword = isHavePassword;
    },

});

module.exports.msg_coin_bank_is_have_password_2c = msg_coin_bank_is_have_password_2c;

let msg_coin_bank_store_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.coin = this.coin;

        return content;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_coin_bank_store_2s = msg_coin_bank_store_2s;

let msg_coin_bank_store_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.newBankCoin = this.newBankCoin;
        content.coin = this.coin;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setNewBankCoin(newBankCoin){
        this.newBankCoin = newBankCoin;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_coin_bank_store_2c = msg_coin_bank_store_2c;

let msg_coin_bank_take_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.coin = this.coin;
        content.password = this.password;

        return content;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setPassword(password){
        this.password = password;
    },

});

module.exports.msg_coin_bank_take_2s = msg_coin_bank_take_2s;

let msg_coin_bank_take_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.newBankCoin = this.newBankCoin;
        content.coin = this.coin;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setNewBankCoin(newBankCoin){
        this.newBankCoin = newBankCoin;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_coin_bank_take_2c = msg_coin_bank_take_2c;

let msg_coin_bank_trans_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerId = this.playerId;
        content.coin = this.coin;
        content.password = this.password;

        return content;
    },
    setPlayerId(playerId){
        this.playerId = playerId;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setPassword(password){
        this.password = password;
    },

});

module.exports.msg_coin_bank_trans_2s = msg_coin_bank_trans_2s;

let msg_coin_bank_trans_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.newBankCoin = this.newBankCoin;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setNewBankCoin(newBankCoin){
        this.newBankCoin = newBankCoin;
    },

});

module.exports.msg_coin_bank_trans_2c = msg_coin_bank_trans_2c;

let nested_coin_bank_bill = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.senderId = this.senderId;
        content.senderName = this.senderName;
        content.recverId = this.recverId;
        content.recverName = this.recverName;
        content.sendTime = this.sendTime;
        content.coin = this.coin;
        content.myCoin = this.myCoin;
        content.type = this.type;
        content.chargeCoin = this.chargeCoin;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setSenderId(senderId){
        this.senderId = senderId;
    },
    setSenderName(senderName){
        this.senderName = senderName;
    },
    setRecverId(recverId){
        this.recverId = recverId;
    },
    setRecverName(recverName){
        this.recverName = recverName;
    },
    setSendTime(sendTime){
        this.sendTime = sendTime;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setMyCoin(myCoin){
        this.myCoin = myCoin;
    },
    setType(type){
        this.type = type;
    },
    setChargeCoin(chargeCoin){
        this.chargeCoin = chargeCoin;
    },

});

module.exports.nested_coin_bank_bill = nested_coin_bank_bill;

let msg_coin_bank_bill_list_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.billListList = this.billListList;

        return content;
    },
    setBillListList(billListList){
        this.billListList = billListList;
    },

});

module.exports.msg_coin_bank_bill_list_2c = msg_coin_bank_bill_list_2c;

let msg_coin_bank_update_bill_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bill = this.bill;

        return content;
    },
    setBill(bill){
        this.bill = bill;
    },

});

module.exports.msg_coin_bank_update_bill_2c = msg_coin_bank_update_bill_2c;

let msg_coin_bank_password_recovery_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.oldPassword = this.oldPassword;
        content.newPassword = this.newPassword;

        return content;
    },
    setOldPassword(oldPassword){
        this.oldPassword = oldPassword;
    },
    setNewPassword(newPassword){
        this.newPassword = newPassword;
    },

});

module.exports.msg_coin_bank_password_recovery_2s = msg_coin_bank_password_recovery_2s;

let msg_coin_bank_password_recovery_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },

});

module.exports.msg_coin_bank_password_recovery_2c = msg_coin_bank_password_recovery_2c;

let msg_player_coin_and_bankcoin_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.coin = this.coin;
        content.bankCoin = this.bankCoin;

        return content;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setBankCoin(bankCoin){
        this.bankCoin = bankCoin;
    },

});

module.exports.msg_player_coin_and_bankcoin_2c = msg_player_coin_and_bankcoin_2c;

let msg_update_coin_recharge_flag_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.flag = this.flag;

        return content;
    },
    setFlag(flag){
        this.flag = flag;
    },

});

module.exports.msg_update_coin_recharge_flag_2c = msg_update_coin_recharge_flag_2c;

let msg_set_coin_recharge_flag_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.flag = this.flag;

        return content;
    },
    setFlag(flag){
        this.flag = flag;
    },

});

module.exports.msg_set_coin_recharge_flag_2s = msg_set_coin_recharge_flag_2s;

let msg_yyl_notice_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.speed = this.speed;
        content.showtimes = this.showtimes;
        content.roomname = this.roomname;
        content.playername = this.playername;
        content.wingold = this.wingold;
        content.isRich = this.isRich;

        return content;
    },
    setSpeed(speed){
        this.speed = speed;
    },
    setShowtimes(showtimes){
        this.showtimes = showtimes;
    },
    setRoomname(roomname){
        this.roomname = roomname;
    },
    setPlayername(playername){
        this.playername = playername;
    },
    setWingold(wingold){
        this.wingold = wingold;
    },
    setIsRich(isRich){
        this.isRich = isRich;
    },

});

module.exports.msg_yyl_notice_2c = msg_yyl_notice_2c;

