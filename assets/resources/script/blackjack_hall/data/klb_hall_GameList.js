//created by wj 2017/12/14
var HallGameCfg = require("klb_hall_GameCfg");
const GameType = require("klb_hall_GameItem").GameType;
const GameItem = require("klb_hall_GameItem").GameItem;
const klb_game_Confg = require('klb_gameList');
var ED = require("EventDispatcher");
var game_channel_cfg = require('game_channel');
var AppConfig = require('AppConfig');
/**
 * 事件类型
 */
var HallGameListEvent = cc.Enum({});

/**
 * 事件管理
 */
var HallGameListED = new ED;

var HallGameList = cc.Class({

    s_hall_gameList: null,

    statics: {

        Instance: function () {
            if (!this.s_hall_gameList) {
                this.s_hall_gameList = new HallGameList();
            }
            return this.s_hall_gameList;
        },

        Destroy: function () {
            if (this.s_hall_gameList) {
                this.s_hall_gameList = null;
            }
        },

    },

    //初始化默认游戏
    initDefaultGame: function () {
        this.defalutSelectList = [];

        let _gameType = cc.dd.Define.GameType;
        for (var i = 0; i < klb_game_Confg.items.length; i++) {
            var data = klb_game_Confg.items[i];
            if (!cc._chifengGame && (data.gameid == _gameType.DDZ_XYPYC || data.gameid == _gameType.DDZ_XYJBC || data.gameid == _gameType.CFMJ_GOLD || data.gameid == _gameType.CFMJ_FRIEND || data.gameid == _gameType.AHMJ_GOLD || data.gameid == _gameType.AHMJ_FRIEND || data.gameid == _gameType.WDMJ_GOLD || data.gameid == _gameType.WDMJ_FRIEND || data.gameid == _gameType.PZMJ_GOLD || data.gameid == _gameType.PZMJ_FRIEND)) {
                continue;
            }
            if (data.gameid != 0 && data.isfriend == 0 && data.isopen != 0 && data.isdefault != 0 && this.checkGameId(data.gameid)) {
                this.defalutSelectList.push(data.gameid);
            }
        }
        var compare = function (a, b) {
            var data_a = klb_game_Confg.getItem(function (item) {
                if (item.gameid == a)
                    return item;
            })

            var data_b = klb_game_Confg.getItem(function (item) {
                if (item.gameid == b)
                    return item;
            })

            if (data_a.priority < data_b.priority)
                return 1;
            else if (data_a.priority > data_b.priority)
                return -1
            else
                return 0;
        }
        if(!cc._chifengGame){
            this.defalutSelectList.sort(compare);
        }
        this.createGameItem(this.defalutSelectList);
    },


    //根据地区获取数据
    InitGameCfg: function () {
        var channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == AppConfig.GAME_PID)
                return true;
        })
        var json = cc.sys.localStorage.getItem('provinceid');
        var key = cc.sys.localStorage.getItem('locationid');
        var game_select = cc.sys.localStorage.getItem('selectgame');
        //var defalut_select = cc.sys.localStorage.getItem('defalutselectgame');
        this.gamePushList = [];
        if (json && !channel_games) {
            var str = 'province_' + json;
            var config = require(str);

            var countyData = config.getItem(function (data) {
                return data.key == parseInt(key);
            });

            if (countyData) {
                var mj_gameList = countyData.mjgame.split(';');
                this.createGameItem(mj_gameList);

                var pk_gameList = countyData.pkgame.split(';');
                this.createGameItem(pk_gameList);
            }
        }

        // if(defalut_select){
        //     var gameList = defalut_select.split(';');
        //     this.createGameItem(gameList);
        // }
        this.initDefaultGame()
        if (game_select) {
            var gameList = game_select.split(';');
            this.createGameItem(gameList);
        }
    },

    //创建游戏数据
    createGameItem: function (gameList) {
        gameList.forEach(function (gameid) {
            var gameData = klb_game_Confg.getItem(function (data) {
                return (data.gameid != 0 && data.gameid == gameid && data.isfriend == 0);
            });

            if (gameData && gameData.isopen != 0 && this.checkGameId(gameid)) {
                this.gamePushList.push(gameid);
                var ntype = GameType.POKER;
                if (gameData.type == 0)
                    ntype = GameType.MAJIANG;
                else if (gameData.type == 2)
                    ntype = GameType.BOCAI;

                var gameItem = new GameItem(
                    gameid,  //游戏id
                    gameData.name,                                              //游戏名字
                    ntype,     //游戏类型：麻将／纸牌
                    gameData.gamenameicon,                                              //游戏icon
                    "",                          //子游戏的事件监听脚本
                    "",
                    gameData.isclick > 0 ? true : false,
                    gameData.ishot,
                    gameData.ty
                );
                gameItem.chongfu = gameData.chongfu;
                var index = this.gameList.length - 1;
                this.gameList.splice(index, 0, gameItem);
            }
        }.bind(this));
    },

    //查找重复的id
    checkGameId: function (gameid) {
        for (var i = 0; i < this.gamePushList.length; i++) {
            if (this.gamePushList[i] == gameid)
                return false;
        }
        return true;
    },

    InitHallGameList: function () {
        this.gameList = [];
        HallGameCfg.Hall_Game_List.list.forEach(function (item) {
            this.gameList.push(item);
        }.bind(this));
        this.InitGameCfg();
        this.initGameGroup();
    },

    /**
     * 初始化游戏合集
     */
    initGameGroup: function () {
        let cfg_groups = require('gamegroup').getItemList(function (item) {
            return true;
        });
        //在活动后的位置插入合集
        let pos = 4;
        if(cc._chifengGame){
            pos = 5;
        }
        for (let i = 0; i < cfg_groups.length; ++i) {
            let cfg_group = cfg_groups[i];
            let cfg_group_games = cfg_group.gameid.split(';');
            let group = {};
            group.name = cfg_group.name;
            group.game_list = [];
            var count = 0;
            for (let i = 0; i < this.gameList.length; ++i) {
                if (cfg_group_games.indexOf(this.gameList[i]._game_id + '') != -1)
                    count++;
            }
            if (count > 1) {
                for (let i = 0; i < this.gameList.length; ++i) {
                    let game = this.gameList[i];
                    if (cfg_group_games.indexOf(game._game_id + '') != -1) {
                        this.gameList.splice(i, 1);
                        --i;
                        group.game_list.push(game);
                    }
                    // //合集最多十个
                    // if (group.game_list.length >= 10) {
                    //     break;
                    // }
                }
                if (group.game_list.length > 0) {
                    this.gameList.splice(pos, 0, group);
                    if(!cc._chifengGame){
                        if(i == 0){
                            pos +=1;
                        }else{
                            pos+=2;
                        }
                    }else{
                        pos++;
                    }
                }
            }
        }
    },

    InitVipGameList: function () {
        this.gameList = [];
        HallGameCfg.Vip_Game_List.list.forEach(function (item) {
            this.gameList.push(item);
        }.bind(this));
    },

    addGame: function (gameItem) {
        const game = this.getGame(gameItem.game_id);
        if (game) {
            cc.log("已存在指定游戏");
            cc.log(gameItem.toString());
            return;
        }
        this.gameList.push(gameItem);
    },

    getGame: function (game_id) {
        let game = null;
        this.gameList.forEach(function (gameItem, idx) {
            if (gameItem.game_id == game_id) {
                game = gameItem;
            }
        });
        return game;
    },

    removeGame: function (game_id) {
        this.gameList.forEach(function (gameItem, idx) {
            if (gameItem.game_id == game_id) {
                dd._.pull(this.gamePageView, gameItem);
            }
        });
    },

    getGameList: function () {
        return this.gameList;
    },

});

module.exports = {
    HallGameListEvent: HallGameListEvent,
    HallGameListED: HallGameListED,
    HallGameList: HallGameList,
};
