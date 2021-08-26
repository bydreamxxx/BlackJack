cc.Class({
    extends: cc.Component,

    properties: {
        textTTF:cc.Label,//文字
    },

    // use this for initialization
    onLoad: function () {
        this.txtList = [];
    },

    onDestroy(){
        if(this._timeID){
            clearTimeout(this._timeID);
            this._timeID = null;
        }
    },

    setText:function (str, fast) {
        if(fast){
            clearTimeout(this._timeID);
            this._timeID = null;
        }
        if(this._timeID){
            this.txtList.push(str);
        }else{
            this._setText(str);
        }
    },

    _setText:function (str) {
      this.textTTF.string = str;
      this._timeID = setTimeout(function () {
        this._close();
      }.bind(this), 3000);
    },

    /**
     *
     */
    _close:function () {
        clearTimeout(this._timeID);
        this._timeID = null;

        if(this.txtList.length == 0){
            if (this.node != null) {
                this.node.removeFromParent();
                this.node.destroy();
            }
        }else{
            let str = this.txtList.shift();
            this._setText(str);
        }
    },
});
