const daojuStr = require('HallPropCfg');
cc.Class({
    extends: cc.Component,

    properties: {
        timeTTF:cc.Label,
        nameTTF:cc.Label,

        mingciTTF:cc.Label,//名次的数字
        mingChiList:[cc.Node],
        infoTTF:cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    setData:function (data) {
        if(data.rank>=0){
            if(data.rank>=3){
                this.mingChiList[3].active = true;
                this.mingciTTF.node.active = true;
                this.mingciTTF.string = data.rank;
            }else {
                this.mingChiList[data.rank-1].active = true;
            }
        }
        if(data.rewardList){
            this.infoTTF.string = this.compJiangli(data.rewardList);
        }

        this.nameTTF.string = data.matchname || 'XXXX';
        this.timeTTF.string = this.convertTime(Number(data.starttime));
    },

    /**
     * 处理奖励列表
     */
    compJiangli:function (data) {
        if(data){
            var str ='奖励:';
            var item = data;
            for(var k=0; k<item.length; ++k){
                str += item[k].num + daojuStr.getNameById(item[k].type);
                str += ' ';
            }
            return str;
        }
        return '';
    },

    /**
     * 获取系统时间
     */
    convertTime:function (t) {
        var date = new Date(t*1000);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours().toString().replace(/\b(\d)\b/g, "0$1") + seperator2 + date.getMinutes().toString().replace(/\b(\d)\b/g, "0$1")
            + seperator2 + date.getSeconds().toString().replace(/\b(\d)\b/g, "0$1");
        return currentdate;
    },
});
