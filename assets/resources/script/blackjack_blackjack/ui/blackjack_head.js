var chat_duanyu_item = require('chat_duanyu_item');
var QuickMusicPath =require('jlmj_ChatCfg').QuickMusicPath;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

let ChatEd = require('jlmj_chat_data').ChatEd;
let ChatEvent = require('jlmj_chat_data').ChatEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        headSp: cc.Node,
        nameLabel: cc.Label,
        coin: cc.Label,
        score: cc.Label,

        chupai_ani: cc.Node,
        headAni: cc.Node,
        headQuanSpr: cc.Sprite,
        duanyu_node: cc.Node,
        duanyu_arrow: cc.Node,
        duanyu_label: cc.Label,
        yuyin_laba: require("jlmj_yuyin_laba"),
        biaoqing: cc.Animation,
        magic_prop_layer: cc.Node,
        tuo_guan: cc.Node,

        weak: cc.Node,
        offline: cc.Node,
        standNode: cc.Node,

        CDTime: 10,
        viewIdx: 0,

        chair: cc.Label,
    },

    editor:{
        menu:"BlackJack/blackjack_head"
    },

    onLoad(){
        this.duanyu_node.active = false;
        this.duanyu_arrow.active = false;
        this.biaoqing.node.active = false;
        // this.yuyin_laba.node.active = false;

        ChatEd.addObserver(this);
        cc.dd.native_gvoice_ed.addObserver(this);
    },

    onDestroy(){
        ChatEd.removeObserver(this);
        cc.dd.native_gvoice_ed.removeObserver(this);
    },

    update(dt){
        if(this.startTime) {
            this.remain -= dt;
            if (this.viewIdx === 0) {
                if (this.remain <= 2 && this.remain > 1) {
                    if (!this.playDing) {
                        this.playDing = true;
                        AudioManager.playSound("blackjack_common/audio/ding");
                    }
                }
                if (this.remain <= 1 && this.remain > 0) {
                    if (this.playDing) {
                        this.playDing = false;
                        AudioManager.playSound("blackjack_common/audio/ding");
                    }
                }
            }
            if (this.remain <= 0) {
                this.headAni.getComponent(cc.Animation).stop();
                this.headAni.parent.active = false;
                this.startTime = false;
                if (this.callback) {
                    this.callback();
                }
            } else {
                var ratio = this.remain / this.time;
                this.headQuanSpr.fillRange = ratio;
                var pos = this.getPos(ratio);
                this.headAni.x = pos.x;
                this.headAni.y = pos.y;

                // this.headQuanSpr.node.color = cc.color(255 - this.remain * color_t, this.remain * color_t, 0);
            }
        }
    },

    init(data){
        this.playerData = data;

        this.nameLabel.string = cc.dd.Utils.subChineseStr(data.playerName, 0, 12);
        this.coin.string = data.score;
        this.headSp.getComponent('klb_hall_Player_Head').initHead(data.openId, data.headUrl);
        this.score.string = '';
        this.score.node.active = false;

        this.chair.string = data.seat+1;
    },

    onClickHead(){
        hall_audio_mgr.com_btn_click();

        if(this.playerData){
            cc.dd.UIMgr.openUI("blackjack_common/prefab/user_info", function (node) {
                let ui = node.getComponent('user_info_view');
                ui.updateUI(this.playerData.playerData);
            }.bind(this));
        }
    },

    clear(){
        cc.Tween.stopAllByTarget(this.duanyu_node);

        this.nameLabel.string = '';
        this.coin.string = '';
        this.score.string = '';
        this.score.node.active = false;

        this.tuo_guan.active = false;
        this.stop_chupai_ani();

        this.weak.active = false;
        this.offline.active = false;
        this.standNode.active = true;

        this.playerData = null;
        this.chair.string = "";
    },

    sit(){
        this.standNode.active = false;
    },

    stand(){
        this.standNode.active = true;
    },

    changeCoin(coin){
        if( this.playerData){
            this.playerData.score = coin;
        }
        this.coin.string = coin;
    },

    showCoin(data){
        this.coin.string = data.allCoin;
        let win = parseInt(data.coin)+parseInt(data.insure);
        cc.error(`${this.nameLabel} result ${win}`);
        this.score.string = win > 0 ? `+${win}` : win;
        this.score.node.active = true;
        this.score.node.opacity = 0;
        this.score.node.y = 85.311;
        cc.tween(this.score.node)
            .to(1, {y: 134.112, opacity: 255}, { easing: 'quintOut'})
            .delay(4)
            .to(0.5, {y: 85.311, opacity: 0}, { easing: 'quintIn'})
            .start()
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case ChatEvent.CHAT:
                if(!this.playerData){
                    break;
                }
                if(data.sendUserId == this.playerData.userId){
                    if(data.msgtype == 1){
                        this.play_duanyu(data.id);
                    }else if(data.msgtype == 2){
                        this.play_biaoqing(data.id);
                    }
                }else if(data.toUserId == this.playerData.userId && data.msgtype == 3){
                    this.playMagicProp(data.id,data.sendUserId,data.toUserId);
                }
                break;
            case cc.dd.native_gvoice_event.PLAY_GVOICE:
                cc.log('玩家chat====2  ',event);
                if(!this.playerData){
                    break;
                }
                if(data[0] == this.playerData.userId){
                    this.yuyin_laba.node.active = true;
                    this.yuyin_laba.yuyin_size.node.active = false;
                }
                break;
            case cc.dd.native_gvoice_event.STOP_GVOICE:
                cc.log('玩家chat====3  ',event);
                if(!this.playerData){
                    break;
                }
                if(data[0] == this.playerData.userId){
                    this.yuyin_laba.node.active = false;
                    this.yuyin_laba.yuyin_size.node.active = false;
                }
                break;
            default:
                break;
        }
    },

    /**
     * 播放魔法道具
     * @param idx
     * @param fromId
     * @param toId
     */
    playMagicProp: function (idx,fromId,toId) {

        let heads = cc.find("Canvas").getComponentsInChildren("blackjack_player_ui");
        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        let from_pos = cc.v2(0,0);
        let to_pos = cc.v2(0,0);
        heads.forEach(function (head) {
            if(head.playerData && head.playerData.userId==fromId){
                from_pos = magic_prop.node.convertToNodeSpaceAR(head.node.parent.convertToWorldSpaceAR(head.head_node.position));
            }
            if(head.playerData && head.playerData.userId==toId){
                to_pos = magic_prop.node.convertToNodeSpaceAR(head.node.parent.convertToWorldSpaceAR(head.head_node.position));
            }
        });
        magic_prop.playMagicPropAni(idx,from_pos,to_pos);
    },

    /**
     * 播放短语
     * @param id
     */
    play_duanyu: function (id) {
        let cfg = chat_duanyu_item.getItem(function (itrem) {
            if(itrem.duanyu_id == id){
                return itrem;
            }
        });

        if(cfg == null){
            cc.error("无短语配置 id="+id);
            return;
        }
        this.duanyu_node.active = true;
        this.duanyu_arrow.active = true;
        this.duanyu_label.string = cfg.text;
        if(this.last_duanyu_audio_id != null){
            AudioManager.stopSound(AudioManager.getAudioID(this.last_duanyu_audio_id));
        }
        let sex = this.playerData.sex;
//        let audio = QuickMusicPath + (sex?cfg.boy_audio:cfg.girl_audio);
//        this.last_duanyu_audio_id = audio;
//        AudioManager.playSound(audio);
        setTimeout(function () {
            this.duanyu_node.active = false;
            this.duanyu_arrow.active = false;
        }.bind(this),cfg.duration*1000);
    },

    /**
     * 播放表情
     * @param id
     */
    play_biaoqing: function (id) {
        this.biaoqing.node.active = true;
        this.biaoqing.play("em"+(id - 1));
        setTimeout(function () {
            this.biaoqing.node.active = false;
        }.bind(this),3*1000);
    },

    /**
     * 是否正在聊天
     */
    isChating: function () {
        return this.biaoqing.node.active || this.duanyu_node.active;
    },

    play_yuyin: function (duration) {
        this.yuyin_laba.node.active = true;
        this.yuyin_laba.setYuYinSize(duration);
        setTimeout(function () {
            this.yuyin_laba.node.active = false;
        }.bind(this),duration*1000);
    },

    /**
     * 播放出牌动画
     */
    play_chupai_ani: function (dapaiCD) {
        this.chupai_ani.active = true;
        this.playTimer(this.CDTime,null,dapaiCD);
    },

    /**
     * 停止出牌动画
     */
    stop_chupai_ani: function () {
        this.chupai_ani.active = false;
        this.startTime = false;
    },

    /**
     * 播放倒计时
     * @param {Number} duration  总时间s
     * @param {Function} callback  回调
     * @param {Number} curtime   当前时间s(用于重连)
     */
    playTimer:function(duration, callback, curtime) {
        this.startTime = false;
        if (curtime > duration) {
            curtime = duration;
        }
        // this.headQuanSpr.node.color = cc.color(0, 255, 0);
        var color_t = 255/duration;
        var stepTime = 0.05;
        this.time = duration;
        this.remain = curtime == null ? duration : curtime;
        this.callback = callback;
        var ratio = this.remain / this.time;
        this.headQuanSpr.fillRange = ratio;
        var p = this.getPos(ratio);
        this.headAni.x = p.x;
        this.headAni.y = p.y;
        this.headAni.getComponent(cc.Animation).play();
        this.headAni.parent.active = true;
        this.playDing = this.remain > 2 ? false : true;
        this.startTime = true;
    },

    //计算位置
    getPos:function(value) {
        const Width = 79;
        const Height = 104;
        const Theta = Math.atan(Width / Height);

        value = value < 0 ? 0 : (value > 1 ? 1 : value);
        value = 1 - value;
        var ang = 2 * Math.PI * value;
        var x = NaN, y = NaN;
        if (ang < Theta || ang >= 2 * Math.PI - Theta) {
            y = Height;
        }
        else if (ang < Math.PI - Theta) {
            x = Width;
        }
        else if (ang < Math.PI + Theta) {
            y = -Height;
        }
        else if (ang < 2 * Math.PI - Theta) {
            x = -Width;
        }

        if (ang < Theta) {
            x = Height * Math.tan(ang);
        }
        else if (ang < Math.PI / 2) {
            y = Width * Math.tan(Math.PI / 2 - ang);
        }
        else if (ang < Math.PI - Theta) {
            y = -Width * Math.tan(ang - Math.PI / 2);
        }
        else if (ang < Math.PI) {
            x = Height * Math.tan(Math.PI - ang);
        }
        else if (ang < Math.PI + Theta) {
            x = -Height * Math.tan(ang - Math.PI);
        }
        else if (ang < Math.PI * 3 / 2) {
            y = -Width * Math.tan(Math.PI * 3 / 2 - ang);
        }
        else if (ang < Math.PI * 2 - Theta) {
            y = Width * Math.tan(ang - Math.PI * 3 / 2);
        }
        else {
            x = -Height * Math.tan(Math.PI * 2 - ang);
        }
        return cc.v2(x, y);
    },

    play_banker_duanyu: function (text, time) {
        this.duanyu_node.active = true;
        this.duanyu_arrow.active = true;
        this.duanyu_label.node.getComponent("LanguageLabel").setText(text);
        // this.duanyu_label.string = text;

        cc.Tween.stopAllByTarget(this.duanyu_node);

        cc.tween(this.duanyu_node)
            .delay(time)
            .call(()=>{
                this.duanyu_node.active = false;
                this.duanyu_arrow.active = false;
            })
            .start()
    },
});
