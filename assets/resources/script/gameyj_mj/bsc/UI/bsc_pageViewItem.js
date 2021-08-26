const  NodeName = {
    iconSp:'icon',
    selectNode:'selectSp'

}

cc.Class({
    extends: cc.Component,

    properties: {
        allItemList:[cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        this._data = null;
        this._touchCallBack=null;
    },

    /**
     * 设置数据
     */
    setData:function (data, callBack) {
        this._data = data;
        this._touchCallBack=callBack;
        for(var i=0; data && i<data.length; ++i){
            var item = this.allItemList[i];
            this._data[i].idx = i;
            if(data[i].Icon && item){//设置图标
                var node = item.getChildByName(NodeName.iconSp);
                var sp = new cc.SpriteFrame(data[i].Icon);
                if(sp && node){
                    node.getComponent(cc.Sprite).spriteFrame = sp;
                }
            }
            item.getChildByName(NodeName.selectNode).active = false;
        }
    },
    /**
     * 点击回调
     */
    itemTouchCallBack:function (event, data) {
        var idx = Number(data);
        if(this._touchCallBack){
            this._touchCallBack(this._data[idx], this._data.pageIdx);
        }
    },

    /**
     * 设置点击
     */
    setTouchSelet:function (touchIdx) {
        if(touchIdx>=0 && this.allItemList.length>touchIdx){
            this.allItemList[touchIdx].getChildByName(NodeName.selectNode).active = true;
        }
    },
    /**
     * 取消选择
     */
    cleanSelect:function () {
        for(var i in this.allItemList){
            this.allItemList[i].getChildByName(NodeName.selectNode).active = false;
        }
    },
});
