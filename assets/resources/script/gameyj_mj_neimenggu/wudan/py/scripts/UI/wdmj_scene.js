let mjComponentValue = null;

cc.Class({
    extends: require('base_mj_scene'),

    ctor(){
        mjComponentValue = this.initMJComponet();
    },

    autoScaleWin: function () {
        var canvas_node = cc.find("Canvas");
        var desk_node = cc.find("Canvas/desk_node");
        var c_scale = canvas_node.height / desk_node.height;
        if(canvas_node.width / canvas_node.height >= desk_node.width / desk_node.height){
            // desk_node.scaleX = c_scale;
            desk_node.scaleY = c_scale;

            //比赛场分享
            let node = cc.find('Canvas/share_hongbao');
            if(node){
                // node.scaleY = c_scale;
                // node.scaleX = c_scale;
                node.getComponent(cc.Widget).updateAlignment();
            }
        }


        let zhuozi = cc.find("Canvas/zhuozi");
        c_scale = canvas_node.height / zhuozi.height;
        if(canvas_node.width / canvas_node.height >= desk_node.width / desk_node.height) {
            // zhuozi.scaleX = c_scale;
            zhuozi.scaleY = c_scale;
        }

        let toppanel = cc.find("Canvas/toppanel");
        toppanel.height = zhuozi.height * zhuozi.scaleY;
        toppanel.width = canvas_node.width;
        let widgetList = toppanel.getComponentsInChildren(cc.Widget);
        widgetList.forEach((widget)=>{
            if(widget){
                widget.updateAlignment();
            }
        })
    },

    /**
     * 排序手牌
     */
    jlmjPlayerDownSortShouPai: function () {
        //发牌动画结束
        this.require_playerMgr.Instance().playing_fapai_ani = false;
        this.require_UserPlayer.Instance().paixu();
        let jlmj_player_list = cc.find("Canvas/player_list").getComponent(mjComponentValue.playerList);
        jlmj_player_list.playerUpdateShouPaiUI();
        // var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('wdmj_player_down_ui');
        // player_down_ui.zhanli();
        // player_down_ui.updateShouPai(UserPlayer.Instance());
        this.require_playerMgr.Instance().playerMoPaiAction();

        cc.gateNet.Instance().clearDispatchTimeout();
    },

    initMJComponet() {
        return require("mjComponentValue").wdmj;
    }
});
