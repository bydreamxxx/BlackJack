//create by wj 2019/12/23

cc.Class({
    extends: cc.Component,

    properties: {
        m_olightningNode : {default: [], type: cc.Node},
        m_nTimer: 0,
    },
    update (dt) {
        this.m_nTimer += dt;
        if(this.m_nTimer >= 1.2){
            this.showLightning();
            this.m_nTimer = 0;
        }
    },

    showLightning: function(){
        for(var k = 0; k < this.m_olightningNode.length; k++)
            this.m_olightningNode[k].active = false;

        var count = parseInt(Math.random() *(6 -5 + 1) + 5, 10);
        for(var i = 0; i < count; i++){
            var index = parseInt(Math.random() *(8 - 1 + 1) + 1, 10);
            this.m_olightningNode[index - 1].active = true;
            var index1 = parseInt(Math.random() *(16 - 9 + 1) + 9, 10);
            this.m_olightningNode[index1 - 1].active = true;
        }
    },
});
