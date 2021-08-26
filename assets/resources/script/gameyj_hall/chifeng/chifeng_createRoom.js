//craeted by wj 2017/12/19

const game_List = require('klb_gameList');
var HallGameCfg = require("klb_hall_GameList").HallGameList.Instance();
const Define = require("Define");
var AppConfig = require('AppConfig');
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var game_duli = require('game_duli');
let prefab_config = require('klb_friend_group_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var HallPropData = require('hall_prop_data').HallPropData.getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        scrollNode: cc.Node,    //总共场数的列表节点
        contentNode: cc.Node,
        _itemList: [],
        ruleParentNode: cc.Node,
        cardRichTxt: cc.RichText,
        selectGameId: 0,
        commonNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
    },

    onDestroy: function () {
        if (this.touchTimeId) {
            clearTimeout(this.touchTimeId);
            this.touchTimeId = null;
        }
    },

    start: function () {
    },

    /**
     * 显示游戏列表
     */
    showGameList: function (gameId) {
        if(cc._chifengGame){
            let result = cc.sys.localStorage.getItem(cc.dd.user.id + '_last_enter_game');
            result = parseInt(result);
            if(cc.dd._.isNumber(result)){
                gameId = result;
            }
        }

        this.cardRichTxt.string = '已有房卡' + (HallPropData.getRoomCard() || 0) + '张';
        this.scrollNode.active = true;
        for (let i = this._itemList.length - 1; i >= 0; i--) {
            this._itemList[i].getComponent('klb_friend_group_createroom_tag').deleNode();
        }

        this._itemList.splice(0);
        this.gameList = [];
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
                break;
            default:
                if (cc.dd._.isUndefined(HallGameCfg.getGameList())) {
                    HallGameCfg.InitHallGameList();
                }
                var dataList = HallGameCfg.getGameList();
                dataList.forEach(function (item) {
                    if (item._game_id != "") {
                        if((cc._chifengGame && item._type == "majiang") || cc.game_pid == 10003 || cc.game_pid == 10004){
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
                    }
                }.bind(this));
        }

        // if (clubMgr.getClubOpenCreateUITag()) {
        //     this.cardRichTxt.node.active = false;
        // }
        this.initItem(this.gameList, this._itemList, this.contentNode, gameId);
        //this.cardRichTxt.enabled = false;
    },

    /**
     * 体验俱乐部
     */
    showClubGameList() {
        this.cardRichTxt.string = '';
        this.scrollNode.active = true;
        for (let i = this._itemList.length - 1; i >= 0; i--) {
            this._itemList[i].getComponent('klb_hall_GameTag').deleNode();
        }
        this._itemList.splice(0);
        this.gameList = [];
        this.cardRichTxt.node.active = false;

        let gameList = [
            { gameid: cc.dd.Define.GameType.NN_JLB, name: '拼十', gameruleui: 'gameyj_hall/prefabs/create_room/nn_create_room_jlb' },
            //{ gameid: 108, name: '疯狂拼十', gameruleui: 'gameyj_hall/prefabs/create_room/brnn_create_room_jlb' },
        ];

        cc.dd.ResLoader.loadPrefab(prefab_config.KLB_FG_GAMETAGE, function (prefab) {
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
                item.getComponent('klb_friend_group_createroom_tag').setData(gameList[i], this.checkBtnCallBack.bind(this), gameList[0].gameid);
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
        cc.dd.ResLoader.loadPrefab(prefab_config.KLB_FG_GAMETAGE, function (prefab) {
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
                                item.getComponent('klb_friend_group_createroom_tag').setData(itemData, this.checkBtnCallBack.bind(this), gameId);
                            }
                            if (itemData.chongfu != 0) {
                                var item = cc.instantiate(prefab);
                                itemList.push(item);
                                item.parent = parent;
                                var cpt = item.getComponent(cc.Toggle);
                                cpt.toggleGroup = parent;
                                var dataInfo = game_List.getItem(function (item) {
                                    return item.gameid == itemData.chongfu;
                                });
                                item.getComponent('klb_friend_group_createroom_tag').setData(dataInfo, this.checkBtnCallBack.bind(this), gameId);

                            }
                        }
                    }.bind(this);

                    //正常创建
                    callback();
                    //方正填大坑
                    if (gameData.gameid == Define.GameType.TDK_COIN && cc.game_pid == 10003) {
                        itemData = game_List.getItem(function (item) {
                            return item.gameid == Define.GameType.TDK_FRIEND_LIU;
                        });
                        callback();
                    }
                }
            }
        }.bind(this));
    },

    checkBtnCallBack: function (data) {
        this.selectGameId = data.gameid;
        this.changeBtnState(data.gameid);
        // let url = data.gameruleui;
        // url = url.replace("gameyj_hall/prefabs/create_room/", "gameyj_hall/prefabs/chifeng/create_room/");//gameyj_friend/prefab/create_room/
        this.setCreateRoomRule(data.gameruleui, data.gameid)
        // this.updateNode.setGameID(data.gameid);

        if (data.gameruleui != "") {
            this.cardRichTxt.enabled = true;
        } else {
            this.cardRichTxt.enabled = false;
        }
    },

    /**
     * 更改选中的按钮游戏标签状态
     */
    changeBtnState: function (gameId) {
        this._itemList.forEach(function (prefab) {
            var Component = prefab.getComponent('klb_friend_group_createroom_tag');
            prefab.getComponent(cc.Toggle).isChecked = Component.checkSelect(gameId);
        });
    },

    /**
     * 关闭创建房间界面
     */
    onCloseCreateRoomUI: function () {
        var ani = this.node.getChildByName('actionnode').getComponent(cc.Animation);
        ani.play('klb_hall_colseCreateRoom');
        ani.on('stop', this.onStop, this);
    },

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
        let prefabName = ui.replace("gameyj_hall/prefabs/create_room/", "");
        this.ruleParentNode.removeAllChildren(true);
        this.commonNode.active = false;
        cc.dd.UIMgr.openUI(ui, function (node) {
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

            node.parent = this.ruleParentNode;
            this.commonNode.active = true;

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

    /**
     * 打开规则界面
     */
    openSelectGameRule: function () {
        var self = this;
        var gameData = game_List.getItem(function (item) {
            if (item.gameid == self.selectGameId)
                return item;
        })

        cc.dd.UIMgr.openUI(prefab_config.KLB_FG_RULE, function (ui) {
            if (gameData.gameid == Define.GameType.TDK_FRIEND_LIU) {
                var itemData = {
                    _game_id: Define.GameType.TDK_FRIEND_LIU,
                }
            } else {
                var itemData = {
                    _game_id: gameData.connect_f_id,
                }
            }
            var cpt = ui.getComponent('klb_friend_group_rule');
            cpt.clickTagCallBack(itemData);
            //cpt.InitGameList();

        }.bind(this));
    },
});
