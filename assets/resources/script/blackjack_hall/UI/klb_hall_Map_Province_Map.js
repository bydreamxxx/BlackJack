// create by wj 2018/03/21
var province_config = require('hallmap');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        cloudNode: cc.Node,
        contentNode: cc.Node,
        mapNode: cc.Node,
        closeNode: cc.Node,
    },

    onLoad() {
        this.closeNode.active = true;
        var Anim = this.cloudNode.getComponent(cc.Animation);
        Anim.play();

        var ani = this.contentNode.getComponent(cc.Animation);
        ani.play('map_show1');

    },

    openMap: function () {


        var self = this;
        province_config.items.forEach(function (data) {
            var str = 'location_Node_' + data.province_code;
            var node = self.mapNode.getChildByName(str);
            if (node) {
                var xuanzhongNode = node.getChildByName('ditu_xuanzhesg');
                var zuobiao = node.getChildByName('ditu_zuobiao');
                var unopen = node.getChildByName('ditu_zuobiaoxzq');
                var nametbl = node.getChildByName('province');
                if (data.open == 1) {
                    zuobiao.active = true;
                    unopen.active = false;
                    var json = cc.sys.localStorage.getItem('provinceid');
                    if (parseInt(json) == data.province_code)
                        xuanzhongNode.active = true;
                    else
                        xuanzhongNode.active = false;
                    var outline = nametbl.getComponent(cc.LabelOutline);
                    outline.color = cc.color(132, 66, 0);
                    // var seq = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
                    // xuanzhongNode.runAction(cc.repeatForever(seq));
                    cc.tween(xuanzhongNode)
                        .set({ opacity: 0 })
                        .to(0.8, { opacity: 255 })
                        .to(0.8, { opacity: 0 })
                        .union()
                        .repeatForever()
                        .start();
                } else {
                    zuobiao.active = false;
                    unopen.active = true;
                    xuanzhongNode.active = false;
                    var outline = nametbl.getComponent(cc.LabelOutline);
                    outline.color = cc.color(9, 83, 39);
                };
            }
        });
    },

    onClickOpenCityMap: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var cityData = province_config.getItem(function (info) {
            return info.province_code == parseInt(data);
        });
        if (cityData.open == 0) {
            cc.dd.PromptBoxUtil.show('该地区暂未开放，敬请期待');
            return;
        }
        var prefab = 'blackjack_hall/prefabs/klb_hall_map/' + data;
        cc.dd.UIMgr.openUI(prefab, function (ui) {
            ui.zIndex = 41;
            var cpt = ui.getComponent('klb_hall_Map_City');
            cpt.setProvinceId(data);
        });
    },
    hideQuit: function () {
        this.closeNode.active = false;
    },

    onClose: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
