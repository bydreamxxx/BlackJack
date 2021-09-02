var dd = cc.dd;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {

        /**
         * 标题
         */
        titleLbl: cc.Label,
        /**
         * 时间
         */
        timeLbl: cc.Label,
        /**
         * day
         */
        dayLabl: cc.Label,
        /**
         * 底图
         */
        bg: cc.Sprite,
        /**
         * 阅读标志
         */
        readSp: cc.Sprite,

        weichakan: cc.SpriteFrame,
        yichakan: cc.SpriteFrame,

        /**
         * 数据
         */
        data: null,
        _clickCallback: null,
    },

    // use this for initialization
    onLoad: function () {
        //this.uiAtals = cc.resources.get("blackjack_hall/atals/gonggao", cc.SpriteAtlas);
    },


    init: function (data, cb) {
        this._clickCallback = cb;
        this.data = data;
        this.titleLbl.string = cc.dd.Utils.subChineseStr(data.title, 0, 42);
        this.dayLabl.string = this.convertDay(data.timestamp);
        this.timeLbl.string = this.convertTime(data.timestamp);
        if (data.read) {
            //this.bg.spriteFrame = this.uiAtals.getSpriteFrame('yichakanxiban');
            this.readSp.spriteFrame = this.yichakan;//this.uiAtals.getSpriteFrame('yichakan');
        } else {
            //this.bg.spriteFrame = this.uiAtals.getSpriteFrame('weichakandiban');
            this.readSp.spriteFrame = this.weichakan;//this.uiAtals.getSpriteFrame('xingfeng');
        }
    },

    itemClick: function () {
        hall_audio_mgr.com_btn_click();

        if (this._clickCallback) {
            this._clickCallback(this.data);
            //this.bg.spriteFrame = this.uiAtals.getSpriteFrame('yichakanxiban');
            this.readSp.spriteFrame = this.yichakan;//this.uiAtals.getSpriteFrame('yichakan');
        }
    },
    /**
     * 转换年月日
     */
    convertDay: function (t) {
        var date = new Date(t * 1000);
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        return currentdate;
    },

    /**
     * 转换具体时间
     */
    convertTime: function (t) {
        var date = new Date(t * 1000);
        var seperator2 = ":";
        var hours = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }
        if (sec >= 0 && sec <= 9) {
            sec = "0" + sec;
        }

        var currentdate = hours + seperator2 + min
            + seperator2 + sec;
        return currentdate;
    },
});
