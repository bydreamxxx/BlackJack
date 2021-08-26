var dd = cc.dd;
var tdk = dd.tdk;
//var tdk_proId = tdk.base_pb.tdk_enum_protoId;
var tdk_am = require("../Common/tdk_audio_manager").Instance();
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
       // tdkNet:null,
    },

    clickCount : 0,
    deskNum : null,
    closeCallback : null,

    // use this for initialization
    onLoad: function () {
        //this.tdkNet = require('TdkNet').Instance();
        this.clickCount = 0;
        this.deskNum = '';
    },

    goRoom : function () {
        if(this.clickCount == 6){
            cc.dd.HallSendMsgCenter.getGameUrlInfo(false, tdk.GameData.gameid, this.deskNum);
            // cc.dd.HallSendMsgCenter.getGameUrlInfo(true, tdk.GameData.gameid);
            tdk.GameData.joinGameCallback = function () {
                cc.dd.NetWaitUtil.show('正在加入房间……');
                //发送进入房间请求
                cc.log('tdk_roomNum_ui::send go room!:',parseInt(this.deskNum));
                var data = {
                    id:tdk.GameData._selfId,
                    did:this.deskNum,
                };
                cc.log('tdk_rule_ui::createRoomBtnClick：'+JSON.stringify(data));
                //this.tdkNet.sendRequest(tdk_proId.TDK_PID_TDKJOINDESKREQ, data);
            }.bind(this);
        }
    },

    btnClick : function (event, data) {
        tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_BTN);
        if(this.clickCount == 6){
            return;
        }
        this.clickCount++;
        var numNode = cc.find('EditLayoutNode/'+this.clickCount+'Sprite/NumLabel', this.node);
        var lblCpt = numNode.getComponent(cc.Label);
        lblCpt.string = data;

        this.deskNum = this.deskNum + data;
        this.goRoom();
    },

    resetBtnClick : function () {
        tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_BTN);
        this.clickCount = 0;
        this.deskNum = '';
        for(var i=0; i<6; i++){
            var numNode = cc.find('EditLayoutNode/'+(i+1)+'Sprite/NumLabel', this.node);
            var lblCpt = numNode.getComponent(cc.Label);
            lblCpt.string = '';
        }
    },

    delBtnClick : function () {
        tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_BTN);
        var numNode = cc.find('EditLayoutNode/'+this.clickCount+'Sprite/NumLabel', this.node);
        var lblCpt = numNode.getComponent(cc.Label);
        lblCpt.string = '';

        this.deskNum = this.deskNum.substr(0,this.clickCount-1);
        this.clickCount--;
    },

    exitBtnClick : function () {
        if(this.closeCallback){
            this.closeCallback();
        }
        this.close();
    },

    addCloseListener : function (cb) {
        if(typeof cb == 'function'){
            this.closeCallback = cb;
        }else{
            cc.warn('tdk_roomNum_ui::addCloseListener:cb not function!');
        }
    },

    close : function () {
        this.node.removeFromParent();
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
