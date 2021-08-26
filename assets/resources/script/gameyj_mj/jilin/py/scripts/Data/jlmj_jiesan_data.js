var AgreeStatus = cc.Enum({
    Agree_Wait:         "jlmj_agree_wait",              //等待
    Agree_Agree:        "jlmj_agree_agree",             //同意
    Agree_Refuse:       "jlmj_agree_refuse",            //拒绝
});

var JieSanUser = cc.Class({
    ctor: function (...params) {
        this.userId = params[0];   //解散id
        this.agreeStatus = params[1];     //是否同意
    },

    toString: function () {
        cc.log(this.userId,this.agreeStatus);
    },
});

var JieSanData = cc.Class({

    statics: {

        s_jiesan_data: null,

        Instance: function () {
            if(!this.s_jiesan_data){
                this.s_jiesan_data = new JieSanData();
            }
            return this.s_jiesan_data;
        },

        Destroy: function () {
            if(this.s_jiesan_data){
                this.s_jiesan_data = null;
            }
        },

    },

    ctor: function () {
        this.clear();
    },

    clear: function () {
        this.sponsorId = -1;            //申请解散id
        this.countDown = -1;            //倒计时
        this.jiesanUserList = [];       //玩家解散列表
    },

    /**
     * 设置解散数据
     * @param msg
     */
    setJieSanData: function (msg) {
        this.clear();
        this.sponsorId = msg.sponsorid;
        this.countDown = msg.countdown;
        msg.useridList.forEach(function (userId) {
            var jiesanUser = new JieSanUser(userId,userId == msg.sponsorid ? AgreeStatus.Agree_Agree : AgreeStatus.Agree_Wait);
            this.jiesanUserList.push(jiesanUser);
        },this);
    },

    /**
     * 更新玩家解散状态
     */
    updateUserAgree: function (msg) {
        this.jiesanUserList.forEach(function (jiesanUser) {
            if(jiesanUser.userId == msg.responseid){
                jiesanUser.agreeStatus = msg.isagree ? AgreeStatus.Agree_Agree : AgreeStatus.Agree_Refuse;
            }
        },this);
    },

    /**
     * 玩家是否同意
     * @param userId
     */
    GetPlayerAgreeStatus: function (userId) {
        var agreeStatus = null;
        this.jiesanUserList.forEach(function (jiesanUser) {
            if(jiesanUser.userId == userId){
                agreeStatus = jiesanUser.agreeStatus;
            }
        },this);
        return agreeStatus;
    },

    /**
     * 是否都同意解散
     */
    isAllAgree: function () {
        var allAgree = true;
        this.jiesanUserList.forEach(function (jiesanUser) {
            if(jiesanUser.agreeStatus != AgreeStatus.Agree_Agree){
                allAgree = false;
            }
        },this);
        return allAgree;
    },



});

module.exports = {
    JieSanData:JieSanData,
    AgreeStatus:AgreeStatus,
};