const Prefix = 'resources/gameyj_texas/audio/';
module.exports = {
    Deal: Prefix + 'Sound_Turn_card.mp3',//发牌
    Chip: Prefix + 'sound_slider.mp3',//筹码
    Win: Prefix + 'win.mp3',//胜利
    Allin: Prefix + 'allin.mp3',//加注条拉满，allin动画时播放
    Sound_Sit: Prefix + 'Sound_Sit.mp3',//荷官敲桌子
    Talk_own: Prefix + 'talk_own.mp3',//轮到自己说话提示
    Sound_Win_Clips: Prefix + 'Sound_Win_Clips.mp3',//胜利收筹码
    Sound_See_Card: Prefix + 'Sound_See_Card.mp3',//发公共牌
    Sound_Turn_card_4: Prefix + 'Sound_Turn_card_4.mp3',//弃牌
    MAN: {
        ShowHand: Prefix + 'man/allin.mp3',     //梭哈
        Call: Prefix + 'man/gen.mp3',           //跟
        Pass: Prefix + 'man/guo.mp3',           //过
        Discard: Prefix + 'man/qi.mp3',         //弃
        Raise: Prefix + 'man/jia.mp3',          //加
        // Xiazhu: Prefix + 'man/xiazhu.mp3',      //下注
    },
    WOMAN: {
        ShowHand: Prefix + 'woman/allin.mp3',
        Call: Prefix + 'woman/gen.mp3',
        Pass: Prefix + 'woman/guo.mp3',
        Discard: Prefix + 'woman/qi.mp3',
        Raise: Prefix + 'woman/jia.mp3',
        // Xiazhu: Prefix + 'woman/xiazhu.mp3',
    },
};