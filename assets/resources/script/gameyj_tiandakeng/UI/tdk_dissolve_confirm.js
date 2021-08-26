/**
 * Created by wang on 2017/7/3.
 */
var dd = cc.dd;
var tdk = dd.tdk;
//var tdk_proId = tdk.base_pb.tdk_enum_protoId;
var TdkSender = require('jlmj_net_msg_sender_tdk');
var tdk_ani = require('TDKConstantConf').ANIMATION_TYPE;
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
    },

    // use this for initialization
    onLoad: function () {
        tdk.GameData.setRoomMenuBtnState(true);

        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_IN);
    },

    popupInActFinished : function () {
    },

    popupOutActFinished : function () {
        this.node.removeFromParent();
        this.node.destroy();
    },

    btnOkClick : function(){
        if(tdk.GameData.isGaming){
            var data = {
                id:dd.user.id,
            };
            TdkSender.onDissolveTdkDesk(data);
        }else{
            TdkSender.onDissolveTdkDeskInRoom();
        }

        if(this.btnOkClickCallback){
            this.btnOkClickCallback();
        }
        this.close();
    },

    btnCancelClick : function(){
        if(this.btnCancelClickCallback){
            this.btnCancelClickCallback();
        }
        this.close();
    },

    addBtnOkClickListener : function (cb) {
        if(typeof cb == 'function'){
            this.btnOkClickCallback = cb;
        }else{
            cc.warn('tdk_dissolve_confirm::addBtnClickListener: cb not function！');
        }
    },

    addBtnCancelClickListener : function (cb) {
        if(typeof cb == 'function'){
            this.btnCancelClickCallback = cb;
        }else{
            cc.warn('tdk_dissolve_confirm::addBtnCancelClickListener: cb not function！');
        }
    },

    close : function () {
        tdk.GameData.setRoomMenuBtnState(false);
        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_OUT);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
