var dd = cc.dd;
var aniName = require('ConstantCfg').AnimationName;
var UserSex = require('ConstantCfg').UserSex;
var AtlasPath = require('ConstantCfg').AtlasPath;

const PropItemPrefabPath = 'gameyj_common/prefab/PropItem';

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        /**
         * 关闭窗口回调
         */
        closeCallback: null,
        /**
         * 道具点击回掉
         */
        itemClickCallback: null,
        /**
         * 背景左半部分
         */
        leftBgSp: cc.Sprite,
        /**
         * 背景右半部分
         */
        rightBgSp: cc.Sprite,
        /**
         * 头像
         */
        headSp: cc.Sprite,
        /**
         * 性别头像（默认男生）
         */
        sexSp: cc.Sprite,
        /**
         * 女生头像
         */
        girlSpf: cc.SpriteFrame,
        /**
         * 昵称
         */
        nickLbl: cc.Label,
        /**
         * id
         */
        idLbl: cc.Label,
        /**
         * 房卡数量
         */
        fkCntLbl: cc.Label,
        /**
         * 游戏币数量
         */
        moneyLbl: cc.Label,
        /**
         * 位置
         */
        cityLbl: cc.Label,
        /**
         * 道具消耗金币数量
         */
        propCostLbl: cc.Label,
        /**
         * 道具父节点
         */
        propItemParent: cc.Node,
        /**
         * item宽
         */
        itemWidth: 100,
        /**
         * item高
         */
        itemHeight: 100,
        /**
         * 道具列表
         */
        item_list: [],
        /**
         * 遮蔽层
         */
        sprite_mask: cc.Button,
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 设置背景图片
     * @param spf
     */
    setBgSpf: function (spf) {
        this.leftBgSp.spriteFrame = spf;
        this.rightBgSp.spriteFrame = spf;
    },

    /**
     * 获取背景节点
     */
    getBgNode: function () {
        var bg = this.node;
        return bg;
    },

    /**
     * 播放开始动画
     */
    playStartAni: function () {
        var bg = this.getBgNode();
        var ani = bg.getComponent(cc.Animation);
        ani.play(aniName.POPUP_START);
    },

    show: function (data) {
        this.sprite_mask.interactable = true;

        this.playStartAni();

        this.setSpf(this.headSp, data.headSpf);
        cc.dd.ResLoader.loadAtlas(AtlasPath.USER_INFO, function (atlas) {
            if (data.sex == UserSex.GIRL) {
                this.setSpf(this.sexSp, atlas.getSpriteFrame("wjxx_nv"));
            } else {
                this.setSpf(this.sexSp, atlas.getSpriteFrame("wjxx_nan"));
            }
        }.bind(this));

        this.setLblStr(this.nickLbl, cc.dd.Utils.substr( data.nick, 0, 10 ) );
        this.setLblStr(this.idLbl, 'ID:' + data.id);
        this.setLblStr(this.fkCntLbl, data.fkCnt);
        this.setLblStr(this.moneyLbl, data.money);
        this.setLblStr(this.cityLbl, data.city);
        this.setLblStr(this.propCostLbl, data.propCost + "金币/次（从背包中消耗）");
    },

    /**
     * 加载道具数据
     * @param data
     */
    initPropData: function (data) {
        this.getItemPrefab(function (prefab) {
            data.forEach(function (item) {
                var node = cc.instantiate(prefab);
                var cpt = node.getComponent('PropItem');
                this.item_list.push(cpt);
                cpt.init(item);
                cpt.addItemClickListener(function (data) {
                    if (this.itemClickCallback) {
                        this.itemClickCallback(data);
                    }
                    this.close();
                }.bind(this));
                this.freshPropView(cpt);
                node.parent = this.propItemParent;
            }.bind(this));
        }.bind(this));
    },

    /**
     * 刷新道具视图
     */
    freshPropView: function (cpt) {
        cpt.setItemSize(this.itemWidth, this.itemHeight);
        var cnt = this.item_list.length;
        this.propItemParent.width = cnt * this.itemWidth;
        cpt.node.x = (2 * cnt - 1) * this.itemWidth / 2;
    },

    /**
     * 获取道具item预制
     */
    getItemPrefab: function (cb) {
        var prefab = cc.loader.getRes(PropItemPrefabPath, cc.Prefab);
        if (prefab) {
            cb(prefab);
        } else {
            dd.ResLoader.loadGameStaticRes(PropItemPrefabPath, cc.Prefab, function (item) {
                cb(item);
            }.bind(this));
        }
    },

    /**
     * 设置精灵背景
     * @param sp
     * @param spf
     */
    setSpf: function (sp, spf) {
        if (spf && sp) {
            sp.spriteFrame = spf;
        }
    },

    /**
     * 设置显示文字
     * @param lbl
     * @param str
     */
    setLblStr: function (lbl, str) {
        if (lbl) {
            lbl.string = str;
        }
    },

    maskClick: function () {
        this.close();
    },

    popupInActFinished: function () {
        cc.log('com_user_info::popupInActFinished!');
    },

    popupOutActFinished: function () {
        // this.node.parent.removeFromParent();
        if (this.closeCallback) {
            this.closeCallback();
        }
        cc.log('com_user_info::popupOutActFinished!');
    },

    close: function () {
        this.sprite_mask.interactable = false;
        var bg = this.getBgNode();
        var ani = bg.getComponent(cc.Animation);
        ani.play(aniName.POPUP_END);
    },

    /**
     * 监听关闭窗口消息
     * @param cb
     */
    addCloseListener: function (cb) {
        this.closeCallback = cb;
    },

    /**
     * 监听item点击事件
     * @param cb
     */
    addItemClickListener: function (cb) {
        this.itemClickCallback = cb;
    },

    /**
     * 释放道具内存
     */
    clearUi: function () {
        this.item_list.forEach(function (item) {
            item.node.removeFromParent();
            item.node.destroy();
        });
    },

    onDestroy: function () {
        this.item_list = [];
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
