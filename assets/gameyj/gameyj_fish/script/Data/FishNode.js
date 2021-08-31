// create by wj 2019/09/10
var size = cc.winSize;
const data_fishtype = require('fishtype');
const data_fishpath = require('fishpath');
var FishMoveLine = require('FishMoveAction').CFishMoveLine;
var FishMoveBezier = require('FishMoveAction').CFishMoveBezier;
var FishMoveFromCur = require('FishMoveAction').CFishMoveFromCur;
var FishMoveRot = require('FishMoveAction').CFishMoveRot;
var FishMoveStop = require('FishMoveAction').CFishMoveStop;
var FishMoveTrack = require('FishMoveAction').CFishMoveTrack;
const FishType = require('FishTypeCfg');

const g_FishPoolRect = cc.rect(0, 0, size.width, size.height);
g_FishPoolRect.center = cc.v2(0, 0);

function RadianToAngleOfUI(radian) {//弧度值转换为角度
    return 360 - radian / Math.PI * 180;
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
        createFish: function (fishID, dataID, pathID, offset, stopScale, moveTime, fishPoolNode) {//创建鱼
            if (dataID == 0 || pathID == 0)
                return;
            var fishData = data_fishtype.getItem(function (item) {
                if (item.key == dataID)
                    return item;
            });
            if (fishData) {
                var fish = new CFish;
                fish.setFishInfo(dataID, fishData, fishPoolNode);
                fish.setFishId(fishID);
                fish.setMoveInfo(pathID, offset, stopScale, moveTime);
                return fish;
            }
            return null;
        },

        createFishEx: function (fishID, dataID, arrayCfg, index, moveTime, birthPlacePos, fishPoolNode) {//创建鱼阵
            if (dataID == 0)
                return;
            var fishData = data_fishtype.getItem(function (item) {
                if (item.key == dataID)
                    return item;
            });
            if (fishData) {
                var fish = new CFish;
                fish.setFishInfo(dataID, fishData, fishPoolNode);
                fish.setFishId(fishID);
                if (fish.SetMoveArrayInfo(arrayCfg, index, moveTime, birthPlacePos))
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
                fishNode.setScale(scale);
                return fishNode;
            }
        },

        createFishTypeNode: function (dataCfg, showSize) {
            var fish = new CFish;
            var nodeList = fish.CreateFishPoolActNode(dataCfg, true);
            var fishNode = nodeList[0];
            if (fishNode) {
                fishNode.setRotation(dataCfg.fish_direction1);
                var scale = Math.min(showSize / fishNode.width, showSize / fishNode.height) / (fishNode.scale);
                fishNode.setScale(scale);
                return fishNode;
            }
        },
    },

    ctor: function () {
        this.m_dataId = 0; //配置表中鱼的id
        this.m_dataCfg = null; //配置表数据
        this.fishSize = null;
        this.m_oBodyNode = null; //鱼节点
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
        this.m_UpdatePos = []; //保存鱼的移动路线点
        this.m_moveTime = 0; //游动时间
        this.m_lockImg = []; //被锁定图片
        this.m_moveScale = 1; //移动模型大小
        this.m_actNodeList = []; //鱼模型
        this.gFishMgr = require('FishManager').FishManager.Instance();
        this.node = new cc.Node();

    },

    setFishInfo: function (dataId, dataCfg, fishPoolNode) {//设置鱼的信息
        this.m_dataId = dataId; //配置表id
        this.m_dataCfg = dataCfg; //配置表数据

        this.m_actNodeList = this.CreateFishPoolActNode(this.m_dataCfg, true); //创建活鱼
        if (this.m_actNodeList.length == 0)
            return;
        this.m_oBodyNode = this.m_actNodeList[0];
        this.m_moveNode = cc.dd.Utils.seekNodeByName(this.m_oBodyNode, 'fishimage'); //鱼的主体
        this.m_shadowNode = cc.dd.Utils.seekNodeByName(this.m_oBodyNode, 'fishimage_shadow'); //鱼的阴影
        this.m_shadowNode.setPosition(cc.v2(-6, 6));
        this.m_shadowNode.setScale(1.1);
        this.m_oBodyNode.setPosition(cc.v2(0, 0));
        this.fishSize = Math.max(this.m_oBodyNode.width, this.m_oBodyNode.height) * this.m_oBodyNode.scale;
        this.shapesSrcRect = cc.rect(0, 0, this.m_oBodyNode.width * this.m_oBodyNode.scale, this.m_oBodyNode.height * this.m_oBodyNode.scale);
        this.shapesSrcRect.center = cc.v2(0, 0);
        this.node.addChild(this.m_oBodyNode);
        var poolOffset = this.fishSize * 1.1;

        this.fishPoolRect = new cc.Node;
        this.fishPoolRect.width = fishPoolNode.width + 2 * poolOffset;
        this.fishPoolRect.height = fishPoolNode.height + 2 * poolOffset;
        var cpt = this.fishPoolRect.addComponent(cc.Widget);
        cpt.isAlignTop = true;
        cpt.isAlignBottom = true;
        cpt.isAlignLeft = true;
        cpt.isAlignRight = true;
        cpt.isAlignOnce = false;

        this.fishPoolRect.parent = fishPoolNode.parent;

        //cc.rect(g_FishPoolRect.x-poolOffset , g_FishPoolRect.y-poolOffset, g_FishPoolRect.width + 2 * poolOffset, g_FishPoolRect.height + 2 * poolOffset);
        this.m_moveNode.on(cc.Node.EventType.TOUCH_START, this.onClickFish, this); //开始点击
        this.m_moveNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickFish, this); //移动
        this.m_moveNode.on(cc.Node.EventType.TOUCH_END, this.onClickFish, this); //移动
    },

    setFishId: function (fishId) { //设置鱼的唯一id
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
        return Math.max(this.m_moveNode.width * this.m_moveNode.scale, this.m_moveNode.height * this.m_moveNode.scale)
    },

    getCenterPosInPool: function () {
        return this.node.getPosition();
    },

    getCenterPosInWorld: function () {
        return this.node.convertToWorldSpaceAR(cc.v2(0, 0));
    },

    setMoveInfo: function (pathID, offset, stopScale, moveTime) {//设置鱼路线
        if (moveTime != null)
            this.m_moveTime = moveTime; //移动时间
        if (offset != null)
            this.m_offset = offset;
        this.node.setPosition(-1000, -1000);
        var speed = this.m_dataCfg.fish_speed;

        var info = data_fishpath.getItem(function (data) {
            if (data.key == pathID)
                return data;
        });
        var pathList = info.path.split(';');
        pathList.splice(pathList.length - 1, 1);
        if (stopScale != null) {
            var stopTime = (this.getFishSize() + 30) / speed * stopScale * 1.2;
            this.m_UpdatePos.push(FishMoveStop.create(cc.v2(-1000, -1000), 0, stopTime)); //创建鱼的路线
        }

        for (var i = 0; i < pathList.length - 2; i += 2) {
            var pos1 = pathList[i].split(',');
            var pos2 = pathList[i + 1].split(',');
            var pos3 = pathList[i + 2].split(',');
            this.m_UpdatePos.push(FishMoveBezier.create(cc.v2((parseFloat(pos1[0])), (parseFloat(pos1[1]))), cc.v2((parseFloat(pos2[0])), (parseFloat(pos2[1]))),
                cc.v2((parseFloat(pos3[0])), parseFloat((pos3[1]))), speed)); //创建鱼的贝塞尔路线

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
            if (this.gFishMgr.m_bFlip)
                pos = pos.mul(-1);
            if (this.rectContainsPoint(pos)) {//判断点是否在鱼图像区域
                return true;
            }
        }
        return false;
    },

    setLock: function (nSite, bLock) {//锁定鱼
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
        var dieEffect = fishCfg.effe_die.split(';');
        for (var i = 0; i < dieEffect.length; i++) {
            var effectFile = dieEffect[i];
            var actNode = cc.resources.get("gameyj_fish/prefabs/" + effectFile, cc.Prefab);
            if (actNode) {
                var child = cc.instantiate(actNode);
                node.addChild(child);
            }
        }

        return node;
    },

    onHitBullet: function (bulletType) {
        this.m_moveNode.color = FishType.hitFishColor;
        for (var child of this.m_moveNode.children) {
            child.color = FishType.hitFishColor;
            var node = cc.dd.Utils.seekNodeByName(child, 'fishimage');
            if (node)
                node.color = FishType.hitFishColor;
        }
        if (this.m_dataCfg.key == 29) {
            var child = cc.dd.Utils.seekNodeByName(this.node, 'fishChild');
            if (child) {
                child.color = FishType.hitFishColor;
                var node = cc.dd.Utils.seekNodeByName(child, 'fishimage');
                if (node)
                    node.color = FishType.hitFishColor;
            }
        }
        if (this.m_nHitTimes == null)
            this.m_nHitTimes = FishType.hitFishActTime;
    },

    onDie: function (baudio) {//鱼死亡
        if (!baudio) {
            this.node.removeFromParent(true);
            return;
        }
        //鱼死亡挣扎
        var parent = this.node
        var dieFishNodeList = this.CreateFishPoolActNode(this.m_dataCfg, false); //创建死亡鱼
        var dieFishNode = dieFishNodeList[0];
        if (dieFishNode) {
            this.m_bMoveEnd = true;
            dieFishNode.setPosition(cc.v2(0, 0));
            var act = cc.sequence(cc.delayTime(FishType.dieActSpaceTime), cc.callFunc(function () {
                dieFishNode.setRotation(dieFishNode.rotation + parseInt(Math.random() * 7, 10) * 45);
            }));
            parent.addChild(dieFishNode);
            dieFishNode.runAction(cc.sequence(cc.repeat(act, FishType.dieActTime / FishType.dieActSpaceTime), cc.callFunc(function () {
                dieFishNode.removeFromParent(true);
                this.node.removeFromParent(true);
            }.bind(this))))
        }

        //爆炸特效
        var die_effect = this.m_dataCfg.effe_die.split(';');
        // die_effect.splice(die_effect.length - 1, 1);
        if (die_effect.length != 0) {
            var dieAct = this.createFishDieAct(this.m_dataCfg);
            dieAct.setPosition(cc.v2(0, 0));
            if (this.gFishMgr.m_bFlip)
                dieAct.setRotation(180);
            dieAct.zIndex = FishType.ZorderInPool.effect;
            parent.addChild(dieAct);
            parent.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
                dieAct.removeFromParent();
            })))
        }
        if (this.m_dataCfg.fish_shake > 0) { //震屏
            this.gFishMgr.m_mainUI.setShake(this.m_dataCfg.fish_shake);
        }

        if (baudio) {
            var soundList = this.m_dataCfg.sound_die.split(';');
            soundList.splice(soundList.length - 1, 1);
            if (soundList.length > 0) {
                var index = parseInt(Math.random() * (soundList.length - 1), 10);
                this.gFishMgr.playAudio(parseInt(soundList[index]), false);
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

    SetMoveArrayInfo: function (arrayCfg, index, moveTime, birthPlacePos) {
        var moveAct = this.createFishArrayMoveAct(arrayCfg, index, birthPlacePos);
        this.m_UpdatePos.push(moveAct);
        var moveAct1 = this.createFishArrayFleeAct(arrayCfg, birthPlacePos);
        this.m_UpdatePos.push(moveAct1);
        this.m_curUpdatePos = this.m_UpdatePos[this.m_nCurIndex];
        return true;
    },

    onClickFish: function (event, data) {
        if (this.IsEnd())
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


    CreateFishActNode: function (dataCfg, bMoveAct) {//创建鱼动画
        if (dataCfg == null)
            return;

        var fishNode = null;
        var fishImgList = dataCfg.fish_img.split(','); //获取鱼动画配置
        if (fishImgList && fishImgList.length > 0) {
            if (bMoveAct) //判定鱼是否游动。
                fishNode = cc.resources.get('gameyj_fish/prefabs/' + fishImgList[0], cc.Prefab); //游动的鱼
            else
                fishNode = cc.resources.get('gameyj_fish/prefabs/' + fishImgList[1], cc.Prefab); //打死鱼
            if (fishNode == null) {
                cc.log('鱼资源缺失！' + dataCfg.key + bMoveAct);
                return null;
            }
            var scaleAct = dataCfg.fish_zoom1 > 0 ? (dataCfg.fish_zoom1 / 10000) : 1; //模型比例


            var fishImgNode = cc.instantiate(fishNode); //创建鱼模型
            if (fishImgNode) {
                fishImgNode.scale = scaleAct;
                //fishImgNode.setNormalizedPosition(cc.v2(0.5, 0.5));
                fishImgNode.setRotation(dataCfg.fish_direction);
                fishImgNode.setAnchorPoint(0.5, 0.5);

                return fishImgNode;
            } else
                return null;
        }
    },


    CreateFishPoolActNode: function (dataCfg, bMoveAct) {//创建鱼池
        var fishNodeList = []; //保存创建的鱼模型

        var fishImgNode = this.CreateFishActNode(dataCfg, bMoveAct);
        if (fishImgNode == null)
            return fishNodeList;

        fishNodeList.push(fishImgNode); //保存鱼

        if (dataCfg.fish_type == FishModelType.dishFish && dataCfg.fish_platter > 0) {//鱼盘
            var dataCfg2 = data_fishtype.getItem(function (cfg) { //获取鱼盘对应的鱼
                if (cfg.key == dataCfg.fish_platter)
                    return cfg;
            });
            if (dataCfg.fish_platter_num > 1) {//鱼盘由多只鱼组成
                for (var i = 0; i < dataCfg.fish_platter_num; i++) {
                    var platterNode = cc.dd.Utils.seekNodeByName(fishImgNode, 'fish' + i);
                    if (platterNode) {
                        var platterFish = this.CreateFishActNode(dataCfg2, bMoveAct); //创建鱼盘上的鱼
                        if (platterFish == null) {
                            cc.log('创建鱼盘失败！' + dataCfg.key + '.....' + dataCfg2.key);
                            return;
                        }

                        var pos = platterNode.getPosition(); //获取鱼位置
                        platterFish.setPosition(pos);//设置位置
                        platterFish.setScale(1 / platterFish.getScale());
                        platterFish.setRotation(platterNode.parent.rotation);
                        //platterFish.name = 'fishChild';
                        platterNode.parent.addChild(platterFish);
                        fishNodeList.push(platterFish);
                    }
                }
            } else {//只有一条鱼
                var fishImgNode1 = this.CreateFishActNode(dataCfg2, bMoveAct);
                if (fishImgNode1 == null) {
                    cc.log('创建鱼盘失败！!!!!!' + dataCfg.key + '.....' + dataCfg2.key);
                    return;
                }

                var parent = cc.dd.Utils.seekNodeByName(fishImgNode, 'fishimage');
                fishImgNode1.setRotation(-parent.rotation);
                if (dataCfg.key == 29) {
                    parent = fishImgNode;
                    fishImgNode1.name = 'fishChild';
                }
                if (parent) {
                    parent.addChild(fishImgNode1);
                    fishNodeList.push(fishImgNode1);
                }
                //var buffList = dataCfg.fish_buff.split(',');
                // if((buffList && buffList.length > 0 && buffList[0] == FishModelType.FishBuf.TypeBomb) || dataCfg.fish_die > 0){//同类鱼炸弹或者鱼王
                //     var scaleAct = (Math.max(fishImgNode1.width, fishImgNode1.height) * )
                // }
            }
        }

        return fishNodeList;
    },

    createFishArrayMoveAct: function (arrayCfg, index, birthPlacePos) {
        var sharpList = arrayCfg.sharp.split(';');
        if (sharpList.length != 0) {
            var fishInfo = sharpList[index];
            var fishInfoList = fishInfo.split(',');
            var startPos = cc.v2(parseFloat(fishInfoList[0]), parseFloat(fishInfoList[1])); //获取x,y坐标

            var curPos = birthPlacePos.add(startPos);
            switch (arrayCfg.movement_type) {
                case FishMoveType.rot: //旋转
                    return FishMoveRot.create(birthPlacePos, startPos, angle2radian(arrayCfg.movement_speed), arrayCfg.movement_time);
                case FishMoveType.left2right://左到右
                    var moveSpeed = cc.v2(arrayCfg.movement_speed, 0);
                    return FishMoveLine.createWithTime(curPos, arrayCfg.movement_time, moveSpeed);
                case FishMoveType.right2left://右到左
                    var moveSpeed = cc.v2(-arrayCfg.movement_speed, 0);
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

    createFishArrayFleeAct: function (arrayCfg, birthPlacePos) {
        switch (arrayCfg.flee_type) {
            case FishFleeType.leaveface:
                return FishMoveFromCur.createWithOrigin(17, arrayCfg.flee_speed, birthPlacePos);
            case FishFleeType.curface:
                return FishMoveFromCur.create(17, arrayCfg.flee_speed);
            case FishFleeType.oneface:
                var curRadian = angle2radian(360 - arrayCfg.flee_orientation);
                var moveSpeed = cc.v2(Math.cos(curRadian), Math.sin(curRadian)).mul(arrayCfg.flee_speed);
                return FishMoveFromCur.createWithDir(17, moveSpeed)
        }

        return null;
    },


    update: function (dt, bStopMove) {
        if (this.m_bMoveEnd)
            return;

        if (!bStopMove && this.m_moveScale > 0) {
            var info = this.m_curUpdatePos.updatePos(this.m_moveTime + dt * this.m_moveScale);
            var curPos = info.curPos;//this.gFishMgr.getMainUI().getFishPoolNode().convertToNodeSpaceAR(info.curPos); //当前坐标
            var curDir = info.dir; //当前朝向
            var leaveTime = info.leavTime;

            if (this.m_offset)
                this.node.setPosition(this.m_offset.add(curPos)); //设置鱼主体位置
            else
                this.node.setPosition(curPos); //设置鱼主体位置
            this.setMoveRotation(RadianToAngleOfUI(curDir)); //设置旋转度

            var moveActCount = this.m_UpdatePos.length;
            if (leaveTime > 0) {
                this.m_moveTime = leaveTime;
                if (this.m_nCurIndex < moveActCount) {
                    this.m_curUpdatePos = this.m_UpdatePos[this.m_nCurIndex]; //下一个位置点
                    this.m_curUpdatePos.onEnter(curPos, curDir);
                    this.m_nCurIndex = this.m_nCurIndex + 1;
                } else
                    this.m_bMoveEnd = true;
            } else
                this.m_moveTime = 0;
            if (rectContainsPoint(this.fishPoolRect, curPos) == false) {
                if (this.m_bInScreen)
                    this.m_bMoveEnd = true;
            } else
                this.m_bInScreen = true;
        }

        if (this.m_bMoveEnd == false) {
            if (this.m_nHitTimes) {
                this.m_nHitTimes -= dt;
                if (this.m_nHitTimes <= 0) {
                    this.m_nHitTimes = null;
                    this.m_moveNode.color = cc.color(255, 255, 255);
                    for (var child of this.m_moveNode.children) {
                        child.color = cc.color(255, 255, 255);
                        var node = cc.dd.Utils.seekNodeByName(child, 'fishimage');
                        if (node)
                            node.color = cc.color(255, 255, 255);
                    }
                    if (this.m_dataCfg.key == 29) {
                        var child = cc.dd.Utils.seekNodeByName(this.node, 'fishChild');
                        if (child) {
                            var node = cc.dd.Utils.seekNodeByName(child, 'fishimage');
                            if (node)
                                node.color = cc.color(255, 255, 255);
                        }
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