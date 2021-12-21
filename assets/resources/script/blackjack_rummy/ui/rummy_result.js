const userInfo = require("rummy_result_userinfo");
const GAME_STATE = require("RummyData").GAME_STATE;
const RummyData = require("RummyData").RummyData.Instance();
const RummyED = require("RummyData").RummyED;
const RummyEvent = require("RummyData").RummyEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        userInfoList: [userInfo],
        tipsLabel: require("LanguageLabel"),
    },

    editor:{
        menu:"Rummy/rummy_result"
    },

    onLoad(){
        RummyED.addObserver(this);
        this.lastTime = 10000;
    },

    onEnable(){
        this.lastTime = RummyData.lastTime;
        if(this.startUpdateTime){
            this.lastTime -= (new Date().getTime() - this.startUpdateTime.getTime()) / 1000;
        }
    },

    onDisable(){
    },

    onDestroy() {
        RummyED.removeObserver(this);
    },

    update(dt){
        if(RummyData.state === GAME_STATE.WAITING){
            if(this.lastTime >= 0){
                this.lastTime -= dt;

                this.tipsLabel.setText('rummy_text25', '', '', Math.floor(this.lastTime));
            }else{
                this.startUpdateTime = null;
                this.node.active = false;
            }
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case RummyEvent.UPDATE_UI:
            case RummyEvent.UPDATE_STATE:
                this.updateUI();
                break;
        }
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        this.node.active = false;
    },

    setData(resultList){
        this.userInfoList.forEach(userInfo=>{
            userInfo.clear();
        })

        for(let i = 0; i < resultList.length; i++){
            this.userInfoList[i].setData(resultList[i]);
        }
    },

    updateUI(){
        if(RummyData.state === GAME_STATE.WAITING){
            this.startUpdateTime = new Date();
            this.lastTime = RummyData.lastTime;
        }
    },
});
