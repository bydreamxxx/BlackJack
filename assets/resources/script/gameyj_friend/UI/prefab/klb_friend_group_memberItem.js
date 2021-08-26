const club_sender = require('jlmj_net_msg_sender_club');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');

let MEMBER = require('klb_friend_group_enum').MEMBER;
let MEMBER_STATUS = require('klb_friend_group_enum').MEMBER_STATUS;

cc.Class({
    extends: cc.Component,

    properties: {
        headNode: cc.Node,
        playername: cc.Label,
        id: cc.Label,
        time: cc.Label,
        timeLabel: cc.Label,

        yesButton: cc.Sprite,
        noButton: cc.Sprite,
        buttonSprite: [cc.SpriteFrame],

        specialNode: cc.Node,
        specialSprite: [cc.SpriteFrame],

        buttonNode: cc.Node,

        defaultHead: cc.SpriteFrame,
    },

    //初始化玩家数据信息
    initPlayerInfo: function(clubId, player, status){
        if(player){
            this.node.active = true;
        }else{
            this.node.active = false;
            return;
        }

        this.playerData = player;
        this.clubId = clubId;
        this.status = status;

        //名字
        this.playername.string = cc.dd.Utils.subChineseStr(player.name, 0 , 14);

        if(status == MEMBER_STATUS.APPLY){
            //头像设置
            this.headNode.getComponent('klb_hall_Player_Head').initHead(player.openid, player.url);

            if(player.openid == '' || player.url == ''){
                this.headNode.getComponent('klb_hall_Player_Head').headSp.spriteFrame = this.defaultHead;
            }

            this.id.string = player.userId;
            this.yesButton.spriteFrame = this.buttonSprite[0];
            this.noButton.spriteFrame = this.buttonSprite[1];
            this.specialNode.active = false;
            this.buttonNode.active = true;
            this.time.string = this.convertTimeDay(player.applyTime);
            this.timeLabel.string = '申请时间:';
        }else{
            //头像设置
            this.headNode.getComponent('klb_hall_Player_Head').initHead(player.openid, player.headurl);

            if(player.openid == '' || player.headurl == ''){
                this.headNode.getComponent('klb_hall_Player_Head').headSp.spriteFrame = this.defaultHead;
            }

            this.id.string = player.userid;


            if(this.status == MEMBER_STATUS.CHECK){
                this.buttonNode.active = false;
            }else{
                this.buttonNode.active = player.job != MEMBER.OWNER;
            }
            if(this.status == MEMBER_STATUS.SCORE){
                this.buttonNode.active = true;
                this.yesButton.spriteFrame = this.buttonSprite[5];
                this.noButton.spriteFrame = this.buttonSprite[6];

                this.time.string = cc.dd.Utils.getNumToWordTransform(player.score);
                this.timeLabel.string = '积分:';

            }else{
                this.yesButton.node.parent.active = cc.dd.user.clubJob == MEMBER.OWNER;
                this.yesButton.spriteFrame = player.gameRightsList.length <= 2 ? this.buttonSprite[2] : this.buttonSprite[4];
                this.noButton.spriteFrame = this.buttonSprite[3];

                this.time.string = this.convertTimeDay(player.joinTime);
                this.timeLabel.string = '加入时间:';
            }
            this.specialNode.active = player.gameRightsList.length > 2;
            if(player.job == MEMBER.OWNER){
                this.specialNode.getComponent(cc.Sprite).spriteFrame = this.specialSprite[0];//群主
            }else if(player.job == MEMBER.ADMIN){
                this.specialNode.getComponent(cc.Sprite).spriteFrame = this.specialSprite[1];//管理员
            }
        }
    },

    //同意/拒绝按钮
    onClickOP: function(event, data){
        hall_audio_mgr.com_btn_click();
        if(this.status == MEMBER_STATUS.APPLY){//申请
            club_sender.applyClubListReq(parseInt(data), this.clubId, this.playerData.userId);
        }else if(this.status == MEMBER_STATUS.MANAGER){//房卡亲友圈

            if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_NOTICE)){
                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_NOTICE, function(ui){
                    let title = '';
                    if(parseInt(data) == 3){
                        title = this.playerData.gameRightsList.length > 2 ? '确定要取消该成员管理员权限吗？' : '确定要设置该成员为管理员吗？';
                    }else{
                        title = '确定要踢出该成员吗?'
                    }

                    ui.getComponent('klb_friend_group_notice').show(title,()=>{
                        if(parseInt(data) == 3){
                            let right = this.playerData.gameRightsList.length > 2 ? [1] : [1, 2, 3];
                            club_sender.rightsReq(this.clubId, right,this.playerData.userid);
                        }else{
                            club_sender.kickOutClub(this.clubId, this.playerData.userid);
                        }
                    });
                }.bind(this));
            }
        }else if(this.status = MEMBER_STATUS.SCORE){//体验亲友圈
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_CHANGE_SCORE, function(ui){
                ui.getComponent('klb_friend_group_changeScore').setInfo(this.playerData, this.clubId, parseInt(data));
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
