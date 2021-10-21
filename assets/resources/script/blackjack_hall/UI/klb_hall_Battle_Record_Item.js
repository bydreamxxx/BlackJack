// create by wj 2018/03/23

cc.Class({
    extends: cc.Component,

    properties: {
        roundLabel: cc.Label,
        dayLabel: cc.Label,
        dateLabel: cc.Label,
        _data: null,
        playerNode:{default: [], type: cc.Node, tooltip:'玩家信息'},
    },

    setData: function(data){
        this.roundLabel.string = data.round;
        this.dayLabel.string = this.convertTimeDay(data.timestamp);
        this.dateLabel.string = this.convertTimeDate(data.timestamp);
        for(var i = 0; i < 4; i++){
            if(i <  data.resultList.length){
                var name = this.playerNode[i].getChildByName('name').getComponent(cc.Label);
                name.string = data.resultList[i].name
    
                var score = this.playerNode[i].getChildByName('score').getComponent(cc.Label);
                score.string = data.resultList[i].score > 0 ? ('+' + data.resultList[i].score) : data.resultList[i].score;
                if(data.resultList[i].score > 0)
                    score.node.color = cc.color(32,164,60);
                else
                    score.node.color = cc.color(214,14,31);
            }else{
                this.playerNode[i].active = false;
            }

        }
        this._data = data;
    },

    clickPlayAgan: function(){
        cc.dd.PromptBoxUtil.show( 'NOT YET OPEN，敬请期待' );
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
