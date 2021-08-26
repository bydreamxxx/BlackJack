// create by wj 2018/03/23
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        ContentNode: cc.Node,
        itemList: [],
        itemHeight: 120,
        spaceY: 0,
    
    },

    initUI: function(list){
        cc.dd.ResLoader.loadPrefab(hall_prefab.KLB_HALL_BATTLE_RECORD_ITEM, function (prefab) {
            for(var i=0; i<list.length; ++i){
                var itemData = list[i];
                if(itemData){
                    var item = cc.instantiate(prefab);
                    this.itemList.push(item);
                    item.parent = this.ContentNode;

                    var cnt = this.itemList.length;
                    var y = 10+(cnt-0.5)*this.itemHeight + (cnt-1)*this.spaceY;
                    item.y = -y;
                    this.ContentNode.height = cnt*this.itemHeight+(cnt+1)*this.spaceY;
                    item.getComponent('klb_hall_Battle_Record_Item').setData(itemData);
                }
            }
        }.bind(this));
    },

    clickCallBack:function(histroyId){

    },

    close: function(){
        cc.dd.UIMgr.destroyUI(this.node);
    },

    // update (dt) {},
});
