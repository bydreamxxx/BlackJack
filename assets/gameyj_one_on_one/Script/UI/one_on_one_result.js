// create by wj 2019/02/28
var PK_MgrObj = require('pk_data_mgr');
var PK_MgrData = PK_MgrObj.PK_Data_Mgr.Instance();
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerHead: {default: [], type: cc.Node},
    },

    onLoad : function() {

    },

    showResult: function(dataList){//设置界面数据
        for(var i = 0; i < dataList.length; i++){
            var data = dataList[i];//单独的玩家数据
            this.m_tPlayerHead[data.rank - 1].active = true;

            var headNode = cc.dd.Utils.seekNodeByName(this.m_tPlayerHead[data.rank - 1], 'head'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(data.openId, data.headUrl, 'one_on_one_head_init');
            headNode.getChildByName('headsp').active = true;

            var nameTxt = cc.dd.Utils.seekNodeByName(this.m_tPlayerHead[data.rank - 1], 'name').getComponent(cc.Label);//名字
            nameTxt.string = data.name;

            var coinTxt = cc.dd.Utils.seekNodeByName(this.m_tPlayerHead[data.rank - 1], 'winnum').getComponent(cc.Label);//金币
            coinTxt.string = data.coin;
        }
        setTimeout(function(){
            this.close();
        }.bind(this), 3000);
    },

           //显示玩家信息
    onClickShowUserInfo: function (event, data) {
        // let player = PK_MgrData.getPlayerById(event.target.tag);
        // if (!player) {
        //     return;
        // }

        // var jlmj_prefab = require('jlmj_prefab_cfg');

        // cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
        //     var user_info = ui.getComponent('user_info_view');
        //     var roomId = RoomMgr.Instance().roomId;

        //     user_info.setData(103, roomId, null, false, player);
        //     user_info.show();
        // }.bind(this));
    },

    close: function(){
        cc.dd.UIMgr.destroyUI(this.node);
    },

});
