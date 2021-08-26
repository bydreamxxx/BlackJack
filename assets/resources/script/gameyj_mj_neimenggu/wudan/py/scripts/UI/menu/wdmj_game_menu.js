var dd=cc.dd;

let game_menu = require('base_mj_game_menu');
let menu_type = game_menu.menu_type;
let hupai_type = game_menu.hupai_type;

var cc_GameMenu = cc.Class({
    extends: game_menu.GameMenu,

    buhua: function() {
        var msg = new cc.pb.wudanmj.wudan_req_buhua();

        var buhuaCard = new cc.pb.jilinmajiang.CardInfo();
        buhuaCard.setId(this.require_UserPlayer.buhuaId);
        msg.setCard(buhuaCard);
        cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_buhua,msg,"wudan_req_buhua", true);
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 过牌
     */
    guo: function () {
        let func = ()=>{
            var msg = new cc.pb.wudanmj.wudan_req_game_act_guo();
            msg.setUserid(dd.user.id);
            msg.setGuotype(this.getGuoType());
            cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_game_act_guo,msg,"wudan_req_game_act_guo");
        }

        if(this.require_UserPlayer.canhu){
            cc.dd.DialogBoxUtil.show(0, '确定要放弃胡牌吗', '确定', '取消', ()=>{
                func();
            }, function() { });
        }else{
            func();
        }
    },

    /**
     * 只有一个选项的吃
     */
    chiSingle: function () {
        var msg = new cc.pb.wudanmj.wudan_req_chi();

        var card = new cc.pb.jilinmajiang.CardInfo();
        card.setId(this.require_DeskData.Instance().last_chupai_id);

        var chi_option = this.require_UserPlayer.chi_options[0];
        var card_option = [];
        chi_option.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            card_option.push(card);
        });

        msg.setUserid(dd.user.id);
        msg.setChicard(card);
        msg.setChoosecardsList(card_option);
        cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_chi,msg,"wudan_req_chi");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    chiCallback:function (chiList) {
        var msg = new cc.pb.wudanmj.wudan_req_chi();

        var card = new cc.pb.jilinmajiang.CardInfo();
        card.setId(this.require_DeskData.Instance().last_chupai_id);

        var card_option = [];
        chiList.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            card_option.push(card);
        });

        msg.setUserid(dd.user.id);
        msg.setChicard(card);
        msg.setChoosecardsList(card_option);
        cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_chi,msg,"wudan_req_chi");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 碰牌
     */
    peng: function () {
        var msg = new cc.pb.wudanmj.wudan_req_game_act_peng();
        msg.setUserid(dd.user.id);

        var pengCard = new cc.pb.jilinmajiang.CardInfo();
        pengCard.setId(this.require_DeskData.Instance().last_chupai_id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_game_act_peng,msg,"wudan_req_game_act_peng");
        cc.dd.NetWaitUtil.net_wait_start();
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
            // if(!DeskData.Instance().hasRemainPai() || UserPlayer.cangangmopai){
            //     for(var i=0; i<gangOptionList.length; ++i){
            //         var newGangOption = [];
            //         for(var j=0; j<gangOptionList[i].length; ++j){
            //             if(gangOptionList[i][j].length == 3){
            //                 newGangOption.push(gangOptionList[i][j]);
            //             }
            //         }
            //         if(newGangOption.length>0){
            //             newGangOptionList.push(newGangOption);
            //         }
            //     }
            //
            //     cc.log('杠牌选项');
            //     cc.log(newGangOptionList);
            //
            //     if(newGangOptionList.length == 1 && newGangOptionList[0].length == 1){
            //         this.onSeclectedGang( newGangOptionList[0][0] );
            //     }else {
            //         // this.interactable = false;
            //         DeskED.notifyEvent(DeskEvent.OPEN_GANG,[newGangOptionList, this.onSeclectedGang.bind(this)]);
            //     }
            // }else{
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
                    // this.interactable = false;
                    this.require_DeskED.notifyEvent(this.require_DeskEvent.OPEN_GANG,[gangOptionList, this.onSeclectedGang.bind(this)]);
                }
            // }
        }
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //取消已经选择的牌
        //DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);//关闭menu
    },

    /**
     * 听
     */
    ting: function () {
        this._super();
        this.require_UserPlayer.canhu = 0;
    },

    /**
     * 胡
     */
    hupai: function () {
        var msg = new cc.pb.wudanmj.wudan_req_game_act_hu();
        msg.setUserid(dd.user.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_game_act_hu,msg,"wudan_req_game_act_hu");
    },

    /**
     * 确认回调
     * @param data {type, cardList}
     */
    okBtnCallBack:function (data) {
        cc.log('【确认按钮】操作',data.type);
        if(data.type == menu_type.TING){//听牌
            var msg = new cc.pb.wudanmj.wudan_req_tingpai_out_card();
            msg.setCardid(data.data[0]);
            msg.setTingtype( 1 );
            cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_tingpai_out_card,msg,"wudan_req_tingpai_out_card");
        }else{//杠牌
            data.data.isnewdealstyle = true;//走新杠
            this.sendGangPai(data.data);
        }
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //清除选择数组
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);//关闭menu
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK,[this.require_UserPlayer, false, null, 1]);
    },

    /**
     * 杠牌发送
     * @param gang_option {cardList, isnewdealstyle, centerId}
     */
    sendGangPai:function (gang_option) {
        var msg = new cc.pb.wudanmj.wudan_req_game_act_gang();

        msg.setIsnewdealstyle(gang_option.isnewdealstyle);
        var cards = [];
        gang_option.cardList.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            cards.push(card);
        });
        msg.setUserid(dd.user.id);
        msg.setChoosecardsList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_game_act_gang,msg,"wudan_req_game_act_gang");
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
        var msg = new cc.pb.wudanmj.wudan_req_tingpai_out_card();
        msg.setCardid( playCardId );
        msg.setTingtype( tingType );
        cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_tingpai_out_card,msg,"wudan_req_tingpai_out_card");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    initMJComponet(){
        return require("mjComponentValue").wdmj;
    }
});

module.exports = {
    GameMenu:cc_GameMenu,
    menu_type:menu_type,
    hupai_type:hupai_type,
};
