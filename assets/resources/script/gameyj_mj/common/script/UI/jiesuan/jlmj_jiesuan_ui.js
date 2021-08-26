
var deskData = require('jlmj_desk_data').DeskData;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;

var game_room = require("game_room");

var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_layer_zorder = require("jlmj_layer_zorder");
var jlmj_str = require('jlmj_strConfig');

var playerMgr = require('jlmj_player_mgr');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;
let GameType = cc.dd.Define.GameType;
var pai3d_value = require("jlmj_pai3d_value");
let cardType = require("jlmj_jiesuan_userInfo").cardType;
let teshuType = require("jlmj_jiesuan_userInfo").teshuType;
var nmmj_audio_path = require("nmmj_audio_path");
var jlmj_audio_path = require("jlmj_audio_path");
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        xiangxiLayer: cc.Node,//详细结算主节点
        jushuTTF: cc.Label,//局数
        roomNumTTF: cc.Label,//房间号
        goTimeTTF: cc.Label,//倒计时
        baopaoNode: cc.Node,//宝牌的父节点
        userInfo: [cc.Node],//玩家列表
        shengliSp: [cc.Node],//胜利还是失败 1胜利  2失败

        huanzhuoBtn: cc.Node,//换桌按键
        shardBtn: cc.Node,//分享按钮
        goOnBtn: cc.Node,//继续按钮
        zhanjiBtn: cc.Node,//战绩统计按钮
        backLobby: cc.Node,//返回大厅
        dissolveBtn: cc.Node,//解散房间
        xiangxiBtnNode: cc.Node,
        hideBtn: cc.Node,//返回桌面,
        xlShardBtn: cc.Node,//闲聊分享
        shardBtnFriend: cc.Node,//闲聊分享

        //--------------简易界面-------------
        jianyiLayer: cc.Node,//简易结算主节点
        goTimeTTF_1: cc.Label,//倒计时
        huanzhuoBtn_1: cc.Node,//换桌按键
        goOnBtn_1: cc.Node,//继续按钮
        zhanjiBtn_1: cc.Node,//战绩统计按钮
        shareBtn_1: cc.Node,//分享按钮
        jiesuanBtn: cc.Node,//本局结算按键
        //--------------弹出分享节点------------
        shareNode: cc.Node,

        maskNode: cc.Node,
        mask: cc.Node,

        maskLabel: cc.Node,
        timeLabel: cc.Label,

        //-------------血战血流详情---------------
        infoNode: cc.Node,
        content: cc.Node,
        jiesuanItem: cc.Prefab,

        matchBtn: cc.Node,
        freeBtn: cc.Node,
        xiaociji: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._daojishiNum = RoomMgr.Instance().isJiSuMJ() ? 15 : 20;
        this._data = null;
        this.g_id = RoomMgr.Instance().gameId;

        if (RoomMgr.Instance().isNewMJ()) {
            DeskEvent = require('base_mj_desk_data').DeskEvent;
            DeskED = require('base_mj_desk_data').DeskED;
        } else {
            DeskEvent = require('jlmj_desk_data').DeskEvent;
            DeskED = require('jlmj_desk_data').DeskED;
        }


        if (RoomMgr.Instance().isChangChunMJ()) {
            deskData = require('ccmj_desk_data').DeskData;
            playerMgr = require('ccmj_player_mgr');
        } else if (RoomMgr.Instance().isJiLinMJ()) {
            deskData = require('jlmj_desk_data').DeskData;
            playerMgr = require('jlmj_player_mgr');
        } else if (RoomMgr.Instance().isNongAnMJ()) {
            deskData = require('namj_desk_data').DeskData;
            playerMgr = require('namj_player_mgr');
        } else if (RoomMgr.Instance().isFuXinMJ()) {
            deskData = require('fxmj_desk_data').DeskData;
            playerMgr = require('fxmj_player_mgr');
        } else if (RoomMgr.Instance().isSongYuanMJ()) {
            deskData = require('symj_desk_data').DeskData;
            playerMgr = require('symj_player_mgr');
        } else if (RoomMgr.Instance().isXueZhanMJ() || RoomMgr.Instance().isXueLiuMJ()) {
            deskData = require('scmj_desk_data').DeskData;
            playerMgr = require('scmj_player_mgr');
        } else if (RoomMgr.Instance().isSuiHuaMJ()) {
            deskData = require('shmj_desk_data').DeskData;
            playerMgr = require('shmj_player_mgr');
        } else if (RoomMgr.Instance().isJinZhouMJ()) {
            deskData = require('jzmj_desk_data').DeskData;
            playerMgr = require('jzmj_player_mgr');
        } else if (RoomMgr.Instance().isHeiShanMJ()) {
            deskData = require('hsmj_desk_data').DeskData;
            playerMgr = require('hsmj_player_mgr');
        } else if (RoomMgr.Instance().isTuiDaoHuMJ()) {
            deskData = require('tdhmj_desk_data').DeskData;
            playerMgr = require('tdhmj_player_mgr');
        } else if (RoomMgr.Instance().isChiFengMJ()) {
            deskData = require('cfmj_desk_data').DeskData;
            playerMgr = require('cfmj_player_mgr');
        } else if (RoomMgr.Instance().isAoHanMJ()) {
            deskData = require('ahmj_desk_data').DeskData;
            playerMgr = require('ahmj_player_mgr');
        } else if (RoomMgr.Instance().isFangZhengMJ()) {
            deskData = require('fzmj_desk_data').DeskData;
            playerMgr = require('fzmj_player_mgr');
        } else if (RoomMgr.Instance().isWuDanMJ()) {
            deskData = require('wdmj_desk_data').DeskData;
            playerMgr = require('wdmj_player_mgr');
        } else if (RoomMgr.Instance().isPingZhuangMJ()) {
            deskData = require('pzmj_desk_data').DeskData;
            playerMgr = require('pzmj_player_mgr');
        } else if (RoomMgr.Instance().isBaiChengMJ()) {
            deskData = require('bcmj_desk_data').DeskData;
            playerMgr = require('bcmj_player_mgr');
        } else if (RoomMgr.Instance().isAChengMJ()) {
            deskData = require('acmj_desk_data').DeskData;
            playerMgr = require('acmj_player_mgr');
        } else if (RoomMgr.Instance().isHeLongMJ()) {
            deskData = require('hlmj_desk_data').DeskData;
            playerMgr = require('hlmj_player_mgr');
        } else if (RoomMgr.Instance().isJiSuMJ()) {
            deskData = require('jsmj_desk_data').DeskData;
            playerMgr = require('jsmj_player_mgr');
        }

        let isMacth = deskData.Instance().isMatch();
        this.huanzhuoBtn.active = !isMacth;
        this.shardBtn.active = !isMacth;
        this.huanzhuoBtn_1.active = !isMacth;
        this.shareBtn_1.active = !isMacth;

        if (this.infoNode) {
            this.infoNode.active = false;
        }
    },

    start() {
        // if(this.maskLabel){
        //     if(!deskData.Instance().isFriend()){
        //         this.maskLabel.active = true;
        //     }else{
        //         this.maskLabel.active = false;
        //     }
        // }
    },

    onEnable() {
        // if(!deskData.Instance().isFriend()){
        if (!RoomMgr.Instance().isJiSuMJ()) {
            this.regTouchEvent();
        }
        // }
    },

    onDisable() {
        // if(!deskData.Instance().isFriend()){
        if (!RoomMgr.Instance().isJiSuMJ()) {
            this.unRegTouchEvent();
        }
        // }
    },

    onDestroy: function () {
        this.stopTime();
    },

    /**
     * 开启倒计时
     */
    startTime: function (ts) {
        //倒计时
        if (deskData.Instance().isMatch()) {
            ts = 5
        }
        this._daojishiNum = ts || 20;
        this.goTimeTTF_1.string = this._daojishiNum;
        this.goTimeTTF.string = this._daojishiNum;
        this.stopTime();
        this._goTimeID = setInterval(function () {
            this._daojishiNum--;
            if (this._daojishiNum < 0) {
                this.stopTime();
                if (this.isLastJiesuan) {
                    this.closeJieSuan();
                } else if (deskData.Instance().isFriend()) {
                    //this.pyReady();
                } else if (deskData.Instance().isMatch()) {
                    this.disableButton();
                    this.openMatch();
                } else {
                    cc.log('朋友场 倒计时结束');
                    // this.disableButton();
                    this.sendLeave();
                }
            } else {
                this.goTimeTTF.string = this._daojishiNum;
                this.goTimeTTF_1.string = this._daojishiNum
            }
        }.bind(this), 1000);
    },

    /**
     * 停止倒计时
     */
    stopTime: function () {
        clearInterval(this._goTimeID);
    },
    //TODO--------------------------简易结束--------------------------
    /**
     * 显示简易结算界面
     * @param ts 倒计时时间
     */
    showJianYiLayer: function (data, ts, endCall, isLastJiesuan) {
        // this.jianyiLayer.active = true;
        // this.xiangxiLayer.active = false;
        this._data = data;
        this._endCall = endCall;
        this.isLastJiesuan = isLastJiesuan;

        if (this.matchBtn) {
            this.matchBtn.active = false;
        }
        if (this.freeBtn) {
            this.freeBtn.active = false;
        }
        if (this.xiaociji) {
            this.xiaociji.getComponent("klb_hall_xiaocijiBtn").setActive(false);
        }

        //朋友场和金币场按键显示
        if (deskData.Instance().isFriend()) {
            this.jiesuanBtn.active = true;
            this.huanzhuoBtn_1.getComponent(cc.Button).interactable = false;
            this.shareBtn_1.active = true;
            this.goOnBtn_1.active = !data.isend;//最后一局显示战绩按键
            this.zhanjiBtn_1.active = data.isend;//最后一局显示战绩按键
        } else if (deskData.Instance().isMatch()) {
            this.jiesuanBtn.active = true;
            this.huanzhuoBtn_1.active = false;
            this.shareBtn_1.active = false;
            this.goOnBtn_1.active = !deskData.Instance().inJueSai;
            this.zhanjiBtn_1.active = false;
            // this.goTimeTTF_1.node.active = !deskData.Instance().inJueSai;
            // cc.find('mj-js-daojishidi', this.jianyiLayer).active = !deskData.Instance().inJueSai;
        } else {
            if (this.matchBtn) {
                if (!cc._androidstore_check && !cc._isHuaweiGame && !cc._isBaiDuPingTaiGame)
                    this.matchBtn.active = this.g_id == cc.dd.Define.GameType.CCMJ_GOLD && !cc._applyForPayment;
            }
            if (this.freeBtn) {
                if (!cc._androidstore_check && !cc._isHuaweiGame && !cc._isBaiDuPingTaiGame)
                    this.freeBtn.active = this.g_id == cc.dd.Define.GameType.CCMJ_GOLD && !cc._applyForPayment;
            }
            if (this.xiaociji) {
                if (!cc._androidstore_check && !cc._isHuaweiGame && !cc._isBaiDuPingTaiGame)
                    this.xiaociji.getComponent("klb_hall_xiaocijiBtn").setActive(this.g_id == cc.dd.Define.GameType.CCMJ_GOLD && !cc._applyForPayment);
            }
            this.jiesuanBtn.active = true;
            this.huanzhuoBtn_1.active = true;
            this.shareBtn_1.active = true;
            this.goOnBtn_1.active = true;
            this.zhanjiBtn_1.active = false;
            if (cc._isHuaweiGame || cc._isBaiDuPingTaiGame)
                this.shardBtn && (this.shardBtn.active = false);
        }

        this.startTime(ts);
        this.jiesuanBtnCallBack();
        // var ani = this.node.getComponent(cc.Animation);
        // if(data.huuserid){
        //     ani.play('mj_jiesuan');
        // }
    },

    /**
     * 结算回调
     */
    jiesuanBtnCallBack: function () {
        this.jianyiLayer.active = false;
        this.xiangxiLayer.active = true;

        // if(!RoomMgr.Instance().isXueZhanMJ() && !RoomMgr.Instance().isXueLiuMJ()){
        this.maskNode.active = true;
        this.goTimeTTF.node.active = true;
        // }

        this.showXiangxiLayer(this._data, this._daojishiNum);
    },

    //隐藏按键
    HideBtn: function () {
        this.jianyiLayer.active = false;
        this.xiangxiBtnNode.active = false;
    },

    //TODO------------------------------------------------------------------------------
    /**
     * 显示详细信息界面
     * @param ts 倒计时剩余时间
     *
     */
    showXiangxiLayer: function (data, ts) {
        if (this.infoNode) {
            this.infoNode.active = false;
        }
        if (RoomMgr.Instance().isUseNeiMengMJConfig()) {
            if (deskData.Instance().isMatch()) {
                this.huanzhuoBtn.active = false;
                this.backLobby.active = false;//最后一局显示战绩按键
                this.dissolveBtn.active = false;
                this.hideBtn.active = false;

                this.shardBtn.active = false;
                this.goOnBtn.active = !deskData.Instance().inJueSai;
                this.zhanjiBtn.active = false;
                // this.xlShardBtn.active = false;
                this.jushuTTF.node.active = false;
                this.roomNumTTF.node.active = false;
            } else if (deskData.Instance().isFriend()) {
                this.huanzhuoBtn.active = false;
                this.backLobby.active = false;//最后一局显示战绩按键
                this.dissolveBtn.active = false;
                this.hideBtn.active = false;

                this.shardBtn.active = true;
                this.goOnBtn.active = !data.isend;//最后一局显示战绩按键
                this.zhanjiBtn.active = data.isend;//最后一局显示战绩按键
                // this.xlShardBtn.active = true;
                this.jushuTTF.node.active = true;
                this.roomNumTTF.node.active = true;
                this.jushuTTF.string = deskData.Instance().currPlayCount + '/' + deskData.Instance().totalPlayCount;
            } else {
                this.huanzhuoBtn.active = true;
                this.backLobby.active = true;//最后一局显示战绩按键
                this.dissolveBtn.active = false;
                this.hideBtn.active = false;

                this.shardBtn.active = false;
                this.goOnBtn.active = true;//最后一局显示战绩按键
                this.zhanjiBtn.active = false;//最后一局显示战绩按键
                // this.xlShardBtn.active = false;
                this.jushuTTF.node.active = false;
                this.roomNumTTF.node.active = false;
            }
        } else {
            //朋友场和金币场按键显示
            if (deskData.Instance().isFriend()) {
                this.huanzhuoBtn.active = false;
                this.shardBtn.active = false;
                this.goOnBtn.active = !data.isend;//最后一局显示战绩按键
                this.zhanjiBtn.active = data.isend;//最后一局显示战绩按键
                this.backLobby.active = data.isend;//最后一局显示战绩按键
                this.dissolveBtn.active = !data.isend;
                this.hideBtn.active = false;//!data.isend;
                // this.xlShardBtn.active = true;
                this.shardBtnFriend.active = true;
            } else if (deskData.Instance().isMatch()) {
                this.huanzhuoBtn.active = false;
                this.shardBtn.active = false;
                this.goOnBtn.active = !deskData.Instance().inJueSai;
                this.zhanjiBtn.active = false;
                this.backLobby.active = false;
                this.dissolveBtn.active = false;
                this.hideBtn.active = false;
                // this.goTimeTTF.node.active = !deskData.Instance().inJueSai;
                // this.xlShardBtn.active = false;
                this.shardBtnFriend.active = false;
            } else {
                this.huanzhuoBtn.active = true;
                this.shardBtn.active = !RoomMgr.Instance().isJiSuMJ();
                this.goOnBtn.active = true;
                this.zhanjiBtn.active = false;
                this.backLobby.active = true;
                this.dissolveBtn.active = false;
                this.hideBtn.active = false;
                // this.xlShardBtn.active = false;
                this.shardBtnFriend.active = false;
                if (cc._isHuaweiGame || cc._isBaiDuPingTaiGame)
                    this.shardBtn.active = false;
            }
            if (RoomMgr.Instance().isXueLiuMJ() || RoomMgr.Instance().isXueZhanMJ()) {
                this.jushuTTF.string = deskData.Instance().currPlayCount + '/' + deskData.Instance().totalPlayCount;
            } else {
                this.jushuTTF.string = data.jushu || 0;
            }
        }

        if (!RoomMgr.Instance().isXueLiuMJ() && !RoomMgr.Instance().isXueZhanMJ() && !RoomMgr.Instance().isJiSuMJ()) {
            if (!data.huuserid) {
                console.log('荒庄');
                this.initUserInfoH(data);
            } else {
                this.initUserInfo(data);//初始化玩家信息
            }
        }

        this.roomNumTTF.string = deskData.Instance().roomNumber;

        if (this.timeLabel) {
            this.timeLabel.string = this.getSysTime();
        }

        if (this.baopaoNode) {
            //创建宝牌
            var userList = data.playercoininfoList;
            for (var i = 0; userList && i < userList.length; i++) {
                if (cc.dd.user.id == userList[i].userid) {
                    if ((userList[i].baolistList.length || userList[i].baolistseeList.length) && !RoomMgr.Instance().isAoHanMJ()) {
                        this.baopaoNode.active = true;
                        this.baopaoNode.getComponent('mj_jiesuan_baopai').setData(userList[i]);
                    } else {
                        this.baopaoNode.active = false;
                    }
                }

            }

            if (RoomMgr.Instance().isSuiHuaMJ()) {
                if (RoomMgr.Instance()._Rule.ismoyu && data.baopaiList.length) {
                    this.baopaoNode.active = true;
                    this.baopaoNode.getComponent('mj_jiesuan_baopai').setMoyuData(data.baopaiList);
                }
            }
        }


        //显示荒庄
        this.shengliSp[0].active = false;

        if (RoomMgr.Instance().isUseNeiMengMJConfig()) {
            this.shengliSp[1].active = false;
            this.shengliSp[2].active = false;
            if (data.huuserid == cc.dd.user.id) {
                this.shengliSp[1].active = true;
                AudioManager.playSound(nmmj_audio_path.Sound_Effect_Win);
            } else if (!data.huuserid) {
                this.shengliSp[0].active = true;
                AudioManager.playSound(nmmj_audio_path.Sound_Effect_Stream);
            } else {
                this.shengliSp[2].active = true;
                AudioManager.playSound(nmmj_audio_path.Sound_Effect_Win);
            }
        } else if (RoomMgr.Instance().isXueLiuMJ() || RoomMgr.Instance().isXueZhanMJ()) {
            let score = this.initUserInfoSC(data);
            if (score < 0) {
                this.shengliSp[2].active = true;
                AudioManager.playSound(jlmj_audio_path.Sound_Effect_Win);
            } else if (score > 0) {
                this.shengliSp[1].active = true;
                AudioManager.playSound(jlmj_audio_path.Sound_Effect_Win);
            } else {
                this.shengliSp[0].active = true;
                AudioManager.playSound(jlmj_audio_path.Sound_Effect_Stream);
            }
        } else if (RoomMgr.Instance().isJiSuMJ()) {
            let score = this.initUserInfoJS(data);
            if (score > 0) {
                this.shengliSp[0].active = true;
                this.shengliSp[1].active = false;
            } else {
                this.shengliSp[1].active = true;
                this.shengliSp[0].active = false;
            }
        } else if (RoomMgr.Instance().isHeLongMJ()) {
            if (data.isshangjuhuangzhuang) {
                this.shengliSp[1].active = true;
            } else {
                this.shengliSp[1].active = false;
            }
        } else {
            if (!data.huuserid) {
                this.shengliSp[0].active = true;
            }
        }

        if (this._waitAdminAnima) {
            return;
        }
        this._waitAdminAnima = true;
        this.node.stopAllActions();

        let canvas_node = cc.find('Canvas');
        this.nodeScaleX = 1
        this.nodeScaleY = 1

        if (canvas_node.width / canvas_node.height <= 4 / 3) {
            this.nodeScaleX = 1
            this.nodeScaleY = 1
        } else {
            this.nodeScaleX = canvas_node.width / this.node.width
            this.nodeScaleY = canvas_node.height / this.node.height
        }

        // if(canvas_node.width / canvas_node.height >= this.node.width / this.node.height){
        //     this.nodeScaleX = canvas_node.width/this.node.width
        //     this.nodeScaleY = canvas_node.height/this.node.height
        // }
        this.node.scaleX = 0;
        this.node.scaleY = 0;

        this.node.active = true;

        this.node.runAction(cc.scaleTo(0.2, this.nodeScaleX, this.nodeScaleY));
    },

    /**
     * 荒庄时的调用
     */
    initUserInfoH: function (data) {
        this.userInfo.forEach(function (node) {
            node.active = false;
        });
        var userList = data.playercoininfoList;
        var userInfo = this.initPlayerInfo(userList);
        var idx = 1;
        for (var i = 0; userList && i < userList.length; i++) {
            // userList[i].isBank =deskData.Instance().getBanker(userList[i].userid);
            userList[i].isBank = data.jiesuanBanker == userList[i].userid;
            userList[i].uinfo = userInfo[userList[i].userid];
            let _player = playerMgr.Instance().getPlayer(userList[i].userid);
            if (_player) {
                userList[i].playerPaoFen = _player.paofen;
            }
            if (userList[i].userid == cc.dd.user.id) {
                this.userInfo[0].getComponent('jlmj_jiesuan_userInfo').setData(userList[i]);
                this.userInfo[0].active = true;
            } else {
                this.userInfo[idx].getComponent('jlmj_jiesuan_userInfo').setData(userList[i]);
                this.userInfo[idx].active = true;
                idx++;
            }
        }
    },
    /**
     * 正常结算时显示玩家信息
     * @param data
     */


    initUserInfo: function (data) {
        var key = 1;
        var userList = data.playercoininfoList;
        let hutypeList = data.hutypeList.slice();
        if (RoomMgr.Instance().isJinZhouMJ() || RoomMgr.Instance().isHeiShanMJ()) {//三清四清判断
            let mengQing = 0
            let huPaiMenQing = false;
            for (let i = 0; i < userList.length; i++) {
                if (this.checkMenQing(userList[i], data.huuserid, hutypeList)) {
                    mengQing++
                }
                if (userList[i].userid == data.huuserid && userList[i].isxiaosa) {
                    huPaiMenQing = true;
                }
            }

            if (RoomMgr.Instance().isJinZhouMJ()) {
                if (RoomMgr.Instance()._Rule.is3qing) {
                    if (mengQing == 3 && hutypeList.indexOf(-1) == -1) {
                        if (RoomMgr.Instance()._Rule.usercountlimit == 4) {
                            if (!huPaiMenQing) {
                                hutypeList.push(-1);
                            }
                        } else if (RoomMgr.Instance()._Rule.usercountlimit == 3) {
                            hutypeList.push(-1);
                        }
                    }
                }

                if (RoomMgr.Instance()._Rule.is4qing) {
                    if (mengQing == 4 && hutypeList.indexOf(-2) == -1) {
                        hutypeList.push(-2);
                    }
                }
            } else {
                if (mengQing == 3 && hutypeList.indexOf(-1) == -1) {
                    if (RoomMgr.Instance()._Rule.usercountlimit == 4) {
                        if (!huPaiMenQing) {
                            hutypeList.push(-1);
                        }
                    } else if (RoomMgr.Instance()._Rule.usercountlimit == 3) {
                        hutypeList.push(-1);
                    }
                }

                if (mengQing == 4 && hutypeList.indexOf(-2) == -1) {
                    hutypeList.push(-2);
                }
            }

            // if(hutypeList.indexOf(18) == -1 && hutypeList.indexOf(20) == -1){
            //     if(this.g_id == Define.GameType.JZMJ_GOLD || this.g_id == Define.GameType.JZMJ_FRIEND){
            //         if(RoomMgr.Instance()._Rule.is3qing){
            //             if(mengQing == 3 && hutypeList.indexOf(-1) == -1){
            //                 if(RoomMgr.Instance()._Rule.usercountlimit == 3){
            //                     hutypeList.push(-1);
            //                 }else{
            //                     if(hutypeList.indexOf(9) == -1 && hutypeList.indexOf(10) == -1){//排除门清七对
            //                         hutypeList.push(-1);
            //                     }
            //                 }
            //             }
            //         }
            //
            //         if(RoomMgr.Instance()._Rule.is4qing){
            //             if(mengQing == 4 && hutypeList.indexOf(-2) == -1){
            //                 hutypeList.push(-2);
            //             }
            //         }
            //     }else{
            //         if(mengQing == 3 && hutypeList.indexOf(-1) == -1){
            //             if(hutypeList.indexOf(9) == -1 && hutypeList.indexOf(10) == -1){
            //                 hutypeList.push(-1);
            //             }
            //         }
            //
            //         if(mengQing == 4 && hutypeList.indexOf(-2) == -1){
            //             hutypeList.push(-2);
            //         }
            //     }
            //
            // }

        }


        var userInfo = this.initPlayerInfo(userList);
        this.userInfo.forEach(function (node) {
            node.active = false;
        });
        for (var i = 0; userList && i < userList.length; ++i) {
            // userList[i].isBank = deskData.Instance().getBanker(userList[i].userid);
            userList[i].isBank = data.jiesuanBanker == userList[i].userid;
            userList[i].uinfo = userInfo[userList[i].userid];
            let _player = playerMgr.Instance().getPlayer(userList[i].userid);
            if (_player) {
                userList[i].playerPaoFen = _player.paofen;
            }
            if (data.huuserid == userList[i].userid) {//胡牌的玩家  要放在结算列表的第一个
                this.userInfo[0].getComponent('jlmj_jiesuan_userInfo').setData(userList[i], hutypeList);
                this.userInfo[0].active = true;
            } else {
                if (userList[i].userid == data.dianpaoplayerid) {
                    var hutype = [];
                    hutype.push(2);
                    this.userInfo[key].getComponent('jlmj_jiesuan_userInfo').setData(userList[i], hutype);
                } else {
                    this.userInfo[key].getComponent('jlmj_jiesuan_userInfo').setData(userList[i]);
                }
                this.userInfo[key].active = true;
                key++;
            }
        }
    },

    checkMenQing(data, huuserid, hutypeList) {
        // let isMenQing = true;
        // for(let i = 0; i < data.pailistList.length; i++){
        //     let info = data.pailistList[i];
        //     if(info.cardtype == cardType.CHI || info.cardtype == cardType.PENG || info.cardtype == cardType.BUGANG){
        //         if(info.cardtype == cardType.BUGANG && hutypeList.indexOf(3) != -1){
        //             continue;//去自摸
        //         }
        //         if(info.cardinfo.cardindexList.length != 0){
        //             isMenQing = false;
        //         }
        //     }else if(info.cardtype == cardType.GANG){
        //         if(info.cardinfo.cardindexList.length != 0 && info.cardinfo.type != teshuType.AN_GANG){
        //             isMenQing = false;
        //         }
        //     }else if(info.cardtype == cardType.SHOUPAI && info.cardinfo.cardindexList.length >= 13){
        //         let cardType = {}
        //         info.cardinfo.cardindexList.forEach((id)=>{
        //             let pengDes = pai3d_value.desc[id].split('[')[0];
        //             if(cardType.hasOwnProperty(pengDes)){
        //                 cardType[pengDes]++;
        //             }else{
        //                 cardType[pengDes] = 1;
        //             }
        //         })
        //
        //         let is7Dui = 0
        //         for(let k in cardType){
        //             if(cardType.hasOwnProperty(k) && cardType[k] == 2){
        //                 is7Dui++;
        //             }
        //         }
        //
        //         if(is7Dui >= 6){
        //             if(huuserid == data.userid){
        //                 if(hutypeList.indexOf(18) != -1 || hutypeList.indexOf(20) != -1){
        //                     isMenQing = false;//天地胡的七对不算门清
        //                 }
        //             }else{
        //                 isMenQing = false;//非胡牌的七对不算门清
        //             }
        //         }
        //     }
        // }
        // return isMenQing;

        return data.isxiaosa;
    },

    /**
     * 初始化玩家信息
     */
    initPlayerInfo: function (list) {
        var fangwei_info = [];//输出方位属性
        var zuowei_id = 0;//自己的方位
        var u_info = {};

        //寻找自己的方位并设置属性（自己）
        //var len = 4;
        var len = 0;
        if (RoomMgr.Instance()._Rule) {
            len = RoomMgr.Instance()._Rule.usercountlimit;
        } else {
            len = playerMgr.Instance().playerList.length;
        }
        var fangwei = jlmj_str.fangwei[len - 2];

        if (RoomMgr.Instance().isXueLiuMJ() || RoomMgr.Instance().isXueZhanMJ()) {
            let idx = 0;
            playerMgr.Instance().playerList.forEach(function (player) {
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
                    idx++;
                }
            });
        } else {
            playerMgr.Instance().playerList.forEach(function (player, idx) {
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

        /*for(var i in list) {
            fangwei_info[i*1] = {
                uid:list[i*1].userid,
                fangwei:null,
                zuowei:i*1,
                ziji:false,
                head:"",
                next:i==len-1?0:i*1+1,
                up:  i==0?len-1:i*1-1,
            };
            if(i*1 == 1)
            {
                zuowei_id = i*1;
            }else{
                fangwei_info[i*1].ziji=true;
            }
        }*/

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
     * 倒计时结束
     */
    schEndCall: function () {

    },
    /**
     * 发送离开房间
     */
    sendLeave: function () {
        // 取消匹配状态
        var msg = {};
        msg.status = 7;
        DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
    },

    openMatch() {
        cc.gateNet.Instance().dispatchTimeOut(1);
        this.clearDesktop();
        playerMgr.Instance().clear();
        this.closeJieSuan();

        if (!deskData.Instance().inJueSai) {
            var pbData = new cc.pb.match.msg_match_round_end_line_req();
            cc.gateNet.Instance().sendMsg(cc.netCmd.match.cmd_msg_match_round_end_line_req, pbData, "msg_match_round_end_line_req", true);
        }
        cc.gateNet.Instance().clearDispatchTimeout();
    },

    openMatchWithOutReq() {
        this.clearDesktop();
        playerMgr.Instance().clear();
        this.closeJieSuan();
    },

    /**
     * 战绩统计回调
     */
    zhanjiBtnCallBack: function () {
        if (cc.isPaused || cc.dd.resumeing) {
            return;
        }
        DeskED.notifyEvent(DeskEvent.SHOW_RESULT_VIEW, [true]);

        if (RoomMgr.Instance().isUseNeiMengMJConfig()) {
            this.node.active = false;
        } else {
            this.closeCallBack();
        }
    },

    /**
     * 分享关闭
     */
    shardBtnClose: function () {
        this.shareNode.active = false;
    },
    /**
     * 分享回调简易
     */
    shardJYBtnCallBack: function () {
        jlmj_audio_mgr.com_btn_click();
        this.shareNode.active = true;
        var sprite = this.shareNode.getChildByName('share_btn_node');
        sprite.y = -65;
    },
    /**
     * 分享回调详细
     */
    shardXXBtnCallBack: function () {
        jlmj_audio_mgr.com_btn_click();
        this.shareNode.active = true;
        var sprite = this.shareNode.getChildByName('share_btn_node');
        // if(RoomMgr.Instance().isXueLiuMJ() || RoomMgr.Instance().isXueZhanMJ()){
        //     sprite.y = -108;
        // }else{
        sprite.y = -160;
        // }
    },
    /**
     * 继续回调
     */
    goOnBtnCallBack: function () {
        if (cc.isPaused || cc.dd.resumeing) {
            return;
        }

        jlmj_audio_mgr.com_btn_click();
        if (this.isLastJiesuan) {
            this.closeJieSuan();
        } else if (deskData.Instance().isFriend()) {
            this.pyReady();
        } else if (deskData.Instance().isMatch()) {
            this.openMatch();
        } else {
            this.jbcReady();
        }

    },

    closeJieSuan: function () {
        this.close();
    },

    /**
     * 朋友场准备回调
     */
    pyReady: function () {
        DeskED.notifyEvent(DeskEvent.PY_READY, [this]);

        deskData.Instance().clear();
        playerMgr.Instance().clear();
        this.close();
    },

    /**
     *金币场准备回调
     */
    jbcReady: function () {
        DeskED.notifyEvent(DeskEvent.JBC_READY, [this]);

        this.clearDesktop();
        playerMgr.Instance().clear();
        this.closeJieSuan();
    },

    /**
     * 换桌 按钮 回调
     * @param event
     * @param data
     */
    onReplaceDesktop: function (event, data) {
        if (cc.isPaused || cc.dd.resumeing) {
            return;
        }
        jlmj_audio_mgr.com_btn_click();
        this.sendReplaceDesktop();
    },

    /**
     * 清理桌内
     */
    clearDesktop: function () {
        deskData.Instance().clear();
    },

    /**
     * 发送换桌协议
     */
    sendReplaceDesktop: function () {
        DeskED.notifyEvent(DeskEvent.CHANGE_ROOM, [this]);

        this.clearDesktop();
        playerMgr.Instance().clear();
        this.closeJieSuan();
    },


    /**
     * close回调
     */
    closeCallBack: function () {
        jlmj_audio_mgr.com_btn_click();
        this.xiangxiLayer.active = false;
        this.jianyiLayer.active = true;
        // if(!RoomMgr.Instance().isXueZhanMJ() && !RoomMgr.Instance().isXueLiuMJ()){
        this.maskNode.active = false;
        this.goTimeTTF.node.active = false;
        // }
    },
    close: function () {
        this._endCall();
        this.node.removeFromParent();
        this.node.destroy();
        clearInterval(this._goTimeID);
    },
    /**
     * 获取系统时间
     */
    getSysTime: function () {
        var date = new Date();
        var seperator1 = "/";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var min = date.getMinutes();
        if (min < 10) {
            min = '0' + min;
        }
        var sec = date.getSeconds();
        if (sec < 10) {
            sec = '0' + sec;
        }

        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + min
            + seperator2 + sec;
        return currentdate;
    },

    onClickBack() {
        if (cc.isPaused || cc.dd.resumeing) {
            return;
        }
        var msg = {};
        msg.status = 5;
        DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
    },

    onClickDissolve() {
        if (cc.isPaused || cc.dd.resumeing) {
            return;
        }
        var msg = {};
        msg.status = 3;
        DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
    },

    disableButton() {
        this.jiesuanBtn.getComponent(cc.Button).interactable = false;
        this.huanzhuoBtn_1.getComponent(cc.Button).interactable = false;
        this.shareBtn_1.getComponent(cc.Button).interactable = false;
        this.goOnBtn_1.getComponent(cc.Button).interactable = false;
        this.zhanjiBtn_1.getComponent(cc.Button).interactable = false;

        this.huanzhuoBtn.getComponent(cc.Button).interactable = false;
        this.shardBtn.getComponent(cc.Button).interactable = false;
        this.goOnBtn.getComponent(cc.Button).interactable = false;
        this.zhanjiBtn.getComponent(cc.Button).interactable = false;
        this.backLobby.getComponent(cc.Button).interactable = false;
        this.dissolveBtn.getComponent(cc.Button).interactable = false;
        this.hideBtn.getComponent(cc.Button).interactable = false;

        // this.xlShardBtn.getComponent(cc.Button).interactable = false;
        if (this.shardBtnFriend) {
            this.shardBtnFriend.getComponent(cc.Button).interactable = false;
        }
    },

    regTouchEvent: function () {
        if (this.maskNode) {
            this.maskNode.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
            this.maskNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
            this.maskNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
            this.maskNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this));
        }
    },

    unRegTouchEvent: function () {
        if (this.maskNode) {
            this.maskNode.off(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
            this.maskNode.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
            this.maskNode.off(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
            this.maskNode.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this));
        }
    },

    touchStart: function () {
        this.mask.active = false;
        this.xiangxiLayer.active = false;
    },
    touchMove: function () {

    },
    touchEnd: function () {
        this.mask.active = true;
        this.xiangxiLayer.active = true;
    },
    touchCancel: function () {
        this.mask.active = true;
        this.xiangxiLayer.active = true;
    },

    //血战血流
    initUserInfoSC(data) {
        let score = 0;
        let liuju = 0;//4家没胡牌即为流局

        var key = 1;
        var userList = data.playercoininfoList;
        var userInfo = this.initPlayerInfo(userList);

        this.content.removeAllChildren();

        // let gangList = [];
        // let huList = [];
        let gangHuList = [];
        let tuigangList = [];
        let checkJiaoList = [];
        let huaZhuList = [];
        let huLengthList = [];

        for (var i = 0; userList && i < userList.length; ++i) {
            // if(userList[i].chajiaoinfoList.length > 0 || item.hasOwnProperty("huazhuinfo")){
            //     checkJiaoList.push({
            //         userId: userList[i].userid,
            //         chajiaoinfoList: userList[i].chajiaoinfoList,
            //         huazhuinfo: userList[i].hasOwnProperty("huazhuinfo") ? userList[i].huazhuinfo : null,
            //     });
            // }

            // userList[i].isBank = deskData.Instance().getBanker(userList[i].userid);
            userList[i].isBank = data.jiesuanBanker == userList[i].userid;
            userList[i].uinfo = userInfo[userList[i].userid];
            if (cc.dd.user.id == userList[i].userid) {
                // if(userList[i].huinfoList.length <= 0){
                //     notHu = true;
                // }
                score = userList[i].score;
                this.userInfo[0].getComponent('jlmj_jiesuan_userInfo').setData(userList[i]);
            } else {
                this.userInfo[key].getComponent('jlmj_jiesuan_userInfo').setData(userList[i]);
                this.userInfo[key].active = true;
                key++;
            }

            for (let m = 0; m < userList[i].ganginfoList.length; m++) {
                gangHuList.push({
                    isGang: true,
                    data: userList[i].ganginfoList[m],
                    index: userList[i].ganginfoList[m].gangindex,
                })
            }
            for (let m = 0; m < userList[i].huinfoList.length; m++) {
                gangHuList.push({
                    isGang: false,
                    data: userList[i].huinfoList[m],
                    index: userList[i].huinfoList[m].huindex,
                })
            }
            // gangList = gangList.concat(userList[i].ganginfoList);
            // huList = huList.concat(userList[i].huinfoList);
            checkJiaoList = checkJiaoList.concat(userList[i].chajiaoinfoList);
            if (userList[i].hasOwnProperty("huazhuinfo")) {
                huaZhuList.push(userList[i].huazhuinfo);
            }

            if (userList[i].isyoujiao === false) {
                tuigangList.push(userList[i].userid);
            }

            if (userList[i].huinfoList == 0) {
                liuju++;
            }
        }

        if (key < this.userInfo.length) {
            for (let i = key; i < this.userInfo.length; i++) {
                // this.userInfo[i].getComponent('scmj_jiesuan_userInfo').clear();
                this.userInfo[i].active = false;
            }
        }

        gangHuList.sort((a, b) => {
            return a.index - b.index;
        });
        this.infoData = {
            gangHuList: gangHuList,
            userInfo: userInfo,
            tuigangList: tuigangList,
            checkJiaoList: checkJiaoList,
            huaZhuList: huaZhuList,
            isLiuju: liuju > 1 && deskData.Instance().remainCards == 0,

        }
        // this.setSCInfo(gangHuList, userInfo, tuigangList, checkJiaoList, huaZhuList, liuju > 1 && deskData.Instance().remainCards == 0);

        return score;
    },

    /**
     * 设置详细信息
     * @param userId
     */
    setSCInfo(userId) {
        this.content.removeAllChildren();

        let gangHuList = this.infoData.gangHuList.concat();
        let userInfo = this.infoData.userInfo;
        let tuigangList = this.infoData.tuigangList.concat();
        let checkJiaoList = this.infoData.checkJiaoList.concat();
        let huaZhuList = this.infoData.huaZhuList.concat();
        let isLiuju = this.infoData.isLiuju;

        let gangindex = [];

        for (let m = 0; m < gangHuList.length; m++) {
            let info = gangHuList[m];
            let data = info.data;
            if (info.isGang) {
                let hasBenGang = false;

                if (data.isgangzhuanyi) {
                    let totalLosefen = 0
                    for (let j = 0; j < data.loserdataList.length; j++) {
                        totalLosefen += data.loserdataList[j].gangfen;
                    }

                    /**
                     * totalLosefen < data.winnerdata.gangfen，表示下雨杠转移，要加上转移者，服务器没有传
                     * totalLosefen > data.winnerdata.gangfen，表示一个杠转移给了多个玩家，赢分被分了，就比输分少
                     */
                    if (Math.abs(totalLosefen) < data.winnerdata.gangfen) {
                        data.loserdataList.push({
                            userid: data.winuserid,
                            fan: data.loserdataList[0].fan,
                            gangfen: data.loserdataList[0].gangfen,
                            realgangfen: data.loserdataList[0].realgangfen
                        });
                    }
                }

                for (let j = 0; j < data.loserdataList.length; j++) {
                    if (data.loserdataList[j].userid == userId && data.loserdataList[j].gangfen != 0 && gangindex.indexOf(data.gangindex) == -1) {
                        hasBenGang = true;
                        gangindex.push(data.gangindex);
                    }
                }

                if ((data.winnerdata.userid == userId && data.winnerdata.gangfen != 0) || hasBenGang) {
                    let node = cc.instantiate(this.jiesuanItem);
                    node.getComponent("scmj_jiesuan_item").setplayer(userId);
                    node.getComponent("scmj_jiesuan_item").setGangData(data, userInfo, data.winnerdata.userid == userId);
                    this.content.addChild(node);

                    if (tuigangList.indexOf(data.winnerdata.userid) != -1) {
                        //杠了无叫，判断是否被查叫
                        // let wuJiao = false;
                        // for(let k = 0; k < checkJiaoList.length; k++) {
                        //     for (let j = 0; j < checkJiaoList[k].chajiaouseridList.length; j++) {
                        //         if (checkJiaoList[k].chajiaouseridList[j] == data.winnerdata.userid) {
                        //             wuJiao = true;
                        //         }
                        //     }
                        // }

                        if (isLiuju) {
                            let node = cc.instantiate(this.jiesuanItem);
                            node.getComponent("scmj_jiesuan_item").setplayer(userId);
                            node.getComponent("scmj_jiesuan_item").setTuiGangData(data, userInfo, data.winnerdata.userid == userId);
                            this.content.addChild(node);
                        }
                    }
                }

                if (data.isgangzhuanyi && (data.winnerdata.userid == userId || data.winuserid == userId)) {
                    let node = cc.instantiate(this.jiesuanItem);
                    node.getComponent("scmj_jiesuan_item").setplayer(userId);
                    node.getComponent("scmj_jiesuan_item").setGangZhuanYiData(data, userInfo, data.winuserid == userId);
                    this.content.addChild(node);
                }
            } else {
                if (data.huuserid == userId || data.loseuseridList.indexOf(userId) != -1) {
                    let node = cc.instantiate(this.jiesuanItem);
                    node.getComponent("scmj_jiesuan_item").setplayer(userId);
                    node.getComponent("scmj_jiesuan_item").setHuData(data, userInfo, data.huuserid == userId);
                    this.content.addChild(node);
                }
            }
        }

        for (let i = 0; i < checkJiaoList.length; i++) {
            let wuJiao = false;
            for (let j = 0; j < checkJiaoList[i].chajiaouseridList.length; j++) {
                if (checkJiaoList[i].chajiaouseridList[j] == userId) {
                    wuJiao = true;
                }
            }

            if (checkJiaoList[i].winuserid == userId || wuJiao) {
                let node = cc.instantiate(this.jiesuanItem);
                node.getComponent("scmj_jiesuan_item").setplayer(userId);
                node.getComponent("scmj_jiesuan_item").setWuJiao(checkJiaoList[i], userInfo, checkJiaoList[i].winuserid == userId);
                this.content.addChild(node);
            }
        }

        for (let i = 0; i < huaZhuList.length; i++) {
            let hasHuaZhu = false;
            for (let j = 0; j < huaZhuList[i].huazhuuseridList.length; j++) {
                if (huaZhuList[i].huazhuuseridList[j] == userId) {
                    hasHuaZhu = true;
                }
            }

            if (huaZhuList[i].winuserid == userId || hasHuaZhu) {
                let node = cc.instantiate(this.jiesuanItem);
                node.getComponent("scmj_jiesuan_item").setplayer(userId);
                node.getComponent("scmj_jiesuan_item").setHuaZhu(huaZhuList[i], userInfo, huaZhuList[i].winuserid == userId, huaZhuList.length);
                this.content.addChild(node);
            }
        }
    },

    /**
     * 关闭血战详情
     */
    onClickCloseInfoNode() {
        jlmj_audio_mgr.com_btn_click();
        this.infoNode.active = false;
    },
    /**
     * 打开血战详情
     * @param target
     * @param data
     */
    onClickShowInfoNode(target, data) {
        jlmj_audio_mgr.com_btn_click();
        let userId = this.userInfo[parseInt(data)].getComponent('jlmj_jiesuan_userInfo').userId;
        this.setSCInfo(userId);
        this.infoNode.active = true;
    },

    onClickMatch() {
        jlmj_audio_mgr.com_btn_click();
        if (cc.isPaused || cc.dd.resumeing) {
            return;
        }
        var msg = {};
        msg.status = 9;
        DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
    },

    onClickFree() {
        jlmj_audio_mgr.com_btn_click();
        if (cc.isPaused || cc.dd.resumeing) {
            return;
        }
        this.stopTime();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_GET_COIN);
    },

    /**
     * 极速麻将
     * @param data
     * @returns {number}
     */
    initUserInfoJS(data) {
        let userList = data.playercoininfoList;
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].userid == cc.dd.user.id) {
                this.userInfo[0].getComponent('jlmj_jiesuan_userInfo').setData(userList[i], data.hutypeList.slice());
                return userList[i].total;
            }
        }

        return 0;

    }
});
