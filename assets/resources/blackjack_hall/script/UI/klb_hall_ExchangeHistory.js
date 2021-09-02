var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: cc.Node,
        record_Item: cc.Prefab,
        itemHeight : 52,
        spaceY: 10,
        itemList:[],

    },

    // use this for initialization
    onLoad: function () {

    },

    setData: function(data){
        this.contentNode.removeAllChildren(true);

        if(data.codeList.length == 0){
            var desc = cc.find('desc_1', this.node);
            desc.active = true;
        }else{
            for(var i = 0; i < data.codeList.length; i++){
                var codeInfo = data.codeList[i];
                if(codeInfo){
                    var item = cc.instantiate(this.record_Item);
                    this.itemList.push(item);
                    item.parent = this.contentNode;

                    var cnt = this.itemList.length;
                    var y = (cnt-0.5)*this.itemHeight + (cnt-1)*this.spaceY;
                    item.y = -y;
                    item.parent.height = cnt*this.itemHeight+(cnt+1)*this.spaceY;

                    var dayTxt = cc.find('day',item);
                    var timeTxt = cc.find('time', item);
                    var moneyTxt = cc.find('content', item);

                    moneyTxt.getComponent(cc.Label).string = (codeInfo.value  )+ '元';
                    dayTxt.getComponent(cc.Label).string = this.convertTimeDay(codeInfo.time);
                    timeTxt.getComponent(cc.Label).string = this.convertTimeDate(codeInfo.time);
                }
            }
        }

    },

        /**
     * 转换时间
     */
    convertTimeDay:function (t) {
        var date = new Date(t*1000);
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }

        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },

    /**
     * 转化时间小时分
     */
    convertTimeDate: function(t){
        var date = new Date(t*1000);
        var seperator2 = ":";
        var hours = date.getHours();
        var min = date.getMinutes();
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }

        var currentdate = hours+ seperator2 + min;
        return currentdate;
    },

    copy: function(event, data){
        hall_audio_mgr.com_btn_click();

        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.CodeTxt[data].string);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    close: function(){
        cc.dd.UIMgr.destroyUI(this.node);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
