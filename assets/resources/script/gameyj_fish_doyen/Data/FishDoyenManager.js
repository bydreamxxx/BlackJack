
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var Cbullet = require('DoyenBulletNode').CBullet;
const FishType = require('DoyenFishType');
var playerManager = require('FishDoyenPlayerManager').CFishPlayerManager.Instance();
var CFish = require('FishDoyenNode').CFish;

const itemcfg = require('item');
const data_fishroom = require('qka_fish_master_room');
var fishSender = require('gameyj_fish_doyen_sender');
var data_fishpath = require('qka_fish_master_path');
const data_fishtype = require('qka_fish_master_type');
const data_fisharraymin = require('qka_fish_master_arraymin');
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
var game_room = require('game_room');
var audioCfg = require('qka_fish_master_audio')
// const HallCommonData = require('hall_common_data').HallCommonData.getInstance();

const botLockDir = 100000;
const botUnLockDir = 200000;
const g_FishWorldRect = cc.rect((1280 - cc.winSize.width) / 2, (720 - cc.winSize.height) / 2, cc.winSize.width, cc.winSize.height);
var g_RotOffset = 0.05;
var g_paoTaiStartDir = [
    - Math.PI * g_RotOffset,
    Math.PI * (1 + g_RotOffset),
    Math.PI * (1 + g_RotOffset),
    Math.PI * (1 + g_RotOffset),
    - Math.PI * g_RotOffset,
    - Math.PI * g_RotOffset
];
const defaultBetDir = [
    Math.PI / 2,
    -Math.PI / 2,
    -Math.PI / 2,
    -Math.PI / 2,
    Math.PI / 2,
    Math.PI / 2];

function getLength(pt) {//获取向量长度
    return Math.sqrt(pt.x * pt.x + pt.y * pt.y)
}

function rectContainsPoint(node, pos) { //点是否在区域中
    if ((pos.x >= (node.x - node.width / 2)) && (pos.x <= (node.x + node.width / 2)) &&
        (pos.y >= (node.y - node.height / 2)) && (pos.y <= (node.y + node.height / 2))) {
        return true;
    }
    return false;
}

var FishManager = cc.Class({
    statics: {
        fishManager: null,
        Instance: function () {
            if (this.fishManager == null) {
                this.fishManager = new FishManager();
            }
            return this.fishManager;
        },

        Destroy: function () {
            if (this.fishManager) {
                this.fishManager = null;
            }
        },
    },

    ctor: function () {
        this.m_mainUI = null; //主界面
        this.m_nRoomType = 0; //房间类型配置
        this.m_nSite = 1; //个人座位号
        this.m_nGetFen = 0; //每局奖励分数
        this.m_tRoomCfg = null;
        this.m_tGameRoomCfg = null;

        this.m_tFishObj = []; //鱼对象数组
        this.m_tBulletObj = []; //子弹对象数组
        this.m_tSitBulletPos = []; //子弹坐标数组
        this.m_tFishResult = [];

        this.m_bFilp = false; //是否翻转
        this.m_nBulletIndex = 1; //子弹索引
        this.m_stopScreenEndTime = null;
        this.m_tCreateFishList = [];
        this.m_bCaoXi = false; //潮汐判定
        this.m_bInit = false;
        this.m_nCheckCount = 0;
        this.m_bAim = true;

        this.m_myGuns = [];//我的所有炮台
        this.m_currentGunId = 10055;
        this.m_bIceEffect = false;
        this.m_bIsShowExchange = false;
        this.isAuto = 0;
        // this.FISH_GOLD_RATE = 10; //金币显示扩大的倍数
    },

    init: function () {
        // this.setRoomType(RoomMgr.Instance().gameId);
        this.initMyGuns();
    },


    getTools: function (type) {
        //
        if (type == 1) {
            var itm = hall_prop_data.getItemInfoByDataId(10062)
            return itm ? itm.count : 0;
        } else {
            var itm = hall_prop_data.getItemInfoByDataId(10063)
            return itm ? itm.count : 0;
        }

    },

    initMyGuns: function (data) {
        if (data) {
            var items = hall_prop_data._getPropInfo(data.itemid)
            //购买自动装上炮
            if (items.dataId >= 10058 && items.dataId <= 10061) {
                if (items.count <= 0) {
                    cc.dd.PromptBoxUtil.show('当前炮台已过期', null, 1);
                    fishSender.betSender(0, 10055);
                } else {
                    fishSender.betSender(0, items.dataId);
                }

            }

        }


        this.m_myGuns = hall_prop_data.getItemInfoByType(15);
        var compare = function (a, b) {//比较函数
            if (a.dataId < b.dataId) {
                return -1;
            } else if (a.dataId > b.dataId) {
                return 1;
            } else {
                return 0;
            }
        }
        this.m_myGuns.sort(compare)
    },

    getMyGuns: function () {
        return this.m_myGuns;

    },

    setMainUI: function (mainUI) { //设置游戏主界面
        this.m_mainUI = mainUI;
    },

    getMainUI: function () {//返回游戏主界面
        return this.m_mainUI;
    },

    setRoomType: function (roomType) {//设置房间配置id
        this.m_nRoomType = roomType + 13900;
    },

    getRoomType: function () {//获取房间配置id
        return this.m_nRoomType;
    },

    setRoomItem: function (data) {
        this.m_oRoomItem = data;
    },

    getRoomItem: function () {
        return this.m_oRoomItem;
    },

    setRoomCfg: function () { //设置房间配置
        this.m_tRoomCfg = data_fishroom.getItem(function (item) {
            if (item.key == this.m_nRoomType)
                return item;
        }.bind(this));

        this.m_tGameRoomCfg = game_room.getItem(function (item) {
            if (item.key == this.m_nRoomType)
                return item;
        }.bind(this));

    },

    getRoomCfg: function () {//获取房间配置
        return this.m_tRoomCfg;
    },

    setInit: function () {
        this.m_bInit = true;
    },

    getIsInit: function () {
        return this.m_bInit;
    },


    getResultFen: function () {//获取当局奖励分数
        return m_nGetFen;
    },

    getMysite: function () {//返回自己的座位号
        return this.m_nSite;
    },

    getCaoXi: function () {//获取潮汐
        return this.m_bCaoXi;
    },


    changeRoom: function () {//切换房间
    },

    setAimTag: function (isAim) {//设置是否开启锁定功能
        this.m_bAim = isAim;
    },

    getAimTag: function () {
        return this.m_bAim;
    },

    setAuto: function (data) {
        this.isAuto = data;
    },
    getAuto: function () {
        return this.isAuto;
    },

    getBulletNums: function () {//获取当前游戏总的子弹数量
        var count = 0;
        for (var i = 0; i < this.m_tBulletObj.length; i++) {
            if (this.m_tBulletObj[i].obj)
                count += 1;
        }
        return count;
    },

    getMyBulletNums: function () {//获取自己的子弹数量
        var count = 0;
        for (var v of this.m_tBulletObj) {
            if (v.obj && v.nSite == this.m_nSite)
                count += 1;
        }
        return count;
    },

    checkBulletExistence: function (bulletId) {//检查子弹是否存在
        for (var v of this.m_tBulletObj) {
            if (v.bulletId == bulletId)
                return true;
        }
        return false;
    },

    setBulletPos: function (nSite, pos, posInWorld) {//设置子弹位置
        this.m_tSitBulletPos[nSite] = [pos, posInWorld];
    },

    getBulletPos: function (nSite) {//根据座位获取子弹位置
        return this.m_tSitBulletPos[nSite][0];
    },

    getBulletPosInWorld: function (nSite) {//根据座位获取子弹世界坐标
        return this.m_tSitBulletPos[nSite][1];
    },

    getBullet: function (bulletId) {//获取子弹
        for (var v of this.m_tBulletObj) {
            if (v.bulletId == bulletId)
                return v;
        }
        return null;
    },

    getFish: function (fishId) {//获取鱼
        if (fishId < 0) return null;
        for (var v of this.m_tFishObj) {
            if (v.m_fishID == fishId)
                return v;
        }
        return null;
    },

    getFishToLock: function (fishId) {//获取锁定的鱼
        if (fishId && fishId > 0) {
            var fish = this.getFish(fishId);
            if (fish) {
                var fishPos = fish.getCenterPosInWorld();
                var fishArPos = fish.getCenterPosInPool();
                if (rectContainsPoint(this.m_mainUI.getFishPoolNode(), fish.node.getPosition())) {
                    if (fish.m_dataCfg.fish_lock == 1) {
                        var data = {
                            fish: fish,
                            fishPos: fishPos,
                            fishArPos: fishArPos,
                        }
                        return data;
                    }
                }
            }
            return null;
        }
        return null;
    },

    deleteFishDataInArry: function (fishId) {//删除数组保存的鱼数据
        for (var i = 0; i < this.m_tFishObj.length; i++) {
            if (fishId == this.m_tFishObj[i].m_fishID) {
                this.m_tFishObj.splice(i, 1);
                break;
            }
        }
    },

    getFishResult: function (fishDataId) {//配置表id查找结果鱼
        for (var v of this.m_tFishResult) {
            if (v.m_fishDataId == fishDataId)
                return v.curNum;
        }
        return 0;
    },

    isEnergyBullet: function (userId) {//是否为能量子弹
        var player = playerManager.findPlayerByUserId(userId)//获取玩家
        if (player) {
            var playerData = player.getPlayerGameInfo(); //获取游戏数据
            if (playerData) {
                return playerData.buff_id > 0;
            }
            cc.log('查找不到玩家游戏数据，判定不了是否为能量弹')
        }
        cc.log('查找不到玩家，判定不了是否为能量弹')
        return false;
    },

    // isThreeBullet: function(userId){//是否为3子弹
    //     var player = playerManager.findPlayerByUserId(userId)//获取玩家
    //     if(player){
    //         var playerData = player.getPlayerGameInfo(); //获取游戏数据
    //         if(playerData){
    //             return playerData.bet > this.m_tRoomCfg.bet_max / 2;
    //         }
    //         cc.log('查找不到玩家游戏数据，判定不了是否为3子弹')
    //     }
    //     cc.log('查找不到玩家，判定不了是否为3子弹')
    //     return false;
    // },

    buildPlayerData: function (player) {//设置玩家游戏数据
        playerManager.setPlayerGameData(player);
        if (player.userId == cc.dd.user.id)
            this.m_nSite = playerManager.findPlayerByUserId(cc.dd.user.id).getPlayerCommonInfo().pos;
    },

    getMyData: function () {//获取自己的游戏数据
        var own = playerManager.findPlayerByUserId(cc.dd.user.id);//获取自己数据
        if (own) {
            var playerData = own.getPlayerGameInfo();//获取游戏数据
            if (playerData)
                return playerData;
        }
        return null;
    },

    checkFishCanLock: function () {
        var fishCount = this.m_tFishObj.length;
        var index = parseInt(Math.random() * (fishCount - 1), 10);
        var fish = this.m_tFishObj[index];
        this.m_nCheckCount++;
        if (this.m_nCheckCount >= fishCount) {
            this.m_nCheckCount = 0;
            return null;
        }
        if (fish && fish.m_dataCfg.fish_lock > 0) {
            this.m_nCheckCount = 0;
            return fish;
        } else {
            return this.checkFishCanLock();
        }
    },


    getBigestFish: function () {
        var bigEstFish = null;
        for (var i = 0; i < this.m_tFishObj.length; i++) {
            if (bigEstFish == null) {
                var fishPos = this.m_tFishObj[i].node.getPosition();
                if (rectContainsPoint(this.m_mainUI.getFishPoolNode(), fishPos)) {
                    bigEstFish = this.m_tFishObj[i];
                    continue;
                } else
                    continue;

            }

            if (this.m_tFishObj[i].m_dataCfg.key > bigEstFish.m_dataCfg.key) {
                var fishPos = this.m_tFishObj[i].node.getPosition();// getCenterPosInWorld();
                if (rectContainsPoint(this.m_mainUI.getFishPoolNode(), fishPos))
                    bigEstFish = this.m_tFishObj[i];
                else
                    continue;
            }

        }
        return bigEstFish;
    },

    getAutoLockFish: function () {//自动锁定
        if (this.m_tFishObj.length == 0)
            return;
        var fish = this.getBigestFish();
        if (fish) {
            // var fishPos = fish.getCenterPosInWorld();
            // if(rectContainsPoint(this.m_mainUI.getFishPoolNode(), fishPos))
            return fish.m_fishID;

        }
    },
    /////////////////////////////////////////////////////////////////////////////翻转切换Begin////////////////////////////////////////////
    toClientSite: function (serverSite) {//座位号翻转为客户端
        if (serverSite > 2) serverSite += 1;
        // if (serverSite > 2 && HallCommonData.fishActivityState == 1) serverSite += 1;
        if (this.m_bFilp) {
            return (serverSite - 1 + 3) % 6 + 1;
        } else
            return serverSite;
    },

    toSeverSite: function (clientSite) { //座位号翻转为服务器：以1做为起始
        if (this.m_bFilp) {
            return (clientSite - 1 + 3) % 6 + 1;
        } else
            return clientSite;
    },

    toClientDir: function (dir) {//方向角转换为客户端
        if (this.m_bFilp)
            return dir + Math.PI;
        else
            return dir;
    },

    toSeverDir: function (dir) {//转换服务器方向角
        if (this.m_bFilp)
            return dir + Math.PI;
        else
            return dir;
    },
    /////////////////////////////////////////////////////////////////////////////翻转切换End////////////////////////////////////////////

    setBetTimes: function (ty) {//发送加减档位消息
        var myData = this.getMyGuns(); //获取自己档位信息
        if (myData == null || myData.length <= 1)
            return;

        var idx = 0;
        for (var i = 0; i < myData.length; i++) {
            if (myData[i].dataId == this.m_currentGunId) {

                if (ty == 2) {
                    idx = i == 0 ? (myData.length - 1) : (i - 1)
                } else {
                    idx = i == (myData.length - 1) ? 0 : (i + 1)
                }
                break;
            }

        }

        fishSender.betSender(ty, myData[idx].dataId);//发送信息上去
    },

    getPlayerBet: function (gunid) {
        var gun = gunid || this.m_currentGunId
        var itemCfg = itemcfg.getItem(function (element) {
            if (element.key == gun)
                return true;
        }.bind(this));

        var bet = itemCfg.p1 * this.getRoomRate() * this.getRoomCfg().room_change;// * this.FISH_GOLD_RATE;
        return bet;
    },
    /////////////////////////////////////////////////////////////////////////////鱼创建相关begin////////////////////////////////////////

    checkFishExistence: function (fishId) {//检测是否有重复id的鱼
        for (var fish of this.m_tFishObj) {
            if (fish && fish.m_fishID == fishId)
                return true;
        }
        return false;
    },

    createFish: function (fishID, dataID, pathID, offset, stopScale, moveTime, delay) {//创建散鱼
        if (this.checkFishExistence(fishID)) {
            cc.log('存在重复的鱼ID======' + fishID);
            return;
        }


        var fish = CFish.createFish(fishID, dataID, pathID, offset, stopScale, moveTime, this.m_mainUI.getFishPoolNode(), delay); //鱼工具创建鱼
        if (fish) {
            this.m_tFishObj.push(fish);
            if (this.m_mainUI)
                this.m_mainUI.getFishPoolNode().addChild(fish.node);
        }
    },

    // 鱼线
    createLineForm: function (msg) {
        for (var k = 0; k < msg.fishIdsList.length; k++) {
            var v = msg.fishIdsList[k].fishid;
            var delay = msg.fishIdsList[k].dValue;
            this.createFish(v, msg.fishDataId, msg.pathId, null, k, null, delay);
        }
    },

    createFishJiGuangAct(effe_cts) {//创建激光动画
        var lightningNode = cc.resources.get('gameyj_fish/prefabs/lightning', cc.Prefab);
        if (lightningNode) {
            var node = cc.instantiate(lightningNode);
            return node;
        }
    },

    getFishRelation: function (fishBombPos, checkFunc) {//获取关联的鱼
        var hitFishes = [];
        for (var v of this.m_tFishObj) {
            var fishPos = v.getCenterPosInPool();//获取鱼当前位置
            if (checkFunc == null || checkFunc(v, fishPos)) {
                hitFishes.push({
                    fish: v,
                    pos: fishPos
                })
            }
        }
        return hitFishes;
    },

    createJiGuangAct: function (effe_cts, fishBombPos, checkFunc) {//创建激光特效
        var parentNode = this.m_mainUI.getFishPoolNode(); //根节点
        var hitFishes = this.getFishRelation(fishBombPos, checkFunc);
        if (hitFishes.length > 0 && effe_cts.length > 0) {
            var dieActRoot = new cc.Node();
            for (var fishInfo of hitFishes) {
                var dieAct = this.createFishJiGuangAct(effe_cts);
                dieAct.getChildByName('lightning').getComponent(cc.Animation).play();
                var offset = fishInfo.pos.sub(fishBombPos);
                var radian = Math.atan2(offset.x, offset.y);
                dieAct.setRotation(360 - radian / Math.PI * 180);
                var distance = getLength(offset);//资源长度
                dieAct.setScaleY(distance / 377); //设置x大小
                //dieAct.runAction(cc.scaleTo(0.5, 1, distance/ 377));
                dieActRoot.addChild(dieAct);
            }

            dieActRoot.setPosition(fishBombPos); //设置激光位置点
            dieActRoot.zIndex = FishType.ZorderInPool.effect;
            parentNode.addChild(dieActRoot);
            parentNode.runAction(cc.sequence(cc.delayTime(FishType.jiGuangActTime), cc.callFunc(function () {
                dieActRoot.removeFromParent();
            })))
        }
        return hitFishes;
    },

    //创建buff
    createFishBuff: function (userId, fishDataID, fishBombPos, bulletTree, bulletID, buffID) {
        var player = playerManager.findPlayerByUserId(userId);
        if (player == null)
            return;
        var playerData = player.getPlayerCommonInfo();
        if (playerData == null)
            return;
        var nSite = playerData.pos;
        var fishes = [];
        var fishCfg = data_fishtype.getItem(function (item) { //获取配置表数据
            if (item.key == fishDataID) {
                return item;
            }
        });

        if (fishCfg) {
            if (buffID == FishType.FishBuff.TypeBomb) {//同类炸弹
                fishes = this.createJiGuangAct(fishCfg.effe_cts, fishBombPos, function (fish) {
                    return fish.m_dataId == fishCfg.fish_platter;
                });
                if (fishes.length > 0) {
                    this.fishHit(bulletID, buffID, fishes, userId);//发送同类被击中鱼数据
                }
            } else if (buffID == FishType.FishBuff.CatchAll) {//一网打尽
                fishes = this.createJiGuangAct(fishCfg.effe_cts, fishBombPos);
                if (fishes.length > 0) {
                    this.fishHit(bulletID, buffID, fishes, userId);
                    for (var v of fishes) {
                        this.m_mainUI.createFishNetEffect(v.pos, playerData.betDataid);//创建网
                    }
                }
            } else if (buffID == FishType.FishBuff.EnergyBomb) {//能量弹
                var player = playerManager.findPlayerByUserPos(nSite);
                if (player) {
                    var playerData = player.getPlayerGameInfo(); //获取游戏数据
                    playerData.buff_id = buffID;
                    playerData.buff_end_time = new Date().getTime() + 20 * 1000; //buff结束时间
                }
            } else if (buffID == FishType.FishBuff.ScreenBomb) {//全屏炸弹
                fishes = this.createJiGuangAct(fishCfg.effe_cts, fishBombPos);
                if (fishes.length > 0) {
                    this.fishHit(bulletID, buffID, fishes, userId);
                }
            } else if (buffID == FishType.FishBuff.AreaBomb) {//局部炸弹
                fishes = this.createJiGuangAct(fishCfg.effe_cts, fishBombPos, function (fish, fishPos) {
                    if (getLength(fishPos.sub(fishBombPos)) < FishType.AreaBombDis) {
                        return true;
                    } else
                        return false;
                });
                if (fishes.length > 0) {
                    this.fishHit(bulletID, buffID, fishes, userId);
                }
            }
        }
        return fishes;
    },

    getFishBufRelation: function (fish, buffID) {//获取关联的buff鱼
        var fishCfg = fish.m_dataCfg
        var fishBombPos = fish.getCenterPosInPool()
        var fishes = [];
        if (buffID == FishType.FishBuff.TypeBomb)
            //同类炸弹
            fishes = this.getFishRelation(fishBombPos, function (fish) { return (parseInt(fish.m_dataId) == fishCfg.fish_platter && !fish.IsEnd()) })
        else if (buffID == FishType.FishBuff.CatchAll)
            // 一网打尽
            fishes = this.getFishRelation(fishBombPos);
        else if (buffID == FishType.FishBuff.AreaBomb)
            //局部炸弹
            fishes = this.getFishRelation(fishBombPos, function (fish, fishPos) {
                if (getLength(fishPos.sub(fishBombPos)) < FishType.AreaBombDis)
                    return true
                else
                    return false
            })
        else if (buffID == FishType.FishBuff.ScreenBomb)
            //全屏炸弹
            fishes = this.getFishRelation(fishBombPos)

        return fishes
    },

    showBulletCoinEffect: function (userId, bullet, bullet_id, items) {//击中金币
        var player = playerManager.findPlayerByUserId(userId); //查找玩家
        if (player == null) {
            cc.log('玩家不存在，在原位置显示showBulletCoinEffect');
            // return;
        }
        var playerData = player.getPlayerGameInfo();//获取游戏数据
        if (playerData == null) {
            cc.log('玩家数据不存在，在原位置显示showBulletCoinEffect');
            // return;
        }
        var hitFish = bullet.hitFishs;
        var totalGoldNum = 0;
        // var totalSrcCoinNum = 0;
        for (var fish of hitFish) {
            if (fish.worldPos && fish.goldDisplay != '')
                this.m_mainUI.showGoldNum(fish.worldPos, fish.goldDisplay, userId); //金币值显示
            totalGoldNum += fish.win_gold;
            // totalSrcCoinNum += (fish.fish_bet_times>=50?(fish.fish_bet_times*2 ): fish.fish_bet_times); //总倍率

            //播放金币音效
            var fishCfg = data_fishtype.getItem(function (item) { //获取配置表数据
                if (item.key == fish.dataID) {
                    return item;
                }
            });
            if (userId == cc.dd.user.id) {
                if (fishCfg.fish_mtp_power < 1000) {
                    this.playAudio(38);
                } else {
                    this.playAudio(39);
                }
            }


        }
        if (playerData)
            playerData.foldCoinNum += totalGoldNum; //堆叠金币值 


        var info = {
            userId: userId,
            // totalSrcCoinNum : totalSrcCoinNum,
            hitFish: hitFish,
            totalGoldNum: totalGoldNum,
            pos: bullet.pos,
            items: items,
        }
        this.m_mainUI.showCoin(info); //鱼池金币倍率显示


        // playerData.coin = playerData.coin + totalGoldNum * this.getRoomRate();
        if (playerData)
            playerData.foldCoinNum -= totalGoldNum;


    },


    getRoomRate: function () {
        return this.m_tGameRoomCfg ? this.m_tGameRoomCfg.coin_times : 0;

    },

    /////////////////////////////////////////////////////////////////////////////鱼创建相关end////////////////////////////////////////

    ///////////////////////////////////////////////////逻辑begin/////////////////////////////////////////////
    setLockFish: function (nSite, lockFishId) {//锁定鱼
        var player = playerManager.findPlayerByUserPos(nSite);//查找玩家
        if (player) {
            var playerData = player.getPlayerGameInfo();//获得游戏数据
            if (playerData == null)
                return;
            if (playerData.lockFishID == lockFishId)//锁定鱼一样
                return;
            var oldLockFish = this.getFish(playerData.lockFishID); //获取锁定都鱼
            if (oldLockFish) {
                oldLockFish.setLock(nSite, false); //解锁掉锁定鱼都标记
            }

            playerData.lockFishID = lockFishId; //修改新都锁定鱼id
            var lockFish = this.getFish(lockFishId); //获取锁定都鱼
            if (lockFish) {
                lockFish.setLock(nSite, true); //显示锁定鱼都标记
                var fishCfg = lockFish.m_dataCfg;
                // nSite = this.toSeverSite(nSite);
                this.m_mainUI.setLockFish(nSite, fishCfg); //显示锁定鱼都动画
            }
        }
    },

    getHitFish: function (worldPos) {//根据坐标点确认是否有鱼被选中
        for (var fish of this.m_tFishObj) {
            if (fish.IsEnd() == false && fish.isHit(worldPos)) { //鱼动画未结束，并且被选中
                return fish;
            }
        }
        return null;
    },

    Bet: function (dir, fishID) {//创建子弹
        if (dir == null) {
            dir = g_paoTaiStartDir[this.m_nSite];
        }


        var own = playerManager.findPlayerByUserId(cc.dd.user.id); //获取自己的数据
        if (own) {
            var playerData = own.getPlayerGameInfo(); //获取游戏数据
            if (playerData) {
                playerData.betDir = dir; //设置自己的子弹方向;

                if (this.getMyBulletNums() > FishType.MAX_BULLET) { //判定屏幕中子弹数量是否太多
                    cc.log('子弹太多,创建不了子弹');
                    this.setLockFish(this.m_nSite, -1);
                    cc.dd.PromptBoxUtil.show('炮弹达到上限', null, 1);
                    return;
                }
                var nowGold = this.getPlayerBet();//this.m_tGameRoomCfg.coin_times*
                if (playerData.coin < nowGold) {//身上金币少于下注值
                    this.playAudio(6, false, 1);
                    this.setLockFish(this.m_nSite, -1);
                    this.m_mainUI.stopGuaJi();
                    cc.dd.PromptBoxUtil.show('金币不足', null, 1);
                    this.m_mainUI.showChargeGold();
                    cc.log('金币不足,创建不了子弹');
                    return;
                }

                this.setLockFish(this.m_nSite, fishID);

                var bBow = (10060 == this.m_currentGunId); //是否为诸葛连弩
                var lockFish = this.getFish(fishID); //获取锁定都鱼

                if (bBow)//生成5发子弹
                {
                    var startDir = lockFish ? dir : (dir - 0.26 * 2);
                    var siteIndex = own.getPlayerCommonInfo().pos;
                    var bulletPos = this.getBulletPos(siteIndex - 1);//this.toSeverSite(siteIndex) - 1);
                    var bowInitPosX = bulletPos.x - 3 * FishType.bowLockOffX;
                    var bowInitPosY = 0;
                    for (var i = 0; i < 5; i++) {
                        var tempDir = lockFish ? dir : (startDir + i * 0.26)
                        var serverDir = this.toSeverDir(tempDir) * 10000; //服务器弧度方向
                        var bulletId = this.toSeverSite(this.m_nSite) * 100000000 + this.m_nBulletIndex; //子弹id
                        this.m_nBulletIndex += 1;
                        this.m_nBulletIndex = this.m_nBulletIndex % 10000000;
                        fishSender.bulletBetSender(bulletId, serverDir, fishID, i != 2);

                        if (lockFish) {

                            // var angle = tempDir - (defaultBetDir[siteIndex - 1]<0?Math.PI*3 / 2:defaultBetDir[siteIndex - 1]);
                            // 360-defaultBetDir[siteIndex - 1]/Math.PI*180
                            if (i < 3) {
                                bowInitPosX = bulletPos.x - FishType.bowLockOffX * Math.cos(tempDir - Math.PI / 2) * (2 - i);//偏移像素
                                bowInitPosY = bulletPos.y - FishType.bowLockOffX * Math.sin(tempDir - Math.PI / 2) * (2 - i);
                            } else {
                                bowInitPosY = bulletPos.y + FishType.bowLockOffX * Math.sin(tempDir - Math.PI / 2) * (i - 3);
                                bowInitPosX = bulletPos.x + FishType.bowLockOffX * Math.cos(tempDir - Math.PI / 2) * (i - 3);//偏移像素
                            }
                        }

                        //客户端座位号以1起始的

                        var bulletNode = Cbullet.createBullet(bulletId, cc.v2(lockFish ? bowInitPosX : bulletPos.x, lockFish ? bowInitPosY : bulletPos.y), tempDir/*this.toSeverDir(tempDir)*/, fishID, siteIndex, playerData.buff_id > 0, playerData.buff2_id, playerData.betDataid);//创建子弹

                        if (bulletNode) {
                            var bulletInfo = {
                                obj: bulletNode,
                                nSite: siteIndex,
                                startTime: new Date().getTime(),
                                isBot: false,
                                buffId: playerData.buff2_id,
                                bet_times: playerData.bet,
                                bulletId: bulletId,
                                userId: own.userId,
                            }
                            this.m_tBulletObj.push(bulletInfo);
                            this.m_mainUI.m_oFishPoolBg.addChild(bulletNode.node); //将子弹添加到鱼池节点

                        }
                    }

                    this.m_mainUI.updateOnePlayerBet(siteIndex, playerData.coin, dir);
                    this.m_mainUI.paoTaiMoveAct(siteIndex - 1, dir);
                    this.playAudio((8 + this.m_currentGunId - 10057), false, 0.6);
                } else {
                    var serverDir = this.toSeverDir(dir) * 10000; //服务器弧度方向
                    var bulletId = this.toSeverSite(this.m_nSite) * 100000000 + this.m_nBulletIndex; //子弹id
                    this.m_nBulletIndex += 1;
                    this.m_nBulletIndex = this.m_nBulletIndex % 10000000;
                    fishSender.bulletBetSender(bulletId, serverDir, fishID);

                    var siteIndex = own.getPlayerCommonInfo().pos;
                    var bulletPos = this.getBulletPos(siteIndex - 1);//this.toSeverSite(siteIndex) - 1);//客户端座位号以1起始的
                    var bulletNode = Cbullet.createBullet(bulletId, bulletPos, dir/*this.toSeverDir(dir)*/, fishID, siteIndex, playerData.buff_id > 0, playerData.buff2_id, playerData.betDataid);//创建子弹

                    if (bulletNode) {
                        var bulletInfo = {
                            obj: bulletNode,
                            nSite: siteIndex,
                            startTime: new Date().getTime(),
                            isBot: false,
                            buffId: playerData.buff2_id,
                            bet_times: playerData.bet,
                            bulletId: bulletId,
                            userId: own.userId,
                        }
                        this.m_tBulletObj.push(bulletInfo);
                        this.m_mainUI.m_oFishPoolBg.addChild(bulletNode.node); //将子弹添加到鱼池节点
                        this.m_mainUI.updateOnePlayerBet(siteIndex, playerData.coin, dir);
                        this.m_mainUI.paoTaiMoveAct(siteIndex - 1, dir);
                    }
                    this.playAudio(this.m_currentGunId > 10057 ? (8 + this.m_currentGunId - 10057) : 8, false, 0.6);
                }
            }
        }
    },

    on_fish_bet: function (msg) {//创建子弹

        var botBullet = (msg.dir == botLockDir || msg.dir == botUnLockDir);

        if (msg.userId != cc.dd.user.id && msg.type != -1 && botBullet) {//判定空炮子弹
            var fish = this.getFish(msg.type);
            if (fish == null) {
                cc.log('没查找到鱼，空炮');
                fishSender.fishHitSender(msg.bulletId, 0, null, msg.userId); //发送击中鱼消息
                return;
            }
            var fishInfo = this.getFishToLock(msg.type);
            if (fishInfo == null) {
                cc.log('屏幕外的鱼，空炮');
                fishSender.fishHitSender(msg.bulletId, 0, null, msg.userId); //发送击中鱼消息
                return;
            }
        }

        if (!botBullet && msg.isSubBullet) {
            cc.log('弓箭子子弹');
            return;
        }


        if (msg.userId == cc.dd.user.id) {
            if (msg.retCode == -1) {
                this.playAudio(6, false, 1);
                this.setLockFish(this.m_nSite, -1);
                this.m_mainUI.stopGuaJi();
                this.m_mainUI.showChargeGold();
                cc.dd.PromptBoxUtil.show('金币不足', null, 1);
            }
        } else {
            if (this.checkBulletExistence(msg.bulletId)) {
                cc.log('重复的子弹id');
                return
            }
        }

        var bulletDir = this.toClientDir(msg.dir / 10000); //子弹弧度

        var player = playerManager.findPlayerByUserId(msg.userId);//获取玩家
        if (player) {
            var playerData = player.getPlayerGameInfo(); //获取游戏数据
            if (playerData) {
                playerData.coin = msg.coin * this.getRoomRate(); //玩家金币更新
                playerData.bulletBetTime = new Date().getTime();

                var siteIndex = player.getPlayerCommonInfo().pos; //座位号
                var fishID = msg.type;
                var bulletPos = this.getBulletPos(siteIndex - 1);//this.toSeverSite(siteIndex) - 1);//客户端座位号以1起始的

                if (msg.userId != cc.dd.user.id) {//不是玩家自己
                    var fishInfo = null;
                    if (fishID > 0) {
                        fishInfo = this.getFishToLock(fishID); //获取锁定鱼信息
                    }

                    if (fishInfo) {
                        var fish = fishInfo.fish;
                        var fishPos = fishInfo.fishPos;
                        if (fish == null || msg.dir == botUnLockDir)
                            fishID = -1;
                        if (fish)
                            bulletDir = this.m_mainUI.paoTaiFaceTo(siteIndex - 1, fishPos);
                        else if (botBullet || bulletDir == 0) {
                            bulletDir = playerData.betDir + Math.random() * Math.PI / 8 - Math.PI / 16;
                            bulletDir = Math.max(defaultBetDir[siteIndex - 1] - Math.PI / 3, bulletDir)
                            bulletDir = Math.min(defaultBetDir[siteIndex - 1] + Math.PI / 3, bulletDir)
                        }
                        playerData.betDir = bulletDir;
                        this.setLockFish(siteIndex, fishID);
                    } else {
                        if (botBullet || bulletDir == 0) {
                            if (playerData.lastAimFish == null) {
                                var fish = this.checkFishCanLock();
                                if (fish) {
                                    var fishPos = fish.getCenterPosInWorld();
                                    bulletDir = this.m_mainUI.paoTaiFaceTo(siteIndex - 1, fishPos);
                                    playerData.lastAimFish = fish;
                                } else {

                                    // bulletDir = defaultBetDir[siteIndex - 1] + Math.PI / 3  - Math.random() * Math.PI *2/3;                                        

                                    bulletDir = playerData.betDir + Math.random() * Math.PI / 8 - Math.PI / 16;
                                    bulletDir = Math.max(defaultBetDir[siteIndex - 1] - Math.PI / 3, bulletDir)
                                    bulletDir = Math.min(defaultBetDir[siteIndex - 1] + Math.PI / 3, bulletDir)
                                }
                            } else {
                                var fish = this.getFish(playerData.lastAimFish.m_fishID)
                                if (fish) {
                                    var fishPos = fish.getCenterPosInWorld();
                                    bulletDir = this.m_mainUI.paoTaiFaceTo(siteIndex - 1, fishPos);
                                } else {
                                    var fish = this.checkFishCanLock();
                                    if (fish) {
                                        var fishPos = fish.getCenterPosInWorld();
                                        bulletDir = this.m_mainUI.paoTaiFaceTo(siteIndex - 1, fishPos);
                                        playerData.lastAimFish = fish;
                                    } else {
                                        // bulletDir = defaultBetDir[siteIndex - 1] + Math.PI / 3  - Math.random() * Math.PI *2/3;                                        
                                        bulletDir = playerData.betDir + Math.random() * Math.PI / 8 - Math.PI / 16;
                                        bulletDir = Math.max(defaultBetDir[siteIndex - 1] - Math.PI / 3, bulletDir)
                                        bulletDir = Math.min(defaultBetDir[siteIndex - 1] + Math.PI / 3, bulletDir)
                                    }
                                }
                            }


                        }
                        playerData.betDir = bulletDir;
                        this.setLockFish(siteIndex, -1);
                    }


                    var bBow = (10060 == playerData.betDataid); //是否为诸葛连弩
                    var lockFish = this.getFish(fishID); //获取锁定都鱼


                    if (bBow)//生成5发子弹
                    {
                        var startDir = lockFish ? bulletDir : (bulletDir - 0.26 * 2);
                        var siteIndex = player.getPlayerCommonInfo().pos;
                        var bulletPos = this.getBulletPos(siteIndex - 1);//this.toSeverSite(siteIndex) - 1);
                        var bowInitPosX = bulletPos.x - 3 * FishType.bowLockOffX;
                        var bowInitPosY = 0;
                        var bowInitPosX = bulletPos.x - 2 * FishType.bowLockOffX;

                        for (var i = 0; i < 5; i++) {
                            var tempDir = lockFish ? bulletDir : (startDir + i * 0.26)
                            if (lockFish) {

                                // var angle = tempDir - (defaultBetDir[siteIndex - 1]<0?Math.PI*3 / 2:defaultBetDir[siteIndex - 1]);
                                // 360-defaultBetDir[siteIndex - 1]/Math.PI*180
                                if (i < 3) {
                                    bowInitPosX = bulletPos.x - FishType.bowLockOffX * Math.cos(tempDir - Math.PI / 2) * (2 - i);//偏移像素
                                    bowInitPosY = bulletPos.y - FishType.bowLockOffX * Math.sin(tempDir - Math.PI / 2) * (2 - i);
                                } else {
                                    bowInitPosY = bulletPos.y + FishType.bowLockOffX * Math.sin(tempDir - Math.PI / 2) * (i - 3);
                                    bowInitPosX = bulletPos.x + FishType.bowLockOffX * Math.cos(tempDir - Math.PI / 2) * (i - 3);//偏移像素
                                }
                            }
                            var bBowBulletId = botBullet ? (msg.bulletId + i) : (msg.bulletId - 2 + i);
                            var bulletNode = Cbullet.createBullet(bBowBulletId, cc.v2(lockFish ? bowInitPosX : bulletPos.x, lockFish ? bowInitPosY : bulletPos.y), tempDir/*this.toSeverDir(tempDir)*/, fishID, siteIndex, playerData.buff_id > 0, playerData.buff2_id, playerData.betDataid);//创建子弹

                            if (bulletNode) {
                                var bulletInfo = {
                                    obj: bulletNode,
                                    nSite: siteIndex,
                                    startTime: new Date().getTime(),
                                    isBot: botBullet,
                                    buffId: playerData.buff2_id,
                                    bet_times: playerData.bet,
                                    bulletId: bBowBulletId,
                                    userId: msg.userId,
                                }

                                this.m_tBulletObj.push(bulletInfo);
                                this.m_mainUI.m_oFishPoolBg.addChild(bulletNode.node); //将子弹添加到鱼池节点
                            }
                        }
                        this.m_mainUI.paoTaiMoveAct(siteIndex - 1, bulletDir);

                    } else {
                        var bulletNode = Cbullet.createBullet(msg.bulletId, bulletPos, bulletDir/*this.toSeverDir(bulletDir)*/, fishID, siteIndex, playerData.buff_id > 0, playerData.buff2_id, playerData.betDataid);//创建子弹

                        if (bulletNode) {
                            var bulletInfo = {
                                obj: bulletNode,
                                nSite: siteIndex,
                                startTime: new Date().getTime(),
                                isBot: botBullet,
                                buffId: playerData.buff2_id,
                                bet_times: playerData.bet,
                                bulletId: msg.bulletId,
                                userId: msg.userId,
                            }
                            this.m_tBulletObj.push(bulletInfo);
                            this.m_mainUI.m_oFishPoolBg.addChild(bulletNode.node); //将子弹添加到鱼池节点
                            this.m_mainUI.paoTaiMoveAct(siteIndex - 1, bulletDir);
                        }
                    }

                    // this.playAudio(this.m_currentGunId >10057? (8 + this.m_currentGunId - 10057):8, false, 0.6);

                } else
                    bulletDir = playerData.betDir;
                this.m_mainUI.updateOnePlayerBet(siteIndex, playerData.coin, bulletDir);
            }
        }
    },

    onBulletHitFish: function (bulletId, fishId) {//击中鱼
        var bullet = this.getBullet(bulletId);
        if (bullet && bullet.obj) {

            if (bullet.obj.m_nLockFishID && bullet.obj.m_nLockFishID > 0 && bullet.obj.m_nLockFishID != fishId) {//锁定的鱼不是击中的鱼
                var player = playerManager.findPlayerByUserPos(bullet.nSite);
                if (player) {
                    var playerData = player.getPlayerGameInfo();//获得游戏数据
                    if (playerData && playerData.lockFishID != bullet.obj.m_nLockFishID) {
                        bullet.obj.m_nLockFishID = playerData.lockFishID;
                    } else {
                        var lockFishExsit = this.getFish(bullet.obj.m_nLockFishID);
                        if (lockFishExsit) {
                            return;
                        }
                    }

                } else {
                    bullet.obj.onDestory();
                    bullet.obj = null;
                    return;
                }
            }

            var fishHit = this.getFish(fishId);
            if (fishHit == null) {
                cc.log('没有查找到鱼' + fishId);
                return;
            }

            bullet.pos = bullet.obj.node.getPosition();
            if (bullet.nSite == this.m_nSite || bullet.isBot) {
                var fishHitList = [
                    {
                        fish: fishHit,
                        pos: bullet.pos,
                    }
                ]

                fishHit.onHitBullet(bullet.nSite == this.m_nSite);
                this.fishHit(bulletId, 0, fishHitList, bullet.userId);
            } else {
                fishHit.onHitBullet(bullet.nSite == this.m_nSite);
                bullet.obj.onDestory();
                bullet.obj = null;
            }

        }
    },

    fishHit: function (bulletId, buffId, fishes, userId) {//击中鱼,消息发送
        var fishesTemp = [];
        for (var v of fishes) {
            var relation = [];
            var bufflist = v.fish.m_dataCfg.fish_buff.split(',');
            bufflist.splice(bufflist.length - 1, 1);
            for (var buffInfo of bufflist) {
                var buff = parseInt(buffInfo); //buffid
                if (buff) {
                    var relationTmp = this.getFishBufRelation(v.fish, buff); //关联鱼
                    if (relationTmp) {
                        for (var relFish of relationTmp) {
                            relation.push(relFish.fish.m_fishID);
                        }
                    }
                }
            }
            var high = Math.ceil(v.pos.x);
            high = high > 0 ? (high * 10000) : (10000000 + Math.abs(high) * 10000);
            var low = Math.ceil(v.pos.y);
            low = low > 0 ? low : (1000 + Math.abs(low));
            var posEdn = high + low;
            fishesTemp.push(
                {
                    fishId: v.fish.m_fishID,
                    pos: posEdn,
                    relationList: relation,
                }

            )
        }
        fishSender.fishHitSender(bulletId, buffId, fishesTemp, userId); //发送击中鱼消息
        var bullet = this.getBullet(bulletId);//获取子弹;
        if (bullet == null) {
            return
        }
        if (bullet.obj) {
            bullet.obj.onDestory();
            bullet.obj = null;
        }
    },

    on_msg_fish_hit_2c: function (msg) {//击中鱼

        var player = playerManager.findPlayerByUserId(msg.userId);
        if (player == null) {
            cc.log('未找到打死该鱼玩家');
            // return; //在原座位显示打死效果
        } else {
            var playerData = player.getPlayerGameInfo();
            if (playerData == null)
                return;
            playerData.coin = msg.coin * this.getRoomRate();
            var cInfo = player.getPlayerCommonInfo();
            this.m_mainUI.updateOnePlayerGold(cInfo.pos);
        }



        var bullet = this.getBullet(msg.bulletId);//获取子弹;
        var bHitByBullet = true;
        if (bullet == null) {
            cc.log("FishManager:on_msg_fish_hit_2c erro:", msg.bulletId)
            bullet = {};
            // return //在原座位显示打死效果
        }


        bHitByBullet = (bullet.hitFishs == null);
        if (bullet.obj) {//判定子弹体是否存在
            bullet.pos = bullet.obj.node.getPosition();
            bullet.obj.onDestory(); //销毁子弹节点
            bullet.obj = null;
        }

        bullet.hitFishs = bullet.hitFishs || []; //保存击中鱼的数组


        // var buffHitFishes =0;
        // var roomCfg = 
        var items = [];//掉落物品列表
        for (var v of msg.fishsList) {
            if (v.hit != 1) {//未打死
                var fish = this.getFish(v.fishId) //获取鱼
                if (fish) {
                    fish.onHitBullet(msg.userId == cc.dd.user.id);
                }
            } else {//打死鱼
                var fishInfo = {};
                fishInfo.fish_bet_times = v.fishTimes;//*(v.betTimes>1?v.betTimes:1); //打鱼倍率
                fishInfo.win_gold = v.win;//
                fishInfo.goldDisplay = ':' + v.fishTimes * this.getRoomRate() + (v.betTimes > 1 ? (';' + v.betTimes) : '');// //打鱼获取的金币
                fishInfo.dropItem = v.itemDataId
                if (v.itemDataId == 1004) {
                    fishInfo.goldDisplay = '';
                    cc.log("hit redbag")
                }
                if (msg.userId == cc.dd.user.id)//自己打中了
                    this.m_nGetFen += v.win; //玩家获取的分数值
                var fish = this.getFish(v.fishId); //打死的鱼
                if (fish) {
                    fishInfo.worldPos = fish.getCenterPosInPool(); //获取鱼的坐标点
                    fishInfo.dataID = fish.m_dataId;
                    fishInfo.size = fish.getFishSize();
                    if (msg.userId == cc.dd.user.id) {
                        var curNum = this.getFishResult(fish.m_dataId); //获取当前同种鱼有多少数量
                        var resultInfo = {
                            fishDataId: fish.m_dataId,
                            curNum: curNum + 1,
                        }
                        this.m_tFishResult.push(resultInfo); //保存玩家自己打中的鱼的数量
                    }
                    //fish.playDieEffect(); //播放死亡特殊动画
                    fish.onDie(bHitByBullet && (msg.userId == cc.dd.user.id)); //死亡动画
                    // fish.onDestory();
                    this.deleteFishDataInArry(v.fishId);//删除数据


                    if (v.buffId > 0) {
                        //生成buff
                        var fishes = this.createFishBuff(msg.userId, fishInfo.dataID, fishInfo.worldPos, bullet.m_bThree, msg.bulletId, v.buffId); //创建buff鱼
                        // if (fishes) {
                        //     buffHitFishes = buffHitFishes + fishes.length;
                        // }
                    }

                    if (fishInfo.win_gold || fishInfo.dropItem) {
                        bullet.hitFishs.push(fishInfo);
                    }

                }
            }
        }

        if (bullet.hitFishs.length > 0) {
            //生成金币动画
            this.showBulletCoinEffect(msg.userId, bullet, msg.bulletId, items);
            bullet.hitFishs = [];
        }
    },

    on_reconnect_syn_fish: function (fishList) {
        for (var i = 0; i < fishList.length; i++) {
            var pathCfg = data_fishpath.getItem(function (item) {
                if (item.key == fishList[i].pathId)
                    return item;
            });
            if (pathCfg == null) {
                cc.log('无效鱼路径===========' + fishList[i].pathId);
                return;
            }

            var fishCount = fishList[i].fishIdsList.length; //鱼的总数
            if (fishList[i].fishDataId > 19) {
                cc.log('无效鱼' + fishList[i].fishDataId);
                return;
            }

            if (fishList[i].form == 1) {//鱼路径生成类型
                this.createLineForm(fishList[i]);
            }

        }

    },

    on_msg_fish_appear: function (msg) {//生成鱼
        var pathCfg = data_fishpath.getItem(function (item) {
            if (item.key == msg.pathId)
                return item;
        });
        if (pathCfg == null) {
            cc.log('无效鱼路径===========' + msg.pathId);
            return;
        }

        if (this.m_bCaoXi) {
            this.m_bCaoXi = false;
            this.m_mainUI.onCaoXiEnd();//结束潮汐
        }

        var fishCount = msg.fishIdsList.length; //鱼的总数
        if (msg.fishDataId > 19) {
            cc.log('无效鱼' + msg.fishDataId);
            return;
        }

        if (msg.form == 1) {//鱼路径生成类型
            this.createLineForm(msg);
        }

        // else if(msg.form == 2){//随机散型鱼
        //     var randomDis = Math.sqrt(fishCount) * 100;
        //     var k = 0
        //     for(var v of msg.fishIdsList){
        //         var pos = cc.v2(parseInt(Math.random() * randomDis, 10) + 1, parseInt(Math.random() * randomDis, 10) + 1);//随机生成位置点
        //         this.createFish(v.fishid, msg.fishDataId, msg.pathId, pos, null) //创建鱼
        //         k++;
        //     }
        // }else{
        //         var fishArrayCfg = data_fisharraymin.getItem(function(item){//获取配置表数据
        //             if (item.key == msg.form) {
        //                 return item;
        //             }
        //         });
        //         var posList = fishArrayCfg.sharp.split(';');
        //         var index = 0;
        //         for(var v of msg.fishIdsList){
        //             var posX = posList[index].split(',')[0];
        //             var posY = posList[index].split(',')[1];
        //             var pos = cc.v2(parseInt(posX), parseInt(posY));
        //             this.createFish(v.fishid, msg.fishDataId, msg.pathId, pos, null) //创建鱼
        //             index++;
        //         }

        // } 
    },

    on_msg_fish_clean: function () {//清理鱼
        for (var fish of this.m_tFishObj) {
            fish.onCleanMove(); //鱼自我清理
        }

        this.m_mainUI.showCaoXi(); //显示潮汐
        this.m_bCaoXi = true;
    },


    on_reconnect_syn_array: function (arrayList) {
        for (var i = 0; i < arrayList.length; i++) {
            this.on_msg_fish_arry(arrayList[i]);
        }
    },

    on_msg_fish_arry: function (msg) {//鱼阵
        var fishArrayCfg = data_fisharraymin.getItem(function (item) {//获取配置表数据
            if (item.key == msg.id) {
                return item;
            }
        });

        var birthPlacePos = null;
        if (msg.pos > 0) {
            var posx = 0;
            var posy = 0;
            if (msg.pos > 10000000)
                posx = -Math.ceil((msg.pos % 10000000 / 10000));
            else
                posx = Math.ceil(msg.pos / 10000);
            if (msg.pos % 10000 > 1000)
                posy = -(msg.pos % 1000)
            else
                posy = msg.pos % 1000;
            birthPlacePos = cc.v2(posx, posy);
        } else {
            var birthplace = fishArrayCfg.birthplace.split(',');
            var birthPlacePos = cc.v2(parseFloat(birthplace[0]), parseFloat(birthplace[1])); //初始点坐标
        }

        var fishIndex = 0;
        var sharpList = fishArrayCfg.sharp.split(';');
        sharpList.splice(sharpList.length - 1, 1);
        // for(var k = 0; k < sharpList.length; k++){
        if (sharpList.length <= 0)
            return;

        for (var k = 0; k < sharpList.length; k++) {
            var data = sharpList[k];
            if (data) {
                var fishInfo = data.split(',');
                var dataID = fishInfo[3];//鱼的配置表id
                if (dataID > 0) {
                    if (fishIndex < msg.fishIdsList.length) {
                        var fishId = msg.fishIdsList[fishIndex].fishid;
                        var delay = msg.fishIdsList[fishIndex].dValue;
                        if (this.checkFishExistence(fishId)) {
                            cc.log('鱼阵出现重复的鱼');
                            continue;
                        }
                        var fish = CFish.createFishEx(fishId, dataID, fishArrayCfg, k, null, birthPlacePos, this.m_mainUI.getFishPoolNode(), delay); //创建鱼阵的鱼
                        if (fish != null) {
                            this.m_tFishObj.push(fish);
                            // fish.node.setLocalZOrder(parseInt(fishInfo[2]));
                            this.m_mainUI.getFishPoolNode().addChild(fish.node);//添加鱼到鱼池
                            cc.log('鱼阵创建' + fishId + ',x=' + fishInfo[0]);
                        } else
                            cc.log('鱼阵创建鱼失败' + msg.id + '鱼id' + fishId + '配置表id ' + dataID);


                    } else
                        cc.log('鱼阵鱼的数量不匹配')

                    fishIndex++;

                }
            }
        }
    },

    on_msg_fish_gold_return_2c: function (msg) {//金币返还
        var player = playerManager.findPlayerByUserId(msg.userId);
        if (player == null)
            return;
        var playerComData = player.getPlayerCommonInfo();
        if (playerComData == null)
            return;
        var playerData = player.getPlayerGameInfo();
        if (playerData == null)
            return;
        playerData.coin += (msg.coin * this.getRoomRate());
        this.m_mainUI.updateOnePlayerGold(playerComData.pos);
    },


    requestUseItem: function (type) {//1:冰冻, 2:瞄准镜
        fishSender.userItem(type);
    },

    on_msg_qka_fish_effect: function (msg) {//1:冰冻, 2:瞄准镜
        if (msg.type == 1)
            this.m_mainUI.startEffect(msg.type, true);
    },

    on_msg_qka_fish_use_item_ret: function (msg) {//金币返还
        if (msg.retCode == 0) {
            this.m_mainUI.startEffect(msg.type);
        }
    },

    quitGame: function () {
        fishSender.quitGame();//发送退出游戏消息
    },

    update: function (dt) {
        for (var k = this.m_tBulletObj.length - 1; k >= 0; k--) {//更新子弹状态
            var v = this.m_tBulletObj[k];
            var curTime = new Date().getTime();
            if (curTime - v.startTime > FishType.bulletMaxLiveTime) {//判断子弹是否消失
                if (v.obj) {
                    v.obj.onDestory(); //消失
                }
                this.m_tBulletObj.splice(k, 1);
            } else {
                if (v.obj)
                    v.obj.update(dt); //子弹路径更新
            }
        }

        for (var i = this.m_tFishObj.length - 1; i >= 0; i--) {//更新鱼状态
            var v = this.m_tFishObj[i];
            v.update(dt, this.m_bIceEffect);
            if (v.IsEnd()) {
                v.onDestory();
                v.onDie(false);
                this.m_tFishObj.splice(i, 1);
            }
        }

        var clientTime = new Date().getTime();
        for (var i = 1; i <= 6; i++) {
            var player = playerManager.findPlayerByUserPos(i);
            if (player) {
                var playerData = player.getPlayerGameInfo();
                if (playerData) {
                    var bulletLeftTime = (clientTime - playerData.bulletBetTime) / 1000;
                    if (i != this.m_nSite && bulletLeftTime > 2 && playerData.lockFishID > 0)
                        this.setLockFish(i, -1);

                    if (playerData.buff_end_time != null) {
                        var spaceTime = (clientTime - playerData.buff_end_time) / 1000;
                        this.m_mainUI.updatePlayerEnergyTime(i, spaceTime);
                        if (playerData.buff_end_time < clientTime) {
                            playerData.buff_id = 0;
                            playerData.buff_end_time = null;
                        }
                    }
                }
            }
        }

    },
    ///////////////////////////////////////////////////Demo逻辑end////////////////////////////////////////////


    clearAllData: function () {
        clearTimeout(this.createFishLineTime);
        for (var v of this.m_tFishObj) {//更新鱼状态
            v.m_bMoveEnd = true;
            v.onDestory();
            v.node.removeFromParent(true);
        }
        this.m_tFishObj.splice(0, this.m_tFishObj.length);

        for (var v of this.m_tBulletObj) {//更新子弹状态
            if (v.obj != null)
                v.obj.node.removeFromParent(true);
        }
        this.m_tBulletObj.splice(0, this.m_tBulletObj.length);
        this.m_mainUI = null;
        this.m_bFilp = false;
        this.m_nBulletIndex = 1;
        this.m_bCaoXi = false;
        this.m_bInit = false;

        this.m_myGuns = [];//我的所有炮台
        this.m_currentGunId = 10055;
        this.m_bIceEffect = false;
        this.m_bIsShowExchange = false;
    },


    reconnectClear: function () {
        clearTimeout(this.createFishLineTime);
        //清除玩家
        this.m_mainUI.clearAllPlayer();

        //清除鱼
        for (var v of this.m_tFishObj) {//更新鱼状态
            v.m_bMoveEnd = true;
            v.onDestory();
            v.node.removeFromParent(true);
        }
        this.m_tFishObj.splice(0, this.m_tFishObj.length);

        //清除子弹
        for (var v of this.m_tBulletObj) {
            if (v.obj != null)
                v.obj.node.removeFromParent(true);
        }
        this.m_tBulletObj.splice(0, this.m_tBulletObj.length);
    },

    //播放相应音效
    playAudio: function (audioId, isloop, volume) {
        AudioManager.setSoundVolume(volume ? volume : 1);
        var itemCfg = audioCfg.getItem(function (element) {
            if (element.key == audioId)
                return true;
        }.bind(this));

        if (itemCfg == null) {
            cc.log("wrong id!!!!!!!!" + audioId);
            return;
        }
        return AudioManager.playSound(FishType.fishAuidoPath + itemCfg.audio_name + '', isloop);
    },

    playBGMusic: function () {
        this.m_mainUI.playBGMusic();
    },

    on_msg_qka_sync_coin: function (msg) {
        this.m_mainUI.updatePlayerGold(msg);
    },
});


module.exports = {
    FishManager: FishManager
};