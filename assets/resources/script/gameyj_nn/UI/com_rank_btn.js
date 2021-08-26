var rank_info = require('rank_info');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        gameId: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad () {},

    start() {
        this.node.on('click', this.onClick, this);
    },

    onClick() {
        hall_audio_mgr.com_btn_click();
        var gameId = this.gameId;
        var prefabPath = 'gameyj_common/prefab/com_game_rank';
        var UI = cc.dd.UIMgr.getUI(prefabPath);
        if (!UI) {
            var rankId = rank_info.getItem(function (item) {
                return item.game_type == gameId && item.refresh_type == 1;
            }).key;
            const req = new cc.pb.room_mgr.msg_rank_req();
            req.setRankId(rankId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_rank_req, req,
                'msg_rank_req', 'no');
        }
    },
    // update (dt) {},
});
