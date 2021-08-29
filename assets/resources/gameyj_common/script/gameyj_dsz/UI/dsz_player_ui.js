// create by wj 201/10/17
var deskData = require('dsz_desk_data').DSZ_Desk_Data.Instance();
const config_data = require('dsz_config').DSZ_UserState;
var dsz_send_msg = require('dsz_send_msg');

cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerData: null,
        m_oPokerInfo : [],
        //atlas: cc.SpriteAtlas,
        playerStateAtlas: cc.SpriteAtlas,
        opSatatePrefabe: cc.Prefab,
        pokerAtlas: cc.SpriteAtlas,
        dragonBonesNode: sp.Skeleton,
        m_oFireAct: cc.Animation,
        emoji_node: cc.Node,
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', },
    },

    ctor: function(){
        this.typeName = [
            'teshu',
            'danzhang',
            'duizi',
            'shunzi',
            'jinhua',
            'shunjin',
            'baozi',
        ];
    },

    onLoad:function () {
        this.chipBg = cc.dd.Utils.seekNodeByName(this.node, "chipBg");
        //下注
        this.m_oBetTxt = cc.dd.Utils.seekNodeByName(this.node, "chip_count").getComponent(cc.Label); 
         //庄家标记
         this.m_oBankerTag = cc.dd.Utils.seekNodeByName(this.node, "zhuang_tag");
         //牌描述
         this.m_oDescBg = cc.dd.Utils.seekNodeByName(this.node, "desc_bg");
         //点击看牌描述
         this.m_oWatchDescBg = cc.dd.Utils.seekNodeByName(this.node, "kan_pai_desc");
         //状态
         this.m_oStateSp = cc.dd.Utils.seekNodeByName(this.node, "state");
         //对话框
         this.m_oDuanyuNode = cc.dd.Utils.seekNodeByName(this.node, "duanyu_bg");
         this.m_oDuanyuTxt = cc.dd.Utils.seekNodeByName(this.node, "duanyu").getComponent(cc.Label);
         //牌数据
         var pokerNode = cc.dd.Utils.seekNodeByName(this.node, "pokerNode");
         pokerNode.active = false;

         this.loseNode = cc.dd.Utils.seekNodeByName(this.node, "loseCover");
 
         for(var i = 0; i < 3; i++){
             this.m_oPokerInfo[i] = cc.dd.Utils.seekNodeByName(this.node, "dsz_poker_" + i)//.getComponent('');
         }
         //玩家身上筹码值
         this.m_oplayerCoinTxt = cc.dd.Utils.seekNodeByName(this.node, "coin").getComponent(cc.Label);
         //看牌按钮
         this.m_oWatchBtn = cc.dd.Utils.seekNodeByName(this.node, "watchTouch").getComponent(cc.Button);
    },
    //绑定玩家数据
    setPlayerData: function(playerData){
        this.m_tPlayerData = playerData;
        if(playerData.userState == config_data.UserStateWait)
            return;

        if(playerData.isBanker) //庄家标记
            this.m_oBankerTag.active = true;
        this.freshPlayerChip();
    },


    //可看牌描述
    showWatchPokerDesc: function(){
        if(this.m_tPlayerData == null)
            return;
        var playerData = this.m_tPlayerData;
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        if(cc.dd.user.id == playerData.userId){//如果设置数据为玩家自身
            if(playerData.pokersState == 0 && playerData.userState != config_data.UserStateLost){//未看牌
                this.m_oWatchDescBg.active = false;
                this.showPokerBack();
                this.dragonBonesNode.node.active = false;
                this.m_oDescBg.active = true;
                var isBanker = playerData.isBanker;

                if(cc.dd.AppCfg.GAME_ID != 135){//朋友场
                    if(!isBanker && roomMgr._Rule.limitRule == 1 && (deskData.getCurCircle() < roomMgr._Rule.limitWatch)){//根据轮来控制看牌,未达到看牌轮数
                        var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
                        if(descTxt){
                            descTxt.active = true;
                            descTxt.getComponent(cc.Label).string = '第' + roomMgr._Rule.limitWatch + '轮可以看牌';
                        }
                        this.m_oWatchBtn.interactable = false;
                    }else if(!isBanker && roomMgr._Rule.limitRule == 1 && (deskData.getCurCircle() >= roomMgr._Rule.limitWatch)){//根据轮来控制看牌,以达到看牌轮数
                        this.m_oWatchDescBg.active = true;
                        this.m_oStateSp.active = false;
                        var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
                        if(descTxt)
                            descTxt.active = false;
                        this.m_oWatchBtn.interactable = true;
                    }else if(isBanker && roomMgr._Rule.limitRule == 1 && (deskData.getCurCircle() < (roomMgr._Rule.limitWatch -1 ))){//根据轮来控制看牌,未达到看牌轮数
                        var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
                        if(descTxt){
                            descTxt.active = true;
                            descTxt.getComponent(cc.Label).string = '第' + (roomMgr._Rule.limitWatch -1) + '轮可以看牌';
                        }
                        this.m_oWatchBtn.interactable = false;
                    }else if(isBanker && roomMgr._Rule.limitRule == 1 && (deskData.getCurCircle() >= (roomMgr._Rule.limitWatch - 1))){//根据轮来控制看牌,以达到看牌轮数
                        this.m_oWatchDescBg.active = true;
                        this.m_oStateSp.active = false;
                        var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
                        if(descTxt)
                            descTxt.active = false;
                        this.m_oWatchBtn.interactable = true;
                    }else if(roomMgr._Rule.limitRule == 2 && (deskData.getCurBet() < roomMgr._Rule.limitWatch)){//根据分数来控制看牌,未达到看牌分数
                        var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
                        if(descTxt){
                            descTxt.active = true;
                            descTxt.getComponent(cc.Label).string = '达到' + roomMgr._Rule.limitWatch + '分可以看牌';
                        }
                        this.m_oWatchBtn.interactable = false;
                    }else if(roomMgr._Rule.limitRule == 2 && (deskData.getCurBet() >= roomMgr._Rule.limitWatch)){//根据分数来控制看牌,已达到看牌分数
                        this.m_oWatchDescBg.active = true;
                        this.m_oStateSp.active = false;
                        var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
                        if(descTxt)
                            descTxt.active = false;
                        this.m_oWatchBtn.interactable = true;
                    }
                }else{//金币场
                    var config_Info_data = deskData.getConfigData();
                    if(config_Info_data){
                        if( !isBanker &&  deskData.getCurCircle() < config_Info_data.limit_watch){//根据轮来控制看牌,未达到看牌轮数
                            var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
                            if(descTxt){
                                descTxt.active = true;
                                descTxt.getComponent(cc.Label).string = '第' + config_Info_data.limit_watch + '轮可以看牌';
                            }
                            this.m_oWatchBtn.interactable = false;
                        }else if(isBanker &&  deskData.getCurCircle() < (config_Info_data.limit_watch - 1)){//根据轮来控制看牌,未达到看牌轮数
                            var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
                            if(descTxt){
                                descTxt.active = true;
                                descTxt.getComponent(cc.Label).string = '第' + (config_Info_data.limit_watch - 1) + '轮可以看牌';
                            }
                            this.m_oWatchBtn.interactable = false;
                        }else {//根据轮来控制看牌,以达到看牌轮数
                            this.m_oWatchDescBg.active = true;
                            var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
                            if(descTxt)
                                descTxt.active = false;
                            this.m_oWatchBtn.interactable = true;

                            }
                    }
                }
            }
        }
    },


    //初始玩家数据信息
    initData: function(playerData){
        this.setPlayerData(playerData);
        if(playerData.userState == config_data.UserStateWait)
            return;
        //已下注
        this.m_oBetTxt.string = this.convertChipNum(parseInt(playerData.curBetScore));
        // //庄家标记
        // if(playerData.isBanker)
        //     this.m_oBankerTag.active = true;
        this.loseNode.active = false;
        if(cc.dd.user.id == playerData.userId){//如果设置数据为玩家自身
            if(playerData.pokersState == 0){//未看牌
                this.showWatchPokerDesc();
            }else if(playerData.pokersState == 1){//已看牌
                this.showPokerFace();
            }else if(playerData.userState == config_data.UserStateLost){//玩家比牌输掉
                this.m_oStateSp.active = true;
                var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
                stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame('state_' + 3);
            }else if(playerData.pokersState == 2){//弃牌
                this.m_oStateSp.active = true;
                var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
                stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame('state_' + 1);
            }
        }else{//设置数据为其他玩家
            this.showPokerBack();
            this.m_oStateSp.active = false;
            var spName = '';
            if(playerData.pokersState == 1){//已看牌
                spName = 'state_' + 2;
                this.m_oStateSp.active = true;
            }else if(playerData.pokersState == 2){//弃牌
                spName = 'state_' + 1;
                this.m_oStateSp.active = true;
            }else if(playerData.userState == config_data.UserStateLost){//输掉
                spName = 'state_' + 3;
                this.m_oStateSp.active = true;
            }
            var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
            stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame(spName);

            this.m_oDescBg.active = false;
        }
    },

    //刷新玩家下注额/身上分值
    freshPlayerChip: function(){
        this.chipBg.active = true;
        this.m_oBetTxt.string = this.convertChipNum(parseInt(this.m_tPlayerData.betScore)); //设置玩家下注筹码
        this.m_oplayerCoinTxt.string = this.convertChipNum(parseInt(this.m_tPlayerData.curScore)); //玩家身上筹码值
    }, 

    //检测玩家是否为庄家
    checkPlayerIsBanker: function(){
        return this.m_tPlayerData.isBanker;
    },

    //玩家状态
    setPlayerState: function(state, isNeed){
        
        if(state){ 
            var pb = this.node.getChildByName('headbg').getChildByName('operatepb');
            pb.active = true;
            if(isNeed)
                pb.getComponent('dsz_progressBar').playTimer(8, null, 8);
            else
                pb.getComponent('dsz_progressBar').playTimerLoop(9);
        }else{
            var pb = this.node.getChildByName('headbg').getChildByName('operatepb');
            pb.active = false;
            pb.getComponent('dsz_progressBar').stopTimer();
        }
    },

    //玩家的牌状态
    setPlayerPokerState: function(state){
        this.m_oWatchDescBg.active = false;
        this.m_oDescBg.active = true;

        var spName = 'state_' + state
        this.m_oStateSp.active = true;
        var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
        stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame(spName);
        if(state == 3)
            this.loseNode.active = true;
    },


    //比牌
    canSelectCmp: function(state){
        var selectTag = cc.dd.Utils.seekNodeByName(this.node, 'select');
        if(selectTag)
            selectTag.active = state;
        var touchBtn = cc.dd.Utils.seekNodeByName(this.node, 'touchBtn');
        if(touchBtn)
            touchBtn.active = !state
    },

    //弃牌
    fold: function(){
        this.m_oStateSp.active = true;
        var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
        stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame('state_1');//设置弃牌文字
        
        this.m_oDescBg.active = true;//隐藏牌类型
        this.m_oWatchDescBg.active = false;
        var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
        if(descTxt)
            descTxt.active = false;
        this.loseNode.active = true;

        this.showPokerBack();//盖牌
    },

    //回放中弃牌
    foldRecord: function(){
        this.m_oStateSp.active = true;
        var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
        stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame('state_1');//设置弃牌文字
        
        this.m_oDescBg.active = true;//隐藏牌类型
        this.m_oWatchDescBg.active = false;
        var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
        if(descTxt)
            descTxt.active = false;
        this.loseNode.active = true;
    },

    //看牌
    watch: function(){
        this.m_oDescBg.active = false;
        this.m_oWatchDescBg.active = false;
        var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
        if(descTxt)
            descTxt.active = false;
        //this.m_oDescBg.active = false;
        this.m_oWatchBtn.interactable = false;

        this.showPokerFace();
    },

    watchRecord: function(){
        cc.dd.Utils.seekNodeByName(this.node, 'watch_record').active = true;
    },

    //发牌
    sendPoker: function(){
        //动画
        var pokerNode = cc.dd.Utils.seekNodeByName(this.node, "pokerNode");
        pokerNode.active = true;
        var anim = pokerNode.getComponent(cc.Animation);
        anim.play();
    },

    sendPokerRecord: function(){
        this.sendPoker();
        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
            this.showPokerFace();
        }.bind(this))));
    },

    //设置火拼动画
    setFireState: function(){
        this.m_oFireAct.node.active = true;
        this.m_oFireAct.play();
    },

    //显示玩家在线状态
    showOffline: function(isOffline){
        var node = cc.dd.Utils.seekNodeByName(this.node, "offline");
        if(node)
            node.active = isOffline;
    },

    //显示牌面
    showPokerFace: function(){
        if(this.m_tPlayerData.pokers == null || this.m_tPlayerData.pokers.pokersList.length == 0)
            return;
        cc.dd.Utils.seekNodeByName(this.node, 'pokerNode').active = true;
        this.m_tPlayerData.pokers.pokersList.forEach(function(poker, index) {
            var node = cc.dd.Utils.seekNodeByName(this.node, "dsz_poker_" + index);
            this.setPoker(node, poker);
        }.bind(this));

        this.m_oDescBg.active = false;
        var typeIndex = this.m_tPlayerData.pokers.type - 1;
        this.dragonBonesNode.node.active = true;
        this.dragonBonesNode.clearTracks();
        this.dragonBonesNode.setAnimation(0,this.typeName[typeIndex],false,)


        // var pokerTypeSp = this.m_oDescBg.getChildByName('pai_desc');
        // if(pokerTypeSp){
        //     pokerTypeSp.active = true;
        //     pokerTypeSp.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('dsz_paixing_zi' + this.m_tPlayerData.pokers.type); //从图集中获取图片设置
        // }
    },

    //盖牌
    showPokerBack: function(){
        this.dragonBonesNode.node.active = false;
        //cc.dd.Utils.seekNodeByName(this.node, 'pokerNode').active = true;
        for(var i = 0; i < 3; i++){
            var node = cc.dd.Utils.seekNodeByName(this.node, "dsz_poker_" + i);
            node.getChildByName('beimian').active = true;
        }
    },

    //显示牌
    showPoker: function(){
        var pokerNode = cc.dd.Utils.seekNodeByName(this.node, "pokerNode");
        pokerNode.active = true;
    },

    showResut: function(score){
        this.setPlayerState(false);
        var scoreNode = null;
        var descNode = cc.dd.Utils.seekNodeByName(this.node, "win_desc");
        if(score > 0) {  
            scoreNode = cc.dd.Utils.seekNodeByName(this.node, "score_win");
            scoreNode.getComponent(cc.Label).string = ':' + score;
            descNode.active = true;
            if(this.m_tPlayerData.userId != cc.dd.user.id){
                var seq = cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5));
                descNode.runAction(cc.repeatForever(seq));
            }
        }
        else{
            scoreNode = cc.dd.Utils.seekNodeByName(this.node, "score_fail");
            scoreNode.getComponent(cc.Label).string = ':' + (-score);
        }

        scoreNode.active = true;
        var origin_x = scoreNode.x;
        var origin_y = scoreNode.y;
        scoreNode.runAction(cc.sequence(cc.moveTo(0.6, cc.v2(origin_x, origin_y + 50)), cc.delayTime(0.3), cc.callFunc(function () { //飘字动画
            scoreNode.active = false;
            scoreNode.setPosition(cc.v2(origin_x, origin_y));
            descNode.active = false;
        })));

    },

    //结算界面
    setResult: function(score){
        var gc_id = setTimeout(function(){
            this.showResut(score);
            clearTimeout(gc_id);
        }.bind(this), 1000);
    },

    //具体的牌数据设置
    setPoker(node, cardValue) {
        var value = Math.floor(cardValue % 100); //点数
        var flower =  5 - Math.floor(cardValue / 100); //花色
        var hua_xiao = node.getChildByName('hua_xiao');
        var hua_da = node.getChildByName('hua_da');
        var num = node.getChildByName('num');
        node.getChildByName('beimian').active = false;

        if(value == 2) value = 16;
        if (flower % 2 == 0) {
            num.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_r' + value.toString());
        }
        else {
            num.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_b' + value.toString());
        }
        hua_da.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('hs_' + flower.toString());
        hua_xiao.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('hs_' + flower.toString());
        hua_xiao.active = true;
    },

    //操作文字
    doSpeak: function(text, state){
        this.m_oDuanyuNode.active = true;
        var ani = this.m_oDuanyuNode.getComponent(cc.Animation);
        ani.play();
        this.m_oDuanyuTxt.string = text;
        if(state == config_data.UserStateTry)
            this.m_oDuanyuTxt.fontSize = 20;
        else
            this.m_oDuanyuTxt.fontSize = 28;
    },

    /**
     * 播放表情
     */
    showEmoji: function (id) {
        this.emoji_node.active = true;
        this.emoji_node.getComponent(cc.Animation).play("em" + (id - 1));
        this.scheduleOnce(function () {
            this.emoji_node.active = false;
        }.bind(this), 3);
    },

    /**
     * 播放短语
     */
    showChat: function (str) {
        var chat_node = cc.find('chat', this.node);
        var lbl = chat_node.getChildByName('lbl');
        lbl.getComponent(cc.Label).string = str;
        chat_node.width = lbl.width + 30;
        chat_node.getComponent(cc.Animation).play();
    },

    /**
     * 语音聊天
     */
    play_yuyin: function (duration) {
        this.yuyin_laba.node.active = true;
        this.yuyin_laba.setYuYinSize(duration);
        setTimeout(function () {
            this.yuyin_laba.node.active = false;
        }.bind(this), duration * 1000);
    },

    /**
     * 语音
     */
    showYuYing: function (bl) {
        this.yuyin_laba.node.active = bl;
        this.yuyin_laba.yuyin_size.node.active = false;
    },

    //重置
    resetPlayerUI: function(){
        this.loseNode.active = false;
        this.chipBg.active = false;
        this.m_oBankerTag.active = false;
        this.m_oWatchDescBg.active = false;
        this.m_oStateSp.active = false;
        this.m_oFireAct.node.active = false;
        this.dragonBonesNode.node.active = false;
        this.m_oDescBg.active = false;
        this.m_oDuanyuNode.active = false;
        var descNode = cc.dd.Utils.seekNodeByName(this.node, "win_desc");
        descNode.active = false;
        var recordWatch = cc.dd.Utils.seekNodeByName(this.node, 'watch_record')
        if(recordWatch)
            recordWatch.active = false;

        for(var i = 0; i < 3; i++){
            var node = cc.dd.Utils.seekNodeByName(this.node, "dsz_poker_" + i);
            node.getChildByName('beimian').active = true;
        }
        this.m_oWatchBtn.interactable = false;
        cc.dd.Utils.seekNodeByName(this.node, "pokerNode").active = false;
        this.showOffline(false);
    },

    //清除玩家数据
    clearUI: function(){
        this.resetPlayerUI();
        this.node.getChildByName('coin').getComponent(cc.Label).string = ''; //朋友场玩家进入默认为0
        
        var headNode = cc.dd.Utils.seekNodeByName(this.node, 'head'); //头像设置
        headNode.active = false;
        this.setPlayerState(false);
    },

    //清除玩家数据
    clearRecordUI: function(){
        this.resetPlayerUI();
        this.node.getChildByName('coin').getComponent(cc.Label).string = ''; //朋友场玩家进入默认为0
        
        this.setPlayerState(false);
    },


    /**
     * 发送看牌请求
     */
    sendWatchPoker: function(event, data){
        dsz_send_msg.sendWatch(this.m_tPlayerData.userId);
    },

    /**
     * 发送比牌请求
     */
    sendComp: function(event, data){
        dsz_send_msg.sendCmpOp(2, cc.dd.user.id, this.m_tPlayerData.userId);
    },

    //转换筹码字
    convertChipNum: function(num){
        var str = num;
        if(num >= 10000 && num < 100000000){
            str = (num / 10000).toFixed(2) + '万';
        }else if(num >= 100000000)
            str = Math.ceil(num / 100000000).toFixed(2) + '亿';
        return str 
    },
});
