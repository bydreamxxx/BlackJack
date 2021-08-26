//by creat by 2021/8/13
var mouse_send_msg = require('net_sender_mouse');
const audioConfig = require('mouse_audio_cfg');
const mouse_hit_Data = require('mouse_hit_Data').Mouse_Hit_Data;
// const hammergoldList = []; //锤子对应金额
const mouseInformation = require('mouse');
cc.Class({
    extends: cc.Component,
    properties: {
        mouseDbNodes: {
            default: [],
            type: cc.Node,
            tooltip: "老鼠的骨骼动画节点",
        },
        effectDbNodes: {
            default: [],
            type: cc.Node,
            tooltip: "敲击的效果"
        },
        mouseAtlas: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: "牌的图集"
        },
        mousePokerType: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "牌的倍数",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.mouseDbAni = cc.find("mask/mouse/spskeNode", this.node); //老鼠骨骼动画节点
        this.mouseNode = cc.find("mask/mouse", this.node);  // 点击的节点
        this.mouseMoveAni = this.mouseNode.getComponent(cc.Animation);
        this.mouseBtn = this.mouseNode.getComponent(cc.Button); // 
        this.effectDbAni = cc.find("effecNode", this.node);   //锤子动画
        this.hammerDb = cc.find("hammerNode", this.node);  // 锤子的节点
        this.mouseInitNode = {
            [1001]: this.mouseDbNodes[0],
            [1002]: this.mouseDbNodes[1],
            [1003]: this.mouseDbNodes[2],
            [1004]: this.mouseDbNodes[3],
            [1005]: this.mouseDbNodes[4],
            [2001]: this.mouseDbNodes[5],
            [3001]: this.mouseDbNodes[6],
            [4001]: this.mouseDbNodes[7],
            [5001]: this.mouseDbNodes[8],
            [6001]: this.mouseDbNodes[9],
            [7001]: this.mouseDbNodes[10],
        };
        this.pokerTypelist = {
            [5]: this.mousePokerType[0],
            [10]: this.mousePokerType[1],
            [20]: this.mousePokerType[2],
            [30]: this.mousePokerType[3],
            [50]: this.mousePokerType[4],
            [100]: this.mousePokerType[5]
        };
        //读取配置获得配置的hammer信息
        this.hammergoldList = [];
        this.mouseInfo = mouseInformation.items[0];
        this.maxPower = this.mouseInfo.max_power;
        this.maxAnger = this.mouseInfo.max_anger;
        this.hammerInformation = this.mouseInfo.hammer.split(';');
        for (let j = 0; j < this.hammerInformation.length; j++) {
            let itemInfo = this.hammerInformation[j].split(',');
            let obj = { id: '', gold: '', power: '', anger: '' };
            obj.id = itemInfo[0];
            obj.gold = itemInfo[1];
            obj.power = itemInfo[2];
            obj.anger = itemInfo[3];
            this.hammergoldList.push(obj);
        }
        this.mouseList = [];
        this.mouseData = null;
        this.isDisapper = true; // 老鼠是否消失
        this.mouseResult = null;
        this.mouseBtn.interactable = false;
    },
    start() {

    },
    setData(data, time) {
        this.mouseDelayTime = time;
        this.mouseList.push(data);
    },
    creatMouse() {
        this.mouseData = this.mouseList[0];
        this.mouseDbAni.destroyAllChildren();
        this.effectDbAni.destroyAllChildren();
        this.hammerDb.active = false;
        if (this.mouseData) {
            this.schedule(this.disAppearMouseTime, 0.1);
            this.isDisapper = false;
            let mouseDbChildNode = cc.instantiate(this.mouseInitNode[this.mouseData.mouseId]);
            mouseDbChildNode.parent = this.mouseDbAni;
            mouseDbChildNode.active = true;
            this.mouseBtn.interactable = false;
            this.animationFinish = false;
            this.mouseMoveAni.off('finished', null);
            this.mouseMoveAni.on("finished", () => {
                this.mouseBtn.interactable = true;
                this.animationFinish = true;
                if (mouse_hit_Data.Instance().AutoHammer) {
                    let mainJs = cc.find("Canvas").getComponent("mouse_hit_ui");
                    mainJs.autoHammerList.push(this.mouseData)
                }
            })
            this.mouseMoveAni.play("mousemoveto");
        }
    },
    disaAppearMouseAni() {
        this.mouseBtn.interactable = false;
        this.mouseEndAnimation = false;
        this.mouseMoveAni.off('finished', null);
        this.mouseMoveAni.on("finished", () => {
            this.mouseEndAnimation = true;
            this.isDisapper = true;
            this.mouseList.splice(0, 1);
        })
        this.mouseMoveAni.play("mousemoveback")
    },
    disAppearMouseTime() {
        var time = new Date().getTime() + mouse_hit_Data.Instance().timeDifference;
        if (this.mouseData.mouseTime < time) {
            cc.log("服务器时间>>>>>>>>", time)
            cc.log("mouseId", this.mouseData.mouseId, "holde", this.mouseData.holeId, "老鼠消失时间", new Date(this.mouseData.mouseTime).format(" hh:mm:ss"));
            cc.log("当前时间>>>>>>>>>>>>", new Date().format(" hh:mm:ss"));
            this.unschedule(this.disAppearMouseTime);
            this.disaAppearMouseAni();
        }
    },
    isEnoughPower() {
        var isEnough = false;
        if (mouse_hit_Data.Instance().myAnger < this.maxAnger) {
            let hammerIndex = mouse_hit_Data.Instance().ordinaryHammerId;
            let hammerFrom = this.hammergoldList.find((item, ind) => ind == hammerIndex);
            isEnough = hammerFrom.power <= mouse_hit_Data.Instance().myPower ? true : false;
        } else {
            isEnough = true;
        }
        return isEnough;
    },
    isEnoughMeony(){
       var isMeony = false;
        if (mouse_hit_Data.Instance().myAnger >= this.maxAnger){
            isMeony = true;
        }else{
            let hammerIndex = mouse_hit_Data.Instance().ordinaryHammerId;
            let hammerFrom = this.hammergoldList.find((item, ind) => ind == hammerIndex);
            isMeony = hammerFrom.gold <= mouse_hit_Data.Instance().myCoin ? true : false;
        }
        return isMeony;
    },
    onClickMouse(event, data) {
        let holeId = parseInt(data);
        if (!this.mouseBtn.interactable || !mouse_hit_Data.Instance().isCanHammer) return;
        var time = new Date().getTime() + mouse_hit_Data.Instance().timeDifference;
        if (this.mouseData.mouseTime - 300 < time) return;
        if (!this.isEnoughPower()) {
            cc.dd.PromptBoxUtil.show("体力值不足");
            if (mouse_hit_Data.Instance().AutoHammer) {
                let autoBtn = cc.find("Canvas/autHammer/automaToggle").getComponent(cc.Toggle);
                autoBtn.uncheck();
            }
            return;
        }
        if (!this.isEnoughMeony()){
            cc.dd.PromptBoxUtil.show("金币不足");
            if (mouse_hit_Data.Instance().AutoHammer) {
                let autoBtn = cc.find("Canvas/autHammer/automaToggle").getComponent(cc.Toggle);
                autoBtn.uncheck();
            }
            return;
        }
        this.mouseBtn.interactable = false;
        let hammerIndex = mouse_hit_Data.Instance().ordinaryHammerId;
        if (hammerIndex == 0) {
            this.hammerDb.setScale(2.5, 2.5);
        } else {
            this.hammerDb.setScale(2, 2);
        }
        this.hammerDb.active = true;
        let hammerSpSke = this.hammerDb.getComponent(sp.Skeleton); //锤子动画
        let andioPath = null;
        if (mouse_hit_Data.Instance().myAnger >= this.maxAnger) {
            hammerSpSke.setSkin(`hammer_99`);
            andioPath = audioConfig.GAME_LEISHEN;
        } else {
            hammerSpSke.setSkin(`hammer_${hammerIndex + 1}`);
            andioPath = audioConfig.GAME_HAMMER;
        }
        hammerSpSke.setAnimation(0, "animation", false);
        this.creatHitEffect(hammerIndex);
        AudioManager.playSound(andioPath, false);
        AudioManager.playSound(audioConfig.GAME_MOUSE, false);
        let hammerFrom = this.hammergoldList.find((item, ind) => ind == hammerIndex);
        if (mouse_hit_Data.Instance().myAnger >= this.maxAnger) {
            mouse_hit_Data.Instance().useHammerId = "8";
            mouse_send_msg.useHammerReq("8", holeId);
            mouse_hit_Data.Instance().isCanHammer = false;
        } else {
            mouse_hit_Data.Instance().useHammerId = hammerFrom.id;
            mouse_send_msg.useHammerReq(hammerFrom.id, holeId);
            mouse_hit_Data.Instance().isCanHammer = false;
        }
    },
    creatHitEffect(index) {
        this.effectDbAni.removeAllChildren();
        let effectDb = cc.instantiate(this.effectDbNodes[index]);
        effectDb.parent = this.effectDbAni;
        effectDb.setScale(1.5, 1.5);
        effectDb.active = true;
        let effecSpSke = cc.find(`effecNode/effect_ani_${index}`, this.node).getComponent(sp.Skeleton);//被锤效果
        effecSpSke.setAnimation(0, "animation", false);
    },

    showMouseResult(itemData, isDrum) {
        this.mouseResult = itemData;
        var delayTime = null;
        if (isDrum == 1 && !this.animationFinish) {
            this.mouseMoveAni.stop("mousemoveto");
            this.mouseNode.y = -125;
            this.animationFinish = true;
            delayTime = 0.8;
        } else if (isDrum == 1 && !this.mouseEndAnimation) {
            this.mouseMoveAni.stop("mousemoveback");
            this.mouseEndAnimation = true;
            this.mouseNode.y = -125;
            delayTime = 0.5;
        }
        else {
            delayTime = 0;
        }
        var resultAction = cc.sequence(cc.delayTime(delayTime), cc.callFunc(() => {
            cc.log(delayTime);
            if (itemData.mouseId == 0) {
                itemData.mouseId == this.mouseData.mouseId;
            };
            if (itemData.mouseId == 2001) {
                if (isDrum || itemData.times == 2) {
                    this.mouseBtn.interactable = false;
                    this.unschedule(this.disAppearMouseTime);
                }
            } else {
                this.mouseBtn.interactable = false;
                this.unschedule(this.disAppearMouseTime);
            }
            var mouseSpNode = null; //老鼠ID节点
            var mouseSpSke = null;  // 老鼠骨骼动画
            if (itemData.mouseId == 5001 || itemData.mouseId == 6001) {
                mouseSpNode = cc.find(`mouse_ani_${itemData.mouseId}/dalaoshu`, this.mouseDbAni);
            } else {
                mouseSpNode = cc.find(`mouse_ani_${itemData.mouseId}`, this.mouseDbAni);//老鼠节点
            }
            if (itemData.mouseId == 2001 && (itemData.times == 1 || isDrum)) {
                let pumpSpSke = cc.find("pump", mouseSpNode).getComponent(sp.Skeleton); //南瓜动画
                pumpSpSke.setAnimation(0, "animation", false);
                this.mouseBtn.interactable = !isDrum;
            } else {
                if (!mouseSpNode) {
                    cc.log("老鼠找不到了,可能出现了重大BUG>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    return;
                }
                mouseSpSke = mouseSpNode.getComponent(sp.Skeleton);// 老鼠被锤动画
                mouseSpSke.setAnimation(0, "animation", false);
            }
            if (itemData.mouseId == 2001 && itemData.times == 1 && mouse_hit_Data.Instance().AutoHammer) {
                this.scheduleOnce(() => {
                    this.onClickMouse(null, this.mouseData.holeId);
                }, 0.25);
            }
            if (itemData.isHit == 1) {
                switch (itemData.mouseId) {
                    case 4001: //翻牌老鼠
                        if (itemData.pokersList.length) {
                            let openPokerMouse = cc.find("mousePoker", mouseSpNode);
                            let pokerType = cc.find("mousePoker/pokerDes", mouseSpNode).getComponent(cc.Sprite);
                            pokerType.spriteFrame = this.pokerTypelist[itemData.oddsList[0]];
                            let openPokerAni = openPokerMouse.getComponent(cc.Animation);
                            for (let j = 0; j < itemData.pokersList.length; j++) {
                                let pokerNode = cc.find(`poker${j}`, openPokerMouse);
                                let pokervalue = itemData.pokersList[j];
                                this.setPokerBack(pokerNode, pokervalue);
                            }
                            openPokerAni.off("finished", null);
                            openPokerAni.on("finished", () => {
                                this.playRewardGlod(itemData);
                                this.disaAppearMouseAni()
                            }, this)
                            openPokerAni.play('mousePokerMove');
                        }
                        break;
                    case 3001:  //红包老鼠
                        let hitRedBagMosue = cc.find('hitMouse', mouseSpNode);
                        let redBagAni = hitRedBagMosue.getComponent(cc.Animation);
                        for (let i = 0; i < 3; i++) {
                            let redNode = cc.find(`hong${i}`, hitRedBagMosue);
                            redNode.tag = i;
                            redNode.on("click", this.choiceRedBag, this);
                        }
                        redBagAni.play("hongbao");
                        this.schedule(this.choiceRedBag, 1.5);
                        break;
                    default:
                        if (itemData.mouseId == 2001) {
                            mouseSpSke = mouseSpNode.getComponent(sp.Skeleton);// 老鼠被锤动画
                            mouseSpSke.setAnimation(0, "animation", false);
                        }
                        mouseSpSke.setCompleteListener(() => {
                            this.playRewardGlod(itemData);
                            this.disaAppearMouseAni();
                        });
                        break;
                }
            } else {
                if (itemData.times == 1) return;
                mouseSpSke.setCompleteListener(() => {
                    this.disaAppearMouseAni();
                })
            }
        }))
        this.node.runAction(resultAction);
    },
    // 设置牌
    setPokerBack(node, cardValue) {
        let paiAtlas = this.mouseAtlas;
        var value = cardValue % 100;
        var flower = Math.floor(cardValue / 100); // 1 2 3 4  方 梅 红 黑
        var hua_xiao = cc.find("pokerNode/huaXiao", node);
        var num = cc.find("pokerNode/huanum", node);
        switch (value) {
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('ddz_b' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('ddz_r' + value.toString());
                }
                hua_xiao.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                break;
        }

    },
    //财神老鼠选着红包
    choiceRedBag(event, data) {
        var index = null;
        if (event.target) {
            index = event.target.tag;
        } else {
            index = Math.floor(Math.random() * 2 + 1);
        }
        this.unschedule(this.choiceRedBag);
        var hitMosueNode = cc.find("spskeNode/mouse_ani_3001", this.mouseNode);
        if (!hitMosueNode) return;
        var hitRedBagMosue = cc.find('hitMouse', hitMosueNode);
        for (let i = 0; i < 3; i++) {
            let redNode = cc.find(`hong${i}`, hitRedBagMosue);
            if (index == i) continue;
            redNode.active = false;
        }
        var redAni = cc.find("hongend/aniNode", hitRedBagMosue).getComponent(sp.Skeleton);
        var redDesOdds = cc.find('hongend/des/desodds', hitRedBagMosue);
        redDesOdds.getComponent(cc.Label).string = `${this.mouseResult.oddsList[0]}`;
        let redBagAni = hitRedBagMosue.getComponent(cc.Animation);
        let redBagAniEnd = () => {
            redAni.clearTracks();
            redAni.setAnimation(0, "animation", false);
            redAni.setCompleteListener(() => {
                if (this.mouseResult.oddsList[0] > 0) {
                    this.playRewardGlod(this.mouseResult);
                };
                this.disaAppearMouseAni();
            })

        };
        redBagAni.off('finished', null);
        redBagAni.on("finished", redBagAniEnd, this);
        redBagAni.play("hongbaoback");
    },
    //播放奖金
    playRewardGlod(data) {
        let mainUi = cc.find("Canvas").getComponent("mouse_hit_ui");
        mainUi.mouseGetReward(data);
    },
    update(dt) {
        if (this.mouseList.length) {
            this.mouseDelayTime -= dt;
        }
        // && this.mouseDelayTime < 0
        if (this.mouseList.length && this.isDisapper && this.mouseDelayTime < 0) {
            this.creatMouse();
            this.isDisapper = false;
        }
    },
});
