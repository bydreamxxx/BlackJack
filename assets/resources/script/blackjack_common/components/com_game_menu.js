/**
 * Created by luke on 2018/12/6
 */
let hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        btn_menu: cc.Button,    //菜单按钮
        left_node: cc.Node,     //left节点
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let com_game_setting = cc.find('Canvas').getComponentInChildren('com_game_setting');
        if (com_game_setting) {
            com_game_setting.initData();
        }
    },

    /**
     * 点击菜单
     */
    onMenu(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (!this.menu_show) {
            this.btn_menu.interactable = false;
            var ani = this.node.getComponent(cc.Animation);
            if (ani._nameToState[ani._defaultClip.name]) {
                ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
            }
            this.node.getComponent(cc.Animation).off('finished', null);
            this.node.getComponent(cc.Animation).on('finished', function () { this.btn_menu.interactable = true; }.bind(this), this);
            this.node.getComponent(cc.Animation).play();
            this.menu_show = true;
        }
        else {
            this.btn_menu.interactable = false;
            var ani = this.node.getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            this.node.getComponent(cc.Animation).off('finished', null);
            this.node.getComponent(cc.Animation).on('finished', function () { this.btn_menu.interactable = true; }.bind(this), this);
            this.node.getComponent(cc.Animation).play();
            this.menu_show = null;
        }
    },

    //点击背景
    onBgClick() {
        if (this.menu_show) {
            this.btn_menu.interactable = false;
            var ani = this.node.getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            this.node.getComponent(cc.Animation).off('finished', null);
            this.node.getComponent(cc.Animation).on('finished', function () { this.btn_menu.interactable = true; }.bind(this), this);
            this.node.getComponent(cc.Animation).play();
            this.menu_show = null;
        }
    },

    //功能按钮点击
    onBtnClick() {
        this.menu_show = null;
        this.node.getComponent(cc.Animation).stop();
        this.left_node.active = false;
        this.btn_menu.interactable = true;
    },

    //设置
    onSetting(event, custom) {
        hall_audio_mgr.com_btn_click();
        let com_game_setting = cc.find('Canvas').getComponentInChildren('com_game_setting');
        if (com_game_setting) {
            com_game_setting.node.active = true;
        }
    },
});
