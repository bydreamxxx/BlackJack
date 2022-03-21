
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var HallCommonData = require("hall_common_data").HallCommonData;
var Define = require("Define");
var AppConfig = require('AppConfig');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var klb_game_list_config = require('klb_gameList');
var hall_prefab = require('hall_prefab_cfg');
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
cc.Class({
    extends: cc.Component,

    properties: {

        deskAtlas: cc.SpriteAtlas,
        m_oDefaultSprite: cc.SpriteFrame,
        m_oDeskStates: [cc.Node],//0:未开始 , 1:开始 , 2:锁定或者留机
        // m_oStateAnimation: cc.Animation,//状态动画节点（可选）
        m_tPlayerNode: [cc.Node],
        m_deskNum: cc.Label,
        m_bShowName: true,

        //财神动画
        m_oStateNode: [cc.Node]
    },

    onLoad: function () {
        // playerEd.addObserver(this);
        RoomED.addObserver(this);
        this.m_oDeskData = null;
        this.m_tablePwd = null;
        this.stopCd();
    },


    onDestroy: function () {
        // playerEd.removeObserver(this);
        RoomED.removeObserver(this);
        this.stopCd();
    },


    updateTableState: function (deskData) {
        if (deskData == null)
            return;

        if (deskData.roomStatus >= 1) {
            this.m_oDeskStates[0].active = false;
            this.m_oDeskStates[1].active = false;
            this.m_oDeskStates[2].active = true;
        } else {
            this.m_oDeskStates[0].active = !deskData.isPlaying;
            this.m_oDeskStates[1].active = deskData.isPlaying;
            this.m_oDeskStates[2].active = false;
        }

    },



    setTableBgAndLockBg: function (deskData) {
        var deskBg = cc.find('table', this.node).getComponent(cc.Sprite);
        //优先判断留机和锁定 room_status   = 4; //0:正常, 1:锁定, 2:留机
        //然后判断 is_playing	  = 6; //是否是正在游戏的房间 
        this.updateTableState(deskData);

        switch (this.m_nGameType) {
            case 32://斗地主
                var fr = this.deskAtlas.getSpriteFrame('ddz-zhuotai' + this.m_nRoomId)
                if (fr)
                    deskBg.spriteFrame = fr;

                var lock = cc.find('table/state2/lock', this.node).getComponent(cc.Sprite);
                var lockFrame = this.deskAtlas.getSpriteFrame('ddz-suo' + this.m_nRoomId)
                if (lockFrame)
                    lock.spriteFrame = lockFrame;
                break;

            case 202://德州扑克
                var fr = this.deskAtlas.getSpriteFrame('dzpk-zhuotai' + this.m_nRoomId)
                if (fr)
                    deskBg.spriteFrame = fr;

                var lock = cc.find('table/state2/lock', this.node).getComponent(cc.Sprite);
                var lockFrame = this.deskAtlas.getSpriteFrame('dzpk-suo' + this.m_nRoomId)
                if (lockFrame)
                    lock.spriteFrame = lockFrame;
                break;
            case 184://急速麻将
                var fr = this.deskAtlas.getSpriteFrame('jsmj_zhuo' + this.m_nRoomId)
                if (fr)
                    deskBg.spriteFrame = fr;

                var lock = cc.find('table/state2/lock', this.node).getComponent(cc.Sprite);
                var lockFrame = this.deskAtlas.getSpriteFrame('jsmj-suo' + this.m_nRoomId)
                if (lockFrame)
                    lock.spriteFrame = lockFrame;
                break;

            default:

                break;
        }


        if (this.m_oStateNode && this.m_oStateNode.length > 0) {
            // var clips = this.m_oStateAnimation.getClips();
            // this.m_oStateAnimation.stop();
            if (deskData) {
                if (deskData.rolesList.length == 0) { //无人{
                    this.m_oStateNode[0].active = true;
                    this.m_oStateNode[1].active = false;
                    this.m_oStateNode[2].active = false;
                } else if (deskData.roomStatus >= 1) {//锁定或者留机
                    this.m_oStateNode[2].active = true;
                    this.m_oStateNode[0].active = false;
                    this.m_oStateNode[1].active = false;
                } else {                            //游戏中
                    this.m_oStateNode[1].active = true;
                    this.m_oStateNode[0].active = false;
                    this.m_oStateNode[2].active = false;
                }

            } else {
                this.m_oStateNode[0].active = true;
                this.m_oStateNode[1].active = false;
                this.m_oStateNode[2].active = false;
            }
        }
    },

    // updateDeskState:function(deskData,stateData)
    // {

    //     switch (this.m_nGameType) {
    //         case 32:
    //             if (deskData)
    //                 this.m_oDeskStates[1].active = deskData.rolesList.length >= 3 && deskData.roomStatus == 0;
    //             break;
    //         case 102:
    //             if (deskData){
    //                 this.m_oDeskStates[1].active = (deskData.rolesList && deskData.rolesList.length > 0) && deskData.roomStatus == 0;
    //             }
    //             break;
    //         default:

    //             break;
    //     }


    //     if (this.m_oStateAnimation) {
    //         var clips = this.m_oStateAnimation.getClips();
    //         this.m_oStateAnimation.stop();
    //         if (deskData) {
    //             if (deskData.rolesList.length == 0) //无人
    //                 this.m_oStateAnimation.play(clips[0].name);
    //             else if (deskData.roomStatus >= 1)//锁定或者留机
    //                 this.m_oStateAnimation.play(clips[2].name);
    //             else                            //游戏中
    //                 this.m_oStateAnimation.play(clips[1].name);
    //         } else {
    //             this.m_oStateAnimation.play(clips[0].name);
    //         }
    //     }

    // },

    updateDeskNodeInfo: function (deskData, gameType, roomId, deskNo) {
        this.m_nGameType = gameType,
            this.m_nRoomId = roomId;

        if (this.m_deskNum && deskNo != null)
            this.m_deskNum.string = deskNo;

        this.setTableBgAndLockBg(deskData);
        if (deskData)
            this.m_oDeskData = deskData;
        else
            return;



        if (gameType == 102 && deskData.isPlaying == null) {
            deskData.isPlaying = deskData.rolesList.length == 1;
        }
        this.updateTableState(deskData);
        // this.m_oDeskStates[2].active = deskData.roomStatus >= 1;//0:正常, 1:锁定, 2:留机

        var curNode;
        for (var i = 0; i < this.m_oDeskStates.length; i++) {
            if (this.m_oDeskStates[i].active) {
                curNode = this.m_oDeskStates[i]
                break;
            }
        }

        if (deskData.rolesList.length == 0) {//桌子无人

            for (var i = 0; i < this.m_tPlayerNode.length; i++) {
                this.m_tPlayerNode[i].hasPlayer = false;
                var headSp = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[i], 'headSp');
                var name = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[i], 'name')
                var nameBg = cc.find("nameBg", this.m_tPlayerNode[i]);
                if (headSp)
                    headSp.getComponent(cc.Sprite).spriteFrame = this.m_oDefaultSprite;

                if (name) {
                    name.active = false;
                }
                if (nameBg) {
                    nameBg.active = false;
                }
                var select = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[i], 'select');
                if (select)
                    select.active = false;
            }
            this.m_oDeskData = null;

        } else {

            for (var k = 0; k < this.m_tPlayerNode.length; k++) {
                this.m_tPlayerNode[k].hasPlayer = false;
                var headSp = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[k], 'headSp');//头像重置
                var name = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[k], 'name')
                var nameBg = cc.find("nameBg", this.m_tPlayerNode[k]);
                if (headSp)
                    headSp.getComponent(cc.Sprite).spriteFrame = this.m_oDefaultSprite;

                if (name) {
                    name.active = false;
                }

                if (nameBg) {
                    nameBg.active = false;
                }
            }
            for (var role of deskData.rolesList) {
                var headSp = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[role.seat], 'headSp')
                var name = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[role.seat], 'name')
                var nameBg = cc.find("nameBg", this.m_tPlayerNode[role.seat]);
                var select = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[role.seat], 'select');
                if (select)
                    select.active = true;

                if (name) {
                    name.getComponent(cc.Label).string = cc.dd.Utils.substr(role.name, 0, 4);
                    name.active = this.m_bShowName && (deskData.roomStatus != 2);
                }


                if (this.m_tPlayerNode[role.seat])
                    this.m_tPlayerNode[role.seat].hasPlayer = true;
                if (headSp) {
                    var hd = headSp.getComponent(cc.Sprite);
                    cc.dd.SysTools.loadWxheadH5(hd, role.headUrl);
                }

                if (nameBg) {
                    nameBg.active = this.m_tPlayerNode[role.seat].hasPlayer;
                }
            }

            if (deskData.roomStatus == 2) {
                this.stayTime = cc.find('txt', curNode).getComponent(cc.Label);
                this.stayTime.string = cc.dd.Utils.secondToDate(deskData.liujiTime);
                this.startCd(deskData.liujiTime);
            }
        }
    },

    startCd: function (cdTime) {
        this.stopCd();
        this.stayTime.node.active = true;
        this.cdTime = cdTime;
        this.cdFunc = setInterval(function () {
            --this.cdTime;
            if (this.cdTime < 0) {
                this.stopCd();
            } else {
                this.stayTime.string = cc.dd.Utils.secondToDate(this.cdTime);
            }
        }.bind(this), 1000);
    },

    stopCd: function () {
        if (this.cdFunc) {
            clearInterval(this.cdFunc);
            this.cdFunc = null;
        }
        if (this.stayTime)
            this.stayTime.string = "00:00:00";
    },

    //
    findPlayerDataBySeatIndex: function (index) {
        if (this.m_oDeskData) {
            for (var i = 0; i < this.m_oDeskData.rolesList.length; i++) {
                var role = this.m_oDeskData.rolesList[i];
                if (role && role.seat == index)
                    return role;
            }
        }
    },

    showPlayerInfo: function (node, roleData) {
        cc.dd.UIMgr.openUI('gameyj_common/prefab/com_player_short_info', function (prefab) {
            var scr = prefab.getComponent('com_player_short_info');
            scr.setData(node, roleData)
        }.bind(this), true, null, 0.1);
    },


    setTablePasswd: function (pwd, deskId, seat) {
        this.m_tablePwd = pwd;
        this.requestEnterGame(deskId, seat);
    },


    //尝试进入游戏，成功返回true
    tryEnterGame: function () {
        for (var i = 0; i < this.m_tPlayerNode.length; i++) {
            if (this.m_tPlayerNode[i].hasPlayer)
                continue;

            var deskId = this.node._tag;
            this.requestEnterGame(deskId, i);
            return true;
        }

        return false;
    },

    onClickEnter: function (event, data) {
        var seat = parseInt(data);
        var deskId = this.node._tag;
        var roleData = this.findPlayerDataBySeatIndex(seat);
        if (this.m_tPlayerNode[seat].hasPlayer && roleData && roleData.userId != cc.dd.user.id)//不是自己就显示信息，是自己就进入房间
        {
            var headSp = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[seat], 'headNode');
            this.showPlayerInfo(headSp, roleData);
            this.m_tablePwd = '';
        } else if (this.m_oDeskData && this.m_oDeskData.roomStatus == 1 && (this.m_tablePwd == null || this.m_tablePwd.length < 4))//锁定
        {
            cc.dd.UIMgr.openUI('gameyj_common/prefab/com_game_menu_join_lock_room', function (prefab) {
                var scr = prefab.getComponent('com_game_menu_join_lock_room');
                scr.setCallBack(this.setTablePasswd.bind(this), deskId, seat)
            }.bind(this));
        }
        else {
            // this.m_tablePwd = '';
            this.requestEnterGame(deskId, seat);
        }

    },


    requestLeaveDesk() {
        var msg = new cc.pb.game_rule.msg_leave_room_desks_req();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(this.m_nGameType);
        gameInfo.setRoomId(this.m_nRoomId);
        msg.setGameInfo(gameInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_leave_room_desks_req, msg,
            '发送协议[cmd_msg_leave_room_desks_req][离开房间信息]', true);
    },

    requestEnterGame: function (deskId, seat) {
        if (RoomMgr.Instance().roomItem == null) {
            cc.dd.PromptBoxUtil.show('wrong room information:roomid==' + this.m_nRoomId);
            return;
        }

        var enterfunc = function () {

            if(this.m_nGameType == 102){//留机特殊处理，切换场次情况下先存钱可能进不去留机房间问题
                var roomData = RoomMgr.Instance().findMineLockedRoom();
                    if (!roomData) {
                        var jsonstr = cc.sys.localStorage.getItem('liuji_room_info_' + cc.dd.user.id);
                        if (jsonstr) {
                            roomData = JSON.parse(jsonstr);
                            var curtime = new Date().getTime();
                            if (curtime - roomData.time > roomData.liujiTime * 1000) {
                                roomData = null;
                            }
                        }
                    }
                    if (roomData) {
                        cc.dd.DialogBoxUtil.show(0, "您已留机，是否立即前往？", "前往", "Cancel", function () {
                            var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                            msg.setGameType(roomData.gameId);
                            msg.setRoomId(roomData.roomId);
                            msg.setSeat(0);//roomData.seat;
                            msg.setDeskId(roomData.deskData.argsList[0]);
                            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                            cc.sys.localStorage.setItem('requestEnterGame_cache', JSON.stringify({ gameId: roomData.gameId, roomId: roomData.roomId, seat: 0, deskId: roomData.deskData.argsList[0] }));
                        }, null);
                        return;
                    }
            }

            var coin = HallPropData.getCoin();
            var bankCoin = HallPropData.getBankCoin();
            var entermin = RoomMgr.Instance().roomItem.entermin
            var entermax = RoomMgr.Instance().roomItem.entermax
            if (coin < entermin) {
                if ((bankCoin + coin) < entermin) {
                    // 金币不足 弹窗  跳转商城
                    cc.dd.DialogBoxUtil.show(1, '您的金币不足' + this.convertNumToStr(entermin) + '，无法上座!是否充值?', 'text33', 'Cancel', function () {
                        if (!cc._is_shop)
                            return;
                        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
                            var type = "ZS";
                            ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
                        }.bind(this));

                    }, null);
                } else {
                    this.openQuickPickMoney(entermin, entermax, deskId, seat)
                }

                //     if (!AppConfig.OPEN_JIU_JI_JIN) {
                //         cc.dd.PromptBoxUtil.show('金币不足');
                //         return;
                //     }

                // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
                //     var jiuji = ui.getComponent('klb_hall_jiuji');
                //     if (jiuji != null) {
                //         jiuji.update_buy_list(RoomMgr.Instance().roomItem.entermin);
                //     }
                // });
                return;
            }

            if (coin > entermax) {
                this.openQuickPickMoney(entermin, entermax, deskId, seat)
                return;
            }

            this.requestLeaveDesk();

            switch (this.m_nGameType) {
                case 32:
                    RoomMgr.Instance().gameSeat = seat;
                    RoomMgr.Instance().deskId = deskId;
                    var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                    msg.setGameType(this.m_nGameType);
                    msg.setRoomId(this.m_nRoomId);
                    msg.setSeat(seat);
                    msg.setDeskId(deskId);
                    //锁定房间
                    if (RoomMgr.Instance().m_deskPass && RoomMgr.Instance().m_deskPass != '')
                        msg.setPasswd(RoomMgr.Instance().m_deskPass);

                    if (this.m_tablePwd && this.m_tablePwd != '')
                        msg.setPasswd(this.m_tablePwd);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                    // this.checkIsEnterCommon(this.gameid, this.sendDDZEnterMsg.bind(this));
                    break;
                case 102:
                    // var roomData = RoomMgr.Instance().findMineLockedRoom();
                    // if (!roomData) {
                    //     var jsonstr = cc.sys.localStorage.getItem('liuji_room_info_' + cc.dd.user.id);
                    //     if (jsonstr) {
                    //         roomData = JSON.parse(jsonstr);
                    //         var curtime = new Date().getTime();
                    //         if (curtime - roomData.time > roomData.liujiTime * 1000) {
                    //             roomData = null;
                    //         }
                    //     }
                    // }
                    // if (roomData) {
                    //     cc.dd.DialogBoxUtil.show(0, "您已留机，是否立即前往？", "前往", "Cancel", function () {
                    //         var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                    //         msg.setGameType(roomData.gameId);
                    //         msg.setRoomId(roomData.roomId);
                    //         msg.setSeat(0);//roomData.seat;
                    //         msg.setDeskId(roomData.deskData.argsList[0]);
                    //         cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                    //         cc.sys.localStorage.setItem('requestEnterGame_cache', JSON.stringify({ gameId: roomData.gameId, roomId: roomData.roomId, seat: 0, deskId: roomData.deskData.argsList[0] }));
                    //     }, null);
                    // }
                    // else {
                        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                        msg.setGameType(this.m_nGameType);
                        msg.setRoomId(this.m_nRoomId);
                        msg.setSeat(seat);
                        msg.setDeskId(deskId);
                        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                        cc.sys.localStorage.setItem('requestEnterGame_cache', JSON.stringify({ gameId: this.m_nGameType, roomId: this.m_nRoomId, seat: seat, deskId: deskId }));
                    //}
                    break;
                default:

                    var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                    msg.setGameType(this.m_nGameType);
                    msg.setRoomId(this.m_nRoomId);
                    msg.setSeat(seat);
                    msg.setDeskId(deskId);
                    // if (cc.dd.CheckGames.isMJ(this.m_nGameType)){
                    //锁定房间
                    if (RoomMgr.Instance().m_deskPass && RoomMgr.Instance().m_deskPass != '')
                        msg.setPasswd(RoomMgr.Instance().m_deskPass);

                    if (this.m_tablePwd && this.m_tablePwd != '')
                        msg.setPasswd(this.m_tablePwd);
                    // }
                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                    break;
            }

        }.bind(this);

        if (HallCommonData.getInstance().gameId > 0) {    //游戏恢复
            var gameItem = klb_game_list_config.getItem(function (item) {
                if (item.gameid == HallCommonData.getInstance().gameId)
                    return item
            })
            var str = '您还在[' + gameItem.name + ']游戏中，约30秒后退出成功...'
            cc.dd.DialogBoxUtil.show(0, str, 'backroom', 'Cancel', function () {
                this.requestLeaveDesk();

                var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                msg.setGameType(HallCommonData.getInstance().gameId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickRoom');
                var hall_desk = cc.find('Canvas').getComponentInChildren('klb_hall_desk');
                hall_desk && (hall_desk.m_gameId = HallCommonData.getInstance().gameId);
            }.bind(this), function () {
                var hall_desk = cc.find('Canvas').getComponentInChildren('klb_hall_desk');
                hall_desk && (hall_desk.m_gameId = this.m_nGameType);
            }.bind(this));
            cc.dd.DialogBoxUtil.setWaitGameEnd(enterfunc);
            return;
        }
        enterfunc();
    },
    // 快捷 取钱 存钱
    openQuickPickMoney(entermin, entermax, deskId, seat) {
        cc.dd.UIMgr.openUI('gameyj_hall/prefabs/room_table/klb_hall_pick_money', function (prefab) {
            var scr = prefab.getComponent('klb_hall_pick_money');
            scr.setData(entermin, entermax)
            scr.setCallBack(this.requestEnterGame.bind(this), deskId, seat)
        }.bind(this));

    },
    convertNumToStr(num) {
        if (num < 10000) {
            return num.toString();
        }
        else if (num < 100000000) {
            return Math.round(num / 1000) / 10 + '万';
        }
        else {
            return Math.round(num / 10000000) / 10 + '亿';
        }
    },
    /**
     * 斗地主
     */
    sendDDZEnterMsg: function (gameid) {
        var scriptData = require('ddz_data').DDZ_Data.Instance();
        scriptData.setData(RoomMgr.Instance().roomItem);
        cc.dd.AppCfg.GAME_ID = gameid;
        cc.dd.SceneManager.enterGame(this.m_nGameType);
    },

    /**
     * 检查金币是否可以进入房间，通用
     */
    checkIsEnterCommon: function (gameId, callFunc) {
        RoomMgr.Instance().gameId = this.m_nGameType;
        RoomMgr.Instance().roomLv = this.m_nRoomId;

        var coin = HallPropData.getCoin();
        // if ((coin >= this.roomItem.entermin && coin <= this.roomItem.entermax)) {
        callFunc(gameId);
        // } else {
        //     if (coin < this.roomItem.entermin) {
        //         if (this.roomItem.entermin === 0) {
        //             callFunc(gameId);
        //         } else {
        //             cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
        //                 var jiuji = ui.getComponent('klb_hall_jiuji');
        //                 if (jiuji != null) {
        //                     jiuji.update_buy_list(this.roomItem.entermin);
        //                 }
        //             }.bind(this));
        //         }
        //     } else if (coin > this.roomItem.entermax) {
        //         if (this.roomItem.entermax === 0) {
        //             callFunc(gameId);
        //         } else {
        //             cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_16);
        //         }
        //     }
        // }
    },

    on_coin_room_enter: function () {
        switch (this.m_nGameType) {
            // case 32:
            //     cc.gateNet.Instance().pauseDispatch();
            //     this.checkIsEnterCommon(this.gameid, this.sendDDZEnterMsg.bind(this));
            //     break;
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case RoomEvent.on_coin_room_enter:
                this.on_coin_room_enter(data[0]);
                break;
            case RoomEvent.check_is_in_game:
                this.check_is_in_game(data[0]);
                break;
        }
    },

    check_is_in_game(msg) {
        switch (msg.retCode) {
            case 8:
                this.m_tablePwd = '';
                break;
            default:
                break;
        }
    },


});
