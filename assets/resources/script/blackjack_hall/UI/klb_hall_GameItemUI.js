const dd = cc.dd;
const GameType = require("klb_hall_GameItem").GameType;
var hall_prefab = require('hall_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var FortuneHallManager = require('FortuneHallManager').Instance();
var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
let UpdaterEntrance = require("Updater").UpdaterEntrance;
var klb_game_list_config = require('klb_gameList');

var HallGameItemUI = cc.Class({
    extends: cc.Component,

    properties: {
        icon: { default: null, type: cc.Sprite, tooltip: "游戏icon" },
        gameName: { default: null, type: cc.Label, tooltip: "游戏名称" },
        lightAni: { default: null, type: cc.Animation, tooltip: "特效" },
        gameBgAnim: { default: null, type: cc.Animation, tooltip: "特效" },
        gameIconAnim: { default: null, type: cc.Animation, tooltip: "特效" },

        updateMask: cc.Mask,

        spine: sp.Skeleton,
    },

    // use this for initialization
    onLoad: function () {
        if (this.gameName) {
            // let outLine = this.gameName.node.getComponent(cc.LabelOutline);
            // if(outLine){
            //     if(cc._themeStyle == 0){
            //         outLine.color = new cc.Color(15, 70, 35, 255);
            //     }else{
            //         outLine.color = new cc.Color(29, 63, 93, 255);
            //     }
            // }
        }

        if (this.spine) {
            this.spine.node.active = false;
        }

        this.icon.node.active = true;

        this.initSpine = false;
        this.showSpine = false;
    },

    onDestroy: function () {
    },

    start() {
        this.updater_entrance = UpdaterEntrance.COIN;
        let com_game_download = this.node.getComponentInChildren('com_game_update');
        com_game_download.updater_entrance = this.updater_entrance;
        com_game_download.node.active = true;
        com_game_download.updateUI(false);
    },

    setData: function (gameItem, callFunc) {
        if (callFunc) {
            this._callFunc = callFunc;
        }

        this.game_id = gameItem.game_id;
        // this.gameName.string = gameItem.name;
        this.gameType = gameItem.type;
        this.roomType = gameItem.roomType;
        this.isOpen = gameItem.isOpen;
        cc.dd.ResLoader.loadAtlas("blackjack_hall/atals/gameIcon", function (atlas) {
            this.icon.spriteFrame = atlas.getSpriteFrame(gameItem.frameName);
            this.updateMask.spriteFrame = atlas.getSpriteFrame(gameItem.frameName);
        }.bind(this));
        if (gameItem.isHot == 1) {
            // this.gameBgAnim.node.active = true;
            // this.gameIconAnim.node.active = true;
            // this.gameBgAnim.play('bgAnim');
            // this.gameIconAnim.play('gameIconAnimation');
        }
        var listNewStr = cc.sys.localStorage.getItem('newgame');
        var listNew = [];
        if (listNewStr)
            listNew = listNewStr.split(';');

        if (this.checkRepeatGameId(listNew, gameItem.game_id)) {
            // cc.find('New Node/newgame', this.node).active = true;
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

    onClick: function (event, custom_data) {
        hall_audio_mgr.com_btn_click();

        if (!this.isOpen) {
            cc.dd.PromptBoxUtil.show('即将开放，敬请期待');
            return;
        }

        /************************游戏统计 start************************/
        let translateGameID = require("clientAction").translateGameID;
        let actionID = translateGameID(this.game_id);
        cc.dd.Utils.sendClientAction(actionID, cc.dd.clientAction.T_HALL.HALL_ICON_CLICK);
        /************************游戏统计   end************************/

        this.updater = UpdateMgr.getUpdater(this.game_id);
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
            let com_game_download = event.target.getComponentInChildren('com_game_update');
            com_game_download.updater_entrance = this.updater_entrance;
            this.updater.cfg.game_id = this.game_id;
            com_game_download.setUpdateFinishCallback(this.onUpdateFinish.bind(this));
            com_game_download.setGameId(this.game_id);
            this.updater.checkUpdate(this.updater_entrance);
        } else {
            this.onUpdateFinish();
        }
    },

    /**
     * 更新游戏完成回调
     */
    onUpdateFinish() {
        if (this._callFunc) {
            this._callFunc(this.game_id, this.roomType);
        } else if (this.gameType == GameType.VIP_FUNCTION) {
            //delete 2019/8/2
        }
        else if (this.gameType == GameType.RedBag_FUNCTION) {
            cc.dd.quickMatchType = null;
            dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
                node.getComponent('klb_hall_Match').sendGetMatch(1);
            }.bind(this));
        }
        else if (this.gameType == GameType.ADD_GAME) {
            dd.UIMgr.openUI(hall_prefab.KLB_HALL_MAP_ADD_GAME, function (node) {
                var json = cc.sys.localStorage.getItem('provinceid');
                node.getComponent('klb_hall_Map_Add_Game').init(parseInt(json));
            }.bind(this));
        }
        else if (this.gameType == GameType.DUOBAO) {
            var Bsc = require('bsc_data');
            Bsc.BSC_Data.Instance().clearData();
            cc.dd.duobaoMatch = true;
            cc.dd.SceneManager.enterHallMatch();
        }
        else {
            var listNewStr = cc.sys.localStorage.getItem('newgame');
            var listNew = [];
            if (listNewStr)
                listNew = listNewStr.split(';');

            if (this.checkRepeatGameId(listNew, this.game_id)) {
                for (var k = 0; k < listNew.length; k++) {
                    if (parseInt(listNew[k]) == parseInt(this.game_id))
                        listNew.splice(k, 1);
                }
                var newGameListStr = '';
                listNew.forEach(function (id) {
                    newGameListStr = newGameListStr + id + ';';
                });
                cc.sys.localStorage.setItem('newgame', newGameListStr);

                cc.find('New Node/newgame', this.node).active = false;
            }
            this.getRoomList();
        }
    },


    /**
     * 获取房间列表
     */
    getRoomList: function () {
        dd.NetWaitUtil.show('正在请求数据');
        var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
        protoNewRoomList.setHallGameid(this.game_id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
            '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);
    },

    loadSpineAni() {
        var gameItem = klb_game_list_config.getItem(function (item) {
            if (item.gameid == this.game_id)
                return item
        }.bind(this));

        if (this.gameType == GameType.RedBag_FUNCTION) {
            gameItem = { game_spine: 'hongbaosai', spine_offset: '0,-186' }
        }


        if (this.spine && gameItem && gameItem.game_spine != '') {
            let offset = gameItem.spine_offset.replace('，', ',').split(',');

            cc.dd.ResLoader.loadSpine("blackjack_hall/spine/" + gameItem.game_spine, function (spine) {
                this.spine.skeletonData = spine;
                this.spine.node.x = Number(offset[0]);
                this.spine.node.y = Number(offset[1]);

                let animation = Object.keys(spine.skeletonJson.animations)[0];

                this.spine.setAnimation(0, animation, true);
                this.spine.node.active = this.showSpine;
                this.icon.node.active = !this.showSpine;
            }.bind(this));
        }
    },

    setSpineAni(active) {
        this.showSpine = !active;
        if (this.spine) {
            if (!active && !this.initSpine) {
                this.initSpine = true;
                this.loadSpineAni();
            } else {
                var gameItem = klb_game_list_config.getItem(function (item) {
                    if (item.gameid == this.game_id)
                        return item
                }.bind(this));

                if (this.gameType == GameType.RedBag_FUNCTION) {
                    gameItem = { game_spine: 'hongbaosai', spine_offset: '0,-186' }
                }

                if (gameItem && gameItem.game_spine != '') {
                    this.spine.node.active = this.showSpine;
                    this.icon.node.active = !this.showSpine;
                } else {
                    this.spine.node.active = false;
                    this.icon.node.active = true;
                }

            }
        }
    }
});
module.exports = HallGameItemUI;
