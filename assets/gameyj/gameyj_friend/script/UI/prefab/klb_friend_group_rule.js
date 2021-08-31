// create by wj 2018/03/26
var rule_config = require('klb_rule');
var game_cfg = require("klb_hall_GameList").HallGameList.Instance();
const GameType = require("klb_hall_GameItem").GameType;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const GameItem = require("klb_hall_GameItem").GameItem;
var AppConfig = require('AppConfig');
var klb_game_list_config = require('klb_gameList');
var game_duli = require('game_duli');
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        Content: cc.Node,
        clickTag: { default: [], type: false, tooltip: '判断按钮点击状态' },
        ruleTxt: { default: null, type: cc.RichText, tooltip: '规则内容' },
        scrollView: { default: [], type: cc.Node, tooltip: '滑动列表' },
        prefabNode: cc.Prefab,
        ruleNodeList: [],

        itemList: [],

        game_Id: 0,
    },

    onLoad: function () {
        this.InitGameList();
    },

    /**
     * 初始化游戏列表
     */
    InitGameList: function () {
        var game_List = [];
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                var cofnig = game_duli.getItem(function (cfg) {
                    if (cfg.pID == AppConfig.GAME_PID)
                        return cfg;
                }.bind(this));
                if (!cofnig) return;
                var gameItem = klb_game_list_config.getItem(function (item) {
                    if (item.gameid == cofnig.gameid)
                        return item
                }.bind(this));
                var item = new GameItem(gameItem.gameid,
                    gameItem.name,
                    GameType.MAJIANG,
                    gameItem.gamenameicon,
                    "",
                    "",
                    true,
                    gameItem.ishot);
                game_List.push(item);
                this.createRuleItem(game_List);
                return;
            default:
                if (cc.dd._.isUndefined(game_cfg.getGameList())) {
                    game_cfg.InitHallGameList();
                }
                var list = game_cfg.getGameList().slice();

                let info = clubMgr.getClubInfoByClubId(clubMgr.getSelectClubId());
                if (info && info.type == 1) {
                    var gameItem = klb_game_list_config.getItem(function (item) {
                        if (item.gameid == cc.dd.Define.GameType.NN_JLB)
                            return item
                    }.bind(this));
                    var item = new GameItem(gameItem.gameid,
                        gameItem.name,
                        GameType.POKER,
                        gameItem.gamenameicon,
                        "",
                        "",
                        true,
                        gameItem.ishot);
                    list.push(item);
                }

                this.createRuleItem(list);
                this.createSYKT();
                return;
        }
    },

    /**
     * 创建规则item
     * @param game_List 游戏集合
     */
    createRuleItem: function (game_List) {
        for (var i = 0; i < game_List.length; ++i) {
            var itemData = game_List[i];
            if (itemData && (itemData.type == GameType.POKER || itemData.type == GameType.MAJIANG) && itemData.isOpen) {
                var item = cc.instantiate(this.prefabNode);
                this.itemList.push(item);
                item.parent = this.Content;
                var cpt = item.getComponent(cc.Toggle);
                cpt.toggleGroup = this.Content;

                var defaultShow = false;
                if (this.itemList.length == 1) {
                    defaultShow = true
                    this.scrollView[0].active = true;
                }
                item.getComponent('klb_friend_group_createroom_tag').setRuleData(itemData, this.clickTagCallBack.bind(this), defaultShow);
                if (itemData._game_id == 61)
                    this.setRuleInfo(itemData._game_id);
            } else {
                if (itemData.game_list && itemData.game_list.length != 0) {
                    this.createRuleItem(itemData.game_list);
                }
            }
        }
    },

    /**
     * 创建松原快听
     */
    createSYKT: function () {
        if (cc._useChifengUI)
            return;
        var self = this
        var list = game_cfg.getGameList();
        rule_config.items.forEach(function (info) {
            if (info.special == 1 && self.checkSpecialGame(info, list)) {
                var item = cc.instantiate(self.prefabNode);
                self.itemList.push(item);
                item.parent = self.Content;
                var cpt = item.getComponent(cc.Toggle);
                cpt.toggleGroup = self.Content;
                var cnt = self.itemList.length;
                var y = (cnt - 0.5) * self.itemHeight + (cnt - 1) * self.spaceY;
                item.y = -y;
                self.Content.height = cnt * self.itemHeight + (cnt + 1) * self.spaceY;
                var defaultShow = false;
                var itemData = {
                    _game_id: info.gameid,
                    name: info.name,
                }
                item.getComponent('klb_friend_group_createroom_tag').setRuleData(itemData, self.clickTagCallBack.bind(self), defaultShow);
            }
        });
    },

    checkSpecialGame(game, list){
        let func = (gameType)=>{
            for (var i = 0; i < list.length; ++i) {
                var itemData = list[i];
                if (itemData) {
                    if(itemData.isOpen && parseInt(itemData._game_id) == gameType){
                        return true
                    }else if(itemData.game_list && itemData.game_list.length != 0){
                        for (let j = 0; j < itemData.game_list.length; ++j){
                            let _item = itemData.game_list[j];
                            if(_item.isOpen && parseInt(_item._game_id) == gameType){
                                return true
                            }
                        }

                    }
                }
            }

            return false;
        }

        if(game.gameid == cc.dd.Define.GameType.SYMJ_FRIEND){
            return func(cc.dd.Define.GameType.SYMJ_GOLD);
        }else if(game.gameid == cc.dd.Define.GameType.TDK_FRIEND_LIU){
            return func(cc.dd.Define.GameType.TDK_COIN);
        }else{
            return false;
        }
    },

    /**
     * 设置选中状态
     */
    setSelcetState: function (data) {
        this.itemList.forEach(function (item, index) {
            var cpt = item.getComponent('klb_friend_group_createroom_tag');
            if (cpt.checkData(data)) {
                this.scrollView[1].getComponent(cc.ScrollView).scrollToPercentVertical(1 - (index / this.itemList.length));
            }
            cpt.getComponent(cc.Toggle).isChecked = cpt.checkSelect(data._game_id);
        }.bind(this));
    },
    /**
     * 点击标签消息返回
     */
    clickTagCallBack: function (data) {
        if (data) {
            this.resetUI();
            this.setRuleInfo(data._game_id);
            this.showRuleInfo(data._game_id);
            this.setSelcetState(data);
            this.game_Id = data._game_id;
        }
    },

    /**
     * 重置界面显示
     */
    resetUI: function () {
        var cpt = this.scrollView[0].getComponent(cc.ScrollView)
        cpt.scrollToTop();
    },

    /**
     * 设置规则
     */
    setRuleInfo: function (gameId, isShow) {
        var canCreate = true;
        this.ruleNodeList.forEach(function (node) {
            if (node._tag == gameId) {
                var height = node.height + 20;
                node.parent.height = height;
                canCreate = false;
                return;
            }
        })
        if (canCreate == false)
            return;
        var ruleInfo = rule_config.getItem(function (data) {
            return data.gameid == gameId;
        });
        if (ruleInfo) {
            var node = cc.instantiate(this.ruleTxt.node);
            node.parent = this.ruleTxt.node.parent;
            node.getComponent(cc.RichText).string = ruleInfo.playlaws;
            node.active = isShow;
            node._tag = gameId;

            var height = node.height + 20;
            node.parent.height = height;
            this.ruleNodeList.push(node);
        }
    },

    /**
     * 显示规则具体信息
     */
    showRuleInfo: function (data) {
        this.ruleTxt.node.parent.children.forEach(function (child) {
            if (child._tag == data)
                child.active = true;
            else
                child.active = false;
        });
    },


    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
