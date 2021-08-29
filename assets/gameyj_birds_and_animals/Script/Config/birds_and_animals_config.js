//create by wj 2019/07/29

var BirdsAndAnimalsGameType = {
    GameRunState: {
        RunBegin: 0, //开始跑
        RunUniformSpeed: 1, //匀速跑
        RunSubSpeed: 2, //减速跑
        RunEnd: 3, //结束
        RunDefault: 4, //默认值
        ReverseRunBegin: 5, //反向转开始
        ReverseRun: 6, //反向转
        RunRepeatBegin: 7,//再次转
    },

    GameSate: {
        WaitGame: 0, //等待开始
        BetGame: 1, //下注
        OpenGame: 2, //开奖
        ResultGame: 3, //结果
    },

    GameTimeControl: {
        BeginRunTime: [0.4, 0.3, 0.2, 0.3, 0.3],  //开始跑，5个图标显示一个图标需要的时间
        RunUniformTotalTime: 2.8, //加速跑总时间
        SubSpeedTotalTime: [0.62, 0.32, 0.24, 0.14, 0.14, 0.14, 0.14], //减速跑总时间
        RunUniformCircle: 5, //加速跑预估总的圈速
        SubRunLeftStep: 7, //最后剩余几格减速

        ReverseRunBeginTime: 0.1,
        reverseRunTime: 0.008,
        RunRepeatBeginTime: 0.1,
    },

}

var IconConfg = {
    items:
        [
            { id: 1, name: '金鲨', icon: 'fqzs_kaijiang_icon10', bigIcon: 'fqzs_icon_da_10', pay: 100, type: 0, audioId: 10013, },
            { id: 2, name: '银鲨', icon: 'fqzs_kaijiang_icon05', bigIcon: 'fqzs_icon_da_05', pay: 24, type: 0, audioId: 10013, },
            { id: 3, name: '熊猫', icon: 'fqzs_kaijiang_icon08', bigIcon: 'fqzs_icon_da_08', pay: 8, type: 1, audioId: 10020, },
            { id: 4, name: '猴子', icon: 'fqzs_kaijiang_icon07', bigIcon: 'fqzs_icon_da_07', pay: 8, type: 1, audioId: 10019, },
            { id: 5, name: '兔子', icon: 'fqzs_kaijiang_icon06', bigIcon: 'fqzs_icon_da_06', pay: 6, type: 1, audioId: 10021, },
            { id: 6, name: '狮子', icon: 'fqzs_kaijiang_icon09', bigIcon: 'fqzs_icon_da_09', pay: 12, type: 1, audioId: 10018, },
            { id: 7, name: '孔雀', icon: 'fqzs_kaijiang_icon03', bigIcon: 'fqzs_icon_da_03', pay: 8, type: 2, audioId: 10016, },
            { id: 8, name: '鸽子', icon: 'fqzs_kaijiang_icon02', bigIcon: 'fqzs_icon_da_02', pay: 8, type: 2, audioId: 10015, },
            { id: 9, name: '燕子', icon: 'fqzs_kaijiang_icon01', bigIcon: 'fqzs_icon_da_01', pay: 6, type: 2, audioId: 10014, },
            { id: 10, name: '老鹰', icon: 'fqzs_kaijiang_icon04', bigIcon: 'fqzs_icon_da_04', pay: 12, type: 2, audioId: 10017, },
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
}

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
    BirdsAndAnimalsGameType: BirdsAndAnimalsGameType,
    IconConfg: IconConfg,
    AuditoPath: 'gameyj_birds_and_animals/Audio/',
    ChipSpriteConfig: chipSpriteConfig,
}
