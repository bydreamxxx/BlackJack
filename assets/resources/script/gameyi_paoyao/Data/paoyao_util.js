//牌类型
const CARD_TYPE = cc.Enum({
    Invalid: 0,     //无效牌型
    Single: 1,      //单牌
    Double: 2,      //对牌
    SingleLine: 3,   //单顺
    DoubleLine: 4,   //对顺
    ThreeRoad: 5,  //三路
    FourRoad: 6,  //四路
    FiveRoad: 7,  //五路
    SixRoad: 8,  //六路
    SevenRoad: 9,  //七路
    EightRoad: 10,  //八路
    XIAO_YAO: 11, //小幺
    ZHOGN_YAO: 12, //中幺
    LAO_YAO: 13, //老幺
    LAOLAO_YAO: 14, //老老幺
});
var paoyao_util = cc.Class({
    statics: {
        //获取牌值
        getCardValue: function (Card) {
            return Math.floor(Card / 10);
        },

        /**
         * 幺牌
         */
        getYaoCard: function (cards) {
            var ret = { type: CARD_TYPE.Invalid, index: -1, count: -1 };//返回值
            var counts = this.countRepeatCards(cards);//每种牌的张数
            for (var i = 0; i < counts.length; ++i) {
                if (counts[4] > 0 && counts[14] == 1)
                    continue;
                if (counts[i] > 0)
                    return ret;
            }
            var card_a = counts[14];
            var card_4 = counts[4];

            if (card_a <= 0 || card_4 < 2)
                return ret;
            if (card_4 > 4)
                ret.type = CARD_TYPE.LAOLAO_YAO;
            else if (card_4 == 4)
                ret.type = CARD_TYPE.LAO_YAO;
            else if (card_4 == 3)
                ret.type = CARD_TYPE.ZHOGN_YAO;
            else if (card_4 == 2)
                ret.type = CARD_TYPE.XIAO_YAO;

            return ret;

        },

        /**
         * 复数王炸
         */
        getWangCard: function (cards) {
            var ret = { type: CARD_TYPE.Invalid, index: -1, count: -1 };//返回值
            var counts = this.countRepeatCards(cards);//每种牌的张数
            for (var i = 0; i < counts.length; ++i) {
                if ((i == 18 || i == 19) && counts[i] > 0)
                    continue;
                if (counts[i] > 0)
                    return ret;
            }

            var len = cards.length;
            var wang_one = cards[0];
            var wang_two = null;
            var wang_san = null;
            if (len == 2)
                wang_two = cards[1];
            else if (len == 3) {
                wang_two = cards[1];
                wang_san = cards[2];
            }


            switch (len) {
                case 2:
                    {
                        if (wang_one != wang_two) {
                            ret.type = CARD_TYPE.FourRoad;
                            ret.count = 4;
                        }
                        else if (wang_one == 181 && wang_two == 181) //对小王
                        {
                            ret.type = CARD_TYPE.ThreeRoad;
                            ret.count = 3;
                        }
                        else if (wang_one == 191 && wang_two == 191) //对大王
                        {
                            ret.type = CARD_TYPE.FiveRoad;
                            ret.count = 5;
                        }
                    }
                    break;
                case 3:
                    {
                        if (wang_one + wang_two + wang_san == 181 * 3 + 10) //两小王加大王
                        {
                            ret.type = CARD_TYPE.SixRoad;
                            ret.count = 6;
                        }
                        else if (wang_one + wang_two + wang_san == 191 * 3 - 10) //两大王加小王
                        {
                            ret.type = CARD_TYPE.SevenRoad;
                            ret.count = 7;
                        }
                    }
                    break;
                case 4:
                    ret.type = CARD_TYPE.EightRoad;
                    ret.count = 8;
                    break;
                default:
                    return ret;
            }

            ret.index = 18;
            return ret;
        },

        /**
         * 得到复数类型牌的数量
         */
        getCardTypeNum: function (type) {
            switch (type) {
                case CARD_TYPE.ThreeRoad: return 3;
                case CARD_TYPE.FourRoad: return 4;
                case CARD_TYPE.FiveRoad: return 5;
                case CARD_TYPE.SixRoad: return 6;
                case CARD_TYPE.SevenRoad: return 7;
                case CARD_TYPE.EightRoad: return 8;
            }
            return 0;
        },


        //牌型分析  返回type,index和count
        analysisCards: function (cards) {
            var ret = { type: CARD_TYPE.Invalid, index: -1, count: -1 };//返回值
            if (!cards || !cards.length || cards.length == 0) {
                return ret;
            }
            //幺牌
            var yao = this.getYaoCard(cards);
            if (yao.type != CARD_TYPE.Invalid)
                return yao;
            //复数王炸
            var wang = this.getWangCard(cards);
            if (wang.type != CARD_TYPE.Invalid)
                return wang;

            var counts = this.countRepeatCards(cards);//每种牌的张数
            var max_ret = this.maxRepeatNum(counts);
            var start = -1, end = -1;
            //*************************** 全单 *****************************
            if (max_ret[0] == 1) {
                if (max_ret[1] == 1) {
                    ret.type = CARD_TYPE.Single;
                    ret.index = this.getCardValue(cards[0]);
                    ret.count = 1;
                    return ret;
                }
                if (max_ret[1] > 2) { //单顺
                    if (counts[16] > 0 || counts[17] > 0 || counts[18] > 0 || counts[19] > 0) { //3和2
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
                    //对王
                    if (counts[18] == 2 || counts[19] == 2) {
                        return this.getWangCard(cards);
                    }
                    //对子
                    else {
                        ret.type = CARD_TYPE.Double;
                        ret.index = this.getCardValue(cards[0]);
                        ret.count = 1;
                        return ret;
                    }
                }
                //对顺
                else if (max_ret[1] > 2) {
                    if (counts[16] == 2 || counts[17] == 2 || counts[18] == 2 || counts[19] == 2) { //王和2和3
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
            } else if (max_ret[0] > 2 && max_ret[1] == 1) {
                ret.index = this.getCardValue(cards[0]);
                ret.count = max_ret[0];
                //max:最大重复张数 count:不同大小张数 repeat:1到8个数
                //*************************** 三路 *****************************
                if (max_ret[0] == 3)
                    ret.type = CARD_TYPE.ThreeRoad;
                //*************************** 四路 *****************************
                if (max_ret[0] == 4)
                    ret.type = CARD_TYPE.FourRoad;
                //*************************** 五路 *****************************
                if (max_ret[0] == 5)
                    ret.type = CARD_TYPE.FiveRoad;
                //*************************** 六路 *****************************
                if (max_ret[0] == 6)
                    ret.type = CARD_TYPE.SixRoad;
                //*************************** 七路 *****************************
                if (max_ret[0] == 7)
                    ret.type = CARD_TYPE.SevenRoad;
                //*************************** 八路 *****************************
                if (max_ret[0] == 8)
                    ret.type = CARD_TYPE.EightRoad;
                return ret;
            }
            else
                return ret;
        },

        //最大重复 max:最大重复张数 count:不同大小张数 repeat:1到8个数
        maxRepeatNum: function (counts) {
            var max = 0, count = 0, repeat = [null, 0, 0, 0, 0, 0, 0, 0, 0];
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

        //牌型比较
        compareCards: function (lastCards, curCards) {
            var last = this.analysisCards(lastCards);
            var cur = this.analysisCards(curCards);
            if (cur.type == CARD_TYPE.Invalid)//出牌无效
            {
                return false;
            }

            if (last.type == CARD_TYPE.Invalid) {//上次出牌为空
                return true;
            }
            else if (last.type > CARD_TYPE.Invalid && last.type < CARD_TYPE.LAO_YAO) {//上次出牌为常规牌
                if (cur.type == last.type) {//相同牌型
                    if (cur.index > last.index && cur.count == last.count) {
                        return true;
                    }
                }
                else {//不同牌型
                    if (last.type == CARD_TYPE.SingleLine && cur.type == CARD_TYPE.DoubleLine) {
                        if (cur.index > last.index && cur.count == last.count) {
                            return true;
                        }
                    } else if (last.type == CARD_TYPE.DoubleLine)
                        return cur.type > CARD_TYPE.ThreeRoad;
                    else if (last.type < CARD_TYPE.DoubleLine)
                        return cur.type >= CARD_TYPE.ThreeRoad;

                    if (cur.type > last.type && last.type > CARD_TYPE.DoubleLine) {
                        if (last.type == CARD_TYPE.XIAO_YAO)
                            return cur.type >= CARD_TYPE.FiveRoad;
                        else if (last.type == CARD_TYPE.ZHOGN_YAO)
                            return cur.type >= CARD_TYPE.SixRoad;
                        else if (cur.type == CARD_TYPE.XIAO_YAO)
                            return last.type < CARD_TYPE.FiveRoad;
                        else if (cur.type == CARD_TYPE.ZHOGN_YAO)
                            return last.type <= CARD_TYPE.SixRoad;
                        return true;
                    } else if (last.type == CARD_TYPE.XIAO_YAO)
                        return cur.type >= CARD_TYPE.FiveRoad;
                    else if (last.type == CARD_TYPE.ZHOGN_YAO)
                        return cur.type >= CARD_TYPE.SixRoad;

                }
            }
            else if (last.type == CARD_TYPE.LAO_YAO || last.type == CARD_TYPE.LAOLAO_YAO) {//上次出牌为老幺以上
                return false;
            }
            else {
                return false;
            }
        },

        /**
         * 提示————复数路炸弹
         * @param cards 牌组
         * @param result 整理后的集合
         * @param index 牌值大小
         * @param road 几路
         */
        getRoad(cards, result, index, road) {
            var a_Num = 0; //this.getMaxSortCardA(cards);
            for (var i = index + 1; i < cards.length; ++i) {
                if (a_Num > 0 && i == 4)
                    continue;
                if (i >= 18)
                    return;
                if (i == 14 && (cards[14].length - a_Num) == road) {
                    var cards_index = a_Num > 0 ? a_Num - 1 : 0;
                    //var a_cards = cards[14].splice(a_Num, road)
                    var a_cards = cards[14].slice(a_Num, road)
                    result.push(a_cards);
                }

                if (i != 14 && cards[i].length == road)
                    result.push(cards[i]);

            }
        },

        /**
         * 提示————复数王牌
         * @param cards 牌组
         * @param result 整理后的集合
         * @param index 牌值大小
         * @param road 几路
         */
        getWang: function (cards, result, index, road) {
            if (index == 18)
                ++road;
            var xiaowang = cards[18];
            var dawang = cards[19];
            var wangs = [];
            this.getConversionList(dawang, wangs);
            this.getConversionList(xiaowang, wangs);
            var ret = this.getWangCard(wangs);
            var cardNum = this.getCardTypeNum(ret.type);
            if (cardNum == road)
                result.push(wangs);
        },

        /**
         * 提示————幺牌
         * @param cards 牌组
         * @param result 整理后的集合
         * @param type 牌型
         * @param card4 4的数量
         */
        getYao: function (cards, result, type, card4) {
            var card_a = cards[14].slice(0, 1);
            var card_4 = cards[4].length >= card4 ? cards[4].slice(0, card4) : [];
            if (card_4.length <= 0)
                return;
            var cardlist = [];
            this.getConversionList(card_a, cardlist);
            this.getConversionList(card_4, cardlist);
            var ret = this.getYaoCard(cardlist);
            if (ret.type == type)
                result.push(cardlist);
        },

        /**
        * 提示————幺牌
        * @param cards 牌组
        * @param result 整理后的集合
        * @param type 牌型
        */
        getLAOYao: function (cards, result, type) {
            var card_a = cards[14].slice(0, 1);
            var card_4 = cards[4];
            var cardlist = [];
            this.getConversionList(card_a, cardlist);
            this.getConversionList(card_4, cardlist);
            var ret = this.getYaoCard(cardlist);
            if (ret.type == type)
                result.push(cardlist);
        },

        /**
         * 炸弹
         * @param cards 牌组
         * @param result 整理后的集合
         * @param index 牌值大小
         * @param road 几路
         */
        getBombs: function (cards, result, index, road) {
            var card_index = index;
            for (var i = road; i < 9; ++i) {
                this.getRoad(cards, result, card_index, i);
                this.getWang(cards, result, card_index, i);
                if (i == 4)
                    this.getYao(cards, result, CARD_TYPE.XIAO_YAO, 2);
                else if (i == 6)
                    this.getYao(cards, result, CARD_TYPE.ZHOGN_YAO, 3);
                else if (i == 8)
                    this.getYao(cards, result, CARD_TYPE.LAO_YAO, 4);
                card_index = 2;
            }
            this.getLAOYao(cards, result, CARD_TYPE.LAOLAO_YAO);
        },

        /**
         * 骑顺
         */
        getDoubleLine: function (cardlist, result, index, count) {
            for (var i = index + 1; i < 15; i++) {
                var line = 0;
                for (var j = 0; j < count; j++) {
                    if (cardlist[i - j].length > 1) {
                        line++;
                    }
                    else
                        break;
                }
                if (line == count) {
                    var t1 = [];
                    for (var j = 0; j < count; j++) {
                        var cards = cardlist[i - j];
                        if (j == 14) {
                            t1.push(cards[cards.length - 1]);
                            t1.push(cards[cards.length - 2]);
                        } else {
                            t1.push(cards[0]);
                            t1.push(cards[1]);
                        }
                    }
                    result.push(t1);
                }
            }
        },

        //提示牌   return null或者牌组数组[][]
        calCards: function (lastCards, handCards) {
            var result = [];
            var last = this.analysisCards(lastCards);
            var cardlist = this.kindSortCards(handCards);
            var card_a = this.getMaxSortCardA(cardlist);
            if (last.type == CARD_TYPE.Invalid) {
                return null;
            }
            //*************** 单张 *******************      
            else if (last.type == CARD_TYPE.Single) {
                var xiaowang = cardlist[18].length;
                var dawang = cardlist[19].length;
                for (var i = last.index + 1; i < 20; i++) {
                    if (xiaowang + dawang > 1 && (i == 18 || i == 19))
                        continue;
                    if (card_a > 0 && i == 4)
                        continue;
                    if (i == 14 && cardlist[14].length - card_a == 1) {
                        var cards = cardlist[14];
                        result.push([cards[cards.length - 1]]);
                    }
                    else if (i != 14 && cardlist[i].length == 1) {
                        result.push([cardlist[i][0]]);
                    }
                }

                for (var i = last.index + 1; i < 20; i++) {
                    if (xiaowang + dawang > 1 && (i == 18 || i == 19))
                        continue;
                    if (card_a > 0 && i == 4)
                        continue;
                    var cards = cardlist[i];
                    if (i == 14 && cardlist[14].length - card_a == 2) {
                        result.push([cards[cards.length - 1]]);
                    } else if (i != 14 && cardlist[i].length == 2) {
                        result.push([cards[cards.length - 1]]);
                    }
                }


                this.getBombs(cardlist, result, 2, 3);
            }
            //*************** 对子 *******************
            else if (last.type == CARD_TYPE.Double) {
                var cardlist = this.kindSortCards(handCards);
                for (var i = last.index + 1; i < 18; i++) {
                    if (card_a > 0 && i == 4)
                        continue;
                    if (i == 14) {
                        var len = cardlist[i].length;
                        if (len - card_a == 2) {
                            var t1 = [];
                            t1.push(cardlist[i][len - 1], cardlist[i][len - 2]);
                            result.push(t1);
                        }
                    }
                    else if (cardlist[i].length == 2) {
                        var t1 = [];
                        t1.push(cardlist[i][0], cardlist[i][1]);
                        result.push(t1);
                    }
                }
                this.getBombs(cardlist, result, 2, 3);
            }

            //*************** 顺子 *******************
            else if (last.type == CARD_TYPE.SingleLine) {
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
                            var cards = cardlist[i - j];
                            if (j == 14) {
                                ti.push(cards[card_a.length - 1])
                            } else {
                                t1.push(cards[0]);
                            }
                        }
                        result.push(t1);
                    }
                }
                //骑顺
                this.getDoubleLine(cardlist, result, last.index, last.count);
                this.getBombs(cardlist, result, 2, 3);
            }
            //*************** 对顺 *******************
            else if (last.type == CARD_TYPE.DoubleLine) {
                this.getDoubleLine(cardlist, result, last.index, last.count);
                this.getBombs(cardlist, result, 2, 4);
            }
            //*************** 三路 *******************
            else if (last.type == CARD_TYPE.ThreeRoad) {
                this.getBombs(cardlist, result, last.index, 3);
            }
            //*************** 四路 *******************
            else if (last.type == CARD_TYPE.FourRoad) {
                this.getBombs(cardlist, result, last.index, 4);
            }
            //*************** 五路 *******************
            else if (last.type == CARD_TYPE.FiveRoad) {
                this.getBombs(cardlist, result, last.index, 5);
            }
            //*************** 六路 *******************
            else if (last.type == CARD_TYPE.SixRoad) {
                this.getBombs(cardlist, result, last.index, 6);
            }
            //*************** 七路 *******************
            else if (last.type == CARD_TYPE.SevenRoad) {
                this.getBombs(cardlist, result, last.index, 7);
            }
            //*************** 八路 *******************
            else if (last.type == CARD_TYPE.EightRoad) {
                this.getBombs(cardlist, result, last.index, 8);
            }
            //*************** 小幺 *******************
            else if (last.type == CARD_TYPE.XIAO_YAO) {
                this.getBombs(cardlist, result, 2, 5);
            }
            //*************** 中幺 *******************
            else if (last.type == CARD_TYPE.ZHOGN_YAO) {
                this.getBombs(cardlist, result, 2, 7);
            }
            //*************** 老幺以上 *******************
            else if (last.type == CARD_TYPE.LAO_YAO || last.type == CARD_TYPE.LAOLAO_YAO) {
                return null;
            }
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
            var counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//0-19
            for (var i = 0; i < cards.length; i++) {
                counts[this.getCardValue(cards[i])]++;
            }
            return counts;
        },

        //分类并排序
        kindSortCards: function (cards) {
            var cardlist = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];//0-19
            for (var i = 0; i < cards.length; i++) {
                if (cardlist[this.getCardValue(cards[i])])
                    cardlist[this.getCardValue(cards[i])].push(cards[i]);
                else
                    cc.log(i + "为null");
            }
            for (var i = 3; i < cardlist.length; i++) {
                cardlist[i] = cardlist[i].sort(function (a, b) { return a - b; });
            }
            return cardlist;
        },

        //幺牌A的数量
        getMaxCardA: function (cards) {
            var counts = this.countRepeatCards(cards);//每种牌的张数
            var card_a = counts[14];
            var card_4 = counts[4];
            return this.getYaoCardA(card_a, card_4);
        },

        //幺牌A的数量
        getMaxSortCardA: function (cards) {
            var card_a = cards[14].length;
            var card_4 = cards[4].length;
            return this.getYaoCardA(card_a, card_4);
        },

        /**
         * 得到组合幺牌A的数量
         */
        getYaoCardA: function (card_a, card_4) {
            if (card_4 == 8)
                return card_a > 4 ? 4 : card_a;
            else if (card_4 >= 6)
                return card_a > 3 ? 3 : card_a;
            else if (card_4 >= 4)
                return card_a > 2 ? 2 : card_a;
            else if (card_4 >= 2)
                return card_a > 1 ? 1 : card_a;
            else
                return 0;
        },

        /**
         * 数组转换
         */
        getConversionList: function (cards, sort) {
            if (!cards || !sort)
                return
            for (var i = 0; i < cards.length; ++i) {
                sort.push(cards[i]);
            }
        },

        //手牌显示排序
        sortShowCards: function (cards) {
            var cardlist = this.kindSortCards(cards);
            var sort = [];

            //王
            var xiaowang = cardlist[18].length;
            var dawang = cardlist[19].length;
            var wangCards = [];
            if (xiaowang + dawang > 1) {
                var da_wang = cardlist[19].splice(0, cardlist[19].length);
                var xiao_wang = cardlist[18].splice(0, cardlist[18].length);
                this.getConversionList(da_wang, wangCards);
                this.getConversionList(xiao_wang, wangCards);
            }

            //幺牌
            var card_a = this.getMaxCardA(cards);
            if (card_a > 0) {
                for (var i = 0; i < card_a; i++) {
                    if (cardlist[14].length > 0) {
                        var a = cardlist[14].splice(0, 1);
                        console.log('排序------：' + a);
                        this.getConversionList(a, sort);
                    }
                }
                var card4 = cardlist[4].splice(0, cardlist.length)
                this.getConversionList(card4, sort);
            }

            if (wangCards.length > 0)
                this.getConversionList(wangCards, sort);

            //花色排序
            for (var i = 3; i < cardlist.length; i++) {
                cardlist[i] = cardlist[i].sort(function (a, b) { return a - b; });
            }

            //牌型排序
            cardlist.sort(function (a, b) {
                var a_cardNum = this.getCardValue(a[0]);
                var b_cardNum = this.getCardValue(b[0]);
                if (a.length > 2 || b.length > 2) {
                    if (a.length == b.length) {
                        return b_cardNum - a_cardNum;
                    }
                    return b.length - a.length;
                }
                else if (!a_cardNum)
                    return 1;
                else if (!b_cardNum)
                    return -1;
                else
                    return b_cardNum - a_cardNum;

            }.bind(this));

            for (var i = 0; i < 20; i++) {
                this.getConversionList(cardlist[i], sort);
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
                case CARD_TYPE.SingleLine:
                case CARD_TYPE.DoubleLine:
                case CARD_TYPE.ThreeRoad:
                case CARD_TYPE.FourRoad:
                case CARD_TYPE.FiveRoad:
                case CARD_TYPE.SixRoad:
                case CARD_TYPE.SevenRoad:
                case CARD_TYPE.EightRoad:
                case CARD_TYPE.XIAO_YAO:
                case CARD_TYPE.ZHOGN_YAO:
                case CARD_TYPE.LAO_YAO:
                case CARD_TYPE.LAOLAO_YAO:
                    return this.sortShowCards(cards);

                default:
                    break;
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
module.exports = paoyao_util;