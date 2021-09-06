// create by wj 2019/12/3
var WestwardJourneyGameType = {
    GameSate: {
        WaitGame: 0, //等待开始
        BetGame: 1, //下注
        OpenGame: 2, //开奖
        ResultGame: 3, //结果
    },

    GameRunState: {
        RunBegin: 0, //开始跑
        RunUniformSpeed: 1, //匀速跑
        RunSubSpeed: 2, //减速跑
        RunEnd: 3, //结束
        RunDefault: 4, //默认值
        ReverseRunBegin: 5, //反向转开始
        ReverseRun: 6, //反向转
        ReverseRunEnd: 7,//再转停止
    },

    GameTimeControl: {
        AddSpeedTotalTime: 1, //加速总时长，
        AddSpeedStep: 7, //加速过几格,
        RunUniformTotalTime: 1, //匀速跑时间
        RunUniformCircle: 2, //加速跑预估总的圈速
        SubRunTotalTime: 1, //减速跑总时长
        SubRunCricle: 1, //减速跑预估圈数
        EndRunTotalTime: 1.5, //停下来时长
        ReverseSpeedSetp: 6,//再次跑闪光格子
    },
}

var IconConfg = {
    items:
        [
            { id: 1, name: '猪八戒', icon: 'headIcon0', bigIcon: 'zhubajie', roleDesc: 'role_0', pay: 6, type: 0, audioId: 16, indexList: [1, 19, 23] },
            { id: 2, name: '唐僧', icon: 'headIcon1', bigIcon: 'tangseng', roleDesc: 'role_1', pay: 8, type: 0, audioId: 15, indexList: [2, 20, 24] },
            { id: 3, name: '齐天大圣', icon: 'headIcon2', bigIcon: 'fqzs_icon_da_08', roleDesc: 'role_2', pay: -1, type: 2, audioId: 0, indexList: [18] },
            { id: 4, name: '白晶晶', icon: 'headIcon3', bigIcon: 'baijingjing', roleDesc: 'role_3', pay: 8, type: 1, audioId: 12, indexList: [8, 12, 16] },
            { id: 5, name: '春十三娘', icon: 'headIcon4', bigIcon: 'chunsanshiniang', roleDesc: 'role_4', pay: 6, type: 1, audioId: 18, indexList: [9, 13, 17] },
            { id: 6, name: '紫霞仙子', icon: 'headIcon5', bigIcon: 'zixiaxianzi', roleDesc: 'role_5', pay: 8, type: 0, audioId: 17, indexList: [3, 21, 25] },
            { id: 7, name: '至尊宝', icon: 'headIcon6', bigIcon: 'zhizunbao', roleDesc: 'role_6', pay: 12, type: 0, audioId: 19, indexList: [4, 22, 26] },
            { id: 8, name: '牛魔王', icon: 'headIcon7', bigIcon: 'niumowang', roleDesc: 'role_7', pay: 12, type: 1, audioId: 13, indexList: [6, 10, 14] },
            { id: 9, name: '铁扇公主', icon: 'headIcon8', bigIcon: 'tieshangongzhu', roleDesc: 'role_8', pay: 8, type: 1, audioId: 14, indexList: [7, 11, 15] },
            { id: 10, name: '仙', icon: '', bigIcon: '', pay: 2, type: 2, audioId: 10017, indexList: [] },
            { id: 11, name: '魔', icon: '', bigIcon: '', pay: 2, type: 2, audioId: 10017, indexList: [] },
            { id: 12, name: '月光宝盒', icon: 'headIcon11', bigIcon: 'yueguangbaohe', roleDesc: 'role_9', pay: 0, type: 3, audioId: 20, indexList: [5] },
        ],

    /**
     * 查找第一个符合filter的item
     * @param filter
     * @returns {*}
     */
    getItem: function (filter) {
        var result = null;
        for (var i = 0; i < this.items.length; ++i) {
            if (filter(this.items[i])) {
                result = this.items[i];
                return result;
            }
        }
        return result;
    },
};

const chipSpriteConfig = [
    { key: 1, num: 2, icon: 'fknn_chouma_icon_lan02' },
    { key: 2, num: 10, icon: 'fknn_chouma_icon_lv02' },
    { key: 3, num: 20, icon: 'fknn_chouma_icon_zi02' },
    { key: 4, num: 100, icon: 'fknn_chouma_icon_lan03' },
    { key: 5, num: 500, icon: 'fknn_chouma_icon_lv03' },
    { key: 6, num: 1000, icon: 'fknn_chouma_icon_zi03' },
    { key: 7, num: 2000, icon: 'fknn_chouma_icon_lan05' },
    { key: 8, num: 5000, icon: 'fknn_chouma_icon_lv04' },
    { key: 9, num: 10000, icon: 'fknn_chouma_icon_lv05' },
    { key: 10, num: 20000, icon: 'fknn_chouma_icon_zi04' },
    { key: 11, num: 50000, icon: 'fknn_chouma_icon_fen04' },
    { key: 12, num: 100000, icon: 'fknn_chouma_icon_fen05' },
    { key: 13, num: 200000, icon: 'fknn_chouma_icon_zi07' },
    { key: 14, num: 1000000, icon: 'fknn_chouma_icon_fen06' },
]


module.exports = {
    WestwardJourneyGameType: WestwardJourneyGameType,
    IconConfg: IconConfg,
    ChipSpriteConfig: chipSpriteConfig,
    AuditoPath: 'gameyj_big_talk_westward_journey/Audio/',
}
