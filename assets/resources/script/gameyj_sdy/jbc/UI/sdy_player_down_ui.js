var PlayerState = require('sdy_player_data').PlayerState;
var PlayerEvent = require('sdy_player_data').PlayerEvent;
var PlayerMgr = require('sdy_player_mgr').PlayerMgr;
var UserPlayerData = require('sdy_userPlayer_data');
var RoomData = require('sdy_room_data').RoomData;
var jlmj_audio_mgr = require('jlmj_audio_mgr');
var view_idx = 0;

var PAI_SELECTED_Y = 40;
var PAI_UNSELECTED_Y = 0;

cc.Class({
    extends: require('sdy_player_base_ui'),

    properties: {
        shoupai_list: [require('sdy_card_ui')],
        touch_node: cc.Node,

        /**
         * 抢分菜单
         */
        menu_jiaofen: cc.Node,
        btn_buqiang: cc.Button,
        btn_qiang_60: cc.Button,
        btn_qiang_65: cc.Button,
        btn_qiang_70: cc.Button,
        txt_qiang_timeout: cc.Label,

        /**
         * 选主牌
         */
        menu_select_color: cc.Node,
        txt_select_timeout: cc.Label,

        /**
         * 扣底牌
         */
        menu_kou_di_pai: cc.Node,
        txt_kou_timeout: cc.Label,
        btn_kou: cc.Button,

        /**
         * 出牌
         */
        menu_chupai: cc.Node,
        txt_chupai_timeout: cc.Label,
        btn_tishi: cc.Button,
        btn_chupai: cc.Button,

        node_tuoguan: cc.Node,
    },

    defaultSet: function () {
        cc.log('player_down_ui', '默认设置');

        this.head.node.active = false;
        this.chupai.node.active = false;

        this.shoupai_list.forEach(function (card) {
            card.node.active = false;
        });
        this.menu_jiaofen.active = false;
        this.menu_select_color.active = false;
        this.menu_kou_di_pai.active = false;
        this.menu_chupai.active = false;

        this.txt_jiaofen.node.active = false;
        this.sp_bujiao.node.active = false;

        this.node_tuoguan.active = false;
        this.head.timeout_ani.node.active = false;

        this.reset_shoupai();
    },

    initUI: function () {
        cc.log('sdy_player_down_ui: initUI');
        this.view_idx = view_idx;
        var player = PlayerMgr.Instance().getPlayerByViewIdx(this.view_idx);
        if(player == null){
            return;
        }
        this.setHeadData(player);
        switch (player.player_state){
            case PlayerState.SDY_PLAYER_STATE_INIT:
                break;
            case PlayerState.SDY_PLAYER_STATE_CALLING:
                this.calling(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_CALLED:
                this.called(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_SELECTING:
                this.selecting(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_SELECTED:
                this.selected(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_KOUING:
                this.kouing(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_KOUED:
                this.koued(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_SENDING:
                this.sending(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_SENDED:
                this.sended(player);
                break;
        }
        this.update_shoupai(player);
        this.regTouchEvent();
        this.tishi_idx = null;
    },

    update_shoupai: function (player) {
        for(var i=0; i<this.shoupai_list.length; i++){
            if(i<player.pokers.length){
                this.shoupai_list[i].node.active = true;
                this.shoupai_list[i].node.y = PAI_UNSELECTED_Y;
                this.shoupai_list[i].selected = false;
                this.shoupai_list[i].setData(player.pokers[i]);
            }else{
                this.shoupai_list[i].node.active = false;
            }
        }
    },

    reset_shoupai: function () {
      this.shoupai_list.forEach(function (pai) {
            pai.node.y =  PAI_UNSELECTED_Y;
            pai.selected = false;
      });
    },

    getSelectedPaiDatas: function () {
        var pais = [];
        this.shoupai_list.forEach(function (pai) {
            if(pai.selected){
                pais.push(pai.data);
            }
        });
        return pais;
    },

    regTouchEvent: function () {
        this.touch_node.on(cc.Node.EventType.TOUCH_START,this.touchStart.bind(this));
        this.touch_node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove.bind(this));
        this.touch_node.on(cc.Node.EventType.TOUCH_END,this.touchEnd.bind(this));
        // this.touch_node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchCancel.bind(this));
    },

    touchStart: function (event) {
        this.pai_touched = this.getTouchPai(event);
    },

    touchMove: function (event) {

    },

    touchEnd: function (event) {
        if(this.pai_touched != null){
            if(this.pai_touched.selected){
                this.pai_touched.selected = false;
                this.pai_touched.node.y = PAI_UNSELECTED_Y;
            }else{
                // if(this.player_state != PlayerState.SDY_PLAYER_STATE_SELECTING){
                //     this.reset_shoupai();
                // }
                this.pai_touched.selected = true;
                this.pai_touched.node.y = PAI_SELECTED_Y;
            }
            this.updateBtnKou();
            this.updateBtnChuPai();
        }
    },

    getTouchPai: function (event) {
        for(var i=this.shoupai_list.length-1; i>=0; i--){
            if(this.shoupai_list[i] && this.shoupai_list[i].node.active && this.shoupai_list[i].isTouch(event)){
                return  this.shoupai_list[i];
            }
        }
        return null;
    },

    getSelectPais: function () {
        var select_pais = [];
        this.shoupai_list.forEach(function (pai) {
            if(pai.node.active && pai.selected){
                select_pais.push(pai);
            }
        });
        return select_pais;
    },

    isKouAble: function () {
        var select_pais = this.getSelectPais();
        return select_pais.length == 6;
    },

    isSendAble: function () {
        var select_pais = this.getSelectPais();
        if(select_pais.length != 1){
            return false;
        }
        var able_pokers = [];
        UserPlayerData.Instance().pokers.forEach(function (poker) {
            if(RoomData.Instance().circle_color == RoomData.Instance().key_poker){
                if(RoomData.Instance().isKeyPoker(poker)){
                    able_pokers.push(poker);
                }
            }else{
                var poker_color = parseInt(poker/100);
                var poker_value = parseInt(poker%100);
                if(poker_color==RoomData.Instance().circle_color && poker_value!=15){
                    able_pokers.push(poker);
                }
            }
        });
        if(able_pokers.length == 0){
            // able_pokers = UserPlayerData.Instance().pokers;
            return true;
        }
        return cc.dd._.indexOf(able_pokers,select_pais[0].data) != -1;
    },

    updateBtnKou: function () {
        if(UserPlayerData.Instance().player_state == PlayerState.SDY_PLAYER_STATE_KOUING){
            this.btn_kou.interactable = this.isKouAble();
        }
    },

    updateBtnChuPai: function () {
        if(UserPlayerData.Instance().player_state == PlayerState.SDY_PLAYER_STATE_SENDING){
            this.btn_chupai.interactable = this.isSendAble();
        }
    },

    buQiang: function () {
        var msg = new cc.pb.sdy.msg_sdy_call_score_req();
        msg.setScore(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_call_score_req, msg, 'msg_sdy_call_score_req', true);
    },

    qiang60: function () {
        var msg = new cc.pb.sdy.msg_sdy_call_score_req();
        msg.setScore(60);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_call_score_req, msg, 'msg_sdy_call_score_req', true);
    },

    qiang65: function () {
        var msg = new cc.pb.sdy.msg_sdy_call_score_req();
        msg.setScore(65);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_call_score_req, msg, 'msg_sdy_call_score_req', true);
    },

    qiang70: function () {
        var msg = new cc.pb.sdy.msg_sdy_call_score_req();
        msg.setScore(70);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_call_score_req, msg, 'msg_sdy_call_score_req', true);
    },

    selectColor1: function () {
        var msg = new cc.pb.sdy.msg_sdy_choice_color_req();
        msg.setColor(1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_choice_color_req, msg, 'msg_sdy_choice_color_req', true);
    },

    selectColor2: function () {
        var msg = new cc.pb.sdy.msg_sdy_choice_color_req();
        msg.setColor(2);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_choice_color_req, msg, 'msg_sdy_choice_color_req', true);
    },

    selectColor3: function () {
        var msg = new cc.pb.sdy.msg_sdy_choice_color_req();
        msg.setColor(3);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_choice_color_req, msg, 'msg_sdy_choice_color_req', true);
    },

    selectColor4: function () {
        var msg = new cc.pb.sdy.msg_sdy_choice_color_req();
        msg.setColor(4);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_choice_color_req, msg, 'msg_sdy_choice_color_req', true);
    },

    kouDiPai: function () {
        var msg = new cc.pb.sdy.msg_sdy_kou_pokers_req();
        var paiDatas = this.getSelectedPaiDatas();
        if(paiDatas.length != 6){
            cc.dd.PromptBoxUtil.show( '选择的底牌数不够!' );
            return;
        }
        msg.setPokersList(paiDatas);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_kou_pokers_req, msg, 'msg_sdy_kou_pokers_req', true);
    },

    tishi: function () {
        var tishi_pokers = [];
        if( RoomData.Instance().circle_color != null ){
            UserPlayerData.Instance().pokers.forEach(function (poker) {
                if(RoomData.Instance().circle_color == RoomData.Instance().key_poker){
                    if( RoomData.Instance().isKeyPoker(poker) ){
                        tishi_pokers.push(poker);
                    }
                }else{
                    var color = parseInt(poker/100);
                    var value = parseInt(poker%100);
                    if(color==RoomData.Instance().circle_color && value!=15 ){
                        tishi_pokers.push(poker);
                    }
                }
            });
            if(tishi_pokers.length == 0){
                tishi_pokers = UserPlayerData.Instance().pokers;
            }
        }else{
            tishi_pokers = UserPlayerData.Instance().pokers;
        }
        if(this.tishi_idx == null){
            this.tishi_idx = tishi_pokers.length - 1;
        }else{
            this.tishi_idx -= 1;
            if(this.tishi_idx < 0){
                this.tishi_idx = tishi_pokers.length - 1;
            }
        }
        var tishi_poker = tishi_pokers[this.tishi_idx];

        this.shoupai_list.forEach(function (shoupai) {
            if(shoupai.data == tishi_poker){
                shoupai.selected = true;
                shoupai.node.y = PAI_SELECTED_Y;
            }else{
                shoupai.selected = false;
                shoupai.node.y = PAI_UNSELECTED_Y;
            }
        }.bind(this));

        this.btn_chupai.interactable = true;
    },

    sendPoker: function () {
        var msg = new cc.pb.sdy.msg_sdy_user_poker_req();
        var paiDatas = this.getSelectedPaiDatas();
        if(paiDatas.length < 1){
            cc.dd.PromptBoxUtil.show( '未选择牌!' );
            return;
        }
        msg.setPoker(paiDatas[0]);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_user_poker_req, msg, 'msg_sdy_user_poker_req', true);
    },

    startCD: function (player) {
        if( cc.dd._.isUndefined(this.txt_timeout) || cc.dd._.isNull(this.txt_timeout) ){
            return;
        }
        if(player.timeout <= 0){
            this.txt_timeout.node.active = false;
            return;
        }
        cc.log('开始CD UI ', player.timeout);
        clearInterval(this.timeout_id);
        this.txt_timeout.node.active = true;
        this.head.timeout_ani.node.active = true;
        this.head.timeout_ani.progress = player.getTimeoutProgress();
        this.play_timeout_ani = true;
        var timeout_func = function () {
            var left_timeout = player.getLeftTimeout();
            this.txt_timeout.string = parseInt(left_timeout);
            if (left_timeout < 0) {
                this.endCD(player);
            }
        }.bind(this);
        timeout_func();
        this.timeout_id = setInterval(timeout_func, 500);
    },

    endCD: function (player) {
        if(player){
            cc.log('结束CD UI ', player.timeout);
        }
        clearInterval(this.timeout_id);
        this.play_timeout_ani = false;
        this.head.timeout_ani.node.active = false;
        if( this.txt_timeout ) {
            this.txt_timeout.node.active = false;
        }
    },

    update: function () {
        if(this.play_timeout_ani){
            var player = PlayerMgr.Instance().getPlayerByViewIdx(this.view_idx);
            this.head.timeout_ani.progress = player.getTimeoutProgress();
        }
    },

    calling: function (player) {
        this.menu_jiaofen.active = true;
        this.txt_timeout = this.txt_qiang_timeout;
        // this.btn_buqiang.interactable = false;
        this.btn_qiang_60.interactable = false;
        this.btn_qiang_65.interactable = false;
        this.btn_qiang_70.interactable = false;
        player.score_list.forEach(function (score) {
            if(score == 60){
                this.btn_qiang_60.interactable = true;
            }else if(score == 65){
                this.btn_qiang_65.interactable = true;
            }else if(score == 70){
                this.btn_qiang_70.interactable = true;
            }
        }.bind(this));
        this.startCD(player);
    },

    called: function (player) {
        this.menu_jiaofen.active = false;
        if(player.call_score == 0){
            this.sp_bujiao.node.active = true;
        }else{
            this.txt_jiaofen.node.active = true;
            this.txt_jiaofen.string = player.call_score;
        }
        this.endCD(player);
    },

    selecting: function (player) {
        this.menu_select_color.active = true;
        this.txt_timeout = this.txt_select_timeout;
        this.startCD(player);
    },

    selected: function (player) {
        this.menu_select_color.active = false;
        this.endCD(player);
        this.update_shoupai(player);
    },

    kouing: function (player) {
        this.menu_kou_di_pai.active = true;
        this.txt_timeout = this.txt_kou_timeout;
        this.startCD(player);
        this.updateBtnKou();
    },

    koued: function (player) {
        this.menu_kou_di_pai.active = false;
        this.endCD(player);
        this.update_shoupai(player);
    },

    sending: function (player) {
        if(this.playing_wave_end_ani){
            setTimeout(function () {
                this.menu_chupai.active = true;
                this.txt_timeout = this.txt_chupai_timeout;
                this.startCD(player);
                this.tishi_idx = null;
                this.updateBtnChuPai();
            }.bind(this),1500);
        }else{
            this.menu_chupai.active = true;
            this.txt_timeout = this.txt_chupai_timeout;
            this.startCD(player);
            this.tishi_idx = null;
            this.updateBtnChuPai();
        }
    },

    sended: function (player) {
        this.menu_chupai.active = false;
        this.endCD(player);
        clearTimeout(this.wave_end_id);
        this.wave_end_id = 0;

        this.chupai.node.active = true;
        this.chupai.setData(player.cur_send_poker);

        this.update_shoupai(player);
        this.reset_shoupai();
    },

    /**
     * 收底牌
     * @param player
     * @param bottom_pokers
     */
    shoudipai: function (player, bottom_pokers) {
        for(var i=0; i<this.shoupai_list.length; i++){
            if(i<player.pokers.length){
                this.shoupai_list[i].node.active = true;
                this.shoupai_list[i].setData(player.pokers[i]);
                if( cc.dd._.indexOf(bottom_pokers,player.pokers[i])!=-1 ){
                    this.shoupai_list[i].selected = true;
                    this.shoupai_list[i].node.y = PAI_SELECTED_Y;
                }else{
                    this.shoupai_list[i].selected = false;
                    this.shoupai_list[i].node.y = PAI_UNSELECTED_Y;
                }
            }else{
                this.shoupai_list[i].node.active = false;
            }
        }
    },

    chongxinfapai: function (player) {
        this.endCD(player);
        this.txt_timeout.node.active = false;
        this.txt_jiaofen.node.active = false;
        this.head.timeout_ani.node.active = false;
        this.sp_bujiao.node.active = false;

        this.menu_jiaofen.active = false;
        this.menu_select_color.active = false;
        this.menu_kou_di_pai.active = false;
        this.menu_chupai.active = false;

        this.node_tuoguan.active = UserPlayerData.Instance().is_auto;
        this.reset_shoupai();
        this.update_shoupai(player);
    },

    tuoguan: function (player) {
        this.node_tuoguan.active = player.is_auto;
    },

    cancelTuoguan: function () {
        jlmj_audio_mgr.Instance().com_btn_click();

        var msg = new cc.pb.sdy.msg_sdy_auto_req();
        msg.setType(2);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_auto_req,msg,'msg_sdy_auto_req',true);
    },

    prepare: function (player) {
        // this.txt_shoupai_num.string = 0;
        // this.txt_timeout.node.active = false;
        this.chupai.node.active = false;
        this.txt_jiaofen.node.active = false;
        this.head.timeout_ani.node.active = false;
        this.sp_bujiao.node.active = false;
        clearInterval(this.timeout_id);

        this.shoupai_list.forEach(function (card) {
            card.node.active = false;
        });
        this.menu_jiaofen.active = false;
        this.menu_select_color.active = false;
        this.menu_kou_di_pai.active = false;
        this.menu_chupai.active = false;
        this.node_tuoguan.active = false;
        this.reset_shoupai();

        this.head.node.active = true;
        this.head.setReady(player.ready);
    },

});
