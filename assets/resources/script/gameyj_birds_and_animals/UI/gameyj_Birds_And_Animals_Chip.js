// create by wj 2019/08/06
var game_Data = require('birds_and_animals_data').Birds_And_Animals_Data.Instance();
const gameAudioPath = require('birds_and_animals_config').AuditoPath;
const fqzs_audio = require('fqzs_audio');
const chipSpirteCfg = require('birds_and_animals_config').ChipSpriteConfig;

cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerNodeList: {default: [], type: cc.Node, tooltip: '玩家头像节点'},
        m_tResultNodeList: cc.Node,
        m_oOwnNode: cc.Node,
        m_oRoleNode: cc.Node,
        m_tBetAreaNodeList: cc.Node,
        m_oChipPrefab: cc.Prefab,
        chipType_list: [], //筹码规格类型
        costChipData_list: [], //本轮需要消耗的筹码数据
        caculateChipData_list: [], //计算中消耗的筹码数据
        chipAltas: cc.SpriteAtlas,
        totalChipCount: 0,
        m_nCount: 0,
        m_nIndex:0,
        m_tChipContainorList: [],

        playerChip_List: [],
        playerCostChipData_list: [], //本轮需要消耗的筹码数据
        m_tPlayerChipContainorList: [],
        m_nPlayerCount: 0,
        playerCaculateChipData_list: [],
        m_nBetAudioId: 10004,
    },

    onLoad () {
        this.createChipPool();
        this.chip_list = new Array();
    },

    initChip: function(){
        //筹码分段数据配置
        var self = this;
        self.chipType_list.splice(0, self.chipType_list.length);
        self.chipType_list = [];
        var configData = game_Data.getRoomConfigData();
        if(configData){
            var list = configData.bets_all.split(';');
            list.forEach(function(data) {
                self.chipType_list.push(data);
            });
        }
    },

    //创建筹码池
    createChipPool: function() {
        if(this.chipPool)
            this.chipPool.clear();
        this.chipPool = new cc.NodePool();
        var initCount = 100;
        for (var i = 0; i < initCount; i++) {
            var chip = cc.instantiate(this.m_oChipPrefab);
            this.chipPool.put(chip);
        }
    },

    //创建筹码
    createChip: function () {
        var chip = null;
        if (this.chipPool.size() > 0) {
            chip = this.chipPool.get();
        } else {
            chip = cc.instantiate(this.m_oChipPrefab);
        }
        return chip;
    },

    //获取筹码规格
    getChipType: function(num, endIndex){
        this.caculateChipData_list.splice(0, this.caculateChipData_list.length);
        this.caculateChipData_list = [];
        var tmp_num = num;
        for (var i = this.chipType_list.length -1; i >= 0; i--) {
            var spec = parseInt(this.chipType_list[i]);
            var mul = Math.floor(tmp_num / spec);
            if (mul > 0) {
                this.caculateChipData_list.push({ type: spec, cnt: mul, index: i , color: this.chipType_list[i].color, betIndex: endIndex });
                tmp_num = tmp_num % spec;
                if (tmp_num == 0) {
                    break;
                }
            }
        }
    },

    betAct: function(startIndex, endIndex, num, type, isAct){//抛筹码动画: startIndex: 0: 总玩家 1-8: 排行玩家 -1:自己
        this.getChipType(num, endIndex);
        var count = this.caculateChipData_list.length;
        var dataList = this.caculateChipData_list;
        var infoData = {
            count : count,
            containor : dataList,
            startIndex: startIndex,
            endIndex: endIndex,
        }
        this.m_tChipContainorList.push(infoData);
        if(this.m_nCount == 0){
            this.createChipNode(startIndex, endIndex,type, isAct);
        }
    },

    cloneDeep: function (obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                    result[key] = this.cloneDeep(obj[key]);   //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    },

    createChipNode: function(startIndex, endIndex,type, isAct){
        if(this.m_tChipContainorList.length != 0){
            if(this.m_nCount <= 0){
                var chipDataInfo = this.m_tChipContainorList.shift();
                this.m_nCount = chipDataInfo.count;
                startIndex = chipDataInfo.startIndex;
                endIndex = chipDataInfo.endIndex;
                this.costChipData_list = this.cloneDeep( chipDataInfo.containor);
                this.showAreaTotalBet(endIndex);
            }
        }
        if(this.m_nCount > 0){
            var item = this.costChipData_list[this.m_nCount - 1];
            if(item)
                this.createChipAct(item, startIndex, endIndex, item.cnt, type, isAct);
        }
    },

    playBetResultAudio: function(audioId, count){//播放筹码累增音效
        this.playAudio(audioId, false);
        audioId += 1;
        count += 1;
        if(count < 4){
        setTimeout(function() {
            //this.playBetResultAudio(audioId, count); 
            }.bind(this), 0.2);
        }
    },

    betResultAct: function(num, endIndex){//总结算筹码增加
        this.getChipType(num, endIndex);
        this.playBetResultAudio(10004, 1);

        for (var n = this.costChipData_list.length -1; n > 0; n--) {
            var item = this.costChipData_list[n];
            for(var i = 0; i < item.cnt; i++){
                var chipNode = this.createChip();
                chipNode.scale = 0.5;
                chipNode.active = true;
                // var chipNumNode = cc.dd.Utils.seekNodeByName(chipNode,'num');
                // var numStr = this.convertChipNum(parseInt(item.type), 0);
                // chipNumNode.getComponent(cc.Label).string = numStr;
        
                this.chip_list.push(chipNode);
                this.totalChipCount += 1;
        
                var chipSpriteNum = null;
                if(chipSpirteCfg[item.index].icon)
                    chipSpriteNum = chipSpirteCfg[item.index].icon;
                else{
                    chipSpriteNum = chipSpirteCfg[0].icon;
                    cc.log('=============item..index=======' + item.index);
                }
                var sprite = this.chipAltas.getSpriteFrame(chipSpriteNum);
                var cpt = chipNode.getChildByName('chouma').getComponent(cc.Sprite);
                cpt.spriteFrame = sprite;
                chipNode.parent = this.node;
                chipNode._tag = item.type;
                var randx =  (Math.floor((Math.random() * (15 - 13 + 1) + 13)) - Math.floor((Math.random() * (20 - 10 + 1) + 10))) / 10 ;
                var randy =  (Math.floor((Math.random() * (15 - 13 + 1) + 13)) - Math.floor((Math.random() * (20  - 10 + 1) + 10))) / 10 ;
                var endPos = this.m_tBetAreaNodeList.getPosition();
        
                var x = endPos.x + randx * (this.m_tBetAreaNodeList.width / 2);
                var y = endPos.y  + randy * (this.m_tBetAreaNodeList.height / 2);
        
                var chipStartPosNode = this.m_tResultNodeList;        
                var parent = this.m_tBetAreaNodeList.parent;
                var startPt_x = chipStartPosNode.getPosition().x - parent.getPosition().x;
                var startPt_y = chipStartPosNode.getPosition().y - parent.getPosition().y;
                chipNode.setPosition(cc.v2(startPt_x, startPt_y));
        
                var moveTo = cc.moveTo(0.5, cc.v2(x, y));
                chipNode.runAction(moveTo);
            }
        }

        var time = setTimeout(function(){
            this.clearChipsAct();
            this.playBetResultAudio(10004, 1);
            this.playerGetChips();
        }.bind(this), 1200);
    },

    createChipAct: function(item, startIndex, endIndex, countTotal, type, isAct){//创建筹码节点
        if(countTotal <=0 ){
            this.m_nCount -= 1;
            if(isAct){
                this.playAudio(this.m_nBetAudioId);
                this.m_nBetAudioId += 1;
                if(this.m_nBetAudioId == 10008)
                    this.m_nBetAudioId = 10004;
            }

            this.createChipNode(startIndex, endIndex, type, isAct);
            return;
        }
        
        var chipNode = this.createChip();
        chipNode.scale = 0.5;
        chipNode.active = true;
        // var chipNumNode = cc.dd.Utils.seekNodeByName(chipNode,'num');
        // var numStr = this.convertChipNum(parseInt(item.type), 0);
        // chipNumNode.getComponent(cc.Label).string = numStr;
        this.chip_list.push(chipNode);

        this.totalChipCount += 1;
        var chipSpriteNum = null;
        if(chipSpirteCfg[item.index].icon)
            chipSpriteNum = chipSpirteCfg[item.index].icon;
        else{
            chipSpriteNum = chipSpirteCfg[0].icon;
            cc.log('=============item..index=======' + item.index);
        }
        var sprite = this.chipAltas.getSpriteFrame(chipSpriteNum);
        var cpt = chipNode.getChildByName('chouma').getComponent(cc.Sprite);
        cpt.spriteFrame = sprite;
        chipNode.parent = this.node;
        chipNode._tag = item.type;
        var randx =  (Math.floor((Math.random() * (15 - 13 + 1) + 13)) - Math.floor((Math.random() * (20 - 10 + 1) + 10))) / 10 ;
        var randy =  (Math.floor((Math.random() * (15 - 13 + 1) + 13)) - Math.floor((Math.random() * (20  - 10 + 1) + 10))) / 10 ;
        var endPos = this.m_tBetAreaNodeList.getPosition();

        var x = endPos.x + randx * (this.m_tBetAreaNodeList.width / 2);
        var y = endPos.y  + randy * (this.m_tBetAreaNodeList.height / 2);

        var chipStartPosNode = this.m_oOwnNode;
        if(type == 0){//下注
            if(startIndex == 0)
                chipStartPosNode = this.m_oRoleNode;
            else if(startIndex > 0)
                chipStartPosNode = this.m_tPlayerNodeList[startIndex - 1];

            var parent = this.m_tBetAreaNodeList.parent;
            var startPt_x = chipStartPosNode.getPosition().x - parent.getPosition().x;
            var startPt_y = chipStartPosNode.getPosition().y - parent.getPosition().y;
            chipNode.setPosition(cc.v2(startPt_x, startPt_y));
            if(isAct){
                var moveTo = cc.moveTo(0.5, cc.v2(x, y));
                chipNode.runAction(moveTo);
                var timer = parseInt(Math.random() * (3- 1 + 1) + 1, 10) * 50;
                setTimeout(function()  {
                    var count = countTotal - 1;
                    if(count >= 0)
                        this.createChipAct(item, startIndex, endIndex, count, type, isAct);
                }.bind(this), timer);
            }else{
                chipNode.setPosition(cc.v2(x, y));
                var count = countTotal - 1;
                if(count >= 0)
                    this.createChipAct(item, startIndex, endIndex, count, type, isAct);
    
            }
        }

    },

    showAreaTotalBet: function(index){//显示区域的下注值
        var info = game_Data.getBetAreaInfoById(index);
        var node = this.m_tBetAreaNodeList.parent.getChildByName('chipNum');
        node.active = true;
        node.getComponent(cc.Label).string = this.convertChipNum(info.value, 2);
    },


    showWinShineAct: function(){
        var node = this.m_tBetAreaNodeList.parent.getChildByName('shineAct');
        node.active = true;
        node.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.4), cc.fadeIn(0.4))));
    },

    hideWinShineAct: function(){
        var node = this.m_tBetAreaNodeList.parent.getChildByName('shineAct');
        node.active = false;
        node.stopAllActions();

        this.chip_list.splice(0, this.chip_list.length);
        this.caculateChipData_list.splice(0, this.caculateChipData_list.length);
        this.costChipData_list.splice(0, this.costChipData_list.length);
        this.m_tChipContainorList.splice(0, this.m_tChipContainorList.length);
        this.m_nCount = 0;

    },


    clearSurplusChips: function(){//清除非结果的筹码
        for(var j = 0; j < this.chip_list.length; j++){
            var chipNode = this.chip_list[j];
            chipNode.active = false;
            chipNode.removeFromParent(true);
        }

        this.chip_list.splice(0, this.chip_list.length);
        this.caculateChipData_list.splice(0, this.caculateChipData_list.length);
        this.costChipData_list.splice(0, this.costChipData_list.length);
        this.m_tChipContainorList.splice(0, this.m_tChipContainorList.length);
        this.m_nCount = 0;

        var node = this.m_tBetAreaNodeList.parent.getChildByName('chipNum');
        node.active = false;
        this.totalChipCount = 0;
    },

    clearChipsAct: function(){//分发筹码
        if(this.chip_list.length == 0){
            this.chip_list.splice(0, this.chip_list.length);
            this.caculateChipData_list.splice(0, this.caculateChipData_list.length);
            this.costChipData_list.splice(0, this.costChipData_list.length);
            this.m_tChipContainorList.splice(0, this.m_tChipContainorList.length);
            this.m_nCount = 0;
            this.totalChipCount = 0;

            for(var j = 0; j < this.playerChip_List.length; j++){
                var chipNode = this.playerChip_List[j];
                chipNode.active = false;
                chipNode.removeFromParent(true);
            }
    
            this.playerChip_List.splice(0, this.playerChip_List.length);
    
            this.playerCostChipData_list.splice(0, this.playerCostChipData_list.length);
            this.playerCaculateChipData_list.splice(0, this.playerCaculateChipData_list.length);
            this.m_tPlayerChipContainorList.splice(0, this.m_tPlayerChipContainorList.length);
            this.m_nPlayerCount = 0;
    
            var node = this.m_tBetAreaNodeList.parent.getChildByName('chipNum');
            node.active = false;
            return;
        }
        var self = this;
        var chipNode = self.chip_list.shift();
        if(chipNode != null){                    
            var chipStartPosNode  = self.m_oRoleNode;

            var endpos_x = chipStartPosNode.getPosition().x - self.node.getPosition().x  - self.m_tBetAreaNodeList.getPosition().x;
            var endpos_y = chipStartPosNode.getPosition().y - self.node.getPosition().y   - self.m_tBetAreaNodeList.getPosition().y;

            chipNode.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(endpos_x, endpos_y)), cc.delayTime(0.01), cc.callFunc(function () {
                chipNode.active = false;
                chipNode.removeFromParent(true);
            })));

            setTimeout(function()  {
                this.clearChipsAct();
            }.bind(this), 6);

        }
    },

    getPlayerChipType: function(num, endIndex){
        this.playerCaculateChipData_list.splice(0, this.playerCaculateChipData_list.length);
        this.playerCaculateChipData_list = [];
        var tmp_num = num;
        for (var i = this.chipType_list.length -1; i >= 0; i--) {
            var spec = parseInt(this.chipType_list[i]);
            var mul = Math.floor(tmp_num / spec);
            if (mul > 0) {
                this.playerCaculateChipData_list.push({ type: spec, cnt: mul, index: i , color: this.chipType_list[i].color, betIndex: endIndex });
                tmp_num = tmp_num % spec;
                if (tmp_num == 0) {
                    break;
                }
            }
        }
    },

    playerGetChips: function(){ //玩家抽筹码
        var self = this;
        var winPlayerList = game_Data.getPlayerList();
        winPlayerList.forEach(function(playerInfo){
            if(playerInfo.win > 0){
                playerInfo.rank8WinList.forEach(function(Info){
                    self.playerGetChipsAct(0, playerInfo.rank, Info.value, 1, true);
                })
            }
        })

        var winAreaList = game_Data.getWinAreaList();
        winAreaList.forEach(function(data){
            if(data.selfValue){
                var ownArea = game_Data.getOwnBetAreaInfoById(data.id);
                if(ownArea)
                    self.playerGetChipsAct(0, 0, (data.selfValue - ownArea.value), 1, true);
            }
        })
    },

    playerGetChipsAct: function(startIndex, endIndex, num, type, isAct){//玩家收筹码

        this.getPlayerChipType(num);

        var count = this.playerCaculateChipData_list.length;
        var dataList = this.playerCaculateChipData_list;
        var infoData = {
            count : count,
            containor : dataList,
            endIndex: endIndex,
        }
        this.m_tPlayerChipContainorList.push(infoData);
        if(this.m_nPlayerCount == 0)
            this.createPlayerChipNode(startIndex, endIndex,type, isAct);
    },

    createPlayerChipNode: function(startIndex, endIndex,type, isAct){ //玩家筹码创建
        if(this.m_tPlayerChipContainorList.length != 0){
            if(this.m_nPlayerCount <= 0){
                var chipDataInfo = this.m_tPlayerChipContainorList.shift();
                this.m_nPlayerCount = chipDataInfo.count;
                endIndex = chipDataInfo.endIndex;
                this.playerCostChipData_list = this.cloneDeep( chipDataInfo.containor);
            }
        }
        if(this.m_nPlayerCount > 0){
            var item = this.playerCostChipData_list[this.m_nPlayerCount - 1];
            if(item)
                this.createPlayerChipAct(item, startIndex, endIndex, item.cnt, type, isAct);
        }
    },

    createPlayerChipAct: function(item, startIndex, endIndex, countTotal, type, isAct){//创建筹码节点
        if(countTotal <=0 ){
            this.m_nPlayerCount -= 1;
            this.createPlayerChipNode(startIndex, endIndex, type, isAct);
            return;
        }
        
        var chipNode = this.createChip();
        chipNode.scale = 0.5;
        chipNode.active = true;
        // var chipNumNode = cc.dd.Utils.seekNodeByName(chipNode,'num');
        // var numStr = this.convertChipNum(parseInt(item.type), 0);
        // chipNumNode.getComponent(cc.Label).string = numStr;
        this.playerChip_List.push(chipNode);

        this.totalChipCount += 1;

        var chipSpriteNum = null;
        if(chipSpirteCfg[item.index].icon)
            chipSpriteNum = chipSpirteCfg[item.index].icon;
        else{
            chipSpriteNum = chipSpirteCfg[0].icon;
            cc.log('=============item..index=======' + item.index);
        }
        var sprite = this.chipAltas.getSpriteFrame(chipSpriteNum);
        var cpt = chipNode.getChildByName('chouma').getComponent(cc.Sprite);
        cpt.spriteFrame = sprite;
        chipNode.parent = this.node;
        chipNode._tag = item.type;
        var randx =  (Math.floor((Math.random() * (15 - 13 + 1) + 13)) - Math.floor((Math.random() * (20 - 10 + 1) + 10))) / 10 ;
        var randy =  (Math.floor((Math.random() * (15 - 13 + 1) + 13)) - Math.floor((Math.random() * (20  - 10 + 1) + 10))) / 10 ;
        var endPos = this.m_tBetAreaNodeList.getPosition();

        var x = endPos.x + randx * (this.m_tBetAreaNodeList.width / 2);
        var y = endPos.y  + randy * (this.m_tBetAreaNodeList.height / 2);
        chipNode.setPosition(cc.v2(x, y));

        var chipStartPosNode = this.m_oOwnNode;
        if(endIndex != 0)
            chipStartPosNode = this.m_tPlayerNodeList[endIndex - 1];

        var parent = this.m_tBetAreaNodeList.parent;
        var startPt_x = chipStartPosNode.getPosition().x - parent.getPosition().x - this.m_tBetAreaNodeList.getPosition().x;
        var startPt_y = chipStartPosNode.getPosition().y - parent.getPosition().y - this.m_tBetAreaNodeList.getPosition().y;


        chipNode.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(startPt_x, startPt_y)), cc.delayTime(0.01), cc.callFunc(function () {
            chipNode.active = false;
            chipNode.removeFromParent(true);
        })));
        setTimeout(function()  {
            var count = countTotal - 1;
            if(count >= 0)
                this.createPlayerChipAct(item, startIndex, endIndex, count, type, isAct);
        }.bind(this), 6);
    },


    ///////////////******前八名和自己的筹码管理Begin *********/////////////////////////
    playerChipAct: function(startIndex, endIndex, num, type, isAct){
        this.getPlayerChipType(num);
        for (var n = 0; n < this.playerCaculateChipData_list.length ;  n++) {
            var item = this.playerCaculateChipData_list[n];
            for(var i = 0; i < item.cnt; i++){
                var chipNode = this.createChip();
                chipNode.scale = 0.5;
                chipNode.active = true;
                this.chip_list.push(chipNode);

                this.totalChipCount += 1;
                var chipSpriteNum = null;
                if(chipSpirteCfg[item.index].icon)
                    chipSpriteNum = chipSpirteCfg[item.index].icon;
                else{
                    chipSpriteNum = chipSpirteCfg[0].icon;
                    cc.log('=============item..index=======' + item.index);
                }                var sprite = this.chipAltas.getSpriteFrame(chipSpriteNum);
                var cpt = chipNode.getChildByName('chouma').getComponent(cc.Sprite);
                cpt.spriteFrame = sprite;
                chipNode.parent = this.node;
                chipNode._tag = item.type;
                var randx =  (Math.floor((Math.random() * (15 - 13 + 1) + 13)) - Math.floor((Math.random() * (20 - 10 + 1) + 10))) / 10 ;
                var randy =  (Math.floor((Math.random() * (15 - 13 + 1) + 13)) - Math.floor((Math.random() * (20  - 10 + 1) + 10))) / 10 ;
                var endPos = this.m_tBetAreaNodeList.getPosition();

                var x = endPos.x + randx * (this.m_tBetAreaNodeList.width / 2);
                var y = endPos.y  + randy * (this.m_tBetAreaNodeList.height / 2);

                var chipStartPosNode = this.m_oOwnNode;
                if(type == 0){//下注
                    if(startIndex == 0)
                        chipStartPosNode = this.m_oRoleNode;
                    else if(startIndex > 0)
                        chipStartPosNode = this.m_tPlayerNodeList[startIndex - 1];

                    var parent = this.m_tBetAreaNodeList.parent;
                    var startPt_x = chipStartPosNode.getPosition().x - parent.getPosition().x;
                    var startPt_y = chipStartPosNode.getPosition().y - parent.getPosition().y;
                    chipNode.setPosition(cc.v2(startPt_x, startPt_y));
                    if(isAct){
                        var moveTo = cc.moveTo(0.5, cc.v2(x, y));
                        chipNode.runAction(moveTo);
                    }
                }
            }
        }

    },

    ///////////////******前八名和自己的筹码管理End *********/////////////////////////


    //转换筹码字
    convertChipNum: function(num, type){
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
        }
        return str 
    },

    //播放相应音效
    playAudio: function(audioId, isloop){
        var data =  fqzs_audio.getItem(function(item){
            if(item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },
});
