// create by wj 2021/01/13

cc.Class({
    extends: cc.Component,

    properties: {
        m_tHorseBetNodeList: {default: [], type: cc.Node, tooltip: '下注节点'},
        m_tRecordDataList: [],
        m_oProidTxt: cc.Label,
        Atals: cc.SpriteAtlas,
        m_tRewardListNode: {default: [], type: cc.Sprite, tooltip: '结果'},
    },

    onLoad () {
        var count = 0;
        for(var i = 0; i < 6; i++){//初始化马匹下注信息
            for(var j = i+1; j < 7; j++){
                this.m_tHorseBetNodeList[count] = cc.dd.Utils.seekNodeByName(this.node, 'betNode' + i + j);
                this.m_tHorseBetNodeList[count].tag = i * 10 + j
                if(this.m_tHorseBetNodeList[count])
                    this.updateHorseBetInfo(this.m_tHorseBetNodeList[count], false, null);
                    this.updateHorseOwnBetInfo(this.m_tHorseBetNodeList[count], false, null);
                count++;
            }
        }

        this.m_oIndexTxt = cc.dd.Utils.seekNodeByName(this.node, "pagetxt").getComponent(cc.Label);//翻页索引
        this.m_oTotalBetTxt = cc.dd.Utils.seekNodeByName(this.node, "total").getComponent(cc.Label);//总下注
        this.m_oTotalWinTxt = cc.dd.Utils.seekNodeByName(this.node, "win").getComponent(cc.Label);//总盈利



        this.m_oLeftBtn = cc.dd.Utils.seekNodeByName(this.node, 'arrowLeft');

        this.m_oRightBtn = cc.dd.Utils.seekNodeByName(this.node, 'arrowright');
        this.m_oRightBtn.active = false;
    },

    openRecordUI: function(data){//打开游戏记录界面
        this.m_nIndex = data.allNum;
        this.m_nStatrIndex = this.m_nIndex;
        this.setRecordData(data);
        if(this.m_nIndex == 1)
            this.m_oLeftBtn.active = false;

        this.showRecrodInfo();
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

    findBetInfoNode: function(id){//查找马匹下注节点
        var betNode = null;
        for(var i = 0; i < this.m_tHorseBetNodeList.length; i++){
            var node = this.m_tHorseBetNodeList[i];
            if(node.tag == id){
                betNode = node;
                return betNode;
            }
        }
        return betNode;
    },

    showRecrodInfo: function(){
        var infoData = this.m_tRecordDataList[this.m_nGetIndex - 1];
        this.m_oProidTxt.string = '第' + infoData.issueNum +'期开奖结果:'; //期数
        this.m_oProidTxt.node.active = true;

        this.m_oTotalBetTxt.string = infoData.bet; //总下注
        this.m_oTotalWinTxt.string = infoData.win; //总盈利
        this.m_oIndexTxt.string = this.m_nIndex + '/' + this.m_nAllIndeNum;

        var resultList = [];
        infoData.rewardsList.forEach(function(reward, index){//结果
            var node = this.findBetInfoNode(reward.id);
            if(node){
                this.updateHorseBetInfo(node, true, reward);
            }
            if(reward.id < 10)
                resultList.push(reward.id);
        }.bind(this));

        infoData.rewardsList.forEach(function(reward){
            if(reward.id > 10){
                var id = Math.floor(reward.id / 10);
                var check1 = false;
                var id1 = Math.floor(reward.id % 10);
                var check2 = false;
                for(var i = 0; i < resultList.length; i++){
                    if(id == resultList[i])
                        check1 = true;
                    if(id1 == resultList[i])
                        check2 = true;
                }
                if(!check1)
                    resultList.push(id);

                if(!check2)
                    resultList.push(id1);
            }
        })

        this.showRewardResult(resultList);

        infoData.betAreaList.forEach(function(area){//下注数据
            var node = this.findBetInfoNode(area.id);
            if(node){
                this.updateHorseOwnBetInfo(node, true, area);
            }
        }.bind(this))
    },

    //更新马匹下注信息
    updateHorseBetInfo(node, isShow, data){
        var selectBg = cc.dd.Utils.seekNodeByName(node, 'resultBg');
        selectBg.active = isShow;

        var oTotalBetTxt = cc.dd.Utils.seekNodeByName(node,'totalBet');
        oTotalBetTxt.active = isShow;
        if(data)
            oTotalBetTxt.getComponent(cc.Label).string = this.convertChipNum(data.value, 1, true);
        var oRateTxt = cc.dd.Utils.seekNodeByName(node,'betRate');
        oRateTxt.active = isShow;
        if(data)
            oRateTxt.getComponent(cc.Label).string = this.convertChipNum(data.value2 / 10, 1, true);
    },

    updateHorseOwnBetInfo: function(node, isShow, data){
        var ownbg = cc.dd.Utils.seekNodeByName(node, 'img_betBtn_value_bg');
        ownbg.active = isShow;

        var oOwnBetTxt = cc.dd.Utils.seekNodeByName(node, 'ownBet');
        oOwnBetTxt.active = isShow;
        if(data)
            oOwnBetTxt.getComponent(cc.Label).string = this.convertChipNum(data.value, 1);

        var oRateTxt = cc.dd.Utils.seekNodeByName(node,'betRate');
        oRateTxt.active = isShow;
        if(data)
            oRateTxt.getComponent(cc.Label).string = this.convertChipNum(data.value2 / 10, 1, true);
    },

    showRewardResult: function(rewardsList){
        for(var i = 0; i < rewardsList.length; i++){
            this.m_tRewardListNode[i].spriteFrame = this.Atals.getSpriteFrame('sm_num_' + rewardsList[i]);
            this.m_tRewardListNode[i].node.active = true;
        }
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
        var count = 0;
        for(var i = 0; i < 6; i++){//初始化马匹下注信息
            for(var j = i+1; j < 7; j++){
                this.m_tHorseBetNodeList[count] = cc.dd.Utils.seekNodeByName(this.node, 'betNode' + i + j);
                this.m_tHorseBetNodeList[count].tag = i * 10 + j
                if(this.m_tHorseBetNodeList[count])
                    this.updateHorseBetInfo(this.m_tHorseBetNodeList[count], false, null);
                    this.updateHorseOwnBetInfo(this.m_tHorseBetNodeList[count], false, null);
                count++;
            }
        }

        for(var i = 0; i < 3; i++){
            this.m_tRewardListNode[i].node.active = false;
        }
    },

    onClickRecord: function(){//发送游戏记录请求
        this.m_nSendRecordIndex = 2; 
 
        var msg = new cc.pb.hall.msg_get_excite_game_record_req;
        msg.setIndex(2);
        msg.setGameType(107);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_excite_game_record_req,msg,"msg_get_excite_game_record_req", true);     
     },

    onCloseUI: function(event, data){
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //转换筹码字
    convertChipNum: function(num, type, needfix){
        var str = num;
        if(num >= 10000 && num < 100000000){
            str = (num / 10000).toFixed(type);
            var index = str.indexOf('.');
            if(index == 3)
                str = str.substr(0,5) + '万';
            else
                str = str.substr(0,4) + '万';
        }else if(num >= 100000000){
            str = (num / 100000000).toFixed(type);
            var index = str.indexOf('.');
            if(index == 3)
                str = str.substr(0,5) + '亿';
            else
                str = str.substr(0,4) + '亿';
        }else{
            if(needfix){
                str = num.toFixed(type);
            }else{
                str = num;
            }
        }
        return str 
    },
});
