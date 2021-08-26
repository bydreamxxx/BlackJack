const FengColor = {
    FU_FENG: cc.color( 0, 255, 0 ),
    ZHENG_FENG: cc.color( 255, 0, 0 )
};
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        nameTTF:cc.Label,  //名字
        headSp:cc.Sprite,//头像
        IDTTF:cc.Label,  //ID
        hupaiTTF:cc.Label,//胡牌
        mobaoTTF:cc.Label,//摸宝
        dianpaoTTF:cc.Label,//点炮
        lianzhuangTTF:cc.Label,//连庄
        fangzhuNode:cc.Node,//房主
        dayinjiaNode:cc.Node,//大赢家
        paoshouNode:cc.Node,//最佳炮手
        allMarkTTF: cc.Label,//总分
        fwFont:[cc.Label],//方位节点 对家 玩家 上家 下家

        lsFont:cc.Font,
        hsFont:cc.Font,
    },
    /**
     * 设置数据
     */
    setData:function (userInfo, isdayin, isPaoShou) {

        this.nameTTF.string = cc.dd.Utils.subChineseStr(userInfo.username, 0 , 8);
        this.IDTTF.string = userInfo.userid ;  //ID
        this.hupaiTTF.string = userInfo.wincount;//胡牌
        this.mobaoTTF.string = userInfo.mobaocount;//摸宝
        this.dianpaoTTF.string = userInfo.dianpaocount;//点炮
        this.lianzhuangTTF.string = userInfo.lianzhuangcount;//连庄

        this.dayinjiaNode.active = isdayin || false;//大赢家
        this.fangzhuNode.active = userInfo.owner || false;

        if (userInfo.uinfo.head.indexOf('.jpg') != -1) {
            let robotUrl = require('Platform').GetRobotUrl();
            cc.dd.SysTools.loadWxheadH5(this.headSp, robotUrl+userInfo.uinfo.head);
        }
        else {
            cc.dd.SysTools.loadWxheadH5(this.headSp, userInfo.uinfo.head, userInfo.uinfo.sex);
        }

        // if(RoomMgr.Instance().isUseNeiMengMJConfig()){
            if(this.paoshouNode){
                this.paoshouNode.active = isPaoShou || false;
            }
            this.allMarkTTF.string = (userInfo.totalscore==0?'':'/')+Math.abs(userInfo.totalscore);

            if(userInfo.totalscore < 0){
                this.allMarkTTF.font = this.lsFont;
            }else{
                this.allMarkTTF.font = this.hsFont;
            }
        // }else{
        //     this.fangzhuNode.x = this.nameTTF.node.width + this.nameTTF.node.x;
        //
        //     this.allMarkTTF.string = (userInfo.totalscore==0?'':(userInfo.totalscore<0?'-':'+'))+Math.abs(userInfo.totalscore);
        //     this.allMarkTTF.node.setColor(userInfo.totalscore<=0?FengColor.FU_FENG:FengColor.ZHENG_FENG);
        // }


        //设置方位信息
        if(userInfo.uinfo.ziji){
            this.fwFont[0].node.active = true;
            this.fwFont[1].node.active = false;
            this.fwFont[0].string = userInfo.uinfo.fangwei;
        }else{
            this.fwFont[0].node.active = false;
            this.fwFont[1].node.active = true;
            this.fwFont[1].string = userInfo.uinfo.fangwei;
        }

        this.mobaoTTF.node.active = RoomMgr.Instance().gameId != cc.dd.Define.GameType.FXMJ_FRIEND && !RoomMgr.Instance().isChiFengMJ() && !RoomMgr.Instance().isAoHanMJ() && !RoomMgr.Instance().isWuDanMJ() && !RoomMgr.Instance().isPingZhuangMJ();

        if(RoomMgr.Instance().gameId == cc.dd.Define.GameType.XLMJ_FRIEND || RoomMgr.Instance().gameId == cc.dd.Define.GameType.XZMJ_FRIEND){
            cc.find('ttf', this.mobaoTTF.node).getComponent(cc.Label).string = '自摸:';
        }
    },
});
