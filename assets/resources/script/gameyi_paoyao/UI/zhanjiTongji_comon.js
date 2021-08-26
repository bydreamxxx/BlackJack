const FengColor = {
    FU_FENG: cc.color(0, 255, 0),
    ZHENG_FENG: cc.color(255, 0, 0)
};

cc.Class({
    extends: cc.Component,

    properties: {
        nameTTF: cc.Label,  //名字
        headSp: cc.Sprite,//头像
        IDTTF: cc.Label,  //ID
        TTF1: cc.Label,//
        TTF2: cc.Label,
        TTF3: cc.Label,
        TTF4: cc.Label,
        fangzhuNode: cc.Node,//房主
        dayinjiaNode: cc.Node,//大赢家
        allMarkTTF: cc.Label,//总分
        fwFont: [cc.Label],//方位节点 对家 玩家 上家 下家

        lsFont: cc.Font,
        hsFont: cc.Font,
    },
    /**
     * 设置数据
     */
    setData: function (conmondata) {
        this.nameTTF.string = cc.dd.Utils.substr(conmondata.Name, 0, 4);
        this.IDTTF.string = conmondata.UserID;  //ID
        if (this.TTF1)
            this.TTF1.string = conmondata.TTF1;
        if (this.TTF2)
            this.TTF2.string = conmondata.TTF2;
        if (this.TTF3)
            this.TTF3.string = conmondata.TTF3;
        if (this.TTF4)
            this.TTF4.string = conmondata.TTF4;

        this.dayinjiaNode.active = conmondata.Isdayin || false;//大赢家
        this.fangzhuNode.active = conmondata.Owner || false;

        this.fangzhuNode.x = this.nameTTF.node.width + this.nameTTF.node.x;
        if (conmondata.Head.indexOf('.jpg') != -1) {
            let robotUrl = require('Platform').GetRobotUrl();
            cc.dd.SysTools.loadWxheadH5(this.headSp, robotUrl + conmondata.Head);
        }
        else {
            cc.dd.SysTools.loadWxheadH5(this.headSp, conmondata.Head);
        }

        this.allMarkTTF.string = (conmondata.TotalScore == 0 ? '' : (conmondata.TotalScore < 0 ? '-' : '+')) + Math.abs(conmondata.TotalScore);
        this.allMarkTTF.node.color = conmondata.TotalScore <= 0 ? FengColor.FU_FENG : FengColor.ZHENG_FENG;
        //设置方位信息
        this.fwFont[0].node.active = false;
        this.fwFont[1].node.active = false;
        if (conmondata.IsZiJi) {
            this.fwFont[0].node.active = true;
            this.fwFont[1].node.active = false;
        } else {
            this.fwFont[0].node.active = false;
            this.fwFont[1].node.active = true;
            this.fwFont[1].string = conmondata.FangWei;
            if (conmondata.FangWei == "")
                this.fwFont[1].node.parent.active = false;
        }

    },


    /**
     * 设置战绩数据
     * @param name 玩家名字
     * @param userID 玩家Userid
     * @param ttf1 某项数据1
     * @param ttf2 某项数据2
     * @param ttf3 某项数据3
     * @param ttf4 某项数据4
     * @param owner 是否房主
     * @param isdayin 是否是大赢家
     * @param head 玩家头像
     * @param totalscore 总分
     * @param isziji 自己
     * @param fangwei  玩家位置
     */
    getConmonData: function (name, userid, ttf1, ttf2, ttf3, ttf4, owner, isdayin, head, totalscore, isziji, fangwei) {
        var conmondata = {
            Name: name,
            UserID: userid,
            TTF1: ttf1,
            TTF2: ttf2,
            TTF3: ttf3,
            TTF4: ttf4,
            Owner: owner,
            Isdayin: isdayin,
            Head: head,
            TotalScore: totalscore,
            IsZiJi: isziji,
            FangWei: fangwei,
        };

        return conmondata;
    }
});
