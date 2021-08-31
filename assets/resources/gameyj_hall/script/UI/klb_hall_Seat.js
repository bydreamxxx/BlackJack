let TABLE_TYPE = require('klb_friend_group_enum').TABLE_TYPE;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');
let GetGameRules = require('GetGameRules');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var hallData = require('hall_common_data').HallCommonData;
var hall_prefab = require('hall_prefab_cfg');

const max_table_num = 20;

const game2Idx = {
    [cc.dd.Define.GameType.SH_GOLD]: 0,  //0:梭哈
}

cc.Class({
    extends: cc.Component,

    properties: {
        gameName: cc.Label,         //游戏名
        headSp: cc.Sprite,          //头像
        nickLbl: cc.Label,          //昵称
        coinLbl: cc.Label,          //金币
        roomNameLbl: cc.Label,      //房间名
        basescoreLbl: cc.Label,     //底分
        tablePrefabs: [cc.Prefab],
        leftArrow: {
            default: null,
            type: cc.Node,
            tooltip: "左箭头"
        },
        rightArrow: {
            default: null,
            type: cc.Node,
            tooltip: "右箭头"
        },
        content_node: cc.Node,
        scrollView: cc.ScrollView,

        userContent: cc.Node,
        userItem: cc.Node,
        detail_node: cc.Node,
        detail_basescore: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosX = 0;

        this.tableList = [];
        this.toggleList = [];

        this.leftArrow.active = false;
        this.rightArrow.active = true;
    },

    onDestroy() {
    },


    //事件处理
    onEventMessage(event, data) {

    },

    initBaseInfo(room) {
        this._roomInfo = room;
        this.gameName.string = room.game_name;
        this.roomNameLbl.string = room.titel;
        this.basescoreLbl.string = '' + room.basescore;
        this.detail_basescore.string = '底分:' + room.basescore;
        this.coinLbl.string = this.changeNumToCHN(HallPropData.getCoin()) || '0';
        var userInfo = hallData.getInstance();
        cc.dd.SysTools.loadWxheadH5(this.headSp, userInfo.headUrl);
        this.nickLbl.string = cc.dd.Utils.subChineseStr(userInfo.nick, 0, 10);
    },

    //初始化所有桌子
    onTablesMsg(msg) {
        //补齐漏掉的桌子
        var idxList = [];
        for (var i = 0; i < msg.length; i++) {
            idxList.push(msg[i].argsList[0]);
        }
        var cur = 0;
        for (var i = 0; i < idxList.length; i++) {
            if (++cur == idxList[i])
                continue;
            for (var j = idxList[i] - 1; j >= cur; j--) {
                msg.splice(cur - 1, 0, { rolesList: [], argsList: [j] });
            }
            cur = idxList[i];
        }
        //补齐不足指定张数的桌子
        if (msg.length < max_table_num) {
            for (var i = msg.length; i < max_table_num; i++) {
                var room = { rolesList: [], argsList: [i + 1] };
                msg.push(room);
            }
        }
        this.initTableList(msg);
    },

    //更新某张桌子
    onDeskMsg(data) {
        var idx = data._tag - 1;
        if (idx < this.tableList.length) {
            if (data.opType == 1) {//加入玩家
                var exist = false;
                for (var i = 0; i < this.tableList[idx].rolesList.length; i++) {
                    var role = this.tableList[idx].rolesList[i];
                    if (role.seat == data.role.seat) {
                        exist = true;
                        this.tableList[idx].rolesList.splice(i, 1, data.role);//替换同座位号玩家
                        break;
                    }
                }
                if (!exist)
                    this.tableList[idx].rolesList.push(data.role); //新增玩家
            } else if (data.opType == 2) {//玩家离开
                for (var i = 0; i < this.tableList[idx].rolesList.length; i++) {
                    var role = this.tableList[idx].rolesList[i];
                    if (role.userId == data.role.userId) {
                        this.tableList[idx].rolesList.splice(i, 1);
                        break;
                    }
                }
            }
            this.updateTable(idx);
        }
    },

    /**
     * 初始化桌子列表
     */
    initTableList: function (data) {

        var gameid = this._roomInfo.gameid;
        var itemPrefab = this.tablePrefabs[game2Idx[gameid]];
        switch (gameid) {
            case cc.dd.Define.GameType.SH_GOLD:
                this.startX = 40;
                this.startY = 0;
                this.spaceX = 40;
                this.spaceY = 50;
                this.spawnCount = 8;//显示几个
                this.col = 2;//每列几个
                break;
        }

        this.lastContentPosX = 0;

        this.item_width = itemPrefab.data.width;
        let item_height = itemPrefab.data.height
        //this.bufferZone = this.scrollView.node.width / 2 + this.item_width / 2 * 3
        this.bufferZone = this.scrollView.node.width / 2 + this.item_width / 2 + this.spaceX;

        this.tableList = data;
        this.toggleList = [];
        this.content_node.removeAllChildren();
        let height = this.content_node.height;
        let j = 0;
        let k = 0;

        let tableNum = this.tableList.length;
        if (tableNum > this.spawnCount) {
            tableNum = this.spawnCount;
        }
        for (let i = 0; i < tableNum; i++) {
            j = Math.floor(i / this.col);
            k = i % this.col;
            var item = cc.instantiate(itemPrefab);
            item.getComponent('klb_hall_Seat_Table').updateChairs();
            item.getComponent('klb_hall_Seat_Table').updateTableInfo(i, this.tableList[i], this._roomInfo, this.isOpen);
            let chairs = item.getComponent('klb_hall_Seat_Table').getHeads();
            item.index = i;
            this.content_node.addChild(item);

            let toggle = item.getComponent(cc.Toggle);
            toggle.idx = this.toggleList.length;
            this.toggleList.push({ idx: -1, toggle: toggle });
            for (let j = 0; j < chairs.length; j++) {
                let toggle = chairs[j];
                toggle.idx = this.toggleList.length;
                this.toggleList.push({ idx: j, toggle: toggle });
            }

            item.y = height / 2 - this.startY - item_height / 2 - (this.spaceY + item_height) * k;
            item.x = this.startX + this.item_width / 2 + (this.item_width + this.spaceX) * j;
        }

        let count = Math.ceil(this.tableList.length / this.col)
        this.content_node.width = this.startX + this.item_width * count + this.spaceX * count;
    },

    // // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    // // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update: function (dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.content_node.children;
        // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
        let isRight = this.scrollView.content.x > this.lastContentPosX;
        // 实际创建项占了多高（即它们的高度累加）
        let count = Math.ceil(items.length / this.col);
        let offset = this.item_width * count + this.spaceX * count;
        let newX = 0;

        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isRight) {
                // 提前计算出该item的新的y坐标
                newX = items[i].x - offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.x > this.bufferZone && newX > 0) {
                    items[i].x = newX;
                    var itemId = items[i].index - items.length; // update item id
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('klb_hall_Seat_Table').updateTableInfo(itemId, this.tableList[itemId], this._roomInfo, this.isOpen);
                    items[i].index = itemId;
                    items[i].active = true;
                }
            } else {
                // 提前计算出该item的新的y坐标
                newX = items[i].x + offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.x < -this.bufferZone && newX < this.content_node.width) {
                    items[i].x = newX;
                    // let item = items[i].getComponent('Item');
                    var itemId = items[i].index + items.length;
                    // this.updateItem(items[i], itemId);
                    if (itemId < this.tableList.length)
                        items[i].getComponent('klb_hall_Seat_Table').updateTableInfo(itemId, this.tableList[itemId], this._roomInfo, this.isOpen);
                    else
                        items[i].active = false;
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosX和总项数显示
        this.lastContentPosX = this.scrollView.content.x;
    },

    scrollEvent: function (sender, event) {
        switch (event) {
            case 0:
                // cc.error("Scroll to Top");
                break;
            case 1:
                // cc.error("Scroll to Bottom");
                break;
            case 2:
                // cc.error("Scroll to Left");
                this.leftEnd = true;
                break;
            case 3:
                // cc.error("Scroll to Right");
                this.rightEnd = true;
                break;
            case 4:
                // cc.error("Scrolling");
                this.leftArrow.active = true;
                this.rightArrow.active = true;
                break;
            case 5:
                // cc.error("Bounce Top");
                break;
            case 6:
                // cc.error("Bounce bottom");
                break;
            case 7:
                // cc.error("Bounce left");
                this.leftEnd = true;
                break;
            case 8:
                // cc.error("Bounce right");
                this.rightEnd = true;
                break;
            case 9:
                // cc.error("Auto scroll ended");
                if (this.leftEnd) {
                    this.leftArrow.active = false;
                }
                if (this.rightEnd) {
                    this.rightArrow.active = false;
                }
                this.leftEnd = false;
                this.rightEnd = false;
                break;
        }
    },

    onClickLeft() {
        let percent = Math.floor(this.scrollView.getScrollOffset().x) / Math.floor(this.scrollView.getMaxScrollOffset().x);
        cc.log(percent);
        this.scrollView.scrollToPercentHorizontal(Math.abs(percent) - 0.3, 0.2);
        percent = Math.floor(this.scrollView.getScrollOffset().x) / Math.floor(this.scrollView.getMaxScrollOffset().x);
        cc.log(percent);
    },

    onClickRight() {
        let percent = Math.floor(this.scrollView.getScrollOffset().x) / Math.floor(this.scrollView.getMaxScrollOffset().x);
        cc.log(percent);
        this.scrollView.scrollToPercentHorizontal(Math.abs(percent) + 0.3, 0.2);
        percent = Math.floor(this.scrollView.getScrollOffset().x) / Math.floor(this.scrollView.getMaxScrollOffset().x);
        cc.log(percent);
    },

    updateTable(index) {
        let items = this.content_node.children;
        for (let i = 0; i < items.length; ++i) {
            if (items[i].index == index) {
                items[i].getComponent('klb_hall_Seat_Table').updateTableInfo(index, this.tableList[index], this._roomInfo, this.isOpen);
                break;
            }
        }
    },

    onClickClearHead() {
        for (let j = 0; j < this.toggleList.length; j++) {
            if (this.toggleList[j].toggle.isChecked) {
                let name = this.toggleList[j].toggle.node.name;
                if (name == 'headNode') {
                    let table = this.toggleList[j].toggle.node.parent.parent;
                    let worldPos = this.toggleList[j].toggle.node.parent.convertToWorldSpaceAR(this.toggleList[j].toggle.node.position);
                    let viewPos = table.convertToNodeSpaceAR(worldPos);
                    let _movePos = table.getComponent('klb_hall_Seat_Table').movePos;
                    let _target = table.getComponent('klb_hall_Seat_Table').kickOutNodes[this.toggleList[j].idx];
                    this.headNodeUnChecked(_target, _movePos, viewPos);
                } else {
                    let table = this.toggleList[j].toggle.node;
                    let _target = table.getComponent('klb_hall_Seat_Table').buttonNode;
                    this.tableUnChecked(_target);
                }
            }
            this.toggleList[j].toggle.isChecked = false;
        }
    },

    headNodeChecked(target, movePos, viewPos) {
        target.active = true;
        // target.stopAllActions();
        cc.Tween.stopAll();
        target.setPosition(viewPos);
        // target.runAction(
        //     cc.sequence(
        //         cc.callFunc(() => {
        //             let buttons = target.getComponentsInChildren(cc.Button);
        //             for (let i = 0; i < buttons.length; i++) {
        //                 buttons.enabled = false;
        //             }
        //         }),
        //         cc.moveTo(0.1, movePos).easing(cc.easeSineIn()),
        //         cc.callFunc(() => {
        //             let buttons = target.getComponentsInChildren(cc.Button);
        //             for (let i = 0; i < buttons.length; i++) {
        //                 buttons.enabled = true;
        //             }
        //         }),
        //     ));

        cc.tween(target)
            .call(() => {
                let buttons = target.getComponentsInChildren(cc.Button);
                for (let i = 0; i < buttons.length; i++) {
                    buttons.enabled = false;
                }
            })
            .to(0.1, { position: movePos }, { easing: 'sineIn' })
            .call(() => {
                let buttons = target.getComponentsInChildren(cc.Button);
                for (let i = 0; i < buttons.length; i++) {
                    buttons.enabled = true;
                }
            })
            .start();
    },

    headNodeUnChecked(target, movePos, viewPos) {
        target.active = true;
        // target.stopAllActions();
        cc.Tween.stopAll();
        target.setPosition(movePos);
        // target.runAction(
        //     cc.sequence(
        //         cc.callFunc(() => {
        //             let buttons = target.getComponentsInChildren(cc.Button);
        //             for (let i = 0; i < buttons.length; i++) {
        //                 buttons.enabled = false;
        //             }
        //         }),
        //         cc.moveTo(0.1, viewPos).easing(cc.easeSineOut()),
        //         cc.callFunc(() => {
        //             target.active = false;
        //         }),
        //     ));
        cc.tween(target)
            .call(() => {
                let buttons = target.getComponentsInChildren(cc.Button);
                for (let i = 0; i < buttons.length; i++) {
                    buttons.enabled = false;
                }
            })
            .to(0.1, { position: viewPos }, { easing: 'sineOut' })
            .call(() => {
                target.active = false;
            })
            .start();
    },

    tableChecked(target) {
        target.active = true;
        // target.stopAllActions();
        cc.Tween.stopAll();
        target.scaleX = 0;
        // target.runAction(cc.scaleTo(0.1, 1));
        cc.tween(target)
            .to(0.1, { scale: 1 })
            .start();
    },

    tableUnChecked(target) {
        target.active = true;
        // target.stopAllActions();
        cc.Tween.stopAll();
        target.scaleX = 1;
        // target.runAction(
        //     cc.sequence(
        //         cc.callFunc(() => {
        //             let buttons = target.getComponentsInChildren(cc.Button);
        //             for (let i = 0; i < buttons.length; i++) {
        //                 buttons.enabled = false;
        //             }
        //         }),
        //         cc.scaleTo(0.1, 0, 1),
        //         cc.callFunc(() => {
        //             target.active = false;
        //         })
        //     ));
        cc.tween(target)
            .call(() => {
                let buttons = target.getComponentsInChildren(cc.Button);
                for (let i = 0; i < buttons.length; i++) {
                    buttons.enabled = false;
                }
            })
            .to(0.1, { scale: cc.v2(0, 1) })
            .call(() => {
                target.active = false;
            })
            .start();
    },

    onClickCheckToggleBtn(toggle, movePos, viewPos, target) {
        hall_audio_mgr.com_btn_click();

        let name = toggle.node.name;

        if (name == 'headNode') {
            if (toggle.isChecked) {
                this.headNodeChecked(target, movePos, viewPos);
            } else {
                this.headNodeUnChecked(target, movePos, viewPos);
            }
        } else {
            if (toggle.isChecked) {
                this.tableChecked(target);
            } else {
                this.tableUnChecked(target);
            }
        }

        for (let j = 0; j < this.toggleList.length; j++) {
            if (toggle.idx != this.toggleList[j].toggle.idx) {
                if (this.toggleList[j].toggle.isChecked) {
                    let name = this.toggleList[j].toggle.node.name;
                    if (name == 'headNode') {
                        let table = this.toggleList[j].toggle.node.parent.parent;
                        let worldPos = this.toggleList[j].toggle.node.parent.convertToWorldSpaceAR(this.toggleList[j].toggle.node.position);
                        let viewPos = table.convertToNodeSpaceAR(worldPos);
                        let _movePos = table.getComponent('klb_hall_Seat_Table').movePos;
                        let _target = table.getComponent('klb_hall_Seat_Table').kickOutNodes[this.toggleList[j].idx];
                        this.headNodeUnChecked(_target, _movePos, viewPos);
                    } else {
                        let table = this.toggleList[j].toggle.node;
                        let _target = table.getComponent('klb_hall_Seat_Table').buttonNode;
                        this.tableUnChecked(_target);
                    }
                }
                this.toggleList[j].toggle.isChecked = false;
            }
        }
    },

    onClickBack() {
        hall_audio_mgr.com_btn_click();
        this.node.destroy();
    },

    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 100000000) {
            str = (num / 100000000.00).toFixed(1) + '亿';
        } else if (num >= 10000000) {
            str = (num / 10000000.00).toFixed(1) + '千万';
        } else if (num >= 100000) {
            str = (num / 10000.00).toFixed(1) + '万';
        } else {
            str = num;
        }
        return str;
    },

    //关闭玩家界面
    onClickCloseDetail() {
        hall_audio_mgr.com_btn_click();
        this.detail_node.active = false;
        this.userContent.removeAllChildren();
    },

    //显示桌子详情
    showDetail(data) {
        this._joinRoomId = data.argsList[0];
        this.userContent.removeAllChildren();
        this.detail_node.active = true;
        for (var i = 0; i < data.rolesList.length; i++) {
            var user = data.rolesList[i];
            var item = cc.instantiate(this.userItem);
            cc.dd.SysTools.loadWxheadH5(cc.find('headNode/headSp', item).getComponent(cc.Sprite), cc.dd.Utils.getWX64Url(user.headUrl));
            cc.find('nick', item).getComponent(cc.Label).string = cc.dd.Utils.subChineseStr(user.name, 0, 10);
            cc.find('coin/num', item).getComponent(cc.Label).string = '' + user.coin;
            item.active = true;
            this.userContent.addChild(item);
        }
    },

    //进入房间
    onClickEnter(event, custom) {
        hall_audio_mgr.com_btn_click();

        var gameid = this._roomInfo.gameid;
        var roomid = this._roomInfo.roomid;
        var deskid = this._joinRoomId;

        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(gameid);
        msg.setRoomId(roomid);
        msg.setDeskId(deskid);
        msg.setLookPlayer(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    //玩家头像点击
    userBtnCallBack(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (cc._useChifengUI || cc._useCardUI) {
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_USERINFO);
        } else {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_USERINFO, function (ui) {
                ui.getComponent('klb_hall_user_info').setData(hallData.getInstance());
            }.bind(this));
        }
    },
});
