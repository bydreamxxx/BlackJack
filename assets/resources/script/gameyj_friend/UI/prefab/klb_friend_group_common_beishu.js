const BEISHU = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 40, 50, 100];
const START_PROGRESS = 0.055;
const END_PROGRESS = 0.945;
var AppCfg = require('AppConfig');

cc.Class({
    extends: cc.Component,

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let node = cc.find('slider', this.node);
        if(node){
            this.slider_bar = node.getComponent(cc.Slider);
            this.progress_bar = node.getComponent(cc.ProgressBar);
            this.slider_bar.progress = START_PROGRESS;
            this.progress_bar.progress = START_PROGRESS;
        }
        let label = cc.find('fenshu/text_explain', this.node);
        if(label){
            this.fenshu_label = label.getComponent(cc.Label);
            this.fenshu_label.string = BEISHU[0];
        }

        this.node.active = false;//cc.director.getScene().name !== AppCfg.HALL_NAME;
    },

    //slider滑动
    onSliderMove: function(event, data){
        let dir = (END_PROGRESS - START_PROGRESS) / (BEISHU.length - 1);

        if(this.slider_bar && this.progress_bar && this.fenshu_label){
            var progress = this.slider_bar.progress;
            if(progress < START_PROGRESS){
                progress = START_PROGRESS
            }else if(progress > END_PROGRESS){
                progress = END_PROGRESS;
            }

            this.fenshu_label.string = BEISHU[Math.floor((progress - START_PROGRESS) / dir)];

            this.slider_bar.progress = progress;
            this.progress_bar.progress = progress;
        }
    },

    getBeiShu(){
        if(this.fenshu_label){
            return parseInt(this.fenshu_label.string)
        }else{
            return BEISHU[0];
        }
    },

    setBeiShu(beishu){
        this.fenshu_label.string = beishu;
        let idx = BEISHU.indexOf(beishu);
        let progress = idx * (END_PROGRESS - START_PROGRESS) / (BEISHU.length - 1) + START_PROGRESS;
        if(progress < START_PROGRESS){
            progress = START_PROGRESS
        }else if(progress > END_PROGRESS){
            progress = END_PROGRESS;
        }
        this.slider_bar.progress = progress;
        this.progress_bar.progress = progress;

        this.slider_bar.enabled = false;
    }
});
