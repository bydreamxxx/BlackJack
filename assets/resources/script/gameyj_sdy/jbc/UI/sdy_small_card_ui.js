var RoomData = require('sdy_room_data').RoomData;
var SdySmallColorCfg = require('sdy_card_cfg').SdySmallColorCfg;
var SdyBigColorCfg = require('sdy_card_cfg').SdyBigColorCfg;
var SdyBlackValueCfg = require('sdy_card_cfg').SdyBlackValueCfg;
var SdyRedValueCfg = require('sdy_card_cfg').SdyRedValueCfg;
var SdyWangColorCfg = require('sdy_card_cfg').SdyWangColorCfg;
var SdyWangValueCfg = require('sdy_card_cfg').SdyWangValueCfg;

cc.Class({
    extends: cc.Component,

    properties: {
        value: cc.Sprite,
        color: cc.Sprite,
        atlas: cc.SpriteAtlas,
    },

    onLoad: function () {

    },

    setData: function (poker) {
        this.data = poker;

        if( poker >= 601 ){
            //大小王
            this.color.node.active = false;
            this.value.node.active = true;

            this.value.spriteFrame = this.atlas.getSpriteFrame(SdyWangValueCfg[poker].frame_name);
            this.value.node.width = this.value.spriteFrame.getRect().width;
            this.value.node.height = this.value.spriteFrame.getRect().height;
        }else{
            this.value.node.active = true;
            this.color.node.active = true;

            this.poker_color = parseInt(poker/100);
            this.poker_value = parseInt(poker%100);

            //小花色
            this.color.spriteFrame = this.atlas.getSpriteFrame(SdySmallColorCfg[this.poker_color].frame_name);
            this.color.node.width = this.color.spriteFrame.getRect().width;
            this.color.node.height = this.color.spriteFrame.getRect().height;
            //牌值
            var valueCfg = (this.poker_color==1||this.poker_color==4)?SdyRedValueCfg:SdyBlackValueCfg;
            this.value.spriteFrame = this.atlas.getSpriteFrame(valueCfg[this.poker_value].frame_name);
            this.value.node.width = this.value.spriteFrame.getRect().width;
            this.value.node.height = this.value.spriteFrame.getRect().height;
        }
    },

});
