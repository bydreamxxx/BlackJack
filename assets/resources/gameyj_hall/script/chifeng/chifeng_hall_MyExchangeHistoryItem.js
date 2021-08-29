var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        time: cc.Label,
        code: cc.Label,
    },

    initHistoryInfo(index, data){
        this.bg.active = index % 2 == 1;
        this.time.string = data.value+'元';//this.convertTimeDay(data.time);
        this.code.string = data.code;
    },

    onClickCopyCode(){
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.code.string);
            cc.dd.PromptBoxUtil.show("复制成功");
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
});
