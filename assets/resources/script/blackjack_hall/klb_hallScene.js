//created by wj 2017/12/14
const dd = cc.dd;
var hallData = require('hall_common_data').HallCommonData;
const Hall = require('jlmj_halldata');
const hallGameList = require("klb_hall_GameList").HallGameList.Instance();
const hallGameItemUI = require("klb_hall_GameItemUI");
const HallSendMsgCenter = require('HallSendMsgCenter');
const reslist = require('klb_hall_loadResConfig');
const hallRoomEventDispatcher = require("klb_hall_RoomData").HallRoomEventDispatcher;
const hallRoomEvent = require("klb_hall_RoomData").HallRoomDataEvent;
const hall_rooms_data = require('klb_hall_RoomData').HallRoomsData.instance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var login_module = require('LoginModule');
var hall_prefab = require('hall_prefab_cfg');
var FortuneHallManager = require('FortuneHallManager').Instance();
var DingRobot = require('DingRobot');
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;
var HallTask = require('hall_task').Task;
var klb_game_list_config = require('klb_gameList');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var game_room_list = require('game_room');
let hall_prop_data = require('hall_prop_data').HallPropData;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var AppConfig = require('AppConfig');
var Define = require('Define');
var game_channel_cfg = require('game_channel');
const Bsc_sendMsg = require('bsc_sendMsg');
const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
let GAME_ITME_TYPE = require("klb_hall_GameItem").GameType;
var daili_phone = require('daili_phone');

let hall = cc.Class({
    extends: cc.Component,

    properties: {
        gameScrollView: { default: null, type: cc.Node, tooltip: "游戏列表pageview" },

        prefab: cc.Prefab,
        taskTip: cc.Node,

        activeTip: cc.Node,
        hallNode: cc.Node,
        xinxiNode: cc.Node,

        userCardNode: cc.Node,
        userGoldNode: cc.Node,

        luckyBtn: cc.Node,
        fkdlBtn: cc.Node,

        adspriteFrames: [cc.SpriteFrame],
    },


    // use this for initialization
    onLoad: function () {
        this.needInitGold = true;
        this.needInitCard = true;
        cc.log('进入大厅----');
        DingRobot.set_ding_type(0);
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
        Bsc_ED.addObserver(this);
        cc.dd.UpdaterED.addObserver(this);

        cc.dd.SysTools.setLandscape();
        this.onCompleted();
        dd.AudioChat.clearUsers();
        hallRoomEventDispatcher.addObserver(this);
        TaskED.addObserver(this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        //AudioManager.playMusic("blackjack_hall/audios/Hall_BGM");

        this.initHall();

        this.showHall();

    },

    /**
     * 显示活动
     */
    showActive: function () {
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
                if (cc._isHuaweiGame) {
                    if (cc.dd.isshowActive) {
                        this.showJiuji();
                        return;
                    }
                    cc.dd.isshowActive = true;

                    if (!cc.dd.isLoginTanchu) {
                        cc.dd.isLoginTanchu = true;
                        this.showDailySign();
                    } else {
                        this.showJiuji();
                    }
                }
                break;
        }
    },

    start: function () {//因为需要 获取玩家是不是游戏中，，， 为啥不在登录时带回  而需要重新发 而且是每次都发
        //关闭游戏背景音乐

        this.setUserInfo(hallData.getInstance());
    },


    onDestroy: function () {
        hallRoomEventDispatcher.removeObserver(this);
        Hall.HallED.removeObserver(this);
        TaskED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        AudioManager.stopMusic();
        RoomED.removeObserver(this);
        Bsc_ED.removeObserver(this);
        cc.dd.UpdaterED.removeObserver(this);

        AudioManager.stopMusic();
    },


    /**
 * 返回按键
 * @param event
 */
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.back:
                if (cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_ROOM)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_ROOM);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_Match)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_Match);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_RANK)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_RANK);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_SHOP_LAYER)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_SHOP_LAYER);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_WELFAREBAG)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_WELFAREBAG);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_BAG)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_BAG);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_CHANGE_HEAD)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_CHANGE_HEAD);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.BJ_HALL_USERINFO)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.BJ_HALL_USERINFO);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_MAP_ADD_GAME)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_MAP_ADD_GAME);
                }
                else {
                    if (cc._isHuaweiGame && cc._lianyunID == 'vivo') {
                        if (cc.sys.OS_ANDROID == cc.sys.os) {
                            jsb.reflection.callStaticMethod('game/SystemTool', 'vivoExit', '()V');
                        }
                    }
                    else if (cc._isHuaweiGame && cc._lianyunID == 'oppo') {
                        if (cc.sys.OS_ANDROID == cc.sys.os) {
                            jsb.reflection.callStaticMethod('game/SystemTool', 'oppoExit', '()V');
                        }
                    }
                    else if (cc._isHuaweiGame && cc._lianyunID == 'xiaomi') {
                        if (cc.sys.OS_ANDROID == cc.sys.os) {
                            jsb.reflection.callStaticMethod('game/SystemTool', 'miExit', '()V');
                        }
                    }
                    else {
                        if (!this.__showbox) {
                            this.__showbox = true;
                            cc.dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_2, '确定', '取消',
                                function () {
                                    cc.director.end();
                                    cc.dd.NetWaitUtil.close();
                                    this.__showbox = false;
                                }.bind(this),
                                function () {
                                    cc.dd.NetWaitUtil.close();
                                    this.__showbox = false;
                                }.bind(this)
                            );
                        }
                    }
                }
                break;
            default:
                break;
        }
    },

    initGameList: function () {
        hallGameList.InitHallGameList();
    },

    initGameLogo: function () {

    },


    /**
     * 更新未读邮件红点
     */
    updateUnreadMail() {
        var unread = hallData.getInstance().unread_mail_num;
        let notice_length = hallData.getInstance().getNoticeLength();
        unread = unread || 0;

        unread += notice_length[0];

        if (unread > 99) {
            unread = '99+';
        } else {
            unread = unread.toString();
        }

        let hongdian = cc.find('gold/xinxi/hongdian', this.node);
        if (hongdian) {
            cc.find('num', hongdian).getComponent(cc.Label).string = unread;
            if (unread > 0) {
                hongdian.active = true;
            }
            else {
                hongdian.active = false;
            }
        }

    },

    /**
     * 设置玩家信息
     */
    setUserInfo: function (userData) {
        let user1 = cc.find('Canvas/gold/klb_hall_mainui_userInfo');
        if (user1) {
            let userinfo = user1.getComponent('klb_hall_UserInfo');
            if (userinfo) {
                userinfo.setData(userData, true);
            }
        }
        cc.dd.native_systool.getNativeScheme();
    },

    // //玩家信息
    // userBtnCallBack: function () {
    //     cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_USERINFO, function (ui) {
    //         ui.getComponent('klb_hall_UserInfo').setData(hallData.getInstance());
    //     }.bind(this));
    // },
    //房卡
    addFangkaCallBack: function () {
        //this.shopBtnCallBack();
    },
    //钻石
    zuanshiCallBack: function () {
        this.shopBtnCallBack(null, null, 'ZS');
    },

    closeMoreCallFunc: function () {
        var ani = this.moreNode.getChildByName('ScrollView').getChildByName('view').getComponent(cc.Animation);
        ani.off('stop', this.closeMoreCallFunc, this);
        this.moreNode.active = false;
    },

    clickCloseMore: function () {
        var ani = this.moreNode.getChildByName('ScrollView').getChildByName('view').getComponent(cc.Animation);
        ani.play('klb_hall_more_close');
        ani.on('stop', this.closeMoreCallFunc, this);
    },
    //功能按钮响应
    btnClickCallBack: function (event, data) {
        switch (data) {
            case 'LUCKBAG'://福袋
                //this.updateTaskGetTip(false);
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_WELFAREBAG);
                break;
            case 'RANK'://排行榜
                var pbObj = new cc.pb.rank.msg_rank_get_rank_list_2s();
                pbObj.setType(1);
                cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_rank_get_rank_list_2s, pbObj, 'msg_rank_get_rank_list_2s', true);
                break;
            case 'MORE'://更多
                // this.moreNode.active = true;
                // var ani = this.moreNode.getChildByName('ScrollView').getChildByName('view').getComponent(cc.Animation);
                // ani.play('klb_hall_more_show');
                /************************游戏统计 start************************/
                cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.SETTING);
                /************************游戏统计   end************************/
                // hall_audio_mgr.com_btn_click();
                // if (cc._useChifengUI) {
                //     cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_SETTING);
                // } else {
                //     cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHEZHI);
                // }


                


                break;
            case 'BAG':
                hall_audio_mgr.com_btn_click();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BAG, function (ui) {
                    //ui.getComponent('klb_hall_BagUI').updateBagUI();
                }.bind(this));
                break;
            case 'KEFU':
                hall_audio_mgr.com_btn_click();
                // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
                //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
                // });
                let Platform = require('Platform');
                let AppCfg = require('AppConfig');
                cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
                break;
        };
    },

    //商城
    //type 为代码打开是指定 打开对应的页面
    shopBtnCallBack: function (event, data, type) {
        if (!cc._is_shop)
            return;
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            type = type || 'ZS'; //默认打开房卡页面
            ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
            //ui.zIndex = 5000;
        }.bind(this));
    },

    //显示日常活动
    onClickShowDailyActivities: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY, function (prefab) {
            prefab.getComponent('klb_hall_daily_activeUI').showDefaultSelect();
        });

    },
    /**
 * 创建   加入    比赛按钮回调
 * @param event
 * @param data
 */
    roomBtnCallBack: function (event, data) {
        switch (data) {
            case 'C_ROOM':
                // var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                // var longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                // var distance =  jsb.reflection.callStaticMethod('SystemTool', 'getDistance:endLatitude:startLongitude:endLongitude:', Latitude, Latitude+1, longitude, longitude+1);
                // cc.log("详细地址：Latitude+++++++++++++++++++++++++++" + Latitude);
                // cc.log("详细地址：longitude+++++++++++++++++++++++++++" + longitude);
                // cc.log("详细地址：distance+++++++++++++++++++++++++++" + distance);

                // hall_audio_mgr.com_btn_click();
                // this.creatRoomNode.active = true;
                // var Component = this.creatRoomNode.getComponent("klb_hall_CreateRoom");
                // Component.showGameList(0)
                // if (cc.game_pid == 10004) {
                //     Component.moveToCenter();
                // } else {
                //     var ani = this.creatRoomNode.getChildByName('actionnode').getComponent(cc.Animation);
                //     ani.play('klb_hall_createRoom');
                // }
                break;
            case 'J_ROOM'://进入房间
                // hall_audio_mgr.com_btn_click();
                // this.joinRoomNode.active = true
                // var ani = this.joinRoomNode.getChildByName('action_node').getComponent(cc.Animation);
                // ani.play('klb_hall_JoinRoom');
                break;
            case 'C_CLUB'://进入房间
                hall_audio_mgr.com_btn_click();
                // cc.dd.SceneManager.replaceScene('club_new');
                cc.dd.SceneManager.replaceScene('klb_friend_group_scene');
                break;
            case 'J_MATCH':
                if (cc.game_pid == 10008) {
                    cc.dd.quickMatchType = 'wdmj_bi_sai_chang';
                }
                hall_audio_mgr.com_btn_click();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
                    node.getComponent('klb_hall_Match').sendGetMatch(1);
                }.bind(this));
                break;
            case 'GOLD':
                hall_audio_mgr.com_btn_click();
                this.goToGold();
                break;
            case 'CARD':
                hall_audio_mgr.com_btn_click();
                this.goToCard();
                break;
        };
        // var screen_shot_node = cc.find("Canvas/fx_ditu");
        // cc.dd.native_wx.SendScreenShotVertical(screen_shot_node);
    },

    /**
     * 进度回调
     */
    onProgress: function (progress) {
        //this.progress_label.string = parseInt(progress*100)+"%";
        //this.progress_bar.progress = progress;
    },

    /**
     * 加载结束回调
     */
    onCompleted: function () {
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛 
                break;
            default:
                var channel_games = game_channel_cfg.getItem(function (item) {
                    if (item.channel == AppConfig.GAME_PID)
                        return true;
                })
                if (channel_games) {
                    if (cc.sys.localStorage.getItem('selectgame') == null)
                        cc.sys.localStorage.setItem('selectgame', '');
                    break;
                }
                cc.log('集合类游戏');
                var json = cc.sys.localStorage.getItem('provinceid');
                if (json == null) {
                    // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_MAP_PROVINCE_MAP, function (ui) {
                    //     ui.setLocalZOrder(40);
                    //     var cpt = ui.getComponent('klb_hall_Map_Province_Map');
                    //     cpt.openMap();
                    //     cpt.hideQuit();
                    // });

                    cc.sys.localStorage.setItem('provinceid', 22);
                    cc.sys.localStorage.setItem('locationid', 11);
                    cc.sys.localStorage.setItem('selectgame', '');
                }
        }

        // var defaultJson = cc.sys.localStorage.getItem('defalutselectgame');
        // if (defaultJson == null) {
        //设置默认的游戏id
        cc.sys.localStorage.setItem('defalutselectgame', '32;51;41;25');
        //}
        this.initGameList();
        this.initGameLogo();

        if (!cc.gateNet.Instance().isConnected()) {
            login_module.Instance().reconnectWG();
        } else {
            if (cc.find('Marquee') == null) {
                var pref = cc.resources.get('blackjack_common/prefab/Marquee', cc.Prefab);
                var Marquee = cc.instantiate(pref);
                cc.director.getScene().addChild(Marquee);
                cc.game.addPersistRootNode(Marquee);
            }
            // HallSendMsgCenter.getInstance().requestCheckReconnect();
            //HallSendMsgCenter.getInstance().sendBagItemList();
            HallSendMsgCenter.getInstance().sendDefaultBroadcastInfo();

        }
    },

    initAndOpenRoomUI: function (data) {
        cc.tween(this.node)
            .delay(0.1)
            .call(function () {
                var gameItem = klb_game_list_config.getItem(function (item) {
                    if (item.gameid == data.hallGameid)
                        return item
                })
                if (gameItem.isxiaociji == 0) { //常规游戏
                    switch (data.hallGameid) {
                        case 109://疯狂拼十
                        case Define.GameType.HBSL_GOLD://红包扫雷
                        case 103: //单挑
                        case 104: //飞禽走兽
                        case 105: //西游记
                        case 106://幸运转盘
                        case 201://二八杠
                        case 107://黄金赛马
                        case 110: //打地鼠
                            var enterfunc = function () {
                                if (data.roomlistList && data.roomlistList.length) {
                                    var entermin = 0;
                                    game_room_list.items.forEach(function (roomItem) {
                                        if (data.hallGameid == roomItem.gameid && roomItem.roomid == data.roomlistList[0].fangjianid) {
                                            var scriptData = require('brnn_data').brnn_Data.Instance();
                                            scriptData.setData(roomItem);
                                            entermin = roomItem.entermin;
                                        }
                                    }.bind(this));
                                    if (hall_prop_data.getInstance().getCoin() < entermin) {
                                        var tipsText = '金币不足' + entermin + ',不能进入';
                                        cc.dd.DialogBoxUtil.show(0, tipsText, "确定");
                                    }
                                    else {
                                        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                                        msg.setGameType(data.hallGameid);
                                        msg.setRoomId(data.roomlistList[0].fangjianid);
                                        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                                    }
                                }
                                else {
                                    cc.dd.PromptBoxUtil.show('当前禁止该游戏，请联系管理员');
                                }
                            }
                            if (hallData.getInstance().gameId > 0) {    //游戏恢复
                                if (hallData.getInstance().gameId == data.hallGameid) {
                                    var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                                    msg.setGameType(hallData.getInstance().gameId);
                                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                                }
                                else {
                                    var itemgame = klb_game_list_config.getItem(function (item) {
                                        if (item.gameid == hallData.getInstance().gameId)
                                            return item;
                                    })
                                    var str = '您正在[' + itemgame.name + ']房间中游戏，大约30秒后自动进入新游戏。。。'
                                    cc.dd.DialogBoxUtil.show(0, str, 'backroom', 'Cancel', function () {
                                        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                                        msg.setGameType(hallData.getInstance().gameId);
                                        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                                    }, null);
                                    cc.dd.DialogBoxUtil.setWaitGameEnd(enterfunc);
                                }
                            }
                            else {
                                // if (data.roomlistList && data.roomlistList.length) {
                                //     var entermin = 0;
                                //     game_room_list.items.forEach(function (roomItem) {
                                //         if (data.hallGameid == roomItem.gameid && roomItem.roomid == data.roomlistList[0].fangjianid) {
                                //             var scriptData = require('brnn_data').brnn_Data.Instance();
                                //             scriptData.setData(roomItem);
                                //             entermin = roomItem.entermin;
                                //         }
                                //     }.bind(this));
                                //     if (hall_prop_data.getInstance().getCoin() < entermin) {
                                //         var tipsText = '金币不足' + entermin + ',不能进入';
                                //         cc.dd.DialogBoxUtil.show(0, tipsText, "确定");
                                //     }
                                //     else {
                                //         var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                                //         msg.setGameType(data.hallGameid);
                                //         msg.setRoomId(data.roomlistList[0].fangjianid);
                                //         cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                                //     }
                                // }
                                // else {
                                //     cc.dd.PromptBoxUtil.show('当前禁止该游戏，请联系管理员');
                                // }
                                enterfunc();
                            }
                            break;
                        case 136://新斗三张
                            dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_hall_Room', function (prefab) {
                                var Component = prefab.getComponent('new_dsz_hall_room');
                                Component.initRoomUI(data);
                            });
                            break;
                        case 138://捕鱼
                            dd.UIMgr.openUI('gameyj_fish/prefabs/fish_hall_Room', function (prefab) {
                                var Component = prefab.getComponent('gameyj_Fish_Room');
                                Component.initRoomUI(data);
                            });
                            break;
                        case 139://捕鱼
                            dd.UIMgr.openUI('gameyj_fish_doyen/prefabs/fish_doyen_hall_room', function (prefab) {
                                var Component = prefab.getComponent('gameyj_Fish_Doyen_Room');
                                Component.initRoomUI(data);
                            });
                            break;
                        default:
                            switch (AppConfig.GAME_PID) {
                                case 2: //快乐吧麻将
                                case 3: //快乐吧农安麻将
                                case 4:  //快乐吧填大坑
                                case 5:  //快乐吧牛牛 
                                    {
                                        dd.UIMgr.openUI(hall_prefab.BJ_HALL_ROOM, function (prefab) {
                                            var Component = prefab.getComponent('BlackJack_Hall_Room');
                                            Component.initRomUI(data);
                                        });
                                        break;
                                    }
                                default:
                                    dd.UIMgr.openUI(hall_prefab.BJ_HALL_ROOM, function (prefab) {
                                        var Component = prefab.getComponent('BlackJack_Hall_Room');
                                        Component.initRomUI(data);
                                    });
                            }
                            break;
                    }
                } else {
                    var entermin = null;
                    game_room_list.items.forEach(function (roomItem) {
                        if (data.hallGameid == roomItem.gameid) {
                            if (entermin == null)
                                entermin = roomItem.entermin;
                            else
                                entermin = Math.min(entermin, roomItem.entermin);
                        }
                    }.bind(this));
                    if (hall_prop_data.getInstance().getCoin() < entermin) {
                        var tipsText = '金币不足' + entermin + ',不能进入';
                        cc.dd.DialogBoxUtil.show(0, tipsText, "确定");
                    }
                    else {
                        var gSlotMgr = require('SlotManger').SlotManger.Instance();
                        gSlotMgr.enterGame(gameItem.gameid, 0);
                    }
                }
            })
            .start();
    },

    // showRank: function (msg) {
    //     cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_RANK, function (prefab) {
    //         var comp = prefab.getComponent('klb_hall_Rank');
    //         comp.initData(msg);
    //     }, true);
    // },

    onClickMail: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.BLACKJACK_HALL_MAIL, function (prefab) {
            var comp = prefab.getComponent('BlackJack_Hall_Mail');
            comp.getMailInfo();
        });
    },

    //打开活动接口
    onClickActive: function (event, data) {
        cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_Active", function (prefab) {
            var comp = prefab.getComponent('klb_hall_Active');
            comp.onClickOpenExchange(5);
        });
    },

    //打开七天乐活动:
    onClick7day: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_sevenDay_Active/klb_hall_SevenDay_Active", function (prefab) {
            // var comp = prefab.getComponent('klb_hall_Seven_Day_Active');
            // comp.onClickOpenExchange(5);
        });
    },

    //更新显示活动icon
    activeListIconShow: function (list) {
        // for (var i = 0; i < list.length; i++) {
        //     if (this.activeNodeList[list[i].activityId - 1]) {
        //         this.activeNodeList[list[i].activityId - 1].active = (list[i].state == 1 ? true : false);
        //         var seq1 = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
        //         this.activeNodeList[list[i].activityId - 1].getChildByName('shineBg').runAction(cc.repeatForever(seq1));
        //     }
        // }
    },

    showDailyAD: function () {
        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_daily_active_AD', function (prefab) {
            prefab.getComponent('klb_hall_daily_active_AD').show(() => {
                // if (!cc.dd.isLoginTanchu) {
                //     this.showDailySign();
                //     cc.dd.isLoginTanchu = true;
                // } else {
                //     this.showJiuji();
                // }
            });
        }.bind(this));
    },

    //显示七日签到
    showDailySign: function (func) {
        // return;
        // let func3 = ()=>{
        // this.showTaskUI();
        // }
        // let func2 = ()=>{
        //     if (!Hall.HallData.Instance().isShowFamilyCircle && !cc._inviteTaskOpen) {
        //         cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_FAMILY_CIRCLE, function (prefab) {
        //             prefab.getComponent('klb_hall_Family_Cricle').setIndicator();
        //             if (func)
        //                 prefab.getComponent('klb_hall_Family_Cricle').setFunc(func);
        //             Hall.HallData.Instance().isShowFamilyCircle = true;
        //         });
        //     }
        // }

        if (Hall.HallData.Instance().sign_data && !Hall.HallData.Instance().showedSign) {
            var sign_data = Hall.HallData.Instance().sign_data.rewardListList;
            let showsign = false;
            sign_data.forEach(function (item) {
                if (item.state == 0) {
                    showsign = true;
                }
            }.bind(this));
            cc.dd._firstShowSign = true;
            Hall.HallData.Instance().showedSign = true;
            if (showsign) {
                cc.dd.UIMgr.openUI('blackjack_hall/prefabs/blackjack/hall/BlackJack_Hall_DailySign', function (prefab) {
                    prefab.getComponent('BlackJack_Hall_Daily_Sign').showClsoeBtn(true, this.showChongBangActivity.bind(this));
                }.bind(this));
                return;
            }
            //Hall.HallData.Instance().isSigned = false;
        }
        this.showChongBangActivity();
    },

    showChongBangActivity() {
        if (!this.showchongbang && Hall.HallData.Instance().rankActiveOpen && cc.game_pid < 10000 && !cc._isHuaweiGame) {
            // var pbObj = new cc.pb.rank.get_rank_activity_req();
            // cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_get_rank_activity_req, pbObj, 'get_rank_activity_req', true);
            // cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickChongBang');
            // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SPRING_FESTIVAL_ACTIVITY_AD);
            this.showchongbang = true;
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SPRING_FESTIVAL_ACTIVITY_AD);
        }

        this.showJiuji();
    },

    showJiuji() {
        var coin = hall_prop_data.getInstance().getCoin() + hall_prop_data.getInstance().getBankCoin();
        if (coin < 2000) {
            if (hallData.getInstance().jiuji_cnt > 0) {
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
                    var jiuji = ui.getComponent('klb_hall_jiuji');
                    if (jiuji != null) {
                        jiuji.update_buy_list(2000);
                    }
                }.bind(this));
            } else if (cc.game_pid != 2) {
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_GET_COIN);
            }

        }
    },

    showTaskUI: function () {
        if (cc._inviteTaskOpen) {
            var isopen = (cc.dd.user.regChannel >= 10000 && cc.dd.user.regChannel == cc.game_pid)
            if (isopen || cc._inviteTaskOpen) {
                var call = function () {
                    if (!cc._inviteTaskFinish && cc._inviteTaskRole) {
                        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_ZHUSHU, function (prefab) {
                            prefab.getComponent('klb_hall_ShareUI').setData(0);
                        }.bind(this));
                    }
                }
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHAREUI, function (prefab) {
                    prefab.getComponent('klb_hall_ShareUI').setCall(call);
                });
            }
        }
    },


    updateTaskGetTip: function (isShow) {
        //this.taskTip.active = isShow;
    },

    updateActiveTip: function () {
        if (hallData.getInstance().idNum == '' && !cc.dd.isCertified) {
            this.activeTip.active = true;
        } else {
            this.activeTip.active = false;
        }
        if (!Hall.HallData.Instance().showedActiveTip) {
            Hall.HallData.Instance().showedActiveTip = true;
            // this.activeTip.active = true;

            const req = new cc.pb.hall.hall_req_config_notice;
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_config_notice, req,
                '发送协议[id: ${cc.netCmd.hall.cmd_hall_req_config_notice}],hall_req_config_notice[获取公告信息]', true);
        }
    },


    updateTaskFlag() {
        this.taskTip.active = this.getTaskFinished();
    },

    getTaskFinished() {
        if (!cc._taskDataList)
            return false;
        let have = false;
        for (var i = 0; i < cc._taskDataList.length; i++) {
            if (cc._taskDataList[i].status == 2) {
                have = true;
                break;
            }
        }
        return have;
    },

    //判断是否是模块单包类型
    checkNewHall: function () {
        // if (cc._isAppstore)
        //     return 3;
        var channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == AppConfig.GAME_PID)
                return true;
        })
        if (!channel_games) return 0;
        return channel_games.type;
    },

    initHall() {
        Bsc_sendMsg.getActByType(1);

        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                AudioManager.playMusic('gamedl_majiang/audios/hall_dl_bg');
                if (cc._appstore_check || cc._androidstore_check || cc._isHuaweiGame)
                    return;
                var str = '领取更多游戏福利，添加官方微信客服 klbgame8888，文明游戏，禁止赌博!';
                Hall.HallED.notifyEvent(Hall.HallEvent.Get_PaoMoDeng_DL_Marquee, str);
                break;
        }
    },

    showHall: function (isCard) {
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                return;
        }

        var phone = daili_phone.getItem((item) => {
            return item.key == cc.game_pid;
        });
        if (phone && this.m_phoneLabel) {
            this.m_phoneLabel.string = phone.phone + '';
        }
        let config = game_channel_cfg.getItem((itemdata) => {
            return itemdata.channel == cc.game_pid;
        });

        this.goToGold();
    },

    onClickHall: function () {
        this.showHall();
        this.hallNode.active = false;
    },

    onEventMessage: function (event, data) {
        const self = this;
        switch (event) {
            case hallRoomEvent.INIT_ROOM_LIST:
                self.initAndOpenRoomUI(data);
                break;
            case hallRoomEvent.GAME_TYPE:
                cc.log(data.gameId);
                break;
            case Hall.HallEvent.GET_USERINFO:
                this.setUserInfo(hallData.getInstance());
                break;
            // case Hall.HallEvent.Rank_Info:
            //     this.showRank(data);
            //     break;
            case Hall.HallEvent.UPDATE_GAME_LIST:
                self.initGameList();
                self.initGameLogo();

                if (!this.needInitGold) {
                    this.loadGame();
                }
                break;
            case Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM:
                if (cc._appstore_check || cc._androidstore_check || cc._isHuaweiGame)
                    return;
                if (data > 0) {
                    if (!cc._useCardUI && !cc._useChifengUI) {
                        AudioManager.playSound("blackjack_hall/audios/message");
                        cc.dd.PromptBoxUtil.show("您有新邮件未阅读");
                    }
                }
                this.updateUnreadMail();
                break;
            case Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM_AND_NOTICE:
                if (cc._appstore_check)
                    return;
                this.updateUnreadMail();
                break;
            case Hall.HallEvent.ACTIVE_END:
                // if (data == 2)//活动结束
                //     this.activeShineNode.parent.active = false;
                // else
                //     this.activeShineNode
                break;
            case Hall.HallEvent.ACTIVE_BEGIN:
                // if(Hall.HallData.Instance().getActiveTag() == 1){
                //     self.activeShineNode.stopAllActions();
                //     self.activeShineNode.parent.active = true;
                //     var seq1 = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
                //     self.activeShineNode.runAction(cc.repeatForever(seq1));
                // }else{
                //     self.activeShineNode.parent.active = false;
                // }
                break;
            case Hall.HallEvent.DAILYSIGN_END:
            case HallCommonEvent.REAL_NAME_AUTHEN:
            // this.updateActiveTip();
            // break;
            case Hall.HallEvent.CLOSE_ACTIVE_TIP:
                this.updateActiveTip();
                break;
            case Hall.HallEvent.ACTIVE_LIST_UPDATE:
                this.activeListIconShow(data.activityList);
                break;
            case TaskEvent.TASK_CHANGE:
            // this.updateTaskGetTip(true);
            // break;
            case TaskEvent.TASK_FINISH:
                this.updateTaskGetTip(HallTask.Instance().checkTaskCanAward());
                break;
            case Hall.HallEvent.SHOW_DAILY_SIGN:
                this.showDailySign();
                break;
            case Hall.HallEvent.UIDATE_FXYL_UI:
                cc.log('UIDATE_FXYL_UI')
                this.showActive();
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                //this.initGameList();
                //this.initGameLogo();
                break;
            case Hall.HallEvent.TASK_INFO:
            case Hall.HallEvent.TASK_UPDATE:
                this.updateTaskFlag();
                break;
            case RoomEvent.on_choose_seat:
                // var hallRoom = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_ROOM);
                // if (hallRoom) {
                //     var choose = cc.find('klb_hall_Choose', hallRoom).getComponent('klb_hall_Choose');
                //     if (choose)
                //         choose.showChooseUI(data);
                // } else {
                //     var choose = this.chooseSeatNode.getComponent('klb_hall_Choose');
                //     if (choose)
                //         choose.showChooseUI(data);
                // }
                break;
            case Bsc_Event.BSC_FLUSH_INFO:
                var list = data[0];
                var active = false;
                if (list.infoList && list.infoList.length) {
                    for (var i = 0; i < list.infoList.length; i++) {
                        if (list.infoList[i].matchClass == 3) {
                            active = true;
                        }
                        // if (cc.dd.quickMatchType == 'sh_gold_match') {
                        //     if (list.infoList[i].gameType == cc.dd.Define.GameType.SH_MATCH) {
                        //         cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_match_detail', function (ui) {
                        //             ui.getComponent('klb_match_detail').showDetail(list.infoList[i]);
                        //         });
                        //         cc.dd.quickMatchType = null;
                        //     }
                        // }
                    }
                }
                break;
            case Hall.HallEvent.GET_Battle_History_LIST:
                var hallHistory = cc.dd.UIMgr.getUI(hall_prefab.BJ_HALL_RECORD);
                if (!hallHistory) {
                    cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_RECORD, function (ui) {
                        ui.getComponent('BlackJack_Hall_Record').initItem(data);
                    }.bind(this));
                }
                break;
            case Hall.HallEvent.CHIFENG_DAIKAI_HISTORY:
                var daikaiHistory = cc.dd.UIMgr.getUI(hall_prefab.CHIFENG_DAIKAI_HISTORY);
                this.combineData(data.detailList);
                if (!daikaiHistory) {
                    cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_DAIKAI_HISTORY, function (ui) {
                        ui.getComponent('chifeng_hall_daikai_history').initItem(this.battleList);
                    }.bind(this));
                }
                break;
            case RoomEvent.daikai_list_ret:
                var hallDaikai = cc.dd.UIMgr.getUI(hall_prefab.CHIFENG_DAIKAI);
                if (!hallDaikai) {
                    cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_DAIKAI, function (ui) {
                        ui.getComponent('chifeng_hall_daikai').initItem(data.roomListList);
                    }.bind(this));
                }
                break;
            case Hall.HallEvent.CHIFENG_LUCKY:
                if (this.luckyBtn) {
                    this.luckyBtn.active = cc._chifengLucky === true;
                }
                break;
            case cc.dd.UpdaterEvent.NEW_VERSION_FOUND:
                if (!cc.JOIN_FRIEND_AND_PLAY) {
                    return;
                }
                if (!cc._joinUpdater || !data || !data[0] || data[0].type != cc._joinUpdater.cfg.type) {
                    return;
                }
                if (cc._joinUpdater.entrance != 'entrance_join') {
                    return;
                }

                if (cc.dd.Utils.checkIsUpdateOrWrongRoom(cc._joinUpdater.cfg.game_id)) {
                    let name = '';
                    let config = klb_game_list_config.getItem(function (item) {
                        return item.gameid == cc._joinUpdater.cfg.game_id;
                    }.bind(this));
                    if (config) {
                        name = config.name
                    }
                    if (!cc.dd.UIMgr.getUI(hall_prefab.HALL_GAME_UPDATE)) {
                        cc.dd.UIMgr.openUI(hall_prefab.HALL_GAME_UPDATE, function (prefab) {
                            var update = prefab.getComponent('hall_game_update_of_dialog');
                            update.setGameID(cc._joinUpdater.cfg.game_id, name, cc._joinUpdater.roomId);
                        })
                    }
                } else {
                    cc.dd.DialogBoxUtil.show(0, "房间号错误", '确定', null, function () {

                    }.bind(this), null);
                }
                break;
            case cc.dd.UpdaterEvent.ALREADY_UP_TO_DATE:
                if (!cc.JOIN_FRIEND_AND_PLAY) {
                    return;
                }
                if (!cc._joinUpdater || !data || !data[0] || data[0].type != cc._joinUpdater.cfg.type) {
                    return;
                }
                if (cc._joinUpdater.entrance != 'entrance_join') {
                    return;
                }
                if (cc._join_room_updated) {
                    cc._join_room_updated();
                    cc._join_room_updated = null;
                }
                break;
            case Hall.HallEvent.DUIJIANG_OPEN_TIPS:
                var duijiang_time = '';
                if (data.tipTime >= 3600) {
                    duijiang_time = Math.floor(data.tipTime / 3600) + '小时';
                }
                else if (data.tipTime >= 60) {
                    duijiang_time = Math.floor(data.tipTime / 60) + '分钟';
                }
                else {
                    duijiang_time = data.tipTime + '秒';
                }
                cc.dd.PromptBoxUtil.show('兑大奖活动还有' + duijiang_time + '开奖，敬请期待');
                break;
            case Hall.HallEvent.RANK_ACTIVITY_STATE:
                let rankActivity = cc.find('Canvas/gold/klb_hall_mainui_userInfo/topNode/layout/chongbang')
                if (rankActivity) {
                    if (!this.showchongbang && Hall.HallData.Instance().rankActiveOpen && cc.game_pid < 10000 && !cc._isHuaweiGame) {
                        // var pbObj = new cc.pb.rank.get_rank_activity_req();
                        // cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_get_rank_activity_req, pbObj, 'get_rank_activity_req', true);
                        // cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickChongBang');
                        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SPRING_FESTIVAL_ACTIVITY_AD);
                        if (cc.dd.isLoginTanchu && !cc.dd.UIMgr.getUI('blackjack_hall/prefabs/daily_active/klb_hall_daily_active_QD')) {
                            this.showchongbang = true;
                            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SPRING_FESTIVAL_ACTIVITY_AD);
                        }
                    }
                }
                break;
            default:
                break;
        }
    },

    goToCard() {
        if (this.checkNewHall() == 3) {
            this.cardNode.active = true;
            this.goldNode.active = true;

            this.newHall2.active = true;
            this.newHall3.active = false;

            this.hallNode.active = false;

            if (this.needInitCard) {
                this.updateUnreadMail();
                var self = this;

                // var delay = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                //     // if(Hall.HallData.Instance().getActiveTag() == 1){
                //     //     self.activeShineNode.stopAllActions();
                //     //     self.activeShineNode.parent.active = true;
                //     //     var seq1 = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
                //     //     self.activeShineNode.runAction(cc.repeatForever(seq1));
                //     // }else{
                //     //     self.activeShineNode.parent.active = false;
                //     // }

                //     var msg = new cc.pb.rank.msg_activity_info_req();
                //     cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_activity_info_req, msg, 'msg_activity_info_req', true);
                //     self.updateActiveTip();
                //     self.updateTaskGetTip(HallTask.Instance().checkTaskCanAward());
                //     self.updateTaskFlag();
                //     self.showNAtionalDayActive();
                // }));
                // this.node.runAction(delay);
                cc.tween(this.node)
                    .delay(0.5)
                    .call(function () {
                        // if(Hall.HallData.Instance().getActiveTag() == 1){
                        //     self.activeShineNode.stopAllActions();
                        //     self.activeShineNode.parent.active = true;
                        //     var seq1 = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
                        //     self.activeShineNode.runAction(cc.repeatForever(seq1));
                        // }else{
                        //     self.activeShineNode.parent.active = false;
                        // }

                        var msg = new cc.pb.rank.msg_activity_info_req();
                        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_activity_info_req, msg, 'msg_activity_info_req', true);
                        self.updateActiveTip();
                        self.updateTaskGetTip(HallTask.Instance().checkTaskCanAward());
                        self.updateTaskFlag();
                    })
                    .start();
            }
            this.needInitCard = false;
            this.game_gounp_opened.node.active = false;

            if (cc._useCardUI) {
                this.changeToJinBiNode.active = false;
                this.xinxiNode.active = false;
            } else {
                this.changeToJinBiNode.active = true;
            }
        } else {
            this.cardNode.active = true;
            this.goldNode.active = false;

            this.newHall2.active = false;
            this.newHall3.active = true;
        }

        this.changeToFangKaNode.active = false;

        this.userGoldNode.active = false;
        this.userCardNode.active = true;
    },

    goToGold() {
        if (this.needInitGold) {
            this.loadGame();

            // var seq = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
            // this.fudaiShineNode.runAction(cc.repeatForever(seq));
            cc.tween(this.fudaiShineNode)
                .set({ opacity: 0 })
                .to(0.8, { opacity: 255 })
                .to(0.8, { opacity: 0 })
                .union()
                .repeatForever()
                .start();

            var self = this;

           
            cc.tween(this.node)
                .delay(0.5)
                .call(function () {
                    

                    var msg = new cc.pb.rank.msg_activity_info_req();
                    cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_activity_info_req, msg, 'msg_activity_info_req', true);
                    self.updateActiveTip();
                    self.updateTaskGetTip(HallTask.Instance().checkTaskCanAward());
                    self.updateTaskFlag();
                })
                .start();
           

            this.updateUnreadMail();
           
        }
        this.needInitGold = false;

        // this.cardNode.active = false;
        // this.goldNode.active = true;
        // this.hallNode.active = true;

        // this.userGoldNode.active = true;
        // this.userCardNode.active = false;
    },

    loadGame() {
        this.gameScrollView.removeAllChildren(true);

        var gameList = [];
        for (var i = 0; i < hallGameList.gameList.length; i++) {

            // if (cc._applyForPayment) {
            //     let id = hallGameList.gameList[i].game_id;
            //     let gameType = cc.dd.Define.GameType;
            //     if (id == gameType.DSZ_GOLD || id == gameType.NEW_DSZ_GOLD || id == gameType.PAOYAO_GOLD || id == gameType.TDK_COIN || id == gameType.SH_GOLD || id == gameType.NN_GOLD || id == gameType.BRNN_GOLD || hallGameList.gameList[i].name == '小刺激' || hallGameList.gameList[i].name == '捕鱼合集' || hallGameList.gameList[i].name == '打地鼠' || hallGameList.gameList[i].type == GAME_ITME_TYPE.RedBag_FUNCTION) {
            //         continue;
            //     }
            // }

            if (hallGameList.gameList[i].game_id != 129) {
                gameList.push(hallGameList.gameList[i]);
            }
        }

        for (let index = 0; index < gameList.length; index++) {

                var gameItemNode = cc.instantiate(this.prefab);
                var gameItemUI = gameItemNode.getComponent("klb_hall_GameItemUI");
                gameItemUI.setData(gameList[index], null);
                this.gameScrollView.addChild(gameItemUI.node);
        }
    },

    onCallCreate: function (event) {
        this.roomBtnCallBack(event, 'C_ROOM');
    },

    onClickJiaru: function (event) {
        this.roomBtnCallBack(event, 'J_ROOM');
    },

    onClickQinyou: function (event) {
        this.roomBtnCallBack(event, 'C_CLUB');
    },

    onClickBiSai: function (event) {
        this.roomBtnCallBack(event, 'J_MATCH');
    },

    onClickGotoGold: function (event) {
        this.roomBtnCallBack(event, 'GOLD');
    },

    copyBtn: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var string = '';
        switch (parseInt(data)) {
            case 1:
                string = 'XLdl001';
                break;
            case 2:
                if (this.m_phoneLabel)
                    string = this.m_phoneLabel.string;
                else
                    string = '17052495555';
                break;
            case 3:
                string = 'XLcs003';
                break;
        }

        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(string);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },


    //打开公告
    clickNotice(evnet, custom) {
        hall_audio_mgr.com_btn_click();
        if (cc._useChifengUI) {
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_NOTICE)
        } else {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_STATEMENT);
        }
    },

    //打开客服
    clickKefu(evnet, custom) {
        hall_audio_mgr.com_btn_click();
        if (cc._useChifengUI || cc.game_pid == 10002) {
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_KEFU);
        } else {
            // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
            //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
            // });
            let Platform = require('Platform');
            let AppCfg = require('AppConfig');
            cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
        }
    },


    //打开代开
    clickDaikai(event, custom) {
        hall_audio_mgr.com_btn_click();
        var pbObj = new cc.pb.room_mgr.msg_friend_create_room_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_friend_create_room_req, pbObj, 'msg_friend_create_room_req', true);
    },

    //打开分享
    clickShare(evnet, custom) {
        hall_audio_mgr.com_btn_click();
        if (cc._useChifengUI || cc._useCardUI) {
            if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
                var share = window.localStorage.getItem("SHARE_URL");
                // window.localStorage.setItem("SHARE_URL",share+ "?roomid=" + roomID);
                wx.updateTimelineShareData({
                    title: '【巷乐游戏】', // 分享标题
                    link: share, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://xlqp.yuejiegame.cn/icon.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }

                });

                wx.updateAppMessageShareData({
                    title: '【巷乐游戏】', // 分享标题
                    desc: '超好玩的棋牌游戏', // 分享描述
                    link: share, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://xlqp.yuejiegame.cn/icon.png', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_wx_share_tip_h5', function (prefab) {
                    var Component = prefab.getComponent('klb_wx_share_h5');
                    Component.onInvite(info.roomid);
                });

            } else
                cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_SHARE);
        } else {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHARE, function (ui) {
                var share_ui = ui.getComponent('klb_hall_share');
                if (share_ui != null) {
                    let shareItem = cc.dd.Utils.getRandomShare();
                    if (!cc.dd._.isNull(shareItem)) {
                        var title = shareItem.title;
                        var content = shareItem.content;
                        share_ui.setShareData(title, content);
                        share_ui.setFirstShare();
                    }

                }
            }.bind(this));
        }
    },


    //打开设置
    clickQuit(event, custom) {
        hall_audio_mgr.com_btn_click();
        cc.dd.DialogBoxUtil.show(0, '是否退出游戏', '确认', '取消', function () {
            cc.game.end();
        }, null);
    },

    clickExchange() {
        // if (hallData.getInstance().idNum == '') {
        //     cc.dd.PromptBoxUtil.show('请先完善实名认证信息再进行兑换');
        //     return;
        //
        // }
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_MY_EXCHANGE);
    },

    clickLucky() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_LOTTERY_TICKET, function (node) {
            TaskED.notifyEvent(TaskEvent.LOTTERY_UPDATE_HISTORY, null);
        }.bind(this));
    },

    //合并战绩(分段消息)
    combineData(datalist) {
        if (this.battleList == null) {
            this.battleList = [];
        }
        if (datalist && datalist.length) {
            for (var i = 0; i < datalist.length; i++) {
                if (!this.battleList.find((data) => { return (data.roomId == datalist[i].roomId && data.historyId == datalist[i].historyId); })) {
                    this.battleList.push(datalist[i]);
                }
            }
        }
        this.battleList.sort((a, b) => { return b.timestamp - a.timestamp; });
    },
});

module.exports = hall;
