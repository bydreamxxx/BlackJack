/**
 * Created by Mac_Li on 2017/10/10.
 */
const Hall = require('jlmj_halldata');
var hallData = require('hall_common_data').HallCommonData;
var AppConfig = require('AppConfig');
var hall_prefab = require('hall_prefab_cfg');
var dd = cc.dd;
const defaultDuration = 1000 * 60 * 3;//3分钟
var game_room_list = require('game_room');
var ResLoader = require("ResLoader").ResLoader;

cc.Class({
    extends: cc.Component,

    properties: {
        strTTF: cc.RichText,//跑马灯
        showNode: cc.Node,
        autoJudgePos:true,
        m_showBinggoAni:Boolean, //是否显示中奖动画

        binggoAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
    },
    onLoad: function () {
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.isOff = false;
        var json = cc.sys.localStorage.getItem('BROADCAST_SWITCH');
        if (json)
            this.isOff = !JSON.parse(json);

        this._infoArr = [];
        this._isEnd = true;
        this._isShowBinggo = false;
        this._defaultInfoArr = []; //获取服务器初始默认数据
        this._isDefaultPlay = true;  //判断是否默认播放客户端自设定
        this._isDefaultEnd = true;  //判断默认播放是否完成一次
        this._nDefaultIndex = 0;   //默认跑马灯索引
        this.closeOnce = false;

        var size = cc.director.getWinSize();
        if(this.autoJudgePos)
        {
            this.node.x = size.width / 2;
            this.node.y = size.height * 0.88;
            // this.node.width = size.width * 0.8;
            // cc.find('bg', this.node).width = size.width * 0.8;
            // cc.log("this.node.x:",this.node.x);
        }

        this._defaultPos = this.node.position;
        
        this.showNode.active = false;
        Hall.HallED.addObserver(this);

    },

    

    updatePosition(height) {
        var size = cc.director.getWinSize();
        this.node.x = size.width / 2;
        this.node.y = size.height * (height || 0.88);
    },

    resetPosition() {
        if (this._defaultPos)
            this.node.setPosition(this._defaultPos);
    },

    /**
     * 析构
     * 
     */
    onDestroy: function () {
        Hall.HallED.removeObserver(this);
        clearTimeout(this.m_timeout_binggo);
    },

    update: function (dt) {
        if (!this.isOff) {
            if (this._isDefaultPlay) {//判定一直播放默认的
                ///一次默认的未播放完
                if (this._isDefaultEnd) {
                    var now = new Date().getTime();
                    if (!this.lastdate || (now - this.lastdate > defaultDuration)) {
                        this.onStartPlayDefaultShow();
                    }
                }
            } else {//判定播放系统的
                if (this._isEnd) {
                    this.startShow()
                }
            }
        }

        if(this.m_showNumAni)
        {
            this.m_numAniLabel.node.active = true;
            this.m_numAniLabel.node.opacity = 255;  
            this.m_dt += dt;
            this.numberScroll();
            
        }

        // var uu = dd.UIMgr.getUI(hall_prefab.KLB_HALL_BINGGO_ANI) 
        // if(uu)
        // {
        //     cc.log("uu.x:"+uu.x);
        // }
    },
    numberScroll: function () {
        if(this.m_numAniLabel == null)
        {
            this.m_showNumAni = false;
            return;
        }
        if(this.m_dt>=0.02){

            var vl=0;
            if(this.m_numAniLabel.string != '')
                vl = parseInt(this.m_numAniLabel.string);
            vl = Math.min(this.m_numAniNum,vl + this.m_numStep)
            
            if(vl>=this.m_numAniNum)
            {
                this.m_showNumAni = false;
                this.m_numAniLabel.string = this.m_numAniNum;
            }else
            {
                this.m_numAniLabel.string = ''+ parseInt(vl) ;
            }
            this.m_dt = 0;
        }
    },
    
    // numberScroll: function (label,num) {
    //     if(label == null || num == null)
    //     {
    //         this.m_showNumAni = false;
    //         return;
    //     }

    //     if(this.m_dt<0.6)
    //     {
    //         var numstring = num.toString();
    //         var labelStr = label.string.toString();
    //         var result = "";
    //         for(var i=0;i<numstring.length;i++)
    //         {
    //             var toNum = numstring.substr(i,1);
    //             var nowNum = "";
    
    //             if(i<labelStr.length)
    //                 nowNum = labelStr.substr(i,1);
    
    //             nowNum = (nowNum == ""?'-1':nowNum)
    //             if(nowNum == '-1'){
    //                 result+= cc.dd.Utils.random(9).toString();
    //             }else if(parseInt(nowNum) < 9)
    //             {
    //                 nowNum = parseInt(nowNum)+1
    //                 result+=nowNum
    //             }else
    //             {
    //                 nowNum = 0
    //                 result+=nowNum;
    //             }
    //         }
    //         label.string = ''+ parseInt(result) ;
    //         return;
    //     }


    //     var numstring = num.toString();
    //     var labelStr = label.string.toString();
    //     var result = "";
    //     var isAllOver = true;
    //     for(var i=0;i<numstring.length;i++)
    //     {
    //         var toNum = numstring.substr(i,1);
    //         var nowNum = "";

    //         if(i<labelStr.length)
    //             nowNum = labelStr.substr(i,1);

    //         nowNum = (nowNum == ""?'-1':nowNum)
    //         if(nowNum == '-1'){
    //             result+='0';
    //             isAllOver = false;
    //         }else if(parseInt(nowNum) < parseInt(toNum))
    //         {
    //             nowNum = parseInt(nowNum)+1
    //             result+=nowNum
    //             isAllOver = false;
    //         }else if(parseInt(nowNum) > parseInt(toNum))
    //         {
    //             nowNum = 0
    //             result+=nowNum
    //             isAllOver = false;
    //         }else if(parseInt(nowNum) == parseInt(toNum))
    //         {
    //             result+=nowNum
    //         }
    //         else
    //         {
    //             result+=nowNum;
    //         }
    //     }
        

    //     if(isAllOver)
    //     {
    //         this.m_showNumAni = false;
    //     }else
    //     {
    //         label.string = ''+ parseInt(result) ;
    //         // cc.log("label.string:"+label.string)
    //     }
    // },

    lateUpdate: function (dt) {
        if (this.animOn && !this.isOff) {
            this.updateTimer += dt;
            // if (this.updateTimer < this.updateInterval) {
            //     return;
            // }
            this.updateTimer = 0;

            if (this.need_repeat > 0) {
                if (this.strTTF.node.x >= this.anim_target) {
                    this.strTTF.node.x -= this.anim_speed;
                } else {
                    this.strTTF.node.x = this.anim_start;
                    this.need_repeat--;
                }
            } else {
                this.animOn = false;
                this.showNode.active = false;
                this.anim_closeCb();
            }
        }
    },

    /**
     * 跑马灯默认信息
     */
    onDefaultMarquee: function (data) {
        this._defaultInfoArr = data.contentList;
    },

    /**
     * 播发默认的跑马灯信息
     */
    onStartPlayDefaultShow: function () {
        if (cc._chifengGame || cc._appstore_check || cc._androidstore_check || cc._useCardUI)
            return;
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
            case 10004: //巷乐天天踢
            case 10003:
            case 10013:
            case 10014:
                return;
        }
        if (this._defaultInfoArr.length > 0) {
            this.lastdate = new Date().getTime();
            this.showNode.active = true;
            this._isEnd = false
            this._isDefaultEnd = false;
            if (this._nDefaultIndex >= this._defaultInfoArr.length) {
                this._nDefaultIndex = 0;
            }
            this.showInfo(this._defaultInfoArr[this._nDefaultIndex], 5, 1, this.onDefalutCallBack.bind(this));
            this._nDefaultIndex += 1;
            if (this._nDefaultIndex >= this._defaultInfoArr.length) {
                this._nDefaultIndex = 0;
            }
        }
        else {
            this.showNode.active = false;
        }
    },
    /**
     * 跑马灯默认播放回调
     */
    onDefalutCallBack: function () {
        this._isDefaultEnd = true
        this._isEnd = true
    },

    /**
     * 跑马灯数据
     */
    onMarquee: function (data) {
        this._infoArr.push(data);
        this._isDefaultPlay = false;

        if (this.closeOnce == true) {
            // let sceneName = cc.dd.SceneManager.getCurrScene().name;
            // if (sceneName != AppConfig.HALL_NAME) {
                this.turnOff();
                return;
            // } else {
            //     this.closeOnce = false;
            //     this.turnOn();
            // }
        }
        if (this._isEnd ){//&& !this.isOff) {//没有开始
            this.startShow();
        }
    },

    /**
     * 开始
     */
    startShow: function () {
        if (cc._chifengGame || cc._appstore_check || cc._androidstore_check || cc._useCardUI)
            return;
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
            case 10003:
            case 10004:
            case 10013:
            case 10014:
                return;
        }
        var data = this._infoArr.splice(0, 1);
        if (data.length) {
            if(data[0].type != 0){
                this.showNode.active = true;
                this._isEnd = false;
                this.showInfo(data[0].content, data[0].speed, data[0].showtimes, this.startShow.bind(this));
            }
            var hasClan = (hallData.getInstance().preGuildid || hallData.getInstance().guildid)

            //0:游戏内广播, 1:系统广播
            if(hasClan && this.m_showBinggoAni &&(!this.isOff)&& data[0].type == 0)
            {
                if(!this._isShowBinggo)
                    this.showBinggoAni(data[0]);
                else
                    this._infoArr.push(data[0])
            }
        } else {//没有信息则完成一轮
            this._isDefaultPlay = true;
            this._isDefaultEnd = true;
            this._isEnd = true;
        }
    },

    showBinggoAni:function(data)
    {
        var cf = game_room_list.getItem(function (item) {
            if(item.gameid==data.gameType)
                return true;
        }.bind(this));

        if(cf == null)
        {
            cc.log("服务器公告数据错误");
            return;
        }

        this.m_showNumAni =false;
        this._isShowBinggo = true;
        dd.UIMgr.openUI(hall_prefab.KLB_HALL_BINGGO_ANI, function (prefab) {
            var winSize = cc.winSize
            prefab.setPosition(cc.p(-(winSize.width/2+prefab.width),winSize.height/2-prefab.height));

            var actNode = cc.find('ani_gonggao',prefab)//.getComponent(cc.Animation)
            var name = cc.find('ani_gonggao/name',prefab).getComponent(cc.Label)
            var gold = cc.find('ani_gonggao/shuzi',prefab).getComponent(cc.Label)
            var gold2 = cc.find('ani_gonggao/shuzi/txt',prefab).getComponent(cc.Label)
            var body = cc.find('ani_gonggao/body',prefab).getComponent(cc.Sprite);
            var gname = cc.find('ani_gonggao/gameName',prefab).getComponent(cc.Label)

            var cfg = game_room_list.getItem(function (item) {
                if(item.gameid==data.gameType)
                    return true;
            }.bind(this));

            name.string = data.nickname;
            gold.string = "";//data.winGold;
            gold2.string = "";// data.winGold;
            gname.string = cfg.game_name;

            body.spriteFrame = this.binggoAtlas.getSpriteFrame(data.gameType);

            var frameSize = prefab.width;
            prefab.opacity = 1;
            let windowSize = cc.winSize;
            var toPostionIn1 = cc.p(-(windowSize.width/2 - frameSize*2/3),prefab.getPositionY());
            var toPostionIn2 = cc.p(-(windowSize.width/2 - frameSize/2),prefab.getPositionY());

            var toPostionOut1 = cc.p(-(windowSize.width/2 - frameSize*2/3),prefab.getPositionY());
            var toPostionOut2 = cc.p(-(windowSize.width/2 + frameSize),prefab.getPositionY());
            let actionIn1 = cc.spawn(cc.fadeIn(0.7).easing(cc.easeExponentialOut()),
                    cc.moveTo(0.7, toPostionIn1).easing(cc.easeExponentialOut()));
            let actionIn2 = cc.moveTo(0.4, toPostionIn2).easing(cc.easeExponentialOut());

            let actionOut1 = cc.moveTo(0.4, toPostionOut1).easing(cc.easeExponentialOut());
            let actionOut2 = cc.spawn(cc.moveTo(0.6, toPostionOut2).easing(cc.easeExponentialOut()), 
                cc.fadeOut(0.6).easing(cc.easeExponentialOut()));
            
            // cc.delayTime(delayTime)
            prefab.stopAllActions();
            prefab.runAction(
                cc.sequence(
                    cc.callFunc(function () {
                        prefab.opacity = 255;
                        gold.node.active = true;
                        gold.node.opacity = 255;
                        this.m_numAniLabel = gold;
                        this.m_numAniNum = data.winGold
                        var t = 2/0.02;
                        this.m_numStep = parseInt(data.winGold/t) 
                        this.m_dt =  0;
                        cc.log("data.winGold:"+data.winGold);
                        this.m_showNumAni = true;
                    }.bind(this)),
                    actionIn1,

                    actionIn2,
                    cc.delayTime(3),
                    actionOut1,
                    actionOut2,
                    cc.callFunc(function () {
                        this.m_showNumAni = false;
                        this._isShowBinggo = false;
                        this.startShow();
                    }.bind(this)),
                    
                    )
                )
            // ani.setCurrentTime(0,'ani_gonggao_start');
            // ani.play('ani_gonggao_start');
            // this.m_timeout_binggo = setTimeout(function(){
            //     if(ani)
            //     {
            //         ani.setCurrentTime(0,'ani_gonggao_end');
            //         ani.play('ani_gonggao_end');
            //     }
            // }, 4000);
        }.bind(this),false,1);
    },

    /**
     * 独立游戏公告
     * @param data 公告内容
     */
    showDLInfo: function (data) {
        if (!this.showNode.active) {
            this.showNode.active = true;
            this._isEnd = false
            this._isDefaultEnd = false;
            this.showInfo(data, 4, 1, this.onDefalutCallBack.bind(this));
            var size = cc.director.getWinSize();
            this.node.y = size.height * 0.87;
        }
    },

    /**
     *
     */
    showInfo: function (text, speed, repeat, closeCb) {
        this.need_repeat = repeat;
        this.anim_speed = speed;
        this.anim_closeCb = closeCb;
        this.strTTF.string = text;
        var parentNode = this.strTTF.node.parent;
        this.anim_start = parentNode.width / 2;
        this.strTTF.node.x = this.anim_start;
        this.anim_target = this.anim_start - this.strTTF.node.width - parentNode.width;
        this.updateTimer = 0;
        this.animOn = true;
        // this.scheduleOnce(function () {
        //     var show_node = this.showNode;
        //     this.strTTF.string = text;
        //     var selfNode = this.strTTF.node;
        //     var parentNode = selfNode.parent;
        //     selfNode.x = parentNode.width / 2;
        //     var total = selfNode.width + parentNode.width;
        //     var duration = Math.ceil(total / parentNode.width * speed);
        //     var moveBy = cc.moveBy(duration, cc.p(-total, 0));
        //     var singleAct = cc.sequence(
        //         moveBy,
        //         cc.callFunc(function () {
        //             selfNode.x = parentNode.width / 2;
        //         }));
        //     var seq = cc.sequence(
        //         cc.repeat(singleAct, repeat),
        //         cc.callFunc(function () {
        //             show_node.active = false;
        //             closeCb();
        //         }));
        //     selfNode.runAction(seq);
        // });
    },

    turnOn() {
        this._infoArr = [];
        this._isEnd = true;
        this._isDefaultPlay = true;
        this._isDefaultEnd = true;
        this._nDefaultIndex = 0;
        this.isOff = false;
    },

    turnOff() {
        this.isOff = true;
        this.strTTF.node.stopAllActions();
        this.showNode.active = false;
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        //dd.NetWaitUtil.close();
        switch (event) {
            case Hall.HallEvent.Get_PaoMaDeng_Marquee: //获取跑马灯系统消息
                this.onMarquee(data);
                break;
            case Hall.HallEvent.Get_PaoMaDeng_Default_Marquee: //获取跑马灯默认消息
                this.onDefaultMarquee(data);
                break;
            case Hall.HallEvent.TurnOff_Marquee:
                this.turnOff();
                break;
            case Hall.HallEvent.TurnOn_Marquee:
                this.turnOn();
                break;
            case Hall.HallEvent.Get_PaoMoDeng_DL_Marquee: //独立游戏跑马灯消息
                this.showDLInfo(data);
                break;
            default:
                break;
        }
    },

    onClickClose() {
        this.turnOff();
        // let sceneName = cc.dd.SceneManager.getCurrScene().name;
        // if (sceneName != AppConfig.HALL_NAME) {
            this.closeOnce = true;
        // } else {
        //     this.closeOnce = false;
        //     this.turnOn();
        // }
    }
});
