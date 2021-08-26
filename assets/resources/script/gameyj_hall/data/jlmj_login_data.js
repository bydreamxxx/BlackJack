const dd = cc.dd;
const wxData = require("com_wx_data").WxData.Instance();

var s_logindata = null;
const LoginData = cc.Class({

    statics: {
        Instance: function () {
            if (null === s_logindata) {
                s_logindata = new LoginData();
            }
            return s_logindata;
        },
        destroy: function () {
            s_logindata = null;
        }
    },

    properties: {

        _hallToken:undefined,
        hallTolen:{
            get:function () {
               return this._hallToken;
            },
            set:function (value) {
                this._hallToken = value;
            }
        },

        _userId: 0,
        userId: {
            get: function () {
                return this._userId;
            },
            set: function (value) {
                this._userId = value;
            }
        },

        _refreshToken:undefined,
        refreshToken:{
            get:function () {
                return this._refreshToken;
            },
            set:function (value) {
                this._refreshToken = value;
            }
        },

        _loginType: cc.dd.jlmj_enum.Login_Type.NONE,
        loginType: {
            get: function () {
                return this._loginType;
            },
            set: function (value) {
                this._loginType = value;
            }
        },

        _coin: 0,
        coin: {
            get: function () {
                return this._coin;
            },
            set: function (value) {
                this._coin = value;
            }
        },

        _diamond: 0,
        diamond: {
            get: function () {
                return this._diamond;
            },
            set: function (value) {
                this._diamond = value;
            }
        },

        _redBag: 0,
        redBag: {
            get: function () {
                return this._redBag;
            },
            set: function (value) {
                this._redBag = value;
            }
        },

        _phoneNumber: 0,
        phoneNumber: {
            get: function () {
                return this._phoneNumber;
            },
            set: function (value) {
                this._phoneNumber = value;
            }
        },

        _accountToken:undefined,
        accountToken:{
            get:function () {
                return this._accountToken;
            },
            set:function (value) {
                this._accountToken = value;
            }
        },
    },

    ctor: function () {
        this.loadLoginType();
        this.loadUserId();
        this.loadRefreshToken();
    },

    initPlayerData: function (data) {
        this.userId = data.userid;
        this.userName = data.username;
        this.sex = data.sex;

        this.saveUserId(data.userid);
    },

    loadLoginType: function () {
        const type = cc.sys.localStorage.getItem("loginType");
        this._loginType = parseInt(type);
        return this._loginType;
    },

    saveLoginType: function (value) {
        if (value) {
            this._loginType = value;
            cc.sys.localStorage.setItem("loginType", value)
        }
    },

    loadUserId: function () {
        const id = parseInt(cc.sys.localStorage.getItem("visuserId"));
        if (!id || isNaN(id)) {
            this.userId = 0;
        } else {
            this.userId = id;
        }
        return this.userId;
    },

    saveUserId: function (value) {
        this.userId = value;
        cc.sys.localStorage.setItem('visuserId', this.userId);
    },

    loadRefreshToken:function () {
        cc.log("loadRefreshToken");
        this._refreshToken = cc.sys.localStorage.getItem("refreshToken");
        cc.log("loadRefreshToken", this._refreshToken);
        return this._refreshToken;
    },

    saveRefreshToken:function (value) {
        this._refreshToken = value;
        cc.log("saveRefreshToken", this._refreshToken);
        cc.sys.localStorage.setItem('refreshToken', this._refreshToken);
    },

    isRefreshTokenExist: function () {
        if(cc.dd._.isNull(this._refreshToken)){
            return false;
        }
        if(this._refreshToken == 'undefined'){
            return false;
        }
        if(this._refreshToken == ''){
            return false;
        }
        return true;
    },

    //账号操作相关
    setAccountLogin(account, password, needEncode){
        let _account = needEncode ? cc.dd.SysTools.encode64(account) : account;
        let _password = needEncode ? cc.dd.SysTools.encode64(password): password;

        let local_result = this.getAccountLogin();
        local_result[_account] = _password;
        cc.sys.localStorage.setItem('clienUserAccountInfo', JSON.stringify(local_result));

        local_result = {};
        local_result[_account] = _password;
        cc.sys.localStorage.setItem('lastUserAccountInfo', JSON.stringify(local_result));
    },

    getAccountLogin(){
        let local_result = cc.sys.localStorage.getItem('clienUserAccountInfo');
        if(cc.dd._.isString(local_result) && local_result != ""){
            return JSON.parse(local_result);
        }else{
            return {};
        }
    },

    getLastAccountLogin(){
        let last_login = cc.sys.localStorage.getItem('lastUserAccountInfo');
        if(cc.dd._.isString(last_login) && last_login != ""){
            return JSON.parse(last_login);
        }else{
            return {};
        }
    },


    getLastAccountLoginInfo(needDecode){
        let last_login = this.getLastAccountLogin();
        let firstAccount = {account:"", password: ""};
        for(let k in last_login){
            if(last_login.hasOwnProperty(k)){
                firstAccount.account = needDecode ? cc.dd.SysTools.decode64(k) : k;
                firstAccount.password = needDecode ? cc.dd.SysTools.decode64(last_login[k]) : last_login[k];
            }
        }
        return firstAccount;
    },

    deleteAccountLogin(account, needEncode){
        let _account = needEncode ? cc.dd.SysTools.encode64(account) : account;
        let local_result = this.getAccountLogin();
        if(local_result.hasOwnProperty(_account)){
            delete local_result[_account];
        }
        cc.sys.localStorage.setItem('clienUserAccountInfo', JSON.stringify(local_result));

        let last_login = this.getLastAccountLogin();
        if(last_login.hasOwnProperty(_account)){
            delete last_login[_account];
        }
        cc.sys.localStorage.setItem('lastUserAccountInfo', JSON.stringify(last_login));
    }
});

module.exports = LoginData;
