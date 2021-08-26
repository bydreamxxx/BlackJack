
var hbsl_send = require('hbsl_send_msg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const HBSL_ED = require('hbslData').HBSL_ED;
const HBSL_Event = require('hbslData').HBSL_Event;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var Define = require('Define');
var hbsl_Data = require('hbslData').HBSL_Data;

cc.Class({
    extends: cc.Component,

    properties: {
        mlPrefab: { type: cc.Prefab, default: null, tooltip: '埋雷玩家预设体' },
        totalNum: { type: cc.Label, default: null, tooltip: "红包总金额" },
        tailNum: { type: cc.Label, default: null, tooltip: "尾号" },
        viewNode: { type: cc.Node, default: null, tooltip: "埋雷玩家父节点" },
        beishuList: { type: cc.Node, default: [], tooltip: "倍数集合" },
        jineList: { type: cc.Node, default: [], tooltip: "金额集合" },
        tiemNode: { type: cc.Node, default: null, tooltip: "倒计时" },
        shengqiBtn: { type: cc.Node, default: null, tooltip: "申请按钮" },
        quxiaoBtn: { type: cc.Node, default: null, tooltip: "取消按钮" },
        maileiBtn: { type: cc.Node, default: [], tooltip: "金币朋友按钮集合" },
        jibiBtn: { type: cc.Node, default: [], tooltip: "金币场基础按钮集合" },
        pyBtn: { type: cc.Node, default: [], tooltip: "朋友创基础按钮集合" },
        xuanzhognBg: { type: cc.Node, default: [], tooltip: "选中按钮背景" },
        beishuNode: { type: cc.Node, default: null, tooltip: "倍数" },
        jichuNode: { type: cc.Node, default: null, tooltip: "基础金额" },
        textstr: { type: cc.Label, default: null, tooltip: "描述" },
    },

    onLoad: function () {
        HBSL_ED.addObserver(this);
        this.ItmeID = null;
        this.HBNum = 10;
        this.beiNum = 1;
        this.weiNum = 0;
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            var rule = RoomMgr.Instance()._Rule;
            if (!rule) return;
            if (rule.zhuangType != 4)
                this.initFriend();
            var leiindex = rule.maxRate / 1 - 1;
            for (var i = 0; i < this.beishuList.length; ++i) {
                var itme = this.beishuList[i].getComponent(cc.Button);
                if (itme && i > leiindex) {
                    itme.interactable = false;
                } else {
                    itme.interactable = true;
                }
            }
            var maileiNum = 0;
            switch (rule.mailei / 10000) {
                case 10:
                    maileiNum = -1;
                    break;
                case 20:
                    maileiNum = 0;
                    break;
                case 30:
                    maileiNum = 1;
                    break;
                case 40:
                    maileiNum = 2;
                    break;
                case 50:
                    maileiNum = 3;
                    break;
            }
            this.HBNum = rule.mailei / 10000;
            this.totalNum.string = this.beiNum * this.HBNum;
            for (var i = 0; i < this.jineList.length; ++i) {
                var item = this.jineList[i].getComponent(cc.Button);
                if (item && i < maileiNum) {
                    item.interactable = false;
                }
            }
            this.showMaiLeiBtn(true);
            this.showJichu(true);
            this.showjichuBtn(false);
        } else {
            this.showMaiLeiBtn(false);
            this.showJichu(false);
            this.showjichuBtn(true);
            this.HBNum = 1;
            this.totalNum.string = this.HBNum;
            this.xuanzhognBg[0].active = true;
            if(this.textstr)
                this.textstr.string = '请选择埋雷金额';
        }
        this.showBtn(true);
    },

    showjichuBtn: function (bl) {
        if (this.jichuNode)
            this.jichuNode.active = bl;
        if (this.beishuNode)
            this.beishuNode.active = !bl;
    },

    showMaiLeiBtn: function (bl) {
        if (!this.maileiBtn)
            return;
        this.maileiBtn[0].active = false;
        this.maileiBtn[1].active = !bl;
        this.maileiBtn[2].active = !bl;
    },

    showJichu: function (bl) {
        if (this.jibiBtn) {
            this.jibiBtn.forEach(function (item) {
                item.active = bl;
            }.bind(this));
        }

        if (this.pyBtn) {
            this.pyBtn.forEach(function (item) {
                item.active = !bl;
            }.bind(this));
        }
    },

    initFriend: function () {
        var nexttime = 10;
        var tiemfun = function () {
            nexttime--;
            if (nexttime >= 0)
                this.tiemNode.getComponent(cc.Label).string = nexttime + '秒';
            else {
                this.checkMailei();
                this.tiemNode.active = false;;
                this.unschedule(tiemfun);
            }
        }.bind(this)
        this.unschedule(tiemfun);
        this.tiemNode.active = true;
        this.tiemNode.getComponent(cc.Label).string = nexttime + '秒';
        this.schedule(tiemfun, 1);
    },

    onDestroy: function () {
        HBSL_ED.removeObserver(this);
    },

    showBtn: function (bl) {
        if (this.shengqiBtn)
            this.shengqiBtn.active = bl;
        if (this.quxiaoBtn)
            this.quxiaoBtn.active = !bl;
    },

    /**
     * 倍数按钮点击事件
     */
    onClikcBei: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var num = parseFloat(data);
        this.xuanzhognBg[0].active = true;
        this.xuanzhognBg[0].x = event.target.x;
        if (num == this.beiNum) {
            this.xuanzhognBg[0].active = false;
            this.beiNum = 1;
        } else {
            this.beiNum = num;
        }
        this.totalNum.string = this.beiNum * this.HBNum;
        this.showBtn(true);
    },

    /**
     * 金币场基础按钮点击事件
     */
    onClikcjichuCoin: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var num = parseFloat(data);
        this.xuanzhognBg[1].active = false;
        this.xuanzhognBg[0].active = true;
        this.xuanzhognBg[0].x = event.target.x;
        if (num == this.HBNum) {
            this.xuanzhognBg[0].active = false;
            this.HBNum = 1;
        } else {
            this.HBNum = num;
        }
        this.totalNum.string = this.beiNum * this.HBNum;
        this.showBtn(true);
    },

    onClickCoin: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var num = parseInt(data);
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_GOLD)
            this.xuanzhognBg[0].active = false;
        this.xuanzhognBg[1].active = true;
        this.xuanzhognBg[1].x = event.target.x;
        if (num == this.HBNum) {
            this.xuanzhognBg[1].active = false;
            if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
                var rule = RoomMgr.Instance()._Rule;
                this.HBNum = rule.mailei / 10000;
            } else {
                this.HBNum = 1;
            }
        } else {
            this.HBNum = num;
        }
        this.totalNum.string = this.beiNum * this.HBNum;
        this.showBtn(true);
    },

    onClickWeiHao: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var num = parseInt(data);
        var bl = num >= 5;
        this.xuanzhognBg[2].active = !bl;
        this.xuanzhognBg[3].active = bl;
        if (num < 5) {
            this.xuanzhognBg[2].x = event.target.x;
        } else {
            this.xuanzhognBg[3].x = event.target.x;
        }
        this.weiNum = num;
        this.tailNum.string = this.weiNum;
        this.showBtn(true);
    },

    /**
     * 埋雷玩家列表
     */
    setData: function (list) {
        if (!list) return;
        this.ItmeID = null;
        var index = 0;
        for (var i = this.viewNode.childrenCount - 1; i > -1; i--) {
            var node = this.viewNode.children[i];
            if (node) {
                node.removeFromParent();
                node.destroy();
            }
        }
        this.viewNode.height = list.length * 90;
        list.forEach(function (player) {
            var item = cc.instantiate(this.mlPrefab);
            this.viewNode.addChild(item);
            var playerItme = item.getComponent('hbsl_MineItem');
            if (!playerItme) return;
            index++;
            playerItme.setMineItmeData(index, player);
            if (RoomMgr.Instance().gameId == Define.GameType.HBSL_GOLD) {
                if (!this.ItmeID && player.role.userid == cc.dd.user.id) {
                    this.ItmeID = player.id;
                }
            }
        }.bind(this));
        var bl = this.ItmeID != null ? false : true;
        this.showBtn(bl);
        this.shengqiBtn.getComponent(cc.Button).interactable = true;
    },

    /**
     * 申请埋雷
     */
    onClickseenMiaLei: function () {
        hall_audio_mgr.com_btn_click();
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            hbsl_send.sendMine(this.HBNum * 10000, this.beiNum * 10, this.weiNum);
        } else
            hbsl_send.sendMine(this.HBNum * 10000 * this.beiNum, 1, this.weiNum);
        this.shengqiBtn.getComponent(cc.Button).interactable = false;
    },

    onColse: function () {
        hall_audio_mgr.com_btn_click();
        var isend = hbsl_Data.Instance().isEnd;
        if (!isend) {
            var bl = this.checkMailei();
            if (bl) return;
        }
        this.node.removeFromParent();
        this.node.destroy();
    },

    /**
    * 回调事件
    */
    onEventMessage: function (event, data) {
        switch (event) {
            case HBSL_Event.PLAYER_MAIHB: //埋红包
                this.node.removeFromParent();
                this.node.destroy();
                break;
            case HBSL_Event.CLICK_ITME: //点击面板
                this.ItmeID = data;
                this.showBtn(false);
                cc.log('点击ID:', this.ItmeID)
                break;
            case HBSL_Event.CANCLEMAILEI: //取消埋雷
                this.cancleMailei(data);
                break;
        }
    },

    /**
     * 取消埋雷
     */
    cancleMailei: function (data) {
        switch (data.code) {
            case 0:
                cc.dd.PromptBoxUtil.show('取消埋雷成功!');
                hbsl_send.sendMineInfo();
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('红包正在开启中!');
                break;
            case 2:
                cc.dd.PromptBoxUtil.show('红包已抢光!');
                break;
        }
    },

    /**
     * 玩家放弃埋雷
     */
    checkMailei: function () {
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            var Rule = RoomMgr.Instance()._Rule;
            if (!Rule) return;
            if (Rule.zhuangType == 1) {
                hbsl_send.sendMine(-1, 1, this.weiNum);
                return true;
            }
        }
    },

    /**
     * 取消埋雷
     */
    cancelMailei: function () {
        if (!this.ItmeID) {
            cc.dd.PromptBoxUtil.show('请先选择取消埋雷序号!');
        } else {
            hbsl_send.sendquxiao(this.ItmeID);
            this.ItmeID = null;
        }
    },

});