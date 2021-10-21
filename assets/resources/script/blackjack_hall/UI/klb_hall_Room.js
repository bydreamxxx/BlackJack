const dd = cc.dd;
var hall_prefab = require('hall_prefab_cfg');
var hallData = require('hall_common_data').HallCommonData;
var klb_game_list_config = require('klb_gameList');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var FortuneHallManager = require('FortuneHallManager').Instance();
var FORTUNEHALLED = FortuneHallManager.FORTUNEHALLED;
var FORTUNEHALLEvent = FortuneHallManager.FORTUNEHALLEvent;
var UP_GAME_CHOICE_NUM = 3
var YYL_TYPE = 1
var LONGHU_TYPE = 2
var LONGHU_TYPE_2 = 3
var game_room_list = require('game_room');
var HallTask = require('hall_task').Task;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;
const Hall = require('jlmj_halldata');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var AppConfig = require('AppConfig');
var Define = require("Define");

cc.Class({
    extends: cc.Component,

    properties: {
        creatRoomNode: cc.Node,
        joinRoomNode: cc.Node,
        scrollNode: cc.Node,    //总共场数的列表节点
        contentNode: cc.Node,
        spaceY: 5,
        spaceX: 50,
        itemHeight: 182,
        itemWidth: 458,
        itemList: [],
        titleSp: cc.Label,
        moreNode: cc.Node,
        game_name: '',
        game_id: '',
        fudaiShineNode: cc.Node,
        taskTip: cc.Node,
        activeTip: cc.Node,
        m_oNationalDayIcon: cc.Node,
        ksbtncc: cc.Node,

        normalNode: cc.Node,
        chifengNode: cc.Node,
        ruleNode: cc.Node,
        ruleButtonNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        FORTUNEHALLED.addObserver(this);
        TaskED.addObserver(this);
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);

        if (this.normalNode) {
            this.normalNode.active = !cc._chifengGame;
        }
        if (this.chifengNode) {
            this.chifengNode.active = cc._chifengGame;
        }
        if (this.ruleNode) {
            this.ruleNode.active = !cc._chifengGame;
        }
        if (this.ruleButtonNode) {
            this.ruleButtonNode.active = !cc._chifengGame;
        }

        var seq = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
        //this.fudaiShineNode.runAction(cc.repeatForever(seq));
        this.updateTaskGetTip(HallTask.Instance().checkTaskCanAward());
        this.updateTaskFlag();
        this.updateActiveTip();
        this.showNAtionalDayActive();
        this.updateUnreadMail();

        if (cc._applyForPayment) {
            let left = cc.find('datingLayer/leftNode', this.node);
            if (left) {
                left.active = false;
            }
            let right = cc.find('datingLayer/roomScroll', this.node);
            if (right) {
                let kuaisukaishi = cc.find('ksButton', right);
                if (kuaisukaishi) {
                    kuaisukaishi.x += right.x;
                }
                right.x = 0;

            }
            let xinxi = cc.find('xinxi', this.node);
            if (xinxi) {
                xinxi.active = false;
            }
        }
    },

    start: function () {//因为需要 获取玩家是不是游戏中，，， 为啥不在登录时带回  而需要重新发 而且是每次都发
        //this.node.setLocalZOrder(2000)
        this.setUserInfo(hallData.getInstance());
    },


    onDestroy: function () {
        FORTUNEHALLED.removeObserver(this);
        TaskED.removeObserver(this);
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },


    onMatchClick(event, custom) {
        var gameId = event.target.tag;
        if (gameId) {
            var bscdata = require('bsc_data').BSC_Data;
            var list = bscdata.Instance().getActListBytype(1);
            if (list && list.infoList && list.infoList.length) {
                for (var i = 0; i < list.infoList.length; i++) {
                    if (list.infoList[i].gameType == gameId) {
                        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_match_detail', function (ui) {
                            ui.getComponent('klb_match_detail').showDetail(list.infoList[i]);
                        });
                        return;
                    }
                }
            }
        }
        cc.dd.PromptBoxUtil.show('比赛NOT YET OPEN');
    },

    getMatchGameId(goldId) {
        switch (goldId) {
            case Define.GameType.SH_GOLD:
                return Define.GameType.SH_MATCH;
        }
        return goldId;
    },

    /**
     * 初始化房间界面
     */
    initRomUI: function (data) {
        var self = this;
        this.ruleNodeStatus(this.ruleNode, data.hallGameid);
        for (let i = 0; i < this.itemList.length; i++) {
            if (this.itemList[i]) {
                this.itemList[i].removeFromParent();
                this.itemList[i].destroy();
            }
        }
        this.itemList.splice(0, this.itemList.length);
        this.contentNode.removeAllChildren(true);
        klb_game_list_config.items.forEach(function (gameItem) {
            if (gameItem.gameid == data.hallGameid) {
                this.titleSp.string = gameItem.name;
                this.game_name = gameItem.name;
                this.game_id = gameItem.gameid;
            }
        }.bind(this));
        if (data.hallGameid == Define.GameType.SH_GOLD) {
            if (this.normalNode) {
                var matchNode = cc.find('match', this.normalNode.parent);
                if (matchNode) {
                    this.normalNode.active = false;
                    this.chifengNode && (this.chifengNode.active = false);
                    matchNode.active = true;
                    var mail = cc.find('xinxi', this.node);
                    mail && (mail.active = false);
                    matchNode.getChildByName('sign').tag = this.getMatchGameId(data.hallGameid);
                }
            }
            if (cc.dd._chooseMatchId == data.hallGameid) {
                this.scheduleOnce(function () {
                    self.onMatchClick({ target: { tag: self.getMatchGameId(data.hallGameid) } }, null);
                    cc.dd._chooseMatchId = null;
                }, 1);
            }
        }
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧长春麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                cc.dd.ResLoader.loadPrefab("gamedl_majiang/prefabs/klb_dl_hall_RoomItem", function (prefab) {
                    //获取客服微信列表
                    if (this.itemList.length > 0)
                        return;
                    for (var i = 0; i < data.roomlistList.length; i++) {
                        var dataInfo = data.roomlistList[i];
                        if (dataInfo) {
                            var item = cc.instantiate(prefab);
                            this.itemList.push(item);
                            item.parent = this.contentNode;
                            item.getComponent('klb_hall_RoomItem').init(dataInfo, data.hallGameid);
                        }
                    }
                }.bind(this));
                break;
            default:
                cc.dd.ResLoader.loadPrefab("blackjack_hall/prefabs/klb_hall_RoomItem", function (prefab) {
                    //获取客服微信列表
                    for (var i = 0; i < data.roomlistList.length; i++) {
                        var dataInfo = data.roomlistList[i];

                        if (dataInfo) {
                            var item = cc.instantiate(prefab);
                            this.itemList.push(item);
                            item.parent = this.contentNode;
                            /*var sx = item.width;
                            var cnt = this.itemList.length;
                            var y = (Math.floor(cnt / 2)) * this.itemHeight + (Math.floor(cnt / 2)) * this.spaceY;
                            item.y = -y;
                            var x = ((i % 2 + 0.5)) * this.itemWidth + ((i % 2)) * this.spaceX;
                            item.x = x;*/
                            //item.parent.height = cnt*this.itemHeight+(cnt+1)*this.spaceY;
                            //item.parent.height = cnt*this.itemHeight+(cnt+1)*this.spaceY;
                            item.getComponent('klb_hall_RoomItem').init(dataInfo, data.hallGameid);
                        }
                    }
                    if (cc.dd._chooseSeatId) {
                        for (var i = 0; i < this.itemList.length; i++) {
                            if (this.itemList[i].getComponent('klb_hall_RoomItem').roomid == cc.dd._chooseSeatId && cc.dd._chooseGameId == this.itemList[i].getComponent('klb_hall_RoomItem').gameid) {
                                this.itemList[i].getComponent('klb_hall_RoomItem').onClickRoom();
                                break;
                            }
                        }
                        cc.dd._chooseSeatId = null;
                    }
                }.bind(this));
        }
    },

    /**
     * 设置玩家信息
     */
    setUserInfo: function (userData) {
        var userinfo = this.node.getComponentInChildren('klb_hall_UserInfo');
        if (userinfo) {
            userinfo.setData(userData);
        }
    },

    //钻石
    zuanshiCallBack: function () {
        this.shopBtnCallBack(null, null, 'ZS');
    },

    //关闭界面
    closeUICallBack: function () {
        hall_audio_mgr.com_btn_click();

        this.node.removeFromParent();
        this.onDestroy();
        var scene = cc.director.getScene();
        if (!cc._useChifengUI || cc.game_pid == 10006) {
            let hallscene = scene.getChildByName('Canvas').getComponent('klb_hallScene');
            if (hallscene) {
                hallscene.updateActiveTip();
            }
        }
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

    //商城
    //type 为代码打开是指定 打开对应的页面
    shopBtnCallBack: function (event, data, type) {
        if (!cc._is_shop)
            return;
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            type = type || 'ZS'; //默认打开房卡页面
            ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
            // ui.setLocalZOrder(5000);
        }.bind(this));
    },

    //功能按钮响应
    btnClickCallBack: function (event, data) {
        hall_audio_mgr.com_btn_click();

        switch (data) {
            case 'LUCKBAG'://福袋
                //this.updateTaskGetTip(false);
                //cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_WELFAREBAG);
                break;
            case 'RANK'://排行榜
                cc.dd.PromptBoxUtil.show('NOT YET OPEN，敬请期待');
                break;
            case 'MORE'://更多
                this.moreNode.active = true;
                var ani = this.moreNode.getChildByName('ScrollView').getChildByName('view').getComponent(cc.Animation);
                ani.play('klb_hall_more_show');
                break;
            case 'ZHANJI':
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BATTLE_HISTORY, function (ui) {
                    ui.getComponent('klb_hall_Battle_History').send(0);
                });
                break;
            case 'RULE':
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_RULE, function (ui) {
                    //ui.getComponent('klb_hall_Rule').InitGameList();
                }.bind(this));
                break;
            case 'LUCKY':
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_LOTTERY_CHOOSE);
                break;
            case 'FIRST_BUY':
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_FIRST_BUY, function (ui) {
                    var cpt = ui.getComponent('klb_hall_first_buy');
                    // var seq = cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
                    //     cpt.initItemList();
                    // }));
                    // this.node.runAction(seq);
                    cc.tween(this.node)
                        .delay(0.2)
                        .call(function () {
                            cpt.initItemList();
                        })
                        .start();
                }.bind(this));
                break;
            case 'VIP':
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_VIP);
                break;
            case 'SHARE':
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHARE, function (ui) {
                    var share_ui = ui.getComponent('klb_hall_share');
                    if (share_ui != null) {
                        var cfg = klb_game_list_config.getItem(function (item) {
                            return item.gameid == this.game_id;
                        }.bind(this));
                        if (cfg == null) {
                            cc.error("klb_gamelist表未配置该游戏");
                            return;
                        }
                        else if (cfg.share_img_name == "") {
                            var title = '【巷乐-' + this.game_name + '】';
                            var content = '绿色安全无外挂,约局打牌不等待!地道的游戏玩法,心动的你还不来吗?';
                            share_ui.setShareData(title, content);
                        } else {
                            var share_imgs = cfg.share_img_name.split(';');
                            var idx = 0;
                            if (share_imgs.length > 1) {
                                idx = Math.floor(Math.random() * share_imgs.length);
                            }
                            share_ui.setShareImg(share_imgs[idx]);
                        }
                    }
                }.bind(this));
                break;
            case 'EARN':
                cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_zq', function (ui) {
                    ui.getComponent('klb_hall_zuanqian').setData(0);
                }.bind(this));
                break;
            case 'BAG':
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BAG, function (ui) {
                    //ui.getComponent('klb_hall_BagUI').updateBagUI();
                }.bind(this));
                break;
            default:
                break;
        };
    },

    /**
     * 创建   加入    比赛按钮回调
     * @param event
     * @param data
     */
    roomBtnCallBack: function (event, data) {
        var gameid = this.game_id;
        var game = klb_game_list_config.getItem(function (item) {
            return item.gameid == gameid;
        });
        var createGameInfo = klb_game_list_config.getItem(function (itemInfo) {
            return itemInfo.gameid == game.connect_f_id;
        })
        hall_audio_mgr.com_btn_click();
        if (createGameInfo && createGameInfo.isopen == 0) {
            cc.dd.PromptBoxUtil.show('NOT YET OPEN，敬请期待');
            return;
        }
        switch (data) {
            case 'C_ROOM':
                this.creatRoomNode.active = true
                var Component = this.creatRoomNode.getComponent("klb_hall_CreateRoom");
                Component.showGameList(game.connect_f_id)
                var ani = this.creatRoomNode.getChildByName('actionnode').getComponent(cc.Animation);
                ani.play('klb_hall_createRoom');
                break;
            case 'J_ROOM'://进入房间
                this.joinRoomNode.active = true
                var ani = this.joinRoomNode.getChildByName('action_node').getComponent(cc.Animation);
                ani.play('klb_hall_JoinRoom');
                break;
        };
    },

    /**
     * 点击房间进入游戏
     */
    clickRoomEnterGame: function (event, data) {

    },

    /**
     * 点击俱乐部
     */
    clickClub: function (event, data) {
        hall_audio_mgr.com_btn_click();
        // cc.dd.PromptBoxUtil.show('NOT YET OPEN，敬请期待');
        // cc.dd.SceneManager.replaceScene('club_new');
        cc.dd.SceneManager.replaceScene('klb_friend_group_scene');
    },

    updateTaskGetTip: function (isShow) {
        //this.taskTip.active = isShow;
    },

    updateTaskFlag() {
        if (this.taskTip)
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

    updateActiveTip: function () {
        if ((Hall.HallData.Instance().sign_data && !Hall.HallData.Instance().isSigned) || (hallData.getInstance().idNum == '' && !cc.dd.isCertified)) {
            if (this.activeTip)
                this.activeTip.active = true;
        } else {
            if (this.activeTip)
                this.activeTip.active = false;
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case FORTUNEHALLEvent.GET_USER_LOG_DATA:
                this.showUserLog();
                break;
            case TaskEvent.TASK_CHANGE:
            // this.updateTaskGetTip(true);
            // break;
            case TaskEvent.TASK_FINISH:
                this.updateTaskGetTip(HallTask.Instance().checkTaskCanAward());
                break;

            case Hall.HallEvent.DAILYSIGN_END:
            case HallCommonEvent.REAL_NAME_AUTHEN:
            // this.updateActiveTip();
            // break;
            case Hall.HallEvent.CLOSE_ACTIVE_TIP:
                this.updateActiveTip();
                break;
            case Hall.HallEvent.TASK_INFO:
            case Hall.HallEvent.TASK_UPDATE:
                this.updateTaskFlag();
                break;
            case Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM:
                if (data > 0) {
                    AudioManager.playSound("blackjack_hall/audios/message");
                    cc.dd.PromptBoxUtil.show("您有新邮件未阅读");
                }
                this.updateUnreadMail();
                break;
            case Hall.HallEvent.UPDATE_UNREAD_MAIL_NUM_AND_NOTICE:
                if (cc._appstore_check)
                    return;
                this.updateUnreadMail();
                break;
        }
    },

    showNAtionalDayActive: function () {
        if (this.m_oNationalDayIcon)
            this.m_oNationalDayIcon.active = Hall.HallData.Instance().checkActivityIsOpen();
        // if(Hall.HallData.Instance().checkActivityIsOpen()){
        //     cc.dd.UIMgr.openUI('blackjack_hall/prefabs/daily_active/klb_hall_daily_active_NDA', function (prefab) {
        //         prefab.getComponent('klb_hall_daily_active_CopyBtn').showClsoeBtn(true);
        //     });
        // }
    },

    onClickKSRoom: function () {
        var coin = HallPropData.getCoin();
        var entermin = 0;
        for (var i = this.itemList.length - 1; i >= 0; --i) {
            var item_node = this.itemList[i];
            var item = item_node.getComponent('klb_hall_RoomItem');
            if (i == 0) entermin = item.roomItem.entermin;
            if ((coin >= item.roomItem.entermin && coin <= item.roomItem.entermax)) {
                item.onClickRoom(true);
                return;
            } else if (item.roomItem.entermax == 0 && coin >= item.roomItem.entermin) {
                item.onClickRoom(true);
                return;
            }
        }
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
            var jiuji = ui.getComponent('klb_hall_jiuji');
            if (jiuji != null) {
                jiuji.update_buy_list(entermin);
            }
        });
    },

    /**
     * 更新未读邮件红点
     */
    updateUnreadMail() {
        var unread = hallData.getInstance().unread_mail_num;
        let notice_length = hallData.getInstance().getNoticeLength();
        unread = unread || 0;

        unread += notice_length[0];

        if (cc.find('xinxi/hongdian/num', this.node)) {
            cc.find('xinxi/hongdian/num', this.node).getComponent(cc.Label).string = unread.toString();
            if (unread > 0) {
                cc.find('xinxi/hongdian', this.node).active = true;
            }
            else {
                cc.find('xinxi/hongdian', this.node).active = false;
            }
        }
    },

    onClickMail: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_NOTICE, function (prefab) {
            var comp = prefab.getComponent('klb_hall_Notice');
            comp.initType(2);
        });
    },

    /**
     * 打开规则界面
     */
    openSelectGameRule: function () {
        var self = this;
        var gameData = klb_game_list_config.getItem(function (item) {
            if (item.gameid == self.game_id)
                return item;
        })

        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_RULE, function (ui) {
            var itemData = {
                _game_id: gameData.gameid,
            }
            var cpt = ui.getComponent('klb_hall_Rule');
            cpt.clickTagCallBack(itemData);
            //cpt.InitGameList();

        }.bind(this));
    },

    onClickBackToChifengFriend() {
        hall_audio_mgr.com_btn_click();
        if (cc._chifengGame) {
            this.node.removeFromParent();
            this.onDestroy();
            var scene = cc.director.getScene();
            if (scene) {
                scene.getChildByName('Canvas').getComponent('klb_hallScene').goToCard();
            }
        }

    },

    ruleNodeStatus(rule, gameid) {
        if (rule) {
            if (cc.dd.Utils.checkRuleExist(gameid))
                rule.active = true;
            else
                rule.active = false;
        }
    },
});
