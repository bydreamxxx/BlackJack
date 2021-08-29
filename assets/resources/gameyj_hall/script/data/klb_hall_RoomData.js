const dd = cc.dd;
const HallRoomItemData = require("klb_hall_RoomItemData")

const hallRoomEventDispatcher = new dd.EventDispatcher();

const HallRoomDataEvent = cc.Enum({
    GAME_RECONNECT:             'hall_room_game_reconnect',         //游戏重联
    INIT_ROOM_LIST:             'hall_room_data_init_room',         //房间列表初始化
    GAME_STATE:                 'hall_room_data_game_state',//游戏状态
    INIT_GAME_RECODE:           'hall_room_data_init_game_recode',  //游戏战绩初始化
    INIT_ROOM_URL:              'hall_room_data_init_game_url',  //游戏服务器URL初始化
});

const HallRoomsData = cc.Class({

    statics:{
        _instance:null,
        instance:function () {
            if(null === this._instance){
                this._instance = new HallRoomsData();
            }
            return this._instance;
        },

        destroy:function () {
            this._instance = null;
        }
    },

    properties: {
        backRoom:0,
    },

    ctor:function () {

    },

    initRoomList:function (msg) {
        cc.dd.NetWaitUtil.close();        
        // this._roomItemList = [];
        // this._roomGameId = msg.hallGameid;
        // const self = this;
        // msg.roomlistList.forEach(function (item) {
        //     self._roomItemList.push(new HallRoomItemData(item));
        // });
        hallRoomEventDispatcher.notifyEvent(HallRoomDataEvent.INIT_ROOM_LIST, msg);
    }

});

module.exports = {
    HallRoomsData : HallRoomsData,
    HallRoomDataEvent : HallRoomDataEvent,
    HallRoomEventDispatcher : hallRoomEventDispatcher,
};