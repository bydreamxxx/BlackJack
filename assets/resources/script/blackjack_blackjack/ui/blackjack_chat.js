var chat_game_cfg = require('chat_game_cfg');
var chat_duanyu_item = require('chat_duanyu_item');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    editor:{
        menu:"BlackJack/blackjack_chat"
    },

    onLoad:function () {
        this.duanyu_scrollView = cc.find("duanyu_list",this.node).getComponent(cc.ScrollView);
        this.duan_yu_contentNode = cc.find("duanyu_list/view/content",this.node);
        this.duan_yu_item = cc.find("duanyu_item",this.node);
        this.initChat()
    },
    initChat: function () {
        var duanyu_list = chat_game_cfg.getItem(function (itrem) {
            if(itrem.game_id == RoomMgr.Instance().gameId){
                return itrem;
            }
        });

        var duanyu_item = [];
        chat_duanyu_item.getItem(function (itrem) {
            duanyu_item[itrem.duanyu_id] = itrem;
        });

        duanyu_list = duanyu_list.duanyu_id.split(';')

        for(var i = 0, len = duanyu_list.length; i < len; ++i){
            var dy_id = duanyu_list[i];
            var item = cc.instantiate(this.duan_yu_item);
            item.active = true;
            item.parent = this.duan_yu_contentNode;
            item.x = 0;
            var item_ui = item.getComponent('ChatDuanYuItem');
            item_ui.setData(duanyu_item[dy_id], this.onClickClose.bind(this));
            item_ui.intervalTimeCallBack(this.intervalTime);
        }
        // this.updateTab(0);
    },

    intervalTimeCallBack:function (interval) {
        this.intervalTime = interval;
    },

    onClickClose: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
