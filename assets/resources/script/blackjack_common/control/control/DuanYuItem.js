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
         * item 文字内容
         */
        text:'',
        /**
         * item 音效
         */
        audio:'',
    },

    // use this for initialization
    onLoad: function () {
    },

    /**
     * 设置item 数据
     * @param data
     */
    init:function (data) {
        this.id = data.id;
        this.text = data.text;
        this.audio = data.audio;

        this.showText(this.text);
        cc.log('DuanYuItem::init:' +
            '【id：', this.id,
            ', 内容：', this.text,
            ', 音效：',  this.audio,'】');
    },

    /**
     * 显示item文字
     * @param text
     */
    showText:function (text) {
        var lblNode = cc.find('lbl', this.node);
        lblNode.getComponent(cc.Label).string = text;
    },

    /**
     * 获取item高度
     */
    getItemHeight:function () {
        var btnNode = cc.find('btn', this.node);
        return btnNode.height;
    },

    /**
     * item点击回调
     */
    itemClick:function () {
        cc.log('短语item被点中：【id：', this.id,
                    ', 文本为：', this.text,
                    ', 音效为：', this.audio,'】');
        if(this.itemClickCallback){
            this.itemClickCallback({
                id:this.id,
                text:this.text,
                audio:this.audio
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
