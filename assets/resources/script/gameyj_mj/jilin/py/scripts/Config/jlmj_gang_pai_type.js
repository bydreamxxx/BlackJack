/**
 * Created by Mac_Li on 2017/8/24.
 */


/**
 * 牌的花色 对应的值
 * @type {Array}
 */
const CardType = {
              T1:0, T2:1, T3:2, T4:3, T5:4, T6:5, T7:6, T8:7, T9:8,          //饼
              S1:9, S2:10, S3:11, S4:12, S5:13, S6:14, S7:15, S8:16, S9:17, //条
              W1:18, W2:19, W3:20, W4:21, W5:22, W6:23, W7:24, W8:25, W9:26,//万
              ZHONG:27, FA:28, BAI:29, DONG:30, NAN:31, XI:32, BEI:33
            };
/**
 * 没有小鸡1——9 杠组合
 */
const Gang_Pai_Noxiaoji_19=[
    [CardType.W1, CardType.T1, CardType.S1],
    [CardType.T9, CardType.S9, CardType.W9],
];
/**
 * 没有小鸡的杠牌组合
 * @type {Array}
 */
const Gang_Pai_Noxiaoji = [
        [CardType.ZHONG, CardType.FA, CardType.BAI],
        [CardType.DONG, CardType.NAN, CardType.XI, CardType.BEI],
        [CardType.DONG, CardType.XI, CardType.BEI],
        [CardType.DONG, CardType.NAN, CardType.BEI],
        [CardType.DONG, CardType.NAN, CardType.XI],
        [CardType.XI,   CardType.NAN, CardType.BEI],
    ];
/**
 * 有小鸡1——9 杠组合
 */
const Gang_Pai_19=[
    [CardType.T1, CardType.S1, CardType.S1],
    [CardType.W1, CardType.S1, CardType.S1],

    [CardType.T9, CardType.W9, CardType.S1],
    [CardType.T9, CardType.S1, CardType.S9],
    [CardType.S1, CardType.W9, CardType.S9],
    [CardType.T9, CardType.S1, CardType.S1],
    [CardType.S1, CardType.W9, CardType.S1],
    [CardType.S1, CardType.S1, CardType.S9],
];
/**
 * 有小鸡的杠牌组合
 * @type {Array}
 */
const  Gang_Pai_Xiaoji=[



    [CardType.ZHONG, CardType.FA, CardType.S1],
    [CardType.ZHONG, CardType.S1, CardType.BAI],
    [CardType.S1,    CardType.FA, CardType.BAI],
    [CardType.ZHONG, CardType.S1, CardType.S1],
    [CardType.S1,    CardType.FA, CardType.S1],
    [CardType.S1,    CardType.S1, CardType.BAI],

    [CardType.DONG, CardType.XI, CardType.NAN, CardType.S1],
    [CardType.DONG, CardType.XI, CardType.S1, CardType.BEI],
    [CardType.DONG, CardType.S1, CardType.NAN, CardType.BEI],
    [CardType.S1,   CardType.XI, CardType.NAN, CardType.BEI],

    [CardType.DONG, CardType.XI, CardType.S1, CardType.S1],
    [CardType.DONG, CardType.S1, CardType.S1, CardType.BEI],
    [CardType.S1,   CardType.S1, CardType.NAN, CardType.BEI],
    [CardType.S1,   CardType.XI, CardType.NAN, CardType.S1],
    [CardType.S1,   CardType.XI, CardType.S1, CardType.BEI],
    [CardType.DONG, CardType.S1, CardType.NAN, CardType.S1],

    [CardType.DONG, CardType.S1, CardType.S1, CardType.S1],
    [CardType.XI,   CardType.S1, CardType.S1, CardType.S1],
    [CardType.NAN,   CardType.S1, CardType.S1, CardType.S1],
    [CardType.BEI,   CardType.S1, CardType.S1, CardType.S1],

    [CardType.DONG, CardType.XI, CardType.S1],
    [CardType.DONG, CardType.BEI, CardType.S1],
    [CardType.BEI, CardType.XI, CardType.S1],
    [CardType.DONG, CardType.S1, CardType.S1],
    [CardType.NAN, CardType.S1, CardType.S1],
    [CardType.XI, CardType.S1, CardType.S1],
    [CardType.BEI, CardType.S1, CardType.S1],

    [CardType.DONG, CardType.NAN, CardType.S1],
    [CardType.NAN, CardType.BEI, CardType.S1],
    [CardType.DONG, CardType.XI, CardType.S1],

    [CardType.XI, CardType.NAN, CardType.S1],
    [CardType.XI, CardType.BEI, CardType.S1],
    [CardType.NAN, CardType.BEI, CardType.S1],
    [CardType.DONG, CardType.S1, CardType.S1],

];
/**
 * 比较两个数组中的值是否完全相等 但没有顺序限制
 */
var compareArr = function (arr1, arr2) {
    if(arr2.length!=arr1.length){
        return false;
    }
    arr1.sort(function (a,b) {
        return a-b;
    });
    arr2.sort(function (a,b) {
        return a-b;
    });
    for(var i=0; i<arr1.length; ++i){
        if(arr1[i]!=arr2[i]){
            return false;
        }
    }
    return true;

};

/**
 * 判断出入的牌型 在配置中有没有
 * @param isXJ  包括小鸡不
 * @param is19  包括19 杠
 * @param list
 */
var findGang = function (isXJ, is19, list) {
    if(!list){
        return false;
    }

    for(var i=0; i<Gang_Pai_Noxiaoji.length; ++i) {
        if (compareArr(Gang_Pai_Noxiaoji[i], list)) {
            return true;
        }
    }
    if(is19){//没有小鸡 的1 9 杠
        for(var i=0; i<Gang_Pai_Noxiaoji_19.length; ++i) {
            if (compareArr(Gang_Pai_Noxiaoji_19[i], list)) {
                return true;
            }
        }
    }
    if(isXJ) {//有小鸡 杠
        for(var i=0; i<Gang_Pai_Xiaoji.length; ++i) {
            if (compareArr(Gang_Pai_Xiaoji[i], list)) {
                return true;
            }
        }
    }
    if(is19 && isXJ){ //有小鸡 也有 19杠
        for(var i=0; i<Gang_Pai_19.length; ++i) {
            if (compareArr(Gang_Pai_19[i], list)) {
                return true;
            }
        }
    }
    return false;
};
// /**
//  * 判断有没有 1 9杠
//  */
// find19Gang = function (list) {
//
// };

/**
 * 获取牌的类型
 * @type
 */
var getCardType = function (cardID) {
    return  Math.floor(cardID/4);
};

module.exports={
    findGang:findGang,
    getCardType:getCardType,
    CardType:CardType,
}