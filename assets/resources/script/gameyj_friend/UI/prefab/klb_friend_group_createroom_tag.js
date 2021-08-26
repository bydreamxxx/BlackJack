var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        gameName:cc.Label,
        label: [cc.Color],
        toggle: cc.Toggle,
        bg: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._callback= null;
        this._addCallBack = null;
    },

    setData:function (data, callback, gameId) {
        this.gameName.string = data.name;
        if(cc.game_pid == 10004 && data.name == '填大坑'){
            this.gameName.string = '天天踢';
        }
        this._callback = callback;
        this._data = data;
        if(data.gameid == gameId)
        {
            this.toggle.isChecked = true;
            this.bg.active = false;
            this.gameName.node.color = this.label[1];
            if(this._callback){
                this._callback(this._data);
            }
        }else{
            this.toggle.isChecked = false;
            this.bg.active = true;
            this.gameName.node.color = this.label[0];
        }
    },
    //添加游戏特殊处理
    setAddGameData: function(callback){
        this.gameName.string = '+添加游戏';
        this._addCallBack = callback;
    },

    /**
     * 查看创建房间信息
     */
    checkBtnCallBack:function () {
        hall_audio_mgr.com_btn_click();

        this.bg.active = !this.toggle.isChecked;
        if(!this.toggle.isChecked){
            this.gameName.node.color = this.label[0];
        }else{
            this.gameName.node.color = this.label[1];
        }

        if(this._callback){
            this._callback(this._data);
        }
        if(this._addCallBack)
            this._addCallBack();
    },

    /**
     * 修改按钮选中状态
     */
    checkSelect:function(gameId){
        if(this._data)
        {
            let result = this._data.gameid == gameId || this._data._game_id == gameId;
            this.bg.active = !result;
            if(!result){
                this.gameName.node.color = this.label[0];
            }else{
                this.gameName.node.color = this.label[1];
            }
            return result;
        }
    },

    /**
     * 销毁
     */
    deleNode:function () {
        this.node.removeFromParent();
        this.node.destroy();
    },

    /**
     * 检查数据是否一致
     */
    checkData: function(data){
        if(data._game_id == this._data._game_id)
            return true
        return false;
    },

    /**
     * 设置规则数据
     */
    setRuleData: function(data, callBack, isCheck){
        this.gameName.string = data.name;
        this._data = data;
        this._callback = callBack;
        if(isCheck){
            this.toggle.isChecked = true;
            this.bg.active = false;
            this.gameName.node.color = this.label[1];

            callBack(data);
        }else{
            this.toggle.isChecked = false;
            this.bg.active = true;
            this.gameName.node.color = this.label[0];
        }
    },
});
