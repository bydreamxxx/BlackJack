var _ = require('lodash');
var TimeTake = require('TimeTake');

/**
 * 加载单元
 * @type {Function}
 */
var ResLoadCell = cc.Class({

    ctor: function (...params) {
        this.path = params[0];
        this.type = params[1];
    },

});

/**
 * 资源加载
 * @class ResLoader
 */
var ResLoader = {

    dynamic_load_assets: [],

    /**
     * 一次性最大加载资源个数
     */
    _maxLoad: 1,

    /**
     * 销毁异步加载的节点
     * @param node  要销毁的节点对象
     */
    releaseImmediately: function (node) {
        node.removeFromParent();
        node.destroy();
        node = null;
        cc.sys.garbageCollect();
    },


    /**
     * 加载场景常驻资源列表
     * @param cellList
     * @param onProgress 可选参数
     * @param onCompleted 可选参数
     */
    loadSceneStaticResList: function (cellList, onProgress, onCompleted) {
        if (cc.dd._.isUndefined(cellList) || cc.dd._.isNull(cellList) || cellList.length == 0) {
            if (onCompleted) {
                onCompleted();
                return;
            }
        }

        var self = this;
        var total = cellList.length;
        var load = 0;
        var loadFunc = function () {
            if (total == load) {
                return;
            }
            var cnt = self._maxLoad;
            var end = load + cnt;
            if (end > total) {
                end = total;
            }
            var tmpList = cellList.slice(load, end);
            var tmpLoad = 0;
            tmpList.forEach(function (cell) {
                self.preloadSceneStaticRes(cell.path, cell.type, function (item) {
                    load++;
                    tmpLoad++;
                    if (onProgress) {
                        onProgress(load / total);
                    }
                    if (load == total && onCompleted) {
                        onCompleted();
                        return;
                    }
                    if (tmpLoad == cnt) {
                        loadFunc();
                    }
                });
            });
        };
        loadFunc();
    },

    /**
     * 加载游戏常驻资源列表
     * @param cellList
     * @param onProgress 可选参数
     * @param onCompleted 可选参数
     */
    loadGameStaticResList: function (cellList, onProgress, onCompleted) {
        if (cc.dd._.isUndefined(cellList) || cc.dd._.isNull(cellList) || cellList.length == 0) {
            if (onCompleted) {
                onCompleted();
                return;
            }
        }
        var progress = 0;
        cellList.forEach(function (cell) {
            this.loadGameStaticRes(cell.path, cell.type, function (item) {
                progress++;
                if (onProgress) {
                    onProgress(progress / cellList.length);
                }
                if ((progress == cellList.length) && onCompleted) {
                    onCompleted();
                }
            }.bind(this));
        }, this);
    },


    /**
     * 动态加载资源，自动释放
     * @param dynamic_load_assets
     * @param onCompleted 可选参数
     */
    loadDynamicRes: function (dynamic_load_assets, onCompleted) {
        let self = this;
        let progress = 0;
        dynamic_load_assets.forEach(function (cell) {
            this.loadRes(cell, function (err, item) {
                progress++;
                if (progress === dynamic_load_assets.length && onCompleted) {
                    onCompleted();
                    dynamic_load_assets.forEach(function (cell) {
                    });
                }
            });
        });
    },

    /**
     * 预加载场景常驻资源
     * @method preloadSceneStaticRes
     * @param {String} path
     * @param {Function} onload
     */
    preloadSceneStaticRes: function (path, type, onload) {
        TimeTake.start(path);
        this.loadRes(path, type, function (err, item) {
            if (err) {
                cc.error(err.message || err);
            } else {
                TimeTake.end(path);
                this.dynamic_load_assets.push(item);
                if (onload) {
                    onload(item);
                }
            }
        }.bind(this));
    },

    /**
     * 加载游戏常驻资源
     * @method loadGameStaticRes
     * @param {String} path 不支持cc.Texture2D对象
     * @param {Function} onload
     */
    loadGameStaticRes: function (path, type, onload) {
        var self = this;
        TimeTake.start(path);
        this.loadRes(path, type, function (err, item) {
            if (err) {
                cc.error(err.message || err);
            } else {
                TimeTake.end(path);
                if (onload) {
                    onload(item);
                }
            }
        });
    },

    /**
     * 加载预制
     * @method loadPrefab
     * @param {String} path
     * @param {Function} onload
     */
    loadPrefab: function (path, onload) {
        this.loadRes(path, cc.Prefab, function (err, prefab) {
            if (err != null) {
                cc.error(err.message || err);
            }
            else {
                this.dynamic_load_assets.push(prefab._uuid);
                onload(prefab);
            }
        }.bind(this));
    },

    /**
     * 加载图集精灵
     * @method loadAtlasFrame
     * @param {String} path
     * @param {String} name
     * @param {Function} onload
     */
    loadAtlasFrame: function (path, name, onload) {
        this.loadAtlas(path, function (atlas) {
            var spriteFrame = atlas.getSpriteFrame(name);
            if (_.isUndefined(spriteFrame)) {
                cc.error("spriteFrame:" + path + "/" + name + " 不存在");
            }
            else {
                onload(spriteFrame);
            }
        }.bind(this));
    },

    /**
     * 加载纹理精灵
     * @method loadTextureFrame
     * @param {String} path
     * @param {Function} onload
     */
    loadTextureFrame: function (path, onload) {
        this.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
            if (err != null) {
                cc.error(err.message || err);
            }
            else {
                this.dynamic_load_assets.push(spriteFrame);
                onload(spriteFrame);
            }
        }.bind(this));
    },

    /**
     * 加载图集
     * @method loadAtlas
     * @param {String} path
     * @param {Function} onload
     */
    loadAtlas: function (path, onload) {
        this.loadRes(path, cc.SpriteAtlas, function (err, atlas) {
            if (err != null) {
                cc.error(err.message || err);
            }
            else {
                this.dynamic_load_assets.push(atlas);
                onload(atlas);
            }
        }.bind(this));
    },

    /**
     * 加载纹理
     * @method loadTexture
     * @param {String} path
     * @param {Function} onload
     */
    loadTexture: function (path, onload) {
        this.loadRes(path, cc.Texture2D, function (err, texture) {
            if (err != null) {
                cc.error(err.message || err);
            }
            else {
                this.dynamic_load_assets.push(texture);
                //cc.loader.setAutoRelease(texture,true);
                onload(texture);
            }
        }.bind(this));
    },

    /**
     * 加载字体
     * @method loadFont
     * @param {String} path
     * @param {Function} onload
     */
    loadFont: function (path, onload) {
        this.loadRes(path, cc.Font, function (err, font) {
            if (err != null) {
                cc.error(err.message || err);
            }
            else {
                this.dynamic_load_assets.push(font);
                onload(font);
            }
        }.bind(this));
    },

    /**
     * 加载动画
     * @method loadAnimation
     * @param {String} path
     * @param {Function} onload
     */
    loadAnimation: function (path, onload) {
        this.loadRes(path, cc.AnimationClip, function (err, animation) {
            if (err != null) {
                cc.error(err.message || err);
            }
            else {
                this.dynamic_load_assets.push(animation);
                onload(animation);
            }
        }.bind(this));
    },

    /**
     * 加载audio
     * @method loadAudio
     * @param {String} path
     * @param {Function} onload
     */
    loadAudio: function (path, onload) {
        this.loadRes(path, cc.AudioClip, function (err, audio) {
            if (err != null) {
                cc.error(err.message || err);
            }
            else {
                this.dynamic_load_assets.push(audio);
                onload(audio);
            }
        }.bind(this));
    },

    loadSpine: function (path, onload) {
        this.loadRes(path, sp.SkeletonData, function (err, SkeletonData) {
            if (err != null) {
                cc.error(err.message || err);
            }
            else {
                this.dynamic_load_assets.push(SkeletonData);
                onload(SkeletonData);
            }
        }.bind(this));
    },

    /**
     * 预加载声音
     * @param audioList 声音列表
     * @param cb 加载完成后的回调
     */
    preloadAudioList: function (audioList, cb) {
        if (audioList != null && typeof audioList != 'undefined' && audioList.length > 0) {
            var total = audioList.length;
            var load = 0;
            audioList.forEach(function (path) {
                this.loadRes(path, function () {
                    load++;
                    if (total == load) {
                        cb();
                    }
                });
            });
        } else {
            cb();
        }
    },

    /**
     * 释放动态缓存资源
     */
    release() {
        this.dynamic_load_assets.forEach(function (item) {
            cc.log("释放资源:" + item._uuid);
            cc.assetManager.releaseAsset(item);
        });
        this.dynamic_load_assets = [];
    },

    loadRes(path, type, onProgress, onComplete) {
        if (onComplete === undefined) {
            var isValidType = cc.js.isChildClassOf(type, cc.Asset);
            if (onProgress) {
                onComplete = onProgress;
                if (isValidType) {
                    onProgress = null;
                }
            }
            else if (onProgress === undefined && !isValidType) {
                onComplete = type;
                onProgress = null;
                type = null;
            }
            if (onProgress !== undefined && !isValidType) {
                onProgress = type;
                type = null;
            }
        }

        if (path.search("blackjack_common") == -1 && path.search("blackjack_hall") == -1 && path.search('i18n') == -1) {
            let str = path.split("/");
            cc.assetManager.loadBundle(str[0], (err, bundle) => {
                if (err) {
                    cc.error(`load bundle ${str[0]} error ${err.message}`)
                    return;
                }
                str.shift();
                path = str.join('/');
                bundle.load(path, type, onProgress, onComplete);
            })
        } else {
            cc.resources.load(path, type, onProgress, onComplete);
        }
    }

};

module.exports = {
    ResLoader: ResLoader,
    ResLoadCell: ResLoadCell,
};