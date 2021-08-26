/**
 * Created by wj on 2017/12/14.
 */

const GameType = require("klb_hall_GameItem").GameType;
const GameItem = require("klb_hall_GameItem").GameItem;


var Hall_Game_List = {
    list: [
        // new GameItem(
        //     游戏id,
        //     游戏名称,
        //     游戏类型,
        //     icon Frame Name
        // ),
        new GameItem(
            -100,
            "抢红包",
            GameType.RedBag_FUNCTION,
            "dt-qinghongbao",
            "",
            "",
            true,
            1,
        ),

        // new GameItem(
        //     6,
        //     "活动赛",
        //     GameType.DUOBAO,
        //     "dt-duobaosai",
        //     "",
        //     "",
        //     true,
        //     0,
        // ),
        new GameItem(
            -100,  //游戏id
            "添加游戏",                                        //游戏名字
            GameType.ADD_GAME,                                //游戏类型：麻将／纸牌
            "dt-tianjiayouxi",                                              //游戏icon
            "" ,                          //子游戏的事件监听脚本
            "",
            true,
            0,
        ),

    ],
};


var Vip_Game_List = {
    list: [
    ],
};

module.exports = {
    Hall_Game_List:Hall_Game_List,
    Vip_Game_List:Vip_Game_List,
};