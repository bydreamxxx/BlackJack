var hallData = require('hall_common_data').HallCommonData.getInstance();
const data_vip = require('vip');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;
var HallVip = require('hall_vip').VipData.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        currentLevelLabel: cc.Label,
        nextLevelLabel: cc.Label,
        nextExpLabel: cc.Label,
        nextEnd: cc.Node,
        nextRewardLabel: cc.Label,
        expProgress: cc.ProgressBar,

        pageView: cc.PageView,

        scrollView:cc.Node,
        noticeNode: cc.Node,
        pageEndNode: cc.Node,

        rewardNode: cc.Node,

        rewardButton: cc.Node,
        rewardedButton: cc.Node,
        notice: cc.Node,

        leftArrow: cc.Node,
        rightArrow: cc.Node,

        leftButton: cc.Button,
        rightButton: cc.Button,

        atlasIcon: cc.SpriteAtlas,

        _scrollViewList: [],

        _progressWidthAdd: 220,
        _defaultProgressWidth: 175,

        _isInit: false,

        _leftLimit: 0,
        _rightLimit: 14,

        // _touchMove: false,
        // _isScrollByTouch: false,
        _maxLevel: 0,
        _showNextRewardLabel: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        TaskED.addObserver(this);

        this.leftArrow.active = false;
        this.rightArrow.active = false;
        this.leftButton.interactable = false;
        this.rightButton.interactable = false;


        this.currentLevelLabel.string = hallData.vipLevel;

        let vips = data_vip.getItemList((vip)=>{
            return vip.key > 0;
        });

        this._maxLevel = vips[vips.length - 1].key;

        for(let i = 0; i < vips.length; i++){
            // let node = null;
            // if(vips[i].items == "" || vips[i].items == "0"){
            //     node = cc.instantiate(this.noticeNode);
            // }else{
            //     node = cc.instantiate(this.scrollView);
            // }
            // node.active = true;
            // this._scrollViewList.push(node);
            // this.pageView.addPage(node);

            if(vips[i].key - 1 == hallData.vipLevel){
                this.nextLevelLabel.string = hallData.vipLevel+1;
                if(vips[i].exp >= hallData.vipExp){
                    this.nextExpLabel.string = 'EXP'+(vips[i].exp - hallData.vipExp);
                    this.expProgress.progress = hallData.vipExp / vips[i].exp;
                }else{
                    this.nextExpLabel.string = 'EXP1';
                    this.expProgress.progress = 0.999;
                }
                this.expProgress.node.parent.active = true;
                this.nextLevelLabel.node.parent.active = true;
                this.nextEnd.active = false;

                this._currentIndex = hallData.vipLevel;
            }
        }

        //满级
        if(hallData.vipLevel == this._maxLevel){
            this.expProgress.node.parent.active = false;
            this.nextLevelLabel.node.parent.active = false;
            this.nextEnd.active = true;

            this._currentIndex = hallData.vipLevel;
        }

        let node = cc.instantiate(this.pageEndNode);
        node.active = true;
        this._scrollViewList.push(node);
        this.pageView.addPage(node);

        // this.pageView.node.on('scroll-ended', this.pageEnd, this);
        // this.pageView.node.on('touch-up', ()=>{
        //     cc.error('touch-up')
        //     if(this._touchMove){
        //         this._isScrollByTouch = true;
        //     }
        //     this._touchMove = false;
        // }, this);
        // this.pageView.node.on(cc.Node.EventType.TOUCH_MOVE, ()=>{
        //     cc.error('touch-move')
        //     this._touchMove = true;
        // }, this);
    },

    onDestroy: function () {
        TaskED.removeObserver(this);
    },

    onEnable(){
        //取消滑动
        // setTimeout(()=>{
        //     this.pageView.node.off(cc.Node.EventType.TOUCH_START, this.pageView._onTouchBegan, this.pageView, true);
        //     this.pageView.node.off(cc.Node.EventType.TOUCH_MOVE, this.pageView._onTouchMoved, this.pageView, true);
        //     this.pageView.node.off(cc.Node.EventType.TOUCH_END, this.pageView._onTouchEnded, this.pageView, true);
        //     this.pageView.node.off(cc.Node.EventType.TOUCH_CANCEL, this.pageView._onTouchCancelled, this.pageView, true);
        // }, 500)
    },

    start(){
        if(HallVip.m_buyList && !this._isInit){
            this.updateVipList();
        }
    },

    /**
     * 设置VIP奖励
     * @param vipdata
     * @param node
     */
    setVipItemList(vipdata, node){
        // if(vipdata.items != '0' && vipdata.items != ''){
        //     let vipScrollview = node.getComponent('klb_hall_vip_new_scrollview');
        //     let scrollView = node.getComponent(cc.ScrollView);
        //
        //     let progressbarStart = scrollView.content.getChildByName('ProgressBarStart').getComponent(cc.ProgressBar);
        //     let progressbarEnd = scrollView.content.getChildByName('ProgressBarEnd').getComponent(cc.ProgressBar);
        //     progressbarStart.node.x = 37;
        //
        //     let items = vipdata.items.split(';');
        //     let temp = [];
        //     for(let i = 0; i < items.length; i++){
        //         progressbarStart.node.width = this._defaultProgressWidth + this._progressWidthAdd * i;
        //         progressbarStart.totalLength = this._defaultProgressWidth + this._progressWidthAdd * i;
        //
        //         let list = items[i].split(',');
        //         temp.push(list);
        //     }
        //     progressbarEnd.node.x = progressbarStart.node.x + progressbarStart.node.width + 66;
        //
        //     if(hallData.vipLevel > vipdata.key - 1){
        //         progressbarStart.progress = 1;
        //         progressbarEnd.progress = 1;
        //     }else if(hallData.vipLevel < vipdata.key - 1){
        //         progressbarStart.progress = 0;
        //         progressbarEnd.progress = 0;
        //     }else{
        //         progressbarStart.progress = hallData.vipExp / vipdata.exp;
        //         if(vipdata.exp > hallData.vipExp){
        //             progressbarEnd.progress = 0;
        //         }else{
        //             progressbarEnd.progress = 1;
        //         }
        //     }
        //
        //     scrollView.content.width = progressbarEnd.node.x + (items.length > 4 ? 37 : 32);
        //
        //     vipScrollview.updateUI(temp, vipdata.key - 1, this.atlasIcon);
        // }
    },
    /**
     * 更新每个级别VIP奖励
     */
    updateVipList(){
        this._isInit = true;
        let vips = data_vip.getItemList((vip)=>{
            return vip.key > 0;
        });

        let vipItem = [];
        for(let i = 0; i < vips.length; i++){
            if(vips[i].key - 1 == hallData.vipLevel && vips[i].items != "" && vips[i].items != "0"){
                vipItem = vips[i].items.split(';');
            }
            // this.setVipItemList(vips[i], this._scrollViewList[i]);
        }

        let min_exp = 0;
        for(let i = vipItem.length - 1; i >= 0 ; i--){
            let item = vipItem[i].split(',');
            if(parseInt(item[0]) >= hallData.vipExp){
                min_exp = parseInt(item[0]);
            }else{
                break;
            }
        }

        //满级
        let node = this._scrollViewList[this._scrollViewList.length - 1];
        let pageEnd = node.getComponent('klb_hall_vip_new_pageend');
        pageEnd.updateUI('10000,1001,19000000'.split(','), this.atlasIcon, hallData.vipLevel);

        // if(hallData.vipLevel == this._maxLevel){
            this._showNextRewardLabel = 10000 > HallVip.maxExp;
            this.nextRewardLabel.string = 'EXP'+(10000 - HallVip.maxExp);
        // }else{
        //     this._showNextRewardLabel = vipItem.length > 0 && min_exp > hallData.vipExp;
        //     this.nextRewardLabel.string = 'EXP'+(min_exp - hallData.vipExp);
        // }

        // this.moveToPage();
        this.nextRewardLabel.node.active = this._showNextRewardLabel && this._currentIndex == hallData.vipLevel;
        // this.rewardButton.active = HallVip.hasRewardNotRecive()[1];
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        switch (event){
            case TaskEvent.VIP_GET_GIFT_INFO:
                if(!this._isInit){
                    this.updateVipList();
                }
                this.updateVipLimit();
                break;
            default:
                break;
        }
    },

    /**
     * 滑动停止后回调
     */
    pageEnd(){
        // this._currentIndex = this.pageView.getCurrentPageIndex();
        //
        // this.nextRewardLabel.node.active = this._showNextRewardLabel && this._currentIndex == hallData.vipLevel;
        //
        // // if(this._isScrollByTouch || this._touchMove){
        // //     this._isScrollByTouch = false;
        // //     this._touchMove = false;
        // //     cc.error('isScrollByTouch');
        // //     this.moveToPage();
        // //     return;
        // // }else{
        // //     cc.error('isScrollByButton')
        // // }
        // this.pagePos = this.pageView.getContentPosition();
        //
        // if(!this.hasRewardNotRecive){
        //     this.hasRewardNotRecive = HallVip.hasRewardNotRecive();
        //     this.minVipLevel = this.hasRewardNotRecive[0];
        // }
        //
        // if(hallData.vipLevel > this.hasRewardNotRecive[0]){
        //     if(!this.hasRewardNotRecive[1]){
        //         this.pageView.enabled = false;
        //         this.leftArrow.active = false;
        //         this.rightArrow.active = false;
        //         this.leftButton.interactable = false;
        //         this.rightButton.interactable = false;
        //     }else{
        //         this.pageView.enabled = true;
        //
        //         if(this._currentIndex >= hallData.vipLevel){
        //             this.rightArrow.active = false;
        //             this.rightButton.interactable = false;
        //         }else{
        //             this.rightArrow.active = true;
        //             this.rightButton.interactable = true;
        //         }
        //
        //         if(this._currentIndex > this.minVipLevel+1){
        //             this.leftArrow.active = true;
        //             this.leftButton.interactable = true;
        //         }else{
        //             this.leftArrow.active = false;
        //             this.leftButton.interactable = false;
        //         }
        //     }
        // }else{
        //     this.pageView.enabled = false;
        //     this.leftArrow.active = false;
        //     this.rightArrow.active = false;
        //     this.leftButton.interactable = false;
        //     this.rightButton.interactable = false;
        // }
        //
        // this.updateVipLimit();
    },

    /**
     * 更新pageivew滑动限制
     */
    updateVipLimit(){
        // this.hasRewardNotRecive = HallVip.hasRewardNotRecive();
        //
        // this.minVipLevel = this.hasRewardNotRecive[0];
        //
        this._showNextRewardLabel = 10000 > HallVip.maxExp;
        this.nextRewardLabel.string = 'EXP'+(10000 - HallVip.maxExp);
        this.nextRewardLabel.node.active = this._showNextRewardLabel && this._currentIndex == hallData.vipLevel;
        // this.rewardButton.active = HallVip.hasRewardNotRecive()[1];//hallData.vipLevel > this.hasRewardNotRecive[0] && this.hasRewardNotRecive[1];
        // this.rewardedButton.active = hallData.vipLevel > this.hasRewardNotRecive[0] && !this.hasRewardNotRecive[1] && HallVip.m_buyList.length > 0;
        // // this.notice.active = hallData.vipLevel > result[0] && !result[1];
        //
        // if(hallData.vipLevel > this.hasRewardNotRecive[0]){
        //     if(!this.hasRewardNotRecive[1]){
        //         if(this._currentIndex != hallData.vipLevel){
        //             this._currentIndex = hallData.vipLevel;
        //             this.moveToPage()
        //         }else{
        //             this.pageView.enabled = false;
        //             this.leftArrow.active = false;
        //             this.rightArrow.active = false;
        //             this.leftButton.interactable = false;
        //             this.rightButton.interactable = false;
        //         }
        //     }
        // }
    },

    /**
     * 左滑
     */
    onClickLeft(){
        // hall_audio_mgr.com_btn_click();
        //
        // this._currentIndex--;
        //
        // this.moveToPage();
    },

    /**
     * 右滑
     */
    onClickRight(){
        // hall_audio_mgr.com_btn_click();
        //
        // this._currentIndex++;
        //
        // this.moveToPage();
    },

    onClickClose: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);

    },

    /**
     * 全部领取
     */
    onClickReciveAll(){
        let result = HallVip.hasRewardNotRecive();
        hall_audio_mgr.com_btn_click();
        if(result[1]){//hallData.vipLevel > result[0] && result[1]){
            let msg = new cc.pb.rank.msg_vip_draw_onekey();
            cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_vip_draw_onekey, msg, 'msg_vip_draw_onekey', true);
        }
    },

    /**
     * 单独领取
     * @param event
     * @param data
     */
    onClickRecive(event, data){
        if(event.target.canRecive){
            let msg = new cc.pb.rank.msg_vip_draw();
            msg.setIndex(event.target.index);
            msg.setLevel(event.target.viplevel);
            cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_vip_draw, msg, 'msg_vip_draw', true);
        }
    },

    moveToPage(){
        // this.pageView.scrollToPage(this._currentIndex);
    },

    /**
     * 拖动滑动的时候判断滑动边界
     */
    // update(dt){
    //     if(this.pageView.enabled){
    //         if(this.pageView.isScrolling()){
    //             if(this.minVipLevel){
    //                 if(this._currentIndex == this.minVipLevel + 1){
    //                     let pos = this.pageView.getContentPosition();
    //                     if(this.pagePos.x < pos.x){
    //                         this.pageView.stopAutoScroll();
    //                         this.pageView.setContentPosition(this.pagePos);
    //                     }
    //                 }
    //             }
    //
    //             if(this._currentIndex == hallData.vipLevel || this._currentIndex == this.pageView.getPages().length){
    //                 let pos = this.pageView.getContentPosition();
    //                 if(this.pagePos.x > pos.x){
    //                     this.pageView.stopAutoScroll();
    //                     this.pageView.setContentPosition(this.pagePos);
    //                 }
    //             }
    //         }
    //     }
    // }
});
