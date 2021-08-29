//create by wj 2019/02/27

const hallSendMsgCenter = require('HallSendMsgCenter');
const Hall = require('jlmj_halldata');
const data_slotRun = require('slotrun');
var arrayCtrl = require('ArrayCtrl').ArrayCtrl;
const pk_audio = require('pk_audio');
const PK_Config = require('pk_Config');

cc.Class({
    extends: cc.Component,

    properties: {
        atlas : cc.SpriteAtlas,
        m_tRunTimer : [] , //控制器
        m_tRunEndTag : [],
        m_tRunEndTimer : [],
        m_nRunEndTag: 0,
        m_oBeginParticle: sp.Skeleton,
        m_oBeginAnim: cc.Animation,
        m_tHuoHuaAnim: {default: [], type: cc.Animation, toolTip:'火花动画'},
        m_tZhizhenParticle: {default: [], type: sp.Skeleton, toolTip:'箭头骨骼动画'},
        m_CallBackFunc: null,
        m_oResultAnim: cc.Animation,
    },

    onLoad: function () {
        Hall.HallED.addObserver(this);

        //小老虎机
        //主体转轮
        var oRunContent = cc.dd.Utils.seekNodeByName(this.node, "Panel_RunContent");
        var tRunLines =   new arrayCtrl();
        tRunLines.CreateArrayCtrl(-1, 1, oRunContent);
        tRunLines.resize(1);
    
        this.m_tRunLines = [];
        this.m_tRunContent = [];
        //老虎机背景
        for (var i = 0; i < 1;i++ ){
            var runLine = tRunLines.at(i);
            this.m_tRunContent[i] = cc.dd.Utils.seekNodeByName(runLine, "Panel_Content");
            var arrRunLine = new arrayCtrl();
            arrRunLine.CreateArrayCtrl(1, -1, this.m_tRunContent[i]);
            this.m_tRunLines[i] = arrRunLine;
        }

        var self = this;
        this.m_oBeginParticle.node.active = true;
        this.m_oBeginParticle.clearTracks();
        this.m_oBeginParticle.setAnimation(0, 'mingyun', false);
        setTimeout(function(){
            self.m_oBeginAnim.play();
            var _callback = function(){
                self.m_oBeginAnim.off('finished', _callback);
                self.StartRunEffect();
            }
            self.m_oBeginAnim.on('finished', _callback);
        }, 800);

    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    //初始化本地数据信息
    onInit: function(reelType, callBack){
        cc.log('reelType=============' + reelType);
        this.initSlotData(reelType);
        this.m_CallBackFunc = callBack;
    },

    //初始化拉霸数据
    initSlotData: function(reelType){
        this.m_tCardList = [];
        for (var k = 0; k < 13; k++){
            this.m_tCardList[k] = k + 1;
        }

        this.m_tStartCards = [];
        for(var x = 0; x < 1; x++){
            for(var y = 0; y < 1; y++){
                //var cardId = parseInt(Math.random() * 13, 10);
                this.SetTablePosVal(this.m_tStartCards, x, y,  reelType);
            }
        }

        this.m_tRunCfg = [];
        for(var k = 0; k < data_slotRun.items.length; k++){
            this.m_tRunCfg[k] = data_slotRun.items[data_slotRun.items.length - 1 - k];
        }

        this.buildAllRunLine();
        this.fillRunLine();
    },

    SetTablePosVal: function(t, x, y, v){
        var col = t[x];
        if (col == null){
            col = [];
            t[x] = col;
        }
       col[y] = v
    },

    GetTablePosVal: function(t, x, y){
        var col = t[x];
        if(col)
            return col[y];    
        return null
    },

    buildRunLine: function(startCard1,  nCol){
        var cardList = [];
        var len = this.m_tRunCfg[nCol].lineLen + 62;
        cardList[len - 3] = startCard1;
        var cardLen = this.m_tCardList.length;
        var lineLen = len
        for(var i = 0; i < lineLen; i++){
            if(i != len - 3)
                cardList[i] = this.m_tCardList[parseInt(Math.random() * (cardLen) + 0, 10)];
        }
        return cardList;
    },

    buildAllRunLine: function(){
        this.m_tRunLinesData = [];
        for(var i = 0; i < 1; i++){
            var startCard1 = this.GetTablePosVal(this.m_tStartCards, i, 0);
            this.m_tRunLinesData[i] = this.buildRunLine(startCard1, i);
        }
    },

    //填充老虎机
    fillRunLine: function(){
        var self = this;
        var tRunLinesData = this.m_tRunLinesData;
        for(var i = 0; i < 1; i ++){
            var arrRunLine = this.m_tRunLines[i];
            var oneLineData = tRunLinesData[i];
            arrRunLine.updateItemEx(oneLineData, function(card_id, uiNode, index, key){
                var cardicon = 'dt_myzl_font_' + card_id;
                uiNode.getComponent(cc.Sprite).spriteFrame = self.atlas.getSpriteFrame(cardicon);
                uiNode.active = true; 
            });
        }
    },

    //开始跑老虎机
    StartRunEffect: function(){
        this.playAudio(1026015, false);
        var runCfg = this.m_tRunCfg;
        for (var i = 0; i < 1; i++){
            var runLine = this.m_tRunContent[i];
            var arrRunLine = this.m_tRunLines[i];
            runLine.y = 0

            var runTimer = [];
            runTimer.cfg = runCfg[i];
    
            runTimer.endPosY = -(arrRunLine.showCount() -7) * arrRunLine.m_offset.y
            runTimer.passTime = - runTimer.cfg.delayTime / 1000.0
    
            this.m_tRunTimer[i] = runTimer;
            this.m_tRunEndTimer[i] = 0;
        }
        this.m_tHuoHuaAnim[0].play();
        this.m_tHuoHuaAnim[1].play();
        var self = this;
        this.m_tZhizhenParticle[0].clearTracks();
        this.m_tZhizhenParticle[0].setAnimation(0, '1', false);
        this.m_tZhizhenParticle[0].setCompleteListener(function(){
            self.m_tZhizhenParticle[0].setAnimation(0, '2', true);
            self.m_tZhizhenParticle[0].setCompleteListener(function(){

            });
            setTimeout(function(){
                self.m_tZhizhenParticle[0].clearTracks();
                self.m_tZhizhenParticle[0].setAnimation(0, '3', true);
                setTimeout(function(){
                    self.m_tZhizhenParticle[0].clearTracks();
                    self.m_tZhizhenParticle[0].setAnimation(0, '4', false);
                    self.m_tZhizhenParticle[0].loop = false;
                    self.m_tZhizhenParticle[0].setCompleteListener(function(){
                        self.m_tZhizhenParticle[0].setAnimation(0, '1', false);
                        self.m_tZhizhenParticle[0].setCompleteListener(function(){
                            
                        })
                    });
                }, 2000);
            }, 300)
        });

        this.m_tZhizhenParticle[1].clearTracks();
        this.m_tZhizhenParticle[1].setAnimation(0, '1', false);
        this.m_tZhizhenParticle[1].setCompleteListener(function(){
            self.m_tZhizhenParticle[1].setAnimation(0, '2', true);
            self.m_tZhizhenParticle[1].setCompleteListener(function(){

            });
            setTimeout(function(){
                self.m_tZhizhenParticle[1].clearTracks();
                self.m_tZhizhenParticle[1].setAnimation(0, '3', true);
                setTimeout(function(){
                    self.m_tZhizhenParticle[1].clearTracks();
                    self.m_tZhizhenParticle[1].setAnimation(0, '4', false);
                    self.m_tZhizhenParticle[1].loop = false;
                    self.m_tZhizhenParticle[1].setCompleteListener(function(){
                        self.m_tZhizhenParticle[1].setAnimation(0, '1', false);
                        self.m_tZhizhenParticle[1].setCompleteListener(function(){
                            
                        })
                    });
                }, 2000);
            }, 300)
        });
    },

    update: function (dt) {
        //老虎机滚轴
        if(this.m_tRunTimer.length > 0){
            for(var k = 0; k < this.m_tRunTimer.length; k++){
                var v = this.m_tRunTimer[k];
                if(v){
                    v.passTime = v.passTime + dt;
                    var runLine = this.m_tRunContent[k];
                    if(v.passTime > 0){
                        var curPosY = runLine.y;
                        if(v.passTime < 0.3)
                            curPosY = -v.passTime * 240;
                        else
                            curPosY = -v.passTime * 1600;
                        if(curPosY < v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5){
                            curPosY = v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5;
                            runLine.y = (curPosY);
                            this.m_tRunTimer[k] = null;
                            this.m_nRunEndTag += 1;
                            //声音播放，暂未处理if(gSlotMgr.)
                        }else{
                            runLine.y = (curPosY);
                        }
                    }
                }
            }
        }

        if(this.m_nRunEndTag == 1){
            this.m_nRunEndTag = 0;
            this.m_tRunTimer.splice(0, this.m_tRunTimer.length);
            this.playAudio(1026014, false);
            this.onRunEnd();
        }
    },

    onRunEnd: function(){//滚动结束
        this.m_oResultAnim.node.active = true;
        this.m_oResultAnim.play();
        var self = this;
        setTimeout(function() {
            self.playAudio(1026013, false);
            self.m_oBeginAnim.play('fortune_Out');
            var callBack = function(){
                self.m_CallBackFunc();
                cc.dd.UIMgr.destroyUI(self.node);
            }
            self.m_oBeginAnim.on('finished', callBack);
        }, 1500);

    },

    //播放相应音效
    playAudio: function(audioId, isloop){
        var data =  pk_audio.getItem(function(item){
            if(item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(PK_Config.AuditoPath + name, isloop);
    },
});
