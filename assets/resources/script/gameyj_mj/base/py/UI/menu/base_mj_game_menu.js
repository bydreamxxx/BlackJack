//每个麻将都要改写这个
let mjComponentValue = null;

var menu_type = cc.Enum({
    CHI:    0,
    PENG:   1,
    GANG:   2,
    TING:   3,
    HU:     4,
    GUO:    5,
    MOBAO:  6,
    DUIBAO: 7,
    ZIMO:   8,
    // OK:     9,
    // CLEAN:  10,
    GU:     9,
    XIAOSA:10,
    CHITING:11,
    GUO_2:    12,
    PENGTING:13,
    GANGTING:14,
    DUI_DAO_SUAN_JIA:15,
    LIANG_ZHANG_BAO:16,
    MEN_TING:17,
    LIANG_XI:18,
    BU_HUA:19,
});

var hupai_type = cc.Enum({
    CAN_HU_TRUE_NORMAL : 1,  //普通胡
    CAN_HU_TRUE_DUIBAO : 2,  //对宝胡
    CAN_HU_TRUE_MOBAO  : 3,  //摸宝胡
});
//var menu_cfg = [
//    { spriteFrame:"zn_chi_1",    desc:"吃" },
//    { spriteFrame:"zn_peng_1",   desc:"碰" },
//    { spriteFrame:"zn_gang_1",   desc:"杠" },
//    { spriteFrame:"zn_ting_1",   desc:"听" },
//    { spriteFrame:"zn_hu_1",     desc:"胡" },
//    { spriteFrame:"zn_guo_1",    desc:"过" },
//    { spriteFrame:"zn_queding_1", desc:"确认" },
//    { spriteFrame:"zn_quxiao_1", desc:"取消" },
//];


var menu_cfg = [
    { txtFrame:0,    bgFrame:1,    desc:"吃" },
    { txtFrame:1,    bgFrame:1,    desc:"碰" },
    { txtFrame:2,    bgFrame:1,    desc:"杠" },
    { txtFrame:3,    bgFrame:1,    desc:"听" },
    { txtFrame:4,    bgFrame:0,    desc:"胡" },
    { txtFrame:5,    bgFrame:2,    desc:"过" },
    { txtFrame:6,    bgFrame:0,    desc:"摸宝" },
    { txtFrame:7,    bgFrame:0,    desc:"对宝" },
    { txtFrame:8,    bgFrame:0,    desc:"自摸" },
    //{ bgFrame:"zn_queding_1", desc:"确认" },
    //{ bgFrame:"zn_quxiao_1", desc:"取消" },
    { txtFrame:9,    bgFrame:1,    desc:"估" },
    { txtFrame:10,    bgFrame:1,    desc:"潇洒" },
    { txtFrame:11,   bgFrame:1,    desc:"吃听" },
    { txtFrame:12,   bgFrame:2,    desc:"过" },
    { txtFrame:13,   bgFrame:1,    desc:"碰听" },
    { txtFrame:14,   bgFrame:1,    desc:"杠听" },
    { txtFrame:15,   bgFrame:1,    desc:"对倒算夹" },
    { txtFrame:16,   bgFrame:1,    desc:"亮掌宝" },
    { txtFrame:17,   bgFrame:1,    desc:"闷听" },
    { txtFrame:18,   bgFrame:1,    desc:"亮喜" },
    { txtFrame:19,   bgFrame:1,    desc:"补花" },
];

var GameMenu = cc.Class({
    extends: cc.Component,

    properties: {
        menu: { default:null, type:cc.Sprite, tooltip: "菜单" },
        menutxt: { default:null, type:cc.Sprite, tooltip: "菜单txt" },
        /**
         * 菜单类型
         */
        _type: 4,//默认是胡牌按钮减少资源重新载入
        type: {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
                if(menu_cfg[this._type])
                {
                    this.menutxt.spriteFrame = this.node.getComponent('mj_game_menu_type_list').menutxtFrame[menu_cfg[this._type].txtFrame];

                    if(menu_cfg[this._type].txtFrame == 5){
                        this.menutxt.node.scaleX = 0.8;
                        this.menutxt.node.scaleY = 0.8;
                    }else{
                        this.menutxt.node.scaleX = 1;
                        this.menutxt.node.scaleY = 1;
                    }
                }
            }
        },

        _isEnable: true,
        isEnable: {
            get: function() {
                return this._isEnable;
            },
            set: function(value) {
                this._isEnable = value;
            }
        },

        _interactable:true,
        interactable:{
            get(){
                return this._interactable;
            },
            set(value){
                this._interactable = value;
                this.menu.node.getComponent(cc.Button).interactable = value;
                if(value){

                    this.menu.node.color = cc.Color.WHITE;
                    this.menutxt.node.color = cc.Color.WHITE;
                }else{

                    this.menu.node.color = cc.Color.GRAY;
                    this.menutxt.node.color = cc.Color.GRAY;
                }
            }
        }
    },

    ctor(){
        mjComponentValue = this.initMJComponet();

        let _deskData = require(mjComponentValue.deskData);

        this.require_DeskData = _deskData.DeskData;
        this.require_DeskED = _deskData.DeskED;
        this.require_DeskEvent = _deskData.DeskEvent;

        this.require_UserPlayer = require(mjComponentValue.userData).Instance();

        let _playerData = require(mjComponentValue.playerData);

        this.require_PlayerED = _playerData.PlayerED;
        this.require_PlayerEvent = _playerData.PlayerEvent;

        this.require_analysts = require(mjComponentValue.paiAnalysts);

        this.require_controlCombination = require( mjComponentValue.controlCombination );
    },

    // use this for initialization
    onLoad: function () {

    },

    onClickMenu: function (event,custom) {
        if (event.type != "touchend"){
            return;
        }

        if( !this.isEnable ) {
            // this.scheduleOnce(function () {
            //     this.isEnable = true;
            // }, 0.3);
            return;
        }

        cc.log("【UI】"+"菜单操作:"+menu_cfg[this.type].desc);
        this.isEnable = false;
        this.scheduleOnce(function () {
            this.isEnable = true;
        }, 0.5);
        switch (this.type){
            case menu_type.CHI:
                this.chi();
                break;
            case menu_type.PENG:
                this.peng();
                break;
            case menu_type.GANG:
                this.gang();
                break;
            case menu_type.TING:
            case menu_type.MEN_TING:
                this.ting();
                break;
            case menu_type.HU:
                this.hupai();
                break;
            case menu_type.GUO:
                this.guo();
                break;
            case menu_type.MOBAO:
                this.hupai();
                break;
            case menu_type.DUIBAO:
                this.hupai();
                break;
            case menu_type.ZIMO:
                this.hupai();
                break;
            // case menu_type.OK:
            //     var cardList = event.target.parent._Btn_customEventData;
            //     this.okBtnCallBack(cardList);
            //     break;
            // case menu_type.CLEAN:
            //     this.cleanBtnCallBack();
            //     break;
            case menu_type.GUO_2:
                this.guo_2();
                break;
            case menu_type.XIAOSA:
                this.xiaosa();
                break;
            case menu_type.CHITING:
                this.chiting();
                break;
            case menu_type.PENGTING:
                this.pengting();
                break;
            case menu_type.GANGTING:
                this.gangting();
                break;
            case menu_type.DUI_DAO_SUAN_JIA:
                this.duidaosuanjia();
                break;
            case menu_type.LIANG_ZHANG_BAO:
                this.liangzhangbao();
                break;
            case menu_type.LIANG_XI:
                this.liangxi();
                break;
            case menu_type.BU_HUA:
                this.buhua();
                break;
            default:
                break;
        }
    },

    getGuoType(){
        let guoType = 0
        if(this.require_UserPlayer.canchi){
            guoType = guoType | 1;
        }
        if(this.require_UserPlayer.canpeng){
            guoType = guoType | 2;
        }
        if(this.require_UserPlayer.canbugang){//补杠
            guoType = guoType | 4;
        }
        if(this.require_UserPlayer.cangang && !this.require_UserPlayer.hasMoPai()){//点杠
            guoType = guoType | 8;
        }
        if(this.require_UserPlayer.cangang && this.require_UserPlayer.hasMoPai() && !this.require_UserPlayer.canbugang){//暗杠
            guoType = guoType | 16;
        }
        if(this.require_UserPlayer.canliangxi){
            guoType = guoType | 32;
        }
        if(this.require_UserPlayer.canhu){
            guoType = guoType | 64;
        }
        if(this.require_UserPlayer.canting){
            guoType = guoType | 128;
        }
        if(this.require_UserPlayer.canchiting){
            guoType = guoType | 256;
        }
        if(this.require_UserPlayer.canpengting){
            guoType = guoType | 512;
        }
        if(this.require_UserPlayer.cangangting){
            guoType = guoType | 1024;
        }
        if(this.require_UserPlayer.cangu){
            guoType = guoType | 2048;
        }
        if(this.require_UserPlayer.canliangzhang){
            guoType = guoType | 4096;
        }

        return guoType;
    },

    /**
     * 吃牌
     */
    chi: function () {
        if(this.require_UserPlayer.chi_options.length <= 0){
            cc.error("无吃牌选项数据");
            return;
        }

        if(this.require_UserPlayer.chi_options.length == 1){
            //只有一个吃，直接吃
            this.chiSingle();
        }else{
            //有多个吃，展开吃选项
            this.require_DeskED.notifyEvent(this.require_DeskEvent.OPEN_CHI,[this.require_UserPlayer,this.chiCallback.bind(this)]);
            //this.openChiOptions(this.require_UserPlayer.chi_options);
        }
    },

    /*openChiOptions : function (chioptions) {
        this.closeChiOptions();
        var self = this;
        cc.dd.UIMgr.openUI('gameyj_mj_common/prefabs/mj_chi', function(prefab){
            self.chi_ui = prefab;
            prefab.getComponent('mj_chi').setChiNode(chioptions, this.chiCallback.bind(this))
        }.bind(this));
    },   */

    /**
     * 关闭吃选项
     */
    /*closeChiOptions: function () {
        if(this.chi_ui){
            this.chi_ui.getComponent('mj_chi').close();
        }
    },    */

    /**
     * 选中后的杠牌回调
     * @param selectedList
     */
    onSeclectedGang: function ( selectedList ) {
        var isGangTing = this.isGangTing();
        var gangOption = this.require_UserPlayer.gang_options;
        gangOption.cardList = selectedList;
        if( isGangTing ) {
            var tingType = 1;
            if( this.require_UserPlayer.isTempGang ){
                tingType = 2;
            }
            if(selectedList.length >= 4){
                tingType = 3;
                this.require_UserPlayer.getTingGangJiaoInfo(selectedList[0]);
            }
            else{
                this.require_UserPlayer.setJiaoInfo(selectedList[0]);
            }
            this.sendTingPai(selectedList[0], tingType);
        } else{
            this.sendGangPai( gangOption );
        }
        this.interactable = true;
        this.require_controlCombination.Instance().onCloseCombinationUi();
    },

    /**
     * 杠牌
     */
    gang: function () {

        var isGangTing = this.isGangTing();
        var gangOption = this.require_UserPlayer.gang_options;

        if( isGangTing ) {
            this.require_UserPlayer.isTempGang = true;
            this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK,[this.require_UserPlayer, false, null, 1]);    //取消牌的 不可点击 或者说是 切换出牌模式
        }

        if( gangOption.cardList.length == 1 ) {
            if( isGangTing ) {
                var tingType = 1;
                if( this.require_UserPlayer.isTempGang ) {
                    tingType = 2;
                }
                this.require_UserPlayer.setJiaoInfo(gangOption.cardList[0]);
                this.sendTingPai(gangOption.cardList[0], tingType);
            } else {
                this.sendGangPai( gangOption );
            }
        } else if( gangOption.cardList.length > 1 ) {
            var gangOptionList = [];
            var gangOptionList1 = [];
            // 是否听后的杠
            if( isGangTing ) {
                for( var i = 0; i < gangOption.cardList.length; ++i ) {
                    gangOptionList1.push( gangOption.cardList[i] );
                }
                this.require_controlCombination.Instance().getAllCombinationList( gangOptionList1, gangOptionList,true);

            } else {
                this.require_controlCombination.Instance().getAllCombinationList( gangOption.cardList, gangOptionList,false);
            }

            //桌子上无牌时,只能杠3张牌,其他杠不能杠
            var newGangOptionList = [];
            if(!this.require_DeskData.Instance().hasRemainPai() || this.require_UserPlayer.cangangmopai){
                for(var i=0; i<gangOptionList.length; ++i){
                    var newGangOption = [];
                    for(var j=0; j<gangOptionList[i].length; ++j){
                        if(gangOptionList[i][j].length == 3){
                            newGangOption.push(gangOptionList[i][j]);
                        }
                    }
                    if(newGangOption.length>0){
                        newGangOptionList.push(newGangOption);
                    }
                }

                cc.log('杠牌选项');
                cc.log(newGangOptionList);

                if(newGangOptionList.length == 1 && newGangOptionList[0].length == 1){
                    this.onSeclectedGang( newGangOptionList[0][0] );
                }else {
                    //this.require_controlCombination.Instance().onOpenCombinationUi(newGangOptionList, this.onSeclectedGang.bind(this));
                    // this.interactable = false;
                    this.require_DeskED.notifyEvent(this.require_DeskEvent.OPEN_GANG, [newGangOptionList, this.onSeclectedGang.bind(this)]);
                }
            }else{
                cc.log('杠牌选项');
                cc.log(gangOptionList);

                if(gangOptionList.length == 1 && gangOptionList[0].length == 1){
                    if( isGangTing  && this.require_UserPlayer.isTempGang && gangOptionList[0][0].length == 4) {
                        var tingType = 3;
                        this.require_UserPlayer.getTingGangJiaoInfo(gangOptionList[0][0][0]);
                        this.sendTingPai(gangOptionList[0][0][0], tingType);
                    }
                    else{
                        this.onSeclectedGang( gangOptionList[0][0] );
                    }
                }else {
                    //this.require_controlCombination.Instance().onOpenCombinationUi(gangOptionList, this.onSeclectedGang.bind(this));
                    // this.interactable = false;
                    this.require_DeskED.notifyEvent(this.require_DeskEvent.OPEN_GANG, [gangOptionList, this.onSeclectedGang.bind(this)]);
                }
            }
        }
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //取消已经选择的牌
        //this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);//关闭menu
    },

    /**
     * 获取杠听列表
     */
    getGangList: function() {
        var tingList = this.require_UserPlayer.jiaoInfo_list;

        var gangList = [];
        var angangList = [];
        if(tingList.length >= 4){
            for(var i in tingList){
                var pai_id = tingList[i].out_id;
                gangList.push(pai_id);
                angangList[pai_id] = tingList[i].angang;
            }
            var gangOptionList = [];
            var havexiaoji = this.require_DeskData.Instance().isXiaoJiFeiDan;
            this.require_analysts.Instance().get4GangList(gangList, gangOptionList,havexiaoji);

            for(var i in gangOptionList[0]) {
                var gong = gangOptionList[0][i];
                var gang_ting = [];
                for(var gid = 0; gid < gong.length; ++gid) {
                    var id = gong[gid];
                    gang_ting[gid] = angangList[id];
                }
                if (gang_ting[0] || gang_ting[1] || gang_ting[2] || gang_ting[3]) {
                    gangList.push( {id: gong[0]});
                    gangList.push( {id: gong[1]});
                    gangList.push( {id: gong[2]});
                    gangList.push( {id: gong[3]});
                }
            }
        }
        for( var i = 0; i < tingList.length; ++i ) {
            var cardId = tingList[i].out_id;
            if( this.require_analysts.Instance().isBuGang( cardId, true ) || this.require_analysts.Instance().isBaGang( cardId ) ) {
                gangList.push( {id: cardId});
            }
        }
        return gangList;
    },

    /**
     * 听
     */
    ting: function () {
        this.require_UserPlayer.isTempBaoTing = true;
        var arr = [];
        var list = this.require_UserPlayer.jiaoInfo_list;
        for(var i=0; i<list.length; ++i ){
            arr.push(list[i].out_id);
        }

        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //清除选择数组
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK,[this.require_UserPlayer, true, arr, 3]);    //设置可点击的牌
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

    },

    /**
     * 取消按钮回调
     */
    cleanBtnCallBack:function () {
        this.require_DeskED.notifyEvent(this.require_DeskEvent.SHOW_UP_LISTBTN,[]);
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK,[this.require_UserPlayer, false, null, 1]);    //取消牌的 不可点击 或者说是 切换出牌模式
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //取消已经选择的牌
    },
    /**
     * 确认回调
     * @param data {type, cardList}
     */
    okBtnCallBack:function (data) {
        cc.log('【确认按钮】操作',data.type);
        if(data.type == menu_type.TING){//听牌
            this.sendTingPai(data.data[0], 1);
        }else{//杠牌
            data.data.isnewdealstyle = true;//走新杠
            this.sendGangPai(data.data);
        }
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //清除选择数组
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);//关闭menu
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK,[this.require_UserPlayer, false, null, 1]);
    },

    isGangTing: function() {
        if( this.require_UserPlayer.cangang || this.require_UserPlayer.canbugang ) {
            if( this.require_UserPlayer.isTempBaoTing ) {
                var jiaoList = this.require_UserPlayer.jiaoInfo_list;
                var gangList = [];
                var angangList = [];
                if(jiaoList.length >= 4){
                    for(var i in jiaoList){
                        var pai_id = jiaoList[i].out_id;
                        gangList.push(pai_id);
                        angangList[pai_id] = jiaoList[i].angang;
                    }
                    var gangOptionList = [];
                    var havexiaoji = this.require_DeskData.Instance().isXiaoJiFeiDan;
                    this.require_analysts.Instance().get4GangList(gangList, gangOptionList,havexiaoji);

                    for(var i in gangOptionList[0]) {
                        var gong = gangOptionList[0][i];
                        var gang_ting = [];
                        for(var gid = 0; gid < gong.length; ++gid) {
                            var id = gong[gid];
                            gang_ting[gid] = angangList[id];
                        }
                        if (gang_ting[0] || gang_ting[1] || gang_ting[2] || gang_ting[3]) {
                            return true;
                        }
                    }
                }

                for (var i = 0; i < jiaoList.length; ++i) {
                    var cardId = jiaoList[i].out_id;
                    if (this.require_analysts.Instance().isBuGang(cardId, true ) || this.require_analysts.Instance().isBaGang(cardId)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    chiting: function () {
        // this.require_this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

        if(this.require_UserPlayer.chi_options.length <= 0){
            cc.error("无吃听牌数据");
            return;
        }
        this.require_UserPlayer.isTempChiTing = true;
        this.require_UserPlayer.chitingPaiId = -1;

        let list = []

        for(let i = 0; i < this.require_UserPlayer.chi_jiaoInfo_list.length; i++){
            if(!cc.dd._.isUndefined(this.require_UserPlayer.chi_jiaoInfo_list[i]) && !cc.dd._.isUndefined(this.require_UserPlayer.chi_options[i])){
                list[i] = this.require_UserPlayer.chi_options[i];
                list[i].chiidx = i;
            }
        }

        this.require_UserPlayer.chi_options = list;
        let realLength = 0;
        let realIdx = -1;
        for(let i = 0; i < list.length; i++){
            if(!cc.dd._.isUndefined(list[i])){
                realLength++;
                if(realIdx == -1){
                    realIdx = i;
                }
            }
        }

        if(realLength == 1){
            this.require_UserPlayer.chitingPaiId = this.require_UserPlayer.chi_options[realIdx];
            this.require_UserPlayer.chitingPaiId.idx = 0;
            this.require_UserPlayer.jiaoInfo_list = this.require_UserPlayer.chi_jiaoInfo_list[realIdx];
            this.xiaosaTingCallBack();
        }else{
            //有多个吃，展开吃选项
            this.require_DeskED.notifyEvent(this.require_DeskEvent.OPEN_CHITING,[this.require_UserPlayer, this.chiTingCallback.bind(this)]);
        }
    },

    /**
     * 碰听牌
     */
    pengting: function () {
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

        this.require_UserPlayer.isTempPengTing = true;
        this.require_UserPlayer.pengtingPaiId = this.require_UserPlayer.peng_pai;
        this.xiaosaTingCallBack();
    },

    /**
     * 杠听牌
     */
    gangting: function () {
        this.require_UserPlayer.isTempGangTing = true;

        this.xiaosaTingCallBack();
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //取消已经选择的牌
        //this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);//关闭menu

        this.gangTingCallNet();
    },

    xiaosa: function () {
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);
        this.require_UserPlayer.isTempXiaosa = true;
        this.fun?this.fun():null;
    },

    xiaosaTingCallBack:function (fun) {
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);

        this.require_UserPlayer.isTempBaoTing = true;
        var arr = [];
        var list = this.require_UserPlayer.jiaoInfo_list;
        for(var i=0; i<list.length; ++i ){
            if(this.require_UserPlayer.isTempChiTing){
                arr.push(list[i].out_id);
            }else if(this.require_UserPlayer.isTempPengTing){
                arr.push(list[i].out_id);
            }else if(this.require_UserPlayer.isTempGangTing){
                //PlayerED.notifyEvent(PlayerEvent.CLEA_SELECT_CARD,[UserPlayer]);
                //return;
            }
        }

        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //清除选择数组
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK,[this.require_UserPlayer, true, arr, 3]);    //设置可点击的牌
    },

    chiTingCallback:function (chiList) {
        if(this.require_UserPlayer.isTempChiTing){
            var card_option = [];
            chiList.forEach(function (id) {
                var card = new cc.pb.jilinmajiang.CardInfo();
                card.setId(id);
                card_option.push(card);
            });

            let idx = chiList.hasOwnProperty('chiidx') ? chiList.chiidx : chiList.idx;

            this.require_UserPlayer.chitingPaiId = chiList;
            this.require_UserPlayer.jiaoInfo_list = this.require_UserPlayer.chi_jiaoInfo_list[idx];

            this.xiaosaTingCallBack();
        }
    },

    setclickCallback:function (fun) {
        this.fun = fun;
    },

    /**
     * 过牌
     */
    guo_2: function () {
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);
        this.fun?this.fun():null;
        this.fun = null;
    },

    gangTingCallNet: function(){
        var gangOption = this.require_UserPlayer.gang_options;
        var msg = new cc.pb.mjcommon.mj_req_gangting();
        var cards = [];
        gangOption.cardList.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            cards.push(card);
        });
        msg.setChoosecardsList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_gangting, msg, "mj_req_gangting");
    },
    /**
     * 过牌
     */
    guo: function () {
        this.guoCall();
    },

    guoCall(){
        var msg = new cc.pb.mjcommon.mj_req_game_act_guo();
        msg.setUserid(cc.dd.user.id);
        msg.setGuotype(this.getGuoType());
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_game_act_guo,msg,"mj_req_game_act_guo");
    },

    /**
     * 只有一个选项的吃
     */
    chiSingle: function () {
        var msg = new cc.pb.mjcommon.mj_req_chi();

        var card = new cc.pb.jilinmajiang.CardInfo();
        card.setId(this.require_DeskData.Instance().last_chupai_id);

        var chi_option = this.require_UserPlayer.chi_options[0];
        var card_option = [];
        chi_option.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            card_option.push(card);
        });

        msg.setUserid(cc.dd.user.id);
        msg.setChicard(card);
        msg.setChoosecardsList(card_option);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_chi,msg,"mj_req_chi");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 多个吃牌
     * @param chiList
     */
    chiCallback:function (chiList) {
        var msg = new cc.pb.mjcommon.mj_req_chi();

        var card = new cc.pb.jilinmajiang.CardInfo();
        card.setId(this.require_DeskData.Instance().last_chupai_id);

        var card_option = [];
        chiList.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            card_option.push(card);
        });

        msg.setUserid(cc.dd.user.id);
        msg.setChicard(card);
        msg.setChoosecardsList(card_option);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_chi,msg,"mj_req_chi");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 碰牌
     */
    peng: function () {
        var msg = new cc.pb.mjcommon.mj_req_game_act_peng();
        msg.setUserid(cc.dd.user.id);

        var pengCard = new cc.pb.jilinmajiang.CardInfo();
        pengCard.setId(this.require_DeskData.Instance().last_chupai_id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_game_act_peng,msg,"mj_req_game_act_peng");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 胡
     */
    hupai: function () {
        var msg = new cc.pb.mjcommon.mj_req_game_act_hu();
        msg.setUserid(cc.dd.user.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_game_act_hu,msg,"mj_req_game_act_hu");
    },

    /**
     * 杠牌发送
     * @param gang_option {cardList, isnewdealstyle, centerId}
     */
    sendGangPai:function (gang_option) {
        var msg = new cc.pb.mjcommon.mj_req_game_act_gang();

        msg.setIsnewdealstyle(gang_option.isnewdealstyle);
        var cards = [];
        gang_option.cardList.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            cards.push(card);
        });
        msg.setUserid(cc.dd.user.id);
        msg.setChoosecardsList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_game_act_gang,msg,"mj_req_game_act_gang");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 听牌发送
     * @param playCardId 出牌
     */
    sendTingPai: function( playCardId, tingType ) {
        if( playCardId < 0 ) {
            cc.error( "听后出的牌为空" );
            return ;
        }
        var msg = new cc.pb.mjcommon.mj_req_tingpai_out_card();
        msg.setCardid( playCardId );
        msg.setTingtype( tingType );
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_tingpai_out_card,msg,"mj_req_tingpai_out_card");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 补花
     */
    buhua: function() {
        var msg = new cc.pb.mjcommon.mj_req_buhua();

        var buhuaCard = new cc.pb.jilinmajiang.CardInfo();
        buhuaCard.setId(this.require_UserPlayer.buhuaId);
        msg.setCard(buhuaCard);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_buhua,msg,"mj_req_buhua", true);
        cc.dd.NetWaitUtil.net_wait_start();
    },

    initMJComponet(){
        cc.log("-----------------------no implements base_mj_game_menu initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});

module.exports = {
    GameMenu:GameMenu,
    menu_type:menu_type,
    hupai_type:hupai_type,
};
