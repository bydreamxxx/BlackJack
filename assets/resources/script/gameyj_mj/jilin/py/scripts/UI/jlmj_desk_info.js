var dd = cc.dd;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var DeskData = require('jlmj_desk_data').DeskData;
var playerED = require("jlmj_player_data").PlayerED;
var PlayerEvent = require("jlmj_player_data").PlayerEvent;
var playerMgr = require('jlmj_player_mgr');
var PopupView = require("jlmj_popup_view");
var strCon = require('jlmj_strConfig');
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');
var Platform = require( "Platform" );
const AppCfg = require('AppConfig');
var Define = require( "Define" );
var jlmj_audio_path = require( "jlmj_audio_path" );
var jlmj_net_handler_jlmj = require( "jlmj_net_handler_jlmj" );
var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;
var RoomED = require( "jlmj_room_mgr" ).RoomED;
var RoomEvent = require( "jlmj_room_mgr" ).RoomEvent;
const Hall = require('jlmj_halldata');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var DingRobot = require('DingRobot');
var jlmj_util = require('jlmj_util');
var game_room = require("game_room");
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var jlmj_desk_jbc_data = require("jlmj_desk_jbc_data");
var s_hallNet = require('jlmj_net_handler_club');
var UserPlayer = require("jlmj_userPlayer_data");
var UIZorder = require("mj_ui_zorder");
var HuType = require('jlmj_define').HuType;

var Text = cc.dd.Text;

var PlayerStatus = {
    NOT_READ: 1,
    YET_READ: 2,
    OFF_LINE: 3,
    GAMEING: 4,
};

var PopupType = {
    OK_CANCEL: 1,
    OK: 2,
    CANCEL: 3,
};

var baseDeskInfo = cc.Class({
    extends: cc.Component,

    properties: {
        room_num: { default: null, type: cc.Node, tooltip: '房号节点', },
        room_id: { default: null, type: cc.Label, tooltip: '房号id节点', },
        pai_num: { default: null, type: cc.Label, tooltip: '牌数', },
        sys_time: { default: null, type: cc.Label, tooltip: '系统时间', },
        dangqian_ju: { default: null, type: cc.Label, tooltip: '当前局数', },
        zong_ju: { default: null, type: cc.Label, tooltip: '总局', },
        baopai: { default: null, type: require('jlmj_pai'), tooltip: '麻将牌', },
        ani_node: { default: null, type: cc.Node, tooltip: '动画节点', },
        btn_invite: { default: null, type: cc.Button, tooltip: "邀请微信好友" },
        btn_inviteXL: { default: null, type: cc.Button, tooltip: "邀请闲聊好友" },
        btn_read: { default: null, type: cc.Button, tooltip: "游戏准备" },
        layer_disabled: { default: null, type: cc.Node, tooltip: "禁用层" },
        dui_ju_node: { default: null, type: cc.Node, tooltip: "对局动画" },
        huang_zhuang_node: { default: null, type: cc.Node, tooltip: "荒庄动画" },
        deskImage: cc.Sprite, //桌布节点
        tuGuanNode: cc.Node,//托管节点
        ani_fapai: cc.Animation,
        // ani_dabao: cc.Animation,
        // ani_huanbao: cc.Animation,

        spf_baopai_an: cc.SpriteFrame,
        spf_baopai_ming: cc.SpriteFrame,
        spf_baopai_an_2d: cc.SpriteFrame,
        spf_baopai_ming_2d: cc.SpriteFrame,

        tingPaiBtn:cc.Button,//听牌按键
        zhinanNode:cc.Node,//指南node
        guizeNode:cc.Node,//规则node
        prefab_fenzhang:cc.Prefab,//分张预制体

        //baoxiangBtn:cc.Button,//宝箱按键
        yyBtn:cc.Node,//语音按键
        zhuomianImg:[cc.SpriteFrame],//桌面背景
    },

    // use this for initialization
    onLoad: function () {
        cc.log("jlmj_desk_info onLoad");
        this.layer_disabled.active = false;
        this.gghh_ani = cc.find("Canvas/desk_node/play_anis/gghh_m").getComponent(sp.Skeleton);
        // this.gkm_ani = cc.find("Canvas/desk_node/play_anis/gkm_m").getComponent(sp.Skeleton);
        // this.jingoushiba_ani = cc.find("Canvas/desk_node/play_anis/jingoushiba_m").getComponent(sp.Skeleton);
        this.qd_ani = cc.find("Canvas/desk_node/play_anis/qd_m").getComponent(sp.Skeleton);

        this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        this.qd_ani.node.active = false;


        this.logo = cc.find("Canvas/desk_node/c-logo-jilin").getComponent(cc.Sprite);

        this.db_duiju = this.dui_ju_node.getComponent(dragonBones.ArmatureDisplay);
        this.db_duiju.node.active = false;

        this.huangzhuang = this.huang_zhuang_node.getComponent(sp.Skeleton);
        this.huangzhuang.node.active = false;

        // this.zhinanNode = cc.find("Canvas/desk_node/mj_zhinan");
        this.zhinan = null;
        this._zhinan = cc.find("Canvas/desk_node/mj_zhinan");
        this._zhinan_2d = cc.find("Canvas/desk_node/mj_zhinan_2d");
        this.use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
        if(this.use2D){
            this.zhinan = this._zhinan_2d;
            this._zhinan.active = false;
            this._zhinan_2d.active = true;
        }else{
            this.zhinan = this._zhinan;
            this._zhinan.active = true;
            this._zhinan_2d.active = false;
        }

        DingRobot.set_ding_type(1);
        AudioManager.playMusic( jlmj_audio_path.Music_Game  );
        //AudioManager.onMusic( jlmj_audio_path.Music_Game );
        if( !AudioManager._getLocalMusicSwitch() ) {
            AudioManager.stopMusic();
            AudioManager.offMusic();
        }
        this.updatePlayerNum( playerMgr.Instance().getPlayerNum() );

        //如果桌子已解散,提示玩家
        if(DeskData.Instance().desk_dissolved){
            var content = cc.dd.Text.TEXT_DESK_INFO_5;
            this.popViewTips(content, this.gobackHall.bind( this ), PopupType.OK);
        }

        //this.schedule(function () {
            //this.sys_time.string = this.getSysTime();
        //}, 0.5);

        this.initReady();
        this.initShowBtn();
        this.initZhuoBu();
        this.initGuiZeInfo();

        if(DeskData.Instance().jiesuanMsg){
            var msg = DeskData.Instance().jiesuanMsg;
            DeskData.Instance().jiesuanMsg = null;
            this.jiesuan([msg]);
        }

        this.da_pai_prompt = cc.find("Canvas/desk_node/mj_dapai_prompt");
        this.da_pai_prompt_label = cc.find("Canvas/desk_node/mj_dapai_prompt/prompt_label").getComponent(cc.Label);
        this.da_pai_prompt.active = false;

        //返回键
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            this._Marquee.getComponent('com_marquee').updatePosition();
        }
    },

    initGuiZeInfo:function () {
        if(!DeskData.Instance().isFriend()){
            return;
        }

        var cur_rule = RoomMgr.Instance()._Rule;
        cur_rule.roomId = RoomMgr.Instance().roomId;

        var guize_arr = [];
        var guaguo = RoomMgr.Instance().getCoinByGuangGuo(RoomMgr.Instance()._Rule.guangguotype);
        guize_arr.push(cc.dd.Text.TEXT_PY_RULE_1.format([RoomMgr.Instance()._Rule.usercountlimit]));
        guize_arr.push(guaguo?guaguo+Text.TEXT_PY_RULE_3:Text.TEXT_PY_RULE_2);//锅底
        guize_arr.push(Text.TEXT_PY_RULE_4.format([RoomMgr.Instance()._Rule.fengding]));
        guize_arr.push(RoomMgr.Instance()._Rule.isuseyaojiu?     Text.TEXT_PY_RULE_5:'');
        guize_arr.push(RoomMgr.Instance()._Rule.isxiaojifeidan?  Text.TEXT_PY_RULE_6:'');
        guize_arr.push(RoomMgr.Instance()._Rule.iskuaibao?       Text.TEXT_PY_RULE_7:'');
        guize_arr.push(RoomMgr.Instance()._Rule.isxiaojiwanneng? Text.TEXT_PY_RULE_8:'');
        guize_arr.push(RoomMgr.Instance()._Rule.isyaojiusanse?   Text.TEXT_PY_RULE_9:'');

        var desk_leftinfo = cc.find("Canvas/toppanel/desk_leftinfo_fun").getComponent("mj_desk_leftinfo");
        var func = cc.callFunc(function () {
            if(DeskData.Instance().isFriend()){
                desk_leftinfo.qsNode.active = desk_leftinfo.qsNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.qsNode.active == false;
            }else{
                desk_leftinfo.dfNode.active = desk_leftinfo.dfNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.dfNode.active == false;
            }
        }.bind(desk_leftinfo));
        desk_leftinfo.init(guize_arr, func, cur_rule);

        var gz_arr = [];
        var juquan_txt = RoomMgr.Instance()._Rule.usercountlimit==2?Text.TEXT_PY_RULE_10:Text.TEXT_PY_RULE_11;
        gz_arr.push({str:Text.TEXT_PY_RULE_1.format([RoomMgr.Instance()._Rule.usercountlimit]),nodetype:0});
        gz_arr.push({str:juquan_txt.format([RoomMgr.Instance()._Rule.boardscout]),nodetype:0});
        gz_arr.push({str:guaguo?guaguo+Text.TEXT_PY_RULE_3:Text.TEXT_PY_RULE_2,nodetype:1});//锅底
        gz_arr.push({str:Text.TEXT_PY_RULE_4.format([RoomMgr.Instance()._Rule.fengding]),nodetype:1});
        gz_arr.push({str:RoomMgr.Instance()._Rule.isuseyaojiu?    Text.TEXT_PY_RULE_5:'',nodetype:1});
        gz_arr.push({str:RoomMgr.Instance()._Rule.isxiaojifeidan? Text.TEXT_PY_RULE_6:'',nodetype:1});
        gz_arr.push({str:RoomMgr.Instance()._Rule.iskuaibao?      Text.TEXT_PY_RULE_7:'',nodetype:1});
        gz_arr.push({str:RoomMgr.Instance()._Rule.isxiaojiwanneng?Text.TEXT_PY_RULE_8:'',nodetype:1});
        gz_arr.push({str:RoomMgr.Instance()._Rule.isyaojiusanse?  Text.TEXT_PY_RULE_9:'',nodetype:1});

        var mj_guize = this.guizeNode.getComponent("mj_guize");
        mj_guize.addGuize(gz_arr, RoomMgr.Instance()._Rule.gps);

        let node = cc.find("Canvas/toppanel/klb_friend_group_invite_btn");
        if(node){
            let wanFa = guize_arr.slice();
            let wanFaTitle = wanFa.shift();

            let playerList = playerMgr.Instance().getPlayerList();
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if(playerMsg&&playerMsg.userId){
                    playerName.push(playerMsg.name);
                }
            },this);

            //玩法名称+人数+圈数+封顶+缺几人
            let rule = wanFaTitle + ' ' + wanFa.join(' ') + playerName.length + '/' + RoomMgr.Instance()._Rule.usercountlimit;

            node.getComponent('klb_friend_group_invite_btn').setInfo(RoomMgr.Instance().roomId, rule)
        }
    },

    initZhuoBu:function() {
        if(this.use2D){
            this.deskImage.spriteFrame = this.zhuomianImg[2];
            this.logo.node.scaleX = 0.8;
            this.logo.node.scaleY = 0.8;
            return;
        }

        this.logo.node.scaleX = 1;
        this.logo.node.scaleY = 1;

        var json = cc.sys.localStorage.getItem('jlmj_zhuobu_set_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuomianImg.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                }
            });
            if (sprite) {
                this.deskImage.spriteFrame = sprite;
            }
            else {
                this.deskImage.spriteFrame = this.zhuomianImg[0];
                cc.sys.localStorage.setItem('jlmj_zhuobu_set_' + cc.dd.user.id, this.zhuomianImg[0]._name);
            }
        }
        else {
            this.deskImage.spriteFrame = this.zhuomianImg[0];
            cc.sys.localStorage.setItem('jlmj_zhuobu_set_' + cc.dd.user.id, this.zhuomianImg[0]._name);
        }
    },

    //初始化按键显示
    initShowBtn:function () {
        if(DeskData.Instance().isFriend()){
            this.baopai.node.active = false;
            this.tingPaiBtn?this.tingPaiBtn.node.active = false:null;
            this.zhinan.active = false;
            this.guizeNode.active = true;
            this.yyBtn.active = RoomMgr.Instance()._Rule.isyuyin;

            this.setLastJieSuanActive();
        }else {
            this.baopai.node.active = false;

            var player = playerMgr.Instance().getPlayer(dd.user.id);
            if(player){
                this.tingPaiBtn?this.tingPaiBtn.node.active = player.isBaoTing:null;
            }else{
                this.tingPaiBtn?this.tingPaiBtn.node.active = false:null;
            }
        }
    },

    initZhiNan:function () {
        if(this.zhinan.active && DeskData.Instance().zhiNan_site != null){
            var site = DeskData.Instance().zhiNan_site;
            if(playerMgr.Instance().playerList.length == 2){
                site = site>0?site+1:site;
            }
            this.zhinan.getComponent("jlmj_zhinan_ui").initsetZhiNan(site);
            DeskData.Instance().zhiNan_site = null;
        }
    },

    onKeyDown: function (event) {
        if(event.keyCode == cc.KEY.back || event.keyCode == cc.KEY.escape){
            var msg = {};
            msg.status = 0;
            if(DeskData.Instance().isFriend()){ //朋友场
                // 已经开始
                if(  DeskData.Instance().isGameStart ) {
                    msg.status = 3;
                } else if( RoomMgr.Instance().isRoomer( cc.dd.user.id ) ) {
                    msg.status = 1;
                } else {
                    msg.status = 2;
                }
                if(!this.resultView){
                    DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
                }
            }else{  //金币场
                if( jlmj_desk_jbc_data.getInstance().getIsMatching() ) {
                    //// 取消匹配状态
                    msg.status = 5;
                    DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
                } else if( jlmj_desk_jbc_data.getInstance().getIsStart() ) {
                    msg.status = 4;
                    DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
                } else {
                    jlmj_util.enterHall();
                }
            }
        }
    },

    start: function () {
        HallCommonEd.addObserver(this);
        DeskED.addObserver(this);
        playerED.addObserver(this);
        SysED.addObserver(this);
        RoomED.addObserver(this);
        Hall.HallED.addObserver(this);

        DeskData.Instance().enterSceneRecoverDesk(this.sendReadyOK.bind(this));
        if( DeskData.Instance().gameStatus == 1 ) {
            DeskData.Instance().setTotalRound( RoomMgr.Instance()._Rule.boardscout );

            // DeskData.Instance().setOwner(msg.owner); //房主
            DeskData.Instance().setRoomNum(RoomMgr.Instance().roomId);//房间号
            DeskData.Instance().setCurrRound(0);

            DeskData.Instance().setBaoPai(-2);
            DeskData.Instance().isReconnect = 1;
            DeskData.Instance().desk_dissolved = false;

            DeskData.Instance().beishu = RoomMgr.Instance()._Rule.guangguotype;
            DeskData.Instance().isDianPaoSanJia = RoomMgr.Instance()._Rule.isdianpaosanjia; //是否点炮包三家
            DeskData.Instance().isUseYaoJiu = RoomMgr.Instance()._Rule.isuseyaojiu; // 是否有幺九蛋
            DeskData.Instance().isXiaoJiFeiDan = RoomMgr.Instance()._Rule.isxiaojifeidan; // 是否小鸡飞蛋
            DeskData.Instance().isKuaiBao = RoomMgr.Instance()._Rule.iskuaibao; // 是否快宝
            DeskData.Instance().isKuaiGuo = RoomMgr.Instance()._Rule.iskuaiguo; // 是否快锅
            DeskData.Instance().isXiaoJiWanNeng = RoomMgr.Instance()._Rule.isxiaojiwanneng; // 是否小鸡万能宝
            DeskData.Instance().isYaoJiuSanSe = RoomMgr.Instance()._Rule.isyaojiusanse; // 是否幺九蛋顶三色
            DeskData.Instance().isUnCheat = RoomMgr.Instance()._Rule.isuncheat;	//是否防作弊
            DeskData.Instance().payType = RoomMgr.Instance()._Rule.paytype; //房费支付模式
        }
        this.updateDesk();
    },

    ctor: function () {
        this.popupViewPrefab = null;
    },

    onDestroy: function () {
        //this.stopAni();
        this.clearIntervalTimeout();
        HallCommonEd.removeObserver(this);
        DeskED.removeObserver(this);
        playerED.removeObserver(this);
        SysED.removeObserver(this);
        RoomED.removeObserver(this);
        Hall.HallED.removeObserver(this);

        //清理数据
        DeskData.Destroy();
        playerMgr.Destroy();
        RoomMgr.Destroy();
        if(this.locakSceneTimeOut){
            clearTimeout(this.locakSceneTimeOut);
            this.locakSceneTimeOut = null;
        }
        this.unscheduleAllCallbacks();
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIESUAN);
        if (this._Marquee) {
            this._Marquee.getComponent('com_marquee').resetPosition();
        }
    },

    cleanJieSuan(){
        if (this.jiesuan_TimeID) {
            clearTimeout(this.jiesuan_TimeID);
            this.jiesuan_TimeID = null;
        }
        if (this._jiesuan) {
            this._jiesuan.close();
            this._jiesuan = null;
        }
    },

    clearIntervalTimeout:function(){
        if(this.jiesuan_TimeID){
            clearTimeout(this.jiesuan_TimeID);
            this.jiesuan_TimeID = null;
        }
        if(this.result_TimeID){
            clearTimeout(this.result_TimeID);
            this.result_TimeID = null;
        }
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIESUAN);
    },


    /**
     * 初始化准备按钮
     */
    initReady: function() {
        if( !DeskData.Instance().isGameStart ) {
            var player1 = playerMgr.Instance().getPlayer( cc.dd.user.id );
            if( player1 != null ) {
                if( player1.bready == 1 ) {
                    this.setRead( cc.dd.user.id );
                }
            }
        }
    },


    _getNet:function () {
        return s_hallNet.Instance();
    },

    /**
     * 获取系统时间
     */
    getSysTime: function () {
        var date = new Date();
        var seperator2 = ":";
        var min = date.getMinutes();
        min = min >= 10 ? min : '0' + min;
        var hour = date.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        return hour + seperator2 + min;
    },

    /**
     * 更新房号
     * @param roomNum 房号 如果为null就去取数据层的数据
     */
    updateRoomNum: function (roomNum) {
        if (!roomNum) {
            roomNum = DeskData.Instance().roomNumber;
        }
        if(this.room_num != null && this.room_id != null)
        {
            this.room_num.active = true;
            this.room_id.string = roomNum;
        }
        //for (var key in this.room_num) {
        //    this.room_num[key].string = roomNum;
        //}//
    },

    /**
     * 更新剩余牌数
     * @param cardNum 牌数量 如果为null就去取数据层的数据
     */
    updateRemainCard: function (cardNum) {
        if (!cardNum) {
            cardNum = DeskData.Instance().remainCards;
        }
        if(DeskData.Instance().isGameStart){
            this.pai_num.string = cardNum;
        }
    },

    /**
     * 更新宝牌
     * @param baoPaiValue 宝牌的值 如果为null就去取数据层的数据
     * -2指没有宝牌-1宝牌盖着，其他为宝牌位置
     */
    updateBaoPai: function () {
        // if(DeskData.Instance().gameStatus != 2){
        if(UserPlayer.Instance().bready == 1){  //只能用ready 现在没有游戏开始未开始字段
            cc.log('游戏未开始,宝牌隐藏');
            this.baopai.node.active = false;
            return;
        }
        var baoPaiValue = DeskData.Instance().unBaopai;
        cc.log("更新宝牌UI,宝牌值=",baoPaiValue);
        //-2指没有宝牌-1宝牌盖着，其他为宝牌位置
        if(baoPaiValue == -2){
            this.baopai.node.active = false;
        }else if(baoPaiValue == -1){
            this.baopai.node.active = true;

            let use2D = DeskData.Instance().getIs2D();

            if(use2D){
                this.baopai.frame.spriteFrame = this.spf_baopai_an_2d;
            }else{
                this.baopai.frame.spriteFrame = this.spf_baopai_an;
            }

            // this.baopai.frame.spriteFrame = this.spf_baopai_an;
            this.baopai.value.node.active = false;
        }else{
            this.baopai.node.active = true;

            let use2D = DeskData.Instance().getIs2D();

            if(use2D){
                this.baopai.frame.spriteFrame = this.spf_baopai_ming_2d;
                this.baopai.value.node.skewX = 0;
                this.baopai.value.node.skewY = 0;
                this.baopai.value.node.x = 0;
                this.baopai.value.node.y = 10;
                this.baopai.value.node.anchorX = 0.5;
                this.baopai.value.node.anchorY = 0.5;
            }else{
                this.baopai.frame.spriteFrame = this.spf_baopai_ming;
                this.baopai.value.node.skewX = -3;
                this.baopai.value.node.skewY = 1;
                this.baopai.value.node.x = 4;
                this.baopai.value.node.y = 17;
                this.baopai.value.node.anchorX = 0.6;
                this.baopai.value.node.anchorY = 0.6;
            }

            // this.baopai.frame.spriteFrame = this.spf_baopai_ming;
            this.baopai.value.node.active = true;
            this.baopai.setValue(baoPaiValue);
        }
    },

    /**
     * 打开宝牌
     */
    openBaoPai: function () {
        var baoPaiValue = DeskData.Instance().unBaopai;
        cc.log("宝牌值:", baoPaiValue);
        if (baoPaiValue >= 0) {
            this.baopai.node.active = true;

            let use2D = DeskData.Instance().getIs2D();

            if(use2D){
                this.baopai.frame.spriteFrame = this.spf_baopai_ming_2d;
                this.baopai.value.node.skewX = 0;
                this.baopai.value.node.skewY = 0;
                this.baopai.value.node.x = 0;
                this.baopai.value.node.y = 10;
                this.baopai.value.node.anchorX = 0.5;
                this.baopai.value.node.anchorY = 0.5;
            }else{
                this.baopai.frame.spriteFrame = this.spf_baopai_ming;
                this.baopai.value.node.skewX = -3;
                this.baopai.value.node.skewY = 1;
                this.baopai.value.node.x = 4;
                this.baopai.value.node.y = 17;
                this.baopai.value.node.anchorX = 0.6;
                this.baopai.value.node.anchorY = 0.6;
            }

            // this.baopai.frame.spriteFrame = this.spf_baopai_ming;
            this.baopai.value.node.active = true;
            this.baopai.setValue(baoPaiValue);
        }
    },

    /**
     * 更新当前圈数
     * @param currValue 当前圈数 如果为null就去取数据层的数据
     */
    updateCurrRound: function (currValue) {
        if (!currValue) {
            currValue = DeskData.Instance().currPlayCount;
        }
        this.dangqian_ju.string = currValue;
    },

    /**
     * 更新总圈数
     * @param totalValue 总圈数 如果为null就去取数据层的数据
     */
    updateTotalRound: function (totalValue) {
        if (!totalValue) {
            totalValue = DeskData.Instance().totalPlayCount;
        }
        this.zong_ju.string = totalValue;
    },

    /**
     * 更新游戏状态
     * @param status 1：未开始 2：已开始
     */
    updateGameStatus: function (status) {
        cc.log("-----更新游戏状态------");
        if (!status)
            status = DeskData.Instance().gameStatus;

        var player = playerMgr.Instance().getPlayer(dd.user.id);
        if (status == 1) {
            if(DeskData.Instance().isFriend()) {
                this.btn_invite.node.active = true;
                // this.btn_inviteXL.node.active = true;
                this.setFriendGroupInvite(this.btn_invite.node.active);
                this.btn_read.node.active = true;
            }

            if (player.bready) {
                this.setRead(dd.user.id);
            }
            playerMgr.Instance().playerNumChanged();
        } else if (status == 2) {
            this.btn_invite.node.active = false;
            this.btn_inviteXL.node.active = false;
            this.setFriendGroupInvite(this.btn_invite.node.active);
            if(DeskData.Instance().isFriend()){
                this.zhinan.active = true;
                this.guizeNode.active = false;
                this.btn_read.node.active = false;
                this.room_num.active = false;
                this.initZhiNan();
            }
            if(player.isBaoTing){
                this.tingPaiBtn?this.tingPaiBtn.node.active = true:null;
            }
        }
    },

    setTingPaiBtn:function (show) {
        this.tingPaiBtn.node.active = show;
    },
    /**
     * 更新桌子信息
     */
    updateDesk: function () {
        this.updateRoomNum();
        this.updateRemainCard();
        this.updateBaoPai();
        this.updateCurrRound();
        this.updateTotalRound();
        this.upDatePlayerInfo();
        if( DeskData.Instance().isGameStart ) {
            this.updateGameStatus();
        }
    },

    /**
     * 准备
     */
    onRead: function () {
        jlmj_audio_mgr.com_btn_click();

        cc.dd.mj_game_start = true;

        // 已经开始 区分发给房间管理器协议，还是游戏内的协议
        if(  DeskData.Instance().isGameStart ) {
            //var player = playerMgr.Instance().getPlayer(dd.user.id);
            //player.reqReady();
            var msg = new cc.pb.jilinmajiang.p17_req_ready();
            cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_ready,msg,"p17_req_ready");
        } else {

            var msg = new cc.pb.room_mgr.msg_prepare_game_req();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType( RoomMgr.Instance().gameId );
            gameInfoPB.setRoomId( RoomMgr.Instance().roomId );

            msg.setGameInfo( gameInfoPB );

            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req,msg,"msg_prepare_game_req", true);

        }

    },

    /**
     * 取消托管
     */
    cleanTuoGuanBtnCallBack: function () {
        // this.onShowTG(false);
        cc.log('取消托管')
    },
    /**
     * 显示托管节点
     */
    /*onShowTG: function (isShow) {
         this.tuGuanNode.active = isShow;
    },*/

    //玩家数据更细
    upDatePlayerInfo:function () {
        var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        play_list.playerUpdateUI();
    },

    /**
     * 玩家数量更新
     */
    updatePlayerNum:function(num){
        //更新准备和邀请按钮
        if(num==RoomMgr.Instance()._Rule.usercountlimit){
            this.btn_invite.node.active=false;
            this.btn_inviteXL.node.active=false;
            this.setFriendGroupInvite(this.btn_invite.node.active);
        }
        else{
            this.btn_invite.node.active=true;
            // this.btn_inviteXL.node.active=true;
            this.setFriendGroupInvite(this.btn_invite.node.active);
        }
    },

    /**
     * 获取文字玩法
     */
    getTextByWanFa: function() {
        var text = "";
        var desk = DeskData.Instance();

        var dianpao = desk.isDianPaoSanJia ? cc.dd.Text.TEXT_JOIN_6 : "";
        var yaojiu = desk.isUseYaoJiu ? cc.dd.Text.TEXT_JOIN_7 : "";
        var xiaojifei = desk.isXiaoJiFeiDan ? cc.dd.Text.TEXT_JOIN_8 : "";
        var kuaibao = desk.isKuaiBao  ? cc.dd.Text.TEXT_JOIN_9 : "";
        var yaojiwanneng = desk.isXiaoJiWanNeng  ? cc.dd.Text.TEXT_JOIN_10 : "";
        var yaojiusanse = desk.isYaoJiuSanSe  ? cc.dd.Text.TEXT_JOIN_11 : "";
        var kuaiguo = desk.isKuaiGuo  ? cc.dd.Text.TEXT_JOIN_12 : "";

        text = yaojiu + yaojiwanneng + xiaojifei + yaojiusanse + kuaibao;
        return text;
    },

    /**
     * 邀请微信好友
     */
    onInvaite: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }
        jlmj_audio_mgr.com_btn_click();
        var title = '吉林-'+playerMgr.Instance().playerList.length+'人';
        title += " "+ "房间号:" + (RoomMgr.Instance().roomId || 888888);
        var content = '共'+DeskData.Instance().totalPlayCount+''+(playerMgr.Instance().playerList.length==2?'局':'圈');
        content += " " + Text.TEXT_PY_RULE_4.format([RoomMgr.Instance()._Rule.fengding]);
        content += " " + this.getTextByWanFa();
        if (cc.sys.isNative) {
            // cc.dd.native_wx.SendAppContent(DeskData.Instance().roomNumber, title, content,  Platform.GetAppUrl(AppCfg.GAME_PID,AppCfg.PID));

            let wanFa = [];
            let juquan_txt = RoomMgr.Instance()._Rule.usercountlimit==2?Text.TEXT_PY_RULE_10:Text.TEXT_PY_RULE_11;
            let guaguo = RoomMgr.Instance().getCoinByGuangGuo(RoomMgr.Instance()._Rule.guangguotype);
            wanFa.push(Text.TEXT_PY_RULE_1.format([RoomMgr.Instance()._Rule.usercountlimit]));
            wanFa.push(guaguo?guaguo+Text.TEXT_PY_RULE_3:Text.TEXT_PY_RULE_2);//锅底
            wanFa.push(Text.TEXT_PY_RULE_4.format([RoomMgr.Instance()._Rule.fengding]));
            wanFa.push(RoomMgr.Instance()._Rule.isuseyaojiu?    Text.TEXT_PY_RULE_5:'');
            wanFa.push(RoomMgr.Instance()._Rule.isxiaojifeidan? Text.TEXT_PY_RULE_6:'');
            wanFa.push(RoomMgr.Instance()._Rule.iskuaibao?      Text.TEXT_PY_RULE_7:'');
            wanFa.push(RoomMgr.Instance()._Rule.isxiaojiwanneng?Text.TEXT_PY_RULE_8:'');
            wanFa.push(RoomMgr.Instance()._Rule.isyaojiusanse?  Text.TEXT_PY_RULE_9:'');

            let wanFaTitle = wanFa.shift();

            let playerList = playerMgr.Instance().getPlayerList();
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if(playerMsg&&playerMsg.userId){
                    playerName.push(playerMsg.name);
                }
            },this);

            let info = {
                gameid: RoomMgr.Instance().gameId,//游戏ID
                roomid: RoomMgr.Instance().roomId,//房间号
                title: wanFaTitle,//房间名称
                content: wanFa,//游戏规则数组
                usercount: RoomMgr.Instance()._Rule.usercountlimit,//人数
                jushu: RoomMgr.Instance()._Rule.boardscout,//局\圈数
                jushutitle: RoomMgr.Instance()._Rule.usercountlimit==2 ? '局数' : '圈数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }

            if(custom == 'XL'){
                var login_module = require('LoginModule');
                var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
                cc.dd.native_wx.sendXlLink(title, content, url);
            }else{
                cc.dd.native_wx.SendAppInvite(info, title, content,  Platform.wxShareGameUrl[AppCfg.PID]);
            }
        }
        cc.log(title);
        cc.log(content);
    },

    setRead: function (readyId) {
        cc.log("----准备按键隐藏----")
        var selfId = dd.user.id;
        if (readyId === selfId) {
            this.btn_read.node.active = false;
        }
    },

    /**
     * 播放分张特效
     */
    playerFenZhangAni: function () {
        cc.log('【分张动画播放】 开始');
        DeskData.Instance().fenzhangCount = 0;
        if(!this.fenzhang){
            this.fenzhang = cc.instantiate(this.prefab_fenzhang).getComponent('jlmj_fenzhang');
            this.fenzhang.initData(playerMgr.Instance().playerList);
            this.fenzhang.node.parent = this.node;
        }
        this.fenzhang.node.active = true;
        this.fenzhang.playAni();
        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('jlmj_player_down_ui');
        player_down_ui.setFenPaiTouched(true);
    },

    /**
     * 删除分张牌
     * @param index 下标
     */
    hideFenZhangCard: function () {
        if (this.fenzhang) {
            this.fenzhang.getPai();
        }
    },


    /**
     * 结算
     * @param data
     */
    jiesuan: function (data) {
        if (this.fenzhang) {
            this.fenzhang.node.active = false;
        }

        if( this._jiesuan){
            this._jiesuan.close();
            this._jiesuan = null;
        }

        var self = this;
        if(this.jiesuan_TimeID){
            clearTimeout(this.jiesuan_TimeID);
        }
        this.da_pai_prompt.active = false;

        let waitTime = cc._needShowDrop ? 4000 : 0;

        this.lastJiesuan = data[0];

        cc.dd.mj_game_start = false;

        this.jiesuan_TimeID = setTimeout(function () {
            if (!data || !data[0]) {
                return;
            }

            if(DeskData.Instance().getIsStart() && data[1] !== true){
                return;
            }

            if (cc.director.getScene().name != 'jlmj_game' ||
                cc.director.getScene().name != 'jlmj_jbc_game') {
                cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIAOPAI_INFO);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_JIESUAN,function (ui) {
                    var jlmj_jiesuan = ui.getComponent("jlmj_jiesuan_ui");
                    jlmj_jiesuan.showJianYiLayer(data[0], 20, function () {
                        self._jiesuan = null;
                    }.bind(self), data[1]);
                    jlmj_jiesuan.jiesuanBtnCallBack();
                    self._jiesuan = jlmj_jiesuan;
                    // var ani = self._jiesuan.node.getComponent(cc.Animation);
                    // if(data[0].huuserid){
                    //     ani.play('mj_jiesuan');
                    // }

                    if(DeskData.Instance().isJBC()) {
                        self.button_message.interactable = false;
                        //判断是否破产停止倒计时
                        var roomId = RoomMgr.Instance().roomLv;
                        var gameId = RoomMgr.Instance().gameId;
                        var room_item = game_room.getItem(function(item){
                            return item.gameid == gameId && item.roomid == roomId;
                        });

                        if(room_item && HallPropData.getCoin() < room_item.entermin){
                            cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_XIAOQIAN,function (ui) {
                                var mj_huaqian = ui.getComponent("mj_huaqian");
                                mj_huaqian.setEntermin(room_item.entermin);
                                ui.zIndex = UIZorder.MJ_LAYER_TOP;
                                jlmj_jiesuan.stopTime();
                            });
                        }
                    }else if(DeskData.Instance().isFriend()){
                        if(DeskData.Instance().isDajiesuan){
                            self.result_TimeID = setTimeout(function () {
                                self.onShowResultView();
                            }.bind(self), 2000);
                        }
                    }

                    AudioManager.playSound(jlmj_audio_path.JIESUAN);
                }.bind(self));
            }
        },waitTime);
    },

    /**
     * 显示结算统计
     */
    onShowResultView: function () {
        if(!DeskData.Instance().isInMaJiang()){
            return;
        }
        var self = this;
        if(this._jiesuan){
            this._jiesuan.node.active = false;
        }
        cc.dd.UIMgr.openUI(jlmj_prefab.MJ_ZHANJITONGJI, function(ui) {
            var juquan_txt = RoomMgr.Instance()._Rule.usercountlimit==2?Text.TEXT_PY_RULE_10:Text.TEXT_PY_RULE_11;
            var guaguo = RoomMgr.Instance().getCoinByGuangGuo(RoomMgr.Instance()._Rule.guangguotype);

            var fj_arr = [];
            var gz_arr = [];

            fj_arr.push(Text.TEXT_PY_RULE_1.format([RoomMgr.Instance()._Rule.usercountlimit]));
            fj_arr.push(Text.TEXT_PY_RULE_12+RoomMgr.Instance()._Rule.roomId);
            fj_arr.push(juquan_txt.format([RoomMgr.Instance()._Rule.boardscout]));
            // fj_arr.push(this.getSysTime());

            gz_arr.push(guaguo?guaguo+Text.TEXT_PY_RULE_3:Text.TEXT_PY_RULE_2);//锅底
            gz_arr.push(Text.TEXT_PY_RULE_4.format([RoomMgr.Instance()._Rule.fengding]));
            gz_arr.push(RoomMgr.Instance()._Rule.isuseyaojiu?     Text.TEXT_PY_RULE_5:'');
            gz_arr.push(RoomMgr.Instance()._Rule.isxiaojifeidan?  Text.TEXT_PY_RULE_6:'');
            gz_arr.push(RoomMgr.Instance()._Rule.iskuaibao?       Text.TEXT_PY_RULE_7:'');
            gz_arr.push(RoomMgr.Instance()._Rule.isxiaojiwanneng? Text.TEXT_PY_RULE_8:'');
            gz_arr.push(RoomMgr.Instance()._Rule.isyaojiusanse?   Text.TEXT_PY_RULE_9:'');

            var fjinfo = fj_arr.join(' ');
            var gzinfo = Text.TEXT_PY_RULE_13+gz_arr.filter(function(txt){return txt!=''}).join(',');
            var playerList = playerMgr.Instance().playerList;
            var tongjiData = DeskData.Instance().getTongjiData();

            self.resultView = ui;
            ui.zIndex = UIZorder.MJ_LAYER_UI;
            var mj_zhanjitongji = ui.getComponent("mj_zhanjitongji");
            mj_zhanjitongji.init(fjinfo, gzinfo, playerList, tongjiData, function() {
                if (DeskData.Instance().isFriend()) {
                    jlmj_util.enterHall();
                }
            }, DeskData.Instance().isDajiesuan, ()=>{
                if(this._jiesuan){
                    this._jiesuan.node.active = true;
                }
            });
        }.bind(this));
    },

    /**
     * 清理桌子
     */
    clear: function (data) {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_JIAOPAI_INFO);
        this.baopai.node.active = false;

        this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        this.qd_ani.node.active = false;

        this.tingPaiBtn?this.tingPaiBtn.node.active = false:null;
        this.closeResponseDissolveView();
        this.closePopupView();
        DeskED.notifyEvent(DeskEvent.CLOSE_ZSQ, [this]);
        this.da_pai_prompt.active = false;

        if(cc.dd.mj_change_2d_next_time){
            cc.dd.mj_change_2d_next_time = false;
            this._change2D();
        }
    },

    /**
     * 隐藏 桌子上的准备 邀请
     */
    hideDeskReady: function () {
        this.btn_invite.node.active = false;
        this.btn_inviteXL.node.active = false;
        this.setFriendGroupInvite(this.btn_invite.node.active);
        this.btn_read.node.active = false;

        cc.log("------隐藏按键------");
        if(DeskData.Instance().isFriend()){
            this.zhinan.active = true;
            this.guizeNode.active = false;
            this.room_num.active = false;
            this.initZhiNan();
        }
    },
    /**
     * 重连成功 事件
     */
    restConnect:function () {
        if( this._jiesuan){
            this._jiesuan.close();
            this._jiesuan = null;
        }
    },

    // 弹出离开房间确认框
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    // @param callback [object] 确定后的回调函数
    // @param type [enum] 弹窗类型
    popViewTips: function (msg, callback, type) {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG,function (ui) {
            this.popupViewPrefab = ui;
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            ui.getComponent("jlmj_popup_view").show(msg, callback, type, function () {
                this.popupViewPrefab = null;
            }.bind(this));
        }.bind(this));
    },

    // 离开状态
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    setLeaveStatus: function (data) {
        var txt = "";
        var callfunc = null;

        if (DeskData.Instance().isFriend()) {//朋友场
            if (DeskData.Instance().isDajiesuan) {//已经结束大结算
                jlmj_util.enterHall();
            } else if (DeskData.Instance().isGameStart) {//已经开始游戏
                txt = Text.TEXT_LEAVE_ROOM_2;
                callfunc = this.reqSponsorDissolveRoom;
            } else {//未开始游戏
                //判断房主和玩家提示不一样
                if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                    txt = Text.TEXT_LEAVE_ROOM_1 + "\n" + Text.TEXT_LEAVE_ROOM_5;
                } else {
                    txt = Text.TEXT_LEAVE_ROOM_3;
                }
                callfunc = this.leave_game_req;
            }
        } else if (DeskData.Instance().isJBC()) {//金币场
            if (data.status == 7) {
                this.jbcGameMatchinglveRoom();
            }else if(data.status == 9) {
                this.enterHallMatch = true;
                this.jbcGameMatchinglveRoom();
            }else if(data.status == 10){
                if (this._jiesuan){
                    this.enterOtherGame = data.gameID;
                    this.jbcGameMatchinglveRoom();
                }
            } else if (jlmj_desk_jbc_data.getInstance().getIsMatching() || DeskData.Instance().player_read_gamne) {//取消匹配状态
                txt = Text.TEXT_LEAVE_ROOM_3;
                callfunc = this.jbcGameMatchinglveRoom;
            } else if (jlmj_desk_jbc_data.getInstance().getIsStart()) {//游戏中退出游戏
                if (this._jiesuan) {//游戏中并结算中退出游戏
                    txt = Text.TEXT_LEAVE_ROOM_3;
                    callfunc = this.jbcGameMatchinglveRoom;
                } else {//游戏中退出游戏
                    txt = cc.dd.Text.TEXT_LEAVE_ROOM_3 + "\n" + cc.dd.Text.TEXT_LEAVE_ROOM_6;
                    callfunc = this.jbcGameStartlveRoom;
                }
            } else {
                jlmj_util.enterHall();
            }
        } else if (DeskData.Instance().isReplay()) {

        } else if (DeskData.Instance().isMatch()) {

        }
        if (callfunc != null) {
            this.popViewTips(txt, callfunc, PopupType.OK_CANCEL);
        }
        // var content = "";
        // var callfunc = null;
        // switch( msg.status ) {
        //     // 未开始 解散
        //     case 1:
        //         content = cc.dd.Text.TEXT_LEAVE_ROOM_1 +"\n" + cc.dd.Text.TEXT_LEAVE_ROOM_5;
        //         callfunc = this.leave_game_req;
        //         break;
        //     // 未开始 离开
        //     case 2:
        //         content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
        //         callfunc = this.leave_game_req;
        //         break;
        //     // 已开始 解散
        //     case 3:
        //         content = cc.dd.Text.TEXT_LEAVE_ROOM_2;
        //         callfunc = this.reqSponsorDissolveRoom;
        //         break;
        //     // jbc 已开始退出
        //     case 4:
        //         content = cc.dd.Text.TEXT_LEAVE_ROOM_3 +"\n" + cc.dd.Text.TEXT_LEAVE_ROOM_6;
        //         callfunc = this.jbcGameStartlveRoom;
        //         break;
        //     // jbc 未开始退出
        //     case 5:
        //         content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
        //         callfunc = this.jbcGameMatchinglveRoom;
        //         break;
        //     // jbc 未开始退出
        //     case 6:
        //         this.jbcGameMatchinglveRoom();
        //         break;
        //     case 7:
        //         this.jbcGameMatchinglveRoom();
        //         break;
        // }
        // if(callfunc != null){
        //     this.popViewTips(content, callfunc, PopupType.OK_CANCEL);
        // }
    },

    leave_game_req: function () {
        cc.log('发送离开 2');
        var msg = new cc.pb.room_mgr.msg_leave_game_req();

        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType( RoomMgr.Instance().gameId );
        gameInfoPB.setRoomId( RoomMgr.Instance().roomId );

        msg.setGameInfo( gameInfoPB );

        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req,msg,"msg_leave_game_req", true);
    },

    // 发送 发起解散房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    reqSponsorDissolveRoom: function () {
        cc.log("【UI】发送 发起解散房间 请求");
        var msg = new cc.pb.jilinmajiang.p17_req_sponsor_dissolve_room();
        msg.setSponsorid(dd.user.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_sponsor_dissolve_room,msg,"p17_req_sponsor_dissolve_room");
    },


    // 发送 响应解散房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    reqResponseDissolveRoom: function (isAgree) {
        cc.log("【UI】发送 响应解散房间 请求");
        var msg = new cc.pb.jilinmajiang.p17_req_response_dissolve_room();
        msg.setResponseid(dd.user.id);
        msg.setIsagree(isAgree);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_response_dissolve_room,msg,"p17_req_response_dissolve_room");
    },

    //jbc 开始游戏中退出房间
    jbcGameStartlveRoom:function () {
        cc.log('发送离开 3');
        var msg = new cc.pb.room_mgr.msg_leave_game_req();

        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType( RoomMgr.Instance().gameId );
        gameInfoPB.setRoomId( RoomMgr.Instance().roomLv );

        msg.setGameInfo( gameInfoPB );
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req,msg,"msg_leave_game_req", true);
        // jlmj_util.enterHall();
    },

    //jbc匹配状态中退出房间
    jbcGameMatchinglveRoom:function () {
        cc.log('发送离开 4');
        // 取消匹配状态
        var msg = new cc.pb.room_mgr.msg_leave_game_req();

        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType( RoomMgr.Instance().gameId );
        gameInfoPB.setRoomId( RoomMgr.Instance().roomLv );

        msg.setGameInfo( gameInfoPB );
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req,msg,"msg_leave_game_req", true);
        // jlmj_util.enterHall();
    },

    closePopupView: function () {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_TANCHUANG);
    },

    closeResponseDissolveView: function () {
        if (this.popupViewPrefab) {
            cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_JIESAN);
        }
    },

    gobackHall: function () {
        jlmj_util.enterHall();
    },

    // 发起解散房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    sponsorDissolveRoom: function (msg) {
        this.closePopupView();
        let jiesan_ui = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_JIESAN);
        let mj_zhangji = cc.dd.UIMgr.getUI(jlmj_prefab.MJ_ZHANJITONGJI);
        if(!jiesan_ui && !mj_zhangji){
            cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_JIESAN, function(ui) {
                ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            });
        }else if(jiesan_ui && !jiesan_ui.active){
            cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_JIESAN, function(ui) {
                ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            });
        }
    },

    // 响应解散房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    responseDissolveRoom: function (msg, isGoHall) {
        var jiesan_ui = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_JIESAN);
        if (jiesan_ui) {
            jiesan_ui.getComponent("jlmj_sponsor_dissolve_view").updateAgreeUI();
        }
    },

    // 直接解散房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    dissolveRoom: function (msg) {
        this.closePopupView();
        var data = DeskData.Instance().getTongjiData();
        if (!DeskData.Instance().isGameEnd) {//是否有大结算显示
            var content = "";
            if (msg.bankerid == 0) {
                this.gobackHall();
                return;
            }

            if (msg.bankerid != dd.user.id) {
                content = cc.dd.Text.TEXT_DESK_INFO_5;
                this.popViewTips(content, this.gobackHall.bind( this ), PopupType.OK);
            } else {
                this.gobackHall();
            }
        }

    },

    // 直接退出房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    exitRoom: function (msg) {
        this.closePopupView();
        this.closeResponseDissolveView();
        if (msg.exitid == dd.user.id) {
            this.gobackHall();
        } else {
            playerMgr.Instance().playerExit(msg.exitid);
        }
    },

    /**
     *  断线重连回来  需要发送加载完毕
     */
    sendReadyOK: function () {
        DeskData.Instance().lockScene();
        var msg = new cc.pb.jilinmajiang.p17_req_reloading_ok();
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_reloading_ok,msg,"p17_req_reloading_ok");
        this.initGuiZeInfo();
    },

    /**
     * 恢复数据适用
     */
    recoverDesk: function () {
        this.updateDesk();
        DeskData.Instance().enterSceneRecoverDesk(this.sendReadyOK.bind(this));
        if (this.fenzhang) {
            this.fenzhang.node.active = false;
        }
        var player = playerMgr.Instance().getPlayer(dd.user.id);
        if( DeskData.Instance().isGameStart ) {
            this.setTingPaiBtn(player.isBaoTing);
        }
    },

    onLockSceneTouch: function () {
        this.layer_disabled.active = true;
    },

    onUnlockSceneTouch: function () {
        if( !cc.dd.Utils.isNull( this.layer_disabled ) ) {
            this.layer_disabled.active = false;
        }
    },

    /**
     * 显示没有分数的玩家点炮提示
     * @param event
     * @param data
     */
    showNoMarkDianpao: function () {
        cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_DESK_INFO_4);
    },

    /**
     * 显示提示
     * @param event
     * @param data
     */
    showTipsPop: function (str) {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TIPS_POP, function (ui) {
            ui.getComponent('jlmj_tips_pop').setText(str);
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
        }.bind(this));
    },

    /**
     * 发牌  每个玩家4个牌发一下
     * @param userList   庄家id 先发这个人的牌
     */
    fapaiStep: function (userList, myData) {
        //锁定屏幕
        this.onLockSceneTouch();

        this._fapaiCount = 4;
        this.__x = 0;//表示数组中的那个玩家
        this.__y = 0;//表示那个玩家手牌中的那个牌
        var allcard = 136;
        //完成函数
        var endCall = function () {
            clearInterval(this._interID);
            for(var i in userList){
                if(userList[i]){
                    userList[i].fapaiEnd();
                }
            }
            DeskData.Instance().setRemainCard(83);//发牌完成固定
            DeskData.Instance().setFirstMoPai( false );

            var msg = DeskData.Instance().getFirstOverturn();
            jlmj_net_handler_jlmj.on_p17_ack_game_overturn( msg );

            //解锁屏幕
            this.onUnlockSceneTouch();
        }.bind(this);

        //定时器开始
        this._interID = setInterval(function () {
            var player = userList[this.__x];
            if (player) {
                var shoupaiLength = 13;//player.shoupai.length;
                var arr = [];
                for (var i = this.__y; i < this.__y + this._fapaiCount && i < shoupaiLength; ++i) {
                    arr.push(player.shoupai[i]);
                }
                allcard = allcard - arr.length;
                DeskData.Instance().setRemainCard(allcard);
                DeskED.notifyEvent(DeskEvent.MO_PAI_ACT, [arr.length, allcard, true, 0, 0]);
                player.fapai(arr);

                this.__x++;
                if (this.__x >= userList.length) {
                    this.__x = 0;
                    this.__y += this._fapaiCount;//四张发一下
                    if (this.__y >= 13) {
                        endCall();
                    }
                }
            }
        }.bind(this), 100);//每0。1秒触发一次发牌

    },

    /**
     * 停止发牌动画
     */
    stopFaPai: function() {
        if( this._interID ) {
            cc.log( "停止播放动画111" );
            clearInterval(this._interID);
            this._interID = null;
        }
    },

    /**
     * 换桌布
     */
    changeDeskImage: function (type) {
        cc.log('换桌布：', type);
        this.initZhuoBu();
    },

    playerNumChanged:function(){
        var num = playerMgr.Instance().getPlayerNum();
        DeskED.notifyEvent(DeskEvent.UPDATE_PLAYER_NUM,num);
        cc.log('更新玩家数量:'+num);
    },

    popupEnterHall: function( text, callfunc ) {
        cc.dd.DialogBoxUtil.show(0, text, '确定', null, function () {
            if(callfunc){
                callfunc();
            }
        }, function(){});
    },

    setTingPaiUIActive:function (active) {
        this.tingPaiBtn?this.tingPaiBtn.node.active = active:null;
    },

    onTingPaiTouch:function () {
        var UserPlayer = require('jlmj_userPlayer_data').Instance();
        var jiaoInfo = UserPlayer.curJiaoPaiInfo();
        var ui_jiaoinfo = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_JIAOPAI_INFO);
        if(this.mj_jiao_info && ui_jiaoinfo&& ui_jiaoinfo.active){
            this.mj_jiao_info.onClickClose();
            this.mj_jiao_info = null;
            return;
        }
        if(jiaoInfo != null)
        {
            cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_JIAOPAI_INFO, function (ui) {
                var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
                this.mj_jiao_info = ui.getComponent('mj_jiao_info');
                this.mj_jiao_info.init(play_list);
                this.mj_jiao_info.setJiaoPaiList(jiaoInfo);
                this.mj_jiao_info.showMask(true);
            }.bind(this));
        }
    },

    visibleBaseScore: function( msg ) {
        cc.log( "visibleBaseScore" );
    },

    //更新金币
    hallUpdateCoin:function() {
        if(DeskData.Instance().isFriend()){
            return;
        }
        const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
        var coin = hall_prop_data.getCoin();
        var player = playerMgr.Instance().getPlayer(cc.dd.user.id);
        if(player){player.setCoin( coin );}
    },

    update_hall_data: function( msg ) {
        var jiesuan_ui = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_JIESUAN);
        if(jiesuan_ui && jiesuan_ui.active){
            cc.log("存在结算界面时,不返回大厅");
            return;
        }

        // cc.dd.DialogBoxUtil.show(0, "本局游戏未开始或已结束", '确定', null,
        //     function () {
                // 返回大厅
                playerMgr.Instance().clear();
                jlmj_util.enterHall();
        //     },
        //     function () {
        //     }
        // );
    },

    on_show_da_pai_prompt:function (data) {
        if(data[1] != null && this.da_pai_prompt){
            this.da_pai_prompt.active = data[1];
            var text_arr = [Text.TEXT_MJ_DESK_INFO_0,Text.TEXT_MJ_DESK_INFO_1,0,0,0,0,Text.TEXT_MJ_DESK_INFO_6];
            this.da_pai_prompt_label.string = text_arr [data[0]];
        }
    },

    on_room_leave: function( msg ) {

    },

    on_room_ready: function( msg ) {
        if( msg.retCode !== 0 ) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    this.popupEnterHall( str, jlmj_util.enterHall.bind(jlmj_util) );
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    this.popupEnterHall( str, jlmj_util.enterHall.bind(jlmj_util) );
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_11;
                    this.popupEnterHall( str, null );
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_POPUP_20;
                    this.popupEnterHall( str, jlmj_util.enterHall.bind(jlmj_util) );
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_POPUP_16;
                    this.popupEnterHall( str, jlmj_util.enterHall.bind(jlmj_util) );
                    break;
                default:
                    break;
            }
        }
    },

    onPlayDuiJuAniEnd: function () {
        this.db_duiju.node.active = false;
    },

    onPlayerHuangZhuangAniBegin:function () {
        this.da_pai_prompt.active = false;
        // this.huangzhuang.node.active = true;
        // this.huangzhuang.playAnimation("HZ",1);
        // this.huangzhuang.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayerHuangZhuangAniEnd, this);
        // this.huangzhuang.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayerHuangZhuangAniEnd, this);
        this.playSpine(this.huangzhuang, ['huangzhuang']);
    },
    onPlayerHuangZhuangAniEnd:function () {
        this.huangzhuang.node.active = false;
    },

    change_room:function () {
        cc.dd.mj_game_start = true;

        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType( RoomMgr.Instance().gameId );
        pbData.setRoomCoinId( RoomMgr.Instance().roomLv );
        cc.gateNet.Instance().sendMsg( cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true );

        var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        if(play_list) {
            for(var i=0; i< play_list.player_ui_arr.length; ++i){
                var headinfo = play_list.player_ui_arr[i];
                if(headinfo && headinfo.head.player && headinfo.head.player.userId != cc.dd.user.id){
                    headinfo.head.node.active = false;
                }
            }
        }
    },
    jbc_ready:function () {
        cc.dd.mj_game_start = true;

        var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType( RoomMgr.Instance().gameId );
        gameInfoPB.setRoomId( RoomMgr.Instance().roomLv  );
        pbData.setGameInfo( gameInfoPB );
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req,pbData,"msg_prepare_game_req", true);

        var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        if(play_list) {
            for(var i=0; i< play_list.player_ui_arr.length; ++i){
                var headinfo = play_list.player_ui_arr[i];
                if(headinfo && headinfo.head.player && headinfo.head.player.userId != cc.dd.user.id){
                    headinfo.head.node.active = false;
                }else{
                    headinfo.head.read.active = true;
                }
            }
        }
    },
    py_ready:function () {
        cc.dd.mj_game_start = true;

        var msg = new cc.pb.jilinmajiang.p17_req_ready();
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_ready,msg,"p17_req_ready");
    },
    onEventMessage: function (event, data) {
        if(cc.replay_gamedata_scrolling){
            return;
        }
        switch (event) {
            case DeskEvent.INIT:
                this.updateDesk();
                break;
            case DeskEvent.CHANGE_ROOM:
                this.change_room();
                break;
            case DeskEvent.JBC_READY:
                this.jbc_ready();
                break;
            case DeskEvent.PY_READY:
                this.py_ready();
                break;
            case DeskEvent.JIESUAN:
                this.jiesuan(data);
                break;
            case DeskEvent.CLEAR:
                this.clear(data);
                break;
            case PlayerEvent.READY:
                this.setRead(data[0].userId);
                break;
            case DeskEvent.START:
                this.hideDeskReady();
                break;
            case DeskEvent.LEAVE_TIPS:  //解散提示
                this.setLeaveStatus(data);
                break;
            case DeskEvent.SPONSOR_DISSOLVE_ROOM:
                this.sponsorDissolveRoom(data[0]);
                break;
            case DeskEvent.RESPONSE_DISSOLVE_ROOM:
                this.responseDissolveRoom(data[0]);
                break;
            case DeskEvent.DISSOLVE_ROOM:
                this.dissolveRoom(data);
                break;
            case DeskEvent.EXIT_ROOM:
                this.exitRoom(data);
                break;
            case DeskEvent.RECOVER_DESK:
                this.recoverDesk();
                break;
            case DeskEvent.UPDATE_ROOM_NUM:
                this.updateRoomNum();
                break;
            case DeskEvent.UPDATE_REMAIN_CARD:
                this.updateRemainCard();
                break;
            case DeskEvent.UPDATE_BAO_PAI:
                this.updateBaoPai();
                break;
            case DeskEvent.UPDATE_CURR_ROUND:
                this.updateCurrRound();
                var text = playerMgr.Instance().playerList.length == 2?cc.dd.Text.TEXT_DESK_INFO_7:cc.dd.Text.TEXT_DESK_INFO_1;
                var str = text.format([data[0]]);
                this.showTipsPop(str);
                break;
            case DeskEvent.UPDATE_TOTAL_ROUND:
                this.updateTotalRound();
                break;
            case DeskEvent.LOCK_SCENE:
                this.onLockSceneTouch();
                break;
            case DeskEvent.UNLOCK_SCENE:
                this.onUnlockSceneTouch();
                if(this.locakSceneTimeOut){
                    clearTimeout(this.locakSceneTimeOut);
                    this.locakSceneTimeOut = null;
                }
                break;
            case DeskEvent.SHOW_RESULT_VIEW:
                if(DeskData.Instance().isDajiesuan){
                    if(data && data[0]){
                        this.onShowResultView();
                    }
                }else{
                    this.onShowResultView();
                }
                break;
            case DeskEvent.FEN_ZHANG:
                this.playerFenZhangAni();
                break;
            case DeskEvent.MO_PAI_FEN_ZHANG:
                this.hideFenZhangCard(data);
                break;
            case DeskEvent.NO_MARK_TIPS://没有分数点炮
                this.showNoMarkDianpao();
                break;
            case DeskEvent.TIPS_POP:
                this.showTipsPop(data);
                break;
            case DeskEvent.DESK_FAPAI_ACT:
                this.fapaiStep(data[0], data[1]);
                break;
            case DeskEvent.CHANGE_DESK_IMAGE:
                this.changeDeskImage(data);
                break;
            case DeskEvent.CLOSE_LEAVE_TIPS:
                this.closePopupView();
                break;
            case DeskEvent.UPDATE_PLAYER_NUM:
                this.updatePlayerNum(data);
                break;
            case DeskEvent.SHOW_DA_PAI_PROMPT://更新三色以及手把一提示
                this.on_show_da_pai_prompt(data);
                break;
            case DeskEvent.CANCEL_EMIT:
                this.stopFaPai();
                break;
            case DeskEvent.RECTCONNECT:
                this.restConnect();
                DeskED.notifyEvent(DeskEvent.CANCEL_EMIT,[]);//取消已选的操作 如；杠 听
                break;
            case DeskEvent.GAME_OPENING:
                this.onGameOpening( false );
                break;
            case Hall.HallEvent.ACTIVE_PROPITEM_GET:
                cc.dd.UIMgr.openUI("gameyj_hall/prefabs/klb_hall_Active_Award", function(prefab){
                    var component = prefab.getComponent('klb_hall_daily_lottery_get_award');
                    component.setAwradData(data.value);
                }.bind(this));
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.update_hall_data( data[0] );
                break;
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                this.hallUpdateCoin();
                break;
            case RoomEvent.on_room_leave:
                this.on_room_leave( data[0] );
                break;
            case RoomEvent.on_room_ready:
                this.on_room_ready( data[0] );
                break;
            case DeskEvent.FAPAI:
                let ani = this.use2D ? "jlmj_fapai_ani_2d" : "jlmj_fapai_ani";

                this.ani_fapai.play(ani);
                this.ani_fapai.setCurrentTime(0, ani);
                this.db_duiju.node.active = true;
                this.db_duiju.playAnimation("DJKS",1);
                this.db_duiju.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayDuiJuAniEnd, this);
                this.db_duiju.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayDuiJuAniEnd, this);
                break;
            case DeskEvent.OPEN_BAO_PAI:
                this.openBaoPai();
                break;
            case DeskEvent.HUANG_ZHUANG_ANI:
                this.onPlayerHuangZhuangAniBegin();
                break;
            case RoomEvent.on_room_enter:
                this.recoverDesk();
                break;
            case DeskEvent.TIMEUP:
                if(!this._jiesuan){
                    this.time_up_id = AudioManager.playSound(jlmj_audio_path.TIMEUP);
                }
                break;
            case DeskEvent.STOP_TIMEUP:
                if(this.time_up_id){
                    AudioManager.stopSound(this.time_up_id);
                    this.time_up_id = null;
                }
                break;
            case HallCommonEvent.LUCKY_STOP_TIMER:
                if(this._jiesuan){
                    this._jiesuan.stopTime();
                }
                break;
            case HallCommonEvent.LUCKY_RESUME_TIMER:
                if(this._jiesuan){
                    this._jiesuan.startTime(this._jiesuan._daojishiNum);
                }
                break;
            case SysEvent.PAUSE:
                cc.log("SysEvent.PAUSE 吉林麻将: 游戏切后台");
                // AudioManager.stopMusic();
                DeskED.notifyEvent(DeskEvent.CANCEL_EMIT,[]);//取消已选的操作 如；杠 听
                this.onLockSceneTouch();
                break;
            case SysEvent.RESUME:
                cc.log("SysEvent.PAUSE 吉林麻将: 恢复游戏");
                // AudioManager.rePlayMusic();
                this.locakSceneTimeOut = setTimeout(()=>{
                    this.onUnlockSceneTouch();
                    this.locakSceneTimeOut = null;
                }, 500);
                break;
            case DeskEvent.CHANGE_2D:
                this.change2D();
                break;
            case DeskEvent.HU:
                this.huAni(data[0]);
                break;
            default:
                break;
        }
    },

    change2D(){
        if(cc.dd.mj_game_start){
            cc.dd.mj_change_2d_next_time = true;
            cc.dd.PromptBoxUtil.show('游戏已开始，将在下一局切换');
            return;
        }

        this._change2D();
    },

    _change2D(){
        this.use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';

        this.initZhuoBu();

        let zhinanIsActive = this.zhinan.active;
        if(this.use2D){
            this.zhinan = this._zhinan_2d;
            this._zhinan.active = false;
            this._zhinan_2d.active = zhinanIsActive;
        }else{
            this.zhinan = this._zhinan;
            this._zhinan.active = zhinanIsActive;
            this._zhinan_2d.active = false;
        }

        this.initZhiNan();

        if(!RoomMgr.Instance().player_mgr || !DeskData.Instance().isFriend()){
        }else{
            this.zhinan.getComponent("jlmj_zhinan_ui").initDirection();
        }

        cc.find("Canvas/desk_node/jlmj_player_left_ui").getComponent('jlmj_player_left_ui').resetConfig();
        cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('jlmj_player_down_ui').resetConfig();
        cc.find("Canvas/desk_node/jlmj_player_right_ui").getComponent('jlmj_player_right_ui').resetConfig();
        cc.find("Canvas/desk_node/jlmj_player_up_ui").getComponent('jlmj_player_up_ui').resetConfig();
    },

    huAni(data){
        let delaytime = 2000;
        let huType = data;
        let huID = null;
        let func = ()=>{
            huID = null;
            if(huType.length > 0){
                huID = this.getHuAni(huType.pop());
                if(!cc.dd._.isNull(huID)){
                    this.playSpine(huID[0], huID[1], ()=>{
                        playerMgr.Instance().playing_special_hu -= delaytime;

                        if(playerMgr.Instance().playing_special_hu < 0){
                            playerMgr.Instance().playing_special_hu = 0;
                        }
                        func();
                    })
                }else{
                    func();
                }
            }else{
                playerMgr.Instance().playing_special_hu = 0;
            }
        }

        func();
    },

    getHuAni(id){
        switch(id){
            case HuType.GANG_HUA_HU:
                return [this.gghh_ani, ['gangshanghua']];
            // case HuType.GANG_PAO_HU:
            //     return [this.gghh_ani, ['gangshangpao']];
            // case HuType.HAIDI_LAO:
            //     return [this.gghh_ani, ['haidilao']];
            // case HuType.HAIDI_PAO:
            //     return [this.gghh_ani, ['haidipao']];
            // case -1:
            //     return [this.gghh_ani, ['yipaoshuangxiang']];
            // case -2:
            //     return [this.gghh_ani, ['yipaosanxiang']];
            // case HuType.JIA5_HU:
            //     return [this.gkm_ani, ['guadafeng']];
            // case HuType.DANDIAO_PIAOHU:
            //     return [this.gkm_ani, ['kaipaizha']];
            // case HuType.DANDIAO_PIAOHU:
            //     return [this.jingoushiba_ani, ['jingoudiao']];
            // case HuType.HAO_QI:
            //     return [this.qd_ani, ['haoqidui']];
            // case HuType.HAO_QI:
            //     return [this.qd_ani, ['longqidui']];
            // case HuType.QI_DUI:
            //     return [this.qd_ani, ['qidui']];
            // case -3:
            //     return [this.qd_ani, ['qinglongqidui']];
            // case -4:
            //     return [this.qd_ani, ['qinqidui']];
            case HuType.QI_DUI:
                return [this.qd_ani, ['qixiaodui']];
            default:
                return null;
        }
    },

    playSpine(spine, animList, func){
        if(spine){
            spine.node.active = true;
            for(let i = 0; i < animList.length - 1; i++){
                spine.setMix(animList[i], animList[i+1]);
            }
            let anim = animList.shift();
            spine.setAnimation(0, anim, false);
            spine.setCompleteListener(()=>{
                if(animList.length > 0){
                    anim = animList.shift();
                    spine.setAnimation(0, anim, false);
                }else{
                    spine.node.active = false;
                    if(func){
                        func();
                    }
                }
            });
        }else if(func){
            func();
        }

    },

    setFriendGroupInvite(visible){
        let node = cc.find("Canvas/toppanel/klb_friend_group_invite_btn");
        if(node){
            if(visible){
                node.active = RoomMgr.Instance().isClubRoom();
            }else{
                node.active = false;
            }
        }
    },

    onClickLastJieSuan(){
        jlmj_audio_mgr.com_btn_click();
        DeskED.notifyEvent(DeskEvent.JIESUAN, [this.lastJiesuan, true]);
    },

    setLastJieSuanActive(){
        let laseJiesuan = cc.find("Canvas/toppanel/last_jie_suan");
        if(laseJiesuan){
            laseJiesuan.active = this.lastJiesuan;
        }
    },
});
module.exports = baseDeskInfo;