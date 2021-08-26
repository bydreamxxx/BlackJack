var RoomEvent = require('sdy_room_data').RoomEvent;
var RoomED = require('sdy_room_data').RoomED;
var RoomData = require('sdy_room_data').RoomData;
var SdySmallColorCfg = require('sdy_card_cfg').SdySmallColorCfg;
var SdyScoreCfg = require('sdy_card_cfg').SdyScoreCfg;

var commonRoomED = require( "jlmj_room_mgr" ).RoomED;
var commonRoomEvent = require( "jlmj_room_mgr" ).RoomEvent;

var PlayerMgr = require('sdy_player_mgr').PlayerMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        base_fen_node: cc.Node,
        key_color: cc.Sprite,
        call_score: cc.Label,
        get_score: cc.Label,

        desk_bottom_pais: [require('sdy_card_ui')],
        score_cards: [require('sdy_small_card_ui')],
        small_bottom_cards: [require('sdy_small_card_ui')],

        color_select_ani: cc.Sprite,
        dapai_result_ani: cc.Sprite,

        atlas: cc.SpriteAtlas,
        atlas_dapai_result: cc.SpriteAtlas,
    },

    onLoad: function () {
        this.defaultSet();
        this.initUI();
        // var jiesuan_mask = cc.find('Canvas/jiesuan_mask');
        // if(jiesuan_mask){
        //     jiesuan_mask.active = false;
        // }
        RoomED.addObserver(this);
        commonRoomED.addObserver(this);
    },

    onDestroy: function () {
        RoomED.removeObserver(this);
        commonRoomED.removeObserver(this);
    },

    defaultSet: function () {
        cc.log('sdy_base_score_ui', '默认设置');
        this.base_fen_node.active = true;
        this.key_color.node.active = false;
        this.call_score.node.active = false;
        this.get_score.node.active = false;

        this.desk_bottom_pais.forEach(function (pai) {
            pai.node.active = false;
        });
        this.score_cards.forEach(function (pai) {
            pai.node.active = false;
        });
        this.small_bottom_cards.forEach(function (pai) {
            pai.node.active = false;
        });

        this.color_select_ani.node.active = false;
        this.dapai_result_ani.node.active = false;
    },

    initUI: function () {
        cc.log('sdy_base_score_ui', 'initUI');
        this.base_fen_node.active = true;
        //叫分
        if(RoomData.Instance().call_score!=null){
            this.base_fen_node.active = true;
            this.call_score.node.active = true;
            this.call_score.string = RoomData.Instance().call_score;
        }
        //主牌花色
        if(RoomData.Instance().key_poker!=null){
            this.base_fen_node.active = true;
            this.key_color.node.active = true;
            // var atlas = cc.loader.getRes("gameyj_ddz/bsc/atlas/ddz_poker",cc.SpriteAtlas);
            this.key_color.spriteFrame = this.atlas.getSpriteFrame(SdySmallColorCfg[RoomData.Instance().key_poker].frame_name);
        }
        //闲家得分
        if(RoomData.Instance().score_pokers!=null){
            this.base_fen_node.active = true;
            this.get_score.node.active = true;
            var all_score = 0;
            RoomData.Instance().score_pokers.forEach(function (poker) {
                var value = parseInt(poker%100);
                all_score += SdyScoreCfg[value];
            });
            this.get_score.string = all_score;
            for(var i=0; i<this.score_cards.length; ++i){
                if(i<RoomData.Instance().score_pokers.length){
                    this.score_cards[i].node.active = true;
                    this.score_cards[i].setData(RoomData.Instance().score_pokers[i]);
                }else{
                    this.score_cards[i].node.active = false;
                }
            }
        }
        //小底牌
        if(RoomData.Instance().bottom_pokers!=null){
            for(var i=0; i<this.small_bottom_cards.length; ++i){
                if(i<RoomData.Instance().bottom_pokers.length){
                    this.small_bottom_cards[i].node.active = true;
                    this.small_bottom_cards[i].setData(RoomData.Instance().bottom_pokers[i]);
                }else{
                    this.small_bottom_cards[i].node.active = false;
                }
            }
        }
    },

    dealBottomPais: function () {
        for(var i=0; i<RoomData.Instance().bottom_pokers.length; ++i){
            this.desk_bottom_pais[i].node.active = true;
            this.desk_bottom_pais[i].setData(RoomData.Instance().bottom_pokers[i]);
        }

        setTimeout(function () {
            this.desk_bottom_pais.forEach(function (pai) {
                pai.node.active = false;
            });
        }.bind(this),1500);
    },

    updateSmallBottomPais: function (data) {
        for(var i=0; i<this.small_bottom_cards.length; ++i){
            if(i<data[0].bottom_pokers.length){
                this.small_bottom_cards[i].node.active = true;
                this.small_bottom_cards[i].setData(data[0].bottom_pokers[i]);
            }else{
                this.small_bottom_cards[i].node.active = false;
            }
        }
    },

    onColorSelected: function (data) {
        this.base_fen_node.active = true;
        this.key_color.node.active = true;
        // var atlas = cc.loader.getRes("gameyj_ddz/bsc/atlas/ddz_poker",cc.SpriteAtlas);
        var sprite_frame = this.atlas.getSpriteFrame(SdySmallColorCfg[data[0].key_poker].frame_name);
        this.key_color.spriteFrame = sprite_frame;

        this.color_select_ani.node.active = true;
        this.color_select_ani.spriteFrame = sprite_frame;
        setTimeout(function () {
            this.color_select_ani.node.active = false;
        }.bind(this),1500);
    },

    onGetScore: function (data) {
        this.base_fen_node.active = true;
        this.get_score.node.active = true;
        var all_score = 0;
        data[0].score_pokers.forEach(function (poker) {
            var value = parseInt(poker%100);
            all_score += SdyScoreCfg[value];
        });
        this.get_score.string = all_score;
        for(var i=0; i<this.score_cards.length; ++i){
            if(i<data[0].score_pokers.length){
                this.score_cards[i].node.active = true;
                this.score_cards[i].setData(data[0].score_pokers[i]);
            }else{
                this.score_cards[i].node.active = false;
            }
        }

        if(RoomData.Instance().score_type == 0){
            return;
        }
        var dapai_result_texiao = ["","guangpaifont","shangchefont","popaifont","koudifont"];
        var sprite_frame = this.atlas_dapai_result.getSpriteFrame(dapai_result_texiao[RoomData.Instance().score_type]);
        this.dapai_result_ani.node.active = true;
        this.dapai_result_ani.spriteFrame = sprite_frame;
        setTimeout(function () {
            this.dapai_result_ani.node.active = false;
        }.bind(this),1500);
    },

    onEventMessage:function (event,data) {
        switch (event){
            case RoomEvent.SDY_ROOM_EVENT_CALLSCOREEND:
                this.base_fen_node.active = true;
                this.call_score.node.active = true;
                this.call_score.string = data[0].call_score;
                break;
            case RoomEvent.SDY_ROOM_EVENT_SELECTCOLOR:
                this.onColorSelected(data);
                break;
            case RoomEvent.SDY_ROOM_EVENT_KOUDIPAI:
                //todo
                break;
            case RoomEvent.SDY_ROOM_EVENT_GETSCORE:
                this.onGetScore(data);
                break;
            case RoomEvent.SDY_ROOM_EVENT_DEALDIPAI:
                this.dealBottomPais();
                this.updateSmallBottomPais(data);
                break;
            case RoomEvent.SDY_ROOM_EVENT_RECONNECT:
                this.initUI();
                break;
            case RoomEvent.SDY_ROOM_EVENT_CHONGXINFAPAI:
                this.defaultSet();
                break;
            case commonRoomEvent.on_room_replace: //换桌成功
                PlayerMgr.Instance().clear();
                RoomData.Instance().clear();
                this.defaultSet();
                break;
            case commonRoomEvent.on_room_ready:
                RoomData.Instance().clear();
                this.defaultSet();
                break;
            default:
                break;
        }
    },

});
