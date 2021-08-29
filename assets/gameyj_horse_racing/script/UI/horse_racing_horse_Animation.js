// create by wj 2020/12/24
const gameType = require('horse_racing_Config').HorseRacingGameConfig;
var gameData = require('horse_racing_Data').Horse_Racing_Data.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_nHorseId: 0, //马的编号
        m_nSample: 60, //帧率
        m_bIsLoop: true, //是否循环播放
        m_bPlaying: false, //是否播放

        m_oHorseSprite: cc.Sprite,
        m_oKnightSprite: cc.Sprite,
        m_oShadowSprite: cc.Sprite,

        _m_oCurrentHorseAtls: null,
        m_oCurrentHorseAtls: {
            get() {
                return this._m_oCurrentHorseAtls;
            },
            set(value) {
                if (!value) {
                    this.reCallCurrentHorseAtls();
                } else {
                    this._m_oCurrentHorseAtls = value;
                }
            },
            type: cc.SpriteAtlas
        },
        _m_oCurrentKnightAtls: null,
        m_oCurrentKnightAtls: {
            get() {
                return this._m_oCurrentKnightAtls;
            },
            set(value) {
                if (!value) {
                    this.reCallCurrentKnightAtls();
                } else {
                    this._m_oCurrentKnightAtls = value;
                }
            },
            type: cc.SpriteAtlas
        },
        _m_oCurrentShadowAtls: null,
        m_oCurrentShadowAtls: {
            get() {
                return this._m_oCurrentShadowAtls;
            },
            set(value) {
                if (!value) {
                    this.reCallCurrentShadowAtls();
                } else {
                    this._m_oCurrentShadowAtls = value;
                }
            },
            type: cc.SpriteAtlas
        },
        m_oCallBack: null,

        m_nSpriteIndex: 0,
        m_nSpriteIndex1: 0,
        m_nStartSpriteIndex: 0,
        m_nKnightStartSpriteIndex: 0,
        m_nHorseSpriteCount: 15,
        m_nKnightSpriteCount: 15,
        m_fTimer: 0,

        m_sHorseSpriteName: '',
        m_sKnightSpriteName: '',
        m_sShadowSpriteName: '',
        m_sKnightRSpriteName: '',

        m_nSpeed: 1,
    },


    onLoad() {
        this.resManager = cc.find('Canvas/horseRes').getComponent('horse_racing_res_manager');
        this.setCurrentAtls(gameType.RunState.Begin);
    },

    start() {

    },

    //设置帧率
    setSample: function (newSample) {
        this.m_nSample = newSample;
    },

    //设置是否循环播放
    setIsLoop: function (isLoop) {
        this.m_bIsLoop = isLoop;
    },

    //设置转弯动画速率
    setTrunSpeed: function (speed) {
        this.m_nSpeed = speed;
        var anim = this.node.getComponent(cc.Animation);
        anim.defaultClip.speed = this.m_nSpeed;
        this.turnPath = this.gen_path_data(anim.defaultClip.curveData.props.position);
    },

    //设置当前动画图集
    setCurrentAtls: function (type) {
        this.m_nRunSatet = type;
        switch (type) {
            case gameType.RunState.Begin:
                //this.node.setLocalZOrder(this.m_nHorseId);
                this.m_nStartSpriteIndex = 1;
                this.m_nKnightStartSpriteIndex = 1;

                this.m_nSpriteIndex = 1;
                this.m_nSpriteIndex1 = 1;

                this.setHorseAndShadowSpriteCount(15);
                this.setKnightSpriteCount(15);

                this._horseCall = 'L';
                this._knightCall = 'L';
                this._shadowCall = 'L';
                this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, 'L');
                this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, 'L');
                this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, 'L');
                break;
            case gameType.RunState.LeftRun:
                this.startPos = this.node.getPosition();
                this.per_frame = Math.abs(-6839 - this.startPos.x) / gameData.runLeftFrames;

                this._horseCall = 'L';
                this._knightCall = 'L';
                this._shadowCall = 'L';
                this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, 'L');
                this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, 'L');
                this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, 'L');
                break;
            case gameType.RunState.Wait:
                this.setSample(5);
                this.m_nStartSpriteIndex = 3;
                this.m_nKnightStartSpriteIndex = 3;

                this.m_nSpriteIndex = 3;
                this.m_nSpriteIndex1 = 3;

                this.setHorseAndShadowSpriteCount(3);
                this.setKnightSpriteCount(3);

                this._horseCall = 'L';
                this._knightCall = 'L';
                this._shadowCall = 'L';
                this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, 'L');
                this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, 'L');
                this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, 'L');
                break;
            case gameType.RunState.TurnRun:
                this.startPos = this.node.getPosition();
                this.per_frame = this.turnPath / gameData.runTurnFrames;
                this.lastPos = this.node.getPosition();
                this.turnDistance = 0;

                var anim = this.node.getComponent(cc.Animation);
                anim.defaultClip.curveData.props.position[0].value[0] = this.node.getPositionX();
                anim.play();

                var self = this;
                var playRightRun = function () {
                    var anim = self.node.getComponent(cc.Animation);
                    anim.off('finished', playRightRun, this);
                    self.node.getComponent('horse_racing_horse_Move').playTrunRunAct();
                }
                anim.on('finished', playRightRun, this);
                break;
            case gameType.RunState.RightRun:
                this.startPos = this.node.getPosition();
                this.per_frame = (4000 - this.startPos.x) / gameData.runRightFrames;


                if (this.m_nRunSatet == gameType.RunState.RightRun) {
                    this.node.setLocalZOrder(6 - this.m_nHorseId + 1);
                }

                this.m_bIsLoop = true;
                this.m_nStartSpriteIndex = 136;
                this.m_nKnightStartSpriteIndex = 1;

                this.setHorseAndShadowSpriteCount(15);
                this.setKnightSpriteCount(30);

                this._horseCall = 'R';
                this._knightCall = 'W';
                this._shadowCall = 'R';
                this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, 'R');
                this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, 'W');
                this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, 'R');
                break;
        }
    },

    //播放一次，回调
    playOnce: function (endCallFunc) {
        this.m_bPlaying = true;
        this.m_oCallBack = endCallFunc;
        this.m_bIsLoop = false;
    },

    //循环播放
    playLoop: function () {
        this.m_bIsLoop = true;
        this.m_bPlaying = true;
    },

    //停止播放
    stopAnim: function () {
        this.m_bIsLoop = false;
        this.m_bPlaying = false;
        this.m_fTimer = 0;
    },

    //设置马匹和影子精灵数量
    setHorseAndShadowSpriteCount: function (count) {
        this.m_nHorseSpriteCount = count;
    },

    //设置选手精灵数量
    setKnightSpriteCount: function (count) {
        this.m_nKnightSpriteCount = count;
    },

    setHorseAndShadowSpriteFrame: function () {
        var horseSpriteName = this.m_sHorseSpriteName;
        var shadowSpriteName = this.m_sShadowSpriteName;
        if (this.m_nSpriteIndex == 0)
            this.m_nSpriteIndex = 1;
        if (this.m_nSpriteIndex > 99) {
            horseSpriteName += this.m_nSpriteIndex;
            shadowSpriteName += this.m_nSpriteIndex;
        } else {
            horseSpriteName += this.m_nSpriteIndex > 9 ? ('0' + this.m_nSpriteIndex) : ('00' + this.m_nSpriteIndex);
            shadowSpriteName += this.m_nSpriteIndex > 9 ? ('0' + this.m_nSpriteIndex) : ('00' + this.m_nSpriteIndex);
        }

        if (this.m_nRunSatet == gameType.RunState.TurnRun) {
            this._horseCall = 'L';
            this._shadowCall = 'L';
            if (this.m_nSpriteIndex >= 1 && this.m_nSpriteIndex <= 15) {
                this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, 'L');
                this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, 'L');
            } else if (this.m_nSpriteIndex >= 16 && this.m_nSpriteIndex <= 63) {
                this._horseCall = '';
                this._shadowCall = '';
                this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, '')[0];
                this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, '')[0];
            } else if (this.m_nSpriteIndex >= 64 && this.m_nSpriteIndex <= 111) {
                this._horseCall = '';
                this._shadowCall = '';
                this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, '')[1];
                this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, '')[1];
            } else if (this.m_nSpriteIndex >= 112 && this.m_nSpriteIndex <= 135) {
                this._horseCall = '';
                this._shadowCall = '';
                this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, '')[2];
                this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, '')[2];
            } else {
                this._horseCall = 'R';
                this._shadowCall = 'R';
                this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, 'R');
                this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, 'R');
            }
        }
        if (this.m_oCurrentHorseAtls) {
            this.m_oHorseSprite.spriteFrame = this.m_oCurrentHorseAtls.getSpriteFrame(horseSpriteName); //设置马的动画精灵
        }

        if (this.m_oCurrentShadowAtls) {
            this.m_oShadowSprite.spriteFrame = this.m_oCurrentShadowAtls.getSpriteFrame(shadowSpriteName); //设置马的阴影动画精
        }
    },

    //设置选手精灵图片
    setKnightSpriteFrame: function () {
        var knightSpriteName = this.m_sKnightSpriteName;
        if (this.m_nRunSatet == gameType.RunState.RightRun)
            knightSpriteName = this.m_sKnightRSpriteName;
        if (this.m_nSpriteIndex1 == 0)
            this.m_nSpriteIndex1 = 1;
        if (this.m_nSpriteIndex1 > 99)
            knightSpriteName += this.m_nSpriteIndex1;
        else {
            if (this.m_nRunSatet == gameType.RunState.RightRun)
                knightSpriteName += this.m_nSpriteIndex1;
            else
                knightSpriteName += this.m_nSpriteIndex1 > 9 ? ('0' + this.m_nSpriteIndex1) : ('00' + this.m_nSpriteIndex1);
        }

        if (this.m_nRunSatet == gameType.RunState.TurnRun) {
            if (this.m_nSpriteIndex1 >= 1 && this.m_nSpriteIndex1 <= 15) {
                this._knightCall = 'L';
                this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, 'L')
            } else if (this.m_nSpriteIndex1 >= 16 && this.m_nSpriteIndex1 <= 63) {
                this._knightCall = '';
                this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, '')[0]
            } else if (this.m_nSpriteIndex1 >= 64 && this.m_nSpriteIndex1 <= 111) {
                this._knightCall = '';
                this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, '')[1]
            } else if (this.m_nSpriteIndex1 >= 112 && this.m_nSpriteIndex1 <= 135) {
                this._knightCall = '';
                this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, '')[2]
            } else {
                this._knightCall = 'R';
                this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, 'R')
            }
        }
        if (this.m_oCurrentKnightAtls) {
            this.m_oKnightSprite.spriteFrame = this.m_oCurrentKnightAtls.getSpriteFrame(knightSpriteName); //设置人物的动画精灵
        }
    },

    drwaHorseSprite: function (dt) {
        if (this.m_bIsLoop == false) {//非循环播放
            if (this.m_nSpriteIndex >= this.m_nHorseSpriteCount + this.m_nStartSpriteIndex) {
                this.m_nSpriteIndex -= 1;
                this.m_nSpriteIndex1 -= 1;
                return;
            }
        } else {//循环播放
            if (this.m_nSpriteIndex >= this.m_nHorseSpriteCount + this.m_nStartSpriteIndex) {
                this.m_nSpriteIndex = this.m_nStartSpriteIndex;
            }
            if (this.m_nSpriteIndex1 >= this.m_nKnightSpriteCount + this.m_nKnightStartSpriteIndex) {
                this.m_nSpriteIndex1 = this.m_nKnightStartSpriteIndex;
            }
        }
        this.setHorseAndShadowSpriteFrame();
        this.setKnightSpriteFrame();

        this.m_nSpriteIndex += 1;
        this.m_nSpriteIndex1 += 1;

        this.m_fTimer = 0;
    },

    update(dt) {
        if (this.m_bPlaying != true)
            return;
        ///////////////////////////跑马动画资源加载相关Begin/////////////////////////////////
        if (this.m_nRunSatet == gameType.RunState.Begin || this.m_nRunSatet == gameType.RunState.Wait) {
            this.m_fTimer += dt;
            if (this.m_fTimer >= (1 / this.m_nSample)) {
                this.drwaHorseSprite(dt);
            }
        } else if (this.m_nRunSatet == gameType.RunState.TurnRun) {
            this.turnDistance += Math.sqrt(cc.pDistanceSQ(this.node.getPosition(), this.lastPos));
            if (this.turnDistance > this.turnPath) {
                this.turnDistance = this.turnPath
            }
            this.lastPos = this.node.getPosition();

            this.newDrwaHorseSprite(dt);
        } else {
            this.newDrwaHorseSprite(dt);
        }
        ///////////////////////////跑马动画资源加载相关End/////////////////////////////////

    },

    //依据路径绘制帧
    newDrwaHorseSprite(dt) {
        let offset = Math.sqrt(cc.pDistanceSQ(this.node.getPosition(), this.startPos));
        let totalFrame = Math.round(offset / this.per_frame);

        if (this.m_nRunSatet == gameType.RunState.LeftRun) {
            this.m_nSpriteIndex = totalFrame % 15 + 1;
            this.m_nSpriteIndex1 = totalFrame % 15 + 1;
        } else if (this.m_nRunSatet == gameType.RunState.RightRun) {
            this.m_nSpriteIndex = totalFrame % 15 + 136;
            this.m_nSpriteIndex1 = totalFrame % 30 + 1;
        } else {
            totalFrame = Math.round(this.turnDistance / this.per_frame);

            this.m_nSpriteIndex = totalFrame + 16;
            this.m_nSpriteIndex1 = totalFrame + 16;
        }

        this.setHorseAndShadowSpriteFrame();
        this.setKnightSpriteFrame();
    },


    gen_path_data: function (road_data) {
        var ctrl1 = null;
        var start_point = null;
        var end_point = null;
        var ctrl2 = null;

        var road_curve_path = []; // [start_point, ctrl1, ctrl2, end_point],

        let length = 0;
        for (var i = 0; i < road_data.length; i++) {
            var key_frame = road_data[i];
            if (ctrl1 !== null) {
                road_curve_path.push([start_point, ctrl1, ctrl1, cc.v2(key_frame.value[0], key_frame.value[1])]);
            }

            start_point = cc.v2(key_frame.value[0], key_frame.value[1]);

            for (var j = 0; j < key_frame.motionPath.length; j++) {
                var end_point = cc.v2(key_frame.motionPath[j][0], key_frame.motionPath[j][1]);
                ctrl2 = cc.v2(key_frame.motionPath[j][2], key_frame.motionPath[j][3]);
                if (ctrl1 === null) {
                    ctrl1 = ctrl2;
                }
                // 贝塞尔曲线 start_point, ctrl1, ctrl2, end_point,
                road_curve_path.push([start_point, ctrl1, ctrl2, end_point]);
                ctrl1 = cc.v2(key_frame.motionPath[j][4], key_frame.motionPath[j][5]);
                start_point = end_point;
            }
        }

        for (var index = 0; index < road_curve_path.length; index++) {
            start_point = road_curve_path[index][0];
            ctrl1 = road_curve_path[index][1];
            ctrl2 = road_curve_path[index][2];
            end_point = road_curve_path[index][3];

            length += this.bezier_length(start_point, ctrl1, ctrl2, end_point);
        }

        return length;
    },

    bezier_length: function (start_point, ctrl1, ctrl2, end_point) {
        // t [0, 1] t 分成20等分 1 / 20 = 0.05
        var prev_point = start_point;
        var length = 0;
        var t = 0.05;
        for (var i = 0; i < 20; i++) {
            var x = start_point.x * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.x * t * (1 - t) * (1 - t) + 3 * ctrl2.x * t * t * (1 - t) + end_point.x * t * t * t;
            var y = start_point.y * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.y * t * (1 - t) * (1 - t) + 3 * ctrl2.y * t * t * (1 - t) + end_point.y * t * t * t;
            var now_point = cc.v2(x, y);
            var dir = now_point.sub(prev_point);
            prev_point = now_point;
            length += dir.mag();

            t += 0.05;
        }
        return length;
    },

    resetHorse: function () {
        this.m_nRunSatet = 0;
        this.m_nSpriteIndex = 0;
        this.m_nSpriteIndex1 = 0;
        this.m_nStartSpriteIndex = 0;
        this.m_nKnightStartSpriteIndex = 0;
        this.m_nHorseSpriteCount = 15;
        this.m_nKnightSpriteCount = 15;
        this.m_fTimer = 0;
    },

    setReplayAtlas() {
        this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, 'R');
        this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, 'W');
        this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, 'R');
        this._horseCall = 'R';
        this._knightCall = 'W';
        this._shadowCall = 'R';
    },

    /**
     * 重新获取马匹资源
     */
    reCallCurrentHorseAtls() {
        setTimeout(() => {
            if (cc.isValid(this.node) && this._horseCall) {
                this.m_oCurrentHorseAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 0, this._horseCall);
            }
        }, 100);
    },
    reCallCurrentKnightAtls() {
        setTimeout(() => {
            if (cc.isValid(this.node) && this._horseCall) {
                this.m_oCurrentKnightAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 1, this._knightCall);
            }
        }, 100);
    },
    reCallCurrentShadowAtls() {
        setTimeout(() => {
            if (cc.isValid(this.node) && this._horseCall) {
                this.m_oCurrentShadowAtls = this.resManager.getSpriteAtlas(this.m_nHorseId, 2, this._shadowCall);
            }
        }, 100);
    }
});
