var HuType = require('jlmj_define').HuType;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

let base_mj_net_handler_base_mj = require("base_mj_net_handler_base_mj");

var fz_handler = cc.Class({

    extends: base_mj_net_handler_base_mj.handler,

    ctor: function () {
        cc.log("jsmj_net_handler_jsmj 父类");
    },

    setReconnectRule(rule){
        RoomMgr.Instance()._Rule = rule;
    },

    getJBC(){
        return cc.dd.Define.GameType.JSMJ_GOLD;
    },

    getFriend(){
        return cc.dd.Define.GameType.JSMJ_FRIEND;
    },

    checkSpecialHu(hutype){
        return false;
    },

    on_mj_ack_send_current_result: function( msg ) {
        cc.log('【数据】普通结算消息接收 开始');
        if ( !this.headerHandle( msg ) ) return;
        let laseJiesuan = cc.find("Canvas/toppanel/last_jie_suan");
        if(laseJiesuan){
            laseJiesuan.active = false;
        }

        this.require_DeskData.Instance().waitJiesuan = true;
        this.require_DeskData.Instance().setIsStart( false );
        this.require_DeskData.Instance().unlockScene();

        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_MENU, []);//关闭menu

        msg.jiesuanBanker = this.require_DeskData.Instance().banker;

        var play_list = cc.find('Canvas/player_list').getComponent(this.mjComponentValue.playerList);
        //显示其他玩家的暗杠
        msg.playercoininfoList.forEach((item) => {
            if(item && item.userid){
                if(item.userid != cc.dd.user.id){
                    var other_player = this.require_playerMgr.Instance().getPlayer(item.userid);
                    if(other_player){
                        other_player.openAnGang(item.pailistList);
                    }
                    // other_player.isBaoting = item.isting;
                    // play_list.player_ui_arr[other_player.viewIdx].head.setTing(item.isting);
                }
            }
        });


        play_list.playerUpdateShouPaiUI();


        this.checkIsHuangZhuang(msg.huuserid);

        this.waitTime = 500 + this.require_playerMgr.Instance().playing_special_hu;

        setTimeout(()=>{
            this.require_DeskData.Instance().jiesuan( msg );
            this.waitTime = 0;
        }, this.waitTime);

        this.require_deskJBCData.getInstance().setIsStart(this.require_DeskData.Instance().isFriend()==false);
        this.require_DeskData.Instance().setIsStart( false );

        this.require_DeskED.notifyEvent(this.require_DeskEvent.OPEN_BAO_PAI,[]);
        this.require_DeskED.notifyEvent(this.require_DeskEvent.BIAOJI_BAOPAI,[]);
        cc.log('【数据】普通结算消息接收 完成 ');
    },

    initMJComponet(){
        return require("mjComponentValue").jsmj;
    },
});

module.exports = new fz_handler();