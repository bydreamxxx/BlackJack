var hall_audio_mgr = require('hall_audio_mgr');
var Platform = require("Platform");
const AppCfg = require('AppConfig');
var hall_prefab = require('hall_prefab_cfg');
const data_vip = require('vip')
const data_item = require('item')
const data_shop = require('shop')
const data_gift = require('giftsBag')

var PayDef = require("PayDef");
const weburl = "http://47.92.129.247:3808/quickpay/h5param?";
var hallData = require('hall_common_data').HallCommonData.getInstance();


var shopEd = require('hall_shop').shopED;
var shopEvent = require('hall_shop').shopEvent;
// var Task = require('hall_task').Task;
// var TaskED = require('hall_task').TaskED;
// var TaskEvent = require('hall_task').TaskEvent;

let firstbuy = cc.Class({
    extends: cc.Component,

    properties: {

        // itemPrefab: {
        //     default: null,
        //     type: cc.Prefab,
        // },
        //
        //
        atlasIcon: {
            default: null,
            type: cc.SpriteAtlas,
        },

        titleSpriteFrames:[cc.SpriteFrame],
        desSpriteFrames:[cc.SpriteFrame],
        actorNodes:[cc.Node],
        bottomNodes:[cc.Node],

        itemLabels:[cc.Label],
        itemName:[cc.Label],
        itemSprite:[cc.Sprite],

        item: [cc.Node],

        titleSprite:cc.Sprite,
        desSprite:cc.Sprite,
    },

    onLoad: function () {
        // TaskED.addObserver(this);

        // //top
        // this.m_topDes = cc.find("actNode/top/des", this.node).getComponent(cc.RichText);
        //
        // //down
        // this.m_priceOri = cc.find("actNode/down/price/priceOri/price", this.node).getComponent(cc.Label);
        // this.m_priceNow = cc.find("actNode/down/price/priceNow/price", this.node).getComponent(cc.Label);
        //
        // this.m_firstItemIcon = cc.find("actNode/down/firstItem/icon", this.node).getComponent(cc.Sprite);
        // this.m_firstItemSum = cc.find("actNode/down/firstItem/num", this.node).getComponent(cc.Label);
        // this.m_rightItemContent = cc.find("actNode/down/itemscroll/mask/content", this.node);
        //
        ////赋值
        this.curShopdata = this.getShopDataBylvl();
        var price = this.curShopdata.cost_discount / 100
        this.curShopdata.price = price
        //
        // this.m_priceOri.string = (this.curShopdata.cost_item_count / 100) + "元"
        // this.m_priceNow.string = price + "元"
        // this.m_topDes.string = "<color=#574c46>充值</c><color=#cc0000>" + price + "元</color><color=#574c46>可获得以下奖励</color>";

        this.updateUI();

        shopEd.addObserver(this);
    },

    onDestroy() {
        shopEd.removeObserver(this);
    },

    initItemList: function () {
        var items = this.getVipItemsBylvl().split(";");//curVipData.items.split(";");

        let countNum = 0;
        let magic = 0;
        for(let i = 0; i < items.length && countNum < this.itemName.length; i++){
            let list = items[i].split(",");
            let id = list[0];
            let count = list[1];

            if((id >= 1007 && id <= 1030) || (id >= 1036 && id <= 1099)){
                magic+=parseInt(count);
            }else{
                let item = data_item.getItem(function (itemdata) {
                    return itemdata.key == id;
                });
                if(item){
                    if(id >= 1031 && id <= 1035){
                        this.itemLabels[countNum].string = 'x'+Math.floor(item.expire / 86400)+'天';
                    }else{
                        this.itemLabels[countNum].string = 'x'+count;
                    }

                    this.itemName[countNum].string = item.memo;
                    this.itemSprite[countNum].spriteFrame = this.atlasIcon.getSpriteFrame(item.icon.replace("d1", "d5"));
                }

                countNum++;
            }
        }

        if(magic > 0 && countNum < this.itemName.length){
            this.itemSprite[countNum].spriteFrame = this.atlasIcon.getSpriteFrame("sc-daojubao01");
            this.itemName[countNum].string = "魔法道具包";
            this.itemLabels[countNum].string = 'x'+magic;
        }

        if(cc.game_pid == 2){
            this.item[1].active = false;
        }
    },

    updateUI() {
        this.curShopdata = this.getShopDataBylvl();
        var price = this.curShopdata.cost_discount / 100
        this.curShopdata.price = price;

        let _showIndex = this.getLvl();
        this.titleSprite.spriteFrame = this.titleSpriteFrames[_showIndex];
        this.desSprite.spriteFrame = this.desSpriteFrames[_showIndex];

        for(let i = 0; i < 3; i++){
            this.actorNodes[i].active = i == _showIndex;
            this.bottomNodes[i].active = i == _showIndex;
        }


        // this.m_priceOri.string = (this.curShopdata.cost_item_count / 100) + "元"
        // this.m_priceNow.string = price + "元"
        // this.m_topDes.string = "<color=#574c46>充值</c><color=#cc0000>" + price + "元</color><color=#574c46>可获得以下奖励</color>";
        //
        // this.m_rightItemContent.removeAllChildren();
        this.initItemList();
    },

    //根据vip等级获取该等级礼包所包含的物品列表
    getVipItemsBylvl: function () {
        //从shop表读取type为1，等级为lvl的一行数据
        var curShopData = data_shop.getItem(function (element) {
            return (element.key == cc._firstBuyId);
        }.bind(this))

        //从giftbag表读取id为curShopData.itemid的一行数据
        if (curShopData) {
            var itemsData = data_gift.getItem(function (element) {
                return (element.key == curShopData.itemid);
            }.bind(this))

            if (itemsData) {
                return itemsData.items;
            }
        }
        return null;
    },

    //根据vip等级获取该等级礼包
    getShopDataBylvl: function () {
        //从shop表读取type为1，等级为lvl的一行数据
        var curShopData = data_shop.getItem(function (element) {
            return (element.key == cc._firstBuyId);
        }.bind(this))

        return curShopData;
    },

    getLvl(){
      switch(this.curShopdata.itemid){
          case 10020:
              return 0;
          case 10021:
              return 1;
          case 10001:
              return 2;
          default:
              return 0;
      }
    },

    onClickClose: function () {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    test: function () {
        this.m_resultIndex = Math.floor(Math.random() * 9)
    },


    onClickBuyItem: function () {
        hall_audio_mgr.Instance().com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_PAY, function(prefab){
        //     var component = prefab.getComponent('klb_hall_ShopPay');
        //     component.initUIVIPGift(this.curShopdata,true);
        // }.bind(this));
        var shop_data = require('hall_shop').shopData;
        var first_pay_item = shop_data.Instance().getFirstPayItem();
        cc.dd.PayWeChatH5.iPay(first_pay_item.id, first_pay_item.costDiscount / 100, first_pay_item.costItemCount / 100);
    },


    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            // case TaskEvent.LOTTERY_RWARD:
            //     this.setRewardResult(data[0]);
            //     this.setCount();
            //     break;
            // case TaskEvent.LOTTERY_UPDATE_HISTORY:
            //     this.updateRewardHistory();
            //     break;
            // case TaskEvent.LOTTERY_UPDATE_COUNT:
            //     this.setCount();
            //     break;
            case shopEvent.REFRESH_DATA:
                this.updateUI();
                break;
            default:
                break;
        }
    }
});

module.exports = firstbuy;

