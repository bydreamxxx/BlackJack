//create by wj 2019/09/09
const size = cc.view.getVisibleSize();
const FishType = require('DoyenFishType');
const itemcfg = require('item');
const g_BulletSpeed = 1000;
const g_BulletSize = 20;
const g_BulletPoolRect = cc.rect(0, 0,
    cc.winSize.width - g_BulletSize * 2, cc.winSize.height - g_BulletSize * 2);
g_BulletPoolRect.center = cc.v2(0, 0);
function isCollision(circle, rect) {
    var unrotatedCircleX = Math.cos(rect.angle) * (circle.x - rect.x) - Math.sin(rect.angle) * (circle.y - rect.y) + rect.x;
    var unrotatedCircleY = Math.sin(rect.angle) * (circle.x - rect.x) + Math.cos(rect.angle) * (circle.y - rect.y) + rect.y; // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
    var closestX, closestY; // Find the unrotated closest x point from center of unrotated circle
    var xL = rect.x - (rect.width >> 1)
    var xR = rect.x + (rect.width >> 1)
    if (unrotatedCircleX < xL)
        closestX = xL;
    else if (unrotatedCircleX > xR)
        closestX = xR;
    else
        closestX = unrotatedCircleX; // Find the unrotated closest y point from center of unrotated circle

    var yD = rect.y - (rect.height >> 1)
    var yT = rect.y + (rect.height >> 1)
    if (unrotatedCircleY < yD)
        closestY = yD;
    else if (unrotatedCircleY > yT)
        closestY = yT;
    else
        closestY = unrotatedCircleY; // Determine collision
    var collision = false;
    var distance = findDistance(unrotatedCircleX, unrotatedCircleY, closestX, closestY);
    if (distance < circle.radius)
        collision = true; // Collision
    else
        collision = false;

    return collision
}

function findDistance(fromX, fromY, toX, toY) {
    var a = Math.abs(fromX - toX);
    var b = Math.abs(fromY - toY);
    return Math.sqrt((a * a) + (b * b));
}

var CBullet = cc.Class({
    statics: {
        createBullet: function (bulletID, startPos, dir, lockFishID, siteIndex, bEnergy, buffID, gunDataID) {
            var bullet = new CBullet;
            bullet.setInfo(bulletID, startPos, dir, lockFishID, siteIndex, bEnergy, buffID, gunDataID);
            bullet.node.zIndex = FishType.ZorderInPool.bullet;
            return bullet
        },
    },
    ctor: function () {
        this.m_bulletID = 0  //子弹id
        this.m_playerSite = 0  //玩家座位索引
        this.m_moveTime = 0 //移动时间
        this.m_fCurStartTime = 0.0
        this.m_fCurEndTime = 0.0
        this.m_startPos = cc.v2(0, 0) //开始位置
        this.m_facePos = cc.v2(0, 1) //朝向
        this.m_bEnergy = false;  //能量弹
        this.m_bInit = false
        this.m_nLockFishID = -1 //锁定鱼的id
        this.node = new cc.Node();
        this.gFishMgr = require('FishDoyenManager').FishManager.Instance();
        this.playerManager = require('FishDoyenPlayerManager').CFishPlayerManager.Instance();
    },

    setInfo: function (bulletID, startPos, dir, lockFishID, siteIndex, bEnergy, buffID, gunDataID) {//设置子弹基本信息
        this.m_bulletID = bulletID;  //设置子弹id
        this.m_nLockFishID = lockFishID; //设置锁定鱼的id
        this.m_playerSite = siteIndex; //设置位置索引
        this.m_buffID = buffID; //设置buff
        this.m_bEnergy = bEnergy; //能量弹标志
        this.m_gunDataID = gunDataID
        var startSpeed = cc.v2(Math.cos(dir), Math.sin(dir)); //将方向弧度，转换为向量

        this.node.setPosition(startPos.add(startSpeed.mul(40))); //设置节点新的位置
        this.setBulletImage(bEnergy, buffID); //设置子弹资源图片

        this.m_oBallBody = this.node.addComponent(cc.RigidBody); //绑定刚体
        this.setSpeed(startSpeed);

        // this.node.addComponent('doyen_circle_collider_check');

        this.node.setAnchorPoint(cc.v2(0.5, 0.5)); //设置子弹中心锚点
        this.node._tag = bulletID; //将子弹id与节点绑定
        this.node.group = 'bullet';
    },

    setBulletImage: function (bEnergy, buffID) { //设置子弹资源图片
        var bulletImage = this.node.addComponent(cc.Sprite);
        cc.dd.ResLoader.loadAtlas('gameyj_fish_doyen/atlas/p_buyu_classic_power', function (atals) {
            var bulletImageSprite = null;

            var itemCfg = itemcfg.getItem(function (element) {
                if (element.key == this.m_gunDataID)
                    return true;
            }.bind(this));
            bulletImageSprite = atals.getSpriteFrame(itemCfg.effect);

            bulletImage.spriteFrame = bulletImageSprite;

            this.node.width = bulletImageSprite.getRect().width;
            this.node.height = bulletImageSprite.getRect().height;

            // var oCircleCollider = this.node.addComponent(cc.CircleCollider);
            var radius = this.node.width > this.node.height ? this.node.width / 2 : this.node.height / 2; //设置圆形碰撞半径
            this.node.radius = radius * FishType.Bullet_off_radius;
            //飞镖要转
            if (10059 == this.m_gunDataID || 10058 == this.m_gunDataID) {
                this.node.runAction(cc.repeatForever(cc.rotateBy(0.5, 360)));
            }
        }.bind(this));
    },

    setSpeed: function (speed) {
        var offset = speed.normalize(); //获得速度值的一个标准量
        this.speed = offset.mul(g_BulletSpeed); //缩放向量，生成新的速度向量

        // if(gFishMgr.m_bFlip){
        //     this.m_oBallBody.linearVelocity = cc.v2(-this.speed.x, -this.speed.y); //设置刚体速度
        // }else{
        this.m_oBallBody.linearVelocity = this.speed;
        //}
        var angel = 90 - (Math.atan2(speed.y, speed.x) * (180 / Math.PI)); //获取旋转角
        this.node.rotation = angel; //子弹旋转
    },

    update: function (dt) {
        this.m_bInit = true;
        var posX = this.node.x; //当前子弹x坐标
        var posY = this.node.y; //当前子弹y坐标

        if (posX < this.node.parent.x - this.node.parent.width / 2) {
            this.speed.x = Math.abs(this.speed.x);
            this.onHitBox();
        } else if (posX > this.node.parent.x + this.node.parent.width / 2) {
            this.speed.x = -Math.abs(this.speed.x);
            this.onHitBox();
        } else if (posY < this.node.parent.y - this.node.parent.height / 2) {
            this.speed.y = Math.abs(this.speed.y);
            this.onHitBox();
        } else if (posY > this.node.parent.y + this.node.parent.height / 2) {
            this.speed.y = -Math.abs(this.speed.y);
            this.onHitBox();
        }

        this.node.setPosition(cc.v2((posX + this.speed.x * dt), (posY + this.speed.y * dt)));

        var fishes = this.gFishMgr.m_tFishObj
        for (var i = 0; i < fishes.length; i++) {
            if (this.node.width == 0 || this.node.parent == null)
                break;

            var colliders = fishes[i].m_oCollider.childrenCount
            for (var j = 0; j < colliders; j++) {
                var coll = fishes[i].m_oCollider.children[j];
                var fishStruct = {}
                fishStruct.x = this.playerManager.m_bFilp ? -fishes[i].node.x : fishes[i].node.x
                fishStruct.y = this.playerManager.m_bFilp ? -fishes[i].node.y : fishes[i].node.y
                fishStruct.width = coll.width
                fishStruct.height = coll.height

                fishStruct.x += coll.x
                fishStruct.y += coll.y
                fishStruct.angle = fishes[i].m_moveNode.rotation + coll.rotation;//this.playerManager.m_bFilp?(fishes[i].m_moveNode.rotation-180):fishes[i].m_moveNode.rotation
                if (isCollision(this.node, fishStruct)) {
                    this.gFishMgr.onBulletHitFish(this.m_bulletID, fishes[i].m_fishID);
                    break;
                }
            }

        }
    },

    onHitBox: function () {
        this.setSpeed(this.speed);
    },

    onDestory: function () { //自动消失
        var netPos = this.node.getPosition(); //获取子弹当前位置

        var netNode = this.gFishMgr.getMainUI().createFishNetEffect(netPos, this.m_gunDataID);
        // this.playAudio(7009, false);
        var angel = this.node.getRotation();//旋转角度
        netNode.setRotation(angel);//设置网的旋转角度

        this.node.removeFromParent(true);

    },

    //播放相应音效
    // playAudio: function(audioId, isloop){
    //     return AudioManager.playSound(FishType.fishAuidoPath + audioId + '', isloop);
    // },
});

module.exports = {
    CBullet: CBullet
};
