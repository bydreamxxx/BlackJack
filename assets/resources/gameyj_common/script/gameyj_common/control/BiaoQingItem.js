
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
         * item 监听事件
         */
        itemClickCallback:null,
        /**
         * item 唯一标识
         */
        id:0,
        /**
         * 表情图片前缀
         */
        pic:'',
        /**
         * 一个表情帧数
         */
        count:'',
        /**
         * 表情描述
         */
        detail:'',
    },

    // use this for initialization
    onLoad: function () {
    },

    /**
     * 获取表情spriteFrame
     * @param name
     */
    getSpFrame:function (name) {
        var atlas = cc.resources.get(AtlasPath.EMOTICON, cc.SpriteAtlas);
        var spf = atlas.getSpriteFrame(name);
        return spf;
    },

    /**
     * 设置item 数据
     * @param data
     */
    init:function (data) {
        this.id = data.id;
        this.pic = data.pic;
        this.count = data.count;
        this.detail = data.detail;

        this.showPic(this.pic);
        cc.log('BiaoQingItem：init【id：', this.id,
            ', 图片为：', this.pic,
            ', 图片个数为：', this.count,
            ', 描述：', this.detail,'】');
    },

    /**
     * 显示item图片
     * @param pic
     */
    showPic:function (pic) {
        var spNode = cc.find('btn/sp', this.node);
        var cpt = spNode.getComponent(cc.Sprite);
        cpt.spriteFrame = this.getSpFrame(pic+'_1');
    },

    /**
     * 设置item大小
     * @param width
     * @param heigth
     */
    setItemSize:function (width, heigth) {
        var btnNode = this.getBtnNode();
        btnNode.width = width;
        btnNode.height = heigth;
    },

    /**
     * 设置item位置
     * @param x
     * @param y
     */
    setItemPos:function (x,y) {
        var btnNode = this.getBtnNode();
        btnNode.x = x;
        btnNode.y = y;
    },

    /**
     * 获取button节点
     * @returns {Node}
     */
    getBtnNode:function () {
        var btnNode = cc.find('btn', this.node);
        return btnNode;
    },

    /**
     * item点击回调
     */
    itemClick:function () {
        cc.log('表情item被点中：【id：', this.id,
            ', 图片为：', this.pic,
            ', 图片个数为：', this.count,
            ', 描述：', this.detail,'】');
        if(this.itemClickCallback){
            this.itemClickCallback({
                id:this.id,
                pic:this.pic,
                count:this.count,
                detail:this.detail,
            });
        }
    },

    /**
     * 监听item点击事件
     * @param cb
     */
    addClickListener:function (cb) {
        this.itemClickCallback = cb;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
