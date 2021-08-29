//create by ww 2021/06/21

const HallCommonData = require('hall_common_data').HallCommonData.getInstance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
var Platform = require('Platform');
var AppCfg = require('AppConfig');
var activity_spread_awards = require('activity_spread_awards');
var game_room = require('game_room');
var klb_gameList = require('klb_gameList');


cc.Class({
    extends: cc.Component,

    properties: {
        jrjl: {
            default: null, type: cc.Label, tooltip: "今日奖励"
        },
        flj: {
            default: null, type: cc.Label, tooltip: "vip福利金"
        },
        tgyh: {
            default: null, type: cc.Label, tooltip: "推广用户"
        },
        spreadCount: {
            default: null, type: cc.Node, tooltip: "推广人数"
        },
        rebateSum: {
            default: null, type: cc.Node, tooltip: "奖励总数"
        },
        edibox: {
            default: null, type: cc.EditBox, tooltip: "用户查询"
        },
        qrNode: {
            default: null, type: cc.Node, tooltip: "二维码"
        },

    },
    onLoad: function () {
        this.init(Hall.HallData.Instance().activitySpread);

        Hall.HallED.addObserver(this);
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);

    },

    /**
     * 初始化界面信息
     */
    init: function (data) {




        var self = this;
        if (data) {
            this.flj.getComponent(cc.Label).string = data.count + '个可领取'
        }


        this.totalReward()
        this.userQuery()
        this.serviceCharge()





    },
    //首页 奖励说明
    serviceCharge() {
        let self = this
        let gamelist = klb_gameList.getItemList((item) => {
            return (item.isopen == 1 && item.isfriend == 0);
        });
        let callBack = (jsonData) => {
            let scp = cc.find('zjm-di2/scroll', self.node).getComponent('com_glistView');
            scp.setDataProvider(gamelist, 0, function (itemNode, index) {
                if (index < 0 || index >= gamelist.length)
                    return;
                let element = gamelist[index];
                itemNode.getChildByName('gameName').getComponent(cc.Label).string = element.name;

                if (element.gameid == 102 || element.gameid == 101 || element.gameid == 138 || element.gameid == 139 || element.gameid == 110) {
                    itemNode.getChildByName('outlay').getComponent(cc.Label).string = `消耗x${jsonData / 100}%`;
                } else {
                    itemNode.getChildByName('outlay').getComponent(cc.Label).string = `服务费x${jsonData}%`;
                }
            });
            cc.dd.NetWaitUtil.net_wait_end('msg_slot_spread_2s');
        }
        let relistUrl = Platform.activeSpread[AppCfg.PID] + 'rate?user_id=' + cc.dd.user.id;
        this.ajax(relistUrl, 'msg_slot_userQuery_2s', callBack)
    },
    /**
     * 领取按钮
     */
    onClickGetAward: function (event, type) {
        hall_audio_mgr.com_btn_click();
        let data = Hall.HallData.Instance().activitySpread.userInfoList
        let obj = data.find(item => item.type == type)
        if (!obj || obj.count < 1) {
            cc.dd.PromptBoxUtil.show('没有达到领取条件');
            return
        }
        const req = new cc.pb.slot.msg_activity_spread_swap_req();
        req.setType(type);
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_activity_spread_swap_req, req,
            'activity_spread_swap_req', 'no');
    },

    //设置奖励领取数据
    propItem: function () {
        activity_spread_awards.items.forEach((item, idx) => {
            let nodeItem = cc.find('VIP/tk-bg/scroll/view/content/' + item.key, this.node)
            cc.find('gold', nodeItem).getComponent(cc.Label).string = this.changeNumToCHN(item.gold)
            cc.find('level', nodeItem).getComponent(cc.Label).string = `VIP等级达到${item.key}级`
        });
        let userInfoList = Hall.HallData.Instance().activitySpread.userInfoList
        let count = 0
        userInfoList.forEach(item => {
            let nodeItem = cc.find('VIP/tk-bg/scroll/view/content/' + item.type, this.node)
            cc.find('available', nodeItem).getComponent(cc.Label).string = `可领取${item.count}次`
            count += item.count
        })
        this.flj.getComponent(cc.Label).string = count + '个可领取'
    },

    //显示领取奖励的界面
    showAward: function (data) {
        // this.rewardShowing = true;
        // this.scheduleOnce(function () {
        //     cc.dd.UIMgr.openUI("gameyj_hall/prefabs/klb_hall_daily_lottery_get_award", function (prefab) {
        //         var cp = prefab.getComponent('klb_hall_daily_lottery_get_award');
        //         cp.setData(data.itemDataId, data.num);
        //         this.rewardShowing = false;
        //     }.bind(this));
        // }.bind(this), 0.5);
    },

    update: function (dt) {
        // if (!this.rewardShowing && this.selectDayData && this.index < this.selectDayData.itemsList.length &&
        //     !cc.dd.UIMgr.getUI('gameyj_hall/prefabs/klb_hall_daily_lottery_get_award')) {
        //     var data = this.selectDayData.itemsList[this.index];
        //     this.index++;
        //     this.showAward(data);
        //     if (this.index == this.selectDayData.itemsList.length)
        //         this.selectDayData = null;
        // }
    },

    //关闭
    close: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //打开弹窗
    showPopup: function (event, nodeName) {
        cc.find(nodeName, this.node).active = true;
        switch (nodeName) {
            case 'Rebate':
                this.initGameRebate()
                break
            case 'spread':
                this.initSpread()
                break
            case 'VIP':
                this.propItem()
                break
        }
    },
    //关闭弹窗
    closePopup: function (event, nodeName) {
        if (nodeName == 'Rebate') {
            cc.find('Rebate/tk-bg/leftToggleContainer/toggle1', this.node).getComponent(cc.Toggle).isChecked = true
            cc.find('Rebate/tk-bg/leftToggleContainer/toggle2', this.node).getComponent(cc.Toggle).isChecked = false
        }

        cc.find(nodeName, this.node).active = false;
    },
    totalReward: function () {
        let relistUrl = Platform.activeSpread[AppCfg.PID] + 'relist?user_id=' + + cc.dd.user.id + '&type=1';
        let chargerebateUrl = Platform.activeSpread[AppCfg.PID] + 'chargerebate?user_id=' + + cc.dd.user.id + '&type=1';
        let sum = 0
        let self = this
        let callBack1 = function (jsonData) {
            self.jrjl.getComponent(cc.Label).string = self.changeNumToCHNT(jsonData.total + sum)
        }
        let callBack2 = function (jsonData) {
            sum = jsonData.total
            self.ajax(chargerebateUrl, 'msg_slot_spread_2s', callBack1)
        }
        this.ajax(relistUrl, 'msg_slot_spread_2s', callBack2)

    },

    switchDate: function (event, type) {
        if (this.isGameRebate) {
            // cc.find('Rebate/tk-bg/youxifanli/scroll/view/content', this.node).removeAllChildren(true)
            // let plist = value === 'today' ? this.gameData.today_reList : this.gameData.yestoday_reList
            // this.rebateSum.getComponent(cc.Label).string = value === 'today' ? this.gameData.today_total : this.gameData.yestoday_total
            // let scp = cc.find('Rebate/tk-bg/youxifanli/scroll', this.node).getComponent('com_glistView');
            // scp.setDataProvider(plist, 0, function (itemNode, index) {
            //     if (index < 0 || index >= plist.length)
            //         return;
            //     let element = plist[index];
            //     itemNode.getChildByName('name').getComponent(cc.Label).string = element.name;
            //     itemNode.getChildByName('reward').getComponent(cc.Label).string = element.obtain;
            // });
            this.GameRebateAReq(type)
        } else {
            // cc.find('Rebate/tk-bg/chongzhifanli/scroll/view/content', this.node).removeAllChildren(true)
            // let _plist = value === 'today' ? this.rechargeData.today : this.rechargeData.yestoday
            // this.rebateSum.getComponent(cc.Label).string = value === 'today' ? this.rechargeData.today_total : this.rechargeData.yestoday_total
            // let scp = cc.find('Rebate/tk-bg/chongzhifanli/scroll', this.node).getComponent('com_glistView');
            // scp.setDataProvider(_plist, 0, function (itemNode, index) {
            //     if (index < 0 || index >= _plist.length)
            //         return;
            //     let _element = _plist[index];
            //     itemNode.getChildByName('nickName').getComponent(cc.Label).string = _element.nickname
            //     itemNode.getChildByName('recharge').getComponent(cc.Label).string = _element.money
            //     itemNode.getChildByName('reward').getComponent(cc.Label).string = _element.gold
            // });
            this.RechargeRebateReq(type)
        }



    },
    //游戏返利列表
    initGameRebate: function () {
        this.isGameRebate = true
        cc.find('Rebate/tk-bg/ToggleContainer/toggle1', this.node).getComponent(cc.Toggle).isChecked = false
        cc.find('Rebate/tk-bg/ToggleContainer/toggle2', this.node).getComponent(cc.Toggle).isChecked = true
        cc.find('Rebate/tk-bg/youxifanli', this.node).active = true
        cc.find('Rebate/tk-bg/chongzhifanli', this.node).active = false
        this.GameRebateAReq(1)
    },


    GameRebateAReq(type) {
        cc.find('Rebate/tk-bg/youxifanli/scroll/view/content', this.node).removeAllChildren(true)
        cc.find('Rebate/tk-bg/tips', this.node).getComponent(cc.Label).string = '游戏奖励将在次日0点发放至您的邮箱'
        let self = this
        let callBack = (jsonData) => {
            // self.gameData = jsonData
            let plist = jsonData.reList.filter(item => item.obtain != 0)
            self.rebateSum.getComponent(cc.Label).string = `${type == 1 ? '今日' : '昨日'}累计获得:${self.changeNumToCHNT(jsonData.total)}`
            let scp = cc.find('Rebate/tk-bg/youxifanli/scroll', self.node).getComponent('com_glistView');
            scp.setDataProvider(plist, 0, function (itemNode, index) {
                if (index < 0 || index >= plist.length)
                    return;
                let element = plist[index];
                itemNode.getChildByName('name').getComponent(cc.Label).string = element.name;
                itemNode.getChildByName('reward').getComponent(cc.Label).string = element.obtain;
            });
            cc.dd.NetWaitUtil.net_wait_end('msg_slot_spread_2s');
        }
        let relistUrl = Platform.activeSpread[AppCfg.PID] + 'relist?user_id=' + cc.dd.user.id + '&type=' + type;
        this.ajax(relistUrl, 'msg_slot_userQuery_2s', callBack)


    },


    //充值返利列表
    initRechargeRebate: function () {
        this.isGameRebate = false
        cc.find('Rebate/tk-bg/ToggleContainer/toggle1', this.node).getComponent(cc.Toggle).isChecked = false
        cc.find('Rebate/tk-bg/ToggleContainer/toggle2', this.node).getComponent(cc.Toggle).isChecked = true
        cc.find('Rebate/tk-bg/youxifanli', this.node).active = false
        cc.find('Rebate/tk-bg/chongzhifanli', this.node).active = true
        this.RechargeRebateReq(1)
    },

    RechargeRebateReq(type) {
        cc.find('Rebate/tk-bg/chongzhifanli/scroll/view/content', this.node).removeAllChildren(true)
        cc.find('Rebate/tk-bg/tips', this.node).getComponent(cc.Label).string = '充值奖励将实时发放至您的邮箱'

        let self = this
        let callBack = function (jsonData) {
            // self.rechargeData = jsonData
            let plist = jsonData.list
            self.rebateSum.getComponent(cc.Label).string = `${type == 1 ? '今日' : '昨日'}累计获得:${self.changeNumToCHNT(jsonData.total)}`
            let scp = cc.find('Rebate/tk-bg/chongzhifanli/scroll', self.node).getComponent('com_glistView');
            scp.setDataProvider(plist, 0, function (itemNode, index) {
                if (index < 0 || index >= plist.length)
                    return;
                let element = plist[index];
                itemNode.getChildByName('nickName').getComponent(cc.Label).string = element.nickname
                itemNode.getChildByName('recharge').getComponent(cc.Label).string = element.money
                itemNode.getChildByName('reward').getComponent(cc.Label).string = element.gold

            });
            cc.dd.NetWaitUtil.net_wait_end('msg_slot_spread_2s');
        }

        let chargerebateUrl = Platform.activeSpread[AppCfg.PID] + 'chargerebate?user_id=' + cc.dd.user.id + '&type=' + type;
        this.ajax(chargerebateUrl, 'msg_slot_userQuery_2s', callBack)


    },
    //推广用户总数
    userQuery: function () {
        let self = this
        let url = Platform.activeSpread[AppCfg.PID] + 'shareinfo?user_id=' + cc.dd.user.id + '&player_id=' + this.edibox.string;
        let callBack = function (jsonData) {
            self.tgyh.getComponent(cc.Label).string = jsonData.count
            cc.dd.NetWaitUtil.net_wait_end('msg_slot_userQuery_2s');
        }
        this.ajax(url, 'msg_slot_userQuery_2s', callBack)
    },
    //推广用户列表
    initSpread() {
        cc.dd.NetWaitUtil.net_wait_start('', 'msg_slot_userQuery_2s');
        let self = this
        let url = Platform.activeSpread[AppCfg.PID] + 'shareinfo?user_id=' + cc.dd.user.id + '&player_id=' + this.edibox.string;
        cc.find('spread/tk-bg/tk-dikuang/scroll/view/content', self.node).removeAllChildren(true)
        let callBack = function (jsonData) {
            let plist = jsonData.list
            let scp = cc.find('spread/tk-bg/tk-dikuang/scroll', self.node).getComponent('com_glistView');
            self.spreadCount.getComponent(cc.Label).string = jsonData.count
            scp.setDataProvider(plist, 0, function (itemNode, index) {
                if (index < 0 || index >= plist.length)
                    return;
                let element = plist[index];
                itemNode.getChildByName('nickName').getComponent(cc.Label).string = cc.dd.Utils.substr(element.nickname, 0, 6);
                itemNode.getChildByName('ID').getComponent(cc.Label).string = element.user_id
                itemNode.getChildByName('time').getComponent(cc.Label).string = self.convertTimeDay(element.createTime)
                itemNode.getChildByName('sum').getComponent(cc.Label).string = element.gold
                if (element.isOnline == 1 || element.isOnline == 0) {
                    itemNode.getChildByName('online').getComponent(cc.Label).string = element.isOnline ? '大厅' : '离线'
                } else {
                    var roomcfg = game_room.getItem(function (item) {
                        return item.key == element.isOnline;
                    }.bind(this));
                    itemNode.getChildByName('online').getComponent(cc.Label).string = roomcfg.game_name + roomcfg.titel
                }
            });
            cc.dd.NetWaitUtil.net_wait_end('msg_slot_userQuery_2s');
        }
        this.ajax(url, 'msg_slot_userQuery_2s', callBack)
    },
    ajax(url, loadName, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var jsonData = JSON.parse(xhr.responseText);
                    callback(jsonData)
                }
                return;
            }
        }.bind(this);
        xhr.ontimeout = function () {
            cc.dd.NetWaitUtil.net_wait_end(loadName);
            cc.log('http timeout:get authcode');
        }.bind(this);
        xhr.onerror = function () {
            cc.dd.NetWaitUtil.net_wait_end(loadName);
            cc.log('http error:get authcode');
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhr.timeout = 6000;
        xhr.send();

    },
    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.SHOW_ACTIVE_SPREAD:
                // this.initUI();
                this.propItem();
                break;
            default:
                break;
        }
    },
    //打开二维码分享
    showShare(event, vle) {
        cc.find('share', this.node).active = vle == 1 ? true : false
        let url = Platform.activeSpread[AppCfg.PID] + 'spread?unionid=' + HallCommonData.unionId + '&user_id=' + cc.dd.user.id
        if (vle == 1) {
            cc.dd.SysTools.genQRCode(url, this.qrNode)
        }
    },
    //保存二维码
    captureScreenToPhotoAlbum() {
        let node = cc.find('share/tkewm', this.node)

        let sharrNode = cc.find('share', this.node)
        var fileName = "qrcode.png";
        cc.dd.SysTools.captureCustomNode(fileName, node, function () {
            cc.dd.native_systool.captureScreenToPhotoAlbum(jsb.fileUtils.getWritablePath() + '/' + fileName);
            cc.dd.PromptBoxUtil.show('图片保存于系统相册中!');
            sharrNode.active = false
        });
        // cc.dd.SysTools.captureCustomNode('qrcode.png', node, '');

    },
    //链接分享
    onClickShare() {
        cc.dd.native_wx.SendAppContent('', '推荐给你一款不仅好玩，公平无外挂，而且还免费送金币的游戏', '万人在线，千人同场，公平博弈，来巷乐，不寂寞！>>>', Platform.activeSpread[AppCfg.PID] + 'spread?unionid=' + HallCommonData.unionId + '&user_id=' + cc.dd.user.id, 1);
    },
    /**
     * 转换时间
     */
    convertTimeDay: function (t) {
        var date = new Date(t * 1000);
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }

        var currentdate = date.getFullYear() + '年' + month + '月' + strDate + '日';
        return currentdate;
    },
    /**
* 筹码数字转换
*/
    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 100000000) {
            str = (num / 100000000) + '亿';
        } else if (num >= 10000000) {
            str = (num / 10000000) + '千万';
        } else if (num >= 100000) {
            str = (num / 10000) + '万';
        } else {
            str = num;
        }
        return str;
    },
    /**
    * 筹码数字转换
    */
    changeNumToCHNT: function (num) {
        var str = '';
        if (num >= 100000000) {
            str = (num / 100000000.00).toFixed(1) + '亿';
        } else if (num >= 10000000) {
            str = (num / 10000000.00).toFixed(1) + '千万';
        } else if (num >= 100000) {
            str = (num / 10000.00).toFixed(1) + '万';
        } else {
            str = num;
        }
        return str;
    },
});
