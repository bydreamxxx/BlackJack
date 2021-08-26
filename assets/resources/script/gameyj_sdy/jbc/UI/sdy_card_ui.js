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
        zhu: cc.Node,
        value: cc.Sprite,
        s_color: cc.Sprite,
        b_color: cc.Sprite,
        // wang_value: cc.Sprite,
        // wang_color: cc.Sprite,
        atlas: cc.SpriteAtlas,
        sp_beimian: cc.Sprite,
    },

    setData: function (poker) {
        this.sp_beimian.node.active = false;

        this.data = poker;

        if( poker >= 601 ){
            //大小王
            this.zhu.active = false;
            this.s_color.node.active = false;
            this.value.node.active = true;
            this.b_color.node.active = true;

            this.value.spriteFrame = this.atlas.getSpriteFrame(SdyWangValueCfg[poker].frame_name);
            this.value.node.width = this.value.spriteFrame.getRect().width;
            this.value.node.height = this.value.spriteFrame.getRect().height;
            this.b_color.spriteFrame = this.atlas.getSpriteFrame(SdyWangColorCfg[poker].frame_name);
            this.b_color.node.width = this.b_color.spriteFrame.getRect().width;
            this.b_color.node.height = this.b_color.spriteFrame.getRect().height;
        }else{
            this.zhu.active = true;
            this.value.node.active = true;
            this.s_color.node.active = true;
            this.b_color.node.active = true;

            this.color = parseInt(poker/100);
            this.poker_value = parseInt(poker%100);

            //主牌标识
            if(RoomData.Instance().isKeyPoker(poker) && this.poker_value!=15){
                this.zhu.active = true;
            }else{
                this.zhu.active = false;
            }
            //小花色
            this.s_color.spriteFrame = this.atlas.getSpriteFrame(SdySmallColorCfg[this.color].frame_name);
            this.s_color.node.width = 34;
            this.s_color.node.height = 38;
            //大花色
            this.b_color.spriteFrame = this.atlas.getSpriteFrame(SdyBigColorCfg[this.color].frame_name);
            this.b_color.node.width = this.b_color.spriteFrame.getRect().width;
            this.b_color.node.height = this.b_color.spriteFrame.getRect().height;
            //牌值
            var valueCfg = (this.color==1||this.color==4)?SdyRedValueCfg:SdyBlackValueCfg;
            this.value.spriteFrame = this.atlas.getSpriteFrame(valueCfg[this.poker_value].frame_name);
            this.value.node.width = this.value.spriteFrame.getRect().width;
            this.value.node.height = this.value.spriteFrame.getRect().height;
        }
    },

    isTouch:function (event) {
        if(!this.node.active){
            return false;
        }
        if (this.node.getBoundingBoxToWorld().contains(event.touch.getLocation())) {
            return true;
        }
        return false;
    },
});
