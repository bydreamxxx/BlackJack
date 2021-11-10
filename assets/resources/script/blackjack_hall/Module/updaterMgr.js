/**
 * Created by yons on 2017/8/22.
 */

var Updater = require('Updater').Updater;
let game_update_cfg = require('game_update');
var UpdaterGameId = {
    IOS: -1,
    ANDROID: -2,
    MAIN: -3,
    INTERNAL: -4,
    RESOURCES: -5,
};

var UpdateMgr = cc.Class({
    statics: {

        s_UpdateMgr: null,

        Instance: function () {
            if (!this.s_UpdateMgr) {
                this.s_UpdateMgr = new UpdateMgr();
            }
            return this.s_UpdateMgr;
        },

        Destroy: function () {
            if (this.s_UpdateMgr) {
                this.s_UpdateMgr.destroy();
                this.s_UpdateMgr = null;
            }
        }

    },

    ctor: function () {
        this.updaterList = [];
    },

    /**
     * 销毁
     */
    destroy: function () {
        this.updaterList.forEach(function (updater) {
            if (updater._updateListener) {
                cc.eventManager.removeListener(updater._updateListener);
            }
            //释放热更新管理对象
            if (updater._am) {
                updater._am.release();
            }
            updater = null;
        });
        this.updaterList = [];
    },

    /**
     * 获取更新器
     * @param game_id
     * @returns {*}
     */
    getUpdater: function (game_id) {
        if (!this.isUpdateVersionExist(game_id)) {
            return null;
        }

        var updater_cfg = game_update_cfg.getItem(function (cfg) {
            return cfg.game_id == game_id
        });
        if (!updater_cfg) {
            cc.error("[更新] " + "没有该类型的更新器配置 game_id=" + game_id);
            return null;
        }

        var updater = null;
        this.updaterList.forEach(function (item) {
            if (updater_cfg.type == item.cfg.type) {
                updater = item;
            }
        });
        if (updater == null) {
            updater = this.addUpdater(game_id);
        }
        return updater;
    },

    /**
     * 增加更新器
     * @param game_id
     */
    addUpdater: function (game_id) {
        var ret = this.isUpdateVersionExist(game_id);
        if (!ret) {
            return null;
        }

        var updater_cfg = game_update_cfg.getItem(function (cfg) {
            return cfg.game_id == game_id
        });
        if (!updater_cfg) {
            cc.error("[更新] " + "没有该类型的更新器配置 game_id=" + game_id);
            return null;
        }
        if (ret == -1)
            updater_cfg._newurl = jsb.fileUtils.getWritablePath() + 'versions/' + updater_cfg.name + "/project.manifest";
        var updater = new Updater(updater_cfg);
        this.updaterList.push(updater);
        return updater;
    },


    /**
     * 更新文件是否存在
     */
    isUpdateVersionExist: function (game_id) {
        if (!cc.sys.isNative || !cc.sys.isMobile || !cc.open_update) {
            return 0;
        }
        var updater_cfg = game_update_cfg.getItem(function (cfg) {
            return cfg.game_id == game_id
        });
        if (!updater_cfg) {
            return 0;
        }
        var url = "assets/"+updater_cfg.name + "/project.manifest";
        if (!jsb.fileUtils.isFileExist(url)) {
            var full_dir = jsb.fileUtils.getWritablePath() + 'versions/' + updater_cfg.name;
            var game_project_url = full_dir + "/project.manifest";
            if (!jsb.fileUtils.isFileExist(game_project_url)) {
                if (!jsb.fileUtils.isDirectoryExist(full_dir))
                    jsb.fileUtils.createDirectory(full_dir);
                var hall_version_url = "assets/main/version.manifest";
                var game_version_url = full_dir + "/version.manifest";
                var str = jsb.fileUtils.getStringFromFile(hall_version_url);
                cc.log('***************  Hall_version_manifest:' + str);
                var replaceStr = '/main';
                str = str.replace(new RegExp(replaceStr, 'gm'), '/' + updater_cfg.name);
                str = str.replace(/version":.*,/, 'version":"0.0.0.0",');
                jsb.fileUtils.writeStringToFile(str, game_version_url);
                cc.log('***************  Game version exist is:' + jsb.fileUtils.isFileExist(game_version_url));

                var hall_project_url = "versions/main/project.manifest";
                var str_prj = jsb.fileUtils.getStringFromFile(hall_project_url);
                str_prj = str_prj.replace(/assets":{.*},"searchPaths":/, 'assets":{},"searchPaths":');
                str_prj = str_prj.replace(new RegExp(replaceStr, 'gm'), '/' + updater_cfg.name);
                str_prj = str_prj.replace(/version":.*,/, 'version":"0.0.0.0",');
                jsb.fileUtils.writeStringToFile(str_prj, game_project_url);
                cc.log('***************  Game project exist is:' + jsb.fileUtils.isFileExist(game_project_url));
            }
            return -1;
        }
        else return 1;
        // if (jsb.fileUtils.isFileExist(url)) {
        //     return 1;
        // }
        // return 0;
    },

    /**
     * 游戏是否已安装
     * @param game_id
     */
    isGameInstalled: function (game_id) {
        if (!cc.sys.isMobile) {
            return true;
        }
        var updater = this.getUpdater(game_id);
        if (!updater) {
            return true;
        }
        return updater.getVersion() != '0.0.0.0';
    },

    /**
     * 安装游戏
     * @param game_id
     * @returns {boolean}
     */
    installGame: function (game_id) {
        var updater = this.getUpdater(game_id);
        if (updater) {
            updater.startUpdate();
        }
    },

});

module.exports = {
    UpdaterGameId: UpdaterGameId,
    UpdateMgr: UpdateMgr,
};
