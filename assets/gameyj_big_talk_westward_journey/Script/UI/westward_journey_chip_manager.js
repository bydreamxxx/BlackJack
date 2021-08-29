// create by wj 2019/12/16
var game_Data = require('westward_journey_data_mannager').Westward_Journey_Data.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_tBetAreaNodeList: {default: [], type: require('westward_journey_chip'), tooltip: '下注区域节点'},
    },

    initChip: function(){
        this.m_tBetAreaNodeList.forEach(function(cpt) {
            cpt.initChip();
        });
    },

    createChipPool: function(){
        this.m_tBetAreaNodeList.forEach(function(cpt) {
            cpt.createChipPool();
        });
    }, 
    
    betAct: function(startIndex, endIndex, num, type, isAct){
        this.m_tBetAreaNodeList[endIndex - 1].betAct(startIndex, endIndex, num, type, isAct);
    },

    playerBetAct: function(startIndex, endIndex, num, type, isAct){
        this.m_tBetAreaNodeList[endIndex - 1].playerChipAct(startIndex, endIndex, num, type, isAct);
    },

    showAreaTotalBet: function(index){
        this.m_tBetAreaNodeList[index - 1].showAreaTotalBet(index);
    },

    showWinShineAct: function(index){
        this.m_tBetAreaNodeList[index - 1].showWinShineAct();
    },

    hideShineAct: function(){
        for(var i =0 ;i < this.m_tBetAreaNodeList.length; i++)
            this.m_tBetAreaNodeList[i].hideWinShineAct();
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
            this.m_tBetAreaNodeList[tCancelList[i]].clearSurplusChips();
        }
    },


    clearChipAllUI: function(){
        this.hideShineAct();
        for(var k = 0; k < this.m_tBetAreaNodeList.length; k++ ){
            this.m_tBetAreaNodeList[k].clearSurplusChips();
        }
    },
});
