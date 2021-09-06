var Define = require("Define");
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var jlmj_prefab = require('jlmj_prefab_cfg');
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_str = require('jlmj_strConfig');
var AppConfig = require('AppConfig');
var UIZorder = require("mj_ui_zorder");
cc.Class({
    extends: cc.Component,

    properties: {
        userInfoNode: [cc.Node],//玩家列表信息
        gongzhonghao: cc.Node,//二维码
        multiple: cc.Node,

        title: cc.Sprite,
        titleSpriteFrames: [cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {
        let canvas_node = cc.find('Canvas');
        this.nodeScaleX = 1
        this.nodeScaleY = 1
        // if(canvas_node.width / canvas_node.height >= this.node.width / this.node.height){
        //     this.nodeScaleX = canvas_node.width/this.node.width
        //     this.nodeScaleY = canvas_node.height/this.node.height
        // }
        if(canvas_node.width / canvas_node.height <= 4 / 3){
            this.nodeScaleX = 1
            this.nodeScaleY = 1
        }else{
            this.nodeScaleX = canvas_node.width/this.node.width
            this.nodeScaleY = canvas_node.height/this.node.height
        }
        this.node.scaleX = this.nodeScaleX;
        this.node.scaleY = this.nodeScaleY;

        switch (AppConfig.GAME_PID) {
            case 2:
                cc.find('gy_logo_icon', this.node).active = false;
                break;
        }
        this.fjinfo = cc.find("info", this.node).getComponent(cc.Label);//房间信息
        this.gzinfo = cc.find("gzinfo", this.node).getComponent(cc.Label);//规则信息
        this.shareNode = cc.find("shareNode", this.node);//分享信息
        this.backBtn = cc.find("backBtn", this.node);//返回按钮

        if(this.shareNode){
            this.shareNode.active = false;
        }
    },
    init: function (fj_info, gz_info, play_list, TongjiData, closefun, isDaJiesuan, backfun) {
        this.closefun = closefun;
        this.backfun = backfun;
        this.play_list = play_list;
        this.data = TongjiData;

        this.fjinfo.string = fj_info;
        this.backBtn.active = isDaJiesuan;
        cc.find("time", this.node).getComponent(cc.Label).string = this.getSysTime();

        if(RoomMgr.Instance().isUseNeiMengMJConfig()){
            if(RoomMgr.Instance().isChiFengMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[0];
            }else if(RoomMgr.Instance().isAoHanMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[1];
            }else if(RoomMgr.Instance().isWuDanMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[2];
            }else if(RoomMgr.Instance().isPingZhuangMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[3];
            }
        }else{
            if(RoomMgr.Instance().isJiLinMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[0];
            }else if(RoomMgr.Instance().isChangChunMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[1];
            }else if(RoomMgr.Instance().isFuXinMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[2];
            }else if(RoomMgr.Instance().isNongAnMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[3];
            }else if(RoomMgr.Instance().isSongYuanMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[4];
            }else if(RoomMgr.Instance().isXueZhanMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[5];
            }else if(RoomMgr.Instance().isXueLiuMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[6];
            }else if(RoomMgr.Instance().isSuiHuaMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[7];
            }else if(RoomMgr.Instance().isJinZhouMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[8];
            }else if(RoomMgr.Instance().isHeiShanMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[9];
            }else if(RoomMgr.Instance().isTuiDaoHuMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[10];
            }else if(RoomMgr.Instance().isFangZhengMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[11];
            }else if(RoomMgr.Instance().isBaiChengMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[12];
            }else if(RoomMgr.Instance().isAChengMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[13];
            }else if(RoomMgr.Instance().isHeLongMJ()){
                this.title.spriteFrame = this.titleSpriteFrames[14];
            }
        }
        this.gzinfo.string = gz_info;
        this.updateUI();
    },

    onEnable: function () {
    },

    /**
     *刷新UI
     */
    updateUI: function () {
        this.userInfoNode.forEach(function (node) {
            node.active = false;
        });

        var userInfo = this.data.resultuserinfoList;
        //找出最大赢值
        var win_max = 0, lose_max = 0;
        var u_info = this.initPlayerInfo();//输出方位属性

        for (var i in userInfo) {
            win_max = win_max < userInfo[i].totalscore ? userInfo[i].totalscore : win_max;
            lose_max = lose_max < userInfo[i].dianpaocount ? userInfo[i].dianpaocount : lose_max;
        }

        var user_idx = 0;
        for (var i = 0; userInfo && i < userInfo.length; ++i) {
            userInfo[i].uinfo = u_info[userInfo[i].userid];
            var isDayinjia = userInfo[i].totalscore > 0 ? win_max == userInfo[i].totalscore : false;
            var isPaoShou = userInfo[i].dianpaocount > 0 ? lose_max == userInfo[i].dianpaocount : false;
            this.initUserInfo(userInfo[i], this.data.allgamenumber, user_idx, isDayinjia, isPaoShou);
            user_idx++;
        }

        if(RoomMgr.Instance().isClubRoom()){
            this.multiple.active = false;
            // this.multiple.getComponentInChildren(cc.Label).string = RoomMgr.Instance().multiple+'倍场';
        }else{
            this.multiple.active = false;
        }
    },
    /**
     * 初始化玩家信息
     */
    initPlayerInfo: function () {
        var fangwei_info = [];//输出方位属性
        var zuowei_id = 0;//自己的方位
        var u_info = [];

        if(RoomMgr.Instance().gameId == cc.dd.Define.GameType.XZMJ_FRIEND){
            let len = 0;
            if(RoomMgr.Instance()._Rule){
                len = RoomMgr.Instance()._Rule.usercountlimit;
            }else{
                len = this.play_list.length;
            }
            var fangwei = jlmj_str.fangwei[len - 2];
            let idx = 0;
            this.play_list.forEach(function (player) {
                if(player)
                {
                    var player_head = player.headUrl;
                    fangwei_info[idx] = {
                        uid:player.userId,
                        fangwei:null,
                        zuowei:player.idx,
                        ziji:player.userId == cc.dd.user.id,
                        head:player_head,
                        next:idx==len-1?0:idx+1,
                        up:  idx==0?len-1:idx-1,
                        sex: player.sex,
                    };
                    zuowei_id = player.userId == cc.dd.user.id?idx:zuowei_id;
                    idx++;
                }
            });
        }else{
            //寻找自己的方位并设置属性（自己）
            var len = this.play_list.length;
            var fangwei = jlmj_str.fangwei[len - 2];
            this.play_list.forEach(function (player, idx) {
                if (player) {
                    var player_head = player.headUrl;
                    fangwei_info[idx] = {
                        uid: player.userId,
                        fangwei: null,
                        zuowei: player.idx,
                        ziji: player.userId == cc.dd.user.id,
                        head: player_head,
                        next: idx == len - 1 ? 0 : idx + 1,
                        up: idx == 0 ? len - 1 : idx - 1,
                        sex: player.sex,
                    };
                    zuowei_id = player.userId == cc.dd.user.id ? idx : zuowei_id;
                }
            });
        }

        var cur_info = fangwei_info[zuowei_id];
        cur_info.fangwei = fangwei[0];
        u_info[cur_info.uid] = cur_info;

        for (var i = 1; i < fangwei.length; ++i) {
            cur_info = fangwei_info[cur_info.next];
            cur_info.fangwei = fangwei[i];
            u_info[cur_info.uid] = cur_info;
        }

        return u_info;
    },
    /**
     * 初始化玩家信息条
     * @param userInfo 玩家信息
     * @param allNum    总的对局数
     * @param i         名次
     * @param isDayinjia 大赢家
     */
    initUserInfo: function (userInfo, allNum, i, isDayinjia, isPaoShou) {
        var usernode = this.userInfoNode[i];
        if (usernode) {
            usernode.active = true;
            var nodeCom = usernode.getComponent('jlmj_zhanjiTongji_userInfo');
            if (nodeCom) {
                nodeCom.setData(userInfo, isDayinjia, isPaoShou);
            }
        }
    },

    /**
     * 退出房间
     */
    exitBtnCallBack: function () {
        cc.dd.UIMgr.destroyUI(this.node);
        this.closefun ? this.closefun() : null;
    },

    /**
     * 分享
     */
    shardBtnCallBack: function () {
        jlmj_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_SHARE, function (ui) {
            ui.setLocalZOrder(UIZorder.MJ_LAYER_UI);
        });
    },

    /**
     * 分享到好友  群
     */
    shardFriendCallBack: function () {
        setTimeout(function () {
            if (cc.sys.isNative) {
                if(this.gongzhonghao){
                    this.gongzhonghao.active = true;
                }
                var canvasNode = cc.find('Canvas');
                cc.dd.native_wx.SendScreenShot(canvasNode);
                if(this.gongzhonghao){
                    this.gongzhonghao.active = false;
                }
            }
        }.bind(this), 500);
    },
    /**
     * 分享到朋友圈
     */
    shardQuanCallBack: function () {
        setTimeout(function () {
            if (cc.sys.isNative) {
                if(this.gongzhonghao){
                    this.gongzhonghao.active = true;
                }
                var canvasNode = cc.find('Canvas');
                cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
                if(this.gongzhonghao){
                    this.gongzhonghao.active = false;
                }
            }
        }.bind(this), 500);
    },
    /**
     * 分享到闲聊
     */
    shardXianLiaoCallBack: function () {
        setTimeout(function () {
            if (cc.sys.isNative) {
                if(this.gongzhonghao){
                    this.gongzhonghao.active = true;
                }
                var canvasNode = cc.find('Canvas');
                cc.dd.native_wx.sendXlScreenShot(canvasNode);
                if(this.gongzhonghao){
                    this.gongzhonghao.active = false;
                }
            }
        }.bind(this), 500);
    },
    /**
     * 获取系统时间
     */
    getSysTime: function () {
        var date = new Date();
        // var seperator1 = "-";
        // if(RoomMgr.Instance().isUseNeiMengMJConfig()){
            var seperator1 = "/";
        // }
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 1 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }
        if (sec >= 0 && sec <= 9) {
            sec = "0" + sec;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + min
            + seperator2 + sec;
        return currentdate;
    },

    /**
     * 分享关闭
     */
    shardBtnClose:function () {
        this.shareNode.active = false;
    },

    /**
     * 分享回调详细
     */
    shardXXBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        this.shareNode.active = true;
    },

    backBtnCallBacK:function () {
        jlmj_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
        this.backfun ? this.backfun() : null;
    },
});
