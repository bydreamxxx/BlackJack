// create by wj 2018/10/17
var deskData = require('dsz_desk_data').DSZ_Desk_Data.Instance();
var playerMgr = require('dsz_player_mgr').DSZ_PlayerMgr.Instance();
var dsz_send_msg = require('dsz_send_msg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var deskEd = require('dsz_desk_data').DSZ_Desk_Ed;
var deskEvent = require('dsz_desk_data').DSZ_Desk_Event;

cc.Class({
    extends: cc.Component,
    properties: {
        //m_tBtnVec:{default: [], type: cc.Node, tooltip: '斗三张操作按钮'},
        m_bCallAuto: false,
        m_bFoldAuto: false,
        m_bFriend: false,
    },

    ctor: function(){
        this.btnName = [
            'callBtn',
            'advanceBtn0',
            'advanceBtn1',
            'maxBtn',
            'foldBtn',
            'compareBtn',
            'fireBtn',
            'guzhuyizhiBtn',
            'callAutoBtn',
            'foldAutoBtn',
            'stopcallAutoBtn',
            'stopfoldAutoBtn',
            'changeBtn'
        ];

        this.btnTag = {
            genzhu: 0, //跟注
            jiazhu1: 1, //加注
            jiazhu2: 2,//加注
            zhifeng: 3,//直封
            qipai: 4, //弃牌
            bipai: 5, //比牌
            huoping: 6, //火拼
            guzhuyizhi: 7, //孤注一掷
            genzhuAuto: 8,//自动跟注
            qipaiAuto: 9,//自动弃牌     
            stopgenzhuAuto: 10, //取消自动跟注
            stopaipaiAuto: 11,//取消自动弃牌   
            change: 12, //换桌 
        };
    },


    //朋友场按钮解析
    analysisPycPlayerOpBtn: function(){
        this.m_bFriend = true;
        this.enabelAllBtn(true);
        if(this.m_bCallAuto){//自动跟注
            this.node.stopAllActions();
            // if(this._callback_id)
            //     clearTimeout(this._callback_id);
            this.node.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(function(){
                this.callBtnCallBack();
            }.bind(this))));
            return;
        }else if(this.m_bFoldAuto){//自动弃牌
            this.foldCallBack();
            this.m_bFoldAuto = false;
            return;
        }
        this.hideAllBtn();
        //跟注按钮常显
        var callBtn = cc.find(this.btnName[this.btnTag.genzhu], this.node);
        if(callBtn)
            callBtn.active = true;
        //弃牌常显
        var foldBtn = cc.find(this.btnName[this.btnTag.qipai], this.node);
        if(foldBtn)
            foldBtn.active = true;
        
        //加注按钮/直封 显示判定
        var config_data = deskData.getConfigData();
        if(config_data){
            var curBetLevel = deskData.getCurBetLevel();
            //获取自己的游戏数据
            var ownData = playerMgr.findPlayerByUserId(cc.dd.user.id).getPlayerGameInfo();
            //获取下注档次数据
            var betLevelList = [];
            if(ownData.pokersState == 0){//未看牌
                betLevelList = config_data.anzhu.split(';')
            }else{
                betLevelList = config_data.mingzhu.split(';')
            }

            //直封按钮判定
            var maxBtn = cc.find(this.btnName[this.btnTag.zhifeng], this.node);
            if(maxBtn)
                maxBtn.active = (curBetLevel < betLevelList.length);

            //加注按钮
            var advanceBtn0 = cc.find(this.btnName[this.btnTag.jiazhu1], this.node);
            var advanceBtn1 = cc.find(this.btnName[this.btnTag.jiazhu2], this.node);

            if(curBetLevel + 1 == betLevelList.length){//差一个档次封顶
                advanceBtn0.active = true;
                advanceBtn1.active = false;
                var betInfo = betLevelList[4].split(',');
                var nowBetInfo = betLevelList[curBetLevel - 1].split(',');
                advanceBtn0.getChildByName('desc').getComponent(cc.Label).string = (parseInt(betInfo[1]) - parseInt(nowBetInfo[1]));
            }else if(curBetLevel >= betLevelList.length){//达到最大档次
                advanceBtn0.active = false;
                advanceBtn1.active = false;
            }else if(curBetLevel + 2 <= betLevelList.length ){//相差至少2档次
                advanceBtn0.active = true;
                advanceBtn1.active = true;
                var betInfo1 = betLevelList[curBetLevel + 1].split(',');
                var betInfo2 = betLevelList[curBetLevel].split(',');
                var nowBetInfo = betLevelList[curBetLevel - 1].split(',');
                advanceBtn1.getChildByName('desc').getComponent(cc.Label).string = (parseInt(betInfo1[1]) - parseInt(nowBetInfo[1]));
                advanceBtn0.getChildByName('desc').getComponent(cc.Label).string = (parseInt(betInfo2[1]) - parseInt(nowBetInfo[1]));

            }

        }

        //比牌按钮判定
        var compBtn = cc.find(this.btnName[this.btnTag.bipai], this.node);
        if(compBtn){
            var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

            if(roomMgr._Rule.limitRule == 1)
                compBtn.active = ( deskData.getCurCircle() >= roomMgr._Rule.limitCmp);
            else
            compBtn.active = ( deskData.getCurBet() >= roomMgr._Rule.limitCmp);
        }
    },

    //解析金币场按钮
    analysisJbcPlayerOpBtn: function(){
        this.enabelAllBtn(true);
        var ownData = playerMgr.findPlayerByUserId(cc.dd.user.id).getPlayerGameInfo();
        var config_data = deskData.getConfigData();

        if(this.m_bCallAuto){//自动跟注
            this.node.stopAllActions();
            if(config_data){
                var curBetLevel = deskData.getCurBetLevel();
                //获取下注档次数据
                var betLevelList = [];
                if(ownData.pokersState == 0){//未看牌
                    betLevelList = config_data.anzhu.split(';')
                }else{
                    betLevelList = config_data.mingzhu.split(';')
                }

                var nowBetInfo = betLevelList[curBetLevel - 1].split(','); //当前跟注值

                if(ownData.curScore < nowBetInfo[1]){
                    this.m_bCallAuto = false;
                    this.analysisJbcPlayerOpBtn();
                    return;
                }
            }
            // var self = this;
            // this._callback_id = setTimeout(function() {
            //     if(deskData.getFireBet() != 0)
            //         self.fireBtnCallBack();
            //     else
            //         self.callBtnCallBack();

            // }, 800);
            this.node.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(function(){
                if(deskData.getFireBet() != 0)
                    this.fireBtnCallBack();
                else
                    this.callBtnCallBack();
            }.bind(this))))
            return;
        }else if(this.m_bFoldAuto){//自动弃牌
            this.foldCallBack();
            this.m_bFoldAuto = false;
            return;
        }

        //获取自己的游戏数据
        this.hideAllBtn();
        if(deskData.getFireBet() != 0){ //已经进入火拼
            //火拼按钮判定
            var fireBtn = cc.find(this.btnName[this.btnTag.huoping], this.node);
            if(fireBtn){
                fireBtn.active = true;
                fireBtn.getChildByName('desc').getComponent(cc.Label).string = deskData.getFireBet();
            }
            //弃牌常显
            var foldBtn = cc.find(this.btnName[this.btnTag.qipai], this.node);
            if(foldBtn)
                foldBtn.active = true;
            return;

        }
        
        //加注按钮/直封 显示判定
        if(config_data){
            var curBetLevel = deskData.getCurBetLevel();
            //获取下注档次数据
            var betLevelList = [];
            if(ownData.pokersState == 0){//未看牌
                betLevelList = config_data.anzhu.split(';')
            }else{
                betLevelList = config_data.mingzhu.split(';')
            }

            //弃牌常显
            var foldBtn = cc.find(this.btnName[this.btnTag.qipai], this.node);
            if(foldBtn)
                foldBtn.active = true;
            //孤注一掷判定
            var allInBtn = cc.find(this.btnName[this.btnTag.guzhuyizhi], this.node);
            if(allInBtn){
                var nowBetInfo = betLevelList[curBetLevel - 1].split(','); //当前跟注值
                //allInBtn.active = true;
                if(ownData.curScore < parseInt(nowBetInfo[1]) && deskData.getCurCircle() >= config_data.limit_try){
                    allInBtn.active = true;
                    return;
                }
            }
            //跟注按钮常显
            var callBtn = cc.find(this.btnName[this.btnTag.genzhu], this.node);
            if(callBtn)
                callBtn.active = true;


            //直封按钮判定
            var maxBtn = cc.find(this.btnName[this.btnTag.zhifeng], this.node);
            if(maxBtn){
                var maxBet = betLevelList[betLevelList.length - 1].split(',');
                if(curBetLevel < betLevelList.length &&  ownData.curScore >= parseInt(maxBet[1]))
                    maxBtn.active = true;
            }

            //加注按钮
            var advanceBtn0 = cc.find(this.btnName[this.btnTag.jiazhu1], this.node);
            var advanceBtn1 = cc.find(this.btnName[this.btnTag.jiazhu2], this.node);

            if(curBetLevel + 1 == betLevelList.length){//差一个档次封顶
                var betInfo = betLevelList[4].split(',');
                var nowBetInfo = betLevelList[curBetLevel - 1].split(',');
                if(ownData.curScore >= betInfo[1])
                    advanceBtn0.active = true;
                advanceBtn1.active = false;
                advanceBtn0.getChildByName('desc').getComponent(cc.Label).string = this.convertChipNum((parseInt(betInfo[1]) - parseInt(nowBetInfo[1])));
            }else if(curBetLevel >= betLevelList.length){//达到最大档次
                advanceBtn0.active = false;
                advanceBtn1.active = false;
            }else if(curBetLevel + 2 <= betLevelList.length ){//相差至少2档次
                var betInfo1 = betLevelList[curBetLevel + 1].split(',');
                var betInfo2 = betLevelList[curBetLevel].split(',');
                var nowBetInfo = betLevelList[curBetLevel - 1].split(',');
                if(ownData.curScore >= betInfo2[1])
                    advanceBtn0.active = true;
                if(ownData.curScore >= betInfo1[1])
                    advanceBtn1.active = true;

                advanceBtn1.getChildByName('desc').getComponent(cc.Label).string = this.convertChipNum((parseInt(betInfo1[1]) - parseInt(nowBetInfo[1])));
                advanceBtn0.getChildByName('desc').getComponent(cc.Label).string = this.convertChipNum((parseInt(betInfo2[1]) - parseInt(nowBetInfo[1])));

            }


            //比牌按钮判定
            var compBtn = cc.find(this.btnName[this.btnTag.bipai], this.node);
            if(compBtn){
                var nowBetInfo = betLevelList[curBetLevel - 1].split(',');
                if(ownData.curScore >= (2 * nowBetInfo[1]))
                    compBtn.active = ( deskData.getCurCircle() >= config_data.limit_cmp);
                else if(ownData.curScore < 2*nowBetInfo[1] && deskData.getCurCircle() >= config_data.limit_try)
                    cc.find(this.btnName[this.btnTag.guzhuyizhi], this.node).active = true;

            }

            //火拼按钮判定
            var fireBtn = cc.find(this.btnName[this.btnTag.huoping], this.node);
            if(fireBtn && config_data.limit_fire <= deskData.getCurCircle()){
                fireBtn.active = true;
                var coefficient = 1;
                var minFireValue = ownData.curScore / (ownData.pokersState == 0 ? 1: 2); //算出一个平均最小值
                var coefficientValue = ownData.pokersState == 0 ? 1: 2;

                playerMgr.playerInfo.forEach(element => {
                    if(element && element.userId != cc.dd.user.id){
                        var gameInfo = element.getPlayerGameInfo();
                        if(gameInfo && gameInfo.userState != 1 && gameInfo.userState != 7 && gameInfo.userState != 13){
                            var value = gameInfo.curScore / (gameInfo.pokersState == 0 ? 1 : 2);
                            coefficientValue += (gameInfo.pokersState == 0 ? 1 : 2);

                            coefficient = minFireValue > value ? (gameInfo.pokersState == 0 ? 1 : 2) : coefficient;
                            
                            minFireValue = minFireValue > value ? value : minFireValue;


                        }
                    }
                });

                var otherMin = (config_data.limit_score - deskData.getCurBet()) / coefficientValue;//锅底值

                minFireValue = minFireValue > otherMin ? otherMin : minFireValue;
                //if(minFireValue < otherMin)
                    fireBtn.getChildByName('desc').getComponent(cc.Label).string = this.convertChipNum(Math.floor(minFireValue * coefficient));
                // else
                //     fireBtn.getChildByName('desc').getComponent(cc.Label).string = this.convertChipNum(Math.floor(otherMin));
            }

        }

    },

    //显示自动按钮
    showAutoOpBtn: function(){
        this.hideAllBtn();
        this.enabelAllBtn(true);
        if(!this.m_bCallAuto){
            cc.find(this.btnName[8], this.node).active = true;
            var node = cc.find(this.btnName[11], this.node);
            //node.getChildByName('anim').getComponent(cc.Animation).stop();
        }
        else{
            var node = cc.find(this.btnName[10], this.node)
            node.active = true; //自动跟注取消
            node.getChildByName('anim').getComponent(cc.Animation).play();
        }
        if(!this.m_bFoldAuto){
            cc.find(this.btnName[9], this.node).active = true;; //自动弃牌
            var node = cc.find(this.btnName[10], this.node);
            //node.getChildByName('anim').getComponent(cc.Animation).stop();

        }
        else{
            var node = cc.find(this.btnName[11], this.node); //自动弃牌取消
            node.active = true; //自动跟注取消
            node.getChildByName('anim').getComponent(cc.Animation).play();
        }
    },

    //显示换桌按钮
    showChangeBtn: function(){
        if(!this.m_bTimeer){
            this.hideAllBtn();
            this.enabelAllBtn(true);
            cc.find(this.btnName[12], this.node).active = true; //换桌按钮
        }
    },

    clearChangeBtnState: function(){
        if(this.cd_time){
            cc.find(this.btnName[12], this.node).getComponent(cc.Button).interactable = true;
            cc.find(this.btnName[12], this.node).getChildByName('coverTouch').getComponent(cc.Button).interactable = true;
            clearTimeout(this.cd_time);
        }
        this.m_bTimeer = false;
    },

    //屏蔽所有按钮
    hideAllBtn: function(){
        for(var i = 0; i <= 12; i++)
            cc.find(this.btnName[i], this.node).active = false; //先将所有按钮屏蔽
    },

    //是否启用按钮
    enabelAllBtn: function(enabled){
        // for(var i = 0; i <= 7; i++){
        //    var btn = cc.find(this.btnName[i], this.node).getChildByName('coverTouch');
        //    btn.getComponent(cc.Button).interactable = enabled;
        // }
    },

    //重置自动
    resetAuto: function(){
        this.m_bCallAuto = false;
        this.m_bFoldAuto = false;
        var node = cc.find(this.btnName[10], this.node);
        node.getChildByName('anim').getComponent(cc.Animation).stop();

        var node = cc.find(this.btnName[11], this.node);
        node.getChildByName('anim').getComponent(cc.Animation).stop();

        this.node.stopAllActions();
    },

    ///////////////////////////////////////////////////////按钮操作Begin///////////////////////////////////
    /**
     * 跟注
     */
    callBtnCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.enabelAllBtn(false);
        //获取下注档次数据
        var betLevelList = [];
        //获取自己的游戏数据
        var ownData = playerMgr.findPlayerByUserId(cc.dd.user.id).getPlayerGameInfo();
        var config_data = deskData.getConfigData();

        if(ownData.pokersState == 0){//未看牌
            betLevelList = config_data.anzhu.split(';')
        }else{
            betLevelList = config_data.mingzhu.split(';')
        }
        var curBetLevel = deskData.getCurBetLevel() - 1;//当前下注档位
        var betInfo = betLevelList[curBetLevel].split(',');
        dsz_send_msg.sendNormalOp(parseInt(betInfo[1]), cc.dd.user.id, 1);
    },

    /**
     * 加注
     */
    advanceBtnCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.enabelAllBtn(false);

        var index = parseInt(data);
        //获取下注档次数据
        var betLevelList = [];
        //获取自己的游戏数据
        var ownData = playerMgr.findPlayerByUserId(cc.dd.user.id).getPlayerGameInfo();
        var config_data = deskData.getConfigData();

        if(ownData.pokersState == 0){//未看牌
            betLevelList = config_data.anzhu.split(';')
        }else{
            betLevelList = config_data.mingzhu.split(';')
        }
        var curBetLevel = deskData.getCurBetLevel() - 1;//当前下注档位
        var betInfo = betLevelList[curBetLevel + index].split(',');
        var betNowInfo = betLevelList[curBetLevel].split(',');

        dsz_send_msg.sendNormalOp(parseInt(betInfo[1] - betNowInfo[1]), cc.dd.user.id, 2);
        
    },

    /**
     * 封顶
     */
    maxBtnCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.enabelAllBtn(false);

        //获取下注档次数据
        var betLevelList = [];
        //获取自己的游戏数据
        var ownData = playerMgr.findPlayerByUserId(cc.dd.user.id).getPlayerGameInfo();
        var config_data = deskData.getConfigData();

        if(ownData.pokersState == 0){//未看牌
            betLevelList = config_data.anzhu.split(';')
        }else{
            betLevelList = config_data.mingzhu.split(';')
        }
        var curBetLevel = deskData.getCurBetLevel() - 1;//当前下注档位
        var betInfo = betLevelList[4].split(',');
        var betNowInfo = betLevelList[curBetLevel].split(',');

        dsz_send_msg.sendNormalOp(parseInt(betInfo[1] - betNowInfo[1]), cc.dd.user.id, 2);
    },

    /**
     * 弃牌
     */
    foldCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.enabelAllBtn(false);

        dsz_send_msg.sendNormalOp(0, cc.dd.user.id, 3);
    },

    /**
     * 比牌
     */
    compareBtnCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.enabelAllBtn(false);

        deskEd.notifyEvent(deskEvent.DSZ_DEDSK_COMPARE);
    },

    /**
     * 火拼
     */
    fireBtnCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.enabelAllBtn(false);

        //deskEd.notifyEvent(deskEvent.DSZ_DEDSK_COMPARE, msg.userId);
        dsz_send_msg.sendFire(cc.dd.user.id);
    },

    /**
     * 孤注一掷
     */
    allInCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.enabelAllBtn(false);

        dsz_send_msg.sendAllIn();
    },

    /**
     * 自动跟注
     */
    callAutoCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.m_bCallAuto = true;
        this.m_bFoldAuto = false;
        this.showAutoOpBtn();
    },

    /**
     * 自动弃牌
     */
    foldAutoCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.m_bFoldAuto = true;
        this.m_bCallAuto = false;
        this.showAutoOpBtn();
    },

    /**
     * 取消自动跟注
     */
    stopCallAutoCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        var node = cc.find(this.btnName[10], this.node);
        node.getChildByName('anim').getComponent(cc.Animation).stop();
        this.node.stopAllActions();
        this.m_bCallAuto = false;
        if(cc.dd.user.id == deskData.getCurOpUser()){
            if(this.m_bFriend)
                this.analysisPycPlayerOpBtn();
            else
                this.analysisJbcPlayerOpBtn();
        }else
            this.showAutoOpBtn();    
    },

    /**
     * 取消自动弃牌
     */
    stopFoldAutoCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        var node = cc.find(this.btnName[11], this.node);
        node.getChildByName('anim').getComponent(cc.Animation).stop();
        this.node.stopAllActions();
        this.m_bFoldAuto = false;
        if(cc.dd.user.id == deskData.getCurOpUser()){
            if(this.m_bFriend)
                this.analysisPycPlayerOpBtn();
            else
                this.analysisJbcPlayerOpBtn();
        }else
            this.showAutoOpBtn();    },

    /**
     * 换桌
     */
    changeCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        dsz_send_msg.sendReplaceDesktop(135, deskData.getCoinRoomId());
        cc.find(this.btnName[12], this.node).active = false;
        cc.find(this.btnName[12], this.node).getComponent(cc.Button).interactable = false;
        cc.find(this.btnName[12], this.node).getChildByName('coverTouch').getComponent(cc.Button).interactable = false;
        this.m_bTimeer = true;
        this.cd_time = setTimeout(function(){
            cc.find(this.btnName[12], this.node).active = true;
            cc.find(this.btnName[12], this.node).getComponent(cc.Button).interactable = true;
            cc.find(this.btnName[12], this.node).getChildByName('coverTouch').getComponent(cc.Button).interactable = true;
            this.m_bTimeer = false;
            clearTimeout(this.cd_time);
        }.bind(this), 4000);
    },

    //转换筹码字
    convertChipNum: function(num){
        var str = num;
        if(num >= 1000 && num < 10000){
            str = Math.ceil(num / 1000) + '千';
        }else if(num >= 10000 && num < 100000000)
            str = Math.ceil(num / 10000) + '万';
        else if(num >= 100000000)
            str = Math.ceil(num / 100000000) + '亿';
        return str 
    },
});
