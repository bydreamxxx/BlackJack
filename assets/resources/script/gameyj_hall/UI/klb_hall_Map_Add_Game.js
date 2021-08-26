//create by wj 2018/03/21
var map_config = require('hallmap');
var hall_prefab = require('hall_prefab_cfg');
var klb_hall_gameList = require('klb_gameList');
const Hall = require('jlmj_halldata');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AppConfig = require('AppConfig')
var game_channel_cfg = require('game_channel');
cc.Class({
    extends: cc.Component,

    properties: {
        ContentNode: cc.Node,
        provinceLabel: cc.Label,
        toggle: { default: [], type: cc.Node, tooltip: "复选按钮" },
        itemList: [],
        provinceId: 0,
        itemHeight: 100,
        spaceY: 0,
        itemWidth: 250,
        spaceX: 0,
        gameContainor: [],
    },


    onLoad() {
        cc.find("Background", this.toggle[0]).active = false;

        if(cc._applyForPayment){
            let serviceButton = cc.find('bg/tagSp/contractBtn', this.node);
            if(serviceButton){
                serviceButton.active = false;
            }
        }

    },
    //初始化界面
    init: function (provinceId) {
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧长春麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                return;
        }
        var channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == AppConfig.GAME_PID)
                return true;
        })
        if (channel_games && cc.game_pid != 10015) {//平台包
            this.provinceLabel.node.active = false;
            this.ContentNode.removeAllChildren(true);
            this._channelGame = true;
            this._clgames = channel_games.gameid.split(';');
            this._mjgames = [];
            this._pkgames = [];
            var ignore_games = [175, 176, 179, 134, 180, 129];
            if (10009 == AppConfig.GAME_PID){
                ignore_games.push(173);
            }else if(10012 == AppConfig.GAME_PID){
                ignore_games.push(142);
                ignore_games.push(51);
                ignore_games.push(109);
                ignore_games.push(135);
                ignore_games.push(163);
                ignore_games.push(103);
                ignore_games.push(143);
                ignore_games.push(136);
                ignore_games.push(104);
                ignore_games.push(138);
                ignore_games.push(105);
                ignore_games.push(101);
                ignore_games.push(102);
                ignore_games.push(139);
            }
            for (var i = 0; i < klb_hall_gameList.items.length; i++) {
                var data = klb_hall_gameList.items[i];
                if (ignore_games.indexOf(data.gameid) != -1)
                    continue;
                if (data.gameid != 0 && data.isfriend == 0 && data.isopen != 0) {
                    if (data.type == 0)
                        this._mjgames.push(data.gameid);
                    else
                        this._pkgames.push(data.gameid);
                }
            }
            this.updatePageList(this._mjgames, 0);
        }
        else {
            //获取配置表数据
            var provinceData = map_config.getItem(function (data) {
                return data.province_code == provinceId;
            });

            this.ContentNode.removeAllChildren(true);
            cc.log('contentNodeChildCount+++++++++++++++++========' + this.ContentNode.childrenCount);
            this.itemList.splice(0, this.itemList.length);

            this.provinceLabel.string = provinceData.name + '[切换]';
            var mj_gameList = provinceData.mj_game.split(';');
            cc.log('mj_gameList_Count==========' + mj_gameList.length);
            this.updatePageList(mj_gameList, 0);
            this.provinceId = provinceId;
        }
    },

    //更新游戏列表
    updatePageList: function (gameList, type) {
        this.ContentNode.removeAllChildren(true);
        this.itemList.splice(0, this.itemList.length);

        var listStr = cc.sys.localStorage.getItem('selectgame');
        var list = listStr.split(';');

        if (this._channelGame)
            var countyGame = this._clgames;
        else {
            var json = cc.sys.localStorage.getItem('provinceid');
            var key = cc.sys.localStorage.getItem('locationid');
            var config_str = 'province_' + json;

            var config = require(config_str);
            var county = config.getItem(function (dataInfo) {
                return dataInfo.key == parseInt(key);
            });
            var gameListStr = county.mjgame;
            if (type == 1)
                gameListStr = county.pkgame;
            var countyGame = gameListStr.split(';');
        }

        cc.dd.ResLoader.loadPrefab(hall_prefab.KLB_HALL_MAP_SELECT_NODE, function (prefab) {
            gameList.forEach(function (gameId) {
                var gameData = klb_hall_gameList.getItem(function (gameItem) {
                    return gameItem.gameid == gameId;
                })
                if (gameData && gameData.isopen == 1) {
                    if (!this.checkRepeatGameId(countyGame, gameId)) {
                        var item = cc.instantiate(prefab);
                        this.itemList.push(item);
                        item.parent = this.ContentNode;
                        var cnt = this.itemList.length;

                        var y = (Math.ceil(cnt / 2) - 0.5) * this.itemHeight + (Math.ceil(cnt / 2) - 0.5) * this.spaceY;
                        item.y = -y;
                        var index = (cnt % 2);
                        // if (index == 0) { index = 3; }
                        var x = (this.itemWidth + this.spaceX) / 2;
                        x *= index == 0 ? 1 : -1;
                        item.x = x;
                        var isSelect = this.checkRepeatGameId(list, gameId);
                        item.getComponent('klb_hall_Map_Select_Node').setData(gameId, isSelect, this.setSelectGame.bind(this));
                    }
                }
            }.bind(this));
            this.ContentNode.height = (Math.ceil(gameList.length / 2)) * this.itemHeight + ((Math.ceil(gameList.length / 2)) + 1) * this.spaceY + this.itemHeight;
        }.bind(this));
    },

    //保存选择的游戏
    setSelectGame: function (gameId, isAdd) {
        var listStr = cc.sys.localStorage.getItem('selectgame');
        var list = listStr.split(';');

        var listNewStr = cc.sys.localStorage.getItem('newgame');
        var listNew = [];
        if (listNewStr)
            listNew = listNewStr.split(';');
        else
            listNewStr = ';';
        if (isAdd) {
            var end = this.checkRepeatGameId(list, gameId);
            if (!end)
                listStr = listStr + gameId + ';';

            cc.sys.localStorage.setItem('selectgame', listStr);

            var have = this.checkRepeatGameId(listNew, gameId);
            if (!have)
                listNewStr = listNewStr + gameId + ';';
            cc.sys.localStorage.setItem('newgame', listNewStr);
        } else {
            for (var i = 0; i < list.length; i++) {
                if (list[i] == gameId)
                    list.splice(i, 1);
            }
            var newListStr = '';
            list.forEach(function (id) {
                newListStr = newListStr + id + ';';
            });
            cc.sys.localStorage.setItem('selectgame', newListStr);

            for (var k = 0; k < listNew.length; k++) {
                if (listNew[i] == gameId)
                    listNew.splice(k, 1);
            }
            var newGameListStr = '';
            listNew.forEach(function (id) {
                newGameListStr = newGameListStr + id + ';';
            });
            cc.sys.localStorage.setItem('newgame', newGameListStr);
        }
    },

    //查找重复的数据
    checkRepeatGameId: function (list, gameid) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] == gameid)
                return true
        }
        return false;
    },

    //打开地图
    openMap: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_MAP_PROVINCE_MAP, function (prefab) {
            var cpt = prefab.getComponent('klb_hall_Map_Province_Map');
            cpt.openMap();
            cc.dd.UIMgr.destroyUI(this.node);
        }.bind(this));
    },

    //点击麻将馆
    onClickMj: function (event, data) {
        hall_audio_mgr.com_btn_click();

        cc.find("Background", this.toggle[0]).active = event.target.isChecked;
        cc.find("Background", this.toggle[1]).active = !event.target.isChecked;


        if (this._channelGame) {
            this.updatePageList(this._mjgames, 0);
        }
        else {
            var provinceData = map_config.getItem(function (data) {
                return data.province_code == this.provinceId;
            }.bind(this));

            var mj_gameList = provinceData.mj_game.split(';');
            this.updatePageList(mj_gameList, 0);
        }
    },

    //点击扑克馆
    onClickPk: function (event, data) {
        hall_audio_mgr.com_btn_click();

        cc.find("Background", this.toggle[0]).active = !event.target.isChecked;
        cc.find("Background", this.toggle[1]).active = event.target.isChecked;

        if (this._channelGame) {
            this.updatePageList(this._pkgames, 1);
        }
        else {
            var provinceData = map_config.getItem(function (data) {
                return data.province_code == this.provinceId;
            }.bind(this));

            var pk_gameList = provinceData.pk_game.split(';');
            this.updatePageList(pk_gameList, 1);
        }
    },
    //添加游戏到本地文件
    addGameToStorage: function () {
        var str = cc.sys.localStorage.getItem('selectgame');
        if (str == null)
            str = '';
        this.gameContainor.forEach(function (gameid) {
            str = gameid + ';';
        })
        cc.sys.localStorage.setItem('selectgame', str);
    },
    //关闭ui
    close: function () {
        hall_audio_mgr.com_btn_click();
        //this.addGameToStorage();
        this.ContentNode.removeAllChildren(true);
        this.itemList.splice(0, this.itemList.length);

        cc.dd.UIMgr.destroyUI(this.node);
        cc.dd.SceneManager.enterNewHall(this.node);
        Hall.HallED.notifyEvent(Hall.HallEvent.UPDATE_GAME_LIST);
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
});
