// create by wj 2019/08/14
var game_Data = require('birds_and_animals_data').Birds_And_Animals_Data.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_tBetAreaNodeList: {default: [], type: cc.Node, tooltip: '下注区域节点'},
    },

    initChip: function(){
        this.m_tBetAreaNodeList.forEach(function(node) {
            node.getComponent('gameyj_Birds_And_Animals_Chip').initChip();
        });
    },

    createChipPool: function(){
        this.m_tBetAreaNodeList.forEach(function(node) {
            node.getComponent('gameyj_Birds_And_Animals_Chip').createChipPool();
        });
    },

    betAct: function(startIndex, endIndex, num, type, isAct){
        this.m_tBetAreaNodeList[endIndex - 1].getComponent('gameyj_Birds_And_Animals_Chip').betAct(startIndex, endIndex, num, type, isAct);
    },

    playerBetAct: function(startIndex, endIndex, num, type, isAct){
        this.m_tBetAreaNodeList[endIndex - 1].getComponent('gameyj_Birds_And_Animals_Chip').playerChipAct(startIndex, endIndex, num, type, isAct);
    },

    showAreaTotalBet: function(index){
        this.m_tBetAreaNodeList[index - 1].getComponent('gameyj_Birds_And_Animals_Chip').showAreaTotalBet(index);
    },

    showWinShineAct: function(index){
        this.m_tBetAreaNodeList[index - 1].getComponent('gameyj_Birds_And_Animals_Chip').showWinShineAct();
    },

    hideShineAct: function(){
        for(var i =0 ;i < this.m_tBetAreaNodeList.length; i++)
            this.m_tBetAreaNodeList[i].getComponent('gameyj_Birds_And_Animals_Chip').hideWinShineAct();
    },

    clearSurplusChips: function(){
        var winAreaList = game_Data.getWinAreaList();
        var tCancelList = [];
        for(var k = 0; k < this.m_tBetAreaNodeList.length; k++ ){
            var canCancel = true;
            for(var i = 0; i < winAreaList.length; i++){
                if(winAreaList[i].id - 1 == k)
                    canCancel = false;
            }
            if(canCancel)
                tCancelList.push(k);
        }

        for(var i = 0; i < tCancelList.length; i++){
            this.m_tBetAreaNodeList[tCancelList[i]].getComponent('gameyj_Birds_And_Animals_Chip').clearSurplusChips();
        }
    },

    addResultChips: function(index, chipDistance){
        this.m_tBetAreaNodeList[index - 1].getComponent('gameyj_Birds_And_Animals_Chip').betResultAct(chipDistance, index);
    },

    clearChipAllUI: function(){
        for(var k = 0; k < this.m_tBetAreaNodeList.length; k++ ){
            this.m_tBetAreaNodeList[k].getComponent('gameyj_Birds_And_Animals_Chip').clearSurplusChips();
        }
        this.hideShineAct();
    },
});
