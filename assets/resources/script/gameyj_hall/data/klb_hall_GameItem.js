/**
 * Created by wj on 2017/12/14.
 */
const GameType = cc.Enum({
    POKER: "poker",        //扑克
    MAJIANG: "majiang",      //麻将
    VIP_FUNCTION:"vip" ,   //VIP功能
    RedBag_FUNCTION:'red_bag', //抢红包
    ADD_GAME: 'add_game', //添加游戏
    BOCAI: "bo_cai",//博彩
    DUOBAO: "duobao",//夺宝赛
    
});

var GameItem = cc.Class({

    properties:{

        /**
         * game_id
         */
        _game_id: "1",
        game_id: {
            get: function () {return this._game_id;},
            set: function (value) {this._game_id = value;},
        },

        /**
         * name
         */
        _name: "name",
        name: {
            get: function () {return this._name;},
            set: function (value) {this._name = value;},
        },

        /**
         * type
         */
        _type: "type",
        type: {
            get: function () {return this._type;},
            set: function (value) {this._type = value;},
        },

        /**
         * frameName
         */
        _frameName: "frameName",
        frameName: {
            get: function () {return this._frameName;},
            set: function (value) {this._frameName = value;},
        },

        /**
         * 游戏监听脚本名称
         */
        _gameScriptName: "",
        gameScriptName: {
            get: function () {return this._gameScriptName;},
            set: function (value) {this._gameScriptName = value;},
        },

        /**
         * room type
         */
        _roomType: "roomType",
        roomType: {
            get: function () {return this._roomType;},
            set: function (value) {this._roomType = value;},
        },
        /**
         * 是否开启
         */
        _isOpen: "isOpen",
        isOpen: {
            get: function get() {
                return this._isOpen;
            },
            set: function set(value) {
                this._isOpen = value;
            }
        },
        /**
         * 是否为热门游戏
         */
        _isHot: 'isHot',
        isHot:{
            get: function get() {
                return this._isHot;
            },
            set: function set(value) {
                this._isHot = value;
            }
        },

        /**
         * shadowName
         */
        _shadowName: "shadowName",
        shadowName: {
            get: function () {return this._shadowName;},
            set: function (value) {this._shadowName = value;},
        },

    },

    ctor: function (...params) {
        this.game_id = params[0];
        this.name = params[1];
        this.type = params[2];
        this.frameName = params[3];
        this.gameScriptName = params[4];
        this.roomType = params[5];
        this.isOpen = params[6];
        this.isHot = params[7];
        this.shadowName = params[8];
    },

    toString: function () {
        cc.log("game_id:"+this.game_id+" name:"+this.name+" type:"+this.type+" gameScriptName:"+this.gameScriptName+" roomType"+this.roomType);
    },
});

module.exports = {
    GameType:GameType,
    GameItem:GameItem,
};
