var dd=cc.dd;

let game_menu = require('base_mj_game_menu');
let menu_type = game_menu.menu_type;
let hupai_type = game_menu.hupai_type;

var cc_GameMenu = cc.Class({
    extends: game_menu.GameMenu,

    /**
     * 过牌
     */
    guo: function () {
        if(this.require_UserPlayer.canhu){
            cc.dd.DialogBoxUtil.show(0, '确定要放弃胡牌吗', '确定', '取消', ()=>{
                this.guoCall();
            }, function() { });
        }else{
            this.guoCall();
        }
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

    initMJComponet(){
        return require("mjComponentValue").pzmj;
    }
});

module.exports = {
    GameMenu:cc_GameMenu,
    menu_type:menu_type,
    hupai_type:hupai_type,
};
