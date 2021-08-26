var rank_info = require('rank_info');
var HallCommonData = require('hall_common_data').HallCommonData;
var FortuneHallManager = require('FortuneHallManager').Instance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var klb_gameList = require('klb_gameList');

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
        rankSpList: { default: [], type: cc.SpriteFrame, tooltip: '排行图片' },
        titleGame: { default: null, type: cc.Label, tooltip: '排行榜标题' },
        wan_sp: { default: null, type: cc.SpriteFrame, tooltip: '万字' },
        yi_sp: { default: null, type: cc.SpriteFrame, tooltip: '亿字' },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onClickHead(event, custom) {
        var tag = event.target.tagname;
        if (tag && tag.id) {
            var nickidUI = cc.dd.UIMgr.getUI('gameyj_hall/prefabs/klb_rank_nick_id');
            if (nickidUI) {
                nickidUI.getComponent('klb_rank_nick_id').setData(event.target, tag.nick, tag.id);
            }
            else {
                cc.dd.UIMgr.openUI('gameyj_hall/prefabs/klb_rank_nick_id', function (item) {
                    item.getComponent('klb_rank_nick_id').setData(event.target, tag.nick, tag.id);
                    item.zIndex = 5001;
                });
            }
        }
    },

    setData(msg) {
        var self = this;
        this.node.zIndex = 5000;
        var data = rank_info.getItem(function (item) {
            return item.key == msg.rankId;
        });
        if (!this.gameId) {
            this.gameId = data.game_type;
        }
        var gamedata = klb_gameList.getItem(function (item) {
            return item.gameid == self.gameId;
        });
        this.titleGame.string = gamedata ? gamedata.name + '排行榜' : '排行榜';
        msg.rankListList.sort(function (a, b) { return a.rank - b.rank });
        switch (data.refresh_type) {
            case 1://日榜
                var panel = cc.find('panels/panel1', this.node);
                var copymodel = cc.find('list/view/content/nn_rank_item', panel);
                var content = cc.find('list/view/content', panel);
                cc.find('list', panel).getComponent('com_glistView').setDataProvider(msg.rankListList, 0, function (itemNode, index) {
                    if (index < 0 || index >= msg.rankListList.length)
                        return;
                    var element = msg.rankListList[index];
                    if (element.rank < 4) {
                        itemNode.getChildByName('rank_img').getComponent(cc.Sprite).spriteFrame = self.rankSpList[element.rank - 1];
                        itemNode.getChildByName('rank_img').active = true;
                        itemNode.getChildByName('rank_lbl').active = false;
                    }
                    else {
                        itemNode.getChildByName('rank_lbl').getComponent(cc.Label).string = element.rank.toString();
                        itemNode.getChildByName('rank_img').active = false;
                        itemNode.getChildByName('rank_lbl').active = true;
                    }
                    var headsp = itemNode.getChildByName('head').getComponent(cc.Sprite);
                    self.initHead(headsp, element.headUrl);
                    itemNode.getChildByName('nick').getComponent(cc.Label).string = cc.dd.Utils.substr(element.name, 0, 4);
                    itemNode.getChildByName('coin').getComponent(cc.Label).string = this.getCoinStr(element.score);
                    itemNode.getChildByName('head').tagname = { nick: element.name, id: element.userId };
                }.bind(this));
                // msg.rankListList.forEach(element => {
                //     var newnode = cc.instantiate(copymodel);
                //     if (element.rank < 4) {
                //         newnode.getChildByName('rank_img').getComponent(cc.Sprite).spriteFrame = self.rankSpList[element.rank - 1];
                //         newnode.getChildByName('rank_img').active = true;
                //     }
                //     else {
                //         newnode.getChildByName('rank_lbl').getComponent(cc.Label).string = element.rank.toString();
                //         newnode.getChildByName('rank_lbl').active = true;
                //     }
                //     var headsp = newnode.getChildByName('head').getComponent(cc.Sprite);
                //     self.initHead(headsp, element.headUrl);
                //     newnode.getChildByName('nick').getComponent(cc.Label).string = cc.dd.Utils.substr(element.name, 0, 4);
                //     newnode.getChildByName('coin').getComponent(cc.Label).string = this.getCoinStr(element.score);
                //     newnode.active = true;
                //     content.addChild(newnode);
                // });
                var mine = cc.find('mine', panel);
                mine.getChildByName('rank').getComponent(cc.Label).string = msg.historyInfo.curRank == -1 ? '未上榜' : msg.historyInfo.curRank.toString();
                self.initHead(mine.getChildByName('head').getComponent(cc.Sprite), HallCommonData.getInstance().headUrl);
                mine.getChildByName('nick').getComponent(cc.Label).string = cc.dd.Utils.substr(HallCommonData.getInstance().nick, 0, 4);
                mine.getChildByName('coin').getComponent(cc.Label).string = this.getCoinStr(msg.historyInfo.curScore);


                var zrgj = cc.find('zrgj', panel);
                zrgj.getChildByName('rank').getComponent(cc.Label).string = msg.historyInfo.historyRank == -1 ? '未上榜' : msg.historyInfo.historyRank.toString();

                zrgj.getChildByName('nick').getComponent(cc.Label).string = cc.dd.Utils.substr(msg.historyInfo.championName, 0, 4);
                cc.dd.Utils.seekNodeByName(zrgj, 'head').getComponent(cc.Sprite).spriteFrame = null;
                if (msg.historyInfo.championName == '' && msg.historyInfo.championHead == '')
                    cc.dd.Utils.seekNodeByName(zrgj, 'head').getComponent(cc.Sprite).spriteFrame = null;
                else
                    self.initHead(cc.dd.Utils.seekNodeByName(zrgj, 'head').getComponent(cc.Sprite), msg.historyInfo.championHead);
                if (msg.historyInfo.championScore >= 100000000) {
                    var yingli = (Math.floor(msg.historyInfo.championScore / 1000000) / 100).toString().replace('.', ':');
                    zrgj.getChildByName('layout').getChildByName('dss_wan_zi').getComponent(cc.Sprite).spriteFrame = this.yi_sp;
                    zrgj.getChildByName('layout').getChildByName('yingli').getComponent(cc.Label).string = yingli;
                }
                else {
                    var yingli = (Math.floor(msg.historyInfo.championScore / 100) / 100).toString().replace('.', ':');
                    zrgj.getChildByName('layout').getChildByName('dss_wan_zi').getComponent(cc.Sprite).spriteFrame = this.wan_sp;
                    zrgj.getChildByName('layout').getChildByName('yingli').getComponent(cc.Label).string = yingli;
                }
                panel.tagname = 'inited';
                break;
            case 3://月榜
                var panel = cc.find('panels/panel3', this.node);
                var copymodel = cc.find('list/view/content/nn_rank_item', panel);
                var content = cc.find('list/view/content', panel);
                cc.find('list', panel).getComponent('com_glistView').setDataProvider(msg.rankListList, 0, function (itemNode, index) {
                    if (index < 0 || index >= data.length)
                        return;
                    var element = msg.rankListList[index];
                    if (element.rank < 4) {
                        itemNode.getChildByName('rank_img').getComponent(cc.Sprite).spriteFrame = self.rankSpList[element.rank - 1];
                        itemNode.getChildByName('rank_img').active = true;
                        itemNode.getChildByName('rank_lbl').active = false;
                    }
                    else {
                        itemNode.getChildByName('rank_lbl').getComponent(cc.Label).string = element.rank.toString();
                        itemNode.getChildByName('rank_lbl').active = true;
                        itemNode.getChildByName('rank_img').active = false;
                    }
                    var headsp = itemNode.getChildByName('head').getComponent(cc.Sprite);
                    self.initHead(headsp, element.headUrl);
                    itemNode.getChildByName('nick').getComponent(cc.Label).string = cc.dd.Utils.substr(element.name, 0, 4);
                    itemNode.getChildByName('coin').getComponent(cc.Label).string = this.getCoinStr(element.score);
                    itemNode.getChildByName('date').getComponent(cc.Label).string = self.getDateStr(element.timestamp);
                    itemNode.getChildByName('head').tagname = { nick: element.name, id: element.userId };
                }.bind(this));
                // msg.rankListList.forEach(element => {
                //     var newnode = cc.instantiate(copymodel);
                //     if (element.rank < 4) {
                //         newnode.getChildByName('rank_img').getComponent(cc.Sprite).spriteFrame = self.rankSpList[element.rank - 1];
                //         newnode.getChildByName('rank_img').active = true;
                //     }
                //     else {
                //         newnode.getChildByName('rank_lbl').getComponent(cc.Label).string = element.rank.toString();
                //         newnode.getChildByName('rank_lbl').active = true;
                //     }
                //     var headsp = newnode.getChildByName('head').getComponent(cc.Sprite);
                //     self.initHead(headsp, element.headUrl);
                //     newnode.getChildByName('nick').getComponent(cc.Label).string = cc.dd.Utils.substr(element.name, 0, 4);
                //     newnode.getChildByName('coin').getComponent(cc.Label).string = this.getCoinStr(element.score);
                //     newnode.getChildByName('date').getComponent(cc.Label).string = self.getDateStr(element.timestamp);
                //     newnode.active = true;
                //     content.addChild(newnode);
                // });
                panel.tagname = 'inited';
                break;
        }
    },

    //切换
    onToggle(event, custom) {
        hall_audio_mgr.com_btn_click();
        var panels = cc.find('panels', this.node);
        panels.children.forEach(node => {
            node.active = (node.name == 'panel' + custom);
        });
        var self = this;
        var rankId = rank_info.getItem(function (item) {
            return item.game_type == self.gameId && item.refresh_type == parseInt(custom);
        }).key;
        if (panels.getChildByName('panel' + custom).tagname != 'inited') {
            if (cc.dd.rankData && cc.dd.rankData[rankId]) {
                this.setData(cc.dd.rankData[rankId]);
            }
            else {
                const req = new cc.pb.room_mgr.msg_rank_req();
                req.setRankId(rankId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_rank_req, req,
                    'msg_rank_req', 'no');
            }
        }
    },
    // update (dt) {},

    initHead: function (headsp, headUrl) {
        // if (headUrl.indexOf('.jpg') != -1) {
        //     FortuneHallManager.getRobotIcon(headUrl, function (sprite) {
        //         headsp.spriteFrame = sprite;
        //     }.bind(this));
        // }
        // else {
        //     if (headUrl && headUrl != '') {
        headsp.spriteFrame = null;
        cc.dd.SysTools.loadWxheadH5(headsp, headUrl);
        //     }
        // }
    },

    getDateStr(timestamp) {
        var date = new Date(timestamp * 1000);
        var month = date.getUTCMonth() + 1;
        var day = date.getUTCDate();
        var str = (month > 9 ? month : '0' + month) + '月' + (day > 9 ? day : '0' + day) + '日';
        return str;
    },

    onClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.rankData = [];
        cc.dd.UIMgr.destroyUI(this.node);
    },

    getCoinStr(num) {
        if (num >= 100000000) {
            return (Math.floor(num / 1000000) / 100).toString() + '亿';
        }
        else if (num >= 10000) {
            return (Math.floor(num / 100) / 100).toString() + '万';
        }
        else {
            return num.toString();
        }
    },
});
