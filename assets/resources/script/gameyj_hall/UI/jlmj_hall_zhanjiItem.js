cc.Class({
    extends: cc.Component,

    properties: {
        paiminTTF:cc.Label,      //排名
        roomNumTTF:cc.Label,     //房间号
        timeTTF:cc.Label,
        userArr:[cc.Label],     //玩家
        btnList:[cc.Node],      //回放按钮  查看按钮
    },

    // use this for initialization
    onLoad: function () {
        this._callback= null;
    },

    setData:function (data, callback, isCheck) {
        this.paiminTTF.string = data.idxnum || 0;
        this.roomNumTTF.string= data.roomId || 12345;
        this.timeTTF.string   = this.convertTime(Number(data.timestamp));
        data.userList = data.resultList;
        for(var i=0; data.userList && i<data.userList.length; ++i){
            this.initUserInfo(data.userList[i], this.userArr[i]);
        }
        if(isCheck){
            this.btnList[0].active = false;
            this.btnList[1].active = true;
        }else {
            this.btnList[1].active = false;
            this.btnList[0].active = true;
        }
        this._callback = callback;
        this._data = data;
    },

    /**
     * 设置
     */
    initUserInfo:function (userinfo, strTTF) {
        if(strTTF && userinfo){
            var str = userinfo.name || 'no name';
            str = cc.dd.Utils.substr( str, 0, 5 );
            str += ': ';
            str += userinfo.score || 0;
            strTTF.string = str;
        }
    },
    /**
     * 查看按钮回调
     */
    checkBtnCallBack:function () {
      if(this._callback){
          this._callback(this._data);
      }
    },
    /**
     * 回放按钮
     */
    huifangBtnCallBack:function () {
        cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_1);
    },

    /**
     * 销毁
     */
    deleNode:function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    /**
     * 转换时间
     */
    convertTime:function (t) {
        var date = new Date(t*1000);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hours = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }
        if (sec >= 0 && sec <= 9) {
            sec = "0" + sec;
        }

        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + min
            + seperator2 + sec;
        return currentdate;
    },
});
