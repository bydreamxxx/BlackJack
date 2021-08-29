//create by wj 2020/06/17
const gameAudioPath = require('lucky_turntable_config').AuditoPath;
const audioConfig = require('lucky_turntable_audio');
var game_Data = require('lucky_turntable_data').Lucky_Turntable_Data.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oMainUI: cc.Node,
        m_oNoneDataUI:cc.Node,
        m_tResutBallVec: {default: [], type: cc.Node, tooltip:'路单列表节点容器'},
        m_tBetAreaVec: {default: [], type: cc.Node, tooltip:'下注区域'},
        m_tBillBgVec: {default: [], type: cc.SpriteFrame, tooltip:'路单节点背景'},
        m_oLeftBtn: cc.Node,
        m_oRightBtn: cc.Node,
        m_oTotalBetTxt: cc.Label,
        m_oWinTxt: cc.Label,
        m_oRounTxt: cc.Label,
        m_nIndex:0,
        m_nStatrIndex:0,
        m_tBillTypeSpVec: {default: [], type: cc.SpriteFrame, tooltip:'路单类型'},
        m_oBillTypeSp: cc.Sprite,
    },

    onLoad () {
        this.m_tRecordData = game_Data.getRecordGameData();//设置往期记录数据
        for(var i = 0; i < 3; i++){
            this.m_tResutBallVec[i] = cc.dd.Utils.seekNodeByName(this.node, 'ball' + i);
            if(this.m_tResutBallVec[i])
                this.m_tResutBallVec[i].active = false;
        }
        for(var i = 0; i < 33; i++){
            this.m_tBetAreaVec[i] = cc.dd.Utils.seekNodeByName(this.node, 'betNode' + (i+1));
            this.m_tBetAreaVec[i].getChildByName('ownchip').active = false;
            this.m_tBetAreaVec[i].getChildByName('winFram').active = false;
        }

        if(this.m_tRecordData.length == 0){
            this.m_oMainUI.active = false;
            this.m_oNoneDataUI.active = true;
            return;

        }else{
            this.m_oMainUI.active = true;
            this.m_oNoneDataUI.active = false;
        }
        this.m_nIndex = this.m_tRecordData.length;
        this.m_nStatrIndex = this.m_nIndex;

        this.m_oLeftBtn = cc.dd.Utils.seekNodeByName(this.node, 'arrowLeft');
        if(this.m_nIndex == 1)
            this.m_oLeftBtn.active = false;

        this.m_oRightBtn = cc.dd.Utils.seekNodeByName(this.node, 'arrowRight');
        this.m_oRightBtn.active = false;

        this.m_oIssueTxt = cc.dd.Utils.seekNodeByName(this.node, 'roundDesc');
        this.m_oIssueTxt.active = false;

        this.showReordInfo();
    },

    setIcon: function(node, icon){
        var numText = node.getChildByName('num').getComponent(cc.Label);
        var caiNode = node.getChildByName('cai');
        var bgSp = node.getComponent(cc.Sprite);
        if(icon == 25){ //中了彩
            caiNode.active = true;
            numText.node.active = false;
            bgSp.spriteFrame = this.m_tBillBgVec[2]; //绿色底
        }else{
            caiNode.active = false;
            numText.node.active = true;
            numText.string = icon; //设置中奖号码
            if(icon % 2 == 0)
                bgSp.spriteFrame = this.m_tBillBgVec[0]; //红色底
            else
                bgSp.spriteFrame = this.m_tBillBgVec[1]; //蓝色底
        }
    },

    showReordInfo: function(){
        var data = this.m_tRecordData[this.m_nIndex - 1]
        if(data){
            this.m_oIssueTxt.getComponent(cc.Label).string = '第' + data.phase + '期'; //设置期数
            this.m_oIssueTxt.active = true;
            if(data.type == 0)
                this.m_oBillTypeSp.node.active = false;
            else{
                this.m_oBillTypeSp.node.active = true;
                this.m_oBillTypeSp.spriteFrame = this.m_tBillTypeSpVec[data.type - 1];
            }
            
            data.resultList.forEach(function(item, index) {//设置中将号
                this.m_tResutBallVec[index].active = true;
                this.setIcon(this.m_tResutBallVec[index], item.icon);
            }.bind(this));

            data.areaList.forEach(function(item){ //设置中奖区域
                this.m_tBetAreaVec[item.id - 1].active = true;
                this.m_tBetAreaVec[item.id - 1].getChildByName('winFram').active = true;
            }.bind(this));

            var ownTotalBet = 0;

            data.betList.forEach(function(item){ //设置自己下注区域
                this.m_tBetAreaVec[item.id - 1].active = true;
                var ownChip = this.m_tBetAreaVec[item.id - 1].getChildByName('ownchip');
                if(ownChip){
                    ownChip.active = true;
                    ownChip.getChildByName('chipNum').getComponent(cc.Label).string = item.selfValue;
                    ownTotalBet += item.selfValue;
                }
            }.bind(this))

            this.m_oTotalBetTxt.string = ownTotalBet; //设置总投注
            this.m_oWinTxt.string = data.win; //设置盈利

            this.m_oRounTxt.string = this.m_nIndex + '/' + this.m_nStatrIndex;
        }

    },

    onClickArrowBtn: function(event, data){//点击箭头
        this.playAudio(10002, false);

        if(data == 1){
            this.m_nIndex += 1;
            this.m_oLeftBtn.active = true;
            if(this.m_nIndex > this.m_nStatrIndex){
                this.m_oRightBtn.active = false;
                this.m_nIndex -= 1;
                return;
            }
            if(this.m_nIndex == this.m_nStatrIndex)
                this.m_oRightBtn.active = false;
            else
                this.m_oRightBtn.active = true;
            this.clearUI();
            this.showReordInfo();
        }else{
            this.m_nIndex -= 1;
            this.m_oRightBtn.active = true;

            if( this.m_nIndex < 1){
                this.m_oLeftBtn.active = false;
                this.m_nIndex += 1;
                return;
            }
            if(this.m_nIndex == 1)
                this.m_oLeftBtn.active = false;

            this.clearUI();
            this.showReordInfo();
        }
    },

    clearUI: function(){
        for(var i = 0; i < 3; i++){
            if(this.m_tResutBallVec[i])
                this.m_tResutBallVec[i].active = false;
        }
        for(var i = 0; i < 33; i++){
            this.m_tBetAreaVec[i].getChildByName('ownchip').active = false;
            this.m_tBetAreaVec[i].getChildByName('winFram').active = false;
        }
    },

    onCloseUI: function(event, data){
        this.playAudio(10002, false);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //播放相应音效
    playAudio: function(audioId, isloop){
        var data =  audioConfig.getItem(function(item){
            if(item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },

});
