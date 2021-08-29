// create by wj 2020/06/13
var game_Data = require('lucky_turntable_data').Lucky_Turntable_Data.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_tBetAreaNodeVec: {default: [], type: cc.Node, tooltip:'下注区域节点'}, // '下注区域'
        m_tAreaWinShineNodeVec:{default: [], type: cc.Node}, //中奖区域框闪烁
        m_oPlayerTotalChip: cc.Label,
        m_oChipAtlas: cc.SpriteAtlas, //筹码资源
        m_oShineSkeletonNode: cc.Node,
        m_tOwnChipNodeVec:{default: [], type: cc.Node, tooltip:'个人下注节点'}, // '下注区域'
    },

     onLoad () {
        for(var i = 0; i < 33; i++){
            this.m_tBetAreaNodeVec[i] = cc.dd.Utils.seekNodeByName(this.node, 'betNode' + (i + 1)); //加载路单节点
            this.m_tAreaWinShineNodeVec[i] = cc.dd.Utils.seekNodeByName(this.node, 'winShow' + (i+1));
            var skeletonNode =  cc.instantiate(this.m_oShineSkeletonNode);
            skeletonNode.parent = this.m_tBetAreaNodeVec[i];
            skeletonNode.zIndex = -1;
            skeletonNode.setPosition(this.m_tBetAreaNodeVec[i].getChildByName('dialogbox').getPosition());
            skeletonNode.name = 'shineSkeleton';

            this.m_tOwnChipNodeVec[i] = cc.dd.Utils.seekNodeByName(this.node, 'ownchip' + (i+1));
            this.m_tOwnChipNodeVec[i].active = false;
        }
     },

     initReusltBetArea: function(){
        var betList = game_Data.getBetAreaList();
        var self = this;
        betList.forEach(function(betData){ //设置下注区域所有下注值
            if(betData){
                var betNumNode = self.m_tBetAreaNodeVec[betData.id - 1].getChildByName('betNum');
                if(betNumNode && betData.value != 0){
                    betNumNode.active = true;
                    betNumNode.getComponent(cc.Label).string = self.convertChipNum(betData.value,1, 0);
                    var width = betNumNode.getContentSize().width;
    
                    var chipIcon = self.m_tBetAreaNodeVec[betData.id - 1].getChildByName('chipsicon');
                    if(chipIcon){
                        chipIcon.x = (betNumNode.x - width - chipIcon.width / 2);
                        chipIcon.active = true;
                        var iconStr = 'chips0';
                        if(betData.value <= 100000)
                            iconStr = 'chips0';
                        else if(betData.value > 100000 && betData.value <= 1000000)
                            iconStr = 'chips1';
                        else if(betData.value >= 1000000 && betData.value < 10000000)
                            iconStr = 'chips3'
                        else if(betData.value >= 10000000)
                            iconStr = 'chips2'
                        chipIcon.getComponent(cc.Sprite).spriteFrame = self.m_oChipAtlas.getSpriteFrame(iconStr);
                    }

                    var ownBet = game_Data.getOwnBetAreaInfoById(betData.id); //显示个人区域下注
                    if(ownBet.value != 0){
                        
                        var ownChipNode = self.m_tOwnChipNodeVec[betData.id - 1];
                        if(ownChipNode){
                            ownChipNode.active = true;

                            var chipNumText = ownChipNode.getChildByName('ownchipnum');
                            if(chipNumText)
                                chipNumText.getComponent(cc.Label).string = self.convertChipNum(ownBet.value, 0, 4);
                        }
                    }
                }
            }
        });

        this.m_oPlayerTotalChip.string = game_Data.getOwnTotalBet();

     },

     fadeOutMainUI: function(){
        var betLayer = cc.dd.Utils.seekNodeByName(this.node, 'betLayer');
        if(betLayer)
            betLayer.runAction(cc.sequence(cc.fadeOut(1), cc.callFunc(function(){
                this.clearMainUI();
                betLayer.opacity = 255;
            }.bind(this))))
     },

     clearMainUI: function(){
        for(var i = 0; i < 33; i++){
            var betNumNode = this.m_tBetAreaNodeVec[i].getChildByName('betNum');
            if(betNumNode)
                betNumNode.active = false;
            var chipIcon = this.m_tBetAreaNodeVec[i].getChildByName('chipsicon');
            if(chipIcon)
                chipIcon.active = false;
            // var ownChipNode = this.m_tBetAreaNodeVec[i].getChildByName('ownchip');
            // if(ownChipNode)
            //     ownChipNode.active = false;

        }
     }, 

     caculateHighLightArea: function(resultId){
        if(resultId != 25){
            if(resultId % 2 == 0){//单双
                var shineNode = this.m_tAreaWinShineNodeVec[3];
                if(shineNode){
                    shineNode.active = true;
                    var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.6), cc.fadeIn(0.6)), 3);
                    shineNode.runAction(shineAct);
                }
            }else{
                var shineNode = this.m_tAreaWinShineNodeVec[1];
                if(shineNode){
                    shineNode.active = true;
                    var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.6), cc.fadeIn(0.6)), 3);
                    shineNode.runAction(shineAct);
                }
            }

            var shineAct1 = cc.repeat(cc.sequence(cc.fadeOut(0.6), cc.fadeIn(0.6)), 3);
            var shineNode1 = this.m_tAreaWinShineNodeVec[resultId + 9 - 1]; //具体数字
            if(shineNode1){
                shineNode1.active = true;
                shineNode1.runAction(shineAct1);
            }
        }

        if(resultId <= 12){//区间
            var shineNode = this.m_tAreaWinShineNodeVec[0];
            if(shineNode){
                shineNode.active = true;
                var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.6), cc.fadeIn(0.6)), 3);
                shineNode.runAction(shineAct);
            }

            if(resultId <= 6){
                var shineNode1 = this.m_tAreaWinShineNodeVec[5];
                if(shineNode1){
                    var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.6), cc.fadeIn(0.6)), 3);
                    shineNode1.active = true;
                    shineNode1.runAction(shineAct);
                }
            }else{
                var shineNode1 = this.m_tAreaWinShineNodeVec[6];
                if(shineNode1){
                    var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.6), cc.fadeIn(0.6)), 3);
                    shineNode1.active = true;
                    shineNode1.runAction(shineAct);
                }
            }
         }else if(resultId != 25){
            var shineNode = this.m_tAreaWinShineNodeVec[4];
            if(shineNode){
                shineNode.active = true;
                var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.6), cc.fadeIn(0.6)), 3);
                shineNode.runAction(shineAct);
            }

            if(resultId <= 18){
                var shineNode1 = this.m_tAreaWinShineNodeVec[7];
                if(shineNode1){
                    shineNode1.active = true;
                    var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.6), cc.fadeIn(0.6)), 3);
                    shineNode.runAction(shineAct);
                }
            }else{
                var shineNode1 = this.m_tAreaWinShineNodeVec[8];
                if(shineNode1){
                    shineNode1.active = true;
                    var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.6), cc.fadeIn(0.6)), 3);
                    shineNode1.runAction(shineAct);
                }
            }
         }else{
            var shineNode = this.m_tAreaWinShineNodeVec[2];
            if(shineNode){
                shineNode.active = true;
                var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.6), cc.fadeIn(0.6)), 3);
                shineNode.runAction(shineAct);
            }
         }

         
     },

     showWinAreaShine: function(){
        this.fadeOutMainUI();

        var winBetList = game_Data.getWinAreaList();
        winBetList.forEach(function(data){
            var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.4), cc.fadeIn(0.4)), 8);
            var shineNode = this.m_tAreaWinShineNodeVec[data.id - 1];
            if(shineNode){
                shineNode.active = true;
                shineNode.runAction(shineAct);
            }
        }.bind(this));

        setTimeout(function(){
            this.showResultWin();
        }.bind(this), 1800);
     },

     showWinCoinfly: function(){
        var winBetList = game_Data.getWinAreaList();
        winBetList.forEach(function(data){
            if(data.selfValue > 0){
                this.m_tBetAreaNodeVec[data.id - 1].getComponent('gameyj_lucky_turntable_coin_fly_act').playWinCoinFly();
            }
        }.bind(this));

        setTimeout(function(){
            cc.dd.UIMgr.openUI("gameyj_lucky_turntable/Prefab/resultTypeLayer",function (node) {
                let ui = node.getComponent('gameyj_lucky_result_typeUI');
                ui.playOwnWinAct();
            });//加载界面
        }.bind(this), 1500);
     },

     showResultWin: function(){
         var self = this;
        var showCoinfly = false;
        var winBetList = game_Data.getWinAreaList();
        winBetList.forEach(function(data, index){
            var shineSkeleton = self.m_tBetAreaNodeVec[data.id - 1].getChildByName('shineSkeleton');
            if(shineSkeleton){
                shineSkeleton.active = true;
                var bone = shineSkeleton.getComponent(sp.Skeleton);
                bone.setAnimation(0, 'dianguang', false);
            }
            if(data.selfValue > 0)
                showCoinfly = true;
            var dialogBox = self.m_tBetAreaNodeVec[data.id - 1].getChildByName('dialogbox');
            if(dialogBox){
                dialogBox.active = true;
                var winNum = dialogBox.getChildByName('reslutwin');
                if(winNum)
                    winNum.getComponent(cc.Label).string = '>' + self.convertChipNum(data.value, 0, 5);
                
                dialogBox.runAction(cc.sequence(cc.moveTo(0.3, cc.v2(dialogBox.x, dialogBox.y + 4)), cc.moveTo(0.3, cc.v2(dialogBox.x, dialogBox.y - 4)),
                                                cc.delayTime(3), cc.fadeOut(0.1), cc.callFunc(function(){
                                                    if(index == winBetList.length - 1){
                                                        for(var i = 0; i< 33; i++){
                                                            self.m_tAreaWinShineNodeVec[i].active = false;
                                                            var node = self.m_tBetAreaNodeVec[i].getChildByName('dialogbox')
                                                            node.opacity = 255;
                                                            node.active = false;
                                                        }

                                                        var winNum = game_Data.getWinCoin(); //获取个人盈利结果
                                                        if(winNum == 0){
                                                            var Canvas = cc.director.getScene().getChildByName('Canvas')
                                                            Canvas.getChildByName('root').getComponent('gameyj_lucky_turntable_mainUI').showRotationLayer();                                                
                                                        }else{
                                                            if(showCoinfly)
                                                                self.showWinCoinfly();
                                                            else{
                                                                cc.dd.UIMgr.openUI("gameyj_lucky_turntable/Prefab/resultTypeLayer",function (node) {
                                                                    let ui = node.getComponent('gameyj_lucky_result_typeUI');
                                                                    ui.playOwnWinAct();
                                                                });//加载界面
                                                            }

                                                        }
                                                    }
                                                })));
            }
        }.bind(this))
     },

     clearAllUI: function(){
         for(var i = 0; i < 33; i++)
            this.m_tOwnChipNodeVec[i].active = false;
     },

    //转换筹码字
    convertChipNum: function(num, type, usenum){
        var str = num;
        if(num >= 1000 && num < 10000){
            if(usenum != 4){
                str = (num / 1000).toFixed(type);
                var endStr = '';
                if(usenum == 0)
                    endStr = '千'
                else if(usenum == 5)
                    endStr = ';'
                str += endStr;
            }
        }else if(num >= 10000 && num < 100000000){
            str = (num / 10000).toFixed(type);
            var index = str.indexOf('.');
            if(index == 3)
                str = str.substr(0,5);
            else
                str = str.substr(0,4);
            var endStr =  ':';
            if(usenum == 0)
                endStr = '万'
            else if(usenum == 5)
                endStr = '<'
            str += endStr;

        }else if(num >= 100000000){
            str = (num / 100000000).toFixed(type);
            var index = str.indexOf('.');
            if(index == 3)
                str = str.substr(0,5);
            else
                str = str.substr(0,4);
            var endStr =  ';';
            if(usenum == 0)
                endStr = '亿'
            else if(usenum == 5)
                endStr = '=';
            str += endStr;
        }
        return str 
    },
});
