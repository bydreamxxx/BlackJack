
cc.Class({
    extends: cc.Component,

    properties: {
        txt_name: cc.Label,
        txt_state: cc.Label,
    },

    onLoad: function () {

    },

    setName: function (name) {
        this.txt_name.string = name;
    },

    setState: function (state) {
        this.txt_state.string = state;
    }

});
