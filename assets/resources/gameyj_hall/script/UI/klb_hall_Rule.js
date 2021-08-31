// create by wj 2018/03/26
var rule_config = require('klb_rule');
var game_cfg = require("klb_hall_GameList").HallGameList.Instance();
var hall_prefab = require('hall_prefab_cfg');
const GameType = require("klb_hall_GameItem").GameType;
const HallCommonData = require('hall_common_data').HallCommonData;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const GameItem = require("klb_hall_GameItem").GameItem;
var AppConfig = require('AppConfig');
var Define = require('Define');
var klb_game_list_config = require('klb_gameList');
var game_duli = require('game_duli');

let rule = cc.Class({
    extends: cc.Component,

    properties: {
        Content: cc.Node,
        clickTag: { default: [], type: false, tooltip: '判断按钮点击状态' },
        ruleTxt: { default: [], type: cc.RichText, tooltip: '规则内容' },
        ruleBg: { default: [], type: cc.Node, tooltip: '规则背景' },
        parentNode: { default: [], type: cc.Node, tooltip: '父节点' },
        clickBtnNode: { default: [], type: cc.Node, tooltip: '点击按钮' },
        scrollView: { default: [], type: cc.Node, tooltip: '滑动列表' },
        defaultHeight: 100,
        prefabNode: cc.Prefab,
        ruleNodeList: [],

        itemHeight: 100,
        spaceY: 0,
        itemList: [],

        game_Id: 0,
    },

    onLoad: function () {
        if (cc._applyForPayment) {
            let serviceButton = cc.find('contractBtn', this.node);
            if (serviceButton) {
                serviceButton.active = false;
            }
        }

        this.InitGameList();
    },

    /**
     * 初始化游戏列表
     */
    InitGameList: function () {
        var game_List = [];
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧长春麻将
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
                var list = game_cfg.getGameList();
                this.createRuleItem(list);
                if (!cc._chifengGame && cc.game_pid != 10013) {
                    this.createSYKT();
                }
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
                if (cc._chifengGame && itemData.type == GameType.MAJIANG) {
                    continue;
                }
                if (!cc.dd.Utils.checkRuleExist(itemData._game_id))
                    continue;
                var item = cc.instantiate(this.prefabNode);
                this.itemList.push(item);
                item.parent = this.Content;
                var cpt = item.getComponent(cc.Toggle);
                cpt.toggleGroup = this.Content;
                var cnt = this.itemList.length;
                var y = (cnt - 0.5) * this.itemHeight + (cnt - 1) * this.spaceY;
                item.y = -y;
                this.Content.height = cnt * this.itemHeight + (cnt + 1) * this.spaceY;
                var defaultShow = false;
                if (this.itemList.length == 1) {
                    defaultShow = true
                    this.scrollView[0].active = true;
                }
                item.getComponent('klb_hall_RuleItem').setData(itemData, this.clickTagCallBack.bind(this), defaultShow);
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
                item.getComponent('klb_hall_RuleItem').setData(itemData, self.clickTagCallBack.bind(self), defaultShow);
            }
        });
    },

    checkSpecialGame(game, list) {
        let func = (gameType) => {
            for (var i = 0; i < list.length; ++i) {
                var itemData = list[i];
                if (itemData) {
                    if (itemData.isOpen && parseInt(itemData._game_id) == gameType) {
                        return true
                    } else if (itemData.game_list && itemData.game_list.length != 0) {
                        for (let j = 0; j < itemData.game_list.length; ++j) {
                            let _item = itemData.game_list[j];
                            if (_item.isOpen && parseInt(_item._game_id) == gameType) {
                                return true
                            }
                        }

                    }
                }
            }

            return false;
        }

        if (game.gameid == cc.dd.Define.GameType.SYMJ_FRIEND) {
            return func(cc.dd.Define.GameType.SYMJ_GOLD);
            // } else if (game.gameid == cc.dd.Define.GameType.TDK_FRIEND_LIU) {
            //     return func(cc.dd.Define.GameType.TDK_COIN);
        } else {
            return false;
        }
    },

    /**
     * 设置选中状态
     */
    setSelcetState: function (data) {
        this.itemList.forEach(function (item, index) {
            var cpt = item.getComponent('klb_hall_RuleItem');
            if (cpt.checkData(data)) {
                item.getComponent(cc.Toggle).isChecked = true;
                item.getChildByName('background').active = false;
                if (this.itemList.length > 6) {
                    this.scrollView[1].getComponent(cc.ScrollView).scrollToPercentVertical(1 - (index / this.itemList.length));
                }
            }
            else {
                item.getComponent(cc.Toggle).isChecked = false;
                item.getChildByName('background').active = true;
            }
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
        // for(var i = 0; i < 3; i++){
        //     if(this.clickTag[i])
        //         this.clickBtnNode[i].runAction(cc.rotateBy(0.1, 180));
        //     this.clickTag[i] = false;
        //     this.parentNode[i].active = false;
        //     this.ruleBg[i].height = this.defaultHeight;
        // }
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
            var node = cc.instantiate(this.ruleTxt[1].node);
            node.parent = this.ruleTxt[1].node.parent;
            node.getComponent(cc.RichText).string = ruleInfo.playlaws;
            node.active = isShow;
            node._tag = gameId;

            var height = node.height + 20;
            node.parent.height = height;
            this.ruleNodeList.push(node);
            //设置最近更新

            //this.ruleTxt[0].string = ruleInfo.update;
            // if(ruleInfo.update == '')
            //     this.ruleTxt[0].node.height = 0;
            //设置游戏玩法
            //this.ruleTxt[1].string = ruleInfo.playlaws;
            //设置结算
            //this.ruleTxt[2].string = ruleInfo.balance;
        }
    },

    /**
     * 点击按钮显示规则
     */
    clickBtn: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var self = this;
        // var rotate = cc.rotateBy(0.1, 180);
        // var seq = cc.sequence(rotate, cc.callFunc(function () {
        //     self.clickTag[parseInt(data)] = !self.clickTag[parseInt(data)]
        //     //self.showRuleInfo(data);
        // }));
        // this.clickBtnNode[parseInt(data)].runAction(seq);
        cc.tween(this.clickBtnNode[parseInt(data)])
            .by(0.1, { rotation: 180 })
            .call(function () {
                self.clickTag[parseInt(data)] = !self.clickTag[parseInt(data)]
                //self.showRuleInfo(data);
            })
            .start();
    },


    /**
     * 显示规则具体信息
     */
    showRuleInfo: function (data) {
        this.ruleTxt[1].node.parent.children.forEach(function (child) {
            if (child._tag == data)
                child.active = true;
            else
                child.active = false;
        });
        // var node = this.ruleTxt[1].node.parent.getChildByTag(data);
        // node.active = true;
        // var index = parseInt(data);
        // if(this.clickTag[index]){
        //     this.parentNode[index].active = true;
        //     var height = this.ruleTxt[index].node.height;   
        //     if(this.ruleTxt[index].string == ''){
        //         this.parentNode[index].active = false;
        //         height = 0;
        //     }
        //     this.ruleBg[index].height = height > 0 ? height + this.defaultHeight + 20 : this.defaultHeight;
        // }else{
        //     this.ruleBg[index].height = this.defaultHeight;
        //     this.parentNode[index].active = false;
        // }
    },


    onClickKefu: function (event, data) {
        hall_audio_mgr.com_btn_click();
        if (cc._chifengGame) {
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_KEFU);
        } else if (cc.game_pid == 2) {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
                prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
            });
        } else {
            // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
            //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
            // });
            let Platform = require('Platform');
            let AppCfg = require('AppConfig');
            cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
        }
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        this.scrollView[0].active = false;
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
module.exports = rule;
