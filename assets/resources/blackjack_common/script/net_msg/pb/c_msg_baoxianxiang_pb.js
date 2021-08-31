let msg_bank_is_have_password_2c = cc.Class({
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

module.exports.msg_bank_is_have_password_2c = msg_bank_is_have_password_2c;

let msg_bank_store_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.msg_bank_store_2s = msg_bank_store_2s;

let msg_bank_store_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.newBankGold = this.newBankGold;
        content.gold = this.gold;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setNewBankGold(newBankGold){
        this.newBankGold = newBankGold;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.msg_bank_store_2c = msg_bank_store_2c;

let msg_bank_take_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;
        content.password = this.password;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },
    setPassword(password){
        this.password = password;
    },

});

module.exports.msg_bank_take_2s = msg_bank_take_2s;

let msg_bank_take_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.newBankGold = this.newBankGold;
        content.gold = this.gold;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setNewBankGold(newBankGold){
        this.newBankGold = newBankGold;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.msg_bank_take_2c = msg_bank_take_2c;

let msg_bank_password_recovery_2s = cc.Class({
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

module.exports.msg_bank_password_recovery_2s = msg_bank_password_recovery_2s;

let msg_bank_password_recovery_2c = cc.Class({
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

module.exports.msg_bank_password_recovery_2c = msg_bank_password_recovery_2c;

let msg_player_gold_change_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.changeType = this.changeType;
        content.gold = this.gold;

        return content;
    },
    setChangeType(changeType){
        this.changeType = changeType;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.msg_player_gold_change_2c = msg_player_gold_change_2c;

let msg_player_gold_and_bankgold_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;
        content.bankGold = this.bankGold;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },
    setBankGold(bankGold){
        this.bankGold = bankGold;
    },

});

module.exports.msg_player_gold_and_bankgold_2c = msg_player_gold_and_bankgold_2c;

let msg_sync_room_gold_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.msg_sync_room_gold_2c = msg_sync_room_gold_2c;

let msg_h2g_rescue_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomId = this.roomId;

        return content;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.msg_h2g_rescue_room = msg_h2g_rescue_room;

