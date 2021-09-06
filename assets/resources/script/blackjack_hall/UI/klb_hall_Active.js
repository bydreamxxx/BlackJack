// create by wj 2018/05/21
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
const Hall = require('jlmj_halldata');

cc.Class({
    extends: cc.Component,

    properties: {
        goldLabel: cc.Label,

        itemList: [],
        exchangeNode: cc.Node,//元宝兑换
        yuanBaoContentNode: cc.Node, //元宝列表父节点
        yuanBaospaceX: 15,
        yuanBaospaceY: 10,
        yuanBaoitemWidth: 326,
        yuanBaoitemHeight: 256,

        exchangeListNode: cc.Node,
        recordNode: cc.Node,

        rankNode: cc.Node, //排行榜节点
        rankContentNode: cc.Node, //排行榜父节点

        rank_icon: [cc.SpriteFrame],
        descTxt: cc.Node,
        myRankTxt: cc.Label, //我的排行
    },

    onLoad: function () {
        shopEd.addObserver(this);
        HallCommonEd.addObserver(this);
        Hall.HallED.addObserver(this);

        //this.coinLabel.string = this.changeNumToCHN(hall_prop_data.getCoin());
        var data = hall_prop_data.getItemInfoByDataId(1015);
        if (data)
            this.goldLabel.string = hall_prop_data.getItemInfoByDataId(1015).count || '0';
    },

    onDestroy: function () {
        shopEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        Hall.HallED.removeObserver(this);
    },

    initExchangeItem: function (data) {
        this.itemList.splice(0, this.itemList.length);
        this.yuanBaoContentNode.removeAllChildren(true);
        cc.dd.ResLoader.loadPrefab("blackjack_hall/prefabs/klb_hall_Shop_Exchange_Item", function (prefab) {
            //设置商品列表
            for (var i = 0; i < data.length; i++) {
                var item = cc.instantiate(prefab);
                this.itemList.push(item);
                item.parent = this.yuanBaoContentNode;
                var cnt = this.itemList.length;

                var y = (Math.ceil(cnt / 3) - 0.5) * this.yuanBaoitemHeight + (Math.ceil(cnt / 3) - 0.5) * this.yuanBaospaceY;
                item.y = -y;
                var index = (cnt % 3);
                if (index == 0) { index = 3; }
                var x = (index - 2) * this.yuanBaoitemWidth + (index - 2) * this.yuanBaospaceX;
                item.x = x;
                item.getComponent('klb_hall_Shop_Exchange_ItemUI').setData(data[i], 2);
            }
            this.yuanBaoContentNode.height = (Math.ceil(data.length / 3)) * this.yuanBaoitemHeight + ((Math.ceil(data.length / 3)) + 1) * this.yuanBaospaceX;

        }.bind(this));
    },

    checkExchangeType: function (event, data) {
        var type = parseInt(data);
        this.exchangeNode.active = true;
        this.rankNode.active = false;
        this.onClickOpenExchange(type);
    },

    /**
     *获取兑换记录 
     */
    onClickExchangeRecord: function (event, data) {
        hall_audio_mgr.com_btn_click();
        this.exchangeListNode.active = false;
        this.recordNode.active = true;
        var pbObj = new cc.pb.rank.msg_trade_shop_exchange_record_req();
        pbObj.setOpType(2);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_trade_shop_exchange_record_req, pbObj, 'msg_trade_shop_exchange_record_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickExchangeRecord');
    },

    /**
     * 打开兑换界面
     */
    onClickOpenExchange: function (type) {
        hall_audio_mgr.com_btn_click();
        this.exchangeListNode.active = true;
        this.recordNode.active = false;
        this.yuanBaoContentNode.removeAllChildren(true);
        var dataList = shop_data.getActiveExchangeListByType(type);
        this.initExchangeItem(dataList);

    },

    /**
     * 打开排行榜
     */
    onClickOpenActiveRank: function () {
        hall_audio_mgr.com_btn_click();
        this.exchangeNode.active = false;
        this.rankNode.active = true;
        var pbObj = new cc.pb.rank.msg_rank_get_rank_list_2s();
        pbObj.setType(3);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_rank_get_rank_list_2s, pbObj, 'msg_rank_get_rank_list_2s', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickOpenActiveRank');

    },

    /**
     * 排行榜数据
     */
    initRankData: function (msg) {
        this.rankContentNode.removeAllChildren(true);
        if (msg.myRank != 0)
            this.myRankTxt.string = '我的排名：第' + msg.myRank + '名';
        if (msg.ranksList.length == 0)
            this.descTxt.active = true;
        cc.dd.ResLoader.loadPrefab("blackjack_hall/prefabs/klb_hall_Active_RankItem", function (prefab) {
            for (var i = 0; i < msg.ranksList.length; i++) {
                var node = cc.instantiate(prefab);
                if (msg.ranksList[i].rank < 4) {
                    cc.find('rankbg', node).getComponent(cc.Sprite).spriteFrame = this.rank_icon[msg.ranksList[i].rank - 1];
                }
                else {
                    //cc.find('bg_first', node).active = false;
                    //cc.find('bg_last', node).active = true;
                    cc.find('rankbg', node).active = false;
                    cc.find('rankLabel', node).getComponent(cc.Label).string = msg.ranksList[i].rank.toString();
                    cc.find('rankLabel', node).active = true;
                }
                //cc.find('tagIcon', node).getComponent(cc.Sprite).spriteFrame = this.coin_icon[1];
                cc.find('nameTxt', node).getComponent(cc.Label).string = (msg.ranksList[i].playerName.length > 6 ? cc.dd.Utils.substr(msg.ranksList[i].playerName, 0, 4) : msg.ranksList[i].playerName);
                cc.find('countTxt', node).getComponent(cc.Label).string = msg.ranksList[i].value.toString() + '局';
                if (msg.ranksList[i].rewardNum != 0) {
                    var rosenode = cc.find('tagIcon', node);
                    rosenode.active = true;
                    cc.find('descTxt', rosenode).getComponent(cc.Label).string = msg.ranksList[i].rewardNum;

                }
                var headNode = cc.find('head_mask', node);
                var cpt = headNode.getComponent('klb_hall_Player_Head');
                cpt.initHead(msg.ranksList[i].openid, msg.ranksList[i].headurl, 'klb_hall_Active_Rank_Item')
                this.rankContentNode.addChild(node);
            }
            cc.dd.NetWaitUtil.close();
        }.bind(this));
    },

    /** 
     * 打开奖励说明
    */
    onClickOpenRankAward: function (event, data) {
        var detailNode = cc.find('gailv_detail', this.node);
        detailNode.active = true;
        var parentNode = cc.find('scroll/view/content', detailNode);
        var activetyInfo = Hall.HallData.Instance().getActiveById(2);
        if (activetyInfo) {
            var awardList = activetyInfo.rewardsInfoList;
            for (var i = 0; i < awardList.length; i++) {
                var node = parentNode.getChildByName('item' + i);
                node.active = true;
                var str = '第' + awardList[i].minRank + '名';
                if (awardList[i].minRank != awardList[i].maxRank)
                    str += ' - 第' + awardList[i].maxRank + '名';
                node.getChildByName('item').getComponent(cc.Label).string = str;
                node.getChildByName('gailv').getComponent(cc.Label).string = awardList[i].num;
            }
        }

    },

    /**
     * 关闭奖励说明
     */
    closeDetail(event, data) {
        cc.find('gailv_detail', this.node).active = false;
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        dd.NetWaitUtil.close();
        switch (event) {
            case shopEvent.ACTIVE_EXCHANGE_RECORD:
                this.exchangeListNode.active = false;
                this.recordNode.active = true;
                this.recordNode.getComponent('klb_hall_Shop_Exchange_Record').initList(data);
                break;
            case Hall.HallEvent.Rank_Info:
                this.initRankData(data);
                break;
            default:
                break;
        }
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    // update (dt) {},
});
