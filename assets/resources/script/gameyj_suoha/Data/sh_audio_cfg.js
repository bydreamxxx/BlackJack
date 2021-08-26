const Prefix = 'gameyj_suoha/audio/';
module.exports = {
    Deal: Prefix + 'deal',//发牌
    Chip: Prefix + 'chip',//筹码
    Start: Prefix + 'star',//游戏开始
    Chip_HE: Prefix + 'chip_he',//多个筹码
    Chip_end: Prefix + 'chip_end',//筹码
    MAN: {
        ShowHand: Prefix + 'man/allin',     //梭哈
        Call: Prefix + 'man/gen',           //跟
        Pass: Prefix + 'man/guo',           //过
        Discard: Prefix + 'man/qi',         //弃
        Raise: Prefix + 'man/jia',          //加
        Xiazhu: Prefix + 'man/xiazhu',      //下注
    },
    WOMAN: {
        ShowHand: Prefix + 'woman/allin',
        Call: Prefix + 'woman/gen',
        Pass: Prefix + 'woman/guo',
        Discard: Prefix + 'woman/qi',
        Raise: Prefix + 'woman/jia',
        Xiazhu: Prefix + 'woman/xiazhu',
    },
};