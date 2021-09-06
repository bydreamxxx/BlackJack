//craeted by wj 2017/12/19

const game_List = require('klb_gameList');
var hall_prefab = require('hall_prefab_cfg');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var HallGameCfg = require("klb_hall_GameList").HallGameList.Instance();
const Define = require("Define");
var AppConfig = require('AppConfig');
var dd = cc.dd;
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var game_duli = require('game_duli');
var game_channel_cfg = require('game_channel');

cc.Class({
    extends: cc.Component,

    properties: {
        scrollNode: cc.Node,    //总共场数的列表节点
        contentNode: cc.Node,
        spaceY: 0,
        itemHeight: 146,
        _itemList: [],
        ruleParentNode: cc.Node,
        cardRichTxt: cc.RichText,
        selectGameId: 0,
        shielding: cc.Node,
        ruleNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        if (this.ruleNode) {
            this.ruleNode.active = !cc._chifengGame;
        }
    },
    onDestroy: function () {

    },

    start: function () {
    },

    moveToCenter() {
        let actionnode = this.node.getChildByName('actionnode');
        let widget = actionnode.getComponent(cc.Widget);
        let bgNode = actionnode.getChildByName('bg');
        widget.horizontalCenter = -bgNode.x;
        widget.isAlignHorizontalCenter = true;
        widget.updateAlignment();
    },

    /**
     * 显示游戏列表
     */
    showGameList: function (gameId, bl) {
        if (this.shielding) {
            this.shielding.active = bl != null ? bl : false;
            this.uiCallBackbl = bl;
        }

        if (cc._chifengGame) {
            let result = cc.sys.localStorage.getItem(cc.dd.user.id + '_last_enter_game');
            result = parseInt(result);
            if (cc.dd._.isNumber(result)) {
                gameId = result;
            }
        }

        // this.cardRichTxt.string = '<color=#3d3d3d>已有房卡</c>' + '<color=#228b22>' + (HallPropData.getRoomCard() || 0) + '</c><color=#3d3d3d>张</c>';
        this.cardRichTxt.string = '已有房卡' + (HallPropData.getRoomCard() || 0) + '张';
        this.scrollNode.active = true;
        for (let i = this._itemList.length - 1; i >= 0; i--) {
            this._itemList[i].getComponent('klb_hall_GameTag').deleNode();
        }

        this._itemList.splice(0);
        this.gameList = [];
        if (bl) {
            this.gameList.push(Define.GameType.TDK_COIN);
        } else {
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
                    this.gameList.push(cofnig.gameid);
                    cc.find('actionnode/gy_logo_icon', this.node).active = false;
                    break;
                case 10009:
                    this.gameList = [51, 41, 129];
                    break;
                // case 10004:
                //     this.gameList = [41];
                //     break;
                default:
                    if (cc.dd._.isUndefined(HallGameCfg.getGameList())) {
                        HallGameCfg.InitHallGameList();
                    }
                    var dataList = HallGameCfg.getGameList();

                    let func = (item) => {
                        if (item.game_list) {
                            for (var i = 0; i < item.game_list.length; ++i) {
                                var listitem = item.game_list[i];
                                this.gameList.push(listitem._game_id);
                            }
                        } else if (item.chongfu && item.chongfu > 0) {
                            this.gameList.push(item._game_id);
                            this.gameList.push(item.chongfu);
                        } else {
                            this.gameList.push(item._game_id);
                        }
                    }

                    dataList.forEach(function (item) {
                        if (item._game_id != "") {
                            if (cc._chifengGame) {
                                if (item._type == "majiang") {
                                    func(item);
                                }
                            } else {
                                func(item);
                            }
                        }
                    }.bind(this));
            }
        }

        if (clubMgr.getClubOpenCreateUITag()) {
            this.cardRichTxt.node.active = false;
        }
        this.initItem(this.gameList, this._itemList, this.contentNode, gameId);
        //this.cardRichTxt.enabled = false;
    },

    showClubGameList() {
        this.scrollNode.active = true;
        for (var i in this._itemList) {
            this._itemList[i].getComponent('klb_hall_GameTag').deleNode();
        }
        this._itemList.splice(0);
        this.gameList = [];
        this.cardRichTxt.node.active = false;

        let gameList = [
            { gameid: 52, name: '拼十', gameruleui: 'blackjack_hall/prefabs/create_room/nn_create_room_jlb' },
            //{ gameid: 108, name: '疯狂拼十', gameruleui: 'blackjack_hall/prefabs/create_room/brnn_create_room_jlb' },
        ];

        cc.dd.ResLoader.loadPrefab(hall_prefab.KLB_HALL_GAMETAGE, function (prefab) {
            for (var i = 0; i < gameList.length; ++i) {
                var item = cc.instantiate(prefab);
                this._itemList.push(item);
                item.parent = this.contentNode;
                var cpt = item.getComponent(cc.Toggle);
                cpt.toggleGroup = this.contentNode;
                var cnt = this._itemList.length;
                var y = (cnt) * this.itemHeight + (cnt - 1) * this.spaceY;
                item.y = -y;
                this.contentNode.height = cnt * this.itemHeight + (cnt + 1) * this.spaceY;
                item.getComponent('klb_hall_GameTag').setData(gameList[i], this.checkBtnCallBack.bind(this), gameList[0].gameid);
            }
        }.bind(this));
    },

    sortGameList: function (arr) {
        var i = arr.length;
        while (i > 0) {
            for (var j = 0; j < i - 1; j++) {
                var gameData_j = game_List.getItem(function (item) {
                    return item.gameid == parseInt(arr[j]);
                });
                if (gameData_j) {
                    gameData_j = game_List.getItem(function (item) {
                        return item.gameid == gameData_j.connect_f_id;
                    })
                }

                var gameData_jj = game_List.getItem(function (item) {
                    return item.gameid == parseInt(arr[j + 1]);
                })
                if (gameData_jj) {
                    gameData_jj = game_List.getItem(function (item) {
                        return item.gameid == gameData_jj.connect_f_id;
                    })
                }
                if (gameData_j && gameData_jj) {
                    if (gameData_j.priority < gameData_jj.priority) {
                        var temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }

                }
            }
            i--;
        }

        //根据渠道置顶游戏
        let topGame = '163';

        let channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == AppConfig.GAME_PID)
                return true;
        });

        if (channel_games) {
            topGame = channel_games.defaultPlay;
        }

        //调整港式五张位置
        let index = arr.indexOf(topGame)
        if (index != -1) {
            arr.splice(index, 1);
            arr.unshift(parseInt(topGame));
        } else {
            index = arr.indexOf(parseInt(topGame))
            if (index != -1) {
                arr.splice(index, 1);
                arr.unshift(parseInt(topGame));
            }
        }
    },

    /**
     * 初始化 列表
     * @param data       列表数据
     * @param itemList   数据保存容器
     * @param parent     滑动列表，节点父节点
     * @param gameId     游戏id作为判定用
     */
    initItem: function (data, itemList, parent, gameId) {
        // if(gameId == 0)
        // {
        //     gameId = Define.GameType.JLMJ_FRIEND;
        // }

        this.sortGameList(data);

        cc.dd.ResLoader.loadPrefab(hall_prefab.KLB_HALL_GAMETAGE, function (prefab) {
            for (var i = 0; i < data.length; ++i) {
                var gameData = game_List.getItem(function (item) {
                    return item.gameid == parseInt(data[i]);
                })
                if (gameData) {
                    var itemData = game_List.getItem(function (item) {
                        return item.gameid == gameData.connect_f_id;
                    });
                    if (!itemData) {
                        itemData = game_List.getItem(function (item) {
                            if (gameData.chongfu != 0) {
                                return item.gameid == gameData.gameid;
                            }
                        });
                    }
                    if (itemData && itemData.isopen != 0) {
                        if ((itemData.gameid == cc.dd.Define.GameType.HLMJ_GOLD || itemData.gameid == cc.dd.Define.GameType.HLMJ_FRIEND) && cc.game_pid == 0) {
                            continue;
                        }
                    }

                    var callback = function () {
                        if (itemData && itemData.isopen != 0) {
                            itemData.idxnum = i + 1;
                            if (itemData && itemData.isfriend != 0 && itemData.gameid != 0) {
                                gameId = gameId > 0 ? gameId : itemData.gameid;
                                // if (itemData.chongfu != 0) {
                                //     gameId = itemData.chongfu;
                                // }
                                var item = cc.instantiate(prefab);
                                itemList.push(item);
                                item.parent = parent;
                                var cpt = item.getComponent(cc.Toggle);
                                cpt.toggleGroup = parent;
                                var cnt = itemList.length;
                                var y = (cnt - 0.5) * this.itemHeight + (cnt - 1) * this.spaceY;
                                item.y = -y;
                                parent.height = cnt * this.itemHeight + (cnt + 1) * this.spaceY;
                                item.getComponent('klb_hall_GameTag').setData(itemData, this.checkBtnCallBack.bind(this), gameId);
                            }
                            if (itemData.chongfu != 0) {
                                var item = cc.instantiate(prefab);
                                itemList.push(item);
                                item.parent = parent;
                                var cpt = item.getComponent(cc.Toggle);
                                cpt.toggleGroup = parent;
                                var cnt = itemList.length;
                                var y = (cnt - 0.5) * this.itemHeight + (cnt - 1) * this.spaceY;
                                item.y = -y;
                                parent.height = cnt * this.itemHeight + (cnt + 1) * this.spaceY;
                                var dataInfo = game_List.getItem(function (item) {
                                    return item.gameid == itemData.chongfu;
                                });
                                item.getComponent('klb_hall_GameTag').setData(dataInfo, this.checkBtnCallBack.bind(this), gameId);

                            }
                        }
                    }.bind(this);

                    //正常创建
                    callback();
                    //方正填大坑
                    if (gameData.gameid == Define.GameType.TDK_COIN && (AppConfig.GAME_PID != 10009 && AppConfig.GAME_PID != 10004 && AppConfig.GAME_PID != 10011 && AppConfig.GAME_PID != 10013 && AppConfig.GAME_PID != 10014)) {
                        itemData = game_List.getItem(function (item) {
                            return item.gameid == Define.GameType.TDK_FRIEND_LIU;
                        });
                        callback();
                    }
                }
            }

            if (!cc._useChifengUI && !cc._useCardUI) {
                var item = cc.instantiate(prefab);
                itemList.push(item);
                item.parent = parent;

                var cnt = itemList.length;
                var y = (cnt - 0.5) * this.itemHeight + (cnt - 1) * this.spaceY;
                item.y = -y;
                parent.height = cnt * this.itemHeight + (cnt + 1) * this.spaceY + this.itemHeight / 2;
                item.getComponent('klb_hall_GameTag').setAddGameData(this.addGameOpen.bind(this));
            }


        }.bind(this));
    },

    checkBtnCallBack: function (data) {
        this.selectGameId = data.gameid;
        this.ruleNodeStatus(this.ruleNode, data.gameid);
        this.changeBtnState(data.gameid);
        this.setCreateRoomRule(data.gameruleui, data.gameid);
        if (data.gameruleui != "") {
            this.cardRichTxt.enabled = true;
        } else {
            this.cardRichTxt.enabled = false;
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

    //打开添加游戏界面
    addGameOpen: function (event) {
        switch (AppConfig.GAME_PID) {
            case 2:  //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                this.onCloseCreateRoomUI();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_PROMTE, function () {
                }.bind(this));
                break;
            case 10004:
            case 10009:
                event.isChecked = false;
                cc.dd.PromptBoxUtil.show('暂未开放');
                break;
            default:
                this.onCloseCreateRoomUI();
                dd.UIMgr.openUI(hall_prefab.KLB_HALL_MAP_ADD_GAME, function (node) {
                    var json = cc.sys.localStorage.getItem('provinceid');
                    node.getComponent('klb_hall_Map_Add_Game').init(parseInt(json));
                }.bind(this));
                break;
        }
    },

    /**
     * 更改选中的按钮游戏标签状态
     */
    changeBtnState: function (gameId) {
        this._itemList.forEach(function (prefab) {
            var Component = prefab.getComponent('klb_hall_GameTag');
            let isChecked = Component.checkSelect(gameId);
            prefab.getComponent(cc.Toggle).isChecked = isChecked;
            Component.bg.active = !isChecked;
        });
    },

    /**
     * 关闭创建房间界面
     */
    onCloseCreateRoomUI: function () {
        clubMgr.setClubOpenCreateUITag(false);
        clubMgr.setClubCreateRoomType(0);
        if (cc.game_pid == 10004) {
            this.node.active = false;
        } else {
            var ani = this.node.getChildByName('actionnode').getComponent(cc.Animation);
            ani.play('klb_hall_colseCreateRoom');
            ani.on('stop', this.onStop, this);
        }
    },

    /***
 * 特效播放完毕的回调
 */
    onStop: function () {
        if (this.node && this.node.isValid) {
            var ani = this.node.getChildByName('actionnode').getComponent(cc.Animation);
            ani.off('stop', this.onStop, this);
            this.node.active = false;
        }
    },

    /**
     * 设置游戏规则界面
     */
    setCreateRoomRule: function (ui, gameid) {
        let prefabName = ui.replace("blackjack_hall/prefabs/create_room/", "");
        this.ruleParentNode.removeAllChildren(true);
        cc.dd.UIMgr.openUI(ui, function (node) {
            node.parent = this.ruleParentNode;

            // cc.find("commonRule/proxy", node).active = cc._useChifengUI;

            if (cc._useChifengUI) {
                this.gameNode = node.getComponent(prefabName);
                if (!this.gameNode) {
                    prefabName = this.getPrefabName(gameid);
                    if (prefabName) {
                        this.gameNode = node.getComponent(prefabName);
                    }
                }

                if (this.gameNode) {
                    this.gameNode.setClubInfo();
                }
            }

            if (!this.uiCallBackbl || !gameid) return;
            switch (gameid) {
                case Define.GameType.TDK_FRIEND:
                case Define.GameType.TDK_FRIEND_LIU:
                    node.getComponent('tdk_rule_ui').initUI();
                    break;
            }
            //this.ruleParentNode.addChild(node);
        }.bind(this));

    },


    /**
     * 打开规则界面
     */

    openSelectGameRule: function () {
        var self = this;
        var gameData = game_List.getItem(function (item) {
            if (item.gameid == self.selectGameId)
                return item;
        })

        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_RULE, function (ui) {
            if (gameData.gameid == Define.GameType.TDK_FRIEND_LIU) {
                var itemData = {
                    _game_id: Define.GameType.TDK_FRIEND_LIU,
                }
            } else {
                var itemData = {
                    _game_id: gameData.connect_f_id,
                }
            }

            var cpt = ui.getComponent('klb_hall_Rule');
            cpt.clickTagCallBack(itemData);
            //cpt.InitGameList();

        }.bind(this));
    },

    getPrefabName(gameid) {
        switch (gameid) {
            case cc.dd.Define.GameType.NEW_DSZ_FRIEND:
                return 'gameyj_new_dsz_create_room';
            case cc.dd.Define.GameType.TDK_FRIEND:
            case cc.dd.Define.GameType.TDK_FRIEND_LIU:
                return 'tdk_rule_ui';
            case cc.dd.Define.GameType.HBSL_JBL:
            case cc.dd.Define.GameType.HBSL_GOLD:
                return 'hbls_create_room';
            case cc.dd.Define.GameType.XZMJ_FRIEND:
            case cc.dd.Define.GameType.XLMJ_FRIEND:
                return 'scmj_create_room';
            default:
                return null;
        }
    },
});
