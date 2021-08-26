var dd=cc.dd;
let mjComponentValue = null;

let game_menu = require('base_mj_game_menu');
let menu_type = game_menu.menu_type;
let hupai_type = game_menu.hupai_type;
var RoomMgr = require("jlmj_room_mgr").RoomMgr;

var sh_GameMenu = cc.Class({
    extends: game_menu.GameMenu,

    ctor() {
        mjComponentValue = this.initMJComponet();
    },

    guo: function () {
        if(this.require_UserPlayer.canhu) {
            cc.dd.DialogBoxUtil.show(0, '确定要放弃胡牌吗', '确定', '取消', () => {
                this.guoCall();
            }, function () {
            });
        }else if(this.require_UserPlayer.cangang || this.require_UserPlayer.canbugang){
            cc.dd.DialogBoxUtil.show(0, '确定要放弃杠吗', '确定', '取消', () => {
                this.guoCall();
            }, function () {
            });
        }else{
            this.guoCall();
        }
    },

    /**
     * 听
     */
    ting: function () {
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);
        this.require_UserPlayer.isTempBaoTing = true;
        var arr = [];
        if( this.isGangTing() ) {
            var gangList = this.getGangList();
            var menuState = {};
            menuState.canchi = false;
            menuState.canpeng = false;
            menuState.cangang = true;
            menuState.canbugang = this.require_UserPlayer.canbugang;
            menuState.canhu = false;
            menuState.canting = false;
            menuState.gangcards = {};
            menuState.gangcards.gangcardList = gangList;
            menuState.gangcards.isnewdealstyle = true;
            this.require_UserPlayer.setCpgth( menuState, true );
            cc.find("Canvas/game_menu_list").getComponent(mjComponentValue.gameMenuList).setMenus(this.require_UserPlayer, this.require_UserPlayer.jiaoInfo_list[0].out_id == -1);
            // 菜单显示 延迟到摸牌后
            // PlayerED.notifyEvent(PlayerEvent.CAOZUO,[UserPlayer, true]);

            // arr = this.getGangList();
        }
        var list = this.require_UserPlayer.jiaoInfo_list;
        for(var i=0; i<list.length; ++i ){

            let canpush = false;
            if(RoomMgr.Instance()._Rule.usercountlimit == 4){
                for(let j = 0; j < list[i].jiao_pai_list.length; j++){
                    if(list[i].jiao_pai_list[j].hutypesList.length > 0){
                        canpush = true;
                        break;
                    }
                }
            }else{
                canpush = true;
            }
            if(canpush){
                arr.push(list[i].out_id);
            }
        }

        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //清除选择数组
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK,[this.require_UserPlayer, true, arr, 3]);    //设置可点击的牌
    },

    isGangTing: function() {
        if( this.require_UserPlayer.cangang || this.require_UserPlayer.canbugang ) {
            if( this.require_UserPlayer.isTempBaoTing ) {
                var jiaoList = this.require_UserPlayer.jiaoInfo_list;

                for(let i = 0; i < jiaoList.length; i++){
                    if(jiaoList[i].angang){
                        return true;
                    }
                }

                if(this.require_UserPlayer.canbugang){
                    for (var i = 0; i < jiaoList.length; ++i) {
                        var cardId = jiaoList[i].out_id;
                        if (this.require_analysts.Instance().isBaGang(cardId)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },

    /**
     * 获取杠听列表
     */
    getGangList: function() {
        var tingList = this.require_UserPlayer.jiaoInfo_list;

        var gangList = [];

        for(let i = 0; i < tingList.length; i++){
            if(tingList[i].angang){
                for(let j = 0; j < tingList[i].tingGangCardsList.length; j++){
                    if(!gangList.find((item)=>{
                        return item.id == tingList[i].tingGangCardsList[j].id;
                    })){
                        gangList.push(tingList[i].tingGangCardsList[j]);
                    }
                }
            }
        }
        if(this.require_UserPlayer.canbugang) {
            for (var i = 0; i < tingList.length; ++i) {
                var cardId = tingList[i].out_id;
                if (this.require_analysts.Instance().isBaGang(cardId)) {
                    gangList.push({id: cardId});
                }
            }
        }
        return gangList;
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

            cc.log('杠牌选项');
            cc.log(gangOptionList);

            if(gangOptionList.length == 1 && gangOptionList[0].length == 1){
                if( isGangTing  && this.require_UserPlayer.isTempGang && gangOptionList[0][0].length == 4) {
                    var tingType = 3;
                    this.require_UserPlayer.getTingGangJiaoInfo(gangOptionList[0][0][0]);
                    this.sendTingPai(gangOptionList[0][0][0], tingType, gangOptionList[0][0]);
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
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //取消已经选择的牌
        //this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);//关闭menu
    },

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
            this.sendTingPai(selectedList[0], tingType, selectedList);
        } else{
            this.sendGangPai( gangOption );
        }
        this.interactable = true;
        this.require_controlCombination.Instance().onCloseCombinationUi();
    },

    sendTingPai: function( playCardId, tingType, gangList ) {
        if( playCardId < 0 ) {
            cc.error( "听后出的牌为空" );
            return ;
        }

        let func = (ting)=> {
            var msg = new cc.pb.mjcommon.mj_req_tingpai_out_card();
            msg.setCardid(playCardId);
            msg.setTingtype(tingType);
            if (tingType == 3) {
                msg.setTinggangpaiidsList(gangList);
            }
            msg.setDdsjcardid(cc.dd._.isNumber(ting) ? ting : -1);
            msg.setLzbcardid(-1);
            cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_tingpai_out_card, msg, "mj_req_tingpai_out_card");
            cc.dd.NetWaitUtil.net_wait_start();
        }

        var jiaoInfo = this.require_UserPlayer.getGangJiaoInfo(playCardId, tingType, gangList);
        if (jiaoInfo && jiaoInfo.jiao_pai_list && jiaoInfo.jiao_pai_list.length > 0) {
            let templist = {};
            let fancount = 0;
            let default_fan = -1;
            for(let i = 0; i < jiaoInfo.jiao_pai_list.length; i++){
                let jiaopaiinfo = jiaoInfo.jiao_pai_list[i];

                let cnt = jiaopaiinfo.cnt >> 16;

                if(!templist.hasOwnProperty(cnt)){
                    templist[cnt] = {
                        hutype: jiaopaiinfo.hutypesList,
                        idList: []
                    };
                    fancount++;
                    default_fan = cnt;
                }

                templist[cnt].idList.push(jiaopaiinfo.id);
            }

            if(fancount > 1){
                let prefab = require('jlmj_prefab_cfg');
                cc.dd.UIMgr.openUI(prefab.MJ_TINGPAI_INFO, function (ui) {
                    var mj_jiao_info = ui.getComponent('mj_tingInfo_ui');
                    mj_jiao_info.initUI(templist, func);
                }.bind(this));
            }else{
                func(default_fan);
            }
        }else{
            func();
        }
    },

    initMJComponet(){
        return require("mjComponentValue").hlmj;
    }
});

module.exports = {
    GameMenu:sh_GameMenu,
    menu_type:menu_type,
    hupai_type:hupai_type,
};
