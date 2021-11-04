var ED = require("EventDispatcher");
var UpdaterEd = new ED;
//var UpdateMgr = require("updaterMgr").UpdateMgr;

var UpdaterEvent = cc.Enum({
    ALREADY_UP_TO_DATE: "already_up_to_date",                  //已经是最新版本
    NEW_VERSION_FOUND: "new_version_found",                   //检查到新版本
    UPDATE_PROGRESSION: "update_progress",                     //更新进度
    UPDATE_FINISHED: "update_finished",                     //更新完成
    ERROR_NO_LOCAL_MANIFEST: "error_no_local_manifest",             //本地无更新清单
    ERROR_DOWNLOAD_MANIFEST: "error_download_manifest",             //无法下载清单文件
    ERROR_PARSE_MANIFEST: "error_parse_manifest",                //解析清单失败
    UPDATE_FAILED: "update_failed",                       //更新失败
});

let UpdaterEntrance = cc.Enum({
    FRIEND: "entrance_friend",      //朋友场
    COIN: "entrance_coin",        //金币场
});

var Updater = cc.Class({
    ctor: function (...params) {
        return;
        if (!cc.sys.isNative) {
            return;
        }
        this.m_retryTimes = 0;
        //更新中
        this.updateing = false;
        //检测中
        this.checking = false;
        //更新入口
        this.entrance = UpdaterEntrance.FRIEND;
        //当前更新状态
        this.state = -1;
        //更新配置
        this.cfg = params[0];

        this.local_version_url = params[0]._newurl ? params[0]._newurl : ("versions/" + params[0].name + "/project.manifest");
        this.storage_manifest_preffix = params[0].name + '_';
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack');
        var PID = require('AppConfig').PID;
        var is_version_num_url = require('Platform').is_version_num_url[PID];
        var down_url_origin = require('Platform').down_url_origin[PID];

        if (cc.pixel_format == 2) {
            var down_url_version = require('Platform').down_url_version[PID];
        } else {
            var down_url_version = require('Platform').down_url_version_rgba8888[PID];
        }

        this._am = new jsb.AssetsManager(this.local_version_url, this.storage_manifest_preffix, this._storagePath, 'xlqp', is_version_num_url, down_url_origin, down_url_version);
        cc.log('本地路径: ' + this._storagePath);
        cc.log(this.cfg.name + ' ' + this.local_version_url);
        this._am.retain();
        //设置监听
        this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
        cc.eventManager.addListener(this._updateListener, 1);
        //实现验证回调函数
        this._am.setVerifyCallback(this.verificationFile.bind(this));
        //设置下载资源时 并发的线程数量
        this._am.setMaxConcurrentTask(2);
    },

    /**
     * MD5验证回调
     */
    verificationFile: function (path, asset) {
        var md5 = cc.dd.native_systool.getMD5ByFile(path);
        var buZeroLength = asset.md5.length - md5.length;
        for (var i = 0; i < buZeroLength; ++i) {
            md5 = '0' + md5;
        }
        if (md5 == asset.md5) {
            cc.log('热更新文件完成: ' + path);
            return true;
        }
        else {
            cc.log('下载文件: ' + path);
            cc.log('原MD5 = ', asset.md5);
            cc.log('下载MD5 = ', md5);
            cc.error('请检查资源文件MD5');
            return false;
        }
    },


    updateCb: function (event) {
        this.state = event.getEventCode();
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log(this.cfg.name + ':' + '已经是最新版本', '当前版本号:' + this.getVersion());
                this.updateing = false;
                this.checking = false;
                // cc.dd.DingRobot.report("");
                UpdaterEd.notifyEvent(UpdaterEvent.ALREADY_UP_TO_DATE, [this.cfg]);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log(this.cfg.name + ':' + '检查到新版本');
                this.checking = false;
                var allDownloadSize = event.getAllDownloadSize();
                UpdaterEd.notifyEvent(UpdaterEvent.NEW_VERSION_FOUND, [this.cfg, allDownloadSize]);
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.checking = false;
                var progress = event.getPercent();
                if (typeof progress != 'number' || isNaN(progress) || !isFinite(progress)) {
                    progress = 0;
                }
                if (progress > 0 && progress < 1.0) {
                    this.updateing = true;
                    cc.log(this.cfg.name + ':' + "正在更新, 更新进度:" + progress);
                    UpdaterEd.notifyEvent(UpdaterEvent.UPDATE_PROGRESSION, [this.cfg, progress]);
                } else {
                    this.updateing = false;
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.checking = false;
                this.updateing = false;
                cc.log(this.cfg.name + ':' + '更新完成', '当前版本号:' + this.getVersion());
                // cc.dd.DingRobot.report("");
                UpdaterEd.notifyEvent(UpdaterEvent.UPDATE_FINISHED, [this.cfg]);
                break;
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.checking = false;
                this.updateing = false;
                cc.log(this.cfg.name + ':' + '找不到本地清单文件，跳过热更新');
                UpdaterEd.notifyEvent(UpdaterEvent.ERROR_NO_LOCAL_MANIFEST, [this.cfg]);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                this.checking = false;
                this.updateing = false;
                cc.log(this.cfg.name + ':' + '无法下载清单文件，跳过热更新');
                UpdaterEd.notifyEvent(UpdaterEvent.ERROR_DOWNLOAD_MANIFEST, [this.cfg]);
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.checking = false;
                this.updateing = false;
                cc.log(this.cfg.name + ':' + '解析下载清单文件错误，跳过热更新');
                UpdaterEd.notifyEvent(UpdaterEvent.ERROR_PARSE_MANIFEST, [this.cfg]);
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.checking = false;
                this.updateing = false;
                cc.log(this.cfg.name + ':' + '下载失败 UPDATE_FAILED ' + event.getMessage());
                if (this.m_retryTimes < 3) {
                    this.m_retryTimes++;
                    this._am.downloadFailedAssets();
                } else {
                    UpdaterEd.notifyEvent(UpdaterEvent.UPDATE_FAILED, [this.cfg]);
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.checking = false;
                this.updateing = false;
                cc.log(this.cfg.name + ':' + '下载失败 ERROR_UPDATING ' + event.getAssetId() + ', ' + event.getMessage());
                UpdaterEd.notifyEvent(UpdaterEvent.UPDATE_FAILED, [this.cfg]);
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.checking = false;
                this.updateing = false;
                cc.log(this.cfg.name + ':' + '下载失败 ERROR_DECOMPRESS' + event.getMessage());
                UpdaterEd.notifyEvent(UpdaterEvent.UPDATE_FAILED, [this.cfg]);
                break;
            default:
                break;
        }
    },

    /**
     * 检查是否能下载
     */
    checkUpdate: function (entrance) {
        if (!cc.dd.native_systool.isNetAvailable()) {
            return;
        }
        //恢复下载
        if (this.state == jsb.EventAssetsManager.UPDATE_FAILED ||
            this.state == jsb.EventAssetsManager.ERROR_UPDATING ||
            this.state == jsb.EventAssetsManager.ERROR_DECOMPRESS) {
            this.retry(entrance);
            return;
        }
        if (this._am) {
            this.checking = true;
            if (entrance) {
                this.entrance = entrance;
            }
            this._am.checkUpdate();
        }
    },

    /**
     * 更新资源
     */
    startUpdate: function (entrance) {
        if (!cc.dd.native_systool.isNetAvailable()) {
            return;
        }
        if (this._am) {
            if (entrance) {
                this.entrance = entrance;
            }
            this.updateing = true;
            cc.log(this.cfg.name + ':' + "开始更新 startUpdate.")
            this._am.update();
        }
    },

    // //检查大厅更新
    // checkHallUpdate(entrance, callback, target) {
    //     var hallUpdater = UpdateMgr.Instance().getUpdater(UpdaterGameId.HALL);
    //     hallUpdater
    // },

    /**
     * 重新下载
     * @param event
     */
    retry: function (entrance) {
        if (!cc.dd.native_systool.isNetAvailable()) {
            return;
        }

        //释放热更新管理对象
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am) {
            this._am.release();
            this._am = null;
        }

        var temp_dir = this._storagePath + "_" + this.cfg.name + "__temp";
        if (jsb.fileUtils.isDirectoryExist(temp_dir)) {
            jsb.fileUtils.removeDirectory(temp_dir);
        }

        var PID = require('AppConfig').PID;
        var is_version_num_url = require('Platform').is_version_num_url[PID];
        var down_url_origin = require('Platform').down_url_origin[PID];
        if (cc.pixel_format == 2) {
            var down_url_version = require('Platform').down_url_version[PID];
        } else {
            var down_url_version = require('Platform').down_url_version_rgba8888[PID];
        }
        this._am = new jsb.AssetsManager(this.local_version_url, this.storage_manifest_preffix, this._storagePath, 'xlqp', is_version_num_url, down_url_origin, down_url_version);
        cc.log('本地路径: ' + this._storagePath);
        cc.log(this.cfg.name + ' ' + this.local_version_url);
        this._am.retain();
        //设置监听
        this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
        cc.eventManager.addListener(this._updateListener, 1);
        //实现验证回调函数
        this._am.setVerifyCallback(this.verificationFile.bind(this));
        //设置下载资源时 并发的线程数量
        this._am.setMaxConcurrentTask(2);

        this.state = -1;
        this.checkUpdate(entrance);
        this.m_retryTimes = 0;
    },

    /**
     * 获取版本信息
     */
    getVersion: function () {
        if (this._am) {
            return this._am.getLocalVersion();
        }
    }
});



module.exports = {
    Updater: Updater,
    UpdaterEd: UpdaterEd,
    UpdaterEvent: UpdaterEvent,
    UpdaterEntrance: UpdaterEntrance,
};
