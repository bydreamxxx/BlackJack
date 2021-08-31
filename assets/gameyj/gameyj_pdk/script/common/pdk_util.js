//牌类型
const CARD_TYPE = cc.Enum({
    Invalid: 0,     //无效牌型
    Single: 1,      //单牌
    Double: 2,      //对牌
    Triple: 3,      //三张
    TripleA1: 4,     //三带一 或对
    SingleLine: 5,   //单顺
    DoubleLine: 6,   //对顺
    TripleLine: 7,   //三顺
    TripleLineA1: 8, //飞机  三带一或对
    QuadrupleA2: 9,  //四带二
    Bomb: 10,        //炸弹
});
//无效类型
const Invalid_Type = cc.Enum({
    None: 0,                        //无
    TripleLess: 1,                  //三张少带
    TripleLineLess: 2,              //飞机少带
    QuadrupleA3: 3,                 //四带三
});
var ddz_util = cc.Class({
    statics: {
        //获取牌值
        getCardValue: function (Card) {
            return Math.floor(Card / 10);
        },

        //花色 1 -> 黑桃 2 -> 红桃 3 -> 草花 4 -> 方块
        getCardColor: function (Card) {
            return Card % 10;
        },

        //牌型分析  返回type,index和count
        analysisCards: function (cards) {
            var ret = { type: CARD_TYPE.Invalid, index: -1, count: -1, stype: Invalid_Type.None };//返回值
            if (!cards || !cards.length || cards.length == 0) {
                return ret;
            }
            var counts = this.countRepeatCards(cards);//每种牌的张数
            var max_ret = this.maxRepeatNum(counts);
            var start = -1, end = -1;
            var four = max_ret[2][4], three = max_ret[2][3], two = max_ret[2][2], one = max_ret[2][1];
            //*************************** 全单 *****************************
            if (max_ret[0] == 1) {
                if (max_ret[1] == 1) {
                    ret.type = CARD_TYPE.Single;
                    ret.index = this.getCardValue(cards[0]);
                    ret.count = 1;
                    return ret;
                }
                if (max_ret[1] > 4) {
                    if (counts[16] > 0) { //2
                        return ret;
                    }
                    for (var i = 3; i < counts.length; i++) {
                        if (counts[i] > 0) {
                            start = i;
                            break;
                        }
                    }
                    for (var i = 14; i > 0; i--) {
                        if (counts[i] > 0) {
                            end = i;
                            break;
                        }
                    }
                    for (var i = start + 1; i < end; i++) {
                        if (counts[i] == 0) {
                            return ret;
                        }
                    }
                    ret.type = CARD_TYPE.SingleLine;
                    ret.index = end;
                    ret.count = end - start + 1;
                    return ret;
                }
                else {
                    return ret;
                }
            }
            //*************************** 对子 *****************************
            else if (max_ret[0] == 2) {
                //含单牌
                if (max_ret[2][1] > 0) {
                    return ret;
                }
                //一对
                if (max_ret[1] == 1) {
                    ret.type = CARD_TYPE.Double;
                    ret.index = this.getCardValue(cards[0]);
                    ret.count = 1;
                    return ret;
                }
                //连对
                else if (max_ret[1] > 1) {
                    if (counts[16] == 2) { //王和2
                        return ret;
                    }
                    for (var i = 3; i < counts.length; i++) {
                        if (counts[i] == 2) {
                            start = i;
                            break;
                        }
                    }
                    for (var i = 14; i > 0; i--) {
                        if (counts[i] == 2) {
                            end = i;
                            break;
                        }
                    }
                    for (var i = start + 1; i < end; i++) {
                        if (counts[i] != 2) {
                            return ret;
                        }
                    }
                    ret.type = CARD_TYPE.DoubleLine;
                    ret.index = end;
                    ret.count = end - start + 1;
                    return ret;
                }
            }
            //*************************** 三张 *****************************
            // @spec 三带一和三带对类型相同 比较的时候加上牌张数的比较
            else if (max_ret[0] == 3) {
                if (cards.length % 5 == 0) {
                    if (three == 1) {//三带二
                        if (cards.length != 5)
                            return ret;
                        var f = function () { for (var i = 3; i < counts.length; i++) { if (counts[i] == 3) return i; } };
                        ret.type = CARD_TYPE.TripleA1;
                        ret.index = f();
                        ret.count = 1;
                        return ret;
                    }
                    else {//飞机
                        var start_3l = -1;
                        var line_max = 0;
                        var index_max = -1;
                        for (var i = 3; i < 16; i++) {
                            if (counts[i] == 3) {
                                if (start_3l == -1) {
                                    start_3l = i;
                                }
                            }
                            else {
                                if (start_3l != -1) {
                                    var len = i - start_3l;
                                    if (len > line_max) {
                                        line_max = len;
                                        index_max = i - 1;
                                    }
                                    start_3l = -1;
                                }
                            }
                        }
                        if (line_max >= cards.length / 5) {
                            ret.type = CARD_TYPE.TripleLineA1;
                            ret.index = index_max;
                            ret.count = cards.length / 5;
                            return ret;
                        }
                        else
                            return ret;
                    }
                }
                else if (cards.length % 3 == 0) {
                    if (three == 1) {//单三    TODO: 3A算炸弹
                        if (cards.length != 3)
                            return ret;
                        ret.type = CARD_TYPE.Triple;
                        ret.index = this.getCardValue(cards[0]);
                        ret.count = 1;
                        return ret;
                    }
                    else {//多三 
                        var start_3l = -1;
                        var line_max = 0;
                        var index_max = -1;
                        for (var i = 3; i < 16; i++) {
                            if (counts[i] == 3) {
                                if (start_3l == -1) {
                                    start_3l = i;
                                }
                            }
                            else {
                                if (start_3l != -1) {
                                    var len = i - start_3l;
                                    if (len > line_max) {
                                        line_max = len;
                                        index_max = i - 1;
                                    }
                                    start_3l = -1;
                                }
                            }
                        }
                        if (line_max == cards.length / 3) {//飞机不带
                            ret.type = CARD_TYPE.TripleLine;
                            ret.index = index_max;
                            ret.count = line_max;
                            return ret;
                        }
                        else if (line_max > cards.length / 5) {
                            ret.type = CARD_TYPE.Invalid;
                            ret.stype = Invalid_Type.TripleLineLess;
                            ret.line_max = line_max;
                            ret.index_max = index_max;
                            ret.cardlength = cards.length;
                            return ret;
                        }
                        else
                            return ret;
                    }
                }
                else {//不能被5和3整除
                    if (three == 1) {//单三
                        if (cards.length < 5) {
                            var f = function () { for (var i = 3; i < counts.length; i++) { if (counts[i] == 3) return i; } };
                            ret.type = CARD_TYPE.Invalid;
                            ret.stype = Invalid_Type.TripleLess;//三张少带
                            ret.index = f();
                            ret.count = 1;
                            return ret;
                        }
                        else
                            return ret;
                    }
                    else {
                        var start_3l = -1;
                        var line_max = 0;
                        var index_max = -1;
                        for (var i = 3; i < 16; i++) {
                            if (counts[i] == 3) {
                                if (start_3l == -1) {
                                    start_3l = i;
                                }
                            }
                            else {
                                if (start_3l != -1) {
                                    var len = i - start_3l;
                                    if (len > line_max) {
                                        line_max = len;
                                        index_max = i - 1;
                                    }
                                    start_3l = -1;
                                }
                            }
                        }
                        if (line_max > cards.length / 5) {
                            ret.type = CARD_TYPE.Invalid;
                            ret.stype = Invalid_Type.TripleLineLess;//飞机少带
                            ret.line_max = line_max;
                            ret.index_max = index_max;
                            ret.cardlength = cards.length;
                            return ret;
                        }
                        else
                            return ret;
                    }
                }
            }
            //*************************** 四张 *****************************
            //@spec  飞机可能包含四张相同牌
            else if (max_ret[0] == 4) {
                if (three > 0) {
                    var start_3l = -1;
                    var line_max = 0;
                    var index_max = -1;
                    for (var i = 3; i < 16; i++) {
                        if (counts[i] == 3 || counts[i] == 4) {
                            if (start_3l == -1) {
                                start_3l = i;
                            }
                        }
                        else {
                            if (start_3l != -1) {
                                var len = i - start_3l;
                                if (len > line_max) {
                                    line_max = len;
                                    index_max = i - 1;
                                }
                                start_3l = -1;
                            }
                        }
                    }
                    if (cards.length == 7) {
                        var f = function () { for (var i = 3; i < counts.length; i++) { if (counts[i] == 4) return i; } };
                        ret.type = CARD_TYPE.Invalid;
                        ret.stype = Invalid_Type.QuadrupleA3;//四带三
                        ret.index = f();
                        ret.count = 1;
                        return ret;
                    }
                    else if (cards.length % 5 == 0) {  //三带二
                        if (line_max >= (cards.length / 5)) {
                            ret.type = CARD_TYPE.TripleLineA1;
                            ret.index = index_max;
                            ret.count = cards.length / 5;
                            return ret;
                        }
                        else {
                            return ret;
                        }
                    }
                    else {
                        if (line_max >= (cards.length / 5)) {
                            ret.type = CARD_TYPE.Invalid;
                            ret.stype = Invalid_Type.TripleLineLess;//飞机少带
                            ret.line_max = line_max;
                            ret.index_max = index_max;
                            ret.cardlength = cards.length;
                            return ret;
                        }
                        else {
                            return ret;
                        }
                    }
                }
                else {
                    if (four == 1) {//只能有一个四张
                        var f = function () { for (var i = 3; i < counts.length; i++) { if (counts[i] == 4) return i; } };
                        if (cards.length == 4) {
                            ret.type = CARD_TYPE.Bomb;
                            ret.index = f();
                            ret.count = 1;
                            return ret;
                        }
                        else if (cards.length == 6) {//四带二
                            ret.type = CARD_TYPE.QuadrupleA2;
                            ret.index = f();
                            ret.count = 1;
                            return ret;
                        }
                        else if (cards.length == 7) {//四带三
                            ret.type = CARD_TYPE.Invalid;
                            ret.stype = Invalid_Type.QuadrupleA3;
                            ret.index = f();
                            ret.count = 1;
                            return ret;
                        }
                        else {
                            return ret;
                        }
                    }
                    else {
                        return ret;
                    }
                }
            }
            else
                return ret;
        },

        //牌型比较
        compareCards: function (lastCards, curCards, rule, allCards) {
            var isAll = curCards.length == allCards.length;
            var last = this.analysisCards(lastCards);
            var cur = this.analysisCards(curCards);
            if (rule.isChaiBomb == false) {
                var counts_all = this.countRepeatCards(allCards);
                var counts_cp = this.countRepeatCards(curCards);
                if (rule.isBombOfAaa && counts_all[14] == 3 && counts_cp[14] > 0 && counts_cp[14] < 3) {
                    return false;
                }
                if (rule.isBombOfAaa && counts_all[14] == 3 && counts_cp[14] == 3 && curCards.length > 3) {
                    return false;
                }
                for (var k = 3; k < 14; k++) {
                    if (counts_all[k] == 4 && counts_cp[k] > 0 && counts_cp[k] < 4) {
                        return false;
                    }
                }
            }
            if (cur.type == CARD_TYPE.Invalid)//出牌无效
            {
                switch (cur.stype) {
                    case Invalid_Type.None:
                        return false;
                    case Invalid_Type.TripleLess://三张少带
                        if (!isAll)
                            return false;
                        if (lastCards.length == 0) {
                            if (rule.isFplayThreeTake) //少带出完
                                return true;
                            else
                                return false;
                        }
                        else if (last.type == CARD_TYPE.TripleA1) {//少带接完
                            if (rule.isSplayThreeTake && cur.index > last.index)
                                return true;
                            else
                                return false;
                        }
                        else
                            return false;
                    case Invalid_Type.TripleLineLess://飞机少带
                        if (!isAll)
                            return false;
                        if (lastCards.length == 0) {
                            if (rule.isFplayThreeLineTake) //少带出完
                                return true;
                            else
                                return false;
                        }
                        else if (last.type == CARD_TYPE.TripleLineA1) {//少带接完
                            if (rule.isSplayThreeLineTake && cur.index_max > last.index && cur.line_max >= last.count && last.count * 5 > cur.cardlength)
                                return true;
                            else
                                return false;
                        }
                        else
                            return false;
                    case Invalid_Type.QuadrupleA3://四带三
                        if (!rule.isFourTake3)
                            return false;
                        else if (lastCards.length == 0) {
                            return true;
                        }
                        else if (last.type == CARD_TYPE.Invalid && last.stype == Invalid_Type.QuadrupleA3 && cur.index > last.index) {
                            return true;
                        }
                        else
                            return false;
                }
            }
            if (!rule.isFourTake2 && cur.type == CARD_TYPE.QuadrupleA2) {
                return false;
            }
            if (lastCards.length == 0) {
                if (rule.firstPlayRole == 1 && rule.firstPlaySpade3 == 1 && allCards.indexOf(31) != -1 && curCards.indexOf(31) == -1)
                    return false;
                return true;
            }
            else if (last.type == CARD_TYPE.Invalid) {
                if (last.stype == Invalid_Type.QuadrupleA3) {
                    if (cur.type == CARD_TYPE.Bomb || (cur.type == CARD_TYPE.Triple && cur.index == 14 && rule.isBombOfAaa))
                        return true;
                    else if (cur.stype == Invalid_Type.QuadrupleA3 && cur.index > last.index && rule.isFourTake3)
                        return true
                    else
                        return false;
                }
                return true;
            }
            else if (last.type > CARD_TYPE.Invalid && last.type < CARD_TYPE.Bomb) {//上次出牌为常规牌
                if (last.type == CARD_TYPE.Triple && last.index == 14 && rule.isBombOfAaa) {
                    return false;
                }
                else if (cur.type >= CARD_TYPE.Bomb) {//炸弹
                    return true;
                }
                else if (cur.type == CARD_TYPE.Triple && cur.index == 14 && rule.isBombOfAaa) {
                    return true;
                }
                else if (cur.type == last.type) {//相同牌型
                    if (lastCards.length != curCards.length)
                        return false;
                    if (cur.index > last.index && cur.count == last.count) {
                        return true;
                    }
                    return false;
                }
                else {//不同牌型
                    return false;
                }
            }
            else if (last.type == CARD_TYPE.Bomb) {//上次出牌为炸弹
                if (cur.type == CARD_TYPE.Triple && cur.index == 14 && rule.isBombOfAaa) {
                    return true;
                }
                if (cur.type < CARD_TYPE.Bomb) {
                    return false;
                }
                else if (cur.index > last.index) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {//上次出牌为火箭
                return false;
            }
        },

        //提示牌   return null或者牌组数组[][]
        calCards: function (lastCards, handCards, rule, isNextOnlyOne) {
            var result = [];
            var last = this.analysisCards(lastCards);
            var curAll = this.analysisCards(handCards);
            if (last.type == CARD_TYPE.Invalid) {
                if (last.stype == Invalid_Type.QuadrupleA3) {//四带三
                    var cardlist = this.kindSortCards(handCards);
                    for (var i = last.index + 1; i < 17; i++) {
                        if (cardlist[i].length == 4) {
                            var and1 = this.getAnd1(cardlist, [i], 3, 1);
                            if (and1) {
                                var t1 = [];
                                t1.push(cardlist[i][0], cardlist[i][1], cardlist[i][2], cardlist[i][3]);
                                and1.forEach(element => {
                                    t1.push(element);
                                });
                                result.push(t1);
                            }
                        }
                    }
                    for (var i = 3; i < 17; i++) {
                        if (cardlist[i].length == 4) {
                            result.push(cardlist[i]);
                        }
                        if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                            result.push(cardlist[i]);
                        }
                    }
                }
                else
                    return null;
            }
            //*************** 单张 *******************      
            else if (last.type == CARD_TYPE.Single) {
                var cardlist = this.kindSortCards(handCards);
                if (isNextOnlyOne) {
                    for (var i = 16; i > last.index; i--) {
                        if (cardlist[i].length >= 1) {
                            result.push([cardlist[i][0]]);
                        }
                    }
                }
                else {
                    for (var i = last.index + 1; i < 18; i++) {
                        if (cardlist[i].length == 1) {
                            result.push([cardlist[i][0]]);
                        }
                    }
                    for (var i = last.index + 1; i < 18; i++) {
                        if (cardlist[i].length == 2) {
                            result.push([cardlist[i][0]]);
                        }
                    }
                    for (var i = last.index + 1; i < 18; i++) {
                        if (cardlist[i].length == 3) {
                            result.push([cardlist[i][0]]);
                        }
                    }
                }
                for (var i = 3; i < 17; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 对子 *******************
            else if (last.type == CARD_TYPE.Double) {
                var cardlist = this.kindSortCards(handCards);
                for (var i = last.index + 1; i < 17; i++) {
                    if (cardlist[i].length == 2) {
                        var t1 = [];
                        t1.push(cardlist[i][0], cardlist[i][1]);
                        result.push(t1);
                    }
                }
                for (var i = last.index + 1; i < 17; i++) {
                    if (cardlist[i].length == 3) {
                        var t1 = [];
                        t1.push(cardlist[i][0], cardlist[i][1]);
                        result.push(t1);
                    }
                }
                for (var i = 3; i < 17; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 三不带 *******************
            else if (last.type == CARD_TYPE.Triple) {
                if (last.index == 14 && rule.isBombOfAaa)
                    return null;
                var cardlist = this.kindSortCards(handCards);
                for (var i = last.index + 1; i < 17; i++) {
                    if (cardlist[i].length == 3) {
                        var t1 = [];
                        t1.push(cardlist[i][0], cardlist[i][1], cardlist[i][2]);
                        result.push(t1);
                    }
                }
                for (var i = 3; i < 17; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 三带 *******************
            else if (last.type == CARD_TYPE.TripleA1) {
                var cardlist = this.kindSortCards(handCards);
                if (lastCards.length == 5) {//三带二
                    if (curAll.stype == Invalid_Type.TripleLess && rule.isSplayThreeTake && curAll.index > last.index) {//少带接完
                        result.push(handCards);
                        return result;
                    }
                    for (var i = last.index + 1; i < 17; i++) {
                        if (cardlist[i].length == 3) {
                            var and1 = this.getAnd1(cardlist, [i], 2, 1);
                            if (and1) {
                                var t1 = [];
                                t1.push(cardlist[i][0], cardlist[i][1], cardlist[i][2]);
                                and1.forEach(element => {
                                    t1.push(element);
                                });
                                result.push(t1);
                            }
                        }
                    }
                }
                for (var i = 3; i < 17; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 顺子 *******************
            else if (last.type == CARD_TYPE.SingleLine) {
                var cardlist = this.kindSortCards(handCards);
                for (var i = last.index + 1; i < 15; i++) {
                    var line = 0;
                    for (var j = 0; j < last.count; j++) {
                        if (cardlist[i - j].length > 0) {
                            line++;
                        }
                        else
                            break;
                    }
                    if (line == last.count) {
                        var t1 = [];
                        for (var j = 0; j < last.count; j++) {
                            t1.push(cardlist[i - j][0]);
                        }
                        result.push(t1);
                    }
                }
                for (var i = 3; i < 17; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 连对 *******************
            else if (last.type == CARD_TYPE.DoubleLine) {
                var cardlist = this.kindSortCards(handCards);
                for (var i = last.index + 1; i < 15; i++) {
                    var line = 0;
                    for (var j = 0; j < last.count; j++) {
                        if (cardlist[i - j].length > 1) {
                            line++;
                        }
                        else
                            break;
                    }
                    if (line == last.count) {
                        var t1 = [];
                        for (var j = 0; j < last.count; j++) {
                            t1.push(cardlist[i - j][0]);
                            t1.push(cardlist[i - j][1]);
                        }
                        result.push(t1);
                    }
                }
                for (var i = 3; i < 17; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 飞机不带 *******************
            else if (last.type == CARD_TYPE.TripleLine) {
                var cardlist = this.kindSortCards(handCards);
                for (var i = last.index + 1; i < 15; i++) {
                    var line = 0;
                    for (var j = 0; j < last.count; j++) {
                        if (cardlist[i - j].length > 2) {
                            line++;
                        }
                        else
                            break;
                    }
                    if (line == last.count) {
                        var t1 = [];
                        for (var j = 0; j < last.count; j++) {
                            t1.push(cardlist[i - j][0]);
                            t1.push(cardlist[i - j][1]);
                            t1.push(cardlist[i - j][2]);
                        }
                        result.push(t1);
                    }
                }
                for (var i = 3; i < 17; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 飞机 *******************
            else if (last.type == CARD_TYPE.TripleLineA1) {
                var cardlist = this.kindSortCards(handCards);
                if (lastCards.length == last.count * 5) {
                    if (curAll.stype == Invalid_Type.TripleLineLess && rule.isSplayThreeLineTake && curAll.index_max > last.index && curAll.line_max >= last.count && curAll.cardlength < 5 * last.count) {//少带接完
                        result.push(handCards);
                        return result;
                    }
                    for (var i = last.index + 1; i < 15; i++) {
                        var line = 0;
                        for (var j = 0; j < last.count; j++) {
                            if (cardlist[i - j].length > 2) {
                                line++;
                            }
                            else
                                break;
                        }
                        if (line == last.count) {
                            var t2 = [];
                            for (var j = 0; j < last.count; j++) {
                                t2.push(i - j);
                            }
                            var and1 = this.getAnd1(cardlist, t2, last.count * 2, 1);
                            if (and1) {
                                var t1 = [];
                                for (var j = 0; j < last.count; j++) {
                                    t1.push(cardlist[i - j][0]);
                                    t1.push(cardlist[i - j][1]);
                                    t1.push(cardlist[i - j][2]);
                                }
                                for (var j = 0; j < and1.length; j++) {
                                    t1.push(and1[j]);
                                }
                                result.push(t1);
                            }
                        }
                    }
                }
                else {
                    cc.error('飞机格式错误');
                    return null;
                }
                for (var i = 3; i < 17; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 四带二 *******************
            else if (last.type == CARD_TYPE.QuadrupleA2) {
                var cardlist = this.kindSortCards(handCards);
                if (lastCards.length == 6) {//带单
                    for (var i = last.index + 1; i < 17; i++) {
                        if (cardlist[i].length == 4) {
                            var and1 = this.getAnd1(cardlist, [i], 2, 1);
                            if (and1) {
                                var t1 = [];
                                t1.push(cardlist[i][0], cardlist[i][1], cardlist[i][2], cardlist[i][3]);
                                and1.forEach(element => {
                                    t1.push(element);
                                });
                                result.push(t1);
                            }
                        }
                    }
                }
                else {
                    cc.error('四带二格式错误');
                    return null;
                }
                for (var i = 3; i < 17; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 炸弹 *******************
            else if (last.type == CARD_TYPE.Bomb) {
                var cardlist = this.kindSortCards(handCards);
                for (var i = last.index + 1; i < 18; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 14 && rule.isBombOfAaa && cardlist[i].length == 3) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 王炸 *******************
            else {
                return null;
            }
            if (result.length > 0) {
                if (rule.isChaiBomb == false) {
                    for (var n = result.length - 1; n > -1; n--) {
                        var counts_all = this.countRepeatCards(handCards);
                        var counts_cp = this.countRepeatCards(result[n]);
                        if (rule.isBombOfAaa && counts_all[14] == 3 && counts_cp[14] > 0 && counts_cp[14] < 3) {
                            result.splice(n, 1);
                            continue;
                        }
                        if (rule.isBombOfAaa && counts_all[14] == 3 && counts_cp[14] == 3 && result[n].length > 3) {
                            result.splice(n, 1);
                            continue;
                        }
                        for (var k = 3; k < 14; k++) {
                            if (counts_all[k] == 4 && counts_cp[k] > 0 && counts_cp[k] < 4) {
                                result.splice(n, 1);
                                break;
                            }
                        }

                    }
                }
                return result;
            }
            else
                return null;
        },

        //托管出牌
        autoOutCards: function (lastCards, handCards) {
            if (lastCards == null || lastCards.length == 0) {
                var outCards = [];
                var cardlist = this.kindSortCards(handCards);
                for (var i = 3; i < cardlist.length; i++) {
                    if (cardlist[i].length > 0) {
                        cardlist[i].forEach(element => {
                            outCards.push(element);
                        });
                        return outCards;
                    }
                }
            }
            else {
                var calcards = this.calCards(lastCards, handCards);
                if (calcards == null || calcards.length == 0)
                    return null;
                else {
                    return calcards[0];
                }
            }
        },

        //每个位置牌数量统计
        countRepeatCards: function (cards) {
            var counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//0-17
            for (var i = 0; i < cards.length; i++) {
                counts[this.getCardValue(cards[i])]++;
            }
            return counts;
        },

        //最大重复 max:最大重复张数 count:不同大小张数 repeat:1到4个数
        maxRepeatNum: function (counts) {
            var max = 0, count = 0, repeat = [null, 0, 0, 0, 0];
            for (var i = 0; i < counts.length; i++) {
                if (counts[i] > 0) {
                    count++;
                    repeat[counts[i]]++;
                }
                if (counts[i] > max)
                    max = counts[i];
            }
            return [max, count, repeat];
        },

        //分类并排序
        kindSortCards: function (cards) {
            var cardlist = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];//0-17
            for (var i = 0; i < cards.length; i++) {
                cardlist[this.getCardValue(cards[i])].push(cards[i]);
            }
            for (var i = 3; i < cardlist.length; i++) {
                cardlist[i] = cardlist[i].sort(function (a, b) { return a - b; });
            }
            return cardlist;
        },

        //手牌显示排序
        sortShowCards: function (cards) {
            var cardlist = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];//0-17
            for (var i = 0; i < cards.length; i++) {
                cardlist[this.getCardValue(cards[i])].push(cards[i]);
            }
            for (var i = 3; i < cardlist.length; i++) {
                if (i == 17) {
                    cardlist[i] = cardlist[i].sort(function (a, b) { return b - a; });
                }
                else {
                    cardlist[i] = cardlist[i].sort(function (a, b) { return a - b; });
                }
            }
            var sort = [];
            for (var i = 17; i > 2; i--) {
                for (var j = 0; j < cardlist[i].length; j++) {
                    sort.push(cardlist[i][j]);
                }
            }
            return sort;
        },

        //出牌显示排序
        sortOutCards: function (cards) {
            var type = this.analysisCards(cards).type;
            switch (type) {
                case CARD_TYPE.Invalid:
                case CARD_TYPE.Single:
                case CARD_TYPE.Double:
                case CARD_TYPE.Triple:
                case CARD_TYPE.SingleLine:
                case CARD_TYPE.DoubleLine:
                case CARD_TYPE.TripleLine:
                case CARD_TYPE.Bomb:
                case CARD_TYPE.Rocket:
                    return this.sortShowCards(cards);
                case CARD_TYPE.TripleA1:
                case CARD_TYPE.TripleLineA1:
                    var cardlist = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];//0-17
                    for (var i = 0; i < cards.length; i++) {
                        cardlist[this.getCardValue(cards[i])].push(cards[i]);
                    }
                    for (var i = 3; i < cardlist.length; i++) {
                        if (i == 17) {
                            cardlist[i] = cardlist[i].sort(function (a, b) { return b - a; });
                        }
                        else {
                            cardlist[i] = cardlist[i].sort(function (a, b) { return a - b; });
                        }
                    }
                    var sort = [];
                    for (var i = 17; i > 2; i--) {
                        if (cardlist[i].length == 3) {
                            for (var j = 0; j < cardlist[i].length; j++) {
                                sort.push(cardlist[i][j]);
                            }
                        }
                    }
                    for (var i = 17; i > 2; i--) {
                        if (cardlist[i].length != 3) {
                            for (var j = 0; j < cardlist[i].length; j++) {
                                sort.push(cardlist[i][j]);
                            }
                        }
                    }
                    return sort;
                case CARD_TYPE.QuadrupleA2:
                    var cardlist = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];//0-17
                    for (var i = 0; i < cards.length; i++) {
                        cardlist[this.getCardValue(cards[i])].push(cards[i]);
                    }
                    for (var i = 3; i < cardlist.length; i++) {
                        if (i == 17) {
                            cardlist[i] = cardlist[i].sort(function (a, b) { return b - a; });
                        }
                        else {
                            cardlist[i] = cardlist[i].sort(function (a, b) { return a - b; });
                        }
                    }
                    var sort = [];
                    for (var i = 17; i > 2; i--) {
                        if (cardlist[i].length == 4) {
                            for (var j = 0; j < cardlist[i].length; j++) {
                                sort.push(cardlist[i][j]);
                            }
                        }
                    }
                    for (var i = 17; i > 2; i--) {
                        if (cardlist[i].length != 4) {
                            for (var j = 0; j < cardlist[i].length; j++) {
                                sort.push(cardlist[i][j]);
                            }
                        }
                    }
                    return sort;
                default:
                    break;
            }
        },

        //获取带牌 cardlist:手牌经过kindsort之后 indexlist:三牌的值{例如333444则为[3,4]} count:飞机数量 num:1.三带一 2.三带对
        getAnd1: function (cardlist, indexlist, count, num) {
            var ret = [];
            if (num == 1) {
                if (count == 1) {
                    for (var index = 1; index < 5; index++) {
                        if (ret.length > 0) {
                            break;
                        }
                        for (var i = 3; i < 18; i++) {
                            if (indexlist.indexOf(i) == -1) {
                                if (cardlist[i].length == index) {
                                    ret.push(cardlist[i][0]);
                                }
                            }
                        }
                    }
                    if (ret.length > 0) {
                        return ret;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    for (var index = 1; index < 5 && ret.length < count * num; index++) {
                        for (var i = 3; i < 18 && ret.length < count * num; i++) {
                            if (indexlist.indexOf(i) == -1) {
                                if (cardlist[i].length == index) {
                                    if (i == 17 && index == 2)//不能带双王
                                        continue;
                                    for (var j = 0; j < index && ret.length < count * num; j++) {
                                        ret.push(cardlist[i][j]);
                                    }
                                }
                            }
                        }
                    }
                    if (ret.length == count * num)
                        return ret;
                    else if (ret.length < count * num)
                        return null;
                    else {
                        cc.error("err::getAnd1 ret.length overflow");
                        return null;
                    }
                }
            }
            else if (num == 2) {
                if (count == 1) {
                    var total = 0;
                    for (var index = 2; index < 5; index++) {
                        if (total > 0) {
                            break;
                        }
                        for (var i = 3; i < 17; i++) {//不能带双王
                            if (indexlist.indexOf(i) == -1) {
                                if (cardlist[i].length == index) {
                                    ret[total] = [];
                                    ret[total].push(cardlist[i][0]);
                                    ret[total].push(cardlist[i][1]);
                                    total += 1;
                                }
                            }
                        }
                    }
                    if (total > 0) {
                        return ret;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    for (var index = 2; index < 5 && ret.length < count * num; index++) {
                        for (var i = 3; i < 17 && ret.length < count * num; i++) {//不能带双王
                            if (indexlist.indexOf(i) == -1) {
                                if (cardlist[i].length == index) {
                                    for (var j = 0; j < 2 * Math.floor(index / 2) && ret.length < count * num; j++) {
                                        ret.push(cardlist[i][j]);
                                    }
                                }
                            }
                        }
                    }
                    if (ret.length == count * num)
                        return ret;
                    else if (ret.length < count * num)
                        return null;
                    else {
                        cc.error("err::getAnd1 ret.length overflow");
                        return null;
                    }
                }
            }
            else {
                cc.error("err::getAnd1 num>2");
                return null;
            }
        },

        /**
         * 过滤emoji
         */
        filterEmoji: function (str) {
            var ranges = [
                '\ud83c[\udf00-\udfff]',
                '\ud83d[\udc00-\ude4f]',
                '\ud83d[\ude80-\udeff]'
            ];
            var reg = new RegExp(ranges.join('|'), 'g');
            return str.replace(reg, '');
        },
    },
});
module.exports = ddz_util;