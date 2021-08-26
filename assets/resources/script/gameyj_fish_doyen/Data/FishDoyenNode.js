// create by wj 2019/09/10
var size = cc.winSize;
const data_fishtype = require('qka_fish_master_type');
const data_fishpath = require('qka_fish_master_path');
var FishMoveLine = require('FishMoveAction').CFishMoveLine;
var FishMoveBezier = require('FishMoveAction').CFishMoveBezier;
var FishMoveFromCur = require('FishMoveAction').CFishMoveFromCur;
var FishMoveRot = require('FishMoveAction').CFishMoveRot;
var FishMoveStop = require('FishMoveAction').CFishMoveStop;
var FishMoveTrack = require('FishMoveAction').CFishMoveTrack;
const FishType = require('DoyenFishType');
const shaderUtils = require('shaderUtils');
var playerManager = require('FishDoyenPlayerManager').CFishPlayerManager.Instance();

const g_FishPoolRect = cc.rect(0, 0, size.width, size.height);
g_FishPoolRect.center = cc.v2(0, 0);
const fishArrayOffX = 0;
const defaultPostion = cc.v2(-1000, -1000)

function RadianToAngleOfUI(radian) {//弧度值转换为角度
    return radian / Math.PI * 180;
}

function angle2radian(angle) {//角度转弧度
    return angle * Math.PI / 180;
}

function rectContainsPoint(node, pos) { //点是否在区域中
    if ((pos.x >= (node.x - node.width / 2)) && (pos.x <= (node.x + node.width / 2)) &&
        (pos.y >= (node.y - node.height / 2)) && (pos.y <= (node.y + node.height / 2))) {
        return true;
    }
    return false;
}


var FishModelType = {
    smallFish: 1,
    midFish: 2,
    bigFish: 3,
    dishFish: 4,
    bossFish: 5,
}

var FishMoveStage = {
    move: 1,
    flee: 2,
    over: 3
}

var FishMoveType = {
    none: 0,
    left2right: 1,
    right2left: 2,
    rot: 3,
    track: 4,
    trackToEnd: 5,
    static: 6
}

var FishFleeType = {
    none: 0,
    leaveface: 1,
    curface: 2,
    oneface: 3,
}

var CFish = cc.Class({
    statics: {
        createFish: function (fishID, dataID, pathID, offset, stopScale, moveTime, fishPoolNode, delay) {//创建鱼
            if (dataID == 0 || pathID == 0)
                return;
            var fishData = data_fishtype.getItem(function (item) {
                if (item.key == dataID)
                    return item;
            });
            if (fishData) {
                var fish = new CFish;
                var info = data_fishpath.getItem(function (data) {
                    if (data.key == pathID)
                        return data;
                });
                var paths = info.path.split(',');
                fish.setFishInfo(dataID, fishData, fishPoolNode, (paths[0] > 1536 / 2));
                fish.setFishId(fishID);
                fish.setMoveInfo(pathID, offset, stopScale, moveTime, delay);
                return fish;
            }
            return null;
        },

        createFishEx: function (fishID, dataID, arrayCfg, index, moveTime, birthPlacePos, fishPoolNode, delay) {//创建鱼阵
            if (dataID == 0)
                return;
            var fishData = data_fishtype.getItem(function (item) {
                if (item.key == dataID)
                    return item;
            });
            if (fishData) {
                var fish = new CFish;
                fish.setFishInfo(dataID, fishData, fishPoolNode, (birthPlacePos.x > 1280 / 2));
                fish.setFishId(fishID);
                if (fish.SetMoveArrayInfo(arrayCfg, index, moveTime, cc.v2(birthPlacePos.x - fishArrayOffX, birthPlacePos.y), delay))
                    return fish;
            }
            return null;

        },

        createFishLockNode: function (dataCfg, showSize) {
            var fish = new CFish;
            var nodeList = fish.CreateFishPoolActNode(dataCfg, true);
            var fishNode = nodeList[0];
            if (fishNode) {
                fishNode.setRotation(dataCfg.fish_direction);
                var scale = Math.min(showSize / fishNode.width, showSize / fishNode.height) / (fishNode.scale);
                fishNode.setScale(cc.v2(-scale, scale));
                return fishNode;
            }
        },

        createFishTypeNode: function (dataCfg, showSize) {
            var fish = new CFish;
            var nodeList = fish.CreateFishPoolActNode(dataCfg, true);
            var fishNode = nodeList[0];
            if (fishNode) {
                // fishNode.setRotation(180);//dataCfg.fish_direction1);

                var scale = Math.min(showSize / fishNode.width, showSize / fishNode.height) / (fishNode.scale);
                fishNode.setScale(cc.v2(-scale, scale));
                return fishNode;
            }
        },
    },

    ctor: function () {
        this.m_dataId = 0; //配置表中鱼的id
        this.m_dataCfg = null; //配置表数据
        this.fishSize = null;
        this.m_oBodyNode = null; //鱼节点
        this.m_oCollider = null; //碰撞区域
        this.m_moveNode = null; //鱼的资源体
        this.m_shadowNode = null; //鱼的阴影
        this.m_fishBody = null; //鱼的刚体
        this.shapeInfo = null; //精准碰撞信息
        this.shapesSrcRect = null; //碰撞区域
        this.m_centerPos = cc.v2(0, 0); //鱼的中心点
        this.m_rotAngle = 0; //旋转角
        this.m_textBetTimes = 0; //boss被击中次数记录显示

        //this.m_nHitTimes = 0; //击中时间
        this.m_bInScreen = false; //是否在屏幕中
        this.m_fishID = 0; //鱼的ID
        this.m_nBetTime = 0; //击中次数数值
        this.m_bMoveEnd = false; //结束移动
        this.m_offset = null; //位移差值
        this.m_nCurIndex = 0;
        this.m_nDelay = 0;//断线重连
        this.m_UpdatePos = []; //保存鱼的移动路线点
        this.m_moveTime = 0; //游动时间
        this.m_lockImg = []; //被锁定图片
        this.m_moveScale = 1; //移动模型大小
        this.m_actNodeList = []; //鱼模型
        this.gFishMgr = require('FishDoyenManager').FishManager.Instance();
        this.node = new cc.Node();

        this.m_bIsDead = false;

    },

    setFishInfo: function (dataId, dataCfg, fishPoolNode, isRight) {//设置鱼的信息
        this.m_dataId = dataId; //配置表id
        this.m_dataCfg = dataCfg; //配置表数据

        this.m_actNodeList = this.CreateFishPoolActNode(this.m_dataCfg, true, isRight); //创建活鱼
        if (this.m_actNodeList.length == 0)
            return;
        this.m_oBodyNode = this.m_actNodeList[0];
        this.m_moveNode = cc.dd.Utils.seekNodeByName(this.m_oBodyNode, 'fishimage'); //鱼的主体
        this.m_shadowNode = cc.dd.Utils.seekNodeByName(this.m_oBodyNode, 'fishimage_shadow'); //鱼的阴影
        this.m_oCollider = cc.dd.Utils.seekNodeByName(this.m_moveNode, 'colliderFrame');
        this.m_shadowNode.opacity = 50
        this.m_shadowNode.setPosition(cc.v2(0, isRight ? 100 : -100));
        this.m_shadowNode.setScale(this.m_shadowNode.getScaleX() * FishType.FISH_SHADOW_SCALE, this.m_shadowNode.getScaleY() * FishType.FISH_SHADOW_SCALE);
        // this.m_shadowNode.setScale(1.1);
        this.m_oBodyNode.setPosition(cc.v2(0, 0));
        var scl = Math.abs(this.m_oBodyNode.getScaleX());
        this.fishSize = Math.max(this.m_oBodyNode.width, this.m_oBodyNode.height) * scl;
        this.shapesSrcRect = cc.rect(0, 0, this.m_oBodyNode.width * scl, this.m_oBodyNode.height * scl);
        this.shapesSrcRect.center = cc.v2(0, 0);
        this.node.addChild(this.m_oBodyNode);
        var poolOffset = this.fishSize * 1.1;

        this.fishPoolRect = new cc.Node;
        this.fishPoolRect.width = fishPoolNode.width + 2 * poolOffset;
        this.fishPoolRect.height = fishPoolNode.height + 2 * poolOffset;
        // var cpt = this.fishPoolRect.addComponent(cc.Widget);
        // cpt.isAlignTop = true;
        // cpt.isAlignBottom = true;
        // cpt.isAlignLeft = true;
        // cpt.isAlignRight = true;
        // cpt.isAlignOnce = false;


        this.fishPoolRect.parent = fishPoolNode.parent;

        //cc.rect(g_FishPoolRect.x-poolOffset , g_FishPoolRect.y-poolOffset, g_FishPoolRect.width + 2 * poolOffset, g_FishPoolRect.height + 2 * poolOffset);
        this.m_moveNode.on(cc.Node.EventType.TOUCH_START, this.onClickFish, this); //开始点击
        this.m_moveNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickFish, this); //移动
        this.m_moveNode.on(cc.Node.EventType.TOUCH_END, this.onClickFish, this); //移动
    },

    setFishId: function (fishId) { //设置鱼的唯一id
        cc.log("fishId:", fishId)
        this.m_fishID = fishId;
        this.m_oBodyNode._tag = fishId;
        this.m_moveNode._tag = fishId;

        if (this.m_nHitTimes != null)
            this.m_nHitTimes = null;
        this.m_bInScreen = false;
        this.m_bMoveEnd = false;
        this.m_offset = null;
        this.m_nCurIndex = 0;
        this.m_UpdatePos = [];
        this.m_moveTime = 0;
        for (var i = 0; i < this.m_lockImg.length; i++)
            this.m_lockImg[i].removeFromParent();
        this.m_lockImg.splice(0, this.m_lockImg.length);
    },

    getFishSize: function () {
        //    return Math.max(this.m_moveNode.width * this.m_moveNode.scale, this.m_moveNode.height * this.m_moveNode.scale)
        return Math.max(this.m_oBodyNode.width * this.m_moveNode.scale, this.m_oBodyNode.height * this.m_moveNode.scale)
    },

    getCenterPosInPool: function () {
        return this.node.getPosition();
    },

    getCenterPosInWorld: function () {
        return this.node.convertToWorldSpaceAR(cc.v2(0, 0));
    },

    setMoveInfo: function (pathID, offset, stopScale, moveTime, delay) {//设置鱼路线
        if (moveTime != null)
            this.m_moveTime = moveTime; //移动时间
        if (offset != null)
            this.m_offset = offset;

        if (delay != null && delay > 0)
            this.m_nDelay = delay / 1000;//服务器传的是毫秒
        this.node.setPosition(defaultPostion);
        var speed = this.m_dataCfg.fish_speed;

        var info = data_fishpath.getItem(function (data) {
            if (data.key == pathID)
                return data;
        });
        var pathList = info.path.split(';');
        pathList.splice(pathList.length - 1, 1);
        if (stopScale != null) {
            var stopTime = (this.getFishSize()) / speed * stopScale * 1.2;
            this.m_UpdatePos.push(FishMoveStop.create(defaultPostion, 0, stopTime)); //创建鱼的路线
        }

        for (var i = 0; i < pathList.length - 2; i += 2) {
            var pos1 = pathList[i].split(',');
            var pos2 = pathList[i + 1].split(',');
            var pos3 = pathList[i + 2].split(',');

            pos1[0] -= 1536 / 2;
            pos1[1] -= 1000 / 2;

            pos2[0] -= 1536 / 2;
            pos2[1] -= 1000 / 2;


            pos3[0] -= 1536 / 2;
            pos3[1] -= 1000 / 2;
            var bez = FishMoveBezier.create(cc.v2((parseFloat(pos1[0])), (parseFloat(pos1[1]))), cc.v2((parseFloat(pos2[0])), (parseFloat(pos2[1]))),
                cc.v2((parseFloat(pos3[0])), parseFloat((pos3[1]))), speed);

            if (bez == null) {
                cc.log("bez:", bez);
            }

            this.m_UpdatePos.push(bez); //创建鱼的贝塞尔路线

            ///手动在最后添加几个路径
            // if(i+2>=pathList.length-2)
            // {
            //     if(this.isRight)
            //     {
            //         var bez = FishMoveBezier.create(
            //             cc.v2((parseFloat(pos1[0]) - 100) , (parseFloat(pos1[1]))), 
            //             cc.v2((parseFloat(pos2[0]) - 200), (parseFloat(pos2[1])) ) ,
            //             cc.v2((parseFloat(pos3[0]) - 300), parseFloat((pos3[1]))),
            //             speed);
            //         this.m_UpdatePos.push(bez);
            //     }else
            //     {
            //         var bez = FishMoveBezier.create(
            //             cc.v2((parseFloat(pos1[0]) + 100) , (parseFloat(pos1[1]))), 
            //             cc.v2((parseFloat(pos2[0]) + 200), (parseFloat(pos2[1])) ) ,
            //             cc.v2((parseFloat(pos3[0]) + 300), parseFloat((pos3[1]))),
            //             speed);
            //         this.m_UpdatePos.push(bez);
            //     }

            // }

        }


        this.m_curUpdatePos = this.m_UpdatePos[this.m_nCurIndex];
        this.m_nCurIndex += 1;
    },

    rectContainsPoint: function (pos) { //点是否在区域中
        if ((pos.x >= (this.node.x - this.shapesSrcRect.width / 2)) && (pos.x <= (this.node.x + this.node.width / 2)) &&
            (pos.y >= (this.node.y - this.shapesSrcRect.height / 2)) && (pos.y <= (this.node.y + this.node.height / 2))) {
            return true;
        }
        return false;
    },

    isHit: function (worldPos) {//是否被选中
        if (this.m_dataCfg.fish_lock == 1) {//配置表可被选中
            var pos = this.gFishMgr.getMainUI().getFishPoolNode().convertToNodeSpaceAR(worldPos); //将世界坐标本地化
            if (playerManager.m_bFilp)
                pos = pos.mul(-1);
            if (this.rectContainsPoint(pos)) {//判断点是否在鱼图像区域
                return true;
            }
        }
        return false;
    },

    setLock: function (nSite, bLock) {//锁定鱼
        cc.log("lock!!!!!", bLock);
        if (bLock) {//是否显示
            if (this.m_lockImg[nSite] == null) {
                this.m_lockImg[nSite] = this.gFishMgr.getMainUI().createSd(nSite); //创建锁定标记节点
                if (this.m_lockImg[nSite]) {
                    this.node.addChild(this.m_lockImg[nSite]);//绑定节点
                    this.m_lockImg[nSite].active = true;
                }
            }
        } else {
            var lockSp = this.m_lockImg[nSite];
            if (lockSp) {
                lockSp.active = false;
                lockSp.removeFromParent(true);
                this.m_lockImg[nSite] = null;
            }
        }
    },

    setMoveRotation: function (angle) {//鱼旋转
        // this.m_oBodyNode.setRotation(angle);
        this.m_moveNode.setRotation(angle);
        if (this.m_dataCfg.key == 29) {
            var child = cc.dd.Utils.seekNodeByName(this.node, 'fishChild');
            if (child) {
                child.setRotation(angle + 180);
                // child.getChildByName('fishimage').setRotation(-angle);
                // child.getChildByName('fishimage_shadow').setRotation(-angle);
            }
        }
        this.m_shadowNode.setRotation(angle);

        this.m_rotAngle = angle;
    },

    getMoveRotation: function () {
        return this.m_rotAngle;
    },

    IsEnd: function () {
        return this.m_bMoveEnd;
    },

    onDestory: function () {
        this.m_moveNode.off(cc.Node.EventType.TOUCH_START, this.onClickFish, this); //开始点击
        this.m_moveNode.off(cc.Node.EventType.TOUCH_CANCEL, this.onClickFish, this); //移动
        this.m_moveNode.off(cc.Node.EventType.TOUCH_END, this.onClickFish, this); //移动
        shaderUtils.clearShader(this.m_moveNode.getComponent(cc.Sprite));
        this.node.removeFromParent(true);
        this.m_oBodyNode.removeFromParent(true);
        this.m_moveNode = null;
        this.m_shadowNode = null;
        this.fishPoolRect.removeFromParent(true);

        for (var i = 0; i < this.m_lockImg.length; i++) {
            var lockSp = this.m_lockImg[i];
            if (lockSp) {
                lockSp.active = false;
                lockSp.removeFromParent(true);
            }
        }
        this.m_lockImg.splice(0, this.m_lockImg.length);
    },

    createFishDieAct: function (fishCfg) {//鱼死亡动画
        var node = new cc.Node();
        var dieEffect = fishCfg.effe_die;//.split(';');
        // for(var i = 0; i < dieEffect.length; i++){
        var effectFile = dieEffect;
        var actNode = cc.resources.get("gameyj_fish_doyen/prefabs/" + effectFile, cc.Prefab);
        if (actNode) {
            var child = cc.instantiate(actNode);
            node.addChild(child);
        }
        // }

        return node;
    },

    onHitBullet: function (isMe) {
        if (this.m_moveNode) {
            shaderUtils.setShader(this.m_moveNode.getComponent(cc.Sprite), 'light');
        }

        if (this.m_nHitTimes == null)
            this.m_nHitTimes = FishType.hitFishActTime;

        if (isMe) {
            var tRand = Math.random() * 100;
            if (tRand >= FishType.soundRateHit) {
                if (this.m_dataCfg.Hit_audio == null) {
                    cc.log("Erro!!!! Hit_audio" + this.m_dataCfg.key)
                } else;
                this.gFishMgr.playAudio(this.m_dataCfg.Hit_audio);
            }
        }

    },

    onDie: function (baudio) {//鱼死亡
        if (!baudio) {
            this.m_bIsDead = true;
            this.node.removeFromParent(true);
            return;
        }
        this.m_bIsDead = true;

        var fishNode = this.m_actNodeList[0];
        var anim_fish = cc.find("fishimage", fishNode).getComponent(cc.Animation);
        var anim_shadow = cc.find("fishimage_shadow", fishNode).getComponent(cc.Animation);
        var clip_fish = anim_fish.getClips();
        var clip_shadow = anim_fish.getClips();

        anim_fish.play(clip_fish[1].name, 0);
        anim_shadow.play(clip_shadow[1].name, 0);
        anim_fish.on('finished', this.onDestory.bind(this));

        var parent = this.node
        //爆炸特效
        if (this.m_dataCfg.effe_die) {
            var dieAct = this.createFishDieAct(this.m_dataCfg);
            dieAct.setPosition(cc.v2(0, 0));
            if (playerManager.m_bFilp)
                dieAct.setRotation(180);
            dieAct.zIndex = FishType.ZorderInPool.effect;
            parent.addChild(dieAct);
            var anim = dieAct.children[0].getComponent(cc.Animation);
            anim.on('finished', function () {
                dieAct.removeFromParent();
            });
            this.gFishMgr.playAudio(37, false);
        }
        if (this.m_dataCfg.fish_shake > 0) { //震屏
            this.gFishMgr.m_mainUI.setShake(this.m_dataCfg.fish_shake);
        }

        if (baudio) {
            var soundList = this.m_dataCfg.sound_die.split(';');
            soundList.splice(soundList.length - 1, 1);
            if (this.m_dataCfg.key >= 13)//大鲨鱼以上的鱼100%放
            {
                if (soundList.length > 0) {
                    var index = parseInt(Math.random() * (soundList.length - 1), 10);
                    this.gFishMgr.playAudio(parseInt(soundList[index]), false);
                }
            } else {
                var tRand = Math.random() * 100;
                if (tRand >= FishType.soundRateDie) {
                    if (soundList.length > 0) {
                        var index = parseInt(Math.random() * (soundList.length - 1), 10);
                        this.gFishMgr.playAudio(parseInt(soundList[index]), false);
                    }
                }
            }
        }
    },


    onCleanMove: function () {
        if (this.m_bMoveEnd)
            return;
        this.m_nCurIndex = 0;
        this.m_moveTime = 0;
        var curPos = this.node.getPosition();
        var curDir = (Math.PI / 180) * (360 - this.getMoveRotation());
        var pos = FishMoveLine.createWithTime(curPos, 3, cc.v2(Math.cos(curDir), Math.sin(curDir)).mul(500));
        this.m_UpdatePos.splice(0, this.m_UpdatePos.length);
        this.m_UpdatePos.push(pos);
        this.m_curUpdatePos = this.m_UpdatePos[this.m_nCurIndex];
    },

    setMoveScale: function (scale, scaleTime) {//模型大小调整
        this.m_moveScaleTime = scaleTime;
        if (this.m_moveScale == scale) //
            return;
        this.m_moveScale = scale;
    },

    SetMoveArrayInfo: function (arrayCfg, index, moveTime, birthPlacePos, delay) {
        this.node.setPosition(defaultPostion);
        this.moveAct = this.createFishArrayMoveAct(arrayCfg, index, birthPlacePos, delay);
        if (this.moveAct == null) {
            cc.log('error arry');
        }
        this.m_UpdatePos.push(this.moveAct);
        this.moveAct1 = this.createFishArrayFleeAct(arrayCfg, birthPlacePos, delay);

        if (this.moveAct1 == null) {
            cc.log('error arry2');
        } else {
            this.m_UpdatePos.push(this.moveAct1);
        }
        this.m_curUpdatePos = this.m_UpdatePos[this.m_nCurIndex];
        return true;
    },

    onClickFish: function (event, data) {
        // cc.log("$$touch fish type:",event.type);
        if (this.IsEnd() || (!this.gFishMgr.m_mainUI.m_bGuaji))
            return;
        if (!this.gFishMgr.getAimTag())
            return;
        var nSite = this.gFishMgr.getMysite() - 1; //数据保存位置以1开始
        if (!this.m_dataCfg.fish_lock) {
            this.gFishMgr.setLockFish(nSite + 1, -1);
            return;
        }
        this.gFishMgr.setLockFish(nSite + 1, this.m_fishID);
    },


    CreateFishActNode: function (dataCfg, bMoveAct, isRight) {//创建鱼动画
        if (dataCfg == null)
            return;
        this.isRight = isRight;
        var fishNode = null;
        var fishImgList = dataCfg.fish_img.split(','); //获取鱼动画配置
        if (fishImgList && fishImgList.length > 0) {
            fishNode = cc.resources.get('gameyj_fish_doyen/prefabs/' + fishImgList[0], cc.Prefab); //游动的
            // if(bMoveAct) //判定鱼是否游动。
            //     fishNode = cc.loader.getRes('gameyj_fish_doyen/prefabs/' + fishImgList[0], cc.Prefab); //游动的鱼
            // else
            //     fishNode = cc.loader.getRes('gameyj_fish_doyen/prefabs/' + fishImgList[1], cc.Prefab); //打死鱼
            if (fishNode == null) {
                cc.log('鱼资源缺失！' + dataCfg.key + bMoveAct);
                return null;
            }

            var scaleAct = dataCfg.fish_zoom1 > 0 ? (dataCfg.fish_zoom1 / 10000) : 1; //模型比例

            var fishImgNode = cc.instantiate(fishNode); //创建鱼模型
            if (fishImgNode) {

                if (dataCfg.key >= 16) {
                    var redbagString = cc.find('fishimage/redBag/txt', fishImgNode).getComponent(cc.Label);
                    redbagString.string = dataCfg.name
                }

                var sclY = ((isRight) ? -scaleAct : scaleAct);

                fishImgNode.scale = cc.v2(-scaleAct, playerManager.m_bFilp ? -sclY : sclY)
                if (dataCfg.key >= 16) {
                    var sc = fishImgNode.scale
                    if (playerManager.m_bFilp) {
                        if (isRight)
                            fishImgNode.scale = cc.v2(-sc, -sc);
                    } else {
                        if (!isRight)
                            fishImgNode.scale = cc.v2(-sc, -sc);
                    }

                }
                //fishImgNode.setNormalizedPosition(cc.v2(0.5, 0.5));
                // fishImgNode.setRotation(dataCfg.fish_direction);
                var anim = cc.find('fishimage', fishImgNode).getComponent(cc.Animation);
                this.anim_fishState = anim.play(anim.currentClip);
                fishImgNode.setAnchorPoint(0.5, 0.5);


                return fishImgNode;
            } else
                return null;
        }
    },


    CreateFishPoolActNode: function (dataCfg, bMoveAct, isRight) {//创建鱼池
        var fishNodeList = []; //保存创建的鱼模型

        var fishImgNode = this.CreateFishActNode(dataCfg, bMoveAct, isRight);
        if (fishImgNode == null)
            return fishNodeList;

        fishNodeList.push(fishImgNode); //保存鱼



        return fishNodeList;
    },

    createFishArrayMoveAct: function (arrayCfg, index, birthPlacePos, delay) {
        var sharpList = arrayCfg.sharp.split(';');
        if (sharpList.length != 0) {
            var fishInfo = sharpList[index];
            var fishInfoList = fishInfo.split(',');
            var startPos = cc.v2(parseFloat(fishInfoList[0]), parseFloat(fishInfoList[1])); //获取x,y坐标
            startPos.x -= fishArrayOffX;
            var curPos = startPos;//cc.pAdd(birthPlacePos, startPos);
            switch (arrayCfg.movement_type) {
                case FishMoveType.rot: //旋转
                    return FishMoveRot.create(birthPlacePos, startPos, angle2radian(arrayCfg.movement_speed), arrayCfg.movement_time);
                case FishMoveType.left2right://左到右
                    var moveSpeed = cc.v2(arrayCfg.movement_speed, 0);
                    curPos = delay ? startPos.add(moveSpeed.mul(delay / 1000)) : startPos;
                    return FishMoveLine.createWithTime(curPos, arrayCfg.movement_time, moveSpeed);
                case FishMoveType.right2left://右到左
                    var moveSpeed = cc.v2(-arrayCfg.movement_speed, 0);
                    curPos = delay ? startPos.add(moveSpeed.mul(delay / 1000)) : startPos;
                    return FishMoveLine.createWithTime(curPos, arrayCfg.movement_time, moveSpeed);
                case FishMoveType.track://鱼阵
                    var sharpList = arrayCfg.sharp.split(';');
                    sharpList.splice(sharpList.length - 1, 1);
                    return FishMoveTrack.create(birthPlacePos, sharpList, index, arrayCfg.movement_speed, arrayCfg.movement_time);
                case FishMoveType.trackToEnd:
                    var sharpList = arrayCfg.sharp.split(';');
                    sharpList.splice(sharpList.length - 1, 1);
                    return FishMoveTrack.create(birthPlacePos, sharpList, index, arrayCfg.movement_speed, null);
                case FishMoveType.static://静态停止
                    return FishMoveStop.create(curPos, angle2radian(fishInfoList[4]), arrayCfg.movement_time);
            }
        }
        return null;
    },

    createFishArrayFleeAct: function (arrayCfg, birthPlacePos, delay) {
        switch (arrayCfg.flee_type) {
            case FishFleeType.leaveface:
                return FishMoveFromCur.createWithOrigin(30 - delay / 1000, arrayCfg.flee_speed, birthPlacePos);
            case FishFleeType.curface:
                return FishMoveFromCur.create(30 - delay / 1000, arrayCfg.flee_speed);
            case FishFleeType.oneface:
                var curRadian = angle2radian(360 - arrayCfg.flee_orientation);
                var moveSpeed = cc.v2(Math.cos(curRadian), Math.sin(curRadian)).mul(arrayCfg.flee_speed);
                return FishMoveFromCur.createWithDir(30, moveSpeed)
        }

        return null;
    },


    update: function (dt, bStopMove) {
        if (this.m_bMoveEnd)
            return;

        if (bStopMove && (this.node.x != 0) && (this.node.y != 0)) {
            // this.m_bUserIce = true
            if (this.m_bIsDead) {
                if (this.anim_fishState && this.anim_fishState.isPaused) {
                    // cc.log("Resumed !");
                    var anim_shadow = cc.find("fishimage_shadow", fishNode).getComponent(cc.Animation);

                    anim_fish.resume();
                    anim_shadow.resume();
                }


            } else {
                var fishNode = this.m_actNodeList[0];
                var anim_fish = cc.find("fishimage", fishNode).getComponent(cc.Animation);
                var anim_shadow = cc.find("fishimage_shadow", fishNode).getComponent(cc.Animation);

                if (!this.anim_fishState.isPaused) {
                    anim_fish.pause();
                    anim_shadow.pause();
                    // if(this.moveAct)
                    //     FishMoveLine.updateTotalTime(this.moveAct,FishType.ICE_CD_TIME);

                    // if(this.moveAct1)
                    //     FishMoveFromCur.updateTotalTime(this.moveAct1,FishType.ICE_CD_TIME);
                }
                return;
            }

        }

        if ((!bStopMove || (this.node.x == -1000 && this.node.y == -1000)) && this.m_moveScale > 0) {
            var fishNode = this.m_actNodeList[0];
            var anim_fish = cc.find("fishimage", fishNode).getComponent(cc.Animation);

            if (this.anim_fishState && this.anim_fishState.isPaused) {
                // cc.log("Resumed !");
                var anim_shadow = cc.find("fishimage_shadow", fishNode).getComponent(cc.Animation);

                anim_fish.resume();
                anim_shadow.resume();
            }

            if (this.m_curUpdatePos == null) {
                cc.log(this.m_dataCfg.key);
            }

            var info;
            if (this.m_curUpdatePos.m_curPos == null) {
                info = this.m_curUpdatePos.updatePos(this.m_moveTime + dt * this.m_moveScale + (this.m_nDelay > 0 ? this.m_nDelay : 0));
                if (this.m_nDelay > 0)
                    this.m_nDelay = 0;
            } else
                info = this.m_curUpdatePos.updatePos(this.m_moveTime + dt * this.m_moveScale);

            var curPos = info.curPos;//this.gFishMgr.getMainUI().getFishPoolNode().convertToNodeSpaceAR(info.curPos); //当前坐标
            var curDir = this.isRight ? -info.dir : info.dir; //当前朝向
            curDir = playerManager.m_bFilp ? -curDir : curDir

            var leaveTime = info.leavTime;

            if (this.m_offset)
                this.node.setPosition(this.m_offset.add(curPos)); //设置鱼主体位置
            else
                this.node.setPosition(curPos); //设置鱼主体位置

            // if(this.m_dataId == 13)
            // {
            //     cc.log((this.m_bUserIce?"@@@@afterIce:fish id":"fish id:")+this.m_fishID+".cur x:"+curPos.x);
            // }

            this.setMoveRotation(RadianToAngleOfUI(curDir)); //设置旋转度

            var moveActCount = this.m_UpdatePos.length;
            // cc.log("fish "+ this.m_fishID + " leaveTime:"+leaveTime+' posX = '+curPos.x)
            if (leaveTime > 0) {
                this.m_moveTime = leaveTime;
                if (this.m_nCurIndex < moveActCount) {
                    this.m_curUpdatePos = this.m_UpdatePos[this.m_nCurIndex]; //下一个位置点
                    if (this.m_curUpdatePos == null) {
                        cc.log(this.m_dataCfg.key);
                    }
                    this.m_curUpdatePos.onEnter(curPos, curDir, leaveTime);
                    this.m_nCurIndex = this.m_nCurIndex + 1;
                } else {
                    this.m_bMoveEnd = true;
                    cc.log("fish " + this.m_fishID + " is move end." + ' posX = ' + curPos.x)
                }
            } else
                this.m_moveTime = 0;
            if (rectContainsPoint(this.fishPoolRect, curPos) == false) {
                if (this.m_bInScreen) {
                    this.m_bMoveEnd = true;
                    cc.log("fish " + this.m_fishID + " is out screen." + ' posX = ' + curPos.x)
                }
            } else
                this.m_bInScreen = true;
        }



        if (this.m_bMoveEnd == false) {
            if (this.m_nHitTimes) {
                this.m_nHitTimes -= dt;
                if (this.m_nHitTimes <= 0) {
                    this.m_nHitTimes = null;
                    if (this.m_moveNode) {
                        shaderUtils.clearShader(this.m_moveNode.getComponent(cc.Sprite));
                    }
                }

                if (this.m_moveScaleTime) {
                    this.m_moveScaleTime -= dt;
                    if (this.m_moveScaleTime < 0)
                        this.setMoveScale(1, null);
                }
            }
        }
    },
});

module.exports = {
    CFish: CFish
};