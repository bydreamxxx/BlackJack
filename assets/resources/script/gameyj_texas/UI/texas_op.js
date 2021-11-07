let sender = require('net_sender_texas');
let hall_audio_mgr = require('hall_audio_mgr').Instance();
let RoomMgr = require('jlmj_room_mgr').RoomMgr;
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
let texas_Data = require('texas_data').texas_Data;
const OP_TYPE = {
    discard: 0x0001,        //弃牌
    pass: 0x0002,           //过
    showhand: 0x0004,       //梭哈
    add: 0x0008,            //加注
    follow: 0x0010,         //跟任何注
    opencard: 0x0020,       //开牌
    WATCH: 0x0000,         //旁观操作
    NOT_MY_TURN: 0xFFFF,      //不该我操作
    MY_TURN: 0xCCCC,         //该我操作
    ADD_BET: 0xDDDD,         //加注操作
    EXCHANGE: 0xEEEE,       //换桌操作
};

cc.Class({
    extends: cc.Component,

    properties: {
        not_my_turn_node: cc.Node,
        my_turn_node: cc.Node,
        add_bet_node: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.m_opType = -1;
        this.m_isHide = true;
        texas_Data.Instance().m_followBet = 0;
        this.m_bAutoCheck = null;
        RoomED.addObserver(this);
    },

    onDestroy() {
        RoomED.removeObserver(this);
    },
    // start () {},

    resetOp()
    {
        for(var i=0;i<this.not_my_turn_node.childrenCount;i++)
        {
            if(this.not_my_turn_node.children[i])
            {
                this.not_my_turn_node.children[i].getComponent(cc.Toggle).isChecked = false;
            }
        }
        // 

    },

    showOp(type, mask,turnBet,noAni,myTurnBet) {
        cc.log("type:",type);
        switch (type) {
            case OP_TYPE.MY_TURN:
                this.m_mask = mask?mask:this.m_mask;
                this.my_turn_node.active = true;
                this.not_my_turn_node.active = false;
                this.add_bet_node.active = false;
                // cc.find('bar', this.game_node).active = false;
                var canAdd = ((mask & OP_TYPE.add) > 0)
                cc.find('canAdd', this.my_turn_node).active = canAdd;
                cc.find('canNotAdd', this.my_turn_node).active = !canAdd;
                
                if(canAdd)
                {
                    cc.find('canAdd/drop', this.my_turn_node).active = ((mask & OP_TYPE.discard) > 0);
                    cc.find('canAdd/check', this.my_turn_node).active = ((mask & OP_TYPE.pass) > 0);
                    cc.find('canAdd/addbet', this.my_turn_node).active = ((mask & OP_TYPE.add) > 0);
                    cc.find('canAdd/follow', this.my_turn_node).active = ((mask & OP_TYPE.follow) > 0);
                    this.add_bet_node.getComponentInChildren('texas_bet_slider').resetAddLabel();

                    var canDichi = false;
                    var canDichi2 = false;
                    var canMang = false;
                    if(texas_Data.Instance().getBaseScore()>0)
                    {
                        canDichi = texas_Data.Instance().m_totalBet/texas_Data.Instance().getBaseScore()>=4
                        if(!canDichi)
                        {
                            cc.log("不显示快捷底池，原因:底池"+texas_Data.Instance().m_totalBet+'除以大盲'+texas_Data.Instance().getBaseScore()+"小于4");
                        }
                    }

                    canDichi2 = texas_Data.Instance().m_totalBet/2>this.minBet
                    if(!canDichi2)
                    {
                        cc.log("不显示快捷底池，原因:最小加注额"+this.minBet+'大于等于底池'+texas_Data.Instance().m_totalBet+'/2：'+(texas_Data.Instance().m_totalBet/2));
                    }


                    if(!canDichi || !canDichi2)
                    {
                        canMang = this.minBet<=2*texas_Data.Instance().getBaseScore()
                        if(!canMang)
                        {
                            cc.log("不显示快捷盲注，原因:最小加注额"+this.minBet+'大于2倍底注：'+ (2*texas_Data.Instance().getBaseScore()));
                        }
                    }
                    
                    cc.find('quickAddMang', this.my_turn_node).active = ((!canDichi ||!canDichi2)  && canMang);
                    cc.find('quickAddDi', this.my_turn_node).active = canDichi && canDichi2;
                    
                }else{
                    cc.find('canNotAdd/drop', this.my_turn_node).active = ((mask & OP_TYPE.discard) > 0);
                    cc.find('canNotAdd/allin', this.my_turn_node).active = ((mask & OP_TYPE.showhand) > 0);
                }
                if(turnBet)
                {
                    var str = cc.find('canAdd/follow/str',this.my_turn_node).getComponent(cc.Label);
                    str.string  =  'CALL'+texas_Data.Instance().convertNumToStr(turnBet);
                    str = cc.find('canNotAdd/follow/str',this.my_turn_node).getComponent(cc.Label);
                    str.string  =  'CALL'+texas_Data.Instance().convertNumToStr(turnBet);
                }

                var check = cc.find('check', this.not_my_turn_node)
                check.getComponent(cc.Toggle).isChecked = false;
                
                // cc.find('layout/opencard', this.game_node).active = ((mask & OP_TYPE.opencard) > 0);
                break;
            case OP_TYPE.NOT_MY_TURN:
                this.m_mask = mask?mask:this.m_mask;
                this.not_my_turn_node.active = true;
                this.my_turn_node.active = false;
                this.add_bet_node.active = false;
                cc.find('followAny', this.not_my_turn_node).active = ((mask & OP_TYPE.follow) > 0);
                cc.find('checkOrDrop', this.not_my_turn_node).active = ((mask & OP_TYPE.discard) > 0);


                var fl = cc.find('follow', this.not_my_turn_node)//((mask & OP_TYPE.follow) > 0);//((mask & OP_TYPE.pass) > 0);
                var check = cc.find('check', this.not_my_turn_node)

                if(texas_Data.Instance().m_opflag!=-1)
                    fl.getComponent(cc.Toggle).isChecked = false;

                //重连复原
                cc.find('followAny', this.not_my_turn_node).getComponent(cc.Toggle).isChecked = texas_Data.Instance().m_opflag == 2;
                cc.find('checkOrDrop', this.not_my_turn_node).getComponent(cc.Toggle).isChecked = texas_Data.Instance().m_opflag == 4;


                // check.getComponent(cc.Toggle).isChecked = false;
                cc.log("myTurnBet:"+myTurnBet+',turnBet:'+turnBet);
                var needFollowNum = myTurnBet<turnBet;
                fl.active = needFollowNum;
                check.active = !needFollowNum;

                if(needFollowNum)
                {
                    check.getComponent(cc.Toggle).isChecked = false;
                    if(texas_Data.Instance().m_followBet!=turnBet)
                    {
                        var str = cc.find('str',fl).getComponent(cc.Label);
                        var tog = fl.getComponent(cc.Toggle);
                        str.string  =  'CALL'+texas_Data.Instance().convertNumToStr(turnBet);
                        if(tog.isChecked)
                        {
                            tog.uncheck();  
                            texas_Data.Instance().m_opflag = 0;
                        }
                        texas_Data.Instance().m_followBet = turnBet;
                    }
                }

                break;
            case OP_TYPE.EXCHANGE:
                this.not_my_turn_node.active = false;
                this.my_turn_node.active = false;
                this.add_bet_node.active = false;
                break;
            case OP_TYPE.WATCH:
                this.not_my_turn_node.active = false;
                this.my_turn_node.active = false;
                this.add_bet_node.active = false
                ;
                break;
            case OP_TYPE.ADD_BET:
                this.not_my_turn_node.active = false;
                // this.my_turn_node.active = false;
                this.add_bet_node.active = true;
                break;
        }
        

        if(this.m_opType == type && !this.m_isHide)
            return;
        else
            this.m_opType = type;

        if(noAni)
            return;
        // this.node.getComponent(cc.Animation).stop();
        // this.node.getComponent(cc.Animation).play('show_op');
        this.m_isHide = false;
    },

    hideOp() {
        //this.node.getComponent(cc.Animation).play('hide_op');
        this.m_isHide = true;
    },

    //弃牌
    discard() {
        if (this._opCD)
            return;
        this.opCoolDown();
        hall_audio_mgr.com_btn_click();
        sender.disCard();
        this.showOp(OP_TYPE.EXCHANGE,null,null,true);
    },

    //过
    pass() {
        if (this._opCD)
            return;
        this.opCoolDown();
        hall_audio_mgr.com_btn_click();
        sender.Pass();
        this.showOp(OP_TYPE.EXCHANGE,null,null,true);
    },

    //梭哈
    showhand() {
        if (this._opCD)
            return;
        this.opCoolDown();
        hall_audio_mgr.com_btn_click();
        sender.allIn();
        this.showOp(OP_TYPE.EXCHANGE,null,null,true);
    },

    setCanAdd(canAdd,minbet)
    {
        this.canAdd = canAdd;
        this.minBet = minbet
    },

    //加注
    add() {
        if(!this.canAdd)
        {
            this.showNotMoney();
            return;
        }


        if(this.m_opType == OP_TYPE.ADD_BET)//确定
        {
            this.add_bet_node.getComponentInChildren('texas_bet_slider').onEnter();
        }else
        {
            this.showOp(OP_TYPE.ADD_BET,null,null,true);
        }
    },

    showNotMoney()
    {
        // cc.dd.UIMgr.openUI('gameyj_texas/prefab/texas_quick_pick_money', function (ui) {
        //     // ui.getComponent("texas_quick_pick_money").show(str, func, 2);
        // }.bind(this));
    },

    //取消加注
    cancelAdd() {
        this.showOp(OP_TYPE.MY_TURN,this.m_mask,null,true);
    },

    //跟注
    follow() {
        if (this._opCD)
            return;
        this.opCoolDown();
        hall_audio_mgr.com_btn_click();
        sender.Call();
        this.showOp(OP_TYPE.EXCHANGE,null,null,true);
    },



    opAuto(event,data)
    {
        var op = parseInt(data);
        var flag = event.target.getComponent(cc.Toggle).isChecked;
        if(flag)
        {
            texas_Data.Instance().m_opflag = op
        }else
        {
            texas_Data.Instance().m_opflag = 0;
        }

        if(-1 == op)//客户端判断自动跟特定注
        {
            
        }else//发给服务器判断
        {
            sender.AutoOp(op,flag);
        }
        
    },

    opCoolDown() {
        this._opCD = true;
        setTimeout(() => {
            this._opCD = false;
        }, 500);
    },

    //换桌
    exchange() {
        hall_audio_mgr.com_btn_click();
        this.stopTime();
        if (!this.CD) {
            this.CD = true;
            cc.find('exchange', this.result_node).active = false;
            this.scheduleOnce(function () {
                cc.find('exchange', this.result_node).active = true;
                this.CD = false;
            }.bind(this), 5);
            var pbData = new cc.pb.room_mgr.msg_change_room_req();
            pbData.setGameType(texas_Data.Instance().getGameId());
            pbData.setRoomCoinId(texas_Data.Instance().getRoomId());
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
        }
    },

    //继续
    continue() {
        hall_audio_mgr.com_btn_click();
        this.stopTime();
        if (!this.CD) {
            this.CD = true;
            this.scheduleOnce(function () {
                this.CD = false;
            }.bind(this), 1);
            var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(texas_Data.Instance().getGameId());
            gameInfoPB.setRoomId(texas_Data.Instance().getRoomId());
            pbData.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, pbData, "msg_prepare_game_req", true);
        }
    },

    startTime: function () {
        var timeout = 15;
        timelbl = cc.find('timer', this.result_node).getComponent(cc.Label);
        timelbl.string = timeout.toString();
        this.timeFunc = setInterval(function () {
            if (timeout < 0) {
                this.stopTime();
                this.sendLeaveRoom();
            } else {
                timelbl.string = timeout.toString();
            }
            --timeout;
        }.bind(this), 1000);
    },

    stopTime: function () {
        if (this.timeFunc) {
            clearInterval(this.timeFunc);
            this.timeFunc = null;
        }
    },

    sendLeaveRoom: function () {
        if (this.result_node.active) {
            var msg = new cc.pb.room_mgr.msg_leave_game_req();
            var gameType = texas_Data.Instance().getGameId();
            var roomId = texas_Data.Instance().getRoomId();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(gameType);
            gameInfoPB.setRoomId(roomId);
            msg.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case RoomEvent.on_room_ready:
                this.on_room_ready(data[0]);
                break;
            case RoomEvent.on_room_replace:
                this.on_room_replace(data[0]);
                break;
        }
    },

    on_room_ready: function (msg) {
        if (msg.userId === cc.dd.user.id) {
            this.hideOp();
        }
    },

    on_room_replace: function () {
        this.hideOp();
    },
});
