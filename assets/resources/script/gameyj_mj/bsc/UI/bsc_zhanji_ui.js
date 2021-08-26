const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_sendMsg = require('bsc_sendMsg');
const daojuStr = require('HallPropCfg');

cc.Class({
    extends: cc.Component,

    properties: {
        btnList:[cc.Node],//上面的btn
        infoList:[cc.Node],

        /**
         * 比赛记录
         */
        jlContentNode: cc.Node,
        _itemList: [],

    },

    // use this for initialization
    onLoad: function () {
        Bsc_sendMsg.getBscZhanji();//获取战绩
        Bsc_ED.addObserver(this);
    },
    onDestroy: function () {
        Bsc_ED.removeObserver(this);
    },
    /**
     * 上面按钮的回调
     * @param event
     * @param data
     */
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
    },

    /**
     * 显示奖励
     */
    initZhanji:function (data, itemList, parent) {
        cc.resources.load('gameyj_mj/bsc/prefabs/bsc_zhanji_item', cc.Prefab, function (err, prefab) {
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
                    item.getComponent('bsc_zhanji_item').setData(itemData);
                }
            }
        }.bind(this));
    },
    /**
     * 事件
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        switch (event) {
            case Bsc_Event.BSC_ZHANJI_INFO:
                if(data && data.length>0){
                    this.initZhanji(data, this._itemList, this.jlContentNode );
                }else {//没有战绩
                    cc.dd.PromptBoxUtil.show('您还没有比赛场战绩!');
                }

                break;
        }
    },
    /**
     * 关闭按钮
     */
    close:function () {
        this.node.removeFromParent();
        this.node.destroy();
    },

});
