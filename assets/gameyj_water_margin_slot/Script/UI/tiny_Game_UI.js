//create by wj 2018/ 06 / 13
const TinyGameType = require('TinyGameType').TinyGameType;
const data_slotcard = require('slotcard');
const data_position = require('sfz_xml_base');
var arrayCtrl = require('ArrayCtrl').ArrayCtrl;
var gSlotMgr = require('SlotManger').SlotManger.Instance();
var SlotType = require('SlotType').SlotType;
var SlotCfg = require('SlotCfg');
const slot_audio = require('slotaudio');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var hallData = require('hall_common_data').HallCommonData;
var AudioManager = require('AudioManager').getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oMainNode: cc.Node,

        m_nCurrentPos : 1 , //当前跑到的点
        m_nBeginPos : 0 , //开始运行位置，作为记录保存点
        m_nFinalPos : 1 , //结束位置，靠服务器获取
        m_nTimer : 0  , //计时器
        m_nTotalTimer : 0  , //加速总时
        m_tRunTimer : [] , //控制器
        m_tRunEndTag : [],
        m_tRunEndTimer : [],
        m_nStep : 0,
        m_nTotalRwardAdd : 0,
        m_nTotalRward : 0,
        m_nAddWeighting : 1,
        m_oRunImage: {default: [], type: cc.Node, tooltip: '高显图标'}, // 高显图标
        atlas : cc.SpriteAtlas,
        m_nEndIndex : 4,
        wincard: 0,
        clipsList: {default: [], type: cc.AnimationClip, tooltip: '卡片播放特效'},
        m_bAudioPlay: false,
        m_nCurrentAudioId: 0,

        m_oLeftAnimation: cc.Animation,
        m_oRightAnimation: cc.Animation,

        endNode: cc.Node, //结算界面
        m_bGetAward: false,
        mainAtlas : cc.SpriteAtlas,
        m_oAwardBtn: cc.Button,
        m_oCompareBtn: cc.Button,

        m_nRunEndTag: 0,

        m_nLeftStep:0,
        m_nPerSetp : 0,
        m_nRunState: TinyGameType.GameRunState.RunDefault,
        m_runSubTimer:0,
        m_runAddTimer:0,
    },


    onLoad: function () {
        HallCommonEd.addObserver(this);
        cc.dd.NetED.addObserver(this);

        this.tinyGameManger = gSlotMgr.getTinyGameData();
        //保存高显图片
        for(var i = 0; i < 25; i++){
            this.m_oRunImage[i] = cc.dd.Utils.seekNodeByName(this.node, 'sprite_' + (i + 1));
            if(this.m_oRunImage[i])
                this.m_oRunImage[i].active = false;
        }

        //剩余次数
        this.m_oLeftNum = cc.dd.Utils.seekNodeByName(this.node, 'times').getComponent(cc.Label);
        if(this.m_oLeftNum)
            this.m_oLeftNum.string = gSlotMgr.getSmallGameTimes();

        //筹码数
        // var oCoin = cc.dd.Utils.seekNodeByName(this.node, 'coin').getComponent(cc.Label);
        // if(oCoin)
        //     oCoin.string = gSlotMgr.getGold();
        //押注数
        var oYaZhu = cc.dd.Utils.seekNodeByName(this.node, 'yazhu').getComponent(cc.Label);
        if(oYaZhu)
            oYaZhu.string = gSlotMgr.getTinyGameData().getBetNum();

        //得分
        this.m_oWinNum = cc.dd.Utils.seekNodeByName(this.node, 'socre').getComponent(cc.Label);
        if(this.m_oWinNum)
            this.m_oWinNum.string = gSlotMgr.getTinyGameData().getRewardNum();


        //小老虎机
        //主体转轮
        var oRunContent = cc.dd.Utils.seekNodeByName(this.node, "Panel_RunContent");
        var tRunLines =   new arrayCtrl();
        tRunLines.CreateArrayCtrl(-1, 1, oRunContent);
        tRunLines.resize(4);
    
        this.m_tRunLines = [];
        this.m_tRunContent = [];
        //老虎机背景
        for (var i = 0; i < 4;i++ ){
            var runLine = tRunLines.at(i);
            this.m_tRunContent[i] = cc.dd.Utils.seekNodeByName(runLine, "Panel_Content");
            var arrRunLine = new arrayCtrl();
            arrRunLine.CreateArrayCtrl(1, -1, this.m_tRunContent[i]);
            this.m_tRunLines[i] = arrRunLine;
        }
        this.m_oLeftAnimation.play();
        this.m_oRightAnimation.play();
        var self = this;
        self.tinyGameManger.buildAllRunLine();
        self.fillRunLine();

        var actionCallBack = function(){
            self.m_oRightAnimation.off('finished', actionCallBack);

            var seq = cc.sequence(cc.delayTime(0.05),cc.callFunc(function(){
                self.m_oMainNode.active = true;
                self.tinyGameManger.startRunGame();
            }));
            self.node.runAction(seq);
        }

        this.m_oRightAnimation.on('finished', actionCallBack);


    },

    onDestroy: function () {
        HallCommonEd.removeObserver(this);
        cc.dd.NetED.removeObserver(this);

    },
    
    //播放相应音效
    playAudio: function(audioId){
        var data =  slot_audio.getItem(function(item){
            if(item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(SlotCfg.AuditoPath + name);
    },

    stopAudio: function(audioId){

        AudioManager.stopSound(audioId);
    },

    //玛丽机
    runGame: function(State){
        var self = this;
        self.m_nRunState = State;
        // if(this.tinyGameManger.getLeftNum() > 0){
        //         self.tinyGameManger.startRunGame();
        // }else{
        //         self.tinyGameManger.resetReardNum();
        //         self.showEndUI();
        // }
        // return;


        //开始跑
        if(TinyGameType.GameRunState.RunBegin == State){
            if(this.m_bAudioPlay == false){
                this.playAudio(101400);
                this.m_bAudioPlay = true;
            }
            var index = self.m_nBeginPos;
            self.m_nStep += 1;
            for(var i = 0 ; i < self.m_nStep; i++){
                this.m_oRunImage[(index + i) % 24].active = true;
            }

            if(this.m_nStep == 4){ //四个图标已经显示出来，进行加速
                self.m_nStep = 0;
                self.m_nCurrentPos = index; // 当前位置点
                self.m_nTimer =  2;//(Math.ceil(Math.random() * 10) % 2 == 0 ? 3 : 4) * 24 + Math.ceil(Math.random() * 10);
                this.m_bAudioPlay = false;
                self.runGame(TinyGameType.GameRunState.RunAddSpeed);//切换加速状态
            }else{
                var seq = cc.sequence(cc.delayTime(0.4), cc.callFunc(function(){
                    self.runGame(TinyGameType.GameRunState.RunBegin);
                }))
                this.node.runAction(seq);
            }
        }else if(TinyGameType.GameRunState.RunAddSpeed == State){//加速跑
            if(this.m_bAudioPlay == false){
                this.m_nCurrentAudioId = this.playAudio(101401);
                //this.m_nCurrentAudioId = 101401;
                this.m_bAudioPlay = true;
            }
            this.m_oRunImage[self.m_nCurrentPos % 24].active = false;
            self.m_nCurrentPos += 1; //移动一格
            for(var i = 0; i < 4; i++){
                this.m_oRunImage[(self.m_nCurrentPos + i) % 24].active = true;
            }
            if(self.m_nTimer <= 0){//进入减速
                self.m_nCurrentPos = (self.m_nCurrentPos % 24);
                self.m_nTimer = 2;
                self.m_nLeftStep = this.tinyGameManger.getFinalPos() - self.m_nCurrentPos +23;
                cc.log('timer=======================' + self.m_nLeftStep)
                if(self.m_nLeftStep < 12){
                    self.m_nLeftStep += 24;
                }
                self.m_nPerSetp = (self.m_nTimer / self.m_nLeftStep);

                this.m_nEndIndex = 4;
                self.m_bAudioPlay = false;
                //self.stopAudio(self.m_nCurrentAudioId);
                self.runGame(TinyGameType.GameRunState.RunSubSpeed);//切换减速状态
            }
        } else if(TinyGameType.GameRunState.RunSubSpeed == State){//减速跑

            this.m_oRunImage[(self.m_nCurrentPos % 24)].active = false;
            self.m_nCurrentPos += 1; //移动一格
            if(self.m_nLeftStep <= 6 && this.m_bAudioPlay == false){
                self.stopAudio(self.m_nCurrentAudioId);
                this.playAudio(101402);
                this.m_bAudioPlay = true;
            }
            this.m_oRunImage[((self.m_nCurrentPos + self.m_nEndIndex) % 24)].active = false;
            if(self.m_nLeftStep < 4 && self.m_nLeftStep > 0){
                this.m_nEndIndex = self.m_nLeftStep;
            }
            for(var i = 0; i < (this.m_nEndIndex); i++){
                this.m_oRunImage[((self.m_nCurrentPos + i) % 24)].active = true;
            }
            if(self.m_nLeftStep == 0){
                this.m_nEndIndex = 4;
                this.m_bAudioPlay = false;

                self.runGame(TinyGameType.GameRunState.RunEnd);
            }
        }else if(TinyGameType.GameRunState.RunEnd == State){//玛丽机结束
            this.playAudio(101403);
            //剩余次数
            this.m_oLeftNum.string = gSlotMgr.getSmallGameTimes();
            //赢分
            this.m_oWinNum.string = gSlotMgr.getTinyGameData().getRewardNum();
            if(gSlotMgr.getSmallGameTimes() > 0){
                this.showResult();
                var seq = cc.sequence(cc.delayTime(2.5), cc.callFunc(function(){
                    self.m_oRunImage[self.tinyGameManger.getFinalPos()].opacity = 255;
                    self.m_oRunImage[self.tinyGameManger.getFinalPos()].stopAllActions();
                    self.tinyGameManger.startRunGame();
                }))
                this.node.runAction(seq);
            }else{
                var seq = cc.sequence(cc.delayTime(1.5), cc.callFunc(function(){
                    self.tinyGameManger.resetReardNum();
                    self.showEndUI();
                }))
                this.node.runAction(seq);
            }
             self.m_nBeginPos = this.tinyGameManger.getFinalPos();
        }
    },
    /////////////////////////////////////////////////////////玛丽机end/////////////////////////////////////////////////

    /////////////////////////////////////////////////////////老虎机start///////////////////////////////////////////////
    fillRunLine: function(){
        var self = this;
        var tRunLinesData = this.tinyGameManger.getAllRunLine();
        for(var i = 0; i < 4; i ++){
            var arrRunLine = this.m_tRunLines[i];
            var oneLineData = tRunLinesData[i];
            arrRunLine.updateItemEx(oneLineData, function(card_id, uiNode, index, key){
                var cardCfg = data_slotcard.items[card_id];
                uiNode.getComponent(cc.Sprite).spriteFrame = self.atlas.getSpriteFrame(cardCfg.icon);
                uiNode.active = true; 
            });
        }
    },

    //开始跑老虎机
    StartRunEffect: function(){
        var runCfg = this.tinyGameManger.getRunCfg()
        for (var i = 0; i < 4; i++){
            var runLine = this.m_tRunContent[i];
            var arrRunLine = this.m_tRunLines[i];
            runLine.y = 0

            var runTimer = [];
            runTimer.cfg = runCfg[i];
    
            runTimer.endPosY = -(arrRunLine.showCount() -1) * arrRunLine.m_offset.y
            runTimer.passTime = - runTimer.cfg.delayTime / 1000.0
    
            this.m_tRunTimer[i] = runTimer;
            this.m_tRunEndTimer[i] = 0;
        }
    },

    //获取老虎机上的数据节点
    getCardNode:function (x, y) {
        var arrRunLine = this.m_tRunLines[x];
        return arrRunLine.at(arrRunLine.showCount() -1 + y);
    },

    //创建动画特效
    setEffect: function(effectId, uiNode){
        var childNode = new cc.Node();
        childNode.width = uiNode.width;
        childNode.height = uiNode.height;
        var sprite = childNode.addComponent(cc.Sprite);
        sprite.spriteFrame = this.atlas.getSpriteFrame('dao')
        var action = childNode.addComponent(cc.Animation);
        action.addClip(this.clipsList[effectId], 'effect' + effectId);
        action.play('effect' + effectId);
        var callBack = function(){
            action.off('finished', callBack);
            uiNode.removeAllChildren(true);
        };
        action.on('finished',callBack);
        uiNode.addChild(childNode);
    },

    /////////////////////////////////////////////////////////老虎机end///////////////////////////////////////////////

    startRun: function(){
        this.removeAllAction();
        this.runGame(TinyGameType.GameRunState.RunBegin);
        this.fillRunLine();
        this.StartRunEffect();
    },

    update: function (dt) {
        //小玛丽
        if(this.m_nRunState == TinyGameType.GameRunState.RunAddSpeed){
            this.m_runAddTimer += dt;
            if(this.m_runAddTimer >= 0.01){
                this.m_nTimer -= this.m_runAddTimer;
                this.m_runAddTimer = 0;
                this.runGame(TinyGameType.GameRunState.RunAddSpeed)
            }
        }else if(this.m_nRunState == TinyGameType.GameRunState.RunSubSpeed){
            this.m_runSubTimer += dt;
            if(this.m_runSubTimer >= this.m_nPerSetp){
                this.m_nLeftStep -= 1;
                this.m_runSubTimer = 0;
                this.runGame(TinyGameType.GameRunState.RunSubSpeed);
            }
        }

        //老虎机滚轴
        if(this.m_tRunTimer.length > 0){
            for(var k = 0; k < this.m_tRunTimer.length; k++){
                var v = this.m_tRunTimer[k];
                if(v){
                    v.passTime = v.passTime + dt;
                    var runLine = this.m_tRunContent[k];
                    if(v.passTime > 0){
                        var curPosY = -v.passTime * v.cfg.startSpeed;
                        if(curPosY < v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5){
                            curPosY = v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5;
                            runLine.y = curPosY;
                            this.m_tRunTimer[k] = null;
                            this.m_nRunEndTag += 1;
                            //声音播放，暂未处理if(gSlotMgr.)
                        }else{
                            runLine.y = curPosY;
                        }
                    }
                }
            }
        }

        if(this.m_nRunEndTag == 4){
            this.m_nRunEndTag = 0;
            this.m_tRunTimer.splice(0, this.m_tRunTimer.length);
        }

        if(this.m_bGetAward){
            var totalnum = parseInt(gSlotMgr.getResultFen());
            this.m_nWeight = Math.ceil(totalnum / 50);            
            var num = parseInt(this.m_oAwardCoin.string);
            if(num > 0){
                num -= this.m_nWeight;
                var curNum = parseInt(this.m_oUserGold.string) + this.m_nWeight ;
                if(num <= 0)
                    num = 0;
                this.m_oAwardCoin.string = num;
                if(num == 0)
                    curNum = gSlotMgr.getGold();
                if(curNum > gSlotMgr.getGold())
                    curNum = gSlotMgr.getGold();
                this.m_oUserGold.string = curNum; 
                if(num == 0){
                    this.m_nWeight = 1;
                    var slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('the_water_margin_Slot');
                    if(slotMainUI){
                        gSlotMgr.setResultFen(0);
                        //slotMainUI.setDownBtnState(SlotType.DownBtnState.Down);
                        slotMainUI.resetEnterTinyGameTag();
                        //slotMainUI.checkEnterAutoBet(gSlotMgr.getSlotLastAuto());
                        slotMainUI.OnEffectEnd();
                        slotMainUI.playBackGround();
                    }
                    cc.dd.UIMgr.destroyUI(this.node);
                }
            }else{
                    this.m_nWeight = 1;
                    var slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('the_water_margin_Slot');
                    if(slotMainUI){
                        gSlotMgr.setResultFen(0);
                        slotMainUI.resetEnterTinyGameTag();
                        //slotMainUI.setDownBtnState(SlotType.DownBtnState.Down);
                        //slotMainUI.checkEnterAutoBet(gSlotMgr.getSlotLastAuto());
                        slotMainUI.OnEffectEnd();
                        slotMainUI.playBackGround();
                    }
                    cc.dd.UIMgr.destroyUI(this.node);
            }
        }
    },

    playCoinflyAction: function(angle, coinRootNode){
        var coinNode = cc.instantiate(coinRootNode);
        coinNode.active = true;
        var coin_startPos = this.m_oRunImage[ this.tinyGameManger.getFinalPos()].getPosition();
        coinNode.parent = coinRootNode.parent;
        coinNode.setPosition(coin_startPos);

        var shineNode = cc.dd.Utils.seekNodeByName(this.node, 'shineNode');
        var coin_endPos = shineNode.getPosition();
        var distance = coin_startPos.sub(coin_endPos).mag();
        var height = Math.abs(coin_endPos.x - coin_startPos.x) / 100;
        var radian = angle * 3.14159 / 180;
        var q1x = coin_startPos.x + (coin_endPos.x - coin_startPos.x) / 4.0;
        var q1 = cc.v2(q1x, height + coin_startPos.y + Math.cos(radian) * q1x);

        
        var q2x = coin_startPos.x + (coin_endPos.x - coin_startPos.x)/2.0;
        var q2 = cc.v2(q2x, height + coin_startPos.y + Math.cos(radian) * q2x);

        var time = distance / 1000;
        var bezier = [q1, q2, coin_endPos];
        var bezierAct = cc.bezierTo(time,bezier);

        var seq1 = cc.sequence(bezierAct, cc.callFunc(function(){
            coinNode.active = false;
            shineNode.active = true;
            var anim = shineNode.getComponent(cc.Animation);
            anim.play();
            var actionCallBack = function(){
                anim.off('finished', actionCallBack);
                shineNode.active = false;
            }
            anim.on('finished',actionCallBack);
        }));
        coinNode.runAction(seq1);
    },

    showResult: function(){
        var self = this;
        var posItem = data_position.getItem(function(item){
            var positionList = item.position.split(';');
            for(var i = 0; i < positionList.length; i++){
                if(positionList[i] == self.tinyGameManger.getFinalPos())
                    return item;
            }
        });

        //检测是否中了连线奖
        var type = self.tinyGameManger.getLineNumType();
        if(type != 0 ){
            var startIndex = 0;
            this.playAudio(101408);
            if(type == 1) {  //左三连
                startIndex = 0;
                var coinRootNode1 = cc.dd.Utils.seekNodeByName(this.node, 'coinSp1');
                var coinRootNode2 = cc.dd.Utils.seekNodeByName(this.node, 'coinSp2');
                var coinRootNode3 = cc.dd.Utils.seekNodeByName(this.node, 'coinSp3');

                this.playCoinflyAction(90,coinRootNode1);
                this.playCoinflyAction(90,coinRootNode2);
                this.playCoinflyAction(90,coinRootNode3);

                var repeatAct = cc.repeat(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
                    self.playCoinflyAction(90,coinRootNode1);
                    self.playCoinflyAction(90,coinRootNode2);
                    self.playCoinflyAction(90,coinRootNode3);
                })), 9);
                this.node.runAction(repeatAct);    
            }
            else if(type == 2){//右三连
                startIndex = 1;
                var coinRootNode1 = cc.dd.Utils.seekNodeByName(this.node, 'coinSp2');
                var coinRootNode2 = cc.dd.Utils.seekNodeByName(this.node, 'coinSp3');
                var coinRootNode3 = cc.dd.Utils.seekNodeByName(this.node, 'coinSp4');

                this.playCoinflyAction(90,coinRootNode1);
                this.playCoinflyAction(90,coinRootNode2);
                this.playCoinflyAction(90,coinRootNode3);

                var repeatAct = cc.repeat(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
                    self.playCoinflyAction(90,coinRootNode1);
                    self.playCoinflyAction(90,coinRootNode2);
                    self.playCoinflyAction(90,coinRootNode3);
                })), 9);
                this.node.runAction(repeatAct);
            }
            else if(type == 3){ //四连
                startIndex = 0;
                var coinRootNode1 = cc.dd.Utils.seekNodeByName(this.node, 'coinSp1');
                var coinRootNode2 = cc.dd.Utils.seekNodeByName(this.node, 'coinSp2');
                var coinRootNode3 = cc.dd.Utils.seekNodeByName(this.node, 'coinSp3');
                var coinRootNode4 = cc.dd.Utils.seekNodeByName(this.node, 'coinSp4');

                this.playCoinflyAction(90,coinRootNode1);
                this.playCoinflyAction(90,coinRootNode2);
                this.playCoinflyAction(90,coinRootNode3);
                this.playCoinflyAction(90,coinRootNode4);

                var repeatAct = cc.repeat(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
                    self.playCoinflyAction(90,coinRootNode1);
                    self.playCoinflyAction(90,coinRootNode2);
                    self.playCoinflyAction(90,coinRootNode3);
                    this.playCoinflyAction(90,coinRootNode4);
                })), 9);
                this.node.runAction(repeatAct);
            }
            for(var x = startIndex; x < 4; x++){
                var posCard = self.tinyGameManger.getCard(x, 0);
                var uiNode = self.getCardNode(x,0);
                var cardCfg = data_slotcard.items[posCard];
                self.setEffect(cardCfg.playeffect - 1, uiNode);

                var audioList = data_slotcard.items[posCard].audio_id.split(';');
                if(audioList){
                    var audio = audioList[0].split(':');
                    this.playAudio(parseInt(audio[1]));
                }
            }
    
        }
        //老虎机中奖播放动画
        var isAward = false;
        if(posItem){
            for(var x = 0; x < 4; x++){
                var posCard = self.tinyGameManger.getCard(x, 0);
                if(posCard == posItem.key){
                    //检测中奖的是否在连线里
                    if((type == 1 && x < 3) || (type == 2 && x > 0 && x <= 3) || (type == 3)){
                        isAward = true;
                    }else{
                        var uiNode = self.getCardNode(x,0);
                        var cardCfg = data_slotcard.items[posCard];
                        self.setEffect(cardCfg.playeffect - 1, uiNode);

                        var audioList = data_slotcard.items[posCard].audio_id.split(';');
                        if(audioList){
                            var audio = audioList[0].split(':');
                            this.playAudio(parseInt(audio[1]));
                        }
                        isAward = true;
                    }
                }
            }
        }
        if(isAward){
            for(var x = 0; x < 4; x++){
                var posCard = self.tinyGameManger.getCard(x, 0);
                if(posCard != posItem.key){
                    var uiNode = self.getCardNode(x,0);
                    uiNode.removeAllChildren(true);
                    uiNode.getComponent(cc.Sprite).spriteFrame = self.atlas.getSpriteFrame(posCard + '_0_03');
    
                }
            }
            this.playAudio(101408);
            var coinRootNode = cc.dd.Utils.seekNodeByName(this.node, 'coinSp');
            this.playCoinflyAction(90,coinRootNode);
            var repeatAct = cc.repeat(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
                self.playCoinflyAction(90,coinRootNode);
            })), 9);
            this.node.runAction(repeatAct);

            var shineEffect = cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5)));
            this.m_oRunImage[this.tinyGameManger.getFinalPos()].runAction(shineEffect);
        }
    },

    showEndUI: function(){
        this.endNode.active = true;
        var cpt = cc.dd.Utils.seekNodeByName(this.endNode, "headMask").getComponent('klb_hall_Player_Head');
        cpt.initHead( hallData.getInstance().openId, hallData.getInstance().headUrl, 'slot_head_init');
        this.m_oUserGold = cc.dd.Utils.seekNodeByName(this.endNode, "user_coin").getComponent(cc.Label);
        if(this.m_oUserGold)
            this.m_oUserGold.string = gSlotMgr.getGold();
        this.m_oName = cc.dd.Utils.seekNodeByName(this.endNode, "userName").getComponent(cc.Label);
        if(this.m_oName)
            this.m_oName.string = cc.dd.Utils.substr(hallData.getInstance().nick, 0, 6);

        this.m_oAwardCoin = cc.dd.Utils.seekNodeByName(this.endNode, "awradCoin").getComponent(cc.Label);
        this.m_oAwardCoin.string = gSlotMgr.getResultFen();

        if(gSlotMgr.getSlotLastAuto()){
            this.m_oCompareBtn.interactable = false;
            this.m_oCompareBtn.node.getChildByName('desc').getComponent(cc.Button).interactable = false;
            this.m_oCompareBtn.node.getChildByName('cover').getComponent(cc.Button).interactable = false;
        }

        var animEnd = this.endNode.getComponent(cc.Animation);
        animEnd.play();
        var self = this;
        var endCallBack = function () {
            animEnd.off('finished', endCallBack);
            if(gSlotMgr.getSlotLastAuto()){
                var seq = cc.sequence(cc.delayTime(1.5), cc.callFunc(function(){
                    self.awardCoin(null, null);
                }));
                self.endNode.runAction(seq);
            }
        }
        animEnd.on('finished', endCallBack);
    },

    quitGame: function(event, data){
        var self = this;
        this.endNode.stopAllActions();
        self.tinyGameManger.resetReardNum();
        var slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('the_water_margin_Slot');
        if(slotMainUI){
            //slotMainUI.setDownBtnState(SlotType.DownBtnState.Award);
            slotMainUI.resetEnterTinyGameTag();
            slotMainUI.updateResult();
            ///slotMainUI.checkEnterAutoBet(gSlotMgr.getSlotLastAuto());
            slotMainUI.playBackGround();
            slotMainUI.OnEffectEnd();
        }

        cc.dd.UIMgr.destroyUI(self.node);
    },

    awardCoin: function(event, data){
        this.endNode.stopAllActions();
        if(gSlotMgr.getResultFen() == 0){
            var slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('the_water_margin_Slot');
            if(slotMainUI){
                //slotMainUI.setDownBtnState(SlotType.DownBtnState.Down);
                //slotMainUI.resetEnterTinyGameTag();
                //slotMainUI.checkEnterAutoBet(gSlotMgr.getSlotLastAuto());
                slotMainUI.OnEffectEnd();
                slotMainUI.playBackGround();
            }
            cc.dd.UIMgr.destroyUI(this.node);
            return;
        }
        this.playAudio(101003);
        this.m_oAwardBtn.interactable = false;
        this.m_oAwardBtn.node.getChildByName('desc').getComponent(cc.Button).interactable = false;
        this.m_oAwardBtn.node.getChildByName('cover').getComponent(cc.Button).interactable = false;

        this.m_oCompareBtn.interactable = false;
        this.m_oCompareBtn.node.getChildByName('desc').getComponent(cc.Button).interactable = false;
        this.m_oCompareBtn.node.getChildByName('cover').getComponent(cc.Button).interactable = false;

        gSlotMgr.awardFen();
        gSlotMgr.setNeedUpdateGold(true);
        this.m_bGetAward = true;
    },

    onClickEnterComapreGame: function(event, data){
        this.endNode.stopAllActions();
        this.playAudio(101100);
        cc.dd.UIMgr.openUI("gameyj_water_margin_slot/Prefab/compare_Game_UI", function(prefab){
            gSlotMgr.getSlotMainUI().resetEnterTinyGameTag();
            cc.dd.UIMgr.destroyUI(this.node);
        }.bind(this));

    },

    removeAllAction: function(){
        //清除掉老虎机的动画
        for(var x = 0; x < 4; x ++){
            var uiNode = this.getCardNode(x, 0);
            uiNode.removeAllChildren(true);
        }
        var node = cc.dd.Utils.seekNodeByName(this.node, "panel_" + this.wincard);
        if(node){
            var shineNode = node.getChildByName('shine');
            if(shineNode){
                shineNode.active = false;
                shineNode.stopAllActions();
            }
        }
        var linenode = cc.dd.Utils.seekNodeByName(this.node, "line1");
        if(linenode)
            linenode.stopAllActions();
        var linenode1 = cc.dd.Utils.seekNodeByName(this.node, "line2");
        if(linenode1)
            linenode1.stopAllActions();
        var linenode2 = cc.dd.Utils.seekNodeByName(this.node, "line3");
        if(linenode2)
            linenode2.stopAllActions();
        this.tinyGameManger.resetLineNumType();
    },

    onclickStart: function(event, data){
        this.tinyGameManger.startRunGame();
    },

    reconnectHall: function(){
        cc.dd.UIMgr.destroyUI(this.node);
        cc.dd.SceneManager.enterHall();
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.reconnectHall();
                break;
            case cc.dd.NetEvent.REOPEN:
                this.reconnectHall();
            break;
        }
    }
});
