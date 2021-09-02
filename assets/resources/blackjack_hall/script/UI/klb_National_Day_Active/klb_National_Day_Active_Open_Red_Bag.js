// create by wj 2018/08/14
const hallSendMsgCenter = require('HallSendMsgCenter');
const Hall = require('jlmj_halldata');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_nBoxId: 0,
        m_nOpenIndx: 0,
        m_tRedBag: { default: [], type: cc.Node },
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

    setRedBagHide: function () {
        this.m_tRedBag.forEach(function (btn) {
            btn.active = false;
        });
    },

    //点击开箱子
    onClickOpenRedBag: function (event, data) {
        hall_audio_mgr.com_btn_click();

        this.m_nOpenIndx = parseInt(data);
        this.m_tRedBag[this.m_nOpenIndx].zIndex = 100;
        // var move = cc.moveTo(0.2, cc.v2(0,0));
        // var scale = cc.scaleTo(0.2,1.5);
        // var seq = cc.sequence(cc.spawn(move, scale), cc.callFunc(function(){
        //     hallSendMsgCenter.getInstance().sendNationalDayActiveOpenBox(this.m_nBoxId);
        // }.bind(this)));
        // this.m_tRedBag[this.m_nOpenIndx].runAction(seq);
        var endTag = false;
        for (var i = 0; i < 3; i++) {
            // var move = cc.moveTo(0.2, cc.v2(0, 0));
            // var scale = cc.scaleTo(0.2, 1.5);
            // if (i != this.m_nOpenIndx) {
            //     scale = cc.scaleTo(0.2, 0.01);
            // }
            if (i == this.m_nOpenIndx)
                endTag = true;
            // var seq = cc.sequence(cc.spawn(move, scale), cc.callFunc(function () {
            //     if (endTag) {
            //         hallSendMsgCenter.getInstance().sendNationalDayActiveOpenBox(this.m_nBoxId);
            //         endTag = false;
            //     }
            // }.bind(this)));
            // this.m_tRedBag[i].runAction(seq);

            let move = cc.tween().to(0.2, { position: cc.v2(0, 0) });
            let scale = cc.tween().to(0.2, { scale: 1.5 })
            if (i != this.m_nOpenIndx) {
                scale = cc.tween().to(0.2, { scale: 0.01 })
            }

            cc.tween(this.m_tRedBag[i])
                .parallel(
                    move, scale
                )
                .call(function () {
                    if (endTag) {
                        hallSendMsgCenter.getInstance().sendNationalDayActiveOpenBox(this.m_nBoxId);
                        endTag = false;
                    }
                }.bind(this))
                .start();
        }
    },

    //展示红包
    showOpenRedBagResult: function (data) {
        this.setRedBagHide();
        this.m_tRedBag[3].active = true;
        AudioManager.playSound("gameyj_hall/audios/open");

        var eggAnim = cc.dd.Utils.seekNodeByName(this.m_tRedBag[3], 'hongbao');
        eggAnim.active = true;
        eggAnim.getComponent(sp.Skeleton).enabled = true;
        eggAnim.getComponent(sp.Skeleton).clearTracks();
        eggAnim.getComponent(sp.Skeleton).setAnimation(0, 'hongbao', false);
        eggAnim.getComponent(sp.Skeleton).loop = false;

        var numTxt = cc.dd.Utils.seekNodeByName(this.m_tRedBag[3], 'num');
        numTxt.getComponent(cc.Label).string = (data[0].cnt / 100).toFixed(2) + '元';

        // var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
        //     var resultNode = cc.dd.Utils.seekNodeByName(this.m_tRedBag[3], 'resultNode');
        //     resultNode.active = true;
        // }.bind(this)));
        // this.node.runAction(seq);
        cc.tween(this.node)
            .delay(1)
            .call(function () {
                var resultNode = cc.dd.Utils.seekNodeByName(this.m_tRedBag[3], 'resultNode');
                resultNode.active = true;
            }.bind(this))
            .start();
        eggAnim.getComponent(sp.Skeleton).setCompleteListener(function () {

            eggAnim.getComponent(sp.Skeleton).enabled = true;
            eggAnim.getComponent(sp.Skeleton).setAnimation(0, 'xunhuan', false);
            eggAnim.getComponent(sp.Skeleton).loop = false;

        }.bind(this));


    },

    onClickClose: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.NATIONAL_AVTIVE_OPEN_BOX:
                this.showOpenRedBagResult(data);
                break;
        }
    },
});
