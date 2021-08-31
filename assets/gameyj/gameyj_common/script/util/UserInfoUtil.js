/**
 * Created by wang on 2017/7/13.
 */
/**
 * Created by wang on 2017/7/13.
 */

var dd = cc.dd;

var CntCfg = require('ConstantCfg');
var CsvFileId = CntCfg.CsvFileId;
var ChatMsgType = CntCfg.ChatMsgType;
var CsvPath = CntCfg.CsvFilePath;
var AtlasPath = CntCfg.AtlasPath;

var AudioManager = require('AudioManager').getInstance();
const PropAudioDir = 'gameyj_common/res/audio/prop/';

var ChatCfgData = require('ChatCfg');

/**
 * 个人信息数据结构
 * @type {Function}
 */
var UserInfoData = cc.Class({
    /**
     *
     * @param headSpf  头像spriteFrame
     * @param sex  性别
     * @param nick  昵称
     * @param id
     * @param fkCnt  房卡数量
     * @param money  游戏金币
     * @param city  位置
     * @param propCost  道具消耗金币数量
     */
    ctor: function (...params) {
        this.headSpf = params[0];
        this.sex = params[1];
        this.nick = params[2];
        this.id = params[3];
        this.fkCnt = params[4];
        this.money = params[5];
        this.city = params[6];
        this.propCost = params[7];
    },
});

const PropUiPrefabPath = 'gameyj_common/prefab/PropUI';

var UserInfoUtil = cc.Class({

    _instance: null,

    properties: {
        /**
         * ui节点
         */
        _node: null,
        /**
         * ui是否关闭
         */
        isClose: true,
        /**
         * 默认加载资源总个数
         */
        defaultResCnt: -1,
        /**
         * 已加载资源个数
         */
        loadResCnt: 0,
        /**
         * 道具展示节点
         */
        propUi: cc.Node,
        /**
         * 道具对象池
         */
        propPool: null,

        msgUserId: 0,
    },

    ctor: function () {
        this.prefabPath = 'gameyj_common/prefab/com_user_info';
        this.propED = new dd.EventDispatcher();
        this.propEvent = cc.Enum({
            PROP_SHOW: 'com_prop_show',   //广播道具消息
            PROP_FORBID: 'com_prop_forbid', //禁止使用道具
            PROP_RESUME: 'com_prop_resume', //恢复使用道具
        });
    },

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new UserInfoUtil();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                if (this._node)
                    cc.game.removePersistRootNode(this._node);
                // if(this.propUi)
                // cc.game.removePersistRootNode(this.propUi);
                if (this.propPool)
                    this.propPool.clear();
                this._instance = null;
            }
        },
    },

    /**
     * 获取视图
     * return Boolean  true表示节点已经存在，false表示节点刚被创建
     */
    getView: function (prefab) {
        if (!this._node) {
            this._node = cc.instantiate(prefab);
            cc.game.addPersistRootNode(this._node);
            return false;
        } else {
            return true;
        }
    },

    /**
     * 设置背景图片
     * @param spf
     */
    setBgSpf: function (spf) {
        if (this._node) {
            var cpt = this._node.getComponentInChildren('com_user_info');
            cpt.setBgSpf(spf);
        }
    },

    /**
     * 显示个人信息窗口
     * @param data 个人信息基本结构体数据（UserInfoData对象）
     * @param selfId 自己id
     * @param net 游戏网络对象
     * @param pid 聊天请求proto id
     * @param dstId 对哪个玩家使用道具
     */
    show: function (data, selfId, net, pid, dstId) {
        cc.dd.ResLoader.loadPrefab(this.prefabPath, function (prefab) {
            var b = false;
            if (!this._node) {
                var prefab = cc.resources.get(this.prefabPath, cc.Prefab);
                this._node = cc.instantiate(prefab);
                cc.game.addPersistRootNode(this._node);
                this._node.active = false;
                b = true;
            }
            var size = cc.winSize;
            this._node.x = size.width / 2;
            this._node.y = size.height / 2;
            this._node.active = true;
            var cpt = this._node.getComponentInChildren('com_user_info');
            cpt.show(data);
            if (b) {
                cpt.initPropData(this.getPropData());
            }
            cpt.addCloseListener(function () {
                this._node.active = false;
                this.resetData();
            }.bind(this));
            cpt.addItemClickListener(function (data) {
                cc.log('UserInfoUtil::道具item被点击，id为：', data);
                if (selfId == cc.dd.user.id) {
                    this.propED.notifyEvent(this.propEvent.PROP_SHOW, {
                        itemid: data,
                        userid: selfId,
                        touserid: dstId,
                    });
                }
                this.sendPropMsg(selfId, net, pid, dstId, data, ChatMsgType.PROP);
            }.bind(this));
        }.bind(this));
    },
    /**
     *
     */
    showP: function (prefPath, data, selfId, net, pid, dstId) {
        if (prefPath && prefPath != this.prefabPath) {
            this.prefabPath = prefPath;
            if (this._node) {//如果传入预制路径不同时则删除
                cc.game.removePersistRootNode(this._node);
                this._node = null;
            }
        }
        this.show(data, selfId, net, pid, dstId);
    },



    /**
     * 获取道具数据
     */
    getPropData: function () {
        // var data = CsvParser.getRowData(CsvFileId.PROP);
        var data = ChatCfgData.PropCfg;
        return data;
    },

    close: function () {
        this.isClose = true;
        if (this._node) {
            this._node.removeFromParent();
        }
    },

    /**
     * 数据重置
     * @param cb
     */
    resetData: function () {
        this.isClose = true;
    },

    getCompenent: function (cb) {
        var prefab = cc.resources.get(this.prefabPath, cc.Prefab);
        if (!prefab) {
            dd.ResLoader.loadGameStaticRes(this.prefabPath, cc.Prefab, function (item) {
                cb(item);
            });
        } else {
            cb(prefab);
        }
    },

    /**
     * 加载默认配置资源
     * @param cb
     */
    loadDefaultRes: function (cb) {
        // this.loadPropCsv(cb);
    },

    /**
     * 加载道具csv文件数据
     */
    loadPropCsv: function (cb) {
        if (this.defaultResCnt == this.loadResCnt) {
            cb();
            return;
        }
        var csvArr = ChatCfgData.PropCfg;
        var tmp_list = [];
        tmp_list.push(AtlasPath.PROP_ICON);
        tmp_list.push(AtlasPath.USER_INFO);
        csvArr.forEach(function (item) {
            var path = AtlasPath.PROP_COMMON_DIR + item.atlas;
            tmp_list.push(path);
            cc.log('UserInfo::道具图集路径:', path);
        });
        this.defaultResCnt += tmp_list.length;
        this.loadAtlas(cb, tmp_list);
        // CsvParser.loadCsv(CsvFileId.PROP, CsvPath.PROP_PATH, function () {
        //     cc.log('加载道具数据成功!');
        //     // var csvArr = CsvParser.getRowData(CsvFileId.PROP);
        //      this.loadResEnd(cb);
        // }.bind(this));
    },

    /**
     * 加载atlas
     */
    loadAtlas: function (cb, atlasArr) {
        atlasArr.forEach(function (item) {
            dd.ResLoader.loadGameStaticRes(item, cc.SpriteAtlas, function () {
                this.loadResEnd(cb);
            }.bind(this));
        }.bind(this));
    },

    /**
     * 检查资源是否加载完毕
     */
    loadResEnd: function (cb) {
        this.loadResCnt++;
        cc.log('UserInfoUtil::loadResEnd:已经加载', this.loadResCnt, '个资源！');
        if (this.loadResCnt == this.defaultResCnt) {
            cb();
        }
    },


    /**
     * 获取道具展示节点
     * @param cb
     */
    getPropUi: function (cb) {
        var func = function (prefab) {
            if (!this.propUi) {
                this.propUi = cc.instantiate(prefab);
                cc.game.addPersistRootNode(this.propUi);
            }
            cb();
        }.bind(this);

        var prefab = cc.resources.get(PropUiPrefabPath, cc.Prefab);
        if (prefab) {
            func(prefab);
        } else {
            dd.ResLoader.loadGameStaticRes(PropUiPrefabPath, cc.Prefab, function (item) {
                func(item);
            }.bind(this));
        }
    },

    /**
     * 创建道具对象池
     */
    createPropNodePool: function () {
        this.propPool = new cc.NodePool();
        var prefab = cc.resources.get(PropUiPrefabPath, cc.Prefab);
        var initCount = 5;
        for (var i = 0; i < initCount; i++) {
            var node = cc.instantiate(prefab);
            this.propPool.put(node);
            cc.game.addPersistRootNode(node);
            node.active = false;
        }
    },

    /**
     * 获取道具节点
     */
    getPropNodeFromPool: function () {
        if (!this.propPool) {
            this.createPropNodePool();
        }
        if (this.propPool.size() == 0) {
            var prefab = cc.resources.get(PropUiPrefabPath, cc.Prefab);
            var node = cc.instantiate(prefab);
            cc.game.addPersistRootNode(node);
            this.propPool.put(node);
            node.active = false;
        }
        var tmp = this.propPool.get();
        return tmp;
    },

    /**
     * 监听道具使用事件
     * @param view
     */
    addObserver: function (view) {
        this.propED.addObserver(view);
    },

    /**
     * 移除道具使用监听事件
     * @param view
     */
    removeObserver: function (view) {
        this.propED.removeObserver(view);
    },

    /**
     * 获取某一行数据
     * @param id
     */
    getSingleRowData: function (id) {
        var data = null;
        ChatCfgData.PropCfg.forEach(function (item) {
            if (item.id == id) {
                data = item;
            }
        });
        return data;
    },

    /**
     * 渲染道具
     * @param msg  服务器返回消息
     * @param startPt  道具起点位置
     * @param endPt  道具终点位置
     */
    showProp: function (msg, startPt, endPt) {
        // var rowData = CsvParser.getSingleRowData(CsvFileId.PROP, msg.itemid);
        var rowData = this.getSingleRowData(msg.itemid);
        cc.log('UserInfoUtil::showProp:rowData=', rowData);
        var audio = rowData.audio;
        var playSoundFunc = function (cpt) {
            AudioManager.playSound(PropAudioDir + audio);
        }.bind(this);

        var node = this.getPropNodeFromPool();
        node.active = true;
        var cpt = node.getComponent('com_prop_ui');
        cpt.show(rowData, startPt, endPt);
        // this.msgUserId = msg.userid;
        // this.schedule(this._autoResumeChat, 10);
        cpt.addDisappearListener(function () {
            // this.unschedule(this._autoResumeChat);
            this.resetData();
            this.propED.notifyEvent(this.propEvent.PROP_RESUME, msg.userid);
            this.propPool.put(node);
            cc.game.addPersistRootNode(node);
            node.active = false;
        }.bind(this));
        // node.parent = cc.find('Canvas');
    },

    /**
     * 自动恢复聊天
     * @param dt
     * @private
     */
    _autoResumeChat: function (dt) {
        this.propED.notifyEvent(this.propEvent.PROP_RESUME, this.msgUserId);
    },

    /**
     * 主动关闭
     */
    ocClose: function () {
        if (this._node && this._node.active) {
            var cpt = this._node.getComponentInChildren('com_user_info');
            if (cpt)
                cpt.close();
        }
    },
});

module.exports = {
    UserInfoData: UserInfoData,
    UserInfoUtil: UserInfoUtil,
};