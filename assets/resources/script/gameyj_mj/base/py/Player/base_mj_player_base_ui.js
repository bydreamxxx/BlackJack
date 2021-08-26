//每个麻将都要改写这个
let mjComponentValue = null;
let mjConfigValue = null;

var pai3d_value = require('jlmj_pai3d_value');
var BaiPaiUI = require('jlmj_baipai_ui');
var GmPaiKuEvent = require('jlmj_gm_paiku').GmPaiKuEvent;
var MjSoundCfg = require("jlmj_card_sound_cfg");
var BaipaiType = require("jlmj_baipai_data").BaipaiType;
var Define = require("Define");
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var SysEvent = require("com_sys_data").SysEvent;
var HuType = require('jlmj_define').HuType;
var HuTypeDesc = require('jlmj_define').HuTypeDesc;
var PlayerBaseInfoMgr = require('hall_common_data').PlayerBaseInfoMgr.getInstance();

const paiType = require('jlmj_gang_pai_type').CardType;
const GangType = cc.Enum({
    Gang: 1,
    AnGang: 2,
});

const MaxShouPaiCount = 13;             //包括摸牌在内
const MopaiCount = [2, 5, 8, 11, 14];   //如果手牌中有摸牌则牌数应该为其中一个
/**
 * 玩家ui抽象类,使用其子类,不要直接使用该类.
 */
let base_ui = cc.Class({
    extends: cc.Component,

    properties: {
        head: { default: null, type: require('base_mj_playerHead'), tooltip: '头像', },              //头像
        prefab_pai: cc.Prefab,
        isNeimeng: false,
        // node_hu_1: cc.Node,
        // node_hu_2: cc.Node,
        // node_hu_3: cc.Node,
        // tcp_ani: { default: null, type: cc.Node, tooltip: '听吃碰' },
        // jbdga_ani: { default: null, type: cc.Node, tooltip: '夹胡边胡点炮杠' },
    },

    ctor: function () {
        mjComponentValue = this.initMJComponet();
        mjConfigValue = this.initMJConfig();

        let _playerData = require(mjComponentValue.playerData)

        this.require_playerED = _playerData.PlayerED;
        this.require_PlayerEvent = _playerData.PlayerEvent;
        this.require_PlayerState = _playerData.PlayerState;

        this.require_playerMgr = require(mjComponentValue.playerMgr);

        let _deskData = require(mjComponentValue.deskData)
        this.require_DeskEvent = _deskData.DeskEvent;
        this.require_DeskED = _deskData.DeskED;
        this.require_DeskData = _deskData.DeskData;

        this.require_analysts = require(mjComponentValue.paiAnalysts);
        this.require_UserPlayer = require(mjComponentValue.userData).Instance();

        this.require_mj_audio = require(mjConfigValue.mjAudio);
        this.require_jlmj_prefab = require(mjConfigValue.prefabCfg);

        this.viewIdx = 0;   //视角座位
        this.shouPai = new Array(13);
        this.chuPai = new Array();
        this.baipai_ui_list = [];
        this.buhua_ui = null;
        this.pai3dCfg = null;
        this.modepai = null;
        this.ccgpai_prefab = null;
        this.shou2mid_ani_path = '';
        this.jbdga_ani_remove_stop = false;
    },

    getDaPaiCfg: function () {
        switch (this.require_playerMgr.Instance().playerList.length) {
            case 3:
                return this.pai3dCfg.dapai_cfg_3;
            case 2:
                return this.pai3dCfg.dapai_cfg_2;
            default:
                return this.pai3dCfg.dapai_cfg;
        }
    },

    jbdga_ani_state: function (state) {
        this.jbdga_ani_remove_stop = state;
    },

    initModepai: function () {
        var jlmj_pai = this.createPai();
        if (!jlmj_pai) {
            return;
        }
        this.node.addChild(jlmj_pai.node);
        jlmj_pai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + 12]);
        this.modepai = jlmj_pai;
        this.modepai.node.active = false;
        this.modepai.setTouch(false);
    },

    initShouPai: function () {
        for (var i = 0; i < MaxShouPaiCount; ++i) {
            var jlmj_pai = this.createPai();
            if (!jlmj_pai)
                return;
            jlmj_pai.node.active = false;
            jlmj_pai.node.name = 'jlmj_pai_' + i;
            this.node.addChild(jlmj_pai.node);
            this.shouPai[i] = jlmj_pai;
            this.shouPai[i].setTouch(false);
        }
    },

    initUI: function (_player) {
        this.clear();
        if (this.playerLocation) {
            this.playerLocation.active = false;
        }
        var player = cc.dd._.isNull(_player) || cc.dd._.isUndefined(_player) ? this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx) : _player;
        if (player) {
            cc.log('玩家UI 初始化 视觉座位号:' + this.viewIdx);
            this.node.active = true;
            this.head.node.active = true;
            this.head.initUI(player);
            if (this.playerLocation) {
                this.playerLocation.active = true;
            }
            this.updateChuPaiUI(player, this.require_playerMgr.Instance().playerList.length == 2);
            this.resetBaiPai(player);
            this.quxiaoBiaoJIBaoPaiInShouPai();
            this.updateShouPai(player);
            this.updateZsq();
            this.updateZhanshiPai();
            if (this.require_DeskData.Instance().isFriend() && this.isNeimeng && this.viewIdx == 0) {
                cc.find("Canvas/toppanel/btn_ready").active = !player.bready;
            }
        }
    },

    /**
     * 更新展示牌
     */
    updateZhanshiPai: function () {
        this.reset_zhanshi_pai();
        this.stop_chupai_ani();//断线重连,停止出牌动画
    },

    updateHeadUI: function () {
        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if (player) {
            this.head.initUI(player);
        }
    },

    /**
     * 发牌动画时,隐藏手牌
     */
    hideShouPaiInFaPaiAction: function () {
        if (this.require_playerMgr.Instance().playing_fapai_ani) {
            for (var i = 0; i < this.shouPai.length; ++i) {
                this.shouPai[i].node.active = false;
            }
            this.modepai.node.active = false;
        }
    },

    /**
     * 重置摆牌
     */
    resetBaiPai: function (playerData) {
        cc.log("重置摆牌");
        this.isResetBaiPai = true;
        var arrBaiPaiData = playerData.baipai_data_list;

        this.need_offsetX = false;
        this.need_offsetX_4 = false;

        arrBaiPaiData.forEach(function (baipai) {
            if (baipai.type != BaipaiType.CHI && baipai.cardIds.length > 3) {
                var tmp_cardIds = [];
                var tmp_idAndCnts = [];
                if (baipai.cardIds) {
                    for (var id = 0; id < baipai.cardIds.length; ++id) {
                        if (Math.floor(baipai.cardIds[id] / 4) == paiType.S1) {
                            tmp_cardIds.push(baipai.cardIds[id]);
                            baipai.cardIds.splice(id, 1);
                            id--;
                        }
                    }
                }
                if (baipai.idAndCnts) {
                    for (var id = 0; id < baipai.idAndCnts.length; ++id) {
                        if (Math.floor(baipai.idAndCnts[id].id / 4) == paiType.S1) {
                            tmp_idAndCnts.push(baipai.idAndCnts[id]);
                            baipai.idAndCnts.splice(id, 1);
                            id--;
                        }
                    }
                }

                this.sortBaiPai(baipai);

                if (baipai.cardIds) {
                    baipai.cardIds = tmp_cardIds.concat(baipai.cardIds);
                }
                if (baipai.idAndCnts) {
                    baipai.idAndCnts = tmp_idAndCnts.concat(baipai.idAndCnts);
                }
            }
            var baipai_ui = this.getBaiPaiUI(baipai);//获取已有的摆牌UI没有则创建
            if (baipai.type == BaipaiType.BAGANG || baipai.type == BaipaiType.DIANGANG) {
                if (baipai_ui.pais.length == 3) {
                    this._setbaipaiValue(baipai_ui.pais, baipai, playerData);
                } else {
                    this._setMingGang(baipai_ui.pais, baipai, playerData);
                }
            } else if (baipai.type == BaipaiType.ANGANG) {
                this._setAngGang(baipai_ui.pais, baipai, playerData);
            } else {
                this._setbaipaiValue(baipai_ui.pais, baipai, playerData);
            }

            if (baipai.type == BaipaiType.CHI) {//如果是吃牌就要判断 中发白
                this.setZFB_chi(baipai, baipai_ui.pais, baipai.mj_index, playerData);
            }
        }.bind(this));
        this.updateXiaoJiCnt(playerData);//小鸡飞蛋

        if (playerData.viewIdx == 1 || playerData.viewIdx == 3) {
            if (playerData.state != this.require_PlayerState.HUPAI && playerData.getBaiPaiNum() >= 16) {
                //第16,17张牌,摆牌居中
                this.baiPaiAlignCenterV();
            }
        }

        let buhua_data = playerData.buhua_data;
        if (buhua_data) {
            let baipai_ui = this.getBuHuaUI(buhua_data);//获取已有的摆牌UI没有则创建
            this._setBuHua(baipai_ui.pais, buhua_data, playerData);
        }

        this.isResetBaiPai = false;
        if (this.needUpdateShouPai) {
            this.needUpdateShouPai = false;
            this.updateShouPai();
        }
    },

    /**
     * 更新出牌
     */
    updateChuPaiUI: function (player, is_reverse) {
        this.chuPai.forEach(function (pai) {
            pai.destroy();
        });
        this.chuPai = [];
        for (var i = 0; i < player.chupai.length; ++i) {
            var jlmj_pai = this.createPai();
            if (!jlmj_pai) {
                return;
            }
            //this.node.addChild(jlmj_pai.node);
            this.chupai_node.addChild(jlmj_pai.node);
            this.chuPai.push(jlmj_pai.node);
            var idx = i;
            var cur_id = i;
            if (is_reverse) {
                // let count = this.require_DeskData.Instance().getIs2D() ? 19 : 18;
                // let total = 2;
                // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
                // cur_id = pos_id * count + (this.chuPai.length - 1) % count;
            }
            var value = player.chupai[idx];
            jlmj_pai.kaipai(this.getDaPaiCfg()['frame_' + cur_id], this.getDaPaiCfg()['value_' + cur_id], this.pai3dCfg.dapai_cfg, this.getDaPaiCfg()['liangzhang_' + cur_id], this.getDaPaiCfg()['hunpai_' + cur_id]);
            jlmj_pai.setValue(value);
        }
    },

    /**
     * 是否正在聊天
     */
    isChating: function () {
        return this.head.isChating();
    },

    /**
     * 获取出牌
     * @param cardid
     * @return {}
     */
    getPaiToID: function (cardID) {
        var arr = [];
        for (var i = 0; i < this.chuPai.length; ++i) {
            var pai = this.chuPai[i].getComponent(mjConfigValue.mjPai);
            if (Math.floor(pai.cardId / 4) == Math.floor(cardID / 4)) {
                arr.push(pai);
            }
        }
        for (var i = 0; i < this.baipai_ui_list.length; ++i) {
            if (this.baipai_ui_list[i].type != BaipaiType.ANGANG) {//暗杠不用遍历
                arr = arr.concat(this.baipai_ui_list[i].getPaitype(cardID));
            }
        }
        if (this.buhua_ui) {
            arr = arr.concat(this.buhua_ui.getPaitype(cardID));
        }
        return arr;
    },

    /**
     * 获取出牌
     */
    getAllPaiToID: function (cardID, isuser) {
        var num = 0;
        if (this.shouPai && isuser) {
            for (var i = 0; i < this.shouPai.length; ++i) {
                var pai = this.shouPai[i].getComponent(mjConfigValue.mjPai);
                if (Math.floor(pai.cardId / 4) == Math.floor(cardID / 4) && pai.node.active) {
                    num++;
                }
            }
        }
        for (var i = 0; i < this.chuPai.length; ++i) {
            var pai = this.chuPai[i].getComponent(mjConfigValue.mjPai);
            if (Math.floor(pai.cardId / 4) == Math.floor(cardID / 4)) {
                num++;
            }
        }
        for (var i = 0; i < this.baipai_ui_list.length; ++i) {
            if (this.baipai_ui_list[i].type == BaipaiType.ANGANG &&
                this.head.player.userId != cc.dd.user.id) {//其他玩家暗杠不用遍历
                continue;
            }
            if (this.baipai_ui_list[i].type == BaipaiType.ANGANG && isuser) {
                var pais = this.baipai_ui_list[i].pais;
                if (pais.length == 4) {
                    if (pais[0].cardId == cardID) {
                        return 4;
                    } else {
                        continue;
                    }
                } else if (pais.length == 3) {
                    if (pais[1].cardId == cardID) {
                        return 3;
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }

            }
            var tem = this.baipai_ui_list[i].getPaitype(cardID);
            for (var id = 0, len = tem.length; id < len; ++id) {
                if (tem[id].cnt_num) {
                    num += tem[id].cnt_num;
                } else {
                    num++;
                }
            }
        }
        if (this.buhua_ui) {
            var tem = this.buhua_ui.getPaitype(cardID);
            for (var id = 0, len = tem.length; id < len; ++id) {
                if (tem[id].cnt_num) {
                    num += tem[id].cnt_num;
                } else {
                    num++;
                }
            }
        }
        return num;
    },
    onHeadCallfunc: function (event) {

        // cc.log( "头像点击回调：座位号" + this.viewIdx );
        // jlmj_notice.notification(jlmj_emit.EMIT_CLICK_HEAD, plaeyrObject);

        // var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        // cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_USERINFO, function (ui) {
        //     var jlmj_user_info = ui.getComponent('jlmj_user_info');
        //     jlmj_user_info.updateUI(player);
        // }.bind(this));
        if (!this.head.node.active) {
            return;
        }
        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        var playerInfo = PlayerBaseInfoMgr.findPlayerInfoById(player.userId);
        if (!this.require_DeskData.Instance().isMatch()) {
            playerInfo.info.coin = player.coin;
        }
        cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_USERINFO, function (ui) {
            var user_info = ui.getComponent(mjConfigValue.userInfo);
            user_info.setData(RoomMgr.Instance().gameId,
                RoomMgr.Instance().roomId,
                RoomMgr.Instance().roomLv,
                this.require_DeskData.Instance().isFriend(),
                playerInfo.info);
            if (this.require_DeskData.Instance().isFriend()) {
                user_info.setGpsData(this.require_playerMgr.Instance().playerList);
            }
            user_info.show();
        }.bind(this));
    },

    /*
     * 更新房主是否显示
     */
    updateOwner: function (isOwner) {

    },

    /**
     * 查找手牌中的空位开始地址
     * @return 返回插入的位置
     */
    findNullCard: function () {
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (!this.shouPai[i] || !this.shouPai[i].node.active) {
                //没有牌或则  有牌后重新隐藏起来的牌
                return i;
            }
        }
        return -1;
    },

    /**
     * 手牌站立
     */
    zhanli: function () {
        this.shouPai.forEach(function (jlmj_pai, idx) {
            if (jlmj_pai) {
                jlmj_pai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + idx]);
                jlmj_pai.setTouch(true);
            }
        }, this);
        var _idx = 13;
        this.modepai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + _idx]);
        var lastPos = this.modepai.node.getPosition();
        this.modepai.node.setPosition(lastPos.x + this.pai3dCfg.mopai.offsetX, lastPos.y + this.pai3dCfg.mopai.offsetY);
        this.modepai.setTouch(true);
    },

    /**
     * 手牌倒牌
     * @param player
     */
    daopai: function (player) {
        this.shouPai.forEach(function (jlmj_pai, idx) {
            if (!jlmj_pai) {
                return;
            }
            if (jlmj_pai.node.active) {
                jlmj_pai.daopai(this.pai3dCfg.shoupai_daopai_cfg['frame_' + idx], this.pai3dCfg.shoupai_daopai_cfg);
            }
        }, this);
        // this.updateShouPai(player);
    },

    /**
     * 手牌开牌
     * @param player
     */
    kaipai: function (player) {
        for (var i in this.shouPai) {
            if (this.shouPai[i].node.active) {
                this.shouPai[i].kaipai(this.pai3dCfg.shoupai_kaipai_cfg['frame_' + i], this.pai3dCfg.shoupai_kaipai_cfg['value_' + i], this.pai3dCfg.shoupai_kaipai_cfg, this.pai3dCfg.shoupai_kaipai_cfg['liangzhang_' + i], this.pai3dCfg.shoupai_kaipai_cfg['hunpai_' + i]);
                this.shouPai[i].setTouch(false);
            }
        }
        // if (this.modepai.node.active) {
        //     var i = 13;
        //     this.modepai.kaipai(this.pai3dCfg.shoupai_kaipai_cfg['frame_' + i], this.pai3dCfg.shoupai_kaipai_cfg['value_' + i], this.pai3dCfg.shoupai_kaipai_cfg);
        //     var lastPos = this.modepai.node.getPosition();
        //     this.modepai.node.setPosition(lastPos.x + this.pai3dCfg.mopai.offsetX, lastPos.y + this.pai3dCfg.mopai.offsetY);
        //     this.modepai.setTouch(false);
        // }
        // this.updateShouPai(player);
    },

    /**
     * 设置手牌的外观
     * @param idx
     * @param state
     */
    setShouPaiAppearance: function (idx, state, cfg_view_idx) {
        if (!cfg_view_idx) {
            cfg_view_idx = idx;
        }
        switch (state) {
            case this.require_PlayerState.TINGPAI:
                this.shouPai[idx].daopai(this.pai3dCfg.shoupai_daopai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_daopai_cfg);
                break;
            case this.require_PlayerState.HUPAI:
                this.shouPai[idx].kaipai(this.pai3dCfg.shoupai_kaipai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg, this.pai3dCfg.shoupai_kaipai_cfg['liangzhang_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['hunpai_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['tuidao_' + cfg_view_idx]);
                break;
            default:
                this.shouPai[idx].zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx]);
                break;
        }
    },

    /**
     * 设置摸牌的外观
     * @param idx
     * @param state
     */
    setMoPaiAppearance: function (idx, state, cfg_view_idx) {
        if (!cfg_view_idx) {
            cfg_view_idx = idx;
        }
        switch (state) {
            case this.require_PlayerState.HUPAI:
                this.modepai.kaipai(this.pai3dCfg.shoupai_kaipai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg, this.pai3dCfg.shoupai_kaipai_cfg['liangzhang_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['hunpai_' + cfg_view_idx]);
                break;
            default:
                this.modepai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx]);
                break;
        }
    },

    /**
     * 增加倒下个别牌
     */
    daopaiToCard: function (jlmj_pai, idx) {
        // arr.forEach(function (jlmj_pai,idx) {
        if (!jlmj_pai) {
            return;
        }
        if (jlmj_pai.node.active) {
            jlmj_pai.daopai(this.pai3dCfg.shoupai_daopai_cfg['frame_' + idx], this.pai3dCfg.shoupai_daopai_cfg);
        }
        // },this);
    },

    mopai: function (player) {

    },


    dapai: function (player, chupai_idx_in_shoupai) {
        this.modepai.node.active = false;
        var jlmj_pai = this.createPai();
        if (!jlmj_pai) {
            return;
        }
        //this.node.addChild(jlmj_pai.node);
        this.chupai_node.addChild(jlmj_pai.node);
        this.chuPai.push(jlmj_pai.node);

        var player_list = this.require_playerMgr.Instance().playerList;
        var idx = player.chupai.length - 1;
        var cur_idx = this.chuPai.length - 1;
        var last_chupai_idx = this.chuPai.length - 1;
        if (player_list.length == 2) {
            // let count = this.require_DeskData.Instance().getIs2D() ? 19 : 18;
            // let total = 2;
            // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
            // var cur_pai = (this.chuPai.length - 1) % count;
            // var cur_id = pos_id * count + cur_pai;
            // cur_idx = cur_id;
            // last_chupai_idx = cur_id;
        }

        var value = player.chupai[idx];
        jlmj_pai.kaipai(this.getDaPaiCfg()['frame_' + cur_idx], this.getDaPaiCfg()['value_' + cur_idx], this.pai3dCfg.dapai_cfg, this.getDaPaiCfg()['liangzhang_' + cur_idx], this.getDaPaiCfg()['hunpai_' + cur_idx]);
        jlmj_pai.setValue(value);
        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 打牌:" + pai3d_value.desc[value] + " 快出牌:" + player.isQuick);
        //出牌动画
        this.stop_chupai_ani();
        if (player.isQuick) {
            this.play_chupai_ani(player, chupai_idx_in_shoupai, last_chupai_idx, value);
        } else {
            this.play_chupai_ani_old(player, chupai_idx_in_shoupai, last_chupai_idx, value);
        }
    },

    stop_chupai_ani: function () {
        this.mid2dapai_playing = false;
        this.zhanshi_pai.node.stopAllActions();
        this.zhanshi_pai.node.active = false;
        this.zhanshi_pai.ani.stop();
        this.chuPai.forEach(function (pai) {
            pai.active = true;
        });
    },


    play_chupai_ani: function (player, chupai_idx_in_shoupai, last_chupai_idx, cardID) {
        //中间牌转变打牌end
        var mid2dapaiEnd = function () {
            this.mid2dapai_playing = false;
            this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[this.chuPai.length - 1].active = true;
            this.setZsq(this.chuPai[this.chuPai.length - 1], this.viewIdx);
            this.require_playerMgr.Instance().playerMoPaiAction();
        }.bind(this);

        //不同手牌数,不同可视配置
        var visible_cfgs = [];
        var shoupai_visible_cfg_right = {
            1: [6],
            4: [5, 6, 7, 8],
            7: [3, 4, 5, 6, 7, 8, 9],
            10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        var shoupai_visible_cfg_left = {
            1: [6],
            4: [5, 6, 7, 8],
            7: [3, 4, 5, 6, 7, 8, 9],
            10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        var shoupai_visible_cfg_up = {
            1: [12],
            4: [9, 10, 11, 12],
            7: [6, 7, 8, 9, 10, 11, 12],
            10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        visible_cfgs.push(shoupai_visible_cfg_right);
        visible_cfgs.push(shoupai_visible_cfg_up);
        visible_cfgs.push(shoupai_visible_cfg_left);
        var visible_cfg = visible_cfgs[player.viewIdx - 1];   //当前手牌可视配置
        var v_cfg = visible_cfg[player.shoupai.length];
        if (!v_cfg) {
            cc.error('手牌数量不正确' + player.shoupai.length, ' 座位号' + player.viewIdx);
            var id = this.require_playerMgr.Instance().shou2mid_id_list.pop();
            this.require_playerMgr.Instance().mid2dapai_id_list.push(id);

            if (this.require_playerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
                cc.dd._.pull(this.require_playerMgr.Instance().mid2dapai_id_list, cardID);
            }
            mid2dapaiEnd();
            return;
        }
        var lost_id = v_cfg[v_cfg.length - 1];
        if (player.state != this.require_PlayerState.TINGPAI && !player.replaying) { //非回放打牌时,随机出牌位置
            chupai_idx_in_shoupai = parseInt(cc.random0To1() * player.shoupai.length); //打牌后,此时牌数据已经少了一张
            cc.log('座位号=', player.viewIdx, '随机出牌位置=', chupai_idx_in_shoupai);
        } else {
            //回放,或听牌时的出牌位置
            cc.log('出牌索引', chupai_idx_in_shoupai);
        }

        var shoupai_idx = visible_cfg[player.shoupai.length][chupai_idx_in_shoupai];
        this.chuPai[this.chuPai.length - 1].active = false;
        this.zhanshi_pai.setValue(cardID);
        this.updateShouPai();

        cc.log('手牌-中间牌-start');
        this.zhanshi_pai.node.active = true;

        var id = this.require_playerMgr.Instance().shou2mid_id_list.pop();
        this.require_playerMgr.Instance().mid2dapai_id_list.push(id);

        if (this.require_playerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
            cc.log('下家正常摸牌了,播放入牌海动画');
            cc.dd._.pull(this.require_playerMgr.Instance().mid2dapai_id_list, cardID);
        }
        let config = this.getDaPaiCfg();

        this.zhanshi_pai.node.parent = this.chuPai[this.chuPai.length - 1].parent;

        let targetPos = cc.v2(config['frame_' + last_chupai_idx].x, config['frame_' + last_chupai_idx].y);
        this.zhanshi_pai.kaipai(config['frame_' + last_chupai_idx], config['value_' + last_chupai_idx], this.pai3dCfg.dapai_cfg, config['liangzhang_' + last_chupai_idx], config['hunpai_' + last_chupai_idx]);

        if (chupai_idx_in_shoupai == player.shoupai.length) { //打牌后,此时牌数据已经少了一张
            this.zhanshi_pai.node.x = this.modepai.node.x;
            this.zhanshi_pai.node.y = this.modepai.node.y;
        } else if (visible_cfg[player.shoupai.length]) {
            var idx = visible_cfg[player.shoupai.length][chupai_idx_in_shoupai];
            this.zhanshi_pai.node.x = this.shouPai[idx].node.x;
            this.zhanshi_pai.node.y = this.shouPai[idx].node.y;
        }
        this.zhanshi_pai.node.stopAllActions();

        let zhanshiPaiSpeed = 0.2;
        if (this.isNeimeng) {
            zhanshiPaiSpeed = 0.05
        }

        var seq = cc.sequence(
            cc.callFunc(() => {
                // this.require_mj_audio.playAduio('effect_sendcard');
                this.require_mj_audio.playAduio('dapai');
            }),
            cc.moveTo(zhanshiPaiSpeed, targetPos).easing(cc.easeQuarticActionOut(3.0)),
            cc.callFunc(mid2dapaiEnd.bind(this))
            // cc.callFunc(()=>{
            //     this.require_mj_audio.playAduio('dapai');
            // })
        );
        this.zhanshi_pai.node.runAction(seq);

        //插牌动画
        this.pluggedPai(player, shoupai_idx, lost_id);
    },

    play_chupai_ani_old: function (player, chupai_idx_in_shoupai, last_chupai_idx, cardID) {
        //中间牌转变打牌end
        var mid2dapaiEnd = function () {
            this.mid2dapai_playing = false;
            this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[this.chuPai.length - 1].active = true;
            this.setZsq(this.chuPai[this.chuPai.length - 1], this.viewIdx);
            this.require_playerMgr.Instance().playerMoPaiAction();
        }.bind(this);
        //中间牌转变打牌
        var mid2dapai = function () {
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('中间牌-打牌-start');
            if (this.chuPai.length <= 0) {
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            cc.resources.load(this.getMid2DaPaiAniPath() + last_chupai_idx, function (err, clip) {
                if (this.zhanshi_pai.cardId != cardID) {
                    cc.log("出牌动画-提前结束");
                    return;
                }

                let mid2dapaiSpeed = 200;
                if (this.isNeimeng) {
                    mid2dapaiSpeed = 10;
                }

                setTimeout(function () {
                    this.mid2dapai_playing = true;
                }.bind(this), mid2dapaiSpeed);
                this.zhanshi_pai.ani.removeClip('mid2dapai');
                this.zhanshi_pai.ani.addClip(clip, 'mid2dapai');
                this.zhanshi_pai.ani.play('mid2dapai');
                this.zhanshi_pai.ani.on('finished', mid2dapaiEnd);
                this.require_mj_audio.playAduio('dapai');
            }.bind(this));
        }.bind(this);
        //手牌转变中间牌end
        var shou2midEnd = function () {
            this.zhanshi_pai.ani.off('finished', shou2midEnd);
            if (this.zhanshi_pai.cardId != cardID) {
                this.require_playerMgr.Instance().playing_shou2mid_ani = false;
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('手牌-中间牌-end');
            if (this.require_DeskData.Instance().dabaoing) {   //打包中,暂停播放打牌动画
                // this.dapai_ani_paused = true;
                this.require_playerMgr.Instance().dabaoing_chupai_id = cardID;
                return;
            } else {
                setTimeout(function () {
                    this.require_playerMgr.Instance().playing_shou2mid_ani = false;
                    this.require_playerMgr.Instance().playerMoPaiAction();
                    if (this.require_playerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
                        cc.log('下家正常摸牌了,播放入牌海动画');
                        cc.dd._.pull(this.require_playerMgr.Instance().mid2dapai_id_list, cardID);
                        mid2dapai();
                    }
                }.bind(this), 300);
            }
        }.bind(this);

        //不同手牌数,不同可视配置
        var visible_cfgs = [];
        var shoupai_visible_cfg_right = {
            1: [6],
            4: [5, 6, 7, 8],
            7: [3, 4, 5, 6, 7, 8, 9],
            10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        var shoupai_visible_cfg_left = {
            1: [6],
            4: [5, 6, 7, 8],
            7: [3, 4, 5, 6, 7, 8, 9],
            10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        var shoupai_visible_cfg_up = {
            1: [12],
            4: [9, 10, 11, 12],
            7: [6, 7, 8, 9, 10, 11, 12],
            10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
        visible_cfgs.push(shoupai_visible_cfg_right);
        visible_cfgs.push(shoupai_visible_cfg_up);
        visible_cfgs.push(shoupai_visible_cfg_left);
        var visible_cfg = visible_cfgs[player.viewIdx - 1];   //当前手牌可视配置
        var v_cfg = visible_cfg[player.shoupai.length];
        if (!v_cfg) {
            cc.error('手牌数量不正确' + player.shoupai.length, ' 座位号' + player.viewIdx);
            setTimeout(function () {
                this.require_playerMgr.Instance().playing_shou2mid_ani = false;
                this.require_playerMgr.Instance().playerMoPaiAction();
                if (this.require_playerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
                    cc.log('下家正常摸牌了,播放入牌海动画');
                    cc.dd._.pull(this.require_playerMgr.Instance().mid2dapai_id_list, cardID);
                    mid2dapaiEnd();
                }
            }.bind(this), 340);
            return;
        }
        var lost_id = v_cfg[v_cfg.length - 1];
        if (player.state != this.require_PlayerState.TINGPAI && !player.replaying) { //非回放打牌时,随机出牌位置
            chupai_idx_in_shoupai = parseInt(cc.random0To1() * player.shoupai.length); //打牌后,此时牌数据已经少了一张
            cc.log('座位号=', player.viewIdx, '随机出牌位置=', chupai_idx_in_shoupai);
        } else {
            //回放,或听牌时的出牌位置
            cc.log('出牌索引', chupai_idx_in_shoupai);
        }

        var shoupai_idx = visible_cfg[player.shoupai.length][chupai_idx_in_shoupai];
        this.require_playerMgr.Instance().playing_shou2mid_ani = true;
        this.chuPai[this.chuPai.length - 1].active = false;
        this.zhanshi_pai.setValue(cardID);
        this.updateShouPai();
        this.zhanshi_pai.node.scalex = 0.3;
        this.zhanshi_pai.node.scaley = 0.3;

        this.zhanshi_pai.ani.on('finished', shou2midEnd);

        cc.log('手牌-中间牌-start');
        this.zhanshi_pai.node.active = true;
        this.zhanshi_pai.node.parent = this.zhanshi_pai_node;

        this.reset_zhanshi_pai();
        if (chupai_idx_in_shoupai == player.shoupai.length) { //打牌后,此时牌数据已经少了一张
            this.zhanshi_pai.node.x = this.modepai.node.x;
            this.zhanshi_pai.node.y = this.modepai.node.y;
        } else if (visible_cfg[player.shoupai.length]) {
            var idx = visible_cfg[player.shoupai.length][chupai_idx_in_shoupai];
            this.zhanshi_pai.node.x = this.shouPai[idx].node.x;
            this.zhanshi_pai.node.y = this.shouPai[idx].node.y;
        }
        this.zhanshi_pai.node.stopAllActions();
        var target_pos = [cc.v2(347, 93), cc.v2(0, 251), cc.v2(-338, 67)];

        let zhanshiPaiOldSpeed = 0.03;
        if (this.isNeimeng) {
            zhanshiPaiOldSpeed = 0.01
        }

        var zsp_spa = cc.spawn(cc.scaleTo(zhanshiPaiOldSpeed, 1, 1), cc.moveTo(zhanshiPaiOldSpeed, target_pos[player.viewIdx - 1]));
        var seq = cc.sequence(zsp_spa, cc.delayTime(zhanshiPaiOldSpeed), cc.callFunc(shou2midEnd.bind(this)), cc.delayTime(0.2));
        this.zhanshi_pai.node.runAction(seq);
        this.require_mj_audio.playAduio('effect_sendcard');

        //插牌动画
        this.pluggedPai(player, shoupai_idx, lost_id);
    },

    pluggedPai: function (player, kongpai_idx, lost_id) {
        //插牌动画
        if (player.state != this.require_PlayerState.TINGPAI && !player.replaying) {
            var paiShow = function () {
                if (player.state != this.require_PlayerState.TINGPAI && !player.replaying) {
                    this.modepai.node.active = false;
                    this.shouPai[kongpai_idx].node.active = true;
                    this.modepai.node.x = this.modepai.original_x;
                    this.modepai.node.y = this.modepai.original_y;
                }
            }.bind(this);
            this.modepai.original_x = this.modepai.node.x;
            this.modepai.original_y = this.modepai.node.y;

            this.chapai_x = this.shouPai[kongpai_idx].node.x;
            this.chapai_y = this.shouPai[kongpai_idx].node.y;

            this.modepai.node.active = true;
            this.shouPai[kongpai_idx].node.active = false;

            var len = lost_id;
            var sp_x = this.shouPai[len].node.x;
            var sp_y = this.shouPai[len].node.y;

            if (this.isNeimeng) {
                this.modepai.node.runAction(
                    cc.sequence(
                        cc.delayTime(0.05),
                        cc.moveTo(0, sp_x, sp_y).easing(cc.easeSineInOut()),
                        // cc.delayTime(0.1),
                        cc.callFunc(paiShow.bind(this))
                    ));
            } else {
                this.modepai.node.runAction(
                    cc.sequence(cc.delayTime(0.3),
                        cc.moveTo(0.1, sp_x, sp_y).easing(cc.easeSineInOut()),
                        cc.delayTime(0.1),
                        cc.callFunc(paiShow.bind(this))
                    ));
            }


            for (var i = len; i > kongpai_idx; --i) {
                var pai = this.shouPai[i];
                var paiend = function () {
                    this.node.x = this.original_x;
                    this.node.y = this.original_y;
                    this.node.scaleX = this.original_sx;
                    this.node.scaleY = this.original_sy;
                }.bind(pai);
                pai.original_x = pai.node.x;
                pai.original_y = pai.node.y;

                pai.original_sx = pai.node.scaleX;
                pai.original_sy = pai.node.scaleY;
                if (this.isNeimeng) {
                    pai.node.runAction(
                        cc.sequence(
                            cc.delayTime(0.05),
                            cc.spawn(
                                cc.moveTo(0, this.shouPai[i - 1].node.x, this.shouPai[i - 1].node.y).easing(cc.easeSineInOut()),
                                cc.scaleTo(0, this.shouPai[i - 1].node.scaleX, this.shouPai[i - 1].node.scaleY).easing(cc.easeSineInOut())
                            ),
                            // cc.delayTime(0.1),
                            cc.callFunc(paiend.bind(pai))
                        ));
                } else {
                    pai.node.runAction(
                        cc.sequence(cc.delayTime(0.3),
                            cc.spawn(
                                cc.moveTo(0.1, this.shouPai[i - 1].node.x, this.shouPai[i - 1].node.y).easing(cc.easeSineInOut()),
                                cc.scaleTo(0.1, this.shouPai[i - 1].node.scaleX, this.shouPai[i - 1].node.scaleY).easing(cc.easeSineInOut())
                            ),
                            cc.delayTime(0.1),
                            cc.callFunc(paiend.bind(pai))
                        ));
                }
            }
        }
    },

    /**
     * 播放中间牌->打牌动作
     */
    play_mid2dapai_ani: function (id) {
        // if(!this.dapai_ani_paused){
        //     return;
        // }
        if (!this.zhanshi_pai.node.active) {
            return;
        }

        if (this.zhanshi_pai.cardId != id) {
            return;
        }
        // this.dapai_ani_paused = false;
        //中间牌转变打牌end
        var mid2dapaiEnd = function () {
            this.mid2dapai_playing = false;
            this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
            // if (this.zhanshi_pai.cardId != cardID) {
            //     cc.log("出牌动画-提前结束");
            //     return;
            // }
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                return;
            }
            var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[last_chupai_idx].active = true;
            this.setZsq(this.chuPai[last_chupai_idx], this.viewIdx);
            this.require_playerMgr.Instance().playerMoPaiAction();
        }.bind(this);
        //中间牌转变打牌
        var mid2dapai = function () {
            // if (this.zhanshi_pai.cardId != cardID) {
            //     cc.log("出牌动画-提前结束");
            //     return;
            // }
            cc.log('中间牌-打牌-start');
            if (this.chuPai.length <= 0) {
                return;
            }

            let playMid2dapaiAniSpeed = 200;
            if (this.isNeimeng) {
                playMid2dapaiAniSpeed = 10;
            }

            setTimeout(function () {
                this.mid2dapai_playing = true;
            }.bind(this), playMid2dapaiAniSpeed);

            var player_list = this.require_playerMgr.Instance().playerList;
            var last_chupai_idx = this.chuPai.length - 1;
            if (player_list.length == 2) {
                // let count = this.require_DeskData.Instance().getIs2D() ? 19 : 18;
                // let total = 2;
                // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
                // var cur_pai = (this.chuPai.length - 1) % count;
                // last_chupai_idx = pos_id * count + cur_pai;
            }

            //var last_chupai_idx = this.chuPai.length - 1;
            cc.resources.load(this.getMid2DaPaiAniPath() + last_chupai_idx, function (err, clip) {
                // if (this.zhanshi_pai.cardId != cardID) {
                //     cc.log("出牌动画-提前结束");
                //     return;
                // }
                this.mid2dapai_playing = true;
                this.zhanshi_pai.ani.removeClip('mid2dapai');
                this.zhanshi_pai.ani.addClip(clip, 'mid2dapai');
                this.zhanshi_pai.ani.play('mid2dapai');
                this.zhanshi_pai.ani.on('finished', mid2dapaiEnd);
                this.require_mj_audio.playAduio('dapai');
            }.bind(this));
        }.bind(this);

        mid2dapai();
    },

    reset_zhanshi_pai: function () {
        let cardID = this.zhanshi_pai.cardId;
        if (cc.dd._.isNumber(cardID) && cardID >= 0) {
            this.zhanshi_pai.setValue(cardID);
        }
        let use2D = this.require_DeskData.Instance().getIs2D();
        if (use2D) {
            let pai2d = this.require_DeskData.Instance().get2DPai();
            if (pai2d == 'blue') {
                this.zhanshi_pai.getComponent(cc.Sprite).spriteFrame = this.zhanshi_pai.atlas_2d_blue.getSpriteFrame("ed_shoupai_ziji_li");
                this.zhanshi_pai.node.width = 97;
                this.zhanshi_pai.node.height = 138;
                this.zhanshi_pai.value.node.width = 72;
                this.zhanshi_pai.value.node.height = 97.36;
                this.zhanshi_pai.value.node.y = -9.68;
            } else if (pai2d == 'yellow') {
                this.zhanshi_pai.getComponent(cc.Sprite).spriteFrame = this.zhanshi_pai.atlas_2d_yellow.getSpriteFrame("ed_shoupai_ziji_li_y");
                this.zhanshi_pai.node.width = 97;
                this.zhanshi_pai.node.height = 138;
                this.zhanshi_pai.value.node.width = 72;
                this.zhanshi_pai.value.node.height = 97.36;
                this.zhanshi_pai.value.node.y = -9.68;
            } else if (pai2d == 'green') {
                this.zhanshi_pai.getComponent(cc.Sprite).spriteFrame = this.zhanshi_pai.atlas_2d_green.getSpriteFrame("ed_shoupai_ziji_li");
                this.zhanshi_pai.node.width = 97;
                this.zhanshi_pai.node.height = 138;
                this.zhanshi_pai.value.node.width = 74;
                this.zhanshi_pai.value.node.height = 110;
                this.zhanshi_pai.value.node.y = -6;
            } else {
                this.zhanshi_pai.getComponent(cc.Sprite).spriteFrame = this.zhanshi_pai.atlas_2d.getSpriteFrame("ed_shoupai_ziji_li");
                this.zhanshi_pai.node.width = 97;
                this.zhanshi_pai.node.height = 138;
                this.zhanshi_pai.value.node.width = 74;
                this.zhanshi_pai.value.node.height = 110;
                this.zhanshi_pai.value.node.y = -6;
            }
        } else {
            this.zhanshi_pai.getComponent(cc.Sprite).spriteFrame = this.zhanshi_pai.atlas.getSpriteFrame("d_shoupai_xia_dao_zhengmian");
            // this.zhanshi_pai.node.width = 90;
            // this.zhanshi_pai.node.height = 131;
            // this.zhanshi_pai.value.node.y = -10;
            this.zhanshi_pai.node.width = 90;
            this.zhanshi_pai.node.height = 131;
            this.zhanshi_pai.value.node.width = 74;
            this.zhanshi_pai.value.node.height = 110;
            this.zhanshi_pai.value.node.y = -5.5;
        }

        this.zhanshi_pai.node.scaleX = 1;
        this.zhanshi_pai.node.scaleY = 1;
        this.zhanshi_pai.node.skewX = 0;
        this.zhanshi_pai.node.skewY = 0;
        this.zhanshi_pai.node.rotation = 0;

        this.zhanshi_pai.value.node.x = 0;
        // this.zhanshi_pai.value.node.width = 90;
        // this.zhanshi_pai.value.node.height = 95;
        this.zhanshi_pai.value.node.scaleX = 1;
        this.zhanshi_pai.value.node.scaleY = 1;
        this.zhanshi_pai.value.node.skewX = 0;
        this.zhanshi_pai.value.node.skewY = 0;
        this.zhanshi_pai.value.node.rotation = 0;
    },

    /**
     * 通知出牌指示器的变化
     */
    setZsq: function (paiNode, viewidx) {
        if (paiNode) {
            var zsq_pos = paiNode.getPosition();
            var offsetY = [40, 35, 40, 35];
            zsq_pos.y += offsetY[viewidx];
            this.require_DeskED.notifyEvent(this.require_DeskEvent.OPEN_ZSQ, [zsq_pos]);
        }
    },

    /**
     * 更新指示器
     * @param last_id
     */
    updateZsq: function () {
        this.chuPai.forEach((jlmj_pai_node) => {
            var jlmj_pai = jlmj_pai_node.getComponent(mjConfigValue.mjPai);
            if (this.require_DeskData.Instance().last_chupai_id == jlmj_pai.cardId) {
                this.setZsq(jlmj_pai.node, this.viewIdx);
            }
        });
    },

    /**
     * 移除最后一张手牌
     */
    removeLastChupai: function () {
        var pai_node = this.chuPai.pop();
        if (pai_node) {
            pai_node.destroy();
        }

        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_ZSQ, [this]);

        this.zhanshi_pai.node.active = false;
    },

    /**
     * 补花
     */
    buhua: function (player) {
        this.resetBaiPai(player);
        this.updateShouPai(player);

        if (this.buhua_ani) {
            this.require_mj_audio.playAudioBySex('buhua', player.sex);
            this.playSpine(this.buhua_ani, ['play']);
        }
    },

    /**
     * 被吃
     */
    beichi: function (player) {
        // this.removeLastChupai();
        this.updateChuPaiUI(player, false);
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_ZSQ, [this]);
        this.zhanshi_pai.node.active = false;
        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 被吃");
    },

    /**
     * 吃
     * @param data
     */
    chi: function (data) {

        var player = data[0];
        var baipai_data = data[1];

        this.resetBaiPai(player);
        this.updateShouPai(player);

        if (this.chi_ani) {
            let _audio = ['chi1', 'chi2', 'chi3'];
            let index = cc.dd.Utils.random(0, _audio.length - 1);
            this.require_mj_audio.playAudioBySex(_audio[index], player.sex);
            this.playSpine(this.chi_ani, ['play']);

        } else {
            this.require_mj_audio.playAudioBySex("chi", player.sex);
            this.playSpine(this.cpgtgh_ani, ['chi', 'chiXS']);
        }

        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('chi',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);

    },
    tcpAniCallback: function () {
        this.tcp_ani.node.active = false;
        cc.log("tcp call back ---------");
        this.tcp_ani.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);
    },
    /**
     * 被碰
     */
    beipeng: function (player) {
        player = player[0];
        // this.removeLastChupai();
        this.updateChuPaiUI(player, false);
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_ZSQ, [this]);
        this.zhanshi_pai.node.active = false;
        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 被碰");
    },

    /**
     * 碰
     */
    peng: function (data) {
        var player = data[0];
        var baipai_data = data[1];

        this.resetBaiPai(player);
        this.updateShouPai(player);

        if (this.peng_ani) {
            let _audio = ['peng1', 'peng1', 'peng3', 'peng4'];
            let index = cc.dd.Utils.random(0, _audio.length - 1);
            this.require_mj_audio.playAudioBySex(_audio[index], player.sex);
            this.playSpine(this.peng_ani, ['play']);
        } else {
            this.require_mj_audio.playAudioBySex("cha", player.sex);
            this.playSpine(this.cpgtgh_ani, ['cha', 'chaXS']);
        }

        //this.play_ani.play("jlmj_peng_texiao");

        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('cha',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);

    },

    /**
     * 被杠
     */
    beigang: function (data) {
        var player = data[0];
        // this.removeLastChupai();
        this.updateChuPaiUI(player, false);
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_ZSQ, [this]);
        this.zhanshi_pai.node.active = false;
        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 被杠");
    },

    /**
     * 胡
     */
    hu: function (player, isZiMo) {
        this.setShoupaiTouch(true);


        var huInfoList = this.require_DeskData.Instance().getHuList();    //索引越大,优先级越大
        var zimoHuList = this.require_DeskData.Instance().getZimoList();

        var zmHu = zimoHuList[0];
        zimoHuList.forEach(function (zmhu) {
            if (player.huTypeList.indexOf(zmhu.type) != -1) {
                zmHu = zmhu;
            }
        });

        var maxHu = huInfoList[0];
        huInfoList.forEach(function (hu) {
            if (player.huTypeList.indexOf(hu.type) != -1) {
                maxHu = hu;
            }
        });
        var huDes = [];
        player.huTypeList.forEach(function (type) {
            huDes.push(HuTypeDesc[type]);
        });

        // this.play_ani.play(maxHu.ani);
        // this.play_ani.on("finished", this.onHuAniFinished.bind(this));

        cc.log("所有胡牌类型:", player.huTypeList, huDes);
        cc.log('播放胡牌特效: ', HuTypeDesc[maxHu.type]);

        if (maxHu.type == HuType.ZI_MO) {
            let huAnimInfo = this.require_DeskData.Instance().getHuAnimInfo(zmHu.type, true);
            this.hupaiAni(huAnimInfo, zmHu.ani);
            if (cc.dd._.isArray(zmHu.audio)) {
                let index = cc.dd.Utils.random(0, zmHu.audio.length - 1);
                zmHu.audio = zmHu.audio[index];
            }
            this.require_mj_audio.playAudioBySex(zmHu.audio, player.sex);
        } else {
            let huAnimInfo = this.require_DeskData.Instance().getHuAnimInfo(maxHu.type);
            this.hupaiAni(huAnimInfo, maxHu.ani);
            if (cc.dd._.isArray(zmHu.audio)) {
                let index = cc.dd.Utils.random(0, maxHu.audio.length - 1);
                maxHu.audio = maxHu.audio[index];
            }
            this.require_mj_audio.playAudioBySex(maxHu.audio, player.sex);
        }


        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + " 胡牌");
        cc.log("胡结束");
    },

    hupaiAni: function (huAnimInfo, ani) {
        switch (huAnimInfo) {
            case 'dgpt_ani':
                this.playSpine(this.dgpt_ani, ani, this.onHuAniFinished.bind(this));
                break;
            case 'baozhongbao_ani':
                this.playSpine(this.baozhongbao_ani, ani, this.onHuAniFinished.bind(this));
                break;
            case 'chajiaohuazhu_ani':
                this.playSpine(this.chajiaohuazhu_ani, ani, this.onHuAniFinished.bind(this));
                break;
            case 'cpgtgh_ani':
                this.playSpine(this.cpgtgh_ani, ani, this.onHuAniFinished.bind(this));
                break;
            case 'liangzhang_ani':
                this.playSpine(this.liangzhang_ani, ani, this.onHuAniFinished.bind(this));
                break;
            case 'piaohu_ani':
                this.playSpine(this.piaohu_ani, ani, this.onHuAniFinished.bind(this));
                break;
            case 'qys_ani':
                this.playSpine(this.qys_ani, ani, this.onHuAniFinished.bind(this));
                break;
            case 'xiaosa_ani':
                this.playSpine(this.xiaosa_ani, ani, this.onHuAniFinished.bind(this));
                break;
            case 'hu_ani':
                if (this.huEffect) {
                    this.huEffect.active = true;
                }
                this.playSpine(this.hu_ani, ['play'], this.onHuAniFinished.bind(this), true);
                break;
            case 'gangshangpao_ani':
                this.playSpine(this.gangshangpao_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case 'gangshanghua_ani':
                this.playSpine(this.gangshanghua_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case 'qidui_ani':
                this.playSpine(this.qidui_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case 'haoqidui_ani':
                this.playSpine(this.haoqidui_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case 'piaohu_ani_2':
                this.playSpine(this.piaohu_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            case 'piaohu_ani_2_qingyise':
                this.playSpine(this.piaohu_ani, ['qingyise'], this.onHuAniFinished.bind(this));
                break;
            case 'piaohu_ani_2_hunyise':
                this.playSpine(this.piaohu_ani, ['hunyise'], this.onHuAniFinished.bind(this));
                break;
            case 'shisanyao_ani':
                this.playSpine(this.shisanyao_ani, ['play'], this.onHuAniFinished.bind(this));
                break;
            default:
                this.onHuAniFinished();
                break;
        }

    },

    /**
     * 被胡
     */
    beihu: function (player) {
        var isChuPai = player[1];
        if (isChuPai) {
            // this.removeLastChupai();
            var pai_node = this.chuPai.pop();
            if (pai_node) {
                pai_node.destroy();
            }

            this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_ZSQ, [this]);

            if (!this.isNeimeng) {
                this.zhanshi_pai.node.active = false;
            }
        } {
            this.initBaiPai();
            this.resetBaiPai(player[0]);
        }
        //this.play_ani.play("jlmj_dianpao_texiao");
        cc.log("【UI】" + "玩家:" + player.userId + " 座位号:" + player.idx + "点炮");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('dianpao',1);
        if (this.dgpt_ani) {
            this.playSpine(this.dgpt_ani, ['dianpao', 'dianpaoXS']);
        }
    },


    jbdgaAniCallback: function () {
        if (this.jbdga_ani_remove_stop) {
            return;
        }
        this.jbdga_ani.node.active = false;
        cc.log("jbdgaAni call back ---------");
        this.jbdga_ani.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);
    },
    /**
     * 风杠
     */
    fgang: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        // this.addSFGPai(baipai_data);
        this.resetBaiPai(player);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }
        this.require_mj_audio.playAudioBySex("mingDan", player.sex);
        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.dgpt_ani, ['mingdan', 'mingdanXS']);
    },


    /**
     * 1杠
     */
    _19gang1: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        this.resetBaiPai(player);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }
        this.require_mj_audio.playAudioBySex("mingDan", player.sex);
        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.dgpt_ani, ['mingdan', 'mingdanXS']);
    },

    /**
     * 9杠
     */
    _19gang9: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        // this.add19GPai(baipai_data);
        this.resetBaiPai(player);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }
        this.require_mj_audio.playAudioBySex("mingDan", player.sex);
        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.dgpt_ani, ['mingdan', 'mingdanXS']);
    },

    /**
     * 中发白杠
     */
    zfbgang: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        // this.addZFBGPai(baipai_data);
        this.resetBaiPai(data[0]);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }
        this.require_mj_audio.playAudioBySex("mingDan", player.sex);
        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.dgpt_ani, ['mingdan', 'mingdanXS']);
    },

    /**
     * 巴杠
     */
    bagang: function (data) {
        cc.log("吧杠开始");
        var player = data[0];
        var baipai_data = data[1];
        // this.addBaGangPai(baipai_data);
        this.resetBaiPai(player);
        this.updateShouPai(player);

        if (this.gang_ani) {
            let _audio = ['gang1', 'gang2', 'gang3', 'gang4'];
            let index = cc.dd.Utils.random(0, _audio.length - 1);
            this.require_mj_audio.playAudioBySex(_audio[index], player.sex);
            this.playSpine(this.gang_ani, ['play']);
        } else {
            this.require_mj_audio.playAudioBySex("mingDan", player.sex);
            this.playSpine(this.dgpt_ani, ['mingdan', 'mingdanXS']);
        }

        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        cc.log("吧杠结束");
    },

    /**
     * 暗杠
     */
    angang: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        // this.addAnGangPai(baipai_data);
        this.resetBaiPai(player);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }

        if (this.gang_ani) {
            let _audio = ['gang1', 'gang2', 'gang3', 'gang4'];
            let index = cc.dd.Utils.random(0, _audio.length - 1);
            this.require_mj_audio.playAudioBySex(_audio[index], player.sex);
            this.playSpine(this.gang_ani, ['play']);
        } else {
            this.require_mj_audio.playAudioBySex("anDan", player.sex);
            this.playSpine(this.dgpt_ani, ['andan', 'andanXS']);
        }

        //this.play_ani.play("jlmj_andan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('andan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

    },

    /**
     * 点杠
     */
    diangang: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        // this.addDianGangPai(baipai_data);
        this.resetBaiPai(player);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }

        if (this.gang_ani) {
            let _audio = ['gang1', 'gang2', 'gang3', 'gang4'];
            let index = cc.dd.Utils.random(0, _audio.length - 1);
            this.require_mj_audio.playAudioBySex(_audio[index], player.sex);
            this.playSpine(this.gang_ani, ['play']);
        } else {
            this.require_mj_audio.playAudioBySex("mingDan", player.sex);
            this.playSpine(this.dgpt_ani, ['mingdan', 'mingdanXS']);
        }

        //this.play_ani.play("jlmj_mingdan_texiao");

        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);
    },

    /**
     * 关闭手牌遮挡
     */
    setShoupaiTouch: function (isShow) {

    },

    /**
     * 明杠展示
     * @param pais
     */
    _setMingGang: function (pais, baipai, player) {
        var use_kaipai_cfg = false;
        if (player.isUserPlayer() && player.state == this.require_PlayerState.HUPAI) {
            //自家摆牌结算时使用开牌配置
            use_kaipai_cfg = true;
        }
        var idAndCnts = baipai.getShowPaiList();
        var mj_index = baipai.mj_index;
        if (player.viewIdx == 1 || player.viewIdx == 3) {
            if (player.state != this.require_PlayerState.HUPAI && player.getBaiPaiNum() <= 13) {
                //左右玩家,摆牌数小于13时,从第3张牌起布局
                mj_index += 2;
            }
        }
        //循环遍历摆牌ui并且设置摆牌ui的数据
        for (var idx = 0; idx < pais.length; ++idx) {
            var jlmj_pai = pais[idx];
            if (!jlmj_pai.node.parent) {
                this.node.addChild(jlmj_pai.node);
            }
            //3+1
            if (idx == 0) {
                jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_up_cfg : this.pai3dCfg.baipai_open_up_cfg;
                jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + 1)], jlmj_pai.cfgArrObj['value_' + (mj_index + 1)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + 1)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + 1)]);
            } else {
                jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_cfg : this.pai3dCfg.baipai_open_down_cfg;
                jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx - 1)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx - 1)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + idx - 1)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + idx - 1)]);
            }
            jlmj_pai.setValue(idAndCnts[idx].id);
            jlmj_pai.setCnt(idAndCnts[idx].cnt);
            this.updateBaiPaiSpace(jlmj_pai, baipai, player);
            if (this.need_offsetX === true) {
                jlmj_pai.node.x -= 76;
            }
            if (this.need_offsetX_4 === true) {
                jlmj_pai.node.x -= 57;
            }
        }
    },
    /**
     * 暗杠展示
     */
    _setAngGang: function (pais, baipai, player) {
        // if(!player.isUserPlayer() && player.state == this.require_PlayerState.HUPAI){
        //     //结算时,其他玩家暗杠布局,使用openAnGang
        //     return;
        // }
        var use_kaipai_cfg = false;
        if (player.isUserPlayer() && player.state == this.require_PlayerState.HUPAI) {
            //自家摆牌结算时使用开牌配置
            use_kaipai_cfg = true;
        }

        var idAndCnts = baipai.getShowPaiList();
        var mj_index = baipai.mj_index;
        if (player.viewIdx == 1 || player.viewIdx == 3) {
            if (player.state != this.require_PlayerState.HUPAI && player.getBaiPaiNum() <= 13) {
                //左右玩家,摆牌数小于13时,从第3张牌起布局
                mj_index += 2;
            }
        }
        //循环遍历摆牌ui并且设置摆牌ui的数据
        for (var idx = 0; idx < pais.length; ++idx) {
            var jlmj_pai = pais[idx];
            if (!jlmj_pai.node.parent) {
                this.node.addChild(jlmj_pai.node);
            }
            let cankaipai = false;
            let kaipaidata = null;

            if (pais.length == 3) {
                if (idx == 1) {
                    if (player.kaipai_an_gang_list.length > 0) {
                        for (var id in player.kaipai_an_gang_list) {
                            let gang_data = player.kaipai_an_gang_list[id];
                            if (gang_data.show) {
                                cankaipai = gang_data.isBaoPai;
                                kaipaidata = gang_data;
                                break;
                            }
                        }
                    }

                    if (idAndCnts[idx].id != -1) {  //有值就显示, 幺鸡,二筒,八万的暗杠需要显示出来
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_cfg : this.pai3dCfg.baipai_open_down_cfg;
                        jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + idx)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + idx)]);
                        jlmj_pai.setValue(idAndCnts[idx].id);
                        jlmj_pai.setCnt(idAndCnts[idx].cnt);
                    } else if (cankaipai && kaipaidata) { //结算时打开其他玩家暗杠
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_cfg : this.pai3dCfg.baipai_open_down_cfg;
                        jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + idx)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + idx)]);

                        jlmj_pai.setValue(kaipaidata.value);
                        kaipaidata.show = false;
                        //jlmj_pai.setValue(player.kaipai_an_gang_list[player.kaipai_an_gang_show_idx]);
                        //player.kaipai_an_gang_show_idx++;
                        jlmj_pai.setCnt(1);
                    } else {
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_close_cfg : this.pai3dCfg.baipai_close_down_cfg;
                        jlmj_pai.daopai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj);
                    }
                } else {
                    jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_close_cfg : this.pai3dCfg.baipai_close_down_cfg;
                    jlmj_pai.daopai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj);
                }
            } else {
                //3+1
                if (idx == 0) {
                    if (player.kaipai_an_gang_list.length > 0) {
                        for (var id in player.kaipai_an_gang_list) {
                            let gang_data = player.kaipai_an_gang_list[id];
                            if (gang_data.show) {
                                cankaipai = !gang_data.isBaoPai;
                                kaipaidata = gang_data;
                                break;
                            }
                        }
                    }
                    // if (player.isUserPlayer()) {
                    if (idAndCnts[idx].id != -1) {  //有值就显示, 幺鸡,二筒,八万的暗杠需要显示出来
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_up_cfg : this.pai3dCfg.baipai_open_up_cfg;
                        jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + 1)], jlmj_pai.cfgArrObj['value_' + (mj_index + 1)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + 1)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + 1)]);
                        jlmj_pai.setValue(idAndCnts[idx].id);
                        jlmj_pai.setCnt(idAndCnts[idx].cnt);
                    }
                    else if (cankaipai && kaipaidata) { //结算时打开其他玩家暗杠
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_up_cfg : this.pai3dCfg.baipai_open_up_cfg;
                        jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + 1)], jlmj_pai.cfgArrObj['value_' + (mj_index + 1)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + 1)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + 1)]);

                        jlmj_pai.setValue(kaipaidata.value);
                        kaipaidata.show = false;
                        //jlmj_pai.setValue(player.kaipai_an_gang_list[player.kaipai_an_gang_show_idx]);
                        //player.kaipai_an_gang_show_idx++;
                        jlmj_pai.setCnt(1);
                    }
                    else {
                        jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_close_up_cfg : this.pai3dCfg.baipai_close_up_cfg;
                        jlmj_pai.daopai(jlmj_pai.cfgArrObj['frame_' + (mj_index + 1)], jlmj_pai.cfgArrObj);
                    }
                } else {
                    jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_close_cfg : this.pai3dCfg.baipai_close_down_cfg;
                    jlmj_pai.daopai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx - 1)], jlmj_pai.cfgArrObj);
                }
            }


            this.updateBaiPaiSpace(jlmj_pai, baipai, player);
            if (this.need_offsetX === true) {
                jlmj_pai.node.x -= 76;
            }
            if (this.need_offsetX_4 === true) {
                jlmj_pai.node.x -= 57;
            }
        }
    },

    /**
     * 普通摆牌
     */
    _setbaipaiValue: function (pais, baipai, player) {
        var use_kaipai_cfg = false;
        if (player.isUserPlayer() && player.state == this.require_PlayerState.HUPAI) {
            //自家摆牌结算时使用开牌配置
            use_kaipai_cfg = true;
        }
        var mj_index = baipai.mj_index;
        if (player.viewIdx == 1 || player.viewIdx == 3) {
            if (player.state != this.require_PlayerState.HUPAI && player.getBaiPaiNum() <= 13) {
                //左右玩家,摆牌数小于13时,从第3张牌起布局
                mj_index += 2;
            }
        }

        let use2D = this.require_DeskData.Instance().getIs2D()

        //循环遍历摆牌ui并且设置摆牌ui的数据
        pais.forEach(function (jlmj_pai, idx) {
            if (!jlmj_pai.node.parent) {
                this.node.addChild(jlmj_pai.node);
            }
            var idAndCnts = baipai.getShowPaiList();
            jlmj_pai.cfgArrObj = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_cfg : this.pai3dCfg.baipai_open_down_cfg;
            jlmj_pai.kaipai(jlmj_pai.cfgArrObj['frame_' + (mj_index + idx)], jlmj_pai.cfgArrObj['value_' + (mj_index + idx)], jlmj_pai.cfgArrObj, jlmj_pai.cfgArrObj['liangzhang_' + (mj_index + idx)], jlmj_pai.cfgArrObj['hunpai_' + (mj_index + idx)]);
            jlmj_pai.setValue(idAndCnts[idx].id);
            jlmj_pai.setCnt(idAndCnts[idx].cnt);
            this.updateBaiPaiSpace(jlmj_pai, baipai, player);
            if (this.need_offsetX === true) {
                jlmj_pai.node.x -= 76;
            }
            if (this.need_offsetX_4 === true) {
                jlmj_pai.node.x -= 57;
            }
            if (player.viewIdx == 0 && use2D && player.state != this.require_PlayerState.HUPAI) {
                if (pais.length == 5) {
                    jlmj_pai.node.x -= 19 * idx;
                    if (idx == 4) {
                        this.need_offsetX = true;
                    }
                }
                if (pais.length == 4) {
                    jlmj_pai.node.x -= 19 * idx;
                    if (idx == 3) {
                        this.need_offsetX_4 = true;
                    }
                }
            }

            if (baipai.type == BaipaiType.LZB) {
                jlmj_pai.showLZB();
            }
        }.bind(this));
    },

    /**
     * 补花
     * @param pais
     * @param baipai
     * @param player
     * @private
     */
    _setBuHua(pais, baipai, player) {
        // zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + idx]);
        //循环遍历摆牌ui并且设置摆牌ui的数据
        pais.forEach(function (jlmj_pai, idx) {
            if (!jlmj_pai.node.parent) {
                this.node.addChild(jlmj_pai.node);
            }
            var idAndCnts = baipai.getShowPaiList();
            jlmj_pai.cfgArrObj = this.pai3dCfg.huapai_cfg;
            jlmj_pai.buhua(jlmj_pai.cfgArrObj['frame_' + idx], jlmj_pai.cfgArrObj['value_' + idx], jlmj_pai.cfgArrObj);
            jlmj_pai.setValue(idAndCnts[idx].id);
            jlmj_pai.setCnt(idAndCnts[idx].cnt);
        }.bind(this));
    },

    /**
     * 隐藏摆牌
     */
    initBaiPai: function () {
        this.baipai_ui_list.forEach(function (baipai_ui) {
            baipai_ui.clear();
        });
        this.baipai_ui_list = [];
        if (this.buhua_ui) {
            this.buhua_ui.clear();
        }
        this.buhua_ui = null;
    },

    /**
     * 摆牌值排序
     */
    sortBaiPai: function (baipaiData) {
        if (baipaiData.cardIds != null) {
            baipaiData.cardIds.sort(function (a, b) {
                if (a > b) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }

        if (baipaiData.idAndCnts != null) {
            baipaiData.idAndCnts.sort(function (a, b) {
                if (a.id > b.id) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
    },



    /**
     * 修改中发白吃牌的显示为背面
     * @param cardList
     * @param dataList
     */
    setZFB_chi: function (baipai, cardList, mj_index, player) {
        var use_kaipai_cfg = false;
        if (player.isUserPlayer() && player.state == this.require_PlayerState.HUPAI) {
            //自家摆牌结算时使用开牌配置
            use_kaipai_cfg = true;
        }
        var arr = [];
        for (var i = 0; cardList && i < cardList.length; ++i) {
            arr.push(cardList[i].cardId);

        }
        if (player.viewIdx == 1 || player.viewIdx == 3) {
            if (player.state != this.require_PlayerState.HUPAI && player.getBaiPaiNum() <= 13) {
                //左右玩家,摆牌数小于13时,从第3张牌起布局
                mj_index += 2;
            }
        }
        if (this.require_analysts.Instance().isZFB(arr)) {
            var jlmj_pai = cardList[1];
            var cur_x = jlmj_pai.node.x;
            var cur_y = jlmj_pai.node.y;
            var closeDownCfg = use_kaipai_cfg ? this.pai3dCfg.shoupai_kaipai_close_cfg : this.pai3dCfg.baipai_close_down_cfg;
            jlmj_pai.daopai(closeDownCfg['frame_' + (mj_index + 1)], closeDownCfg);
            jlmj_pai.node.x = cur_x;
            jlmj_pai.node.y = cur_y;
        }
    },


    /**
     * 补杠
     * @param data
     */
    bugang: function (data) {
        var player = data[0];
        var ccg_data = data[1];
        var xiao_ji_fly = data[2];
        var down_pai_change = data[3];
        var pai_id = data[4];

        this.resetBaiPai(player);
        this.updateShouPai(player);

        var getName = function (pai_id) {
            var idsAndNames = [];
            idsAndNames.push({ ids: [0, 1, 2, 3], name: "guoYiBing" });
            idsAndNames.push({ ids: [72, 73, 74, 75], name: "guoYiWan" });
            idsAndNames.push({ ids: [36, 37, 38, 39], name: "guoYaoJI" });

            idsAndNames.push({ ids: [32, 33, 34, 35], name: "guo9Bing" });
            idsAndNames.push({ ids: [68, 69, 70, 71], name: "guo9Tiao" });
            idsAndNames.push({ ids: [104, 105, 106, 107], name: "guo9Wan" });

            idsAndNames.push({ ids: [116, 117, 118, 119], name: "guoBaiBan" });
            idsAndNames.push({ ids: [108, 109, 110, 111], name: "guoHong" });
            idsAndNames.push({ ids: [112, 113, 114, 115], name: "guoFa" });

            idsAndNames.push({ ids: [120, 121, 122, 123], name: "guoDongF" });
            idsAndNames.push({ ids: [128, 129, 130, 131], name: "guoXiF" });
            idsAndNames.push({ ids: [124, 125, 126, 127], name: "guoNanF" });
            idsAndNames.push({ ids: [132, 133, 134, 135], name: "guoBeiF" });
            var name = "";
            idsAndNames.forEach(function (item) {
                if (item.ids.indexOf(pai_id) != -1) {
                    name = item.name;
                }
            });
            return name;
        };
        this.require_mj_audio.playAudioBySex(getName(pai_id), player.sex);
        //this.play_ani.play("jlmj_guodan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('guodan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);

        this.playSpine(this.dgpt_ani, ['guodan', 'guodanXS']);
    },


    /**
     * 刷新小鸡次数
     */
    updateXiaoJiCnt: function (player) {
        //移除小鸡飞
        // var cnt = player.getXiaoJiCnt();
        // if (cnt > 0) {
        //     this.xiaoji_cnt.node.active = true;
        //     this.xiaoji_cnt.cnt.string = cnt;
        // } else {
        //     this.xiaoji_cnt.node.active = false;
        // }
        // return cnt;
    },


    /**
     * 获取摆牌ui并且修改牌型
     */
    getBaiPaiUI: function (baipai_data) {
        var baipai_ui;
        this.baipai_ui_list.forEach(function (item) {
            if (item.index == baipai_data.index) {
                baipai_ui = item;
            }
        });
        if (!baipai_ui) {
            baipai_ui = BaiPaiUI.create(baipai_data.index, baipai_data.type);
            this.baipai_ui_list.push(baipai_ui);
        }
        baipai_ui.resetPaiUi(baipai_data, baipai_data.isCCG() ? this.createCCGPai.bind(this) : this.createPai.bind(this));
        return baipai_ui;
    },

    /**
     * 获取摆牌ui并且修改牌型
     */
    getBuHuaUI: function (baipai_data) {
        if (!this.buhua_ui) {
            this.buhua_ui = BaiPaiUI.create(baipai_data.index, baipai_data.type);
        }
        this.buhua_ui.resetPaiUi(baipai_data, baipai_data.isCCG() ? this.createCCGPai.bind(this) : this.createPai.bind(this));
        return this.buhua_ui;
    },

    /**
     * 获取摆牌UI
     * @param index
     * @returns {*}
     */
    getBaiPaiUIByIndex: function (index) {
        var baipai_ui = null;
        this.baipai_ui_list.forEach(function (item) {
            if (item.index == index) {
                baipai_ui = item;
            }
        });
        return baipai_ui;
    },

    /**
     * 生成牌
     */
    createPai: function () {
        var pai_node = cc.instantiate(this.prefab_pai);
        var jlmj_pai = pai_node.getComponent(mjConfigValue.mjPai);
        if (!jlmj_pai) {
            cc.error("麻将牌没有jlmj_pai组件");
        }
        return jlmj_pai;
    },

    /**
     * 生成长春杠牌
     */
    createCCGPai: function () {
        var pai = this.ccgpai_prefab;
        var pai_node = cc.instantiate(pai);
        var jlmj_ccgpai = pai_node.getComponent("jlmj_ccgpai");
        if (!jlmj_ccgpai) {
            cc.error("麻将牌没有jlmj_ccgpai组件");
        }
        return jlmj_ccgpai;
    },

    /**
     * 更新摆牌间隔
     * @param jlmj_pai
     * @param baipai_data
     */
    updateBaiPaiSpace: function (jlmj_pai, baipai_data, player) {
        var pos_cfg = jlmj_pai.node.getPosition();
        var pos_space = cc.v2(this.pai3dCfg.baipai_space.x * baipai_data.mj_index, this.pai3dCfg.baipai_space.y * baipai_data.mj_index);
        jlmj_pai.node.setPosition(pos_cfg.add(pos_space));
    },

    /**
     * gm更新手牌
     */
    gmUpdateShouPai: function (data) {

    },

    /**
     * 听牌
     * @param data
     */
    ting: function (player) {
        this.updateShouPai(player);
        this.require_mj_audio.playAudioBySex("ting", player.sex);
        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('ting',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);
        if (RoomMgr.Instance().isSuiHuaMJ()) {
            let arrBaiPaiData = player.baipai_data_list;
            if ((arrBaiPaiData.length == 0 || (arrBaiPaiData.length == 1 && arrBaiPaiData[0].type == BaipaiType.LZB)) && RoomMgr.Instance()._Rule.ismoyu) {
                // this.ani2_ani.node.active = true;
                // this.ani2_ani.setAnimation(0,"menting",false);
                // setTimeout(function () {
                //     this.ani2_ani.clearTracks();
                //     this.ani2_ani.node.active = false;
                //     cc.log("tcp call back ---------");
                // }.bind(this), 2000);
                this.playSpine(this.dgpt_ani, ['menting']);
            } else {
                // this.tcp_ani.node.active = true;
                // this.tcp_ani.playAnimation('ting',1);
                // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);
                this.playSpine(this.cpgtgh_ani, ['ting', 'tingXS']);
            }
        } else {
            this.playSpine(this.cpgtgh_ani, ['ting', 'tingXS']);
        }
    },

    /**
     * 潇洒
     * @param data
     */
    xiaosa: function (player) {
        this.updateShouPai(player);
        this.require_mj_audio.playAudioBySex("xiaosa", player.sex);
        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('ting',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);
        this.playSpine(this.xiaosa_ani, ['xiaosa', 'xiaosaXS']);
    },

    chiTing: function (player, isxiaosa) {
        this.resetBaiPai(player);
        this.updateShouPai(player);
        this.require_mj_audio.playAudioBySex("ting", player.sex);
        // this.ani2_ani.node.active = true;
        // this.ani2_ani.setAnimation(0,"chiting",false);
        // setTimeout(function () {
        //     this.ani2_ani.clearTracks();
        //     this.ani2_ani.node.active = false;
        //     cc.log("tcp call back ---------");
        // }.bind(this), 2000);
        this.playSpine(this.dgpt_ani, ['chiting', 'chitingXS']);
    },

    pengTing: function (player, isxiaosa) {
        this.resetBaiPai(player);
        this.updateShouPai(player);
        this.require_mj_audio.playAudioBySex("ting", player.sex);
        // this.ani2_ani.node.active = true;
        // this.ani2_ani.setAnimation(0,"chating",false);
        // setTimeout(function () {
        //     this.ani2_ani.clearTracks();
        //     this.ani2_ani.node.active = false;
        //     cc.log("tcp call back ---------");
        // }.bind(this), 2000);
        this.playSpine(this.dgpt_ani, ['chating', 'chatingXS']);
    },

    gangTing: function (player, isxiaosa) {
        this.resetBaiPai(player);
        this.updateShouPai(player);
        this.require_mj_audio.playAudioBySex("ting", player.sex);
        // this.db_hu_4.node.active = true;
        // this.db_hu_4.setAnimation(0,"gangtingCX",false);
        // this.db_hu_4.scheduleOnce(function () {
        //     this.db_hu_4.clearTracks();
        //     this.db_hu_4.node.active = false;
        //     cc.log("tcp call back ---------");
        // }.bind(this), 2);
        this.playSpine(this.dgpt_ani, ['gangting', 'gangtingXS']);
        if (isxiaosa) {
            setTimeout(function () {
                this.require_mj_audio.playAudioBySex("xiaosa", player.sex);
            }, 1700);
        }
    },

    genzhuang: function () {
        if (!RoomMgr.Instance()._Rule.genzysindex || this.require_DeskData.Instance().is_genzhuang) {
            return;
        }
        var player_list = this.require_playerMgr.Instance().playerList;
        var z_pai = player_list[0].chupai[0];
        for (let i = 0, len = player_list.length; i < len; ++i) {
            var player_info = player_list[i];
            if (player_info.baipai_data_list.length != 0 || player_info.chupai.length > 1 ||
                !z_pai || Math.floor(z_pai / 4) != Math.floor(player_info.chupai[0] / 4)) {
                return;
            }
        }
        var player = this.require_playerMgr.Instance().getPlayer(cc.dd.user.id);
        this.require_mj_audio.playAudioBySex("genzhuangyoushang", player.sex);
        this.require_DeskData.Instance().is_genzhuang = true;
    },

    /**
     * 碰
     */
    langzhang: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        this.chupai_act = false;
        this.resetBaiPai(player);
        this.updateShouPai(player);
        this.require_mj_audio.playAudioBySex("liangzhang", player.sex);
        //this.play_ani.play("jlmj_peng_texiao");

        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('cha',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);
        // this.ani2_ani.node.active = true;
        // this.ani2_ani.setAnimation(0,'liangzhang',false);
        // setTimeout(function () {
        //     this.ani2_ani.clearTracks();
        //     this.ani2_ani.node.active = false;
        // }.bind(this), 2000);
        this.playSpine(this.liangzhang_ani, ['liangzhang', 'liangzhangXS']);
    },

    /**
     * 清理
     * @param data
     */
    clear: function (data) {
        this.zhanshi_pai.node.active = false;
        this.gangtips = null;
        cc.log("player_ui 清理桌子" + this.viewIdx);

        this.shouPai.forEach(function (pai) {
            pai.setHunPai(false);
            pai.node.active = false;

            //todo 朋友场 临时处理
            pai.value.node.active = false;
            pai.mask.active = false;
        });

        this.chuPai.forEach(function (pai) {
            pai.destroy();
        });
        this.chuPai = [];

        this.baipai_ui_list.forEach(function (baipai_ui) {
            baipai_ui.clear();
        });
        this.baipai_ui_list = [];
        if (this.buhua_ui) {
            this.buhua_ui.clear();
        }
        this.buhua_ui = null;
        if (this.modepai) {
            this.modepai.node.active = false;
            this.modepai.setHunPai(false);
            //todo 朋友场 临时处理
            this.modepai.value.node.active = false;
            this.modepai.mask.active = false;
        }

        this.head.clear();
        if (!this.require_DeskData.Instance().isFriend()) {
            if (this.require_DeskData.Instance().isMatch() && this.require_DeskData.Instance().inJueSai) {
            } else {
                this.head.node.active = false;
                if (this.playerLocation) {
                    this.playerLocation.active = false;
                }
            }
        }

        this.clearHuPai();

        this.jbdga_ani_state(false);

        //关闭玩家详细界面
        cc.dd.UIMgr.closeUI(this.require_jlmj_prefab.JLMJ_USERINFO);
    },

    /**
     * 清除出牌
     */
    clearChuPai: function () {
        this.chuPai.forEach(function (pai) {
            pai.destroy();
        });
        this.chuPai = [];
    },

    /**
     * 隐藏摸的牌
     */
    hideModepai: function () {
        this.modepai.node.active = false;
    },

    /**
     * @method 获取完整声音路径
     * @param {String} cfgName 配置文件名
     * @param {Number} fileCount 音效文件个数 用作1-n个范围随机某一个播放
     * @return {String} 完整声音路径
     */
    getFullSoundPath: function (cfgName, fileCount) {
        var sex = this.sex;

        // 做了一个特殊处理， 0和2都有可能是女的，男的确定是1
        if (sex != 1) {
            sex = 2;
        }
        var soundPath = "" + mjConfigValue.mjAudioPath + "/audio/"
        var randomIdx = null;
        if (fileCount > 1) {
            randomIdx = cc.dd.Utils.random(1, fileCount);
        }
        var soundFile = cfgName + (randomIdx ? "_" + randomIdx : "") + "_s" + sex;
        var soundFormat = "";

        return soundPath + soundFile + soundFormat;
    },

    /**
     * @method 获取完整音效路径
     * @param {String} cfgName 配置文件名
     * @return {String} 完整音效路径
     */
    getFullEffectPath: function (cfgName) {
        var soundPath = "gameyj_mj/common/audio/audio/"
        var soundFile = cfgName
        var soundFormat = "";

        return soundPath + soundFile + soundFormat;
    },

    /**
     * 牌 音效
     */
    speakCard: function (cardId) {
        var fullPath = this.getFullSoundPath(MjSoundCfg[cardId]);
        AudioManager.playSound(fullPath);
    },

    /**
     * 打宝 音效
     */
    speakDaBao: function () {
        var soundName = "";
        //Todo打宝音效播放，暂时没有音效
    },
    /**
     * 吃 音效
     */
    speakChi: function () {
        var cfgName = "mj_chi";
        var fullPath = this.getFullSoundPath(cfgName);
        AudioManager.playSound(fullPath);
    },

    /**
     * 碰 音效
     */
    speakPeng: function () {
        var cfgName = "mj_peng";
        var fullPath = this.getFullSoundPath(cfgName);
        AudioManager.playSound(fullPath);
    },

    /**
     * 杠 音效
     */
    speakGang: function (gangType) {
        var cfgName = "";
        switch (gangType) {
            case GangType.Gang: // 杠
                cfgName = "mj_gang";
                break;
            case GangType.AnGang: // 暗杠
                cfgName = "mj_angang";
                break;
        }
        var fullPath = this.getFullSoundPath(cfgName);
        AudioManager.playSound(fullPath);
    },

    /**
     * 获取胡牌类型
     */
    getHuType: function (huTypeList) {
        var protoHuType = Define.HuType;

        var priorityHu = [protoHuType.MO_BAO, protoHuType.DUI_BAO, protoHuType.ZI_MO];
        for (var i = 0; i < priorityHu.length; ++i) {
            var value = priorityHu[i];
            for (var j = 0; j < huTypeList.length; ++j) {
                if (value == huTypeList[j]) {
                    return value;
                }
            }
        }
        return protoHuType.PING_HU;
    },

    /**
     * @method 通过胡牌类型 获取 配置名 和 音效个数
     * @param {Number} huType 胡牌类型
     * @return {Object} {cfgName: "mj_mobao", count: 2}
     */
    getHuCfg: function (huType) {
        var protoHuType = Define.HuType;
        var cfgName = "";
        var count = 0;
        switch (huType) {
            case protoHuType.MO_BAO:
                cfgName = "mj_mobao";
                break;
            case protoHuType.DUI_BAO:
                cfgName = "mj_duibao";
                count = 2;
                break;
            case protoHuType.ZI_MO:
                cfgName = "mj_zimo";
                count = 2;
                break;
            default:
                cfgName = "mj_dianpao";
                count = 2;
                break;
        }
        return { cfgName: cfgName, count: count };
    },

    /**
     * 是否自摸
     */
    isZiMo: function (huTypeList) {
        var protoHuType = Define.HuType;
        var huType = this.getHuType(huTypeList);
        switch (huType) {
            case protoHuType.MO_BAO:
                return true;
            case protoHuType.DUI_BAO:
                return true;
            case protoHuType.ZI_MO:
                return true;
            default:
                return false;
        }
    },

    /**
     * 胡 音效
     */
    speakHu: function (huTypeList) {
        var huType = this.getHuType(huTypeList);
        var cfgObject = this.getHuCfg(huType);
        var fullPath = this.getFullSoundPath(cfgObject.cfgName, cfgObject.count);
        AudioManager.playSound(fullPath);
    },

    /**
     * 听 音效
     */
    speakTing: function () {
        var cfgName = "mj_ting";
        var fullPath = this.getFullSoundPath(cfgName);
        AudioManager.playSound(fullPath);
    },

    /**
     * 显示头像上的特效 该谁出牌
     * @param userID 出牌者id
     */
    showChupai: function (userID, dapaiCD) {
        if (userID > 0) {
            this.head.play_chupai_ani(dapaiCD);
        } else {
            this.head.stop_chupai_ani();
        }
    },

    /**
     * 显示 隐藏叫牌信息
     * @param userID 出牌者id
     */
    showAndHideJiaoInfo: function (player) {

    },
    /**
     * 显示或者隐藏牌的可操作
     * @param isShow
     * @param canCradList
     * @param type 操作菜单类型
     */
    showHideClickCard: function (isShow, canCradList, type) { },
    showDaPaiTing: function (isShow, canCradList, type) { },
    crearSelectCard: function () { },
    autoChupai: function (palyData, cardID) { },

    /**
     * 胡牌动画播放完成后的回调
     */
    onHuAniFinished: function () {
        if (this.huEffect) {
            this.huEffect.active = false;
        }
        cc.log("胡牌动画完成");
        cc._pauseLMAni = false;
        this.require_DeskData.Instance().isPlayHuAni = false;
        if (this.require_DeskData.Instance().jiesuanData) {
            this.require_DeskData.Instance().jiesuan();
            this.require_DeskData.Instance().jiesuanData = null;
        }
        cc.gateNet.Instance().clearDispatchTimeout();
    },

    /**
     * 标记宝牌
     */
    biaojiBaoPai: function () {
        this.quXiaoBiaojiBaoPai();
        this.baobai_biaoji = [];
        if (this.require_DeskData.Instance().unBaopai >= 0) {
            if (this.require_UserPlayer.isBaoTing || this.require_UserPlayer.state == this.require_PlayerState.HUPAI) {
                this.baobai_biaoji = this.getPaiToID(this.require_DeskData.Instance().unBaopai);
                this.baobai_biaoji.forEach(function (pai) {
                    pai.setBaoPaiBiaoji(true);
                });
            }
        }
    },

    quXiaoBiaojiBaoPai: function () {
        if (this.baobai_biaoji) {
            for (var i = 0; i < this.baobai_biaoji.length; ++i) {
                if (this.baobai_biaoji[i] && this.baobai_biaoji[i].node && this.baobai_biaoji[i].node.isValid) {
                    this.baobai_biaoji[i].setBaoPaiBiaoji(false);
                }
            }
        }
        this.baobai_biaoji = null;
    },

    /**
     * 胡牌是 手牌也要标记
     * @param pai
     */
    biaojiBaoPaiInShouPai: function (pai) {
        if (this.require_DeskData.Instance().unBaopai >= 0) {
            if (Math.floor(pai.cardId / 4) == Math.floor(this.require_DeskData.Instance().unBaopai / 4)) {
                pai.setBaoPaiBiaoji(true);
            }
        }
    },

    /**
     * 取消标记宝牌 手牌中
     */
    quxiaoBiaoJIBaoPaiInShouPai: function () {
        for (var i = 0; i < this.shouPai.length; ++i) {
            this.shouPai[i].setBaoPaiBiaoji(false);
        }
        this.modepai.setBaoPaiBiaoji(false);
    },

    getBaiPaiAlignCenterOffsetY: function () {

    },

    /**
     * 摆牌垂直居中对齐
     */
    baiPaiAlignCenterV: function () {
        var offset_y = this.getBaiPaiAlignCenterOffsetY();
        let _offset_y = this.require_DeskData.Instance().getIs2D() ? 0 : 0.18;
        //左右玩家 计算x轴偏移
        if (this.viewIdx == 1) {
            var offset_x = -offset_y * _offset_y;
        } else {
            var offset_x = offset_y * _offset_y;
        }
        this.baipai_ui_list.forEach(function (baipai_ui) {
            baipai_ui.pais.forEach(function (pai) {
                pai.node.y += offset_y;
                pai.node.x += offset_x;
            });
        });
    },

    /**
     * 水平居中对齐
     */
    shouPaiAlignCenterH: function () {
        var offset_x = this.getAlignCenterOffsetX();
        this.baipai_ui_list.forEach(function (baipai_ui) {
            baipai_ui.pais.forEach(function (pai) {
                pai.node.x += offset_x;
            });
        });
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (this.shouPai[i].node.active) {
                this.shouPai[i].node.x += offset_x;
            }
        }
        if (this.modepai.node.active) {
            this.modepai.node.x += offset_x;
        }
    },

    /**
     * 垂直居中对齐
     */
    shouPaiAlignCenterV: function () {
        var offset_y = this.getAlignCenterOffsetY();
        let _offset_y = this.require_DeskData.Instance().getIs2D() ? 0 : 0.18;
        //左右玩家 计算x轴偏移
        if (this.viewIdx == 1) {
            var offset_x = -offset_y * _offset_y;
        } else {
            var offset_x = offset_y * _offset_y;
        }
        this.baipai_ui_list.forEach(function (baipai_ui) {
            baipai_ui.pais.forEach(function (pai) {
                pai.node.y += offset_y;
                pai.node.x += offset_x;
            });
        });
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (this.shouPai[i].node.active) {
                this.shouPai[i].node.y += offset_y;
                this.shouPai[i].node.x += offset_x;
            }
        }
        if (this.modepai.node.active) {
            this.modepai.node.y += offset_y;
            this.modepai.node.x += offset_x;
        }
    },

    setHeadCoin: function (coin) {
        this.head.setCoin(coin);
        if (this.require_DeskData.Instance().isJBC()) {
            this.head.showPochan();
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        if (cc.replay_gamedata_scrolling) {
            return;
        }
        if (event == SysEvent.PAUSE) {
            if (this.sysPause) {
                this.sysPause();
            }
            return;
        }

        if (!data || !data instanceof Array) {
            return;
        }
        var player = data[0];
        this.sex = player.sex;
        if (this.viewIdx != player.viewIdx) {
            return;
        }

        switch (event) {
            case this.require_PlayerEvent.MOPAI:
                cc.log("【数据】收到摸牌通知");
                // var cfgName = "effect_mopai";
                // var fullPath = this.getFullEffectPath(cfgName);
                // AudioManager.playSound(fullPath);
                this.mopai(player);
                break;
            case this.require_PlayerEvent.DAPAI:
                // var cfgName = "effect_dapai";
                // var fullPath = this.getFullEffectPath(cfgName);
                // AudioManager.playSound(fullPath);

                var idx = player.chupai.length - 1;
                var cardId = player.chupai[idx];
                this.speakCard(cardId);
                this.dapai(player, data[1]);
                break;
            case this.require_PlayerEvent.BUHUA:
                this.buhua(player);
                break;
            case this.require_PlayerEvent.BEICHI:
                this.beichi(player);
                break;
            case this.require_PlayerEvent.CHI:
                this.chi(data);
                break;
            case this.require_PlayerEvent.BEIPENG:
                this.beipeng(data);
                break;
            case this.require_PlayerEvent.PENG:
                this.peng(data);
                break;
            case this.require_PlayerEvent.BEIGANG:
                this.beigang(data);
                break;
            case this.require_PlayerEvent.FGANG:
                this.fgang(data);
                break;
            case this.require_PlayerEvent._19GANG1:
                this._19gang1(data);
                break;
            case this.require_PlayerEvent._19GANG9:
                this._19gang9(data);
                break;
            case this.require_PlayerEvent.ZFBGANG:
                this.zfbgang(data);
                break;
            case this.require_PlayerEvent.BUGANG:
                this.bugang(data);
                break;
            case this.require_PlayerEvent.BAGANG:
                this.bagang(data);
                break;
            case this.require_PlayerEvent.ANGANG:
                this.angang(data);
                break;
            case this.require_PlayerEvent.DIANGANG:
                this.diangang(data);
                break;
            case this.require_PlayerEvent.TING:
                this.ting(player);
                this.head.setTing(true);
                break;
            case this.require_PlayerEvent.BEIHU:
                this.beihu(data);
                break;
            case this.require_PlayerEvent.HU:
                this.hu(player, this.isZiMo(player.huTypeList));
                break;
            case this.require_PlayerEvent.KAIPAI:
                this.updateShouPai(player);
                this.setShoupaiTingbiaoji(false);
                break;
            case this.require_PlayerEvent.CLEAR:
                this.clear(data);
                break;
            case GmPaiKuEvent.GM_HUANPAI:
                this.gmUpdateShouPai(data);
                break;
            case this.require_PlayerEvent.READY:
                this.head.setReady(player.bready);
                this.head.setTing(false);
                break;
            case this.require_PlayerEvent.REMOVE_ROB_FAILED:
                this.resetBaiPai(player);
                break;
            case this.require_PlayerEvent.UPDATE_OWNER:
                this.updateOwner(data);
                break;
            case this.require_PlayerEvent.DAPAI_CDING://显示头像打牌特效
                this.showChupai(player.userId, player.dapaiCD);
                break;
            case this.require_PlayerEvent.CLEAR_DAPAI_CDING://取消头像特效
                this.showChupai(-1);
                break;
            case this.require_PlayerEvent.UPDATE_BANKER: //刷新房主
                this.head.setZJ(player.isbanker);
                break;
            case this.require_PlayerEvent.DA_BAO: // 打宝
                this.speakDaBao();
                break;
            case this.require_PlayerEvent.SHOW_CLICK://显示可操作的牌
                this.showHideClickCard(data[1], data[2], data[3]);
                break;
            case this.require_PlayerEvent.SHOW_DAPAI_TING:
                this.showDaPaiTing(data[1], data[2], data[3]);
                break;
            case this.require_PlayerEvent.CLEA_SELECT_CARD:
                this.crearSelectCard();
                break;
            case this.require_PlayerEvent.SET_COIN://设置金币
                this.setHeadCoin(player.coin);
                break;
            case this.require_PlayerEvent.TAKE_OVER_ZSQ:
                var lastCardNode = this.chuPai[this.chuPai.length - 1];
                this.setZsq(lastCardNode, this.viewIdx);
                break;
            case this.require_PlayerEvent.AUTO_CHU_PAI:
                this.autoChupai(data[0], data[1]);
                break;
            case this.require_PlayerEvent.IS_ON_LINE:
                this.head.setLX(!data[1]);
                break;
            case this.require_PlayerEvent.PLAY_MID2SHOU_PAI:
                this.play_mid2dapai_ani(data[1]);
                break;
            case this.require_PlayerEvent.SHOW_GU_PAI:
                this.showDaPaiGu(data[1], data[2], data[3]);
                break;
            case this.require_PlayerEvent.CHITING:
                this.chiTing(data[0], data[1]);
                this.head.setTing(true);
                if (RoomMgr.Instance().isFuXinMJ()) {
                    this.head.setXiaoSa(data[1]);
                }
                break;
            case this.require_PlayerEvent.PENGTING:
                this.pengTing(data[0], data[1]);
                this.head.setTing(true);
                if (RoomMgr.Instance().isFuXinMJ()) {
                    this.head.setXiaoSa(data[1]);
                }
                break;
            case this.require_PlayerEvent.GANGTING:
                this.gangTing(data[0], data[1]);
                this.head.setTing(data[1] == false);
                if (RoomMgr.Instance().isFuXinMJ()) {
                    this.head.setXiaoSa(data[1]);
                }
                break;
            case this.require_PlayerEvent.XIAOSA:
                this.xiaosa(player);
                this.head.setXiaoSa(true);
                break;
            case this.require_PlayerEvent.GENZHUANG:
                this.genzhuang();
                break;
            case this.require_PlayerEvent.CHGANG:
                this.caiHonggang(data);
                break;
            case this.require_PlayerEvent.LIANGZHANG:
                this.langzhang(data);
                break;
            case this.require_PlayerEvent.CHANGE_PAI_UI:
                this.changePaiUI(data[0]);
                break;
            case this.require_PlayerEvent.TUIDAO:
                this.tuidao(data[1]);
                break;
            case this.require_PlayerEvent.PAOFEN:
                this.head.showPaoFen(data[1]);
                this.paofen(data[1]);
                break;
            case this.require_PlayerEvent.GUO:
                if (this.guo_ani) {
                    this.require_mj_audio.playAudioBySex('guo', player.sex);
                    this.playSpine(this.guo_ani, ['play']);
                }
                break;
            case this.require_PlayerEvent.LIANGPAI:
                this.langpai(data);
                break;
            case this.require_PlayerEvent.SHOW_TING_TIPS:
                this.showTingTips(data[1]);
                this.head.setTingSprite(data[1]);
                break;
            case this.require_PlayerEvent.SHOW_HUANG_ZHUANG_TIPS:
                this.head.setHuangZhuang(data[1]);
                break;
            default:
                break;
        }
    },

    removeChupai: function (player) {
        // for(let i = 0; i < this.chuPai.length; i++){
        //     let jlmj_pai = this.chuPai[i].getComponent(mjConfigValue.mjPai);
        //     if(jlmj_pai.cardId == cardID){
        //         let pai = this.chuPai[i];
        //         this.chuPai.splice(i, 1);
        //         pai.destroy();
        //         break;
        //     }
        // }
        this.updateChuPaiUI(player, this.require_playerMgr.Instance().playerList.length == 2);

        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_ZSQ, [this]);

        this.zhanshi_pai.node.active = false;
    },

    stopChuPai() {
        this.zhanshi_pai.node.stopAllActions();
        this.modepai.node.stopAllActions();
        for (var i = 0; i < this.shouPai.length; i++) {
            var pai = this.shouPai[i];
            pai.node.stopAllActions();
        }

        // this.require_UserPlayer.mid2dapai_playing = false;

        this.mid2dapai_playing = false;
        this.zhanshi_pai.node.active = false;
        this.chuPai[this.chuPai.length - 1].active = true;
        this.setZsq(this.chuPai[this.chuPai.length - 1], this.viewIdx);
        this.require_playerMgr.Instance().playerMoPaiAction();

        this.modepai.node.active = false;
        this.updateShouPai(this.require_UserPlayer);
        this.modepai.node.x = this.modepai.original_x;
        this.modepai.node.y = this.modepai.original_y;
        this.chupai_act = false;
    },

    playSpine(spine, animList, func, notHideWhenFinished) {
        if (spine) {
            spine.node.active = true;
            for (let i = 0; i < animList.length - 1; i++) {
                spine.setMix(animList[i], animList[i + 1]);
            }
            let anim = animList.shift();
            spine.setAnimation(0, anim, false);
            spine.setCompleteListener(() => {
                if (animList.length > 0) {
                    anim = animList.shift();
                    spine.setAnimation(0, anim, false);
                } else {
                    spine.node.active = notHideWhenFinished;
                    if (func) {
                        func();
                    }
                }
            });
        } else if (func) {
            func();
        }

    },

    changePaiConfig() {
        this.resetConfig();
    },

    changePaiUI(player) {
        if (player) {
            this.updateChuPaiUI(player);
            this.resetBaiPai(player);
        }
        this.reset_zhanshi_pai();
        this.updateShouPai();
    },

    onLoad: function () {
        this.zhanshi_pai_node = cc.find("Canvas/desk_node/zhanshi_pais");

        this.initPlayerUI();
        this.initPai();
        this.chupai_act = false;
        this.initHuPai();
        this.initShouPai();
        this.initModepai();
        this.require_playerED.addObserver(this);
    },

    onDestroy: function () {
        this.require_playerED.removeObserver(this);
    },

    initPai: function () {
        this.resetConfig();
        var res_pai = cc.find('Canvas/mj_res_pai');
        if (!res_pai) {
            return null;
        }
        this.initPlayerPai(res_pai);
    },

    tuidao(tuidaoList) {
        if (!cc.dd._.isArray(tuidaoList)) {
            return;
        }
        for (var i = 0; i < this.shouPai.length; ++i) {
            this.shouPai[i].setTuidao(false);

            if (this.shouPai[i].node.active) {
                if (tuidaoList.indexOf(this.shouPai[i].cardId) != -1) {
                    this.shouPai[i].setTuidao(true);
                }
            }
        }
    },

    paofen(score) {
        if (this.dgpt_ani && RoomMgr.Instance().isTuiDaoHuMJ()) {
            score = Number(score);
            if (score <= 0) {
                return;
            }
            let anim = [];
            switch (score) {
                case 2:
                    anim.push('2fen');
                    anim.push('2fenXS');
                    break;
                case 3:
                    anim.push('3fen');
                    anim.push('3fenXS');
                    break;
                case 4:
                    anim.push('4fen');
                    anim.push('4fenXS');
                    break;
                case 5:
                    anim.push('5fen');
                    anim.push('5fenXS');
                    break;
            }

            this.playSpine(this.dgpt_ani, anim);
        }

    },

    /**
     * 亮牌杠
     */
    langpai: function (data) {
        var player = data[0];
        var baipai_data = data[1];

        this.resetBaiPai(player);
        this.updateShouPai(player);
        this.require_mj_audio.playAudioBySex("mingDan", player.sex);
        //this.play_ani.play("jlmj_peng_texiao");

        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('mingdan',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);
        this.playSpine(this.dgpt_ani, ['mingdan', 'mingdanXS']);
    },

    hidewShouPai() {
        this.shouPai.forEach(function (pai) {
            pai.node.active = false;
            pai.value.node.active = false;
            pai.mask.active = false;
        });

        if (this.modepai) {
            this.modepai.node.active = false;
            this.modepai.value.node.active = false;
            this.modepai.mask.active = false;
        }
    },

    showTingTips(hutypes) {
        this.gangtips = ''
        if (hutypes.indexOf(14) != -1) {//清一色
            this.gangtips += '清一色';
        }
        if (hutypes.indexOf(31) != -1) {//混一色
            this.gangtips += '混一色';
        }
        if (hutypes.indexOf(7) != -1) {//飘胡
            this.gangtips += '飘胡';
        }
        if (hutypes.indexOf(10) != -1) {//七对
            this.gangtips += '七对';
        }
        if (hutypes.indexOf(11) != -1) {//豪七
            this.gangtips += '豪七';
        }
        if (hutypes.indexOf(15) != -1) {//手把一
            this.gangtips += '把一';
        }
        if (hutypes.indexOf(32) != -1) {//纯清风
            this.gangtips += '纯清风';
        }
        this.gangtips += '暗杠';
        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if (!player) {
            return;
        }
        this.resetBaiPai(player);
    },

    setShoupaiTingbiaoji(isShow) {

    },

    initMJConfig() {
        return require('mjConfigValue').jlmj;
    },

    initPlayerUI() {
        cc.log("-----------------------no implements base_mj_player_base_ui initPlayerUI-----------------------")
    },

    resetConfig() {
        cc.log("-----------------------no implements base_mj_player_base_ui resetConfig-----------------------")
    },

    initPlayerPai(res_pai) {
        cc.log("-----------------------no implements base_mj_player_base_ui resetConfig-----------------------")
    },
    /**
     * 发送出牌
     */
    initHuPai: function () {
        cc.log("-----------------------no implements base_mj_player_base_ui initHuPai-----------------------")
    },

    /**
     * 发送出牌
     */
    clearHuPai: function () {
        cc.log("-----------------------no implements base_mj_player_base_ui clearHuPai-----------------------")
    },

    initMJComponet() {
        cc.log("-----------------------no implements base_mj_player_base_ui initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});

module.exports = base_ui;