let mjComponentValue = null;

var jlmj_util = cc.Class({

    s_util: null,

    statics: {

        Instance: function () {
            if (!this.s_util) {
                this.s_util = new jlmj_util();
            }
            return this.s_util;
        },

        Destroy: function () {
            if (this.s_util) {
                this.s_util = null;
            }
        },

    },

    ctor(){
        mjComponentValue = this.initMJComponet();
        this.require_DeskData = require(mjComponentValue.deskData).DeskData;
        this.require_playerMgr = require(mjComponentValue.playerMgr);
    },

    /**
     * 吉林麻将清理
     */
    clear: function () {
        this.require_DeskData.Instance().clear();
        this.require_playerMgr.Instance().clear();
        if(cc.dd.user.real_id){
            //若旁观者查看回放,返回大厅,则恢复用户id
            cc.dd.user.id = cc.dd.user.real_id;
            cc.log('旁观者查看回放,返回大厅,恢复用户id');
        }

        cc.dd.mj_current_2d = null;
        cc.dd.mj_game_start = false;
        cc.gateNet.Instance().startDispatch();

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
        this._enterRoomList();
    },

    _enterRoomList(){
        cc.log("-----------------------no implements base_mj_util _enterRoomList-----------------------")
    },

    initMJComponet(){
        cc.log("-----------------------no implements base_mj_util initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});

module.exports = jlmj_util;
