// const shopCfg = require('shop')
// const iteCfg = require('item')
// const FishType = require('DoyenFishType');
// var shop_data = require('hall_shop').shopData.Instance();
var gFishMgr = require('FishDoyenManager').FishManager.Instance();


// const master_shop = require('qka_fish_master_shop')
// const master_gift = require('qka_fish_master_gift')
// const master_vip = require('qka_fish_master_vip')
const doyen_sender = require('gameyj_fish_doyen_sender')
const HallCommonData = require('hall_common_data').HallCommonData;
var hall_prefab = require('hall_prefab_cfg');
const Hall = require('jlmj_halldata');
cc.Class({
    extends: cc.Component,

    properties: {
        goldCoin: { default: null, type: cc.Node, tips: "礼券兑换金币" },
        redBag: { default: null, type: cc.Node, tips: "礼券兑换红包" },
        JD_Card: { default: null, type: cc.Node, tips: "礼券兑换京东卡" },
        giftId: 1,
        icon: { default: [], type: cc.SpriteFrame, tooltip: "兑换记录图标" },
        iconDisable: { default: [], type: cc.SpriteFrame, tooltip: "是否可兑换图标" },
    },

    onLoad: function () {

        Hall.HallED.addObserver(this);
        this.initRule()
    },


    //抽礼券
    changeGift(eve, key) {
        this.giftId = parseInt(key)
        let CommonData = HallCommonData.getInstance()
        let RoomType = gFishMgr.getRoomType()
        if (gFishMgr.getAuto() != 0 && this.giftId == gFishMgr.getAuto()) {
            cc.find('liquan/bydr_store_bg/aotuToggle', this.node).getComponent(cc.Toggle).isChecked = true
        } else {
            cc.find('liquan/bydr_store_bg/aotuToggle', this.node).getComponent(cc.Toggle).isChecked = false
        }

        let checked = master_gift.getItem(function (item) {
            return item.roomid == RoomType && item.level == key;
        });

        let giftlist = checked.gift.split(';')
        giftlist.forEach((element, idx) => {
            cc.find('liquan/bydr_store_bg/container/bydr_icon_' + idx + '/label', this.node).getComponent(cc.Label).string = element.substring(0, element.lastIndexOf(','))
        });

        if (CommonData.fishGiftBetNum >= checked.need_bet) {
            cc.find('liquan/bydr_store_bg/bydr_btn_submit', this.node).active = true
            cc.find('liquan/bydr_store_bg/bydr_btn_bule', this.node).active = false
        } else {
            cc.find('liquan/bydr_store_bg/bydr_btn_submit', this.node).active = false
            cc.find('liquan/bydr_store_bg/bydr_btn_bule/label', this.node).getComponent(cc.Label).string = '还需' + (checked.need_bet - CommonData.fishGiftBetNum) + '发'
            cc.find('liquan/bydr_store_bg/bydr_btn_bule', this.node).active = true
        }

    },
    showView(node) {
        node.active = true
        let CommonData = HallCommonData.getInstance()
        switch (node.name) {
            case 'duihuan':
                this.showMasterShop('', '1')
                let data = master_vip.getItem(function (item) {
                    return item.key == CommonData.vipLevel;
                });
                cc.find('duihuan/bydr_bg_3/curUseCnt/usable', this.node).getComponent(cc.Label).string = '今日剩余兑换次数：' + (data.num - CommonData.curUseFishGiftCnt)
                break
            case 'liquan':
                let GiftLevel = 3
                let RoomType = gFishMgr.getRoomType()
                let datalist = master_gift.getItemList(function (item) {
                    return item.roomid == RoomType;
                });
                for (let i = datalist.length; i > 0; i--) {
                    if (CommonData.fishGiftBetNum >= datalist[i - 1].bet) {
                        GiftLevel = datalist[i - 1].level
                        cc.find('liquan/bydr_store_bg/ToggleContainer/toggle' + datalist[i - 1].level, this.node).getComponent(cc.Toggle).isChecked = true
                        break
                    }
                }
                this.changeGift('', GiftLevel)
                break
        }

    },
    changeAuto(event) {
        if (event.isChecked) {
            let CommonData = HallCommonData.getInstance()
            let id = this.giftId
            gFishMgr.setAuto(this.giftId)
            let RoomType = gFishMgr.getRoomType()
            let fishGift = master_gift.getItem(function (item) {
                if (item.roomid == RoomType && item.level == id)
                    return item
            });
            if (CommonData.fishGiftBetNum >= fishGift.bet) {
                doyen_sender.fishGift({ id: id, roomid: RoomType })
                this.onClose()
            }
            // HallCommonData.getInstance().isAuto = this.giftId
        } else {
            gFishMgr.setAuto(0)
            // HallCommonData.getInstance().isAuto = 0
        }
        Hall.HallED.notifyEvent(Hall.HallEvent.FISH_GIFT, { type: 0 });
    },

    //切换红包金币礼券兑换
    showMasterShop(eve, idx) {
        var datalist = master_shop.getItemList(function (item) {
            return item.type == idx;
        });
        let panel = null
        switch (idx) {
            case '1':
                panel = this.goldCoin
                this.goldCoin.active = true
                this.redBag.active = false
                this.JD_Card.active = false
                break
            case '2':
                panel = this.redBag
                this.goldCoin.active = false
                this.redBag.active = true
                this.JD_Card.active = false
                break
            case '3':
                panel = this.JD_Card
                this.goldCoin.active = false
                this.redBag.active = false
                this.JD_Card.active = true
                break
        }

        let CommonData = HallCommonData.getInstance()

        cc.find('duihuan/bydr_bg_3/total/num', this.node).getComponent(cc.Label).string = this.changeNumToCHN(CommonData.fishGiftNum)

        let content = cc.find('scrollView/view/content', panel)
        let childNode = cc.find('item', panel)
        content.removeAllChildren()
        for (let i = 0; i < datalist.length; i++) {
            var element = datalist[i];
            let itemNode = cc.instantiate(childNode)
            itemNode.getChildByName('amount').getComponent(cc.Label).string = element.dec;
            itemNode.getChildByName('num').getComponent(cc.Label).string = this.changeNumToCHN(element.cost);
            let pricIdx = CommonData.fishGiftNum >= element.cost ? 0 : 1
            itemNode.getChildByName('duihuan_bt').getComponent(cc.Sprite).spriteFrame = this.iconDisable[pricIdx];
            itemNode.tag = element.key
            itemNode.shopType = element.type
            if (element.type != 1) {
                if (element.vip_level > 0) {
                    itemNode.getChildByName('xinshou').active = false
                    cc.find('vip/label', itemNode).getComponent(cc.Label).string = 'VIP' + element.vip_level;
                    itemNode.getChildByName('vip').active = true
                } else {
                    itemNode.getChildByName('xinshou').active = true
                    itemNode.getChildByName('vip').active = false
                }
                if (element.type == 2)
                    itemNode.getChildByName('count').getComponent(cc.Label).string = element.item_count / 100;
                // } else {
                //     itemNode.getChildByName('count').getComponent(cc.Label).string = element.item_count;
                // }
            }
            itemNode.active = true
            itemNode.parent = content
        }

    },
    onClickGiftItem(event) {
        let shop = master_shop.getItem(function (item) {
            return item.key == event.target.tag;
        });
        let CommonData = HallCommonData.getInstance()


        let data = master_vip.getItem(function (item) {
            return item.key == CommonData.vipLevel;
        });
        if ((data.num - CommonData.curUseFishGiftCnt) < 1) {
            cc.dd.PromptBoxUtil.show('今日兑换次数不足');
            return
        }
        if (CommonData.fishGiftNum < shop.cost) {
            cc.dd.PromptBoxUtil.show('礼券数量不足');
            return
        }
        if (event.target.shopType != 1) {
            if (!CommonData.telNum) {
                cc.dd.DialogBoxUtil.show(0, '绑定手机才能兑换实物奖励', '去绑定', '取消', function () {
                    cc.dd.UIMgr.openUI(hall_prefab.BIND_PHONE);
                }, null, '');
                return
            }
            if (!CommonData.idNum) {
                cc.dd.DialogBoxUtil.show(0, '实名认证才能兑换实物奖励', '去认证', '取消', function () {
                    cc.dd.UIMgr.openUI(hall_prefab.CERTIFICATION, (ui) => {
                        ui.getComponent('klb_hall_Certification').setBindFunc(this._changeScen.bind(this), () => {
                            cc.game.end();
                        });
                    });
                }, null, '');
                return
            }
            let self = this
            if (CommonData.vipLevel < shop.vip_level) {
                cc.dd.PromptBoxUtil.show('VIP等级不足');
                return
            }
            cc.dd.DialogBoxUtil.show(0, '是否确认兑换？', '确定', '取消', function () {
                //京东卡
                if (event.target.shopType == 3) {
                    cc.find('editAddress/bydr_store_bg/title', self.node).getComponent(cc.Label).string = '请填写收货联系方式'
                    cc.find('editAddress/bydr_store_bg/Button', self.node).tag = event.target.tag
                    cc.find('editAddress/bydr_store_bg/address', self.node).getComponent(cc.EditBox).string = ''
                    cc.find('editAddress/bydr_store_bg/phone', self.node).getComponent(cc.EditBox).string = ''
                    cc.find('editAddress/bydr_store_bg/user', self.node).getComponent(cc.EditBox).string = ''
                    cc.find('editAddress', self.node).active = true
                    // self.submitJDcard = true
                } else {
                    //红包兑换
                    self.shopId = event.target.tag
                    cc.find('MessageBox', self.node).active = true
                }

            }, null, '');
        } else {
            cc.dd.DialogBoxUtil.show(0, '是否确认兑换？', '确定', '取消', function () {
                //兑换金币
                let params = {
                    id: event.target.tag,
                    type: event.target.shopType,
                    zfbAccount: '',
                    zfbUsername: '',
                    jdkAddr: '',
                    jdkPhone: '',
                    jdkUsername: '',
                }
                doyen_sender.fishGiftexchange(params)
            }, null, '');
        }
    },
    //京东卡地址编辑
    submitAddress(event) {
        let AddressBox = cc.find('editAddress/bydr_store_bg', this.node)
        // if (!this.submitJDcard) {
        //     AddressBox.active = false
        //     this.showGiftAnima({ type: event.target.type, count: event.target.count })
        //     return
        // }
        let Address = cc.find('address', AddressBox).getComponent(cc.EditBox).string
        let phone = cc.find('phone', AddressBox).getComponent(cc.EditBox).string
        let userName = cc.find('user', AddressBox).getComponent(cc.EditBox).string
        Address = Address.replace(/\s*/g, "");
        let regex = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        userName = userName.replace(/\s*/g, "");
        if (Address == '') {
            cc.dd.PromptBoxUtil.show('请输入收货地址');
            return
        }
        if (!regex.test(phone)) {
            cc.dd.PromptBoxUtil.show('请输入正确手机号');
            return
        }
        if (userName == '') {
            cc.dd.PromptBoxUtil.show('请输入收货人姓名');
            return
        }
        // if (Address != '' && regex.test(phone) && userName != '') {
        let params = {
            id: event.target.tag,
            type: 5,
            zfbAccount: '',
            zfbUsername: '',
            jdkAddr: Address,
            jdkPhone: phone,
            jdkUsername: userName,
        }
        doyen_sender.fishGiftexchange(params)
        this.closeEditAddress()
        // cc.find('title', AddressBox).getComponent(cc.Label).string = '收货地址已经提交, 请注意查收'
        // this.submitJDcard = false
        // } else {
        //     cc.dd.PromptBoxUtil.show('请输入完整信息');
        // }
    },
    //领取微信红包
    onclickWeChat() {
        let params = {
            id: this.shopId,
            type: 2,
            zfbAccount: '',
            zfbUsername: '',
            jdkAddr: '',
            jdkPhone: '',
            jdkUsername: '',
        }
        doyen_sender.fishGiftexchange(params)
        this.closeMsgBox()
    },
    //领取支付宝红包
    onclickAlipay() {
        let msgBox = cc.find('AlipayAccount/bydr_store_bg', this.node)
        let account = cc.find('account', msgBox).getComponent(cc.EditBox).string
        let userName = cc.find('userName', msgBox).getComponent(cc.EditBox).string
        account = account.replace(/\s*/g, "");
        userName = userName.replace(/\s*/g, "");
        if (account == '') {
            cc.dd.PromptBoxUtil.show('请输入支付宝账号');
            return
        }
        if (userName == '') {
            cc.dd.PromptBoxUtil.show('请输入支付宝用户名');
            return
        }
        let params = {
            id: this.shopId,
            type: 3,
            zfbAccount: account,
            zfbUsername: userName,
            jdkAddr: '',
            jdkPhone: '',
            jdkUsername: '',
        }
        doyen_sender.fishGiftexchange(params)
        this.showAlipayAccount('', 'hide')
    },
    showAlipayAccount(event, val) {
        if (val == 'hide') {
            cc.find('AlipayAccount', this.node).active = false
        } else {
            cc.find('AlipayAccount', this.node).active = true
            cc.find('MessageBox', this.node).active = false
        }
    },
    //领取话费红包
    onclickTelephone() {
        let params = {
            id: this.shopId,
            type: 4,
            zfbAccount: '',
            zfbUsername: '',
            jdkAddr: '',
            jdkPhone: '',
            jdkUsername: '',
        }
        doyen_sender.fishGiftexchange(params)
        this.closeMsgBox()
    },
    closeMsgBox(event, val) {
        cc.find('MessageBox', this.node).active = false
    },
    closeEditAddress(event, val) {
        cc.find('editAddress', this.node).active = false
    },
    closeSuccess(event, val) {
        cc.find('success', this.node).active = false
        // this.showGiftAnima({ type: event.target.type, count: event.target.count })
    },
    closeRedBag(event, val) {
        cc.find('order_redbag', this.node).active = false
        // this.showGiftAnima({ type: event.target.type, count: event.target.count })
    },
    //兑换动画
    showGiftAnima(data) {
        cc.dd.UIMgr.openUI("gameyj_fish_doyen/prefabs/xl_bydr_hddh", function (node) {
            var scp = node.getComponent('gameyj_Fish_doyen_animation')
            scp.init(data)
        });
        this.onClose()
    },
    //抽取礼券
    receiveGift() {
        let RoomType = gFishMgr.getRoomType()
        doyen_sender.fishGift({ id: this.giftId, roomid: RoomType })
        this.onClose()
    },
    //兑换记录
    showRecord() {
        cc.find('duihuan', this.node).active = false
        doyen_sender.exchangeRecord()
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
        } else if (num >= 10000) {
            str = (num / 10000) + '万';
        } else {
            str = num;
        }
        return str;
    },
    //初始化规则 
    initRule() {
        let content = cc.find('rule/bydr_bg_3/scrollView/view/content', this.node)
        let item = cc.find('rule/bydr_bg_3/item', this.node)
        content.removeAllChildren()

        let RoomType = gFishMgr.getRoomType()
        let datalist = master_gift.getItemList(function (item) {
            return item.roomid == RoomType;
        });
        for (let i = 0; i < datalist.length; i++) {
            let element = datalist[i];
            let itemNode = cc.instantiate(item)

            let descString = element.desc.split(',')
            itemNode.getChildByName('name').getComponent(cc.Label).string = descString[0];
            itemNode.getChildByName('desc').getComponent(cc.Label).string = descString[1];
            itemNode.active = true
            itemNode.parent = content
        }

    },
    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.FISH_GIFT:
                let CommonData = HallCommonData.getInstance()
                cc.find('duihuan/bydr_bg_3/total/num', this.node).getComponent(cc.Label).string = this.changeNumToCHN(CommonData.fishGiftNum)
                let vipdata = master_vip.getItem(function (item) {
                    return item.key == CommonData.vipLevel;
                });
                cc.find('duihuan/bydr_bg_3/curUseCnt/usable', this.node).getComponent(cc.Label).string = '今日剩余兑换次数：' + (vipdata.num - CommonData.curUseFishGiftCnt)



                switch (data.type) {
                    case 1:

                        // let node = cc.find('order_redbag', this.node)
                        // cc.find('bydr_bg_3/orderid', node).getComponent(cc.Label).string = '订单号:' + this.GiftLogList[event.target.tag].orderid
                        // cc.find('bydr_bg_3/copyorder', node).tag = this.GiftLogList[event.target.tag].orderid
                        // cc.find('bydr_bg_3/code', node).getComponent(cc.Label).string = this.GiftLogList[event.target.tag].code
                        // cc.find('bydr_bg_3/copy', node).tag = this.GiftLogList[event.target.tag].code
                        // cc.find('bydr_bg_3/bydr_btn_close', node).type = data.type
                        // cc.find('bydr_bg_3/bydr_btn_close', node).count = data.count

                        this.showGiftAnima({ type: data.type, count: data.count })
                        break;
                    case 2:
                        let node = cc.find('redbag', this.node)
                        cc.find('bydr_store_bg/wx', node).getComponent(cc.Label).string = CommonData.wx
                        cc.find('bydr_store_bg/copyWx', node).tag = CommonData.wx
                        cc.find('bydr_store_bg/code', node).getComponent(cc.Label).string = data.code
                        cc.find('bydr_store_bg/copyCode', node).tag = data.code
                        node.active = true
                        break;
                    case 3:
                        cc.find('success/bydr_store_bg/label', this.node).getComponent(cc.Label).string = "红包将以转账给您的支付宝,请注意查收!\n(2个工作日内到账)"
                        // cc.find('success/bydr_store_bg/Button', this.node).type = data.type
                        // cc.find('success/bydr_store_bg/Button', this.node).count = data.count
                        cc.find('success', this.node).active = true
                        break;
                    case 4:
                        cc.find('success/bydr_store_bg/label', this.node).getComponent(cc.Label).string = "红包将以话费的形式存入您\n的绑定手机,请注意查收!\n(2个工作日内到账)"
                        // cc.find('success/bydr_store_bg/Button', this.node).type = data.type
                        // cc.find('success/bydr_store_bg/Button', this.node).count = data.count
                        cc.find('success', this.node).active = true
                        break;
                    case 5:

                        cc.find('success/bydr_store_bg/label', this.node).getComponent(cc.Label).string = "收货地址已经提交，请注意查收"
                        // cc.find('success/bydr_store_bg/Button', this.node).type = data.type
                        // cc.find('success/bydr_store_bg/Button', this.node).count = data.count
                        cc.find('success', this.node).active = true
                        break;
                }
                break;
            case Hall.HallEvent.LOG_GIFT:
                this.initGiftLog(data.listList)
                break;
            case Hall.HallEvent.FISH_ACTIVITY:
                if (data.state != 1)
                    this.onClose()
                break;
            case Hall.HallEvent.UPDATE_GIFT:
                if (data.type == 1) {
                    this.showMasterShop('', '1')
                } else if (data.type == 2 || data.type == 3 || data.type == 4) {
                    this.showMasterShop('', '2')
                } else if (data.type == 5) {
                    this.showMasterShop('', '3')
                } else {
                }
                break;

            // case RoomEvent.on_room_enter:
            //     this.on_room_enter();
            //     break;
        }
    },
    //兑换记录列表
    initGiftLog(list) {
        cc.find('duihuanjilu', this.node).active = true
        this.GiftLogList = list
        let self = this
        let scp = cc.find('duihuanjilu/bydr_bg_3/ScrollView', this.node).getComponent('com_glistView');
        scp.setDataProvider(list, 0, function (itemNode, index) {
            if (index < 0 || index >= list.length)
                return;
            let element = list[index];
            let shop = master_shop.getItem(function (item) {
                return item.key == element.shopId;
            });
            itemNode.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = self.icon[shop.type - 1]
            itemNode.getChildByName('time').getComponent(cc.Label).string = self.convertTimeDay(element.time)

            itemNode.getChildByName('describe').getComponent(cc.Label).string = shop.dec
            itemNode.getChildByName('Button').tag = index
            itemNode.getChildByName('Button').shopType = shop.type
            let str = ''
            switch (element.flag) {
                case 0:
                    str = '待领取'
                    itemNode.getChildByName('state').color = new cc.Color(10, 111, 163)
                    break
                case 1:
                    str = '已完成'
                    itemNode.getChildByName('state').color = new cc.Color(24, 127, 9)
                    break
                case 2:
                    str = '客服已发货'
                    itemNode.getChildByName('state').color = new cc.Color(10, 111, 163)
                    break
            }
            itemNode.getChildByName('state').getComponent(cc.Label).string = str
            if (shop.type != 1) {
                itemNode.getChildByName('Button').active = true
            } else {
                itemNode.getChildByName('Button').active = false
            }
        });
    },
    //订单详情
    orderDetails(event) {
        if (event.target.shopType == 2) {
            let node = cc.find('details_redbag', this.node)
            cc.find('bydr_bg_3/orderid', node).getComponent(cc.Label).string = '订单号:' + this.GiftLogList[event.target.tag].orderid
            cc.find('bydr_bg_3/copyorder', node).tag = this.GiftLogList[event.target.tag].orderid
            cc.find('bydr_bg_3/code', node).getComponent(cc.Label).string = this.GiftLogList[event.target.tag].code
            cc.find('bydr_bg_3/copy', node).tag = this.GiftLogList[event.target.tag].code
            node.active = true
        } else if (event.target.shopType == 3) {
            let node = cc.find('details_JDcard', this.node)
            cc.find('bydr_bg_3/orderid', node).getComponent(cc.Label).string = '订单号:' + this.GiftLogList[event.target.tag].orderid
            cc.find('bydr_bg_3/copyorder', node).tag = this.GiftLogList[event.target.tag].orderid
            cc.find('bydr_bg_3/code', node).getComponent(cc.Label).string = this.GiftLogList[event.target.tag].sendCode
            cc.find('bydr_bg_3/copy', node).tag = this.GiftLogList[event.target.tag].code
            cc.find('bydr_bg_3/address', node).getComponent(cc.Label).string = this.GiftLogList[event.target.tag].jdkAddr
            cc.find('bydr_bg_3/phoneNum', node).getComponent(cc.Label).string = this.GiftLogList[event.target.tag].jdkPhone
            cc.find('bydr_bg_3/userName', node).getComponent(cc.Label).string = this.GiftLogList[event.target.tag].jdkUsername
            node.active = true
        } else {

        }
    },

    SaveToPhotoAlbum() {
        let node = cc.find('redbag/bydr_store_bg', this.node)
        var fileName = "Wxcode.png";
        cc.dd.SysTools.captureCustomNode(fileName, node, function () {
            cc.dd.native_systool.captureScreenToPhotoAlbum(jsb.fileUtils.getWritablePath() + '/' + fileName);
            cc.dd.PromptBoxUtil.show('图片保存于系统相册中!');
            this.onClose()
        });
    },
    onCopy(event) {
        cc.dd.native_systool.SetClipBoardContent(event.target.tag);
        // cc.dd.PromptBoxUtil.show("复制成功");
    },
    closeDetails(event, val) {
        cc.find(val, this.node).active = false
    },
    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },
    onClose: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },
    /**
    * 转换时间
    */
    convertTimeDay: function (t) {
        var date = new Date(t * 1000);
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = month + seperator1 + strDate + '\n' + date.getHours() + ':' + date.getSeconds();
        return currentdate;
    },
});
