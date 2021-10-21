const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_sendMsg = require('bsc_sendMsg');
const Bsc = require('bsc_data');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

const MATCH_ENUM = cc.Enum({
    QUICK_MATCH: 124,
});

cc.Class({
    extends: cc.Component,

    properties: {
        quickMatchNode: cc.Node,
        passMatchNode: cc.Node,

        quickMatchDetailNode: cc.Node,
        passMatchDetailNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Bsc_ED.addObserver(this);
        HallCommonEd.addObserver(this);

        this.quickMatchNode.active = false;
        this.passMatchNode.active = false;
        this.quickMatchDetailNode.active = false;
        this.passMatchDetailNode.active = false;

        this.schedule(this.refreshOpenedJoinNum.bind(this), 10);
    },

    onDestroy(){
        Bsc_ED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    start () {

    },

    // update (dt) {},

    flushScrollItemToNet(data){
        this.quickMatchNode.active = false;
        this.passMatchNode.active = false;

        this.infoList = [];
        for(let i = 0; i < data.infoList.length; i++){
            if(data.infoList[i].matchId == MATCH_ENUM.QUICK_MATCH){
                this.infoList.push(data.infoList[i]);
                this.quickMatchNode.active = true;
                this.updateItemInfo(data.infoList[i], this.quickMatchNode)
            }
        }

        if(this.infoList <= 0){
            cc.dd.PromptBoxUtil.show('NOT YET OPEN,敬请期待！');
        }
    },

    refreshOpenedJoinNum() {
        if (this.infoList) {
            var curTime = new Date().getTime();
            for (var i = 0; i < this.infoList.length; i++) {
                if (this.infoList[i].matchClass == 2) {
                    if (this.infoList[i].openseconds - parseInt((curTime - this.infoList[i].openStartTime) / 1000) < 0) {
                        this.infoList[i].isSign = false;
                        this.infoList[i].joinNum = 0;
                    }
                }
                if(this.infoList[i].matchId == MATCH_ENUM.QUICK_MATCH){
                    this.updateItemInfo(this.infoList[i], this.quickMatchNode)
                }
            }
        }
    },

    sendGetMatch: function (type) {
        Bsc_sendMsg.getActByType(type);
    },

    showQuickMatchDetail(){
        var matchId = MATCH_ENUM.QUICK_MATCH;
        var obj = Bsc.BSC_Data.Instance().getActListBytype(1);
        if (obj) {
            var data = obj.infoList;
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    if (matchId == data[i].matchId) {
                        this.quickMatchDetailNode.active = true;
                        this.quickMatchDetailNode.getComponent('klb_match_detail').showDetail(data[i]);
                        break;
                    }
                }
            }
        }
    },

    showPassMatchDetail(){

    },

    signBtnCallBack: function (event) {
        hall_audio_mgr.com_btn_click();
        if (event.target.tag.isSign) {
            var obj = Bsc.BSC_Data.Instance().getActListBytype(1);
            if (obj) {
                var data = obj.infoList;
                if (data && data.length) {
                    var matchdata = data.find(function (x) { return x.matchId == event.target.tag.matchId });
                    if (matchdata) {
                        if (matchdata.num >= matchdata.openSignNum)
                            return;
                    }

                }
            }
            Bsc_sendMsg.tuiSai(event.target.tag.matchId);
        } else {
            if (event.target.tag.matchClass == 2 && event.target.tag.matchState == 6)
                Bsc_sendMsg.zhongtujiaru(event.target.tag.matchId);
            else
                Bsc_sendMsg.baoming(event.target.tag.matchId);
        }
    },

    updateItemInfo(data, node){
        let desc = cc.find('desc', node).getComponent(cc.Label);
        desc.string = data.describe;
        let timeDesc = cc.find('timeDesc', node).getComponent(cc.Label);
        timeDesc.string = data.opentime;
        if(data.signFee > 0){
            let enter = cc.find('enter', node).getComponent(cc.Label);
            enter.string = data.signFee.toString() + '金币入';
        }

        let role_count = cc.find('role_count', node).getComponent(cc.Label);
        role_count.string = data.joinNum;
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case Bsc_Event.BSC_FLUSH_INFO://刷行
                this.flushScrollItemToNet(data[0]);
                break;
            case Bsc_Event.BSC_BAO_MING:
                if(this.infoList){
                    this.infoList.forEach((item)=>{
                        if(item.matchId == data){
                            item.isSign = true;
                        }
                    })
                }
                this.refreshOpenedJoinNum();
                break;
            case Bsc_Event.BSC_TUI_SAI:
                //cc.dd.PromptBoxUtil.show('取消报名成功!');
                if(this.infoList){
                    this.infoList.forEach((item)=>{
                        if(item.matchId == data){
                            item.isSign = false;
                        }
                    })
                }
                this.refreshOpenedJoinNum();
                break;
            case Bsc_Event.BSC_UPDATE_NUM:
                if (!cc.dd.Utils.isNull(this.infoList)) {
                    for (var i = 0; i < this.infoList.length; i++) {
                        if (this.infoList[i].matchId == data.matchId) {
                            this.infoList[i].joinNum = data.joinNum;
                        }
                    }
                }

                this.refreshOpenedJoinNum();
                break;
            case Bsc_Event.BSC_MATCH_UPDATA:
                this.sendGetMatch(1);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.quickMatchDetailNode.active = false;
                this.passMatchDetailNode.active = false;
                Bsc.BSC_Data.Instance().clearData();
                this.sendGetMatch(1);
                break;
        }
    },

    onClickBack(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickQuickMatch(){
        hall_audio_mgr.com_btn_click();
        this.showQuickMatchDetail();
    },

    onClickPassMatch(){

    }
});
