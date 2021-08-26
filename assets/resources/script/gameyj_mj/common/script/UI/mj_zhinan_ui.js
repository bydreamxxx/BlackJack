var DeskED = require('jlmj_desk_data').DeskED;
var DeskEvent = require('jlmj_desk_data').DeskEvent;

var jlmj_audio_path = require( "jlmj_audio_path" );

var mj_audio = require('mj_audio');

var PlayerED = require("jlmj_player_data").PlayerED;
var PlayerEvent = require("jlmj_player_data").PlayerEvent;

var zhinan_ani_cfg = [
    "jlmj_zhinan_d_texiao",
    "jlmj_zhinan_n_texiao",
    "jlmj_zhinan_x_texiao",
    "jlmj_zhinan_b_texiao"
];

var zhinan_dir_name = [
    "东",
    "南",
    "西",
    "北",
];

cc.Class({
    extends: cc.Component,

    properties: {
        ani_dahuanbao: cc.Node,
        is2d:false,
    },

    ctor: function() {
        this.prevZhiNan = null;
        this.currZhiNan = null;
    },

    // use this for initialization
    onLoad: function () {
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

        this.node_shaizi =  cc.find("shaizi",this.node);
        this.init();
        this.ani = this.node.getComponent(cc.Animation);
        this.db_shaizi = this.node_shaizi.getComponent(dragonBones.ArmatureDisplay);
        this.db_shaizi.node.active = false;
        this.db_dahuanbao = this.ani_dahuanbao.getComponent(dragonBones.ArmatureDisplay);
        this.db_dahuanbao.node.active = false;

        PlayerED.addObserver(this);
        DeskED.addObserver(this);
    },

    init: function() {

        // 初始化东南西北方向
        this.initDirection();

        // this.cd.node.active = false;
        this.zhinanSprite.forEach( function( v, i ) {
            v.node.active = false;
        }.bind( this ) );
        this.stopCd();
    },

    initDirection: function() {},

    getArraySpriteNameByPos: function( selfPos ) {
        var spriteNames = [];
        var fangxiangIdx = ['x','y','s','z'];
        var wenziIdx = ['dong','nan','xi','bei'];
        for( var i = 0; i < 4; ++i ) {
            //普通指示图片
            var spriteOrdinary = "";
            var spriteHighlight = "";

            if(this.is2d){
                spriteOrdinary += "mj-a" + (wenziIdx[(selfPos+i)%4] + '_2d');
                spriteHighlight += "mj-l" + (wenziIdx[(selfPos+i)%4] + '_2d');
            }else{
                spriteOrdinary += "mj-" + fangxiangIdx[i] + "-a" + (wenziIdx[(selfPos+i)%4]);
                spriteHighlight += "mj-" + fangxiangIdx[i] + "-l" + (wenziIdx[(selfPos+i)%4]);
            }

            cc.log('方位---'+spriteOrdinary);

            spriteNames[i] = {ordinary:spriteOrdinary,high:spriteHighlight};
        }
        return spriteNames;
    },

    onDestroy: function () {
        this.stopCd();
        PlayerED.removeObserver(this);
        DeskED.removeObserver(this);
    },

    playDirAni: function (player) {
        if( this.currZhiNan ) {
            this.prevZhiNan = this.currZhiNan;
            this.prevZhiNan.node.active = false;
        }
        this.currZhiNan = this.zhinanSprite[player.viewIdx];
        this.currZhiNan.node.active = true;

        cc.log("【UI】"+"播放指南方向 cd =",player.dapaiCD);
        player.dapaiCD = player.dapaiCD<0?0:player.dapaiCD>99?99:player.dapaiCD;

        this.time_up_audio = player.userId == cc.dd.user.id;
        this.startCd(player.dapaiCD);
    },

    startCd: function (cdTime) {
        this.stopCd();
        this.cd.node.active = true;
        this.cdTime = cdTime;
        this.cd.string = cdTime || '00';
        this.cdFunc = setInterval(function(){
            --this.cdTime;
            if(this.cdTime<0){
                this.stopCd();
            }else{

                if(this.cdTime == 3 && this.time_up_audio){
                    this.cd.string = '0'+this.cdTime;
                    DeskED.notifyEvent(DeskEvent.TIMEUP,[]);
                }else if(this.cdTime<10){
                    this.cd.string = '0'+this.cdTime;
                }else {
                    this.cd.string = this.cdTime;
                }
            }
        }.bind(this),1000);
    },

    stopCd: function () {
        if(this.cdFunc){
            clearInterval(this.cdFunc);
            this.cdFunc = null;
        }
        this.cd.string = "00";
    },

    initsetZhiNan: function( selfIndex ) {
        var spriteNames = this.getArraySpriteNameByPos( selfIndex );
        for( var i = 0; i < spriteNames.length; ++i ) {
            this.dnxb[i].spriteFrame = this.zhinan_atlas[spriteNames[i].ordinary];
            this.dnxbHigh[i].spriteFrame = this.zhinan_atlas[spriteNames[i].high];
        }
    },

    onEventMessage:function (event,data) {
        if(cc.replay_gamedata_scrolling){
            return;
        }
        if(! data || !data instanceof Array){
            return;
        }
        var player = data[0];
        switch (event){
            case PlayerEvent.DAPAI_CDING:
                this.playDirAni(player);
                break;
            case DeskEvent.CLEAR:
                this.init();
                break;
            case DeskEvent.INIT_ZHINAN:
                this.initsetZhiNan( data[0] );
                break;
            default:
                break;
        }
    },
});

