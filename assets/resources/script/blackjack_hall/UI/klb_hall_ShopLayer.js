/**
 * 商城的所有数据来自配置表
 */
const dd = cc.dd;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

const shopConfig = require('shop');
var hall_prefab = require('hall_prefab_cfg');
var hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
var shop_data = require('hall_shop').shopData.Instance();

var shopEd = require('hall_shop').shopED;
var shopEvent = require('hall_shop').shopEvent;
var HallCommonObj = require('hall_common_data');
var hallData = HallCommonObj.HallCommonData.getInstance();
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;

const data_vip = require('vip');

const hwShopList = [1001, 1002, 1003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 3002, 3003, 3005, 3006, 3007, 3008, 3009, 3010, 3011, 3012, 3013, 3014, 3015, 3016, 3017, 3018, 3019, 3020, 3021, 3033];

let shop = cc.Class({
    extends: cc.Component,

    properties: {
        coinContentNode: cc.Node, //金币列表
        propContentNode: cc.Node, //道具列表
        jdCardNode: cc.Node,//京东卡兑换
        jdCardContentNode: cc.Node,
        coinScroll: cc.Node,
        propScroll: cc.Node,
        spaceX: 10,
        spaceY: 10,
        itemWidth: 240,
        itemHeight: 304,
        togglList: [cc.Toggle],
        toggleBgList: [cc.Node], //标签背景节点
        itemList: [],
        coinLabel: cc.Label,
        // descLabel: cc.Label,
        vipCurLabel: cc.Label,
        vipLevel: cc.Label,
        vipNextLevel: cc.Label,
        levelDesc: cc.Label,
        vipPB: cc.ProgressBar,
        gold: cc.Label,

        normalNode: cc.Node, //金币/道具兑换界面
        exchangeNode: cc.Node,//元宝兑换
        yuanBaoContentNode: cc.Node, //元宝列表父节点
        yuanBaospaceX: 15,
        yuanBaospaceY: 10,
        yuanBaoitemWidth: 326,
        yuanBaoitemHeight: 256,

        recordNode: cc.Node, //兑换记录节点
        exchangeListNode: cc.Node, //兑换列表节点
        bottomNode: cc.Node,

        cardNode: cc.Node,//卡密兑换
        cardEditBox: cc.EditBox,

        packageNode: cc.Node,//礼包
    },

    // use this for initialization
    onLoad: function () {
        // var tempCoin = [];
        // var tempYuanBao = [];
        // var tempProp = [];
        // for(var i = 0; i < shopConfig.items.length; i++){
        //     var itemInfo = shopConfig.items[i];
        //     if(itemInfo){
        //         if(itemInfo.type == 2){
        //             tempProp.push(itemInfo);
        //         }else if(itemInfo.type == 3){
        //             tempCoin.push(itemInfo);
        //         }else if(itemInfo.type == 4){
        //             tempYuanBao.push(itemInfo);
        //         }
        //     }
        // }
        shopEd.addObserver(this);
        HallCommonEd.addObserver(this);

        this._PropData = shop_data.getPropList();

        // if(hallData.regChannel != cc.dd.jlmj_enum.Login_Type.ACCOUNT){
        //     this._PropData = this._PropData.filter(function (item) {
        //         return item.itemid !== 1102;
        //     });
        // }

        this._CoinData = shop_data.getCoinList();
        this.coinLabel.string = this.changeNumToCHN(hall_prop_data.getCoin());
        // var icon = this.coinLabel.node.parent.getChildByName('icon');
        // if (icon)
        //     icon.getComponent(cc.Animation).play();

        this.gold.string = this.changeNumToCHN(hall_prop_data.getCommonGold()) || '0';
        // var goldicon = this.gold.node.parent.getChildByName('icon');
        // if (goldicon && goldicon.activeInHierarchy)
        //     goldicon.getComponent(cc.Animation).play();
        this.updateVIPLevel();
        this.updateFirstBuy();

        this.bottomNode.active = false;

        if (cc._applyForPayment) {
            this.togglList[1].node.active = false;
            this.togglList[3].node.active = false;
            this.togglList[4].node.active = false;
        }

        if (cc._isHuaweiGame || cc._isBaiDuPingTaiGame) {
            for (var i = 0; i < this.togglList.length; i++) {
                if (i != 2 && i != 1) {
                    this.togglList[i].node.active = false;
                }
            }
            var share = cc.find('klb_hall_mainui_userInfo/topNode/layout/share', this.node);
            share && (share.active = false);
        }
    },

    start() {
        this.setUserInfo(hallData);
    },

    onDestroy: function () {
        shopEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    updateVIPLevel: function () {
        var vipdataCur = data_vip.getItem(function (element) {
            return element.key == hallData.vipLevel;
        }.bind(this))

        var vipdataNext = data_vip.getItem(function (element) {
            return element.key == (hallData.vipLevel + 1);
        }.bind(this))

        this.vipCurLabel.string = hallData.vipLevel;
        this.vipLevel.string = hallData.vipLevel;
        if (vipdataNext) {
            this.vipNextLevel.string = hallData.vipLevel + 1;
            var dis = vipdataNext.exp - hallData.vipExp;
            this.levelDesc.string = '再充值' + dis + '元, 即可成为VIP' + (hallData.vipLevel + 1);
            this.vipPB.progress = hallData.vipExp / vipdataNext.exp;
        }
        else {
            this.vipNextLevel.string = hallData.vipLevel;
            this.levelDesc.string = 'VIP已达到最大等级';
            this.vipPB.progress = 1.0;
        }


    },

    /**
     * 跳转到指定页面
     */
    gotoPage: function (type) {
        if (type == 'FK') {
            this.propBtnCallBack();
            this.togglList[1].isChecked = true;
            this.togglList[2].isChecked = false;
            this.togglList[0].isChecked = false;
            this.togglList[3].isChecked = false;
            this.togglList[4].isChecked = false;
        } else if (type == 'YB') {
            this.goldBtnCallBack();
            this.togglList[1].isChecked = false;
            this.togglList[2].isChecked = false;
            this.togglList[0].isChecked = true;
            this.togglList[3].isChecked = false;
            this.togglList[4].isChecked = false;
        }
        else if (type == 'JD') {
            this.jdCardBtnCallBack();
            this.togglList[1].isChecked = false;
            this.togglList[2].isChecked = false;
            this.togglList[0].isChecked = false;
            this.togglList[3].isChecked = false;
            this.togglList[4].isChecked = true;
        }
        else {
            this.coinBtnCallBack();
            this.togglList[2].isChecked = true;
            this.togglList[0].isChecked = false;
            this.togglList[1].isChecked = false;
            this.togglList[3].isChecked = false;
            this.togglList[4].isChecked = false;

        }
    },
    /**
     * 金币回调
     */
    coinBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        this.normalNode.active = true;
        this.exchangeNode.active = false;
        // this.bottomNode.active = true;
        this.coinContentNode.removeAllChildren(true);
        this.coinScroll.active = true;
        this.propScroll.active = false;
        this.cardNode.active = false;
        this.packageNode.active = false;
        this.jdCardNode.active = false;
        this.initShopItem(this._CoinData, 3, this.coinContentNode);
        for(let i=0;i<this.toggleBgList.length;i++) {
            this.toggleBgList[i].active = i!==0
        }
    },

    /**
     * 金币回调
     */
    cardBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        this.normalNode.active = true;
        this.exchangeNode.active = false;
        // this.bottomNode.active = true;
        this.coinScroll.active = false;
        this.propScroll.active = false;
        this.cardNode.active = true;
        this.packageNode.active = false;
        this.jdCardNode.active = false;
    },

    //vip
    vipBtnCallBack: function () {
        // hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY, function (prefab) {
        //     prefab.getComponent('klb_hall_daily_activeUI').showUI(5);
        // });
    },

    /**
     * 道具回调
     */
    propBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        this.normalNode.active = true;
        this.exchangeNode.active = false;
        // this.bottomNode.active = false;
        this.propContentNode.removeAllChildren(true);
        this.coinScroll.active = false;
        this.propScroll.active = true;
        this.cardNode.active = false;
        this.packageNode.active = false;
        this.jdCardNode.active = false;
        this.initShopItem(this._PropData, 2, this.propContentNode);
        for(let i=0;i<this.toggleBgList.length;i++) {
            this.toggleBgList[i].active = i!==1
        }
    },

    /**
     * 元宝
     */
    goldBtnCallBack: function () {
        // hall_audio_mgr.com_btn_click();
        // this.normalNode.active = true;
        // this.exchangeNode.active = false;
        // this.ContentNode.removeAllChildren(true);
        // this.descLabel.node.active = true;
        // return;
        hall_audio_mgr.com_btn_click();
        this.normalNode.active = false;
        this.exchangeNode.active = true;
        this.jdCardNode.active = false;
        this.yuanBaoContentNode.removeAllChildren(true);
        var dataList = shop_data.getYuanBaoExchangeListByType(1);
        this.initYuanBaoItem(dataList);
    },

    /**
     * 元宝
     */
    jdCardBtnCallBack: function () {
        // hall_audio_mgr.com_btn_click();
        // this.normalNode.active = true;
        // this.exchangeNode.active = false;
        // this.ContentNode.removeAllChildren(true);
        // this.descLabel.node.active = true;
        // return;
        hall_audio_mgr.com_btn_click();
        this.normalNode.active = true;
        this.jdCardNode.active = true;
        this.exchangeNode.active = false;
        this.coinScroll.active = false;
        this.propScroll.active = false;
        this.cardNode.active = false;
        this.packageNode.active = false;
        this.jdCardContentNode.removeAllChildren(true);
        var dataList = shop_data.getYuanBaoExchangeListByType(4);
        this.initJdCardItem(dataList);
    },

    /**
     *选择元宝兑换标签页
     */
    ckeckYuanBaoExchangeType: function (event, data) {
        hall_audio_mgr.com_btn_click();
        this.exchangeListNode.active = true;
        this.recordNode.active = false;
        var type = parseInt(data);
        this.yuanBaoContentNode.removeAllChildren(true);
        var dataList = shop_data.getYuanBaoExchangeListByType(type);
        this.initYuanBaoItem(dataList);
    },

    packageBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        this.normalNode.active = true;
        this.exchangeNode.active = false;
        this.coinScroll.active = false;
        this.propScroll.active = false;
        this.cardNode.active = false;
        this.packageNode.active = true;
        this.jdCardNode.active = false;
    },

    /**
     *获取兑换记录 
     */
    onClickExchangeRecord: function (event, data) {
        hall_audio_mgr.com_btn_click();
        this.exchangeListNode.active = false;
        this.recordNode.active = true;
        var pbObj = new cc.pb.rank.msg_trade_shop_exchange_record_req();
        pbObj.setOpType(1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_trade_shop_exchange_record_req, pbObj, 'msg_trade_shop_exchange_record_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickExchangeRecord');
    },

    /**
     * 初始化 商品
     * @param node
     * @param idx
     * @private
     */
    initShopItem: function (data, type, parent) {
        if (data.length == 0) {
            // this.descLabel.node.active = true
            return;
        } else {
            // this.descLabel.node.active = false;
        }
        this.itemList.splice(0, this.itemList.length);
        if (cc._isHuaweiGame || cc._isBaiDuPingTaiGame) {
            for (var i = data.length - 1; i > -1; i--) {
                if (hwShopList.indexOf(data[i].id) == -1)
                    data.splice(i, 1);
            }
        }
        cc.dd.ResLoader.loadPrefab("blackjack_hall/prefabs/blackjack/hall/BlackJack_hall_ShopItem", function (prefab) {
            //获取客服微信列表
            for (var i = 0; i < data.length; i++) {
                if (cc._isHuaweiGame || cc._isBaiDuPingTaiGame) {
                    if (hwShopList.indexOf(data[i].id) == -1)
                        continue;
                }
                if (cc._applyForPayment) {
                    if (data[i].id == 2003 || data[i].id == 3004 || data[i].id == 4001 || data[i].id == 4002 || data[i].id == 4003 || data[i].id == 4004) {
                        continue;
                    }
                }
                var item = cc.instantiate(prefab);
                this.itemList.push(item);
                item.parent = parent;
                var cnt = this.itemList.length;

                var y = (Math.ceil(cnt / 4) - 0.5) * this.itemHeight + (Math.ceil(cnt / 4) - 0.5) * this.spaceY;
                item.y = -y;
                var index = (cnt % 4);
                if (index == 0) { index = 4; }
                var x = (index - 2.5) * this.itemWidth + (index - 2.5) * this.spaceX;
                item.x = x;
                if (data[i].type == 3 || data[i].type == 4) {
                    item.getComponent('klb_hall_ShopItemUI').setData(data[i], null);
                } else {
                    item.getComponent('klb_hall_ShopItemUI').setData(data[i], this.clickItemCallBack.bind(this));
                }
            }
            parent.height = (Math.ceil(data.length / 4)) * this.itemHeight + ((Math.ceil(data.length / 4)) + 1) * this.spaceY;

        }.bind(this));
    },

    /**
     * 初始化元宝商城
     * @param data 列表数据
     * 
     */
    initYuanBaoItem: function (data) {
        if (data.length == 0) {
            // this.descLabel.node.active = true
            return;
        } else {
            // this.descLabel.node.active = false;
        }
        this.itemList.splice(0, this.itemList.length);
        cc.dd.ResLoader.loadPrefab("blackjack_hall/prefabs/klb_hall_Shop_Exchange_Item", function (prefab) {
            //设置商品列表
            for (var i = 0; i < data.length; i++) {
                var item = cc.instantiate(prefab);
                this.itemList.push(item);
                item.parent = this.yuanBaoContentNode;
                var cnt = this.itemList.length;

                var y = (Math.ceil(cnt / 4) - 0.5) * this.yuanBaoitemHeight + (Math.ceil(cnt / 4) - 0.5) * this.yuanBaospaceY;
                item.y = -y;
                var index = (cnt % 4);
                if (index == 0) { index = 4; }
                var x = (index - 2.5) * this.yuanBaoitemWidth + (index - 2.5) * this.yuanBaospaceX;
                item.x = x;
                item.getComponent('klb_hall_Shop_Exchange_ItemUI').setData(data[i], 1);
            }
            this.yuanBaoContentNode.height = (Math.ceil(data.length / 4)) * this.yuanBaoitemHeight + ((Math.ceil(data.length / 4)) + 1) * this.yuanBaospaceX;

        }.bind(this));
    },

    /**
     * 初始化京东卡商城
     * @param data 列表数据
     * 
     */
    initJdCardItem: function (data) {
        if (data.length == 0) {
            // this.descLabel.node.active = true
            return;
        } else {
            // this.descLabel.node.active = false;
        }
        this.itemList.splice(0, this.itemList.length);
        cc.dd.ResLoader.loadPrefab("blackjack_hall/prefabs/klb_hall_Shop_Exchange_Item", function (prefab) {
            //获取客服微信列表
            for (var i = 0; i < data.length; i++) {
                var item = cc.instantiate(prefab);
                this.itemList.push(item);
                item.parent = this.jdCardContentNode;
                var cnt = this.itemList.length;

                var y = (Math.ceil(cnt / 4) - 0.5) * this.yuanBaoitemHeight + (Math.ceil(cnt / 4) - 0.5) * this.yuanBaospaceY;
                item.y = -y;
                var index = (cnt % 4);
                if (index == 0) { index = 4; }
                var x = (index - 2.5) * this.yuanBaoitemWidth + (index - 2.5) * this.yuanBaospaceX;
                item.x = x;
                item.getComponent('klb_hall_Shop_Exchange_ItemUI').setData(data[i], 1);
            }
            this.jdCardContentNode.height = (Math.ceil(data.length / 4)) * this.itemHeight + ((Math.ceil(data.length / 4)) + 1) * this.spaceY;
        }.bind(this));
    },

    /**
     * 更新元宝
     */
    updateMony: function () {
        this.coinLabel.string = this.changeNumToCHN(hall_prop_data.getCoin());
        this.gold.string = this.changeNumToCHN(hall_prop_data.getCommonGold()) || '0';
    },


    /**
     * 筹码数字转换
     */
    changeNumToCHN: function changeNumToCHN(num) {
        var str = '';
        if (num >= 100000000) {
            str = (num / 100000000.00).toFixed(1) + '亿';
        } else if (num >= 10000000) {
            str = (num / 10000000.00).toFixed(1) + '千万';
        } else if (num >= 100000) {
            str = (num / 10000.00).toFixed(1) + '万';
        } else {
            str = num;
        }
        return str;
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        dd.NetWaitUtil.close();
        switch (event) {
            case shopEvent.SHOP_OPEN_BUY:
                var UI = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_BUY);
                if (UI)
                    cc.dd.UIMgr.destroyUI(UI);
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BUY, function (prefab) {
                    var component = prefab.getComponent('klb_hall_shopBuy');
                    component.initUI(this.itemData);
                }.bind(this));
                break;
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                this.updateMony();
                this.updateVIPLevel();
                break;
            case shopEvent.SHOP_EXCHANGERECORD:
                this.exchangeListNode.active = false;
                this.recordNode.active = true;
                this.recordNode.getComponent('klb_hall_Shop_Exchange_Record').initList(data);
                break;
            case shopEvent.REFRESH_DATA:
                this._CoinData = shop_data.getCoinList();
                this.coinContentNode.removeAllChildren();
                this.initShopItem(this._CoinData, 3, this.coinContentNode);
                this.updateFirstBuy();
                break;
            default:
                break;
        }
    },

    /**
     * 点击物品回调
     */
    clickItemCallBack: function (data) {
        this.itemData = data;
    },

    /**
     * 关闭回调
     */
    closeBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickCardExchange() {
        hall_audio_mgr.com_btn_click();
        let str = this.cardEditBox.string;
        let checkmatch = str.match(/[a-zA-Z0-9]/g);
        if (str.length != 12) {
            cc.dd.PromptBoxUtil.show('卡号不正确');
            return;
        }
        if (!checkmatch || checkmatch.length != str.length) {
            cc.dd.PromptBoxUtil.show('卡号只能由数字和字母组成');
            return;
        }
        this.cardEditBox.string = '';
        var msg = new cc.pb.game_rule.msg_card_charge_req();
        msg.setCardNum(str);
        cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_card_charge_req, msg, "msg_card_charge_req", true);
    },

    setUserInfo: function (userData) {
        var userinfo = this.node.getComponentInChildren('klb_hall_UserInfo');
        if (userinfo) {
            userinfo.setData(userData);
        }
    },

    updateFirstBuy() {
        // if (!cc._isHuaweiGame)
        //     this.togglList[0].node.active = cc._firstBuyId != null;
        this.togglList[0].node.active = false;
    }
});
module.exports = shop;
