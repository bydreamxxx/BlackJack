// 转轮赛报名
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var wheelRaceData = require('hall_wheelRace').wheelRaceData.Instance();
var wheelRaceED = require('hall_wheelRace').wheelRaceED;
var wheelRaceEvent = require('hall_wheelRace').wheelRaceEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        rankContext: cc.Node,
        rankItem: cc.Node,
        coinLabel: cc.Label,

        competeList: cc.Node
    },

    // 请求转轮赛数据
    requestWheelRaceInfo() {
        var msg = new cc.pb.room_mgr.msg_match_race_list_req();
        // msg.setGameType(data.hallGameid);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_match_race_list_req, msg, "msg_match_race_list_req", true);
    },
    // 关闭
    onClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // 打开规则
    onOpenRule() {

    },
    loadData() {
        wheelRaceED.addObserver(this);
        this.coinLabel.string = this.changeNumToCHN(HallPropData.getCoin()) || 0
    },
    loadRank(rank_list) {
        for(let i=0; i<rank_list.length; i++) {
            let item = cc.instantiate(this.rankItem);
            item.active=true
            item.parent = this.rankContext;
            item.x = 0;
            item.y = i*100; 
            let header = item.getComponent('BlakJack_Hall_Race_Header')
            header.setData(rank_list[i])
        }
    },
    loadCompete(race_list) {
        for(let i=0; i<race_list.length; i++) {
            let item = this.competeList[i].getComponent('BlackJack_Hall_Weel_item')
            item.setData(race_list[i])
        }
    },
    refreshUI () {
        let raceData = wheelRaceData.getRaceByGameType(0)
        this.loadRank(raceData.rank_list)
        this.loadCompete(raceData.race_list)
    },

    changeNumToCHN: function (num) {
        var str = '';
        if (LanguageMgr.getKind() == "ZH") {
            if (num >= 100000000) {
                str = (num / 100000000.00).toFixed(1) + '亿';
            } else if (num >= 10000000) {
                str = (num / 10000000.00).toFixed(1) + '千万';
            } else if (num >= 100000) {
                str = (num / 10000.00).toFixed(1) + '万';
            } else {
                str = num;
            }
        } else if (LanguageMgr.getKind() == "TC") {
            if (num >= 100000000) {
                str = (num / 100000000.00).toFixed(1) + '億';
            } else if (num >= 10000000) {
                str = (num / 10000000.00).toFixed(1) + '千萬';
            } else if (num >= 100000) {
                str = (num / 10000.00).toFixed(1) + '萬';
            } else {
                str = num;
            }
        } else {
            if (num >= 1000000000) {
                str = (num / 1000000000.00).toFixed(1).toLocaleString('en-US') + 'B';
            } else if (num >= 10000000) {
                str = (num / 1000000.00).toFixed(1).toLocaleString('en-US') + 'M';
            } else if (num >= 10000) {
                str = (num / 1000.00).toFixed(1).toLocaleString('en-US') + 'K';
            } else {
                str = num.toLocaleString('en-US');
            }
        }

        return str;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.loadData()
    },
    /**
     * 事件处理
     * @param event
     * @param data
     */
     onEventMessage: function (event, data) {
        dd.NetWaitUtil.close();
        switch (event) {
            case wheelRaceEvent.WHEEL_RACE_REFRESH: // 转轮赛数据更新
                this.refreshUI();
                break;
            default:
                break;
        }
    },

    start() {

    },

    onDestroy: function () {
        wheelRaceED.removeObserver(this);
    },

    // update (dt) {},
});
