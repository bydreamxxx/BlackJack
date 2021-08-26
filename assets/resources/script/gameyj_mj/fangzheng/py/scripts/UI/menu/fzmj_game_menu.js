var dd=cc.dd;

let game_menu = require('base_mj_game_menu');
let menu_type = game_menu.menu_type;
let hupai_type = game_menu.hupai_type;

var sh_GameMenu = cc.Class({
    extends: game_menu.GameMenu,

    /**
     * 过牌
     */
    guo: function () {
        var msg = new cc.pb.fangzhengmj.fangzheng_req_game_act_guo();
        msg.setUserid(dd.user.id);
        msg.setGuotype(this.getGuoType());
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_game_act_guo,msg,"fangzheng_req_game_act_guo");
    },

    /**
     * 只有一个选项的吃
     */
    chiSingle: function () {
        //只有一个吃，直接吃
        var msg = new cc.pb.fangzhengmj.fangzheng_req_chi();

        var card = new cc.pb.jilinmajiang.CardInfo();
        card.setId(this.require_UserPlayer.chi_pai);

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
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_chi,msg,"fangzheng_req_chi");
        cc.dd.NetWaitUtil.net_wait_start();

    },


    gangTingCallNet(){
        var gangOption = this.require_UserPlayer.gang_options;
        var msg = new cc.pb.fangzhengmj.fangzheng_req_gangting();
        var cards = [];
        gangOption.cardList.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            cards.push(card);
        });
        msg.setChoosecardsList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_gangting, msg, "fangzheng_req_gangting");
    },

    chiCallback:function (chiList) {
        if(this.require_UserPlayer.isTempChiTing){
            chiList.forEach(function (id) {
                this.require_UserPlayer.chitingPaiId = id;
            });
        }else{
            var msg = new cc.pb.fangzhengmj.fangzheng_req_chi();

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
            cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_chi,msg,"fangzheng_req_chi");
            cc.dd.NetWaitUtil.net_wait_start();
        }
    },

    /**
     * 碰牌
     */
    peng: function () {
        var msg = new cc.pb.fangzhengmj.fangzheng_req_game_act_peng();
        msg.setUserid(dd.user.id);

        var pengCard = new cc.pb.jilinmajiang.CardInfo();
        pengCard.setId(this.require_DeskData.Instance().last_chupai_id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_game_act_peng,msg,"fangzheng_req_game_act_peng");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 胡
     */
    hupai: function () {
        var msg = new cc.pb.fangzhengmj.fangzheng_req_game_act_hu();
        msg.setUserid(dd.user.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_game_act_hu,msg,"fangzheng_req_game_act_hu");
    },

    /**
     * 确认回调
     * @param data {type, cardList}
     */
    okBtnCallBack:function (data) {
        cc.log('【确认按钮】操作',data.type);
        if(data.type == menu_type.TING){//听牌
            var msg = new cc.pb.fangzhengmj.fangzheng_req_tingpai_out_card();
            msg.setCardid(data.data[0]);
            msg.setTingtype( 1 );
            cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_tingpai_out_card,msg,"fangzheng_req_tingpai_out_card");
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
        var msg = new cc.pb.fangzhengmj.fangzheng_req_game_act_gang();

        msg.setIsnewdealstyle(gang_option.isnewdealstyle);
        var cards = [];
        gang_option.cardList.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            cards.push(card);
        });
        msg.setUserid(dd.user.id);
        msg.setChoosecardsList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_game_act_gang,msg,"fangzheng_req_game_act_gang");
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
        var msg = new cc.pb.fangzhengmj.fangzheng_req_tingpai_out_card();
        msg.setCardid( playCardId );
        msg.setTingtype( tingType );
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_tingpai_out_card,msg,"fangzheng_req_tingpai_out_card");
    },

    liangzhangbao:function(){
        let list = this.require_UserPlayer.getPair();
        if(list.length == 0){
            return;
        }else if(list.length == 1){
            let card = [];
            for(let i = 0; i < list[0].length; i++){
                var _card = new cc.pb.jilinmajiang.CardInfo();
                _card.setId(list[0][i]);
                card.push(_card)
            }
            this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);
            this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //清除选择数组
            var msg = new cc.pb.fangzhengmj.fangzheng_req_liangzhang();
            msg.setUserid( cc.dd.user.id );
            msg.setCardsList( card );
            cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_liangzhang,msg,"fangzheng_req_liangzhang", true);
            return;
        }

        this.require_DeskED.notifyEvent(this.require_DeskEvent.OPEN_BAO_OPTION,[list, (liangID)=>{
            if(cc.dd._.isArray(liangID)){
                let card = [];
                for(let i = 0; i < liangID.length; i++){
                    var _card = new cc.pb.jilinmajiang.CardInfo();
                    _card.setId(liangID[i]);
                    card.push(_card)
                }
                this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);
                this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //清除选择数组
                var msg = new cc.pb.fangzhengmj.fangzheng_req_liangzhang();
                msg.setUserid( cc.dd.user.id );
                msg.setCardsList( card );
                cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_liangzhang,msg,"fangzheng_req_liangzhang", true);
            }
        }]);
    },

    liangxi: function(){
        let gang_option = this.require_UserPlayer.xiList;
        if(gang_option){
            if(gang_option.cardList.length == 3){
                this.sendGangPai(gang_option);
                this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //取消已经选择的牌
            }else if(this.require_UserPlayer.checkXi(gang_option.xi_cardList)){
                gang_option.cardList = gang_option.xi_cardList;
                this.sendGangPai(gang_option);
                this.require_PlayerED.notifyEvent(this.require_PlayerEvent.CLEA_SELECT_CARD,[this.require_UserPlayer]); //取消已经选择的牌
            }else{
                cc.dd.PromptBoxUtil.show("不是正确的亮喜类型");
            }
        }
    },

    initMJComponet(){
        return require("mjComponentValue").fzmj;
    }
});

module.exports = {
    GameMenu:sh_GameMenu,
    menu_type:menu_type,
    hupai_type:hupai_type,
};
