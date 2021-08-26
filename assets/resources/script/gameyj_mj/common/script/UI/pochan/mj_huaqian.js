var jlmj_prefab = require('jlmj_prefab_cfg');
var shop_data = require('hall_shop').shopData.Instance();
var HallCommonObj = require('hall_common_data');
var HallCommonData = HallCommonObj.HallCommonData;
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var FortuneHallManager = require('FortuneHallManager').Instance();
var PlayerBaseInfoMgr = require('hall_common_data').PlayerBaseInfoMgr.getInstance();
var data_vip = require('vip');
var UIZorder = require("mj_ui_zorder");
var Text = cc.dd.Text;
cc.Class({
    extends: cc.Component,

    properties: {
        jinbi_tip: cc.Label,
        jinbi_daoju: cc.Label,
        vip_lvl: cc.Label,//vip等级
        zengjia_label: cc.Label,//vip加成txt
        jiage_label: cc.Label,//价格txt
    },

    onHuaqian: function () {
        cc.dd.PayWeChatH5.iPay(this.buy_list.id, this.buy_list.costDiscount / 100, this.buy_list.costItemCount / 100);
    },

    onClose: function () {

        cc.log(' 花小钱关闭 判定低保窗口是否打开：当前剩余金币---银行：', HallCommonData.getInstance().userBankGold_coin * 1);
        cc.log(' 花小钱关闭 判定低保窗口是否打开：当前剩余金币---背包：', HallPropData.getCoin() * 1);
        cc.log(' 花小钱关闭 判定低保窗口是否打开：当前剩余领取---次数：', HallCommonData.getInstance().jiuji_cnt);
        var coin_num = HallCommonData.getInstance().userBankGold_coin * 1 + HallPropData.getCoin() * 1;
        if (HallCommonData.getInstance().jiuji_cnt > 0 && coin_num < 2000) {
            cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_BAODI, function (ui) {
                ui.zIndex = UIZorder.MJ_LAYER_TOP;
            });
        } else {
            var jiesuan = null;
            switch (HallCommonData.getInstance().gameId) {
                case cc.dd.Define.GameType.CCMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('ccmj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.JLMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('jlmj_jbc_desk_info')._jiesuan;
                    break;
                case 32:
                    jiesuan = cc.find('Canvas/root/result_ani').getComponent('ddz_jiesuan_jbc');
                    break;
                case 51:
                    jiesuan = cc.find('Canvas/result').getComponent('nn_jiesuan_jbc');
                    break;
                case cc.dd.Define.GameType.NAMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('namj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.SYMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('symj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.FXMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('fxmj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.XZMJ_GOLD:
                case cc.dd.Define.GameType.XLMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('scmj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.SHMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('shmj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.JZMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('jzmj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.HSMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('hsmj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.TDHMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.CFMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('cfmj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.AHMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('ahmj_desk_info_jbc')._jiesuan;
                    break;
                case cc.dd.Define.GameType.FZMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('fzmj_desk_info')._jiesuan;
                    break;
                case cc.dd.Define.GameType.WDMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('wdmj_desk_info')._jiesuan;
                    break;
                case cc.dd.Define.GameType.PZMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('pzmj_desk_info')._jiesuan;
                    break;
                case cc.dd.Define.GameType.BCMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('bcmj_desk_info')._jiesuan;
                    break;
                case cc.dd.Define.GameType.ACMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('acmj_desk_info')._jiesuan;
                    break;
                case cc.dd.Define.GameType.HLMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('hlmj_desk_info')._jiesuan;
                    break;
                case cc.dd.Define.GameType.JSMJ_GOLD:
                    jiesuan = cc.find('Canvas/desk_info').getComponent('jsmj_desk_info')._jiesuan;
                    break;
            }
            if (jiesuan != null) {
                jiesuan.startTime();
            }
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },
    setEntermin: function (entermin) {
        this.entermin = entermin;
        this.initData();
    },
    initData: function () {
        var playerInfo = PlayerBaseInfoMgr.findPlayerInfoById(cc.dd.user.id);
        if (playerInfo && playerInfo.info && playerInfo.info.vipLevel > 0) {
            var pay_coe = data_vip.items[playerInfo.info.vipLevel * 1].pay_coe;
            this.vip_lvl.string = Text.TEXT_POCHAN_0.format([cc.dd.user.vip_level]);
            this.zengjia_label.string = pay_coe ? pay_coe + '%' : '-';
        }

        var self = this;
        self.buy_list = null;
        var coinList = shop_data.getCoinList();
        coinList.forEach(function (item) {
            if (item.itemCount >= self.entermin && self.buy_list == null) {
                self.buy_list = item;
                self.jinbi_tip.string = cc.dd.Utils.getNumToWordTransform(item.itemCount) + Text.TEXT_POCHAN_1;
                self.jinbi_daoju.string = cc.dd.Utils.getNumToWordTransform(item.itemCount) + Text.TEXT_POCHAN_1;
                self.jiage_label.string = Text.TEXT_POCHAN_2 + (item.costDiscount > 0 ? item.costDiscount / 100 : item.costItemCount / 100);
            }
        });
    },

    //start () {},

    // update (dt) {},
});
