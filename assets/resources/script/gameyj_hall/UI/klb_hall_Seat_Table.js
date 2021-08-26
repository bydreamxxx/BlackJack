var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');


// const chairsPosition = {
//     2:[cc.v2(-208,125), cc.v2(-172.6,17.7), cc.v2(0,-27.7), cc.v2(172.6,17.7), cc.v2(208,125)],//五人
//     3:[cc.v2(-209.7,125), cc.v2(-196.1,42.2), cc.v2(-104.2,-12.6), cc.v2(0,-25.9), cc.v2(104.2,-12.6), cc.v2(196.1,42.2), cc.v2(209,125), cc.v2(102.2,125), cc.v2(-102.2,125)],//九人
//     4:[cc.v2(-208,125), cc.v2(-194.3,41.3), cc.v2(-100.9,-12.8), cc.v2(0,-26.2), cc.v2(100.9,-12.8), cc.v2(194.3,41.3), cc.v2(208,125), cc.v2(128.3,125), cc.v2(48.3,125), cc.v2(-48.3,125), cc.v2(-128.3,125)]//十一人
// }

let TABLE_TYPE = require('klb_friend_group_enum').TABLE_TYPE;
let MEMBER = require('klb_friend_group_enum').MEMBER;

cc.Class({
    extends: cc.Component,

    properties: {
        chairs: {
            default: [],
            type: [cc.Node],
            tooltip: '椅子',
        },

        tableId: {
            default: null,
            type: cc.Label,
            tooltip: '桌号',
        },

        watchNode: cc.Node, //观战
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // if(cc.dd.user.clubJob == MEMBER.NORMAL){
        this.node.getComponent(cc.Button).enabled = true;

        for (let i = 0; i < this.chairs.length; i++) {
            let node = cc.find('headNode', this.chairs[i]);
            node.getComponent(cc.Toggle).enabled = false;
        }
        // }else{
        //     this.node.getComponent(cc.Button).enabled = false;
        //     this.node.getComponent(cc.Toggle).enabled = true;
        //
        //     for(let i = 0; i < this.chairs.length; i++){
        //         let node = cc.find('headNode', this.chairs[i]);
        //         node.getComponent(cc.Toggle).enabled = true;
        //     }
        // }
    },

    start() {

    },

    updateChairs() {
        for (let i = 0; i < this.chairs.length; i++) {
            cc.find('headNode', this.chairs[i]).active = false;
        }
    },

    updateTableInfo(idx, tableInfo, info, isOpen) {
        this.idx = idx;
        this.tableId.string = idx + 1;
        this.tableInfo = tableInfo;
        this._roomInfo = info;
        this.isOpen = isOpen;

        for (let i = 0; i < this.chairs.length; i++) {
            let node = cc.find('headNode', this.chairs[i]);
            node.active = false;
            node.getComponent('klb_friend_group_player').setData(null);
            node.getComponent(cc.Toggle).isChecked = false;
        }

        let showChairHead = (node, member) => {
            node.active = true;
            node.getComponent('klb_hall_Player_Head').initHead(member.openId, member.headUrl);
            //node.getComponent('klb_friend_group_player').setData(member, this.wanfa, this.idx, this.tableInfo.roomId, this.tableInfo.gameType);
        }
        for (let i = 0; i < tableInfo.rolesList.length; i++) {
            let chair = cc.find('headNode', this.chairs[tableInfo.rolesList[i].seat]);
            if (chair) {
                showChairHead(chair, tableInfo.rolesList[i]);
            }
        }
    },

    // 点击桌子
    onClickButton() {
        //cc.find('Canvas').getComponentInChildren('klb_hall_Seat').showDetail(this.tableInfo);
    },

    //点击位置
    onClickSitDown(event, custom) {
        var idx = parseInt(custom);
        var head = cc.find('headNode', event.target);
        if (!head)
            return;
        if (head.active == false) {
            var gameid = this._roomInfo.gameid;
            var roomid = this._roomInfo.roomid;
            var deskid = this.tableInfo.argsList[0];

            var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
            msg.setGameType(gameid);
            msg.setRoomId(roomid);
            msg.setDeskId(deskid);
            msg.setSeat(idx);
            msg.setLookPlayer(0);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        }
        else {
            var player = null;
            for (let i = 0; i < this.tableInfo.rolesList.length; i++) {
                if (idx == this.tableInfo.rolesList[i].seat) {
                    player = this.tableInfo.rolesList[i];
                    break;
                }
            }
            if (player && this.watchNode) {
                cc.find('zhuanshi/coin', this.watchNode).getComponent(cc.Label).string = this.changeNumToCHN(player.coin);
                cc.find('zhuanshi/name', this.watchNode).getComponent(cc.Label).string = cc.dd.Utils.subChineseStr(player.name, 0, 10);
                var headSp = cc.find('headNode/headSp', this.watchNode).getComponent(cc.Sprite);
                cc.dd.SysTools.loadWxheadH5(headSp, player.headUrl);
                this.watchNode.active = true;
                this.watchPlayerId = player.userId;
            }
        }
    },

    //点击旁观
    onClickWatch(event, custom) {
        hall_audio_mgr.com_btn_click();
        var id = this.watchPlayerId;
        if (id) {
            var find = false;
            for (let i = 0; i < this.tableInfo.rolesList.length; i++) {
                if (id == this.tableInfo.rolesList[i].userId) {
                    var gameid = this._roomInfo.gameid;
                    var roomid = this._roomInfo.roomid;
                    var deskid = this.tableInfo.argsList[0];

                    var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                    msg.setGameType(gameid);
                    msg.setRoomId(roomid);
                    msg.setDeskId(deskid);
                    msg.setSeat(this.tableInfo.rolesList[i].seat);
                    msg.setLookPlayer(id);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                    find = true;
                    break;
                }
            }
            if (!find) {
                cc.dd.PromptBoxUtil.show('未找到该玩家');
                this.watchNode.active = false;
            }
        }
    },

    //点击关闭旁观
    onClickCloseWatch(event, custom) {
        hall_audio_mgr.com_btn_click();
        this.watchNode.active = false;
    },

    onClickDissolve() {
        hall_audio_mgr.com_btn_click();
        if (this.tableInfo) {
            if (!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_NOTICE)) {
                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_NOTICE, function (ui) {
                    ui.getComponent('klb_friend_group_notice').show('确定要解散该桌子吗?', () => {
                        club_sender.dissolveDesk(clubMgr.getSelectClubId(), this.tableInfo.roomId, this.tableInfo.gameType, this.wanfa, this.idx);
                    });
                }.bind(this));
            }
        }
    },

    onDestroy() {
        if (this.touchTime) {
            clearTimeout(this.touchTime);
            this.touchTime = null;
        }
        if (this.touchsitTime) {
            clearTimeout(this.touchsitTime);
            this.touchsitTime = null;
        }
    },

    getHeads() {
        let list = [];
        for (let i = 0; i < this.chairs.length; i++) {
            let node = cc.find('headNode', this.chairs[i]);
            if (node) {
                list.push(node.getComponent(cc.Toggle));
            }
        }
        return list;
    },

    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 100000000) {
            str = (num / 100000000.00).toFixed(1) + '亿';
        } else if (num >= 10000000) {
            str = (num / 10000000.00).toFixed(1) + '千万';
        } else if (num >= 100000) {
            str = (num / 10000.00).toFixed(1) + '万';
        } else {
            str = num;
        }
        return str;
    },

    //点击头像
    onClickToggle(toggle, data) {
        //cc.find('Canvas').getComponentInChildren('klb_hall_Seat').showDetail(this.tableInfo);
    },
});
