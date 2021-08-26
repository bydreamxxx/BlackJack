

var CardType = cc.Enum(
    {
        Diamond: 0,     //方片
        Club: 16,    //梅花
        Heart: 32,    //红桃
        Spade: 48,    //黑桃
        King: 64     //大小王
    });

var CardFlowerType = cc.Enum(
    {
        [11]: "j",
        [12]: "q",
        [13]: "k"
    });

var scalePoint = cc.v2(0, 1);
var gZJHMgr = require('ZjhManager').Instance();

// var CardColorTexture_New = 
//     {
//         [1]: "gameyj_zjh/textures/CardNew/img_fangpian",            //方片
//         [17]: "gameyj_zjh/textures/CardNew/img_meihua",              //梅花
//         [33]: "gameyj_zjh/textures/CardNew/img_hongtao",             //红桃
//         [49]: "gameyj_zjh/textures/CardNew/img_heitao",              //黑桃
//         [65]: "gameyj_zjh/textures/CardNew/smallwang",               //小王
//         [66]: "gameyj_zjh/textures/CardNew/bigwang",                 //大王
//     };

var CardColorTexture =
{
    [1]: "img_21_fangpian",            //方片
    [17]: "img_21_meihua",              //梅花
    [33]: "img_21_hongxin",             //红桃
    [49]: "img_21_heitao",              //黑桃
    [65]: "img_21_j1",                  //小王
    [66]: "img_21_j2",                  //大王
};

var CCardNode = cc.Class({
    extends: cc.Node,

    ctor: function () {
        this.m_cardinfo = null          //牌信息
        this.m_oCard = null          //牌节点
        this.m_oCardPoint = null          //牌点数节点
        this.m_oCardScaleT = null          //牌类型节点（缩小）
        this.m_oCardT = null          //牌类型节点
        this.m_bColse = false        //是否翻转(默认不翻转 false)
        this.m_bType = false        //临时值
        this.m_oInCard = null          //牌正面节点
        this.m_oOutCard = null          //牌反面节点
        this.m_oKingImg = null          //大小王节点
        this.m_oFlowerImg = null          //花牌节点
        this.m_nRotation = 0            //旋转角度
        this.m_nScalePoint = scalePoint
        this.m_bShowOutCard = false
        this.m_oCardLight = null          //外层高亮
        this.m_cardvalue = null
        this.m_nPoint = 0
        this.m_bselect = false
        this.m_nMovelen = 0

        this.m_nRotationTime = 0.2

        this.m_nNewCard = false      // 默认的是一副小的牌，需要的请使用大的牌

        // cc.loader.loadRes('gameyj_zjh/prefabs/zjh_card',cc.Prefab, function (err, prefab) {
        //     this.cardNode = cc.instantiate(prefab);
        //     cc.resources.load("gameyj_zjh/textures/CardNew/img_21_paigaoguang", cc.SpriteFrame, function (err, atlas) {
        //         this.cardLightRes = atlas;    
        //         this.OnInit()
        //         this.setCardRound(this.m_rotation || 0);
        //         this.setCard()
        //     }.bind(this));
        // }.bind(this));

    },

    desdroy: function () {
        // var scheduler = cc.director.getScheduler();
        // scheduler.unscheduleCallbackForTarget(this, this.update);
    },

    onLoad: function () {

    },

    OnInit: function () {

        var card = cc.instantiate(this.cardPrefab);//cc.CSLoader.createNode(cardRes)
        this.addChild(card)
        this.m_oCard = card
        this.m_oInCard = cc.find("cardbg", card)
        this.m_oCardPoint = cc.find("cardbg/image_score", card)
        this.m_oCardScaleT = cc.find("cardbg/Image_color_scale", card)
        this.m_oCardT = cc.find("cardbg/Image_color", card)
        this.m_oOutCard = cc.find("di", card)
        var pos = this.m_oCardT.getPosition()
        this.m_oCardTPoint = cc.v2(pos.x, pos.y)

        this.m_oCardLight = new cc.Node();
        var sprite = this.m_oCardLight.addComponent(cc.Sprite);
        sprite.spriteFrame = this.atlas.getSpriteFrame("img_21_paigaoguang")//this.cardLightRes;
        this.m_nCardSize = this.m_oInCard.getContentSize()
        this.m_oCardLight.setPosition(cc.v2(0, 0))
        this.m_oInCard.addChild(this.m_oCardLight, 12)

        // this.scheduleUpdateWithPriorityLua(handler(self, this.upate), 0)
        var scheduler = cc.director.getScheduler();
        // scheduler.scheduleUpdateForTarget(this, 0);
    },

    GetCardImg: function () {
        return "img_21_paidi"
    },

    //param:
    //cardinfo:牌信息{value = 点数, color = 类型}
    //bclose:是否是暗牌
    //rotation:是否翻转
    init: function (cardinfo, bclose, rotation, cardPrefab, atlas) {
        // var cardnode = new CCardNode();
        // cardnode. setCardInfo(cardinfo)
        // if (bclose == null || bclose == false) {
        //     cardnode. setCardState(false)
        // } else {
        //     cardnode. setCardState(true)
        // }
        // if (rotation == null) {
        //     rotation = 0
        // }
        // this.m_rotation = rotation
        // //cardnode. OnInit()
        // //cardnode. setCardRound(rotation)
        // //cardnode. setCard()
        // return cardnode
        this.cardPrefab = cardPrefab
        this.atlas = atlas
        this.setCardInfo(cardinfo)
        if (bclose == null || bclose == false) {
            this.setCardState(false)
        } else {
            this.setCardState(true)
        }
        if (rotation == null) {
            rotation = 0
        }
        this.m_rotation = rotation

        this.OnInit()
        this.setCardRound(rotation)
        this.setCard()
    },

    setRotainTime(nTime) {
        this.m_nRotationTime = nTime
    },

    getSize: function () {
        return this.m_nCardSize
    },

    getWidth: function () {
        return this.m_nCardSize.width
    },

    getHeight: function () {
        return this.m_nCardSize.height
    },

    setCardInfo(info) {
        this.m_cardinfo = info
    },

    setCardState(value) {
        this.m_bType = value
    },

    getOutCard: function () {
        return this.m_oOutCard
    },

    getInCard: function () {
        return this.m_oInCard
    },

    getShowVaule: function () {
        return this.m_cardvalue
    },

    getPoint: function () {
        return this.m_nPoint
    },

    //再次翻转
    resetReType: function () {
        this.m_bColse = true
    },

    setPoint(point) {
        point = parseInt(point)
        this.m_nPoint = point > 10 && 10 || point
    },

    setSelect(bvar) {
        this.m_bselect = bvar
    },

    isSelect: function () {
        return this.m_bselect
    },

    setCardOpacity(opacity) {
        this.m_oCard.setOpacity(opacity)
    },

    setShowVaule(point) {
        if (point == 13) {
            this.m_cardvalue = "K"
        } else if (point == 12) {
            this.m_cardvalue = "Q"
        } else if (point == 11) {
            this.m_cardvalue = "J"
        } else {
            this.m_cardvalue = point.toString()
        }
    },

    setCardRound(rotation) {
        this.m_nRotation = rotation
        this.m_oInCard.setRotation(rotation)
        if (rotation != 0) {
            this.m_nScalePoint = scalePoint
        }
    },

    setCardData(info, value, movelen) {
        //cc.log(" setCardData   "+toString(info))
        this.setCardInfo(info)
        if (value == null) { value = false }
        this.setCardState(value)
        this.setCard()
        if (movelen != null) {
            this.m_nMovelen = movelen
        }
    },

    setShowOutCard(bclose) {
        this.setCardState(bclose)
        this.m_bColse = this.m_bType
        if (this.m_oOutCard.active == false) {
            var action = cc.OrbitCamera(0, 1, 0, 90, -90, 0, 0)
            this.m_oOutCard.runAction(action)
        }
        this.m_oOutCard.active = (bclose)
    },

    setCard: function () {
        if (this.m_bType == true) {
            this.m_bColse = this.m_bType
            if (this.m_oOutCard == null) {
                //wuxiao

                this.cardPaiDi = atlas;
                this.m_oOutCard = new cc.Node();
                var sprite = this.m_oOutCard.addComponent(cc.Sprite);
                sprite.spriteFrame = this.atlas.getSpriteFrame(this.GetCardImg());;

                this.m_oOutCard.setPosition(cc.v2(50, 50))
                this.m_oCard.addChild(this.m_oOutCard)

                var cardLight = new cc.Node();
                var sprite1 = cardLight.addComponent(cc.Sprite);
                sprite1.spriteFrame = this.atlas.getSpriteFrame("img_21_paigaoguang")//this.cardLightRes;
                cardLight.setPosition(cc.v2(this.m_nCardSize.width / 2, this.m_nCardSize.height / 2))
                this.m_oOutCard.addChild(cardLight)
                this.m_oOutCard.setRotation(this.m_nRotation)

            } else {
                this.m_oOutCard.active = (true)
                this.m_oOutCard.setRotation(this.m_nRotation)
            }
            //this.m_oInCard:setScale(this.m_nScalePoint.x,this.m_nScalePoint.y)

        }
        //cc.log("1111111111111 1 set card info ui")
        if (this.m_cardinfo == null) {
            cc.log("m_cardinfo is null")
            return
        }
        // cc.log("1111111111111 2 set card info ui")
        if (this.m_oCardPoint != null &&
            this.m_oCardScaleT != null &&
            this.m_oCardT != null) {
            //cc.log("set card info ui")
            var carddata = gZJHMgr.GetCardInfo(this.m_cardinfo)
            var typecard = carddata.color.toString()
            var point = carddata.value.toString()
            cc.log("typecard:", typecard)
            cc.log("point:", point)
            // dump(carddata, "carddata")
            this.setShowVaule(parseInt(point))
            this.setPoint(point)

            if (parseInt(typecard) == CardType.Diamond || parseInt(typecard) == CardType.Heart) {
                var cardPointRes = "img_21_" + point + "_hh"
                // if(this.m_nNewCard)
                //     cardPointRes ="CardNew/img_21_"+point+"_hh"  
                // this.m_oCardPoint.loadTexture(cardPointRes)
                //cc.loader.loadRes(cardPointRes, cc.SpriteFrame, function (err, atlas) {
                this.m_oCardPoint.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(cardPointRes);
                //}.bind(this));
            } else if (parseInt(typecard) == CardType.Club || parseInt(typecard) == CardType.Spade) {
                var cardPointRes = "img_21_" + point + "_H"
                // if(this.m_nNewCard)
                //      cardPointRes ="CardNew/img_21_"+point+"_H"
                // this.m_oCardPoint.loadTexture(cardPointRes)
                //cc.loader.loadRes(cardPointRes, cc.SpriteFrame, function (err, atlas) {
                this.m_oCardPoint.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(cardPointRes);
                //}.bind(this));
            } else if (parseInt(typecard) == CardType.King) {
                this.m_oCardPoint.active = false
            }


            if (parseInt(typecard) != CardType.King) {
                // var cardPointRes = "gameyj_zjh/textures/CardNew/img_" + typecard + point
                // cc.loader.loadRes(cardPointRes, cc.SpriteFrame, function (err, atlas) {
                //     this.m_oInCard.getComponent(cc.Sprite).spriteFrame = atlas;    
                // }.bind(this));
                if (parseInt(point) <= 10) {
                    var tp = this.getColorImg(parseInt(typecard) + 1)
                    cc.log("tp", tp);

                    this.m_oCardScaleT.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(tp);
                    this.m_oCardT.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(tp);

                    // this.m_oCardScaleT.loadTexture(this.getColorImg(parseInt(typecard) + 1))
                    // this.m_oCardT.loadTexture(this.getColorImg(parseInt(typecard) + 1))
                } else {
                    var tp = this.getColorImg(parseInt(typecard) + 1)
                    this.m_oCardScaleT.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(tp);
                    if (parseInt(typecard) == CardType.Diamond || parseInt(typecard) == CardType.Heart) {

                        var cardPointRes = "img_21_" + CardFlowerType[parseInt(point)] + "2"
                        // if(this.m_nNewCard)
                        //      cardPointRes ="CardNew/img_21_"+CardFlowerType[parseInt(point)]+"2"
                        this.m_oCardT.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(cardPointRes);
                    } else if (parseInt(typecard) == CardType.Club || parseInt(typecard) == CardType.Spade) {
                        var cardPointRes = "img_21_" + CardFlowerType[parseInt(point)] + "1"
                        // if(this.m_nNewCard)
                        //     cardPointRes ="CardNew/img_21_"+CardFlowerType[parseInt(point)]+"1"
                        // this.m_oCardT.loadTexture(cardPointRes)
                        this.m_oCardT.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(cardPointRes);
                    }
                    this.m_oCardT.setPosition(cc.v2(6.5, -11))
                    // if(this.m_nNewCard){
                    //     this.m_oCardT.setPosition(cc.v2(this.m_oCardTPoint.x+10,this.m_oCardTPoint.y + 30))
                    // }
                    // this.m_oCardT.ignoreContentAdaptWithSize(true)
                    this.m_oCardT.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
                }

            } else {
                self.m_oCardScaleT.active = false;
                self.m_oCardT.active = false;
                if (this.m_oKingImg == null) {
                    this.m_oKingImg = new cc.Node();
                    var sprite = this.m_oKingImg.addComponent(cc.Sprite);
                    this.m_oKingImg.setPosition(cc.v2(0.5, 0.5))
                    this.m_oInCard.addChild(this.m_oKingImg)
                }

                var path = ""
                if (parseInt(point) == 14) {
                    path = this.getColorImg(parseInt(typecard) + 1)
                } else {
                    path = this.getColorImg(parseInt(typecard) + 2)
                }

                this.m_oKingImg.spriteFrame = this.atlas.getSpriteFrame(path);
            }
            // this.m_oCardPoint.ignoreContentAdaptWithSize(true)
            // this.m_oCardT.ignoreContentAdaptWithSize(true)
            // this.m_oCardScaleT.ignoreContentAdaptWithSize(true)
            this.m_oCardPoint.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
            this.m_oCardT.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
            this.m_oCardScaleT.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
        }
        if (this.m_oOutCard != null && !this.m_bShowOutCard) {
            this.m_oOutCard.active = (false)
        }
        if (this.m_bShowOutCard) {
            this.m_oOutCard.active = (false)
            //this.m_oInCard:setScale(1,1)
        }
    },


    getColorImg: function (bCard) {
        //return CardColorTexture_New[bCard]
        return CardColorTexture[bCard]
    },


    createOrbitCameraAction: function (duration) {
        if (this.m_oInCard != null && this.m_oOutCard != null) {
            var movelen = 50
            var idx = 4

            this.m_oInCard.active = (false)
            this.m_oOutCard.active = (true)
            if (this.m_nMovelen > 0) {
                idx = 2
            }

            var cameraIn = cc.OrbitCamera(duration, 1, 0, 270, 90, 2, 1)
            var cameraOut = cc.OrbitCamera(duration, 1, 0, 0, 90, 2, 1)
            var inAction = cc.sequence(cc.moveBy(duration / idx, cc.v2(movelen + this.m_nMovelen, 0)),
                cc.delayTime(duration),
                cc.show(),
                cc.spawn(
                    cameraIn,
                    cc.easeIn(cc.moveBy(duration, cc.v2(-movelen, 0)), duration / 2))
            )
            var outAction = cc.sequence(
                cc.moveBy(duration / idx, cc.v2(movelen + this.m_nMovelen, 0)),
                cameraOut,
                cc.hide(),
                cc.easeIn(cc.moveBy(duration / 4, cc.v2(-movelen, 0)), duration / 8))
            this.m_oInCard.runAction(inAction)
            this.m_oOutCard.runAction(outAction)
            //        if(this.m_nRotation != 0){
            //          cc.log("createOrbitCameraAction x = "+this.m_nScalePoint.x)
            //        }
            //        var move1 = cc.ScaleTo:create(duration*0.5, this.m_nScalePoint.x,this.m_nScalePoint.y)
            //        var seq1  = cc.sequence:create(cc.delayTime:create(duration*0.5/2),cc.Hide:create(),cc.delayTime:create(duration*0.5/2),cc.Hide:create())
            //        var spw1  = cc.Spawn:create(seq1,move1)
            //        var move2 = cc.ScaleTo:create(duration*0.5, 1, 1)
            //        var seq2  = cc.sequence:create(cc.delayTime:create(duration*0.5/2),cc.Show:create(),cc.delayTime:create(duration*0.5/2),cc.Show:create())
            //        var spw2  = cc.Spawn:create(seq2,move2)
            //        this.m_oInCard.runAction(spw2)
            //        this.m_oOutCard.runAction(spw1)
            this.m_bColse = this.m_bType
        }
    },

    //引擎不支持OrbitCamera

    // update: function (fd) {
    //     if (this.m_bColse != this.m_bType) {
    //         if (this.m_bColse) {
    //             var time = 0.2
    //             if (this.m_nRotationTime != 0.2) {
    //                 time = this.m_nRotationTime
    //             }
    //             this.createOrbitCameraAction(time)
    //         }
    //     }
    // },

    removeSelf: function () {
        this.removeFromParent()
    },

});

module.exports = CCardNode;
