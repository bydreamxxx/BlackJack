const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_sendMsg = require('bsc_sendMsg');

cc.Class({
    extends: cc.Component,

    properties: {
        NameTTF:cc.Label,//名字
        mingciTTF:cc.Label,//名次

    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     * setData
     */
    setData:function (data) {
        data.name = data.name || 'xxxxx';
        this.NameTTF.string = cc.dd.Utils.substr(data.name, 0, 8);
        this.mingciTTF.string = data.rank || 123;
    },

    /**
     * 返回回调
     */
    goBackBtnCallBack:function () {
        Bsc_ED.notifyEvent(Bsc_Event.BSC_GO_HALL);
    },
    /**
     * 再来一次
     */
    aginBtnCallBack:function () {
        Bsc_ED.notifyEvent(Bsc_Event.BSC_GO_HALL,function () {
            //执行大厅中的 比赛场按钮回调
            cc.find('Canvas').getComponent('jlmj_hallScene').bscBtnCallBack();
        });
    },
});
