var DeskED = require('fxmj_desk_data').DeskED;
var DeskEvent = require('fxmj_desk_data').DeskEvent;
var DeskData = require('fxmj_desk_data').DeskData;

var mj_audio = require('mj_audio');

var playerMgr = require('fxmj_player_mgr');
var PlayerED = require("fxmj_player_data").PlayerED;
var PlayerEvent = require("fxmj_player_data").PlayerEvent;


cc.Class({
    extends: cc.Component,

    properties: {
    },

    ctor: function() {
        this.prevZhiNan = null;
        this.currZhiNan = null;
    },

    // use this for initialization
    onLoad: function () {
        this.cd = cc.find("cd",this.node).getComponent(cc.Label);
        this.zhinandizuo = cc.find("zhinan_dizuo",this.node);
        var zhinanfw_0 = cc.find("zhinan_dizuo/dong",this.node);
        var zhinanfw_1 = cc.find("zhinan_dizuo/nan",this.node);
        var zhinanfw_2 = cc.find("zhinan_dizuo/xi",this.node);
        var zhinanfw_3 = cc.find("zhinan_dizuo/bei",this.node);
        this.zhinanSprite = [zhinanfw_0,zhinanfw_1,zhinanfw_2,zhinanfw_3];
        this.init();
    },

    start: function () {
        PlayerED.addObserver(this);
        DeskED.addObserver(this);
    },

    init: function() {

        // 初始化东南西北方向
        this.initDirection();

        // this.cd.node.active = false;
        this.zhinanSprite.forEach( function( v, i ) {
            v.active = false;
        }.bind( this ) );
        this.stopCd();
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
        this.stopCd();
        PlayerED.removeObserver(this);
        DeskED.removeObserver(this);
    },


    getArraySpriteNameByPos: function( selfPos ) {
        var wenziIdx = [0,90,180,270];
        var weizhi = wenziIdx[selfPos];
        return weizhi;
    },

    playDirAni: function (player) {
        if( this.currZhiNan ) {
            this.prevZhiNan = this.currZhiNan;
            this.prevZhiNan.active = false;
        }
        this.currZhiNan = this.zhinanSprite[player.viewIdx];
        this.currZhiNan.active = true;

        cc.log("【UI】"+"播放指南方向 cd =",player.dapaiCD);
        player.dapaiCD = player.dapaiCD<0?0:player.dapaiCD>99?99:player.dapaiCD;
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
                if(this.cdTime<10){
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
        var spritePos = this.getArraySpriteNameByPos( selfIndex );
        this.zhinandizuo.setRotation(spritePos);
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
