//create by wj 2018/03/21
var hall_prefab = require('hall_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oQuitBtn: cc.Node,
    },

    onLoad () {

    },
    //设置省份的代码
    setProvinceId: function(id){
        this.provinceId = id;
    },

    clickCity: function(event, data){
        hall_audio_mgr.com_btn_click();
        var str = 'province_' + this.provinceId;
        var config = require(str);
        var countyList = config.getItemList(function(dataInfo){
            return dataInfo.citycode == parseInt(data);
        });
        this.closeCountyList();

        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_MAP_COUNTYLIST, function(prefab){
            prefab.parent = this.node;
            var cpt = prefab.getComponent('klb_hall_Map_CountyUI');
            cpt.InitCountyList(countyList, this.provinceId);
        }.bind(this));
    },

    close: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    closeCountyList: function(){
        var node = this.node.getChildByName('klb_hall_CountyList');
        if(node)
            node.removeFromParent();
    },

    setQuitButtonShow: function(isShow){
        this.m_oQuitBtn.active = isShow;
    },
});
