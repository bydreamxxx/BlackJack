// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require('com_game_update'),

    properties: {
        progress_value:[cc.Label],
        progress_bar:[cc.ProgressBar],
        progress_circle: [cc.Sprite]
    },

    onLoad() {
        this._super();
        this.progress_value.forEach((progress_value)=>{
            if(progress_value){
                progress_value.string = '0';
            }
        })

        this.progress_bar.forEach((progress_bar)=>{
            if(progress_bar){
                progress_bar.progress = 1;
            }
        })

        this.progress_circle.forEach((progress_circle)=>{
            if(progress_circle){
                progress_circle.fillRange = 1;
            }
        })
    },

    /**
     * 刷新UI
     */
    updateUI(active, progress) {
        this.progress_value.forEach((progress_value)=>{
            if(progress_value){
                progress_value.node.active = active
                if (progress) {
                    progress_value.string = parseInt(progress * 100);
                }
            };
        });

        this.progress_bar.forEach((progress_bar, idx)=>{
            if(progress_bar){
                progress_bar.node.active = active;
                progress_bar.barSprite.node.active = active;
                if (progress) {
                    progress_bar.progress = 1 - progress > 0.001 ? 1 - progress : 0.001;
                    this.progress_circle[idx].fillRange = progress_bar.barSprite.fillRange;
                }
            }
        });
    },

    // update (dt) {},
});
