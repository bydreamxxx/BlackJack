/**
 * Created by shen on 2017/8/19.
 */
/**
 * Created by shen on 2017/8/19.
 */

const dd = cc.dd;
const HallCommonObj = require('hall_common_data');
const HallCommonEd = HallCommonObj.HallCommonEd;
const HallCommonEvent = HallCommonObj.HallCommonEvent;
const itemcfg = require('item');

var propData = function (id, dataId, count, leftTime, detail) {//数据结构
    this.id = id;
    this.dataId = dataId;
    this.count = count;
    this.leftTime = leftTime;
    this.detail = detail;
};

const HallPropData = cc.Class({
    _instance: null,

    statics: {
        getInstance: function () {
            if (!this._instance) {
                this._instance = new HallPropData();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                this._instance = null;
            }
        },
    },

    properties: {
        /**
         * 道具列表
         */
        propList: [],
        /**
         * 更新红点
         */
        updateFlag: false,
    },

    /**
     * 获取指定道具数值
     * @param id
     * @private
     */
    _getPropCount: function (id) {
        var info = this._getPropInfo(id);
        if (info) {
            return info.count;
        }
        return 0;
    },

    /**
     * 获取道具信息  没有就新建
     */
    _getPropInfo: function (id) {
        for (var i = 0; i < this.propList.length; i++) {
            var data = this.propList[i];
            if (data.id == id) {
                return data;
            }
        }
    },

    /**
     * 根据item配置id获取道具信息
     * @param dataId
     * @private
     */
    getItemInfoByDataId: function (dataId) {
        for (var i = 0; i < this.propList.length; i++) {
            var data = this.propList[i];
            if (data.dataId == dataId) {
                return data;
            }
        }
        return null;
    },
    /**
     * 根据item配置类型获取道具信息
     * @param dataId
     * @private
     */
    getItemInfoByType: function (type) {
        var result = [];
        for (var i = 0; i < this.propList.length; i++) {
            var data = this.propList[i];
            var itemCfg = itemcfg.getItem(function (element) {
                if(element.key==data.dataId)
                    return true;
                else
                    return false;
            }.bind(this));

            if (itemCfg.type == type) {
                result.push(data);
            }
        }
        return result;
    },

    initData: function (list) {
        this.propList.splice(0, this.propList.length);
        for (var i in list) {
            this.updateProp(list[i], false);
        }
    },

    /**
     * 更新道具信息
     * @param data
     */
    updateProp: function (data, needSend) {
        var info = this._getPropInfo(data.itemid);
        if (info) {
            //info.itemDataId = data.itemDataId;
            //info.leftTime = data.validtime;
            this.updateFlag = data.cnt > info.count;
            info.count = data.cnt;
            if (data.expire)
                info.leftTime = data.expire;
        } else {//没有
            for (var i = this.propList.length - 1; i > -1; i--) {
                var item = this.propList[i];
                if (item.dataId == data.itemDataId) {
                    this.propList.splice(i, 1);
                }
            }
            var newInfo = new propData(data.itemid, data.itemDataId, data.cnt, data.validtime, '');
            this.propList.push(newInfo);
            this.updateFlag = true;
        }
        if (needSend) {
            HallCommonEd.notifyEvent(HallCommonEvent.UPDATA_PropData, data);
        }
    },

    /**
     * 获取金币数量
     */
    getCoin: function () {
        return HallCommonObj.HallCommonData.getInstance().coin;
    },

    /**
     * 获取钻石数量
     */
    getDiamond: function () {
        return HallCommonObj.HallCommonData.getInstance().diamond;
    },

    /**
     * 获取房卡数量
     */
    getRoomCard: function () {
        return HallCommonObj.HallCommonData.getInstance().roomCard;
    },

    /**
     * 获取红包数量
     */
    getRedBag: function () {
        return HallCommonObj.HallCommonData.getInstance().redBag;
    },

    /**
     * 获取元宝
     */
    getCommonGold: function () {
        return HallCommonObj.HallCommonData.getInstance().common_gold;
    },

    /**
     * 获取保险箱中的金币
     */
    getBankCoin: function () {
        return HallCommonObj.HallCommonData.getInstance().userBankGold_coin;
    },

    /**
     * 设置更新标签红点
     */
    setUpdateFlag: function (isUpdate) {
        this.updateFlag = isUpdate;
        if (!isUpdate)
            HallCommonEd.notifyEvent(HallCommonEvent.HALL_UPDATE_FLAG, this);
    },

    /**
     * 获取更新红点
     */
    getUpdateFlag: function () {
        let jishihongbao = this.getItemInfoByDataId(1099);
        if(jishihongbao && jishihongbao.count > 0){
            return true;
        }else{
            return this.updateFlag;
        }
    },

    /**
     * 更新玩家资产
     */
    updateAssets: function (msg) {
        var hall_common_data = HallCommonObj.HallCommonData.getInstance();
        switch (msg.moneyType) {
            case 0:
                if(msg.changeType == 115){
                    //todo
                    cc.dd._drawlottery_update_coin = msg;
                    return
                }
                this.updateFlag = msg.newValue > hall_common_data.coin ? true : this.updateFlag;
                hall_common_data.coin = msg.newValue;
                break;
            case 1:
                this.updateFlag = msg.newValue > hall_common_data.roomCard ? true : this.updateFlag;
                hall_common_data.roomCard = msg.newValue;
                break;
            case 2:
                hall_common_data.diamond = msg.newValue;
                break;
            case 3:
                this.updateFlag = msg.newValue > hall_common_data.redBag ? true : this.updateFlag;
                hall_common_data.redBag = msg.newValue;
                break;
            case 4:
                hall_common_data.gold = msg.newValue;
                break;
            case 5:
                this.updateFlag = msg.newValue > hall_common_data.common_gold ? true : this.updateFlag;
                hall_common_data.common_gold = msg.newValue;
                break;
            case 6:
                hall_common_data.phonePay = msg.newValue;
                break;
            case 7:
                if (msg.changeValue > 0)
                    this.updateFlag = true;
                break;
        }
        HallCommonEd.notifyEvent(HallCommonEvent.HALL_UPDATE_ASSETS, this);
    },
});

module.exports = {
    HallPropData: HallPropData,
};