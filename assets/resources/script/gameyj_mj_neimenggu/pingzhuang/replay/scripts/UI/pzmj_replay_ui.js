var com_replay_ed = require('com_replay_data').REPLAY_ED;

var msg_time_cfg = require('jlmj_msg_time_cfg');

var SysED = require("com_sys_data").SysED;

const SPEED_TYPE = {
    NORMAL: 300,
    FAST: 1000
};

var replay_ui = require('base_mj_replay_ui');
let mjComponentValue = null;

cc.Class({
    extends: replay_ui,

    properties: {
        // slider_progress: cc.Slider,
        speed: { default: SPEED_TYPE.NORMAL, override: true},
    },

    ctor() {
        mjComponentValue = this.initMJComponet();
        mjConfigValue = this.initMJConfig();
    },

    onLoad: function () {
        this.txt_curProgress = cc.find("handler_bar/cur_num",this.node).getComponent(cc.Label);
        // this.txt_allProgress = cc.find("handler_bar/total_num",this.node).getComponent(cc.Label);
        this.btn_play = cc.find("handler_bar/play_btn/play",this.node);
        this.btn_pause = cc.find("handler_bar/play_btn/pause",this.node);
        // this.slider_bar = cc.find("handler_bar/slider/Handle",this.node);
        // this.node_player_handler = cc.find("handler_bar",this.node);
        // this.node_ju_item = cc.find("roundlist/item",this.node);
        // this.node_ju_list_content = cc.find("roundlist/scrollView/view/content",this.node);
        // this.ani_ju_list = cc.find("roundlist",this.node).getComponent(cc.Animation);
        // this.node_changeRound = cc.find("changeRound",this.node);

        // this.node_ju_item.active = false;
        this.node.zIndex = 999;

        this.speed = SPEED_TYPE.NORMAL;
        this.normal_speed = cc.find("handler_bar/speedButton/cfmj-ysu-btn",this.node);
        this.fast_speed = cc.find("handler_bar/speedButton/cfmj-jsu-btn",this.node);
        this.normal_speed.active = false;
        this.fast_speed.active = true;

        // this.slider_progress.node.on('slide', this.touchSlide.bind(this));
        // this.slider_progress.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        // this.slider_progress.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this));

        // this.slider_bar.on('slide', this.touchSlide.bind(this));
        // this.slider_bar.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        // this.slider_bar.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this));

        // this.slider_touch_state = TOUCH_STATE.TOUCH_UNCLICK;

        this.msg_list = this.getSelfMsgList();
        this.cur_progress = 0;
        this.txt_curProgress.string = ''+(this.cur_progress+1);
        // this.txt_allProgress.string = ''+this.msg_list.length;

        this.round = 1;

        this.playing = false;
        this.btn_play.active = true;
        this.btn_pause.active = false;
        this.updateJuListUI();
        com_replay_ed.addObserver(this);
        SysED.addObserver(this);

        setTimeout(this.play.bind(this), this.speed);
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
        // this.txt_allProgress.string = ''+this.msg_list.length;
        // this.slider_progress.progress = this.cur_progress/(this.msg_list.length-1);
        // this.node.getComponentInChildren('syncPbarSlider').sync();

        this.require_playerMgr.Instance().clear();
        this.require_DeskData.Instance().clear();
        var id = this.msg_list[this.cur_progress].id;
        var msg = this.msg_list[this.cur_progress].content;
        setTimeout(()=>{
            cc.dd.NetWaitUtil.close();
            this.updateGameUIBeforeMsg(id,msg);
            cc.gateNet.Instance().excuteReplayMsg(id, msg);
            this.updateGameUIAfterMsg();

            var play_list = cc.find('Canvas/player_list').getComponent(mjComponentValue.playerList);
            play_list.updatePlayerCdAni();

            this.playing = false;
            this.btn_play.active = true;
            this.btn_pause.active = false;
            this.play();
        }, this.speed)
    },

    /**
     * 更新选局列表
     */
    updateJuListUI: function () {

    },

    /**
     * 播放,暂停回调
     */
    play: function () {
        this.require_jlmj_audio_mgr.com_btn_click();
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
            if(this.cur_progress==this.msg_list.length-1){
                this.cur_progress=1;
                this.preMsg();
            }else{
                this.playMsg();
            }
        }
    },

    /**
     * 播放回放
     */
    playMsg: function () {
        if(this.cur_progress==this.msg_list.length-1){
            this.playing = false;
            this.btn_play.active = true;
            this.btn_pause.active = false;
            return;
        }
        this.cur_progress++;
        this.txt_curProgress.string = '' + (this.cur_progress + 1);
        // this.slider_progress.progress = this.cur_progress/(this.msg_list.length-1);
        // this.node.getComponentInChildren('syncPbarSlider').sync();
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
        this.scheduleOnce(this.playMsg.bind(this), this.play_dt/this.speed);
        cc.log("延迟播放消息",this.play_dt);
    },

    /**
     * 上一帧回调
     */
    preMsg: function () {
        this.require_jlmj_audio_mgr.com_btn_click();
        this.btn_play.active = true;
        this.btn_pause.active = false;
        this.pauseMsg();
        this.resetReplayUI();
        if(this.cur_progress==0){
            return;
        }
        this.cur_progress--;
        this.txt_curProgress.string = '' + (this.cur_progress + 1);
        // this.slider_progress.progress = this.cur_progress/(this.msg_list.length-1); //无一条消息的回放
        // this.node.getComponentInChildren('syncPbarSlider').sync();

        cc.replay_gamedata_scrolling = true;
        this.require_playerMgr.Instance().clear();
        this.require_DeskData.Instance().clear();
        this.scroll_idx = 0;
        cc.dd.NetWaitUtil.show('正在缓冲');
        this.preScrollMsg();
    },

    /**
     * 下一帧回调
     */
    nextMsg: function () {
        this.require_jlmj_audio_mgr.com_btn_click();
        this.btn_play.active = true;
        this.btn_pause.active = false;
        this.pauseMsg();
        if(this.cur_progress==this.msg_list.length-1){
            return;
        }
        this.cur_progress++;
        this.txt_curProgress.string = '' + (this.cur_progress + 1);
        // this.slider_progress.progress = this.cur_progress/(this.msg_list.length-1);
        // this.node.getComponentInChildren('syncPbarSlider').sync();

        var id = this.msg_list[this.cur_progress].id;
        var msg = this.msg_list[this.cur_progress].content;
        this.updateGameUIBeforeMsg(id,msg);
        cc.gateNet.Instance().excuteReplayMsg(id, msg);
        this.updateGameUIAfterMsg();
    },

    /**
     * 显示,隐藏进度条
     */
    showPlayerHandler: function () {
        // this.node_player_handler.active = !this.node_player_handler.active;
    },

    onClickChangeSpeed(){
        this.require_jlmj_audio_mgr.com_btn_click();

        if(this.speed == SPEED_TYPE.FAST){
            this.speed = SPEED_TYPE.NORMAL;
            this.normal_speed.active = false;
            this.fast_speed.active = true;
        }else{
            this.speed = SPEED_TYPE.FAST;
            this.normal_speed.active = true;
            this.fast_speed.active = false;
        }
    },

    initMJConfig(){
        return require('mjConfigValue').nmmj;
    },

    initMJComponet() {
        return require("mjComponentValue").pzmj;
    }
});
