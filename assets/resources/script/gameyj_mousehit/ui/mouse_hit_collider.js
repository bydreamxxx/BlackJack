
cc.Class({
    extends: cc.Component,

    editor: {

    },

    properties: {
        // _isCollider: false
    },

    onLoad() {
        var colliderManager = cc.director.getCollisionManager();
        colliderManager.enabled = true;
        colliderManager.enabledDebugDraw = true;
    },

    start() {
        
    },

    onCollisionEnter(other, self) {
        console.log('on collision enter');
        console.log(other, self)
    },

    onCollisionExit(other, self) {
        console.log('on collision exit');
        console.log(other, self)
    },

   
    // update (dt) {},
});