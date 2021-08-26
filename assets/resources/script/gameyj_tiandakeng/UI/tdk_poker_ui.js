/**
 * Created by zhanghuaxiong on 2017/5/16.
 */

var dd = cc.dd;
var tdk = dd.tdk;
var TdkCPlayerData = require('tdk_coin_player_data');
var CPlayerData = TdkCPlayerData.TdkCPlayerMgrData;
var TdkPoker = cc.Class({
    extends: cc.Component,

    properties: {
        number: 13,
        pokerAtlas: cc.SpriteAtlas,
        userId: 0,
        touchStartCB: null,
        idx: 0, //手牌索引

        numSpr: cc.Sprite,
        huasSpr: cc.Sprite,
        huabSpr: cc.Sprite,
        backSpr: cc.Sprite
    },
    hasLoad: false,

    onLoad: function () {
        // this.init();
        this.initUI();
        this.isFace = false;//前两张手牌是否显示正面
        this.showBack();
    },

    initUI: function () {
        var btnnode = cc.find('btn', this.node)

    },

    init: function () {
        var type = parseInt(this.number / 13);
        var num = this.number % 13;
        this.str = '';
        this.hua = 'hs_' + type;
        switch (type) {
            case 0://黑桃
            case 2://梅花
                this.str = 'pkp_b' + num;
                break;
            case 1://红桃
            case 3://方块
                this.str = 'pkp_r' + num;
                break;
            case 4://暗牌
                this.backSpr.node.active = true;
                break;
            default:
                break;
        }

        //this.showFace();
    },

    initC: function () {
        var type = parseInt(this.number / 16);
        var num = this.number % 16;
        if (num == 15)
            num = 14;
        if (num == 2)
            num = 16
        this.str = '';
        switch (type) {
            case 3://黑桃
                this.hua = 'hs_' + 1;
                this.str = 'pkp_b' + (num);
                break;
            case 1://梅花
                this.hua = 'hs_' + 3;
                this.str = 'pkp_b' + (num);
                break;
            case 2://红桃
                this.hua = 'hs_' + 2;
                this.str = 'pkp_r' + (num);
                break;
            case 0://方块
                this.hua = 'hs_' + 4;
                this.str = 'pkp_r' + (num);
                break;
            case 4://暗牌
                this.backSpr.node.active = true;
                break;
            case 5://小王
                this.hua = 'pkp_jokerxiao';
                this.str = 'pkp_b17';
                break;
            case 6: //大王
                this.hua = 'pkp_jokerda';
                this.str = 'pkp_r17';
                break;
            default:
                break;
        }

        //this.showFace();
    },

    setFrame: function (num) {
        this.number = num;
        this.init();
    },

    setCFrame: function (num) {
        this.number = num;
        this.initC();
    },

    showFace: function () {
        var pokerAtlas = cc.resources.get(dd.tdk_resCfg.ATLASS.ATS_POKER, cc.SpriteAtlas);
        if (pokerAtlas) {
            //设置数字
            var frame = pokerAtlas.getSpriteFrame(this.str);
            this.numSpr.spriteFrame = frame;
            //设置花色
            var huaFrame = pokerAtlas.getSpriteFrame(this.hua);
            this.huabSpr.spriteFrame = huaFrame;
            var type = parseInt(this.number / 16);
            this.numSpr.node.scale = 1;
            this.huasSpr.node.scale = 1;
            this.huabSpr.node.scale = 1;
            if (type < 5){
                this.huasSpr.spriteFrame = huaFrame;
                this.numSpr.node.scale = 1.3;
                this.huasSpr.node.scale = 1.2;
                this.huabSpr.node.scale = 1.4;
            }else {
                this.huasSpr.spriteFrame = null;
                this.numSpr.node.scale = 1;
                this.huasSpr.node.scale = 1;
                this.huabSpr.node.scale = 1;
            }
        } else {
            cc.log('牌资源打包集未加载')
        }

        this.backSpr.node.active = false;
        if (this.number == -1)
            this.backSpr.node.active = true;
    },

    showMask: function (state) {
        this.mask = cc.find('mask', this.node);
        this.mask.active = state;
    },

    showBack: function (isForceBack) {
        if (!isForceBack && this.isFace) {
            return;
        }
        this.backSpr.node.active = true;
    },

    hideBack : function(){
        this.backSpr.node.active = false;
    },

    showBorrowTag: function (state) {
        var tag = this.node.getChildByName('tag');
        if (tag) {
            tag.active = state;
        }
    },
    showDipaiTag(state){
        var tag = this.node.getChildByName('tdk_dipai');
        if (tag) {
            tag.active = state;
        }
    },


    addPokertouchStart: function (cb) {
        this.touchStartCB = cb;
    },

    addPokertouchEnd: function (cb) {
        this.touchEndCB = cb;
    },

    flop: function () {
        this.isFace = !this.isFace;
        if (!this.isFace) {
            this.showBack();
            return;
        }
        this.showFace();
    },

    hideBorrowTag: function () {
        var tag = this.node.getChildByName('tag');
        if (tag) {
            tag.active = false;
        }
    },

    reset: function () {
        this.showBack();
        this.isFace = false;
        this.showMask(false);
        this.showBorrowTag(false);
        this.showDipaiTag(false);
    },

    pokerClick: function () {


    },
});