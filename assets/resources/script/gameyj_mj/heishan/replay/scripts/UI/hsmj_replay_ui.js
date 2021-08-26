var com_replay_data = require('com_replay_data').REPLAY_DATA;
var com_replay_ed = require('com_replay_data').REPLAY_ED;
var com_replay_event = require('com_replay_data').REPLAY_EVENT;
var hsmj_cmd = require('c_msg_heishanmj_cmd');
var hsmj_util = require('hsmj_util');

var DeskData = require('hsmj_desk_data').DeskData;

var msg_time_cfg = require('jlmj_msg_time_cfg');

var jlmj_prefab = require('jlmj_prefab_cfg');
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();

var playerMgr = require('hsmj_player_mgr');

var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;


var TOUCH_STATE = cc.Enum({
    TOUCH_UNCLICK:0,    //未点击
    TOUCH_START:  1,    //点击开始
    TOUCH_MOVE:   2,    //点击并移动
    TOUCH_END:    3,    //点击完毕
});

cc.Class({
    extends: cc.Component,

    properties: {
        slider_progress: cc.Slider,
    },

    onLoad: function () {
        this.txt_curProgress = cc.find("handler_bar/cur_num",this.node).getComponent(cc.Label);
        this.txt_allProgress = cc.find("handler_bar/total_num",this.node).getComponent(cc.Label);
        this.btn_play = cc.find("handler_bar/play_btn/play",this.node);
        this.btn_pause = cc.find("handler_bar/play_btn/pause",this.node);
        this.slider_bar = cc.find("handler_bar/slider/Handle",this.node);
        this.node_player_handler = cc.find("handler_bar",this.node);
        this.node_ju_item = cc.find("roundlist/item",this.node);
        this.node_ju_list_content = cc.find("roundlist/scrollView/view/content",this.node);
        this.ani_ju_list = cc.find("roundlist",this.node).getComponent(cc.Animation);
        this.node_changeRound = cc.find("changeRound",this.node);

        this.node_ju_item.active = false;
        this.node.parent.zIndex = 999;

        this.slider_progress.node.on('slide', this.touchSlide.bind(this));
        this.slider_progress.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.slider_progress.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this));

        this.slider_bar.on('slide', this.touchSlide.bind(this));
        this.slider_bar.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.slider_bar.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this));

        this.slider_touch_state = TOUCH_STATE.TOUCH_UNCLICK;

        this.msg_list = this.getSelfMsgList();
        this.cur_progress = 0;
        this.txt_curProgress.string = ''+(this.cur_progress+1);
        this.txt_allProgress.string = ''+this.msg_list.length;

        this.round = 1;

        this.playing = false;
        this.btn_play.active = true;
        this.btn_pause.active = false;
        this.updateJuListUI();
        com_replay_ed.addObserver(this);
        SysED.addObserver(this);

        setTimeout(this.play.bind(this), 1000);
    },

    onDestroy: function () {
        com_replay_ed.removeObserver(this);
        SysED.removeObserver(this);
    },

    /**
     * 获得自己的消息列表 (排除只属于其他玩家的消息)
     */
    getSelfMsgList: function () {
        var msg_list = com_replay_data.Instance().msg_list;

        var self_msg_list = [];
        for(var i=0; i<msg_list.length; ++i){
            //过滤解散消息
            if(msg_list[i].id == hsmj_cmd.cmd_heishan_ack_sponsor_dissolve_room){
                continue;
            }
            if(msg_list[i].id == hsmj_cmd.cmd_heishan_ack_response_dissolve_room){
                continue;
            }
            if(msg_list[i].id == hsmj_cmd.cmd_heishan_ack_dissolve_room){
                continue;
            }
            self_msg_list.push(msg_list[i]);
            //this.slider_progress.node.on('slide', this.touchSlide.bind(this));
        }

        return self_msg_list;
    },

    /**
     * 刷新整个界面
     */
    updateUI: function () {
        // if(!this.playing){
        //     return;
        // }
        this.updateJuListUI();
        this.msg_list = this.getSelfMsgList();
        cc.dd.NetWaitUtil.show('正在缓冲');
        this.pauseMsg();
        //执行第一条消息
        this.resetReplayUI();
        this.cur_progress = 0;
        this.txt_curProgress.string = '' + (this.cur_progress + 1);
        this.txt_allProgress.string = ''+this.msg_list.length;
        this.slider_progress.progress = this.cur_progress/(this.msg_list.length-1);
        this.node.getComponentInChildren('syncPbarSlider').sync();

        playerMgr.Instance().clear();
        DeskData.Instance().clear();
        var id = this.msg_list[this.cur_progress].id;
        var msg = this.msg_list[this.cur_progress].content;
        setTimeout(()=>{
            cc.dd.NetWaitUtil.close();
            this.updateGameUIBeforeMsg(id,msg);
            cc.gateNet.Instance().excuteReplayMsg(id, msg);
            this.updateGameUIAfterMsg();

            var play_list = cc.find('Canvas/player_list').getComponent('hsmj_player_list');
            play_list.updatePlayerCdAni();

            this.playing = false;
            this.btn_play.active = true;
            this.btn_pause.active = false;
            this.play();
        }, 1000)
    },

    /**
     * 更新选局列表
     */
    updateJuListUI: function () {
        this.node_ju_list_content.removeAllChildren(true);
        for(var i=0; i<com_replay_data.Instance().totalRound; ++i){
            var item = cc.instantiate(this.node_ju_item);
            item.active = true;
            item.x = 0;
            item.y = 0;
            item.getChildByName('label').getComponent(cc.Label).string = i+1;
            item.setTag(i+1);
            if( (i+1) == this.round ){
                item.getChildByName('label').color = cc.color('#FFFF00');
            }else{
                item.getChildByName('label').color = cc.color('#FFFFFF');
            }
            item.parent = this.node_ju_list_content;
        }
    },

    /**
     * 选局
     */
    onChangeRound: function (event,custom) {
        jlmj_audio_mgr.com_btn_click();
        if(event.target.getTag() == this.round){
            return;
        }
        com_replay_data.Instance().changeRound(event.target.getTag());
        this.round = event.target.getTag();
    },

    /**
     * 选局回调
     */
    openChangeRoundUI: function () {
        jlmj_audio_mgr.com_btn_click();
        this.node_changeRound.active = false;
        this.ani_ju_list.play('roundlist_in');
    },

    /**
     * 返回回调
     */
    backToReplay: function () {
        jlmj_audio_mgr.com_btn_click();
        this.node_changeRound.active = true;
        this.ani_ju_list.play('roundlist_out');
    },

    /**
     * 存储游戏数据缓存
     * @param idx
     */
    pushGameData: function (idx) {
        if(this.getGameData(idx)){
            return;
        }
        var player_list_clone = playerMgr.Instance().clone();
        var desk_info_clone = DeskData.Instance().clone();
        var game_data = {idx: idx, player_list: player_list_clone, desk_info: desk_info_clone};
        this.game_data_list.push(game_data);
    },

    /**
     * 获取游戏数据缓存
     * @param idx
     * @returns {*}
     */
    getGameData: function (idx) {
        var game_data = null;
        this.game_data_list.forEach(function (item) {
            if(item.idx == idx){
                game_data = item;
            }
        });
        return game_data;
    },

    /**
     * 退出回调
     */
    exitToHall: function () {
        cc.replay_gamedata_scrolling = false;
        jlmj_audio_mgr.com_btn_click();
        hsmj_util.enterHall();
    },

    /**
     * 播放,暂停回调
     */
    play: function () {
        jlmj_audio_mgr.com_btn_click();
        if(this.playing){
            //暂停
            this.btn_play.active = true;
            this.btn_pause.active = false;
            this.pauseMsg();
        }else{
            //播放
            this.playing = true;
            this.btn_play.active = false;
            this.btn_pause.active = true;
            this.playMsg();
        }
    },

    /**
     * 播放回放
     */
    playMsg: function () {
        if(this.cur_progress==this.msg_list.length-1){
            this.btn_play.active = true;
            this.btn_pause.active = false;
            return;
        }
        this.cur_progress++;
        this.txt_curProgress.string = '' + (this.cur_progress + 1);
        this.slider_progress.progress = this.cur_progress/(this.msg_list.length-1);
        this.node.getComponentInChildren('syncPbarSlider').sync();
        var id = this.msg_list[this.cur_progress].id;
        var msg = this.msg_list[this.cur_progress].content;
        this.updateGameUIBeforeMsg(id,msg);
        cc.gateNet.Instance().excuteReplayMsg(id, msg);
        this.updateGameUIAfterMsg();

        this.play_dt = msg_time_cfg.getMsgTime(id);
        this.unschedule(this.playMsg);
        if(!this.playing || this.is_londing){
            return;
        }
        this.scheduleOnce(this.playMsg.bind(this), this.play_dt/1000);
        cc.log("延迟播放消息",this.play_dt);
    },

    /**
     * 暂停回放
     */
    pauseMsg: function () {
        this.unschedule(this.playMsg);
        this.playing = false;
    },

    /**
     * 上一帧回调
     */
    preMsg: function () {
        jlmj_audio_mgr.com_btn_click();
        this.btn_play.active = true;
        this.btn_pause.active = false;
        this.pauseMsg();
        this.resetReplayUI();
        if(this.cur_progress==0){
            return;
        }
        this.cur_progress--;
        this.txt_curProgress.string = '' + (this.cur_progress + 1);
        this.slider_progress.progress = this.cur_progress/(this.msg_list.length-1); //无一条消息的回放
        this.node.getComponentInChildren('syncPbarSlider').sync();

        cc.replay_gamedata_scrolling = true;
        playerMgr.Instance().clear();
        DeskData.Instance().clear();
        this.scroll_idx = 0;
        cc.dd.NetWaitUtil.show('正在缓冲');
        this.preScrollMsg();
    },

    preScrollMsg: function () {
        if(this.scroll_idx<this.cur_progress){
            var id = this.msg_list[this.scroll_idx].id;
            var msg = this.msg_list[this.scroll_idx].content;
            cc.gateNet.Instance().excuteReplayMsg(id, msg);
            this.scroll_idx++;
            this.unschedule(this.preScrollMsg);
            this.scheduleOnce(this.preScrollMsg.bind(this),1/1000);
            //setTimeout(this.preScrollMsg.bind(this),1);
        }else{
            cc.replay_gamedata_scrolling = false;
            this.updateGameUI();
            //执行最后一条
            var id = this.msg_list[this.cur_progress].id;
            var msg = this.msg_list[this.cur_progress].content;
            this.updateGameUIBeforeMsg(id,msg);
            cc.gateNet.Instance().excuteReplayMsg(id, msg);
            this.updateGameUIAfterMsg();
            cc.dd.NetWaitUtil.close();
        }
    },

    /**
     * 下一帧回调
     */
    nextMsg: function () {
        jlmj_audio_mgr.com_btn_click();
        this.btn_play.active = true;
        this.btn_pause.active = false;
        this.pauseMsg();
        if(this.cur_progress==this.msg_list.length-1){
            return;
        }
        this.cur_progress++;
        this.txt_curProgress.string = '' + (this.cur_progress + 1);
        this.slider_progress.progress = this.cur_progress/(this.msg_list.length-1);
        this.node.getComponentInChildren('syncPbarSlider').sync();

        var id = this.msg_list[this.cur_progress].id;
        var msg = this.msg_list[this.cur_progress].content;
        this.updateGameUIBeforeMsg(id,msg);
        cc.gateNet.Instance().excuteReplayMsg(id, msg);
        this.updateGameUIAfterMsg();
    },

    progressMsg: function (sender, eventType) {
        if(this.progress_bar_scrolling){
            return;
        }
        // jlmj_audio_mgr.com_btn_click();
        //var progress = Math.round(this.slider_progress.progress*(this.msg_list.length-1));
        //if(this.cur_progress != progress){
        //this.touchEnd();
        //}
    },

    /**
     * 显示,隐藏进度条
     */
    showPlayerHandler: function () {
        this.node_player_handler.active = !this.node_player_handler.active;
    },

    touchSlide:function (event) {
        cc.log('Slide开始');
        switch (this.slider_touch_state){
            case TOUCH_STATE.TOUCH_UNCLICK:
                this.slider_touch_state = TOUCH_STATE.TOUCH_START;
                this.touchStart();
                break;
            case TOUCH_STATE.TOUCH_START:
                this.slider_touch_state = TOUCH_STATE.TOUCH_MOVE;
                this.touchMove();
                break;
            case TOUCH_STATE.TOUCH_MOVE:
                this.touchMove();
                break;
            case TOUCH_STATE.TOUCH_END:
                this.slider_touch_state = TOUCH_STATE.TOUCH_UNCLICK;
                break;
        }
    },

    touchStart: function () {
        cc.log('滚动开始');

        jlmj_audio_mgr.com_btn_click();
        this.progress_bar_scrolling = true;
        this.is_londing = true;
        this.pauseMsg();
        this.btn_play.active = true;
        this.btn_pause.active = false;
        cc.dd.NetWaitUtil.show('正在缓冲');
    },

    touchMove: function () {
        cc.log('滚动Move');
        this.resetReplayUI();
        this.cur_progress_tmp = Math.round(this.slider_progress.progress*(this.msg_list.length-1));
        this.txt_curProgress.string = '' + (this.cur_progress_tmp + 1);
        this.slider_progress.progress = this.cur_progress_tmp/(this.msg_list.length-1); //进度刷新至准确位置
    },
    /**
     * 滚动进度
     */
    touchEnd: function () {
        cc.log('滚动end');
        this.slider_touch_state = TOUCH_STATE.TOUCH_UNCLICK;
        this.progress_bar_scrolling = false;
        this.resetReplayUI();

        if(this.cur_progress_tmp){
            this.cur_progress = this.cur_progress_tmp;
            this.txt_curProgress.string = this.cur_progress_tmp + '';
            this.slider_progress.progress = this.cur_progress_tmp/(this.msg_list.length-1); //进度刷新至准确位置
            this.cur_progress_tmp = null;
        }else{
            this.cur_progress = Math.round(this.slider_progress.progress*(this.msg_list.length-1));
            this.txt_curProgress.string = '' + (this.cur_progress + 1);
            this.slider_progress.progress = this.cur_progress/(this.msg_list.length-1); //进度刷新至准确位置
        }
        if(this.cur_progress == 0){
            this.cur_progress = 1;
        }
        cc.replay_gamedata_scrolling = true;
        this.scroll_idx = 0;

        this.scheduleOnce(function () {
            this.scrollMsg();
            //this.play();
        }.bind(this),2);
    },

    scrollMsg: function () {
        if(this.progress_bar_scrolling){
            return;
        }
        if(this.scroll_idx<this.cur_progress){
            var id = this.msg_list[this.scroll_idx].id;
            var msg = this.msg_list[this.scroll_idx].content;
            cc.gateNet.Instance().excuteReplayMsg(id, msg);
            this.scroll_idx++;
            this.unschedule(this.scrollMsg);
            this.scheduleOnce(this.scrollMsg.bind(this),1/1000);
        }else{
            if(this.is_londing){
                this.scheduleOnce(function () {
                    cc.dd.NetWaitUtil.close();
                    //this.is_londing = false;
                    this.is_londing = false;
                    this.play();
                    cc.log("----------play----------");
                }.bind(this),2);
            }

            cc.replay_gamedata_scrolling = false;
            this.updateGameUI();

            //执行最后一条
            var id = this.msg_list[this.cur_progress].id;
            var msg = this.msg_list[this.cur_progress].content;
            this.updateGameUIBeforeMsg(id,msg);
            cc.gateNet.Instance().excuteReplayMsg(id, msg);
            this.updateGameUIAfterMsg();

            //cc.dd.NetWaitUtil.close();
        }
    },

    touchCancel: function () {
        cc.log('滚动Cancel');
        this.touchEnd();
    },

    /**
     * 重置回放界面
     */
    resetReplayUI: function () {
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIESUAN);
    },

    /**
     * 更新游戏界面
     */
    updateGameUI: function () {
        var play_list = cc.find('Canvas/player_list').getComponent('hsmj_player_list');
        play_list.playerUpdateUI();
        var desk_info_ui = cc.find('Canvas/desk_info').getComponent('hsmj_desk_info_replay');
        desk_info_ui.updateDesk();
    },

    updateGameUIBeforeMsg: function (id, msg) {
        //非菜单消息,关闭菜单UI
        if(id != hsmj_cmd.cmd_heishan_ack_game_overturn){
            var menu_list = cc.find("Canvas/game_menu_list").getComponent("hsmj_game_menu_list");
            menu_list.closeMenuAndOptions();
            for(var i=1; i<4; ++i){
                var menu_list = cc.find("Canvas/game_menu_list_"+i).getComponent("hsmj_game_menu_list");
                menu_list.closeMenuAndOptions();
            }
        }
        //玩家摸牌消息时,关闭菜单UI
        if(id == hsmj_cmd.cmd_heishan_ack_game_overturn && msg.acttype == 1){
            var menu_list = cc.find("Canvas/game_menu_list").getComponent("hsmj_game_menu_list");
            menu_list.closeMenuAndOptions();
            for(var i=1; i<4; ++i){
                var menu_list = cc.find("Canvas/game_menu_list_"+i).getComponent("hsmj_game_menu_list");
                menu_list.closeMenuAndOptions();
            }
        }
        //非打牌消息,停止打牌动画
        if(id != hsmj_cmd.cmd_heishan_ack_game_send_out_card){
            var play_list = cc.find('Canvas/player_list');
            if(play_list){
                play_list.getComponent('hsmj_player_list').playerStopChuPaiAni();
                play_list.getComponent('hsmj_player_list').playerUpdateZsq();
            }
        }
    },

    updateGameUIAfterMsg: function () {
        //分张时,关闭菜单选项
        if(DeskData.Instance().isFenZhang){
            var menu_list = cc.find("Canvas/game_menu_list").getComponent("hsmj_game_menu_list");
            menu_list.closeMenuAndOptions();
            for(var i=1; i<4; ++i){
                var menu_list = cc.find("Canvas/game_menu_list_"+i).getComponent("hsmj_game_menu_list");
                menu_list.closeMenuAndOptions();
            }
        }
    },

    onEventMessage: function (event, data) {
        switch (event){
            case com_replay_event.ON_GET_DATA:
                this.updateUI();
                break;
            case SysEvent.PAUSE:
                cc.log("SysEvent.PAUSE cc麻将: 游戏切后台");
                // AudioManager.stopMusic();
                this.play();
                break;
            case SysEvent.RESUME:
                cc.log("SysEvent.PAUSE cc麻将: 恢复游戏");
                // AudioManager.rePlayMusic();
                break;
            default:
                break;
        }
    },

});
