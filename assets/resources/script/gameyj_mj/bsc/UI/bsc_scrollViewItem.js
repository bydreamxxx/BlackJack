const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_str = require('bsc_strConfig');
const daojuStr = require('HallPropCfg');
const Bsc_sendMsg = require('bsc_sendMsg');

cc.Class({
    extends: cc.Component,

    properties: {
        nameTTF:cc.Label,//比赛名字
        startTimeTTF:cc.Label,//开始时间
        baomingMoneyTTF:cc.Label,//报名需要的钱

        baomingBtn:cc.Button,//报名按钮
        tuisaiBtn:cc.Button,//退赛按钮

        jiangliTTF:cc.Label, //奖励信息
    },

    // use this for initialization
    onLoad: function () {
        this._data = null;
        this._CallBack=null;
        Bsc_ED.addObserver(this);
    },

    onDestroy: function () {
        Bsc_ED.removeObserver(this);
    },
    /**
     * 点击cell
     */
    cellTouchCallBack:function (event, data) {
          if( this._touchCallBack){
              this._touchCallBack(this._data);
          }
    },
    /**
     * 设置数据
     */
    setData:function (data, callback) {
        this.nameTTF.string         = data.name || 'XXXX';
        this.startTimeTTF.string    = data.opentime || '????';

        var signFee = data.signFee;
        if( signFee == undefined ) {
            signFee = 0;
        }
        this.baomingMoneyTTF.string = signFee;
        this.jiangliTTF.string      = this.getJiangli(data.rewardListList);

        this._setBaoMingBtn(data.isSign);

        this._touchCallBack = callback;
        this._data = data;
    },

    /**
     * 奖励显示数据
     */
    getJiangli:function (data) {
        var str = '';
        if(data){
            var num=0;
            for(var i=0; i<data.length;++i){
                var item = data[i];
                for(var k=0; num<3&&k<=item.rankTo-item.rankFrom; ++k,++num){
                    if(k!=0){
                        str += '\n';
                    }
                    str += Bsc_str.jiangli[num] + ': ';//名次
                    str += item.num + daojuStr.getNameById(item.itemId);
                    str += '\n'
                }
            }
        }
        return str;
    },


    /**
     * 报名回调
     */
    bmBtnCallBack:function () {
        Bsc_sendMsg.baoming(this._data.matchId);
    },
    /**
     * 退赛回调
     */
    tsBtnCallBack:function () {
        Bsc_sendMsg.tuiSai();
    },
    
    /**
     * 刷新显示
     */
    flushInfo:function (info) {
        if(info.BscStartTime){
            this.startTimeTTF.string    = info.BscStartTime;
        }
        this._setBaoMingBtn(info.isBaoming);
    },
    /**
     *设置成功或者没有成功的报名按钮
     */
    _setBaoMingBtn:function (isBaoming) {
        this.baomingBtn.node.active =  !isBaoming;
        this.tuisaiBtn.node.active = isBaoming
    },

    onEventMessage:function (event,data) {
        switch (event) {
            case Bsc_Event.BSC_BAO_MING:
                if(data == this._data.matchId){
                    this._setBaoMingBtn(true);
                    this._data.isSign = true;
                }
                break;
            case Bsc_Event.BSC_TUI_SAI:
                if(data == this._data.matchId){
                    this._setBaoMingBtn(false);
                    this._data.isSign = false;
                }
                break;
        }
    },

});
