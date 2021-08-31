//create by wj 2019/05.15

cc.Class({
    extends: cc.Component,

    properties: {
        m_oGrassLand: cc.Node,
        m_oGrassSkeleton: sp.Skeleton,
        m_oCowSkeleton: sp.Skeleton,
        m_nTimes : 1,
        m_nCowTimes : 1,   
        
        m_oSheepNode1: cc.Node,
        m_oSheepNode2: cc.Node,
    },

    onLoad: function(){
        this.scaleX = this.node.width / this.node.height;
        let windowSize=cc.winSize;//推荐  原因  短
        this.m_oGrassLand.scaleX = (windowSize.width / windowSize.height) / this.scaleX;

    },

    start () {
        let windowSize=cc.winSize;//推荐  原因  短
        this.m_oGrassLand.scaleX = (windowSize.width / windowSize.height) / this.scaleX;
    },

    update(){
        let windowSize=cc.winSize;//推荐  原因  短
        this.m_oGrassLand.scaleX = (windowSize.width / windowSize.height) / this.scaleX;
    },

    //播放草的动画
    playGrassAnim: function(){
        var self = this;
        //self.m_oGrassSkeleton.clearTracks();
        if(self.m_nTimes % 3 != 0)
            self.m_oGrassSkeleton.setAnimation(0, 'fengchuicao', false);
        else{
            self.m_oGrassSkeleton.setAnimation(0, 'fengchuicao2', false);
            self.m_nTimes = 0;
        }
        self.m_oGrassSkeleton.setCompleteListener(function(){
            self.m_nTimes += 1;
            self.playGrassAnim();
        });
    },
    //播放牛的动画
    playCowAnim: function(){
        var self = this;
        //self.m_oCowSkeleton.clearTracks();
        if(self.m_nCowTimes == 1)
            self.m_oCowSkeleton.setAnimation(0, 'fengchuiniu', false);
        else{
            self.m_oCowSkeleton.setAnimation(0, 'fengchuiniu2', false);
            self.m_nCowTimes = 0;
        }
        self.m_oCowSkeleton.setCompleteListener(function(){
            self.m_nCowTimes += 1;
            self.playCowAnim();
        });
    },

    //播放羊的动画
    playSheepAnim: function(){
        
    },
});
