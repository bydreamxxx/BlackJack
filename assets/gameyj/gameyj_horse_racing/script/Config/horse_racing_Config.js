var HorseRacingGameConfig = {
    GameSate: {
        WaitGame: 0, //等待开始
        BetGame: 1, //下注
        OpenGame: 2, //跑马
        ResultGame: 3, //结果
    },

    RunState: {
        Begin: 0, //等待开始跑
        LeftRun: 1,//左侧加速跑
        TurnRun: 2,//转弯跑
        RightRun: 3,//右侧加速
        Wait: 4, //等待跑马
    },
}

module.exports = {
    HorseRacingGameConfig: HorseRacingGameConfig,
    AuditoPath: 'gameyj_horse_racing/sound/',
}