//create by wj 2020/09/15
const PK_Config = require('pk_Config');

cc.Class({
    extends: cc.Component,

    properties: {
        m_oProidTxt: cc.Label, //期数
        m_oResultNode:cc.Node, //结果列表
        m_tSelectNodeList: {default: [], type: cc.Node, tooltip: '中奖表现列表'}, //中奖列表
        m_tOwnBetNodeList: {default: [], type: cc.Node, tooltip: '玩家下注列表'},
        m_oIndexTxt: cc.Label, //索引指示
        m_oTotalBetTxt: cc.Label, //总投注
        m_oTotalWinTxt: cc.Label, //盈利
        m_tRecordDataList:[],
        m_nIndex: 0,
        m_nGetIndex: 0,
        m_nRecordSendIndex: 0,
        m_tIconSpriteframe: {default: [], type : cc.SpriteFrame, tooltip: '路单图标'},

    },

    onLoad () {
        this.m_oProidTxt = cc.dd.Utils.seekNodeByName(this.node, "periodTxt").getComponent(cc.Label);//期数
        if(this.m_oProidTxt)
            this.m_oProidTxt.node.active = false;
        
        this.m_oResultNode = cc.dd.Utils.seekNodeByName(this.node, "infoNode");

        for(var i = 0; i < 5; i++){
            var areaNode = cc.dd.Utils.seekNodeByName(this.node, "areaBg" + i);
            if(areaNode){
                this.m_tSelectNodeList[i] = cc.dd.Utils.seekNodeByName(areaNode, "select");//中奖效果列表
                if(this.m_tSelectNodeList[i])
                    this.m_tSelectNodeList[i].active = false;
                this.m_tOwnBetNodeList[i] = cc.dd.Utils.seekNodeByName(areaNode, "betbg");//自己下注列表
                if(this.m_tOwnBetNodeList[i])
                    this.m_tOwnBetNodeList[i].active = false;
            }   
        }
        this.m_oIndexTxt = cc.dd.Utils.seekNodeByName(this.node, "indextxt").getComponent(cc.Label);//翻页索引
        this.m_oTotalBetTxt = cc.dd.Utils.seekNodeByName(this.node, "betTotalNum").getComponent(cc.Label);//总下注
        this.m_oTotalWinTxt = cc.dd.Utils.seekNodeByName(this.node, "winNum").getComponent(cc.Label);//总盈利



        this.m_oLeftBtn = cc.dd.Utils.seekNodeByName(this.node, 'arrowleft');

        this.m_oRightBtn = cc.dd.Utils.seekNodeByName(this.node, 'arrowright');
        this.m_oRightBtn.active = false;
    },

    openRecordUI: function(data){//打开游戏记录界面
        this.m_nIndex = data.allNum;
        this.m_nStatrIndex = this.m_nIndex;
        this.setRecordData(data);

        if(this.m_nIndex == 1)
            this.m_oLeftBtn.active = false;

        this.showRecrodInfo(this.m_tRecordDataList[0]);
        if(this.m_nSendRecordIndex != 2)
            this.onClickRecord();
    },

    sortRecordData: function(){
        if(this.m_tRecordDataList.length <= 1)
            return; 
        for(var i = 0; i < this.m_tRecordDataList.length - 1; i++){
            for(var j = 0; j < this.m_tRecordDataList.length - 1 -i; j++){
                if(this.m_tRecordDataList[j].issueNum > this.m_tRecordDataList[j+1].issueNum){
                    var tempData = this.m_tRecordDataList[j];
                    this.m_tRecordDataList[j] = this.m_tRecordDataList[j+1];
                    this.m_tRecordDataList[j+1] = tempData;
                }
            }
        }
    },

    setRecordData: function(data){//设置游戏数据
        this.m_nRecordSendIndex = data.index;//发送的索引
        this.m_nAllIndeNum = data.allNum; //所有游戏记录总数

        data.recordsList.forEach(function(item) {
            this.m_tRecordDataList.push(item);
        }.bind(this));

        this.sortRecordData();
        this.m_nGetIndex = this.m_tRecordDataList.length - (this.m_nStatrIndex - this.m_nIndex);
    },

    setIcon: function(pokerId, reelType){
        var textNode = cc.dd.Utils.seekNodeByName(this.m_oResultNode, 'pokerInfo'); //牌型描述
        textNode.active = true;
        var index1 = parseInt(parseInt(pokerId / 100) % 2);
        textNode.getComponent(cc.RichText).string = PK_Config.PK_PokerColor[index1] + PK_Config.PK_Poker[pokerId.toString()] + '</c>';

        var reelNode = cc.dd.Utils.seekNodeByName(this.m_oResultNode, 'reelType'); //命运转轮描述节点
        reelNode.active = true;
        if(reelType == 0) //没有命运转轮
            reelNode.active = false;
        else if(reelType >= 1 && reelType <= 13) //有命运转轮
            reelNode.getComponent(cc.Sprite).spriteFrame = this.m_tIconSpriteframe[reelType - 1];
        else if(reelType > 13){ //双响炮
            reelNode.active = false;
            var index2 = parseInt(parseInt(reelType / 100) % 2);
            textNode.setPosition(cc.v2(0, 0));
            textNode.getComponent(cc.RichText).fontSize = 20;
            var pokerDesc = '黑桃'
            if(parseInt(pokerId / 100) == 2)
                pokerDesc = '红桃'
            else if(parseInt(pokerId / 100) == 3)
                pokerDesc = '梅花'
            else if(parseInt(pokerId / 100) == 4)
                pokerDesc = '方块'
            textNode.getComponent(cc.RichText).string = PK_Config.PK_PokerColor[index1] + pokerDesc + '</c><color=#fcbd2d>&</c>' + PK_Config.PK_PokerColor[index2] + pokerDesc + '</c>';
        }
    },

    showRecrodInfo: function(){//游戏记录详细信息
        var infoData = this.m_tRecordDataList[this.m_nGetIndex - 1];
        this.m_oProidTxt.string = '第' + infoData.issueNum +'期'; //期数
        this.m_oProidTxt.node.active = true;
        infoData.rewardsList.forEach(function(reward, index){//结果

            this.setIcon(reward.id, reward.value);
            this.m_oResultNode.active = true;
        }.bind(this));

        infoData.betAreaList.forEach(function(area){//下注数据
            var betNumTxt = this.m_tOwnBetNodeList[area.id - 1].getChildByName('betNum');
            if(betNumTxt)
                betNumTxt.getComponent(cc.Label).string = area.value;
            this.m_tOwnBetNodeList[area.id-1].active = true;
        }.bind(this))

        infoData.rewardAreaList.forEach(function(index){//中奖区域选中
            this.m_tSelectNodeList[index-1].active = true;
        }.bind(this));

        this.m_oTotalBetTxt.string = infoData.bet; //总下注
        this.m_oTotalWinTxt.string = infoData.win; //总盈利
        this.m_oIndexTxt.string = this.m_nIndex + '/' + this.m_nAllIndeNum;

    },

    onClickArrowBtn: function(event, data){//点击箭头
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
            this.m_nGetIndex = this.m_tRecordDataList.length -  (this.m_nStatrIndex - this.m_nIndex);
            this.clearUI();
            this.showRecrodInfo();
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
            this.m_nGetIndex = this.m_tRecordDataList.length -  (this.m_nStatrIndex - this.m_nIndex);

            this.clearUI();
            this.showRecrodInfo();
        }
    },

    clearUI: function(){
        this.m_oResultNode.active = false;
        for(var i = 0; i < 11; i++){
            if(this.m_tSelectNodeList[i])
                this.m_tSelectNodeList[i].active = false;
            if(this.m_tOwnBetNodeList[i])
                this.m_tOwnBetNodeList[i].active = false;
        }
    },

    onClickRecord: function(){//发送游戏记录请求
        this.m_nRecordSendIndex = 2; 
 
        var msg = new cc.pb.hall.msg_get_excite_game_record_req;
        msg.setIndex(2);
        msg.setGameType(103);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_excite_game_record_req,msg,"msg_get_excite_game_record_req", true);     
     },

    onCloseUI: function(event, data){
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
