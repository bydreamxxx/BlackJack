var dd = cc.dd;
var pai3d_value = require("jlmj_pai3d_value");
var DeskData = require('jlmj_desk_data').DeskData;

var option_type = cc.Enum({
    CHI:        0,
    GANG:       1,
    BUGANG:     2,
});

var PaiOption = cc.Class({
    extends: cc.Component,

    properties: {
        values: { default: [], type: [cc.Sprite], tooltip: "麻将值" },

        /**
         * type
         */
        _type: 0,
        type:{ get: function () {return this._type;}, set: function (value) {this._type = value;} },

        /**
         * ids
         */
        _ids: [],
        ids:{ get: function () {return this._ids;}, set: function (value) {this._ids = value;} },

        /**
         * 杠 centerId
         */
        _gangCenterId: 0,
        gangCenterId:{ get: function () {return this._gangCenterId;}, set: function (value) {this._gangCenterId = value;} },
    },

    // use this for initialization
    onLoad: function () {
        var res_pai = cc.find('Canvas/mj_res_pai');
        if(!res_pai){
            return;
        }

        this.atlas = res_pai.getComponent('mj_res_pai').majiangpai_new;
    },

    setValues: function (values) {
        var res_pai = cc.find('Canvas/mj_res_pai');
        if(!res_pai){
            return;
        }
        this.atlas = res_pai.getComponent('mj_res_pai').majiangpai_new;

        this.values.forEach(function (sprite,idx) {
            sprite.spriteFrame = this.atlas.getSpriteFrame(pai3d_value.spriteFrame["_"+values[idx]]);
        },this);
        this.ids = values;
    },

    onClickOption: function (event,custom) {
        if( event.type != "touchend" ){
            return;
        }

        switch (this._type){
            case option_type.CHI:
                var msg = new cc.pb.jilinmajiang.p17_req_chi();

                var card = new cc.pb.jilinmajiang.CardInfo();
                card.setId(DeskData.Instance().last_chupai_id);

                var card_option = [];
                this.ids.forEach(function (id) {
                    var card = new cc.pb.jilinmajiang.CardInfo();
                    card.setId(id);
                    card_option.push(card);
                });

                msg.setUserid(dd.user.id);
                msg.setChicard(card);
                msg.setChoosecardsList(card_option);
                cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_chi,msg,"p17_req_chi");
                cc.dd.NetWaitUtil.net_wait_start();
                break;
            case option_type.GANG:
                var msg = new cc.pb.jilinmajiang.p17_req_game_act_gang();

                var cards = [];
                this.ids.forEach(function (id) {
                    var card = new cc.pb.jilinmajiang.CardInfo();
                    card.setId(id);
                    cards.push(card);
                });

                msg.setUserid(dd.user.id);
                // msg.setGangcard(gangCard);
                msg.setChoosecardsList(cards);
                cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_game_act_gang,msg,"p17_req_game_act_gang");
                cc.dd.NetWaitUtil.net_wait_start();
                break;
            case option_type.BUGANG:
                var msg = new cc.pb.jilinmajiang.p17_req_game_act_bugang();

                var gangCard = new cc.pb.jilinmajiang.CardInfo();
                gangCard.setId(this.gangCenterId);

                var cards = [];
                this.ids.forEach(function (id) {
                    var card = new cc.pb.jilinmajiang.CardInfo();
                    card.setId(id);
                    cards.push(card);
                });

                msg.setUserid(dd.user.id);
                msg.setBugangcard(gangCard);
                msg.setChoosecardsList(cards);
                cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_game_act_bugang,msg,"p17_req_game_act_bugang");
                break;
            default:
                break;
        }
    },
});

module.exports = {
    PaiOption:PaiOption,
    option_type:option_type,
};
