var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        rightContentNode:cc.Node,//详细信息显示
        rightStrTTF:cc.Label,//显示信息显示
        titleStrTTF:cc.Label, //显示标题
        timeStrTTF:cc.Label, //显示时间挫
        detailsprite:cc.Sprite, //显示图片
        title:cc.Label,
        titleSprite: cc.Sprite,
        titleSpriteFrame: [cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 初始化详细信息
     */
    createInfo:function (data) {
        if(data.type == 0){
            this.title.string = "公 告";
        }else{
            this.title.string = "活 动";
        }

        //if(data.type != 1){
            this.rightStrTTF.node.active = true;
            this.detailsprite.node.active = false;
            var content = data.content.replace(/\\n/g, ' \n ');
            this.rightStrTTF.string =  content;
            //this.rightStrTTF.node.y = this.rightStrTTF.node.height*-0.5;
            this.rightContentNode.height = this.rightStrTTF.node.height;
    
        // }else{
        //     this.rightStrTTF.node.active = false;
        //     this.detailsprite.node.active = true;
        //     cc.dd.SysTools.loadWxheadH5(this.detailsprite, data.content);
        // }
        this.titleStrTTF.string = cc.dd.Utils.subChineseStr(data.title, 0, 42);
        this.timeStrTTF.string = this.convertTime(data.timestamp);
    },

    close: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

        /**
     * 转换具体时间
     */
    convertTime:function(t) {
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
