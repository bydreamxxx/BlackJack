var hall_prefab = require('hall_prefab_cfg');
var FortuneHallManager = require('FortuneHallManager').Instance();
var HallCommonData = require('hall_common_data').HallCommonData;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
var rank_info = require('rank_info');

cc.Class({
    extends: cc.Component,

    properties: {
        content_node: cc.Node,
        mine_node: cc.Node,
        zrgj_node: cc.Node,
        rank_icon: [cc.SpriteFrame],
        itemAtlas: cc.SpriteAtlas,
        titleSP: [cc.SpriteFrame],
        lableSP: [cc.SpriteFrame],
        coinSP: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this._dataCache = [];
        Hall.HallED.addObserver(this);
        this.sendRank2S();
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    sendRank2S: function () {
        var req = new cc.pb.room_mgr.msg_rank_req();
        req.setRankId(1001);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_rank_req, req,
            'msg_rank_req', 'no');
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'sendRank2S');
    },

    onClickHead(event, custom) {
        // var tag = event.target.tag;
        // if (tag && tag.id) {
        //     var nickidUI = cc.dd.UIMgr.getUI('blackjack_hall/prefabs/klb_rank_nick_id');
        //     if (nickidUI) {
        //         nickidUI.getComponent('klb_rank_nick_id').setData(event.target, tag.nick, tag.id);
        //     }
        //     else {
        //         cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_rank_nick_id', function (item) {
        //             item.getComponent('klb_rank_nick_id').setData(event.target, tag.nick, tag.id);
        //         });
        //     }
        // }
    },

    initData: function (msg) {

        /************************游戏统计 start************************/
        let _action = 0;
        switch (msg.rankId) {
            case 1001:
                _action = cc.dd.clientAction.T_HALL.RANK_GOLD;
                break;
            case 1000:
                _action = cc.dd.clientAction.T_HALL.RANK_PROFIT;
                break;
            case 1003:
                _action = cc.dd.clientAction.T_HALL.RANK_RICH;
                break;
            default:
                _action = cc.dd.clientAction.T_HALL.RANK_GOLD;
                break;
        }
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.RANK_TYPE, _action);
        /************************游戏统计   end************************/

        msg.rankListList.sort(function (a, b) { return a.rank - b.rank });
        var itemId = rank_info.getItem(function (item) {
            return item.key == msg.rankId;
        }).rank_score_type;
        cc.dd.NetWaitUtil.close();
        //this.content_node.removeAllChildren(true);
        cc.find('list', this.node).getComponent('com_glistView').setDataProvider(msg.rankListList, 0, function (itemNode, index) {
            if (index < 0 || index >= msg.rankListList.length)
                return;
            var element = msg.rankListList[index];
            if (element.rank < 4) {
                itemNode.getChildByName('rankbg').getComponent(cc.Sprite).spriteFrame = this.rank_icon[element.rank - 1];
                itemNode.getChildByName('rankbg').active = true;
                itemNode.getChildByName('rankLabel').active = false;
            }
            else {
                itemNode.getChildByName('rankLabel').getComponent(cc.Label).string = element.rank.toString();
                itemNode.getChildByName('rankbg').active = false;
                itemNode.getChildByName('rankLabel').active = true;
            }
            if (itemId != 1001) {
                itemNode.getChildByName('tagIcon').getComponent(cc.Sprite).spriteFrame = this.itemAtlas.getSpriteFrame(itemId.toString());
            } else {
                itemNode.getChildByName('tagIcon').getComponent(cc.Sprite).spriteFrame = this.coinSP;
            }
            var headsp = itemNode.getChildByName('head_mask').getChildByName('head').getComponent(cc.Sprite);
            headsp.spriteFrame = null;
            cc.dd.SysTools.loadWxheadH5(headsp, element.headUrl);
            itemNode.getChildByName('nameTxt').getComponent(cc.Label).string = cc.dd.Utils.subChineseStr(element.name, 0, 14);//cc.dd.Utils.substr(element.name, 0, 4);
            itemNode.getChildByName('idTxt').getComponent(cc.Label).string = 'ID:' + element.userId;//cc.dd.Utils.substr(element.name, 0, 4);
            itemNode.getChildByName('descTxt').getComponent(cc.Label).string = this.getCoinStr(element.score, itemId);
            headsp.node.tagname = { nick: element.name, id: element.userId };
        }.bind(this));
        // cc.dd.ResLoader.loadPrefab(hall_prefab.KLB_HALL_RANK_ITEM, function (prefab) {
        //     for (var i = 0; i < msg.rankListList.length; i++) {
        //         var node = cc.instantiate(prefab);
        //         if (msg.rankListList[i].rank < 4) {
        //             cc.find('rankbg', node).getComponent(cc.Sprite).spriteFrame = this.rank_icon[msg.rankListList[i].rank - 1];
        //         }
        //         else {
        //             cc.find('rankbg', node).active = false;
        //             cc.find('rankLabel', node).getComponent(cc.Label).string = msg.rankListList[i].rank.toString();
        //             cc.find('rankLabel', node).active = true;
        //         }
        //         cc.find('tagIcon', node).getComponent(cc.Sprite).spriteFrame = this.itemAtlas.getSpriteFrame(itemId.toString());
        //         cc.find('nameTxt', node).getComponent(cc.Label).string = cc.dd.Utils.substr(msg.rankListList[i].name, 0, 4);
        //         cc.find('descTxt', node).getComponent(cc.Label).string = this.getCoinStr(msg.rankListList[i].score, itemId);
        //         var headsp = cc.find('head_mask/head', node).getComponent(cc.Sprite);
        //         cc.dd.SysTools.loadWxheadH5(headsp, msg.rankListList[i].headUrl);
        //         this.content_node.addChild(node);
        //     }
        //     cc.dd.NetWaitUtil.close();
        // }.bind(this));

        var mine = this.mine_node;
        mine.getChildByName('rank').getComponent(cc.Label).string = msg.historyInfo.curRank == -1 ? '未上榜' : msg.historyInfo.curRank.toString();
        cc.dd.SysTools.loadWxheadH5(mine.getChildByName('head_mask').getChildByName('head').getComponent(cc.Sprite), HallCommonData.getInstance().headUrl);
        mine.getChildByName('nameTxt').getComponent(cc.Label).string = cc.dd.Utils.subChineseStr(HallCommonData.getInstance().nick, 0, 14);//cc.dd.Utils.substr(HallCommonData.getInstance().nick, 0, 4);
        mine.getChildByName('idTxt').getComponent(cc.Label).string = 'ID:' + cc.dd.user.id;//cc.dd.Utils.substr(HallCommonData.getInstance().nick, 0, 4);
        if (msg.rankId == 1001) {
            mine.getChildByName('descTxt').getComponent(cc.Label).string = this.getCoinStr(HallCommonData.getInstance().coin, itemId);
        }
        else {
            mine.getChildByName('descTxt').getComponent(cc.Label).string = this.getCoinStr(msg.historyInfo.curScore, itemId);
        }
        if (itemId !== 1001) {
            mine.getChildByName('tagIcon').getComponent(cc.Sprite).spriteFrame = this.itemAtlas.getSpriteFrame(itemId.toString());
        } else {
            mine.getChildByName('tagIcon').getComponent(cc.Sprite).spriteFrame = this.coinSP;
        }

        var zrgj = this.zrgj_node;
        zrgj.getChildByName('mine').getComponent(cc.Label).string = msg.historyInfo.historyRank == -1 ? '未上榜' : msg.historyInfo.historyRank.toString();
        zrgj.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr(msg.historyInfo.championName, 0, 4);
        zrgj.getChildByName('head_mask').getChildByName('head').getComponent(cc.Sprite).spriteFrame = null;
        cc.dd.SysTools.loadWxheadH5(zrgj.getChildByName('head_mask').getChildByName('head').getComponent(cc.Sprite), msg.historyInfo.championHead);
        if (itemId == 1004) {
            msg.historyInfo.championScore = Math.floor(msg.historyInfo.championScore / 100);//整取
        }
        if (msg.historyInfo.championScore >= 100000000) {
            var yingli = (Math.floor(msg.historyInfo.championScore / 100000000)).toString();
            zrgj.getChildByName('layout').getChildByName('yi').active = true;
            zrgj.getChildByName('layout').getChildByName('value').getComponent(cc.Label).string = yingli;
        }
        else {
            zrgj.getChildByName('layout').getChildByName('yi').active = false;
            zrgj.getChildByName('layout').getChildByName('value').getComponent(cc.Label).string = msg.historyInfo.championScore.toString();
        }
        if (msg.rankId == 1001) {
            zrgj.getChildByName('title_sp').getComponent(cc.Sprite).spriteFrame = this.titleSP[0];
            zrgj.getChildByName('lable_sp').getComponent(cc.Sprite).spriteFrame = this.lableSP[0];
            zrgj.getChildByName('zuori').getComponent(cc.Label).string = '我的昨日排名';
        }
        else if (msg.rankId == 1000) {
            zrgj.getChildByName('title_sp').getComponent(cc.Sprite).spriteFrame = this.titleSP[1];
            zrgj.getChildByName('lable_sp').getComponent(cc.Sprite).spriteFrame = this.lableSP[1];
            zrgj.getChildByName('zuori').getComponent(cc.Label).string = '我的昨日排名';
        }
        else if (msg.rankId == 1003) {
            zrgj.getChildByName('title_sp').getComponent(cc.Sprite).spriteFrame = this.titleSP[2];
            zrgj.getChildByName('lable_sp').getComponent(cc.Sprite).spriteFrame = this.lableSP[2];
            zrgj.getChildByName('zuori').getComponent(cc.Label).string = '我的上周排名';
        }
    },

    downloadRobotIcon: function (sp, url) {
        // FortuneHallManager.getRobotIcon(url, function (sprite) {
        //     sp.spriteFrame = sprite;
        // });
        cc.dd.SysTools.loadWxheadH5(sp, url);
    },

    onToggle: function (event, data) {
        if (this._dataCache[data] != null) {
            this.initData(this._dataCache[data]);
            return;
        }
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'sendRank2S');
        switch (data) {
            case '1000':
                cc.dd.NetWaitUtil.show('加载中...');
                var req = new cc.pb.room_mgr.msg_rank_req();
                req.setRankId(1000);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_rank_req, req,
                    'msg_rank_req', 'no');
                break;
            case '1001':
                cc.dd.NetWaitUtil.show('加载中...');
                var req = new cc.pb.room_mgr.msg_rank_req();
                req.setRankId(1001);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_rank_req, req,
                    'msg_rank_req', 'no');
                break;
            case '1003':
                cc.dd.NetWaitUtil.show('加载中...');
                var req = new cc.pb.room_mgr.msg_rank_req();
                req.setRankId(1003);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_rank_req, req,
                    'msg_rank_req', 'no');
                break;
        }
        //cc.dd.PromptBoxUtil.show('NOT YET OPEN');
    },

    closeBtn: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickKefu: function (event, data) {
        hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
        //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
        // });
        let Platform = require('Platform');
        let AppCfg = require('AppConfig');
        cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
    },

    onEventMessage: function (event, data) {
        const self = this;
        switch (event) {
            case Hall.HallEvent.Rank_Info:
                this._dataCache[data.rankId] = data;
                this.initData(data);
                break;
            default:
                break;
        }
    },
    // update (dt) {},
    getCoinStr(num, itemId) {
        if (itemId == 1004) {
            return (num / 100).toString() + '元';
        }
        else {
            if (num >= 100000000) {
                return (Math.floor(num / 1000000) / 100).toString() + '亿';
            }
            else if (num >= 10000) {
                return (Math.floor(num / 100) / 100).toString() + '万';
            }
            else {
                return num.toString();
            }
        }
    },
});
