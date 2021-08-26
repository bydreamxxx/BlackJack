cc.Class({
    extends: cc.Component,
    properties: {

    },
    spawnBullets(name, msg) {
        let text = cc.find('message', this.node)
        text.getComponent(cc.Label).string = name + ':  ' + msg;
        this.node.x = cc.winSize.width / 2;
        // text.color = this.randomColor();
        this.node.speed = this.randomSpeed();
        this.node.y = this.randomStartPosY();
    },
    spawnEmoji(name, id) {

        let text = cc.find('label', this.node)
        this.node.x = cc.winSize.width / 2 + 80;
        this.node.speed = this.randomSpeed();
        this.node.y = this.randomStartPosY();
        text.getComponent(cc.Label).string = name + ':';
        // text.color = this.randomColor();
        let anim = cc.find('emoji', this.node).getComponent(cc.Animation)
        anim.getComponent(cc.Animation).play("em" + (id - 1));
    },
    randomColor() {
        // 文本颜色随机
        let red = Math.round(Math.random() * 255);
        let green = Math.round(Math.random() * 255);
        let blue = Math.round(Math.random() * 255);
        return new cc.Color(red, green, blue);
    },
    randomSpeed() {
        // 移动速度随机
        let speed = Math.round(Math.random() * 300) + 100;
        return speed;
    },
    randomStartPosY() {
        // 初始y坐标随机
        let height = cc.winSize.height;
        let y = Math.round(Math.random() * height * 0.2) + height * 0.2;
        return y;
    },
    update(dt) {
        this.node.x -= dt * this.node.speed;
        if (this.node.x <= -(cc.winSize.width / 2 + this.node.width)) {
            this.node.removeFromParent(true);
        }
    },
});
