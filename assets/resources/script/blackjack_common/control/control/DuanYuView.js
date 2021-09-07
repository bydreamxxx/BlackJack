var dd = cc.dd;
const DuanYuItemPrefabUrl = 'gameyj_common/prefab/DuanYuItem';

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
         * 输入框
         */
        editBox:cc.EditBox,
        /**
         * 滑动视图
         */
        scrollView:cc.ScrollView,
        /**
         * item列表
         */
        item_list:[],
        /**
         * item点击监听事件
         */
        itemClickCallback:null,
        /**
         * item父节点
         */
        itemParent:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 初始化数据
     * @param data
     */
    init:function (data) {
        var func = function (prefab) {
            cc.log('DuanYuView::init:data=',data);
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
    getPrefab:function (cb) {
        var prefab = cc.loader.getRes(DuanYuItemPrefabUrl, cc.Prefab);
        if(prefab){
            cb(prefab);
        }else{
            dd.ResLoader.loadGameStaticRes(DuanYuItemPrefabUrl, cc.Prefab, function (item) {
                cb(item);
            });
        }
    },

    /**
     * 增加元素
     */
    addItem:function (prefab, data) {
        var itemNode = cc.instantiate(prefab);
        var cpt = itemNode.getComponent('DuanYuItem');
        cpt.init(data);
        cpt.addClickListener(function (data) {
            if(this.itemClickCallback){
                this.itemClickCallback(data, ChatMsgType.DUAN_YU);
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
    addItemClickListener:function (cb) {
        this.itemClickCallback = cb;
    },

    /**
     * 调整scrollview content大小和item的位置
     * @param itemCpt
     */
    freshView:function (itemCpt) {
        var cnt = this.item_list.length;
        var itemHeight = itemCpt.getItemHeight();
        var sizeHeight = cnt*itemHeight;
        this.itemParent.height = sizeHeight;
        var itemPosY = -(2*cnt-1)*itemHeight/2;
        itemCpt.node.y = itemPosY;

        cc.log('DuanYuView::freshView:新增元素位置为:',itemPosY,
                ', content高度为:', sizeHeight);
    },

    /**
     * 发送输入框文字
     */
    sendMsg:function () {
        cc.log('DuanYuView::sendMsg:', this.editBox.string);
        if(this.itemClickCallback){
            this.itemClickCallback(this.editBox.string, ChatMsgType.CUSTOM);
        }
    },

    close:function () {
        this.item_list.forEach(function (item) {
            item.node.removeFromParent();
            item.node.destroy();
        });
    },

    onDestroy:function () {
        this.item_list = [];
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
