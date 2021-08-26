
const strCfg = require('bsc_strConfig');
const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_sendMsg = require('bsc_sendMsg');
const daojuStr = require('HallPropCfg');

cc.Class({
    extends: cc.Component,

    properties: {
        mingciSp: cc.Sprite,//名次
        mingciTTF: cc.Label,//3名以后就用文字显示

        userName: cc.Label,
        bscName: cc.Label, //比赛的名字
        jiangpTTF: cc.Label,//奖品列表添加节点
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 设置数据
     */
    setData: function (data) {
        this.userName.string = data.name || 'xxxxx';
        data.bscName = data.chaName || 'xxxx大奖赛';
        this.bscName.string = strCfg.bscNameStr.format([data.bscName]);
        if (data.rank) {
            this.mingciTTF.node.active = data.rank > 3;
            this.mingciSp.node.active = !(data.rank > 3);
            if (data.rank > 3) {
                this.mingciTTF.string = data.rank;
            } else {
                var path = 'gameyj_mj/bsc/textures/bsc_zhuonei/bsc_huangguan_' + data.rank + '.png';
                var sp = new cc.SpriteFrame(path);
                if (sp) {
                    this.mingciSp.spriteFrame = sp;
                }
            }

        }

        //奖励
        this.jiangpTTF.string = this.compJiangli([{ type: data.moneyType, num: data.moneyNum }]);


    },



    /**
     * 返回回调
     */
    closeBtnCallBack: function () {
        Bsc_ED.notifyEvent(Bsc_Event.BSC_GO_HALL);
    },

    /**
     * 在来一次
     */
    tryAginBtnCallBack: function () {
        Bsc_ED.notifyEvent(Bsc_Event.BSC_GO_HALL, function () {
            //执行大厅中的 比赛场按钮回调
            cc.find('Canvas').getComponent('jlmj_hallScene').bscBtnCallBack();
        });
    },

    /**
     * 分享到微信好友
     */
    WXBtnCallBack: function () {
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            cc.dd.native_wx.SendScreenShot(canvasNode);
        }
    },

    /**
     * 分享到朋友圈
     */
    PYQBtnCallBack: function () {
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
        }
    },


    /**
     * 处理奖励列表
     */
    compJiangli: function (data) {
        if (data) {
            var str = '';
            var item = data;
            for (var k = 0; k < item.length; ++k) {
                str += item[k].num + daojuStr.getNameById(item[k].type);
                str += ' ';
            }
            return str;
        }
        return '';
    },
});
