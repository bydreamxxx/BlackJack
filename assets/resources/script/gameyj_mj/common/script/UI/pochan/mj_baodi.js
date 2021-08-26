var hall_audio_mgr = require('hall_audio_mgr');
var HallCommonObj = require('hall_common_data');
var HallCommonData = HallCommonObj.HallCommonData;
var PlayerBaseInfoMgr = require('hall_common_data').PlayerBaseInfoMgr.getInstance();
var data_vip = require('vip');
var Text = cc.dd.Text;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        dibao_label: cc.Label,
        cishu_label: cc.Label,
    },

    onLoad: function () {
        var playerInfo = PlayerBaseInfoMgr.findPlayerInfoById(cc.dd.user.id);
        if (playerInfo && playerInfo.info && playerInfo.info.vipLevel > 0) {
            var relief_coe = data_vip.items[playerInfo.info.vipLevel * 1].relief_coe.split(",");
            this.dibao_label.string = Text.TEXT_DIBAO_0.format(relief_coe[0]);
        }
        this.cishu_label.string = Text.TEXT_POCHAN_3.format([HallCommonData.getInstance().jiuji_cnt]);
    },
    onClose: function () {
        var jiesuan = null;
        switch (HallCommonData.getInstance().gameId) {
            case cc.dd.Define.GameType.CCMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('ccmj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.JLMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('jlmj_jbc_desk_info')._jiesuan;
                break;
            case 32:
                jiesuan = cc.find('Canvas/root/result_ani').getComponent('ddz_jiesuan_jbc');
                break;
            case 51:
                jiesuan = cc.find('Canvas/result').getComponent('nn_jiesuan_jbc');
                break;
            case cc.dd.Define.GameType.NAMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('namj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.FXMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('fxmj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.SYMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('symj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.XZMJ_GOLD:
            case cc.dd.Define.GameType.XLMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('scmj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.SHMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('shmj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.JZMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('jzmj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.HSMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('hsmj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.TDHMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.CFMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('cfmj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.AHMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('ahmj_desk_info_jbc')._jiesuan;
                break;
            case cc.dd.Define.GameType.FZMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('fzmj_desk_info')._jiesuan;
                break;
            case cc.dd.Define.GameType.WDMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('wdmj_desk_info')._jiesuan;
                break;
            case cc.dd.Define.GameType.PZMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('pzmj_desk_info')._jiesuan;
                break;
            case cc.dd.Define.GameType.BCMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('bcmj_desk_info')._jiesuan;
                break;
            case cc.dd.Define.GameType.ACMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('acmj_desk_info')._jiesuan;
                break;
            case cc.dd.Define.GameType.HLMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('hlmj_desk_info')._jiesuan;
                break;
            case cc.dd.Define.GameType.JSMJ_GOLD:
                jiesuan = cc.find('Canvas/desk_info').getComponent('jsmj_desk_info')._jiesuan;
                break;
        }
        if (jiesuan != null) {
            jiesuan.startTime();
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onOK: function () {
        if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.CCMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('ccmj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }
        else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.JLMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('jlmj_jbc_desk_info')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }
        else if (HallCommonData.getInstance().gameId == 32) {
            var jiesuan = cc.find('Canvas/root/result_ani').getComponent('ddz_jiesuan_jbc');
            if (jiesuan != null) {
                jiesuan.startTime();
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.NAMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('namj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.FXMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('fxmj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.SYMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('symj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.XZMJ_GOLD || HallCommonData.getInstance().gameId == cc.dd.Define.GameType.XLMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('scmj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.SHMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('shmj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.JZMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('jzmj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.HSMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('hsmj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.TDHMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('tdhmj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.CFMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('cfmj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.AHMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('ahmj_desk_info_jbc')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.FZMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('fzmj_desk_info')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.WDMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('wdmj_desk_info')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.PZMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('pzmj_desk_info')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.BCMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('bcmj_desk_info')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.ACMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('acmj_desk_info')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.HLMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('hlmj_desk_info')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }else if (HallCommonData.getInstance().gameId == cc.dd.Define.GameType.JSMJ_GOLD) {
            var jiesuan = cc.find('Canvas/desk_info').getComponent('jsmj_desk_info')._jiesuan;
            if (jiesuan != null) {
                jiesuan.startTime(20);
            }
        }
        hall_audio_mgr.Instance().com_btn_click();
        var msg = new cc.pb.rank.msg_relief_gift_2s();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_relief_gift_2s, msg, 'msg_relief_gift_2s', true);
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    //start () {},

    // update (dt) {},
});
