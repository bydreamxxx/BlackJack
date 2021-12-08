
let dd = cc.dd;
let UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
let UpdaterEntrance = require("Updater").UpdaterEntrance;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        dd.UpdaterED.addObserver(this);
    },

    onDestroy() {
        dd.UpdaterED.removeObserver(this);
    },

    start() {

    },

    // update (dt) {},

    /**
     * 设置更新完成回调
     * @param callback
     */
    setUpdateFinishCallback(callback) {
        this.update_finish_callback = callback;
    },

    /**
     * 执行更新完成回调
     */
    onUpdateFinish() {
        if (this.update_finish_callback) {
            this.update_finish_callback();
        }
    },

    /**
     * 设置更新游戏id
     */
    setGameId(game_id) {
        this.game_id = game_id;
        this.updater = UpdateMgr.getUpdater(this.game_id);
    },

    /**
     * 刷新UI接口,子类需要实现
     */
    updateUI(active, progress) {

    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        this.onUpdateEventMessage(event, data);
    },


    /**
     * 大厅资源更新处理
     * @param event
     * @param data
     */
    onUpdateEventMessage: function (event, data) {
        if (!this.updater || !data || !data[0] || data[0].type != this.updater.cfg.type || data[0].game_id != this.game_id) {
            return;
        }
        if (this.updater.entrance != this.updater_entrance) {
            return;
        }
        switch (event) {
            case dd.UpdaterEvent.ALREADY_UP_TO_DATE:
                this.updateUI(false);
                this.onUpdateFinish();
                break;
            case dd.UpdaterEvent.NEW_VERSION_FOUND:
                if (cc.dd.native_systool.isNetAvailable()) {
                    if (cc.dd.native_systool.isWifiAvailable() || data[1] <= 0) {
                        this.updateUI(true, 0);
                        this.updater.startUpdate(this.updater_entrance);
                    } else {
                        var size = parseFloat(data[1]) / 1024;
                        var unit_des = 'KB';
                        if (size >= 100) {
                            size = parseFloat(size) / 1024;
                            unit_des = 'M';
                        }
                        size = size.toFixed(2);
                        dd.DialogBoxUtil.show(1, cc.dd.Text.TEXT_POPUP_6 + size + unit_des + ",是否确定下载?", 'text33', 'Cancel',
                            function () {
                                this.updateUI(true, 0);
                                this.updater.startUpdate(this.updater_entrance);
                            }.bind(this),
                            function () {
                            }.bind(this));
                    }
                }
                break;
            case dd.UpdaterEvent.UPDATE_PROGRESSION:
                if (data[1] > 0 && data[1] < 1.0) {
                    this.updateUI(true, data[1]);
                } else {
                    this.updateUI(false);
                }

                break;
            case dd.UpdaterEvent.UPDATE_FINISHED:
                this.updateUI(false);
                this.onUpdateFinish();
                break;
            case dd.UpdaterEvent.ERROR_NO_LOCAL_MANIFEST:
                this.updateUI(false);
                dd.DialogBoxUtil.show(1, "Unabletoupdate", "text33", "Cancel",
                    function () {
                    }.bind(this),
                    function () {
                    }.bind(this));
                break;
            case dd.UpdaterEvent.ERROR_DOWNLOAD_MANIFEST:
            case dd.UpdaterEvent.ERROR_PARSE_MANIFEST:
                this.updateUI(false);
                dd.DialogBoxUtil.show(1, "Downloadfailed", "text30", "Cancel",
                    function () {
                        this.updater.retry(this.updater_entrance);
                    }.bind(this),
                    function () {
                    }.bind(this));
                break;
                break;
            case dd.UpdaterEvent.UPDATE_FAILED:
                this.updateUI(false);
                dd.DialogBoxUtil.show(1, "更新失败,是否重新下载", "text30", "Cancel",
                    function () {
                        this.updater.retry(this.updater_entrance);
                    }.bind(this),
                    function () {
                    }.bind(this));
                break;
            default:
                break;
        }
    },
});
