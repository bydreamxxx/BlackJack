var PlayerHead = cc.Class({
    extends: require('base_mj_playerHead'),

    properties: {
        paofen: [cc.SpriteFrame],
    },

    onLoad: function () {
        this._super();
        this.playerName = cc.find('head_node/name', this.node).getComponent(cc.Label);
        this.bankerPos = this.banker.position;
        this.tingPaiSprite = cc.find('head_node/ting/sprite', this.node).getComponent(cc.Sprite);
        this.ypufen = cc.find('head_node/ypfen', this.node);
        this.ypufen.active = false;
    },


    initUI: function (player) {
        this._super(player);

        this.playerName.string = cc.dd.Utils.subChineseStr(player.nickname, 0, 8);

        if(!cc.dd._.isUndefined(player.isbanker) && !player.bready){
            if(player.isbanker){
                this.banker.active = player.isbanker;

                this.banker.stopAllActions();
                let pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
                let targetPos = this.banker.parent.convertToNodeSpaceAR(pos);
                this.banker.setPosition(targetPos);
                this.banker.scaleX = 1;
                this.banker.scaleY = 1;
                this.banker.runAction(cc.sequence(
                    cc.scaleTo(0.3, 1.5, 1.5),
                    cc.scaleTo(0.2, 1, 1),
                    cc.moveTo(1, this.bankerPos).easing(cc.easeQuadraticActionIn()),
                    cc.repeat(
                        cc.sequence(
                            cc.scaleTo(0.3, -1, 1),
                            cc.scaleTo(0.3, 1, 1)
                        ), 2),
                    cc.scaleTo(0.5, 0.4, 1).easing(cc.easeQuadraticActionOut()),
                    cc.scaleTo(0.5, 1, 1),
                ))
            }else{
                this.banker.active = player.isbanker;
            }
        }

        if(cc.dd._.isNumber(player.paofen)){
            this.showPaoFen(player.paofen)
        }else{
            this.tingPai.active = false;
        }
    },

    clear:function () {
        this._super();
        if(this.notFriend()){
            this.playerName.string = '';
        }
    },

    showPaoFen(score){
        this.tingPai.active = true;
        this.ypufen.active = false;

        switch(score){
            case 2:
                this.tingPaiSprite.spriteFrame = this.paofen[0];
                break;
            case 3:
                this.tingPaiSprite.spriteFrame = this.paofen[1];
                break;
            case 4:
                this.tingPaiSprite.spriteFrame = this.paofen[2];
                break;
            case 5:
                this.tingPaiSprite.spriteFrame = this.paofen[3];
                break;
            case -3:
                this.tingPai.active = false;
                this.ypufen.active = true;
                break;
            default:
                this.tingPai.active = false;
                break;
        }
    },

    getHeadWidth(){
        return 37.9;
    },

    getHeadHeight(){
        return 37.9;
    },

    notFriend:function () {
        var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr.Instance();
        return RoomMgr.gameId != cc.dd.Define.GameType.WDMJ_FRIEND;
    },

    initMJConfig(){
        return require('mjConfigValue').nmmj;
    },

    initMJComponet(){
        return require("mjComponentValue").wdmj;
    }
});

module.exports = PlayerHead;
