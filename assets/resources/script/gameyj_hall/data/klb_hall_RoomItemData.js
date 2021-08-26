module.exports = cc.Class({
    properties: {
        _roomId: 0,
        roomId: {
            get: function () {
                return this._roomId;
            },
            set: function (value) {
                this._roomId = value;
            }
        },

        _roomType: 0,
        roomType: {
            get: function () {
                return this._roomType;
            },
            set: function (value) {
                this._roomType = value;
            }
        },

        _roomTitle: '',
        roomTitle: {
            get: function () {
                return this._roomTitle;
            },
            set: function (value) {
                this._roomTitle = value;
            }
        },

        _roomNumberOfPeople: 0,
        roomNumberOfPeople: {
            get: function () {
                return this._roomNumberOfPeople;
            },
            set: function (value) {
                this._roomNumberOfPeople = value;
            }
        },

        _minEnterCoin: 0,
        minEnterCoin: {
            get: function () {
                return this._minEnterCoin;
            },
            set: function (value) {
                this._minEnterCoin = value;
            }
        },

        _roomReward: 0,
        roomReward: {
            get: function () {
                return this._roomReward;
            },
            set: function (value) {
                this._roomReward = value;
            }
        },

        _roomDesc: '',
        roomDesc: {
            get: function () {
                return this._roomDesc;
            },
            set: function (value) {
                this._roomDesc = value;
            }
        }
    },

    ctor: function (...params) {
        this.roomId = params[0].fangjianid;
        this.roomType = params[0].fangjiantype;
        this.roomTitle = params[0].fangjiantitle;
        this.roomNumberOfPeople = params[0].fangjianrenshu;
        this.minEnterCoin = params[0].fangjianentercoin;
        this.roomReward = params[0].fangjianjiangli;
        this.roomDesc = params[0].fangjiandesc;
    }


});
