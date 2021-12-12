/** 
 * Created by luke on 2018/12/10
*/
let com_game_head = require('com_game_head');
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
let RoomMgr = require("jlmj_room_mgr").RoomMgr;
let texas_Data = require('texas_data').texas_Data;
let hall_audio_mgr = require('hall_audio_mgr').Instance();

const CARD_TYPE_STR=[
    '',
    'gaopai',
    'yidui',
    'liangdui',
    'santiao',
    'shunzi',
    'touhua',
    'hulu',
    'sitiao',
    'tonghuashun',
    'huangjiatonghuashun',
];

const CARD_TYPE_COLOR = {
    guopai : cc.color(130,181,193),
    wait: cc.color(53,163,254),
    jiazhu: cc.color(255,142,42),
    allin:cc.color(255,147,148),
    genzhu:cc.color(145,255,121),
};

cc.Class({
    extends: com_game_head,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._cardnode = cc.find('card', this.node);
        this._cardnodeDisplay = cc.find('card_display', this.node);

        this._des = cc.find('desc', this.node).getComponent("LanguageLabel");
        this._super();
        cc.log()
    },

    //当前轮投注额
    setTurnBet(num) {
        // cc.log('setTurnBet:'+num);
        var res = cc.dd.Utils.getNumToWordTransform(num);
        // cc.log('res:'+res);
        cc.find('bet/num', this.node).getComponent(cc.Label).string = res
        //this.updateUI();
        // cc.log('bet active:',cc.find('bet', this.node).active);
        // cc.log('bet/num active:',cc.find('bet/num', this.node).active);
        
    },


    setBanker(msg,isBanker){
        var bknode = cc.find('banker', this.node)
        bknode.active = isBanker;
    },

    //显示弃牌
    showDiscard(show,isSelf) {
        if (show) {
            for(var i =0; i <= 1; i++){
                var str = "card" + i
                var card =  cc.dd.Utils.seekNodeByName(this._cardnode, str)
                if(card){
                    var pic = cc.dd.Utils.seekNodeByName(card, "dipai_1").getComponent(cc.Sprite)
                
                    var mask = cc.dd.Utils.seekNodeByName(this.node, "mask")
                    mask.active = true
                }
            }
            // cc.dd.ShaderUtil.setDarkShader(this._cardnode);//setGrayShader(this._cardnode);
            // var startNode = cc.find('card0', this._cardnode);
            // var endNode = null;
            // for (var i = 0; i < this._cardnode.children.length; i++) {
            //     if (!this._cardnode.children[i].active)
            //         break;
            //     if(isSelf)
            //     {

            //     }else{
            //         // cc.find('dipai_1/beimian',this._cardnode.children[i]).active = true;
            //     }
                
            //     //暂时不盖上弃牌
            //     endNode = this._cardnode.children[i];
            // }
            // if (!endNode) {
            //     cc.error('手牌为空,无法显示弃牌');
            //     return;
            // }
            // var x0 = startNode.convertToWorldSpaceAR(cc.v2(0, 0)).x;
            // var x1 = endNode.convertToWorldSpaceAR(cc.v2(0, 0)).x;
            // var x = (x0 + x1) / 2;
            // var xd = cc.find('discard', this.node).convertToWorldSpaceAR(cc.v2(0, 0)).x;
            // cc.find('discard', this.node).x = cc.find('discard', this.node).x + (x - xd);
            this._des.node.active = true;
            this._des.setText('fold')
            this.node.opacity = 180;
        }
        else {
            this._des.node.active = false;
            for(var i =0; i <= 1; i++){
                var str = "card" + i
                var card =  cc.dd.Utils.seekNodeByName(this._cardnode, str)
                if(card){
                    var pic = cc.dd.Utils.seekNodeByName(card, "dipai_1").getComponent(cc.Sprite)
                    var gray = cc.Material.getBuiltinMaterial('2d-sprite')
                    pic.setMaterial(0,gray)
                }
            }
            var mask = cc.dd.Utils.seekNodeByName(this.node, "mask")
            mask.active = false    

            //cc.dd.ShaderUtil.setNormalShader(this._cardnode);
            this.tryShowPlayerName();
        }
    },

    showWait(isShow)
    {
        this._des.setText('wait');
        this._des.node.active = isShow;
        var mask = cc.dd.Utils.seekNodeByName(this.node, "mask1")
        if(mask)
            mask.active = isShow
    },

    setCardSprite(sprite) {
        for (var i = 0; i < this._cardnode.children.length; i++) {
            cc.find('dipai_1/beimian',this._cardnode.children[i]).getComponent(cc.Sprite).spriteFrame = sprite;
            cc.find('pic1',this._cardnode.children[i]).getComponent(cc.Sprite).spriteFrame = sprite;
        }
    },

    showMyCardType(type)
    {
        var bg = cc.find('handType', this.node)
        if(bg && type!=null)
        {
            bg.active = true;
            cc.find('type',bg).getComponent("LanguageLabel").setText(CARD_TYPE_STR[type]);
        }
        
    },
    //参数是万分比
    showMyWinRate(rate)
    {
        if(rate == 0 || !rate)
            return;

        var lb = cc.find('handType/type', this.node)
        if(!texas_Data.Instance().haveWinRateCard()){
            if(lb)
                lb.y = 0;
            return;
        }

        cc.find('winRate',this.node).active = true;
        var winRate = cc.find('winRate/type', this.node).getComponent(cc.Label);
        if(lb)
            lb.y = 9.8;
        winRate.string = 'WinRata:'+rate/100+'%'
    },
    

    //显示牌和类型
    showCardType(pref,sp,gray,cardType) {
        this._des.node.active = false;
        cc.find('say', this.node).active = false;

        for (var i = 0; i < this._cardnode.children.length; i++) {
            cc.find('dipai_1/beimian',this._cardnode.children[i]).active = false;
        }
        // var tp = cc.find('type/type', this.node)
        var bg = cc.find('type', this.node)
        bg.getComponent("LanguageLabel").setText(sp);
        bg.active = true;

        if(gray)
        {
            bg.color = cc.color(171, 163, 163)

            // cc.dd.ShaderUtil.setDarkShader(tp);//setGrayShader(tp);
            //cc.dd.ShaderUtil.setDarkShader(bg);//setGrayShader(bg);
        }else//win
        {
            bg.color = cc.color(241, 182, 15)

            // var effct = cc.instantiate(pref);
            // if(!effct)
            // {
            //     cc.log("texas error:pref is null");
            //     return;
            // }
            // if(cardType<=6)
            // {
            //     var pic = cc.find('px/sp',effct).getComponent(cc.Sprite);
            //     pic.spriteFrame = sp;
            // }
            var winnode = cc.find('win', this.node)
            winnode.removeAllChildren(true);
            winnode.active = true;
            //winnode.addChild(effct);
            var animation = winnode.getComponent(cc.Animation);
            if(animation)
            {
                animation.play();
            }
            // cc.dd.ShaderUtil.setNormalShader(tp);
            // cc.dd.ShaderUtil.setNormalShader(bg);
        }
    },

    tryShowPlayerName()
    {
        if(!this._des.node.active && !cc.find('say', this.node).active && !cc.find('type',this.node).active)
        {
            var player = RoomMgr.Instance().player_mgr.getPlayerByViewIdx(this.view_idx);
            if(player)
            {
                this._des.setText(cc.dd.Utils.substr(player.name, 0, 4)) 
                this._des.node.active = true;
            }
        }

    },

    showDipai() {
        for (var i = 0; i < this._cardnode.children.length; i++) {
            cc.find('dipai_1/beimian',this._cardnode.children[i]).active = false;
        }
    },

    stopSay() {
        // cc.find('say/lbl', this.node).getComponent(cc.Label).string = '';
        cc.find('say', this.node).active = false;
        this.tryShowPlayerName();
        // this.node.getComponent(cc.Animation).stop();
    },

    //喊话
    say(sp) {
        this._des.node.active = false;
        cc.find('say', this.node).active = true;
        cc.find('say', this.node).getComponent(require("LanguageLabel")).setText(sp);
        cc.find("say", this.node).color = CARD_TYPE_COLOR[sp]
        this.removeWinFrame();
        // this.node.getComponent(cc.Animation).play('say');
    },


    removeWinFrame()
    {
        var winnode = cc.find('win', this.node);
        winnode.active = false;
        winnode.removeAllChildren(true);
    },

    showSofa(){
        this.resetUI()
        this.node.active = true;
        this.head.node.active = true;
        cc.find('mask/shafa', this.head.node).active = true;
        cc.find('mask/icon', this.head.node).active = false;
        this.coin.string = 0;
    },

    updateUI(){
        this._super()
        cc.find('mask/icon', this.head.node).active = true;
        cc.find('mask/shafa', this.head.node).active = false;
        var player = RoomMgr.Instance().player_mgr.getPlayerByViewIdx(this.view_idx);
        if(player){
            let coin = this.player.score != null ? this.player.score : this.player.coin;
            this.coin.string = cc.dd.Utils.getNumToWordTransform(coin);
            }
        if(RoomMgr.Instance().player_mgr && RoomMgr.Instance().player_mgr.stand && RoomMgr.Instance().player_mgr.getPlayerByViewIdx){
            if(player == null)
                this.showSofa()
        }
    },

    resetUI() {
        var player = RoomMgr.Instance().player_mgr.getPlayerByViewIdx(this.view_idx);
        if(player)
            cc.log("重置头像:"+player.userId)+",view_idx:"+this.view_idx;

        this.showDiscard(false);
        var mask = cc.dd.Utils.seekNodeByName(this.node, "mask1")
        if(mask)
            mask.active = false

        this.node.getComponent(cc.Animation).stop();
        cc.find('say', this.node).active = false;
        this.node.getComponentInChildren('texas_timer').setActive(false);
        for (var i = 0; i < this._cardnode.children.length; i++) {
            this._cardnode.children[i].stopAllActions();
            this._cardnode.children[i].active = false;
            if(this._cardnodeDisplay.children[i]){
                this._cardnodeDisplay.children[i].active = false;
                // if(player)
                //     cc.log('隐藏玩家牌:'+player.userId);
                // else
                //     cc.log('隐藏座位牌:'+this.view_idx);
            }
            cc.find('dipai_1/beimian',this._cardnode.children[i]).active = true;
        }
        // cc.find('win/card_di', this.node).getComponent(sp.Skeleton).clearTracks();
        this.removeWinFrame();
        cc.find('type', this.node).active = false;
        cc.find('score', this.node).active = false;
        cc.find('bet', this.node).active = false;
        cc.find('allin', this.node).active = false;
        cc.find('winRate',this.node).active = false;
        cc.find('banker',this.node).active = false;
        if(RoomMgr.Instance().player_mgr.stand == false)
            cc.find('mask/shafa', this.head.node).active = false;

        this.ready.active = false
        var myType = cc.find('handType', this.node)
        if(myType)
        myType.active = false
        this.setTurnBet(0);
        this.node.opacity = 255;
        // this.tryShowPlayerName();
    },

    onClickSitDown(event, data){
        hall_audio_mgr.com_btn_click();

        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(RoomMgr.Instance().gameId);
        msg.setRoomId(RoomMgr.Instance().player_mgr.getRoomId());
        var selfSeat = RoomMgr.Instance().player_mgr.selfSeat;
        if(selfSeat == 100)
            msg.setSeat(this.view_idx);
        else
            msg.setSeat((selfSeat + this.view_idx) % 9)
        msg.setDeskId(RoomMgr.Instance().deskId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },
    
    onEventMessage(event, data) {
        this._super(event, data);
        if(RoomMgr.Instance().player_mgr.stand)
            this.node.active = true;
        switch (event) {
            case RoomEvent.on_room_join:
                var player = RoomMgr.Instance().player_mgr.getPlayerByViewIdx(this.view_idx);
                if(player && (player.userId == data[0].roleInfo.userId))
                {
                    if(player  && player.joinGame)
                    {

                    }else
                    {
                        this.resetUI();
                    }
                    this.showWait(true);
                }
                break;
            case RoomEvent.on_room_game_start:
                this.updateUI()
                break;
        }
    },
});
