var PlayerBaseInfoMgr = require('hall_common_data').PlayerBaseInfoMgr.getInstance();

var PlayerHead = cc.Class({
    extends: require('base_mj_playerHead'),

    properties:{
        tingSpriteFrames: [cc.SpriteFrame],
    },

    onLoad: function () {
        this._super();
        this.huPai = cc.find('head_node/tingLayout/hu', this.node);
        this.tingPai = cc.find('head_node/tingLayout/ting', this.node);
        this.qingPai = cc.find('head_node/tingLayout/qing', this.node);

        this.tingPaiNode = cc.find('head_node/tingLayout', this.node);
        this.huangzhuang = cc.find('head_node/huangzhuang', this.node);

        if(!this.huangzhuang){
            this.huangzhuang = cc.find('head_node/layer/huangzhuang', this.node);
        }

        if(!this.gps_warn){
            this.gps_warn = cc.find('head_node/layer/img_gps', this.node);
        }
    },

    clear(){
        this._super();
        this.huangzhuang.active = false;
    },

    initUI: function (player) {
        this.player = player;
        this.head.node.active = true;
        cc.log('头像UI 初始化 视觉座位号:'+player.viewIdx);
        var coin = player.coin;
        this.coin.string = cc.dd.Utils.getNumToWordTransform(coin);
        this.curr_coin = player.coin;
        if (player.headUrl.indexOf('.jpg') != -1) {
            cc.log("加载机器人头像");
            let robotUrl = require('Platform').GetRobotUrl();
            cc.dd.SysTools.loadWxheadH5(this.head, robotUrl+player.headUrl);
        }
        else {
            cc.log("加载玩家头像");
            // if(player.headUrl){
            //     cc.log("玩家头像获取成功-->"+player.headUrl);
            cc.dd.SysTools.loadWxheadH5(this.head, player.headUrl, player.sex);
            // }else{
            //     cc.log("玩家头像获取失败-->"+player.headUrl);
            //     this.head.spriteFrame = this.tx_img;
            // }
        }


        this.lixianNode.active = !player.isOnLine;

        this.read.active = player.bready == 1;
        if(!cc.dd._.isUndefined(player.isbanker) && !player.bready){
            this.banker.active = player.isbanker;
        }

        this.tingPai.getComponent(cc.Sprite).spriteFrame = null;
        this.huPai.getComponent(cc.Sprite).spriteFrame = null;
        this.qingPai.getComponent(cc.Sprite).spriteFrame = null;
        this.tingPai.active = false;
        this.huPai.active = false;
        this.qingPai.active = false;
        this.tingPaiNode.active = player.isBaoTing;

        if(!cc.dd._.isUndefined(player.isXiaosa) && this.xiaosaPai){
            this.xiaosaPai.active = player.isXiaosa;
        }

        var playerInfo = PlayerBaseInfoMgr.findPlayerInfoById(player.userId);
        if(playerInfo && playerInfo.info && playerInfo.info.vipLevel > 0){
            cc.find('head_node/vip_head', this.node).active = true;
            cc.find('head_node/vip_head/level', this.node).getComponent(cc.Label).string = playerInfo.info.vipLevel;
        }

        this.huangzhuang.active = false;
    },

    /**
     * 设置听牌
     */
    setTing:function (isT) {
        this.tingPai.getComponent(cc.Sprite).spriteFrame = null;
        this.huPai.getComponent(cc.Sprite).spriteFrame = null;
        this.qingPai.getComponent(cc.Sprite).spriteFrame = null;
        this.tingPai.active = false;
        this.huPai.active = false;
        this.qingPai.active = false;

        this.tingPaiNode.active = isT;
    },

    setTingSprite(hutype){
        if(hutype.indexOf(9) != -1){//门清
            this.tingPai.getComponent(cc.Sprite).spriteFrame = this.tingSpriteFrames[1];
        }else{
            this.tingPai.getComponent(cc.Sprite).spriteFrame = this.tingSpriteFrames[0];
        }
        this.tingPai.active = true;
        if(hutype.indexOf(32) != -1) {//纯清风
            this.qingPai.getComponent(cc.Sprite).spriteFrame = this.tingSpriteFrames[8];
            this.qingPai.active = true;
        }else if(hutype.indexOf(14) != -1){//清一色
            this.qingPai.getComponent(cc.Sprite).spriteFrame = this.tingSpriteFrames[6];
            this.qingPai.active = true;
        }else if(hutype.indexOf(31) != -1){//混一色
            this.qingPai.getComponent(cc.Sprite).spriteFrame = this.tingSpriteFrames[7];
            this.qingPai.active = true;
        }else{
            this.qingPai.active = false;
        }

        if(hutype.indexOf(7) != -1){//飘胡
            this.huPai.getComponent(cc.Sprite).spriteFrame = this.tingSpriteFrames[3];
        }else if(hutype.indexOf(10) != -1){//七对
            this.huPai.getComponent(cc.Sprite).spriteFrame = this.tingSpriteFrames[4];
        }else if(hutype.indexOf(11) != -1){//豪七
            this.huPai.getComponent(cc.Sprite).spriteFrame = this.tingSpriteFrames[5];
        }else{
            this.huPai.getComponent(cc.Sprite).spriteFrame = this.tingSpriteFrames[2];
        }
        this.huPai.active = true;
    },

    setHuangZhuang(isHuangZhuang){
        this.huangzhuang.active = isHuangZhuang && this.banker.active;
    },

    notFriend:function () {
        var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr.Instance();
        return RoomMgr.gameId != cc.dd.Define.GameType.HLMJ_FRIEND;
    },

    initMJComponet(){
        return require("mjComponentValue").hlmj;
    }
});

module.exports = PlayerHead;
