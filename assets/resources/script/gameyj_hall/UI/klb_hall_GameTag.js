var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        gameName:cc.Label,
        gameNameCheck:cc.Label,
        //gameBtn:cc.Button,
        bg: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._callback= null;
        this._addCallBack = null;
    },

    setData:function (data, callback, gameId) {
        this.gameName.string = data.name;
        this.gameNameCheck.string = data.name;
        if(cc.game_pid == 10004 && data.name == '填大坑'){
            this.gameName.string = '天天踢';
            this.gameNameCheck.string = '天天踢';
        }
        this._callback = callback;
        this._data = data;
        if(data.gameid == gameId)
        {
            if(this._callback){
                this._callback(this._data);
            }
        }
    },
    //添加游戏特殊处理
    setAddGameData: function(callback){
        this.gameName.string = '+添加游戏';
        this.gameNameCheck.string = '+添加游戏';

        this._addCallBack = callback;
    },

    /**
     * 查看创建房间信息
     */
    checkBtnCallBack:function (event) {
        hall_audio_mgr.com_btn_click();
        this.bg.active = !event.isChecked;
        if(this._callback){
            this._callback(this._data);
        }
        if(this._addCallBack)
            this._addCallBack(event);
      },

    /**
     * 修改按钮选中状态
     */
    checkSelect:function(gameId){
        if(this._data)
           return (this._data.gameid == gameId);
    },

        /**
     * 销毁
     */
    deleNode:function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
});
