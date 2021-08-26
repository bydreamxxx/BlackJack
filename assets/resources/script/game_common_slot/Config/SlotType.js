// create by wj 2018/06/08

var SlotType = {
    CardType : {
        Common  : 1,  //普通牌
        Wild    : 2,  //万能牌
        Func    : 3,  //功能牌
    },

    FuncType :{
        None       : 0,  //无
        Free       : 2,  //免费旋转
        SmallGame  : 1,  //小游戏
        Fun_Type_Moneygod : 3, //财神游戏
    },

    GameState :{
        None       : 0,  //无
        WaitBet    : 1,  //等待下注
        Beting     : 2,  //下注CD
        Runing     : 3,  //可停止旋转
        ShowLine   : 4,  //显示赢线
        ShowWin    : 5,  //显示功能效果
        SmallGame  : 6,  //小游戏界面
    },

    DownBtnState :{
        Down       : 1,  //点击下注旋转，长按自动旋转
        Downing    : 2,  //下注cd中
        Stop       : 3,  //点击停止旋转
        Stoping    : 4,  //停止旋转中
        AutoDown   : 5,  //自动旋转中，长按停止自动旋转
        AutoDownStoping   : 6,  //停止自动旋转中
        Award : 7, //老虎机得分
        Awarding : 8, //老虎机得分中
        AutoDowning: 9, //自动旋转中
    },

    SlotAddOrSubState : {
        InAdd :1,
        InSub : 2,
    },
};
module.exports = {
    SlotType : SlotType,
}