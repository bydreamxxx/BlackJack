var hall_audio_mgr = require('hall_audio_mgr').Instance();
var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
let UpdaterEntrance = require("Updater").UpdaterEntrance;

cc.Class({
    extends: cc.Component,

    properties: {
        players: cc.Label,
        playersIcon: cc.Sprite,
        bg: cc.Sprite,
        title: cc.Sprite,

        playersIconList: [cc.SpriteFrame],
        bgList: [cc.SpriteFrame],
        titleList: [cc.SpriteFrame],
        fontColorList: [cc.Color],

        bgNode: cc.Node,
        waitNode: cc.Node,
    },

    start() {
        this.updater_entrance = UpdaterEntrance.COIN;
        let com_game_download = this.node.getComponentInChildren('com_game_update');
        com_game_download.updater_entrance = this.updater_entrance;
        com_game_download.node.active = true;
        com_game_download.updateUI(false);
    },

    setData(gameType, players, callFunc, target) {
        this.bgNode.active = true;
        this.waitNode.active = false;
        this.node.getComponent(cc.Button).interactable = true;


        this.gameType = Number(gameType);
        this.callFunc = callFunc;
        this.target = target;

        this.players.string = players + '人';
        switch (this.gameType) {
            case cc.dd.Define.GameType.DDZ_MATCH:
                this.playersIcon.spriteFrame = this.playersIconList[0];
                this.bg.spriteFrame = this.bgList[0];
                this.title.spriteFrame = this.titleList[0];
                this.players.node.color = this.fontColorList[0];
                break;
            case cc.dd.Define.GameType.CCMJ_MATCH:
                this.playersIcon.spriteFrame = this.playersIconList[1];
                this.bg.spriteFrame = this.bgList[1];
                this.title.spriteFrame = this.titleList[1];
                this.players.node.color = this.fontColorList[1];
                break;
            case cc.dd.Define.GameType.AHMJ_MATCH:
                this.playersIcon.spriteFrame = this.playersIconList[2];
                this.bg.spriteFrame = this.bgList[2];
                this.title.spriteFrame = this.titleList[2];
                this.players.node.color = this.fontColorList[2];
                break;
        }
    },

    setWait() {
        this.bgNode.active = false;
        this.waitNode.active = true;
        this.node.getComponent(cc.Button).interactable = false;
    },

    updatePlayers(players) {
        this.players.string = players + '人';
    },

    // update (dt) {},
    onClick() {
        hall_audio_mgr.com_btn_click();

        this.updater = UpdateMgr.getUpdater(this.gameType);
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
            let com_game_download = this.node.getComponentInChildren('com_game_update');
            com_game_download.updater_entrance = this.updater_entrance;
            this.updater.cfg.game_id = this.gameType;
            com_game_download.setUpdateFinishCallback(this.onUpdateFinish.bind(this));
            com_game_download.setGameId(this.gameType);
            this.updater.checkUpdate(this.updater_entrance);
        } else {
            this.onUpdateFinish();
        }
    },

    onUpdateFinish() {
        if (this.callFunc && this.target) {
            this.callFunc.apply(this.target, [this.gameType]);
        }
    },
});
