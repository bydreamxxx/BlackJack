/**
 * Created by shen on 2017/8/23.
 */

const Bsc_Type = cc.Enum({//比赛场类型
    JIN_JI: 1,       //晋级赛
});
const path = 'gameyj_mj/bsc/textures/bsc_dating/';

const Bsc_Info = [
    {//活动1
        Icon: path + 'bsc_saizhianniu_01_zc.png',
        BscType: Bsc_Type.JIN_JI,
        Bsc_gz: '[比赛规则,64倍封顶]\n' +
            '   本场比赛开始每人有1000初始积分。每次胡牌能获得积分。积分越高排名越高。' +
            '   预赛阶段玩家随机配桌，开局时同桌打一定局数，牌局结算时，根据积分获得排名，当前配桌积分靠前的名次可晋级下一轮。' +
            '   晋级的玩家可获得获得上一轮的一定比例的比赛积分。' +
            '   决赛阶段，最后4名玩家进行最后一轮比拼，根据积分高低进行最终排名，可获得对应排名奖励。'
    },
    {//活动2
        Icon: path + 'bsc_saizhianniu_02_zc.png',
        BscType: Bsc_Type.JIN_JI + 1,
    },
    {//活动3
        Icon: path + 'bsc_saizhianniu_03_zc.png',
        BscType: Bsc_Type.JIN_JI + 2,

    }

]


module.exports = {
    Bsc_Info: Bsc_Info,
    Bsc_Type: Bsc_Type,
};