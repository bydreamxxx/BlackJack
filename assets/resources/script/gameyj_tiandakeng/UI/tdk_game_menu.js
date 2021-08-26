var dd = cc.dd;
var tdk = dd.tdk;
var tdk_base_pb = require('tdk_base_pb')
var proId = tdk_base_pb.tdk_enum_protoId;
var tdk_deskStatus = tdk_base_pb.tdk_enum_deskstatus;

var tdk_enum_btn = require('TDKBtnConf')
var gbtnTag = tdk_enum_btn.game_operate;

var tdk_ani = require('TDKConstantConf').ANIMATION_TYPE;

var TdkDeskData = require('tdk_desk_data').TdkDeskData;
var TdkSender = require('jlmj_net_msg_sender_tdk');
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

        showbtn_list : [],
        selfId:null,
        btnClickCallback:null, //按钮点击回调函数
        costChipCallback:null, //消耗筹码回调函数
        deskStatus:null, //跟注类型
        shield : null, //触摸屏蔽层对象
        betNum : 0, //跟住金额
    },

    // use this for initialization
    onLoad: function () {
        this.deskData = TdkDeskData.Instance();

        this.selfId = tdk.GameData._selfId;

        this.btnName = [
            'qipai',
            'genzhu',
            'xiazhu',
            'qijiao',
            'buti',
            'fanti',
            'allin',
            'huanzhuo',
            'kaishi',
            'kaipai',
            'zhanji',
            'share',
            'kaishi_coin',
            'kaipai_coin',
        ];

        var btnTag = {
            BT_QIPAI:0,
            BT_GENZHU:1,
            BT_XIAZHU:2,
            BT_QIJIAO:3,
            BT_BUTI:4,
            BT_FANTI:5,
            BT_ALLIN:6,
            BT_HUANZHUO:7,
            BT_KAISHI:8,
            BT_KAIPAI:9,
            BT_ZHANJI:10,
            BT_SHARE:11,
            BT_KAISHI_COIN:12,
            BT_KAIPAI_COIN:13,
        };

        this.speakStr = {
            QP:'弃牌',
            XZ:'下注',
            GZ:'跟注',
            QJ:'起脚',
            FT:'反踢',
            BT:'不踢',
            AI:'Allin',
            KP:'开牌',
        };

        this.gameOperateOption = {
            XZ : [btnTag.BT_QIPAI, btnTag.BT_XIAZHU], //下注
            GZ : [btnTag.BT_QIPAI, btnTag.BT_GENZHU], //跟注
            BT_QJ : [btnTag.BT_QIPAI, btnTag.BT_BUTI, btnTag.BT_QIJIAO], //不踢，起脚
            BT_FT : [btnTag.BT_QIPAI, btnTag.BT_BUTI, btnTag.BT_FANTI], //不踢，反踢
            AI : [btnTag.BT_QIPAI, btnTag.BT_ALLIN], //allin
            KP : [btnTag.BT_QIPAI, btnTag.BT_KAIPAI], //开牌
            KS :[btnTag.BT_KAISHI], //开始
            ZJ :[btnTag.BT_ZHANJI], //战绩统计
            KS_C : [btnTag.BT_KAISHI_COIN], //金币场开始
            SHARE : [btnTag.BT_SHARE], //分享
            KP_C : [btnTag.BT_QIPAI, btnTag.BT_KAIPAI_COIN], //开牌，金币场
        };

        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.GAME_MENU_IN);
    },

    gameMenuInFinished : function () {
        cc.log('tdk_game_menu::popupInActFinished!');
    },

    gameMenuOutFinished : function () {
        this.node.removeFromParent();
        this.node.destroy();
        cc.log('tdk_game_menu::popupOutActFinished!');
    },

    //弹出下注框
    popupBetBox : function (pid) {
        var self = this;
        tdk.popup.show(function (shield) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_XIAZHU, cc.Prefab);
            var betBox = cc.instantiate(prefab);
            betBox.parent = tdk.popupParent;
            var cpt = betBox.getComponent('tdk_bet_box');
            cpt.init();
            shield.addTouchShieldCallback(function () {
                shield.close();
                betBox.removeFromParent();
                betBox.destroy();
            });
            cpt.addOkBtnClickListener(function (num) {
                self.costChip(num);
                self.sendMsg(pid,num);
                shield.close();
                self.close();
            });
        }, false);
    },

    sendMsg : function (pid, num) {
        var data = {
            id:this.selfId,
            num:num,
            ai:false,
        }
        switch(pid){
            case proId.TDK_PID_TDKBETREQ:
                TdkSender.onTdkBet(data);
                break;
            case proId.TDK_PID_TDKFANTIREQ:
                TdkSender.onTdkFanTi(data);
                break;
            case proId.TDK_PID_TDKQIJIAOREQ:
                TdkSender.onTdkQiJiao(data);
                break;           
        }
    },

    //弃牌
    qipaiClick : function () {
        cc.log('tdk_game_memu::qipaiClick!');
        if(this.btnClickCallback){
            this.btnClickCallback(gbtnTag.KOU_PAI);
        }
        TdkSender.onTdkFold({id:this.selfId});
        this.close();
    },
    
    //zhan'ji战绩tong'j战绩统计
    zhanjiClick : function(){
        if(this.btnClickCallback){
            this.btnClickCallback(gbtnTag.ZHAN_JI);
        }
        //this.tdkNet.sendRequest(proId.TDK_PID_TDKZHANJI,{id:this.selfId});
        this.close();
    },

    //下注
    xiazhuClick : function () {
        cc.log('tdk_game_memu::xiazhuClick!');
        this.popupBetBox(proId.TDK_PID_TDKBETREQ);
    },


    //不踢
    butiClick : function () {
        cc.log('tdk_game_memu::butiClick!');
        var data = {
            id:this.selfId,
        }
        TdkSender.onTdkPass(data);
        this.close();
    },

    //反踢
    fantiClick : function () {
        cc.log('tdk_game_memu::fantiClick!');
        this.popupBetBox(proId.TDK_PID_TDKFANTIREQ);
    },

    //起脚
    qijiaoClick : function () {
        cc.log('tdk_game_memu::qijiaoClick!');
        this.popupBetBox(proId.TDK_PID_TDKQIJIAOREQ);
    },

    //allin
    allinClick : function (){
        cc.log('tdk_game_memu::allinClick!');
        var num = this.deskData.allinCnt;
        var data = {
            id:this.selfId,
            num:num,
            ai:true,
        }
        switch(this.getSendProId()){
            case proId.TDK_PID_TDKBETREQ:
                TdkSender.onTdkBet(data);
                break;
            case proId.TDK_PID_TDKFANTIREQ:
                TdkSender.onTdkFanTi(data);
                break;
            case proId.TDK_PID_TDKQIJIAOREQ:
                TdkSender.onTdkQiJiao(data);
                break;           
        }
        this.costChip(num);
        this.close();
    },

    //开始
    kaishiClick : function () {
        cc.log('tdk_game_memu::kaishiClick!');
        if(this.btnClickCallback){
            this.btnClickCallback(gbtnTag.KAI_SHI);
        }
        var data ={
            id:tdk.GameData._selfId,
        }
        TdkSender.onTdkUserReady(data);
        this.close();
    },

    //金币场开始按钮
    kaishiCoinClick : function () {
        var data ={
            id:tdk.GameData._selfId,
        }
        TdkSender.onTdkMacthReq(data);
        if(this.btnClickCallback){
            this.btnClickCallback(gbtnTag.KAI_SHI_COIN);
        }
        this.close();
    },

    //赢家分享战绩
    shareClick : function () {

    },

    //跟注
    genzhuClick : function () {
        cc.log('tdk_game_memu::genzhuClick! betNum=',this.betNum);
        //this.popupBetBox(this.getSendProId());
        this.sendMsg(this.getSendProId(), this.betNum);
        this.costChip(this.betNum);
        this.close();
    },

    //换桌
    huanzhuoClick : function () {
        cc.log('tdk_game_memu::huanzhuoClick!');
        this.close();
    },

    //开牌
    kaipaiClick : function () {
        cc.log('tdk_game_memu::kaipaiClick!');
        var data = {
            id:this.selfId,
        }
        TdkSender.onTdkFKaiPai(data);
        this.close();
    },

    coinKaipaiClick : function () {
        cc.log('tdk_game_memu::kaipaiClick!');
        var data = {
            id:this.selfId,
        }
        TdkSender.onTdkCKaiPai(data);
        this.close();
    },

    initGameMenu : function (data) {
        this.hideBts();
        this.showBts(data);
    },

    showBts : function (data) {
        this.showbtn_list = data;
        var self = this;
        this.showbtn_list.forEach(function (item) {
            var node = self.node.getChildByName(this.btnName[item]);
            node.active = true;
        });
    },

    hideBts : function () {
        var self = this;
        this.showbtn_list.forEach(function (item) {
            var node = self.node.getChildByName(this.btnName[item]);
            node.active = false;
        });
        this.showbtn_list = splice(0, this.showbtn_list.length);
    },

    popGameOperateOption : function (options) {
        this.showbtn_list = options;
        var self = this;
        options.forEach(function (item) {
            var node = cc.find(self.btnName[item], self.node);
            node.active = true;
        });
    },

    popBackGameOperateOption : function () {
        var self = this;
        this.showbtn_list.forEach(function (item) {
            var node = cc.find(self.btnName[item], self.node);
            node.active = false;
        });
    },

    costChip : function (num) {
        if(this.costChipCallback){
            this.costChipCallback(num);
        }
    },

    addCostChipListener : function (cb) {
        if(typeof cb == 'function'){
            this.costChipCallback = cb;
        }else{
            cc.warn('tdk_game_menu::addCostChipListener:cb not function!');
        }
    },

    addBtnCallbackListener : function (cb) {
        if(typeof cb == 'function'){
            this.btnClickCallback = cb;
        }else{
            cc.warn('tdk_game_menu::addBtnCallbackListener:cb not function!');
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    getSendProId : function () {
        var proid = null;
        switch (this.deskStatus){
            case tdk_deskStatus.DESKSTATUS_GAMING_BET:
            case tdk_deskStatus.DESKSTATUS_GAMING_BET_GEN:
                proid = proId.TDK_PID_TDKBETREQ;
                break;
            case tdk_deskStatus.DESKSTATUS_GAMING_QIJIAO:
            case tdk_deskStatus.DESKSTATUS_GAMING_QIJIAO_GEN:
                proid = proId.TDK_PID_TDKQIJIAOREQ;
                break;
            case tdk_deskStatus.DESKSTATUS_GAMING_FANTI:
            case tdk_deskStatus.DESKSTATUS_GAMING_FANTI_GEN:
                proid = proId.TDK_PID_TDKFANTIREQ;
                break;
            default:
                break;
        }
        cc.log('tdk_game_menu::getSendProId:proid=',proid);
        return proid;
    },

    close : function () {
        if(this.shield){
            this.shield.close();
        }
        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.GAME_MENU_OUT);
    },

    onDestroy : function () {
    },
});
