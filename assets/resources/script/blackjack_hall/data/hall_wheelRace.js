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
        _wheelRaceList:[]
    },

    initData: function (list) {
        var self = this;
        self._wheelRaceList.splice(0, self._wheelRaceList.length);
        list.forEach(function (item) {
            self._wheelRaceList.push(item)
        });
        wheelRaceED.notifyEvent(wheelRaceEvent.WHEEL_RACE_REFRESH, null);
    },

    getWheelRaceList: function () {
        return this._wheelRaceList;
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

