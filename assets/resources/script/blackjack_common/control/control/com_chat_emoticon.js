
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
         * 道具动画消失回调
         */
        disappearCallback:null,
        /**
         * 动画持续时间
         */
        animDuration:3,
        /**
         * 动画事件
         */
        clip:null,
        animation:null,
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 显示表情
     * @param pic
     * @param count
     */
    show:function (pic, count) {
        var sp = this.node.getComponent(cc.Sprite);
        var atlas = cc.loader.getRes(AtlasPath.EMOTICON, cc.SpriteAtlas);
        var defaultSpf = atlas.getSpriteFrame(pic+'_1');
        sp.spriteFrame = defaultSpf;

        var frames_list = [];
        for(var i=0; i<count; i++){
            var spf = atlas.getSpriteFrame(pic+'_'+(i+1));
            frames_list.push(spf);
        }
        var animation = this.node.getComponent(cc.Animation);
        this.animation = animation;
        var clip = cc.AnimationClip.createWithSpriteFrames(frames_list, count);
        this.clip = clip;
        clip.name = 'anim_run';
        clip.wrapMode = cc.WrapMode.Loop;
        // clip.events.push({
        //     frame: 5,
        //     func: 'close',
        // });
        // animation.on('finished', this.onFinished, this);
        animation.addClip(clip);
        animation.play('anim_run');

        this.scheduleOnce(this.close, this.animDuration);
    },

    /**
     * 监听动画消失事件
     * @param cb
     */
    addDisappearListener:function (cb) {
        this.disappearCallback = cb;
    },

    /**
     * 动画播放完毕
     */
    onFinished:function () {
        this.close();
    },

    close:function () {
        if(this.disappearCallback){
            this.disappearCallback();
        }
        this.disappearCallback = null;
        this.animation.stop();
        this.animation.removeClip(this.clip);
        this.clip.destroy();
        // this.animation.off('finished', this.onFinished, this);
        // this.node.removeFromParent();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
