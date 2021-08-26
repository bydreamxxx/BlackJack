var DeskED = require('fxmj_desk_data').DeskED;
var DeskEvent = require('fxmj_desk_data').DeskEvent;
var DeskData = require('fxmj_desk_data').DeskData;

var mj_zhinan_ui = require('mj_zhinan_ui');
var mj_audio = require('mj_audio');

var playerMgr = require('fxmj_player_mgr');
var PlayerED = require("fxmj_player_data").PlayerED;
var PlayerEvent = require("fxmj_player_data").PlayerEvent;


cc.Class({
    extends: mj_zhinan_ui,

    properties: {
    },

    ctor: function() {
        this.prevZhiNan = null;
        this.currZhiNan = null;
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.cd = cc.find("cd",this.node).getComponent(cc.Label);
        var zhinanSprite_0 = cc.find("dong1",this.node).getComponent(cc.Sprite);
        var zhinanSprite_1 = cc.find("nan1",this.node).getComponent(cc.Sprite);
        var zhinanSprite_2 = cc.find("xi1",this.node).getComponent(cc.Sprite);
        var zhinanSprite_3 = cc.find("bei1",this.node).getComponent(cc.Sprite);
        this.zhinanSprite = [zhinanSprite_0,zhinanSprite_1,zhinanSprite_2,zhinanSprite_3];

        var dnxbHigh_0 = cc.find("dong1/zhinan_text",this.node).getComponent(cc.Sprite);
        var dnxbHigh_1 = cc.find("nan1/zhinan_text",this.node).getComponent(cc.Sprite);
        var dnxbHigh_2 = cc.find("xi1/zhinan_text",this.node).getComponent(cc.Sprite);
        var dnxbHigh_3 = cc.find("bei1/zhinan_text",this.node).getComponent(cc.Sprite);
        this.dnxbHigh = [dnxbHigh_0,dnxbHigh_1,dnxbHigh_2,dnxbHigh_3];

        var dnxb_0 = cc.find("sprite_text_down",this.node).getComponent(cc.Sprite);
        var dnxb_1 = cc.find("sprite_text_right",this.node).getComponent(cc.Sprite);
        var dnxb_2 = cc.find("sprite_text_up",this.node).getComponent(cc.Sprite);
        var dnxb_3 = cc.find("sprite_text_left",this.node).getComponent(cc.Sprite);
        this.dnxb = [dnxb_0,dnxb_1,dnxb_2,dnxb_3];

        var frame = this.node.getComponent('mj_zhinan_frame');
        this.zhinan_atlas = frame.getFrame();
        this.init();
    },


    start: function () {
        PlayerED.addObserver(this);
        DeskED.addObserver(this);
    },

    initDirection: function() {
        var selfPos = 0;
        var self_data = playerMgr.Instance().getPlayer(cc.dd.user.id);
        if( DeskData.Instance().isGameStart && self_data) {
            selfPos = self_data.idx;
        } else if(self_data) {
            selfPos = self_data.idx;
        }
        if(playerMgr.Instance().playerList.length == 2){
            selfPos = selfPos>0?selfPos+1:selfPos;
        }
        var spriteNames = this.getArraySpriteNameByPos( selfPos );
        for( var i = 0; i < spriteNames.length; ++i ) {
            this.dnxb[i].spriteFrame = this.zhinan_atlas[spriteNames[i].ordinary];
            this.dnxbHigh[i].spriteFrame = this.zhinan_atlas[spriteNames[i].high];
        }

    },


    onDestroy: function () {
        this._super();
        this.stopCd();
        PlayerED.removeObserver(this);
        DeskED.removeObserver(this);
    },

    dabao: function () {},
    huanbao: function (num) {},
    /**
     * 打骰子结束
     */
    onDaShaZiEnd: function () {},

    onEventMessage:function (event,data) {
        if(cc.replay_gamedata_scrolling){
            return;
        }
        if(! data || !data instanceof Array){
            return;
        }
        this._super(event, data);
        switch (event){
            case DeskEvent.DA_BAO:
                setTimeout(function () {
                    this.dabao();
                }.bind(this),200);
                break;
            case DeskEvent.CHANGE_BAO:
                setTimeout(function () {
                    this.huanbao(data[1]);
                }.bind(this),200);
                break;
            default:
                break;
        }
    },
});
