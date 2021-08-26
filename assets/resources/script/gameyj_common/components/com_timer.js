// create by wj 2018/05/04

cc.Class({
    extends: cc.Component,
    initTimerParem: function(timelimit, totalTimer){
        this.timer = 0;
        this.timerLimit = timelimit;
        this.totalTimer = totalTimer;
    },

    update: function(dt) {
        this.timer += dt;
        if(this.timer >= this.timerLimit){
            var time = parseInt(cc.sys.localStorage.getItem( 'onlinetime' ));
            time += this.timer;
            if(time >= this.totalTimer){
                if(!cc._chifengGame){
                    cc.dd.PromptBoxUtil.show("您已经在线3小时了，请合理安排游戏时间!");
                }
                time = 0;
            }
            cc.sys.localStorage.setItem( 'onlinetime', time );
            this.timer = 0;
        }
    },
});
