var wheelRaceED = new cc.dd.EventDispatcher();

var wheelRaceEvent = cc.Enum({
    WHEEL_RACE_REFRESH: 'wheel_race_refresh',
});

var wheelRaceData = cc.Class({
    statics: {
        m_instance: null,

        Instance: function () {
            if (this.m_instance == null) {
                this.m_instance = new wheelRaceData();
            }
            return this.m_instance;
        },

        Destroy: function () {
            if (this.m_instance) {
                this.m_instance = null;
            }
        },
    },
    properties: {
        // 比赛列表
        _wheelRaceList:[],
        // 排行榜列表
        _wheelRankList:[],
        // 自己排名
        _selfRank: -1,
    },

    initData: function (data) {
        var self = this;
        self._wheelRaceList.splice(0, self._wheelRaceList.length);
        data.raceListList.forEach(function (item) {
            self._wheelRaceList.push(item)
        });
        self._wheelRankList.splice(0, self._wheelRankList.length);
        data.rankListList.forEach(function (item) {
            self._wheelRankList.push(item)
        });
        this._selfRank = data.rank
        wheelRaceED.notifyEvent(wheelRaceEvent.WHEEL_RACE_REFRESH, null);
    },

    getWheelRaceList: function () {
        return this._wheelRaceList;
    },

    getWheelRankList: function () {
        return this._wheelRankList;
    },

    // 根据游戏类型获取转轮赛数据
    getRaceByGameType: function(type) {
        for(let i=0; i<this._wheelRaceList.length; i++) {
            if(this._wheelRaceList.race_list[i].game_type === type) {
                return this._wheelRaceList[i]
            }
        }
    },
});

module.exports = {
    wheelRaceED: wheelRaceED,
    wheelRaceEvent: wheelRaceEvent,
    wheelRaceData: wheelRaceData,
}

