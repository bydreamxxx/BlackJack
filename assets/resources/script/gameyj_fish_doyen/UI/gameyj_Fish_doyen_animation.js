cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {

    },

    init({ type, count }) {

        var ske = this.node.getComponent(sp.Skeleton);
        ske.clearTracks()
        if (type == 1) {
            ske.setSkin('gjlq')
            this.node.getChildByName("gjlq").getComponent(cc.Label).string = count
            this.node.getChildByName("gjlq").active = true
        } else if (type == 2 || type == 3 || type == 4) {
            ske.setSkin('hb')
            this.node.getChildByName("hb").getComponent(cc.Label).string = count / 100
            this.node.getChildByName("hb").active = true
        } else if (type == 5) {
            ske.setSkin('jdk')
            this.node.getChildByName("jdk").getComponent(cc.Label).string = count
            this.node.getChildByName("jdk").active = true
        } else if (type == 6) {
            ske.setSkin('dhcg')
            this.node.getChildByName("dhcg").getComponent(cc.Label).string = count
            this.node.getChildByName("dhcg").active = true
        } else {

        }
        this.time = 2
        this.interval = null
        ske.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name == 'appear') {
                ske.setAnimation(0, 'Standby', true)
                this.schedule(() => {
                    this.node.getChildByName("time").getComponent(cc.Label).string = this.time + '秒后自动关闭'
                    if (this.time < 1)
                        this.close()
                    this.time--
                }, 1);
            }
        });
        ske.setAnimation(0, 'appear', false)
    },
    close: function (event, data) {
        // clearInterval(this.interval)
        this.unscheduleAllCallbacks()
        cc.dd.UIMgr.destroyUI(this.node);
    },

});
