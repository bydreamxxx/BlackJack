var UserPlayer = require('scmj_userPlayer_data').Instance();
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var DeskData = require("scmj_desk_data").DeskData;
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var RoomMgr = require("jlmj_room_mgr").RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        button:cc.Button,
        tips:cc.RichText,
        order:cc.Sprite,

        bg:cc.Node,

        clockWiseSpriteFrame:{
            default: null,
            type: cc.SpriteFrame,
            tooltip: '顺时针'
        },

        counterClockWiseSpriteFrame:{
            default: null,
            type: cc.SpriteFrame,
            tooltip: '逆时针'
        },

        acrossSpriteFrame:{
            default: null,
            type: cc.SpriteFrame,
            tooltip: '对家'
        },

        huanAni3d_3:{
            default: null,
            type: sp.Skeleton,
            tooltip: '3d换三张动画'
        },

        huanAni2d_3:{
            default: null,
            type: sp.Skeleton,
            tooltip: '2d换三张动画'
        },

        up2d_3:{
            default: null,
            type: cc.Node,
            tooltip: '2d上出牌'
        },

        left2d_3:{
            default: null,
            type: cc.Node,
            tooltip: '2d左出牌'
        },

        right2d_3:{
            default: null,
            type: cc.Node,
            tooltip: '2d右出牌'
        },

        down2d_3:{
            default: null,
            type: cc.Node,
            tooltip: '2d下出牌'
        },

        up3d_3:{
            default: null,
            type: cc.Node,
            tooltip: '3d上出牌'
        },

        left3d_3:{
            default: null,
            type: cc.Node,
            tooltip: '3d左出牌'
        },

        right3d_3:{
            default: null,
            type: cc.Node,
            tooltip: '3d右出牌'
        },

        down3d_3:{
            default: null,
            type: cc.Node,
            tooltip: '3d下出牌'
        },

        huanAni3d_4:{
            default: null,
            type: sp.Skeleton,
            tooltip: '3d换四张动画'
        },

        huanAni2d_4:{
            default: null,
            type: sp.Skeleton,
            tooltip: '2d换四张动画'
        },

        up2d_4:{
            default: null,
            type: cc.Node,
            tooltip: '2d上出牌'
        },

        left2d_4:{
            default: null,
            type: cc.Node,
            tooltip: '2d左出牌'
        },

        right2d_4:{
            default: null,
            type: cc.Node,
            tooltip: '2d右出牌'
        },

        down2d_4:{
            default: null,
            type: cc.Node,
            tooltip: '2d下出牌'
        },

        up3d_4:{
            default: null,
            type: cc.Node,
            tooltip: '3d上出牌'
        },

        left3d_4:{
            default: null,
            type: cc.Node,
            tooltip: '3d左出牌'
        },

        right3d_4:{
            default: null,
            type: cc.Node,
            tooltip: '3d右出牌'
        },

        down3d_4:{
            default: null,
            type: cc.Node,
            tooltip: '3d下出牌'
        },

        _animation:'',
        _huanAni:null,
        _up:null,
        _left:null,
        _right:null,
        _down:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initUI();

        this.node.active = false;

        this.huanAni3d_3.node.active = false;
        this.huanAni2d_3.node.active = false;

        this.up2d_3.active = false;
        this.left2d_3.active = false;
        this.right2d_3.active = false;
        this.down2d_3.active = false;
        this.up3d_3.active = false;
        this.left3d_3.active = false;
        this.right3d_3.active = false;
        this.down3d_3.active = false;

        this.huanAni3d_4.node.active = false;
        this.huanAni2d_4.node.active = false;

        this.up2d_4.active = false;
        this.left2d_4.active = false;
        this.right2d_4.active = false;
        this.down2d_4.active = false;
        this.up3d_4.active = false;
        this.left3d_4.active = false;
        this.right3d_4.active = false;
        this.down3d_4.active = false;

        DeskED.addObserver(this);
    },

    initUI(){
        if(RoomMgr.Instance()._Rule){
            if(RoomMgr.Instance()._Rule.huan4zhang){
                this.huanAni3d = this.huanAni3d_4;
                this.huanAni2d = this.huanAni2d_4;

                this.up2d = this.up2d_4;
                this.left2d = this.left2d_4;
                this.right2d = this.right2d_4;
                this.down2d = this.down2d_4;
                this.up3d = this.up3d_4;
                this.left3d = this.left3d_4;
                this.right3d = this.right3d_4;
                this.down3d = this.down3d_4;
            }else{
                this.huanAni3d = this.huanAni3d_3;
                this.huanAni2d = this.huanAni2d_3;

                this.up2d = this.up2d_3;
                this.left2d = this.left2d_3;
                this.right2d = this.right2d_3;
                this.down2d = this.down2d_3;
                this.up3d = this.up3d_3;
                this.left3d = this.left3d_3;
                this.right3d = this.right3d_3;
                this.down3d = this.down3d_3;
            }
        }
    },

    checkInit(){
        return this.huanAni3d;
    },

    onDestroy () {
        DeskED.removeObserver(this);
    },

    // update (dt) {},

    /**
     * 显示换三张
     */
    huan3ZhangShow(){
        if(!this.checkInit()){
            this.initUI();
        }

        this.node.active = true;
        this.bg.active = true;
        this.button.node.active = true;
        this.button.interactable = true;
        this.order.node.active = false;
        this.tips.node.active = true;
        let huanpaiConut = RoomMgr.Instance()._Rule.huan4zhang ? 4 : 3;
        this.tips.string = "选择以下"+huanpaiConut+"张<color=#EBDC69>同花色</c>手牌";
    },

    /**
     *显示换三张顺序
     */
    huan3ZhangOpenOrder(){
        if(!this.checkInit()){
            this.initUI();
        }

        this.node.active = true;
        this.bg.active = true;
        this.button.node.active = false;
        this.order.node.active = true;
        this.tips.node.active = true;
        this.tips.string = "本局换牌顺序";
    },

    /**
     * 播放动画
     */
    huan3zhangAni(){
        if(!this.checkInit()){
            this.initUI();
        }

        this.moveHuanPai(0);
        this.moveHuanPai(1);
        this.moveHuanPai(2);
        this.moveHuanPai(3);

        this.huanAni3d.node.active = false;
        this.huanAni2d.node.active = false;
        let _use2D = DeskData.Instance().getIs2D();
        this._huanAni = _use2D ? this.huanAni2d : this.huanAni3d;
        setTimeout(()=>{
            this.up2d.active = false;
            this.left2d.active = false;
            this.right2d.active = false;
            this.down2d.active = false;
            this.up3d.active = false;
            this.left3d.active = false;
            this.right3d.active = false;
            this.down3d.active = false;

            this._huanAni.setCompleteListener(()=>{
                this.huanAni3d.node.active = false;
                this.huanAni2d.node.active = false;
            });

            this._huanAni.node.active = true;

            if(this._animation == ''){
                if(RoomMgr.Instance()._Rule.usercountlimit == 3) {
                    this._animation = '3rennishizhen';
                }else if(RoomMgr.Instance()._Rule.usercountlimit == 2){
                    this._animation = '2ren';
                }else{
                    this._animation = 'nishizhen';
                }
            }

            this._huanAni.animation = this._animation;
        }, 500)
    },

    /**
     * 关闭换三张
     */
    huan3ZhangHide(){
        this.node.active = false;
    },
    /**
     * 设置换三张顺序
     * @param point
     */
    setOrder(point){
        let _point = 0;
        for(let i = 0; i < point.length; i++){
            _point += point[i];
        }

        if(RoomMgr.Instance()._Rule.usercountlimit == 3) {
            if (_point % 2 == 0) {
                this.order.spriteFrame = this.counterClockWiseSpriteFrame;
                this._animation = '3rennishizhen';
            } else {
                this.order.spriteFrame = this.clockWiseSpriteFrame;
                this._animation = '3renshunshizhen';
            }
        }else if(RoomMgr.Instance()._Rule.usercountlimit == 2){
            this.order.spriteFrame = this.acrossSpriteFrame;
            this._animation = '2ren';
        }else{
            switch(_point){
                case 2:
                case 7:
                case 8:
                    this.order.spriteFrame = this.clockWiseSpriteFrame;
                    this._animation = 'nishizhen';
                    break;
                case 3:
                case 4:
                case 9:
                case 10:
                    this.order.spriteFrame = this.acrossSpriteFrame;
                    this._animation = 'duijiahuan';
                    break;
                case 5:
                case 6:
                case 11:
                case 12:
                    this.order.spriteFrame = this.counterClockWiseSpriteFrame;
                    this._animation = 'huansanzhang';
                    break;
                default:
                    this.order.spriteFrame = this.clockWiseSpriteFrame;
                    this._animation = 'duijiahuan';
                    break;
            }
        }

    },

    onClick(){
        jlmj_audio_mgr.com_btn_click();

        UserPlayer.moveHuanPai();

        // this.huan3ZhangOpenOrder();
        this.bg.active = false;
        this.tips.node.active = false;
        this.button.node.active = false;

        let msg = new cc.pb.xuezhanmj.xzmj_req_huan3zhang();
        if(UserPlayer.checkHuan3Zhang()){
            msg.setChoosecardsList(UserPlayer.huan3Zhang_option);
        }else{
            msg.setChoosecardsList(UserPlayer.huan3Zhang_default_option);
        }
        cc.gateNet.Instance().sendMsg(cc.netCmd.xuezhanmj.cmd_xzmj_req_huan3zhang, msg, "xzmj_req_huan3zhang", true);

        // var playerMgr = require('scmj_player_mgr');
        // setTimeout(()=>{
        //     var userlist = playerMgr.Instance().playerList;
        //     for (var i = 0; userlist && i < userlist.length; ++i) {
        //         if(userlist[i].userId == 671089816){
        //             userlist[i].moveHuanPai();
        //         }
        //     }
        // }, 1000)
        //
        // setTimeout(()=>{
        //     var userlist = playerMgr.Instance().playerList;
        //     for (var i = 0; userlist && i < userlist.length; ++i) {
        //         if(userlist[i].userId == 872415577){
        //             userlist[i].moveHuanPai();
        //         }
        //     }
        // }, 2000)
        //
        // setTimeout(()=>{
        //     var userlist = playerMgr.Instance().playerList;
        //     for (var i = 0; userlist && i < userlist.length; ++i) {
        //         if(userlist[i].userId == 570426097){
        //             userlist[i].moveHuanPai();
        //         }
        //     }
        // }, 3000)
        //
        // setTimeout(()=>{
        //     let scmj_net_handler_scmj_jbc = require('scmj_net_handler_scmj_jbc');
        //     scmj_net_handler_scmj_jbc.on_xzmj_ack_huan3zhang({
        //         userid: UserPlayer.userId,
        //         choosepaisList:[
        //             {type: 2, value:5, id: 53},{type: 2, value:6, id: 57},{type: 2, value:7, id: 60}
        //         ],
        //         huanpaisList:[
        //             {type: 2, value:5, id: 53},{type: 2, value:6, id: 57},{type: 2, value:7, id: 60}
        //             // {type: 3, value:1, id: 1},{type: 3, value:1, id: 2},{type: 3, value:1, id: 3}
        //         ]
        //     })
        //     scmj_net_handler_scmj_jbc.on_xzmj_ack_huan3zhang({
        //         userid: 872415577,
        //         choosepaisList:[],
        //         huanpaisList:[]
        //     })
        //     scmj_net_handler_scmj_jbc.on_xzmj_ack_huan3zhang({
        //         userid: 570426097,
        //         choosepaisList:[],
        //         huanpaisList:[]
        //     })
        //     scmj_net_handler_scmj_jbc.on_xzmj_ack_huan3zhang({
        //         userid: 671089816,
        //         choosepaisList:[],
        //         huanpaisList:[]
        //     })
        // },4000)
    },

    onEventMessage(event,data){
        switch(event){
            case DeskEvent.CHECK_HUAN_3_ZHANG:
                this.button.interactable = UserPlayer.checkHuan3Zhang();
                break;
        }
    },


    moveHuanPai(viewIdx){
        let _use2D = DeskData.Instance().getIs2D();
        if(viewIdx == 0){
            this.down2d.active = false;
            this.down3d.active = false;
            if(_use2D){
                this.down2d.active = true;
            }else{
                this.down3d.active = true;
            }

            this.bg.active = false;
            this.tips.node.active = false;
            this.button.node.active = false;
        }else if(viewIdx == 1){
            this.right2d.active = false;
            this.right3d.active = false;
            if(_use2D){
                this.right2d.active = RoomMgr.Instance()._Rule.usercountlimit != 2;
            }else{
                this.right3d.active = RoomMgr.Instance()._Rule.usercountlimit != 2;
            }
        }else if(viewIdx == 2){
            this.up2d.active = false;
            this.up3d.active = false;
            if(_use2D){
                this.up2d.active = RoomMgr.Instance()._Rule.usercountlimit == 2 || RoomMgr.Instance()._Rule.usercountlimit == 4;
            }else{
                this.up3d.active = RoomMgr.Instance()._Rule.usercountlimit == 2 || RoomMgr.Instance()._Rule.usercountlimit == 4;
            }
        }else if(viewIdx == 3){
            this.left2d.active = false;
            this.left3d.active = false;
            if(_use2D){
                this.left2d.active = RoomMgr.Instance()._Rule.usercountlimit != 2;
            }else{
                this.left3d.active = RoomMgr.Instance()._Rule.usercountlimit != 2;
            }
        }
    },
});
