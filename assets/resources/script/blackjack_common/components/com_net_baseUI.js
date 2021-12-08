var dd = cc.dd;
const LogoutCodeStr=['', cc.dd.Text.TEXT_NET_1, cc.dd.Text.TEXT_NET_2, cc.dd.Text.TEXT_NET_3, cc.dd.Text.TEXT_NET_4, cc.dd.Text.TEXT_NET_5, cc.dd.Text.TEXT_NET_6, cc.dd.Text.TEXT_NET_7, cc.dd.Text.TEXT_NET_8, cc.dd.Text.TEXT_NET_9, cc.dd.Text.TEXT_NET_10, cc.dd.Text.TEXT_NET_11];
cc.Class({
    extends: cc.Component,

    properties: {
    },

    ctor: function () {
        this.LogoutCode = {
                LOGOUT_NORMAL:                1, //       %% 正常退出
                LOGOUT_KICK:                  2, //       %%（管理员）踢人
                LOGOUT_NO_TOKEN:              3, //       %% 没有token
                LOGOUT_NOT_EXIST_TOKEN:       4, //       %% token非法
                LOGOUT_PLAYER_SERVER_ERROR:   5, //       %% 服务器错误
                LOGOUT_TIMEOUT:               6, //       %% 心跳超时
                LOGOUT_RECONNECT_FAIL:        7, //       %% 重连失败
                LOGOUT_LOGIN_OTHER:           8, //       %% 账号在其他地方登录
                LOGOUT_BLACK_IP:              9, //       %% 黑名单IP
                LOGOUT_CLOSE:                 10,//       %% 关服
        };
        this.net_name = this.getNetName();
    },
    onDestroy: function () {
        dd.NetED.removeObserver(this);
    },

    onLoad: function () {
        dd.NetED.addObserver(this);
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event,data) {
        if(data && typeof(data) == 'object' && data.length>=1 && this.net_name == data[0]){
            cc.log('com_net_baseUI::onEventMessage,data=',JSON.stringify(data));
            switch (event){
                case dd.NetEvent.OPENING:
                    break;
                case dd.NetEvent.OPEN:
                    this.onNetOpen();
                    break;
                case dd.NetEvent.REOPEN:
                    this.onNetReOpen();
                    break;
                case dd.NetEvent.OPEN_TIMEOUT:
                    this.onNetOpenTimeOut();
                    break;
                case dd.NetEvent.HEART_TIMEOUT:
                    this.onNetHeartTimeOut();
                    break;
                case dd.NetEvent.CLOSE:
                    this.onNetClose();
                    break;
                case dd.NetEvent.ERROR:
                    this.onNetError();
                    break;
                case dd.NetEvent.INTERNET_DISCONNECT:
                    this.onNoConnet();
                    break;
                case dd.NetEvent.KICK_BY_SERVER:
                    this.serverCloseConnect(data[1]);
                    break;
                default:
                    break;
            }
        }
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

    },

    /**
     * 连接超时
     */
    onNetOpenTimeOut: function () {

    },

    /**
     * 心跳超时
     */
    onNetHeartTimeOut: function () {
    },

    /**
     * 连接断开
     */
    onNetClose: function () {

    },

    /**
     * 服务器断开网络
     * @param code
     */
    serverCloseConnect:function (code) {
        cc.dd.DialogBoxUtil.show(1, this.getStrToCode(code),'text33',null,function () {
            cc.dd.SceneManager.enterLoginScene();
        });
    },

    /**
     * 网络出错
     */
    onNetError: function () {
    },
    /**
     * 未连接网络
     */
    onNoConnet:function () {
    },

    /**
     * 获取错误码对应的文字
     */
    getStrToCode:function (code) {
        if(code<LogoutCodeStr.length){
            return LogoutCodeStr[code];
        }
    },

});
