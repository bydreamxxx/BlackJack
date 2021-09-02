var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        gameName:cc.Label,
        gameBtn:cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        this._callback= null;
    },

    setData:function (data, provinceid, callback) {
        this.gameName.string = data.area;
        this._callback = callback;
        this._data = data;
        this.provinceId = provinceid;
    },

    /**
     * 选择标签
     */
    checkBtnCallBack:function () {
        hall_audio_mgr.com_btn_click();

        if(this._callback){
            this._callback(this._data);
        }
      },

    /**
     * 修改按钮选中状态
     */
    changeBtnSelectState:function(key){
        if(this._data)
            return (this._data.key == key);
       // this.gameBtn.interactable = !(this._data.key == key);
    },

        /**
     * 销毁
     */
    deleNode:function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
});
