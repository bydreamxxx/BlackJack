const club_sender = require('jlmj_net_msg_sender_club');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

let MEMBER = require('klb_friend_group_enum').MEMBER;
let MEMBER_STATUS = require('klb_friend_group_enum').MEMBER_STATUS;

cc.Class({
    extends: cc.Component,

    properties: {
        headNode: cc.Node,
        playername: cc.Label,
        id: cc.Label,
        time: cc.Label,

        specialNode: cc.Node,
        specialSprite: [cc.SpriteFrame],

        defaultHead: cc.SpriteFrame,

        button: cc.Node,
    },

    //初始化玩家数据信息
    initPlayerInfo: function(clubId, player, wanfa, desk, roomID, gameType, notStart){
        if(player){
            this.node.active = true;
        }else{
            this.node.active = false;
            return;
        }

        this.button.active = notStart;
        
        this.playerData = player;
        this.clubId = clubId;
        this.wanfa = wanfa;
        this.desk = desk;
        this.roomID = roomID;
        this.gameType = gameType;

        this.playername.string = cc.dd.Utils.subChineseStr(player.name, 0 , 14);

        //头像设置
        this.headNode.getComponent('klb_hall_Player_Head').initHead(player.openid, player.headurl);

        if(player.openid == '' || player.headurl == ''){
            this.headNode.getComponent('klb_hall_Player_Head').headSp.spriteFrame = this.defaultHead;
        }

        this.id.string = player.userid;


        this.time.string = this.convertTimeDay(player.joinTime);

        this.specialNode.active = player.job != MEMBER.NORMAL;
        if(player.job == MEMBER.OWNER){
            this.specialNode.getComponent(cc.Sprite).spriteFrame = this.specialSprite[0];//群主
        }else if(player.job == MEMBER.ADMIN){
            this.specialNode.getComponent(cc.Sprite).spriteFrame = this.specialSprite[1];//管理员
        }
    },

    onClickKick(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_NOTICE)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_NOTICE, function(ui){
                ui.getComponent('klb_friend_group_notice').show('确定要踢出该玩家吗?',()=>{
                    club_sender.kickOutDesk(this.clubId, this.wanfa, this.desk, this.roomID, this.playerData.userid, this.gameType);
                });
            }.bind(this));
        }
    },

    /**
     * 转换时间
     */
    convertTimeDay: function (t) {
        var date = new Date(t * 1000);
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }

        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
    /**
     * 转化时间小时分
     */
    convertTimeDate: function (t) {
        var date = new Date(t * 1000);
        var seperator2 = ":";
        var hours = date.getHours();
        var min = date.getMinutes();
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }

        var currentdate = hours + seperator2 + min;
        return currentdate;
    },
});
