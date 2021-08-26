var hall_audio_mgr = require('hall_audio_mgr').Instance();
const goodsList = [
    { id: 4001, price: 60 },
    { id: 4002, price: 118 },
    { id: 4003, price: 188 },
    { id: 4004, price: 300 },
]
cc.Class({
    extends: cc.Component,

    properties: {

    },

    closeBtn() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //购买商品
    clickBuy(event, custom) {
        hall_audio_mgr.com_btn_click();
        cc.dd.DialogBoxUtil.show(1, '暂未开放充值，请联系客服', '确定', '', function () { }, null);
        return;
        var itemId = event.target.name;
        var goods = goodsList.find(item => { return item.id == itemId; });
        if (goods)
            cc.dd.PayWeChatH5.iPay(goods.id, goods.price);
    },
});
