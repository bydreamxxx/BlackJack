// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,

        skins: [sp.SkeletonData]
    },

    editor:{
        menu:"通用/荷官"
    },

    onLoad(){
        this.index = 0;
        this.spine.skeletonData = this.skins[this.index];
        this.spine.setAnimation(0, 'daiji', true);
    },

    playSpine(anim){
        // this.spine.setMix(this.spine.animation, anim, 1);
        // this.spine.setMix(anim, 'daiji', 1);
        this.spine.setAnimation(0, anim, false);
        this.spine.setCompleteListener(()=>{
            this.spine.setAnimation(0, 'daiji', true);
        });
    },

    playeEffect(){
        this.playSpine('effect');
    },

    playFeiwen(){
        this.playSpine('feiwen');
    },
    playKaixin(){
        this.playSpine('kaixin');
    },
    playShuohua(){
        this.playSpine('shuohua');
    },
    playYihan(){
        this.playSpine('yihan');
    },
    playZhayan(){
        this.playSpine('zhayan');
    },

    onClickButton(){
        this.index++;
        if(this.index >= this.skins.length){
            this.index = 0;
        }
        this.spine.skeletonData = this.skins[this.index];
        this.spine.setAnimation(0, 'daiji', true);
    },
});
