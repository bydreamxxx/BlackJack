// create by wj 2019/12/16
var game_Data = require('westward_journey_data_mannager').Westward_Journey_Data.Instance();
var chipSpirteCfg = require('westward_Journey_Config').ChipSpriteConfig;
const xy_audio = require('xiyou_audio');
const gameAudioPath = require('westward_Journey_Config').AuditoPath;

cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerNodeList: {default: [], type: cc.Node, tooltip: '玩家头像节点'},
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
        playerCaculateChipData_list: [],
        m_nBetAudioId : 6,

    },

    onLoad: function(){
        this.createChipPool();
        this.chip_list = new Array();
    },

    initChip: function(){
        //筹码分段数据配置
        var self = this;
        var configData = game_Data.getRoomConfigData();
        self.chipType_list.splice(0, self.chipType_list.length);
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
        var json = cc.sys.localStorage.getItem('westward_journey_chip');
        cc.log('===============11111' + json);
        json = null;
        if(json == 'false'){
            this.showAreaTotalBet(endIndex);
            return;
        }
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


    createChipAct: function(item, startIndex, endIndex, countTotal, type, isAct){//创建筹码节点
        if(countTotal <=0 ){
            this.m_nCount -= 1;
            this.createChipNode(startIndex, endIndex, type, isAct);
            return;
        }
        
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
    },

    hideWinShineAct: function(){
        var node = this.m_tBetAreaNodeList.parent.getChildByName('shineAct');
        node.active = false;

        this.chip_list.splice(0, this.chip_list.length);
        this.caculateChipData_list.splice(0, this.caculateChipData_list.length);
        this.costChipData_list.splice(0, this.costChipData_list.length);
        this.m_tChipContainorList.splice(0, this.m_tChipContainorList.length);
        this.playerCaculateChipData_list.splice(0, this.playerCaculateChipData_list.length);
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

    ///////////////******前八名和自己的筹码管理Begin *********/////////////////////////
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
        var data =  xy_audio.getItem(function(item){
            if(item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },

});
