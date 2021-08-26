// create by wj 2019/11/06
const fish_room = require('fishroom');
var hallData = require('hall_common_data').HallCommonData;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var playerManager = require('FishPlayerManager').CFishPlayerManager.Instance();
var playerEvent = require('FishPlayerManager').Fish_PlayerEvent;
var playerEd = require('FishPlayerManager').Fish_PlayerED;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var Define = require("Define");
let scene_dir_cfg = require('scene_dir_cfg');
var loading_cfg = require('loading_cfg');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var gFishMgr = require('FishManager').FishManager.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        ContentNode:cc.Node, //列表
        spaceX:35,
        spaceY:35,
        itemWidth:260,
        itemHeight:285,
        itemList: [],
        scrollView:cc.ScrollView,
        m_oDeskNode: cc.Node,
        m_nCountIndex: 1,
    },


    onLoad: function () {
        playerEd.addObserver(this);
        RoomED.addObserver(this);
        HallCommonEd.addObserver(this);
        this.start_y = this.ContentNode.y;
        this.move_y = this.ContentNode.y;
        this.start_indx = 1;

        this.setUserInfo(hallData.getInstance());
    },

    onDestroy: function () {
        playerEd.removeObserver(this);
        RoomED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    initDeskNodeList: function(roomid, indexcount){
        this.m_nRoomId = roomid;
        var data = fish_room.getItem(function(item){
            if(item.key == (138* 100 + roomid))
                return item;
        })

        if(data){
            var count = 8;
            if(8 * indexcount > data.fish_table)
                count = 8 * indexcount - data.fish_table;
            for(var i = 0; i < count; i++){
                var deskNode = cc.instantiate(this.m_oDeskNode);
                var deskTag = i + 1 + (indexcount - 1) * 8;
                deskNode._tag = deskTag
                this.itemList.push(deskNode);
                deskNode.active = true;
                var numNode = cc.dd.Utils.seekNodeByName(deskNode, "deskIndx");
                if(numNode)
                    numNode.getComponent(cc.Label).string = deskTag < 10 ? '0' + deskTag : deskTag;
                this.ContentNode.addChild(deskNode);

                var cnt = this.itemList.length;
                //界面排列
                var y = (Math.ceil(cnt / 4 ) - 0.5)*this.itemHeight + (Math.ceil(cnt / 4) -0.5)*this.spaceY;
                deskNode.y = -y;
                var index = (cnt % 4);
                if(index == 0){index = 4;}
                var x = (index - 0.5) * this.itemWidth + (index - 0.5) * this.spaceX;
                deskNode.x = x; 
                
                this.ContentNode.height = Math.ceil(cnt / 4 )*this.itemHeight+Math.ceil(cnt / 4 +1)*this.spaceY;       

            }
        }
        this.scrollView.node.on('scroll-ended', this.onScrollEnded.bind(this), this);
    },

    getDeskNode: function(deskIndex){
        for(var node of this.itemList){
            if(node._tag == deskIndex)
                return node;
        }
    },

    updateDeskList: function(){//更新桌子列表显示
        var deskDataList = playerManager.getDeskTempList();
        for(var deskData of deskDataList){
            var deskNode = this.getDeskNode(deskData.argsList[0]); //获取节点
            if(deskNode){
                var cpt = deskNode.getComponent('gameyj_Fish_Desk_Node');
                if(cpt)
                    cpt.updateDeskNodeInfo(deskData); //更新桌子信息
            }
        }
    },

    updateAllDeskList: function(){
        var deskDataList = playerManager.getAllDeskList();
        for(var deskData of deskDataList){
            var deskNode = this.getDeskNode(deskData.argsList[0]); //获取节点
            var cpt = deskNode.getComponent('gameyj_Fish_Desk_Node');
            if(cpt)
                cpt.updateDeskNodeInfo(deskData); //更新桌子信息
        }
    },

    loadScrollRecode: function(){
        var data = gFishMgr.getRoomItem();
        var msg = new cc.pb.game_rule.msg_get_room_desks_req();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(138);
        gameInfo.setRoomId(data.roomid);
        msg.setGameInfo(gameInfo);
        msg.setIndex(playerManager.getDeskIndex() + 1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_get_room_desks_req,msg,
            '发送协议[cmd_msg_get_room_desks_req][拉取数据信息]', true);
    },

    onScrollEnded: function(){
        this.m_nCountIndex += 1;
        if(this.m_nCountIndex > 3)
            return;

        if(playerManager.getCanGetListTag() == false)
            return;
        var isDwon = this.ContentNode.y > this.move_y;
        var cnt = this.itemList.length;
        var offset = (Math.ceil(cnt / 4)) *this.itemHeight+((Math.ceil(cnt / 4)) + 1)*this.spaceY - this.scrollView.node.getContentSize().height;

        if(isDwon){
            var moveOffsetY = this.ContentNode.y - this.start_y;
            if(moveOffsetY >= offset){
                this.move_y = this.ContentNode.y;
                this.loadScrollRecode();
            }
        }  
        this.initDeskNodeList(this.m_nRoomId, this.m_nCountIndex);
        this.updateAllDeskList();      
    },

    /**
     * 设置玩家信息
     */
    setUserInfo: function (userData) {
        var userinfo = this.node.getComponentInChildren('klb_hall_UserInfo');
        if (userinfo) {
            userinfo.setData(userData);
        }
    },

    //关闭界面
    closeUICallBack: function () {
        hall_audio_mgr.com_btn_click();
        var msg = new cc.pb.game_rule.msg_leave_room_desks_req();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(138);
        gameInfo.setRoomId(this.m_nRoomId);
        msg.setGameInfo(gameInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_leave_room_desks_req,msg,
            '发送协议[cmd_msg_leave_room_desks_req][拉取数据信息]', true);

        cc.dd.UIMgr.destroyUI(this.node);
        playerManager.clearAllData();
    },

        //日志打印 比赛场莫名拉回大厅bug
        stack(sceneName) {
            var e = new Error();
            var lines = e.stack.split("\n");
            lines.shift();
            var str = '加载场景:' + sceneName + ' \n';
            lines.forEach(item => {
                str += item;
                str += '\n';
            });
            cc.log(str);
        },
    
        enterGame: function(gameId){
            var sceneName = Define.GameId[gameId];
            if (cc.director.getScene().name == sceneName) {
                cc.log('当前正在场景 ' + sceneName + ' 无需切换场景');
                return false;
            }
    
            this.stack(sceneName);
            if (!cc.director.getScene() || !cc.director.getScene().name) {
                return;
            }
    
            let scene = cc.director.getScene();
            scene.autoReleaseAssets = true;
    
            var pre_scene_dir = scene_dir_cfg[cc.director.getScene().name];
            var load_scene_dir = scene_dir_cfg[sceneName];
    
            cc.gateNet.Instance().pauseDispatch();
            AudioManager.clearBackGroundMusicKey();
    
            var data = loading_cfg.getItem(function (item) {
                var list = item.key.split(';');
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == sceneName)
                        return item;
                }
            });
    
            var loading_scene = 'loading';
            if (data != null)
                loading_scene = data.scenename;
            cc.director.loadScene(loading_scene, function () {
                if (cc.sys.isMobile) {
                    if (pre_scene_dir != load_scene_dir) {
                        cc.loader.releaseResDir(pre_scene_dir);
                        cc.log("释放资源:" + pre_scene_dir);
                    }
                    cc.log("执行GC");
                    cc.sys.garbageCollect();
                }
            });
    
        },

    onEventMessage: function (event, data) {
        switch(event){
            case playerEvent.FISH_DESK_LIST_UPDATE:
                this.updateDeskList();
                break;
            case RoomEvent.on_coin_room_enter:
                this.enterGame(138);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                cc.dd.SceneManager.enterHall();
                break;
        }
    },
});
