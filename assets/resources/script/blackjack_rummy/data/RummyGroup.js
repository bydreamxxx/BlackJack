const GROUP_STATE = require("RummyData").GROUP_STATE;
const RummyData = require("RummyData").RummyData.Instance();

let RummyGroup = cc.Class({
    ctor(){
        this.cardList = [];
        this.state = GROUP_STATE.NO_GROUP;
    },

    addCard(card, notCheckState){
        this.cardsList.push(card);
        this.cardsList.sort(function (x, y) {
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });

        if(RummyData.isBaida(card)){
            if(card === 172){
                this.baidaListJoker.push(card);
            }else{
                this.baidaList.push(card);
                this.baidaList.sort(function (x, y) {
                    if (x < y) {
                        return -1;
                    }
                    if (x > y) {
                        return 1;
                    }
                    return 0;
                });
            }
        }else{
            this.normalList.push(card);
            this.normalList.sort(function (x, y) {
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            });
            this.colorList[card % 10]++;
        }

        if(!notCheckState){
            this.checkState();
        }
    },

    addCards(cardList){
        cardList.forEach(card=>{
            this.addCard(card, true);
        });

        this.checkState();
    },

    checkIsPure(){
        // for(let i = 0; i < list.length; i++){
        //     if(RummyData.isBaida(list[i])){
        //         return false;
        //     }
        // }

        // if(this.baidaList.length > 0){
        //     return false;
        // }

        if(!this.cardsList.every(item => this.cardsList[0] % 10 === item % 10)){
            return false;
        }

        let numArr = []

        if(Math.floor(this.cardsList[0] / 10) === 1 && Math.floor(this.cardsList[1] / 10) !== 2){//特殊处理QKA的情况
            for (let i=1 ;i < this.cardsList.length-1; i++) {
                numArr.push(Math.floor(this.cardsList[i+1] / 10) - Math.floor(this.cardsList[i] / 10))
            }

            numArr.push(Math.floor(this.cardsList[0] / 10) + 13 - Math.floor(this.cardsList[this.cardsList.length-1] / 10));
        }else{
            for (let i=0 ;i < this.cardsList.length-1; i++) {
                numArr.push(Math.floor(this.cardsList[i+1] / 10) - Math.floor(this.cardsList[i] / 10))
            }
        }

        //判断是否等差
        return numArr.every(item => numArr[0] === item) && numArr[0] === 1;
    },

    _checkIsImpure(baidaCount, list){
        let returnResult = true;
        if(Math.floor(list[0] / 10) === 1){
            let result = true;
            for (let i=0 ;i < list.length-1; i++) {//先判断是不是A23
                let count = Math.floor(list[i+1] / 10) - Math.floor(list[i] / 10);
                if(count > 1){
                    baidaCount -= (count - 1);

                    if(baidaCount < 0){//癞子牌用完了还没能成顺
                        result = false;
                        break;
                    }
                }

                if(list[0] % 10 !== list[i] % 10){//不同色
                    result = false;
                    break;
                }
            }

            if(list[0] % 10 !== list[list.length-1] % 10){//不同色
                result = false;
            }

            if(!result){//再判断QKA
                let tempList = list.concat();
                let first = tempList.shift();
                tempList.push(first+130);
                for (let i=0 ;i < tempList.length-1; i++) {
                    let count = Math.floor(tempList[i+1] / 10) - Math.floor(tempList[i] / 10);
                    if(count > 1){
                        baidaCount -= (count - 1);

                        if(baidaCount < 0){//癞子牌用完了还没能成顺
                            returnResult = false;
                            break;
                        }
                    }

                    if(tempList[0] % 10 !== tempList[i] % 10){//不同色
                        returnResult = false;
                        break;
                    }
                }

                if(tempList[0] % 10 !== tempList[tempList.length-1] % 10){//不同色
                    returnResult = false;
                }
            }
        }else{
            for (let i=0 ;i < list.length-1; i++) {
                let count = Math.floor(list[i+1] / 10) - Math.floor(list[i] / 10);
                if(count > 1){
                    baidaCount -= (count - 1);

                    if(baidaCount < 0) {//癞子牌用完了还没能成顺
                        returnResult = false;
                        break;
                    }
                }

                if(list[0] % 10 !== list[i] % 10){//不同色
                    returnResult = false;
                    break;
                }
            }

            if(list[0] % 10 !== list[list.length-1] % 10){//不同色
                returnResult = false;
            }
        }

        return returnResult;
    },

    checkIsImpure(){
        if(this.baidaList.length + this.baidaListJoker.length <= 0){
            return false;
        }

        if(this.baidaList.length + this.baidaListJoker.length >= 3 && this.normalList.length === 0){
            return true;
        }

        if(this.baidaList.length !== 0 && this.baidaListJoker.length !== 0){
            let list = this.normalList.concat(this.baidaList);
            list.sort(function (x, y) {
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            });
            let result = this._checkIsImpure(this.baidaListJoker.length, list);
            if(result){
                return true;
            }
        }

        return this._checkIsImpure(this.baidaList.length + this.baidaListJoker.length, this.normalList);
    },

    checkIsSet(){
        let baseItem = Math.floor(this.cardsList[0] / 10);

        return this.cardsList.length >= 3 && this.cardsList.length <= 4 && this.cardsList.every(item => baseItem === Math.floor(item / 10) || RummyData.isBaida(item)) && this.colorList.every(item => item <= 1);//没有重复花色
    },

    checkState(){
        if(this.cardsList.length <= 2) {
            this.state = GROUP_STATE.NO_GROUP;
        }else if(this.normalList.length <= 1){
            let list = this.normalList.concat(this.baidaList);
            list.sort(function (x, y) {
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            });
            if(this._checkIsImpure(this.baidaListJoker.length, list)){//百搭有joker有普通百搭，普通百搭牌面能跟普通牌组成顺子
                this.state = GROUP_STATE.IMPURE_STRAIGHT;
            }else{
                this.state = GROUP_STATE.STRAIGHT;
            }
        }else if(this.checkIsPure()){
            this.state = GROUP_STATE.PURE_STRAIGHT;
        }else if(this.checkIsImpure()){
            this.state = GROUP_STATE.IMPURE_STRAIGHT;
        }else if(this.checkIsSet()){
            this.state = GROUP_STATE.SET;
        }else{
            this.state = GROUP_STATE.NOT_CORRECT;
        }

        return this.state;
    },

    delCard(card, notCheckState){
        let index = this.cardsList.indexOf(card);
        if(index !== -1){
            this.cardsList.splice(index, 1);

            if(RummyData.isBaida(card)){
                if(card === 172){
                    this.baidaListJoker.pop();
                }else{
                    index = this.baidaList.indexOf(card);
                    this.baidaList.splice(index, 1);
                }
            }else{
                this.colorList[card % 10]--;
                index = this.normalList.indexOf(card);
                this.normalList.splice(index, 1);
            }
        }

        if(!notCheckState){
            this.checkState();
        }
    },

    delCards(cardList){
        cardList.forEach(card=>{
            this.delCard(card, true);
        });

        this.checkState();
    },

    getPoint(){
        let point = 0;
        this.normalList.forEach(card=>{
            let num = Math.floor(card / 10);
            if(num === 1 || num >= 10){
                point += 10;
            }else{
                point += num;
            }
        });
        return point;
    },

    getShowList(){
        let tempList = [];

        let sortFunc = (a, b)=>{
            let valueA = Math.floor(a / 10);
            let valueB = Math.floor(b / 10);

            if(valueA !== 1 && valueB === 1){
                return -1;
            }else if(valueA === 1 && valueB !== 1){
                return 1;
            }else{
                if (valueA < valueB) {
                    return -1;
                }
                if (valueA > valueB) {
                    return 1;
                }

                let colorA = a % 10;
                let colorB = b % 10;

                if (colorA < colorB) {
                    return -1;
                }
                if (colorA > colorB) {
                    return 1;
                }
            }

            return 0;
        };

        if(this.state === GROUP_STATE.IMPURE_STRAIGHT || this.state === GROUP_STATE.SET) {
            let tempNormalList = this.normalList.concat();
            let tempBaidaList = this.baidaList.concat(this.baidaListJoker);
            tempNormalList.sort(sortFunc);
            tempBaidaList.sort(sortFunc);

            let normalIndex = 0;
            let baidaIndex = 0;

            if(this.state === GROUP_STATE.IMPURE_STRAIGHT){
                if(Math.floor(tempNormalList[0] / 10) === 2){
                    tempList.push(0);
                }

                for (let i=0 ;i < tempNormalList.length-1; i++) {
                    tempList.push(tempNormalList[i]);
                    let count = Math.floor(tempNormalList[i+1] / 10) - Math.floor(tempNormalList[i] / 10);
                    if(count > 1){
                        for(let j = 0; j < count; j++){
                            tempList.push(0);
                        }
                    }
                }
                tempList.push(tempNormalList[tempNormalList.length-1]);

                if(Math.floor(tempNormalList[tempNormalList.length-1] / 10) !== 1){
                    tempList.push(0);
                }

                for(let i = tempList.length - 1; i >= 0; i--){
                    if(tempList[i] === 0){
                        if(tempBaidaList.length > 0){
                            tempList[i] = tempBaidaList.pop();
                        }else{
                            tempList.splice(i, 1);
                        }
                    }
                }

                for(let i = 0; i < tempBaidaList.length; i++){
                    tempList.push(tempBaidaList[i]);
                }
            }else{
                for(let i = 1; i < this.colorList.length; i++){
                    if(this.colorList[i] === 0){
                        if(baidaIndex < tempBaidaList.length){
                            tempList.push(tempBaidaList[baidaIndex]);
                            baidaIndex++;
                        }
                    }else{
                        if(normalIndex < tempNormalList.length){
                            tempList.push(tempNormalList[normalIndex]);
                            normalIndex++;
                        }
                    }
                }

                for(let i = normalIndex; i < tempNormalList.length; i++){
                    tempList.push(tempNormalList[i]);
                }
                for(let i = baidaIndex; i < tempBaidaList.length; i++){
                    tempList.push(tempBaidaList[i]);
                }
            }
        }else{
            tempList = this.cardsList.concat();
            tempList.sort(sortFunc);
        }
        return tempList;
    },

    init(cardList){
        this.cardsList = cardList.concat();
        this.cardsList.sort(function (x, y) {
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        this.normalList = [];
        this.baidaList = [];
        this.baidaListJoker = [];
        this.colorList = [1, 0, 0, 0, 0];//花色判断
        for(let i = 0; i < this.cardsList.length; i++){
            if(RummyData.isBaida(this.cardsList[i])){
                if(this.cardsList[i] === 172){
                    this.baidaListJoker.push(this.cardsList[i]);
                }else{
                    this.baidaList.push(this.cardsList[i]);
                }
            }else{
                this.normalList.push(this.cardsList[i]);
                this.colorList[this.cardsList[i] % 10]++;
            }
        }
        this.checkState();
    },

    isPure(){
        return this.state === GROUP_STATE.PURE_STRAIGHT;
    },

    isImPure(){
        return this.state === GROUP_STATE.IMPURE_STRAIGHT;
    },

    isStraight(){
        return this.state === GROUP_STATE.STRAIGHT;
    },

    isSet(){
        return this.state === GROUP_STATE.SET;
    },

    isNoCorrect(){
        return this.state === GROUP_STATE.NOT_CORRECT;
    },

    isNoGroup(){
        return this.state === GROUP_STATE.NO_GROUP;
    },

    toString(){
        return `cardList = ${this.cardsList.toString()}  normalList = ${this.normalList.toString()}  baidaList = ${this.baidaList.toString()} baidaListJoker = ${this.baidaListJoker.toString()} state = ${this.state}`
    }
});

module.exports = RummyGroup;