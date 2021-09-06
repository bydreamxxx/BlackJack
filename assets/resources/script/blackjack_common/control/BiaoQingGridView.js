var dd = cc.dd;
const BiaoQingItemPrefabUrl = 'blackjack_common/prefab/BiaoQingItem';

var CntCfg = require('ConstantCfg');
var ChatMsgType = CntCfg.ChatMsgType;

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
         * item列表
         */
        item_list: [],
        /**
         * item点击监听事件
         */
        itemClickCallback: null,
        /**
         * gridview列数
         */
        col: 4,
        /**
         * item高
         */
        itemHeight: 100,
        /**
         * item宽
         */
        itemWidth: 0,
        /**
         * scrollview content节点
         */
        itemParent: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 初始化数据
     * @param data
     */
    init: function (data) {
        var func = function (prefab) {
            cc.log('BiaoQingGridView::init:data=', data);
            this.itemWidth = this.itemParent.width / this.col;
            cc.log('BiaoQingGridView::init:item宽度为:', this.itemWidth);
            data.forEach(function (item) {
                this.addItem(prefab, item);
            }.bind(this));
        }.bind(this);

        this.getPrefab(function (prefab) {
            func(prefab);
        }.bind(this));
    },

    /**
     * 获取元素预制
     * @param cb
     */
    getPrefab: function (cb) {
        var prefab = cc.resources.get(BiaoQingItemPrefabUrl, cc.Prefab);
        if (prefab) {
            cb(prefab);
        } else {
            dd.ResLoader.loadGameStaticRes(BiaoQingItemPrefabUrl, cc.Prefab, function (item) {
                cb(item);
            });
        }
    },

    /**
     * 增加元素
     */
    addItem: function (prefab, data) {
        var itemNode = cc.instantiate(prefab);
        var cpt = itemNode.getComponent('BiaoQingItem');
        cpt.init(data);
        cpt.addClickListener(function (data) {
            if (this.itemClickCallback) {
                this.itemClickCallback(data, ChatMsgType.BIAO_QING);
            }
        }.bind(this));
        itemNode.parent = this.itemParent;
        this.item_list.push(cpt);

        this.freshView(cpt);
    },

    /**
     * 监听元素点击事件
     * @param cb
     */
    addItemClickListener: function (cb) {
        this.itemClickCallback = cb;
    },

    /**
     * 调整scrollview content大小和item的位置
     * @param itemCpt
     */
    freshView: function (itemCpt) {
        itemCpt.setItemSize(this.itemWidth, this.itemHeight);

        var cnt = this.item_list.length;
        var row = Math.floor((cnt - 1) / this.col) + 1;
        var col = (cnt - 1) % this.col + 1;
        var height = row * this.itemHeight;
        this.itemParent.height = height;

        cc.log('BiaoQingGridView::freshView:在第', row, '行，第', col, '列增加第', cnt, '个表情元素！');
        var x = -this.itemParent.width / 2 + (2 * col - 1) * this.itemWidth / 2;
        var y = -(2 * row - 1) * this.itemHeight / 2;
        itemCpt.setItemPos(x, y);
        cc.log('BiaoQingGridView::freshView:新增元素位置为:', x, ',', y,
            ', content高度为:', height);
    },

    close: function () {
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
