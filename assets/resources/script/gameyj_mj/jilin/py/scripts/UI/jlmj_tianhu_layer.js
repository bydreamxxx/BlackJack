
const createPai = require('jlmj_jiesuan_userInfo');
const cardType = createPai.cardType;
const teshuType = createPai.teshuType;

cc.Class({
    extends: cc.Component,

    properties: {
        headSp:cc.Sprite,//头像
        nameTTF:cc.Label,//名字
        paiAddNode:cc.Node,//添加牌的节点
    },

    // use this for initialization
    onLoad: function () {
        this.createPai = new createPai.jlmj_jiesuan();
    },
    onDestroy:function () {
        this.createPai=null;
    },
    //设置信息
    setUserInfo:function (data) {
        this.nameTTF.string = data.nick;
        this.headSp.spriteFrame = this.getUserHeadForID(data.userId);
        this.headSp.node.width = 105;
        this.headSp.node.height = 105;
        //创建手牌
        //去掉手牌中的胡牌  如果有
        this.createPai.quHupai(data, true);
        var arr = this.initpai(data.pailistList);
        var z= 0;//this.paiAddNode.width/(-2)+30;
        for(var i=0; i<arr.length; ++i){
            arr[i].x = z;arr[i].y = -15;
            z = z+arr[i].myW+15;
            arr[i].parent = this.paiAddNode;
        }
        this.paiAddNode.setScale(1.5);
        this.paiAddNode.width = z;
        this.paiAddNode.x = (z/-2)*1.3;


    },
    /**
     * 初始化牌
     */
    initpai:function (cardList) {
        var arr=[];
        for(var i=0; cardList&&i<cardList.length; ++i){
            var info = cardList[i];
            info.cardinfo.cardindexList.sort(function (a, b) {
                return a - b;
            });//排序数据
            var isquChong = info.cardinfo.cardindexList.length>3 &&
                info.cardtype == cardType.GANG &&
                info.cardinfo.type!=teshuType.MING_GANG &&
                info.cardinfo.type!=teshuType.AN_GANG;//只有杠才去重复
            var list = this.createPai.tongjipai(info.cardinfo.cardindexList, isquChong);//统计数据

            var islipai = info.cardtype==6 || info.cardtype==5;
            var node = this.createPai.createGang(list, islipai);
            if(info.cardtype == cardType.CHI && info.cardinfo.type==teshuType.ZFB_CHI){
                //中发白吃牌
                this.createPai.setShowPaiBei(node.cardArr[1], true);
            }else if(info.cardtype == cardType.GANG && info.cardinfo.type==teshuType.AN_GANG){
                //暗杠牌
                this.createPai.setShowPaiBei(node.cardArr[0], true);
                this.createPai.setShowPaiBei(node.cardArr[1], true);
                this.createPai.setShowPaiBei(node.cardArr[2], true);
            }
            arr.push(node);
        }
        return arr;
    },

    /**
     * 炫耀回调
     */
    xuanyaoCallback:function () {

    },
    /**
     * 关闭
     */
    closeCallBack:function () {
        this.node.removeFromParent();
        this.node.destroy();
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
});
