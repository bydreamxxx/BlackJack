// create by wj 2019/11/07
var playerManager = require('FishPlayerManager').CFishPlayerManager.Instance();
var playerEvent = require('FishPlayerManager').Fish_PlayerEvent;
var playerEd = require('FishPlayerManager').Fish_PlayerED;
var gFishMgr = require('FishManager').FishManager.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oDeskData: null,
        m_tPlayerNode: [],
        m_oDefaultSprite: cc.SpriteFrame,
        m_oPlayerInfo: cc.Node,
    },

    onLoad: function () {
        playerEd.addObserver(this);

        for(var i = 0; i < 4; i++){
            this.m_tPlayerNode[i] = cc.dd.Utils.seekNodeByName(this.node, 'playerHead' + i);
        }
    },

    onDestroy: function () {
        playerEd.removeObserver(this);
    },

    updateDeskNodeInfo: function(deskData){
        if(deskData)
            this.m_oDeskData = deskData;
        var deskBg = cc.dd.Utils.seekNodeByName(this.node, 'deskBg');
        if(deskData.rolesList.length == 0){//桌子无人
            deskBg.color = cc.color(141,136,136);
            for(var i = 0; i < 4; i++){
                var headSp = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[i], 'headSp');
                if(headSp)
                    headSp.getComponent(cc.Sprite).spriteFrame = this.m_oDefaultSprite;
                this.m_tPlayerNode[i].getComponent(cc.Button).interactable = true;

                var clickNode = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[i], 'headClick');//头像点击隐藏
                if(clickNode)
                    clickNode.getComponent(cc.Button).interactable = false;
            }
            this.m_oDeskData = null;
            playerManager.clearDeskDataByRoomId(deskData.roomId);
        }else{
            deskBg.color = cc.color(255,255,255);
            for(var  k = 0; k < 4; k++){
                var headSp = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[i], 'headSp');//头像重置
                if(headSp)
                    headSp.getComponent(cc.Sprite).spriteFrame = this.m_oDefaultSprite;
            }
            for(var role of deskData.rolesList){
                var cpt = this.m_tPlayerNode[role.seat].getComponent('klb_hall_Player_Head'); //头像设置
                cpt.initHead( role.openId, role.headUrl, 'fish_desk_head_init');

                var clickNode = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[role.seat], 'headClick'); //头像点击开启
                if(clickNode)
                    clickNode.getComponent(cc.Button).interactable = true;
            }
        }
    },
    findPlayerDataBySeatIndex: function(index){
        if(this.m_oDeskData){
            for(var i = 0; i < this.m_oDeskData.rolesList.length; i++){
                var role = this.m_oDeskData.rolesList[i];
                if(role && role.seat == index)
                    return role;
            }
        }
    },

    showPlayerInfo: function(pos, roleData){
        this.m_oPlayerInfo.opacity = 0;
        this.m_oPlayerInfo.active = true;
        this.m_oPlayerInfo.getChildByName('name').getComponent(cc.Label).string = roleData.name;
        if(roleData.userId == cc.dd.user.id){
            this.m_oPlayerInfo.getChildByName('id').getComponent(cc.Label).string = roleData.userId;
        }else{
            this.m_oPlayerInfo.getChildByName('id').getComponent(cc.Label).string = '';
        }
        cc.find('bg/dss_paihangbang_tk_di02', this.m_oPlayerInfo).active = roleData.userId == cc.dd.user.id;
        this.m_oPlayerInfo.setPosition(pos);
        this.m_oPlayerInfo.stopAllActions();
        this.m_oPlayerInfo.runAction(cc.sequence(cc.fadeIn(0.8), cc.delayTime(1), cc.fadeOut(0.8), cc.callFunc(function(){
            this.m_oPlayerInfo.active = false;
        }.bind(this))));
    },

    onClickHead: function(event, data){
        var seat = parseInt(data);
        var roleData = this.findPlayerDataBySeatIndex(seat);
        if(roleData){
            var pos = event.target.parent.convertToWorldSpaceAR(event.target.getPosition());
            pos = this.node.convertToNodeSpaceAR(pos);
            if(seat == 0 || seat == 3)
                pos.y = pos.y + 77;
            else
                pos.y = pos.y - 77;
            this.showPlayerInfo(pos, roleData);
        }
    },

    onClickEnter: function(event, data){
        var seat = parseInt(data);
        var deskId = this.node._tag;
        var data = gFishMgr.getRoomItem();
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(data.gameid);
        msg.setRoomId(data.roomid);
        msg.setSeat(seat);
        msg.setDeskId(deskId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    onEventMessage: function (event, data) {
        switch(event){
            case playerEvent.FISH_DESK_UPDATE:
                if((data.opType == 1 && data._tag == this.node._tag) || (data.opType == 2 && this.m_oDeskData && this.m_oDeskData.roomId == data.roomId)){
                    var deskData = playerManager.findDeskInfoByRoomId(data.roomId);
                    if(deskData)
                        this.updateDeskNodeInfo(deskData);
                }
                break;
        }
    },
});
