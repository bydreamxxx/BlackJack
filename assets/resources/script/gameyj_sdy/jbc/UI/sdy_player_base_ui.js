var PlayerEvent = require('sdy_player_data').PlayerEvent;
var PlayerED = require('sdy_player_data').PlayerED;
var PlayerMgr = require('sdy_player_mgr').PlayerMgr;

var SdyPlayerBaseUI = cc.Class({
    extends: cc.Component,

    properties: {
        head: require('sdy_player_head_ui'),
        txt_shoupai_num: cc.Label,
        txt_timeout: cc.Label,
        chupai: require('sdy_card_ui'),
        txt_jiaofen: cc.Label,
        sp_bujiao: cc.Sprite,
        wave_end_id: 0,
        play_timeout_ani: false,
        playing_wave_end_ani: false,
    },

    onLoad: function () {
        this.view_idx = 0;
        // this.defaultSet();
        // this.initUI();

        PlayerED.addObserver(this);
    },

    onDestroy: function () {
        PlayerED.removeObserver(this);
    },

    defaultSet: function () {
        cc.log('player_base_ui', '默认设置');

        this.head.node.active = false;
        this.txt_shoupai_num.string = 0;
        this.txt_timeout.node.active = false;
        this.chupai.node.active = false;
        this.txt_jiaofen.node.active = false;
        this.head.timeout_ani.node.active = false;
        this.sp_bujiao.node.active = false;
    },

    initUI: function () {

    },

    update_shoupai: function (player) {
        this.txt_shoupai_num.string = player.pokers_num;
    },

    setHeadData: function (player) {
        this.head.setData(player);
    },

    startCD: function (player) {
        if(player.timeout <= 0){
            return;
        }
        cc.log('开始CD UI ', player.timeout);
        // this.txt_timeout.node.active = true;
        this.head.timeout_ani.node.active = true;
        this.head.timeout_ani.progress = player.getTimeoutProgress();
        this.play_timeout_ani = true;
        clearInterval(this.timeout_id);
        this.timeout_id = setInterval(function () {
            // this.txt_timeout.string = player.timeout;
            // this.head.timeout_ani.progress = player.getTimeoutProgress();
            if(player.timeout<0){
                this.endCD(player);
            }
        }.bind(this), 1000);
    },
    
    endCD: function (player) {
        // cc.log('结束CD UI ', player.timeout);
        // this.txt_timeout.node.active = false;
        this.head.timeout_ani.node.active = false;
        clearInterval(this.timeout_id);
        this.play_timeout_ani = false;
    },

    update: function () {
        if(this.play_timeout_ani){
            var player = PlayerMgr.Instance().getPlayerByViewIdx(this.view_idx);
            this.head.timeout_ani.progress = player.getTimeoutProgress();
        }
    },

    calling: function (player) {
        this.startCD(player);
    },

    called: function (player) {
        this.endCD(player);
        if(player.call_score == 0){
            this.sp_bujiao.node.active = true;
        }else{
            this.txt_jiaofen.node.active = true;
            this.txt_jiaofen.string = player.call_score;
        }
    },

    /**
     * 叫分结束
     */
    callEnd: function () {
        this.txt_jiaofen.node.active = false;
        this.sp_bujiao.node.active = false;
    },

    selecting: function (player) {
        this.startCD(player);
    },

    selected: function (player) {
        this.endCD(player);
    },

    kouing: function (player) {
        this.startCD(player);
    },

    koued: function (player) {
        this.txt_shoupai_num.string = player.pokers_num;
        this.endCD(player);
    },

    sending: function (player) {
        this.startCD(player);
    },

    sended: function (player) {
        this.endCD(player);
        clearTimeout(this.wave_end_id);
        this.wave_end_id = 0;

        this.chupai.node.active = true;
        this.chupai.setData(player.cur_send_poker);

        this.txt_shoupai_num.string = player.pokers_num;
    },

    shoudipai: function (player) {
        this.txt_shoupai_num.string = player.pokers_num;
    },
    
    chongxinfapai: function (player) {
        this.endCD(player);
        this.txt_shoupai_num.string = player.pokers_num;
        this.txt_jiaofen.node.active = false;
        this.head.timeout_ani.node.active = false;
        this.sp_bujiao.node.active = false;
    },

    waveEnd: function () {
        this.playing_wave_end_ani = true;
        this.wave_end_id = setTimeout(function () {
            this.chupai.node.active = false;
            this.playing_wave_end_ani = false;
        }.bind(this),1500);
    },

    tuoguan: function (player) {

    },
    
    prepare: function (player) {
        this.txt_shoupai_num.string = 0;
        this.txt_timeout.node.active = false;
        this.chupai.node.active = false;
        this.txt_jiaofen.node.active = false;
        this.head.timeout_ani.node.active = false;
        this.sp_bujiao.node.active = false;
        clearInterval(this.timeout_id);
        this.head.node.active = true;
        this.head.setReady(player.ready)
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        if (!data || !data instanceof Array) {
            return;
        }
        var player = data[0];
        this.sex = player.sex;
        if (this.view_idx != player.view_idx) {
            return;
        }

        switch (event){
            case PlayerEvent.SDY_PLAYER_EVENT_INIT:
                this.initUI();
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_CALLING:
                this.calling(player);
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_CALLED:
                this.called(player);
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_BANKER:
                this.head.becomeBanker();
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_SELECTING:
                this.selecting(player);
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_SELECTED:
                this.selected(player);
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_KOUING:
                this.kouing(player);
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_KOUED:
                this.koued(player);
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_SENDING:
                this.sending(player);
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_SENDED:
                this.sended(player);
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_BANKER:
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_SHOUDIPAI:
                this.shoudipai(player);
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_CHONGXINFAPAI:
                this.chongxinfapai(player);
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_TUOGUAN:
                this.tuoguan(player);
                break;
            default:
                break;
        }
    },

});

module.exports = SdyPlayerBaseUI;
