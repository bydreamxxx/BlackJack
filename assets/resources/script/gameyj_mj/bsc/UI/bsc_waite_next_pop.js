const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;

cc.Class({
    extends: cc.Component,

    properties: {
        // winNode:cc.Node,
        w_mingciTTF:cc.Label,//名次
        w_shengyuTTF:cc.Label,//剩余桌子数

        // loseNode:cc.Node,
        // l_mingciTTF:cc.Label,//名次
        // l_shengyuTTF:cc.Label,//剩余桌子数
    },

    // use this for initialization
    onLoad: function () {
        Bsc_ED.addObserver(this);
    },
    onDestroy:function () {
        Bsc_ED.removeObserver(this);
    },

    setData:function (data, endCall) {
        if(data.desk ){//没有桌子时不用等待
            this._endCall = endCall;
            if(typeof(data.deskRank) != 'undefined'){
                this.w_mingciTTF.string = data.deskRank || 0;
            }
            if(typeof(data.desk) != 'undefined'){
                this.w_shengyuTTF.string = data.desk || 0;
            }
        }else {
            // setTimeout(function () {
                this.close();
            // }.bind(this), 1000);
        }
    },

    /**
     * 关闭回调
     * @param event
     * @param data
     */
    close:function () {
      if(this._endCall){
          this._endCall();
      }
        this.node.removeFromParent();
        this.node.destroy();
    },
    onEventMessage:function (event,data) {
        switch (event) {
            case Bsc_Event.BSC_WAITE:
                this.setData(data);
                break;
            case Bsc_Event.BSC_END:
                this.close();
                break;
        }
    },
});
