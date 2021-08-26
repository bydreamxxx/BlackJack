//create by wj 2020/09/15

var gameIconConfig = require('birds_and_animals_config').IconConfg

cc.Class({
    extends: cc.Component,

    properties: {
        m_oProidTxt: cc.Label, //期数
        m_tResultNodeList: {default: [], type: cc.Node, tooltip: '结果列表'}, //结果列表
        m_tSelectNodeList: {default: [], type: cc.Node, tooltip: '中奖表现列表'}, //中奖列表
        m_tOwnBetNodeList: {default: [], type: cc.Node, tooltip: '玩家下注列表'},
        m_oIndexTxt: cc.Label, //索引指示
        m_oTotalBetTxt: cc.Label, //总投注
        m_oTotalWinTxt: cc.Label, //盈利
        m_tRecordDataList:[],
        m_oAtals:cc.SpriteAtlas,
        m_nIndex: 0,
        m_nGetIndex: 0,
        m_nRecordSendIndex: 0,
    },

    onLoad () {
        this.m_oProidTxt = cc.dd.Utils.seekNodeByName(this.node, "periodTxt").getComponent(cc.Label);//期数
        if(this.m_oProidTxt)
            this.m_oProidTxt.node.active = false;
        for(var i = 0; i < 3; i++){ //结果列表
            this.m_tResultNodeList[i] = cc.dd.Utils.seekNodeByName(this.node, "resultBg" + i);
            if(this.m_tResultNodeList[i])
                this.m_tResultNodeList[i].active = false;
        }
        for(var i = 0; i < 11; i++){
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
        this.m_nSendRecordIndex = data.index;//发送的索引
        this.m_nAllIndeNum = data.allNum; //所有游戏记录总数

        data.recordsList.forEach(function(item) {
            this.m_tRecordDataList.push(item);
        }.bind(this));

        this.sortRecordData();
        this.m_nGetIndex = this.m_tRecordDataList.length - (this.m_nStatrIndex - this.m_nIndex);
    },

    setIcon: function(iconNode, icon){
        if(iconNode){
            var data = gameIconConfig.getItem(function(item){
                if(item.id == icon)
                    return item;
            })
            var sprite = this.m_oAtals.getSpriteFrame(data.icon);
            iconNode.getComponent(cc.Sprite).spriteFrame = sprite;
        }
    },

    showRecrodInfo: function(){//游戏记录详细信息
        var infoData = this.m_tRecordDataList[this.m_nGetIndex - 1];
        this.m_oProidTxt.string = '第' + infoData.issueNum +'期'; //期数
        this.m_oProidTxt.node.active = true;
        infoData.rewardsList.forEach(function(reward, index){//结果
            var iconNode = this.m_tResultNodeList[index].getChildByName('icon');
            if(iconNode)
                this.setIcon(iconNode, reward.id);
            this.m_tResultNodeList[index].active = true;
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
        for(var i = 0; i < 3; i++){ //结果列表
            if(this.m_tResultNodeList[i])
                this.m_tResultNodeList[i].active = false;
        }
        for(var i = 0; i < 11; i++){
            if(this.m_tSelectNodeList[i])
                this.m_tSelectNodeList[i].active = false;
            if(this.m_tOwnBetNodeList[i])
                this.m_tOwnBetNodeList[i].active = false;
        }
    },

    onClickRecord: function(){//发送游戏记录请求
        this.m_nSendRecordIndex = 2; 
 
        var msg = new cc.pb.hall.msg_get_excite_game_record_req;
        msg.setIndex(2);
        msg.setGameType(104);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_excite_game_record_req,msg,"msg_get_excite_game_record_req", true);     
     },

    onCloseUI: function(event, data){
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
