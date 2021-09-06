//create by wj 2018/09/12
const Hall = require('jlmj_halldata');
const activityData = Hall.HallData.Instance();
const hallSendMsgCenter = require('HallSendMsgCenter');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_tWordSp: [],
        m_tBtn: [],
        m_tBtnSateSprite: { default: [], type: cc.SpriteFrame },
    },


    onLoad: function () {
        //AudioManager.playMusic('blackjack_hall/audios/cj_bg');
        Hall.HallED.addObserver(this);

        //文字存储容器
        for (var i = 0; i < 27; i++) {
            this.m_tWordSp[i] = cc.dd.Utils.seekNodeByName(this.node, "word" + i);
            var wordShow = cc.dd.Utils.seekNodeByName(this.m_tWordSp[i], 'wordshow');
            wordShow.active = false;
            var numTxt = cc.dd.Utils.seekNodeByName(this.m_tWordSp[i], 'num');
            numTxt.active = false;
        }
        //领奖按钮存储容器
        for (var k = 0; k < 13; k++) {
            this.m_tBtn[k] = cc.dd.Utils.seekNodeByName(this.node, "btn" + k);
        }

        var shineNode = this.m_tBtn[0].getChildByName('shine');
        if (shineNode) {
            // shineNode.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8))));
            cc.tween(shineNode)
                .set({ opacity: 0 })
                .to(0.8, { opacity: 255 })
                .to(0.8, { opacity: 0 })
                .union()
                .repeatForever()
                .start();
            shineNode.active = true;
        }


        //剩余次数的描述文字
        this.m_oLeftTimeTxt = cc.dd.Utils.seekNodeByName(this.node, 'lefttime').getComponent(cc.Label);
        this.updateLeftTimeTxt();
        this.updateWordsList();
        this.updateBoxList();
    },

    ctor: function () {
        this.animName = [
            'huan',
            'du',
            'chun',
            'jie',
            'jing',
            'xi',
            'nao',
            'fan',
            'tian',
            'chang',
            'wan',
            'xiang',
            'le',
            'hong',
            'bao',
            'qiang',
            'dao',
            'shou',
            'kuang',
            'huan',
            'shuang',
            'jie',
            'hao',
            'li',
            'song',
            'bu',
            'ting',
        ];
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    //更新剩余次数文字描述
    updateLeftTimeTxt: function () {
        this.m_oLeftTimeTxt.string = '我的翻牌次数:  ' + activityData.getNationalDayActivityTimes();
    },

    //更新已获得文字显示
    updateWordsList: function () {
        var list = activityData.getNationalDayActivityWordList();
        list.forEach(function (wordData) {
            var wordShow = cc.dd.Utils.seekNodeByName(this.m_tWordSp[wordData.wordIndex], 'wordshow');
            wordShow.active = true;
            var numTxt = cc.dd.Utils.seekNodeByName(this.m_tWordSp[wordData.wordIndex], 'num');
            numTxt.active = true;
            numTxt.getComponent(cc.Label).string = wordData.num;
        }.bind(this));
    },

    //展示获得文字动画
    showWordAnimation: function (pos) {
        var wordAnim = cc.dd.Utils.seekNodeByName(this.m_tWordSp[pos], 'FFL');
        wordAnim.active = true;
        wordAnim.getComponent(sp.Skeleton).enabled = true;
        wordAnim.getComponent(sp.Skeleton).clearTracks();
        wordAnim.getComponent(sp.Skeleton).setAnimation(0, this.animName[pos], false);
        wordAnim.getComponent(sp.Skeleton).setCompleteListener(function () {
            wordAnim.active = false;
            wordAnim.getComponent(sp.Skeleton).enabled = false;
        });
        // var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
        //     wordAnim.active = false;
        //     wordAnim.getComponent(sp.Skeleton).enabled = false;
        // }));
        // wordAnim.runAction(seq);
    },

    //更新可开启宝箱
    updateBoxList: function () {
        this.m_tBtn.forEach(function (btn, index) {
            btn.getComponent(cc.Button).interactable = false;
            var anim = btn.getChildByName('anim');
            anim.active = false;
            if (index >= 1 && index < 4)
                btn.getComponent(cc.Sprite).spriteFrame = this.m_tBtnSateSprite[1];
            else if (index >= 4 && index < 13)
                btn.getComponent(cc.Sprite).spriteFrame = this.m_tBtnSateSprite[2];

        }.bind(this));

        //可领取按钮状态
        var list = activityData.getNationalDayActivityBoxList();
        list.forEach(function (box) {
            this.m_tBtn[box].getComponent(cc.Button).interactable = true;
            if (box != 0) {
                var anim = this.m_tBtn[box].getChildByName('anim');
                anim.active = true;
                anim.getComponent(cc.Animation).play('btnLight');
            }
            if (box == 0) {
                // this.m_tBtn[0].stopAllActions();
                cc.Tween.stopAll();
                var x = this.m_tBtn[box].x;
                // var moveRight = cc.moveTo(0.1, cc.v2(x + 2, this.m_tBtn[box].y));
                // var moveLeft = cc.moveTo(0.1, cc.v2(x - 2, this.m_tBtn[box].y));
                // this.m_tBtn[box].runAction(cc.repeatForever(cc.sequence(moveRight, moveLeft)));
                cc.tween(this.m_tBtn[box])
                    .to(0.1, { position: cc.v2(x + 2, this.m_tBtn[box].y) })
                    .to(0.1, { position: cc.v2(x - 2, this.m_tBtn[box].y) })
                    .union()
                    .repeatForever()
                    .start();
            } else if (box >= 1 && box < 4)
                this.m_tBtn[box].getComponent(cc.Sprite).spriteFrame = this.m_tBtnSateSprite[4];
            else if (box >= 4 && box < 13)
                this.m_tBtn[box].getComponent(cc.Sprite).spriteFrame = this.m_tBtnSateSprite[5];
        }.bind(this));

        //已领取按钮状态
        var opend_list = activityData.getNationalDayActivityOpendBoxList();
        opend_list.forEach(function (opend_box) {
            if (opend_box == 0) {
                this.m_tBtn[opend_box].getChildByName('shine').active = false;
                // this.m_tBtn[opend_box].stopAllActions();
                cc.Tween.stopAll();
            } else if (opend_box >= 1 && opend_box < 4)
                this.m_tBtn[opend_box].getComponent(cc.Sprite).spriteFrame = this.m_tBtnSateSprite[7];
            else if (opend_box >= 4 && opend_box < 13)
                this.m_tBtn[opend_box].getComponent(cc.Sprite).spriteFrame = this.m_tBtnSateSprite[8];
        }.bind(this));
    },

    //点击翻牌
    onClickDraw: function (event, data) {
        hall_audio_mgr.com_btn_click();

        if (activityData.getNationalDayActivityTimes() <= 0) {
            cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_National_Day_Active/klb_National_Day_Active_Message_Box');
            return;
        }

        hallSendMsgCenter.getInstance().sendNationalDayActiveDraw();
    },

    //点击砸金蛋
    onClickSmashGoldEggs: function (event, data) {
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_National_Day_Active/klb_National_Day_Active_Gold_Egg', function (ui) {
            var cpt = ui.getComponent('klb_National_Day_Active_Smash_Gold_Eggs');
            cpt.onInit(parseInt(data));
        });
    },

    //点击开红包
    onClickOpenRedBag: function (event, data) {
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_National_Day_Active/klb_National_Day_Active_Red_Bag_Award', function (ui) {
            var cpt = ui.getComponent('klb_National_Day_Active_Open_Red_Bag');
            cpt.onInit(parseInt(data));
        });
    },

    //点击打开拉霸
    onClickOpenSlot: function (event, data) {
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_National_Day_Active/klb_National_Day_Active_Slot', function (ui) {
            var cpt = ui.getComponent('klb_National_Day_Active_Slot');
            cpt.onInit(parseInt(data));
        });
    },

    //点击打开规则界面
    onClickOpenRuleUI: function (event, data) {
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_National_Day_Active/klb_National_Day_Active_Rule');
    },

    //点击打开分享界面
    onClickOpenShareUI: function (event, data) {
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_National_Day_Active/klb_National_Day_Active_Share', function (ui) {
            var share_ui = ui.getComponent('klb_hall_share');
            if (share_ui != null) {
                share_ui.setShareImg('cj-fenxiang.jpg');
            }
        });
    },

    onClickClose: function (event, data) {
        hall_audio_mgr.com_btn_click();
        // cc.audioEngine.stop(this.m_nBakcMusic);
        // AudioManager.stopMusic();
        cc.dd.UIMgr.destroyUI(this.node);
        //AudioManager.playMusic('blackjack_hall/audios/hall_bg');
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.NATION_ACTIVE_LEFTTIME:
                this.updateLeftTimeTxt();
                break;
            case Hall.HallEvent.NATIONAL_ACTIVE_DRAW:
                this.updateLeftTimeTxt();
                this.updateWordsList();
                this.updateBoxList();
                this.showWordAnimation(data);
                break;
            case Hall.HallEvent.NATIONAL_AVTIVE_OPEN_BOX:
                this.updateBoxList();
                break;
        }
    },

});
