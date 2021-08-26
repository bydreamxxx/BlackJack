
var  jlmj_str  = require('jlmj_strConfig');
var pai3d_value = require("jlmj_pai3d_value");
const gang_pai_List = require('jlmj_gang_pai_type');
const paiType = require('jlmj_gang_pai_type').CardType;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
let GameType = cc.dd.Define.GameType;
let HuTypeDesc = require('jlmj_define').SCHuTypeDesc;

const cardType = cc.Enum({
    CHI:1,
    PENG:2,
    GANG:3,
    BUGANG:4,//这个不是补杠是摸牌
    SHOUPAI:5,
    HUPAI:6,
    DUIDAO: 10,
    LZB: 11,
    BUHUA: 12,
});//吃1 碰2 杠3 补杠4 手牌列表5 胡哪张6 ...

const cardTypeSC = cc.Enum({
    PENG:1,
    GANG:2,
    SHOUPAI:3,
    MOPAI:4,
    HUPAI:5,
});

const teshuType = cc.Enum({
    NORMAL: 0,//和龙风杠
    ZFB_CHI:2,
    MING_GANG:3,
    AN_GANG:4,
    XI_GANG:5,
});//默认0 普通吃牌1 中發白吃牌2 明杠3 暗杠4

// const FengColor = {
//     FU_FENG: cc.color( 181, 175, 175 ),
//     ZHENG_FENG: cc.color( 239, 225, 44 )
// };


var jlmj_jiesuan = cc.Class({
    extends: cc.Component,

    properties: {
        headSp:cc.Sprite,//头像
        nameTTF:cc.Label,//名字
        ID_TTF:cc.Label,//id
        statusNode:cc.Node,//状态节点

        hupaiNameTTF:cc.Label,//胡牌类型
        gangMarkTTF:cc.Label,//刚分
        huMarkTTF:cc.Label,//胡分
        allMarkTTF:cc.Label,//总得分
        xiaojiTTF:cc.Label,//小鸡
        fwFont:[cc.Label],//方位节点 对家 玩家 上家 下家

        //添加牌的节点
        addPaiNode:cc.Node,
        addPaiNode_sub:cc.Node,

        lsFont:cc.Font,
        hsFont:cc.Font,

        zhangshu:[cc.SpriteFrame],//重复张数图片 x2 x3 x4
        paiNode:[cc.SpriteFrame],//牌样式
        extraLabel: cc.Label,
        extraLabel2: cc.Label,

        loseFont:cc.Font,
        winFont:cc.Font,
        loseWan: cc.Node,
        winWan: cc.Node,
        plus: cc.Node,
        minus: cc.Node,

        huLabel:cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 去掉手牌中的胡牌 ，自摸时的问题
     */
    quHupai:function (data, ishupai) {
        if (ishupai) {
            let shoupai, hupaiID = -1;
            for (let i = 0; i < data.pailistList.length; i++) {
                if (data.pailistList[i].cardtype == cardType.BUGANG) {
                    shoupai = data.pailistList[i].cardinfo.cardindexList;
                } else if (data.pailistList[i].cardtype == cardType.HUPAI) {
                    hupaiID = data.pailistList[i].cardinfo.cardindexList[0];
                }
            }

            for (var i in shoupai) {
                if (shoupai[i] == hupaiID) {
                    shoupai.splice(i, 1);
                }
            }
        }

        if(RoomMgr.Instance().isSuiHuaMJ()) {
            let shouIdx = -1;
            let lzbIdx = -1;
            for (let i = 0; i < data.pailistList.length; i++) {
                if (data.pailistList[i].cardtype == cardType.LZB) {
                    lzbIdx = i;
                } else if (data.pailistList[i].cardtype == cardType.SHOUPAI) {
                    shouIdx = i;
                }
            }
            if (shouIdx != -1 && lzbIdx != -1 && shouIdx < lzbIdx) {
                let lzb = data.pailistList.splice(lzbIdx, 1);
                data.pailistList.splice(shouIdx, 0, lzb[0]);
            }
        }

    },

    /**
     * 设置数据
     * @param data
     */
    setData:function (data,hutypeList) {
        if(RoomMgr.Instance().isJiSuMJ()){
            this.huMarkTTF.string   = data.hufen+'番';
            this.gangMarkTTF.string = data.gangfen+'番';
            this.extraLabel.string  = data.zhafen+'番';
            this.extraLabel2.string = data.genzysfen+'番';
            this.xiaojiTTF.string   = data.yupaifen+'番';

            this.hupaiNameTTF.string = '房间倍率: '+data.xuehunfen+'\n总番数: '+data.paofen;

            if(data.total > 0){
                let winColor = new cc.Color(254, 243, 202);
                this.huMarkTTF.node.color = winColor;
                this.gangMarkTTF.node.color = winColor;
                this.extraLabel.node.color = winColor;
                this.extraLabel2.node.color = winColor;
                this.xiaojiTTF.node.color = winColor;
                winColor = new cc.Color(162, 73, 48);
                this.hupaiNameTTF.node.color = winColor;
            }else{
                let loseColor = new cc.Color(172, 185, 191);
                this.huMarkTTF.node.color = loseColor;
                this.gangMarkTTF.node.color = loseColor;
                this.extraLabel.node.color = loseColor;
                this.extraLabel2.node.color = loseColor;
                this.xiaojiTTF.node.color = loseColor;
                loseColor = new cc.Color(103, 121, 128);
                this.hupaiNameTTF.node.color = loseColor;
            }

            let num = Math.abs(Number(data.total));
            if (num < 10000) {
                this.allMarkTTF.string = num.toString();
            } else if (num >= 10000 && num < 1000000) {
                this.allMarkTTF.string = (Math.floor(num * 100 / 10000) / 100).toString().replace('.','/');
            } else {
                this.allMarkTTF.string = Math.floor(num / 10000).toString();
            }

            if(data.total > 0){
                this.plus.active = true;
                this.minus.active = false;
                this.allMarkTTF.font = this.winFont;
                if(data.total >= 10000) {
                    this.winWan.active = true;
                }else{
                    this.winWan.active = false;
                }
                this.loseWan.active = false;
            }else if(data.total < 0){
                this.plus.active = false;
                this.minus.active = true;
                this.allMarkTTF.font = this.loseFont;
                if(data.total <= -10000) {
                    this.loseWan.active = true;
                }else{
                    this.loseWan.active = false;
                }
                this.winWan.active = false;
            }else{
                this.plus.active = false;
                this.minus.active = false;
                this.allMarkTTF.font = this.loseFont;
                this.winWan.active = false;
                this.loseWan.active = false;
            }
            return;
        }

        let isSCMJ = RoomMgr.Instance().isXueZhanMJ() || RoomMgr.Instance().isXueLiuMJ();

        this.dianpaoNode = cc.find('dianpao', this.node);
        if(this.dianpaoNode){
            this.dianpaoNode.active = false;
        }

        if(RoomMgr.Instance().isTuiDaoHuMJ() && data.huinfoList.length > 0){
            hutypeList = data.huinfoList[0].hutypeList;
        }
        if(RoomMgr.Instance().isNongAnMJ() || RoomMgr.Instance().isSuiHuaMJ() || RoomMgr.Instance().isPingZhuangMJ()){
            let func = ()=>{
                let isMenQing = true;
                for(let i = 0; i < data.pailistList.length; i++){
                    let info = data.pailistList[i];
                    if(info.cardtype == cardType.CHI || info.cardtype == cardType.PENG || info.cardtype == cardType.BUGANG){
                        if(info.cardinfo.cardindexList.length != 0){
                            isMenQing = false;
                        }
                    }else if(info.cardtype == cardType.GANG){
                        if(info.cardinfo.cardindexList.length != 0 && info.cardinfo.type != teshuType.AN_GANG){
                            isMenQing = false;
                        }
                    }else if(info.cardtype == cardType.SHOUPAI && info.cardinfo.cardindexList.length >= 13){
                        let cardType = {}
                        info.cardinfo.cardindexList.forEach((id)=>{
                            let pengDes = pai3d_value.desc[id].split('[')[0];
                            if(cardType.hasOwnProperty(pengDes)){
                                cardType[pengDes]++;
                            }else{
                                cardType[pengDes] = 1;
                            }
                        })

                        let is7Dui = 0
                        for(let k in cardType){
                            if(cardType.hasOwnProperty(k) && cardType[k] == 2){
                                is7Dui++;
                            }
                        }

                        if(is7Dui >= 6){
                            isMenQing = false;
                        }
                    }
                }
                if(RoomMgr.Instance().isNongAnMJ()){
                    data.isMenqing = isMenQing && RoomMgr.Instance()._Rule.ismenqingfanbei;
                }else if(RoomMgr.Instance().isSuiHuaMJ()){
                    data.isMenqing = isMenQing && RoomMgr.Instance()._Rule.ismenting;
                }else if(RoomMgr.Instance().isPingZhuangMJ()){
                    data.isMenqing = isMenQing
                }
            }

            if(cc.dd._.isArray(hutypeList)){
                let menqing = hutypeList.indexOf(9)
                if(menqing != -1) {
                    hutypeList.splice(menqing, 1);
                    data.isMenqing = true;
                }else{
                    func();
                }
            }else{
                func();
            }
        }

        this._xiaojicount = 0;

        if (data.uinfo.head.indexOf('.jpg') != -1) {
            let robotUrl = require('Platform').GetRobotUrl();
            cc.dd.SysTools.loadWxheadH5(this.headSp, robotUrl+data.uinfo.head);
        }
        else {
            cc.dd.SysTools.loadWxheadH5(this.headSp, data.uinfo.head, data.uinfo.sex);
        }
        this.nameTTF.string =  cc.dd.Utils.subChineseStr(data.nick, 0 , 8);
        this.ID_TTF.string  = data.userid;
        this.userId = data.userid;

        if(RoomMgr.Instance().isUseNeiMengMJConfig()) {
            this.hupaiNameTTF.string = '';
            let minggang = 0;
            let angang = 0;
            for (var i = 0; data.pailistList && i < data.pailistList.length; ++i) {
                var info = data.pailistList[i];
                if (info.cardinfo.type == teshuType.AN_GANG) {
                    angang++;
                } else if (info.cardinfo.type == teshuType.MING_GANG || info.cardtype == cardType.GANG) {
                    minggang++;
                }
            }
            if (minggang > 0) {
                this.hupaiNameTTF.string += (minggang + '明杠 ');
            }
            if (angang > 0) {
                this.hupaiNameTTF.string += (angang + '暗杠 ');
            }
            if (cc.dd._.isNumber(data.playerPaoFen) && data.playerPaoFen > 0) {
                this.hupaiNameTTF.string += (data.playerPaoFen + '铺分 ');
            }

            if(typeof(data.genzysfen) != "undefined" && RoomMgr.Instance().isPingZhuangMJ()){
                if(data.genzysfen != 0){
                    this.hupaiNameTTF.string += '跟庄有赏 '
                }
            }

            if (hutypeList) {
                this.hupaiNameTTF.string += this.gethupaiStr(hutypeList);
            }
            if (data.isdianpao) {
                this.hupaiNameTTF.string += '点炮 '

                if (this.dianpaoNode) {
                    this.dianpaoNode.active = true;
                }
            }
            if (data.isMenqing || (data.baolistList.length > 0 == true && RoomMgr.Instance().isAoHanMJ())) {
                this.hupaiNameTTF.string += '门清 '
            }
        }else if(isSCMJ){
            this.hupaiNameTTF.string = '';
            let minggang = 0;
            let angang = 0;
            for (var i = 0; data.pailistList && i < data.pailistList.length; ++i) {
                var info = data.pailistList[i];
                if (info.cardinfo.type == teshuType.AN_GANG) {
                    angang++;
                } else if (info.cardinfo.type == teshuType.MING_GANG || info.cardtype == cardTypeSC.GANG) {
                    minggang++;
                }
            }
            if (minggang > 0) {
                this.hupaiNameTTF.string += (minggang + '刮风 ');
            }
            if (angang > 0) {
                this.hupaiNameTTF.string += (angang + '下雨 ');
            }
            if (data.huinfoList && RoomMgr.Instance().isXueZhanMJ()) {
                for(let i = 0; i < data.huinfoList.length; i++){
                    let _data = data.huinfoList[i];
                    if(_data.huuserid == data.userid || _data.loseuseridList.indexOf(data.userid) != -1){
                        this.hupaiNameTTF.string += this.gethupaiStrSC(_data.hutypeList, _data.gounums);
                    }
                }
            }
        }else{
            //
            if(hutypeList){
                this.hupaiNameTTF.string = this.gethupaiStr(hutypeList);
            }else{
                this.hupaiNameTTF.string = '';
            }

            if(data.isdianpao){
                this.hupaiNameTTF.string += '点炮 '
            }
            if(data.isxiaosa == true && RoomMgr.Instance().isFuXinMJ()){
                this.hupaiNameTTF.string += '潇洒 '
            }
            if(data.isxiaosa == true && RoomMgr.Instance().isHeLongMJ()){
                this.hupaiNameTTF.string += '门清  '
            }
            if(data.isMenqing){
                if(RoomMgr.Instance().isBaiChengMJ()){
                    this.hupaiNameTTF.string += '背靠背 '
                }else{
                    this.hupaiNameTTF.string += '门清 '
                }
            }

            if(typeof(data.genzysfen) != "undefined" && (RoomMgr.Instance().isJinZhouMJ() || RoomMgr.Instance().isHeiShanMJ())){
                if(data.genzysfen != 0){
                    this.hupaiNameTTF.string += '跟庄有赏 '
                }
            }

            if(RoomMgr.Instance().isFangZhengMJ()){
                let xipai = 0;
                for (var i = 0; data.pailistList && i < data.pailistList.length; ++i) {
                    var info = data.pailistList[i];
                    if (info.cardinfo.type == teshuType.XI_GANG) {
                        xipai++;
                    }
                }

                if(xipai > 0){
                    this.hupaiNameTTF.string += (xipai + '亮喜 ');
                }
            }
        }


        let withoutTing = false;
        if(isSCMJ || RoomMgr.Instance().isJinZhouMJ() || RoomMgr.Instance().isHeiShanMJ() || RoomMgr.Instance().isTuiDaoHuMJ() || RoomMgr.Instance().isChiFengMJ() || RoomMgr.Instance().isAoHanMJ() || RoomMgr.Instance().isWuDanMJ() || RoomMgr.Instance().isPingZhuangMJ() || RoomMgr.Instance().isBaiChengMJ()){
            withoutTing = true;
        }
        this.statusNode.getComponent('mj_jiesuan_zhuangtai').setData(data, withoutTing);


        // this.gangMarkTTF.node.setColor( data.gangfen<0?FengColor.FU_FENG:FengColor.ZHENG_FENG);
        // this.huMarkTTF.node.setColor(data.hufen<0?FengColor.FU_FENG:FengColor.ZHENG_FENG);

        //设置方位信息
        if(data.uinfo.ziji){
            this.fwFont[0].node.active = true;
            this.fwFont[1].node.active = false;
            this.fwFont[0].string = data.uinfo.fangwei;
        }else{
            this.fwFont[0].node.active = false;
            this.fwFont[1].node.active = true;
            this.fwFont[1].string = data.uinfo.fangwei;
        }



        //总分
        // this.allMarkTTF.string = cc.dd.Utils.getNumToWordTransform(data.total).replace('.','/');

        if(RoomMgr.Instance().isUseNeiMengMJConfig()) {
            this.allMarkTTF.string = cc.dd.Utils.getNumToWordTransform(data.total);

            let ganghu = data.paofen + data.hufen;

            if(RoomMgr.Instance().isPingZhuangMJ() && typeof(data.genzysfen) != "undefined"){
                ganghu += data.genzysfen;
            }

            this.gangMarkTTF.string = (ganghu > 0 ? '+' : '') + cc.dd.Utils.getNumToWordTransform(ganghu);
            this.huMarkTTF.string = (data.gangfen > 0 ? '+' : '') + cc.dd.Utils.getNumToWordTransform(data.gangfen);
        }else if(isSCMJ){
            this.allMarkTTF.string = cc.dd.Utils.getNumToWordTransform(data.score);
        }else{
            if(RoomMgr.Instance().isFangZhengMJ() || RoomMgr.Instance().isAChengMJ()){
                this.gangMarkTTF.string = '';
                this.huMarkTTF.string = '';
            }else{
                this.gangMarkTTF.string = '杠'+(data.gangfen > 0 ? '+' : '') + cc.dd.Utils.getNumToWordTransform( data.gangfen );
                this.huMarkTTF.string   = '胡分'+(data.hufen > 0 ? '+' : '') + cc.dd.Utils.getNumToWordTransform( data.hufen );
            }

            let num = Math.abs(Number(data.total));
            if (num < 10000) {
                this.allMarkTTF.string = num.toString();
            } else if (num >= 10000 && num < 1000000) {
                this.allMarkTTF.string = (Math.floor(num * 100 / 10000) / 100).toString().replace('.','/');
            } else {
                this.allMarkTTF.string = Math.floor(num / 10000).toString();
            }

            if(data.total > 0){
                this.plus.active = true;
                this.minus.active = false;
                this.allMarkTTF.font = this.winFont;
                if(data.total >= 10000) {
                    this.winWan.active = true;
                }else{
                    this.winWan.active = false;
                }
                this.loseWan.active = false;
            }else if(data.total < 0){
                this.plus.active = false;
                this.minus.active = true;
                this.allMarkTTF.font = this.loseFont;
                if(data.total <= -10000) {
                    this.loseWan.active = true;
                }else{
                    this.loseWan.active = false;
                }
                this.winWan.active = false;
            }else{
                this.plus.active = false;
                this.minus.active = false;
                this.allMarkTTF.font = this.loseFont;
                this.winWan.active = false;
                this.loseWan.active = false;
            }
        }

        // this.allMarkTTF.node.setColor(data.total<0?FengColor.FU_FENG:FengColor.ZHENG_FENG);

        //去掉手牌中的胡牌  如果有
        this.quHupai(data, hutypeList);

        let huArr = [];

        var arr = [];
        if(isSCMJ){
            arr = this.initpaiSC(data.pailistList);
        }else{
            arr = this.initpai(data.pailistList);
        }

        var z= this.addPaiNode.width/(-2)+30;
        for(var i=0; i<arr.length; ++i){
            if(isSCMJ){
                if(arr[i].cardType == cardTypeSC.HUPAI){
                    huArr.push(arr[i]);
                }else{
                    arr[i].x = z;
                    arr[i].y = -5;
                    z = z+arr[i].myW;
                    arr[i].parent = this.addPaiNode;
                }
            }else{
                arr[i].y = -5;
                if(arr[i].cardtype == cardType.BUHUA){
                    arr[i].x = this.addPaiNode_sub.width/(-2)+30;
                    arr[i].parent = this.addPaiNode_sub;
                }else{
                    arr[i].x = z;
                    z = z+arr[i].myW;
                    arr[i].parent = this.addPaiNode;
                }
            }
        }

        if(isSCMJ){
            z= this.addPaiNode.width/(-2)+30;

            for(var i=0; i<huArr.length; ++i){
                huArr[i].x = z;
                huArr[i].y = -5;
                z = z+huArr[i].myW + 10;
                huArr[i].parent = this.addPaiNode_sub;
            }
        }

        if(this.extraLabel){
            if(data.hasOwnProperty('zhafen') && (RoomMgr.Instance().isFuXinMJ())){
                this.extraLabel.string = '扎分'+(data.zhafen > 0 ? '+' : '') + cc.dd.Utils.getNumToWordTransform( data.zhafen );
                // this.extraLabel.node.setColor(data.zhafen<0?FengColor.FU_FENG:FengColor.ZHENG_FENG);
                this.extraLabel.node.active = true;
                // cc.find('huFen', this.extraLabel.node).getComponent(cc.Label).string = '扎分:';
            }else if(data.hasOwnProperty('yupaifen') && (RoomMgr.Instance().isSuiHuaMJ())) {
                this.extraLabel.string = '鱼牌'+(data.yupaifen > 0 ? '+' : '') + cc.dd.Utils.getNumToWordTransform( data.yupaifen );
                // this.extraLabel.node.setColor(data.yupaifen<0?FengColor.FU_FENG:FengColor.ZHENG_FENG);
                this.extraLabel.node.active = RoomMgr.Instance()._Rule.ismoyu;
                // cc.find('huFen', this.extraLabel.node).getComponent(cc.Label).string = '鱼牌:';
            }else if(data.hasOwnProperty('xuehunfen') && (RoomMgr.Instance().isJinZhouMJ())) {
                this.extraLabel.string = '血混' + (data.xuehunfen > 0 ? '+' : '') + cc.dd.Utils.getNumToWordTransform(data.xuehunfen);
                // this.extraLabel.node.setColor(data.xuehunfen < 0 ? FengColor.FU_FENG : FengColor.ZHENG_FENG);
                this.extraLabel.node.active = true;
                // cc.find('huFen', this.extraLabel.node).getComponent(cc.Label).string = '血混:';
            }else if(data.hasOwnProperty('paofen') && (RoomMgr.Instance().isTuiDaoHuMJ())){
                this.extraLabel.string = '跑分'+(data.paofen > 0 ? '+' : '') + cc.dd.Utils.getNumToWordTransform( data.paofen );
                // this.extraLabel.node.setColor(data.zhafen<0?FengColor.FU_FENG:FengColor.ZHENG_FENG);
                this.extraLabel.node.active = true;
                // cc.find('huFen', this.extraLabel.node).getComponent(cc.Label).string = '扎分:';
            }else{
                this.extraLabel.node.active = false;
            }
        }

        if(this.extraLabel2){
            if(data.hasOwnProperty('genzysfen') && (RoomMgr.Instance().isFuXinMJ())){
                this.extraLabel2.string = '跟庄'+(data.genzysfen > 0 ? '+' : '') + cc.dd.Utils.getNumToWordTransform( data.genzysfen );
                // this.extraLabel2.node.setColor(data.genzysfen<0?FengColor.FU_FENG:FengColor.ZHENG_FENG);
                this.extraLabel2.node.active = true;
                // cc.find('huFen', this.extraLabel2.node).getComponent(cc.Label).string = '跟庄:';
            }else{
                this.extraLabel2.node.active = false;
            }
        }
    },

    /**
     * 初始化牌
     */
    initpai:function (cardList) {
        let getSamePaiType = (list)=>{//和龙麻将专用,找出同类型的牌进行排序
            for(let i = 0; i < list.length; i++){
                for(let j = i+1; j < list.length; j++){
                    if(Math.floor(list[i]/4)==Math.floor(list[j]/4)){
                        return [list[i], list[j]];
                    }
                }
            }
            return null;
        }

        let func = (list)=>{
            let idList = getSamePaiType(list);
            if(idList){
                let topIDIndex = list.indexOf(idList[0]);
                list.splice(topIDIndex, 1);
                let bottomIDIndex = list.indexOf(idList[1]);
                list.splice(bottomIDIndex, 1);
                list.splice(1, 0, idList[0]);
                list.splice(3, 0, idList[1]);
            }
        }

        var arr=[];

        let lzb = [];
        let tuidao = [];
        for(var i=0; cardList&&i<cardList.length; ++i) {
            var info = cardList[i];
            if(info.cardtype == cardType.LZB){
                lzb = info.cardinfo.cardindexList.slice();
            }else if(info.cardtype == cardType.DUIDAO){
                tuidao = info.cardinfo.cardindexList.slice();
            }
        }

        for(var i=0; cardList&&i<cardList.length; ++i){
            var info = cardList[i];
            if(!info.cardinfo.cardindexList.length || info.cardtype == cardType.DUIDAO)
            {
                continue;
            }
            if(info.cardtype == cardType.SHOUPAI){
                for(let k = 0; k < lzb.length; k++){
                    let idx = info.cardinfo.cardindexList.indexOf(lzb[k]);
                    if(idx != -1){
                        info.cardinfo.cardindexList.splice(idx, 1);
                    }
                }
            }
            if(info.cardtype != cardType.CHI && info.cardtype != cardType.SHOUPAI && info.cardinfo.cardindexList.length > 3)
            {
                var tmp_cardindexList = [];
                for(var id = 0; id < info.cardinfo.cardindexList.length; ++id){
                    if(Math.floor(info.cardinfo.cardindexList[id]/4)==paiType.S1){
                        tmp_cardindexList.push(info.cardinfo.cardindexList[id]);
                        info.cardinfo.cardindexList.splice(id, 1);
                        id--;
                    }
                }

                info.cardinfo.cardindexList.sort(function (a, b) {
                    return a - b;
                });//排序数据吃牌除外
                info.cardinfo.cardindexList = tmp_cardindexList.concat(info.cardinfo.cardindexList);
            }else if(info.cardtype != cardType.CHI){
                var getType = function (id) {
                    if(id>=72&&id<=107){
                        return 5;   //万
                    }else if(id>=36&&id<=71){
                        return 4;   //条
                    }else if(id>=0&&id<=35){
                        return 3;   //饼
                    }else if(id>=120&&id<=135){
                        return 2;   //东南西北
                    }else if(id>=108&&id<=119){
                        return 1;   //中发白
                    }
                };
                info.cardinfo.cardindexList.sort(function (a, b) {
                    var type_a = getType(a);
                    var type_b = getType(b);
                    if(type_a == type_b){
                        return a-b;
                    }else{
                        return type_b - type_a;
                    }
                });
                //排序数据吃牌除外
            }

            var isquChong = info.cardinfo.cardindexList.length>3 &&
                            info.cardtype == cardType.GANG &&
                            info.cardinfo.type!=teshuType.MING_GANG &&
                            info.cardinfo.type!=teshuType.AN_GANG;//只有杠才去重复
            if(isquChong){
                var t = this.isAllXiangtong(info.cardinfo.cardindexList);
                isquChong = !t;
            }

            if(RoomMgr.Instance().isHeLongMJ()){
                if(info.cardtype == cardType.GANG && info.cardinfo.type == teshuType.AN_GANG){
                    info.cardinfo.type = this.checkSpecialGang(info.cardinfo.cardindexList)
                }


                if(info.cardtype == cardType.GANG && info.cardinfo.type==teshuType.MING_GANG){
                    func(info.cardinfo.cardindexList)
                }
            }
            //暗杠明杠
            var isgang = info.cardinfo.type==teshuType.AN_GANG||info.cardinfo.type==teshuType.MING_GANG;
            if(RoomMgr.Instance().isUseNeiMengMJConfig()){
                if(info.cardtype == cardType.GANG){
                    isgang = true;
                }
            }
            //todo teshuType.NORMAL
            var list = this.tongjipai(info.cardinfo.cardindexList, isquChong, isgang);//统计数据
            if(isquChong){
                //修改因小鸡引起的杠牌显示
                this.checkGang(list);
                this.xiaojiFeidan(list);//寻找有没有小鸡飞蛋
            }

            var node = this.createPai(list, tuidao);
            if(info.cardtype == cardType.GANG && info.cardinfo.type==teshuType.AN_GANG){
                //暗杠牌
                if(!RoomMgr.Instance().isHeLongMJ()){
                    this.setShowPaiBei(node.cardArr[0], true);
                    this.setShowPaiBei(node.cardArr[1], true);
                    this.setShowPaiBei(node.cardArr[2], true);
                }
            }
            if(info.cardtype == cardType.CHI && info.cardinfo.type==teshuType.ZFB_CHI){
                this.setShowPaiBei(node.cardArr[1], true);
            }
            if(info.cardtype == cardType.LZB){
                node.cardArr.forEach((pai)=>{
                    this.addLiangZhangBao(pai)
                })
            }
            if(info.cardtype == cardType.BUHUA){
                node.cardArr.forEach((pai, idx)=>{
                    pai.x = idx*63.5;
                })
                node.myW = node.cardArr.length*63.5 + 10;
                node.cardtype = cardType.BUHUA;
            }
            arr.push(node);
        }
        return arr;
    },

    /**
     * 初始化牌
     */
    initpaiSC:function (cardList) {

        var arr=[];
        for(var i=0; cardList&&i<cardList.length; ++i){
            var info = cardList[i];
            if(!info.cardinfo.cardindexList.length)
            {
                continue;
            }
            if(info.cardtype != cardTypeSC.SHOUPAI && info.cardinfo.cardindexList.length > 3)
            {
                var tmp_cardindexList = [];
                for(var id = 0; id < info.cardinfo.cardindexList.length; ++id){
                    if(Math.floor(info.cardinfo.cardindexList[id]/4)==paiType.S1){
                        tmp_cardindexList.push(info.cardinfo.cardindexList[id]);
                        info.cardinfo.cardindexList.splice(id, 1);
                        id--;
                    }
                }

                info.cardinfo.cardindexList.sort(function (a, b) {
                    return a - b;
                });//排序数据吃牌除外
                info.cardinfo.cardindexList = tmp_cardindexList.concat(info.cardinfo.cardindexList);
            }else{
                var getType = function (id) {
                    if(id>=72&&id<=107){
                        return 5;   //万
                    }else if(id>=36&&id<=71){
                        return 4;   //条
                    }else if(id>=0&&id<=35){
                        return 3;   //饼
                    }else if(id>=120&&id<=135){
                        return 2;   //东南西北
                    }else if(id>=108&&id<=119){
                        return 1;   //中发白
                    }
                };
                info.cardinfo.cardindexList.sort(function (a, b) {
                    var type_a = getType(a);
                    var type_b = getType(b);
                    if(type_a == type_b){
                        return a-b;
                    }else{
                        return type_b - type_a;
                    }
                });
                //排序数据吃牌除外
            }

            var isquChong = info.cardinfo.cardindexList.length>3 && info.cardtype == cardTypeSC.GANG;
            if(isquChong){
                var t = this.isAllXiangtong(info.cardinfo.cardindexList);
                isquChong = !t;
            }

            //暗杠明杠
            var isgang = info.cardtype == cardTypeSC.GANG;
            var list = this.tongjipai(info.cardinfo.cardindexList, isquChong, isgang);//统计数据

            var node = this.createPai(list, info.cardtype);
            node.cardType = info.cardtype;
            arr.push(node);
        }
        return arr;
    },

    /**
     * 创建牌组
     * @param list pai
     */
    createPai:function (list, tuidao) {
        var Node = new cc.Node("card");
        var arr = [];

        let huList = {};
        let isSCMJ = RoomMgr.Instance().isXueZhanMJ() || RoomMgr.Instance().isXueLiuMJ();


        for(var i=0; list&&i<list.length; ++i){
           var card ;

           if(isSCMJ){
               let desc = pai3d_value.desc[list[i].id].split('[')[0];

               if(tuidao == cardTypeSC.HUPAI){
                   if(huList.hasOwnProperty(desc)){
                       huList[desc].count++;
                       huList[desc].label.active = true;
                       huList[desc].label.getComponentInChildren(cc.Label).string = huList[desc].count;
                       continue;
                   }else{
                       huList[desc] = {
                           defaultId : list[i].id,
                           count : 1,
                           label : null,
                       };
                   }
               }
           }

            card =  this.createShowPai(list[i].id);
            card.zhangshuBei.active = false;
            card.gangpai.active = false;
            card.valuegang.active = false;
            if(list[i].cnt>1) {
                card.zhangshuBei.active = true;
                card.zhangshuBei.getComponent(cc.Sprite).spriteFrame = this.zhangshu[list[i].cnt - 2];
            }
            if(list[i].gang){
                card.gangpai.active = true;
                card.valuegang.active = true;
            }
            card.parent = Node;
            card.x = i*43.5;

            if(RoomMgr.Instance().isJinZhouMJ()){
                var DeskData = require('jzmj_desk_data').DeskData;
                if(DeskData.Instance().isHunPai(list[i].id)){
                    this.addHunPai(card)
                }
            }
            if(RoomMgr.Instance().isWuDanMJ()){
                var DeskData = require('wdmj_desk_data').DeskData;
                if(DeskData.Instance().isHunPai(list[i].id)){
                    this.addHunPai(card)
                }
            }
            if(RoomMgr.Instance().isSuiHuaMJ()){
                if(tuidao.indexOf(list[i].id) != -1){
                    this.addTuidao(card);
                }
            }
            if(isSCMJ){
                if(tuidao == cardType.HUPAI) {
                    let label = cc.instantiate(this.huLabel);
                    card.addChild(label);
                    label.x = 25.8;
                    label.y = 20.1;
                    label.active = false;
                    huList[desc].label = label;
                }
            }
            arr.push(card);

        }
        Node.myW = list.length*43.5 + 10;
        Node.cardArr = arr;
        return Node;
    },
    /**
     *  创建牌
     */
    createShowPai:function (cardId) {
        var res_pai = cc.find('Canvas/mj_res_pai');
        if(!res_pai){
            return;
        }

        var valueRes = res_pai.getComponent('mj_res_pai').majiangpai_new;
        //创建背景
        var cardNode = new cc.Node("card");

        var bg = new cc.Node("card");
        var sprite = bg.addComponent(cc.Sprite);
        sprite.spriteFrame =  this.paiNode[0];
        sprite.node.setScale(0.7);
        bg.parent = cardNode;
        cardNode.zbg = bg;

        //值
        var valueNode = new cc.Node("card_value");
        var spritev = valueNode.addComponent(cc.Sprite);
        spritev.spriteFrame =  valueRes.getSpriteFrame(pai3d_value.spriteFrame["_"+cardId]);
        valueNode.scaleX = 0.5; valueNode.scaleY = 0.45;
        valueNode.y=9;
        valueNode.parent = cardNode;
        cardNode.valueNode = valueNode;

        //张数图片节点
        var zhangshuNode = new cc.Node("zhang_bei");
        var spritez = zhangshuNode.addComponent(cc.Sprite);
        spritez.node.setScale(0.7);
        zhangshuNode.x=-1;
        zhangshuNode.y = -30;
        zhangshuNode.parent = cardNode;
        cardNode.zhangshuBei = zhangshuNode;

        //背面背景
        var cardBeiNode = new cc.Node("card_bei");
        cardBeiNode.active = false;
        var spritebei = cardBeiNode.addComponent(cc.Sprite);
        spritebei.spriteFrame =  this.paiNode[1];
        spritebei.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        spritebei.node.setContentSize(64, 93);
        spritebei.node.setScale(0.7);
        cardBeiNode.parent = cardNode;
        cardNode.beimian = cardBeiNode;

        //设置明杠暗杠
        var gangpai = new cc.Node("gang_pai");
        var spritez = gangpai.addComponent(cc.Sprite);
        spritez.spriteFrame =  this.paiNode[0];
        spritez.node.setScale(0.7);
        gangpai.y = 14;
        gangpai.parent = cardNode;
        cardNode.gangpai = gangpai;

        //设置明杠暗杠值
        var valuegang = new cc.Node("value_gang");
        var spritegangv = valuegang.addComponent(cc.Sprite);
        spritegangv.spriteFrame = valueRes.getSpriteFrame(pai3d_value.spriteFrame["_"+cardId]);
        valuegang.scaleX = 0.5;
        valuegang.scaleY = 0.45;
        valuegang.y=22.5;
        valuegang.parent = cardNode;
        cardNode.valuegang = valuegang;


        return cardNode;
    },
    /**
     * 设置牌背面
     */
    setShowPaiBei:function (card, isHow) {
        card.zbg.active = !isHow;
        card.valueNode.active = !isHow;
        card.beimian.active = isHow;
    },

    /**
     * 检测牌组中的所有牌是不是小鸡
     */
    isAllXiangtong:function (list, type) {
        if(list && list.length>0){
            var arr= [];
            for(var i in list){
                arr.push(gang_pai_List.getCardType(list[i]));
            }
            type = type || arr[0];
            for(var i in arr){
                if(type != arr[i]){
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    /**
     *  检测因小鸡引起的杠牌 显示出错 ag: 小鸡 小鸡  西  西
     */
    checkGang:function (cardList) {
        if(cardList && cardList.length<3){
            for(var i in cardList){
                if(gang_pai_List.CardType.S1 == gang_pai_List.getCardType(cardList[i].id)){
                    cardList[i].cnt--;//剪掉一个

                    var cardInfo = {};
                    cardInfo.id = cardList[i].id;
                    cardInfo.cnt = 1;
                    cardList.push(cardInfo);
                    cardList.sort(function (a, b) {
                        return a.id -b.id;
                    });
                    break;
                }
            }
        }
    },
    /**
     * 统计牌数
     */
    tongjipai:function (list, isqu, isgang) {
        var pushArr=function (arr, cardID) {
            for(var i=0; isqu && i<arr.length; ++i){
                if(Math.floor(arr[i].id/4) == Math.floor(cardID/4)){
                    arr[i].cnt += 1;
                    return ;
                }
            }
            var cardInfo = {};
            cardInfo.id = cardID;
            cardInfo.cnt = 1;
            arr.push(cardInfo);
        };
        var arr = [];
        var leng = isgang?list.length-1:list.length;
        for(var i=0; list&&i<leng; ++i){
            pushArr(arr, list[i]);
        }
        if(isgang)
        {
            arr[1].gang = true;
        }
        return arr;
    },
    /**
     * 分离小鸡飞蛋
     * @param list 传入统计过的数据
     * @return  [] //返回小鸡的数据
     */
    xiaojiFeidan:function (cardList) {
        if(!cardList || cardList.length<2){
            return;
        }
        cc.log('xiaojiFeidan-------');
        cc.log(cardList);
        const Fg = [gang_pai_List.CardType.DONG, gang_pai_List.CardType.NAN, gang_pai_List.CardType.XI, gang_pai_List.CardType.BEI];
        const Xg = [gang_pai_List.CardType.ZHONG, gang_pai_List.CardType.FA, gang_pai_List.CardType.BAI]
       if(Fg.indexOf(gang_pai_List.getCardType(cardList[1].id))!=-1 && cardList.length<=4){
            return null;
       }
       if(Xg.indexOf(gang_pai_List.getCardType(cardList[1].id))!=-1 && cardList.length<=3){
            return null;
       }

        var xiaojiCount = 0;
        var arr1 = [];
        var arr2 = [];
        for(var i=0; i<cardList.length; ++i){
            //if(gang_pai_List.CardType.S1 == gang_pai_List.getCardType(cardList[i].id)){
                //找到小鸡
                //xiaojiCount = cardList[i].cnt;
            //}else {
                arr1.push(gang_pai_List.getCardType(cardList[i].id));
                arr2.push(cardList[i]);
           // }
        }
        var isgang = gang_pai_List.findGang(false, true, arr1);
        if(isgang && xiaojiCount){//说明是小鸡飞蛋
            cardList.splice(0);
            for(var i=0; arr2&&i<arr2.length; ++i){
                cardList.push(arr2[i]);
            }
            //小鸡杠末尾需要显示出来
            cardList.push({id:36,cnt:xiaojiCount});
            return xiaojiCount;
        }
        return null;
    },

    /**
     * 胡牌 类型
     */
    gethupaiStr:function (hupaiList) {
        var str ='';

        let hupaiType = jlmj_str.hupaiType;
        if(RoomMgr.Instance().isJinZhouMJ() || RoomMgr.Instance().isHeiShanMJ() || RoomMgr.Instance().isTuiDaoHuMJ() || RoomMgr.Instance().isChiFengMJ() || RoomMgr.Instance().isAoHanMJ() || RoomMgr.Instance().isWuDanMJ() || RoomMgr.Instance().isPingZhuangMJ() || RoomMgr.Instance().isHeLongMJ()) {
            hupaiType = jlmj_str.hupaiJinZhouType;
        }else if(RoomMgr.Instance().isSuiHuaMJ() || RoomMgr.Instance().isFangZhengMJ() || RoomMgr.Instance().isAChengMJ()){
            hupaiType = jlmj_str.hupaiSuiHuaType;
        }else if(RoomMgr.Instance().isBaiChengMJ()) {
            hupaiType = jlmj_str.hupaiBaiChengType;
        }

        let siguiyi = 0, dageda = 0;//黑山麻将四归一、大哥大

        if(RoomMgr.Instance().isAChengMJ()){//阿城麻将开牌炸只显示开牌炸
            if(hupaiList.indexOf(22) != -1){
                return '开牌炸 ';
            }
        }

        if(RoomMgr.Instance().isFangZhengMJ()){
            if(hupaiList.indexOf(23) != -1 && hupaiList.indexOf(6) != -1){
                let guadafeng = hupaiList.indexOf(23);
                hupaiList.splice(guadafeng, 1);
                let shebao = hupaiList.indexOf(6);
                hupaiList.splice(shebao, 1);
                str += '射大风 ';
            }
        }

        if(RoomMgr.Instance().isHeLongMJ()){
            if(hupaiList.indexOf(14) != -1 && hupaiList.indexOf(31) != -1){
                let hunyise = hupaiList.indexOf(31);
                hupaiList.splice(hunyise, 1);
            }
        }

        for(var i=0; hupaiList&&i<hupaiList.length; ++i){
            if(RoomMgr.Instance().isHeiShanMJ()){
                if(hupaiList[i] == 10){//黑山有七对只展示七对
                    return hupaiType[hupaiList[i]];
                }
            }

            if(RoomMgr.Instance().isJinZhouMJ() || RoomMgr.Instance().isHeiShanMJ()) {
                if (hupaiList[i] == -1) {
                    str += '三清 ';
                    continue;
                }
                if (hupaiList[i] == -2) {
                    str += '四清 ';
                    continue;
                }
            }

            if(RoomMgr.Instance().isHeiShanMJ()){
                if(hupaiList[i] == 27){
                    siguiyi++;
                    continue;
                }

                if(hupaiList[i] == 28){
                    dageda++;
                    continue;
                }
            }

            if(hupaiList[i] != 2){
                if(RoomMgr.Instance().isFangZhengMJ()){
                    if(hupaiList[i] == 6) {
                        str += '射宝 ';
                    }else if(hupaiList[i] == 24){
                        str += '亮掌 ';
                    }else if(hupaiList[i] == 7){
                        str += '对对胡 ';
                    }else{
                        str += hupaiType[hupaiList[i]] + ' ';
                    }
                }else if(RoomMgr.Instance().isAChengMJ()) {
                    if (hupaiList[i] == 3 || hupaiList[i] == 4) {//阿城麻将摸宝、对宝、刮大风、红中满天飞不显示自摸、夹胡
                        if (hupaiList.indexOf(5) != -1 || hupaiList.indexOf(6) != -1 || hupaiList.indexOf(23) != -1 || hupaiList.indexOf(26) != -1) {
                            continue;
                        }
                    }

                    if (hupaiList[i] == 6) {
                        str += '对宝 ';
                    } else if (hupaiList[i] == 21) {
                        str += '摸宝 ';
                    } else if (hupaiList[i] == 8) {
                        continue;
                    } else {
                        str += hupaiType[hupaiList[i]] + ' ';
                    }
                }else if(RoomMgr.Instance().isHeLongMJ()) {
                    str += hupaiType[hupaiList[i]].replace('平胡', '屁胡').replace('夹胡', '屁胡').replace('边胡', '屁胡').replace('站立', '扣听').replace('清摸', '纯清风') + ' ';
                }else if(RoomMgr.Instance().isJiSuMJ()){
                    str += hupaiType[hupaiList[i]].replace('飘胡', '碰碰胡') + ' ';
                }else{
                    str += hupaiType[hupaiList[i]] + ' ';
                }
            }
            if(hupaiList[i] == 10){
                str = str.replace(hupaiType[9], "");
            }

        }
        if(RoomMgr.Instance().isHeiShanMJ()) {
            if (siguiyi > 0) {
                str += hupaiType[27] + 'x' + siguiyi + ' ';
            }
            if (dageda > 0) {
                str += hupaiType[28] + 'x' + dageda + ' ';
            }
        }
        if(RoomMgr.Instance().isFuXinMJ()){
            if(str.length == 0 || str == '庄 '){
                str += jlmj_str.hupaiType[2];
            }
        }
        return str + ' ';
    },
    /**
     * 获取玩家head
     */
    getUserHeadForID:function (userId) {
        var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        if(play_list) {
            var headinfo = play_list.getUserHeadNode(userId);
            if(headinfo){
                return  headinfo.head.getHeadSp();
            }
        }
        return null;
    },

    addHunPai:function (cardNode) {
        var gangpai = new cc.Node("hun_pai");
        var spritez = gangpai.addComponent(cc.Sprite);
        spritez.spriteFrame =  this.paiNode[3];
        gangpai.scaleX = 0.7;
        gangpai.scaleY = 0.7;
        gangpai.x = 3.8;
        gangpai.y = 16.6;
        gangpai.parent = cardNode;
    },

    addLiangZhangBao:function (cardNode) {
        var gangpai = new cc.Node("liang_zhang_bao");
        var spritez = gangpai.addComponent(cc.Sprite);
        spritez.spriteFrame =  this.paiNode[2];
        gangpai.scaleX = 0.5  / 0.7;
        gangpai.scaleY = 0.45 / 0.7;
        gangpai.x = 64 * 0.7 / 74 * 20.07;
        gangpai.y = 93 * 0.7 / 105 * 37.47;
        gangpai.parent = cardNode;
    },

    addTuidao:function (cardNode) {
        var gangpai = new cc.Node("tuidao");
        var spritez = gangpai.addComponent(cc.Sprite);
        spritez.spriteFrame =  this.paiNode[4];
        gangpai.scaleX = 0.7;
        gangpai.scaleY = 0.7;
        gangpai.x = 3.8;
        gangpai.y = 16.6;
        gangpai.parent = cardNode;
    },

    gethupaiStrSC(hutypeList, gen){
        let _hutypeList = hutypeList.slice();

        let str = "";
        let isEighteen = false;//十八罗汉
        let qEighteen = false;//清十八罗汉
        let qingqidui = false;//清七对
        let qinglongqidui = false;//清龙七对
        let qingdui = false;//清对

        if(_hutypeList.indexOf(7) != -1 && (_hutypeList.indexOf(15) != -1 || _hutypeList.indexOf(22) != -1) && gen >= 4){
            isEighteen = true;
            let duiduihuIdx = _hutypeList.indexOf(7);
            _hutypeList.splice(duiduihuIdx, 1);
            if(_hutypeList.indexOf(15) != -1){
                let jingoudiaoIdx = _hutypeList.indexOf(15);
                _hutypeList.splice(jingoudiaoIdx, 1);
            }
            if(_hutypeList.indexOf(22) != -1){
                let jingoudiaoIdx = _hutypeList.indexOf(22);
                _hutypeList.splice(jingoudiaoIdx, 1);
            }
            if(_hutypeList.indexOf(14) != -1){
                let qingyiseIdx = _hutypeList.indexOf(14);
                _hutypeList.splice(qingyiseIdx, 1);
                qEighteen = true;
            }
        }else if(_hutypeList.indexOf(10) != -1 && _hutypeList.indexOf(14) != -1){
            qingqidui = true;
            let qidui = _hutypeList.indexOf(10);
            _hutypeList.splice(qidui, 1);
            let qingyise = _hutypeList.indexOf(14);
            _hutypeList.splice(qingyise, 1);
        }else if((_hutypeList.indexOf(11) != -1 || _hutypeList.indexOf(12) != -1 || _hutypeList.indexOf(13) != -1) && _hutypeList.indexOf(14) != -1){
            qinglongqidui = true;
            if(_hutypeList.indexOf(11) != -1){
                let qidui = _hutypeList.indexOf(11);
                _hutypeList.splice(qidui, 1);
            }
            if(_hutypeList.indexOf(12) != -1){
                let qidui = _hutypeList.indexOf(12);
                _hutypeList.splice(qidui, 1);
            }
            if(_hutypeList.indexOf(13) != -1){
                let qidui = _hutypeList.indexOf(13);
                _hutypeList.splice(qidui, 1);
            }
            let qingyise = _hutypeList.indexOf(14);
            _hutypeList.splice(qingyise, 1);
        }else if(_hutypeList.indexOf(7) != -1 && _hutypeList.indexOf(14) != -1){
            qingdui = true;
            let duiduihu = _hutypeList.indexOf(7);
            _hutypeList.splice(duiduihu, 1);
            let qingyise = _hutypeList.indexOf(14);
            _hutypeList.splice(qingyise, 1);
        }

        if(qEighteen){
            str += "清十八罗汉"
        }else if(isEighteen){
            str += "十八罗汉"
        }else if(qinglongqidui){
            str += "清龙七对";
        }else if(qingqidui){
            str += "清七对";
        }else if(qingdui){
            str += "清对";
        }

        if(_hutypeList.length > 0){
            str += " ";
        }

        if(_hutypeList.indexOf(7) != -1 && _hutypeList.indexOf(25) != -1){//对对胡和将对不同时出现
            let duiduihu = _hutypeList.indexOf(7);
            _hutypeList.splice(duiduihu, 1);
        }

        for(let i = 0; i < _hutypeList.length; i++){
            if(_hutypeList[i] != 2){
                str += HuTypeDesc[_hutypeList[i]];
                if(i != _hutypeList.length - 1){
                    str += " ";
                }
            }
        }

        let end = gen > 0 && !qEighteen && !isEighteen ? " " + gen + "根 " : " ";
        return str + end;
    },

    //暗杠转毛毛蛋杠、旋风杠、三剑客杠
    checkSpecialGang(list){
        if(!list || list.length == 0){
            return teshuType.AN_GANG;
        }
        let paiType = {
            wan:0,
            tiao:0,
            tong:0,
            zhong:0,
            fa:0,
            bai:0,
            dong:0,
            nan:0,
            xi:0,
            bei:0
        }
        for(let i = 0; i < list.length; i++){
            switch(Math.floor(list[i]/4)){
                case 0:
                    paiType.tong++;
                    break;
                case 9:
                    paiType.tiao++;
                    break;
                case 18:
                    paiType.wan++;
                    break;
                case 27:
                    paiType.zhong++;
                    break;
                case 28:
                    paiType.fa++;
                    break;
                case 29:
                    paiType.bai++;
                    break;
                case 30:
                    paiType.dong++;
                    break;
                case 31:
                    paiType.nan++;
                    break;
                case 32:
                    paiType.xi++;
                    break;
                case 33:
                    paiType.bei++;
                    break;
            }
        }

        if(paiType.wan == 2 || paiType.tiao == 2 || paiType.tong == 2){
            return teshuType.MING_GANG;
        }else if(paiType.zhong == 2 || paiType.fa == 2 || paiType.bai == 2){
            return teshuType.MING_GANG;
        }else if(paiType.dong == 1 && paiType.nan == 1 && paiType.xi == 1 && paiType.bei == 1){
            return teshuType.NORMAL;
        }else{
            return teshuType.AN_GANG;
        }
    },

});

module.exports = {
    cardType:cardType,
    teshuType:teshuType,
    jlmj_jiesuan:jlmj_jiesuan,

} ;