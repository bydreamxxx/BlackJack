// create by wj 2019/02/21
var PK_Reel_Type = {
    Free_Play: 1,//免费玩
    Spade_Free: 2, //黑桃免费
    Heart_Free: 3, //红桃免费
    Club_Free: 4,//梅花免费
    Diamond_Free: 5, //方块免费
    Joker_Free: 6,//王免费
    Double_Play: 7,//翻倍
    Spade_Double: 8, //黑桃翻倍
    Heart_Double: 9,//红桃翻倍
    Club_Double: 10, //梅花翻倍
    Diamond_Double: 11, //方块翻倍
    Joker_Double: 12, //王翻倍
    Double_bang: 13, //双响炮
};

var PK_Reel_Type_Desc = {
    1: '免费玩',
    2: '黑桃免费',
    3: '红桃免费',
    4: '梅花免费',
    5: '方块免费',
    6: '王免费',
    7: '金币X2',
    8: '黑桃翻倍',
    9: '红桃翻倍',
    10: '梅花翻倍',
    11: '方块翻倍',
    12: '王翻倍',
    13: '双响炮',
};


var PK_State = {
    PK_Bet_Time: 1,//下注状态
    PK_Bet_Open_Poker: 4,//开牌中
    PK_Bet_Result: 2, //结算阶段
};

var PK_Game_State = {
    PK_Bet: 0, //下注
    PK_Weel: 1, //命运转轮
    PK_Open: 2, //搓牌
    PK_Result: 3,//结算
    PK_Wait: 4,// 等待
};

var PK_Poker = {
    102: '黑桃2',
    103: '黑桃3',
    104: '黑桃4',
    105: '黑桃5',
    106: '黑桃6',
    107: '黑桃7',
    108: '黑桃8',
    109: '黑桃9',
    110: '黑桃10',
    111: '黑桃J',
    112: '黑桃Q',
    113: '黑桃K',
    114: '黑桃A',
    202: '红桃2',
    203: '红桃3',
    204: '红桃4',
    205: '红桃5',
    206: '红桃6',
    207: '红桃7',
    208: '红桃8',
    209: '红桃9',
    210: '红桃10',
    211: '红桃J',
    212: '红桃Q',
    213: '红桃K',
    214: '红桃A',
    302: '梅花2',
    303: '梅花3',
    304: '梅花4',
    305: '梅花5',
    306: '梅花6',
    307: '梅花7',
    308: '梅花8',
    309: '梅花9',
    310: '梅花10',
    311: '梅花J',
    312: '梅花Q',
    313: '梅花K',
    314: '梅花A',
    402: '方块2',
    403: '方块3',
    404: '方块4',
    405: '方块5',
    406: '方块6',
    407: '方块7',
    408: '方块8',
    409: '方块9',
    410: '方块10',
    411: '方块J',
    412: '方块Q',
    413: '方块K',
    414: '方块A',
    500: '小王',
    501: '大王',
};

var PK_Poker_Color = [
    '<color=#b33127>',
    '<color=#3d3728>',
]


module.exports = {
    PK_ReelType: PK_Reel_Type,
    PK_State: PK_State,
    PK_PokerColor: PK_Poker_Color,
    PK_GameState: PK_Game_State,
    PK_Poker: PK_Poker,
    PK_Reel_Type_Desc: PK_Reel_Type_Desc,
    AuditoPath: 'gameyj_one_on_one/Audio/',
}