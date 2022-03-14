var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var FriendData = require('hall_friend').FriendData.Instance();
var FriendED = require('hall_friend').FriendED;
var FriendEvent = require('hall_friend').FriendEvent;
let game_room = require('game_room');
let game_type = require('game_type');

cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: cc.Label,
        headIcon: require('klb_hall_Player_Head'),
        nameLabel: cc.Label,
        uidLabel: cc.Label,
        vipState: cc.Node,
        vipLevel: cc.Label,

        loginTimeLabel: require('LanguageLabel'),
        inGameLabel: require('LanguageLabel'),
        inHallLabel: cc.Label,
        followBtn: cc.Node,

        gameNumLabel: cc.Label,
        bigWinLabel: cc.Label,
        joinTimeLabel: cc.Label,
        addRessLabel: require('LanguageLabel'),

        signaLabel: cc.Label,

        trophyItem: cc.Node,
        trophyListContent: cc.Node,

        friendBtnNode: cc.Node,

        callMessageNode: cc.Node,
        callMessageLabel: cc.Label,

        callRequestNode: cc.Node,
        callMessageEdit:  cc.EditBox,

        redPointNode: cc.Node,
        redPointLabel: cc.Label,
    },

    setData(data, type) {
        this.type = type
        this.data = data
        this.friendBtnNode.active = type===1    //好友界面
        this.callMessageNode.active = type===2    //请求列表
        this.callRequestNode.active = type===3    //请求添加

        this.uid = data.uid

        let userBriefData = FriendData.getFriendBriefInfo(this.uid)
        if(userBriefData) {
            this.headIcon.initHead (0, userBriefData.head)
            this.nameLabel.string = cc.dd.Utils.subChineseStr(userBriefData.name, 0, 10);
            // this.gameStateInHall.active = data.curStatus===0
            // this.gameStateOffline.active = data.curStatus===-1
            // this.gameStateGaming.active = data.curStatus===1
            this.loginTimeLabel.node.active = userBriefData.curStatus===-1
            this.inHallLabel.node.active = userBriefData.curStatus===0
            this.inGameLabel.node.active = userBriefData.curStatus > 0
            this.vipState.active = userBriefData.vipLevel > 0
            this.vipLevel.string = userBriefData.vipLevel
        }
        if(data.remarks) {
            this.nameLabel.string = cc.dd.Utils.subChineseStr(data.remarks, 0, 10);
        }
        // this.headIcon.initHead (0, data.head)
        // this.nameLabel.string = cc.dd.Utils.subChineseStr(data.name, 0, 10);
        this.coinLabel.string = cc.dd.Utils.getNumToWordTransform(data.coin)
        this.uidLabel.string = data.uid

        this.followBtn.active = data.inGameType > 0
        this.loginTimeLabel.setText('lastlogintime', '', '', cc.dd.Utils.timestampToTime(data.lastLoginTime, 'YYYY/mm/dd'))
        let inGameCfg = game_type.getItem((_item) => {
            return _item.key === data.inGameType;
        })
        if(inGameCfg){
            this.inGameLabel.setText('ingaming', '', '', inGameCfg.name)
        }
        
        
        this.bigWinLabel.string = cc.dd.Utils.getNumToWordTransform(data.luckiestWins)
        this.joinTimeLabel.string = cc.dd.Utils.timestampToTime(data.firstPlayTime, 'YYYY/mm/dd')
        this.addRessLabel.setText(data.city)
        let gameNums = 0
        for(let i=0; i<data.gamesList.length; i++) {
            gameNums += data.gamesList[i].playedTimes
        }
        this.gameNumLabel.string = cc.dd.Utils.getNumToWordTransform(gameNums)

        this.signaLabel.string = data.mood ? data.mood : ''

        this.loadTrophy(data.champsList)
        
        if(type===1) {
            let unreadChatCount = FriendData.getUnreadChatCount(this.uid)
            this.setChatRedCound(unreadChatCount)
        }
    },

    // 设置聊天红点
    setChatRedCound(count) {
        this.count =  count
        if(this.count > 99) {
            this.count = 99
        }
        this.redPointLabel.string = '+'+this.count
        this.redPointNode.active = this.count > 0
    },
    // 更新红点数量
    updateChatRedCound() {
        let unreadChatCount = FriendData.getUnreadChatCount(this.uid)
        this.setChatRedCound(unreadChatCount)
    },

    //  加载奖杯 
    loadTrophy(champsList) {
        this.trophyListContent.removeAllChildren()
        for(let i=0; i<champsList.length; i++){
            let node = cc.instantiate(this.trophyItem);
            node.active =  true
            node.parent = this.trophyListContent
            // cc.find('icon', node).getComponent(cc.Sprite)
            cc.find('name', node).getComponent('LanguageLabel').setText(champsList[i].name)
            cc.find('name', node).getComponent(cc.Label).setText(champsList[i].winCoin)
        }
    },

    //  跟随 
    onFollow() {
        // let inGameCfg = game_type.getItem((_item) => {
        //     return _item.key === this.data.inGameType;
        // })
        // if(inGameCfg) {
        //     return
        // }
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setRoomId(this.data.inRoomCfgId);
        msg.setGameType(this.data.inGameType);
        msg.setRoomIdReal(this.data.inRoomId);
        msg.setLookPlayer(this.uid);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },
    // 赠送金币
    onGiftCoin()  {
        cc.dd.DialogInputUtil.show('giftcoins', 'friend_text11', 'OK', (text)=>{
            cc.dd.DialogBoxUtil.show(1, "friend_text13", "confirm", "Cancel",()=>{
                let count = parseInt(text)
                if(isNaN(count)) {
                    cc.dd.PromptBoxUtil.show('friend_text12');
                    return
                }
                var msg = new cc.pb.friend.msg_send_friend_coin_req();
                msg.friendId = this.uid
                msg.coin = count
                cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_send_friend_coin_req, msg, "msg_send_friend_coin_req", true);
            });
        })
    },
    // 删除好友
    onDel() {
        cc.dd.DialogBoxUtil.show(1, "friend_text13", "confirm", "Cancel",()=>{
            var msg = new cc.pb.friend.msg_del_friend_req();
            msg.friendId = this.uid
            cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_del_friend_req, msg, "msg_del_friend_req", true);

            FriendED.notifyEvent(FriendEvent.OPEN_LOOKUP_FRIEND, undefined);
        });
    },
    // 聊天
    onChat() {
        FriendED.notifyEvent(FriendEvent.OPEN_FRIEND_CHAT, this.uid);
    },
    // 修改备注
    onChangeRemark() {
        cc.dd.DialogInputUtil.show('changeremarktitle', 'changeremark', 'OK', (remarks)=>{
            var msg = new cc.pb.friend.msg_friend_set_remarks_req();
            msg.friendId = this.uid
            msg.remarks = remarks
            cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_friend_set_remarks_req, msg, "msg_friend_set_remarks_req", true);
        })
    },
    //  请求添加
    onRequestFriend(){
        var msg = new cc.pb.friend.msg_add_friend_req();
        msg.friendId = this.uid
        msg.captcha = this.callMessageEdit.string
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_add_friend_req, msg, "msg_add_friend_req", true);
    },
    // 设置打招呼信息
    setCaptcha(text) {
        this.callMessageLabel.string = text
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

    },

    // update (dt) {},
});
