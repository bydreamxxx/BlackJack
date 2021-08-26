var playerMgr = require('jlmj_player_mgr');
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var dd = cc.dd;
var JieSanData = require('jlmj_jiesan_data').JieSanData.Instance();
var AgreeStatus = require('jlmj_jiesan_data').AgreeStatus;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
let Define = require('Define');

const _colorT = [cc.color(189, 193, 185), cc.color(68, 118, 74), cc.color(187, 48, 30)];  //同意  取消

var jlmj_sponsor_dissolve_view = cc.Class({
    extends: cc.Component,

    properties: {
        root: { default: null, type: cc.Node, tooltip: '根节点用于显示', },

        timeTTF: cc.Label, //时间 第一个是分钟 第二个倒计时
        userHeadSp: { default: [], type: cc.Sprite, tooltip: '头像', },
        usernameTTF: { default: [], type: cc.Label, tooltip: '名字', },
        userAgreeTTF: { default: [], type: cc.Label, tooltip: '是否同', },
        userID: { default: [], type: cc.Label, tooltip: 'ID', },

        button_refuse: { default: null, type: cc.Button, tooltip: '拒绝', },
        button_agree: { default: null, type: cc.Button, tooltip: '同意', },
        sponsorId: cc.Label,
        tips: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        if (this.tips) {
            this.tips.string = "超过3分钟未做选择，则默认同意解散";
        }

        var g_id = RoomMgr.Instance().gameId;
        if (g_id == Define.GameType.CCMJ_GOLD || g_id == Define.GameType.CCMJ_FRIEND) {
            playerMgr = require('ccmj_player_mgr');
            JieSanData = require('ccmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('ccmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.JLMJ_GOLD || g_id == Define.GameType.JLMJ_FRIEND) {
            playerMgr = require('jlmj_player_mgr');
            JieSanData = require('jlmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('jlmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.NAMJ_GOLD || g_id == Define.GameType.NAMJ_FRIEND) {
            playerMgr = require('namj_player_mgr');
            JieSanData = require('namj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('namj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.FXMJ_GOLD || g_id == Define.GameType.FXMJ_FRIEND) {
            playerMgr = require('fxmj_player_mgr');
            JieSanData = require('fxmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('fxmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.SYMJ_GOLD || g_id == Define.GameType.SYMJ_FRIEND) {
            playerMgr = require('symj_player_mgr');
            JieSanData = require('symj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('symj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.XZMJ_GOLD || g_id == Define.GameType.XZMJ_FRIEND || g_id == Define.GameType.XLMJ_GOLD || g_id == Define.GameType.XLMJ_FRIEND) {
            playerMgr = require('scmj_player_mgr');
            JieSanData = require('scmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('scmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.SHMJ_GOLD || g_id == Define.GameType.SHMJ_FRIEND) {
            playerMgr = require('shmj_player_mgr');
            JieSanData = require('shmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('shmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.JZMJ_GOLD || g_id == Define.GameType.JZMJ_FRIEND) {
            playerMgr = require('jzmj_player_mgr');
            JieSanData = require('jzmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('jzmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.HSMJ_GOLD || g_id == Define.GameType.HSMJ_FRIEND) {
            playerMgr = require('hsmj_player_mgr');
            JieSanData = require('hsmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('hsmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.TDHMJ_GOLD || g_id == Define.GameType.TDHMJ_FRIEND) {
            playerMgr = require('tdhmj_player_mgr');
            JieSanData = require('tdhmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('tdhmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.CFMJ_GOLD || g_id == Define.GameType.CFMJ_FRIEND) {
            playerMgr = require('cfmj_player_mgr');
            JieSanData = require('cfmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('cfmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.AHMJ_GOLD || g_id == Define.GameType.AHMJ_FRIEND) {
            playerMgr = require('ahmj_player_mgr');
            JieSanData = require('ahmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('ahmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.FZMJ_GOLD || g_id == Define.GameType.FZMJ_FRIEND) {
            playerMgr = require('fzmj_player_mgr');
            JieSanData = require('fzmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('fzmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.WDMJ_GOLD || g_id == Define.GameType.WDMJ_FRIEND) {
            playerMgr = require('wdmj_player_mgr');
            JieSanData = require('wdmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('wdmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.PZMJ_GOLD || g_id == Define.GameType.PZMJ_FRIEND) {
            playerMgr = require('pzmj_player_mgr');
            JieSanData = require('pzmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('pzmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.BCMJ_GOLD || g_id == Define.GameType.BCMJ_FRIEND) {
            playerMgr = require('bcmj_player_mgr');
            JieSanData = require('bcmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('bcmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.ACMJ_GOLD || g_id == Define.GameType.ACMJ_FRIEND) {
            playerMgr = require('acmj_player_mgr');
            JieSanData = require('acmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('acmj_jiesan_data').AgreeStatus;
        } else if (g_id == Define.GameType.HLMJ_GOLD || g_id == Define.GameType.HLMJ_FRIEND) {
            playerMgr = require('hlmj_player_mgr');
            JieSanData = require('hlmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('hlmj_jiesan_data').AgreeStatus;
            this.tips.string = "超过1分钟未做选择，则默认同意解散";
        } else if (g_id == Define.GameType.JSMJ_GOLD) {
            playerMgr = require('jsmj_player_mgr');
            JieSanData = require('jsmj_jiesan_data').JieSanData.Instance();
            AgreeStatus = require('jsmj_jiesan_data').AgreeStatus;
        }
    },

    onEnable: function () {
        this.updateUI();
    },
    onDisable: function () {
        this.stopCd();
    },

    onDestroy: function () {
        this.stopCd();
    },


    ctor: function () {
        this.cdFunc = null;
        this.cdTime = null;
    },

    updateUI: function () {
        this.button_refuse.node.active = true;
        this.button_agree.node.active = true;

        //发起解散的人
        this.sponsorId.string = "ID:" + JieSanData.sponsorId;

        //玩家信息
        this.userHeadSp.forEach(function (sp) {
            sp.node.active = false;
        });

        this.usernameTTF.forEach(function (name) {
            name.node.active = false;
        });

        this.userAgreeTTF.forEach(function (agree) {
            agree.node.active = false;
        });

        this.userID.forEach(function (id) {
            id.node.active = false;
        });

        var tmpIndx = 1;
        playerMgr.Instance().playerList.forEach(function (player, idx) {
            if (player.userId == JieSanData.sponsorId) {
                idx = 0;
            } else {
                idx = tmpIndx;
                tmpIndx++;
            }
            this.updatePlayer(player, idx);
            this.userHeadSp[idx].node.active = true;
            this.usernameTTF[idx].node.active = true;
            this.userID[idx].node.active = true;
            if (idx != 0)
                this.userAgreeTTF[idx].node.active = true;
        }, this);

        //cd
        this.startCd(JieSanData.countDown);
    },

    /**
     * 同意,拒绝后,更新UI. 这里不更新倒计时
     */
    updateAgreeUI: function () {
        this.button_refuse.node.active = true;
        this.button_agree.node.active = true;

        //发起解散的人
        this.sponsorId.string = "ID:" + JieSanData.sponsorId;

        //玩家信息
        this.userHeadSp.forEach(function (sp) {
            sp.node.active = false;
        });

        this.usernameTTF.forEach(function (name) {
            name.node.active = false;
        });

        this.userAgreeTTF.forEach(function (agree) {
            agree.node.active = false;
        });

        this.userID.forEach(function (id) {
            id.node.active = false;
        });

        var tmpIndx = 1;
        playerMgr.Instance().playerList.forEach(function (player, idx) {
            if (player.userId == JieSanData.sponsorId) {
                idx = 0;
            } else {
                idx = tmpIndx;
                tmpIndx++;
            }
            this.updatePlayer(player, idx);
            this.userHeadSp[idx].node.active = true;
            this.usernameTTF[idx].node.active = true;
            this.userID[idx].node.active = true;
            if (idx != 0)
                this.userAgreeTTF[idx].node.active = true;
        }, this);
    },

    // 更新玩家信息
    updatePlayer: function (player, idx) {

        //头像
        var headSize = this.userHeadSp[idx].node.getContentSize();
        if (player.headUrl) {
            cc.dd.SysTools.loadWxheadH5(this.userHeadSp[idx], player.headUrl);
        } else {
            var str = 'gameyj_mj/changchun/py/textures/hd_female.png';
            if (player.sex == 1) {//男人
                str = 'gameyj_mj/changchun/py/textures/hd_male.png';
            }
            var sp = new cc.SpriteFrame(str);
            this.userHeadSp[idx].spriteFrame = sp;
        }



        this.userHeadSp[idx].node.setContentSize(headSize);

        //名字
        this.usernameTTF[idx].string = cc.dd.Utils.substr(player.nickname, 0, 6);
        this.userID[idx].string = "ID:" + player.userId;
        //玩家id
        this.userAgreeTTF[idx].__id = player.userId;

        //解散状态
        var agreeState = JieSanData.GetPlayerAgreeStatus(player.userId);
        if (agreeState == AgreeStatus.Agree_Wait) {
            this.userAgreeTTF[idx].string = '等待中';
            this.userAgreeTTF[idx].node.color = _colorT[0];
        } else if (agreeState == AgreeStatus.Agree_Agree) {
            this.userAgreeTTF[idx].string = '已同意';
            this.userAgreeTTF[idx].node.color = _colorT[1];
            if (player.userId == cc.dd.user.id) {
                this.button_refuse.node.active = false;
                this.button_agree.node.active = false;
            }
        } else {
            this.userAgreeTTF[idx].string = '已拒绝';
            this.userAgreeTTF[idx].node.color = _colorT[2];

            var str = cc.dd.Text.TEXT_DESK_INFO_3.format([cc.dd.Utils.substr(player.nickname, 0, 5)]);
            dd.DialogBoxUtil.show(1, str, "确定", null, null, null);
            cc.dd.UIMgr.closeUI(this.node);
        }
    },

    /**
     * 发送是否同意解散房间
     @ @param bool 是否同意
     */
    sendIsAgree: function (bool) {

        var g_id = RoomMgr.Instance().gameId;
        if (g_id == Define.GameType.CCMJ_GOLD || g_id == Define.GameType.CCMJ_FRIEND) {
            var msg = new cc.pb.changchunmajiang.p16_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.changchunmajiang.cmd_p16_req_response_dissolve_room, msg, "p16_req_response_dissolve_room");
        } else if (g_id == Define.GameType.JLMJ_GOLD || g_id == Define.GameType.JLMJ_FRIEND) {
            var msg = new cc.pb.jilinmajiang.p17_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_response_dissolve_room, msg, "p17_req_response_dissolve_room");
        } else if (g_id == Define.GameType.NAMJ_GOLD || g_id == Define.GameType.NAMJ_FRIEND) {
            var msg = new cc.pb.nonganmajiang.na_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.nonganmajiang.cmd_na_req_response_dissolve_room, msg, "na_req_response_dissolve_room");
        } else if (g_id == Define.GameType.FXMJ_GOLD || g_id == Define.GameType.FXMJ_FRIEND) {
            var msg = new cc.pb.fuxinmajiang.fx_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.fuxinmajiang.cmd_fx_req_response_dissolve_room, msg, "fx_req_response_dissolve_room");
        } else if (g_id == Define.GameType.SYMJ_GOLD || g_id == Define.GameType.SYMJ_FRIEND) {
            var msg = new cc.pb.songyuanmajiang.sy_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.songyuanmajiang.cmd_sy_req_response_dissolve_room, msg, "sy_req_response_dissolve_room");
        } else if (g_id == Define.GameType.XZMJ_GOLD || g_id == Define.GameType.XZMJ_FRIEND || g_id == Define.GameType.XLMJ_GOLD || g_id == Define.GameType.XLMJ_FRIEND) {
            var msg = new cc.pb.xuezhanmj.xzmj_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.xuezhanmj.cmd_xzmj_req_response_dissolve_room, msg, "xzmj_req_response_dissolve_room");
        } else if (g_id == Define.GameType.SHMJ_GOLD || g_id == Define.GameType.SHMJ_FRIEND) {
            var msg = new cc.pb.suihuamj.suihua_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.suihuamj.cmd_suihua_req_response_dissolve_room, msg, "suihua_req_response_dissolve_room");
        } else if (g_id == Define.GameType.JZMJ_GOLD || g_id == Define.GameType.JZMJ_FRIEND) {
            var msg = new cc.pb.jinzhoumj.jinzhou_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.jinzhoumj.cmd_jinzhou_req_response_dissolve_room, msg, "jinzhou_req_response_dissolve_room");
        } else if (g_id == Define.GameType.HSMJ_GOLD || g_id == Define.GameType.HSMJ_FRIEND) {
            var msg = new cc.pb.heishanmj.heishan_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.heishanmj.cmd_heishan_req_response_dissolve_room, msg, "heishan_req_response_dissolve_room");
        } else if (g_id == Define.GameType.TDHMJ_GOLD || g_id == Define.GameType.TDHMJ_FRIEND) {
            var msg = new cc.pb.neimenggumj.neimenggu_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.neimenggumj.cmd_neimenggu_req_response_dissolve_room, msg, "neimenggu_req_response_dissolve_room");
        } else if (g_id == Define.GameType.CFMJ_GOLD || g_id == Define.GameType.CFMJ_FRIEND) {
            var msg = new cc.pb.chifengmj.chifeng_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.chifengmj.cmd_chifeng_req_response_dissolve_room, msg, "chifeng_req_response_dissolve_room");
        } else if (g_id == Define.GameType.AHMJ_GOLD || g_id == Define.GameType.AHMJ_FRIEND) {
            var msg = new cc.pb.aohanmj.aohan_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.aohanmj.cmd_aohan_req_response_dissolve_room, msg, "aohan_req_response_dissolve_room");
        } else if (g_id == Define.GameType.FZMJ_GOLD || g_id == Define.GameType.FZMJ_FRIEND) {
            var msg = new cc.pb.fangzhengmj.fangzheng_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_response_dissolve_room, msg, "fangzheng_req_response_dissolve_room");
        } else if (g_id == Define.GameType.WDMJ_GOLD || g_id == Define.GameType.WDMJ_FRIEND) {
            var msg = new cc.pb.wudanmj.wudan_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_response_dissolve_room, msg, "wudan_req_response_dissolve_room");
        } else {
            var msg = new cc.pb.mjcommon.mj_req_response_dissolve_room();
            msg.setResponseid(dd.user.id);
            msg.setIsagree(bool);
            cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_response_dissolve_room, msg, "mj_req_response_dissolve_room");
        }

    },


    onAgree: function () {
        jlmj_audio_mgr.com_btn_click();

        this.sendIsAgree(true);
        this.button_refuse.node.active = false;
        this.button_agree.node.active = false;
    },

    onRefuse: function () {
        jlmj_audio_mgr.com_btn_click();

        this.sendIsAgree(false);
        this.button_refuse.node.active = false;
        this.button_agree.node.active = false;
    },

    /**
     * 倒计时
     * @param cdTime
     */
    startCd: function (cdTime) {
        this.stopCd();
        this.cdTime = cdTime;
        var fen = Math.floor(this.cdTime / 60);
        var miao = this.cdTime > 59 ? this.cdTime % 60 : this.cdTime;
        var miaoStr = miao > 9 ? "" + miao : "0" + miao
        this.timeTTF.string = "0" + fen + ':' + miaoStr;
        this.cdFunc = setInterval(function () {
            --this.cdTime;
            if (this.cdTime < 0) {
                this.stopCd();
                this.onAgree();
            } else {
                var fen = Math.floor(this.cdTime / 60);
                var miao = this.cdTime > 59 ? this.cdTime % 60 : this.cdTime;
                var miaoStr = miao > 9 ? "" + miao : "0" + miao
                this.timeTTF.string = "0" + fen + ':' + miaoStr;
            }
        }.bind(this), 1000);
    },

    stopCd: function () {
        if (this.cdFunc) {
            clearInterval(this.cdFunc);
            this.cdFunc = null;
        }
    },

    /**
     * 获取玩家head
     */
    getUserHeadForID: function (userID) {
        var play_list = null;
        var g_id = RoomMgr.Instance().gameId;
        if (g_id == Define.GameType.CCMJ_GOLD || g_id == Define.GameType.CCMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('ccmj_player_list');
        } else if (g_id == Define.GameType.JLMJ_GOLD || g_id == Define.GameType.JLMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        } else if (g_id == Define.GameType.NAMJ_GOLD || g_id == Define.GameType.NAMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('namj_player_list');
        } else if (g_id == Define.GameType.FXMJ_GOLD || g_id == Define.GameType.FXMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('fxmj_player_list');
        } else if (g_id == Define.GameType.SYMJ_GOLD || g_id == Define.GameType.SYMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('symj_player_list');
        } else if (g_id == Define.GameType.XZMJ_GOLD || g_id == Define.GameType.XZMJ_FRIEND || g_id == Define.GameType.XLMJ_GOLD || g_id == Define.GameType.XLMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('scmj_player_list');
        } else if (g_id == Define.GameType.SHMJ_GOLD || g_id == Define.GameType.SHMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('shmj_player_list');
        } else if (g_id == Define.GameType.JZMJ_GOLD || g_id == Define.GameType.JZMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('jzmj_player_list');
        } else if (g_id == Define.GameType.HSMJ_GOLD || g_id == Define.GameType.HSMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('hsmj_player_list');
        } else if (g_id == Define.GameType.TDHMJ_GOLD || g_id == Define.GameType.TDHMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('tdhmj_player_list');
        } else if (g_id == Define.GameType.CFMJ_GOLD || g_id == Define.GameType.CFMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('cfmj_player_list');
        } else if (g_id == Define.GameType.AHMJ_GOLD || g_id == Define.GameType.AHMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('ahmj_player_list');
        } else if (g_id == Define.GameType.FZMJ_GOLD || g_id == Define.GameType.FZMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('fzmj_player_list');
        } else if (g_id == Define.GameType.WDMJ_GOLD || g_id == Define.GameType.WDMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('wdmj_player_list');
        } else if (g_id == Define.GameType.PZMJ_GOLD || g_id == Define.GameType.PZMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('pzmj_player_list');
        } else if (g_id == Define.GameType.BCMJ_GOLD || g_id == Define.GameType.BCMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('bcmj_player_list');
        } else if (g_id == Define.GameType.ACMJ_GOLD || g_id == Define.GameType.ACMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('acmj_player_list');
        } else if (g_id == Define.GameType.HLMJ_GOLD || g_id == Define.GameType.HLMJ_FRIEND) {
            play_list = cc.find('Canvas/player_list').getComponent('hlmj_player_list');
        } else if (g_id == Define.GameType.ACMJ_GOLD) {
            play_list = cc.find('Canvas/player_list').getComponent('jsmj_player_list');
        }

        if (play_list) {
            var headinfo = play_list.getUserHeadNode(userID);
            if (headinfo) {
                return headinfo.head.getHeadSp();
            }
        }
        return null;
    },
});