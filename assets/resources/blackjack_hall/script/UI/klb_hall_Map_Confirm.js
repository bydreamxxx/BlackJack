// create by wj 2018/03/21
const Hall = require('jlmj_halldata');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        desc: cc.Label,
        bgNode: cc.Node,
    },


    onLoad() {
        this.bgNode.setScale(0.01);
        // var action = cc.scaleTo(0.1, 1);
        // this.bgNode.runAction(action);
        cc.tween(this.bgNode).to(0.1, { scale: 1 }).start();
    },

    initUI: function (data, provinceid) {
        this._data = data;
        this.provinceId = provinceid;

        this.title.string = '确定选择[' + this._data.area + ']吗?';
        this.desc.string = '系统将为您推荐[' + this._data.area + ']的特色游戏。';
    },

    confirmClick: function () {
        hall_audio_mgr.com_btn_click();
        var json = cc.sys.localStorage.setItem('provinceid', this.provinceId);
        var key = cc.sys.localStorage.setItem('locationid', this._data.key);

        var self = this;
        // var moveto = cc.scaleTo(0.1, 0.01);
        // var seq = cc.sequence(moveto, cc.callFunc(function () {
        //     var ui = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_MAP_PROVINCE_MAP);
        //     if (ui)
        //         cc.dd.UIMgr.destroyUI(ui);
        //     ui = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_MAP_COUNTYLIST);
        //     if (ui)
        //         cc.dd.UIMgr.destroyUI(ui);
        //     var prefab = 'blackjack_hall/prefabs/klb_hall_map/' + self.provinceId;
        //     ui = cc.dd.UIMgr.getUI(prefab);
        //     if (ui)
        //         cc.dd.UIMgr.destroyUI(ui);

        //     cc.dd.UIMgr.destroyUI(self.node);
        //     //if(cc.dd.SceneManager.getCurrScene())
        //     //cc.dd.SceneManager.enterHall();
        //     Hall.HallED.notifyEvent(Hall.HallEvent.UPDATE_GAME_LIST);
        // }))
        // self.bgNode.runAction(seq);
        cc.tween(self.bgNode)
            .to(0.1, { scale: 0.01 })
            .call(function () {
                var ui = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_MAP_PROVINCE_MAP);
                if (ui)
                    cc.dd.UIMgr.destroyUI(ui);
                ui = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_MAP_COUNTYLIST);
                if (ui)
                    cc.dd.UIMgr.destroyUI(ui);
                var prefab = 'blackjack_hall/prefabs/klb_hall_map/' + self.provinceId;
                ui = cc.dd.UIMgr.getUI(prefab);
                if (ui)
                    cc.dd.UIMgr.destroyUI(ui);

                cc.dd.UIMgr.destroyUI(self.node);
                //if(cc.dd.SceneManager.getCurrScene())
                //cc.dd.SceneManager.enterHall();
                Hall.HallED.notifyEvent(Hall.HallEvent.UPDATE_GAME_LIST);
            })
            .start();
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        var self = this;
        // var moveto = cc.scaleTo(0.1, 0.01);
        // var seq = cc.sequence(moveto, cc.callFunc(function () {
        //     cc.dd.UIMgr.destroyUI(self.node);
        // }))
        // self.bgNode.runAction(seq);
        cc.tween(self.bgNode)
            .to(0.1, { scale: 0.01 })
            .call(function () {
                cc.dd.UIMgr.destroyUI(self.node);
            })
            .start();
    }
});
