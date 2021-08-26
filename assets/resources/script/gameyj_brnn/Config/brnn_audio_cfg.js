const Prefix = 'gameyj_brnn/audio/';
module.exports = {
    GAME_MUSIC: Prefix + 'OxBg',
    //特效
    COMMON: {
        START_BET: Prefix + 'OxStartAddScore',  //开始下注
        END_BET: Prefix + 'OxStopAddScore',     //结束下注
        NIUJIAO: Prefix + 'OxBankerWin',        //结束
        GAME_END: Prefix + 'OxGameEnd',         //胜利
        AllWin: Prefix + 'OxAllWin',            //通杀
        AllLose: Prefix + 'OxAllLose',          //通赔
        BUTTON: Prefix + 'OxButton',            //按钮音
        BET: Prefix + 'OxJetton',               //下注
        OpenCard: Prefix + 'OxOpenCard',        //开牌
    },
    PAIXING: {
        [0]: Prefix + 'OxWuNiu',
        [1]: Prefix + 'OxNiu1',
        [2]: Prefix + 'OxNiu2',
        [3]: Prefix + 'OxNiu3',
        [4]: Prefix + 'OxNiu4',
        [5]: Prefix + 'OxNiu5',
        [6]: Prefix + 'OxNiu6',
        [7]: Prefix + 'OxNiu7',
        [8]: Prefix + 'OxNiu8',
        [9]: Prefix + 'OxNiu9',
        [10]: Prefix + 'OxNiuNiu',
        [14]: Prefix + 'OxYinNiu',
        [16]: Prefix + 'OxJinNiu',
        [17]: Prefix + 'OxBomb',
    },
}