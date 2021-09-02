// create by wj 2018/09/13
const hallSendMsgCenter = require('HallSendMsgCenter');
const Hall = require('jlmj_halldata');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_nBoxId: 0,
        m_nOpenIndx: 0,
        m_tEggNode: { default: [], type: cc.Node },
    },


    onLoad: function () {
        Hall.HallED.addObserver(this);
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    //初始化本地数据信息
    onInit: function (boxId) {
        this.m_nBoxId = boxId;
    },

    setEggsTouchEnabled: function () {
        this.m_tEggNode.forEach(function (btn) {
            btn.getComponent(cc.Button).interactable = false;
        });
    },

    //点击开箱子
    onClickSmashGoldEggs: function (event, data) {
        this.setEggsTouchEnabled();
        this.m_nOpenIndx = parseInt(data);
        var eggAnim = cc.dd.Utils.seekNodeByName(this.m_tEggNode[this.m_nOpenIndx], 'jindan');
        eggAnim.active = true;
        eggAnim.getComponent(sp.Skeleton).enabled = true;
        eggAnim.getComponent(sp.Skeleton).clearTracks();
        eggAnim.getComponent(sp.Skeleton).setAnimation(0, '2', false);
        eggAnim.getComponent(sp.Skeleton).loop = false;
        AudioManager.playSound("blackjack_hall/audios/smash_Egg");

        eggAnim.getComponent(sp.Skeleton).setCompleteListener(function () {
            hallSendMsgCenter.getInstance().sendNationalDayActiveOpenBox(this.m_nBoxId);
        }.bind(this));

    },

    //展示砸蛋结果
    showOpenEggResult: function (data) {
        var eggAnim = cc.dd.Utils.seekNodeByName(this.m_tEggNode[this.m_nOpenIndx], 'jindan');
        eggAnim.active = true;
        eggAnim.getComponent(sp.Skeleton).enabled = true;
        eggAnim.getComponent(sp.Skeleton).clearTracks();
        eggAnim.getComponent(sp.Skeleton).setAnimation(0, '3', true);
        eggAnim.getComponent(sp.Skeleton).loop = true;
        eggAnim.getComponent(sp.Skeleton).setCompleteListener(function () {

        }.bind(this));

        var getBtn = cc.dd.Utils.seekNodeByName(this.m_tEggNode[this.m_nOpenIndx], 'get_btn');
        getBtn.active = true;
        var coinNum = cc.dd.Utils.seekNodeByName(this.m_tEggNode[this.m_nOpenIndx], 'coin');
        coinNum.active = true;
        coinNum.getComponent(cc.Label).string = data[0].cnt;
        cc.dd.Utils.seekNodeByName(this.m_tEggNode[this.m_nOpenIndx], 'coindi').active = true;;

    },

    onClickClose: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.NATIONAL_AVTIVE_OPEN_BOX:
                this.showOpenEggResult(data);
                break;
        }
    },


});
