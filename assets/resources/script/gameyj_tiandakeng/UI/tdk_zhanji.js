var dd = cc.dd;
var tdk = dd.tdk;
var tdk_ani = require('TDKConstantConf').ANIMATION_TYPE;

var TdkDeskData = require('tdk_desk_data').TdkDeskData.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        integralPre : cc.Prefab, //玩家积分榜
        integral_list :[],

        exitBtnClickCallback : null, //退出按钮点击回调
    },

    // use this for initialization
    onLoad: function () {
        this.showCurrentTime(0);

        var cntLbl = cc.find('bg/gameCnt', this.node);
        var cpt = cntLbl.getComponent(cc.Label);
        cpt.string = '共'+TdkDeskData.gameCnt+'局';

        // this.schedule(this.showCurrentTime, 1);
        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_IN);

        // var shangpai = cc.find('bg/zj_shangpai', this.node);
        // var spAni = shangpai.getComponent(cc.Animation);
        // spAni.play();
    },

    popupInActFinished : function () {
        cc.log('tdk_zhanji::popupInActFinished!');
    },

    popupOutActFinished : function () {
        // this.node.removeFromParent();
        // this.node.destroy();
        cc.log('tdk_zhanji::popupOutActFinished!');

        this.integral_list.forEach(function (item) {
            item.removeFromParent();
            item.destroy();
        });
        this.integral_list.splice(0, this.integral_list.length);
        if(this.exitBtnClickCallback){
            this.exitBtnClickCallback();
        }
    },

    init : function (data) {
        // this.player_list = [
        //     {"nick":"张华雄","id":123456,"hs":2,"bz":2,"lg":2,"score":123},
        //     {"nick":"李华兵","id":123456,"hs":2,"bz":2,"lg":2,"score":123},
        //     {"nick":"王佩","id":123456,"hs":2,"bz":2,"lg":2,"score":123},
        //     {"nick":"朱大海","id":123456,"hs":2,"bz":2,"lg":2,"score":123},
        //     {"nick":"龙华","id":123456,"hs":2,"bz":2,"lg":2,"score":123},
        // ];
        this.player_list = data;
        var highScore = this.getHighestScore();

        var pannelWidth = 1280; //背景寬度
        var integralWidth = 224; //单个玩家积分榜宽度
        var spaceX = 10;

        var playerCnt = this.player_list.length;
        var startPosx = (pannelWidth-integralWidth*playerCnt-(playerCnt-1)*spaceX)/2;
        var self = this;
        this.player_list.forEach(function (item, i) {
            // var prefab = cc.loader.getRes(dd.tdk_resCfg.PREFAB.PRE_INTEGRAL, cc.Prefab);
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_INTEGRAL_V2, cc.Prefab);
            var inte = cc.instantiate(prefab);
            inte.parent = self.node;
            inte.x = startPosx+(2*i+1)*integralWidth/2+i*spaceX-pannelWidth/2;
            self.integral_list.push(inte);
            var cpt = inte.getComponent('tdk_integral');
            cpt.init(item, item.isowner, highScore, function () {
                // var node = cc.find('bg/failed', self.node);
                // node.active = true;
            });
        });
    },

    btnExitClick : function () {
        // tdk.GameData.resetData();

        // this.releaseUi();
        // cc.director.loadScene(tdk.home_scene);

        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_OUT);
    },

    btnShareClick : function () {
        DD.WXApiHandler.SendAppContent("123456", "填大坑", "房间号:123456,不要走,决战到天亮!", 'https://d.alphaqr.com/klbgame');
    },

    //计算最高分
    getHighestScore : function () {
        var arr = new Array();
        for(var i=0; i<this.player_list.length; i++){
            var item = this.player_list[i];
            arr.push(item.score);
        }
        arr.sort(function (a, b) {
            return b-a;
        });
        var maxScore = arr[0];
        cc.log('tdk_zhanji::getHighestScore:arr=', arr);
        return maxScore;
    },

    close : function () {
        if(this.exitBtnClickCallback){
            this.exitBtnClickCallback();
        }
        this.integral_list.forEach(function (item) {
            item.removeFromParent();
            item.destroy();
        });
        this.integral_list.splice(0, this.integral_list.length);

        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_OUT);
    },

    addExitBtnClickListener : function (cb) {
        if(typeof cb == 'function'){
            this.exitBtnClickCallback = cb;
        }else{
            cc.warn('tdk_zhanji::addExitBtnClickListener:cb not function！');
        }
    },

    showCurrentTime : function (dt) {
        var node = cc.find('bg/time', this.node);
        var cpt = node.getComponent(cc.Label);
        var now = new Date();
        var year = now.getFullYear();       
        var month = now.getMonth() + 1;     
        var day = now.getDate();            
        var hh = now.getHours();            
        var mm = now.getMinutes();          
        var ss = now.getSeconds();          
        var clock = year + "-";
        if(month < 10)
            clock += "0";
        clock += month + "-";
        if(day < 10)
            clock += "0";
        clock += day + " ";
        if(hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm + ":";
        if (ss < 10) clock += '0';
        clock += ss;

        cpt.string = clock;
    },

    releaseUi:function () {
        this.integral_list.forEach(function (item) {
            if(item){
                item.removeFromParent();
                item.destroy();
            };
        });

        this.node.removeFromParent();
        this.node.destroy();
    },

    onDestroy : function () {
        this.unschedule(this.showCurrentTime);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
