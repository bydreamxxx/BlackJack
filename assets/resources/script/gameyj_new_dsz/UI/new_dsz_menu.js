// create by wj 2019/04/04
var deskData = require('new_dsz_desk').New_DSZ_Desk_Data.Instance();
var playerMgr = require('new_dsz_player_manager').New_DSZ_PlayerMgr.Instance();
var dsz_send_msg = require('new_dsz_send_msg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var deskEd = require('new_dsz_desk').New_DSZ_Desk_Ed;
var deskEvent = require('new_dsz_desk').New_DSZ_Desk_Event;

cc.Class({
    extends: cc.Component,
    properties: {
        //m_tBtnVec:{default: [], type: cc.Node, tooltip: '斗三张操作按钮'},
        m_bCallAuto: false,
        m_bFoldAuto: false,
        m_bFriend: false,
        m_oOpAtals: cc.SpriteAtlas,
        m_tPanel: {default: [], type: cc.Node, tooltip: '按钮panel'},
        m_sPath: '',
    },

    ctor: function(){
        this.btnName = [
            'foldBtn',
            'compareBtn',
            'addBtn',
            'followBtn',
            'followLastBtn',
        ];

        this.btnTag = {
            qipai: 0, //弃牌
            bipai: 1, //比牌
            jiazhu: 2,//加注
            genzhu: 3,//跟注
            genzhuAuto: 4,//跟到底
            stopgenzhuAuto: 5, //取消跟到底
        };

        this.spriteName = [
            ['dsz_qipai_zi01', 'dsz_qipai_zi02'],
            ['dsz_bipai_zi01', 'dsz_bipai_zi02'],
            ['dsz_jiazhu_zi01', 'dsz_jiazhu_zi02'],
            ['dsz_genzhu_zi01', 'dsz_genzhu_zi02'],
        ]
    },

    setPath: function(ntype){
        this.m_sPath = ntype == 1 ?  'opBtnPanel_Six/' : 'opBtnPanel_Nine/';
    },
    setGenZhuNum: function(isShow){
        var callBtn =  cc.find(this.m_sPath + this.btnName[this.btnTag.genzhu], this.node);
        var callDesc = callBtn.getChildByName('callBg');
        callDesc.active = isShow;
        if(isShow){
            var curBetLevel = deskData.getCurBetLevel();
            //获取自己的游戏数据
            if(playerMgr.findPlayerByUserId(cc.dd.user.id)){
                var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
                if(player){
                    var ownData = player.getPlayerGameInfo();
                    if(ownData){
                        //获取下注档次数据
                            var betLevelList = [];
                            var config_data = deskData.getConfigData();

                            if(ownData.pokersState == 0){//未看牌
                                betLevelList = config_data.anzhu.split(';')
                            }else{
                                betLevelList = config_data.mingzhu.split(';')
                            }
                            var nowBetInfo = betLevelList[curBetLevel - 1].split(',');

                            callDesc.getChildByName('num').getComponent(cc.Label).string =  parseInt(nowBetInfo[1]) > 10000 ? this.convertChipNum(parseInt(nowBetInfo[1])) : parseInt(nowBetInfo[1]);
                    }
                }
            }
        }
    },

    //按钮解析
    analysisPlayerOpBtn: function(){
        this.enabelAllBtn(true);

        if(this.m_bCallAuto){//自动跟注
            this.node.stopAllActions();
            // if(this._callback_id)
            //     clearTimeout(this._callback_id);
            this.node.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(function(){
                this.callBtnCallBack();
            }.bind(this))));
            return;
        }
        //跟注按钮常显
        var callBtn = cc.find(this.m_sPath + this.btnName[this.btnTag.genzhu], this.node);
        if(callBtn){
            callBtn.active = true;
            this.setGenZhuNum(true);
        }
        //弃牌常显
        var foldBtn = cc.find(this.m_sPath + this.btnName[this.btnTag.qipai], this.node);
        if(foldBtn)
            foldBtn.active = true;
        
        //加注按钮/直封 显示判定
        var config_data = deskData.getConfigData();
        if(config_data){
            var curBetLevel = deskData.getCurBetLevel();
            //获取自己的游戏数据
            var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
            if(player){
                var ownData = player.getPlayerGameInfo();
                if(ownData){
                    //获取下注档次数据
                    var betLevelList = [];
                    if(ownData.pokersState == 0){//未看牌
                        betLevelList = config_data.anzhu.split(';')
                    }else{
                        betLevelList = config_data.mingzhu.split(';')
                    }


                    //加注按钮
                    var advanceBtn0 = cc.find(this.m_sPath +this.btnName[this.btnTag.jiazhu], this.node);
                    advanceBtn0.active = true;
                    if(curBetLevel >= betLevelList.length){//达到最大档次
                        advanceBtn0.getComponent(cc.Button).interactable = false;
                        var descSp = advanceBtn0.getChildByName('descSp').getComponent(cc.Sprite);
                        descSp.spriteFrame = this.m_oOpAtals.getSpriteFrame(this.spriteName[this.btnTag.jiazhu][1]);    
            
                    }else{//可以继续加注
                        for(var i = 0; i < 4; i++){
                            var btnNode = this.m_tPanel[1].getChildByName('addBtn' + (i+1));
                            var numtext = btnNode.getChildByName('num');
                            numtext.getComponent(cc.Label).string = this.convertChipNum(betLevelList[i+1].split(',')[1]);

                            if(curBetLevel - 1 >= i + 1)
                                btnNode.getComponent(cc.Button).interactable = false;
                            else
                                btnNode.getComponent(cc.Button).interactable = true;
                        }
                    }
                }
            }
        }

        //比牌按钮判定
        var compBtn = cc.find(this.m_sPath +this.btnName[this.btnTag.bipai], this.node);
        if(compBtn){
                compBtn.active = true;

            if(deskData.checkGameIsFriendType() || deskData.checkGameIsCoinCreateType()){//自建房有必闷三轮选项
                var ruleList = deskData.getPlayRule(); //获取游戏规则
                var bWatchLimit = false;
                ruleList.forEach(function(rule){
                    if(rule == 1)
                        bWatchLimit = true;
                })

                if(bWatchLimit && deskData.getCurCircle() < 3){//必须闷三轮
                    compBtn.getComponent(cc.Button).interactable = false;
                    var descSp = compBtn.getChildByName('descSp').getComponent(cc.Sprite);
                    descSp.spriteFrame = this.m_oOpAtals.getSpriteFrame(this.spriteName[this.btnTag.bipai][1]);    

                }else if(bWatchLimit && deskData.getCurCircle() >= 3){//必闷三轮可比牌
                    compBtn.getComponent(cc.Button).interactable = true;
                    var descSp = compBtn.getChildByName('descSp').getComponent(cc.Sprite);
                    descSp.spriteFrame = this.m_oOpAtals.getSpriteFrame(this.spriteName[this.btnTag.bipai][0]);  
                }else{
                    if(deskData.getConfigData().limit_cmp > deskData.getCurCircle()){ //根据配置显示比牌按钮功能
                        compBtn.getComponent(cc.Button).interactable = false;
                        var descSp = compBtn.getChildByName('descSp').getComponent(cc.Sprite);
                        descSp.spriteFrame = this.m_oOpAtals.getSpriteFrame(this.spriteName[this.btnTag.bipai][1]);  
                    }else{
                        compBtn.getComponent(cc.Button).interactable = true;
                        var descSp = compBtn.getChildByName('descSp').getComponent(cc.Sprite);
                        descSp.spriteFrame = this.m_oOpAtals.getSpriteFrame(this.spriteName[this.btnTag.bipai][0]);  
                    }
                }
            }else{//金币场有比牌轮数限制
                if(deskData.getConfigData().limit_cmp > deskData.getCurCircle()){ //根据配置显示比牌按钮功能
                    compBtn.getComponent(cc.Button).interactable = false;
                    var descSp = compBtn.getChildByName('descSp').getComponent(cc.Sprite);
                    descSp.spriteFrame = this.m_oOpAtals.getSpriteFrame(this.spriteName[this.btnTag.bipai][1]);  
                }else{
                    compBtn.getComponent(cc.Button).interactable = true;
                    var descSp = compBtn.getChildByName('descSp').getComponent(cc.Sprite);
                    descSp.spriteFrame = this.m_oOpAtals.getSpriteFrame(this.spriteName[this.btnTag.bipai][0]);  
                }
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
        for(var i = 0; i < 4; i++)
            cc.find(this.m_sPath +this.btnName[i], this.node).active = false; //先将所有按钮屏蔽
    },

    //是否启用按钮
    enabelAllBtn: function(enabled){
        this.m_tPanel[0].active = true;
        this.m_tPanel[1].active = false;

        this.setGenZhuNum(enabled);
        var foldBtn = cc.find(this.m_sPath +this.btnName[0], this.node);
        foldBtn.active = true;
        foldBtn.getComponent(cc.Button).interactable = true;

        for(var i = 1; i < 4; i++){
            var btn = cc.find(this.m_sPath +this.btnName[i], this.node);
            btn.active = true;
            btn.getComponent(cc.Button).interactable = enabled;

            var descSp = btn.getChildByName('descSp').getComponent(cc.Sprite);
            var index = enabled == true ? 0 : 1
            descSp.spriteFrame = this.m_oOpAtals.getSpriteFrame(this.spriteName[i][index]);    
        }
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
    //快速充值接口
    sendQuickRecharge: function(){
        dsz_send_msg.sendQuickRecharge();
        cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_quick_recharge', function (ui) {
        });
    },

    /**
     * 跟注
     */
    callBtnCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        //获取下注档次数据
        var betLevelList = [];
        //获取自己的游戏数据
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if(player){
            var ownData = player.getPlayerGameInfo();
            if(ownData){
                var config_data = deskData.getConfigData();

                if(ownData.pokersState == 0){//未看牌
                    betLevelList = config_data.anzhu.split(';')
                }else{
                    betLevelList = config_data.mingzhu.split(';')
                }
                var curBetLevel = deskData.getCurBetLevel() - 1;//当前下注档位
                var betInfo = betLevelList[curBetLevel].split(',');

                if(!deskData.checkGameIsFriendType()){
                    if(betInfo[1] <= ownData.curScore)
                        dsz_send_msg.sendNormalOp(parseInt(betInfo[1]), cc.dd.user.id, 1);
                    else{
                        cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                            var cpt = prefab.getComponent('new_dsz_dialog_box');
                            if(cpt)
                                cpt.show(0, '您的金币不足，是否立刻充值？', 'text33', 'Cancel', this.sendQuickRecharge, null);
                        }.bind(this));
                    }
                }else
                    dsz_send_msg.sendNormalOp(parseInt(betInfo[1]), cc.dd.user.id, 1);
            }
        }
    },

    /**
     * 加注
     */
    advanceBtnCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();

        var index = parseInt(data) + 1;
        //获取下注档次数据
        var betLevelList = [];
        //获取自己的游戏数据
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if(player){
            var ownData = player.getPlayerGameInfo();
            if(ownData){
                var config_data = deskData.getConfigData();

                if(ownData.pokersState == 0){//未看牌
                    betLevelList = config_data.anzhu.split(';')
                }else{
                    betLevelList = config_data.mingzhu.split(';')
                }
                var curBetLevel = deskData.getCurBetLevel() - 1;//当前下注档位
                var betInfo = betLevelList[index].split(',');
                var betNowInfo = betLevelList[curBetLevel].split(',');
                if(!deskData.checkGameIsFriendType()){
                    if(betInfo[1] - betNowInfo[1] <= ownData.curScore)
                        dsz_send_msg.sendNormalOp(parseInt(betInfo[1] - betNowInfo[1]), cc.dd.user.id, 2);
                    else{
                        cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                            var cpt = prefab.getComponent('new_dsz_dialog_box');
                            if(cpt)
                                cpt.show(0, '您的金币不足，是否立刻充值？', 'text33', 'Cancel', this.sendQuickRecharge, null);
                        }.bind(this));
                    }
                }else{
                    dsz_send_msg.sendNormalOp(parseInt(betInfo[1] - betNowInfo[1]), cc.dd.user.id, 2);
                }
            }
        }
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
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if(player){
            var ownData = player.getPlayerGameInfo();
            if(ownData){
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
            }
        }
    },

    /**
     * 弃牌
     */
    foldCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.hideAllBtn();

        dsz_send_msg.sendNormalOp(0, cc.dd.user.id, 3);
    },

    /**
     * 比牌
     */
    compareBtnCallBack: function(event, data){
        hall_audio_mgr.com_btn_click();
        //this.enabelAllBtn(true);
        var btn = cc.find(this.m_sPath +this.btnName[this.btnTag.bipai], this.node);
        btn.active = true;

        //获取下注档次数据
        var betLevelList = [];
        //获取自己的游戏数据
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if(player){
            var ownData = player.getPlayerGameInfo();
            if(ownData){
                var config_data = deskData.getConfigData();

                if(ownData.pokersState == 0){//未看牌
                    betLevelList = config_data.anzhu.split(';')
                }else{
                    betLevelList = config_data.mingzhu.split(';')
                }
                var curBetLevel = deskData.getCurBetLevel() - 1;//当前下注档位
                var betInfo = betLevelList[curBetLevel].split(',');
                if(!deskData.checkGameIsFriendType()){
                    var compPay = deskData.getDoubleCompare() ? betInfo[1] * 2 : betInfo[1];
                    if(compPay <= ownData.curScore)
                        deskEd.notifyEvent(deskEvent.New_DSZ_DEDSK_COMPARE);
                    else{
                        cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                            var cpt = prefab.getComponent('new_dsz_dialog_box');
                            if(cpt)
                                cpt.show(0, '您的金币不足，是否立刻充值？', 'text33', 'Cancel', this.sendQuickRecharge, null);
                        }.bind(this));
                    }
                }else{
                    btn.getComponent(cc.Button).interactable = false;

                    var descSp = btn.getChildByName('descSp').getComponent(cc.Sprite);
                    descSp.spriteFrame = this.m_oOpAtals.getSpriteFrame(this.spriteName[this.btnTag.bipai][1]);  
            
                    deskEd.notifyEvent(deskEvent.New_DSZ_DEDSK_COMPARE);
                }
            }
        }
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

    /**
     * 准备 
     */
    onClickPrepare: function(event, data){
        hall_audio_mgr.com_btn_click();

        var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(deskData.getGameId());
        if(deskData.getGameId() == 136)
            gameInfoPB.setRoomId(deskData.getCoinRoomId());
        else
            gameInfoPB.setRoomId(deskData.getRoomId());
        pbData.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, pbData, "msg_prepare_game_req", true);

        deskEd.notifyEvent(deskEvent.New_DSZ_RESETPLAYERUI);

    },

    //再次准备/开始游戏
    onClickReReady: function(event, data){
        hall_audio_mgr.com_btn_click();

        const req = new cc.pb.room_mgr.room_prepare_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_prepare_req, req,
            'room_prepare_req', true);

        deskEd.notifyEvent(deskEvent.New_DSZ_RESETPLAYERUI);
    },

    //显示加注选项
    onClickShowAdd: function(event, data){
        this.m_tPanel[0].active = !this.m_tPanel[0].active;
        this.m_tPanel[1].active = !this.m_tPanel[1].active;
    },

    //转换筹码字
    convertChipNum: function(num){
        var str = num;
        if(num >= 1000 && num < 10000){
            var num_0 = (num / 1000).toFixed(1) * 10;
            if(num_0 % 10 != 0)
                str =  (num / 1000).toFixed(1) + '千';
            else
                str = Math.ceil(num / 1000) + '千';
        }else if(num >= 10000 && num < 100000000){
            var num_0 = (num / 10000).toFixed(1) * 10;
            if(num_0 % 10 != 0)
                str =  (num / 10000).toFixed(1) + '万';
            else
                str = Math.ceil(num / 10000) + '万';
        }else if(num >= 100000000){
            var num_0 = (num / 100000000).toFixed(1) * 10;
            if(num_0 % 10 != 0)
                str =  (num / 100000000).toFixed(1) + '亿';
            else
                str = Math.ceil(num / 100000000) + '亿';
        }
        return str 
    },
});
