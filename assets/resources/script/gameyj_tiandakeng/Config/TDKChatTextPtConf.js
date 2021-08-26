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
        /**
         * 5人聊天框位置
         */
        five_player_chat_text_pt_list: [cc.v2],
        /**
         * 4人聊天框位置
         */
        four_player_chat_text_pt_list: [cc.v2],
        /**
         * 3人聊天框位置
         */
        three_player_chat_text_pt_list: [cc.v2],
    },

    // use this for initialization
    onLoad: function () {
        cc.log('TDKChatTextPtConf::onLoad!');
    },

    /**
     * 返回玩家聊天文字框位置
     * @param cnt 玩家个数
     * @param idx 索引
     */
    getPt:function (cnt, idx) {
        if(3 == cnt){
            return (this.three_player_chat_text_pt_list[idx]);
        }else if(4 == cnt){
            return (this.four_player_chat_text_pt_list[idx]);
        }else if(5 == cnt){
            return (this.five_player_chat_text_pt_list[idx]);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
