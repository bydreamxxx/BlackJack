// create by wj 2019/09/16
var deskData = require('new_dsz_desk').New_DSZ_Desk_Data.Instance();
var playerMgr = require('new_dsz_player_manager').New_DSZ_PlayerMgr.Instance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AppCfg = require('AppConfig');
var Platform = require('Platform');
var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_nBaskChip: 0,
        m_oFriendInviteBtn: cc.Node,
    },


    onLoad () {
        //底注
        var configData = deskData.getConfigData();
        if(configData){
            var list = configData.anzhu.split(';');
            var base = list[0].split(',');
            this.m_nBaskChip = parseInt(base[1]);
        }

        this.m_oFriendInviteBtn.getComponent('klb_friend_group_invite_btn').setInfo(roomMgr.roomId, this.analysisRule)
    },
    //微信邀请玩家
    onClickWXInvite: function(event, data){
        if (event.type != "touchend") {
            return;
        }

        var num = deskData.getPlayerCount() -playerMgr.getRealPlayerCount();

        var title = "房间号:" + roomMgr.roomId+ '\n';
        var str = this.analysisRule();
        if (cc.sys.isNative) {
            let wanFa = [];

            wanFa.push('底注:' + this.m_nBaskChip);
            wanFa.push('共:' + deskData.getTotalRoundCount() +'局');

            let playerList = playerMgr.playerInfo;
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if(playerMsg&&playerMsg.userId){
                    playerName.push(playerMsg.playerCommonInfo.name);
                }
            },this);

            var playmodel = deskData.getPlayModel() //游戏模式
            var luckyType = deskData.getLuckyType() //喜分类型
            var ruleList = deskData.getPlayRule(); //玩法
            if(playmodel == 1)
                wanFa.push('标准模式')
            else
                wanFa.push('大牌模式(无2-8)')
    
            ruleList.forEach(function(rule){
                switch(rule){
                    case 1:
                        wanFa.push('必闷三轮');
                        break;
                    case 2:
                        wanFa.push('癞子玩法');
                        break;
                    case 3:
                        wanFa.push('双倍比牌');
                        break;
                    case 4:
                        wanFa.push('亮底牌');
                        break;
                }
            });
            switch(luckyType){
                case 1:
                    wanFa.push('闷吃喜分');
                    break;
                case 2:
                    wanFa.push('都吃喜分');
                    break;
                case 3:
                    wanFa.push('赢吃喜分');
                    break;
            }

            let info = {
                gameid: roomMgr.gameId,//游戏ID
                roomid: roomMgr.roomId,//房间号
                title: deskData.getPlayerCount()+"人逗三张",//房间名称
                content: wanFa,//游戏规则数组
                usercount: deskData.getPlayerCount(),//人数
                jushu: deskData.getTotalRoundCount(),//局\圈数
                jushutitle: '局数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }
           cc.dd.native_wx.SendAppInvite(info, "【" + deskData.getPlayerCount() + "人逗三张】" + '  差' + num + '人', title + str,  Platform.wxShareGameUrl[AppCfg.PID]);
       }
       this.onClose();
    },

    //规则解析
    analysisRule: function(){
        var playmodel = deskData.getPlayModel() //游戏模式
        var luckyType = deskData.getLuckyType() //喜分类型
        var ruleList = deskData.getPlayRule(); //玩法

        var ruleStr = playmodel == 1 ? '标准模式/' : '大牌模式(无2-8)/';
        ruleList.forEach(function(rule){
            switch(parseInt(rule)){
                case 1:
                    ruleStr += '必闷三轮/'
                    break;
                case 2:
                    ruleStr += '癞子玩法/'
                    break;
                case 3:
                    ruleStr += '双倍比牌/'
                    break;
                case 4:
                    ruleStr += '亮底牌/'
                    break;
            }
        });
        switch(luckyType){
            case 1:
                ruleStr += '闷吃喜分/'
                break;
            case 2:
                ruleStr += '都吃喜分/'
                break;
            case 3:
                ruleStr += '赢吃喜分/'
                break;
            case 4:
                break;
        }

        ruleStr += deskData.getPlayerCount() == 6 ? '六人' : '九人';
        return ruleStr;
    },

    onClose: function(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
