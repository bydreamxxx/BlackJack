var hall_audio_mgr = require('hall_audio_mgr');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var hall_prefab = require('hall_prefab_cfg');
const game_room = require('game_room');
var gSlotMgr = require('SlotManger').SlotManger.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        sprite_frames: [cc.SpriteFrame],
    },

    onLoad() {

    },

    updateUI(data) {
        cc.find("title", this.node).getComponent(cc.Label).string = "上梁山"; //todo 游戏名称
        let item = cc.find("item", this.node);
        let content = cc.find("game_list/view/content", this.node);
        content.removeAllChildren(true);
        // todo 房间item刷新
        data.roomlistList.forEach(function (data_item) {
            let node_item = cc.instantiate(item);
            node_item.active = true;
            node_item.parent = content;
            let icon = cc.find("icon", node_item).getComponent(cc.Sprite);
            let desc = cc.find("desc", node_item).getComponent(cc.Label);
            let name = cc.find("name", node_item).getComponent(cc.Label);

            var game_item = game_room.getItem(function (itemdata) {
                if (itemdata.gameid == data.hallGameid && itemdata.roomid == data_item.fangjianid)
                    return itemdata;
            });
            icon.spriteFrame = this.sprite_frames[game_item.roomid - 1];
            desc.string = game_item.desc;
            name.string = game_item.basescore;
            node_item.tagname = game_item.key;
        }.bind(this));
    },

    onClickRoom(event, custom) {
        hall_audio_mgr.Instance().com_btn_click();
        this.roomItem = game_room.getItem(function (itemdata) {
            if (itemdata.key == event.target.tagname)
                return itemdata;
        });
        var coin = HallPropData.getCoin();
        if ((coin >= this.roomItem.entermin && coin <= this.roomItem.entermax)) {
            // event.target.tag 配置表id
            // todo 请求进入游戏
            gSlotMgr.enterGame(this.roomItem.gameid, this.roomItem.roomid);
        } else {
            if (coin < this.roomItem.entermin) {
                if (this.roomItem.entermin === 0) {
                    // event.target.tag 配置表id
                    // todo 请求进入游戏
                } else {
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
                        var jiuji = ui.getComponent('klb_hall_jiuji');
                        if (jiuji != null) {
                            jiuji.update_buy_list(this.roomItem.bet_min);
                        }
                    }.bind(this));
                }
            } else if (coin > this.roomItem.entermax) {
                if (this.roomItem.entermax === 0) {
                    // event.target.tag 配置表id
                    // todo 请求进入游戏
                    gSlotMgr.enterGame(this.roomItem.gameid, this.roomItem.roomid);
                } else {
                    cc.dd.PromptBoxUtil.show("coinTooMuch");
                }
            }
        }
    },

    onClickBtnClose() {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
        cc.dd.UIMgr.openUI("blackjack_hall/prefabs/hall_xiaociji");
    },

    onClickBackHall() {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
        cc.dd.UIMgr.destroyUI("blackjack_hall/prefabs/hall_xiaociji");
    },

});