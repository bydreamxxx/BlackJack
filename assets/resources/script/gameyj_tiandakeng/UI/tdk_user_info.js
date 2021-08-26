// create by wj 2018/3/7
var dd = cc.dd;
var aniName = require('ConstantCfg').AnimationName;
var UserSex = require('ConstantCfg').UserSex;
var AtlasPath = require('ConstantCfg').AtlasPath;
var ChatCfgData = require('ChatCfg');
var gameData = require('tdk_game_data');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;


const PropItemPrefabPath = 'gameyj_common/prefab/PropItem';

cc.Class({
    extends: cc.Component,

    properties: {
        /**
         * 头像
         */
        headSp: cc.Sprite,
        /**
         * 昵称
         */
        nickLbl: cc.Label,
        /**
         * id
         */
        idLbl: cc.Label,
        /**
         * 游戏币数量
         */
        moneyLbl: cc.Label,
        /**
         * 荣誉
         */
        rongyuLbl: cc.Label,
        /**
         * vip
         */
        vipLbl: cc.Label,
        /**
         * 胜局
         */
        winNode: cc.Node,
        /**
         * 对局
         */
        totalNode: cc.Node,
        /**
         * 胜率
         */
        winRateNode: cc.Node,
        /**
         * 道具父节点
         */
        propItemParent: cc.Node,
        /**
         * item宽
         */
        itemWidth: 100,
        /**
         * item高
         */
        itemHeight: 100,
        /**
         * 道具列表
         */
        item_list: [],

    },

    // LIFE-CYCLE CALLBACKS:

    // use this for initialization
    onLoad: function () {

    },
    /**
     * 获取背景节点
     */
    getBgNode: function () {
        var bg = this.node.getChildByName('bg');
        return bg;
    },
    /**
     * 播放开始动画
     */
    playStartAni: function () {
        var bg = this.getBgNode();
        var ani = bg.getComponent(cc.Animation);
        ani.play(aniName.POPUP_START);
    },

    show: function (data) {
        this.playStartAni();

        this.setSpf(this.headSp, data.headSpf);

        this.setLblStr(this.nickLbl, cc.dd.Utils.substr( data.nick, 0, 10 ) );
        this.setLblStr(this.idLbl, 'ID:' + data.userId);
        this.setLblStr(this.moneyLbl, data.money);
        this.setLblStr(this.vipLbl, data.vip);
        this.userId = data.userId;
        //this.setLblStr(this.propCostLbl, data.propCost + "金币/次（从背包中消耗）");
        if(!data.showwin){
            this.winNode.active = false;
            this.totalNode.active = false;
            this.winRateNode.active = false;
        }else{
            var winLbl = this.winNode.getChildByName('');
            this.setLblStr(winLbl, data.winNum);

            var totalLbl = this.totalNode.getChildByName('');
            this.setLblStr(totalLbl, data.totalNum);

            var winRateLbl = this.winRateNode.getChildByName('');
            var rate = 0;
            if(data.totalNum == 0){
                rate = 0 + '%';
            }else{
                rate = data.winNum / data.totalNum + '%'
            }
            this.setLblStr(winRateLbl, rate);
        }

    },

    sendMagicProp: function (event,data) {
        if(this.userId == cc.dd.user.id){
            cc.log('不能对自己使用道具！');
            return;
        }

        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(gameData.gameId);
        gameInfo.setRoomId(gameData.roomId);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(3);
        chatInfo.setId(Number(data));
        chatInfo.setToUserId(this.userId);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = 3;
        chat_msg.id = Number(data);
        chat_msg.toUserId = this.userId;
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT,chat_msg);
        cc.dd.UIMgr.closeUI(this.node);
    },

    onClickClose: function () {
        audio.com_btn_click();
        cc.dd.UIMgr.closeUI(this.node);
    },

    /**
     * 获取道具item预制
     */
    getItemPrefab: function (cb) {
        var prefab = cc.resources.get(PropItemPrefabPath, cc.Prefab);
        if (prefab) {
            cb(prefab);
        } else {
            dd.ResLoader.loadGameStaticRes(PropItemPrefabPath, cc.Prefab, function (item) {
                cb(item);
            }.bind(this));
        }
    },

    /**
     * 设置精灵背景
     * @param sp
     * @param spf
     */
    setSpf: function (sp, spf) {
        if (spf && sp) {
            sp.spriteFrame = spf;
        }
    },

    /**
     * 设置显示文字
     * @param lbl
     * @param str
     */
    setLblStr: function (lbl, str) {
        if (lbl) {
            lbl.string = str;
        }
    },

    maskClick: function () {
        this.close();
    },

    /**
     * 监听item点击事件
     * @param cb
     */
    itemClickCallback: function (data) {
        
    },

    popupInActFinished: function () {
        cc.log('com_user_info::popupInActFinished!');
    },

    popupOutActFinished: function () {
        // this.node.parent.removeFromParent();
        if (this.closeCallback) {
            this.closeCallback();
        }
        cc.log('com_user_info::popupOutActFinished!');
    },

    onStop: function(){
        var bg = this.getBgNode();
        var ani = bg.getComponent(cc.Animation);
        ani.off('stop', this.onStop);
        this.clearUi();
        this.node.destroy();
    },

    close: function () {
        var bg = this.getBgNode();
        var ani = bg.getComponent(cc.Animation);
        ani.play(aniName.POPUP_END);
        ani.on('stop', this.onStop.bind(this));

    },

    /**
     * 释放道具内存
     */
    clearUi: function () {
        this.item_list.forEach(function (item) {
            item.node.removeFromParent();
            item.node.destroy();
        });
    },

    onDestroy: function () {
        this.item_list = [];
    },
});
