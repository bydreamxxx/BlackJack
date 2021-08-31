// create by wj 2019/12/21
var game_Ed = require('westward_journey_data_mannager').Westward_Journey_Ed;
var game_Event = require('westward_journey_data_mannager').Westward_Journey_Event;

cc.Class({
    extends: cc.Component,

    properties: {
        m_oParticle: {default: [], type: cc.ParticleSystem, tooltip: '大圣动画'},
        m_oSkeleton: sp.Skeleton,
    },

    onLoad () {
        this.m_oSkeleton.setAnimation(0, 'sunwukong', false);
        var self = this;
        this.m_oTimeOut = setTimeout(function(){
            clearTimeout(self.m_oTimeOut);
            for(var i = 0; i < 2; i++){
                self.m_oParticle[i].node.active = true;
                self.m_oParticle[i].resetSystem();
            }
            self.m_ocloseTimeOut = setTimeout(function(){
                clearTimeout(self.m_ocloseTimeOut);
                self.closeUI();
            }, 3200);
        }, 1500);
    },

    closeUI: function(){
        game_Ed.notifyEvent(game_Event.Westward_Journey_CHECK_RESULT);
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
