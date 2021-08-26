var DeskData = require('ccmj_desk_data').DeskData;
var playerMgr = require('ccmj_player_mgr');

var ccmj_util = {

    /**
     * 吉林麻将清理
     */
    clear: function () {
        DeskData.Instance().clear();
        playerMgr.Instance().clear();
        if(cc.dd.user.real_id){
            //若旁观者查看回放,返回大厅,则恢复用户id
            cc.dd.user.id = cc.dd.user.real_id;
            cc.log('旁观者查看回放,返回大厅,恢复用户id');
        }

        cc.dd.mj_current_2d = null;
        cc.dd.mj_game_start = false;
        cc.gateNet.Instance().clearDispatchTimeout();

        cc.game.setFrameRate(40);
    },

    /**
     * 返回大厅
     */
    enterHall: function () {
        this.clear();
        cc.dd.SceneManager.enterHall();
        //关闭游戏背景音乐
        AudioManager.stopMusic();
    },

    /**
     * 返回大厅房间列表
     */
    enterRoomList: function () {
        cc.log('返回大厅房间列表');
        this.clear();
        cc.dd.SceneManager.enterRoomList(cc.dd.Define.GameType.CCMJ_GOLD);
    },

    enterMatch(){
        this.clear();
        cc.dd.SceneManager.enterHallMatch();
        AudioManager.stopMusic();
    },

    enterGame(gameid){
        this.clear();
        cc.dd.NetWaitUtil.show('正在请求数据');
        var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
        protoNewRoomList.setHallGameid(gameid);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
            '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);
    }
};

module.exports = ccmj_util;
