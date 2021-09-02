/**
 * Created by shen on 2017/8/23.
 */

const HallShopType = cc.Enum({
    PROP:2, //商城道具
    RED_BAG:1, //商城红包
    DIAMOND:0, //商城钻石
    COIN:3, //商城金币
});

const Enum_buyType = cc.Enum({
    Convert: 1001,//兑换类
    MONEY_BUY:1002,//有钱购买
});

const HallShopPropCfg = [
    {id:3001, count:2, cost:4, icon:'sc_fangka', name:'x2', detail:'消耗4颗钻石', buyType:Enum_buyType.Convert, btnLbl:'兑  换',  tag:'', give:0},
    {id:3002, count:10, cost:18, icon:'sc_fangka', name:'x10', detail:'消耗18颗钻石', buyType:Enum_buyType.Convert, btnLbl:'兑  换', tag:'', give:0},
    {id:3003, count:30, cost:52, icon:'sc_fangka', name:'x30', detail:'消耗52颗钻石', buyType:Enum_buyType.Convert, btnLbl:'兑  换', tag:'', give:0},
    {id:3004, count:60, cost:100, icon:'sc_fangka', name:'x60', detail:'消耗100颗钻石', buyType:Enum_buyType.Convert, btnLbl:'兑  换', tag:'', give:0},
    {id:3005, count:100, cost:150, icon:'sc_fangka', name:'x100', detail:'消耗150颗钻石', buyType:Enum_buyType.Convert, btnLbl:'兑  换', tag:'', give:0},
];

// const HallShopRedBagCfg = [
//     {id:4001, count:0, cost:20,  icon:'sc_hongbao', name:'', detail:'20元红包', btnLbl:'兑  换', tag:'', give:0},
//     {id:4002, count:0, cost:50,  icon:'sc_hongbao', name:'', detail:'50元红包', btnLbl:'兑  换', tag:'', give:0},
//     {id:4003, count:0, cost:100,  icon:'sc_hongbao', name:'', detail:'100元红包', btnLbl:'兑  换', tag:'', give:0},
//     {id:4004, count:0, cost:200,  icon:'sc_hongbao', name:'', detail:'200元红包', btnLbl:'兑  换', tag:'', give:0},
//     {id:4005, count:0, cost:500,  icon:'sc_hongbao', name:'', detail:'500元红包', btnLbl:'兑  换', tag:'', give:0},
//     {id:4006, count:0, cost:1000,  icon:'sc_hongbao', name:'', detail:'1000元红包', btnLbl:'兑  换', tag:'', give:0},
// ];

const HallShopDiamondCfg = [
    {id:5001, count:6, cost:6,  icon:'sc_zuanshi_01', name:'x6', detail:'6元购买', buyType:Enum_buyType.MONEY_BUY, btnLbl:'购  买', tag:'', give:''},
    {id:5002, count:12, cost:12,  icon:'sc_zuanshi_02', name:'x12', detail:'12元购买', buyType:Enum_buyType.MONEY_BUY, btnLbl:'购  买', tag:'', give:''},
    {id:5003, count:30, cost:30,  icon:'sc_zuanshi_03', name:'x30', detail:'30元购买', buyType:Enum_buyType.MONEY_BUY, btnLbl:'购  买', tag:'', give:''},
    {id:5004, count:100, cost:100,  icon:'sc_zuanshi_04', name:'x100', detail:'100元购买', buyType:Enum_buyType.MONEY_BUY, btnLbl:'购  买', tag:'', give:''},
    {id:5005, count:150, cost:150,  icon:'sc_zuanshi_05', name:'x150', detail:'150元购买', buyType:Enum_buyType.MONEY_BUY, btnLbl:'购  买', tag:'', give:''},
    {id:5006, count:300, cost:300,  icon:'sc_zuanshi_06', name:'x300', detail:'300元购买', buyType:Enum_buyType.MONEY_BUY, btnLbl:'购  买', tag:'', give:''},
    {id:5007, count:340, cost:298,  icon:'sc_zuanshi_07', name:'x340', detail:'298元购买', buyType:Enum_buyType.MONEY_BUY, btnLbl:'购  买', tag:'', give:''},
    {id:5008, count:720, cost:618,  icon:'sc_zuanshi_08', name:'x720', detail:'618元购买', buyType:Enum_buyType.MONEY_BUY, btnLbl:'购  买', tag:'', give:''},
];

// const HallShopCoinCfg = [
//     {id:6001, count:2.4, cost:2,  icon:'sc_jinbi_01', name:'x2.4万', detail:'消耗2颗钻石', btnLbl:'兑  换', tag:'', give:0},
//     {id:6002, count:6, cost:5,  icon:'sc_jinbi_02', name:'x6万', detail:'消耗5颗钻石', btnLbl:'兑  换', tag:'', give:0},
//     {id:6003, count:18.5, cost:15,  icon:'sc_jinbi_03', name:'x18.5万', detail:'消耗15颗钻石', btnLbl:'兑  换', tag:'', give:0},
//     {id:6004, count:38, cost:30,  icon:'sc_jinbi_04', name:'x38万', detail:'消耗30颗钻石', btnLbl:'兑  换', tag:'', give:0},
//     {id:6005, count:65, cost:50,  icon:'sc_jinbi_05', name:'x65万', detail:'消耗50颗钻石', btnLbl:'兑  换', tag:'', give:0},
//     {id:6006, count:132, cost:100,  icon:'sc_jinbi_06', name:'x132万', detail:'消耗100颗钻石', btnLbl:'兑  换', tag:'', give:0},
//     {id:6007, count:405, cost:300,  icon:'sc_jinbi_07', name:'x405万', detail:'消耗300颗钻石', btnLbl:'兑  换', tag:'', give:0},
//     {id:6008, count:700, cost:500,  icon:'sc_jinbi_08', name:'x700万', detail:'消耗500颗钻石', btnLbl:'兑  换', tag:'', give:0},
// ];

module.exports = {
    HallShopType:HallShopType,
    HallShopPropCfg:HallShopPropCfg,
    // HallShopRedBagCfg:HallShopRedBagCfg,
    HallShopDiamondCfg:HallShopDiamondCfg,
    // HallShopCoinCfg:HallShopCoinCfg,
    Enum_buyType:Enum_buyType,
};