let hall_audio_mgr = require('hall_audio_mgr').Instance();
let texas_audio_cfg = require('texas_audio_cfg');
let texas_Data = require('texas_data').texas_Data;
// var PROGRESS_STEP=0.1//点加减号
var AUTO_CLICK_TIME = 0.6;

var BOTTOM_ARRAY = [
    0.5,
    2/3,
    1
];
cc.Class({
    requireComponent: cc.Slider,

    extends: cc.Component,

    properties: {
        value_lbl: cc.Label,
        baseScore_lbl : {default:[], type: cc.Label},
        baseScore_Btn : {default:[], type: cc.Button},
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._addNode = cc.find('add',this.node.parent)
        this._subNode = cc.find('sub',this.node.parent)
        this._addNode.on(cc.Node.EventType.TOUCH_START, this.onAddStart, this); //开始点击
        this._addNode.on(cc.Node.EventType.TOUCH_END, this.onAddEnd, this); //点击结束
        this._addNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onAddCancel, this); //点击取消

        this._subNode.on(cc.Node.EventType.TOUCH_START, this.onSubStart, this); //开始点击
        this._subNode.on(cc.Node.EventType.TOUCH_END, this.onSubEnd, this); //点击结束
        this._subNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onSubCancel, this); //点击取消
        this.m_bAddUp = false;
        this.m_bSubUp = false;  
    },

    onDisable() {
        // if (this.node.parent.getChildByName('input')) {
        //     this.node.parent.getChildByName('input').active = false;
        // }
    },

    setData(min, max, step, defalutPercent,bottom,labelAdd) {
        this.m_bAddUp = false;
        this.m_bSubUp = false;  
        this._min = min;
        this._max = max;
        this._defalutPercent = defalutPercent;
        this._step = step || 1;
        this._bottom = bottom;
        this._value = min + defalutPercent * (max - min);
        this.getComponent(cc.Slider).progress = defalutPercent;
        this.getComponent(cc.ProgressBar).progress = defalutPercent;
        this.value_lbl.string = cc.dd.Utils.getNumToWordTransform(this._value);
        for(var i = 0; i < 3; i++){
            this.baseScore_lbl[i].string = cc.dd.Utils.getNumToWordTransform(this._min);
            if((i+3) * this._min < this._max)
                this.baseScore_Btn[i].interactable = true
            else
                this.baseScore_Btn[i].interactable = false
        }

        this.labelAdd = labelAdd;
        if(this._defalutPercent == 100)
        {
            this.showAllIn(true);
        }
    },


    onSlider(event,noCalValue) {
        if(this._defalutPercent == 100)
            return;

        if (event.progress == 1) {
            this._value = this._max;
        }
        else {
            if(noCalValue)
            {

            }else
            {
                this._value = Math.floor(parseInt(this._min + (this._max - this._min) * event.progress)/this._step) * this._step
            }
            
            this.getComponent(cc.Slider).progress = Math.min(1, (this._value-this._min)/(this._max - this._min));
            this.getComponent(cc.ProgressBar).progress = Math.min(1, (this._value-this._min)/(this._max - this._min));
        }
        this.value_lbl.string = this._value;//this.convertNumToStr(this._value);
        if(this._value == this._max)
        {
            this.showAllIn();
            
        }
    },

    showAllIn(isInit)
    {
        // if(this.skeNode.active==false)
        // {
        //     if(isInit)
        //     {

        //     }else
        //     {
        //         AudioManager.playSound(texas_audio_cfg.Allin, false);
        //         if(this.labelAdd)
        //         {
        //             this.labelAdd.string = "ALL IN"
        //         }
        //     }
            
        //     this.skeNode.active = true;
        //     var sk = this.skeNode.getComponentInChildren(sp.Skeleton) ;
        //     if(sk)
        //     {
        //         sk.clearTracks();
        //         sk.setAnimation(0, 'allin_come',false);
        //         sk.setCompleteListener(function () {
        //             sk.setCompleteListener(function () {});
        //             // sk.clearTracks();
        //             sk.setAnimation(0, 'allin_xh',true);
        //         }.bind(this));
        //     }
        // }
    },

    update (dt) {
        if(this.m_bAddUp)
        {
            this.m_tAddTime += dt;
            if (this.m_tAddTime >= AUTO_CLICK_TIME) {
                this.m_tAddStepTime += dt;
                if(this.m_tAddStepTime>0.1)
                {
                    this.onAddBtn();
                }
            }
        }

        if(this.m_bSubUp)
        {
            this.m_tSubTime += dt;
            if (this.m_tSubTime >= AUTO_CLICK_TIME) {
                this.m_tSubStepTime += dt;
                if(this.m_tSubStepTime>0.1)
                {
                    this.onSubBtn();
                }
            }
        }
    },


    onAddStart()
    {
        cc.log("onAddStart");
        this.m_tAddTime = 0;
        this.m_tAddStepTime = 0;
        this.m_bAddUp = true;
    },

    onAddEnd()
    {
        cc.log("onAddEnd");
        if (this.m_tAddTime < AUTO_CLICK_TIME) {
            this.onAddBtn();
        }

        this.m_tAddTime = 0;
        this.m_tAddStepTime = 0;
        this.m_bAddUp = false;  
    },


    onAddCancel()
    {
        cc.log("onAddCancel");
        this.m_tAddTime = 0;
        this.m_tAddStepTime = 0;
        this.m_bAddUp = false;
    },

    onSubStart()
    {
        cc.log("onSubStart");
        this.m_tSubTime = 0;
        this.m_tSubStepTime = 0;
        this.m_bSubUp = true;
    },

    onSubEnd()
    {
        cc.log("onSubEnd");
        if (this.m_tSubTime < AUTO_CLICK_TIME) {
            this.onSubBtn();
        }

        this.m_tSubTime = 0;
        this.m_tSubStepTime = 0;
        this.m_bSubUp = false;  
    },


    onSubCancel()
    {
        cc.log("onSubCancel");
        this.m_tSubTime = 0;
        this.m_tSubStepTime = 0;
        this.m_bSubUp = false;
    },

    onAddBtn()
    {
        this.m_tAddStepTime = 0;

        if(this._defalutPercent == 100)
            return;

        if(this._value==this._max)
            return;

        var pro = this.getComponent(cc.Slider).progress
        this._value =  Math.min(this._max,this._value+this._step);
        if(this._max == this._min)
        {
            pro = 1;
            this.getComponent(cc.Slider).progress = pro
            this.getComponent(cc.ProgressBar).progress = pro;
            this.onSlider(this.getComponent(cc.Slider),true);
        }else
        {
            pro = Math.min(1, (this._value-this._min)/(this._max - this._min));
            this.getComponent(cc.Slider).progress = pro
            this.getComponent(cc.ProgressBar).progress = pro;
            this.onSlider(this.getComponent(cc.Slider),true);
        }
        
    },

    onSubBtn()
    {
        if(this._defalutPercent == 100)
            return;

        if(this._value==this._min)
            return;

        var pro = this.getComponent(cc.Slider).progress
        this._value =  Math.max(this._min,this._value-this._step);
        if(this._max == this._min)
        {
            pro = 1;
            this.getComponent(cc.Slider).progress = pro
            this.getComponent(cc.ProgressBar).progress = pro;
            this.onSlider(this.getComponent(cc.Slider),true);
        }else
        {
            pro = Math.max(0, (this._value-this._min)/(this._max - this._min));
            this.getComponent(cc.Slider).progress = pro
            this.getComponent(cc.ProgressBar).progress = pro;
            this.onSlider(this.getComponent(cc.Slider),true);
        }
    },

    // onHalfBottom(){
    //     this._value = Math.min(this._max,this._bottom/2);
    //     this.value_lbl.string = this._value;//this.convertNumToStr(this._value);
    //     let progress = this._value / this._max;
    //     this.getComponent(cc.Slider).progress = progress;
    //     // this.getComponent(cc.ProgressBar).progress = progress;
    // },

    //1/2底池  2/3底池 1底池
    onBottom(event,data){
        var v = parseInt(data);
        v = BOTTOM_ARRAY[v];
        this._value = Math.min(this._max,parseInt(v*texas_Data.Instance().m_totalBet) );
        this.onQuickAdd()
    },
    //5x大盲  4x大盲  3x大盲
    onBaseScore(event,data){
        var v = parseInt(data);
        this._value = Math.min(this._max,v*this._min);
        this.onQuickAdd()
    },


    onQuickAdd()
    {
        hall_audio_mgr.com_btn_click();
        // let value = this.getBetValue(this._value);
        if(this._value <=0)
        {
            cc.dd.PromptBoxUtil.show('RaiseError');
            return;
        }
        let sender = require('net_sender_texas');
        if (this._value < this._min)
        {
            cc.dd.PromptBoxUtil.show('RaiseError');
        }else
        {
            sender.Raise(this._value); // + this._min);
            this.onClose()
        }
        this.labelAdd.setText("RAISE")
    },

    onAllIn(){
        this._value = this._max;
        this.value_lbl.string = this._value;//this.convertNumToStr(this._value);
        let progress = 1;
        this.getComponent(cc.Slider).progress = progress;
        this.getComponent(cc.ProgressBar).progress = progress;
    },

    resetAddLabel()
    {
        this.labelAdd.setText("RAISE")
    },

    onEnter() {
        hall_audio_mgr.com_btn_click();
        // let value = this.getBetValue(this._value);
        if(this._value <=0)
        {
            cc.dd.PromptBoxUtil.show('RaiseError');
            return;
        }
        let sender = require('net_sender_texas');
        if(this._value == this._max)
        {
            sender.allIn();// + this._min);
            this.resetAddLabel();
        }else if (this._value < this._min)
        {
            cc.dd.PromptBoxUtil.show('RaiseError');
        }else
        {
            sender.Raise(this._value); // + this._min);
        }
    },

    getBetValue(num) {
        if (num > 99999999) {
            return Math.floor(num / 10000000) * 10000000;
        }
        else if (num > 9999) {
            return Math.floor(num / 1000) * 1000;
        }
        else {
            return num;
        }
    },

    onClose() {
        this.node.parent.parent.active = false;
    },

    // onTouchInput() {
    //     var input = cc.find('input', this.node.parent);
    //     input.getComponent(cc.EditBox).string = this._value.toString();
    //     input.active = true;
    // },

    onTextChanged(text, _editbox) {
        // let value = parseInt(text);
        // if (value < this._min) {
        //     _editbox.string = this._min.toString();
        // }
        // else if (value > this._max) {
        //     _editbox.string = this._max.toString();
        // }
    },

    //最小距离100
    // onTextDone(_editbox) {
    //     let value = parseInt(_editbox.string);
    //     if (value < this._min) {
    //         value = this._min;
    //     }
    //     else if (value > this._max) {
    //         value = this._max;
    //     }
    //     this._value = Math.floor(value / 100) * 100;
    //     this.value_lbl.string = this.convertNumToStr(this._value);
    //     let progress = (this._value - this._min) / (this._max - this._min);
    //     this.getComponent(cc.Slider).progress = progress;
    //     this.getComponent(cc.ProgressBar).progress = progress;
    //     _editbox.node.active = false;
    // },


});
