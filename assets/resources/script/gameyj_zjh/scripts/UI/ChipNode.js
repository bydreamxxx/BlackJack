var chipMovePixPerSeconds = 2000

//筹码显示位置从左至右
var ChipIconType =
    {
        ChipType_One: 1,
        ChipType_Two: 2,
        ChipType_Three: 3,
        ChipType_Four: 4,
        ChipType_Five: 5,
    }

var ChipIconPicture =
    {
        [1]: "gameyj_zjh/textures/common/btn_21_100fama_s",
        [2]: "gameyj_zjh/textures/common/btn_21_2kfama_s",
        [3]: "gameyj_zjh/textures/common/btn_21_10kfama_s",
        [4]: "gameyj_zjh/textures/common/btn_21_100kfama_s",
        [5]: "gameyj_zjh/textures/common/btn_21_1mfama_s",
    }
var ChipValuePicture =
    {
        "5": "zjh_jine15",
        "10": "zjh_jine14",
        "20": "zjh_jine13",
        "50": "zjh_jine12",
        "100": "zjh_jine11",
        "200": "zjh_jine10",
        "500": "zjh_jine9",
        "1000": "zjh_jine8",
        "2000": "zjh_jine7",
        "5000": "zjh_jine6",
        "1万": "zjh_jine5",
        "2万": "zjh_jine4",
        "5万": "zjh_jine3",
        "10万": "zjh_jine2",
        "20万": "zjh_jine1",
    }

var ZhaJinHuaChips =
    {
        [1]: "gameyj_zjh/textures/desk/zjh_chouma1",
        [2]: "gameyj_zjh/textures/desk/zjh_chouma2",
        [3]: "gameyj_zjh/textures/desk/zjh_chouma3",
        [4]: "gameyj_zjh/textures/desk/zjh_chouma4",
        [5]: "gameyj_zjh/textures/desk/zjh_chouma5",
        [6]: "gameyj_zjh/textures/desk/zjh_fangxingchouma",
        [7]: "gameyj_zjh/textures/desk/zjh_fangxingchouma1",
    }
var BezierH = [200, 350];

var CChipNode = cc.Class({
    extends: cc.Node,

    ctor: function () {
        this.m_oChipIcon = null
        this.m_oChipValue = null
        this.m_nValue = 0
        this.m_nIconType = 1
        this.m_bIsFrame = true
    },

    init: function (icontype, value) {
        //cc.SpriteFrameCache:getInstance():addSpriteFrames("Baccarat/111222.plist")


        this.setChipType(icontype)
    },
    valueToSprite: function (value) {
        var str = value + "";
        return ChipValuePicture[str];
    },

    initZJH: function (icontype, value, atlas) {
        // cc.dd.ResLoader.loadFont('wenquan', function (fnt) {
        // this.fontRes = fnt
        this.atlas = atlas
        this.m_bIsFrame = false
        this.m_oSprlabel = new cc.Node()
        this.m_oSprlabel.setPosition(cc.v2(0, 2))
        this.m_label = this.m_oSprlabel.addComponent(cc.Sprite);
        this.m_label.spriteFrame = this.atlas.getSpriteFrame(this.valueToSprite(value))
        
        // this.m_label.font = this.fontRes;
        // this.m_label.fontSize = 20
        // this.m_label.string = (value)

        this.m_sprite = this.addComponent(cc.Sprite);

        // this.m_labelOut = this.m_oSprlabel.addComponent(cc.LabelOutline);
        // this.m_labelOut.color = new cc.Color(114, 71, 29, 255);

        //this.m_oSprlabel.color = new cc.Color(0, 0, 0, 255)

        this.setChipType(icontype)
        this.addChild(this.m_oSprlabel, 10)
        // }.bind(this));
    },

    // create:function(icontype,value){
    //     var chipnode = new CChipNode()
    //     chipnode.init(icontype,value)
    //     return chipnode
    // },

    createZJH: function (icontype, value, atlas) {
        var chipnode = new CChipNode()
        chipnode.initZJH(icontype, value, atlas)
        return chipnode
    },

    setChipType: function (icontype) {
        this.m_nIconType = icontype
        if (this.m_bIsFrame) {
            this.setSpriteFrame(ChipIconPicture[this.m_nIconType])
        } else {
            cc.dd.ResLoader.loadTextureFrame(ZhaJinHuaChips[this.m_nIconType], function (fnt) {
                this.m_sprite.spriteFrame = fnt
            }.bind(this));
        }
        // if (icontype >= 6 && this.m_oSprlabel) {
        //     this.m_labelOut.color = new cc.Color(0x6f, 0x3b, 0x08, 0xff)
        //     this.m_oSprlabel.color = new cc.Color(0xff, 0xcc, 0x30, 0xff)
        // }
    },

    setChipValue: function (value) {
        this.m_nValue = value
        if (this.m_bIsFrame == false) {
            //this.m_oSprlabel:string = (value)
            this.m_label.string = (value)
        }
    },

    getIocnType: function () {
        return this.m_nIconType
    },

    getChipValue: function () {
        return this.m_nValue
    },

    //默认贝赛尔曲线
    move: function (epos, isBezier) {
        var point = cc.v2(this.getPosition())
        var time = point.sub(epos).mag() / chipMovePixPerSeconds
        var action = null
        if (isBezier == false) {
            action = cc.moveTo(time, epos)
        } else {
            action = cc.bezierTo(time, [point, cc.v2(point.x + (epos.x - point.x) / 4, point.y + math.random(BezierH[1], BezierH[2])), epos])
        }
        this.runAction(action)
    },

    moveRemove: function (epos) {
        var point = cc.v2(this.getPosition())
        var time = point.sub(epos).mag() / chipMovePixPerSeconds
        var moveaction = cc.moveTo(time, epos)
        var delay = cc.delayTime(time)
        var func = cc.callFunc(function (sender) {
            sender.active = false
            sender.removeFromParent(true)
        })
        this.stopAllActions()
        this.runAction(cc.sequence(moveaction, delay, func))
    },


    //todo 如果内存消耗渐涨，可以在这里最有调用destroy
    moveGatherRemove: function (gatherpos, epos) {
        var point = cc.v2(this.getPosition())
        var subpos = gatherpos.sub(point)
        gatherpos = cc.v2(gatherpos.x - subpos.x * 0.5, gatherpos.y - subpos.y * 0.5)
        var gathertime = point.sub(gatherpos).mag() / chipMovePixPerSeconds
        var gatheraction = cc.moveTo(gathertime + 0.2, gatherpos)
        var time = gatherpos.sub(epos).mag() / chipMovePixPerSeconds
        var moveaction = cc.moveTo(time, epos)
        var gatherdelay = cc.delayTime(gathertime + 0.3)
        var delay = cc.delayTime(time)
        var func = cc.callFunc(function (sender) {
            sender.active = false
            sender.removeFromParent(true)
        })
        this.stopAllActions()
        this.runAction(cc.sequence(gatheraction, gatherdelay, moveaction, delay, func))
    },

});
module.exports = CChipNode;
//endregion
