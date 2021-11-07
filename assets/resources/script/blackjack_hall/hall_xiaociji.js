var hall_audio_mgr = require('hall_audio_mgr');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var hall_prefab = require('hall_prefab_cfg');
var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
var gSlotMgr = require('SlotManger').SlotManger.Instance();
let UpdaterEntrance = require("Updater").UpdaterEntrance;

cc.Class({
    extends: cc.Component,

    properties: {
        sprite_frames:[cc.SpriteFrame],
    },

    onLoad () {
        this.updater_entrance = UpdaterEntrance.COIN;
        let item = cc.find("item",this.node);
        let content = cc.find("game_list/view/content",this.node);
        let data_xiaociji = require("xiaociji");
        data_xiaociji.items.forEach(function (data_item) {
            let node_item = cc.instantiate(item);
            node_item.active = true;
            node_item.parent = content;
            let icon = cc.find("icon",node_item).getComponent(cc.Sprite);
            let desc = cc.find("desc_bg/desc",node_item).getComponent(cc.Label);
            let download = cc.find("download",node_item);
            icon.spriteFrame = this.sprite_frames[data_item.type];
            desc.string = data_item.desc;
            download.active = false;
            node_item.tagname = data_item.key;

            let com_game_download = node_item.getComponentInChildren('com_game_update');
            com_game_download.updater_entrance = this.updater_entrance;
            com_game_download.node.active = true;
            com_game_download.updateUI(false);
        }.bind(this));

        // cc.dd.UpdaterED.addObserver(this);
    },

    onDestroy(){
        // cc.dd.UpdaterED.removeObserver(this);
    },

    start () {

    },

    onClickGame(event,custom){
        hall_audio_mgr.Instance().com_btn_click();
        var key = event.target.tagname;
        let data_xiaociji = require("xiaociji");
        this.roomItem = data_xiaociji.getItem(function(item){
            if(item.key == key)
                return item;
        });

        this.updater = UpdateMgr.getUpdater(this.roomItem.game_id);
        if(cc.sys.isNative && this.updater){
            if(this.updater.updateing){
                cc.dd.PromptBoxUtil.show('游戏正在下载中,请稍等!');
                return;
            }
            if(this.updater.checking){
                cc.log("正在检测更新中");
                return;
            }
            //设置游戏更新完成回调,游戏更新id
            let com_game_download = event.target.getComponentInChildren('com_game_update');
            com_game_download.updater_entrance = this.updater_entrance;
            com_game_download.setUpdateFinishCallback(this.enterRoomList.bind(this));
            com_game_download.setGameId(this.roomItem.game_id);
            this.updater.checkUpdate(this.updater_entrance);
        }else{
            this.enterRoomList();
        }
    },

    enterRoomList(){
        var coin = HallPropData.getCoin();
        if(this.roomItem.entermin==-1 || this.roomItem.entermax==-1){
            gSlotMgr.enterGame(this.roomItem.game_id, 0);

            // cc.dd.NetWaitUtil.show('正在请求数据');
            // var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
            // protoNewRoomList.setHallGameid(this.roomItem.game_id);
            // cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list , protoNewRoomList,
            //     '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[小刺激获取房间列表]',true);
        }
        else if ((coin >= this.roomItem.entermin && coin <= this.roomItem.entermax)) {
            gSlotMgr.enterGame(this.roomItem.game_id, 0);

            // event.target.tag 配置表id
            // todo 请求游戏房间列表信息
            // cc.dd.NetWaitUtil.show('正在请求数据');
            // var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
            // protoNewRoomList.setHallGameid(this.roomItem.game_id);
            // cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list , protoNewRoomList,
            //     '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[小刺激获取房间列表]',true);
        } else {
            if (coin < this.roomItem.entermin) {
                if (this.roomItem.entermin === 0) {
                    // event.target.tag 配置表id
                    // todo 请求游戏房间列表信息
                } else {
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
                        var jiuji = ui.getComponent('klb_hall_jiuji');
                        if (jiuji != null) {
                            jiuji.update_buy_list(this.roomItem.entermin);
                        }
                    }.bind(this));
                }
            } else if (coin > this.roomItem.entermax) {
                if (this.roomItem.entermax === -1) {
                    gSlotMgr.enterGame(this.roomItem.game_id, 0);

                    // event.target.tag 配置表id
                    // todo 请求游戏房间列表信息
                    // cc.dd.NetWaitUtil.show('正在请求数据');
                    // var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
                    // protoNewRoomList.setHallGameid(this.roomItem.game_id);
                    // cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list , protoNewRoomList,
                    //     '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[小刺激获取房间列表]',true);

                } else {
                    cc.dd.PromptBoxUtil.show("coinTooMuch");
                }
            }
        }
    },

    onClickBtnClose() {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

});
