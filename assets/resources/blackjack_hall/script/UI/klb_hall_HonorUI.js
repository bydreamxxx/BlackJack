// create by wj 2018/04/04
var hallData = require('hall_common_data').HallCommonData;
var data_exp = require('playerExp');

cc.Class({
    extends: cc.Component,

    properties: {
        levelTTF:cc.Label,       //等级
        processTTF:cc.Label,    //进度

        awardPrefab: {
            default: null,
            type: cc.Prefab,
        },
        itemHeight: 45,
        itemList:[],
    },

    onLoad: function() {
        this.initView();
    },

    updateInfo: function(){
        var userInfo = hallData.getInstance();
        this.levelTTF.string = 'Lv.' + userInfo.level;

        var exp_item = data_exp.getItem(function (item) {
            return item.key == userInfo.level;
        })
        this.processTTF.string =  userInfo.exp + '/' + exp_item.exp;
    },
    //初始化视图
    initView: function(){
        for(var i in this.itemList){
            this.itemList[i].removeFromParent();
            this.itemList[i].destroy();
        }
        this.contentNode = cc.find("itemscroll/mask/content",this.node);
        var userInfo = hallData.getInstance();

        for(var i=0;i<data_exp.items.length;i++)
        {
            var its = cc.instantiate(this.awardPrefab);
            its.parent = this.contentNode;
            this.itemList.push(its);

            var level = cc.find("level",its).getComponent(cc.Label);
            var value = cc.find("value",its).getComponent(cc.Label);
            
            level.string = 'Lv.' + data_exp.items[i].key;
            if(i == 0)
                value.string = '0';
            else{
                value.string = data_exp.items[i -1].exp;
            }
            var cnt = this.itemList.length;
            var y = (cnt-0.5)*this.itemHeight;
            its.y = -y;
            its.parent.height = cnt*this.itemHeight;
            if(data_exp.items[i].key == userInfo.level)
                level.node.color = cc.color(239,225,44);
            else
                level.node.color = cc.color(14,144,212);
        }

    },

});
