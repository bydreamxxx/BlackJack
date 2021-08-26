let hall_audio_mgr = require('hall_audio_mgr').Instance();
let BRNN_ED = require('brnn_data').BRNN_ED;
let BRNN_Event = require('brnn_data').BRNN_Event;
let brnn_Data = require('brnn_data').brnn_Data.Instance();
let brnn_send_msg = require('net_sender_brnn');
let RoomMgr = require('jlmj_room_mgr').RoomMgr;
let brnn_audio_cfg = require('brnn_audio_cfg');
let AudioManager = require('AudioManager');
let ChatEvent = require('jlmj_chat_data').ChatEvent;
let game_room = require("game_room");
let ChatEd = require('jlmj_chat_data').ChatEd;
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
let jlmj_prefab = require('jlmj_prefab_cfg');
let hall_prop_data = require('hall_prop_data').HallPropData;
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
let brnn_chip = require('brnn_chip');
let SysED = require("com_sys_data").SysED;
let SysEvent = require("com_sys_data").SysEvent;
let hallData = require('hall_common_data').HallCommonData;
const chipList = [[2, 10, 20, 100], [200, 500, 1000, 5000], [2000, 4000, 10000, 50000], [6000, 20000, 40000, 100000]];
const INIT_CHIPNUM = 1000;
cc.Class({
    extends: cc.Component,

    properties: {
        chipPrefab: cc.Prefab,
        pokerAtlas: cc.SpriteAtlas,
        splist_chip: [cc.SpriteFrame],
        splist_zhanji: [cc.SpriteFrame],
        splist_role: [cc.SpriteFrame],
        splist_flag: [cc.SpriteFrame],
        fontlist_win_lose: [cc.Font],
        splist_cardtype: [cc.SpriteFrame],
        splist_shengfu: [cc.SpriteFrame],
        splist_zhuobu: [cc.SpriteFrame],
        splist_reqbank: [cc.SpriteFrame],
        music_Slider: { default: null, type: cc.Slider, tooltip: '音乐滑动条' },
        sound_Slider: { default: null, type: cc.Slider, tooltip: '音效滑动条' },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        RoomMgr.Instance().player_mgr = brnn_Data;

        //************************ 筹码对象池 ****************************/
        this._chipPool = new cc.NodePool('chipPool');
        for (var i = 0; i < INIT_CHIPNUM; i++) {
            var node = cc.instantiate(this.chipPrefab);
            this._chipPool.put(node);
        }

        this.music_Node = cc.find('setting/bg/content/music', this.node);
        this.sound_Node = cc.find('setting/bg/content/sound', this.node);
        this.betArea = [];
        this.node_setting = cc.find('setting', this.node);
        this.node_menu = cc.find('menu', this.node);
        this.btn_menu = cc.find('bottom/btns/more', this.node);
        this.node_guize = cc.find('guize', this.node);
        this.betArea[1] = cc.find('mid/tian/bet_area_1', this.node);
        this.betArea[2] = cc.find('mid/di/bet_area_2', this.node);
        this.betArea[3] = cc.find('mid/xuan/bet_area_3', this.node);
        this.betArea[4] = cc.find('mid/huang/bet_area_4', this.node);
        this.bankerHeads = [];
        for (var i = 1; i < 19; i++) {
            this.bankerHeads.push(cc.find('top/banker_list/head_' + i + '/head_mask/head', this.node));
        }
        this.bigWinnerHeads = [];
        for (var i = 1; i < 6; i++) {
            this.bigWinnerHeads.push(cc.find('bigwinner/head_' + i, this.node));
        }
        this.throwPos = cc.find('bottom/btns/people', this.node);
        this.bankerPos = cc.find('top/bank', this.node);
        this.time_lbl = cc.find('top/time', this.node).getComponent(cc.Label);
        this.updateTime();
        this.schedule(function () {
            this.updateTime();
        }.bind(this), 5.0);

        this._chipGroup = 0;
        this._chipIdx = 1;
        BRNN_ED.addObserver(this);
        ChatEd.addObserver(this);
        RoomED.addObserver(this);
        HallCommonEd.addObserver(this);
        SysED.addObserver(this);
        this.initMusicAndSound();
        this.initZhuoBu();
    },

    getChipNode() {
        let node = this._chipPool.get();
        if (!node) {
            node = cc.instantiate(this.chipPrefab);
        }
        return node;
    },

    onDestroy() {
        this._chipPool.clear();
        BRNN_ED.removeObserver(this);
        ChatEd.removeObserver(this);
        RoomED.removeObserver(this);
        SysED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        AudioManager.getInstance().stopMusic();
        AudioManager.getInstance().stopAllLoopSound();
    },

    //CUSTOM FUNCTIONS:

    //上庄返回
    bankRet(msg) {
        if (msg.type == 1) {
            switch (msg.result) {
                case 0://成功
                    this.updateReqBankNum();
                    break;
                case -1:
                    cc.dd.PromptBoxUtil.show('金币不足，无法上庄！');
                    break;
                case -2:
                    cc.dd.PromptBoxUtil.show('庄家人数已满');
                    break;
            }
        }
        else if (msg.type == 2) {
            if (brnn_Data.getPlayerById(cc.dd.user.id).isBanker) {
                cc.find('top/bank_btn', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_reqbank[0];
                cc.find('top/bank_btn', this.node).getComponent(cc.Button).interactable = false;
            }
            else {
                this.updateReqBankNum();
                cc.find('top/bank_btn', this.node).getComponent(cc.Button).interactable = false;
            }
        }
    },

    //筹码飞动画
    chipsFly() {
        let flyTime = 1;
        let waitTime = 0.1;
        let winbankerlist = brnn_Data.getIsWinBankerList();
        let bwinlist = [];
        let bloselist = [];
        winbankerlist.forEach(element => {
            if (element.isWinBanker == 1) {
                bloselist.push(element.id);
            }
            else {
                bwinlist.push(element.id);
            }
        });
        let totalChipNum = 0;
        for (var i = 1; i < 5; i++) {
            totalChipNum += this.betArea[i].childrenCount;
            cc.find('pokers', this.betArea[i].parent).setSiblingIndex(0);
        }
        let curChipNum = 0;
        if (bwinlist.length > 0 && bloselist.length > 0) {
            for (var i = 0; i < bwinlist.length; i++) {
                var id = bwinlist[i];
                if (id < 5) {
                    var endpos = this.bankerPos.convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.betArea[id].convertToWorldSpaceAR(cc.v2(0, 0)));
                    for (var j = 0; j < this.betArea[id].childrenCount; j++) {
                        // var move = cc.moveTo(flyTime, endpos).easing(cc.easeExponentialInOut());
                        // var del = cc.removeSelf();
                        // if (++curChipNum == totalChipNum) {
                        //     var comp = cc.callFunc(this.showResult, this);
                        //     var action = cc.sequence(move, del, comp);
                        // }
                        // else {
                        //     var action = cc.sequence(move, del);
                        // }
                        // this.betArea[id].children[j].runAction(action);
                        if (++curChipNum == totalChipNum) {
                            this.betArea[id].children[j].getComponent(brnn_chip).fly2Remove(0, flyTime, endpos, this._chipPool, this.showResult.bind(this));
                        }
                        else {
                            this.betArea[id].children[j].getComponent(brnn_chip).fly2Remove(0, flyTime, endpos, this._chipPool, null);
                        }
                    }
                }
            }
            for (var i = 0; i < bloselist.length; i++) {
                var id = bloselist[i];
                if (id < 5) {
                    var endpos = this.throwPos.convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.betArea[id].convertToWorldSpaceAR(cc.v2(0, 0)));
                    for (var j = 0; j < this.betArea[id].childrenCount; j++) {
                        // var delay = cc.delayTime(flyTime + waitTime);
                        // var move = cc.moveTo(flyTime, endpos).easing(cc.easeExponentialInOut());
                        // var del = cc.removeSelf();
                        // if (++curChipNum == totalChipNum) {
                        //     var comp = cc.callFunc(this.showResult, this);
                        //     var action = cc.sequence(delay, move, del, comp);
                        // }
                        // else {
                        //     var action = cc.sequence(delay, move, del);
                        // }
                        // this.betArea[id].children[j].runAction(action);
                        if (++curChipNum == totalChipNum) {
                            this.betArea[id].children[j].getComponent(brnn_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, this.showResult.bind(this));
                        }
                        else {
                            this.betArea[id].children[j].getComponent(brnn_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, null);
                        }
                    }
                }
            }
        }
        else if (bwinlist.length > 0) {
            for (var i = 0; i < bwinlist.length; i++) {
                var id = bwinlist[i];
                var endpos = this.bankerPos.convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.betArea[id].convertToWorldSpaceAR(cc.v2(0, 0)));
                for (var j = 0; j < this.betArea[id].childrenCount; j++) {
                    // var delay = cc.delayTime(flyTime + waitTime);
                    // var move = cc.moveTo(flyTime, endpos).easing(cc.easeExponentialInOut());
                    // var del = cc.removeSelf();
                    // if (++curChipNum == totalChipNum) {
                    //     var comp = cc.callFunc(this.showResult, this);
                    //     var action = cc.sequence(delay, move, del, comp);
                    // }
                    // else {
                    //     var action = cc.sequence(delay, move, del);
                    // }
                    // this.betArea[id].children[j].runAction(action);
                    if (++curChipNum == totalChipNum) {
                        this.betArea[id].children[j].getComponent(brnn_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, this.showResult.bind(this));
                    }
                    else {
                        this.betArea[id].children[j].getComponent(brnn_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, null);
                    }
                }
            }
        }
        else if (bloselist.length > 0) {
            for (var i = 0; i < bloselist.length; i++) {
                var id = bloselist[i];
                var endpos = this.throwPos.convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.betArea[id].convertToWorldSpaceAR(cc.v2(0, 0)));
                for (var j = 0; j < this.betArea[id].childrenCount; j++) {
                    // var delay = cc.delayTime(flyTime + waitTime);
                    // var move = cc.moveTo(flyTime, endpos).easing(cc.easeExponentialInOut());
                    // var del = cc.removeSelf();
                    // if (++curChipNum == totalChipNum) {
                    //     var comp = cc.callFunc(this.showResult, this);
                    //     var action = cc.sequence(delay, move, del, comp);
                    // }
                    // else {
                    //     var action = cc.sequence(delay, move, del);
                    // }
                    // this.betArea[id].children[j].runAction(action);
                    if (++curChipNum == totalChipNum) {
                        this.betArea[id].children[j].getComponent(brnn_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, this.showResult.bind(this));
                    }
                    else {
                        this.betArea[id].children[j].getComponent(brnn_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, null);
                    }
                }
            }
        }
        if (totalChipNum == 0) {
            this.showResult();
        }
    },

    /**
     * 获取筹码sprite
     * @param {Number} betnum 
     * @param {Boolean} isSelf 
     */
    getChipSprite(betnum, isSelf) {
        if (isSelf) {
            for (var i = 0; i < 4; i++) {
                if (chipList[this._chipGroup][i] == betnum) {
                    return this.splist_chip[this._chipGroup * 4 + i];
                }
            }
        }
        else {
            let pair_list = [];
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (chipList[i][j] == betnum) {
                        pair_list.push({ x: i, y: j });
                    }
                }
            }
            if (pair_list.length > 0) {
                let pair = pair_list[Math.floor(Math.random() * pair_list.length)];
                return this.splist_chip[pair.x * 4 + pair.y];
            }
        }
        return null;
    },


    //更新金币
    hallUpdateCoin() {
        var coin = hall_prop_data.getInstance().getCoin();
        let player = brnn_Data.getPlayerById(cc.dd.user.id);
        if (player) {
            player.coin = coin;
        }
        cc.find('bottom/mine/gold', this.node).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(coin);
    },

    //初始化大赢家数据(提前加载头像)
    initBigWinner(winlist) {//需要自己的分数也在列表里
        this.bigWinnerHeads.forEach(node => {
            node.active = false;
        });
        winlist = winlist.sort((a, b) => { return b.sum - a.sum; });
        let winnum = 0;
        for (var i = 0; i < 5; i++) {
            if (winlist[i] && winlist[i].sum > 0) {
                winnum++
                this.bigWinnerHeads[i].active = true;
                var player = brnn_Data.getPlayerById(winlist[i].id);
                cc.find('mask/head', this.bigWinnerHeads[i]).getComponent(cc.Sprite).spriteFrame = null;
                cc.find('name_bg/name', this.bigWinnerHeads[i]).getComponent(cc.Label).string = ''
                cc.find('score', this.bigWinnerHeads[i]).getComponent(cc.Label).string = '';
                if (player) {
                    cc.find('mask/head', this.bigWinnerHeads[i]).getComponent(cc.Sprite).spriteFrame = null;
                    cc.dd.SysTools.loadWxheadH5(cc.find('mask/head', this.bigWinnerHeads[i]).getComponent(cc.Sprite), player.headUrl);
                    cc.find('name_bg/name', this.bigWinnerHeads[i]).getComponent(cc.Label).string = cc.dd.Utils.substr(player.name, 0, 4);
                    cc.find('score', this.bigWinnerHeads[i]).getComponent(cc.Label).string = '+' + winlist[i].sum;
                }
                else {
                    cc.error('大赢家 ' + winlist[i].id + ' 未找到');
                }
            }
            else {
                break;
            }
        }
        this._noWinner = (winnum == 0);
    },

    //初始化筹码列表
    initChipList(coin, bet) {
        let numToStr = function (num) {
            if (num >= 10000) {
                return num / 10000 + '万';
            }
            else if (num >= 1000) {
                return num / 1000 + '千';
            }
            else {
                return num.toString();
            }
        }
        if (coin <= 30000) {
            this._chipGroup = 0;
        }
        else if (coin <= 200000) {
            this._chipGroup = 1;
        }
        else if (coin <= 800000) {
            this._chipGroup = 2;
        }
        else {
            this._chipGroup = 3;
        }
        let change_ani = true;
        for (var i = 0; i < 4; i++) {
            if (cc.find('bottom/chips/chip_' + (i + 1) + '/chip_ani', this.node).active == true) {
                change_ani = false;
                break;
            }
        }
        for (var i = 3; i > -1; i--) {
            cc.find('bottom/chips/chip_' + (i + 1) + '/num', this.node).getComponent(cc.Label).string = numToStr(chipList[this._chipGroup][i]);
            if (coin < 10 * chipList[this._chipGroup][i]) {//-bet*10
                cc.find('bottom/chips/chip_' + (i + 1), this.node).getComponent(cc.Button).interactable = false;
                if (cc.find('bottom/chips/chip_' + (i + 1) + '/chip_ani', this.node).active == true) {
                    change_ani = true;
                    cc.find('bottom/chips/chip_' + (i + 1) + '/chip_ani', this.node).active = false;
                    this._chipIdx = -1;
                }
            }
            else {
                if (change_ani) {
                    cc.find('bottom/chips/chip_' + (i + 1) + '/chip_ani', this.node).active = true;
                    change_ani = false;
                    this._chipIdx = i + 1;
                }
                cc.find('bottom/chips/chip_' + (i + 1), this.node).getComponent(cc.Button).interactable = true;
            }
        }
        this.initCaihongChips(coin);
    },

    //初始化音乐音效设置
    initMusicAndSound() {
        var music = AudioManager.getInstance()._getLocalMusicSwitch();
        var sound = AudioManager.getInstance()._getLocalSoundSwitch();
        var s_volume = AudioManager.getInstance()._getLocalSoundVolume();
        var m_volume = AudioManager.getInstance()._getLocalMusicVolume();
        if (!music) {
            cc.find('setting/bg/content/music/mask', this.node).width = 0;
            cc.find('setting/bg/content/music/tao', this.node).x = -50;
            cc.find('setting/bg/content/music/tao/b', this.node).active = true;
            cc.find('setting/bg/content/music/tao/y', this.node).active = false;
            cc.find('setting/bg/content/music/label_kai', this.node).active = false;
            cc.find('setting/bg/content/music/label_guan', this.node).active = true;
        }
        else {
            AudioManager.getInstance().onMusic(brnn_audio_cfg.GAME_MUSIC);
        }
        if (!sound) {
            cc.find('setting/bg/content/sound/mask', this.node).width = 0;
            cc.find('setting/bg/content/sound/tao', this.node).x = -50;
            cc.find('setting/bg/content/sound/tao/b', this.node).active = true;
            cc.find('setting/bg/content/sound/tao/y', this.node).active = false;
            cc.find('setting/bg/content/sound/label_kai', this.node).active = false;
            cc.find('setting/bg/content/sound/label_guan', this.node).active = true;
        }
        if (s_volume == 0 && m_volume == 0) {//静音
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = true;
            this.mute = true;
        }
        else {
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = false;
            this.mute = false;
        }
        this.music_Slider.progress = m_volume;
        this.sound_Slider.progress = s_volume;
        this.music_Slider.node.getComponentInChildren(cc.ProgressBar).progress = m_volume;
        this.sound_Slider.node.getComponentInChildren(cc.ProgressBar).progress = s_volume;
        var fangyan_node = cc.find('setting/bg/content/fangyan', this.node);
        cc.dd.ShaderUtil.setGrayShader(fangyan_node);
    },

    /**
     * 初始化桌布
     */
    initZhuoBu() {
        var idx = 0;
        var json = cc.sys.localStorage.getItem('brnn_zhuobu_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.splist_zhuobu.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                    idx = index;
                }
            });
            if (sprite) {
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = sprite;
            }
            else {
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_zhuobu[0];
                cc.sys.localStorage.setItem('brnn_zhuobu_' + cc.dd.user.id, this.splist_zhuobu[0]._name);
            }
        }
        else {
            cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_zhuobu[0];
            cc.sys.localStorage.setItem('brnn_zhuobu_' + cc.dd.user.id, this.splist_zhuobu[0]._name);
        }
        var bg_item = cc.find('setting/bg/content/zhuomian/view/content/bg', this.node);
        var tog_item = cc.find('setting/bg/content/zhuomian/toggles/tog', this.node);
        this.splist_zhuobu.forEach(element => {
            var bg = cc.instantiate(bg_item);
            bg.getComponent(cc.Sprite).spriteFrame = element;
            bg.active = true;
            bg_item.parent.addChild(bg);
            var tog = cc.instantiate(tog_item);
            tog.active = true;
            tog_item.parent.addChild(tog);
        });
        this.nextBgBtn = cc.find('setting/bg/content/next_BG', this.node).getComponent(cc.Button);
        this.preBgBtn = cc.find('setting/bg/content/pre_BG', this.node).getComponent(cc.Button);
        this.idxZm = idx;
        this.contentZm = bg_item.parent;
        this.toggleZm = tog_item.parent;
        this.toggleZm.children[idx + 1].getChildByName('lv').active = true;
        this.zmWidth = bg_item.width;
        this.zmSpacingX = this.contentZm.getComponent(cc.Layout).spacingX;
        this.contentZm.x = - idx * (this.zmSpacingX + this.zmWidth);
        this.freshNextPreBtn();
    },
    freshNextPreBtn() {
        this.nextBgBtn.interactable = this.idxZm < (this.splist_zhuobu.length - 1);
        this.preBgBtn.interactable = this.idxZm > 0;
    },
    onZhuobuSwitch(event, custom) {
        switch (custom) {
            case 'next':
                if (!this.changingZhuobu) {
                    if (this.splist_zhuobu[this.idxZm + 1]) {
                        this.nextBgBtn.interactable = false;
                        this.preBgBtn.interactable = false;
                        this.changingZhuobu = true;
                        var move = cc.moveTo(1, cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                        cc.sys.localStorage.setItem('brnn_zhuobu_' + cc.dd.user.id, this.splist_zhuobu[this.idxZm]._name);
                        cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_zhuobu[this.idxZm];
                        var func = function () {
                            this.toggleZm.children[this.idxZm].getChildByName('lv').active = false;
                            this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                            this.changingZhuobu = false;
                            this.freshNextPreBtn();
                        }.bind(this);
                        this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
                    }
                }
                break;
            case 'pre':
                if (!this.changingZhuobu) {
                    if (this.splist_zhuobu[this.idxZm - 1]) {
                        this.nextBgBtn.interactable = false;
                        this.preBgBtn.interactable = false;
                        this.changingZhuobu = true;
                        var move = cc.moveTo(1, cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                        cc.sys.localStorage.setItem('brnn_zhuobu_' + cc.dd.user.id, this.splist_zhuobu[this.idxZm]._name);
                        cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_zhuobu[this.idxZm];
                        var func = function () {
                            this.toggleZm.children[this.idxZm + 2].getChildByName('lv').active = false;
                            this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                            this.changingZhuobu = false;
                            this.freshNextPreBtn();
                        }.bind(this);
                        this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
                    }
                }
                break;
        }
    },

    clickShop: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_brnn/prefab/brnn_game_bag', function (ui) {

        }.bind(this));
    },

    //点击背景
    onBgClick() {
        if (this.menu_show) {
            cc.find('menu/click', this.node).active = false;
            this.btn_menu.interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            cc.find('menu', this.node).getComponent(cc.Animation).off('finished', null);
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { cc.find('bottom/btns/more', this.node).getComponent(cc.Button).interactable = true; }.bind(this), this);
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = null;
        }
    },

    //聊天消息
    onChat(data) {
        if (data.msgtype == 3) {//魔法表情
            this.playMagicProp(data.id, data.sendUserId, data.toUserId);
        }
    },

    /**
     * 点击下注
     * @param {*} event 
     * @param {*} custom 
     */
    onClickBet(event, custom) {
        if (this._chipIdx == -1)
            return;
        if (brnn_Data.roomStatus != 1)
            return;
        if (brnn_Data.getPlayerById(cc.dd.user.id).isBanker) {
            cc.dd.PromptBoxUtil.show('庄家不能下注!');
            return;
        }
        var pos = parseInt(custom);
        if (pos > 0 && pos < 5) {
            var num = chipList[this._chipGroup][this._chipIdx - 1];
            if (brnn_Data.getPlayerById(cc.dd.user.id).coin < 10000 && brnn_Data.getMyBetTotal() + num > 50) {
                if (brnn_Data.getMyBetTotal() >= 50) {
                    cc.dd.PromptBoxUtil.show('个人下注已达上限!');
                }
                else {
                    brnn_send_msg.bet(pos, 50 - brnn_Data.getMyBetTotal());
                }
                return;
            }
            brnn_send_msg.bet(pos, num);
        }
        else if (pos > 4 && pos < 11) {
            var num = 0;
            var coin = brnn_Data.getPlayerById(cc.dd.user.id).coin;
            if (coin > 800000) {
                num = 100000;
            }
            else if (coin > 300000) {
                num = 20000;
            }
            else if (coin > 100000) {
                num = 5000;
            }
            else if (coin > 60000) {
                num = 1000;
            }
            else if (coin > 50000) {
                num = 200;
            }
            else {
                num = 10;
            }
            if (coin < 50000 && brnn_Data.getMyCaihongTotal() >= 50) {
                cc.dd.PromptBoxUtil.show('猜红下注已达上限!');
                return;
            }
            brnn_send_msg.bet(pos, num);
        }
    },

    //申请上庄
    onClickBank(event, custom) {
        if (!this._bankCD) {
            this._bankCD = true;
            this.scheduleOnce(function () {
                this._bankCD = false;
            }.bind(this), 0.5);
            let isBanker = brnn_Data.getPlayerById(cc.dd.user.id).isBanker;
            let myBankerRank = brnn_Data.myBankerRank;
            if (!isBanker) {
                if (myBankerRank > 0) {
                    brnn_send_msg.bankReq(2);
                }
                else {
                    brnn_send_msg.bankReq(1);
                }
            }
            else {
                brnn_send_msg.bankReq(2);
            }
        }
    },

    /**
     * 点击筹码
     * @param {*} event 
     * @param {*} custom 
     */
    onClickChip(event, custom) {
        var idx = parseInt(custom);
        if (idx && this._chipIdx != idx) {
            AudioManager.getInstance().playSound(brnn_audio_cfg.COMMON.BUTTON, false);
            if (this._chipIdx != -1)
                cc.find('bottom/chips/chip_' + this._chipIdx + '/chip_ani', this.node).active = false;
            this._chipIdx = idx;
            cc.find('bottom/chips/chip_' + this._chipIdx + '/chip_ani', this.node).active = true;
        }
    },

    /**
     * 点击关闭
     * @param {*} event 
     * @param {*} custom 
     */
    onClickClose(event, custom) {
        switch (custom) {
            case 'pList':
                cc.find('player_list', this.node).active = false;
                break;
        }
    },

    /**
     * 点击头像
     * @param {*} event 
     */
    onClickHead(event) {
        let player = brnn_Data.getPlayerById(event.target.tagname);
        if (!player) {
            return;
        }
        hall_audio_mgr.com_btn_click();
        var selfBanker = brnn_Data.getPlayerById(cc.dd.user.id).isBanker;
        RoomMgr.Instance().roomType = 2;
        cc.dd.UIMgr.openUI("gameyj_common/prefab/user_info", function (node) {
            let ui = node.getComponent('user_info_view');
            ui.updateUIWithMagic(player, player.isBanker == true && player.userId != cc.dd.user.id && !selfBanker);
        });
    },

    /**
     * 事件处理
     * @param {*} event 
     * @param {*} data 
     */
    onEventMessage(event, data) {
        switch (event) {
            case BRNN_Event.PLAYER_JOIN://玩家进入
                this.playerEnter(data);
                break;
            case BRNN_Event.PLAYER_EXIT:
                this.playerExit();
                break;
            case BRNN_Event.ROOM_STATE://游戏状态改变
                this.updateState(data);
                break;
            case BRNN_Event.BET://玩家下注
            case BRNN_Event.BET_OTHER:
                this.playerBet(data);
                break;
            case BRNN_Event.BANKER_RET://上庄返回
                this.bankRet(data);
                break;
            case BRNN_Event.UPDATE_REQ_BANKER:
                this.updateReqBankNum();
                break;
            case BRNN_Event.BANKER_ADD://上庄
                if (data.id == cc.dd.user.id) {
                    cc.dd.PromptBoxUtil.show('上庄成功');
                }
                break;
            case BRNN_Event.BANKER_DEL://下庄
                if (data.id == cc.dd.user.id) {
                    cc.dd.PromptBoxUtil.show('您已经下庄');
                }
                this.updateReqBankNum();
                break;
            case BRNN_Event.RESULT://结算
                this.showTurnPoker(data);
                break;
            case BRNN_Event.RECONNECT:
                this.reconnectGame();
                break;
            case ChatEvent.CHAT:
                this.onChat(data);
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                this.hallUpdateCoin();
                break;
            case BRNN_Event.UPDATE_BANKER_LISET:
                this.updateBankerList();
                break;
            case BRNN_Event.UPDATE_BATTLE:
                this.updateBattleHistory();
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                brnn_Data.clear();
                cc.dd.SceneManager.enterHall();
                break;
            case SysEvent.PAUSE:
                this._syspausetime = new Date().getTime();
                cc.log('暂停 剩余倒计时:' + this._remainBet);
                break;
            case SysEvent.RESUME:
                if (this._syspausetime != null) {
                    let durtime = (new Date().getTime() - this._syspausetime) / 1000;
                    if (durtime < 10) {
                        if (this._remainBet) {
                            this._remainBet -= durtime;
                            cc.log('恢复 耗时' + durtime + ' 剩余倒计时:' + this._remainBet);
                        }
                    }
                }
                break;
        }
    },

    /**
     * 退出按钮
     */
    onExit(event, custom) {
        hall_audio_mgr.com_btn_click();
        this.node_menu.active = false;
        this.menu_show = false;
        this.btn_menu.interactable = true;
        if (brnn_Data.getMyBetTotal() > 0) {
            cc.dd.DialogBoxUtil.show(0, '强退将暂时扣除' + brnn_Data.getMyBetTotal() * 10 + '金币，用于本局结算，结算后自动返还剩余金币，是否退出？', '是', '否', this.sendLeaveRoom, null, '退出游戏');
        }
        else if (brnn_Data.getPlayerById(cc.dd.user.id).isBanker == true) {
            cc.dd.DialogBoxUtil.show(0, '强退将暂时扣除10000000金币，用于本局结算，结算后自动返还剩余金币，是否退出？', '是', '否', this.sendLeaveRoom, null, '退出游戏');
        }
        else {
            this.sendLeaveRoom();
        }
    },

    /**
    * 设置音乐音效
    */
    onSetMusic: function (event, custom) {
        var duration = 0.3;
        var step = 0.05;
        switch (custom) {
            case 'music':
                var music_Node = this.music_Node;
                if (AudioManager.getInstance()._getLocalMusicSwitch()) {//on  需要关闭
                    if (!this.switch_music) {
                        cc.find('label_kai', music_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', music_Node).active = false;
                            cc.find('tao/b', music_Node).active = true;
                            cc.find('label_guan', music_Node).active = true;
                            AudioManager.getInstance().offMusic();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', music_Node).width;
                        var time = duration;
                        this.switch_music = true;
                        music_Node.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', music_Node).width = width * time / duration;
                            if (time == 0) {
                                music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', music_Node).runAction(action);
                    }
                }
                else {
                    if (!this.switch_music) {
                        cc.find('label_guan', music_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(46.6, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', music_Node).active = true;
                            cc.find('tao/b', music_Node).active = false;
                            cc.find('label_kai', music_Node).active = true;
                            AudioManager.getInstance().onMusic(brnn_audio_cfg.GAME_MUSIC);
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time1 = duration;
                        this.switch_music = true;
                        music_Node.getComponent(cc.Button).schedule(function () {
                            time1 -= step;
                            if (time1 < 0)
                                time1 = 0;
                            cc.find('mask', music_Node).width = width * (1 - time1 / duration);
                            if (time1 == 0) {
                                music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', music_Node).runAction(action);
                    }
                }
                break;
            case 'sound':
                var sound_Node = this.sound_Node;
                if (AudioManager.getInstance()._getLocalSoundSwitch()) {//on  需要关闭
                    if (!this.switch_sound) {
                        cc.find('label_kai', sound_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', sound_Node).active = false;
                            cc.find('tao/b', sound_Node).active = true;
                            cc.find('label_guan', sound_Node).active = true;
                            AudioManager.getInstance().offSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', sound_Node).width;
                        var time2 = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time2 -= step;
                            if (time2 < 0)
                                time2 = 0;
                            cc.find('mask', sound_Node).width = width * time2 / duration;
                            if (time2 == 0) {
                                sound_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', sound_Node).runAction(action);
                    }
                }
                else {
                    if (!this.switch_sound) {
                        cc.find('label_guan', sound_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(43, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', sound_Node).active = true;
                            cc.find('tao/b', sound_Node).active = false;
                            cc.find('label_kai', sound_Node).active = true;
                            AudioManager.getInstance().onSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time3 = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time3 -= step;
                            if (time3 < 0)
                                time3 = 0;
                            cc.find('mask', sound_Node).width = width * (1 - time3 / duration);
                            if (time3 == 0) {
                                sound_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', sound_Node).runAction(action);
                    }
                }
                break;
            case 'mute':
                if (this.mute) {//静音开启  需关闭
                    AudioManager.getInstance().setSoundVolume(this.sound_Slider.progress);
                    AudioManager.getInstance().setMusicVolume(this.music_Slider.progress);
                    this.mute = false;
                }
                else {
                    AudioManager.getInstance().setSoundVolume(0);
                    AudioManager.getInstance().setMusicVolume(0);
                    this.mute = true;
                }
                break;
            case 'fangyan':
                break;
            default:
                cc.error('setMusic failed. arg error');
                break;
        }
    },

    sliderMusic(event, custom) {
        if (custom == '1') {//音乐
            this.music_Slider.node.getComponentInChildren(cc.ProgressBar).progress = event.progress;
            if (!this.mute)
                AudioManager.getInstance().setMusicVolume(event.progress);
        }
        else {
            this.sound_Slider.node.getComponentInChildren(cc.ProgressBar).progress = event.progress;
            if (!this.mute)
                AudioManager.getInstance().setSoundVolume(event.progress);
        }
    },

    /**
     * 显示规则
     */
    onGuize(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (custom == 'close') {
            this.node_guize.active = false;
        }
        else {
            this.menu_show = false;
            this.node_menu.active = false;
            this.btn_menu.interactable = true;
            this.node_guize.active = true;
        }
    },

    /**
     * 点击菜单
     */
    onMenu(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (!this.menu_show) {
            cc.find('menu', this.node).active = true;
            event.target.getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            if (ani._nameToState[ani._defaultClip.name]) {
                ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
            }
            cc.find('menu', this.node).getComponent(cc.Animation).off('finished', null);
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = true;
            cc.find('menu/click', this.node).active = true;
        }
        else {
            event.target.getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            cc.find('menu', this.node).getComponent(cc.Animation).off('finished', null);
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = null;
            cc.find('menu/click', this.node).active = false;
        }
    },

    /**
     * 显示设置
     */
    onSetting(event, custom) {
        if (custom == 'close') {
            this.node_setting.active = false;
        }
        else {
            this.menu_show = false;
            this.node_setting.active = true;
            this.node_menu.active = false;
            this.btn_menu.interactable = true;
        }
    },

    //单个筹码飞出
    singleBet(pos, sprite, delay) {
        var betArea = this.betArea[pos];
        // var node = new cc.Node();
        // let sp = node.addComponent(cc.Sprite);
        // sp.enabled = false;
        // sp.spriteFrame = sprite;
        var startpos = this.throwPos.convertToWorldSpaceAR(cc.v2(0, 0)).sub(betArea.convertToWorldSpaceAR(cc.v2(0, 0)));
        const chipWidth = 34;
        var endpos = cc.v2(-betArea.width / 2 + chipWidth + Math.random() * (betArea.width - 2 * chipWidth), -betArea.height / 2 + chipWidth + Math.random() * (betArea.height - 2 * chipWidth));
        //betArea.addChild(node);
        //node.setPosition(startpos);
        let time = 0;
        if (delay) {
            time = 0.5 * Math.random();
        }
        let node = this.getChipNode();
        let sp = node.getComponent(cc.Sprite);
        sp.enabled = false;
        sp.spriteFrame = sprite;
        node.getComponent(brnn_chip).fly(startpos, endpos, betArea, time);
    },

    //玩家下注
    playerBet(msg) {
        let result = msg.result;
        var bet_pos = msg.betId;
        var add = msg.betAdd;
        if (result != null) {//自己
            let mycoin = brnn_Data.getPlayerById(cc.dd.user.id).coin;
            let mytbet = brnn_Data.getMyBetTotal();
            this.initChipList(mycoin, mytbet);
            if (result == 0) {
                if (bet_pos < 5) {
                    var sp = this.getChipSprite(add, true);
                    if (sp) {
                        this.singleBet(bet_pos, sp);
                        AudioManager.getInstance().playSound(brnn_audio_cfg.COMMON.BET, false);
                    }
                    else {
                        let values = [];//下注值列表，去重加排序
                        for (var i = 0; i < 4; i++) {
                            for (var j = 0; j < 4; j++) {
                                if (values.indexOf(chipList[i][j]) == -1) {
                                    values.push(chipList[i][j]);
                                }
                            }
                        }
                        values.sort((a, b) => { return a - b; });
                        let chips = [];//筹码列表(贪心法)
                        for (var i = values.length - 1; i > -1 && add > 0; i--) {
                            if (add >= values[i]) {
                                var num = Math.floor(add / values[i]);
                                for (var j = 0; j < num; j++) {
                                    chips.push(values[i]);
                                }
                                add -= num * values[i];
                            }
                        }
                        while (chips.length) {
                            var random_idx = Math.floor(Math.random() * chips.length);
                            var chip = chips.splice(random_idx, 1);
                            var sp = this.getChipSprite(chip[0], false);
                            this.singleBet(bet_pos, sp);
                        }
                    }
                }
                else {//猜红
                    var total = msg.beted;
                    cc.find('bottom/chips_hong/chip_' + (bet_pos - 5) + '/bet', this.node).getComponent(cc.Label).string = total + '';
                    cc.find('bottom/chips_hong/chip_' + (bet_pos - 5) + '/bet', this.node).active = true;
                    cc.find('bottom/chips_hong/chip_' + (bet_pos - 5) + '/bei', this.node).active = false;
                }
            }
            else if (result == -1) {
                if (add > 0) {
                    let values = [];//下注值列表，去重加排序
                    for (var i = 0; i < 4; i++) {
                        for (var j = 0; j < 4; j++) {
                            if (values.indexOf(chipList[i][j]) == -1) {
                                values.push(chipList[i][j]);
                            }
                        }
                    }
                    values.sort((a, b) => { return a - b; });
                    let chips = [];//筹码列表(贪心法)
                    for (var i = values.length - 1; i > -1 && add > 0; i--) {
                        if (add >= values[i]) {
                            var num = Math.floor(add / values[i]);
                            for (var j = 0; j < num; j++) {
                                chips.push(values[i]);
                            }
                            add -= num * values[i];
                        }
                    }
                    while (chips.length) {
                        var random_idx = Math.floor(Math.random() * chips.length);
                        var chip = chips.splice(random_idx, 1);
                        var sp = this.getChipSprite(chip[0], false);
                        this.singleBet(bet_pos, sp);
                    }
                }
                else {
                    cc.dd.PromptBoxUtil.show('押注已达上限');
                }
            }
            else if (result == -2) {
                cc.dd.PromptBoxUtil.show('下注时间已过');
            }
            else if (result == -3) {
                cc.dd.PromptBoxUtil.show('金币不足');
            }
        }
        else {//其他人
            if (add == 0)
                return;
            let values = [];//下注值列表，去重加排序
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (values.indexOf(chipList[i][j]) == -1) {
                        values.push(chipList[i][j]);
                    }
                }
            }
            values.sort((a, b) => { return a - b; });
            let chips = [];//筹码列表(贪心法)
            for (var i = values.length - 1; i > -1 && add > 0; i--) {
                if (add >= values[i]) {
                    var num = Math.floor(add / values[i]);
                    for (var j = 0; j < num; j++) {
                        chips.push(values[i]);
                    }
                    add -= num * values[i];
                }
            }
            while (chips.length) {
                var random_idx = Math.floor(Math.random() * chips.length);
                var chip = chips.splice(random_idx, 1);
                var sp = this.getChipSprite(chip[0], false);
                this.singleBet(bet_pos, sp, true);
            }
        }
        this.updateBetScore(bet_pos);
    },

    /**
     * 玩家进入
     * @param {*} player 
     */
    playerEnter(player) {
        cc.find('bottom/btns/people/num', this.node).getComponent(cc.Label).string = brnn_Data.getBankerNum(false).toString();
        if (player && player.userId == cc.dd.user.id) {
            this.updateSelfInfo();
        }
    },

    playerExit() {
        cc.find('bottom/btns/people/num', this.node).getComponent(cc.Label).string = brnn_Data.getBankerNum(false).toString();
        this.updateBankerList();
    },

    /**
     * 玩家离开
     */
    playerLeave(data) {
        if (data.userId == cc.dd.user.id) {
            if (data.coinRetCode) {
                var str = '';
                switch (data.coinRetCode) {
                    case 1:
                        str = '您的金币小于此房间最低金币限制';
                        break;
                    case 2:
                        str = '您的金币超过房间最高携带金币';
                        break;
                    case 3:
                        str = '由于长时间未操作，您已离开游戏';
                        break;
                    case 4:
                        str = '当前禁止该游戏，请联系管理员';
                        break;
                }
                var func = function () {
                    brnn_Data.clear();
                    cc.dd.SceneManager.enterHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                brnn_Data.clear();
                cc.dd.SceneManager.enterHall();
            }
        }
    },

    //播放魔法表
    playMagicProp: function (id, send, to) {
        let sPos = this.throwPos.convertToWorldSpaceAR(cc.v2(0, 0));
        let ePos = null;
        for (var i = 0; i < this.bankerHeads.length; i++) {
            if (this.bankerHeads[i].tagname == to) {
                ePos = this.bankerHeads[i].convertToWorldSpaceAR(cc.v2(0, 0));
                break;
            }
        }
        if (!ePos)
            return;
        if (id == 1020) {
            ePos.y -= 50;       //锤子动画位置向下偏移
        }
        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        let magic_pos = magic_prop.node.convertToWorldSpaceAR(cc.v2(0, 0));
        magic_prop.playMagicPropAni(id, sPos.sub(magic_pos), ePos.sub(magic_pos));
    },

    //重连游戏
    reconnectGame() {
        let configId = brnn_Data.configId || 10901;
        var ccmjJbcCfgItem = game_room.getItem(function (item) {
            return item.key === configId;
        });
        brnn_Data.setData(ccmjJbcCfgItem);
        let roomStatus = brnn_Data.roomStatus;
        this.updateSelfInfo();
        this.updateBankerList();
        cc.find('zi', this.node).children.forEach(element => {
            element.active = false;
        });
        switch (roomStatus) {
            case 0://等待
                this.updateState(roomStatus);
                break;
            case 1://下注
                this.resetUI();
                this.updateBattleHistory();
                let leftTime = brnn_Data.leftTime;
                if (leftTime < 0) {
                    leftTime = 0;
                }
                let bank_card = cc.find('bank_card', this.node);
                bank_card.getChildByName('pokers').active = true;
                bank_card.active = true;
                for (var i = 1; i < 5; i++) {
                    this.betArea[i].parent.getChildByName('pokers').active = true;
                    this.betArea[i].parent.getChildByName('score').active = true;
                }
                for (var i = 1; i < 5; i++) {
                    var betall = brnn_Data.posBetTotal[i];
                    if (betall > 0) {
                        this.playerBet({ betId: i, betAdd: betall });
                    }
                }
                for (var pos = 5; pos < 11; pos++) {
                    var betme = brnn_Data.posBetMe[pos];
                    if (betme > 0) {
                        cc.find('bottom/chips_hong/chip_' + (pos - 5) + '/bet', this.node).getComponent(cc.Label).string = betme + '';
                        cc.find('bottom/chips_hong/chip_' + (pos - 5) + '/bet', this.node).active = true;
                        cc.find('bottom/chips_hong/chip_' + (pos - 5) + '/bei', this.node).active = false;
                    }
                }
                this.setTimerBet(leftTime - 1.5);
                if (brnn_Data.isJoin == 0) {
                    cc.find('zi/wait_end', this.node).active = true;
                }
                break;
            case 2://结算
            // this.resetUI();
            // this.updateBattleHistory();
            // let bank_card = cc.find('bank_card', this.node);
            // bank_card.getChildByName('pokers').active = true;
            // bank_card.active = true;
            // for (var i = 1; i < 5; i++) {
            //     this.betArea[i].parent.getChildByName('pokers').active = true;
            // }
            // cc.find('zi/wait_end', this.node).active = true;
            // break;
            case 3:
                this._forbidenResult = true;
                this.resetUI();
                this.updateBattleHistory();
                cc.find('zi/wait_end', this.node).active = true;
                break;
        }
    },

    //重置UI
    resetUI() {
        let bank_card = cc.find('bank_card', this.node);
        bank_card.scaleX = bank_card.scaleY = 1;
        for (var i = 1; i < 6; i++) {
            var poker = cc.find('pokers/poker_' + i, bank_card);
            poker.getChildByName('beimian').active = true;
        }
        cc.find('pokers/type_bg', bank_card).active = false;
        cc.find('pokers/fanpai_ani', bank_card).active = false;
        bank_card.getChildByName('timer').active = false;
        bank_card.active = false;

        let info_node = cc.find('info', this.node);
        info_node.getChildByName('total_bet').getComponent(cc.Label).string = '0';

        for (var i = 1; i < 5; i++) {
            var pokers = cc.find('pokers', this.betArea[i].parent);
            pokers.scaleX = pokers.scaleY = 1;
            for (var j = 1; j < 6; j++) {
                pokers.getChildByName('poker_' + j).getChildByName('beimian').active = true;
            }
            pokers.getChildByName('type_bg').active = false;
            pokers.active = false;
            pokers.setSiblingIndex(0);
            var score = cc.find('score', this.betArea[i].parent);
            score.getChildByName('layout').children.forEach(child => {
                child.active = false;
            });
            score.active = false;
            score.y = -110;
            score.setSiblingIndex(1);
            this.betArea[i].removeAllChildren();
        }
        this.resetCaihong();
    },

    //结算动画回调
    resultAniCallBack(custom) {
        switch (custom) {
            case 'score_up_start':
                for (var i = 1; i < 5; i++) {
                    var me_bet = brnn_Data.posBetMe[i];
                    if (me_bet != 0) {
                        cc.find('score/layout/total_bet', this.betArea[i].parent).active = false;
                    }
                    cc.find('score', this.betArea[i].parent).setSiblingIndex(2);
                }
                break;
            case 'score_up_end'://下注信息上升
                var isBanker = brnn_Data.getPlayerById(cc.dd.user.id).isBanker;
                for (var i = 1; i < 5; i++) {
                    var me_bet = brnn_Data.posBetMe[i];
                    if (me_bet == 0 && !isBanker) {
                        this.betArea[i].parent.getComponent(cc.Animation).play('score_fadeout');
                    }
                    cc.find('pokers', this.betArea[i].parent).setSiblingIndex(2);
                }
                break;
            case 'show_poker_0'://庄家牌落下
                var poker = brnn_Data.getSortedBankerCard();
                var pokers_node = cc.find('bank_card/pokers', this.node);
                var kings_idx = 0;
                if (poker) {
                    for (var i = 0; i < poker.pokers.length; i++) {
                        if (Math.floor(poker.pokers[i] / 10) == 17) {
                            this.setPokerBack(pokers_node.children[i], poker.kings[kings_idx++], poker.pokers[i]);
                        }
                        else {
                            this.setPokerBack(pokers_node.children[i], poker.pokers[i]);
                        }
                    }
                }
                this.updateBattleHistory();
                this.showHongAni(poker.pokers);
                AudioManager.getInstance().playSound(brnn_audio_cfg.PAIXING[poker.type], false);
                break;
            case 'show_poker_1'://天
                var poker = brnn_Data.getPokersById(1);
                var pokers_node = cc.find('pokers', this.betArea[1].parent);
                var kings_idx = 0;
                if (poker && poker.kings && poker.kings.length > 0) {
                    for (var i = 0; i < poker.pokers.length; i++) {
                        if (Math.floor(poker.pokers[i] / 10) == 17) {
                            this.setPokerBack(pokers_node.children[i], poker.kings[kings_idx++], poker.pokers[i]);
                        }
                    }
                }
                AudioManager.getInstance().playSound(brnn_audio_cfg.PAIXING[poker.type], false);
                break;
            case 'show_poker_2'://地
                var poker = brnn_Data.getPokersById(2);
                var pokers_node = cc.find('pokers', this.betArea[2].parent);
                var kings_idx = 0;
                if (poker && poker.kings && poker.kings.length > 0) {
                    for (var i = 0; i < poker.pokers.length; i++) {
                        if (Math.floor(poker.pokers[i] / 10) == 17) {
                            this.setPokerBack(pokers_node.children[i], poker.kings[kings_idx++], poker.pokers[i]);
                        }
                    }
                }
                AudioManager.getInstance().playSound(brnn_audio_cfg.PAIXING[poker.type], false);
                break;
            case 'show_poker_3'://玄
                var poker = brnn_Data.getPokersById(3);
                var pokers_node = cc.find('pokers', this.betArea[3].parent);
                var kings_idx = 0;
                if (poker && poker.kings && poker.kings.length > 0) {
                    for (var i = 0; i < poker.pokers.length; i++) {
                        if (Math.floor(poker.pokers[i] / 10) == 17) {
                            this.setPokerBack(pokers_node.children[i], poker.kings[kings_idx++], poker.pokers[i]);
                        }
                    }
                }
                AudioManager.getInstance().playSound(brnn_audio_cfg.PAIXING[poker.type], false);
                break;
            case 'show_poker_4'://黄
                var poker = brnn_Data.getPokersById(4);
                var pokers_node = cc.find('pokers', this.betArea[4].parent);
                var kings_idx = 0;
                if (poker && poker.kings && poker.kings.length > 0) {
                    for (var i = 0; i < poker.pokers.length; i++) {
                        if (Math.floor(poker.pokers[i] / 10) == 17) {
                            this.setPokerBack(pokers_node.children[i], poker.kings[kings_idx++], poker.pokers[i]);
                        }
                    }
                }
                AudioManager.getInstance().playSound(brnn_audio_cfg.PAIXING[poker.type], false);
                break;
            case 'my_bet_1'://我的小计
                var pos = 1;
                var result = brnn_Data.getMyPosResult(pos);
                var score_node = cc.find('score', this.betArea[pos].parent);
                if (result != null) {
                    if (result > 0) {
                        cc.find('layout/my_win', score_node).getComponent(cc.Label).string = '我的小计: +' + result.toString();
                        cc.find('layout/my_win', score_node).active = true;
                    }
                    else if (result < 0) {
                        cc.find('layout/my_lose', score_node).getComponent(cc.Label).string = '我的小计: ' + result.toString();
                        cc.find('layout/my_lose', score_node).active = true;
                    }
                }
                break;
            case 'my_bet_2':
                var pos = 2;
                var result = brnn_Data.getMyPosResult(pos);
                var score_node = cc.find('score', this.betArea[pos].parent);
                if (result != null) {
                    if (result > 0) {
                        cc.find('layout/my_win', score_node).getComponent(cc.Label).string = '我的小计: +' + result.toString();
                        cc.find('layout/my_win', score_node).active = true;
                    }
                    else if (result < 0) {
                        cc.find('layout/my_lose', score_node).getComponent(cc.Label).string = '我的小计: ' + result.toString();
                        cc.find('layout/my_lose', score_node).active = true;
                    }
                }
                break;
            case 'my_bet_3':
                var pos = 3;
                var result = brnn_Data.getMyPosResult(pos);
                var score_node = cc.find('score', this.betArea[pos].parent);
                if (result != null) {
                    if (result > 0) {
                        cc.find('layout/my_win', score_node).getComponent(cc.Label).string = '我的小计: +' + result.toString();
                        cc.find('layout/my_win', score_node).active = true;
                    }
                    else if (result < 0) {
                        cc.find('layout/my_lose', score_node).getComponent(cc.Label).string = '我的小计: ' + result.toString();
                        cc.find('layout/my_lose', score_node).active = true;
                    }
                }
                break;
            case 'my_bet_4':
                var pos = 4;
                var result = brnn_Data.getMyPosResult(pos);
                var score_node = cc.find('score', this.betArea[pos].parent);
                if (result != null) {
                    if (result > 0) {
                        cc.find('layout/my_win', score_node).getComponent(cc.Label).string = '我的小计: +' + result.toString();
                        cc.find('layout/my_win', score_node).active = true;
                    }
                    else if (result < 0) {
                        cc.find('layout/my_lose', score_node).getComponent(cc.Label).string = '我的小计: ' + result.toString();
                        cc.find('layout/my_lose', score_node).active = true;
                    }
                }
                this.chipsFly();
                break;
        }
    },


    //离开房间
    sendLeaveRoom() {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = brnn_Data.getGameId();
        var roomId = brnn_Data.getRoomId();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    //发牌
    sendPoker() {
        cc.find('zi/start_bet', this.node).active = false;
        let bank_card = cc.find('bank_card', this.node);
        bank_card.getChildByName('pokers').active = true;
        bank_card.active = true;
        for (var i = 1; i < 5; i++) {
            this.betArea[i].parent.getChildByName('pokers').active = true;
            this.betArea[i].parent.getChildByName('score').active = true;
        }
        this.setTimerBet(10);
    },

    //背面牌
    setPokerBack(node, cardValue, isLaizi) {// isLaizi 2为大王 1为小王
        let paiAtlas = this.pokerAtlas;
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = node.getChildByName('hua_xiao');
        var hua_da = node.getChildByName('hua_da');
        var num = node.getChildByName('num');
        if (value == 2) value = 16;
        if (value == 1) value = 14;
        if (value < 17) {
            switch (flower) {
                case 1:
                    flower = 4;
                    break;
                case 2:
                    flower = 3;
                    break;
                case 3:
                    flower = 2;
                    break;
                case 4:
                    flower = 1;
                    break;
            }
        }
        if (!isLaizi) {
            hua_xiao.setPosition(-54, 22);
            hua_xiao.width = 34;
            hua_xiao.height = 38;
            switch (value) {
                case 0:
                    break;
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 16:
                    if (flower % 2 == 0) {
                        num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                    }
                    else {
                        num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                    }
                    hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                    hua_xiao.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                    hua_xiao.active = true;
                    break;
                case 17:
                    if (flower % 2 == 0) {
                        num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                        hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerda');
                    }
                    else {
                        num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                        hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerxiao');
                    }
                    hua_xiao.active = false;
                    break;
            }
        }
        else {
            hua_xiao.setPosition(-54, -34.3);
            hua_xiao.width = 26;
            hua_xiao.height = 142;
            switch (value) {
                case 0:
                    break;
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 16:
                    if (isLaizi % 2 == 0) {
                        hua_xiao.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r17');
                        hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerda');
                        num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                    }
                    else {
                        hua_xiao.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b17');
                        hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerxiao');
                        num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                    }
                    hua_xiao.active = true;
                    break;
            }
        }
    },


    //下注倒计时
    setTimerBet(time) {
        if (time > 0) {
            this._remainBet = time;
            cc.find('bank_card/timer/num', this.node).getComponent(cc.Label).string = Math.ceil(this._remainBet).toString();
            cc.find('bank_card/timer', this.node).active = true;
            this.schedule(this.setTimerBetSchedule, 0.1);
        }
        else {
            cc.find('bank_card/timer', this.node).active = false;
            this.unschedule(this.setTimerBetSchedule);
        }
    },

    //倒计时
    setTimerBetSchedule() {
        if (this._remainBet && this._remainBet > 0) {
            cc.find('bank_card/timer/num', this.node).getComponent(cc.Label).string = Math.ceil(this._remainBet).toString();
            this._remainBet -= 0.1;
        }
        else {
            cc.find('bank_card/timer', this.node).active = false;
            this.unschedule(this.setTimerBetSchedule);
        }
    },

    //大赢家
    showBigWinner() {
        let player = brnn_Data.getPlayerById(cc.dd.user.id);
        if (player) {
            let coin = player.coin;
            cc.find('bottom/mine/gold', this.node).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(coin);
        }
        cc.find('zi/result', this.node).active = false;
        cc.find('zi/result', this.node).getComponent(cc.Animation).off('finished');
        if (this._noWinner)
            return;
        cc.find('bigwinner', this.node).getComponent(cc.Animation).play('bigwinner');
    },

    /**
     * 显示玩家列表
     * @param {Array<>} list 
     * @param {Number} type 
     */
    showPlayerList(event, custom) {
        let list = [];
        let type = 0;
        if (custom === '1') {
            type = 1;
            list = brnn_Data.getBankerList(true);
            list.sort((a, b) => { if (b.userId == cc.dd.user.id) return true; return false; });
        }
        else {
            list = brnn_Data.getBankerList(false);
            list.sort((a, b) => { if (b.userId == cc.dd.user.id) return true; return false; });
        }
        cc.find('player_list', this.node).active = true;
        let self = this;
        let str_title = type == 1 ? '庄家列表' : '闲家列表';
        cc.find('player_list/bg/title_bg/title', this.node).getComponent(cc.Label).string = str_title;
        let plist = [];
        for (var i = 0; i < Math.ceil(list.length / 2); i++) {
            if (list[2 * i + 1])
                plist.push([list[2 * i], list[2 * i + 1]]);
            else
                plist.push([list[2 * i]]);
        }
        let scp = cc.find('player_list/bg/scroll', this.node).getComponent('com_glistView');
        scp.setDataProvider(plist, 0, function (itemNode, index) {
            if (index < 0 || index >= plist.length)
                return;
            var data = plist[index];
            var p1_data = data[0];
            var p2_data = data[1];
            var p1_node = itemNode.getChildByName('1p');
            var p2_node = itemNode.getChildByName('2p');
            var p1_head = p1_node.getChildByName('head').getComponent(cc.Sprite);
            p1_head.spriteFrame = null;
            cc.dd.SysTools.loadWxheadH5(p1_head, p1_data.headUrl);
            p1_head.node.tagname = p1_data.userId;
            p1_head.node.off('click');
            p1_head.node.on('click', self.onClickHead, self);
            p1_node.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr(p1_data.name, 0, 4);
            p1_node.getChildByName('coin').getComponent(cc.Label).string = p1_data.coin.toString();
            if (p2_data) {
                var p2_head = p2_node.getChildByName('head').getComponent(cc.Sprite);
                p2_head.spriteFrame = null;
                cc.dd.SysTools.loadWxheadH5(p2_head, p2_data.headUrl);
                p2_head.node.tagname = p2_data.userId;
                p2_head.node.off('click');
                p2_head.node.on('click', self.onClickHead, self);
                p2_node.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr(p2_data.name, 0, 4);
                p2_node.getChildByName('coin').getComponent(cc.Label).string = p2_data.coin.toString();
                p2_node.active = true;
            }
            else {
                p2_node.active = false;
            }
        });
    },

    //结算
    showResult() {
        AudioManager.getInstance().playSound(brnn_audio_cfg.COMMON.NIUJIAO, false);
        if (brnn_Data._winBankerTimes == 4) {//通赔
            AudioManager.getInstance().playSound(brnn_audio_cfg.COMMON.AllLose, false);
        }
        else if (brnn_Data._winBankerTimes > 0) {//胜负
            AudioManager.getInstance().playSound(brnn_audio_cfg.COMMON.GAME_END, false);
        }
        else {//通杀
            AudioManager.getInstance().playSound(brnn_audio_cfg.COMMON.AllWin, false);
        }
        let mylist = brnn_Data.resultMineList;
        let isShow = (mylist && mylist.length > 0);
        if (isShow) {
            let myWin = 0;
            mylist.forEach(element => {
                myWin += element.sum;
            });
            let iswin = myWin < 0 ? 1 : 0;
            cc.find('zi/result', this.node).children.forEach(element => {
                element.active = false;
            });
            cc.find('zi/result/win', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_shengfu[iswin];
            if (myWin < 0) {
                cc.find('zi/result/total', this.node).getComponent(cc.Label).string = ';' + Math.abs(myWin).toString();
            }
            else {
                cc.find('zi/result/total', this.node).getComponent(cc.Label).string = ':' + Math.abs(myWin).toString();
            }
            cc.find('zi/result', this.node).active = true;
            cc.find('zi/result', this.node).getComponent(cc.Animation).off('finished');
            cc.find('zi/result', this.node).getComponent(cc.Animation).on('finished', this.showBigWinner, this);
            cc.find('zi/result', this.node).getComponent(cc.Animation).play('result');
        }
        else {
            this.showBigWinner();
        }
    },

    /**
     * 开牌
     * @param {*} msg 
     */
    showTurnPoker(msg) {
        if (this._forbidenResult) {
            return;
        }
        AudioManager.getInstance().playSound(brnn_audio_cfg.COMMON.END_BET, false);
        AudioManager.getInstance().playSound(brnn_audio_cfg.COMMON.OpenCard, false);
        this.initBigWinner(msg.winersList);
        let pokersList = msg.pokersList;
        let getBeilv = function (type) {
            if (type == 0) {
                return 1;
            }
            else if (type < 10) {
                return type;
            }
            else {
                return 10;
            }
        };
        let bankerTYPE = pokersList.find(a => { return a.id == 0; }).pokerType;
        pokersList.forEach(data => {
            if (data.id < 5) {
                if (data.id == 0) {
                    var banker_poker_node = cc.find('bank_card/pokers', this.node);
                    for (var i = 0; i < data.pokersList.length; i++) {
                        this.setPokerBack(banker_poker_node.children[i], data.pokersList[i]);
                    }
                    this.setPokerBack(cc.find('fanpai_ani/poker_fan', banker_poker_node), data.pokersList[4]);
                    cc.find('type_bg/type', banker_poker_node).getComponent(cc.Sprite).spriteFrame = this.splist_cardtype[data.pokerType];
                    var hong = brnn_Data.getHongCardNum(data.pokersList);
                    cc.find('type_bg/hong', banker_poker_node).getComponent(cc.Label).string = hong + '6';
                }
                else {
                    var poker_node = cc.find('pokers', this.betArea[data.id].parent);
                    for (var i = 0; i < data.pokersList.length; i++) {
                        this.setPokerBack(poker_node.children[i], data.pokersList[i]);
                    }
                    cc.find('type_bg/type', poker_node).getComponent(cc.Sprite).spriteFrame = this.splist_cardtype[data.pokerType];
                    cc.find('type_bg/flag', poker_node).getComponent(cc.Sprite).spriteFrame = this.splist_flag[data.isWinBanker - 1];
                    if (data.isWinBanker == 1) {//胜
                        cc.find('type_bg/win', poker_node).getComponent(cc.Label).font = this.fontlist_win_lose[0];
                        cc.find('type_bg/win', poker_node).getComponent(cc.Label).string = ':' + getBeilv(data.pokerType);
                    }
                    else {//负
                        cc.find('type_bg/win', poker_node).getComponent(cc.Label).font = this.fontlist_win_lose[1];
                        cc.find('type_bg/win', poker_node).getComponent(cc.Label).string = ':' + getBeilv(bankerTYPE);
                    }
                }
            }
        });
        let self = this;
        let ziPlayFinished = function () {
            cc.find('zi/start_bipai', self.node).getComponent(cc.Animation).off('finished');
            cc.find('zi/start_bipai', self.node).active = true;
            self.node.getComponent(cc.Animation).play('kaipai');
        };
        cc.find('zi/start_bipai', this.node).active = true;
        cc.find('zi/start_bipai', this.node).getComponent(cc.Animation).off('finished');
        cc.find('zi/start_bipai', this.node).getComponent(cc.Animation).on('finished', ziPlayFinished, this);
        cc.find('zi/start_bipai', this.node).getComponent(cc.Animation).play();
    },

    //更新顶部庄列表
    updateBankerList() {
        var bankerlist = brnn_Data.getBankerList(true);
        for (var i = 0; i < this.bankerHeads.length; i++) {
            if (!bankerlist[i]) {
                this.bankerHeads[i].parent.parent.getChildByName('bling').active = false;
                this.bankerHeads[i].getComponent(cc.Sprite).spriteFrame = null;
                this.bankerHeads[i].tagname = null;
            }
            else if (this.bankerHeads[i].tagname != bankerlist[i].userId) {
                this.bankerHeads[i].tagname = bankerlist[i].userId;
                this.bankerHeads[i].getComponent(cc.Sprite).spriteFrame = null;
                this.bankerHeads[i].parent.parent.getChildByName('bling').active = (bankerlist[i].userId == cc.dd.user.id);
                cc.dd.SysTools.loadWxheadH5(this.bankerHeads[i].getComponent(cc.Sprite), bankerlist[i].headUrl);
            }
        }
        let allcoin = 0;
        bankerlist.forEach(p => {
            allcoin += p.coin;
        });
        cc.find('top/banker_num/num', this.node).getComponent(cc.Label).string = bankerlist.length.toString();
        cc.find('top/banker_gold/num', this.node).getComponent(cc.Label).string = allcoin.toString();
        cc.find('info/max_bet', this.node).getComponent(cc.Label).string = bankerlist.length == 0 ? '1000000' : (bankerlist.length * 1000000).toString();
        var xianlist = brnn_Data.getBankerList(false);
        cc.find('bottom/btns/people/num', this.node).getComponent(cc.Label).string = xianlist.length.toString();
        this.updateReqBankNum();
    },

    //更新战绩
    updateBattleHistory() {
        var battle_info = brnn_Data.getBattleList();
        for (var i = 0; i < 10; i++) {
            var node = cc.find('zhanji/zk/record_' + i, this.node);
            if (i < battle_info.length) {
                for (var j = 0; j < battle_info[i].length; j++) {
                    if (battle_info[i][j].id == 5)
                        node.getChildByName(battle_info[i][j].id.toString()).getComponent(cc.Label).string = battle_info[i][j].isOk + '';
                    else if (battle_info[i][j].id < 5)
                        node.getChildByName(battle_info[i][j].id.toString()).getComponent(cc.Sprite).spriteFrame = this.splist_zhanji[battle_info[i][j].isOk];
                }
                node.active = true;
            }
            else {
                cc.find('zhanji/zk/record_' + i, this.node).getComponentsInChildren(cc.Sprite).forEach(scp => {
                    scp.spriteFrame = null;
                });
                cc.find('zhanji/zk/record_' + i, this.node).getComponentsInChildren(cc.Label).forEach(lbl => {
                    lbl.string = '';
                });
                node.active = false;
            }
        }
    },

    //更新下注分数
    updateBetScore(pos) {
        let bet_info = brnn_Data.getBetScore(pos);
        let bet_me = bet_info.me;           //自己下注
        let bet_total = bet_info.total;     //区域总注
        let bet_all = bet_info.all;         //总下注
        if (pos < 5) {
            if (bet_me) {
                cc.find('score/layout/my_bet', this.betArea[pos].parent).getComponent(cc.Label).string = '我的下注:' + bet_me;
                cc.find('score/layout/my_bet', this.betArea[pos].parent).active = true;
            }
            else {
                cc.find('score/layout/my_bet', this.betArea[pos].parent).active = false;
            }
            if (bet_total) {
                cc.find('score/layout/total_bet', this.betArea[pos].parent).getComponent(cc.Label).string = '总下注:' + bet_total;
                cc.find('score/layout/total_bet', this.betArea[pos].parent).active = true;
            }
            else {
                cc.find('score/layout/total_bet', this.betArea[pos].parent).active = false;
            }
            cc.find('info/total_bet', this.node).getComponent(cc.Label).string = bet_all.toString();
        }
    },

    //更新上庄人数
    updateReqBankNum() {
        let isBanker = brnn_Data.getPlayerById(cc.dd.user.id).isBanker;
        if (isBanker) {
            let remain = brnn_Data._remainBankRound;
            cc.find('info/t1', this.node).getComponent(cc.Label).string = '连续上庄';
            cc.find('info/bank_gold', this.node).getComponent(cc.Label).string = '';
            cc.find('info/t2', this.node).getComponent(cc.Label).string = '剩余坐庄局数:';
            cc.find('info/bank_wait', this.node).x = 50;
            cc.find('info/bank_wait', this.node).getComponent(cc.Label).string = remain.toString();
            cc.find('top/bank_btn', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_reqbank[1];
            cc.find('bottom/mine/role', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_role[1];
        }
        else {
            let myNum = brnn_Data.myBankerRank;
            let allNum = brnn_Data.reqBankerNum;
            cc.find('info/t1', this.node).getComponent(cc.Label).string = '上庄金币:';
            cc.find('info/bank_gold', this.node).getComponent(cc.Label).string = '1000万';
            cc.find('bottom/mine/role', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_role[0];
            if (myNum > 0) {
                cc.find('info/t2', this.node).getComponent(cc.Label).string = '队列中:';
                cc.find('info/bank_wait', this.node).x = -11;
                cc.find('info/bank_wait', this.node).getComponent(cc.Label).string = myNum + '/' + allNum;
                cc.find('top/bank_btn', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_reqbank[1];
            }
            else {
                cc.find('info/t2', this.node).getComponent(cc.Label).string = '总排队人数:';
                cc.find('info/bank_wait', this.node).x = 25.1;
                cc.find('info/bank_wait', this.node).getComponent(cc.Label).string = allNum.toString();
                cc.find('top/bank_btn', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_reqbank[0];
            }
        }
    },

    //更新自己头像信息
    updateSelfInfo() {
        cc.find('bottom/mine/head_bg/head_mask/head', this.node).tagname = cc.dd.user.id;
        let player = brnn_Data.getPlayerById(cc.dd.user.id);
        if (!player) {
            cc.error('找不到自己的玩家信息');
            return;
        }
        let name = player.name;
        let coin = player.coin;
        let headUrl = player.headUrl;
        let isBanker = player.isBanker;
        cc.find('bottom/mine/name', this.node).getComponent(cc.Label).string = cc.dd.Utils.substr(name, 0, 4);
        cc.find('bottom/mine/gold', this.node).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(coin);
        if (isBanker) {
            cc.find('bottom/mine/role', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_role[1];
            this.updateReqBankNum();
        }
        else {
            cc.find('bottom/mine/role', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_role[0];
        }
        cc.dd.SysTools.loadWxheadH5(cc.find('bottom/mine/head_bg/head_mask/head', this.node).getComponent(cc.Sprite), headUrl);
        let mybet = brnn_Data.getMyBetTotal();
        this.initChipList(coin, mybet);
       
    },

    /**
     * 游戏状态更新
     * @param {*} roomState 
     */
    updateState(roomState) {
        cc.find('zi', this.node).children.forEach(element => {
            element.active = false;
        });
        switch (roomState) {
            case 0:     //等待
                this._forbidenResult = false;
                brnn_Data.resetData();
                this.resetUI();
                this.updateBattleHistory();
                this.updateSelfInfo();
                this.updateBankerList();
                cc.find('zi/wait_start', this.node).active = true;
                cc.find('top/bank_btn', this.node).getComponent(cc.Button).interactable = true;
                break;
            case 1:     //下注
                this._forbidenResult = false;
                cc.find('bottom/chips_hong/tips', this.node).active = true;
                cc.find('zi/start_bet', this.node).active = true;
                cc.find('zi/start_bet', this.node).getComponent(cc.Animation).off('finished');
                cc.find('zi/start_bet', this.node).getComponent(cc.Animation).on('finished', this.sendPoker, this);
                cc.find('zi/start_bet', this.node).getComponent(cc.Animation).play();
                AudioManager.getInstance().playSound(brnn_audio_cfg.COMMON.START_BET, false);
                break;
            case 2:     //结算
                break;
        }
    },

    //更新时间
    updateTime() {
        let pad = function (num, n) {
            var len = num.toString().length;
            while (len < n) {
                num = "0" + num;
                len++;
            }
            return num;
        };
        let date = new Date();
        this.time_lbl.string = pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2);
    },

    //猜红
    btnCaihong(target, custom) {
        if (custom) {//猜红
            cc.find('bottom/chips', this.node).active = false;
            cc.find('bottom/chips_hong', this.node).active = true;
            cc.find('bottom/btns/btn_xiazhu', this.node).active = true;
            cc.find('bottom/btns/btn_caihong', this.node).active = false;
        }
        else {//下注
            cc.find('bottom/chips', this.node).active = true;
            cc.find('bottom/chips_hong', this.node).active = false;
            cc.find('bottom/btns/btn_xiazhu', this.node).active = false;
            cc.find('bottom/btns/btn_caihong', this.node).active = true;
        }
    },

    initCaihongChips(coin) {
        if (coin > 800000) {
            cc.find('bottom/chips_hong/tips/num', this.node).getComponent(cc.Label).string = '10';
            cc.find('bottom/chips_hong/tips/danwei', this.node).width = 92;
        }
        else if (coin > 300000) {
            cc.find('bottom/chips_hong/tips/num', this.node).getComponent(cc.Label).string = '2';
            cc.find('bottom/chips_hong/tips/danwei', this.node).width = 92;
        }
        else if (coin > 100000) {
            cc.find('bottom/chips_hong/tips/num', this.node).getComponent(cc.Label).string = '5000';
            cc.find('bottom/chips_hong/tips/danwei', this.node).width = 60;
        }
        else if (coin > 60000) {
            cc.find('bottom/chips_hong/tips/num', this.node).getComponent(cc.Label).string = '1000';
            cc.find('bottom/chips_hong/tips/danwei', this.node).width = 60;
        }
        else if (coin > 50000) {
            cc.find('bottom/chips_hong/tips/num', this.node).getComponent(cc.Label).string = '200';
            cc.find('bottom/chips_hong/tips/danwei', this.node).width = 60;
        }
        else {
            cc.find('bottom/chips_hong/tips/num', this.node).getComponent(cc.Label).string = '10';
            cc.find('bottom/chips_hong/tips/danwei', this.node).width = 60;
        }
    },

    showHongAni(pokers) {
        for (var i = 0; i < 6; i++) {
            cc.find('bottom/chips_hong/chip_' + i + '/chip_ani', this.node).active = false;
            cc.find('bottom/chips_hong/chip_' + i + '/mask', this.node).active = false;
        }
        if (pokers) {
            var hong = brnn_Data.getHongCardNum(pokers);
            cc.find('bottom/chips_hong/tips', this.node).active = false;
            for (var i = 0; i < 6; i++) {
                if (i == hong)
                    cc.find('bottom/chips_hong/chip_' + i + '/chip_ani', this.node).active = true;
                else
                    cc.find('bottom/chips_hong/chip_' + i + '/mask', this.node).active = true;
            }
        }
    },

    resetCaihong() {
        this.showHongAni();
        for (var i = 0; i < 6; i++) {
            cc.find('bottom/chips_hong/chip_' + i + '/bet', this.node).active = false;
            cc.find('bottom/chips_hong/chip_' + i + '/bei', this.node).active = true;
        }
    },

    active_hide_zk(event, custom) {
        var node = cc.find('zhanji/hide_zk', this.node);
        if (custom) {
            node.active = true;
        }
        else {
            node.active = false;
        }
    },
});
