//create by wj 2018/01/23
const Hall = require('jlmj_halldata');
var hall_prefab = require('hall_prefab_cfg');
var HallSendMsgCenter = require('HallSendMsgCenter');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const dd = cc.dd;
var game_type_cfg = require('game_type');
var com_replay_data = require('com_replay_data').REPLAY_DATA;
var AppConfig = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        battle_ContentNode: cc.Node, //消息列表
        battle_spaceY: 0,
        battle_itemHeight: 230,
        _itemList: [],
        descLabel: cc.Node,

        scorllView: { default: [], type: cc.Node, tooltip: '滑动列表容器' },

        actNode: cc.Node,
        clickArrow: cc.Node,
        click_Tag: false,
        editHistoryBox: cc.EditBox,
    },

    onLoad: function () {
        Hall.HallED.addObserver(this);
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                cc.find('bg/top/gy_logo_icon', this.node).active = false;
                break;
        }
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    send: function (gameId) {
        this.getBattleHistory(gameId);
        this._gameId = gameId;
    },
    /**
     * 显示每场中所有局数的列表
     */
    checkBtnCallBack: function (data) {
        this.getBattleRecord(data.historyId);
    },

    /**
     * 初始化 列表
     * @param node
     * @param isCheck 是查看按钮还是回放按钮
     */
    initItem: function (data, itemList, parent, isCheck) {
        cc.dd.ResLoader.loadPrefab(hall_prefab.KLB_HALL_BATTLE_ITEM, function (prefab) {
            for (var i = 0; i < data.length; ++i) {
                var itemData = data[i];
                if (itemData) {
                    var item = cc.instantiate(prefab);
                    itemList.push(item);
                    item.parent = parent;

                    var cnt = itemList.length;
                    // var y = 10 + (cnt - 0.5) * this.battle_itemHeight + (cnt - 1) * this.battle_spaceY;
                    // item.y = -y;
                    // parent.height = cnt * this.battle_itemHeight + (cnt + 1) * this.battle_spaceY;
                    var gameitem = game_type_cfg.getItem(function (item) { return item.key == itemData.gameType });
                    var checked = false;
                    if (gameitem) {
                        checked = (gameitem.is_record == 1);
                    }
                    item.getComponent('klb_hall_BattleItem').setData(itemData, this.checkBtnCallBack.bind(this), checked);
                }
            }
        }.bind(this));
    },

    /**
     * 选择标签
     */
    clickTag: function (event, data) {
        switch (parseInt(data)) {
            case 0:
                this.getBattleHistory(this._gameId);
                break;
            case 1:
                this.getRank();
                break;
            case 2:
                this.descLabel.active = true;
                break;
        }
        this.scorllView.forEach(function (node, idx) {
            if (idx == parseInt(data))
                node.active = true;
            else
                node.active = false;
        });
    },

    /**
     * 获取排行榜信息
     */
    getRank: function () {

    },

    /**
     * 显示每场的具体信息
     */
    showRecordListUI: function (list) {
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BATTLE_RECORD_UI, function (prefab) {
            var component = prefab.getComponent('klb_hall_Battle_Record_UI');
            component.initUI(list);
        }.bind(this));
    },

    /**
     * 发送消息获取战绩
     */
    getBattleHistory: function (gameId) {
        HallSendMsgCenter.getInstance().sendBattleHistory(gameId);
    },
    /**
     * 发送获取详细的战绩数据
     */
    getBattleRecord: function (historyID) {
        HallSendMsgCenter.getInstance().sendBattleRecordDetail(historyID);
    },

    onClickKefu: function (event, data) {
        hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
        //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
        // });
        let Platform = require('Platform');
        let AppCfg = require('AppConfig');
        cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
 * 查看战绩动效果
 */
    onClickShowCheckBox: function (event, data) {
        var self = this;
        self.click_Tag = !self.click_Tag;
        var rotate = cc.rotateBy(0.1, 180);
        var seq = cc.sequence(rotate, cc.callFunc(function () {
            if (self.click_Tag) {
                self.actNode.active = true
                //获取特效
                var anim = self.actNode.getComponent(cc.Animation);
                anim.play('view_show');
            } else {
                var anim = self.actNode.getComponent(cc.Animation);
                anim.play('view_close');
                anim.on('stop', self.closeAnimCallFunc, self);
            }

        }));
        self.clickArrow.runAction(seq);

    },

    /**
     * 关闭查看战绩动效
     */
    onClickCloseCheckBox: function (event, data) {
        var self = this;
        var rotate = cc.rotateBy(0.1, 180);
        self.click_Tag = !self.click_Tag;
        var seq = cc.sequence(rotate, cc.callFunc(function () {
            //获取特效
            var anim = self.actNode.getComponent(cc.Animation);
            anim.play('view_close');
            anim.on('stop', self.closeAnimCallFunc, self);
        }));
        self.clickArrow.runAction(seq);
    },

    /**
     * 动效回调
     */
    closeAnimCallFunc: function () {
        var anim = this.actNode.getComponent(cc.Animation);
        anim.off('stop', this.closeAnimCallFunc, this);
        this.actNode.active = false;
    },

    /**
     * 查看按钮
     */
    onClickCheckRecord: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var historyId = parseInt(this.editHistoryBox.string);
        if (this.editHistoryBox.string == '') {
            cc.dd.PromptBoxUtil.show('请输入回放码');
            return;
        }

        for (var idx = 0; idx < this._itemList.length; idx++) {
            var item = this._itemList[idx];
            var isSelect = item.getComponent('klb_hall_BattleItem').ckeckDataById(historyId);
            if (isSelect) {
                var gameData = item.getComponent('klb_hall_BattleItem').getGameData();

                com_replay_data.Instance().totalRound = gameData.boardscount;
                com_replay_data.Instance().getRecordHttpReq(gameData.gameType, historyId);
                return;
            }
        }
        cc.dd.PromptBoxUtil.show('请输入正确的回放码');
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        dd.NetWaitUtil.close();
        switch (event) {
            case Hall.HallEvent.GET_Battle_History_LIST: //获取战绩信息
                this._itemList.splice(0, this._itemList.length);
                if (data.length > 0) {
                    this.descLabel.active = false;
                    this.battle_ContentNode.removeAllChildren(true);
                    this.initItem(data, this._itemList, this.battle_ContentNode, true);
                } else {
                    this.descLabel.active = true;
                    cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_4);
                }

                break;
            case Hall.HallEvent.GET_Battle_Record:
                this.showRecordListUI(data);//history_id
                break;
            default:
                break;
        }
    },
});
