var hall_audio_mgr = require('hall_audio_mgr');
var Platform = require( "Platform" );
const AppCfg = require('AppConfig');
var hall_prefab = require('hall_prefab_cfg');
const data_vip = require('vip')
const data_item = require('item')
const data_shop = require('shop')
const data_gift = require('giftsBag')

var PayDef = require( "PayDef" );
const weburl = "http://47.92.129.247:3808/quickpay/h5param?";
var hallData = require('hall_common_data').HallCommonData.getInstance();

var Task = require('hall_task').Task;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

var HallVip = require('hall_vip').VipData;

cc.Class({
    extends: cc.Component,

    properties: {
        textPrefab: {
            default: null,
            type: cc.Prefab,
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        vipTitlePrefab: {
            default: null,
            type: cc.Prefab,
        },

        atlasIcon: {
            default: null,
            type: cc.SpriteAtlas,
        },

        vipLen:0,
        m_curSelectVIP:0,
        itemWidth: 76,
        spaceX: 10,
        itemList: [],
        desc: cc.Label,
    },

    onLoad: function () {
        TaskED.addObserver(this);
        this.vipData = data_vip.getItemList(function (element) {
            return true;
        }.bind(this))
        this.vipLen = this.vipData.length - 1; //去掉第一行0，所以减1
        //top
        this.m_vipLevel = cc.find("top/leftbg/cur_lv",this.node).getComponent(cc.Label);
        this.m_vipProgress = cc.find("top/exp_progress",this.node).getComponent(cc.ProgressBar);
        this.m_nextVipDes = cc.find("top/des",this.node).getComponent(cc.RichText);

        //left
        this.m_vipTitleGroup = cc.find("left/vip_list/view/content",this.node);
        this.m_leftTextContent = cc.find("left/arrowList",this.node);
        this.m_priceOri = cc.find("right/back/price/priceOri/frame/price",this.node).getComponent(cc.Label);
        this.m_priceNow = cc.find("right/back/price/priceNow/frame/price",this.node).getComponent(cc.Label);
        
        //right
        this.m_rightItemContent = cc.find("right/back/itemscroll/mask/content",this.node);
        this.m_buyButton = cc.find("right/buy",this.node).getComponent(cc.Button);
        this.m_buyButtonText = cc.find("right/buy/txt",this.node).getComponent(cc.Label);


        for(var i=0;i< this.vipLen;i++)
        {
            var viptitle = cc.instantiate(this.vipTitlePrefab);
            this.itemList.push(viptitle);
            var se_lv = cc.find("select_node/lv",viptitle);
            var unse_lv = cc.find("unselect_node/lv",viptitle);
            var tog = viptitle.getComponent(cc.Toggle)
            viptitle.tagname = i;
            se_lv.getComponent(cc.Label).string = 'V' + (i+1).toString();
            unse_lv.getComponent(cc.Label).string = 'V' + (i+1).toString();
            tog.node.on('toggle', this.selectVipTitle, this);
            tog.toggleGroup = this.m_vipTitleGroup.getComponent(cc.ToggleGroup);
            //选中第一个
            if(i==0)
            {
                tog.isChecked = true;
            }

            if(i>=9)
            {
                se_lv.setPosition(cc.v2(-7.7, 0));
                unse_lv.setPosition(cc.v2(-7.7, 0));
            }
            var cnt = this.itemList.length;
            var x = (cnt-0.5)*this.itemWidth + (cnt-1)*this.spaceX;
            viptitle.x = x;

            this.m_vipTitleGroup.addChild(viptitle);
            this.m_vipTitleGroup.width = cnt*this.itemWidth+(cnt+1)*this.spaceX;
        }
        this.setCurVipLvlShow();
        this.updateSelectVip();
        this.requestVIPInfo();
        // this.setCount();
    },

    setCurVipLvlShow:function(){
        this.m_curSelectVIP = 1;//hallData.vipLevel>0?hallData.vipLevel:1

        var vipdataCur = data_vip.getItem(function (element) {
            return element.key == hallData.vipLevel;
        }.bind(this))

        var vipdataNext = data_vip.getItem(function (element) {
            return element.key == (hallData.vipLevel + 1);
        }.bind(this))

        this.m_vipLevel.string = hallData.vipLevel;
        var dis = vipdataNext.exp - hallData.vipExp;
        this.m_vipProgress.progress = hallData.vipExp/ vipdataNext.exp;

        if(hallData.vipLevel<this.vipLen)
        {
            this.m_nextVipDes.string = '<color=#574c46>再充值</c><color=#007e1a>'+dis + '元</c><color=#574c46>，您将成为</c><color=#d16a15>VIP' +(hallData.vipLevel + 1)+'</color> ';
        }else
        {
            this.m_nextVipDes.string = "<color=#cc0000>VIP已满级</color>"
        }
        
    },

    //根据vip等级获取该等级礼包所包含的物品列表
    getVipItemsBylvl:function(lvl)
    {
        //从shop表读取type为1，等级为lvl的一行数据
        var curShopData = data_shop.getItem(function (element) {
            return (element.vip_level == lvl) && (element.type == 1);
        }.bind(this))

        //从giftbag表读取id为curShopData.itemid的一行数据
        if(curShopData)
        {
            var itemsData = data_gift.getItem(function (element) {
                return (element.key == curShopData.itemid);
            }.bind(this))

            if(itemsData)
            {
                return itemsData.items;
            }
        }
        return null;
    },

     //根据vip等级获取该等级礼包
     getShopDataBylvl:function(lvl)
     {
         //从shop表读取type为1，等级为lvl的一行数据
         var curShopData = data_shop.getItem(function (element) {
             return (element.vip_level == lvl) && (element.type == 1);
         }.bind(this))
 
         return curShopData;
     },

    //更新选中vip界面
    updateSelectVip:function(){
        this.m_leftTextContent.removeAllChildren(true);
        this.m_rightItemContent.removeAllChildren(true);

        var curVipData = data_vip.getItem(function (element) {
            return element.key == this.m_curSelectVIP;
        }.bind(this))

        //left
        var des = curVipData.des.split(";");
        for(var i=0;i<des.length;i++)
        {
            var viptitle = cc.instantiate(this.textPrefab);
            var richTxt = viptitle.getComponent(cc.RichText);
            richTxt.string = des[i];
            this.m_leftTextContent.addChild(viptitle);
        }

        this.curShopdata = this.getShopDataBylvl(this.m_curSelectVIP);

        this.m_priceOri.string = (this.curShopdata.cost_item_count/100)+"元";//单位分
        this.m_priceNow.string = (this.curShopdata.cost_discount/100)+"元";

        //支付时候需要用
        this.curShopdata.price = this.curShopdata.cost_discount/100

        this.desc.string = 'VIP' + this.m_curSelectVIP + '专属礼包';
        //right
        var items = this.getVipItemsBylvl(this.m_curSelectVIP).split(";");//curVipData.items.split(";");
        for(var i=0;i<items.length;i++)
        {
            var its = cc.instantiate(this.itemPrefab);
            var content = items[i].split(",");
            
            var icon = cc.find("icon",its).getComponent(cc.Sprite);
            var sum = cc.find("num",its).getComponent(cc.Label);
            
            var itemData = data_item.getItem(function (element) {
                if(element.key==parseInt(content[0]))
                    return true;
                else
                    return false;
            }.bind(this));

            icon.spriteFrame = this.atlasIcon.getSpriteFrame(content[0]);
            sum.string = cc.dd.Utils.getNumToWordTransform(content[1]);
            this.m_rightItemContent.addChild(its);
        }

        if(HallVip.Instance().isBuyVipGift(this.m_curSelectVIP))
        {
            this.m_buyButton.interactable = false;
            this.m_buyButtonText.string = "已购买";
        }else if(hallData.vipLevel <this.m_curSelectVIP)
        {
            this.m_buyButton.interactable = false;
            this.m_buyButtonText.string = "购 买";
        }
        else
        {
            this.m_buyButton.interactable = true;
            this.m_buyButtonText.string = "购 买";
        }
    },

    requestVIPInfo:function()
    {
        var msg = new cc.pb.rank.msg_vip_open();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_vip_open, msg, 'msg_vip_open', true);
    },

    selectVipTitle: function (event) {
        var toggle = event.detail;
        var vipLv = parseInt(toggle.node.tagname);
        if(this.m_curSelectVIP!=(vipLv+1)){
            this.m_curSelectVIP = vipLv + 1;
            this.updateSelectVip();
        }

    },

    resetState:function()
    {
        this.m_tail.active = false;
        this.m_flashLight.active = false;
        this.m_arrow.rotation = 0;
    },

    onDestroy: function () {
        TaskED.removeObserver(this);
        // clearTimeout(this.m_timeOutId);
        // clearTimeout(this.m_buttonTimeOutId);
        
        // this.lottery_type = 0;
        // this.m_arrowAnimation.off('finished',  this.onAnimationFinished, this);
    },

    onClickClose: function () {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    test:function(){
        this.m_resultIndex = Math.floor(Math.random() * 9)
    },


    onClickBuyItem:function() {
        //script.setChargeTypeAndID(1,);
        // var amt = parseFloat(this.curShopdata.cost_discount/100).toFixed(2);
        // this.payAmt = amt
        hall_audio_mgr.Instance().com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_PAY, function(prefab){
        //     var component = prefab.getComponent('klb_hall_ShopPay');
        //     component.initUIVIPGift(this.curShopdata,true);
        // }.bind(this));
        cc.dd.PayWeChatH5.iPay(this.curShopdata.key,this.curShopdata.cost_discount/100,this.curShopdata.cost_item_count/100);
    },

    onClickCharge:function() {
        if (!cc._is_shop)
            return;        
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            ui.getComponent('klb_hall_ShopLayer').gotoPage('ZS');
        }.bind(this));
        cc.dd.UIMgr.destroyUI(this.node);
    },


    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        switch (event){
            case TaskEvent.VIP_GET_GIFT_INFO:
                this.updateSelectVip();
                break;
            default:
                break;
        }
    }
});
