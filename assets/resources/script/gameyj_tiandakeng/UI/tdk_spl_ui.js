
var dd = cc.dd;
var tdk = dd.tdk;
//var tdk_proId = tdk.base_pb.tdk_enum_protoId;
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
        closeCallback : null,
       // tdkNet:null,
    },

    // use this for initialization
    onLoad: function () {
       // this.tdkNet = require("../Network/TdkNet.js").Instance();
    },

    init : function (state) {
        if(state > 0){
            // tdk.GameData.isRoomOwner = true;
            var normal = cc.find('BgSprite/normal', this.node);
            normal.active = false;
            var gaming = cc.find('BgSprite/gaming', this.node);
            gaming.active = true;
        }
    },

    createRoomBtnClick : function () {
        var self = this;
        tdk.popup.show(function (shield) {
            shield.setGrey(false);
            dd.ResLoader.preloadSceneStaticRes(dd.tdk_resCfg.PREFAB.PRE_CREATE_HOME, cc.Prefab, function (prefab) {
                var node = cc.instantiate(prefab);
                node.parent = tdk.popupParent;
                var cpt = node.getComponent('tdk_rule_ui');
                cpt.addCloseListener(function () {
                    shield.close();
                });
                self.close();
            });
        });
    },

    // joinRoomBtnClick : function () {
    //     var self = this;
    //     tdk.popup.show(function (shield) {
    //         shield.setGrey(false);
    //         dd.ResLoader.preloadSceneStaticRes(dd.tdk_resCfg.PREFAB.PRE_JOIN_HOME, cc.Prefab, function (prefab) {
    //             var node = cc.instantiate(prefab);
    //             node.parent = tdk.popupParent;
    //             var cpt = node.getComponent('tdk_roomNum_ui');
    //             cpt.addCloseListener(function () {
    //                 shield.close();
    //             });
    //             self.close();
    //         });
    //     });
    // },

    //返回房间
    backRoomBtnClick : function () {
        var data = {
            id:tdk.GameData._selfId,
            did:0,
        };
        cc.log('tdk_spl_ui::backRoomBtnClick：'+JSON.stringify(data));
       // this.tdkNet.sendRequest(tdk_proId.TDK_PID_TDKJOINDESKREQ, data);
        this.close();
    },

    //解散房间
    dissolveRoomBtnClick : function () {
        // var data = {
        //     id:tdk.GameData._selfId,
        // };
        // cc.log('tdk_spl_ui::dissolveRoomBtnClick：'+JSON.stringify(data));
        // this.tdkNet.sendRequest(tdk_proId.TDK_PID_TDKDISSOLVEDESKREQ, data);


        var self = this;
        tdk.popup.show(function (shield) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_DISSOLVE_CONFIRM, cc.Prefab);
            var dialog = cc.instantiate(prefab);
            dialog.parent = tdk.popupParent;

            var cpt = dialog.getComponent('tdk_dissolve_confirm');
            cpt.addBtnOkClickListener(function () {
                shield.close();
                self.close();
            });
            cpt.addBtnCancelClickListener(function () {
                shield.close();
            });
        });
    },

    exitSplBtnClick : function () {
        this.close();
    },

    addCloseListener : function (cb) {
        if(typeof cb == 'function'){
            this.closeCallback = cb;
        }else{
            cc.warn('tdk_spl_ui::addCloseListener:cb not function!');
        }
    },

    close : function () {
        if(this.closeCallback){
            this.closeCallback();
        }
        this.node.removeFromParent();
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
