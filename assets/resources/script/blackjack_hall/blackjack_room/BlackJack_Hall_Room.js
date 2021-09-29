// create by wj
const dd = cc.dd;
var hall_prefab = require('hall_prefab_cfg');
var klb_game_list_config = require('klb_gameList');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var HallCommonData = require("hall_common_data").HallCommonData;
var Define = require("Define");

cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: cc.Node,
        game_name: '',
        game_id: '',
        itemList: [],

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // Hall.HallED.addObserver(this);
        // HallCommonEd.addObserver(this);
    },

    start () {

    },

    onDestroy: function () {
        // Hall.HallED.removeObserver(this);
        // HallCommonEd.removeObserver(this);
    },

    /**
     * 初始化房间列表
     */
     initRomUI: function (data) {
         for(let i = 0; i < this.itemList.length; i++){
            if (this.itemList[i]) {  //清理界面数据
                this.itemList[i].removeFromParent();
                this.itemList[i].destroy();
            }
         }
         this.itemList.splice(0, this.itemList.length); //清理数据
         this.contentNode.removeAllChildren(true); //清空节点

         klb_game_list_config.items.forEach(function (gameItem) { //读取配置
            if (gameItem.gameid == data.hallGameid) {
                //this.titleSp.string = gameItem.name;
                this.game_name = gameItem.name;
                this.game_id = gameItem.gameid;
            }
        }.bind(this));

        cc.dd.ResLoader.loadPrefab("blackjack_hall/prefabs/blackjack/room/BlackJack_Common_Room_Item", function (prefab) { //加载房间数据
            for (var i = 0; i < data.roomlistList.length; i++) {
                var dataInfo = data.roomlistList[i];

                if (dataInfo) {
                    var item = cc.instantiate(prefab);
                    item.tagname = i + 1;
                    this.itemList.push(item);
                    item.parent = this.contentNode;
                    item.getComponent('BlackJack_Hall_RoomItem').init(dataInfo, data.hallGameid, this.onClickCallBack.bind(this));
                }
            }
        }.bind(this))
     },

    //关闭界面
    closeUICallBack: function () {
        hall_audio_mgr.com_btn_click();

        this.node.removeFromParent();
        this.onDestroy();
        var scene = cc.director.getScene();
        let hallscene = scene.getChildByName('Canvas').getComponent('klb_hallScene');
        if (hallscene) {
            hallscene.updateActiveTip();
        }
    },

    /**
     * 创建   加入    比赛按钮回调
     * @param event
     * @param data
     */
    roomBtnCallBack: function (event, data) {
        cc.dd.PromptBoxUtil.show('暂未开放，敬请期待');
        return;
        // var gameid = this.game_id;
        // var game = klb_game_list_config.getItem(function (item) {
        //     return item.gameid == gameid;
        // });
        // var createGameInfo = klb_game_list_config.getItem(function (itemInfo) {
        //     return itemInfo.gameid == game.connect_f_id;
        // })
        // hall_audio_mgr.com_btn_click();
        // if (createGameInfo && createGameInfo.isopen == 0) {
        //     cc.dd.PromptBoxUtil.show('暂未开放，敬请期待');
        //     return;
        // }
        // switch (data) {
        //     case 'C_ROOM':
        //         this.creatRoomNode.active = true
        //         var Component = this.creatRoomNode.getComponent("klb_hall_CreateRoom");
        //         Component.showGameList(game.connect_f_id)
        //         var ani = this.creatRoomNode.getChildByName('actionnode').getComponent(cc.Animation);
        //         ani.play('klb_hall_createRoom');
        //         break;
        //     case 'J_ROOM'://进入房间
        //         this.joinRoomNode.active = true
        //         var ani = this.joinRoomNode.getChildByName('action_node').getComponent(cc.Animation);
        //         ani.play('klb_hall_JoinRoom');
        //         break;
        // };
    },

    /**
     * 打开规则界面
     */
    openSelectGameRule: function () {
        var self = this;
        var gameData = klb_game_list_config.getItem(function (item) {
            if (item.gameid == self.game_id)
                return item;
        })

        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_RULE, function (ui) {
            var itemData = {
                _game_id: gameData.gameid,
            }
            var cpt = ui.getComponent('klb_hall_Rule');
            cpt.clickTagCallBack(itemData);
            //cpt.InitGameList();

        }.bind(this));
    },

    /**
     * 选中游戏消息回调
     */
    onClickCallBack: function(clickId){
        for(var i = 0; i < this.itemList.length; i++){
            this.itemList[i].getComponent('BlackJack_Hall_RoomItem').setSelect(false);

            if(this.itemList[i].tagname == clickId){
                this.itemList[i].getComponent('BlackJack_Hall_RoomItem').setSelect(true);
                this.selectItem = this.itemList[i].getComponent('BlackJack_Hall_RoomItem');
            }
        }
    },

    /**
     * 点击进入游戏
     */
    onClickEnterGame: function(){
        this.selectItem.onClickEnterGame()
    },
});
