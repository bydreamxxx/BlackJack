const Prefix = 'gameyj_texas/audio/';
module.exports = {
    Background: Prefix + 'bmg',//背景音乐
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
        ShowHand: Prefix + 'comaudio',     //梭哈
        Call: Prefix + 'comaudio',           //跟
        Pass: Prefix + 'comaudio',           //过
        Discard: Prefix + 'comaudio',         //弃
        Raise: Prefix + 'comaudio',          //加
        // Xiazhu: Prefix + 'man/xiazhu',      //下注
    },
    WOMAN: {
        ShowHand: Prefix + 'comaudio',
        Call: Prefix + 'comaudio',
        Pass: Prefix + 'comaudio',
        Discard: Prefix + 'comaudio',
        Raise: Prefix + 'comaudio',
        // Xiazhu: Prefix + 'woman/xiazhu',
    },
};