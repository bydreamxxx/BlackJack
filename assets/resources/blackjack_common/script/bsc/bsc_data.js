var dd = cc.dd;

/**
 * 事件类型
 */
var BSC_Event = cc.Enum({
    BSC_FLUSH_INFO: 'bsc_flush_info',//大厅刷新列表
    BSC_BAO_MING: 'bsc_bao_ming',  //大厅报名
    BSC_TUI_SAI: 'bsc_tui_sai',  //退赛
    BSC_CHANG_NUM: 'bsc_chang_num',//人数的变化
    BSC_UPDATE_NUM: 'BSC_UPDATE_NUM',//更新人数
    BSC_BEGIN: 'bsc_begin',      //获得比赛场服务器
    BSC_ENTER_SCENE: 'bsc_enter_secen',//进入比赛场

    BSC_ZHANJI_INFO: 'bsc_zhanji_info',//比赛场战绩
    //-------------------------------------
    BSC_START: 'bsc_start', //开始
    BSC_WAITE: 'bsc_waite', //等待晋级
    BSC_END: 'bsc_end',   //比赛结算

    BSC_GO_HALL: 'bsc_go_hall',//返回大厅

    BSC_CLEAR_DESK: 'bsc_clear_desk',//清理桌子
    BSC_MATCH_UPDATA: 'BSC_MATCH_UPDATA',//更新比赛
    BSC_UPDATE_STATE: 'BSC_UPDATE_STATE',//更新状态
    Drop_Reward: 'Drop_Reward',     //掉落奖励

    PLAY_ROUND: 'bsc_play_round',//每局信息
    RANK_INFO: 'bsc_rank_info',//排名信息
    UPDATE_NUMFULL: 'bsc_update_numfull',//淘汰人数已满
    RECONNECT_LINE: 'bsc_reconnect_line',//重连排队
    GAME_END: 'bsc_game_end',//游戏结束
    SCORE_SHARE_RET: 'bsc_score_share_ret',//分享返回
    UPDATE_SCORE: 'bsc_update_score',//比赛场分享加积分
    SHOW_TIME: 'bsc_show_time',//比赛场显示倒计时
    IS_SHARED: 'bsc_is_shared',//是否分享过
    BSC_UPDATE_DETAIL: 'bsc_update_detail',//更新比赛详情
    BSC_REWARD_POOL_UPDATE: 'bsc_reward_pool_update',//奖池变化
    BSC_DINGSHI_HISTORY: 'bsc_dingshi_history',//定时赛战绩
    BSC_DINGSHI_HISTORY_DETAIL: 'bsc_dingshi_history_detail',//战绩详情
    BSC_DINGSHI_DEAD_RET: 'bsc_dingshi_dead_ret',//定时赛预赛复活消耗
    BSC_DINGSHI_REBORN_RET: 'bsc_dingshi_reborn_ret',//复活成功
    BSC_DINGSHI_LUNKONG: 'bsc_dingshi_lunkong',//定时赛轮空
    BSC_ROOM_WIN_RESULT: 'match_room_win_result',//金币比赛场输赢分数
});

/**
 * 事件管理
 */
var BSC_ED = new dd.EventDispatcher();

var BSC_Data = cc.Class({

    s_bsc_data: null,
    statics: {
        Instance: function () {
            if (!this.s_bsc_data) {
                this.s_bsc_data = new BSC_Data();
            }
            return this.s_bsc_data;
        },

        Destroy: function () {
            if (this.s_bsc_data) {
                this.s_bsc_data.clear();
                this.s_bsc_data = null;
            }
        },

    },
    ctor: function () {
        this._ActivList = [];
        this._AllNum = 0;//参赛人数
        //------------------比赛中------------------
        this._bsc_startData = null;
        this._bsc_zhanji = null;
        this._gameType = null;
        this._rankInfo = null;
    },

    /**
     * 设置每个类型的活动列表
     */
    setActivList: function (data) {
        var actData = {};
        actData.type = data.matchType;
        actData.infoList = data.matchListList;
        //增加收到开放时间倒计时的时间戳
        actData.infoList.forEach(function (item) {
            item.openStartTime = new Date().getTime();
        });
        this._ActivList.push(actData);
        BSC_ED.notifyEvent(BSC_Event.BSC_FLUSH_INFO, [actData]);
    },
    /**
     * 获取活动列表
     */
    getActListBytype: function (type) {
        for (var i in this._ActivList) {
            if (this._ActivList[i].type == type) {
                return this._ActivList[i];
            }
        }
        return null;
    },

    //获取比赛
    getActById: function (id) {
        for (var i in this._ActivList) {
            for (var j in this._ActivList[i].infoList) {
                if (this._ActivList[i].infoList[j].matchId == id) {
                    return this._ActivList[i].infoList[j];
                }
            }
        }
        return null;
    },

    updateMatchInfo(matchinfo) {
        for (var i in this._ActivList) {
            for (var j in this._ActivList[i].infoList) {
                if (this._ActivList[i].infoList[j].matchId == matchinfo.matchId) {
                    this._ActivList[i].infoList[j] = matchinfo;
                }
            }
        }
    },

    //重置报名状态
    resetSignStatus: function () {
        for (var i in this._ActivList) {
            for (var j in this._ActivList[i].infoList) {
                if (this._ActivList[i].infoList[j].isSign == true) {
                    this._ActivList[i].infoList[j].isSign = false;
                }
            }
        }
    },

    /**
     * 报名成功
     */
    baomingSucess: function (id) {
        // this.getActListBytype(id)
        this.getActById(id).isSign = true;
        BSC_ED.notifyEvent(BSC_Event.BSC_BAO_MING, id);
    },
    /**
     * 退赛成功
     */
    tuisaiSucess: function (id) {
        this.getActById(id).isSign = false;
        BSC_ED.notifyEvent(BSC_Event.BSC_TUI_SAI, id);
    },
    /**
     * 当前报名人数的变化
     */
    changNum: function (num) {
        this._AllNum = num;
        BSC_ED.notifyEvent(BSC_Event.BSC_CHANG_NUM, num);
    },

    updateNum: function (msg) {
        var match = this.getActById(msg.matchId);
        if (match) {
            match.num = msg.num;
            match.joinNum = msg.joinNum;
        }
        BSC_ED.notifyEvent(BSC_Event.BSC_UPDATE_NUM, msg);
    },

    /**
     * 获取人数
     */
    getChangNum: function () {
        return this._AllNum;
    },
    /**
     *进入比赛场
     */
    enterBisai: function (data) {
        BSC_ED.notifyEvent(BSC_Event.BSC_BEGIN, data);
        this.clearData();
    },

    /**
     * 比赛场战绩
     */
    bscZhanji: function (data) {
        this._bsc_zhanji = data;
        BSC_ED.notifyEvent(BSC_Event.BSC_ZHANJI_INFO, data);
    },

    /**
     * 更新比赛免费次数
     */
    updateMatchFreeNum: function (matchId, freeTimes) {
        var matchInfo = this.getActById(matchId);
        matchInfo.usedFreeSignTimes = freeTimes;
    },

    updateMatchState: function (matchId, matchState) {
        var matchInfo = this.getActById(matchId);
        if (matchInfo) {
            matchInfo.matchState = matchState;
        }
        BSC_ED.notifyEvent(BSC_Event.BSC_UPDATE_STATE, { matchId: matchId, matchState: matchState });
    },

    //TODO----------------------------------------比赛中数据--------------------------
    /**
     * 开始比赛
     */
    setBscStart: function (data) {
        this._bsc_startData = data;
        BSC_ED.notifyEvent(BSC_Event.BSC_START, data);
    },
    getBscStart: function () {
        return this._bsc_startData;
    },

    /**
     * 清除数据
     */
    clearData: function () {
        this._ActivList = [];
        this._AllNum = 0;//参赛人数
        this._bsc_startData = null;
        this._gameType = null;
        this._rankInfo = null;
        this._score = 0;
        this._nextRoundNum = null;
    },

    setGameType(gameType) {
        this._gameType = gameType;
    },

    getGameType() {
        return this._gameType;
    },

    setRankInfo(rankInfo) {
        this._rankInfo = rankInfo;
    },

    getRankInfo() {
        return this._rankInfo;
    },

    setScore(data) {
        this._score = data;
    },

    getScore() {
        return cc.dd._.isNumber(this._score) ? this._score : 0;
    }
});

module.exports = {
    BSC_Event: BSC_Event,
    BSC_ED: BSC_ED,
    BSC_Data: BSC_Data,
};
