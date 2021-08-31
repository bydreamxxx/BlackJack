// create by wj 2018/09/14
const hallSendMsgCenter = require('HallSendMsgCenter');
const Hall = require('jlmj_halldata');
const data_slotRun = require('slotrun');
var arrayCtrl = require('ArrayCtrl').ArrayCtrl;

cc.Class({
    extends: cc.Component,

    properties: {
        m_nBoxId: 0,
        atlas: cc.SpriteAtlas,
        m_tRunTimer: [], //控制器
        m_tRunEndTag: [],
        m_tRunEndTimer: [],
        m_nRunEndTag: 0,
        m_oCoinAnim: cc.Node,
        m_nIndex: 0,
        m_oLaGan: cc.Node,
    },

    onLoad: function () {
        Hall.HallED.addObserver(this);

        //小老虎机
        //主体转轮
        var oRunContent = cc.dd.Utils.seekNodeByName(this.node, "Panel_RunContent");
        var tRunLines = new arrayCtrl();
        tRunLines.CreateArrayCtrl(-1, 1, oRunContent);
        tRunLines.resize(5);

        this.m_tRunLines = [];
        this.m_tRunContent = [];
        //老虎机背景
        for (var i = 0; i < 5; i++) {
            var runLine = tRunLines.at(i);
            this.m_tRunContent[i] = cc.dd.Utils.seekNodeByName(runLine, "Panel_Content");
            var arrRunLine = new arrayCtrl();
            arrRunLine.CreateArrayCtrl(1, -1, this.m_tRunContent[i]);
            this.m_tRunLines[i] = arrRunLine;
        }
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    //初始化本地数据信息
    onInit: function (boxId) {
        this.m_nBoxId = boxId;
        this.initSlotData();
    },

    //初始化拉霸数据
    initSlotData: function () {
        this.m_tCardList = [];
        for (var k = 0; k < 10; k++) {
            this.m_tCardList[k] = k;
        }

        this.m_tStartCards = [];
        for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 1; y++) {
                this.SetTablePosVal(this.m_tStartCards, x, y, 9);
            }
        }

        this.m_tRunCfg = [];
        for (var k = 0; k < 5; k++) {
            this.m_tRunCfg[k] = data_slotRun.items[5 - 1 - k];
        }

        this.buildAllRunLine();
        this.fillRunLine();
    },

    SetTablePosVal: function (t, x, y, v) {
        var col = t[x];
        if (col == null) {
            col = [];
            t[x] = col;
        }
        col[y] = v
    },

    GetTablePosVal: function (t, x, y) {
        var col = t[x];
        if (col)
            return col[y];
        return null
    },

    buildRunLine: function (startCard1, nCol) {
        var cardList = [];
        cardList[0] = startCard1;
        var cardLen = this.m_tCardList.length;
        var lineLen = this.m_tRunCfg[nCol].lineLen
        for (var i = 1; i < lineLen; i++) {
            cardList[i] = this.m_tCardList[parseInt(Math.random() * (cardLen) + 0, 10)];
        }
        return cardList;
    },

    buildAllRunLine: function () {
        this.m_tRunLinesData = [];
        for (var i = 0; i < 5; i++) {
            var startCard1 = this.GetTablePosVal(this.m_tStartCards, i, 0);
            this.m_tRunLinesData[i] = this.buildRunLine(startCard1, i);
        }
    },

    //填充老虎机
    fillRunLine: function () {
        var self = this;
        var tRunLinesData = this.m_tRunLinesData;
        for (var i = 0; i < 5; i++) {
            var arrRunLine = this.m_tRunLines[i];
            var oneLineData = tRunLinesData[i];
            arrRunLine.updateItemEx(oneLineData, function (card_id, uiNode, index, key) {
                var cardicon = ('gq_zi_' + card_id) + card_id;
                if (index == 0 || index == oneLineData.length - 1)
                    cardicon = ('gq_zi_' + card_id)
                uiNode.getComponent(cc.Sprite).spriteFrame = self.atlas.getSpriteFrame(cardicon);
                uiNode.active = true;
            });
        }
    },

    //开始跑老虎机
    StartRunEffect: function () {
        var runCfg = this.m_tRunCfg;
        for (var i = 0; i < 5; i++) {
            var runLine = this.m_tRunContent[i];
            var arrRunLine = this.m_tRunLines[i];
            runLine.y = 0

            var runTimer = [];
            runTimer.cfg = runCfg[i];

            runTimer.endPosY = -(arrRunLine.showCount() - 1) * arrRunLine.m_offset.y
            runTimer.passTime = - runTimer.cfg.delayTime / 1000.0

            this.m_tRunTimer[i] = runTimer;
            this.m_tRunEndTimer[i] = 0;
        }
    },


    //点击抽奖
    onClickStartSlot: function (event, data) {
        var eggAnim = cc.dd.Utils.seekNodeByName(this.node, 'lagan');
        eggAnim.getComponent(sp.Skeleton).enabled = true;
        eggAnim.getComponent(sp.Skeleton).clearTracks();
        eggAnim.getComponent(sp.Skeleton).setAnimation(0, 'lagan', false);
        // var seq = cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
        //     AudioManager.playSound("gameyj_hall/audios/slot");
        //     hallSendMsgCenter.getInstance().sendNationalDayActiveOpenBox(this.m_nBoxId);
        // }.bind(this)));
        // this.node.runAction(seq);
        cc.tween(this.node)
            .delay(0.3)
            .call(function () {
                AudioManager.playSound("gameyj_hall/audios/slot");
                hallSendMsgCenter.getInstance().sendNationalDayActiveOpenBox(this.m_nBoxId);
            }.bind(this))
            .start();
        // eggAnim.getComponent(sp.Skeleton).setCompleteListener(function(){
        //     AudioManager.playSound( "gameyj_hall/audios/slot" );
        //     hallSendMsgCenter.getInstance().sendNationalDayActiveOpenBox(this.m_nBoxId);
        // }.bind(this));

    },

    //展示红包
    showSlotResult: function (data) {
        var resultList = [];
        var result = data[0].cnt;
        resultList[0] = parseInt(result / 10000);
        result = result % 10000;
        resultList[1] = parseInt(result / 1000);
        result = result % 1000;
        resultList[2] = parseInt(result / 100);
        result = result % 100;
        resultList[3] = parseInt(result / 10);
        result = result % 10;
        resultList[4] = result;

        var tEndCards = [];
        for (var x = 0; x < 5; x++) {
            this.SetTablePosVal(tEndCards, x, 0, resultList[x])
        }

        this.buildAllRunLine();

        for (var i = 0; i < 5; i++) {
            var endCard1 = this.GetTablePosVal(tEndCards, i, 0);
            var cardList = this.m_tRunLinesData[i];
            cardList[cardList.length - 1] = endCard1;
        }

        this.fillRunLine();
        this.StartRunEffect();
    },

    update: function (dt) {
        //老虎机滚轴
        if (this.m_tRunTimer.length > 0) {
            for (var k = 0; k < this.m_tRunTimer.length; k++) {
                var v = this.m_tRunTimer[k];
                if (v) {
                    v.passTime = v.passTime + dt;
                    var runLine = this.m_tRunContent[k];
                    if (v.passTime > 0) {
                        var curPosY = -v.passTime * v.cfg.startSpeed;
                        if (curPosY < v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5) {
                            curPosY = v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5;
                            runLine.y = curPosY;
                            this.m_tRunTimer[k] = null;
                            this.m_nRunEndTag += 1;
                            //声音播放，暂未处理if(gSlotMgr.)
                        } else {
                            runLine.y = curPosY;
                        }
                    }
                }
            }
        }

        if (this.m_nRunEndTag == 5) {
            this.m_nRunEndTag = 0;
            this.m_tRunTimer.splice(0, this.m_tRunTimer.length);
            this.playCoinAnim();
        }
    },

    playCoinAnim: function () {
        if (this.m_nIndex == 100)
            return;
        var self = this;
        var node = cc.instantiate(this.m_oCoinAnim);
        node.active = true;
        node.getComponent(cc.Animation).play('coinRotateAnim');
        var x = Math.floor(Math.random() * (640 - 0 + 1) + 0);
        var tag = Math.round(Math.random());
        if (tag == 0)
            x = -x;
        parseInt(Math.random() * (720 - 360 + 1) + 360, 10);
        var q1_y = Math.floor(Math.random() * (720 - 360 + 1) + 360);
        parseInt(Math.random() * (360 - 290 + 1) + 290, 10);
        var q2_y = Math.floor(Math.random() * (360 - 290 + 1) + 290);
        var q1 = cc.v2(x, q1_y);
        var q2 = cc.v2(x, q2_y);
        var coin_endPos = cc.v2(x, - 360);
        // var bezier = [q1, q2, coin_endPos];
        var time = 1;
        // var bezierAct = cc.bezierTo(time, bezier);
        // node.runAction(cc.sequence(cc.spawn(bezierAct, cc.sequence(cc.delayTime(0.01), cc.callFunc(function () {
        //     self.playCoinAnim();
        //     self.m_nIndex += 1;
        // }))), cc.callFunc(function () {
        //     node.active = false;
        //     node.removeFromParent();
        //     if (self.m_nIndex >= 100) {
        //         // var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
        //         //     cc.dd.UIMgr.destroyUI(self.node);
        //         //     node.stopAllActions();
        //         // }));
        //         // self.node.runAction(seq);
        //     }
        // })));
        let t = cc.tween(node)
            .parallel(
                cc.tween().bezierTo(time, q1, q2, coin_endPos),
                cc.tween().delay(0.01).call(function () {
                    self.playCoinAnim();
                    self.m_nIndex += 1;
                })
            )
            .call(function () {
                node.active = false;
                node.removeFromParent();
                if (self.m_nIndex >= 100) {
                    cc.tween(self.node)
                        .delay(1)
                        .call(function () {
                            cc.dd.UIMgr.destroyUI(self.node);
                            t.stop();
                        })
                        .start();
                }
            })
            .start();
        node.parent = this.m_oCoinAnim.parent;
    },

    onClickClose: function (event, data) {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.NATIONAL_AVTIVE_OPEN_BOX:
                this.showSlotResult(data);
                break;
        }
    },
});
