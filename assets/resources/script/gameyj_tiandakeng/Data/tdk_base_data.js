/**
 * Created by wang on 2017/6/22.
 */

var dd = cc.dd;

var TdkBaseEvent = cc.Enum({
    REQ_FAILED  :   'tdk_req_failed',  //失败结果
});

var TdkBaseED = new dd.EventDispatcher();

var TdkBaseData = cc.Class({

    properties:{
        /**
         * 服务器返回请求结果
         */
        result:{ get: function () { return this._result; }, set: function (value) {this._result = value;} },

        /**
         * 服务器返回错误码
         */
        code:{ get: function () { return this._code; }, set: function (value) {this._code = value;} },

        /**
         * 服务器返回错误码列表
         */
        codeList:{ get: function () { return this._codeList; }, set: function (value) {this._codeList = value;} },
    },

    ctor:function () {

    },

    setMsgData:function (msg) {
        this.result = msg.result;
        this.code = msg.code;
        this.codeList = msg.codeList;

        this.checkError();
    },

    /**
     * 检查服务返回结果
     */
    checkError:function () {
        if(!this.result){
            var str = this.getErrorStr();
            if(str === ''){
                cc.error('code:',this.code,'未知错误类型!');
            }else{
                this.showErrorToView(str);
            }
        }else{
            this.doLogic();
        }
    },

    /**
     * 进行逻辑运算(子类实现)
     */
    doLogic:function () {},

    /**
     * 得到错误信息
     */
    getErrorStr:function () {
        var str='';
        this.codeList.forEach(function (item) {
            if(this.code == item.code){
                str = item.str;
            }
        }.bind(this));
        cc.log('[Data] tdk_base_data::getError:str=',str);
        return str;
    },

    /**
     * 讲错误信息更新到ui界面
     */
    showErrorToView:function (data) {
        TdkBaseED.notifyEvent(TdkBaseEvent.REQ_FAILED, data);
    },
});

module.exports = {
    TdkBaseEvent:TdkBaseEvent,
    TdkBaseED:TdkBaseED,
    TdkBaseData:TdkBaseData,
};