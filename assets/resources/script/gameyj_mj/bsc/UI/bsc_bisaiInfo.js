const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_sendMsg = require('bsc_sendMsg');
const Bsc_str = require('bsc_strConfig');
const daojuStr = require('HallPropCfg');

cc.Class({
    extends: cc.Component,

    properties: {
        btnList:[cc.Node],//上面的btn
        infoList:[cc.Node],

        baomingBtn:cc.Button,//报名按钮
        tuisaiBtn:cc.Button,//退赛按钮

        /**概况*/
        infoTTFList:[cc.Label],
        /**奖励*/
        jlContentNode: cc.Node,
        _itemList: [],
        /**规则*/
        gzContentNode: cc.Node,
        strTTF:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.btnCallBack(null, '0');
        Bsc_ED.addObserver(this);
    },
    onDestroy: function () {
        clearInterval(this._IntervalID) ;
        Bsc_ED.removeObserver(this);
    },
    /**
     * 设置数据
     * @param data
     * @param num  //当前人数
     * @param guizeStr //规则文字
     */
    setData:function (data, num, guizeStr) {
        this._data = data;
        this._setBaoMingBtn(data.isSign);
        this.initGaiKuang(data, num);
        var arr = this.jiangliList(data.rewardListList);
        this.initJiangLi(arr, this._itemList, this.jlContentNode );
        this.initGuiZe(guizeStr);
        //开始刷新人数
        this._IntervalID = setInterval(function () {
            Bsc_sendMsg.getBaomingNum(this._data.matchId);
        }.bind(this), 2500);
    },

    btnCallBack:function (event, data) {
        for(var i in this.btnList){
            if(data==i){
                this.btnList[i].getChildByName('touch').active = true;
            }else {
                this.btnList[i].getChildByName('touch').active = false;
            }
        }
        for(var i in this.infoList){
            if(data==i){
                this.infoList[i].active = true;
            }else {
                this.infoList[i].active = false;
            }
        }
    }
    ,

    /**
     * 显示概况
     */
    initGaiKuang:function (data, num) {
        this.infoTTFList[0].string = data.name || 'XXXX';//名字
        this.infoTTFList[1].string = data.opentime || 'XXXX';//开放时间
        this.infoTTFList[2].string = Bsc_str.tiaojian.format([data.opensignnum]);//开放条件

        var signFee = data.signFee;
        if( signFee == undefined ) {
            signFee = 0;
        }
        this.infoTTFList[3].string = signFee+daojuStr.getNameById(1002);//报名费用
        this.infoTTFList[4].string = '吉林麻将';
        this.infoTTFList[5].string = num+'/'+data.opensignnum;//人数

        this.infoTTFList[6].string = Bsc_str.zongrenshu.format([0]);//总人数
    },

    /**
     * 显示规则
     */
    initGuiZe:function (str) {
        this.strTTF.string = str;
        this.gzContentNode.height = this.strTTF.node.height+30;
    },
    /**
     * 显示奖励
     */
    initJiangLi:function (data, itemList, parent) {
        cc.resources.load('gameyj_mj/bsc/prefabs/bsc_bisaiInfo_jiangli_item', cc.Prefab, function (err, prefab) {
            for(var i=0; i<data.length; ++i){
                var itemData = data[i];
                if(itemData){
                    var item = cc.instantiate(prefab);
                    itemList.push(item);
                    item.parent = parent;

                    var cnt = itemList.length;
                    var y = (cnt-0.5)*item.height;
                    item.y = -y;
                    parent.height = cnt*item.height;
                    item.getComponent('bsc_bisai_jiangli_item').setData(itemData);
                }
            }
        }.bind(this));
    },
    /**
     * 处理奖励列表
     */
    jiangliList:function (data) {
        var arr =[];
        if(data){
            var num=0;
            for(var i in data){
                var item = data[i];
                for(var k=0; k<=item.rankTo-item.rankFrom; ++k,++num){
                    var str='';
                    str += Bsc_str.jiangli[num] + ': ';//名次
                    str += item.num + daojuStr.getNameById(item.itemId);
                    arr.push({num: num, info:str});
                }
            }
        }
        return arr;
    },
    /**
     * 报名回调
     */
    bmBtnCallBack:function () {
        Bsc_sendMsg.baoming(this._data.matchId);
    },
    /**
     * 退赛回调
     */
    tsBtnCallBack:function () {
        Bsc_sendMsg.tuiSai();
    },

    /**
     * 关闭回调
     */
    closeBtnCallBack:function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    /**
     *设置成功或者没有成功的报名按钮
     */
    _setBaoMingBtn:function (isBaoming) {
        this.baomingBtn.node.active =  !isBaoming;
        this.tuisaiBtn.node.active = isBaoming
    },

    onEventMessage:function (event,data) {
        switch (event) {
            case Bsc_Event.BSC_BAO_MING:
                if(data == this._data.matchId){
                    this._setBaoMingBtn(true);
                }
                break;
            case Bsc_Event.BSC_TUI_SAI:
                if(data == this._data.matchId){
                    this._setBaoMingBtn(false);
                }
                break;
            case Bsc_Event.BSC_CHANG_NUM:
                this.infoTTFList[5].string = data+'/'+this._data.opensignnum;//人数
                this.infoTTFList[6].string = Bsc_str.zongrenshu.format([0+(data*3+10)]);//总人数
                break;
        }
    },

});
