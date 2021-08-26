// create by wj 2018/03/21
var hall_prefab = require('hall_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        scrollNode: cc.Node,
        contentNode: cc.Node,
        spaceY: 0,
        itemHeight: 146,
        _itemList: [],

        bgNode: cc.Node,
        btnNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // var Anim = this.bgNode.getComponent(cc.Animation);
        // Anim.play();
        this.bgNode.getComponent(cc.Widget).right = -234;
        this.bgNode.runAction(cc.moveBy(0.33, -234, 0));

        var ani = this.btnNode.getComponent(cc.Animation);
        ani.play('btnFadeIn');
    },

    InitCountyList: function(game_List, provinceId){
        this.scrollNode.active = true;
        for(var i in this._itemList){
            this._itemList[i].getComponent('klb_hall_Map_CountyTag').deleNode();
        }

        this._itemList.splice(0);
        this.provinceId = provinceId;
        this.initItem(game_List, this._itemList, this.contentNode);
    },

        /**
     * 初始化 列表
     * @param data       列表数据
     * @param itemList   数据保存容器
     * @param parent     滑动列表，节点父节点
     */
    initItem:function (data, itemList, parent) {
        var self = this;
        cc.dd.ResLoader.loadPrefab(hall_prefab.KLB_HALL_MAP_COUNTYTAG, function (prefab) {
            for(var i=0; i<data.length; ++i){
                var itemData = data[i];
                if(itemData){
                    var item = cc.instantiate(prefab);
                    itemList.push(item);
                    item.parent = parent;
                    var cpt = item.getComponent(cc.Toggle);
                    cpt.toggleGroup = parent;

                    var cnt = itemList.length;
                   var y = (cnt-0.5)*this.itemHeight + (cnt-1)*this.spaceY;
                    item.y = -y;
                    parent.height = cnt*this.itemHeight+(cnt+1)*this.spaceY;
                    item.getComponent('klb_hall_Map_CountyTag').setData(itemData, this.provinceId, this.checkBtnCallBack.bind(this));
                }
            }
        }.bind(this));
    },

    checkBtnCallBack:function(data)
    {
        this._itemList.forEach(function(prefab){
            var Component = prefab.getComponent('klb_hall_Map_CountyTag');
            prefab.getComponent(cc.Toggle).isChecked = Component.changeBtnSelectState(data.key);
        });
        this._data = data;
        this.btnNode.getComponent(cc.Button).interactable = true;
    },

    clickEnterGame: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_MAP_CONFIRM, function(ui){
            ui.zIndex = 45;
            var cpt = ui.getComponent('klb_hall_Map_Confirm');
            cpt.initUI(this._data, this.provinceId);
        }.bind(this));
    },


    close: function(){
        cc.dd.UIMgr.destroyUI(this.node);
    }

    // update (dt) {},
});
