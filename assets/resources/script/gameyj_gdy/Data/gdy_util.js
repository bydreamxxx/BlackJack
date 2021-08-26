//牌类型
const CARD_TYPE = cc.Enum({
    Invalid: 0,     //无效牌型
    Single: 1,      //单牌
    Double: 2,      //对子
    SingleLine: 3,   //单顺
    DoubleLine: 4,   //双顺
    BOMB: 5,        //炸弹
});



var gdy_util = cc.Class({
    statics: {
        //获取牌值
        getCardValue: function (Card) {
            return Math.floor(Card / 10);
        },

        //每个位置牌数量统计
        countRepeatCards: function (cards) {
            var counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//0-18
            for (var i = 0; i < cards.length; i++) {
                counts[this.getCardValue(cards[i])]++;
            }
            return counts;
        },

        //最大重复 max:最大重复张数 count:不同大小张数 repeat:1到6个数
        maxRepeatNum: function (counts) {
            var max = 0, count = 0, repeat = [null, 0, 0, 0, 0, 0, 0];
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

        /**
         * 判断是否有王牌
         */
        checkWang: function (counts) {
            if (!counts)
                return false;
            if (counts[18] > 0)
                return true;
            return false;
        },

        /**
         * 有几张癞子
         */
        getLazi: function (counts) {
            return counts[18].length > 0 ? 1 : 0;
        },

        /**
         * 王炸
         */
        checkWangBomb: function (counts, ret) {
            var isWang = false;
            if (counts[18] == 2)
                isWang = true;
            for (var i = 0; i < counts.length; ++i) {
                if (counts[i] > 0 && i < 18)
                    isWang = false;
            }
            if (isWang) {
                ret.type = CARD_TYPE.BOMB;
                ret.index = 18;
                ret.count = 4;
            }
        },

        /**
         * 获取炸弹类型
         */
        getBomb: function (counts) {
            var ret = { type: CARD_TYPE.Invalid, index: -1, count: -1 };//返回值
            if (!counts || counts.length == 0)
                return ret;

            this.checkWangBomb(counts, ret);
            if (ret.type == CARD_TYPE.BOMB)
                return ret;


            var index = 0;
            for (var i = 0; i < counts.length; ++i) {
                if (i > 16)
                    continue;
                if (index > 0 && counts[i] > 0)
                    return ret;
                if (counts[i] > 0)
                    index = i;
            }
            var num = counts[18] > 0 ? 1 : 0;
            var len = index == 16 ? counts[index] : num + counts[index];
            if (len >= 3) {
                ret.type = CARD_TYPE.BOMB;
                ret.index = index;
                ret.count = len;
            }
            return ret;
        },

        /**
         * 获取对子
         */
        getDouble: function (counts, ret) {
            var index = 0;
            for (var i = 3; i < 16; ++i) {
                if (counts[i] > 0 && index == 0)
                    index = i;
                else if (counts[i] > 0 && index > 0)
                    return ret;
            }
            if (counts[18] == 1 && index > 0) {
                ret.index = index;
                ret.type = CARD_TYPE.Double;
                ret.count = 1;
            }
        },

        /**
         * 获取顺子
         */
        getLeLine: function (counts, ret, num) {
            var start = -1, end = -1;
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

            if (end - start == 0) return ret;

            var lazinum = counts[18] > 0 ? 1 : 0;
            var isLeLine = true;
            for (var i = start; i <= end; i++) {
                if (counts[i] < num) {
                    isLeLine = false;
                    if (counts[i] + lazinum == num) {
                        --lazinum;
                        isLeLine = true;
                    }
                }
                if (!isLeLine) {
                    return ret;
                }
            }

            //剩余癞子
            if (lazinum > 0) {
                this.fillCard(lazinum, start, end, ret, num);
            } else {
                if (num == 1)
                    ret.type = CARD_TYPE.SingleLine;
                else
                    ret.type = CARD_TYPE.DoubleLine;
                ret.index = start;
                ret.count = end - start + 1;
            }
            return ret;
        },

        /**
         * 补牌
         */
        fillCard: function (lazinum, start, end, ret, num) {
            if (lazinum <= 0) {
                return ret;
            }

            if (num == 1)
                ret.type = CARD_TYPE.SingleLine;
            else
                ret.type = CARD_TYPE.DoubleLine;
            ret.index = start;
            ret.count = end - start + 1;
            if (start == 3 && end == 14) return ret;
            lazinum--;
            if (end == 14) {
                ret.index = start - 1;
                ret.count += 1;
            } else {
                ret.index = end + 1;
                ret.count += 1;
            }
            this.fillCard(lazinum, start, ret.index, ret, num);
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
            //*************************** 全单 *****************************
            if (max_ret[0] == 1) {
                if (max_ret[1] == 1 && this.getCardValue(cards[0]) != 18) {
                    ret.type = CARD_TYPE.Single;
                    ret.index = this.getCardValue(cards[0]);
                    ret.count = 1;
                    return ret;
                }
                if (max_ret[1] > 2) { //单顺
                    if (counts[16] > 0) { //2
                        return ret;
                    }
                    // var bombRet = this.getBomb(counts);
                    // if (bombRet.type == CARD_TYPE.Invalid) {
                    this.getLeLine(counts, ret, 1);
                    return ret;
                    // } else if (bombRet.type == CARD_TYPE.BOMB) {
                    //     return bombRet;
                    // }
                } else if (max_ret[1] == 2) {
                    this.getDouble(counts, ret);
                    return ret;
                } else {
                    return ret;
                }
            }
            //*************************** 对子 *****************************
            else if (max_ret[0] == 2) {
                var bombRet = this.getBomb(counts);
                if (bombRet.type == CARD_TYPE.BOMB) {
                    return bombRet;
                }
                //一对
                if (max_ret[1] == 1 && max_ret[0] == 2) {
                    ret.type = CARD_TYPE.Double;
                    ret.index = this.getCardValue(cards[0]);
                    ret.count = 1;
                    return ret;
                }
                //对顺
                else if (max_ret[1] > 1) {
                    var bombRet = this.getBomb(counts);
                    if (bombRet.type == CARD_TYPE.Invalid) {
                        this.getLeLine(counts, ret, 2);
                        return ret;
                    } else if (bombRet.type == CARD_TYPE.BOMB) {
                        return bombRet;
                    }
                }
                else {
                    return ret;
                }
            } else if (max_ret[0] >= 3) {
                var bombRet = this.getBomb(counts);
                ret.type = bombRet.type;
                ret.index = bombRet.index;
                ret.count = bombRet.count;
                return ret;
            }
            else
                return ret;
        },

        //分类并排序
        kindSortCards: function (cards) {
            var cardlist = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];//0-18
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

            //花色排序
            for (var i = 3; i < cardlist.length; i++) {
                cardlist[i] = cardlist[i].sort(function (a, b) { return a - b; });
            }

            for (var i = 18; i >= 3; i--) {
                this.getConversionList(cardlist[i], sort);
            }
            return sort;
        },

        /**
         * 补癞子
         */
        fillLazi: function (cardlist, result, road) {
            if (result.length < road)
                result.push(cardlist[18][0]);
        },

        /**
         * 获取炸弹
         */
        getBombs: function (cardlist, result, index, road) {
            for (var i = index; i < cardlist.length; ++i) {
                var wang = this.getLazi(cardlist);
                if (i < 16 && cardlist[i].length + wang >= road) {
                    var newcardlist = [];
                    this.getConversionList(cardlist[i], newcardlist);
                    this.fillLazi(cardlist, newcardlist, road);
                    result.push(newcardlist);
                } else if (i == 16 && cardlist[i].length >= road) {
                    var newcardlist = [];
                    this.getConversionList(cardlist[i], newcardlist);
                    result.push(newcardlist);
                }
            }
        },

        /**
         * 提示王炸
         */
        getWangBomb: function (cardlist, result) {
            var ret = { type: CARD_TYPE.Invalid, index: -1, count: -1 };//返回值
            this.checkWangBomb(cardlist, ret);
            if (ret.type == CARD_TYPE.BOMB) {
                var newcardlist = [];
                this.getConversionList(cardlist[18], newcardlist);
                result.push(newcardlist);
            }
        },

        /**
         * 提示--炸弹
         */
        hintBombs: function (cardlist, result, index, road) {
            if (!cardlist) return;
            this.getBombs(cardlist, result, index, road);
            for (var i = road + 1; i < 6; ++i) {
                this.getBombs(cardlist, result, 3, i);
                if (i == 4) {
                    this.getWangBomb(cardlist, result);
                }
            }
        },

        /**
         * 提示---单牌 对子
         */
        hintCards: function (cardlist, result, index, num) {
            if (cardlist != null) {
                var lazinum = cardlist[18].length;
                cc.log('hintCards:', lazinum);
                var calcard = cardlist[index];
                if (calcard.length > 0) {
                    var newcardlist = [];
                    if (num == 1) {
                        newcardlist.push(calcard[0]);
                        result.push(newcardlist);
                    } else if (num == 2) {
                        if (calcard.length == 1 && lazinum > 0) {
                            this.getConversionList(calcard, newcardlist);
                            this.fillLazi(cardlist, newcardlist, num);
                            result.push(newcardlist);
                        } else if (calcard.length >= 2){
                            newcardlist.push(calcard[0], calcard[1]);
                            result.push(newcardlist);
                        }     
                    }
                }
            }
            cc.log('===== : ',result.length);
        },

        /**
         * 提示---单顺
         */
        hintSingleLine: function (cardlist, result, index, count) {
            if (!cardlist || index + count > 14) return;
            var lazinum = this.getLazi(cardlist);
            var newcardlist = [];
            for (var i = index; i <= count; i++) {
                var card = cardlist[i];
                if (card.length > 0) {
                    newcardlist.push(card[0]);
                } else if (lazinum > 0) {
                    lazinum--;
                    this.fillLazi(cardlist, newcardlist, 1);
                }
            }

            if (newcardlist.length == count) {
                this.getConversionList(newcardlist, result);
            }
        },

        /**
         * 提示--双顺
         */
        hintDoubleLine: function (cardlist, result, index, count) {
            if (!cardlist || index + count > 14) return;
            var cards = [];
            var newcardlist = [];
            var lazinum = this.getLazi(cardlist);
            for (var i = index; i <= count; i++) {
                var card = cardlist[i];
                if (card.length >= 2) {
                    newcardlist.push(card[0]);
                    newcardlist.push(card[1]);
                } else if (card.length + lazinum >= 2) {
                    if (card.length > 0)
                        newcardlist.push(card[0]);
                    this.fillLazi(cardlist, newcardlist, 2);
                }
            }
            if (newcardlist.length == count)
                this.getConversionList(newcardlist, result);
        },


        //提示牌   return null或者牌组数组[][]
        calCards: function (lastCards, handCards) {
            var result = [];
            var last = this.analysisCards(lastCards);
            var cardlist = this.kindSortCards(handCards);
            if (last.type == CARD_TYPE.Invalid) {
                return null;
            }
            //*************** 单张 *******************      
            else if (last.type == CARD_TYPE.Single) {
                this.hintCards(cardlist, result, last.index + 1, 1);
                if (last.index < 16 && cardlist[16].length > 0)
                    this.hintCards(cardlist, result, 16, 1);
                this.hintBombs(cardlist, result, 3, 3);
            }
            //*************** 对子 *******************
            else if (last.type == CARD_TYPE.Double) {
                this.hintCards(cardlist, result, last.index + 1, 2);
                if (last.index < 16 && cardlist[16].length > 1)
                    this.hintCards(cardlist, result, 16, 2);
                this.hintBombs(cardlist, result, 3, 3);
            }
            //*************** 单顺 *******************
            else if (last.type == CARD_TYPE.SingleLine) {
                this.hintSingleLine(cardlist, result, last.index + 1, last.count);
                this.hintBombs(cardlist, result, 3, 3);
            }
            //*************** 双顺 *******************
            else if (last.type == CARD_TYPE.DoubleLine) {
                this.hintDoubleLine(cardlist, result, last.index + 1, last.count);
                this.hintBombs(cardlist, result, 3, 3);
            }
            //*************** 炸弹 *******************
            else if (last.type == CARD_TYPE.BOMB) {
                this.getBombs(cardlist, result, last.index, last.count);
            } else {
                return null;
            }

            if (result.length > 0)
                return result;
            else
                return null;
        },

        /**
         * 比较牌型
         */
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

            if (cur.type != CARD_TYPE.BOMB && last.type == cur.type && last.count == cur.count && last.index != cur.index) {
                if (cur.index == 16)
                    return true;
                if (cur.index - last.index == 1)
                    return true;
            } else if (cur.type == CARD_TYPE.BOMB && last.type == CARD_TYPE.BOMB) {
                return cur.count > last.count ? true : cur.index > last.index;
            } else if (cur.type == CARD_TYPE.BOMB && last.type != CARD_TYPE.BOMB)
                return true;
            return false;
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
                case CARD_TYPE.BOMB:
                    return this.sortShowCards(cards);
                default:
                    break;
            }
        },

        /**
         * 随机花色(复制牌)
         */
        mathDesignColor: function (card) {
            var ranValue = Math.floor(Math.random() * 4) + 1;
            var value = this.getCardValue(card) * 10 + ranValue;
            return value;
        },

        /**
         * 随机花色(复制牌值)
         */
        mathDesignColorNum: function (num) {
            var ranValue = Math.floor(Math.random() * 4) + 1;
            var value = num * 10 + ranValue;
            cc.log('复制后的牌值：', value);
            return value;
        },

        /**
         * 对子复合牌型
         */
        compositeDouble: function (cardlist, newcardlist) {
            var allCardlist = [];
            for (var i = 3; i < cardlist.length; ++i) {
                if (cardlist[i].length <= 0)
                    continue;
                if (i != 18)
                    this.getConversionList(cardlist[i], allCardlist);
                else {
                    //随机花色
                    var cardnum = this.mathDesignColor(allCardlist[0]);
                    allCardlist.push(cardnum);
                }
            }
            if (newcardlist)
                newcardlist.push(allCardlist);
            return newcardlist;
        },

        /**
         * 检查牌组里是否有相似牌值的牌
         */
        checkCard: function (cards, index) {
            if (!cards) return;
            var bl = false;
            for (var i = 0; i < cards.length; ++i) {
                var v = this.getCardValue(cards[i]);
                if (v == index)
                    bl = true;
            }
            return bl;
        },

        /**
         * 得到牌组对应下标的长度
         */
        checkCardNum: function (cards, index) {
            if (!cards) return;
            var cardlist = this.kindSortCards(cards); //分类牌集合
            return cardlist[index].length;
        },

        /**
         * 复合牌型(3-A 单牌)
         */
        compositSingleLine: function (cardlist, newcardlist) {
            var allCardlist = [];
            for (var i = 3; i < cardlist.length; ++i) {
                if (cardlist[i].length <= 0)
                    continue;
                if (i != 18)
                    this.getConversionList(cardlist[i], allCardlist);
                else {
                    var start = this.getCardValue(allCardlist[0]);
                    var end = this.getCardValue(allCardlist[allCardlist.length - 1]);
                    var universalNum = cardlist[18].length > 0 ? 1 : 0;

                    //癞子变化后
                    var universalFun = function (cardNum, list) {
                        if (universalNum > 0 && (cardNum > 2 && cardNum < 15)) {
                            --universalNum;
                            cc.log('癞子数量：', universalNum);
                            //随机花色
                            var cardnum = this.mathDesignColorNum(cardNum);
                            list.push(cardnum);
                        }
                    }.bind(this);
                    //顺子
                    var singleLine = [];
                    this.getConversionList(allCardlist, singleLine);
                    for (var j = start; j <= end; ++j) {
                        if (!this.checkCard(singleLine, j)) {
                            universalFun(j, singleLine);
                            newcardlist.push(singleLine);
                        }
                        if (end == j && universalNum > 0) {
                            if (start == 3 && end == 14) {
                                newcardlist.push(singleLine);
                                break;
                            }

                            if (start == 3) {
                                universalFun(end + 1, singleLine);
                                universalFun(end + 2, singleLine);
                                newcardlist.push(singleLine);
                            } else if (end == 14) {
                                universalFun(start - 1, singleLine);
                                universalFun(start - 2, singleLine);
                                newcardlist.push(singleLine);
                            } else {

                                var mathfun = function (cardNum, list) {
                                    if (cardNum > 2 && cardNum < 15) {
                                        //随机花色
                                        var cardnum = this.mathDesignColorNum(cardNum);
                                        list.push(cardnum);
                                    }
                                }.bind(this);

                                var t3 = [];
                                this.getConversionList(singleLine, t3);
                                for (var k = 1; k <= universalNum; ++k) {
                                    mathfun(end + k, t3);
                                }
                                if (t3.length > 0)
                                    newcardlist.push(t3);
                            }
                        }
                    }
                }
            }
            cc.log('复合牌型(3-A 单顺) :', newcardlist);
            return newcardlist;
        },

        /**
      * 复合牌型(3-A 对牌)
      */
        compositeDoubleLine: function (cardlist, newcardlist) {
            var allCardlist = [];
            for (var i = 0; i < cardlist.length; ++i) {
                if (cardlist[i].length <= 0)
                    continue;
                if (i != 18)
                    this.getConversionList(cardlist[i], allCardlist);
                else {
                    var start = this.getCardValue(allCardlist[0]);
                    var end = this.getCardValue(allCardlist[allCardlist.length - 1]);
                    var universalNum = cardlist[18].length > 0 ? 1 : 0;

                    //炸弹
                    if (start == end) {
                        var wanglist = [];
                        this.getConversionList(allCardlist, wanglist);
                        cardlist[18].forEach(function () {
                            //随机花色
                            var cardnum = this.mathDesignColorNum(start);
                            wanglist.push(cardnum);
                        }.bind(this));
                        newcardlist.push(wanglist);
                    } else {
                        //癞子变化后
                        var universalFun = function (cardNum, list) {
                            if (universalNum > 0 && cardNum > 0) {
                                --universalNum;
                                //随机花色
                                var cardnum = this.mathDesignColorNum(cardNum);
                                list.push(cardnum);
                            }
                        }.bind(this);

                        var doubleLineList = [];
                        this.getConversionList(allCardlist, doubleLineList);
                        for (var j = start; j <= end; ++j) {
                            if (this.checkCardNum(doubleLineList, j) == 1) {
                                universalFun(j, doubleLineList);
                            }
                        }
                        newcardlist.push(doubleLineList);
                    }
                }
            }
            cc.log('复合牌型(3-A 对顺) :', newcardlist);
            return newcardlist;
        },


        /**
         * 复合牌型(3-A 单牌)
         */
        compositSingleLine2: function (cardlist, newcardlist) {
            var allCardlist = [];
            for (var i = 3; i < cardlist.length; ++i) {
                if (cardlist[i].length <= 0)
                    continue;
                if (i != 18)
                    this.getConversionList(cardlist[i], allCardlist);
                else {
                    var start = this.getCardValue(allCardlist[0]);
                    var end = this.getCardValue(allCardlist[allCardlist.length - 1]);
                    var universalNum = cardlist[18].length;
                    //炸弹
                    if (start == end) {
                        var wanglist = [];
                        this.getConversionList(allCardlist, wanglist);
                        cardlist[18].forEach(function () {
                            //随机花色
                            var cardnum = this.mathDesignColorNum(start);
                            wanglist.push(cardnum);
                        }.bind(this));
                        newcardlist.push(wanglist);
                    }

                    //癞子变化后
                    var universalFun = function (cardNum, list) {
                        if (universalNum > 0 && (cardNum > 2 && cardNum < 15)) {
                            universalNum--;
                            //随机花色
                            var cardnum = this.mathDesignColorNum(cardNum);
                            list.push(cardnum);
                        }
                    }.bind(this);
                    //顺子
                    var singleLine = [];
                    this.getConversionList(allCardlist, singleLine);
                    for (var i = start; i <= end; ++i) {
                        if (newcardlist[i] <= 0) {
                            universalFun(i, singleLine);
                        }
                        if (end == i) {
                            if (start == 3 && end == 14) {
                                newcardlist.push(singleLine);
                                break;
                            }

                            if (start == 3) {
                                universalFun(end + 1, singleLine);
                                universalFun(end + 2, singleLine);
                                newcardlist.push(singleLine);
                            } else if (end == 14) {
                                universalFun(start - 1, singleLine);
                                universalFun(start - 2, singleLine);
                                newcardlist.push(singleLine);
                            } else {

                                var mathfun = function (cardNum, list) {
                                    if (cardNum > 2 && cardNum < 15) {
                                        //随机花色
                                        var cardnum = this.mathDesignColorNum(cardNum);
                                        list.push(cardnum);
                                    }
                                }.bind(this);

                                //第一种 *,*,7,8
                                var t1 = [];
                                this.getConversionList(singleLine, t1);
                                for (var i = 0; i < universalNum; ++i) {
                                    mathfun(start - (i + 1), t1);
                                }
                                if (t1.length > 0)
                                    newcardlist.push(t1);
                                //第二种 *,7,8,*
                                var t2 = [];
                                this.getConversionList(singleLine, t2);
                                if (universalNum == 2) {
                                    mathfun(start - 1, t2);
                                    mathfun(end + i, t2);
                                }
                                if (t2.length > 0)
                                    newcardlist.push(t2);

                                //第三种 7,8,*,*
                                var t3 = [];
                                this.getConversionList(singleLine, t3);
                                for (var i = 0; i < universalNum; ++i) {
                                    mathfun(end + (i + 1), t3);
                                }
                                if (t3.length > 0)
                                    newcardlist.push(t3);
                                //第四种  7，*，8，*
                                var t4 = [];
                                this.getConversionList(singleLine, t4);
                                if (universalNum == 2) {
                                    mathfun(start, t4);
                                    mathfun(end, t4);
                                }
                                if (t4.length > 0)
                                    newcardlist.push(t4);
                            }
                        }
                    }
                }
            }
            cc.log('复合牌型(3-A 单牌) :', newcardlist);
            return newcardlist;
        },

        /**
         * 复合牌型(3-A 对牌)
         */
        compositeDoubleLine2: function (cardlist, newcardlist) {
            var allCardlist = [];
            for (var i = 0; i < cardlist.length; ++i) {
                if (cardlist[i].length <= 0)
                    continue;
                if (i != 18)
                    this.getConversionList(cardlist[i], allCardlist);
                else {
                    var start = this.getCardValue(allCardlist[0]);
                    var end = this.getCardValue(allCardlist[allCardlist.length - 1]);
                    var universalNum = cardlist[18].length;

                    //炸弹
                    if (start == end) {
                        var wanglist = [];
                        this.getConversionList(allCardlist, wanglist);
                        cardlist[18].forEach(function () {
                            //随机花色
                            var cardnum = this.mathDesignColorNum(start);
                            wanglist.push(cardnum);
                        }.bind(this));
                        newcardlist.push(wanglist);
                    }

                    //癞子变化后
                    var universalFun = function (cardNum, list) {
                        if (universalNum > 0 && cardNum > 0) {
                            universalNum--;
                            //随机花色
                            var cardnum = this.mathDesignColorNum(cardNum);
                            list.push(cardnum);
                        }
                    }.bind(this);

                    var doubleLineList = [];
                    for (var i = start; i <= end; ++i) {
                        if (allCardlist[i].length == 0) {
                            var list = [];
                            universalFun(i, list);
                            universalFun(i, list);
                            doubleLineList.push(list);
                        } else if (allCardlist[i].length == 1) {
                            var list = [];
                            list.push(allCardlist[i]);
                            universalFun(i, list);
                            doubleLineList.push(list);
                        } else {
                            doubleLineList.push(allCardlist[i]);
                        }
                    }
                    //判断是否存在单牌
                    for (var i = 0; i < doubleLineList.length; ++i) {
                        if (doubleLineList[i].length < 2)
                            return newcardlist;
                    }

                    /**
                     * 第一种 **，77
                     */
                    if (universalNum > 1) {
                        var t1 = [];
                        this.getConversionList(doubleLineList, t1);
                        universalFun(start, t1);
                        universalFun(start, t1);
                        newcardlist.push(t1);
                    }

                    /**
                     * 第二种 77，**
                     */
                    if (universalNum > 1) {
                        var t2 = [];
                        this.getConversionList(doubleLineList, t2);
                        universalFun(start, t2);
                        universalFun(start, t2);
                        newcardlist.push(t2);
                    }

                }
            }
            cc.log('复合牌型(3-A 对牌) :', newcardlist);
            return newcardlist;
        },

        /**
         * 复合组合牌型（有癞子）
         */
        compositeCardType: function (cards) {
            var newcardlist = [];
            var cardlist = this.kindSortCards(cards); //分类牌集合
            if (!this.checkWang(cardlist))//没有癞子
                return newcardlist;
            var last = this.analysisCards(cards);
            if (last.type == CARD_TYPE.Invalid) //无效牌型
                return newcardlist;

            var counts = this.countRepeatCards(cards);//每种牌的张数
            //最大重复 max:最大重复张数 count:不同大小张数 repeat:1到6个数
            //[max, count, repeat];
            var max_ret = this.maxRepeatNum(counts);
            var max = max_ret[0];
            var count = max_ret[1];
            var repeat = max_ret[2];
            cc.log('牌型 max:', max, ' count:', count, " repeat:", repeat);

            //对子
            if (max == 1 && count == 2 && repeat[1] == 2) {
                this.compositeDouble(cardlist, newcardlist);
            }

            var isdan = false;
            for (var i = 3; i < cardlist.length; ++i) {
                if (cardlist[i].length >= 2)
                    isdan = true;
            }

            //3-A(单顺)
            if (max >= 1 && count >= 3 && !isdan) {
                this.compositSingleLine(cardlist, newcardlist);
            }
            var bl = repeat[2] == 1 || repeat[3] == 1 || repeat[4] == 1 ? true : false;
            //3-A(对顺)
            if (max >= 1 && count >= 2 && bl && isdan) {
                this.compositeDoubleLine(cardlist, newcardlist);
            }
            return newcardlist;
        },
    },
});

module.exports = gdy_util;