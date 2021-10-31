const Prefix = 'gameyj_texas/audio/';
module.exports = {
    Deal: Prefix + 'Sound_Turn_card',//发牌
    Chip: Prefix + 'sound_slider',//筹码
    Win: Prefix + 'win',//胜利
    Allin: Prefix + 'allin',//加注条拉满，allin动画时播放
    Sound_Sit: Prefix + 'Sound_Sit',//荷官敲桌子
    Talk_own: Prefix + 'talk_own',//轮到自己说话提示
    Sound_Win_Clips: Prefix + 'Sound_Win_Clips',//胜利收筹码
    Sound_See_Card: Prefix + 'Sound_See_Card',//发公共牌
    Sound_Turn_card_4: Prefix + 'Sound_Turn_card_4',//弃牌
    MAN: {
        ShowHand: Prefix + 'man/allin',     //梭哈
        Call: Prefix + 'man/gen',           //跟
        Pass: Prefix + 'man/guo',           //过
        Discard: Prefix + 'man/qi',         //弃
        Raise: Prefix + 'man/jia',          //加
        // Xiazhu: Prefix + 'man/xiazhu',      //下注
    },
    WOMAN: {
        ShowHand: Prefix + 'woman/allin',
        Call: Prefix + 'woman/gen',
        Pass: Prefix + 'woman/guo',
        Discard: Prefix + 'woman/qi',
        Raise: Prefix + 'woman/jia',
        // Xiazhu: Prefix + 'woman/xiazhu',
    },
};