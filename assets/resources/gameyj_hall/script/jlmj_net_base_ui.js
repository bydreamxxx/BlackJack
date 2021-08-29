var dd = cc.dd;
var login_module = require('LoginModule');
var LoginData = require('jlmj_login_data');
cc.Class({
    extends: require('com_net_baseUI'),

    properties: {
    },


    /**
     * 获取网络对象名字
     */
    getNetName:function () {
        return '';
    },

    /**
     * 正在连接
     */
    onNetOpening: function () {

    },

    /**
     * 连接成功
     */
    onNetOpen: function () {
    },

    /**
     * 重连成功
     */
    onNetReOpen: function () {
        cc.dd.NetWaitUtil.close();
    },

    /**
     * 连接超时
     */
    onNetOpenTimeOut: function () {
        dd.DialogBoxUtil.clear();
        dd.DialogBoxUtil.show(1,dd.strConfig.net_open_time_out,dd.strConfig.net_retry,null,
            function () {
                login_module.Instance().reconnectWG();
            }.bind(this), null);
    },

    /**
     * 心跳超时
     */
    onNetHeartTimeOut: function () {
        dd.DialogBoxUtil.clear();
        dd.DialogBoxUtil.show(1,dd.strConfig.net_heart_time_out,dd.strConfig.net_retry,null,
            function () {
                login_module.Instance().reconnectWG();
            }.bind(this), null);
    },

    /**
     * 连接断开
     */
    onNetClose: function () {

    },

    /**
     * 网络出错
     */
    onNetError: function () {
        dd.NetWaitUtil.show('正在重连');
        login_module.Instance().reconnectWG();

        // dd.DialogBoxUtil.clear();
        // dd.DialogBoxUtil.show(1,dd.strConfig.net_error,dd.strConfig.net_retry,null,
        //     function () {
        //         login_module.Instance().reconnectWG();
        //     }.bind(this), null);
    },
    /**
     * 未连接网络
     */
    onNoConnet:function () {
        dd.DialogBoxUtil.clear();
        dd.DialogBoxUtil.showFixDialog(1,dd.strConfig.net_no_internet,dd.strConfig.net_retry,dd.strConfig.net_return_enter ,
            function () {
                login_module.Instance().reconnectWG();
            }.bind(this),
        function(){
            AudioManager.stopMusic();
            LoginData.Instance().saveRefreshToken('');
            cc.dd.SceneManager.enterLoginScene();
        });
    },

});
