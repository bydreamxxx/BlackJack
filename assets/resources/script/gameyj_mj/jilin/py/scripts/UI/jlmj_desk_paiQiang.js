/**
 * 牌墙 负责管理桌面上没有被摸的牌
 * 当有玩家申请摸牌时 负责分发动作
 */
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;

cc.Class({
    extends: cc.Component,

    properties: {
        CardList_d:[cc.Node],//下方的牌
        CardList_r:[cc.Node],//右边的牌
        CardList_u:[cc.Node],//上面的牌
        CardList_l:[cc.Node],//左边的牌
    },

    onLoad: function () {
        DeskED.addObserver(this);
        this._allCardArr = [this.CardList_d, this.CardList_l, this.CardList_u, this.CardList_r];
        this._endCall = null;
        this._allCardList=[];
        this._isHavebao = false;
    },
    onDestroy:function () {
        DeskED.removeObserver(this);
    },

    /**
     * 初始化牌堆
     * @param viewIdex 表示当前局从那个位置开始拿牌
     */
    initData:function (viewIdex) {
        if(!this.init){
            viewIdex = viewIdex||0;
            this.init = true;
            var newIdx = 4-viewIdex;//因为传入的是逆时针 所以要转为顺时针
            var left = this._allCardArr.slice(0, newIdx);
            var right = this._allCardArr.slice(newIdx);
            var arr = right.concat(left);
            this._allCardList.splice(0);
            for(var i=0; i<arr.length; ++i){
                for(var k=0; k<arr[i].length; k+=2){
                    var paiData = {};
                    paiData.upPai = arr[i][k];
                    paiData.downPai = arr[i][k+1];
                    paiData.upPai._idx  = i*arr[i].length+k;
                    paiData.downPai._idx  = i*arr[i].length+k+1;
                    paiData.getShowPai = function () {
                        return this.upPai.active ?  this.upPai : this.downPai.active?this.downPai:null;
                    };
                    this._allCardList.push(paiData);
                }
            }
        }
    },
    /**
     * 重置牌的显示
     */
    restPaiQiang:function () {
        this.init = false;
        this._isHavebao = false;
        this._allCardList=[];
        for(var i=0; i<this._allCardArr.length; ++i){
            for(var k=0; k<this._allCardArr[i].length; ++k){
                this._allCardArr[i][k].active = true;
            }
        }
    },
    /**
     * 获取剩余牌数
     */
    getAllPaiNum:function () {
        var num = 0;
        for(var i=0; i<this._allCardArr.length; ++i){
            for(var k=0; k<this._allCardArr[i].length; ++k){
                if(this._allCardArr[i][k].active){
                    num++;
                }
            }
        }
        if(this._isHavebao){//有宝牌时要统计
            num++;
        }
        return num;
    },
    /**
     * 申请摸牌
     * @param num  申请牌的个数
     * @param isFont 从前面摸还是后面摸牌
     * @param getPtCall 当需摸牌动画时 需要获取动画的终点位置
     * @param endCall
     */
    getPai:function (num, allNum, isFont, getPtCall,endCall) {
        num = num||1;
        cc.log('剩余牌数:',this.getAllPaiNum(),'总牌数:',allNum+num);
        if(this.getAllPaiNum()<num+allNum){
            cc.error('[牌墙]牌数不对， 不能摸牌');
            return
        }

        this._endCall = endCall;
        var cardlist = this.getPaidata(num, isFont);
        if(!cardlist){
            cc.log('牌堆中堆牌不够摸', num,'个');
            this.onEndCall(endCall, -1);
        }else {
            this.mopaiAct(getPtCall, cardlist);
            cc.log('[牌墙]摸牌个数',num,'剩余个数',this.getAllPaiNum());
        }
    },
    /**
     * 获取牌数组
     */
    getPaidata:function (num, isFont) {
        var call = function (num, arr, paidata) {
            if(arr.length < num && paidata.upPai.active){
                arr.push(paidata.upPai);
            }
            if(arr.length < num && paidata.downPai.active){
                arr.push(paidata.downPai);
            }
            return arr.length == num;
        }

        //开始
        var arr = [];
        if(num && isFont){
            for(var i=0; i<this._allCardList.length; ++i) {
                if(call(num, arr, this._allCardList[i])){
                    break;
                }
            }
        }else if(num) {
            for(var i=this._allCardList.length-1; i>=0; --i){
                if(call(num, arr, this._allCardList[i])){
                    break;
                }
            }
        }
        return arr;
    },

    /**
     * 退宝牌
     * 如果剩余牌中有空位则认为是宝牌位置 直接恢复， 没有则放在后面
     */
    getTuiBaoPai:function () {
        var firstKong = {};
        var seconKong = {};
        var thredKong = {};
        var  tem= firstKong;
        var  k = 0;
        //从后往前找到两个空位
        for(var i=this._allCardList.length-1; i>=0; --i ) {
            if(!this._allCardList[i].upPai.active){
                tem.idx = k+1;
                tem.pai = this._allCardList[i].upPai;
            }else{
                tem = !seconKong.idx?seconKong : thredKong;//
            }
            if(!this._allCardList[i].downPai.active){
                tem.idx = k+2;
                tem.pai = this._allCardList[i].downPai;
            }else{
                tem = !seconKong.idx?seconKong : thredKong;//
            }
            k+=2;
        }
        //如果两个空位不是相邻则表示第一个位置是上一次的宝牌位置
        if(thredKong.idx-seconKong.idx!=1){
            return seconKong.pai;
        }else {
            return firstKong.pai;
        }
    },

    /**
     * 摸牌动画
     */
    mopaiAct:function (getPtCall, cardList) {
        for(var i=0; i<cardList.length; ++i){//隐藏牌墙上的牌
            cardList[i].active = false;
        }
    },
    /**
     * 获取宝牌
     */
    getBaopai:function (num) {
        var  arr=[];
        var call = function (num, arr, paidata) {
            if(arr.length < num ){
                arr.push(paidata.upPai);
            }
            if(arr.length < num){
                arr.push(paidata.downPai);
            }
            return arr.length == num;
        }
        for(var i=this._allCardList.length-1; i>=0; --i){
            if(call(num, arr, this._allCardList[i])){
                break;
            }
        }
        return arr;
    },

    /**
     * 摸宝  或则 换宝
     * @param baoIdx  宝牌位置
     * @param huanBao 换宝的位置
     */
    moHuanBaopai:function (baoIdx, huanBao) {
        if(huanBao){//有需要退到后面的牌
            var oldBaopai = this.getTuiBaoPai();
            if(oldBaopai){
                oldBaopai.active = true;
            }
        }
        //先摸宝
        var painode = this.getBaopai(baoIdx);
        if(painode.length){
            if(painode[painode.length-1]._idx%2==1){
                painode[painode.length-2].active = false;
            }else {
                painode[painode.length-1].active = false;
            }
            this._isHavebao = true
        }
    },

    /**
     * 断线重置
     */
    recvPaiqiang:function (viewIdx, remainCards, endEmpt) {
        endEmpt = endEmpt || 0; remainCards = remainCards||0;
        this.restPaiQiang();
        this.initData(viewIdx);
        var startp = 136 - remainCards - endEmpt;
        var fontarr = this.getPaidata(startp, true);//获取前面改隐藏的数组
        for(var i in fontarr){
            fontarr[i].active = false;
        }
        var endarr = this.getPaidata(endEmpt, false);//获取后面该隐藏的数组
        for(var i in endarr){
            endarr[i].active = false;
        }
    },

    /**
     * 处理消息
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        if(cc.replay_gamedata_scrolling){
            return;
        }
        if(!data || !data instanceof Array){
            return;
        }
        switch (event) {
            case DeskEvent.MO_PAI_ACT:
                this.getPai(data[0], data[1], data[2], data[3]);
                break;
            case DeskEvent.MO_HUAN_BAO_PAI:
                this.moHuanBaopai(data[0], data[1]);
                break;
            case DeskEvent.RECV_PAIQIANG:
                this.recvPaiqiang(data[0], data[1], data[2]);
                break;

        }
    },
    /**
     * 执行endCall
     */
    onEndCall:function (endCall, data) {
      if(endCall) {
          endCall(data);
      }
    },

});
