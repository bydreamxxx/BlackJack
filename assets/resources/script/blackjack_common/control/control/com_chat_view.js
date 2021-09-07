
var CntCfg = require('ConstantCfg');
var aniName = CntCfg.AnimationName;

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
         * 当前视图状态
         */
        isDuanYuClick:true,
        /**
         * 是否要关闭窗口
         */
        isClose:false,
        /**
         * 短语视图节点
         */
        duanYuView:cc.Node,
        /**
         * 表情视图节点
         */
        biaoQingView:cc.Node,
        /**
         * 短语item点击事件
         */
        itemClickListener:null,
        /**
         * 聊天界面关闭事件
         */
        closeListener:null,
        /**
         * 背景节点
         */
        bgNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    show:function () {
        var ani = this.node.getComponent(cc.Animation);
        ani.play(aniName.CHAT_VIEW_SHOW);
    },

    /**
     * 初始化表情数据
     * @param data
     */
    initBiaoQingData:function (data) {
        var cpt = this.getBiaoQingCpt();
        cpt.addItemClickListener(function (itemData, type) {
            if(this.itemClickListener){
                this.itemClickListener(itemData, type);
            }
            this.disappear();
        }.bind(this));
        cpt.init(data);
    },

    /**
     * 初始化短语数据
     * @param data
     */
    initDuanYuData:function (data) {
        var cpt = this.getDuanYuViewCpt();
        cpt.addItemClickListener(function (itemData, type) {
            if(this.itemClickListener){
                this.itemClickListener(itemData, type);
            }
            this.disappear();
        }.bind(this));
        cpt.init(data);
    },

    /**
     * 设置背景位置
     * @param pt
     */
    setBgPos:function (pt) {
        this.bgNode.setPosition(pt);
    },

    /**
     * 监听item点击事件
     * @param cb
     */
    addItemClickListener:function (cb) {
        this.itemClickListener = cb;
    },

    /**
     * 弹框以外的区域点击
     */
    maskClick:function () {
        if(this.isClose){
            return;
        }
        this.isClose = true;
        var mask = cc.find('bg/limitClickMask', this.node);
        mask.active = true;
        this.disappear();
    },

    /**
     * 获取短语节点脚本组件
     * @returns {Component}
     */
    getDuanYuViewCpt:function () {
        var cpt = this.duanYuView.getComponent('DuanYuView');
        return cpt;
    },

    /**
     * 获取表情节点脚本组件
     * @returns {Component}
     */
    getBiaoQingCpt:function () {
        var cpt = this.biaoQingView.getComponent('BiaoQingGridView');
        return cpt;
    },

    /**
     * 播放弹框消失动画
     */
    disappear:function () {
        var ani = this.node.getComponent(cc.Animation);
        ani.play(aniName.CHAT_VIEW_DISAPPEAR);
    },

    /**
     * 切换到表情视图
     */
    biaoqingClick:function(){
        if(this.isDuanYuClick){
            this.isDuanYuClick = false;
            this.changeCheck(true);
        }
    },

    /**
     * 切换到短语视图
     */
    duanyuClick:function(){
        if(!this.isDuanYuClick){
            this.isDuanYuClick = true;
            this.changeCheck(false);
        }
    },

    /**
     * 刷新视图
     * @param state
     */
    changeCheck:function(state){
        var bqNode = cc.find('bg/biaoqing/check', this.node);
        bqNode.active = state;
        var dyNode = cc.find('bg/duanyu/check', this.node);
        dyNode.active = !state;

        this.duanYuView.active = !state;
        this.biaoQingView.active = state;
    },

    /**
     * 监听聊天界面关闭事件
     */
    addCloseListener:function (cb) {
        this.closeCallback = cb;
    },

    /**
     * 销毁
     */
    close:function () {
        if(this.closeCallback){
            this.closeCallback();
            this.closeCallback = null;
        }
        this.isClose = false;
        // this.node.removeFromParent();
    },

    /**
     * 开始动画结束
     */
    showEnd:function () {
        var mask = cc.find('bg/limitClickMask', this.node);
        mask.active = false;
    },

    /**
     * 消失动画结束
     */
    disappearEnd:function () {
        this.close();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
