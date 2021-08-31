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
    Rocket: 11,      //火箭
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
            var ret = { type: CARD_TYPE.Invalid, index: -1, count: -1 };//返回值
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
                    if (counts[16] > 0 || counts[17] > 0) { //王和2
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
                    //火箭
                    if (counts[17] == 2) {
                        ret.type = CARD_TYPE.Rocket;
                        ret.index = 17;
                        ret.count = 1;
                        return ret;
                    }
                    //对子
                    else {
                        ret.type = CARD_TYPE.Double;
                        ret.index = this.getCardValue(cards[0]);
                        ret.count = 1;
                        return ret;
                    }
                }
                //连对
                else if (max_ret[1] > 2) {
                    if (counts[16] == 2 || counts[17] == 2) { //王和2
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
                else {
                    return ret;
                }
            }
            //*************************** 三张 *****************************
            // @spec 三带一和三带对类型相同 比较的时候加上牌张数的比较
            else if (max_ret[0] == 3) {
                if (cards.length == three * 3) {//三不带
                    if (three == 1) {//单三
                        ret.type = CARD_TYPE.Triple;
                        ret.index = this.getCardValue(cards[0]);
                        ret.count = 1;
                        return ret;
                    }
                    else {//多三
                        if (three == 4) {//fixed: 三飞机带同三张
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
                            if (line_max >= 3) {
                                ret.type = CARD_TYPE.TripleLine;
                                ret.index = index_max;
                                ret.count = line_max;
                                return ret;
                            }
                            else {
                                return ret;
                            }
                        }
                        else {
                            if (counts[16] == 3) { //排除2
                                return ret;
                            }
                            for (var i = 3; i < counts.length; i++) {
                                if (counts[i] == 3) {
                                    start = i;
                                    break;
                                }
                            }
                            for (var i = 14; i > 0; i--) {
                                if (counts[i] == 3) {
                                    end = i;
                                    break;
                                }
                            }
                            for (var i = start + 1; i < end; i++) {
                                if (counts[i] != 3) {
                                    return ret;
                                }
                            }
                            ret.type = CARD_TYPE.TripleLine;
                            ret.index = end;
                            ret.count = end - start + 1;
                            return ret;
                        }
                    }
                }
                else if (cards.length == three * (3 + 1)) {//三带一
                    if (three == 1) {//单三
                        var f = function () { for (var i = 3; i < counts.length; i++) { if (counts[i] == 3) return i; } };
                        ret.type = CARD_TYPE.TripleA1;
                        ret.index = f();
                        ret.count = 1;
                        return ret;
                    }
                    else {//多三
                        if (counts[16] == 3) { //排除2
                            return ret;
                        }
                        if (three == 2 && counts[17] == 2)//双飞不能带双王
                            return ret;
                        for (var i = 3; i < counts.length; i++) {
                            if (counts[i] == 3) {
                                start = i;
                                break;
                            }
                        }
                        for (var i = 14; i > 0; i--) {
                            if (counts[i] == 3) {
                                end = i;
                                break;
                            }
                        }
                        for (var i = start + 1; i < end; i++) {
                            if (counts[i] != 3) {
                                return ret;
                            }
                        }
                        ret.type = CARD_TYPE.TripleLineA1;
                        ret.index = end;
                        ret.count = end - start + 1;
                        return ret;
                    }
                }
                else if (cards.length == three * (3 + 2)) {//三带对
                    if (one != 0) {
                        return ret;
                    }
                    if (three == 1) {//单三
                        if (counts[17] == 2)//不能三带双王
                            return ret;
                        var f = function () { for (var i = 3; i < counts.length; i++) { if (counts[i] == 3) return i; } };
                        ret.type = CARD_TYPE.TripleA1;
                        ret.index = f();
                        ret.count = 1;
                        return ret;
                    }
                    else {//多三
                        if (counts[16] == 3 || counts[17] == 2) { //排除2  排除双王
                            return ret;
                        }
                        for (var i = 3; i < counts.length; i++) {
                            if (counts[i] == 3) {
                                start = i;
                                break;
                            }
                        }
                        for (var i = 14; i > 0; i--) {
                            if (counts[i] == 3) {
                                end = i;
                                break;
                            }
                        }
                        for (var i = start + 1; i < end; i++) {
                            if (counts[i] != 3) {
                                return ret;
                            }
                        }
                        ret.type = CARD_TYPE.TripleLineA1;
                        ret.index = end;
                        ret.count = end - start + 1;
                        return ret;
                    }
                }
                else {
                    if (cards.length == (three - 1) * 4) {
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
                        if (line_max >= three - 1) {
                            ret.type = CARD_TYPE.TripleLineA1;
                            ret.index = index_max;
                            ret.count = line_max;
                            return ret;
                        }
                        else {
                            return ret;
                        }
                    }
                    return ret;
                }
            }
            //*************************** 四张 *****************************
            //@spec  飞机可能包含四张相同牌
            else if (max_ret[0] == 4) {
                if (three > 0) {
                    if (cards.length % 4 == 0) {  //三带一
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
                        if (line_max >= (cards.length / 4)) {
                            ret.type = CARD_TYPE.TripleLineA1;
                            ret.index = index_max;
                            ret.count = line_max;
                            return ret;
                        }
                        else {
                            return ret;
                        }
                    }
                    else if (three == four * 2 + two && one == 0) {//三带对
                        if (counts[16] == 3) { //排除2
                            return ret;
                        }
                        for (var i = 3; i < counts.length; i++) {
                            if (counts[i] == 3) {
                                start = i;
                                break;
                            }
                        }
                        for (var i = 14; i > 0; i--) {
                            if (counts[i] == 3) {
                                end = i;
                                break;
                            }
                        }
                        for (var i = start + 1; i < end; i++) {
                            if (counts[i] != 3) {
                                return ret;
                            }
                        }
                        ret.type = CARD_TYPE.TripleLineA1;
                        ret.index = end;
                        ret.count = end - start + 1;
                        return ret;
                    }
                    else {
                        return ret;
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
                            if (counts[17] == 2)//不能四带双王
                                return ret;
                            ret.type = CARD_TYPE.QuadrupleA2;
                            ret.index = f();
                            ret.count = 1;
                            return ret;
                        }
                        else if (cards.length == 8) {//四带两对
                            if (counts[17] == 2)//不能四带双王
                                return ret;
                            if (two == 2) {
                                ret.type = CARD_TYPE.QuadrupleA2;
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
                    else {
                        return ret;
                    }
                }
            }
            else
                return ret;
        },

        //牌型比较
        compareCards: function (lastCards, curCards, forbid_4_2) {
            var last = this.analysisCards(lastCards);
            var cur = this.analysisCards(curCards);
            if (cur.type == CARD_TYPE.Invalid)//出牌无效
            {
                return false;
            }
            if (forbid_4_2 && cur.type == CARD_TYPE.QuadrupleA2) {
                return false;
            }
            if (last.type == CARD_TYPE.Invalid) {//上次出牌为空
                return true;
            }
            else if (last.type > CARD_TYPE.Invalid && last.type < CARD_TYPE.Bomb) {//上次出牌为常规牌
                if (cur.type >= CARD_TYPE.Bomb) {//炸弹
                    return true;
                }
                else if (cur.type == last.type) {//相同牌型
                    if (lastCards.length != curCards.length)
                        return false;
                    if (cur.index > last.index && cur.count == last.count) {
                        return true;
                    }
                    else {
                        if (curCards[0] == 172 && lastCards[0] == 171 && curCards.length == 1)//大小王比较
                            return true;
                        return false;
                    }
                }
                else {//不同牌型
                    return false;
                }
            }
            else if (last.type == CARD_TYPE.Bomb) {//上次出牌为炸弹
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
        calCards: function (lastCards, handCards) {
            var result = [];
            var last = this.analysisCards(lastCards);
            if (last.type == CARD_TYPE.Invalid) {
                return null;
            }
            //*************** 单张 *******************      
            else if (last.type == CARD_TYPE.Single) {
                var cardlist = this.kindSortCards(handCards);
                for (var i = last.index + 1; i < 18; i++) {
                    if (cardlist[i].length == 1) {
                        result.push([cardlist[i][0]]);
                    }
                }
                for (var i = last.index + 1; i < 18; i++) {
                    if (cardlist[i].length == 2) {
                        if (i == 17) {
                            result.push([cardlist[i][0]]);
                            result.push([cardlist[i][1]]);
                        } else {
                            result.push([cardlist[i][0]]);
                        }
                    }
                }
                for (var i = last.index + 1; i < 18; i++) {
                    if (cardlist[i].length == 3) {
                        result.push([cardlist[i][0]]);
                    }
                }
                if (last.index == 17) {
                    if (lastCards[0] == 171) {
                        if (cardlist[17][0] == 172) {
                            result.push([172]);
                        }
                    }
                }
                for (var i = 3; i < 18; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 17 && cardlist[i].length == 2) {
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
                for (var i = 3; i < 18; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 17 && cardlist[i].length == 2) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 三不带 *******************
            else if (last.type == CARD_TYPE.Triple) {
                var cardlist = this.kindSortCards(handCards);
                for (var i = last.index + 1; i < 17; i++) {
                    if (cardlist[i].length == 3) {
                        var t1 = [];
                        t1.push(cardlist[i][0], cardlist[i][1], cardlist[i][2]);
                        result.push(t1);
                    }
                }
                for (var i = 3; i < 18; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 17 && cardlist[i].length == 2) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 三带 *******************
            else if (last.type == CARD_TYPE.TripleA1) {
                var cardlist = this.kindSortCards(handCards);
                if (lastCards.length == 4) {//三带一
                    for (var i = last.index + 1; i < 17; i++) {
                        if (cardlist[i].length == 3) {
                            var and1 = this.getAnd1(cardlist, [i], 1, 1);
                            if (and1) {
                                for (var j = 0; j < and1.length; j++) {
                                    var t1 = [];
                                    t1.push(cardlist[i][0], cardlist[i][1], cardlist[i][2]);
                                    t1.push(and1[j])
                                    result.push(t1);
                                }
                            }
                        }
                    }
                }
                else {//三带对
                    for (var i = last.index + 1; i < 17; i++) {
                        if (cardlist[i].length == 3) {
                            var and1 = this.getAnd1(cardlist, [i], 1, 2);
                            if (and1) {
                                for (var j = 0; j < and1.length; j++) {
                                    var t1 = [];
                                    t1.push(cardlist[i][0], cardlist[i][1], cardlist[i][2]);
                                    t1.push(and1[j][0], and1[j][1]);
                                    result.push(t1);
                                }
                            }
                        }
                    }
                }
                for (var i = 3; i < 18; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 17 && cardlist[i].length == 2) {
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
                for (var i = 3; i < 18; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 17 && cardlist[i].length == 2) {
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
                for (var i = 3; i < 18; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 17 && cardlist[i].length == 2) {
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
                for (var i = 3; i < 18; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 17 && cardlist[i].length == 2) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 飞机 *******************
            else if (last.type == CARD_TYPE.TripleLineA1) {
                var cardlist = this.kindSortCards(handCards);
                //带一
                if (lastCards.length == last.count * 4) {
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
                            var and1 = this.getAnd1(cardlist, t2, last.count, 1);
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
                //带对
                else if (lastCards.length == last.count * 5) {
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
                            var and1 = this.getAnd1(cardlist, t2, last.count, 2);
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
                for (var i = 3; i < 18; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 17 && cardlist[i].length == 2) {
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
                else if (lastCards.length == 8) {//带对
                    for (var i = last.index + 1; i < 17; i++) {
                        if (cardlist[i].length == 4) {
                            var and1 = this.getAnd1(cardlist, [i], 2, 2);
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
                for (var i = 3; i < 18; i++) {
                    if (cardlist[i].length == 4) {
                        result.push(cardlist[i]);
                    }
                    if (i == 17 && cardlist[i].length == 2) {
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
                    if (i == 17 && cardlist[i].length == 2) {
                        result.push(cardlist[i]);
                    }
                }
            }
            //*************** 王炸 *******************
            else {
                return null;
            }
            if (result.length > 0)
                return result;
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