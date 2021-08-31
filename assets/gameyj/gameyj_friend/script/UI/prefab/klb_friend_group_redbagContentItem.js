var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        openNode:{
            default: null,
            type: cc.Node,
            tooltip: '开红包',
        },
        overNode:{
            default: null,
            type: cc.Node,
            tooltip: '抢完了',
        },


        headNode: {
            default: null,
            type: cc.Node,
            tooltip: '玩家头像',
        },
        playername: {
            default: null,
            type: cc.Label,
            tooltip: '玩家昵称',
        },
        desc: {
            default: null,
            type: cc.Label,
            tooltip: '描述',
        },


        bg: {
            default: null,
            type: cc.Sprite,
            tooltip: '背景',
        },
        bgSprite: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: '背景图集',
        }
    },

    onDestroy(){
      if(this.touchOpen){
          clearTimeout(this.touchOpen);
          this.touchOpen = null;
      }
      if(this.touchDetail){
          clearTimeout(this.touchDetail);
          this.touchDetail = null;
      }
    },

    setInfo(data){
        this.info = data;

        this.headNode.getComponent('klb_hall_Player_Head').initHead(data.openId, data.headUrl);

        if(data.leftSum != 0){
            this.overNode.active = false;
            this.openNode.active = true;
            this.bg.spriteFrame = this.bgSprite[0];
        }else{
            this.overNode.active = true;
            this.openNode.active = false;
            this.bg.spriteFrame = this.bgSprite[1];
        }

        this.playername.string = (data.ownerName.length > 9 ? cc.dd.Utils.substr(data.ownerName, 0 , 9) : data.ownerName);

        let base64 = decodeURIComponent(data.msg);
        let msg = cc.dd.SysTools.decode64(base64);

        this.desc.string = msg;
    },

    onClickOpen(){
        hall_audio_mgr.com_btn_click();

        if(this.touchOpen){
            return;
        }

        this.touchOpen = setTimeout(()=>{
            this.touchOpen = null;
        }, 1000);

        club_sender.robRedBag(club_Mgr.getSelectClubId(), this.info.id);
    },

    onClickDetail(){
        hall_audio_mgr.com_btn_click();
        if(this.touchDetail){
            return;
        }

        this.touchDetail = setTimeout(()=>{
            this.touchDetail = null;
        }, 1000);

        club_sender.checkRedBag(club_Mgr.getSelectClubId(), this.info.id);
    },
});
