//create bt wj 2018/06/20

var TinyGameType = {
    GameRunState: {
        RunBegin : 0, //开始跑
        RunAddSpeed : 1, //加速跑
        RunSubSpeed : 2, //减速跑
        RunEnd : 3, //结束
        RunDefault: 4, //默认值
    },

    GameSate: {
        WaitGame: 0, //等待开始
        StartGame: 1, //摇奖
        OpenGame: 2, //开奖
        ResultGame: 3 , //结果
    },
}

module.exports = {
    TinyGameType : TinyGameType,
}