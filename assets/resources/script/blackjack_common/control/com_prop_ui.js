var AtlasPath = require('ConstantCfg').AtlasPath;
const PropAudioDir = 'blackjack_common/res/audio/prop/';
var AudioManager = require('AudioManager').getInstance();
const PropAtlasDir = 'blackjack_common/atlas/prop_';
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
        disappearCallback: null,
        /**
         * moveto持续时间
         */
        moveToDuration: 1,
        /**
         * 动画持续时间
         */
        animDuration: 5,
        /**
         * 动画播放完成后持续时间
         */
        lastDuration: 1,
        /**
         * 动画事件
         */
        clip: null,
        animation: null,
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 展示道具
     * @param data 道具数据
     * @param startPt 道具起点
     * @param endPt  道具终点
     */
    show: function (data, startPt, endPt) {
        var size = cc.winSize;

        var pic = data.pic;
        var count = data.count;
        var sp = this.node.getComponent(cc.Sprite);

        cc.dd.ResLoader.loadAtlas(PropAtlasDir + data.atlas, function (atlas) {
            var defaultSpf = atlas.getSpriteFrame(pic + '1');
            sp.spriteFrame = defaultSpf;
            startPt.x += size.width / 2;
            startPt.y += size.height / 2;
            endPt.x += size.width / 2;
            endPt.y += size.height / 2;
            this.node.setPosition(startPt);

            // var moveTo = cc.moveTo(this.moveToDuration, endPt);

            var animFunc = function () {
                var frames_list = [];
                for (var i = 0; i < count; i++) {
                    var spf = atlas.getSpriteFrame(pic + (i + 1));
                    frames_list.push(spf);
                }
                var animation = this.node.getComponent(cc.Animation);
                this.animation = animation;
                var clip = cc.AnimationClip.createWithSpriteFrames(frames_list, count);
                this.clip = clip;
                clip.name = 'anim_run';
                // clip.wrapMode = cc.WrapMode.Loop;
                // clip.events.push({
                //     frame: this.animDuration,
                //     func: 'close',
                // });
                animation.on('finished', this.onFinished, this);
                animation.addClip(clip);
                animation.play('anim_run');
            }.bind(this);

            var audio = data.audio;
            this.playEffect('throw');
            // this.node.runAction(cc.sequence(
            //     moveTo
            //     , cc.callFunc(function () {
            //         this.playEffect(audio);
            //         animFunc();
            //     }.bind(this))
            // ));
            cc.tween(this.node)
                .to(this.moveToDuration, { position: endPt })
                .call(function () {
                    this.playEffect(audio);
                    animFunc();
                }.bind(this))
                .start();
        }.bind(this));
    },

    /**
     * 播放道具音效
     * @param audio
     */
    playEffect: function (audio) {
        AudioManager.playSound(PropAudioDir + audio);
    },

    /**
     * 动画播放完毕
     */
    onFinished: function () {
        this.scheduleOnce(function (dt) {
            this.close();
        }.bind(this), this.lastDuration);
    },

    /**
     * 监听动画消失事件
     * @param cb
     */
    addDisappearListener: function (cb) {
        this.disappearCallback = cb;
    },

    close: function () {
        if (this.disappearCallback) {
            this.disappearCallback();
        }
        this.disappearCallback = null;
        this.animation.removeClip(this.clip);
        this.clip.destroy();
        this.animation.off('finished', this.onFinished, this);
        // this.node.removeFromParent();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
