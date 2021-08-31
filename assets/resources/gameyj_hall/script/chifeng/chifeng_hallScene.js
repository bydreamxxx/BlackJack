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
let prefab_config = require('klb_friend_group_prefab_cfg');
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

cc.Class({
    extends: cc.Component,

    properties: {
        creatRoomNode: cc.Node,
        joinRoomNode: cc.Node,
        chooseSeatNode: cc.Node,
        logo: cc.Sprite,

        colorBtns: [cc.Node],

        adStitle: cc.Label,

        noMatch: cc.Node,
        match: cc.Node,
        luckyBtn: cc.Node,
        goldBtn: cc.Node,

        friendNode: cc.Node,
        goldNode: cc.Node,

        activeTip: cc.Node,
        taskTip: cc.Node,
        gamePageView: { default: null, type: cc.PageView, tooltip: "游戏列表pageview" },
        prefab: cc.Prefab,
        game_group_closed_prefab: cc.Prefab,
        game_gounp_opened: require('game_group_opened'),
    },

    // use this for initialization
    onLoad: function () {
        this.needInitGold = true;
        this.needInitGoldUserInfo = true;
        this.needInitFriendUserInfo = true;
        cc.log('进入大厅----');
        DingRobot.set_ding_type(0);
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
        cc.dd.SysTools.setLandscape();
        this.onCompleted();

        dd.AudioChat.clearUsers();
        hallRoomEventDispatcher.addObserver(this);
        TaskED.addObserver(this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.goToFriend();

        let str = '';


        let config = game_channel_cfg.getItem((itemdata) => {
            return itemdata.channel == cc.game_pid;
        });
        if (config) {
            this.adStitle.string = config.guanggao;
        }

        if (cc.game_pid == 10008) {
            str = '欢迎使用赤峰乌丹麻将，适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活，文明娱乐，禁止赌博。';

            this.noMatch.active = false;
            this.match.active = true;
            this.goldBtn.active = false;
            this.luckyBtn.active = cc._chifengLucky === true;
        } else if (cc.game_pid == 10010) {
            str = '欢迎使用赤峰平庄麻将，适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活，文明娱乐，禁止赌博。';
            this.noMatch.active = true;
            this.match.active = false;
            this.goldBtn.active = false;
        } else if (cc.game_pid == 10003) {
            str = '本游戏仅供娱乐，严禁赌博，一经发现，立即封停账号并上报公安机关。';
            this.noMatch.active = false;
            this.match.active = false;
            this.goldBtn.active = true;
        } else if (cc.game_pid == 10004) {
            str = '本游戏仅供娱乐，严禁赌博，一经发现，立即封停账号并上报公安机关。';
            this.noMatch.active = false;
            this.match.active = false;
            this.goldBtn.active = true;
        } else {
            str = '欢迎使用祥云赤峰麻将，适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活，文明娱乐，禁止赌博。';
            this.noMatch.active = false;
            this.match.active = false;
            this.goldBtn.active = true;
        }

        for (var i = 0; i < this.colorBtns.length; i++) {
            cc.dd.ButtonUtil.setButtonEvent(this.colorBtns[i]);
        }


        Hall.HallED.notifyEvent(Hall.HallEvent.Get_PaoMoDeng_DL_Marquee, str);

        AudioManager.playMusic('gameyj_hall/audios/bg_music10');

        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            this._Marquee.getComponent('com_marquee').updatePosition(0.83);
        }
    },


    start: function () {//因为需要 获取玩家是不是游戏中，，， 为啥不在登录时带回  而需要重新发 而且是每次都发
        //关闭游戏背景音乐

        this.setUserInfo(hallData.getInstance());

        if (cc.dd._.isString(cc.wx_enter_room_id) && cc.wx_enter_room_id != "") {
            let wx_enter_room_id = parseInt(cc.wx_enter_room_id);
            cc.wx_enter_room_id = null;
            let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
            msg.setRoomId(wx_enter_room_id);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req', true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onStop');
        } else if (cc.dd._.isString(cc.wx_enter_club_id) && cc.wx_enter_club_id != "") {
            cc.dd.SceneManager.replaceScene('chifeng_hallScene');
        }
    },


    onDestroy: function () {
        hallRoomEventDispatcher.removeObserver(this);
        Hall.HallED.removeObserver(this);
        TaskED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        AudioManager.stopMusic();
        RoomED.removeObserver(this);
        AudioManager.stopMusic();
    },


    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.KEY.back:
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
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_USERINFO)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_USERINFO);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_MAP_ADD_GAME)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_MAP_ADD_GAME);
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
     * 设置玩家信息
     */
    setUserInfo: function (userData) {
        if (this.friendNode.active) {
            this.needInitFriendUserInfo = false;
            let user1 = cc.find('Canvas/friend/klb_hall_mainui_userInfo');
            if (user1) {
                let userinfo = user1.getComponent('klb_hall_UserInfo');
                if (userinfo) {
                    userinfo.setData(userData);
                }
            }
        } else {
            this.needInitGoldUserInfo = false;
            let user2 = cc.find('Canvas/gold/klb_hall_mainui_userInfo');
            if (user2) {
                let userinfo = user2.getComponent('klb_hall_UserInfo');
                if (userinfo) {
                    userinfo.setData(userData);
                }
            }
        }
    },

    //玩家信息
    userBtnCallBack: function () {
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_USERINFO, function (ui) {
            ui.getComponent('klb_hall_UserInfo').setData(hallData.getInstance());
        }.bind(this));
    },

    //打开商城
    clickShop(event, custom) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_SHOP, function (ui) {

        }.bind(this));
    },

    //打开公告
    clickNotice(evnet, custom) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_NOTICE, function (ui) {

        }.bind(this));
    },

    //打开客服
    clickKefu(evnet, custom) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_KEFU, function (ui) {

        }.bind(this));
    },

    //打开战绩
    clickHistory(event, custom) {
        hall_audio_mgr.com_btn_click();
        HallSendMsgCenter.getInstance().sendBattleHistory(0);
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
        cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_SHARE, function (ui) {

        }.bind(this));
    },

    //打开设置
    clickSetting(event, custom) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_SETTING, function (ui) {

        }.bind(this));
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

    //玩家信息
    userBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_USERINFO);
    },

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
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_WELFAREBAG);
                break;
            case 'RANK'://排行榜
                var pbObj = new cc.pb.rank.msg_rank_get_rank_list_2s();
                pbObj.setType(1);
                cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_rank_get_rank_list_2s, pbObj, 'msg_rank_get_rank_list_2s', true);
                break;
            case 'MORE'://更多
                this.moreNode.active = true;
                var ani = this.moreNode.getChildByName('ScrollView').getChildByName('view').getComponent(cc.Animation);
                ani.play('klb_hall_more_show');
                break;
            case 'BAG':
                hall_audio_mgr.com_btn_click();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BAG, function (ui) {
                    //ui.getComponent('klb_hall_BagUI').updateBagUI();
                }.bind(this));
                break;
            case 'KEFU':
                hall_audio_mgr.com_btn_click();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
                    prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
                });
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

                hall_audio_mgr.com_btn_click();
                this.creatRoomNode.active = true;
                var Component = this.creatRoomNode.getComponent("chifeng_createRoom");
                Component.showGameList(0);
                var ani = this.creatRoomNode.getChildByName('actionnode').getComponent(cc.Animation);
                ani.play('klb_hall_createRoom');
                break;
            case 'J_ROOM'://进入房间
                hall_audio_mgr.com_btn_click();
                this.joinRoomNode.active = true;
                break;
            case 'C_CLUB'://进入房间
                hall_audio_mgr.com_btn_click();
                // cc.dd.SceneManager.replaceScene('club_new');
                cc.dd.SceneManager.replaceScene('klb_friend_group_scene');
                break;
            case 'J_MATCH':
                cc.dd.quickMatchType = 'wdmj_bi_sai_chang';
                cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
                    node.getComponent('klb_hall_Match').sendGetMatch(1);
                }.bind(this));
                break;
            case 'GOLD':
                if (cc.game_pid == 10006) {
                    this.goToGold();
                    if (this.needInitGoldUserInfo) {
                        this.setUserInfo(hallData.getInstance());
                    }
                }
                break;
            case 'FRIEND':
                this.goToFriend();
                if (this.needInitFriendUserInfo) {
                    this.setUserInfo(hallData.getInstance());
                }
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
                var pref = cc.resources.get('gameyj_common/prefab/Marquee', cc.Prefab);
                var Marquee = cc.instantiate(pref);
                cc.director.getScene().addChild(Marquee);
                cc.game.addPersistRootNode(Marquee);
            }
            if (cc.find('klb_friend_group_redbag') == null) {
                var pref = cc.resources.get('gameyj_common/prefab/klb_friend_group_redbag', cc.Prefab);
                var fg_redBag = cc.instantiate(pref);
                cc.director.getScene().addChild(fg_redBag);
                cc.game.addPersistRootNode(fg_redBag);
            }
            if (cc.find('klb_friend_group_invite_answer') == null) {
                var pref = cc.resources.get('gameyj_common/prefab/klb_friend_group_invite_answer', cc.Prefab);
                var fg_redBag = cc.instantiate(pref);
                cc.director.getScene().addChild(fg_redBag);
                cc.game.addPersistRootNode(fg_redBag);
            }
            // HallSendMsgCenter.getInstance().requestCheckReconnect();
            //HallSendMsgCenter.getInstance().sendBagItemList();
            HallSendMsgCenter.getInstance().sendDefaultBroadcastInfo();

        }
    },

    initAndOpenRoomUI: function (data) {
        // var seq = cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
        //     var gameItem = klb_game_list_config.getItem(function (item) {
        //         if (item.gameid == data.hallGameid)
        //             return item
        //     })
        //     if (gameItem.isxiaociji == 0) { //常规游戏
        //         switch (data.hallGameid) {
        //             case 109://疯狂拼十
        //             case Define.GameType.HBSL_GOLD://红包扫雷
        //             case 103: //单挑
        //             case 104: //飞禽走兽
        //             case 105: //西游记
        //                 var enterfunc = function () {
        //                     if (data.roomlistList && data.roomlistList.length) {
        //                         var entermin = 0;
        //                         game_room_list.items.forEach(function (roomItem) {
        //                             if (data.hallGameid == roomItem.gameid && roomItem.roomid == data.roomlistList[0].fangjianid) {
        //                                 var scriptData = require('brnn_data').brnn_Data.Instance();
        //                                 scriptData.setData(roomItem);
        //                                 entermin = roomItem.entermin;
        //                             }
        //                         }.bind(this));
        //                         if (hall_prop_data.getInstance().getCoin() < entermin) {
        //                             var tipsText = '金币不足' + entermin + ',不能进入';
        //                             cc.dd.DialogBoxUtil.show(0, tipsText, "确定");
        //                         }
        //                         else {
        //                             var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        //                             msg.setGameType(data.hallGameid);
        //                             msg.setRoomId(data.roomlistList[0].fangjianid);
        //                             cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        //                         }
        //                     }
        //                     else {
        //                         cc.dd.PromptBoxUtil.show('当前禁止该游戏，请联系管理员');
        //                     }
        //                 };
        //                 if (hallData.getInstance().gameId > 0) {    //游戏恢复
        //                     if (hallData.getInstance().gameId == data.hallGameid) {
        //                         var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        //                         msg.setGameType(hallData.getInstance().gameId);
        //                         cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        //                     }
        //                     else {
        //                         var itemgame = klb_game_list_config.getItem(function (item) {
        //                             if (item.gameid == hallData.getInstance().gameId)
        //                                 return item;
        //                         })
        //                         var str = '您正在[' + itemgame.name + ']房间中游戏，大约30秒后自动进入新游戏。。。'
        //                         cc.dd.DialogBoxUtil.show(0, str, '回到房间', '取消', function () {
        //                             var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        //                             msg.setGameType(hallData.getInstance().gameId);
        //                             cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        //                         }, null);
        //                         cc.dd.DialogBoxUtil.setWaitGameEnd(enterfunc);
        //                     }
        //                 }
        //                 else {
        //                     enterfunc();
        //                 }
        //                 break;
        //             case 136://新斗三张
        //                 dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_hall_Room', function (prefab) {
        //                     var Component = prefab.getComponent('new_dsz_hall_room');
        //                     Component.initRoomUI(data);
        //                 });
        //                 break;
        //             case 138://捕鱼
        //                 dd.UIMgr.openUI('gameyj_fish/prefabs/fish_hall_Room', function (prefab) {
        //                     var Component = prefab.getComponent('gameyj_Fish_Room');
        //                     Component.initRoomUI(data);
        //                 });
        //                 break;
        //             default:
        //                 switch (AppConfig.GAME_PID) {
        //                     case 2: //快乐吧麻将
        //                     case 3: //快乐吧农安麻将
        //                     case 4:  //快乐吧填大坑
        //                     case 5:  //快乐吧牛牛 
        //                         {
        //                             dd.UIMgr.openUI(hall_prefab.KLB_DL_HALL_ROOM, function (prefab) {
        //                                 var Component = prefab.getComponent('klb_hall_Room');
        //                                 Component.initRomUI(data);
        //                             });
        //                             break;
        //                         }
        //                     default:
        //                         dd.UIMgr.openUI(hall_prefab.KLB_HALL_ROOM, function (prefab) {
        //                             var Component = prefab.getComponent('klb_hall_Room');
        //                             Component.initRomUI(data);
        //                         });
        //                 }
        //                 break;
        //         }
        //     } else {
        //         var entermin = null;
        //         game_room_list.items.forEach(function (roomItem) {
        //             if (data.hallGameid == roomItem.gameid) {
        //                 if (entermin == null)
        //                     entermin = roomItem.entermin;
        //                 else
        //                     entermin = Math.min(entermin, roomItem.entermin);
        //             }
        //         }.bind(this));
        //         if (hall_prop_data.getInstance().getCoin() < entermin) {
        //             var tipsText = '金币不足' + entermin + ',不能进入';
        //             cc.dd.DialogBoxUtil.show(0, tipsText, "确定");
        //         }
        //         else {
        //             var gSlotMgr = require('SlotManger').SlotManger.Instance();
        //             gSlotMgr.enterGame(gameItem.gameid, 0);
        //         }
        //     }
        // }));
        // this.node.runAction(seq);
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
                            };
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
                                    cc.dd.DialogBoxUtil.show(0, str, '回到房间', '取消', function () {
                                        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                                        msg.setGameType(hallData.getInstance().gameId);
                                        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                                    }, null);
                                    cc.dd.DialogBoxUtil.setWaitGameEnd(enterfunc);
                                }
                            }
                            else {
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
                        default:
                            switch (AppConfig.GAME_PID) {
                                case 2: //快乐吧麻将
                                case 3: //快乐吧农安麻将
                                case 4:  //快乐吧填大坑
                                case 5:  //快乐吧牛牛 
                                    {
                                        dd.UIMgr.openUI(hall_prefab.KLB_DL_HALL_ROOM, function (prefab) {
                                            var Component = prefab.getComponent('klb_hall_Room');
                                            Component.initRomUI(data);
                                        });
                                        break;
                                    }
                                default:
                                    dd.UIMgr.openUI(hall_prefab.KLB_HALL_ROOM, function (prefab) {
                                        var Component = prefab.getComponent('klb_hall_Room');
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
                this.needInitGoldUserInfo = true;
                this.needInitFriendUserInfo = true;
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
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                //this.initGameList();
                //this.initGameLogo();
                break;
            case RoomEvent.on_choose_seat:
                var hallRoom = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_ROOM);
                if (hallRoom) {
                    var choose = cc.find('klb_hall_Choose', hallRoom).getComponent('klb_hall_Choose');
                    if (choose)
                        choose.showChooseUI(data);
                } else {
                    var choose = this.chooseSeatNode.getComponent('klb_hall_Choose');
                    if (choose)
                        choose.showChooseUI(data);
                }
                break;
            case Hall.HallEvent.GET_Battle_History_LIST:
                var hallHistory = cc.dd.UIMgr.getUI(hall_prefab.CHIFENG_HISTORY);
                if (!hallHistory) {
                    cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_HISTORY, function (ui) {
                        ui.getComponent('chifeng_hall_history').initItem(data);
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
                this.luckyBtn.active = cc._chifengLucky === true;
                break;
            case Hall.HallEvent.CLOSE_ACTIVE_TIP:
                this.updateActiveTip();
                break;
            default:
                break;
        }
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

    requestVIPInfo: function () {
        var msg = new cc.pb.rank.msg_vip_open();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_vip_open, msg, 'msg_vip_open', true);
    },

    updateActiveTip: function () {
        if ((Hall.HallData.Instance().sign_data && !Hall.HallData.Instance().isSigned) || (hallData.getInstance().idNum == '' && !cc.dd.isCertified)) {
            this.activeTip.active = true;
        } else {
            this.activeTip.active = false;
        }
        if (!Hall.HallData.Instance().showedActiveTip) {
            Hall.HallData.Instance().showedActiveTip = true;
            this.activeTip.active = true;

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

    /**
     * 更新未读邮件红点
     */
    updateUnreadMail() {
        var unread = hallData.getInstance().unread_mail_num;
        unread = unread || 0;
        cc.find('gold/xinxi/hongdian/num', this.node).getComponent(cc.Label).string = unread.toString();
        if (unread > 0) {
            cc.find('gold/xinxi/hongdian', this.node).active = true;
        }
        else {
            cc.find('gold/xinxi/hongdian', this.node).active = false;
        }
    },

    onClickMail: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_NOTICE, function (prefab) {
            var comp = prefab.getComponent('klb_hall_Notice');
            comp.initType(2);
        });
    },

    //显示日常活动
    onClickShowDailyActivities: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY, function (prefab) {
            prefab.getComponent('klb_hall_daily_activeUI').showDefaultSelect();
        });

    },

    goToFriend() {
        this.friendNode.active = true;
        this.goldNode.active = false;
    },

    goToGold() {
        if (this.needInitGold) {
            this.loadGame();

            this.requestVIPInfo();
            var self = this;
            // var delay = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            //     self.updateActiveTip();
            //     self.updateTaskFlag();
            // }));
            // this.node.runAction(delay);
            cc.tween(this.node)
                .delay(0.5)
                .call(function () {
                    self.updateActiveTip();
                    self.updateTaskFlag();
                })
                .start();
            this.updateUnreadMail();

            this.game_gounp_opened.node.active = false;
        }
        this.needInitGold = false;
        this.friendNode.active = false;
        this.goldNode.active = true;
    },

    loadGame() {
        this.gamePageView.removeAllPages();
        cc.dd.ResLoader.loadPrefab("gameyj_hall/prefabs/klb_hall_GameListPage", function (Prefab) {
            var gameList = [];
            for (var i = 0; i < hallGameList.gameList.length; i++) {
                if (hallGameList.gameList[i].game_id == cc.dd.Define.GameType.DDZ_XYJBC) {
                    continue;
                }
                if (cc.game_pid == 10006 && hallGameList.gameList[i]._type == 'add_game') {
                    continue;
                }
                if (hallGameList.gameList[i].game_id != 129) {
                    gameList.push(hallGameList.gameList[i]);
                }
            }

            const count = gameList.length;
            const COUNT_PER_PAGE = 10;
            const maxPage = Math.ceil(count / COUNT_PER_PAGE);
            for (let i = 0; i < maxPage; i++) {
                let page = this.gamePageView.getPages()[i];
                if (!page) {
                    page = cc.instantiate(Prefab);
                    this.gamePageView.addPage(page);
                }
                page.removeAllChildren(true);
                for (let j = 0; j < COUNT_PER_PAGE; j++) {
                    let index = j + i * COUNT_PER_PAGE;
                    if (index < count) {
                        if (gameList[index].game_list) { //合集
                            let game_group_closed = cc.instantiate(this.game_group_closed_prefab).getComponent("game_group_closed");
                            page.addChild(game_group_closed.node);
                            game_group_closed.setData(gameList[index]);
                        } else {
                            var gameItemNode = cc.instantiate(this.prefab);
                            var gameItemUI = gameItemNode.getComponent("klb_hall_GameItemUI");
                            gameItemUI.setData(gameList[index], null);
                            page.addChild(gameItemUI.node);
                        }
                        var cpt = gameItemUI.getComponent(cc.Toggle);
                        cpt.toggleGroup = page;
                    }
                }
            }
            var indicator = this.gamePageView.getComponentInChildren('custom_indicator');
            indicator.updatePageNum();
        }.bind(this));
    }
});
