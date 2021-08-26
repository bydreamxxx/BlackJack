var jlmj_player_list = require( "jlmj_player_list" );
var jlmj_desk_jbc_data = require( "jlmj_desk_jbc_data" );

cc.Class({
    extends: jlmj_player_list,

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
    },

    // use this for initialization
    onLoad: function () {
        this._super();

    },

    onDestroy: function () {
        this._super();
    },

    initUI: function() {
        if( jlmj_desk_jbc_data.getInstance().getIsReconnect() ) {
            this._super();
        } else {
            this.removeAllPlayer();
        }
    },

        // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
