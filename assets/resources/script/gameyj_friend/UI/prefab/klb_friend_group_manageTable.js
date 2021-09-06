var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
let prefab_config = require('klb_friend_group_prefab_cfg');

let MEMBER = require('klb_friend_group_enum').MEMBER;

let GetGameRules = require('GetGameRules');

cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Label,
        prefabItem:{
            default: null,
            type: cc.Prefab,
            tooltip: "成员组件"
        },
        content_node: cc.Node,
        scrollView: cc.ScrollView,
        score: cc.Label,
        watchButton: cc.Node,
        joinButton: cc.Node,
        dissolveButton: cc.Node,
    },

    onLoad: function () {
        this.startX = 7.95;
        this.startY = 5;
        this.spaceX = 12;
        this.spaceY = 12;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.spawnCount = 18;//显示几个
        this.row = 3;//每行几个
        this.item_height = this.prefabItem.data.height;
        this.bufferZone = this.scrollView.node.height / 2 + this.item_height / 2 * 3;//边界线
        this.playerList = [];
    },


    close: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    updatePlayerList(idx, tableInfo){
        if(this.idx != idx){
            return
        }

        this.tableInfo = tableInfo;
        if(!this.tableInfo){
            cc.dd.UIMgr.destroyUI(this.node);
            return;
        }

        this.watchButton.active = this.tableInfo.state != 0 && this.canView;
        this.joinButton.active = this.tableInfo.state == 0 || this.canEnter;
        // if(cc.dd.CheckGames.isMJ(this.tableInfo.gameType)){
        //     this.dissolveButton.active = cc.dd.user.clubJob != MEMBER.NORMAL;
        // }else{
        //     this.dissolveButton.active = this.tableInfo.state == 0;
        //
        //     if(this.tableInfo.gameType == 108){
        //         this.dissolveButton.active = true;
        //     }
        // }
        this.dissolveButton.active = cc.dd.user.clubJob != MEMBER.NORMAL;

        if(this.tableInfo.juNum != -1){

            let jushu = GetGameRules.getJuShu(this._rule, this.tableInfo.gameType);

            this.score.string = (this.tableInfo.state == 0 ? '未开局' : '已开局') + '    ' + jushu[1] + '：' + (this.tableInfo.curJuNum + '/'+ this.tableInfo.juNum) + '    房号：'+this.tableInfo.roomId;
        }else{
            this.score.string = (this.tableInfo.state == 0 ? '未开局' : '已开局') + '    房号：'+this.tableInfo.roomId;
        }

        let data = this.tableInfo.membersList.slice();

        data.sort((a, b)=>{
            if(a.job == MEMBER.OWNER){
                return -1;
            }else{
                if(a.job == MEMBER.NORMAL){
                    if(b.job == MEMBER.NORMAL){
                        return a.joinTime - b.joinTime;
                    }else{
                        return 1;
                    }
                }else{
                    if(b.job == MEMBER.OWNER){
                        return 1;
                    }else if(b.job == MEMBER.NORMAL){
                        return -1;
                    }else{
                        return a.joinTime - b.joinTime;
                    }
                }
            }
        })

        this.playerList = data;
        this.content_node.removeAllChildren();
        let j = 0;
        let k = 0;

        let playerNum = this.playerList.length
        if(playerNum > this.spawnCount){
            playerNum = this.spawnCount;
        }
        for (let i = 0; i < playerNum; i++) {
            j = Math.floor(i / this.row);
            k = i % this.row;
            var item = cc.instantiate(this.prefabItem);
            item.getComponent('klb_friend_group_manageTableItem').initPlayerInfo(this.clubId, this.playerList[i], this.wanfa, this.idx, this.tableInfo.roomId, this.tableInfo.gameType, this.tableInfo.state == 0);
            item.index = i;
            this.content_node.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k)-this.startX;
            item.y = -this.startY - this.item_height / 2 - (this.item_height + this.spaceY) * j;
        }

        let count = Math.ceil(this.playerList.length / this.row)
        this.content_node.height = this.startY + this.item_height * count + this.spaceY * count;
    },

    /**
     * 初始化申请列表
     */
    initPlayerList: function(clubId, wanfa, idx, tableInfo, rule){
        this.clubId = clubId;
        this.wanfa = wanfa;
        this.idx = idx;
        this.tableInfo = tableInfo;
        this.canView = rule.rulePublic ? rule.rulePublic.isCanView : false;
        this.canEnter = rule.rulePublic ? rule.rulePublic.isCanEnter : false;

        if(this.tableInfo.gameType == 108){//百人牛牛疯狂拼十
            this.canEnter = true;
        }

        for (var attr in rule.rule) {
            if (attr.endsWith('ule') || attr.endsWith('uleNew')) {
                this._rule = rule.rule[attr];
                break;
            }
        }

        this.watchButton.active = this.tableInfo.state != 0 && this.canView;
        this.joinButton.active = this.tableInfo.state == 0 || this.canEnter;
        // if(cc.dd.CheckGames.isMJ(this.tableInfo.gameType)){
        //     this.dissolveButton.active = cc.dd.user.clubJob != MEMBER.NORMAL;
        // }else{
        //     this.dissolveButton.active = this.tableInfo.state == 0;
        //
        //     if(this.tableInfo.gameType == 108){
        //         this.dissolveButton.active = true;
        //     }
        // }
        this.dissolveButton.active = cc.dd.user.clubJob != MEMBER.NORMAL;


        if(this.tableInfo.juNum != -1){
            let jushu = GetGameRules.getJuShu(this._rule, this.tableInfo.gameType);

            this.score.string = (this.tableInfo.state == 0 ? '未开局' : '已开局') + '    ' + jushu[1] + '：' + (this.tableInfo.curJuNum + '/'+ this.tableInfo.juNum) + '    房号：'+this.tableInfo.roomId;
        }else{
            this.score.string = (this.tableInfo.state == 0 ? '未开局' : '已开局') + '    房号：'+this.tableInfo.roomId;
        }
        this.title.string = (this.idx+1)+'号桌';

        let data = this.tableInfo.membersList.slice();
        data.sort((a, b)=>{
            if(a.job == MEMBER.OWNER){
                return -1;
            }else{
                if(a.job == MEMBER.NORMAL){
                    if(b.job == MEMBER.NORMAL){
                        return a.joinTime - b.joinTime;
                    }else{
                        return 1;
                    }
                }else{
                    if(b.job == MEMBER.OWNER){
                        return 1;
                    }else if(b.job == MEMBER.NORMAL){
                        return -1;
                    }else{
                        return a.joinTime - b.joinTime;
                    }
                }
            }
        })

        this.playerList = data;
        this.content_node.removeAllChildren();
        let j = 0;
        let k = 0;

        let playerNum = this.playerList.length
        if(playerNum > this.spawnCount){
            playerNum = this.spawnCount;
        }
        for (let i = 0; i < playerNum; i++) {
            j = Math.floor(i / this.row);
            k = i % this.row;
            var item = cc.instantiate(this.prefabItem);
            item.getComponent('klb_friend_group_manageTableItem').initPlayerInfo(this.clubId, this.playerList[i], this.wanfa, this.idx, this.tableInfo.roomId, this.tableInfo.gameType, this.tableInfo.state == 0);
            item.index = i;
            this.content_node.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k)-this.startX;
            item.y = -this.startY - this.item_height / 2 - (this.item_height + this.spaceY) * j;
        }

        let count = Math.ceil(this.playerList.length / this.row)
        this.content_node.height = this.startY + this.item_height * count + this.spaceY * count;
    },

    // // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    // // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update: function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.content_node.children;
        // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
        let isDown = this.scrollView.content.y < this.lastContentPosY;
        // 实际创建项占了多高（即它们的高度累加）
        let count = Math.ceil(items.length / this.row);
        let offset = this.item_height * count + this.spaceY * count;
        let newY = 0;

        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // 提前计算出该item的新的y坐标
                newY = items[i].y + offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y < -this.bufferZone && newY < 0) {
                    items[i].y = newY;
                    let itemId = items[i].index - items.length; // update item id
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('klb_friend_group_manageTableItem').initPlayerInfo(this.clubId, this.playerList[itemId], this.wanfa, this.idx, this.tableInfo.roomId, this.tableInfo.gameType, this.tableInfo.state == 0);
                    items[i].index = itemId;
                }
            } else {
                // 提前计算出该item的新的y坐标
                newY = items[i].y - offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y > this.bufferZone && newY > -this.content_node.height) {
                    items[i].y = newY;
                    // let item = items[i].getComponent('Item');
                    let itemId = items[i].index + items.length;
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('klb_friend_group_manageTableItem').initPlayerInfo(this.clubId, this.playerList[itemId], this.wanfa, this.idx, this.tableInfo.roomId, this.tableInfo.gameType, this.tableInfo.state == 0);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },

    onClickJoin(){
        hall_audio_mgr.com_btn_click();
        if(this.tableInfo.state != 0 && this.canEnter){
            var enter_game_req = new cc.pb.room_mgr.msg_enter_game_req();
            var game_info = new cc.pb.room_mgr.common_game_header();
            game_info.setRoomId(this.tableInfo.roomId);
            enter_game_req.setGameInfo(game_info);
            enter_game_req.setSeat(0);
            if (cc.sys.isNative) {
                if (cc.sys.OS_ANDROID == cc.sys.os) {
                    var loc = new cc.pb.room_mgr.latlng();
                    var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                    var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                    loc.setLatitude(latitude);
                    loc.setLongitude(longitude);
                    cc.log("详细地址：经度 " + longitude);
                    cc.log("详细地址：纬度 " + latitude);
                    if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                        enter_game_req.setLatlngInfo(loc);
                    }
                } else if (cc.sys.OS_IOS == cc.sys.os) {
                    var loc = new cc.pb.room_mgr.latlng();
                    var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                    var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                    loc.setLatitude(Latitude);
                    loc.setLongitude(Longitude);
                    cc.log("详细地址：经度 " + Longitude);
                    cc.log("详细地址：纬度 " + Latitude);
                    if (parseInt(Latitude) != 0 || parseInt(Longitude) != 0) {
                        enter_game_req.setLatlngInfo(loc);
                    }
                }
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_game_req, enter_game_req, 'cmd_msg_enter_game_req', true);

            cc.dd.UIMgr.destroyUI(this.node);
        }else if(this.tableInfo.state == 0){
            club_sender.sitDown(this.clubId, this.wanfa, this.idx, this.tableInfo);
            cc.dd.UIMgr.destroyUI(this.node);
        }
    },

    onClickDissolve(){
        hall_audio_mgr.com_btn_click();

        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_NOTICE)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_NOTICE, function(ui){
                ui.getComponent('klb_friend_group_notice').show('确定要解散该桌子吗?',()=>{
                    club_sender.dissolveDesk(this.clubId, this.tableInfo.roomId, this.tableInfo.gameType, this.wanfa, this.idx);
                    cc.dd.UIMgr.destroyUI(this.node);
                });
            }.bind(this));
        }
    },

    onClickWatch(){
        hall_audio_mgr.com_btn_click();

        var smsg = new cc.pb.room_mgr.msg_view_friend_game_req();
        smsg.setGameType(this.tableInfo.gameType);
        smsg.setRoomId(this.tableInfo.roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_view_friend_game_req, smsg, "msg_view_friend_game_req", true);

        cc.dd.UIMgr.destroyUI(this.node);
    },
});
