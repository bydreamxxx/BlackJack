
var AtlasPath = require('ConstantCfg').AtlasPath;

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
         * item点击事件
         */
        itemClickCallback:null,
        /**
         * id item唯一标识
         */
        id:null,
        /**
         * 道具图标
         */
        iconSp:cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 初始化item
     * @param data
     */
    init:function (data) {
        cc.log('PropItem::init:初始化道具数据:', JSON.stringify(data));
        this.id = data.id;
        this.getSpFrame(data.icon, function (spf) {
            this.iconSp.spriteFrame = spf;
        }.bind(this));
    },

    /**
     * 获取spriteFrame
     * @param name
     */
    getSpFrame:function (name, cb) {
        cc.dd.ResLoader.loadAtlas(AtlasPath.PROP_ICON, function (atlas) {
            var spf = atlas.getSpriteFrame(name);
            cb(spf);
        });
    },

    /**
     * 获取btn控件
     */
    getBtnNode:function () {
        var btn = cc.find('btn', this.node);
        return btn;
    },

    /**
     * 获取sp控件
     */
    getSpNode:function () {
        var sp = cc.find('sp', this.getBtnNode());
        return sp;
    },

    /**
     * 设置item高，宽
     * @param width
     * @param height
     */
    setItemSize:function (width, height) {
        var btn = this.getBtnNode();
        btn.width = width;
        btn.height = height;
    },

    /**
     * item点击事件
     */
    itemClick:function () {
        if(this.itemClickCallback){
            this.itemClickCallback(this.id);
        }
    },

    /**
     * 监听item点击事件
     * @param cb
     */
    addItemClickListener:function (cb) {
        this.itemClickCallback = cb;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
