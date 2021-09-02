//create by wj 2018/08/27
const data_vip = require('vip')
var HallVip = require('hall_vip').VipData;
var hallData = require('hall_common_data').HallCommonData.getInstance();
const data_shop = require('shop')
const data_gift = require('giftsBag')
var hall_prefab = require('hall_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr');

var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

cc.Class({
    extends: cc.Component,
    properties: {
        atlasIcon: {
            default: null,
            type: cc.SpriteAtlas,
        },

        textPrefab: {
            default: null,
            type: cc.Prefab,
        },

        itemPrefab: {
            default: null,
            type: cc.Prefab,
        },

        vipLen: 0,
        currPage: 1,
    },

    onLoad: function () {
        TaskED.addObserver(this);

        this.vipData = data_vip.getItemList(function (element) {
            return true;
        }.bind(this))
        this.vipLen = this.vipData.length - 1; //去掉第一行0，所以减1
        var level = hallData.vipLevel;
        if (level == 0)
            level = 1;
        this.initPageDetail(level);
        this.updateCurrPage(level);
    },

    onDestroy: function () {
        TaskED.removeObserver(this);
    },


    initPageDetail: function (index) {
        this.curpage = index;
        cc.find('bg/left', this.node).active = true;
        cc.find('bg/right', this.node).active = true;
        if (this.curpage == 15)
            cc.find('bg/right', this.node).active = false;
        else if (this.curpage == 1)
            cc.find('bg/left', this.node).active = false;

        cc.dd.Utils.seekNodeByName(this.node, "pagenum").getComponent(cc.Label).string = '(' + index + '/15)';

        var page = cc.find('bg/klb_hall_daily_VIP_Page', this.node);


        var m_leftTextContent = cc.find("left/di/arrowList", page);
        m_leftTextContent.removeAllChildren(true);
        var m_leftDesc = cc.find('left/name', page).getComponent(cc.RichText);
        var m_priceOri = cc.find("right/back/price/priceOri/frame/price", page).getComponent(cc.Label);
        var m_priceNow = cc.find("right/back/price/priceNow/frame/price", page).getComponent(cc.Label);

        //right
        var m_rightItemContent = cc.find("right/back/itemscroll/mask/content", page);
        var m_buyButton = cc.find("right/buy", page).getComponent(cc.Button);
        //var m_buyButtonText = cc.find("right/buy/txt",page).getComponent(cc.Label);
        var m_descLabel = cc.find("right/back/des", page).getComponent(cc.RichText);



        var vipdataNext = data_vip.getItem(function (element) {
            return element.key == index;
        }.bind(this))

        var openTag = cc.find('left/di/open', page);
        openTag.active = (hallData.vipLevel >= vipdataNext.key ? false : true);

        var chargeDesc = cc.find('left/di/charge', page).getComponent(cc.Label);
        chargeDesc.string = '充值' + vipdataNext.exp + '元可获得VIP' + vipdataNext.key + '特权';
        //描述和礼包
        //left
        m_leftDesc.string = '<color=#efe12c>VIP' + (index) + '</c><color=#ffffff>特权</color>';
        var des = vipdataNext.des.split(";");
        for (var i = 0; i < des.length; i++) {
            var viptitle = cc.instantiate(this.textPrefab);
            var richTxt = viptitle.getComponent(cc.RichText);
            richTxt.string = des[i];
            m_leftTextContent.addChild(viptitle);
        }


        if (HallVip.Instance().isBuyVipGift(index)) {
            m_buyButton.interactable = false;
            m_buyButton.node.active = false;
            //m_buyButtonText.string = "已购买";
        } else if (hallData.vipLevel < index) {
            m_buyButton.interactable = false;
            m_buyButton.node.active = false;
            //this.m_buyButtonText.string = "购 买";
        }
        else {
            m_buyButton.interactable = true;
            m_buyButton.node.active = true;
            //this.m_buyButtonText.string = "购 买";
        }

        var curShopdata = this.getShopDataBylvl(index);

        m_priceOri.string = (curShopdata.cost_item_count / 100) + "元";//单位分
        m_priceNow.string = (curShopdata.cost_discount / 100) + "元";
        m_descLabel.string = '<color=#efe12c>VIP' + vipdataNext.key + '</c><color=#ffffff>专属礼包</color>';

        var items = this.getVipItemsBylvl(index).split(";");//curVipData.items.split(";");
        m_rightItemContent.removeAllChildren(true);
        for (var i = 0; i < items.length; i++) {
            var its = cc.instantiate(this.itemPrefab);
            var content = items[i].split(",");

            var icon = cc.find("icon", its).getComponent(cc.Sprite);
            var sum = cc.find("num", its).getComponent(cc.Label);


            icon.spriteFrame = this.atlasIcon.getSpriteFrame(content[0]);
            sum.string = cc.dd.Utils.getNumToWordTransform(content[1]);
            m_rightItemContent.addChild(its);
        }
    },



    updateCurrPage: function (index) {
        var page = cc.find('bg/klb_hall_daily_VIP_Page', this.node);
        var m_buyButton = cc.find("right/buy", page).getComponent(cc.Button);

        var m_vipLevel = cc.find("top/leftbg/cur_lv", page).getComponent(cc.Label);
        m_vipLevel.string = hallData.vipLevel;

        var vipdataNext = data_vip.getItem(function (element) {
            return element.key == hallData.vipLevel + 1;
        }.bind(this))


        var dis = vipdataNext.exp - hallData.vipExp;
        var m_nextVipDes = cc.find("top/des", page).getComponent(cc.RichText);
        if (hallData.vipLevel < this.vipLen) {
            m_nextVipDes.string = '<color=#ffffff>再充值</c><color=#efe12c>' + dis + '</c>' + '<color=#ffffff>元，您将成为</c><color=#efe12c>VIP' + (vipdataNext.key) + '</color> ';
        } else {
            m_nextVipDes.string = "<color=#cc0000>VIP已满级</color>"
        }

        var m_vipProgress = cc.find("top/exp_progress", page).getComponent(cc.ProgressBar);
        m_vipProgress.progress = hallData.vipExp / vipdataNext.exp;


        if (HallVip.Instance().isBuyVipGift(index)) {
            m_buyButton.interactable = false;
            m_buyButton.node.active = false;
            //m_buyButtonText.string = "已购买";
        } else if (hallData.vipLevel < index) {
            m_buyButton.interactable = false;
            m_buyButton.node.active = false;
            //this.m_buyButtonText.string = "购 买";
        }
        else {
            m_buyButton.interactable = true;
            m_buyButton.node.active = true;
            //this.m_buyButtonText.string = "购 买";
        }
    },

    //根据vip等级获取该等级礼包所包含的物品列表
    getVipItemsBylvl: function (lvl) {
        //从shop表读取type为1，等级为lvl的一行数据
        var curShopData = data_shop.getItem(function (element) {
            return (element.vip_level == lvl) && (element.type == 1);
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
    getShopDataBylvl: function (lvl) {
        //从shop表读取type为1，等级为lvl的一行数据
        var curShopData = data_shop.getItem(function (element) {
            return (element.vip_level == lvl) && (element.type == 1);
        }.bind(this))

        return curShopData;
    },

    onClickCharge: function () {
        if (!cc._is_shop)
            return;
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            ui.getComponent('klb_hall_ShopLayer').gotoPage('ZS');
        }.bind(this));
        cc.dd.UIMgr.destroyUI(cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY));
    },

    onClickBuyItem: function () {
        //script.setChargeTypeAndID(1,);
        // var amt = parseFloat(this.curShopdata.cost_discount/100).toFixed(2);
        // this.payAmt = amt
        hall_audio_mgr.Instance().com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_PAY, function(prefab){
        //     var component = prefab.getComponent('klb_hall_ShopPay');
        //     component.initUIVIPGift(this.curShopdata,true);
        // }.bind(this));
        var curShopdata = this.getShopDataBylvl(this.curpage);

        cc.dd.PayWeChatH5.iPay(curShopdata.key, curShopdata.cost_discount / 100, curShopdata.cost_item_count / 100);
    },

    onClickBtnOp: function (event, data) {
        var index = parseInt(data);
        this.curpage += index;

        if (this.curpage > 15) {
            this.curpage = 15;
            cc.find('bg/left').active = false;
            return
        } else if (this.curpage < 1) {
            this.curpage = 1;
            cc.find('bg/right').active = false;
            return;
        }
        this.initPageDetail(this.curpage);
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case TaskEvent.VIP_GET_GIFT_INFO:
                this.updateCurrPage(this.curpage);
                this.initPageDetail(this.curpage);
                break;
            default:
                break;
        }
    }

});
