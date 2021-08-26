var ButtonUtil = cc.Class({
    _instance: null,
    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new ButtonUtil();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                this._instance = null;
            }
        },
    },

    ctor: function () {

    },

    setButtonEvent : function(button,callfun){
        if(!button) return;
        button.on(cc.Node.EventType.TOUCH_START,function(e){
            button.color = new cc.Color(114, 110, 110);
        }.bind(this),this);

        button.on(cc.Node.EventType.TOUCH_CANCEL,function(e){
            button.color = new cc.Color(255, 255, 255);
        }.bind(this),this);
        button.on(cc.Node.EventType.TOUCH_END,function(e){
            button.color = new cc.Color(255, 255, 255);
            if(callfun)
                callfun();
        }.bind(this),this)
    } 
});

module.exports = ButtonUtil;