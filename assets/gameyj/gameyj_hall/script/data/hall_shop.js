// create by wj 2018/1/13
var shopED = new cc.dd.EventDispatcher();

var shopEvent = cc.Enum({
    SHOP_OPEN_BUY: 'shop_open_buy',
    SHOP_EXCHANGE_RECORD: 'shop_exchange_record',
    ACTIVE_EXCHANGE_RECORD: 'active_exchange_record',
    REFRESH_DATA: 'REFRESH_DATA',
});

var shopData = cc.Class({
    statics: {
        s_shop: null,

        Instance: function () {
            if (this.s_shop == null) {
                this.s_shop = new shopData();
            }
            return this.s_shop;
        },

        Destroy: function () {
            if (this.s_shop) {
                this.s_shop = null;
            }
        },
    },
    properties: {
        _PropList: [],
        _CoinList: [],
        _GoldList: [],
        _ActiveList: [],
    },

    initData: function (list) {
        var self = this;
        self._PropList.splice(0, self._PropList.length);
        self._CoinList.splice(0, self._CoinList.length);
        self._GoldList.splice(0, self._GoldList.length);
        self._ActiveList.splice(0, self._ActiveList.length);

        cc._firstBuyId = null;
        list.forEach(function (item) {
            if (item.type == 2) {
                self._PropList.push(item);
            } else if (item.type == 3 || item.type == 4) {
                self._CoinList.push(item);
                if (item.type == 4) {
                    cc._firstBuyId = item.id;
                }
            } else if (item.type == 5) {
                self._GoldList.push(item);
            } else if (item.type == 6) {
                self._ActiveList.push(item);
            }
        });
    },

    getPropList: function () {
        return this._PropList;
    },

    getCoinList: function () {
        return this._CoinList;
    },

    getGoldList: function () {
        return this._GoldList;
    },
    //根据类型获取元宝兑换列表数据
    getYuanBaoExchangeListByType: function (ntype) {
        var list = [];
        for (var i = 0; i < this._GoldList.length; i++) {
            if (this._GoldList[i].subType == ntype)
                list.push(this._GoldList[i]);
        }
        return list;
    },

    //根据id获取兑换元宝到数据
    getYuanBaoItemDataById: function (itemId) {
        for (var i = 0; i < this._CoinList.length; i++) {
            if (this._GoldList[i].id == itemId)
                return this._GoldList[i];
        }
    },

    //根据类型获取元宝兑换列表数据
    getActiveExchangeListByType: function (ntype) {
        var list = [];
        for (var i = 0; i < this._ActiveList.length; i++) {
            if (this._ActiveList[i].subType == ntype)
                list.push(this._ActiveList[i]);
        }
        return list;
    },

    //根据id获取兑换元宝到数据
    getActiveItemDataById: function (itemId) {
        for (var i = 0; i < this._ActiveList.length; i++) {
            if (this._ActiveList[i].id == itemId)
                return this._ActiveList[i];
        }
    },

    openShopBuy: function () {
        shopED.notifyEvent(shopEvent.SHOP_OPEN_BUY, null);
    },

    getFirstPayItem: function () {
        var result = null;
        this._CoinList.forEach(function (item) {
            if (item.type == 4) {
                result = item;
            }
        });
        return result;
    },

    getCoinItem: function (id) {
        var result = null;
        this._CoinList.forEach(function (item) {
            if (item.id == id) {
                result = item;
            }
        });
        return result;
    },


    
    getPropItemByItemID: function (itemid) {
        var result = null;
        this._PropList.forEach(function (item) {
            if (item.itemid == itemid) {
                result = item;
                return result
            }
        });
        return result;
    },

    getPropItemByID: function (id) {
        var result = null;
        this._PropList.forEach(function (item) {
            if (item.id == id) {
                result = item;
                return result
            }
        });
        return result;
    },
});

module.exports = {
    shopED: shopED,
    shopEvent: shopEvent,
    shopData: shopData,

}

