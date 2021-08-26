var RoomMgr = require('jlmj_room_mgr').RoomMgr;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        statusNode:[cc.Node],//结算状态：是否庄 是否听牌 是否点炮
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    setData:function (data, withoutTing) {
        if( data != null )
        {
            this.statusNode[0].active = data.isBank == true;
            this.statusNode[1].active = withoutTing ? false : data.isting == true && data.isxiaosa != true;
            this.statusNode[2].active = withoutTing ? false : data.isting == false && data.isxiaosa != true;
            // this.statusNode[3].active = data.isdianpao == true;
            // this.statusNode[4].active = data.isxiaosa == true && (RoomMgr.Instance().gameId == cc.dd.Define.GameType.FXMJ_FRIEND || RoomMgr.Instance().gameId == cc.dd.Define.GameType.FXMJ_GOLD);
            // this.statusNode[5].active = data.isMenqing == true;
        }

        // if(!this.statusNode[0].active && !this.statusNode[1].active && !this.statusNode[2].active && !this.statusNode[3].active && !this.statusNode[4].active && !this.statusNode[5].active){
        //     this.node.active = false;
        // }else{
        //     this.node.active = true;
        // }
    },
    // use this for initialization
    onLoad: function () {

    },

    //start () {},

    // update (dt) {},
});
