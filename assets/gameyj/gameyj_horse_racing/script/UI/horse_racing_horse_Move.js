// create by wj 2021/01/20
const gameType = require('horse_racing_Config').HorseRacingGameConfig;
var gameData = require('horse_racing_Data').Horse_Racing_Data.Instance();
var game_Ed = require('horse_racing_Data').Horse_Racing_Ed;
var game_Event = require('horse_racing_Data').Horse_Racing_Event;

cc.Class({
    extends: cc.Component,

    properties: {
        m_bPlaying: false,
        m_tStartPoint: cc.v2(0, 0),
        m_tEndPoint: cc.v2(0, 0),
        m_bPlayAct: false,
        m_fRunTimer: 0,
        m_nRunSatet: 0,
        m_nRank: 0,
        m_nLastRank: 0,
        m_nHorseId: 0,
        m_tEndPosNode: { default: [], type: cc.Node, tooltip: '转弯结束点位置' },
        m_oHorseCptAnim: cc.Component,
    },

    onLoad() {
        this._changeZorder = false;
        this.m_oHorseCptAnim = this.node.getComponent('horse_racing_horse_Animation');
        this.setRunState(gameType.RunState.Begin);
    },

    update(dt) {
        if (!this.m_bPlaying)
            return;
        if (this.m_nRunSatet == gameType.RunState.LeftRun) {//左路线跑
            this.playLeftRunAct(dt);
        } else if (this.m_nRunSatet == gameType.RunState.RightRun) {
            this.playRightRunAct(dt);
        } else if (this.m_nRunSatet == gameType.RunState.TurnRun) {
            this.turnDistance += Math.sqrt(cc.pDistanceSQ(this.node.getPosition(), this.lastPos));
            this.lastPos = this.node.getPosition()
        }

        if (!this._changeZorder && this.node.getPositionY() <= -300) {
            this._changeZorder = true;
            this.node.setLocalZOrder(6 - this.m_nHorseId + this.node.parent.children.length);
        }
    },

    getNowLSpeed: function () {
        return this.m_fSpeed;
    },
    setNowLSpeed: function (speed) {
        this.m_fSpeed = speed;
    },

    playAct: function (act) {
        this.node.runAction(cc.sequence(act, cc.callFunc(function () {
            this.m_bPlaying = true;
            this.setRunState(gameType.RunState.Wait);
            this.m_oHorseCptAnim.setCurrentAtls(gameType.RunState.Wait);
        }.bind(this))))
    },

    setRunState: function (state) {//设置游戏状态
        this.m_nRunSatet = state;
    },

    setRank: function (rank) {//设置马的排名
        this.m_nLastRank = this.m_nRank;
        this.m_nRank = rank;
    },

    setRunInfo: function (lTimer, rTime) {//设置运动相关数据
        if (this.m_nRank == 1) { //这里是向左跑第一名
            this.m_fTotalTime = lTimer; //左跑道移动时间
            this.m_nTotalDistance = Math.abs(-6839 - this.node.getPositionX());
            this.m_fSpeed = this.m_nTotalDistance / this.m_fTotalTime;

            this.m_fRTotalTime = rTime; //右跑道时间
        } else {
            this.m_fTotalTime = lTimer;
            this.m_nTotalDistance = Math.abs(-6839 - this.node.getPositionX());
            var randomSpeed = parseInt(Math.random() * (100 - 20 + 1) + 20, 10);
            var randomTag = Math.round(Math.random());
            this.m_fSpeed = this.m_nTotalDistance / gameData.runLeftTime;
            if (randomTag == 0)
                this.m_fSpeed += randomSpeed;
            else
                this.m_fSpeed -= randomSpeed;
            this.m_fAcceleration = 2 * (this.m_nTotalDistance - this.m_fSpeed * this.m_fTotalTime) / Math.pow(this.m_fTotalTime, 2);


            this.m_fRTotalTime = rTime; //右跑道时
        }
    },

    playLeftRunAct: function (dt) {//左跑道运动
        // this.m_fRunTimer += dt;

        if (this.m_nRank == 1) {
            this.node.setPositionX(this.node.getPositionX() - dt * this.m_fSpeed);
            // this.node.setPositionX(this.node.getPositionX() - 0.02 * this.m_fSpeed);
        } else {
            this.node.setPositionX(this.node.getPositionX() - (this.m_fSpeed * dt + this.m_fAcceleration * Math.pow(dt, 2)));
            this.m_fSpeed = this.m_fSpeed + this.m_fAcceleration * dt;
            // this.node.setPositionX( this.node.getPositionX() -(this.m_fSpeed * 0.02 + this.m_fAcceleration * Math.pow(0.02, 2)));
            // this.m_fSpeed = this.m_fSpeed + this.m_fAcceleration * 0.02;
        }

        if (this.node.getPositionX() < -6839) {
            // this.m_fRunTimer = 0;
            this.m_oHorseCptAnim.setCurrentAtls(gameType.RunState.TurnRun);

            if (this.m_nRank == 1) { //游戏状态靠第一名的状态把控
                game_Ed.notifyEvent(game_Event.HORSE_RACING_TURN, this.node.getPositionX());
                gameData.setRunState(gameType.RunState.TurnRun);
            }

            var rank = gameData.getRunRankListByIndex(2, this.m_nHorseId) + 1;//弯道道顺序获取;
            this.setRank(rank);//更新名次
            this.m_nRunSatet = gameType.RunState.TurnRun;

            this.lastPos = this.node.getPosition();
            this.turnDistance = 0;
        }
    },


    playTrunRunAct: function () {//设置转弯运动相关
        // this.m_fRunTimer = 0;
        this.m_bPlayAct = true;

        this.m_oHorseCptAnim.setCurrentAtls(gameType.RunState.RightRun);

        var rank = gameData.getRunRankListByIndex(3, this.m_nHorseId) + 1;//弯道道顺序获取;
        this.setRank(rank);//更新名次
        this.m_nRunSatet = gameType.RunState.RightRun;
        gameData.setRunState(gameType.RunState.RightRun);
        // gameData.setRightRunBeginTime(new Date().getTime());
        // if(this.m_nRank == 1 || this.m_nRank == 2){ //游戏状态靠第一名的状态把控
        //     var setReturn = gameData.setRightRunBeginTime(new Date().getTime());
        //     if(!setReturn)
        //         this.m_fRTotalTime -= ((new Date().getTime() - gameData.getRightRunBeginTime()) / 1000);
        // }
        let anim = this.m_oHorseCptAnim.node.getComponent(cc.Animation);
        let time = anim.defaultClip.duration / this.m_oHorseCptAnim.m_nSpeed;

        var nTotalRDistance = 4000 - (-6839);
        this.m_rSpeed = this.m_fSpeed;//this.turnDistance / time;//this.m_fSpeed; //标准速度
        this.m_fRAcceleration = 2 * (nTotalRDistance - this.m_rSpeed * this.m_fRTotalTime) / Math.pow(this.m_fRTotalTime, 2);
    },

    playRightRunAct: function (dt) {//右跑道运动
        this.m_fRunTimer += dt;
        if (this.node.getPositionX() <= 5200) {
            // if(this.m_nRank == 1){
            //     this.node.setPositionX(this.node.getPositionX() + dt * this.m_rSpeed);
            // }else{
            this.node.setPositionX(this.node.getPositionX() + (this.m_rSpeed * dt + this.m_fRAcceleration * Math.pow(dt, 2)));
            this.m_rSpeed = this.m_rSpeed + this.m_fRAcceleration * dt;
            //     this.node.setPositionX( this.node.getPositionX() + (this.m_rSpeed * 0.02 + this.m_fRAcceleration * Math.pow(0.02, 2)));
            //     this.m_rSpeed = this.m_rSpeed + this.m_fRAcceleration * 0.02;
            //}

            // if(this.node.getPositionX() >= -3220 && this.rightFPS < 60){
            //     this.m_oHorseCptAnim.rightFPS = 60;
            // }else if(this.node.getPositionX() >= -5500 && this.rightFPS < 45){
            //     this.m_oHorseCptAnim.rightFPS = 45;
            // }

            //记录1、2名过线时马匹状态
            if (this.node.getPositionX() >= 3886.5 && !this.isEnd) {
                this.isEnd = true;
                if (this.m_nRank == 1 || this.m_nRank == 2) {
                    game_Ed.notifyEvent(game_Event.HORSE_RACING_RUN_END, this.m_nRank);
                }
            }
            // }else{
            //     this.m_fRunTimer = 0;
        } else {
            this.m_bPlaying = false;
            this.m_oHorseCptAnim.stopAnim();
        }
    },

    adjustRightRunTime(time) {
        this.m_fRTotalTime = time;
        let nTotalRDistance = Math.abs(4000 - this.node.getPositionX());
        this.m_fRAcceleration = 2 * (nTotalRDistance - this.m_rSpeed * this.m_fRTotalTime) / Math.pow(this.m_fRTotalTime, 2);
    },

    adjustRightRunSpeed: function () {//校正速度
        this.m_rSpeed -= 100;
    },


    resetHorse: function () {
        this.m_nRunSatet = 0;
        this.m_nRank = 0;
        this.m_bPlayAct = false;
        this.m_fRunTimer = 0;

        this.m_fSpeed = 0;
        this.m_rSpeed = 0;
        this.m_fTotalTime = 0;
        this.m_fTTotalTime = 0;
        this.m_fRTotalTime = 0;
    },

    getHorseState() {
        return {
            id: this.m_nHorseId,
            rank: this.m_nRank,
            x: this.node.getPositionX(),
            y: this.node.getPositionY(),
            horseFrame: this.m_oHorseCptAnim.m_nSpriteIndex,
            riderFrame: this.m_oHorseCptAnim.m_nSpriteIndex1
        }
    },

    setHorseState(state) {
        if (this.m_nHorseId != state.id) {
            cc.error(`wrong horseId ${state.id} m_nHorseId ${this.m_nHorseId}`);
            return;
        }
        this.m_bPlaying = false;
        this.node.setPositionX(state.x);
        this.node.setPositionY(state.y);
        this.m_oHorseCptAnim.m_nSpriteIndex = state.horseFrame;
        this.m_oHorseCptAnim.m_nSpriteIndex1 = state.riderFrame;
        this.m_oHorseCptAnim.setReplayAtlas();
        this.m_oHorseCptAnim.m_bIsLoop = true;
        this.m_oHorseCptAnim.drwaHorseSprite();
    }
});
