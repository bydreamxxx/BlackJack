var HBSL_Data = require("hbslData").HBSL_Data;
cc.Class({
    extends: cc.Component,

    properties: {
        headUrl: { type: cc.Sprite, default: null, tooltip: "头像" },
        headname: { type: cc.Label, default: null, tooltip: "名字" },
        coin: { type: cc.Label, default: null, tooltip: "金币" },
        fenNode: { type: cc.Node, default: null, tooltip: "分数父节点" },
        fuhao: { type: cc.Sprite, default: null, tooltip: "输赢符号" },
        win: { type: cc.SpriteFrame, default: null, tooltip: "赢" },
        Lose: { type: cc.SpriteFrame, default: null, tooltip: "输" },
        fenNum: { type: cc.Label, default: null, tooltip: "抢红包数量" },
        lei: { type: cc.Node, default: null, tooltip: "雷" },
        highlighted: { type: cc.Node, default: null, tooltip: "按钮高亮" },
        win_font: { type: cc.Font, default: null, tooltip: '胜利字' },
        lose_font: { type: cc.Font, default: null, tooltip: '失败字' },
        prepare: { type: cc.Node, default: null, tooltip: "准备" }

    },

    onLoad: function () {
        this.userid = null;
    },

    onDestroy: function () {
    },

    initUI: function () {
        this.userid = null;
        if (this.headname)
            this.headname.string = '';
        if (this.coin)
            this.coin.string = 0;
        if (this.headUrl)
            this.headUrl.spriteFrame = null;
        this.showFenNode(false);
        this.resetUI();
    },

    resetUI: function () {
        if (this.fenNode)
            this.fenNode.active = false;
        if (this.lei)
            this.lei.active = false;
        if (this.highlighted)
            this.highlighted.active = false;

    },

    showFenNode: function (bl) {
        if (this.fenNode)
            this.fenNode.active = bl;
    },


    setHbResults: function (num, bl) {
        this.showFenNode(true);
        if (this.fuhao) {
            this.fuhao.spriteFrame = num > 0 ? this.win : this.Lose;
        }
        if (this.lei && this.highlighted) {
            this.lei.active = num < 0;
            this.highlighted.active = num < 0;
        }

        if (this.fenNum) {
            this.fenNum.font = num > 0 ? this.win_font : this.lose_font;
            var fennum = Math.abs(num);
            var lblstr = (fennum * 0.0001).toFixed(2);
            var newlblstr = lblstr.replace('.', '/');
            this.fenNum.string = newlblstr;

        }

        var role = HBSL_Data.Instance().getPlayerData(this.userid);
        if (role) {
            var coinnum = role.money * 0.0001;
            if (this.coin) {
                if (bl) {
                    var lblstr = '';
                    if (coinnum > 10000) {
                        lblstr = cc.dd.Utils.getNumToWordTransform(coinnum);
                    } else {
                        lblstr = coinnum.toFixed(2);
                    }
                    this.coin.string = lblstr;
                }
                this.coin.node.active = true;
            }
        }
    },

    setPlayer: function (data, bl) {
        if (!data) {
            this.initUI();
            return;
        }

        this.userid = data.userid;

        if (data.headUrl.indexOf('.jpg') != -1) {
            let robotUrl = require('Platform').GetRobotUrl();
            cc.dd.SysTools.loadWxheadH5(this.headUrl, data.headUrl);
        }
        else {
            //data.headUrl = 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIVzCqyENHrIf8wB3AiaXHAFsUOuLT4b1fJd9No6YGnwFQm5iccIxR8iaWicEU5POCjWYc25b8IicfzheQ/132';
            if (data.headUrl) {
                cc.dd.SysTools.loadWxheadH5(this.headUrl, data.headUrl);
            }
        }
        if (this.headname)
            this.headname.string = cc.dd.Utils.substr(data.name, 0, 4);
        if (this.coin) {
            var lblstr = '';
            if (bl) {
                var coinnum = data.money * 0.0001;
                if (coinnum > 10000) {
                    lblstr = cc.dd.Utils.getNumToWordTransform(coinnum);
                } else {
                    lblstr = coinnum.toFixed(2);
                }
                this.coin.node.active = true;
            }
            else {
                this.coin.node.active = false;
                if (data.openMoney > 0) {
                    var coinnum = data.openMoney * 0.0001;
                    lblstr = coinnum.toFixed(2);
                }
            }
            this.coin.string = lblstr;
        }
    },

    /**
     * 刷新金币
     */
    refrshCoin: function (num) {
        if (this.coin) {
            var coinnum = num * 0.0001;
            var lblstr = ''
            if (coinnum > 10000) {
                lblstr = cc.dd.Utils.getNumToWordTransform(coinnum);
            } else {
                lblstr = coinnum.toFixed(2);
            }
            this.coin.string = lblstr;
        }
    },

    /**
     * 玩家准备状态
     */
    setReady: function (bl) {
        if (this.prepare)
            this.prepare.active = bl;
    },

});