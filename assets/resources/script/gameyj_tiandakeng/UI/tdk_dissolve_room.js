var dd = cc.dd;
var tdk = dd.tdk;
var tdk_proId = tdk.base_pb.tdk_enum_protoId;
var tdk_ani = require('TDKConstantConf').ANIMATION_TYPE;

var TdkRoomData = require('tdk_room_data');
var RoomEvent = TdkRoomData.TdkRoomEvent;
var RoomED = TdkRoomData.TdkRoomED;

var TdkSender = require('jlmj_net_msg_sender_tdk');
var DisCode = require('tdk_base_pb').tdk_enum_userdisdesicion;

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
        player_map : [],
        timeLbl : cc.Label,
        totalTime : 59,
        role : cc.Label, //解散房间发起人
        btnGroup : cc.Node,
        shieldCloseCallback:null, //触摸屏蔽层关闭回调函数
        agreeCnt : 0,  //同意解散玩家个数
        countDownEndListener:null,
    },

    // use this for initialization
    onLoad: function () {
        RoomED.addObserver(this);
        this.timeLbl.string = this.totalTime.toString();
        this.schedule(this.countDown, 1);

        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_IN);
    },

    popupInActFinished : function () {
        tdk.GameData.setRoomMenuBtnState(true);
        cc.log('tdk_dissolve_room::popupInActFinished!');
    },

    popupOutActFinished : function () {
        this.node.removeFromParent();
        this.node.destroy();
        cc.log('tdk_dissolve_room::popupOutActFinished!');
    },

    countDown : function () {
        this.timeLbl.string = (--this.totalTime).toString();
        if(this.totalTime == 0){
            if(this.countDownEndListener){
                this.countDownEndListener();
            }
            this.unschedule(this.countDown);
            // this.agreeBtnClick();
        }
    },

    /**
     * 监听倒计时结束回调
     * @param cb
     */
    addCountDownEndListener:function (cb) {
        this.countDownEndListener = cb;
    },

    getPlayerNick:function (userid) {
        var wxInfo = tdk.GameData.getWxInfoById(userid);
        return wxInfo.nickname;
    },

    init : function (userid, list, shieldCloseCallback, totalTime) {
        cc.log('[ui]tdk_dissolve_room::init:totalTime=',totalTime);
        this.timeLbl.string = totalTime;
        this.totalTime = totalTime;
        this.shieldCloseCallback = shieldCloseCallback;
        this.role.string = this.getPlayerNick(userid);
        var self = this;
        var bgNode = cc.find('bg/role_con', this.node);
        var cnt = 0;
        list.forEach(function (item, i) {
            cnt++;
            var roleNode = cc.find('role_'+cnt, bgNode);
            roleNode.active = true;
            var nameCpt = cc.find('name',roleNode).getComponent(cc.Label);
            nameCpt.string = self.getPlayerNick(item.userid);
            self.player_map.push({id:item.userid, idx:cnt});

            if(item.desicion == 1 || userid == item.userid){
                self.agreeCnt++;
                var roleNode = cc.find('bg/role_con/role_'+cnt, self.node);
                var resultCpt = cc.find('result',roleNode).getComponent(cc.Label);
                resultCpt.node.color = cc.color(1,122,4,255);
                resultCpt.string = '同意';
            }
            if(userid == tdk.GameData._selfId){
                self.btnGroup.active = false;
            }

            // if(userid != item.userid){
            //     cnt++;
            //     var roleNode = cc.find('role_'+cnt, bgNode);
            //     roleNode.active = true;
            //     var nameCpt = cc.find('name',roleNode).getComponent(cc.Label);
            //     nameCpt.string = item.userid;
            //     self.player_map.push({id:item.userid, idx:cnt});
            //
            //     if(item.desicion == 1){
            //         self.agreeCnt++;
            //         var roleNode = cc.find('bg/role_'+cnt, self.node);
            //         var resultCpt = cc.find('result',roleNode).getComponent(cc.Label);
            //         resultCpt.node.color = cc.color(1,122,4,255);
            //         resultCpt.string = '同意';
            //     }
            // }else{
            //     if(userid == tdk.GameData._selfId){
            //         self.btnGroup.active = false;
            //         // self.unschedule(self.countDown);
            //     }
            // }
        });
    },
    
    agreeBtnClick : function(){
        var data = {
            id : tdk.GameData._selfId,
            des : true,
        };
        TdkSender.onDisTdkDeskDecision(data);
        //this.tdkNet.sendRequest(tdk_proId.TDK_PID_TDKDISDESKDESICIONREQ, data);

        // this.unschedule(this.countDown);
    },
    
    refuseBtnClick : function(){
        var data = {
            id : tdk.GameData._selfId,
            des : false,
        };
        TdkSender.onDisTdkDeskDecision(data);
        //this.tdkNet.sendRequest(tdk_proId.TDK_PID_TDKDISDESKDESICIONREQ, data);
        // this.unschedule(this.countDown);
    },

    onEventMessage : function (eventId, data) {
        switch (eventId){
            case tdk_proId.TDK_PID_TDKDISDESKDESICIONRSP:
                this.dissolveDeskDesicion_rsp(data);
                break;

            case RoomEvent.JIE_SAN_JUE_DING:
                this.dissolveDeskDesicion_rsp(data);
                break;
            case RoomEvent.ADD_VOTE_PLAYER:
                // this.addVotePlayer(data);
                break;
            default:
                break;
        }
    },

    addVotePlayer : function (data) {
        cc.log('[ui] tdk_dissolve_room::addVotePlayer:data',data);
        if(tdk.GameData._selfId != data.userid){
            var bgNode = cc.find('bg', this.node);
            var cnt = this.player_map.length;
            var roleNode = cc.find('role_'+(cnt+1), bgNode);
            roleNode.active = true;
            var nameCpt = cc.find('name',roleNode).getComponent(cc.Label);
            nameCpt.string = data.userid;
            this.player_map.push({id:data.userid, idx:cnt});
        }
    },


    dissolveDeskDesicion_rsp : function (data) {
        cc.log('tdk_dissolve_room::dissolveDeskDesicion_rsp: data=', JSON.stringify(data));

        var self = this;
        if(DisCode.USERDISDESK_NO == data.desicion){//有玩家拒绝
            cc.log('[ui]tdk_dissolve_room 玩家:',data.userid,'拒绝解散房间!');
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_PROMPT_BOX, cc.Prefab);
            var node = cc.instantiate(prefab);
            node.parent = tdk.popupParent;
            var cpt = node.getComponent('promptBox');
            var nick = self.getPlayerNick(data.userid);
            var text = '玩家【'+nick+'】拒绝解散房间，房间解散失败';
            cpt.show(text);
            self.close();

            // tdk.popup.show(function (shield) {
            //     var prefab = cc.loader.getRes(dd.tdk_resCfg.PREFAB.PRE_DISSOLVE_RESULT, cc.Prefab);
            //     var menu = cc.instantiate(prefab);
            //     menu.parent = tdk.popupParent;
            //     var cpt = menu.getComponent('tdk_dissolve_result');
            //     cpt.init(data.userid);
            //     cpt.addBtnClickListener(function () {
            //         shield.close();
            //     });
            //     self.close();
            // });
        }else{
            cc.log('[ui]tdk_dissolve_room 玩家:',data.userid,'同意解散房间!');
            this.agreeCnt++;
            this.player_map.forEach(function (item) {
                if(item.id == data.userid){
                    if(item.id == tdk.GameData._selfId &&
                        data.desicion){
                        self.btnGroup.active = false;
                        // self.unschedule(self.countDown);
                    }
                    var roleNode = cc.find('bg/role_'+item.idx, self.node);
                    var resultCpt = cc.find('result',roleNode).getComponent(cc.Label);
                    resultCpt.node.color = cc.color(1,122,4,255);
                    resultCpt.string = '同意';
                    self.checkResult();
                }
            });
        }
    },

    //检查同意玩家个数，全部同意则关闭弹窗
    checkResult : function () {
        if(this.agreeCnt == this.player_map.length){
            // this.close();
        }
    },

    close : function () {
        tdk.GameData.setRoomMenuBtnState(false);
        cc.log('[ui]tdk_dissolve_room::close!');
        if(this.shieldCloseCallback){
            this.shieldCloseCallback();
        }

        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_OUT);
    },

    onDestroy : function () {
        RoomED.removeObserver(this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
