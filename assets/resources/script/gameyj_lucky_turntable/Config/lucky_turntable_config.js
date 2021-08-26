//create by wj 2020/6/3

var LuckyTurnTableGameType = {
    GameSate: {
        WaitGame: 0, //等待开始
        BetGame: 1, //下注
        OpenGame: 2, //开奖
        ResultGame: 3, //结果
    },
}

var LuckyTurntableRunControl = {
    start_speed: 336.5, //初始速度360°/1秒
    run_time: 16, //持续时间16秒
    end_speed: 1, //末速度 1°/1秒
    sub_speed: (336.5 - 1) / 16, //减速度
    per_cell_angel: 360 / 26, //每一格子占的度数

    ball_total_run_circle: 7, //预计跑9圈
    ball_end_speed: 18, //球转动末速度
    ball_run_time: 14,
}

module.exports = {
    LuckyTurnTableGameType: LuckyTurnTableGameType,
    LuckyTurntableRunControl: LuckyTurntableRunControl,
    AuditoPath: 'gameyj_lucky_turntable/Audio/',
}