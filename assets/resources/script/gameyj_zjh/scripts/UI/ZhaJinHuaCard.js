var CCardNode = require("CardNode");
var gZJHMgr = require('ZjhManager').Instance();

var CardHeight = 150
var CardWidth = 110
var CardsState = cc.Enum(
    {
        lockcard: 1,   //暗牌
        unlockcard: 2,   //明牌
        giveupcard: 3,   //弃牌
        losecard: 4,   //比牌输  
    });

var CARDPANELSIZE = cc.size(350, 150)
var MOVELEN_X = 60
var MOVELEN_Y = 8
var ROUNDANGLE = 37
var OTHER_PLAYER_CARD_SCALE = 1.2
var AudioManager = require('AudioManager').getInstance();
const zjhAudioDir = 'gameyj_zjh/audios/';

var textImgDef = {
    zjh_LookCardImg: "zjh_bs_yikanpai",
    zjh_disCardImg: "zjh_qipaibiaoshi",
    zjh_LoseCardImg: "zjh_shu",
}
var CardTypeSpr = cc.Enum(
    {
        [1]: "zjh_paixing_sanpai",
        [2]: "zjh_paixing_duizi",
        [3]: "zjh_paixing_shunzi",
        [4]: "zjh_paixing_jinhua",
        [5]: "zjh_paixing_tonghuashun",
        [6]: "zjh_paixing_baozi",
    });

var CZhaJinHuaCard = cc.Class({
    extends: cc.Node,
    properties: {
    },

    onLoad: function () {
        cc.log("onLoad");
    },
    ctor: function () {
        this.setAnchorPoint(cc.v2(0.5, 0.5))
        this.setContentSize(350, 150)

        this.actionNode = new cc.Node();
        this.addChild(this.actionNode);
        this.m_cardsdata = []     // 牌数据
        this.m_cardList = []     // 牌节点
        this.m_nCardState = CardsState.lockcard

        this.m_nDisWidth = 76
        this.m_sendPos = null
        this.m_endPos = null
        this.m_nCount = 0
        this.m_bIsMine = false

        this.m_player = null
    },

    //暂时从参数传过来
    initRes: function (atlas, cardPrefab) {
        this.atlasZJH = atlas;
        this.cardPrefab = cardPrefab;
        this.m_oCardFlagImg = new cc.Node();
        var sprite = this.m_oCardFlagImg.addComponent(cc.Sprite);
        sprite.spriteFrame = this.atlasZJH.getSpriteFrame("zjh_bs_yikanpai");;
        this.m_oCardFlagImg.setPosition(cc.v2(this.m_nDisWidth, 0))//-CardHeight/2))
        this.addChild(this.m_oCardFlagImg, 1000)
        this.m_oCardFlagImg.active = (false)
    },

    // create: function () {
    //     var cardnode = new CZhaJinHuaCard()
    //     return cardnode
    // },
    setSendPos: function (pos) {
        this.m_sendPos = this.convertToNodeSpaceAR(pos)
    },
    setEndPos: function (pos) {
        this.m_endPos = this.convertToNodeSpaceAR(pos)
    },
    setIsMine: function (ismine) {
        this.m_bIsMine = ismine
    },
    getCardCount: function () {
        return this.m_nCount
    },

    callFuncAutoDis: function () {
        //cc.log("@@@@@@@@@@@@@@@炸金花自动发牌")
        this.active = true;
        var card = new CCardNode()
        card.init(null, true, null, this.cardPrefab, this.atlasZJH);
        card.setPosition(this.m_sendPos)
        if (this.m_bIsMine) {
            card.setScale(0.25)
        } else {
            card.setScale(0.7)
        }
        cc.log("this.m_nCount", this.m_nCount);
        this.addChild(card, 1, this.m_nCount)
        var move = cc.moveTo(0.125, cc.v2(this.m_nCount * this.m_nDisWidth, 0))
        var scale = cc.scaleTo(0.125, OTHER_PLAYER_CARD_SCALE)
        card.stopAllActions();
        card.runAction(cc.spawn(move, scale))
        // cc.log("card:",card)
        this.m_cardList[this.m_nCount + 1] = card
        this.m_nCount = this.m_nCount + 1
        AudioManager.playSound(zjhAudioDir + "8006");
    },

    callFuncCreateNext: function () {
        if (this.m_nCount < 3) {
            this.dispanseCard()
        }
    },
    dispanseCard: function () {
        cc.log("炸金花自动发牌")
        var plc = gZJHMgr.getPlayerCount();
        cc.log("plc:", plc);
        var delay1 = cc.delayTime(0.125 * plc);
        var createfunc1 = cc.callFunc(this.callFuncAutoDis.bind(this))
        var createnext1 = cc.callFunc(this.callFuncCreateNext.bind(this))
        this.actionNode.stopAllActions()
        this.actionNode.runAction(cc.sequence(createfunc1, delay1, createnext1))
    },
    showCardVaule: function (baction, keepData) {
        var temp = this.m_cardsdata;
        if (this.m_nCount != 3 || this.m_cardList.length != 4) {
            this.createcard()
        }
        if (keepData)
            this.m_cardsdata = temp;
        if (this.m_cardsdata.length != 0) {
            for (var k = 0; k < this.m_cardsdata.length; k++) {
                var card = this.m_cardsdata[k];
                if (baction == true) {
                    this.m_cardList[k + 1].setCardData(card, false)  //播动画
                } else {
                    this.m_cardList[k + 1].setCardData(card, true)  //不播动画
                }
            }
        }
        //旋转
        // if (this.m_bIsMine == false) {
        //     this.m_cardList[1].setPosition(cc.v2( MOVELEN_X,  - MOVELEN_Y))
        //     this.m_cardList[3].setPosition(cc.v2( (this.m_nCount - 1) * this.m_nDisWidth - MOVELEN_X,  - MOVELEN_Y))
        //     this.m_cardList[1].setRotation(-ROUNDANGLE)
        //     this.m_cardList[3].setRotation(ROUNDANGLE)
        // }
    },


    setCardsAlpha: function (opacity) {
        for (var k = 0; k < this.m_cardList.length; k++) {
            var card = this.m_cardList[k];
            if (card)
                card.setCardOpacity(opacity)
        }
    },

    setCardFlag: function (player, bshow) {
        if (player.playerState > gZJHMgr.PlayerStateType.ready) {
            this.m_oCardFlagImg.active = (false)
            if (bshow == false) {
                return
            }
            var scale = this.getScale()
            if (scale < 1) {
                this.m_oCardFlagImg.setScale(2 - scale)
            }
            var bshow = false
            if (player.cardState == gZJHMgr.CardStateType.unlock_card) {  //看牌
                if (!gZJHMgr.isMinePlayer(player) && gZJHMgr.getGameState() != gZJHMgr.ZJHRoomState.calc) {
                    this.m_oCardFlagImg.getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(textImgDef.zjh_LookCardImg);
                    bshow = true
                }
            }
            if (player.cardState == gZJHMgr.CardStateType.complose) {  //输牌
                this.m_oCardFlagImg.getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(textImgDef.zjh_LoseCardImg);
                bshow = true
            }
            if (player.playerState == gZJHMgr.PlayerStateType.discard) {  //弃牌
                this.m_oCardFlagImg.getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(textImgDef.zjh_disCardImg);
                bshow = true
            }
            this.m_oCardFlagImg.active = (bshow)
            // this.m_oCardFlagImg.ignoreContentAdaptWithSize(true)
            this.m_oCardFlagImg.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
        }
    },


    removeCards: function () {
        this.stopAllActions()
        for (var k = 0; k < this.m_cardList.length; k++) {
            var card = this.m_cardList[k];
            if (card) {
                var delay = cc.delayTime(0.125 * (k - 1))
                var move = cc.moveTo(0.2, this.m_endPos)
                var callFunc = cc.callFunc(function (sender) {
                    sender.removeFromParent()
                }.bind(this))
                var scale = null
                if (this.m_bIsMine) {
                    scale = cc.scaleTo(0.2, 0.25)
                } else {
                    scale = cc.scaleTo(0.2, 0.7)
                } var seq = cc.sequence(delay, cc.spawn(move, scale), callFunc)
                card.runAction(seq)
            }
        }
        this.m_cardList = []
        this.m_nCount = 0
        this.m_cardsdata = []
        this.m_nCardState = CardsState.lockcard
        this.m_oCardFlagImg.active = (false)
    },
    resetdata: function () {
        this.stopAllActions()
        for (var k = 0; k < this.m_cardList.length; k++) {
            var card = this.m_cardList[k];
            if (card) {
                cc.log("@@@@@@炸金花删除牌")
                card.stopAllActions()
                card.removeFromParent()

            }
        }
        this.m_cardList = []
        this.m_nCount = 0
        this.m_cardsdata = []
        if (this.m_oCardFlagImg)
            this.m_oCardFlagImg.active = (false)
    },
    createcard: function () {
        this.resetdata()
        if (this.m_nCount != 3 || this.m_cardList.length != 4) {
            for (var k = 1; k <= 3; k++) {
                var card = new CCardNode()
                card.init(null, true, null, this.cardPrefab, this.atlasZJH);
                this.addChild(card, 1, k)
                card.setPosition(cc.v2(this.m_nCount * this.m_nDisWidth, 0))
                card.setScale(OTHER_PLAYER_CARD_SCALE);
                this.m_nCount = k
                this.m_cardList[k] = card
            }
        }
    },
    showEnterRoom: function (player) {
        this.m_player = player
        this.createcard()
        this.lookCard(player)
    },

    reSetCard: function () {
        this.showEnterRoom(this.m_player)
    },
    lookCard: function (player) {
        if (player == null) {
            return
        }
        this.m_player = player
        var bshowcard = false
        //if(IsTable(player.cards) &&  player.cardsList.length == 3){
        if (player.cardsList.length == 3) {
            bshowcard = gZJHMgr.isCanLookCardSite(player.site)
            if (bshowcard) {
                this.m_cardsdata = player.cardsList
            }
        }

        if (this.m_bIsMine == false) {
            this.setCardFlag(player, !bshowcard)
        } else {
            if (player.cardState == gZJHMgr.CardStateType.unlock_card || player.playerState == gZJHMgr.PlayerStateType.discard) {
                this.setCardFlag(player, !bshowcard)
            }
        }

        if (player.site == gZJHMgr.getMineSite()) {
            this.showCardVaule(true)
            // var cardty = gZJHMgr.calcCardValue(player.cardsList)
            // this.m_oCardFlagImg.active = true;
            // this.m_oCardFlagImg.getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(CardTypeSpr[cardty]);    
            // this.m_oCardFlagImg.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
        } else {
            this.showCardVaule()
        }
    },
    giveupCard: function (player) {
        if (this.m_nCardState == CardsState.giveupcard) {
            return
        }
        this.lookCard(player)
    },

    //创建特殊牌型 用于喜钱奖励
    createRewardCard: function (cards, atlas, cardPrefab) {
        this.m_cardsdata = cards
        this.atlasZJH = atlas;
        this.cardPrefab = cardPrefab
        this.showCardVaule(false, true)
        var cardty = gZJHMgr.calcCardValue(cards)
        this.m_oCardFlagImg.getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(CardTypeSpr[cardty]);
        // this.m_oCardFlagImg.ignoreContentAdaptWithSize(true)
        this.m_oCardFlagImg.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
    },


});
module.exports = CZhaJinHuaCard;

//endregion
