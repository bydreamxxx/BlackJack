var DeskData = require('ahmj_desk_data').DeskData;
var playerMgr = require('ahmj_player_mgr');

var ahmj_util = {

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
        cc.dd.SceneManager.enterRoomList(cc.dd.Define.GameType.AHMJ_GOLD);
    },
};

module.exports = ahmj_util;
