var gZJHMgr = require('ZjhManager').Instance();
var EnterRoomError = cc.Enum({
    [-1]: "筹码不足",
    [-2]: "系统错误",
});

var QuitRoomError = cc.Enum({
    [-1]: "牌局中",
    [0]: "退出房间成功",
    [1]: "金币不足，请充值",
    [2]: "您因长时间未操作被踢出房间",
});

var handler = {
    /*******************************填大坑消息回复*****************************************/
    /**
     *  创建房间消息回复
     */
    on_msg_zhajinhua_match_2c: function (msg) {
        cc.log("msg", msg);
        if (msg.retCode != 0) {
            cc.dd.PromptBoxUtil.show(EnterRoomError[msg.retCode]);
        } else {
            gZJHMgr.setRoomType(msg.roomType)
        }
    },

       
    on_msg_zhajinhua_quit_2c:function(msg) {
        if (msg.retCode != -1) {
            gZJHMgr.quitGame()
        } 

        cc.dd.PromptBoxUtil.show(QuitRoomError[msg.retCode]);
    },

    on_msg_zhajinhua_change_room_2c:function(msg) {
        if (msg.retCode == 0) {
            // gZJHMgr = null
            // gZJHMgr = ZhaJinHuaManager:new ()
        } else  {
            cc.dd.PromptBoxUtil.show("牌局中");
            // gMessageCenter: SystemMessage(SystemMessage_Prompt, GameTipsTextStr[26])
        }
    },

    on_msg_zhajinhua_room_info_2c:function(msg) {
        // //cc.log(msg, "炸金花房间数据")
        // gZJHMgr = null
        // if (gZJHMgr == null) {
        //     gZJHMgr = ZhaJinHuaManager:new ()
        // }
        gZJHMgr.initArgs();
        gZJHMgr.roomInfo(msg)
    },

    on_msg_zhajinhua_player_enter_2c:function(msg) {
        if (gZJHMgr) {
            gZJHMgr.playerEnterGame(msg.player)
        }
    },

    on_msg_zhajinhua_player_quit_2c:function(msg) {
        // if (gZJHMgr == null) { return }
        cc.log("炸金花退出房间消息")
        gZJHMgr.playerQuitRoom(msg.site)
    },

    on_msg_zhajinhua_state_change_2c:function(msg) {
        if (gZJHMgr) {
            gZJHMgr.setGameState(msg.roomState)
        }
    },

    on_msg_zhajinhua_ready_2c:function(msg) {
        if (gZJHMgr) {
            gZJHMgr.setPlayerReadyState(msg)
        }
    },

    on_msg_zhajinhua_join_game_sites_2c:function(msg) {
        if (gZJHMgr) {
            gZJHMgr.dispenseCards(msg)
        }
    },

    on_msg_zhajinhua_op_site_2c:function(msg) {
        if (gZJHMgr) {
            gZJHMgr.updateNextOpPlayer(msg)
        }
    },

    on_msg_zhajinhua_op_2c:function(msg) {
        if (gZJHMgr) {
            //cc.log(msg, "msghandle.on_msg_zhajinhua_op_2c")
            gZJHMgr.updateOptionData(msg)
        }
    },

    on_msg_zhajinhua_result_2c:function(msg) {
        if (gZJHMgr) {
            gZJHMgr.setResultData(msg)
        }
    },

    on_msg_zhajinhua_set_anto_clips_2c:function(msg) {
        if (msg.retCode == 0) {
            //gMessageCenter: SystemMessage(SystemMessage_Prompt, GameTipsTextStr[502])
            cc.dd.PromptBoxUtil.show("自动补充筹码设置成功");
            gZJHMgr.updateAutoChip(msg)
            // var window = WindowManager.GetWindow(AutoAddClipsLayer)
            // if (window) {
            //     window.reseverCallfunc(msg)
            // }
        }else{
            cc.dd.PromptBoxUtil.show("自动补充筹码设置失败,金额错误");
        }
    },

    on_msg_zhajinhua_clips_update_2c:function(msg) {
        if (gZJHMgr) {
            gZJHMgr.autoAddClips(msg)
        }
    },

    //     on_msg_zhajinhua_dashang_2c:function(msg){
    // //cc.log(msg,"打赏")
    // if(gZJHMgr){
    //   gZJHMgr.playgoldRecv:function(msg)
    // }
    // }

};
module.exports = handler;