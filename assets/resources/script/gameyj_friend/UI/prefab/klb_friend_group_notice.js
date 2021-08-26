var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Label,
        cancelButton: cc.Node,
    },

    show(title, succesFunc, cancelFunc, oneButton){
        this.content.string = title;
        this._succesFunc = succesFunc;
        this._cancelFunc = cancelFunc;

        this.cancelButton.active = oneButton != true;
    },

    onClickOk(){
        hall_audio_mgr.com_btn_click();
        if(this._succesFunc){
            this._succesFunc();
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickCancel(){
        hall_audio_mgr.com_btn_click();
        if(this._cancelFunc){
            this._cancelFunc();
        }
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
