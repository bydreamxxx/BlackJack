let BlackJackEvent = cc.Enum({

});

let BlackJackED = new cc.dd.EventDispatcher();

let BlackJackData = cc.Class({
    s_data: null,
    statics: {
        Instance() {
            if (!this.s_data) {
                this.s_data = new BlackJackData();
            }
            return this.s_data;
        },

        Destroy() {
            if (this.s_data) {
                this.s_data.clear();
                this.s_data = null;
            }
        }
    },

    ctor() {

    },
});

module.exports = {
    BlackJackEvent: BlackJackEvent,
    BlackJackED: BlackJackED,
    BlackJackData: BlackJackData,
};
