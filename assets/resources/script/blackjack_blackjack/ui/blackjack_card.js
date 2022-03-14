// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("com_card"),

    properties: {
        mask: cc.Node,
        isActive: true,
    },

    editor:{
        menu:"BlackJack/blackjack_card"
    },

    init(card, isWaitforFapai){
        this._super(card);

        if(!cc.dd._.isUndefined(isWaitforFapai)){
            if(!isWaitforFapai){
                this.setShow();
            }else{
                this.setHide();
            }
        }
    },

    setHide(){
        this.node.active = false;
        this.isActive = false;
    },

    setShow(){
        this.node.active = true;
        this.isActive = true;
    },

    showMask(){
        this.mask.active = true;

    },

    hideMask(){
        this.mask.active = false;
    }
});
