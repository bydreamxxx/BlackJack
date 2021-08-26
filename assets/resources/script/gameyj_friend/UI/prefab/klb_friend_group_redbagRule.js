var hall_audio_mgr = require('hall_audio_mgr').Instance();
let rule_config = require('qyq_hongbaoshuoming')
cc.Class({
    extends: cc.Component,

    properties: {
        titleItem: {
            default: null,
            type: cc.Node,
            tooltip: '标题组件'
        },
        descItem: {
            default: null,
            type: cc.Node,
            tooltip: '内容组件'
        },
        content:{
            default: null,
            type: cc.Node,
            tooltip: '容器'
        },
    },

    onLoad(){
        this.content.removeAllChildren();
        for(let i = 0; i < rule_config.items.length; i++){
            let title = cc.instantiate(this.titleItem);
            title.getComponent(cc.Label).string = rule_config.items[i].title;
            title.active = true;
            title.x = 0;
            this.content.addChild(title);

            let desc = cc.instantiate(this.descItem);
            desc.getComponent(cc.Label).string = rule_config.items[i].content;
            desc.active = true;
            desc.x = 0;
            this.content.addChild(desc);
        }
    },

    /**
     * 关闭界面
     */
    onclose: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
