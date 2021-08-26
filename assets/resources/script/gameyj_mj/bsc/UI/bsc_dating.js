
const bscCfg = require('bsc_ActCfg');
const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_sendMsg = require('bsc_sendMsg');
const Bsc = require('bsc_data');

cc.Class({
    extends: cc.Component,

    properties: {
        leftPageView:cc.PageView,//左边的列表
        pageMxaNum:3,//每页中多少条
        //----------------右边的scrollView--------------
        contentNode: cc.Node,
        _itemList: [],


    },

    onLoad: function () {
        this._infoList = bscCfg.Bsc_Info;
        //当前显示的活动类型 的数据
        this._selectActData= null;
        Bsc_ED.addObserver(this);
    },
    onDestroy: function () {
        Bsc_ED.removeObserver(this);
    },

    start:function () {
        this._initPageView(this.leftPageView, this._infoList, function () {
            //设置默认打开页面
            var list = this.leftPageView.getPages()
            if(list && list.length>0){
                list[0].getComponent('bsc_pageViewItem').itemTouchCallBack(null, 0);
            }
        }.bind(this));

    },

    /**
     * 排序数据
     */
    sortData: function( data ) {
        var comp = function( a, b ) {
            if( a.matchId < b.matchId ) {
                return -1;
            } else {
                return 1;
            }
        };

        data.sort( comp );
    },

    /**
     * 初始化 列表
     * @param node
     */
    _initScrollView:function (data, itemList, parent) {
        this.sortData( data );
        this._createItem('gameyj_mj/bsc/prefabs/bsc_scrollViewItem', function (prefab) {
            for(var i=0; i<data.length; ++i){
                var itemData = data[i];
                if(itemData){
                    var item = cc.instantiate(prefab);
                    itemList.push(item);
                    item.parent = parent;

                    var cnt = itemList.length;
                    var y = 10+(cnt-0.5)*item.height;
                    item.y = -y;
                    parent.height = cnt*item.height;
                    item.getComponent('bsc_scrollViewItem').setData(itemData, this.scrollViewItemCallBack.bind(this));
                }
            }
        }.bind(this));
    },

    _createItem:function (PrefabPath, endCall) {
        cc.resources.load(PrefabPath, cc.Prefab, function (err, prefab) {
            endCall(prefab);
        });
    },

    /**
     * 初始化左边的pageview
     */
    _initPageView:function (pageView, info, endCall) {
        this._createItem('gameyj_mj/bsc/prefabs/bsc_pageViewItem',function (prefab) {
            for(var i=0; info && i<info.length; i+=this.pageMxaNum){
                var itemData = info.slice(i, i+this.pageMxaNum);
                if(itemData){
                    itemData.pageIdx = Math.floor(i%3);
                    var item = cc.instantiate(prefab);
                    pageView.addPage(item);
                    item.getComponent('bsc_pageViewItem').setData(itemData, this.pageViewItemCallback.bind(this));
                }
            }
            endCall();
        }.bind(this));

    },

    /**
     * pageview Item 回调
     */
    pageViewItemCallback:function (data, pageIdx) {
        cc.log('点解pageViewItem', data);
        this._selectActData = data;
        this._touchPageIdx = pageIdx;
        Bsc_sendMsg.getActByType(data.BscType);

    },

    /**
     * scrollView Item回调
     */
    scrollViewItemCallBack:function (data) {
        cc.log('点解scrollViewItem', data);
        cc.resources.load('gameyj_mj/bsc/prefabs/bsc_bisaiInfo', cc.Prefab, function (err, prefab) {
            var bsc = cc.instantiate(prefab);
            bsc.parent = cc.find('Canvas');
            var num = Bsc.BSC_Data.Instance().getChangNum();
            bsc.getComponent('bsc_bisaiInfo').setData(data, num,  this._selectActData.Bsc_gz);
        }.bind(this));
    },

    /**
     * 清理ScrollView
     */
    cleanScrollView:function (List) {
        for(var i in List){
            List[i].removeFromParent();
            List[i].destroy();
        }
        List.splice(0);
    },

    /**
     * 刷新scrool中的详细信息
     */
    flushScrollItemToNet:function (data) {
        if(data.infoList && data.infoList.length<=0){
            cc.dd.PromptBoxUtil.show('暂未开放,敬请期待！');
            return;
        }
        if(data.type == this._selectActData.BscType){
            var list = this.leftPageView.getPages();
            for(var i in list){//取消其他的选择
                var item = list[i].getComponent('bsc_pageViewItem');
                item.cleanSelect();
                if(i==this._touchPageIdx){
                    item.setTouchSelet(this._selectActData.idx);
                }
            }

            this.cleanScrollView(this._itemList);
            this._initScrollView(data.infoList, this._itemList, this.contentNode);
        }
    },

    onEventMessage:function (event,data) {
        switch (event) {
            case Bsc_Event.BSC_FLUSH_INFO://刷行
                this.flushScrollItemToNet(data[0]);
                break;
        }
    },

});
