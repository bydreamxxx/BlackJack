const Hall = require('jlmj_halldata');
let hall_audio_mgr = require('hall_audio_mgr').Instance();
let hall_prefab = require('hall_prefab_cfg');
const HallCommonData = require('hall_common_data').HallCommonData.getInstance();
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
let guize = require('fenxiangyouli');
let login_module = require('LoginModule');
var Platform = require( "Platform" );
const AppCfg = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        curMoney_int: cc.Label,
        curMoney_point: cc.Label,
        curMoney_decimals: cc.Label,
        curMoney_wan: cc.Node,
        curMoney_yi: cc.Node,
        title: cc.Label,
        inviteNode: cc.Node,
        finishNode: cc.Node,
        invitenum_lbl: cc.Label,
        finishnum_lbl: cc.Label,
        content_node: cc.Node,
        scrollView: cc.ScrollView,
        item_templete: cc.Node,
        explainNode: cc.Node,
        explainItem: cc.Node,
        explainContent: cc.Node,
        button: cc.Node,

        centerY:-106.8,
        inviteY:-73.8,

        startY: 12,
        spaceX: 10,
        spaceY: 10,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.spawnCount = 25;//显示15个
        this.item_height = this.item_templete.height;
        this.bufferZone = this.scrollView.node.height / 2 + this.item_height / 2 * 3;//边界线
        this.playerList = [];

        this.playerNodePool = new cc.NodePool();
        for (let i = 0; i < this.spawnCount; ++i) {
            let player = cc.instantiate(this.item_templete); // 创建节点
            this.playerNodePool.put(player); // 通过 put 接口放入对象池
        }

        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        var pObj = new cc.pb.hall.msg_user_invite_info_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_user_invite_info_req, pObj,
            '发送协议[id: ${cmd_hall_req_task}],cmd_hall_req_task', true);
        cc.dd.NetWaitUtil.net_wait_end('网络状况不佳...', 'hall_invite');

        this.initGuiZe();
    },

    createPlayer: function () {
        let player = null;
        if (this.playerNodePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            player = this.playerNodePool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            player = cc.instantiate(this.item_templete);
        }
        return player;
    },

    initGuiZe(){
        let config = guize.getItemList((itemdata)=>{
            return itemdata.channel == cc.dd.user.regChannel;
        });
        config.sort((a, b)=>{
            return a.index - b.index;
        });

        config.forEach((item)=>{
            let node = cc.instantiate(this.explainItem);
            node.active = true;

            let title = node.getChildByName('title');
            let content = node.getChildByName('content');
            if(title){
                title.getComponent(cc.Label).string = item.title;
            }

            if(content){
                content.getComponent(cc.RichText).string = item.content;
            }

            this.explainContent.addChild(node);
        });

        if(cc.dd.user.regChannel < 10000) {
            this.title.string = "已累计红包";
            this.inviteNode.y = this.inviteY;
            this.finishNode.active = true;
            this.button.active = true;
        }else{
            this.title.string = "已累计金币";
            this.inviteNode.y = this.centerY;
            this.finishNode.active = false;
            this.button.active = false;
        }
    },

    onDestroy() {
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    // update (dt) {},
    initData(msg) {
        this.playerList = [];


        this.updateProp(msg);
        this.invitenum_lbl.string = msg.allInviteNum.toString();
        this.finishnum_lbl.string = msg.finishInviteNum.toString();
        this.content_node.removeAllChildren();
        msg.userListList.sort((a, b) => { if (a.isFinish) return 1; if (b.isFinish) return -1; return 0; });

        this.playerList = this.playerList.concat(msg.userListList);
        this.hasNextPage = msg.allInviteNum > 50;

        // let i = 0;
        // for (; i < msg.userListList.length; i++) {
        //     if (i < 50) {
        //         var data = msg.userListList[i];
        //         var item = this.createPlayer();
        //         if (data.isFinish) {
        //             cc.find('done', item).active = true;
        //         }
        //         else {
        //             cc.find('ing', item).active = true;
        //         }
        //         var sp = cc.find('mask/head', item).getComponent(cc.Sprite);
        //         cc.dd.SysTools.loadWxheadH5(sp, data.head);
        //         cc.find('name', item).getComponent(cc.Label).string = cc.dd.Utils.substr(data.name, 0, 4);
        //         item.active = true;
        //         this.content_node.addChild(item);
        //     }
        // }
        // for (var j = i; j < 50; j++) {
        //     var data = msg.userListList[i];
        //     var item = this.createPlayer();
        //     cc.find('wait', item).active = true;
        //     var sp = cc.find('mask/head', item).getComponent(cc.Sprite);
        //     sp.spriteFrame = cc.find('mask', item).getComponent(cc.Mask).spriteFrame;
        //     cc.find('name', item).getComponent(cc.Label).string = '';
        //     item.active = true;
        //     this.content_node.addChild(item);
        // }

        let playerNum = msg.userListList.length;

        if(playerNum % 5 != 0){
            playerNum += (5 - playerNum % 5);
        }
        if(playerNum <= 5){
            playerNum = 10;
        }

        if(playerNum > this.spawnCount){
            playerNum = this.spawnCount;
        }

        let j = 0;
        let k = 0;
        for (let i = 0; i < playerNum; i++) {
            j = Math.floor(i / 5);
            k = i % 5;
            var item = this.createPlayer();
            this.updateItem(item, i);
            item.active = true;
            this.content_node.addChild(item);

            item.x = (-item.width - this.spaceX) * (2 - k);
            item.y = -this.startY - this.item_height / 2 - (this.item_height + this.spaceY) * j;
        }

        let count = Math.ceil(this.content_node.children.length / 5)
        this.content_node.height = this.startY + this.item_height * count + this.spaceY * count;
    },

    updateData(msg){
        this.waiting = false;
        this.playerList = this.playerList.concat(msg.userListList);
        this.hasNextPage = !msg.isLastPage;


        let count = Math.ceil(this.playerList.length / 5);
        this.content_node.height = this.startY + this.item_height * count + this.spaceY * count;
    },

    updateItem(item, itemId){
        let sp = cc.find('mask/head', item).getComponent(cc.Sprite);
        sp.spriteFrame = null;
        if(itemId >= this.playerList.length){
            cc.find('wait', item).active = true;
            cc.find('done', item).active = false;
            cc.find('ing', item).active = false;
            sp.spriteFrame = cc.find('mask', item).getComponent(cc.Mask).spriteFrame;
            cc.find('name', item).getComponent(cc.Label).string = '';
        }else{
            var data = this.playerList[itemId];
            cc.find('wait', item).active = false;
            cc.find('done', item).active = false;
            cc.find('ing', item).active = false;
            if (data.isFinish) {
                cc.find('done', item).active = true;
            }
            else {
                cc.find('ing', item).active = true;
            }
            cc.dd.SysTools.loadWxheadH5(sp, data.head);
            cc.find('name', item).getComponent(cc.Label).string = cc.dd.Utils.substr(data.name, 0, 4);
        }
        if(cc.dd.user.regChannel >= 10000){
            cc.find('wait', item).active = false;
            cc.find('done', item).active = false;
            cc.find('ing', item).active = false;
        }
        item.index = itemId;
    },

    onEventMessage(event, data) {
        switch (event) {
            case Hall.HallEvent.INVITE_INFO:
                this.initData(data);
                break;
            case HallCommonEvent.UPDATA_PropData:
                this.updateProp();
                break;
            case Hall.HallEvent.UPDATE_INVITE_INFO:
                this.updateData(data);
                break;
            default:
                break;
        }
    },

    closeBtn() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickInvite() {
        hall_audio_mgr.com_btn_click();
        if (cc.sys.isNative) {
            // let title = "您有一个红包未领取";
            // let content = "您的朋友送您一个红包,请尽快打开";
            // let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0f18441523270cf4&redirect_uri=http://tg.yuejiegame.net/wechatlogin?";
            // url += "unionid=";
            // url += HallCommonData.unionId;
            // url += "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";

            let title, content;
            if(cc.dd.user.regChannel >= 10000){
                let gameChannel = require('game_channel');
                let config = gameChannel.getItem((itemdata)=>{
                    return itemdata.channel == cc.dd.user.regChannel;
                });

                title = config.title;
                content = config.content;
            }else{
                title = "【巷乐游戏】斗地主！抢红包！最高可领100元";
                content = "【巷乐游戏】快来玩，免费参赛，送红包！送金币！人人有份！速来>>>"
            }

            let url = Platform.fxylUrl[AppCfg.PID];
            url += "unionid=";
            url += HallCommonData.unionId;
            url += "&channel=";
            url += (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
            url += "&user_id=";
            url += HallCommonData.userId;
            cc.log('fxyl-url:  '+url);
            cc.dd.native_wx.SendWXInvite(title, content, url, 0xFFFF);
        }
    },

    onGotoExchange() {
        hall_audio_mgr.com_btn_click();
        if (HallCommonData.idNum == '') {
            cc.dd.PromptBoxUtil.show('请先完善实名认证信息再进行兑换');
            return;
        }
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_CASH, function (prefab) {
            var component = prefab.getComponent('klb_hall_ExchangeCash');
            component.setData(this._cardData, 25, 50);
            var msg = new cc.pb.hall.msg_get_bouns_num_req();
            msg.setOpType(1);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_bouns_num_req, msg, "msg_get_bouns_num_req", true);
        }.bind(this));
    },

    updateProp(msg) {
        if(cc.dd.user.regChannel < 10000){
            for (var i = 0; i < hall_prop_data.propList.length; i++) {
                if (hall_prop_data.propList[i].dataId == 1004) {
                    this._cardData = hall_prop_data.propList[i];
                }
            }
        }else{
            if(msg && msg.hasOwnProperty('allRebateNum')){
                this._cardData = {count:msg.allRebateNum * 100};
            }
        }

        // this.curMoney_lbl.string = this._cardData ? (this._cardData.count / 100).toString().replace('.', ':') : '0';
        let count = this._cardData ? this._cardData.count / 100 : 0;
        let str = this.convertChipNum(count);
        this.curMoney_int.string = str[0];
        this.curMoney_point.string = str[1];
        this.curMoney_point.node.active = str[1] != "";
        this.curMoney_decimals.string = str[2];
        this.curMoney_decimals.node.active = str[2] != "";
        this.curMoney_wan.active = str[3];
        this.curMoney_yi.active = str[4];
    },

    onClickExplain(event, data){
        this.explainNode.active = data === 'true';
    },

    //转换筹码字
    convertChipNum: function(num){
        let str = num;
        let int = "";
        let point = "";
        let decimals = "";
        let wan = false;
        let yi = false;
        if(num >= 10000 && num < 100000000){
            str = (num / 10000).toFixed(2);
            wan = true;
        }else if(num >= 100000000){
            str = Math.ceil(num / 100000000).toFixed(2);
            yi = true;
        }
        let list = str.toString().split('.');
        int = list[0];
        if(list.length > 1){
            point = ":";
            decimals = list[1];
        }

        return [int, point, decimals, wan, yi];
    },

    // // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },
    //
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
        let count = Math.ceil(items.length / 5);
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
                    this.updateItem(items[i], itemId);
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
                    this.updateItem(items[i], itemId);
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },

    scrollEvent: function(sender, event) {
        switch(event) {
            case 0:
                // cc.error("Scroll to Top");
                break;
            case 1:
                // cc.error("Scroll to Bottom");
                this.istoend = true;
                break;
            case 2:
                // cc.error("Scroll to Left");
                break;
            case 3:
                // cc.error("Scroll to Right");
                break;
            case 4:
                // cc.error("Scrolling");
                break;
            case 5:
                // cc.error("Bounce Top");
                break;
            case 6:
                // cc.error("Bounce bottom");
                break;
            case 7:
                // cc.error("Bounce left");
                break;
            case 8:
                // cc.error("Bounce right");
                break;
            case 9:
                // cc.error("Auto scroll ended");
                if(this.istoend == true){
                    if(this.hasNextPage && this.waiting != true){
                        this.waiting = true;
                        var pObj = new cc.pb.hall.msg_get_user_invite_page_req();
                        cc.error("page = " +( Math.ceil(this.playerList.length / 50)+1));
                        cc.error("length = " + this.playerList.length);
                        pObj.setPage(Math.ceil(this.playerList.length / 50)+1);
                        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_user_invite_page_req, pObj,
                            '发送协议[id: ${cmd_msg_get_user_invite_page_req}],cmd_msg_get_user_invite_page_req', true);
                        cc.dd.NetWaitUtil.net_wait_end('网络状况不佳...', 'msg_get_user_invite_page_req');
                    }
                }
                this.istoend = false;
                break;
        }
    },
});
