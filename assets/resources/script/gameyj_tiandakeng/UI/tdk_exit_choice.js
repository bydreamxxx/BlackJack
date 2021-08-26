var dd = cc.dd;
var tdk = dd.tdk;
//var tdk_proId = tdk.base_pb.tdk_enum_protoId;
var tdk_ani = require('TDKConstantConf').ANIMATION_TYPE;
var TdkSender = require('jlmj_net_msg_sender_tdk')
var ClickTag = cc.Enum({
    DEFAULT:'non-click',
    OK:'ok-click',
    CANCEL:'cancel-click',
});

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        btnOkClickCallback : null,
        btnCancelClickCallback:null,
        _clickTag:'',
    },

    // use this for initialization
    onLoad: function () {
        this._clickTag = ClickTag.DEFAULT;
        tdk.GameData.setRoomMenuBtnState(true);

        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_IN);
    },

    setText:function (text) {
        var lblNode = cc.find('bg/lbl', this.node);
        var cpt = lblNode.getComponent(cc.Label);
        cpt.string = text;
    },

    popupInActFinished : function () {
        cc.log('tdk_exit_choice::popupInActFinished!');
    },

    popupOutActFinished : function () {
        if(this._clickTag == ClickTag.DEFAULT){

        }else if(this._clickTag == ClickTag.OK){
            var data = {
                id:dd.user.id,
            };
            if(tdk.GameData.gameId == 40){
                if(tdk.GameData.isGaming){
                    TdkSender.onLeaveTdkDesk(data);
                }else{
                    TdkSender.onDissolveTdkDeskInRoom();
                }
            }else{
                TdkSender.onTdkCLeaveRoom();
            }
            
            if(this.btnOkClickCallback){
                this.btnOkClickCallback();
            }
        }else if(this._clickTag == ClickTag.CANCEL){
            if(this.btnCancelClickCallback){
                this.btnCancelClickCallback();
            }
        }
        tdk.GameData.setRoomMenuBtnState(false);
        this.node.removeFromParent();
        this.node.destroy();
        cc.log('tdk_exit_choice::popupOutActFinished!');
    },
    
    btnOkClick : function(){
        this._clickTag = ClickTag.OK;
        this.close();
    },

    btnCancelClick : function(){
        this._clickTag = ClickTag.CANCEL;
        this.close();
    },

    addBtnOkClickListener : function (cb) {
        if(typeof cb == 'function'){
            this.btnOkClickCallback = cb;
        }else{
            cc.warn('tdk_exit_choice::addBtnClickListener: cb not function！');
        }
    },

    addBtnCancelClickListener : function (cb) {
        if(typeof cb == 'function'){
            this.btnCancelClickCallback = cb;
        }else{
            cc.warn('tdk_exit_choice::addBtnCancelClickListener: cb not function！');
        }
    },

    close : function () {
        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_OUT);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
