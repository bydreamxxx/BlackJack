var PlayerEvent = require("sdy_player_data").PlayerEvent;
var PlayerED = require("sdy_player_data").PlayerED;
var PlayerData = require("sdy_player_data").PlayerData;
var PlayerState = require("sdy_player_data").PlayerState;
var SdyColorSortValue = require('sdy_card_cfg').SdyColorSortValue;
var RoomData = require('sdy_room_data').RoomData;

var UserPlayerData = cc.Class({

    extends: PlayerData,

    s_userPlayer: null,

    statics: {

        Instance: function () {
            if (!this.s_userPlayer) {
                this.s_userPlayer = new UserPlayerData();
            }
            return this.s_userPlayer;
        },

        Destroy: function () {
            if (this.s_userPlayer) {
                this.s_userPlayer = null;
            }
        },
    },

    ctor: function () {

    },

    sortShouPai: function () {
        this.pokers.sort(RoomData.Instance().sortPokerCompare.bind(RoomData.Instance()));
    },

    /**
     * 花色已选
     */
    colorSelected: function (color) {
        this.sortShouPai();
        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_SELECTED, [this]);
    },

    /**
     * 收底牌
     * @param bottom_pokers
     */
    dealBottomPokers: function (bottom_pokers) {
        bottom_pokers.forEach(function (poker) {
            this.pokers.push(poker);
        }.bind(this));
        this.sortShouPai();

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_SHOUDIPAI, [this, bottom_pokers]);
    },

    /**
     * 已扣底牌
     * @param bottom_pokers
     */
    kouedBottomPokers: function (bottom_pokers) {
        bottom_pokers.forEach(function (poker) {
            cc.dd._.pull(this.pokers, poker);
        }.bind(this));
        this.sortShouPai();
        this.endCD();
        this.player_state = PlayerState.SDY_PLAYER_STATE_KOUED;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_KOUED, [this]);
    },

    /**
     * 已出牌
     * @param poker
     */
    pokerSended: function (poker) {
        cc.dd._.pull(this.pokers, poker);
        this.endCD();
        this.cur_send_poker = poker;
        this.player_state = PlayerState.SDY_PLAYER_STATE_SENDED;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_SENDED, [this]);
    },

    /**
     * 重新发手牌
     */
    dealHandPokers: function (pokers) {
        this.pokers = pokers;
        this.sortShouPai();
        this.player_state = PlayerState.SDY_PLAYER_STATE_INIT;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_CHONGXINFAPAI, [this]);
    },
});

module.exports = UserPlayerData;