const Hall = require('jlmj_halldata');
var hallData = require('hall_common_data').HallCommonData;
var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
let UpdaterEntrance = require("Updater").UpdaterEntrance;
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
const HallCommonEvent = require('hall_common_data').HallCommonEvent;
const HallCommonEd = require('hall_common_data').HallCommonEd;
var WxED = require("com_wx_data").WxED;
var WxEvent = require("com_wx_data").WxEvent;
var shopEd = require('hall_shop').shopED;
var shopEvent = require('hall_shop').shopEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var game_duli = require('game_duli');
var AppConfig = require('AppConfig');
var hall_prefab = require('hall_prefab_cfg');
const data_shop = require('shop');
var login_module = require('LoginModule');
const Bsc_sendMsg = require('bsc_sendMsg');
const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
const HallSendMsgCenter = require('HallSendMsgCenter');
const hallRoomEventDispatcher = require("klb_hall_RoomData").HallRoomEventDispatcher;
const hallRoomEvent = require("klb_hall_RoomData").HallRoomDataEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        nameTTF: cc.Label,
        zuanshiTTF: cc.Label,
        headSp: cc.Sprite,
        ID_TTF: cc.Label,
        scNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.dd.SysTools.setLandscape();

        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        WxED.addObserver(this);
        shopEd.addObserver(this);
        RoomED.addObserver(this);
        Bsc_ED.addObserver(this);
        hallRoomEventDispatcher.addObserver(this);


        if (!cc.gateNet.Instance().isConnected()) {
            login_module.Instance().reconnectWG();
        } else {
            if (cc.find('Marquee') == null) {
                var pref = cc.loader.getRes('gameyj_common/prefab/Marquee', cc.Prefab);
                var Marquee = cc.instantiate(pref);
                cc.director.getScene().addChild(Marquee);
                cc.game.addPersistRootNode(Marquee);
            }

            HallSendMsgCenter.getInstance().sendDefaultBroadcastInfo();
        }

        cc.dd.AudioChat.clearUsers();

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.initHall();

        var shopNode = cc.find('Canvas/bottomNode/shopBtn');
        if (shopNode && cc._androidstore_check) {
            shopNode.active = false;
        }
    },

    onDestroy() {
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        WxED.removeObserver(this);
        shopEd.removeObserver(this);
        RoomED.removeObserver(this);
        Bsc_ED.removeObserver(this);
        hallRoomEventDispatcher.removeObserver(this);

    },

    initHall() {
        Bsc_sendMsg.getActByType(1);
        AudioManager.playMusic('resources/gamedl_majiang/audios/hall_dl_bg.mp3');

        if (cc._appstore_check || cc._androidstore_check || cc._isHuaweiGame)
            return;
        // var str = '领取更多游戏福利，添加官方微信客服 klbgame8888，文明游戏，禁止赌博!';
        // Hall.HallED.notifyEvent(Hall.HallEvent.Get_PaoMoDeng_DL_Marquee, str);
    },

    initAndOpenRoomUI: function (data) {
        cc.dd.UIMgr.openUI(hall_prefab.KLB_DL_HALL_ROOM, function (prefab) {
            var Component = prefab.getComponent('klb_hall_Room');
            Component.initRomUI(data);
        });
    },

    start() {
        this.setUserInfo(hallData.getInstance());

        this.updater_entrance = UpdaterEntrance.COIN;
        let com_game_download = this.node.getComponent('com_game_update');
        if (com_game_download) {
            com_game_download.updater_entrance = this.updater_entrance;
            com_game_download.node.active = true;
            com_game_download.updateUI(false);
        }

        // let btn = cc.find('Canvas/bottomNode/Layout/qiandao');
        // if (btn) {
        //     btn.active = Hall.HallData.Instance().sign_data != null;
        // }

        // this.showDLActive();
        this.updateUnreadMail();
        this.updateFirstBuy();
    },

    showDLActive() {
        let func = ()=>{
            if (!cc._showActivity) {
                cc._showActivity = true;

                // cc.dd.UIMgr.openUI(hall_prefab.KLB_DL_HALL_SPRING_FESTIVAL_ACTIVITY);
            }
        }

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
                cc.dd.UIMgr.openUI(hall_prefab.KLB_DL_HALL_SIGN, function (prefab) {
                    prefab.getComponent('klb_hall_daily_sign').showClsoeBtn(true, func);
                }.bind(this));
                return;
            }
        }
        func();
    },

    /**
     * 设置玩家信息
     */
    setUserInfo: function (userData) {
        cc.dd.SysTools.loadWxheadH5(this.headSp, userData.headUrl);
        this.updateNick(userData.nick);
        this.zuanshiTTF.string = this.changeNumToCHN(HallPropData.getCoin()) || '0';
        this.ID_TTF.string = userData.userId.toString();
    },

    /**
     * 设置头像
     */
    onSetHeadSp: function (sp, openid) {
        this.headSp.spriteFrame = sp;
    },

    /**
     * 购买商品成功
     */
    onShopSuccess: function () {
        cc.dd.NetWaitUtil.close();
        cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_5);
    },

    /**
     * 金币场
     */
    onClickJinBi: function () {
        hall_audio_mgr.com_btn_click();
        var config = game_duli.getItem(function (cfg) {
            if (cfg.pID == AppConfig.GAME_PID)
                return cfg;
        }.bind(this));
        if (!config) return;
        this.gameType = config.gameid;
        this.updater = UpdateMgr.getUpdater(this.gameType);
        if (cc.sys.isNative && this.updater) {
            if (this.updater.updateing) {
                cc.dd.PromptBoxUtil.show('游戏正在下载中,请稍等!');
                return;
            }
            if (this.updater.checking) {
                cc.log("正在检测更新中");
                return;
            }
            //设置游戏更新完成回调,游戏更新id
            let com_game_download = this.node.getComponent('com_game_update');
            com_game_download.updater_entrance = this.updater_entrance;
            this.updater.cfg.game_id = this.gameType;
            com_game_download.setUpdateFinishCallback(this.getRoomList.bind(this));
            com_game_download.setGameId(this.gameType);
            this.updater.checkUpdate(this.updater_entrance);
        } else {
            this.getRoomList();
        }
    },

    onClickMatch() {
        hall_audio_mgr.com_btn_click();

        let callback = () => {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_DL_HALL_MATCH, function (node) {
                node.getComponent('gamedl_match').sendGetMatch(1);
            }.bind(this));
        }

        var config = game_duli.getItem(function (cfg) {
            if (cfg.pID == AppConfig.GAME_PID)
                return cfg;
        }.bind(this));
        if (!config) return;
        this.gameType = config.gameid;
        this.updater = UpdateMgr.getUpdater(this.gameType);
        if (cc.sys.isNative && this.updater) {
            if (this.updater.updateing) {
                cc.dd.PromptBoxUtil.show('游戏正在下载中,请稍等!');
                return;
            }
            if (this.updater.checking) {
                cc.log("正在检测更新中");
                return;
            }
            //设置游戏更新完成回调,游戏更新id
            let com_game_download = this.node.getComponent('com_game_update');
            com_game_download.updater_entrance = this.updater_entrance;
            this.updater.cfg.game_id = this.gameType;
            com_game_download.setUpdateFinishCallback(callback);
            com_game_download.setGameId(this.gameType);
            this.updater.checkUpdate(this.updater_entrance);
        } else {
            callback();
        }
    },

    onClickActivity(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY, function (prefab) {
            prefab.getComponent('klb_hall_daily_activeUI').showDefaultSelect();
        });
    },
    onClickSign: function () {
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI(hall_prefab.KLB_DL_HALL_SIGN, function (prefab) {
            prefab.getComponent('klb_hall_daily_sign').showClsoeBtn(true);
        });

    },

    onClickSP: function () {
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI(hall_prefab.KLB_DL_HALL_SPRING_FESTIVAL_ACTIVITY);
    },

    onClickCoin: function () {
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
            var jiuji = ui.getComponent('klb_hall_jiuji');
            if (jiuji != null) {
                jiuji.update_buy_list(2000);
            }
        }.bind(this));
    },
    onClickMail: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_MAIL, function (prefab) {
            var comp = prefab.getComponent('klb_hall_mail');
            comp.getMailInfo();
        });
    },

    onClickMore: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHEZHI);
    },

    onClickShop: function (event, data, type) {
        if (!cc._is_shop)
            return;
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            type = type || 'ZS'; //默认打开房卡页面
            ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
            // ui.setLocalZOrder(5000);
        }.bind(this));
    },

    /**
     * 打开首充界面
     */
    onClickFirstBuy: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_FIRST_BUY, function (ui) {
            var cpt = ui.getComponent('klb_hall_first_buy');
            var seq = cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
                cpt.initItemList();
            }));
            this.node.runAction(seq);
        }.bind(this));
    },

    onClickCopyID() {
        cc.dd.native_systool.SetClipBoardContent(this.ID_TTF.string);
        cc.dd.PromptBoxUtil.show("复制ID成功");
    },

    onClickBag() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_DL_HALL_BAG, function (ui) {
            //ui.getComponent('klb_hall_BagUI').updateBagUI();
        }.bind(this));
    },

    /**
     * 返回按键
     * @param event
     */
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.KEY.back:
                if (cc.dd.UIMgr.getUI(hall_prefab.KLB_DL_HALL_ROOM)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_DL_HALL_ROOM);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_DL_HALL_MATCH)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_DL_HALL_MATCH);
                }
                else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_CHANGE_HEAD)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_CHANGE_HEAD);
                } else if (cc.dd.UIMgr.getUI(hall_prefab.KLB_DL_HALL_BAG)) {
                    cc.dd.UIMgr.destroyUI(hall_prefab.KLB_DL_HALL_BAG);
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

    /**
     * 设置金币 房卡
     */
    onSetMoneyAndCards: function (money, roomcards) {
        this.zuanshiTTF.string = this.changeNumToCHN(money) || '0';
    },

    /**
     * 获取房间列表
     */
    getRoomList: function () {
        cc.dd.NetWaitUtil.show('正在请求数据');
        var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
        var cofnig = game_duli.getItem(function (cfg) {
            if (cfg.pID == AppConfig.GAME_PID)
                return cfg;
        }.bind(this));
        if (!cofnig) return;
        protoNewRoomList.setHallGameid(cofnig.gameid);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
            '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);
    },

    /**
     * 获取微信头像精灵帧
     */
    _getWxHeadFrame: function (openId) {
        var headFilePath = jsb.fileUtils.getWritablePath() + "head_" + openId;
        var texture = cc.textureCache.addImage(headFilePath);
        if (texture) {
            return new cc.SpriteFrame(texture);
        } else {
            cc.error("无微信头像文件,openid:" + openId);
        }
    },

    updateNick: function (data) {
        this.nameTTF.string = cc.dd.Utils.subChineseStr(data, 0, 14);
    },

    updateFirstBuy() {
        if(cc._firstBuyId){
            this.scNode.active = true;
        }else{
            this.scNode.active = false;
        }
    },
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
        let hongdian = cc.find('topNode/xinxi/hongdian', this.node);
        if (hongdian) {
            if (unread > 0) {
                hongdian.active = true;
            }
            else {
                hongdian.active = false;
            }
        }

    },

    userBtnCallBack: function () {
        if (cc._isBaiDuPingTaiGame || cc._isHuaweiGame) {
            hall_audio_mgr.com_btn_click();
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_CHANGE_HEAD);
        }
    },

    onEventMessage(event, data) {
        switch (event) {
            case WxEvent.DOWNLOAD_HEAD:
                cc.log('玩家头像下载完毕!!');
                this.onSetHeadSp(this._getWxHeadFrame(data[0]), data[0]);
                break;
            case HallCommonEvent.UPDATE_NICK:
                this.updateNick(data);
                break;
            case HallCommonEvent.ON_SHOP_SUCCESS:
                this.onShopSuccess();
                break;
            case shopEvent.REFRESH_DATA:
                this.updateFirstBuy();
                break;
            case Hall.HallEvent.SHOW_DAILY_SIGN:
            case Hall.HallEvent.DAILYSIGN_END:
                // let btn = cc.find('Canvas/bottomNode/Layout/qiandao');
                // if (btn) {
                //     btn.active = Hall.HallData.Instance().sign_data != null;
                // }
                break;
            case Hall.HallEvent.GET_USERINFO:
                this.setUserInfo(hallData.getInstance());
                break;
            case hallRoomEvent.INIT_ROOM_LIST:
                this.initAndOpenRoomUI(data);
                break;
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                this.onSetMoneyAndCards(data.getCoin(), data.getRoomCard());
                break;
            case Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM:
                if (cc._appstore_check || cc._androidstore_check)
                    return;
                if (data > 0) {
                    AudioManager.playSound("resources/gameyj_hall/audios/message.mp3");
                    cc.dd.PromptBoxUtil.show("您有新邮件未阅读");
                }
                this.updateUnreadMail();
                break;
            case Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM_AND_NOTICE:
                if (cc._appstore_check)
                    return;
                this.updateUnreadMail();
                break;
            case Hall.HallEvent.UIDATE_FXYL_UI:
                this.showDLActive();
                break;
            case Hall.HallEvent.SHOW_DROP_ACTIVITY:
                this.showDropActivity();
                break;
        }
    },

    /**
     * 筹码数字转换
     */
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

    //////////////////////端午掉落活动//////////
    //发送掉落活动
    getDropActivity(){
        HallSendMsgCenter.getInstance().sendDropActivity()
    },
    showDropActivity(){
        let state = hallData.getInstance().dropActivity.state;
        if (state == 0 || state == 1){
            cc.dd.UIMgr.openUI("gameyj_hall/prefabs/festivalduanwu/klb_hall_duanwu_festival", null, true)
        }else{
            cc.dd.UIMgr.destroyUI(cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY));
            cc.dd.UIMgr.destroyUI(cc.dd.UIMgr.getUI("gameyj_hall/prefabs/festivalduanwu/klb_hall_duanwu_festival"));
            cc.dd.UIMgr.destroyUI(cc.dd.UIMgr.getUI('gameyj_hall/prefabs/festivalduanwu/klb_hall_duanwu_change'));
        }
        // cc.dd.UIMgr.openUI("gameyj_hall/prefabs/festivalduanwu/klb_hall_duanwu_festival",null, true)
        // let dayRewardList = hallData.getInstance().couponActivity.dayRewardList
        // let beginTime = hallData.getInstance().couponActivity.beginTime
        // let endTime = hallData.getInstance().couponActivity.endTime
        // if (!dayRewardList.length) return
        // if (beginTime < hallData.getInstance().serverTimestamp < endTime) {
        //     var showsign = Hall.HallData.Instance().sign_data.rewardListList.some(item => item.state == 0)
        //     let isHide = dayRewardList.some(item => item.drawStat == 2)
        //     if (isHide && !showsign) {
        //         cc.dd.UIMgr.openUI(hall_prefab.COUPON, null, true);
        //         // cc.dd.UIMgr.destroyUI(cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY));
        //     }
        // }
    },

    //////////////端午掉落活动结束///////
});
