// create by wj 2018/03/26
let rule_item = cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        nameTxt: cc.Label,
        checkTxt: cc.Label,
        _data:  null,
        _callBackFunc: null,
    },

    onLoad: function(){

    },

    /**
     * 设置数据
     */
    setData: function(data, callBack, isCheck){
        this.nameTxt.string = data.name;
        this.checkTxt.string = data.name;
        this._data = data;
        this._callBackFunc = callBack;
        if(isCheck){
            callBack(data);
        }
    },

    /**
     * 点击标签
     */
    clickTagShow: function(target){
        //this.nameTxt.node.color = cc.color(39,124,39);
        this.bg.active = !target.isChecked;
        if(this._callBackFunc)
            this._callBackFunc(this._data);
    },

    /**
     * 检查数据是否一致
     */
    checkData: function(data){
        if(data._game_id == this._data._game_id)
            return true
        return false;
    },
});
module.exports = rule_item;
