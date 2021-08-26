var jlmj_desk_jbc_data = require( "jlmj_desk_jbc_data" );

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.preRoomType = cc.find("name",this.node).getComponent(cc.Label);
        this.preBaseScore = cc.find("base_score",this.node).getComponent(cc.Label);
        this.initData();
        this.initView();
    },

    initData: function() {
        this.m_strRoomType = "";
        this.m_strBaseScore = "";
    },

    initView: function() {
        var deskDataObject = jlmj_desk_jbc_data.getInstance();

        this.m_strRoomType = deskDataObject.getTitle();
        this.m_strBaseScore = "底分" + deskDataObject.getBaseScore();

        this.preRoomType.string = this.m_strRoomType;
        this.preBaseScore.string = this.m_strBaseScore;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
