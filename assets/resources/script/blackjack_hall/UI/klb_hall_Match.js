const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_sendMsg = require('bsc_sendMsg');
const Bsc = require('bsc_data');
var hall_prefab = require('hall_prefab_cfg');
var hallData = require('hall_common_data').HallCommonData;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var itemCfg = require('item');
var HallTask = require('hall_task').Task;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var Platform = require('Platform');
var AppCfg = require('AppConfig');
var klb_game_list_config = require('klb_gameList');
const Hall = require('jlmj_halldata');
var login_module = require('LoginModule');
const game_type = require('game_type');

cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: cc.Node,
        match_item: cc.Prefab,
        detailNode: cc.Node,

        // bhongbaodi: cc.SpriteFrame,
        // bsiphonex: cc.SpriteFrame,
        // bsyuanbao: cc.SpriteFrame,
        // bsjiangbei: cc.SpriteFrame,

        // taskTip: cc.Node,
        // activeTip: cc.Node,

        passwordNode: cc.Node,
        enterText: [cc.Label],

        // stateSp: [cc.SpriteFrame],
        m_oNationalDayIcon: cc.Node,

        entranceNode: cc.Node,
        entranceNodeItem: cc.Prefab,
        toggleBack: cc.Node,
        backTitle: cc.Label,
        datingLayer: cc.Node,
        entranceNodeContent: cc.Node,

        topNode: cc.Node,
    },

    onLoad: function () {
        Bsc_ED.addObserver(this);
        TaskED.addObserver(this);
        HallCommonEd.addObserver(this);
        Hall.HallED.addObserver(this);

        // let majiangToggle = cc.find('top/toggleBack/toggleGroup/toggle5', this.node);
        // if(majiangToggle){
        //     majiangToggle.active = cc.dd.user.regChannel < 10000;
        // }

        this.topNode.active = cc.game_pid != 10008;

        this.hongbaoToggle = cc.find('toggleBack/toggleGroup/toggle1', this.node);

        if (cc.game_pid == 2) {
            let label = cc.find('Background/New Label', this.hongbaoToggle).getComponent(cc.Label);
            label.string = '麻将赛';
            label = cc.find('checkmark/New Label', this.hongbaoToggle).getComponent(cc.Label);
            label.string = '麻将赛';
        }

        this.dingshiToggle = cc.find('toggleBack/toggleGroup/toggle2', this.node);
        this.duobaoToggle = cc.find('toggleBack/toggleGroup/toggle3', this.node);
        let toggle4 = cc.find('toggleBack/toggleGroup/toggle4', this.node);
        let toggle5 = cc.find('toggleBack/toggleGroup/toggle5', this.node);
        if (toggle4) {
            toggle4.active = false;
        }
        if (toggle5) {
            toggle5.active = false;
        }

        this.hongbaoToggle.active = false;
        this.dingshiToggle.active = false;
        this.duobaoToggle.active = false;

        var seq = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
        // this.updateTaskGetTip(HallTask.Instance().checkTaskCanAward());
        // this.updateTaskFlag();
        // this.updateActiveTip();
        this._page_idx = 1;
        this._gametype = cc.dd.Define.GameType.DDZ_MATCH;
        this.schedule(this.refreshOpenedJoinNum.bind(this), 10);

        var seq2 = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
        this.showNAtionalDayActive();

        this.entranceNode.active = true;
        this.entranceNodeContent.removeAllChildren();
        this.toggleBack.active = false;
        this.datingLayer.active = false;
        this.backTitle.string = '比赛场';
    },
    onDestroy: function () {
        Bsc_ED.removeObserver(this);
        TaskED.removeObserver(this);
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    start: function () {
        this.setUserInfo(hallData.getInstance());
    },

    onClickTab: function (event, data) {
        if (data == 1) {  //人满赛
            this._page_idx = 1;
            this.showRenManSai();
        } else if (data == 2) {    //定时赛
            this._page_idx = 2;
            this.showDingShiSai();
        }
        else if (data == 3) {
            this._page_idx = 3;
            this.showMiMaSai();
        }
        else if (data == 4) {
            this._page_idx = 4;
            this.showShenBan();
        }
        else if (data == 5) {
            this._page_idx = 5;
            this.showMaJiangSai();
        }
    },

    clickTab2() {
        //cc.dd.PromptBoxUtil.show('NOT YET OPEN,敬请期待!');
        this._page_idx = 2;
        this.showDingShiSai();
    },

    setUserInfo: function (userData) {
        var userinfo = this.node.getComponentInChildren('klb_hall_UserInfo');
        if (userinfo) {
            userinfo.setData(userData);
        }
    },

    sendGetMatch: function (type) {
        Bsc_sendMsg.getActByType(type);
    },


    updateActiveTip: function () {
        // if ((Hall.HallData.Instance().sign_data && !Hall.HallData.Instance().isSigned) || (hallData.getInstance().idNum == '' && !cc.dd.isCertified)) {
        //     this.activeTip.active = true;
        // } else {
        //     this.activeTip.active = false;
        // }
    },

    /**
     * 排序数据 用服务器下发的顺序
     */
    sortData: function (data) {
        // var comp = function (a, b) {
        //     if (a.matchId < b.matchId) {
        //         return -1;
        //     } else {
        //         return 1;
        //     }
        // };
        // data.sort(comp);
    },

    /**
     * 初始化 列表
     * @param node
     */
    _initScrollView: function (data, parent) {
        this.sortData(data);
        if (data.length && (data[0].matchClass == 3 || data[0].matchClass == 2)) {
            var cmp = function (a, b) {
                if ((a.matchState == 2 || a.matchState == 3 || a.matchState == 4) && (b.matchState == 2 || b.matchState == 3 || b.matchState == 4)) {
                    if (a.matchState == 2 && b.matchState != 2)
                        return -1;
                    else if (a.matchState != 2 && b.matchState == 2)
                        return 1;
                    else
                        return a.openseconds - b.openseconds;
                }
                else if (a.matchState == 2 || a.matchState == 3 || a.matchState == 4) {
                    return 1;
                }
                else if (b.matchState == 2 || b.matchState == 3 || b.matchState == 4) {
                    return -1;
                }
                return a.openseconds - b.openseconds;
            }
            data.sort(cmp);
        }
        for (var i = 0; i < data.length; ++i) {
            var itemData = data[i];
            if (itemData) {
                var item = cc.instantiate(this.match_item);
                item.parent = parent;
                item.tagname = itemData.matchId;
                item.getComponent('klb_match_item').setData(itemData, this.showDetail.bind(this), this.showDetail.bind(this), this.sendMath.bind(this));
                item.on('click', this.showDetail, this);
                //item.getComponent('klb_matchItem').setData(itemData, this.scrollViewItemCallBack.bind(this));
            }
        }
    },

    sendMath: function (event, nosound) {
        let item = event.target.tagname;
        event.target.tagname = item.matchId;
        this.showDetail(event, true);
        event.target.tagname = item;
        this.signBtnCallBack(event);
    },

    showDetail: function (event, nosound) {
        if (!nosound)
            hall_audio_mgr.com_btn_click();
        var matchId = event.target.tagname;
        var obj = Bsc.BSC_Data.Instance().getActListBytype(1);
        if (obj) {
            var data = obj.infoList;
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    if (matchId == data[i].matchId) {
                        this.detailNode.active = true;
                        this.detailNode.getComponent('klb_match_detail').showDetail(data[i]);
                        break;
                    }
                }
            }
        }
    },

    refreshOpenedJoinNum() {
        if (this.infoList) {
            var curTime = new Date().getTime();
            for (var i = 0; i < this.infoList.length; i++) {
                if (this.infoList[i].matchClass == 2) {
                    if (this.infoList[i].openseconds - parseInt((curTime - this.infoList[i].openStartTime) / 1000) < 0) {
                        this.infoList[i].isSign = false;
                        this.infoList[i].joinNum = 0;

                        if (this.gameInfo && this.gameInfo[this.infoList[i].gameType]) {
                            let data = this.gameInfo[this.infoList[i].gameType].infoList
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].matchId == this.infoList[i].matchId) {
                                    data[i].isSign = this.infoList[i].isSign;
                                    data[i].joinNum = this.infoList[i].joinNum;
                                }
                            }
                        }
                    }
                }
                else if (this.infoList[i].matchClass == 3) {
                    // if (this.infoList[i].openseconds - parseInt((curTime - this.infoList[i].openStartTime) / 1000) < -60 * 10) {
                    //     this.infoList[i].isSign = false;
                    //     this.infoList[i].joinNum = 0;
                    // }
                }
            }


        }

        if (this.entranceNode.active) {
            if (this.gameInfo) {
                for (let k in this.gameInfo) {
                    if (this.gameInfo.hasOwnProperty(k)) {
                        let _data = this.gameInfo[k];
                        if (_data.entranceNodeItem) {
                            let num = 0;
                            for (let i = 0; i < _data.infoList.length; i++) {
                                num += _data.infoList[i].joinNum
                            }
                            _data.entranceNodeItem.getComponent('klb_match_entranceItem').updatePlayers(num);
                        }
                    }
                }
            }
        } else {
            switch (this._page_idx) {
                case 1:
                    this.showRenManSai();
                    break;
                case 2:
                    this.showDingShiSai();
                    break;
                case 3:
                    this.showMiMaSai();
                    break;
                case 4:
                    this.showShenBan();
                    break;
                case 5:
                    this.showMaJiangSai();
                    break;
            }
        }
    },

    signBtnCallBack: function (event) {
        /************************游戏统计 start************************/
        let action = 0;
        switch (event.target.tagname.matchId) {
            case 121:
                action = cc.dd.clientAction.T_HALL.HONGBAO_1;
                break;
            case 100:
                action = cc.dd.clientAction.T_HALL.HONGBAO_3;
                break;
            case 101:
                action = cc.dd.clientAction.T_HALL.HONGBAO_5;
                break;
            case 102:
                action = cc.dd.clientAction.T_HALL.HONGBAO_20;
                break;
            default:
                action = cc.dd.clientAction.T_HALL.HONGBAO_1;
                break;
        }
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.DDZ_MATCH, action);
        /************************游戏统计   end************************/

        hall_audio_mgr.com_btn_click();
        if (event.target.tagname.matchClass == 3) {//密码赛
            if (event.target.tagname.isSign) {
                Bsc_sendMsg.tuiSai(event.target.tagname.matchId);
            } else {
                this.pwdMatchId = event.target.tagname.matchId;
                this.passwordNode.active = true;
            }
        } else {
            if (event.target.tagname.isSign) {
                var obj = Bsc.BSC_Data.Instance().getActListBytype(1);
                if (obj) {
                    var data = obj.infoList;
                    if (data && data.length) {
                        var matchdata = data.find(function (x) { return x.matchId == event.target.tagname.matchId });
                        if (matchdata) {
                            if (matchdata.num >= matchdata.openSignNum)
                                return;
                        }

                    }
                }
                Bsc_sendMsg.tuiSai(event.target.tagname.matchId);
            } else {
                if (event.target.tagname.matchClass == 2 && event.target.tagname.matchState == 6)
                    Bsc_sendMsg.zhongtujiaru(event.target.tagname.matchId);
                else
                    Bsc_sendMsg.baoming(event.target.tagname.matchId);
            }
        }
    },

    /**
     * 清理ScrollView
     */
    cleanScrollView: function () {
        this.contentNode.parent.parent.getComponent(cc.ScrollView)._autoScrolling = false;
        this.contentNode.removeAllChildren(true);
    },

    /**
     * 刷新scrool中的详细信息
     */
    flushScrollItemToNet: function (data) {
        if (data.infoList && data.infoList.length <= 0) {
            cc.dd.PromptBoxUtil.show('NOT YET OPEN,敬请期待！');
            return;
        }
        this.infoList = data.infoList.concat();

        let spliceList = (gameType) => {
            let index = this.infoList.findIndex((item) => {
                return item.gameType == gameType
            });

            if (index != -1) {
                this.infoList.splice(index, 1);
            }
        }

        if (cc.game_pid === 10005 || cc.game_pid === 10006) {//黑山单包屏蔽长春麻将比赛场
            spliceList(cc.dd.Define.GameType.CCMJ_MATCH);
        }

        if (cc.game_pid !== 10008) {
            spliceList(cc.dd.Define.GameType.WDMJ_MATCH);
        }

        if (cc.game_pid !== 10006) {
            spliceList(cc.dd.Define.GameType.AHMJ_MATCH);
        }

        if (cc.game_pid === 2) {//长春麻将比赛场特殊处理
            let index = this.infoList.findIndex((item) => {
                return item.gameType == cc.dd.Define.GameType.CCMJ_MATCH && item.matchId == 122
            });

            if (index != -1) {
                this.infoList.splice(index, 1);
            }
        } else {
            let index = this.infoList.findIndex((item) => {
                return item.gameType == cc.dd.Define.GameType.CCMJ_MATCH && item.matchId == 124
            });

            if (index != -1) {
                this.infoList.splice(index, 1);
            }
        }

        spliceList(cc.dd.Define.GameType.SH_MATCH);

        this.gameInfo = {};
        for (let i = 0; i < this.infoList.length; i++) {
            if (!this.gameInfo.hasOwnProperty(this.infoList[i].gameType)) {
                this.gameInfo[this.infoList[i].gameType] = {
                    infoList: [],
                    matchClass: [],
                    entranceNodeItem: null,
                };
            }
            this.gameInfo[this.infoList[i].gameType].infoList.push(this.infoList[i]);
        }

        this.entranceNodeContent.removeAllChildren(true);
        // this.entranceNodeContent.destroyAllChildren();
        for (let k in this.gameInfo) {
            if (this.gameInfo.hasOwnProperty(k)) {
                let num = 0;
                let data = this.gameInfo[k].infoList;
                for (let i = 0; i < data.length; i++) {
                    num += data[i].joinNum;
                    if (this.gameInfo[k].matchClass.indexOf(data[i].matchClass) == -1) {
                        this.gameInfo[k].matchClass.push(data[i].matchClass)
                    }
                }

                let item = cc.instantiate(this.entranceNodeItem);
                item.parent = this.entranceNodeContent;
                item.getComponent('klb_match_entranceItem').setData(k, num, this.entranceCallBack, this);
                this.gameInfo[k].entranceNodeItem = item;
            }
        }

        if (!cc._chifengGame) {
            let item = cc.instantiate(this.entranceNodeItem);
            item.parent = this.entranceNodeContent;
            item.getComponent('klb_match_entranceItem').setWait();
        }

        let layout = this.entranceNodeContent.getComponent(cc.Layout);
        let paddingOffset = 0;
        if (this.entranceNodeContent.childrenCount == 1) {
            layout.spacingX = 0;
            paddingOffset = (this.entranceNode.width - 296) / 2;
        } else if (this.entranceNodeContent.childrenCount == 2) {
            layout.spacingX = 200;
            paddingOffset = (this.entranceNode.width - 792) / 2;
        } else if (this.entranceNodeContent.childrenCount == 3) {
            layout.spacingX = 58;
            paddingOffset = (this.entranceNode.width - 1004) / 2;
        } else {
            layout.spacingX = 58;
            paddingOffset = 50;
        }

        layout.paddingLeft = paddingOffset;
        layout.paddingRight = paddingOffset;
        layout.updateLayout();

        if (this.entranceNodeContent.childrenCount < 4) {
            this.entranceNode.getComponent(cc.ScrollView).enabled = false;
        }

        if (cc.dd.quickMatchType == 'duo_bao_sai') {
            this.entranceCallBack(cc.dd.Define.GameType.DDZ_MATCH);

            this.duobaoToggle.getComponent(cc.Toggle).check();

            // cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_zq', function (ui) {
            //     ui.getComponent('klb_hall_zuanqian').setData(1);
            // }.bind(this));
        }
        else if (cc.dd.quickMatchType == 'ddz_kuai_su_sai') {
            this.entranceCallBack(cc.dd.Define.GameType.DDZ_MATCH);

            let info = data.infoList.find((obj) => { return obj.matchId == 121; })
            this.showDetail({ target: { tag: 121 } }, true);
            if (!info.isSign) {
                Bsc_sendMsg.baoming(121);
            }
        }
        else if (cc.dd.quickMatchType == 'ddz_kuai_su_sai_again') {
            this.entranceCallBack(cc.dd.Define.GameType.DDZ_MATCH);
        }
        else if (cc.dd.quickMatchType == 'ccmj_kuai_su_sai') {
            this.entranceCallBack(cc.dd.Define.GameType.CCMJ_MATCH);

            let matchId = 122;
            if (cc.game_pid === 2) {
                matchId = 124;
            }
            let info = data.infoList.find((obj) => { return obj.matchId == matchId; })
            this.showDetail({ target: { tag: matchId } }, true);
            if (!info.isSign) {
                Bsc_sendMsg.baoming(matchId);
            }
        } else if (cc.dd.quickMatchType == 'ccmj_bi_sai_chang') {
            this.entranceCallBack(cc.dd.Define.GameType.CCMJ_MATCH);
        } else if (cc.dd.quickMatchType == 'wdmj_bi_sai_chang') {
            this.entranceCallBack(cc.dd.Define.GameType.WDMJ_MATCH);
        } else if (cc.dd.quickMatchType == 'wdmj_kuai_su_sai') {
            this.entranceCallBack(cc.dd.Define.GameType.WDMJ_MATCH);

            let info = data.infoList.find((obj) => {
                return obj.matchId == 122;
            })
            this.showDetail({ target: { tag: 122 } }, true);
            if (!info.isSign) {
                Bsc_sendMsg.baoming(122);
            }
        } else if (cc.dd.quickMatchType == 'ahmj_kuai_su_sai') {
            this.entranceCallBack(cc.dd.Define.GameType.AHMJ_MATCH);

            let info = data.infoList.find((obj) => { return obj.matchId == 123; })
            this.showDetail({ target: { tag: 123 } }, true);
            if (!info.isSign) {
                Bsc_sendMsg.baoming(123);
            }
        } else {
            if (!this.entranceNode.active) {
                this.entranceCallBack(this._gametype);
            }
        }
        cc.dd.quickMatchType = null;
    },

    /**
     * 入口按钮回调
     * @param gameType
     */
    entranceCallBack(gameType) {
        if (!this.entranceNode)
            return;
        this.entranceNode.active = false;
        this.toggleBack.active = true;
        this.datingLayer.active = true;

        this._page_idx = 1;
        this._gametype = gameType;
        this._infoList = this.gameInfo[this._gametype].infoList;

        let config = klb_game_list_config.getItem(function (item) {
            return item.gameid == this._gametype;
        }.bind(this));
        if (config) {
            this.backTitle.string = config.name.replace('比赛场', '');
        }

        this.hongbaoToggle.active = this.gameInfo[this._gametype].matchClass.indexOf(1) != -1;
        this.dingshiToggle.active = this.gameInfo[this._gametype].matchClass.indexOf(2) != -1;
        this.duobaoToggle.active = this.gameInfo[this._gametype].matchClass.indexOf(3) != -1;

        this.hongbaoToggle.getComponent(cc.Toggle).check();

        switch (this._page_idx) {
            case 1:
                this.showRenManSai();
                break;
            case 2:
                this.showDingShiSai();
                break;
            case 3:
                this.showMiMaSai();
                break;
                // case 4:
                //     this.showShenBan();
                //     break;
                // case 5:
                //     this.showMaJiangSai();
                break;
        }
    },

    getDataByMatchId(matchId) {
        if (!this.infoList) {
            return null;
        }
        for (var i = 0; i < this.infoList.length; i++) {
            if (this.infoList[i].matchId == matchId) {
                return this.infoList[i];
            }
        }
        return null;
    },

    showRenManSai: function () {
        if (!this._infoList) {
            return;
        }
        var renManList = [];
        this._infoList.forEach(function (item) {
            if (item.matchClass == 1) {
                let config = game_type.getItem((_item) => {
                    return _item.key == item.gameType;
                })

                if (config) {
                    renManList.push(item);
                }
            }
        });
        this.cleanScrollView();
        this._initScrollView(renManList, this.contentNode);
    },

    showDingShiSai: function () {
        if (!this._infoList) {
            return;
        }
        var dingShiList = [];
        this._infoList.forEach(function (item) {
            if (item.matchClass == 2) {
                dingShiList.push(item);
            }
        });
        this.cleanScrollView();
        this._initScrollView(dingShiList, this.contentNode);
    },

    showMiMaSai() {
        if (!this._infoList) {
            return;
        }
        var miMaList = [];
        this._infoList.forEach(function (item) {
            if (item.matchClass == 3) {
                miMaList.push(item);
            }
        });
        this.cleanScrollView();
        this._initScrollView(miMaList, this.contentNode);
    },

    showShenBan() {
        this.cleanScrollView();
        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_zq', function (ui) {
            ui.getComponent('klb_hall_zuanqian').setData(1);
            ui.parent = this.contentNode;
        }.bind(this));
    },

    showMaJiangSai() {
        if (!this.infoList) {
            return;
        }
        var miMaList = [];
        this.infoList.forEach(function (item) {
            if (item.matchClass == 1) {
                let config = game_type.getItem((_item) => {
                    return _item.key == item.gameType;
                })

                if (config && config.game_server_type == 2) {
                    miMaList.push(item);
                }
            }
        });
        this.cleanScrollView();
        this._initScrollView(miMaList, this.contentNode);
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

    onEventMessage: function (event, data) {
        switch (event) {
            case Bsc_Event.BSC_FLUSH_INFO://刷行
                this.flushScrollItemToNet(data[0]);
                break;
            case Bsc_Event.BSC_BAO_MING:
                let date = cc.dd.Utils.getCurDate();
                var localdate = cc.sys.localStorage.getItem('hall_match_dialog_date');
                if ((!localdate || localdate != date) && !cc._isHuaweiGame) {
                    cc.sys.localStorage.setItem('hall_match_dialog_date', date);
                    cc.dd.DialogBoxUtil.show(1, '快邀请好友一起来,抢红包吧!', '分享', '取消',
                        function () {
                            // var cfg = klb_game_list_config.getItem(function (item) {
                            //     return item.gameid == 32;
                            // });
                            // var share_imgs = cfg.share_img_name.split(';');
                            // var idx = 0;
                            // if (share_imgs.length > 1) {
                            //     idx = Math.floor(Math.random() * share_imgs.length);
                            // }
                            // cc.dd.native_wx.ShareImageToTimeline('blackjack_hall/textures/shareImages/' + share_imgs[idx]);
                            let title = '', content = '';

                            if (cc._chifengGame) {
                                title = '【祥云娱乐】打麻将！抢红包！最高可领100元';
                                content = '【祥云娱乐】快来玩，免费参赛，送红包！人人有份！速来>>>';
                            } else {
                                let shareItem = cc.dd.Utils.getRandomShare();
                                if (!cc.dd._.isNull(shareItem)) {
                                    //cc.dd.native_wx.SendAppContent('', shareItem.title, shareItem.content, Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100));
                                    title = shareItem.title;
                                    content = shareItem.content;
                                }
                            }

                            if (title != '' && content != '') {
                                var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
                                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHARE, function (ui) {
                                    var share_ui = ui.getComponent('klb_hall_share');
                                    if (share_ui != null) {
                                        share_ui.setWechatAndXianliaoShare({ title: title, content: content, url: url });
                                    }
                                }.bind(this));
                            }
                        },
                        null,
                        '报名成功'
                    );
                }

                if (this._infoList) {
                    this._infoList.forEach((item) => {
                        if (item.matchId == data) {
                            item.isSign = true;
                        }
                    })
                }
                for (var i = 0; i < this.contentNode.childrenCount; i++) {
                    if (this.contentNode.children[i].tagname == data) {
                        this.contentNode.children[i].getComponent('klb_match_item').updateCheck(true);
                    }
                }
                this.refreshOpenedJoinNum();
                break;
            case Bsc_Event.BSC_TUI_SAI:
                //cc.dd.PromptBoxUtil.show('取消报名成功!');
                if (this._infoList) {
                    this._infoList.forEach((item) => {
                        if (item.matchId == data) {
                            item.isSign = false;
                        }
                    })
                }
                for (var i = 0; i < this.contentNode.childrenCount; i++) {
                    if (this.contentNode.children[i].tagname == data) {
                        this.contentNode.children[i].getComponent('klb_match_item').updateCheck(false);
                    }
                }
                this.refreshOpenedJoinNum();
                break;
            case Bsc_Event.BSC_UPDATE_NUM:
                if (!cc.dd.Utils.isNull(this.infoList)) {
                    for (var i = 0; i < this.infoList.length; i++) {
                        if (this.infoList[i].matchId == data.matchId) {
                            this.infoList[i].joinNum = data.joinNum;

                            if (this.gameInfo) {
                                for (let k in this.gameInfo) {
                                    if (this.gameInfo.hasOwnProperty(k)) {
                                        let _data = this.gameInfo[k].infoList;
                                        for (let i = 0; i < _data.length; i++) {
                                            if (_data[i].matchId == this.infoList[i].matchId) {
                                                _data[i].joinNum = this.infoList[i].joinNum;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                for (var i = 0; i < this.contentNode.childrenCount; i++) {
                    if (this.contentNode.children[i].tagname == data.matchId) {
                        this.contentNode.children[i].getComponent('klb_match_item').updateRoleCount(data.joinNum.toString());
                    }
                }

                if (this.entranceNode.active) {
                    for (let k in this.gameInfo) {
                        if (this.gameInfo.hasOwnProperty(k)) {
                            let _data = this.gameInfo[k];
                            if (_data.entranceNodeItem) {
                                let num = 0;
                                for (let i = 0; i < _data.infoList.length; i++) {
                                    num += _data.infoList[i].joinNum
                                }
                                _data.entranceNodeItem.getComponent('klb_match_entranceItem').updatePlayers(num);
                            }
                        }
                    }
                }

                break;
            case Bsc_Event.BSC_MATCH_UPDATA:
                this.sendGetMatch(1);
                break;
            case TaskEvent.TASK_CHANGE:
            // this.updateTaskGetTip(true);
            // break;
            case TaskEvent.TASK_FINISH:
                // this.updateTaskGetTip(HallTask.Instance().checkTaskCanAward());
                break;
            case Hall.HallEvent.TASK_INFO:
            case Hall.HallEvent.TASK_UPDATE:
                // this.updateTaskFlag();
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.detailNode.active = false;
                Bsc.BSC_Data.Instance().clearData();
                this.sendGetMatch(1);
                break;
            case Bsc_Event.BSC_UPDATE_STATE:
                for (var i = 0; i < this.contentNode.childrenCount; i++) {
                    if (this.contentNode.children[i].tagname == data.matchId) {
                        var matchdata = this.infoList.find((obj) => { return obj.matchId == data.matchId; });
                        if (data.matchState == 1 && matchdata.isSign) {
                            this.contentNode.children[i].getComponent('klb_match_item').updateFinishLabel(7);
                        }
                        else {
                            this.contentNode.children[i].getComponent('klb_match_item').updateFinishLabel(data.matchState);
                        }
                    }
                }
                break;
        }
    },

    shopBtnCallBack: function (event, type) {
        if (!cc._is_shop)
            return;
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            type = type || 'ZS'; //默认打开房卡页面
            ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
        }.bind(this));
    },

    bagBtnCallBack: function (event, type) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BAG, function (ui) {
            //ui.getComponent('klb_hall_BagUI').updateBagUI();
        }.bind(this));
    },

    backBtnClick: function () {
        hall_audio_mgr.com_btn_click();
        if (!this.entranceNode.active && cc.game_pid != 10008 && cc.game_pid != 2) {
            this.entranceNode.active = true;
            this.toggleBack.active = false;
            this.datingLayer.active = false;
            this.backTitle.string = '比赛场';
        } else {
            cc.dd.UIMgr.destroyUI(this.node);
        }
    },

    // closeDetail: function () {
    //     hall_audio_mgr.com_btn_click();
    //     this.detailNode.active = false;
    //     this.unschedule(this.refreshRemainTime);
    // },
    clickWelfareBag: function () {
        //hall_audio_mgr.com_btn_click();
        //this.updateTaskGetTip(false);
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_WELFAREBAG);
    },

    clickShenban: function () {
        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_zq', function (ui) {
            ui.getComponent('klb_hall_zuanqian').setData(1);
        }.bind(this));
    },

    numClick(event, data) {
        if (this._curLblIdx == null) {
            this._curLblIdx = 0;
        }
        this.enterText[this._curLblIdx++].string = data;
        if (this._curLblIdx == this.enterText.length) {
            var password = '';
            this.enterText.forEach(element => {
                password += element.string;
            });
            Bsc_sendMsg.baoming(this.pwdMatchId, password);
            this.closePasswordWidget();
        }
    },

    clearNumClick() {
        this._curLblIdx = 0;
        this.enterText.forEach(element => {
            element.string = '';
        });
    },

    backNumClick() {
        if (this._curLblIdx == null || this._curLblIdx <= 0) {
            return;
        }
        this.enterText[--this._curLblIdx].string = '';
    },

    closePasswordWidget: function () {
        this.passwordNode.active = false;
        this.clearNumClick();
    },

    onInviteFriend(event, custom) {
        hall_audio_mgr.com_btn_click();
        var title = '';
        var str = '';
        var matchId = cc.find('bg/sign_btn', this.detailNode).tagname.matchId;
        var obj = Bsc.BSC_Data.Instance().getActListBytype(1);
        if (obj) {
            var data = obj.infoList;
            if (data && data.length) {
                var matchdata = data.find(function (x) { return x.matchId == matchId });
                if (matchdata) {
                    var reward = '';
                    if (matchdata.rewardListList[0].type == 0) {// && matchdata.rewardListList[0].text != ''
                        reward = matchdata.rewardListList[0].text;
                    }
                    else {
                        var type = matchdata.rewardListList[0].type;
                        var item = itemCfg.getItem(function (dat) {
                            return (dat.key == type)
                        })
                        if (type == 1004 || type == 1099) {
                            reward = item.memo + 'x' + (Math.floor(matchdata.rewardListList[0].num * 10) / 1000).toString() + '元';
                        }
                        else {
                            reward = item.memo + 'x' + matchdata.rewardListList[0].num;
                        }
                    }
                    var remain = matchdata.num ? ',缺' + (matchdata.openSignNum - matchdata.num) + '人' : '';
                    title = matchdata.name + '(' + matchdata.openSignNum + '人开赛)';
                    str = '将于' + matchdata.opentime.replace(':00', '') + '开放，冠军奖励' + reward + remain + ',速速来战!';
                }
                else {
                    cc.log('比赛信息查找不到，id:' + matchId + '，无法分享');
                }
            }
        }
        if (cc.sys.isNative) {
            cc.dd.native_wx.SendAppContent(null, title, str, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
        }
    },


    showNAtionalDayActive: function () {
        this.m_oNationalDayIcon.active = Hall.HallData.Instance().checkActivityIsOpen();
        // if(Hall.HallData.Instance().checkActivityIsOpen()){
        //     cc.dd.UIMgr.openUI('blackjack_hall/prefabs/daily_active/klb_hall_daily_active_NDA', function (prefab) {
        //         prefab.getComponent('klb_hall_daily_active_CopyBtn').showClsoeBtn(true);
        //     });
        // }
    },

    //功能按钮响应
    btnClickCallBack: function (event, data) {
        hall_audio_mgr.com_btn_click();

        switch (data) {
            case 'ZHANJI':
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BATTLE_HISTORY, function (ui) {
                    ui.getComponent('klb_hall_Battle_History').send(0);
                });
                break;

            case 'VIP':
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_VIP);
                break;

            case 'EARN':
                cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_zq', function (ui) {
                    ui.getComponent('klb_hall_zuanqian').setData(0);
                }.bind(this));
                break;
            case Hall.HallEvent.CLOSE_ACTIVE_TIP:
                // this.updateActiveTip();
                break;
            default:
                break;
        };
    },
});
