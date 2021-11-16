var hall_prefab = require('hall_prefab_cfg');
const Hall = require('jlmj_halldata');
const HallCommonData = require('hall_common_data').HallCommonData.getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        nameTxt: cc.Label,
        itemIcon: cc.Sprite,
        itemCount: cc.Label,
        desc1: cc.Label,
        itemInfo: null,
        data: null,
    },

    // use this for initialization
    onLoad: function () {
        Hall.HallED.addObserver(this);
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    initUI: function (itemInfo, data) {
        cc.log("---------------------- " + data),
        this.nameTxt.string = itemInfo.memo;
        var count = data.count;
        var str = '';

        this.itemCount.string = count;
        this.desc1.string = itemInfo.text1;

        cc.dd.ResLoader.loadAtlas("blackjack_hall/atals/itemIcon", function (atlas) {
            var sprite = atlas.getSpriteFrame(itemInfo.key);
            this.itemIcon.spriteFrame = sprite;
        }.bind(this));

        this.itemInfo = itemInfo;
        this.data = data;

    },
    close: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.Use_Item_Ret:
                this.openCodeUI(data);
                break;
        }
    },
});
