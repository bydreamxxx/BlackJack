
/**
 * 事件类型
 */
var GameEvent = cc.Enum({
    SDY_GAME_EVENT_OTHER_CALLING:                 'sdy_game_event_other_calling',              //其他玩家叫分中
    SDY_GAME_EVENT_OTHER_SELECTING:               'sdy_game_event_other_selecting',            //其他玩家选主中
});

/**
 * 事件管理
 */
var GameED = new cc.dd.EventDispatcher;

var GameData = cc.Class({

    s_gameData: null,

    statics: {

        Instance: function () {
            if (this.s_gameData == null) {
                this.s_gameData = new GameData();
            }
            return this.s_gameData;
        },

        Destroy: function () {
            if (this.s_gameData) {
                this.s_gameData = null;
            }
        },
    },

    ctor: function () {

    },

    clear: function () {

    },

});

module.exports = {
    GameEvent:GameEvent,
    GameED:GameED,
    GameData:GameData,
};
