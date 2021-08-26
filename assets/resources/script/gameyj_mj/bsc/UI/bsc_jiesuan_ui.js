
const jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
const baseJiesuan = require('jlmj_jiesuan_ui');

const Bsc = require('bsc_data');
const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_Event = require('bsc_data').BSC_Event;

cc.Class({
    extends: baseJiesuan,

    properties: {
    },

    onLoad: function () {
        Bsc_ED.addObserver(this);
    },
    onDestroy: function () {
        Bsc_ED.removeObserver(this);
    },
    onEventMessage: function (event, data) {
        switch (event) {
            case Bsc_Event.BSC_START:
                this.close();
                break;
        }
    },
    /**
     * 开启倒计时
     */
    startTime: function (ts) {
        //倒计时
        this._daojishiNum = ts || 20;
        this.goTimeTTF_1.string = this._daojishiNum;
        this.goTimeTTF.string = this._daojishiNum;
        this._goTimeID = setInterval(function () {
            this._daojishiNum--;
            if (this._daojishiNum < 0) {
                clearInterval(this._goTimeID);
                this.close();
            } else {
                this.goTimeTTF.string = this._daojishiNum;
                this.goTimeTTF_1.string = this._daojishiNum
            }
        }.bind(this), 1000);
    },


    /**
     * 战绩统计回调
     */
    zhanjiBtnCallBack: function () {
        this.close();
    },


    /**
     * 继续回调
     */
    goOnBtnCallBack: function () {
        jlmj_audio_mgr.com_btn_click();
        this.close();
    },
    close: function () {
        this._super();
        Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.BSC_CLEAR_DESK);
    },
    /**
     * close回调  重写
     */
    closeCallBack: function () {
        jlmj_audio_mgr.com_btn_click();
        this.close();
        // this.jianyiLayer.active = true;
        // this.xiangxiLayer.active = false;
    },

});
