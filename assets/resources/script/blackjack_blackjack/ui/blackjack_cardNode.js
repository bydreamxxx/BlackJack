const BlackJackData = require("BlackJackData").BlackJackData.Instance();

const START_X = 104;
const OFFSET_X = -140;

const POS = [cc.v2(-37, -30), cc.v2(-65, -45), cc.v2(-65,-13), cc.v2(-80, 56), cc.v2(-117,56)];

cc.Class({
    extends: cc.Component,

    properties: {
        chipZone: cc.Node,
        cardZone: cc.Node,
        chipLabel: cc.Label,
        point: cc.Label,
        choose: cc.Node,

        cardPrefab: cc.Prefab,
        chipPrefab: cc.Prefab,

        resultIcon: cc.Sprite,
        resultFrame: [cc.SpriteFrame],
        hand: cc.Node,
    },

    editor:{
        menu:"BlackJack/blackjack_cardNode"
    },

    ctor(){
        this.isRight = false;
        this.isBanker = false;
        this.isSelf = false;

        this.cardList = [];
        this.chipList = [];
        this.doubleList = [];
        this.insureList = [];
        this.resultList = [];
        this.resultDoubleList = [];

        this.waitFaPaiPoint = 0;
        this.index = 1;

        this.green = BlackJackData.minBet / 2;
        this.red = Math.floor((BlackJackData.maxBet - BlackJackData.minBet / 2) * 0.3) + BlackJackData.minBet / 2;
        this.blue = Math.floor((BlackJackData.maxBet - BlackJackData.minBet / 2) * 0.7) + BlackJackData.minBet / 2;
    },

    // onLoad(){
    //     this.hand.zIndex = 3000;
    //     this.hand.setSiblingIndex(3000);
    // },

    createPai(list, isWaitforFapai, isDouble){
        let point = 0;
        let Anum = 0;

        list.forEach(card=>{
            let num = cc.dd.Utils.translate21(card);
            if(num != null){
                point += num;
                if(num == 11){
                    Anum++;
                }
            }

            let node = cc.instantiate(this.cardPrefab);
            this.cardZone.addChild(node);

            // if(this.isRight) {
            //     for(let i = 0; i < this.cardList.length; i++){
            //         this.cardList[i].node.x = -START_X - (this.cardList.length - i) * (node.width + OFFSET_X);
            //     }
            //     node.x = -START_X;
            // }else{
                node.x = START_X + this.cardList.length * (node.width + OFFSET_X);
            // }

            // node.y = 40 * this.cardList.length;

            node.getComponent("blackjack_card").init(card, isWaitforFapai);

            this.cardList.push(node.getComponent("blackjack_card"));

            if(this.cardList.length == 3 && isDouble){
                node.rotation = 90;
                node.x += 40
                node.y = 42;
                // node.y = 42 + 40 * (this.cardList.length - 1);
            }
        });

        if(point > 21){
            let num = Math.ceil((point - 21)/10);
            if(num < Anum){
                point -= num * 10;
            }else{
                point -= Anum * 10;
            }
        }

        if(!isWaitforFapai){
            this.point.string = point.toString();
        }else{
            this.waitFaPaiPoint = point;
        }
        let cardShowNum = 0;
        this.cardList.forEach(card=>{
            if(card.node.active){}
            cardShowNum++;
        })
        this.point.node.parent.active = point > 0 && cardShowNum >= 1;
    },

    createChip(num, isWaitForAnima, isDouble, insure){
        if(!this.isBanker){
            if(isDouble){
                if(this.doubleList.length == 0){
                    this.createChouma(num / 2, isWaitForAnima, 1, false);
                    if(isWaitForAnima){
                        this.hand.x = POS[1].x + 25;
                        this.hand.y = POS[1].y - 24;
                        this.hand.active = true;
                        this.hand.zIndex = 3000;

                        if(AudioManager.getAudioID("blackjack_blackjack/audio/chips_pile") == -1) {
                            AudioManager.playSound("blackjack_blackjack/audio/chips_pile");
                        }

                        cc.tween(this.hand)
                            .show()
                            .to(0.8, {y: POS[1].y}, { easing: 'quintIn'})
                            .hide()
                            .start();

                        for(let i = 0; i < this.doubleList.length; i++){
                            let node = this.doubleList[i].node;
                            cc.tween(node)
                                .to(0.8, {y: POS[1].y + 1.2 * i}, { easing: 'quintIn'})
                                .start();
                        }
                    }
                }

                if(this.chipList.length == 0){
                    this.createChouma(num, false, 0, false);
                }
            }else{
                if(this.chipList.length == 0) {
                    this.createChouma(num, isWaitForAnima, 0, false);
                    if (isWaitForAnima) {
                        this.chipList.forEach(chip => {
                            cc.tween(chip.node)
                                .to(0.17, {scale: 0.5}, {easing: 'quintIn'})
                                .start();
                        })
                    }
                }
            }

            if(insure && BlackJackData.state == 3){
                if(this.insureList.length == 0) {
                    this.createChouma(insure, isWaitForAnima, 2);
                    if (isWaitForAnima) {
                        this.hand.x = POS[2].x + 25;
                        this.hand.y = POS[2].y - 24;
                        this.hand.active = true;
                        this.hand.zIndex = 3000;

                        if(AudioManager.getAudioID("blackjack_blackjack/audio/chips_pile") == -1) {
                            AudioManager.playSound("blackjack_blackjack/audio/chips_pile");
                        }

                        cc.tween(this.hand)
                            .show()
                            .to(0.8, {y: POS[2].y}, { easing: 'quintIn'})
                            .hide()
                            .start();

                        for (let i = 0; i < this.insureList.length; i++) {
                            let node = this.insureList[i].node;
                            cc.tween(node)
                                .to(0.8, {y: POS[2].y + 1.2 * i}, {easing: 'quintIn'})
                                .start();
                        }
                    }
                }
            }
        }
    },

    createChouma(num, isWaitForAnimam, type, isResult){
        let blueCount = Math.floor(num / this.blue);
        let redCount = Math.floor((num - blueCount * this.blue) / this.red);
        let greenCount = Math.floor((num - blueCount * this.blue - redCount * this.red) / this.green);

        let createChip = (color)=>{
            let node = cc.instantiate(this.chipPrefab);
            this.chipZone.addChild(node);

            node.getComponent("blackjack_chip").init(color);

            node.scaleX = 0.3;
            node.scaleY = 0.3;
            if(isResult){
                node.scaleX = 0.6;
                node.scaleY = 0.6;
                if(type == 0){
                    node.x = POS[3].x;
                    node.y = POS[3].y + 1.2 * this.resultList.length;
                    this.resultList.push(node.getComponent("blackjack_chip"));
                }else {
                    node.x = POS[4].x;
                    node.y = POS[4].y + 1.2 * this.resultList.length;
                    this.resultDoubleList.push(node.getComponent("blackjack_chip"));
                }
            }else if(type == 1){
                //double
                node.x = POS[1].x;
                if(isWaitForAnimam){
                    node.y = POS[1].y + 1.2 * this.doubleList.length - 20;
                }else{
                    node.y = POS[1].y + 1.2 * this.doubleList.length;
                }
                this.doubleList.push(node.getComponent("blackjack_chip"));
            }else if(type == 2){
                //insure
                node.x = POS[2].x;

                if(isWaitForAnimam) {
                    node.y = POS[2].y + 1.2 * this.insureList.length - 20;
                }else{
                    node.y = POS[2].y + 1.2 * this.insureList.length;
                }
                this.insureList.push(node.getComponent("blackjack_chip"));
            }else {
                if(isWaitForAnimam){
                    node.scaleX = 0.8;
                    node.scaleY = 0.8;
                    node.y = 2 * this.chipList.length;
                }else{
                    node.x = POS[0].x;
                    node.y = POS[0].y + 1.2 * this.chipList.length;
                }
                this.chipList.push(node.getComponent("blackjack_chip"));
            }
        }

        for(let i = 0; i < greenCount; i++){
            createChip(0);
        }
        for(let i = 0; i < redCount; i++){
            createChip(1);
        }
        for(let i = 0; i < blueCount; i++){
            createChip(2);
        }
    },

    /**
     * 初始化
     * @param betInfo
     * @param isRight
     * @param isBanker
     * @param isSelf
     */
    init(betInfo, isRight, isBanker, isSelf){
        this.isRight = isRight;
        this.isBanker = isBanker;
        this.isSelf = isSelf;

        // if(this.isRight){
        //     this.cardZone.anchorX = 1;
        //     this.cardZone.x = 37.982;
        // }else{
        //     this.cardZone.anchorX = 0;
        //     this.cardZone.x = -37.982;
        // }

        if(this.isBanker){
            this.cardZone.x = -48.512;
            this.cardZone.y = 41.48;
            this.cardZone.scaleX = 0.399;
            this.cardZone.scaleY = 0.399;
        }

        if(this.isSelf){
            this.point.node.parent.y = 147.064;
            this.chipLabel.node.parent.y = -15.131;
            this.choose.y =  -15.131;
            this.cardZone.scaleX = 0.399;
            this.cardZone.scaleY = 0.399;

            POS[0] = cc.v2(-37, -43.327);
            POS[1] = cc.v2(-65, -58.327);
            POS[2] = cc.v2(-65,-26.327);
            POS[3] = cc.v2(-80, 75.991);
            POS[4] = cc.v2(-117,75.991);
        }

        this.cardList = [];
        this.chipList = [];
        this.doubleList = [];
        this.insureList = [];
        this.resultList = [];

        if(this.isBanker){
            this.index = 1;

            this.chipZone.active = false;
            this.chipLabel.node.parent.active = false;

            this.createPai(betInfo.cardsList, false);
        }else{
            this.betInfo = betInfo;
            this.index = betInfo.index;
            this.chipLabel.string = (betInfo.value + betInfo.insure).toString();

            this.chipLabel.node.parent.active = (betInfo.value + betInfo.insure) > 0;

            this.createChip(betInfo.value, false, betInfo.type == 1, betInfo.insure, false);
            this.createPai(betInfo.cardsList, false, betInfo.type == 1);
        }
    },

    // /**
    //  * 拆分
    //  * @param cardsList
    //  * @param isRight
    //  * @param isBanker
    //  * @param isSelf
    //  * @param index
    //  * @param bet
    //  */
    // splitInfo(cardsList, isRight, isBanker, isSelf, index, bet){
    //     this.isRight = isRight;
    //     this.isBanker = isBanker;
    //     this.isSelf = isSelf;
    //
    //     if(this.isRight){
    //         this.cardZone.anchorX = 1;
    //         this.cardZone.x = 73.507;
    //     }else{
    //         this.cardZone.anchorX = 0;
    //         this.cardZone.x = -18.904;
    //     }
    //
    //     if(isSelf){
    //
    //     }
    //
    //     this.cardList = [];
    //     this.index = index;
    //
    //     // this.betInfo = betInfo;
    //     this.chipLabel.string = bet;
    //     this.chipLabel.node.parent.active = !this.isBanker && bet > 0;
    //
    //     this.createPai(cardsList, true);
    // },

    /**
     * 更新信息
     * @param data
     */
    updateInfo(data, isSplit){
        this.betInfo = data;
        this.index = data.index;

        this.chipLabel.string = (data.value + data.insure).toString();
        this.chipLabel.node.parent.active = !this.isBanker && (data.value + data.insure) > 0;

        this.createChip(data.value, !isSplit, data.type == 1, data.insure, false);
        this.updateCards(data.cardsList, false, data.type == 1);
    },

    /**
     * 更新牌堆
     * @param cardsList
     * @param isWaitforFapai
     */
    updateCards(cardsList, isWaitforFapai, isDouble){
        let point = 0;
        let Anum = 0;

        for(let i = 0; i < cardsList.length; i++){
            let card = cardsList[i];
            if(this.cardList[i]){
                if(this.cardList[i].getCard() != card){
                    cc.tween(this.cardList[i].node)
                        .to(0.2, {scaleX: 0})
                        .call(()=>{
                            this.cardList[i].change(card);
                        })
                        .to(0.2, {scaleX: 1})
                        .call(()=>{
                            this.cardList[i].setShow();
                        })
                        .start();
                    isWaitforFapai = false;
                }
            }else{
                let node = cc.instantiate(this.cardPrefab);
                this.cardZone.addChild(node);

                // if(this.isRight) {
                //     for(let i = 0; i < this.cardList.length; i++){
                //         this.cardList[i].node.x = -START_X - (this.cardList.length - i) * (node.width + OFFSET_X);
                //     }
                //     node.x = -START_X;
                // }else{
                    node.x = START_X + this.cardList.length * (node.width + OFFSET_X);
                // }

                // node.y = 40 * this.cardList.length;

                if(this.cardList.length >= 2){
                    isWaitforFapai = true;
                }
                node.getComponent("blackjack_card").init(card, isWaitforFapai);

                this.cardList.push(node.getComponent("blackjack_card"));

                if(this.cardList.length == 3 && isDouble){
                    node.rotation = 90;
                    node.x += 40;
                    node.y = 42;
                    // node.y = 42 + 40 * (this.cardList.length - 1);
                }
            }

            let num = cc.dd.Utils.translate21(card);
            if(num != null){
                point += num;
                if(num == 11){
                    Anum++;
                }
            }
        }

        if(this.cardList.length > cardsList.length){
            for(let i = this.cardList.length - 1; i >= cardsList.length; i--){
                let node = this.cardList[i].node;
                node.removeFromParent();
                node.destroy();
                this.cardList.splice(i, 1);
            }
        }

        if(point > 21){
            let num = Math.ceil((point - 21)/10);
            if(num < Anum){
                point -= num * 10;
            }else{
                point -= Anum * 10;
            }
        }
        if(!isWaitforFapai){
            this.point.string = point.toString();
        }else{
            this.waitFaPaiPoint = point;
        }
        let cardShowNum = 0;
        this.cardList.forEach(card=>{
            if(card.node.active){
                cardShowNum++;
            }
        })
        this.point.node.parent.active = point > 0 && cardShowNum >= 1;
    },

    showChoose(){
        this.choose.active = true;
    },

    hideChoose(){
        this.choose.active = false;
    },

    fapai(startNode, func, isDouble){
        let card = null;
        let index = 0;
        for(let i = 0; i < this.cardList.length; i++){
            if(!this.cardList[i].isActive){
                card = this.cardList[i];
                card.isActive = true;
                index = i;
                break;
            }
        }

        if(card){
            let node = cc.instantiate(this.cardPrefab);
            this.cardZone.addChild(node);
            let worldPos = startNode.convertToWorldSpace(cc.v2(0, 0));
            let startPos = this.cardZone.convertToNodeSpace(worldPos);
            let endPos = card.node.position
            node.position = startPos;
            node.opacity = 0;
            node.getComponent("blackjack_card").init(0);

            let move = cc.tween()
                    .to(1, {opacity: 255, position: { value: endPos, easing: 'quintOut' }});

            if(isDouble){
                move = cc.tween()
                    .to(1, {opacity: 255, position: { value: endPos, easing: 'quintOut' }, rotation: 90});
            }

            let scale = cc.tween()
                .to(0.2, {scaleX: 0}, { easing: 'quintIn'})
                .call(()=>{
                    if(AudioManager.getAudioID("blackjack_blackjack/audio/card_flip") == -1) {
                        AudioManager.playSound("blackjack_blackjack/audio/card_flip");
                    }
                    node.getComponent("blackjack_card").change(card.getCard());
                })
                .to(0.2, {scaleX: 1}, { easing: 'quintOut'});

            let end = cc.tween()
                .call(()=>{
                    card.setShow();
                    if(index === this.cardList.length - 1){
                        this.point.string = this.waitFaPaiPoint.toString();
                        this.point.node.parent.active = true;

                        if(this.waitFaPaiPoint > 21 && this.isBanker){
                            this.point.node.color = cc.Color.RED;
                        }

                        if(this.cardList.length == 2){
                            if(this.isBJ()){
                                if(!this.isBanker){
                                    if(AudioManager.getAudioID("blackjack_blackjack/audio/blackjack_sound") == -1) {
                                        AudioManager.playSound("blackjack_blackjack/audio/blackjack_sound");
                                    }
                                }
                                this.resultIcon.spriteFrame = this.resultFrame[3];
                                this.resultIcon.node.parent.scaleX = 1.3;
                                this.resultIcon.node.parent.scaleY = 1.3;
                                this.resultIcon.node.parent.active = true;
                                cc.tween(this.resultIcon.node.parent)
                                    .to(0.17, {scale: 1}, {easing: 'quintIn'})
                                    .start();
                            }
                        }

                        if(func){
                            func();
                        }
                    }
                })
                .hide()
                .removeSelf();

            if(AudioManager.getAudioID("blackjack_blackjack/audio/card_deal") == -1) {
                AudioManager.playSound("blackjack_blackjack/audio/card_deal");
            }

            if(card.getCard() == node.getComponent("blackjack_card").getCard()){
                cc.tween(node)
                    .then(move)
                    .then(end)
                    .start();

            }else{
                cc.tween(node)
                    .then(move)
                    .then(scale)
                    .then(end)
                    .start();
            }
        }
    },

    /**
     * 移到筹码区
     */
    changeChipPos(){
        for(let i = 0; i < this.chipList.length; i++){
            let node = this.chipList[i].node;
            cc.tween(node)
                .to(0.5, {scale: 0.3, x: POS[0].x, y: POS[0].y + 1.2 * i}, { easing: 'quintIn'})
                .start();
        }
    },

    loseChip(isDouble, bankerNode){
        let worldPos = bankerNode.convertToWorldSpace(cc.v2(0, 0));
        let endPos = this.chipZone.convertToNodeSpace(worldPos);

        if(AudioManager.getAudioID("blackjack_blackjack/audio/chips_collect") == -1) {
            AudioManager.playSound("blackjack_blackjack/audio/chips_collect");
        }

        this.resultIcon.spriteFrame = this.resultFrame[0];
        this.resultIcon.node.parent.scaleX = 1.3;
        this.resultIcon.node.parent.scaleY = 1.3;
        this.resultIcon.node.parent.active = true;
        cc.tween(this.resultIcon.node.parent)
            .to(0.17, {scale: 1}, {easing: 'quintIn'})
            .start();

        this.point.node.color = cc.Color.RED;

        for(let i = 0; i < this.chipList.length; i++){
            let node = this.chipList[i].node;
            cc.tween(node)
                .to(0.6, {x: endPos.x, y: endPos.y + 1.2 * i, opacity: 0})
                .start();
        }

        if(isDouble){
            for(let i = 0; i < this.doubleList.length; i++){
                let node = this.doubleList[i].node;
                cc.tween(node)
                    .to(0.6, {x: endPos.x, y: endPos.y + 1.2 * i, opacity: 0})
                    .start();
            }
        }
    },

    winChip(isDouble, headNode, num){
        let worldPos = headNode.convertToWorldSpace(cc.v2(0, 0));
        let endPos = this.chipZone.convertToNodeSpace(worldPos);
        if(AudioManager.getAudioID("blackjack_blackjack/audio/chips_collect") == -1) {
            AudioManager.playSound("blackjack_blackjack/audio/chips_collect");
        }

        if(num == 0){
            this.resultIcon.spriteFrame = this.resultFrame[1];
            this.point.node.color = cc.Color.WHITE;
        }else if(this.isBJ()){
            this.resultIcon.spriteFrame = this.resultFrame[3];
            this.point.node.color = cc.Color.GREEN;
            if(!this.isBanker){
                if(AudioManager.getAudioID("blackjack_blackjack/audio/big_win_sound") == -1) {
                    AudioManager.playSound("blackjack_blackjack/audio/big_win_sound");
                }
                this.node.parent.parent.getComponent("blackjack_player_ui").playBJWin();
            }
        }else{
            this.resultIcon.spriteFrame = this.resultFrame[2];
            this.point.node.color = cc.Color.GREEN;
        }

        this.resultIcon.node.parent.scaleX = 1.3;
        this.resultIcon.node.parent.scaleY = 1.3;
        this.resultIcon.node.parent.active = true;
        cc.tween(this.resultIcon.node.parent)
            .to(0.17, {scale: 1}, {easing: 'quintIn'})
            .start();

        if(isDouble){
            if(this.resultDoubleList.length == 0){
                this.createChouma(num / 2, true, 1, true);
                for(let i = 0; i < this.resultDoubleList.length; i++){
                    let node = this.resultDoubleList[i].node;
                    cc.tween(node)
                        .to(0.17, {scale: 0.3}, {easing: 'quintIn'})
                        .delay(0.5)
                        .to(0.6, {x: endPos.x, y: endPos.y + 1.2 * i, opacity: 0})
                        .start();
                }
            }

            if(this.resultList.length == 0){
                this.createChouma(num / 2, true, 0, true);
                for(let i = 0; i < this.resultList.length; i++){
                    let node = this.resultList[i].node;
                    cc.tween(node)
                        .to(0.17, {scale: 0.3}, {easing: 'quintIn'})
                        .delay(0.5)
                        .to(0.6, {x: endPos.x, y: endPos.y + 1.2 * i, opacity: 0})
                        .start();
                }
            }
        }else{
            if(this.resultList.length == 0) {
                this.createChouma(num, true, 0, true);
                for(let i = 0; i < this.resultList.length; i++){
                    let node = this.resultList[i].node;
                    cc.tween(node)
                        .to(0.17, {scale: 0.3}, {easing: 'quintIn'})
                        .delay(0.5)
                        .to(0.6, {x: endPos.x, y: endPos.y + 1.2 * i, opacity: 0})
                        .start();
                }
            }
        }

        for(let i = 0; i < this.chipList.length; i++){
            let node = this.chipList[i].node;
            cc.tween(node)
                .delay(0.67)
                .to(0.6, {x: endPos.x, y: endPos.y + 1.2 * i, opacity: 0})
                .start();
        }
        for(let i = 0; i < this.doubleList.length; i++){
            let node = this.doubleList[i].node;
            cc.tween(node)
                .delay(0.67)
                .to(0.6, {x: endPos.x, y: endPos.y + 1.2 * i, opacity: 0})
                .start();
        }
    },

    loseInsure(bankerNode){
        let worldPos = bankerNode.convertToWorldSpace(cc.v2(0, 0));
        let endPos = this.chipZone.convertToNodeSpace(worldPos);

        if(AudioManager.getAudioID("blackjack_blackjack/audio/chips_collect") == -1) {
            AudioManager.playSound("blackjack_blackjack/audio/chips_collect");
        }

        for(let i = 0; i < this.insureList.length; i++){
            let node = this.insureList[i].node;
            cc.tween(node)
                .delay(0.67)
                .to(0.6, {x: endPos.x, y: endPos.y + 1.2 * i, opacity: 0})
                .start();
        }
    },

    winInsure(headNode){
        let worldPos = headNode.convertToWorldSpace(cc.v2(0, 0));
        let endPos = this.chipZone.convertToNodeSpace(worldPos);

        if(AudioManager.getAudioID("blackjack_blackjack/audio/chips_collect") == -1){
            AudioManager.playSound("blackjack_blackjack/audio/chips_collect");
        }

        for(let i = 0; i < this.insureList.length; i++){
            let node = this.insureList[i].node;
            cc.tween(node)
                .delay(0.67)
                .to(0.6, {x: endPos.x, y: endPos.y + 1.2 * i, opacity: 0})
                .start();
        }
    },

    isBJ(){
        return parseInt(this.point.string) == 21 && this.cardList.length == 2;
    },

    setFirstPos(){
        if(this.isRight){
            this.node.x = -180;
        }else{
            this.node.x = 0;
        }
    },

    setSecondPos(){
        if(this.isRight){
            this.node.x = 0;
        }else{
            this.node.x = 180;
        }
    }
});
