/**
 * Created by Mac_Li on 2017/9/4.
 */
var Hall = require('jlmj_halldata');
var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;
var login_module = require('LoginModule');
const HallSendMsgCenter = require('HallSendMsgCenter');
var isBackGround = false;

cc.Class({
    extends: require('jlmj_net_base_ui'),
    properties: {},

    // use this for initialization
    onLoad: function () {
        Hall.HallED.addObserver(this);
        SysED.addObserver(this);
        this._super();

        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
        {
            cc.game.on(cc.game.EVENT_HIDE, function () {
                if(!isBackGround){
                    isBackGround = true;
                    cc.log("切换后台",event);
                    cc.gateNet.Instance().close();
                }
            });

            cc.game.on(cc.game.EVENT_SHOW, function () {
                if(isBackGround){
                    cc.log("切换前台",event);
                    isBackGround = false;
                    login_module.Instance().reconnectWG();
                    cc.debug.setDisplayStats(false);
                }
            });
        }
    },

    onDestroy: function () {
        this._super();
        Hall.HallED.removeObserver(this);
        SysED.removeObserver(this);
    },

    /**
     * 获取网络对象名字
     */
    getNetName: function () {
        return cc.gateNet.Instance().name;
    },

    /**
     * 重连成功
     */
    onNetReOpen: function () {
        cc.dd.NetWaitUtil.close();
        // HallSendMsgCenter.getInstance().sendBagItemList();
        // HallSendMsgCenter.getInstance().sendDefaultBroadcastInfo();
    },

    /**
     * 事件处理
     */
    onEventMessage: function (event, data) {
        switch (event) {
            default:
                this._super(event, data);
        }
    },

});
