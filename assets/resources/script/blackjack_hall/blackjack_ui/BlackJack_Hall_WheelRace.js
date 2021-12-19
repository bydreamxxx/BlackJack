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
        rulePanel: cc.Node,

        competeList: [cc.Node],
        rankItemHeight: 100,
    },

    // 请求转轮赛数据
    requestWheelRaceInfo() {
        var msg = new cc.pb.race.msg_match_race_list_req();
        // msg.setGameType(data.hallGameid);
        cc.gateNet.Instance().sendMsg(cc.netCmd.race.cmd_msg_match_race_list_req, msg, "msg_match_race_list_req", true);
    },
    // 关闭
    onClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // 打开规则
    onOpenRule() {
        hall_audio_mgr.com_btn_click();
        this.rulePanel.active = true
    },
    onCloseRule() {
        hall_audio_mgr.com_btn_click();
        this.rulePanel.active = false;
    },
    loadData() {
        wheelRaceED.addObserver(this);
        this.coinLabel.string = cc.dd.Utils.getNumToWordTransform(HallPropData.getCoin()) || 0
    },
    loadRank(rank_list) {
        for(let i=0; i<rank_list.length; i++) {
            let item = cc.instantiate(this.rankItem);
            item.active = true;
            item.parent = this.rankContext;
            item.x = 0;
            // item.y = -i*this.rankItemHeight - this.rankItemHeight/2; 
            let header = item.getComponent('BlakJack_Hall_Race_Header')
            header.setData(rank_list[i])
        }
        this.rankContext.height = rank_list.length*this.rankItemHeight
    },
    loadCompete(race_list) {
        for(let i=0; i<race_list.length; i++) {
            let item = this.competeList[i].getComponent('BlackJack_Hall_Wheel_item')
            item.setData(race_list[i])
        }
    },
    refreshUI () {
        let raceData = wheelRaceData.getRaceByGameType(0)
        // raceData = {
        //     rank_list:[
        //         {
        //             rank: 1,
        //             user_id: 1,
        //             name: 'jack',
        //             head_url: '3099.png',
        //             score: 147
        //         },
        //         {
        //             rank: 2,
        //             user_id: 2,
        //             name: 'tom',
        //             head_url: '3098.png',
        //             score: 234
        //         },
        //         {
        //             rank: 2,
        //             user_id: 2,
        //             name: 'tom',
        //             head_url: '3097.png',
        //             score: 234
        //         },
        //         {
        //             rank: 2,
        //             user_id: 2,
        //             name: 'tom',
        //             head_url: '3096.png',
        //             score: 234
        //         },
        //         {
        //             rank: 2,
        //             user_id: 2,
        //             name: 'tom',
        //             head_url: '3095.png',
        //             score: 234
        //         },
        //         {
        //             rank: 2,
        //             user_id: 2,
        //             name: 'tom',
        //             head_url: '3094.png',
        //             score: 234
        //         }
        //     ],
        //     race_list:[{
        //         sign_fee: {type:0, num: 100},
        //         pool_num: 777,
        //         join_num: 845,
        //         game_type: 0
        //     },
        //     {
        //         sign_fee: {type:0, num: 200},
        //         pool_num: 888,
        //         join_num: 845,
        //         game_type: 1
        //     },
        //     {
        //         sign_fee: {type:0, num: 300},
        //         pool_num: 999,
        //         join_num: 845,
        //         game_type: 2
        //     }]
        // }
        this.loadRank(raceData.rank_list)
        this.loadCompete(raceData.race_list)
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.loadData()
        // this.refreshUI()
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
