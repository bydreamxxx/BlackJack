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

        loginTimeLabel: cc.Label,
        inGameLabel: cc.Label,
        inHallLabel: cc.Label,
        followBtn: cc.Node,

        gameNumLabel: cc.Label,
        bigWinLabel: cc.Label,
        joinTimeLabel: cc.Label,
        addRessLabel: cc.Label,

        signaLabel: cc.Label,

        trophyItem: cc.Node,
        trophyListContent: cc.Node,

        friendBtnNode: cc.Node,

        callMessageNode: cc.Node,
        callMessageLabel: cc.Label,

        callRequestNode: cc.Node,
        callMessageEdit:  cc.EditBox,
    },

    setData(data, type) {
        this.type = type
        this.data = data
        this.friendBtnNode.active = type===1    //好友界面
        this.callMessageNode.active = type===2    //请求列表
        this.callRequestNode.active = type===3    //请求添加

        this.uid = data.uid
        this.coinLabel.string = cc.dd.Utils.getNumToWordTransform(data.coin)
        this.headIcon.initHead (0, data.head)
        this.nameLabel.string = cc.dd.Utils.subChineseStr(data.name, 0, 10);
        this.uidLabel.string = data.uid
        this.vipState.active = true

        this.loginTimeLabel.node.active = data.inGameType === -1
        this.inHallLabel.node.active = data.inGameType === 0
        this.inGameLabel.node.active = data.inGameType > 0
        this.followBtn.active = data.inGameType > 0
        // this.loginTimeLabel.string = data.firstPlayTime
        let inGameCfg = game_type.getItem((_item) => {
            return _item.key === data.inGameType;
        })
        if(inGameCfg){
            this.inGameLabel.string = inGameCfg.name
        }
        
        // this.gameNumLabel.string = cc.dd.Utils.getNumToWordTransform(data.coin)
        this.bigWinLabel.string = cc.dd.Utils.getNumToWordTransform(data.luckiestWins)
        // this.joinTimeLabel.string = data.firstPlayTime
        // this.addRessLabel.string = data.ip

        this.signaLabel.string = data.sign

        this.loadTrophy(data.chapsList)
        
    },

    //  加载奖杯 
    loadTrophy(chapsList) {
        this.trophyListContent.removeAllChildren()
        for(let i=0; i<chapsList.length; i++){
            let node = cc.instantiate(this.trophyItem);
            node.active =  true
            node.parent = this.trophyListContent
            node.getComponent('LanguageLabel').setText(chapsList[i].name)
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
        msg.setGameType(this.data.inGameType);
        msg.setRoomId(this.data.inRoomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },
    // 赠送金币
    onGiftCoin()  {
        cc.dd.DialogInputUtil.show('giftcoins', 'friend_text11', 'OK', (text)=>{
            let count = parseInt(text)
            if(!isNaN(count)) {
                cc.dd.PromptBoxUtil.show('friend_text12');
                return
            }
            var msg = new cc.pb.friend.msg_send_friend_coin_req();
            msg.friendId = this.uid
            msg.coin = count
            cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_send_friend_coin_req, msg, "msg_send_friend_coin_req", true);
        })
    },
    // 删除好友
    onDel() {
        cc.dd.DialogBoxUtil.show(1, "friend_text13", "text30", "Cancel",()=>{
            var msg = new cc.pb.friend.msg_del_friend_req();
            msg.friendId = this.uid
            cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_del_friend_req, msg, "msg_del_friend_req", true);
        });
    },
    // 聊天
    onChat() {
        FriendED.notifyEvent(FriendEvent.OPEN_FRIEND_CHAT, this.uid);
        // this.setRedCound(0)
    },
    // 修改备注
    onChangeRemark() {
        cc.dd.DialogInputUtil.show('changeremarktitle', 'changeremark', 'OK', (count)=>{
            // var msg = new cc.pb.friend.msg_send_friend_coin_req();
            // msg.friendId = this.uid
            // msg.coin = count
            // cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_send_friend_coin_req, msg, "msg_send_friend_coin_req", true);
        })
    },
    //  请求添加
    onRequestFriend(){
        var msg = new cc.pb.friend.msg_add_friend_req();
        msg.friendId = this.uid
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_add_friend_req, msg, "msg_add_friend_req", true);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

    },

    // update (dt) {},
});
