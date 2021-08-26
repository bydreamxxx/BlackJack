// create by wj 2019/09/18
const size = cc.winSize;
var FishTypeCfg = {
    BulletMaxCnt: 100, //屏幕最多子弹量
    qiPaoOffset: 150, //锁定气泡动画偏移量
    dieActSpaceTime: 0.1, //鱼死亡延迟表现时间
    dieActTime: 1, //鱼死亡表现时间
    bulletMaxLiveTime: 30000, //子弹持续时间，毫秒
    autoBetSpaceTime: 0.2, //子弹生成间隔
    hitFishActTime: 0.5,//击中效果表现
    hitFishColor: cc.color(255, 0, 0),
    qiPaoMax: 20, //气泡个数
    qiPaoDistance: 100, //气泡偏移量
    qiPaoScale: { min: 0.4, max: 1.2 },
    AreaBombDis: 400,
    jiGuangActTime: 2,

    shakeRate: 15, //震动频率每秒
    shakeReduce: 0.2, //每秒震动衰减一半

    coinStopActTime: 0.8,
    coinMoveActTime: 0.2,
    foldStartDis: 150,
    caoXiActTime: 3.5,
    coinFoldSpaceTime: 0.05,
    coinFoldStopTime: 1,

    ZorderInPool: { //在鱼池中资源层级
        effect: -1,
        fish: 0,
        bullet: 1,
    },

    ZorderInRoot: { //相对根节点的层级
        bg: -2,
        qiPao: 5,
        ui: 0,
        goldNum: 1,
        coin: 2,
        bingo: 3,
    },

    FishBuff: {//鱼的buff类型
        None: 0,
        TypeBomb: 1,
        CatchAll: 2,
        EnergyBomb: 3,
        AreaBomb: 4,
        ScreenBomb: 5,
        Stop_All_Bomb: 6,//定屏炸弹
        Burst_Bomb: 7, //爆裂炸弹
        Frozen_Bomb: 8, //冰冻炸弹
        Stop_One_Bomb: 9,//定身炸弹
        Luck_Bomb: 10,//幸运炸弹
    },

    foldStartPos: [
        [cc.v2(-30, -20), -50, 10],
        [cc.v2(-30, 20), -50, -10],
        [cc.v2(30, 20), 50, -10],
        [cc.v2(30, -20), 50, 10]
    ],

    fishAuidoPath: 'gameyj_fish/audios/',
}

module.exports = FishTypeCfg;

